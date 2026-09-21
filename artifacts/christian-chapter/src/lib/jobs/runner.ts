import { and, eq, lte } from "drizzle-orm";
import { db, jobs, notifications, memberPhotos } from "@/db";
import { sendTransactionalEmail } from "@/lib/providers/email";
import { moderateImage } from "@/lib/providers/image-moderation";
import { recordProviderResult } from "@/lib/providers/record";
import { writeAudit } from "@/lib/audit";
import { sweepActivity } from "@/lib/matching/persist";
import type { RequestedState } from "@/lib/providers/types";

const MAX_ATTEMPTS_DEAD = true;

export async function runNextJobs(limit = 10) {
  const now = new Date();
  const queued = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.status, "queued"), lte(jobs.runAfter, now)))
    .limit(limit);

  const results = [];
  for (const job of queued) {
    results.push(await runJob(job.id));
  }
  return results;
}

export async function runJob(id: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  if (!job) return { ok: false, error: "Job not found." };

  await db
    .update(jobs)
    .set({ status: "running", lockedAt: new Date(), attempts: job.attempts + 1 })
    .where(eq(jobs.id, id));

  try {
    await handleJob(job.type, (job.payload ?? {}) as Record<string, unknown>);
    await db
      .update(jobs)
      .set({ status: "succeeded", completedAt: new Date(), lastError: null })
      .where(eq(jobs.id, id));
    return { ok: true, id, type: job.type };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Job failed";
    const dead = job.attempts + 1 >= job.maxAttempts && MAX_ATTEMPTS_DEAD;
    await db
      .update(jobs)
      .set({
        status: dead ? "dead" : "queued",
        lastError: message,
        runAfter: new Date(Date.now() + 60_000),
        lockedAt: null,
      })
      .where(eq(jobs.id, id));
    await writeAudit({
      actorType: "system",
      action: dead ? "job_dead" : "job_retry",
      entityType: "job",
      entityId: id,
      metadata: { type: job.type, message },
    });
    return { ok: false, id, error: message, dead };
  }
}

async function handleJob(type: string, payload: Record<string, unknown>) {
  if (type === "send_notification") {
    const [note] = await db
      .insert(notifications)
      .values({
        userId: String(payload.userId ?? "") || null,
        channel: String(payload.channel ?? "email"),
        template: String(payload.template ?? "generic"),
        payload,
        status: "queued",
      })
      .returning();
    const email = String(payload.to ?? "");
    if (!email) {
      await db.update(notifications).set({ status: "failed", lastError: "No recipient" }).where(eq(notifications.id, note.id));
      return;
    }
    const sent = await sendTransactionalEmail({
      to: email,
      subject: String(payload.subject ?? "Mature Christian Dating"),
      html: String(payload.html ?? "<p>Notification</p>"),
      text: String(payload.text ?? "Notification"),
      requestedState: payload.requestedState as RequestedState,
    });
    await db
      .update(notifications)
      .set({
        status: sent.state === "pass" ? "sent" : sent.state,
        lastError: sent.state === "pass" ? null : sent.message,
        sentAt: sent.state === "pass" ? new Date() : null,
      })
      .where(eq(notifications.id, note.id));
    await recordProviderResult({
      feature: "email",
      entityType: "notification",
      entityId: note.id,
      result: sent,
    });
    if (sent.state === "fail" || sent.state === "unavailable") {
      throw new Error(sent.message);
    }
    return;
  }

  if (type === "image_moderation") {
    const photoId = String(payload.photoId ?? "");
    const objectKey = String(payload.objectKey ?? "");
    const outcome = await moderateImage({
      objectKey,
      requestedState: payload.requestedState as RequestedState,
    });
    if (photoId) {
      await db
        .update(memberPhotos)
        .set({ moderationStatus: outcome.state === "pass" ? "clear" : outcome.state })
        .where(eq(memberPhotos.id, photoId));
    }
    await recordProviderResult({
      feature: "image_moderation",
      entityType: "member_photo",
      entityId: photoId || objectKey,
      result: outcome,
    });
    if (outcome.state === "fail" || outcome.state === "unavailable") {
      throw new Error(outcome.message);
    }
    return;
  }

  if (type === "activity_sweep") {
    await sweepActivity(typeof payload.now === "string" ? payload.now : null);
    return;
  }

  if (type === "deletion_due" || type === "verification_recheck") {
    await writeAudit({
      actorType: "system",
      action: `job_${type}_ran`,
      entityType: "job_handler",
      entityId: type,
      metadata: payload,
    });
    return;
  }

  throw new Error(`Unknown job type ${type}`);
}
