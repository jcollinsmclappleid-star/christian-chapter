import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Romance fraud — staying safe while dating as a Christian",
  description:
    "UK romance-fraud warning signs, Action Fraud reporting, and what Christian Chapter already does versus what is still being built. Founding cohort, not live messaging.",
  path: "/guides/safety/romance-fraud",
});

export default function RomanceFraudGuidePage() {
  return (
    <>
      <section className="section bg-ivory pb-14">
        <div className="mx-auto max-w-4xl px-6">
          <nav className="text-[12px] text-stone mb-6 font-sans" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="hover:text-plum">Home</a></li>
              <li className="text-mist">/</li>
              <li><a href="/safety" className="hover:text-plum">Safety</a></li>
              <li className="text-mist">/</li>
              <li className="text-plum">Romance fraud</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Romance fraud<br />
            <em>and Christian dating</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[620px]">
            Romance fraud is a crime. It often uses faith language, isolation,
            and urgency around money. Christian Chapter is currently a founding
            cohort with email confirmation and human application review. It is
            not yet a messaging network, so in-product conversation monitoring
            is not live.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6 space-y-5 text-[16px] text-plum-muted leading-7">
          <h2 className="font-serif text-plum text-3xl mb-4">Warning signs that do not depend on our product</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Someone you have never met asks for money, gift cards, or crypto.</li>
            <li>They avoid a video call, or the story of why they cannot meet keeps changing.</li>
            <li>They move you off a service quickly and discourage you from telling friends.</li>
            <li>They claim a sudden medical, travel, or customs emergency.</li>
            <li>They quote scripture to create obligation or secrecy.</li>
          </ul>
          <p>
            If you think you are being targeted in the UK, report it to{" "}
            <a
              href="https://www.actionfraud.police.uk/"
              className="underline text-plum"
              rel="noreferrer"
            >
              Action Fraud
            </a>{" "}
            and tell someone you trust. Banks can often stop payments if you act quickly.
          </p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">What exists here now, and what does not</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-5 rounded-lg border border-border">
              <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">Now</h3>
              <p className="text-[14px] text-plum-muted leading-6">
                Confirmed email before an application is treated as submitted.
                Separate religious-data consent. An administrator can read a
                founding application. There is no public member directory to scrape.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border">
              <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">Being built</h3>
              <p className="text-[14px] text-plum-muted leading-6">
                Phone and selfie checks before messaging, pattern friction inside
                conversations, in-product reporting, and private calling. Those
                are not operating, and we do not publish a response-time SLA for them.
              </p>
            </div>
          </div>
          <p className="mt-8 text-[15px] text-plum-muted leading-6">
            Read the{" "}
            <a href="/safety" className="underline text-plum">
              safety page
            </a>{" "}
            for the same split in more detail.
          </p>
          <div className="mt-10">
            <LinkButton href="/register" size="lg" variant="primary">
              Join the founding cohort — free
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
