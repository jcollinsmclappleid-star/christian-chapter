-- MAT-01 / ACT-01 / CON-01: matching, activity, interests, matches
-- Reversible: 0005_mat01_matching.down.sql

ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "age_range_min" integer;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "age_range_max" integer;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "break_conversation_policy" varchar(40) DEFAULT 'preserve';
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "preference_revision" integer DEFAULT 0 NOT NULL;

CREATE TABLE IF NOT EXISTS "matching_rules" (
  "version" varchar(40) PRIMARY KEY NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "matching_rules" ("version", "notes")
VALUES (
  'mat-01.1',
  'Reciprocal essentials, three distance pools, finite introductions, 90-day decline suppression.'
)
ON CONFLICT ("version") DO NOTHING;

CREATE TABLE IF NOT EXISTS "recommendation_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "viewer_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "rules_version" varchar(40) NOT NULL,
  "generated_at" timestamp DEFAULT now() NOT NULL,
  "clock_at" timestamp NOT NULL,
  "expires_at" timestamp,
  "payload" jsonb NOT NULL
);
CREATE INDEX IF NOT EXISTS "recommendation_snapshots_viewer_idx"
  ON "recommendation_snapshots" ("viewer_user_id", "generated_at");

CREATE TABLE IF NOT EXISTS "introductions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "snapshot_id" uuid NOT NULL REFERENCES "recommendation_snapshots"("id") ON DELETE CASCADE,
  "viewer_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "candidate_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "pool" varchar(40) NOT NULL,
  "alignment_label" varchar(40) NOT NULL,
  "why" jsonb NOT NULL,
  "worth_discussing" jsonb NOT NULL,
  "rank" integer NOT NULL,
  "score" integer NOT NULL,
  "exploration" boolean DEFAULT false NOT NULL,
  "status" varchar(40) DEFAULT 'presented' NOT NULL,
  "presented_at" timestamp DEFAULT now() NOT NULL,
  "acted_at" timestamp,
  "expires_at" timestamp
);
CREATE INDEX IF NOT EXISTS "introductions_viewer_idx" ON "introductions" ("viewer_user_id", "status");
CREATE INDEX IF NOT EXISTS "introductions_candidate_idx" ON "introductions" ("candidate_user_id");

CREATE TABLE IF NOT EXISTS "interests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "from_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "to_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "introduction_id" uuid REFERENCES "introductions"("id") ON DELETE SET NULL,
  "kind" varchar(20) NOT NULL,
  "status" varchar(40) DEFAULT 'open' NOT NULL,
  "preference_hash" varchar(200),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "expires_at" timestamp
);
CREATE UNIQUE INDEX IF NOT EXISTS "interests_pair_unique" ON "interests" ("from_user_id", "to_user_id");
CREATE INDEX IF NOT EXISTS "interests_to_idx" ON "interests" ("to_user_id", "kind");

CREATE TABLE IF NOT EXISTS "matches" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_a_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "user_b_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" varchar(40) DEFAULT 'open' NOT NULL,
  "closed_reason" varchar(80),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "closed_at" timestamp
);
CREATE UNIQUE INDEX IF NOT EXISTS "matches_pair_unique" ON "matches" ("user_a_id", "user_b_id");

CREATE TABLE IF NOT EXISTS "member_blocks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "blocker_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "blocked_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "member_blocks_pair_unique"
  ON "member_blocks" ("blocker_user_id", "blocked_user_id");

CREATE TABLE IF NOT EXISTS "member_reports" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "reporter_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "reported_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "source" varchar(40) NOT NULL,
  "reason" varchar(80) NOT NULL,
  "detail" text,
  "status" varchar(40) DEFAULT 'open' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "activity_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "kind" varchar(40) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "activity_events_user_idx" ON "activity_events" ("user_id", "created_at");
