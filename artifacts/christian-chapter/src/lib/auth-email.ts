import { eq } from "drizzle-orm";
import { db, emailTokens, users } from "@/db";
import { sendServiceEmail, magicLinkEmailHtml } from "@/lib/email";
import { siteConfig } from "@/lib/site-config";
import { generateRawToken, hashToken, TOKEN_TTL_MS } from "@/lib/tokens";

export async function issueMagicLink(opts: {
  userId: string;
  email: string;
  firstName?: string | null;
  purpose: "verify" | "sign_in";
}): Promise<{ ok: true; delivered: boolean; url: string } | { ok: false; error: string }> {
  const raw = generateRawToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  const url = `${siteConfig.siteUrl}/api/auth/verify?token=${encodeURIComponent(raw)}&purpose=${opts.purpose}`;

  await db.insert(emailTokens).values({
    userId: opts.userId,
    purpose: opts.purpose,
    tokenHash,
    expiresAt,
  });

  const result = await sendServiceEmail({
    to: opts.email,
    subject:
      opts.purpose === "verify"
        ? "Confirm your Mature Christian Dating email"
        : "Sign in to Mature Christian Dating",
    html: magicLinkEmailHtml({
      firstName: opts.firstName ?? undefined,
      action: opts.purpose,
      url,
    }),
    text: `${opts.purpose === "verify" ? "Confirm your email" : "Sign in"}: ${url}`,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  if (!result.delivered && process.env.NODE_ENV !== "production") {
    console.info("[auth] RESEND_API_KEY unset. Magic link (dev only):", url);
  }

  return { ok: true, delivered: result.delivered, url };
}

export async function touchUser(userId: string) {
  await db
    .update(users)
    .set({ lastActiveAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export function requestMeta(request: Request) {
  return {
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    ua: request.headers.get("user-agent") ?? null,
  };
}
