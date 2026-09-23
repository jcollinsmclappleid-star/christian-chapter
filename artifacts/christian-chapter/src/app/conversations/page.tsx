"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  firstName: string | null;
  ukRegion: string | null;
};

export default function ConversationsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/conversations")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in?next=/conversations";
          return;
        }
        if (!res.ok) {
          setError("We couldn’t open your conversations.");
          return;
        }
        const json = await res.json();
        setRows(json.conversations ?? []);
      })
      .catch(() => setError("We couldn’t open your conversations."));
  }, []);

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="font-serif text-plum mb-3">Conversations</h1>
        <p className="text-[16px] text-plum-muted mb-8">
          A conversation opens when we connect you with someone.
        </p>
        {error && <p className="text-oxblood">{error}</p>}
        {rows && rows.length === 0 && <p className="text-plum-muted">No conversations yet.</p>}
        <ul className="space-y-3">
          {rows?.map((row) => (
            <li key={row.id}>
              <a href={`/conversations/${row.id}`} className="block rounded-md border border-border bg-paper px-5 py-4">
                <p className="font-serif text-[1.5rem] text-plum">{row.firstName || "A member"}</p>
                {row.ukRegion && <p className="text-[14px] text-plum-muted">{row.ukRegion}</p>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
