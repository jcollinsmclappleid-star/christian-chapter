import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { anyProfanity, containsProfanity } from "./profanity.ts";

describe("profanity control", () => {
  it("allows ordinary names and profile lines", () => {
    for (const value of ["Dick", "Claire", "Scunthorpe", "classic", "cocktail", "assumption", "I like a quiet parish church"]) {
      assert.equal(containsProfanity(value), false, value);
    }
  });

  it("blocks a slur or swear word used as a name or in a sentence", () => {
    assert.equal(containsProfanity("fuck"), true);
    assert.equal(containsProfanity("Holy shit"), true);
    assert.equal(anyProfanity(["Jane", "A calm life", "you bitch"]), true);
  });

  it("blocks letters split by symbols or spaces", () => {
    assert.equal(containsProfanity("f.u.c.k"), true);
    assert.equal(containsProfanity("f u c k"), true);
    assert.equal(containsProfanity("sh1t"), true);
  });
});
