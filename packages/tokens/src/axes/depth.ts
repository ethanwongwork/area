/**
 * Edge and Depth: strokes and shadows as a few independent controls (owner, 2026-10-18: "for elevation, i want to add an
 * axis for elevation/shadow on rest, not just on hover … spread, blur, position, exact color, opacity … explore stroke
 * width … how this relates to contrast"; then "i dont want any prepackaged, named themes, i want to be able to control
 * the individual controls as much as possible, but i think the previous system was too bloated and complicated", and
 * chose nine controls). Research, every external value and the review page: docs/research/elevation-stroke-2026-10-18.
 *
 * Nine controls, each a registry axis (one data attribute, scoped to a subtree and re-derived there), each one number or
 * name with one effect:
 *
 *   data-area-surface          Stroke width: the frame's width, 0 (Borderless), 0.5 (Hairline), 1, 2 (Bold)   surface.ts
 *   data-area-stroke           Stroke: every stroke's distance from its ground, 0 to 8 (4)                color/layers.ts
 *   data-area-elevation        Shadow: menus, popovers, tooltips, dialogs and the hover lift, 0 to 8 (3)   elevation.ts
 *   data-area-shadow-resting   Resting lift: cards, panels and raised thumbs at rest, 0 to 8 (3); `shadow-rest` is the
 *                              Rest shadow round surfaces (surface.ts, from main 2026-10-19)
 *   data-area-shadow-field     Field shadow: fields, select triggers, outline and soft buttons, 0 to 8 (0)
 *   data-area-shadow-size      how far every shadow reaches: offset and blur, 0 to 8 (4)
 *   data-area-shadow-softness  one crisp layer (0) to six eased layers held under the surface (8); 2 is today's pair
 *   data-area-shadow-light     a lip under each lifted edge and a highlight inside its top, 0 to 4 (0)
 *   data-area-shadow-color     Black, Warm or Cool (light theme; dark shadows stay black)
 *
 * Fixed, not controls: light from the top, and dark shadows at twice the light alpha (Fluent's dark colours are its light
 * ones doubled). There are no named looks or packages: every control is set on its own. At the defaults every role is
 * the two-layer shadow Area shipped (elevation.ts), exactly.
 *
 * Contrast never strengthens a shadow (no system surveyed does, finding 6): it moves strokes on toward 3:1 from wherever
 * Stroke puts them, turns a Hairline into 1px, and turns the soft edge off whenever the frame returns.
 */
import { type AxisDefinition, PREFIX, tokens } from "./schema.ts";

const v = (name: string) => `var(${PREFIX}${name})`;
const num = (x: number) => String(Number(x.toFixed(4)));
const range = (n: number) => Array.from({ length: n + 1 }, (_, i) => i);

/** One control: its steps, each a label and the tokens it writes. Namespaces are the tokens' names (a trailing `-` is a prefix). */
function control(id: string, label: string, description: string, defaultPreset: string, namespaces: readonly string[],
  steps: ReadonlyArray<{ id: string; label?: string; tokens: Record<string, string | number> }>): AxisDefinition {
  return {
    id, label, description, defaultPreset,
    namespaces: namespaces.map(name => name.endsWith("-") ? `${PREFIX}${name}` : `${PREFIX}${name}:`),
    presets: steps.map(step => ({
      id: step.id,
      label: step.label ?? (step.id === defaultPreset ? `${step.id} (Default)` : step.id),
      description,
      tokens: tokens(step.tokens),
    })),
  };
}
/** A 0-to-n number control: `0 (name)` at 0, `(Default)` at its default. */
const numbered = (n: number, fallback: number, zero: string, write: (i: number) => Record<string, string | number>) =>
  range(n).map(i => ({ id: String(i), label: i === 0 ? `0 (${zero})` : i === fallback ? `${i} (Default)` : String(i), tokens: write(i) }));

export const STROKE_AXIS = control("stroke", "Stroke strength", "How dark every stroke is: its distance from its ground, 0 (none) to 8", "4", ["stroke-strength"],
  numbered(8, 4, "None", i => ({ "stroke-strength": i / 4 })));

export const SHADOW_RESTING_AXIS = control("shadow-resting", "Resting shadow", "How much cards, panels and raised thumbs lift at rest, 0 (none) to 8, in % as Shadow", "3", ["shadow-resting-step"],
  numbered(8, 3, "None", i => ({ "shadow-resting-step": i })));

export const SHADOW_FIELD_AXIS = control("shadow-field", "Field shadow", "How much fields, select triggers, outline and soft buttons lift, 0 (none) to 8, in % as Shadow", "0", ["shadow-field-step"],
  numbered(8, 0, "None", i => ({ "shadow-field-step": i })));

export const SHADOW_SIZE_AXIS = control("shadow-size", "Shadow size", "How far every shadow reaches, its offset and blur, 0 (touching) to 8", "4", ["shadow-size"],
  numbered(8, 4, "Touching", i => ({ "shadow-size": i / 4 })));

