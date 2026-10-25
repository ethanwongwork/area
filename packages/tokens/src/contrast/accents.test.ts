/**
 * The gate for any accent colour (axes/color.ts hues, axes/accent.ts Accent strength and Solid; 2026-10-23).
 *
 * contrast.test.ts measures every pairing on the shipped named accents one test at a time. This file measures every
 * pairing that reads an accent token on every other accent the settings can make: the palette's eleven and the 72 hues,
 * at every strength, in both modes and on every neutral, and the solid pairings at every Solid step and Label tint. About a million
 * measurements, so they are collected rather than reported one test each; a failure lists the worst cases.
 */
import { describe, expect, it } from "vitest";
import { ASSERTIONS } from "./assertions.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { CHROMATIC_SCALES, NEUTRAL_SCALES } from "../color/presets.ts";
import { ACCENT_HUES, ACCENT_STRENGTHS, LABEL_TINT_STEPS, SOLID_STEPS, mixOklab } from "../color/generate.ts";
import { resolveTheme } from "../semantic/resolve.ts";

const ACCENTS = [...CHROMATIC_SCALES.map(s => s.id), ...ACCENT_HUES.map(String)];
/** The pairings whose colours an accent setting can move: either side reads an accent token or a role built on one. */
const reference = resolveTheme({ theme: "light", neutral: "neutral", accent: "blue" }).tokens;
const other = resolveTheme({ theme: "light", neutral: "neutral", accent: "teal", accentStrength: 50 }).tokens;
const ACCENTED = ASSERTIONS.filter(a => reference[a.fg] !== other[a.fg] || reference[a.bg] !== other[a.bg]);
const SOLID = ACCENTED.filter(a => /accent-solid/.test(`${a.fg} ${a.bg}`));

describe("contrast gate: every accent the settings can make", () => {
  it("measures the accent's pairings", () => {
    expect(ACCENTED.length).toBeGreaterThan(20);
    expect(SOLID.length).toBeGreaterThan(2);
  });
  for (const theme of ["light", "dark"] as const) it(`${theme}: every hue, strength and Solid step`, () => {
    const problems: string[] = [];
    for (const neutral of NEUTRAL_SCALES) for (const accent of ACCENTS) for (const accentStrength of ACCENT_STRENGTHS) {
      for (const pick of ["auto", ...SOLID_STEPS] as const) for (const labelTint of LABEL_TINT_STEPS) {
        if ((pick !== "auto" || labelTint !== 0) && neutral.id !== "neutral") continue;
        const t = resolveTheme({ theme, neutral: neutral.id, accent, accentStrength, solid: { light: pick, dark: pick }, labelTint }).tokens;
        for (const a of pick === "auto" && labelTint === 0 ? ACCENTED : SOLID) {
          // A label on the solid's hover is on its press too: the hover 10% toward black (button.css), 2026-10-23. WCAG
          // only there: a black label on a pressed orange or yellow in dark reads Lc 58 at every Label tint, the press
          // darkening toward the label; whether a press under a black label should lighten instead is the owner's call.
          for (const [bg, state] of [[t[a.bg]!, ""], ...(/accent-solid-hover/.test(a.bg) && /on-accent/.test(a.fg) ? [[mixOklab(t[a.bg]!, "#000000", 0.1), " pressed"]] : [])] as Array<[string, string]>) {
            const fg = t[a.fg]!, wcag = wcagContrastHex(fg, bg), apca = theme === "dark" && !state ? apcaMagnitude(fg, bg) : Infinity;
            if (wcag < a.wcag || apca < a.apca) problems.push(`${neutral.id}/${accent}/${accentStrength}/${pick}/label ${labelTint}: ${a.fg} on ${a.bg}${state} ${wcag.toFixed(2)}:1${theme === "dark" ? ` Lc ${apca.toFixed(0)}` : ""}`);
          }
        }
      }
    }
    expect(problems.slice(0, 20)).toEqual([]);
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
