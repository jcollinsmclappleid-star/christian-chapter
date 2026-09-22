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

export function IconLeave({ className }: IconProps) {
  return frame(
    <>
      <path d="M13 8h7.5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H13" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M16 16h9M21.5 12.5 25 16l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    className,
  );
}

export function IconEye({ className }: IconProps) {
  return frame(
    <>
      <path d="M5.5 16S9.5 9.5 16 9.5 26.5 16 26.5 16 22.5 22.5 16 22.5 5.5 16 5.5 16Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </>,
    className,
  );
}

export function IconPause({ className }: IconProps) {
  return frame(
    <>
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M13 12v8M19 12v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>,
    className,
  );
}

export function IconBlock({ className }: IconProps) {
  return frame(
    <>
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 22 22 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
