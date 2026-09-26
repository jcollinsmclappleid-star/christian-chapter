import { acquisitionPages } from "./acquisition.ts";
import { articleForPath, articleSourceFile } from "./catalog.ts";

/**
 * SEO brief registry.
 * Unpublished records have an empty body. They stay noindex until a later task
 * writes the page, QC passes, and a second pass signs the record.
 * Do not link these paths from the public site, and do not add them to the sitemap.
 */

export const WORD_BANDS = {
  narrow: { kind: "narrow", min: 600, max: 900 },
  landing: { kind: "landing", min: 900, max: 1200 },
  guide: { kind: "guide", min: 1200, max: 1600 },
  /** Homepage is a product page. Length bands are for articles, not this screen. */
  product: { kind: "product", min: 0, max: 1800 },
} as const;

export type WordBand = (typeof WORD_BANDS)[keyof typeof WORD_BANDS];
export type SeoStatus = "published" | "brief";
export type SeoIndex = "index" | "noindex";

export const ALLOWED_FACT_KEYS = [
  "brandName",
  "siteUrl",
  "contactEmail",
  "minimumAge",
  "openingOfferEndsLabel",
  "memberPriceLabel",
  "foundingMemberCopy",
  "applicationRetentionDays",
  "memberMatchingLive",
  "billingLive",
  "messagingLive",
  "callingLive",
  "verificationLive",
  "ukAdults40Plus",
  "separateReligiousConsent",
  "milesNotPublished",
  "travelMilesChosen",
  "photoReviewedByAPerson",
  "magicLinkEmail",
  "matchingNotLiveBeforeOpening",
  "noPaymentBeforeMemberPrice",
  "demonstrationProfilesLabelled",
  "noMemberMessagingYet",
  "adminMayPrepareAConnection",
] as const;

export type AllowedFactKey = (typeof ALLOWED_FACT_KEYS)[number];

/** Phrases that must not appear in a published page source. */
export const FORBIDDEN_CLAIM_PHRASES = [
  "matching is open now",
  "background check",
  "background checks",
  "live chat",
  "verified members",
  "AggregateRating",
  "member count",
] as const;

const CORE_FACTS: AllowedFactKey[] = [
  "brandName",
  "siteUrl",
  "contactEmail",
  "minimumAge",
  "openingOfferEndsLabel",
  "memberPriceLabel",
  "foundingMemberCopy",
  "memberMatchingLive",
  "billingLive",
  "ukAdults40Plus",
  "matchingNotLiveBeforeOpening",
  "noPaymentBeforeMemberPrice",
];

export type SeoBrief = {
  path: string;
  primaryQuery: string;
  searchIntent: string;
  status: SeoStatus;
  index: SeoIndex;
  wordBand: WordBand;
  h1: string;
  title: string;
  description: string;
  allowedFacts: readonly AllowedFactKey[];
  forbiddenClaims: readonly string[];
  /** Editorial links. Each one must already be a published, indexable URL. */
  internalLinks: readonly string[];
  body: string;
  /** Set by a person or a fresh agent after the second QC pass. Null keeps a brief noindex. */
  secondPassSignedAt: string | null;
  sourceFile: string | null;
  lastModified?: string;
  changeFrequency?: "weekly" | "monthly" | "yearly";
  priority?: number;
};

const PUBLISHED_ON = "2026-09-22";

function published(entry: Omit<SeoBrief, "status" | "index" | "body" | "secondPassSignedAt" | "forbiddenClaims"> & {
  forbiddenClaims?: readonly string[];
}): SeoBrief {
  return {
    ...entry,
    status: "published",
    index: "index",
    body: "",
    secondPassSignedAt: null,
    forbiddenClaims: entry.forbiddenClaims ?? FORBIDDEN_CLAIM_PHRASES,
  };
}

function brief(entry: Omit<SeoBrief, "status" | "index" | "body" | "secondPassSignedAt" | "sourceFile" | "forbiddenClaims"> & {
  forbiddenClaims?: readonly string[];
}): SeoBrief {
  return {
    ...entry,
    status: "brief",
    index: "noindex",
    body: "",
    secondPassSignedAt: null,
    sourceFile: null,
    forbiddenClaims: entry.forbiddenClaims ?? FORBIDDEN_CLAIM_PHRASES,
  };
}

