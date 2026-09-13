/**
 * Loads an Area colour scale from the vendored Stadium palette.
 *
 * This file used to generate colours from a hue: find the gamut cusp, take a fraction of
 * the reachable chroma at each lightness, map into sRGB. It now reads a table. The palette
 * was wall-anchored rather than formula-generated -- per-hue splines, chroma-consensus
 * levels, hue held in IPT -- and reproducing that from a curve was never going to be
 * closer to it than using it.
 *
 * What is still computed here, because the palette does not carry it:
 *
 *   The translucent twin of every rung, solved against each theme's page background so a
 *   hover tint composites back to the opaque colour it names.
 *   Which of black or white each rung carries, by measurement.
 *   Which rung is the solid fill, and its hover -- see `chooseSolid`.
 */
import { type Oklch, parseHex, toOklchCss } from "./oklab.ts";
import { type Level, type Ramp, INVERSION, LEVELS } from "./curves.ts";
import { apcaMagnitude, wcagContrastHex } from "./contrast.ts";
import { type AlphaSolution, solveAlpha } from "./alpha.ts";
import PALETTE from "./palette.json" with { type: "json" };

export type Theme = "light" | "dark";
export type ScaleKind = "neutral" | "chromatic";

interface PaletteRung {
  hex: string;
  oklch: { L: number; C: number; H: number };
}

const FAMILIES = PALETTE.families as unknown as Record<string, Record<string, PaletteRung>>;

export interface ScaleSpec {
  /** Token name, and the palette family it reads. */
  id: string;
  kind: ScaleKind;
  /**
   * Which foreground the solid fill is designed to carry.
   *
   * A declared design decision, not something inferred -- exactly as Radix maintains an
   * explicit list. Inferring it gets blue wrong: black technically out-scores white on a
   * mid blue under WCAG, yet every shipping system puts white on a blue button.
   *
   * It also decides which way the solid rung may move. White text needs the fill darker,
   * black text needs it lighter, and both start from the family's most chromatic rung and
   * give ground only as far as the gate requires.
   */
  solidForeground?: "light" | "dark";
}

export interface StepContrast {
  /** Whichever of black or white reads better on this rung. */
  fg: "#ffffff" | "#000000";
  /** WCAG 2.2 ratio against that foreground. */
  ratio: number;
  /** AAA at 7, AA at 4.5, AA Large at 3, otherwise a dash. */
  grade: "AAA" | "AA" | "AA Large" | "—";
}

export interface ScaleStep {
  level: Level;
  oklch: Oklch;
  hex: string;
  oklchCss: string;
  contrast: StepContrast;
}

export interface SolidChoice {
  /** The rung the fill sits at. Identical in both themes: the brand does not move. */
  level: Level;
  /** The hover rung, per theme -- always one step *away* from that theme's page. */
  hover: { light: Level; dark: Level };
  foreground: "#ffffff" | "#000000";
  wcag: number;
  apca: number;
  /** How far the fill had to retreat from peak chroma to clear the gate, in rungs. */
  retreat: number;
}

export interface VividChoice {
  /** The most saturated rung that is still readable as body text on each theme's page. */
  light: Level;
  dark: Level;
}

export interface BuiltScale {
  id: string;
  kind: ScaleKind;
  theme: Theme;
  /** The family's hue at its solid rung. Documentation only; hue is not held constant. */
  hue: number;
  /** The rung carrying the most chroma, and how much. Replaces the generated cusp. */
  peak: { level: Level; C: number };
  steps: Ramp<ScaleStep>;
  alphas: Ramp<{ level: Level; hex8: string; alpha: number; residual: number }>;
  solid: SolidChoice;
  vivid: VividChoice;
  contrast: { hex: "#ffffff" | "#000000"; wcag: number; apca: number };
}

/** The palette ships white as a constant because its ladder stops at 25. */
export const WHITE: string = (PALETTE.constants as { white: string }).white;

const PAGE_BACKGROUND: Record<Theme, string> = { light: "#ffffff", dark: "#000000" };

/** AA plus a margin, so 8-bit quantisation cannot drop a shipped fill below 4.5:1. */
const SOLID_CONTRAST_TARGET = 4.6;

/**
 * APCA minimum for a button label. Lc 60 is the published floor for content text that is
 * not body copy, which is what a control label is.
 */
const SOLID_APCA_TARGET = 61;

export function buildScale(spec: ScaleSpec, theme: Theme): BuiltScale {
  const family = FAMILIES[spec.id];
  if (!family) {
    throw new Error(
      `"${spec.id}" is not a family in the vendored palette. Known: ${Object.keys(FAMILIES).join(", ")}`,
    );
  }

  const steps: ScaleStep[] = LEVELS.map((level) => {
    const rung = family[String(level)];
    if (!rung) throw new Error(`${spec.id} is missing rung ${level}.`);
    const oklch: Oklch = { L: rung.oklch.L, C: rung.oklch.C, h: rung.oklch.H };
    return {
      level,
      oklch,
      hex: rung.hex,
      oklchCss: toOklchCss(oklch),
      contrast: stepContrast(rung.hex),
    };
  });

  const vivid = { light: chooseVivid(steps, "light"), dark: chooseVivid(steps, "dark") };
  const peakStep = steps.reduce((a, s) => (s.oklch.C > a.oklch.C ? s : a), steps[0]!);
  const peak = { level: peakStep.level, C: peakStep.oklch.C };
  const solid = chooseSolid(steps, peakStep.level, spec.solidForeground ?? "light");

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
    hue: steps.find((s) => s.level === solid.level)!.oklch.h,
    peak,
    steps,
    alphas,
    solid,
    vivid,
    contrast: { hex: solid.foreground, wcag: solid.wcag, apca: solid.apca },
  };
}

