import { MINIMUM_AGE } from "../site-config.ts";
import { alsoInRegion, isHubPlace, isTopPlace, PLACES, placePath, regionBySlug, regionPath, regionPrimary, type Place } from "./places.ts";

export type AcquisitionLink = { href: string; label: string };

export type AcquisitionPage = {
  path: string;
  h1: string;
  title: string;
  description: string;
  lede: string;
  crumbs: AcquisitionLink[];
  related: AcquisitionLink[];
  primaryQuery: string;
  searchIntent: string;
  sourceFile: string;
};

const HOME: AcquisitionLink = { href: "/", label: "Home" };
const HUB: AcquisitionLink = { href: "/christian-dating", label: "Christian dating" };
const FREE: AcquisitionLink = { href: "/free-christian-dating", label: "Free Christian dating" };

function page(entry: Omit<AcquisitionPage, "title" | "description"> & { title?: string; description?: string }): AcquisitionPage {
  const title = entry.title ?? entry.h1;
  const description = entry.description ?? `${entry.h1}. Mature Christian Dating is for UK adults aged ${MINIMUM_AGE} and over. Founding membership is free.`;
  return { ...entry, title, description };
}

const INTENTS: { slug: string; h1: string; lede: string; query: string }[] = [
  { slug: "over-45", h1: "Christian dating over 45", query: "christian dating over 45", lede: "Christian dating over 45 is for adults aged 45 and over. Mature Christian Dating welcomes adults from 40, with no maximum age." },
  { slug: "over-55", h1: "Christian dating over 55", query: "christian dating over 55", lede: "Christian dating over 55 is for adults aged 55 and over. The profile is where you say what a good week looks like." },
  { slug: "over-65", h1: "Christian dating over 65", query: "christian dating over 65", lede: "Christian dating over 65 is for adults aged 65 and over. There is no maximum age on Mature Christian Dating." },
  { slug: "over-70", h1: "Christian dating over 70", query: "christian dating over 70", lede: "Christian dating over 70 is for adults aged 70 and over. A lasting relationship can start at this age." },
  { slug: "divorced", h1: "Divorced Christian dating", query: "divorced christian dating", lede: "Divorced Christian dating is for adults whose marriage has ended and who want a faithful relationship again." },
  { slug: "separated", h1: "Christian dating while separated", query: "separated christian dating uk", lede: "Separated Christian dating is for adults who are living apart and want to say that plainly on a profile." },
  { slug: "never-married", h1: "Christian dating if you never married", query: "never married christian dating", lede: "Christian dating for adults who never married is a straightforward hope. The profile can say that in your own words." },
  { slug: "england", h1: "Christian dating in England", query: "christian dating england", lede: "Christian dating in England covers the English regions, from London and the South East to the North East. Scotland, Wales, and Northern Ireland have their own pages." },
  { slug: "evangelical", h1: "Evangelical Christian dating", query: "evangelical dating uk", lede: "Evangelical Christian dating is for adults who would name that tradition. You write what faith means to you after you sign in." },
  { slug: "non-denominational", h1: "Non-denominational Christian dating", query: "non denominational christian dating uk", lede: "Non-denominational Christian dating is for adults whose church is not one of the larger named traditions." },
  { slug: "charismatic", h1: "Charismatic Christian dating", query: "charismatic christian dating uk", lede: "Charismatic Christian dating is for adults for whom that worship is part of ordinary life." },
  { slug: "orthodox", h1: "Orthodox Christian dating", query: "orthodox christian dating uk", lede: "Orthodox Christian dating is for adults in the Orthodox churches who want a partner who understands that life." },
  { slug: "church-of-scotland", h1: "Church of Scotland dating", query: "church of scotland dating", lede: "Church of Scotland dating is for adults whose church life is in that tradition, including people now living elsewhere in the UK." },
  { slug: "urc", h1: "United Reformed Church dating", query: "united reformed church dating", lede: "United Reformed Church dating is for adults in the URC who want that named on a profile." },
  { slug: "salvation-army", h1: "Salvation Army dating", query: "salvation army dating uk", lede: "Salvation Army dating is for adults whose faith is lived in that church." },
  { slug: "adventist", h1: "Seventh-day Adventist dating", query: "seventh day adventist dating uk", lede: "Seventh-day Adventist dating is for adults who keep that tradition and want it understood." },
  { slug: "brethren", h1: "Brethren Christian dating", query: "brethren dating uk", lede: "Brethren Christian dating is for adults from Brethren churches who want a relationship in which faith is understood." },
  { slug: "quaker", h1: "Quaker dating", query: "quaker dating uk", lede: "Quaker dating is for adults in the Religious Society of Friends who want a partner who respects that worship." },
];

