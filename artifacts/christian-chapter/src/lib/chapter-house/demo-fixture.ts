/** Isolated homepage demonstration. Never written to production tables. */

export const DEMO_DISCLOSURE = "Demonstration profile — not a real member";

export const demoIntroduction = {
  firstName: "Helen",
  age: 52,
  region: "South East England",
  tradition: "Anglican / Church of England",
  poolLabel: "Nearby",
  alignmentText: "Strong alignment",
  why: [
    "You share a similar faith life.",
    "You are looking for a similar kind of relationship.",
    "You are in a similar chapter of life.",
  ],
  worthDiscussing: ["Meeting would involve some travel within the same nation."],
  lookingFor: "Someone kind, with a living faith and time for an ordinary shared life.",
};

export const demoChapters = [
  { id: "about", title: "About me", body: "I teach part-time, walk most evenings, and still sing in a parish choir." },
  { id: "faith", title: "My faith", body: "Anglican, most weeks. Faith is present — not performed." },
  { id: "life", title: "My life", body: "Two adult children. A small garden. Work that still matters." },
  { id: "looking", title: "What I’m looking for", body: "Companionship first. Marriage if it is right, without hurry." },
  { id: "next", title: "My next chapter", body: "Someone to share Sundays and the quiet midweek." },
];

export const demoEssentials = [
  { factor: "tradition", label: "Christian tradition", tier: "preferred" as const },
  { factor: "smoking", label: "Smoking", tier: "essential" as const },
  { factor: "distance", label: "Distance", tier: "preferred" as const },
];
