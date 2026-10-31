/**
 * Material: the paints a surface or control carries over its Layers tone, as separate levers (owner, 2026-10-17:
 * "breaking down materials into the individual levers is better for control, similar to how surface is created with a
 * bunch of different controls"). Research and every value: docs/research/astra/materials/27-levers (the levers),
 * 28-recipes (the eight references) and 29-scope (which parts carry it, and how strongly).
 *
 * Not a registry axis, as Pills is not: a material is a bundle of levers, and a lever may be set on its own over any
 * bundle. Selected with attributes on any element, inherited like an axis:
 *
 *   data-area-material="glass"            a bundle: none, glass, tactile, jelly, soft, aero, glow. It sets every lever,
 *                                         switch and target, so a nested bundle never inherits its parent's.
 *   data-area-material-<lever>="5"        one lever, 0 (off) to 8 (the light angle 0 to 345 degrees), over the bundle
 *   data-area-material-<switch>="radial"  one switch (gradient shape, centre and colour, sheen shape, what see-through
 *                                         parts hold, ring colour)
 *   data-area-material-stroke-style="ring lit"   the stroke's styles, a set as Pills is: ring, lit, gradient, double
 *
 * Components paint only inside an element with `data-area-material` (packages/styles/src/material.css), so with no
 * attribute nothing changes, byte for byte. Every lever paints over the part's Layers fill (a material never replaces
 * a tone), never changes size, type or ink, and adds no outer lift except the contact shadow under raised controls
 * (Elevation owns lift). Part groups (29-scope): primary controls carry it at full strength; secondary controls, solid
 * badges, wells and selected rows echo it at half; cards, overlays and chrome take glass; content takes none.
 *
 * Dark: a lever's alphas are its light ones scaled per theme, chosen through light-dark() at use, as Elevation's
 * shadows are; geometry is one for both themes (CSS has no numeric theme flag; light-dark() takes colours only).
 */
import { PREFIX } from "./schema.ts";

const P = `${PREFIX}material-`;
const v = (name: string) => `var(${P}${name})`;

/** The levers, in the Inspector's order (Figma's Fill, Stroke, Effects, then the page). */
export const MATERIAL_LEVERS = [
  { id: "angle", label: "Light angle", group: "Light", hint: "Where the light comes from, 0 (top) clockwise; every gradient, edge and shadow follows it" },
  { id: "gradient", label: "Gradient", group: "Fill", hint: "Tone on tone: lighter toward the light, darker away" },
  { id: "sheen", label: "Sheen", group: "Fill", hint: "A white wash on the lit half" },
  { id: "transparency", label: "Transparency", group: "Fill", hint: "See-through cards, overlays and chrome; 8 stops at the reading floor" },
  { id: "frost", label: "Frost", group: "Fill", hint: "Blur behind see-through parts, 4px a step" },
  { id: "stroke", label: "Stroke", group: "Stroke", hint: "The decorative stroke's strength, in its styles" },
  { id: "inner", label: "Inner shadow", group: "Effects", hint: "Controls lit inside; fields and tracks shaded in" },
  { id: "softness", label: "Inner softness", group: "Effects", hint: "The inner shadow's blur, 0 (crisp) to 8 (6px)" },
  { id: "catch", label: "Catch-light", group: "Effects", hint: "A bright inner edge away from the light" },
  { id: "emboss", label: "Emboss", group: "Effects", hint: "A light and a dark shadow pair: the part rises from the ground" },
  { id: "contact", label: "Contact", group: "Effects", hint: "A contact shadow: short, under raised controls" },
  { id: "glow", label: "Glow", group: "Effects", hint: "Accent light from solid actions and switches that are on" },
  { id: "grain", label: "Grain", group: "Page", hint: "Fine noise over the page" },
  { id: "page-glow", label: "Page glow", group: "Page", hint: "An accent wash on the page, toward the light" },
] as const;
export type MaterialLever = (typeof MATERIAL_LEVERS)[number]["id"];

