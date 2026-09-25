"use client";

import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { SurfaceShell } from "./SurfaceShell";

export function MembershipSurface({ onClose }: { onClose: () => void }) {
  return (
    <SurfaceShell eyebrow="The Membership Room" title="Free to begin. Paid tiers when the cohort is ready." onClose={onClose}>
      <p className="text-[15px] text-plum-muted leading-6 mb-4">
        {siteConfig.foundingStage
          ? "The founding cohort is free to join. No card is taken."
          : "Membership follows the published pricing page."}
      </p>
      <ul className="space-y-3 text-[15px] text-plum-muted leading-6 mb-4">
        <li>
          <strong className="text-plum">Member.</strong> Receive and send introductions. The core
          experience, when paid tiers launch.
        </li>
        <li>
          <strong className="text-plum">Plus.</strong> Member benefits with direct team support and
          an extended introduction set.
        </li>
      </ul>
      <p className="text-[14px] text-stone mb-4">
        {siteConfig.pricesPublished
          ? "Prices are listed on the pricing page."
          : "Prices are not published yet. There is no checkout."}{" "}
        {siteConfig.billingLive ? "" : "Billing is not live."}
      </p>
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/register" size="md" variant="primary">
          Create your profile
        </LinkButton>
        <a href="/pricing" className="house-text-link">
          Planned membership
        </a>
      </div>
    </SurfaceShell>
  );
}
