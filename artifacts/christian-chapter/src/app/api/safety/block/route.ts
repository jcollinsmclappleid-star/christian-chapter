import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMemberApi } from "@/lib/member-session";
import { blockMember, reportMember } from "@/lib/matching/persist";

const Body = z.object({
  userId: z.string().uuid(),
  action: z.enum(["block", "report"]),
  source: z.enum(["introduction", "profile", "connection"]).default("introduction"),
  reason: z.string().max(80).optional(),
  detail: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const parse = Body.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "We could not record that safety action." }, { status: 422 });
  if (parse.data.action === "report") {
    await reportMember(
      session.user.id,
      parse.data.userId,
      parse.data.reason ?? "unspecified",
      parse.data.source,
      parse.data.detail,
    );
  } else {
    await blockMember(session.user.id, parse.data.userId, parse.data.source);
  }
  return NextResponse.json({ ok: true });
}
