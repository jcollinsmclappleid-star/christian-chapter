"use client";

import type { StepProps } from "../wizard-types";

export function Step2Account({ data, update }: StepProps) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
        Step 2 of 10
      </p>
      <h2 className="font-serif text-plum mb-4 text-3xl md:text-4xl">
        Your account
      </h2>
      <p className="text-[17px] text-plum-muted leading-7 mb-10">
        We&rsquo;ll use your email to let you know when we find a promising connection.
      </p>

      <div className="space-y-7">
        {/* First name */}
        <div>
          <label htmlFor="firstName" className="block text-[15px] font-sans font-medium text-plum mb-2">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={data.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder="Your first name"
            className="w-full min-h-[52px] px-4 bg-ivory border border-border-medium rounded-md text-plum text-[16px] placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-oxblood transition-shadow"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[15px] font-sans font-medium text-plum mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="you@example.com"
            className="w-full min-h-[52px] px-4 bg-ivory border border-border-medium rounded-md text-plum text-[16px] placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-oxblood transition-shadow"
          />
        </div>

        {/* Marketing consent — separate, clearly optional */}
        <div className="bg-ivory-dark border border-border rounded-md p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.marketingConsent}
              onChange={(e) => update({ marketingConsent: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-border-medium text-oxblood accent-oxblood flex-shrink-0 cursor-pointer"
            />
            <div>
              <p className="text-[14px] font-sans font-medium text-plum mb-1">
                Keep me informed about Christian Chapter news — optional
              </p>
              <p className="text-[13px] text-plum-muted leading-5">
                Occasional updates about the service, community news and features.
                You can change this at any time. This is separate from
                introduction-related communications, which we always send.
              </p>
            </div>
          </label>
        </div>

        <p className="text-[12px] text-stone leading-5">
          By continuing you agree that Christian Chapter may store your account
          and application data as described in our{" "}
          <a href="/privacy" className="underline underline-offset-2 text-plum">
            Privacy policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline underline-offset-2 text-plum">
            Terms of use
          </a>
          . We will email you a one-time link to confirm this address before the
          application can become active.
        </p>
      </div>
    </div>
  );
}
