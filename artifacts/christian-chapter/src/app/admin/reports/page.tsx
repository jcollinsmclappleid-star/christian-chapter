import type { Metadata } from "next";
import { desc, inArray } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-session";
import { db, memberReports, reportEvidence } from "@/db";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  await requireAdminSession();
  const reports = await db.select().from(memberReports).orderBy(desc(memberReports.createdAt)).limit(50);
  const evidence = reports.length
    ? await db.select().from(reportEvidence).where(inArray(reportEvidence.reportId, reports.map((row) => row.id)))
    : [];

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-plum text-3xl mb-2">Reports</h1>
      <p className="text-[15px] text-plum-muted mb-8">
        Only the messages someone selected. This is not the rest of the conversation.
      </p>
      {reports.length === 0 ? (
        <p className="text-plum-muted">No reports.</p>
      ) : (
        <ul className="space-y-6">
          {reports.map((report) => {
            const copies = evidence.filter((item) => item.reportId === report.id);
            return (
              <li key={report.id} className="rounded-md border border-border bg-paper p-5">
                <p className="text-[14px] text-plum">
                  {report.reason} · {report.source} · {report.createdAt.toLocaleString("en-GB")}
                </p>
                <ul className="mt-3 space-y-2">
                  {copies.map((item) => (
                    <li key={item.id} className="text-[15px] text-plum whitespace-pre-wrap">
                      {item.body}
                    </li>
                  ))}
                  {copies.length === 0 && (
                    <li className="text-[14px] text-plum-muted">No message was copied with this report.</li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
