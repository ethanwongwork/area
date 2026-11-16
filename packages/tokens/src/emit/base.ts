/**
 * Tokens that belong to no axis: the spacing ramp, z-layers, and the cross-axis
 * derivations.
 *
 * Spacing primitives are deliberately fixed. Compact density means components reach for
 * smaller steps, not that 12px quietly becomes 10px -- a scale that moves under you is a
 * scale you cannot reason about.
 *
 * They are also named by their pixel value. `--area-space-12` needs no lookup table; a
 * t-shirt ladder of 3xs/2xs/xs/2s/s/2m/m does, and invites exactly the kind of renumbering
 * that silently shifts every consumer.
 */
import { PREFIX } from "../axes/schema.ts";
import { MOTION_AXIS, duration } from "../axes/motion.ts";
import { SOFT_EDGE, SOFT_EDGE_FILTER } from "../axes/surface.ts";
import { type GroundEdge, contrastMix, layerCss, onGround, rawEdge, strokeEdge, strokeEdgeHover } from "../color/layers.ts";
import { depthDerived } from "../axes/depth.ts";
import { strokeGroupDerived } from "../axes/stroke-groups.ts";
import { accentDerived, statusDerived } from "../axes/accent.ts";
import { toneDerived } from "../axes/tone-tint.ts";
import { SEMANTIC_ALIASES } from "../semantic/aliases.ts";
import { brandDefaultCss } from "../semantic/brand.ts";
import { DATA_STATUS } from "../color/series.ts";
import { LABEL_MARK_TONES, TONE_FAMILY, hueRoleCss, markRung } from "../semantic/hues.ts";

/** 4px base with 2px, 6px and 10px half-steps for tight control interiors. */
export const SPACE_RAMP = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const;

/**
 * Type primitives.
 *
 * The same two-tier shape colour uses: a fixed ramp of raw stops, and a semantic layer
 * that points at them. A composite such as `--area-text-lg-size` resolves to
 * `var(--area-size-16)` rather than to a literal, so the typography axis picks different
 * stops rather than multiplying arbitrary numbers -- which is what keeps every derived
 * size on the ramp instead of landing on 12.25px.
 */
export const SIZE_RAMP = [
  // 19 to 82 between the old rungs: titles and display scale with the type size (axes/type-size.ts, 2026-10-19); 25 for
  // the 20 title at type 16 (Cursor's titles, 2026-11-02).
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 34, 37, 40, 48, 52, 56, 60, 62, 64, 67,
  72, 77, 82, 96, 128,
] as const;

export const LEADING_RAMP = [
  12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 52, 56, 60, 62, 64, 68, 72, 78, 80, 82, 96,
  112, 136,
] as const;

/**
 * Weight stops, named by their OpenType `wght` value. The half-steps exist because Geist
 * is variable: 450 and 550 are reachable in it and not in a platform font.
 */
export const WGHT_RAMP = [100, 200, 300, 400, 450, 500, 550, 600, 700, 800, 900] as const;

/** Every radius the system can express. Components use the semantic radius tokens instead. */
export const RADIUS_RAMP = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32] as const;

export const Z_LAYERS = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 30,
  dropdown: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

export function baseTokens(): Record<string, string> {
  // The focus ring's width and offsets belong to the Focus ring setting (axes/states.ts).
  const out: Record<string, string> = { "--area-contrast-more": "0", "--area-stroke-width": "1px", "--area-input-inline-size": "16rem" };
  // One device pixel (css.ts restates it per screen density: 0.5px at 2x, a third at 3x), the Hairline Stroke width
  // (axes/surface.ts; owner, 2026-10-31, pick p3 of docs/research/claude-code-ui-audit-2026-10-31.md). A leaf, so it
  // inherits through setting scopes.
  out["--area-device-pixel"] = "1px";
  // How far the ground under an edge sits past the page (light) or the raised layer (dark): 0 here; styles/layers.css sets
  // it on every ground (color/layers.ts GROUND_EDGES). Not derived, so it inherits through setting scopes.
  out["--area-edge-shift-light"] = "0";
  out["--area-edge-shift-dark"] = "0";
  // Keyboard legends use the same native UI face for letters and modifier symbols.
  // Keep this separate from the creative typography axis: a custom text font may lack
  // keyboard glyphs, causing individual characters to fall back at different metrics.
  out["--area-font-keyboard"] = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  // A quarter of a character, rounded to whole pixels, so the keys after the first sit on the pixel grid (spacing
  // audit 2026-10-17: 0.25ch computed 1.94 / 1.78 and left every later glyph between pixels).
  out["--area-keyboard-gap"] = "round(nearest, 0.25ch, 1px)";

  // Pure black and white. Named because they are real answers, not placeholders: every
  // `fg-on-*` token resolves to one of these two after the scale measures which is
  // readable on its own solid fill.
  out[`${PREFIX}white`] = "#ffffff";
  out[`${PREFIX}black`] = "#000000";

  for (const step of SPACE_RAMP) out[`${PREFIX}space-${step}`] = `${step}px`;
  for (const step of SIZE_RAMP) out[`${PREFIX}size-${step}`] = `${step}px`;
  for (const step of LEADING_RAMP) out[`${PREFIX}leading-${step}`] = `${step}px`;
  for (const step of WGHT_RAMP) out[`${PREFIX}wght-${step}`] = String(step);
  for (const step of RADIUS_RAMP) out[`${PREFIX}radius-${step}`] = `${step}px`;
  out[`${PREFIX}radius-full`] = "9999px";

  for (const [name, value] of Object.entries(Z_LAYERS)) out[`${PREFIX}z-${name}`] = String(value);

  // The one disabled dimming, for controls that dim rather than repaint (audit S21b; was 0.5
  // written in 17 rules). Text fields repaint instead (DESIGN_SYSTEM "Shared state paint").
  out[`${PREFIX}opacity-disabled`] = "0.5";

  // The scale an overlay enters from and leaves to (docs/MOTION.md, "Overlays"; owner 2026-11-07, system gaps C7): Dialog,
  // Command palette, Popover, Menu, Select's list, Tooltip and Hover card. Was 0.97 written in each (Radix Themes 0.97;
  // Cursor's modal .97). Reduced motion resolves every duration to 0, so it never moves there.
  out[`${PREFIX}overlay-scale`] = "0.97";

  // Charts' status colours (color/series.ts DATA_STATUS; data views rounds 14 and 15): good, some trouble, failed, for
  // trackers, uptime and CI runs. The same in light and dark; Area's success, warning and danger roles stay for text.
  for (const [tone, value] of Object.entries(DATA_STATUS)) out[`${PREFIX}data-${tone}`] = value;

  // Read by AreaProvider in development to detect a missing stylesheet, which otherwise
  // presents as "the components render but look unstyled" with no error anywhere.
  out[`${PREFIX}loaded`] = "1";

  return out;
}

