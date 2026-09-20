import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Christian Chapter",
  robots: { index: false, follow: false },
};

// Registration wizard shell — full implementation in Task #8
// This placeholder prevents a 404 and allows the site to run and be reviewed
export default function RegisterAccountPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-ivory px-6">
      <div className="max-w-md w-full text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
          Join Christian Chapter
        </p>
        <h1 className="font-serif text-plum text-4xl mb-5">
          Let&apos;s get started.
        </h1>
        <p className="text-[17px] text-plum-muted leading-7 mb-8">
          The registration wizard is being built. It will be available shortly — creating your profile takes around 10–12 minutes.
        </p>
        <a
          href="/"
          className="text-[14px] text-oxblood underline underline-offset-4 hover:text-oxblood-hover transition-colors"
        >
          ← Return to homepage
        </a>
      </div>
    </div>
  );
}
