"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClosureActions({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resolve() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/closures/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" }),
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error ?? "Could not update.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={resolve}
        disabled={busy}
        className="min-h-[44px] px-3 border border-border rounded text-[12px] text-plum hover:bg-ivory-dark disabled:opacity-50"
      >
        {busy ? "Saving…" : "Mark resolved"}
      </button>
      {error && (
        <p className="text-[11px] text-oxblood mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
