import type { Metadata } from "next";
import { Wizard } from "./_components/wizard";

export const metadata: Metadata = {
  title: "Join Christian Chapter — Founding Member Registration",
  description:
    "Create your founding application. UK Christian dating for adults aged 40 and over — no maximum age.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <Wizard />;
}
