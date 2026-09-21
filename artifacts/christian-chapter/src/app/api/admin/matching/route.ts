import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { explainIntroduction, matchingInventory } from "@/lib/matching/persist";

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
