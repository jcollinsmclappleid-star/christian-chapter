"use client";

import { useEffect, useState } from "react";
import { ProfileStudio } from "./_components/profile-studio";
import type { StudioProfile } from "@/lib/profile/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudioProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in?next=/profile";
          return;
        }
        if (!res.ok) {
          setError("We couldn’t load your profile just now.");
          return;
        }
        setProfile(await res.json());
      })
      .catch(() => setError("We couldn’t load your profile just now."));
  }, []);

  if (!profile) {
    return (
      <section className="section bg-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-plum-muted">{error ?? "Opening your profile…"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ivory py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <ProfileStudio initial={profile} />
      </div>
    </section>
  );
}
