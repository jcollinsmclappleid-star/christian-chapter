import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AdminSession {
  admin?: {
    email: string;
    loggedIn: true;
  };
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "dev-placeholder-must-be-32-chars-long!!",
  cookieName: "cc_admin",
  ttl: 60 * 60 * 8, // 8 hours
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

/** Call at the top of every protected server component page. */
export async function requireAdminSession() {
  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions
  );
  if (!session.admin?.loggedIn) {
    redirect("/admin/login");
  }
  return session;
}
