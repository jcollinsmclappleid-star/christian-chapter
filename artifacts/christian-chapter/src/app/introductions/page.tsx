"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/button";

type IntroCard = {
  id: string;
  rank: number;
  poolLabel: string;
  alignmentText: string;
  status: string;
  why: Array<{ text: string }>;
  card: { firstName: string | null; age: number | null; ukRegion?: string | null; tradition?: string | null };
};

export default function IntroductionsPage() {
  const [data, setData] = useState<{
    refreshAt: string | null;
    introductions: IntroCard[];
    restrictingRules: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/introductions")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in?next=/introductions";
          return;
        }
        if (!res.ok) {
          setError("Introductions are not available just now.");
          return;
        }
        setData(await res.json());
      })
      .catch(() => setError("Introductions are not available just now."));
  }, []);

  if (!data) {
    return (
      <section className="section bg-ivory">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-plum-muted">{error ?? "Preparing today’s introductions…"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ivory section">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
          Today’s introductions
        </p>
        <h1 className="font-serif text-plum mb-4">A small set, chosen with care</h1>
        <p className="text-[17px] text-plum-muted leading-7 mb-3">
          Not a feed. You receive a finite set of considered introductions. We never show a
          compatibility percentage.
        </p>
        {data.refreshAt && (
          <p className="text-[14px] text-stone mb-10">
            This set refreshes {new Date(data.refreshAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}.
          </p>
        )}

        {data.introductions.length === 0 ? (
          <div className="rounded-lg border border-border bg-ivory-dark p-6">
            <h2 className="font-serif text-2xl text-plum mb-3">No introductions just now</h2>
            <ul className="space-y-2 text-[15px] text-plum-muted mb-6">
              {data.restrictingRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <p className="text-[15px] text-plum-muted mb-5">
              You can change only what you control: your Essentials, distance, or availability.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/profile" variant="primary">
                Review your profile
              </LinkButton>
              <LinkButton href="/account" variant="ghost">
                Availability
              </LinkButton>
            </div>
          </div>
        ) : (
          <ol className="space-y-5">
            {data.introductions.map((intro) => (
              <li key={intro.id} className="rounded-[18px] border border-border bg-ivory-dark p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-stone mb-2">
                  {intro.poolLabel} · {intro.alignmentText}
                </p>
                <h2 className="font-serif text-[2rem] text-plum mb-2">
                  {intro.card.firstName}
                  {intro.card.age ? `, ${intro.card.age}` : ""}
                </h2>
                <p className="text-[15px] text-plum-muted mb-4">
                  {[intro.card.ukRegion, intro.card.tradition].filter(Boolean).join(" · ")}
                </p>
                <p className="text-[15px] text-plum mb-6">{intro.why[0]?.text}</p>
                <LinkButton href={`/introductions/${intro.id}`} variant="primary">
                  Open this introduction
                </LinkButton>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
