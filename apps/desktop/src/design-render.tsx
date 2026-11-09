/**
 * Drawing a design document (src/design-doc.ts) on the stage, in a layer's thumbnail and in its iterations: each node as
 * what it is, inside the screen's specimen as the screen's code drew it, so element paths are the same either way.
 *
 *   element    its tag, Area's classes, attributes and inline style (an svg's drawing set whole)
 *   component  the system's own React component with its props, icons from @area/icons
 *   text       its words
 *   shape      a box placed in its frame, painted with a role, an ellipse its corner at half
 *
 * Also what Insert offers: the system's components a design starts with, each with words and props from the system's
 * example copy (docs/DESIGN_SYSTEM.md, Example copy), and new frames, text and shapes.
 */
import { createElement, Fragment, type CSSProperties, type ReactNode } from "react";
import * as AREA from "@area/react";
import * as ICONS from "@area/icons";
import { hasChildren, styleKey, jsxName, type ComponentNode, type DocNode, type ElementNode, type PropValue, type ShapeNode, type Style } from "./design-doc.ts";

const BOOLEAN_ATTRS = new Set(["disabled", "checked", "hidden", "readonly", "required", "selected", "multiple", "open", "inert", "autofocus", "novalidate", "formnovalidate", "playsinline", "muted", "loop", "controls", "autoplay", "reversed", "default"]);
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

export function reactStyle(style: Style | undefined): CSSProperties | undefined {
  if (!style) return undefined;
  return Object.fromEntries(Object.entries(style).map(([name, value]) => [styleKey(name), value])) as CSSProperties;
}

/** An element's attributes as React props: booleans as flags, a field's value and checked as its defaults. */
function attrProps(node: ElementNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const field = node.tag === "input" || node.tag === "textarea" || node.tag === "select";
  for (const [name, value] of Object.entries(node.attrs ?? {})) {
    if (/^on/i.test(name)) continue;
    if (field && name === "value") { props.defaultValue = value; continue; }
    if (field && name === "checked") { props.defaultChecked = true; continue; }
    if (node.tag === "option" && name === "selected") continue;
    if (BOOLEAN_ATTRS.has(name)) { props[jsxName(name)] = true; continue; }
    props[jsxName(name)] = value;
  }
  return props;
}

const propValue = (value: PropValue): unknown => {
  if (typeof value !== "object") return value;
  const Icon = (ICONS as Record<string, unknown>)[value.icon] as ((props: object) => ReactNode) | undefined;
  return Icon ? createElement(Icon) : null;
};

function drawComponent(node: ComponentNode): ReactNode {
  const Component = (AREA as Record<string, unknown>)[node.component] as Parameters<typeof createElement>[0] | undefined;
  if (!Component) return <span key={node.id} data-node={node.id} className="studio-design__missing">{node.component}</span>;
  const props: Record<string, unknown> = { key: node.id, "data-node": node.id };
  for (const [name, value] of Object.entries(node.props)) props[name] = propValue(value);
  if (node.style) props.style = { ...(props.style as object | undefined), ...reactStyle(node.style) };
  return createElement(Component, props, node.text);
}

export const shapeStyle = (node: ShapeNode): CSSProperties => ({ ...reactStyle(node.style), ...(node.shape === "ellipse" ? { borderRadius: "50%" } : {}) });

export function drawNode(node: DocNode): ReactNode {
  switch (node.kind) {
    case "text": return <Fragment key={node.id}>{node.text}</Fragment>;
    case "component": return drawComponent(node);
    case "shape": return <div key={node.id} data-node={node.id} data-shape={node.shape} style={shapeStyle(node)} />;
    case "element": {
      // A frame or words added with the tools is a thing of its own to choose, even inside a component's markup.
      const props: Record<string, unknown> = { key: node.id, "data-node": node.id, ...(node.name ? { "data-own": "" } : {}), ...attrProps(node) };
      if (node.className) props.className = node.className;
      if (node.style) props.style = reactStyle(node.style);
      if (node.inner !== undefined) return createElement(node.tag, { ...props, dangerouslySetInnerHTML: { __html: node.inner } });
      if (VOID.has(node.tag)) return createElement(node.tag, props);
      return createElement(node.tag, props, ...node.children.map(drawNode));
    }
  }
}

/** A design's top nodes, drawn. */
export function DocNodes({ nodes }: { nodes: readonly DocNode[] }) {
  return <>{nodes.map(drawNode)}</>;
}

/* --- What Insert offers -------------------------------------------------------------------------------------------- */

export interface Insertable {
  /** The item's id in the menu. */
  id: string;
  label: string;
  group: "Actions" | "Marks" | "Inputs" | "People" | "Progress" | "Layout" | "Text" | "Shapes";
  /** The node it inserts, without an id (one is given on insert). */
  make: () => DistributiveOmit<DocNode, "id">;
}
type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;

const component = (name: string, props: Record<string, PropValue>, text?: string) => () => ({ kind: "component" as const, component: name, props, ...(text !== undefined ? { text } : {}) });

