import { LegalShell, legalMetadata } from "@/components/legal/legal-shell";
import { POLICY_EFFECTIVE_DATE, POLICY_VERSION } from "@/lib/site-config";

export const metadata = legalMetadata(
  "Cookie information",
  "/cookies",
  "Cookies and local storage actually used by Christian Chapter. There is no advertising or analytics cookie.",
);

export default function CookiesPage() {
  return (
    <LegalShell title="Cookie information" version={POLICY_VERSION} effective={POLICY_EFFECTIVE_DATE}>
      <p>
        This page lists storage the site actually uses. We do not run analytics
        or advertising scripts, so there is no cookie banner. Strictly necessary
        storage does not require a marketing-style choice.
      </p>
      <h2>Strictly necessary cookies</h2>
      <ul>
        <li>
          <strong>cc_member</strong> — httpOnly session cookie after you confirm
          your email or sign in. It keeps you signed in. It is not used for
          advertising.
        </li>
        <li>
          <strong>cc_admin</strong> — httpOnly session cookie for administrators
          only.
        </li>
      </ul>
      <h2>Local storage</h2>
      <ul>
        <li>
          <strong>cc_wizard_v1</strong> — a browser draft of the founding
          application before your email is confirmed. After you sign in, the
          draft is stored on the server and this key is cleared. It is not a
          third-party tracker.
        </li>
      </ul>
      <p>
        You can delete local storage in your browser settings. Signing out
        clears the member session cookie. Rejecting non-essential cookies is
        unnecessary because none are set.
      </p>
    </LegalShell>
  );
}
