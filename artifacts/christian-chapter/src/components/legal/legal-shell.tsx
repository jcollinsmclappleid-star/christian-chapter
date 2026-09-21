import { legalDisplayName, siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";

export function legalMetadata(title: string, path: string, description: string) {
  return buildMetadata({ title, path, description });
}

export function LegalShell({
  title,
  version,
  effective,
  children,
}: {
  title: string;
  version: string;
  effective: string;
  children: React.ReactNode;
}) {
  return (
    <article className="section bg-ivory">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
          Legal
        </p>
        <h1 className="font-serif text-plum mb-4">{title}</h1>
        <p className="text-[14px] text-stone mb-10">
          Version {version} · Effective {effective} · Controller: {legalDisplayName()} ·{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
            {siteConfig.contactEmail}
          </a>
        </p>
        <div className="space-y-5 text-[17px] text-plum-muted leading-7 [&_h2]:font-serif [&_h2]:text-plum [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
          {children}
        </div>
        <p className="mt-12 text-[13px] text-stone">
          These documents describe current founding-cohort processing. Qualified UK
          legal review is still required before paid public acquisition.{" "}
          <a href="/" className="underline">
            Back to Mature Christian Dating
          </a>
        </p>
      </div>
    </article>
  );
}
