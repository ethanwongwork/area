/**
 * Tone contrast (axes/tone-floor.ts, 2026-11-02): the gate follows the floor. Each status and label tone's words clear
 * the theme's own floor, never less, on every ground they are solved on, at every Status strength, in both modes; the
 * accent's ink and every neutral ink never move; on a gray light page the floor's darken keeps the floor, and the CSS
 * that ships computes it as the model does. The default floor, 4.5, is the AA gate everything else in contrast/ checks.
 */
import { describe, expect, it } from "vitest";
import { resolveTheme } from "../semantic/resolve.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { ACCENT_STRENGTHS } from "../color/generate.ts";
import {
  DEFAULT_TONE_FLOOR, FLOOR_ROLES, GROUND_LIGHT_STEPS, LAYER_STEPS, TONE_FLOORS, layerHex, layerLightness, layerLightnessCss,
  toneFloorApca, toneFloorDarken, toneFloorTarget, toneFloorY,
  groundLightness,
} from "../color/layers.ts";
import { mixOklab, resolveCss } from "../color/layer-checks.ts";
import { TONE_FLOOR_AXIS } from "../axes/tone-floor.ts";
import { DEFAULT_TONE_TINT, TONE_TINTS } from "../color/curves.ts";
import { SRGB, labToLch, parseHex, rgbToOklab } from "../color/oklab.ts";

const THEMES = ["light", "dark"] as const;
const groundsOf = (tokens: Record<string, string>, role: string) =>
  ["bg-page", "bg-surface", "bg-subtle", `${role}-surface`, `${role}-surface-hover`, `${role}-surface-active`].map(name => [name, tokens[name]!] as const);

