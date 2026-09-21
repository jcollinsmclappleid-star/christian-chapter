import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { resetSyntheticSeed } from "@/lib/dev/seed";
import { isPublicProduction } from "@/lib/platform/runtime";

export async function POST() {
  const auth = await requireAdminApi("seed.manage");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (isPublicProduction()) {
    return NextResponse.json({ error: "Synthetic seed is forbidden in public production." }, { status: 403 });
  }

  try {
    const result = await resetSyntheticSeed();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[dev/seed]", err);
    return NextResponse.json({ error: "Seed failed." }, { status: 500 });
  }
}
