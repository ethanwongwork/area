/**
 * Series colours: eight colours for data. First from OpenAI's palette (colour system study, proposals 2, 4 and 7; owner
 * picked Build, 2026-11-01; docs/research/color-system-2026-11-01), then brightened with an indigo (data views round 15;
 * owner, 2026-11-02: "the blue, pink and purple are a bit too pastel like, maybe can you introduce indigo?"), then folded
 * into the palette (round 18; owner, 2026-11-02: "can you add the series colors to the palette ... i like the hue of the
 * series better but just want a more cohesive overall palette"; "Yes, build them").
 *
 * Each series is a step on a palette family: a named one where the series' hue sits within 8° of it (indigo, orange,
 * pink, red), else one of the data families built the palette's way at the series' hue (presets.ts DATA_SCALES: sky,
 * chartreuse, mint, violet). Every colour a series paints is a step of its family:
 *
 *   colour  the series itself (`-fill`, and the dark mark): bars, areas, keys, dots and heat's last dark step. The same
 *           in light and dark (owner, round 13: the deep dark fill read dull). On white most sit under 3:1, so a chart
 *           keeps its legend, values or a mark edge (WCAG 1.4.11); on every dark ground each clears 3:1.
 *   mark    lines and a fill's edge in light: the colour where it clears 3:1 on every light ground, else the first
 *           deeper step that does.
 *   area    a deep area under a bright line in dark: the first step at L 0.40 or under the colour clears 3:1 over; the
 *           colour itself in light.
 *   ink     a number inside the colour: the first deeper step that reads at 4.5:1, or where none does (indigo), the
 *           first lighter one, else white.
 *   ramp    seven steps for sequential data (heat, calendars): light from the family's palest step under L 0.96 down, dark
 *           from the colour down, each step at least 0.065 from the last, so the ramp is the family's own ladder. A
 *           diverging ramp is two series' ramps meeting at the ground.
 *   p3      the colour with Display P3's wider room, for `@media (color-gamut: p3)`.
 *
 * Series lightness (axes/series.ts) is sky's step: every series moves the same number of steps along its family, so the
 * set moves together. Series never follow Accent strength (a data colour is an identity) and never mean status: charts'
 * status colours are `DATA_STATUS` below.
 */
import { colourAtP3, hexLuminance, p3Luminance, ratioOf } from "./place.ts";
import { ALL_SCALES } from "./presets.ts";
import { buildScale } from "./scale.ts";

/**
 * The eight series in the order the dataviz validator picked, blue first, indigo where four-part charts show it
 * (neighbour CVD and normal-vision ΔE, both modes): each a step on its family at the default Series lightness.
 */
export const SERIES: ReadonlyArray<{ name: string; family: string; step: number }> = [
  { name: "blue", family: "sky", step: 350 }, { name: "pink", family: "pink", step: 300 },
  { name: "yellow-green", family: "chartreuse", step: 400 }, { name: "indigo", family: "indigo", step: 450 },
  { name: "orange", family: "orange", step: 350 }, { name: "mint", family: "mint", step: 400 },
  { name: "purple", family: "violet", step: 350 }, { name: "peach", family: "red", step: 250 },
];

/**
 * Series lightness: sky's step, every step the gate passes. A step lighter than 350 greys peach (red 200, chroma 0.09,
 * under the 0.10 floor); from 450 indigo falls under 3:1 on the dark grounds (2.85 on #1f1f1f) and its dark ramp runs
 * out of steps.
 */
export const SERIES_STEPS: readonly number[] = [350, 400];
/** Data views round 15's set, on the palette (owner, 2026-11-02). */
export const DEFAULT_SERIES_STEP = 350;
/** The darkest an area under a bright line starts. */
const AREA_L = 0.40;
/** Steps in a ramp, and the least lightness between two of them (a margin over the gate's 0.06). */
export const RAMP_STEPS = 7;
const RAMP_GAP = 0.065;
/** Where a light ramp starts: the family's palest step under this, one step off the ground. */
const RAMP_START_LIGHT = 0.96;

/**
 * The grounds a light mark must clear 3:1 on: the page and the darkest light ground any shipped theme paints text or
 * marks on (a tinted neutral's control hover). series.test.ts holds every shipped ground at least this light.
 * #f1f3f5 since 2026-11-11: light Layer contrast's default went to 50, which takes the Cool neutral's control hover
 * there (it was #f4f6f8 at Layer contrast 0).
 */
export const SERIES_GROUNDS_LIGHT: readonly string[] = ["#ffffff", "#f1f3f5"];
/** The ratio the picks aim for, a margin over the gate's 3:1 and 4.5:1. */
const MARK_AIM = 3.05, INK_AIM = 4.6;

/**
 * Charts' status colours (data views round 14; owner, 2026-11-02: "i like these new colors"): good, some trouble, failed,
 * for trackers, uptime and CI runs. The same in light and dark: green at hue 156 L 0.77, yellow lighter (hue 86 L 0.87)
 * so the two part for red-green colour blindness, red at the marks' 3:1 so a failure reads first. Area's success,
 * warning and danger roles (Badge, Alert, buttons) stay as they are: those carry text.
 */
