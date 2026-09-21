#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const root = dirname(fileURLToPath(import.meta.url));
const files = [
  "0002_platform_foundation.sql",
  "0003_member_profile_presentation.sql",
  "0004_mem01_profile_fields.sql",
  "0005_mat01_matching.sql",
];

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

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  for (const file of files) {
    const raw = readFileSync(join(root, "../src/db/migrations", file), "utf8");
    const statements = statementsFrom(raw);
    for (const statement of statements) {
      await pool.query(statement);
    }
    console.log(`Applied ${statements.length} statements from ${file}`);
  }
} finally {
  await pool.end();
}