const REGIONS: { slug: string; name: string }[] = [
  { slug: "greater-london", name: "Greater London" },
  { slug: "south-east-england", name: "South East England" },
  { slug: "south-west-england", name: "South West England" },
  { slug: "east-of-england", name: "East of England" },
  { slug: "east-midlands", name: "East Midlands" },
  { slug: "west-midlands", name: "West Midlands" },
  { slug: "yorkshire-and-the-humber", name: "Yorkshire and the Humber" },
  { slug: "north-west-england", name: "North West England" },
  { slug: "north-east-england", name: "North East England" },
  { slug: "scotland", name: "Scotland" },
  { slug: "wales", name: "Wales" },
  { slug: "northern-ireland", name: "Northern Ireland" },
];

const TRADITION_PAGES: { slug: string; name: string; query: string }[] = [
  { slug: "anglican", name: "Anglican", query: "anglican dating uk" },
  { slug: "baptist", name: "Baptist", query: "baptist dating uk" },
  { slug: "catholic", name: "Catholic", query: "catholic dating uk" },
  { slug: "methodist", name: "Methodist", query: "methodist dating uk" },
  { slug: "pentecostal", name: "Pentecostal", query: "pentecostal dating uk" },
  { slug: "presbyterian", name: "Presbyterian", query: "presbyterian dating uk" },
];

