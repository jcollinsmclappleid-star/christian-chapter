import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your connections",
  robots: { index: false, follow: false },
};

export default function ConnectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
