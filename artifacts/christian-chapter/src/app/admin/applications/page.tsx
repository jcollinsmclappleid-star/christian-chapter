import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-session";
import { db, foundingMembers } from "@/db";
import { eq, desc, count } from "drizzle-orm";
import { StatusBadge } from "../_components/status-badge";

export const metadata: Metadata = { title: "Applications" };

const PAGE_SIZE = 20;

function getAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  return age;
}

function fmtDate(iso: Date | string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_TABS = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "active",   label: "Active" },
  { key: "flagged",  label: "Flagged" },
  { key: "declined", label: "Declined" },
];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdminSession();

  const params = await searchParams;
  const status = params.status ?? "all";
  const page = Math.max(1, Number(params.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  // Direct DB queries
  const baseSelect = {
    id: foundingMembers.id,
    firstName: foundingMembers.firstName,
    email: foundingMembers.email,
    dateOfBirth: foundingMembers.dateOfBirth,
    gender: foundingMembers.gender,
    ukRegion: foundingMembers.ukRegion,
    tradition: foundingMembers.tradition,
    ageRangeMin: foundingMembers.ageRangeMin,
    ageRangeMax: foundingMembers.ageRangeMax,
    status: foundingMembers.status,
    createdAt: foundingMembers.createdAt,
  };

  const [rows, [{ total }]] = await Promise.all([
    status === "all"
      ? db.select(baseSelect).from(foundingMembers).orderBy(desc(foundingMembers.createdAt)).limit(PAGE_SIZE).offset(offset)
      : db.select(baseSelect).from(foundingMembers).where(eq(foundingMembers.status, status)).orderBy(desc(foundingMembers.createdAt)).limit(PAGE_SIZE).offset(offset),
    status === "all"
      ? db.select({ total: count() }).from(foundingMembers)
      : db.select({ total: count() }).from(foundingMembers).where(eq(foundingMembers.status, status)),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone font-sans mb-2">
          Admin · Applications
        </p>
        <h1 className="font-serif text-plum text-3xl">Applications</h1>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {STATUS_TABS.map(({ key, label }) => (
          <Link
            key={key}
            href={`/admin/applications?status=${key}&page=1`}
            className={`px-4 py-2.5 text-[13px] font-sans border-b-2 transition-colors -mb-px ${
              status === key
                ? "border-plum text-plum font-medium"
                : "border-transparent text-stone hover:text-plum"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="bg-ivory border border-border rounded-lg px-6 py-12 text-center">
          <p className="text-[14px] text-stone font-sans">
            No applications{status !== "all" ? ` with status "${status}"` : ""} yet.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-ivory border border-border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-[13px] font-sans">
              <thead>
                <tr className="border-b border-border bg-ivory-dark">
                  {["Name", "Age", "Region", "Tradition", "Gender / seeking age", "Submitted", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-ivory-dark transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-plum">{row.firstName}</p>
                      <p className="text-[11px] text-stone">{row.email}</p>
                    </td>
                    <td className="px-4 py-3 text-plum">{getAge(row.dateOfBirth)}</td>
                    <td className="px-4 py-3 text-plum max-w-[120px] truncate">{row.ukRegion}</td>
                    <td className="px-4 py-3 text-plum max-w-[120px] truncate">{row.tradition}</td>
                    <td className="px-4 py-3 text-plum">
                      {row.gender}
                      {row.ageRangeMin && row.ageRangeMax ? `, ${row.ageRangeMin}–${row.ageRangeMax}` : ""}
                    </td>
                    <td className="px-4 py-3 text-stone whitespace-nowrap">{fmtDate(row.createdAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/applications/${row.id}`} className="text-[12px] text-oxblood underline underline-offset-2 hover:text-oxblood-hover whitespace-nowrap">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-[13px] font-sans text-stone">
            <p>
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/applications?status=${status}&page=${page - 1}`} className="px-3 py-1.5 border border-border rounded text-plum hover:bg-ivory-dark transition-colors">
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/applications?status=${status}&page=${page + 1}`} className="px-3 py-1.5 border border-border rounded text-plum hover:bg-ivory-dark transition-colors">
                  Next →
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
