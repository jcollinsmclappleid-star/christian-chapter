import type { Metadata } from "next";
import { AlertTriangle, Users, Clock, CheckCircle, XCircle, Flag } from "lucide-react";
import { requireAdminSession } from "@/lib/admin-session";
import { db, foundingMembers } from "@/db";

export const metadata: Metadata = { title: "Cohort Dashboard" };

// ── Helpers ───────────────────────────────────────────────────────────────────

function getAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  )
    age--;
  return age;
}

function getAgeBand(dob: string): string {
  const age = getAge(dob);
  if (age < 50) return "40s";
  if (age < 60) return "50s";
  if (age < 70) return "60s";
  return "70+";
}

function isImbalanced(counts: Record<string, number>): boolean {
  const vals = Object.values(counts);
  const total = vals.reduce((a, b) => a + b, 0);
  if (total < 5) return false;
  return vals.some((v) => v / total > 0.6);
}

type MemberRow = {
  id: number;
  gender: string;
  dateOfBirth: string;
  seekingGender: string[];
  ageRangeMin: number | null;
  ageRangeMax: number | null;
  status: string;
  ukRegion: string;
};

function calcCandidateDepth(active: MemberRow[]): number {
  if (active.length < 2) return 0;
  let totalDepth = 0;
  for (const m of active) {
    const mAge = getAge(m.dateOfBirth);
    let count = 0;
    for (const o of active) {
      if (o.id === m.id) continue;
      const oAge = getAge(o.dateOfBirth);
      const mSeeksO =
        m.seekingGender.includes(o.gender) || m.seekingGender.includes("Open to both");
      const oSeeksM =
        o.seekingGender.includes(m.gender) || o.seekingGender.includes("Open to both");
      const oAgeOK = oAge >= (m.ageRangeMin ?? 30) && oAge <= (m.ageRangeMax ?? 80);
      const mAgeOK = mAge >= (o.ageRangeMin ?? 30) && mAge <= (o.ageRangeMax ?? 80);
      if (mSeeksO && oSeeksM && oAgeOK && mAgeOK) count++;
    }
    totalDepth += count;
  }
  return Math.round((totalDepth / active.length) * 10) / 10;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  count,
  icon: Icon,
  accent,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-ivory rounded-lg border border-border p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone font-sans">{label}</p>
        <Icon size={16} className={accent} />
      </div>
      <p className={`font-serif text-4xl ${accent}`}>{count}</p>
    </div>
  );
}

