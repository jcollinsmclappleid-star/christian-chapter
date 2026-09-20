import React from "react";

const ink = "#2d2926";
const parchment = "#f5f0e8";
const burgundy = "#874d4b";

export function Homepage() {
  const scrollToHow = () => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  const join = () => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f5f0e8] text-[#2d2926] font-['DM_Sans']">
      <style>{`
        @keyframes mcd-rise { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes mcd-drift { from { transform:translateY(0) } to { transform:translateY(-8px) } }
        .mcd-rise { animation:mcd-rise .9s cubic-bezier(.2,.7,.2,1) both; }
        .mcd-delay-1 { animation-delay:.12s } .mcd-delay-2 { animation-delay:.24s } .mcd-delay-3 { animation-delay:.38s }
        .mcd-rule { background:rgba(45,41,38,.22); height:1px; }
        @media (prefers-reduced-motion: reduce) { *, *:before, *:after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; } }
      `}</style>

      <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-8 py-7 lg:px-12" aria-label="Main navigation">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left">
          <div className="font-['Cormorant_Garamond'] text-[26px] font-medium leading-none tracking-[-.03em]">Christian<br />Chapter</div>
          <div className="mt-1 text-[9px] uppercase tracking-[.25em] text-[#874d4b]">Christian dating for your next chapter.</div>
        </button>
        <div className="hidden items-center gap-10 text-[12px] tracking-[.04em] md:flex">
          <button onClick={scrollToHow} className="transition-colors hover:text-[#874d4b]">How introductions work</button>
          <button onClick={join} className="border-b border-[#874d4b] pb-1 text-[#874d4b]">Become a founding member</button>
        </div>
        <button onClick={join} className="md:hidden text-[11px] uppercase tracking-[.12em] text-[#874d4b]">Join free</button>
      </nav>

      <section className="mx-auto grid max-w-[1180px] grid-cols-12 gap-8 px-8 pb-28 pt-8 lg:px-12 lg:pb-40 lg:pt-16">
        <div className="relative col-span-7 min-h-[580px] lg:min-h-[660px]">
          <div className="absolute -left-12 top-8 h-[77%] w-[78%] border border-[#cfc2b0]" />
          <img src="/__mockup/images/mcd-g-hero1.jpg" alt="A woman standing outdoors in soft daylight" className="relative h-[620px] w-[86%] object-cover object-center grayscale-[8%] lg:h-[710px]" />
          <div className="absolute bottom-0 right-0 w-[42%] bg-[#dfd1bf] p-6 lg:p-8">
            <p className="font-['Cormorant_Garamond'] text-[24px] leading-[1.05] lg:text-[30px]">There is still so much life to share.</p>
            <p className="mt-4 text-[10px] uppercase leading-[1.5] tracking-[.17em] text-[#874d4b]">For people in their next chapter</p>
          </div>
        </div>
        <div className="col-span-5 flex flex-col justify-center pb-12 lg:pb-20">
          <p className="mcd-rise mb-7 text-[11px] uppercase tracking-[.28em] text-[#874d4b]">Christian dating, considered</p>
          <h1 className="mcd-rise mcd-delay-1 max-w-[520px] font-['Cormorant_Garamond'] text-[66px] font-light leading-[.89] tracking-[-.045em] lg:text-[92px]">Meet someone who shares what matters.</h1>
          <p className="mcd-rise mcd-delay-2 mt-9 max-w-[380px] text-[16px] leading-[1.7] text-[#615951]">A quieter way to meet. Introductions shaped by faith, life stage, relationship intentions and the values you actually live by.</p>
          <div className="mcd-rise mcd-delay-3 mt-9 flex flex-wrap gap-x-4 gap-y-2 font-['Cormorant_Garamond'] text-[22px] text-[#874d4b]">
            <span>Faith</span><i className="text-[#b7a38e]">·</i><span>Life stage</span><i className="text-[#b7a38e]">·</i><span>Something meaningful</span>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-7">
            <button onClick={join} className="bg-[#874d4b] px-7 py-4 text-[12px] font-medium tracking-[.04em] text-[#f8f2e8] transition-transform hover:-translate-y-1">Become a Founding Member — Free</button>
            <button onClick={scrollToHow} className="border-b border-[#2d2926] pb-1 text-[12px] tracking-[.03em]">See how introductions work <span className="ml-2">↓</span></button>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d8cdbf] bg-[#eee6da]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-12 gap-8 px-8 py-24 lg:px-12 lg:py-32">
          <div className="col-span-4">
            <p className="text-[10px] uppercase tracking-[.24em] text-[#874d4b]">A different pace</p>
            <p className="mt-5 font-['Cormorant_Garamond'] text-[35px] leading-[1.05]">More intention.<br />Less swiping.</p>
          </div>
          <div className="col-span-8 max-w-[650px]">
            <p className="font-['Cormorant_Garamond'] text-[37px] font-light leading-[1.1] lg:text-[49px]">You have built a life with texture. The way you meet someone should have some too.</p>
            <p className="mt-8 max-w-[540px] text-[15px] leading-[1.8] text-[#615951]">No endless cards. No performance. Just an honest account of where you are, what you believe, and the kind of companionship you hope to find.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-[1180px] px-8 py-28 lg:px-12 lg:py-40">
        <div className="mb-20 flex items-end justify-between border-b border-[#cfc2b0] pb-6">
          <h2 className="font-['Cormorant_Garamond'] text-[55px] font-light leading-none lg:text-[76px]">How an introduction begins</h2>
          <span className="hidden pb-2 text-[11px] uppercase tracking-[.2em] text-[#874d4b] md:block">Three considered steps</span>
        </div>
        <div className="grid grid-cols-3 gap-10">
          {[
            ["01", "Tell us your story", "A thoughtful profile, not a sales pitch. Share the faith, experiences and hopes that shape this chapter."],
            ["02", "We look with care", "We consider alignment across the things that tend to matter later: beliefs, distance, pace and intention."],
            ["03", "You decide what’s next", "If we see a promising mutual connection, we invite you both to consider a simple introduction."],
          ].map(([num, title, copy]) => (
            <div key={num} className="border-t border-[#874d4b] pt-5">
              <span className="font-['Cormorant_Garamond'] text-[31px] text-[#874d4b]">{num}</span>
              <h3 className="mt-12 font-['Cormorant_Garamond'] text-[34px] leading-none">{title}</h3>
              <p className="mt-5 text-[14px] leading-[1.75] text-[#615951]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#d9c7b3]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-12 gap-12 px-8 py-24 lg:px-12 lg:py-32">
          <div className="col-span-5">
            <p className="text-[10px] uppercase tracking-[.23em] text-[#874d4b]">Fictional examples</p>
            <h2 className="mt-5 font-['Cormorant_Garamond'] text-[57px] font-light leading-[.92] lg:text-[76px]">A reason to say hello.</h2>
            <p className="mt-8 max-w-[320px] text-[14px] leading-[1.75] text-[#615951]">Not a score. Not a promise. Just the beginning of a conversation, with enough context to make it feel human.</p>
          </div>
          <div className="col-span-7 bg-[#f5f0e8] p-8 lg:p-12">
            <div className="flex items-center justify-between border-b border-[#cfc2b0] pb-7 font-['Cormorant_Garamond'] text-[28px]">
              <span>Sarah, 53<br /><small className="font-['DM_Sans'] text-[10px] uppercase tracking-[.18em] text-[#874d4b]">Buckinghamshire</small></span>
              <span className="text-[22px] text-[#874d4b]">← →</span>
              <span className="text-right">David, 57<br /><small className="font-['DM_Sans'] text-[10px] uppercase tracking-[.18em] text-[#874d4b]">Oxfordshire</small></span>
            </div>
            <div className="space-y-5 pt-8 text-[13px]">
              <p><span className="mr-4 text-[10px] uppercase tracking-[.15em] text-[#874d4b]">Faith</span>Church community is important to both</p>
              <p><span className="mr-4 text-[10px] uppercase tracking-[.15em] text-[#874d4b]">Relationship</span>Both seeking a committed long-term relationship</p>
              <p><span className="mr-4 text-[10px] uppercase tracking-[.15em] text-[#874d4b]">Life stage</span>Both have adult children</p>
              <p><span className="mr-4 text-[10px] uppercase tracking-[.15em] text-[#874d4b]">Distance</span>46 miles · Both open to travelling up to 60 miles</p>
              <p><span className="mr-4 text-[10px] uppercase tracking-[.15em] text-[#874d4b]">Lifestyle</span>Travel, countryside walks, live music</p>
            </div>
            <div className="mt-10 border-t border-[#cfc2b0] pt-7 font-['Cormorant_Garamond'] text-[27px] italic">“An introduction should have a reason.”</div>
          </div>
        </div>
      </section>

      <section id="join" className="mx-auto max-w-[1180px] px-8 py-28 text-center lg:px-12 lg:py-40">
        <p className="text-[10px] uppercase tracking-[.24em] text-[#874d4b]">A considered beginning</p>
        <h2 className="mx-auto mt-6 max-w-[750px] font-['Cormorant_Garamond'] text-[62px] font-light leading-[.9] tracking-[-.03em] lg:text-[96px]">Your next chapter deserves a little care.</h2>
        <p className="mx-auto mt-8 max-w-[490px] text-[15px] leading-[1.8] text-[#615951]">Join free. Tell us about yourself and who you're hoping to meet. As our founding community grows, we'll look for promising mutual connections.</p>
        <button onClick={() => window.alert("Thank you — founding member registration is coming soon.")} className="mt-10 bg-[#874d4b] px-8 py-5 text-[12px] font-medium tracking-[.04em] text-[#f8f2e8] transition-transform hover:-translate-y-1">Become a Founding Member — Free</button>
        <p className="mx-auto mt-6 max-w-[430px] text-[11px] leading-[1.6] text-[#8a7c6e]">We do not guarantee a match — we'll contact you when we identify a promising mutual connection.</p>
      </section>

      <footer className="border-t border-[#d8cdbf] px-8 py-8 lg:px-12">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-5 text-[10px] uppercase tracking-[.16em] text-[#8a7c6e] md:flex-row">
          <span>Christian Chapter</span><span>Christian dating for your next chapter.</span><span>Privacy · Terms</span>
        </div>
      </footer>
    </main>
  );
}