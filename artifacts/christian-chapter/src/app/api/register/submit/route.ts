import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import {
  db,
  consentRecords,
  foundingApplications,
  users,
} from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { isAtLeastAge } from "@/lib/age";
import { writeAudit } from "@/lib/audit";
import { requestMeta } from "@/lib/auth-email";
import { wizardToApplicationValues } from "@/lib/application-map";
import { SubmitSchema } from "@/lib/submit-schema";
import {
  MINIMUM_AGE,
  RELIGIOUS_CONSENT_VERSION,
  MARKETING_CONSENT_VERSION,
  TERMS_CONSENT_VERSION,
  POLICY_VERSION,
} from "@/lib/site-config";
import type { WizardData } from "@/app/register/_components/wizard-types";

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) {
    return NextResponse.json({ error: error ?? "Sign in required." }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user?.emailVerifiedAt) {
    return NextResponse.json(
      { error: "Please confirm your email before submitting an application." },
      { status: 403 },
    );
  }
  if (user.status === "closed" || user.status === "suspended") {
    return NextResponse.json({ error: "This account cannot submit an application." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parse = SubmitSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parse.error.issues }, { status: 422 });
  }

  const data = parse.data as WizardData & { termsAccepted: true; eligibilityAcknowledged: true };
  if (!isAtLeastAge(data.dateOfBirth, MINIMUM_AGE)) {
    return NextResponse.json(
      { error: "Mature Christian Dating is for adults aged 40 and over." },
      { status: 422 },
    );
  }
  if (data.ageRangeMin >= data.ageRangeMax) {
    return NextResponse.json(
      { error: "Age range minimum must be less than the maximum." },
      { status: 422 },
    );
  }

  const now = new Date();
  const { ip, ua } = requestMeta(request);
  const values = wizardToApplicationValues(data, 10);

  try {
    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(foundingApplications)
        .where(eq(foundingApplications.userId, user.id))
        .limit(1);

      let applicationId: number;
      if (existing) {
        await tx
          .update(foundingApplications)
          .set({
            ...values,
            status: existing.status === "draft" ? "submitted" : existing.status,
            submittedAt: existing.submittedAt ?? now,
          })
          .where(eq(foundingApplications.id, existing.id));
        applicationId = existing.id;
      } else {
        const [created] = await tx
          .insert(foundingApplications)
          .values({
            userId: user.id,
            ...values,
            status: "submitted",
            submittedAt: now,
          })
          .returning({ id: foundingApplications.id });
        applicationId = created.id;
      }

      await tx
        .update(consentRecords)
        .set({ withdrawnAt: now })
        .where(
          and(
            eq(consentRecords.userId, user.id),
            eq(consentRecords.granted, true),
          ),
        );

      await tx.insert(consentRecords).values([
        {
          userId: user.id,
          consentType: "religious_data",
          consentVersion: RELIGIOUS_CONSENT_VERSION,
          granted: true,
          grantedAt: now,
          source: "registration_submit",
          ipAddress: ip,
          userAgent: ua,
        },
        {
          userId: user.id,
          consentType: "marketing",
          consentVersion: MARKETING_CONSENT_VERSION,
          granted: data.marketingConsent,
          grantedAt: now,
          source: "registration_submit",
          ipAddress: ip,
          userAgent: ua,
        },
        {
          userId: user.id,
          consentType: "terms",
          consentVersion: TERMS_CONSENT_VERSION,
          granted: true,
          grantedAt: now,
          source: "registration_submit",
          ipAddress: ip,
          userAgent: ua,
        },
        {
          userId: user.id,
          consentType: "privacy",
          consentVersion: POLICY_VERSION,
          granted: true,
          grantedAt: now,
          source: "registration_submit",
          ipAddress: ip,
          userAgent: ua,
        },
      ]);

      return applicationId;
    });

    await writeAudit({
      actorType: "member",
      actorId: user.id,
      action: "application_submitted",
      entityType: "founding_application",
      entityId: String(result),
    });

    return NextResponse.json({ success: true, id: result, status: "submitted" }, { status: 201 });
  } catch (err) {
    console.error("[register/submit]", err);
    return NextResponse.json(
      { error: "Application could not be saved. Please try again." },
      { status: 500 },
    );
  }
}
