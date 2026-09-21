import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type AdminSession } from "@/lib/admin-session";
import {
  allowStaffPasswordLogin,
  lookupStaffByEmail,
  upsertBootstrapAdministrator,
} from "@/lib/admin-auth";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(clientKey(request, "admin-login"), 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parse = LoginSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, password } = parse.data;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("[admin/login] ADMIN_EMAIL or ADMIN_PASSWORD not set.");
    return NextResponse.json(
      { error: "Admin access is not configured on this server." },
      { status: 503 }
    );
  }

  const passwordMatch = password === adminPassword;
  const bootstrapMatch =
    passwordMatch && email.toLowerCase() === adminEmail.toLowerCase();

  let staff = bootstrapMatch
    ? await upsertBootstrapAdministrator(adminEmail)
    : null;

  if (!staff && passwordMatch && allowStaffPasswordLogin()) {
    staff = await lookupStaffByEmail(email);
  }

  if (!staff) {
    await new Promise((r) => setTimeout(r, 300));
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions
  );
  session.admin = {
    email: staff.email,
    loggedIn: true,
    role: staff.role,
    staffUserId: staff.staffUserId,
  };
  await session.save();

  return NextResponse.json({ ok: true, role: staff.role });
}
