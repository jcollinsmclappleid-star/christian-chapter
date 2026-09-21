export const STAFF_ROLES = [
  "support",
  "profile_reviewer",
  "moderator",
  "senior_safety_reviewer",
  "matchmaker",
  "events_operator",
  "finance_billing",
  "content_editor",
  "administrator",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const PERMISSIONS = [
  "applications.read",
  "applications.review",
  "closures.manage",
  "profiles.read",
  "profiles.review",
  "identity.evidence.read",
  "messages.read",
  "moderation.act",
  "safety.sanction",
  "matchmaking.notes",
  "matchmaking.operate",
  "billing.read",
  "billing.operate",
  "events.operate",
  "content.edit",
  "analytics.read",
  "jobs.run",
  "providers.operate",
  "seed.manage",
  "staff.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  support: ["applications.read", "profiles.read", "closures.manage", "analytics.read"],
  profile_reviewer: ["applications.read", "applications.review", "profiles.read", "profiles.review"],
  moderator: [
    "profiles.read",
    "messages.read",
    "moderation.act",
    "applications.read",
  ],
  senior_safety_reviewer: [
    "profiles.read",
    "identity.evidence.read",
    "messages.read",
    "moderation.act",
    "safety.sanction",
    "applications.read",
  ],
  matchmaker: ["profiles.read", "matchmaking.notes", "matchmaking.operate"],
  events_operator: ["events.operate", "profiles.read"],
  finance_billing: ["billing.read", "billing.operate"],
  content_editor: ["content.edit"],
  administrator: [...PERMISSIONS],
};

export function roleHasPermission(role: StaffRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function permissionsForRole(role: StaffRole): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

/** One generic admin must not be the only model — this matrix is the source of truth. */
export function permissionMatrix() {
  return STAFF_ROLES.map((role) => ({
    role,
    permissions: permissionsForRole(role),
  }));
}
