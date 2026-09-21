import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Today’s introductions",
  robots: { index: false, follow: false },
};

export default function IntroductionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
