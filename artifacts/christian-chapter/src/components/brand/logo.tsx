type LogoProps = {
  className?: string;
  tone?: "dark" | "light";
};

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="12" fill="#0F3F96" />
      <rect x="1.35" y="1.35" width="37.3" height="37.3" rx="10.7" fill="none" stroke="#E7F0FA" strokeWidth="1.35" />
      <path d="M14 30.2c6.4-3.4 9.6-9.6 9.5-16.6" fill="none" stroke="#FFFFFF" strokeWidth="1.85" strokeLinecap="round" />
      <path d="M22.6 16.6c-5.8.15-9-2.55-9.6-6.7 4.6.55 7.7 2.9 9.6 6.7Z" fill="#F7FAFE" />
      <path d="M23.6 13.4c5.4-.35 8.5-3.15 8.6-6.8-4.35.45-7.25 2.7-8.6 6.8Z" fill="#D5E4F6" />
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
      <span className={`min-w-0 leading-[1.05] tracking-tight transition-colors ${wordmark}`}>
        <span className="block font-sans text-[10px] font-medium uppercase tracking-[0.16em] opacity-80">Mature</span>
        <span className="block font-sans text-[15px] font-semibold tracking-[-0.02em] sm:text-[16px]">Christian Dating</span>
      </span>
    </a>
  );
}
