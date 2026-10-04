import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readMessageExpiry, unreadMessageExpiry } from "./retention.ts";

describe("message retention", () => {
  it("deletes an unread message 30 days after it is sent", () => {
    const sent = new Date("2026-01-01T00:00:00.000Z");
    assert.equal(unreadMessageExpiry(sent).toISOString(), "2026-01-31T00:00:00.000Z");
  });

  it("deletes a message seven days after the first read, even if that is later than the unread date", () => {
    const sent = new Date("2026-01-01T00:00:00.000Z");
    const firstRead = new Date("2026-01-30T00:00:00.000Z");
    assert.equal(readMessageExpiry(firstRead).toISOString(), "2026-02-06T00:00:00.000Z");
    assert.ok(readMessageExpiry(firstRead).getTime() > unreadMessageExpiry(sent).getTime());
  });
});
