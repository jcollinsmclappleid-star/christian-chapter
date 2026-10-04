#!/usr/bin/env node
/**
 * Messaging system checks: seal, retention, read receipts, purge, block visibility.
 * Uses journey seed conversation when present (pnpm db:seed:journey).
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { openMessage, sealMessage } from "../src/lib/chat/seal.ts";
import { readMessageExpiry, unreadMessageExpiry, REPORT_EVIDENCE_DAYS } from "../src/lib/chat/retention.ts";
import { containsProfanity } from "../src/lib/language/profanity.ts";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const DOMAIN = "synthetic.christianchapter.invalid";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const steps = [];

function pass(name, ok, detail) {
  steps.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

function orderedPair(a, b) {
  return a < b ? [a, b] : [b, a];
}

try {
  // --- unit-level (same modules as API) ---
  const plain = "Would you like coffee after the service?";
  const sealed = sealMessage(plain);
  pass("seal hides plain text in storage", !sealed.includes(plain) && openMessage(sealed) === plain);
  pass("profanity gate rejects offensive send", containsProfanity("what the fuck"));
  pass("profanity gate allows ordinary text", !containsProfanity(plain));

  const sentAt = new Date("2026-06-01T12:00:00.000Z");
  const unreadExp = unreadMessageExpiry(sentAt);
  pass("unread expiry is 30 days after send", unreadExp.toISOString() === "2026-07-01T12:00:00.000Z");

  const firstRead = new Date("2026-06-20T12:00:00.000Z");
  const readExp = readMessageExpiry(firstRead);
  pass("read expiry is 7 days after first read", readExp.toISOString() === "2026-06-27T12:00:00.000Z");

  // --- database (journey fixtures) ---
  const users = await pool.query(
    `SELECT u.id, u.email, mp.gender FROM users u
     INNER JOIN member_profiles mp ON mp.user_id = u.id
     WHERE u.email LIKE $1 ORDER BY u.email`,
    [`%@${DOMAIN}`],
  );
  pass("journey members present", users.rows.length >= 2, `count=${users.rows.length}`);

  const man = users.rows.find((r) => r.gender === "Man");
  const woman = users.rows.find((r) => r.gender === "Woman");
  if (!man || !woman) {
    console.error("Run pnpm db:seed:journey first.");
    process.exit(1);
  }

  const [low, high] = orderedPair(man.id, woman.id);
  let convo = await pool.query(
    `SELECT id FROM conversations WHERE user_low_id = $1 AND user_high_id = $2`,
    [low, high],
  );
  if (convo.rows.length === 0) {
    convo = await pool.query(
      `INSERT INTO conversations (user_low_id, user_high_id) VALUES ($1, $2) RETURNING id`,
      [low, high],
    );
  }
  const conversationId = convo.rows[0].id;
  pass("conversation exists", Boolean(conversationId));

  const now = new Date();
  const testBody = "Messaging test — sealed at " + now.toISOString();
  const inserted = await pool.query(
    `INSERT INTO chat_messages (conversation_id, sender_user_id, body, expires_at)
     VALUES ($1, $2, $3, $4) RETURNING id, body, expires_at`,
    [conversationId, man.id, sealMessage(testBody), unreadMessageExpiry(now)],
  );
  const msgId = inserted.rows[0].id;
  pass("outbound message stored sealed", openMessage(inserted.rows[0].body) === testBody);

  // Recipient opens thread: mark first read + shorten expiry (mirrors listChatMessages)
  const readNow = new Date(now.getTime() + 60_000);
  await pool.query(
    `UPDATE chat_messages SET first_read_at = $1, expires_at = $2
     WHERE id = $3 AND first_read_at IS NULL AND sender_user_id <> $4`,
    [readNow, readMessageExpiry(readNow), msgId, woman.id],
  );
  const afterRead = await pool.query(`SELECT expires_at, first_read_at FROM chat_messages WHERE id = $1`, [msgId]);
  pass(
    "first read sets 7-day retention",
    afterRead.rows[0].first_read_at && readMessageExpiry(readNow).getTime() === new Date(afterRead.rows[0].expires_at).getTime(),
  );

  // Purge expired
  const stale = await pool.query(
    `INSERT INTO chat_messages (conversation_id, sender_user_id, body, expires_at)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [conversationId, woman.id, sealMessage("expired fixture"), new Date("2020-01-01T00:00:00.000Z")],
  );
  const purge = await pool.query(
    `DELETE FROM chat_messages WHERE expires_at <= $1 RETURNING id`,
    [now],
  );
  pass("purge removes expired messages", purge.rows.some((r) => r.id === stale.rows[0].id));

  const live = await pool.query(
    `SELECT count(*)::int AS n FROM chat_messages WHERE conversation_id = $1 AND expires_at > $2`,
    [conversationId, now],
  );
  pass("test message still live after purge", live.rows[0].n >= 1);

  // Block: conversation hidden from list logic (blocked pair)
  await pool.query(
    `INSERT INTO member_blocks (blocker_user_id, blocked_user_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [woman.id, man.id],
  );
  const blocks = await pool.query(
    `SELECT 1 FROM member_blocks WHERE blocker_user_id = $1 AND blocked_user_id = $2`,
    [woman.id, man.id],
  );
  pass("block recorded for pair", blocks.rows.length === 1);
  await pool.query(`DELETE FROM member_blocks WHERE blocker_user_id = $1 AND blocked_user_id = $2`, [
    woman.id,
    man.id,
  ]);

  // Report evidence retention window
  pass("report evidence window is 90 days", REPORT_EVIDENCE_DAYS === 90);

  if (steps.some((s) => !s.ok)) {
    console.error("\nMessaging tests failed.");
    process.exit(1);
  }
  console.log("\nAll messaging checks passed.");
} finally {
  await pool.end();
}
