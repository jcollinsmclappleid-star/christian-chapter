type LogoProps = {
  className?: string;
};

/** Oxblood seal, ivory chapter initial, brass rule. Text stays in HTML so it stays sharp. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="10" fill="#8B1F2F" />
      <path
        d="M27.2 14.2a8.4 8.4 0 1 0 0 11.6"
        fill="none"
        stroke="#F7F3EC"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M13.2 20h9.2" stroke="#C4A05A" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: LogoProps) {
  return (
    <a
      href="/"
      className={`flex items-center gap-2.5 min-w-0 group ${className ?? ""}`}
      aria-label="Christian Chapter, mature Christian dating"
    >
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none min-w-0">
        <span className="font-serif text-[1.05rem] sm:text-[1.15rem] tracking-tight text-plum group-hover:text-oxblood transition-colors truncate">
          Christian Chapter
        </span>
        <span className="text-[10px] tracking-[0.14em] uppercase text-stone font-sans mt-1">
          Mature Christian dating
        </span>
      </span>
    </a>
  );
}
