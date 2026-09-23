/** How long a check photograph may exist before it is deleted with no decision. */
export const PHOTO_CHECK_HOLD_MS = 24 * 60 * 60 * 1000;
export const PHOTO_CHECK_MAX_BYTES = 4 * 1024 * 1024;
export const PHOTO_CHECK_CONSENT_VERSION = "2026-09-23";

export const PHOTO_CHECK_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type PhotoCheckType = (typeof PHOTO_CHECK_TYPES)[number];
export type PhotoCheckStatus = "pending" | "matched" | "not_matched" | "expired";

export function isPhotoCheckType(value: string): value is PhotoCheckType {
  return (PHOTO_CHECK_TYPES as readonly string[]).includes(value);
}

/** Pending photographs are deleted once the hold has passed. A decision deletes them at once. */
export function imageDueForDeletion(status: string, createdAt: Date, now: Date): boolean {
  if (status !== "pending") return false;
  return now.getTime() - createdAt.getTime() >= PHOTO_CHECK_HOLD_MS;
}
