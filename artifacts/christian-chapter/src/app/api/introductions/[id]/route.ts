import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, introductions } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { isFeatureEnabled } from "@/lib/platform/features";
import { getMemberIntroduction } from "@/lib/matching/persist";
import { HAND_PICK_POOL } from "@/lib/matching/hand-pick";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const { id } = await params;

  if (!isFeatureEnabled("introductions")) {
    const [row] = await db
      .select({ pool: introductions.pool, viewerUserId: introductions.viewerUserId })
      .from(introductions)
      .where(eq(introductions.id, id))
      .limit(1);
    const handPicked =
      isFeatureEnabled("personal_matchmaking") &&
      row?.pool === HAND_PICK_POOL &&
      row.viewerUserId === session.user.id;
    if (!handPicked) {
      return NextResponse.json({ error: "introductions is not enabled in this runtime." }, { status: 403 });
    }
  }

  const now = request.nextUrl.searchParams.get("now");
  const result = await getMemberIntroduction(session.user.id, id, now);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status === 410 ? 410 : 404 });
  }
  return NextResponse.json(result);
}
