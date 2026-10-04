import { eq } from "drizzle-orm";
import {
  db,
  users,
  memberProfiles,
  memberPhotos,
  staffUsers,
} from "@/db";
import { isPublicProduction } from "@/lib/platform/runtime";
import { writeAudit } from "@/lib/audit";
import { createHandPickedPair, getMemberIntroduction, listHandPickedIntroductions } from "@/lib/matching/persist";
import { containsProfanity } from "@/lib/language/profanity";
import {
  listConversations,
  listChatMessages,
  messagesForExport,
  unreadMessageExpiry,
} from "@/lib/chat/open";
import { sealMessage } from "@/lib/chat/seal";
import { chatMessages } from "@/db";
import {
  SYNTHETIC_DOMAIN,
  buildJourneySpecs,
  type SeedSpec,
} from "./seed-specs.ts";
import {
  clearSyntheticDomain,
  dobForDecade,
  familyFlags,
  seedSyntheticStaff,
  insertJourneyClearPhoto,
  insertFoundingApplication,
} from "./seed-shared.ts";

export type JourneySeedResult = {
  domain: string;
  count: number;
  created: Array<{ email: string; userId: string; gender: SeedSpec["gender"] }>;
  demoPair?: { manEmail: string; womanEmail: string; introductionIds: string[] };
};

async function insertJourneyMember(spec: SeedSpec) {
  const email = `${spec.slug}@${SYNTHETIC_DOMAIN}`;
  const seededAt = new Date();

  const [user] = await db
    .insert(users)
    .values({
      email,
      firstName: spec.firstName,
      status: "active_founding_member",
      emailVerifiedAt: seededAt,
      lastActiveAt: seededAt,
    })
    .returning();

  const [profile] = await db
    .insert(memberProfiles)
    .values({
      userId: user.id,
      status: "approved",
      firstName: spec.firstName,
      dateOfBirth: dobForDecade(spec.decade),
      gender: spec.gender,
      seekingGender: spec.gender === "Man" ? ["Women"] : ["Men"],
      aboutMe: `[JOURNEY MOCK] ${spec.firstName} — development profile for end-to-end testing. Not a real person.`,
      lookingFor: "Someone steady, kind, and rooted in faith.",
      nextChapter: "Shared Sundays, honest conversation, and a calm home together.",
      tradition: spec.tradition,
      churchAttendance: "Most weeks",
      faithCentrality: "Present",
      relationshipGoal: "A committed relationship",
      openToRemarriage: true,
      relationshipHistory: spec.history,
      ...familyFlags(spec.family),
      workStatus: spec.work,
      smoking: "never",
      alcohol: "occasionally",
      ukResidence: "resident",
      ukNation: spec.nation,
      ukRegion: spec.region,
      travelRadiusMiles: spec.travel,
      openToRelocation: spec.travel > 50,
      candidatePools:
        spec.travel > 80
          ? ["nearby", "worth_the_journey", "open_to_distance"]
          : spec.travel > 50
            ? ["nearby", "worth_the_journey"]
            : ["nearby"],
      ageRangeMin: 40,
      ageRangeMax: 90,
      essentials: [{ factor: "tradition", label: "Christian tradition", tier: "preferred" }],
      planEntitlement: spec.plan,
      activityState: "active_now",
      synthetic: true,
      approvedAt: seededAt,
      submittedAt: seededAt,
    })
    .returning();

  await insertJourneyClearPhoto(profile.id, user.id, spec.slug);
  await insertFoundingApplication(user.id, spec);

  return { email, userId: user.id, gender: spec.gender };
}

