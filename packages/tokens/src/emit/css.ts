/**
 * The CSS emitter.
 *
 * Everything ships as static CSS scoped by data attribute. Nothing is injected at runtime,
 * which is what removes the flash of unstyled content, keeps every value inspectable at
 * build time, and lets the contrast gate assert against literals.
 *
 * Layer order is declared in one place -- `@area/styles`'s index.css -- and every rule
 * here is wrapped in an explicit `@layer`, so if a bundler ever strips the order statement
 * the result degrades to declaration order rather than to chaos.
 */
import { PILL_SHAPES, pillDefaults } from "../axes/pills.ts";
import { type AxisDefinition, type TokenMap } from "../axes/schema.ts";
import { AXES, assertAxisIntegrity, attributeFor, defaultPresetOf, assertEmittedTokens } from "../axes/registry.ts";
import { baseTokens, derivedTokens } from "./base.ts";
import { REGISTERED_PROPERTIES } from "./base.ts";
import { THEME_AXIS } from "../axes/color.ts";
import { UI_SHORTHAND } from "../axes/ui-scale.ts";
import { MOTION_NONE } from "../axes/motion.ts";
import { FEEDBACK_NONE } from "../axes/feedback.ts";
import { MATERIAL_ATTRIBUTES, materialDefaults, materialDerived, materialRules } from "../axes/material.ts";

import { colorPairs } from "./colors.ts";
import { rederivationRules } from "./rederive.ts";
import { brandDefaultCss } from "../semantic/brand.ts";
import { PAGE_INPUTS } from "../color/colours.ts";

const INDENT = "  ";

function declarations(map: TokenMap, indent: string): string {
  return Object.entries(map)
    .map(([name, value]) => `${indent}${name}: ${value};`)
    .join("\n");
}

function rule(selector: string, map: TokenMap, indent = INDENT): string {
  if (Object.keys(map).length === 0) return "";
  return `${indent}${selector} {\n${declarations(map, indent + INDENT)}\n${indent}}`;
}

function banner(title: string, note?: string): string {
  return [
    `/* ${"-".repeat(74)}`,
    ` * ${title}`,
    ...(note ? [` *`, ...note.split("\n").map((l) => ` * ${l}`)] : []),
    ` * ${"-".repeat(74)} */`,
  ].join("\n");
}

function axisColors(axis: AxisDefinition, light: TokenMap, dark?: TokenMap): TokenMap {
  // Shadow recipes substitute their color where declared. Keep theme-owned colors paired
  // too, so a shadow inherited through a later theme boundary still selects its own mode.
  if (axis === THEME_AXIS) return colorPairs(
    THEME_AXIS.presets.find(p => p.id === "light")!.tokens,
    THEME_AXIS.presets.find(p => p.id === "dark")!.tokens,
  );
  return colorPairs(light, dark);
}

/** `@property` registrations. Their own file so a consumer can skip them if they clash. */
export function emitProperties(): string {
  const blocks = REGISTERED_PROPERTIES.map(
    (p) =>
      `${INDENT}@property ${p.name} {\n` +
      `${INDENT}${INDENT}syntax: "${p.syntax}";\n` +
      `${INDENT}${INDENT}inherits: true;\n` +
      `${INDENT}${INDENT}initial-value: ${p.initial};\n` +
      `${INDENT}}`,
  ).join("\n\n");

  return [
    banner(
      "Area — registered custom properties",
      "Generated. Do not edit.\n\n" +
        "Deliberately a short list: only properties that are interpolated, or where a\n" +
        "missing unit should be a parse error rather than a silently broken calc().",
    ),
    "",
    "@layer area.tokens {",
    blocks,
    "}",
    "",
  ].join("\n");
}

/**
 * Base primitives, cross-axis derivations, and every axis's default preset.
 *
 * Selected at `:where(:root)` -- specificity zero -- so that even if cascade layers are
 * stripped by a downstream tool, the axis blocks still win.
 */
