import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isDeletionDue } from "./purge-schedule.ts";

describe("member account purge", () => {
  it("waits until the scheduled delete time", () => {
    const now = new Date("2026-10-01T12:00:00Z");
    const scheduled = new Date("2026-10-15T00:00:00Z");
    assert.equal(isDeletionDue(scheduled, now), false);
    assert.equal(isDeletionDue(scheduled, new Date("2026-10-15T00:00:00Z")), true);
    assert.equal(isDeletionDue(null, now), true);
  });
});
