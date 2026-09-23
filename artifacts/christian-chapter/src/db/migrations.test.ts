import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");

describe("GATE-E reversible FND-01 migration", () => {
  const up = readFileSync(path.join(dir, "0001_fnd01_account_foundation.sql"), "utf8");
  const down = readFileSync(path.join(dir, "0001_fnd01_account_foundation.down.sql"), "utf8");

  it("creates identity, application, token, policy, audit and closure tables", () => {
    for (const table of [
      "users",
      "email_tokens",
      "founding_applications",
      "policy_documents",
      "audit_events",
      "account_closure_requests",
    ]) {
      assert.match(up, new RegExp(`CREATE TABLE IF NOT EXISTS "${table}"`));
    }
  });

  it("copies waitlist rows without treating emails as verified", () => {
    assert.match(up, /pending_email_verification/);
    assert.match(up, /"email_verified_at"[\s\S]*NULL/);
    assert.doesNotMatch(up, /DELETE FROM "founding_members"/);
  });

  it("adds MEM-01 residence and chapter columns", () => {
    const mem = readFileSync(path.join(dir, "0004_mem01_profile_fields.sql"), "utf8");
    assert.match(mem, /uk_residence/);
    assert.match(mem, /looking_for/);
    assert.match(mem, /next_chapter/);
  });

  it("adds matching, activity and connection tables", () => {
    const mat = readFileSync(path.join(dir, "0005_mat01_matching.sql"), "utf8");
    for (const table of [
      "matching_rules",
      "recommendation_snapshots",
      "introductions",
      "interests",
      "matches",
      "member_blocks",
      "activity_events",
    ]) {
      assert.match(mat, new RegExp(`CREATE TABLE IF NOT EXISTS "${table}"`));
    }
    assert.match(mat, /mat-01\.1/);
  });

  it("stores a face-check photograph that can be cleared", () => {
    const sql = readFileSync(path.join(dir, "0006_photo_check.sql"), "utf8");
    const down = readFileSync(path.join(dir, "0006_photo_check.down.sql"), "utf8");
    assert.match(sql, /CREATE TABLE IF NOT EXISTS "photo_checks"/);
    assert.match(sql, /"image_data" text/);
    assert.match(sql, /ON DELETE CASCADE/);
    assert.match(down, /DROP TABLE IF EXISTS "photo_checks"/);
  });

  it("records named profile visits and private-browsing settings", () => {
    const sql = readFileSync(path.join(dir, "0007_views_and_settings.sql"), "utf8");
    const down = readFileSync(path.join(dir, "0007_views_and_settings.down.sql"), "utf8");
    assert.match(sql, /CREATE TABLE IF NOT EXISTS "profile_views"/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS "sign_in_events"/);
    assert.match(sql, /private_browsing/);
    assert.match(sql, /subject_email/);
    assert.match(down, /DROP TABLE IF EXISTS "profile_views"/);
    assert.match(down, /DROP TABLE IF EXISTS "sign_in_events"/);
  });

  it("stores photographs, paired conversations and a saved card", () => {
    const sql = readFileSync(path.join(dir, "0008_photos_chat_billing.sql"), "utf8");
    const down = readFileSync(path.join(dir, "0008_photos_chat_billing.down.sql"), "utf8");
    assert.match(sql, /image_data/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS "conversations"/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS "chat_messages"/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS "billing_agreements"/);
    assert.match(down, /DROP TABLE IF EXISTS "conversations"/);
  });

  it("rolls back without dropping founding_members", () => {
    assert.match(down, /DROP TABLE IF EXISTS "users"/);
    assert.match(down, /DROP TABLE IF EXISTS "founding_applications"/);
    assert.doesNotMatch(down, /DROP TABLE IF EXISTS "founding_members"/);
  });
});