function CohortCell({ counts }: { counts: Record<string, number> | undefined }) {
  if (!counts || Object.keys(counts).length === 0) {
    return <div className="text-center py-5 text-[12px] text-stone font-sans">—</div>;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const imbalanced = isImbalanced(counts);
  const men = counts["Man"] ?? 0;
  const women = counts["Woman"] ?? 0;
  const mPct = total > 0 ? Math.round((men / total) * 100) : 0;
  const wPct = total > 0 ? Math.round((women / total) * 100) : 0;

  return (
    <div
      className={`rounded border p-3 ${
        imbalanced ? "border-oxblood/40 bg-oxblood-light" : "border-border bg-ivory"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        {imbalanced && <AlertTriangle size={11} className="text-oxblood" />}
        <p className="text-[22px] font-serif text-plum ml-auto">{total}</p>
      </div>
      <div className="text-[11px] font-sans text-stone space-y-0.5">
        {Object.entries(counts).map(([g, c]) => (
          <div key={g} className="flex justify-between">
            <span className="truncate mr-2">{g}</span>
            <span className="font-medium text-plum">{c}</span>
          </div>
        ))}
        {total >= 2 && (
          <p className="text-[10px] text-stone/70 mt-1">
            {mPct}% M · {wPct}% W
          </p>
        )}
      </div>
    </div>
  );
}

const AGE_BANDS = ["40s", "50s", "60s", "70+"] as const;

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  await requireAdminSession();

  // Direct DB query — no HTTP round-trip
  const members = await db
    .select({
      id: foundingMembers.id,
      gender: foundingMembers.gender,
      dateOfBirth: foundingMembers.dateOfBirth,
      seekingGender: foundingMembers.seekingGender,
      ageRangeMin: foundingMembers.ageRangeMin,
      ageRangeMax: foundingMembers.ageRangeMax,
      status: foundingMembers.status,
      ukRegion: foundingMembers.ukRegion,
    })
    .from(foundingMembers);

  // Compute stats
  const statusCounts: Record<string, number> = {};
  for (const m of members) {
    statusCounts[m.status] = (statusCounts[m.status] ?? 0) + 1;
  }

  const nonDeclined = members.filter((m) => m.status !== "declined");
  const ageBandGender: Record<string, Record<string, number>> = {};
  const regionGender: Record<string, Record<string, number>> = {};
  for (const m of nonDeclined) {
    const band = getAgeBand(m.dateOfBirth);
    ageBandGender[band] ??= {};
    ageBandGender[band][m.gender] = (ageBandGender[band][m.gender] ?? 0) + 1;
    regionGender[m.ukRegion] ??= {};
    regionGender[m.ukRegion][m.gender] = (regionGender[m.ukRegion][m.gender] ?? 0) + 1;
  }

  const active = members.filter((m) => m.status === "active");
  const candidateDepth = calcCandidateDepth(active);

  const warnings: string[] = [];
  for (const [band, counts] of Object.entries(ageBandGender)) {
    if (isImbalanced(counts)) warnings.push(`Age band ${band} exceeds 60:40`);
  }
  for (const [region, counts] of Object.entries(regionGender)) {
    if (isImbalanced(counts)) warnings.push(`${region} exceeds 60:40`);
  }

  const allGenders = new Set<string>();
  for (const c of Object.values(regionGender)) Object.keys(c).forEach((g) => allGenders.add(g));

  const statusCards = [
    { key: "pending",  label: "Pending review", icon: Clock,       accent: "text-brass" },
    { key: "active",   label: "Active",          icon: CheckCircle, accent: "text-evergreen" },
    { key: "flagged",  label: "Flagged",          icon: Flag,        accent: "text-oxblood" },
    { key: "declined", label: "Declined",         icon: XCircle,     accent: "text-stone" },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone font-sans mb-2">
          Admin · Cohort Health
        </p>
        <h1 className="font-serif text-plum text-3xl">Dashboard</h1>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-6 bg-oxblood-light border border-oxblood/30 rounded-lg px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} className="text-oxblood" />
            <p className="text-[13px] font-sans font-semibold text-oxblood">
              Cohort balance warning — {warnings.length} cell{warnings.length !== 1 ? "s" : ""} exceed 60:40
            </p>
          </div>
          <ul className="space-y-1 pl-5">
            {warnings.map((w) => (
              <li key={w} className="text-[13px] text-oxblood font-sans list-disc">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statusCards.map(({ key, label, icon, accent }) => (
          <StatCard key={key} label={label} count={statusCounts[key] ?? 0} icon={icon} accent={accent} />
        ))}
      </div>

      {/* Candidate depth */}
      <div className="bg-ivory border border-border rounded-lg px-6 py-5 mb-8 flex flex-wrap items-center gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone font-sans mb-1">
            Estimated candidate depth
          </p>
          <p className="font-serif text-plum text-4xl">{candidateDepth}</p>
          <p className="text-[12px] text-stone font-sans mt-1">
            avg. reciprocally eligible profiles per active member
          </p>
        </div>
        <div className="border-l border-border pl-6 text-[13px] text-stone font-sans leading-6 max-w-xs">
          Based on reciprocal age range and gender preference across{" "}
          <strong className="text-plum">{active.length}</strong> active profile{active.length !== 1 ? "s" : ""}.
          Target: ≥20 per member.
        </div>
      </div>

      {/* Gender × age band */}
      <div className="mb-8">
        <h2 className="font-sans font-semibold text-[14px] text-plum mb-4 flex items-center gap-2">
          <Users size={15} className="text-stone" />
          Gender balance by age band
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {AGE_BANDS.map((band) => (
            <div key={band}>
              <p className="text-[11px] uppercase tracking-[0.15em] text-stone font-sans mb-2 text-center">
                {band}
              </p>
              <CohortCell counts={ageBandGender[band]} />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-stone font-sans mt-3">
          Cells with ≥5 profiles shown in red when any gender exceeds 60%.
        </p>
      </div>

      {/* Gender × region */}
      <div>
        <h2 className="font-sans font-semibold text-[14px] text-plum mb-4 flex items-center gap-2">
          <Users size={15} className="text-stone" />
          Gender balance by UK region
        </h2>
        {Object.keys(regionGender).length === 0 ? (
          <p className="text-[13px] text-stone font-sans">No profiles yet.</p>
        ) : (
          <div className="bg-ivory border border-border rounded-lg overflow-hidden">
            <table className="w-full text-[13px] font-sans">
              <thead>
                <tr className="border-b border-border bg-ivory-dark">
                  <th className="text-left px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em]">
                    Region
                  </th>
                  {[...allGenders].map((g) => (
                    <th key={g} className="text-right px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em]">
                      {g}
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em]">
                    Total
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em]">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(regionGender)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([region, counts]) => {
                    const total = Object.values(counts).reduce((a, b) => a + b, 0);
                    const imbal = isImbalanced(counts);
                    return (
                      <tr key={region} className={`border-b border-border last:border-0 ${imbal ? "bg-oxblood-light" : ""}`}>
                        <td className="px-4 py-3 text-plum font-medium">
                          {imbal && <AlertTriangle size={11} className="text-oxblood inline mr-1.5" />}
                          {region}
                        </td>
                        {[...allGenders].map((g) => (
                          <td key={g} className="px-4 py-3 text-right text-plum">{counts[g] ?? 0}</td>
                        ))}
                        <td className="px-4 py-3 text-right font-medium text-plum">{total}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-[11px] font-medium ${imbal ? "text-oxblood" : "text-stone"}`}>
                            {imbal ? "⚠ >60:40" : "OK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
