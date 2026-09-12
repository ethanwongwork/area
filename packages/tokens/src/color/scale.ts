/**
 * Builds a twelve-step Area colour scale from a hue.
 *
 * The generation order matters:
 *
 *   1. Find the hue's gamut cusp. Blue peaks near L 0.45, yellow near L 0.87 -- a 40-point
 *      spread. This is why one hardcoded lightness curve cannot serve every hue, and why
 *      Tailwind v4's step-500 lightness varies by 25 points across its palette.
 *   2. Snap step 9's lightness toward that cusp, so peak chroma lands where the gamut
 *      actually allows it rather than where a table guessed.
 *   3. Drift the hue per step, anchored at step 9.
 *   4. Clamp chroma to what is reachable at each step's own lightness.
 *   5. Gamut-map into sRGB and, separately, into Display P3.
 *   6. Choose the foreground that sits on step 9, by measurement rather than assumption.
 */
import {
  type Gamut,
  type Oklch,
  DISPLAY_P3,
  SRGB,
  toHex,
  toOklchCss,
  toP3Css,
  parseHex,
} from "./oklab.ts";
import { findCusp, gamutMap, maxChromaAt } from "./gamut.ts";
import {
  type HueDrift,
  type Twelve,
  C_SHAPE_CHROMATIC_DARK,
  C_SHAPE_CHROMATIC_LIGHT,
  C_SHAPE_NEUTRAL,
  L_DARK_CHROMATIC,
  L_DARK_NEUTRAL,
  L_LIGHT_CHROMATIC,
  L_LIGHT_NEUTRAL,
  NO_DRIFT,
  driftedHue,
} from "./curves.ts";
import { apcaMagnitude, wcagContrastHex } from "./contrast.ts";
import { type AlphaSolution, solveAlpha } from "./alpha.ts";

export type Theme = "light" | "dark";
export type ScaleKind = "neutral" | "chromatic";

export interface ScaleSpec {
  /** Token name, e.g. "blue" or "gray". */
  id: string;
  kind: ScaleKind;
  /** Hue angle in degrees at step 9 -- the anchor the whole scale is built around. */
  hue: number;
  drift?: HueDrift;
  /**
   * Neutrals only: absolute chroma cap. 0 yields a true grey; ~0.014 a perceptibly
   * tinted one. Ignored for chromatic scales, which take their peak from the cusp.
   */
  neutralChroma?: number;
  /**
   * Which foreground the solid fill (steps 9 and 10) is designed to carry.
   *
   * This is a declared design decision, not something inferred -- exactly as Radix
   * maintains an explicit list of scales that take dark foregrounds. Inferring it
   * gets blue wrong: black technically out-scores white on a mid blue under WCAG,
   * yet every shipping system puts white on a blue button.
   *
   * It also sets where step 9 sits. A light foreground pulls step 9 down to the
   * lightest lightness that still carries white text at AA -- the most saturated
   * colour that is genuinely readable. A dark foreground lets step 9 rise to the
   * hue's own cusp, which is where intrinsically light hues such as yellow and amber
   * actually look like themselves rather than like olive.
   */
  solidForeground?: "light" | "dark";
}

export interface StepContrast {
  /** Whichever of black or white reads better on this step. */
  fg: "#ffffff" | "#000000";
  /** WCAG 2.2 ratio against that foreground. */
  ratio: number;
  /** AAA at 7, AA at 4.5, AA Large at 3, otherwise a dash. */
  grade: "AAA" | "AA" | "AA Large" | "—";
}

export interface ScaleStep {
  step: number;
  /** OKLCh as requested, before gamut mapping. Documentation only. */
  requested: Oklch;
  /** OKLCh after mapping into sRGB. */
  oklch: Oklch;
  hex: string;
  p3: string;
  oklchCss: string;
  /** OKLab distance introduced by gamut mapping. 0 when already in gamut. */
  gamutDelta: number;
  /** How readable this step is, and with which foreground. */
  contrast: StepContrast;
}

