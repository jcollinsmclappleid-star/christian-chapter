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

// Maps seekingGender values ("Men", "Women", "Open to both") against
// stored gender values ("Man", "Woman", "Non-binary", "Prefer not to say").
// seekingGender and gender use different pluralisation conventions by design.
function seeksGender(seekingList: string[], targetGender: string): boolean {
  return seekingList.some((s) => {
    if (s === "Open to both") return true;
    if (s === "Men" && targetGender === "Man") return true;
    if (s === "Women" && targetGender === "Woman") return true;
    return s === targetGender; // exact fallback for any future values
  });
}

function calcDepthStats(active: MemberRow[]): {
  median: number;
  lowerQuartile: number;
  mean: number;
} {
  if (active.length < 2) return { median: 0, lowerQuartile: 0, mean: 0 };

  const depths: number[] = [];
  for (const m of active) {
    const mAge = getAge(m.dateOfBirth);
    let count = 0;
    for (const o of active) {
      if (o.id === m.id) continue;
      const oAge = getAge(o.dateOfBirth);
      const mSeeksO = seeksGender(m.seekingGender, o.gender);
      const oSeeksM = seeksGender(o.seekingGender, m.gender);
      const oAgeOK = oAge >= (m.ageRangeMin ?? 30) && oAge <= (m.ageRangeMax ?? 80);
      const mAgeOK = mAge >= (o.ageRangeMin ?? 30) && mAge <= (o.ageRangeMax ?? 80);
      if (mSeeksO && oSeeksM && oAgeOK && mAgeOK) count++;
    }
    depths.push(count);
  }

  depths.sort((a, b) => a - b);
  const n = depths.length;
  const median =
    n % 2 === 0
      ? (depths[n / 2 - 1] + depths[n / 2]) / 2
      : depths[Math.floor(n / 2)];
  const lowerQuartile = depths[Math.floor(n * 0.25)];
  const mean = depths.reduce((a, b) => a + b, 0) / n;

  return {
    median: Math.round(median * 10) / 10,
    lowerQuartile: Math.round(lowerQuartile * 10) / 10,
    mean: Math.round(mean * 10) / 10,
  };
}

