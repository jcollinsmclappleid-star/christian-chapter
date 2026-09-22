type LogoProps = {
  className?: string;
};

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="12" fill="#126B3C" />
      <path
        d="M11 27V14l9 8 9-8v13"
        fill="none"
        stroke="#F3F7F4"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.5 31h15" stroke="#7EB6D4" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: LogoProps) {
  return (
    <a
      href="/"
      className={`flex items-center gap-2.5 min-w-0 group ${className ?? ""}`}
      aria-label="Mature Christian Dating"
    >
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="font-sans font-semibold text-[0.98rem] sm:text-[1.05rem] leading-tight tracking-tight text-plum group-hover:text-life transition-colors">
        Mature Christian Dating
      </span>
    </a>
  );
}
