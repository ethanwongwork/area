/**
 * Loads an Area colour scale from the vendored Area palette.
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
import { type Oklch, SRGB, parseHex, toHex, toOklchCss } from "./oklab.ts";
import { gamutMap, maxChromaAt } from "./gamut.ts";
import { colourAt } from "./place.ts";
import { DARK_CHROMA_CAP, DARK_LIGHTNESS_LIFT, DARK_TONAL_CHROMA, DEFAULT_TONE_TINT, LIGHT_TONAL_CHROMA, TINT_HUE_LEVEL, VIVID_PEAK_CHROMA, type Level, type Ramp, CHROMA_TRIM, HUE_DRIFT, HUE_ROTATION, INVERSION, LEVELS, chromaTrimWeight, hueDrift } from "./curves.ts";
import { apcaMagnitude, relativeLuminance, wcagContrastHex } from "./contrast.ts";
import { TONE_FLOORS, toneFloorApca, toneFloorId, toneFloorY } from "./layers.ts";
import { type AlphaSolution, solveAlpha } from "./alpha.ts";
import PALETTE from "./palette.json" with { type: "json" };
import { ACCENT_STRENGTHS, SOLID_STEPS, type SolidStep, familyFor, mixOklab, withStrength } from "./generate.ts";

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
  /** A generated family's light-end chroma trim (color/generate.ts: its neighbours' `CHROMA_TRIM`, mixed). */
  trim?: number;
  /** A generated family's hue drift (color/generate.ts: its neighbours' `HUE_DRIFT`, mixed). */
  drift?: { light: number; dark: number };
  /**
   * A family given directly rather than read from the palette by `id`: a brand colour's family (color/brand.ts), which
   * never enters palette.json or the shared scale cache.
   */
  family?: Readonly<Record<string, PaletteRung>>;
  /** A rung kept exactly as the family gives it, past every trim, lift and cap: the brand colour itself. */
  exact?: Level;
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
  /**
   * The rung the fill sits at, per theme.
   *
   * For a chromatic family the two are identical -- a accent colour does not move when the
   * lights go out. A neutral family is the exception and has to be: its solid is the
   * near-black button, and near-black on a near-black page is not a button. There the fill
   * crosses the ladder with the theme.
   */
  level: { light: Level; dark: Level };
  /** The hover rung, per theme -- one adjacent step that preserves label contrast. */
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

export interface TonalChoice {
  /** Most chromatic foreground that clears the supported tonal and neutral grounds. */
  foreground: { light: Level; dark: Level };
  /**
   * The most chromatic accessible base/hover/active surface sequence for that ink. In dark these rungs only gate the ink:
   * what paints is derived (`paint`, chooseTonalPair).
   */
  surface: { light: Level; dark: Level };
  surfaceHover: { light: Level; dark: Level };
  surfaceActive: { light: Level; dark: Level };
  /** What the rest, hover and pressed surfaces paint, per theme. */
  paint: { light: readonly [string, string, string]; dark: readonly [string, string, string] };
  /**
   * The ink each Tone contrast floor paints, per theme, keyed by `toneFloorId` ("450" is the default): solved between the
   * family's two nearest steps, not snapped to one (`solveInk`, 2026-11-02). `foreground` is the step it was solved from.
   */
  ink: { light: Readonly<Record<string, string>>; dark: Readonly<Record<string, string>> };
  /** The rest, hover and pressed paint at a Tone tint (curves.ts TONE_TINTS, percent of the ladder); `paint` at 100. */
  tint: (theme: Theme, tint: number) => readonly [string, string, string];
  /** The ink at a Tone tint and a Tone contrast floor (`toneFloorId`), solved on that tint's paint; `ink` at 100. */
  inkAt: (theme: Theme, tint: number, floor: string) => string;
}