// danger was #ff4a4b until 2026-11-11: two steps deeper in green and blue (no visible change) so it still clears 3:1 on
// the darkest light ground, #f1f3f5, now that light Layer contrast defaults to 50 (2.98 before, 3.01 now).
export const DATA_STATUS = { success: "#5dce8e", warning: "#ffcd53", danger: "#ff4849" } as const;

export interface SeriesColours {
  light: { mark: string; fill: string; area: string; ink: string; ramp: string[] };
  dark: { mark: string; fill: string; area: string; ink: string; ramp: string[] };
  /** The colour on a P3 screen: light's and dark's fill, dark's mark. */
  p3: { css: string; rgb: [number, number, number] };
  /** The family and step the colour is, for the docs and Foundations. */
  family: string;
  step: number;
}

interface Step { level: number; hex: string; L: number; C: number; H: number }
const families = new Map<string, Step[]>();
/** A family's steps as Area builds them (scale.ts), the hex every `--area-<family>-<step>` token carries. */
function stepsOf(id: string): Step[] {
  const hit = families.get(id);
  if (hit) return hit;
  const spec = ALL_SCALES.find(s => s.id === id);
  if (!spec) throw new Error(`Series family "${id}" is not a palette family.`);
  const steps = buildScale(spec, "light").steps.map(s => ({ level: s.level, hex: s.hex, L: s.oklch.L, C: s.oklch.C, H: s.oklch.h }));
  families.set(id, steps);
  return steps;
}

const ratio = (a: string | number, b: string | number) =>
  ratioOf(typeof a === "number" ? a : hexLuminance(a), typeof b === "number" ? b : hexLuminance(b));

const cache = new Map<string, SeriesColours>();

/** One series' colours at a Series lightness (sky's step). */
export function seriesColours(series: { family: string; step: number }, lightness = DEFAULT_SERIES_STEP): SeriesColours {
  const key = `${series.family}/${series.step}/${lightness}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const steps = stepsOf(series.family), levels = steps.map(s => s.level);
  const shift = levels.indexOf(lightness) - levels.indexOf(DEFAULT_SERIES_STEP);
  const at = Math.min(steps.length - 1, Math.max(0, levels.indexOf(series.step) + shift));
  const own = steps[at]!, colour = own.hex;
  const deeper = steps.slice(at + 1), lighter = steps.slice(0, at).reverse();
  // A light mark is the colour where it already clears 3:1 on every light ground (indigo, violet), else the first deeper
  // step that does, so a mark is never paler than its own series.
  const onLight = (hex: string) => SERIES_GROUNDS_LIGHT.every(g => ratio(hex, g) >= MARK_AIM);
  const mark = onLight(colour) ? colour : (deeper.find(s => onLight(s.hex)) ?? steps[steps.length - 1]!).hex;
  const area = (deeper.find(s => s.L <= AREA_L && ratio(colour, s.hex) >= MARK_AIM) ?? steps[steps.length - 1]!).hex;
  // P3's wider room adds chroma at the same OKLab lightness, which can leave a deep hue (indigo) a touch darker than its
  // sRGB colour: lift it until it is at least as light, so the P3 colour clears every ground the sRGB one does.
  let p3 = colourAtP3(own.H, own.L, 1, own.C) as SeriesColours["p3"];
  for (let lift = 0.0005; p3Luminance(p3.rgb) < hexLuminance(colour) && lift <= 0.04; lift += 0.0005) p3 = colourAtP3(own.H, Math.min(1, own.L + lift), 1, own.C) as SeriesColours["p3"];
  const p3Y = p3Luminance(p3.rgb);
  // A number inside the colour: the first deeper step that reads at 4.5:1 on the sRGB and P3 colour, else the first
  // lighter one (indigo), else white.
  const reads = (hex: string) => ratio(hex, colour) >= INK_AIM && ratio(hex, p3Y) >= INK_AIM;
  const ink = (deeper.find(s => reads(s.hex)) ?? lighter.find(s => reads(s.hex)))?.hex ?? "#ffffff";
  // Ramps walk the family's own ladder, each step at least RAMP_GAP from the last.
  const walk = (from: Step[], down: boolean) => {
    const out: Step[] = [];
    for (const s of from) if (!out.length || (down ? out[out.length - 1]!.L - s.L : s.L - out[out.length - 1]!.L) >= RAMP_GAP) { out.push(s); if (out.length === RAMP_STEPS) break; }
    return out.map(s => s.hex);
  };
  const lightRamp = walk(steps.filter(s => s.L <= RAMP_START_LIGHT), true);
  const darkRamp = walk(steps.slice(at), true).reverse();
  const out: SeriesColours = {
    light: { mark, fill: colour, area: colour, ink, ramp: lightRamp },
    dark: { mark: colour, fill: colour, area, ink, ramp: darkRamp },
    p3, family: series.family, step: own.level,
  };
  cache.set(key, out);
  return out;
}
