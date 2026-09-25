import { getAge } from "../age.ts";
import { MINIMUM_AGE } from "../site-config.ts";
import { daysBetween } from "./clock.ts";
import {
  DECLINE_SUPPRESSION_DAYS,
  EXPLORATION_PERCENT,
  INTRODUCTION_SET_MAX,
  INTRODUCTION_SET_MIN,
  INTRODUCTION_SET_SIZE,
  MATCHING_RULES_VERSION,
  type AlignmentLabel,
  type AlignmentScore,
  type BuildResult,
  type DistancePool,
  type Essential,
  type Exclusion,
  type MatchableProfile,
  type MatchContext,
  type RankedCandidate,
} from "./types.ts";

export function parseEssentials(value: unknown): Essential[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Essential => {
    return (
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as Essential).factor === "string" &&
      typeof (item as Essential).tier === "string"
    );
  });
}

export function preferenceHash(profile: MatchableProfile): string {
  return [
    (profile.seekingGender ?? []).slice().sort().join(","),
    profile.ageRangeMin ?? "",
    profile.ageRangeMax ?? "",
    profile.travelRadiusMiles ?? "",
    JSON.stringify(parseEssentials(profile.essentials)),
  ].join("|");
}

export function seeksGender(seekingList: string[] | null | undefined, targetGender: string | null): boolean {
  if (!targetGender || !seekingList?.length) return false;
  return seekingList.some((seeking) => {
    if (seeking === "Men" && targetGender === "Man") return true;
    if (seeking === "Women" && targetGender === "Woman") return true;
    if (seeking === "Open to both" && (targetGender === "Man" || targetGender === "Woman")) return true;
    return seeking === targetGender;
  });
}

function decade(age: number | null): number | null {
  if (age === null) return null;
  return Math.floor(age / 10) * 10;
}

function valueForFactor(profile: MatchableProfile, factor: string): string | null {
  switch (factor) {
    case "tradition":
    case "denomination":
      return profile.tradition;
    case "church_attendance":
    case "weekly_church":
      return profile.churchAttendance;
    case "smoking":
      return profile.smoking;
    case "alcohol":
      return profile.alcohol;
    case "relationship_goal":
      return profile.relationshipGoal;
    case "remarriage":
      if (profile.openToRemarriage == null) return null;
      return profile.openToRemarriage ? "yes" : "no";
    case "dependent_children":
    case "children":
      if (profile.dependentChildren == null) return null;
      return profile.dependentChildren ? "yes" : "no";
    default:
      return null;
  }
}

function essentialBroken(owner: MatchableProfile, other: MatchableProfile): Exclusion | null {
  for (const item of parseEssentials(owner.essentials)) {
    if (item.tier !== "essential") continue;
    if (item.factor === "age") continue;
    if (item.factor === "distance") {
      const pool = distancePool(owner, other);
      if (pool !== "nearby") {
        return {
          code: "essential_distance",
          message: "An Essential for distance only allows nearby introductions.",
        };
      }
      continue;
    }
    const ownerValue = valueForFactor(owner, item.factor);
    const otherValue = valueForFactor(other, item.factor);
    if (!ownerValue || !otherValue || ownerValue !== otherValue) {
      return {
        code: `essential_${item.factor}`,
        message: `An Essential for ${item.label || item.factor} is not met.`,
      };
    }
  }
  return null;
}

export function distancePool(a: MatchableProfile, b: MatchableProfile): DistancePool | null {
  if (a.ukRegion && b.ukRegion && a.ukRegion === b.ukRegion) return "nearby";
  if (a.ukNation && b.ukNation && a.ukNation === b.ukNation) {
    const travel = Math.min(a.travelRadiusMiles ?? 0, b.travelRadiusMiles ?? 0);
    if (travel >= 40 || a.openToRelocation || b.openToRelocation) return "worth_the_journey";
    return null;
  }
  const open = (profile: MatchableProfile) =>
    Boolean(profile.openToRelocation) ||
    (profile.candidatePools ?? []).includes("open_to_distance") ||
    (profile.travelRadiusMiles ?? 0) >= 80;
  if (open(a) && open(b)) return "open_to_distance";
  return null;
}

function poolAllowed(profile: MatchableProfile, pool: DistancePool): boolean {
  const selected = profile.candidatePools ?? [];
  if (!selected.length) return true;
  return selected.includes(pool);
}

function pairBlocked(a: string, b: string, pairs: Array<{ a: string; b: string }>): boolean {
  return pairs.some((pair) => (pair.a === a && pair.b === b) || (pair.a === b && pair.b === a));
}

