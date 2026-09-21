import { allowSandboxAdapters } from "@/lib/platform/runtime";

export type AdapterState = "pass" | "fail" | "pending" | "unavailable";

export type ProviderResult<T = Record<string, unknown>> = {
  ok: boolean;
  state: AdapterState;
  sandbox: boolean;
  adapter: string;
  message: string;
  data?: T;
};

export type RequestedState = AdapterState | undefined;

export function resolveRequestedState(
  requested: RequestedState,
  fallback: AdapterState = "pass",
): AdapterState {
  if (requested === "pass" || requested === "fail" || requested === "pending" || requested === "unavailable") {
    return requested;
  }
  return fallback;
}

export function sandboxOrThrow(adapter: string) {
  if (!allowSandboxAdapters()) {
    throw new Error(`${adapter} sandbox adapter cannot run in public production.`);
  }
}

export function result<T>(
  adapter: string,
  state: AdapterState,
  message: string,
  data?: T,
): ProviderResult<T> {
  return {
    ok: state === "pass" || state === "pending",
    state,
    sandbox: true,
    adapter,
    message,
    data,
  };
}
