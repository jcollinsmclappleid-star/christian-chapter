import { and, desc, eq, inArray } from "drizzle-orm";
import { db, memberPhotos, memberProfiles, profileViews, users } from "@/db";
import { sendServiceEmail } from "@/lib/email";
import { INCOGNITO_PRICE_LABEL, INCOGNITO_STARTS_LABEL, siteConfig } from "@/lib/site-config";
import { photoIsPublic } from "./photos";
import { viewIsFreshDuplicate } from "./visit-policy";

export async function recordNamedProfileView(input: {
  viewerUserId: string;
  viewedUserId: string;
  source: string;
  now: Date;
  viewerFirstName?: string | null;
}) {
  if (input.viewerUserId === input.viewedUserId) return { recorded: false as const };

  const [last] = await db
    .select({ createdAt: profileViews.createdAt })
    .from(profileViews)
    .where(
      and(
        eq(profileViews.viewerUserId, input.viewerUserId),
        eq(profileViews.viewedUserId, input.viewedUserId),
      ),
    )
    .orderBy(desc(profileViews.createdAt))
    .limit(1);

  if (viewIsFreshDuplicate(last?.createdAt ?? null, input.now)) return { recorded: false as const };

  await db.insert(profileViews).values({
    viewerUserId: input.viewerUserId,
    viewedUserId: input.viewedUserId,
    source: input.source,
    createdAt: input.now,
  });

  const [viewedProfile] = await db
    .select({ notify: memberProfiles.notifyProfileViews })
    .from(memberProfiles)
    .where(eq(memberProfiles.userId, input.viewedUserId))
    .limit(1);
  const [viewedUser] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, input.viewedUserId))
    .limit(1);

  if (viewedProfile?.notify !== false && viewedUser?.email) {
    const name = input.viewerFirstName?.trim() || "A member";
    const url = `${siteConfig.siteUrl}/profile/views`;
    await sendServiceEmail({
      to: viewedUser.email,
      subject: "Someone looked at your profile",
      text: `${name} looked at your profile. See who looked: ${url}`,
      html: `<p>${name} looked at your profile.</p><p><a href="${url}">See who looked</a></p>`,
    });
  }

  return { recorded: true as const };
}

export async function listProfileViews(viewedUserId: string) {
  const rows = await db
    .select({
      id: profileViews.id,
      viewerUserId: profileViews.viewerUserId,
      createdAt: profileViews.createdAt,
      firstName: memberProfiles.firstName,
      ukRegion: memberProfiles.ukRegion,
    })
    .from(profileViews)
    .innerJoin(memberProfiles, eq(memberProfiles.userId, profileViews.viewerUserId))
    .where(eq(profileViews.viewedUserId, viewedUserId))
    .orderBy(desc(profileViews.createdAt))
    .limit(80);

  const seen = new Set<string>();
  const latest = rows.filter((row) => {
    if (seen.has(row.viewerUserId)) return false;
    seen.add(row.viewerUserId);
    return true;
  });

  const viewerIds = latest.map((row) => row.viewerUserId);
  const photos = viewerIds.length
    ? await db
        .select({
          userId: memberPhotos.userId,
          id: memberPhotos.id,
          position: memberPhotos.position,
          moderationStatus: memberPhotos.moderationStatus,
        })
        .from(memberPhotos)
        .where(inArray(memberPhotos.userId, viewerIds))
    : [];

  return latest.slice(0, 40).map((row) => {
    const photo = photos
      .filter((item) => item.userId === row.viewerUserId && photoIsPublic(item.moderationStatus))
      .sort((a, b) => a.position - b.position)[0];
    return {
      id: row.id,
      firstName: row.firstName,
      ukRegion: row.ukRegion,
      lookedAt: row.createdAt,
      photoUrl: photo ? `/api/profile/photos/${photo.id}` : null,
    };
  });
}

export function privateBrowsingUnavailableMessage() {
  return `Private browsing is ${INCOGNITO_PRICE_LABEL} from ${INCOGNITO_STARTS_LABEL}. Nothing is charged now.`;
}
