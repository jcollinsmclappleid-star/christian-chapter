import { NextRequest, NextResponse } from "next/server";
import { db, foundingMembers, consentRecords } from "@/db";
import { z } from "zod";

// Server-authoritative constants — never accepted from the client
const RELIGIOUS_CONSENT_VERSION = "2025-01";
const MARKETING_CONSENT_VERSION = "2025-01";

// ── Submission schema ─────────────────────────────────────────────────────────

const SubmitSchema = z.object({
  // Step 2
  firstName: z.string().min(1).max(100),
  email: z.string().email(),
  marketingConsent: z.boolean(),
  // Step 3
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.string().min(1),
  seekingGender: z.array(z.string()).min(1),
  // Step 4
  ukRegion: z.string().min(1),
  travelRadiusMiles: z.number().int().min(5).max(300),
  // Step 5 — consent must be true; version/timestamp used as UI evidence only
  religiousDataConsent: z.literal(true, {
    errorMap: () => ({
      message: "Religious data consent is required to complete registration.",
    }),
  }),
  // Client sends the timestamp as evidence the checkbox was shown and clicked,
  // but the authoritative grantedAt is always the server's clock.
  religiousDataConsentTimestamp: z.string().min(1),
  religiousDataConsentVersion: z.string(), // informational only
  tradition: z.string().min(1),
  churchAttendance: z.string().min(1),
  faithCentrality: z.string().min(1),
  faithDescription: z.string().optional(),
  // Step 6
  workStatus: z.string().optional(),
  familySituation: z.string().optional(),
  interests: z.array(z.string()),
  // Step 7
  relationshipGoal: z.string().optional(),
  openToRemarriage: z.boolean().nullable(),
  relationshipPace: z.string().optional(),
  // Step 8
  ageRangeMin: z.number().int().min(18).max(100),
  ageRangeMax: z.number().int().min(18).max(100),
  preferredDistanceMiles: z.number().int().min(1).max(300),
  meetingPreferences: z.string().optional(),
  // Step 9
  essentials: z.array(
    z.object({
      factor: z.string(),
      label: z.string(),
      tier: z.enum(["essential", "preferred", "open"]),
    })
  ),
  // Step 10
  storyPrompt1: z.string().optional(),
  storyPrompt2: z.string().optional(),
  storyPrompt3: z.string().optional(),
  priorities: z.array(z.string()),
  photoConsent: z.boolean(),
});

// ── POST /api/founding-members ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parse = SubmitSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parse.error.issues },
      { status: 422 }
    );
  }

  const data = parse.data;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = request.headers.get("user-agent") ?? null;

  // Server-authoritative consent timestamp
  const now = new Date();

  try {
    // ── Atomic: member row + both consent records in one transaction ──────
    const memberId = await db.transaction(async (tx) => {
      const [member] = await tx
        .insert(foundingMembers)
        .values({
          firstName: data.firstName.trim(),
          email: data.email.toLowerCase().trim(),
          marketingConsent: data.marketingConsent,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          seekingGender: data.seekingGender,
          ukRegion: data.ukRegion,
          travelRadiusMiles: data.travelRadiusMiles,
          tradition: data.tradition,
          churchAttendance: data.churchAttendance,
          faithCentrality: data.faithCentrality,
          faithDescription: data.faithDescription ?? null,
          workStatus: data.workStatus ?? null,
          familySituation: data.familySituation ?? null,
          interests: data.interests,
          relationshipGoal: data.relationshipGoal ?? null,
          openToRemarriage: data.openToRemarriage,
          relationshipPace: data.relationshipPace ?? null,
          ageRangeMin: data.ageRangeMin,
          ageRangeMax: data.ageRangeMax,
          preferredDistanceMiles: data.preferredDistanceMiles,
          meetingPreferences: data.meetingPreferences ?? null,
          essentials: data.essentials,
          storyPrompt1: data.storyPrompt1 ?? null,
          storyPrompt2: data.storyPrompt2 ?? null,
          storyPrompt3: data.storyPrompt3 ?? null,
          priorities: data.priorities,
          photoConsent: data.photoConsent,
        })
        .returning({ id: foundingMembers.id });

      if (!member) {
        throw new Error("Member insert returned no rows.");
      }

      // Both consent rows in the same transaction
      await tx.insert(consentRecords).values([
        {
          foundingMemberId: member.id,
          consentType: "religious_data",
          // Use server-authoritative version and time regardless of client values
          consentVersion: RELIGIOUS_CONSENT_VERSION,
          granted: true,
          grantedAt: now,
          ipAddress: ip,
          userAgent: ua,
        },
        {
          foundingMemberId: member.id,
          consentType: "marketing",
          consentVersion: MARKETING_CONSENT_VERSION,
          granted: data.marketingConsent,
          grantedAt: now,
          ipAddress: ip,
          userAgent: ua,
        },
      ]);

      return member.id;
    });

    // Fire-and-forget confirmation email — never blocks the 201 response
    void sendConfirmationEmail(data.email, data.firstName);

    return NextResponse.json({ success: true, id: memberId }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }
    console.error("[founding-members] transaction error:", err);
    return NextResponse.json(
      { error: "Registration could not be completed. Please try again." },
      { status: 500 }
    );
  }
}

// ── Confirmation email (Resend, optional) ─────────────────────────────────────

async function sendConfirmationEmail(email: string, firstName: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Welcome to Christian Chapter</title></head>
<body style="font-family:'Georgia',serif;background:#F7F3EC;color:#1E1220;margin:0;padding:40px 20px">
  <div style="max-width:560px;margin:0 auto;background:#F7F3EC;padding:40px 32px;border:1px solid rgba(30,18,32,0.10)">
    <h1 style="font-size:28px;line-height:1.2;margin:0 0 20px;letter-spacing:-0.02em">
      Welcome, ${firstName}.
    </h1>
    <p style="font-size:17px;line-height:1.7;color:#6B5878;margin:0 0 16px">
      You&rsquo;re a founding member of Christian Chapter — and we&rsquo;re glad you&rsquo;re here.
    </p>
    <p style="font-size:17px;line-height:1.7;color:#6B5878;margin:0 0 16px">
      Your profile is with us. As our founding community grows, we&rsquo;ll be looking for genuine mutual connections — and we&rsquo;ll be in touch when we think there&rsquo;s someone worth introducing you to.
    </p>
    <p style="font-size:17px;line-height:1.7;color:#6B5878;margin:0 0 32px">
      We don&rsquo;t guarantee a match. We do promise to be thoughtful, honest, and unhurried.
    </p>
    <div style="border-top:1px solid rgba(30,18,32,0.12);padding-top:24px;font-size:13px;color:#9A8E9A">
      <p style="margin:0">Christian Chapter &middot; Christian dating for your next chapter.</p>
      <p style="margin:8px 0 0">You can withdraw your data at any time by emailing us.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Christian Chapter <hello@christianchapter.co.uk>",
        to: email,
        subject: `Welcome to Christian Chapter, ${firstName}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[founding-members] Resend error:", res.status);
    }
  } catch (err) {
    console.error("[founding-members] email error:", err);
  }
}
