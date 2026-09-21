import { NextRequest, NextResponse } from "next/server";
import { requireMemberApi } from "@/lib/member-session";
import { featureGate } from "@/lib/platform/require-feature";
import { listConnections } from "@/lib/matching/persist";

export async function GET(request: NextRequest) {
  const gated = featureGate("interests_and_mutual_matches");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const now = request.nextUrl.searchParams.get("now");
  return NextResponse.json(await listConnections(session.user.id, now));
}
