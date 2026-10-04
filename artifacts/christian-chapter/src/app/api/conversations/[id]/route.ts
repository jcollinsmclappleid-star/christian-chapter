import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, chatMessages } from "@/db";
import { requireVerifiedMemberApi } from "@/lib/member-session";
import { conversationForMember, listChatMessages, pairIsBlocked, unreadMessageExpiry } from "@/lib/chat/open";
import { sealMessage } from "@/lib/chat/seal";
import { containsProfanity } from "@/lib/language/profanity";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  const { id } = await params;
  const conversation = await conversationForMember(id, session.user.id);
  if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  const otherId = conversation.userLowId === session.user.id ? conversation.userHighId : conversation.userLowId;
  if (await pairIsBlocked(session.user.id, otherId)) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }
  const messages = await listChatMessages(id, session.user.id);
  return NextResponse.json({
    messages: messages.map((row) => ({
      ...row,
      mine: row.senderUserId === session.user.id,
      createdAt: row.createdAt.toISOString(),
    })),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  const { id } = await params;
  const conversation = await conversationForMember(id, session.user.id);
  if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  const otherId = conversation.userLowId === session.user.id ? conversation.userHighId : conversation.userLowId;
  if (await pairIsBlocked(session.user.id, otherId)) {
    return NextResponse.json({ error: "This conversation is closed." }, { status: 403 });
  }

  const parse = z.object({ body: z.string().trim().min(1).max(2000) }).safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Write a message." }, { status: 422 });
  if (containsProfanity(parse.data.body)) {
    return NextResponse.json({ error: "Please take the offensive language out of that message." }, { status: 422 });
  }

  const [message] = await db
    .insert(chatMessages)
    .values({
      conversationId: id,
      senderUserId: session.user.id,
      body: sealMessage(parse.data.body),
      expiresAt: unreadMessageExpiry(new Date()),
    })
    .returning();

  return NextResponse.json({
    id: message.id,
    body: parse.data.body,
    mine: true,
    createdAt: message.createdAt.toISOString(),
  });
}
