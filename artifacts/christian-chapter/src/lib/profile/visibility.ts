export const VISIBILITY_LEVELS = ["hidden", "matches", "members"] as const;
export type VisibilityLevel = (typeof VISIBILITY_LEVELS)[number];

export const VISIBILITY_FIELDS = [
  "aboutMe",
  "faithDescription",
  "familySituation",
  "workStatus",
  "relationshipHistory",
  "lookingFor",
  "nextChapter",
  "photos",
  "media",
] as const;

export type VisibilityField = (typeof VISIBILITY_FIELDS)[number];
export type VisibilityMap = Record<VisibilityField, VisibilityLevel>;

export function defaultVisibility(): VisibilityMap {
  return {
    aboutMe: "members",
    faithDescription: "members",
    familySituation: "matches",
    workStatus: "members",
    relationshipHistory: "matches",
    lookingFor: "members",
    nextChapter: "members",
    photos: "members",
    media: "matches",
  };
}

export function parseVisibility(raw: unknown): VisibilityMap {
  const base = defaultVisibility();
  if (!raw || typeof raw !== "object") return base;
  const rec = raw as Record<string, unknown>;
  for (const field of VISIBILITY_FIELDS) {
    const value = rec[field];
    if (value === "hidden" || value === "matches" || value === "members") {
      base[field] = value;
    }
  }
  return base;
}

export function isVisibleTo(level: VisibilityLevel, viewer: "member" | "match"): boolean {
  if (level === "hidden") return false;
  if (level === "members") return true;
  return viewer === "match";
}
