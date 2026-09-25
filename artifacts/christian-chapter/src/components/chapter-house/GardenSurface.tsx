"use client";

import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { SurfaceShell } from "./SurfaceShell";

export function GardenSurface({ onClose }: { onClose: () => void }) {
  return (
    <SurfaceShell eyebrow="The Sheltered Garden" title="Seen by the right people, on your terms." onClose={onClose}>
      <ul className="space-y-3 text-[15px] text-plum-muted leading-6 mb-4">
        <li>
          <strong className="text-plum">Visibility.</strong> You choose what another member sees
          before a match, and what a mutual match may see.
        </li>
        <li>
          <strong className="text-plum">Pause or hide.</strong> Taking a break hides you from new
          introductions. Conversations stay until you return.
        </li>
        <li>
          <strong className="text-plum">Block and report.</strong> You can block another person and
          report concern. Safety copy lives on{" "}
          <a href="/safety" className="underline underline-offset-4">
            Safety
          </a>
          .
        </li>
        <li>
          <strong className="text-plum">Consent.</strong> Faith answers are special-category data,
          collected only after a separate checkbox. You can withdraw that consent from your account.
        </li>
      </ul>
      <p className="text-[14px] text-stone mb-4">
        {siteConfig.verificationLive
          ? "Verification is available for members who choose it. It is not proof of faith or character."
          : "Verification is design-intent and sandbox only. It is not live, and it is never proof of faith or character."}
      </p>
      <div className="flex flex-wrap gap-4 text-[14px] mb-5">
        <a href="/privacy" className="underline underline-offset-4 text-plum-muted">
          Privacy
        </a>
        <a href="/terms" className="underline underline-offset-4 text-plum-muted">
          Terms
        </a>
        <a href="/safety" className="underline underline-offset-4 text-plum-muted">
          Safety
        </a>
      </div>
      <LinkButton href="/register" size="md" variant="primary">
        Create your profile
      </LinkButton>
    </SurfaceShell>
  );
}
