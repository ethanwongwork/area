import { describe, expect, it } from "vitest";
import { DEFAULT_REGULAR_WEIGHT, REGULAR_WEIGHTS, REGULAR_WEIGHT_AXIS } from "./regular-weight.ts";
import { TYPE_SIZES, typeSizeTokens } from "./type-size.ts";
import { GEIST_TOKENS } from "./typography.ts";

describe("Regular weight (plan A9.6, owner 2026-11-13)", () => {
  it("defaults to 400 and writes exactly what the type axis wrote before", () => {
    expect(DEFAULT_REGULAR_WEIGHT).toBe(400);
    const preset = REGULAR_WEIGHT_AXIS.presets.find(p => p.id === REGULAR_WEIGHT_AXIS.defaultPreset)!;
    expect(preset.tokens).toEqual({ "--area-weight-regular": "var(--area-wght-400)" });
  });

  it("offers 400 to 470 in steps of 10, always under strong (500)", () => {
    expect([...REGULAR_WEIGHTS]).toEqual([400, 410, 420, 430, 440, 450, 460, 470]);
    expect(Math.max(...REGULAR_WEIGHTS)).toBeLessThanOrEqual(500 - 30);
    expect(GEIST_TOKENS["weight-strong"]).toBe("var(--area-wght-500)");
  });

  it("writes the regular role only: strong, heading, the icon line and type size stay with the type axis", () => {
    for (const preset of REGULAR_WEIGHT_AXIS.presets) expect(Object.keys(preset.tokens)).toEqual(["--area-weight-regular"]);
    for (const base of TYPE_SIZES) {
      const t = typeSizeTokens(base);
      expect(t["weight-regular"], `type ${base}`).toBeUndefined();
      expect(t["weight-strong"]).toBe("var(--area-wght-500)");
      expect(t["weight-heading"]).toBe("var(--area-wght-600)");
    }
  });

  it("is the same in light and dark (dark weight compensation is not this setting)", () => {
    for (const preset of REGULAR_WEIGHT_AXIS.presets) expect(preset.darkTokens).toBeUndefined();
  });
});
