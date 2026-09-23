export type ProfilePhoto = {
  id: string;
  url: string;
  position: number;
  moderationStatus: string;
  verificationStatus?: string;
};

export type ProfilePrompt = { prompt: string; answer: string };

export type StudioProfile = {
  id: string;
  status: string;
  activityState?: string;
  firstName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  seekingGender: string[] | null;
  aboutMe: string | null;
  tradition: string | null;
  churchAttendance: string | null;
  faithCentrality: string | null;
  faithDescription: string | null;
  relationshipGoal: string | null;
  openToRemarriage: boolean | null;
  relationshipPace: string | null;
  relationshipHistory: string | null;
  familySituation: string | null;
  workStatus: string | null;
  interests: string[] | null;
  futureChildren: string | null;
  lookingFor: string | null;
  nextChapter: string | null;
  caringResponsibilities: string | null;
  smoking: string | null;
  alcohol: string | null;
  ukResidence: string | null;
  ukNation: string | null;
  ukRegion: string | null;
  travelRadiusMiles: number | null;
  openToRelocation: boolean | null;
  essentials: Array<{ factor: string; label: string; tier: "essential" | "preferred" | "open" }>;
  visibility: Record<string, "hidden" | "matches" | "members">;
  prompts: ProfilePrompt[];
  photos: ProfilePhoto[];
  media?: Array<{ id: string; kind: string; url?: string; moderationStatus: string }>;
  messages: Array<{ id: string; body: string; createdAt: string }>;
  completion: { ready: boolean; missing: string[]; photoCount: number };
};
