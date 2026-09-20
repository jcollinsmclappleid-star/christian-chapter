import React, { useState } from "react";

const gold = "#C8A46B";
const warm = "#F4F0E8";

export function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0E1621] text-[#F4F0E8] font-['Space_Grotesk']">
      <style>{`
        @keyframes sw-rise { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes sw-drift { from { transform:scale(1.03); } to { transform:scale(1); } }
        .sw-rise { animation: sw-rise .9s cubic-bezier(.2,.8,.2,1) both; }
        .sw-delay-1 { animation-delay:.12s } .sw-delay-2 { animation-delay:.24s } .sw-delay-3 { animation-delay:.38s }
        @media (prefers-reduced-motion: reduce) { .sw-rise { animation:none } .sw-photo { animation:none !important } }
      `}</style>

      <section className="relative min-h-[760px] overflow-hidden border-b border-[#9da9b8]/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_73%_28%,rgba(118,104,82,.18),transparent_27%),linear-gradient(105deg,#0E1621_0%,#111b27_46%,#0b111a_100%)]" />
        <img className="sw-photo absolute right-0 top-0 h-full w-[53%] object-cover object-[58%_center] opacity-[.83] [mask-image:linear-gradient(90deg,transparent_0%,black_31%,black_100%)] animate-[sw-drift_1.8s_ease-out_both]" src="/__mockup/images/mcd-sw-hero1.jpg" alt="Thoughtful man in his late fifties outdoors" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0E1621_0%,rgba(14,22,33,.88)_33%,transparent_70%),linear-gradient(0deg,rgba(14,22,33,.74),transparent_34%)]" />
        <header className="relative z-10 mx-auto flex max-w-[1160px] items-center justify-between px-8 py-8">
          <a href="#top" className="text-[11px] font-semibold uppercase tracking-[.27em] text-[#F4F0E8]">Mature<br/><span className="text-[#C8A46B]">Christian Dating</span></a>
          <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[.18em] text-[#b6bec8] md:flex">
            <a href="#approach" className="transition-colors hover:text-[#F4F0E8]">Our approach</a>
            <a href="#examples" className="transition-colors hover:text-[#F4F0E8]">How it works</a>
            <a href="#join" className="border border-[#C8A46B]/70 px-5 py-3 text-[#E7C892] transition-colors hover:bg-[#C8A46B] hover:text-[#0E1621]">Become a member</a>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation" className="md:hidden text-[#C8A46B] text-xl">☰</button>
        </header>
        {menuOpen && <nav className="absolute right-8 top-20 z-20 flex flex-col gap-5 border border-[#C8A46B]/30 bg-[#111c29] p-6 text-xs uppercase tracking-[.18em]"><a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a><a href="#join" onClick={() => setMenuOpen(false)}>Join free</a></nav>}
        <div id="top" className="relative z-10 mx-auto flex max-w-[1160px] items-end px-8 pb-28 pt-32">
          <div className="max-w-[650px]">
            <p className="sw-rise mb-8 text-[10px] uppercase tracking-[.38em] text-[#C8A46B]">For Christian single adults · 40–70</p>
            <h1 className="sw-rise sw-delay-1 font-['Playfair_Display'] text-[clamp(3.6rem,7vw,6.8rem)] leading-[.94] tracking-[-.045em] text-[#F4F0E8]">Meet someone<br/><em className="font-normal text-[#E4C894]">who shares</em><br/>what matters.</h1>
            <div className="sw-rise sw-delay-2 mt-9 flex items-center gap-5"><span className="h-px w-20 bg-[#C8A46B]" /><p className="max-w-[330px] text-[15px] leading-7 text-[#c0c6cc]">Christian dating for your next chapter — with more intention, and less noise.</p></div>
            <div className="sw-rise sw-delay-3 mt-11 flex items-center gap-7"><a href="#join" className="bg-[#D4B16F] px-7 py-4 text-[11px] font-semibold uppercase tracking-[.18em] text-[#101923] transition-transform hover:-translate-y-1">Become a Founding Member — Free</a><a href="#approach" className="hidden border-b border-[#8f9aa7] pb-2 text-[11px] uppercase tracking-[.17em] text-[#d8dde1] md:block">See how introductions work →</a></div>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 z-10 text-right text-[9px] uppercase tracking-[.28em] text-[#96a0ac]"><span className="text-[#C8A46B]">01</span> / A quieter way to meet</div>
      </section>

      <section id="approach" className="mx-auto grid max-w-[1160px] gap-16 px-8 py-28 md:grid-cols-[.9fr_1.1fr] md:py-36">
        <div><p className="mb-6 text-[10px] uppercase tracking-[.3em] text-[#C8A46B]">The premise</p><h2 className="font-['Playfair_Display'] text-5xl leading-[1.02] text-[#F4F0E8] md:text-6xl">Not a marketplace.<br/><em className="font-normal text-[#D5B777]">A considered beginning.</em></h2></div>
        <div className="max-w-[520px] self-end text-[17px] leading-8 text-[#b9c2cb]"><p>At this stage of life, the question is rarely “Who is available?” It is “Who might understand the shape of my life?”</p><p className="mt-7">We listen for the things that hold a relationship together: faith alignment, life stage, intentions, and the values you want to live by.</p></div>
      </section>

      <section id="examples" className="border-y border-[#a5b0bb]/15 bg-[#121e2a]">
        <div className="mx-auto grid max-w-[1160px] items-stretch md:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[530px] overflow-hidden"><img src="/__mockup/images/mcd-sw-hero2.jpg" alt="Confident woman in her early fifties" className="absolute inset-0 h-full w-full object-cover object-center opacity-75" /><div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#121e2a]" /><div className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[.25em] text-[#b9c2cb]">A community with depth</div></div>
          <div className="px-8 py-20 md:px-20 md:py-24"><p className="mb-7 text-[10px] uppercase tracking-[.28em] text-[#C8A46B]">Fictional example</p><h2 className="font-['Playfair_Display'] text-4xl text-[#F4F0E8]">Introductions,<br/><em className="font-normal text-[#D5B777]">not recommendations.</em></h2><div className="mt-12 space-y-5 border-l border-[#C8A46B]/70 pl-6 text-[14px] leading-6 text-[#c0c7cf]"><p><strong className="font-normal text-[#F4F0E8]">Sarah, 53 · Buckinghamshire</strong> <span className="mx-2 text-[#C8A46B]">←→</span> <strong className="font-normal text-[#F4F0E8]">David, 57 · Oxfordshire</strong></p><p><span className="text-[#C8A46B]">Faith</span> Church community is important to both</p><p><span className="text-[#C8A46B]">Relationship</span> Both seeking a committed long-term relationship</p><p><span className="text-[#C8A46B]">Life stage</span> Both have adult children</p><p><span className="text-[#C8A46B]">Distance</span> 46 miles · Both open to travelling up to 60 miles</p><p><span className="text-[#C8A46B]">Lifestyle</span> Travel, countryside walks, live music</p></div><p className="mt-12 font-['Playfair_Display'] text-2xl text-[#F4F0E8]">“An introduction should have a reason.”</p></div>
        </div>
      </section>

      <section id="join" className="mx-auto max-w-[900px] px-8 py-28 text-center md:py-36"><p className="mb-7 text-[10px] uppercase tracking-[.3em] text-[#C8A46B]">The founding community</p><h2 className="font-['Playfair_Display'] text-5xl leading-tight text-[#F4F0E8] md:text-7xl">A thoughtful start<br/><em className="font-normal text-[#D5B777]">begins with you.</em></h2><p className="mx-auto mt-9 max-w-[600px] text-[16px] leading-8 text-[#b9c2cb]">Join free. Tell us about yourself and who you're hoping to meet. As our founding community grows, we'll look for promising mutual connections. If we identify one, we'll invite both people to consider an introduction.</p><button onClick={() => setJoined(true)} className="mt-11 bg-[#D4B16F] px-8 py-5 text-[11px] font-semibold uppercase tracking-[.18em] text-[#101923] transition-transform hover:-translate-y-1">{joined ? "Thank you — you're on the list" : "Become a Founding Member — Free"}</button><p className="mx-auto mt-7 max-w-[480px] text-[11px] leading-5 text-[#7f8b98]">We do not guarantee a match — we'll contact you when we identify a promising mutual connection.</p></section>

      <footer className="border-t border-[#a5b0bb]/15 px-8 py-8"><div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-5 text-[10px] uppercase tracking-[.2em] text-[#8f9aa7] md:flex-row"><span>Mature Christian Dating.co.uk</span><span>More intention. Less swiping.</span><span>© 2024 · Built for meaningful beginnings</span></div></footer>
    </main>
  );
}

export default Homepage;