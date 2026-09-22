/** Isolated homepage demonstration. Never written to production tables. */

export const DEMO_DISCLOSURE = "Demonstration profile — not a real member";

export const demoIntroduction = {
  firstName: "Helen",
  age: 52,
  region: "South East England",
  tradition: "Anglican / Church of England",
  poolLabel: "Nearby",
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

/** Labelled demonstration profiles for the phone. Never written to the database. */
export const demoProfiles = [
  {
    firstName: "Samuel",
    age: 57,
    region: "London",
    tradition: "Baptist",
    poolLabel: "Nearby",
    photo: "/images/home/profile-samuel.jpg",
    lifeEvent: "A bright walk, then I cook.",
    moments: [
      { src: "/images/home/samuel-park.jpg", alt: "Samuel laughing on a sunny riverside walk" },
      { src: "/images/home/samuel-kitchen.jpg", alt: "Samuel cooking in a bright kitchen" },
    ],
    lookingFor: "Someone kind, with a living faith and time for a shared life.",
  },
  {
    firstName: "Priya",
    age: 52,
    region: "West Midlands",
    tradition: "Catholic",
    poolLabel: "Nearby",
    photo: "/images/home/profile-priya.jpg",
    lifeEvent: "Saturday flowers, then coffee in the sun.",
    moments: [
      { src: "/images/home/priya-market.jpg", alt: "Priya laughing at a sunny flower market" },
      { src: "/images/home/priya-cafe.jpg", alt: "Priya with coffee by a bright cafe window" },
    ],
    lookingFor: "Company first. Marriage if it is right, without hurry.",
  },
];

export const demoEssentials = [
  { factor: "tradition", label: "Christian tradition", tier: "preferred" as const },
  { factor: "smoking", label: "Smoking", tier: "essential" as const },
  { factor: "distance", label: "Distance", tier: "preferred" as const },
  { factor: "remarriage", label: "Remarriage", tier: "open-minded" as const },
];