const registry: SeoBrief[] = [
  published({
    path: "/",
    primaryQuery: "mature christian dating",
    searchIntent: "Find a UK dating service for Christian adults aged 40 and over",
    wordBand: WORD_BANDS.product,
    h1: "Mature Christian dating.",
    title: "Mature Christian dating",
    description:
      "Mature Christian dating for UK adults aged 40 and over. Meet thoughtful Christian singles who share your faith and want a meaningful relationship — without endless swiping.",
    allowedFacts: [...CORE_FACTS, "demonstrationProfilesLabelled", "milesNotPublished"],
    internalLinks: ["/how-it-works"],
    sourceFile: "app/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "weekly",
    priority: 1,
  }),
  published({
    path: "/how-it-works",
    primaryQuery: "how christian dating works uk",
    searchIntent: "Understand how introductions are designed, and what is not live yet",
    wordBand: WORD_BANDS.narrow,
    h1: "How it works",
    title: "How Mature Christian Dating works",
    description:
      "Mature Christian Dating uses considered introductions — not swiping or endless browsing. Learn how we introduce Christian singles based on faith, life stage, intentions and practical compatibility.",
    allowedFacts: [...CORE_FACTS, "adminMayPrepareAConnection"],
    internalLinks: ["/"],
    sourceFile: "app/how-it-works/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.8,
  }),
  published({
    path: "/about",
    primaryQuery: "about mature christian dating",
    searchIntent: "Learn who the service is for",
    wordBand: WORD_BANDS.product,
    h1: "About us",
    title: "About us",
    description:
      "Mature Christian Dating is for UK adults aged 40 and over who want a lasting relationship with someone who shares their faith.",
    allowedFacts: [...CORE_FACTS, "separateReligiousConsent"],
    internalLinks: ["/", "/how-it-works"],
    sourceFile: "app/about/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.6,
  }),
  published({
    path: "/safety",
    primaryQuery: "christian dating safety uk",
    searchIntent: "See which safety controls exist today",
    wordBand: WORD_BANDS.narrow,
    h1: "Safety",
    title: "Safety at Mature Christian Dating",
    description:
      "How the Mature Christian Dating founding cohort is protected today, and which safety controls are still being built for later introductions.",
    allowedFacts: [...CORE_FACTS, "separateReligiousConsent", "photoReviewedByAPerson", "noMemberMessagingYet"],
    internalLinks: ["/guides/safety/romance-fraud"],
    sourceFile: "app/safety/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.7,
  }),
  published({
    path: "/pricing",
    primaryQuery: "mature christian dating cost",
    searchIntent: "See the founding offer and the later member price",
    wordBand: WORD_BANDS.narrow,
    h1: "Free until 14 February 2027.",
    title: "Pricing — Mature Christian Dating",
    description:
      "Mature Christian Dating is free until 14 February 2027. After that the member price is £29 a month. No payment is taken during the opening offer.",
    allowedFacts: [...CORE_FACTS, "billingLive"],
    internalLinks: ["/"],
    sourceFile: "app/pricing/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "weekly",
    priority: 0.8,
  }),
  published({
    path: "/christian-dating",
    primaryQuery: "christian dating uk",
    searchIntent: "Learn who the UK service is for",
    wordBand: WORD_BANDS.landing,
    h1: "Christian dating in the UK",
    title: "Christian dating UK — meet genuine Christian singles",
    description:
      "Mature Christian Dating is for UK adults aged 40 and over. There is no maximum age. Matching goes live on 14 February 2027. Create a profile to begin.",
    allowedFacts: [...CORE_FACTS, "separateReligiousConsent"],
    internalLinks: [
      "/christian-dating/over-40",
      "/christian-dating/over-50",
      "/christian-dating/over-60",
      "/christian-dating/after-divorce",
      "/christian-dating/after-bereavement",
      "/christian-dating/remarriage",
    ],
    sourceFile: "app/christian-dating/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.9,
  }),
  published({
    path: "/christian-dating/over-40",
    primaryQuery: "christian dating over 40",
    searchIntent: "Life-stage page for Christian adults in their 40s",
    wordBand: WORD_BANDS.landing,
    h1: "Christian dating in your 40s",
    title: "Christian dating over 40 — UK Christian singles in your 40s",
    description:
      "Mature Christian Dating helps Christians in their 40s meet people who share their faith, intentions and life stage. Considered introductions, not swiping. Join free.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating"],
    sourceFile: "app/christian-dating/over-40/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.9,
  }),
  published({
    path: "/christian-dating/over-50",
    primaryQuery: "christian dating over 50",
    searchIntent: "Life-stage page for Christian adults in their 50s",
    wordBand: WORD_BANDS.landing,
    h1: "Christian dating in your 50s",
    title: "Christian dating over 50 — UK Christian singles in your 50s",
    description:
      "Mature Christian Dating helps Christians in their 50s meet someone who genuinely understands their faith, life and hopes for the next chapter. Considered UK introductions.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating"],
    sourceFile: "app/christian-dating/over-50/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.9,
  }),
  published({
    path: "/christian-dating/over-60",
    primaryQuery: "christian dating over 60",
    searchIntent: "Life-stage page for Christian adults in their 60s",
    wordBand: WORD_BANDS.landing,
    h1: "Christian dating in your 60s",
    title: "Christian dating over 60 — UK Christian singles in your 60s",
    description:
      "Christian dating in your 60s with Mature Christian Dating. A contemporary, accessible service designed for mature faith and genuine companionship. UK-wide introductions.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating"],
    sourceFile: "app/christian-dating/over-60/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.8,
  }),
  published({
    path: "/christian-dating/after-divorce",
    primaryQuery: "christian dating after divorce",
    searchIntent: "Life-stage page for dating after divorce",
    wordBand: WORD_BANDS.landing,
    h1: "Christian dating after divorce",
    title: "Christian dating after divorce — a thoughtful guide",
    description:
      "A sensitive, practical guide to Christian dating after divorce. Questions of faith, readiness and finding someone who understands your history — from Mature Christian Dating.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating", "/christian-dating/remarriage"],
    sourceFile: "app/christian-dating/after-divorce/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.8,
  }),
  published({
    path: "/christian-dating/after-bereavement",
    primaryQuery: "christian dating after bereavement",
    searchIntent: "Life-stage page for dating after a partner has died",
    wordBand: WORD_BANDS.landing,
    h1: "Christian dating after bereavement",
    title: "Christian dating after bereavement — a careful guide",
    description:
      "A thoughtful guide to Christian dating after losing a partner. Grief, readiness and the hope of a second chapter — from Mature Christian Dating. No sales pressure.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating"],
    sourceFile: "app/christian-dating/after-bereavement/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.7,
  }),
  published({
    path: "/christian-dating/remarriage",
    primaryQuery: "christian remarriage",
    searchIntent: "How remarriage is recorded on a founding application",
    wordBand: WORD_BANDS.landing,
    h1: "Christian remarriage when a previous marriage has ended",
    title: "Christian remarriage — dating after a previous marriage",
    description:
      "A UK guide to Christian remarriage: faith views, blended families, and how a founding application records whether you are open to marrying again. Not a live introductions marketplace.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating", "/christian-dating/after-divorce"],
    sourceFile: "app/christian-dating/remarriage/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.8,
  }),
  published({
    path: "/guides/safety/romance-fraud",
    primaryQuery: "romance fraud christian dating",
    searchIntent: "Practical warning signs and where to report",
    wordBand: WORD_BANDS.guide,
    h1: "Romance fraud and Christian dating",
    title: "Romance fraud — staying safe while dating as a Christian",
    description:
      "UK romance-fraud warning signs, Action Fraud reporting, and what Mature Christian Dating already does versus what is still being built. Founding cohort, not live messaging.",
    allowedFacts: [...CORE_FACTS, "noMemberMessagingYet"],
    internalLinks: ["/safety"],
    sourceFile: "app/guides/safety/romance-fraud/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.6,
  }),
  published({
    path: "/guides/christian-relationships/dating-across-denominations",
    primaryQuery: "dating across christian denominations",
    searchIntent: "How different traditions can meet",
    wordBand: WORD_BANDS.guide,
    h1: "Dating across Christian denominations",
    title: "Dating across Christian denominations in the UK",
    description:
      "How Anglican, Catholic, Baptist, Pentecostal and other traditions meet in a UK founding cohort. Essentials for denomination are design intent, not a live matching filter yet.",
    allowedFacts: [...CORE_FACTS, "separateReligiousConsent"],
    internalLinks: ["/christian-dating"],
    sourceFile: "app/guides/christian-relationships/dating-across-denominations/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.6,
  }),
  published({
    path: "/success-stories",
    primaryQuery: "christian dating success stories",
    searchIntent: "See whether any consented member stories are published",
    wordBand: WORD_BANDS.narrow,
    h1: "Meaningful connections, in their own words.",
    title: "Success stories — Mature Christian Dating",
    description:
      "Mature Christian Dating has no success stories yet. A story is published only with the specific consent of everyone involved.",
    allowedFacts: [...CORE_FACTS, "demonstrationProfilesLabelled"],
    internalLinks: ["/"],
    sourceFile: "app/success-stories/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "weekly",
    priority: 0.6,
  }),
  published({
    path: "/privacy",
    primaryQuery: "mature christian dating privacy",
    searchIntent: "Read what data is processed today",
    wordBand: WORD_BANDS.narrow,
    h1: "Privacy policy",
    title: "Privacy policy",
    description:
      "How Mature Christian Dating processes personal data during the founding cohort, including religious-belief consent.",
    allowedFacts: [...CORE_FACTS, "applicationRetentionDays", "separateReligiousConsent", "messagingLive", "callingLive", "verificationLive"],
    internalLinks: ["/"],
    sourceFile: "app/privacy/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.4,
  }),
  published({
    path: "/terms",
    primaryQuery: "mature christian dating terms",
    searchIntent: "Read the founding cohort terms",
    wordBand: WORD_BANDS.narrow,
    h1: "Terms of use",
    title: "Terms of use",
    description:
      "Terms for the Mature Christian Dating founding cohort, including 40+ eligibility and no guarantee of introductions.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/"],
    sourceFile: "app/terms/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "monthly",
    priority: 0.4,
  }),
  published({
    path: "/cookies",
    primaryQuery: "mature christian dating cookies",
    searchIntent: "See which cookies and local storage the site uses",
    wordBand: WORD_BANDS.narrow,
    h1: "Cookie information",
    title: "Cookie information",
    description:
      "Cookies and local storage actually used by Mature Christian Dating. There is no advertising or analytics cookie.",
    allowedFacts: ["brandName", "siteUrl", "contactEmail"],
    internalLinks: ["/privacy"],
    sourceFile: "app/cookies/page.tsx",
    lastModified: PUBLISHED_ON,
    changeFrequency: "yearly",
    priority: 0.4,
  }),
  brief({
    path: "/christian-dating/widowed",
    primaryQuery: "christian dating widowed uk",
    searchIntent: "Life-stage page for people whose partner has died",
    wordBand: WORD_BANDS.landing,
    h1: "Christian dating when you have been widowed",
    title: "Christian dating for widowed adults in the UK",
    description:
      "A later page for widowed Christian adults aged 40 and over. Not published yet.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating", "/christian-dating/after-bereavement"],
  }),
  brief({
    path: "/guides",
    primaryQuery: "christian dating advice uk",
    searchIntent: "A short index of guides that already exist",
    wordBand: WORD_BANDS.narrow,
    h1: "Guides for mature Christian dating",
    title: "Guides — Mature Christian Dating",
    description: "A later index of practical guides. Not published yet.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/guides/safety/romance-fraud", "/guides/christian-relationships/dating-across-denominations"],
  }),
  brief({
    path: "/guides/writing-your-profile",
    primaryQuery: "how to write a christian dating profile",
    searchIntent: "How to write a short profile after 40",
    wordBand: WORD_BANDS.guide,
    h1: "Writing a Christian dating profile after 40",
    title: "Writing your Christian dating profile",
    description: "A later guide to a short profile line. Not published yet.",
    allowedFacts: [...CORE_FACTS, "photoReviewedByAPerson"],
    internalLinks: ["/how-it-works", "/christian-dating"],
  }),
  brief({
    path: "/guides/a-first-meeting",
    primaryQuery: "first meeting christian dating",
    searchIntent: "How to plan a first meeting with care",
    wordBand: WORD_BANDS.guide,
    h1: "A first meeting, planned with care",
    title: "Planning a first meeting",
    description: "A later guide to a first meeting. Not published yet.",
    allowedFacts: [...CORE_FACTS, "milesNotPublished"],
    internalLinks: ["/safety", "/how-it-works"],
  }),
  brief({
    path: "/guides/first-dates-after-40",
    primaryQuery: "first dates after 40 christian",
    searchIntent: "Ideas for a first date after 40",
    wordBand: WORD_BANDS.guide,
    h1: "First dates after 40",
    title: "First dates after 40 for Christian adults",
    description: "A later guide to first dates after 40. Not published yet.",
    allowedFacts: CORE_FACTS,
    internalLinks: ["/christian-dating/over-40", "/safety"],
  }),
  ...TRADITION_PAGES.map((tradition) =>
    brief({
      path: `/christian-dating/${tradition.slug}`,
      primaryQuery: tradition.query,
      searchIntent: `Tradition page for ${tradition.name} adults in the UK`,
      wordBand: WORD_BANDS.landing,
      h1: `${tradition.name} Christian dating in the UK`,
      title: `${tradition.name} dating for Christian adults over 40`,
      description: `A later page for ${tradition.name} Christian adults aged 40 and over. Not published yet.`,
      allowedFacts: [...CORE_FACTS, "separateReligiousConsent"],
      internalLinks: ["/christian-dating", "/guides/christian-relationships/dating-across-denominations"],
    }),
  ),
  ...REGIONS.map((region) =>
    brief({
      path: `/christian-dating/${region.slug}`,
      primaryQuery: `christian dating ${region.name.toLowerCase()}`,
      searchIntent: `Region page for Christian adults in ${region.name}`,
      wordBand: WORD_BANDS.landing,
      h1: `Christian dating in ${region.name}`,
      title: `Christian dating in ${region.name} for adults over 40`,
      description: `A later page for Christian adults aged 40 and over in ${region.name}. Not published yet.`,
      allowedFacts: [...CORE_FACTS, "milesNotPublished"],
      internalLinks: ["/christian-dating", "/safety"],
    }),
  ),
];

