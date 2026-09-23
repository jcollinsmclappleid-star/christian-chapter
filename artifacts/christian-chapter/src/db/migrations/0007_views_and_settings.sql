-- Named profile visits, recent sign-ins, private browsing, and email-change target.
-- Reversible: 0007_views_and_settings.down.sql

CREATE TABLE IF NOT EXISTS "profile_views" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "viewer_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "viewed_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "source" varchar(40) DEFAULT 'introduction' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "profile_views_viewed_idx" ON "profile_views" ("viewed_user_id", "created_at");
CREATE INDEX IF NOT EXISTS "profile_views_pair_idx" ON "profile_views" ("viewer_user_id", "viewed_user_id", "created_at");

CREATE TABLE IF NOT EXISTS "sign_in_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "user_agent" varchar(200),
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "sign_in_events_user_idx" ON "sign_in_events" ("user_id", "created_at");

ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "private_browsing" boolean DEFAULT false NOT NULL;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "notify_introductions" boolean DEFAULT true NOT NULL;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "notify_profile_views" boolean DEFAULT true NOT NULL;

ALTER TABLE "email_tokens" ADD COLUMN IF NOT EXISTS "subject_email" varchar(255);
