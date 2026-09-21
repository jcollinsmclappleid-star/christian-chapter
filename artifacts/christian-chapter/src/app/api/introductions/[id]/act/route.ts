import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMemberApi } from "@/lib/member-session";
import { featureGate } from "@/lib/platform/require-feature";
import { actOnIntroduction } from "@/lib/matching/persist";

const Body = z.object({
  action: z.enum(["talk", "save", "decline"]),
  now: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = featureGate("interests_and_mutual_matches");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const parse = Body.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose talk, save, or decline." }, { status: 422 });
  const { id } = await params;
  const result = await actOnIntroduction(session.user.id, id, parse.data.action, parse.data.now);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
