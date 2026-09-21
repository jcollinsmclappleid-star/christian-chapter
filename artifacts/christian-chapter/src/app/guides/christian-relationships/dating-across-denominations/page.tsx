import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Dating across Christian denominations in the UK",
  description:
    "How Anglican, Catholic, Baptist, Pentecostal and other traditions meet in a UK founding cohort. Essentials for denomination are design intent, not a live matching filter yet.",
  path: "/guides/christian-relationships/dating-across-denominations",
});

export default function DatingAcrossDenominationsPage() {
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
              <li className="text-plum">Dating across denominations</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Dating across<br />
            <em>Christian denominations</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[620px]">
            Shared faith is not the same as identical church practice. Many
            people aged 40 and over already know where they will not compromise —
            communion, baptism, Sunday pattern, views on remarriage — and where
            they can be open-minded.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-12">
          <div className="space-y-5 text-[16px] text-plum-muted leading-7">
            <h2 className="font-serif text-plum text-3xl mb-4">What the application asks</h2>
            <p>
              You name a tradition, how often you attend, and how central faith
              is to daily life. You can write a short description in your own
              words. Those answers are religious-belief data. They are stored
              only after a separate explicit consent, and you can withdraw that
              consent from your account.
            </p>
            <p>
              We do not currently show those answers to other members, because
              member-to-member profiles and messaging are not live.
            </p>
          </div>
          <div className="space-y-5 text-[16px] text-plum-muted leading-7">
            <h2 className="font-serif text-plum text-3xl mb-4">Essentials, when matching exists</h2>
            <p>
              The product is designed so denomination can be Essential, Preferred,
              or Open-minded. Essential would mean we never introduce someone who
              breaks that boundary. That rule is not running against a live
              membership yet.
            </p>
            <p>
              Until then, the honest use of these answers is founding-cohort
              review: understanding who is applying, not pairing people.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">Questions worth asking a future partner</h2>
          <ul className="space-y-3 text-[16px] text-plum-muted leading-7 list-disc pl-5">
            <li>Where would we worship, and how often would that matter?</li>
            <li>How do we treat children&apos;s faith formation if we blend families?</li>
            <li>Are there practices one of us cannot join in good conscience?</li>
            <li>How do we speak about other churches without contempt?</li>
          </ul>
          <p className="mt-8 text-[15px] text-plum-muted leading-6">
            This is a guide, not pastoral advice. Talk to someone in your own
            church if a difference is becoming a barrier.
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
