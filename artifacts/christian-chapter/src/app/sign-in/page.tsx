"use client";

import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage(null);
    setDevLink(null);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as {
        message?: string;
        error?: string;
        devLink?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong.");
        return;
      }
      setStatus("sent");
      setMessage(json.message ?? "If that email has an account, we have sent a link.");
      if (json.devLink) setDevLink(json.devLink);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-md px-5 pt-10 pb-16">
        <h1 className="font-sans font-semibold text-[2rem] leading-tight text-plum">Sign in</h1>
        <p className="mt-3 mb-6 text-[16px] leading-6 text-plum-muted">
          Continue your profile with the email you used. We will send a one-time link — there is
          no password.
        </p>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-[15px] font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[52px] px-4 border border-border-medium rounded-xl bg-white text-[16px] focus:outline-none focus:ring-2 focus:ring-life"
            />
          </div>
          {message && (
            <p
              className={`text-[14px] ${status === "error" ? "text-oxblood" : "text-plum-muted"}`}
              role="status"
            >
              {message}
            </p>
          )}
          {devLink && (
            <p className="text-[13px] text-stone">
              Development only:{" "}
              <a href={devLink} className="underline text-plum">
                open magic link
              </a>
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full min-h-[52px] px-7 bg-life text-white rounded-full font-sans font-medium text-[15px] disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
        <p className="mt-10 text-[15px] text-plum-muted">
          New here?{" "}
          <a href="/register" className="text-life underline underline-offset-4">
            Create your profile
          </a>
        </p>
      </div>
    </section>
  );
}