/**
 * Softness: how each shadow is drawn, as one dial over two things that move together in the systems surveyed (README
 * "Packaged controls", now one scale): the number of soft layers and how far a negative spread holds them under the
 * surface. 0 is one crisp layer (shadcn's shadow-xs, Primer resting); 2 Fluent's ambient + key (today); 5 four eased
 * layers (Geist, Radix); 7 and 8 six (Linear, Josh Comeau).
 *
 * Each step writes six slots: a slot's place along the shadow (t, for offset and blur), whether its blur is the ambient
 * one instead (g, the two-layer recipe's no-offset layer) and its alpha against the key's (a). Unused slots are
 * transparent, so a role is the same length at every step. Layers ease along `t = ((i + 1) / n)²` (smoothshadows),
 * spread so the darkest point matches two layers' (A × 1.5 / √n).
 */
export const SHADOW_SLOTS = 6;
const SOFTNESS = [[1, 0], [1, 1], [2, 0], [2, 1], [4, 2], [4, 3], [6, 3], [6, 4], [6, 6]] as const;
function slots(n: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (let i = 0; i < SHADOW_SLOTS; i++) {
    const [t, g, a] = n === 2 ? (i === 0 ? [0, 1, 0.5] : i === 1 ? [1, 0, 1] : [0, 0, 0])
      : i < n ? [n === 1 ? 1 : ((i + 1) / n) ** 2, 0, n === 1 ? 1 : 1.5 / Math.sqrt(n)] : [0, 0, 0];
    out[`shadow-slot-${i + 1}-t`] = Number(t.toFixed(4));
    out[`shadow-slot-${i + 1}-g`] = g;
    out[`shadow-slot-${i + 1}-a`] = Number(a.toFixed(4));
  }
  return out;
}
export const SHADOW_SOFTNESS_AXIS = control("shadow-softness", "Shadow softness", "How each shadow is drawn: one crisp layer (0) to six eased layers held under the surface (8)", "2", ["shadow-slot-", "shadow-tightness"],
  SOFTNESS.map(([layers, tight], i) => ({
    id: String(i),
    label: i === 0 ? "0 (Crisp)" : i === 2 ? "2 (Default)" : i === 8 ? "8 (Smooth)" : String(i),
    tokens: { ...slots(layers), "shadow-tightness": tight / 16 },
  })));

/** Light: the lip (`0 1px 0` at 3 / 5 / 8 / 14%; Primer's 4% button lip) and the highlight (`inset 0 1px 0` white, light / dark), one step each. */
const LIP = [0, 0.03, 0.05, 0.08, 0.14];
const HIGHLIGHT = [[0, 0], [0.4, 0.03], [0.6, 0.05], [0.8, 0.08], [1, 0.12]] as const;
export const SHADOW_LIGHT_AXIS = control("shadow-light", "Shadow light", "Light from the top: a line under each lifted edge and a highlight inside its top, 0 (flat) to 4", "0", ["shadow-lip", "shadow-highlight-light", "shadow-highlight-dark"],
  numbered(4, 0, "Flat", i => ({ "shadow-lip": LIP[i]!, "shadow-highlight-light": HIGHLIGHT[i]![0], "shadow-highlight-dark": HIGHLIGHT[i]![1] })));

/** Shadow colour: the light theme's shadow as OKLCH (Comeau's warm ink, Stripe's cool blue); dark stays black. */
export const SHADOW_COLOR_AXIS = control("shadow-color", "Shadow colour", "The light theme's shadow colour; dark shadows stay black", "black", ["shadow-tint-"], [
  { id: "black", label: "Black (Default)", tokens: { "shadow-tint-l": 0, "shadow-tint-c": 0, "shadow-tint-h": 0 } },
  { id: "warm", label: "Warm", tokens: { "shadow-tint-l": 0.25, "shadow-tint-c": 0.02, "shadow-tint-h": 60 } },
  { id: "cool", label: "Cool", tokens: { "shadow-tint-l": 0.3, "shadow-tint-c": 0.08, "shadow-tint-h": 255 } },
]);

/** The controls besides Stroke width (Surface) and Shadow (Elevation), in the Inspector's order. */
export const DEPTH_AXES: readonly AxisDefinition[] = [
  STROKE_AXIS, SHADOW_RESTING_AXIS, SHADOW_FIELD_AXIS, SHADOW_SIZE_AXIS, SHADOW_SOFTNESS_AXIS, SHADOW_LIGHT_AXIS, SHADOW_COLOR_AXIS,
];

// ---- The roles ---------------------------------------------------------------------------------------------------

/**
 * [ambient blur, key offset, key blur] per role at Shadow size 4 (Fluent's shadow2 / 4 / 8 / 16 / 28, elevation.ts), the
 * weight its step is scaled by, and which control sets the step. `field` is the control geometry; `lift` the hovered card's.
 */
