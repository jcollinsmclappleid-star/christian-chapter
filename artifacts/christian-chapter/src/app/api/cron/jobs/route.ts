import { NextRequest, NextResponse } from "next/server";
import { runNextJobs } from "@/lib/jobs/runner";
import { purgeExpiredMessages } from "@/lib/chat/open";

/** Vercel Cron (or any scheduler) should call this hourly so deletion_due jobs run on time. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const results = await runNextJobs(25);
  const messages = await purgeExpiredMessages();
  return NextResponse.json({ ok: true, results, messages });
}
