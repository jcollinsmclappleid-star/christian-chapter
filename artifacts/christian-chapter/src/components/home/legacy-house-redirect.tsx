"use client";

import { useEffect } from "react";
import { legacyHouseTarget } from "@/lib/home/legacy-house";

/** Strip retired ?house= links and move the visitor to the written explanation. */
export function LegacyHouseRedirect() {
  useEffect(() => {
    const target = legacyHouseTarget(window.location.search);
    if (target === null) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("house");
    url.searchParams.delete("houseTier");
    url.searchParams.delete("view");
    const next = `${url.pathname}${url.search}${target}`;
    window.history.replaceState(null, "", next);
    if (target === "#how-it-works") {
      document.getElementById("how-it-works")?.scrollIntoView();
    }
  }, []);

  return null;
}
