"use client";

import { useEffect, useRef, useState } from "react";

const strands = [
  {
    label: "Faith",
    reason: "Both attend church weekly. Faith is central to how each person lives.",
    colour: "#8B1F2F",
  },
  {
    label: "Intention",
    reason: "Both seeking a committed long-term relationship, open to remarriage.",
    colour: "#1D4A36",
  },
  {
    label: "Life stage",
    reason: "Both have adult children who are largely independent.",
    colour: "#8B1F2F",
  },
  {
    label: "Family",
    reason: "Both comfortable with the idea of building a shared family life, given time.",
    colour: "#1D4A36",
  },
  {
    label: "Distance",
    reason: "47 miles apart. Both open to travelling up to 60 miles to meet.",
    colour: "#8B1F2F",
  },
  {
    label: "Lifestyle",
    reason: "Country walks, live music, travel — several interests in common.",
    colour: "#1D4A36",
  },
];

export function IntroductionDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (visibleCount >= strands.length) return;
    const timer = setTimeout(
      () => setVisibleCount((c) => c + 1),
      visibleCount === 0 ? 300 : 550
    );
    return () => clearTimeout(timer);
  }, [hasStarted, visibleCount]);

  return (
    <section className="bg-plum text-ivory py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-4 font-sans">
            Fictional example — how an introduction works
          </p>
          <h2 className="font-serif text-ivory text-4xl md:text-5xl leading-tight">
            An introduction should have a reason.
          </h2>
          <p className="mt-5 text-[17px] text-mist max-w-[520px] mx-auto leading-7">
            Before we introduce two people, we look at what they have in common — and what would need a conversation.
          </p>
        </div>

        {/* People */}
        <div className="grid grid-cols-3 items-start gap-4 mb-10">
          <div className="text-right">
            <p className="font-serif text-2xl text-ivory">Sarah</p>
            <p className="text-[13px] text-mist mt-1">53 · South East England</p>
            <p className="text-[12px] text-brass mt-1 uppercase tracking-wide">Anglican</p>
          </div>
          <div className="flex justify-center pt-2">
            <div className="w-px bg-ivory/20 h-8 mx-auto" />
          </div>
          <div className="text-left">
            <p className="font-serif text-2xl text-ivory">David</p>
            <p className="text-[13px] text-mist mt-1">57 · Midlands</p>
            <p className="text-[12px] text-brass mt-1 uppercase tracking-wide">Church of England</p>
          </div>
        </div>

        {/* Strands */}
        <div className="space-y-3">
          {strands.map((strand, i) => {
            const visible = i < visibleCount;
            return (
              <div
                key={strand.label}
                className="transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                }}
                aria-hidden={!visible}
              >
                <div className="grid grid-cols-3 items-center gap-4">
                  {/* Left line */}
                  <div className="flex items-center justify-end gap-3">
                    <div
                      className="h-px flex-1 transition-all duration-700"
                      style={{
                        background: visible ? "rgba(255,255,255,0.25)" : "transparent",
                        transitionDelay: visible ? `${i * 80}ms` : "0ms",
                      }}
                    />
                    <span
                      className="text-[11px] uppercase tracking-[0.2em] font-sans font-medium"
                      style={{ color: strand.colour }}
                    >
                      {strand.label}
                    </span>
                  </div>

                  {/* Centre reason */}
                  <div className="px-4 py-3 rounded-md bg-ivory/8 border border-ivory/12 text-center">
                    <p className="text-[13px] text-mist leading-5">{strand.reason}</p>
                  </div>

                  {/* Right line */}
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[11px] uppercase tracking-[0.2em] font-sans font-medium"
                      style={{ color: strand.colour }}
                    >
                      {strand.label}
                    </span>
                    <div
                      className="h-px flex-1 transition-all duration-700"
                      style={{
                        background: visible ? "rgba(255,255,255,0.25)" : "transparent",
                        transitionDelay: visible ? `${i * 80}ms` : "0ms",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Outcome */}
        {visibleCount >= strands.length && (
          <div
            className="mt-10 text-center transition-all duration-500"
            style={{ opacity: visibleCount >= strands.length ? 1 : 0 }}
          >
            <p className="font-serif italic text-[1.3rem] text-ivory/80">
              "Based on these six dimensions, we think it&apos;s worth saying hello."
            </p>
            <p className="text-[12px] uppercase tracking-[0.2em] text-stone mt-3 font-sans">
              No percentage. No algorithm score. Just a considered reason.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
