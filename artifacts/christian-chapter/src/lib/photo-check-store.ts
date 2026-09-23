import { and, eq, lt } from "drizzle-orm";
import { consentRecords, db, photoChecks } from "@/db";
import {
  PHOTO_CHECK_CONSENT_VERSION,
  PHOTO_CHECK_HOLD_MS,
  type PhotoCheckStatus,
  type PhotoCheckType,
} from "@/lib/photo-check";

const cleared = {
  imageData: null,
  contentType: null,
};

export async function releaseExpiredPhotoChecks(now = new Date()) {
  const cutoff = new Date(now.getTime() - PHOTO_CHECK_HOLD_MS);
  await db
    .update(photoChecks)
    .set({ ...cleared, status: "expired", imageDeletedAt: now })
    .where(and(eq(photoChecks.status, "pending"), lt(photoChecks.createdAt, cutoff)));
}

export async function releasePhotoCheckForUser(userId: string, now = new Date()) {
  await db
    .update(photoChecks)
    .set({ ...cleared, imageDeletedAt: now })
    .where(eq(photoChecks.userId, userId));
  await db
    .update(photoChecks)
    .set({ status: "expired" })
    .where(and(eq(photoChecks.userId, userId), eq(photoChecks.status, "pending")));
}

export async function readPhotoCheck(userId: string) {
  await releaseExpiredPhotoChecks();
  const [row] = await db.select().from(photoChecks).where(eq(photoChecks.userId, userId));
  return row ?? null;
}

export function photoCheckView(row: {
  status: string;
  imageData: string | null;
  decidedAt: Date | null;
  imageDeletedAt: Date | null;
} | null) {
  if (!row) return { status: null, imageHeld: false, decidedAt: null, imageDeletedAt: null };
  return {
    status: row.status as PhotoCheckStatus,
    imageHeld: Boolean(row.imageData),
    decidedAt: row.decidedAt?.toISOString() ?? null,
    imageDeletedAt: row.imageDeletedAt?.toISOString() ?? null,
  };
}

export async function savePhotoCheck(opts: {
  userId: string;
  imageBase64: string;
  contentType: PhotoCheckType;
  ipAddress: string | null;
  userAgent: string | null;
}) {
  const now = new Date();
  await releaseExpiredPhotoChecks(now);
  await db.transaction(async (tx) => {
    await tx
      .insert(photoChecks)
      .values({
        userId: opts.userId,
        status: "pending",
        imageData: opts.imageBase64,
        contentType: opts.contentType,
        consentedAt: now,
        decidedAt: null,
        imageDeletedAt: null,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: photoChecks.userId,
        set: {
          status: "pending",
          imageData: opts.imageBase64,
          contentType: opts.contentType,
          consentedAt: now,
          decidedAt: null,
          imageDeletedAt: null,
          createdAt: now,
        },
      });
    await tx.insert(consentRecords).values({
      userId: opts.userId,
      consentType: "photo_check",
      consentVersion: PHOTO_CHECK_CONSENT_VERSION,
      granted: true,
      grantedAt: now,
      source: "profile_verify",
      ipAddress: opts.ipAddress,
      userAgent: opts.userAgent,
    });
  });
}

export async function decidePhotoCheck(id: string, status: "matched" | "not_matched") {
  const now = new Date();
  const [row] = await db
    .update(photoChecks)
    .set({
      status,
      ...cleared,
      decidedAt: now,
      imageDeletedAt: now,
    })
    .where(and(eq(photoChecks.id, id), eq(photoChecks.status, "pending")))
    .returning({ id: photoChecks.id, status: photoChecks.status, imageData: photoChecks.imageData });
  return row ?? null;
}
