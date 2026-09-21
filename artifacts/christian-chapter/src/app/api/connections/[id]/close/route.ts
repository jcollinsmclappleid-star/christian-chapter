import { NextRequest, NextResponse } from "next/server";
import { requireMemberApi } from "@/lib/member-session";
import { featureGate } from "@/lib/platform/require-feature";
import { closeMatch } from "@/lib/matching/persist";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = featureGate("interests_and_mutual_matches");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await closeMatch(session.user.id, id, typeof body.templateId === "string" ? body.templateId : undefined);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
