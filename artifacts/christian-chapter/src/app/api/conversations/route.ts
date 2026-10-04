import { NextResponse } from "next/server";
import { requireVerifiedMemberApi } from "@/lib/member-session";
import { listConversations } from "@/lib/chat/open";

export async function GET() {
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  return NextResponse.json({ conversations: await listConversations(session.user.id) });
}
