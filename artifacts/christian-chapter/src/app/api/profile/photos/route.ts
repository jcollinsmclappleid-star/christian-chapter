import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, memberPhotos } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { imageExtension, saveUpload } from "@/lib/storage/local";
import { moderateImage } from "@/lib/providers/image-moderation";
import { recordProviderResult } from "@/lib/providers/record";
import { writeAudit } from "@/lib/audit";
import { randomUUID } from "node:crypto";
import { featureGate } from "@/lib/platform/require-feature";

const MAX_PHOTOS = 8;
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const gated = featureGate("photo_and_media_profiles");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const profile = await ensureMemberProfile(session.user.id);
  const existing = await db
    .select({ id: memberPhotos.id, position: memberPhotos.position })
    .from(memberPhotos)
    .where(eq(memberPhotos.profileId, profile.id));

  if (existing.length >= MAX_PHOTOS) {
    return NextResponse.json({ error: "Eight photographs is the maximum." }, { status: 422 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a photograph to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Keep each photograph under 8MB." }, { status: 422 });
  }
  const ext = imageExtension(file.name);
  if (!ext) {
    return NextResponse.json({ error: "Use a JPEG, PNG or WebP photograph." }, { status: 422 });
  }

  const id = randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());
  const storageKey = await saveUpload(session.user.id, id, buffer, ext);
  const position = existing.reduce((max, row) => Math.max(max, row.position), 0) + 1;

  let moderationStatus = "pending";
  try {
    const outcome = await moderateImage({ objectKey: storageKey });
    moderationStatus = outcome.state === "pass" ? "clear" : outcome.state;
    await recordProviderResult({
      feature: "image_moderation",
      entityType: "member_photo",
      entityId: id,
      result: outcome,
    });
  } catch {
    moderationStatus = "pending";
  }

  const [photo] = await db
    .insert(memberPhotos)
    .values({
      id,
      profileId: profile.id,
      userId: session.user.id,
      position,
      storageKey,
      moderationStatus,
    })
    .returning();

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "photo_uploaded",
    entityType: "member_photo",
    entityId: id,
    metadata: { moderationStatus },
  });

  return NextResponse.json({
    id: photo.id,
    position: photo.position,
    moderationStatus: photo.moderationStatus,
    verificationStatus: photo.verificationStatus,
    url: `/api/profile/photos/${photo.id}`,
  });
}
