import React from "react";

export function HomepageMobile() {
  const scrollToHow = () => document.getElementById("mcd-mobile-how")?.scrollIntoView({ behavior: "smooth" });
  const join = () => document.getElementById("mcd-mobile-join")?.scrollIntoView({ behavior: "smooth" });
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f5f0e8] text-[#2d2926] font-['DM_Sans']">
      <style>{`@keyframes mcd-mobile-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.mcd-mobile-rise{animation:mcd-mobile-rise .8s ease both}@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;scroll-behavior:auto!important}}`}</style>
      <nav className="flex items-center justify-between px-6 py-6">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left font-['Cormorant_Garamond'] text-[22px] font-medium leading-[.85]">Mature Christian<br />Dating</button>
        <button onClick={join} className="text-[10px] uppercase tracking-[.16em] text-[#874d4b]">Join free</button>
      </nav>
      <section className="px-6 pb-20 pt-4">
        <div className="relative">
          <div className="absolute -right-3 -top-3 h-full w-[93%] border border-[#cfc2b0]" />
          <img src="/__mockup/images/mcd-g-hero1.jpg" alt="A woman standing outdoors in soft daylight" className="relative h-[440px] w-[92%] object-cover object-center" />
        </div>
        <p className="mcd-mobile-rise mt-12 text-[10px] uppercase tracking-[.24em] text-[#874d4b]">Christian dating, considered</p>
        <h1 className="mcd-mobile-rise mt-5 font-['Cormorant_Garamond'] text-[59px] font-light leading-[.88] tracking-[-.04em]">Meet someone who shares what matters.</h1>
        <p className="mcd-mobile-rise mt-7 text-[15px] leading-[1.7] text-[#615951]">A quieter way to meet, shaped by faith, life stage, relationship intentions and the values you actually live by.</p>
        <div className="mt-7 flex flex-wrap gap-x-3 gap-y-1 font-['Cormorant_Garamond'] text-[21px] text-[#874d4b]"><span>Faith</span><i>·</i><span>Life stage</span><i>·</i><span>Something meaningful</span></div>
        <button onClick={join} className="mt-9 w-full bg-[#874d4b] px-5 py-4 text-[12px] text-[#f8f2e8]">Become a Founding Member — Free</button>
        <button onClick={scrollToHow} className="mt-6 w-full border-b border-[#2d2926] pb-2 text-[12px]">See how introductions work ↓</button>
      </section>
      <section className="bg-[#eee6da] px-6 py-20">
        <p className="text-[10px] uppercase tracking-[.24em] text-[#874d4b]">A different pace</p>
        <h2 className="mt-5 font-['Cormorant_Garamond'] text-[47px] font-light leading-[.92]">More intention.<br />Less swiping.</h2>
        <p className="mt-8 font-['Cormorant_Garamond'] text-[34px] leading-[1.04]">You have built a life with texture. The way you meet someone should have some too.</p>
        <p className="mt-7 text-[14px] leading-[1.75] text-[#615951]">No endless cards. No performance. Just an honest account of where you are, what you believe, and the kind of companionship you hope to find.</p>
      </section>
      <section id="mcd-mobile-how" className="px-6 py-20">
        <h2 className="font-['Cormorant_Garamond'] text-[48px] font-light leading-[.9]">How an introduction begins</h2>
        <div className="mt-12 space-y-10">
          {[["01","Tell us your story","A thoughtful profile, not a sales pitch. Share the faith, experiences and hopes that shape this chapter."],["02","We look with care","We consider alignment across the things that tend to matter later: beliefs, distance, pace and intention."],["03","You decide what’s next","If we see a promising mutual connection, we invite you both to consider a simple introduction."]].map(([n,t,c]) => <article key={n} className="border-t border-[#874d4b] pt-4"><span className="font-['Cormorant_Garamond'] text-[28px] text-[#874d4b]">{n}</span><h3 className="mt-7 font-['Cormorant_Garamond'] text-[33px] leading-none">{t}</h3><p className="mt-4 text-[14px] leading-[1.7] text-[#615951]">{c}</p></article>)}
        </div>
      </section>
      <section className="bg-[#d9c7b3] px-6 py-20">
        <p className="text-[10px] uppercase tracking-[.23em] text-[#874d4b]">Fictional examples</p>
        <h2 className="mt-5 font-['Cormorant_Garamond'] text-[53px] font-light leading-[.9]">A reason to say hello.</h2>
        <div className="mt-10 bg-[#f5f0e8] p-6">
          <div className="flex items-center justify-between border-b border-[#cfc2b0] pb-5 font-['Cormorant_Garamond'] text-[24px]"><span>Sarah, 53<br /><small className="font-['DM_Sans'] text-[9px] uppercase tracking-widest text-[#874d4b]">Buckinghamshire</small></span><span className="text-[#874d4b]">← →</span><span className="text-right">David, 57<br /><small className="font-['DM_Sans'] text-[9px] uppercase tracking-widest text-[#874d4b]">Oxfordshire</small></span></div>
          <div className="space-y-5 pt-6 text-[12px] leading-[1.35]"><p><b className="mr-2 text-[9px] uppercase tracking-wider text-[#874d4b]">Faith</b> Church community is important to both</p><p><b className="mr-2 text-[9px] uppercase tracking-wider text-[#874d4b]">Relationship</b> Both seeking a committed long-term relationship</p><p><b className="mr-2 text-[9px] uppercase tracking-wider text-[#874d4b]">Life stage</b> Both have adult children</p><p><b className="mr-2 text-[9px] uppercase tracking-wider text-[#874d4b]">Distance</b> 46 miles · Both open to travelling up to 60 miles</p><p><b className="mr-2 text-[9px] uppercase tracking-wider text-[#874d4b]">Lifestyle</b> Travel, countryside walks, live music</p></div>
          <p className="mt-8 border-t border-[#cfc2b0] pt-5 font-['Cormorant_Garamond'] text-[24px] italic">“An introduction should have a reason.”</p>
        </div>
      </section>
      <section id="mcd-mobile-join" className="px-6 py-24 text-center">
        <p className="text-[10px] uppercase tracking-[.24em] text-[#874d4b]">A considered beginning</p>
        <h2 className="mt-5 font-['Cormorant_Garamond'] text-[58px] font-light leading-[.88]">Your next chapter deserves a little care.</h2>
        <p className="mt-7 text-[14px] leading-[1.75] text-[#615951]">Join free. Tell us about yourself and who you're hoping to meet.</p>
        <button onClick={() => window.alert("Thank you — founding member registration is coming soon.")} className="mt-8 w-full bg-[#874d4b] px-4 py-4 text-[12px] text-[#f8f2e8]">Become a Founding Member — Free</button>
        <p className="mt-5 text-[11px] leading-[1.6] text-[#8a7c6e]">We do not guarantee a match — we'll contact you when we identify a promising mutual connection.</p>
      </section>
      <footer className="border-t border-[#d8cdbf] px-6 py-7 text-[9px] uppercase tracking-[.14em] text-[#8a7c6e]">Mature Christian Dating.co.uk</footer>
    </main>
  );
}