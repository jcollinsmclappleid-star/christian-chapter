import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { resetSyntheticSeed } from "@/lib/dev/seed";
import { resetJourneySeed, runCustomerJourneySmoke } from "@/lib/dev/journey-seed";
import { isPublicProduction } from "@/lib/platform/runtime";

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi("seed.manage");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (isPublicProduction()) {
    return NextResponse.json({ error: "Synthetic seed is forbidden in public production." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const mode = body?.mode === "journey" ? "journey" : "full";

  try {
    if (mode === "journey") {
      const result = await resetJourneySeed();
      const smoke = body?.smoke ? await runCustomerJourneySmoke() : undefined;
      return NextResponse.json({ ok: true, mode, ...result, smoke });
    }
    const result = await resetSyntheticSeed();
    return NextResponse.json({ ok: true, mode, ...result });
  } catch (err) {
    console.error("[dev/seed]", err);
    return NextResponse.json({ error: "Seed failed." }, { status: 500 });
  }
}
