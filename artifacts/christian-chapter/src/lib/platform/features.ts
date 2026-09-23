import { currentRuntime, type RuntimeEnv } from "./runtime";

export const FEATURE_KEYS = [
  "founding_registration",
  "full_member_onboarding",
  "photo_and_media_profiles",
  "mobile_verification",
  "selfie_verification",
  "introductions",
  "discovery",
  "interests_and_mutual_matches",
  "messaging",
  "voice_messages",
  "private_calls",
  "billing",
  "events",
  "referrals",
  "community_partner_links",
  "personal_matchmaking",
  "location_seo_aggregates",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

type FlagMatrix = Record<RuntimeEnv, boolean>;

/**
 * Server-authoritative defaults. Flags are not security controls —
 * permissions still gate data access.
 */
const DEFAULTS: Record<FeatureKey, FlagMatrix> = {
  founding_registration: { local: true, test: true, staging: true, production: true },
  full_member_onboarding: { local: true, test: true, staging: true, production: false },
  photo_and_media_profiles: { local: true, test: true, staging: true, production: false },
  mobile_verification: { local: true, test: true, staging: true, production: false },
  selfie_verification: { local: true, test: true, staging: true, production: false },
  introductions: { local: true, test: true, staging: false, production: false },
  discovery: { local: true, test: true, staging: false, production: false },
  interests_and_mutual_matches: { local: true, test: true, staging: false, production: false },
  messaging: { local: true, test: true, staging: false, production: false },
  voice_messages: { local: true, test: true, staging: false, production: false },
  private_calls: { local: true, test: true, staging: false, production: false },
  billing: { local: true, test: true, staging: true, production: false },
  events: { local: true, test: true, staging: false, production: false },
  referrals: { local: true, test: true, staging: false, production: false },
  community_partner_links: { local: true, test: true, staging: false, production: false },
  personal_matchmaking: { local: true, test: true, staging: true, production: true },
  location_seo_aggregates: { local: false, test: true, staging: false, production: false },
};

function envOverride(key: FeatureKey): boolean | null {
  const raw = process.env[`FEATURE_${key.toUpperCase()}`];
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

export function isFeatureEnabled(key: FeatureKey, runtime: RuntimeEnv = currentRuntime()): boolean {
  const override = envOverride(key);
  if (override !== null) return override;
  return DEFAULTS[key][runtime];
}

export function featureRegistry(runtime: RuntimeEnv = currentRuntime()) {
  return FEATURE_KEYS.map((key) => ({
    key,
    enabled: isFeatureEnabled(key, runtime),
    runtime,
    securityControl: false,
  }));
}
