"use client";

import { useState } from "react";
import { StatusBadge } from "../../../_components/status-badge";

const ACTIONS = [
  { value: "approved", label: "Approve" },
  { value: "review", label: "Keep in review" },
  { value: "changes_required", label: "Request changes" },
  { value: "hidden", label: "Hide" },
] as const;

export function ProfileReviewPanel({
  profileId,
  status,
  reviewNotes,
}: {
  profileId: string;
  status: string;
  reviewNotes: string;
}) {
  const [nextStatus, setNextStatus] = useState(status);
  const [notes, setNotes] = useState(reviewNotes);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await fetch(`/api/admin/profiles/${profileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        reviewNotes: notes,
        memberMessage: message.trim() || undefined,
      }),
    });
    if (!res.ok) {
      setError("Could not save.");
      setBusy(false);
      return;
    }
    setMessage("");
    setSaved(true);
    setBusy(false);
  }

  return (
    <aside className="bg-ivory border border-border rounded-lg p-5 space-y-5 lg:sticky lg:top-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone mb-3">Review</p>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => (
          <button
            key={action.value}
            type="button"
            onClick={() => setNextStatus(action.value)}
            className={`min-h-[44px] rounded-md border text-[13px] ${
              nextStatus === action.value
                ? "bg-plum text-ivory border-plum"
                : "border-border text-plum"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="block text-[13px] font-medium mb-2">Internal notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full p-3 rounded-md border border-border-medium text-[13px]"
        />
      </label>

      <label className="block">
        <span className="block text-[13px] font-medium mb-2">Message the member</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Shown on their profile. Use for a photo request or a kind note."
          className="w-full p-3 rounded-md border border-border-medium text-[13px]"
        />
      </label>

      {error && <p className="text-[13px] text-oxblood">{error}</p>}
      {saved && <p className="text-[13px] text-evergreen">Saved.</p>}

      <button
        type="button"
        disabled={busy}
        onClick={() => void save()}
        className="w-full min-h-[44px] rounded-md bg-plum text-ivory text-[14px] disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save review"}
      </button>
    </aside>
  );
}