export interface StrokeChoice {
  /** Raw palette stroke candidate, per theme. Semantic outlines use measured ink tints. */
  rest: { light: Level; dark: Level };
  /** Hover, one tier louder. */
  hover: { light: Level; dark: Level };
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
  stroke: StrokeChoice;
  tonal: TonalChoice;
  /** This theme's solid fill, resolved. */
  solidHex: string;
  /**
   * The Solid setting's steps (axes/accent.ts), this theme: the rung each step draws and its hover. A step the label
   * cannot clear on, at every Accent strength, moves toward the label's side to the first that can. Chromatic only; a
   * neutral's steps are its own solid.
   */
  /** Each Solid step: its fill and hover, the label it carries (black or white, `fg`) and Label tint's end on it. */
  solidSteps: Record<SolidStep, { level: Level; hover: Level; label: Level | null; fg: "#ffffff" | "#000000" }>;
  /** Label tint's end (axes/accent.ts) on this theme's own solid: see `tintedLabel`. */
  labelTint: Level | null;
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

/** A pressed accent Button: its hover moved this far toward black in OKLab (button.css `--_solid-active`). */
const SOLID_PRESS = 0.1;

export function buildScale(spec: ScaleSpec, theme: Theme): BuiltScale {
  const family = spec.family ?? familyFor(spec.id);
  if (!family) {
    throw new Error(
      `"${spec.id}" is not a family in the vendored palette. Known: ${Object.keys(FAMILIES).join(", ")}`,
    );
  }

  // Area's adjustments to the export: an optional hue rotation, a chroma trim that evens
  // the light end, and bounded lightness/chroma curves for the dark end. Neutral families
  // bypass this path because their palette anchors also define surface contrast.
  const rotation = HUE_ROTATION[spec.id] ?? 0;
  const trim = CHROMA_TRIM[spec.id] ?? spec.trim ?? 1;
  const drift = HUE_DRIFT[spec.id] ?? spec.drift;
  const familyPeakChroma = Math.max(...Object.values(family).map((rung) => rung.oklch.C));
  const familyPeakLevel = LEVELS.reduce(
    (peak, level) => family[String(level)]!.oklch.C > family[String(peak)]!.oklch.C ? level : peak,
    LEVELS[0],
  );

  const steps: ScaleStep[] = LEVELS.map((level) => {
    const rung = family[String(level)];
    if (!rung) throw new Error(`${spec.id} is missing rung ${level}.`);

    // Tapered trim at the light end; an explicit lift and ceiling at the dark end.
    const trimFactor = trim === 1 ? 1 : 1 - (1 - trim) * chromaTrimWeight(level);
    const turn = rotation + hueDrift(drift, level);
    const hue = (rung.oklch.H + turn + 360) % 360;
    const lightness = rung.oklch.L + (spec.kind === "chromatic" ? (DARK_LIGHTNESS_LIFT[level] ?? 0) : 0);
    const darkCap = DARK_CHROMA_CAP[level];
    const chroma = level >= 600 && level < 975 && spec.kind === "chromatic"
      ? Math.min(
          maxChromaAt(lightness, hue, SRGB),
          familyPeakChroma,
          darkCap === undefined ? Infinity : darkCap * lightness,
        )
      : Math.min(rung.oklch.C * trimFactor, maxChromaAt(lightness, hue, SRGB), familyPeakChroma);

    if (level === spec.exact || (turn === 0 && lightness === rung.oklch.L && chroma === rung.oklch.C)) {
      const oklch: Oklch = { L: rung.oklch.L, C: rung.oklch.C, h: rung.oklch.H };
      return { level, oklch, hex: rung.hex, oklchCss: toOklchCss(oklch), contrast: stepContrast(rung.hex) };
    }

    const mapped = gamutMap(
      { L: lightness, C: chroma, h: hue },
      SRGB,
    );
    const hex = toHex(mapped.rgb);
    return {
      level,
      oklch: mapped.oklch,
      hex,
      oklchCss: toOklchCss(mapped.oklch),
      contrast: stepContrast(hex),
    };
  });

  const vivid = { light: chooseVivid(steps, "light"), dark: chooseVivid(steps, "dark") };
  const tonal = chooseTonalPair(steps, spec.kind);
  const peakStep = steps.reduce((a, s) => (s.oklch.C > a.oklch.C ? s : a), steps[0]!);
  const peak = { level: peakStep.level, C: peakStep.oklch.C };
  const solid = spec.kind === "neutral"
    ? neutralSolid(steps)
    // Chroma refinement must not silently recategorize a palette family's established
    // solid-wall rung. Start the contrast walk from the export's own peak instead.
    : chooseSolid(steps, familyPeakLevel, spec.solidForeground ?? "light");
  const solidHex = steps.find((x) => x.level === solid.level[theme])!.hex;
  const solidSteps = Object.fromEntries(SOLID_STEPS.map(step => {
    if (spec.kind === "neutral") return [step, { level: solid.level[theme], hover: solid.hover[theme], label: null, fg: solid.foreground }];
    const at = solidAt(steps, step, solid.foreground, theme);
    return [step, { ...at, label: tintedLabel(steps, at.level, at.hover, at.fg) }];
  })) as BuiltScale["solidSteps"];
  const labelTint = spec.kind === "neutral" ? null : tintedLabel(steps, solid.level[theme], solid.hover[theme], solid.foreground);
  const stroke: StrokeChoice = {
    // The bars are the gate's own ambient and hover stroke tiers; see contrast/assertions.ts.
    rest: {
      light: quietestStroke(steps, "light", 1.3, 0),
      dark: quietestStroke(steps, "dark", 1.3, 0),
    },
    hover: {
      light: quietestStroke(steps, "light", 1.9, 15),
      dark: quietestStroke(steps, "dark", 1.9, 15),
    },
  };

  // Neutral tints (hover, pressed) must composite to their opaque twin over the page the
  // product actually renders, which in dark mode is the neutral's own page rung (900), not
  // black: solved against black, a 20% white hover painted brighter than the selected fill on
  // every dark surface. Chromatic alphas have no consumer and keep the pure-black reference.
  const pageRung = spec.kind === "neutral" && theme === "dark" ? steps.find((x) => x.level === 900)?.hex : undefined;
  const background = parseHex(pageRung ?? PAGE_BACKGROUND[theme]);
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
    hue: steps.find((s) => s.level === solid.level[theme])!.oklch.h,
    peak,
    steps,
    alphas,
    solid,
    stroke,
    tonal,
    vivid,
    contrast: { hex: solid.foreground, wcag: solid.wcag, apca: solid.apca },
    solidHex,
    solidSteps,
    labelTint,
  };
}

