import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, foundingApplications, memberPhotos, memberProfiles, notifications } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { ProfilePatchSchema } from "@/lib/profile/schema";
import { serializeProfile } from "@/lib/profile/serialize";
import { writeAudit } from "@/lib/audit";
import { recordMeaningfulActivity } from "@/lib/matching/persist";
import { anyProfanity, PROFANITY_MESSAGE } from "@/lib/language/profanity";

const PROFILE_NOTES = new Set([
  "staff_message",
  "photo_verified",
  "photo_not_verified",
  "conversation_opened",
]);

const PLACE_KEYS = ["selectedPlaceSlug", "nameTown", "homeCitySlug", "homeTownSlug"] as const;

function placeChoiceFromPayload(payload: unknown) {
  const data = (payload ?? {}) as Record<string, unknown>;
  return {
    selectedPlaceSlug: typeof data.selectedPlaceSlug === "string" ? data.selectedPlaceSlug : "",
    nameTown: data.nameTown === true,
    homeCitySlug: typeof data.homeCitySlug === "string" ? data.homeCitySlug : "",
    homeTownSlug: typeof data.homeTownSlug === "string" ? data.homeTownSlug : "",
  };
}

async function readPlaceChoice(userId: string) {
  const [app] = await db
    .select({ wizardPayload: foundingApplications.wizardPayload })
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, userId))
    .limit(1);
  return placeChoiceFromPayload(app?.wizardPayload);
}

async function savePlaceChoice(userId: string, place: Record<string, unknown>) {
  if (!Object.keys(place).length) return;
  const [app] = await db
    .select({ id: foundingApplications.id, wizardPayload: foundingApplications.wizardPayload })
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, userId))
    .limit(1);
  if (!app) return;
  const payload = { ...((app.wizardPayload ?? {}) as Record<string, unknown>), ...place };
  await db
    .update(foundingApplications)
    .set({ wizardPayload: payload, updatedAt: new Date() })
    .where(eq(foundingApplications.id, app.id));
}

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const profile = await ensureMemberProfile(session.user.id);
  const photos = await db
    .select({
      id: memberPhotos.id,
      position: memberPhotos.position,
      moderationStatus: memberPhotos.moderationStatus,
      verificationStatus: memberPhotos.verificationStatus,
    })
    .from(memberPhotos)
    .where(eq(memberPhotos.profileId, profile.id))
    .orderBy(memberPhotos.position);
  const visiblePhotos = photos.filter((photo) => photo.moderationStatus !== "rejected");

  const notes = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(8);

  return NextResponse.json({
    ...serializeProfile(profile, {
      photos: visiblePhotos,
      messages: notes
        .filter((n) => PROFILE_NOTES.has(n.template))
        .map((n) => ({
          id: n.id,
          body: String((n.payload as { body?: string } | null)?.body ?? n.template),
          createdAt: n.createdAt,
        })),
    }),
    ...(await readPlaceChoice(session.user.id)),
  });
}

export async function PATCH(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const parse = ProfilePatchSchema.safeParse(await request.json().catch(() => null));
  if (!parse.success) {
    return NextResponse.json({ error: "Could not save those details." }, { status: 422 });
  }
  const data = parse.data;
  if (
    anyProfanity([
      data.firstName,
      data.aboutMe,
      data.tradition,
      data.faithDescription,
      data.relationshipGoal,
      data.relationshipHistory,
      data.familySituation,
      data.workStatus,
      data.interests,
      data.futureChildren,
      data.lookingFor,
      data.nextChapter,
      data.caringResponsibilities,
      data.prompts,
      data.essentials,
    ])
  ) {
    return NextResponse.json({ error: PROFANITY_MESSAGE }, { status: 422 });
  }

  const profile = await ensureMemberProfile(session.user.id);
  const locked = profile.status === "approved" || profile.status === "review" || profile.status === "submitted";
  if (locked && data.status === "paused") {
    // allowed
  } else if (profile.status === "hidden") {
    return NextResponse.json({ error: "This profile is hidden." }, { status: 403 });
  }

  const place: Record<string, unknown> = {};
  const profileData = { ...data };
  for (const key of PLACE_KEYS) {
    if (profileData[key] !== undefined) {
      place[key] = profileData[key];
      delete profileData[key];
    }
  }
  await savePlaceChoice(session.user.id, place);

  const [updated] = await db
    .update(memberProfiles)
    .set({
      ...profileData,
      dateOfBirth: profileData.dateOfBirth === "" ? null : profileData.dateOfBirth,
      updatedAt: new Date(),
    })
    .where(eq(memberProfiles.id, profile.id))
    .returning();

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "profile_autosaved",
    entityType: "member_profile",
    entityId: profile.id,
    metadata: { keys: Object.keys(data) },
  });
  await recordMeaningfulActivity(session.user.id, "profile_edit");

  const photos = await db
    .select({
      id: memberPhotos.id,
      position: memberPhotos.position,
      moderationStatus: memberPhotos.moderationStatus,
      verificationStatus: memberPhotos.verificationStatus,
    })
    .from(memberPhotos)
    .where(eq(memberPhotos.profileId, updated.id))
    .orderBy(memberPhotos.position);

  return NextResponse.json({
    ...serializeProfile(updated, { photos: photos.filter((photo) => photo.moderationStatus !== "rejected") }),
    ...(await readPlaceChoice(session.user.id)),
  });
}