export const MATERIAL_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export const MATERIAL_ANGLES = Array.from({ length: 24 }, (_, i) => i * 15);
export const leverSteps = (lever: MaterialLever): readonly number[] => lever === "angle" ? MATERIAL_ANGLES : MATERIAL_STEPS;

/** One-of switches: each option sets 0/1 gates (the first option sets none). */
export const MATERIAL_SWITCHES = [
  { id: "gradient-shape", label: "Gradient shape", lever: "gradient", options: [["linear", "Linear", []], ["radial", "Radial", ["gradient-radial"]]] },
  { id: "gradient-centre", label: "Gradient centre", lever: "gradient", options: [["light", "Toward light", []], ["middle", "Middle", ["gradient-centre"]], ["away", "Away", ["gradient-away"]]] },
  { id: "gradient-color", label: "Gradient color", lever: "gradient", options: [["tone", "Tone", []], ["accent", "Accent", ["gradient-accent"]]] },
  { id: "sheen-shape", label: "Sheen shape", lever: "sheen", options: [["soft", "Soft", []], ["band", "Band", ["sheen-band"]]] },
  // How see-through a part may go depends on what it holds (28-recipes): text 4.5:1 over any backdrop, accent icons 3:1.
  { id: "holds", label: "Holds", lever: "transparency", options: [["text", "Text", []], ["icons", "Icons", ["holds-icons"]], ["nothing", "Nothing", ["holds-none"]]] },
  // A ring takes the part's own colour, darker (Tone), or black (Neutral, the board's dark button).
  { id: "ring", label: "Ring color", lever: "stroke", options: [["tone", "Tone", []], ["neutral", "Neutral", ["stroke-neutral"]]] },
] as const satisfies ReadonlyArray<{ id: string; label: string; lever: MaterialLever; options: ReadonlyArray<readonly [string, string, readonly string[]]> }>;
export type MaterialSwitch = (typeof MATERIAL_SWITCHES)[number]["id"];

/** The stroke's styles, several at once. */
export const MATERIAL_STROKE_STYLES = [
  { id: "ring", label: "Ring", gate: "stroke-solid" },
  { id: "lit", label: "Lit edge", gate: "stroke-lit" },
  { id: "gradient", label: "Gradient", gate: "stroke-gradient" },
  { id: "double", label: "Double rim", gate: "stroke-double" },
] as const;

const GATES = [...new Set([...MATERIAL_SWITCHES.flatMap(s => s.options.flatMap(o => [...o[2]])), ...MATERIAL_STROKE_STYLES.map(s => s.gate)])];

/** Part groups: [id, strength, concave]. Concave parts (wells, selected rows) reverse gradients and shading. */
export const MATERIAL_ROLES = [
  ["primary", 1, false], ["secondary", 0.5, false], ["marks", 0.5, false], ["wells", 0.5, true],
  ["selection", 0.5, true], ["surfaces", 1, false], ["overlays", 1, false], ["chrome", 1, false],
] as const;
type Role = (typeof MATERIAL_ROLES)[number][0];

/** Which part groups each targeted lever reaches by default (29-scope; owner 2026-10-17: glass reaches cards too). */
export const MATERIAL_TARGETS: Partial<Record<MaterialLever, readonly Role[]>> = {
  gradient: ["primary"],
  sheen: ["primary"],
  transparency: ["surfaces", "overlays", "chrome"],
  frost: ["surfaces", "overlays", "chrome"],
  stroke: ["primary", "secondary", "marks"],
  inner: ["primary", "wells"],
  catch: ["primary", "wells"],
  emboss: ["primary"],
  contact: ["primary", "secondary"],
};

interface Bundle {
  label: string;
  description: string;
  levers?: Partial<Record<MaterialLever, number>>;
  switches?: Partial<Record<MaterialSwitch, string>>;
  stroke?: ReadonlyArray<(typeof MATERIAL_STROKE_STYLES)[number]["id"]>;
  targets?: Partial<Record<MaterialLever, readonly Role[]>>;
  /** Layers settings the bundle is drawn for; the app applies them with it (Soft needs a gray, flat page). */
  layers?: Readonly<Record<string, string>>;
}

