"use client";

import { useEffect, useState } from "react";

type ProfileRow = {
  userId: string;
  firstName: string | null;
  email: string;
  status: string;
  ukRegion: string | null;
};

export default function AdminMatchingPage() {
  const [inventory, setInventory] = useState<{ counts: Record<string, number>; total: number } | null>(null);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [userAId, setUserAId] = useState("");
  const [userBId, setUserBId] = useState("");
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
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
    fetch("/api/admin/profiles?status=all")
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { rows: ProfileRow[] };
        setProfiles(json.rows ?? []);
      })
      .catch(() => undefined);
  }, []);

  async function connect(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);
    setError(null);
    const res = await fetch("/api/admin/matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAId, userBId, reason }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Could not connect these profiles.");
      return;
    }
    setNotice("These two profiles are now introduced to each other.");
    setReason("");
  }

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
        During the opening offer, connect two submitted profiles. Each person then sees the other as a hand-picked introduction.
      </p>
      <form onSubmit={connect} className="mb-10 space-y-3">
        <label className="block text-[14px] text-plum">
          First profile
          <select
            value={userAId}
            onChange={(event) => setUserAId(event.target.value)}
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
        <label className="block text-[14px] text-plum">
          Second profile
          <select
            value={userBId}
            onChange={(event) => setUserBId(event.target.value)}
            className="mt-1 block w-full min-h-[44px] border border-border rounded-md px-3 bg-ivory"
          >
            <option value="">Choose a profile</option>
            {profiles.map((profile) => (
              <option key={`b-${profile.userId}`} value={profile.userId}>
                {profile.firstName ?? "Unnamed"} · {profile.ukRegion ?? "Region unset"} · {profile.status}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[14px] text-plum">
          Reason they will both see
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="mt-1 block w-full border border-border rounded-md px-3 py-2 bg-ivory"
            placeholder="You share a similar faith life and a similar chapter of life."
          />
        </label>
        <button type="submit" className="min-h-[44px] px-4 rounded-full bg-life text-white">
          Connect these two
        </button>
      </form>
      {notice && <p className="text-plum mb-6">{notice}</p>}
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
