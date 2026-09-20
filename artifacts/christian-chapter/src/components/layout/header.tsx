"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <a href="/" className="flex flex-col leading-none group">
          <span className="font-serif text-[1.1rem] tracking-tight text-plum group-hover:text-oxblood transition-colors">
            Christian Chapter
          </span>
          <span className="text-[10px] tracking-[0.18em] uppercase text-stone font-sans mt-0.5">
            UK Christian dating
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-plum-muted hover:text-plum transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/register"
            className="text-[14px] text-plum-muted hover:text-plum transition-colors tracking-wide"
          >
            Sign in
          </a>
          <LinkButton href="/register" size="sm" variant="primary">
            Join free
          </LinkButton>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-plum hover:bg-ivory-dark transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-ivory px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-[16px] text-plum py-2 border-b border-border last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/register"
            className="block text-[16px] text-plum-muted py-2"
            onClick={() => setMobileOpen(false)}
          >
            Sign in
          </a>
          <LinkButton href="/register" variant="primary" fullWidth size="lg">
            Join free
          </LinkButton>
        </div>
      )}
    </header>
  );
}
