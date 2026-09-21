import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  db,
  consentRecords,
  foundingApplications,
  memberPhotos,
  memberProfiles,
  users,
} from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { writeAudit } from "@/lib/audit";

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [application] = await db
    .select()
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, session.user.id))
    .limit(1);
  const consents = await db
    .select()
    .from(consentRecords)
    .where(eq(consentRecords.userId, session.user.id));
  const [profile] = await db
    .select()
    .from(memberProfiles)
    .where(eq(memberProfiles.userId, session.user.id))
    .limit(1);
  const photos = profile
    ? await db.select({ id: memberPhotos.id, position: memberPhotos.position }).from(memberPhotos).where(eq(memberPhotos.profileId, profile.id))
    : [];

  await writeAudit({
    actorType: "member",
    actorId: session.user.id,
    action: "account_exported",
    entityType: "user",
    entityId: session.user.id,
  });

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    user: {
      email: user.email,
      firstName: user.firstName,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
    },
    application,
    profile,
    photos,
    consents,
  });
}
