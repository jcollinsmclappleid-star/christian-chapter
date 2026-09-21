import { daysBetween } from "./clock.ts";

export const ACTIVITY_POLICY_VERSION = "act-01.1";

export type ActivityBand =
  | "active_now"
  | "active_recently"
  | "active_this_month"
  | "reactivation"
  | "inactive";

export type PublicActivityLabel =
  | "Active now"
  | "Active recently"
  | "Active this month"
  | "Returning"
  | "Away just now";

export function bandForLastActive(lastActiveAt: Date | null, now: Date): ActivityBand {
  if (!lastActiveAt) return "inactive";
  const days = daysBetween(now, lastActiveAt);
  if (days < 1) return "active_now";
  if (days < 8) return "active_recently";
  if (days < 31) return "active_this_month";
  if (days < 46) return "reactivation";
  return "inactive";
}

export function publicActivityLabel(
  activityState: string,
  lastActiveAt: Date | null,
  now: Date,
): PublicActivityLabel {
  if (activityState === "taking_a_break" || activityState === "hidden") return "Away just now";
  const band = activityState === "inactive" ? "inactive" : bandForLastActive(lastActiveAt, now);
  if (band === "active_now") return "Active now";
  if (band === "active_recently") return "Active recently";
  if (band === "active_this_month") return "Active this month";
  if (band === "reactivation") return "Returning";
  return "Away just now";
}

export function shouldNoticeReactivation(band: ActivityBand, previous: string): boolean {
  return band === "reactivation" && previous !== "reactivation" && previous !== "inactive";
}

export function shouldHideFromIntroductions(band: ActivityBand, activityState: string): boolean {
  if (activityState === "taking_a_break" || activityState === "hidden") return true;
  return band === "inactive";
}

export function transitionActivity(input: {
  activityState: string;
  lastActiveAt: Date | null;
  now: Date;
}): {
  nextState: string;
  band: ActivityBand;
  notice: "reactivation" | "inactive" | null;
  hideFromIntroductions: boolean;
} {
  if (input.activityState === "taking_a_break" || input.activityState === "hidden") {
    return {
      nextState: input.activityState,
      band: "inactive",
      notice: null,
      hideFromIntroductions: true,
    };
  }
  const band = bandForLastActive(input.lastActiveAt, input.now);
  const hideFromIntroductions = band === "inactive";
  let notice: "reactivation" | "inactive" | null = null;
  if (shouldNoticeReactivation(band, input.activityState)) notice = "reactivation";
  if (band === "inactive" && input.activityState !== "inactive") notice = "inactive";
  return {
    nextState: hideFromIntroductions ? "inactive" : band,
    band,
    notice,
    hideFromIntroductions,
  };
}
