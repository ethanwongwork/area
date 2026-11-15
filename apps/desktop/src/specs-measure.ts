/**
 * A family's Specs, measured (plan F7, RD5: "Component pages carry no measurements"). The specimen is the family's real
 * component, rendered by its own demo in a scope of settings; everything here is read back from the page:
 *
 *   lengths     getComputedStyle and client rects of the rendered element, at scale 1 (the bench has no zoom)
 *   token names the tokens whose value, resolved in the element's own scope, equals what the element paints or measures
 *               (token-catalog.ts readValues), the family's own stylesheet's tokens first
 *   state paint the document's own CSS rules for a state's selector (:hover, :active, :focus-visible, the manifest's
 *               attribute) that match the element once the state is taken out, and the tokens their declarations read
 *
 * Nothing is written per family. A value that can't be read this way (no icon in the specimen, a colour no token holds,
 * a state no rule paints) is left out, never guessed. Pure helpers (sides, specificity, the state stripper) are exported
 * for tests/specs.test.ts.
 */
import type { Token } from "./token-catalog.ts";

/* --- Pure helpers ------------------------------------------------------------------------------------------------ */

export const round = (value: number) => Math.round(value * 100) / 100;
const px = (value: string) => Number.parseFloat(value) || 0;

/** A side written as border + shell + slot (inset.css): the frame's edge, its padding, then the slot's own inset to the
 * first glyph, so the three add to the distance from the outer edge to the content. */
export interface Side { border: number; shell: number; slot?: number; total: number }
export function side(border: number, shell: number, contentFromEdge?: number): Side {
  if (contentFromEdge === undefined) return { border: round(border), shell: round(shell), total: round(border + shell) };
  return { border: round(border), shell: round(shell), slot: round(contentFromEdge - border - shell), total: round(contentFromEdge) };
}

/** "1 + 10 + 0 = 11 px"; a container's side has no slot (its contents set their own), "1 + 4 = 5 px". */
export const sideText = (value: Side) => value.slot === undefined
  ? `${fmt(value.border)} + ${fmt(value.shell)} = ${fmt(value.total)} px`
  : `${fmt(value.border)} + ${fmt(value.shell)} + ${fmt(value.slot)} = ${fmt(value.total)} px`;

/** A length in CSS px as the tab prints it: whole pixels plain, fractions to two places. */
export const fmt = (value: number) => (Number.isInteger(round(value)) ? String(round(value)) : round(value).toFixed(2).replace(/0$/, ""));

/** A selector's specificity as [ids, classes / attributes / pseudo-classes, elements], enough to order a state's rules. */
export function specificity(selector: string): [number, number, number] {
  let ids = 0, classes = 0, elements = 0;
  // :is(), :not() and :has() count their argument's most specific selector; :where() counts nothing.
  const inner = selector.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, "");
  const args = [...inner.matchAll(/:(?:is|not|has)\(((?:[^()]|\([^()]*\))*)\)/g)].map(match => match[1]!);
  const bare = inner.replace(/:(?:is|not|has)\((?:[^()]|\([^()]*\))*\)/g, "");
  ids += (bare.match(/#[\w-]+/g) ?? []).length;
  classes += (bare.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+(?:\([^)]*\))?/g) ?? []).length;
  elements += (bare.match(/(?:^|[\s>+~(])(?:[a-z][\w-]*)/gi) ?? []).length + (bare.match(/::[\w-]+/g) ?? []).length;
  for (const arg of args) {
    const best = splitTop(arg).map(specificity).sort(compareSpecificity).at(-1);
    if (best) { ids += best[0]; classes += best[1]; elements += best[2]; }
  }
  return [ids, classes, elements];
}
export const compareSpecificity = (a: [number, number, number], b: [number, number, number]) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** A selector list split at its top-level commas. */
export function splitTop(list: string): string[] {
  const out: string[] = [];
  let depth = 0, start = 0;
  for (let index = 0; index < list.length; index++) {
    const char = list[index];
    if (char === "(" || char === "[") depth++;
    else if (char === ")" || char === "]") depth--;
    else if (char === "," && depth === 0) { out.push(list.slice(start, index).trim()); start = index + 1; }
  }
  out.push(list.slice(start).trim());
  return out.filter(Boolean);
}

