import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, accountClosureRequests, auditEvents } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";

const Schema = z.object({
  status: z.enum(["resolved"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("closures.manage");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const requestId = Number(id);
  if (isNaN(requestId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const parse = Schema.safeParse(await request.json().catch(() => null));
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  }

  const now = new Date();
  const [updated] = await db
    .update(accountClosureRequests)
    .set({ status: parse.data.status, resolvedAt: now })
    .where(eq(accountClosureRequests.id, requestId))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await db.insert(auditEvents).values({
    actorType: "admin",
    actorId: auth.session.admin.email,
    action: "closure_resolved",
    entityType: "account_closure_request",
    entityId: String(requestId),
    metadata: { userId: updated.userId },
  });

  return NextResponse.json({ ok: true });
}
