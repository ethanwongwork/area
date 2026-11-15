/**
 * Interaction states as settings (owner, 2026-10-21: "capture some of these options as options for the design system
 * customization ... granular scales for hover shadow, rest shadow, hover stroke, rest stroke, selected stroke, and
 * focus keyboard ring. i want to make sure all the options are viable and distinct ... keep my current selections as
 * the default and then branch out the other axis options from there"). The defaults are the owner's picks on the state
 * page (https://claude.ai/artifact/3uKMHRhpWnPqNA6pK4WfD9, docs/research/states-2026-10-21). Every step is one number or
 * name with one effect, and every value keeps the indicators at 3:1 (CONTRAST.md).
 */
import { type AxisDefinition, PREFIX, tokens } from "./schema.ts";
import { FILL_STEPS, fillPosition, fillStepAt } from "../color/layers.ts";

/**
 * Focus ring: where the keyboard ring sits. Colour is the accent's indicator rung (semantic/aliases.ts), shared with the
 * selected stroke; the two differ by placement (APG: "the selected state must be visually distinct from the focus
 * indicator"). Two offsets: `focus-offset` for controls (a button, a chip, a field, a thumb) and `focus-gap` for
 * containers and text (a card, a tile, a toolbar, a link), which read cramped with a ring on their edge or their glyphs.
 *
 *   hug    ChatGPT (measured 2026-10-21): hugs controls (`ring-2 ring-offset-0`), 2px off tiles (`outline-offset-2`)
 *   gap    2px off everything: Atlassian (+2px), Polaris (+1px), OpenAI's Apps SDK Button (+2px)
 *   halo   fields recolour their edge and take a soft halo (Area's field focus before 2026-10-21); the rest as hug
 *   inset  drawn inside the control's edge: Primer (−2px), Radix (−1px), Fluent
 *   bold   3px, 2px off: Material 3 (3dp, +2dp); WCAG 2.4.13 (AAA) asks for a 2px perimeter, this gives more
 *
 * Fields read three switches: whether their ring is drawn (`field-focus-ring`), whether their edge takes the ring's
 * colour (`field-focus-recolor`) and whether the soft halo shows (`field-focus-halo`); base.ts derives their widths.
 *
 * The setting writes leaves (`focus-ring-width`, `focus-ring-offset`, `focus-ring-inside-solid`); base.ts derives the
 * public `focus-width`, `focus-offset` and the solid-fill placement from them and from Contrast (plan A6.1, A6.3): a ring
 * never sits flush on a solid fill (off it by `focus-gap`, or under Inset an on-colour ring inside it), and under
 * Contrast More every ring is 3px and off by the gap.
 */
const FOCUS_RING = {
  hug: { label: "Hug", description: "Hugs controls and sits 2px off cards and text, as ChatGPT.", width: "2px", offset: "0px", gap: "2px", ring: 1, recolor: 0, halo: 0, insideSolid: 0 },
  gap: { label: "Gap", description: "Sits 2px off everything, controls included (Atlassian, Polaris).", width: "2px", offset: "2px", gap: "2px", ring: 1, recolor: 0, halo: 0, insideSolid: 0 },
  halo: { label: "Halo", description: "Fields take the ring's color on their edge and a soft halo; other controls as Hug.", width: "2px", offset: "0px", gap: "2px", ring: 0, recolor: 1, halo: 1, insideSolid: 0 },
  inset: { label: "Inset", description: "Drawn inside each control's edge, so nothing outside it changes (Primer, Radix).", width: "2px", offset: "-2px", gap: "2px", ring: 1, recolor: 0, halo: 0, insideSolid: 1 },
  bold: { label: "Bold", description: "A 3px ring, 2px off everything, for keyboard-first products (Material).", width: "3px", offset: "2px", gap: "2px", ring: 1, recolor: 0, halo: 0, insideSolid: 0 },
} as const;
export type FocusRingId = keyof typeof FOCUS_RING;

export const FOCUS_RING_AXIS: AxisDefinition = {
  id: "focus-ring",
  label: "Focus ring",
  description: "Where the keyboard focus ring sits: hugging controls, off them, inside them, as a field halo, or bold.",
  defaultPreset: "hug",
  namespaces: [`${PREFIX}focus-ring-width:`, `${PREFIX}focus-ring-offset:`, `${PREFIX}focus-ring-inside-solid:`, `${PREFIX}focus-gap:`, `${PREFIX}field-focus-ring:`, `${PREFIX}field-focus-recolor:`, `${PREFIX}field-focus-halo:`],
  presets: (Object.keys(FOCUS_RING) as FocusRingId[]).map(id => {
    const r = FOCUS_RING[id];
    return {
      id, label: r.label, description: r.description,
      tokens: tokens({ "focus-ring-width": r.width, "focus-ring-offset": r.offset, "focus-ring-inside-solid": r.insideSolid, "focus-gap": r.gap, "field-focus-ring": r.ring, "field-focus-recolor": r.recolor, "field-focus-halo": r.halo }),
    };
  }),
};