const TONAL_SURFACE_SEQUENCES: Record<Theme, readonly (readonly [Level, Level, Level])[]> = {
  light: [[25, 50, 75], [50, 75, 100], [75, 100, 150], [100, 150, 200]],
  dark: [[850, 800, 750], [800, 750, 700], [750, 700, 650], [700, 650, 600]],
};

/**
 * Pair tonal ink and surfaces by measurement rather than by a shared rung.
 *
 * Foreground chroma is the primary objective. Once the most chromatic readable ink is
 * known, the base/hover/active sequence with the greatest combined chroma wins. This is
 * deliberately pair-aware: a slightly quieter ground may admit substantially more colour
 * in the text, while every selected combination still clears AA and the dark APCA floor.
 *
 * The chosen rungs no longer paint in either mode (dark 2026-10-28, light 2026-11-02): the surfaces are the neutral
 * control fills' lightness in the family's light-end hue at DARK_TONAL_CHROMA or LIGHT_TONAL_CHROMA (curves.ts). In light
 * the ink is read on that paint. In dark it is still chosen against the rungs as well: for every named family the rungs
 * are the lighter, stricter ground, so the ink stays the one that was reviewed, and a dark, grey brand whose rungs sit
 * below the paint takes a lighter ink rather than failing on it.
 */
