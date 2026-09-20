import { useState } from "react";

const ivy = "#F7F3EC";
const ivyDark = "#EAE4D8";
const plum = "#1E1220";
const plumMuted = "#6B5878";
const oxblood = "#8B1F2F";
const evergreen = "#1D4A36";
const stone = "#9A8E9A";
const mist = "rgba(30,18,32,0.12)";

const attendance = ["Weekly", "Most weeks", "Monthly", "Occasionally", "Rarely"];
const centrality = ["Mostly private", "Present", "Woven through", "Central", "Everything"];

export function WizardMobile() {
  const [attend, setAttend] = useState("Weekly");
  const [central, setCentral] = useState("Central");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [saved, setSaved] = useState(true);

  return (
    <main style={{
      minHeight: "100dvh", background: ivy, color: plum,
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      maxWidth: 390, paddingBottom: 100, position: "relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Grotesk:wght@400;500;600&display=swap');
      `}</style>

      {/* Progress */}
      <div style={{ height: 3, background: ivyDark }}>
        <div style={{ width: "33.3%", height: "100%", background: oxblood }} />
      </div>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${mist}` }}>
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: plum }}>Christian Chapter</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: stone }}>
          <span style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>Step 3 of 9</span>
          <span style={{ color: saved ? stone : plumMuted, fontSize: 10 }}>· {saved ? "Saved" : "Saving…"}</span>
        </div>
      </header>

      <section style={{ padding: "32px 20px 0" }}>
        <p style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: oxblood, marginBottom: 12 }}>
          Step 3 of 9
        </p>
        <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.02em", color: plum, marginBottom: 14 }}>
          Your faith
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.68, color: plumMuted, marginBottom: 32 }}>
          Help us understand what matters to you, so we can find genuine compatibility.
        </p>

        {/* GDPR consent — in-context, before faith questions */}
        <div style={{
          background: "#EAF2EE", border: `1px solid ${evergreen}25`,
          borderRadius: 10, padding: "16px", marginBottom: 28
        }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <div
              onClick={() => setGdprConsent(!gdprConsent)}
              style={{
                width: 22, height: 22, borderRadius: 5, flexShrink: 0, marginTop: 2,
                border: `2px solid ${gdprConsent ? evergreen : "rgba(30,18,32,0.25)"}`,
                background: gdprConsent ? evergreen : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 150ms"
              }}
            >
              {gdprConsent && <span style={{ color: ivy, fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <div>
              <p style={{ fontSize: 13, color: plum, fontWeight: 500, lineHeight: 1.4, marginBottom: 4 }}>
                I consent to processing my religious belief data
              </p>
              <p style={{ fontSize: 11, color: plumMuted, lineHeight: 1.55 }}>
                Your faith information is UK GDPR special category data. Used only for introductions. Never displayed publicly. Withdraw any time in settings.
              </p>
            </div>
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Denomination */}
          <div>
            <label style={{ display: "block", fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
              Christian tradition
            </label>
            <select style={{
              width: "100%", padding: "14px 16px", height: 52,
              background: ivy, border: `1px solid rgba(30,18,32,0.20)`,
              borderRadius: 8, fontSize: 15, color: plum, appearance: "none",
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              {["Anglican", "Baptist", "Catholic", "Evangelical", "Methodist", "Non-denominational", "Other"].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Attendance — stacked on mobile */}
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
              Church attendance
            </legend>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {attendance.map(x => (
                <button
                  type="button"
                  key={x}
                  onClick={() => { setAttend(x); setSaved(false); window.setTimeout(() => setSaved(true), 450); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    minHeight: 52, padding: "0 16px",
                    border: `1px solid ${attend === x ? oxblood : "rgba(30,18,32,0.18)"}`,
                    borderRadius: 8,
                    background: attend === x ? "#F5ECEE" : ivy,
                    color: attend === x ? oxblood : plumMuted,
                    fontSize: 15, cursor: "pointer", transition: "all 150ms",
                    fontWeight: attend === x ? 500 : 400,
                    textAlign: "left"
                  }}
                >
                  {x}
                  {attend === x && <span style={{ color: oxblood, fontSize: 14 }}>✓</span>}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Centrality — horizontal scroll chips */}
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
              How central is faith to your daily life?
            </legend>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {centrality.map(x => (
                <button
                  type="button"
                  key={x}
                  onClick={() => { setCentral(x); setSaved(false); window.setTimeout(() => setSaved(true), 450); }}
                  style={{
                    minHeight: 72, minWidth: 80, padding: "0 10px",
                    border: `1px solid ${central === x ? oxblood : "rgba(30,18,32,0.18)"}`,
                    borderRadius: 8, flexShrink: 0,
                    background: central === x ? "#F5ECEE" : ivy,
                    color: central === x ? oxblood : plumMuted,
                    fontSize: 12, lineHeight: 1.4, cursor: "pointer", transition: "all 150ms",
                    fontWeight: central === x ? 500 : 400
                  }}
                >
                  {x}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Narrative */}
          <div>
            <label style={{ display: "block", fontSize: 15, color: plum, marginBottom: 10, fontWeight: 500 }}>
              What does faith look like for you day to day?
            </label>
            <textarea
              rows={4}
              placeholder="Feel free to be as specific or as general as you like."
              onBlur={() => setSaved(true)}
              style={{
                width: "100%", padding: "14px 16px", resize: "none",
                border: "1px solid rgba(30,18,32,0.20)", borderRadius: 8,
                fontSize: 15, lineHeight: 1.65, color: plum, background: ivy, outline: "none",
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            />
            <p style={{ fontSize: 11, color: stone, marginTop: 8 }}>
              ◇ Used for matching only — not displayed publicly
            </p>
          </div>
        </div>
      </section>

      {/* Fixed bottom nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 390, margin: "0 auto",
        display: "flex", alignItems: "center", gap: 12,
        minHeight: 84, padding: "0 20px",
        borderTop: `1px solid ${mist}`, background: `${ivy}F8`, backdropFilter: "blur(8px)"
      }}>
        <button type="button" style={{
          minHeight: 48, padding: "0 16px",
          background: "none", border: `1px solid rgba(30,18,32,0.18)`, borderRadius: 8,
          fontSize: 14, color: plumMuted, cursor: "pointer"
        }}>
          ← Back
        </button>
        <button
          type="button"
          disabled={!gdprConsent}
          style={{
            flex: 1, minHeight: 52, border: "none", borderRadius: 8,
            background: gdprConsent ? oxblood : ivyDark,
            color: gdprConsent ? ivy : stone,
            fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
            cursor: gdprConsent ? "pointer" : "not-allowed", transition: "all 200ms"
          }}
        >
          Continue →
        </button>
      </nav>
    </main>
  );
}

export default WizardMobile;
