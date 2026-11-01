/**
 * Every token a system has, for the Tokens page and the foundation pages (owner, 2026-10-31: tokens, not Figma's
 * "variables": "changing tokens to variables is unecessary and isnt confusing"). From @area/tokens' build (tokens.json),
 * in three tiers, as Penpot, Tokens Studio and the design tokens format sort them:
 *
 *   raw         the scales and ramps: what a value is (blue-500, space-16, radius-8, z-modal)
 *   role        what a value is for: bg-page, fg-muted, gap-md, shadow-float, duration-fast; most are set by a setting
 *   component   one component's own: input-*, select-*, composer-*
 *
 * A token's definition names the tokens it refers to (its references); its value is read live on the Canvas, so it
 * follows the theme and every setting. Tokens other tokens are only built from (…-pick, …-full, …-rung, …-step) are
 * left out: nobody uses them directly.
 */
import TOKENS from "@area/tokens/tokens.json";

export type Tier = "raw" | "role" | "component";
export const TIERS: ReadonlyArray<{ id: Tier; label: string; lede: string }> = [
  { id: "raw", label: "Raw values", lede: "The scales and ramps every other token is made from." },
  { id: "role", label: "Roles", lede: "What a value is for. Use these in designs; most follow a setting." },
  { id: "component", label: "Component tokens", lede: "One component's own values, made from roles." },
];

export type TokenGroup = "color" | "type" | "spacing" | "shape" | "elevation" | "motion" | "other";
export const TOKEN_GROUPS: ReadonlyArray<{ id: TokenGroup; label: string }> = [
  { id: "color", label: "Color" }, { id: "type", label: "Typography" }, { id: "spacing", label: "Spacing" }, { id: "shape", label: "Shape" },
  { id: "elevation", label: "Elevation" }, { id: "motion", label: "Motion" }, { id: "other", label: "Other" },
];

/** How a token's live value is read: through the CSS property it is meant for, so a color resolves to a color. */
export type Measure = "color" | "length" | "shadow" | "z" | "duration" | "easing" | "weight" | "font" | "raw";

export interface Token {
  /** The custom property, "--area-bg-page". */
  name: string;
  tier: Tier;
  group: TokenGroup;
  measure: Measure;
  /** What it is defined as: a value, a formula over other tokens, or a scale step per mode. */
  definition: string;
  /** The tokens its definition names, in order. */
  refs: string[];
  /** Where it is meant to be used (Figma's scopes), from its name. */
  usedFor: string;
  /** The setting that writes it, when one does. */
  setting?: string;
}

type Axis = { id: string; label: string; defaultPreset: string; presets: Array<{ id: string; tokens: Record<string, string> }> };
type Semantic = { kind: string; role?: string; light?: string | number; dark?: string | number };
type ScaleSteps = { steps: Array<{ level: number; hex: string }> };

const SCALES = TOKENS.scales as unknown as Record<string, ScaleSteps>;
const SCALE_IDS = new Set(Object.keys(SCALES));
const COLOR = new Set(["white", "black", "bg", "fg", "border", "accent", "selection", "layer", "danger", "warning", "caution", "success", "info",
  "discovery", "secondary", "tertiary", "fill", "mark", "syntax", "scrim", "tint", "ink", "ground", "neutral", "status", "strength", "label", "selected",
  "gray", "solid", "card", "layers", "row", "action"]);
const TYPE = new Set(["size", "leading", "wght", "weight", "font", "text", "title", "display", "type", "keyboard"]);
const SPACING = new Set(["space", "gap", "inset", "density", "control", "icon"]);
const SHAPE = new Set(["radius", "frame", "edge", "stroke", "focus"]);
const ELEVATION = new Set(["shadow", "cast", "z", "elevation"]);
const MOTION = new Set(["duration", "ease", "feedback", "transition", "hover", "press"]);
/** Families that are one component's (docs/COMPONENTS.md names). */
const COMPONENTS = new Set(["input", "textarea", "select", "composer", "field", "token", "badge", "ui"]);
const RAW = /^--area-(space|size|leading|wght|z)-[\w]+$|^--area-radius-(\d+|full)$|^--area-(white|black)$/;
const INTERNAL = /(?<!radius)-(pick|full|rung|step|auto|room-[\w-]+|tint-[lc]|loaded)$|^--area-(device-pixel|edge-shift|contrast-more)/;

const familyOf = (name: string) => name.slice("--area-".length).split("-")[0]!;

