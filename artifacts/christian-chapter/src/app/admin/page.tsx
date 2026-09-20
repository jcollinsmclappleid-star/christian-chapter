import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Christian Chapter",
  robots: { index: false, follow: false },
};

// Admin login shell — full implementation in Task #8
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-plum flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <span className="font-serif text-[1.1rem] text-ivory">Christian Chapter</span>
          <p className="text-[12px] uppercase tracking-[0.2em] text-stone mt-1 font-sans">
            Admin
          </p>
        </div>
        <div className="bg-ivory rounded-lg p-8">
          <h1 className="font-sans font-semibold text-[18px] text-plum mb-1">Sign in</h1>
          <p className="text-[14px] text-stone mb-6">Admin dashboard — restricted access</p>
          <p className="text-[14px] text-plum-muted leading-6">
            The admin dashboard is being built as part of the registration and cohort management work. It will be available shortly.
          </p>
          <a href="/" className="block mt-6 text-[13px] text-oxblood underline underline-offset-2 hover:text-oxblood-hover">
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
