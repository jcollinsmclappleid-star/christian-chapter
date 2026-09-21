import { NextResponse } from "next/server";
import { db, foundingApplications } from "@/db";
import { requireAdminApi } from "@/lib/admin-auth";

function getAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

function getAgeBand(dob: string): string {
  const age = getAge(dob);
  if (age < 50) return "40s";
  if (age < 60) return "50s";
  if (age < 70) return "60s";
  return "70+";
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
// "Open to both" means open to Men and Women only — the seeking UI does not
// offer a way to express preference for Non-binary / Prefer not to say.
function seeksGender(seekingList: string[], targetGender: string): boolean {
  return seekingList.some((s) => {
    if (s === "Men" && targetGender === "Man") return true;
    if (s === "Women" && targetGender === "Woman") return true;
    if (s === "Open to both" && (targetGender === "Man" || targetGender === "Woman")) return true;
    return s === targetGender;
  });
}

function calcCandidateDepth(active: MemberRow[]): number {
  if (active.length < 2) return 0;
  let totalDepth = 0;

  for (const m of active) {
    const mAge = getAge(m.dateOfBirth);
    let count = 0;

    for (const o of active) {
      if (o.id === m.id) continue;
      const oAge = getAge(o.dateOfBirth);

      const mSeeksO = seeksGender(m.seekingGender, o.gender);
      const oSeeksM = seeksGender(o.seekingGender, m.gender);
      const oAgeOK =
        oAge >= (m.ageRangeMin ?? 30) && oAge <= (m.ageRangeMax ?? 80);
      const mAgeOK =
        mAge >= (o.ageRangeMin ?? 30) && mAge <= (o.ageRangeMax ?? 80);

      if (mSeeksO && oSeeksM && oAgeOK && mAgeOK) count++;
    }
    totalDepth += count;
  }

  return Math.round((totalDepth / active.length) * 10) / 10;
}

function isImbalanced(genderCounts: Record<string, number>): boolean {
  const vals = Object.values(genderCounts);
  const total = vals.reduce((a, b) => a + b, 0);
  if (total < 5) return false;
  return vals.some((v) => v / total > 0.6);
}

export async function GET() {
  const auth = await requireAdminApi("analytics.read");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const raw = await db
      .select({
        id: foundingApplications.id,
        gender: foundingApplications.gender,
        dateOfBirth: foundingApplications.dateOfBirth,
        seekingGender: foundingApplications.seekingGender,
        ageRangeMin: foundingApplications.ageRangeMin,
        ageRangeMax: foundingApplications.ageRangeMax,
        status: foundingApplications.status,
        ukRegion: foundingApplications.ukRegion,
      })
      .from(foundingApplications);

    const members = raw.filter(
      (m): m is MemberRow =>
        Boolean(m.gender && m.dateOfBirth && m.ukRegion && m.seekingGender),
    );

    // ── Status counts ─────────────────────────────────────────────────
    const statusCounts: Record<string, number> = {};
    for (const m of members) {
      statusCounts[m.status] = (statusCounts[m.status] ?? 0) + 1;
    }

    // ── Gender × age band (exclude declined) ──────────────────────────
    const nonDeclined = members.filter(
      (m) => m.status !== "declined" && m.status !== "closed" && m.status !== "draft",
    );
    const ageBandGender: Record<string, Record<string, number>> = {};
    for (const m of nonDeclined) {
      const band = getAgeBand(m.dateOfBirth);
      if (!ageBandGender[band]) ageBandGender[band] = {};
      ageBandGender[band][m.gender] = (ageBandGender[band][m.gender] ?? 0) + 1;
    }

    // ── Gender × region ───────────────────────────────────────────────
    const regionGender: Record<string, Record<string, number>> = {};
    for (const m of nonDeclined) {
      if (!regionGender[m.ukRegion]) regionGender[m.ukRegion] = {};
      regionGender[m.ukRegion][m.gender] =
        (regionGender[m.ukRegion][m.gender] ?? 0) + 1;
    }

    // ── Candidate depth ───────────────────────────────────────────────
    const active = members.filter((m) => m.status === "accepted");
    const candidateDepth = calcCandidateDepth(active);

    // ── 60:40 warnings ────────────────────────────────────────────────
    const warnings: string[] = [];
    for (const [band, counts] of Object.entries(ageBandGender)) {
      if (isImbalanced(counts)) {
        warnings.push(`Age band ${band} is more than 60:40`);
      }
    }
    for (const [region, counts] of Object.entries(regionGender)) {
      if (isImbalanced(counts)) {
        warnings.push(`${region} is more than 60:40`);
      }
    }

    return NextResponse.json({
      statusCounts,
      ageBandGender,
      regionGender,
      candidateDepth,
      warnings,
      totalActive: active.length,
      totalNonDeclined: nonDeclined.length,
    });
  } catch (err) {
    console.error("[admin/dashboard]", err);
    return NextResponse.json({ error: "Failed to load dashboard." }, { status: 500 });
  }
}
