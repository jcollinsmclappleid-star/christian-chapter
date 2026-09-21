"use client";

import type { WizardData } from "./wizard-types";
import { POLICY_VERSION, RELIGIOUS_CONSENT_VERSION } from "./wizard-types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ReviewScreenProps {
  data: WizardData;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
  onTermsChange: (accepted: boolean) => void;
}

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

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-[11px] uppercase tracking-[0.22em] text-stone font-sans mb-3 pb-2 border-b-2 border-oxblood/25">
        {title}
      </h3>
      <dl className="space-y-0">{children}</dl>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value === null || value === undefined || value === "" || value === false) return null;
  return (
    <div className="flex gap-4 py-2.5 border-b border-border last:border-0">
      <dt className="text-[12px] text-stone font-sans w-40 flex-shrink-0 pt-0.5 leading-5">
        {label}
      </dt>
      <dd className="text-[14px] text-plum font-sans leading-6">{value}</dd>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ReviewScreen({
  data,
  onBack,
  onSubmit,
  submitting,
  submitError,
  onTermsChange,
}: ReviewScreenProps) {
  const STORY_PROMPT_LABELS = [
    "Prompt 1",
    "Prompt 2",
    "Prompt 3",
  ];

  const storyAnswers: [string, string][] = [
    [STORY_PROMPT_LABELS[0], data.storyPrompt1],
    [STORY_PROMPT_LABELS[1], data.storyPrompt2],
    [STORY_PROMPT_LABELS[2], data.storyPrompt3],
  ].filter(([, v]) => v.trim().length > 0) as [string, string][];

  const prioritiesFilled = data.priorities.filter((p) => p.trim().length > 0);

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
        Review your profile
      </p>
      <h2 className="font-serif text-plum mb-4 text-3xl md:text-4xl">
        Does everything look right?
      </h2>
      <p className="text-[17px] text-plum-muted leading-7 mb-10">
        Check your answers below. Use the back button to make any changes before submitting.
      </p>

      {/* Profile summary card */}
      <div className="bg-ivory border border-border rounded-lg px-6 py-6 mb-8">
        <Section title="Your account">
          <Row label="First name" value={data.firstName} />
          <Row label="Email" value={data.email} />
          <Row
            label="Marketing emails"
            value={data.marketingConsent ? "Yes — keep me informed" : "No thanks"}
          />
        </Section>

        <Section title="About you">
          <Row
            label="Date of birth"
            value={
              data.dateOfBirth
                ? `${data.dateOfBirth} · age ${getAge(data.dateOfBirth)}`
                : null
            }
          />
          <Row label="Gender" value={data.gender} />
          <Row label="Seeking" value={data.seekingGender.join(", ")} />
        </Section>

        <Section title="Your location">
          <Row label="UK region" value={data.ukRegion} />
          <Row label="Travel radius" value={`${data.travelRadiusMiles} miles`} />
        </Section>

        <Section title="Your faith">
          <Row label="Tradition" value={data.tradition} />
          <Row label="Church attendance" value={data.churchAttendance} />
          <Row label="Faith centrality" value={data.faithCentrality} />
          <Row
            label="Faith in daily life"
            value={data.faithDescription?.trim() || null}
          />
        </Section>

        <Section title="Your life now">
          <Row label="Work / retirement" value={data.workStatus || null} />
          <Row label="Family situation" value={data.familySituation || null} />
          <Row
            label="Interests"
            value={data.interests.length > 0 ? data.interests.join(", ") : null}
          />
        </Section>

        <Section title="Relationship intentions">
          <Row label="Looking for" value={data.relationshipGoal || null} />
          <Row
            label="Open to remarriage"
            value={
              data.openToRemarriage === true
                ? "Yes"
                : data.openToRemarriage === false
                ? "No"
                : "Unsure"
            }
          />
          <Row label="Preferred pace" value={data.relationshipPace || null} />
        </Section>

        <Section title="Who you hope to meet">
          <Row
            label="Age range"
            value={`${data.ageRangeMin}–${data.ageRangeMax}`}
          />
          <Row
            label="Distance preference"
            value={`${data.preferredDistanceMiles} miles`}
          />
          <Row label="Meeting preferences" value={data.meetingPreferences?.trim() || null} />
        </Section>

        {data.essentials.length > 0 && (
          <Section title="My Essentials">
            {data.essentials.map((e) => (
              <Row
                key={e.factor}
                label={e.label}
                value={
                  <span
                    className={`text-[11px] font-sans font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                      e.tier === "essential"
                        ? "bg-oxblood-light text-oxblood"
                        : e.tier === "preferred"
                        ? "bg-evergreen-light text-evergreen"
                        : "bg-ivory-dark text-stone"
                    }`}
                  >
                    {e.tier === "open"
                      ? "Open-minded"
                      : e.tier.charAt(0).toUpperCase() + e.tier.slice(1)}
                  </span>
                }
              />
            ))}
          </Section>
        )}

        <Section title="Your story">
          {storyAnswers.map(([label, answer]) => (
            <Row key={label} label={label} value={answer} />
          ))}
          {prioritiesFilled.length > 0 && (
            <Row
              label="Three priorities"
              value={
                <ol className="list-none space-y-0.5">
                  {prioritiesFilled.map((p, i) => (
                    <li key={i} className="text-[14px] text-plum">
                      {i + 1}. {p}
                    </li>
                  ))}
                </ol>
              }
            />
          )}
        </Section>
      </div>

      {/* Consent statement */}
      <div className="bg-ivory-dark border border-border rounded-lg px-5 py-4 mb-8 space-y-4">
        <p className="text-[13px] text-plum-muted leading-6">
          You are submitting a founding application, not joining a live
          introductions marketplace. Policy versions: Privacy {POLICY_VERSION},
          Terms {POLICY_VERSION}. Religious-belief consent version{" "}
          {RELIGIOUS_CONSENT_VERSION}.
        </p>
        <p className="text-[13px] text-plum-muted leading-6">
          Read the{" "}
          <a href="/privacy" className="underline text-plum" target="_blank" rel="noreferrer">
            Privacy policy
          </a>
          {" "}and{" "}
          <a href="/terms" className="underline text-plum" target="_blank" rel="noreferrer">
            Terms of use
          </a>{" "}
          before you agree.
        </p>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={data.termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-1 w-5 h-5 accent-oxblood"
            aria-required="true"
          />
          <span className="text-[14px] text-plum leading-6">
            I have read and agree to the Privacy policy and Terms of use. I
            confirm my answers are accurate.
          </span>
        </label>
      </div>

      {/* Error */}
      {submitError && (
        <p className="text-[14px] text-oxblood mb-5 font-sans" role="alert">
          {submitError}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 min-h-[48px] px-5 text-[15px] text-plum-muted border border-border rounded-md hover:bg-ivory-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
        >
          ← Back to edit
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting || !data.termsAccepted}
          className="inline-flex items-center gap-2 min-h-[52px] px-8 text-[15px] font-sans font-medium bg-oxblood text-ivory rounded-md hover:bg-oxblood-hover transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit my application →"}
        </button>
      </div>
    </div>
  );
}
