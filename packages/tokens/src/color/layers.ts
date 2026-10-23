/**
 * Layers: the page's tone and the tones of what sits on it, from three numbers.
 *
 * The owner asked (2026-10-16) for a setting for the page and the layers on it: a white or gray page, white or gray
 * layers, a blackout or a lighter dark, in fine steps, every combination usable. Research, the reference values and
 * the review page: docs/research/layers-2026-10-16/.
 *
 *   ground-light  the light page's OKLCH lightness, 1 (white) to 0.90 in 0.01 steps.
 *   ground-dark   the dark page's lightness: 0 (black), 0.085 (Area's near-black, the default), 0.12 to 0.24.
 *   layers-light  layer contrast in light, 0 (Flat) to 8, 4 the default: how far raised layers (cards, menus,
 *                 dialogs) and recessed ones (sidebars, wells) sit from the page, and a control's fill from its ground.
 *   layers-dark   the same in dark. One setting per theme since 2026-10-17 (owner: "save all the layer picks for the
 *                 most possible customization"); each theme's formulas read only its own.
 *
 * Every tone is an OKLCH lightness derived from those numbers, tinted by the Neutral setting's hue and chroma. The
 * neutral ramp is unchanged: text, borders, fills and the hues keep their named steps; only these roles are computed.
 * The same formulas are written twice, here as numbers (the contrast gate and the tests resolve them) and in
 * `layerCss()` as CSS (what ships, live, so a subtree that sets its own ground re-derives). layers.test.ts proves the
 * two agree and that every combination keeps text readable and controls, frames and selection visible.
 */
import { type Rgb, oklchToRgb, rgbToOklab, labToLch, parseHex, SRGB, toHex, clampRgb } from "./oklab.ts";

// ---------------------------------------------------------------------------
// The settings
// ---------------------------------------------------------------------------

/** Light grounds, 100 (white) to 90, as OKLCH lightness. */
export const GROUND_LIGHT_STEPS = [100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90] as const;
/** Dark grounds: 0 (black), 8 (Area's near-black, #020202), then 12 to 24. Below 12 a 1% step doesn't show. */
export const GROUND_DARK_STEPS = [0, 8, 12, 14, 16, 18, 20, 22, 24] as const;
/** Five steps (owner, 2026-10-22: "maybe 5 would do"; was 0 to 8 in ones): Flat, the default 4 and the strongest 8 keep
 * their values, so each number still means the same distance. */
export const LAYER_STEPS = [0, 2, 4, 6, 8] as const;
export const DEFAULT_GROUND_LIGHT = 100;
export const DEFAULT_GROUND_DARK = 8;
export const DEFAULT_LAYERS = 4;

/**
 * Tint (axes/tint.ts, owner 2026-10-22): a hue in 5° steps, a strength per mode in steps of 0.005 OKLCH chroma (8 = 0.04,
 * the most sRGB shows on every hue from a 95 page down: docs/research/custom-neutral-2026-10-22/gamut.ts), and the share
 * of it text takes, in quarters. Auto, each tint setting's default, follows the Neutral setting's own cast.
 */
export const TINT_HUES = Array.from({ length: 72 }, (_, i) => i * 5);
export const TINT_STEP = 0.005;
export const TINT_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export const INK_TINT_STEPS = [0, 1, 2, 3, 4] as const;
export const DEFAULT_INK_TINT = 2;
/**
 * Text moves this share of the tint's strength away from its ground (darker in light, lighter in dark). The inks are solved
 * for lightness as if every colour were gray, and muted sits at 4.5:1; at the same OKLCH lightness a tint changes a
 * colour's luminance (cyans and blues up, reds the surfaces' the other way), so without it a 0.005 tint tipped muted text
 * under 4.5:1 on some hues. 0.25 passes every hue to 0.08 in both modes at every text share; at 0.04 it is 0.01 L
 * (docs/research/custom-neutral-2026-10-22/sweep.ts). It is 0 for an untinted gray, so Neutral is unchanged.
 */
export const INK_MARGIN = 0.25;

/**
 * Card tone (axes/card-tone.ts, owner 2026-10-22: "choose the option of making these containers/cards match the background
 * or making them slightly different, lighter or darker"): per mode, Auto (each container's own tone: a Card raised, an
 * Asset card recessed) or a step from the page, −4 (darker) to +4 (lighter), clamped at white and black. A light step is
 * 0.012 L (−3 on white is #f3f3f3, the gallery tiles of the owner's reference); a dark one 0.03 (small steps near black
 * do not show). Two tones read it: `card` (Card, Auto = raised) and `tile` (Asset card, Auto = recessed).
 */
export const CARD_TONE_STEPS = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;
export const CARD_TONE_UNIT = { light: 0.012, dark: 0.03 } as const;
export type CardTone = number | "auto";

/** A ground step's lightness. 8 is the neutral ramp's 975 (#020202), today's dark page. */
export const groundLightness = (theme: "light" | "dark", step: number) => theme === "dark" && step === 8 ? 0.0847 : step / 100;

// ---------------------------------------------------------------------------
// The constants. Every one traces to Area today or to the references (docs/research/layers-2026-10-16/README.md).
// ---------------------------------------------------------------------------

/** Per contrast step. Light: recessed 0.006 darker; raised lifts 0.009 toward white, on a gray page only (Carbon's
 * Gray 10, Apple's grouped). Dark: raised 0.015 lighter, recessed half. At 4: light 0.024 / 0.036, dark 0.06 / 0.03. */
export const LAYER_PER_STEP = { light: { recessed: 0.006, raised: 0.009 }, dark: { recessed: 0.0075, raised: 0.015 } } as const;
/** A control's step from its ground: 0.018 (light) or 0.04 (dark) at Flat, 0.0015 more a step; 4 is today's 0.024 /
 * 0.046 (light 50 / 75 / 100 on white; dark 800 / 750 / 700 on 850). */
