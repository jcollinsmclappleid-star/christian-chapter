import { useState } from "react";

// Christian Chapter — Homepage (Desktop)
// Visual direction: ivory · plum · oxblood · evergreen · brass (sparingly)
// Typography: EB Garamond display, Space Grotesk UI
// Chapters-and-connections metaphor: fine lines, considered moments

const ivy = "#F7F3EC";
const ivyDark = "#EAE4D8";
const plum = "#1E1220";
const plumMuted = "#6B5878";
const oxblood = "#8B1F2F";
const evergreen = "#1D4A36";
const brass = "#C4A05A";
const stone = "#9A8E9A";
const mist = "rgba(30,18,32,0.12)";

const strands = [
  { label: "Faith", reason: "Church community is central to both" },
  { label: "Intention", reason: "Both seeking a committed long-term relationship" },
  { label: "Life stage", reason: "Both have adult children who are independent" },
  { label: "Distance", reason: "47 miles apart · Both open to travelling up to 60 miles" },
  { label: "Lifestyle", reason: "Country walks, live music, travel — many interests in common" },
];

export function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [strandCount, setStrandCount] = useState(5);

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: ivy, color: plum, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Grotesk:wght@300;400;500;600&display=swap');
        @keyframes cc-rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes cc-strand { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .cc-rise { animation: cc-rise .85s cubic-bezier(.2,.8,.2,1) both; }
        .cc-d1 { animation-delay:.1s } .cc-d2 { animation-delay:.22s } .cc-d3 { animation-delay:.36s }
        .cc-strand { animation: cc-strand .5s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .cc-rise, .cc-strand { animation: none !important; } }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${mist}`, background: `${ivy}F4`, backdropFilter: "blur(8px)" }}
        className="sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between px-10 py-5" style={{ maxWidth: 1160 }}>
          <a href="#top" style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 20, color: plum, letterSpacing: "-0.02em" }}>
              Christian Chapter
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: stone, marginTop: 2 }}>
              UK Christian dating
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-10">
            {["How it works", "Safety", "Pricing"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: plumMuted, letterSpacing: "0.04em", transition: "color 150ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = plum)}
                onMouseLeave={e => (e.currentTarget.style.color = plumMuted)}>
                {l}
              </a>
            ))}
            <a href="#" style={{
              background: oxblood, color: ivy, padding: "10px 22px", fontSize: 13,
              borderRadius: 8, fontWeight: 500, letterSpacing: "0.04em"
            }}>
              Join free
            </a>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ color: plum, fontSize: 20 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: ivy, borderTop: `1px solid ${mist}`, padding: "20px 40px 24px" }}>
            {["How it works", "Safety", "Pricing", "Join free"].map(l => (
              <div key={l} style={{ padding: "12px 0", borderBottom: `1px solid ${mist}`, fontSize: 16, color: plum }}>{l}</div>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="top" style={{ paddingTop: "clamp(60px,9vw,110px)", paddingBottom: "clamp(60px,9vw,110px)" }}>
        <div className="mx-auto px-10" style={{ maxWidth: 1160 }}>
          {/* Horizontal rule accent */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 48, height: 1, background: oxblood }} />
            <span style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: oxblood }}>
              For Christian singles · 40–70 · UK-wide
            </span>
          </div>

          <h1 className="cc-rise" style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(3rem,6vw,5.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: plum,
            maxWidth: 680,
            margin: "0 0 32px"
          }}>
            Christian dating for<br />
            <em style={{ fontStyle: "italic", color: oxblood }}>your next chapter.</em>
          </h1>

          <p className="cc-rise cc-d1" style={{
            fontSize: 18, lineHeight: 1.72, color: plumMuted, maxWidth: 520, marginBottom: 44
          }}>
            Meet genuine Christian singles who share your faith, values and hopes for what comes next. Considered introductions — not endless swiping.
          </p>

          <div className="cc-rise cc-d2" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <a href="#" style={{
              background: oxblood, color: ivy,
              padding: "16px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500,
              letterSpacing: "0.04em", display: "inline-block"
            }}>
              Join as a founding member — free
            </a>
            <a href="#how" style={{
              fontSize: 13, color: plumMuted, borderBottom: `1px solid ${mist}`,
              paddingBottom: 2, letterSpacing: "0.02em"
            }}>
              See how introductions work →
            </a>
          </div>

          {/* Trust row */}
          <div className="cc-rise cc-d3" style={{ display: "flex", flexWrap: "wrap", gap: 28, marginTop: 56 }}>
            {["Faith-first introductions", "Founding phase — free to join", "UK-wide service", "Considered, not algorithmic"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: stone }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: evergreen, display: "inline-block" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Thin rule */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${mist}, transparent)` }} />

      {/* Approach */}
      <section id="approach" style={{ padding: "clamp(60px,8vw,100px) 0" }}>
        <div className="mx-auto px-10" style={{ maxWidth: 1160, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: oxblood, marginBottom: 20 }}>
              The premise
            </p>
            <h2 style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(2.2rem,4vw,3.6rem)",
              lineHeight: 1.07, letterSpacing: "-0.025em", color: plum, marginBottom: 24
            }}>
              Not a marketplace.<br />
              <em style={{ fontStyle: "italic" }}>A considered beginning.</em>
            </h2>
            <div style={{ width: 48, height: 1, background: `${oxblood}60` }} />
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.75, color: plumMuted, maxWidth: 480 }}>
            <p>At this stage of life, the question is rarely "Who is available?" It is "Who might understand the shape of my life?"</p>
            <p style={{ marginTop: 20 }}>We listen for the things that hold a relationship together: faith alignment, life stage, intentions, distance, and the values you want to live by. Then we introduce — not recommend.</p>
            <p style={{ marginTop: 20 }}>An introduction comes with a reason. You know why we thought this person was worth meeting.</p>
          </div>
        </div>
      </section>

      {/* Alignment strands section */}
      <section id="how" style={{ background: plum, padding: "clamp(60px,8vw,100px) 0" }}>
        <div className="mx-auto px-10" style={{ maxWidth: 1160 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: brass, marginBottom: 16 }}>
              Fictional example — how an introduction works
            </p>
            <h2 style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.1,
              color: ivy, letterSpacing: "-0.02em"
            }}>
              An introduction should have a reason.
            </h2>
            <p style={{ marginTop: 16, fontSize: 16, color: "rgba(247,243,236,0.65)", maxWidth: 440, margin: "16px auto 0" }}>
              Before we introduce two people, we look at what they share — and what would need a conversation.
            </p>
          </div>

          {/* Names */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 8, marginBottom: 28, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, color: ivy }}>Sarah</div>
              <div style={{ fontSize: 13, color: "rgba(247,243,236,0.5)", marginTop: 4 }}>53 · South East England</div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: brass, marginTop: 4 }}>Anglican</div>
            </div>
            <div style={{ width: 1, height: 48, background: "rgba(247,243,236,0.15)", margin: "0 auto" }} />
            <div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, color: ivy }}>David</div>
              <div style={{ fontSize: 13, color: "rgba(247,243,236,0.5)", marginTop: 4 }}>57 · Midlands</div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: brass, marginTop: 4 }}>Church of England</div>
            </div>
          </div>

          {/* Strands */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {strands.slice(0, strandCount).map((s, i) => (
              <div key={s.label} className="cc-strand" style={{ animationDelay: `${i * 0.1}s`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: i % 2 === 0 ? oxblood : evergreen }}>{s.label}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.15)" }} />
                </div>
                <div style={{ background: "rgba(247,243,236,0.07)", border: "1px solid rgba(247,243,236,0.1)", borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: "rgba(247,243,236,0.75)", lineHeight: 1.5 }}>{s.reason}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(247,243,236,0.15)" }} />
                  <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: i % 2 === 0 ? oxblood : evergreen }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {strandCount >= strands.length && (
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <p style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 22, color: "rgba(247,243,236,0.75)" }}>
                "Based on these five dimensions, we think it's worth saying hello."
              </p>
              <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: stone, marginTop: 12 }}>
                No percentage. No algorithm score. Just a considered reason.
              </p>
            </div>
          )}
          {strandCount < strands.length && (
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <button onClick={() => setStrandCount(c => Math.min(c + 1, strands.length))}
                style={{ background: "rgba(247,243,236,0.1)", border: "1px solid rgba(247,243,236,0.2)", color: ivy, padding: "10px 24px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                Continue →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* My Essentials */}
      <section style={{ padding: "clamp(60px,8vw,100px) 0", background: ivyDark }}>
        <div className="mx-auto px-10" style={{ maxWidth: 1160 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: oxblood, marginBottom: 16 }}>
              Your preferences, respected
            </p>
            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(2rem,3.5vw,3rem)", color: plum, letterSpacing: "-0.02em" }}>
              My Essentials
            </h2>
            <p style={{ marginTop: 16, fontSize: 16, color: plumMuted, maxWidth: 500, margin: "16px auto 0", lineHeight: 1.7 }}>
              Set what matters most. We never introduce you to someone who breaks a firm requirement.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { tier: "Essential", colour: oxblood, bg: "#F5ECEE", border: `${oxblood}30`, desc: "A firm boundary. We never override it.", example: "Non-smoker" },
              { tier: "Preferred", colour: evergreen, bg: "#EAF2EE", border: `${evergreen}30`, desc: "Important to you. Shapes the quality of introductions.", example: "Same denomination" },
              { tier: "Open-minded", colour: stone, bg: ivy, border: mist, desc: "Worth discussing. Won't reduce your recommendations.", example: "Has young children" },
            ].map(({ tier, colour, bg, border, desc, example }) => (
              <div key={tier} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "28px 24px" }}>
                <p style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: colour, fontWeight: 600, marginBottom: 12 }}>{tier}</p>
                <p style={{ fontSize: 15, color: plum, lineHeight: 1.6, marginBottom: 20 }}>{desc}</p>
                <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16 }}>
                  <span style={{ fontSize: 12, color: stone }}>Example: </span>
                  <span style={{ fontSize: 12, color: colour, fontWeight: 500 }}>{example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety strip */}
      <section style={{ background: evergreen, padding: "clamp(60px,8vw,100px) 0" }}>
        <div className="mx-auto px-10" style={{ maxWidth: 1160, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(247,243,236,0.6)", marginBottom: 20 }}>
              Built to be trustworthy
            </p>
            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(2rem,3.5vw,3rem)", color: ivy, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
              Safety is part of the product, not a footnote.
            </h2>
            <a href="#" style={{ display: "inline-block", marginTop: 24, fontSize: 13, color: "rgba(247,243,236,0.65)", borderBottom: "1px solid rgba(247,243,236,0.3)", paddingBottom: 2 }}>
              How we're designing for safety →
            </a>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Phone and selfie verification before introductions",
              "Profile and image review by our team",
              "Romance fraud pattern detection",
              "Private calling — your number is never shared",
              "Report from any profile or message in two taps",
            ].map(item => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "rgba(247,243,236,0.85)" }}>
                <span style={{ color: "rgba(247,243,236,0.5)", marginTop: 2, flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Founding member CTA */}
      <section style={{ padding: "clamp(60px,8vw,100px) 0" }}>
        <div className="mx-auto px-10 text-center" style={{ maxWidth: 760 }}>
          <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(2.4rem,5vw,4rem)", lineHeight: 1.08, letterSpacing: "-0.025em", color: plum, marginBottom: 24 }}>
            Your next chapter<br />
            <em style={{ fontStyle: "italic" }}>starts with a conversation.</em>
          </h2>
          <p style={{ fontSize: 17, color: plumMuted, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
            Join free. Tell us about yourself and who you're hoping to meet. Founding membership is free — no credit card, no expiry date.
          </p>
          <a href="#" style={{
            display: "inline-block", background: oxblood, color: ivy,
            padding: "18px 40px", borderRadius: 10, fontSize: 15, fontWeight: 500, letterSpacing: "0.04em"
          }}>
            Join as a founding member — free
          </a>
          <p style={{ marginTop: 20, fontSize: 13, color: stone }}>
            We do not guarantee a match. We'll be in touch when we identify a promising mutual connection.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${mist}`, padding: "28px 40px", background: ivyDark }}>
        <div className="mx-auto flex justify-between items-center" style={{ maxWidth: 1160, flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: plum }}>Christian Chapter</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Cookies"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: stone, letterSpacing: "0.02em" }}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 12, color: stone }}>© 2025 Christian Chapter Ltd</span>
        </div>
      </footer>
    </main>
  );
}

export default Homepage;
