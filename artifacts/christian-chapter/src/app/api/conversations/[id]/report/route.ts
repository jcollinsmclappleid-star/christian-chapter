import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt, inArray } from "drizzle-orm";
import { z } from "zod";
import { db, chatMessages, reportEvidence } from "@/db";
import { requireVerifiedMemberApi } from "@/lib/member-session";
import { conversationForMember } from "@/lib/chat/open";
import { openMessage } from "@/lib/chat/seal";
import { REPORT_EVIDENCE_DAYS } from "@/lib/chat/retention";
import { reportMember } from "@/lib/matching/persist";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  const { id } = await params;
  const conversation = await conversationForMember(id, session.user.id);
  if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

  const parse = z
    .object({
      messageIds: z.array(z.string().uuid()).min(1).max(20),
      reason: z.string().trim().max(80).optional(),
    })
    .safeParse(await request.json().catch(() => null));
  if (!parse.success) {
    return NextResponse.json({ error: "Select the messages you want to report." }, { status: 422 });
  }

  const now = new Date();
  const rows = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.conversationId, id),
        inArray(chatMessages.id, parse.data.messageIds),
        gt(chatMessages.expiresAt, now),
      ),
    );
  if (rows.length === 0) {
    return NextResponse.json({ error: "Those messages are no longer available to report." }, { status: 422 });
  }

  const otherId = conversation.userLowId === session.user.id ? conversation.userHighId : conversation.userLowId;
  const report = await reportMember(session.user.id, otherId, parse.data.reason || "safety", "conversation");
  const retainUntil = new Date(now.getTime() + REPORT_EVIDENCE_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(reportEvidence).values(
    rows.map((row) => ({
      reportId: report.id,
      messageId: row.id,
      body: openMessage(row.body),
      retainUntil,
    })),
  );

  return NextResponse.json({ ok: true });
}
