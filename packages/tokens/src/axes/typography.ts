/**
 * Typography: families, the size ramp, and exactly two weights (regular for text and
 * titles; strong only for labels on fills: buttons, segmented options, badges, counts).
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
 * **Strong is deliberately soft.** 500, not 600 and not Geist's own 550. The two-weight
 * rule exists to make the step between regular and strong *small*, and at UI sizes 550
 * against 400 is already most of the way to a semibold -- which is the contrast the rule
 * was written to avoid. 500 is also the one weight every platform font ships, so the
 * variable and non-variable presets no longer disagree about what strong means.
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
 * The UI ramp is six sizes with one leading each, all on the 4px grid
 * (docs/specs/typography.md, owner-approved 2026-09-25). Hierarchy comes from size,
 * tracking and color; titles are set at the regular weight, as ChatGPT and Cursor do.
 *
 * Text: xs is the caption (12/16), sm the UI size (14/20), md the body size (16/24).
 * Long-form prose loosens md to 16/26 in its container rather than through another role.
 */
const TEXT: Record<string, Step> = {
  xs: { size: 12, leading: 16, tracking: "0.005em" },
  sm: { size: 14, leading: 20, tracking: "0em" },
  md: { size: 16, leading: 24, tracking: "0em" },
};

/**
 * Title: 16/24 for a surface title (Card, Dialog), then 20/28, 24/32 and 32/40 with negative
 * tracking; anything larger than 32px is display type. Titles hold their size in compact
 * density, so a surface title doesn't split from its peers there (audit H-7 A, owner
 * 2026-09-30: Card read text-md and shrank to 14/20, Dialog read the 16/24 primitives).
 */
const TITLE: Record<string, Step> = {
  xs: { size: 16, leading: 24, tracking: "0em" },
  sm: { size: 20, leading: 28, tracking: "-0.01em" },
  md: { size: 24, leading: 32, tracking: "-0.015em" },
  lg: { size: 32, leading: 40, tracking: "-0.02em" },
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

export const typographyRamps = (offset: number) => ({
  ...ramp("text", TEXT, offset),
  // Compact tightens text only; titles keep their size so headings do not shrink toward body.
  ...ramp("title", TITLE, Math.max(0, offset)),
  ...ramp("display", DISPLAY, offset),
});

/**
 * Geist is self-hosted from jsDelivr rather than Google Fonts. The Google build is subset
 * to 288 glyphs with every stylistic set stripped, including `ss11` -- the one
 * vercel.com itself enables.
 */
export const GEIST_TOKENS = {
  "font-sans": `"Geist", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  "font-mono": `"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`,
  "font-feature-settings": `"rlig" 1, "calt" 0, "ss11" 1`,
  "weight-regular": "var(--area-wght-400)",
  /** Geist's own emphasis weight, as shipped by Vercel. Needs the variable font. */
  "weight-strong": "var(--area-wght-500)",
  /** Line weight of Area-drawn icons, matched to this face's 14px regular stem (docs/specs/icons.md). */
  "weight-icon": "1.125px",
};

const SYSTEM = {
  "font-sans": `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  "font-mono": `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
  "font-feature-settings": `normal`,
  "weight-regular": "var(--area-wght-400)",
  /** Platform fonts ship discrete weights; 500 is one every UI stack actually has. */
  "weight-strong": "var(--area-wght-500)",
  /** Unmeasured for platform faces; keeps the Geist value until one is measured. */
  "weight-icon": "1.125px",
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
      tokens: tokens({ ...GEIST_TOKENS, ...typographyRamps(0) }),
    },
    {
      id: "geist-compact",
      label: "Compact",
      description: "Geist one step down, for dense tools.",
      tokens: tokens({ ...GEIST_TOKENS, ...typographyRamps(-1) }),
    },
    {
      id: "geist-large",
      label: "Large",
      description: "Geist one step up, for reading-heavy products.",
      tokens: tokens({ ...GEIST_TOKENS, ...typographyRamps(1) }),
    },
    {
      id: "system",
      label: "System",
      description: "The platform UI font. No webfont, no layout shift.",
      tokens: tokens({ ...SYSTEM, ...typographyRamps(0) }),
    },
  ],
};
