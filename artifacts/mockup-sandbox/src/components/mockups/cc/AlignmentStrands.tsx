import { useState, useEffect, useRef } from "react";

// Christian Chapter — Alignment Strands Introduction Concept
// Shows how 6 compatibility dimensions animate into plain-language reasons
// Chapters-and-connections visual metaphor: fine lines resolve, strand by strand

const ivy = "#F7F3EC";
const ivyDark = "#EAE4D8";
const plum = "#1E1220";
const plumMuted = "#6B5878";
const oxblood = "#8B1F2F";
const evergreen = "#1D4A36";
const brass = "#C4A05A";
const stone = "#9A8E9A";
const mist = "rgba(30,18,32,0.10)";

const strands = [
  {
    label: "Faith",
    colour: oxblood,
    reason: "Both attend church weekly. Faith is central to how each person lives.",
    detail: "Anglican · Evangelical — different traditions, deeply shared practice",
  },
  {
    label: "Intention",
    colour: evergreen,
    reason: "Both seeking a committed long-term relationship, open to remarriage.",
    detail: "Neither is looking for something casual",
  },
  {
    label: "Life stage",
    colour: oxblood,
    reason: "Both have adult children who are largely independent.",
    detail: "No dependent children on either side",
  },
  {
    label: "Family",
    colour: evergreen,
    reason: "Both comfortable with the idea of building a shared life, given time.",
    detail: "No firm objections to meeting the other's family",
  },
  {
    label: "Distance",
    colour: "#6B5878",
    reason: "47 miles apart. Both open to travelling up to 60 miles.",
    detail: "South East England ↔ Midlands",
  },
  {
    label: "Lifestyle",
    colour: brass,
    reason: "Country walks, live music, travel — several interests overlap.",
    detail: "Not identical — complementary",
  },
];

