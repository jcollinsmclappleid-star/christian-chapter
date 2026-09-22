/** A short profile line composed from answers already given. */

function list(items: string[]) {
  if (items.length === 1) return items[0].toLowerCase();
  if (items.length === 2) return `${items[0].toLowerCase()} and ${items[1].toLowerCase()}`;
  return `${items.slice(0, -1).map((item) => item.toLowerCase()).join(", ")}, and ${items[items.length - 1].toLowerCase()}`;
}

export function composeProfileLine(input: {
  age: number | null;
  region: string;
  tradition: string;
  churchAttendance: string;
  interests: string[];
  partnerHopes: string[];
  hobbyNote: string;
}): string {
  const bits: string[] = [];
  if (input.age && input.region) bits.push(`I'm ${input.age}, in ${input.region}.`);
  else if (input.region) bits.push(`I'm in ${input.region}.`);
  else if (input.age) bits.push(`I'm ${input.age}.`);

  if (input.tradition) {
    const rhythm = input.churchAttendance ? `, ${input.churchAttendance.toLowerCase()}` : "";
    bits.push(`My faith is ${input.tradition}${rhythm}.`);
  }

  const loves = input.interests.slice(0, 3);
  if (loves.length) bits.push(`I like ${list(loves)}.`);

  const note = input.hobbyNote.trim().replace(/\.+$/, "");
  if (note) bits.push(`${note}.`);

  if (input.partnerHopes[0]) bits.push(`I'm hoping for someone ${input.partnerHopes[0]}.`);

  return bits.join(" ") || "A life already underway, with room for someone new.";
}
