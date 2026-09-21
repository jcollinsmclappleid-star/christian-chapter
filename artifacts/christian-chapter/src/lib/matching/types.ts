export const MATCHING_RULES_VERSION = "mat-01.1";
export const INTRODUCTION_SET_SIZE = 5;
export const INTRODUCTION_SET_MIN = 3;
export const INTRODUCTION_SET_MAX = 7;
export const SNAPSHOT_DAYS = 7;
export const DECLINE_SUPPRESSION_DAYS = 90;
export const SAVE_DAYS = 7;
export const EXPLORATION_PERCENT = 13;

export type InterestKind = "talk" | "save" | "decline";
export type EssentialTier = "essential" | "preferred" | "open";
export type Essential = { factor: string; label: string; tier: EssentialTier };
export type DistancePool = "nearby" | "worth_the_journey" | "open_to_distance";
export type AlignmentLabel = "strong_alignment" | "good_potential" | "some_common_ground";

export type MatchableProfile = {
  userId: string;
  userStatus: string;
  emailVerified: boolean;
  profileStatus: string;
  activityState: string;
  lastActiveAt: Date | null;
  firstName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  seekingGender: string[] | null;
  ageRangeMin: number | null;
  ageRangeMax: number | null;
  tradition: string | null;
  churchAttendance: string | null;
  faithCentrality: string | null;
  relationshipGoal: string | null;
  relationshipHistory: string | null;
  familySituation: string | null;
  dependentChildren: boolean | null;
  adultChildren: boolean | null;
  grandchildren: boolean | null;
  openToRemarriage: boolean | null;
  interests: string[] | null;
  smoking: string | null;
  alcohol: string | null;
  ukNation: string | null;
  ukRegion: string | null;
  travelRadiusMiles: number | null;
  openToRelocation: boolean | null;
  candidatePools: string[] | null;
  essentials: Essential[] | null;
  hiddenAt: Date | null;
};

export type Exclusion = { code: string; message: string };

export type AlignmentScore = {
  faith: boolean;
  relationship: boolean;
  lifestyle: boolean;
  lifeStage: boolean;
  geographic: boolean;
  family: boolean;
};

export type RankedCandidate = {
  userId: string;
  pool: DistancePool;
  alignment: AlignmentScore;
  alignmentCount: number;
  alignmentLabel: AlignmentLabel;
  score: number;
  why: Array<{ code: string; text: string }>;
  worthDiscussing: Array<{ code: string; text: string }>;
  exploration: boolean;
};

export type DeclineRecord = {
  viewerId: string;
  candidateId: string;
  declinedAt: Date;
  preferenceHash: string | null;
};

export type BlockRecord = { a: string; b: string };

export type MatchContext = {
  now: Date;
  rulesVersion: string;
  declines: DeclineRecord[];
  blocks: BlockRecord[];
  reports: BlockRecord[];
};

export type BuildResult = {
  viewerEligible: boolean;
  viewerExclusions: Exclusion[];
  selected: RankedCandidate[];
  ranks: RankedCandidate[];
  excluded: Array<{ userId: string; exclusions: Exclusion[] }>;
  restrictingRules: string[];
};
