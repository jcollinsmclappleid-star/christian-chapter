import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeApplicationStatusFilter } from "./admin-status.ts";

describe("legacy waitlist status mapping", () => {
  it("maps pending to submitted and active to accepted", () => {
    assert.equal(normalizeApplicationStatusFilter("pending"), "submitted");
    assert.equal(normalizeApplicationStatusFilter("active"), "accepted");
    assert.equal(normalizeApplicationStatusFilter("flagged"), "flagged");
  });
});
