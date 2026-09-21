import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SubmitSchema } from "./submit-schema.ts";
import { isAtLeastAge } from "./age.ts";
import { MINIMUM_AGE } from "./site-config.ts";

const here = path.dirname(fileURLToPath(import.meta.url));

const valid = {
  eligibilityAcknowledged: true as const,
  firstName: "Jane",
  email: "jane@example.com",
  marketingConsent: false,
  dateOfBirth: "1980-01-15",
  gender: "Woman",
  seekingGender: ["Men"],
  ukRegion: "South East",
  travelRadiusMiles: 40,
  religiousDataConsent: true as const,
  religiousDataConsentTimestamp: "2026-09-20T10:00:00.000Z",
  religiousDataConsentVersion: "2026-09-20",
  tradition: "Anglican",
  churchAttendance: "Weekly",
  faithCentrality: "Central",
  interests: [] as string[],
  openToRemarriage: null,
  ageRangeMin: 40,
  ageRangeMax: 70,
  preferredDistanceMiles: 50,
  essentials: [],
  priorities: [],
  photoConsent: false,
  termsAccepted: true as const,
};

describe("GATE-A submit consents", () => {
  it("accepts a complete payload with required consents", () => {
    assert.equal(SubmitSchema.safeParse(valid).success, true);
  });

  it("rejects missing terms acceptance", () => {
    const { termsAccepted: _, ...rest } = valid;
    assert.equal(SubmitSchema.safeParse(rest).success, false);
  });

  it("rejects missing religious-data consent", () => {
    const { religiousDataConsent: _, ...rest } = valid;
    assert.equal(
      SubmitSchema.safeParse({ ...rest, religiousDataConsent: false }).success,
      false,
    );
  });

  it("rejects missing eligibility acknowledgement", () => {
    assert.equal(
      SubmitSchema.safeParse({ ...valid, eligibilityAcknowledged: false }).success,
      false,
    );
  });

  it("still requires the server age gate even if the body parses", () => {
    assert.equal(
      isAtLeastAge("2010-01-01", MINIMUM_AGE, new Date("2026-09-20T12:00:00Z")),
      false,
    );
  });

  it("writes application and consents in one transaction", () => {
    const src = readFileSync(
      path.join(here, "../app/api/register/submit/route.ts"),
      "utf8",
    );
    assert.match(src, /db\.transaction/);
    assert.match(src, /consentRecords/);
    assert.match(src, /consentType: "terms"/);
    assert.match(src, /consentType: "religious_data"/);
  });
});
