#!/usr/bin/env node
/**
 * Apply FND-01 SQL against DATABASE_URL.
 * From artifacts/christian-chapter:
 *   node --env-file=.env.local ./scripts/apply-fnd01.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const root = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(root, "../src/db/migrations/0001_fnd01_account_foundation.sql");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const raw = readFileSync(sqlPath, "utf8");
const statements = raw
  .split(/;\s*(?:\n|$)/)
  .map((s) =>
    s
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim(),
  )
  .filter(Boolean);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log(`Applied ${statements.length} statements from 0001_fnd01_account_foundation.sql`);
} finally {
  await pool.end();
}
