"use client";

import { useEffect, useState } from "react";

type Photograph = {
  id: string;
  firstName: string | null;
  createdAt: string;
  url: string;
};

export default function AdminPhotographsPage() {
  const [rows, setRows] = useState<Photograph[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/photographs");
    if (!res.ok) {
      setError("Could not load photographs.");
      return;
    }
    const json = await res.json();
    setRows(json.photographs ?? []);
  }

  useEffect(() => {
    load().catch(() => setError("Could not load photographs."));
  }, []);

  async function decide(id: string, decision: "clear" | "rejected") {
    setBusy(id);
    setError(null);
    const res = await fetch(`/api/admin/photographs/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "That decision could not be saved.");
      setBusy(null);
      return;
    }
    await load();
    setBusy(null);
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-plum text-3xl mb-3">Photographs</h1>
      <p className="text-[15px] text-plum-muted mb-8 max-w-xl">
        Compare each photograph. Approving it lets other members see it. Declining it keeps it off their view and tells the member it was not verified.
      </p>
      {error && <p className="text-oxblood mb-4">{error}</p>}
      {rows && rows.length === 0 && <p className="text-plum-muted">No photographs are waiting.</p>}
      <ul className="space-y-6">
        {rows?.map((row) => (
          <li key={row.id} className="flex flex-wrap gap-5 rounded-lg border border-border bg-ivory p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={row.url} alt="" className="h-40 w-32 rounded-md object-cover bg-paper" />
            <div className="min-w-[220px]">
              <p className="font-serif text-2xl text-plum">{row.firstName || "A member"}</p>
              <p className="text-[14px] text-plum-muted mb-4">
                {new Date(row.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy === row.id}
                  onClick={() => void decide(row.id, "clear")}
                  className="min-h-[44px] px-4 rounded-md bg-life text-white disabled:opacity-50"
                >
                  Verify
                </button>
                <button
                  type="button"
                  disabled={busy === row.id}
                  onClick={() => void decide(row.id, "rejected")}
                  className="min-h-[44px] px-4 rounded-md border border-border text-plum disabled:opacity-50"
                >
                  Do not verify
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