const ROLES = {
  control: { geometry: [2, 1, 2], weight: 1, step: "shadow-resting-step" },
  field: { geometry: [2, 1, 2], weight: 1, step: "shadow-field-step" },
  resting: { geometry: [2, 2, 4], weight: 0.5, step: "shadow-resting-step" },
  tooltip: { geometry: [2, 4, 8], weight: 0.5, step: "elevation" },
  float: { geometry: [2, 8, 16], weight: 1, step: "elevation" },
  // A hovered card or tile: Fluent's shadow8 at half the Menu's strength (main, 2026-10-19: the float shadow it took
  // first was "too drastic"; "very subtle elevation shadow"). Was `hover`, the float geometry at full weight.
  lift: { geometry: [2, 4, 8], weight: 0.5, step: "elevation" },
  modal: { geometry: [8, 14, 28], weight: 2, step: "elevation" },
} as const;
export const SHADOW_ROLES = Object.keys(ROLES) as ReadonlyArray<keyof typeof ROLES>;

/** Dark shadows are twice the light alpha (Fluent), to 90%. */
const DARK = 2;
/** A shadow colour at an alpha: the tint in light, black at `dark ×` the alpha in dark. */
const tint = (alpha: string, dark = DARK) =>
  `light-dark(oklch(${v("shadow-tint-l")} ${v("shadow-tint-c")} ${v("shadow-tint-h")} / calc(${alpha})), rgb(0 0 0 / min(0.9, calc(${alpha} * ${num(dark)}))))`;

/**
 * The dark rim (owner, 2026-10-19: "make the shadow settings visible in dark mode on the near-black page"): on a page at
 * #020202 a black shadow has nothing to darken, so in dark a role also draws a light edge, as the systems surveyed do
 * (docs/research/elevation-stroke-2026-10-18: Radix's ring "turns into a light edge" at white 17%; Fluent's 9.4% white top;
 * Raycast's outer light ring; finding 7, dark strokes are translucent white 7–17%). Its strength is the role's own step,
 * twice the light alpha as dark shadows are, to 16% (Radix's 17%): Floating 3 draws 6%, Resting 3 at half weight 3%,
 * Field 0 nothing. Transparent in light, so light is unchanged.
 */
const RIM_MAX = 0.16;
const rim = (alpha: string) => `0 0 0 1px light-dark(transparent, rgb(255 255 255 / min(${num(RIM_MAX)}, calc(${alpha} * ${num(DARK)}))))`;

/**
 * One role: the lip, the dark rim, the six soft layers, then the highlight, every slot always present (a transparent layer where a
 * control is off, never `none`, which voids the list a role sits in beside a component's own layers). The highlight is
 * last: a list interpolates layer by layer only where both sides are outer or both inset, and a shorter list pads at its
 * end, so an element fading from outer-only layers (a tile's transparent pair) still crossfades.
 */
export function roleShadow(role: keyof typeof ROLES): string {
  const { geometry: [ga, gy, gb], weight, step } = ROLES[role];
  const alpha = `${v(step)} / 100 * ${num(weight)}`;
  const d = v("shadow-size");
  const layers = [`0 1px 0 0 ${tint(v("shadow-lip"), 1.6)}`, rim(alpha)];
  for (let i = 1; i <= SHADOW_SLOTS; i++) {
    const t = v(`shadow-slot-${i}-t`), g = v(`shadow-slot-${i}-g`);
    const y = `${d} * ${num(gy)}px * ${t}`;
    // A layer's blur: along the key's (with a half-pixel floor, so a layer never draws a hard edge), or the ambient's.
    const blur = `max(${d} * ${num(gb)}px * ${t}, 0.5px) * (1 - ${g}) + max(${d}, 0.5) * ${num(ga)}px * ${g}`;
    layers.push(`0 calc(${y}) calc(${blur}) calc(-1 * ${v("shadow-tightness")} * ${y}) ${tint(`${alpha} * ${v(`shadow-slot-${i}-a`)}`)}`);
  }
  layers.push(`inset 0 1px 0 0 light-dark(rgb(255 255 255 / ${v("shadow-highlight-light")}), rgb(255 255 255 / ${v("shadow-highlight-dark")}))`);
  return layers.join(", ");
}

/** The role shadows and the ladder, re-derived wherever an axis is set (emit/base.ts derivedTokens). */
export function depthDerived(): Record<string, string> {
  return {
    ...Object.fromEntries(SHADOW_ROLES.map(role => [`${PREFIX}shadow-${role}`, roleShadow(role)])),
    // The ladder: the roles in depth order, for apps.
    [`${PREFIX}shadow-1`]: v("shadow-control"),
    [`${PREFIX}shadow-2`]: v("shadow-resting"),
    [`${PREFIX}shadow-3`]: v("shadow-float"),
    [`${PREFIX}shadow-4`]: v("shadow-modal"),
  };
}
