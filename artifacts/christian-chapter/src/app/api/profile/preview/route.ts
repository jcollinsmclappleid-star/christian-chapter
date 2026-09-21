import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, memberMedia, memberPhotos } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { publicProfileView } from "@/lib/profile/preview";
import { featureGate } from "@/lib/platform/require-feature";

export async function GET(request: NextRequest) {
  const gated = featureGate("full_member_onboarding");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const viewer = request.nextUrl.searchParams.get("as") === "match" ? "match" : "member";
  const profile = await ensureMemberProfile(session.user.id);
  const photos = await db
    .select({
      id: memberPhotos.id,
      position: memberPhotos.position,
      moderationStatus: memberPhotos.moderationStatus,
    })
    .from(memberPhotos)
    .where(eq(memberPhotos.profileId, profile.id))
    .orderBy(memberPhotos.position);
  const media = await db
    .select({
      id: memberMedia.id,
      kind: memberMedia.kind,
      moderationStatus: memberMedia.moderationStatus,
    })
    .from(memberMedia)
    .where(eq(memberMedia.profileId, profile.id));

  return NextResponse.json(
    publicProfileView(
      profile,
      photos,
      media.map((row) => ({ ...row, url: `/api/profile/media/${row.id}` })),
      viewer,
    ),
  );
}