export function emitTokens(): string {
  assertAxisIntegrity();

  const defaults: Record<string, string> = {};
  for (const axis of AXES) {
    const preset = defaultPresetOf(axis);
    const map = axisColors(axis, preset.tokens, preset.darkTokens);
    assertEmittedTokens(axis, map);
    Object.assign(defaults, map);
  }

  const out: string[] = [
    banner(
      "Area — token defaults",
      "Generated. Do not edit.\n\n" +
        "Base primitives, cross-axis derivations, and the default preset of every axis.\n" +
        "Selected at :where(:root) so its specificity is zero and anything can override it.",
    ),
    "",
    "@layer area.tokens {",
    rule(":where(:root)", { "color-scheme": "light", ...baseTokens(), ...pillDefaults(), ...materialDefaults(), ...defaults, ...brandDefaultCss().fixed, ...derivedTokens(), ...materialDerived() }),
    "}",
    "",
  ];

  return out.join("\n");
}

/** Selector for one preset of one axis, at its natural specificity. */
function presetSelector(axis: AxisDefinition, presetId: string): string {
  return `[${attributeFor(axis)}="${presetId}"]`;
}

/** Each role retains both polarities; the nearest color-scheme selects at consumption. */
export function emitAxes(): string {
  assertAxisIntegrity();

  const out: string[] = [
    banner(
      "Area — axes",
      "Generated. Do not edit.\n\n" +
        "One block per preset. Selecting an axis is a data attribute on any element:\n" +
        '  <html data-area-theme="dark" data-area-type="13" data-area-density="28" data-area-radius="0">\n\n' +
        "Custom properties inherit, so a subtree can carry its own axis values:\n" +
        '  <aside data-area-density="28"> ... </aside>',
    ),
    "",
    "@layer area.axes {",
  ];

  // The UI scale shorthand (axes/ui-scale.ts) first, so an explicit type or density on the same
  // element, emitted below at the same specificity, wins.
  out.push("");
  out.push(`${INDENT}/* UI scale shorthand — data-area-ui="compact" is type 12, Compact; "default" is type 14, Default. */`);
  for (const [id, pair] of Object.entries(UI_SHORTHAND)) {
    const pick = (axisId: string, presetId: string) => AXES.find(a => a.id === axisId)!.presets.find(p => p.id === presetId)!.tokens;
    out.push(rule(`[data-area-ui="${id}"]`, { ...pick("type", pair.type), ...pick("density", pair.density) }));
  }

  for (const axis of AXES) {
    out.push("");
    out.push(`${INDENT}/* ${axis.label} — ${axis.description} */`);

    for (const preset of axis.presets) {
      const map = axisColors(axis, preset.tokens, preset.darkTokens);
      assertEmittedTokens(axis, map);
      out.push(rule(presetSelector(axis, preset.id), {
        ...map,
        ...(axis === THEME_AXIS ? { "color-scheme": preset.id } : {}),
      }));
    }
  }

  // Material (axes/material.ts): a bundle, then single levers, switches and stroke styles, which win over a bundle on
  // the same element by coming later.
  out.push("");
  out.push(`${INDENT}/* Material — data-area-material="glass"; data-area-material-<lever>="0".."8" over it. */`);
  for (const [selector, map] of materialRules()) out.push(rule(selector, map));

  // Pill shapes (axes/pills.ts): a listed component is a pill; a scope with the attribute
  // clears every flag first, so the list is exactly the pills in that subtree.
  out.push("");
  out.push(`${INDENT}/* Pill shapes — data-area-pills="badge switch ...": these draw a pill; the rest follow radius. */`);
  out.push(rule("[data-area-pills]", Object.fromEntries(PILL_SHAPES.map(shape => [`--area-pill-${shape.id}`, "0"]))));
  for (const shape of PILL_SHAPES) out.push(rule(`[data-area-pills~="${shape.id}"]`, { [`--area-pill-${shape.id}`]: "1" }));

  // OS preference by default; an explicit scoped value can opt in or restore standard.
  // A level, not a switch (owner, 2026-10-18: More "seems very extreme"): Medium goes half way, as Material 3's
  // Standard / Medium / High. Every derivation mixes by it, so any value between 0 and 1 reads.
  // Nine levels since 2026-10-22 (owner: "i want more granularity in those options"), 0 (Standard) to 8 (More), each an
  // eighth of the way; the names Standard, Medium and More stay as aliases of 0, 4 and 8.
  // Quarter levels since 2026-10-24 (owner, the controls review: "more granularity"): 33 levels, 0 to 8.
  for (let quarter = 0; quarter <= 32; quarter++) out.push(rule(`[data-area-contrast="${quarter / 4}"]`, { "--area-contrast-more": String(quarter / 32) }));
  out.push(rule('[data-area-contrast="more"]', { "--area-contrast-more": "1" }));
  out.push(rule('[data-area-contrast="medium"]', { "--area-contrast-more": "0.5" }));
  out.push(rule('[data-area-contrast="standard"]', { "--area-contrast-more": "0" }));
  out.push('@media (prefers-contrast: more) {');
  out.push(rule(':root:not([data-area-contrast])', { "--area-contrast-more": "1", ...derivedTokens() }));
  out.push('}');

  // Re-derivation.
  //
  // A custom property is substituted where it is *declared*, and the result inherits as an
  // already-resolved value. So a derived token declared on :root bakes in :root's inputs and
  // will not respond to a subtree that redeclares them -- `<aside data-area-ui="compact">`
  // would get a 28px control with a 6px radius derived from 32. Repeating the derivations on
  // any element that carries an axis attribute makes them resolve against that element's own
  // values, which is exactly where they need to change and nowhere else.
  //
  // Each derivation is restated only by the attributes whose axes set one of its inputs (rederive.ts, 2026-10-25), in one
  // rule per set of attributes, so an element restates a token at most once and only the ones its own axes change.
  const keysOf = (axis: AxisDefinition) => new Set(axis.presets.flatMap(preset => Object.keys(axisColors(axis, preset.tokens, preset.darkTokens))));
  const axisKeys = new Map(AXES.map(axis => [axis.id, keysOf(axis)]));
  const triggers: Array<readonly [string, ReadonlySet<string>]> = [
    ...AXES.map(axis => [attributeFor(axis), axisKeys.get(axis.id)!] as const),
    ["data-area-ui", new Set([...axisKeys.get("type")!, ...axisKeys.get("density")!])],
    ["data-area-contrast", new Set(["--area-contrast-more"])],
    // Exact colours (color/colours.ts, 2026-10-27): a scope that sets picked page colours as variables restates what
    // reads them, as an axis attribute does.
    ["data-area-colours", new Set(PAGE_INPUTS.map(name => `--area-${name}`))],
  ];
  // Pills and Material set tokens on attributes that do not restate derivations, so a derivation reading one is restated
  // everywhere, as before.
  const elsewhere = [
    ...PILL_SHAPES.map(shape => `--area-pill-${shape.id}`),
    ...materialRules().flatMap(([, map]) => Object.keys(map)),
  ];
  out.push("");
  out.push(`${INDENT}/* Re-derive cross-axis values wherever an axis that feeds them is redeclared. */`);
  for (const [selectors, map] of rederivationRules(derivedTokens(), triggers, elsewhere)) out.push(rule(selectors.join(",\n" + INDENT), map));

  // Material's paints read only its own inputs and the accent's solid, so they re-derive only where one of those is set.
  out.push("");
  out.push(`${INDENT}/* Re-derive material paints wherever a material or the accent is redeclared. */`);
  out.push(rule([...MATERIAL_ATTRIBUTES.map(a => `[${a}]`), "[data-area-accent]", "[data-area-accent-strength]", "[data-area-solid-light]", "[data-area-solid-dark]"].join(",\n" + INDENT), materialDerived()));

  out.push("");
  // The system preference wins over a page's or subtree's own motion setting (motion pass,
  // 2026-10-07): it used to apply only where no data-area-motion was set.
  out.push(`${INDENT}/* Reduced motion resolves to the same tokens as motion 0 and feedback Off, wherever either is set. */`);
  out.push(`${INDENT}@media (prefers-reduced-motion: reduce) {`);
  const none = AXES.find((a) => a.id === "motion")!.presets.find((p) => p.id === MOTION_NONE)!;
  out.push(rule(":root, [data-area-motion]", none.tokens, INDENT + INDENT));
  // A press's give rests at 1 too: with no time to move, a scale would jump (Feedback, 2026-10-24).
  const still = AXES.find((a) => a.id === "feedback")!.presets.find((p) => p.id === FEEDBACK_NONE)!;
  out.push(rule(":root, [data-area-feedback]", still.tokens, INDENT + INDENT));
  out.push(`${INDENT}}`);
  out.push("}");
  out.push("");

  return out.join("\n");
}
