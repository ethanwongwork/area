/**
 * Editing a design on the stage (the design interface's Design view; owner, 2026-11-06: "shouldnt the actual figma style
 * design panel be there? when design changes are made, i want each change to be made and then logged and then sent to the
 * chat all at once"). Area-aware (owner's pick): what can change is a component's own props (its manifest's variants),
 * its words, and its layout, fill, type and corner as the system's tokens; a value off the scale shows as it is, flagged.
 *
 * A layer's screen is code (src/content/examples), so a change is drawn as an override on the drawn screen: a modifier
 * class swapped, a text node's words, an inline style naming a token. The project keeps the changes (projects.ts
 * `DesignChange`); the stage draws them again whenever it draws the screen, and a change undone redraws the screen
 * from its code (the stage keys the screen by its changes). Chat gets them as one message, for the agent to write
 * into the screen's source.
 *
 * An element is named by its path: the child indices from the screen's root (the viewer's content box), the same in the
 * Light and Dark copies of a screen and from one launch to the next while the screen's code is unchanged.
 */
import { MANIFESTS } from "@area/styles/manifest";
import TOKENS from "@area/tokens/tokens.json";
import { colorName, rgbaOf } from "./design-scan.ts";
import { atPath, padSides, restyle, sizeStyles, walk, type DesignDoc, type Dimension, type DocNode, type DocOp, type Side, type SizeAxis, type SizeMode } from "./design-doc.ts";
export { padSides, sizeStyles, type Dimension, type Side, type SizeAxis, type SizeMode };

interface Manifest { block: string; variants: Record<string, readonly string[]>; defaults: Record<string, string> }
/** Every component's root class, to its manifest. */
const BLOCKS = new Map(Object.entries(MANIFESTS as unknown as Record<string, Manifest>).map(([key, manifest]) => [manifest.block, { key, manifest }]));

/** A component's name from its root class ("area-date-picker" → "Date picker"). */
export const blockName = (block: string) => { const words = block.replace(/^area-/, "").replace(/-/g, " "); return words[0]!.toUpperCase() + words.slice(1); };

/** The component an element belongs to: its nearest ancestor (or itself) whose class is a component's root. */
export function componentOf(element: Element, root: Element): { element: Element; block: string; key: string } | null {
  for (let at: Element | null = element; at && at !== root; at = at.parentElement) {
    for (const name of at.classList) { const found = BLOCKS.get(name); if (found) return { element: at, block: name, key: found.key }; }
  }
  return null;
}

const isFrame = (element: Element) => { const display = getComputedStyle(element).display; return display.includes("flex") || display.includes("grid"); };

/** A run of words of its own: an element holding only text (a heading, a paragraph, a label). */
const isWords = (element: Element) => element.childNodes.length > 0 && [...element.childNodes].every(child => child.nodeType === Node.TEXT_NODE) && Boolean(element.textContent?.trim());

/**
 * What a click on an element selects, the deepest thing that is one: its component, a drawn shape, a picture, a run of
 * words of its own, else the layout frame round it (a flex or grid box), else itself. (Direct editing, 2026-11-08: words
 * and shapes became choosable, so they can be moved, resized and edited in place.)
 */
export function targetOf(element: Element, root: Element): Element | null {
  if (!root.contains(element) || element === root) return null;
  const specimen = root.firstElementChild;
  if (element === specimen) return null;
  // The deepest of a component's root, a drawn shape, or a thing added with the tools (design-render.tsx `data-own`).
  for (let at: Element | null = element; at && at !== root && at !== specimen; at = at.parentElement) {
    if (at.hasAttribute("data-shape") || at.hasAttribute("data-own")) return at;
    if ([...at.classList].some(name => BLOCKS.has(name))) return at;
  }
  if (element.localName === "img" || isWords(element)) return element;
  for (let at: Element | null = element; at && at !== root && at !== specimen; at = at.parentElement) if (isFrame(at)) return at;
  return element;
}

