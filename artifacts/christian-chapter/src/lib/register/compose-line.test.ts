import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { composeProfileLine } from "./compose-line.ts";

describe("compose profile line", () => {
  it("writes a short line from the answers already given", () => {
    const line = composeProfileLine({
      age: 54,
      region: "Greater London",
      tradition: "Baptist",
      churchAttendance: "Most weeks",
      interests: ["Cooking", "Live music", "Astronomy"],
      partnerHopes: ["who laughs easily"],
      hobbyNote: "I still dance when the song is right",
    });
    assert.match(line, /I'm 54, in Greater London/);
    assert.match(line, /Baptist, most weeks/);
    assert.match(line, /cooking, live music, and astronomy/);
    assert.match(line, /dance when the song is right/);
    assert.match(line, /someone who laughs easily/);
  });

  it("still offers a line when little has been chosen", () => {
    assert.match(composeProfileLine({
      age: null,
      region: "",
      tradition: "",
      churchAttendance: "",
      interests: [],
      partnerHopes: [],
      hobbyNote: "",
    }), /room for someone new/);
  });
});