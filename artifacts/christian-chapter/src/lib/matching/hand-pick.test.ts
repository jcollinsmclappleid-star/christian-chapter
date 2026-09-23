import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handPickBlockers, handPickedStillOpen, type HandPickProfile } from "./hand-pick.ts";

const ready = (userId: string, status = "approved"): HandPickProfile => ({
  userId,
  status,
  hidden: false,
  emailVerified: true,
  accountClosed: false,
});

describe("hand-picked introductions", () => {
  it("accepts two submitted profiles that are not blocked", () => {
    assert.equal(handPickBlockers(ready("a", "submitted"), ready("b", "review"), false), null);
  });

  it("refuses the same person, a block, a draft, or an unconfirmed email", () => {
    assert.match(handPickBlockers(ready("a"), ready("a"), false) ?? "", /different/);
    assert.match(handPickBlockers(ready("a"), ready("b"), true) ?? "", /block/);
    assert.match(handPickBlockers(ready("a", "draft"), ready("b"), false) ?? "", /submitted/);
    assert.match(
      handPickBlockers({ ...ready("a"), emailVerified: false }, ready("b"), false) ?? "",
      /email/,
    );
  });

  it("keeps a hand-picked introduction open unless safety closes it", () => {
    const open = {
      samePerson: false,
      viewerClosed: false,
      candidateClosed: false,
      viewerHidden: false,
      candidateHidden: false,
      blocked: false,
    };
    assert.equal(handPickedStillOpen(open), true);
    assert.equal(handPickedStillOpen({ ...open, blocked: true }), false);
  });
});
