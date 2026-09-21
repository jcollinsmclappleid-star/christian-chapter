import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, foundingApplications, users } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { applicationToWizard, wizardToApplicationValues } from "@/lib/application-map";
import type { WizardData } from "@/app/register/_components/wizard-types";

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) {
    return NextResponse.json({ error, authenticated: false }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const [app] = await db
    .select()
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, session.user.id))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  if (!app) {
    return NextResponse.json({
      authenticated: true,
      verified: Boolean(user.emailVerifiedAt),
      user: { email: user.email, status: user.status },
      data: null,
      step: 1,
      applicationStatus: "draft",
    });
  }

  const mapped = applicationToWizard(app);
  mapped.data.email = user.email;
  return NextResponse.json({
    authenticated: true,
    verified: Boolean(user.emailVerifiedAt),
    user: { email: user.email, status: user.status },
    data: mapped.data,
    step: mapped.step,
    applicationStatus: app.status,
  });
}

export async function PUT(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    data?: WizardData;
    step?: number;
  } | null;
  if (!body?.data) {
    return NextResponse.json({ error: "Missing draft." }, { status: 400 });
  }

  const values = wizardToApplicationValues(body.data, body.step ?? 1);
  const [existing] = await db
    .select({ id: foundingApplications.id, status: foundingApplications.status })
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, session.user.id))
    .limit(1);

  if (!existing) {
    await db.insert(foundingApplications).values({
      userId: session.user.id,
      ...values,
      status: "draft",
    });
  } else if (existing.status === "draft" || existing.status === "submitted") {
    await db
      .update(foundingApplications)
      .set(values)
      .where(eq(foundingApplications.id, existing.id));
  }

  return NextResponse.json({ ok: true });
}
