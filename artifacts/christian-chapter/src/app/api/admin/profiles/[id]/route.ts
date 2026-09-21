import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  memberPhotos,
  memberProfiles,
  notifications,
  users,
} from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { PROFILE_STATUSES } from "@/lib/profile/schema";
import { serializeProfile } from "@/lib/profile/serialize";
import { writeAudit } from "@/lib/audit";

const PatchSchema = z.object({
  status: z.enum(PROFILE_STATUSES).optional(),
  reviewNotes: z.string().max(2000).optional(),
  memberMessage: z.string().max(1000).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("profiles.read");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const [profile] = await db.select().from(memberProfiles).where(eq(memberProfiles.id, id)).limit(1);
  if (!profile) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [user] = await db.select().from(users).where(eq(users.id, profile.userId)).limit(1);
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

  return NextResponse.json({
    user: user ? { email: user.email, status: user.status } : null,
    profile: serializeProfile(profile, { photos }),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("profiles.review");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const parse = PatchSchema.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });

  const now = new Date();
  const updates: Partial<typeof memberProfiles.$inferInsert> = { updatedAt: now };
  if (parse.data.status) {
    updates.status = parse.data.status;
    if (parse.data.status === "approved") updates.approvedAt = now;
    if (parse.data.status === "hidden") updates.hiddenAt = now;
    if (parse.data.status === "review") updates.submittedAt = updates.submittedAt ?? now;
  }
  if (parse.data.reviewNotes !== undefined) updates.reviewNotes = parse.data.reviewNotes;

  const [updated] = await db
    .update(memberProfiles)
    .set(updates)
    .where(eq(memberProfiles.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (parse.data.memberMessage?.trim()) {
    await db.insert(notifications).values({
      userId: updated.userId,
      channel: "in_app",
      template: "staff_message",
      payload: { body: parse.data.memberMessage.trim(), from: auth.session.admin.email },
      status: "sent",
      sentAt: now,
    });
  }

  await writeAudit({
    actorType: "admin",
    actorId: auth.session.admin.email,
    action: "profile_reviewed",
    entityType: "member_profile",
    entityId: id,
    metadata: {
      status: parse.data.status,
      messaged: Boolean(parse.data.memberMessage?.trim()),
    },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
