import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-session";
import { db, foundingApplications, users } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import { getAge } from "@/lib/age";
import { ADMIN_STATUS_TABS, normalizeApplicationStatusFilter } from "@/lib/admin-status";
import { StatusBadge } from "../_components/status-badge";
import { FilterBar } from "./_components/filter-bar";

export const metadata: Metadata = { title: "Applications" };

const PAGE_SIZE = 20;

function getAgeBand(dob: string | null): string | null {
  if (!dob) return null;
  const age = getAge(dob);
  if (age === null) return null;
  if (age < 50) return "40s";
  if (age < 60) return "50s";
  if (age < 70) return "60s";
  return "70+";
}

function fmtDate(iso: Date | string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_TABS = ADMIN_STATUS_TABS;

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    page?: string;
    gender?: string;
    ageBand?: string;
    region?: string;
    tradition?: string;
  }>;
}) {
  await requireAdminSession();

  const params = await searchParams;
  const status = normalizeApplicationStatusFilter(params.status ?? "all");
  const page = Math.max(1, Number(params.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;
  const gender = params.gender ?? "";
  const ageBand = params.ageBand ?? "";
  const region = params.region ?? "";
  const tradition = params.tradition ?? "";

  const conditions = [];
  if (status !== "all") conditions.push(eq(foundingApplications.status, status));
  if (gender) conditions.push(eq(foundingApplications.gender, gender));
  if (region) conditions.push(eq(foundingApplications.ukRegion, region));
  if (tradition) conditions.push(eq(foundingApplications.tradition, tradition));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let allRows = await db
    .select({
      id: foundingApplications.id,
      firstName: foundingApplications.firstName,
      email: users.email,
      dateOfBirth: foundingApplications.dateOfBirth,
      gender: foundingApplications.gender,
      ukRegion: foundingApplications.ukRegion,
      tradition: foundingApplications.tradition,
      ageRangeMin: foundingApplications.ageRangeMin,
      ageRangeMax: foundingApplications.ageRangeMax,
      status: foundingApplications.status,
      createdAt: foundingApplications.createdAt,
    })
    .from(foundingApplications)
    .innerJoin(users, eq(users.id, foundingApplications.userId))
    .where(whereClause)
    .orderBy(desc(foundingApplications.createdAt));

  if (ageBand) {
    allRows = allRows.filter((r) => getAgeBand(r.dateOfBirth) === ageBand);
  }

  const total = allRows.length;
  const rows = allRows.slice(offset, offset + PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Build URL for status tab links (preserve other filters)
  function tabHref(tabStatus: string) {
    const p = new URLSearchParams();
    if (tabStatus !== "all") p.set("status", tabStatus);
    if (gender) p.set("gender", gender);
    if (ageBand) p.set("ageBand", ageBand);
    if (region) p.set("region", region);
    if (tradition) p.set("tradition", tradition);
    p.set("page", "1");
    const qs = p.toString();
    return `/admin/applications${qs ? `?${qs}` : ""}`;
  }

  function paginationHref(p: number) {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (gender) params.set("gender", gender);
    if (ageBand) params.set("ageBand", ageBand);
    if (region) params.set("region", region);
    if (tradition) params.set("tradition", tradition);
    params.set("page", String(p));
    return `/admin/applications?${params.toString()}`;
  }

  const activeFilters = [gender, ageBand, region, tradition].filter(Boolean);

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone font-sans mb-2">
          Admin · Applications
        </p>
        <h1 className="font-serif text-plum text-3xl">Applications</h1>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-5 border-b border-border">
        {STATUS_TABS.map(({ key, label }) => (
          <Link
            key={key}
            href={tabHref(key)}
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

      {/* Filter bar */}
      <FilterBar
        gender={gender}
        ageBand={ageBand}
        region={region}
        tradition={tradition}
        status={status}
      />

      {activeFilters.length > 0 && (
        <p className="text-[12px] text-stone font-sans mb-4">
          {total} result{total !== 1 ? "s" : ""} matching{" "}
          {activeFilters.join(", ")}
          {status !== "all" ? ` · ${status}` : ""}
        </p>
      )}

      {/* Table */}
      {rows.length === 0 ? (
        <div className="bg-ivory border border-border rounded-lg px-6 py-12 text-center">
          <p className="text-[14px] text-stone font-sans">
            No applications matching these filters yet.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-ivory border border-border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-[13px] font-sans">
              <thead>
                <tr className="border-b border-border bg-ivory-dark">
                  {[
                    "Name",
                    "Age",
                    "Region",
                    "Tradition",
                    "Gender / seeking age",
                    "Submitted",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 hover:bg-ivory-dark transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-plum">{row.firstName ?? "—"}</p>
                      <p className="text-[11px] text-stone">{row.email}</p>
                    </td>
                    <td className="px-4 py-3 text-plum">
                      {row.dateOfBirth ? getAge(row.dateOfBirth) ?? "—" : "—"}
                      {row.dateOfBirth && getAgeBand(row.dateOfBirth) ? (
                        <span className="text-[11px] text-stone ml-1">
                          ({getAgeBand(row.dateOfBirth)})
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-plum max-w-[120px] truncate">
                      {row.ukRegion ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-plum max-w-[120px] truncate">
                      {row.tradition ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-plum">
                      {row.gender ?? "—"}
                      {row.ageRangeMin && row.ageRangeMax
                        ? `, ${row.ageRangeMin}–${row.ageRangeMax}`
                        : ""}
                    </td>
                    <td className="px-4 py-3 text-stone whitespace-nowrap">
                      {fmtDate(row.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/applications/${row.id}`}
                        className="text-[12px] text-oxblood underline underline-offset-2 hover:text-oxblood-hover whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-[13px] font-sans text-stone">
              <p>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of{" "}
                {total}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={paginationHref(page - 1)}
                    className="px-3 py-1.5 border border-border rounded text-plum hover:bg-ivory-dark transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={paginationHref(page + 1)}
                    className="px-3 py-1.5 border border-border rounded text-plum hover:bg-ivory-dark transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
