import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, memberMedia } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { featureGate } from "@/lib/platform/require-feature";
import { mediaExtension, saveUpload } from "@/lib/storage/local";
import { writeAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const gated = featureGate("photo_and_media_profiles");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const profile = await ensureMemberProfile(session.user.id);
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const kind = String(form?.get("kind") ?? "voice") === "video" ? "video" : "voice";
  if (kind === "video") {
    const videoGate = featureGate("photo_and_media_profiles");
    if (videoGate) return videoGate;
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a recording to upload." }, { status: 400 });
  }
  const ext = mediaExtension(file.name, kind);
  if (!ext) {
    return NextResponse.json({ error: kind === "voice" ? "Use an audio file." : "Use an MP4 or WebM video." }, { status: 422 });
  }

  const id = randomUUID();
  const storageKey = await saveUpload(session.user.id, id, Buffer.from(await file.arrayBuffer()), ext);
  const [row] = await db
    .insert(memberMedia)
    .values({
      id,
      profileId: profile.id,
      userId: session.user.id,
      kind,
      storageKey,
      moderationStatus: "pending",
    })
    .returning();

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: `${kind}_uploaded`,
    entityType: "member_media",
    entityId: id,
  });

  return NextResponse.json({
    id: row.id,
    kind: row.kind,
    moderationStatus: row.moderationStatus,
    url: `/api/profile/media/${row.id}`,
    sandbox: true,
  });
}

export async function GET() {
  const gated = featureGate("photo_and_media_profiles");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const profile = await ensureMemberProfile(session.user.id);
  const rows = await db.select().from(memberMedia).where(eq(memberMedia.profileId, profile.id));
  return NextResponse.json(
    rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      moderationStatus: row.moderationStatus,
      url: `/api/profile/media/${row.id}`,
    })),
  );
}
