"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/button";

interface AccountPayload {
  user: {
    email: string;
    firstName: string | null;
    status: string;
    emailVerifiedAt: string | null;
  };
  application: {
    id: number;
    status: string;
    currentStep: number;
    hiddenAt: string | null;
    submittedAt: string | null;
  } | null;
  consents: Array<{
    type: string;
    version: string;
    granted: boolean;
    grantedAt: string;
    withdrawnAt: string | null;
  }>;
  residence?: {
    ukResidence: "resident" | "intending_to_relocate" | null;
    openToRelocation: boolean | null;
  };
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: "Draft — not yet submitted",
    submitted: "Submitted — waiting for review",
    in_review: "Being reviewed",
    accepted: "Accepted to the founding cohort",
    waitlisted: "Waitlisted while the cohort is balanced",
    flagged: "Flagged for review",
    declined: "Not accepted",
    closure_requested: "Closure requested",
    closed: "Closed",
  };
  return map[status] ?? status;
}

export default function AccountPage() {
  const [data, setData] = useState<AccountPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in";
          return;
        }
        const json = await res.json();
        setData(json);
      })
      .catch(() => setError("Could not load your account."));
  }, []);

  async function setMarketing(next: boolean) {
    setBusy(true);
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marketingConsent: next }),
    });
    const res = await fetch("/api/account");
    setData(await res.json());
    setBusy(false);
  }

  async function withdrawReligious() {
    if (
      !confirm(
        "Withdrawing religious-data consent stops faith-based processing and closes your founding application. Continue?",
      )
    )
      return;
    setBusy(true);
    const res = await fetch("/api/account/withdraw-religious", { method: "POST" });
    const json = await res.json();
    alert(json.message ?? "Updated.");
    window.location.reload();
  }

  async function closeAccount() {
    if (!confirm("Request account closure? Your application will be hidden immediately.")) return;
    setBusy(true);
    await fetch("/api/account/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true, reason: "other" }),
    });
    window.location.href = "/";
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (!data) {
    return (
      <section className="section bg-ivory">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-plum-muted">{error ?? "Loading your founding application…"}</p>
        </div>
      </section>
    );
  }

  const marketing = data.consents.find((c) => c.type === "marketing");

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
          Your founding application
        </p>
        <h1 className="font-serif text-plum mb-2">
          {data.user.firstName ? `Hello, ${data.user.firstName}.` : "Your account"}
        </h1>
        <p className="text-[16px] text-plum-muted mb-10">{data.user.email}</p>

        <dl className="space-y-4 mb-10">
          <div>
            <dt className="text-[12px] uppercase tracking-wider text-stone">Email</dt>
            <dd className="text-plum">
              {data.user.emailVerifiedAt
                ? "Confirmed"
                : "Not yet confirmed — check your inbox for a link"}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] uppercase tracking-wider text-stone">Application</dt>
            <dd className="text-plum">
              {data.application
                ? statusLabel(data.application.status)
                : "Not started"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3 mb-12">
          <LinkButton href="/profile" variant="primary">
            Your profile
          </LinkButton>
          <LinkButton href="/register" variant="ghost">
            {data.application?.status === "draft" ? "Resume application" : "Founding application"}
          </LinkButton>
          <button
            onClick={signOut}
            className="min-h-[44px] px-5 border border-border rounded-md text-[14px]"
          >
            Sign out
          </button>
        </div>

        <h2 className="font-serif text-2xl text-plum mb-4">Consents</h2>
        <ul className="space-y-3 mb-8 text-[15px] text-plum-muted">
          {data.consents.map((c) => (
            <li key={c.type}>
              <strong className="text-plum font-medium">{c.type}</strong> · version {c.version} ·{" "}
              {c.granted ? "granted" : "withdrawn"}
            </li>
          ))}
        </ul>
        <p className="text-[14px] mb-8">
          Read the{" "}
          <a href="/privacy" className="underline">
            Privacy policy
          </a>
          ,{" "}
          <a href="/terms" className="underline">
            Terms of use
          </a>{" "}
          and{" "}
          <a href="/cookies" className="underline">
            Cookie information
          </a>
          .
        </p>

        <h2 className="font-serif text-2xl text-plum mb-3">UK residence</h2>
        <p className="text-[15px] text-plum-muted mb-4">
          Christian Chapter is a UK service. Tell us whether you live here, or intend to relocate.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          {(
            [
              ["resident", "I live in the UK"],
              ["intending_to_relocate", "I intend to relocate to the UK"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await fetch("/api/account", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ukResidence: value }),
                });
                const res = await fetch("/api/account");
                setData(await res.json());
                setBusy(false);
              }}
              className={`min-h-[44px] px-4 rounded-md border text-[14px] ${
                data.residence?.ukResidence === value
                  ? "border-oxblood bg-oxblood-light text-oxblood"
                  : "border-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="font-serif text-2xl text-plum mb-3">Your data</h2>
        <p className="text-[15px] text-plum-muted mb-4">
          Download a copy of your account, consents and profile. This is your data only.
        </p>
        <a
          href="/api/account/export"
          className="inline-flex min-h-[44px] items-center px-5 border border-border rounded-md text-[14px] mb-10"
        >
          Export my data
        </a>

        <label className="flex items-start gap-3 mb-10">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 accent-oxblood"
            checked={Boolean(marketing?.granted)}
            disabled={busy}
            onChange={(e) => setMarketing(e.target.checked)}
          />
          <span className="text-[15px] text-plum">
            Optional news about Christian Chapter. You can change this at any time.
          </span>
        </label>

        <h2 className="font-serif text-2xl text-plum mb-3">Availability</h2>
        <p className="text-[15px] text-plum-muted mb-4">
          Taking a break removes you from new introductions immediately. Existing
          conversations stay unless you choose to close them.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await fetch("/api/account/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "taking_a_break", conversationPolicy: "preserve" }),
              });
              setBusy(false);
              alert("You are taking a break. New introductions will stop.");
            }}
            className="min-h-[44px] px-5 border border-border rounded-md text-[14px]"
          >
            Take a break
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await fetch("/api/account/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "available" }),
              });
              setBusy(false);
              alert("Welcome back. You can appear in introductions again.");
            }}
            className="min-h-[44px] px-5 border border-border rounded-md text-[14px]"
          >
            I’m available again
          </button>
        </div>

        <h2 className="font-serif text-2xl text-plum mb-3">Close or withdraw</h2>
        <p className="text-[15px] text-plum-muted leading-6 mb-4">
          Withdrawing religious-data consent stops faith-based processing and closes
          the dating application. Closure hides your application immediately. We
          keep only records we are required to keep for a limited period — not
          “already deleted from backups.”
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={withdrawReligious}
            className="min-h-[44px] px-5 border border-border rounded-md text-[14px]"
          >
            Withdraw religious-data consent
          </button>
          <button
            disabled={busy}
            onClick={closeAccount}
            className="min-h-[44px] px-5 border border-oxblood/30 text-oxblood rounded-md text-[14px]"
          >
            Request account closure
          </button>
        </div>
      </div>
    </section>
  );
}
