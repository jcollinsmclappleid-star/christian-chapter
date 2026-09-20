import type { Metadata } from "next";
import { AdminNav } from "./_components/nav";

export const metadata: Metadata = {
  title: { default: "Admin — Christian Chapter", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ivory-dark font-sans">
      <AdminNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
