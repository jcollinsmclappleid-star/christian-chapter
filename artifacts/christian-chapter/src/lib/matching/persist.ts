import { and, desc, eq, inArray, ne, or } from "drizzle-orm";
import {
  db,
  activityEvents,
  interests,
  introductions,
  matches,
  memberBlocks,
  memberPhotos,
  memberProfiles,
  memberReports,
  recommendationSnapshots,
  users,
} from "@/db";
import { writeAudit } from "@/lib/audit";
import { OPENING_OFFER_ENDS_ISO } from "@/lib/site-config";
import { isBrowsingPrivately } from "@/lib/profile/private-browsing";
import { notifyNewIntroduction } from "@/lib/profile/notices";
import { openConversation } from "@/lib/chat/open";
import { recordNamedProfileView } from "@/lib/profile/views";
import { isFeatureEnabled } from "@/lib/platform/features";
import { HAND_PICK_POOL, handPickBlockers, handPickedStillOpen } from "./hand-pick";
import { publicProfileView } from "@/lib/profile/preview";
import { enqueueJob } from "@/lib/jobs/queue";
import { transitionActivity, publicActivityLabel } from "./activity";
import { resolveNow, addDays } from "./clock";
import {
  applyInterestAction,
  orderedPair,
  publicInterestState,
  reciprocalCreatesMatch,
  saveExpired,
} from "./connections";
import {
  alignmentLabelText,
  buildIntroductionSet,
  candidateExclusions,
  parseEssentials,
  poolLabel,
  preferenceHash,
  viewerEligibility,
} from "./engine";
import {
  MATCHING_RULES_VERSION,
  SNAPSHOT_DAYS,
  type InterestKind,
  type MatchableProfile,
  type MatchContext,
} from "./types";

function asMatchable(
  user: typeof users.$inferSelect,
  profile: typeof memberProfiles.$inferSelect,
): MatchableProfile {
  return {
    userId: user.id,
    userStatus: user.status,
    emailVerified: Boolean(user.emailVerifiedAt),
    profileStatus: profile.status,
    activityState: profile.activityState,
    lastActiveAt: user.lastActiveAt,
    firstName: profile.firstName,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    seekingGender: profile.seekingGender,
    ageRangeMin: profile.ageRangeMin,
    ageRangeMax: profile.ageRangeMax,
    tradition: profile.tradition,
    churchAttendance: profile.churchAttendance,
    faithCentrality: profile.faithCentrality,
    relationshipGoal: profile.relationshipGoal,
    relationshipHistory: profile.relationshipHistory,
    familySituation: profile.familySituation,
    dependentChildren: profile.dependentChildren,
    adultChildren: profile.adultChildren,
    grandchildren: profile.grandchildren,
    openToRemarriage: profile.openToRemarriage,
    interests: profile.interests,
    smoking: profile.smoking,
    alcohol: profile.alcohol,
    ukNation: profile.ukNation,
    ukRegion: profile.ukRegion,
    travelRadiusMiles: profile.travelRadiusMiles,
    openToRelocation: profile.openToRelocation,
    candidatePools: profile.candidatePools,
    essentials: parseEssentials(profile.essentials),
    hiddenAt: profile.hiddenAt,
  };
}

async function loadProfiles() {
  const rows = await db
    .select({ user: users, profile: memberProfiles })
    .from(memberProfiles)
    .innerJoin(users, eq(users.id, memberProfiles.userId));
  return rows.map((row) => asMatchable(row.user, row.profile));
}

async function loadContext(now: Date): Promise<MatchContext> {
  const [declineRows, blockRows, reportRows] = await Promise.all([
    db.select().from(interests).where(eq(interests.kind, "decline")),
    db.select().from(memberBlocks),
    db.select().from(memberReports),
  ]);
  return {
    now,
    rulesVersion: MATCHING_RULES_VERSION,
    declines: declineRows.map((row) => ({
      viewerId: row.fromUserId,
      candidateId: row.toUserId,
      declinedAt: row.createdAt,
      preferenceHash: row.preferenceHash,
    })),
    blocks: blockRows.map((row) => ({ a: row.blockerUserId, b: row.blockedUserId })),
    reports: reportRows.map((row) => ({ a: row.reporterUserId, b: row.reportedUserId })),
  };
}