/** The selectable element around another, one level out: its parent's component or frame, or null at the screen's top. */
export function parentOf(element: Element, root: Element): Element | null {
  const parent = element.parentElement;
  if (!parent || parent === root || !root.contains(parent)) return null;
  const found = targetOf(parent, root);
  // A screen's own wrapper (the Specimen round it) is not a design element.
  return found && found.parentElement !== root ? found : null;
}

/** An element's path from the screen's root, or null when it is not in it. */
export function pathOf(element: Element, root: Element): number[] | null {
  const path: number[] = [];
  for (let at: Element | null = element; at !== root; at = at.parentElement) {
    if (!at?.parentElement) return null;
    path.unshift([...at.parentElement.children].indexOf(at));
  }
  return path;
}
export function elementAt(root: Element, path: readonly number[]): Element | null {
  let at: Element | null = root;
  for (const index of path) { at = at?.children[index] ?? null; if (!at) return null; }
  return at;
}

/** The first text with words in an element, the node its words change in. */
function firstText(element: Element): Text | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, { acceptNode: node => node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
  return walker.nextNode() as Text | null;
}

/** What the log and the panel call an element: its component ("Button") or "Frame", and its words. */
export function describe(element: Element, root: Element): { target: string; label: string; key?: string } {
  const shape = element.getAttribute("data-shape");
  if (shape) return { target: shape === "ellipse" ? "Ellipse" : "Rectangle", label: "" };
  const component = componentOf(element, root);
  const own = component?.element === element ? component : null;
  const frame = !own && isFrame(element);
  // A frame is named by its own class, which the agent finds it by in the screen's code, else by what it holds; not by
  // all the words in it.
  const own_class = frame ? [...element.classList].find(name => !name.startsWith("area-") && !name.startsWith("studio-")) : undefined;
  const words = frame ? own_class ? `.${own_class}` : `${element.children.length} ${element.children.length === 1 ? "item" : "items"}` : (element.getAttribute("aria-label") ?? (element as HTMLElement).innerText ?? "").replace(/\s+/g, " ").trim();
  return { target: own ? blockName(own.block) : frame ? "Frame" : "Text", label: words.length > 32 ? `${words.slice(0, 31)}…` : words, key: own?.key };
}

/* --- Properties ------------------------------------------------------------------------------------------------------ */

export interface Option { value: string; label: string }
export interface PropertyRow {
  property: string;
  name: string;
  group: "Component" | "Text" | "Layout" | "Fill" | "Type" | "Corner";
  /** A choice of values, or none for words. */
  options?: Option[];
  /** The current value: an option's value, the words, or "" when it is off the scale. */
  current: string;
  /** The current value in words: an option's label, or the raw value with "off scale". */
  currentLabel: string;
  offScale?: boolean;
  /** A size row (Hug, Fill or Fixed with its length), drawn as a choice and a number. */
  size?: { length: number; modes: SizeMode[] };
}

const v = (token: string) => `var(--area-${token})`;
const SPACE = (TOKENS.spaceRamp as number[]).map(step => ({ value: v(`space-${step}`), label: `${step}` }));
const RADIUS = [
  ...(TOKENS.radiusRamp as number[]).map(step => ({ value: v(`radius-${step}`), label: `${step}` })),
  { value: v("radius-control"), label: "Control" }, { value: v("radius-container"), label: "Container" }, { value: v("radius-full"), label: "Full" },
];
const FILLS = ["bg-page", "bg-surface", "bg-subtle", "bg-component", "bg-component-hover", "bg-inverse", "neutral-solid", "accent-surface", "accent-solid",
  "info-surface", "success-surface", "warning-surface", "danger-surface", "danger-solid", "discovery-surface"].map(token => ({ value: v(token), label: token }));
const INKS = ["fg-default", "fg-muted", "fg-placeholder", "fg-disabled", "fg-accent", "fg-on-accent", "fg-on-inverse", "fg-info", "fg-success", "fg-warning", "fg-danger", "fg-discovery"]
  .map(token => ({ value: v(token), label: token }));