export const CONTROL_STEP = { light: { base: 0.018, perStep: 0.0015 }, dark: { base: 0.04, perStep: 0.0015 } } as const;
/**
 * The state fills as three settings (axes/states.ts, owner 2026-10-21: "darkness scales for hover selected and pressed"),
 * each a whole number, each built on the one before so the order always holds: hover, then selected one step past it
 * (so a selected row shows under the pointer), then pressed past that. In multiples of the Layers step `s`:
 *
 *   hover     1 to 4 (2: today's 1.5 s, #f3f3f3 on white). Light 1.25, 1.5, 1.875, 2.25 s: always past a soft field's
 *             rest fill (s), so a hovered field never lightens; dark s / 2 a step over the rest fill
 *   selected  past hover by 0.625 s a step (light) or s (dark), 0 to 4 (1: today's #eeeeee; 0 paints hover's plate, as
 *             Notion and ChatGPT do)
 *   pressed   a quarter of the way a step from the selected fill to the firmest press, 1 to 4 (4, the owner's pick): the
 *             selected fill moved 12% toward the ink in light (ChatGPT's), 14% in dark, stopped where muted text keeps
 *             4.6:1 (styles/layers.css), so each step is its own plate on every ground
 *
 * Every step moves at least 0.012 L in light, so neighbours read apart; inks are solved against the selected fill, so a
 * firmer one darkens them as far as it needs. `FILL_MULTIPLE` is the defaults, the numbers the contrast gate checks.
 */
export const FILL_STEPS = { hover: { min: 1, max: 4, default: 2 }, selected: { min: 0, max: 4, default: 1 }, pressed: { min: 1, max: 4, default: 4 } } as const;
export interface FillSelection { hover: number; selected: number }
export const DEFAULT_FILL: FillSelection = { hover: FILL_STEPS.hover.default, selected: FILL_STEPS.selected.default };
/** The rest, hover and selected multiples of the step for a fill selection. */
export function fillMultiples(f: FillSelection = DEFAULT_FILL): { light: [number, number, number]; dark: [number, number, number] } {
  const lh = Math.max(1.25, 1.5 + 0.375 * (f.hover - 2)), dh = 0.5 * f.hover;
  return { light: [1, lh, lh + 0.625 * f.selected], dark: [0, dh, dh + f.selected] };
}
/** Light fills: rest s, hover 1.5 s, pressed / selected 2.125 s darker (today's 50 / 75 / 100 on white). Dark: hover
 * + s, pressed / selected + 2 s over the rest fill. The defaults of `fillMultiples`. */
export const FILL_MULTIPLE = fillMultiples();
/**
 * Room for a press past the selected fill on every ground (2026-10-23). The inks are solved on the deepest ground's selected
 * fill moved this much further (light: the recessed layer, or a darker card; dark: the raised layer, or a lighter card), so
 * the press, which stops where muted text keeps 4.6:1 (styles/layers.css), always has this much to move. Without it the
 * press equalled selected on recessed surfaces in light at Layers 4 to 8 and on raised ones in dark from 16 + 8 (the layer
 * map, 2026-10-22). The amounts are the smallest steps Area ships that read (layers.test.ts MIN: a sidebar's 50 to its hover
 * 75 in light, 0.04 in dark). ChatGPT and Notion press with one wash on every ground, so their press is the same step
 * on a sidebar as on the page; Area's is at least this. At the defaults muted text moves #666666 to #646464, and the
 * page's firmest press deepens from L 0.925 to 0.913 (about 10% black, toward the owner's 12%).
 */
export const PRESS_ROOM = { light: 0.012, dark: 0.04 } as const;
/** Near black a small step doesn't show on a screen: a dark control fill never sits under L 0.20 (ChatGPT's controls
 * are #303030 on #000), and on a ground darker than L 0.12 the layers start at 0.12 (Spectrum Darkest's first layer
 * is #0e0e0e, L 0.164). */
export const DARK_FILL_FLOOR = 0.2;
export const DARK_LAYER_FLOOR = 0.12;
/** Edges: light keeps today's distance below the page (from white: #f3f3f3, #eeeeee, #e2e2e2, #d4d4d4, #c5c5c5,
 * #b4b4b4); dark keeps today's distance above the raised layer (from 850), never weaker than today's own value. */
export const EDGE_OFFSET = {
  light: { decorative: 0.036, card: 0.051, float: 0.051, faint: 0.0872, subtle: 0.1301, border: 0.1766, hover: 0.2301 },
  dark: { decorative: 0.05, card: 0.09, float: 0.182, faint: 0.09, subtle: 0.09, border: 0.182, hover: 0.2296 },
} as const;
export const EDGE_DARK_TODAY = { decorative: 0.2768, card: 0.3211, float: 0.4128, faint: 0.3211, subtle: 0.3211, border: 0.4128, hover: 0.4604 } as const;
/** How far toward the strong stroke every edge moves under Contrast More, as a share of the way. One share for every
 * stroke (owner, 2026-10-18: "some components get an obviously darker stroke whereas some components dont visibly change
 * at all"): a third for seams and frames while control edges went the whole way read as two settings. So every rest edge
 * reaches `stroke-control` (3:1) and every hover edge `stroke-control-hover` at More, half way at Medium. */
export const CONTRAST_EDGE_SHARE = 1;
/** The edges a pointer steps to: they reach the strong hover stroke, so a hover still reads under More. */
const HOVER_EDGES: ReadonlySet<string> = new Set(["border", "hover"]);
/** Inks: today's text and edge where they pass (light #282828 / #666666 / #838383, hover #747474; dark #eeeeee /
 * #c5c5c5 / #939393, hover #a4a4a4), else darkened (light) or lightened (dark) just enough to hold the target. */
export const INK_TODAY = {
  light: { body: 0.27685, muted: 0.51028, edge: 0.60999, edgeHover: -0.05102 },
  dark: { body: 0.94912, muted: 0.82344, edge: 0.66325, edgeHover: 0.05546 },
} as const;
/** Targets, a touch over WCAG's 4.5 and 3 so a rounded hex never lands under them. */
export const INK_TARGET = { text: 4.6, edge: 3.1 } as const;
/** The cast fades to none at white and at black, as the tinted ramps do: full chroma from 0.024 under white, and at or
 * above L 0.18 in dark. */
export const CAST_FADE = { light: 0.024, dark: 0.18 } as const;
/** The soft-mark plate (base.ts `bg-mark`, 6% black in light) over a gray, as a lightness factor: sRGB channels × 0.94
 * scale a light gray's luminance by 0.872, whose cube root is 0.955 (0.954 to round safe). Soft Badge and Count set
 * muted text on it, so muted is solved on it too (Layers sweep 2026-10-16: #666 on #e0e0e0, 4.35:1, at 95 + 0). */
