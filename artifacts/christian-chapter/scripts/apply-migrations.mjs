#!/usr/bin/env node
/**
 * Apply numbered SQL migrations against DATABASE_URL.
 *   node --env-file=.env.local ./scripts/apply-migrations.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const root = dirname(fileURLToPath(import.meta.url));
const dir = join(root, "../src/db/migrations");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

function statementsFrom(sql) {
  return sql
    .split(/;\s*(?:\n|$)/)
    .map((s) =>
      s
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

const files = readdirSync(dir)
  .filter((name) => /^\d{4}_.+\.sql$/.test(name) && !name.endsWith(".down.sql"))
  .sort();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  for (const file of files) {
    const raw = readFileSync(join(dir, file), "utf8");
    const statements = statementsFrom(raw);
    for (const statement of statements) {
      await pool.query(statement);
    }
    console.log(`Applied ${statements.length} statements from ${file}`);
  }
} finally {
  await pool.end();
}
