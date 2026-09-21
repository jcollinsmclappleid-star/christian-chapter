import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Confirm your email",
  path: "/verify",
  noindex: true,
});

const messages: Record<string, string> = {
  missing: "That link is incomplete. Request a new one from sign in.",
  expired: "That link has expired or has already been used. Request a new one.",
  rate: "Too many attempts. Please wait a few minutes and try again.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; token?: string; purpose?: string }>;
}) {
  const params = await searchParams;
  if (params.token) {
    // Browser landed on /verify instead of the API — bounce to the handler.
    const qs = new URLSearchParams();
    qs.set("token", params.token);
    if (params.purpose) qs.set("purpose", params.purpose);
    return (
      <section className="section bg-ivory">
        <div className="mx-auto max-w-lg px-6 text-center">
          <p className="text-[17px] text-plum-muted mb-6">Confirming your email…</p>
          <a href={`/api/auth/verify?${qs.toString()}`} className="underline text-oxblood">
            Continue
          </a>
        </div>
      </section>
    );
  }

  const error = params.error ? messages[params.error] ?? messages.expired : null;

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-lg px-6">
        <h1 className="font-serif text-plum mb-4">Email confirmation</h1>
        <p className="text-[17px] text-plum-muted leading-7 mb-8">
          {error ??
            "Open the link in the email we sent. The link works once and expires after 30 minutes."}
        </p>
        <LinkButton href="/sign-in" variant="primary">
          Request a new link
        </LinkButton>
      </div>
    </section>
  );
}