/** The materials as lever values (27-levers "The materials as lever values"; Jelly from 28-recipes). */
export const MATERIAL_BUNDLES: Readonly<Record<string, Bundle>> = {
  none: { label: "None", description: "No material: every part paints its Layers tone alone." },
  glass: {
    label: "Glass", description: "See-through, frosted cards, overlays and chrome with a lit rim.",
    levers: { transparency: 6, frost: 6, stroke: 4, sheen: 3 }, stroke: ["lit"],
    targets: { stroke: ["primary", "secondary", "surfaces", "overlays", "chrome"], sheen: ["primary", "overlays"] },
  },
  tactile: {
    label: "Tactile", description: "A printed ring, a lit edge, crisp inner light and a contact shadow, on a grain page.",
    levers: { stroke: 4, inner: 4, contact: 4, grain: 3 }, stroke: ["ring", "lit"], switches: { ring: "neutral" },
  },
  jelly: {
    label: "Jelly", description: "A tone gradient, a bright catch-light and a tone ring on primary controls.",
    levers: { gradient: 4, sheen: 2, stroke: 5, catch: 6, inner: 5, contact: 2 }, stroke: ["ring"],
    targets: { inner: ["wells"], catch: ["primary"] },
  },
  soft: {
    label: "Soft", description: "Embossed controls and soft recessed fields on a gray, flat page, lit from the top left.",
    levers: { angle: 315, emboss: 4, inner: 4, softness: 8 }, targets: { inner: ["wells"] },
    layers: { "ground-light": "95", "ground-dark": "24", "layers-light": "0", "layers-dark": "0" },
  },
  aero: {
    label: "Aero", description: "An accent gradient under a banded sheen, a double rim and a catch-light.",
    levers: { gradient: 5, sheen: 6, stroke: 5, catch: 6, contact: 2 }, stroke: ["double"],
    switches: { "sheen-shape": "band", "gradient-color": "accent" }, targets: { catch: ["primary"] },
  },
  glow: {
    label: "Glow", description: "Accent light: a radial accent gradient, a gradient stroke, glowing actions and page.",
    levers: { glow: 6, "page-glow": 5, gradient: 3, stroke: 3 }, stroke: ["gradient"],
    switches: { "gradient-shape": "radial", "gradient-color": "accent" },
  },
};
export const DEFAULT_MATERIAL = "none";

/** The grain tile: mono fractal noise, about 0.4% darker a step on average (R04: Acrylic's noise is 2%; owner's board grain reads at 3). */
export const GRAIN_OPACITY_PER_STEP = 0.012;
export const GRAIN_TILE = (opacity: string) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${opacity}'/%3E%3C/svg%3E")`;
const grainImage = (step: number) => step === 0 ? "linear-gradient(transparent, transparent)" : GRAIN_TILE((step * GRAIN_OPACITY_PER_STEP).toFixed(3));

/** Every input a bundle sets: lever values, gates, targets. With no bundle every input is 0 and targets are defaults. */
function bundleInputs(bundle: Bundle): Record<string, string> {
  const out: Record<string, string> = {};
  for (const { id } of MATERIAL_LEVERS) {
    const value = bundle.levers?.[id] ?? 0;
    out[`${P}${id}`] = id === "angle" ? `${value}deg` : String(value);
  }
  out[`${P}grain-image`] = grainImage(bundle.levers?.grain ?? 0);
  const on = new Set<string>();
  for (const s of MATERIAL_SWITCHES) {
    const pick = bundle.switches?.[s.id];
    for (const gate of s.options.find(o => o[0] === pick)?.[2] ?? []) on.add(gate);
  }
  for (const style of bundle.stroke ?? []) on.add(MATERIAL_STROKE_STYLES.find(s => s.id === style)!.gate);
  for (const gate of GATES) out[`${P}${gate}`] = on.has(gate) ? "1" : "0";
  for (const [lever, fallback] of Object.entries(MATERIAL_TARGETS)) {
    const reach = bundle.targets?.[lever as MaterialLever] ?? fallback!;
    for (const [role] of MATERIAL_ROLES) out[`${P}${lever}-on-${role}`] = reach.includes(role) ? "1" : "0";
  }
  return out;
}

