export const SYNTHETIC_DOMAIN = "synthetic.christianchapter.invalid";
export const SYNTHETIC_MEMBER_COUNT = 120;

export type SeedSpec = {
  slug: string;
  firstName: string;
  decade: "40s" | "50s" | "60s" | "70s";
  nation: "England" | "Scotland" | "Wales" | "Northern Ireland";
  region: string;
  tradition: string;
  history: "never_married" | "divorced" | "widowed";
  family: "dependent_children" | "adult_children" | "grandchildren" | "no_children";
  work: "working" | "semi_retired" | "retired";
  plan: "free" | "member" | "plus";
  activity: "active_now" | "active_recently" | "reactivation" | "taking_a_break" | "inactive";
  travel: number;
  gender: "Man" | "Woman";
};

const FIRST = ["Helen", "Callum", "Rhiannon", "Patrick", "Amira", "Joan", "David", "Mary", "Ibrahim", "Siobhan", "Owen", "Priya"];
const DECADES: SeedSpec["decade"][] = ["40s", "50s", "60s", "70s"];
const PLACES: Array<Pick<SeedSpec, "nation" | "region">> = [
  { nation: "England", region: "South East England" },
  { nation: "England", region: "Greater London" },
  { nation: "England", region: "North West England" },
  { nation: "Scotland", region: "Scotland" },
  { nation: "Wales", region: "Wales" },
  { nation: "Northern Ireland", region: "Northern Ireland" },
];
const TRADITIONS = ["Anglican / Church of England", "Presbyterian", "Methodist", "Catholic", "Baptist", "Non-denominational"];
const HISTORY: SeedSpec["history"][] = ["never_married", "divorced", "widowed"];
const FAMILY: SeedSpec["family"][] = ["dependent_children", "adult_children", "grandchildren", "no_children"];
const WORK: SeedSpec["work"][] = ["working", "semi_retired", "retired"];
const PLAN: SeedSpec["plan"][] = ["free", "member", "plus"];
const ACTIVITY: SeedSpec["activity"][] = ["active_now", "active_recently", "reactivation", "taking_a_break", "inactive"];

export function buildSyntheticSpecs(count = SYNTHETIC_MEMBER_COUNT): SeedSpec[] {
  return Array.from({ length: count }, (_, i) => {
    const place = PLACES[i % PLACES.length];
    const firstName = FIRST[i % FIRST.length];
    const gender: SeedSpec["gender"] = i % 5 === 0 || i % 5 === 1 ? "Man" : "Woman";
    return {
      slug: `syn-${String(i + 1).padStart(3, "0")}-${DECADES[i % DECADES.length]}-${place.nation.slice(0, 2).toLowerCase()}`,
      firstName,
      decade: DECADES[i % DECADES.length],
      ...place,
      tradition: TRADITIONS[i % TRADITIONS.length],
      history: HISTORY[i % HISTORY.length],
      family: FAMILY[i % FAMILY.length],
      work: WORK[i % WORK.length],
      plan: PLAN[i % PLAN.length],
      activity: ACTIVITY[i % ACTIVITY.length],
      travel: [25, 40, 60, 80, 120][i % 5],
      gender,
    };
  });
}
