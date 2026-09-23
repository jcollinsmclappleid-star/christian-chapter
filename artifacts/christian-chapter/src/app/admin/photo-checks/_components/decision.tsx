"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PhotoCheckDecision({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function decide(decision: "matched" | "not_matched") {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/photo-checks/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(json.error ?? "Could not save the decision.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void decide("matched")}
        className="min-h-[40px] px-3 rounded-md bg-life text-paper text-[13px] disabled:opacity-50"
      >
        Matches
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => void decide("not_matched")}
        className="min-h-[40px] px-3 rounded-md border border-border text-[13px] disabled:opacity-50"
      >
        Does not match
      </button>
      {error && <p className="text-[12px] text-oxblood">{error}</p>}
    </div>
  );
}