export async function recordMeaningfulActivity(userId: string, kind: string, now = new Date()) {
  await db.insert(activityEvents).values({ userId, kind, createdAt: now });
  await db.update(users).set({ lastActiveAt: now, updatedAt: now }).where(eq(users.id, userId));
  const [profile] = await db.select().from(memberProfiles).where(eq(memberProfiles.userId, userId)).limit(1);
  if (profile && profile.activityState !== "taking_a_break" && profile.activityState !== "hidden") {
    await db
      .update(memberProfiles)
      .set({ activityState: "active_now", updatedAt: now })
      .where(eq(memberProfiles.id, profile.id));
  }
}

export async function generateIntroductionsForUser(userId: string, nowInput?: string | Date | null) {
  const now = resolveNow(nowInput ?? null);
  const all = await loadProfiles();
  const viewer = all.find((row) => row.userId === userId);
  if (!viewer) {
    return { error: "Profile not found.", status: 404 as const };
  }
  const ctx = await loadContext(now);
  const built = buildIntroductionSet(viewer, all, ctx);
  const expiresAt = addDays(now, SNAPSHOT_DAYS);

  const [snapshot] = await db
    .insert(recommendationSnapshots)
    .values({
      viewerUserId: userId,
      rulesVersion: ctx.rulesVersion,
      generatedAt: now,
      clockAt: now,
      expiresAt,
      payload: {
        selected: built.selected,
        ranks: built.ranks.map((row) => ({ userId: row.userId, score: row.score, pool: row.pool })),
        excluded: built.excluded,
        restrictingRules: built.restrictingRules,
        viewerExclusions: built.viewerExclusions,
      },
    })
    .returning();

  await db
    .update(introductions)
    .set({ status: "expired" })
    .where(
      and(
        eq(introductions.viewerUserId, userId),
        inArray(introductions.status, ["presented"]),
        ne(introductions.pool, HAND_PICK_POOL),
      ),
    );

  const created = [];
  for (const [index, row] of built.selected.entries()) {
    const [intro] = await db
      .insert(introductions)
      .values({
        snapshotId: snapshot.id,
        viewerUserId: userId,
        candidateUserId: row.userId,
        pool: row.pool,
        alignmentLabel: row.alignmentLabel,
        why: row.why,
        worthDiscussing: row.worthDiscussing,
        rank: index + 1,
        score: row.score,
        exploration: row.exploration,
        status: "presented",
        presentedAt: now,
        expiresAt,
      })
      .returning();
    created.push(intro);
  }

  if (created.length) {
    await notifyNewIntroduction(userId, null);
  }

  await writeAudit({
    actorType: "system",
    actorId: userId,
    action: "introductions_generated",
    entityType: "recommendation_snapshot",
    entityId: snapshot.id,
    metadata: { count: created.length, rulesVersion: ctx.rulesVersion },
  });

  return {
    snapshotId: snapshot.id,
    rulesVersion: ctx.rulesVersion,
    refreshAt: expiresAt,
    introductions: created,
    restrictingRules: built.restrictingRules,
    viewerEligible: built.viewerEligible,
  };
}

async function currentSnapshot(userId: string, now: Date) {
  const [snapshot] = await db
    .select()
    .from(recommendationSnapshots)
    .where(
      and(
        eq(recommendationSnapshots.viewerUserId, userId),
        ne(recommendationSnapshots.rulesVersion, HAND_PICK_POOL),
      ),
    )
    .orderBy(desc(recommendationSnapshots.generatedAt))
    .limit(1);
  if (!snapshot) return null;
  if (snapshot.expiresAt && snapshot.expiresAt <= now) return null;
  return snapshot;
}

