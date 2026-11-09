/**
 * Checks on code written outside the system's own folder (a person's or an agent's): the same core `area check` and
 * the MCP server's `system.validate_diff` run. Each finding names the file, the line and what to use instead.
 *
 *   not-in-system     a class of an Area component the system doesn't hold
 *   left-out-option   an option the system leaves out: `area-button--discovery`, `<Button tone="discovery">`
 *   unknown-token     `var(--area-…)` the system doesn't declare
 *   literal-color     a color value (#hex, rgb(), hsl(), oklch(), color-mix of literals) where a role belongs
 *   literal-length    a px length in a style, other than 0 and 1px
 *
 * Values the project keeps on purpose are listed in `.area/rules/literals.json` ([{ "value": "#1da1f2", "why": "…" }]).
 */
import type { ComponentEntry } from "./targets/agents.ts";

export interface Finding { path: string; line: number; rule: string; message: string }
export interface SystemIndex {
  dir: string;
  components: ComponentEntry[];
  /** Library components the system doesn't hold. */
  left: string[];
  tokens: Set<string>;
  literals: Set<string>;
}

export interface Changed { path: string; lines: Array<{ line: number; text: string }> }

/** The added lines of a unified diff, per file. */
export function addedLines(diff: string): Changed[] {
  const out: Changed[] = [];
  let current: Changed | null = null;
  let line = 0;
  for (const text of diff.split("\n")) {
    const file = /^\+\+\+ (?:b\/)?(.+)$/.exec(text);
    if (file) { current = file[1] === "/dev/null" ? null : { path: file[1]!.trim(), lines: [] }; if (current) out.push(current); continue; }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(text);
    if (hunk) { line = Number(hunk[1]); continue; }
    if (!current || text.startsWith("---")) continue;
    if (text.startsWith("+")) { current.lines.push({ line, text: text.slice(1) }); line++; }
    else if (!text.startsWith("-")) line++;
  }
  return out;
}

/** A whole file as if every line were added. */
export const wholeFile = (path: string, text: string): Changed => ({ path, lines: text.split("\n").map((t, i) => ({ line: i + 1, text: t })) });

const STYLED = /\.(css|scss|less|tsx|jsx|ts|js|vue|svelte|html|mdx)$/;
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(\s*[0-9.]/g;
const PX = /(?<![\w-])(\d*\.?\d+)px\b/g;
const pascal = (slug: string) => slug.split("-").map(part => part[0]!.toUpperCase() + part.slice(1)).join("");

export function validate(changes: readonly Changed[], index: SystemIndex): Finding[] {
  const findings: Finding[] = [];
  const held = new Map(index.components.map(c => [c.slug, c]));
  const left = new Set(index.left);
  for (const change of changes) {
    if (!STYLED.test(change.path) || change.path.startsWith(`${index.dir}/`) || change.path.startsWith(".area/")) continue;
    const styleFile = /\.(css|scss|less)$/.test(change.path);
    for (const { line, text } of change.lines) {
      const add = (rule: string, message: string) => findings.push({ path: change.path, line, rule, message });
      if (/^\s*(\/\/|\/\*|\*)/.test(text)) continue;
      for (const m of text.matchAll(/\barea-([a-z0-9]+(?:-[a-z0-9]+)*)(?:--([a-z0-9-]+))?/g)) {
        const [, slug, option] = m as unknown as [string, string, string | undefined];
        if (left.has(slug)) add("not-in-system", `area-${slug} is not in this system. Use a component DESIGN.md lists.`);
        else if (option && held.get(slug)?.without.includes(option)) add("left-out-option", `area-${slug}--${option}: ${option} is not in this system.`);
      }
      for (const m of text.matchAll(/<([A-Z][A-Za-z]+)\b([^<>]*)/g)) {
        const entry = index.components.find(c => c.name === m[1]);
        if (!entry?.without.length) continue;
        for (const p of m[2]!.matchAll(/\b([a-z][A-Za-z]*)=(?:"([^"]*)"|'([^']*)'|\{["']([^"']*)["']\})/g)) {
          const value = p[2] ?? p[3] ?? p[4];
          if (value && entry.without.includes(value) && (p[1]! in entry.variants)) add("left-out-option", `${m[1]} ${p[1]}="${value}" is not in this system: use ${entry.variants[p[1]!]!.join(", ")}.`);
        }
        for (const flag of entry.without) {
          const prop = flag.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
          if (!Object.values(entry.variants).some(values => values.includes(flag)) && new RegExp(`\\s${prop}(?:=\\{true\\}|(?=[\\s/>]|$))`).test(m[2]!)) add("left-out-option", `${m[1]} ${prop} is not in this system.`);
        }
      }
      for (const m of text.matchAll(/var\(\s*(--area-[a-z0-9-]+)/g)) if (!index.tokens.has(m[1]!)) add("unknown-token", `${m[1]} is not one of this system's custom properties.`);
      const literalScope = styleFile || /style=|styled|css`|:\s*["'`]/.test(text);
      if (!literalScope) continue;
      for (const m of text.matchAll(COLOR)) {
        const value = text.slice(m.index!, text.indexOf(")", m.index!) + 1 || undefined).trim();
        const literal = m[0].startsWith("#") ? m[0] : value;
        if (!index.literals.has(literal.toLowerCase())) add("literal-color", `${literal}: paint with a color role (--area-bg-…, --area-fg-…, --area-edge-…), or record it in .area/rules/literals.json.`);
      }
      if (styleFile || /style=/.test(text)) for (const m of text.matchAll(PX)) {
        if (m[1] === "0" || m[1] === "1" || index.literals.has(`${m[1]}px`)) continue;
        add("literal-length", `${m[0]}: use a space, size or radius custom property, or record it in .area/rules/literals.json.`);
      }
    }
  }
  return findings;
}

/** Every custom property a stylesheet declares. */
export function declaredTokens(...sheets: string[]): Set<string> {
  const out = new Set<string>();
  for (const css of sheets) for (const m of css.matchAll(/(--area-[a-z0-9-]+)\s*:/g)) out.add(m[1]!);
  return out;
}

export { pascal };
