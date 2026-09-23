import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  consentRecords,
  foundingApplications,
  memberProfiles,
  users,
} from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { writeAudit } from "@/lib/audit";
import { requestMeta } from "@/lib/auth-email";
import { ensureMemberProfile } from "@/lib/profile/ensure";

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const [app] = await db
    .select()
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, session.user.id))
    .limit(1);
  const consents = await db
    .select()
    .from(consentRecords)
    .where(eq(consentRecords.userId, session.user.id))
    .orderBy(desc(consentRecords.grantedAt));

  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const profile = await ensureMemberProfile(session.user.id);

  const latestByType = new Map<string, (typeof consents)[0]>();
  for (const row of consents) {
    if (!latestByType.has(row.consentType)) latestByType.set(row.consentType, row);
  }

  return NextResponse.json({
    user: {
      email: user.email,
      firstName: user.firstName,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
    },
    application: app
      ? {
          id: app.id,
          status: app.status,
          currentStep: app.currentStep,
          hiddenAt: app.hiddenAt,
          submittedAt: app.submittedAt,
        }
      : null,
    consents: [...latestByType.values()].map((c) => ({
      type: c.consentType,
      version: c.consentVersion,
      granted: c.granted && !c.withdrawnAt,
      grantedAt: c.grantedAt,
      withdrawnAt: c.withdrawnAt,
    })),
    residence: {
      ukResidence: profile?.ukResidence ?? null,
      openToRelocation: profile?.openToRelocation ?? null,
    },
    presence: {
      activityState: profile?.activityState ?? "active_now",
      profileStatus: profile?.status ?? "draft",
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parse = z
    .object({
      marketingConsent: z.boolean().optional(),
      ukResidence: z.enum(["resident", "intending_to_relocate"]).optional(),
    })
    .safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const now = new Date();
  const { ip, ua } = requestMeta(request);

  if (parse.data.marketingConsent !== undefined) {
    await db.insert(consentRecords).values({
      userId: session.user.id,
      consentType: "marketing",
      consentVersion: "2026-09-20",
      granted: parse.data.marketingConsent,
      grantedAt: now,
      source: "account_settings",
      ipAddress: ip,
      userAgent: ua,
    });
    await db
      .update(foundingApplications)
      .set({ marketingConsent: parse.data.marketingConsent, updatedAt: now })
      .where(eq(foundingApplications.userId, session.user.id));
    await writeAudit({
      actorType: "member",
      actorId: session.user.id,
      action: "marketing_consent_updated",
      entityType: "user",
      entityId: session.user.id,
      metadata: { granted: parse.data.marketingConsent },
    });
  }

  if (parse.data.ukResidence) {
    const profile = await ensureMemberProfile(session.user.id);
    await db
      .update(memberProfiles)
      .set({ ukResidence: parse.data.ukResidence, updatedAt: now })
      .where(eq(memberProfiles.id, profile.id));
    await writeAudit({
      actorType: "member",
      actorId: session.user.id,
      action: "uk_residence_declared",
      entityType: "member_profile",
      entityId: profile.id,
      metadata: { ukResidence: parse.data.ukResidence },
    });
  }

  return NextResponse.json({ ok: true });
}