type FacetTier = "top" | "hub" | "london";

type FacetDef = {
  slug: string;
  tier: FacetTier;
  h1: (name: string) => string;
  lede: (name: string, region: string) => string;
  related: AcquisitionLink;
};

const noCap = "There is no maximum age.";

const FACETS: FacetDef[] = [
  { slug: "over-50", tier: "top", h1: (name) => `Christian dating over 50 in ${name}`, lede: (name, region) => `Christian dating over 50 in ${name} is for adults aged 50 and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/over-50", label: "Christian dating over 50" } },
  { slug: "catholic", tier: "top", h1: (name) => `Catholic dating in ${name}`, lede: (name, region) => `Catholic dating in ${name} is for Catholic adults aged ${MINIMUM_AGE} and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/catholic", label: "Catholic dating" } },
  { slug: "after-divorce", tier: "top", h1: (name) => `Christian dating after divorce in ${name}`, lede: (name, region) => `Christian dating after divorce in ${name} is for adults whose marriage has ended. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/after-divorce", label: "Christian dating after divorce" } },
  { slug: "over-40", tier: "hub", h1: (name) => `Christian dating over 40 in ${name}`, lede: (name, region) => `Christian dating over 40 in ${name} is for adults aged 40 and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/over-40", label: "Christian dating over 40" } },
  { slug: "over-60", tier: "hub", h1: (name) => `Christian dating over 60 in ${name}`, lede: (name, region) => `Christian dating over 60 in ${name} is for adults aged 60 and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/over-60", label: "Christian dating over 60" } },
  { slug: "anglican", tier: "hub", h1: (name) => `Anglican dating in ${name}`, lede: (name, region) => `Anglican dating in ${name} is for Anglican adults aged ${MINIMUM_AGE} and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/anglican", label: "Anglican dating" } },
  { slug: "widowed", tier: "hub", h1: (name) => `Christian dating for widowed adults in ${name}`, lede: (name, region) => `Christian dating for widowed adults in ${name} is for people whose partner has died. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/widowed", label: "Christian dating for widowed singles" } },
  { slug: "baptist", tier: "london", h1: (name) => `Baptist dating in ${name}`, lede: (name, region) => `Baptist dating in ${name} is for Baptist adults aged ${MINIMUM_AGE} and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/baptist", label: "Baptist dating" } },
  { slug: "methodist", tier: "london", h1: (name) => `Methodist dating in ${name}`, lede: (name, region) => `Methodist dating in ${name} is for Methodist adults aged ${MINIMUM_AGE} and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/methodist", label: "Methodist dating" } },
  { slug: "pentecostal", tier: "london", h1: (name) => `Pentecostal dating in ${name}`, lede: (name, region) => `Pentecostal dating in ${name} is for Pentecostal adults aged ${MINIMUM_AGE} and over. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/pentecostal", label: "Pentecostal dating" } },
  { slug: "evangelical", tier: "london", h1: (name) => `Evangelical dating in ${name}`, lede: (name, region) => `Evangelical dating in ${name} is for adults who would name that tradition. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/evangelical", label: "Evangelical Christian dating" } },
  { slug: "remarriage", tier: "london", h1: (name) => `Christian remarriage in ${name}`, lede: (name, region) => `Christian remarriage in ${name} is for adults who are open to marrying again. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/remarriage", label: "Christian remarriage" } },
  { slug: "after-bereavement", tier: "london", h1: (name) => `Christian dating after bereavement in ${name}`, lede: (name, region) => `Christian dating after bereavement in ${name} is for adults who have lost a partner. ${name} is in ${region}. ${noCap}`, related: { href: "/christian-dating/after-bereavement", label: "Christian dating after bereavement" } },
];

export function facetsForPlace(slug: string): FacetDef[] {
  return FACETS.filter((facet) => {
    if (facet.tier === "top") return isTopPlace(slug);
    if (facet.tier === "hub") return isHubPlace(slug);
    return slug === "london";
  });
}

export function facetSlugsForPlace(slug: string): string[] {
  return facetsForPlace(slug).map((facet) => facet.slug);
}

function nearbyLinks(place: Place): AcquisitionLink[] {
  const primary = regionPrimary(place);
  const others = alsoInRegion(place).filter((item) => item.slug !== primary?.slug);
  return [
    ...(primary ? [{ href: placePath(primary), label: primary.name }] : []),
    ...others.map((item) => ({ href: placePath(item), label: item.name })),
  ];
}

function intentPages(): AcquisitionPage[] {
  return INTENTS.map((intent) =>
    page({
      path: `/christian-dating/${intent.slug}`,
      h1: intent.h1,
      lede: intent.lede,
      primaryQuery: intent.query,
      searchIntent: intent.h1,
      sourceFile: "app/christian-dating/[slug]/page.tsx",
      crumbs: [HOME, HUB, { href: `/christian-dating/${intent.slug}`, label: intent.h1 }],
      related: [
        HUB,
        FREE,
        { href: "/christian-dating/over-50", label: "Christian dating over 50" },
        { href: "/christian-dating/catholic", label: "Catholic dating" },
      ],
    }),
  );
}

function rootPages(): AcquisitionPage[] {
  return [
    page({
      path: "/christian-singles",
      h1: "Christian singles",
      lede: "Christian singles aged 40 and over can write a profile here, including what faith means to them after they sign in.",
      primaryQuery: "christian singles uk",
      searchIntent: "Find Christian singles in the UK aged 40 and over",
      sourceFile: "app/christian-singles/page.tsx",
      crumbs: [HOME, { href: "/christian-singles", label: "Christian singles" }],
      related: [HUB, FREE, { href: "/christian-dating/over-50", label: "Christian dating over 50" }],
    }),
    page({
      path: "/christian-dating-uk",
      h1: "Christian dating UK",
      lede: "Christian dating UK on this site means adults aged 40 and over, across England, Scotland, Wales, and Northern Ireland.",
      primaryQuery: "christian dating uk",
      searchIntent: "UK Christian dating for adults aged 40 and over",
      sourceFile: "app/christian-dating-uk/page.tsx",
      crumbs: [HOME, { href: "/christian-dating-uk", label: "Christian dating UK" }],
      related: [HUB, { href: "/christian-dating/england", label: "Christian dating in England" }, { href: "/christian-dating/scotland", label: "Christian dating in Scotland" }],
    }),
  ];
}

function placePages(): AcquisitionPage[] {
  const pages: AcquisitionPage[] = [];
  for (const place of PLACES) {
    const region = regionBySlug(place.region);
    if (!region) continue;
    const path = placePath(place);
    pages.push(
      page({
        path,
        h1: `Christian dating in ${place.name}`,
        lede: `Christian dating in ${place.name} is for adults aged ${MINIMUM_AGE} and over. ${place.name} is in ${region.name}. There is no maximum age.`,
        primaryQuery: `christian dating ${place.name.toLowerCase()}`,
        searchIntent: `Christian dating for adults in ${place.name}`,
        sourceFile: "app/christian-dating/in/[place]/[[...facet]]/page.tsx",
        crumbs: [HOME, HUB, { href: regionPath(place.region), label: region.name }, { href: path, label: place.name }],
        related: [
          { href: regionPath(place.region), label: region.name },
          ...nearbyLinks(place),
          ...(isTopPlace(place.slug)
            ? [
                { href: `${path}/over-50`, label: `Over 50 in ${place.name}` },
                { href: `/free-christian-dating/in/${place.slug}`, label: `Free Christian dating in ${place.name}` },
              ]
            : []),
          ...(isHubPlace(place.slug)
            ? [
                { href: `${path}/over-40`, label: `Over 40 in ${place.name}` },
                { href: `${path}/anglican`, label: `Anglican dating in ${place.name}` },
              ]
            : []),
          ...(place.slug === "london"
            ? [
                { href: `${path}/widowed`, label: `Widowed singles in ${place.name}` },
                { href: `${path}/baptist`, label: `Baptist dating in ${place.name}` },
              ]
            : []),
        ],
      }),
    );
    for (const facet of facetsForPlace(place.slug)) {
      const facetPath = `${path}/${facet.slug}`;
      pages.push(
        page({
          path: facetPath,
          h1: facet.h1(place.name),
          lede: facet.lede(place.name, region.name),
          primaryQuery: `${facet.slug.replaceAll("-", " ")} christian dating ${place.name.toLowerCase()}`,
          searchIntent: facet.h1(place.name),
          sourceFile: "app/christian-dating/in/[place]/[[...facet]]/page.tsx",
          crumbs: [HOME, HUB, { href: path, label: place.name }, { href: facetPath, label: facet.h1(place.name) }],
          related: [
            { href: path, label: `Christian dating in ${place.name}` },
            { href: regionPath(place.region), label: region.name },
            facet.related,
          ],
        }),
      );
    }
  }
  return pages;
}

function freePages(): AcquisitionPage[] {
  const sourceFile = "app/free-christian-dating/[[...slug]]/page.tsx";
  const fixed: AcquisitionPage[] = [
    page({
      path: "/free-christian-dating",
      h1: "Free Christian dating",
      lede: "Free Christian dating on Mature Christian Dating means founding membership is free. No payment is taken.",
      primaryQuery: "free christian dating",
      searchIntent: "Join a Christian dating service without paying",
      sourceFile,
      crumbs: [HOME, FREE],
      related: [
        HUB,
        { href: "/free-christian-dating/over-50", label: "Free Christian dating over 50" },
        { href: "/free-christian-dating/catholic", label: "Free Catholic dating" },
        { href: "/free-christian-dating/in/london", label: "Free Christian dating in London" },
      ],
    }),
    page({
      path: "/free-christian-dating/uk",
      h1: "Free Christian dating in the UK",
      lede: "Free Christian dating in the UK is the founding offer: adults aged 40 and over can create a profile without payment.",
      primaryQuery: "free christian dating uk",
      searchIntent: "Free UK Christian dating for adults aged 40 and over",
      sourceFile,
      crumbs: [HOME, FREE, { href: "/free-christian-dating/uk", label: "United Kingdom" }],
      related: [HUB, { href: "/christian-dating/england", label: "Christian dating in England" }],
    }),
    page({
      path: "/free-christian-dating/over-40",
      h1: "Free Christian dating over 40",
      lede: "Free Christian dating over 40 is for founding members aged 40 and over. Creating a profile does not take a payment.",
      primaryQuery: "free christian dating over 40",
      searchIntent: "Free Christian dating for adults over 40",
      sourceFile,
      crumbs: [HOME, FREE, { href: "/free-christian-dating/over-40", label: "Over 40" }],
      related: [{ href: "/christian-dating/over-40", label: "Christian dating over 40" }, HUB],
    }),
    page({
      path: "/free-christian-dating/over-50",
      h1: "Free Christian dating over 50",
      lede: "Free Christian dating over 50 is for founding members aged 50 and over. The profile is free to create.",
      primaryQuery: "free christian dating over 50",
      searchIntent: "Free Christian dating for adults over 50",
      sourceFile,
      crumbs: [HOME, FREE, { href: "/free-christian-dating/over-50", label: "Over 50" }],
      related: [{ href: "/christian-dating/over-50", label: "Christian dating over 50" }, HUB],
    }),
    page({
      path: "/free-christian-dating/over-60",
      h1: "Free Christian dating over 60",
      lede: "Free Christian dating over 60 is for founding members aged 60 and over. There is no maximum age, and no payment is taken.",
      primaryQuery: "free christian dating over 60",
      searchIntent: "Free Christian dating for adults over 60",
      sourceFile,
      crumbs: [HOME, FREE, { href: "/free-christian-dating/over-60", label: "Over 60" }],
      related: [{ href: "/christian-dating/over-60", label: "Christian dating over 60" }, HUB],
    }),
    page({
      path: "/free-christian-dating/catholic",
      h1: "Free Catholic dating",
      lede: "Free Catholic dating here is the same founding offer. Catholic adults aged 40 and over can create a profile without payment.",
      primaryQuery: "free catholic dating uk",
      searchIntent: "Free Catholic dating for UK adults aged 40 and over",
      sourceFile,
      crumbs: [HOME, FREE, { href: "/free-christian-dating/catholic", label: "Catholic" }],
      related: [{ href: "/christian-dating/catholic", label: "Catholic dating" }, HUB],
    }),
    page({
      path: "/free-christian-dating/after-divorce",
      h1: "Free Christian dating after divorce",
      lede: "Free Christian dating after divorce is for founding members whose marriage has ended. The profile does not require a payment.",
      primaryQuery: "free christian dating after divorce",
      searchIntent: "Free Christian dating for adults after divorce",
      sourceFile,
      crumbs: [HOME, FREE, { href: "/free-christian-dating/after-divorce", label: "After divorce" }],
      related: [{ href: "/christian-dating/after-divorce", label: "Christian dating after divorce" }, HUB],
    }),
  ];
  const cityFree = PLACES.filter((place) => isTopPlace(place.slug)).map((place) => {
    const region = regionBySlug(place.region);
    return page({
      path: `/free-christian-dating/in/${place.slug}`,
      h1: `Free Christian dating in ${place.name}`,
      lede: `Free Christian dating in ${place.name} means a founding profile with no payment taken. ${place.name} is in ${region?.name}. There is no maximum age.`,
      primaryQuery: `free christian dating ${place.name.toLowerCase()}`,
      searchIntent: `Free Christian dating in ${place.name}`,
      sourceFile,
      crumbs: [HOME, FREE, { href: `/free-christian-dating/in/${place.slug}`, label: place.name }],
      related: [
        { href: placePath(place), label: `Christian dating in ${place.name}` },
        FREE,
      ],
    });
  });
  return [...fixed, ...cityFree];
}

export const acquisitionPages: AcquisitionPage[] = [
  ...rootPages(),
  ...intentPages(),
  ...placePages(),
  ...freePages(),
];

const byPath = new Map(acquisitionPages.map((item) => [item.path, item]));

export function acquisitionByPath(path: string): AcquisitionPage | undefined {
  return byPath.get(path);
}

export function acquisitionIntent(slug: string): AcquisitionPage | undefined {
  return byPath.get(`/christian-dating/${slug}`);
}

export function placeFacetPage(placeSlug: string, facet?: string): AcquisitionPage | undefined {
  const path = facet ? `/christian-dating/in/${placeSlug}/${facet}` : `/christian-dating/in/${placeSlug}`;
  return byPath.get(path);
}

export function freeAcquisition(parts: string[] | undefined): AcquisitionPage | undefined {
  if (!parts || parts.length === 0) return byPath.get("/free-christian-dating");
  return byPath.get(`/free-christian-dating/${parts.join("/")}`);
}