export async function listMemberIntroductions(userId: string, nowInput?: string | Date | null) {
  const now = resolveNow(nowInput ?? null);
  let snapshot = await currentSnapshot(userId, now);
  if (!snapshot) {
    const generated = await generateIntroductionsForUser(userId, now);
    if ("error" in generated) return generated;
    snapshot = {
      id: generated.snapshotId,
      viewerUserId: userId,
      rulesVersion: generated.rulesVersion,
      generatedAt: now,
      clockAt: now,
      expiresAt: generated.refreshAt,
      payload: { restrictingRules: generated.restrictingRules },
    };
  }

  const rows = await db
    .select()
    .from(introductions)
    .where(and(eq(introductions.snapshotId, snapshot.id), eq(introductions.viewerUserId, userId)));

  const all = await loadProfiles();
  const viewer = all.find((row) => row.userId === userId);
  const ctx = await loadContext(now);
  const served = [];
  for (const row of rows) {
    if (row.status === "expired" || row.status === "declined") continue;
    const candidate = all.find((item) => item.userId === row.candidateUserId);
    if (!viewer || !candidate || !introductionStillOpen(row.pool, viewer, candidate, ctx)) {
      if (row.pool !== HAND_PICK_POOL) {
        await db.update(introductions).set({ status: "expired" }).where(eq(introductions.id, row.id));
      }
      continue;
    }
    served.push(await serializeIntroduction(row, candidate, now));
  }

  const picked = await handPickedCards(userId, now);
  const seen = new Set(served.map((item) => item.id));
  for (const card of picked) {
    if (!seen.has(card.id)) served.push(card);
  }

  const payload = snapshot.payload as { restrictingRules?: string[] };
  let restrictingRules: string[] = [];
  if (!served.length) {
    if (viewer) {
      const own = viewerEligibility(viewer, ctx).map((item) => item.message);
      restrictingRules = own.length ? own : payload.restrictingRules ?? ["No mutually eligible members are circulating just now."];
    } else {
      restrictingRules = ["We could not find a profile to introduce from."];
    }
  }
  return {
    snapshotId: snapshot.id,
    rulesVersion: snapshot.rulesVersion,
    refreshAt: snapshot.expiresAt,
    introductions: served.sort((a, b) => a.rank - b.rank),
    restrictingRules,
  };
}

async function serializeIntroduction(
  row: typeof introductions.$inferSelect,
  candidate: MatchableProfile,
  now: Date,
) {
  const [profile] = await db.select().from(memberProfiles).where(eq(memberProfiles.userId, candidate.userId)).limit(1);
  const photos = profile
    ? await db.select().from(memberPhotos).where(eq(memberPhotos.profileId, profile.id))
    : [];
  const card = profile
    ? publicProfileView(profile, photos, [], "member")
    : { firstName: candidate.firstName, age: null };
  const [user] = await db.select().from(users).where(eq(users.id, candidate.userId)).limit(1);
  return {
    id: row.id,
    rank: row.rank,
    pool: row.pool,
    poolLabel: poolLabel(row.pool),
    alignmentLabel: row.alignmentLabel,
    alignmentText: alignmentLabelText(row.alignmentLabel as "strong_alignment" | "good_potential" | "some_common_ground"),
    why: row.why,
    worthDiscussing: row.worthDiscussing,
    status: row.status,
    exploration: row.exploration,
    activityLabel: publicActivityLabel(candidate.activityState, user?.lastActiveAt ?? null, now),
    card,
  };
}