export const MARK_SHADE = 0.954;
/** The soft mark under the pointer (`bg-mark-hover`, 10.7% black: an interactive soft Badge, "+N more"). Its plate is
 * the ground's sRGB channels × 0.893, composited exactly (a constant lightness factor missed by a hair on some grays).
 * Muted is solved on it over the page, aiming 4.5 on white, where #666666 already clears it (4.52:1 as hex), rising
 * to the model's 4.6 from a 98 page down, the margin rounded hexes need (state sweep 2026-10-17: 4.19:1 at 90 + 0). */
export const MARK_HOVER_KEEP = 0.893;
export const markHoverTarget = (page: number) => 4.5 + Math.min(INK_TARGET.text - 4.5, (1 - page) * 5);
/** A gray's OKLCH lightness after a black wash that keeps `keep` of each sRGB channel (gamma 2.4, no linear toe above
 * L 0.2). */
export const washedLightness = (L: number, keep: number) => Math.cbrt((((1.055 * (L ** 3) ** (1 / 2.4) - 0.055) * keep + 0.055) / 1.055) ** 2.4);
/** The roles with a vivid ink (`fg-<role>-vivid`: validation, danger rows, syntax). Each is chosen for 4.6:1 on white
 * (scale.ts chooseVivid; the code ground is white in light), so its luminance is at most VIVID_Y. On a gray light page
 * the inks mix toward black in OKLab, which scales luminance by (1 − d)³ exactly, by just enough to keep 4.6:1 on the
 * page; on white d is 0, so the light theme as it was is unchanged (sweep: 3.83:1 at 90). Dark needs no change. */
export const VIVID_ROLES = ["accent", "danger", "warning", "caution", "success", "info", "discovery", "pink", "brown"] as const;
export const VIVID_Y = (1 + 0.05) / INK_TARGET.text - 0.05;
/** The tonal inks (`fg-<role>`: outline Buttons and Badges, links, statuses) are darker; the brightest in any accent is
 * teal's #00766a, luminance 0.140. They take the same mix, solved for that bound, so they hold on gray pages from about
 * L 0.94 down (sweep: 4.18:1 at 90 + 0) and are unchanged on 100 to 95. */
export const TONAL_ROLES = ["accent", "danger", "warning", "caution", "success", "info", "discovery", "pink", "gray", "brown"] as const;
export const TONAL_Y = 0.141;
/** Every hued ink the model derives: its token, the rung the axes write and the luminance bound it is solved for. */
export const HUED_INKS = [
  ...VIVID_ROLES.map(role => ({ token: `fg-${role}-vivid`, bound: VIVID_Y, darken: "vivid" as const })),
  ...TONAL_ROLES.map(role => ({ token: `fg-${role}`, bound: TONAL_Y, darken: "tonal" as const })),
];
const darkenFor = (page: number, bound: number) => 1 - Math.min(1, Math.cbrt(Math.max(0, (page ** 3 + 0.05) / INK_TARGET.text - 0.05) / bound));
/** Tinted labels on tinted plates (Tag, Board: the ink over a 16% wash of itself) lose contrast as the dark ground under
 * the plate lightens, so they mix toward white. Two amounts, by the ground the label sits on:
 *   layer  on a card, a menu or the page: past a raised layer of L 0.30, 4× the excess (0.24 at 24 + 8, every Tag ink
 *          4.77:1 or more; sweep: brown 3.98:1 there before).
 *   fill   in a field or on a hovered row (a soft Tag picker): past a raised hover fill of L 0.315, 4.9× the excess (0.73
 *          at 24 + 8; sweep: caution 4.14:1 there before). Lifting every tag by this much left them nearly white on cards.
 * Both are 0 up to the defaults. */
export const TINT_LIFT = { layer: { from: 0.3, perL: 4 }, fill: { from: 0.315, perL: 4.9 } } as const;

// ---------------------------------------------------------------------------
// The model, as numbers
// ---------------------------------------------------------------------------

export interface Cast { chroma: number; hue: number }
export interface LayerSelection { groundLight: number; groundDark: number; layersLight: number; layersDark: number }
export const DEFAULT_LAYER_SELECTION: LayerSelection = { groundLight: DEFAULT_GROUND_LIGHT, groundDark: DEFAULT_GROUND_DARK, layersLight: DEFAULT_LAYERS, layersDark: DEFAULT_LAYERS };

export interface LayerLightness {
  page: number; raised: number; recessed: number; stripe: number; step: number;
  /** Card tone's two grounds: a Card's (Auto: raised) and an Asset card's (Auto: recessed). */
  card: number; tile: number;
  /** Rest, hover, pressed / selected on each ground. */
  fill: { page: [number, number, number]; raised: [number, number, number]; recessed: [number, number, number]; card: [number, number, number]; tile: [number, number, number] };
  edge: Record<keyof typeof EDGE_OFFSET.light, number>;
  ink: { body: number; muted: number; edge: number; edgeHover: number };
  /** How far the vivid and tonal inks mix toward black (light) and tinted labels toward white (dark), 0 to 1. */
  vividDarken: number; tonalDarken: number; tintLift: number; tintLiftFill: number;
}

const clamp01 = (L: number) => Math.min(1, Math.max(0, L));
/** The lightest ink (light) or darkest (dark) that keeps `ratio` on a gray of lightness `bg`. For a gray, OKLab
 * lightness is the cube root of relative luminance, so WCAG's ratio solves in closed form. */
const inkOn = (theme: "light" | "dark", bg: number, ratio: number) => theme === "light"
  ? Math.cbrt(Math.max(0, (bg ** 3 + 0.05) / ratio - 0.05))
  : Math.cbrt(Math.min(1, ratio * (bg ** 3 + 0.05) - 0.05));

