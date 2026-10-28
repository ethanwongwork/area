/**
 * Exact colours (owner, 2026-10-27; plan https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2): a page colour picked as one
 * exact OKLCH colour per mode, solved into the numbers the Layers model already reads, so the page paints the pick and
 * every other grey derives from it as from a preset.
 *
 *   ground-light / ground-dark      the pick's lightness, any value 0.90 to 1.00 (light) or 0 to 0.24 (dark), to four decimals
 *   tint-hue / tint-hue-dark        the pick's hue, Auto, Accent and Same as light off
 *   tint-room-white / -black (-dark) the hue's room (tintRoom), as a hue preset writes it
 *   tint-chroma-light / -dark       the tint strength that paints the pick's chroma, Auto off
 *
 * The cast fades out toward white (light, above L 0.976) and black (dark, under L 0.18), so the strength is the pick's
 * chroma over that fade: CAST_FADE inverted. A light page's colour can reach no more chroma than Tint 100 (0.08) faded, nor
 * past its hue's room; a pick past either is held at the most that shows (`reachableChroma`), the way a strong tint is held
 * at its room today. White and black take no tint at all, so there a pick is grey.
 *
 * The solve is exact for the page. It is not one to one: where the room or the fade binds, many strengths paint the same
 * page, and the solve takes the least, so the darker greys lean as little as the pick allows. A preset that sits past
 * that (a white page with Tint 50, a tint past its hue's room) has no pick that reproduces it; `presetPick` says so.
 *
 * Every grey derives live in CSS from these numbers (color/layers.ts), so this file is all a product loads to pick a
 * page: the tests check the CSS and the model agree, and every pick through every check (colours.test.ts).
 */
import { type Rgb, SRGB, labToLch, oklchToRgb, parseHex, rgbToOklab, toHex, clampRgb } from "./oklab.ts";
import { DEFAULT_GROUND_DARK, DEFAULT_GROUND_LIGHT, TINT_STEP, castChroma, castFade, groundLightness, tintChromaAt, tintRoom } from "./layers.ts";

export type Mode = "light" | "dark";
/** An OKLCH colour: lightness 0 to 1, chroma, hue in degrees. */
export interface Oklch { l: number; c: number; h: number }
/** A colour as the exact colour step takes it: `oklch(L C h)` (L as a number or a percentage), a hex, or numbers. */
export type ColourInput = string | Oklch;
export interface PageColours { light?: ColourInput; dark?: ColourInput }

/** The lightness each mode's page can take (the Layers model's range, any value inside it). */
export const PAGE_RANGE: Readonly<Record<Mode, readonly [number, number]>> = { light: [0.9, 1], dark: [0, 0.24] };
/** Tint 100: the strongest the grays lean, OKLCH chroma 0.08. */
export const TINT_MAX = TINT_STEP * 16;
/** Decimals a pick keeps: lightness to four (a screen shows no finer step), chroma to six (four moved a preset's page by
 * one level of a channel), hue to a tenth of a degree. */
const round = (x: number, places: number) => Number(x.toFixed(places));
const hue360 = (h: number) => ((h % 360) + 360) % 360;

/** The most chroma a page of lightness `L` and hue `h` can show: Tint 100 faded toward white or black, inside the room. */
export function reachableChroma(theme: Mode, L: number, h: number): number {
  return castChroma(theme, L, { hue: hue360(h), chroma: TINT_MAX });
}

/** What a page pick writes: the model's numbers, and the colour the page paints (the pick held inside what can show). */
export interface PageSolve {
  /** The page's lightness: ground-light or ground-dark. */
  lightness: number;
  /** Tint hue, in degrees. */
  hue: number;
  /** Tint strength as OKLCH chroma: tint-chroma-light or -dark. */
  strength: number;
  /** The hue's room under sRGB (tintRoom). */
  room: { white: number; black: number };
  /** The page colour these paint: the pick, or the nearest reachable colour to it. */
  painted: Oklch;
}

/** A page pick solved into the model's numbers (see the file's head). */
export function solvePage(theme: Mode, pick: Oklch): PageSolve {
  const [lo, hi] = PAGE_RANGE[theme];
  const L = round(Math.min(hi, Math.max(lo, pick.l)), 4), h = round(hue360(pick.h), 1);
  // The reach rounded down, so a pick held at it still paints exactly what it says.
  const C = Math.min(round(Math.max(0, pick.c), 6), Math.floor(reachableChroma(theme, L, h) * 1e6) / 1e6);
  const fade = castFade(theme, L);
  const strength = C === 0 || fade === 0 ? 0 : Math.min(TINT_MAX, C / fade);
  const painted = castChroma(theme, L, { hue: h, chroma: strength });
  return { lightness: L, hue: h, strength: Number(strength.toFixed(6)), room: tintRoom(h), painted: { l: L, c: round(painted, 6), h } };
}

