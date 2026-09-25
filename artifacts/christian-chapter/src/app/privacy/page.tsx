import { LegalShell, legalMetadata } from "@/components/legal/legal-shell";
import { POLICY_EFFECTIVE_DATE, POLICY_VERSION, siteConfig } from "@/lib/site-config";

export const metadata = legalMetadata(
  "Privacy policy",
  "/privacy",
  "How Mature Christian Dating processes personal data during the founding cohort, including religious-belief consent.",
);

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy policy" version={POLICY_VERSION} effective={POLICY_EFFECTIVE_DATE}>
      <p>
        This notice describes processing that actually happens today: creating a
        founding-member account, confirming an email address, storing a founding
        application, recording consents, recording who opened an introduction,
        checking one photograph against the profile photograph, and holding
        profile photographs until they are verified. Other members see a
        photograph only after it is verified. You can see your own while that
        decision is open. When we connect two members, they can write to each
        other. We do not run an open messaging network, calling, or a charge
        today. Payment is not open, and no card is taken. A complete profile
        can be considered for a personal hand-picked introduction. The live
        matching system goes live on 14 February 2027.
      </p>
      <h2>Who we are</h2>
      <p>
        {siteConfig.brandName} is the consumer name of this service. Contact the
        controller at {siteConfig.contactEmail}. If a registered legal entity is
        later confirmed, this page will be updated from configuration rather than
        invented company details.
      </p>
      <h2>Data we collect</h2>
      <ul>
        <li>Account and contact: name, email address, account status, sign-in tokens (stored as hashes).</li>
        <li>Date of birth, used only to confirm you are 40 or over. There is no maximum age.</li>
        <li>Broad UK region and travel preferences — not a precise address.</li>
        <li>Religious belief and practice, processed only with your separate explicit consent.</li>
        <li>Relationship, family and lifestyle answers on the founding application.</li>
        <li>Security and audit data: IP address, user agent, timestamps of consents and admin actions.</li>
        <li>Profile photographs. You can see your own while a decision is open. Other members see a photograph only after it is verified.</li>
        <li>Messages you write to a member we have connected you with.</li>
        <li>Payment is not open, so no card details are collected.</li>
        <li>One check photograph of your face, only after you agree, and only until the check is finished or 24 hours pass.</li>
        <li>When you open an introduction, the time and your name, unless private browsing is on.</li>
        <li>Recent sign-in times, and your choices about introduction and profile-view emails.</li>
      </ul>
      <h2>Purposes and lawful bases</h2>
      <p>
        We process ordinary account and application data to take steps at your
        request and to run the founding cohort (contract / legitimate interests).
        Religious-belief data is special-category data. We rely on your explicit
        consent. Marketing email is optional and separate. Service emails (email
        confirmation, sign-in, closure notices) are sent without marketing consent.
      </p>
      <h2>Founding-cohort review</h2>
      <p>
        Submitted applications are reviewed for completeness and to balance the
        cohort.
      </p>
      <h2>Providers</h2>
      <p>
        Hosting and database (currently Neon Postgres), transactional email
        (Resend, when configured), and the
        infrastructure used to run this website. We do not load advertising pixels.
      </p>
      <h2>Retention and closure</h2>
      <p>
        Opening an introduction records a visit the other member can see, with
        your name and the time. Private browsing is a separate subscription of
        £9 a month from 15 February 2027. It is not charged now. While it is on,
        that visit is not shown and does not mark you as recently active.
      </p>
      <p>
        A check photograph is deleted when the check is finished. If it is still
        waiting, it is deleted after 24 hours. Closing your account
        deletes it at once. We keep the result of the check, not the photograph,
        and we do not send the photograph to any other company.
      </p>
      <p>
        You may request closure from your account. The application is hidden
        immediately. Remaining records are scheduled for deletion after a
        configurable retention window (default 30 days), except legal, security
        or audit records we must keep. Backups expire on their own cycle; we
        do not claim instant erasure from every backup copy.
      </p>
      <h2>Your rights</h2>
      <p>
        You may access, correct, export or object, withdraw religious-data
        consent, and complain to the{" "}
        <a href={siteConfig.icoComplaintsUrl} className="underline">
          Information Commissioner&apos;s Office
        </a>
        . Withdrawing religious-data consent stops faith-based processing and
        closes the dating application.
      </p>
      <h2>International transfers</h2>
      <p>
        Some providers may process data outside the UK. Where that happens we
        will rely on an appropriate transfer mechanism documented with that
        provider.
      </p>
      <h2>What we do not process yet</h2>
      <p>
        An open messaging network, calls, location coordinates and automated
        introductions are not part of the service today. A conversation exists
        only after we connect two members.
      </p>
    </LegalShell>
  );
}
