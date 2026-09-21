import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMemberApi } from "@/lib/member-session";
import { setAvailability } from "@/lib/matching/persist";

const Body = z.object({
  state: z.enum(["available", "taking_a_break", "hidden"]),
  conversationPolicy: z.enum(["preserve", "close"]).optional(),
});

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const parse = Body.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose an availability." }, { status: 422 });
  return NextResponse.json(
    await setAvailability(session.user.id, parse.data.state, parse.data.conversationPolicy),
  );
}
