#!/usr/bin/env node
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const DOMAIN = "synthetic.christianchapter.invalid";
const FIRST = ["Helen", "Callum", "Rhiannon", "Patrick", "Amira", "Joan", "David", "Mary", "Ibrahim", "Siobhan", "Owen", "Priya"];
const DECADES = ["40s", "50s", "60s", "70s"];
const DOB = { "40s": "1979-03-15", "50s": "1969-03-15", "60s": "1959-03-15", "70s": "1949-03-15" };
const PLACES = [
  { nation: "England", region: "South East England" },
  { nation: "England", region: "Greater London" },
  { nation: "England", region: "North West England" },
  { nation: "Scotland", region: "Scotland" },
  { nation: "Wales", region: "Wales" },
  { nation: "Northern Ireland", region: "Northern Ireland" },
];
const TRADITIONS = ["Anglican / Church of England", "Presbyterian", "Methodist", "Catholic", "Baptist", "Non-denominational"];
const HISTORY = ["never_married", "divorced", "widowed"];
const FAMILY = ["dependent_children", "adult_children", "grandchildren", "no_children"];
const WORK = ["working", "semi_retired", "retired"];
const PLAN = ["free", "member", "plus"];
const ACTIVITY = ["active_now", "active_recently", "reactivation", "taking_a_break", "inactive"];
const ROLES = [
  "support",
  "profile_reviewer",
  "moderator",
  "senior_safety_reviewer",
  "matchmaker",
  "events_operator",
  "finance_billing",
  "content_editor",
  "administrator",
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(`DELETE FROM "users" WHERE "email" LIKE $1`, [`%@${DOMAIN}`]);
  await pool.query(`DELETE FROM "staff_users" WHERE "email" LIKE $1`, [`%@${DOMAIN}`]);

  const now = new Date();
  for (let i = 0; i < 120; i += 1) {
    const place = PLACES[i % PLACES.length];
    const decade = DECADES[i % DECADES.length];
    const firstName = FIRST[i % FIRST.length];
    const gender = i % 5 === 0 || i % 5 === 1 ? "Man" : "Woman";
    const activity = ACTIVITY[i % ACTIVITY.length];
    const travel = [25, 40, 60, 80, 120][i % 5];
    const slug = `syn-${String(i + 1).padStart(3, "0")}-${decade}-${place.nation.slice(0, 2).toLowerCase()}`;
    const lastActiveAt =
      activity === "inactive"
        ? new Date(now.getTime() - 50 * 86400000)
        : activity === "reactivation"
          ? new Date(now.getTime() - 38 * 86400000)
          : activity === "active_recently"
            ? new Date(now.getTime() - 3 * 86400000)
            : now;
    const status = activity === "taking_a_break" ? "paused" : activity === "inactive" ? "hidden" : "approved";
    const pools =
      travel > 80
        ? ["nearby", "worth_the_journey", "open_to_distance"]
        : travel > 50
          ? ["nearby", "worth_the_journey"]
          : ["nearby"];
    const essentials = slug.endsWith("7")
      ? [{ factor: "tradition", label: "Christian tradition", tier: "essential" }]
      : [{ factor: "tradition", label: "Christian tradition", tier: "preferred" }];

    const user = await pool.query(
      `INSERT INTO "users" ("email", "first_name", "status", "email_verified_at", "last_active_at")
       VALUES ($1, $2, 'active_founding_member', $3, $4)
       RETURNING "id"`,
      [`${slug}@${DOMAIN}`, firstName, now, lastActiveAt],
    );
    const userId = user.rows[0].id;
    await pool.query(
      `INSERT INTO "member_profiles" (
        "user_id", "status", "first_name", "date_of_birth", "gender", "seeking_gender",
        "about_me", "looking_for", "next_chapter", "tradition", "church_attendance",
        "faith_centrality", "relationship_goal", "open_to_remarriage", "relationship_history",
        "dependent_children", "adult_children", "grandchildren", "family_situation",
        "work_status", "smoking", "alcohol", "uk_residence", "uk_nation", "uk_region",
        "travel_radius_miles", "open_to_relocation", "candidate_pools", "age_range_min",
        "age_range_max", "essentials", "plan_entitlement", "activity_state", "synthetic", "approved_at"
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Most weeks','Present','A committed relationship',$11,$12,
        $13,$14,$15,$16,$17,$18,'occasionally','resident',$19,$20,$21,$22,$23,40,90,$24,$25,$26,true,$27
      )`,
      [
        userId,
        status,
        firstName,
        DOB[decade],
        gender,
        gender === "Man" ? ["Women"] : ["Men"],
        `[SYNTHETIC] ${firstName} is a development fixture for ${decade} in ${place.nation}. Not a real member.`,
        "Someone kind, with a living faith.",
        "Companionship and a shared ordinary life.",
        TRADITIONS[i % TRADITIONS.length],
        HISTORY[i % HISTORY.length] !== "never_married",
        HISTORY[i % HISTORY.length],
        FAMILY[i % FAMILY.length] === "dependent_children",
        FAMILY[i % FAMILY.length] === "adult_children",
        FAMILY[i % FAMILY.length] === "grandchildren",
        FAMILY[i % FAMILY.length] === "no_children" ? "No children" : FAMILY[i % FAMILY.length].replaceAll("_", " "),
        WORK[i % WORK.length],
        slug.endsWith("1") ? "smokes" : "never",
        place.nation,
        place.region,
        travel,
        travel > 50,
        pools,
        JSON.stringify(essentials),
        PLAN[i % PLAN.length],
        activity === "inactive" ? "inactive" : activity,
        now,
      ],
    );
  }

  for (const role of ROLES) {
    await pool.query(
      `INSERT INTO "staff_users" ("email", "role", "status")
       VALUES ($1, $2, 'active')
       ON CONFLICT ("email") DO NOTHING`,
      [`staff-${role.replaceAll("_", "-")}@${DOMAIN}`, role],
    );
  }

  console.log("Seeded 120 synthetic members and staff roles.");
} finally {
  await pool.end();
}
