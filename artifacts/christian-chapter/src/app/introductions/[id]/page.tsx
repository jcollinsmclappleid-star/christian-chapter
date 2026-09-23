"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DatingProfileView } from "@/components/profile/dating-profile-view";

type Intro = {
  id: string;
  memberId?: string;
  canAct?: boolean;
  poolLabel: string;
  alignmentText: string;
  activityLabel: string;
  status: string;
  why: Array<{ text: string }>;
  worthDiscussing: Array<{ text: string }>;
  card: Parameters<typeof DatingProfileView>[0]["profile"] & { firstName: string | null };
};

export default function IntroductionDossierPage() {
  const params = useParams<{ id: string }>();
  const [intro, setIntro] = useState<Intro | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/introductions/${params.id}`)
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = `/sign-in?next=/introductions/${params.id}`;
          return;
        }
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setError(json.error ?? "This introduction is no longer available.");
          return;
        }
        setIntro(await res.json());
      })
      .catch(() => setError("This introduction is no longer available."));
  }, [params.id]);

  async function act(action: "talk" | "save" | "decline") {
    setBusy(true);
    const res = await fetch(`/api/introductions/${params.id}/act`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "We could not record that just now.");
      return;
    }
    setDone(
      action === "talk"
        ? json.matchId
          ? "You have a match. You can write when you are ready."
          : "We’ve noted that you’d like to talk. If they feel the same, you’ll see a match."
        : action === "save"
          ? "Saved for seven days."
          : "We’ve noted that. They will not see a reason.",
    );
  }

  if (error && !intro) {
    return (
      <section className="section bg-ivory">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-plum-muted mb-6">{error}</p>
          <a href="/introductions" className="underline text-plum">
            Back to today’s introductions
          </a>
        </div>
      </section>
    );
  }

  if (!intro) {
    return (
      <section className="section bg-ivory">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-plum-muted">Opening this introduction…</p>
        </div>
      </section>
    );
  }

  const dossier = intro;

  async function safety(action: "block" | "report") {
    if (!dossier.memberId) return;
    setBusy(true);
    const res = await fetch("/api/safety/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: dossier.memberId,
        action,
        source: "introduction",
        reason: action === "report" ? "concern" : undefined,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("That could not be saved.");
      return;
    }
    if (action === "block") {
      window.location.href = "/introductions";
      return;
    }
    setDone("We’ve recorded that. They will not be introduced to you.");
  }

  const actions = (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={busy || Boolean(done)}
        onClick={() => act("talk")}
        className="min-h-[48px] rounded-md bg-oxblood text-ivory px-5"
      >
        I’d like to talk
      </button>
      <button
        type="button"
        disabled={busy || Boolean(done)}
        onClick={() => act("save")}
        className="min-h-[48px] rounded-md border border-plum/25 text-plum px-5"
      >
        Save for later
      </button>
      <button
        type="button"
        disabled={busy || Boolean(done)}
        onClick={() => act("decline")}
        className="min-h-[48px] rounded-md text-plum-muted px-5"
      >
        Not for me
      </button>
    </div>
  );

  return (
    <section className="bg-ivory-dark min-h-screen pb-36 md:pb-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12 grid md:grid-cols-[minmax(0,430px)_1fr] gap-8 items-start">
        <div>
          <a href="/introductions" className="text-[14px] text-plum-muted underline underline-offset-4">
            All introductions
          </a>
          <div className="mt-5">
            <DatingProfileView
              profile={{
                ...intro.card,
                prompts: intro.card.prompts ?? [],
                photos: intro.card.photos ?? [],
              }}
            />
          </div>
        </div>

        <aside className="md:sticky md:top-24 space-y-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-life">
            {intro.poolLabel} · {intro.activityLabel}
          </p>
          <h1 className="font-serif text-plum text-[2.4rem]">{intro.alignmentText}</h1>
          <div className="rounded-[16px] border border-border bg-ivory p-5">
            <h2 className="font-sans font-semibold text-[15px] text-plum mb-3">Why we introduced you</h2>
            <ul className="space-y-2 text-[15px] text-plum-muted">
              {intro.why.map((item) => (
                <li key={item.text}>{item.text}</li>
              ))}
            </ul>
          </div>
          {intro.worthDiscussing.length > 0 && (
            <div className="rounded-[16px] border border-border bg-ivory p-5">
              <h2 className="font-sans font-semibold text-[15px] text-plum mb-3">Worth discussing</h2>
              <ul className="space-y-2 text-[15px] text-plum-muted">
                {intro.worthDiscussing.map((item) => (
                  <li key={item.text}>{item.text}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="hidden md:block">{intro.canAct === false ? null : actions}</div>
          {intro.canAct === false && (
            <p className="text-[15px] text-plum-muted">
              You can look. Responding opens when matching is switched on.
            </p>
          )}
          {intro.memberId && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void safety("block")}
                className="min-h-[44px] px-4 text-[14px] text-plum-muted underline underline-offset-4"
              >
                Block
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void safety("report")}
                className="min-h-[44px] px-4 text-[14px] text-plum-muted underline underline-offset-4"
              >
                Report
              </button>
            </div>
          )}
          {done && <p className="text-[15px] text-evergreen">{done}</p>}
          {error && <p className="text-[15px] text-oxblood">{error}</p>}
        </aside>
      </div>

      {intro.canAct !== false && (
        <div className="md:hidden fixed inset-x-0 bottom-0 border-t border-border bg-ivory/95 px-4 py-3">
          {done ? <p className="text-[14px] text-evergreen">{done}</p> : actions}
        </div>
      )}
    </section>
  );
}