/** Role tokens: `name: color-mix(neutral endpoint, accent endpoint by the switch)`. */
function role(_id: string, switchName: string, map: Record<string, [string, string]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, [neutral, accent]] of Object.entries(map)) {
    out[`${PREFIX}${name}`] =
      `color-mix(in srgb, var(${PREFIX}${neutral}), var(${PREFIX}${accent}) calc(var(${PREFIX}${switchName}) * 100%))`;
  }
  return out;
}

/**
 * Cross-axis derivations.
 *
 * These are the only places two axes meet, and they are expressed as live calc() rather
 * than baked pixels for two reasons: baking would require a block per density-times-radius
 * combination, and custom properties inherit -- so a live calc() is what lets
 * `<aside data-area-ui="compact">` correctly re-derive its own corner radius.
 */
/**
 * The dark translucent state washes (`bg-hover`, `bg-active`, `bg-pressed`): white at 4% a Hover step, 6% more a Selected
 * step and 0.425% more a Pressed step, the press stopping at `max`. Hover stops where a selected plate still sits
 * `gap` above it with the press's room left, and selected where the press has its room, so the three stay in order.
 * 8% hover and 14% selected at the defaults (plan A4, owner 2026-11-11: the dark plate's step off near black matches the
 * light wash's 5% off white; it was 7% a step and 5% more, 14% and 19%, two to three times every desktop reference).
 */
export const DARK_WASH = { hover: 0.04, selected: 0.06, pressed: 0.00425, max: 0.22, gap: 0.02 } as const;
const DARK_SELECTED_MAX = DARK_WASH.max - 4 * DARK_WASH.pressed, DARK_HOVER_MAX = DARK_SELECTED_MAX - DARK_WASH.gap;
/** The washes' alphas at a setting, as the CSS computes them. */
export function darkWashAlphas(hover: number, selected: number, pressed: number): { hover: number; selected: number; pressed: number } {
  const h = Math.min(DARK_HOVER_MAX, DARK_WASH.hover * hover), s = Math.min(DARK_SELECTED_MAX, h + DARK_WASH.selected * selected);
  return { hover: h, selected: s, pressed: s + DARK_WASH.pressed * pressed };
}
function darkWashCss(state: "hover" | "selected" | "pressed"): string {
  const step = (name: string) => `var(${PREFIX}fill-${name}-step)`;
  const num = (x: number) => String(Number(x.toFixed(6)));
  const h = `min(${num(DARK_HOVER_MAX)}, ${DARK_WASH.hover} * ${step("hover")})`;
  const s = `min(${num(DARK_SELECTED_MAX)}, ${h} + ${DARK_WASH.selected} * ${step("selected")})`;
  return state === "hover" ? `calc(${h})` : state === "selected" ? `calc(${s})` : `calc(${s} + ${DARK_WASH.pressed} * ${step("pressed")})`;
}

export function derivedTokens(): Record<string, string> {
  const out = derivedOnPage();
  // The edge roles written here are on the page (`<role>-page`); each one on the ground under it (color/layers.ts GROUND_EDGES).
  for (const role of ["edge-control", "edge-control-hover", "edge-selected", "edge-control-strong", "fill-toggle", "fill-toggle-hover", "composer-edge", "composer-focus-color"] as const satisfies readonly GroundEdge[])
    out[`${PREFIX}${role}`] = onGround(role);
  return out;
}

