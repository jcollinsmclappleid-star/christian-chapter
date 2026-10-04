import { NextResponse } from "next/server";
import { requireVerifiedMemberApi } from "@/lib/member-session";
import { listProfileViews } from "@/lib/profile/views";

export async function GET() {
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  const views = await listProfileViews(session.user.id);
  return NextResponse.json({
    views: views.map((view) => ({
      ...view,
      lookedAt: view.lookedAt.toISOString(),
    })),
  });
}
