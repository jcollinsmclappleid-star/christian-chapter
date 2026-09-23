/** Plans that include private browsing once billing can grant them. */
export const PRIVATE_BROWSING_PLANS = ["incognito", "plus"] as const;

export function hasPrivateBrowsingEntitlement(plan: string | null | undefined): boolean {
  return PRIVATE_BROWSING_PLANS.includes(plan as (typeof PRIVATE_BROWSING_PLANS)[number]);
}

export function isBrowsingPrivately(profile: {
  planEntitlement: string | null | undefined;
  privateBrowsing: boolean | null | undefined;
}): boolean {
  return Boolean(profile.privateBrowsing) && hasPrivateBrowsingEntitlement(profile.planEntitlement);
}