/**
 * The selector with a state's hooks taken out of its subject (its last compound), or null when the subject carries none
 * of them outside a :not(), :is(), :where() or :has(). `.area-button:hover:not(:disabled)` for hover gives
 * `.area-button:not(:disabled)`; `.area-menu__item:hover .area-menu__icon` gives null (the state is an ancestor's).
 */
export function stripState(selector: string, hooks: readonly string[]): string | null {
  const subjectAt = lastCompoundStart(selector);
  const head = selector.slice(0, subjectAt), subject = selector.slice(subjectAt);
  let depth = 0, out = "", found = false;
  for (let index = 0; index < subject.length;) {
    const char = subject[index]!;
    if (depth === 0) {
      const hook = hooks.find(candidate => subject.startsWith(candidate, index) && !/[\w-]/.test(subject[index + candidate.length] ?? ""));
      if (hook) { found = true; index += hook.length; continue; }
    }
    if (char === "(" || char === "[") depth++;
    else if (char === ")" || char === "]") depth--;
    out += char;
    index++;
  }
  if (!found) return null;
  // A subject left with no simple selector at all (":hover" alone) matches anything: say so with `*`.
  const rest = out.trim() === "" ? "*" : out;
  return `${head}${rest}`;
}

/** Where a selector's last compound starts: after its last top-level combinator. */
function lastCompoundStart(selector: string): number {
  let depth = 0, at = 0;
  for (let index = 0; index < selector.length; index++) {
    const char = selector[index]!;
    if (char === "(" || char === "[") depth++;
    else if (char === ")" || char === "]") depth--;
    else if (depth === 0 && (char === " " || char === ">" || char === "+" || char === "~")) at = index + 1;
  }
  return at;
}

