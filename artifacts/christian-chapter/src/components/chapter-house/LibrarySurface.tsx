"use client";

import { LinkButton } from "@/components/ui/button";
import { DEMO_DISCLOSURE, demoChapters } from "@/lib/chapter-house/demo-fixture";
import { SurfaceShell } from "./SurfaceShell";

export function LibrarySurface({ onClose }: { onClose: () => void }) {
  return (
    <SurfaceShell eyebrow="The Library" title="A life told in chapters, not badges." onClose={onClose}>
      <p className="house-disclosure">{DEMO_DISCLOSURE}</p>
      <p className="text-[15px] text-plum-muted leading-6 mb-4">
        Five chapter headings. This is how another member would see a profile — using the same
        preview used in the product, shown here with a labelled demonstration only.
      </p>
      <ol className="space-y-3 mb-5">
        {demoChapters.map((chapter) => (
          <li key={chapter.id}>
            <h3 className="font-sans text-[15px] font-semibold text-plum">{chapter.title}</h3>
            <p className="text-[15px] text-plum-muted leading-6">{chapter.body}</p>
          </li>
        ))}
      </ol>
      <p className="text-[13px] text-stone mb-4">
        This is how another member would see your profile before a match. It is not a live member.
      </p>
      <LinkButton href="/register" size="md" variant="primary">
        Create your profile
      </LinkButton>
    </SurfaceShell>
  );
}
