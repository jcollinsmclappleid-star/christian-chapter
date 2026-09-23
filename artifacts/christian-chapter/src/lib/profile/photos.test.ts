import { describe, it } from "node:test";
import assert from "node:assert/strict";
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
});
