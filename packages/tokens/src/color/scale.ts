/**
 * Builds an Area colour scale from a hue.
 *
 * One ramp per scale, shared by both themes. The generation order is:
 *
 *   1. Take each level's lightness from its own name. `blue-58` is L 0.58; there is no
 *      lightness curve to tune and nothing for a theme to override.
 *   2. Ask the gamut how much chroma is reachable at that lightness for this hue, and take
 *      the declared fraction of it. This is where vibrancy comes from: the sRGB boundary
 *      is the only thing limiting saturation, not a second curve stacked on top of it.
 *   3. Gamut-map into sRGB and, separately, into Display P3.
 *   4. Choose the solid fill: the level nearest the hue's cusp, walked away from the cusp
 *      only as far as the contrast contract demands.
 *
 * Hue is constant down the scale and does not depend on lightness. See `curves.ts`.
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
  type Level,
  type Ramp,
  CHROMA_FRACTION,
  LEVELS,
  NEUTRAL_CHROMA_SHAPE,
  levelLightness,
} from "./curves.ts";
import { apcaMagnitude, wcagContrastHex } from "./contrast.ts";
import { type AlphaSolution, solveAlpha } from "./alpha.ts";

export type Theme = "light" | "dark";
export type ScaleKind = "neutral" | "chromatic";

export interface ScaleSpec {
  /** Token name, e.g. "blue" or "gray". */
  id: string;
  kind: ScaleKind;
  /** Hue angle in OKLCh degrees. Constant for every level of the scale. */
  hue: number;
  /**
   * Neutrals only: absolute chroma cap at the peak of `NEUTRAL_CHROMA_SHAPE`. 0 yields a
   * true grey; ~0.014 a perceptibly tinted one. Chromatic scales take the gamut ceiling
   * instead, so this is ignored for them.
   */
  neutralChroma?: number;
  /**
   * Which foreground the solid fill is designed to carry.
   *
   * A declared design decision, not something inferred -- exactly as Radix maintains an
   * explicit list. Inferring it gets blue wrong: black technically out-scores white on a
   * mid blue under WCAG, yet every shipping system puts white on a blue button.
   *
   * It also decides which way the solid level is allowed to move. White text needs the
   * fill darker, black text needs it lighter, and both start from the hue's cusp -- the
   * most chromatic point available -- and give ground only as far as the gate requires.
   */
  solidForeground?: "light" | "dark";
}

export interface StepContrast {
  /** Whichever of black or white reads better on this level. */
  fg: "#ffffff" | "#000000";
  /** WCAG 2.2 ratio against that foreground. */
  ratio: number;
  /** AAA at 7, AA at 4.5, AA Large at 3, otherwise a dash. */
  grade: "AAA" | "AA" | "AA Large" | "—";
}

export interface ScaleStep {
  /** The level, which is also this step's lightness in hundredths. */
  level: Level;
  /** OKLCh as requested, before gamut mapping. Documentation only. */
  requested: Oklch;
  /** OKLCh after mapping into sRGB. */
  oklch: Oklch;
  hex: string;
  p3: string;
  oklchCss: string;
  /** OKLab distance introduced by gamut mapping. 0 when already in gamut. */
  gamutDelta: number;
  /** Fraction of the reachable chroma this step actually claims, after mapping. */
  chromaUsed: number;
  /** How readable this level is, and with which foreground. */
  contrast: StepContrast;
}

export interface SolidChoice {
  /** The level the fill sits at. Identical in both themes: the brand does not move. */
  level: Level;
  /** The hover level, per theme -- always one step *away* from that theme's page. */
  hover: { light: Level; dark: Level };
  /** The foreground measured onto the fill. */
  foreground: "#ffffff" | "#000000";
  wcag: number;
  apca: number;
  /** How far the fill had to retreat from the cusp to clear the gate, in levels. */
  retreat: number;
}

export interface BuiltScale {
  id: string;
  kind: ScaleKind;
  theme: Theme;
  hue: number;
  cusp: { L: number; C: number };
  steps: Ramp<ScaleStep>;
  /** Translucent twins of each level, composited over this theme's page background. */
  alphas: Ramp<{ level: Level; hex8: string; alpha: number; residual: number }>;
  solid: SolidChoice;
  /** The foreground for this scale's solid fill. Kept at this name for the token emitter. */
  contrast: { hex: "#ffffff" | "#000000"; wcag: number; apca: number };
}

const PAGE_BACKGROUND: Record<Theme, string> = { light: "#ffffff", dark: "#0a0a0a" };

/** AA plus a margin, so 8-bit quantisation cannot drop a shipped fill below 4.5:1. */
const SOLID_CONTRAST_TARGET = 4.6;

/**
 * APCA minimum for a button label. Lc 60 is the published floor for content text that is
 * not body copy, which is what a control label is.
 */
const SOLID_APCA_TARGET = 61;

