import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, providerResults } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { PROVIDER_CAPABILITY_MATRIX } from "@/lib/platform/provider-matrix";
import { currentRuntime, allowSandboxAdapters } from "@/lib/platform/runtime";

export async function GET() {
  const auth = await requireAdminApi("providers.operate");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const recent = await db
    .select()
    .from(providerResults)
    .orderBy(desc(providerResults.createdAt))
    .limit(50);

  return NextResponse.json({
    runtime: currentRuntime(),
    sandboxAdapters: allowSandboxAdapters(),
    matrix: PROVIDER_CAPABILITY_MATRIX,
    recent,
  });
}