const TYPE_ROLES = ["text-xs", "text-sm", "text-base", "text-lg", "title-xs", "title-sm", "title-md", "title-lg"];
const WEIGHTS = [{ value: v("weight-regular"), label: "Regular" }, { value: v("weight-strong"), label: "Strong" }];
const DIRECTIONS = [{ value: "row", label: "Across" }, { value: "column", label: "Down" }];
const NONE = { value: "transparent", label: "None" };

/** A throwaway element in the design's own scope (its theme and settings), to read what a token resolves to there. */
function probeIn(element: Element) {
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;display:block";
  (element.parentElement ?? element).appendChild(probe);
  return { read: (property: string, value: string) => { probe.style.setProperty(property, value); return getComputedStyle(probe).getPropertyValue(property); }, done: () => probe.remove() };
}
const px = (value: string) => Math.round(parseFloat(value) * 10) / 10;
const sameColor = (a: string, b: string) => { const x = rgbaOf(a), y = rgbaOf(b); return Boolean(x && y) && x!.every((channel, i) => Math.abs(channel - y![i]!) <= (i === 3 ? 0.02 : 2)); };

/** Picks the option a computed value matches, else reports it off the scale. */
function match(options: Option[], actual: string, read: (option: Option) => string, same: (a: string, b: string) => boolean, raw: string) {
  const hit = options.find(option => same(read(option), actual));
  return hit ? { current: hit.value, currentLabel: hit.label } : { current: "", currentLabel: `${raw}, off scale`, offScale: true };
}

/**
 * Every property the Design view offers for an element, read from it as drawn. What is offered follows what the element
 * is, so a change stays inside the system: a component its props and words (its padding, fill, type and corner are its
 * props' and the theme's, so overriding them would break it); a frame its layout, fill and corner; text its words, type
 * and ink.
 */
