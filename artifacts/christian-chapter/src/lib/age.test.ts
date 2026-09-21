import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ageOnDate, isAtLeastAge, parseIsoDate } from "./age.ts";

describe("parseIsoDate", () => {
  it("accepts a real civil date", () => {
    assert.deepEqual(parseIsoDate("1986-09-20"), { year: 1986, month: 9, day: 20 });
  });

  it("rejects impossible dates", () => {
    assert.equal(parseIsoDate("2026-02-31"), null);
    assert.equal(parseIsoDate("20-09-1986"), null);
  });
});

describe("40th birthday (GATE-B)", () => {
  const noonUtc = (iso: string) => new Date(`${iso}T12:00:00.000Z`);

  it("is 40 on the 40th birthday in Europe/London", () => {
    assert.equal(isAtLeastAge("1986-09-20", 40, noonUtc("2026-09-20")), true);
  });

  it("is 39 the day before the 40th birthday", () => {
    assert.equal(isAtLeastAge("1986-09-21", 40, noonUtc("2026-09-20")), false);
  });

  it("has no maximum age", () => {
    assert.equal(isAtLeastAge("1940-01-01", 40, noonUtc("2026-09-20")), true);
  });

  it("counts a 29 Feb birthday as 40 on 28 Feb in a non-leap year, and 41 on 1 March", () => {
    assert.equal(
      ageOnDate(
        { year: 1984, month: 2, day: 29 },
        { year: 2025, month: 2, day: 28 },
      ),
      40,
    );
    assert.equal(
      ageOnDate(
        { year: 1984, month: 2, day: 29 },
        { year: 2025, month: 3, day: 1 },
      ),
      41,
    );
  });
});
