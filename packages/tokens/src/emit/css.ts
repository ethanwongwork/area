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
import { type AxisDefinition, type TokenMap } from "../axes/schema.ts";
import { AXES, assertAxisIntegrity, attributeFor, defaultPresetOf } from "../axes/registry.ts";
import { baseTokens, derivedTokens } from "./base.ts";
import { REGISTERED_PROPERTIES } from "./base.ts";
import { BRAND_AXIS, NEUTRAL_AXIS, THEME_AXIS } from "../axes/color.ts";

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
  for (const axis of AXES) Object.assign(defaults, defaultPresetOf(axis).tokens);

  const out: string[] = [
    banner(
      "Area — token defaults",
      "Generated. Do not edit.\n\n" +
        "Base primitives, cross-axis derivations, and the default preset of every axis.\n" +
        "Selected at :where(:root) so its specificity is zero and anything can override it.",
    ),
    "",
    "@layer area.tokens {",
    rule(":where(:root)", { ...baseTokens(), ...defaults, ...derivedTokens() }),
    "}",
    "",
  ];

  return out.join("\n");
}

/** Selector for one preset of one axis, at its natural specificity. */
function presetSelector(axis: AxisDefinition, presetId: string, dark = false): string {
  const own = `[${attributeFor(axis)}="${presetId}"]`;
  return dark ? `[${attributeFor(THEME_AXIS)}="dark"]${own}` : own;
}

/**
 * Every axis preset as its own block.
 *
 * Specificity does the work here rather than `:where()`, because the colour axes need
 * theme-qualified variants to beat their unqualified ones. A compound selector such as
 * `[data-area-theme="dark"][data-area-brand="blue"]` scores (0,2,0) and so reliably wins
 * over the plain `[data-area-brand="blue"]` that carries the light values. Using
 * `:where()` here would zero both and leave the outcome to source order.
 *
 * Layer placement still guarantees the whole file beats the defaults, and unlayered
 * consumer CSS still beats all of it.
 */
export function emitAxes(): string {
  assertAxisIntegrity();

  const out: string[] = [
    banner(
      "Area — axes",
      "Generated. Do not edit.\n\n" +
        "One block per preset. Selecting an axis is a data attribute on any element:\n" +
        '  <html data-area-theme="dark" data-area-density="compact" data-area-radius="sharp">\n\n' +
        "Custom properties inherit, so a subtree can carry its own axis values:\n" +
        '  <aside data-area-density="compact"> ... </aside>',
    ),
    "",
    "@layer area.axes {",
  ];

  for (const axis of AXES) {
    out.push("");
    out.push(`${INDENT}/* ${axis.label} — ${axis.description} */`);

    for (const preset of axis.presets) {
      // The theme axis additionally carries the dark values of the *default* neutral and
      // brand, so `data-area-theme="dark"` alone produces a complete dark theme.
      const extra =
        axis === THEME_AXIS && preset.id === "dark"
          ? {
              ...(defaultPresetOf(NEUTRAL_AXIS).darkTokens ?? {}),
              ...(defaultPresetOf(BRAND_AXIS).darkTokens ?? {}),
            }
          : {};

      out.push(rule(presetSelector(axis, preset.id), { ...preset.tokens, ...extra }));

      if (preset.darkTokens) {
        out.push(rule(presetSelector(axis, preset.id, true), preset.darkTokens));
      }
    }
  }

  // Re-derivation.
  //
  // A custom property is substituted where it is *declared*, and the result inherits as an
  // already-resolved value. So a derived token declared on :root bakes in :root's inputs and
  // will not respond to a subtree that redeclares them -- `<aside data-area-density="compact">`
  // would get a 28px control with a 6px radius derived from 32. Repeating the derivations on
  // any element that carries an axis attribute makes them resolve against that element's own
  // values, which is exactly where they need to change and nowhere else.
  const axisBearing = AXES.map((a) => `[${attributeFor(a)}]`).join(",\n" + INDENT);
  out.push("");
  out.push(`${INDENT}/* Re-derive cross-axis values wherever an axis is redeclared. */`);
  out.push(rule(axisBearing, derivedTokens()));

  out.push("");
  out.push(`${INDENT}/* Reduced motion resolves to the same tokens as the "none" preset. */`);
  out.push(`${INDENT}@media (prefers-reduced-motion: reduce) {`);
  const none = AXES.find((a) => a.id === "motion")!.presets.find((p) => p.id === "none")!;
  out.push(rule(":root:not([data-area-motion])", none.tokens, INDENT + INDENT));
  out.push(`${INDENT}}`);
  out.push("}");
  out.push("");

  return out.join("\n");
}
