"use client";

import type { StudioProfile } from "@/lib/profile/types";

export function MemberSpace({
  profile,
  canSeeOthers,
}: {
  profile: StudioProfile;
  canSeeOthers: boolean;
}) {
  const suspended = profile.activityState === "taking_a_break" || profile.status === "paused";

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-ivory px-4 py-3">
      <p className="text-[14px] text-plum-muted">
        {suspended ? "Suspended — left out of new introductions." : "This profile is your home here."}
      </p>
      <div className="flex flex-wrap gap-2">
        {canSeeOthers && (
          <a
            href="/profile/views"
            className="inline-flex min-h-[40px] items-center rounded-md border border-border px-3 text-[13px] text-plum"
          >
            Who looked
          </a>
        )}
        <a
          href="/account"
          className="inline-flex min-h-[40px] items-center rounded-md border border-border px-3 text-[13px] text-plum"
        >
          Settings
        </a>
      </div>
    </div>
  );
}
