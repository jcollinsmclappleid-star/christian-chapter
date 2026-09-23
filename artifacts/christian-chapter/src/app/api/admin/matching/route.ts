import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { createHandPickedPair, explainIntroduction, matchingInventory } from "@/lib/matching/persist";

const ConnectSchema = z.object({
  userAId: z.string().uuid(),
  userBId: z.string().uuid(),
  reason: z.string().min(12).max(500),
});

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi("matchmaking.operate");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const introductionId = request.nextUrl.searchParams.get("introductionId");
  if (introductionId) {
    const explained = await explainIntroduction(introductionId);
    if ("error" in explained) return NextResponse.json({ error: explained.error }, { status: explained.status });
    return NextResponse.json(explained);
  }
  return NextResponse.json(await matchingInventory());
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi("matchmaking.operate");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await request.json().catch(() => null);
  const parse = ConnectSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Choose two profiles and write a short reason." }, { status: 400 });
  }
  const result = await createHandPickedPair({
    adminId: auth.session.admin.staffUserId ?? auth.session.admin.email,
    userAId: parse.data.userAId,
    userBId: parse.data.userBId,
    reason: parse.data.reason,
  });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