export function viewerEligibility(viewer: MatchableProfile, ctx: MatchContext): Exclusion[] {
  const exclusions: Exclusion[] = [];
  if (viewer.userStatus === "closed" || viewer.userStatus === "closure_requested") {
    exclusions.push({ code: "account_closed", message: "This account is not available for introductions." });
  }
  if (!viewer.emailVerified) {
    exclusions.push({ code: "email_unverified", message: "Confirm your email before receiving introductions." });
  }
  if (viewer.profileStatus !== "approved") {
    exclusions.push({ code: "profile_unapproved", message: "Your profile needs approval before introductions." });
  }
  if (viewer.hiddenAt) {
    exclusions.push({ code: "profile_hidden", message: "Your profile is hidden from introductions." });
  }
  if (viewer.activityState === "taking_a_break") {
    exclusions.push({ code: "taking_a_break", message: "You are taking a break, so new introductions are paused." });
  }
  if (viewer.activityState === "inactive" || viewer.activityState === "hidden") {
    exclusions.push({ code: "inactive", message: "Return to the community to receive new introductions." });
  }
  const age = viewer.dateOfBirth ? getAge(viewer.dateOfBirth, ctx.now) : null;
  if (age === null || age < MINIMUM_AGE) {
    exclusions.push({ code: "age", message: `Mature Christian Dating is for adults aged ${MINIMUM_AGE} and over.` });
  }
  return exclusions;
}

export function candidateExclusions(
  viewer: MatchableProfile,
  candidate: MatchableProfile,
  ctx: MatchContext,
): Exclusion[] {
  const exclusions: Exclusion[] = [];
  if (viewer.userId === candidate.userId) {
    exclusions.push({ code: "self", message: "A member is not introduced to themselves." });
  }
  if (candidate.userStatus === "closed" || candidate.userStatus === "closure_requested") {
    exclusions.push({ code: "account_closed", message: "The other account is not available." });
  }
  if (!candidate.emailVerified) {
    exclusions.push({ code: "email_unverified", message: "The other member has not confirmed email." });
  }
  if (candidate.profileStatus !== "approved") {
    exclusions.push({ code: "profile_unapproved", message: "The other profile is not approved." });
  }
  if (candidate.hiddenAt || candidate.profileStatus === "hidden" || candidate.profileStatus === "paused") {
    exclusions.push({ code: "profile_hidden", message: "The other profile is not circulating." });
  }
  if (candidate.activityState === "taking_a_break" || candidate.activityState === "inactive" || candidate.activityState === "hidden") {
    exclusions.push({ code: "inactive", message: "The other member is not available for new introductions." });
  }
  const viewerAge = viewer.dateOfBirth ? getAge(viewer.dateOfBirth, ctx.now) : null;
  const candidateAge = candidate.dateOfBirth ? getAge(candidate.dateOfBirth, ctx.now) : null;
  if (candidateAge === null || candidateAge < MINIMUM_AGE) {
    exclusions.push({ code: "age", message: "The other member is below the age eligibility." });
  }
  if (!seeksGender(viewer.seekingGender, candidate.gender) || !seeksGender(candidate.seekingGender, viewer.gender)) {
    exclusions.push({ code: "gender", message: "Partner preference is not reciprocal." });
  }
  const viewerMin = viewer.ageRangeMin ?? MINIMUM_AGE;
  const viewerMax = viewer.ageRangeMax ?? 120;
  const candidateMin = candidate.ageRangeMin ?? MINIMUM_AGE;
  const candidateMax = candidate.ageRangeMax ?? 120;
  if (
    candidateAge !== null &&
    viewerAge !== null &&
    (candidateAge < viewerMin || candidateAge > viewerMax || viewerAge < candidateMin || viewerAge > candidateMax)
  ) {
    exclusions.push({ code: "age_range", message: "Age ranges are not reciprocal." });
  }
  const broken = essentialBroken(viewer, candidate) ?? essentialBroken(candidate, viewer);
  if (broken) exclusions.push(broken);
  if (pairBlocked(viewer.userId, candidate.userId, ctx.blocks)) {
    exclusions.push({ code: "blocked", message: "A block prevents this introduction." });
  }
  if (pairBlocked(viewer.userId, candidate.userId, ctx.reports)) {
    exclusions.push({ code: "reported", message: "A report prevents this introduction." });
  }
  const decline = ctx.declines.find(
    (row) => row.viewerId === viewer.userId && row.candidateId === candidate.userId,
  );
  if (decline && daysBetween(ctx.now, decline.declinedAt) < DECLINE_SUPPRESSION_DAYS) {
    const currentHash = preferenceHash(viewer);
    if (!decline.preferenceHash || decline.preferenceHash === currentHash) {
      exclusions.push({ code: "declined_recently", message: "This introduction was declined within 90 days." });
    }
  }
  const pool = distancePool(viewer, candidate);
  if (!pool) {
    exclusions.push({ code: "geography", message: "Travel and location are not compatible." });
  } else if (!poolAllowed(viewer, pool) || !poolAllowed(candidate, pool)) {
    exclusions.push({ code: "pool_not_selected", message: "One of you has not chosen this distance pool." });
  }
  return exclusions;
}

