import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { POLICY_VERSION, footerLegalLine, siteConfig } from "./site-config.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

describe("GATE-C legal and honesty copy", () => {
  it("publishes versioned privacy, terms and cookies pages", () => {
    for (const file of ["app/privacy/page.tsx", "app/terms/page.tsx", "app/cookies/page.tsx"]) {
      const src = read(file);
      assert.match(src, /POLICY_VERSION/);
      assert.match(src, /POLICY_EFFECTIVE_DATE/);
    }
    assert.match(POLICY_VERSION, /^\d{4}-\d{2}-\d{2}$/);
  });

  it("lists only storage the site actually uses and does not add a banner", () => {
    const cookies = read("app/cookies/page.tsx");
    assert.match(cookies, /cc_member/);
    assert.match(cookies, /cc_admin/);
    assert.match(cookies, /cc_wizard_v1/);
    assert.match(cookies, /no cookie banner/);
    assert.doesNotMatch(read("app/layout.tsx"), /cookie banner|CookieBanner/);
  });

  it("does not invent Ltd or VAT in the default footer", () => {
    assert.equal(siteConfig.legalEntityName, "");
    assert.doesNotMatch(footerLegalLine(2026), /Ltd|VAT/);
    assert.match(footerLegalLine(2026), /Founding cohort/);
  });

  it("keeps SEO guide routes unique", () => {
    assert.match(read("app/christian-dating/remarriage/page.tsx"), /open to remarriage/);
    assert.match(read("app/guides/safety/romance-fraud/page.tsx"), /Action Fraud/);
    assert.match(
      read("app/guides/christian-relationships/dating-across-denominations/page.tsx"),
      /denominations/,
    );
  });

  it("does not restore the homepage decorative overlay", () => {
    const home = read("app/page.tsx");
    assert.doesNotMatch(home, /repeating-linear/);
    assert.doesNotMatch(home, /bg-gradient-to-/);
    assert.match(home, /\/register/);
    assert.match(home, /Mature Christian dating/);
    assert.doesNotMatch(home, /Christian Chapter/);
    assert.match(home, /Create your free profile/);
    assert.match(home, /faith/);
    assert.doesNotMatch(home, /IntroductionDemo|ChapterHouse/);
  });
});