// ISO week key — YYYY-Www
function getISOWeekKey(date: Date): string {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function fmtWeekLabel(key: string): string {
  // YYYY-Www → "Wnn 'YY"
  const [year, w] = key.split("-W");
  return `W${w} '${year?.slice(2)}`;
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

function WeeklyChart({ data }: { data: { week: string; count: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="text-[13px] text-stone font-sans py-6">No profiles yet.</p>
    );
  }
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barW = 36;
  const gap = 6;
  const chartH = 100;
  const labelH = 22;
  const totalW = data.length * (barW + gap) - gap;

  return (
    <div className="overflow-x-auto">
      <svg
        width={Math.max(totalW, 200)}
        height={chartH + labelH}
        style={{ display: "block" }}
        aria-label="Profiles submitted per week"
      >
        {data.map((d, i) => {
          const barH = Math.max(4, Math.round((d.count / maxCount) * chartH));
          const x = i * (barW + gap);
          const y = chartH - barH;
          return (
            <g key={d.week}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill="#7A5C6E"
                rx={2}
                opacity={0.85}
              />
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={10}
                fill="#5C3E54"
                fontFamily="sans-serif"
              >
                {d.count}
              </text>
              <text
                x={x + barW / 2}
                y={chartH + 15}
                textAnchor="middle"
                fontSize={9}
                fill="#9B8FA3"
                fontFamily="sans-serif"
              >
                {fmtWeekLabel(d.week)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const AGE_BANDS = ["40s", "50s", "60s", "70+"] as const;

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  await requireAdminSession();

  // Single query — all fields needed for cohort analytics
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
      createdAt: foundingMembers.createdAt,
    })
    .from(foundingMembers);

  // ── Status counts ──────────────────────────────────────────────────────────
  const statusCounts: Record<string, number> = {};
  for (const m of members) {
    statusCounts[m.status] = (statusCounts[m.status] ?? 0) + 1;
  }

  // ── Balance breakdown (exclude declined) ──────────────────────────────────
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

  // ── Candidate depth — median + lower quartile ──────────────────────────────
  const active = members.filter((m) => m.status === "active");
  const depthStats = calcDepthStats(active);

  // ── 60:40 warnings ────────────────────────────────────────────────────────
  const warnings: string[] = [];
  for (const [band, counts] of Object.entries(ageBandGender)) {
    if (isImbalanced(counts)) warnings.push(`Age band ${band} exceeds 60:40`);
  }
  for (const [region, counts] of Object.entries(regionGender)) {
    if (isImbalanced(counts)) warnings.push(`${region} exceeds 60:40`);
  }

  // ── Profiles per week ─────────────────────────────────────────────────────
  const weekCounts: Record<string, number> = {};
  for (const m of members) {
    const key = getISOWeekKey(new Date(m.createdAt));
    weekCounts[key] = (weekCounts[key] ?? 0) + 1;
  }
  const weekData = Object.keys(weekCounts)
    .sort()
    .map((w) => ({ week: w, count: weekCounts[w] }));

  const allGenders = new Set<string>();
  for (const c of Object.values(regionGender)) {
    Object.keys(c).forEach((g) => allGenders.add(g));
  }

  const statusCards = [
    { key: "pending", label: "Pending review", icon: Clock, accent: "text-brass" },
    { key: "active", label: "Active", icon: CheckCircle, accent: "text-evergreen" },
    { key: "flagged", label: "Flagged", icon: Flag, accent: "text-oxblood" },
    { key: "declined", label: "Declined", icon: XCircle, accent: "text-stone" },
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
              Cohort balance warning —{" "}
              {warnings.length} cell{warnings.length !== 1 ? "s" : ""} exceed 60:40
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
          <StatCard
            key={key}
            label={label}
            count={statusCounts[key] ?? 0}
            icon={icon}
            accent={accent}
          />
        ))}
      </div>

      {/* Candidate depth */}
      <div className="bg-ivory border border-border rounded-lg px-6 py-5 mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone font-sans mb-4">
          Estimated candidate depth
        </p>
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="font-serif text-plum text-4xl">{depthStats.median}</p>
            <p className="text-[12px] text-stone font-sans mt-1">Median</p>
          </div>
          <div>
            <p className="font-serif text-plum text-4xl">{depthStats.lowerQuartile}</p>
            <p className="text-[12px] text-stone font-sans mt-1">Lower quartile</p>
          </div>
          <div>
            <p className="font-serif text-plum text-4xl">{depthStats.mean}</p>
            <p className="text-[12px] text-stone font-sans mt-1">Mean</p>
          </div>
        </div>
        <p className="text-[13px] text-stone font-sans mt-4 leading-6 max-w-lg">
          Reciprocally eligible profiles per active member, across{" "}
          <strong className="text-plum">{active.length}</strong> active profile
          {active.length !== 1 ? "s" : ""}. Lower quartile is the figure for the
          least-matched quarter. Target: ≥20 median.
        </p>
      </div>

      {/* Profiles over time */}
      <div className="bg-ivory border border-border rounded-lg px-6 py-5 mb-8">
        <h2 className="font-sans font-semibold text-[14px] text-plum mb-4">
          Profiles submitted per week
        </h2>
        <WeeklyChart data={weekData} />
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
                    <th
                      key={g}
                      className="text-right px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.12em]"
                    >
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
                      <tr
                        key={region}
                        className={`border-b border-border last:border-0 ${
                          imbal ? "bg-oxblood-light" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-plum font-medium">
                          {imbal && (
                            <AlertTriangle
                              size={11}
                              className="text-oxblood inline mr-1.5"
                            />
                          )}
                          {region}
                        </td>
                        {[...allGenders].map((g) => (
                          <td key={g} className="px-4 py-3 text-right text-plum">
                            {counts[g] ?? 0}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right font-medium text-plum">
                          {total}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`text-[11px] font-medium ${
                              imbal ? "text-oxblood" : "text-stone"
                            }`}
                          >
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
