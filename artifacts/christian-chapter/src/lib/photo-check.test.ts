import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { imageDueForDeletion, PHOTO_CHECK_HOLD_MS } from "./photo-check.ts";

describe("photo check retention", () => {
  const created = new Date("2026-09-23T08:00:00.000Z");

  it("keeps a pending photograph inside 24 hours", () => {
    const now = new Date(created.getTime() + PHOTO_CHECK_HOLD_MS - 1);
    assert.equal(imageDueForDeletion("pending", created, now), false);
  });

  it("deletes a pending photograph once 24 hours have passed", () => {
    const now = new Date(created.getTime() + PHOTO_CHECK_HOLD_MS);
    assert.equal(imageDueForDeletion("pending", created, now), true);
  });

  it("does not treat a finished check as still holding a photograph", () => {
    const now = new Date(created.getTime() + PHOTO_CHECK_HOLD_MS + 1000);
    assert.equal(imageDueForDeletion("matched", created, now), false);
    assert.equal(imageDueForDeletion("expired", created, now), false);
  });
});