/**
 * Selected stroke: how wide the edge of a selected container is (a card, an asset, a choice card), in px. It is drawn
 * inside, the container's own edge plus an inset ring, so selecting never moves anything (Radix's `::after` outline,
 * Primer's `inset 0 0 0 2px`). The colour is the accent's indicator rung, shared with the focus ring. 2 is ChatGPT's
 * selected tile (the owner's pick, 2026-10-21); 1 is the hairline the choice cards drew before; 3 is a heavy mark.
 */
export const SELECTED_STROKE_AXIS: AxisDefinition = {
  id: "selected-stroke",
  label: "Selected edge",
  description: "How wide a selected card's or tile's edge is, drawn inside it: 1, 2 or 3px.",
  defaultPreset: "2",
  namespaces: [`${PREFIX}selected-width:`],
  presets: [
    { id: "1", label: "1", description: "A 1px edge in the selection color.", tokens: tokens({ "selected-width": "1px" }) },
    { id: "2", label: "2", description: "A 2px edge in the selection color, as ChatGPT's selected tiles.", tokens: tokens({ "selected-width": "2px" }) },
    { id: "3", label: "3", description: "A 3px edge, for selection that has to read at a glance.", tokens: tokens({ "selected-width": "3px" }) },
  ],
};

/**
 * Selected tint: whether a selected container also changes its fill, under its stroke. None is the owner's pick (the
 * stroke alone, as ChatGPT); Tint is the accent's faint surface (Notion's selected blocks, Atlassian's #E9F2FE, Figma's
 * #e5f4ff), at half strength in dark, where the accent surface (#002966 for blue) reads as a fill rather than a tint
 * (Atlassian's dark selected #1C2B42); Neutral is the row's selected wash, translucent so it reads on any ground. Painted as a layer over the
 * container's own fill, so None leaves it exactly as it was.
 */
export const SELECTED_TINT_AXIS: AxisDefinition = {
  id: "selected-tint",
  label: "Selected tint",
  description: "Whether a selected card or tile also fills: none, the accent's tint, or a neutral wash.",
  defaultPreset: "none",
  // Two switches; the paint (`selected-tint`) is derived in emit/base.ts from the accent's surface and the selected wash,
  // so a scope that changes the accent or the fills re-derives it (2026-10-23 theme review: a preset reading another
  // axis's token resolved once, where the setting was declared).
  namespaces: [`${PREFIX}selected-tint-accent:`, `${PREFIX}selected-tint-neutral:`],
  presets: [
    { id: "none", label: "None", description: "The stroke alone marks selection.", tokens: tokens({ "selected-tint-accent": 0, "selected-tint-neutral": 0 }) },
    { id: "tint", label: "Tint", description: "The accent's faint tint under the stroke.", tokens: tokens({ "selected-tint-accent": 1, "selected-tint-neutral": 0 }) },
    { id: "neutral", label: "Neutral", description: "The row's selected wash under the stroke.", tokens: tokens({ "selected-tint-accent": 0, "selected-tint-neutral": 1 }) },
  ],
};

/**
 * Danger hover: the plate under a hovered, highlighted or pressed destructive row ("Delete" in a Menu or Context menu).
 * Tint is the owner's pick (2026-10-23, "the better ux and more visually appealing option"): the row's own plate,
 * at the same lightness, turned to the danger hue, so the red label sits on a red plate as in shadcn's destructive item
 * (`focus:bg-destructive/10`, dark `/20`) and Primer's danger ActionList item (`control-danger-bgColor-hover`). Neutral
 * keeps every row on the same grey plate, the red label alone marking danger (ChatGPT's "Delete", measured 2026-09-26).
 * The plate keeps the neutral plate's lightness, so the red ink solved for that plate holds on both (surface.css).
 */
