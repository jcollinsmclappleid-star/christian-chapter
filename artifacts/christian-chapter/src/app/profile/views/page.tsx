"use client";

import { useEffect, useState } from "react";

type ViewCard = {
  id: string;
  firstName: string | null;
  ukRegion: string | null;
  lookedAt: string;
  photoUrl: string | null;
};

function when(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfileViewsPage() {
  const [views, setViews] = useState<ViewCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile/views")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in?next=/profile/views";
          return;
        }
        if (!res.ok) {
          setError("We couldn’t load who looked just now.");
          return;
        }
        const json = await res.json();
        setViews(json.views ?? []);
      })
      .catch(() => setError("We couldn’t load who looked just now."));
  }, []);

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-3xl px-6">
        <a href="/profile" className="text-[14px] text-plum-muted underline underline-offset-4">
          Your profile
        </a>
        <h1 className="font-serif text-plum mt-4 mb-3">Who looked</h1>
        <p className="text-[16px] text-plum-muted mb-8 max-w-xl">
          People who opened your introduction appear here. Someone browsing privately does not.
        </p>
        {error && <p className="text-oxblood">{error}</p>}
        {views && views.length === 0 && (
          <p className="text-[16px] text-plum-muted">No one has looked yet.</p>
        )}
        <ul className="space-y-4">
          {views?.map((view) => (
            <li key={view.id} className="flex items-center gap-4 rounded-md border border-border bg-paper p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-life-light">
                {view.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={view.photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-serif text-[1.4rem] text-plum">{view.firstName || "A member"}</p>
                <p className="text-[14px] text-plum-muted">
                  {[view.ukRegion, when(view.lookedAt)].filter(Boolean).join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