/** The tokens a page pick writes, short names (no `--area-`). */
export function pageInputs(theme: Mode, solve: PageSolve): Record<string, string> {
  const n = (x: number) => String(x);
  return theme === "light" ? {
    "ground-light": n(solve.lightness),
    "tint-hue-auto": "0", "tint-hue-accent": "0", "tint-hue": n(solve.hue),
    "tint-room-white": n(solve.room.white), "tint-room-black": n(solve.room.black),
    "tint-light-auto": "0", "tint-chroma-light": n(solve.strength),
  } : {
    "ground-dark": n(solve.lightness),
    "tint-hue-dark-same": "0", "tint-hue-dark-auto": "0", "tint-hue-dark-accent": "0", "tint-hue-dark": n(solve.hue),
    "tint-room-white-dark": n(solve.room.white), "tint-room-black-dark": n(solve.room.black),
    "tint-dark-auto": "0", "tint-chroma-dark": n(solve.strength),
  };
}

/** Every token a page pick can write: the attributes that restate the derivations reading them (emit/css.ts). */
export const PAGE_INPUTS: readonly string[] = [
  ...Object.keys(pageInputs("light", solvePage("light", { l: 1, c: 0, h: 0 }))),
  ...Object.keys(pageInputs("dark", solvePage("dark", { l: 0, c: 0, h: 0 }))),
];

/** A colour as numbers: `oklch(L C h)` with L a number or a percentage and h a number or degrees, or a hex. */
export function parseColour(input: ColourInput): Oklch {
  if (typeof input !== "string") return { l: input.l, c: input.c, h: input.h };
  const text = input.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(text);
  if (hex) {
    const full = hex[1]!.length === 3 ? `#${[...hex[1]!].map(c => c + c).join("")}` : text;
    const { L, C, h } = labToLch(rgbToOklab(parseHex(full), SRGB));
    return { l: L, c: C, h };
  }
  const oklch = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/.exec(text);
  if (oklch) return { l: Number(oklch[1]) / (oklch[2] ? 100 : 1), c: Number(oklch[3]), h: Number(oklch[4]) };
  throw new Error(`A colour must be oklch(L C h) or a hex (#rgb or #rrggbb), not "${input}".`);
}
export const isColour = (value: string): boolean => { try { parseColour(value); return true; } catch { return false; } };

/** A pick as CSS text, as the app saves it: `oklch(0.9634 0.012 255)`. */
export const formatOklch = ({ l, c, h }: Oklch) => `oklch(${round(l, 4)} ${round(c, 6)} ${round(h, 1)})`;
/** The hex a pick paints, for a swatch. */
export const oklchHex = ({ l, c, h }: Oklch) => toHex(clampRgb(oklchToRgb({ L: l, C: c, h }, SRGB) as Rgb));

/** The declarations a page writes, `--area-` names, for the modes given. */
export function pageDeclarations(page: PageColours): Record<string, string> {
  const out: Record<string, string> = {};
  for (const theme of ["light", "dark"] as const) {
    const given = page[theme];
    if (given === undefined) continue;
    for (const [name, value] of Object.entries(pageInputs(theme, solvePage(theme, parseColour(given))))) out[`--area-${name}`] = value;
  }
  return out;
}

/**
 * The pick a page preset paints, for saved settings that convert once (apps/desktop restoreCanvas): the page colour a
 * ground step and a tint draw, or null where no pick reproduces the preset exactly (a tint the page itself doesn't show,
 * on white or past the hue's room, still tints the darker greys and the text), so the preset stays as it is.
 */
export function presetPick(theme: Mode, groundStep: number, tint: { hue: number; position: number } | null): Oklch | null {
  const L = groundLightness(theme, groundStep);
  if (!tint || tint.position === 0) return { l: L, c: 0, h: 0 };
  const strength = tintChromaAt(tint.position), c = castChroma(theme, L, { hue: tint.hue, chroma: strength });
  const pick = { l: L, c: round(c, 6), h: tint.hue }, solved = solvePage(theme, pick);
  // Within the 0.0004 of chroma a position may round by (layers.ts POSITIONS); a room- or fade-bound tint is far past it.
  return Math.abs(solved.strength - strength) < 4e-4 ? pick : null;
}

/** The default pages as picks: white and Area's near-black. */
export const DEFAULT_PAGE: Readonly<Record<Mode, Oklch>> = {
  light: { l: groundLightness("light", DEFAULT_GROUND_LIGHT), c: 0, h: 0 },
  dark: { l: groundLightness("dark", DEFAULT_GROUND_DARK), c: 0, h: 0 },
};
