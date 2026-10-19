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
export const LAYER_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export const DEFAULT_GROUND_LIGHT = 100;
export const DEFAULT_GROUND_DARK = 8;
export const DEFAULT_LAYERS = 4;

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
/** Light fills: rest s, hover 1.5 s, pressed / selected 2.125 s darker (today's 50 / 75 / 100 on white). Dark: hover
 * + s, pressed / selected + 2 s over the rest fill. */
export const FILL_MULTIPLE = { light: [1, 1.5, 2.125], dark: [0, 1, 2] } as const;
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
  /** Rest, hover, pressed / selected on each ground. */
  fill: { page: [number, number, number]; raised: [number, number, number]; recessed: [number, number, number] };
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

export function layerLightness(theme: "light" | "dark", groundStep: number, n: number): LayerLightness {
  const g = groundLightness(theme, groundStep);
  const s = CONTROL_STEP[theme].base + CONTROL_STEP[theme].perStep * n;
  if (theme === "light") {
    const page = g, raised = Math.min(1, g + Math.min(1 - g, LAYER_PER_STEP.light.raised * n)), recessed = g - LAYER_PER_STEP.light.recessed * n;
    const fills = (x: number) => FILL_MULTIPLE.light.map(m => x - m * s) as [number, number, number];
    const fill = { page: fills(page), raised: fills(raised), recessed: fills(recessed) };
    const edge = Object.fromEntries(Object.entries(EDGE_OFFSET.light).map(([k, d]) => [k, page - d])) as LayerLightness["edge"];
    // The deepest surface text sits on is the recessed layer's hovered fill; a selected one holds body text only.
    const edgeInk = Math.min(INK_TODAY.light.edge, inkOn("light", recessed - s, INK_TARGET.edge));
    const ink = {
      body: Math.min(INK_TODAY.light.body, inkOn("light", recessed - FILL_MULTIPLE.light[2] * s, INK_TARGET.text)),
      // Muted sits on hovered and selected rows (a count in a selected sidebar row) and on the soft-mark plate.
      muted: Math.min(INK_TODAY.light.muted, inkOn("light", recessed - FILL_MULTIPLE.light[2] * s, INK_TARGET.text), inkOn("light", MARK_SHADE * recessed, INK_TARGET.text), inkOn("light", washedLightness(page, MARK_HOVER_KEEP), markHoverTarget(page))),
      edge: edgeInk, edgeHover: edgeInk + INK_TODAY.light.edgeHover,
    };
    return { page, raised, recessed, stripe: page - 0.6 * s, step: s, fill, edge, ink, vividDarken: darkenFor(page, VIVID_Y), tonalDarken: darkenFor(page, TONAL_Y), tintLift: 0, tintLiftFill: 0 };
  }
  const lift = n > 0 && g < DARK_LAYER_FLOOR ? DARK_LAYER_FLOOR - g : 0;
  const page = g, raised = g + lift + LAYER_PER_STEP.dark.raised * n, recessed = g + lift + LAYER_PER_STEP.dark.recessed * n;
  const fills = (x: number) => { const rest = Math.max(x + s, DARK_FILL_FLOOR); return FILL_MULTIPLE.dark.map(m => rest + m * s) as [number, number, number]; };
  const fill = { page: fills(page), raised: fills(raised), recessed: fills(recessed) };
  const edge = Object.fromEntries(Object.entries(EDGE_OFFSET.dark).map(([k, d]) => [k, Math.max(EDGE_DARK_TODAY[k as keyof typeof EDGE_DARK_TODAY], raised + d)])) as LayerLightness["edge"];
  // The lightest surface text sits on is the raised layer's selected fill (raised is the lightest layer in dark); muted
  // text sits there too (a count in a selected row).
  const edgeInk = Math.max(INK_TODAY.dark.edge, inkOn("dark", fill.raised[0], INK_TARGET.edge));
  const ink = {
    body: Math.max(INK_TODAY.dark.body, inkOn("dark", fill.raised[2], INK_TARGET.text)),
    muted: Math.max(INK_TODAY.dark.muted, inkOn("dark", fill.raised[2], INK_TARGET.text)),
    edge: edgeInk, edgeHover: Math.min(1, edgeInk + INK_TODAY.dark.edgeHover),
  };
  const toWhite = (L: number, { from, perL }: { from: number; perL: number }) => Math.min(1, Math.max(0, (L - from) * perL));
  const tintLift = toWhite(raised, TINT_LIFT.layer), tintLiftFill = toWhite(fill.raised[1], TINT_LIFT.fill);
  return { page, raised, recessed, stripe: raised + 0.5 * s, step: s, fill, edge, ink, vividDarken: 0, tonalDarken: 0, tintLift, tintLiftFill };
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

/** Every token the layers own. The neutral axis no longer writes these; base.ts derives them. */
export const LAYER_COLOR_TOKENS = [
  "bg-page", "bg-surface", "bg-subtle", "bg-stripe", "bg-code",
  "bg-component", "bg-component-hover", "bg-component-active",
  "bg-component-raised", "bg-component-raised-hover", "bg-component-raised-active",
  "bg-component-recessed", "bg-component-recessed-hover", "bg-component-recessed-active",
  "fg-default", "fg-muted", "fg-placeholder",
  "border-decorative", "border-card", "border-float", "border-faint", "border-divider", "border-subtle", "border", "border-hover",
  "stroke-control", "stroke-control-hover", "fill-track", "fill-track-hover",
] as const;

/** Hex for every layer token, for one theme. What the contrast gate checks. */
export function layerTokens(theme: "light" | "dark", sel: LayerSelection, cast: Cast): Record<string, string> {
  const m = layerLightness(theme, theme === "light" ? sel.groundLight : sel.groundDark, theme === "light" ? sel.layersLight : sel.layersDark);
  const hx = (L: number) => layerHex(theme, L, cast);
  return {
    "bg-page": hx(m.page), "bg-surface": hx(m.raised), "bg-subtle": hx(m.recessed), "bg-stripe": hx(m.stripe), "bg-code": hx(m.raised),
    "bg-component": hx(m.fill.page[0]), "bg-component-hover": hx(m.fill.page[1]), "bg-component-active": hx(m.fill.page[2]),
    "bg-component-raised": hx(m.fill.raised[0]), "bg-component-raised-hover": hx(m.fill.raised[1]), "bg-component-raised-active": hx(m.fill.raised[2]),
    "bg-component-recessed": hx(m.fill.recessed[0]), "bg-component-recessed-hover": hx(m.fill.recessed[1]), "bg-component-recessed-active": hx(m.fill.recessed[2]),
    "fg-default": hx(m.ink.body), "fg-muted": hx(m.ink.muted), "fg-placeholder": hx(m.ink.muted),
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
  const lf = (x: string, m: number) => `calc(${x} - ${num(m)} * ${sl})`;
  const df = (x: string, m: number) => `calc(max(${x} + ${sd}, ${num(DARK_FILL_FLOOR)}) + ${num(m)} * ${sd})`;
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
  };
  for (const ground of ["page", "raised", "recessed"]) FILL_MULTIPLE.light.forEach((m, i) => {
    out[`layer-light-${ground}-fill-${i}`] = lf(v(`layer-light-${ground}`), m);
    out[`layer-dark-${ground}-fill-${i}`] = df(v(`layer-dark-${ground}`), FILL_MULTIPLE.dark[i]!);
  });
  const cube = (x: string) => `pow(${x}, 3)`;
  const root3 = (x: string) => `pow(${x}, ${num(1 / 3)})`;
  const inkLightCss = (bg: string, ratio: string, today: number) => `min(${num(today)}, ${root3(`max(0, (${cube(bg)} + 0.05) / ${ratio} - 0.05)`)})`;
  const inkLight = (bg: string, ratio: number, today: number) => `min(${num(today)}, ${root3(`max(0, (${cube(bg)} + 0.05) / ${num(ratio)} - 0.05)`)})`;
  const inkDark = (bg: string, ratio: number, today: number) => `max(${num(today)}, ${root3(`min(1, ${num(ratio)} * (${cube(bg)} + 0.05) - 0.05)`)})`;
  Object.assign(out, {
    "layer-light-body": inkLight(v("layer-light-recessed-fill-2"), INK_TARGET.text, INK_TODAY.light.body),
    "layer-light-muted": `min(${inkLight(v("layer-light-recessed-fill-2"), INK_TARGET.text, INK_TODAY.light.muted)}, ${inkLight(`calc(${num(MARK_SHADE)} * ${v("layer-light-recessed")})`, INK_TARGET.text, INK_TODAY.light.muted)}, ${inkLightCss(`pow(pow(calc((calc(1.055 * pow(pow(${v("layer-light-page")}, 3), ${num(1 / 2.4)}) - 0.055) * ${num(MARK_HOVER_KEEP)} + 0.055) / 1.055), 2.4), ${num(1 / 3)})`, `calc(4.5 + min(${num(INK_TARGET.text - 4.5)}, calc((1 - ${v("layer-light-page")}) * 5)))`, INK_TODAY.light.muted)})`,
    "layer-light-edge": inkLight(v("layer-light-recessed-fill-0"), INK_TARGET.edge, INK_TODAY.light.edge),
    "layer-dark-body": inkDark(v("layer-dark-raised-fill-2"), INK_TARGET.text, INK_TODAY.dark.body),
    "layer-dark-muted": inkDark(v("layer-dark-raised-fill-2"), INK_TARGET.text, INK_TODAY.dark.muted),
    "layer-dark-edge": inkDark(v("layer-dark-raised-fill-0"), INK_TARGET.edge, INK_TODAY.dark.edge),
    "layer-light-vivid-darken": `calc(1 - min(1, ${root3(`max(0, (${cube(gl)} + 0.05) / ${num(INK_TARGET.text)} - 0.05) / ${num(VIVID_Y)}`)}))`,
    "layer-light-tonal-darken": `calc(1 - min(1, ${root3(`max(0, (${cube(gl)} + 0.05) / ${num(INK_TARGET.text)} - 0.05) / ${num(TONAL_Y)}`)}))`,
    "layer-dark-tint-lift": `clamp(0, calc((${v("layer-dark-raised")} - ${num(TINT_LIFT.layer.from)}) * ${num(TINT_LIFT.layer.perL)}), 1)`,
    "layer-dark-tint-lift-fill": `clamp(0, calc((${v("layer-dark-raised-fill-1")} - ${num(TINT_LIFT.fill.from)}) * ${num(TINT_LIFT.fill.perL)}), 1)`,
  });
  return out;
}

/** `light-dark(oklch(...), oklch(...))` for a role, tinted by the Neutral setting's cast. */
function color(light: string, dark: string): string {
  const cl = `calc(${v("neutral-chroma-light")} * clamp(0, (1 - ${light}) / ${num(CAST_FADE.light)}, 1))`;
  const cd = `calc(${v("neutral-chroma-dark")} * clamp(0, ${dark} / ${num(CAST_FADE.dark)}, 1))`;
  return `light-dark(oklch(${light} ${cl} ${v("neutral-hue-light")}), oklch(${dark} ${cd} ${v("neutral-hue-dark")}))`;
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
    [`${P}bg-page`]: both("page"),
    [`${P}bg-surface`]: both("raised"),
    [`${P}bg-subtle`]: both("recessed"),
    [`${P}bg-stripe`]: color(`calc(${v("layer-light-page")} - 0.6 * ${v("layer-light-step")})`, `calc(${v("layer-dark-raised")} + 0.5 * ${v("layer-dark-step")})`),
    [`${P}bg-code`]: both("raised"),
    [`${P}fg-default`]: both("body"),
    [`${P}fg-muted`]: both("muted"),
    [`${P}fg-placeholder`]: both("muted"),
    [`${P}stroke-control`]: both("edge"),
    [`${P}stroke-control-hover`]: color(`calc(${L("light", "edge")} - ${num(-INK_TODAY.light.edgeHover)})`, `min(1, calc(${L("dark", "edge")} + ${num(INK_TODAY.dark.edgeHover)}))`),
    [`${P}border-decorative`]: edge("decorative"),
    [`${P}border-card`]: edge("card"),
    [`${P}border-float`]: edge("float"),
    [`${P}border-faint`]: edge("faint"),
    [`${P}border-divider`]: edge("faint"),
    [`${P}border-subtle`]: edge("subtle"),
    [`${P}border`]: edge("border"),
    [`${P}border-hover`]: edge("hover"),
    // A rail's unfilled part (Progress, Meter, Slider, the off Switch): a fill, not a stroke, so Contrast leaves it. Its
    // value is what has to read on it, and a darker rail only lowers that (under More the 3:1 stroke made an accent fill
    // 1.2:1 on it, 2026-10-18).
    [`${P}fill-track`]: raw("faint"),
    [`${P}fill-track-hover`]: raw("subtle"),
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
  for (const [ground, prefix] of [["page", "bg-component"], ["page", "bg-component-page"], ["raised", "bg-component-raised"], ["recessed", "bg-component-recessed"]] as const)
    suffix.forEach((s, i) => { out[`${P}${prefix}${s}`] = both(`${ground}-fill-${i}`); });
  // The Selection role on a raised or recessed ground, as base.ts writes it on the page: the ground's pressed fill (or
  // hovered, for a band) mixed toward the accent when Selection is Accent. A surface points the role at these.
  const mix = (fill: string, accent: string) => `color-mix(in srgb, var(${P}${fill}), var(${P}${accent}) calc(var(${P}selection-accent) * 100%))`;
  for (const ground of ["page", "raised", "recessed"] as const) Object.assign(out, {
    [`${P}selection-surface-${ground}`]: mix(`bg-component-${ground}-active`, "accent-surface"),
    [`${P}selection-surface-${ground}-hover`]: mix(`bg-component-${ground}-active`, "accent-surface-hover"),
    [`${P}selection-band-${ground}`]: mix(`bg-component-${ground}-hover`, "accent-surface"),
    [`${P}selection-band-${ground}-hover`]: mix(`bg-component-${ground}-active`, "accent-surface-hover"),
  });
  return out;
}
