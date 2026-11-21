/**
 * Layers: the page's tone and the tones of what sits on it, from three numbers.
 *
 * The owner asked (2026-10-16) for a setting for the page and the layers on it: a white or gray page, white or gray
 * layers, a blackout or a lighter dark, in fine steps, every combination usable. Research, the reference values and
 * the review page: docs/research/layers-2026-10-16/.
 *
 *   ground-light  the light page's OKLCH lightness, 1 (white) to 0.90 in 0.01 steps.
 *   ground-dark   the dark page's lightness: 0 (black), 0.085 (Area's near-black, the default), 0.12 to 0.24.
 *   layers-light  layer contrast in light, 0 (Flat, the default since 2026-10-25) to 100 (axes/layers.ts; 0 to 8, 4 the default, before): how far raised layers (cards, menus,
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
import { type Rgb, oklchToRgb, oklabToRgb, rgbToOklab, labToLch, parseHex, SRGB, toHex, clampRgb } from "./oklab.ts";
import { findCusp, maxChromaAt } from "./gamut.ts";

// ---------------------------------------------------------------------------
// The settings
// ---------------------------------------------------------------------------

/** Light grounds, 100 (white) to 90, as OKLCH lightness. */
export const GROUND_LIGHT_STEPS = [100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90] as const;
/** Dark grounds: every whole percent, 0 (black) to 24; 8 is Area's near-black, #020202. Below 12 a 1% step barely shows on a
 * screen (it was 0, 8, then 12 to 24 in twos until 2026-10-26, when every setting took every whole number). */
export const GROUND_DARK_STEPS = Array.from({ length: 25 }, (_, i) => i);
/** Layer contrast in the model's units, 0 to 8: the five marks the Setup names (owner, 2026-10-22: "maybe 5 would do") and
 * the grid the combination tests walk. The setting itself is a position, 0 to 100 (`layersAt`). */
export const LAYER_STEPS = [0, 2, 4, 6, 8] as const;
export const DEFAULT_GROUND_LIGHT = 100;
export const DEFAULT_GROUND_DARK = 8;
/**
 * Layer contrast's defaults, in the model's units (0 to 8), one per theme since 2026-11-11.
 *   light  4 (position 50): the sidebar, cards and menus sit a clear tone from the page. It was 4 until the defaults
 *          review of 2026-10-25 made it 0 (Flat), and is 4 again after the four product screens (owner, 2026-11-11, on
 *          "Should Area's default Layer contrast move from 0 to 50 in light?": "Yes, 50 in light";
 *          docs/research/product-recreations-2026-11-10): at 0 a window read as one sheet with hairlines.
 *   dark   0 (Flat): on the near-black page a tone step has almost no room, so frames set layers apart there.
 */
export const DEFAULT_LAYERS_LIGHT = 4;
export const DEFAULT_LAYERS_DARK = 0;

/**
 * Tint (axes/tint.ts, owner 2026-10-22): a hue, every degree since 2026-10-26 (5° steps before), a strength per mode in steps of 0.005 OKLCH chroma, and the
 * share of it text takes, in quarters. Auto, each tint setting's default, follows the Neutral setting's own cast.
 * Strength runs to 16 (0.08) since 2026-10-23 (a butter-yellow page needs 0.03 to 0.08: docs/research/
 * palette-customization-2026-10-23). 8 (0.04) is what every hue shows from a 95 page down; yellow has three times that
 * room, blue a third of it on a 98 page, so a step past a hue's room clips to the most sRGB shows there
 * (docs/research/custom-neutral-2026-10-22/gamut.ts). The text margin was swept to 0.08 on every hue.
 */
export const TINT_HUES = Array.from({ length: 360 }, (_, i) => i);
export const TINT_STEP = 0.005;
export const TINT_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const;
/** Text tint's share in quarters: the marks and the test grid. The setting is a position, 0 to 100 (`inkShareAt`). */
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
// Half steps since 2026-10-24 (owner, the controls review: "can you add more granularity?"): 0.006 L in light, 0.015 in dark.
// Since 2026-10-26 these are the marks and the test grid; the setting is a position, −100 to +100 (`cardToneAt`).
export const CARD_TONE_STEPS = [-4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4] as const;

/**
 * Positions (owner, 2026-10-26: "a slider that adjusts to every possible percentage maybe to the ones place only ... rather
 * than creating preset levels and percentage values that have huge steps between them"): Layer contrast, Card shade, Text
 * tint, Grey tint strength, Label tint and the three state fills take every whole number from 0 to 100 (Card shade −100 to
 * +100), each a share of the model's own range, so 100 is the strongest step the model had (Layers 4 is 50, Card tone −1
 * is −25, Text tint 2 of 4 is 50, Tint 8 of 16 is 50, Hover fill 2 of 4 is 50). The model keeps its units; only the
 * settings changed. A fill that must show keeps its floor: Hover and Pressed start at 25 (their old 1). Grey tint's odd
 * steps fall between positions (Tint 1 is 6.25) and restore at the nearest, under 0.0004 of chroma off. layers.test.ts
 * walks every position.
 */
export const POSITIONS = Array.from({ length: 101 }, (_, i) => i);
export const SIGNED_POSITIONS = Array.from({ length: 201 }, (_, i) => i - 100);
const at = (position: number, range: number) => Number((position * range / 100).toFixed(6));
/** Layer contrast at a position: 0 to 8. */
export const layersAt = (position: number) => at(position, 8);
/** Card tone at a position: −4 to +4. */
export const cardToneAt = (position: number) => at(position, 4);
/** Text tint's share at a position: 0 to 1. */
export const inkShareAt = (position: number) => at(position, 1);
/** Grey tint strength at a position: OKLCH chroma 0 to 0.08 (Tint 16). */
export const tintChromaAt = (position: number) => at(position, TINT_STEP * 16);
/** A state fill's step at a position: 0 to 4 (FILL_STEPS); hover and pressed from 25 (1). */
export const fillStepAt = (position: number) => at(position, 4);
/** A position from a step on a range of `range`, the half away from 0, as every mark rounds. */
export const positionOf = (step: number, range: number) => Math.sign(step) * Math.round(Math.abs(step) * 100 / range);
/** A position from the model's units, for the marks and for values saved before positions. */
export const layersPosition = (n: number) => positionOf(n, 8);
export const cardTonePosition = (step: number) => positionOf(step, 4);
export const inkTintPosition = (quarters: number) => positionOf(quarters, 4);
export const tintPosition = (step: number) => positionOf(step, 16);
export const fillPosition = (step: number) => positionOf(step, 4);
/**
 * An Asset card's frame (owner, 2026-10-23: "the color on the inside frame of the asset cards is different from the outside
 * card material"): the page tone, the ground components are drawn for, unless the card around it is the page tone too (Card
 * tone 0, a step clamped at white or black, or a raised card on a white page), where it takes the recessed tone if that is
 * farther from the card, so the frame always reads apart from its card as far as the layers allow. Two grounds: `frame` in
 * a tile-toned card, `frameRaised` in a raised one. Two lightnesses closer than FRAME_SAME are the same tone: under the
 * smallest Card tone step there was (0.006, a half step in light) since Card shade and Layer contrast take every position
 * (2026-10-26), where a card 0.0005 off the page would otherwise keep a page-tone frame no eye could tell from it; and
 * "farther" since then too, as an Auto Asset card is the recessed tone, under FRAME_SAME from the page at the lowest Layer
 * contrast positions. The CSS goes from one to the other over FRAME_EDGE.
 */
export const FRAME_SAME = 0.005;
export const FRAME_EDGE = 0.0001;
/** The frame in a card of lightness `card`: the page, or the recessed tone where the card is the page's and the recessed
 * tone sits farther from it. */
