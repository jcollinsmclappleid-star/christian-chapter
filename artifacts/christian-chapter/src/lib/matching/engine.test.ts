import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { addDays } from "./clock.ts";
import {
  alignmentLabel,
  buildIntroductionSet,
  candidateExclusions,
  emptyContext,
  preferenceHash,
  seeksGender,
} from "./engine.ts";
import type { MatchableProfile } from "./types.ts";

function profile(overrides: Partial<MatchableProfile> = {}): MatchableProfile {
  return {
    userId: "viewer",
    userStatus: "active_founding_member",
    emailVerified: true,
    profileStatus: "approved",
    activityState: "active_now",
    lastActiveAt: new Date("2026-09-20T10:00:00Z"),
    firstName: "Helen",
    dateOfBirth: "1979-03-15",
    gender: "Woman",
    seekingGender: ["Men"],
    ageRangeMin: 40,
    ageRangeMax: 80,
    tradition: "Anglican / Church of England",
    churchAttendance: "Most weeks",
    faithCentrality: "Present",
    relationshipGoal: "A committed relationship",
    relationshipHistory: "divorced",
    familySituation: "adult children",
    dependentChildren: false,
    adultChildren: true,
    grandchildren: false,
    openToRemarriage: true,
    interests: ["walking"],
    smoking: "never",
    alcohol: "occasionally",
    ukNation: "England",
    ukRegion: "South East England",
    travelRadiusMiles: 60,
    openToRelocation: false,
    candidatePools: ["nearby", "worth_the_journey"],
    essentials: [],
    hiddenAt: null,
    ...overrides,
  };
}

const now = new Date("2026-09-20T12:00:00Z");

describe("matching engine", () => {
  it("treats gender preference as reciprocal", () => {
    assert.equal(seeksGender(["Men"], "Man"), true);
    assert.equal(seeksGender(["Women"], "Man"), false);
    assert.equal(seeksGender(["Open to both"], "Woman"), true);
  });

  it("never relaxes an Essential", () => {
    const viewer = profile({
      essentials: [{ factor: "tradition", label: "Christian tradition", tier: "essential" }],
    });
    const baptist = profile({
      userId: "other",
      gender: "Man",
      seekingGender: ["Women"],
      tradition: "Baptist",
    });
    const exclusions = candidateExclusions(viewer, baptist, emptyContext(now));
    assert.equal(exclusions.some((item) => item.code === "essential_tradition"), true);
  });

  it("reproduces the same finite set for the same snapshot inputs", () => {
    const viewer = profile();
    const candidates = Array.from({ length: 12 }, (_, i) =>
      profile({
        userId: `c${i}`,
        gender: "Man",
        seekingGender: ["Women"],
        firstName: `Man${i}`,
        ukRegion: i < 6 ? "South East England" : "Greater London",
        tradition: i % 2 === 0 ? "Anglican / Church of England" : "Methodist",
      }),
    );
    const first = buildIntroductionSet(viewer, candidates, emptyContext(now));
    const second = buildIntroductionSet(viewer, candidates, emptyContext(now));
    assert.deepEqual(
      first.selected.map((row) => row.userId),
      second.selected.map((row) => row.userId),
    );
    assert.equal(first.selected.length >= 3 && first.selected.length <= 7, true);
    assert.equal(first.selected.some((row) => row.alignmentLabel === "strong_alignment" || row.alignmentLabel === "good_potential" || row.alignmentLabel === "some_common_ground"), true);
  });

  it("suppresses a decline for 90 days unless preferences change", () => {
    const viewer = profile();
    const other = profile({ userId: "other", gender: "Man", seekingGender: ["Women"] });
    const ctx = emptyContext(now);
    ctx.declines.push({
      viewerId: viewer.userId,
      candidateId: other.userId,
      declinedAt: addDays(now, -10),
      preferenceHash: preferenceHash(viewer),
    });
    assert.equal(
      candidateExclusions(viewer, other, ctx).some((item) => item.code === "declined_recently"),
      true,
    );
    const changed = profile({
      essentials: [{ factor: "smoking", label: "Smoking", tier: "essential" }],
      smoking: "never",
    });
    assert.equal(
      candidateExclusions(changed, other, ctx).some((item) => item.code === "declined_recently"),
      false,
    );
  });

  it("builds all three distance pools", () => {
    const viewer = profile({
      candidatePools: ["nearby", "worth_the_journey", "open_to_distance"],
      openToRelocation: true,
      travelRadiusMiles: 120,
    });
    const nearby = profile({ userId: "n", gender: "Man", seekingGender: ["Women"] });
    const journey = profile({
      userId: "j",
      gender: "Man",
      seekingGender: ["Women"],
      ukRegion: "Greater London",
      travelRadiusMiles: 80,
    });
    const distance = profile({
      userId: "d",
      gender: "Man",
      seekingGender: ["Women"],
      ukNation: "Scotland",
      ukRegion: "Scotland",
      openToRelocation: true,
      travelRadiusMiles: 120,
      candidatePools: ["open_to_distance"],
    });
    const result = buildIntroductionSet(viewer, [nearby, journey, distance], emptyContext(now));
    const pools = new Set(result.selected.map((row) => row.pool));
    assert.equal(pools.has("nearby"), true);
    assert.equal(pools.has("worth_the_journey"), true);
    assert.equal(pools.has("open_to_distance"), true);
  });

  it("does not serve an inactive or blocked candidate", () => {
    const viewer = profile();
    const inactive = profile({
      userId: "away",
      gender: "Man",
      seekingGender: ["Women"],
      activityState: "inactive",
    });
    const blocked = profile({ userId: "blocked", gender: "Man", seekingGender: ["Women"] });
    const ctx = emptyContext(now);
    ctx.blocks.push({ a: viewer.userId, b: blocked.userId });
    const result = buildIntroductionSet(viewer, [inactive, blocked], ctx);
    assert.equal(result.selected.length, 0);
    assert.equal(result.excluded.length, 2);
  });

  it("uses labels rather than percentages", () => {
    assert.equal(alignmentLabel(6), "strong_alignment");
    assert.equal(alignmentLabel(3), "good_potential");
    assert.equal(alignmentLabel(1), "some_common_ground");
  });
});
