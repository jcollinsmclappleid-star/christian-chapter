"use client";

import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { SurfaceShell } from "./SurfaceShell";

export function CourtyardSurface({ onClose }: { onClose: () => void }) {
  return (
    <SurfaceShell eyebrow="The Gathering Courtyard" title="Support for meeting well — when it is ready." onClose={onClose}>
      <p className="text-[15px] text-plum-muted leading-6 mb-4">
        Events and personal matchmaking are upcoming. They are not offered as a live service today.
      </p>
      <ul className="space-y-3 text-[15px] text-plum-muted leading-6 mb-4">
        <li>
          <strong className="text-plum">Gatherings.</strong> Planned, not scheduled. We will not
          invent dates or guest lists.
        </li>
        <li>
          <strong className="text-plum">Human matchmaking.</strong> A later offering for members who
          want more help. It is not running in this founding phase.
        </li>
        <li>
          <strong className="text-plum">Introductions.</strong>{" "}
          {siteConfig.memberMatchingLive
            ? "Matching is available to members."
            : "Member matching is not live in production. The table shows how an introduction is designed to read."}
        </li>
      </ul>
      <LinkButton href="/register" size="md" variant="primary">
        Create your profile
      </LinkButton>
    </SurfaceShell>
  );
}
