import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Permission, StaffRole } from "@/lib/platform/permissions";
import { roleHasPermission } from "@/lib/platform/permissions";

export interface AdminSession {
  admin?: {
    email: string;
    loggedIn: true;
    role: StaffRole;
    staffUserId?: string;
  };
}

function sessionPassword(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to 32+ characters in production.");
  }
  return "dev-placeholder-must-be-32-chars-long!!";
}

export const sessionOptions = {
  password: sessionPassword(),
  cookieName: "cc_admin",
  ttl: 60 * 60 * 8,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
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
  const admin = session.admin;
  if (!admin.role) {
    admin.role = "administrator";
  }
  return session;
}

export async function requireAdminPermission(permission: Permission) {
  const session = await requireAdminSession();
  const role = session.admin?.role ?? "administrator";
  if (!roleHasPermission(role, permission)) {
    redirect("/admin/dashboard");
  }
  return session;
}
