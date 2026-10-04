#!/usr/bin/env node
/**
 * 20 journey-ready mock members (approved profile, clear photo, founding accepted)
 * plus a concierge-connected demo pair. Runs SQL smoke checks.
 */
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const DOMAIN = "synthetic.christianchapter.invalid";
const JOURNEY_COUNT = 20;
const HAND_PICK_POOL = "handpicked";
const OFFER_ENDS = "2027-02-14T23:59:59.000Z";
const PHOTO_B64 =
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

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
const FAMILY = ["dependent_children", "adult_children", "grandchildren", "no_children"];
const WORK = ["working", "semi_retired", "retired"];
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

function orderedPair(a, b) {
  return a < b ? [a, b] : [b, a];
}

function messageKey() {
  const secret = process.env.SESSION_SECRET;
  const material = secret && secret.length >= 32 ? secret : "dev-placeholder-must-be-32-chars-long!!";
  return createHash("sha256").update(`mcd-message-v1:${material}`).digest();
}

function sealMessage(plain) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", messageKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${enc.toString("base64url")}`;
}

function familySituation(family) {
  if (family === "no_children") return "No children";
  return family.replaceAll("_", " ");
}

async function connectHandPick(client, man, woman, reason) {
  const now = new Date();
  const expiresAt = new Date(OFFER_ENDS);
  const [low, high] = orderedPair(man.userId, woman.userId);

  await client.query(
    `INSERT INTO "matches" ("user_a_id", "user_b_id", "status", "created_at")
     VALUES ($1, $2, 'open', $3)
     ON CONFLICT DO NOTHING`,
    [low, high, now],
  );

  const convo = await client.query(
    `INSERT INTO "conversations" ("user_low_id", "user_high_id", "created_at")
     VALUES ($1, $2, $3)
     ON CONFLICT ("user_low_id", "user_high_id") DO UPDATE SET "user_low_id" = EXCLUDED."user_low_id"
     RETURNING "id"`,
    [low, high, now],
  );
  const conversationId = convo.rows[0].id;

  for (const [viewer, candidate] of [
    [man, woman],
    [woman, man],
  ]) {
    const snap = await client.query(
      `INSERT INTO "recommendation_snapshots"
        ("viewer_user_id", "rules_version", "generated_at", "clock_at", "expires_at", "payload")
       VALUES ($1, $2, $3, $3, $4, $5)
       RETURNING "id"`,
      [
        viewer.userId,
        HAND_PICK_POOL,
        now,
        expiresAt,
        JSON.stringify({ kind: HAND_PICK_POOL, reason, otherUserId: candidate.userId }),
      ],
    );
    await client.query(
      `INSERT INTO "introductions" (
        "snapshot_id", "viewer_user_id", "candidate_user_id", "pool", "alignment_label",
        "why", "worth_discussing", "rank", "score", "exploration", "status", "presented_at", "expires_at"
      ) VALUES ($1,$2,$3,$4,'good_potential',$5,'[]',1,0,false,'presented',$6,$7)`,
      [
        snap.rows[0].id,
        viewer.userId,
        candidate.userId,
        HAND_PICK_POOL,
        JSON.stringify([{ code: "handpicked", text: reason }]),
        now,
        expiresAt,
      ],
    );
  }

  return { conversationId, manEmail: man.email, womanEmail: woman.email };
}

