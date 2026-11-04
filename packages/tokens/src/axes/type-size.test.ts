import { describe, expect, it } from "vitest";
import { TYPE_SIZES, typeSizeTokens } from "./type-size.ts";
import { DENSITY_LEVELS } from "./density.ts";

describe("type size (docs/research/ui-size-scale-2026-10-12.md)", () => {
  const px = (value: string) => Number(value.match(/(\d+)\)?$/)![1]);

  it("is Cursor's ramp at 13 with Claude's reading step: 11/14, 12/16, 13/18, 15/22, titles 16 / 18 / 20 / 26 (owner, 2026-11-02)", () => {
    const t = typeSizeTokens(13);
    const pair = (role: string) => `${px(t[`${role}-size`]!)}/${px(t[`${role}-leading`]!)}`;
    expect(["text-xs", "text-sm", "text-base", "text-lg"].map(pair)).toEqual(["11/14", "12/16", "13/18", "15/22"]);
    expect(["title-xs", "title-sm", "title-md", "title-lg"].map(pair)).toEqual(["16/22", "18/24", "20/28", "26/30"]);
    expect(t["type-box"]).toBe("14px");
  });

  it("steps the body roles with the base: small two under, secondary one under, reading two over", () => {
    for (const base of TYPE_SIZES) {
      const t = typeSizeTokens(base);
      expect(px(t["text-xs-size"]!)).toBe(Math.max(10, base - 2));
      expect(px(t["text-sm-size"]!)).toBe(base - 1);
      expect(px(t["text-base-size"]!)).toBe(base);
      expect(px(t["text-lg-size"]!)).toBe(base + 2);
    }
  });

  it("opens prose to 1.5 lines on the leading ramp, paragraphs two-thirds of a line apart (2026-10-30)", () => {
    const pair = (base: (typeof TYPE_SIZES)[number], role: "base" | "lg") => {
      const t = typeSizeTokens(base);
      return `${px(t[`text-${role}-size`]!)}/${px(t[`text-${role}-prose-leading`]!)} ${px(t[`text-${role}-prose-gap`]!)}`;
    };
    expect(TYPE_SIZES.map(base => pair(base, "base"))).toEqual(["12/18 12", "13/20 12", "14/22 16", "15/24 16", "16/24 16"]);
    // Reading text keeps its one line, Claude's 15/22 at 13 (owner, 2026-11-02), running or not.
    expect(TYPE_SIZES.map(base => pair(base, "lg"))).toEqual(["14/20 12", "15/22 16", "16/24 16", "17/26 16", "18/28 20"]);
    for (const base of TYPE_SIZES) {
      const t = typeSizeTokens(base);
      expect(t["text-lg-leading"]).toBe(t["text-lg-prose-leading"]);
      // UI text's prose line is never tighter than WCAG 1.4.8's 1.5; reading text's never under 1.4 (Claude's).
      expect(px(t["text-base-prose-leading"]!) / px(t["text-base-size"]!)).toBeGreaterThanOrEqual(1.5);
      expect(px(t["text-lg-prose-leading"]!) / px(t["text-lg-size"]!)).toBeGreaterThanOrEqual(1.4);
    }
  });

  it("puts icons in the 20 slot from 15, its line on the size curve (owner, 2026-10-29)", () => {
    expect(TYPE_SIZES.map(base => typeSizeTokens(base)["type-icon"])).toEqual(["16px", "16px", "16px", "20px", "20px"]);
    expect(TYPE_SIZES.map(base => typeSizeTokens(base)["type-icon-line"])).toEqual(["1", "1", "1", "0.8846", "0.8846"]);
    // The line a default-size icon draws in the slot, in px: 1.33 at 15 and 1.42 at 16, the curve's (20 / 16)^0.45.
    const drawn = (base: (typeof TYPE_SIZES)[number]) => {
      const t = typeSizeTokens(base);
      return Number.parseFloat(t["weight-icon"]!) * Number(t["type-icon-line"]) * Number.parseFloat(t["type-icon"]!) / 16;
    };
    expect(drawn(15)).toBeCloseTo(1.33, 2);
    expect(drawn(16)).toBeCloseTo(1.42, 2);
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
