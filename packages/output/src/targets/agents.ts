/**
 * The agent contract: what people and coding agents read to build inside the system, made from the same choices as the
 * code, so it can't say something the code doesn't do.
 *
 *   DESIGN.md                    at the project's root: the system in prose with its rules, in the DESIGN.md section
 *                                order (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components,
 *                                Do's and Don'ts), its front matter naming the system
 *   AGENTS.md#area               a block of its own inside the project's AGENTS.md (the rest of that file is the
 *                                user's): where the system is, its rules in short, and the checks
 *   <dir>/components.json        every component the system holds, as the MCP server and `area check` read it
 */
import type { SystemDefinition } from "../definition.ts";
import { pruneManifest, slugOf, type Held } from "../inventory.ts";
import type { Library } from "../library.ts";

export const AGENTS_BLOCK = "AGENTS.md#area";

const pascal = (slug: string) => slug.split("-").map(part => part[0]!.toUpperCase() + part.slice(1)).join("");

export interface ComponentEntry {
  slug: string;
  name: string;
  description: string;
  block: string;
  variants: Record<string, readonly string[]>;
  flags: readonly string[];
  states: readonly string[];
  parts: readonly string[];
  defaults: Record<string, string>;
  /** Options the system leaves out. */
  without: string[];
  /** Why it is here when the system didn't choose it: the chosen components that need it. */
  neededBy?: string[];
  /** The React file, when it has one. */
  react?: string;
  docs?: Library["docs"][string];
}

export function componentEntries(lib: Library, held: Held): ComponentEntry[] {
  return [...held.slugs].sort().map(slug => {
    const manifest = lib.manifests[held.keyOf.get(slug)!]!;
    const pruned = pruneManifest(manifest, held.without.get(slug));
    const file = `${pascal(slug)}.tsx`;
    const without = [...(held.without.get(slug) ?? [])].sort();
    const neededBy = held.needed.get(slug);
    return {
      slug, name: pascal(slug), description: manifest.description, block: manifest.block,
      variants: pruned.variants, flags: pruned.booleans ?? [], states: manifest.states ?? [], parts: manifest.elements ?? [],
      defaults: manifest.defaults, without,
      ...(neededBy ? { neededBy: [...neededBy].sort() } : {}),
      ...(held.files.has(file) ? { react: `react/components/${file}` } : {}),
      ...(lib.docs[slug] ? { docs: lib.docs[slug] } : {}),
    };
  });
}

/** Token names of a group, from Area's defaults sheet. */
function tokenNames(lib: Library, pattern: RegExp): string[] {
  const names = new Set<string>();
  for (const m of lib.tokens.defaults.matchAll(/^\s*(--area-[a-z0-9-]+):/gm)) if (pattern.test(m[1]!)) names.add(m[1]!);
  return [...names].sort();
}

const list = (names: string[], max = 40) => names.slice(0, max).map(n => `\`${n}\``).join(", ") + (names.length > max ? `, and ${names.length - max} more` : "");

export function designMd(def: SystemDefinition, lib: Library, held: Held, entries: ComponentEntry[]): string {
  const dir = def.output.dir;
  const theme = def.themes.find(t => t.id === def.theme)!;
  const s = theme.settings;
  const others = def.themes.filter(t => t.id !== def.theme);
  const colours = lib.tokens.semantics.map(name => `--area-${name}`);
  const groups: Array<[string, RegExp]> = [["Grounds", /^--area-bg-/], ["Ink", /^--area-fg-/], ["Edges", /^--area-(edge|border)-/], ["Accent and action", /^--area-(accent|action)-/], ["Status", /^--area-(info|success|warning|caution|danger|discovery)-/], ["Selection", /^--area-selection-/]];
  const colourLines = groups.map(([label, pattern]) => `- **${label}:** ${list(colours.filter(n => pattern.test(n)), 24)}`);
  const setting = (name: string, fallback = "Area's default") => s[name] ? `\`${s[name]}\`` : fallback;
  const component = (e: ComponentEntry) => {
    const lines = [`### ${e.name}`, "", e.description, ""];
    if (e.react) lines.push(`- React: \`import { ${e.name} } from "./${dir}/react"\``);
    lines.push(`- Class: \`${e.block}\`${e.parts.length ? `; parts ${e.parts.map(p => `\`__${p}\``).join(", ")}` : ""}`);
    for (const [axis, values] of Object.entries(e.variants)) lines.push(`- \`${axis}\`: ${values.map(v => v === e.defaults[axis] ? `\`${v}\` (default)` : `\`${v}\``).join(", ")}`);
    if (e.flags.length) lines.push(`- Flags: ${e.flags.map(f => `\`${f}\``).join(", ")}`);
    if (e.states.length) lines.push(`- States: ${e.states.map(f => `\`${f}\``).join(", ")}`);
    if (e.without.length) lines.push(`- Not in this system: ${e.without.map(f => `\`${f}\``).join(", ")}. Don't use them.`);
    if (e.neededBy) lines.push(`- Here because ${e.neededBy.map(n => pascal(n)).join(", ")} ${e.neededBy.length > 1 ? "use" : "uses"} it.`);
    for (const [kind, text] of e.docs?.practices ?? []) lines.push(`- ${kind}: ${text}`);
    for (const [situation, slugs, why] of e.docs?.instead ?? []) {
      const held = slugs.filter(slug => entries.some(other => other.slug === slug));
      if (held.length) lines.push(`- Instead, for ${situation.charAt(0).toLowerCase()}${situation.slice(1)}: ${held.map(n => pascal(n)).join(" or ")}. ${why}`);
    }
    return lines.join("\n");
  };
  const kept = held.kept.map(k => `- \`${pascal(k.slug)}\` keeps \`${k.option}\`: ${k.why}.`);
  return `---
version: alpha
name: ${JSON.stringify(def.system.name)}
description: ${JSON.stringify(`${def.system.name} ${def.release.version}, written by Area from library ${lib.version}.`)}
---

# ${def.system.name}

## Overview

${def.system.name} ${def.release.version} is this project's design system. Its code is in \`${dir}/\`: CSS custom properties and component styles (\`${dir}/css\`)${def.output.targets.react ? `, React components (\`${dir}/react\`)` : ""}${def.output.targets.icons ? ` and icons (\`${dir}/icons\`)` : ""}. The project owns these files: edit them as you would any code. Area writes the system again when it changes and keeps those edits.

