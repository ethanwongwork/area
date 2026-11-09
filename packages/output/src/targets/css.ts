/**
 * The CSS target: the system's tokens and Area's component sheets, holding only what the system chose.
 *
 * Tokens. Area paints a setting through data-area-* attributes: one rule per value of every setting (axes.css, 1.5 MB),
 * chosen by the attribute on an element. A system has made its choices, so its sheet keeps only the chosen value's
 * rules, rebound to the theme's scope (`:root` for the first theme), and its pages carry no attributes at all but the
 * mode (`data-area-theme="dark"`, a reader's choice, kept as Area writes it). Rebinding keeps each rule's specificity
 * (an attribute and `:root` both count one class) and its place in the sheet, so the cascade is Area's own: every
 * custom property resolves to the value the app paints (fidelity check: scripts/fidelity.mjs).
 *
 *   [data-area-X="V"]              kept, rebound to the scope, when the theme sets X to V (`~=` when its list holds V)
 *   [data-area-X]                  rebound when the theme sets X (it restates derivations where X is set)
 *   :root:not([data-area-X])       kept only when the theme leaves X unset (Contrast at System follows the Mac)
 *   [data-area-theme…]             the mode: kept as it is, at :root's pass
 *   :root, :where(:root)           kept, at :root's pass
 *
 * A theme after the first is a scope, `[data-area-system-theme="<id>"]`; its pass keeps only rebound rules, every
 * derivation restated there, so a subtree paints the second theme in full.
 *
 * Components. A system leaves out components and options: a selector that names a left-out component's class, or a
 * left-out option's modifier (`.area-button--discovery`), is dropped, and a rule with no selector left goes with the
 * comment written for it. Nothing else in a sheet changes.
 */
import { declarations, isEmpty, parse, print, rewriteSelectors, splitSelectors, type Node } from "../css.ts";

/** A selector's specificity as one number of classes (attributes, pseudo-classes, :root); :where() counts nothing. */
export function selectorSpecificity(selector: string): number {
  const s = selector.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, "");
  return (s.match(/\[/g) ?? []).length + (s.match(/:(?!not\b|is\b|where\b)[a-z-]+/g) ?? []).length + (s.match(/\.[a-z_-]/gi) ?? []).length;
}
import { themeAttributes, type SystemDefinition, type ThemeDefinition } from "../definition.ts";
import type { Library } from "../library.ts";

const MODE = "theme";
export const themeScope = (theme: ThemeDefinition, root: boolean) => root ? ":root" : `[data-area-system-theme="${theme.id}"]`;

/** What a theme's pass does with one selector of Area's axes sheet. */
function axisSelector(attrs: Record<string, string>, scope: string, root: boolean, unknown: Set<string>) {
  return (selector: string): string | null => {
    let m = /^\[data-area-([a-z0-9-]+)(~?=)"([^"]*)"\]$/.exec(selector);
    if (m) {
      const [, axis, op, value] = m as unknown as [string, string, string, string];
      if (axis === MODE) return root ? selector : null;
      const set = attrs[axis];
      if (set === undefined) return null;
      const holds = op === "~=" ? set.split(/\s+/).includes(value) : set === value;
      return holds ? scope : null;
    }
    m = /^\[data-area-([a-z0-9-]+)\]$/.exec(selector);
    if (m) {
      const axis = m[1]!;
      if (axis === MODE) return root ? selector : scope;
      return axis in attrs ? scope : null;
    }
    m = /^:root:not\(\[data-area-([a-z0-9-]+)\]\)$/.exec(selector);
    if (m) return root && !(m[1]! in attrs) ? selector : null;
    if (selector === ":root" || selector === ":where(:root)") return root ? selector : null;
    unknown.add(selector);
    return root ? selector : null;
  };
}

