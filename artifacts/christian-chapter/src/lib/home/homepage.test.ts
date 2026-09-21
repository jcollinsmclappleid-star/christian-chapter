import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_DISCLOSURE, demoIntroduction } from "./demo-fixture.ts";
import { legacyHouseTarget } from "./legacy-house.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

describe("homepage conversion", () => {
  it("maps retired house links onto the written how-it-works section", () => {
    assert.equal(legacyHouseTarget("?house=table&view=dossier"), "#how-it-works");
    assert.equal(legacyHouseTarget("?house=library"), "#how-it-works");
    assert.equal(legacyHouseTarget("?house=welcome"), "");
    assert.equal(legacyHouseTarget("?houseTier=3d"), "");
    assert.equal(legacyHouseTarget(""), null);
    assert.doesNotMatch(legacyHouseTarget("?house=table&email=a@b.c") ?? "", /email|faith/i);
  });

  it("labels the demonstration and does not invent a match", () => {
    assert.equal(DEMO_DISCLOSURE, "Demonstration profile — not a real member");
    const fixture = JSON.stringify(demoIntroduction);
    assert.doesNotMatch(fixture, /%|miles|verified|online/i);
    assert.equal(demoIntroduction.poolLabel, "Nearby");
    const dossier = read("components/home/example-introduction.tsx");
    assert.match(dossier, /DEMO_DISCLOSURE/);
    assert.match(dossier, /poolLabel/);
    assert.match(dossier, /Exact miles are not published/);
    assert.doesNotMatch(dossier, /you matched|\/api\//i);
  });

  it("leads with the proposition and a real registration link", () => {
    const home = read("app/page.tsx");
    assert.match(home, /Christian dating for your next chapter/);
    assert.match(home, /Mature Christian dating/);
    assert.match(home, /Create your free profile/);
    assert.match(home, /href="\/register"/);
    assert.match(home, /href="\/sign-in"/);
    assert.match(home, /See how it works/);
    assert.doesNotMatch(home, /ChapterHouse|three|chapter-house|Begin your chapter is available/);
    assert.doesNotMatch(home, /IntroductionDemo/);
  });
});
