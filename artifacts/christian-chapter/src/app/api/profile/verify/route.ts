import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, verificationChecks } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { featureGate } from "@/lib/platform/require-feature";
import { sendSmsCode, verifySmsCode } from "@/lib/providers/sms";
import { runPhotoMatch, runSelfieCheck } from "@/lib/providers/identity";
import { recordProviderResult } from "@/lib/providers/record";
import type { RequestedState } from "@/lib/providers/types";

const Schema = z.object({
  kind: z.enum(["mobile", "selfie", "photo_match"]),
  msisdn: z.string().max(20).optional(),
  challengeId: z.string().max(80).optional(),
  code: z.string().max(12).optional(),
  requestedState: z.enum(["pass", "fail", "pending", "unavailable"]).optional(),
});

export async function GET() {
  const gated = featureGate("mobile_verification");
  if (gated) return gated;
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const rows = await db
    .select()
    .from(verificationChecks)
    .where(eq(verificationChecks.userId, session.user.id));
  return NextResponse.json({
    sandbox: true,
    notice: "These are development checks. They are not genuine identity, liveness or mobile verification.",
    checks: rows,
  });
}

export async function POST(request: NextRequest) {
  const parse = Schema.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });

  const flag = parse.data.kind === "mobile" ? "mobile_verification" : "selfie_verification";
  const gated = featureGate(flag);
  if (gated) return gated;

  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const requested = parse.data.requestedState as RequestedState;
  let result;
  if (parse.data.kind === "mobile" && !parse.data.code) {
    result = await sendSmsCode({
      userId: session.user.id,
      msisdn: parse.data.msisdn ?? "07000000000",
      requestedState: requested,
    });
  } else if (parse.data.kind === "mobile") {
    result = await verifySmsCode({
      challengeId: parse.data.challengeId ?? "sms_dev",
      code: parse.data.code ?? "",
      requestedState: requested,
    });
  } else if (parse.data.kind === "selfie") {
    result = await runSelfieCheck({ userId: session.user.id, requestedState: requested });
  } else {
    result = await runPhotoMatch({ userId: session.user.id, requestedState: requested });
  }

  const [row] = await db
    .insert(verificationChecks)
    .values({
      userId: session.user.id,
      kind: parse.data.kind,
      state: result.state,
      adapter: result.adapter,
      sandbox: result.sandbox,
      payload: { message: result.message, data: result.data ?? null },
    })
    .returning();

  await recordProviderResult({
    feature: parse.data.kind,
    entityType: "verification_check",
    entityId: row.id,
    result,
  });

  return NextResponse.json({
    ok: result.ok,
    state: result.state,
    sandbox: true,
    message: result.message,
    notice: "Development check only. Not a genuine verification.",
    check: row,
  });
}
