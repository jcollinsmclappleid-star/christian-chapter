DROP INDEX IF EXISTS "chat_messages_expires_idx";
ALTER TABLE "chat_messages" DROP COLUMN IF EXISTS "expires_at";
ALTER TABLE "chat_messages" DROP COLUMN IF EXISTS "first_read_at";
