import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  accountClosureRequests,
  consentRecords,
  foundingApplications,
  users,
} from "@/db";
import { requireMemberApi, getMemberSession } from "@/lib/member-session";
import { writeAudit } from "@/lib/audit";
import { APPLICATION_RETENTION_DAYS } from "@/lib/site-config";
import { requestMeta } from "@/lib/auth-email";

const Schema = z.object({
  confirm: z.literal(true),
  reason: z.enum(["religious_consent_withdrawn", "met_someone", "other"]),
  detail: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const parse = Schema.safeParse(await request.json().catch(() => null));
  if (!parse.success) {
    return NextResponse.json({ error: "Confirmation is required." }, { status: 400 });
  }

  const now = new Date();
  const scheduled = new Date(now.getTime() + APPLICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const { ip, ua } = requestMeta(request);

  await db.transaction(async (tx) => {
    await tx.insert(accountClosureRequests).values({
      userId: session.user.id,
      reason: parse.data.reason,
      detail: parse.data.detail,
      status: "open",
      scheduledDeleteAt: scheduled,
    });
    await tx
      .update(users)
      .set({ status: "closure_requested", updatedAt: now })
      .where(eq(users.id, session.user.id));
    await tx
      .update(foundingApplications)
      .set({ status: "closure_requested", hiddenAt: now, updatedAt: now })
      .where(eq(foundingApplications.userId, session.user.id));

    if (parse.data.reason === "religious_consent_withdrawn") {
      await tx.insert(consentRecords).values({
        userId: session.user.id,
        consentType: "religious_data",
        consentVersion: "2026-09-20",
        granted: false,
        grantedAt: now,
        withdrawnAt: now,
        source: "account_closure",
        ipAddress: ip,
        userAgent: ua,
      });
    }
  });

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "closure_requested",
    entityType: "user",
    entityId: session.user.id,
    metadata: { reason: parse.data.reason },
  });

  const memberSession = await getMemberSession();
  memberSession.destroy();

  return NextResponse.json({
    ok: true,
    scheduledDeleteAt: scheduled.toISOString(),
  });
}
