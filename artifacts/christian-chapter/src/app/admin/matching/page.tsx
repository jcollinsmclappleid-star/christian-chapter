"use client";

import { useEffect, useState } from "react";

export default function AdminMatchingPage() {
  const [inventory, setInventory] = useState<{ counts: Record<string, number>; total: number } | null>(null);
  const [introductionId, setIntroductionId] = useState("");
  const [explained, setExplained] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/matching")
      .then(async (res) => {
        if (!res.ok) {
          setError("Could not load matching inventory.");
          return;
        }
        setInventory(await res.json());
      })
      .catch(() => setError("Could not load matching inventory."));
  }, []);

  async function explain(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch(`/api/admin/matching?introductionId=${encodeURIComponent(introductionId)}`);
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Not found.");
      setExplained(null);
      return;
    }
    setError(null);
    setExplained(json);
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-plum text-3xl mb-6">Introductions</h1>
      <p className="text-[15px] text-plum-muted mb-8">
        Lean inventory and explainability. This is not a marketplace operations console.
      </p>
      {inventory && (
        <dl className="mb-10 grid gap-2 text-[14px]">
          <div className="flex justify-between border-b border-border py-2">
            <dt>Profiles</dt>
            <dd>{inventory.total}</dd>
          </div>
          {Object.entries(inventory.counts).map(([key, count]) => (
            <div key={key} className="flex justify-between border-b border-border py-2">
              <dt>{key}</dt>
              <dd>{count}</dd>
            </div>
          ))}
        </dl>
      )}
      <form onSubmit={explain} className="flex flex-wrap gap-3 mb-8">
        <input
          value={introductionId}
          onChange={(event) => setIntroductionId(event.target.value)}
          placeholder="Introduction id"
          className="min-h-[44px] border border-border rounded-md px-3 flex-1"
        />
        <button type="submit" className="min-h-[44px] px-4 rounded-md bg-plum text-ivory">
          Explain
        </button>
      </form>
      {error && <p className="text-oxblood mb-4">{error}</p>}
      {explained && (
        <pre className="text-[12px] bg-ivory-dark p-4 rounded-md overflow-auto">
          {JSON.stringify(explained, null, 2)}
        </pre>
      )}
    </div>
  );
}