export function propertiesOf(element: Element, root: Element): PropertyRow[] {
  const rows: PropertyRow[] = [];
  const style = getComputedStyle(element);
  const component = componentOf(element, root);
  const own = component?.element === element ? component : null;
  if (own) {
    const { manifest } = BLOCKS.get(own.block)!;
    for (const [axis, values] of Object.entries(manifest.variants)) {
      const set = values.find(value => element.classList.contains(`${own.block}--${value}`)) ?? manifest.defaults[axis] ?? "";
      // A size keeps its code spelling ("sm", "md"); other values read as words ("Soft", "Full width").
      const label = (value: string) => !value ? "Default" : /^\d?x?(s|sm|md|lg|l)$/.test(value) ? value : value[0]!.toUpperCase() + value.slice(1).replace(/-/g, " ");
      rows.push({ property: `prop:${axis}`, name: label(axis), group: "Component", options: [...(manifest.defaults[axis] ? [] : [{ value: "", label: "Default" }]), ...values.map(value => ({ value, label: label(value) }))], current: set, currentLabel: label(set) });
    }
  }
  // Words are a component's or a text's own; a frame's are its children's, chosen there.
  const frame = !own && isFrame(element);
  const words = frame ? undefined : firstText(element)?.nodeValue?.trim();
  if (words) rows.push({ property: "text", name: "Words", group: "Text", current: words, currentLabel: words });
  rows.push(...sizeRows(element, root));
  if (own) return rows;

  const probe = probeIn(element);
  try {
    const length = (property: string, cssProperty: string, options: Option[], name: string, group: PropertyRow["group"]) => {
      const actual = style.getPropertyValue(cssProperty);
      rows.push({ property: `style:${property}`, name, group, options, ...match(options, actual, option => probe.read(cssProperty, option.value), (a, b) => Math.abs(px(a) - px(b)) < 0.5, `${px(actual)}px`) });
    };
    if (frame) {
      if (style.display.includes("flex")) {
        const direction = style.flexDirection.startsWith("column") ? "column" : "row";
        rows.push({ property: "style:flex-direction", name: "Direction", group: "Layout", options: DIRECTIONS, current: direction, currentLabel: DIRECTIONS.find(entry => entry.value === direction)!.label });
      }
      length("gap", "row-gap", SPACE, "Gap", "Layout");
    }
    if (frame) {
      const sides = [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft];
      if (sides.every(side => side === sides[0])) length("padding", "padding-top", SPACE, "Padding", "Layout");
      else rows.push({ property: "style:padding", name: "Padding", group: "Layout", options: SPACE, current: "", currentLabel: `${sides.map(px).join(" ")}, mixed`, offScale: true });
      const fill = style.backgroundColor;
      rows.push({ property: "style:background-color", name: "Fill", group: "Fill", options: [NONE, ...FILLS],
        ...(rgbaOf(fill)?.[3] === 0 ? { current: NONE.value, currentLabel: NONE.label } : match(FILLS, fill, option => probe.read("background-color", option.value), sameColor, colorName(rgbaOf(fill)!))) });
    }
    if (words && !frame) {
      rows.push({ property: "style:color", name: "Ink", group: "Fill", options: INKS, ...match(INKS, style.color, option => probe.read("color", option.value), sameColor, colorName(rgbaOf(style.color)!)) });
      const roles = TYPE_ROLES.map(role => ({ value: role, label: role }));
      const type = roles.find(role => px(probe.read("font-size", v(`${role.value}-size`))) === px(style.fontSize) && px(probe.read("line-height", v(`${role.value}-leading`))) === px(style.lineHeight));
      rows.push({ property: "type", name: "Style", group: "Type", options: roles, ...(type ? { current: type.value, currentLabel: type.label } : { current: "", currentLabel: `${px(style.fontSize)}/${px(style.lineHeight)}, off scale`, offScale: true }) });
      rows.push({ property: "style:font-weight", name: "Weight", group: "Type", options: WEIGHTS, ...match(WEIGHTS, style.fontWeight, option => probe.read("font-weight", option.value), (a, b) => Number(a) === Number(b), style.fontWeight) });
    }
    if (frame) length("border-radius", "border-top-left-radius", RADIUS, "Corner", "Corner");
  } finally {
    probe.done();
  }
  return rows;
}

/* --- Size: Hug, Fill and Fixed --------------------------------------------------------------------------------------- */

const SIZE_WORDS: Record<SizeMode, string> = { hug: "Hug", fill: "Fill", fixed: "Fixed" };

/** The axis an element's size is on, from its parent's layout. Null for a grid's cell (the grid sizes it). */
export function sizeAxisOf(element: Element, dimension: Dimension): SizeAxis | null {
  if (!inFlow(element)) return "free";
  const parent = element.parentElement;
  if (!parent) return null;
  const display = getComputedStyle(parent).display;
  if (display.includes("grid")) return null;
  if (display.includes("flex")) {
    const across = getComputedStyle(parent).flexDirection.startsWith("row");
    return (dimension === "width") === across ? "main" : "cross";
  }
  return "block";
}

/** The modes an axis offers: a placed thing is Fixed, and a block's height can't Fill. */
export const modesOf = (axis: SizeAxis, dimension: Dimension): SizeMode[] =>
  axis === "free" ? ["fixed"] : axis === "block" && dimension === "height" ? ["hug", "fixed"] : ["hug", "fill", "fixed"];

