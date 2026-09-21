import { result, resolveRequestedState, sandboxOrThrow, type ProviderResult, type RequestedState } from "./types";

export async function runSelfieCheck(opts: {
  userId: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult<{ sessionId: string }>> {
  sandboxOrThrow("identity.dev");
  const state = resolveRequestedState(opts.requestedState, "pass");
  const sessionId = `selfie_${opts.userId.slice(0, 8)}`;
  if (state !== "pass") {
    return result("identity.dev", state, "Development selfie/liveness did not pass.", { sessionId });
  }
  return result(
    "identity.dev",
    "pass",
    "Development selfie check recorded. This is not a genuine liveness or identity verification.",
    { sessionId },
  );
}

export async function runPhotoMatch(opts: {
  userId: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult> {
  sandboxOrThrow("identity.dev");
  const state = resolveRequestedState(opts.requestedState, "pass");
  return result(
    "identity.dev",
    state,
    state === "pass"
      ? "Development photo-match recorded. Not a production face-match."
      : "Development photo-match did not pass.",
  );
}
