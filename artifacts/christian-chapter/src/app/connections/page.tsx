"use client";

import { useEffect, useState } from "react";
import { CLOSURE_TEMPLATES } from "@/lib/matching/connections";

type Card = {
  otherUserId: string;
  firstName: string;
  region: string | null;
  state: string;
  matchId: string | null;
  canClose: boolean;
};

export default function ConnectionsPage() {
  const [data, setData] = useState<{
    newInterests: Card[];
    pending: Card[];
    matches: Card[];
    closed: Card[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/connections");
    if (res.status === 401) {
      window.location.href = "/sign-in?next=/connections";
      return;
    }
    if (!res.ok) {
      setError("We could not load your connections.");
      return;
    }
    setData(await res.json());
  }

  useEffect(() => {
    load().catch(() => setError("We could not load your connections."));
  }, []);

  async function closeMatch(id: string, templateId: string) {
    await fetch(`/api/connections/${id}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId }),
    });
    await load();
  }

  if (!data) {
    return (
      <section className="section bg-ivory">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-plum-muted">{error ?? "Opening your connections…"}</p>
        </div>
      </section>
    );
  }

  function List({ title, items, empty }: { title: string; items: Card[]; empty: string }) {
    return (
      <section className="mb-12">
        <h2 className="font-serif text-2xl text-plum mb-4">{title}</h2>
        {items.length === 0 ? (
          <p className="text-[15px] text-plum-muted">{empty}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.otherUserId} className="rounded-lg border border-border bg-ivory-dark px-5 py-4">
                <p className="font-serif text-[1.5rem] text-plum">{item.firstName}</p>
                <p className="text-[14px] text-plum-muted">{item.region}</p>
                {item.canClose && item.matchId && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CLOSURE_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => closeMatch(item.matchId!, template.id)}
                        className="min-h-[40px] px-3 border border-border rounded-md text-[13px]"
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">Connections</p>
        <h1 className="font-serif text-plum mb-8">New interests, conversations and closures</h1>
        <List title="New interests" items={data.newInterests} empty="No one is waiting for a reply." />
        <List title="Waiting or saved" items={data.pending} empty="Nothing waiting." />
        <List title="Matches" items={data.matches} empty="No matches yet — that is ordinary at this stage." />
        <List title="Closed" items={data.closed} empty="No closed connections." />
      </div>
    </section>
  );
}