/** An element's size on one axis as drawn: its mode and its length in the design's pixels. */
export function sizeOf(element: Element, dimension: Dimension): { mode: SizeMode; length: number; axis: SizeAxis } | null {
  const axis = sizeAxisOf(element, dimension);
  if (!axis || !(element instanceof HTMLElement)) return null;
  const length = dimension === "width" ? element.offsetWidth : element.offsetHeight;
  if (axis === "free") return { mode: "fixed", length, axis };
  if (/px$/.test(element.style.getPropertyValue(dimension))) return { mode: "fixed", length, axis };
  const style = getComputedStyle(element);
  if (axis === "main") return { mode: parseFloat(style.flexGrow) > 0 ? "fill" : "hug", length, axis };
  if (axis === "block" && dimension === "height") return { mode: "hug", length, axis };
  // Across a flex frame or in a block, whether it takes the room or only what it needs: let it go for a moment (not
  // stretched, as wide as it needs) and see whether it gets smaller. Its own length (a control's height) doesn't
  // stretch, though its frame may be exactly as deep. Put back before anything is drawn.
  const was = element.getAttribute("style");
  element.style.setProperty(axis === "cross" ? "align-self" : dimension, axis === "cross" ? "flex-start" : "fit-content");
  const free = dimension === "width" ? element.offsetWidth : element.offsetHeight;
  if (was === null) element.removeAttribute("style"); else element.setAttribute("style", was);
  return { mode: free < length - 0.5 ? "fill" : "hug", length, axis };
}

/** The Width and Height rows for an element laid out in a frame (none for the screen's own top, or in a grid). */
function sizeRows(element: Element, root: Element): PropertyRow[] {
  if (element.parentElement === root.firstElementChild) return [];
  const rows: PropertyRow[] = [];
  for (const dimension of ["width", "height"] as const) {
    const size = sizeOf(element, dimension);
    if (!size) continue;
    const modes = modesOf(size.axis, dimension);
    rows.push({ property: `size:${dimension}:${size.axis}`, name: dimension === "width" ? "Width" : "Height", group: "Layout",
      options: modes.map(mode => ({ value: mode, label: SIZE_WORDS[mode] })), current: size.mode,
      currentLabel: size.mode === "fixed" ? `${size.length}` : SIZE_WORDS[size.mode], size: { length: size.length, modes } });
  }
  return rows;
}

/** A size change's value: "hug", "fill" or "fixed:120". */
export function readSize(property: string, value: string) {
  const [, dimension, axis] = property.split(":") as [string, Dimension, SizeAxis];
  const [mode, length] = value.split(":") as [SizeMode, string | undefined];
  return { dimension, axis, mode, length: Number(length) || 0 };
}

/* --- Spacing: the system's steps -------------------------------------------------------------------------------------- */

/** The space ramp's steps, smallest first (0 included): padding and gap drawn on the stage snap to them. */
export const SPACE_STEPS = [...new Set([0, ...(TOKENS.spaceRamp as number[])])].sort((a, b) => a - b);
/** The step nearest a length. */
export const nearestStep = (length: number) => SPACE_STEPS.reduce((best, step) => Math.abs(step - length) < Math.abs(best - length) ? step : best, SPACE_STEPS[0]!);
export const spaceToken = (step: number) => v(`space-${step}`);

/* --- Drawing a change ------------------------------------------------------------------------------------------------- */

export interface Applied { path: readonly number[]; property: string; value: string }

/** Draws a change on one copy of the screen; false when its element is gone (the screen's code changed). */
export function applyChange(root: Element, change: Applied): boolean {
  const element = elementAt(root, change.path) as HTMLElement | null;
  if (!element) return false;
  if (change.property.startsWith("prop:")) {
    const component = componentOf(element, root);
    if (!component || component.element !== element) return false;
    const axis = change.property.slice(5);
    const values = BLOCKS.get(component.block)!.manifest.variants[axis] ?? [];
    for (const value of values) element.classList.remove(`${component.block}--${value}`);
    if (change.value) element.classList.add(`${component.block}--${change.value}`);
  } else if (change.property === "text") {
    const node = firstText(element);
    if (node) node.nodeValue = change.value;
  } else if (change.property === "type") {
    for (const part of ["size", "leading", "tracking"] as const) element.style.setProperty(part === "size" ? "font-size" : part === "leading" ? "line-height" : "letter-spacing", v(`${change.value}-${part}`));
  } else if (change.property.startsWith("size:")) {
    const { dimension, axis, mode, length } = readSize(change.property, change.value);
    for (const [name, value] of Object.entries(sizeStyles(dimension, axis, mode, length))) {
      if (value === null) element.style.removeProperty(name); else element.style.setProperty(name, value);
    }
  } else if (change.property.startsWith("style:")) {
    element.style.setProperty(change.property.slice(6), change.value);
  }
  return true;
}

