import { siteConfig } from "./site-config";

export type SendEmailResult =
  | { ok: true; delivered: boolean; devLink?: string }
  | { ok: false; error: string };

export async function sendServiceEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendEmailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return {
      ok: true,
      delivered: false,
    };
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || "hello@christianchapter.co.uk";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${siteConfig.brandName} <${fromEmail}>`,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[email] Resend error", res.status, body);
      return { ok: false, error: `Email provider returned ${res.status}.` };
    }
    return { ok: true, delivered: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: "Email could not be sent." };
  }
}

export function magicLinkEmailHtml(opts: {
  firstName?: string;
  action: "verify" | "sign_in";
  url: string;
}): string {
  const heading =
    opts.action === "verify"
      ? "Confirm your email"
      : "Sign in to Christian Chapter";
  const intro =
    opts.action === "verify"
      ? "Use this link to confirm the email address on your founding application. It expires in 30 minutes and can be used once."
      : "Use this link to return to your founding application. It expires in 30 minutes and can be used once.";
  const greeting = opts.firstName ? `Hello ${opts.firstName}.` : "Hello.";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${heading}</title></head>
<body style="font-family:Georgia,serif;background:#F7F3EC;color:#1E1220;margin:0;padding:40px 20px">
  <div style="max-width:560px;margin:0 auto;padding:40px 32px;border:1px solid rgba(30,18,32,0.10)">
    <p style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#8B1F2F;margin:0 0 16px">Christian Chapter</p>
    <h1 style="font-size:26px;line-height:1.2;margin:0 0 16px">${heading}</h1>
    <p style="font-size:17px;line-height:1.7;color:#6B5878">${greeting}</p>
    <p style="font-size:17px;line-height:1.7;color:#6B5878">${intro}</p>
    <p style="margin:28px 0"><a href="${opts.url}" style="display:inline-block;background:#8B1F2F;color:#F7F3EC;text-decoration:none;padding:14px 22px;border-radius:8px;font-family:system-ui,sans-serif;font-size:15px">Continue</a></p>
    <p style="font-size:13px;line-height:1.6;color:#9A8E9A">If you did not request this, you can ignore the message. Service emails are sent even if you opted out of news.</p>
  </div>
</body>
</html>`;
}