export function layerLightness(theme: "light" | "dark", groundStep: number, n: number, fillSel: FillSelection = DEFAULT_FILL, cardTone: CardTone = "auto"): LayerLightness {
  const g = groundLightness(theme, groundStep);
  const FM = fillMultiples(fillSel);
  const s = CONTROL_STEP[theme].base + CONTROL_STEP[theme].perStep * n;
  if (theme === "light") {
    const page = g, raised = Math.min(1, g + Math.min(1 - g, LAYER_PER_STEP.light.raised * n)), recessed = g - LAYER_PER_STEP.light.recessed * n;
    const explicit = cardTone === "auto" ? undefined : clamp01(page + cardTone * CARD_TONE_UNIT.light);
    const card = explicit ?? raised, tile = explicit ?? recessed;
    const fills = (x: number) => FM.light.map(m => x - m * s) as [number, number, number];
    const fill = { page: fills(page), raised: fills(raised), recessed: fills(recessed), card: fills(card), tile: fills(tile) };
    const edge = Object.fromEntries(Object.entries(EDGE_OFFSET.light).map(([k, d]) => [k, page - d])) as LayerLightness["edge"];
    // The deepest surface text sits on: the recessed layer, or a card darker than it (Card tone); its hovered fill for
    // edges, its selected fill for body text. A hovered soft mark sits on the page or a card, whichever is darker.
    const deepest = Math.min(recessed, card, tile), markGround = Math.min(page, card);
    const edgeInk = Math.min(INK_TODAY.light.edge, inkOn("light", deepest - s, INK_TARGET.edge));
    // Text is solved on the deepest selected fill pressed by PRESS_ROOM, so a press has room on every ground.
    const firmest = deepest - FM.light[2] * s - PRESS_ROOM.light;
    const ink = {
      body: Math.min(INK_TODAY.light.body, inkOn("light", firmest, INK_TARGET.text)),
      // Muted sits on hovered, selected and pressed rows (a count in a selected sidebar row) and on the soft-mark plate.
      muted: Math.min(INK_TODAY.light.muted, inkOn("light", firmest, INK_TARGET.text), inkOn("light", MARK_SHADE * deepest, INK_TARGET.text), inkOn("light", washedLightness(markGround, MARK_HOVER_KEEP), markHoverTarget(markGround))),
      edge: edgeInk, edgeHover: edgeInk + INK_TODAY.light.edgeHover,
    };
    return { page, raised, recessed, card, tile, stripe: page - 0.6 * s, step: s, fill, edge, ink, vividDarken: darkenFor(page, VIVID_Y), tonalDarken: darkenFor(page, TONAL_Y), tintLift: 0, tintLiftFill: 0 };
  }
  const lift = n > 0 && g < DARK_LAYER_FLOOR ? DARK_LAYER_FLOOR - g : 0;
  const page = g, raised = g + lift + LAYER_PER_STEP.dark.raised * n, recessed = g + lift + LAYER_PER_STEP.dark.recessed * n;
  const explicit = cardTone === "auto" ? undefined : clamp01(page + cardTone * CARD_TONE_UNIT.dark);
  const card = explicit ?? raised, tile = explicit ?? recessed;
  const fills = (x: number) => { const rest = Math.max(x + s, DARK_FILL_FLOOR); return FM.dark.map(m => rest + m * s) as [number, number, number]; };
  const fill = { page: fills(page), raised: fills(raised), recessed: fills(recessed), card: fills(card), tile: fills(tile) };
  // The lightest surface text sits on: the raised layer, or a card lighter than it (Card tone).
  const top = fills(Math.max(raised, card, tile));
  const edge = Object.fromEntries(Object.entries(EDGE_OFFSET.dark).map(([k, d]) => [k, Math.max(EDGE_DARK_TODAY[k as keyof typeof EDGE_DARK_TODAY], raised + d)])) as LayerLightness["edge"];
  // The lightest surface text sits on is that layer's selected fill (raised, the lightest layer in dark, unless a card is
  // lighter) pressed by PRESS_ROOM; muted text sits there too (a count in a selected row). Past L 0.563 no ink keeps 4.6:1,
  // so at the lightest grounds (24 + 8) both inks are white and the room is what white allows.
  const edgeInk = Math.max(INK_TODAY.dark.edge, inkOn("dark", top[0], INK_TARGET.edge));
  const firmest = top[2] + PRESS_ROOM.dark;
  const ink = {
    body: Math.max(INK_TODAY.dark.body, inkOn("dark", firmest, INK_TARGET.text)),
    muted: Math.max(INK_TODAY.dark.muted, inkOn("dark", firmest, INK_TARGET.text)),
    edge: edgeInk, edgeHover: Math.min(1, edgeInk + INK_TODAY.dark.edgeHover),
  };
  const toWhite = (L: number, { from, perL }: { from: number; perL: number }) => Math.min(1, Math.max(0, (L - from) * perL));
  const tintLift = toWhite(Math.max(raised, card, tile), TINT_LIFT.layer), tintLiftFill = toWhite(top[1], TINT_LIFT.fill);
  return { page, raised, recessed, card, tile, stripe: raised + 0.5 * s, step: s, fill, edge, ink, vividDarken: 0, tonalDarken: 0, tintLift, tintLiftFill };
}

/** The Neutral setting's tint: the hue and chroma of its own ramp, at 50 in light and 900 in dark. */
export function castOf(hexLight50: string, hexDark900: string): { light: Cast; dark: Cast } {
  const lch = (hex: string) => labToLch(rgbToOklab(parseHex(hex), SRGB));
  const l = lch(hexLight50), d = lch(hexDark900);
  const round = (v: number, p = 4) => Number(v.toFixed(p));
  return {
    light: { chroma: l.C < 1e-4 ? 0 : round(l.C), hue: l.C < 1e-4 ? 0 : round(l.h, 1) },
    dark: { chroma: d.C < 1e-4 ? 0 : round(d.C), hue: d.C < 1e-4 ? 0 : round(d.h, 1) },
  };
}

function castChroma(theme: "light" | "dark", L: number, cast: Cast) {
  const fade = theme === "light" ? Math.min(1, Math.max(0, (1 - L) / CAST_FADE.light)) : Math.min(1, Math.max(0, L / CAST_FADE.dark));
  return cast.chroma * fade;
}
export function layerHex(theme: "light" | "dark", L: number, cast: Cast): string {
  const L01 = clamp01(L);
  const rgb: Rgb = oklchToRgb({ L: L01, C: castChroma(theme, L01, cast), h: cast.hue }, SRGB);
  return toHex(clampRgb(rgb));
}
/** A text ink: `share` of the tint's strength, moved INK_MARGIN × the strength away from its ground. */
export function inkHex(theme: "light" | "dark", L: number, cast: Cast, share = DEFAULT_INK_TINT / 4): string {
  const moved = theme === "light" ? L - INK_MARGIN * cast.chroma : L + INK_MARGIN * cast.chroma;
  return layerHex(theme, moved, { hue: cast.hue, chroma: cast.chroma * share });
}

