/** One person does not fill the list by opening the same introduction repeatedly. */
export const PROFILE_VIEW_DEDUPE_MS = 12 * 60 * 60 * 1000;

export function viewIsFreshDuplicate(lastViewedAt: Date | null, now: Date): boolean {
  if (!lastViewedAt) return false;
  return now.getTime() - lastViewedAt.getTime() < PROFILE_VIEW_DEDUPE_MS;
}
