-- Rollback FND-01 tables. Does not delete founding_members.
-- Consent user_id columns remain unless dropped below.

DELETE FROM "account_closure_requests";
DELETE FROM "audit_events";
DELETE FROM "email_tokens";
DELETE FROM "founding_applications";
DELETE FROM "policy_documents";
UPDATE "consent_records" SET "user_id" = NULL;
DELETE FROM "users";

DROP TABLE IF EXISTS "account_closure_requests";
DROP TABLE IF EXISTS "audit_events";
DROP TABLE IF EXISTS "email_tokens";
DROP TABLE IF EXISTS "founding_applications";
DROP TABLE IF EXISTS "policy_documents";
DROP TABLE IF EXISTS "users";

ALTER TABLE "consent_records" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "consent_records" DROP COLUMN IF EXISTS "withdrawn_at";
ALTER TABLE "consent_records" DROP COLUMN IF EXISTS "source";
