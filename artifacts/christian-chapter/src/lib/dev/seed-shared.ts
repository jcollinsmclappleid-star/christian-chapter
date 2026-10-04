import { eq } from "drizzle-orm";
import { db, users, memberProfiles, memberPhotos, foundingApplications, staffUsers } from "@/db";
import { STAFF_ROLES, type StaffRole } from "@/lib/platform/permissions";
import { SYNTHETIC_DOMAIN, type SeedSpec } from "./seed-specs.ts";

/** Minimal JPEG (1×1) as base64 — enough for profile photo routes in dev. */
export const JOURNEY_PHOTO_BASE64 =
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

export function dobForDecade(decade: SeedSpec["decade"]): string {
  const map = { "40s": 1979, "50s": 1969, "60s": 1959, "70s": 1949 };
  return `${map[decade]}-03-15`;
}

export function familyFlags(family: SeedSpec["family"]) {
  return {
    dependentChildren: family === "dependent_children",
    adultChildren: family === "adult_children",
    grandchildren: family === "grandchildren",
    familySituation: family === "no_children" ? "No children" : family.replaceAll("_", " "),
  };
}

export async function clearSyntheticDomain() {
  const existing = await db.select({ id: users.id, email: users.email }).from(users);
  const synthetic = existing.filter((u) => u.email.endsWith(`@${SYNTHETIC_DOMAIN}`));
  for (const row of synthetic) {
    await db.delete(users).where(eq(users.id, row.id));
  }
}

export async function insertJourneyClearPhoto(profileId: string, userId: string, slug: string) {
  await db.insert(memberPhotos).values({
    profileId,
    userId,
    position: 0,
    storageKey: `journey/${slug}.jpg`,
    imageData: JOURNEY_PHOTO_BASE64,
    moderationStatus: "clear",
    verificationStatus: "verified",
  });
}

export async function seedSyntheticStaff() {
  for (const role of STAFF_ROLES) {
    const email = `staff-${role.replaceAll("_", "-")}@${SYNTHETIC_DOMAIN}`;
    await db
      .insert(staffUsers)
      .values({ email, role: role as StaffRole, status: "active" })
      .onConflictDoNothing();
  }
}

export async function insertFoundingApplication(userId: string, spec: SeedSpec) {
  await db
    .insert(foundingApplications)
    .values({
      userId,
      status: "accepted",
      firstName: spec.firstName,
      dateOfBirth: dobForDecade(spec.decade),
      gender: spec.gender,
      ukRegion: spec.region,
      tradition: spec.tradition,
      eligibilityAcknowledged: true,
    })
    .onConflictDoNothing();
}
