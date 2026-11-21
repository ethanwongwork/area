/**
 * The colour group swept as one product (plan A1–A3, docs/research/system-status-2026-11-18/README.md): every setting
 * that changes a colour the contrast gate measures, crossed together, where the gate (contrast.test.ts), the accent test
 * and the tone-floor test each hold Layers at its default and move one setting at a time. Test code only.
 *
 *   mode × neutral × accent (a representative set) × Accent strength (100 / 60 / 30) × Status colours (fixed / match)
 *   × Tone contrast (4.5, 3, 2.5) × Tone tint (0 / 100 / 160) × ground and Layers (the default and the four extremes)
 *
 * Each combination is resolved by the gate's own model (semantic/resolve.ts `resolveTheme`), with the one thing the
 * static resolver leaves to the CSS put back: on a light gray page the hued inks mix toward black by the page's darken
 * (color/layers.ts HUED_INKS; `layer-light-vivid-darken`, `-tonal-darken`, `-floor-darken`), worked out exactly as
 * layers.test.ts and tone-floor.test.ts model it (`tintedDarken`, `toneFloorDarken`, `mixOklab`). Without it light text
 * on a gray page would measure the undarkened rung and fail where the CSS does not.
 *
 * Not modelled: Contrast (`--area-contrast-more`, outside the static resolver; at any raised level every tone returns
 * to 4.5 and every edge moves toward its strong stroke), Edge contrast other than its default, the fill settings other
 * than their defaults, Card tone, Tint and the accent hues past the set below (accents.test.ts sweeps those at the
 * default Layers).
 */
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { ASSERTIONS, type ContrastAssertion } from "../contrast/assertions.ts";
import {
  DEFAULT_LAYER_SELECTION, FILL_STEPS, FLOOR_ROLES, HOLD, HUED_INKS, TONAL_Y, VIVID_ROLES, VIVID_Y, castChroma, castOf, heldSelectedHex, holdDark,
  holdLight, holdMargin, layerLightness, tintedDarken, toneFloorApca, toneFloorDarken, type Cast, type LayerSelection, type ToneFloor,
} from "../color/layers.ts";
import { SEMANTIC_ALIASES } from "../semantic/aliases.ts";
import { MIN, alphaOver, mixOklab } from "../color/layer-checks.ts";
import { NEUTRAL_SCALES } from "../color/presets.ts";
import { type Oklab, type Rgb, SRGB, clampRgb, deltaEOk, oklchToRgb, parseHex, rgbToOklab } from "../color/oklab.ts";
import { HUE_TONE, LABEL_HUES } from "../semantic/hues.ts";
import { resolveTheme, scaleFor } from "../semantic/resolve.ts";
import { darkWashAlphas } from "../emit/base.ts";
import { STROKE_GROUPS, STROKE_GROUP_STEP } from "../axes/stroke-groups.ts";
import type { Combo, Failure } from "./ratchet.ts";

export const THEMES = ["light", "dark"] as const;
export const NEUTRALS = NEUTRAL_SCALES.map(s => s.id);
/** Blue (the default), the two accents nearest white in light (yellow, lime) and a generated hue (90°, an olive). */
export const ACCENTS = ["blue", "yellow", "lime", "90"] as const;
export const STRENGTHS = [100, 60, 30] as const;
export const STATUS = ["fixed", "match"] as const;
/** Tone contrast: the default (also the highest), a middle step and the lowest. */
export const FLOORS = [4.5, 3, 2.5] as const satisfies readonly ToneFloor[];
export const TINTS = [0, 100, 160] as const;
/** Ground and Layers per mode: the default, then each ground extreme at each Layers extreme. */
export const LAYERS: Record<"light" | "dark", ReadonlyArray<{ ground: number; layers: number }>> = {
  light: [{ ground: 100, layers: 4 }, { ground: 100, layers: 0 }, { ground: 100, layers: 8 }, { ground: 90, layers: 0 }, { ground: 90, layers: 8 }],
  dark: [{ ground: 8, layers: 0 }, { ground: 0, layers: 0 }, { ground: 0, layers: 8 }, { ground: 24, layers: 0 }, { ground: 24, layers: 8 }],
};

export interface ColourCombo {
  theme: "light" | "dark"; neutral: string; accent: string; strength: number; status: "fixed" | "match";
  floor: ToneFloor; tint: number; ground: number; layers: number;
}