/** The inputs with no attribute (`:root`): None, plus each part group's strength. */
export function materialDefaults(): Record<string, string> {
  return {
    ...bundleInputs(MATERIAL_BUNDLES.none!),
    ...Object.fromEntries(MATERIAL_ROLES.map(([role, scope]) => [`${P}scope-${role}`, String(scope)])),
  };
}

/** A colour at an alpha that differs by theme: `light-dark(rgb(c / a x l), rgb(c / a x d))`. */
const ink = (rgb: string, a: string, light: number, dark: number) =>
  `light-dark(rgb(${rgb} / calc(${a} * ${light})), rgb(${rgb} / calc(${a} * ${dark})))`;
/** The lit colour at a strength that differs by theme. */
const lit = (a: string, light: number, dark: number) =>
  `light-dark(color-mix(in srgb, ${v("lit")} calc(${a} * ${light}%), transparent), color-mix(in srgb, ${v("lit")} calc(${a} * ${dark}%), transparent))`;

/**
 * The cross-lever derivations, re-emitted wherever an axis or a material is set (emit/css.ts), since each reads the
 * levers, the gates and the accent where it is declared. Per part group: a strength per lever, one image list (linear
 * and radial gradient, soft and band sheen), one gradient-stroke image and one shadow list (ring, lit edge, double
 * rim, inner pair, catch-light, emboss pair, contact). Gates are 0/1 numbers multiplied into alphas, so every value is
 * a number and a transparent layer is drawn where a lever is off; never `none`, which would void the list it sits in.
 * Unchanged from the 27-levers prototype (gen-levers.mjs) except the theme handling above.
 */
