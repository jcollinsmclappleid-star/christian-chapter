import { NextRequest, NextResponse } from "next/server";
import { db, foundingMembers, consentRecords } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// ── Server-authoritative consent versions ─────────────────────────────────────
// Update these when consent text changes. Never accepted from the client.
const RELIGIOUS_DATA_CONSENT_VERSION = "2025-01";

// ── Input validation ──────────────────────────────────────────────────────────

const RegistrationSchema = z.object({
  // Step 2: Account
  firstName: z.string().min(1, "First name is required").max(100),
  email: z.string().email("Valid email address required").max(255),
  marketingConsent: z.boolean(),

  // Step 3: About you
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be YYYY-MM-DD"),
  gender: z.string().min(1).max(50),
  seekingGender: z.array(z.string()).min(1, "At least one gender preference required"),

  // Step 4: Location
  ukRegion: z.string().min(1).max(100),
  travelRadiusMiles: z.number().int().min(0).max(500),

  // Step 5: Faith (GDPR special category — consent is the boolean, not metadata)
  religiousDataConsent: z.boolean(), // explicit checkbox; must be true
  tradition: z.string().min(1).max(100),
  churchAttendance: z.string().min(1).max(100),
  faithCentrality: z.string().min(1).max(100),
  faithDescription: z.string().max(3000).optional().default(""),

  // Step 6: Life now
  workStatus: z.string().max(100).optional().default(""),
  familySituation: z.string().max(100).optional().default(""),
  interests: z.array(z.string()).optional().default([]),

  // Step 7: Intentions
  relationshipGoal: z.string().max(100).optional().default(""),
  openToRemarriage: z.boolean().nullable().optional().default(null),
  relationshipPace: z.string().max(50).optional().default(""),

  // Step 8: Who to meet
  ageRangeMin: z.number().int().min(18).max(100),
  ageRangeMax: z.number().int().min(18).max(100),
  preferredDistanceMiles: z.number().int().min(0).max(500).optional().default(50),
  meetingPreferences: z.string().max(1000).optional().default(""),

  // Step 9: Essentials
  essentials: z
    .array(
      z.object({
        factor: z.string(),
        label: z.string(),
        tier: z.enum(["essential", "preferred", "open"]),
      })
    )
    .optional()
    .default([]),

  // Step 10: Story
  storyPrompt1: z.string().max(4000).optional().default(""),
  storyPrompt2: z.string().max(4000).optional().default(""),
  storyPrompt3: z.string().max(4000).optional().default(""),
  priorities: z.array(z.string().max(120)).optional().default([]),
  photoConsent: z.boolean().optional().default(false),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// PostgreSQL unique constraint violation error code
function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23505"
  );
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "";
  const consentAt = new Date(); // server-authoritative timestamp for all consent records

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parse = RegistrationSchema.safeParse(body);
  if (!parse.success) {
    const firstError = parse.error.issues[0];
    return NextResponse.json(
      {
        error: firstError?.message ?? "Invalid registration data.",
        field: firstError?.path?.join("."),
      },
      { status: 422 }
    );
  }

  const d = parse.data;

  // Require explicit religious data consent (must be true — not just present)
  if (!d.religiousDataConsent) {
    return NextResponse.json(
      { error: "Explicit consent to process religious belief data is required." },
      { status: 422 }
    );
  }

  // Age gate: 40+
  const age = getAge(d.dateOfBirth);
  if (age < 40) {
    return NextResponse.json(
      { error: "Christian Chapter is for adults aged 40 and over." },
      { status: 422 }
    );
  }

  // Age range must be ordered
  if (d.ageRangeMin >= d.ageRangeMax) {
    return NextResponse.json(
      { error: "Age range minimum must be less than the maximum." },
      { status: 422 }
    );
  }

  // UX pre-check: catch duplicate email before attempting insert.
  // A concurrent duplicate will be caught by the unique constraint below.
  try {
    const existing = await db
      .select({ id: foundingMembers.id })
      .from(foundingMembers)
      .where(eq(foundingMembers.email, d.email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error:
            "An account with that email address already exists. If you have registered before, please contact us.",
        },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error("[api/founding-members] pre-check failed", err);
    return NextResponse.json(
      { error: "Registration could not be completed. Please try again." },
      { status: 500 }
    );
  }

  // Atomic insert: member row + consent records
  try {
    let memberId: number | undefined;

    await db.transaction(async (tx) => {
      const [member] = await tx
        .insert(foundingMembers)
        .values({
          firstName: d.firstName.trim(),
          email: d.email.toLowerCase().trim(),
          marketingConsent: d.marketingConsent,
          dateOfBirth: d.dateOfBirth,
          gender: d.gender,
          seekingGender: d.seekingGender,
          ukRegion: d.ukRegion,
          travelRadiusMiles: d.travelRadiusMiles,
          tradition: d.tradition,
          churchAttendance: d.churchAttendance,
          faithCentrality: d.faithCentrality,
          faithDescription: d.faithDescription || null,
          workStatus: d.workStatus || null,
          familySituation: d.familySituation || null,
          interests: d.interests,
          relationshipGoal: d.relationshipGoal || null,
          openToRemarriage: d.openToRemarriage ?? null,
          relationshipPace: d.relationshipPace || null,
          ageRangeMin: d.ageRangeMin,
          ageRangeMax: d.ageRangeMax,
          preferredDistanceMiles: d.preferredDistanceMiles,
          meetingPreferences: d.meetingPreferences || null,
          essentials: d.essentials,
          storyPrompt1: d.storyPrompt1 || null,
          storyPrompt2: d.storyPrompt2 || null,
          storyPrompt3: d.storyPrompt3 || null,
          priorities: d.priorities,
          photoConsent: d.photoConsent,
          status: "pending",
        })
        .returning({ id: foundingMembers.id });

      memberId = member.id;

      // Religious data consent — GDPR special category (Art. 9).
      // Version and timestamp are server-authoritative; never taken from client.
      await tx.insert(consentRecords).values({
        foundingMemberId: member.id,
        consentType: "religious_data",
        consentVersion: RELIGIOUS_DATA_CONSENT_VERSION,
        granted: true,
        grantedAt: consentAt,
        ipAddress: ip.substring(0, 45),
        userAgent: userAgent.substring(0, 1000),
      });

      // Marketing consent — only recorded if explicitly granted via checkbox
      if (d.marketingConsent) {
        await tx.insert(consentRecords).values({
          foundingMemberId: member.id,
          consentType: "marketing",
          consentVersion: "2025-01",
          granted: true,
          grantedAt: consentAt,
          ipAddress: ip.substring(0, 45),
          userAgent: userAgent.substring(0, 1000),
        });
      }
    });

    return NextResponse.json({ ok: true, memberId }, { status: 201 });
  } catch (err) {
    // Unique constraint violation: concurrent duplicate email after pre-check passed
    if (isUniqueViolation(err)) {
      return NextResponse.json(
        {
          error:
            "An account with that email address already exists. If you have registered before, please contact us.",
        },
        { status: 409 }
      );
    }
    console.error("[api/founding-members POST]", err);
    return NextResponse.json(
      { error: "Registration could not be completed. Please try again." },
      { status: 500 }
    );
  }
}