/** Every combination, Match at 100 left out (it is Fixed). */
export function* colourCombos(): Generator<ColourCombo> {
  for (const theme of THEMES) for (const neutral of NEUTRALS) for (const accent of ACCENTS) for (const strength of STRENGTHS)
    for (const status of STATUS) for (const floor of FLOORS) for (const tint of TINTS) for (const { ground, layers } of LAYERS[theme]) {
      if (status === "match" && strength === 100) continue;
      yield { theme, neutral, accent, strength, status, floor, tint, ground, layers };
    }
}

const layerSelection = (c: { theme: "light" | "dark"; ground: number; layers: number }): LayerSelection =>
  c.theme === "light" ? { ...DEFAULT_LAYER_SELECTION, groundLight: c.ground, layersLight: c.layers } : { ...DEFAULT_LAYER_SELECTION, groundDark: c.ground, layersDark: c.layers };

const castCache = new Map<string, { light: { chroma: number; hue: number }; dark: { chroma: number; hue: number } }>();
const castFor = (neutral: string) => {
  let cast = castCache.get(neutral);
  if (!cast) {
    const at = (t: "light" | "dark", level: number) => scaleFor(neutral, t).steps.find(s => s.level === level)!.hex;
    castCache.set(neutral, cast = castOf(at("light", 50), at("dark", 900)));
  }
  return cast;
};

/** The three darkens the CSS applies to the light hued inks on this page (all 0 on white, by layers.test.ts). */
export function lightDarkens(c: ColourCombo): { vivid: number; tonal: number; floor: number } {
  if (c.theme !== "light") return { vivid: 0, tonal: 0, floor: 0 };
  const m = layerLightness("light", c.ground, c.layers), chroma = castFor(c.neutral).light.chroma;
  const deepest = Math.min(m.recessed, m.card, m.tile, m.well);
  return {
    vivid: tintedDarken(Math.min(m.page, m.card), chroma, VIVID_Y),
    tonal: tintedDarken(deepest, chroma, TONAL_Y),
    floor: toneFloorDarken(deepest, c.floor, chroma),
  };
}

/** The tone and hue outlines the axes write as rungs (emit/base.ts holds each on the ground, color/layers.ts HOLD). */
const STROKES = Object.entries(SEMANTIC_ALIASES).filter(([, a]) => a.kind === "stroke" || a.kind === "strokeHover").map(([name, a]) => ({ name, hover: a.kind === "strokeHover" }));

/** The ground the held colours are solved on for one combination (color/layers.ts HOLD), with its tint margin, and the code ground. */
export function holdGrounds(c: { theme: "light" | "dark"; neutral: string; ground: number; layers: number }): { hold: number; code: number } {
  const m = layerLightness(c.theme, c.ground, c.layers), margin = holdMargin(castFor(c.neutral)[c.theme].chroma), sign = c.theme === "light" ? -1 : 1;
  return { hold: m.hold + sign * margin, code: m.code + sign * margin };
}

/**
 * The tokens the browser paints for one combination: the resolver's, with the light hued inks darkened as the CSS does,
 * and the tone outlines, the light marks and the dark vivid inks held on the ground as the CSS holds them (HOLD).
 */
export function paintedTokens(c: ColourCombo): Record<string, string> {
  const tokens = { ...resolveTheme({
    theme: c.theme, neutral: c.neutral, accent: c.accent, accentStrength: c.strength, statusColours: c.status,
    toneFloor: c.floor, toneTint: c.tint as 0 | 100 | 160, layers: layerSelection(c),
  }).tokens };
  const { hold, code } = holdGrounds(c);
  for (const { name, hover } of STROKES) tokens[name] = c.theme === "light"
    ? holdLight(tokens[name]!, hold, hover ? HOLD.light.strokeHover : HOLD.light.stroke)
    : holdDark(tokens[name]!, hold, hover ? HOLD.dark.strokeHover : HOLD.dark.stroke, hover ? HOLD.dark.strokeHoverApca : undefined);
  // A hue's outline is its tone's (semantic/hues.ts `hue-<hue>-border: var(--area-<tone>-border)`; gray's is the control edge).
  for (const hue of LABEL_HUES) if (hue !== "neutral" && hue !== "gray") tokens[`hue-${hue}-border`] = tokens[`${HUE_TONE[hue]}-border`]!;
  if (c.theme === "light") {
    const d = lightDarkens(c);
    for (const { token, darken } of HUED_INKS) if (d[darken] > 0) tokens[token] = mixOklab(tokens[token]!, "black", d[darken]);
    // A hue's words are its tone's ink (semantic/hues.ts `hue-<hue>-text: var(--area-fg-<tone>)`), so they darken with it.
    for (const hue of LABEL_HUES) if (hue !== "neutral") tokens[`hue-${hue}-text`] = tokens[`fg-${HUE_TONE[hue]}`]!;
    // A hue's icon is its tone's mark (`fg-<tone>-mark`, a palette rung in light), held at 3:1 on the deepest ground.
    for (const hue of LABEL_HUES) if (hue !== "neutral") tokens[`hue-${hue}-icon`] = holdLight(tokens[`hue-${hue}-icon`]!, hold, HOLD.light.mark);
  } else {
    for (const role of VIVID_ROLES) tokens[`fg-${role}-vivid`] = holdDark(tokens[`fg-${role}-vivid`]!, code, HOLD.dark.vivid, HOLD.dark.vividApca);
  }
  return tokens;
}

