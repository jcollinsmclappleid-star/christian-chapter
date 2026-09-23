import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hopeSummary, profileEncouragement, type ProfileCardInput } from "./profile-card.ts";

function card(partial: Partial<ProfileCardInput> = {}): ProfileCardInput {
  return {
    storyPrompt1: "",
    photoDataUrl: "",
    interests: [],
    maritalSituation: "",
    childrenSituation: "",
    partnerHopes: [],
    relationshipGoal: "",
    tradition: "",
    churchAttendance: "",
    ukRegion: "",
    age: null,
    gender: "",
    seekingGender: [],
    ...partial,
  };
}

describe("profile card copy", () => {
  it("names each new fact with a different sentence", () => {
    const empty = profileEncouragement(card());
    const who = profileEncouragement(card({ gender: "Woman", seekingGender: ["Men"] }));
    const age = profileEncouragement(card({ gender: "Woman", seekingGender: ["Men"], age: 54 }));
    const place = profileEncouragement(card({ gender: "Woman", seekingGender: ["Men"], age: 54, ukRegion: "Greater London" }));
    const faith = profileEncouragement(card({
      gender: "Woman",
      seekingGender: ["Men"],
      age: 54,
      ukRegion: "Greater London",
      tradition: "Baptist",
      churchAttendance: "Most weeks",
    }));
    const week = profileEncouragement(card({
      gender: "Woman",
      seekingGender: ["Men"],
      age: 54,
      ukRegion: "Greater London",
      tradition: "Baptist",
      churchAttendance: "Most weeks",
      interests: ["Cooking", "Astronomy"],
    }));
    const line = profileEncouragement(card({ storyPrompt1: "Tuesday night ballroom." }));
    const sentences = [empty, who, age, place, faith, week, line];
    assert.equal(new Set(sentences).size, sentences.length);
    assert.equal(place, "Greater London is on your profile.");
    assert.equal(faith, "Baptist, most weeks. Faith is in the room.");
    assert.equal(week, "Cooking and astronomy. This is starting to sound like a week someone could join.");
    assert.equal(line, "That line already sounds like you.");
    assert.doesNotMatch(sentences.join(" "), /!|journey|swipe/i);
  });

  it("starts the hope line blank and then fills it", () => {
    assert.equal(hopeSummary(card()), "Someone you have not described yet.");
    assert.equal(
      hopeSummary(card({
        seekingGender: ["Women"],
        relationshipGoal: "A committed relationship",
        partnerHopes: ["who laughs easily"],
      })),
      "Women. A committed relationship. Someone who laughs easily.",
    );
  });
});
