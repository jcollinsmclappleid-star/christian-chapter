import { and, asc, eq, gt, inArray, isNull, ne, or, lte } from "drizzle-orm";
import { db, chatMessages, conversations, memberBlocks, memberProfiles, notifications, reportEvidence } from "@/db";
import { orderedPair } from "@/lib/matching/connections";
import { readMessageExpiry, unreadMessageExpiry } from "./retention";
import { openMessage } from "./seal";

export async function pairIsBlocked(userA: string, userB: string) {
  const [row] = await db
    .select({ id: memberBlocks.id })
    .from(memberBlocks)
    .where(
      or(
        and(eq(memberBlocks.blockerUserId, userA), eq(memberBlocks.blockedUserId, userB)),
        and(eq(memberBlocks.blockerUserId, userB), eq(memberBlocks.blockedUserId, userA)),
      ),
    )
    .limit(1);
  return Boolean(row);
}

export async function openConversation(userAId: string, userBId: string, now = new Date()) {
  const [low, high] = orderedPair(userAId, userBId);
  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userLowId, low), eq(conversations.userHighId, high)))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(conversations)
    .values({ userLowId: low, userHighId: high, createdAt: now })
    .returning();

  const profiles = await db
    .select({ userId: memberProfiles.userId, firstName: memberProfiles.firstName })
    .from(memberProfiles)
    .where(or(eq(memberProfiles.userId, low), eq(memberProfiles.userId, high)));
  const nameFor = (id: string) => profiles.find((row) => row.userId === id)?.firstName?.trim() || "them";

  for (const [memberId, otherId] of [
    [low, high],
    [high, low],
  ] as const) {
    await db.insert(notifications).values({
      userId: memberId,
      channel: "in_app",
      template: "conversation_opened",
      payload: { body: `You can write to ${nameFor(otherId)}.` },
      status: "sent",
      sentAt: now,
    });
  }

  return created;
}

export async function listConversations(userId: string, opts: { includeBlocked?: boolean } = {}) {
  const rows = await db
    .select()
    .from(conversations)
    .where(or(eq(conversations.userLowId, userId), eq(conversations.userHighId, userId)));
  const otherIds = rows.map((row) => (row.userLowId === userId ? row.userHighId : row.userLowId));
  const profiles = otherIds.length
    ? await db
        .select({ userId: memberProfiles.userId, firstName: memberProfiles.firstName, ukRegion: memberProfiles.ukRegion })
        .from(memberProfiles)
        .where(inArray(memberProfiles.userId, otherIds))
    : [];
  const blockedRows = await db
    .select({ blockerUserId: memberBlocks.blockerUserId, blockedUserId: memberBlocks.blockedUserId })
    .from(memberBlocks)
    .where(or(eq(memberBlocks.blockerUserId, userId), eq(memberBlocks.blockedUserId, userId)));
  const blockedIds = new Set(
    blockedRows.flatMap((row) => [row.blockerUserId, row.blockedUserId]).filter((id) => id !== userId),
  );
  return rows.flatMap((row) => {
    const otherId = row.userLowId === userId ? row.userHighId : row.userLowId;
    if (blockedIds.has(otherId) && !opts.includeBlocked) return [];
    const profile = profiles.find((item) => item.userId === otherId);
    return [{
      id: row.id,
      otherUserId: otherId,
      firstName: profile?.firstName ?? null,
      ukRegion: profile?.ukRegion ?? null,
    }];
  });
}

export async function conversationForMember(conversationId: string, userId: string) {
  const [row] = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  if (!row) return null;
  if (row.userLowId !== userId && row.userHighId !== userId) return null;
  return row;
}

export async function listChatMessages(conversationId: string, readerUserId: string, now = new Date()) {
  const live = and(eq(chatMessages.conversationId, conversationId), gt(chatMessages.expiresAt, now));
  await db
    .update(chatMessages)
    .set({ firstReadAt: now, expiresAt: readMessageExpiry(now) })
    .where(and(live, isNull(chatMessages.firstReadAt), ne(chatMessages.senderUserId, readerUserId)));

  const rows = await db
    .select({
      id: chatMessages.id,
      senderUserId: chatMessages.senderUserId,
      body: chatMessages.body,
      createdAt: chatMessages.createdAt,
      firstReadAt: chatMessages.firstReadAt,
      expiresAt: chatMessages.expiresAt,
    })
    .from(chatMessages)
    .where(live)
    .orderBy(asc(chatMessages.createdAt))
    .limit(200);
  return rows.map((row) => ({ ...row, body: openMessage(row.body) }));
}

export async function purgeExpiredMessages(now = new Date()) {
  const expired = await db
    .select({ id: chatMessages.id })
    .from(chatMessages)
    .where(lte(chatMessages.expiresAt, now));
  if (expired.length > 0) {
    await db.delete(chatMessages).where(inArray(chatMessages.id, expired.map((row) => row.id)));
  }
  const oldEvidence = await db
    .select({ id: reportEvidence.id })
    .from(reportEvidence)
    .where(lte(reportEvidence.retainUntil, now));
  if (oldEvidence.length > 0) {
    await db.delete(reportEvidence).where(inArray(reportEvidence.id, oldEvidence.map((row) => row.id)));
  }
  return { deleted: expired.length, evidenceDeleted: oldEvidence.length };
}

export async function messagesForExport(userId: string, now = new Date()) {
  const convos = await listConversations(userId, { includeBlocked: true });
  if (convos.length === 0) return [];
  const ids = convos.map((row) => row.id);
  const live = and(inArray(chatMessages.conversationId, ids), gt(chatMessages.expiresAt, now));
  await db
    .update(chatMessages)
    .set({ firstReadAt: now, expiresAt: readMessageExpiry(now) })
    .where(and(live, isNull(chatMessages.firstReadAt), ne(chatMessages.senderUserId, userId)));

  const rows = await db
    .select({
      conversationId: chatMessages.conversationId,
      senderUserId: chatMessages.senderUserId,
      body: chatMessages.body,
      createdAt: chatMessages.createdAt,
      firstReadAt: chatMessages.firstReadAt,
      expiresAt: chatMessages.expiresAt,
    })
    .from(chatMessages)
    .where(live)
    .orderBy(asc(chatMessages.createdAt));

  return rows.map((row) => {
    const convo = convos.find((item) => item.id === row.conversationId);
    return {
      withFirstName: convo?.firstName ?? null,
      mine: row.senderUserId === userId,
      body: openMessage(row.body),
      sentAt: row.createdAt,
      firstReadAt: row.firstReadAt,
      expiresAt: row.expiresAt,
    };
  });
}

export { unreadMessageExpiry };