export interface BuiltScale {
  id: string;
  kind: ScaleKind;
  theme: Theme;
  hue: number;
  cusp: { L: number; C: number };
  steps: Twelve<ScaleStep>;
  /** Translucent twins of each step, composited over this theme's page background. */
  alphas: Twelve<{ step: number; hex8: string; alpha: number; residual: number }>;
  /**
   * The foreground to place on steps 9 and 10, chosen by measuring both candidates.
   * Light hues such as amber and yellow legitimately need black here; assuming white
   * is the single most common way a palette ships an unreadable button.
   */
  contrast: { hex: "#ffffff" | "#000000"; wcag: number; apca: number };
}

const PAGE_BACKGROUND: Record<Theme, string> = { light: "#ffffff", dark: "#0a0a0a" };

/** Fraction of the reachable chroma a step may claim; keeps steps off the exact boundary. */
const CHROMA_SAFETY = 0.995;

/**
 * Chroma of the solid fill, as a fraction of what is reachable at its lightness.
 * Sitting flush against the gamut boundary reads as fluorescent rather than branded.
 */
const SOLID_CHROMA = 0.92;

/** Lightness step from solid fill to its hover. One even perceptual move for every hue. */
const SOLID_HOVER_DELTA = 0.05;

/**
 * AA plus a margin, so 8-bit quantisation cannot drop a shipped fill below 4.5:1.
 */
const SOLID_CONTRAST_TARGET = 4.6;

/**
 * APCA minimum for a button label. Lc 60 is the published floor for content text that is
 * not body copy, which is what a control label is.
 */
const SOLID_APCA_TARGET = 61;

export function buildScale(spec: ScaleSpec, theme: Theme): BuiltScale {
  const neutral = spec.kind === "neutral";
  const drift = spec.drift ?? NO_DRIFT;

  const lightness = neutral
    ? theme === "light"
      ? L_LIGHT_NEUTRAL
      : L_DARK_NEUTRAL
    : theme === "light"
      ? L_LIGHT_CHROMATIC
      : L_DARK_CHROMATIC;

  const shape = neutral
    ? C_SHAPE_NEUTRAL
    : theme === "light"
      ? C_SHAPE_CHROMATIC_LIGHT
      : C_SHAPE_CHROMATIC_DARK;

  const cusp = findCusp(spec.hue, SRGB);
  const solidForeground = spec.solidForeground ?? "light";

  // Steps 9 and 10 carry the scale's identity and are the only steps allowed off the curve.
  const L9 = neutral ? lightness[8] : solidLightness(spec.hue, solidForeground, cusp.L);
  // The hover step is derived from step 9, never from a fixed curve value. Deriving it is
  // what keeps the rest-to-hover move a single even perceptual step for every hue --
  // reading it off a curve makes warm hues plunge, because their step 9 sits much higher.
  // A dark-foreground fill already sits near the top of its gamut, so lightening it on
  // hover only washes it toward white. Those scales darken on hover in both themes; the
  // rest move away from the page background, which is the direction that reads as
  // "more emphasis" against it.
  const hoverDown = neutral ? theme === "light" : solidForeground === "dark" || theme === "light";
  const L10 = neutral
    ? lightness[9]
    : hoverDown
      ? L9 - SOLID_HOVER_DELTA
      : L9 + SOLID_HOVER_DELTA;

  // Lightness for every step, resolved before hues so drift can be normalised by the span.
  const resolvedL = lightness.map((baseL, index) => (index === 8 ? L9 : index === 9 ? L10 : baseL));
  const span = { darkest: Math.min(...resolvedL), lightest: Math.max(...resolvedL) };

  const peakChroma = neutral
    ? (spec.neutralChroma ?? 0)
    : maxChromaAt(L9, spec.hue, SRGB) * SOLID_CHROMA;

  const steps = resolvedL.map((L, index): ScaleStep => {
    const hue = driftedHue(spec.hue, L, L9, drift, span);
    const reachable = maxChromaAt(L, hue, SRGB);
    const C = Math.min(peakChroma * shape[index]!, reachable * CHROMA_SAFETY);

    const requested: Oklch = { L, C, h: hue };
    const srgb = gamutMap(requested, SRGB);
    const p3 = gamutMap(requested, DISPLAY_P3);

    return {
      step: index + 1,
      contrast: stepContrast(toHex(srgb.rgb)),
      requested,
      oklch: srgb.oklch,
      hex: toHex(srgb.rgb),
      p3: toP3Css(p3.rgb),
      oklchCss: toOklchCss(srgb.oklch),
      gamutDelta: srgb.deltaE,
    };
  }) as unknown as Twelve<ScaleStep>;

  const background = parseHex(PAGE_BACKGROUND[theme]);
  const alphas = steps.map((s) => {
    const solution: AlphaSolution = solveAlpha(parseHex(s.hex), background);
    return {
      step: s.step,
      hex8: formatAlphaHex(solution),
      alpha: solution.alpha,
      residual: solution.residual,
    };
  }) as unknown as Twelve<{ step: number; hex8: string; alpha: number; residual: number }>;

  return {
    id: spec.id,
    kind: spec.kind,
    theme,
    hue: spec.hue,
    cusp,
    steps,
    alphas,
    contrast: measureContrast(steps[8]!.hex, solidForeground),
  };
}

