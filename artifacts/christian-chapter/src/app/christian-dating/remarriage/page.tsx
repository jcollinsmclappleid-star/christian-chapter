import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian remarriage — dating after a previous marriage",
  description:
    "A UK guide to Christian remarriage: faith views, blended families, and how a founding application records whether you are open to marrying again. Not a live introductions marketplace.",
  path: "/christian-dating/remarriage",
});

export default function ChristianRemarriagePage() {
  return (
    <>
      <section className="section bg-ivory pb-14">
        <div className="mx-auto max-w-4xl px-6">
          <nav className="text-[12px] text-stone mb-6 font-sans" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="hover:text-plum">Home</a></li>
              <li className="text-mist">/</li>
              <li><a href="/christian-dating" className="hover:text-plum">Christian dating</a></li>
              <li className="text-mist">/</li>
              <li className="text-plum">Remarriage</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Christian remarriage<br />
            <em>when a previous marriage has ended</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[580px]">
            Some people joining a founding cohort already know they would marry again.
            Others want companionship without that commitment, or are still unsure.
            This page is about that decision — not about being shown people to meet today.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-12">
          <div className="space-y-5 text-[16px] text-plum-muted leading-7">
            <h2 className="font-serif text-plum text-3xl mb-4">Faith and conscience</h2>
            <p>
              Christians disagree about remarriage after divorce, and about the
              pastoral meaning of a church blessing. Mature Christian Dating does not
              take a denominational ruling. The founding application asks whether
              you are open to remarriage so that, when introductions exist, that
              preference can be respected.
            </p>
            <p>
              If your tradition has a firm view, you can record denomination as
              an Essential later. That control is design intent for matching. It
              is not operating as a live filter today.
            </p>
          </div>
          <div className="space-y-5 text-[16px] text-plum-muted leading-7">
            <h2 className="font-serif text-plum text-3xl mb-4">Blended families</h2>
            <p>
              Adult children, grandchildren, and financial independence after a
              long marriage are ordinary facts of life after 40. The application
              lets you describe family situation honestly. It does not publish a
              household to other members yet, because member profiles are not live.
            </p>
            <p>
              If you are dating after bereavement rather than divorce, the
              questions of loyalty and timing are different. See{" "}
              <a href="/christian-dating/after-bereavement" className="underline text-plum">
                dating after bereavement
              </a>
              . Divorce-specific questions sit on{" "}
              <a href="/christian-dating/after-divorce" className="underline text-plum">
                dating after divorce
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">What the founding application records</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                heading: "Open to remarriage",
                content:
                  "Yes, no, or unsure. This is your answer, not a church certificate. Administrators can see it during review.",
              },
              {
                heading: "Pace",
                content:
                  "How quickly you hope a relationship might unfold. That does not create a timeline we enforce.",
              },
              {
                heading: "Not a matching engine yet",
                content:
                  "Recording remarriage preference does not mean we are introducing you to someone who shares it. Introductions are still being built.",
              },
              {
                heading: "Age",
                content:
                  "The cohort is for adults aged 40 and over. There is no maximum age. Remarriage later in life is treated as ordinary, not exceptional.",
              },
            ].map(({ heading, content }) => (
              <div key={heading} className="p-5 rounded-lg border border-border bg-ivory">
                <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">{heading}</h3>
                <p className="text-[14px] text-plum-muted leading-6">{content}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <LinkButton href="/register" size="lg" variant="primary">
              Join the founding cohort — free
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