function groupOf(name: string): TokenGroup {
  const family = familyOf(name);
  if (name === "--area-stroke-width" || name.startsWith("--area-stroke-") && !name.startsWith("--area-stroke-control")) return "shape";
  if (SCALE_IDS.has(family) || COLOR.has(family) || name.startsWith("--area-stroke-control") || name.startsWith("--area-shadow-color")) return "color";
  if (TYPE.has(family)) return "type";
  if (SPACING.has(family)) return "spacing";
  if (SHAPE.has(family)) return "shape";
  if (ELEVATION.has(family)) return "elevation";
  if (MOTION.has(family)) return "motion";
  if (COMPONENTS.has(family)) {
    // A component's own tokens sit in the group their value is: a height in Spacing, a color in Color.
    return /-(bg|fg|border|edge|ink|tint|color|fill)\b/.test(name) ? "color" : /-(radius)\b/.test(name) ? "shape" : "spacing";
  }
  return "other";
}

function measureOf(name: string, group: TokenGroup): Measure {
  const family = familyOf(name);
  // An edge is a stroke's color, listed with Shape.
  if (group === "color" || family === "edge") return "color";
  if (family === "z") return "z";
  if (family === "shadow" || family === "cast") return "shadow";
  if (family === "duration") return "duration";
  if (family === "ease") return "easing";
  if (family === "wght" || family === "weight") return "weight";
  if (family === "font") return "font";
  if (/(-level|-factor|-concentric|-loop|-strength)$/.test(name) || family === "feedback") return "raw";
  if (["space", "gap", "inset", "radius", "size", "leading", "control", "icon", "frame", "stroke", "focus", "text", "title", "display", "input", "textarea", "select", "composer", "field"].includes(family)) return "length";
  return "raw";
}

function usedFor(name: string, group: TokenGroup): string {
  const family = familyOf(name);
  if (group === "color") {
    if (SCALE_IDS.has(family) || family === "white" || family === "black") return "A raw color: refer to it from a role";
    if (/(^|-)fg(-|$)/.test(name.slice(7)) || /-label/.test(name)) return "Text and icons";
    if (/-(border|edge|stroke)/.test(name) || family === "border" || family === "edge") return "Strokes";
    if (family === "layer") return "Surfaces";
    if (family === "selection") return "Selected items";
    return "Fills";
  }
  if (family === "space") return "Gaps and padding";
  if (family === "gap") return "Gaps between items";
  if (family === "inset") return "Padding inside surfaces";
  if (family === "icon") return "Icon sizes";
  if (family === "control") return name.endsWith("-text") || name.endsWith("-leading") ? "Type in controls" : "Control heights";
  if (family === "radius") return "Corners";
  if (family === "edge" || family === "stroke" || family === "frame") return "Stroke widths";
  if (family === "focus") return "Focus rings";
  if (family === "shadow" || family === "cast") return "Shadows";
  if (family === "z") return "Stacking order";
  if (family === "duration") return "Durations";
  if (family === "ease") return "Easing";
  if (family === "feedback") return "Hover and press feedback";
  if (family === "wght" || family === "weight") return "Font weight";
  if (family === "font") return "Font family";
  if (group === "type") return "Type size and line height";
  return group === "other" ? "Other" : "Sizes";
}

