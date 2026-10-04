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
        profile photographs until they are approved. Other members see a
        photograph only after it is approved. Approval is a content check, not
        proof of identity. You can see your own while that decision is open. When we connect two members, they can write to each
        other. We do not run an open messaging network, calling, or a charge
        today. Payment is not open, and no card is taken. A matchmaker may
        hand-pick an introduction from a complete profile. Founding members
        are matched free. The live matching system goes live on 14 February 2027.
      </p>
      <h2>Who we are</h2>
      <p>
        The data controller is {siteConfig.legalEntityName}, company number{" "}
        {siteConfig.companyNumber}, registered office {siteConfig.registeredOffice}.{" "}
        {siteConfig.brandName} is the name of this service. Contact{" "}
        {siteConfig.contactEmail} for privacy requests. We are registered with the
        Information Commissioner&apos;s Office, reference{" "}
        <a href={siteConfig.icoRegisterUrl} className="underline">
          {siteConfig.icoRegistrationReference}
        </a>
        . The company is not VAT registered.
      </p>
      <h2>Data we collect</h2>
      <ul>
        <li>Account and contact: name, email address, account status, sign-in tokens (stored as hashes).</li>
        <li>Date of birth, used only to confirm you are 40 or over. There is no maximum age.</li>
        <li>Broad UK region and travel preferences — not a precise address.</li>
        <li>Religious belief and practice, processed only with your separate explicit consent.</li>
        <li>Relationship, family and lifestyle answers on the founding application.</li>
        <li>Security and audit data: IP address, user agent, timestamps of consents and admin actions.</li>
        <li>Profile photographs. You can see your own while a decision is open. Other members see a photograph only after it is approved. Approval is a content check, not proof of identity.</li>
        <li>Messages you write to a member we have connected you with, and the messages they write to you. The text is stored in a sealed form, which is not end-to-end encryption. A message is deleted seven days after the other person first reads it, or 30 days after it is sent if it is still unread. If you select a message in a safety report, that copy is kept for 90 days and can be read by staff reviewing the report. Closing an account deletes the live conversation for both people.</li>
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
      <h2>Who we share it with</h2>
      <p>
        We do not sell personal data. Staff and matchmakers see applications and profiles
        in order to run the cohort and decide whether to make an introduction. A member
        sees your profile, and any message you send them, only where the product has
        connected you or shown you as an introduction. We use hosting and database
        providers (currently Neon Postgres), transactional email (Resend, when configured),
        and the infrastructure that serves this website. We do not load advertising pixels.
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
        configurable retention window (default 30 days). After that we delete the
        account. We may keep a redacted audit entry that an action happened, without
        the profile content, where we need it for security or to show what we did.
        We do not claim instant erasure from every backup copy. Backups expire on
        their own cycle.
      </p>
      <h2>Security</h2>
      <p>
        Sign-in links are stored as hashes. The session cookie is httpOnly. Profile
        photographs are not shown to other members until a person approves them.
        Administrator access is separate from member access. We do not claim that
        any system is impossible to breach.
      </p>
      <h2>Children</h2>
      <p>
        The service is for adults aged 40 and over. It is not directed at anyone
        under 18. If we learn an account is being used by a child, we close it
        and delete the data we are not required to keep.
      </p>
      <h2>Automated decisions</h2>
      <p>
        We do not make a decision that has a legal or similarly significant effect
        on you by automated means alone. A matchmaker decides a hand-picked
        introduction. Matching technology is not live.
      </p>
      <h2>Your rights</h2>
      <p>
        You may access, correct, export or object, and you may withdraw
        religious-data consent. Write to {siteConfig.contactEmail}. We respond
        within one month, or we tell you why we need longer when the law allows
        that. Withdrawing religious-data consent stops faith-based processing and
        closes the dating application. You can complain to the{" "}
        <a href={siteConfig.icoComplaintsUrl} className="underline">
          Information Commissioner&apos;s Office
        </a>
        . Please contact us first so we can try to put it right.
      </p>
      <h2>If something goes wrong</h2>
      <p>
        If a personal-data breach creates a risk to you, we will tell you and the
        Information Commissioner&apos;s Office when the law requires it.
      </p>
      <h2>International transfers</h2>
      <p>
        Neon, email delivery, and website hosting may process data outside the UK.
        Their contracts provide the transfer safeguards required for that processing.
        Ask {siteConfig.contactEmail} if you want the current list of providers.
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