export const DANGER_HOVER_AXIS: AxisDefinition = {
  id: "danger-hover",
  label: "Danger hover",
  description: "A destructive row's hover plate: tinted red, or the same grey as every other row.",
  defaultPreset: "tint",
  namespaces: [`${PREFIX}row-danger-tint:`],
  presets: [
    { id: "tint", label: "Tint", description: "A red plate under the red label (shadcn, Primer).", tokens: tokens({ "row-danger-tint": 1 }) },
    { id: "neutral", label: "Neutral", description: "The grey plate every row takes; the red label marks danger (ChatGPT).", tokens: tokens({ "row-danger-tint": 0 }) },
  ],
};

/**
 * Hover stroke: how far a control's edge darkens under the pointer (a field, an outline button, a select), 0 (stays) to 4.
 * 2 is the step Area always took and the owner kept (2026-10-21; light #e2e2e2 → #d4d4d4). Every step is the same
 * distance in lightness, so neighbours read apart, and Contrast More still lifts the hover edge to its 3:1 stroke.
 */
export const HOVER_STROKE_AXIS: AxisDefinition = {
  id: "stroke-hover",
  label: "Hover edge",
  description: "How far a control's edge darkens under the pointer: 0 (it stays) to 4.",
  defaultPreset: "2",
  namespaces: [`${PREFIX}stroke-hover-step:`],
  presets: [0, 1, 2, 3, 4].map(i => ({
    id: String(i),
    label: i === 0 ? "0 (None)" : String(i),
    description: i === 0 ? "The edge stays as it rests; the fill carries hover." : `The edge darkens ${i} step${i === 1 ? "" : "s"}.`,
    tokens: tokens({ "stroke-hover-step": i }),
  })),
};

/**
 * The state fills: how dark the plate under a hovered, selected and pressed row or ghost control is, each a step scale
 * built on the one before (color/layers.ts FILL_STEPS), so hover < selected < pressed at every combination. The opaque
 * fills follow Layers and the inks re-solve against them; the translucent twins (`bg-hover`, `bg-active`, `bg-pressed`)
 * follow the same steps (emit/base.ts). Defaults: hover and selected as Area always had them (5% and 7%), pressed the
 * owner's firmer press (2026-10-21, ChatGPT's 12%, as far as muted text keeps 4.6:1; was 3% past selected).
 */
const fillAxis = (id: string, label: string, description: string, key: keyof typeof FILL_STEPS, zero: string | null, say: (i: number) => string): AxisDefinition => {
  // Every position from the floor to 100 (2026-10-26; whole steps 0 to 4 before, so 2 is now 50): the token stays a step,
  // a quarter of 100 each, which every formula reads (emit/base.ts, color/layers.ts, styles/layers.css).
  const { min, max, default: fallback } = FILL_STEPS[key];
  return {
    id, label, description, defaultPreset: String(fillPosition(fallback)),
    namespaces: [`${PREFIX}${id}-step:`],
    presets: Array.from({ length: fillPosition(max) - fillPosition(min) + 1 }, (_, k) => fillPosition(min) + k).map(position => ({
      id: String(position),
      label: position === 0 && zero ? `0 (${zero})` : String(position),
      description: say(fillStepAt(position)),
      tokens: tokens({ [`${id}-step`]: fillStepAt(position) }),
    })),
  };
};
export const FILL_HOVER_AXIS = fillAxis("fill-hover", "Hover fill", "How dark the plate under a hovered row or ghost control is, 25 (faintest) to 100.", "hover", null,
  i => `Hover plate ${i * 25} of 100 (50 is about 5% black over white).`);
export const FILL_SELECTED_AXIS = fillAxis("fill-selected", "Selected fill", "How much firmer a selected row's plate is than hover, 0 (the same) to 100.", "selected", "Same as hover",
  i => i === 0 ? "A selected row takes the hover plate (Notion, ChatGPT); its check or ink carries selection." : `Selected sits ${i * 25} of 100 past hover.`);
export const FILL_PRESSED_AXIS = fillAxis("fill-pressed", "Pressed fill", "How much firmer the plate is while pressed, 25 to 100: the share of the way from selected to the firmest press.", "pressed", null,
  i => i === 4 ? "The firmest press muted text allows: ChatGPT's 12% where it can be." : `${i * 25}% of the way to the firmest press.`);

export const STATE_AXES: readonly AxisDefinition[] = [FOCUS_RING_AXIS, HOVER_STROKE_AXIS, SELECTED_STROKE_AXIS, SELECTED_TINT_AXIS, FILL_HOVER_AXIS, FILL_SELECTED_AXIS, FILL_PRESSED_AXIS, DANGER_HOVER_AXIS];
