import type { Metadata } from "next";
import { Wizard } from "./_components/wizard";

export const metadata: Metadata = {
  title: "Join Christian Chapter — Founding Member Registration",
  description:
    "Create your founding member profile. Considered introductions for UK Christians aged 40–70.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <Wizard />;
}
