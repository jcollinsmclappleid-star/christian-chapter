"use client";

import type { Metadata } from "next";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Note: metadata can't be exported from a client component — handled by layout
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const json = (await res.json()) as { error?: string };
        setError(json.error ?? "Sign in failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-plum flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-serif text-ivory text-xl tracking-tight">
            Mature Christian Dating
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone mt-1 font-sans">
            Admin Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-ivory rounded-lg px-8 py-8">
          <h1 className="font-sans font-semibold text-[18px] text-plum mb-1">
            Sign in
          </h1>
          <p className="text-[13px] text-stone mb-7">
            Restricted to authorised team members.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-plum mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-3 bg-ivory border border-border-medium rounded-md text-[15px] text-plum focus:outline-none focus:ring-2 focus:ring-plum"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-plum mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] px-3 bg-ivory border border-border-medium rounded-md text-[15px] text-plum focus:outline-none focus:ring-2 focus:ring-plum"
              />
            </div>

            {error && (
              <p className="text-[13px] text-oxblood font-sans" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-plum text-ivory rounded-md text-[15px] font-sans font-medium transition-colors hover:bg-plum-soft disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[12px] text-stone/50">
          Lost access? Contact the system administrator.
        </p>
      </div>
    </div>
  );
}
