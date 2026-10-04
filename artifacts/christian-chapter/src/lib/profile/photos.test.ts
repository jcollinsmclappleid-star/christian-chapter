import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { photoIsPublic } from "./photos.ts";

describe("photograph visibility", () => {
  it("shows a verified photograph to other members", () => {
    assert.equal(photoIsPublic("clear"), true);
  });

  it("keeps a waiting or declined photograph off other members", () => {
    assert.equal(photoIsPublic("pending"), false);
    assert.equal(photoIsPublic("rejected"), false);
    assert.equal(photoIsPublic("held"), false);
  });

  it("stores every new upload as waiting, including on an approved profile", () => {
    const upload = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "../../app/api/profile/photos/route.ts"),
      "utf8",
    );
    const view = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "../../app/api/profile/photos/[id]/route.ts"),
      "utf8",
    );
    assert.match(upload, /moderationStatus: "pending"/);
    assert.doesNotMatch(upload, /profile\.status/);
    assert.match(view, /moderationStatus !== "clear"/);
  });
});
