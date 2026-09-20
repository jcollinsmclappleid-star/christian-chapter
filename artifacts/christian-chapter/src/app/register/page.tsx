import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Registration entry point — redirects to first wizard step
// The full wizard is implemented in Task #8 (registration wizard, database, and admin)
export default function RegisterPage() {
  redirect("/register/account");
}
