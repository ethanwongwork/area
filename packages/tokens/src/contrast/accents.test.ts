/**
 * The gate for any accent colour (axes/color.ts hues, axes/accent.ts Accent strength and Solid; 2026-10-23).
 *
 * contrast.test.ts measures every pairing on the shipped named accents one test at a time. This file measures every
 * pairing that reads an accent token on every other accent the settings can make: the palette's eleven and the 72 hues,
 * at every strength, in both modes and on every neutral, and the solid pairings at every Solid step and Label tint
 * position (accent-gate.ts). About a million
 * measurements, so they are collected rather than reported one test each; a failure lists the worst cases.
 */
import { describe, expect, it } from "vitest";
import { ASSERTIONS } from "./assertions.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { CHROMATIC_SCALES, NEUTRAL_SCALES } from "../color/presets.ts";
import { ACCENT_HUES, ACCENT_STRENGTHS } from "../color/generate.ts";
import { resolveTheme } from "../semantic/resolve.ts";
import { ACCENTED, SOLID, accentProblems } from "./accent-gate.ts";

const ACCENTS = [...CHROMATIC_SCALES.map(s => s.id), ...ACCENT_HUES.map(String)];

describe("contrast gate: every accent the settings can make", () => {
  it("measures the accent's pairings", () => {
    expect(ACCENTED.length).toBeGreaterThan(20);
    expect(SOLID.length).toBeGreaterThan(2);
  });
  for (const theme of ["light", "dark"] as const) it(`${theme}: every hue, strength, Solid step and Label tint position`, () => {
    expect(accentProblems(theme, ACCENTS).slice(0, 20)).toEqual([]);
  }, 120_000);
  // Status colours Match (axes/accent.ts): the status tones quieted to every Accent strength, every pairing, every neutral.
  for (const theme of ["light", "dark"] as const) it(`${theme}: status colours at every strength`, () => {
    const problems: string[] = [];
    for (const neutral of NEUTRAL_SCALES) for (const accentStrength of ACCENT_STRENGTHS) {
      const t = resolveTheme({ theme, neutral: neutral.id, accent: "blue", accentStrength, statusColours: "match" }).tokens;
      for (const a of ASSERTIONS) {
        const fg = t[a.fg]!, bg = t[a.bg]!, wcag = wcagContrastHex(fg, bg), apca = theme === "dark" ? apcaMagnitude(fg, bg) : Infinity;
        if (wcag < a.wcag || apca < a.apca) problems.push(`${neutral.id}/${accentStrength}: ${a.fg} on ${a.bg} ${wcag.toFixed(2)}:1${theme === "dark" ? ` Lc ${apca.toFixed(0)}` : ""}`);
      }
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });
});
