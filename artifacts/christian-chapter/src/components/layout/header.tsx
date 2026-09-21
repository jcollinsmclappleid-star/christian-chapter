"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const publicLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
];

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

  const links = signedIn ? memberLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-5xl px-6 flex items-center justify-between h-16 md:h-[72px]">
        <Logo />

        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-plum-muted hover:text-plum transition-colors"
            >
              {link.label}
            </a>
          ))}
          {!signedIn && (
            <a href="/sign-in" className="text-[14px] text-plum-muted hover:text-plum transition-colors">
              Sign in
            </a>
          )}
          <LinkButton href="/register" size="sm" variant="primary">
            {signedIn ? "Continue your profile" : "Create your profile"}
          </LinkButton>
        </nav>

        <button
          className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-md text-plum hover:bg-ivory-dark"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-ivory px-6 py-5 space-y-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-[17px] text-plum py-3 border-b border-border"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {!signedIn && (
            <a
              href="/sign-in"
              className="block text-[17px] text-plum-muted py-3"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </a>
          )}
          <div className="pt-4">
            <LinkButton href="/register" variant="primary" fullWidth size="lg">
              {signedIn ? "Continue your profile" : "Create your profile"}
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
