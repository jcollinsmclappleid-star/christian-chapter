import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { decidePhotograph } from "@/lib/profile/decide-photo";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi("profiles.review");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parse = z.object({ decision: z.enum(["clear", "rejected"]) }).safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose a decision." }, { status: 422 });

  const { id } = await params;
  const result = await decidePhotograph({
    photoId: id,
    decision: parse.data.decision,
    adminId: auth.session.admin.email,
  });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