export function AlignmentStrands() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [activeStrand, setActiveStrand] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !running) setRunning(true); },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [running]);

  useEffect(() => {
    if (!running || visibleCount >= strands.length) return;
    const t = setTimeout(() => {
      setVisibleCount(c => c + 1);
    }, visibleCount === 0 ? 500 : 620);
    return () => clearTimeout(t);
  }, [running, visibleCount]);

  useEffect(() => {
    if (visibleCount >= strands.length) {
      setTimeout(() => setComplete(true), 400);
    }
  }, [visibleCount]);

  const reset = () => {
    setVisibleCount(0);
    setRunning(false);
    setComplete(false);
    setActiveStrand(null);
    setTimeout(() => setRunning(true), 100);
  };

  return (
    <main style={{ minHeight: "100vh", background: plum, color: ivy, fontFamily: "'Space Grotesk', system-ui, sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Grotesk:wght@300;400;500;600&display=swap');
        @keyframes strand-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes line-grow { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        @keyframes outcome-in { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        .strand-visible { animation: strand-in .45s ease-out both; }
        .line-grow { animation: line-grow .55s ease-out both; transform-origin: left; }
        .outcome-in { animation: outcome-in .6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .strand-visible, .line-grow, .outcome-in { animation: none !important; } }
      `}</style>

      {/* Fine grid background — the "chapters" texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(247,243,236,1) 1px, transparent 1px), linear-gradient(90deg, rgba(247,243,236,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} aria-hidden />

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "60px 48px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.15)", maxWidth: 120 }} />
            <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: brass }}>
              How an introduction begins · Fictional example
            </p>
            <div style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.15)", maxWidth: 120 }} />
          </div>
          <h1 style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "clamp(2.2rem,4vw,3.4rem)", lineHeight: 1.1, letterSpacing: "-0.025em",
            color: ivy, marginBottom: 16
          }}>
            An introduction should have a reason.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(247,243,236,0.6)", maxWidth: 440, margin: "0 auto" }}>
            Not a score. Not a percentage. Six dimensions — each resolved into plain language — and then a considered decision.
          </p>
        </div>

        {/* People row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", alignItems: "center", gap: 8, marginBottom: 36 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: ivy }}>Sarah</div>
            <div style={{ fontSize: 13, color: "rgba(247,243,236,0.5)", marginTop: 4 }}>53 · South East England</div>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: brass, marginTop: 6 }}>Anglican</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 1, height: 28, background: "rgba(247,243,236,0.15)" }} />
            <span style={{ fontSize: 12, color: "rgba(247,243,236,0.35)" }}>↔</span>
            <div style={{ width: 1, height: 28, background: "rgba(247,243,236,0.15)" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: ivy }}>David</div>
            <div style={{ fontSize: 13, color: "rgba(247,243,236,0.5)", marginTop: 4 }}>57 · Midlands</div>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: brass, marginTop: 6 }}>Evangelical</div>
          </div>
        </div>

        {/* Strand grid */}
        <section ref={ref as React.RefObject<HTMLElement>} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {strands.map((strand, i) => {
            const visible = i < visibleCount;
            const isActive = activeStrand === i;

            return (
              <div
                key={strand.label}
                className={visible ? "strand-visible" : ""}
                style={{
                  opacity: visible ? 1 : 0,
                  animationDelay: `${i * 0.05}s`,
                  cursor: visible ? "pointer" : "default",
                  transition: "transform 150ms"
                }}
                onClick={() => visible && setActiveStrand(isActive ? null : i)}
              >
                {/* Main strand row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", gap: 12 }}>

                  {/* Left arm */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                    <div
                      className={visible ? "line-grow" : ""}
                      style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.18)", animationDelay: `${i * 0.05 + 0.1}s` }}
                    />
                    <span style={{
                      fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
                      color: strand.colour, fontWeight: 500, whiteSpace: "nowrap"
                    }}>
                      {strand.label}
                    </span>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: strand.colour, flexShrink: 0 }} />
                  </div>

                  {/* Centre card */}
                  <div style={{
                    background: isActive ? "rgba(247,243,236,0.12)" : "rgba(247,243,236,0.06)",
                    border: `1px solid ${isActive ? strand.colour + "50" : "rgba(247,243,236,0.10)"}`,
                    borderRadius: 10, padding: "14px 18px", textAlign: "center",
                    transition: "all 200ms"
                  }}>
                    <p style={{ fontSize: 13, color: "rgba(247,243,236,0.8)", lineHeight: 1.55 }}>
                      {strand.reason}
                    </p>
                  </div>

                  {/* Right arm */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: strand.colour, flexShrink: 0 }} />
                    <span style={{
                      fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
                      color: strand.colour, fontWeight: 500, whiteSpace: "nowrap"
                    }}>
                      {strand.label}
                    </span>
                    <div
                      className={visible ? "line-grow" : ""}
                      style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.18)", animationDelay: `${i * 0.05 + 0.1}s`, transformOrigin: "right" }}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                {isActive && (
                  <div style={{
                    marginTop: 8, padding: "12px 16px",
                    background: "rgba(247,243,236,0.04)", borderRadius: 8,
                    borderLeft: `2px solid ${strand.colour}`,
                    fontSize: 12, color: "rgba(247,243,236,0.5)", lineHeight: 1.6
                  }}>
                    {strand.detail}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Outcome */}
        {complete && (
          <div className="outcome-in" style={{ marginTop: 48, textAlign: "center" }}>
            <div style={{ width: "60%", height: 1, background: "rgba(247,243,236,0.12)", margin: "0 auto 32px" }} />
            <p style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: "rgba(247,243,236,0.8)", marginBottom: 12 }}>
              "Based on these six dimensions, we think it's worth saying hello."
            </p>
            <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: stone }}>
              No percentage. No match score. A considered reason — and then a choice.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32 }}>
              <button
                onClick={reset}
                style={{
                  background: "rgba(247,243,236,0.08)", border: "1px solid rgba(247,243,236,0.18)",
                  color: "rgba(247,243,236,0.7)", padding: "10px 24px", borderRadius: 8,
                  fontSize: 12, cursor: "pointer", letterSpacing: "0.08em"
                }}
              >
                ↺ Watch again
              </button>
              <a href="#" style={{
                background: oxblood, color: ivy, padding: "10px 24px",
                borderRadius: 8, fontSize: 12, letterSpacing: "0.08em", fontWeight: 500
              }}>
                Join Christian Chapter — free
              </a>
            </div>
            <p style={{ fontSize: 11, color: "rgba(247,243,236,0.3)", marginTop: 12 }}>
              Click any strand above to see more detail
            </p>
          </div>
        )}

        {/* Hint while animating */}
        {!complete && running && visibleCount > 0 && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <div style={{ display: "inline-flex", gap: 6 }}>
              {strands.map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: i < visibleCount ? brass : "rgba(247,243,236,0.15)",
                  transition: "background 300ms"
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Start button if not running */}
        {!running && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={() => setRunning(true)}
              style={{
                background: oxblood, color: ivy, border: "none",
                padding: "14px 32px", borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: "pointer"
              }}
            >
              See how an introduction builds →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default AlignmentStrands;
