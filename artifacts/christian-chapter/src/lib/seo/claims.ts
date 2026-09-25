/**
 * Public product sentences. Funnel pages may repeat these strings.
 * They may not invent a different product fact.
 */
import { MINIMUM_AGE, siteConfig } from "../site-config.ts";

export const PUBLIC_CLAIMS = {
  age: `Adults aged ${MINIMUM_AGE} and over. There is no maximum age.`,
  founding: siteConfig.foundingStage
    ? "Joining is free during the founding phase."
    : "See the pricing page for the current membership.",
  matching: siteConfig.memberMatchingLive
    ? "Introductions are available to members."
    : "Matching is not live in production today.",
  introductions:
    "Finite introductions, each with a reason. No swipe deck. No percentage score.",
  distance:
    "Distance choices are Nearby, Worth the journey, and Open to distance. We do not publish exact miles or live candidate counts.",
  verification: siteConfig.verificationLive
    ? "Verification is offered and is never proof of faith or character."
    : "Verification is not live and is never proof of faith or character.",
  prices: siteConfig.pricesPublished
    ? "Prices are on the pricing page."
    : "Prices are not published and there is no checkout.",
  faith: "Religious answers are collected only after separate consent. They are not a public directory.",
  demonstration:
    "This illustration shows Christian Chapter. It is not a member photograph.",
  upcoming:
    "Events and personal matchmaking are upcoming. They are not a live service in this founding phase.",
  usp: "No endless swiping · Introductions with reasons · Privacy by design",
  cta: "Begin your chapter",
  ctaHref: "/register",
} as const;

export const SHOWCASE = [
  {
    title: "The Common Table",
    body: `${PUBLIC_CLAIMS.introductions} ${PUBLIC_CLAIMS.matching}`,
  },
  {
    title: "The Library",
    body: "A life told in five chapters. What another member would see is shaped by your visibility choices.",
  },
  {
    title: "The Garden Path",
    body: PUBLIC_CLAIMS.distance,
  },
  {
    title: "The Sheltered Garden",
    body: PUBLIC_CLAIMS.verification,
  },
  {
    title: "The Gathering Courtyard",
    body: PUBLIC_CLAIMS.upcoming,
  },
  {
    title: "The Membership Room",
    body: `${PUBLIC_CLAIMS.founding} ${PUBLIC_CLAIMS.prices}`,
  },
] as const;

export const FUNNEL_FAQS = [
  {
    q: "What age is Christian Chapter for?",
    a: PUBLIC_CLAIMS.age,
  },
  {
    q: "Is it free to join?",
    a: `${PUBLIC_CLAIMS.founding} ${PUBLIC_CLAIMS.prices}`,
  },
  {
    q: "Can I be introduced to someone today?",
    a: `${PUBLIC_CLAIMS.matching} ${PUBLIC_CLAIMS.introductions}`,
  },
] as const;