function chooseTonalPair(steps: readonly ScaleStep[], kind: ScaleKind): TonalChoice {
  const controls = [INVERSION.component, INVERSION.componentHover, INVERSION.componentActive];
  const byLevel = new Map(steps.map(step => [step.level, step]));
  const hexes = (levels: readonly Level[]) => levels.map(level => byLevel.get(level)!.hex) as unknown as readonly [string, string, string];
  if (kind === "neutral") {
    const levels = { light: controls.map(slot => slot.light as Level), dark: controls.map(slot => slot.dark as Level) };
    return {
      foreground: { light: INVERSION.textTonal.light as Level, dark: INVERSION.textTonal.dark as Level },
      surface: { light: levels.light[0]!, dark: levels.dark[0]! },
      surfaceHover: { light: levels.light[1]!, dark: levels.dark[1]! },
      surfaceActive: { light: levels.light[2]!, dark: levels.dark[2]! },
      paint: { light: hexes(levels.light), dark: hexes(levels.dark) },
      ink: {
        light: floorsOf(byLevel.get(INVERSION.textTonal.light as Level)!.hex),
        dark: floorsOf(byLevel.get(INVERSION.textTonal.dark as Level)!.hex),
      },
      tint: theme => hexes(levels[theme]),
      inkAt: theme => byLevel.get(INVERSION.textTonal[theme] as Level)!.hex,
    };
  }

  // The paint, in both modes: the neutral control fill's lightness at each state, in the family's light-end hue, at
  // LIGHT_TONAL_CHROMA or DARK_TONAL_CHROMA (curves.ts).
  // A muted family (brown) carries its share of a vivid one's colour (VIVID_PEAK_CHROMA).
  const tintHue = byLevel.get(TINT_HUE_LEVEL)!.oklch.h;
  const share = Math.min(1, Math.max(...steps.map(step => step.oklch.C)) / VIVID_PEAK_CHROMA);
  const paintOf = (theme: Theme, tint: number = DEFAULT_TONE_TINT) => controls.map((slot, i) => {
    const neutral = FAMILIES.neutral![String(slot[theme])]!.oklch;
    // In light the colour holds and the lightness gives way: near white sRGB holds little chroma at most hues (red, blue,
    // purple: 0.012 at the rest fill), so a tint sits as far under the fill's lightness as its chroma needs. Yellow and
    // green stay at the fill; red and blue settle near L 0.95. In dark the chroma gives way
    // instead: a lighter tint there takes the words' contrast (at Tone tint 160 yellow's rose to #524400 and its ink fell
    // to near white), so a tint keeps the fill's lightness and carries what sRGB shows there.
    const C = (theme === "light" ? LIGHT_TONAL_CHROMA : DARK_TONAL_CHROMA)[i]! * share * tint / 100;
    const L = theme === "light" ? holdingLightness(neutral.L, C, tintHue) : neutral.L;
    return toHex(gamutMap({ L, C: Math.min(C, maxChromaAt(L, tintHue, SRGB)), h: tintHue }, SRGB).rgb);
  }) as unknown as readonly [string, string, string];
  const lightPaint = paintOf("light"), darkPaint = paintOf("dark");

  const picked = {} as Record<Theme, { foreground: Level; surfaces: readonly [Level, Level, Level]; paint: readonly [string, string, string]; ink: Record<string, string> }>;
  const ambientOf = (theme: Theme) => [INVERSION.page, INVERSION.surface, INVERSION.subtle].map(slot => groundHex(slot[theme]));
  for (const theme of ["light", "dark"] as const) {
    const ambient = [INVERSION.page, INVERSION.surface, INVERSION.subtle].map(slot => groundHex(slot[theme]));
    let best: { foreground: ScaleStep; surfaces: readonly [Level, Level, Level]; surfaceChroma: number } | undefined;
    for (const surfaces of TONAL_SURFACE_SEQUENCES[theme]) {
      // Light inks read on what paints; dark ones on the rungs as well, the lighter, stricter ground there.
      const grounds = [...ambient, ...(theme === "light" ? lightPaint : [...hexes(surfaces), ...darkPaint])];
      for (const foreground of steps) {
        if (!inkReads(foreground.hex, grounds, ambient.length, theme, 4.5)) continue;
        const surfaceChroma = surfaces.reduce((sum, level) => sum + byLevel.get(level)!.oklch.C, 0);
        if (!best || foreground.oklch.C > best.foreground.oklch.C + 1e-9 ||
          (Math.abs(foreground.oklch.C - best.foreground.oklch.C) <= 1e-9 && surfaceChroma > best.surfaceChroma)) {
          best = { foreground, surfaces, surfaceChroma };
        }
      }
    }
    if (!best) throw new Error(`No accessible tonal foreground/surface pairing for ${theme}.`);
    // Each floor's ink on the grounds the default's surfaces give: the surfaces never move with Tone contrast.
    const grounds = [...ambient, ...(theme === "light" ? lightPaint : [...hexes(best.surfaces), ...darkPaint])];
    const ink = Object.fromEntries(TONE_FLOORS.map(floor => [toneFloorId(floor), solveInk(steps, grounds, ambient.length, theme, floor)]));
    picked[theme] = { foreground: best.foreground.level, surfaces: best.surfaces, paint: theme === "dark" ? darkPaint : lightPaint, ink };
  }

  return {
    foreground: { light: picked.light.foreground, dark: picked.dark.foreground },
    surface: { light: picked.light.surfaces[0], dark: picked.dark.surfaces[0] },
    surfaceHover: { light: picked.light.surfaces[1], dark: picked.dark.surfaces[1] },
    surfaceActive: { light: picked.light.surfaces[2], dark: picked.dark.surfaces[2] },
    paint: { light: picked.light.paint, dark: picked.dark.paint },
    ink: { light: picked.light.ink, dark: picked.dark.ink },
    // Other Tone tints, worked out when asked for: only the status and label tones' families ever are (axes/tone-tint.ts).
    tint: memo((theme: Theme, tint: number) => tint === DEFAULT_TONE_TINT ? picked[theme].paint : paintOf(theme, tint)),
    inkAt: memo((theme: Theme, tint: number, floor: string) => {
      if (tint === DEFAULT_TONE_TINT) return picked[theme].ink[floor]!;
      const ambient = ambientOf(theme), paint = theme === "light" ? paintOf("light", tint) : paintOf("dark", tint);
      const grounds = [...ambient, ...(theme === "light" ? paint : [...hexes(picked.dark.surfaces), ...paint])];
      return solveInk(steps, grounds, ambient.length, theme, Number(floor) / 100);
    }),
  };
}

