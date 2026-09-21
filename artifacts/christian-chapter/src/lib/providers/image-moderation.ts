import { result, resolveRequestedState, sandboxOrThrow, type ProviderResult, type RequestedState } from "./types";

export async function moderateImage(opts: {
  objectKey: string;
  requestedState?: RequestedState;
}): Promise<ProviderResult<{ labels: string[] }>> {
  sandboxOrThrow("image_moderation.dev");
  const state = resolveRequestedState(opts.requestedState, "pass");
  if (state === "fail") {
    return result("image_moderation.dev", "fail", "Development classifier flagged this file.", {
      labels: ["sandbox_flag"],
    });
  }
  if (state !== "pass") {
    return result("image_moderation.dev", state, "Image moderation not complete.", { labels: [] });
  }
  return result("image_moderation.dev", "pass", "Development image scan clear. Not a production classifier.", {
    labels: ["sandbox_clear"],
  });
}
