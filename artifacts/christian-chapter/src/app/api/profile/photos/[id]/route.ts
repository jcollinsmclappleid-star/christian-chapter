import { NextRequest, NextResponse } from "next/server";
import { and, eq, or } from "drizzle-orm";
import { db, introductions, memberPhotos, profileViews } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { requireAdminApi } from "@/lib/admin-auth";
import { deleteUpload, mimeForKey, readUpload } from "@/lib/storage/local";
import { writeAudit } from "@/lib/audit";

async function canView(photoUserId: string, moderationStatus: string) {
  const member = await requireMemberApi();
  const viewerId = member.session?.user.id;
  if (viewerId === photoUserId) return true;
  const admin = await requireAdminApi("profiles.read");
  if (admin.session) return true;
  if (moderationStatus !== "clear") return false;
  if (viewerId) {
    const [view] = await db
      .select({ id: profileViews.id })
      .from(profileViews)
      .where(and(eq(profileViews.viewerUserId, photoUserId), eq(profileViews.viewedUserId, viewerId)))
      .limit(1);
    if (view) return true;
    const [intro] = await db
      .select({ id: introductions.id })
      .from(introductions)
      .where(
        or(
          and(eq(introductions.viewerUserId, viewerId), eq(introductions.candidateUserId, photoUserId)),
          and(eq(introductions.viewerUserId, photoUserId), eq(introductions.candidateUserId, viewerId)),
        ),
      )
      .limit(1);
    if (intro) return true;
  }
  return false;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [photo] = await db.select().from(memberPhotos).where(eq(memberPhotos.id, id)).limit(1);
  if (!photo) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!(await canView(photo.userId, photo.moderationStatus))) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  try {
    const body = photo.imageData
      ? Buffer.from(photo.imageData, "base64")
      : await readUpload(photo.storageKey);
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": mimeForKey(photo.storageKey),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Photograph is not available." }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const { id } = await params;
  const [photo] = await db.select().from(memberPhotos).where(eq(memberPhotos.id, id)).limit(1);
  if (!photo || photo.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await db.delete(memberPhotos).where(eq(memberPhotos.id, id));
  await deleteUpload(photo.storageKey);
  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "photo_deleted",
    entityType: "member_photo",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null) as { position?: number } | null;
  const [photo] = await db.select().from(memberPhotos).where(eq(memberPhotos.id, id)).limit(1);
  if (!photo || photo.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (body?.position === 1) {
    const siblings = await db
      .select()
      .from(memberPhotos)
      .where(eq(memberPhotos.profileId, photo.profileId));
    for (const row of siblings) {
      await db
        .update(memberPhotos)
        .set({ position: row.id === photo.id ? 1 : row.position + (row.position < photo.position ? 0 : 1) })
        .where(eq(memberPhotos.id, row.id));
    }
    await db.update(memberPhotos).set({ position: 1 }).where(eq(memberPhotos.id, photo.id));
  }

  return NextResponse.json({ ok: true });
}
