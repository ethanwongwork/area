/**
 * The placement function (place.ts): the palette's rungs are named points on it, and it places colours between them.
 */
import { describe, expect, it } from "vitest";
import PALETTE from "./palette.json" with { type: "json" };
import { colourAt, colourAtP3, p3Luminance, roomAt, shareOf } from "./place.ts";
import { DISPLAY_P3, SRGB, labToLch, parseHex, rgbToOklab } from "./oklab.ts";
import type { PaletteRung } from "./generate.ts";

const FAMILIES = PALETTE.families as unknown as Record<string, Record<string, PaletteRung>>;
const lab = (hex: string) => rgbToOklab(parseHex(hex), SRGB);
const de = (a: string, b: string) => { const x = lab(a), y = lab(b); return Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b); };

describe("colourAt", () => {
  it("returns every chromatic rung at its own lightness, hue and share", () => {
    let worst = 0;
    for (const family of Object.values(FAMILIES)) for (const rung of Object.values(family)) {
      const { L, h } = labToLch(lab(rung.hex));
      if (labToLch(lab(rung.hex)).C < 0.02) continue;
      worst = Math.max(worst, de(colourAt(h, L, shareOf(rung.hex)), rung.hex));
    }
    // Within one 8-bit step of the hex: the share is read back from the rounded colour.
    expect(worst).toBeLessThan(0.006);
  });
  it("places colours between rungs, where no rung is", () => {
    const blue = FAMILIES.blue!;
    const between = colourAt(blue["200"]!.oklch.H, (blue["200"]!.oklch.L + blue["300"]!.oklch.L) / 2, 1);
    expect(de(between, blue["200"]!.hex)).toBeGreaterThan(0.01);
    expect(de(between, blue["300"]!.hex)).toBeGreaterThan(0.01);
  });
  it("caps chroma and keeps the share below the room", () => {
    const capped = labToLch(lab(colourAt(104, 0.79, 1, 0.13)));
    expect(capped.C).toBeLessThanOrEqual(0.1305);
    expect(labToLch(lab(colourAt(239, 0.6, 0.5))).C).toBeCloseTo(0.5 * roomAt(0.6, 239), 2);
  });
  it("widens into Display P3 by P3's own room, at the same luminance band", () => {
    for (const h of [16, 104, 171, 239, 346]) {
      const { rgb } = colourAtP3(h, 0.79, 1, 0.13);
      const p3 = labToLch(rgbToOklab(rgb, DISPLAY_P3));
      expect(p3.C).toBeGreaterThanOrEqual(labToLch(lab(colourAt(h, 0.79, 1, 0.13))).C - 1e-3);
      expect(Math.abs(p3.L - 0.79)).toBeLessThan(0.01);
      expect(p3Luminance(rgb)).toBeGreaterThan(0.4);
    }
  });
});
