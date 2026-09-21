import { useEffect, useRef } from "react";
import type { Dispatch } from "react";
import type { HouseMode, HouseView } from "./houseContent";
import { isHouseMode, type HouseAction, type HouseState } from "./houseState";

const VIEWS = new Set<NonNullable<HouseView>>(["dossier", "preview", "essentials", "privacy", "plans"]);

export function readHouseUrl(search = typeof window === "undefined" ? "" : window.location.search): {
  mode: HouseMode;
  view: HouseView;
} {
  const params = new URLSearchParams(search);
  const rawMode = params.get("house");
  const rawView = params.get("view");
  return {
    mode: isHouseMode(rawMode) ? rawMode : "welcome",
    view: rawView && VIEWS.has(rawView as NonNullable<HouseView>) ? (rawView as HouseView) : null,
  };
}

function serialize(state: HouseState): string {
  return `${state.mode}|${state.view ?? ""}`;
}

export function houseUrlFromState(state: HouseState, href = "http://localhost/"): string {
  const url = new URL(href);
  if (state.mode === "welcome") url.searchParams.delete("house");
  else url.searchParams.set("house", state.mode);
  if (state.view) url.searchParams.set("view", state.view);
  else url.searchParams.delete("view");
  return `${url.pathname}${url.search}`;
}

export function useHouseUrlState(state: HouseState, dispatch: Dispatch<HouseAction>): void {
  const restoringRef = useRef(false);
  const previousRef = useRef(serialize(state));

  useEffect(() => {
    const restore = () => {
      restoringRef.current = true;
      const next = readHouseUrl();
      dispatch({ type: "SELECT_MODE", mode: next.mode });
      if (next.view) dispatch({ type: "OPEN_VIEW", view: next.view });
      queueMicrotask(() => {
        restoringRef.current = false;
      });
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [dispatch]);

  useEffect(() => {
    if (restoringRef.current) return;
    const next = serialize(state);
    if (previousRef.current === next) return;
    const path = houseUrlFromState(state, window.location.href);
    window.history.pushState({ house: state.mode, view: state.view }, "", path);
    previousRef.current = next;
  }, [state]);
}
