ALTER TABLE "email_tokens" DROP COLUMN IF EXISTS "subject_email";
ALTER TABLE "member_profiles" DROP COLUMN IF EXISTS "notify_profile_views";
ALTER TABLE "member_profiles" DROP COLUMN IF EXISTS "notify_introductions";
ALTER TABLE "member_profiles" DROP COLUMN IF EXISTS "private_browsing";
DROP TABLE IF EXISTS "sign_in_events";
DROP TABLE IF EXISTS "profile_views";