export function buildScale(spec: ScaleSpec, theme: Theme): BuiltScale {
  const neutral = spec.kind === "neutral";
  const cusp = findCusp(spec.hue, SRGB);

  const steps: ScaleStep[] = LEVELS.map((level, index) => {
    const L = levelLightness(level);
    const reachable = maxChromaAt(L, spec.hue, SRGB);
    const C = neutral
      ? (spec.neutralChroma ?? 0) * NEUTRAL_CHROMA_SHAPE[index]!
      : reachable * CHROMA_FRACTION[index]!;

    const requested: Oklch = { L, C: Math.min(C, reachable), h: spec.hue };
    const srgb = gamutMap(requested, SRGB);
    const p3 = gamutMap(requested, DISPLAY_P3);
    const hex = toHex(srgb.rgb);

    return {
      level,
      requested,
      oklch: srgb.oklch,
      hex,
      p3: toP3Css(p3.rgb),
      oklchCss: toOklchCss(srgb.oklch),
      gamutDelta: srgb.deltaE,
      chromaUsed: reachable > 0 ? srgb.oklch.C / reachable : 0,
      contrast: stepContrast(hex),
    };
  });

  // A neutral has no cusp worth seeking -- its chroma is a fixed cap, so every level is
  // equally "saturated" and the search would wander. Its solid is the near-black primary
  // button fill, which is a stated design decision rather than a derived one.
  const solid = neutral
    ? neutralSolid(steps)
    : chooseSolid(steps, cusp.L, spec.solidForeground ?? "light");

  const background = parseHex(PAGE_BACKGROUND[theme]);
  const alphas = steps.map((s) => {
    const solution: AlphaSolution = solveAlpha(parseHex(s.hex), background);
    return {
      level: s.level,
      hex8: formatAlphaHex(solution),
      alpha: solution.alpha,
      residual: solution.residual,
    };
  });

  return {
    id: spec.id,
    kind: spec.kind,
    theme,
    hue: spec.hue,
    cusp,
    steps,
    alphas,
    solid,
    contrast: { hex: solid.foreground, wcag: solid.wcag, apca: solid.apca },
  };
}

/**
 * Pick the solid fill.
 *
 * Start at the level nearest the hue's cusp, because that is the most chromatic colour the
 * scale contains and therefore the one that looks most like itself. Then move only if the
 * declared foreground does not clear the contract, and only in the direction that helps:
 * darker for white text, lighter for black text. The distance travelled is recorded as
 * `retreat` so the documentation can show which hues pay for readability and how much.
 *
 * This replaces a binary search over continuous lightness. The search produced a step 9
 * whose lightness ranged from 0.548 to 0.910 across the twelve hues and sat off the ramp
 * entirely -- it was not a level of the scale, it was a colour smuggled in beside it.
 */
function chooseSolid(
  steps: readonly ScaleStep[],
  cuspL: number,
  foreground: "light" | "dark",
): SolidChoice {
  const fg = foreground === "light" ? "#ffffff" : "#000000";
  const passes = (hex: string) =>
    wcagContrastHex(fg, hex) >= SOLID_CONTRAST_TARGET &&
    apcaMagnitude(fg, hex) >= SOLID_APCA_TARGET;

  // Nearest level to the cusp. LEVELS runs lightest to darkest.
  let index = 0;
  for (let i = 1; i < steps.length; i++) {
    if (Math.abs(levelLightness(steps[i]!.level) - cuspL) < Math.abs(levelLightness(steps[index]!.level) - cuspL)) {
      index = i;
    }
  }

  const start = index;
  const direction = foreground === "light" ? 1 : -1; // darker : lighter
  while (index >= 0 && index < steps.length && !passes(steps[index]!.hex)) {
    index += direction;
  }
  // A hue with no passing level in that direction keeps the cusp level; the gate will say so.
  if (index < 0 || index >= steps.length) index = start;

  const chosen = steps[index]!;
  const at = (i: number) => steps[Math.min(steps.length - 1, Math.max(0, i))]!.level;

  return {
    level: chosen.level,
    // Away from the page background in both themes: darker on light, lighter on dark.
    hover: { light: at(index + 1), dark: at(index - 1) },
    foreground: fg,
    wcag: Number(wcagContrastHex(fg, chosen.hex).toFixed(2)),
    apca: Number(apcaMagnitude(fg, chosen.hex).toFixed(1)),
    retreat: Math.abs(index - start),
  };
}

/**
 * The neutral solid: the primary button fill.
 *
 * Level 21 rather than the darkest, so `bg-inverse` at 17 stays distinguishable from a
 * primary button sitting on top of it. Near-black is the strongest call to action a neutral
 * palette can make, and it stays strongest whatever the accent axis is set to.
 */
function neutralSolid(steps: readonly ScaleStep[]): SolidChoice {
  const index = steps.findIndex((s) => s.level === 21);
  const chosen = steps[index]!;
  return {
    level: chosen.level,
    // Away from the page in each theme: darker on a light page, lighter on a dark one.
    // LEVELS runs lightest first, so a *higher* index is a darker colour.
    hover: { light: steps[index + 1]!.level, dark: steps[index - 1]!.level },
    foreground: "#ffffff",
    wcag: Number(wcagContrastHex("#ffffff", chosen.hex).toFixed(2)),
    apca: Number(apcaMagnitude("#ffffff", chosen.hex).toFixed(1)),
    retreat: 0,
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
 * How readable a level is: the better of black or white on it, the ratio, and the grade.
 *
 * Reported for the *better* foreground rather than a fixed one, because a light level and
 * a dark level are readable with opposite foregrounds and quoting one of them against both
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

/**
 * The name-is-the-value check.
 *
 * Gamut mapping holds lightness and reduces chroma, so a mapped colour must come back at
 * the lightness its name claims. If it does not, either the mapper has regressed or a step
 * was written by something other than the ladder -- both of which used to be invisible.
 */
export function assertLadder(scale: BuiltScale, tolerance = 0.002): void {
  for (const step of scale.steps) {
    const expected = levelLightness(step.level);
    if (Math.abs(step.oklch.L - expected) > tolerance) {
      throw new Error(
        `${scale.id}-${step.level}: name claims L ${expected.toFixed(3)} but the emitted ` +
          `colour is L ${step.oklch.L.toFixed(3)}. A level name must equal its lightness.`,
      );
    }
  }
}

/** Every scale, for one theme. */
export function buildScales(specs: readonly ScaleSpec[], theme: Theme): BuiltScale[] {
  return specs.map((spec) => {
    const scale = buildScale(spec, theme);
    assertLadder(scale);
    return scale;
  });
}
