import { useState } from "react";

const ivy = "#F7F3EC";
const ivyDark = "#EAE4D8";
const plum = "#1E1220";
const plumMuted = "#6B5878";
const oxblood = "#8B1F2F";
const evergreen = "#1D4A36";
const stone = "#9A8E9A";
const mist = "rgba(30,18,32,0.12)";

export function WizardConfirm() {
  const [shared, setShared] = useState(false);

  return (
    <main style={{ minHeight: "100vh", background: ivy, color: plum, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Grotesk:wght@400;500;600&display=swap');
        @keyframes cc-confirm { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes cc-badge { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:none; } }
        .cc-confirm { animation: cc-confirm .9s ease-out both; }
        .cc-badge { animation: cc-badge .7s .3s cubic-bezier(.2,.8,.3,1.1) both; }
        @media (prefers-reduced-motion: reduce) { .cc-confirm, .cc-badge { animation: none !important; } }
      `}</style>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 48px", borderBottom: `1px solid ${mist}` }}>
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: plum }}>Christian Chapter</div>
        <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: stone }}>
          Christian dating for your next chapter.
        </span>
      </header>

      <div className="cc-confirm" style={{ maxWidth: 980, margin: "0 auto", padding: "64px 48px" }}>

        {/* Welcome banner */}
        <section style={{ textAlign: "center", paddingBottom: 56, borderBottom: `1px solid ${mist}` }}>
          <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: oxblood, marginBottom: 32 }}>
            Welcome to the community
          </p>

          {/* Founding member badge */}
          <div className="cc-badge" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 240, height: 68, margin: "0 auto 36px",
            border: `1px solid ${oxblood}50`,
            background: "#F5ECEE",
            borderRadius: 8
          }}>
            <span style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: oxblood, fontWeight: 600 }}>
              Founding member
            </span>
          </div>

          <h1 style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 52, lineHeight: 1.08, letterSpacing: "-0.025em",
            color: plum, maxWidth: 680, margin: "0 auto 28px"
          }}>
            You're a founding member of Christian Chapter.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: plumMuted, maxWidth: 560, margin: "0 auto" }}>
            Your profile is now part of our founding community. As the community grows, we'll look for promising mutual connections — and invite you both to consider an introduction when we find one.
          </p>
        </section>

        {/* Profile completeness */}
        <section style={{ padding: "40px 0", borderBottom: `1px solid ${mist}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{
              position: "relative", width: 56, height: 56,
              border: `2px solid ${oxblood}40`, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: oxblood }}>90%</span>
            </div>
            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: plum }}>Your profile</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {["About you ✓", "Your faith ✓", "Your story ✓"].map(s => (
              <span key={s} style={{ fontSize: 13, color: evergreen, fontWeight: 500 }}>{s}</span>
            ))}
            <span style={{ fontSize: 13, color: stone }}>Photos — add when you're ready →</span>
          </div>
        </section>

        {/* What happens next */}
        <section style={{ padding: "40px 0", borderBottom: `1px solid ${mist}` }}>
          <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: oxblood, marginBottom: 32 }}>
            What happens next
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              ["01", "Your profile is reviewed by our team before entering introductions."],
              ["02", "We look for someone whose faith, life stage, intentions and distance align with yours."],
              ["03", "If we find a promising connection, we'll invite you both to consider an introduction."],
            ].map(([num, text]) => (
              <div key={num} style={{ borderTop: `2px solid ${oxblood}50`, paddingTop: 20 }}>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 32, color: oxblood, marginBottom: 16 }}>{num}</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: plumMuted }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Referral */}
        <section style={{ padding: "32px 0 0" }}>
          <p style={{ fontSize: 16, color: plum, marginBottom: 12 }}>
            Know someone who might appreciate a different kind of Christian dating?
          </p>
          <button
            type="button"
            onClick={() => setShared(true)}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontSize: 13, color: oxblood,
              borderBottom: `1px solid ${oxblood}50`, paddingBottom: 2
            }}
          >
            {shared ? "Thank you — link copied" : "Share Christian Chapter →"}
          </button>
        </section>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 56 }}>
          <button type="button" style={{
            minHeight: 52, padding: "0 32px",
            background: oxblood, color: ivy, border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer"
          }}>
            View your profile
          </button>
          <button type="button" style={{
            minHeight: 48, background: "none", border: "none",
            fontSize: 14, color: plumMuted, cursor: "pointer"
          }}>
            Return to homepage
          </button>
        </div>
      </div>
    </main>
  );
}

export default WizardConfirm;
