import { describe, expect, it } from "vitest";
import { TYPE_SIZES, typeSizeTokens } from "./type-size.ts";
import { DENSITY_LEVELS } from "./density.ts";

describe("type size (docs/research/ui-size-scale-2026-10-12.md)", () => {
  const px = (value: string) => Number(value.match(/(\d+)\)?$/)![1]);

  it("keeps 14 at today's default roles", () => {
    const t = typeSizeTokens(14);
    expect([t["text-xs-size"], t["text-sm-size"], t["text-md-size"], t["title-xs-size"]]).toEqual([
      "var(--area-size-12)", "var(--area-size-14)", "var(--area-size-16)", "var(--area-size-16)",
    ]);
    expect(t["type-box"]).toBe("16px");
    expect(t["weight-icon"]).toBe("1.125px");
  });

  it("sets small text two under the base, never under 10, and titles at the reading size", () => {
    for (const base of TYPE_SIZES) {
      const t = typeSizeTokens(base);
      expect(px(t["text-xs-size"]!)).toBe(Math.max(10, base - 2));
      expect(px(t["text-md-size"]!)).toBe(base + 2);
      expect(t["title-xs-size"]).toBe(t["text-md-size"]);
    }
  });

  it("bounds density: 28 (Compact) up to 14, 36 (Comfortable) from 13", () => {
    const allowed = (base: (typeof TYPE_SIZES)[number], level: number) => {
      const t = typeSizeTokens(base);
      return level >= Number(t["type-level-min"]) && level <= Number(t["type-level-max"]);
    };
    expect(TYPE_SIZES.filter(base => allowed(base, DENSITY_LEVELS["28"]))).toEqual([12, 13, 14]);
    expect(TYPE_SIZES.filter(base => allowed(base, DENSITY_LEVELS["36"]))).toEqual([13, 14, 15, 16]);
    expect(TYPE_SIZES.every(base => allowed(base, DENSITY_LEVELS["32"]))).toBe(true);
  });
});
