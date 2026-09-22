"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Menu, X } from "lucide-react";

const memberLinks = [
  { href: "/introductions", label: "Introductions" },
  { href: "/connections", label: "Connections" },
  { href: "/profile", label: "Profile" },
  { href: "/account", label: "Account" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => setSignedIn(Boolean(json.signedIn)))
      .catch(() => undefined);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-life">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Logo tone="light" />

        {signedIn ? (
          <>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
              {memberLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-[15px] text-paper hover:text-glow">
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-paper md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </>
        ) : (
          <a href="/sign-in" className="text-[15px] font-medium text-paper hover:text-glow">
            Sign in
          </a>
        )}
      </div>

      {signedIn && mobileOpen && (
        <nav className="border-t border-white/10 bg-life px-5 py-2 md:hidden" aria-label="Main navigation">
          {memberLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block border-b border-white/10 py-3 text-[17px] text-paper"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
