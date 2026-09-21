import { result, resolveRequestedState, sandboxOrThrow, type ProviderResult, type RequestedState } from "./types";

export async function sendSmsCode(opts: {
  userId: string;
  msisdn: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult<{ challengeId: string }>> {
  sandboxOrThrow("sms.dev");
  const state = resolveRequestedState(opts.requestedState, "pass");
  const challengeId = `sms_${opts.userId.slice(0, 8)}_${Date.now()}`;
  if (state === "unavailable") {
    return result("sms.dev", "unavailable", "SMS provider unavailable in this environment.");
  }
  if (state === "fail") {
    return result("sms.dev", "fail", "Development SMS send failed.");
  }
  if (state === "pending") {
    return result("sms.dev", "pending", "SMS queued. Code not issued yet.", { challengeId });
  }
  return result("sms.dev", "pass", "Development SMS code 246810 issued. Not a real mobile check.", {
    challengeId,
  });
}

export async function verifySmsCode(opts: {
  challengeId: string;
  code: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult> {
  sandboxOrThrow("sms.dev");
  const state = resolveRequestedState(opts.requestedState, opts.code === "246810" ? "pass" : "fail");
  if (state !== "pass") {
    return result("sms.dev", state, "Development SMS verification did not pass.");
  }
  return result("sms.dev", "pass", "Development mobile verification recorded. Sandbox only.");
}
