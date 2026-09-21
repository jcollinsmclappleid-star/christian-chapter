import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { runJob, runNextJobs } from "@/lib/jobs/runner";

const Schema = z.object({
  id: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi("jobs.run");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parse = Schema.safeParse(await request.json().catch(() => ({})));
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (parse.data.id) {
    const result = await runJob(parse.data.id);
    return NextResponse.json(result);
  }

  const results = await runNextJobs(parse.data.limit ?? 10);
  return NextResponse.json({ ok: true, results });
}
