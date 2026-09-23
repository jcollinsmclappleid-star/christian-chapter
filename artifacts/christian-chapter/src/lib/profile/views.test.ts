import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hasPrivateBrowsingEntitlement, isBrowsingPrivately } from "./private-browsing.ts";
import { PROFILE_VIEW_DEDUPE_MS, viewIsFreshDuplicate } from "./visit-policy.ts";

describe("private browsing", () => {
  it("treats incognito and plus as entitled, and free as not", () => {
    assert.equal(hasPrivateBrowsingEntitlement("incognito"), true);
    assert.equal(hasPrivateBrowsingEntitlement("plus"), true);
    assert.equal(hasPrivateBrowsingEntitlement("free"), false);
    assert.equal(hasPrivateBrowsingEntitlement("member"), false);
  });

  it("is on only when the member is entitled and has switched it on", () => {
    assert.equal(isBrowsingPrivately({ planEntitlement: "incognito", privateBrowsing: true }), true);
    assert.equal(isBrowsingPrivately({ planEntitlement: "incognito", privateBrowsing: false }), false);
    assert.equal(isBrowsingPrivately({ planEntitlement: "free", privateBrowsing: true }), false);
  });
});

describe("profile view dedupe", () => {
  it("records again after twelve hours", () => {
    const now = new Date("2026-09-23T18:00:00.000Z");
    const recent = new Date(now.getTime() - PROFILE_VIEW_DEDUPE_MS + 1000);
    const stale = new Date(now.getTime() - PROFILE_VIEW_DEDUPE_MS - 1000);
    assert.equal(viewIsFreshDuplicate(null, now), false);
    assert.equal(viewIsFreshDuplicate(recent, now), true);
    assert.equal(viewIsFreshDuplicate(stale, now), false);
  });
});
