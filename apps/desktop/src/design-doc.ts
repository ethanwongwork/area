/**
 * A layer's design as a document (direct editing, 2026-11-08; docs/research/design-editing-2026-11-08/README.md): a
 * serializable tree the stage draws and every edit changes, so a design can be inserted into, rearranged, resized and
 * drawn on, and still be Area code underneath. A screen layer becomes one on its first edit (src/design-capture.ts reads
 * the drawn screen into it, its components with their props); until then it is the system's screen, drawn from its code.
 *
 *   element    a tag with its classes, attributes and inline style, and children: a frame (a flex or grid box), a
 *              component's own markup as captured, an icon's svg (its inner markup kept whole, `inner`)
 *   component  one of the system's components by its React name ("Button"), with its props and words, drawn by that
 *              component (src/design-render.tsx), so its markup is always the component's own
 *   text       words, a text node in its element
 *   shape      a rectangle or an ellipse, placed in its frame (absolute) and painted with the system's roles
 *
 * Every node has an id that stays with it through every edit (`n<number>`), which the change log, the selection and
 * Chat name it by; a path of child indices (today's `DesignChange.path`) is derived from the tree when it is needed.
 *
 * An edit is an operation (`DocOp`): patch a node's own fields, insert, remove or move one. Applying one returns the
 * document after it and the operation that undoes it, so the log can undo any change and the stage's ⌘Z can step back.
 * Pure: tests/design-doc.test.ts imports it.
 */

/** CSS properties, kebab-case, to values: `{ gap: "var(--area-space-12)" }`. */
export type Style = Record<string, string>;
/** A component's prop value: a word, a number, a flag, or one of the system's icons by its export name. */
export type PropValue = string | number | boolean | { icon: string };
export type Props = Record<string, PropValue>;

export interface ElementNode { id: string; kind: "element"; tag: string; className?: string; attrs?: Record<string, string>; style?: Style; children: DocNode[]; inner?: string; name?: string }
export interface TextNode { id: string; kind: "text"; text: string }
export interface ComponentNode { id: string; kind: "component"; component: string; props: Props; text?: string; style?: Style; name?: string }
export interface ShapeNode { id: string; kind: "shape"; shape: "rectangle" | "ellipse"; style: Style; name?: string }
export type DocNode = ElementNode | TextNode | ComponentNode | ShapeNode;

export const DOC_VERSION = 1;
export interface DesignDoc {
  version: typeof DOC_VERSION;
  /** The design's top nodes (what the screen drew inside its specimen). */
  root: DocNode[];
  /** The next id's number. */
  next: number;
}

/** The fields a patch may set on a node (its own, never its children). */
export interface Patch { className?: string; text?: string; style?: Style; props?: Props; name?: string; attrs?: Record<string, string> }

export type DocOp =
  | { op: "patch"; node: string; patch: Patch }
  | { op: "insert"; parent: string | null; index: number; node: DocNode }
  | { op: "remove"; node: string }
  | { op: "move"; node: string; parent: string | null; index: number }
  | { op: "batch"; ops: DocOp[] };

/* --- Reading ----------------------------------------------------------------------------------------------------------- */

export const hasChildren = (node: DocNode): node is ElementNode => node.kind === "element";
/** Whether a node draws an element (a text node draws words in its parent). */
export const drawsElement = (node: DocNode) => node.kind !== "text";

export interface Found { node: DocNode; parent: ElementNode | null; index: number; siblings: DocNode[] }

/** A node by id, with where it sits. */
export function find(doc: DesignDoc, id: string): Found | null {
  const visit = (list: DocNode[], parent: ElementNode | null): Found | null => {
    for (let index = 0; index < list.length; index++) {
      const node = list[index]!;
      if (node.id === id) return { node, parent, index, siblings: list };
      if (hasChildren(node)) { const hit = visit(node.children, node); if (hit) return hit; }
    }
    return null;
  };
  return visit(doc.root, null);
}

