-- One face-check photograph per member. The image column is cleared
-- when a person decides, after 24 hours, or when the account is closed.
-- Reversible: 0006_photo_check.down.sql

CREATE TABLE IF NOT EXISTS "photo_checks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" varchar(40) DEFAULT 'pending' NOT NULL,
  "image_data" text,
  "content_type" varchar(40),
  "consented_at" timestamp NOT NULL,
  "decided_at" timestamp,
  "image_deleted_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "photo_checks_user_unique" ON "photo_checks" ("user_id");
