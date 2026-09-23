-- Photograph bytes, admin decisions, paired conversations, and a saved card.
-- Reversible: 0008_photos_chat_billing.down.sql

ALTER TABLE "member_photos" ADD COLUMN IF NOT EXISTS "image_data" text;

CREATE TABLE IF NOT EXISTS "conversations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_low_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "user_high_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "conversations_pair_unique" ON "conversations" ("user_low_id", "user_high_id");

CREATE TABLE IF NOT EXISTS "chat_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "conversation_id" uuid NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
  "sender_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "body" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "chat_messages_conversation_idx" ON "chat_messages" ("conversation_id", "created_at");

CREATE TABLE IF NOT EXISTS "billing_agreements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "stripe_customer_id" varchar(80),
  "stripe_subscription_id" varchar(80),
  "status" varchar(40) DEFAULT 'none' NOT NULL,
  "collection_on" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "billing_agreements_user_unique" ON "billing_agreements" ("user_id");
