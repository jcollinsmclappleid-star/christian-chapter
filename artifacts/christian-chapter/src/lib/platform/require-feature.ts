import { NextResponse } from "next/server";
import { isFeatureEnabled, type FeatureKey } from "./features";

export function featureDenied(key: FeatureKey): string | null {
  if (isFeatureEnabled(key)) return null;
  return `${key} is not enabled in this runtime.`;
}

export function featureGate(key: FeatureKey) {
  const denied = featureDenied(key);
  if (!denied) return null;
  return NextResponse.json({ error: denied }, { status: 403 });
}
