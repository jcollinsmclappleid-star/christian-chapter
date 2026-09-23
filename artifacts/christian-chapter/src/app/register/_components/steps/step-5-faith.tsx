"use client";

import { StepNote } from "../step-note";
import { RELIGIOUS_CONSENT_VERSION, TRADITIONS, ATTENDANCE_OPTIONS, CENTRALITY_OPTIONS } from "../wizard-types";
import type { StepProps } from "../wizard-types";

function SegmentedButtons({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  columns?: number;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`min-h-[52px] px-3 py-2 rounded-md border text-[14px] font-sans leading-4 text-center transition-colors ${
            value === opt
              ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
              : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Step5Faith({ data, update }: StepProps) {
  const handleConsentChange = (checked: boolean) => {
    update({
      religiousDataConsent: checked,
      religiousDataConsentTimestamp: checked ? new Date().toISOString() : null,
      religiousDataConsentVersion: RELIGIOUS_CONSENT_VERSION,
    });
  };

  return (
    <div>
      <h2 className="font-sans font-bold text-plum mb-4 text-3xl md:text-4xl tracking-[-0.03em]">
        Faith can be honest here.
      </h2>
      <StepNote>It belongs in the introduction. It needs its own consent, and it is never sold.</StepNote>

      {/* ── GDPR consent — mandatory ──────────────────────────────────────── */}
      <div className={`rounded-lg border-2 p-5 mb-10 ${data.religiousDataConsent ? "border-evergreen bg-evergreen-light" : "border-border-medium bg-ivory-dark"}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="religiousConsent"
            checked={data.religiousDataConsent}
            onChange={(e) => handleConsentChange(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-border-medium accent-evergreen flex-shrink-0 cursor-pointer"
            aria-required="true"
          />
          <div>
            <p className="text-[14px] font-sans font-medium text-plum mb-1">
              I consent to Mature Christian Dating processing my religious belief data — required
            </p>
            <p className="text-[13px] text-plum-muted leading-5">
              Information about your faith and denomination is{" "}
              <strong className="font-medium">special category data</strong> under UK
              GDPR. We collect it solely to identify compatible introductions. It is
              never displayed publicly, not sold, and not shared with third parties. You
              may withdraw this consent at any time from your account settings, which
              will remove your profile from active introductions.
            </p>
          </div>
        </label>
      </div>

      {!data.religiousDataConsent && (
        <p className="text-[13px] text-oxblood mb-8 font-sans">
          Please give consent above to continue. We cannot process your faith
          information without it.
        </p>
      )}

      <div
        className="space-y-9"
        style={{ opacity: data.religiousDataConsent ? 1 : 0.4, pointerEvents: data.religiousDataConsent ? "auto" : "none" }}
        aria-hidden={!data.religiousDataConsent}
      >
        {/* Christian tradition */}
        <div>
          <label htmlFor="tradition" className="block text-[15px] font-sans font-medium text-plum mb-2">
            Christian tradition
          </label>
          <select
            id="tradition"
            value={data.tradition}
            onChange={(e) => update({ tradition: e.target.value })}
            disabled={!data.religiousDataConsent}
            className="w-full min-h-[52px] px-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] focus:outline-none focus:ring-2 focus:ring-oxblood appearance-none disabled:opacity-50"
          >
            <option value="" disabled>
              Select your tradition…
            </option>
            {TRADITIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Church attendance */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            Church attendance
          </legend>
          <SegmentedButtons
            options={ATTENDANCE_OPTIONS}
            value={data.churchAttendance}
            onChange={(v) => update({ churchAttendance: v })}
            columns={2}
          />
        </fieldset>

        {/* Faith centrality */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            How central is faith to your daily life?
          </legend>
          <SegmentedButtons
            options={CENTRALITY_OPTIONS}
            value={data.faithCentrality}
            onChange={(v) => update({ faithCentrality: v })}
            columns={2}
          />
        </fieldset>

        {/* Daily faith narrative */}
        <div>
          <label htmlFor="faithDescription" className="block text-[15px] font-sans font-medium text-plum mb-2">
            What does faith look like for you day to day?{" "}
            <span className="font-normal text-stone">(optional)</span>
          </label>
          <textarea
            id="faithDescription"
            value={data.faithDescription}
            onChange={(e) => update({ faithDescription: e.target.value })}
            rows={4}
            disabled={!data.religiousDataConsent}
            placeholder="Feel free to be as specific or as general as you like."
            className="w-full p-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] leading-7 resize-y placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-oxblood disabled:opacity-50"
          />
          <p className="mt-2 text-[12px] text-stone">
            Used for matching only — not shown on your public profile.
          </p>
        </div>
      </div>
    </div>
  );
}
