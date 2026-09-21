import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { addDays } from "./clock.ts";
import { bandForLastActive, publicActivityLabel, transitionActivity } from "./activity.ts";

const now = new Date("2026-09-20T12:00:00Z");

describe("activity bands", () => {
  it("advances the clock through each band", () => {
    assert.equal(bandForLastActive(now, now), "active_now");
    assert.equal(bandForLastActive(addDays(now, -3), now), "active_recently");
    assert.equal(bandForLastActive(addDays(now, -12), now), "active_this_month");
    assert.equal(bandForLastActive(addDays(now, -38), now), "reactivation");
    assert.equal(bandForLastActive(addDays(now, -50), now), "inactive");
  });

  it("never exposes an exact last-seen time", () => {
    const label = publicActivityLabel("active_recently", addDays(now, -3), now);
    assert.equal(label, "Active recently");
    assert.doesNotMatch(label, /\d{2}:\d{2}/);
  });

  it("hides inactive members and leaves taking a break immediate", () => {
    const inactive = transitionActivity({
      activityState: "active_this_month",
      lastActiveAt: addDays(now, -50),
      now,
    });
    assert.equal(inactive.nextState, "inactive");
    assert.equal(inactive.hideFromIntroductions, true);
    assert.equal(inactive.notice, "inactive");

    const paused = transitionActivity({
      activityState: "taking_a_break",
      lastActiveAt: now,
      now,
    });
    assert.equal(paused.nextState, "taking_a_break");
    assert.equal(paused.hideFromIntroductions, true);
  });
});
