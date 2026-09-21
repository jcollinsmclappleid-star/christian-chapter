-- MEM-01 / FND-CHECK: residence, editorial chapters, lifestyle
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "looking_for" text;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "next_chapter" text;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "caring_responsibilities" text;
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "smoking" varchar(40);
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "alcohol" varchar(40);
ALTER TABLE "member_profiles" ADD COLUMN IF NOT EXISTS "uk_residence" varchar(40);
