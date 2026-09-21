"use client";

import { useEffect, useState } from "react";

export default function ProfileVerifyPage() {
  const [notice, setNotice] = useState("Development checks only.");
  const [message, setMessage] = useState<string | null>(null);
  const [msisdn, setMsisdn] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile/verify")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in?next=/profile/verify";
          return;
        }
        const json = await res.json();
        setNotice(json.notice ?? notice);
      })
      .catch(() => undefined);
  }, [notice]);

  async function run(body: Record<string, unknown>) {
    const res = await fetch("/api/profile/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setMessage(json.message ?? json.error);
    if (json.check?.payload && typeof json.check.payload === "object") {
      const data = (json.check.payload as { data?: { challengeId?: string } }).data;
      if (data?.challengeId) setChallengeId(data.challengeId);
    }
  }

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-xl px-6">
        <a href="/profile" className="text-[14px] text-plum-muted underline underline-offset-4">
          Back to profile
        </a>
        <h1 className="font-serif text-plum mt-4 mb-3">Verification</h1>
        <p className="text-[16px] text-plum-muted mb-8">{notice}</p>

        <div className="space-y-4 mb-10">
          <input
            value={msisdn}
            onChange={(e) => setMsisdn(e.target.value)}
            placeholder="Mobile number (sandbox)"
            className="w-full min-h-[52px] px-4 rounded-md border border-border-medium"
          />
          <button
            type="button"
            onClick={() => void run({ kind: "mobile", msisdn })}
            className="min-h-[48px] px-5 rounded-md bg-plum text-ivory text-[14px]"
          >
            Send development SMS code
          </button>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code (246810 in sandbox)"
            className="w-full min-h-[52px] px-4 rounded-md border border-border-medium"
          />
          <button
            type="button"
            onClick={() => void run({ kind: "mobile", code, challengeId })}
            className="min-h-[48px] px-5 rounded-md border border-border text-[14px]"
          >
            Confirm mobile
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            type="button"
            onClick={() => void run({ kind: "selfie" })}
            className="min-h-[48px] px-5 rounded-md border border-border text-[14px]"
          >
            Development selfie check
          </button>
          <button
            type="button"
            onClick={() => void run({ kind: "photo_match" })}
            className="min-h-[48px] px-5 rounded-md border border-border text-[14px]"
          >
            Development photo-match
          </button>
        </div>
        {message && <p className="text-[15px] text-plum">{message}</p>}
      </div>
    </section>
  );
}