/** Every token the layers own. The neutral axis no longer writes these; base.ts derives them. */
export const LAYER_COLOR_TOKENS = [
  "bg-page", "bg-surface", "bg-subtle", "bg-stripe", "bg-code",
  "bg-component", "bg-component-hover", "bg-component-active",
  "bg-component-raised", "bg-component-raised-hover", "bg-component-raised-active",
  "bg-component-recessed", "bg-component-recessed-hover", "bg-component-recessed-active",
  "bg-card", "bg-tile", "bg-component-card", "bg-component-card-hover", "bg-component-card-active",
  "bg-component-tile", "bg-component-tile-hover", "bg-component-tile-active",
  "fg-default", "fg-muted", "fg-placeholder",
  "border-decorative", "border-card", "border-float", "border-faint", "border-divider", "border-subtle", "border", "border-hover",
  "stroke-control", "stroke-control-hover", "fill-track", "fill-track-hover",
] as const;

/** Hex for every layer token, for one theme. What the contrast gate checks. */
export function layerTokens(theme: "light" | "dark", sel: LayerSelection, cast: Cast, inkShare = DEFAULT_INK_TINT / 4, cardTone: CardTone = "auto"): Record<string, string> {
  const m = layerLightness(theme, theme === "light" ? sel.groundLight : sel.groundDark, theme === "light" ? sel.layersLight : sel.layersDark, DEFAULT_FILL, cardTone);
  const hx = (L: number) => layerHex(theme, L, cast), ink = (L: number) => inkHex(theme, L, cast, inkShare);
  return {
    "bg-page": hx(m.page), "bg-surface": hx(m.raised), "bg-subtle": hx(m.recessed), "bg-stripe": hx(m.stripe), "bg-code": hx(m.raised),
    "bg-card": hx(m.card), "bg-tile": hx(m.tile),
    "bg-component-card": hx(m.fill.card[0]), "bg-component-card-hover": hx(m.fill.card[1]), "bg-component-card-active": hx(m.fill.card[2]),
    "bg-component-tile": hx(m.fill.tile[0]), "bg-component-tile-hover": hx(m.fill.tile[1]), "bg-component-tile-active": hx(m.fill.tile[2]),
    "bg-component": hx(m.fill.page[0]), "bg-component-hover": hx(m.fill.page[1]), "bg-component-active": hx(m.fill.page[2]),
    "bg-component-raised": hx(m.fill.raised[0]), "bg-component-raised-hover": hx(m.fill.raised[1]), "bg-component-raised-active": hx(m.fill.raised[2]),
    "bg-component-recessed": hx(m.fill.recessed[0]), "bg-component-recessed-hover": hx(m.fill.recessed[1]), "bg-component-recessed-active": hx(m.fill.recessed[2]),
    "fg-default": ink(m.ink.body), "fg-muted": ink(m.ink.muted), "fg-placeholder": ink(m.ink.muted),
    "border-decorative": hx(m.edge.decorative), "border-card": hx(m.edge.card), "border-float": hx(m.edge.float), "border-faint": hx(m.edge.faint),
    "border-divider": hx(m.edge.faint), "border-subtle": hx(m.edge.subtle), "border": hx(m.edge.border), "border-hover": hx(m.edge.hover),
    "stroke-control": hx(m.ink.edge), "stroke-control-hover": hx(m.ink.edgeHover),
    "fill-track": hx(m.edge.faint), "fill-track-hover": hx(m.edge.subtle),
  };
}

// ---------------------------------------------------------------------------
// The model, as CSS (emit/base.ts). Written from the same constants; layers.test.ts evaluates it against the numbers.
// ---------------------------------------------------------------------------

const P = "--area-";
const v = (name: string) => `var(${P}${name})`;
const num = (x: number) => String(Number(x.toFixed(6)));