/** Every node, depth first. */
export function* walk(list: readonly DocNode[]): Generator<DocNode> {
  for (const node of list) { yield node; if (hasChildren(node)) yield* walk(node.children); }
}

/** Whether `id` is `ancestor` or inside it. */
export function within(doc: DesignDoc, id: string, ancestor: string): boolean {
  const top = find(doc, ancestor);
  if (!top) return false;
  for (const node of walk([top.node])) if (node.id === id) return true;
  return false;
}

/**
 * A node's path as the stage's DOM has it: child indices from the viewer's content box (its first step the specimen the
 * screen is drawn in), counting only nodes that draw an element. The same path today's `DesignChange` keeps.
 */
export function pathOf(doc: DesignDoc, id: string): number[] | null {
  const visit = (list: DocNode[], trail: number[]): number[] | null => {
    let at = 0;
    for (const node of list) {
      if (!drawsElement(node)) continue;
      const here = [...trail, at++];
      if (node.id === id) return here;
      if (hasChildren(node)) { const hit = visit(node.children, here); if (hit) return hit; }
    }
    return null;
  };
  return visit(doc.root, [0]);
}

/** The node at a DOM path (see `pathOf`), or null. */
export function atPath(doc: DesignDoc, path: readonly number[]): DocNode | null {
  if (path[0] !== 0) return null;
  let list: DocNode[] = doc.root;
  let node: DocNode | null = null;
  for (const step of path.slice(1)) {
    node = list.filter(drawsElement)[step] ?? null;
    if (!node) return null;
    list = hasChildren(node) ? node.children : [];
  }
  return node;
}

/* --- Ids ------------------------------------------------------------------------------------------------------------- */

/** A copy of `node` and everything in it with fresh ids, and the doc's next number after them. */
export function reid(node: DocNode, next: number): { node: DocNode; next: number } {
  let n = next;
  const copy = (entry: DocNode): DocNode => {
    const id = `n${n++}`;
    return hasChildren(entry) ? { ...entry, id, children: entry.children.map(copy) } : { ...entry, id };
  };
  const made = copy(node);
  return { node: made, next: n };
}

/** A new node's id. Returns the id and the doc with its counter moved on. */
export function newId(doc: DesignDoc): { id: string; doc: DesignDoc } {
  return { id: `n${doc.next}`, doc: { ...doc, next: doc.next + 1 } };
}

/* --- Applying an operation ------------------------------------------------------------------------------------------ */

/** The list with the node of `id` swapped by `update` (copying only the nodes on its way). */
function mapNode(list: DocNode[], id: string, update: (node: DocNode) => DocNode): DocNode[] {
  let changed = false;
  const out = list.map(node => {
    if (node.id === id) { changed = true; return update(node); }
    if (hasChildren(node)) {
      const children = mapNode(node.children, id, update);
      if (children !== node.children) { changed = true; return { ...node, children }; }
    }
    return node;
  });
  return changed ? out : list;
}

function withChildren(doc: DesignDoc, parent: string | null, update: (children: DocNode[]) => DocNode[]): DesignDoc | null {
  if (parent === null) return { ...doc, root: update(doc.root) };
  const host = find(doc, parent);
  if (!host || !hasChildren(host.node)) return null;
  return { ...doc, root: mapNode(doc.root, parent, node => ({ ...(node as ElementNode), children: update((node as ElementNode).children) })) };
}

/** What a patch's fields were on a node before it (undefined fields cleared). */
function previous(node: DocNode, patch: Patch): Patch {
  const was: Patch = {};
  const own = node as unknown as Record<string, unknown>;
  for (const key of Object.keys(patch) as (keyof Patch)[]) (was as Record<string, unknown>)[key] = own[key] ?? (key === "style" || key === "props" || key === "attrs" ? {} : key === "className" || key === "text" ? "" : undefined);
  return was;
}