export async function getMemberIntroduction(userId: string, introductionId: string, nowInput?: string | Date | null) {
  const now = resolveNow(nowInput ?? null);
  const [row] = await db.select().from(introductions).where(eq(introductions.id, introductionId)).limit(1);
  if (!row || row.viewerUserId !== userId) return { error: "Introduction not found.", status: 404 as const };
  const all = await loadProfiles();
  const viewer = all.find((item) => item.userId === userId);
  const candidate = all.find((item) => item.userId === row.candidateUserId);
  const ctx = await loadContext(now);
  if (!viewer || !candidate || !introductionStillOpen(row.pool, viewer, candidate, ctx)) {
    return { error: "This introduction is no longer available.", status: 410 as const };
  }
  const [viewerProfile] = await db
    .select({
      planEntitlement: memberProfiles.planEntitlement,
      privateBrowsing: memberProfiles.privateBrowsing,
      firstName: memberProfiles.firstName,
    })
    .from(memberProfiles)
    .where(eq(memberProfiles.userId, userId))
    .limit(1);
  const privately = viewerProfile ? isBrowsingPrivately(viewerProfile) : false;
  if (!privately) {
    await recordMeaningfulActivity(userId, "introduction_viewed", now);
    await recordNamedProfileView({
      viewerUserId: userId,
      viewedUserId: row.candidateUserId,
      source: row.pool,
      now,
      viewerFirstName: viewerProfile?.firstName,
    });
  }
  const serialized = await serializeIntroduction(row, candidate, now);
  return {
    ...serialized,
    memberId: row.candidateUserId,
    canAct: isFeatureEnabled("interests_and_mutual_matches"),
  };
}

export async function actOnIntroduction(
  userId: string,
  introductionId: string,
  action: InterestKind,
  nowInput?: string | Date | null,
) {
  const now = resolveNow(nowInput ?? null);
  const [row] = await db.select().from(introductions).where(eq(introductions.id, introductionId)).limit(1);
  if (!row || row.viewerUserId !== userId) return { error: "Introduction not found.", status: 404 as const };

  const all = await loadProfiles();
  const viewer = all.find((item) => item.userId === userId);
  const candidate = all.find((item) => item.userId === row.candidateUserId);
  const ctx = await loadContext(now);
  if (!viewer || !candidate || !introductionStillOpen(row.pool, viewer, candidate, ctx)) {
    return { error: "This introduction is no longer available.", status: 409 as const };
  }

  const next = applyInterestAction({
    existing: null,
    actorId: userId,
    otherId: row.candidateUserId,
    action,
    now,
  });

  const [existing] = await db
    .select()
    .from(interests)
    .where(and(eq(interests.fromUserId, userId), eq(interests.toUserId, row.candidateUserId)))
    .limit(1);

  const values = {
    fromUserId: userId,
    toUserId: row.candidateUserId,
    introductionId: row.id,
    kind: next.kind,
    status: next.status,
    preferenceHash: preferenceHash(viewer),
    createdAt: existing?.createdAt ?? now,
    expiresAt: next.expiresAt,
  };

  const [interest] = existing
    ? await db.update(interests).set(values).where(eq(interests.id, existing.id)).returning()
    : await db.insert(interests).values(values).returning();

  await db
    .update(introductions)
    .set({
      status: action === "talk" ? "interested" : action === "save" ? "saved" : "declined",
      actedAt: now,
    })
    .where(eq(introductions.id, row.id));

  let match = null;
  if (action === "talk") {
    const [incoming] = await db
      .select()
      .from(interests)
      .where(and(eq(interests.fromUserId, row.candidateUserId), eq(interests.toUserId, userId)))
      .limit(1);
    if (reciprocalCreatesMatch(interest, incoming ?? null)) {
      const [a, b] = orderedPair(userId, row.candidateUserId);
      const [created] = await db
        .insert(matches)
        .values({ userAId: a, userBId: b, status: "open", createdAt: now })
        .onConflictDoNothing()
        .returning();
      if (!created) {
        const [found] = await db
          .select()
          .from(matches)
          .where(and(eq(matches.userAId, a), eq(matches.userBId, b)))
          .limit(1);
        match = found;
      } else {
        match = created;
      }
    }
  }

  if (action === "decline") {
    const [incoming] = await db
      .select()
      .from(interests)
      .where(and(eq(interests.fromUserId, row.candidateUserId), eq(interests.toUserId, userId)))
      .limit(1);
    if (incoming) {
      await db.update(interests).set({ status: "closed" }).where(eq(interests.id, incoming.id));
    }
    const [a, b] = orderedPair(userId, row.candidateUserId);
    await db
      .update(matches)
      .set({ status: "closed", closedReason: "declined", closedAt: now })
      .where(and(eq(matches.userAId, a), eq(matches.userBId, b), eq(matches.status, "open")));
  }

  await recordMeaningfulActivity(userId, `introduction_${action}`, now);
  await writeAudit({
    actorType: "member",
    actorId: userId,
    action: `introduction_${action}`,
    entityType: "introduction",
    entityId: row.id,
    metadata: { candidateUserId: row.candidateUserId, matchId: match?.id ?? null },
  });

  return {
    ok: true,
    action,
    matchId: match?.id ?? null,
    state: publicInterestState({
      mine: interest,
      theirs: null,
      matchStatus: match?.status === "open" ? "open" : match ? "closed" : null,
    }),
  };
}

