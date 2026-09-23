import { eq } from "drizzle-orm";
import { db, memberPhotos, notifications } from "@/db";
import { writeAudit } from "@/lib/audit";
import { PHOTO_NOT_VERIFIED_COPY, PHOTO_VERIFIED_COPY } from "./photos";

export async function decidePhotograph(input: {
  photoId: string;
  decision: "clear" | "rejected";
  adminId: string;
}) {
  const [photo] = await db.select().from(memberPhotos).where(eq(memberPhotos.id, input.photoId)).limit(1);
  if (!photo) return { error: "Photograph not found.", status: 404 as const };

  const now = new Date();
  await db
    .update(memberPhotos)
    .set({
      moderationStatus: input.decision,
      verificationStatus: input.decision === "clear" ? "verified" : "rejected",
    })
    .where(eq(memberPhotos.id, photo.id));

  const verified = input.decision === "clear";
  await db.insert(notifications).values({
    userId: photo.userId,
    channel: "in_app",
    template: verified ? "photo_verified" : "photo_not_verified",
    payload: { body: verified ? PHOTO_VERIFIED_COPY : PHOTO_NOT_VERIFIED_COPY, photoId: photo.id },
    status: "sent",
    sentAt: now,
  });

  await writeAudit({
    actorType: "admin",
    actorId: input.adminId,
    action: verified ? "photo_verified" : "photo_not_verified",
    entityType: "member_photo",
    entityId: photo.id,
    metadata: { userId: photo.userId },
  });

  return { ok: true as const };
}