/** The document after an operation, and the operation that puts it back; null when it can't apply (its node is gone). */
export function apply(doc: DesignDoc, op: DocOp): { doc: DesignDoc; undo: DocOp } | null {
  switch (op.op) {
    case "patch": {
      const at = find(doc, op.node);
      if (!at) return null;
      const undo: DocOp = { op: "patch", node: op.node, patch: previous(at.node, op.patch) };
      const root = mapNode(doc.root, op.node, node => {
        const next = { ...node, ...op.patch } as Record<string, unknown>;
        // An empty field is no field (a style or class removed entirely).
        for (const [key, value] of Object.entries(op.patch)) {
          if (value === undefined || (typeof value === "string" && value === "" && key !== "text") || (typeof value === "object" && value && !Object.keys(value).length)) delete next[key];
        }
        return next as unknown as DocNode;
      });
      return { doc: { ...doc, root }, undo };
    }
    case "insert": {
      if (find(doc, op.node.id)) return null;
      const next = Math.max(doc.next, ...[...walk([op.node])].map(node => Number(node.id.slice(1)) + 1).filter(Number.isFinite));
      const done = withChildren(doc, op.parent, children => { const list = [...children]; list.splice(Math.max(0, Math.min(op.index, list.length)), 0, op.node); return list; });
      return done ? { doc: { ...done, next }, undo: { op: "remove", node: op.node.id } } : null;
    }
    case "remove": {
      const at = find(doc, op.node);
      if (!at) return null;
      const done = withChildren(doc, at.parent?.id ?? null, children => children.filter(node => node.id !== op.node));
      return done ? { doc: done, undo: { op: "insert", parent: at.parent?.id ?? null, index: at.index, node: at.node } } : null;
    }
    case "move": {
      const at = find(doc, op.node);
      if (!at) return null;
      // Never into itself.
      if (op.parent && within(doc, op.parent, op.node)) return null;
      const from = { parent: at.parent?.id ?? null, index: at.index };
      const removed = withChildren(doc, from.parent, children => children.filter(node => node.id !== op.node));
      const done = removed && withChildren(removed, op.parent, children => { const list = [...children]; list.splice(Math.max(0, Math.min(op.index, list.length)), 0, at.node); return list; });
      return done ? { doc: done, undo: { op: "move", node: op.node, parent: from.parent, index: from.index } } : null;
    }
    case "batch": {
      let current = doc;
      const undos: DocOp[] = [];
      for (const step of op.ops) {
        const done = apply(current, step);
        if (!done) return null;
        current = done.doc;
        undos.unshift(done.undo);
      }
      return { doc: current, undo: { op: "batch", ops: undos } };
    }
  }
}

/** The node an operation is about (a batch's first). */
export function subjectOf(op: DocOp): string | null {
  if (op.op === "batch") { for (const step of op.ops) { const id = subjectOf(step); if (id) return id; } return null; }
  return op.op === "insert" ? op.node.id : op.node;
}

/** A style with some properties set and others (null) removed. */
export function restyle(style: Style | undefined, changes: Record<string, string | null>): Style {
  const next: Style = { ...style };
  for (const [name, value] of Object.entries(changes)) { if (value === null || value === "") delete next[name]; else next[name] = value; }
  return next;
}

/* --- Sizes and padding as styles (the Design view and the stage, src/design-edit.ts) ---------------------------------- */

export type SizeMode = "hug" | "fill" | "fixed";
export type Dimension = "width" | "height";
/**
 * How an element sits on one axis of its parent: along a flex frame's direction (`main`), across it (`cross`), in a
 * block (`block`, which fills only across), or placed (`free`, a drawn shape: its size is its own).
 */
export type SizeAxis = "main" | "cross" | "block" | "free";
/**
 * The styles a size sets on one axis (Hug fits what it holds, Fill takes the room its frame leaves, Fixed is a length
 * the frame doesn't squeeze), clearing what the other two set. Null removes a style the design set.
 */