export async function listConnections(userId: string, nowInput?: string | Date | null) {
  const now = resolveNow(nowInput ?? null);
  const mine = await db.select().from(interests).where(eq(interests.fromUserId, userId));
  const theirs = await db.select().from(interests).where(eq(interests.toUserId, userId));
  const matchRows = await db
    .select()
    .from(matches)
    .where(or(eq(matches.userAId, userId), eq(matches.userBId, userId)));

  const otherIds = new Set<string>();
  for (const row of [...mine, ...theirs]) {
    otherIds.add(row.fromUserId === userId ? row.toUserId : row.fromUserId);
  }
  for (const row of matchRows) otherIds.add(row.userAId === userId ? row.userBId : row.userAId);

  const profiles = await loadProfiles();
  const cards = [];
  for (const otherId of otherIds) {
    const myInterest = mine.find((row) => row.toUserId === otherId) ?? null;
    if (myInterest && saveExpired(myInterest, now)) {
      await db.update(interests).set({ status: "expired" }).where(eq(interests.id, myInterest.id));
      myInterest.status = "expired";
    }
    const theirInterest = theirs.find((row) => row.fromUserId === otherId) ?? null;
    const match = matchRows.find((row) => row.userAId === otherId || row.userBId === otherId) ?? null;
    const state = publicInterestState({
      mine: myInterest,
      theirs: theirInterest,
      matchStatus: match?.status === "open" || match?.status === "closed" ? match.status : null,
    });
    const other = profiles.find((row) => row.userId === otherId);
    cards.push({
      otherUserId: otherId,
      firstName: other?.firstName ?? "Member",
      region: other?.ukRegion ?? null,
      state,
      matchId: match?.id ?? null,
      canClose: state === "matched",
    });
  }

  return {
    newInterests: cards.filter((card) => card.state === "new_interest"),
    pending: cards.filter((card) => card.state === "pending" || card.state === "saved"),
    matches: cards.filter((card) => card.state === "matched"),
    closed: cards.filter((card) => card.state === "closed"),
  };
}

export async function closeMatch(userId: string, matchId: string, templateId?: string) {
  const [row] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!row || (row.userAId !== userId && row.userBId !== userId)) {
    return { error: "Match not found.", status: 404 as const };
  }
  await db
    .update(matches)
    .set({ status: "closed", closedReason: templateId ?? "member_close", closedAt: new Date() })
    .where(eq(matches.id, matchId));
  await writeAudit({
    actorType: "member",
    actorId: userId,
    action: "match_closed",
    entityType: "match",
    entityId: matchId,
    metadata: { templateId: templateId ?? null },
  });
  return { ok: true };
}