/** The tone (if any) whose words follow Tone contrast: `fg-<role>` and the label hues painted from one. */
function floorRole(fg: string): string | undefined {
  const hue = /^hue-([a-z]+)-text$/.exec(fg)?.[1];
  const role = hue ? HUE_TONE[hue as keyof typeof HUE_TONE] : /^fg-([a-z]+)$/.exec(fg)?.[1];
  return role && (FLOOR_ROLES as readonly string[]).includes(role) ? role : undefined;
}

/**
 * The floor a pairing is held to: the assertion's, except that a floor tone's words are held to the Tone contrast floor
 * where it is lower (docs/CONTRAST.md, "Tone contrast": the gate follows the floor; Lc 60 at 4.5, 8 less per point).
 */
export function floorsOf(a: ContrastAssertion, floor: ToneFloor): { wcag: number; apca: number } {
  if (!floorRole(a.fg) || floor >= 4.5) return { wcag: a.wcag, apca: a.apca };
  return { wcag: Math.min(a.wcag, floor), apca: Math.min(a.apca, toneFloorApca(floor)) };
}

const HEX = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;
const opaque = (hex: string) => hex.length === 7;

/** The tone and hue strokes and the hue icons, on every ground a page can put them on (plan A3). */
const STROKE_GROUNDS = ["bg-page", "bg-surface", "bg-subtle", "bg-card", "bg-tile", "bg-well", "bg-float"] as const;
const assertionFloor = (fg: string, bg: string) => {
  const a = ASSERTIONS.find(x => x.fg === fg && x.bg === bg);
  if (!a) throw new Error(`No assertion ${fg} on ${bg} to take a floor from`);
  return a;
};
/** Each extra pairing borrows the floor its own assertion on bg-surface (or bg-page, for icons) declares. */
export const GROUND_PAIRS: ReadonlyArray<{ fg: string; bg: string; floor: ContrastAssertion }> = (() => {
  const out: Array<{ fg: string; bg: string; floor: ContrastAssertion }> = [];
  const declared = new Set(ASSERTIONS.map(a => `${a.fg}|${a.bg}`));
  const strokes = ASSERTIONS.filter(a => a.bg === "bg-surface" && /-border(-strong)?$/.test(a.fg) && (/^hue-/.test(a.fg) || !/^border/.test(a.fg)));
  const icons = ASSERTIONS.filter(a => a.bg === "bg-page" && /^hue-[a-z]+-icon$/.test(a.fg));
  for (const a of [...strokes, ...icons]) for (const bg of STROKE_GROUNDS) {
    if (declared.has(`${a.fg}|${bg}`)) continue;
    out.push({ fg: a.fg, bg, floor: assertionFloor(a.fg, a.bg) });
  }
  return out;
})();

