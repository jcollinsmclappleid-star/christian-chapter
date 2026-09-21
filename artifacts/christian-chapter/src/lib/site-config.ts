/**
 * Single source for organisation, legal and founding-stage flags.
 * Public copy must read this rather than inventing Ltd/VAT/prices.
 */

export const POLICY_VERSION = "2026-09-20";
export const POLICY_EFFECTIVE_DATE = "20 September 2026";
export const RELIGIOUS_CONSENT_VERSION = "2026-09-20";
export const MARKETING_CONSENT_VERSION = "2026-09-20";
export const TERMS_CONSENT_VERSION = "2026-09-20";

export const MINIMUM_AGE = 40;
export const APPLICATION_RETENTION_DAYS = 30;

/** One customer-facing account of the founding stage. Do not invent a launch date. */
export const FOUNDING_MEMBER_COPY =
  "Christian Chapter is welcoming its founding members now. Create your profile free and help form the first Christian Chapter cohorts. Introductions will begin cohort by cohort once there are enough compatible, active members.";

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

export const siteConfig = {
  brandName: "Christian Chapter",
  descriptor: "UK Christian dating for your next chapter",
  proposition: "Christian dating for your next chapter.",
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "https://christianchapter.co.uk").replace(
    /\/$/,
    "",
  ),
  contactEmail: env("LEGAL_CONTACT_EMAIL", "hello@christianchapter.co.uk"),
  /** Empty = not an incorporated company in copy. */
  legalEntityName: env("LEGAL_ENTITY_NAME"),
  icoComplaintsUrl: "https://ico.org.uk/make-a-complaint/",
  foundingStage: true,
  pricesPublished: false,
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
