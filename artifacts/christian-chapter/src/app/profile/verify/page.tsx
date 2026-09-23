"use client";

import { useEffect, useState } from "react";

type CheckView = {
  status: string | null;
  imageHeld: boolean;
  decidedAt: string | null;
};

const statusCopy: Record<string, string> = {
  pending: "A person has this photograph. It is deleted when they decide, or within 24 hours if they do not.",
  matched: "A person confirmed this photograph matches you. The photograph itself has been deleted.",
  not_matched: "A person could not confirm the match. The photograph has been deleted. You can send another.",
  expired: "The photograph was deleted after 24 hours with no decision. You can send another.",
};

export default function ProfileVerifyPage() {
  const [check, setCheck] = useState<CheckView | null>(null);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/profile/photo-check")
      .then(async (res) => {
        if (res.status === 401) return;
        if (!res.ok) return;
        setCheck(await res.json());
      })
      .catch(() => undefined);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const body = new FormData(event.currentTarget);
    body.set("consent", consent ? "true" : "false");
    const res = await fetch("/api/profile/photo-check", { method: "POST", body });
    const json = await res.json().catch(() => ({}));
    if (res.status === 401) {
      window.location.href = "/sign-in?next=/profile/verify";
      return;
    }
    if (!res.ok) {
      setMessage(json.error ?? "That photograph could not be saved.");
      setBusy(false);
      return;
    }
    setCheck(json);
    setBusy(false);
  }

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-xl px-6">
        <a href="/profile" className="text-[14px] text-plum-muted underline underline-offset-4">
          Back to profile
        </a>
        <h1 className="font-serif text-plum mt-4 mb-3">A photograph, checked by a person</h1>
        <p className="text-[16px] text-plum-muted mb-4">
          Send one current photograph of your face. A person compares it with the photograph on your profile.
          We keep it only until that decision, and never longer than 24 hours. Then it is deleted.
          We keep the result, not the photograph. It is not sent to any other company.
        </p>
        {check?.status && (
          <p className="mb-6 text-[16px] text-plum">{statusCopy[check.status] ?? check.status}</p>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="flex items-start gap-3 text-[15px] leading-6 text-plum">
            <input
              type="checkbox"
              className="mt-1 accent-life"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              I agree to Mature Christian Dating storing this photograph only for the check, and deleting it when the
              check is finished or after 24 hours.
            </span>
          </label>
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-[15px]"
          />
          <button
            type="submit"
            disabled={!consent || busy}
            className="min-h-[48px] px-5 rounded-md bg-life text-paper text-[14px] disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send for a person to check"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-[15px] text-oxblood" role="alert">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
