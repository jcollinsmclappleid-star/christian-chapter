import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const src = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "preview.ts"), "utf8");

describe("other-member serializer", () => {
  it("never includes date of birth and hides match-only fields from members", () => {
    assert.doesNotMatch(src, /dateOfBirth:/);
    assert.match(src, /hide\("lookingFor"\)/);
    assert.match(src, /age/);
  });
});
