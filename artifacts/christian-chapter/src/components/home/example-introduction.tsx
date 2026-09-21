import {
  DEMO_DISCLOSURE,
  demoChapters,
  demoEssentials,
  demoIntroduction,
} from "@/lib/home/demo-fixture";

const tierLabel = {
  essential: "Essential",
  preferred: "Preferred",
  "open-minded": "Open-minded",
} as const;

const tierClass = {
  essential: "border-oxblood/30 bg-oxblood-light text-oxblood",
  preferred: "border-evergreen/30 bg-evergreen-light text-evergreen",
  "open-minded": "border-border-medium bg-ivory text-plum-muted",
} as const;

export function ExampleIntroduction() {
  return (
    <section className="bg-ivory-dark section" aria-labelledby="example-introduction-heading">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
          Example introduction
        </p>
        <h2 id="example-introduction-heading" className="font-serif text-plum mb-4 max-w-[18ch]">
          An introduction should have a reason.
        </h2>
        <p className="text-[17px] text-plum-muted leading-7 max-w-[38rem] mb-10">
          This is a labelled demonstration of how a profile and an introduction are designed to read. It is not a member, and it is not a match.
        </p>

        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 lg:gap-12 items-start">
          <article className="rounded-lg border border-border bg-ivory p-6 md:p-8">
            <p className="text-[12px] uppercase tracking-[0.18em] text-oxblood font-sans mb-4">
              {DEMO_DISCLOSURE}
            </p>
            <h3 className="font-serif text-plum text-[2rem] leading-none mb-2">
              {demoIntroduction.firstName}, {demoIntroduction.age}
            </h3>
            <p className="text-[15px] text-plum-muted mb-6">
              {demoIntroduction.region} · {demoIntroduction.tradition} · {demoIntroduction.poolLabel}
            </p>
            <p className="text-[17px] text-plum leading-7 mb-8">{demoIntroduction.lookingFor}</p>
            <ol className="space-y-5">
              {demoChapters.map((chapter) => (
                <li key={chapter.id} className="border-t border-border pt-4">
                  <h4 className="font-sans font-semibold text-[14px] tracking-wide uppercase text-stone mb-1">
                    {chapter.title}
                  </h4>
                  <p className="text-[16px] text-plum leading-7">{chapter.body}</p>
                </li>
              ))}
            </ol>
          </article>

          <div className="space-y-8">
            <div>
              <h3 className="font-sans font-semibold text-[15px] text-plum mb-3">
                Why this introduction was considered
              </h3>
              <ul className="space-y-3">
                {demoIntroduction.why.map((reason) => (
                  <li key={reason} className="text-[16px] text-plum-muted leading-7 pl-4 border-l-2 border-oxblood/40">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[15px] text-plum mb-3">Worth discussing</h3>
              <ul className="space-y-2">
                {demoIntroduction.worthDiscussing.map((item) => (
                  <li key={item} className="text-[16px] text-plum-muted leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[15px] text-plum mb-3">
                Essential, Preferred, Open-minded
              </h3>
              <ul className="flex flex-wrap gap-2">
                {demoEssentials.map((item) => (
                  <li key={item.factor}>
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] ${tierClass[item.tier]}`}>
                      <span className="font-semibold">{tierLabel[item.tier]}</span>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] text-stone leading-6">
                Distance is shown as {demoIntroduction.poolLabel}. Exact miles are not published.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
