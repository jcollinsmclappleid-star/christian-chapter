"use client";

import { useEffect, useState } from "react";

type ProfileRow = {
  userId: string;
  firstName: string | null;
  status: string;
  ukRegion: string | null;
};

export default function AdminMembersPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [userId, setUserId] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/profiles?status=all")
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { rows: ProfileRow[] };
        setProfiles(json.rows ?? []);
      })
      .catch(() => undefined);
  }, []);

  async function act(action: "suspend" | "restore") {
    setNotice(null);
    setError(null);
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "That could not be saved.");
      return;
    }
    setNotice(action === "suspend" ? "That member is suspended. They cannot use the site." : "That member can sign in again.");
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-plum text-3xl mb-3">Members</h1>
      <p className="text-[15px] text-plum-muted mb-8">
        Suspend a member when they should not be able to use the site. Restore them when that block should end.
      </p>
      <label className="block text-[14px] text-plum mb-4">
        Member
        <select
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          className="mt-1 block w-full min-h-[44px] border border-border rounded-md px-3 bg-ivory"
        >
          <option value="">Choose a profile</option>
          {profiles.map((profile) => (
            <option key={profile.userId} value={profile.userId}>
              {profile.firstName ?? "Unnamed"} · {profile.ukRegion ?? "Region unset"} · {profile.status}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => void act("suspend")} className="min-h-[44px] px-4 rounded-md bg-oxblood text-ivory">
          Suspend
        </button>
        <button type="button" onClick={() => void act("restore")} className="min-h-[44px] px-4 rounded-md border border-border text-plum">
          Restore
        </button>
      </div>
      {notice && <p className="mt-6 text-plum">{notice}</p>}
      {error && <p className="mt-6 text-oxblood">{error}</p>}
    </div>
  );
}