/** The `--area-*` tokens a declared value names directly, in order. */
export const tokensNamed = (value: string) => [...new Set([...value.matchAll(/var\(\s*--area-([\w-]+)/g)].map(match => match[1]!))];
/** Whether a declared value reads a private slot (`--_*`) that has to be resolved in the element's scope. */
export const readsPrivate = (value: string) => /var\(\s*--_/.test(value);

/* --- The states ---------------------------------------------------------------------------------------------- */

export type StateId = "rest" | "hover" | "pressed" | "selected" | "focus" | "disabled";
export const STATES: ReadonlyArray<{ id: StateId; label: string }> = [
  { id: "rest", label: "Rest" }, { id: "hover", label: "Hover" }, { id: "pressed", label: "Pressed" },
  { id: "selected", label: "Selected" }, { id: "focus", label: "Focus" }, { id: "disabled", label: "Disabled" },
];

/** The hooks that put an element in each state: the pseudo-classes, and the manifest's attribute where it names one. */
export function stateHooks(state: Exclude<StateId, "rest">, attributes: Readonly<Record<string, string>> = {}): string[] {
  const own = (name: string) => {
    const attribute = attributes[name];
    if (!attribute) return [`[data-${name}]`, `[data-${name}=""]`, `[data-${name}="true"]`];
    if (attribute.startsWith(":")) return [attribute];
    return [`[${attribute}]`, `[${attribute}="true"]`, `[${attribute}=""]`];
  };
  switch (state) {
    case "hover": return [":hover"];
    case "pressed": return [":active", ...own("pressed")];
    // A field draws its ring while focus is inside it (its <input> holds focus), so its rules read :focus-within.
    case "focus": return [":focus-visible", ":focus-within", ":has(:focus-visible)"];
    case "selected": return [...own("selected"), '[aria-selected="true"]', '[aria-pressed="true"]', '[aria-checked="true"]', '[aria-current="page"]', "[aria-current]"];
    case "disabled": return [":disabled", ...own("disabled"), '[aria-disabled="true"]'];
  }
}

/** The paint a state's rules set, by what it paints. */
export type PaintPart = "fill" | "text" | "edge" | "ring" | "opacity";
export const PAINT_PARTS: ReadonlyArray<{ id: PaintPart; label: string; properties: readonly string[] }> = [
  { id: "fill", label: "Fill", properties: ["background-color", "background"] },
  { id: "text", label: "Text", properties: ["color"] },
  { id: "edge", label: "Edge", properties: ["border-color", "border-top-color", "border", "border-top"] },
  { id: "ring", label: "Ring", properties: ["outline", "outline-color", "box-shadow"] },
  { id: "opacity", label: "Opacity", properties: ["opacity"] },
];

/* --- The DOM ------------------------------------------------------------------------------------------------- */

let flatRules: CSSStyleRule[] | null = null;
let flatCount = -1;
/** Every style rule in the document whose conditions hold (layers, supports and matching media unwrapped), in order. */
function documentRules(): CSSStyleRule[] {
  const count = document.styleSheets.length;
  if (flatRules && flatCount === count) return flatRules;
  const out: CSSStyleRule[] = [];
  const walk = (list: CSSRuleList) => {
    for (const rule of Array.from(list)) {
      if (rule instanceof CSSStyleRule) { if (!rule.selectorText.includes("&")) out.push(rule); }
      else if (rule instanceof CSSMediaRule) { if (matchMedia(rule.conditionText).matches) walk(rule.cssRules); }
      else if (rule instanceof CSSImportRule) { try { if (rule.styleSheet) walk(rule.styleSheet.cssRules); } catch { /* cross-origin */ } }
      else if ("cssRules" in rule && (rule as CSSGroupingRule).cssRules) walk((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(document.styleSheets)) { try { walk(sheet.cssRules); } catch { /* cross-origin */ } }
  flatRules = out;
  flatCount = count;
  return out;
}

const matches = (el: Element, selector: string) => { try { return el.matches(selector); } catch { return false; } };

/** A state's declarations on `el`: for each paint property, the winning declared value (most specific, then last). */
export function stateDeclarations(el: Element, hooks: readonly string[]): Map<string, string> {
  const best = new Map<string, { value: string; spec: [number, number, number]; order: number }>();
  documentRules().forEach((rule, order) => {
    if (!hooks.some(hook => rule.selectorText.includes(hook))) return;
    for (const selector of splitTop(rule.selectorText)) {
      const stripped = stripState(selector, hooks);
      if (!stripped || !matches(el, stripped)) continue;
      const spec = specificity(selector);
      for (const part of PAINT_PARTS) for (const property of part.properties) {
        const value = rule.style.getPropertyValue(property).trim();
        if (!value) continue;
        const held = best.get(property);
        if (!held || compareSpecificity(spec, held.spec) > 0 || (compareSpecificity(spec, held.spec) === 0 && order > held.order)) best.set(property, { value, spec, order });
      }
    }
  });
  return new Map([...best].map(([property, entry]) => [property, entry.value]));
}

/** Whether any rule paints `el` on hover: the element that carries the family's interaction (a Button, a Menu's row). */
export const hasStatePaint = (el: Element, hooks: readonly string[]) => stateDeclarations(el, hooks).size > 0;

/** A colour as #rrggbb or #rrggbbaa: the browser paints it into one pixel and reads it back. */
let pixel: CanvasRenderingContext2D | null = null;
export function hexOf(color: string): string | undefined {
  if (!color || /^(transparent|rgba\(0, 0, 0, 0\))$/.test(color.trim())) return undefined;
  pixel ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
  if (!pixel) return undefined;
  pixel.clearRect(0, 0, 1, 1);
  pixel.fillStyle = "#000";
  pixel.fillStyle = color;
  pixel.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
  if (!a) return undefined;
  const two = (n: number) => n.toString(16).padStart(2, "0");
  return `#${two(r!)}${two(g!)}${two(b!)}${a === 255 ? "" : two(a!)}`;
}

/** A declared colour resolved in `el`'s scope: a probe inside it takes the value as its `color` and reads it back (a
 * value that is not one colour, such as a background with an image, reads as nothing). */
function resolveIn(el: Element, value: string): string {
  const probe = document.createElement("span");
  probe.style.cssText = "position: absolute; visibility: hidden; pointer-events: none; color: transparent";
  probe.style.setProperty("color", value);
  el.append(probe);
  const read = getComputedStyle(probe).color;
  probe.remove();
  return read;
}

/** The tokens a family's sheet reads first, then every role and component token of the same measure. */
export function candidates(all: readonly Token[], read: ReadonlySet<string>, measure: Token["measure"]): Token[] {
  return all.filter(token => token.measure === measure && (read.has(token.name) || token.tier !== "raw"))
    .sort((a, b) => Number(read.has(b.name)) - Number(read.has(a.name)));
}

/** Token names (without the prefix) whose value under `el` equals `value`: the sheet's own first, at most `limit`. */
export class TokenIndex {
  private values: Map<string, string>;
  private list: readonly Token[];
  private read: ReadonlySet<string>;
  /** `readValues` is token-catalog.ts's (passed in, so this module stays importable without the token data). */
  constructor(el: HTMLElement, list: readonly Token[], read: ReadonlySet<string>, readValues: (scope: HTMLElement, list: readonly Token[]) => Map<string, string>) {
    this.list = list;
    this.read = read;
    this.values = readValues(el, list);
  }
  /** `size` breaks a tie for a sized token (radius-control-md over -sm, both 8 at the default) by the specimen's size. */
  find(value: string | undefined, prefix?: RegExp, size?: string, limit = 2): string[] {
    if (!value) return [];
    const hits = this.list.filter(token => this.values.get(token.name) === value && (!prefix || prefix.test(token.name)));
    const own = hits.filter(token => this.read.has(token.name));
    const pool = own.length ? own : hits;
    const sized = size ? pool.filter(token => token.name.endsWith(`-${size}`)) : [];
    return (sized.length ? sized : pool).slice(0, limit).map(token => token.name.replace(/^--area-/, ""));
  }
}

/** Glyph boxes and text line boxes under `root`, in flow, in document order; positioned and hidden parts skipped. */
function contents(root: HTMLElement): Array<{ kind: "icon" | "text" | "field"; rect: DOMRect; el: Element }> {
  const out: Array<{ kind: "icon" | "text" | "field"; rect: DOMRect; el: Element }> = [];
  const walk = (el: Element) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || (el !== root && (cs.position === "absolute" || cs.position === "fixed"))) return;
    if (el.localName === "svg") { const rect = el.getBoundingClientRect(); if (rect.width > 1) out.push({ kind: "icon", rect, el }); return; }
    if (/^(input|textarea|select)$/.test(el.localName)) {
      const rect = el.getBoundingClientRect();
      const inner = new DOMRect(rect.left + px(cs.borderLeftWidth) + px(cs.paddingLeft), rect.top, rect.width - px(cs.borderLeftWidth) - px(cs.paddingLeft) - px(cs.borderRightWidth) - px(cs.paddingRight), rect.height);
      out.push({ kind: "field", rect: inner, el });
      return;
    }
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === 1) walk(child as Element);
      else if (child.nodeType === 3 && child.textContent?.trim()) {
        const range = document.createRange();
        range.selectNodeContents(child);
        const rects = [...range.getClientRects()].filter(rect => rect.width > 0.01);
        if (rects.length) out.push({ kind: "text", rect: rects[0]!, el });
      }
    }
  };
  walk(root);
  return out;
}

export interface BoxReading {
  height: number;
  width: number;
  start?: Side;
  end?: Side;
  /** The first in-flow icon's box, and its distance to the next text. */
  icon?: { width: number; height: number; gap?: number };
  leadsWithIcon: boolean;
  radius: number;
  stroke?: { width: number; style: string; color?: string };
  heightTokens: string[];
  radiusTokens: string[];
  strokeTokens: string[];
  iconTokens: string[];
  gapTokens: string[];
}

/** One element's box: height, the two sides as border + shell + slot, the first icon, corner and stroke. */
export function readBox(el: HTMLElement, tokens: TokenIndex, size?: string): BoxReading {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const found = contents(el);
  const first = found[0], last = found.at(-1);
  const borderStart = px(cs.borderLeftWidth), borderEnd = px(cs.borderRightWidth);
  const icon = found.find(entry => entry.kind === "icon");
  const afterIcon = icon ? found.find(entry => entry.kind !== "icon" && entry.rect.left >= icon.rect.right - 0.5) : undefined;
  const radius = px(cs.borderTopLeftRadius);
  const width = px(cs.borderTopWidth);
  // A stretched element (a row as wide as its list, a full-width field) spreads its content, so the space after it is the
  // layout's, not a slot: a block-level box as wide as its parent's content box.
  const parent = el.parentElement;
  const parentStyle = parent ? getComputedStyle(parent) : undefined;
  const parentContent = parent && parentStyle ? parent.getBoundingClientRect().width - px(parentStyle.paddingLeft) - px(parentStyle.paddingRight) - px(parentStyle.borderLeftWidth) - px(parentStyle.borderRightWidth) : 0;
  const stretched = /^(block|flex|grid|table|list-item|flow-root)$/.test(cs.display) && Math.abs(rect.width - parentContent) < 1;
  const container = stretched || found.some(entry => first && entry.rect.top >= first.rect.bottom + 1);
  const strokeColor = width > 0 && cs.borderTopStyle !== "none" ? hexOf(cs.borderTopColor) : undefined;
  const length = (value: number) => `${round(value)}px`;
  return {
    height: round(rect.height),
    width: round(rect.width),
    // A control holds one line, so its sides run to its first and last glyph; a container (contents on several lines: a
    // Menu, a Dialog) has no slot of its own, so its sides are its edge and padding.
    start: container ? side(borderStart, px(cs.paddingLeft)) : first ? side(borderStart, px(cs.paddingLeft), first.rect.left - rect.left) : undefined,
    end: container ? side(borderEnd, px(cs.paddingRight)) : last ? side(borderEnd, px(cs.paddingRight), rect.right - last.rect.right) : undefined,
    icon: icon ? { width: round(icon.rect.width), height: round(icon.rect.height), gap: afterIcon ? round(afterIcon.rect.left - icon.rect.right) : undefined } : undefined,
    leadsWithIcon: first?.kind === "icon",
    radius: round(radius),
    stroke: width > 0 && cs.borderTopStyle !== "none" ? { width: round(width), style: cs.borderTopStyle, color: strokeColor } : undefined,
    heightTokens: tokens.find(length(rect.height), /^--area-(control-(xs|sm|md|lg|xl)|ui-row|mark-(sm|md|lg))$/, size),
    radiusTokens: radius > 0 ? tokens.find(length(radius), /^--area-radius-/, size) : [],
    strokeTokens: width > 0 ? tokens.find(length(width), /^--area-(stroke|border)-width$/) : [],
    iconTokens: icon ? tokens.find(length(icon.rect.width), /^--area-(icon|mark)-/, size) : [],
    gapTokens: afterIcon && icon ? tokens.find(length(afterIcon.rect.left - icon.rect.right), /^--area-(gap|ui-|space)/, size) : [],
  };
}

export interface TypeReading { part: string; size: number; line: number; weight: string; ink?: string; inkTokens: string[] }

/** Each text part's style: grouped by the nearest part of the family (`block__part`) holding it, else the root. */
export function readType(root: HTMLElement, block: string, tokens: TokenIndex): TypeReading[] {
  const seen = new Map<string, TypeReading>();
  for (const entry of contents(root)) {
    if (entry.kind === "icon") continue;
    let part = "root";
    for (let el: Element | null = entry.el; el && el !== root.parentElement; el = el.parentElement) {
      const own = [...el.classList].find(name => name.startsWith(`${block}__`) && !name.includes("--"));
      if (own) { part = own.slice(block.length + 2); break; }
      if (el === root) break;
    }
    if (seen.has(part)) continue;
    const cs = getComputedStyle(entry.el);
    const ink = hexOf(cs.color);
    seen.set(part, { part, size: round(px(cs.fontSize)), line: round(px(cs.lineHeight)) || round(px(cs.fontSize) * 1.2), weight: cs.fontWeight, ink, inkTokens: tokens.find(ink, /^--area-(fg|input|select|textarea|token|hue|syntax|selection)-/) });
  }
  return [...seen.values()];
}

/** Which tokens can name each paint: a fill is never an ink's, an ink never a fill's. */
const PAINT_TOKENS: Record<PaintPart, RegExp> = {
  fill: /^--area-(bg|action|neutral-solid|selection|scrim|token-bg|input-bg|select-bg|textarea-bg|hue-[\w]+-bg|[a-z]+-(solid|surface))/,
  text: /^--area-(fg|input-text|select-text|textarea-text|token-text|hue-[\w]+-text|syntax)/,
  edge: /^--area-(edge|border|stroke|input-edge|select-edge|textarea-edge|token-edge|composer-edge|[a-z]+-border|hue-[\w]+-border|focus|field-focus)/,
  ring: /^--area-(focus|field-focus|stroke-selected|edge-selected|[a-z]+-indicator|composer-focus)/,
  opacity: /^--area-opacity/,
};

export type StatePaint = Partial<Record<PaintPart, { tokens: string[]; color?: string; value?: string }>>;

/** The tokens each state paints with, read from the document's rules for that state (rest from the computed style). */
export function readStates(el: HTMLElement, attributes: Readonly<Record<string, string>>, tokens: TokenIndex): Partial<Record<StateId, StatePaint>> {
  const out: Partial<Record<StateId, StatePaint>> = {};
  const cs = getComputedStyle(el);
  const rest: StatePaint = {};
  const fill = hexOf(cs.backgroundColor), text = hexOf(cs.color);
  if (fill) rest.fill = { tokens: tokens.find(fill, PAINT_TOKENS.fill), color: fill };
  if (text) rest.text = { tokens: tokens.find(text, PAINT_TOKENS.text), color: text };
  if (px(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") { const edge = hexOf(cs.borderTopColor); if (edge) rest.edge = { tokens: tokens.find(edge, PAINT_TOKENS.edge), color: edge }; }
  out.rest = rest;
  for (const { id } of STATES) {
    if (id === "rest") continue;
    const declared = stateDeclarations(el, stateHooks(id, attributes));
    if (!declared.size) continue;
    const paint: StatePaint = {};
    for (const part of PAINT_PARTS) {
      const property = part.properties.find(name => declared.has(name));
      if (!property) continue;
      const value = declared.get(property)!;
      const named = tokensNamed(value);
      if (part.id === "opacity" || (part.id === "ring" && property !== "outline-color")) {
        paint[part.id] = { tokens: named, value: named.length ? undefined : value };
        continue;
      }
      if (named.length && !readsPrivate(value)) { paint[part.id] = { tokens: named }; continue; }
      const color = hexOf(resolveIn(el, value));
      if (!color) { if (/transparent/.test(value) || readsPrivate(value)) paint[part.id] = { tokens: [], value: "none" }; continue; }
      paint[part.id] = { tokens: tokens.find(color, PAINT_TOKENS[part.id]), color };
    }
    if (Object.keys(paint).length) out[id] = paint;
  }
  return out;
}
