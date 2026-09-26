/**
 * Single source for organisation, legal and founding-stage flags.
 * Public copy must read this rather than inventing Ltd/VAT/prices.
 */

export const POLICY_VERSION = "2026-09-23";
export const POLICY_EFFECTIVE_DATE = "23 September 2026";
export const RELIGIOUS_CONSENT_VERSION = "2026-09-20";
export const MARKETING_CONSENT_VERSION = "2026-09-20";
export const TERMS_CONSENT_VERSION = "2026-09-22";

export const MINIMUM_AGE = 40;
/** The distance control on a profile. Public pages may quote this range and no other radius. */
export const TRAVEL_MILES_MIN = 10;
export const TRAVEL_MILES_MAX = 200;
export const TRAVEL_MILES_COPY = `You choose how far you will travel, from ${TRAVEL_MILES_MIN} to ${TRAVEL_MILES_MAX} miles.`;
export const APPLICATION_RETENTION_DAYS = 30;

/**
 * Opening offer. The monthly figure is the price after this date.
 * It is shown so people can see it. Billing is not switched on, so nothing is charged.
 * £29 sits with the public one-month list prices checked in September 2026:
 * Match UK about £29.99, Christian Connection about £29.95.
 */
export const OPENING_OFFER_ENDS_LABEL = "14 February 2027";
export const OPENING_OFFER_ENDS_ISO = "2027-02-14";
export const MEMBER_PRICE_GBP = 29;
export const MEMBER_PRICE_LABEL = "£29 a month";
/** First charge. 14 February 2027 stays inside the free opening offer. */
export const MEMBER_BILLING_STARTS_ISO = "2027-02-15T00:00:00.000Z";
export const MEMBER_BILLING_STARTS_LABEL = "15 February 2027";

/** Separate from membership. Not charged until billing is switched on. */
export const INCOGNITO_PRICE_GBP = 9;
export const INCOGNITO_PRICE_LABEL = "£9 a month";
export const INCOGNITO_STARTS_LABEL = "15 February 2027";

/** One customer-facing account of the founding stage. */
export const HERO_OFFER =
  "Free for founding members. A complete profile can be hand-picked. Live matching opens on 14 February 2027.";

export const FOUNDING_MEMBER_COPY =
  "Mature Christian Dating is free for founding members. No payment is taken. A complete profile can be considered for a personal hand-picked introduction. The live matching system goes live on 14 February 2027.";

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

export const siteConfig = {
  brandName: "Mature Christian Dating",
  descriptor: "Mature Christian dating",
  proposition: "Mature Christian dating.",
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "https://maturechristiandating.co.uk").replace(
    /\/$/,
    "",
  ),
  contactEmail: env("LEGAL_CONTACT_EMAIL", "hello@maturechristiandating.co.uk"),
  /** Empty = not an incorporated company in copy. */
  legalEntityName: env("LEGAL_ENTITY_NAME"),
  icoComplaintsUrl: "https://ico.org.uk/make-a-complaint/",
  foundingStage: true,
  /** The later price is published. Checkout is not. */
  pricesPublished: true,
  vatRegistered: env("VAT_REGISTERED") === "true",
  memberMatchingLive: false,
  verificationLive: false,
  messagingLive: false,
  callingLive: false,
  billingLive: false,
} as const;

export function legalDisplayName(): string {
  return siteConfig.legalEntityName || siteConfig.brandName;
}

export function footerLegalLine(year: number): string {
  const name = legalDisplayName();
  if (siteConfig.vatRegistered && siteConfig.pricesPublished) {
    return `© ${year} ${name}. All prices include VAT where applicable.`;
  }
  return `© ${year} ${name}. Founding cohort — free to join.`;
}
