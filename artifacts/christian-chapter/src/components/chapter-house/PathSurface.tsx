"use client";

import { LinkButton } from "@/components/ui/button";
import { DEMO_DISCLOSURE, demoEssentials } from "@/lib/chapter-house/demo-fixture";
import { SurfaceShell } from "./SurfaceShell";

const tiers = [
  { name: "Essential", detail: "A firm boundary. We never silently relax it." },
  { name: "Preferred", detail: "Shapes the quality of an introduction." },
  { name: "Open-minded", detail: "Worth discussing. It will not reduce recommendations." },
];

const pools = [
  { name: "Nearby", detail: "Practical to meet without long travel." },
  { name: "Worth the journey", detail: "Some travel, if the rest of the match is strong." },
  { name: "Open to distance", detail: "You are willing to consider a longer journey." },
];

export function PathSurface({ onClose }: { onClose: () => void }) {
  return (
    <SurfaceShell eyebrow="The Garden Path" title="Essentials and distance you control." onClose={onClose}>
      <p className="text-[15px] text-plum-muted leading-6 mb-4">
        You set what matters. We do not publish exact miles or live candidate counts.
      </p>
      <h3 className="font-sans text-[13px] uppercase tracking-[0.12em] text-evergreen mb-2">Tiers</h3>
      <ul className="space-y-2 mb-4">
        {tiers.map((tier) => (
          <li key={tier.name}>
            <strong className="text-plum">{tier.name}.</strong>{" "}
            <span className="text-plum-muted">{tier.detail}</span>
          </li>
        ))}
      </ul>
      <h3 className="font-sans text-[13px] uppercase tracking-[0.12em] text-evergreen mb-2">Distance pools</h3>
      <ul className="space-y-2 mb-4">
        {pools.map((pool) => (
          <li key={pool.name}>
            <strong className="text-plum">{pool.name}.</strong>{" "}
            <span className="text-plum-muted">{pool.detail}</span>
          </li>
        ))}
      </ul>
      <p className="house-disclosure">{DEMO_DISCLOSURE}</p>
      <ul className="text-[14px] text-plum-muted mb-4">
        {demoEssentials.map((item) => (
          <li key={item.factor}>
            {item.label} — {item.tier}
          </li>
        ))}
      </ul>
      <LinkButton href="/register" size="md" variant="primary">
        Begin your chapter
      </LinkButton>
    </SurfaceShell>
  );
}
