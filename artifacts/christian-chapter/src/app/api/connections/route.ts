import { NextRequest, NextResponse } from "next/server";
import { requireVerifiedMemberApi } from "@/lib/member-session";
import { featureGate } from "@/lib/platform/require-feature";
import { listConnections } from "@/lib/matching/persist";

export async function GET(request: NextRequest) {
  const gated = featureGate("interests_and_mutual_matches");
  if (gated) return gated;
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  const now = request.nextUrl.searchParams.get("now");
  return NextResponse.json(await listConnections(session.user.id, now));
}
