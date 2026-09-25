"use client";

import { LinkButton } from "@/components/ui/button";
import { DEMO_DISCLOSURE, demoIntroduction } from "@/lib/chapter-house/demo-fixture";
import { SurfaceShell } from "./SurfaceShell";

export function TableSurface({
  onClose,
  onOpenDossier,
}: {
  onClose: () => void;
  onOpenDossier: () => void;
}) {
  return (
    <SurfaceShell eyebrow="The Common Table" title="Finite introductions, with a reason." onClose={onClose}>
      <p className="house-disclosure">{DEMO_DISCLOSURE}</p>
      <p className="text-[15px] text-plum-muted leading-6 mb-4">
        When the cohort is ready, you receive a small set of introductions — not a marketplace.
        Each one arrives with plain-language reasons. There is no percentage score.
      </p>
      <article className="house-dossier">
        <p className="font-serif text-[1.35rem] text-plum">
          {demoIntroduction.firstName}, {demoIntroduction.age}
        </p>
        <p className="text-[14px] text-plum-muted mb-3">
          {demoIntroduction.region} · {demoIntroduction.tradition}
        </p>
        <p className="text-[13px] uppercase tracking-[0.12em] text-evergreen mb-3">
          {demoIntroduction.poolLabel} · {demoIntroduction.alignmentText}
        </p>
        <p className="text-[14px] text-plum mb-2">{demoIntroduction.lookingFor}</p>
        <ul className="space-y-1.5 mb-3">
          {demoIntroduction.why.map((reason) => (
            <li key={reason} className="text-[14px] text-plum-muted">
              {reason}
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-stone">{demoIntroduction.worthDiscussing[0]}</p>
      </article>
      <div className="mt-5 flex flex-wrap gap-3">
        <LinkButton href="/register" size="md" variant="primary">
          Create your profile
        </LinkButton>
        <button type="button" className="house-text-link" onClick={onOpenDossier}>
          Read the demonstration
        </button>
      </div>
    </SurfaceShell>
  );
}
