"use client";

import { lazy, Suspense, useEffect, useReducer, useRef, type ReactNode } from "react";
import { HOUSE_DESTINATIONS, destinationById } from "./houseContent";
import { INITIAL_HOUSE_STATE, houseReducer, worldShouldPause } from "./houseState";
import { useHouseCapabilities } from "./useHouseCapabilities";
import { useHouseUrlState } from "./useHouseUrlState";
import { ChapterHousePoster } from "./ChapterHousePoster";
import { HouseCanvasBoundary } from "./HouseCanvasBoundary";
import { TableSurface } from "./TableSurface";
import { LibrarySurface } from "./LibrarySurface";
import { PathSurface } from "./PathSurface";
import { GardenSurface } from "./GardenSurface";
import { CourtyardSurface } from "./CourtyardSurface";
import { MembershipSurface } from "./MembershipSurface";
import "./chapter-house.css";

const ChapterHouseCanvas = lazy(() => import("./ChapterHouseCanvas"));

function DestinationLabels({
  mode,
  visited,
  onSelect,
}: {
  mode: string;
  visited: string[];
  onSelect: (id: (typeof HOUSE_DESTINATIONS)[number]["id"]) => void;
}) {
  return (
    <div className="house-destination-labels" aria-label="Chapter House destinations">
      {HOUSE_DESTINATIONS.map((destination) => {
        const selected = mode === destination.id;
        const seen = visited.includes(destination.id);
        return (
          <button
            key={destination.id}
            type="button"
            className={`house-world-label house-world-label-${destination.id}${selected ? " is-selected" : ""}`}
            aria-pressed={selected}
            onClick={() => onSelect(destination.id)}
          >
            <small>{seen ? "Visited" : destination.eyebrow}</small>
            <strong>{destination.name}</strong>
            <span>{destination.description}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ChapterHouseExperience({ children }: { children: ReactNode }) {
  const capabilities = useHouseCapabilities();
  const [state, dispatch] = useReducer(houseReducer, INITIAL_HOUSE_STATE);
  const stageRef = useRef<HTMLElement>(null);
  useHouseUrlState(state, dispatch);

  useEffect(() => {
    dispatch({ type: "SET_CAPABILITY", capability: capabilities.tier });
  }, [capabilities.tier]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (state.surfaceOpen) {
        event.preventDefault();
        dispatch({ type: "CLOSE_SURFACE" });
        return;
      }
      if (state.mode === "welcome") return;
      event.preventDefault();
      dispatch({ type: "SELECT_MODE", mode: "welcome" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.mode, state.surfaceOpen]);

  useEffect(() => {
    if (!state.surfaceOpen) return;
    const heading = stageRef.current?.querySelector<HTMLElement>(".house-surface h2");
    heading?.focus();
  }, [state.mode, state.surfaceOpen, state.view]);

  const paused = worldShouldPause(state);
  const destination = destinationById(state.mode);
  const useCanvas = capabilities.tier !== "C";
  const status =
    state.mode === "welcome"
      ? "Chapter House arrival. Begin your chapter is available without the 3D world."
      : `${destination?.eyebrow ?? "Chapter House"} — ${destination?.name ?? state.mode}.`;

  const selectMode = (mode: (typeof HOUSE_DESTINATIONS)[number]["id"] | "welcome") => {
    dispatch({ type: "SELECT_MODE", mode });
  };

  const closeSurface = () => {
    dispatch({ type: "CLOSE_SURFACE" });
  };

  return (
    <section
      ref={stageRef}
      id="chapter-house"
      className={`chapter-house${paused ? " is-world-paused" : ""}`}
      data-tier={capabilities.tier}
      data-house={state.mode}
    >
      <a className="house-skip" href="/register">
        Skip to begin your chapter
      </a>
      <div className="sr-only" aria-live="polite">
        {status}
      </div>

      <div className="house-world-stage">
        <div className="house-world-canvas" aria-hidden="true">
          {useCanvas ? (
            <HouseCanvasBoundary fallback={<ChapterHousePoster state={state} />}>
              <Suspense fallback={<ChapterHousePoster state={state} />}>
                <ChapterHouseCanvas
                  state={state}
                  capability={capabilities.tier}
                  mobile={capabilities.mobile}
                  paused={paused || capabilities.reducedMotion}
                  onSelectMode={selectMode}
                />
              </Suspense>
            </HouseCanvasBoundary>
          ) : (
            <ChapterHousePoster state={state} />
          )}
        </div>

        {children}

        <DestinationLabels mode={state.mode} visited={state.visited} onSelect={selectMode} />

        {state.surfaceOpen && state.mode === "table" ? (
          <TableSurface
            onClose={closeSurface}
            onOpenDossier={() => dispatch({ type: "OPEN_VIEW", view: "dossier" })}
          />
        ) : null}
        {state.surfaceOpen && state.mode === "library" ? <LibrarySurface onClose={closeSurface} /> : null}
        {state.surfaceOpen && state.mode === "path" ? <PathSurface onClose={closeSurface} /> : null}
        {state.surfaceOpen && state.mode === "garden" ? <GardenSurface onClose={closeSurface} /> : null}
        {state.surfaceOpen && state.mode === "courtyard" ? <CourtyardSurface onClose={closeSurface} /> : null}
        {state.surfaceOpen && state.mode === "membership" ? (
          <MembershipSurface onClose={closeSurface} />
        ) : null}
      </div>
    </section>
  );
}
