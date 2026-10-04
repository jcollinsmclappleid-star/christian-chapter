"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClosureActions({
  id,
  scheduledDeleteAt,
}: {
  id: number;
  scheduledDeleteAt: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const due =
    !scheduledDeleteAt || new Date(scheduledDeleteAt).getTime() <= Date.now();

  async function purge(ignoreSchedule: boolean) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/closures/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "purge", ignoreSchedule }),
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error ?? "Could not delete member data.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {due ? (
        <button
          type="button"
          onClick={() => void purge(false)}
          disabled={busy}
          className="min-h-[44px] px-3 border border-oxblood rounded text-[12px] text-oxblood hover:bg-oxblood-light disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Delete member data"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "The retention period has not ended. Delete this member’s data now anyway?",
              )
            ) {
              void purge(true);
            }
          }}
          disabled={busy}
          className="min-h-[44px] px-3 border border-border rounded text-[12px] text-plum hover:bg-ivory-dark disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Delete early"}
        </button>
      )}
      {error && (
        <p className="text-[11px] text-oxblood" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
