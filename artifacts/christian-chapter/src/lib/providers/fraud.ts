import { result, resolveRequestedState, sandboxOrThrow, type ProviderResult, type RequestedState } from "./types";

export async function classifyMessageRisk(opts: {
  text: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult<{ signals: string[] }>> {
  sandboxOrThrow("fraud.dev");
  const state = resolveRequestedState(opts.requestedState);
  const lower = opts.text.toLowerCase();
  const signals: string[] = [];
  if (/(bitcoin|crypto|gift card|western union|urgent money)/i.test(lower)) {
    signals.push("money_or_crypto");
  }
  if (/(whatsapp|telegram|off.?platform)/i.test(lower)) {
    signals.push("rapid_off_platform");
  }
  const next = signals.length && state === "pass" ? "fail" : state;
  return result(
    "fraud.dev",
    next,
    next === "fail"
      ? "Development risk signals fired. Not a production classifier."
      : "Development scan complete.",
    { signals },
  );
}
