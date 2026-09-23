import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, chatMessages } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { conversationForMember, listChatMessages } from "@/lib/chat/open";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const { id } = await params;
  const conversation = await conversationForMember(id, session.user.id);
  if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  const messages = await listChatMessages(id);
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
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const { id } = await params;
  const conversation = await conversationForMember(id, session.user.id);
  if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

  const parse = z.object({ body: z.string().trim().min(1).max(2000) }).safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Write a message." }, { status: 422 });

  const [message] = await db
    .insert(chatMessages)
    .values({
      conversationId: id,
      senderUserId: session.user.id,
      body: parse.data.body,
    })
    .returning();

  return NextResponse.json({
    id: message.id,
    body: message.body,
    mine: true,
    createdAt: message.createdAt.toISOString(),
  });
}
