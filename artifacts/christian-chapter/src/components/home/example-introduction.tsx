import { demoIntroduction } from "@/lib/home/demo-fixture";
import { TRAVEL_MILES_COPY } from "@/lib/site-config";

export function ExampleIntroduction() {
  return (
    <article
      className="overflow-hidden rounded-[28px] border border-border bg-paper shadow-card"
      aria-labelledby="example-introduction-heading"
    >
      <div className="flex h-40 items-center justify-center bg-ivory-darker">
        <span className="font-serif text-7xl leading-none text-life/80" aria-hidden>
          {demoIntroduction.firstName.slice(0, 1)}
        </span>
      </div>
      <div className="p-5">
        <h2 id="example-introduction-heading" className="font-sans text-[1.65rem] font-semibold leading-none text-plum">
          {demoIntroduction.firstName}, {demoIntroduction.age}
        </h2>
        <p className="mt-2 text-[15px] text-plum-muted">
          {demoIntroduction.region} · {demoIntroduction.poolLabel}
        </p>
        <p className="mt-3 text-[16px] leading-6 text-plum">{demoIntroduction.lookingFor}</p>
        <p className="mt-3 text-[15px] leading-6 text-plum-muted">{demoIntroduction.why[0]}</p>
        <p className="mt-3 text-[13px] leading-5 text-stone">{TRAVEL_MILES_COPY}</p>
      </div>
    </article>
  );
}
