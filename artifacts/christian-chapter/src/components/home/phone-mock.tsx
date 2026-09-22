import { DEMO_DISCLOSURE, demoChapters, demoIntroduction } from "@/lib/home/demo-fixture";

function PhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-[272px] shrink-0 overflow-hidden rounded-[2.25rem] border-[10px] border-plum bg-paper shadow-card">
      <div className="flex items-center justify-between bg-life px-4 py-2.5 text-white">
        <span className="font-sans text-[13px] font-semibold tracking-tight">{label}</span>
        <span className="h-1.5 w-8 rounded-full bg-white/70" />
      </div>
      <div className="px-4 pb-5 pt-4">{children}</div>
    </div>
  );
}

export function PhoneMocks() {
  const chapter = demoChapters[0];

  return (
    <div className="flex gap-5 overflow-x-auto px-1 pb-3 md:justify-center">
      <PhoneFrame label="Introduction">
        <p className="text-[11px] leading-4 text-tide">{DEMO_DISCLOSURE}</p>
        <div className="mt-3 flex h-32 items-end rounded-2xl bg-ivory-darker px-3 pb-3">
          <span className="font-sans text-5xl font-bold leading-none text-life" aria-hidden>
            {demoIntroduction.firstName.slice(0, 1)}
          </span>
        </div>
        <p className="mt-3 font-sans text-[1.45rem] font-bold leading-none tracking-tight text-plum">
          {demoIntroduction.firstName}, {demoIntroduction.age}
        </p>
        <p className="mt-1.5 text-[13px] leading-5 text-plum-muted">
          {demoIntroduction.region} · {demoIntroduction.poolLabel}
        </p>
        <p className="mt-1 text-[13px] text-tide">{demoIntroduction.tradition}</p>
        <p className="mt-3 text-[14px] leading-5 text-plum">{demoIntroduction.lookingFor}</p>
      </PhoneFrame>

      <PhoneFrame label="Why this introduction">
        <ul className="space-y-3">
          {demoIntroduction.why.map((reason) => (
            <li key={reason} className="border-l-2 border-life pl-3 text-[14px] leading-5 text-plum">
              {reason}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[12px] leading-5 text-stone">Exact miles are not published.</p>
      </PhoneFrame>

      <PhoneFrame label={chapter.title}>
        <p className="font-sans text-[1.2rem] font-bold leading-tight text-plum">{chapter.title}</p>
        <p className="mt-3 text-[14px] leading-6 text-plum-muted">{chapter.body}</p>
        <p className="mt-5 text-[12px] leading-5 text-stone">{DEMO_DISCLOSURE}</p>
      </PhoneFrame>
    </div>
  );
}