export async function blockMember(userId: string, otherId: string, source: string) {
  await db.insert(memberBlocks).values({ blockerUserId: userId, blockedUserId: otherId }).onConflictDoNothing();
  const [a, b] = orderedPair(userId, otherId);
  await db
    .update(matches)
    .set({ status: "closed", closedReason: "blocked", closedAt: new Date() })
    .where(and(eq(matches.userAId, a), eq(matches.userBId, b)));
  await db
    .update(introductions)
    .set({ status: "expired" })
    .where(
      or(
        and(eq(introductions.viewerUserId, userId), eq(introductions.candidateUserId, otherId)),
        and(eq(introductions.viewerUserId, otherId), eq(introductions.candidateUserId, userId)),
      ),
    );
  await writeAudit({
    actorType: "member",
    actorId: userId,
    action: "member_blocked",
    entityType: "user",
    entityId: otherId,
    metadata: { source },
  });
  return { ok: true };
}

export async function reportMember(userId: string, otherId: string, reason: string, source: string, detail?: string) {
  await db.insert(memberReports).values({
    reporterUserId: userId,
    reportedUserId: otherId,
    source,
    reason,
    detail: detail ?? null,
  });
  await blockMember(userId, otherId, source);
  return { ok: true };
}

export async function setAvailability(
  userId: string,
  state: "available" | "taking_a_break" | "hidden",
  conversationPolicy?: "preserve" | "close",
) {
  const now = new Date();
  const next =
    state === "available" ? "active_now" : state === "taking_a_break" ? "taking_a_break" : "hidden";
  const status = state === "available" ? "approved" : state === "taking_a_break" ? "paused" : "hidden";
  await db
    .update(memberProfiles)
    .set({
      activityState: next,
      status,
      hiddenAt: state === "hidden" ? now : null,
      breakConversationPolicy: conversationPolicy ?? "preserve",
      updatedAt: now,
    })
    .where(eq(memberProfiles.userId, userId));
  if (state === "available") {
    await recordMeaningfulActivity(userId, "reactivated", now);
  }
  if (state !== "available" && conversationPolicy === "close") {
    await db
      .update(matches)
      .set({ status: "closed", closedReason: "break_close", closedAt: now })
      .where(or(eq(matches.userAId, userId), eq(matches.userBId, userId)));
  }
  await writeAudit({
    actorType: "member",
    actorId: userId,
    action: `availability_${state}`,
    entityType: "member_profile",
    entityId: userId,
    metadata: { conversationPolicy: conversationPolicy ?? "preserve" },
  });
  return { ok: true, activityState: next };
}

export async function sweepActivity(nowInput?: string | Date | null) {
  const now = resolveNow(nowInput ?? null);
  const rows = await db.select({ user: users, profile: memberProfiles }).from(memberProfiles).innerJoin(users, eq(users.id, memberProfiles.userId));
  const results = [];
  for (const row of rows) {
    const next = transitionActivity({
      activityState: row.profile.activityState,
      lastActiveAt: row.user.lastActiveAt,
      now,
    });
    if (next.nextState !== row.profile.activityState) {
      await db
        .update(memberProfiles)
        .set({ activityState: next.nextState, updatedAt: now })
        .where(eq(memberProfiles.id, row.profile.id));
    }
    if (next.notice) {
      await enqueueJob("send_notification", {
        userId: row.user.id,
        to: row.user.email,
        channel: "email",
        template: next.notice === "reactivation" ? "activity_reactivation" : "activity_inactive",
        subject: "Your Mature Christian Dating profile",
        text:
          next.notice === "reactivation"
            ? "We have not seen you for a while. Return soon if you would like to stay in introductions."
            : "Your profile has been removed from new introductions after a period of inactivity. Sign in to return.",
        html: "<p>Your Mature Christian Dating availability has changed.</p>",
      });
    }
    results.push({ userId: row.user.id, ...next });
  }

  const saved = await db.select().from(interests).where(eq(interests.kind, "save"));
  for (const row of saved) {
    if (saveExpired(row, now)) {
      await db.update(interests).set({ status: "expired" }).where(eq(interests.id, row.id));
    }
  }

  await writeAudit({
    actorType: "system",
    action: "activity_sweep_ran",
    entityType: "job_handler",
    entityId: "activity_sweep",
    metadata: { count: results.length, clock: now.toISOString() },
  });
  return results;
}

