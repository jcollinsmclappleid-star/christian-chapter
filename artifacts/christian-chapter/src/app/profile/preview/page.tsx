"use client";

import { useEffect, useState } from "react";
import { DatingProfileView } from "@/components/profile/dating-profile-view";

export default function ProfilePreviewPage() {
  const [profile, setProfile] = useState<Parameters<typeof DatingProfileView>[0]["profile"] | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [asMatch, setAsMatch] = useState(false);

  useEffect(() => {
    fetch(`/api/profile/preview${asMatch ? "?as=match" : ""}`)
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in?next=/profile/preview";
          return;
        }
        const json = await res.json();
        setNote(json.visibilityNote ?? null);
        setProfile({
          ...json,
          prompts: json.prompts ?? [],
          photos: json.photos ?? [],
          lookingFor: json.lookingFor ?? null,
          nextChapter: json.nextChapter ?? null,
        });
      })
      .catch(() => undefined);
  }, [asMatch]);

  return (
    <section className="bg-ivory-dark min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-[430px] px-4">
        <div className="flex items-center justify-between mb-5">
          <a href="/profile" className="text-[14px] text-plum-muted underline underline-offset-4">
            Back to editing
          </a>
          <button
            type="button"
            onClick={() => setAsMatch((value) => !value)}
            className="text-[11px] uppercase tracking-[0.16em] text-stone"
          >
            {asMatch ? "As a match" : "As a member"}
          </button>
        </div>
        {note && <p className="text-[13px] text-plum-muted mb-4">{note}</p>}
        {profile ? (
          <DatingProfileView profile={profile} />
        ) : (
          <p className="text-plum-muted">Preparing your preview…</p>
        )}
      </div>
    </section>
  );
}
