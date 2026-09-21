import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
