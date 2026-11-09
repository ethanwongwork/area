/**
 * A drawn screen read into a design document (src/design-doc.ts): the migration from today's screen layers, run on a
 * layer's first edit. It reads what the screen's code drew, so the design looks exactly as it did:
 *
 *   - an element that is one of the system's components, drawn by it with props that can be saved (words, numbers, flags,
 *     icons), becomes that component with those props, so it stays a component: its props edit as props, it is written
 *     back as `<Button variant="soft">`, and its markup is always the component's own;
 *   - anything else is kept as markup: its tag, Area's classes, its attributes and inline style, its words; an svg keeps
 *     its drawing whole.
 *
 * React's own record of what drew an element (the fiber on each node) says which component it was and with which props;
 * nothing is parsed from the source. A component whose props can't be saved (a function child, a list of elements) is
 * kept as markup, and its parts can still be chosen and changed as markup.
 */
import * as AREA from "@area/react";
import * as ICONS from "@area/icons";
import { DOC_VERSION, type DesignDoc, type DocNode, type PropValue, type Props, type Style } from "./design-doc.ts";

type Fiber = { type: unknown; elementType: unknown; memoizedProps: Record<string, unknown>; child: Fiber | null; sibling: Fiber | null; return: Fiber | null; stateNode: unknown; tag: number };

/** The system's components and icons, by what React holds as their type. */
const COMPONENTS = new Map<unknown, string>();
for (const [name, value] of Object.entries(AREA)) if (/^[A-Z]/.test(name) && value && (typeof value === "function" || (typeof value === "object" && "$$typeof" in value))) COMPONENTS.set(value, name);
const ICON_NAMES = new Map<unknown, string>();
for (const [name, value] of Object.entries(ICONS)) if (/Icon$/.test(name) && value) ICON_NAMES.set(value, name);

/** Props that are behaviour or wiring, not design: left out of a captured component. */
const SKIPPED = new Set(["children", "ref", "key", "id", "tabIndex", "aria-describedby", "aria-labelledby", "aria-controls"]);

function fiberOf(element: Element): Fiber | null {
  for (const key of Object.keys(element)) if (key.startsWith("__reactFiber$")) return (element as unknown as Record<string, Fiber>)[key]!;
  return null;
}

/** The first element a fiber draws. */
function hostOf(fiber: Fiber): unknown {
  for (let at: Fiber | null = fiber.child; at; at = at.child) if (at.stateNode instanceof Element) return at.stateNode;
  return null;
}

/** An icon element's name (`<AddIcon />` → "AddIcon"), when it is one with no props of its own. */
function iconOf(value: unknown): string | null {
  if (!value || typeof value !== "object" || !("type" in value)) return null;
  const name = ICON_NAMES.get((value as { type: unknown }).type);
  const props = (value as { props?: Record<string, unknown> }).props ?? {};
  return name && !Object.keys(props).length ? name : null;
}

/** The words of a children prop, when they are only words. */
function wordsOf(children: unknown): string | null | undefined {
  if (children === undefined || children === null || children === false) return undefined;
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children) && children.every(entry => typeof entry === "string" || typeof entry === "number")) return children.join("");
  return null;
}

type Captured = { component: string; props: Props; text?: string; style?: Style };

/** A component fiber's props as a design keeps them, or null when one can't be kept. */
function keep(name: string, fiber: Fiber): Captured | null {
  const props: Props = {};
  let style: Style | undefined;
  for (const [key, value] of Object.entries(fiber.memoizedProps ?? {})) {
    if (SKIPPED.has(key) || value === undefined || value === null || typeof value === "function") continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") { props[key] = value as PropValue; continue; }
    const icon = iconOf(value);
    if (icon) { props[key] = { icon }; continue; }
    if (key === "style" && typeof value === "object") { style = Object.fromEntries(Object.entries(value).map(([k, v]) => [k.startsWith("--") ? k : k.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`), String(v)])); continue; }
    return null;
  }
  const text = wordsOf(fiber.memoizedProps?.children);
  if (text === null) return null;
  return { component: name, props, ...(text !== undefined ? { text } : {}), ...(style ? { style } : {}) };
}

/**
 * The component that drew `element` as its root, with props a design can keep; null when there is none. Of components
 * that share one root (a CopyButton drawing a Button), the outermost that can be kept.
 */
function componentAt(element: Element): Captured | null {
  let best: Captured | null = null;
  for (let at = fiberOf(element)?.return ?? null; at; at = at.return) {
    if (at.stateNode instanceof Element) break; // an element of its own: past this one's components
    const name = COMPONENTS.get(at.elementType) ?? COMPONENTS.get(at.type);
    if (!name) continue;
    if (hostOf(at) !== element) break;
    best = keep(name, at) ?? best;
  }
  return best;
}

function styleOf(element: Element): Style | undefined {
  const declared = (element as HTMLElement).style;
  if (!declared?.length) return undefined;
  const style: Style = {};
  for (let i = 0; i < declared.length; i++) { const name = declared[i]!; style[name] = declared.getPropertyValue(name); }
  return style;
}

/**
 * The document of what is drawn inside a screen's specimen (`specimen` is the element the screen draws into). Ids count
 * from 1 in document order.
 */
export function captureScreen(specimen: Element): DesignDoc {
  let next = 1;
  const read = (node: Node): DocNode | null => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ? { id: `n${next++}`, kind: "text", text: node.nodeValue } : null;
    if (!(node instanceof Element)) return null;
    const id = `n${next++}`;
    const found = componentAt(node);
    if (found) return { id, kind: "component", ...found };
    const attrs: Record<string, string> = {};
    for (const attr of node.attributes) if (attr.name !== "class" && attr.name !== "style" && attr.name !== "data-node") attrs[attr.name] = attr.value;
    // A field's state is its properties, not its attributes (React sets `checked` and `value` as properties): kept as
    // drawn, so a chosen radio or a filled field stays so. A radio group's name made by React for one drawing is left
    // out, or the Light and Dark copies would share one group and only one could stay chosen.
    if (node instanceof HTMLInputElement) {
      if (node.type === "checkbox" || node.type === "radio") { if (node.checked) attrs.checked = ""; else delete attrs.checked; }
      else if (node.value) attrs.value = node.value;
      if (attrs.name && /^(_r_|:r|«r)/.test(attrs.name)) delete attrs.name;
    } else if ((node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) && node.value) attrs.value = node.value;
    const style = styleOf(node);
    const className = node.getAttribute("class") ?? "";
    const tag = node.localName;
    const base = { id, kind: "element" as const, tag, ...(className ? { className } : {}), ...(Object.keys(attrs).length ? { attrs } : {}), ...(style ? { style } : {}) };
    if (tag === "svg") return { ...base, children: [], inner: node.innerHTML };
    const children: DocNode[] = [];
    for (const child of node.childNodes) { const read_ = read(child); if (read_) children.push(read_); }
    return { ...base, children };
  };
  const root: DocNode[] = [];
  for (const child of specimen.childNodes) { const node = read(child); if (node) root.push(node); }
  return { version: DOC_VERSION, root, next };
}
