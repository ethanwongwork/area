/**
 * Typography: families, the size ramp, and exactly two weights.
 *
 * Three decisions shape this ramp.
 *
 * **Weight is orthogonal to role.** A role sets size, leading and tracking; it does not
 * set weight. That is what makes large text at a regular weight possible -- a 20px
 * paragraph rather than a 20px heading -- which a ramp with weight baked into the role
 * cannot express at all.
 *
 * **Two weights, not three.** Regular and strong. Linear ships exactly two (400 and 510)
 * and never goes above; Material's base scale uses only 400 and 500. A third weight buys
 * a distinction most readers cannot name and every author has to decide about.
 *
 * **Strong is deliberately soft.** Vercel ships `font-weight: 550` as Geist's own
 * emphasis weight, precisely because 400 -> 500 reads too weakly in this face while
 * 400 -> 600 reads as shouting. Non-integer weights need a variable font, so the system
 * preset -- which gets whatever the platform provides -- steps up to 600 instead.
 *
 * Geist has a single weight axis and no optical-size axis, so tracking is built by hand.
 * When a face carries optical sizing the font already adjusts its own spacing and manual
 * tracking double-corrects; that is why Apple's SF Pro table reverses direction above
 * 20pt and must not be copied onto a face like this one.
 *
 * Names are relative (xs..xl) rather than pixel values, unlike spacing and radius. The
 * type axis rescales the whole ramp, so `--area-text-14` would become a lie the moment
 * someone selected the compact preset. Spacing does not rescale, so there the pixel
 * value is the honest name.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { LEADING_RAMP, SIZE_RAMP } from "../emit/base.ts";

interface Step {
  size: number;
  leading: number;
  tracking: string;
}

/**
 * Text: anything read as prose or rendered inside a control.
 *
 * Leading runs 1.33 to 1.5, rising with size, because WCAG 2.2 SC 1.4.12 requires content
 * to survive 1.5x line spacing and body copy that already sits there has nowhere to go.
 * `md` is 16px -- the size at which this ramp is meant to be read -- while controls take
 * `sm` at 14px, which is the split Notion uses between content and chrome.
 */
const TEXT: Record<string, Step> = {
  xs: { size: 12, leading: 16, tracking: "0.0025em" },
  sm: { size: 14, leading: 20, tracking: "0em" },
  md: { size: 16, leading: 24, tracking: "0em" },
  lg: { size: 18, leading: 26, tracking: "-0.005em" },
  xl: { size: 20, leading: 30, tracking: "-0.01em" },
};

/**
 * Title: headings, from a card's to a page's.
 *
 * The same sizes as the upper half of the text ramp, but with tighter leading and real
 * negative tracking, because a title is one or two lines and a paragraph is not. Keeping
 * both means a 20px string can be a heading or a lead paragraph, and the choice is the
 * author's rather than the ramp's.
 */
const TITLE: Record<string, Step> = {
  xs: { size: 16, leading: 22, tracking: "-0.01em" },
  sm: { size: 20, leading: 26, tracking: "-0.015em" },
  md: { size: 24, leading: 30, tracking: "-0.02em" },
  lg: { size: 32, leading: 40, tracking: "-0.025em" },
  xl: { size: 40, leading: 48, tracking: "-0.03em" },
};

/**
 * Display: hero type.
 *
 * Tracking stops at -0.03em. Inter's published dynamic-metrics curve asymptotes at
 * -0.0223em, which makes anything past roughly -0.03em a stylistic choice rather than an
 * optical correction -- and openai.com, on a face with no optical sizing, ships exactly
 * -0.03em at 64px.
 */
const DISPLAY: Record<string, Step> = {
  sm: { size: 56, leading: 56, tracking: "-0.03em" },
  lg: { size: 72, leading: 72, tracking: "-0.03em" },
};

