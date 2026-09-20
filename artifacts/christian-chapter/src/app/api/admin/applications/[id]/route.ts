import { NextRequest, NextResponse } from "next/server";
import { db, foundingMembers, consentRecords } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// GET /api/admin/applications/:id — full profile
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memberId = Number(id);
  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    const [member] = await db
      .select()
      .from(foundingMembers)
      .where(eq(foundingMembers.id, memberId))
      .limit(1);

    if (!member) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const consents = await db
      .select()
      .from(consentRecords)
      .where(eq(consentRecords.foundingMemberId, memberId))
      .orderBy(consentRecords.grantedAt);

    return NextResponse.json({ member, consents });
  } catch (err) {
    console.error("[admin/applications/:id GET]", err);
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
  }
}

const PatchSchema = z.object({
  status: z.enum(["pending", "active", "flagged", "declined"]).optional(),
  internalNotes: z.string().max(5000).optional(),
});

// PATCH /api/admin/applications/:id — update status and/or notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memberId = Number(id);
  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parse = PatchSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Invalid request.", issues: parse.error.issues },
      { status: 422 }
    );
  }

  const { status, internalNotes } = parse.data;
  if (!status && internalNotes === undefined) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updates: Partial<typeof foundingMembers.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (status) {
    updates.status = status;
    updates.reviewedAt = new Date();
  }
  if (internalNotes !== undefined) {
    updates.internalNotes = internalNotes;
  }

  try {
    const [updated] = await db
      .update(foundingMembers)
      .set(updates)
      .where(eq(foundingMembers.id, memberId))
      .returning({
        id: foundingMembers.id,
        status: foundingMembers.status,
        reviewedAt: foundingMembers.reviewedAt,
        internalNotes: foundingMembers.internalNotes,
        updatedAt: foundingMembers.updatedAt,
      });

    if (!updated) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, ...updated });
  } catch (err) {
    console.error("[admin/applications/:id PATCH]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
