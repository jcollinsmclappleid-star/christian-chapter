"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { APPLICATION_RETENTION_DAYS } from "@/lib/site-config";

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
  presence?: {
    activityState: string;
    profileStatus: string;
  };
  sandbox?: boolean;
  privateBrowsing?: {
    entitled: boolean;
    enabled: boolean;
    priceLabel: string;
  };
  notifications?: {
    introductions: boolean;
    profileViews: boolean;
  };
  signIns?: Array<{ id: string; createdAt: string }>;
  blocks?: Array<{ userId: string; firstName: string | null }>;
  billing?: {
    cardSaved: boolean;
    stripeReady: boolean;
    collectsLabel: string;
    priceLabel: string;
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
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [nextEmail, setNextEmail] = useState("");
  const [deleteReason, setDeleteReason] = useState<"met_someone" | "other">("other");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    const start = sessionId
      ? fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })
      : Promise.resolve();
    start
      .then(() => fetch("/api/account"))
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/sign-in";
          return;
        }
        const json = await res.json();
        setData(json);
        if (sessionId) {
          window.history.replaceState({}, "", "/account");
          setNotice("Your card is saved. The first payment is 15 February 2027.");
        }
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
    setBusy(true);
    const res = await fetch("/api/account/withdraw-religious", { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setNotice(json.error ?? "That consent could not be withdrawn.");
      setBusy(false);
      return;
    }
    window.location.reload();
  }

  async function setPresence(state: "available" | "taking_a_break") {
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/account/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state, conversationPolicy: "preserve" }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setNotice(json.error ?? "That could not be saved.");
      setBusy(false);
      return;
    }
    setData((current) =>
      current
        ? {
            ...current,
            presence: {
              activityState: json.activityState ?? state,
              profileStatus: state === "taking_a_break" ? "paused" : "approved",
            },
          }
        : current,
    );
    setNotice(
      state === "taking_a_break"
        ? "Your profile is suspended. New introductions stop. Existing conversations stay."
        : "Your profile can be included in new introductions again.",
    );
    setBusy(false);
  }

  async function closeAccount() {
    setBusy(true);
    const res = await fetch("/api/account/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true, reason: deleteReason }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setNotice(json.error ?? "The account could not be deleted.");
      setBusy(false);
      return;
    }
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
          <p className="text-plum-muted">{error ?? "Opening your settings…"}</p>
        </div>
      </section>
    );
  }

  const marketing = data.consents.find((c) => c.type === "marketing");
  const suspended =
    data.presence?.activityState === "taking_a_break" || data.presence?.profileStatus === "paused";

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-life font-sans mb-4">
          Settings
        </p>
        <h1 className="font-serif text-plum mb-2">
          {data.user.firstName ? `${data.user.firstName}’s settings` : "Your settings"}
        </h1>
        <p className="text-[16px] text-plum-muted mb-10">{data.user.email}</p>
        {notice && (
          <p className="mb-8 rounded-md border border-border bg-paper px-4 py-3 text-[15px] text-plum" role="status">
            {notice}
          </p>
        )}

        <h2 className="font-serif text-2xl text-plum mb-3">Private browsing</h2>
        <p className="text-[15px] text-plum-muted mb-4">
          {data.privateBrowsing?.enabled
            ? "Private browsing is on. Opening an introduction does not put your name on their list, and it does not mark you as recently active."
            : `Browse without being seen for ${data.privateBrowsing?.priceLabel ?? "£9 a month"} from 15 February 2027. Nothing is charged now.`}
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const res = await fetch("/api/account/private-browsing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: !data.privateBrowsing?.enabled }),
              });
              const json = await res.json().catch(() => ({}));
              if (!res.ok) {
                setNotice(json.error ?? "Private browsing could not be changed.");
                setBusy(false);
                return;
              }
              const fresh = await fetch("/api/account");
              setData(await fresh.json());
              setNotice(json.enabled ? "Private browsing is on." : "Private browsing is off.");
              setBusy(false);
            }}
            className="min-h-[44px] px-5 border border-border rounded-md text-[14px] disabled:opacity-50"
          >
            {data.privateBrowsing?.enabled ? "Turn off private browsing" : "Turn on private browsing"}
          </button>
          {data.sandbox && !data.privateBrowsing?.entitled && (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const res = await fetch("/api/account/dev-entitlement", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ plan: "incognito" }),
                });
                const json = await res.json().catch(() => ({}));
                const fresh = await fetch("/api/account");
                if (fresh.ok) setData(await fresh.json());
                setNotice(json.message ?? json.error ?? "That grant did not complete.");
                setBusy(false);
              }}
              className="min-h-[44px] px-5 border border-border rounded-md text-[14px] text-plum-muted disabled:opacity-50"
            >
              Development grant
            </button>
          )}
        </div>

        <h2 className="font-serif text-2xl text-plum mb-3">Membership</h2>
        <p className="text-[15px] text-plum-muted mb-10">
          Founding membership is free. Payment is not open, and no card is taken.
        </p>

        <h2 className="font-serif text-2xl text-plum mb-3">Who looked</h2>
        <p className="text-[15px] text-plum-muted mb-4">
          See the people who opened your introduction. Private visits are left off the list.
        </p>
        <a href="/profile/views" className="inline-flex min-h-[44px] items-center px-5 border border-border rounded-md text-[14px] mb-10">
          Who looked
        </a>

        <h2 className="font-serif text-2xl text-plum mb-3">Emails</h2>
        <div className="space-y-3 mb-10">
          <label className="flex items-start gap-3 text-[15px] text-plum">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-life"
              checked={data.notifications?.introductions !== false}
              disabled={busy}
              onChange={async (event) => {
                setBusy(true);
                await fetch("/api/account", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ notifyIntroductions: event.target.checked }),
                });
                const fresh = await fetch("/api/account");
                setData(await fresh.json());
                setBusy(false);
              }}
            />
            <span>Email me when there is a new introduction.</span>
          </label>
          <label className="flex items-start gap-3 text-[15px] text-plum">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-life"
              checked={data.notifications?.profileViews !== false}
              disabled={busy}
              onChange={async (event) => {
                setBusy(true);
                await fetch("/api/account", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ notifyProfileViews: event.target.checked }),
                });
                const fresh = await fetch("/api/account");
                setData(await fresh.json());
                setBusy(false);
              }}
            />
            <span>Email me when someone looks at my profile.</span>
          </label>
        </div>

        <h2 className="font-serif text-2xl text-plum mb-3">Sign-in address</h2>
        <form
          className="flex flex-wrap gap-3 mb-10"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            const res = await fetch("/api/account/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: nextEmail }),
            });
            const json = await res.json().catch(() => ({}));
            setNotice(json.message ?? json.error ?? "That address could not be saved.");
            setBusy(false);
          }}
        >
          <input
            type="email"
            value={nextEmail}
            onChange={(event) => setNextEmail(event.target.value)}
            placeholder="New email address"
            className="min-h-[44px] flex-1 px-4 rounded-md border border-border bg-paper text-[15px]"
          />
          <button type="submit" disabled={busy || !nextEmail} className="min-h-[44px] px-5 border border-border rounded-md text-[14px] disabled:opacity-50">
            Send confirmation
          </button>
        </form>

        <h2 className="font-serif text-2xl text-plum mb-3">Blocked people</h2>
        {data.blocks && data.blocks.length > 0 ? (
          <ul className="space-y-3 mb-10">
            {data.blocks.map((block) => (
              <li key={block.userId} className="flex items-center justify-between gap-3">
                <span className="text-[15px] text-plum">{block.firstName || "A member"}</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    await fetch("/api/account/blocks", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: block.userId }),
                    });
                    const fresh = await fetch("/api/account");
                    setData(await fresh.json());
                    setBusy(false);
                  }}
                  className="min-h-[40px] px-3 text-[14px] underline underline-offset-4"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[15px] text-plum-muted mb-10">You have not blocked anyone.</p>
        )}

        <h2 className="font-serif text-2xl text-plum mb-3">Recent sign-ins</h2>
        {data.signIns && data.signIns.length > 0 ? (
          <ul className="space-y-2 mb-10 text-[15px] text-plum-muted">
            {data.signIns.map((row) => (
              <li key={row.id}>
                {new Date(row.createdAt).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[15px] text-plum-muted mb-10">Sign-ins from now on will appear here.</p>
        )}

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
          Mature Christian Dating is a UK service. Tell us whether you live here, or intend to relocate.
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
            Optional news about Mature Christian Dating. You can change this at any time.
          </span>
        </label>

        <h2 className="font-serif text-2xl text-plum mb-3">Suspend your profile</h2>
        <p className="text-[15px] text-plum-muted mb-4">
          {suspended
            ? "Your profile is suspended. You are left out of new introductions. Your account, photographs, and existing conversations stay."
            : "Suspend your profile when you want time away. You are left out of new introductions at once. Your account stays, and existing conversations stay."}
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          {suspended ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void setPresence("available")}
              className="min-h-[44px] px-5 rounded-md bg-life text-paper text-[14px] disabled:opacity-50"
            >
              Return to introductions
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => void setPresence("taking_a_break")}
              className="min-h-[44px] px-5 border border-border rounded-md text-[14px] disabled:opacity-50"
            >
              Suspend profile
            </button>
          )}
        </div>

        <h2 className="font-serif text-2xl text-plum mb-3">Faith data</h2>
        <p className="text-[15px] text-plum-muted leading-6 mb-4">
          Withdrawing religious-data consent stops faith-based processing and closes
          the dating application.
        </p>
        {confirmWithdraw ? (
          <div className="mb-10 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void withdrawReligious()}
              className="min-h-[44px] px-5 rounded-md bg-oxblood text-paper text-[14px] disabled:opacity-50"
            >
              Withdraw consent and close the application
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmWithdraw(false)}
              className="min-h-[44px] px-5 border border-border rounded-md text-[14px]"
            >
              Keep consent
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirmWithdraw(true)}
            className="min-h-[44px] px-5 border border-border rounded-md text-[14px] mb-10 disabled:opacity-50"
          >
            Withdraw religious-data consent
          </button>
        )}

        <h2 className="font-serif text-2xl text-plum mb-3">Delete your account</h2>
        <p className="text-[15px] text-plum-muted leading-6 mb-4">
          Deleting hides your profile at once and signs you out. Remaining records are
          removed after {APPLICATION_RETENTION_DAYS} days, except what we must keep for
          security or the law. A check photograph, if one is still held, is deleted now.
        </p>
        {confirmDelete ? (
          <div className="rounded-md border border-oxblood/30 bg-paper p-4 mb-4">
            <p className="text-[15px] text-plum mb-3">Delete this account?</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(
                [
                  ["met_someone", "I met someone"],
                  ["other", "Another reason"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDeleteReason(value)}
                  className={`min-h-[40px] px-3 rounded-md border text-[14px] ${
                    deleteReason === value ? "border-life bg-life-light text-life" : "border-border"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void closeAccount()}
                className="min-h-[44px] px-5 rounded-md bg-oxblood text-paper text-[14px] disabled:opacity-50"
              >
                Delete my account
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDelete(false)}
                className="min-h-[44px] px-5 border border-border rounded-md text-[14px]"
              >
                Keep my account
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
            className="min-h-[44px] px-5 border border-oxblood/30 text-oxblood rounded-md text-[14px] disabled:opacity-50"
          >
            Delete account
          </button>
        )}
      </div>
    </section>
  );
}
