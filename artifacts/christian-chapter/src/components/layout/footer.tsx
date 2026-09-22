import { Logo } from "@/components/brand/logo";
import { footerLegalLine } from "@/lib/site-config";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
  { href: "/pricing", label: "Pricing" },
  { href: "/christian-dating", label: "Christian dating" },
  { href: "/register", label: "Create your profile" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-plum">
      <div className="mx-auto max-w-5xl px-5 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Logo tone="light" />
          <p className="text-[13px] text-foam mt-1">{footerLegalLine(year)}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] text-foam hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
