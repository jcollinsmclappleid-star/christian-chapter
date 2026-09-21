import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, staffUsers } from "@/db";
import { sessionOptions, type AdminSession } from "@/lib/admin-session";
import {
  roleHasPermission,
  type Permission,
  type StaffRole,
  STAFF_ROLES,
} from "@/lib/platform/permissions";
import { isPublicProduction } from "@/lib/platform/runtime";

export function sessionRole(session: AdminSession): StaffRole {
  return session.admin?.role ?? "administrator";
}

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}

export async function requireAdminApi(permission?: Permission): Promise<
  | { session: null; error: string; status: 401 | 403 }
  | { session: AdminSession & { admin: NonNullable<AdminSession["admin"]> }; error: null; status: 200 }
> {
  const session = await getAdminSession();
  if (!session.admin?.loggedIn) {
    return { session: null, error: "Admin sign-in required.", status: 401 };
  }
  const role = sessionRole(session);
  if (permission && !roleHasPermission(role, permission)) {
    return { session: null, error: "Not permitted for this role.", status: 403 };
  }
  return {
    session: session as AdminSession & { admin: NonNullable<AdminSession["admin"]> },
    error: null,
    status: 200,
  };
}

function isStaffRole(value: string): value is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(value);
}

export async function lookupStaffByEmail(email: string) {
  const normalised = email.trim().toLowerCase();
  const [row] = await db
    .select()
    .from(staffUsers)
    .where(eq(staffUsers.email, normalised))
    .limit(1);
  if (!row || row.status !== "active") return null;
  const role = isStaffRole(row.role) ? row.role : "support";
  return { staffUserId: row.id, role, email: row.email };
}

export async function upsertBootstrapAdministrator(email: string) {
  const existing = await lookupStaffByEmail(email);
  if (existing) return existing;
  const [created] = await db
    .insert(staffUsers)
    .values({
      email: email.trim().toLowerCase(),
      role: "administrator",
      status: "active",
    })
    .returning();
  return { staffUserId: created.id, role: "administrator" as StaffRole, email: created.email };
}

/** Development-only: ADMIN_PASSWORD may sign in any active staff_users row. */
export function allowStaffPasswordLogin(): boolean {
  return !isPublicProduction();
}
