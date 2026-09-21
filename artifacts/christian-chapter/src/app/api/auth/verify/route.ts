import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db, emailTokens, users } from "@/db";
import { getMemberSession } from "@/lib/member-session";
import { hashToken } from "@/lib/tokens";
import { touchUser } from "@/lib/auth-email";
import { writeAudit } from "@/lib/audit";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(clientKey(request, "auth-verify"), 20, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.redirect(new URL("/verify?error=rate", request.url));
  }

  const token = request.nextUrl.searchParams.get("token") ?? "";
  const purpose = request.nextUrl.searchParams.get("purpose") ?? "verify";
  if (!token) {
    return NextResponse.redirect(new URL("/verify?error=missing", request.url));
  }

  const tokenHash = hashToken(token);
  const now = new Date();

  const [row] = await db
    .select()
    .from(emailTokens)
    .where(and(eq(emailTokens.tokenHash, tokenHash), isNull(emailTokens.usedAt)))
    .limit(1);

  if (!row || row.expiresAt <= now) {
    return NextResponse.redirect(new URL("/verify?error=expired", request.url));
  }

  const [user] = await db.select().from(users).where(eq(users.id, row.userId)).limit(1);
  if (!user || user.status === "closed" || user.status === "suspended") {
    return NextResponse.redirect(new URL("/verify?error=expired", request.url));
  }

  await db.update(emailTokens).set({ usedAt: now }).where(eq(emailTokens.id, row.id));

  const verifiedAt = user.emailVerifiedAt ?? now;
  const nextStatus =
    user.status === "pending_email_verification"
      ? "active_founding_member"
      : user.status;

  await db
    .update(users)
    .set({
      emailVerifiedAt: verifiedAt,
      status: nextStatus,
      lastActiveAt: now,
      updatedAt: now,
    })
    .where(eq(users.id, user.id));

  await touchUser(user.id);
  await writeAudit({
    actorType: "member",
    actorId: user.id,
    action: purpose === "sign_in" ? "signed_in" : "email_verified",
    entityType: "user",
    entityId: user.id,
  });

  const session = await getMemberSession();
  session.user = { id: user.id, email: user.email };
  await session.save();

  const dest = purpose === "sign_in" ? "/account" : "/register";
  return NextResponse.redirect(new URL(dest, request.url));
}
