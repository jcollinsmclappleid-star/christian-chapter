import { useState } from "react";

const reasons = [
  ["Faith", "Church community is important to both"],
  ["Relationship", "Both seeking a committed long-term relationship"],
  ["Life stage", "Both have adult children"],
  ["Distance", "46 miles · Both open to travelling up to 60 miles"],
  ["Lifestyle", "Travel, countryside walks, live music"],
];

function Arrow() {
  return <span aria-hidden="true" className="text-lg">↗</span>;
}

export function Homepage() {
  const [joined, setJoined] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const begin = () => setJoined(true);

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f7f3ed] text-[#3d2b47] font-['Nunito_Sans']">
      <style>{`
        @keyframes rise { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:none } }
        @keyframes draw { from { stroke-dashoffset:500 } to { stroke-dashoffset:0 } }
        .fl-rise { animation: rise .8s cubic-bezier(.2,.7,.2,1) both; }
        .fl-delay-1 { animation-delay:.12s } .fl-delay-2 { animation-delay:.24s } .fl-delay-3 { animation-delay:.38s }
        .fl-line { stroke-dasharray:500; animation:draw 1.8s .4s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .fl-rise,.fl-line { animation:none !important } }
      `}</style>

      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-8 py-7">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#9a6f53] text-[#9a6f53] text-sm">M</span>
          <span className="text-[13px] font-bold tracking-[.18em] uppercase">Mature Christian<br/>Dating<span className="font-normal text-[#9a6f53]">.co.uk</span></span>
        </div>
        <nav className="flex items-center gap-8 text-sm text-[#5e6b5c]">
          <a href="#approach" className="hidden transition-colors hover:text-[#3d2b47] md:block">Our approach</a>
          <a href="#examples" className="hidden transition-colors hover:text-[#3d2b47] md:block">How introductions work</a>
          <button onClick={begin} className="rounded-full border border-[#5e6b5c] px-5 py-2.5 font-semibold transition hover:bg-[#5e6b5c] hover:text-[#f7f3ed]">Join free</button>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-[1180px] grid-cols-[.9fr_1.1fr] items-center gap-10 px-8 pb-28 pt-12">
        <div className="relative z-10 max-w-[560px]">
          <p className="fl-rise mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.23em] text-[#9a6f53]"><span className="h-px w-10 bg-[#9a6f53]"/>A considered way to meet</p>
          <h1 className="fl-rise fl-delay-1 max-w-[570px] font-['Lora'] text-[clamp(3.5rem,6.2vw,6.25rem)] leading-[.96] tracking-[-.065em]">Meet someone who <em className="font-normal text-[#5e6b5c]">shares</em> what matters.</h1>
          <p className="fl-rise fl-delay-2 mt-8 max-w-[425px] text-[17px] leading-8 text-[#697064]">Christian dating for your next chapter. More intention. Less swiping.</p>
          <div className="fl-rise fl-delay-3 mt-10 flex items-center gap-5">
            <button onClick={begin} className="group flex items-center gap-4 rounded-full bg-[#3d2b47] px-6 py-4 text-sm font-bold text-[#f7f3ed] shadow-[0_12px_24px_rgba(61,43,71,.16)] transition hover:-translate-y-0.5">Become a Founding Member — Free <Arrow/></button>
            <button onClick={() => setShowHow(true)} className="text-sm font-bold text-[#5e6b5c] underline decoration-[#c68a63] underline-offset-8">See how it works</button>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#8b8b7e]">No swiping. No public member counts. No promises of a match.</p>
        </div>

        <div className="relative min-h-[610px]">
          <div className="absolute right-0 top-0 h-[525px] w-[72%] overflow-hidden rounded-[190px_16px_16px_16px] bg-[#d8d8c9]">
            <img src="/__mockup/images/mcd-fl-hero1.jpg" alt="A woman in her early fifties outdoors" className="h-full w-full object-cover object-[center_25%]"/>
          </div>
          <div className="absolute bottom-0 left-[2%] h-[300px] w-[39%] overflow-hidden rounded-[16px_120px_16px_16px] border-[10px] border-[#f7f3ed] bg-[#c8cabb]">
            <img src="/__mockup/images/mcd-fl-hero2.jpg" alt="A man in his late fifties outdoors" className="h-full w-full object-cover object-[center_30%]"/>
          </div>
          <svg className="absolute left-[20%] top-[44%] z-20 h-[160px] w-[70%]" viewBox="0 0 520 160" fill="none" aria-hidden="true">
            <path className="fl-line" d="M0 104 C105 20 145 145 248 76 C326 24 380 86 520 34" stroke="#9a6f53" strokeWidth="1.2"/>
            <circle cx="248" cy="76" r="4" fill="#9a6f53"/>
          </svg>
          <div className="absolute left-[28%] top-[34%] z-30 bg-[#f7f3ed]/90 px-2 py-1 text-[11px] font-semibold tracking-wide text-[#5e6b5c]">faith</div>
          <div className="absolute right-[4%] top-[45%] z-30 bg-[#f7f3ed]/90 px-2 py-1 text-[11px] font-semibold tracking-wide text-[#5e6b5c]">life stage</div>
          <div className="absolute bottom-[16%] left-[46%] z-30 bg-[#f7f3ed]/90 px-2 py-1 text-[11px] font-semibold tracking-wide text-[#5e6b5c]">intentions</div>
          <div className="absolute bottom-0 right-[4%] text-right font-['Lora'] text-2xl italic leading-tight text-[#9a6f53]">the next<br/>chapter</div>
        </div>
      </section>

      <section id="approach" className="border-y border-[#d8d4ca] bg-[#e8ebe1] px-8 py-24">
        <div className="mx-auto grid max-w-[1000px] grid-cols-[.7fr_1.3fr] gap-24">
          <div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#9a6f53]">A different starting point</p><h2 className="mt-5 font-['Lora'] text-5xl leading-[1.05] tracking-[-.05em]">Start with<br/><em className="font-normal text-[#5e6b5c]">what matters.</em></h2></div>
          <div className="pt-2"><p className="max-w-[570px] text-xl leading-9 text-[#4e584d]">We ask better questions before we make an introduction. Your faith, your life stage, your intentions, and the everyday things that make a life feel good.</p><div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-7 border-t border-[#c7cdbf] pt-7 text-sm text-[#5e6b5c]"><p><b className="mr-2 font-['Lora'] text-2xl text-[#3d2b47]">01</b> Tell us your story</p><p><b className="mr-2 font-['Lora'] text-2xl text-[#3d2b47]">02</b> Share what you value</p><p><b className="mr-2 font-['Lora'] text-2xl text-[#3d2b47]">03</b> We look for alignment</p><p><b className="mr-2 font-['Lora'] text-2xl text-[#3d2b47]">04</b> Consider an introduction</p></div></div>
        </div>
      </section>

      <section id="examples" className="mx-auto max-w-[1060px] px-8 py-28">
        <div className="flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#9a6f53]">Fictional examples</p><h2 className="mt-4 font-['Lora'] text-5xl tracking-[-.05em]">An introduction<br/><em className="font-normal text-[#5e6b5c]">should have a reason.</em></h2></div><span className="hidden max-w-[200px] text-right text-xs leading-5 text-[#858879] md:block">Illustrative only. We never promise a match.</span></div>
        <div className="relative mt-14 grid grid-cols-[.85fr_1.15fr] gap-14">
          <div className="border-l-2 border-[#c68a63] pl-6"><p className="font-['Lora'] text-3xl">Sarah, 53</p><p className="mt-1 text-sm text-[#697064]">Buckinghamshire</p><div className="my-8 h-px w-16 bg-[#c68a63]"/><p className="font-['Lora'] text-3xl">David, 57</p><p className="mt-1 text-sm text-[#697064]">Oxfordshire</p></div>
          <div className="space-y-0">{reasons.map(([label, text], i) => <div key={label} className="flex gap-6 border-b border-[#ddd8ce] py-4 first:border-t"><span className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-[.13em] text-[#9a6f53]">{label}</span><span className="text-sm text-[#5e6b5c]">{text}</span></div>)}<p className="mt-10 font-['Lora'] text-2xl italic text-[#3d2b47]">An introduction should have a reason.</p></div>
        </div>
      </section>

      <section className="bg-[#3d2b47] px-8 py-24 text-[#f7f3ed]"><div className="mx-auto grid max-w-[1060px] grid-cols-[1fr_.8fr] items-center gap-20"><h2 className="font-['Lora'] text-6xl leading-[.98] tracking-[-.05em]">Make room for<br/><em className="font-normal text-[#d7b18f]">something meaningful.</em></h2><div><p className="text-lg leading-8 text-[#d8d3d0]">Join free. Tell us about yourself and who you're hoping to meet. As our founding community grows, we'll look for promising mutual connections.</p><button onClick={begin} className="mt-8 rounded-full bg-[#c68a63] px-6 py-4 text-sm font-bold text-[#3d2b47] transition hover:bg-[#d7b18f]">Become a Founding Member — Free <Arrow/></button><p className="mt-5 text-xs leading-5 text-[#bdb3b9]">We do not guarantee a match — we'll contact you when we identify a promising mutual connection.</p></div></div></section>

      <footer className="flex items-center justify-between px-8 py-8 text-xs text-[#747b70]"><span>© 2025 Mature Christian Dating</span><span>Made for meaningful next chapters.</span></footer>

      {joined && <div className="fixed inset-0 z-50 grid place-items-center bg-[#3d2b47]/50 p-6" onClick={() => setJoined(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-[2px] bg-[#f7f3ed] p-9 shadow-2xl"><button onClick={() => setJoined(false)} className="float-right text-2xl text-[#9a6f53]" aria-label="Close">×</button><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#9a6f53]">Founding members</p><h2 className="mt-3 font-['Lora'] text-4xl leading-tight">A good place to begin.</h2><p className="mt-4 text-sm leading-6 text-[#697064]">We are opening thoughtfully. Leave your email and we’ll let you know when your first questions are ready.</p><input type="email" placeholder="Your email address" className="mt-6 w-full border-b border-[#aaa99d] bg-transparent px-1 py-3 text-sm outline-none focus:border-[#9a6f53]"/><button onClick={() => setJoined(false)} className="mt-6 w-full rounded-full bg-[#3d2b47] py-4 text-sm font-bold text-[#f7f3ed]">Continue</button><p className="mt-4 text-center text-[11px] text-[#8b8b7e]">No pressure. Unsubscribe whenever you like.</p></div></div>}
      {showHow && <div className="fixed inset-0 z-50 grid place-items-center bg-[#3d2b47]/50 p-6" onClick={() => setShowHow(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-[#e8ebe1] p-10"><button onClick={() => setShowHow(false)} className="float-right text-2xl text-[#9a6f53]" aria-label="Close">×</button><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#9a6f53]">How it works</p><h2 className="mt-3 font-['Lora'] text-4xl">No scrolling through strangers.</h2><p className="mt-5 text-base leading-8 text-[#4e584d]">You tell us about your faith, your life, and what you hope to find. We look for thoughtful alignment, then invite both people to consider an introduction. The choice stays yours.</p><button onClick={begin} className="mt-7 rounded-full border border-[#5e6b5c] px-6 py-3 text-sm font-bold text-[#5e6b5c]">Join the founding community</button></div></div>}
    </main>
  );
}