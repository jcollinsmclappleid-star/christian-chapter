/** Copy for the live profile card. Kept free of app imports so tests can load it. */

export type ProfileCardInput = {
  storyPrompt1: string;
  photoDataUrl: string;
  interests: string[];
  maritalSituation: string;
  childrenSituation: string;
  partnerHopes: string[];
  relationshipGoal: string;
  tradition: string;
  churchAttendance: string;
  ukRegion: string;
  age: number | null;
  gender: string;
  seekingGender: string[];
};

function namedList(items: string[]): string {
  const words = items.map((item, index) => (index === 0 ? item : item.toLowerCase()));
  if (words.length <= 1) return words[0] ?? "";
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  return `${words.slice(0, -1).join(", ")}, and ${words[words.length - 1]}`;
}

/** Names the newest fact. Each step should read as a different sentence. */
export function profileEncouragement(data: ProfileCardInput): string {
  if (data.storyPrompt1.trim()) return "That line already sounds like you.";
  if (data.photoDataUrl) return "A face is on your profile.";
  if (data.interests.length) {
    return `${namedList(data.interests.slice(0, 3))}. This is starting to sound like a week someone could join.`;
  }
  if (data.maritalSituation || data.childrenSituation) {
    const household = [data.maritalSituation, data.childrenSituation].filter(Boolean).join(". ");
    return `${household}. A future partner can see the household.`;
  }
  if (data.partnerHopes[0]) return `Someone ${data.partnerHopes[0]}. That hope is on your profile.`;
  if (data.relationshipGoal) return `${data.relationshipGoal}. The kind of meeting is clearer.`;
  if (data.tradition) {
    const rhythm = data.churchAttendance ? `, ${data.churchAttendance.toLowerCase()}` : "";
    return `${data.tradition}${rhythm}. Faith is in the room.`;
  }
  if (data.ukRegion) return `${data.ukRegion} is on your profile.`;
  if (data.age) return `${data.age} is welcome here. Forty and over is the room.`;
  if (data.gender || data.seekingGender.length) {
    const seeking = data.seekingGender[0];
    const who = seeking === "Open to both" ? "women or men" : seeking?.toLowerCase();
    if (data.gender && who) return `${data.gender}, hoping to meet ${who}. That is the first thing a future partner is allowed to know.`;
    if (data.gender) return `${data.gender}. That is the first thing a future partner is allowed to know.`;
  }
  return "Your profile will take shape as you go.";
}

export function hopeSummary(data: Pick<ProfileCardInput, "seekingGender" | "relationshipGoal" | "partnerHopes">): string {
  const parts: string[] = [];
  const seeking = data.seekingGender[0];
  if (seeking === "Open to both") parts.push("Women or men");
  else if (seeking) parts.push(seeking);
  if (data.relationshipGoal) parts.push(data.relationshipGoal);
  for (const hope of data.partnerHopes.slice(0, 2)) parts.push(`Someone ${hope}`);
  if (!parts.length) return "Someone you have not described yet.";
  return `${parts.join(". ")}.`;
}
