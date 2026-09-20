import { NextRequest, NextResponse } from "next/server";
import { db, foundingMembers } from "@/db";
import { eq, desc, count } from "drizzle-orm";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") ?? "all";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const baseQuery = db
      .select({
        id: foundingMembers.id,
        firstName: foundingMembers.firstName,
        email: foundingMembers.email,
        dateOfBirth: foundingMembers.dateOfBirth,
        gender: foundingMembers.gender,
        seekingGender: foundingMembers.seekingGender,
        ukRegion: foundingMembers.ukRegion,
        tradition: foundingMembers.tradition,
        relationshipGoal: foundingMembers.relationshipGoal,
        ageRangeMin: foundingMembers.ageRangeMin,
        ageRangeMax: foundingMembers.ageRangeMax,
        status: foundingMembers.status,
        createdAt: foundingMembers.createdAt,
        reviewedAt: foundingMembers.reviewedAt,
      })
      .from(foundingMembers)
      .$dynamic();

    const countQuery = db
      .select({ total: count() })
      .from(foundingMembers)
      .$dynamic();

    const filteredBase =
      status !== "all"
        ? baseQuery.where(eq(foundingMembers.status, status))
        : baseQuery;
    const filteredCount =
      status !== "all"
        ? countQuery.where(eq(foundingMembers.status, status))
        : countQuery;

    const [rows, [{ total }]] = await Promise.all([
      filteredBase.orderBy(desc(foundingMembers.createdAt)).limit(PAGE_SIZE).offset(offset),
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
