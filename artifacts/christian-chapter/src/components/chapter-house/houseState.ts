import { HOUSE_MODES, type HouseCapability, type HouseMode, type HouseView } from "./houseContent";

export type HousePhase = "overview" | "destination" | "surface";

export type HouseState = {
  phase: HousePhase;
  mode: HouseMode;
  view: HouseView;
  visited: HouseMode[];
  capability: HouseCapability;
  surfaceOpen: boolean;
};

export type HouseAction =
  | { type: "SELECT_MODE"; mode: HouseMode }
  | { type: "OPEN_VIEW"; view: NonNullable<HouseView> }
  | { type: "CLOSE_SURFACE" }
  | { type: "SET_CAPABILITY"; capability: HouseCapability }
  | { type: "RESTORE"; state: Partial<HouseState> };

export const INITIAL_HOUSE_STATE: HouseState = {
  phase: "overview",
  mode: "welcome",
  view: null,
  visited: ["welcome"],
  capability: "C",
  surfaceOpen: false,
};

export function isHouseMode(value: string | null): value is HouseMode {
  return Boolean(value && (HOUSE_MODES as string[]).includes(value));
}

export function houseReducer(state: HouseState, action: HouseAction): HouseState {
  switch (action.type) {
    case "SELECT_MODE": {
      const destination = action.mode !== "welcome";
      return {
        ...state,
        mode: action.mode,
        phase: destination ? "destination" : "overview",
        view: null,
        surfaceOpen: destination,
        visited: state.visited.includes(action.mode) ? state.visited : [...state.visited, action.mode],
      };
    }
    case "OPEN_VIEW":
      return { ...state, view: action.view, phase: "surface", surfaceOpen: true };
    case "CLOSE_SURFACE":
      return {
        ...state,
        view: null,
        surfaceOpen: false,
        phase: state.mode === "welcome" ? "overview" : "destination",
      };
    case "SET_CAPABILITY":
      return { ...state, capability: action.capability };
    case "RESTORE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

export function worldShouldPause(state: HouseState): boolean {
  return state.surfaceOpen || state.phase === "surface";
}
