import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";

export interface MemberUser {
  id: string;
  email: string;
}

export interface MemberSession {
  user?: MemberUser;
}

export type AuthedMemberSession = IronSession<MemberSession> & {
  user: MemberUser;
};

function sessionPassword(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to 32+ characters in production.");
  }
  return "dev-placeholder-must-be-32-chars-long!!";
}

export const memberSessionOptions = {
  password: sessionPassword(),
  cookieName: "cc_member",
  ttl: 60 * 60 * 24 * 14,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

export async function getMemberSession() {
  return getIronSession<MemberSession>(await cookies(), memberSessionOptions);
}

export async function requireMemberSession() {
  const session = await getMemberSession();
  if (!session.user?.id) {
    redirect("/sign-in");
  }
  return session as AuthedMemberSession;
}

export async function requireMemberApi(): Promise<
  | { session: null; error: string }
  | { session: AuthedMemberSession; error: null }
> {
  const session = await getMemberSession();
  if (!session.user?.id) {
    return { session: null, error: "Sign in required." };
  }
  const [user] = await db
    .select({ status: users.status })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user || user.status === "suspended" || user.status === "closed") {
    return { session: null, error: "This account is not active." };
  }
  return { session: session as AuthedMemberSession, error: null };
}
