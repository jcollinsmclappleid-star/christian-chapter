import { and, eq, lte, or, sql } from "drizzle-orm";
import {
  accountClosureRequests,
  auditEvents,
  db,
  foundingMembers,
  memberMedia,
  memberPhotos,
  users,
} from "@/db";
import { writeAudit } from "@/lib/audit";
import { releasePhotoCheckForUser } from "@/lib/photo-check-store";
import { deleteMemberUploads, deleteUpload } from "@/lib/storage/local";
import { isDeletionDue } from "@/lib/account/purge-schedule";

export { isDeletionDue } from "@/lib/account/purge-schedule";

export type PurgeResult =
  | { ok: true; userId: string; closureRequestId: number }
  | { ok: false; error: string };

export async function purgeMemberAccount(
  userId: string,
  opts: { now?: Date; ignoreSchedule?: boolean } = {},
): Promise<PurgeResult> {
  const now = opts.now ?? new Date();
  const [closure] = await db
    .select()
    .from(accountClosureRequests)
    .where(and(eq(accountClosureRequests.userId, userId), eq(accountClosureRequests.status, "open")))
    .limit(1);

  if (!closure) {
    return { ok: false, error: "No open closure request for this member." };
  }

  if (!opts.ignoreSchedule && !isDeletionDue(closure.scheduledDeleteAt, now)) {
    return { ok: false, error: "The retention period has not ended yet." };
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    return { ok: false, error: "Member not found." };
  }

  const photos = await db
    .select({ storageKey: memberPhotos.storageKey, imageData: memberPhotos.imageData })
    .from(memberPhotos)
    .where(eq(memberPhotos.userId, userId));
  const media = await db
    .select({ storageKey: memberMedia.storageKey })
    .from(memberMedia)
    .where(eq(memberMedia.userId, userId));

  for (const row of photos) {
    if (row.storageKey) await deleteUpload(row.storageKey);
  }
  for (const row of media) {
    await deleteUpload(row.storageKey);
  }
  await deleteMemberUploads(userId);
  await releasePhotoCheckForUser(userId, now);

  const closureRequestId = closure.id;

  await db.transaction(async (tx) => {
    await tx
      .update(accountClosureRequests)
      .set({ status: "resolved", resolvedAt: now })
      .where(eq(accountClosureRequests.id, closureRequestId));

    if (user.legacyFoundingMemberId) {
      await tx
        .update(foundingMembers)
        .set({
          firstName: "Removed",
          email: `purged-${userId}@redacted.invalid`,
          faithDescription: null,
          storyPrompt1: null,
          storyPrompt2: null,
          storyPrompt3: null,
          internalNotes: null,
          updatedAt: now,
        })
        .where(eq(foundingMembers.id, user.legacyFoundingMemberId));
    }

    await tx
      .update(auditEvents)
      .set({
        actorId: "purged",
        metadata: sql`jsonb_set(COALESCE(${auditEvents.metadata}, '{}'::jsonb), '{piiRemoved}', 'true'::jsonb)`,
      })
      .where(
        or(
          eq(auditEvents.actorId, userId),
          and(eq(auditEvents.entityType, "user"), eq(auditEvents.entityId, userId)),
        ),
      );

    await tx.delete(users).where(eq(users.id, userId));
  });

  await writeAudit({
    actorType: "system",
    action: "member_data_purged",
    entityType: "account_closure_request",
    entityId: String(closureRequestId),
    metadata: { userId, purgedAt: now.toISOString() },
  });

  return { ok: true, userId, closureRequestId };
}

export async function processDueAccountDeletions(now = new Date()) {
  const due = await db
    .select({ userId: accountClosureRequests.userId })
    .from(accountClosureRequests)
    .where(
      and(
        eq(accountClosureRequests.status, "open"),
        lte(accountClosureRequests.scheduledDeleteAt, now),
      ),
    );

  const results: PurgeResult[] = [];
  for (const row of due) {
    results.push(await purgeMemberAccount(row.userId, { now }));
  }
  return results;
}
