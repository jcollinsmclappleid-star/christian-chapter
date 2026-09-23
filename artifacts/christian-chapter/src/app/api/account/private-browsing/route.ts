import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, memberProfiles } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { ensureMemberProfile } from "@/lib/profile/ensure";
import { hasPrivateBrowsingEntitlement } from "@/lib/profile/private-browsing";
import { privateBrowsingUnavailableMessage } from "@/lib/profile/views";
import { writeAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const parse = z.object({ enabled: z.boolean() }).safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose whether private browsing is on." }, { status: 422 });

  const profile = await ensureMemberProfile(session.user.id);
  if (parse.data.enabled && !hasPrivateBrowsingEntitlement(profile.planEntitlement)) {
    return NextResponse.json({ error: privateBrowsingUnavailableMessage() }, { status: 403 });
  }

  await db
    .update(memberProfiles)
    .set({ privateBrowsing: parse.data.enabled, updatedAt: new Date() })
    .where(eq(memberProfiles.id, profile.id));

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: parse.data.enabled ? "private_browsing_on" : "private_browsing_off",
    entityType: "member_profile",
    entityId: profile.id,
  });

  return NextResponse.json({ enabled: parse.data.enabled });
}
