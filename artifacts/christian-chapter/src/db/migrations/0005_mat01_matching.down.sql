-- Reverse MAT-01 / ACT-01 / CON-01 matching tables.

DROP TABLE IF EXISTS "activity_events";
DROP TABLE IF EXISTS "member_reports";
DROP TABLE IF EXISTS "member_blocks";
DROP TABLE IF EXISTS "matches";
DROP TABLE IF EXISTS "interests";
DROP TABLE IF EXISTS "introductions";
DROP TABLE IF EXISTS "recommendation_snapshots";
DROP TABLE IF EXISTS "matching_rules";

ALTER TABLE "member_profiles" DROP COLUMN IF EXISTS "preference_revision";
ALTER TABLE "member_profiles" DROP COLUMN IF EXISTS "break_conversation_policy";
ALTER TABLE "member_profiles" DROP COLUMN IF EXISTS "age_range_max";
ALTER TABLE "member_profiles" DROP COLUMN IF EXISTS "age_range_min";