Load the styles once, before the app's own: \`@import "./${dir}/css/index.css";\`${def.output.targets.react ? ` (or \`import "./${dir}/css/index.css"\` in the app's entry)` : ""}. Light is the default; dark is \`data-area-theme="dark"\` on \`<html>\`.${others.length ? ` Its other ${others.length === 1 ? "theme paints" : "themes paint"} a part of a page: ${others.map(t => `\`data-area-system-theme="${t.id}"\` (${t.name})`).join(", ")}.` : ""}
${def.release.note ? `\nThis version: ${def.release.note}\n` : ""}
## Colors

Every color is a semantic role, a custom property that already holds its light and dark values. Paint with the role that says what a thing is, never with a color value.

${colourLines.join("\n")}

Settings: neutral ${setting("neutral")}, accent ${setting("accent")}${theme.accent.on ? ` (an exact accent, ${theme.accent.primary})` : ""}, contrast ${setting("contrast", "following the device")}.

## Typography

Text sizes come from the type setting (${setting("type")}): \`--area-text-<style>-size\`, \`-leading\` and \`-tracking\` for ${list(tokenNames(lib, /^--area-text-[a-z0-9]+-size$/).map(n => n.replace(/^--area-text-|-size$/g, "")))}. Weights: \`--area-weight-regular\`, \`--area-weight-strong\`. Fonts: \`--area-font-sans\`, \`--area-font-mono\`.

## Layout

Density ${setting("density")}. Spacing comes from the space ramp, ${list(tokenNames(lib, /^--area-space-[0-9a-z-]+$/), 16)}. Components own their insets; don't pad around them to change their size: use their \`size\` option.

## Elevation & Depth

Elevation ${setting("elevation")}, Material ${theme.material.bundle === lib.tokens.defaultMaterial && !Object.keys(theme.material.overrides).length ? "none" : `\`${theme.material.bundle}\``}. Shadows are roles: ${list(tokenNames(lib, /^--area-shadow-[a-z]+$/), 12)}.

## Shapes

Radius ${setting("radius")}${s.pills ? `; pills: ${s.pills.split(" ").filter(Boolean).map(p => `\`${p}\``).join(", ") || "none"}` : ""}. Corners are roles, ${list(tokenNames(lib, /^--area-radius-[a-z-]+$/), 12)}; a component's corner follows its shape role.

## Components

${entries.length} components. Use them before writing markup of your own, and only with the options listed: anything else is not in this system.

${entries.map(component).join("\n\n")}
${kept.length ? `\nOptions this system asked to leave out but keeps:\n\n${kept.join("\n")}\n` : ""}
## Do's and Don'ts

- Do use a component from \`${dir}/\` when one fits, with the options above.
- Do paint, space and round with the system's custom properties (\`var(--area-…)\`).
- Do keep text and controls readable: the roles are checked for contrast in light and dark; a color of your own isn't.
- Don't write color, size, radius or shadow values in code; when a value has no role, ask for one, or record it in \`.area/rules/literals.json\` with why.
- Don't use an option or a class this system doesn't list (\`area check\` reports them).
- Don't restyle a component from outside it; change it in \`${dir}/\` so every use changes together.
`;
}

export function agentsBlock(def: SystemDefinition): string {
  const dir = def.output.dir;
  return `## Design system

This project's design system is ${def.system.name} ${def.release.version}, in \`${dir}/\`, described in \`DESIGN.md\`. Read DESIGN.md before building UI.

- Use its components and options; paint, space and round with its \`--area-*\` custom properties, never literal values.
- Edits to \`${dir}/\` are fine: Area keeps them when it writes the system again.
- Check UI changes with \`npx area check\` (unknown options, excluded components, literal values). Agents can ask the system directly through its MCP server: \`npx area mcp\`.
`;
}
