/**
 * Search-intent funnels. Commentary describes the person searching.
 * Product facts live in claims.ts and are rendered beside this copy.
 */

export type Funnel = {
  slug: string | null;
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lede: string;
  commentary: readonly [string, string];
  related: readonly string[];
};

export const FUNNELS: readonly Funnel[] = [
  {
    slug: null,
    path: "/christian-dating",
    title: "Christian dating in the UK",
    description:
      "UK Christian dating for adults aged 40 and over. A founding cohort shaped by faith and real life. Matching is not live today. Make a profile to begin.",
    h1: "Christian dating in the UK",
    eyebrow: "For Christians over 40",
    lede: "A calmer way to meet someone who takes faith seriously, built as the Chapter House you can already walk on the homepage.",
    commentary: [
      "People searching for Christian dating in the UK are usually past the idea of meeting just anyone. They want faith to matter in the relationship, and they want the other person to want that too.",
      "Church, work, children and distance all sit in the same week. A profile is where you say what is essential, what you would prefer, and how open you are to travelling. Then you can walk the same rooms shown on the homepage.",
    ],
    related: [
      "/christian-dating/over-40",
      "/christian-dating/catholic",
      "/christian-dating/london",
      "/christian-dating/widowed",
    ],
  },
  {
    slug: "over-40",
    path: "/christian-dating/over-40",
    title: "Christian dating over 40",
    description:
      "Christian dating over 40 for a UK founding cohort. Say what faith and family life need. Matching is not live today. Begin with a profile.",
    h1: "Christian dating over 40",
    eyebrow: "Life in your forties",
    lede: "Your forties often hold work, children and a faith that has already been tested. This page is for saying that plainly.",
    commentary: [
      "A search for Christian dating over 40 rarely starts from a blank life. Some people have children at home. Some are clear they do not want more. Some are starting again after a marriage that ended.",
      "A profile is where that life can be said in your own words, including what you need a partner to understand. Make that profile, then look through the Chapter House for how introductions are meant to work.",
    ],
    related: [
      "/christian-dating/over-50",
      "/christian-dating/after-divorce",
      "/christian-dating",
    ],
  },
  {
    slug: "over-50",
    path: "/christian-dating/over-50",
    title: "Christian dating over 50",
    description:
      "Christian dating over 50 in the UK. A founding profile for faith, family and the week you already have. Matching is not live today.",
    h1: "Christian dating over 50",
    eyebrow: "Life in your fifties",
    lede: "The fifties are often when you know the shape of a good week, and the kind of company you want in it.",
    commentary: [
      "Christian dating over 50 is often a search for steadiness. Parents may need care. Children may have left home, or they may still be close. Faith has usually had time to become specific.",
      "You do not need a long essay. You need a profile that says how you practise, who depends on you, and what kind of relationship you are actually hoping for. The homepage shows the product those answers belong to.",
    ],
    related: [
      "/christian-dating/over-40",
      "/christian-dating/over-60",
      "/christian-dating/remarriage",
    ],
  },
  {
    slug: "over-60",
    path: "/christian-dating/over-60",
    title: "Christian dating over 60",
    description:
      "Christian dating over 60 for adults in the UK founding cohort. There is no maximum age. Matching is not live today. Start with a profile.",
    h1: "Christian dating over 60",
    eyebrow: "Life after 60",
    lede: "Life after 60 can be full, and still leave room for a person who shares your faith.",
    commentary: [
      "People looking for Christian dating over 60 often want clarity and kindness more than novelty. Some are retired. Some are still working. Grandchildren, a parish, and a settled home can all be part of the picture.",
      "There is no upper age on the founding cohort. Write the profile in your own words, including the pace you want. The Chapter House on the homepage is the same place those words are meant to live.",
    ],
    related: [
      "/christian-dating/over-50",
      "/christian-dating/widowed",
      "/christian-dating",
    ],
  },
  {
    slug: "after-divorce",
    path: "/christian-dating/after-divorce",
    title: "Christian dating after divorce",
    description:
      "Christian dating after divorce for UK adults aged 40 and over. A profile can hold family life and faith. Matching is not live today.",
    h1: "Christian dating after divorce",
    eyebrow: "Beginning again",
    lede: "A marriage can end and faith can remain. You should not have to pretend the past did not happen.",
    commentary: [
      "Christian dating after divorce brings practical questions with it: children, co-parenting, and how a church family understands what happened. People differ, and this page does not rule on those differences.",
      "Your profile is the place to say what is true for you, and what you hope a next relationship could hold. When you are ready, begin that profile and use the homepage to see the product around it.",
    ],
    related: [
      "/christian-dating/remarriage",
      "/christian-dating/over-40",
      "/christian-dating/after-bereavement",
    ],
  },
  {
    slug: "after-bereavement",
    path: "/christian-dating/after-bereavement",
    title: "Christian dating after bereavement",
    description:
      "Christian dating after bereavement for UK adults aged 40 and over. Take your own time. Matching is not live today. A profile can wait until you are ready.",
    h1: "Christian dating after bereavement",
    eyebrow: "In your own time",
    lede: "Grief has its own time. When you want company again, you should not have to explain a loss in a rush.",
    commentary: [
      "Bereavement is wider than being widowed. Some people have lost a partner. Some have lost the future they thought they were building. Faith can be a comfort and, for a while, a hard question.",
      "Nothing here asks you to be ready on a timetable. If you want to start, a profile can say what you are open to and what you need to go slowly. The widowed page is there if that is the closer description.",
    ],
    related: [
      "/christian-dating/widowed",
      "/christian-dating/remarriage",
      "/christian-dating",
    ],
  },
  {
    slug: "remarriage",
    path: "/christian-dating/remarriage",
    title: "Christian dating and remarriage",
    description:
      "Christian dating for people considering remarriage. Say where you stand. The UK founding cohort does not rule on church teaching. Matching is not live today.",
    h1: "Christian dating and remarriage",
    eyebrow: "A careful hope",
    lede: "Remarriage is a settled hope for some people and a careful question for others. Your profile can say which it is for you.",
    commentary: [
      "Searches for Christian remarriage often come after divorce or after being widowed. Churches teach differently, and a dating page should not pretend those teachings are the same.",
      "Write what you are open to, and what you would need a partner to understand, on your own profile. The Chapter House on the homepage is the product that profile is for.",
    ],
    related: [
      "/christian-dating/after-divorce",
      "/christian-dating/catholic",
      "/christian-dating/anglican",
    ],
  },
  {
    slug: "widowed",
    path: "/christian-dating/widowed",
    title: "Christian dating for widowed singles",
    description:
      "Christian dating for widowed adults in the UK, aged 40 and over. A profile can hold that history. Matching is not live today.",
    h1: "Christian dating for people who are widowed",
    eyebrow: "After a marriage that ended in death",
    lede: "Being widowed is not the same as being single for the first time. The hope is often for someone who can sit with that history.",
    commentary: [
      "Widowed Christian dating is its own search. Love for a person who died can remain while a new hope begins. Friends and family may have strong views about the timing.",
      "You choose when a profile exists. It can name that you were married, what you miss, and what you would like next, without turning grief into a form to rush. The homepage shows the house that profile belongs to.",
    ],
    related: [
      "/christian-dating/after-bereavement",
      "/christian-dating/over-60",
      "/christian-dating",
    ],
  },
  {
    slug: "catholic",
    path: "/christian-dating/catholic",
    title: "Catholic dating in the UK",
    description:
      "Catholic dating for UK adults aged 40 and over. Record how you practise. Religious answers stay behind separate consent. Matching is not live today.",
    h1: "Catholic dating in the UK",
    eyebrow: "Mass, marriage and parish life",
    lede: "Catholic practice has its own shape: Mass, marriage teaching, and how a parish fits into the week.",
    commentary: [
      "People searching for Catholic dating are often looking for someone who understands that practice, not a vague idea of being Christian. They may also be open to another tradition, or they may not.",
      "A profile can record how you practise. It is not a published list of Catholic members, and religious answers are asked only with separate consent. Begin the profile if you want that practice to be part of how you are known.",
    ],
    related: [
      "/christian-dating/anglican",
      "/christian-dating/remarriage",
      "/christian-dating",
    ],
  },
  {
    slug: "anglican",
    path: "/christian-dating/anglican",
    title: "Anglican dating in the UK",
    description:
      "Anglican dating for UK adults aged 40 and over. A parish, a cathedral, or a quieter practice can sit on your profile. Matching is not live today.",
    h1: "Anglican dating in the UK",
    eyebrow: "Parish, cathedral, or a quieter practice",
    lede: "Anglican life in the UK can mean a parish, a cathedral, or a quieter practice that is still serious.",
    commentary: [
      "Anglican dating covers a wide church. Some people are in the pew every Sunday. Some keep the tradition more quietly and still want a partner who recognises it.",
      "Say which it is on your profile. This is not a live directory of Anglican members. Faith answers stay behind their own consent, and the Chapter House shows where a finished profile is meant to lead.",
    ],
    related: [
      "/christian-dating/catholic",
      "/christian-dating/london",
      "/christian-dating/scotland",
    ],
  },
  {
    slug: "london",
    path: "/christian-dating/london",
    title: "Christian dating in London",
    description:
      "Christian dating in London for adults aged 40 and over. The founding cohort is UK-wide. You set how far you will consider. Matching is not live today.",
    h1: "Christian dating in London",
    eyebrow: "A large city, a particular week",
    lede: "London can be full of people and still be a hard place to meet someone who shares your faith and your actual week.",
    commentary: [
      "Christian dating in London often comes down to time: a commute, a church that is not near the office, and evenings that are already spoken for. A postcode is not the same as a shared life.",
      "The founding cohort is for the UK, not a London-only club. You choose how open you are to distance. Make a profile if London is where your life is, then see that choice on the homepage.",
    ],
    related: [
      "/christian-dating/scotland",
      "/christian-dating/over-40",
      "/christian-dating",
    ],
  },
  {
    slug: "scotland",
    path: "/christian-dating/scotland",
    title: "Christian dating in Scotland",
    description:
      "Christian dating in Scotland for adults aged 40 and over. A UK founding cohort, with distance you choose. Matching is not live today.",
    h1: "Christian dating in Scotland",
    eyebrow: "Cities, towns and longer roads",
    lede: "From the cities to smaller communities, meeting someone who shares your faith can mean more than a short trip across town.",
    commentary: [
      "Christian dating in Scotland has to respect distance. Edinburgh, Glasgow, Aberdeen, the Highlands and the islands are not one neighbourhood. A good match on paper can still be a long way from Friday night.",
      "You set how far you are willing to consider. The cohort is UK-wide, and this page does not pretend to count people near you. Start a profile if Scotland is home, and use the Chapter House to see the product.",
    ],
    related: [
      "/christian-dating/london",
      "/christian-dating/over-50",
      "/christian-dating",
    ],
  },
];

const byPath = new Map(FUNNELS.map((page) => [page.path, page]));

export function funnelByPath(path: string): Funnel | undefined {
  return byPath.get(path);
}

export function funnelBySlug(slug: string): Funnel | undefined {
  return FUNNELS.find((page) => page.slug === slug);
}

export function funnelSlugs(): string[] {
  return FUNNELS.flatMap((page) => (page.slug ? [page.slug] : []));
}

export function commentaryText(page: Funnel): string {
  return [page.lede, ...page.commentary].join(" ");
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
