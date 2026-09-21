import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "@/db";
import { issueMagicLink } from "@/lib/auth-email";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const Schema = z.object({ email: z.string().email() });
const GENERIC =
  "If that email has an account, we have sent a one-time sign-in link.";

export async function POST(request: NextRequest) {
  const limited = rateLimit(clientKey(request, "auth-signin"), 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Please wait before requesting another email." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parse = Schema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ ok: true, message: GENERIC });
  }

  const email = parse.data.email.toLowerCase().trim();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (user && user.status !== "closed" && user.status !== "suspended") {
    const sent = await issueMagicLink({
      userId: user.id,
      email,
      firstName: user.firstName,
      purpose: user.emailVerifiedAt ? "sign_in" : "verify",
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

  return NextResponse.json({ ok: true, message: GENERIC, delivered: true });
}
