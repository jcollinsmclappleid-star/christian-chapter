import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { writeAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi("safety.sanction");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parse = z
    .object({
      userId: z.string().uuid(),
      action: z.enum(["suspend", "restore"]),
    })
    .safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Choose a member and an action." }, { status: 422 });

  const [user] = await db.select().from(users).where(eq(users.id, parse.data.userId)).limit(1);
  if (!user) return NextResponse.json({ error: "Member not found." }, { status: 404 });

  const status = parse.data.action === "suspend" ? "suspended" : "active_founding_member";
  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, user.id));
  await writeAudit({
    actorType: "admin",
    actorId: auth.session.admin.email,
    action: parse.data.action === "suspend" ? "member_suspended" : "member_restored",
    entityType: "user",
    entityId: user.id,
  });

  return NextResponse.json({ ok: true, status });
}
