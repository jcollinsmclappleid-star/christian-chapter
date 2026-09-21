import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, memberProfiles, users } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi("profiles.read");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const status = request.nextUrl.searchParams.get("status") ?? "submitted";
  const query = db
    .select({
      id: memberProfiles.id,
      userId: memberProfiles.userId,
      firstName: memberProfiles.firstName,
      email: users.email,
      status: memberProfiles.status,
      ukRegion: memberProfiles.ukRegion,
      tradition: memberProfiles.tradition,
      dateOfBirth: memberProfiles.dateOfBirth,
      updatedAt: memberProfiles.updatedAt,
      submittedAt: memberProfiles.submittedAt,
    })
    .from(memberProfiles)
    .innerJoin(users, eq(users.id, memberProfiles.userId))
    .$dynamic();

  const rows = await (status === "all" ? query : query.where(eq(memberProfiles.status, status)))
    .orderBy(desc(memberProfiles.updatedAt))
    .limit(80);

  return NextResponse.json({ rows });
}
