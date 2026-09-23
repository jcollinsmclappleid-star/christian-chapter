import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, memberPhotos, memberProfiles } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdminApi("profiles.review");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const rows = await db
    .select({
      id: memberPhotos.id,
      userId: memberPhotos.userId,
      createdAt: memberPhotos.createdAt,
      firstName: memberProfiles.firstName,
    })
    .from(memberPhotos)
    .innerJoin(memberProfiles, eq(memberProfiles.id, memberPhotos.profileId))
    .where(eq(memberPhotos.moderationStatus, "pending"))
    .orderBy(desc(memberPhotos.createdAt))
    .limit(40);

  return NextResponse.json({
    photographs: rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      url: `/api/profile/photos/${row.id}`,
    })),
  });
}