/** The light and dark lightness of every role, as CSS math over the three settings. */
export function layerLightnessCss(): Record<string, string> {
  const gl = v("ground-light"), gd = v("ground-dark"), nl = v("layers-light"), nd = v("layers-dark");
  const sl = v("layer-light-step"), sd = v("layer-dark-step");
  const lf = (x: string, m: string) => `calc(${x} - ${m} * ${sl})`;
  const df = (x: string, m: string) => `calc(max(${x} + ${sd}, ${num(DARK_FILL_FLOOR)}) + ${m} * ${sd})`;
  // The fill settings' multiples (fillMultiples, as CSS): rest, hover, selected.
  const h = v("fill-hover-step"), a = v("fill-selected-step");
  const lh = `max(1.25, 1.5 + 0.375 * (${h} - 2))`, dh = `(0.5 * ${h})`;
  const lm = ["1", lh, `(${lh} + 0.625 * ${a})`], dm = ["0", dh, `(${dh} + ${a})`];
  const out: Record<string, string> = {
    "layer-light-step": `calc(${num(CONTROL_STEP.light.base)} + ${num(CONTROL_STEP.light.perStep)} * ${nl})`,
    "layer-dark-step": `calc(${num(CONTROL_STEP.dark.base)} + ${num(CONTROL_STEP.dark.perStep)} * ${nd})`,
    "layer-light-page": gl,
    "layer-light-raised": `min(1, calc(${gl} + min(1 - ${gl}, ${num(LAYER_PER_STEP.light.raised)} * ${nl})))`,
    "layer-light-recessed": `calc(${gl} - ${num(LAYER_PER_STEP.light.recessed)} * ${nl})`,
    "layer-dark-lift": `calc(max(0, ${num(DARK_LAYER_FLOOR)} - ${gd}) * min(1, ${nd}))`,
    "layer-dark-page": gd,
    "layer-dark-raised": `calc(${gd} + ${v("layer-dark-lift")} + ${num(LAYER_PER_STEP.dark.raised)} * ${nd})`,
    "layer-dark-recessed": `calc(${gd} + ${v("layer-dark-lift")} + ${num(LAYER_PER_STEP.dark.recessed)} * ${nd})`,
    // Card tone: Auto (the switch at 1) keeps each container's own tone; a step sits that far from the page.
    "layer-light-card-step": `clamp(0, calc(${gl} + ${num(CARD_TONE_UNIT.light)} * ${v("card-tone-light")}), 1)`,
    "layer-dark-card-step": `clamp(0, calc(${gd} + ${num(CARD_TONE_UNIT.dark)} * ${v("card-tone-dark")}), 1)`,
    "layer-light-card": `calc(${v("card-tone-light-auto")} * ${v("layer-light-raised")} + (1 - ${v("card-tone-light-auto")}) * ${v("layer-light-card-step")})`,
    "layer-light-tile": `calc(${v("card-tone-light-auto")} * ${v("layer-light-recessed")} + (1 - ${v("card-tone-light-auto")}) * ${v("layer-light-card-step")})`,
    "layer-dark-card": `calc(${v("card-tone-dark-auto")} * ${v("layer-dark-raised")} + (1 - ${v("card-tone-dark-auto")}) * ${v("layer-dark-card-step")})`,
    "layer-dark-tile": `calc(${v("card-tone-dark-auto")} * ${v("layer-dark-recessed")} + (1 - ${v("card-tone-dark-auto")}) * ${v("layer-dark-card-step")})`,
  };
  for (const ground of ["page", "raised", "recessed", "card", "tile"]) lm.forEach((m, i) => {
    out[`layer-light-${ground}-fill-${i}`] = lf(v(`layer-light-${ground}`), m);
    out[`layer-dark-${ground}-fill-${i}`] = df(v(`layer-dark-${ground}`), dm[i]!);
  });
  const cube = (x: string) => `pow(${x}, 3)`;
  const root3 = (x: string) => `pow(${x}, ${num(1 / 3)})`;
  const inkLightCss = (bg: string, ratio: string, today: number) => `min(${num(today)}, ${root3(`max(0, (${cube(bg)} + 0.05) / ${ratio} - 0.05)`)})`;
  const inkLight = (bg: string, ratio: number, today: number) => `min(${num(today)}, ${root3(`max(0, (${cube(bg)} + 0.05) / ${num(ratio)} - 0.05)`)})`;
  const inkDark = (bg: string, ratio: number, today: number) => `max(${num(today)}, ${root3(`min(1, ${num(ratio)} * (${cube(bg)} + 0.05) - 0.05)`)})`;
  // The deepest ground text sits on in light (recessed, or a darker card), the lightest in dark (raised, or a lighter card).
  const deep = (i: number) => `min(${v(`layer-light-recessed-fill-${i}`)}, ${v(`layer-light-card-fill-${i}`)}, ${v(`layer-light-tile-fill-${i}`)})`;
  const top = (i: number) => `max(${v(`layer-dark-raised-fill-${i}`)}, ${v(`layer-dark-card-fill-${i}`)}, ${v(`layer-dark-tile-fill-${i}`)})`;
  // Its selected fill pressed by PRESS_ROOM, where text is solved.
  const firmestLight = `calc(${deep(2)} - ${num(PRESS_ROOM.light)})`, firmestDark = `calc(${top(2)} + ${num(PRESS_ROOM.dark)})`;
  const deepest = `min(${v("layer-light-recessed")}, ${v("layer-light-card")}, ${v("layer-light-tile")})`, markGround = `min(${v("layer-light-page")}, ${v("layer-light-card")})`;
  Object.assign(out, {
    "layer-light-body": inkLight(firmestLight, INK_TARGET.text, INK_TODAY.light.body),
    "layer-light-muted": `min(${inkLight(firmestLight, INK_TARGET.text, INK_TODAY.light.muted)}, ${inkLight(`calc(${num(MARK_SHADE)} * ${deepest})`, INK_TARGET.text, INK_TODAY.light.muted)}, ${inkLightCss(`pow(pow(calc((calc(1.055 * pow(pow(${markGround}, 3), ${num(1 / 2.4)}) - 0.055) * ${num(MARK_HOVER_KEEP)} + 0.055) / 1.055), 2.4), ${num(1 / 3)})`, `calc(4.5 + min(${num(INK_TARGET.text - 4.5)}, calc((1 - ${markGround}) * 5)))`, INK_TODAY.light.muted)})`,
    "layer-light-edge": inkLight(deep(0), INK_TARGET.edge, INK_TODAY.light.edge),
    "layer-dark-body": inkDark(firmestDark, INK_TARGET.text, INK_TODAY.dark.body),
    "layer-dark-muted": inkDark(firmestDark, INK_TARGET.text, INK_TODAY.dark.muted),
    "layer-dark-edge": inkDark(top(0), INK_TARGET.edge, INK_TODAY.dark.edge),
    "layer-light-vivid-darken": `calc(1 - min(1, ${root3(`max(0, (${cube(gl)} + 0.05) / ${num(INK_TARGET.text)} - 0.05) / ${num(VIVID_Y)}`)}))`,
    "layer-light-tonal-darken": `calc(1 - min(1, ${root3(`max(0, (${cube(gl)} + 0.05) / ${num(INK_TARGET.text)} - 0.05) / ${num(TONAL_Y)}`)}))`,
    "layer-dark-tint-lift": `clamp(0, calc((max(${v("layer-dark-raised")}, ${v("layer-dark-card")}, ${v("layer-dark-tile")}) - ${num(TINT_LIFT.layer.from)}) * ${num(TINT_LIFT.layer.perL)}), 1)`,
    "layer-dark-tint-lift-fill": `clamp(0, calc((${top(1)} - ${num(TINT_LIFT.fill.from)}) * ${num(TINT_LIFT.fill.perL)}), 1)`,
  });
  return out;
}

/**
 * The tint each mode draws in (axes/tint.ts): each tint setting at Auto takes the Neutral setting's own cast, else its
 * own value. The switches are 0 or 1, so each is one of the two, never a blend.
 */
function castCss(): Record<string, string> {
  const pick = (auto: string, neutral: string, own: string) => `calc(${v(auto)} * ${v(neutral)} + (1 - ${v(auto)}) * ${v(own)})`;
  return {
    "cast-hue-light": pick("tint-hue-auto", "neutral-hue-light", "tint-hue"),
    "cast-hue-dark": pick("tint-hue-auto", "neutral-hue-dark", "tint-hue"),
    "cast-chroma-light": pick("tint-light-auto", "neutral-chroma-light", "tint-chroma-light"),
    "cast-chroma-dark": pick("tint-dark-auto", "neutral-chroma-dark", "tint-chroma-dark"),
  };
}

