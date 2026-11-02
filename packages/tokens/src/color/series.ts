/**
 * Series colours: eight colours for data, from OpenAI's palette (colour system study, proposals 2, 4 and 7; owner picked
 * Build, 2026-11-01: "i dont like cursors colors, i like openais colors form the references i sent";
 * docs/research/color-system-2026-11-01).
 *
 * OpenAI's luminous colours are Area's own gamut edge at one lightness: `colourAt(h, L 0.79, share 1, C ≤ 0.13)` lands
 * the sampled sky, lilac and peach within ΔE_OK 0.009. Each series is one hue sampled from the owner's references, and
 * five colours on it:
 *
 *   mark   lines, dots, keys and a fill's edge. Light: the lightest colour on the hue that clears 3:1 on every light
 *          ground (L 0.63–0.68). Dark: the luminous colour itself, ≥ 9:1 on the near-black page.
 *   fill   bars, areas, heat cells. Light: the luminous colour (about 2:1 on white, so a fill keeps its mark edge or a
 *          direct label, WCAG 1.4.11). Dark: a deep area under a luminous line, L 0.40 at 70% of the room, C ≤ 0.09.
 *   ink    a number inside a fill: the lightest (light) or darkest (dark) colour on the hue at 4.6:1 on the fill.
 *   ramp   seven steps for sequential data (heat, calendars), walking the hue at full share, never mixed toward white,
 *          so teal, lime, yellow and green keep their colour in the middle (proposal 4). Light runs from L 0.95 to 0.58,
 *          a step past the mark; dark from L 0.27 to the luminous colour. Each step is at least 0.06 lighter than the next
 *          (the dataviz validator's ordinal gap). A diverging ramp is two series' ramps meeting at the ground.
 *   p3     the luminous colour with Display P3's wider room, for `@media (color-gamut: p3)` (proposal 7). sRGB is the
 *          gated base; P3 is gated on its own luminance (series.test.ts).
 *
 * Series lightness (axes/series.ts) moves the luminous colour, and with it the light fill and its ink, the dark mark and
 * the dark ramp's end. Series never follow Accent strength: a data colour is an identity, and the CVD separation the
 * gate holds would fail at a dusty strength. They never mean status (danger, warning): status keeps its own tones.
 */
import { colourAt, colourAtP3, firstClearing, p3Luminance, placeRgb } from "./place.ts";
import { toHex } from "./oklab.ts";

/** The eight hues, in the order the dataviz validator picked (neighbour CVD and normal-vision ΔE, both modes). */
export const SERIES: ReadonlyArray<{ name: string; hue: number }> = [
  { name: "sky", hue: 239 }, { name: "pink", hue: 346 }, { name: "yellow-green", hue: 104 }, { name: "lilac", hue: 309 },
  { name: "peach orange", hue: 47 }, { name: "mint", hue: 171 }, { name: "periwinkle", hue: 276 }, { name: "peach", hue: 16 },
];

/**
 * Series lightness: the luminous colour's OKLab lightness × 100, every whole number the gate passes. From 81 the dark
 * marks crowd (neighbour CVD ΔE 7.7 under 8, sky's chroma under 0.10); under 66 a light fill passes 3:1 and reads as a
 * mark, not a fill.
 */
export const SERIES_LIGHTNESSES: readonly number[] = Array.from({ length: 15 }, (_, i) => 66 + i);
/** OpenAI's: the single lightness that best fits nine luminous samples from the references (prototype.ts). */
export const DEFAULT_SERIES_LIGHTNESS = 79;
/** The luminous colour's chroma cap: above it light hues with a wide room (yellow, green) glow past the references. */
export const SERIES_CAP = 0.13;
/** The dark area fill under a luminous line: L 0.40, or deeper where the line would not clear 3:1 over it. */
export const SERIES_DARK_AREA = { L: 0.40, share: 0.7, cap: 0.09 } as const;
/** Steps in a ramp. */
export const RAMP_STEPS = 7;
/** Where a ramp starts, one step off the ground, and where light's ends (dark's ends on the luminous colour). */
export const RAMP_START = { light: 0.95, dark: 0.27 } as const;
export const RAMP_END_LIGHT = 0.58;

/**
 * The grounds a light mark must clear 3:1 on: the page and the darkest light ground any shipped theme paints text or
 * marks on (a tinted neutral's control hover). series.test.ts holds every shipped ground at least this light.
 */
export const SERIES_GROUNDS_LIGHT: readonly string[] = ["#ffffff", "#f4f6f8"];
/** The ratio the solver aims for, a margin over the gate's 3:1 and 4.5:1 for rounding to hex. */
const MARK_AIM = 3.05, INK_AIM = 4.6;

export interface SeriesColours {
  light: { mark: string; fill: string; ink: string; ramp: string[] };
  dark: { mark: string; fill: string; ink: string; ramp: string[] };
  /** The luminous colour on a P3 screen: light's fill and dark's mark. */
  p3: { css: string; rgb: [number, number, number] };
}

const cache = new Map<string, SeriesColours>();

/** One series' colours at a Series lightness (× 100). */
export function seriesColours(hue: number, lightness = DEFAULT_SERIES_LIGHTNESS): SeriesColours {
  const key = `${hue}/${lightness}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const L = lightness / 100;
  const luminous = colourAt(hue, L, 1, SERIES_CAP);
  const mark = firstClearing(hue, 1, SERIES_GROUNDS_LIGHT, MARK_AIM, 0.8, 0.4);
  const area = firstClearing(hue, SERIES_DARK_AREA.share, [luminous], MARK_AIM, SERIES_DARK_AREA.L, 0.2, SERIES_DARK_AREA.cap);
  const p3 = colourAtP3(hue, L, 1, SERIES_CAP) as SeriesColours["p3"], p3Y = p3Luminance(p3.rgb);
  const ramp = (from: number, to: number, cap: number) =>
    Array.from({ length: RAMP_STEPS }, (_, i) => toHex(placeRgb(hue, from + (to - from) * i / (RAMP_STEPS - 1), 1, cap)));
  const out: SeriesColours = {
    light: { mark, fill: luminous, ink: firstClearing(hue, 1, [luminous, p3Y], INK_AIM, 0.6, 0.2), ramp: ramp(RAMP_START.light, RAMP_END_LIGHT, Infinity) },
    dark: { mark: luminous, fill: area, ink: firstClearing(hue, 0.5, [area], INK_AIM, 0.8, 0.98), ramp: ramp(RAMP_START.dark, L, SERIES_CAP) },
    p3,
  };
  // Dark's ramp ends on the luminous colour, exactly.
  out.dark.ramp[RAMP_STEPS - 1] = luminous;
  cache.set(key, out);
  return out;
}
