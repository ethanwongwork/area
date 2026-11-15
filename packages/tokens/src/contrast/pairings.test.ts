/**
 * The published pairing table (docs/CONTRAST_PAIRINGS.md) is what the contrast suite computes today, and every row it
 * marks Asserted clears its assertion's ratio at the defaults, so the table never shows the gate's own pairs failing.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ASSERTIONS } from "./assertions.ts";
import { PAIRINGS_FILE, pairings, pairingsMarkdown } from "./pairings.ts";

describe("contrast pairings table", () => {
  it("is current (run `node packages/tokens/src/contrast/pairings.ts --write`)", () => {
    expect(readFileSync(PAIRINGS_FILE, "utf8")).toBe(pairingsMarkdown());
  });

  it("agrees with the gate on every asserted pair", () => {
    const required = new Map(ASSERTIONS.map((a) => [`${a.fg}|${a.bg}`, a.wcag]));
    for (const row of pairings().filter((entry) => entry.asserted)) {
      const floor = required.get(`${row.ink}|${row.ground}`)!;
      for (const value of [row.light, row.dark]) if (value !== undefined) expect(value, `${row.ink} on ${row.ground}`).toBeGreaterThanOrEqual(floor);
    }
  });

  it("measures both modes for the neutral inks", () => {
    const rows = pairings().filter((row) => row.ink === "fg-default");
    expect(rows.length).toBe(6);
    for (const row of rows) { expect(row.light).toBeGreaterThan(4.5); expect(row.dark).toBeGreaterThan(4.5); }
  });
});