export function alignmentFor(
  viewer: MatchableProfile,
  candidate: MatchableProfile,
  pool: DistancePool,
  now: Date,
): AlignmentScore {
  const viewerAge = viewer.dateOfBirth ? getAge(viewer.dateOfBirth, now) : null;
  const candidateAge = candidate.dateOfBirth ? getAge(candidate.dateOfBirth, now) : null;
  const sharedInterests = (viewer.interests ?? []).filter((item) => (candidate.interests ?? []).includes(item));
  return {
    faith: Boolean(
      (viewer.tradition && viewer.tradition === candidate.tradition) ||
        (viewer.churchAttendance && viewer.churchAttendance === candidate.churchAttendance),
    ),
    relationship: Boolean(viewer.relationshipGoal && viewer.relationshipGoal === candidate.relationshipGoal),
    lifestyle: Boolean(
      sharedInterests.length > 0 ||
        (viewer.smoking && viewer.smoking === candidate.smoking) ||
        (viewer.alcohol && viewer.alcohol === candidate.alcohol),
    ),
    lifeStage: decade(viewerAge) !== null && decade(viewerAge) === decade(candidateAge),
    geographic: pool === "nearby" || pool === "worth_the_journey",
    family:
      viewer.dependentChildren === candidate.dependentChildren ||
      viewer.adultChildren === candidate.adultChildren ||
      viewer.grandchildren === candidate.grandchildren,
  };
}

export function alignmentLabel(count: number): AlignmentLabel {
  if (count >= 5) return "strong_alignment";
  if (count >= 3) return "good_potential";
  return "some_common_ground";
}

export function alignmentLabelText(label: AlignmentLabel): string {
  if (label === "strong_alignment") return "Strong alignment";
  if (label === "good_potential") return "Good potential";
  return "Some common ground";
}

export function poolLabel(pool: DistancePool): string {
  if (pool === "nearby") return "Nearby";
  if (pool === "worth_the_journey") return "Worth the journey";
  return "Open to distance";
}

function whyFor(alignment: AlignmentScore, pool: DistancePool): Array<{ code: string; text: string }> {
  const why: Array<{ code: string; text: string }> = [];
  if (alignment.faith) why.push({ code: "faith", text: "You share a similar faith life." });
  if (alignment.relationship) why.push({ code: "relationship", text: "You are looking for a similar kind of relationship." });
  if (alignment.lifeStage) why.push({ code: "life_stage", text: "You are in a similar chapter of life." });
  if (alignment.geographic) why.push({ code: "geography", text: `${poolLabel(pool)} is practical for both of you.` });
  if (alignment.family) why.push({ code: "family", text: "Your family situations have common ground." });
  if (alignment.lifestyle) why.push({ code: "lifestyle", text: "There is overlap in how you live day to day." });
  if (!why.length) why.push({ code: "eligible", text: "You meet one another’s Essentials and eligibility." });
  return why;
}

function worthDiscussing(viewer: MatchableProfile, candidate: MatchableProfile): Array<{ code: string; text: string }> {
  const points: Array<{ code: string; text: string }> = [];
  if (viewer.tradition && candidate.tradition && viewer.tradition !== candidate.tradition) {
    points.push({ code: "tradition", text: "You belong to different Christian traditions." });
  }
  if (viewer.relationshipHistory && candidate.relationshipHistory && viewer.relationshipHistory !== candidate.relationshipHistory) {
    points.push({ code: "history", text: "Your relationship histories differ." });
  }
  if (Boolean(viewer.dependentChildren) !== Boolean(candidate.dependentChildren)) {
    points.push({ code: "children", text: "Dependent children may be worth discussing." });
  }
  if (viewer.ukRegion && candidate.ukRegion && viewer.ukRegion !== candidate.ukRegion) {
    points.push({ code: "travel", text: "Meeting would involve travel." });
  }
  return points.slice(0, 3);
}

function freshnessBonus(state: string): number {
  if (state === "active_now") return 3;
  if (state === "active_recently") return 2;
  if (state === "active_this_month") return 1;
  return 0;
}

