import { NextRequest, NextResponse } from "next/server";
import { requireMemberApi } from "@/lib/member-session";
import { featureGate } from "@/lib/platform/require-feature";
import { getMemberIntroduction } from "@/lib/matching/persist";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = featureGate("introductions");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const { id } = await params;
  const now = request.nextUrl.searchParams.get("now");
  const result = await getMemberIntroduction(session.user.id, id, now);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