/** A function remembered by its arguments. */
function memo<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const seen = new Map<string, R>();
  return (...args: A) => {
    const key = args.join("|");
    if (!seen.has(key)) seen.set(key, fn(...args));
    return seen.get(key)!;
  };
}

/** The lightness nearest a light `fill`, at or under it, where sRGB holds `chroma` at `hue`: the fill itself when it does. */
function holdingLightness(fill: number, chroma: number, hue: number): number {
  if (maxChromaAt(fill, hue, SRGB) >= chroma) return fill;
  let near = fill, far = fill - 0.2;
  for (let k = 0; k < 30; k++) { const mid = (near + far) / 2; if (maxChromaAt(mid, hue, SRGB) >= chroma) far = mid; else near = mid; }
  return far;
}

/** One colour at every floor: a neutral's ink, which Tone contrast never moves. */
const floorsOf = (hex: string) => Object.fromEntries(TONE_FLOORS.map(floor => [toneFloorId(floor), hex]));

/**
 * Whether an ink reads at a floor on every ground, at every Accent strength (color/generate.ts): the ink and its tints
 * quiet together; the neutral grounds (the first `ambient`) stay. In light the ink is also no brighter than the floor's
 * luminance bound (TONAL_Y at 4.5), which the Layers model darkens hued inks by on a gray page (layers.ts): every named
 * family's is, and a hue's generated family has to be too (2026-10-23). In dark it keeps the floor's APCA as well.
 */
