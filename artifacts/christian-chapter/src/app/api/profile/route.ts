import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, memberPhotos, memberProfiles, notifications } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { ProfilePatchSchema } from "@/lib/profile/schema";
import { serializeProfile } from "@/lib/profile/serialize";
import { writeAudit } from "@/lib/audit";
import { featureGate } from "@/lib/platform/require-feature";
import { recordMeaningfulActivity } from "@/lib/matching/persist";

export async function GET() {
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

  const notes = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(8);

  return NextResponse.json(
    serializeProfile(profile, {
      photos,
      messages: notes
        .filter((n) => n.template === "staff_message")
        .map((n) => ({
          id: n.id,
          body: String((n.payload as { body?: string } | null)?.body ?? n.template),
          createdAt: n.createdAt,
        })),
    }),
  );
}

export async function PATCH(request: NextRequest) {
  const gated = featureGate("full_member_onboarding");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const parse = ProfilePatchSchema.safeParse(await request.json().catch(() => null));
  if (!parse.success) {
    return NextResponse.json({ error: "Could not save those details." }, { status: 422 });
  }

  const profile = await ensureMemberProfile(session.user.id);
  const locked = profile.status === "approved" || profile.status === "review" || profile.status === "submitted";
  const data = parse.data;
  if (locked && data.status === "paused") {
    // allowed
  } else if (profile.status === "hidden") {
    return NextResponse.json({ error: "This profile is hidden." }, { status: 403 });
  }

  const [updated] = await db
    .update(memberProfiles)
    .set({
      ...data,
      dateOfBirth: data.dateOfBirth === "" ? null : data.dateOfBirth,
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

  return NextResponse.json(serializeProfile(updated, { photos }));
}