/** `light-dark(oklch(...), oklch(...))` for a role, tinted by the mode's cast (`share` of it: text takes Text tint's). */
function color(light: string, dark: string, share = "1"): string {
  const cl = `calc(${v("cast-chroma-light")} * ${share} * clamp(0, (1 - ${light}) / ${num(CAST_FADE.light)}, 1))`;
  const cd = `calc(${v("cast-chroma-dark")} * ${share} * clamp(0, ${dark} / ${num(CAST_FADE.dark)}, 1))`;
  return `light-dark(oklch(${light} ${cl} ${v("cast-hue-light")}), oklch(${dark} ${cd} ${v("cast-hue-dark")}))`;
}
/** A text ink (inkHex as CSS): Text tint's share of the cast, moved INK_MARGIN × the strength away from its ground. */
function inkColor(light: string, dark: string): string {
  return color(`calc(${light} - ${num(INK_MARGIN)} * ${v("cast-chroma-light")})`, `calc(${dark} + ${num(INK_MARGIN)} * ${v("cast-chroma-dark")})`, v("ink-tint"));
}

/** An edge at standard contrast: its distance below the light page, above the dark raised layer. base.ts mixes the
 * controls' roles from these, so no role moves twice. */
export function rawEdge(k: keyof typeof EDGE_OFFSET.light): string {
  const edgeLight = (d: number) => `calc(${v("layer-light-page")} - ${num(d)})`;
  const edgeDark = (today: number, d: number) => `max(${num(today)}, calc(${v("layer-dark-raised")} + ${num(d)}))`;
  return color(edgeLight(EDGE_OFFSET.light[k]), edgeDark(EDGE_DARK_TODAY[k], EDGE_OFFSET.dark[k]));
}

/**
 * A stroke at standard contrast, through the Stroke control (axes/depth.ts, 2026-10-18): its distance from the ground is
 * rawEdge's × `stroke-strength` (1 at the default 4, so rawEdge exactly; 0 draws the ground). Fills drawn from an edge
 * (the rails, the toggle fills) read rawEdge and stay.
 */
export function strokeEdge(k: keyof typeof EDGE_OFFSET.light): string {
  const n = v("stroke-strength");
  const light = `calc(${v("layer-light-page")} - ${num(EDGE_OFFSET.light[k])} * ${n})`;
  const raised = v("layer-dark-raised");
  const dark = `calc(${raised} + (max(${num(EDGE_DARK_TODAY[k])}, calc(${raised} + ${num(EDGE_OFFSET.dark[k])})) - ${raised}) * ${n})`;
  return color(light, dark);
}

/**
 * A control's edge under the pointer, through the Hover stroke setting (axes/states.ts): `stroke-hover-step` from 0 (the
 * rest edge, no change) to 4, 2 being the step Area always took (light faint → subtle, dark faint → border). Each step
 * moves the edge half that distance again, straight in lightness, so the steps are even (light 0.021, dark 0.046 L) and
 * Stroke strength still scales the whole edge.
 */
export function strokeEdgeHover(): string {
  const n = v("stroke-strength"), k = `(${v("stroke-hover-step")} / 2)`;
  const lo = EDGE_OFFSET.light, d = EDGE_OFFSET.dark, t = EDGE_DARK_TODAY;
  const light = `calc(${v("layer-light-page")} - (${num(lo.faint)} + ${num(lo.subtle - lo.faint)} * ${k}) * ${n})`;
  const raised = v("layer-dark-raised");
  const dark = `calc(${raised} + (max(calc(${num(t.faint)} + ${num(t.border - t.faint)} * ${k}), calc(${raised} + ${num(d.faint)} + ${num(d.border - d.faint)} * ${k})) - ${raised}) * ${n})`;
  return color(light, dark);
}

/**
 * Edges on the ground they sit on (2026-10-23; the layer map, 2026-10-22: from the page, a card's edge on a sidebar fell to
 * 1.01:1 at Layers 8). Every edge keeps its distance from the ground under it: in light from the page or a darker ground
 * (recessed, a darker card), in dark from the raised layer or a lighter one, never nearer than today's.
 *
 * Each edge role is written twice: `<role>-page`, its value on the page (and, in dark, the raised layer), and `<role>`, that
 * moved by `edge-shift-light` (darker) and `edge-shift-dark` (lighter), how far the ground under it sits past the page or
 * the raised layer. Both shifts are 0 on :root; styles/layers.css sets them on every ground and restates the roles on its
 * children, so what a ground draws on itself (its frame) keeps the ground it sits on. The move is in OKLab lightness, and a role mixed toward a strong stroke by Contrast moves
 * (1 − contrast-more) of it, which is exact for an OKLab mix: every step of Contrast still lands where it did, and at More
 * every edge is the strong stroke, which is solved on the deepest ground already.
 *
 * `mixed`: Contrast mixes the role toward a fixed stroke. `raw`: a fill drawn from an edge (the rails), which Contrast leaves.
 */
export const GROUND_EDGES = {
  "border-decorative": "mixed", "border-card": "mixed", "border-float": "mixed", "border-faint": "mixed", "border-divider": "mixed",
  "border-subtle": "mixed", "border": "mixed", "border-hover": "mixed",
  "edge-control": "mixed", "edge-control-hover": "mixed", "edge-selected": "mixed", "edge-control-strong": "mixed",
  "fill-toggle": "mixed", "fill-toggle-hover": "mixed", "composer-edge": "mixed", "composer-focus-color": "mixed",
  "fill-track": "raw", "fill-track-hover": "raw",
} as const satisfies Record<string, "mixed" | "raw">;
export type GroundEdge = keyof typeof GROUND_EDGES;
/** The tokens that read an edge role by name: restated with the roles wherever the shift is set. */
export const GROUND_EDGE_ALIASES = [
  "input-edge", "input-edge-hover", "input-edge-soft", "textarea-edge", "textarea-edge-hover", "textarea-edge-soft",
  "select-edge", "select-edge-hover", "selection-edge", "token-edge",
] as const;
/** An edge role on the ground under it: its `-page` value moved by the edge shift (see GROUND_EDGES). */
export function onGround(role: GroundEdge): string {
  const page = v(`${role}-page`), keep = GROUND_EDGES[role] === "mixed" ? ` * (1 - ${v("contrast-more")})` : "";
  return `light-dark(oklab(from ${page} calc(l - ${v("edge-shift-light")}${keep}) a b), oklab(from ${page} calc(l + ${v("edge-shift-dark")}${keep}) a b))`;
}
/** How far a ground moves the edges on it (the model of `edge-shift-light` / `-dark`): its distance past the page (light)
 * or the raised layer (dark), 0 on the page and every lighter (light) or darker (dark) ground. */
