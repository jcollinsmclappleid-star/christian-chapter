type IconProps = { className?: string };

function frame(children: React.ReactNode, className?: string) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      {children}
    </svg>
  );
}

export function IconFaith({ className }: IconProps) {
  return frame(
    <path d="M16 6v20M10.5 12h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
    className,
  );
}

export function IconOlive({ className }: IconProps) {
  return frame(
    <>
      <path d="M16 26V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M16 16c-4.2-.6-6.5-3.4-6.5-6.6 3.2.2 5.8 2.2 6.5 6.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 18.5c4.2-.6 6.5-3.4 6.5-6.6-3.2.2-5.8 2.2-6.5 6.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </>,
    className,
  );
}

export function IconCovenant({ className }: IconProps) {
  return frame(
    <>
      <circle cx="13" cy="16" r="5.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="19" cy="16" r="5.2" stroke="currentColor" strokeWidth="1.7" />
    </>,
    className,
  );
}

export function IconLamp({ className }: IconProps) {
  return frame(
    <>
      <path
        d="M12 14h8l-1.2 5.2a3.2 3.2 0 0 1-5.6 0L12 14Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M16 8v4M16 22v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>,
    className,
  );
}
