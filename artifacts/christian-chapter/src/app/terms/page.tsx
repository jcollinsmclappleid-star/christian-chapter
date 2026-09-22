import { LegalShell, legalMetadata } from "@/components/legal/legal-shell";
import { POLICY_EFFECTIVE_DATE, POLICY_VERSION, MINIMUM_AGE } from "@/lib/site-config";

export const metadata = legalMetadata(
  "Terms of use",
  "/terms",
  "Terms for the Mature Christian Dating founding cohort, including 40+ eligibility and no guarantee of introductions.",
);

export default function TermsPage() {
  return (
    <LegalShell title="Terms of use" version={POLICY_VERSION} effective={POLICY_EFFECTIVE_DATE}>
      <p>
        These terms cover the founding cohort website: creating an account,
        confirming email, submitting a founding application, and asking us to
        close that account. They do not describe a live dating marketplace.
      </p>
      <h2>Eligibility</h2>
      <p>
        You must be aged {MINIMUM_AGE} or over. There is no maximum age. The
        service is designed for people in the United Kingdom. We may refuse or
        close applications that do not meet these terms.
      </p>
      <h2>Opening offer</h2>
      <p>
        Joining is free until 14 February 2027. During that offer an
        administrator may connect two submitted profiles, so each person can
        see a hand-picked introduction. From 15 February 2027 the published
        member price is £29 a month. No payment is taken before billing is
        switched on, and this page does not start a subscription.
      </p>
      <h2>No guarantee of a match or a date</h2>
      <p>
        Joining the founding cohort does not entitle you to introductions,
        messages, or a relationship. A hand-picked introduction is a choice the
        team makes. It is not a promise of a match, a date, or a reply.
      </p>
      <h2>Accuracy and conduct</h2>
      <p>
        You must provide information that is true to the best of your knowledge.
        You must not harass, impersonate, or use the service to commit fraud.
        We may hide, decline or close applications.
      </p>
      <h2>Moderation</h2>
      <p>
        Administrators may review submitted applications. We do not currently
        operate 24/7 moderation or member-to-member reporting inside a live
        network, because that network is not live.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The Mature Christian Dating name, site design and copy belong to the operator.
        You retain your own application answers. You grant us a limited licence
        to store and review them for the founding cohort.
      </p>
      <h2>Closure</h2>
      <p>
        You may request closure from your account. The application is hidden
        immediately. Remaining deletion follows the privacy notice.
      </p>
      <h2>Limitation and jurisdiction</h2>
      <p>
        The service is provided as a founding intake site. These terms are
        drafted for UK counsel review and are intended to be governed by the
        laws of England and Wales, subject to that review.
      </p>
    </LegalShell>
  );
}