export const edgeShift = (theme: "light" | "dark", m: LayerLightness, ground: number) =>
  theme === "light" ? Math.max(0, m.page - ground) : Math.max(0, ground - m.raised);

/** A colour at standard contrast taken `share` of the way to `strong` at the Contrast level (0, 0.5 Medium, 1 More). */
export const contrastMix = (standard: string, strong: string, share = 1) =>
  `color-mix(in oklab, ${standard}, ${strong} calc(${v("contrast-more")} * ${num(share * 100)}%))`;

/** Every layer colour token as CSS, plus the lightness helpers it reads. */
export function layerCss(): Record<string, string> {
  const L = (theme: "light" | "dark", name: string) => v(`layer-${theme}-${name}`);
  const both = (name: string) => color(L("light", name), L("dark", name));
  const raw = rawEdge;
  // Contrast moves every stroke together (owner, 2026-10-18: More "doesn't seem to apply to all components evenly"): each
  // edge goes the same share of the way to the strong stroke (CONTRAST_EDGE_SHARE). Standard is the edge as it was.
  const edge = (k: keyof typeof EDGE_OFFSET.light) =>
    contrastMix(strokeEdge(k), v(HOVER_EDGES.has(k) ? "stroke-control-hover" : "stroke-control"), CONTRAST_EDGE_SHARE);
  const out: Record<string, string> = {
    ...Object.fromEntries(Object.entries(layerLightnessCss()).map(([k, x]) => [`${P}${k}`, x])),
    ...Object.fromEntries(Object.entries(castCss()).map(([k, x]) => [`${P}${k}`, x])),
    [`${P}bg-page`]: both("page"),
    [`${P}bg-surface`]: both("raised"),
    [`${P}bg-subtle`]: both("recessed"),
    [`${P}bg-stripe`]: color(`calc(${v("layer-light-page")} - 0.6 * ${v("layer-light-step")})`, `calc(${v("layer-dark-raised")} + 0.5 * ${v("layer-dark-step")})`),
    [`${P}bg-code`]: both("raised"),
    [`${P}bg-card`]: both("card"),
    [`${P}bg-tile`]: both("tile"),
    [`${P}fg-default`]: inkColor(L("light", "body"), L("dark", "body")),
    [`${P}fg-muted`]: inkColor(L("light", "muted"), L("dark", "muted")),
    [`${P}fg-placeholder`]: inkColor(L("light", "muted"), L("dark", "muted")),
    [`${P}stroke-control`]: both("edge"),
    [`${P}stroke-control-hover`]: color(`calc(${L("light", "edge")} - ${num(-INK_TODAY.light.edgeHover)})`, `min(1, calc(${L("dark", "edge")} + ${num(INK_TODAY.dark.edgeHover)}))`),
    // Each edge on the page, then on the ground under it (GROUND_EDGES).
    [`${P}border-decorative-page`]: edge("decorative"),
    [`${P}border-card-page`]: edge("card"),
    [`${P}border-float-page`]: edge("float"),
    [`${P}border-faint-page`]: edge("faint"),
    [`${P}border-divider-page`]: edge("faint"),
    [`${P}border-subtle-page`]: edge("subtle"),
    [`${P}border-page`]: edge("border"),
    [`${P}border-hover-page`]: edge("hover"),
    // A rail's unfilled part (Progress, Meter, Slider, the off Switch): a fill, not a stroke, so Contrast leaves it. Its
    // value is what has to read on it, and a darker rail only lowers that (under More the 3:1 stroke made an accent fill
    // 1.2:1 on it, 2026-10-18).
    [`${P}fill-track-page`]: raw("faint"),
    [`${P}fill-track-hover-page`]: raw("subtle"),
    ...Object.fromEntries((["border-decorative", "border-card", "border-float", "border-faint", "border-divider", "border-subtle", "border", "border-hover", "fill-track", "fill-track-hover"] as const)
      .map(role => [`${P}${role}`, onGround(role)])),
  };
  // The hued inks: Theme and Accent write each one's rung (`<token>-rung`, axes/color.ts); in light it mixes toward
  // black by the page's darken for its bound, exact in luminance (see VIVID_ROLES, TONAL_ROLES).
  for (const { token, darken } of HUED_INKS) {
    const rung = v(`${token}-rung`);
    out[`${P}${token}`] = `light-dark(color-mix(in oklab, ${rung}, black calc(${v(`layer-light-${darken}-darken`)} * 100%)), ${rung})`;
  }
  const suffix = ["", "-hover", "-active"];
  // `bg-component` is the page's fill until a surface points it at its own ground; `-page` keeps the page's, so a region
  // painted the page tone inside a raised one (a Titlebar or a flush Panel in a card or a gallery tile) can point back.
  for (const [ground, prefix] of [["page", "bg-component"], ["page", "bg-component-page"], ["raised", "bg-component-raised"], ["recessed", "bg-component-recessed"], ["card", "bg-component-card"], ["tile", "bg-component-tile"]] as const)
    suffix.forEach((s, i) => { out[`${P}${prefix}${s}`] = both(`${ground}-fill-${i}`); });
  // The Selection role on a raised or recessed ground, as base.ts writes it on the page: the ground's pressed fill (or
  // hovered, for a band) mixed toward the accent when Selection is Accent. A surface points the role at these.
  const mix = (fill: string, accent: string) => `color-mix(in srgb, var(${P}${fill}), var(${P}${accent}) calc(var(${P}selection-accent) * 100%))`;
  for (const ground of ["page", "raised", "recessed", "card", "tile"] as const) Object.assign(out, {
    [`${P}selection-surface-${ground}`]: mix(`bg-component-${ground}-active`, "accent-surface"),
    [`${P}selection-surface-${ground}-hover`]: mix(`bg-component-${ground}-active`, "accent-surface-hover"),
    [`${P}selection-band-${ground}`]: mix(`bg-component-${ground}-hover`, "accent-surface"),
    [`${P}selection-band-${ground}-hover`]: mix(`bg-component-${ground}-active`, "accent-surface-hover"),
  });
  return out;
}
