import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-session";
import { db, memberPhotos, memberProfiles, users } from "@/db";
import { DatingProfileView } from "@/components/profile/dating-profile-view";
import { parsePrompts } from "@/lib/profile/prompts";
import { ProfileReviewPanel } from "./_components/review-panel";

export const metadata: Metadata = { title: "Review profile" };

export default async function AdminProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const [profile] = await db.select().from(memberProfiles).where(eq(memberProfiles.id, id)).limit(1);
  if (!profile) notFound();

  const [user] = await db.select().from(users).where(eq(users.id, profile.userId)).limit(1);
  const photos = await db
    .select()
    .from(memberPhotos)
    .where(eq(memberPhotos.profileId, profile.id))
    .orderBy(memberPhotos.position);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <a href="/admin/profiles" className="text-[13px] text-stone hover:text-plum">
        ← Profiles
      </a>
      <div className="mt-4 mb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{user?.email}</p>
        <h1 className="font-serif text-plum text-3xl">{profile.firstName ?? "Profile"}</h1>
      </div>

      <div className="grid lg:grid-cols-[minmax(280px,420px)_minmax(0,340px)] gap-8 items-start">
        <DatingProfileView
          profile={{
            ...profile,
            prompts: parsePrompts(profile.prompts),
            photos: photos.map((photo) => ({
              id: photo.id,
              url: `/api/profile/photos/${photo.id}`,
              position: photo.position,
              moderationStatus: photo.moderationStatus,
            })),
          }}
        />
        <ProfileReviewPanel
          profileId={profile.id}
          status={profile.status}
          reviewNotes={profile.reviewNotes ?? ""}
        />
      </div>
    </div>
  );
}