/**
 * Move a size to a neighbouring stop on the primitive ramp.
 *
 * The scale presets step rather than multiply. A multiplier puts 16 x 14/16 at 14px but
 * 24 x 14/16 at 21px -- a leading on no ramp, which renders softly and pairs with nothing.
 * Stepping keeps every preset on the ramp by construction.
 */
function shift(ramp: readonly number[], value: number, steps: number): number {
  if (!Number.isInteger(steps)) throw new Error(`shift() takes whole steps, not ${steps}`);
  const index = ramp.indexOf(value);
  if (index === -1) throw new Error(`${value} is not a stop on the ramp [${ramp.join(", ")}]`);
  return ramp[Math.min(ramp.length - 1, Math.max(0, index + steps))]!;
}

/** Nearest stop to a target, breaking ties toward the tighter value. */
function nearest(ramp: readonly number[], target: number): number {
  return ramp.reduce((best, stop) =>
    Math.abs(stop - target) < Math.abs(best - target) ? stop : best,
  );
}

function ramp(prefix: string, steps: Record<string, Step>, offset: number) {
  const out: Record<string, string> = {};
  for (const [name, step] of Object.entries(steps)) {
    const size = shift(SIZE_RAMP, step.size, offset);
    // Leading follows the size by ratio, not by step count: the two ramps have different
    // densities, so shifting both by one index would quietly change every ratio.
    const leading = offset === 0 ? step.leading : nearest(LEADING_RAMP, size * (step.leading / step.size));
    out[`${prefix}-${name}-size`] = `var(--area-size-${size})`;
    out[`${prefix}-${name}-leading`] = `var(--area-leading-${leading})`;
    out[`${prefix}-${name}-tracking`] = step.tracking;
  }
  return out;
}

const RAMPS = (offset: number) => ({
  ...ramp("text", TEXT, offset),
  ...ramp("title", TITLE, offset),
  ...ramp("display", DISPLAY, offset),
});

/**
 * Geist is self-hosted from jsDelivr rather than Google Fonts. The Google build is subset
 * to 288 glyphs with every stylistic set stripped, including `ss11` -- the one
 * vercel.com itself enables.
 */
const GEIST = {
  "font-sans": `"Geist", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  "font-mono": `"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`,
  "font-feature-settings": `"rlig" 1, "calt" 0, "ss11" 1`,
  "weight-regular": "var(--area-wght-400)",
  /** Geist's own emphasis weight, as shipped by Vercel. Needs the variable font. */
  "weight-strong": "var(--area-wght-550)",
};

const SYSTEM = {
  "font-sans": `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  "font-mono": `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
  "font-feature-settings": `normal`,
  "weight-regular": "var(--area-wght-400)",
  /** Platform fonts ship discrete weights, so 550 would snap unpredictably. */
  "weight-strong": "var(--area-wght-600)",
};

export const TYPOGRAPHY_AXIS: AxisDefinition = {
  id: "type",
  label: "Typography",
  description: "Typeface, the size ramp, and the two weights.",
  defaultPreset: "geist",
  namespaces: [
    "--area-font-",
    "--area-text-",
    "--area-title-",
    "--area-display-",
    "--area-weight-",
  ],
  presets: [
    {
      id: "geist",
      label: "Geist",
      description: "Geist Sans and Geist Mono. 16px body, 14px controls.",
      tokens: tokens({ ...GEIST, ...RAMPS(0) }),
    },
    {
      id: "geist-compact",
      label: "Compact",
      description: "Geist one step down, for dense tools.",
      tokens: tokens({ ...GEIST, ...RAMPS(-1) }),
    },
    {
      id: "geist-large",
      label: "Large",
      description: "Geist one step up, for reading-heavy products.",
      tokens: tokens({ ...GEIST, ...RAMPS(1) }),
    },
    {
      id: "system",
      label: "System",
      description: "The platform UI font. No webfont, no layout shift.",
      tokens: tokens({ ...SYSTEM, ...RAMPS(0) }),
    },
  ],
};
