export type RuntimeEnv = "local" | "test" | "staging" | "production";

export function currentRuntime(): RuntimeEnv {
  const explicit = (process.env.CC_RUNTIME ?? "").trim().toLowerCase();
  if (
    explicit === "local" ||
    explicit === "test" ||
    explicit === "staging" ||
    explicit === "production"
  ) {
    return explicit;
  }
  if (process.env.NODE_ENV === "test") return "test";
  if (process.env.NODE_ENV === "production") return "production";
  return "local";
}

export function isPublicProduction(): boolean {
  return currentRuntime() === "production";
}

/** Development adapters and synthetic data are forbidden in public production. */
export function allowSandboxAdapters(): boolean {
  return !isPublicProduction();
}
