import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { db, jobs } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { enqueueJob, type JobType } from "@/lib/jobs/queue";

const EnqueueSchema = z.object({
  type: z.enum([
    "send_notification",
    "image_moderation",
    "activity_sweep",
    "deletion_due",
    "verification_recheck",
  ]),
  payload: z.record(z.unknown()).default({}),
});

export async function GET() {
  const auth = await requireAdminApi("jobs.run");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const rows = await db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(100);
  return NextResponse.json({ rows });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi("jobs.run");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parse = EnqueueSchema.safeParse(await request.json().catch(() => null));
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const row = await enqueueJob(parse.data.type as JobType, parse.data.payload as Record<string, unknown>);
  return NextResponse.json({ ok: true, job: row });
}
