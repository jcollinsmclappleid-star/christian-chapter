import { useState } from "react";

const ivy = "#F7F3EC";
const ivyDark = "#EAE4D8";
const plum = "#1E1220";
const plumMuted = "#6B5878";
const oxblood = "#8B1F2F";
const evergreen = "#1D4A36";
const stone = "#9A8E9A";
const mist = "rgba(30,18,32,0.12)";

export function HomepageMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main style={{ background: ivy, color: plum, fontFamily: "'Space Grotesk', system-ui, sans-serif", minHeight: "100dvh", overflowX: "hidden", maxWidth: 390 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Space+Grotesk:wght@400;500;600&display=swap');
        @keyframes cc-rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        .cc-rise { animation: cc-rise .7s ease-out both; }
        .cc-d1 { animation-delay:.1s } .cc-d2 { animation-delay:.22s }
      `}</style>

      {/* Header */}
      <header style={{ background: `${ivy}F2`, borderBottom: `1px solid ${mist}`, backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
          <div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: plum, letterSpacing: "-0.02em" }}>Christian Chapter</div>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: stone, marginTop: 1 }}>UK Christian dating</div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: plum, fontSize: 18, background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div style={{ padding: "12px 20px 20px", borderTop: `1px solid ${mist}` }}>
            {["How it works", "Safety", "Pricing"].map(l => (
              <div key={l} style={{ padding: "14px 0", borderBottom: `1px solid ${mist}`, fontSize: 16, color: plum }}>{l}</div>
            ))}
            <a href="#" style={{ display: "block", marginTop: 16, background: oxblood, color: ivy, padding: "14px 20px", borderRadius: 10, textAlign: "center", fontSize: 15, fontWeight: 500 }}>
              Join free
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ padding: "48px 20px 52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 32, height: 1, background: oxblood }} />
          <span style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: oxblood }}>
            Christians 40–70 · UK-wide
          </span>
        </div>

        <h1 className="cc-rise" style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "clamp(2.6rem,10vw,3.2rem)",
          lineHeight: 1.04, letterSpacing: "-0.025em", color: plum, marginBottom: 20
        }}>
          Christian dating for<br />
          <em style={{ fontStyle: "italic", color: oxblood }}>your next chapter.</em>
        </h1>

        <p className="cc-rise cc-d1" style={{ fontSize: 16, lineHeight: 1.72, color: plumMuted, marginBottom: 32 }}>
          Considered introductions based on faith, life stage and intentions — not endless swiping.
        </p>

        <a className="cc-rise cc-d2" href="#" style={{
          display: "block", background: oxblood, color: ivy,
          padding: "16px 20px", borderRadius: 10, textAlign: "center", fontSize: 15, fontWeight: 500
        }}>
          Join as a founding member — free
        </a>
        <a href="#" style={{ display: "block", textAlign: "center", marginTop: 14, fontSize: 13, color: plumMuted }}>
          See how introductions work →
        </a>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
          {["Faith-first", "Founding phase — free", "UK-wide"].map(t => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: stone }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: evergreen, display: "inline-block" }} />
              {t}
            </span>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: mist }} />

      {/* Approach */}
      <section style={{ padding: "48px 20px" }}>
        <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: oxblood, marginBottom: 16 }}>The premise</p>
        <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.02em", color: plum, marginBottom: 24 }}>
          Not a marketplace.<br /><em style={{ fontStyle: "italic" }}>A considered beginning.</em>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.72, color: plumMuted }}>
          We listen for the things that hold a relationship together: faith alignment, life stage, intentions, distance. An introduction comes with a reason — not a score.
        </p>
      </section>

      {/* Mini strands */}
      <section style={{ background: plum, padding: "48px 20px" }}>
        <p style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "#C4A05A", marginBottom: 14 }}>Fictional example</p>
        <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: ivy, marginBottom: 28, letterSpacing: "-0.02em" }}>
          An introduction should have a reason.
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, color: ivy }}>Sarah, 53</div>
            <div style={{ fontSize: 11, color: "rgba(247,243,236,0.5)", marginTop: 2 }}>South East England</div>
          </div>
          <div style={{ width: 1, background: "rgba(247,243,236,0.15)" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, color: ivy }}>David, 57</div>
            <div style={{ fontSize: 11, color: "rgba(247,243,236,0.5)", marginTop: 2 }}>Midlands</div>
          </div>
        </div>
        {[
          ["Faith", "Church community is central to both"],
          ["Intention", "Both seeking a committed long-term relationship"],
          ["Life stage", "Both have independent adult children"],
          ["Distance", "47 miles · Both open to 60 miles"],
        ].map(([label, reason]) => (
          <div key={label} style={{ padding: "14px 0", borderBottom: "1px solid rgba(247,243,236,0.1)" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4A05A", marginRight: 12 }}>{label}</span>
            <span style={{ fontSize: 13, color: "rgba(247,243,236,0.7)" }}>{reason}</span>
          </div>
        ))}
      </section>

      {/* Essentials (simplified mobile) */}
      <section style={{ background: ivyDark, padding: "48px 20px" }}>
        <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: oxblood, marginBottom: 16 }}>Your preferences</p>
        <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 32, color: plum, letterSpacing: "-0.02em", marginBottom: 20 }}>My Essentials</h2>
        <p style={{ fontSize: 15, color: plumMuted, lineHeight: 1.65, marginBottom: 28 }}>
          Set what matters most. We never introduce you to someone who breaks a firm requirement you've set.
        </p>
        {[
          { t: "Essential", c: oxblood, e: "Non-smoker — firm requirement" },
          { t: "Preferred", c: evergreen, e: "Same denomination — ranked higher" },
          { t: "Open-minded", c: stone, e: "Has young children — worth discussing" },
        ].map(({ t, c, e }) => (
          <div key={t} style={{ padding: "14px 0", borderBottom: `1px solid ${mist}` }}>
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c, fontWeight: 600 }}>{t}</span>
            <div style={{ fontSize: 13, color: plumMuted, marginTop: 4 }}>{e}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: "52px 20px 64px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 32, lineHeight: 1.1, letterSpacing: "-0.02em", color: plum, marginBottom: 16 }}>
          Your next chapter<br /><em style={{ fontStyle: "italic" }}>begins here.</em>
        </h2>
        <p style={{ fontSize: 15, color: plumMuted, lineHeight: 1.7, marginBottom: 32 }}>
          Free during the founding phase. No credit card.
        </p>
        <a href="#" style={{
          display: "block", background: oxblood, color: ivy,
          padding: "18px 20px", borderRadius: 10, fontSize: 15, fontWeight: 500,
          textAlign: "center"
        }}>
          Join free — founding member
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${mist}`, padding: "20px", background: ivyDark, textAlign: "center" }}>
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: plum, marginBottom: 12 }}>Christian Chapter</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {["Privacy", "Terms", "Cookies"].map(l => (
            <a key={l} href="#" style={{ fontSize: 11, color: stone }}>{l}</a>
          ))}
        </div>
      </footer>
    </main>
  );
}

export default HomepageMobile;
