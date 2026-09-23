/** How many photographs a member can keep on their profile. */
export const PROFILE_PHOTO_LIMIT = 5;

/** Other members only see a photograph after it has been verified. */
export function photoIsPublic(moderationStatus: string | null | undefined): boolean {
  return moderationStatus === "clear";
}

export const PHOTO_VERIFIED_COPY = "Your photograph is verified. Other members can see it.";
export const PHOTO_NOT_VERIFIED_COPY =
  "A photograph was not verified. Other members cannot see it. You can upload a different one.";
