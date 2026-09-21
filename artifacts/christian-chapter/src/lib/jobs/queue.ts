import { db, jobs } from "@/db";

export type JobType =
  | "send_notification"
  | "image_moderation"
  | "activity_sweep"
  | "deletion_due"
  | "verification_recheck";

export async function enqueueJob(type: JobType, payload: Record<string, unknown>, runAfter = new Date()) {
  const [row] = await db
    .insert(jobs)
    .values({
      type,
      payload,
      status: "queued",
      runAfter,
    })
    .returning();
  return row;
}
