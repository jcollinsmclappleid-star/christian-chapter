import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { openMessage, sealMessage } from "./seal.ts";

describe("message seal", () => {
  it("stores a message so the database value is not the plain text", () => {
    process.env.SESSION_SECRET = "test-session-secret-must-be-32-characters";
    const stored = sealMessage("Meet after church");
    assert.equal(stored.startsWith("enc:v1:"), true);
    assert.equal(stored.includes("Meet after church"), false);
    assert.equal(openMessage(stored), "Meet after church");
  });

  it("still reads a message saved before sealing", () => {
    assert.equal(openMessage("an older plain message"), "an older plain message");
  });
});
