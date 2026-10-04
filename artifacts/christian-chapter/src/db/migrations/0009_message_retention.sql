-- Message retention. Unread messages expire 30 days after sending.
-- The first time the other member opens them, expiry becomes 7 days after that read.
-- Existing rows are treated as unread. No invented read time.
-- Reversible: 0009_message_retention.down.sql

ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "first_read_at" timestamp;
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;

UPDATE "chat_messages"
SET "expires_at" = "created_at" + interval '30 days'
WHERE "expires_at" IS NULL;

ALTER TABLE "chat_messages" ALTER COLUMN "expires_at" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "chat_messages_expires_idx" ON "chat_messages" ("expires_at");
