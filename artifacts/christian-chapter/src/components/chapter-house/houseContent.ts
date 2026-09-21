export type HouseMode =
  | "welcome"
  | "table"
  | "library"
  | "path"
  | "garden"
  | "courtyard"
  | "membership";

export type HouseView = "dossier" | "preview" | "essentials" | "privacy" | "plans" | null;
export type HouseCapability = "A" | "B" | "C";

export type HouseDestination = {
  id: Exclude<HouseMode, "welcome">;
  name: string;
  eyebrow: string;
  description: string;
  modelRoot: string;
  position: [number, number, number];
};

export const HOUSE_DESTINATIONS: HouseDestination[] = [
  {
    id: "table",
    name: "How it works",
    eyebrow: "The Common Table",
    description: "Finite introductions, with a reason.",
    modelRoot: "Table",
    position: [-2.45, 0.1, 0.55],
  },
  {
    id: "library",
    name: "Why different",
    eyebrow: "The Library",
    description: "A life told in chapters, not badges.",
    modelRoot: "Library",
    position: [2.45, 0.1, 0.35],
  },
  {
    id: "path",
    name: "What matters",
    eyebrow: "The Garden Path",
    description: "Essentials and distance you control.",
    modelRoot: "Path",
    position: [-2.8, 0, -2.2],
  },
  {
    id: "garden",
    name: "Privacy",
    eyebrow: "The Sheltered Garden",
    description: "Seen by the right people, on your terms.",
    modelRoot: "Garden",
    position: [2.8, 0, -2.15],
  },
  {
    id: "courtyard",
    name: "Community",
    eyebrow: "The Gathering Courtyard",
    description: "Support for meeting well — when it is ready.",
    modelRoot: "Courtyard",
    position: [0, 0, -0.35],
  },
  {
    id: "membership",
    name: "Membership",
    eyebrow: "The Membership Room",
    description: "Free to begin. Paid tiers when the cohort is ready.",
    modelRoot: "Membership",
    position: [0.15, 0.1, -2.75],
  },
];

export const HOUSE_MODEL_ROOTS = [
  "Threshold",
  "Table",
  "Library",
  "Path",
  "Garden",
  "Courtyard",
  "Membership",
] as const;

export const HOUSE_MODES: HouseMode[] = [
  "welcome",
  "table",
  "library",
  "path",
  "garden",
  "courtyard",
  "membership",
];

export const DESKTOP_CAMERA: Record<HouseMode, { position: [number, number, number]; target: [number, number, number] }> = {
  welcome: { position: [0.35, 2.35, 7.15], target: [0, 0.7, 0.15] },
  table: { position: [-0.55, 1.35, 2.35], target: [-2.4, 0.55, 0.55] },
  library: { position: [0.55, 1.2, 2.15], target: [2.4, 0.38, 0.35] },
  path: { position: [-1.05, 1.35, -0.15], target: [-2.75, 0.28, -2.25] },
  garden: { position: [1.05, 1.35, -0.1], target: [2.75, 0.4, -2.1] },
  courtyard: { position: [0.2, 1.45, 1.85], target: [0, 0.28, -0.35] },
  membership: { position: [1.15, 1.15, -1.15], target: [0.15, 0.5, -2.7] },
};

export const MOBILE_CAMERA: typeof DESKTOP_CAMERA = {
  welcome: { position: [0.15, 2.55, 7.55], target: [0, 0.65, 0.25] },
  table: { position: [-0.35, 1.45, 2.75], target: [-2.2, 0.5, 0.55] },
  library: { position: [0.35, 1.35, 2.55], target: [2.2, 0.36, 0.35] },
  path: { position: [-0.75, 1.5, 0.25], target: [-2.55, 0.28, -2.1] },
  garden: { position: [0.75, 1.5, 0.3], target: [2.55, 0.4, -2.0] },
  courtyard: { position: [0.1, 1.6, 2.25], target: [0, 0.28, -0.3] },
  membership: { position: [0.95, 1.25, -0.75], target: [0.15, 0.48, -2.55] },
};

export function destinationById(id: HouseMode) {
  return HOUSE_DESTINATIONS.find((item) => item.id === id) ?? null;
}