export async function explainIntroduction(introductionId: string) {
  const [row] = await db.select().from(introductions).where(eq(introductions.id, introductionId)).limit(1);
  if (!row) return { error: "Introduction not found.", status: 404 as const };
  const [snapshot] = await db
    .select()
    .from(recommendationSnapshots)
    .where(eq(recommendationSnapshots.id, row.snapshotId))
    .limit(1);
  const all = await loadProfiles();
  const viewer = all.find((item) => item.userId === row.viewerUserId);
  const candidate = all.find((item) => item.userId === row.candidateUserId);
  const ctx = await loadContext(snapshot?.clockAt ?? row.presentedAt);
  return {
    introduction: row,
    snapshot: snapshot
      ? {
          id: snapshot.id,
          rulesVersion: snapshot.rulesVersion,
          clockAt: snapshot.clockAt,
          payload: snapshot.payload,
        }
      : null,
    viewerExclusions: viewer ? viewerEligibility(viewer, ctx) : [],
    candidateExclusions: viewer && candidate ? candidateExclusions(viewer, candidate, ctx) : [],
  };
}

function pairTouches(a: string, b: string, pairs: Array<{ a: string; b: string }>) {
  return pairs.some((pair) => (pair.a === a && pair.b === b) || (pair.a === b && pair.b === a));
}

function introductionStillOpen(
  pool: string,
  viewer: MatchableProfile,
  candidate: MatchableProfile,
  ctx: MatchContext,
) {
  const blocked = pairTouches(viewer.userId, candidate.userId, ctx.blocks) || pairTouches(viewer.userId, candidate.userId, ctx.reports);
  if (pool === HAND_PICK_POOL) {
    return handPickedStillOpen({
      samePerson: viewer.userId === candidate.userId,
      viewerClosed: viewer.userStatus === "closed" || viewer.userStatus === "closure_requested",
      candidateClosed: candidate.userStatus === "closed" || candidate.userStatus === "closure_requested",
      viewerHidden: Boolean(viewer.hiddenAt),
      candidateHidden: Boolean(candidate.hiddenAt) || candidate.profileStatus === "hidden" || candidate.profileStatus === "paused",
      blocked,
    });
  }
  return candidateExclusions(viewer, candidate, ctx).length === 0;
}

async function handPickedCards(userId: string, now: Date) {
  const rows = await db
    .select()
    .from(introductions)
    .where(
      and(
        eq(introductions.viewerUserId, userId),
        eq(introductions.pool, HAND_PICK_POOL),
        eq(introductions.status, "presented"),
      ),
    );
  const all = await loadProfiles();
  const viewer = all.find((item) => item.userId === userId);
  if (!viewer) return [];
  const ctx = await loadContext(now);
  const cards = [];
  for (const row of rows) {
    const candidate = all.find((item) => item.userId === row.candidateUserId);
    if (!candidate || !introductionStillOpen(HAND_PICK_POOL, viewer, candidate, ctx)) continue;
    cards.push(await serializeIntroduction(row, candidate, now));
  }
  return cards;
}

export async function listHandPickedIntroductions(userId: string, nowInput?: string | Date | null) {
  const now = resolveNow(nowInput ?? null);
  const picked = await handPickedCards(userId, now);
  return {
    snapshotId: null,
    rulesVersion: HAND_PICK_POOL,
    refreshAt: new Date(`${OPENING_OFFER_ENDS_ISO}T23:59:59.000Z`),
    introductions: picked,
    restrictingRules: picked.length
      ? []
      : ["When the team connects you with someone, that introduction appears here."],
  };
}

