-- Bootstrap the original waitlist tables so FND-01 can apply on a clean database.
-- founding_members is retained; new writes go to users + founding_applications.

CREATE TABLE IF NOT EXISTS "founding_members" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" varchar(100) NOT NULL,
  "email" varchar(255) NOT NULL,
  "marketing_consent" boolean DEFAULT false NOT NULL,
  "date_of_birth" varchar(10) NOT NULL,
  "gender" varchar(50) NOT NULL,
  "seeking_gender" text[] NOT NULL,
  "uk_region" varchar(100) NOT NULL,
  "travel_radius_miles" integer NOT NULL,
  "tradition" varchar(100) NOT NULL,
  "church_attendance" varchar(100) NOT NULL,
  "faith_centrality" varchar(100) NOT NULL,
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
  "status" varchar(50) DEFAULT 'pending' NOT NULL,
  "internal_notes" text,
  "reviewed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "founding_members_email_unique" ON "founding_members" ("email");

CREATE TABLE IF NOT EXISTS "consent_records" (
  "id" serial PRIMARY KEY NOT NULL,
  "founding_member_id" integer REFERENCES "founding_members"("id") ON DELETE CASCADE,
  "consent_type" varchar(100) NOT NULL,
  "consent_version" varchar(50) NOT NULL,
  "granted" boolean NOT NULL,
  "granted_at" timestamp DEFAULT now() NOT NULL,
  "ip_address" varchar(45),
  "user_agent" text
);
