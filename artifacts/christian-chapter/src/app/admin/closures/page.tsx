import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/admin-session";
import { db, accountClosureRequests, users } from "@/db";
import { desc, eq } from "drizzle-orm";
import { APPLICATION_RETENTION_DAYS } from "@/lib/site-config";
import { ClosureActions } from "./_components/closure-actions";

export const metadata: Metadata = { title: "Closure queue" };

function fmt(val: Date | string | null): string {
  if (!val) return "—";
  return new Date(val).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ClosuresPage() {
  await requireAdminSession();

  const rows = await db
    .select({
      id: accountClosureRequests.id,
      reason: accountClosureRequests.reason,
      detail: accountClosureRequests.detail,
      status: accountClosureRequests.status,
      scheduledDeleteAt: accountClosureRequests.scheduledDeleteAt,
      resolvedAt: accountClosureRequests.resolvedAt,
      createdAt: accountClosureRequests.createdAt,
      email: users.email,
      userStatus: users.status,
      userId: users.id,
    })
    .from(accountClosureRequests)
    .innerJoin(users, eq(users.id, accountClosureRequests.userId))
    .orderBy(desc(accountClosureRequests.createdAt));

  const open = rows.filter((r) => r.status === "open");

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone font-sans mb-2">
          Admin · Closures
        </p>
        <h1 className="font-serif text-plum text-3xl">Account closure queue</h1>
        <p className="text-[14px] text-stone font-sans mt-3 max-w-2xl">
          Members can hide an application immediately. Records stay until an
          administrator completes deletion after the configured retention
          period ({APPLICATION_RETENTION_DAYS} days). This queue does not claim
          that data has already been wiped from backups.
        </p>
      </div>

      {open.length === 0 ? (
        <div className="bg-ivory border border-border rounded-lg px-6 py-12 text-center">
          <p className="text-[14px] text-stone font-sans">No unresolved closure requests.</p>
        </div>
      ) : (
        <div className="bg-ivory border border-border rounded-lg overflow-hidden">
          <table className="w-full text-[13px] font-sans">
            <thead>
              <tr className="border-b border-border bg-ivory-dark">
                {["Email", "Reason", "Requested", "Scheduled delete", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {open.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-plum">
                    {row.email}
                    <p className="text-[11px] text-stone">{row.userStatus}</p>
                  </td>
                  <td className="px-4 py-3 text-plum">
                    {row.reason}
                    {row.detail ? (
                      <p className="text-[11px] text-stone mt-1">{row.detail}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-stone whitespace-nowrap">{fmt(row.createdAt)}</td>
                  <td className="px-4 py-3 text-stone whitespace-nowrap">
                    {fmt(row.scheduledDeleteAt)}
                  </td>
                  <td className="px-4 py-3">
                    <ClosureActions id={row.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
