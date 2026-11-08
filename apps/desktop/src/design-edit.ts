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

/** What a click on an element selects: its component, else the layout frame round it (a flex or grid box), else itself. */
export function targetOf(element: Element, root: Element): Element | null {
  if (!root.contains(element) || element === root) return null;
  const component = componentOf(element, root);
  if (component) return component.element;
  for (let at: Element | null = element; at && at !== root; at = at.parentElement) if (isFrame(at)) return at;
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
  return hit ? { current: hit.value, currentLabel: hit.label } : { current: "", currentLabel: `${raw} · off scale`, offScale: true };
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
      else rows.push({ property: "style:padding", name: "Padding", group: "Layout", options: SPACE, current: "", currentLabel: `${sides.map(px).join(" ")} · mixed`, offScale: true });
      const fill = style.backgroundColor;
      rows.push({ property: "style:background-color", name: "Fill", group: "Fill", options: [NONE, ...FILLS],
        ...(rgbaOf(fill)?.[3] === 0 ? { current: NONE.value, currentLabel: NONE.label } : match(FILLS, fill, option => probe.read("background-color", option.value), sameColor, colorName(rgbaOf(fill)!))) });
    }
    if (words && !frame) {
      rows.push({ property: "style:color", name: "Ink", group: "Fill", options: INKS, ...match(INKS, style.color, option => probe.read("color", option.value), sameColor, colorName(rgbaOf(style.color)!)) });
      const roles = TYPE_ROLES.map(role => ({ value: role, label: role }));
      const type = roles.find(role => px(probe.read("font-size", v(`${role.value}-size`))) === px(style.fontSize) && px(probe.read("line-height", v(`${role.value}-leading`))) === px(style.lineHeight));
      rows.push({ property: "type", name: "Style", group: "Type", options: roles, ...(type ? { current: type.value, currentLabel: type.label } : { current: "", currentLabel: `${px(style.fontSize)}/${px(style.lineHeight)} · off scale`, offScale: true }) });
      rows.push({ property: "style:font-weight", name: "Weight", group: "Type", options: WEIGHTS, ...match(WEIGHTS, style.fontWeight, option => probe.read("font-weight", option.value), (a, b) => Number(a) === Number(b), style.fontWeight) });
    }
    if (frame) length("border-radius", "border-top-left-radius", RADIUS, "Corner", "Corner");
  } finally {
    probe.done();
  }
  return rows;
}

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
  } else if (change.property.startsWith("style:")) {
    element.style.setProperty(change.property.slice(6), change.value);
  }
  return true;
}

/** Every copy of the screen on the stage (Light and Dark side by side are two). */
export const screensIn = (host: Element) => [...host.querySelectorAll(".studio-viewer__content")];
