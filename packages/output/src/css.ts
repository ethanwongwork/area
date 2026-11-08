/**
 * A small CSS walker, enough for Area's own stylesheets: it splits a sheet into rules, grouping blocks (@layer, @media,
 * @supports, @container, @scope, @starting-style) and opaque at-rules (@keyframes, @font-face, @property), keeping every
 * byte it doesn't change. The generator rewrites selector lists and drops rules; everything else round-trips exactly
 * (css.test.ts: parse then print is the identity on every Area sheet).
 *
 * A node's `lead` is the whitespace and comments before it, so a dropped rule takes the comment written for it. A lead
 * that holds a blank line keeps what comes before that line (a section's heading stays with the rules after it).
 */
export type Node =
  | { kind: "rule"; lead: string; prelude: string; body: string }
  | { kind: "group"; lead: string; prelude: string; children: Node[] }
  | { kind: "opaque"; lead: string; text: string }
  | { kind: "tail"; text: string };

const GROUPS = new Set(["layer", "media", "supports", "container", "scope", "starting-style", "document"]);

/** The index just past a comment or string starting at `i`, or `i` when there is neither. */
function skip(css: string, i: number): number {
  if (css[i] === "/" && css[i + 1] === "*") {
    const end = css.indexOf("*/", i + 2);
    return end < 0 ? css.length : end + 2;
  }
  if (css[i] === '"' || css[i] === "'") {
    const quote = css[i];
    let j = i + 1;
    while (j < css.length && css[j] !== quote) j += css[j] === "\\" ? 2 : 1;
    return j + 1;
  }
  return i;
}

/** The index of the `}` that closes the block whose `{` is at `open`. */
function closing(css: string, open: number): number {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const past = skip(css, i);
    if (past !== i) { i = past - 1; continue; }
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return i;
  }
  throw new Error(`Unclosed block at ${open}`);
}

export function parse(css: string): Node[] {
  const nodes: Node[] = [];
  let i = 0;
  while (i < css.length) {
    // The lead: whitespace and comments.
    const start = i;
    while (i < css.length) {
      if (/\s/.test(css[i]!)) { i++; continue; }
      const past = skip(css, i);
      if (past !== i && css[i] === "/") { i = past; continue; }
      break;
    }
    const lead = css.slice(start, i);
    if (i >= css.length) { if (lead) nodes.push({ kind: "tail", text: lead }); break; }
    // The prelude, to `{` or `;`.
    let j = i;
    while (j < css.length && css[j] !== "{" && css[j] !== ";" && css[j] !== "}") {
      const past = skip(css, j);
      j = past !== j ? past : j + 1;
    }
    if (css[j] === ";" || css[j] === "}" || j >= css.length) {
      // A statement (`@layer a, b;`, `@import …;`): kept as it is.
      const end = css[j] === ";" ? j + 1 : j;
      nodes.push({ kind: "opaque", lead, text: css.slice(i, end) });
      i = end;
      if (css[j] === "}") throw new Error(`Unexpected } at ${j}`);
      continue;
    }
    const prelude = css.slice(i, j);
    const close = closing(css, j);
    const name = /^@([a-z-]+)/.exec(prelude)?.[1];
    if (name && GROUPS.has(name)) nodes.push({ kind: "group", lead, prelude, children: parse(css.slice(j + 1, close)) });
    else if (name) nodes.push({ kind: "opaque", lead, text: css.slice(i, close + 1) });
    else nodes.push({ kind: "rule", lead, prelude, body: css.slice(j + 1, close) });
    i = close + 1;
  }
  return nodes;
}

export function print(nodes: readonly Node[]): string {
  let out = "";
  for (const node of nodes) {
    if (node.kind === "tail") out += node.text;
    else if (node.kind === "opaque") out += node.lead + node.text;
    else if (node.kind === "rule") out += `${node.lead}${node.prelude}{${node.body}}`;
    else out += `${node.lead}${node.prelude}{${print(node.children)}}`;
  }
  return out;
}

/** A selector list split at its top-level commas, each part with its own whitespace. */
export function splitSelectors(prelude: string): string[] {
  const parts: string[] = [];
  let depth = 0, from = 0;
  for (let i = 0; i < prelude.length; i++) {
    const past = skip(prelude, i);
    if (past !== i) { i = past - 1; continue; }
    const c = prelude[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) { parts.push(prelude.slice(from, i)); from = i + 1; }
  }
  parts.push(prelude.slice(from));
  return parts;
}

