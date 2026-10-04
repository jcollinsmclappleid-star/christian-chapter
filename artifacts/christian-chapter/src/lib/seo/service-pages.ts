import {
  CONCIERGE_PRICE_LABEL,
  MEMBER_BILLING_STARTS_LABEL,
  MEMBER_PRICE_LABEL,
  OPENING_OFFER_ENDS_LABEL,
} from "../site-config.ts";

export type ServicePageLink = { href: string; label: string };

export type ServicePageRecord = {
  path: string;
  primaryQuery: string;
  searchIntent: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  image: { src: string; alt: string; position?: string };
  focus: {
    heading: string;
    body: string;
  };
  benefits: readonly {
    title: string;
    body: string;
  }[];
  processHeading: string;
  processIntro: string;
  steps: readonly {
    title: string;
    body: string;
  }[];
  note: {
    title: string;
    body: string;
  };
  faqs: readonly {
    q: string;
    a: string;
  }[];
  related: readonly ServicePageLink[];
  sourceFile: string;
};

export const servicePages: readonly ServicePageRecord[] = [
  {
    path: "/christian-matchmaker",
    primaryQuery: "christian matchmaker uk",
    searchIntent: "Find a UK Christian matchmaker for adults over 40",
    title: "Christian matchmaker for UK singles over 40",
    description: `A Christian matchmaker may hand-pick an introduction from your complete profile. Join free as a founding member until ${OPENING_OFFER_ENDS_LABEL}. No card is taken.`,
    h1: "A Christian matchmaker who starts with your story",
    eyebrow: "Christian matchmaker UK",
    intro:
      "For people who would rather be introduced with context than left to work through a crowd of profiles. Tell us about your faith, the shape of your life now and what would make a relationship work. A matchmaker can then look for one thoughtful reason to introduce you.",
    image: {
      src: "/images/home/claire-cafe.jpg",
      alt: "A woman in her fifties smiling across a cafe table",
      position: "object-[center_24%]",
    },
    focus: {
      heading: "Human judgement, grounded in a complete profile",
      body:
        "A useful introduction needs more than an age and a photograph. Your profile covers everyday life, church and faith, family circumstances, relationship intentions and the distance you are prepared to travel. It gives the matchmaker something real to work with and gives the other person a clearer sense of you.",
    },
    benefits: [
      {
        title: "Your boundaries stay visible",
        body: "You mark the things that are Essential, Preferred or open to discussion, so the difference between a firm boundary and a hope is clear.",
      },
      {
        title: "Faith is written in your words",
        body: "A denomination label is only a starting point. Your profile can explain what belief, worship and church life look like week to week.",
      },
      {
        title: "An introduction comes with a reason",
        body: "The aim is not a stream of names. It is a considered introduction with enough context for you to decide whether you would like to know more.",
      },
    ],
    processHeading: "How the founding matchmaker service works",
    processIntro:
      "The current human service is a temporary founding extra while the full dating service prepares to open.",
    steps: [
      {
        title: "Create your profile free",
        body: "Sign in by email and complete the questions about you, your faith and the person you hope to meet. No card is requested.",
      },
      {
        title: "Set what matters",
        body: "Use Essentials for firm boundaries and Preferences for the qualities that would make an introduction more promising.",
      },
      {
        title: "Be considered for an introduction",
        body: `Until ${OPENING_OFFER_ENDS_LABEL}, a matchmaker may hand-pick an introduction from complete founding profiles. An introduction is a choice, not a guarantee.`,
      },
    ],
    note: {
      title: "A clear founding-stage promise",
      body: `Mature Christian Dating is the main service. The personal matchmaker is included free for founding members until matching technology opens on ${OPENING_OFFER_ENDS_LABEL}. There is no promise that a suitable introduction will be available, and no payment is taken now.`,
    },
    faqs: [
      {
        q: "Is Mature Christian Dating a matchmaker or a dating service?",
        a: `It is a Christian dating service for UK adults aged 40 and over. Until ${OPENING_OFFER_ENDS_LABEL}, founding members may also receive a human-picked introduction free of charge.`,
      },
      {
        q: "What does the matchmaker use?",
        a: "The matchmaker works from complete profiles, including faith, life now, intentions, relationship preferences and chosen travel distance.",
      },
      {
        q: "Do I have to pay to join?",
        a: `No. Founding membership is free until ${OPENING_OFFER_ENDS_LABEL}, and no card is taken during the opening offer.`,
      },
    ],
    related: [
      { href: "/christian-matchmaking", label: "How Christian matchmaking works" },
      { href: "/personal-matchmaker", label: "Personal Christian matchmaker" },
      { href: "/free-christian-matchmaker", label: "The free founding offer" },
    ],
    sourceFile: "app/christian-matchmaker/page.tsx",
  },
  {
    path: "/christian-matchmaking",
    primaryQuery: "christian matchmaking uk",
    searchIntent: "Understand Christian matchmaking and compatibility",
    title: "Christian matchmaking built around what matters",
    description: `Christian matchmaking for UK adults over 40, using your faith, life and relationship priorities. Create a founding profile free until ${OPENING_OFFER_ENDS_LABEL}.`,
    h1: "Christian matchmaking, with the important things made clear",
    eyebrow: "Christian matchmaking UK",
    intro:
      "Compatibility is not a checklist of identical interests. It is knowing where two lives need to align, where a preference would help and where both people are willing to be surprised. Our profile is designed to preserve those differences before an introduction is made.",
    image: {
      src: "/images/home/churchyard-walk.jpg",
      alt: "A mature couple talking as they walk beside a churchyard",
      position: "object-[center_30%]",
    },
    focus: {
      heading: "Three levels, instead of one long wish list",
      body:
        "For each compatibility question, you can choose Essential, Preferred or Open-minded. Essential means a boundary that should not be crossed. Preferred shapes the quality of an introduction. Open-minded leaves room for a conversation. That structure helps your answers mean what you intended.",
    },
    benefits: [
      {
        title: "Faith with context",
        body: "Say what your Christian faith means in practice, including church life and the place you hope belief will have in a relationship.",
      },
      {
        title: "Life as it actually is",
        body: "Children, caring responsibilities, work, retirement and location can all shape a relationship after 40. The profile makes room for them.",
      },
      {
        title: "Reasons you can assess",
        body: "A considered introduction should explain the points of alignment, so you can decide for yourself rather than being asked to trust a score.",
      },
    ],
    processHeading: "From priorities to a possible introduction",
    processIntro:
      "The same profile supports the opening matchmaker service and the matching technology that follows it.",
    steps: [
      {
        title: "Describe your present life",
        body: "Start with the person you are now: faith, family, routines, hopes and what a good ordinary week looks like.",
      },
      {
        title: "Separate needs from preferences",
        body: "Choose the few things that are genuinely essential, then give preferences and open questions their proper place.",
      },
      {
        title: "Receive context, not just a profile",
        body: "When an introduction is prepared, the reason for it should be visible alongside the other person's own words.",
      },
    ],
    note: {
      title: "What is available now",
      body: `You can create and complete your founding profile now. A matchmaker may prepare an introduction before ${OPENING_OFFER_ENDS_LABEL}; matching technology opens on that date. No card is taken during the founding offer.`,
    },
    faqs: [
      {
        q: "Is Christian matchmaking only about denomination?",
        a: "No. Denomination can matter, but so can the way faith is lived, relationship intentions, family circumstances and practical distance.",
      },
      {
        q: "What is an Essential?",
        a: "An Essential is a firm relationship boundary you ask the service to respect. Preferred and Open-minded answers are treated differently.",
      },
      {
        q: "Can I join before matching technology opens?",
        a: `Yes. You can create your founding profile free now. Matching technology opens on ${OPENING_OFFER_ENDS_LABEL}.`,
      },
    ],
    related: [
      { href: "/christian-matchmaker", label: "Christian matchmaker" },
      { href: "/how-it-works", label: "The full process" },
      { href: "/christian-dating/over-40", label: "Christian dating over 40" },
    ],
    sourceFile: "app/christian-matchmaking/page.tsx",
  },
  {
    path: "/christian-introduction-service",
    primaryQuery: "christian introduction service uk",
    searchIntent: "Find a considered Christian introduction service",
    title: "Christian introduction service for thoughtful connections",
    description: `A UK Christian introduction service for adults aged 40 and over. Build a complete profile and join the founding cohort free until ${OPENING_OFFER_ENDS_LABEL}.`,
    h1: "A Christian introduction service for people who value context",
    eyebrow: "Christian introduction service UK",
    intro:
      "An introduction should answer the first useful question: why might the two of you get along? Mature Christian Dating begins with complete profiles and aims to make that reason clear, so you can consider one another as people rather than as a row of search results.",
    image: {
      src: "/images/home/cafe-daylight.jpg",
      alt: "Two mature adults sharing a relaxed conversation in a bright cafe",
      position: "object-center",
    },
    focus: {
      heading: "A calmer first step",
      body:
        "The service is designed around introductions rather than cold approaches. You decide what belongs on your profile, receive the context for a possible connection and choose whether to respond. When interest is mutual, the conversation can move forward privately.",
    },
    benefits: [
      {
        title: "Enough detail to make a decision",
        body: "Profiles can cover faith, character, family, interests, intentions and everyday rhythms before either person has to begin a conversation.",
      },
      {
        title: "No pressure to say yes",
        body: "An introduction is an invitation to consider someone. You can express interest, keep it for later or decline without supplying a reason.",
      },
      {
        title: "Distance is your decision",
        body: "You choose how far you are prepared to travel, from 10 to 200 miles, so practical geography is part of the picture.",
      },
    ],
    processHeading: "What makes an introduction useful",
    processIntro:
      "The work happens before the first message: a full account of both people and a clear basis for bringing them together.",
    steps: [
      {
        title: "Complete the profile in your own words",
        body: "Short answers provide structure, while written sections let your voice and the texture of your life come through.",
      },
      {
        title: "Choose your relationship boundaries",
        body: "Mark firm Essentials separately from preferences, including the questions where you are genuinely open-minded.",
      },
      {
        title: "Consider the person and the reason",
        body: "A prepared introduction brings the profile and the points of possible alignment together in one place.",
      },
    ],
    note: {
      title: "Introductions without inflated promises",
      body: "A complete profile can be considered for an introduction, but no service can promise that the right person is already available. You remain free to decline, and an introduction does not guarantee a relationship.",
    },
    faqs: [
      {
        q: "What is the difference between an introduction service and a dating directory?",
        a: "An introduction service brings a possible connection to you with context. It does not depend on endlessly searching through names yourself.",
      },
      {
        q: "Who can join?",
        a: "Mature Christian Dating is for UK adults aged 40 and over. There is no maximum age.",
      },
      {
        q: "Is the founding profile free?",
        a: `Yes. Founding membership is free until ${OPENING_OFFER_ENDS_LABEL}, and no card is taken now.`,
      },
    ],
    related: [
      { href: "/christian-matchmaker", label: "Christian matchmaker" },
      { href: "/christian-dating-agency", label: "Christian dating agency" },
      { href: "/safety", label: "Dating safety" },
    ],
    sourceFile: "app/christian-introduction-service/page.tsx",
  },
  {
    path: "/concierge-matchmaking",
    primaryQuery: "concierge matchmaking uk",
    searchIntent: "Understand the founding concierge matchmaking offer",
    title: "Concierge matchmaking for founding members",
    description: `The founding concierge offer gives complete profiles human consideration before ${OPENING_OFFER_ENDS_LABEL}. It is included free and no card is taken.`,
    h1: "Concierge matchmaking, included for founding members",
    eyebrow: "The opening concierge offer",
    intro:
      "Concierge matchmaking is the human part of our opening offer. While the matching technology is being prepared, a matchmaker may read a complete founding profile and hand-pick a possible introduction. It is a temporary extra, included at no charge.",
    image: {
      src: "/images/home/profile-claire.jpg",
      alt: "A mature woman smiling in a warmly lit room",
      position: "object-[center_18%]",
    },
    focus: {
      heading: "What concierge means here",
      body:
        "It does not mean a guaranteed partner, unlimited introductions or a separate elite membership. It means a person can consider the detail in your completed profile while the core dating service is in its founding stage. If there is a plausible introduction to make, you receive the reason as well as the profile.",
    },
    benefits: [
      {
        title: "Included, not upsold",
        body: `The concierge is priced at ${CONCIERGE_PRICE_LABEL} for the future, but founding members receive it free during the opening period.`,
      },
      {
        title: "Built on your own answers",
        body: "The matchmaker works from the same profile you control, including your faith, intentions and stated relationship boundaries.",
      },
      {
        title: "A bridge to the full service",
        body: "The dating membership remains the product. Matching technology takes over when the founding offer ends.",
      },
    ],
    processHeading: "Using the concierge offer",
    processIntro:
      "There is no separate application and no payment screen for founding members.",
    steps: [
      {
        title: "Join the founding cohort",
        body: "Create an account with your email address and begin the profile. Membership is open to UK adults aged 40 and over.",
      },
      {
        title: "Finish the parts that guide an introduction",
        body: "Complete your story, faith, relationship intentions, travel distance and the qualities you mark as Essential or Preferred.",
      },
      {
        title: "Let the profile do its work",
        body: "A matchmaker may consider it for a hand-picked introduction. Suitability and availability determine whether one can be made.",
      },
    ],
    note: {
      title: "Dates and pricing, plainly stated",
      body: `The concierge is included free until ${OPENING_OFFER_ENDS_LABEL}. Matching technology opens on that date. Dating membership is planned at ${MEMBER_PRICE_LABEL} from ${MEMBER_BILLING_STARTS_LABEL}; billing is not switched on and no card is taken today.`,
    },
    faqs: [
      {
        q: "Is concierge matchmaking free?",
        a: `It is included free for founding members until ${OPENING_OFFER_ENDS_LABEL}. No payment card is taken during that period.`,
      },
      {
        q: "Does concierge membership guarantee an introduction?",
        a: "No. A matchmaker may prepare an introduction when there is a suitable complete profile, but availability cannot be guaranteed.",
      },
      {
        q: "What happens after the founding offer?",
        a: `The temporary concierge extra ends when matching technology opens. The planned dating membership price is ${MEMBER_PRICE_LABEL} from ${MEMBER_BILLING_STARTS_LABEL}.`,
      },
    ],
    related: [
      { href: "/pricing", label: "Founding pricing" },
      { href: "/christian-matchmaker", label: "Christian matchmaker" },
      { href: "/how-it-works", label: "How the dating service works" },
    ],
    sourceFile: "app/concierge-matchmaking/page.tsx",
  },
  {
    path: "/free-christian-matchmaker",
    primaryQuery: "free christian matchmaker",
    searchIntent: "Join a Christian matchmaker without paying",
    title: "Free Christian matchmaker founding offer",
    description: `Join the free Christian matchmaker founding offer for UK adults over 40. Complete your profile before ${OPENING_OFFER_ENDS_LABEL}; no card is taken.`,
    h1: "A free Christian matchmaker during our founding offer",
    eyebrow: "Join without a payment card",
    intro:
      "Free means free at the point you join: there is no checkout, trial charge or card collection. Complete your profile and it can be considered for a hand-picked introduction while the founding offer is running.",
    image: {
      src: "/images/home/priya-market.jpg",
      alt: "A woman in her forties smiling at an outdoor market",
      position: "object-[center_22%]",
    },
    focus: {
      heading: "What the free offer includes",
      body:
        "You can create the full dating profile, explain your faith and set your relationship priorities. Until matching technology opens, a personal concierge introduction is also included for founding members. The offer does not shorten the profile or place free members in a separate group.",
    },
    benefits: [
      {
        title: "No card to forget about",
        body: "Payment is not switched on during the founding period, so there is no card request and no automatic founding-stage charge.",
      },
      {
        title: "A complete profile",
        body: "The free offer includes the questions used to understand your life, faith, intentions, practical distance and compatibility priorities.",
      },
      {
        title: "Human consideration while you wait",
        body: "A matchmaker may hand-pick an introduction before the matching technology opens, depending on suitable profiles being available.",
      },
    ],
    processHeading: "Start free in three straightforward steps",
    processIntro:
      "The first useful action is to build a profile detailed enough for a possible introduction.",
    steps: [
      {
        title: "Sign in securely by email",
        body: "Use your email address to start. The service is for adults aged 40 and over living in the United Kingdom.",
      },
      {
        title: "Complete your dating profile",
        body: "Add the answers and photographs that help another person understand who you are and what you hope to build.",
      },
      {
        title: "Keep control of the next step",
        body: "If an introduction is prepared, you choose whether to express interest, leave it for later or decline it.",
      },
    ],
    note: {
      title: "When the free period ends",
      body: `Founding membership stays free until ${OPENING_OFFER_ENDS_LABEL}. The planned member price is ${MEMBER_PRICE_LABEL} from ${MEMBER_BILLING_STARTS_LABEL}, when matching technology is live. No payment is taken before then.`,
    },
    faqs: [
      {
        q: "Will I be charged when I create a profile?",
        a: "No. Billing is not switched on, no card is taken and creating a founding profile does not trigger a payment.",
      },
      {
        q: "Is every founding member guaranteed a matchmaker introduction?",
        a: "No. A profile can be considered, but an introduction depends on a suitable person being available and is never guaranteed.",
      },
      {
        q: "Is there a maximum age?",
        a: "No. The minimum age is 40 and there is no maximum age.",
      },
    ],
    related: [
      { href: "/free-christian-dating", label: "Free Christian dating" },
      { href: "/pricing", label: "What membership costs later" },
      { href: "/christian-matchmaker", label: "How the matchmaker works" },
    ],
    sourceFile: "app/free-christian-matchmaker/page.tsx",
  },
  {
    path: "/personal-matchmaker",
    primaryQuery: "personal christian matchmaker",
    searchIntent: "Find a personal matchmaker who understands Christian faith",
    title: "Personal Christian matchmaker for adults over 40",
    description: `A personal Christian matchmaker considers the faith, life and priorities in your complete profile. Founding membership is free until ${OPENING_OFFER_ENDS_LABEL}.`,
    h1: "A personal Christian matchmaker who can read beyond a label",
    eyebrow: "Personal Christian matchmaking",
    intro:
      "Two people can choose the same denomination and live their faith very differently. A personal approach starts with the detail: what church means to you, the commitments already in your week and the kind of shared spiritual life you hope a relationship could hold.",
    image: {
      src: "/images/home/connect-david.jpg",
      alt: "A man in his fifties smiling in soft evening light",
      position: "object-[center_20%]",
    },
    focus: {
      heading: "Personal does not mean intrusive",
      body:
        "You choose what to write and which relationship questions are firm boundaries. The profile gives the matchmaker a structured account of your circumstances without pretending every private detail belongs in an introduction. Religious information is supplied with separate consent.",
    },
    benefits: [
      {
        title: "Your own account of faith",
        body: "Describe belief and church life in natural language rather than asking a denomination field to carry the whole story.",
      },
      {
        title: "Your season of life",
        body: "The profile can make room for adult children, caring, retirement, bereavement, divorce or a first serious relationship later in life.",
      },
      {
        title: "Your practical world",
        body: "Choose a travel distance and explain the ordinary routines that a lasting relationship would need to fit alongside.",
      },
    ],
    processHeading: "What a matchmaker can learn from your profile",
    processIntro:
      "Good personal service depends on useful information, clearly volunteered and carefully organised.",
    steps: [
      {
        title: "The shape of your week",
        body: "Work, worship, family, rest and interests reveal more about possible companionship than a list of favourite things alone.",
      },
      {
        title: "The relationship you want",
        body: "State whether you hope for marriage or committed companionship and identify the questions on which alignment matters most.",
      },
      {
        title: "The person in the particulars",
        body: "Written answers help a matchmaker notice tone, warmth and compatible ways of living that fixed fields cannot fully express.",
      },
    ],
    note: {
      title: "Personal service, realistic expectations",
      body: `The founding matchmaker may prepare an introduction from complete profiles until ${OPENING_OFFER_ENDS_LABEL}. It is included free, but it cannot guarantee timing, availability or a relationship.`,
    },
    faqs: [
      {
        q: "Can I explain my faith in my own words?",
        a: "Yes. The profile includes space to describe what faith means to you as well as structured questions about church and tradition.",
      },
      {
        q: "Will a matchmaker override my Essentials?",
        a: "No. Essentials are the firm boundaries you set and are not treated as optional preferences.",
      },
      {
        q: "Is personal matchmaking available across the UK?",
        a: "The founding cohort is UK-wide. You choose a travel distance from 10 to 200 miles when completing your profile.",
      },
    ],
    related: [
      { href: "/christian-matchmaker", label: "Christian matchmaker UK" },
      { href: "/christian-dating/after-bereavement", label: "Dating after bereavement" },
      { href: "/christian-dating/after-divorce", label: "Dating after divorce" },
    ],
    sourceFile: "app/personal-matchmaker/page.tsx",
  },
  {
    path: "/christian-dating-agency",
    primaryQuery: "christian dating agency uk",
    searchIntent: "Compare a Christian dating agency with a dating app",
    title: "Christian dating agency for UK adults over 40",
    description: `A UK Christian dating agency alternative for adults over 40: complete profiles, clear priorities and considered introductions. Join free until ${OPENING_OFFER_ENDS_LABEL}.`,
    h1: "A Christian dating agency for a more considered first step",
    eyebrow: "Christian dating agency UK",
    intro:
      "People often use 'dating agency' when they want more support than a quick profile browse provides. Mature Christian Dating combines a detailed profile with reasoned introductions, while keeping the final decisions with the two people involved.",
    image: {
      src: "/images/home/city-laugh.jpg",
      alt: "A mature couple laughing together on a city walk",
      position: "object-[center_28%]",
    },
    focus: {
      heading: "Agency help without handing over your choices",
      body:
        "The service organises the information that makes an introduction useful: faith, intentions, family situation, preferences and geography. You decide what is Essential, and you decide whether a suggested person receives your interest. Support sits around your judgement rather than replacing it.",
    },
    benefits: [
      {
        title: "Designed for life after 40",
        body: "Everyone starts at age 40 or above, with no maximum age. The questions reflect established lives rather than treating later dating as an afterthought.",
      },
      {
        title: "Christian, without assuming sameness",
        body: "Members can name a tradition and explain the role faith actually plays, including what they hope to share with a partner.",
      },
      {
        title: "Introductions you can understand",
        body: "The proposed service shows why an introduction may make sense, then lets each person respond without pressure.",
      },
    ],
    processHeading: "Dating service or introduction agency?",
    processIntro:
      "Mature Christian Dating borrows the useful parts of both: a profile you own and a more guided route to meeting someone.",
    steps: [
      {
        title: "You create the source material",
        body: "Your answers, photographs and choices form the profile. You are not reduced to notes written about you by somebody else.",
      },
      {
        title: "The service prepares context",
        body: "Your stated boundaries and points of possible compatibility shape the reason attached to an introduction.",
      },
      {
        title: "Mutual interest opens the door",
        body: "Both people retain the right to say yes, later or no. A private conversation follows only when the interest is shared.",
      },
    ],
    note: {
      title: "The opening-stage model",
      body: `Before ${OPENING_OFFER_ENDS_LABEL}, a human matchmaker may prepare introductions for complete founding profiles. Matching technology opens on that date. Joining is free now and no payment card is taken.`,
    },
    faqs: [
      {
        q: "Is this a traditional offline dating agency?",
        a: "No. It is an online Christian dating service with structured profiles and introductions. A human matchmaker is included temporarily during the founding stage.",
      },
      {
        q: "Can I search through every member?",
        a: "The planned experience is centred on considered introductions and mutual interest rather than an unrestricted public directory.",
      },
      {
        q: "Can I create a profile today?",
        a: `Yes. UK adults aged 40 and over can create a founding profile free before ${OPENING_OFFER_ENDS_LABEL}.`,
      },
    ],
    related: [
      { href: "/christian-introduction-service", label: "Christian introduction service" },
      { href: "/christian-matchmaking", label: "Christian matchmaking" },
      { href: "/christian-dating", label: "Christian dating in the UK" },
    ],
    sourceFile: "app/christian-dating-agency/page.tsx",
  },
];

const serviceByPath = new Map(servicePages.map((page) => [page.path, page]));

export function servicePageForPath(path: string): ServicePageRecord | undefined {
  return serviceByPath.get(path);
}
