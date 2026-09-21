import { NextRequest, NextResponse } from "next/server";
import { db, foundingApplications, users } from "@/db";
import { eq, desc, count } from "drizzle-orm";
import { normalizeApplicationStatusFilter } from "@/lib/admin-status";
import { requireAdminApi } from "@/lib/admin-auth";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi("applications.read");
  if (!auth.session) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = request.nextUrl;
  const status = normalizeApplicationStatusFilter(searchParams.get("status") ?? "all");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const baseQuery = db
      .select({
        id: foundingApplications.id,
        firstName: foundingApplications.firstName,
        email: users.email,
        dateOfBirth: foundingApplications.dateOfBirth,
        gender: foundingApplications.gender,
        seekingGender: foundingApplications.seekingGender,
        ukRegion: foundingApplications.ukRegion,
        tradition: foundingApplications.tradition,
        relationshipGoal: foundingApplications.relationshipGoal,
        ageRangeMin: foundingApplications.ageRangeMin,
        ageRangeMax: foundingApplications.ageRangeMax,
        status: foundingApplications.status,
        createdAt: foundingApplications.createdAt,
        reviewedAt: foundingApplications.reviewedAt,
      })
      .from(foundingApplications)
      .innerJoin(users, eq(users.id, foundingApplications.userId))
      .$dynamic();

    const countQuery = db
      .select({ total: count() })
      .from(foundingApplications)
      .$dynamic();

    const filteredBase =
      status !== "all"
        ? baseQuery.where(eq(foundingApplications.status, status))
        : baseQuery;
    const filteredCount =
      status !== "all"
        ? countQuery.where(eq(foundingApplications.status, status))
        : countQuery;

    const [rows, [{ total }]] = await Promise.all([
      filteredBase.orderBy(desc(foundingApplications.createdAt)).limit(PAGE_SIZE).offset(offset),
      filteredCount,
    ]);

    return NextResponse.json({
      rows,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (err) {
    console.error("[admin/applications]", err);
    return NextResponse.json({ error: "Failed to load applications." }, { status: 500 });
  }
}