const steps = [];
function pass(name, ok, detail) {
  steps.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

try {
  await pool.query(`DELETE FROM "users" WHERE "email" LIKE $1`, [`%@${DOMAIN}`]);
  await pool.query(`DELETE FROM "staff_users" WHERE "email" LIKE $1`, [`%@${DOMAIN}`]);

  const now = new Date();
  const members = [];

  for (let i = 0; i < JOURNEY_COUNT; i += 1) {
    const place = PLACES[i % PLACES.length];
    const decade = DECADES[i % DECADES.length];
    const firstName = FIRST[i % FIRST.length];
    const gender = i % 5 === 0 || i % 5 === 1 ? "Man" : "Woman";
    const travel = [25, 40, 60, 80, 120][i % 5];
    const slug = `syn-${String(i + 1).padStart(3, "0")}-${decade}-${place.nation.slice(0, 2).toLowerCase()}`;
    const family = FAMILY[i % FAMILY.length];
    const pools = travel > 80 ? ["nearby", "worth_the_journey", "open_to_distance"] : travel > 50 ? ["nearby", "worth_the_journey"] : ["nearby"];

    const user = await pool.query(
      `INSERT INTO "users" ("email", "first_name", "status", "email_verified_at", "last_active_at")
       VALUES ($1, $2, 'active_founding_member', $3, $3)
       RETURNING "id"`,
      [`${slug}@${DOMAIN}`, firstName, now],
    );
    const userId = user.rows[0].id;

    const profile = await pool.query(
      `INSERT INTO "member_profiles" (
        "user_id", "status", "first_name", "date_of_birth", "gender", "seeking_gender",
        "about_me", "looking_for", "next_chapter", "tradition", "church_attendance",
        "faith_centrality", "relationship_goal", "open_to_remarriage", "relationship_history",
        "dependent_children", "adult_children", "grandchildren", "family_situation",
        "work_status", "smoking", "alcohol", "uk_residence", "uk_nation", "uk_region",
        "travel_radius_miles", "open_to_relocation", "candidate_pools", "age_range_min",
        "age_range_max", "essentials", "plan_entitlement", "activity_state", "synthetic",
        "approved_at", "submitted_at"
      ) VALUES (
        $1,'approved',$2,$3,$4,$5,$6,$7,$8,$9,'Most weeks','Present','A committed relationship',true,'divorced',
        $10,$11,$12,$13,$14,'never','occasionally','resident',$15,$16,$17,$18,$19,40,90,$20,'member','active_now',true,$21,$21
      )
      RETURNING "id"`,
      [
        userId,
        firstName,
        DOB[decade],
        gender,
        gender === "Man" ? ["Women"] : ["Men"],
        `[JOURNEY MOCK] ${firstName} — development profile for end-to-end testing.`,
        "Someone steady, kind, and rooted in faith.",
        "Shared Sundays and honest conversation.",
        TRADITIONS[i % TRADITIONS.length],
        family === "dependent_children",
        family === "adult_children",
        family === "grandchildren",
        familySituation(family),
        WORK[i % WORK.length],
        place.nation,
        place.region,
        travel,
        travel > 50,
        pools,
        JSON.stringify([{ factor: "tradition", label: "Christian tradition", tier: "preferred" }]),
        now,
      ],
    );

    await pool.query(
      `INSERT INTO "founding_applications"
        ("user_id", "status", "first_name", "date_of_birth", "gender", "uk_region", "tradition", "eligibility_acknowledged")
       VALUES ($1,'accepted',$2,$3,$4,$5,$6,true)
       ON CONFLICT DO NOTHING`,
      [userId, firstName, DOB[decade], gender, place.region, TRADITIONS[i % TRADITIONS.length]],
    );

    await pool.query(
      `INSERT INTO "member_photos"
        ("profile_id", "user_id", "position", "storage_key", "image_data", "moderation_status", "verification_status")
       VALUES ($1,$2,0,$3,$4,'clear','verified')`,
      [profile.rows[0].id, userId, `journey/${slug}.jpg`, PHOTO_B64],
    );

    members.push({ userId, email: `${slug}@${DOMAIN}`, gender, firstName });
  }

  for (const role of ROLES) {
    await pool.query(
      `INSERT INTO "staff_users" ("email", "role", "status") VALUES ($1, $2, 'active') ON CONFLICT ("email") DO NOTHING`,
      [`staff-${role.replaceAll("_", "-")}@${DOMAIN}`, role],
    );
  }

  const man = members.find((m) => m.gender === "Man");
  const woman = members.find((m) => m.gender === "Woman");
  const reason = "Journey seed: concierge introduction for smoke testing.";
  const demo = man && woman ? await connectHandPick(pool, man, woman, reason) : null;

  console.log(`\nJourney seed: ${JOURNEY_COUNT} members @ ${DOMAIN}`);
  if (demo) {
    console.log("Demo pair (concierge connected):");
    console.log(`  Man:   ${demo.manEmail}`);
    console.log(`  Woman: ${demo.womanEmail}`);
  }
  console.log("\nSign in at /sign-in with any journey email. Dev magic links log to the server console.\n");

  const count = await pool.query(`SELECT count(*)::int AS n FROM "users" WHERE "email" LIKE $1`, [`%@${DOMAIN}`]);
  pass("twenty journey members", count.rows[0].n === JOURNEY_COUNT, `count=${count.rows[0].n}`);

  const photos = await pool.query(
    `SELECT count(*)::int AS n FROM "member_photos" mp
     INNER JOIN "users" u ON u.id = mp.user_id
     WHERE u.email LIKE $1 AND mp.moderation_status = 'clear'`,
    [`%@${DOMAIN}`],
  );
  pass("clear photos for every member", photos.rows[0].n === JOURNEY_COUNT, `clear=${photos.rows[0].n}`);

  if (man && woman) {
    const intros = await pool.query(
      `SELECT count(*)::int AS n FROM "introductions" WHERE "pool" = $1 AND "viewer_user_id" = $2`,
      [HAND_PICK_POOL, man.userId],
    );
    pass("hand-picked intro for demo man", intros.rows[0].n >= 1, `intros=${intros.rows[0].n}`);

    const [low, high] = orderedPair(man.userId, woman.userId);
    const convoCheck = await pool.query(
      `SELECT id FROM "conversations" WHERE "user_low_id" = $1 AND "user_high_id" = $2`,
      [low, high],
    );
    pass("conversation opened for demo pair", convoCheck.rows.length === 1);

    if (convoCheck.rows[0]) {
      const greeting = "Hello — lovely to meet you through the team.";
      const expiresAt = new Date(now.getTime() + 30 * 86400000);
      await pool.query(
        `INSERT INTO "chat_messages" ("conversation_id", "sender_user_id", "body", "expires_at")
         VALUES ($1, $2, $3, $4)`,
        [convoCheck.rows[0].id, man.userId, sealMessage(greeting), expiresAt],
      );
      const msgs = await pool.query(
        `SELECT count(*)::int AS n FROM "chat_messages" WHERE "conversation_id" = $1`,
        [convoCheck.rows[0].id],
      );
      pass("demo message stored", msgs.rows[0].n >= 1);
    }
  }

  if (steps.some((s) => !s.ok)) {
    console.error("\nJourney smoke failed.");
    process.exit(1);
  }
  console.log("\nAll journey smoke checks passed.");
} finally {
  await pool.end();
}
