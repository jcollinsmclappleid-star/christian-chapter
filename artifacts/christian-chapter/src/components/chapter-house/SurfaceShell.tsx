"use client";

import type { ReactNode } from "react";

export function SurfaceShell({
  eyebrow,
  title,
  children,
  onClose,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <section className="house-surface" role="dialog" aria-modal="true" aria-labelledby="house-surface-title">
      <div className="house-surface-header">
        <div>
          <p className="house-disclosure">{eyebrow}</p>
          <h2 id="house-surface-title" tabIndex={-1} className="font-serif text-[1.7rem] text-plum leading-tight">
            {title}
          </h2>
        </div>
        <button type="button" className="house-surface-close" onClick={onClose} aria-label="Return to Christian Chapter">
          Close
        </button>
      </div>
      <div className="house-surface-body">{children}</div>
    </section>
  );
}