export function materialDerived(): Record<string, string> {
  const out: Record<string, string> = {
    [`${P}lx`]: `calc(-1 * sin(${v("angle")}))`,
    [`${P}ly`]: `cos(${v("angle")})`,
    // Where a radial gradient centres: toward the light (1), the middle (0) or away (-1; Aero's glow from below).
    [`${P}from`]: `calc(1 - ${v("gradient-centre")} - 2 * ${v("gradient-away")})`,
    // The least opacity for what see-through parts hold (22-calibration/floors.mjs, 28-recipes): text 4.5:1 over any
    // backdrop (0.56 light, 0.62 dark); accent icons 3:1 (0 / 0.71); nothing, none.
    [`${P}floor-light`]: `calc(0.56 * (1 - ${v("holds-icons")} - ${v("holds-none")}))`,
    [`${P}floor-dark`]: `calc(0.62 * (1 - ${v("holds-icons")} - ${v("holds-none")}) + 0.71 * ${v("holds-icons")})`,
    [`${P}lit`]: `color-mix(in oklab, white, var(${PREFIX}accent-solid) calc(${v("gradient-accent")} * 55%))`,
    [`${P}glow-shadow`]: `0 0 calc(${v("glow")} * 2.5px) calc(${v("glow")} * 0.4px) color-mix(in oklab, var(${PREFIX}accent-solid) calc(${v("glow")} * 11%), transparent)`,
    // The page: a glow toward the light over the grain tile; the page's own colour stays its Layers ground.
    [`${P}page`]: `radial-gradient(70% 60% at calc(50% - ${v("lx")} * 45%) calc(50% - ${v("ly")} * 45%), color-mix(in oklab, var(${PREFIX}accent-solid) calc(${v("page-glow")} * 4%), transparent), transparent 70%), ${v("grain-image")}`,
  };
  for (const [r, , concave] of MATERIAL_ROLES) {
    const s = (lever: MaterialLever) => MATERIAL_TARGETS[lever]
      ? `calc(${v(lever)} / 8 * ${v(`${lever}-on-${r}`)} * ${v(`scope-${r}`)})`
      : `calc(${v(lever)} / 8 * ${v(`scope-${r}`)})`;
    const k = (name: string) => v(`${r}-${name}`);
    const flip = concave ? -1 : 1;
    const soft = `(1px + ${v("softness")} * 0.25px)`;
    Object.assign(out, {
      [`${P}${r}-gradient`]: s("gradient"),
      [`${P}${r}-sheen`]: s("sheen"),
      [`${P}${r}-stroke`]: s("stroke"),
      [`${P}${r}-inner`]: s("inner"),
      [`${P}${r}-catch`]: s("catch"),
      [`${P}${r}-emboss`]: s("emboss"),
      [`${P}${r}-contact`]: s("contact"),
      [`${P}${r}-alpha-light`]: `calc(1 - ${s("transparency")} * (1 - ${v("floor-light")}))`,
      [`${P}${r}-alpha-dark`]: `calc(1 - ${s("transparency")} * (1 - ${v("floor-dark")}))`,
      [`${P}${r}-frost-strength`]: s("frost"),
      [`${P}${r}-frost`]: `blur(calc(${k("frost-strength")} * 32px)) saturate(calc(100% + ${k("frost-strength")} * 50%))`,
      [`${P}${r}-image`]: [
        `linear-gradient(calc(${v("angle")} + ${concave ? "0deg" : "180deg"}), ${lit(`${k("gradient")} * (1 - ${v("gradient-radial")})`, 45, 24)}, transparent 50%, ${ink("0 0 0", `${k("gradient")} * (1 - ${v("gradient-radial")})`, 0.22, 0.45)})`,
        `radial-gradient(130% 110% at calc(50% - ${v("lx")} * 45% * ${v("from")} * ${flip}) calc(50% - ${v("ly")} * 45% * ${v("from")} * ${flip}), ${lit(`${k("gradient")} * ${v("gradient-radial")}`, 55, 28)}, transparent 60%, ${ink("0 0 0", `${k("gradient")} * ${v("gradient-radial")}`, 0.18, 0.4)})`,
        `linear-gradient(calc(${v("angle")} + 180deg), ${ink("255 255 255", `${k("sheen")} * (1 - ${v("sheen-band")})`, 0.7, 0.22)}, transparent 62%)`,
        `linear-gradient(calc(${v("angle")} + 180deg), ${ink("255 255 255", `${k("sheen")} * ${v("sheen-band")}`, 0.55, 0.2)} 0 49%, transparent 50%)`,
      ].join(", "),
      [`${P}${r}-stroke-image`]: `linear-gradient(calc(${v("angle")} + 180deg), ${ink("255 255 255", `${k("stroke")} * ${v("stroke-gradient")}`, 1.8, 0.5)}, transparent 55%, ${ink("0 0 0", `${k("stroke")} * ${v("stroke-gradient")}`, 0.5, 1.2)})`,
      [`${P}${r}-shadow`]: [
        // Ring, neutral: black. (The tone ring reads the part's own fill, so each receiver draws it: material.css.)
        `0 0 0 1px ${ink("0 0 0", `${k("stroke")} * min(1, ${v("stroke-solid")} + ${v("stroke-double")}) * ${v("stroke-neutral")}`, 0.32, 2)}`,
        // Lit edge, toward the light.
        `inset calc(${v("lx")} * -1px) calc(${v("ly")} * 1px) 0 0 ${ink("255 255 255", `${k("stroke")} * ${v("stroke-lit")}`, 1.8, 0.3)}`,
        // Double rim: a light line just inside the ring.
        `inset 0 0 0 1px ${ink("255 255 255", `${k("stroke")} * ${v("stroke-double")}`, 1.6, 0.3)}`,
        // Inner pair: convex parts lit toward the light and shaded away; concave parts shaded toward it.
        `inset calc(${v("lx")} * -1 * ${soft}) calc(${v("ly")} * ${soft}) calc(${v("softness")} * 0.75px) 0 ${concave
          ? ink("0 0 0", k("inner"), 0.22, 0.75) : ink("255 255 255", k("inner"), 1.2, 0.25)}`,
        `inset calc(${v("lx")} * ${soft}) calc(${v("ly")} * -1 * ${soft}) calc(${v("softness")} * 0.75px) 0 ${concave
          ? "transparent" : ink("0 0 0", k("inner"), 0.3, 0.6)}`,
        // Catch-light: a bright inner edge away from the light.
        `inset calc(${v("lx")} * 3px) calc(${v("ly")} * -3px) 2px -1px ${ink("255 255 255", `min(1, ${k("catch")} * 1.4)`, 1, 0.64)}`,
        // Emboss: a light shadow toward the light and a dark one away.
        `calc(${v("lx")} * -1 * ${k("emboss")} * 5px) calc(${v("ly")} * -1 * ${k("emboss")} * 5px) calc(${k("emboss")} * 14px) 0 ${ink("255 255 255", `min(1, ${k("emboss")} * 2)`, 0.95, 0.05)}`,
        `calc(${v("lx")} * ${k("emboss")} * 5px) calc(${v("ly")} * ${k("emboss")} * 5px) calc(${k("emboss")} * 14px) 0 ${ink("0 0 0", `min(1, ${k("emboss")} * 2)`, 0.14, 0.65)}`,
        // Contact: 4 is the board's 0 2 4 at 10% (dark doubled, as Elevation's shadows).
        `calc(${v("lx")} * -1 * ${k("contact")} * 4px) calc(${v("ly")} * ${k("contact")} * 4px) calc(${k("contact")} * 8px) 0 ${ink("0 0 0", k("contact"), 0.2, 0.4)}`,
      ].join(", "),
      // Pressed flips raised to recessed (daisyUI :active, neumorphism).
      [`${P}${r}-pressed`]: `inset 0 1px 2px ${ink("0 0 0", `(${k("inner")} + ${k("stroke")})`, 0.3, 0.6)}`,
    });
  }
  return out;
}

