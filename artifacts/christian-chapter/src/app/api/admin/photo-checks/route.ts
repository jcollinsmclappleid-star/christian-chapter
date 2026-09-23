import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db, photoChecks, users } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { releaseExpiredPhotoChecks } from "@/lib/photo-check-store";

export async function GET() {
  const auth = await requireAdminApi("profiles.review");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await releaseExpiredPhotoChecks();
  const rows = await db
    .select({
      id: photoChecks.id,
      status: photoChecks.status,
      createdAt: photoChecks.createdAt,
      decidedAt: photoChecks.decidedAt,
      imageDeletedAt: photoChecks.imageDeletedAt,
      imageHeld: sql<boolean>`${photoChecks.imageData} is not null`.as("image_held"),
      email: users.email,
      firstName: users.firstName,
    })
    .from(photoChecks)
    .innerJoin(users, eq(users.id, photoChecks.userId))
    .orderBy(desc(photoChecks.createdAt));

  return NextResponse.json({
    checks: rows.map((row) => ({
      id: row.id,
      status: row.status,
      createdAt: row.createdAt,
      decidedAt: row.decidedAt,
      imageDeletedAt: row.imageDeletedAt,
      imageHeld: Boolean(row.imageHeld),
      email: row.email,
      firstName: row.firstName,
    })),
  });
}
