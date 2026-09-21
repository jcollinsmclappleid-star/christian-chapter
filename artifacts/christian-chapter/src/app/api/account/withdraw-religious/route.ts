import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, consentRecords, foundingApplications, users } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { writeAudit } from "@/lib/audit";
import { RELIGIOUS_CONSENT_VERSION } from "@/lib/site-config";
import { requestMeta } from "@/lib/auth-email";

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const now = new Date();
  const { ip, ua } = requestMeta(request);

  await db.transaction(async (tx) => {
    await tx.insert(consentRecords).values({
      userId: session.user.id,
      consentType: "religious_data",
      consentVersion: RELIGIOUS_CONSENT_VERSION,
      granted: false,
      grantedAt: now,
      withdrawnAt: now,
      source: "account_withdraw",
      ipAddress: ip,
      userAgent: ua,
    });
    await tx
      .update(foundingApplications)
      .set({
        status: "closed",
        hiddenAt: now,
        updatedAt: now,
      })
      .where(eq(foundingApplications.userId, session.user.id));
    await tx
      .update(users)
      .set({ status: "paused", updatedAt: now })
      .where(eq(users.id, session.user.id));
  });

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "religious_consent_withdrawn",
    entityType: "user",
    entityId: session.user.id,
  });

  return NextResponse.json({
    ok: true,
    message:
      "Religious-belief processing has stopped. Your founding application is no longer active.",
  });
}
