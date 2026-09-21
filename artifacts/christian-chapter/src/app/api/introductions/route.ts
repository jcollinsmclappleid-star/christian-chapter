import { NextRequest, NextResponse } from "next/server";
import { requireMemberApi } from "@/lib/member-session";
import { featureGate } from "@/lib/platform/require-feature";
import { generateIntroductionsForUser, listMemberIntroductions } from "@/lib/matching/persist";

export async function GET(request: NextRequest) {
  const gated = featureGate("introductions");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const now = request.nextUrl.searchParams.get("now");
  const result = await listMemberIntroductions(session.user.id, now);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const gated = featureGate("introductions");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const result = await generateIntroductionsForUser(session.user.id, body.now ?? null);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