function derivedOnPage(): Record<string, string> {
  return {
    // The Elevation roles, from Depth and the Edge and Depth levers (axes/depth.ts): every input is an axis, so they
    // re-derive wherever one is set.
    ...depthDerived(),
    // Each stroke group's edge (axes/stroke-groups.ts): its amount and Edge contrast over what is under it.
    ...strokeGroupDerived(),
    // The accent's paint (axes/accent.ts): each colour at the Accent strength, the solid and its hover at the Solid step,
    // from the Accent setting's full-strength tokens, so a subtree that sets any of the three re-derives.
    ...accentDerived(),
    // The status tones' colours (axes/accent.ts Status colours): full, or quieted with the accent.
    ...statusDerived(),
    // Each status and label tone's soft surfaces at the Tone tint and its ink at that tint and the Tone contrast floor
    // (axes/tone-tint.ts, axes/tone-floor.ts), from the colours above.
    ...toneDerived(),
    // The brand roles where no brand is set (semantic/brand.ts, 2026-10-26): secondary and tertiary as the accent, the brand
    // surfaces as the page and the inverse ground. A brand (phase 2) writes its own over them.
    ...brandDefaultCss().derived,
    // Presentation aliases choose existing palette endpoints. A preference is not a color
    // axis: it changes emphasis while every axis keeps its own namespaces.
    // Each mixes from its edge at standard contrast (rawEdge), by the level, as every border-* does (color/layers.ts), so a
    // control edge and a seam move the same share at Medium and More (owner, 2026-10-18).
    [`${PREFIX}edge-control-page`]: contrastMix(strokeEdge("faint"), `var(${PREFIX}stroke-control)`),
    // The hover edge a step past rest: border-subtle in light (#d4 after #e2). In dark border-subtle is the rest edge's own
    // value (both #333, today and in the Layers model), so a field's hover drew nothing; it takes `border` (#4b4b4b),
    // the dark step the model's edges use (hover and pressed sweep 2026-10-17: Custom select, Input, Select, Textarea).
    // The step itself is the Hover stroke setting (axes/states.ts; 2 is the step above, light subtle and dark border).
    [`${PREFIX}edge-control-hover-page`]: contrastMix(strokeEdgeHover(), `var(${PREFIX}stroke-control-hover)`),
    [`${PREFIX}edge-selected-page`]: contrastMix(strokeEdge("faint"), `var(${PREFIX}stroke-control)`),
    [`${PREFIX}edge-accent`]: `color-mix(in srgb, var(${PREFIX}accent-border), var(${PREFIX}accent-indicator) calc(var(${PREFIX}contrast-more) * 100%))`,
    [`${PREFIX}fill-toggle-page`]: contrastMix(rawEdge("subtle"), `var(${PREFIX}stroke-control)`),
    [`${PREFIX}fill-toggle-hover-page`]: contrastMix(rawEdge("border"), `var(${PREFIX}stroke-control-hover)`),
    // The strong hover edge, a step past edge-control-hover: an unchecked Checkbox or Radio and a selected Chip under
    // the pointer (consistency pass 2026-10-12: both had written the mix themselves).
    // The decorative frame's width: the Surface setting's (`frame-width`, 1px or 0), or 1px under increased contrast
    // (owner, 2026-10-15: "go with your rec"), as macOS Increase Contrast adds borders and forced colours restore them.
    // Insets that count the frame follow it, so a surface keeps its outer size. docs/research/surface-2026-10-14.md.
    // Any raised contrast (Medium's 0.5 too) brings the whole pixel back.
    [`${PREFIX}border-width`]: `max(var(${PREFIX}frame-width), round(up, calc(var(${PREFIX}contrast-more) * 1px), 1px))`,
    // The Rest shadow setting's subtle shadow round surfaces (axes/surface.ts), with the frame or instead of it (owner,
    // 2026-10-19): its own setting, no longer switched on by a 0 frame.
    [`${PREFIX}shadow-edge`]: SOFT_EDGE,
    [`${PREFIX}shadow-edge-filter`]: SOFT_EDGE_FILTER,
    [`${PREFIX}edge-control-strong-page`]: contrastMix(strokeEdge("hover"), `var(${PREFIX}stroke-control-hover)`),
    // The page, its layers, control fills on each ground, edges and inks: the Layers model (color/layers.ts), live over
    // the ground and layer-contrast settings and the Neutral cast. border-card (Card, Composer, Code block) is among
    // them: today's neutral-100 / 750, now a step from the page.
    ...layerCss(),
    // Tonal strokes (`<tone>-border`, `-border-strong`: outline Badges and Buttons, Box model, tone frames): the axes write
    // each as its rung (axes/color.ts) and it goes the same share of the way to its tone's ink as the neutral edges go to
    // theirs (owner, 2026-10-18: "the contrast control doesnt look like it equally applies to all component colors").
    ...Object.fromEntries(Object.entries(SEMANTIC_ALIASES).filter(([, alias]) => alias.kind === "stroke" || alias.kind === "strokeHover")
      .map(([name]) => [`${PREFIX}${name}`, contrastMix(`var(${PREFIX}${name}-rung)`, `var(${PREFIX}fg-${name.replace(/-border(-strong)?$/, "")})`)])),
    // The neutral soft-mark plate (audit S6a): Badge soft, Chip input, soft Count. Translucent, so a mark stays visible
    // on a hovered or selected row plate; hover lays bg-hover's 5% wash over it (6% + 5% of 94% = 10.7%).
    [`${PREFIX}bg-mark`]: "light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.1))",
    [`${PREFIX}bg-mark-hover`]: "light-dark(rgb(0 0 0 / 0.107), rgb(255 255 255 / 0.226))",
    // The soft mark pressed (plan B7.4): past hover by the Pressed fill's share of the mark's equal step, 15.4% black and
    // 24% white at the default 4 (Chip input's measured press, as far as its label holds 4.5:1 at dark 24 + 8), and
    // 11.9% / 23% at 1, so every Pressed step shows past hover.
    [`${PREFIX}bg-mark-pressed`]: `light-dark(rgb(0 0 0 / calc(0.107 + 0.01175 * var(${PREFIX}fill-pressed-step))), rgb(255 255 255 / calc(0.226 + 0.0035 * var(${PREFIX}fill-pressed-step))))`,
    // The quiet ink of icon actions (audit S6b): neutral outline and ghost Buttons, their groups and Split button.
    [`${PREFIX}fg-quiet`]: `color-mix(in oklab, var(${PREFIX}fg-default), var(${PREFIX}fg-muted) 75%)`,
    // Editable fields keep their 1px edge and colour it with the focus role, plus a halo of
    // the same colour at the tone halos' 14% (audit S1, ChatGPT's 1px focus edge). Increased
    // contrast adds the regular 2px outline and expands the halo by that same width.
    [`${PREFIX}field-focus-color`]: `var(${PREFIX}focus-color)`,
    [`${PREFIX}field-focus-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}field-focus-color) 14%, transparent)`,
    // Composer is a surface that holds a field; it keeps the quiet neutral focus edge. Its resting frame is the card
    // edge, and the strong control stroke under increased contrast, where a field's boundary targets 3:1 (CONTRAST.md;
    // the card edge alone read 1.16:1 light, 1.33:1 dark, 2026-10-15).
    [`${PREFIX}composer-edge-page`]:
      contrastMix(strokeEdge("card"), `var(${PREFIX}stroke-control)`),
    [`${PREFIX}composer-focus-color-page`]:
      contrastMix(rawEdge("subtle"), `var(${PREFIX}focus-color)`),
    // The keyboard ring (plan A6.1, A6.3): the Focus ring setting's width and offset (axes/states.ts), and under Contrast
    // More (contrast-more 1, the OS preference included) the Bold preset's 3px off by the gap at every preset; the levels
    // below More keep the setting's ring. `round(down, contrast-more, 1)` is 1 only at More.
    [`${PREFIX}focus-width`]:
      `max(var(${PREFIX}focus-ring-width), calc(3px * round(down, var(${PREFIX}contrast-more), 1)))`,
    [`${PREFIX}focus-offset`]:
      `calc(var(${PREFIX}focus-ring-offset) + (var(${PREFIX}focus-gap) - var(${PREFIX}focus-ring-offset)) * round(down, var(${PREFIX}contrast-more), 1))`,
    // A ring never sits flush on a solid fill (a solid Button or Badge link), which at the shipped Selection is the
    // ring's own colour: it stands off by the gap, or under Inset runs inside the fill one pixel in, in the fill's own
    // ink (`focus-solid-inside` 1: the component mixes its on-colour in), so it touches the fill on both sides.
    [`${PREFIX}focus-solid-inside`]:
      `calc(var(${PREFIX}focus-ring-inside-solid) * (1 - round(down, var(${PREFIX}contrast-more), 1)))`,
    [`${PREFIX}focus-solid-offset`]:
      `calc(var(${PREFIX}focus-gap) * (1 - var(${PREFIX}focus-solid-inside)) - (var(${PREFIX}focus-width) + 1px) * var(${PREFIX}focus-solid-inside))`,
    // A field's focus, by the Focus ring setting (axes/states.ts): the ring when the setting draws one (and always under
    // increased contrast), the soft halo when it does not; the field's edge takes the ring's colour only in Halo.
    [`${PREFIX}field-focus-outline-width`]:
      `calc(var(${PREFIX}focus-width) * max(var(${PREFIX}field-focus-ring), var(${PREFIX}contrast-more)))`,
    [`${PREFIX}field-focus-halo-width`]:
      `calc((var(${PREFIX}space-2) + var(${PREFIX}focus-width) * var(${PREFIX}contrast-more)) * var(${PREFIX}field-focus-halo))`,
    // The translucent plates, for a plate over a ground a component cannot know (a segmented track, a swatch cell, a
    // control on a row): the state fills' steps as washes (axes/states.ts). At the defaults they are what they were,
    // hover #141414 at 5% and selected black at 7% (dark white 8% / 14% since plan A4, 2026-11-11; 14% / 19% before);
    // pressed adds 1.375% a step past selected,
    // 5.5% at the default 4 (12.5% black, about ChatGPT's 12%), and dark 0.425% a step. The dark washes stop at 22%: a
    // translucent plate cannot be bounded by its ink, and 24% left muted text at 4.43:1 at dark 24 + 8 (2026-10-16). Hover
    // stops at 18.3% and selected at 20.3% (`DARK_WASH`), so selected stays a step past hover and every press shows:
    // capped one by one at 21% / 21% / 22%, at Hover 3 and 4 every Selected and Pressed step equalled hover (theme review
    // 2026-10-24). The defaults sit under both stops (8%, 14%, 15.7%).
    [`${PREFIX}bg-hover`]: `light-dark(rgb(20 20 20 / calc(0.05 * max(1.25, 1.5 + 0.375 * (var(${PREFIX}fill-hover-step) - 2)) / 1.5)), rgb(255 255 255 / ${darkWashCss("hover")}))`,
    [`${PREFIX}bg-active`]: `light-dark(rgb(0 0 0 / calc(0.07 * (max(1.25, 1.5 + 0.375 * (var(${PREFIX}fill-hover-step) - 2)) + 0.625 * var(${PREFIX}fill-selected-step)) / 2.125)), rgb(250 250 250 / ${darkWashCss("selected")}))`,
    [`${PREFIX}bg-pressed`]: `light-dark(rgb(0 0 0 / calc(0.07 * (max(1.25, 1.5 + 0.375 * (var(${PREFIX}fill-hover-step) - 2)) + 0.625 * var(${PREFIX}fill-selected-step)) / 2.125 + 0.01375 * var(${PREFIX}fill-pressed-step))), rgb(252 252 252 / ${darkWashCss("pressed")}))`,
    // The pressed wash's strength as numbers, light and dark (plan B7.4): layers.css caps it on each ground's control fill
    // (`bg-pressed-track`), which needs the alpha apart from the colour.
    [`${PREFIX}wash-pressed-light`]: `calc(0.07 * (max(1.25, 1.5 + 0.375 * (var(${PREFIX}fill-hover-step) - 2)) + 0.625 * var(${PREFIX}fill-selected-step)) / 2.125 + 0.01375 * var(${PREFIX}fill-pressed-step))`,
    [`${PREFIX}wash-pressed-dark`]: darkWashCss("pressed"),
    // Selected tint (axes/states.ts): under a selected container's stroke, the accent's faint surface (half in dark, where
    // it reads as a fill) or the selected wash, by the setting's two switches; transparent at None.
    [`${PREFIX}selected-tint`]: `color-mix(in srgb, light-dark(var(${PREFIX}accent-surface), color-mix(in srgb, var(${PREFIX}accent-surface) 50%, transparent)) calc(var(${PREFIX}selected-tint-accent) * 100%), color-mix(in srgb, var(${PREFIX}bg-active) calc(var(${PREFIX}selected-tint-neutral) * 100%), transparent))`,
    // Emphasis roles (axes/emphasis.ts). Each role is its neutral endpoint mixed toward the
    // accent by the role's 0/1 switch, so the default renders exactly the neutral paint and
    // a subtree that changes theme, neutral or accent re-derives the role here.
    ...role("action", "action-accent", {
      "action-solid": ["neutral-solid", "accent-solid"],
      "action-solid-hover": ["neutral-solid-hover", "accent-solid-hover"],
      "fg-on-action": ["fg-on-neutral", "fg-on-accent"],
      "fg-action": ["fg-default", "fg-accent"],
    }),
    ...role("selection", "selection-accent", {
      "selection-solid": ["neutral-solid", "accent-solid"],
      "selection-solid-hover": ["neutral-solid-hover", "accent-solid-hover"],
      "fg-on-selection": ["fg-on-neutral", "fg-on-accent"],
      "fg-selection": ["fg-default", "fg-accent"],
      "selection-surface": ["bg-component-active", "accent-surface"],
      "selection-surface-hover": ["bg-component-active", "accent-surface-hover"],
      "selection-band": ["bg-component-hover", "accent-surface"],
      "selection-band-hover": ["bg-component-active", "accent-surface-hover"],
      "selection-edge": ["edge-control-hover", "edge-accent"],
      // A selected container's edge (Card, Asset card, choice cards): the same colour family as the marks inside it, so a
      // selected radio card never draws a blue ring round a dark dot (owner, 2026-10-22, option B). At Accent it is the
      // accent's indicator rung, which clears 3:1 on every ground for every accent; at Neutral, the neutral solid.
      "stroke-selected": ["neutral-solid", "accent-indicator"],
      // The keyboard ring follows Selection too (owner, 2026-10-22), so Selection Neutral is an entirely neutral look and
      // Accent keeps the blue ring. It still reads apart from a selected edge by placement: on or outside, never inside.
      "focus-color": ["neutral-solid", "accent-indicator"],
      // Selected text (`::selection`, base.css) follows Selection too, so Neutral leaves nothing in the accent. At Neutral
      // it is the pressed wash, the strongest neutral state step: translucent, so it reads a step past any ground it sits
      // on (page, surface, a filled field, a hovered row), where an opaque grey could match the ground (2026-10-22).
      "selection-highlight": ["bg-pressed", "accent-surface-active"],
    }),
    // Badge's public width hook. (badge-bg, badge-fg and badge-tracking-wide were pruned in
    // audit S21b: Badge paints from its tone slots and never read them.)
    [`${PREFIX}badge-max-width`]: `calc(var(${PREFIX}space-40) * 5)`,
    // Input aliases are public theming seams. They preserve the shared defaults while
    // allowing one product to tune editable fields without repointing every control.
    [`${PREFIX}input-bg`]: `var(${PREFIX}bg-surface)`,
    [`${PREFIX}input-bg-soft`]: `var(${PREFIX}bg-component)`,
    [`${PREFIX}input-bg-disabled`]: `var(${PREFIX}bg-component)`,
    [`${PREFIX}input-edge`]: `var(${PREFIX}edge-control)`,
    [`${PREFIX}input-edge-hover`]: `var(${PREFIX}edge-control-hover)`,
    // A soft field's resting edge: none (the fill carries it, as Figma's) at standard contrast, and the strong control
    // edge under increased contrast, where a required boundary targets 3:1 (CONTRAST.md); the fill alone read 1.07:1.
    // A soft field's edge is the Fields stroke group's (axes/stroke-groups.ts, 2026-10-30): its amount over the field, and
    // the strong stroke under Contrast More as before. Was none until Contrast More.
    [`${PREFIX}input-edge-soft`]: `var(${PREFIX}edge-fields)`,
    [`${PREFIX}input-text`]: `var(${PREFIX}fg-default)`,
    [`${PREFIX}input-placeholder`]: `var(${PREFIX}fg-placeholder)`,
    [`${PREFIX}input-icon`]: `var(${PREFIX}fg-muted)`,
    // A field's trailing chevron (Select, Custom select, Combobox's toggle) is a non-text control
    // indicator, a step lighter than its leading icons (Notion rgb(142), ChatGPT rgb(143);
    // custom-select.md Q5, owner 2026-10-08). It reads the neutral control stroke, which the
    // contrast gate holds to 3:1 on every surface and component plate a field paints, in both themes.
    [`${PREFIX}input-chevron`]: `var(${PREFIX}stroke-control)`,
    // The invalid edge uses the most saturated readable danger endpoint. Its halo is the
    // same context colour at low alpha rather than an unrelated neutral shadow.
    // A status mark's ink (owner, 2026-11-07, system gaps C5): the icon a status surface leads with (Alert, Toast),
    // a brighter rung than the tone's words, 3.5:1 or more on white (owner, 2026-09-27: more vivid); in dark the
    // tone's own ink. One role, so Alert and Toast no longer each hard-code the four.
    [`${PREFIX}fg-danger-mark`]: `light-dark(var(${PREFIX}red-500), var(${PREFIX}fg-danger))`,
    [`${PREFIX}fg-warning-mark`]: `light-dark(var(${PREFIX}orange-550), var(${PREFIX}fg-warning))`,
    [`${PREFIX}fg-success-mark`]: `light-dark(var(${PREFIX}green-550), var(${PREFIX}fg-success))`,
    [`${PREFIX}fg-info-mark`]: `light-dark(var(${PREFIX}blue-500), var(${PREFIX}fg-info))`,
    // Caution and discovery (components audit 2026-11-07, O4: Alert, Toast and Indicator take Button's seven tones), by
    // the same rule: the first rung from 500 that clears 3.5:1 on white (yellow 500 is 3.0, 550 3.7; purple 500 4.7).
    [`${PREFIX}fg-caution-mark`]: `light-dark(var(${PREFIX}yellow-550), var(${PREFIX}fg-caution))`,
    [`${PREFIX}fg-discovery-mark`]: `light-dark(var(${PREFIX}purple-500), var(${PREFIX}fg-discovery))`,
    // The label tones' marks (components audit D5, 2026-11-07), by the same rule (semantic/hues.ts markRung): pink 500,
    // brown 550, gray's warm 500. Their icon role reads them, so every hue has an icon ink.
    ...Object.fromEntries(LABEL_MARK_TONES.map(tone => [`${PREFIX}fg-${tone}-mark`, `light-dark(var(${PREFIX}${TONE_FAMILY[tone]}-${markRung(TONE_FAMILY[tone]!)}), var(${PREFIX}fg-${tone}))`])),
    // Every label hue's full set of roles (components audit D5; semantic/hues.ts): text, icon, border, the tint and its
    // steps, the accent and its words, and the translucent ground and ring. Tag, Board and Link read these.
    ...hueRoleCss(PREFIX),
    // The change words' inks (components audit D6, 2026-11-07; Governance § 4, "Change words"): Tree view's status letter,
    // a Tab's label, Edit summary's counts. Cursor 3.27.22's git decorations (workbench.glass.main.js): added green
    // #70B489, modified amber #F1B467, removed red #FC6B83, untracked #88C0D0 and renamed cyan; Area has no cyan, so
    // untracked and renamed take info's blue, its nearest hue, and git's letter tells them apart.
    [`${PREFIX}fg-change-added`]: `var(${PREFIX}fg-success)`,
    [`${PREFIX}fg-change-modified`]: `var(${PREFIX}fg-warning)`,
    [`${PREFIX}fg-change-deleted`]: `var(${PREFIX}fg-danger)`,
    [`${PREFIX}fg-change-untracked`]: `var(${PREFIX}fg-info)`,
    [`${PREFIX}fg-change-renamed`]: `var(${PREFIX}fg-info)`,
    // The changed lines' plates, one pair for a Diff and a Code block (plan B7.4): the solid status colour mixed into the
    // ground, 14% / 12% in light and 24% in dark (owner, round 73: the status surfaces left added and removed alike).
    // Translucent, so they read on any code ground. Not registered: they read other roles.
    [`${PREFIX}bg-change-added`]: `light-dark(color-mix(in oklab, var(${PREFIX}success-solid) 14%, transparent), color-mix(in oklab, var(${PREFIX}success-solid) 24%, transparent))`,
    [`${PREFIX}bg-change-deleted`]: `light-dark(color-mix(in oklab, var(${PREFIX}danger-solid) 12%, transparent), color-mix(in oklab, var(${PREFIX}danger-solid) 24%, transparent))`,
    [`${PREFIX}input-invalid-color`]: `var(${PREFIX}fg-danger-vivid)`,
    [`${PREFIX}input-invalid-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}input-invalid-color) 14%, transparent)`,
    [`${PREFIX}input-success-color`]: `var(${PREFIX}fg-success-vivid)`,
    [`${PREFIX}input-success-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}input-success-color) 14%, transparent)`,
    [`${PREFIX}input-warning-color`]: `var(${PREFIX}fg-warning-vivid)`,
    [`${PREFIX}input-warning-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}input-warning-color) 14%, transparent)`,
    // Textarea aliases share Input's editable-control defaults but remain independent
    // theming seams for products whose multiline fields need a different surface or width.
    [`${PREFIX}textarea-bg`]: `var(${PREFIX}input-bg)`,
    [`${PREFIX}textarea-bg-soft`]: `var(${PREFIX}input-bg-soft)`,
    [`${PREFIX}textarea-bg-disabled`]: `var(${PREFIX}input-bg-disabled)`,
    [`${PREFIX}textarea-edge`]: `var(${PREFIX}input-edge)`,
    [`${PREFIX}textarea-edge-hover`]: `var(${PREFIX}input-edge-hover)`,
    [`${PREFIX}textarea-edge-soft`]: `var(${PREFIX}input-edge-soft)`,
    [`${PREFIX}textarea-text`]: `var(${PREFIX}input-text)`,
    [`${PREFIX}textarea-placeholder`]: `var(${PREFIX}input-placeholder)`,
    [`${PREFIX}textarea-invalid-color`]: `var(${PREFIX}input-invalid-color)`,
    [`${PREFIX}textarea-invalid-halo-color`]: `var(${PREFIX}input-invalid-halo-color)`,
    [`${PREFIX}textarea-success-color`]: `var(${PREFIX}input-success-color)`,
    [`${PREFIX}textarea-success-halo-color`]: `var(${PREFIX}input-success-halo-color)`,
    [`${PREFIX}textarea-warning-color`]: `var(${PREFIX}input-warning-color)`,
    [`${PREFIX}textarea-warning-halo-color`]: `var(${PREFIX}input-warning-halo-color)`,
    [`${PREFIX}textarea-inline-size`]: `var(${PREFIX}input-inline-size)`,
    // Select is a native, single-value editable control. These aliases keep its visual
    // contract independently themeable while sharing the established Input endpoints.
    [`${PREFIX}select-bg`]: `var(${PREFIX}input-bg)`,
    [`${PREFIX}select-bg-disabled`]: `var(${PREFIX}input-bg-disabled)`,
    [`${PREFIX}select-edge`]: `var(${PREFIX}input-edge)`,
    [`${PREFIX}select-edge-hover`]: `var(${PREFIX}input-edge-hover)`,
    [`${PREFIX}select-text`]: `var(${PREFIX}input-text)`,
    [`${PREFIX}select-invalid-color`]: `var(${PREFIX}input-invalid-color)`,
    [`${PREFIX}select-invalid-halo-color`]: `var(${PREFIX}input-invalid-halo-color)`,
    [`${PREFIX}select-success-color`]: `var(${PREFIX}input-success-color)`,
    [`${PREFIX}select-success-halo-color`]: `var(${PREFIX}input-success-halo-color)`,
    [`${PREFIX}select-warning-color`]: `var(${PREFIX}input-warning-color)`,
    [`${PREFIX}select-warning-halo-color`]: `var(${PREFIX}input-warning-halo-color)`,
    [`${PREFIX}select-inline-size`]: `var(${PREFIX}input-inline-size)`,
    [`${PREFIX}field-error-color`]: `var(${PREFIX}fg-danger-vivid)`,
    // Syntax roles (audit G-5 B): code colours alias today's vivid rungs under their own names, so
    // a keyword stops borrowing danger and a string the accent, and syntax can be tuned alone.
    [`${PREFIX}syntax-keyword`]: `var(${PREFIX}fg-danger-vivid)`,
    [`${PREFIX}syntax-tag`]: `var(${PREFIX}fg-discovery-vivid)`,
    [`${PREFIX}syntax-attr`]: `var(${PREFIX}fg-info-vivid)`,
    [`${PREFIX}syntax-string`]: `var(${PREFIX}fg-accent-vivid)`,
    // Token is a static design-token reference, not a selectable tag or metadata badge.
    // These aliases let a documentation surface tune that reference without changing Code,
    // Badge, or Chip. The on-color values intentionally stay local: they must derive from
    // the surrounding foreground rather than from a global page colour.
    // The 25 rung, as inline Code: the code block's ground became the page (2026-09-28).
    // The well (color/layers.ts): the stripe it read until 2026-11-01 is 1.03:1 at Layer contrast 0.
    [`${PREFIX}token-bg`]: `var(${PREFIX}bg-well)`,
    // Quieter than the default: no fill, the edge alone, in both themes (audit G-4 A; bg-subtle
    // was darker than the default in light and equal to it in dark).
    [`${PREFIX}token-bg-subtle`]: "transparent",
    // Dark `border-decorative` equals the stripe fill, so dark takes the faint edge (audit G-3). Light takes the subtle
    // edge (owner, 2026-11-02: the chip "seems so light"; the decorative #f3f3f3 seam on the #fafafa fill all but vanished
    // on a Table's white rows): #e8e8e8, the edge step nearest Untitled's measured neutral-200 ring (#e5e5e5, code.md),
    // a role, so it still moves with the ground under it.
    [`${PREFIX}token-edge`]: `light-dark(var(${PREFIX}border-subtle), var(${PREFIX}border-faint))`,
    [`${PREFIX}token-text`]: `var(${PREFIX}fg-default)`,
    // The swatch ring, shared by Code's swatch, ColorSwatch and Asset row's preview: a translucent line drawn over
    // the colour, so it shows evenly all round on any colour and still outlines white on white (Figma's swatch
    // edge, black 10%; owner 2026-10-12, reversing the solid #f7 edge of 2026-09-28, which merged with light
    // grounds on straight edges and showed only as fringe at the corners).
    // The swatch ring steps with every other stroke (owner, 2026-10-18), to the strong stroke at More.
    // A swatch's hairline is the Media stroke group's (axes/stroke-groups.ts, 2026-10-30; was 10% black or white at 4).
    [`${PREFIX}token-swatch-ring`]: `var(${PREFIX}edge-media)`,
    // Heights, rows, gaps, insets and marks from the type size and the density (axes/type-size.ts,
    // axes/density.ts): live calc, so a subtree that sets either re-derives them here.
    ...sizeDerivations(),
    // (radius-nested was pruned in audit S21b: concentric corners use radius-concentric, S3.)
    // Corners follow painted height (compact pass, owner 2026-10-01): the radius setting gives a
    // corner per pixel and the UI scale the heights. A live calc, so a `data-area-ui` or
    // `data-area-radius` subtree re-derives its own corners.
    ...radiusDerivations(),

    // Standard transition for interactive chrome. Only properties that actually change. Colours and shadows leave on
    // `duration-quick` (a third of the Speed number, 70 at 210; plan A5.5, 2026-11-11, was fast) on `ease-effects`,
    // which never overshoots (plan A5.4). `scale` carries a press's give (Feedback) and its release, on `fast` and the
    // movement curve (a spring under Easing Spring); it rests at 1, so a control that never presses never moves. The
    // colours stay first: a family that narrows `transition-property` to colours keeps their clocks by position.
    [`${PREFIX}transition`]:
      `background-color var(${PREFIX}duration-quick) var(${PREFIX}ease-effects), border-color var(${PREFIX}duration-quick) var(${PREFIX}ease-effects), color var(${PREFIX}duration-quick) var(${PREFIX}ease-effects), box-shadow var(${PREFIX}duration-quick) var(${PREFIX}ease-effects), scale var(${PREFIX}duration-fast) var(${PREFIX}ease-out)`,
    // Feedback (axes/feedback.ts) on the Speed setting: how long a hover and a press take to arrive. A state's own rule
    // sets its arrival to these (the base transition is the leave), so Off and Speed 0 land at once as before.
    [`${PREFIX}hover-in`]: `calc(var(${PREFIX}duration-fast) * var(${PREFIX}feedback-hover))`,
    [`${PREFIX}press-in`]: `calc(var(${PREFIX}duration-fast) * var(${PREFIX}feedback-press))`,
    // Fades (docs/MOTION.md, "Reduced motion"; owner 2026-11-07, system gaps M2): an opacity change reads these, movement
    // (scale, translate, size, rotate) reads the durations. They are the durations here; under reduced motion the
    // durations go to 0 and these stay short (emit/css.ts), so a surface still fades in place and nothing moves.
    [`${PREFIX}fade-fast`]: `var(${PREFIX}duration-fast)`,
    [`${PREFIX}fade-base`]: `var(${PREFIX}duration-base)`,
    [`${PREFIX}fade-moderate`]: `var(${PREFIX}duration-moderate)`,
    [`${PREFIX}fade-slow`]: `var(${PREFIX}duration-slow)`,
  };
}

/**
 * The geometry two axes share (owner, 2026-10-12; docs/research/ui-size-scale-2026-10-12.md).
 *
 * level   the density level (−1, 0, 1) clamped by the type size's bounds: Compact stops at 14,
 *         Comfortable starts at 13, so those pairings resolve to Default.
 * height  the tier's text line plus 2 × its room, never under 24 (xs: 20). Rooms at Default are
 *         xs 4, sm 4, md 6, lg 10, xl 12 and rows 6; each level moves them 2 (rows never under 5).
 * step    spacing keeps each level's ratio of space to type (Compact 12 at 12, Default 16 at 14,
 *         Comfortable 20 at 14), rounded to halves: round((16 − ratio × base) / 4, 0.5). It is
 *         `ui-dense`, the factor component insets are written against (`x − y × ui-dense`, every
 *         y 2, 4 or 8, so halves stay whole pixels): 1 at Compact 12, 0 at Default 14. Gaps on the 2px
 *         ladder read `ui-gap-step`, the curve rounded to whole steps, so they stay on 2 · 4 · 6 · 8.
 * marks   text labels (Badge, Count, Tag, Kbd, Citation, Indicator's count) sit on the small-text line plus 0 / 4 / 8,
 *         the same at every density (plan B5.1); the
 *         check box and toggle come from the type (`type-box`); static marks hold.
 */
function sizeDerivations(): Record<string, string> {
  const v = (name: string) => `var(${PREFIX}${name})`;
  const level = v("ui-level");
  const down = `min(${level}, 0)`;
  const up = `max(${level}, 0)`;
  const step = v("ui-dense");
  const gapStep = v("ui-gap-step");
  const raw = `calc((16 - (8 / 7 + ${up} * 2 / 7 + ${down} / 7) * ${v("type-base")}) / 4)`;
  const height = (line: string, room: number, floor: number) =>
    `max(${floor}px, calc(${line} + (${room}px + 2px * ${level}) * 2))`;
  const out: Record<string, string> = {
    [`${PREFIX}ui-level`]: `clamp(${v("type-level-min")}, ${v("density-level")}, ${v("type-level-max")})`,
    [`${PREFIX}ui-dense`]: `round(nearest, ${raw}, 0.5)`,
    // The gap step: the same curve rounded to whole steps, for the 2px gap ladder (owner, 2026-11-07, system gaps L3).
    // Halves of a 2px multiplier landed gaps between the ladder's rungs (Card's list items 7 apart at type 13); the raw
    // curve there is 0.29, so the gaps stay 8 / 6 while the 4px insets take the half step (14).
    [`${PREFIX}ui-gap-step`]: `round(nearest, ${raw}, 1)`,
    [`${PREFIX}ui-size`]: v("text-base-size"),
    [`${PREFIX}ui-leading`]: v("text-base-leading"),
    // Rows keep at least 5 above and below their text (owner, 2026-10-22, review of docs/research/cursor-audit-2026-10-22.md
    // item 2: "use the option"): 28 at the app's type 13 Compact, where the level's 4 made 26. Cursor's Agents rows 28
    // (12/16 + 6), Figma's file-browser rows 28 (11/16), ChatGPT 35 (14/20); Notion's 30 (14/21) kept Area's 1.44
    // proportion. Default and Comfortable (6, 8) are unchanged; rows no longer equal md controls at Compact (26).
    [`${PREFIX}ui-row`]: `calc(${v("type-leading")} + max(5px, 6px + 2px * ${level}) * 2)`,
    [`${PREFIX}ui-row-inset`]: "8px",
    // The break between stacked row plates (Nav, Menu, List box, Tree view…): a separation, not spacing, so it holds
    // at every type and density (owner 2026-10-21; ChatGPT's 35 and Notion's 30 rows sit 1 apart). Was 2 − 2 × step:
    // flush at Compact (evidence audit R7, VS Code and Figma menus), up to 5 at Comfortable.
    [`${PREFIX}ui-row-gap`]: "1px",
    [`${PREFIX}ui-stack`]: `calc(6px - 2px * ${gapStep})`,
    [`${PREFIX}ui-cluster`]: `calc(8px - 2px * ${gapStep})`,
    // A gap reads whole steps; only an inset (edge to content) keeps the half step (plan A1.1, 2026-11-11): gap-row was
    // 12 − 4 × ui-dense, 10 at the default type 13, between the ladder's rungs. 8 / 12 / 16 at type 13 Compact / Default /
    // Comfortable. A row's icon-to-label gap is ui-cluster, not gap-row (plan B2.3).
    [`${PREFIX}gap-row`]: `calc(12px - 4px * ${gapStep})`,
    // Section and page spaces, named (plan A1.4): a section is two groups apart (Stack's section, 24, Compact 16); the page
    // inset is the Canvas's edge to its sections (the feed's margin, 32, Compact 24). No new value: each names what Stack
    // and the feed already computed.
    [`${PREFIX}gap-section`]: `calc(24px - 8px * ${gapStep})`,
    [`${PREFIX}inset-page`]: `calc(32px + 8px * ${level})`,
    [`${PREFIX}inset-surface-sm`]: `calc(12px - 4px * ${step})`,
    [`${PREFIX}inset-surface-md`]: `calc(16px - 4px * ${step})`,
    [`${PREFIX}mark-sm`]: "16px",
    [`${PREFIX}mark-md`]: "20px",
    [`${PREFIX}mark-lg`]: "24px",
    // The mark ladder (plan B5.1, 2026-11-13): the small text's line, then 4 and 8 more, at every density, so every
    // mark size is distinct at every density (14 / 18 / 22 at type 13). Compact took 4 off md and lg, so its sm and md
    // marks were one size (14) and its lg was Default's md.
    [`${PREFIX}mark-label-sm`]: v("type-small-leading"),
    [`${PREFIX}mark-label-md`]: `calc(${v("type-small-leading")} + 4px)`,
    [`${PREFIX}mark-label-lg`]: `calc(${v("type-small-leading")} + 8px)`,
    [`${PREFIX}mark-box`]: v("type-box"),
    [`${PREFIX}mark-toggle`]: `calc(${v("type-box")} + 4px)`,
  };
  const tiers: Record<string, { line: string; room: number; floor: number; text: string; icon: string; gap: string }> = {
    xs: { line: v("type-small-leading"), room: 4, floor: 20, text: "text-xs", icon: v("type-icon-xs"), gap: "4px" },
    sm: { line: v("type-leading"), room: 4, floor: 24, text: "text-base", icon: v("type-icon"), gap: `calc(6px - 2px * ${gapStep})` },
    md: { line: v("type-leading"), room: 6, floor: 24, text: "text-base", icon: v("type-icon"), gap: `calc(6px - 2px * ${gapStep})` },
    lg: { line: v("type-leading"), room: 10, floor: 24, text: "text-base", icon: v("type-icon"), gap: "6px" },
    xl: { line: v("type-reading-leading"), room: 12, floor: 24, text: "text-lg", icon: `max(${v("type-icon")}, calc(24px + 8px * ${down}))`, gap: `calc(8px - 2px * ${gapStep})` },
  };
  for (const [tier, spec] of Object.entries(tiers)) {
    out[`${PREFIX}control-${tier}`] = height(spec.line, spec.room, spec.floor);
    out[`${PREFIX}control-${tier}-text`] = v(`${spec.text}-size`);
    out[`${PREFIX}control-${tier}-leading`] = v(`${spec.text}-leading`);
    out[`${PREFIX}icon-${tier}`] = spec.icon;
    out[`${PREFIX}gap-${tier}`] = spec.gap;
  }
  return out;
}

function radiusDerivations(): Record<string, string> {
  // One corner setting (axes/radius.ts). A shape on the height ladder takes the setting's corner
  // per pixel of height, rounded down to even pixels, never under radius-min (2, or 0 at Sharp):
  // 8 gives 20 -> 4, 24 -> 6, 28 -> 6, 32 -> 8, 40 -> 10, 48 -> 12, and Pill gives half of every
  // height. Live calc on the control heights, so a `data-area-ui` subtree re-derives its corners.
  // Components with their own height write the same expression on it (DESIGN_SYSTEM.md, Radius).
  const corner = (height: string) =>
    `max(var(${PREFIX}radius-min), round(down, calc(${height} * var(${PREFIX}radius-factor)), 2px))`;
  const out: Record<string, string> = {};
  for (const tier of ["xs", "sm", "md", "lg", "xl"]) out[`${PREFIX}radius-control-${tier}`] = corner(`var(${PREFIX}control-${tier})`);
  out[`${PREFIX}radius-control`] = `var(${PREFIX}radius-control-md)`;
  // Surfaces take their own 4px ladder (radius audit D1), never deeper than 1.5 x the surface
  // inset (owner, 2026-10-12): a compact popover's 12 inset stops its corner at 18 when the setting
  // asks for 20 or 24. Default and Comfortable insets never reach the cap.
  out[`${PREFIX}radius-container`] = `min(var(${PREFIX}radius-surface), round(down, calc(var(${PREFIX}inset-surface-md) * 1.5), 2px))`;
  // Small nested shapes (code, disclosure plates): the smallest control's corner, 6 at the default and compact.
  out[`${PREFIX}radius-small`] = `var(${PREFIX}radius-control-xs)`;
  // A full-width row's plate: the row's own height, 8 at the default and compact (30 and 28 rows).
  out[`${PREFIX}radius-row`] = corner(`var(${PREFIX}ui-row)`);
  // The setting's own step: the corner of the real medium control at the current type and density (plan A2.1,
  // 2026-11-11). The preset number is that corner on a 32 control (the medium Button at type 14); at the default type 13
  // the medium Button is 30 and the step is its 8 at Corner 10. It was corner(32px), 10 at the default, so everything it
  // capped ran 2 rounder than every Button.
  out[`${PREFIX}radius-step`] = `var(${PREFIX}radius-control-md)`;
  // The sharpest corner a nested shape takes (an item in a track, a row in a menu): 4, or the
  // setting where it is smaller (2), so only Sharp is square anywhere. It reads the setting's own number (the corner of
  // a 32 control), not the step, so Corner 4 keeps its 4 floor where its medium control draws 2.
  out[`${PREFIX}radius-floor`] = `min(4px, ${corner("32px")})`;
  // Rows in a floating list (Menu, Combobox, Command palette, Select's picker) and the list itself
  // (owner, 2026-10-04: "menu rows wait for pill"). A row is the surface less its 4px padding,
  // floored, no rounder than its height's corner (radius-row, plan A2.1), so a row in a menu takes the corner of a row
  // anywhere (Nav, Tree view) and of a Button of its height: 8 at the default and at Compact. At Pill the row's corner
  // gives way to half the row (the second term is radius-row until the factor reaches 0.5), and the last term keeps a
  // row 2px short of a pill until Pill. The list stops at its rows plus the padding, so it stays concentric: 12 at the
  // default Corner 10.
  out[`${PREFIX}radius-list-row`] =
    `min(max(var(${PREFIX}radius-floor), calc(var(${PREFIX}radius-container) - 4px)), max(var(${PREFIX}radius-row), calc(var(${PREFIX}ui-row) / 2 - (0.5 - var(${PREFIX}radius-factor)) * 1000px)), calc(var(${PREFIX}ui-row) / 2 - min(2px, (0.5 - var(${PREFIX}radius-factor)) * 1000px)))`;
  // The list is its rows plus the 4 padding they sit in (the overlay corner table, plan B6.3; DESIGN_SYSTEM.md, "Overlay
  // corners"): concentric at every setting. Below a 4 corner it adds the rows' own corner, so it stays at most twice them
  // (Corner 2: 2 / 4; it was capped at the container there, 2 round 2 rows). popup.css writes the same equation on each
  // list, so a list whose rows take a field's corner follows them.
  out[`${PREFIX}radius-list`] = `calc(var(${PREFIX}radius-list-row) + min(4px, var(${PREFIX}radius-list-row)) * var(${PREFIX}radius-concentric))`;
  return out;
}

/**
 * The handful of properties worth registering with `@property`: the ones that are
 * interpolated, plus those where a missing unit should be a parse error rather than a
 * silently broken calc().
 *
 * Deliberately a short list, and it contains only *leaf* tokens. Derived tokens must never
 * be registered: a registered `<length>` computes at its declaration site, so
 * `--area-radius-control` would freeze at the value it had on `:root` and stop responding
 * to a nested `data-area-ui`. That silently breaks subtree scoping -- the height
 * changes, the corner radius does not -- and it is invisible in source. Verified in a real
 * browser by the axis fixture check.
 *
 * Registration is also document-global and unconditional, so a consumer registering the
 * same name with a different syntax silently wins; and a registered property falls back to
 * its initial value rather than to `unset`, turning an obviously-broken chain into a
 * plausible-looking wrong number. Both are reasons to register sparingly.
 */
export const REGISTERED_PROPERTIES = [
  // The leaves of the radius derivation; the public radius tokens are derived and unregistered.
  { name: `${PREFIX}radius-surface`, syntax: "<length>", initial: "12px" },
  { name: `${PREFIX}radius-min`, syntax: "<length>", initial: "2px" },
  { name: `${PREFIX}radius-factor`, syntax: "<number>", initial: "0.25" },
  // The Focus ring setting's leaves; `focus-width` and `focus-offset` are derived from them and Contrast, so they are not.
  { name: `${PREFIX}focus-ring-width`, syntax: "<length>", initial: "2px" },
  { name: `${PREFIX}focus-ring-offset`, syntax: "<length>", initial: "0px" },
  // The Surface leaf; `border-width` is derived from it and contrast, so it is not registered.
  { name: `${PREFIX}frame-width`, syntax: "<length>", initial: "1px" },
  // The Rest shadow leaf; `shadow-edge` is derived from it, so it is not registered.
  { name: `${PREFIX}shadow-rest-step`, syntax: "<number>", initial: "0" },
  // The motion axis's default step, so a missing or invalid duration falls back to the default.
  { name: `${PREFIX}duration-quick`, syntax: "<time>", initial: duration(Number(MOTION_AXIS.defaultPreset), 1) },
  { name: `${PREFIX}duration-fast`, syntax: "<time>", initial: duration(Number(MOTION_AXIS.defaultPreset), 2) },
  { name: `${PREFIX}duration-base`, syntax: "<time>", initial: duration(Number(MOTION_AXIS.defaultPreset), 3) },
] as const;