describe("tone contrast: every floor is gated at itself, on every Tone tint", () => {
  for (const theme of THEMES) for (const floor of TONE_FLOORS) for (const toneTint of TONE_TINTS) it(`${theme} at ${floor}, tint ${toneTint}`, () => {
    const problems: string[] = [];
    for (const selection of [{}, ...ACCENT_STRENGTHS.map(accentStrength => ({ accentStrength, statusColours: "match" as const }))]) {
      const tokens = resolveTheme({ theme, neutral: "neutral", accent: "blue", toneFloor: floor, toneTint, ...selection }).tokens;
      for (const role of FLOOR_ROLES) {
        const ink = tokens[`fg-${role}`]!;
        for (const [name, ground] of groundsOf(tokens, role)) {
          const ratio = wcagContrastHex(ink, ground);
          if (ratio < floor) problems.push(`${role} ${ink} on ${name} ${ground}: ${ratio.toFixed(2)} (${JSON.stringify(selection)})`);
          if (theme === "dark" && apcaMagnitude(ink, ground) < toneFloorApca(floor)) problems.push(`${role} ${ink} on ${name}: APCA ${apcaMagnitude(ink, ground).toFixed(1)}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("lower floors never paint a tone darker or duller than a higher one", () => {
    for (const theme of THEMES) for (const role of FLOOR_ROLES) for (const toneTint of TONE_TINTS) {
      const ratios = TONE_FLOORS.map(floor => {
        const tokens = resolveTheme({ theme, neutral: "neutral", accent: "blue", toneFloor: floor, toneTint }).tokens;
        return wcagContrastHex(tokens[`fg-${role}`]!, tokens[`${role}-surface`]!);
      });
      for (let i = 1; i < ratios.length; i++) expect(ratios[i], `${theme} ${role} at ${TONE_FLOORS[i]}, tint ${toneTint}`).toBeLessThanOrEqual(ratios[i - 1]! + 1e-9);
    }
  });

  it("the accent's ink and tints and the neutral inks never move", () => {
    for (const theme of THEMES) {
      const at = (floor: number, toneTint: number) => resolveTheme({ theme, neutral: "neutral", accent: "blue", toneFloor: floor as (typeof TONE_FLOORS)[number], toneTint: toneTint as (typeof TONE_TINTS)[number] }).tokens;
      const base = at(DEFAULT_TONE_FLOOR, DEFAULT_TONE_TINT);
      for (const floor of TONE_FLOORS) for (const toneTint of TONE_TINTS) for (const name of ["fg-accent", "accent-surface", "accent-surface-active", "fg-gray", "fg-default", "fg-muted", "fg-accent-vivid", "fg-on-caution"])
        expect(at(floor, toneTint)[name], `${theme} ${name} at ${floor}, tint ${toneTint}`).toBe(base[name]);
    }
  });

  it("a richer tint carries more colour, and 0 is the neutral fill's lightness", () => {
    for (const theme of THEMES) for (const role of FLOOR_ROLES) {
      const chroma = TONE_TINTS.map(toneTint => labToLch(rgbToOklab(parseHex(resolveTheme({ theme, neutral: "neutral", accent: "blue", toneTint }).tokens[`${role}-surface`]!), SRGB)).C);
      for (let i = 1; i < chroma.length; i++) expect(chroma[i], `${theme} ${role} tint ${TONE_TINTS[i]}`).toBeGreaterThanOrEqual(chroma[i - 1]! - 0.002);
      expect(chroma[0], `${theme} ${role} tint 0`).toBeLessThan(0.004);
    }
  });

  it("4.5 is the default and the default's numbers are the tonal ink's", () => {
    expect(TONE_FLOOR_AXIS.defaultPreset).toBe(String(DEFAULT_TONE_FLOOR));
    const preset = TONE_FLOOR_AXIS.presets.find(p => p.id === TONE_FLOOR_AXIS.defaultPreset)!;
    expect(Number(preset.tokens["--area-tone-floor-target"])).toBeCloseTo(4.6, 6);
    expect(Number(preset.tokens["--area-tone-floor-y"])).toBeCloseTo(0.141, 6);
    for (const [name, value] of Object.entries(preset.tokens)) if (/tone-floor-\d+$/.test(name)) expect(value, name).toBe("0");
  });
});

describe("tone contrast: on a gray light page the floor holds", () => {
  it("every floor's inks keep the floor on every ground step and layer step, and white never darkens them", () => {
    const problems: string[] = [];
    for (const floor of TONE_FLOORS) for (const toneTint of TONE_TINTS) {
      const tokens = resolveTheme({ theme: "light", neutral: "neutral", accent: "blue", toneFloor: floor, toneTint }).tokens;
      const inks = FLOOR_ROLES.map(role => tokens[`fg-${role}`]!);
      for (const g of GROUND_LIGHT_STEPS) for (const n of LAYER_STEPS) {
        const m = layerLightness("light", g, n), deepest = Math.min(m.recessed, m.card, m.tile);
        const d = toneFloorDarken(deepest, floor), bg = layerHex("light", deepest, { chroma: 0, hue: 0 });
        if (g === 100 && d !== 0) problems.push(`${floor}: darkens on white`);
        for (const ink of inks) if (wcagContrastHex(mixOklab(ink, "black", d), bg) < floor) problems.push(`${floor} ${g}/${n}: ${ink} on ${bg}`);
      }
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it("the shipped CSS computes the model's darken, and raised Contrast returns the default's", () => {
    const css = layerLightnessCss();
    for (const floor of TONE_FLOORS) for (const more of [0, 0.5, 1]) for (const g of [100, 96, 92]) {
      const n = 4, m = layerLightness("light", g, n);
      const vars = resolveCss(css, {
        "cast-chroma-light": 0, "ground-light": groundLightness("light", g), "ground-dark": 0, "layers-light": n, "layers-dark": 8 - n,
        "fill-hover-step": 1, "fill-selected-step": 2, "card-tone-light-auto": 1, "card-tone-light": 0, "card-tone-dark-auto": 1, "card-tone-dark": 0,
        "tone-floor-target": toneFloorTarget(floor), "tone-floor-y": toneFloorY(floor), "contrast-more": more,
      });
      const expected = toneFloorDarken(Math.min(m.recessed, m.card, m.tile), more > 0 ? DEFAULT_TONE_FLOOR : floor);
      expect(vars["layer-light-floor-darken"], `${floor} more ${more} ground ${g}`).toBeCloseTo(expected, 6);
    }
  });
});
