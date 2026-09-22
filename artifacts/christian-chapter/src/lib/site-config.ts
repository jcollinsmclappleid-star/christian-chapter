/**
 * Single source for organisation, legal and founding-stage flags.
 * Public copy must read this rather than inventing Ltd/VAT/prices.
 */

export const POLICY_VERSION = "2026-09-22";
export const POLICY_EFFECTIVE_DATE = "22 September 2026";
export const RELIGIOUS_CONSENT_VERSION = "2026-09-20";
export const MARKETING_CONSENT_VERSION = "2026-09-20";
export const TERMS_CONSENT_VERSION = "2026-09-22";

export const MINIMUM_AGE = 40;
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

/** One customer-facing account of the founding stage. */
export const FOUNDING_MEMBER_COPY =
  "Mature Christian Dating is free until 14 February 2027. During that opening offer, founding members can be introduced by hand: the team connects two profiles. From 15 February 2027 the member price is £29 a month. No payment is taken before then.";

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

export const siteConfig = {
  brandName: "Mature Christian Dating",
  descriptor: "Mature Christian dating",
  proposition: "Mature Christian dating.",
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "https://christianchapter.co.uk").replace(
    /\/$/,
    "",
  ),
  contactEmail: env("LEGAL_CONTACT_EMAIL", "hello@christianchapter.co.uk"),
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
