import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { confirmCardSave, startCardSave } from "@/lib/billing/collect-later";

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { sessionId?: string } | null;
  if (body?.sessionId) {
    const confirmed = await confirmCardSave(session.user.id, body.sessionId);
    if ("error" in confirmed) return NextResponse.json({ error: confirmed.error }, { status: 422 });
    return NextResponse.json({ cardSaved: true });
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const started = await startCardSave({ id: user.id, email: user.email });
  if ("error" in started) return NextResponse.json({ error: started.error }, { status: 503 });
  return NextResponse.json(started);
}
