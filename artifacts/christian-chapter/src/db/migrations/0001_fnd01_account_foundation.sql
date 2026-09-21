-- FND-01 account foundation
-- Reversible: see 0001_fnd01_account_foundation.down.sql
-- Existing founding_members rows are copied as unverified users.

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "first_name" varchar(100),
  "status" varchar(50) DEFAULT 'pending_email_verification' NOT NULL,
  "email_verified_at" timestamp,
  "last_active_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "legacy_founding_member_id" integer
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "email_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "purpose" varchar(40) NOT NULL,
  "token_hash" varchar(64) NOT NULL,
  "expires_at" timestamp NOT NULL,
  "used_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "email_tokens_hash_unique" ON "email_tokens" ("token_hash");
CREATE INDEX IF NOT EXISTS "email_tokens_user_idx" ON "email_tokens" ("user_id");

CREATE TABLE IF NOT EXISTS "founding_applications" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" varchar(50) DEFAULT 'draft' NOT NULL,
  "current_step" integer DEFAULT 1 NOT NULL,
  "first_name" varchar(100),
  "marketing_consent" boolean DEFAULT false NOT NULL,
  "date_of_birth" varchar(10),
  "gender" varchar(50),
  "seeking_gender" text[],
  "uk_region" varchar(100),
  "travel_radius_miles" integer,
  "tradition" varchar(100),
  "church_attendance" varchar(100),
  "faith_centrality" varchar(100),
  "faith_description" text,
  "work_status" varchar(100),
  "family_situation" varchar(100),
  "interests" text[],
  "relationship_goal" varchar(100),
  "open_to_remarriage" boolean,
  "relationship_pace" varchar(50),
  "age_range_min" integer,
  "age_range_max" integer,
  "preferred_distance_miles" integer,
  "meeting_preferences" text,
  "essentials" jsonb,
  "story_prompt_1" text,
  "story_prompt_2" text,
  "story_prompt_3" text,
  "priorities" text[],
  "photo_consent" boolean DEFAULT false,
  "eligibility_acknowledged" boolean DEFAULT false NOT NULL,
  "wizard_payload" jsonb,
  "internal_notes" text,
  "reviewed_at" timestamp,
  "submitted_at" timestamp,
  "hidden_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "founding_applications_user_unique" ON "founding_applications" ("user_id");

CREATE TABLE IF NOT EXISTS "policy_documents" (
  "slug" varchar(50) PRIMARY KEY NOT NULL,
  "title" varchar(200) NOT NULL,
  "version" varchar(50) NOT NULL,
  "effective_date" varchar(40) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "actor_type" varchar(40) NOT NULL,
  "actor_id" varchar(80),
  "action" varchar(100) NOT NULL,
  "entity_type" varchar(80) NOT NULL,
  "entity_id" varchar(80) NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "account_closure_requests" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "reason" varchar(80) NOT NULL,
  "detail" text,
  "status" varchar(40) DEFAULT 'open' NOT NULL,
  "scheduled_delete_at" timestamp,
  "resolved_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "consent_records" ADD COLUMN IF NOT EXISTS "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "consent_records" ADD COLUMN IF NOT EXISTS "withdrawn_at" timestamp;
ALTER TABLE "consent_records" ADD COLUMN IF NOT EXISTS "source" varchar(80);
ALTER TABLE "consent_records" ALTER COLUMN "founding_member_id" DROP NOT NULL;

INSERT INTO "policy_documents" ("slug", "title", "version", "effective_date")
VALUES
  ('privacy', 'Privacy policy', '2026-09-20', '20 September 2026'),
  ('terms', 'Terms of use', '2026-09-20', '20 September 2026'),
  ('cookies', 'Cookie information', '2026-09-20', '20 September 2026')
ON CONFLICT ("slug") DO NOTHING;

-- Copy legacy waitlist rows. Emails remain unverified.
INSERT INTO "users" (
  "email", "first_name", "status", "email_verified_at",
  "created_at", "updated_at", "legacy_founding_member_id"
)
SELECT
  lower(trim("email")),
  "first_name",
  'pending_email_verification',
  NULL,
  "created_at",
  "updated_at",
  "id"
FROM "founding_members"
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "founding_applications" (
  "user_id", "status", "current_step", "first_name", "marketing_consent",
  "date_of_birth", "gender", "seeking_gender", "uk_region", "travel_radius_miles",
  "tradition", "church_attendance", "faith_centrality", "faith_description",
  "work_status", "family_situation", "interests", "relationship_goal",
  "open_to_remarriage", "relationship_pace", "age_range_min", "age_range_max",
  "preferred_distance_miles", "meeting_preferences", "essentials",
  "story_prompt_1", "story_prompt_2", "story_prompt_3", "priorities",
  "photo_consent", "internal_notes", "reviewed_at", "submitted_at",
  "created_at", "updated_at"
)
SELECT
  u."id",
  CASE fm."status"
    WHEN 'active' THEN 'accepted'
    WHEN 'flagged' THEN 'flagged'
    WHEN 'declined' THEN 'declined'
    ELSE 'submitted'
  END,
  10,
  fm."first_name",
  fm."marketing_consent",
  fm."date_of_birth",
  fm."gender",
  fm."seeking_gender",
  fm."uk_region",
  fm."travel_radius_miles",
  fm."tradition",
  fm."church_attendance",
  fm."faith_centrality",
  fm."faith_description",
  fm."work_status",
  fm."family_situation",
  fm."interests",
  fm."relationship_goal",
  fm."open_to_remarriage",
  fm."relationship_pace",
  fm."age_range_min",
  fm."age_range_max",
  fm."preferred_distance_miles",
  fm."meeting_preferences",
  fm."essentials",
  fm."story_prompt_1",
  fm."story_prompt_2",
  fm."story_prompt_3",
  fm."priorities",
  fm."photo_consent",
  fm."internal_notes",
  fm."reviewed_at",
  fm."created_at",
  fm."created_at",
  fm."updated_at"
FROM "founding_members" fm
JOIN "users" u ON u."legacy_founding_member_id" = fm."id"
ON CONFLICT ("user_id") DO NOTHING;

UPDATE "consent_records" c
SET "user_id" = u."id",
    "source" = COALESCE(c."source", 'legacy_waitlist')
FROM "users" u
WHERE c."founding_member_id" = u."legacy_founding_member_id"
  AND c."user_id" IS NULL;
