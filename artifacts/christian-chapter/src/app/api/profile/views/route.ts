import { NextResponse } from "next/server";
import { requireMemberApi } from "@/lib/member-session";
import { listProfileViews } from "@/lib/profile/views";

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const views = await listProfileViews(session.user.id);
  return NextResponse.json({
    views: views.map((view) => ({
      ...view,
      lookedAt: view.lookedAt.toISOString(),
    })),
  });
}