/**
 * Pick the solid fill.
 *
 * Start at the family's most chromatic rung, because that is the colour that looks most
 * like itself, then move only if the declared foreground does not clear the contract, and
 * only in the direction that helps: darker for white text, lighter for black.
 *
 * This is where the palette's two ladders show up. Its 500 rung is pinned to a wall, but
 * not the same wall for every hue: blue, indigo, pink, purple, red and the three neutrals
 * clear AA with white at 500, while cyan, green, lime, orange, teal and yellow only reach
 * 3:1 there and need 600. The palette's own README calls these the label ladder and the
 * glyph ladder. Nothing here hardcodes which is which -- the walk finds it by measuring,
 * so a family that moves in a future export moves its solid with it.
 */
function chooseSolid(
  steps: readonly ScaleStep[],
  peakLevel: Level,
  foreground: "light" | "dark",
): SolidChoice {
  const fg = foreground === "light" ? "#ffffff" : "#000000";
  const passes = (hex: string) =>
    wcagContrastHex(fg, hex) >= SOLID_CONTRAST_TARGET &&
    apcaMagnitude(fg, hex) >= SOLID_APCA_TARGET;

  const start = steps.findIndex((s) => s.level === peakLevel);
  let index = start;
  const direction = foreground === "light" ? 1 : -1; // darker : lighter
  while (index >= 0 && index < steps.length && !passes(steps[index]!.hex)) {
    index += direction;
  }
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
 * The most saturated rung of a family that is still readable as body text.
 *
 * Chroma peaks in the middle of every ramp and falls away toward both ends, so the most
 * colourful legible text is the rung closest to the page *before* contrast runs out.
 * Walking outward from 500 and stopping at the first pass finds it.
 *
 * The walk measures against `bg-code`, because a code block is the only place this token is
 * used and its ground is the one that decides legibility. That ground is white in light,
 * which is exactly what the palette pins its 500 rung to -- so on the label ladder the walk
 * returns 500 unchanged. Measured against a grey ground instead it returned 550, a rung the
 * palette never calibrated for anything.
 *
 * This is what "use 500" has to mean in a palette with two walls. On the label ladder --
 * blue, red, indigo, purple, pink -- 500 clears AA on the page and is returned unchanged.
 * On the glyph ladder it measures barely 3:1, which is fine for a status dot and unusable
 * for a string literal, so those families walk one or two rungs deeper. Hardcoding 500
 * everywhere would have shipped illegible syntax highlighting in exactly six hues.
 */
function chooseVivid(steps: readonly ScaleStep[], theme: Theme): Level {
  const page = groundHex(INVERSION.code[theme]);
  const start = steps.findIndex((s) => s.level === 500);
  // Light pages need the text darker; dark pages need it lighter.
  const direction = theme === "light" ? 1 : -1;
  // Both standards, as everywhere else. WCAG alone let six families through in dark mode
  // at APCA Lc 41-46 against a floor of 60 -- the exact overstatement near black that is
  // the reason this system gates on APCA in dark themes at all.
  for (let i = start; i >= 0 && i < steps.length; i += direction) {
    const hex = steps[i]!.hex;
    if (wcagContrastHex(hex, page) >= 4.6 && apcaMagnitude(hex, page) >= 61) return steps[i]!.level;
  }
  return steps[start]!.level;
}

/** A ground's hex, where the ground may be a rung or the palette's white constant. */
function groundHex(position: Level | "white"): string {
  return position === "white"
    ? (PALETTE.constants as { white: string }).white
    : FAMILIES.neutral![String(position)]!.hex;
}

function formatAlphaHex({ alpha, rgb }: AlphaSolution): string {
  const hex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(rgb[0])}${hex(rgb[1])}${hex(rgb[2])}${hex(alpha)}`;
}

/**
 * How readable a rung is: the better of black or white on it, the ratio, and the grade.
 *
 * Reported for the *better* foreground rather than a fixed one, because a light rung and a
 * dark rung are readable with opposite foregrounds and quoting one of them against both
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
 * The palette is data, so it is checked on load rather than trusted.
 *
 * A vendored table cannot be re-derived, which means a transcription error would be
 * invisible: the wrong hex still parses, still renders, and still passes every structural
 * check. These two properties would not survive one.
 */
export function assertScale(scale: BuiltScale): void {
  for (const step of scale.steps) {
    const rung = FAMILIES[scale.id]![String(step.level)]!;
    const parsed = parseHex(rung.hex);
    if (parsed.some((c) => Number.isNaN(c))) {
      throw new Error(`${scale.id}-${step.level}: "${rung.hex}" is not a colour.`);
    }
  }
  for (let i = 1; i < scale.steps.length; i++) {
    const prev = scale.steps[i - 1]!;
    const next = scale.steps[i]!;
    if (next.oklch.L >= prev.oklch.L) {
      throw new Error(
        `${scale.id}: rung ${next.level} (L ${next.oklch.L.toFixed(3)}) is not darker than ` +
          `rung ${prev.level} (L ${prev.oklch.L.toFixed(3)}). The ladder must descend.`,
      );
    }
  }
}

/** Every scale, for one theme. */
export function buildScales(specs: readonly ScaleSpec[], theme: Theme): BuiltScale[] {
  return specs.map((spec) => {
    const scale = buildScale(spec, theme);
    assertScale(scale);
    return scale;
  });
}
