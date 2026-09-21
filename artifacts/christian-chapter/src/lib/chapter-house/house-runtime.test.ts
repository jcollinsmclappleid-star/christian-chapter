import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_DISCLOSURE, demoIntroduction } from "./demo-fixture.ts";
import { HOUSE_DESTINATIONS, HOUSE_MODES, type HouseMode, type HouseView } from "../../components/chapter-house/houseContent.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

function isHouseMode(value: string | null): value is HouseMode {
  return Boolean(value && (HOUSE_MODES as string[]).includes(value));
}

const VIEWS = new Set<NonNullable<HouseView>>(["dossier", "preview", "essentials", "privacy", "plans"]);

function readHouseUrl(search: string) {
  const params = new URLSearchParams(search);
  const rawMode = params.get("house");
  const rawView = params.get("view");
  return {
    mode: isHouseMode(rawMode) ? rawMode : "welcome",
    view: rawView && VIEWS.has(rawView as NonNullable<HouseView>) ? rawView : null,
  };
}

function houseUrlFromState(state: { mode: HouseMode; view: HouseView }, href = "http://localhost/") {
  const url = new URL(href);
  if (state.mode === "welcome") url.searchParams.delete("house");
  else url.searchParams.set("house", state.mode);
  if (state.view) url.searchParams.set("view", state.view);
  else url.searchParams.delete("view");
  return `${url.pathname}${url.search}`;
}

describe("Chapter House runtime", () => {
  it("treats the URL as the place and never serializes faith or email", () => {
    const url = houseUrlFromState({ mode: "table", view: "dossier" }, "https://christianchapter.co.uk/");
    assert.equal(url, "/?house=table&view=dossier");
    assert.doesNotMatch(url, /Helen|Anglican|email|faith/i);
    assert.equal(readHouseUrl("?house=library&email=a@b.c&tradition=Anglican").mode, "library");
    assert.equal(readHouseUrl("?house=welcome").mode, "welcome");
    assert.equal(houseUrlFromState({ mode: "welcome", view: null }, "https://christianchapter.co.uk/?house=table"), "/");
    const urlSource = read("components/chapter-house/useHouseUrlState.ts");
    assert.match(urlSource, /searchParams\.set\("house"/);
    assert.doesNotMatch(urlSource, /tradition|email|faithDescription/);
  });

  it("pauses the world when a product surface is open", () => {
    const state = read("components/chapter-house/houseState.ts");
    assert.match(state, /function worldShouldPause/);
    assert.match(state, /surfaceOpen: true/);
    assert.match(state, /surfaceOpen: false/);
    assert.match(read("components/chapter-house/ChapterHouseExperience.tsx"), /worldShouldPause/);
  });

  it("labels the synthetic table dossier and omits percentage scores", () => {
    assert.equal(DEMO_DISCLOSURE, "Demonstration profile — not a real member");
    assert.doesNotMatch(JSON.stringify(demoIntroduction), /%/);
    assert.match(read("components/chapter-house/TableSurface.tsx"), /DEMO_DISCLOSURE/);
    assert.match(read("lib/chapter-house/demo-fixture.ts"), /not a real member/);
    assert.match(read("components/chapter-house/TableSurface.tsx"), /Begin your chapter/);
    assert.match(read("components/chapter-house/TableSurface.tsx"), /\/register/);
  });

  it("keeps named house roots and honest destination copy", () => {
    const roots = HOUSE_DESTINATIONS.map((item) => item.modelRoot);
    assert.deepEqual(roots, ["Table", "Library", "Path", "Garden", "Courtyard", "Membership"]);
    const canvas = read("components/chapter-house/ChapterHouseCanvas.tsx");
    assert.match(canvas, /HOUSE_MODEL_ROOTS/);
    assert.match(canvas, /chapter-house\.glb/);
    assert.match(canvas, /HouseFurnishings/);
    assert.match(read("components/chapter-house/houseFurnishings.tsx"), /furnishings\/table\.glb/);
    assert.match(read("components/chapter-house/houseFurnishings.tsx"), /furnishings\/books-encyclopedia\.glb/);
    assert.doesNotMatch(read("components/chapter-house/houseFurnishings.tsx"), /sofa\.glb/);
    assert.doesNotMatch(canvas, /learning-commons/);
    assert.match(read("components/chapter-house/houseContent.ts"), /Threshold/);
    assert.match(read("app/page.tsx"), /Begin your chapter/);
    assert.match(read("app/page.tsx"), /A more thoughtful way for Christians to meet/);
    const glb = readFileSync(path.join(root, "../public/models/chapter-house.glb"));
    const jsonLength = glb.readUInt32LE(12);
    const json = glb.subarray(20, 20 + jsonLength).toString("utf8");
    for (const name of ["Threshold", "Table", "Library", "Path", "Garden", "Courtyard", "Membership"]) {
      assert.match(json, new RegExp(`"${name}"`));
    }
  });
});
