import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating after bereavement — a careful guide",
  description:
    "A thoughtful guide to Christian dating after losing a partner. Grief, readiness and the hope of a second chapter — from Christian Chapter. No sales pressure.",
  path: "/christian-dating/after-bereavement",
});

export default function ChristianDatingAfterBereavementPage() {
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
              <li className="text-plum">After bereavement</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Christian dating<br />
            <em>after bereavement</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[580px]">
            Losing a partner is one of the most profound experiences a person can go through. The possibility of finding someone new — when grief and hope can coexist — deserves gentle, honest guidance. This page is written for people who are genuinely considering it.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-3xl px-6">
          <div className="bg-evergreen-light border border-evergreen/20 rounded-lg p-7 mb-10">
            <p className="text-[13px] uppercase tracking-[0.2em] text-evergreen font-sans mb-3">Support resources</p>
            <p className="text-[15px] text-plum-muted leading-6">
              If you are still in an acute phase of grief, it may be worth speaking with a grief counsellor or your church community before exploring dating. Organisations including{" "}
              <a href="https://www.cruse.org.uk" className="underline underline-offset-2 hover:text-plum" target="_blank" rel="noreferrer noopener">Cruse Bereavement Support</a>
              {" "}and{" "}
              <a href="https://www.widowedandyoung.org.uk" className="underline underline-offset-2 hover:text-plum" target="_blank" rel="noreferrer noopener">WAY Widowed and Young</a>
              {" "}offer specific support for people who have lost a partner. This page is not a substitute for that kind of support.
            </p>
          </div>

          <h2 className="font-serif text-plum text-3xl mb-5">Grief doesn&apos;t follow a schedule</h2>
          <div className="space-y-4 text-[16px] text-plum-muted leading-7 mb-10">
            <p>
              There is no correct amount of time to wait before thinking about meeting someone new. Some people find that two years feels right; others take much longer, and some begin to feel ready sooner than they expected — which can itself feel complicated.
            </p>
            <p>
              Feeling ready to consider a new relationship does not mean you have stopped grieving, or that you loved your partner less, or that your first marriage is somehow diminished. Most people who find a second meaningful relationship say that the first one shaped who they are — it is part of them, not a past to be erased.
            </p>
            <p>
              The question worth asking is not &ldquo;Am I over it?&rdquo; — few people ever feel fully over the loss of someone they loved. It is: &ldquo;Am I in a place where I can genuinely give attention to someone new?&rdquo;
            </p>
          </div>

          <h2 className="font-serif text-plum text-3xl mb-5">What other members have found helpful</h2>
          <div className="space-y-4 text-[16px] text-plum-muted leading-7">
            <p>
              Being honest about your bereavement in your profile tends to go better than trying to minimise it. The right person for you will understand — and probably has their own story of loss.
            </p>
            <p>
              Many widowed members find it helpful to meet people who have experienced loss themselves — though this is not essential. You can indicate your openness to meeting someone who has been widowed, but it is not a filter we apply automatically.
            </p>
            <p>
              Moving gently in early conversations tends to be appreciated by both people. There is no rush. A good introduction from Christian Chapter is a starting point — not a deadline.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">How Christian Chapter handles bereavement sensitively</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                heading: "Your relationship history, on your terms",
                content: "Your profile includes a relationship history field with widowed as an explicit option. This is visible to potential matches by default — because honesty builds trust — but you control the visibility of any sensitive detail.",
              },
              {
                heading: "No language that feels exploitative",
                content: "We don&apos;t run retargeting campaigns aimed at people who recently searched for grief support. We don&apos;t describe your situation as a market opportunity. This page exists to be genuinely useful, not to generate sign-ups from vulnerable people.",
              },
              {
                heading: "A community that understands loss",
                content: "A significant portion of Christian singles in the 50–70 age group have experienced bereavement. The community you would join includes many people who understand this — it is part of what makes it feel different from a general dating service.",
              },
              {
                heading: "Introductions, not pressure",
                content: "You receive introductions on a calm cadence. There is no inbox flooding, no pressure to respond quickly, no algorithm optimised to maximise time on the platform. If you need to take a break, you can — your conversations and profile are preserved.",
              },
            ].map(({ heading, content }) => (
              <div key={heading} className="p-5 rounded-lg border border-border bg-ivory">
                <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">{heading}</h3>
                <p className="text-[14px] text-plum-muted leading-6">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">There is no pressure here.</h2>
          <p className="text-[17px] text-plum-muted mb-8 leading-7 max-w-lg mx-auto">
            Join free when you feel ready. Your profile waits quietly until you are. We will look for a genuine, considered introduction — and let you decide whether to take it from there.
          </p>
          <LinkButton href="/register" size="lg" variant="primary">
            Join free
          </LinkButton>
          <p className="mt-4 text-[13px] text-stone">No commitment. No credit card. Pause or close your account at any time.</p>
        </div>
      </section>
    </>
  );
}
