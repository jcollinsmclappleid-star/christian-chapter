import { NextRequest, NextResponse } from "next/server";
import { db, foundingApplications, consentRecords, users, auditEvents } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("applications.read");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const applicationId = Number(id);
  if (isNaN(applicationId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const [app] = await db
    .select()
    .from(foundingApplications)
    .where(eq(foundingApplications.id, applicationId))
    .limit(1);
  if (!app) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [user] = await db.select().from(users).where(eq(users.id, app.userId)).limit(1);
  const consents = await db
    .select()
    .from(consentRecords)
    .where(eq(consentRecords.userId, app.userId))
    .orderBy(consentRecords.grantedAt);

  return NextResponse.json({ application: app, user, consents });
}

const PatchSchema = z.object({
  status: z
    .enum([
      "draft",
      "submitted",
      "in_review",
      "accepted",
      "waitlisted",
      "flagged",
      "declined",
      "closure_requested",
      "closed",
    ])
    .optional(),
  internalNotes: z.string().max(5000).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("applications.review");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const applicationId = Number(id);
  if (isNaN(applicationId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const parse = PatchSchema.safeParse(await request.json().catch(() => null));
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  }

  const { status, internalNotes } = parse.data;
  if (!status && internalNotes === undefined) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updates: Partial<typeof foundingApplications.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (status) {
    updates.status = status;
    updates.reviewedAt = new Date();
  }
  if (internalNotes !== undefined) updates.internalNotes = internalNotes;

  const [updated] = await db
    .update(foundingApplications)
    .set(updates)
    .where(eq(foundingApplications.id, applicationId))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await db.insert(auditEvents).values({
    actorType: "admin",
    actorId: auth.session.admin.email,
    action: "application_status_updated",
    entityType: "founding_application",
    entityId: String(applicationId),
    metadata: { status, internalNotes: internalNotes !== undefined },
  });

  return NextResponse.json({ ok: true, ...updated });
}
