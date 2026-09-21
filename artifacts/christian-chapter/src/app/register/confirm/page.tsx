import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application received",
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  return (
    <div className="min-h-[70vh] bg-ivory">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-6 text-center">
          Founding application
        </p>
        <h1 className="font-serif text-plum mb-6 text-center">
          Your application is with us.
        </h1>
        <p className="text-[18px] text-plum-muted leading-8 max-w-[560px] mx-auto text-center mb-12">
          Thank you. A founding application is not an introduction, and it is
          not a guarantee that you will be accepted into the next cohort batch.
          We will only email you about this application from the address you
          confirmed.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {[
            {
              num: "01",
              title: "Email confirmed",
              body: "You reached this page after confirming the address you control.",
            },
            {
              num: "02",
              title: "Application submitted",
              body: "Our team can review completeness and cohort balance. That is not automated matching.",
            },
            {
              num: "03",
              title: "We will be in touch",
              body: "If the cohort is ready and your application is accepted, we will say so clearly — without promising a person to meet.",
            },
          ].map(({ num, title, body }) => (
            <div key={num} className="border-t-2 border-oxblood/30 pt-5">
              <p className="font-serif text-oxblood text-3xl mb-4">{num}</p>
              <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">{title}</h3>
              <p className="text-[14px] text-plum-muted leading-6">{body}</p>
            </div>
          ))}
        </div>
        <div className="text-center space-y-5">
          <Link
            href="/profile"
            className="inline-flex min-h-[52px] items-center px-7 rounded-md bg-oxblood text-ivory text-[15px]"
          >
            Continue to your profile
          </Link>
          <div>
            <Link href="/account" className="text-[14px] text-plum-muted underline underline-offset-4">
              Or view your application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
