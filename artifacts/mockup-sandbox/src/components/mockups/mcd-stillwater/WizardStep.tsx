import React, { useState } from "react";

const steps = ["About you", "Your location", "Your faith", "Your life now", "Relationship intentions", "Who you hope to meet", "Essentials & preferences", "Your three priorities", "Your story"];
const traditions = ["Anglican", "Baptist", "Catholic", "Charismatic", "Evangelical", "Methodist", "Pentecostal", "Reformed", "Non-denominational", "Other"];
const attendance = ["Weekly", "Most weeks", "Monthly", "Occasionally", "Rarely"];
const centrality = ["Mostly private", "Present", "Woven through", "Central", "Everything"];

export function WizardStep() {
  const [tradition, setTradition] = useState("Anglican");
  const [attend, setAttend] = useState("Weekly");
  const [central, setCentral] = useState("Central");
  const [story, setStory] = useState("");
  const [saved, setSaved] = useState(true);

  const save = () => { setSaved(false); window.setTimeout(() => setSaved(true), 450); };
  return (
    <main className="min-h-screen bg-[#0E1621] text-[#F4F0E8] font-['Space_Grotesk']">
      <style>{`@keyframes sw-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.sw-in{animation:sw-in .65s ease-out both}@media(prefers-reduced-motion:reduce){.sw-in{animation:none}}`}</style>
      <div className="h-1 w-full bg-[#182633]"><div className="h-full w-1/3 bg-[#C8A46B]" /></div>
      <header className="flex h-20 items-center justify-between border-b border-[#a5b0bb]/15 px-10">
        <div className="text-[11px] font-medium uppercase leading-4 tracking-[.23em]">Christian<br /><span className="text-[#C8A46B]">Chapter</span></div>
        <div className="flex items-center gap-5 text-[11px] uppercase tracking-[.22em] text-[#b9c2cb]"><span>3 of 9</span><span className="h-1 w-1 rounded-full bg-[#C8A46B]" /><span className="text-[#8794a1]">{saved ? "Your progress is saved" : "Saving…"}</span></div>
      </header>
      <div className="mx-auto grid max-w-[1220px] grid-cols-[285px_1fr] gap-24 px-10 py-14">
        <aside className="border-r border-[#a5b0bb]/15 pr-12">
          <p className="mb-9 text-[10px] uppercase tracking-[.28em] text-[#C8A46B]">Your introduction</p>
          <nav className="space-y-1">{steps.map((step, i) => {
            const done = i < 2; const active = i === 2;
            return <div key={step} className={`flex min-h-[48px] items-center gap-4 border-l-2 pl-5 text-[15px] ${active ? "border-[#C8A46B] text-[#F4F0E8]" : "border-transparent text-[#7f8c99]"}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${done ? "border-[#C8A46B] text-[#D4B16F]" : active ? "border-[#C8A46B] text-[#C8A46B]" : "border-[#53616e]"}`}>{done ? "✓" : i + 1}</span><span className={active ? "font-medium" : ""}>{step}</span>
            </div>;
          })}</nav>
          <p className="mt-14 max-w-[190px] text-[13px] leading-6 text-[#7f8c99]">There’s no right way to answer. Just tell us what feels true for you.</p>
        </aside>
        <section className="sw-in max-w-[720px] pb-10">
          <p className="text-[10px] uppercase tracking-[.3em] text-[#C8A46B]">Step 3 of 9</p>
          <h1 className="mt-5 font-['Playfair_Display'] text-[58px] leading-none tracking-[-.025em]">Your faith</h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-8 text-[#b9c2cb]">We'll use this to help identify people whose faith is genuinely compatible with yours.</p>
          <div className="mt-12 space-y-9">
            <label className="block"><span className="mb-3 block text-[15px] text-[#F4F0E8]">Christian tradition</span><select value={tradition} onChange={e => {setTradition(e.target.value); save();}} className="h-14 w-full appearance-none rounded-none border border-[#a5b0bb]/25 bg-[#121e2a] px-4 text-[16px] text-[#F4F0E8] outline-none focus:border-[#C8A46B]" style={{backgroundImage:"linear-gradient(45deg,transparent 50%,#C8A46B 50%),linear-gradient(135deg,#C8A46B 50%,transparent 50%)",backgroundPosition:"calc(100% - 20px) 24px,calc(100% - 14px) 24px",backgroundSize:"6px 6px,6px 6px",backgroundRepeat:"no-repeat"}}>{traditions.map(x => <option key={x}>{x}</option>)}</select></label>
            <fieldset><legend className="mb-3 text-[15px]">Church attendance</legend><div className="grid grid-cols-5 border border-[#a5b0bb]/25 bg-[#121e2a]">{attendance.map(x => <button type="button" key={x} onClick={() => {setAttend(x); save();}} className={`min-h-[54px] border-r border-[#a5b0bb]/20 px-2 text-[13px] transition-colors last:border-0 ${attend === x ? "bg-[#C8A46B] font-medium text-[#101923]" : "text-[#b9c2cb] hover:bg-[#1c2b38]"}`}>{x}</button>)}</div></fieldset>
            <fieldset><legend className="mb-3 text-[15px]">How central is faith to your daily life?</legend><div className="grid grid-cols-5 gap-2">{centrality.map(x => <button type="button" key={x} onClick={() => {setCentral(x); save();}} className={`min-h-[58px] border px-2 text-[12px] leading-4 transition-colors ${central === x ? "border-[#C8A46B] bg-[#C8A46B]/10 text-[#E5C98F]" : "border-[#a5b0bb]/25 bg-[#121e2a] text-[#b9c2cb] hover:border-[#C8A46B]/60"}`}>{x}</button>)}</div></fieldset>
            <label className="block"><span className="mb-3 block text-[15px]">What does faith look like for you day to day?</span><textarea value={story} onChange={e => {setStory(e.target.value); setSaved(false);}} onBlur={save} rows={3} placeholder="Feel free to be as specific or as general as you like." className="w-full resize-none border border-[#a5b0bb]/25 bg-[#121e2a] p-4 text-[16px] leading-7 text-[#F4F0E8] outline-none placeholder:text-[#687786] focus:border-[#C8A46B]" /></label>
          </div>
          <div className="mt-6 flex items-center gap-3 text-[12px] text-[#7f8c99]"><span className="text-[#C8A46B]">◇</span> Used for matching — not displayed publicly</div>
          <div className="mt-14 flex items-center justify-between border-t border-[#a5b0bb]/15 pt-7"><button type="button" className="min-h-[48px] text-[15px] text-[#b9c2cb] transition-colors hover:text-[#F4F0E8]">←&nbsp; Back</button><button type="button" onClick={() => setSaved(true)} className="min-h-[52px] bg-[#D4B16F] px-8 text-[12px] font-semibold uppercase tracking-[.18em] text-[#101923] transition-transform hover:-translate-y-0.5">Continue&nbsp; →</button></div>
        </section>
      </div>
    </main>
  );
}
export default WizardStep;