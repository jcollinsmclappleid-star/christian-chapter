import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, photoChecks } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { writeAudit } from "@/lib/audit";
import { decidePhotoCheck } from "@/lib/photo-check-store";

const Schema = z.object({
  decision: z.enum(["matched", "not_matched"]),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("profiles.review");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const [row] = await db.select().from(photoChecks).where(eq(photoChecks.id, id));
  if (!row?.imageData || !row.contentType) {
    return NextResponse.json({ error: "That photograph has already been deleted." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(Buffer.from(row.imageData, "base64")), {
    headers: {
      "Content-Type": row.contentType,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("profiles.review");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parse = Schema.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose a decision." }, { status: 422 });

  const { id } = await params;
  const row = await decidePhotoCheck(id, parse.data.decision);
  if (!row) return NextResponse.json({ error: "That check is no longer waiting." }, { status: 409 });
  if (row.imageData) {
    return NextResponse.json({ error: "The photograph was not deleted." }, { status: 500 });
  }

  await writeAudit({
    actorType: "admin",
    actorId: auth.session.admin.email,
    action: "photo_check_decided",
    entityType: "photo_check",
    entityId: id,
    metadata: { status: row.status },
  });

  return NextResponse.json({ ok: true, status: row.status, imageHeld: false });
}