const frameFor = (page: number, recessed: number) => (card: number) => {
  const fromPage = Math.abs(card - page);
  return fromPage < FRAME_SAME && Math.abs(card - recessed) > fromPage ? recessed : page;
};
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
 * #b9b9b9 / #939393, hover #a4a4a4), else darkened (light) or lightened (dark) just enough to hold the target.
 * Dark muted steps back from L 0.823 (#c5c5c5, 12:1 on the page, only 1.49 from the default ink) to L 0.785 (plan A3.1,
 * 2026-11-11): the darkest grey that keeps the dark APCA content floor (Lc 60, contrast/assertions.ts) on the lightest
 * fill text sits on at the defaults (#1f1f1f, a hovered row), with a margin for the tinted neutrals. The plan aimed for
 * L 0.70 (8:1, 2.2 from the default, light's step); under Lc 60 near black no grey that dark reads as content, so the
 * floor, never lowered, is where it stops (#b9b9b9, 10.6:1, 1.70 from the default). */
export const INK_TODAY = {
  light: { body: 0.27685, muted: 0.51028, edge: 0.60999, edgeHover: -0.05102 },
  dark: { body: 0.94912, muted: 0.785, edge: 0.66325, edgeHover: 0.05546 },
} as const;
/**
 * The subtle ink (`fg-subtle`, plan A3.2, owner 2026-11-11): a third text ink for meta that must sit quieter than a
 * description (a placeholder, a shortcut, a timestamp, an empty value, line numbers), never a description. It is text, so
 * it keeps 4.6:1 (the text target) on every ground meta sits on: each layer, its rest fill (a soft field) and its hover
 * fill (a hovered row or field), never a selected or pressed plate, where meta takes the muted ink. It starts at #767676
 * in light (`light`, 4.5:1 on white) and is never darker than muted there; in dark it is the darkest ink that holds the
 * target on the lightest hover fill (`dark` the floor), never lighter than muted. A narrow step by construction: at the
 * light default (Layer contrast 50) the sidebar's hovered field binds it near muted. In dark the APCA content floor
 * (Lc 60) that muted already stands on leaves no room under it at the defaults, so subtle is muted there (`dark`, the
 * floor, is muted's); on a lighter dark ground the text target lifts muted and subtle keeps a step under it.
 */
export const SUBTLE_TODAY = { light: 0.56589, dark: 0.785 } as const;
/**
 * The disabled ink (`fg-disabled`, plan A3.2): this share of the way from its ground (the page in light, the raised layer
 * in dark) to the muted ink, so it follows the ground, the Layers settings and the cast. At the defaults it is the
 * #a4a4a4 and #666666 it was as fixed rungs. Disabled text is exempt from the text target (WCAG 1.4.3); the gate holds
 * it to 1.9:1 so it still shows.
 */
export const DISABLED_SHARE = { light: 0.558, dark: 0.6077 } as const;
/**
 * The floating ground (`bg-float`, plan A7.2, owner 2026-11-11: "Dark lifts floating and modal one layer step"): menus,
 * popovers, toasts, dialogs and drawers. In light it is the raised layer, as before. In dark it sits this far above the
 * lightest layer under it (the raised layer or a Card's tone), from DARK_LAYER_FLOOR at the least, so a menu reads a
 * step off a card and the page stays near black (#0c0c0c over #020202 at the defaults).
 */
export const FLOAT_LIFT = { dark: 0.036 } as const;
/**
 * A media placeholder's plate (`bg-plate`, plan A10.1, findings VS6 and VC7, 2026-11-11): the well a Card's picture sits
 * in before it loads, one perceived step off the card in both themes. Light: this far under the card (#f2f2f2 on white;
 * the 25 rung it was, #fafafa, measured 1.04:1). Dark: this far over it, from the dark fill floor at the least (#161616 on
 * the near-black card; the 800 rung, #282828, read as a solid block).
 */
export const PLATE_STEP = { light: 0.035, dark: 0.035 } as const;
/** Targets, a touch over WCAG's 4.5 and 3 so a rounded hex never lands under them. */
export const INK_TARGET = { text: 4.6, edge: 3.1 } as const;
/** The lightest a dark selected fill sits (2026-10-23 theme review): where white text still keeps the text target once
 * pressed by the press room (L 0.523). Strong Hover and Selected fills on a light dark ground went past it (at 20 + 8 with
 * both at 4 the selected plate was #999999 and white text 2.85:1); there the fills' step shrinks so the selected fill
 * stops here, hover and pressed keeping their order. The defaults sit under it (0.516 at most), so they are unchanged. */
export const DARK_FILL_CEILING = Number((Math.cbrt((1 + 0.05) / INK_TARGET.text - 0.05) - PRESS_ROOM.dark).toFixed(6));
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
 * to the model's 4.6, the margin rounded hexes need (state sweep 2026-10-17: 4.19:1 at 90 + 0), by L 0.996. It rose over
 * 0.02 (to a 98 page) until Card shade took every position (2026-10-26): a card 0.002 to 0.006 under white rounds to
 * #fefefe or #fdfdfd while the ink, aimed a hair over 4.5, rounds lighter, 4.47:1. */
export const MARK_HOVER_KEEP = 0.893;
export const MARK_HOVER_RAMP = 25;
export const markHoverTarget = (page: number) => 4.5 + Math.min(INK_TARGET.text - 4.5, (1 - page) * MARK_HOVER_RAMP);
/** A gray's OKLCH lightness after a black wash that keeps `keep` of each sRGB channel (gamma 2.4, no linear toe above
 * L 0.2). */
export const washedLightness = (L: number, keep: number) => Math.cbrt((((1.055 * (L ** 3) ** (1 / 2.4) - 0.055) * keep + 0.055) / 1.055) ** 2.4);
/** The roles with a vivid ink (`fg-<role>-vivid`: validation, danger rows, syntax). Each is chosen for 4.6:1 on white
 * (scale.ts chooseVivid; the code ground is white in light), so its luminance is at most VIVID_Y. On a gray light page
 * the inks mix toward black in OKLab, which scales luminance by (1 − d)³ exactly, by just enough to keep 4.6:1 on the
 * page, or on a Card toned darker than it (Card tone; 2026-10-23); on white d is 0, so the light theme as it was is
 * unchanged (sweep: 3.83:1 at 90). On the recessed layer they measure about 4.3:1 at the defaults (white's ink on L
 * 0.976); solving them there would darken them at the defaults, an open choice. Dark needs no change. */
export const VIVID_ROLES = ["accent", "danger", "warning", "caution", "success", "info", "discovery", "pink", "brown"] as const;
export const VIVID_Y = (1 + 0.05) / INK_TARGET.text - 0.05;
/** The tonal inks (`fg-<role>`: outline Buttons and Badges, links, statuses) are darker; the brightest in any accent is
 * teal's #00766a, luminance 0.140. They take the same mix, solved for that bound on the deepest ground text sits on (the
 * recessed layer or a darker card, as body text; the page until 2026-10-23, when an accent Badge on a Card at Card tone
 * −4 on a 91 page measured 4.07:1), so they hold on gray pages and grounds from about L 0.94 down (sweep: 4.18:1 at 90 + 0)
 * and are unchanged at the defaults. */
export const TONAL_ROLES = ["accent", "danger", "warning", "caution", "success", "info", "discovery", "pink", "gray", "brown"] as const;
export const TONAL_Y = 0.141;
/**
 * Tone contrast (owner, 2026-11-02: "allow for more vibrant colors in places where accessibility limits the vibrancy"): the
 * lowest WCAG ratio a status or label tone's words keep on the grounds they are solved on (scale.ts `solveInk`). 4.5 is
 * AA and the default; below it a theme trades contrast for colour, on purpose and said out loud (docs/CONTRAST.md).
 * The accent's ink (links, selection) and every neutral ink keep 4.5 at every value.
 */
export const TONE_FLOORS = [4.5, 4, 3.5, 3, 2.75, 2.5] as const;
export type ToneFloor = (typeof TONE_FLOORS)[number];
export const DEFAULT_TONE_FLOOR: ToneFloor = 4.5;
/** A floor as a token suffix: 4.5 → "450", 2.75 → "275". */
export const toneFloorId = (floor: number) => String(Math.round(floor * 100));
/** The roles whose words follow Tone contrast: the status tones and the label tones that have a hue. */
export const FLOOR_ROLES = ["danger", "warning", "caution", "success", "info", "discovery", "pink", "brown"] as const;
/** The text target the Layers model darkens a floor's inks to on a gray page: the floor plus the text rule's margin. */
export const toneFloorTarget = (floor: number) => floor + (INK_TARGET.text - DEFAULT_TONE_FLOOR);
/** The luminance bound a floor's light inks are solved under, which the Layers model darkens them by on a gray page. At
 * 4.5 it is TONAL_Y, so the default paints as it did; below, the brightest ink that keeps the floor's target on the
 * deepest ground text sits on over a white page at any Layer contrast, so a white page never darkens them (as TONAL_Y
 * holds) and the tints the words sit on are what bind: the pressed tint lands on the floor. A tighter bound, TONAL_Y's
 * headroom kept in proportion, held yellow at 2.85:1 on its tint at 2.5 (2026-11-02). */
export const toneFloorY = (floor: number) =>
  floor === DEFAULT_TONE_FLOOR ? TONAL_Y : (whiteDeepest() ** 3 + 0.05) / toneFloorTarget(floor) - 0.05;
let deepestOnWhite: number | undefined;
/** The deepest ground text sits on (recessed, card or tile) over a white page, at every Layer contrast step. */
const whiteDeepest = () => deepestOnWhite ??= Math.min(...LAYER_STEPS.map(n => {
  const m = layerLightness("light", 100, n);
  return Math.min(m.recessed, m.card, m.tile);
}));
/** Dark's APCA floor for a tone's words: Lc 60 at 4.5 (the reviewed one), 8 less per WCAG point below it (Lc 44 at
 * 2.5, about APCA's floor for large or bold text). */
export const toneFloorApca = (floor: number) => 60 - (DEFAULT_TONE_FLOOR - floor) * 8;
/** 1 where Tone contrast applies, 0 wherever Contrast is raised at all (Medium, More, or the OS asking under System):
 * there every tone is back at 4.5. */
export const TONE_FLOOR_ON = "(1 - min(1, round(up, var(--area-contrast-more, 0), 1)))";
/** Every hued ink the model derives: its token, the rung the axes write and the luminance bound it is solved for. */
export const HUED_INKS = [
  ...VIVID_ROLES.map(role => ({ token: `fg-${role}-vivid`, bound: VIVID_Y, darken: "vivid" as const })),
  // The status and label tones follow Tone contrast: their darken is solved for the floor's target and bound.
  ...TONAL_ROLES.map(role => ({ token: `fg-${role}`, bound: TONAL_Y, darken: (FLOOR_ROLES as readonly string[]).includes(role) ? "floor" as const : "tonal" as const })),
];
const darkenFor = (page: number, bound: number, target: number = INK_TARGET.text) => 1 - Math.min(1, Math.cbrt(Math.max(0, (page ** 3 + 0.05) / target - 0.05) / bound));
/** The status and label tones' darken at a Tone contrast floor on a light ground of lightness `page`, tinted by `chroma`
 * as `tintedDarken` counts it: `layer-light-floor-darken` in numbers. At 4.5 it is the tonal one. */
export const toneFloorDarken = (page: number, floor: number, chroma = 0) =>
  darkenFor(page - HUED_INK_MARGIN * Math.max(0, chroma - HUED_INK_FREE), toneFloorY(floor), toneFloorTarget(floor));
/**
 * On a tinted page the hued inks darken as if the page were this share of its tint darker (2026-10-23): the darkening is
 * solved for a gray page's luminance, and a tint lowers the page's luminance at the same lightness (a red or pink tint at
 * 8 on a 92 page left danger's vivid ink at 4.3:1). The text rule's own margin (INK_MARGIN) covers every hue to Tint 16.
 * It counts the tint past HUED_INK_FREE, the Neutral setting's own Cool and Warm casts (0.0034), so they paint as they did.
 */
export const HUED_INK_MARGIN = 0.25;
export const HUED_INK_FREE = 0.004;
export const tintedDarken = (page: number, chroma: number, bound: number) => darkenFor(page - HUED_INK_MARGIN * Math.max(0, chroma - HUED_INK_FREE), bound);
/** Tinted labels on tinted plates (Tag, Board: the ink over a 16% wash of itself) lose contrast as the dark ground under
 * the plate lightens, so they mix toward white. Two amounts, by the ground the label sits on:
 *   layer  on a card, a menu or the page: past a raised layer of L 0.30, 4× the excess (0.24 at 24 + 8, every Tag ink
 *          4.77:1 or more; sweep: brown 3.98:1 there before).
 *   fill   in a field or on a hovered row (a soft Tag picker): past a raised hover fill of L 0.315, 4.9× the excess (0.73
 *          at 24 + 8; sweep: caution 4.14:1 there before). Lifting every tag by this much left them nearly white on cards.
 * Both are 0 up to the defaults. */
export const TINT_LIFT = { layer: { from: 0.3, perL: 4 }, fill: { from: 0.315, perL: 4.9 } } as const;

/**
 * Colours held on the ground (plan B, docs/research/system-status-2026-11-18, 2026-11-19). The tone and hue outlines
 * (`<tone>-border`, `-border-strong`), the light status and label marks (`fg-<tone>-mark`, which the hue icons read) and the
 * dark vivid inks (`fg-<role>-vivid`, syntax) are palette colours solved once, on white or on the default dark surface, so
 * on a gray light page, a recessed ground or a lighter dark one they missed their floors (the cross-setting sweeps). The
 * hued inks already follow the ground (the darkens above); these follow it the same way: each keeps its colour wherever it
 * holds its floor on the ground under it and moves only as far as the floor needs where it does not.
 *
 *   light  its linear sRGB scaled down by just enough for the WCAG floor on the deepest ground it can sit on (`hold`: the
 *          recessed layer, a darker card, a tile or a well, less the tint margin). A scale of linear sRGB is the colour
 *          `color-mix(in oklab, x, black d)` gives for some d, so it darkens exactly as the hued inks do, solved per colour.
 *   dark   its linear sRGB scaled up for the WCAG floor on the lightest ground (`hold`: the raised layer, a lighter card,
 *          a tile, a well or a floating surface, plus the tint margin), then, where an APCA floor applies, its encoded
 *          sRGB scaled up for it, which is exact in APCA's luminance. Neither leaves sRGB (each stops at the brightest
 *          channel's 1). The vivid inks are held on the code ground (`code`: the raised layer or a lighter card).
 *
 * The targets are the policy floors with the quantisation margin the solvers use (semantic/stroke.ts: 1.31, 1.91, Lc 15.1;
 * INK_TARGET), so a rounded hex never lands under them. At the defaults the light outlines move only on the recessed
 * grounds' account (the sweeps measured them under their floors there); nothing else moves.
 */
export const HOLD = {
  light: { stroke: 1.31, strokeHover: 1.92, mark: INK_TARGET.edge },
  dark: { stroke: 1.32, strokeHover: 1.92, strokeHoverApca: 15.5, vivid: INK_TARGET.text, vividApca: 61 },
} as const;
/** The dark APCA content floor (Lc 60, contrast/assertions.ts) the dark secondary inks are held to on the fills they sit on,
 * and the disabled ink's (Lc 20), each with half a point for the rounded hex and the tinted neutrals. */
export const DARK_INK_APCA = { content: 60.5, disabled: 20.5 } as const;

/**
 * The selected plate at Selection Accent (`selection-surface-<ground>`, the accent's soft surface) keeps the smallest
 * state step from the ground's hover plate (color/layer-checks.ts MIN hover: light 0.009, dark 0.035, as ΔE OK), plus
 * 0.002 for the rounded hex. At a low Accent strength the soft surface nears grey, and at 30 it sat on the hover plate;
 * there it moves in lightness away from hover by just the rest of the step its hue and chroma do not already make, on
 * the side it sits on (so it never passes through the hover plate), and past hover (darker in light, lighter in dark, as
 * the neutral selected fill sits) where it sits on it exactly. Where it already reads apart it keeps its colour.
 */
export const SELECTED_STEP = { light: 0.011, dark: 0.037 } as const;

// ---------------------------------------------------------------------------
// The model, as numbers
// ---------------------------------------------------------------------------

export interface Cast { chroma: number; hue: number }
export interface LayerSelection { groundLight: number; groundDark: number; layersLight: number; layersDark: number }
export const DEFAULT_LAYER_SELECTION: LayerSelection = { groundLight: DEFAULT_GROUND_LIGHT, groundDark: DEFAULT_GROUND_DARK, layersLight: DEFAULT_LAYERS_LIGHT, layersDark: DEFAULT_LAYERS_DARK };

export interface LayerLightness {
  page: number; raised: number; recessed: number; stripe: number; step: number;
  /** Card tone's two grounds: a Card's (Auto: raised) and an Asset card's (Auto: recessed). */
  card: number; tile: number;
  /** An Asset card's frame, in a tile-toned card and in a raised one: the page, or the recessed tone where the card is the page's (FRAME_SAME). */
  frame: number; frameRaised: number;
  /** A well (`bg-well`): the recessed tone, never closer to the page than the page's own control fill, so a fill painted
   * to be seen (a Table header, a soft Surface, an image well) shows at Layer contrast 0 too, where the recessed tone is the
   * page (2026-11-01, docs/research/color-system-2026-11-01). */
  well: number;
  /** The floating ground (`bg-float`, FLOAT_LIFT): the raised layer in light, a step above it in dark. */
  float: number;
  /** A media placeholder's plate (`bg-plate`, PLATE_STEP): a step off the card. */
  plate: number;
  /** Rest, hover, pressed / selected on each ground. */
  fill: { page: [number, number, number]; raised: [number, number, number]; recessed: [number, number, number]; card: [number, number, number]; tile: [number, number, number]; frame: [number, number, number]; frameRaised: [number, number, number]; well: [number, number, number]; float: [number, number, number] };
  edge: Record<keyof typeof EDGE_OFFSET.light, number>;
  ink: { body: number; muted: number; subtle: number; disabled: number; edge: number; edgeHover: number };
  /** How far the vivid and tonal inks mix toward black (light) and tinted labels toward white (dark), 0 to 1. */
  vividDarken: number; tonalDarken: number; tintLift: number; tintLiftFill: number;
  /** The ground a held colour is solved on (HOLD), untinted: the deepest in light, the lightest in dark. */
  hold: number;
  /** The code ground the dark vivid inks are held on: the raised layer or a lighter card (light: the page or a darker card). */
  code: number;
}

const clamp01 = (L: number) => Math.min(1, Math.max(0, L));
/** The lightest ink (light) or darkest (dark) that keeps `ratio` on a gray of lightness `bg`. For a gray, OKLab
 * lightness is the cube root of relative luminance, so WCAG's ratio solves in closed form. */
const inkOn = (theme: "light" | "dark", bg: number, ratio: number) => theme === "light"
  ? Math.cbrt(Math.max(0, (bg ** 3 + 0.05) / ratio - 0.05))
  : Math.cbrt(Math.min(1, ratio * (bg ** 3 + 0.05) - 0.05));

export function layerLightness(theme: "light" | "dark", groundStep: number, n: number, fillSel: FillSelection = DEFAULT_FILL, cardTone: CardTone = "auto"): LayerLightness {
  return layerLightnessAt(theme, groundLightness(theme, groundStep), n, fillSel, cardTone);
}
/** The same, on a page of any lightness `g` (a picked page colour, color/colours.ts), not only a whole step. */
export function layerLightnessAt(theme: "light" | "dark", g: number, n: number, fillSel: FillSelection = DEFAULT_FILL, cardTone: CardTone = "auto"): LayerLightness {
  const FM = fillMultiples(fillSel);
  const s = CONTROL_STEP[theme].base + CONTROL_STEP[theme].perStep * n;
  if (theme === "light") {
    const page = g, raised = Math.min(1, g + Math.min(1 - g, LAYER_PER_STEP.light.raised * n)), recessed = g - LAYER_PER_STEP.light.recessed * n;
    const explicit = cardTone === "auto" ? undefined : clamp01(page + cardTone * CARD_TONE_UNIT.light);
    const card = explicit ?? raised, tile = explicit ?? recessed;
    const frameIn = frameFor(page, recessed), frame = frameIn(tile), frameRaised = frameIn(raised);
    const fills = (x: number) => FM.light.map(m => x - m * s) as [number, number, number];
    const well = Math.min(recessed, page - FM.light[0] * s), float = raised;
    const fill = { page: fills(page), raised: fills(raised), recessed: fills(recessed), card: fills(card), tile: fills(tile), frame: fills(frame), frameRaised: fills(frameRaised), well: fills(well), float: fills(float) };
    const edge = Object.fromEntries(Object.entries(EDGE_OFFSET.light).map(([k, d]) => [k, page - d])) as LayerLightness["edge"];
    // The deepest surface text sits on: the recessed layer, or a card darker than it (Card tone); its hovered fill for
    // edges, its selected fill for body text. A hovered soft mark sits on the page or a card, whichever is darker.
    const deepest = Math.min(recessed, card, tile, well), markGround = Math.min(page, card);
    const edgeInk = Math.min(INK_TODAY.light.edge, inkOn("light", deepest - s, INK_TARGET.edge));
    // Text is solved on the deepest selected fill pressed by PRESS_ROOM, so a press has room on every ground.
    const firmest = deepest - FM.light[2] * s - PRESS_ROOM.light;
    // Muted sits on hovered, selected and pressed rows (a count in a selected sidebar row) and on the soft-mark plate.
    const muted = Math.min(INK_TODAY.light.muted, inkOn("light", firmest, INK_TARGET.text), inkOn("light", MARK_SHADE * deepest, INK_TARGET.text), inkOn("light", washedLightness(markGround, MARK_HOVER_KEEP), markHoverTarget(markGround)));
    const ink = {
      body: Math.min(INK_TODAY.light.body, inkOn("light", firmest, INK_TARGET.text)),
      muted,
      // Subtle sits on the deepest ground's hover fill at the most (SUBTLE_TODAY), never darker than muted.
      subtle: Math.max(muted, Math.min(SUBTLE_TODAY.light, inkOn("light", deepest - FM.light[1] * s, INK_TARGET.text))),
      disabled: page + DISABLED_SHARE.light * (muted - page),
      edge: edgeInk, edgeHover: edgeInk + INK_TODAY.light.edgeHover,
    };
    return { page, raised, recessed, card, tile, frame, frameRaised, well, float, plate: card - PLATE_STEP.light, stripe: page - 0.6 * s, step: s, fill, edge, ink, vividDarken: darkenFor(Math.min(page, card), VIVID_Y), tonalDarken: darkenFor(deepest, TONAL_Y), tintLift: 0, tintLiftFill: 0, hold: deepest, code: markGround };
  }
  // The floor arrives over the first whole step of Layer contrast (positions 0 to 12), as the CSS has it, so a position
  // past Flat doesn't jump a black page's layers to 0.12 at once.
  const lift = Math.max(0, DARK_LAYER_FLOOR - g) * Math.min(1, n);
  const page = g, raised = g + lift + LAYER_PER_STEP.dark.raised * n, recessed = g + lift + LAYER_PER_STEP.dark.recessed * n;
  const explicit = cardTone === "auto" ? undefined : clamp01(page + cardTone * CARD_TONE_UNIT.dark);
  const card = explicit ?? raised, tile = explicit ?? recessed;
  const frameIn = frameFor(page, recessed), frame = frameIn(tile), frameRaised = frameIn(raised);
  const fills = (x: number) => { const rest = Math.max(x + s, DARK_FILL_FLOOR), t = Math.min(s, Math.max(0, (DARK_FILL_CEILING - rest) / FM.dark[2])); return FM.dark.map(m => rest + m * t) as [number, number, number]; };
  const well = Math.max(recessed, fills(page)[0]);
  const float = Math.max(raised, card, DARK_LAYER_FLOOR) + FLOAT_LIFT.dark;
  const fill = { page: fills(page), raised: fills(raised), recessed: fills(recessed), card: fills(card), tile: fills(tile), frame: fills(frame), frameRaised: fills(frameRaised), well: fills(well), float: fills(float) };
  // The lightest surface text sits on: the raised layer, a card lighter than it (Card tone), a well or a floating surface.
  const top = fills(Math.max(raised, card, tile, well, float));
  const edge = Object.fromEntries(Object.entries(EDGE_OFFSET.dark).map(([k, d]) => [k, Math.max(EDGE_DARK_TODAY[k as keyof typeof EDGE_DARK_TODAY], raised + d)])) as LayerLightness["edge"];
  // The lightest surface text sits on is that layer's selected fill (raised, the lightest layer in dark, unless a card is
  // lighter) pressed by PRESS_ROOM; muted text sits there too (a count in a selected row). Past L 0.563 no ink keeps 4.6:1,
  // so at the lightest grounds (24 + 8) both inks are white and the room is what white allows.
  const edgeInk = Math.max(INK_TODAY.dark.edge, inkOn("dark", top[0], INK_TARGET.edge));
  const firmest = top[2] + PRESS_ROOM.dark;
  // Muted and subtle also keep the APCA content floor on the lightest hover fill (DARK_INK_APCA; plan B, 2026-11-19): at
  // the Layers extremes the text target alone left them at Lc 54 to 58 on a hovered menu row. At the defaults it binds
  // nothing, so they are unchanged there.
  const contentOnHover = inkApcaDark(top[1], DARK_INK_APCA.content);
  const muted = Math.max(INK_TODAY.dark.muted, inkOn("dark", firmest, INK_TARGET.text), contentOnHover);
  const ink = {
    body: Math.max(INK_TODAY.dark.body, inkOn("dark", firmest, INK_TARGET.text)),
    muted,
    // Subtle: the darkest ink that keeps the text target and the APCA floor on the lightest hover fill, never lighter than muted.
    subtle: Math.min(muted, Math.max(SUBTLE_TODAY.dark, inkOn("dark", top[1], INK_TARGET.text), contentOnHover)),
    // Disabled: its share of the way to muted, and never under the disabled floor's Lc 20 on the raised layer (a black page
    // with flat Layers left it at Lc 19.3).
    disabled: Math.max(raised + DISABLED_SHARE.dark * (muted - raised), inkApcaDark(raised, DARK_INK_APCA.disabled)),
    edge: edgeInk, edgeHover: Math.min(1, edgeInk + INK_TODAY.dark.edgeHover),
  };
  const toWhite = (L: number, { from, perL }: { from: number; perL: number }) => Math.min(1, Math.max(0, (L - from) * perL));
  const tintLift = toWhite(Math.max(raised, card, tile, well, float), TINT_LIFT.layer), tintLiftFill = toWhite(top[1], TINT_LIFT.fill);
  return { page, raised, recessed, card, tile, frame, frameRaised, well, float, plate: Math.max(card + PLATE_STEP.dark, DARK_FILL_FLOOR), stripe: raised + 0.5 * s, step: s, fill, edge, ink, vividDarken: 0, tonalDarken: 0, tintLift, tintLiftFill, hold: Math.max(raised, card, tile, well, float), code: Math.max(raised, card) };
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

/**
 * The most tint a hue can take at a lightness without leaving sRGB, as two slopes under its gamut (2026-10-23): toward
 * white the room shrinks about linearly with 1 − L, toward black with L, so `min(white × (1 − L), black × L)` sits under the
 * boundary at every lightness. A strong tint past a hue's room is held there instead of clipped: clipping (what Chromium
 * paints, per channel) moves a colour's luminance and hue, which tipped control edges under 3:1 on red and orange pages
 * from Tint 12. Each slope is the boundary's least ratio on its side of the cusp, 2% inside, floored to 0.001, and only
 * where the room is under 0.085 (above it no tint reaches). docs/research/palette-customization-2026-10-23.
 */
const ROOM_CACHE = new Map<number, { white: number; black: number }>();
export function tintRoom(hue: number): { white: number; black: number } {
  const h = ((hue % 360) + 360) % 360, cached = ROOM_CACHE.get(h);
  if (cached) return cached;
  const cusp = findCusp(h, SRGB).L;
  let white = Infinity, black = Infinity;
  for (let L = 0.001; L < 0.9995; L += 0.001) {
    const room = maxChromaAt(L, h, SRGB);
    if (room > 0.085) continue;
    if (L >= cusp) white = Math.min(white, room / (1 - L)); else black = Math.min(black, room / L);
  }
  const floor = (x: number) => Number.isFinite(x) ? Math.floor(x * 0.98 * 1000) / 1000 : 9;
  const out = { white: floor(white), black: floor(black) };
  ROOM_CACHE.set(h, out);
  return out;
}

/** How much of the cast shows at lightness L: none at white (light) or black (dark), all of it CAST_FADE away. */
export const castFade = (theme: "light" | "dark", L: number) =>
  theme === "light" ? Math.min(1, Math.max(0, (1 - L) / CAST_FADE.light)) : Math.min(1, Math.max(0, L / CAST_FADE.dark));
/** The chroma a cast paints at lightness L: faded, and held inside its hue's room. */
export function castChroma(theme: "light" | "dark", L: number, cast: Cast) {
  if (cast.chroma === 0) return 0;
  const room = tintRoom(cast.hue);
  return Math.min(cast.chroma * castFade(theme, L), room.white * (1 - L), room.black * L);
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

// ---------------------------------------------------------------------------
// Held colours (HOLD) and the dark APCA inks, as numbers
// ---------------------------------------------------------------------------

const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const encode = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const wcagY = ([r, g, b]: readonly number[]) => 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
/** APCA's luminance of encoded sRGB channels (apca-w3 sRGBtoY: a plain 2.4 power). */
const apcaY = ([r, g, b]: readonly number[]) => 0.2126729 * r! ** 2.4 + 0.7151522 * g! ** 2.4 + 0.072175 * b! ** 2.4;
/** APCA's luminance of a gray of OKLab lightness L, after its black clamp (0.022, 1.414). */
export const apcaGroundY = (L: number) => {
  const y = Math.max(0, 1.055 * Math.max(0, L) ** 1.25 - 0.055) ** 2.4;
  return y + Math.max(0, 0.022 - y) ** 1.414;
};
/** The APCA luminance light text needs for `lc` on a dark gray of lightness L (reverse polarity: Lc = 114 (Yt^0.62 − Yb^0.65) − 2.7). */
export const apcaTextY = (L: number, lc: number) => ((lc / 100 + 0.027) / 1.14 + apcaGroundY(L) ** 0.65) ** (1 / 0.62);
/** The darkest gray (its OKLab lightness) that keeps `lc` on a dark gray of lightness `bg`. */
export const inkApcaDark = (bg: number, lc: number) => Math.min(1, ((apcaTextY(bg, lc) ** (1 / 2.4) + 0.055) / 1.055) ** 0.8);

/** The tint margin a held colour's ground takes (HUED_INK_MARGIN past HUED_INK_FREE), darker in light and lighter in dark. */
export const holdMargin = (chroma: number) => HUED_INK_MARGIN * Math.max(0, chroma - HUED_INK_FREE);
/** A colour held to `ratio` on a light ground of lightness `ground`: its linear sRGB scaled down only as far as that needs. */
export function holdLight(hex: string, ground: number, ratio: number): string {
  const rgb = parseHex(hex).map(linear), Y = Math.max(1e-6, wcagY(rgb));
  const k = Math.min(1, Math.max(0, (ground ** 3 + 0.05) / ratio - 0.05) / Y);
  return k >= 1 ? hex : toHex(rgb.map(c => encode(c * k)) as unknown as Rgb);
}
/** How far toward white (in encoded sRGB) a colour of APCA luminance under `target` moves to reach it: none when it holds. */
const whiteLift = (e: readonly number[], target: number) => {
  const slope = 2.4 * (1 - (0.2126729 * e[0]! + 0.7151522 * e[1]! + 0.072175 * e[2]!));
  const gate = Math.min(1, Math.max(0, (target - apcaY(e)) / HOLD_EDGE));
  return Math.min(1, Math.max(0, 1 - (1 - target) / Math.max(1e-6, slope))) * gate;
};
/** The width of the step a held colour's moves switch on over (as FRAME_EDGE), in luminance. */
const HOLD_EDGE = 0.0001;
/** A colour held to `ratio` (and Lc `apca`, if given) on a dark ground of lightness `ground`: lightened only as far as that needs. */
export function holdDark(hex: string, ground: number, ratio: number, apca?: number): string {
  const rgb = parseHex(hex).map(linear), Y = Math.max(1e-6, wcagY(rgb));
  const need = Math.min(1, ratio * (ground ** 3 + 0.05) - 0.05);
  const k = Math.min(1 / Math.max(1e-6, ...rgb), Math.max(1, need / Y));
  let e = rgb.map(c => encode(c * k)), moved = k > 1;
  if (apca !== undefined) {
    const target = apcaTextY(ground, apca);
    const c = Math.min(1 / Math.max(1e-6, ...e), Math.max(1, (target / Math.max(1e-6, apcaY(e))) ** (1 / 2.4)));
    if (c > 1) { e = e.map(x => x * c); moved = true; }
    // A bright channel can stop the scale short (a light red at its 255): then the rest of the way toward white, by the
    // tangent of APCA's luminance at white (convex in the mix, so the tangent never falls short), and only if short.
    const t = whiteLift(e, target);
    if (t > 0) { e = e.map(x => x + t * (1 - x)); moved = true; }
  }
  return moved ? toHex(e as unknown as Rgb) : hex;
}

/**
 * The accent's selected plate on a ground whose hover plate has lightness `hover` (SELECTED_STEP): the accent surface where
 * it reads apart from the hover plate, else moved in lightness past it by the rest of the step. As oklab(from …) does it.
 */
export function heldSelectedHex(theme: "light" | "dark", accentHex: string, hover: number, cast: Cast): string {
  const A = rgbToOklab(parseHex(accentHex), SRGB), C = castChroma(theme, hover, cast), h = cast.hue * Math.PI / 180;
  const T = SELECTED_STEP[theme], dab2 = (A.a - C * Math.cos(h)) ** 2 + (A.b - C * Math.sin(h)) ** 2;
  const req = Math.sqrt(Math.max(0, T * T - dab2)), keep = Math.min(1, Math.max(0, (Math.abs(A.L - hover) - req) / FRAME_EDGE));
  const target = hover + (Math.sign(A.L - hover) || (theme === "light" ? -1 : 1)) * req;
  return toHex(clampRgb(oklabToRgb({ L: A.L + (1 - keep) * (target - A.L), a: A.a, b: A.b }, SRGB)));
}

/** Every token the layers own. The neutral axis no longer writes these; base.ts derives them. */
export const LAYER_COLOR_TOKENS = [
  "bg-page", "bg-surface", "bg-subtle", "bg-stripe", "bg-code",
  "bg-component", "bg-component-hover", "bg-component-active",
  "bg-component-raised", "bg-component-raised-hover", "bg-component-raised-active",
  "bg-component-recessed", "bg-component-recessed-hover", "bg-component-recessed-active",
  "bg-card", "bg-tile", "bg-component-card", "bg-component-card-hover", "bg-component-card-active",
  "bg-component-tile", "bg-component-tile-hover", "bg-component-tile-active",
  "bg-frame", "bg-frame-raised", "bg-component-frame", "bg-component-frame-hover", "bg-component-frame-active",
  "bg-component-frame-raised", "bg-component-frame-raised-hover", "bg-component-frame-raised-active",
  "bg-well", "bg-component-well", "bg-component-well-hover", "bg-component-well-active",
  "bg-float", "bg-component-float", "bg-component-float-hover", "bg-component-float-active", "bg-plate",
  "fg-default", "fg-muted", "fg-subtle", "fg-placeholder", "fg-disabled",
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
    "bg-frame": hx(m.frame), "bg-frame-raised": hx(m.frameRaised),
    "bg-component-frame": hx(m.fill.frame[0]), "bg-component-frame-hover": hx(m.fill.frame[1]), "bg-component-frame-active": hx(m.fill.frame[2]),
    "bg-component-frame-raised": hx(m.fill.frameRaised[0]), "bg-component-frame-raised-hover": hx(m.fill.frameRaised[1]), "bg-component-frame-raised-active": hx(m.fill.frameRaised[2]),
    "bg-well": hx(m.well), "bg-component-well": hx(m.fill.well[0]), "bg-component-well-hover": hx(m.fill.well[1]), "bg-component-well-active": hx(m.fill.well[2]),
    "bg-plate": hx(m.plate), "bg-float": hx(m.float), "bg-component-float": hx(m.fill.float[0]), "bg-component-float-hover": hx(m.fill.float[1]), "bg-component-float-active": hx(m.fill.float[2]),
    "bg-component": hx(m.fill.page[0]), "bg-component-hover": hx(m.fill.page[1]), "bg-component-active": hx(m.fill.page[2]),
    "bg-component-raised": hx(m.fill.raised[0]), "bg-component-raised-hover": hx(m.fill.raised[1]), "bg-component-raised-active": hx(m.fill.raised[2]),
    "bg-component-recessed": hx(m.fill.recessed[0]), "bg-component-recessed-hover": hx(m.fill.recessed[1]), "bg-component-recessed-active": hx(m.fill.recessed[2]),
    "fg-default": ink(m.ink.body), "fg-muted": ink(m.ink.muted), "fg-subtle": ink(m.ink.subtle), "fg-placeholder": ink(m.ink.subtle), "fg-disabled": ink(m.ink.disabled),
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

/** apcaGroundY and apcaTextY as CSS: the APCA luminance light text needs for `lc` on a dark gray of lightness `L`. */
function apcaTextYCss(L: string, lc: number): string {
  const y = `pow(max(0, 1.055 * pow(${L}, 1.25) - 0.055), 2.4)`;
  return `pow(${num((lc / 100 + 0.027) / 1.14)} + pow(${y} + pow(max(0, 0.022 - ${y}), 1.414), 0.65), ${num(1 / 0.62)})`;
}
/** inkApcaDark as CSS: the darkest gray that keeps `lc` on a dark gray of lightness `bg`. */
function inkApcaDarkCss(bg: string, lc: number): string {
  return `min(1, pow((pow(${apcaTextYCss(bg, lc)}, ${num(1 / 2.4)}) + 0.055) / 1.055, 0.8))`;
}

/** The light and dark lightness of every role, as CSS math over the three settings. */
export function layerLightnessCss(): Record<string, string> {
  const gl = v("ground-light"), gd = v("ground-dark"), nl = v("layers-light"), nd = v("layers-dark");
  // The grounds the hued inks darken for (VIVID_ROLES, TONAL_ROLES), darker by HUED_INK_MARGIN of the light tint
  // (tintedDarken): the deepest one text sits on for the tonal inks, the page or a darker Card tone for the vivid ones.
  const tint = `${num(HUED_INK_MARGIN)} * max(0, ${v("cast-chroma-light")} - ${num(HUED_INK_FREE)})`;
  const tintedTonal = `calc(min(${v("layer-light-recessed")}, ${v("layer-light-card")}, ${v("layer-light-tile")}, ${v("layer-light-well")}) - ${tint})`;
  const tintedVivid = `calc(min(${gl}, ${v("layer-light-card")}) - ${tint})`;
  // The held colours' grounds (HOLD): light's is the tonal inks' own; dark's the lightest ground, lighter by the same margin.
  const tintDark = `${num(HUED_INK_MARGIN)} * max(0, ${v("cast-chroma-dark")} - ${num(HUED_INK_FREE)})`;
  const sl = v("layer-light-step"), sd = v("layer-dark-step");
  const lf = (x: string, m: string) => `calc(${x} - ${m} * ${sl})`;
  // Dark fills step from the rest fill, the step shrinking where the selected fill would pass DARK_FILL_CEILING.
  const df = (x: string, m: string) => { const rest = `max(${x} + ${sd}, ${num(DARK_FILL_FLOOR)})`; return `calc(${rest} + ${m} * clamp(0, (${num(DARK_FILL_CEILING)} - ${rest}) / ${dm[2]}, ${sd}))`; };
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
    // A well: the recessed tone, never closer to the page than the page's own control fill (rest).
    "layer-light-well": `min(${v("layer-light-recessed")}, calc(${gl} - ${v("layer-light-step")}))`,
    "layer-dark-well": `max(${v("layer-dark-recessed")}, ${gd} + ${v("layer-dark-step")}, ${num(DARK_FILL_FLOOR)})`,
    // The floating ground (FLOAT_LIFT): the raised layer in light; in dark a step above the lightest layer under it.
    "layer-light-float": v("layer-light-raised"),
    "layer-dark-float": `calc(max(${v("layer-dark-raised")}, ${v("layer-dark-card")}, ${num(DARK_LAYER_FLOOR)}) + ${num(FLOAT_LIFT.dark)})`,
    // A media placeholder's plate (PLATE_STEP): a step under the card in light, over it in dark from the fill floor.
    "layer-light-plate": `calc(${v("layer-light-card")} - ${num(PLATE_STEP.light)})`,
    "layer-dark-plate": `max(calc(${v("layer-dark-card")} + ${num(PLATE_STEP.dark)}), ${num(DARK_FILL_FLOOR)})`,
  };
  // An Asset card's frame: the page, or the recessed tone where the card is the page's and the recessed tone is farther
  // from it (frameFor): `same` is 1 under FRAME_SAME and `farther` 1 past the page's distance, each over FRAME_EDGE.
  for (const theme of ["light", "dark"] as const) for (const [name, card] of [["frame", "tile"], ["frame-raised", "raised"]] as const) {
    const page = v(`layer-${theme}-page`), other = v(`layer-${theme}-${card}`), recessed = v(`layer-${theme}-recessed`);
    const fromPage = `max(${other} - ${page}, ${page} - ${other})`, fromRecessed = `max(${other} - ${recessed}, ${recessed} - ${other})`;
    const same = `clamp(0, (${num(FRAME_SAME)} - ${fromPage}) / ${num(FRAME_EDGE)}, 1)`;
    const farther = `clamp(0, (${fromRecessed} - ${fromPage}) / ${num(FRAME_EDGE)}, 1)`;
    out[`layer-${theme}-${name}`] = `calc(${page} + (${recessed} - ${page}) * ${same} * ${farther})`;
  }
  for (const ground of ["page", "raised", "recessed", "card", "tile", "frame", "frame-raised", "well", "float"]) lm.forEach((m, i) => {
    out[`layer-light-${ground}-fill-${i}`] = lf(v(`layer-light-${ground}`), m);
    out[`layer-dark-${ground}-fill-${i}`] = df(v(`layer-dark-${ground}`), dm[i]!);
  });
  const cube = (x: string) => `pow(${x}, 3)`;
  // A Tone contrast number, or the default's wherever Contrast is raised (TONE_FLOOR_ON).
  const floorAt = (name: "target" | "y", fallback: number) =>
    `calc(${num(fallback)} + (var(${P}tone-floor-${name}, ${num(fallback)}) - ${num(fallback)}) * ${TONE_FLOOR_ON})`;
  const root3 = (x: string) => `pow(${x}, ${num(1 / 3)})`;
  const inkLightCss = (bg: string, ratio: string, today: number) => `min(${num(today)}, ${root3(`max(0, (${cube(bg)} + 0.05) / ${ratio} - 0.05)`)})`;
  const inkLight = (bg: string, ratio: number, today: number) => `min(${num(today)}, ${root3(`max(0, (${cube(bg)} + 0.05) / ${num(ratio)} - 0.05)`)})`;
  const inkDark = (bg: string, ratio: number, today: number) => `max(${num(today)}, ${root3(`min(1, ${num(ratio)} * (${cube(bg)} + 0.05) - 0.05)`)})`;
  // The deepest ground text sits on in light (recessed, or a darker card), the lightest in dark (raised, or a lighter card).
  const deep = (i: number) => `min(${v(`layer-light-recessed-fill-${i}`)}, ${v(`layer-light-card-fill-${i}`)}, ${v(`layer-light-tile-fill-${i}`)}, ${v(`layer-light-well-fill-${i}`)})`;
  const top = (i: number) => `max(${v(`layer-dark-raised-fill-${i}`)}, ${v(`layer-dark-card-fill-${i}`)}, ${v(`layer-dark-tile-fill-${i}`)}, ${v(`layer-dark-well-fill-${i}`)}, ${v(`layer-dark-float-fill-${i}`)})`;
  // Its selected fill pressed by PRESS_ROOM, where text is solved.
  const firmestLight = `calc(${deep(2)} - ${num(PRESS_ROOM.light)})`, firmestDark = `calc(${top(2)} + ${num(PRESS_ROOM.dark)})`;
  const deepest = `min(${v("layer-light-recessed")}, ${v("layer-light-card")}, ${v("layer-light-tile")}, ${v("layer-light-well")})`, markGround = `min(${v("layer-light-page")}, ${v("layer-light-card")})`;
  Object.assign(out, {
    "layer-light-body": inkLight(firmestLight, INK_TARGET.text, INK_TODAY.light.body),
    "layer-light-muted": `min(${inkLight(firmestLight, INK_TARGET.text, INK_TODAY.light.muted)}, ${inkLight(`calc(${num(MARK_SHADE)} * ${deepest})`, INK_TARGET.text, INK_TODAY.light.muted)}, ${inkLightCss(`pow(pow(calc((calc(1.055 * pow(pow(${markGround}, 3), ${num(1 / 2.4)}) - 0.055) * ${num(MARK_HOVER_KEEP)} + 0.055) / 1.055), 2.4), ${num(1 / 3)})`, `calc(4.5 + min(${num(INK_TARGET.text - 4.5)}, calc((1 - ${markGround}) * ${MARK_HOVER_RAMP})))`, INK_TODAY.light.muted)})`,
    // Subtle (SUBTLE_TODAY): on the deepest hover fill at the most, never darker than muted; disabled (DISABLED_SHARE).
    "layer-light-subtle": `max(${v("layer-light-muted")}, ${inkLight(deep(1), INK_TARGET.text, SUBTLE_TODAY.light)})`,
    "layer-light-disabled": `calc(${gl} + ${num(DISABLED_SHARE.light)} * (${v("layer-light-muted")} - ${gl}))`,
    "layer-light-edge": inkLight(deep(0), INK_TARGET.edge, INK_TODAY.light.edge),
    "layer-dark-body": inkDark(firmestDark, INK_TARGET.text, INK_TODAY.dark.body),
    // Muted and subtle keep the APCA content floor on the lightest hover fill too, disabled its own on the raised layer (DARK_INK_APCA).
    "layer-dark-content-hover": inkApcaDarkCss(top(1), DARK_INK_APCA.content),
    "layer-dark-muted": `max(${inkDark(firmestDark, INK_TARGET.text, INK_TODAY.dark.muted)}, ${v("layer-dark-content-hover")})`,
    "layer-dark-subtle": `min(${v("layer-dark-muted")}, max(${inkDark(top(1), INK_TARGET.text, SUBTLE_TODAY.dark)}, ${v("layer-dark-content-hover")}))`,
    "layer-dark-disabled": `max(calc(${v("layer-dark-raised")} + ${num(DISABLED_SHARE.dark)} * (${v("layer-dark-muted")} - ${v("layer-dark-raised")})), ${inkApcaDarkCss(v("layer-dark-raised"), DARK_INK_APCA.disabled)})`,
    "layer-dark-edge": inkDark(top(0), INK_TARGET.edge, INK_TODAY.dark.edge),
    "layer-light-vivid-darken": `calc(1 - min(1, ${root3(`max(0, (${cube(tintedVivid)} + 0.05) / ${num(INK_TARGET.text)} - 0.05) / ${num(VIVID_Y)}`)}))`,
    "layer-light-tonal-darken": `calc(1 - min(1, ${root3(`max(0, (${cube(tintedTonal)} + 0.05) / ${num(INK_TARGET.text)} - 0.05) / ${num(TONAL_Y)}`)}))`,
    // The status and label tones' darken, for the Tone contrast floor's target and bound (axes/tone-floor.ts); the
    // tonal one's at 4.5 and wherever Contrast is raised.
    "layer-light-floor-darken": `calc(1 - min(1, ${root3(`max(0, (${cube(tintedTonal)} + 0.05) / ${floorAt("target", INK_TARGET.text)} - 0.05) / ${floorAt("y", TONAL_Y)}`)}))`,
    "layer-light-hold": tintedTonal,
    "layer-dark-hold": `calc(max(${v("layer-dark-raised")}, ${v("layer-dark-card")}, ${v("layer-dark-tile")}, ${v("layer-dark-well")}, ${v("layer-dark-float")}) + ${tintDark})`,
    "layer-dark-code": `calc(max(${v("layer-dark-raised")}, ${v("layer-dark-card")}) + ${tintDark})`,
    // The APCA luminance a held colour reaches on each (apcaTextY): the hover outlines' on the lightest ground, the vivid inks' on code.
    "layer-dark-hold-apca": apcaTextYCss(v("layer-dark-hold"), HOLD.dark.strokeHoverApca),
    "layer-dark-code-apca": apcaTextYCss(v("layer-dark-code"), HOLD.dark.vividApca),
    "layer-dark-tint-lift": `clamp(0, calc((max(${v("layer-dark-raised")}, ${v("layer-dark-card")}, ${v("layer-dark-tile")}, ${v("layer-dark-well")}, ${v("layer-dark-float")}) - ${num(TINT_LIFT.layer.from)}) * ${num(TINT_LIFT.layer.perL)}), 1)`,
    "layer-dark-tint-lift-fill": `clamp(0, calc((${top(1)} - ${num(TINT_LIFT.fill.from)}) * ${num(TINT_LIFT.fill.perL)}), 1)`,
  });
  return out;
}

/**
 * The tint each mode draws in (axes/tint.ts): each tint setting at Auto takes the Neutral setting's own cast, else its
 * own value. The switches are 0 or 1, so each is one of the two, never a blend. Tint hue is one setting per mode since
 * 2026-10-27 (the exact colours plan: a light and a dark page can lean toward different hues); dark's "Same as light"
 * (`tint-hue-dark-same`, the default) takes light's setting whole, Auto, Accent or a hue, so a page that sets only Tint hue
 * draws as it always did.
 */
export function castCss(): Record<string, string> {
  const pick = (auto: string, neutral: string, own: string) => `calc(${v(auto)} * ${v(neutral)} + (1 - ${v(auto)}) * ${v(own)})`;
  // Each mode's Tint hue setting: light's own, dark's own or (Same as light) light's.
  const same = v("tint-hue-dark-same");
  const setting = (theme: "light" | "dark", name: "auto" | "accent" | "hue" | "room-white" | "room-black") => {
    const light = name === "hue" ? v("tint-hue") : name.startsWith("room") ? v(`tint-${name}`) : v(`tint-hue-${name}`);
    if (theme === "light") return light;
    const dark = name === "hue" ? v("tint-hue-dark") : name.startsWith("room") ? v(`tint-${name}-dark`) : v(`tint-hue-dark-${name}`);
    return `calc(${same} * ${light} + (1 - ${same}) * ${dark})`;
  };
  const out: Record<string, string> = {};
  for (const theme of ["light", "dark"] as const) {
    const auto = theme === "light" ? v("tint-hue-auto") : v("cast-dark-auto"), accent = theme === "light" ? v("tint-hue-accent") : v("cast-dark-accent");
    if (theme === "dark") Object.assign(out, {
      "cast-dark-auto": setting("dark", "auto"), "cast-dark-accent": setting("dark", "accent"), "cast-dark-hue-own": setting("dark", "hue"),
      "cast-dark-room-white-own": setting("dark", "room-white"), "cast-dark-room-black-own": setting("dark", "room-black"),
    });
    const own = (name: "hue" | "room-white" | "room-black") => theme === "light" ? setting("light", name) : v(`cast-dark-${name}-own`);
    // Tint hue's own value: a hue, or the accent's (its Accent value, 2026-10-23: grays that lean toward the brand colour).
    const hue = `calc((1 - ${accent}) * ${own("hue")} + ${accent} * ${v("accent-hue")})`;
    out[`cast-hue-${theme}`] = `calc(${auto} * ${v(`neutral-hue-${theme}`)} + (1 - ${auto}) * ${hue})`;
    // Each mode's room (tintRoom): the Neutral setting's for its own hue at Auto, else Tint hue's or the accent's.
    for (const side of ["white", "black"] as const)
      out[`cast-room-${side}-${theme}`] = `calc(${auto} * ${v(`neutral-room-${side}-${theme}`)} + (1 - ${auto}) * ((1 - ${accent}) * ${own(`room-${side}`)} + ${accent} * ${v(`accent-room-${side}`)}))`;
  }
  out["cast-chroma-light"] = pick("tint-light-auto", "neutral-chroma-light", "tint-chroma-light");
  out["cast-chroma-dark"] = pick("tint-dark-auto", "neutral-chroma-dark", "tint-chroma-dark");
  return out;
}

/** The chroma a cast paints at lightness `L` (castChroma as CSS): `share` of the mode's cast, faded toward white (light)
 * or black (dark), and held inside the hue's room (tintRoom). */
export function castChromaCss(theme: "light" | "dark", L: string, share = "1"): string {
  const fade = theme === "light" ? `clamp(0, (1 - ${L}) / ${num(CAST_FADE.light)}, 1)` : `clamp(0, ${L} / ${num(CAST_FADE.dark)}, 1)`;
  return `min(calc(${v(`cast-chroma-${theme}`)} * ${share} * ${fade}), calc(${v(`cast-room-white-${theme}`)} * (1 - ${L})), calc(${v(`cast-room-black-${theme}`)} * ${L}))`;
}

/** `light-dark(oklch(...), oklch(...))` for a role, tinted by the mode's cast (`share` of it: text takes Text tint's). */
function color(light: string, dark: string, share = "1"): string {
  return `light-dark(oklch(${light} ${castChromaCss("light", light, share)} ${v("cast-hue-light")}), oklch(${dark} ${castChromaCss("dark", dark, share)} ${v("cast-hue-dark")}))`;
}
/** A text ink (inkHex as CSS): Text tint's share of the cast, moved INK_MARGIN × the strength away from its ground. */
function inkColor(light: string, dark: string): string {
  return color(`calc(${light} - ${num(INK_MARGIN)} * ${v("cast-chroma-light")})`, `calc(${dark} + ${num(INK_MARGIN)} * ${v("cast-chroma-dark")})`, v("ink-tint"));
}

const LUM = "max(0.000001, 0.2126 * r + 0.7152 * g + 0.0722 * b)";
// A channel converted from linear light can land a hair under 0, where pow() has no value: each is floored at 0.
const APCA_LUM = "max(0.000001, 0.2126729 * pow(max(0, r), 2.4) + 0.7151522 * pow(max(0, g), 2.4) + 0.072175 * pow(max(0, b), 2.4))";
const CAP = "1 / max(0.000001, r, g, b)";
/** holdLight as CSS: `color` held to `ratio` on the light hold ground, its linear sRGB scaled down only as far as that needs. */
export function holdLightCss(color: string, ratio: number): string {
  const k = `min(1, max(0, (pow(${v("layer-light-hold")}, 3) + 0.05) / ${num(ratio)} - 0.05) / ${LUM})`;
  return `color(from ${color} srgb-linear calc(r * ${k}) calc(g * ${k}) calc(b * ${k}))`;
}
/** holdDark as CSS on a dark ground (`hold` or `code`): `ratio`, then, with `apca`, that ground's APCA target (HOLD). */
export function holdDarkCss(color: string, ground: "hold" | "code", ratio: number, apca = false): string {
  const G = v(`layer-dark-${ground}`);
  const k = `min(${CAP}, max(1, min(1, ${num(ratio)} * (pow(${G}, 3) + 0.05) - 0.05) / ${LUM}))`;
  const lit = `color(from ${color} srgb-linear calc(r * ${k}) calc(g * ${k}) calc(b * ${k}))`;
  if (!apca) return lit;
  const T = v(`layer-dark-${ground}-apca`);
  const c = `min(${CAP}, max(1, pow(${T} / ${APCA_LUM}, ${num(1 / 2.4)})))`;
  const scaled = `color(from ${lit} srgb calc(r * ${c}) calc(g * ${c}) calc(b * ${c}))`;
  // whiteLift: the rest of the way toward white where a bright channel stopped the scale, by the tangent at white.
  const slope = "max(0.000001, 2.4 * (1 - (0.2126729 * r + 0.7151522 * g + 0.072175 * b)))";
  const t = `(clamp(0, 1 - (1 - ${T}) / ${slope}, 1) * clamp(0, (${T} - ${APCA_LUM}) / ${num(HOLD_EDGE)}, 1))`;
  return `color(from ${scaled} srgb calc(r + ${t} * (1 - r)) calc(g + ${t} * (1 - g)) calc(b + ${t} * (1 - b)))`;
}
/** A hued colour held on the ground in both modes (HOLD): `light-dark()` of the two. */
export const holdCss = (color: string, light: number, dark: number, apca = false) =>
  `light-dark(${holdLightCss(color, light)}, ${holdDarkCss(color, "hold", dark, apca)})`;

/**
 * heldSelectedHex as CSS: the accent surface `accent` as Selection Accent's plate on `ground`, held SELECTED_STEP from the
 * ground's hover plate (its lightness `layer-<mode>-<ground>-fill-1`, its a and b the cast's chroma there at the cast's hue).
 */
export function heldSelectedCss(accent: string, ground: string): string {
  const side = (theme: "light" | "dark") => {
    const H = v(`layer-${theme}-${ground}-fill-1`), C = castChromaCss(theme, H), hue = `calc(${v(`cast-hue-${theme}`)} * 1deg)`;
    const T = SELECTED_STEP[theme];
    const req = `sqrt(max(0, ${num(T * T)} - (pow(a - ${C} * cos(${hue}), 2) + pow(b - ${C} * sin(${hue}), 2))))`;
    const keep = `clamp(0, (max(l - ${H}, ${H} - l) - ${req}) / ${num(FRAME_EDGE)}, 1)`;
    // The side it moves to: the one it sits on, so it never crosses the hover plate; past hover where it sits on it.
    const side = `(sign(l - ${H}) ${theme === "light" ? "-" : "+"} (1 - abs(sign(l - ${H}))))`;
    return `oklab(from ${accent} calc(l + (1 - ${keep}) * (${H} + ${side} * ${req} - l)) a b)`;
  };
  return `light-dark(${side("light")}, ${side("dark")})`;
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
    [`${P}bg-frame`]: both("frame"),
    [`${P}bg-frame-raised`]: both("frame-raised"),
    [`${P}bg-well`]: both("well"),
    [`${P}bg-float`]: both("float"),
    [`${P}bg-plate`]: both("plate"),
    [`${P}fg-default`]: inkColor(L("light", "body"), L("dark", "body")),
    [`${P}fg-muted`]: inkColor(L("light", "muted"), L("dark", "muted")),
    [`${P}fg-subtle`]: inkColor(L("light", "subtle"), L("dark", "subtle")),
    // A placeholder is meta: the subtle ink (plan A3.2).
    [`${P}fg-placeholder`]: inkColor(L("light", "subtle"), L("dark", "subtle")),
    [`${P}fg-disabled`]: inkColor(L("light", "disabled"), L("dark", "disabled")),
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
  // In dark the vivid inks are held on the code ground (HOLD; syntax on a lighter dark ground was Lc 53.5 at 24 + 8).
  for (const { token, darken } of HUED_INKS) {
    const rung = v(`${token}-rung`), dark = darken === "vivid" ? holdDarkCss(rung, "code", HOLD.dark.vivid, true) : rung;
    out[`${P}${token}`] = `light-dark(color-mix(in oklab, ${rung}, black calc(${v(`layer-light-${darken}-darken`)} * 100%)), ${dark})`;
  }
  const suffix = ["", "-hover", "-active"];
  // `bg-component` is the page's fill until a surface points it at its own ground; `-page` keeps the page's, so a region
  // painted the page tone inside a raised one (a Titlebar or a flush Panel in a card or a gallery tile) can point back.
  for (const [ground, prefix] of [["page", "bg-component"], ["page", "bg-component-page"], ["raised", "bg-component-raised"], ["recessed", "bg-component-recessed"], ["card", "bg-component-card"], ["tile", "bg-component-tile"], ["frame", "bg-component-frame"], ["frame-raised", "bg-component-frame-raised"], ["well", "bg-component-well"], ["float", "bg-component-float"]] as const)
    suffix.forEach((s, i) => { out[`${P}${prefix}${s}`] = both(`${ground}-fill-${i}`); });
  // The Selection role on a raised or recessed ground, as base.ts writes it on the page: the ground's pressed fill (or
  // hovered, for a band) mixed toward the accent when Selection is Accent. A surface points the role at these.
  // The selected plates at Accent keep a state step from the ground's hover plate (SELECTED_STEP, heldSelectedCss).
  const mix = (fill: string, accent: string) => `color-mix(in srgb, var(${P}${fill}), ${accent.startsWith("light-dark(") ? accent : `var(${P}${accent})`} calc(var(${P}selection-accent) * 100%))`;
  for (const ground of ["page", "raised", "recessed", "card", "tile", "frame", "frame-raised", "well", "float"] as const) Object.assign(out, {
    [`${P}selection-surface-${ground}`]: mix(`bg-component-${ground}-active`, heldSelectedCss(v("accent-surface"), ground)),
    [`${P}selection-surface-${ground}-hover`]: mix(`bg-component-${ground}-active`, heldSelectedCss(v("accent-surface-hover"), ground)),
    [`${P}selection-band-${ground}`]: mix(`bg-component-${ground}-hover`, "accent-surface"),
    [`${P}selection-band-${ground}-hover`]: mix(`bg-component-${ground}-active`, "accent-surface-hover"),
  });
  return out;
}