const fromArticles: SeoBrief[] = registry.map((record) => {
  const article = articleForPath(record.path);
  const sourceFile = articleSourceFile(record.path);
  if (!article || !sourceFile) return record;
  return {
    ...record,
    h1: article.h1,
    title: article.title,
    description: article.description,
    status: "published" as const,
    index: "index" as const,
    body: article.lede,
    secondPassSignedAt: "2026-09-23",
    sourceFile,
    internalLinks: article.related.map((link) => link.href),
    lastModified: "2026-09-23",
    changeFrequency: "monthly" as const,
    priority: record.path === "/guides" ? 0.6 : 0.7,
  };
});

const fromAcquisition: SeoBrief[] = acquisitionPages.map((item) => ({
  path: item.path,
  primaryQuery: item.primaryQuery,
  searchIntent: item.searchIntent,
  status: "published" as const,
  index: "index" as const,
  wordBand: WORD_BANDS.product,
  h1: item.h1,
  title: item.title,
  description: item.description,
  allowedFacts: [...CORE_FACTS, "travelMilesChosen" as const],
  forbiddenClaims: FORBIDDEN_CLAIM_PHRASES,
  internalLinks: item.related.map((link) => link.href),
  body: item.lede,
  secondPassSignedAt: "2026-09-26",
  sourceFile: item.sourceFile,
  lastModified: "2026-09-26",
  changeFrequency: "monthly" as const,
  priority: item.path === "/free-christian-dating" ? 0.8 : 0.5,
}));

export const seoBriefs: SeoBrief[] = [...fromArticles, ...fromAcquisition];

export function mayIndex(record: SeoBrief): boolean {
  return record.status === "published" && record.index === "index";
}

/** A brief stays noindex until a second pass signs it and the status becomes published. */
export function promotionBlockers(record: SeoBrief): string[] {
  const blockers: string[] = [];
  if (!record.secondPassSignedAt) blockers.push("second pass has not signed this record");
  if (!record.body.trim()) blockers.push("body is empty");
  if (record.status !== "published") blockers.push("status is still a brief");
  if (record.index !== "index") blockers.push("index is noindex");
  return blockers;
}
