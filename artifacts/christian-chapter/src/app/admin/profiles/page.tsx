import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-session";
import { db, memberProfiles, users } from "@/db";
import { desc, eq } from "drizzle-orm";
import { getAge } from "@/lib/age";
import { StatusBadge } from "../_components/status-badge";

export const metadata: Metadata = { title: "Profiles" };

const TABS = [
  { key: "submitted", label: "Needs review" },
  { key: "review", label: "In review" },
  { key: "changes_required", label: "Changes" },
  { key: "approved", label: "Approved" },
  { key: "draft", label: "Drafts" },
  { key: "all", label: "All" },
];

export default async function AdminProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminSession();
  const { status: raw } = await searchParams;
  const status = raw ?? "submitted";

  const query = db
    .select({
      id: memberProfiles.id,
      firstName: memberProfiles.firstName,
      email: users.email,
      status: memberProfiles.status,
      ukRegion: memberProfiles.ukRegion,
      dateOfBirth: memberProfiles.dateOfBirth,
      updatedAt: memberProfiles.updatedAt,
    })
    .from(memberProfiles)
    .innerJoin(users, eq(users.id, memberProfiles.userId))
    .$dynamic();

  const rows = await (status === "all" ? query : query.where(eq(memberProfiles.status, status)))
    .orderBy(desc(memberProfiles.updatedAt))
    .limit(80);

  return (
    <div className="p-8 max-w-5xl">
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone mb-2">Admin</p>
      <h1 className="font-serif text-plum text-3xl mb-6">Profiles</h1>

      <div className="flex gap-1 mb-6 border-b border-border">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "submitted" ? "/admin/profiles" : `/admin/profiles?status=${tab.key}`}
            className={`px-4 py-2.5 text-[13px] border-b-2 -mb-px ${
              status === tab.key ? "border-plum text-plum font-medium" : "border-transparent text-stone"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-plum-muted text-[15px]">Nothing in this queue.</p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg bg-ivory">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/profiles/${row.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-ivory-dark/50">
                <div>
                  <p className="text-plum font-medium">
                    {row.firstName ?? "Unnamed"}
                    {row.dateOfBirth && getAge(row.dateOfBirth) !== null ? `, ${getAge(row.dateOfBirth)}` : ""}
                  </p>
                  <p className="text-[13px] text-stone">
                    {row.email} · {row.ukRegion ?? "No region"}
                  </p>
                </div>
                <StatusBadge status={row.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
