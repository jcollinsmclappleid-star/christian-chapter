import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { FOUNDING_MEMBER_COPY, MINIMUM_AGE, siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "About us",
  description:
    "Mature Christian Dating is for UK adults aged 40 and over who want a lasting relationship with someone who shares their faith.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="bg-ivory">
      <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <h1 className="font-sans text-[2.2rem] font-bold leading-[1.05] tracking-[-0.03em] text-plum md:text-[2.8rem]">
          About us
        </h1>
        <p className="mt-5 text-[18px] leading-7 text-plum">
          Mature Christian Dating is for adults in the United Kingdom aged {MINIMUM_AGE} and over. There is no maximum age.
        </p>
        <p className="mt-4 text-[17px] leading-7 text-plum-muted">
          People come here for a lasting relationship with someone who shares their faith. After you sign in, you write what faith means to you. Other members read that on your profile.
        </p>
        <p className="mt-4 text-[17px] leading-7 text-plum-muted">{FOUNDING_MEMBER_COPY}</p>
        <p className="mt-4 text-[17px] leading-7 text-plum-muted">
          Write to us at{" "}
          <a className="font-semibold text-life underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
        <div className="mt-8">
          <LinkButton href="/register" size="lg">
            Create your free profile
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
