import { and, asc, eq, inArray, or } from "drizzle-orm";
import { db, chatMessages, conversations, memberProfiles, notifications } from "@/db";
import { orderedPair } from "@/lib/matching/connections";

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

export async function listConversations(userId: string) {
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
  return rows.map((row) => {
    const otherId = row.userLowId === userId ? row.userHighId : row.userLowId;
    const profile = profiles.find((item) => item.userId === otherId);
    return {
      id: row.id,
      otherUserId: otherId,
      firstName: profile?.firstName ?? null,
      ukRegion: profile?.ukRegion ?? null,
    };
  });
}

export async function conversationForMember(conversationId: string, userId: string) {
  const [row] = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  if (!row) return null;
  if (row.userLowId !== userId && row.userHighId !== userId) return null;
  return row;
}

export async function listChatMessages(conversationId: string) {
  return db
    .select({
      id: chatMessages.id,
      senderUserId: chatMessages.senderUserId,
      body: chatMessages.body,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(asc(chatMessages.createdAt))
    .limit(200);
}