export async function createHandPickedPair(input: {
  adminId: string;
  userAId: string;
  userBId: string;
  reason: string;
}) {
  const reason = input.reason.trim();
  if (reason.length < 12) {
    return { error: "Write a short reason for this introduction.", status: 400 as const };
  }
  const now = new Date();
  const all = await loadProfiles();
  const left = all.find((item) => item.userId === input.userAId);
  const right = all.find((item) => item.userId === input.userBId);
  if (!left || !right) return { error: "Both profiles need to exist.", status: 404 as const };
  const ctx = await loadContext(now);
  const blocked =
    pairTouches(left.userId, right.userId, ctx.blocks) || pairTouches(left.userId, right.userId, ctx.reports);
  const blockedReason = handPickBlockers(
    {
      userId: left.userId,
      status: left.profileStatus,
      hidden: Boolean(left.hiddenAt) || left.profileStatus === "hidden" || left.profileStatus === "paused",
      emailVerified: left.emailVerified,
      accountClosed: left.userStatus === "closed" || left.userStatus === "closure_requested",
    },
    {
      userId: right.userId,
      status: right.profileStatus,
      hidden: Boolean(right.hiddenAt) || right.profileStatus === "hidden" || right.profileStatus === "paused",
      emailVerified: right.emailVerified,
      accountClosed: right.userStatus === "closed" || right.userStatus === "closure_requested",
    },
    blocked,
  );
  if (blockedReason) return { error: blockedReason, status: 400 as const };

  const existing = await db
    .select()
    .from(introductions)
    .where(
      and(
        eq(introductions.pool, HAND_PICK_POOL),
        eq(introductions.status, "presented"),
        or(
          and(eq(introductions.viewerUserId, left.userId), eq(introductions.candidateUserId, right.userId)),
          and(eq(introductions.viewerUserId, right.userId), eq(introductions.candidateUserId, left.userId)),
        ),
      ),
    );
  const have = new Set(existing.map((row) => row.viewerUserId));
  const expiresAt = new Date(`${OPENING_OFFER_ENDS_ISO}T23:59:59.000Z`);
  const created: string[] = existing.map((row) => row.id);

  for (const [viewer, candidate] of [
    [left, right],
    [right, left],
  ] as const) {
    if (have.has(viewer.userId)) continue;
    const [snapshot] = await db
      .insert(recommendationSnapshots)
      .values({
        viewerUserId: viewer.userId,
        rulesVersion: HAND_PICK_POOL,
        generatedAt: now,
        clockAt: now,
        expiresAt,
        payload: { kind: HAND_PICK_POOL, reason, otherUserId: candidate.userId },
      })
      .returning();
    const [intro] = await db
      .insert(introductions)
      .values({
        snapshotId: snapshot.id,
        viewerUserId: viewer.userId,
        candidateUserId: candidate.userId,
        pool: HAND_PICK_POOL,
        alignmentLabel: "good_potential",
        why: [{ code: "handpicked", text: reason }],
        worthDiscussing: [],
        rank: 1,
        score: 0,
        exploration: false,
        status: "presented",
        presentedAt: now,
        expiresAt,
      })
      .returning();
    created.push(intro.id);
    await notifyNewIntroduction(viewer.userId, candidate.firstName);
  }

  const [low, high] = orderedPair(left.userId, right.userId);
  const [existingMatch] = await db
    .select()
    .from(matches)
    .where(and(eq(matches.userAId, low), eq(matches.userBId, high)))
    .limit(1);
  if (!existingMatch) {
    await db.insert(matches).values({ userAId: low, userBId: high, status: "open", createdAt: now });
  } else if (existingMatch.status !== "open") {
    await db
      .update(matches)
      .set({ status: "open", closedReason: null, closedAt: null })
      .where(eq(matches.id, existingMatch.id));
  }
  await openConversation(left.userId, right.userId, now);

  await writeAudit({
    actorType: "admin",
    actorId: input.adminId,
    action: "hand_picked_introduction",
    entityType: "introduction",
    entityId: created[0] ?? left.userId,
    metadata: { userAId: left.userId, userBId: right.userId },
  });

  return { ok: true as const, introductionIds: created };
}

export async function matchingInventory() {
  const rows = await db.select({ activityState: memberProfiles.activityState, status: memberProfiles.status }).from(memberProfiles);
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = `${row.status}:${row.activityState}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return { counts, total: rows.length };
}