const refsOf = (name: string, definition: string) => [...new Set([...definition.matchAll(/var\((--area-[\w-]+)/g)].map(match => match[1]!))].filter(ref => ref !== name);

/** "white" → the white token; 975 → the role's scale step. */
const stepToken = (role: string, step: string | number) => step === "white" || step === "black" ? `--area-${step}` : `--area-${role}-${step}`;

function build(): Token[] {
  const tokens = new Map<string, Token>();
  const add = (name: string, definition: string, extra: Partial<Token> = {}) => {
    if (tokens.has(name) || INTERNAL.test(name)) return;
    const group = groupOf(name);
    const tier: Tier = RAW.test(name) || SCALE_IDS.has(familyOf(name)) && /-\d+$/.test(name) ? "raw" : COMPONENTS.has(familyOf(name)) ? "component" : "role";
    tokens.set(name, { name, tier, group, measure: measureOf(name, group), definition, refs: refsOf(name, definition), usedFor: usedFor(name, group), ...extra });
  };
  // The scales: each a raw color per step.
  for (const [id, scale] of Object.entries(SCALES)) for (const step of scale.steps) add(`--area-${id}-${step.level}`, step.hex);
  // The color roles, read as the scale step they take in each mode.
  for (const [id, semantic] of Object.entries(TOKENS.semantics as unknown as Record<string, Semantic>)) {
    const name = `--area-${id}`;
    if (semantic.kind === "slot" && semantic.role && semantic.light != null && semantic.dark != null) {
      const light = stepToken(semantic.role, semantic.light), dark = stepToken(semantic.role, semantic.dark);
      add(name, `${light.slice(7)} in light, ${dark.slice(7)} in dark`, { refs: [light, dark] });
      tokens.get(name)!.refs = [light, dark];
    }
  }
  for (const [name, value] of Object.entries(TOKENS.base as Record<string, string>)) add(name, value);
  for (const [name, value] of Object.entries(TOKENS.derived as Record<string, string>)) add(name, value);
  // The tokens a setting writes, as its default choice writes them.
  for (const axis of TOKENS.axes as unknown as Axis[]) {
    const preset = axis.presets.find(entry => entry.id === axis.defaultPreset);
    for (const [name, value] of Object.entries(preset?.tokens ?? {})) add(name, value, { setting: axis.label });
  }
  return [...tokens.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export const TOKEN_LIST: readonly Token[] = build();
export const TOKEN_BY_NAME: ReadonlyMap<string, Token> = new Map(TOKEN_LIST.map(token => [token.name, token]));

/** The CSS property a token's value is read through, so `getComputedStyle` resolves it. */
const PROBE: Record<Measure, string | null> = {
  color: "color", length: "width", shadow: "box-shadow", z: "z-index", duration: "transition-duration",
  easing: "transition-timing-function", weight: "font-weight", font: "font-family", raw: null,
};

/**
 * Each token's value as it resolves under `scope` (an element inside the Canvas, so the theme and settings apply). A
 * probe element takes each token on its own property and reads it back; a raw token is read as its custom property.
 */
export function readValues(scope: HTMLElement, list: readonly Token[]): Map<string, string> {
  const values = new Map<string, string>();
  // One probe per token, all placed before any is read, so the browser works out their styles once, not per token.
  const box = document.createElement("div");
  box.style.cssText = "position: absolute; visibility: hidden; pointer-events: none; inline-size: 0; block-size: 0; overflow: hidden";
  const probes = list.map(token => {
    const property = PROBE[token.measure];
    const probe = document.createElement("span");
    if (property) probe.style.setProperty(property, `var(${token.name})`);
    box.append(probe);
    return { token, property, probe };
  });
  scope.append(box);
  const own = getComputedStyle(scope);
  // A color reads back in whatever space it was mixed in (rgb, oklab, color(srgb …)); one painted pixel gives its hex.
  const paint = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const two = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  const known = new Map<string, string>();
  const hex = (color: string) => {
    const rgb = color.match(/^rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([\d.]+))?\)$/);
    if (rgb) return `#${two(+rgb[1]!)}${two(+rgb[2]!)}${two(+rgb[3]!)}${rgb[4] != null && +rgb[4] < 1 ? two(+rgb[4] * 255) : ""}`;
    if (!paint || !color) return color;
    if (known.has(color)) return known.get(color)!;
    paint.clearRect(0, 0, 1, 1);
    paint.fillStyle = "#000";
    paint.fillStyle = color;
    paint.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = paint.getImageData(0, 0, 1, 1).data;
    const read = `#${two(r!)}${two(g!)}${two(b!)}${a! < 255 ? two(a!) : ""}`;
    known.set(color, read);
    return read;
  };
  for (const { token, property, probe } of probes) {
    if (!property) { values.set(token.name, own.getPropertyValue(token.name).trim()); continue; }
    const value = getComputedStyle(probe).getPropertyValue(property).trim();
    values.set(token.name, token.measure === "color" ? hex(value) : value);
  }
  box.remove();
  return values;
}

/** The tokens as the design tokens format writes them (designtokens.org): groups of `$type` and `$value`. */
export function toDesignTokens(list: readonly Token[], values: ReadonlyMap<string, string>): string {
  const TYPE: Record<Measure, string | undefined> = { color: "color", length: "dimension", shadow: "shadow", z: "number", duration: "duration",
    easing: "cubicBezier", weight: "fontWeight", font: "fontFamily", raw: undefined };
  const out: Record<string, Record<string, unknown>> = {};
  for (const token of list) {
    const group = (out[token.group] ??= {});
    const value = token.refs.length === 1 && token.definition.trim() === `var(${token.refs[0]})` ? `{${token.refs[0]!.slice(7)}}` : values.get(token.name) ?? token.definition;
    group[token.name.slice(7)] = { ...(TYPE[token.measure] ? { $type: TYPE[token.measure] } : {}), $value: value, $description: token.usedFor };
  }
  return JSON.stringify(out, null, 2);
}
