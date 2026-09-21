import { useEffect, useState } from "react";
import type { HouseCapability } from "./houseContent";

export type HouseCapabilityState = {
  tier: HouseCapability;
  reducedMotion: boolean;
  dataSaver: boolean;
  mobile: boolean;
  webgl: boolean;
};

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function getWebGLContext(strict = false): WebGLRenderingContext | WebGL2RenderingContext | null {
  try {
    const canvas = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: strict };
    return (
      canvas.getContext("webgl2", options) ||
      canvas.getContext("webgl", options) ||
      (canvas.getContext("experimental-webgl", options) as WebGLRenderingContext | null)
    );
  } catch {
    return null;
  }
}

export function detectHouseCapabilities(
  search = typeof window === "undefined" ? "" : window.location.search,
): HouseCapabilityState {
  if (typeof window === "undefined") {
    return { tier: "C", reducedMotion: false, dataSaver: false, mobile: false, webgl: false };
  }

  const params = new URLSearchParams(search);
  const forceStatic = params.get("houseTier") === "static";
  const force3d = params.get("houseTier") === "3d";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  const dataSaver = Boolean(connection?.saveData || connection?.effectiveType === "2g");
  const cleanContext = !forceStatic && Boolean(getWebGLContext(true));
  const webgl = !forceStatic && (cleanContext || Boolean(getWebGLContext(false)));

  if (forceStatic || (!force3d && dataSaver) || !webgl) {
    return { tier: "C", reducedMotion, dataSaver, mobile, webgl };
  }
  if (force3d || reducedMotion || !cleanContext) {
    return { tier: mobile || reducedMotion ? "B" : "A", reducedMotion, dataSaver, mobile, webgl };
  }
  const lowerPower = mobile || (navigator.hardwareConcurrency ?? 8) <= 4;
  return { tier: lowerPower ? "B" : "A", reducedMotion, dataSaver, mobile, webgl };
}

export function useHouseCapabilities(): HouseCapabilityState {
  const [capabilities, setCapabilities] = useState<HouseCapabilityState>(() => ({
    tier: "C",
    reducedMotion: false,
    dataSaver: false,
    mobile: false,
    webgl: false,
  }));

  useEffect(() => {
    const update = () => setCapabilities(detectHouseCapabilities());
    update();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    motion.addEventListener("change", update);
    viewport.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      motion.removeEventListener("change", update);
      viewport.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return capabilities;
}
