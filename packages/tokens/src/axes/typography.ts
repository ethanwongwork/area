/**
 * Typography: families, and the size / leading / tracking ramp.
 *
 * Geist has a single weight axis and no `opsz`, so tracking has to be built by hand --
 * when a face carries optical sizing the font is already adjusting its own spacing and
 * manual tracking double-corrects. That is why Apple's SF Pro table reverses direction
 * above 20pt and must not be copied onto a face like this one.
 *
 * The negative tracking here follows the convergent practice of systems built on faces
 * without optical sizing: openai.com ships -0.03em at 64px and -0.01em through the
 * 17-30px range; Radix Themes ships -0.025em at 60px and 0 at 14-16px. Inter's published
 * dynamic-metrics curve asymptotes at -0.0223em, which makes anything past about -0.03em
 * a stylistic choice rather than an optical correction -- so -0.03em is the floor here.
 *
 * Line heights land on the 4px grid and the ratio falls monotonically as size rises:
 * 1.43 at the 14px default, 1.5 at 16px body, 1.0 at display. WCAG 2.2 SC 1.4.12 requires
 * content to survive 1.5x line spacing, which makes 1.5 at body close to mandatory.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

interface Step {
  size: number;
  leading: number;
  tracking: string;
}

/** Body and UI text. Weight 400. */
const TEXT: Record<string, Step> = {
  "2xs": { size: 11, leading: 16, tracking: "0.005em" },
  xs: { size: 12, leading: 16, tracking: "0.0025em" },
  sm: { size: 13, leading: 18, tracking: "0em" },
  md: { size: 14, leading: 20, tracking: "0em" },
  lg: { size: 16, leading: 24, tracking: "0em" },
  xl: { size: 18, leading: 28, tracking: "-0.005em" },
};

/** Headings. Weight 600. */
const HEADING: Record<string, Step> = {
  xs: { size: 16, leading: 24, tracking: "-0.01em" },
  sm: { size: 18, leading: 26, tracking: "-0.015em" },
  md: { size: 20, leading: 28, tracking: "-0.015em" },
  lg: { size: 24, leading: 32, tracking: "-0.02em" },
  xl: { size: 32, leading: 40, tracking: "-0.025em" },
  "2xl": { size: 40, leading: 48, tracking: "-0.03em" },
};

/** Display. Weight 600. Marketing scale, rarely used in product UI. */
const DISPLAY: Record<string, Step> = {
  sm: { size: 56, leading: 60, tracking: "-0.03em" },
  lg: { size: 72, leading: 76, tracking: "-0.03em" },
};

function ramp(prefix: string, steps: Record<string, Step>, scale = 1) {
  const out: Record<string, string> = {};
  for (const [name, step] of Object.entries(steps)) {
    out[`${prefix}-${name}-size`] = `${round(step.size * scale)}px`;
    out[`${prefix}-${name}-leading`] = `${round(step.leading * scale)}px`;
    out[`${prefix}-${name}-tracking`] = step.tracking;
  }
  return out;
}

/** Keep derived sizes on whole or half pixels; sub-pixel type renders softly. */
function round(value: number): number {
  return Math.round(value * 2) / 2;
}

const RAMPS = (scale: number) => ({
  ...ramp("text", TEXT, scale),
  ...ramp("heading", HEADING, scale),
  ...ramp("display", DISPLAY, scale),
});

const WEIGHTS = {
  "weight-regular": "400",
  "weight-medium": "500",
  "weight-semibold": "600",
};

/**
 * Geist is self-hosted from jsDelivr rather than Google Fonts. The Google build is
 * subset to 288 glyphs with every stylistic set stripped, including `ss11` -- which is
 * the one vercel.com itself enables.
 */
const GEIST = {
  "font-sans": `"Geist", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  "font-mono": `"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`,
  "font-feature-settings": `"rlig" 1, "calt" 0, "ss11" 1`,
};

const SYSTEM = {
  "font-sans": `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  "font-mono": `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
  "font-feature-settings": `normal`,
};

export const TYPOGRAPHY_AXIS: AxisDefinition = {
  id: "type",
  label: "Typography",
  description: "Typeface, and the size, leading and tracking of every step.",
  defaultPreset: "geist",
  namespaces: [
    "--area-font-",
    "--area-text-",
    "--area-heading-",
    "--area-display-",
    "--area-weight-",
  ],
  presets: [
    {
      id: "geist",
      label: "Geist",
      description: "Geist Sans and Geist Mono at a 14px UI default.",
      tokens: tokens({ ...GEIST, ...RAMPS(1), ...WEIGHTS }),
    },
    {
      id: "geist-compact",
      label: "Geist compact",
      description: "Geist at a 13px UI default, for dense tools.",
      tokens: tokens({ ...GEIST, ...RAMPS(13 / 14), ...WEIGHTS }),
    },
    {
      id: "geist-large",
      label: "Geist large",
      description: "Geist at a 16px UI default, for reading-heavy products.",
      tokens: tokens({ ...GEIST, ...RAMPS(16 / 14), ...WEIGHTS }),
    },
    {
      id: "system",
      label: "System",
      description: "The platform UI font. No webfont, no layout shift.",
      tokens: tokens({ ...SYSTEM, ...RAMPS(1), ...WEIGHTS }),
    },
  ],
};
