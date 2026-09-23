import type { Metadata } from "next";
import { desc, eq, sql } from "drizzle-orm";
import { db, photoChecks, users } from "@/db";
import { requireAdminPermission } from "@/lib/admin-session";
import { releaseExpiredPhotoChecks } from "@/lib/photo-check-store";
import { PhotoCheckDecision } from "./_components/decision";

export const metadata: Metadata = { title: "Photo checks" };

export default async function PhotoChecksPage() {
  await requireAdminPermission("profiles.review");
  await releaseExpiredPhotoChecks();

  const rows = await db
    .select({
      id: photoChecks.id,
      status: photoChecks.status,
      createdAt: photoChecks.createdAt,
      imageDeletedAt: photoChecks.imageDeletedAt,
      imageHeld: sql<boolean>`${photoChecks.imageData} is not null`.as("image_held"),
      email: users.email,
      firstName: users.firstName,
    })
    .from(photoChecks)
    .innerJoin(users, eq(users.id, photoChecks.userId))
    .orderBy(desc(photoChecks.createdAt));

  return (
    <section className="px-6 py-8">
      <h1 className="font-serif text-plum mb-2">Photo checks</h1>
      <p className="text-[15px] text-plum-muted mb-8 max-w-xl">
        Compare the photograph with the profile, then decide. The photograph is deleted as soon as you decide.
        Anything still waiting after 24 hours is deleted with no decision.
      </p>
      {rows.length === 0 ? (
        <p className="text-[15px] text-plum-muted">No photographs waiting.</p>
      ) : (
        <ul className="space-y-6">
          {rows.map((row) => (
            <li key={row.id} className="rounded-md border border-border bg-paper p-4">
              <p className="font-sans font-semibold text-plum">
                {row.firstName || "Member"} · {row.email}
              </p>
              <p className="text-[13px] text-plum-muted mt-1">
                {row.status}
                {row.imageHeld ? " · photograph held" : " · photograph deleted"}
              </p>
              {row.imageHeld && (
                // Admin-only, short-lived photograph. Not a public member image.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/admin/photo-checks/${row.id}`}
                  alt=""
                  className="mt-3 h-48 w-48 rounded-md object-cover"
                />
              )}
              {row.status === "pending" && row.imageHeld && (
                <div className="mt-3">
                  <PhotoCheckDecision id={row.id} />
                </div>
              )}
              {row.imageDeletedAt && (
                <p className="mt-2 text-[12px] text-plum-muted">
                  Deleted {new Date(row.imageDeletedAt).toLocaleString("en-GB")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
