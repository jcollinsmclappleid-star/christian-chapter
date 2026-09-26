/** UK places people search for Christian dating. Names are the place, not a claim about members. */

export const REGIONS = [
  { slug: "greater-london", name: "Greater London" },
  { slug: "south-east-england", name: "South East England" },
  { slug: "south-west-england", name: "South West England" },
  { slug: "east-of-england", name: "East of England" },
  { slug: "east-midlands", name: "East Midlands" },
  { slug: "west-midlands", name: "West Midlands" },
  { slug: "yorkshire-and-the-humber", name: "Yorkshire and the Humber" },
  { slug: "north-west-england", name: "North West England" },
  { slug: "north-east-england", name: "North East England" },
  { slug: "scotland", name: "Scotland" },
  { slug: "wales", name: "Wales" },
  { slug: "northern-ireland", name: "Northern Ireland" },
] as const;

export type RegionSlug = (typeof REGIONS)[number]["slug"];

export type PlaceKind = "city" | "town";

export type Place = {
  slug: string;
  name: string;
  kind: PlaceKind;
  region: RegionSlug;
};

type Row = [slug: string, name: string, kind: PlaceKind];

const ROWS: Record<RegionSlug, Row[]> = {
  "greater-london": [
    ["london", "London", "city"],
    ["croydon", "Croydon", "town"],
    ["kingston-upon-thames", "Kingston upon Thames", "town"],
    ["bromley", "Bromley", "town"],
    ["richmond", "Richmond", "town"],
    ["enfield", "Enfield", "town"],
    ["ealing", "Ealing", "town"],
    ["barnet", "Barnet", "town"],
    ["harrow", "Harrow", "town"],
  ],
  "south-east-england": [
    ["brighton", "Brighton", "city"],
    ["reading", "Reading", "city"],
    ["milton-keynes", "Milton Keynes", "city"],
    ["oxford", "Oxford", "city"],
    ["southampton", "Southampton", "city"],
    ["portsmouth", "Portsmouth", "city"],
    ["guildford", "Guildford", "town"],
    ["canterbury", "Canterbury", "city"],
    ["maidstone", "Maidstone", "town"],
    ["slough", "Slough", "town"],
    ["tunbridge-wells", "Tunbridge Wells", "town"],
    ["winchester", "Winchester", "city"],
    ["basingstoke", "Basingstoke", "town"],
    ["high-wycombe", "High Wycombe", "town"],
    ["crawley", "Crawley", "town"],
    ["horsham", "Horsham", "town"],
    ["chichester", "Chichester", "city"],
    ["eastbourne", "Eastbourne", "town"],
    ["hastings", "Hastings", "town"],
    ["worthing", "Worthing", "town"],
    ["windsor", "Windsor", "town"],
    ["woking", "Woking", "town"],
  ],
  "south-west-england": [
    ["bristol", "Bristol", "city"],
    ["bath", "Bath", "city"],
    ["bournemouth", "Bournemouth", "city"],
    ["plymouth", "Plymouth", "city"],
    ["exeter", "Exeter", "city"],
    ["gloucester", "Gloucester", "city"],
    ["swindon", "Swindon", "town"],
    ["cheltenham", "Cheltenham", "town"],
    ["taunton", "Taunton", "town"],
    ["truro", "Truro", "city"],
    ["salisbury", "Salisbury", "city"],
    ["torquay", "Torquay", "town"],
    ["poole", "Poole", "town"],
    ["yeovil", "Yeovil", "town"],
  ],
  "east-of-england": [
    ["cambridge", "Cambridge", "city"],
    ["norwich", "Norwich", "city"],
    ["ipswich", "Ipswich", "town"],
    ["peterborough", "Peterborough", "city"],
    ["luton", "Luton", "town"],
    ["southend", "Southend", "town"],
    ["colchester", "Colchester", "city"],
    ["chelmsford", "Chelmsford", "city"],
    ["bedford", "Bedford", "town"],
    ["stevenage", "Stevenage", "town"],
    ["watford", "Watford", "town"],
    ["st-albans", "St Albans", "city"],
    ["basildon", "Basildon", "town"],
    ["kings-lynn", "King's Lynn", "town"],
    ["bury-st-edmunds", "Bury St Edmunds", "town"],
  ],
  "east-midlands": [
    ["nottingham", "Nottingham", "city"],
    ["leicester", "Leicester", "city"],
    ["derby", "Derby", "city"],
    ["northampton", "Northampton", "town"],
    ["lincoln", "Lincoln", "city"],
    ["mansfield", "Mansfield", "town"],
    ["loughborough", "Loughborough", "town"],
    ["chesterfield", "Chesterfield", "town"],
    ["kettering", "Kettering", "town"],
    ["corby", "Corby", "town"],
    ["grantham", "Grantham", "town"],
  ],
  "west-midlands": [
    ["birmingham", "Birmingham", "city"],
    ["coventry", "Coventry", "city"],
    ["wolverhampton", "Wolverhampton", "city"],
    ["stoke-on-trent", "Stoke-on-Trent", "city"],
    ["worcester", "Worcester", "city"],
    ["solihull", "Solihull", "town"],
    ["dudley", "Dudley", "town"],
    ["walsall", "Walsall", "town"],
    ["rugby", "Rugby", "town"],
    ["shrewsbury", "Shrewsbury", "town"],
    ["hereford", "Hereford", "city"],
    ["stafford", "Stafford", "town"],
    ["tamworth", "Tamworth", "town"],
  ],
  "yorkshire-and-the-humber": [
    ["leeds", "Leeds", "city"],
    ["sheffield", "Sheffield", "city"],
    ["bradford", "Bradford", "city"],
    ["york", "York", "city"],
    ["hull", "Hull", "city"],
    ["doncaster", "Doncaster", "city"],
    ["huddersfield", "Huddersfield", "town"],
    ["wakefield", "Wakefield", "city"],
    ["harrogate", "Harrogate", "town"],
    ["barnsley", "Barnsley", "town"],
    ["rotherham", "Rotherham", "town"],
    ["scarborough", "Scarborough", "town"],
    ["grimsby", "Grimsby", "town"],
  ],
  "north-west-england": [
    ["manchester", "Manchester", "city"],
    ["liverpool", "Liverpool", "city"],
    ["preston", "Preston", "city"],
    ["blackpool", "Blackpool", "town"],
    ["chester", "Chester", "city"],
    ["warrington", "Warrington", "town"],
    ["bolton", "Bolton", "town"],
    ["stockport", "Stockport", "town"],
    ["oldham", "Oldham", "town"],
    ["wigan", "Wigan", "town"],
    ["blackburn", "Blackburn", "town"],
    ["lancaster", "Lancaster", "city"],
    ["carlisle", "Carlisle", "city"],
    ["southport", "Southport", "town"],
  ],
  "north-east-england": [
    ["newcastle", "Newcastle", "city"],
    ["sunderland", "Sunderland", "city"],
    ["middlesbrough", "Middlesbrough", "town"],
    ["durham", "Durham", "city"],
    ["gateshead", "Gateshead", "town"],
    ["darlington", "Darlington", "town"],
    ["hartlepool", "Hartlepool", "town"],
    ["stockton-on-tees", "Stockton-on-Tees", "town"],
    ["morpeth", "Morpeth", "town"],
  ],
  scotland: [
    ["glasgow", "Glasgow", "city"],
    ["edinburgh", "Edinburgh", "city"],
    ["aberdeen", "Aberdeen", "city"],
    ["dundee", "Dundee", "city"],
    ["inverness", "Inverness", "city"],
    ["stirling", "Stirling", "city"],
    ["perth", "Perth", "city"],
    ["paisley", "Paisley", "town"],
    ["dunfermline", "Dunfermline", "town"],
    ["falkirk", "Falkirk", "town"],
    ["ayr", "Ayr", "town"],
    ["dumfries", "Dumfries", "town"],
  ],
  wales: [
    ["cardiff", "Cardiff", "city"],
    ["swansea", "Swansea", "city"],
    ["newport", "Newport", "city"],
    ["wrexham", "Wrexham", "city"],
    ["bridgend", "Bridgend", "town"],
    ["neath", "Neath", "town"],
    ["llanelli", "Llanelli", "town"],
    ["carmarthen", "Carmarthen", "town"],
    ["bangor", "Bangor", "city"],
    ["aberystwyth", "Aberystwyth", "town"],
    ["caernarfon", "Caernarfon", "town"],
  ],
  "northern-ireland": [
    ["belfast", "Belfast", "city"],
    ["derry", "Derry", "city"],
    ["lisburn", "Lisburn", "city"],
    ["newry", "Newry", "city"],
    ["bangor-county-down", "Bangor, County Down", "town"],
    ["ballymena", "Ballymena", "town"],
    ["coleraine", "Coleraine", "town"],
    ["omagh", "Omagh", "town"],
    ["enniskillen", "Enniskillen", "town"],
    ["armagh", "Armagh", "city"],
    ["antrim", "Antrim", "town"],
  ],
};

