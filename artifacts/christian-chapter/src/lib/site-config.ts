/**
 * Single source for organisation, legal and founding-stage flags.
 * Public copy must read this rather than inventing Ltd/VAT/prices.
 */

export const POLICY_VERSION = "2026-10-04";
export const POLICY_EFFECTIVE_DATE = "4 October 2026";
export const RELIGIOUS_CONSENT_VERSION = "2026-09-20";
export const MARKETING_CONSENT_VERSION = "2026-09-20";
export const TERMS_CONSENT_VERSION = "2026-10-04";

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

/**
 * Temporary hand-picked introductions. Secondary to the dating product.
 * Included free until matching technology opens. Not the identity of the service.
 */
export const CONCIERGE_PRICE_GBP = 89;
export const CONCIERGE_PRICE_LABEL = "£89 a month";

/** One customer-facing account of the founding stage. Dating first; concierge is the opening extra. */
export const HERO_OFFER =
  "Create your profile free. Matching technology opens on 14 February 2027. No card is taken.";

export const FOUNDING_MEMBER_COPY =
  "Mature Christian Dating is a Christian dating service for adults aged 40 and over. You write your profile, set what matters, and introductions come with a reason. Until 14 February 2027, founding members also receive a personal concierge introduction free of charge. Matching technology goes live that day. No payment is taken before then. An introduction is a choice, not a guarantee.";

/** Replaces a line that only pointed back at the homepage. */
export const FUNNEL_SERVICE_HEADING = "Introductions with a reason.";
export const FUNNEL_SERVICE_LINE =
  "You set what matters. Until 14 February 2027 a matchmaker also hand-picks an introduction, free. Matching technology opens that day.";

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

/** Companies House 17084981. Registered office matches the ICO register entry. */
export const LEGAL_ENTITY_NAME = "Ianson Systems Limited";
export const COMPANY_NUMBER = "17084981";
export const REGISTERED_OFFICE =
  "71-75 Shelton Street, Covent Garden, London, WC2H 9JQ";
export const ICO_REGISTRATION_REFERENCE = "ZC127831";
export const ICO_REGISTER_URL = "https://ico.org.uk/ESDWebPages/Entry/ZC127831";

export const siteConfig = {
  brandName: "Mature Christian Dating",
  descriptor: "Mature Christian dating",
  proposition: "Mature Christian dating.",
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "https://maturechristiandating.co.uk").replace(
    /\/$/,
    "",
  ),
  contactEmail: env("LEGAL_CONTACT_EMAIL", "hello@maturechristiandating.co.uk"),
  /** Blank env falls back to the registered company. Do not invent a different entity. */
  legalEntityName: env("LEGAL_ENTITY_NAME") || LEGAL_ENTITY_NAME,
  companyNumber: COMPANY_NUMBER,
  registeredOffice: REGISTERED_OFFICE,
  icoRegistrationReference: ICO_REGISTRATION_REFERENCE,
  icoRegisterUrl: ICO_REGISTER_URL,
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