/**
 * A new frame: a row or column on the system's spacing, which the system's own layouts are (flex with a token gap).
 * Its children are laid out by it; drawn shapes sit on it (absolute), so it is their positioning box.
 */
export const newFrame = (direction: "row" | "column" = "column"): DistributiveOmit<ElementNode, "id"> => ({
  kind: "element", tag: "div", name: "Frame", children: [],
  style: { display: "flex", "flex-direction": direction, gap: "var(--area-space-8)", padding: "var(--area-space-12)", "border-radius": "var(--area-radius-container)", background: "var(--area-bg-subtle)", "min-block-size": "var(--area-space-48)", position: "relative" },
});
/** New words: the reading text role in the default ink, as Area's text is set. */
export const newText = (words = "Text"): DistributiveOmit<ElementNode, "id"> => ({
  kind: "element", tag: "p", name: "Text",
  style: { margin: "0", "font-size": "var(--area-text-base-size)", "line-height": "var(--area-text-base-leading)", "letter-spacing": "var(--area-text-base-tracking)", color: "var(--area-fg-default)" },
  children: [{ id: "", kind: "text", text: words }],
});
/** A new shape at a place in its frame, painted with the component fill and a control's corner (a rectangle). */
export const newShape = (shape: "rectangle" | "ellipse", box: { x: number; y: number; width: number; height: number }): DistributiveOmit<ShapeNode, "id"> => ({
  kind: "shape", shape, name: shape === "rectangle" ? "Rectangle" : "Ellipse",
  style: {
    position: "absolute", left: `${Math.round(box.x)}px`, top: `${Math.round(box.y)}px`, width: `${Math.max(1, Math.round(box.width))}px`, height: `${Math.max(1, Math.round(box.height))}px`,
    background: "var(--area-bg-component)", ...(shape === "rectangle" ? { "border-radius": "var(--area-radius-control)" } : {}),
  },
});

export const INSERTABLE: Insertable[] = [
  { id: "button", label: "Button", group: "Actions", make: component("Button", {}, "New report") },
  { id: "button-soft", label: "Button, soft", group: "Actions", make: component("Button", { variant: "soft", tone: "neutral" }, "Cancel") },
  { id: "button-icon", label: "Icon button", group: "Actions", make: component("Button", { variant: "ghost", tone: "neutral", iconOnly: true, icon: { icon: "AddIcon" }, "aria-label": "Add" }) },
  { id: "link", label: "Link", group: "Actions", make: component("Link", { href: "#" }, "Learn more") },
  { id: "badge", label: "Badge", group: "Marks", make: component("Badge", { tone: "success" }, "Complete") },
  { id: "tag", label: "Tag", group: "Marks", make: component("Tag", {}, "Design") },
  { id: "count", label: "Count", group: "Marks", make: component("Count", { count: 3 }) },
  { id: "kbd", label: "Key", group: "Marks", make: component("Kbd", { keys: "⌘K" }) },
  { id: "input", label: "Input", group: "Inputs", make: component("Input", { placeholder: "Search", "aria-label": "Search" }) },
  { id: "checkbox", label: "Checkbox", group: "Inputs", make: component("Checkbox", { label: "Email me updates", defaultChecked: true }) },
  { id: "switch", label: "Switch", group: "Inputs", make: component("Switch", { label: "Notifications", defaultChecked: true }) },
  { id: "avatar", label: "Avatar", group: "People", make: component("Avatar", { fallback: "DT", alt: "David Tee" }) },
  { id: "progress", label: "Progress", group: "Progress", make: component("Progress", { value: 60, label: "Uploading" }) },
  { id: "spinner", label: "Spinner", group: "Progress", make: component("Spinner", { label: "Loading" }) },
  { id: "separator", label: "Separator", group: "Layout", make: component("Separator", {}) },
  { id: "frame-column", label: "Frame, down", group: "Layout", make: () => newFrame("column") },
  { id: "frame-row", label: "Frame, across", group: "Layout", make: () => newFrame("row") },
  { id: "text", label: "Text", group: "Text", make: () => newText() },
  { id: "rectangle", label: "Rectangle", group: "Shapes", make: () => newShape("rectangle", { x: 0, y: 0, width: 96, height: 64 }) },
  { id: "ellipse", label: "Ellipse", group: "Shapes", make: () => newShape("ellipse", { x: 0, y: 0, width: 64, height: 64 }) },
];

/** A made node with ids from `next` (its children too). */
export function withIds(made: DistributiveOmit<DocNode, "id">, next: number): { node: DocNode; next: number } {
  let n = next;
  const give = (node: DistributiveOmit<DocNode, "id"> | DocNode): DocNode => {
    const id = `n${n++}`;
    return node.kind === "element" ? { ...node, id, children: node.children.map(give) } as DocNode : { ...node, id } as DocNode;
  };
  const node = give(made);
  return { node, next: n };
}

export { hasChildren };