export const PLACES: Place[] = REGIONS.flatMap((region) =>
  ROWS[region.slug].map(([slug, name, kind]) => ({ slug, name, kind, region: region.slug })),
);

const bySlug = new Map(PLACES.map((place) => [place.slug, place]));

export function regionBySlug(slug: string) {
  return REGIONS.find((region) => region.slug === slug);
}

export function placeBySlug(slug: string): Place | undefined {
  return bySlug.get(slug);
}

export function placesInRegion(slug: string): Place[] {
  return PLACES.filter((place) => place.region === slug);
}

/** Other places in the same region. Not a claim that they are the nearest by road. */
export function alsoInRegion(place: Place, count = 3): Place[] {
  const group = placesInRegion(place.region);
  const index = group.findIndex((item) => item.slug === place.slug);
  const picks: Place[] = [];
  for (let step = 1; picks.length < count && step < group.length; step += 1) {
    const next = group[(index + step) % group.length];
    if (next && next.slug !== place.slug) picks.push(next);
  }
  return picks;
}

/** Largest places, where age, Catholic, divorce, and free combinations are real searches. */
export const TOP_PLACE_SLUGS = [
  "london",
  "birmingham",
  "manchester",
  "leeds",
  "glasgow",
  "liverpool",
  "newcastle",
  "sheffield",
  "bristol",
  "edinburgh",
  "cardiff",
  "belfast",
  "leicester",
  "nottingham",
  "coventry",
  "brighton",
  "southampton",
  "oxford",
  "cambridge",
  "york",
] as const;

export function isTopPlace(slug: string): boolean {
  return (TOP_PLACE_SLUGS as readonly string[]).includes(slug);
}

export function placePath(place: Place): string {
  return `/christian-dating/in/${place.slug}`;
}

export function regionPath(slug: RegionSlug): string {
  return `/christian-dating/${slug}`;
}