function preferredBonus(viewer: MatchableProfile, candidate: MatchableProfile): number {
  let bonus = 0;
  for (const item of parseEssentials(viewer.essentials)) {
    if (item.tier !== "preferred") continue;
    const ownerValue = valueForFactor(viewer, item.factor);
    const otherValue = valueForFactor(candidate, item.factor);
    if (ownerValue && otherValue && ownerValue === otherValue) bonus += 2;
  }
  return bonus;
}

function poolBonus(pool: DistancePool): number {
  if (pool === "nearby") return 3;
  if (pool === "worth_the_journey") return 2;
  return 1;
}

function deterministicJitter(viewerId: string, candidateId: string, rulesVersion: string): number {
  const seed = `${viewerId}:${candidateId}:${rulesVersion}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return hash;
}

export function rankCandidate(
  viewer: MatchableProfile,
  candidate: MatchableProfile,
  ctx: MatchContext,
): RankedCandidate | null {
  const exclusions = candidateExclusions(viewer, candidate, ctx);
  if (exclusions.length) return null;
  const pool = distancePool(viewer, candidate);
  if (!pool) return null;
  const alignment = alignmentFor(viewer, candidate, pool, ctx.now);
  const alignmentCount = Object.values(alignment).filter(Boolean).length;
  const score =
    alignmentCount * 10 +
    preferredBonus(viewer, candidate) +
    freshnessBonus(candidate.activityState) +
    poolBonus(pool);
  return {
    userId: candidate.userId,
    pool,
    alignment,
    alignmentCount,
    alignmentLabel: alignmentLabel(alignmentCount),
    score,
    why: whyFor(alignment, pool),
    worthDiscussing: worthDiscussing(viewer, candidate),
    exploration: false,
  };
}

function sortRanks(ranks: RankedCandidate[], ctx: MatchContext, viewerId: string): RankedCandidate[] {
  return ranks.slice().sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return deterministicJitter(viewerId, a.userId, ctx.rulesVersion) - deterministicJitter(viewerId, b.userId, ctx.rulesVersion);
  });
}

function pickExploration(ranks: RankedCandidate[], viewerId: string, ctx: MatchContext): number {
  const seed = `${viewerId}:${ctx.rulesVersion}:${ctx.now.toISOString().slice(0, 10)}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33 + seed.charCodeAt(i)) % 100;
  }
  return hash;
}

export function buildIntroductionSet(
  viewer: MatchableProfile,
  candidates: MatchableProfile[],
  ctx: MatchContext,
): BuildResult {
  const viewerExclusions = viewerEligibility(viewer, ctx);
  if (viewerExclusions.length) {
    return {
      viewerEligible: false,
      viewerExclusions,
      selected: [],
      ranks: [],
      excluded: [],
      restrictingRules: viewerExclusions.map((item) => item.message),
    };
  }

  const ranks: RankedCandidate[] = [];
  const excluded: Array<{ userId: string; exclusions: Exclusion[] }> = [];
  const counts = new Map<string, number>();

  for (const candidate of candidates) {
    const exclusions = candidateExclusions(viewer, candidate, ctx);
    if (exclusions.length) {
      excluded.push({ userId: candidate.userId, exclusions });
      for (const item of exclusions) {
        counts.set(item.code, (counts.get(item.code) ?? 0) + 1);
      }
      continue;
    }
    const ranked = rankCandidate(viewer, candidate, ctx);
    if (ranked) ranks.push(ranked);
  }

  const sorted = sortRanks(ranks, ctx, viewer.userId);
  const size = Math.min(INTRODUCTION_SET_MAX, Math.max(INTRODUCTION_SET_MIN, Math.min(INTRODUCTION_SET_SIZE, sorted.length)));
  const selected = sorted.slice(0, size).map((row) => ({ ...row }));

  if (sorted.length > size && pickExploration(sorted, viewer.userId, ctx) < EXPLORATION_PERCENT) {
    const explorer = sorted[size];
    if (explorer && selected.length) {
      selected[selected.length - 1] = { ...explorer, exploration: true };
    }
  }

  const restrictingRules = selected.length
    ? []
    : [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([code]) => {
          const sample = excluded.find((row) => row.exclusions.some((item) => item.code === code));
          return sample?.exclusions.find((item) => item.code === code)?.message ?? code;
        });

  return {
    viewerEligible: true,
    viewerExclusions: [],
    selected,
    ranks: sorted,
    excluded,
    restrictingRules,
  };
}

export function emptyContext(now: Date): MatchContext {
  return {
    now,
    rulesVersion: MATCHING_RULES_VERSION,
    declines: [],
    blocks: [],
    reports: [],
  };
}
