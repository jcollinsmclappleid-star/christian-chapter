import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { addDays } from "./clock.ts";
import {
  applyInterestAction,
  orderedPair,
  publicInterestState,
  reciprocalCreatesMatch,
  saveExpired,
} from "./connections.ts";

const now = new Date("2026-09-20T12:00:00Z");

describe("connection actions", () => {
  it("creates exactly one ordered match pair", () => {
    assert.deepEqual(orderedPair("b", "a"), ["a", "b"]);
    assert.deepEqual(orderedPair("a", "b"), ["a", "b"]);
  });

  it("creates a match only when both sides have open talk interest", () => {
    assert.equal(reciprocalCreatesMatch({ kind: "talk", status: "open" }, { kind: "talk", status: "open" }), true);
    assert.equal(reciprocalCreatesMatch({ kind: "talk", status: "open" }, { kind: "save", status: "open" }), false);
  });

  it("expires a save after seven days on the test clock", () => {
    const saved = applyInterestAction({
      existing: null,
      actorId: "a",
      otherId: "b",
      action: "save",
      now,
    });
    assert.equal(saveExpired({ ...saved, expiresAt: saved.expiresAt }, addDays(now, 6)), false);
    assert.equal(saveExpired({ ...saved, expiresAt: saved.expiresAt }, addDays(now, 8)), true);
  });

  it("keeps decline reasons private", () => {
    const declined = applyInterestAction({
      existing: null,
      actorId: "a",
      otherId: "b",
      action: "decline",
      now,
    });
    assert.equal(declined.closedForSender, true);
    assert.equal(
      publicInterestState({
        mine: { kind: "talk", status: "open" },
        theirs: { kind: "decline", status: "closed" },
        matchStatus: null,
      }),
      "closed",
    );
  });
});
