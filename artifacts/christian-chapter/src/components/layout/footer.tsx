import { footerLegalLine } from "@/lib/site-config";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
  { href: "/register", label: "Create your profile" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ivory">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <p className="font-serif text-[1.05rem] text-plum">Christian Chapter</p>
          <p className="text-[13px] text-stone mt-1">{footerLegalLine(year)}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] text-plum-muted hover:text-plum"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
