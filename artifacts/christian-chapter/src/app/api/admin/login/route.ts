import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type AdminSession } from "@/lib/admin-session";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
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

  // Constant-time comparison to prevent timing attacks
  const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatch = password === adminPassword;

  if (!emailMatch || !passwordMatch) {
    // Artificial delay to slow brute-force
    await new Promise((r) => setTimeout(r, 300));
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions
  );
  session.admin = { email: adminEmail, loggedIn: true };
  await session.save();

  return NextResponse.json({ ok: true });
}
