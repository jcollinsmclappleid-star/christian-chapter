import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, memberProfiles } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { allowSandboxAdapters } from "@/lib/platform/runtime";
import { writeAudit } from "@/lib/audit";

const Body = z.object({
  plan: z.enum(["free", "member", "incognito", "plus"]),
});

/** Development grant only. Production checkout stays off. */
export async function POST(request: NextRequest) {
  if (!allowSandboxAdapters()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const parse = Body.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose a plan." }, { status: 422 });

  const profile = await ensureMemberProfile(session.user.id);
  await db
    .update(memberProfiles)
    .set({
      planEntitlement: parse.data.plan,
      privateBrowsing: parse.data.plan === "free" || parse.data.plan === "member" ? false : profile.privateBrowsing,
      updatedAt: new Date(),
    })
    .where(eq(memberProfiles.id, profile.id));

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "dev_entitlement_granted",
    entityType: "member_profile",
    entityId: profile.id,
    metadata: { plan: parse.data.plan },
  });

  return NextResponse.json({
    plan: parse.data.plan,
    message: "Development entitlement granted. Not a real payment.",
  });
}