export function sizeStyles(dimension: Dimension, axis: SizeAxis, mode: SizeMode, length = 0): Record<string, string | null> {
  const min = `min-${dimension}`;
  type Styles = Record<string, string | null>;
  const flow: Styles = axis === "main" ? { flex: null, "flex-basis": null, "flex-grow": "0" } : {};
  const self: Styles = axis === "cross" ? { "align-self": null } : {};
  if (mode === "fixed") return { [dimension]: `${Math.max(1, Math.round(length))}px`, [min]: null, ...flow, ...(axis === "main" ? { "flex-shrink": "0" } : {} as Styles), ...self };
  if (mode === "hug") return { [dimension]: "fit-content", [min]: null, ...flow, ...(axis === "main" ? { "flex-shrink": null } : {} as Styles), ...self, ...(axis === "block" ? { "box-sizing": null } : {} as Styles) };
  if (axis === "main") return { [dimension]: "auto", flex: null, "flex-grow": "1", "flex-shrink": "1", "flex-basis": "0", [min]: "0" };
  if (axis === "cross") return { [dimension]: "auto", [min]: null, "align-self": "stretch" };
  return { [dimension]: "100%", [min]: null, "box-sizing": "border-box" };
}

/** Splits a CSS shorthand's value into its parts, keeping functions whole ("var(--a) 8px" → two parts). */
function partsOf(value: string): string[] {
  const parts: string[] = [];
  let depth = 0, at = "";
  for (const char of value.trim()) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (/\s/.test(char) && depth === 0) { if (at) parts.push(at); at = ""; } else at += char;
  }
  if (at) parts.push(at);
  return parts;
}
const SIDES = ["top", "right", "bottom", "left"] as const;
export type Side = typeof SIDES[number];
/**
 * A style with its padding set per side: a `padding` shorthand becomes its four longhands first (so one side can change
 * without the shorthand and a longhand fighting), then `sides` take `value`.
 */
export function padSides(style: Record<string, string> | undefined, sides: readonly Side[], value: string): Record<string, string | null> {
  const changes: Record<string, string | null> = {};
  const short = style?.padding;
  if (short) {
    const parts = partsOf(short);
    const [t, r = t, b = t, l = r] = parts;
    const each = { top: t, right: r, bottom: b, left: l };
    changes.padding = null;
    for (const side of SIDES) changes[`padding-${side}`] = style?.[`padding-${side}`] ?? each[side] ?? null;
  }
  for (const side of sides) changes[`padding-${side}`] = value;
  return changes;
}