export async function resetJourneySeed(): Promise<JourneySeedResult> {
  if (isPublicProduction()) {
    throw new Error("Journey mocks cannot be created in public production.");
  }

  await clearSyntheticDomain();
  const created = [];
  for (const spec of buildJourneySpecs()) {
    created.push(await insertJourneyMember(spec));
  }
  await seedSyntheticStaff();

  await writeAudit({
    actorType: "system",
    action: "journey_seed_reset",
    entityType: "seed",
    entityId: "journey",
    metadata: { count: created.length },
  });

  const man = created.find((row) => row.gender === "Man");
  const woman = created.find((row) => row.gender === "Woman");
  let demoPair: JourneySeedResult["demoPair"];

  if (man && woman) {
    const [staff] = await db
      .select({ id: staffUsers.id })
      .from(staffUsers)
      .where(eq(staffUsers.email, `staff-matchmaker@${SYNTHETIC_DOMAIN}`))
      .limit(1);
    const adminId = staff?.id ?? "system-journey-seed";
    const connected = await createHandPickedPair({
      adminId,
      userAId: man.userId,
      userBId: woman.userId,
      reason: "Journey seed: concierge introduction for smoke testing.",
    });
    if ("ok" in connected && connected.ok) {
      demoPair = {
        manEmail: man.email,
        womanEmail: woman.email,
        introductionIds: connected.introductionIds,
      };
    }
  }

  return { domain: SYNTHETIC_DOMAIN, count: created.length, created, demoPair };
}

export type JourneySmokeReport = {
  ok: boolean;
  steps: Array<{ name: string; ok: boolean; detail?: string }>;
};

/** Exercises DB-backed member flows after resetJourneySeed (no HTTP). */
export async function runCustomerJourneySmoke(): Promise<JourneySmokeReport> {
  const steps: JourneySmokeReport["steps"] = [];
  const pass = (name: string, ok: boolean, detail?: string) => {
    steps.push({ name, ok, detail });
    return ok;
  };

  const specs = buildJourneySpecs();
  const rows = await db.select({ email: users.email, id: users.id }).from(users);
  const journeyUsers = rows.filter((u) => u.email.endsWith(`@${SYNTHETIC_DOMAIN}`));
  pass("twenty journey members", journeyUsers.length === specs.length, `count=${journeyUsers.length}`);

  const photos = await db
    .select({ userId: memberPhotos.userId, moderationStatus: memberPhotos.moderationStatus })
    .from(memberPhotos)
    .where(eq(memberPhotos.moderationStatus, "clear"));
  const photoUserIds = new Set(photos.map((p) => p.userId));
  pass(
    "clear photos for every journey member",
    journeyUsers.every((u) => photoUserIds.has(u.id)),
    `clearPhotos=${photos.length}`,
  );

  const profiles = await db
    .select({ userId: memberProfiles.userId, gender: memberProfiles.gender })
    .from(memberProfiles);
  const manRow = profiles.find((p) => p.gender === "Man" && journeyUsers.some((u) => u.id === p.userId));
  const womanRow = profiles.find((p) => p.gender === "Woman" && journeyUsers.some((u) => u.id === p.userId));
  if (!manRow || !womanRow) {
    pass("demo man and woman", false, "missing gender pair");
    return { ok: steps.every((s) => s.ok), steps };
  }

  const manIntro = await listHandPickedIntroductions(manRow.userId);
  const womanIntro = await listHandPickedIntroductions(womanRow.userId);
  pass(
    "hand-picked introductions visible",
    manIntro.introductions.length > 0 && womanIntro.introductions.length > 0,
    `man=${manIntro.introductions.length} woman=${womanIntro.introductions.length}`,
  );

  const introId = manIntro.introductions[0]?.id;
  let conversationId: string | null = null;
  if (introId) {
    const detail = await getMemberIntroduction(manRow.userId, introId);
    conversationId = "conversationId" in detail ? detail.conversationId : null;
    pass("introduction exposes conversation", Boolean(conversationId), conversationId ?? "none");
  } else {
    pass("introduction exposes conversation", false, "no intro id");
  }

  if (conversationId) {
    const greeting = "Hello — lovely to meet you through the team.";
    pass("profanity gate on messages", !containsProfanity(greeting));
    await db.insert(chatMessages).values({
      conversationId,
      senderUserId: manRow.userId,
      body: sealMessage(greeting),
      expiresAt: unreadMessageExpiry(new Date()),
    });
    const read = await listChatMessages(conversationId, womanRow.userId);
    pass("recipient can read message", read.some((m) => m.body === greeting), `messages=${read.length}`);

    const convos = await listConversations(womanRow.userId);
    pass("conversation listed for recipient", convos.some((c) => c.id === conversationId));

    const exported = await messagesForExport(womanRow.userId);
    pass("export includes live messages", exported.some((m) => m.body === greeting));
  }

  return { ok: steps.every((s) => s.ok), steps };
}
