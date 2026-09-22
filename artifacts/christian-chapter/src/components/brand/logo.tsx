type LogoProps = {
  className?: string;
  tone?: "dark" | "light";
};

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="12" fill="#1927F0" />
      <path d="M21 27c5.4-.2 8-2.2 8-4.6-2.8.2-5.6 1.6-8 4.6Z" fill="#D6DEFF" />
      <path d="M20 8v21" fill="none" stroke="#FFFFFF" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M13 14.5h14" fill="none" stroke="#FFFFFF" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M16 33h8" fill="none" stroke="#E4E9FF" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: LogoProps) {
  const wordmark =
    tone === "light"
      ? "text-paper group-hover:text-glow"
      : "text-plum group-hover:text-life";
  return (
    <a
      href="/"
      className={`flex items-center gap-2.5 min-w-0 group ${className ?? ""}`}
      aria-label="Mature Christian Dating"
    >
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className={`font-sans font-semibold text-[0.98rem] sm:text-[1.05rem] leading-tight tracking-tight transition-colors ${wordmark}`}>
        Mature Christian Dating
      </span>
    </a>
  );
}
