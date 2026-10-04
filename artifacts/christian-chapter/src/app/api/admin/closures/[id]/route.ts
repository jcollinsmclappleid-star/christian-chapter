import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, accountClosureRequests, auditEvents } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { purgeMemberAccount } from "@/lib/account/purge-member";

const Schema = z.object({
  action: z.enum(["purge"]),
  ignoreSchedule: z.boolean().optional(),
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

  const [closure] = await db
    .select()
    .from(accountClosureRequests)
    .where(eq(accountClosureRequests.id, requestId))
    .limit(1);
  if (!closure || closure.status !== "open") {
    return NextResponse.json({ error: "That closure request is not open." }, { status: 404 });
  }

  const result = await purgeMemberAccount(closure.userId, {
    ignoreSchedule: Boolean(parse.data.ignoreSchedule),
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  await db.insert(auditEvents).values({
    actorType: "admin",
    actorId: auth.session.admin.email,
    action: "closure_purged",
    entityType: "account_closure_request",
    entityId: String(requestId),
    metadata: { userId: closure.userId, ignoreSchedule: Boolean(parse.data.ignoreSchedule) },
  });

  return NextResponse.json({ ok: true, purgedUserId: closure.userId });
}
