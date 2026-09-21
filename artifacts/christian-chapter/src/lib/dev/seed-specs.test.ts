import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildSyntheticSpecs, SYNTHETIC_DOMAIN, SYNTHETIC_MEMBER_COUNT } from "./seed-specs.ts";

describe("synthetic seed specs", () => {
  it("builds 120 resettable synthetic members across nations and decades", () => {
    const specs = buildSyntheticSpecs();
    assert.equal(specs.length, SYNTHETIC_MEMBER_COUNT);
    assert.equal(new Set(specs.map((s) => s.slug)).size, 120);
    assert.equal(specs.some((s) => s.nation === "Scotland"), true);
    assert.equal(specs.some((s) => s.nation === "Wales"), true);
    assert.equal(specs.some((s) => s.nation === "Northern Ireland"), true);
    assert.equal(specs.some((s) => s.decade === "70s"), true);
    assert.match(SYNTHETIC_DOMAIN, /synthetic\.christianchapter\.invalid/);
  });
});
