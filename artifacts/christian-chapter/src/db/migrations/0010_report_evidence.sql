-- A reported message is copied here and kept for 90 days.
-- The live message still expires on its own clock.
-- Reversible: 0010_report_evidence.down.sql

CREATE TABLE IF NOT EXISTS "report_evidence" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "report_id" uuid NOT NULL REFERENCES "member_reports"("id") ON DELETE CASCADE,
  "message_id" uuid,
  "body" text NOT NULL,
  "captured_at" timestamp DEFAULT now() NOT NULL,
  "retain_until" timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS "report_evidence_retain_idx" ON "report_evidence" ("retain_until");