/** Every check on one combination: the declared pairings, the extra grounds, and well-formed values. */
export function colourFailures(c: ColourCombo, tokens: Record<string, string> = paintedTokens(c)): Failure[] {
  const combo: Combo = { ...c };
  const out: Failure[] = [];
  for (const [name, value] of Object.entries(tokens)) {
    if (typeof value !== "string" || /NaN|Infinity|undefined/.test(value) || (value.startsWith("#") && !HEX.test(value)))
      out.push({ rule: "well-formed colour", combo, value: 0, floor: 0, detail: `${name} = ${value}` });
  }
  const measure = (fg: string, bg: string, floors: { wcag: number; apca: number }) => {
    const f = tokens[fg], b = tokens[bg];
    if (!f || !b) { out.push({ rule: `missing token ${!f ? fg : bg}`, combo, value: 0, floor: 0 }); return; }
    if (!opaque(f) || !opaque(b)) { out.push({ rule: `translucent pairing ${fg} on ${bg}`, combo, value: 0, floor: 0 }); return; }
    const w = wcagContrastHex(f, b);
    if (w < floors.wcag - 1e-9) out.push({ rule: `WCAG ${fg} on ${bg}`, combo, value: w, floor: floors.wcag, detail: `${f} on ${b}` });
    if (c.theme === "dark" && floors.apca > 0) {
      const lc = apcaMagnitude(f, b);
      if (lc < floors.apca - 1e-9) out.push({ rule: `APCA ${fg} on ${bg}`, combo, value: lc, floor: floors.apca, detail: `${f} on ${b}` });
    }
  };
  for (const a of ASSERTIONS) measure(a.fg, a.bg, floorsOf(a, c.floor));
  for (const p of GROUND_PAIRS) measure(p.fg, p.bg, floorsOf(p.floor, c.floor));
  return out;
}

// ---------------------------------------------------------------------------
// State distance (plan A3: "selected differs from hover at every strength")
// ---------------------------------------------------------------------------

/**
 * The smallest step a state shows, per mode: the Layers gate's hover step (color/layer-checks.ts `MIN`, "the smallest
 * steps Area ships today that read"; light 0.009, dark 0.035 in OKLab lightness). Applied as ΔE OK, which equals the
 * lightness step for two greys and also counts a hue or chroma difference. CSS Color 4's JND (color/oklab.ts, 0.02) is
 * not used: the shipped light hover step (about 0.012) is under it by design.
 */
export const STATE_STEP = { light: MIN.light.hover, dark: MIN.dark.hover } as const;

/** Each ground a plate sits on, by its name in the Layers model (color/layers.ts `layerLightness`). */
export const PLATE_GROUNDS = ["page", "raised", "recessed", "card", "tile", "frame", "frameRaised", "well", "float"] as const;

const lab = (hex: string) => rgbToOklab(parseHex(hex), SRGB);
const fmt = (c: Oklab) => `L ${c.L.toFixed(4)} a ${c.a.toFixed(4)} b ${c.b.toFixed(4)}`;

/** A Layers lightness as the CSS paints it (oklch with the cast's chroma, as `layerHex`), unrounded: the Layers gate
 * measures its steps in the model's numbers too, so an 8-bit rounding never reads as a missing step. */
const plateLab = (theme: "light" | "dark", L: number, cast: Cast): Oklab => rgbToOklab(clampRgb(oklchToRgb({ L, C: castChroma(theme, L, cast), h: cast.hue }, SRGB)), SRGB);

/** A translucent wash over an opaque ground, composited in sRGB as the browser does, unrounded. */
const washLab = (rgb: Rgb, alpha: number, ground: Rgb): Oklab => rgbToOklab(ground.map((g, i) => rgb[i]! * alpha + g * (1 - alpha)) as Rgb, SRGB);

/** The translucent hover and pressed washes at the default fills (emit/base.ts `bg-hover`, `bg-pressed`), over a ground. */
function washes(theme: "light" | "dark", ground: Rgb): { hover: Oklab; pressed: Oklab } {
  const h = FILL_STEPS.hover.default, s = FILL_STEPS.selected.default, p = FILL_STEPS.pressed.default;
  if (theme === "light") {
    const step = Math.max(1.25, 1.5 + 0.375 * (h - 2));
    return { hover: washLab(parseHex("#141414"), 0.05 * step / 1.5, ground), pressed: washLab([0, 0, 0], 0.07 * (step + 0.625 * s) / 2.125 + 0.01375 * p, ground) };
  }
  const a = darkWashAlphas(h, s, p);
  return { hover: washLab([1, 1, 1], a.hover, ground), pressed: washLab(parseHex("#fcfcfc"), a.pressed, ground) };
}

/**
 * Rest, hover, selected and pressed plates read apart on every ground: the opaque fills at Selection Neutral (the
 * ground's selected fill) and Selection Accent (emit/base.ts `selection-surface-<ground>`: the selected fill mixed all
 * the way to `accent-surface`, so it is `accent-surface` on every ground), and the pressed wash past the hover wash.
 */