function inkReads(hex: string, grounds: readonly string[], ambient: number, theme: Theme, floor: number): boolean {
  const bound = toneFloorY(floor), apca = toneFloorApca(floor);
  return ACCENT_STRENGTHS.every(strength => grounds.every((background, i) => {
    const ink = withStrength(hex, strength), ground = i < ambient ? background : withStrength(background, strength);
    return wcagContrastHex(ink, ground) >= floor && (theme === "light" ? relativeLuminance(parseHex(ink)) <= bound : apcaMagnitude(ink, ground) >= apca);
  }));
}

/**
 * A tone's ink at a floor, exact rather than snapped to a step (2026-11-02, owner: "Yes, start step 1" of solving roles
 * from hue and chroma). The most chromatic step that reads, then as far toward its neighbour on the ground's side (the
 * lighter step in light, the darker in dark) as still reads, along the family's own curve: lightness, hue and share of
 * the sRGB room each interpolated (place.ts `colourAt`), so the hue drift and chroma shape between the two steps hold.
 * A step's neighbour that reads with more colour would already have been chosen, so the search only crosses one gap.
 */
function solveInk(steps: readonly ScaleStep[], grounds: readonly string[], ambient: number, theme: Theme, floor: number): string {
  let best: ScaleStep | undefined;
  for (const step of steps) if (inkReads(step.hex, grounds, ambient, theme, floor) && (!best || step.oklch.C > best.oklch.C + 1e-9)) best = step;
  if (!best) throw new Error(`No ${theme} ink reads at ${floor}:1.`);
  const i = steps.indexOf(best), next = steps[theme === "light" ? i - 1 : i + 1];
  if (!next || next.oklch.C <= best.oklch.C) return best.hex;
  const share = (s: ScaleStep) => Math.min(1, s.oklch.C / Math.max(1e-6, maxChromaAt(s.oklch.L, s.oklch.h, SRGB)));
  const turn = ((next.oklch.h - best.oklch.h + 540) % 360) - 180;
  const at = (t: number) => t === 0 ? best!.hex : colourAt(
    (best!.oklch.h + turn * t + 360) % 360,
    best!.oklch.L + (next.oklch.L - best!.oklch.L) * t,
    share(best!) + (share(next) - share(best!)) * t,
  );
  let lo = 0, hi = 1;
  for (let k = 0; k < 18; k++) {
    const mid = (lo + hi) / 2;
    if (inkReads(at(mid), grounds, ambient, theme, floor)) lo = mid; else hi = mid;
  }
  return at(lo);
}

/**
 * A neutral family's solid: the near-black button, and its near-white twin in dark.
 *
 * Not something `chooseSolid` can find. It walks from peak chroma, and a neutral has none --
 * every rung is equally unsaturated, so the walk starts at whichever end the reduce happened
 * to land on and stops at the first rung that carries white, around 500. A mid grey is a
 * perfectly readable button and completely the wrong one.
 *
 * The rungs are `INVERSION.inverseFill`, so the primary button and `bg-inverse` cannot drift
 * apart -- they are the same decision, and one of them is allowed to be a button.
 */
