import { IconFaith, IconHeart } from "@/components/home/mark-icons";
import { DEMO_DISCLOSURE, demoConnection, demoIntroduction, demoProfiles } from "@/lib/home/demo-fixture";
import Image from "next/image";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[280px] shrink-0 overflow-hidden rounded-[2.25rem] border-[10px] border-white bg-paper shadow-card">
      {children}
    </div>
  );
}

export function PhoneMocks() {
  return (
    <div className="flex gap-5 overflow-x-auto px-1 pb-3 md:justify-center">
      {demoProfiles.map((profile) => (
        <PhoneFrame key={profile.firstName}>
          <div className="relative h-64">
            <Image
              src={profile.photo}
              alt={`${profile.firstName}, a demonstration profile photograph`}
              fill
              className="object-cover object-[center_20%]"
              sizes="280px"
            />
            <p className="absolute left-3 top-3 max-w-[14rem] rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold leading-4 text-life">
              {DEMO_DISCLOSURE}
            </p>
          </div>
          <div className="px-3.5 pb-4 pt-3">
            <p className="font-sans text-[1.45rem] font-bold leading-none tracking-tight text-plum">
              {profile.firstName}, {profile.age}
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-plum-muted">
              {profile.region} · {profile.poolLabel}
            </p>
            <p className="mt-1 text-[13px] font-medium text-life">{profile.tradition}</p>
            <p className="mt-3 text-[14px] leading-5 text-plum">{profile.lifeEvent}</p>
            <div className="mt-3 flex gap-1.5">
              {profile.moments.map((moment) => (
                <div key={moment.src} className="relative h-16 flex-1 overflow-hidden rounded-lg">
                  <Image src={moment.src} alt={moment.alt} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          </div>
        </PhoneFrame>
      ))}

      <PhoneFrame>
        <div className="px-3.5 pb-4 pt-4">
          <p className="text-[11px] leading-4 text-life">{DEMO_DISCLOSURE}</p>
          <p className="mt-3 font-sans text-[15px] font-bold text-plum">An introduction</p>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center">
            {[demoConnection.left, demoConnection.right].map((person, index) => (
              <div key={person.firstName} className="contents">
                {index === 1 && (
                  <div className="flex flex-col items-center px-1 text-life">
                    <IconFaith className="h-6 w-6" />
                    <IconHeart className="mt-1 h-6 w-6" />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full">
                    <Image src={person.photo} alt={person.alt} fill className="object-cover object-[center_20%]" sizes="72px" />
                  </div>
                  <p className="mt-1.5 text-center text-[12px] font-semibold text-plum">
                    {person.firstName}, {person.age}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-sans text-[14px] font-bold text-plum">{demoConnection.line}</p>
          <ul className="mt-3 space-y-2">
            {demoIntroduction.why.slice(0, 2).map((reason) => (
              <li key={reason} className="border-l-2 border-life pl-3 text-[13px] leading-5 text-plum">
                {reason}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-5 text-stone">Exact miles are not published.</p>
        </div>
      </PhoneFrame>
    </div>
  );
}
