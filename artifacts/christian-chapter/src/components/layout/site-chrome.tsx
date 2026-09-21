"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

function isBarePath(pathname: string) {
  return pathname.startsWith("/register") || pathname.startsWith("/admin");
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isBarePath(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
