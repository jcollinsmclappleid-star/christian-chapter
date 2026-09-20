"use client";

import { useRouter, usePathname } from "next/navigation";
import { UK_REGIONS, TRADITIONS } from "@/app/register/_components/wizard-types";

// Must match the exact values stored by step-3-about.tsx
const GENDERS = ["Man", "Woman", "Non-binary", "Prefer not to say"];
const AGE_BANDS = ["40s", "50s", "60s", "70+"];

interface FilterBarProps {
  gender: string;
  ageBand: string;
  region: string;
  tradition: string;
  status: string;
}

export function FilterBar({ gender, ageBand, region, tradition, status }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(key: string, value: string) {
    const params = new URLSearchParams();
    const current = { gender, ageBand, region, tradition, status };
    const next = { ...current, [key]: value, page: "1" };
    for (const [k, v] of Object.entries(next)) {
      if (v && v !== "all" && v !== "") params.set(k, v);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = gender || ageBand || region || tradition;

  function clearFilters() {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectClass =
    "min-h-[38px] px-3 bg-ivory border border-border rounded-md text-[13px] font-sans text-plum focus:outline-none focus:ring-2 focus:ring-plum appearance-none pr-7";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <span className="text-[11px] uppercase tracking-[0.18em] text-stone font-sans flex-shrink-0">
        Filter:
      </span>

      <div className="relative">
        <select
          value={gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          className={selectClass}
        >
          <option value="">All genders</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone text-[10px]">▾</span>
      </div>

      <div className="relative">
        <select
          value={ageBand}
          onChange={(e) => handleChange("ageBand", e.target.value)}
          className={selectClass}
        >
          <option value="">All ages</option>
          {AGE_BANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone text-[10px]">▾</span>
      </div>

      <div className="relative">
        <select
          value={region}
          onChange={(e) => handleChange("region", e.target.value)}
          className={selectClass}
        >
          <option value="">All regions</option>
          {UK_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone text-[10px]">▾</span>
      </div>

      <div className="relative">
        <select
          value={tradition}
          onChange={(e) => handleChange("tradition", e.target.value)}
          className={selectClass}
        >
          <option value="">All traditions</option>
          {TRADITIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone text-[10px]">▾</span>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-[12px] text-stone underline underline-offset-2 hover:text-plum transition-colors font-sans"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
