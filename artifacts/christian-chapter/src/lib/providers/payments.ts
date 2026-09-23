import { result, resolveRequestedState, sandboxOrThrow, type ProviderResult, type RequestedState } from "./types";

export async function createCheckoutSession(opts: {
  userId: string;
  plan: "member" | "incognito" | "plus";
  requestedState?: RequestedState;
}): Promise<ProviderResult<{ sessionId: string; entitlement: string }>> {
  sandboxOrThrow("payments.dev");
  const state = resolveRequestedState(opts.requestedState, "pass");
  const sessionId = `cs_dev_${opts.plan}_${opts.userId.slice(0, 8)}`;
  if (state !== "pass") {
    return result("payments.dev", state, "Development checkout did not complete.", {
      sessionId,
      entitlement: "free",
    });
  }
  return result(
    "payments.dev",
    "pass",
    "Development entitlement granted. Not a real payment. Public checkout remains disabled in production flags.",
    { sessionId, entitlement: opts.plan },
  );
}
