// Founding member wizard — shared types

import {
  POLICY_VERSION,
  RELIGIOUS_CONSENT_VERSION,
} from "@/lib/site-config";

export { RELIGIOUS_CONSENT_VERSION, POLICY_VERSION };

export const WIZARD_STORAGE_KEY = "cc_wizard_v1";
export const TOTAL_STEPS = 8;

export type EssentialTier = "essential" | "preferred" | "open";

export interface EssentialFactor {
  factor: string;
  label: string;
  tier: EssentialTier;
}

export type WizardData = {
  eligibilityAcknowledged: boolean;
  // Step 2: Account
  firstName: string;
  email: string;
  marketingConsent: boolean;
  // Step 3: About you
  dateOfBirth: string;       // ISO date YYYY-MM-DD
  gender: string;
  seekingGender: string[];
  // Step 4: Location
  ukRegion: string;
  travelRadiusMiles: number;
  // Step 5: Faith (GDPR special category)
  religiousDataConsent: boolean;
  religiousDataConsentTimestamp: string | null;
  religiousDataConsentVersion: string;
  tradition: string;
  churchAttendance: string;
  faithCentrality: string;
  faithDescription: string;
  // Step 6: Life now
  workStatus: string;
  familySituation: string;
  interests: string[];
  // Step 7: Relationship intentions
  relationshipGoal: string;
  openToRemarriage: boolean | null;
  relationshipPace: string;
  // Step 8: Who to meet
  ageRangeMin: number;
  ageRangeMax: number;
  preferredDistanceMiles: number;
  meetingPreferences: string;
  // Step 9: My Essentials
  essentials: EssentialFactor[];
  // Step 10: Story
  storyPrompt1: string;
  storyPrompt2: string;
  storyPrompt3: string;
  priorities: string[];
  photoConsent: boolean;
  termsAccepted: boolean;
  partnerHopes: string[];
  hobbyNote: string;
  photoDataUrl: string;
  /** Set after the ready screen has finished assembling the profile. */
  profileReady: boolean;
  /** 3 = short build, then email once the profile is ready. Older drafts restart. */
  flowVersion: number;
};

export const defaultWizardData: WizardData = {
  eligibilityAcknowledged: false,
  firstName: "",
  email: "",
  marketingConsent: false,
  dateOfBirth: "",
  gender: "",
  seekingGender: [],
  ukRegion: "",
  travelRadiusMiles: 40,
  religiousDataConsent: false,
  religiousDataConsentTimestamp: null,
  religiousDataConsentVersion: RELIGIOUS_CONSENT_VERSION,
  tradition: "",
  churchAttendance: "",
  faithCentrality: "",
  faithDescription: "",
  workStatus: "",
  familySituation: "",
  interests: [],
  relationshipGoal: "",
  openToRemarriage: null,
  relationshipPace: "",
  ageRangeMin: 40,
  ageRangeMax: 70,
  preferredDistanceMiles: 50,
  meetingPreferences: "",
  essentials: [],
  storyPrompt1: "",
  storyPrompt2: "",
  storyPrompt3: "",
  priorities: [],
  photoConsent: false,
  termsAccepted: false,
  partnerHopes: [],
  hobbyNote: "",
  photoDataUrl: "",
  profileReady: false,
  flowVersion: 3,
};

export interface StepProps {
  data: WizardData;
  update: (partial: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

export const UK_REGIONS = [
  "East of England",
  "East Midlands",
  "Greater London",
  "North East England",
  "North West England",
  "Northern Ireland",
  "Scotland",
  "South East England",
  "South West England",
  "Wales",
  "West Midlands",
  "Yorkshire and the Humber",
];

export const TRADITIONS = [
  "Anglican / Church of England",
  "Baptist",
  "Catholic",
  "Charismatic / Pentecostal",
  "Evangelical",
  "Methodist",
  "Presbyterian",
  "Reformed",
  "Salvation Army",
  "Non-denominational",
  "Other / interdenominational",
];

export const ATTENDANCE_OPTIONS = [
  "Every week",
  "Most weeks",
  "Monthly",
  "Occasionally",
  "Rarely now, but faith is still central",
];

export const CENTRALITY_OPTIONS = [
  "Mostly private",
  "Present",
  "Woven through my day",
  "Central",
  "Everything — it shapes all I do",
];

export const INTEREST_GROUPS: { title: string; options: string[] }[] = [
  {
    title: "Outdoors",
    options: ["Country walks", "Coastal paths", "Gardening", "Cycling", "Wild swimming", "Birdwatching"],
  },
  {
    title: "Table and home",
    options: ["Cooking", "Baking", "Sunday lunch", "A good cup of tea", "DIY", "Hosting friends"],
  },
  {
    title: "Making",
    options: ["Photography", "Painting", "Choir", "An instrument", "Crafts", "Writing"],
  },
  {
    title: "Out in the world",
    options: ["Live music", "Theatre", "Cinema", "Travel", "Museums", "Dancing", "Sport"],
  },
  {
    title: "A quieter week",
    options: ["Reading", "Prayer", "Volunteering", "Board games", "Podcasts", "Learning a language"],
  },
  {
    title: "A bit unexpected",
    options: ["Ballroom", "Sourdough", "Classic cars", "Pilgrimage walks", "Astronomy", "Karaoke", "Football away days"],
  },
];

export const PARTNER_HOPES = [
  "kind, and who means it",
  "who laughs easily",
  "with a faith already in the room",
  "curious about ordinary days",
  "steady, and not in a rush",
  "good with family",
  "happy to cook and to go out",
  "honest about the past",
  "glad of a quiet evening",
];

export const INTENTION_OPTIONS = [
  "Companionship, and see where it leads",
  "A committed relationship",
  "Marriage if it is right, without hurry",
];

export const INTERESTS_OPTIONS = INTEREST_GROUPS.flatMap((group) => group.options);

export const ESSENTIAL_FACTORS: { factor: string; label: string }[] = [
  { factor: "smoking", label: "Non-smoker" },
  { factor: "children", label: "Has (or is open to) children" },
  { factor: "denomination", label: "Same or similar denomination" },
  { factor: "weekly_church", label: "Weekly church attendance" },
  { factor: "remarriage", label: "Open to remarriage" },
  { factor: "distance", label: "Within my distance limit" },
  { factor: "age", label: "Within my age range" },
  { factor: "diet", label: "Dietary compatibility" },
  { factor: "politics", label: "Similar political outlook" },
];

export const STORY_PROMPTS = [
  "What has this chapter of life taught you, and what are you carrying forward into the next?",
  "Describe a moment — recent or long ago — that shaped who you are today.",
  "What does a good ordinary day look like for you?",
];
