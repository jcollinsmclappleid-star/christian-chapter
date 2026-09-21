import { eq } from "drizzle-orm";
import { db, users, memberProfiles, foundingApplications, staffUsers } from "@/db";
import { isPublicProduction } from "@/lib/platform/runtime";
import { writeAudit } from "@/lib/audit";
import { STAFF_ROLES, type StaffRole } from "@/lib/platform/permissions";
import {
  SYNTHETIC_DOMAIN,
  buildSyntheticSpecs,
  type SeedSpec,
} from "./seed-specs";

function dobForDecade(decade: SeedSpec["decade"]): string {
  const map = { "40s": 1979, "50s": 1969, "60s": 1959, "70s": 1949 };
  return `${map[decade]}-03-15`;
}

function familyFlags(family: SeedSpec["family"]) {
  return {
    dependentChildren: family === "dependent_children",
    adultChildren: family === "adult_children",
    grandchildren: family === "grandchildren",
    familySituation: family === "no_children" ? "No children" : family.replaceAll("_", " "),
  };
}

export async function resetSyntheticSeed() {
  if (isPublicProduction()) {
    throw new Error("Synthetic members cannot be created in public production.");
  }

  const existing = await db.select({ id: users.id, email: users.email }).from(users);
  const synthetic = existing.filter((u) => u.email.endsWith(`@${SYNTHETIC_DOMAIN}`));
  for (const row of synthetic) {
    await db.delete(users).where(eq(users.id, row.id));
  }

  const created = [];
  for (const spec of buildSyntheticSpecs()) {
    const email = `${spec.slug}@${SYNTHETIC_DOMAIN}`;
    const seededAt = new Date();
    const lastActiveAt =
      spec.activity === "inactive"
        ? new Date(seededAt.getTime() - 50 * 86400000)
        : spec.activity === "reactivation"
          ? new Date(seededAt.getTime() - 38 * 86400000)
          : spec.activity === "active_recently"
            ? new Date(seededAt.getTime() - 3 * 86400000)
            : seededAt;

    const [user] = await db
      .insert(users)
      .values({
        email,
        firstName: spec.firstName,
        status: "active_founding_member",
        emailVerifiedAt: seededAt,
        lastActiveAt,
      })
      .returning();

    await db.insert(memberProfiles).values({
      userId: user.id,
      status: spec.activity === "taking_a_break" ? "paused" : spec.activity === "inactive" ? "hidden" : "approved",
      firstName: spec.firstName,
      dateOfBirth: dobForDecade(spec.decade),
      gender: spec.gender,
      seekingGender: spec.gender === "Man" ? ["Women"] : ["Men"],
      aboutMe: `[SYNTHETIC] ${spec.firstName} is a development fixture for ${spec.decade} in ${spec.nation}. Not a real member.`,
      lookingFor: "Someone kind, with a living faith.",
      nextChapter: "Companionship and a shared ordinary life.",
      tradition: spec.tradition,
      churchAttendance: "Most weeks",
      faithCentrality: "Present",
      relationshipGoal: "A committed relationship",
      openToRemarriage: spec.history !== "never_married",
      relationshipHistory: spec.history,
      ...familyFlags(spec.family),
      workStatus: spec.work,
      smoking: spec.slug.endsWith("1") ? "smokes" : "never",
      alcohol: "occasionally",
      ukResidence: "resident",
      ukNation: spec.nation,
      ukRegion: spec.region,
      travelRadiusMiles: spec.travel,
      openToRelocation: spec.travel > 50,
      candidatePools:
        spec.travel > 80
          ? ["nearby", "worth_the_journey", "open_to_distance"]
          : spec.travel > 50
            ? ["nearby", "worth_the_journey"]
            : ["nearby"],
      ageRangeMin: 40,
      ageRangeMax: 90,
      essentials:
        spec.slug.endsWith("7")
          ? [{ factor: "tradition", label: "Christian tradition", tier: "essential" }]
          : [{ factor: "tradition", label: "Christian tradition", tier: "preferred" }],
      planEntitlement: spec.plan,
      activityState: spec.activity === "inactive" ? "inactive" : spec.activity,
      synthetic: true,
      approvedAt: seededAt,
    });

    await db.insert(foundingApplications).values({
      userId: user.id,
      status: "accepted",
      firstName: spec.firstName,
      dateOfBirth: dobForDecade(spec.decade),
      gender: spec.gender,
      ukRegion: spec.region,
      tradition: spec.tradition,
      eligibilityAcknowledged: true,
    }).onConflictDoNothing();

    created.push({ email, userId: user.id, synthetic: true });
  }

  for (const role of STAFF_ROLES) {
    const email = `staff-${role.replaceAll("_", "-")}@${SYNTHETIC_DOMAIN}`;
    await db
      .insert(staffUsers)
      .values({ email, role: role as StaffRole, status: "active" })
      .onConflictDoNothing();
  }

  await writeAudit({
    actorType: "system",
    action: "synthetic_seed_reset",
    entityType: "seed",
    entityId: "synthetic",
    metadata: { count: created.length },
  });

  return { created, domain: SYNTHETIC_DOMAIN, count: created.length };
}
