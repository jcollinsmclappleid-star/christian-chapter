import { NextResponse } from "next/server";
import { requireMemberApi } from "@/lib/member-session";
import { listConversations } from "@/lib/chat/open";

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  return NextResponse.json({ conversations: await listConversations(session.user.id) });
}