export function stateFailures(c: ColourCombo, tokens: Record<string, string>): Failure[] {
  const out: Failure[] = [], min = STATE_STEP[c.theme], sign = c.theme === "light" ? -1 : 1;
  const m = layerLightness(c.theme, c.ground, c.layers), cast = castFor(c.neutral)[c.theme];
  const accentHex = tokens["accent-surface"]!;
  const base = { theme: c.theme, neutral: c.neutral, accent: c.accent, strength: c.strength, ground: c.ground, layers: c.layers };
  for (const plate of PLATE_GROUNDS) {
    const [restL, hoverL, activeL] = m.fill[plate];
    const rest = plateLab(c.theme, restL, cast), hover = plateLab(c.theme, hoverL, cast), active = plateLab(c.theme, activeL, cast);
    const at = (selection: string): Combo => ({ ...base, plate, selection });
    const check = (rule: string, a: Oklab, b: Oklab, combo: Combo) => {
      const d = deltaEOk(a, b);
      if (d < min - 1e-9) out.push({ rule, combo, value: d, floor: min, detail: `${fmt(a)} vs ${fmt(b)}` });
    };
    check("hover differs from rest", hover, rest, at("any"));
    if (sign * (hoverL - restL) <= 0) out.push({ rule: "hover is past rest", combo: at("any"), value: hoverL - restL, floor: 0 });
    check("selected differs from hover", active, hover, at("neutral"));
    if (sign * (activeL - hoverL) <= 0) out.push({ rule: "selected is past hover", combo: at("neutral"), value: activeL - hoverL, floor: 0 });
    // Selection Accent's plate on this ground: the accent surface held a state step from the hover plate (SELECTED_STEP).
    check("selected differs from hover", lab(heldSelectedHex(c.theme, accentHex, hoverL, cast)), hover, at("accent"));
    const ground = clampRgb(oklchToRgb({ L: m[plate], C: castChroma(c.theme, m[plate], cast), h: cast.hue }, SRGB));
    const w = washes(c.theme, ground);
    check("pressed differs from hover", w.pressed, w.hover, at("any"));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Edge groups at the default Edge contrast (finding 8)
// ---------------------------------------------------------------------------

/** The container tier (contrast/assertions.ts STROKE.faint, 1.2), read from its own assertion. */
export const CONTAINER_TIER = assertionFloor("border-faint", "bg-surface").wcag;

/**
 * Each stroke group's edge at its default amount and the default Edge contrast (axes/stroke-groups.ts: the text colour at
 * amount × 2.5% over the ground, mixed in sRGB) against the container tier, on the page, surface and subtle grounds.
 * In dark the floating group draws the brighter of this and the Shadow rim, so this is its lower bound.
 */
export function edgeGroupFailures(c: ColourCombo, tokens: Record<string, string>): Failure[] {
  const out: Failure[] = [];
  for (const group of STROKE_GROUPS) for (const bg of ["bg-page", "bg-surface", "bg-subtle"]) {
    const ground = tokens[bg]!, edge = alphaOver(tokens["fg-default"]!, group.amount * STROKE_GROUP_STEP / 100, ground), w = wcagContrastHex(edge, ground);
    if (w < CONTAINER_TIER - 1e-9) out.push({ rule: `edge group ${group.id} on ${bg}`, combo: { theme: c.theme, neutral: c.neutral, ground: c.ground, layers: c.layers }, value: w, floor: CONTAINER_TIER, detail: `${edge} on ${ground}` });
  }
  return out;
}

/** The whole colour sweep: every combination's failures, and how much was measured. */
export function runColourSweep(): { colour: Failure[]; state: Failure[]; edges: Failure[]; combos: number; pairs: number } {
  const colour: Failure[] = [], state: Failure[] = [], edges: Failure[] = [];
  let combos = 0;
  for (const c of colourCombos()) {
    combos++;
    const tokens = paintedTokens(c);
    colour.push(...colourFailures(c, tokens));
    // The plates depend only on mode, neutral, accent, strength and Layers: once per those.
    if (c.status === "fixed" && c.floor === 4.5 && c.tint === 100) state.push(...stateFailures(c, tokens));
    if (c.accent === "blue" && c.strength === 100 && c.status === "fixed" && c.floor === 4.5 && c.tint === 100) edges.push(...edgeGroupFailures(c, tokens));
  }
  return { colour, state, edges, combos, pairs: combos * (ASSERTIONS.length + GROUND_PAIRS.length) };
}
