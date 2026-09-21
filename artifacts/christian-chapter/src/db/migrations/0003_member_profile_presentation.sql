-- Profile prompts and staff review notes for MEM-01 presentation
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "prompts" jsonb;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "review_notes" text;
