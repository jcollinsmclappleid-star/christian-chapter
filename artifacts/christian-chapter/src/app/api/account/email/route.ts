import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "@/db";
import { issueMagicLink, requestMeta } from "@/lib/auth-email";
import { sendServiceEmail } from "@/lib/email";
import { requireMemberApi } from "@/lib/member-session";
import { writeAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const parse = z.object({ email: z.string().email() }).safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });

  const nextEmail = parse.data.email.toLowerCase().trim();
  const [current] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!current) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (nextEmail === current.email.toLowerCase()) {
    return NextResponse.json({ error: "That is already your sign-in address." }, { status: 422 });
  }

  const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, nextEmail)).limit(1);
  if (taken) return NextResponse.json({ error: "That address is already in use." }, { status: 422 });

  const sent = await issueMagicLink({
    userId: current.id,
    email: nextEmail,
    firstName: current.firstName,
    purpose: "change_email",
    subjectEmail: nextEmail,
  });
  if (!sent.ok) return NextResponse.json({ error: sent.error }, { status: 503 });

  await sendServiceEmail({
    to: current.email,
    subject: "A request to change your sign-in address",
    text: "We received a request to change the address you use to sign in. If this was not you, contact us and do not open the other message.",
    html: "<p>We received a request to change the address you use to sign in. If this was not you, contact us and do not open the other message.</p>",
  });

  const { ip, ua } = requestMeta(request);
  await writeAudit({
    actorType: "member",
    actorId: current.id,
    action: "email_change_requested",
    entityType: "user",
    entityId: current.id,
    metadata: { ip, ua },
  });

  return NextResponse.json({
    ok: true,
    message: "We sent a link to that address. Your sign-in address changes when you open it.",
  });
}
