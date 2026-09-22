import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, foundingApplications, users } from "@/db";
import { issueMagicLink } from "@/lib/auth-email";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { wizardToApplicationValues } from "@/lib/application-map";
import { defaultWizardData, type WizardData } from "@/app/register/_components/wizard-types";

const Schema = z.object({
  firstName: z.string().min(1).max(100),
  email: z.string().email(),
  marketingConsent: z.boolean().optional(),
  step: z.number().int().min(1).max(10).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

const GENERIC =
  "If that email can be used, we have sent a one-time link. Check your inbox.";

export async function POST(request: NextRequest) {
  const limited = rateLimit(clientKey(request, "auth-start"), 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Please wait before requesting another email." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parse = Schema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Please enter a valid name and email." }, { status: 400 });
  }

  const email = parse.data.email.toLowerCase().trim();
  const firstName = parse.data.firstName.trim();
  const now = new Date();

  let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        email,
        firstName,
        status: "pending_email_verification",
        updatedAt: now,
      })
      .returning();
  } else {
    await db
      .update(users)
      .set({ firstName: firstName || user.firstName, updatedAt: now })
      .where(eq(users.id, user.id));
  }

  const draft = {
    ...defaultWizardData,
    ...((parse.data.data ?? {}) as Partial<WizardData>),
    firstName,
    email,
    marketingConsent: parse.data.marketingConsent ?? false,
    flowVersion: 2,
  };
  const values = wizardToApplicationValues(draft, parse.data.step ?? 10);

  const [existingApp] = await db
    .select({ id: foundingApplications.id, status: foundingApplications.status })
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, user.id))
    .limit(1);

  if (!existingApp) {
    await db.insert(foundingApplications).values({
      userId: user.id,
      ...values,
      status: "draft",
    });
  } else if (existingApp.status === "draft") {
    await db.update(foundingApplications).set(values).where(eq(foundingApplications.id, existingApp.id));
  }

  const purpose = user.emailVerifiedAt ? "sign_in" : "verify";
  const sent = await issueMagicLink({
    userId: user.id,
    email,
    firstName,
    purpose,
  });

  if (!sent.ok) {
    return NextResponse.json(
      { error: "We could not send the email. Please try again shortly." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: GENERIC,
    delivered: sent.delivered,
    ...(process.env.NODE_ENV !== "production" && !sent.delivered
      ? { devLink: sent.url }
      : {}),
  });
}
