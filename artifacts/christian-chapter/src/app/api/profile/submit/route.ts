import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, memberPhotos, memberProfiles } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { submitBlockingErrors } from "@/lib/profile/schema";
import { serializeProfile } from "@/lib/profile/serialize";
import { writeAudit } from "@/lib/audit";
import { featureGate } from "@/lib/platform/require-feature";

export async function POST() {
  const gated = featureGate("full_member_onboarding");
  if (gated) return gated;
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

  const missing = submitBlockingErrors({
    firstName: profile.firstName,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    seekingGender: profile.seekingGender,
    aboutMe: profile.aboutMe,
    tradition: profile.tradition,
    churchAttendance: profile.churchAttendance,
    faithCentrality: profile.faithCentrality,
    relationshipGoal: profile.relationshipGoal,
    relationshipHistory: profile.relationshipHistory,
    ukRegion: profile.ukRegion,
    ukResidence: profile.ukResidence,
    travelRadiusMiles: profile.travelRadiusMiles,
    photoCount: photos.length,
  });

  if (missing.length) {
    return NextResponse.json({ error: "A few things still need completing.", missing }, { status: 422 });
  }

  const [updated] = await db
    .update(memberProfiles)
    .set({
      status: "submitted",
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(memberProfiles.id, profile.id))
    .returning();

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "profile_submitted",
    entityType: "member_profile",
    entityId: profile.id,
  });

  return NextResponse.json(serializeProfile(updated, { photos }));
}