/* --- Reading saved documents ----------------------------------------------------------------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const strings = (value: unknown): Record<string, string> | undefined => {
  if (!isRecord(value)) return undefined;
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) if (typeof entry === "string") out[key] = entry;
  return Object.keys(out).length ? out : undefined;
};

function readNode(saved: unknown, ids: Set<string>): DocNode | null {
  if (!isRecord(saved) || typeof saved.id !== "string" || !/^n\d+$/.test(saved.id) || ids.has(saved.id)) return null;
  const id = saved.id;
  // Its id is taken once it is known to be a node (a dropped one takes none).
  const known = saved.kind === "text" || saved.kind === "shape" || saved.kind === "component" || (saved.kind === "element" && typeof saved.tag === "string" && /^[a-z][a-z0-9-]*$/i.test(saved.tag));
  if (!known) return null;
  ids.add(id);
  const name = typeof saved.name === "string" && saved.name ? { name: saved.name } : {};
  if (saved.kind === "text") return typeof saved.text === "string" ? { id, kind: "text", text: saved.text } : null;
  if (saved.kind === "shape") return saved.shape === "rectangle" || saved.shape === "ellipse" ? { id, kind: "shape", shape: saved.shape, style: strings(saved.style) ?? {}, ...name } : null;
  if (saved.kind === "component") {
    if (typeof saved.component !== "string" || !/^[A-Z][A-Za-z0-9]*$/.test(saved.component)) { ids.delete(id); return null; }
    const props: Props = {};
    for (const [key, value] of Object.entries(isRecord(saved.props) ? saved.props : {})) {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") props[key] = value;
      else if (isRecord(value) && typeof value.icon === "string") props[key] = { icon: value.icon };
    }
    const style = strings(saved.style);
    return { id, kind: "component", component: saved.component, props, ...(typeof saved.text === "string" ? { text: saved.text } : {}), ...(style ? { style } : {}), ...name };
  }
  if (saved.kind === "element") {
    if (typeof saved.tag !== "string" || !/^[a-z][a-z0-9-]*$/i.test(saved.tag)) return null;
    const children: DocNode[] = [];
    for (const entry of Array.isArray(saved.children) ? saved.children : []) { const node = readNode(entry, ids); if (node) children.push(node); }
    const attrs = strings(saved.attrs), style = strings(saved.style);
    return {
      id, kind: "element", tag: saved.tag, children,
      ...(typeof saved.className === "string" && saved.className ? { className: saved.className } : {}),
      ...(attrs ? { attrs } : {}), ...(style ? { style } : {}), ...(typeof saved.inner === "string" ? { inner: saved.inner } : {}), ...name,
    };
  }
  return null;
}

/** A layer's document read from its file, or undefined when it holds none (or not one). */
export function readDoc(saved: unknown): DesignDoc | undefined {
  if (!isRecord(saved) || saved.version !== DOC_VERSION || !Array.isArray(saved.root)) return undefined;
  const ids = new Set<string>();
  const root: DocNode[] = [];
  for (const entry of saved.root) { const node = readNode(entry, ids); if (node) root.push(node); }
  const highest = Math.max(0, ...[...ids].map(id => Number(id.slice(1)) + 1));
  return { version: DOC_VERSION, root, next: Math.max(highest, typeof saved.next === "number" ? saved.next : 0) };
}

/* --- Code ----------------------------------------------------------------------------------------------------------- */

/** HTML attribute names whose JSX spelling differs (the rest of a hyphenated name is camel-cased; aria- and data- stay). */
export const JSX_NAMES: Record<string, string> = {
  class: "className", for: "htmlFor", tabindex: "tabIndex", readonly: "readOnly", maxlength: "maxLength", minlength: "minLength",
  colspan: "colSpan", rowspan: "rowSpan", autocomplete: "autoComplete", autofocus: "autoFocus", contenteditable: "contentEditable",
  spellcheck: "spellCheck", crossorigin: "crossOrigin", srcset: "srcSet", inputmode: "inputMode", enterkeyhint: "enterKeyHint",
  datetime: "dateTime", viewbox: "viewBox", "xlink:href": "xlinkHref", "xml:space": "xmlSpace", popovertarget: "popoverTarget",
};
export const jsxName = (name: string) => JSX_NAMES[name] ?? (/^(aria|data)-/.test(name) || !name.includes("-") ? name : name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()));
/** A CSS property as a React style key: custom properties as they are, the rest camel-cased (`-webkit-` → `Webkit`). */
export const styleKey = (name: string) => name.startsWith("--") ? name : name.replace(/^-(webkit|moz|ms)-/, (_, vendor: string) => `${vendor[0]!.toUpperCase()}${vendor.slice(1)}-`).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

const quote = (value: string) => JSON.stringify(value);
const jsxText = (text: string) => /[{}<>]/.test(text) || text !== text.trim() ? `{${quote(text)}}` : text;
const styleJsx = (style: Style) => `{{ ${Object.entries(style).map(([name, value]) => `${/^[a-zA-Z]+$/.test(styleKey(name)) ? styleKey(name) : quote(styleKey(name))}: ${quote(value)}`).join(", ")} }}`;
const propJsx = (name: string, value: PropValue) => value === true ? name : typeof value === "object" ? `${name}={<${value.icon} />}` : typeof value === "number" ? `${name}={${value}}` : value === false ? `${name}={false}` : `${name}=${quote(value)}`;