function neutralSolid(steps: readonly ScaleStep[]): SolidChoice {
  const dark = steps.findIndex((s) => s.level === INVERSION.inverseFill.light);
  const light = steps.findIndex((s) => s.level === INVERSION.inverseFill.dark);
  const fg = "#ffffff";
  return {
    level: { light: steps[dark]!.level, dark: steps[light]!.level },
    // Away from the page in each theme. LEVELS runs lightest first, so a higher index is
    // darker: light deepens, dark lifts.
    hover: {
      light: steps.find((x) => x.level === INVERSION.inverseFillHover.light)!.level,
      dark: steps.find((x) => x.level === INVERSION.inverseFillHover.dark)!.level,
    },
    foreground: fg,
    wcag: Number(wcagContrastHex(fg, steps[dark]!.hex).toFixed(2)),
    apca: Number(apcaMagnitude(fg, steps[dark]!.hex).toFixed(1)),
    retreat: 0,
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
    level: { light: chosen.level, dark: chosen.level },
    // Prefer the page-relative direction; reverse it if the same label would fail.
    hover: {
      light: passes(steps[Math.min(steps.length - 1, index + 1)]!.hex) ? at(index + 1) : at(index - 1),
      dark: passes(steps[Math.max(0, index - 1)]!.hex) ? at(index - 1) : at(index + 1),
    },
    foreground: fg,
    wcag: Number(wcagContrastHex(fg, chosen.hex).toFixed(2)),
    apca: Number(apcaMagnitude(fg, chosen.hex).toFixed(1)),
    retreat: Math.abs(index - start),
  };
}

/**
 * A Solid step (axes/accent.ts): the rung itself, carrying whichever label clears on it at every Accent strength, the
 * accent's own (`fg`) first (owner, 2026-10-25: "let the accent's label flip between black and white with the shade, so
 * Shade runs from light to deep for every colour"). Where neither does, a mid-tone, the first rung toward the own label's
 * side that carries it (darker for white, lighter for black), as every step did before the flip, when a light blue under
 * a white label slid to 550 and every orange to its one shade. Its hover follows `chooseSolid`'s rule for that label:
 * away from the page (darker in light, lighter in dark) when the label still clears there, else the other way.
 */
function solidAt(steps: readonly ScaleStep[], step: SolidStep, own: "#ffffff" | "#000000", theme: Theme): { level: Level; hover: Level; fg: "#ffffff" | "#000000" } {
  const passes = (hex: string, fg: string) => ACCENT_STRENGTHS.every(strength => {
    const paint = withStrength(hex, strength);
    return wcagContrastHex(fg, paint) >= SOLID_CONTRAST_TARGET && apcaMagnitude(fg, paint) >= SOLID_APCA_TARGET;
  });
  const other = own === "#ffffff" ? "#000000" : "#ffffff";
  const start = steps.findIndex(s => s.level === step);
  let index = start, fg: "#ffffff" | "#000000" = own;
  if (!passes(steps[start]!.hex, own) && passes(steps[start]!.hex, other)) fg = other;
  else {
    const direction = own === "#ffffff" ? 1 : -1;
    while (index >= 0 && index < steps.length && !passes(steps[index]!.hex, own)) index += direction;
    if (index < 0 || index >= steps.length) index = start;
  }
  const at = (i: number) => steps[Math.min(steps.length - 1, Math.max(0, i))]!;
  const away = theme === "light" ? index + 1 : index - 1, back = theme === "light" ? index - 1 : index + 1;
  return { level: steps[index]!.level, hover: passes(at(away).hex, fg) ? at(away).level : at(back).level, fg };
}

/**
 * Label tint's end (axes/accent.ts, owner 2026-10-23: "the foreground being a lighter version of that color with some
 * slight hue, while still being accessible"): the most coloured rung on the label's side (the light end for a white
 * label, the dark end for black) that still carries the label's contract on the fill, its hover and its press (the hover
 * 10% toward black in OKLab, button.css) at every Accent strength, the fill and the label quieted together (the press
 * joined 2026-10-23: a lime label at 4 in dark measured 4.21:1 pressed). Null where no rung does (a bright fill white only just clears, as
 * blue's 500 at 4.66:1): the label stays as it is. Label tint mixes the label toward this rung in quarters.
 */