/** The attribute rules: bundles first, so a lever, switch or stroke style on the same element wins over its bundle. */
export function materialRules(): Array<[string, Record<string, string>]> {
  const rules: Array<[string, Record<string, string>]> = [];
  for (const [id, bundle] of Object.entries(MATERIAL_BUNDLES)) rules.push([`[data-area-material="${id}"]`, bundleInputs(bundle)]);
  for (const { id } of MATERIAL_LEVERS) for (const step of leverSteps(id)) {
    rules.push([`[data-area-material-${id}="${step}"]`, {
      [`${P}${id}`]: id === "angle" ? `${step}deg` : String(step),
      ...(id === "grain" ? { [`${P}grain-image`]: grainImage(step) } : {}),
    }]);
  }
  for (const s of MATERIAL_SWITCHES) {
    const gates = [...new Set(s.options.flatMap(o => [...o[2]]))];
    for (const [value, , on] of s.options) {
      rules.push([`[data-area-material-${s.id}="${value}"]`, Object.fromEntries(gates.map(g => [`${P}${g}`, (on as readonly string[]).includes(g) ? "1" : "0"]))]);
    }
  }
  rules.push(["[data-area-material-stroke-style]", Object.fromEntries(MATERIAL_STROKE_STYLES.map(s => [`${P}${s.gate}`, "0"]))]);
  for (const s of MATERIAL_STROKE_STYLES) rules.push([`[data-area-material-stroke-style~="${s.id}"]`, { [`${P}${s.gate}`]: "1" }]);
  return rules;
}

/** Every attribute that sets a material input, for re-deriving where one is set. */
export const MATERIAL_ATTRIBUTES = [
  "data-area-material",
  ...MATERIAL_LEVERS.map(l => `data-area-material-${l.id}`),
  ...MATERIAL_SWITCHES.map(s => `data-area-material-${s.id}`),
  "data-area-material-stroke-style",
];