/** A theme's rules from Area's axes sheet, plus its exact colours and accent, on its scope. */
export function themeSheet(lib: Library, theme: ThemeDefinition, root: boolean): { css: string; unknown: string[] } {
  const attrs = themeAttributes(theme, lib.tokens.defaultMaterial);
  const scope = themeScope(theme, root);
  const unknown = new Set<string>();
  let nodes = rewriteSelectors(parse(lib.tokens.axes), axisSelector(attrs, scope, root, unknown));
  if (root) nodes = withoutRestatements(nodes, lib.tokens.defaults);
  let css = print(stripHeader(nodes)).trim();
  // Exact page colours and the exact accent: each engine's one rule, after the axes' own (as the app puts them).
  if (theme.colours.light || theme.colours.dark) {
    const page = { ...(theme.colours.light ? { light: theme.colours.light } : {}), ...(theme.colours.dark ? { dark: theme.colours.dark } : {}) };
    css += `\n\n/* Exact page colours */\n${lib.engines.colours.colourCss({ page }, { selector: scope }).trim()}`;
  }
  if (theme.accent.on) {
    const brand = { primary: theme.accent.primary, ...(theme.accent.secondary ? { secondary: theme.accent.secondary } : {}), ...(theme.accent.tertiary ? { tertiary: theme.accent.tertiary } : {}) };
    css += `\n\n/* Exact accent */\n${lib.engines.brand.brandCss(brand, { statusColours: theme.accent.status === "own" ? "fixed" : "harmonised", selector: scope }).trim()}`;
  }
  return { css, unknown: [...unknown].sort() };
}

/**
 * At :root, a restatement says again what Area's defaults sheet already declares there: a derivation, written where an
 * attribute is set so a subtree works it out again. At the root it is the same declaration in a later layer, so it is
 * dropped when it is word for word the default's and no other rule of the theme sets that property (then the default
 * is what wins, with the same value). What a restatement overrides, it keeps.
 */
function withoutRestatements(nodes: Node[], defaultsCss: string): Node[] {
  const defaults = new Map<string, string>();
  const collect = (list: Node[]) => { for (const n of list) { if (n.kind === "group") collect(n.children); else if (n.kind === "rule" && n.prelude.trim() === ":where(:root)") for (const d of declarations(n.body)) defaults.set(d.property, d.value); } };
  collect(parse(defaultsCss));
  // Every other declaration of the theme's sheet that could win at :root, in order, with its rule's specificity (the
  // least of its selectors', which keeps more than it needs to, never less). One with the default's own value never
  // changes what wins, so only the others count.
  const restating = (n: Node) => n.kind === "rule" && n.prelude.trim() === ":root";
  const order = new Map<Node, number>();
  const rivals = new Map<string, Array<{ at: number; specificity: number }>>();
  let at = 0;
  const walk = (list: Node[]) => {
    for (const n of list) {
      if (n.kind === "group") { walk(n.children); continue; }
      if (n.kind !== "rule") continue;
      order.set(n, at);
      const specificity = Math.min(...splitSelectors(n.prelude).map(selectorSpecificity));
      for (const d of declarations(n.body)) {
        if (defaults.get(d.property) === d.value) continue;
        const list = rivals.get(d.property) ?? [];
        list.push({ at, specificity });
        rivals.set(d.property, list);
      }
      at++;
    }
  };
  walk(nodes);
  // A restatement (specificity 1) can go when no rival it would beat sets the property: each rival is more specific, or
  // as specific and later.
  const needed = (property: string, mine: number) => (rivals.get(property) ?? []).some(r => r.at !== mine && (r.specificity < 1 || (r.specificity === 1 && r.at < mine)));
  const prune = (list: Node[]): Node[] => list.flatMap((n): Node[] => {
    if (n.kind === "group") {
      const children = prune(n.children);
      return children.some(c => c.kind !== "tail") ? [{ ...n, children }] : [];
    }
    if (!restating(n) || n.kind !== "rule") return [n];
    const mine = order.get(n)!;
    const kept = declarations(n.body).filter(d => defaults.get(d.property) !== d.value || needed(d.property, mine));
    if (!kept.length) return [];
    const indent = /\n([ \t]*)--/.exec(n.body)?.[1] ?? "    ";
    const close = /\n([ \t]*)$/.exec(n.body)?.[0] ?? "\n  ";
    return [{ ...n, body: `\n${kept.map(d => `${indent}${d.text};`).join("\n")}${close}` }];
  });
  return prune(nodes);
}

/** The sheet without Area's own header comment (the generated file has its own). */
function stripHeader(nodes: Node[]): Node[] {
  const [first, ...rest] = nodes;
  if (first && first.kind !== "tail" && first.lead.trimStart().startsWith("/*")) return [{ ...first, lead: "" } as Node, ...rest];
  return nodes;
}

export interface Selection {
  /** Component slugs the system holds (chosen and needed by them). */
  blocks: Set<string>;
  /** Every block Area's library knows. */
  known: Set<string>;
  /** Left-out modifiers per slug ("button" → {"discovery"}). */
  without: Map<string, Set<string>>;
}

