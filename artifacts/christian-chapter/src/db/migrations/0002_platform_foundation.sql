-- FND-01 supplement: full-platform foundation (flags/roles/jobs/profiles)
-- Reversible: 0002_platform_foundation.down.sql

CREATE TABLE IF NOT EXISTS "staff_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "role" varchar(50) NOT NULL,
  "status" varchar(40) DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "staff_users_email_unique" ON "staff_users" ("email");

CREATE TABLE IF NOT EXISTS "jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "type" varchar(80) NOT NULL,
  "payload" jsonb NOT NULL,
  "status" varchar(40) DEFAULT 'queued' NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "max_attempts" integer DEFAULT 5 NOT NULL,
  "run_after" timestamp DEFAULT now() NOT NULL,
  "locked_at" timestamp,
  "last_error" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "completed_at" timestamp
);
CREATE INDEX IF NOT EXISTS "jobs_status_run_idx" ON "jobs" ("status", "run_after");

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
  "channel" varchar(40) NOT NULL,
  "template" varchar(80) NOT NULL,
  "payload" jsonb,
  "status" varchar(40) DEFAULT 'queued' NOT NULL,
  "last_error" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "sent_at" timestamp
);
CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" ("user_id");

CREATE TABLE IF NOT EXISTS "provider_results" (
  "id" serial PRIMARY KEY NOT NULL,
  "feature" varchar(80) NOT NULL,
  "adapter" varchar(80) NOT NULL,
  "state" varchar(40) NOT NULL,
  "sandbox" boolean DEFAULT true NOT NULL,
  "entity_type" varchar(80) NOT NULL,
  "entity_id" varchar(80) NOT NULL,
  "message" text,
  "payload" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "provider_results_entity_idx" ON "provider_results" ("entity_type", "entity_id");

CREATE TABLE IF NOT EXISTS "member_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" varchar(40) DEFAULT 'draft' NOT NULL,
  "moderation_status" varchar(40) DEFAULT 'clear' NOT NULL,
  "current_section" varchar(40) DEFAULT 'about' NOT NULL,
  "first_name" varchar(100),
  "date_of_birth" varchar(10),
  "gender" varchar(50),
  "seeking_gender" text[],
  "about_me" text,
  "tradition" varchar(100),
  "church_attendance" varchar(100),
  "faith_centrality" varchar(100),
  "faith_description" text,
  "relationship_goal" varchar(100),
  "open_to_remarriage" boolean,
  "relationship_pace" varchar(50),
  "relationship_history" varchar(80),
  "family_situation" varchar(100),
  "dependent_children" boolean,
  "adult_children" boolean,
  "grandchildren" boolean,
  "work_status" varchar(100),
  "interests" text[],
  "future_children" varchar(80),
  "uk_nation" varchar(40),
  "uk_region" varchar(100),
  "travel_radius_miles" integer,
  "open_to_relocation" boolean,
  "candidate_pools" text[],
  "essentials" jsonb,
  "visibility" jsonb,
  "plan_entitlement" varchar(20) DEFAULT 'free' NOT NULL,
  "activity_state" varchar(40) DEFAULT 'active_now' NOT NULL,
  "synthetic" boolean DEFAULT false NOT NULL,
  "submitted_at" timestamp,
  "approved_at" timestamp,
  "hidden_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "member_profiles_user_unique" ON "member_profiles" ("user_id");
CREATE INDEX IF NOT EXISTS "member_profiles_status_idx" ON "member_profiles" ("status");

CREATE TABLE IF NOT EXISTS "member_photos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "profile_id" uuid NOT NULL REFERENCES "member_profiles"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "position" integer NOT NULL,
  "storage_key" varchar(255) NOT NULL,
  "moderation_status" varchar(40) DEFAULT 'pending' NOT NULL,
  "verification_status" varchar(40) DEFAULT 'unverified' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "member_media" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "profile_id" uuid NOT NULL REFERENCES "member_profiles"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "kind" varchar(20) NOT NULL,
  "storage_key" varchar(255) NOT NULL,
  "moderation_status" varchar(40) DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_checks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "kind" varchar(40) NOT NULL,
  "state" varchar(40) NOT NULL,
  "adapter" varchar(80) NOT NULL,
  "sandbox" boolean DEFAULT true NOT NULL,
  "expires_at" timestamp,
  "payload" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "verification_checks_user_idx" ON "verification_checks" ("user_id", "kind");