function tintedLabel(steps: readonly ScaleStep[], fill: Level, hover: Level, fg: "#ffffff" | "#000000"): Level | null {
  const byLevel = new Map(steps.map(step => [step.level, step.hex]));
  const order = fg === "#ffffff" ? steps : [...steps].reverse();
  let found: Level | null = null;
  for (const step of order) {
    const clears = ACCENT_STRENGTHS.every(strength => {
      const ink = withStrength(step.hex, strength), quiet = (level: Level) => withStrength(byLevel.get(level)!, strength);
      return [quiet(fill), quiet(hover), mixOklab(quiet(hover), "#000000", SOLID_PRESS)].every(ground =>
        wcagContrastHex(ink, ground) >= SOLID_CONTRAST_TARGET && apcaMagnitude(ink, ground) >= SOLID_APCA_TARGET);
    });
    if (!clears) break;
    found = step.level;
  }
  return found;
}

/**
 * The most saturated rung of a family that is still readable as body text.
 *
 * Chroma peaks in the middle of every ramp and falls away toward both ends, so the most
 * colourful legible text is the rung closest to the page *before* contrast runs out.
 * Walking outward from 500 and stopping at the first pass finds it.
 *
 * The walk measures against the code block's actual ground. Light walks darker from
 * 500 until AA clears with a margin; dark walks lighter and also clears Area's APCA
 * content floor. No hue is pinned to an unreadable rung or covered by a syntax waiver.
 */
function chooseVivid(steps: readonly ScaleStep[], theme: Theme): Level {
  // Measured against the block's own ground.
  const page = groundHex(INVERSION.code[theme]);
  const start = steps.findIndex((s) => s.level === 500);
  // Dark needs lighter text; light needs darker text.
  const direction = theme === "light" ? 1 : -1;
  // Both standards, as everywhere else. WCAG alone let six families through in dark mode
  // at APCA Lc 41-46 against a floor of 60 -- the exact overstatement near black that is
  // the reason this system gates on APCA in dark themes at all.
  for (let i = start; i >= 0 && i < steps.length; i += direction) {
    const hex = steps[i]!.hex;
    if (wcagContrastHex(hex, page) >= 4.6 && (theme === "light" || apcaMagnitude(hex, page) >= 61)) return steps[i]!.level;
  }
  return steps[start]!.level;
}

/**
 * The quietest rung whose stroke still reads against the surface it is drawn on.
 *
 * Per family, not per ladder position, and that is the whole point. A rung is a lightness and
 * hues do not share a luminance at one: at rung 400 an indigo stroke measured 3.68:1 on white
 * while a green one measured 1.80 -- the same token, twice the weight, and the loud end two
 * and a half times heavier than the neutral outline beside it. Walking each family to its own
 * quietest passing rung lands all eleven between 1.30 and 1.45, which is what "the same
 * stroke" means in luminance. These remain raw-ramp diagnostics; semantic/stroke.ts
 * additionally controls chroma, because equal luminance did not make green/teal quiet.
 *
 * This is the inverse of the rule foregrounds follow. There a shared rung is right, because
 * the goal is comparable *chroma*; here the goal is comparable *weight*, and a shared rung
 * cannot deliver it.
 */
function quietestStroke(
  steps: readonly ScaleStep[],
  theme: Theme,
  bar: number,
  apcaBar: number,
): Level {
  const ground = groundHex(INVERSION.surface[theme]);
  // Quiet means close to the surface: the lightest rung in light, the darkest in dark.
  const order = theme === "light" ? steps : [...steps].reverse();
  // Both standards, as everywhere else. WCAG alone put every dark hover stroke at APCA
  // Lc 13 against a floor of 15 -- the near-black overstatement APCA exists to catch.
  const found = order.find(
    (s) => wcagContrastHex(s.hex, ground) >= bar && apcaMagnitude(s.hex, ground) >= apcaBar,
  );
  return (found ?? order[order.length - 1]!).level;
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
    const rung = familyFor(scale.id)![String(step.level)]!;
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
