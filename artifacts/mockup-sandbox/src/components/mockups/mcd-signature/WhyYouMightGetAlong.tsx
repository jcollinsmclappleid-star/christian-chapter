import { useEffect, useState } from "react";

type Dimension = {
  label: string;
  text: string;
  mark: string;
};

const dimensions: Dimension[] = [
  { label: "Faith", text: "Church community is important to both", mark: "01" },
  { label: "Relationship", text: "Both seeking a committed long-term relationship", mark: "02" },
  { label: "Life stage", text: "Both have adult children", mark: "03" },
  { label: "Distance", text: "46 miles apart · Both open to travelling", mark: "04" },
  { label: "Lifestyle", text: "Several overlaps — travel, countryside, live music", mark: "05" },
];

export function WhyYouMightGetAlong() {
  const [started, setStarted] = useState(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!started) {
      setShown(0);
      return;
    }
    const timers = dimensions.map((_, index) =>
      window.setTimeout(() => setShown(index + 1), 900 + index * 800),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [started]);

  const replay = () => {
    setStarted(false);
    window.setTimeout(() => setStarted(true), 60);
  };

  return (
    <main className="mcd-signature min-h-[100dvh] overflow-hidden bg-[#eeeae2] text-[#28302e]">
      <style>{`
        .mcd-signature { font-family: 'DM Sans', sans-serif; }
        .mcd-serif { font-family: 'Source Serif 4', 'Libre Baskerville', serif; }
        @keyframes mcd-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mcd-reveal { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes mcd-breathe { 0%,100% { transform: scale(1); opacity:.18 } 50% { transform: scale(1.05); opacity:.3 } }
        .mcd-rise { animation: mcd-rise .8s cubic-bezier(.2,.8,.2,1) both; }
        .mcd-reveal { animation: mcd-reveal .75s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .mcd-rise, .mcd-reveal { animation: none !important; }
          .mcd-signature * { scroll-behavior: auto !important; }
        }
      `}</style>

      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b9890] text-[13px] tracking-[.16em] text-[#56635d]">M</div>
          <span className="text-[11px] font-medium uppercase tracking-[.22em] text-[#52605a]">Mature Christian Dating</span>
        </div>
        <span className="hidden text-[11px] uppercase tracking-[.2em] text-[#7e8882] sm:block">A quieter way to meet</span>
      </header>

      <section className="relative mx-auto max-w-[1240px] px-6 pb-20 pt-14 sm:px-10 sm:pt-24 lg:px-16 lg:pb-32">
        <div className="pointer-events-none absolute left-[44%] top-20 h-[560px] w-[560px] rounded-full bg-[#d8d8ca] blur-[1px] animate-[mcd-breathe_10s_ease-in-out_infinite]" />
        <div className="relative grid items-end gap-12 lg:grid-cols-[.74fr_1.26fr] lg:gap-20">
          <div className="mcd-rise max-w-[430px]">
            <p className="mb-7 text-[11px] font-medium uppercase tracking-[.24em] text-[#738078]">The heart of it</p>
            <h1 className="mcd-serif text-[clamp(3rem,6vw,5.6rem)] leading-[.93] tracking-[-.045em] text-[#27322f]">
              Why you might<br /><em className="text-[#68786d]">get along.</em>
            </h1>
            <p className="mt-8 max-w-[350px] text-[15px] leading-7 text-[#65706b]">
              Not a score. Not a swipe. Just the beginnings of a considered introduction.
            </p>
            <button
              type="button"
              onClick={started ? replay : () => setStarted(true)}
              className="mt-10 rounded-full border border-[#607269] bg-[#607269] px-6 py-3 text-[12px] font-medium tracking-[.08em] text-[#f4f0e8] transition-transform hover:-translate-y-0.5"
            >
              {started ? "Watch it again" : "See what they share"} <span className="ml-3">↓</span>
            </button>
          </div>
          <div className="relative min-h-[110px] pb-2 lg:min-h-[170px]">
            <div className="mcd-serif absolute bottom-0 right-0 max-w-[600px] text-right text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.06] tracking-[-.03em] text-[#7a837a]">
              An introduction<br /><span className="text-[#31403a]">should have a reason.</span>
            </div>
          </div>
        </div>

        <div className="relative mt-20 grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <ProfileCard
            image="/__mockup/images/mcd-sig-sarah.jpg"
            name="Sarah"
            details="53 · Buckinghamshire"
            copy="Church community is an important part of her week. Adult children. Works part-time. Loves live music and weekends away. Looking for a committed relationship with someone whose faith genuinely matters."
            visible
          />
          <ProfileCard
            image="/__mockup/images/mcd-sig-david.jpg"
            name="David"
            details="57 · Oxfordshire"
            copy="Christian, attends church regularly. Recently retired. Loves travel and countryside. Has grown-up children. Seeking a committed long-term relationship. Open to travel up to 60 miles."
            visible={started}
          />
        </div>

        <div className="relative mx-auto mt-8 max-w-[760px] lg:-mt-2">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#c7c9be]" />
            <p className="mcd-serif text-center text-[18px] italic text-[#52645a]">Why we think you may be worth introducing</p>
            <span className="h-px flex-1 bg-[#c7c9be]" />
          </div>
          <div className="space-y-2">
            {dimensions.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center gap-4 border-b border-[#d3d4ca] py-4 ${index < shown ? "mcd-reveal" : "invisible"}`}
                aria-hidden={index >= shown}
              >
                <span className="w-8 font-mono text-[10px] tracking-[.15em] text-[#89938b]">{item.mark}</span>
                <span className="w-[106px] text-[10px] font-medium uppercase tracking-[.18em] text-[#7b877f]">{item.label}</span>
                <span className="mcd-serif text-[18px] text-[#35463d]">{item.text}</span>
              </div>
            ))}
            {!started && <p className="py-5 text-center text-[11px] uppercase tracking-[.18em] text-[#8b938c]">The shared details will appear here</p>}
          </div>
        </div>

        <div className={`mt-24 text-center transition-opacity duration-700 ${shown === dimensions.length ? "opacity-100" : "opacity-0"}`}>
          <p className="mcd-serif text-[25px] italic text-[#3c4c43]">A thoughtful beginning, not a promise.</p>
          <button type="button" onClick={() => window.alert("Founding member registration would begin here.")} className="mt-7 rounded-full bg-[#283b33] px-7 py-3.5 text-[12px] font-medium tracking-[.08em] text-[#f4f0e8] transition-transform hover:-translate-y-0.5">
            Become a Founding Member — Free
          </button>
        </div>
        <p className="relative mt-20 text-center text-[10px] uppercase tracking-[.2em] text-[#8b938c]">Fictional example — for illustration only</p>
      </section>
    </main>
  );
}

function ProfileCard({ image, name, details, copy, visible }: { image: string; name: string; details: string; copy: string; visible: boolean }) {
  return (
    <article className={`relative grid grid-cols-[118px_1fr] gap-5 border-t border-[#aeb7ae] pt-5 transition-all duration-1000 sm:grid-cols-[160px_1fr] ${visible ? "opacity-100 translate-y-0" : "translate-y-5 opacity-0"}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#d8d8cc]">
        {visible ? <img src={image} alt={`${name}, fictional example`} className="h-full w-full object-cover grayscale-[12%]" /> : <div className="h-full w-full bg-[#d8d8cc]" />}
        <span className="absolute bottom-2 left-2 bg-[#eeeae2]/85 px-2 py-1 text-[9px] uppercase tracking-[.15em] text-[#68746c]">Profile</span>
      </div>
      <div className="pt-1">
        <h2 className="mcd-serif text-[30px] leading-none text-[#2e3c35]">{name}</h2>
        <p className="mt-2 text-[11px] uppercase tracking-[.15em] text-[#718078]">{details}</p>
        <p className="mt-6 max-w-[340px] text-[14px] leading-6 text-[#626e67]">{copy}</p>
      </div>
    </article>
  );
}