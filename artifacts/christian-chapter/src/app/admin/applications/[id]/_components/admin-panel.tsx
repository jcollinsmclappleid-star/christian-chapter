"use client";

import { useState } from "react";
import { StatusBadge } from "../../../_components/status-badge";

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In review" },
  { value: "accepted", label: "Accepted" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "flagged", label: "Flagged" },
  { value: "declined", label: "Declined" },
  { value: "closure_requested", label: "Closure requested" },
  { value: "closed", label: "Closed" },
] as const;

interface AdminPanelProps {
  memberId: number;
  currentStatus: string;
  currentNotes: string;
  reviewedAt: string | null;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminPanel({
  memberId,
  currentStatus,
  currentNotes,
  reviewedAt,
}: AdminPanelProps) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastReviewedAt, setLastReviewedAt] = useState(reviewedAt);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const body: Record<string, string> = {};
      if (status !== currentStatus) body.status = status;
      body.internalNotes = notes;

      const res = await fetch(`/api/admin/applications/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = (await res.json()) as { reviewedAt?: string };
        if (data.reviewedAt) setLastReviewedAt(data.reviewedAt);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const json = (await res.json()) as { error?: string };
        setError(json.error ?? "Save failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-ivory border border-border rounded-lg px-5 py-5 space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone font-sans mb-4">
          Admin review
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[13px] text-stone font-sans">Current:</span>
          <StatusBadge status={status} />
        </div>
        {lastReviewedAt && (
          <p className="text-[11px] text-stone font-sans mb-3">
            Last reviewed {fmtDate(lastReviewedAt)}
          </p>
        )}
      </div>

      {/* Status selector */}
      <div>
        <label
          htmlFor="status"
          className="block text-[13px] font-medium text-plum mb-2 font-sans"
        >
          Update status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full min-h-[44px] px-3 bg-ivory border border-border-medium rounded-md text-[14px] text-plum font-sans focus:outline-none focus:ring-2 focus:ring-plum appearance-none"
        >
          {STATUSES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-[13px] font-medium text-plum mb-2 font-sans"
        >
          Internal notes
          <span className="text-stone font-normal"> — not visible to member</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="Profile quality notes, concerns, matched or considered for…"
          className="w-full p-3 bg-ivory border border-border-medium rounded-md text-[13px] text-plum font-sans resize-y leading-6 placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-plum"
        />
      </div>

      {/* Save button */}
      {error && (
        <p className="text-[12px] text-oxblood font-sans" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-[12px] text-evergreen font-sans">Saved.</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full min-h-[44px] bg-plum text-ivory rounded-md text-[14px] font-sans font-medium transition-colors hover:bg-plum-soft disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>

      <p className="text-[11px] text-stone font-sans">
        Status changes are logged with a review timestamp.
      </p>
    </div>
  );
}
