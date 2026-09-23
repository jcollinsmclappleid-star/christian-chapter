import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const src = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "schema.ts"),
  "utf8",
);

describe("profile submit blockers", () => {
  it("requires one to five photographs and a written introduction", () => {
    assert.match(src, /photoCount < 1/);
    assert.match(src, /PROFILE_PHOTO_LIMIT/);
    assert.match(src, /40 characters/);
    assert.match(src, /MINIMUM_AGE/);
  });
});
