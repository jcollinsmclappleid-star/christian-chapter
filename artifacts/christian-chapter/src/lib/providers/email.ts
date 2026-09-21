import { sendServiceEmail } from "@/lib/email";
import { result, resolveRequestedState, type ProviderResult, type RequestedState } from "./types";
import { allowSandboxAdapters } from "@/lib/platform/runtime";

export async function sendTransactionalEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult<{ delivered: boolean }>> {
  const requested = resolveRequestedState(opts.requestedState, "pass");
  if (requested === "unavailable") {
    return result("email.dev", "unavailable", "Email provider marked unavailable.");
  }
  if (requested === "fail") {
    return result("email.dev", "fail", "Forced email failure for testing.");
  }
  if (requested === "pending") {
    return result("email.dev", "pending", "Email queued, not yet accepted by provider.");
  }

  const sent = await sendServiceEmail({
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  if (!sent.ok) {
    return result("email.resend", "fail", sent.error);
  }
  const adapter = sent.delivered ? "email.resend" : "email.dev";
  return {
    ok: true,
    state: "pass",
    sandbox: !sent.delivered || allowSandboxAdapters(),
    adapter,
    message: sent.delivered
      ? "Email accepted by provider."
      : "Development capture: email not sent. Link/log only.",
    data: { delivered: sent.delivered },
  };
}
