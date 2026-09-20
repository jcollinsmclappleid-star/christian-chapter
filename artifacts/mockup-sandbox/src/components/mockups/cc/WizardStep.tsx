import { useState } from "react";

// Christian Chapter — Wizard Faith Step (Desktop)
// Includes religious-data GDPR consent checkbox in context

const ivy = "#F7F3EC";
const ivyDark = "#EAE4D8";
const plum = "#1E1220";
const plumMuted = "#6B5878";
const oxblood = "#8B1F2F";
const evergreen = "#1D4A36";
const stone = "#9A8E9A";
const mist = "rgba(30,18,32,0.12)";
const mistStrong = "rgba(30,18,32,0.20)";

const steps = [
  "About you",
  "Your location",
  "Your faith",
  "Your life now",
  "Relationship intentions",
  "Who you hope to meet",
  "Essentials & preferences",
  "Your three priorities",
  "Your story",
];

const traditions = ["Anglican", "Baptist", "Catholic", "Charismatic", "Evangelical", "Methodist", "Pentecostal", "Reformed", "Non-denominational", "Other"];
const attendance = ["Weekly", "Most weeks", "Monthly", "Occasionally", "Rarely"];
const centrality = ["Mostly private", "Present", "Woven through", "Central", "Everything"];

export function WizardStep() {
  const [tradition, setTradition] = useState("Anglican");
  const [attend, setAttend] = useState("Weekly");
  const [central, setCentral] = useState("Central");
  const [story, setStory] = useState("");
  const [saved, setSaved] = useState(true);
  const [gdprConsent, setGdprConsent] = useState(false);

  const save = () => {
    setSaved(false);
    window.setTimeout(() => setSaved(true), 450);
  };

  return (
    <main style={{ minHeight: "100vh", background: ivy, color: plum, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@400;500;600&display=swap');
        @keyframes cc-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        .cc-in { animation: cc-in .6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .cc-in { animation: none !important; } }
      `}</style>

      {/* Progress bar */}
      <div style={{ height: 3, background: ivyDark }}>
        <div style={{ width: "33.3%", height: "100%", background: oxblood, transition: "width 600ms ease" }} />
      </div>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 68, borderBottom: `1px solid ${mist}` }}>
        <div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: plum, letterSpacing: "-0.02em" }}>Christian Chapter</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: stone }}>
          <span>Step 3 of 9</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: oxblood, display: "inline-block" }} />
          <span style={{ color: saved ? stone : plumMuted }}>{saved ? "Progress saved" : "Saving…"}</span>
        </div>
      </header>

      {/* Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", maxWidth: 1200, margin: "0 auto", padding: "48px 40px" }}>

        {/* Sidebar */}
        <aside style={{ borderRight: `1px solid ${mist}`, paddingRight: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: oxblood, marginBottom: 28 }}>
            Your introduction
          </p>
          <nav>
            {steps.map((step, i) => {
              const done = i < 2;
              const active = i === 2;
              return (
                <div
                  key={step}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, minHeight: 48,
                    paddingLeft: 16, borderLeft: `2px solid ${active ? oxblood : "transparent"}`,
                    marginBottom: 2,
                  }}
                >
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    border: `1px solid ${done ? oxblood : active ? oxblood : mistStrong}`,
                    fontSize: 10, color: done ? oxblood : active ? oxblood : stone,
                  }}>
                    {done ? "✓" : i + 1}
                  </span>
                  <span style={{
                    fontSize: 14, color: active ? plum : stone,
                    fontWeight: active ? 500 : 400,
                  }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </nav>
          <p style={{ marginTop: 48, fontSize: 13, lineHeight: 1.65, color: stone, maxWidth: 190 }}>
            There's no right way to answer. Just tell us what feels true for you.
          </p>
        </aside>

        {/* Main content */}
        <section className="cc-in" style={{ maxWidth: 700, paddingLeft: 56, paddingBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: oxblood, marginBottom: 20 }}>
            Step 3 of 9
          </p>
          <h1 style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 54, lineHeight: 1, letterSpacing: "-0.025em", color: plum, marginBottom: 20
          }}>
            Your faith
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.72, color: plumMuted, maxWidth: 580, marginBottom: 40 }}>
            We'll use this to help identify people whose faith is genuinely compatible with yours.
          </p>

          {/* GDPR consent — prominent, in context */}
          <div style={{
            background: "#EAF2EE", border: `1px solid ${evergreen}30`,
            borderRadius: 10, padding: "20px 24px", marginBottom: 40,
            display: "flex", alignItems: "flex-start", gap: 16
          }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", width: "100%" }}>
              <div
                onClick={() => setGdprConsent(!gdprConsent)}
                style={{
                  width: 22, height: 22, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  border: `2px solid ${gdprConsent ? evergreen : mistStrong}`,
                  background: gdprConsent ? evergreen : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 150ms"
                }}
              >
                {gdprConsent && <span style={{ color: ivy, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
              <div>
                <p style={{ fontSize: 14, color: plum, fontWeight: 500, marginBottom: 4 }}>
                  I consent to Christian Chapter processing my religious belief data
                </p>
                <p style={{ fontSize: 12, color: plumMuted, lineHeight: 1.6 }}>
                  Your faith information is special category data under UK GDPR. We collect it only to identify compatible introductions. It is never displayed publicly and is not sold to third parties. You may withdraw consent at any time from your account settings.
                </p>
              </div>
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Christian tradition */}
            <div>
              <label style={{ display: "block", fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
                Christian tradition
              </label>
              <select
                value={tradition}
                onChange={e => { setTradition(e.target.value); save(); }}
                style={{
                  width: "100%", padding: "14px 44px 14px 16px", height: 52,
                  background: ivy, border: `1px solid ${mistStrong}`, borderRadius: 8,
                  fontSize: 15, color: plum, appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231E1220' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                  outline: "none", cursor: "pointer"
                }}
              >
                {traditions.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Church attendance */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend style={{ fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
                Church attendance
              </legend>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", border: `1px solid ${mistStrong}`, borderRadius: 8, overflow: "hidden" }}>
                {attendance.map((x, i) => (
                  <button
                    type="button"
                    key={x}
                    onClick={() => { setAttend(x); save(); }}
                    style={{
                      minHeight: 52, padding: "0 8px",
                      fontSize: 13, fontWeight: attend === x ? 600 : 400,
                      background: attend === x ? oxblood : ivy,
                      color: attend === x ? ivy : plumMuted,
                      border: "none",
                      borderRight: i < attendance.length - 1 ? `1px solid ${mist}` : "none",
                      cursor: "pointer", transition: "all 150ms"
                    }}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Faith centrality */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend style={{ fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
                How central is faith to your daily life?
              </legend>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {centrality.map(x => (
                  <button
                    type="button"
                    key={x}
                    onClick={() => { setCentral(x); save(); }}
                    style={{
                      minHeight: 56, padding: "0 8px",
                      border: `1px solid ${central === x ? oxblood : mistStrong}`,
                      borderRadius: 8,
                      fontSize: 12, lineHeight: 1.4,
                      background: central === x ? "#F5ECEE" : ivy,
                      color: central === x ? oxblood : plumMuted,
                      cursor: "pointer", transition: "all 150ms",
                      fontWeight: central === x ? 500 : 400
                    }}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Day-to-day faith narrative */}
            <div>
              <label style={{ display: "block", fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
                What does faith look like for you day to day?
              </label>
              <textarea
                value={story}
                onChange={e => { setStory(e.target.value); setSaved(false); }}
                onBlur={save}
                rows={4}
                placeholder="Feel free to be as specific or as general as you like."
                style={{
                  width: "100%", padding: "16px", resize: "vertical",
                  border: `1px solid ${mistStrong}`, borderRadius: 8,
                  fontSize: 15, lineHeight: 1.65, color: plum,
                  background: ivy, outline: "none",
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              />
            </div>
          </div>

          {/* Privacy note */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, fontSize: 12, color: stone }}>
            <span style={{ color: evergreen, fontSize: 14 }}>◇</span>
            Used for matching only — never displayed on your public profile
          </div>

          {/* Navigation */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderTop: `1px solid ${mist}`, marginTop: 48, paddingTop: 28
          }}>
            <button type="button" style={{ minHeight: 48, fontSize: 14, color: plumMuted, background: "none", border: "none", cursor: "pointer" }}>
              ← Back
            </button>
            <button
              type="button"
              disabled={!gdprConsent}
              style={{
                minHeight: 52, padding: "0 36px",
                background: gdprConsent ? oxblood : ivyDark,
                color: gdprConsent ? ivy : stone,
                border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
                cursor: gdprConsent ? "pointer" : "not-allowed",
                transition: "all 200ms"
              }}
            >
              Continue →
            </button>
          </div>
          {!gdprConsent && (
            <p style={{ textAlign: "right", fontSize: 12, color: stone, marginTop: 8 }}>
              Please confirm consent above to continue
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default WizardStep;