function formatAlphaHex({ alpha, rgb }: AlphaSolution): string {
  const hex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(rgb[0])}${hex(rgb[1])}${hex(rgb[2])}${hex(alpha)}`;
}

/**
 * Lightness for the solid fill.
 *
 * For a light foreground: the lightest lightness whose colour still carries white text at
 * the AA target. Contrast rises as the fill darkens, so the boundary is the most vivid
 * readable point -- which is why this lands around L 0.55, close to Tailwind's 600 step
 * rather than Radix's 9, whose white-on-solid pairs do not actually clear 4.5:1.
 *
 * For a dark foreground: the hue's cusp, where chroma peaks. Black clears AA comfortably
 * at those lightnesses, so there is nothing to solve for.
 */
function solidLightness(hue: number, foreground: "light" | "dark", cuspL: number): number {
  if (foreground === "dark") {
    // Chroma peaks exactly at the cusp, so start there and give ground only if black text
    // does not clear the contract. Orange is the hue that forces this: at its cusp it
    // clears WCAG comfortably but lands at APCA Lc 57, just under the readable minimum.
    for (let L = cuspL; L <= 0.98; L += 0.004) {
      const C = maxChromaAt(L, hue, SRGB) * SOLID_CHROMA;
      const hex = toHex(gamutMap({ L, C, h: hue }, SRGB).rgb);
      if (
        wcagContrastHex("#000000", hex) >= SOLID_CONTRAST_TARGET &&
        apcaMagnitude("#000000", hex) >= SOLID_APCA_TARGET
      ) {
        return L;
      }
    }
    return cuspL;
  }

  let lo = 0.3;
  let hi = 0.85;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const C = maxChromaAt(mid, hue, SRGB) * SOLID_CHROMA;
    const hex = toHex(gamutMap({ L: mid, C, h: hue }, SRGB).rgb);
    if (
      wcagContrastHex("#ffffff", hex) >= SOLID_CONTRAST_TARGET &&
      apcaMagnitude("#ffffff", hex) >= SOLID_APCA_TARGET
    ) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

/** Measure the declared foreground against the solid fill, so the gate can assert on it. */
function measureContrast(solidHex: string, foreground: "light" | "dark"): BuiltScale["contrast"] {
  const hex = foreground === "light" ? "#ffffff" : "#000000";
  return { hex, wcag: wcagContrastHex(hex, solidHex), apca: apcaMagnitude(hex, solidHex) };
}

/**
 * How readable a step is: the better of black or white on it, the ratio, and the grade.
 *
 * Reported for the *better* foreground rather than a fixed one, because a light step and
 * a dark step are readable with opposite foregrounds and quoting one of them against both
 * makes half the scale look broken when it is not.
 */
function stepContrast(hex: string): StepContrast {
  const onWhite = wcagContrastHex("#ffffff", hex);
  const onBlack = wcagContrastHex("#000000", hex);
  const fg = onWhite >= onBlack ? "#ffffff" : "#000000";
  const ratio = Math.max(onWhite, onBlack);
  const grade = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "—";
  return { fg, ratio: Number(ratio.toFixed(2)), grade };
}

/** Every scale, for one theme. */
export function buildScales(specs: readonly ScaleSpec[], theme: Theme): BuiltScale[] {
  return specs.map((spec) => buildScale(spec, theme));
}
