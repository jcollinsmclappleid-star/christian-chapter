const footerLinks = {
  Service: [
    { href: "/how-it-works", label: "How it works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/safety", label: "Safety" },
    { href: "/success-stories", label: "Success stories" },
  ],
  "Christian dating": [
    { href: "/christian-dating", label: "Christian dating UK" },
    { href: "/christian-dating/over-40", label: "Dating in your 40s" },
    { href: "/christian-dating/over-50", label: "Dating in your 50s" },
    { href: "/christian-dating/over-60", label: "Dating in your 60s" },
    { href: "/christian-dating/after-divorce", label: "Dating after divorce" },
    { href: "/christian-dating/after-bereavement", label: "Dating after bereavement" },
  ],
  Support: [
    { href: "/safety", label: "How we keep you safe" },
    { href: "/register", label: "Join free" },
    { href: "/how-it-works", label: "Our approach" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ivory-dark mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <a href="/" className="block mb-4">
              <span className="font-serif text-[1.2rem] text-plum">Christian Chapter</span>
            </a>
            <p className="text-[14px] text-stone leading-6 max-w-[220px]">
              UK Christian dating for your next chapter. Considered introductions for singles 40–70.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] text-stone font-semibold mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[14px] text-plum-muted hover:text-plum transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[13px] text-stone">
            © {year} Christian Chapter Ltd. All prices include VAT where applicable.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-[13px] text-stone hover:text-plum transition-colors">
              Privacy policy
            </a>
            <a href="/terms" className="text-[13px] text-stone hover:text-plum transition-colors">
              Terms of use
            </a>
            <a href="/cookies" className="text-[13px] text-stone hover:text-plum transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
