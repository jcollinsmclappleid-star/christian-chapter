#!/usr/bin/env node
/**
 * HTTP smoke for member journey (requires `pnpm dev` on BASE_URL).
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const MAN_EMAIL = process.env.JOURNEY_MAN ?? "syn-001-40s-en@synthetic.christianchapter.invalid";
const FETCH_TIMEOUT_MS = 15_000;

async function fetchWithTimeout(url, init) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

const steps = [];
function pass(name, ok, detail) {
  steps.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function json(path, init) {
  const res = await fetchWithTimeout(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

const jar = {};
function storeCookies(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const line of raw) {
    const [pair] = line.split(";");
    const [name, value] = pair.split("=");
    if (name && value) jar[name.trim()] = value.trim();
  }
}
function cookieHeader() {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

try {
  const health = await fetchWithTimeout(`${BASE}/`);
  pass("dev server reachable", health.ok, String(health.status));

  const signIn = await json("/api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({ email: MAN_EMAIL }),
  });
  pass("magic link issued", signIn.res.ok && signIn.body.devLink, signIn.body.devLink ? "devLink" : signIn.body.message);

  if (!signIn.body.devLink) {
    console.error("No devLink — start dev with NODE_ENV=development and without Resend delivery.");
    process.exit(1);
  }

  const verifyUrl = new URL(signIn.body.devLink);
  const verify = await fetchWithTimeout(verifyUrl.toString(), { redirect: "manual" });
  storeCookies(verify);
  pass("verify sets session cookie", verify.status >= 300 && verify.status < 400 && Boolean(jar.cc_member));

  const me = await fetchWithTimeout(`${BASE}/api/auth/me`, { headers: { Cookie: cookieHeader() } });
  const meBody = await me.json();
  pass("auth/me", me.ok && meBody.user?.email === MAN_EMAIL, meBody.user?.email);

  const intros = await fetchWithTimeout(`${BASE}/api/introductions`, { headers: { Cookie: cookieHeader() } });
  const introBody = await intros.json();
  pass("introductions list", intros.ok && introBody.introductions?.length > 0, `count=${introBody.introductions?.length ?? 0}`);

  const introId = introBody.introductions?.[0]?.id;
  let conversationId = null;
  if (introId) {
    const detail = await fetchWithTimeout(`${BASE}/api/introductions/${introId}`, { headers: { Cookie: cookieHeader() } });
    const detailBody = await detail.json();
    conversationId = detailBody.conversationId;
    pass("introduction detail + conversationId", detail.ok && Boolean(conversationId));
  }

  if (conversationId) {
    const msg = await json(`/api/conversations/${conversationId}`, {
      method: "POST",
      headers: { Cookie: cookieHeader() },
      body: JSON.stringify({ body: "Thank you — good to be connected." }),
    });
    pass("send message", msg.res.ok, String(msg.res.status));

    const thread = await fetchWithTimeout(`${BASE}/api/conversations/${conversationId}`, {
      headers: { Cookie: cookieHeader() },
    });
    const threadBody = await thread.json();
    pass("read thread", thread.ok && threadBody.messages?.length > 0, `messages=${threadBody.messages?.length ?? 0}`);
  }

  const account = await fetchWithTimeout(`${BASE}/api/account`, { headers: { Cookie: cookieHeader() } });
  pass("account api", account.ok, String(account.status));

  if (steps.some((s) => !s.ok)) {
    console.error("\nHTTP journey smoke failed.");
    process.exit(1);
  }
  console.log("\nHTTP journey smoke passed.");
} catch (err) {
  console.error(err);
  process.exit(1);
}
