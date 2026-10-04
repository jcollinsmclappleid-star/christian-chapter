import { NextRequest, NextResponse } from "next/server";
import { requireVerifiedMemberApi } from "@/lib/member-session";
import { isFeatureEnabled } from "@/lib/platform/features";
import { featureGate } from "@/lib/platform/require-feature";
import { generateIntroductionsForUser, listHandPickedIntroductions, listMemberIntroductions } from "@/lib/matching/persist";

export async function GET(request: NextRequest) {
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  const now = request.nextUrl.searchParams.get("now");
  if (!isFeatureEnabled("introductions")) {
    if (!isFeatureEnabled("personal_matchmaking")) {
      return NextResponse.json({ error: "introductions is not enabled in this runtime." }, { status: 403 });
    }
    return NextResponse.json(await listHandPickedIntroductions(session.user.id, now));
  }
  const result = await listMemberIntroductions(session.user.id, now);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const gated = featureGate("introductions");
  if (gated) return gated;
  const { session, error, status } = await requireVerifiedMemberApi();
  if (!session) return NextResponse.json({ error }, { status });
  const body = await request.json().catch(() => ({}));
  const result = await generateIntroductionsForUser(session.user.id, body.now ?? null);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