/** What a dropped node's lead leaves behind: anything before its last blank line (a heading for what follows). */
function keptLead(lead: string): string {
  const blank = /\n[ \t]*\n(?![\s\S]*\n[ \t]*\n)/.exec(lead);
  return blank ? lead.slice(0, blank.index + 1) : "";
}

/** A selector's replacements: itself, another, several (one per theme scope), or none (null or []). */
export type SelectorRewrite = (selector: string) => string | string[] | null;

/**
 * Every rule's selector list through `rewrite` (null drops that selector; a rule with none left is dropped, and a group
 * with no rules left). Duplicates a rewrite makes are joined. `keepOpaque` decides on @keyframes, @font-face and the
 * like (kept by default).
 */
export function rewriteSelectors(nodes: readonly Node[], rewrite: SelectorRewrite, keepOpaque: (text: string) => boolean = () => true): Node[] {
  const out: Node[] = [];
  let carry = "";
  const push = (node: Node) => {
    if (carry && node.kind !== "tail") node = { ...node, lead: carry + node.lead } as Node;
    else if (carry && node.kind === "tail") node = { ...node, text: carry + node.text };
    carry = "";
    out.push(node);
  };
  for (const node of nodes) {
    if (node.kind === "tail") { push(node); continue; }
    if (node.kind === "opaque") {
      if (keepOpaque(node.text)) push(node);
      else carry += keptLead(node.lead);
      continue;
    }
    if (node.kind === "group") {
      const children = rewriteSelectors(node.children, rewrite, keepOpaque);
      if (children.some(child => child.kind !== "tail")) push({ ...node, children });
      else carry += keptLead(node.lead);
      continue;
    }
    const parts = splitSelectors(node.prelude);
    const kept: string[] = [];
    const seen = new Set<string>();
    let changed = false;
    for (const part of parts) {
      const trimmed = part.trim();
      const result = rewrite(trimmed);
      const nexts = result === null ? [] : Array.isArray(result) ? result : [result];
      if (nexts.length !== 1 || nexts[0] !== trimmed) changed = true;
      for (const next of nexts) {
        if (seen.has(next)) { changed = true; continue; }
        seen.add(next);
        kept.push(next === trimmed ? part : part.replace(trimmed, next));
      }
    }
    if (!kept.length) { carry += keptLead(node.lead); continue; }
    if (!changed) { push(node); continue; }
    // The first part keeps its leading whitespace, the last its trailing (the space before `{`).
    const trailing = /\s*$/.exec(parts[parts.length - 1]!)![0];
    const joined = kept.map((part, at) => at === kept.length - 1 ? part.replace(/\s*$/, "") + trailing : part).join(",");
    push({ ...node, prelude: kept.length === 1 ? joined.replace(/^\s+/, "") : joined });
  }
  if (carry) out.push({ kind: "tail", text: carry });
  return out;
}

/** A rule body's declarations, each as [property, value] with its source text (comments between them are dropped). */
export function declarations(body: string): Array<{ property: string; value: string; text: string }> {
  const out: Array<{ property: string; value: string; text: string }> = [];
  let depth = 0, from = 0;
  const take = (end: number) => {
    const text = body.slice(from, end).replace(/\/\*[\s\S]*?\*\//g, "");
    const colon = text.indexOf(":");
    if (colon > 0) out.push({ property: text.slice(0, colon).trim(), value: text.slice(colon + 1).trim(), text: text.trim() });
  };
  for (let i = 0; i < body.length; i++) {
    const past = skip(body, i);
    if (past !== i) { i = past - 1; continue; }
    const c = body[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === ";" && depth === 0) { take(i); from = i + 1; }
  }
  take(body.length);
  return out;
}

/** Whether a sheet holds anything but comments, whitespace and empty layer statements. */
export function isEmpty(nodes: readonly Node[]): boolean {
  return nodes.every(node => node.kind === "tail" || (node.kind === "opaque" && /^@layer\s[^{]*;$/.test(node.text)) || (node.kind === "group" && isEmpty(node.children)));
}