export interface CodeOptions {
  /** What to call the screen. */
  name?: string;
}

/**
 * The design as JSX (the Code view): components as themselves with their props, the rest as markup with Area's classes
 * and token values. What the agent writes into a screen's source, and what an import of the design gives back.
 */
export function toJsx(doc: DesignDoc, options: CodeOptions = {}): string {
  const imports = new Set<string>(), icons = new Set<string>();
  const lines: string[] = [];
  const emit = (node: DocNode, depth: number) => {
    const pad = "  ".repeat(depth);
    if (node.kind === "text") { if (node.text.trim()) lines.push(pad + jsxText(node.text)); return; }
    if (node.kind === "shape") {
      lines.push(`${pad}<div data-shape="${node.shape}" style=${styleJsx({ ...node.style, ...(node.shape === "ellipse" ? { "border-radius": "50%" } : {}) })} />`);
      return;
    }
    if (node.kind === "component") {
      const name = node.component;
      imports.add(name);
      for (const value of Object.values(node.props)) if (typeof value === "object") icons.add(value.icon);
      const props = [...Object.entries(node.props).map(([key, value]) => propJsx(key, value)), ...(node.style ? [`style=${styleJsx(node.style)}`] : [])];
      const open = `${pad}<${name}${props.length ? ` ${props.join(" ")}` : ""}`;
      lines.push(node.text ? `${open}>${jsxText(node.text)}</${name}>` : `${open} />`);
      return;
    }
    const attrs = [
      ...(node.className ? [`className=${quote(node.className)}`] : []),
      ...Object.entries(node.attrs ?? {}).map(([name, value]) => value === "" ? jsxName(name) : `${jsxName(name)}=${quote(value)}`),
      ...(node.style && Object.keys(node.style).length ? [`style=${styleJsx(node.style)}`] : []),
    ];
    const open = `${pad}<${node.tag}${attrs.length ? ` ${attrs.join(" ")}` : ""}`;
    if (node.inner !== undefined) {
      // An icon's drawing: its markup with JSX's attribute names.
      const inner = node.inner.replace(/\s([a-z]+(?:[-:][a-z]+)+)=/g, (_, name: string) => ` ${jsxName(name)}=`).replace(/\sclass=/g, " className=");
      lines.push(inner ? `${open}>${inner}</${node.tag}>` : `${open} />`);
      return;
    }
    const kids = node.children.filter(child => child.kind !== "text" || child.text.trim());
    if (!kids.length) { lines.push(`${open} />`); return; }
    if (kids.length === 1 && kids[0]!.kind === "text") { lines.push(`${open}>${jsxText((kids[0] as TextNode).text)}</${node.tag}>`); return; }
    lines.push(`${open}>`);
    for (const child of kids) emit(child, depth + 1);
    lines.push(`${pad}</${node.tag}>`);
  };
  for (const node of doc.root) emit(node, 3);
  const name = (options.name ?? "Design").replace(/[^A-Za-z0-9]+(.)?/g, (_, letter: string | undefined) => letter ? letter.toUpperCase() : "").replace(/^[a-z]/, letter => letter.toUpperCase()) || "Design";
  const head = [
    ...(imports.size ? [`import { ${[...imports].sort().join(", ")} } from "@area/react";`] : []),
    ...(icons.size ? [`import { ${[...icons].sort().join(", ")} } from "@area/icons";`] : []),
  ];
  return [...head, ...(head.length ? [""] : []), `export function ${/^[A-Z]/.test(name) ? name : `Design${name}`}() {`, "  return (", "    <>", ...lines, "    </>", "  );", "}", ""].join("\n");
}