/** Every copy of the screen on the stage (Light and Dark side by side are two). */
export const screensIn = (host: Element) => [...host.querySelectorAll(".studio-viewer__content")];

/* --- The same changes on a layer's own design (src/design-doc.ts) ----------------------------------------------------- */

/** A React prop's name for a manifest axis or flag ("full-width" → "fullWidth"). */
const propName = (axis: string) => axis.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/**
 * The operation a property change makes on a design's node, the same vocabulary the overrides use: a component's prop,
 * its words, its type role, or a style naming a token. Null when the node can't take it.
 */
export function patchFor(doc: DesignDoc, node: DocNode, property: string, value: string): DocOp | null {
  if (property.startsWith("prop:")) {
    const axis = property.slice(5);
    if (node.kind === "component") {
      const props = { ...node.props };
      if (value) props[propName(axis)] = value; else delete props[propName(axis)];
      return { op: "patch", node: node.id, patch: { props } };
    }
    if (node.kind === "element") {
      const classes = (node.className ?? "").split(/\s+/).filter(Boolean);
      const block = classes.find(name => BLOCKS.has(name));
      if (!block) return null;
      const values = BLOCKS.get(block)!.manifest.variants[axis] ?? [];
      const next = classes.filter(name => !values.some(entry => name === `${block}--${entry}`));
      if (value) next.push(`${block}--${value}`);
      return { op: "patch", node: node.id, patch: { className: next.join(" ") } };
    }
    return null;
  }
  if (property === "text") {
    if (node.kind === "component") return { op: "patch", node: node.id, patch: { text: value } };
    if (node.kind === "text") return { op: "patch", node: node.id, patch: { text: value } };
    for (const entry of walk([node])) if (entry.kind === "text" && entry.text.trim()) return { op: "patch", node: entry.id, patch: { text: value } };
    for (const entry of walk([node])) if (entry.kind === "component" && entry.text !== undefined) return { op: "patch", node: entry.id, patch: { text: value } };
    return null;
  }
  if (node.kind === "text") return null;
  const styled = (changes: Record<string, string | null>) => ({ op: "patch" as const, node: node.id, patch: { style: restyle(node.style, changes) } });
  if (property.startsWith("size:")) {
    const { dimension, axis, mode, length } = readSize(property, value);
    return styled(sizeStyles(dimension, axis, mode, length));
  }
  if (property === "type") return styled({ "font-size": v(`${value}-size`), "line-height": v(`${value}-leading`), "letter-spacing": v(`${value}-tracking`) });
  if (property.startsWith("style:")) {
    const name = property.slice(6);
    // A padding token sets every side (the longhands a captured style holds go with it).
    if (name === "padding") return styled({ padding: value, "padding-top": null, "padding-right": null, "padding-bottom": null, "padding-left": null });
    if (name === "border-radius") return styled({ "border-radius": value, "border-top-left-radius": null, "border-top-right-radius": null, "border-bottom-left-radius": null, "border-bottom-right-radius": null });
    return styled({ [name]: value });
  }
  void doc;
  return null;
}

/** The design's node an element on the stage draws (by its path, so the screen's code and the design agree). */
export function nodeFor(doc: DesignDoc, root: Element, element: Element): DocNode | null {
  const path = pathOf(element, root);
  return path ? atPath(doc, path) : null;
}

/** Whether an element is laid out by its parent (a flex or grid box), so moving it reorders it. */
export const inFlow = (element: Element) => getComputedStyle(element).position !== "absolute" && getComputedStyle(element).position !== "fixed";
export { isFrame };