const CLASS = /\.area-([a-z0-9]+(?:-[a-z0-9]+)*)(?:(--|__)([a-z0-9-]+))?/g;

/** Whether a component sheet's selector stays: every component class it names is held, with no left-out option. */
export function componentSelectorKept(selector: string, selection: Selection): boolean {
  for (const m of selector.matchAll(CLASS)) {
    const [, block, sep, rest] = m as unknown as [string, string, string | undefined, string | undefined];
    if (!selection.known.has(block)) continue;
    if (!selection.blocks.has(block)) return false;
    if (sep === "--" && selection.without.get(block)?.has(rest!)) return false;
  }
  return true;
}

/** A component sheet with what the system leaves out removed, or null when nothing is left. */
export function componentSheet(css: string, selection: Selection, context?: (selector: string) => string | string[]): string | null {
  const nodes = rewriteSelectors(parse(css), selector => !componentSelectorKept(selector, selection) ? null : context ? context(selector) : selector);
  return isEmpty(nodes) ? null : print(nodes);
}

/** A base sheet with its settings in context (contextSelector). */
export function contextSheet(css: string, context: (selector: string) => string | string[]): string {
  return print(rewriteSelectors(parse(css), context));
}

/** The settings Area paints through attributes: every attribute its axes sheet selects on, and the Material's. */
export function axisNames(lib: Library): Set<string> {
  const names = new Set<string>(["material", "colours", "brand"]);
  for (const m of lib.tokens.axes.matchAll(/\[data-area-([a-z0-9-]+)[~\]=]/g)) names.add(m[1]!);
  names.delete(MODE);
  return names;
}

export interface ThemeScope { attrs: Record<string, string>; scope: string }

const LEADING = /^(:where\()?\[data-area-([a-z0-9-]+)(?:(~?=)"([^"]*)")?\](\))?(?=$|[\s>+~])/;

/**
 * A base or component sheet's settings in context (`[data-area-material] .area-button`, `[data-area-shadow-hover="0"]
 * .area-card:hover`): a selector that starts with a setting's attribute is rebound to each theme scope whose theme
 * holds it (`:root .area-button`), as the axes sheet's own rules are, and dropped where none does. An attribute that
 * isn't a setting (data-area-ground, data-area-glyph), the mode, and a setting met later in a selector stay as written;
 * `later` collects the last kind.
 */
export function contextSelector(scopes: ThemeScope[], axes: Set<string>, later: Set<string>) {
  return (selector: string): string | string[] => {
    const m = LEADING.exec(selector);
    const lead = m && axes.has(m[2]!) && (!m[1] || m[5]) ? m : null;
    if (!lead) {
      // A valued attribute later on is a choice the selector still waits for; a bare one only restates, where nothing
      // carries it now.
      for (const n of selector.matchAll(/\[data-area-([a-z0-9-]+)~?=/g)) if (axes.has(n[1]!)) later.add(selector);
      return selector;
    }
    const [whole, where, axis, op, value] = lead as unknown as [string, string | undefined, string, string | undefined, string | undefined];
    const rest = selector.slice(whole.length);
    return scopes.flatMap(({ attrs, scope }) => {
      const set = attrs[axis!];
      if (set === undefined) return [];
      if (op && !(op === "~=" ? set.split(/\s+/).includes(value!) : set === value)) return [];
      return [`${where ? `:where(${scope})` : scope}${rest}`];
    });
  };
}

/** A base sheet's selectors that also restate on a theme scope: each `[data-area-X]` list gains the scopes (non-root themes only). */
export function scopedBase(css: string, scopes: string[]): string {
  if (!scopes.length) return css;
  const nodes = parse(css);
  const walk = (list: Node[]): Node[] => list.map(node => {
    if (node.kind === "group") return { ...node, children: walk(node.children) };
    if (node.kind !== "rule" || !/\[data-area-[a-z0-9-]+\](?=\s*[,)]|\s*$)/.test(node.prelude)) return node;
    // Inside :where( … ) lists and plain lists alike: the scopes join the first presence selector.
    return { ...node, prelude: node.prelude.replace(/\[data-area-([a-z0-9-]+)\](?=\s*[,)]|\s*$)/, match => `${match}, ${scopes.join(", ")}`) };
  });
  return print(walk(nodes));
}

export const HEADER = (def: SystemDefinition, lib: Library, what: string) =>
  `/* ${def.system.name} ${def.release.version}: ${what}.\n * Written by Area from library ${lib.version}. Edit freely: Area merges your edits when it writes the system again. */\n`;
