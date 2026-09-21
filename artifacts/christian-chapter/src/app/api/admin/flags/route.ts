import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { featureRegistry } from "@/lib/platform/features";
import { currentRuntime } from "@/lib/platform/runtime";
import { permissionMatrix } from "@/lib/platform/permissions";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  return NextResponse.json({
    runtime: currentRuntime(),
    flags: featureRegistry(),
    roles: permissionMatrix(),
    sessionRole: auth.session.admin.role,
  });
}
