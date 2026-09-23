import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, memberBlocks, memberProfiles } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { writeAudit } from "@/lib/audit";

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const rows = await db
    .select({
      userId: memberBlocks.blockedUserId,
      firstName: memberProfiles.firstName,
      createdAt: memberBlocks.createdAt,
    })
    .from(memberBlocks)
    .leftJoin(memberProfiles, eq(memberProfiles.userId, memberBlocks.blockedUserId))
    .where(eq(memberBlocks.blockerUserId, session.user.id));

  return NextResponse.json({
    blocks: rows.map((row) => ({
      userId: row.userId,
      firstName: row.firstName,
      blockedAt: row.createdAt.toISOString(),
    })),
  });
}

export async function DELETE(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const parse = z.object({ userId: z.string().uuid() }).safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose who to unblock." }, { status: 422 });

  await db
    .delete(memberBlocks)
    .where(
      and(
        eq(memberBlocks.blockerUserId, session.user.id),
        eq(memberBlocks.blockedUserId, parse.data.userId),
      ),
    );

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "member_unblocked",
    entityType: "user",
    entityId: parse.data.userId,
  });

  return NextResponse.json({ ok: true });
}
