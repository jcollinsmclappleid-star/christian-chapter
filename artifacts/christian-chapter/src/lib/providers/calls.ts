import { result, resolveRequestedState, sandboxOrThrow, type ProviderResult, type RequestedState } from "./types";

export async function startPrivateCall(opts: {
  conversationId: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult<{ callId: string }>> {
  sandboxOrThrow("calls.dev");
  const state = resolveRequestedState(opts.requestedState, "pass");
  const callId = `call_dev_${opts.conversationId.slice(0, 8)}`;
  if (state !== "pass") {
    return result("calls.dev", state, "Development call did not start.", { callId });
  }
  return result(
    "calls.dev",
    "pass",
    "Development call session created. Numbers are not shared. Not a live telephony provider.",
    { callId },
  );
}
