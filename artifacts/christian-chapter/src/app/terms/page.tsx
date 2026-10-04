import { LegalShell, legalMetadata } from "@/components/legal/legal-shell";
import {
  CONCIERGE_PRICE_LABEL,
  INCOGNITO_PRICE_LABEL,
  MEMBER_BILLING_STARTS_LABEL,
  MEMBER_PRICE_LABEL,
  MINIMUM_AGE,
  OPENING_OFFER_ENDS_LABEL,
  POLICY_EFFECTIVE_DATE,
  POLICY_VERSION,
  siteConfig,
} from "@/lib/site-config";

export const metadata = legalMetadata(
  "Terms of use",
  "/terms",
  "Terms for Mature Christian Dating, including eligibility, no guarantee of a match, member responsibility, and limits on our liability.",
);

export default function TermsPage() {
  return (
    <LegalShell title="Terms of use" version={POLICY_VERSION} effective={POLICY_EFFECTIVE_DATE}>
      <p>
        These terms are a contract between you and {siteConfig.legalEntityName}{" "}
        (company number {siteConfig.companyNumber}), which operates {siteConfig.brandName}.
        They cover
        creating an account, the founding application, profiles, introductions we choose to
        make, and any later feature we switch on (including a conversation between two
        members we have connected). They do not promise a live open marketplace, a match,
        or a relationship.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be aged {MINIMUM_AGE} or over, able to form a contract, and using the
        service for yourself. There is no maximum age. The service is for people in the
        United Kingdom. You must not use it if you are barred from online services, or if
        you intend to harm, defraud, or mislead anyone. We may refuse, suspend, or close
        an account that does not meet these terms, including before any introduction is made.
      </p>

      <h2>What you are joining</h2>
      <p>
        Joining is free until {OPENING_OFFER_ENDS_LABEL}. Payment is not open, and no card
        is taken. Nothing on the site is an offer to charge you today. The later published
        prices ({MEMBER_PRICE_LABEL} for membership, {CONCIERGE_PRICE_LABEL} for a concierge
        introduction, and {INCOGNITO_PRICE_LABEL} for private browsing, each from{" "}
        {MEMBER_BILLING_STARTS_LABEL}) apply only if we switch billing on and you expressly
        agree to a paid plan before any charge. We may change those future prices before
        you agree. We will not take payment under these founding terms alone.
      </p>
      <p>
        The service is Christian dating for adults aged {MINIMUM_AGE} and over. Matching
        technology is planned to open on {OPENING_OFFER_ENDS_LABEL}. Until then a matchmaker
        may hand-pick an introduction from a complete profile. That is a choice we make. It
        is not a purchased outcome and not a guarantee that an introduction will be available.
      </p>

      <h2>No guarantee</h2>
      <p>
        We do not guarantee introductions, replies, dates, marriage, compatibility, or that
        any member is suitable, available, or telling the truth. A profile, a photograph
        check, or an introduction is not a background check, an identity guarantee, or a
        statement that someone is safe to meet. You decide whether to take an introduction
        further, including any meeting away from the site.
      </p>

      <h2>Your information and your conduct</h2>
      <p>
        You must give information that is true to the best of your knowledge and keep it
        reasonably up to date. You must not harass, threaten, impersonate, stalk, exploit,
        or scam anyone, ask anyone for money, vouchers, parcels, or secrecy, or use the
        service to commit a crime. You must not upload anyone else&apos;s photograph or
        personal information without their permission, or anything sexual involving a child,
        or anything you do not have the right to share.
      </p>
      <p>
        You are responsible for your profile, photographs, and any message you send. Other
        members are strangers. Do not send money or share financial details with someone you
        meet here. If you think a crime is underway, report it to Action Fraud as well as to
        us.
      </p>

      <h2>Licence you give us</h2>
      <p>
        You keep ownership of what you submit. You grant us a non-exclusive licence to host,
        store, review, moderate, and show that material to our staff and to members we
        introduce you to or connect you with, for as long as we need it to run your account
        and to meet a legal duty. The licence ends when we delete the material, except for
        copies we must keep as described in the privacy notice (including backups that expire
        on their own cycle).
      </p>

      <h2>Our name and the public photographs</h2>
      <p>
        The {siteConfig.brandName} name, site design, and our own copy belong to the operator.
        Photographs on the public pages illustrate the life the service is for. They are not
        photographs of members, and the people shown are not customers.
      </p>

      <h2>Moderation and safety tools</h2>
      <p>
        We may review applications, profiles, and photographs, and we may decline, hide,
        suspend, or close an account, or refuse an introduction, without giving you a
        detailed explanation where that would put someone at risk or compromise a security
        check. Where the product allows it, you can block or report another member, and we
        keep that record while the accounts exist. We do not promise to monitor every
        message, and we do not run a 24-hour moderation desk. We are not a party to any
        relationship or meeting between members.
      </p>

      <h2>Closure</h2>
      <p>
        You may ask us to close your account from your settings. Your profile is hidden
        immediately. Deletion of remaining records follows the privacy notice.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The version and date at the top of this page are the
        ones in force. If a change is material we will say so on the site or by email before
        it applies to you. Continuing to use the service after that date means you accept
        the update. A charge still needs your express agreement at the time, as set out above.
      </p>

      <h2>Liability</h2>
      <p>
        Nothing in these terms excludes or limits liability for death or personal injury
        caused by our negligence, for fraud or fraudulent misrepresentation, or for any
        duty or right that the law of England and Wales says we cannot exclude.
      </p>
      <p>
        Subject to that, we are not liable for the acts or omissions of other members, for
        what happens when you meet someone, for money or gifts you choose to send, for loss
        of profit, goodwill, or data beyond the deletion process in the privacy notice, or
        for a failure caused by something outside our reasonable control. While the service
        is free, our total liability to you for claims arising out of the service in any
        12-month period is limited to £100. If you later pay us, that cap is instead the
        amount you paid us for the service in the 12 months before the claim.
      </p>

      <h2>Complaints, law, and courts</h2>
      <p>
        Contact {siteConfig.contactEmail} and give us a reasonable chance to look at a
        problem before you start a claim. These terms are governed by the laws of England
        and Wales. The courts of England and Wales have exclusive jurisdiction, except that
        if you live in Scotland or Northern Ireland you may also bring a claim in your
        local courts where the law gives you that right. Your statutory rights as a consumer
        are not affected.
      </p>
      <p>
        If a court finds part of these terms unenforceable, the rest still applies.
      </p>
    </LegalShell>
  );
}
