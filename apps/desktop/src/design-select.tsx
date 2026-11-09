/**
 * Editing a design on the stage (the design interface; src/design-edit.ts, src/design-doc.ts; direct editing,
 * 2026-11-08, docs/research/design-editing-2026-11-08/README.md). The design's own controls don't act while it is edited
 * (a vector tool's way): the pointer chooses and shapes instead.
 *
 *   Hover        outlines what a click would choose: a component, a shape, a run of words, else the frame round it
 *   Click        chooses it (Esc clears); ⇧Enter its parent, Enter its first child, Tab and ⇧Tab its siblings
 *   Drag         moves it: in a frame's flow it reorders, the drop shown as a line between siblings (into another frame
 *                too); a shape placed in its frame moves freely, snapping to the frame's edges and centre
 *   Handles      resize it (Fixed width and height; ⇧ keeps its proportions); a double-click on a side's makes it Hug
 *   Spaces       a chosen frame's padding and gaps have bars to drag, snapping to the system's space steps (⇧ every side,
 *                ⌥ the opposite side too); drawn shapes snap to their frame's and their siblings' edges and centres
 *   Double-click edits words in place (Enter or Esc keeps them, Esc with nothing changed leaves them)
 *   Tools        V choose, F frame, R rectangle, O ellipse, T text: drag (or click) on the design to add one
 *   Keys         ⌫ removes, ⌘D duplicates, arrows reorder in a flow or nudge a shape (⇧ by 10), ⌘Z and ⇧⌘Z undo and redo
 *
 * Space or the middle button still pans and a pinch still zooms (design-viewer.tsx). Everything drawn over the design —
 * outlines, handles, the size, the drop line, guides — is drawn over the stage, not in it, so it stays one size at any
 * zoom; it follows the design every frame while something is shown. Values and the reasons for them are in the research
 * note's "Stage" section (handles 8 with a 16 hit, drag past 4, snap within 8, nudge 1 and 10).
 */
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from "react";
import { Button, Menu, MenuItem, MenuLabel, MenuSeparator, Toolbar, ToolbarSeparator, Tooltip, Kbd } from "@area/react";
import { AddIcon, EllipseIcon, FrameIcon, PointerIcon, RectangleIcon, RedoIcon, TextIcon, UndoIcon } from "@area/icons";
import { describe, elementAt, inFlow, isFrame, nearestStep, nodeFor, padSides, pathOf, patchFor, screensIn, sizeAxisOf, sizeOf, sizeStyles, spaceToken, targetOf, type Dimension, type Side } from "./design-edit.ts";
import { find, hasChildren, pathOf as docPath, reid, restyle, walk, type DesignDoc, type DocNode, type DocOp, type ElementNode } from "./design-doc.ts";
import { INSERTABLE, newFrame, newShape, newText, withIds, type Insertable } from "./design-render.tsx";
import type { DesignEditor } from "./design-editor.tsx";

/* --- Measures (the research note's Stage table) ------------------------------------------------------------------ */
/** A drag starts past this many screen pixels (a mouse's; the measured editors use 4 to 10). */
const DRAG_START = 4; /* spec: research note, Stage */
/** A moved shape snaps to its frame's edges and centre within this many screen pixels. */
const SNAP = 8; /* spec */
/** What a click with a shape or frame tool makes, in the design's pixels. */
const CLICK_SIZE = 100; /* spec: the measured editors' click size */
const NUDGE = 1, BIG_NUDGE = 10; /* spec */
/** Under this many screen pixels a side keeps only its corner handles. */
const SMALL_BOX = 24; /* spec: the measured editors hide or move handles under 16 to 32 */
/**
 * A padding's bar shows once the padding is this many screen pixels deep, clear of the side's resize handle (its hit
 * reaches 8 in); a gap's once it is this wide. Smaller spaces change in the Design view.
 */
const PADDING_BAR = 20, GAP_BAR = 4; /* spec: the handle's 16 hit, halved, plus the bar's own */
const MAX_GAPS = 24;
/** Two presses on a handle this close together are a double-click. */
const DOUBLE_CLICK = 400; /* spec: the platforms' default double-click time is 400 to 500 */

export type Tool = "select" | "frame" | "rectangle" | "ellipse" | "text";
const TOOLS: ReadonlyArray<{ tool: Tool; label: string; key: string; icon: ReactNode }> = [
  { tool: "select", label: "Choose", key: "V", icon: <PointerIcon /> },
  { tool: "frame", label: "Frame", key: "F", icon: <FrameIcon /> },
  { tool: "rectangle", label: "Rectangle", key: "R", icon: <RectangleIcon /> },
  { tool: "ellipse", label: "Ellipse", key: "O", icon: <EllipseIcon /> },
  { tool: "text", label: "Text", key: "T", icon: <TextIcon /> },
];
const TYPING = "input, textarea, select, [contenteditable], [role=combobox], [role=listbox], [role=menu], [role=slider]";

export interface StageSelectionProps {
  /** The stage: its screens are found in it, and everything is drawn over it. */
  stage: RefObject<HTMLElement | null>;
  /** Whether the design can be edited (a screen layer; an image has nothing to choose). */
  enabled: boolean;
  selected: readonly number[] | null;
  onSelect: (path: number[] | null) => void;
  /** The layer's design and its edits (src/design-editor.tsx); without it the stage only chooses. */
  editor?: DesignEditor;
}

type Box = { x: number; y: number; width: number; height: number };
type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

type Gesture =
  | { kind: "press"; root: HTMLElement; element: Element; x: number; y: number }
  | { kind: "move"; root: HTMLElement; element: Element; node: string; x: number; y: number; flow: boolean; start: { left: number; top: number }; at?: { left: number; top: number }; drop?: Drop | null; guides?: Box[] }
  | { kind: "resize"; root: HTMLElement; element: Element; node: string; handle: Handle; x: number; y: number; start: Box; at: Box; absolute: boolean; guides?: Box[] }
  | { kind: "space"; root: HTMLElement; element: HTMLElement; node: string; space: Space; x: number; y: number; start: number; at: number; sides: Side[]; moved: boolean; saved: Array<[HTMLElement, string | null]>; words: string }
  | { kind: "draw"; root: HTMLElement; tool: Exclude<Tool, "select">; x: number; y: number; cx: number; cy: number };

/** A frame's space being dragged: a side's padding, or the gap between its children (`across`: a row's). */
type Space = { kind: "padding"; side: Side } | { kind: "gap"; across: boolean };
const SIDES: Side[] = ["top", "right", "bottom", "left"];
const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/** A line something can snap to, in its frame's pixels: at `at` on one axis, from `from` to `to` on the other. */
interface Line { at: number; from: number; to: number }
/** What a placed thing snaps to in its frame: the frame's edges and centre, and each sibling's. */
function snapTargets(element: HTMLElement): { frame: HTMLElement; xs: Line[]; ys: Line[] } | null {
  const frame = element.offsetParent as HTMLElement | null;
  if (!frame) return null;
  const fw = frame.clientWidth, fh = frame.clientHeight;
  const xs: Line[] = [0, fw / 2, fw].map(at => ({ at, from: 0, to: fh }));
  const ys: Line[] = [0, fh / 2, fh].map(at => ({ at, from: 0, to: fw }));
  for (const sibling of frame.children) {
    if (sibling === element || !(sibling instanceof HTMLElement) || sibling.offsetParent !== frame || !sibling.getClientRects().length) continue;
    const l = sibling.offsetLeft, t = sibling.offsetTop, w = sibling.offsetWidth, h = sibling.offsetHeight;
    for (const at of [l, l + w / 2, l + w]) xs.push({ at, from: t, to: t + h });
    for (const at of [t, t + h / 2, t + h]) ys.push({ at, from: l, to: l + w });
  }
  return { frame, xs, ys };
}
/** The nearest of `lines` to any of `edges` within `reach`: how far to shift to meet it. */
function snapTo(edges: number[], lines: Line[], reach: number): { shift: number; line: Line } | null {
  let best: { shift: number; line: Line } | null = null;
  for (const line of lines) for (const edge of edges) {
    const shift = line.at - edge;
    if (Math.abs(shift) < reach && (!best || Math.abs(shift) < Math.abs(best.shift))) best = { shift, line };
  }
  return best;
}
/** The guides for what snapped, on the screen: each line drawn from the thing to what it meets. */
function guidesFor(frame: HTMLElement, scale: number, x: Line | null, y: Line | null, me: Box): Box[] {
  const fr = frame.getBoundingClientRect();
  const ox = fr.left + frame.clientLeft * scale, oy = fr.top + frame.clientTop * scale;
  const out: Box[] = [];
  if (x) { const a = Math.min(x.from, me.y), b = Math.max(x.to, me.y + me.height); out.push({ x: ox + x.at * scale, y: oy + a * scale, width: 1, height: (b - a) * scale }); }
  if (y) { const a = Math.min(y.from, me.x), b = Math.max(y.to, me.x + me.width); out.push({ x: ox + a * scale, y: oy + y.at * scale, width: (b - a) * scale, height: 1 }); }
  return out;
}

/** A space's change in words and as a property: "Padding top", "Padding top and bottom", "Padding", "Gap". */
function spaceWords(space: Space, sides: readonly Side[]) {
  if (space.kind === "gap") return { name: "Gap", property: "style:gap" };
  if (sides.length === 4) return { name: "Padding", property: "style:padding" };
  if (sides.length === 2) return sides.includes("top") ? { name: "Padding top and bottom", property: "style:padding-block" } : { name: "Padding left and right", property: "style:padding-inline" };
  return { name: `Padding ${sides[0]}`, property: `style:padding-${sides[0]}` };
}

/** Where a drop lands in a frame's flow: the frame, the element it goes before (none: at the end), and the line drawn. */
interface Drop { container: Element; before: Element | null; line: Box }

const contentOf = (node: EventTarget | null) => node instanceof Element ? node.closest<HTMLElement>(".studio-viewer__content") : null;
const panning = (node: Element) => Boolean(node.closest(".studio-viewer")?.hasAttribute("data-panning"));
const scaleOf = (root: HTMLElement) => root.offsetWidth ? root.getBoundingClientRect().width / root.offsetWidth : 1;
const specimenOf = (root: Element) => root.firstElementChild;
/** A box relative to the stage. */
const boxIn = (host: Element, rect: DOMRect | Box): Box => {
  const from = host.getBoundingClientRect();
  const r = rect as DOMRect;
  return { x: (r.left ?? (rect as Box).x) - from.left, y: (r.top ?? (rect as Box).y) - from.top, width: rect.width, height: rect.height };
};

/** The frame under a point a drop or a new thing goes into, and where in its flow. */
function dropAt(doc: DesignDoc, root: HTMLElement, x: number, y: number, dragged: Element | null): Drop | null {
  const specimen = specimenOf(root);
  if (!specimen) return null;
  const under = document.elementsFromPoint(x, y).find(element => specimen.contains(element) && element !== specimen && !(dragged && (dragged === element || dragged.contains(element))));
  for (let at: Element | null = under ?? specimen.firstElementChild; at && at !== specimen; at = at.parentElement) {
    if (!isFrame(at)) continue;
    const node = nodeFor(doc, root, at);
    if (!node || node.kind !== "element") continue;
    const style = getComputedStyle(at);
    const across = style.display.includes("flex") && style.flexDirection.startsWith("row");
    const kids = [...at.children].filter(child => child !== dragged && inFlow(child) && child.getClientRects().length);
    const before = kids.find(child => { const r = child.getBoundingClientRect(); return across ? x < r.left + r.width / 2 : y < r.top + r.height / 2; }) ?? null;
    const frame = at.getBoundingClientRect();
    const gap = (parseFloat(across ? style.columnGap : style.rowGap) || 0) * scaleOf(root);
    const ref = before ?? kids[kids.length - 1];
    let line: Box;
    if (!ref) line = across ? { x: frame.left + parseFloat(style.paddingLeft) * scaleOf(root), y: frame.top, width: 2, height: frame.height } : { x: frame.left, y: frame.top + parseFloat(style.paddingTop) * scaleOf(root), width: frame.width, height: 2 };
    else {
      const r = ref.getBoundingClientRect();
      const edge = before ? (across ? r.left - gap / 2 : r.top - gap / 2) : (across ? r.right + gap / 2 : r.bottom + gap / 2);
      line = across ? { x: edge - 1, y: r.top, width: 2, height: r.height } : { x: r.left, y: edge - 1, width: r.width, height: 2 };
    }
    return { container: at, before, line };
  }
  return null;
}

/** The deepest element a drawn shape is placed in: an element of the design under the point that can hold children. */
function holderAt(doc: DesignDoc, root: HTMLElement, x: number, y: number): Element | null {
  const specimen = specimenOf(root);
  if (!specimen) return null;
  const under = document.elementsFromPoint(x, y).find(element => specimen.contains(element) && element !== specimen);
  for (let at: Element | null = under ?? null; at && at !== specimen; at = at.parentElement) {
    const node = nodeFor(doc, root, at);
    if (node?.kind === "element" && !node.inner && !["img", "input", "textarea", "select", "button", "p", "span", "a", "label"].includes(node.tag)) return at;
  }
  return specimen.firstElementChild;
}

/** The index in a frame node's children a drop before `before` (an element of the frame) means, without `moving`. */
function indexIn(doc: DesignDoc, root: HTMLElement, frame: ElementNode, before: Element | null, moving?: string): number {
  const list = frame.children.filter(child => child.id !== moving);
  const target = before ? nodeFor(doc, root, before) : null;
  const index = target ? list.findIndex(child => child.id === target.id) : -1;
  return index < 0 ? list.length : index;
}

const px = (value: number) => `${Math.round(value)}px`;
/** A component's React name in words ("SectionHeading" → "Section heading"), as the log names a component. */
const spaced = (name: string) => name.replace(/(?<=[a-z0-9])([A-Z])/g, letter => ` ${letter.toLowerCase()}`);
const named = (node: DocNode, root: Element, element: Element | null) => {
  if (node.kind === "shape") return { target: node.shape === "rectangle" ? "Rectangle" : "Ellipse", label: "" };
  if (node.kind === "component") return { target: spaced(node.component), label: element ? describe(element, root).label : node.text ?? "" };
  if (element) { const { target, label } = describe(element, root); return { target: (node.kind === "element" ? node.name : undefined) ?? target, label }; }
  return { target: node.kind === "element" && node.name ? node.name : "Frame", label: "" };
};
/** A frame in words: its own class, as the agent finds it in the code. */
const frameName = (frame: ElementNode | null) => frame?.className ? `.${frame.className.split(" ")[0]}` : "its frame";
/** A place among a frame's children that draw ("2 of 3"), counting `id` at `index` of the children as they are or will be. */
function where(frame: ElementNode | null, list: readonly DocNode[], id: string, inFrame = false) {
  const drawn = list.filter(entry => entry.kind !== "text");
  const at = drawn.findIndex(entry => entry.id === id);
  return `${at + 1} of ${drawn.length}${inFrame ? ` in ${frameName(frame)}` : ""}`;
}
/** A frame's children with a node put at an index (its place after a move or an insert). */
const placed = (list: readonly DocNode[], node: DocNode, index: number) => { const out = list.filter(entry => entry.id !== node.id); out.splice(index, 0, node); return out; };

export function StageSelection({ stage, enabled, selected, onSelect, editor }: StageSelectionProps) {
  const [tool, setTool] = useState<Tool>("select");
  const hoverBox = useRef<HTMLDivElement>(null);
  const selectBoxes = useRef<HTMLDivElement>(null);
  const dropLine = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const guides = useRef<HTMLDivElement>(null);
  const spaces = useRef<HTMLDivElement>(null);
  const lastPress = useRef<{ handle: Handle; at: number } | null>(null);
  const insertTrigger = useRef<HTMLButtonElement>(null);
  const hovered = useRef<{ root: Element; element: Element } | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const editing = useRef<{ element: HTMLElement; original: Node[]; words: string; node: string; prop?: string; root: HTMLElement } | null>(null);
  const latest = useRef({ selected, onSelect, editor, tool });
  latest.current = { selected, onSelect, editor, tool };
  const editable = Boolean(editor?.doc);

  /** The first copy of the screen and the chosen element in it. */
  const chosen = () => {
    const host = stage.current;
    const path = latest.current.selected;
    const root = host ? screensIn(host)[0] as HTMLElement | undefined : undefined;
    const element = root && path ? elementAt(root, path) : null;
    const doc = latest.current.editor?.doc;
    const node = doc && root && element ? nodeFor(doc, root, element) : null;
    return { root, element, node, doc };
  };

  /** Makes an edit and chooses what it is about afterwards. */
  const commit = (op: DocOp, words: Parameters<DesignEditor["commit"]>[1], select?: string | null) => {
    const ed = latest.current.editor;
    if (!ed) return null;
    const after = ed.commit(op, words);
    if (after && select !== undefined) latest.current.onSelect(select ? docPath(after, select) : null);
    return after;
  };

  /* --- Words in place --------------------------------------------------------------------------------------------- */
  const finishEditing = (keep: boolean) => {
    const open = editing.current;
    if (!open) return;
    editing.current = null;
    const words = open.element.textContent ?? "";
    open.element.removeAttribute("contenteditable");
    // React drew the words: put its own text node back before the design draws the new ones.
    open.element.replaceChildren(...open.original);
    getSelection()?.removeAllRanges();
    const doc = latest.current.editor?.doc;
    if (!keep || !doc || words === open.words || !words.trim()) return;
    const node = find(doc, open.node)?.node;
    if (!node) return;
    const op: DocOp | null = open.prop && node.kind === "component"
      ? { op: "patch", node: node.id, patch: { props: { ...node.props, [open.prop]: words } } }
      : patchFor(doc, node, "text", words);
    if (!op) return;
    const { target, label } = named(node, open.root, null);
    commit(op, { target, label: open.words.slice(0, 32), property: "text", name: "Words", from: open.words, to: words, value: words });
    void label;
  };

  /** Edits the words under a point, or (`within`) the first words in an element. */
  const startEditing = (root: HTMLElement, x: number, y: number, within?: Element) => {
    const doc = latest.current.editor?.doc;
    if (!doc) return false;
    const range = within ? null : document.caretRangeFromPoint?.(x, y);
    const text = within ? document.createTreeWalker(within, NodeFilter.SHOW_TEXT).nextNode() as Text | null
      : range?.startContainer instanceof Text && root.contains(range.startContainer) ? range.startContainer : null;
    const element = text?.parentElement;
    if (!text || !element || [...element.childNodes].some(child => !(child instanceof Text))) return false;
    // The node the words belong to: the element's own, else the component it is part of.
    let node: DocNode | null = null;
    for (let at: Element | null = element; at && at !== root && !node; at = at.parentElement) {
      const found = nodeFor(doc, root, at);
      if (found && found.kind !== "text") node = found;
    }
    if (!node || node.kind === "shape") return false;
    const words = element.textContent ?? "";
    let prop: string | undefined;
    if (node.kind === "component" && node.text === undefined) {
      prop = Object.entries(node.props).find(([, value]) => value === words)?.[0];
      if (!prop) return false;
    }
    editing.current = { element: element as HTMLElement, original: [...element.childNodes], words, node: node.id, prop, root };
    element.setAttribute("contenteditable", "plaintext-only");
    (element as HTMLElement).focus();
    const all = document.createRange();
    all.selectNodeContents(element);
    getSelection()?.removeAllRanges();
    getSelection()?.addRange(all);
    const done = (event: Event) => {
      if (event.type === "keydown") {
        const key = event as KeyboardEvent;
        if (key.key === "Enter" && !key.shiftKey) { key.preventDefault(); finishEditing(true); }
        else if (key.key === "Escape") { key.preventDefault(); key.stopPropagation(); finishEditing(true); }
        else return;
      } else finishEditing(true);
      element.removeEventListener("keydown", done);
      element.removeEventListener("blur", done);
    };
    element.addEventListener("keydown", done);
    element.addEventListener("blur", done);
    return true;
  };

  /* --- The pointer ------------------------------------------------------------------------------------------------ */
  useEffect(() => {
    const host = stage.current;
    if (!host || !enabled) return;
    const inEditing = (target: EventTarget | null) => Boolean(editing.current && target instanceof Node && editing.current.element.contains(target));
    const move = (event: PointerEvent) => {
      const g = gesture.current;
      if (!g) {
        const root = contentOf(event.target);
        const element = root && !panning(root) && latest.current.tool === "select" ? targetOf(event.target as Element, root) : null;
        hovered.current = root && element ? { root, element } : null;
        return;
      }
      const ed = latest.current.editor;
      const doc = ed?.doc;
      const scale = scaleOf(g.root);
      if (g.kind === "press") {
        if (Math.hypot(event.clientX - g.x, event.clientY - g.y) < DRAG_START || !doc) return;
        const node = nodeFor(doc, g.root, g.element);
        const at = node && find(doc, node.id);
        // A design's top node stays: it is the screen.
        if (!node || !at?.parent) { gesture.current = null; return; }
        const flow = inFlow(g.element);
        const style = getComputedStyle(g.element);
        gesture.current = { kind: "move", root: g.root, element: g.element, node: node.id, x: g.x, y: g.y, flow, start: { left: parseFloat(style.left) || 0, top: parseFloat(style.top) || 0 } };
        hovered.current = null;
        // This move already places it.
        move(event);
        return;
      }
      if (g.kind === "move") {
        if (!doc) return;
        if (g.flow) g.drop = dropAt(doc, g.root, event.clientX, event.clientY, g.element);
        else {
          let left = g.start.left + (event.clientX - g.x) / scale, top = g.start.top + (event.clientY - g.y) / scale;
          // Snap an edge or the centre to the frame's or a sibling's (⌥ holds it off).
          const element = g.element as HTMLElement;
          const w = element.offsetWidth, h = element.offsetHeight;
          const snap = event.altKey ? null : snapTargets(element);
          let lines: Box[] = [];
          if (snap) {
            const sx = snapTo([left, left + w / 2, left + w], snap.xs, SNAP / scale);
            const sy = snapTo([top, top + h / 2, top + h], snap.ys, SNAP / scale);
            if (sx) left += sx.shift;
            if (sy) top += sy.shift;
            lines = guidesFor(snap.frame, scale, sx?.line ?? null, sy?.line ?? null, { x: left, y: top, width: w, height: h });
          }
          g.at = { left: Math.round(left), top: Math.round(top) };
          g.guides = lines;
        }
        return;
      }
      if (g.kind === "resize") {
        const dx = (event.clientX - g.x) / scale, dy = (event.clientY - g.y) / scale;
        let { x, y, width, height } = g.start;
        if (g.handle.includes("e")) width += dx;
        if (g.handle.includes("w")) { width -= dx; x += dx; }
        if (g.handle.includes("s")) height += dy;
        if (g.handle.includes("n")) { height -= dy; y += dy; }
        if (event.shiftKey && g.handle.length === 2) {
          const ratio = g.start.width / g.start.height || 1;
          if (width / height > ratio) height = width / ratio; else width = height * ratio;
          if (g.handle.includes("n")) y = g.start.y + g.start.height - height;
          if (g.handle.includes("w")) x = g.start.x + g.start.width - width;
        }
        g.guides = [];
        const snap = g.absolute && !event.altKey && !(event.shiftKey && g.handle.length === 2) ? snapTargets(g.element as HTMLElement) : null;
        if (snap) {
          const reach = SNAP / scale;
          const sx = g.handle.includes("e") ? snapTo([x + width], snap.xs, reach) : g.handle.includes("w") ? snapTo([x], snap.xs, reach) : null;
          const sy = g.handle.includes("s") ? snapTo([y + height], snap.ys, reach) : g.handle.includes("n") ? snapTo([y], snap.ys, reach) : null;
          if (sx) { if (g.handle.includes("e")) width += sx.shift; else { x += sx.shift; width -= sx.shift; } }
          if (sy) { if (g.handle.includes("s")) height += sy.shift; else { y += sy.shift; height -= sy.shift; } }
          g.guides = guidesFor(snap.frame, scale, sx?.line ?? null, sy?.line ?? null, { x, y, width, height });
        }
        g.at = { x: Math.round(x), y: Math.round(y), width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) };
        return;
      }
      if (g.kind === "space") {
        const dx = (event.clientX - g.x) / scale, dy = (event.clientY - g.y) / scale;
        const pull = g.space.kind === "gap" ? (g.space.across ? dx : dy)
          : { top: dy, bottom: -dy, left: dx, right: -dx }[g.space.side];
        if (Math.hypot(event.clientX - g.x, event.clientY - g.y) >= 1) g.moved = true;
        g.at = nearestStep(Math.max(0, g.start + pull));
        g.sides = g.space.kind === "gap" ? [] : event.shiftKey ? SIDES : event.altKey ? [g.space.side, OPPOSITE[g.space.side]] : [g.space.side];
        const token = spaceToken(g.at);
        // Drawn on both copies as it goes; the design takes it on release.
        for (const [element, style] of g.saved) {
          if (style === null) element.removeAttribute("style"); else element.setAttribute("style", style);
          if (g.space.kind === "gap") element.style.setProperty("gap", token);
          else for (const side of g.sides) element.style.setProperty(`padding-${side}`, token);
        }
        g.words = `${spaceWords(g.space, g.sides).name} ${g.at}`;
        return;
      }
      if (g.kind === "draw") { g.cx = event.clientX; g.cy = event.clientY; }
    };
    const leave = () => { hovered.current = null; };
    // The design's own controls don't take a press or a click while it is edited (a button would act, a field focus).
    const swallow = (event: Event) => {
      const root = contentOf(event.target);
      if (!root || panning(root) || (event as MouseEvent).button !== 0 || inEditing(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const down = (event: PointerEvent) => {
      const root = contentOf(event.target);
      if (!root || panning(root) || event.button !== 0 || inEditing(event.target)) return;
      if (editing.current) finishEditing(true);
      event.preventDefault();
      event.stopPropagation();
      const current = latest.current.tool;
      if (current !== "select") {
        if (!latest.current.editor?.doc) return;
        gesture.current = { kind: "draw", root, tool: current, x: event.clientX, y: event.clientY, cx: event.clientX, cy: event.clientY };
        host.setPointerCapture?.(event.pointerId);
        return;
      }
      const element = targetOf(event.target as Element, root);
      if (!element) { latest.current.onSelect(null); return; }
      latest.current.onSelect(pathOf(element, root));
      if (latest.current.editor?.doc) { gesture.current = { kind: "press", root, element, x: event.clientX, y: event.clientY }; host.setPointerCapture?.(event.pointerId); }
    };
    const up = (event: PointerEvent) => {
      const g = gesture.current;
      gesture.current = null;
      const doc = latest.current.editor?.doc;
      if (g?.kind === "space") for (const [element, style] of g.saved) { if (style === null) element.removeAttribute("style"); else element.setAttribute("style", style); }
      if (!g || !doc || g.kind === "press") return;
      if (g.kind === "space") {
        const node = find(doc, g.node)?.node;
        if (!node || node.kind !== "element" || !g.moved || (g.at === g.start && g.sides.length < 2)) return;
        const token = spaceToken(g.at);
        const { name, property } = spaceWords(g.space, g.sides);
        const style = g.space.kind === "gap" ? restyle(node.style, { gap: token, "row-gap": null, "column-gap": null })
          : g.sides.length === 4 ? restyle(node.style, { padding: token, "padding-top": null, "padding-right": null, "padding-bottom": null, "padding-left": null })
          : restyle(node.style, padSides(node.style, g.sides, token));
        const { target, label } = named(node, g.root, g.element);
        commit({ op: "patch", node: node.id, patch: { style } }, { target, label, property, name, from: `${Math.round(g.start)}`, to: `${g.at}`, value: token }, node.id);
        return;
      }
      if (g.kind === "move") {
        const node = find(doc, g.node);
        if (!node) return;
        const { target, label } = named(node.node, g.root, g.element);
        if (g.flow) {
          const drop = g.drop;
          const frame = drop && nodeFor(doc, g.root, drop.container);
          if (!drop || !frame || frame.kind !== "element") return;
          const index = indexIn(doc, g.root, frame, drop.before, g.node);
          if (frame.id === node.parent?.id && index === node.index) return;
          const other = frame.id !== node.parent?.id;
          commit({ op: "move", node: g.node, parent: frame.id, index }, { target, label, property: "move", name: "Order", from: where(node.parent, node.siblings, g.node, other), to: where(frame, placed(frame.children, node.node, index), g.node, other), value: `${frameName(frame)} ${index}` }, g.node);
        } else if (g.at) {
          const was = node.node.kind === "text" ? undefined : node.node.style;
          if (node.node.kind === "text") return;
          commit({ op: "patch", node: g.node, patch: { style: restyle(was, { left: px(g.at.left), top: px(g.at.top) }) } },
            { target, label, property: "position", name: "Position", from: `${Math.round(g.start.left)}, ${Math.round(g.start.top)}`, to: `${g.at.left}, ${g.at.top}`, value: `left ${px(g.at.left)}; top ${px(g.at.top)}` }, g.node);
        }
        return;
      }
      if (g.kind === "resize") {
        const node = find(doc, g.node)?.node;
        if (!node || node.kind === "text" || (g.at.width === g.start.width && g.at.height === g.start.height && g.at.x === g.start.x && g.at.y === g.start.y)) return;
        const changes: Record<string, string | null> = {};
        const dimensions: Dimension[] = [];
        if (g.handle.includes("e") || g.handle.includes("w") || (g.handle.length === 2 && event.shiftKey)) dimensions.push("width");
        if (g.handle.includes("n") || g.handle.includes("s") || (g.handle.length === 2 && event.shiftKey)) dimensions.push("height");
        // A size from the handles is Fixed: in a flow it stops growing or stretching, and the frame doesn't squeeze it.
        for (const dimension of dimensions) Object.assign(changes, g.absolute ? { [dimension]: px(g.at[dimension]) } : sizeStyles(dimension, sizeAxisOf(g.element, dimension) ?? "free", "fixed", g.at[dimension]));
        if (g.absolute) { changes.left = px(g.at.x); changes.top = px(g.at.y); }
        const { target, label } = named(node, g.root, g.element);
        commit({ op: "patch", node: g.node, patch: { style: restyle(node.style, changes) } },
          { target, label, property: "size", name: "Size", from: `${g.start.width} × ${g.start.height}`, to: `${g.at.width} × ${g.at.height}`, value: `width ${changes.width ?? "as it was"}; height ${changes.height ?? "as it was"}` }, g.node);
        return;
      }
      // A drawn thing: its box in the design's pixels.
      const scale = scaleOf(g.root);
      const dragged = Math.hypot(g.cx - g.x, g.cy - g.y) >= DRAG_START;
      const left = Math.min(g.x, g.cx), top = Math.min(g.y, g.cy);
      const size = { width: Math.abs(g.cx - g.x) / scale, height: Math.abs(g.cy - g.y) / scale };
      setTool("select");
      if (g.tool === "rectangle" || g.tool === "ellipse") {
        const holder = holderAt(doc, g.root, g.x, g.y);
        const holderNode = holder && nodeFor(doc, g.root, holder);
        if (!holder || !holderNode || holderNode.kind !== "element") return;
        const r = holder.getBoundingClientRect();
        const box = dragged
          ? { x: (left - r.left) / scale - holder.clientLeft, y: (top - r.top) / scale - holder.clientTop, ...size }
          : { x: (g.x - r.left) / scale - holder.clientLeft - CLICK_SIZE / 2, y: (g.y - r.top) / scale - holder.clientTop - CLICK_SIZE / 2, width: CLICK_SIZE, height: CLICK_SIZE };
        const made = withIds(newShape(g.tool, box), doc.next);
        const ops: DocOp[] = [];
        // Its frame is what it is placed in.
        if (getComputedStyle(holder).position === "static") ops.push({ op: "patch", node: holderNode.id, patch: { style: restyle(holderNode.style, { position: "relative" }) } });
        ops.push({ op: "insert", parent: holderNode.id, index: holderNode.children.length, node: made.node });
        commit({ op: "batch", ops: [ops[ops.length - 1]!, ...ops.slice(0, -1)] }, { target: g.tool === "rectangle" ? "Rectangle" : "Ellipse", label: "", property: "insert", name: "Added", from: "", to: `${Math.round(box.width)} × ${Math.round(box.height)} in ${frameName(holderNode)}`, value: "shape" }, made.node.id);
        return;
      }
      const drop = dropAt(doc, g.root, g.x, g.y, null);
      const frame = drop && nodeFor(doc, g.root, drop.container);
      if (!drop || !frame || frame.kind !== "element") return;
      const index = indexIn(doc, g.root, frame, drop.before);
      const base = g.tool === "frame" ? newFrame("column") : newText();
      if (g.tool === "frame" && dragged) (base as ElementNode).style = { ...(base as ElementNode).style, width: px(size.width), height: px(size.height), "flex-shrink": "0" };
      const made = withIds(base, doc.next);
      const after = commit({ op: "insert", parent: frame.id, index, node: made.node }, { target: g.tool === "frame" ? "Frame" : "Text", label: g.tool === "text" ? "Text" : "", property: "insert", name: "Added", from: "", to: where(frame, placed(frame.children, made.node, index), made.node.id, true), value: g.tool }, made.node.id);
      if (after && g.tool === "text") {
        // Straight into its words, once React has drawn them (the next task: a frame may never come in a hidden window).
        setTimeout(() => {
          const root = stage.current ? screensIn(stage.current)[0] as HTMLElement | undefined : undefined;
          const path = docPath(after, made.node.id);
          const element = root && path ? elementAt(root, path) : null;
          if (root && element) startEditing(root, 0, 0, element);
        });
      }
    };
    const click = (event: MouseEvent) => {
      const root = contentOf(event.target);
      if (!root || panning(root) || event.button !== 0 || inEditing(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const dblclick = (event: MouseEvent) => {
      const root = contentOf(event.target);
      if (!root || panning(root) || inEditing(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      if (latest.current.tool === "select" && latest.current.editor?.doc) startEditing(root, event.clientX, event.clientY);
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", down, true);
    host.addEventListener("pointerup", up);
    host.addEventListener("pointercancel", () => { gesture.current = null; });
    for (const type of ["mousedown", "mouseup"]) host.addEventListener(type, swallow, true);
    host.addEventListener("click", click, true);
    host.addEventListener("dblclick", dblclick, true);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", down, true);
      host.removeEventListener("pointerup", up);
      for (const type of ["mousedown", "mouseup"]) host.removeEventListener(type, swallow, true);
      host.removeEventListener("click", click, true);
      host.removeEventListener("dblclick", dblclick, true);
      hovered.current = null;
      gesture.current = null;
    };
  }, [stage, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  /* --- Handles: a press starts a resize --------------------------------------------------------------------------- */
  const startResize = (handle: Handle, event: ReactPointerEvent) => {
    const { root, element, node } = chosen();
    if (!root || !element || !node || node.kind === "text" || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    // A second press on a side's handle is a double-click: that side hugs. (Counted here: the stage holds the pointer
    // from the first press, so the handle never gets a dblclick of its own.)
    const last = lastPress.current;
    lastPress.current = { handle, at: event.timeStamp };
    if (last && last.handle === handle && event.timeStamp - last.at < DOUBLE_CLICK) { lastPress.current = null; hug(handle); return; }
    const scale = scaleOf(root);
    const r = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const absolute = !inFlow(element);
    const start = { x: absolute ? parseFloat(style.left) || 0 : 0, y: absolute ? parseFloat(style.top) || 0 : 0, width: Math.round(r.width / scale), height: Math.round(r.height / scale) };
    gesture.current = { kind: "resize", root, element, node: node.id, handle, x: event.clientX, y: event.clientY, start, at: start, absolute };
    stage.current?.setPointerCapture?.(event.pointerId);
  };

  /** A side's handle, double-clicked: that axis hugs what it holds (a vector tool's way). */
  const hug = (handle: Handle) => {
    if (handle.length !== 1) return;
    const { root, element, node } = chosen();
    if (!root || !element || !node || node.kind === "text") return;
    const dimension: Dimension = handle === "e" || handle === "w" ? "width" : "height";
    const size = sizeOf(element, dimension);
    if (!size || size.axis === "free" || size.mode === "hug") return;
    const { target, label } = named(node, root, element);
    commit({ op: "patch", node: node.id, patch: { style: restyle(node.style, sizeStyles(dimension, size.axis, "hug")) } },
      { target, label, property: `size:${dimension}:${size.axis}`, name: dimension === "width" ? "Width" : "Height", from: size.mode === "fixed" ? `${size.length}` : "Fill", to: "Hug", value: "hug" }, node.id);
  };

  /* --- Spaces: a press on a frame's padding or gap bar starts changing it ----------------------------------------- */
  const startSpace = (bar: HTMLElement, event: ReactPointerEvent) => {
    const { root, element, node } = chosen();
    const zone = bar.parentElement;
    if (!root || !(element instanceof HTMLElement) || !node || node.kind !== "element" || event.button !== 0 || !zone || !stage.current) return;
    event.preventDefault();
    event.stopPropagation();
    const which = zone.dataset.space!;
    const style = getComputedStyle(element);
    const space: Space = which === "gap" ? { kind: "gap", across: zone.hasAttribute("data-across") } : { kind: "padding", side: which as Side };
    const start = space.kind === "gap" ? parseFloat(space.across ? style.columnGap : style.rowGap) || 0 : parseFloat(style.getPropertyValue(`padding-${space.side}`)) || 0;
    const path = latest.current.selected!;
    const copies = screensIn(stage.current).map(screen => elementAt(screen, path)).filter((entry): entry is HTMLElement => entry instanceof HTMLElement);
    const sides = space.kind === "gap" ? [] : [space.side];
    gesture.current = { kind: "space", root, element, node: node.id, space, x: event.clientX, y: event.clientY, start, at: start, sides, moved: false,
      saved: copies.map(copy => [copy, copy.getAttribute("style")]), words: `${spaceWords(space, sides).name} ${Math.round(start)}` };
    stage.current.setPointerCapture?.(event.pointerId);
  };

  /* --- Keys ------------------------------------------------------------------------------------------------------- */
  useEffect(() => {
    if (!enabled) return;
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as Element | null;
      if (target?.closest?.(TYPING) || document.querySelector(":popover-open, dialog[open]")) return;
      // Only while the page is the design's: not from the panels' own controls.
      if (target && target !== document.body && !stage.current?.contains(target) && !target.closest?.(".studio-canvas")) return;
      const { selected: path, onSelect: select, editor: ed, tool: current } = latest.current;
      const mod = event.metaKey || event.ctrlKey;
      const take = () => { event.preventDefault(); event.stopPropagation(); };
      if (mod && event.key.toLowerCase() === "z" && ed) { take(); if (event.shiftKey) ed.redo(); else ed.undo(); return; }
      if (event.key === "Escape") {
        if (current !== "select") { take(); setTool("select"); return; }
        if (path) { take(); select(null); }
        return;
      }
      if (!mod && !event.altKey && ed?.doc) {
        const found = TOOLS.find(entry => entry.key.toLowerCase() === event.key.toLowerCase() && !event.shiftKey);
        if (found) { take(); setTool(found.tool); return; }
        if (event.shiftKey && event.key.toLowerCase() === "i") { take(); insertTrigger.current?.click(); return; }
      }
      const { root, element, node, doc } = chosen();
      if (!path || !root || !element) return;
      // Choosing around: parent, first child, siblings.
      if (event.key === "Enter") {
        take();
        if (event.shiftKey) { for (let at = element.parentElement; at && at !== specimenOf(root); at = at.parentElement) { const up = targetOf(at, root); if (up && up !== element) { select(pathOf(up, root)); return; } } return; }
        const child = [...element.querySelectorAll("*")].map(entry => targetOf(entry, root)).find(entry => entry && entry !== element);
        if (child) select(pathOf(child, root));
        return;
      }
      if (event.key === "Tab" && !mod) {
        const siblings = [...(element.parentElement?.children ?? [])].filter(entry => entry.getClientRects().length);
        const next = siblings[(siblings.indexOf(element) + (event.shiftKey ? -1 : 1) + siblings.length) % siblings.length];
        if (next && next !== element) { take(); select(pathOf(next, root)); }
        return;
      }
      if (!doc || !node || !ed) return;
      const at = find(doc, node.id);
      if (!at) return;
      const { target: what, label } = named(node, root, element);
      if ((event.key === "Backspace" || event.key === "Delete") && at.parent) {
        take();
        commit({ op: "remove", node: node.id }, { target: what, label, property: "remove", name: "Removed", from: where(at.parent, at.siblings, node.id, true), to: "removed", value: "removed" }, null);
        return;
      }
      if (mod && event.key.toLowerCase() === "d" && at.parent) {
        take();
        const copy = reid(node, doc.next).node;
        commit({ op: "insert", parent: at.parent.id, index: at.index + 1, node: copy }, { target: what, label, property: "insert", name: "Duplicated", from: "", to: where(at.parent, placed(at.siblings, copy, at.index + 1), copy.id, true), value: "copy" }, copy.id);
        return;
      }
      const arrow = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key as "ArrowLeft"];
      if (arrow && at.parent && node.kind !== "text") {
        take();
        if (inFlow(element)) {
          // In a flow the arrows reorder: back or forward one among its siblings that draw.
          const drawn = at.siblings.filter(entry => entry.kind !== "text");
          const from = drawn.indexOf(node);
          const to = from + (arrow[0]! || arrow[1]!);
          if (to < 0 || to >= drawn.length) return;
          const others = at.siblings.filter(entry => entry.id !== node.id);
          const index = to < from ? others.indexOf(drawn[to]!) : others.indexOf(drawn[to]!) + 1;
          commit({ op: "move", node: node.id, parent: at.parent.id, index }, { target: what, label, property: "move", name: "Order", from: `${from + 1} of ${drawn.length}`, to: `${to + 1} of ${drawn.length}`, value: `${frameName(at.parent)} ${index}` }, node.id);
        } else {
          const step = event.shiftKey ? BIG_NUDGE : NUDGE;
          const style = getComputedStyle(element);
          const left = (parseFloat(style.left) || 0) + arrow[0]! * step, top = (parseFloat(style.top) || 0) + arrow[1]! * step;
          commit({ op: "patch", node: node.id, patch: { style: restyle(node.style, { left: px(left), top: px(top) }) } }, { target: what, label, property: "position", name: "Position", from: `${parseFloat(style.left) || 0}, ${parseFloat(style.top) || 0}`, to: `${left}, ${top}`, value: `left ${px(left)}; top ${px(top)}` }, node.id);
        }
      }
    };
    addEventListener("keydown", key, true);
    return () => removeEventListener("keydown", key, true);
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // A tool's cursor on the stage.
  useEffect(() => {
    const host = stage.current;
    if (!host) return;
    if (tool === "select") host.removeAttribute("data-tool"); else host.setAttribute("data-tool", tool);
  }, [tool, stage]);

  /* --- Drawing over the stage, every frame --------------------------------------------------------------------------- */
  useEffect(() => {
    const host = stage.current;
    if (!host || !enabled) return;
    let frame = 0;
    const place = (box: HTMLElement, b: Box) => {
      box.hidden = false;
      box.style.transform = `translate(${Math.round(b.x)}px, ${Math.round(b.y)}px)`;
      box.style.width = `${Math.max(1, Math.round(b.width))}px`;
      box.style.height = `${Math.max(1, Math.round(b.height))}px`;
    };
    const draw = () => {
      const g = gesture.current;
      const path = latest.current.selected;
      const roots = screensIn(host) as HTMLElement[];
      const picked = path ? roots.map(root => ({ root, element: elementAt(root, path) })).filter((entry): entry is { root: HTMLElement; element: Element } => Boolean(entry.element)) : [];
      const hover = hoverBox.current, boxes = selectBoxes.current;
      if (hover) {
        const over = hovered.current;
        if (!g && over && !picked.some(entry => entry.element === over.element) && over.element.isConnected) place(hover, boxIn(host, over.element.getBoundingClientRect()));
        else hover.hidden = true;
      }
      if (boxes) {
        [...boxes.children].forEach((box, index) => {
          const entry = picked[index];
          const el = box as HTMLElement;
          if (!entry) { el.hidden = true; return; }
          let b = boxIn(host, entry.element.getBoundingClientRect());
          const scale = scaleOf(entry.root);
          // While resizing, the box shows the size being made; while moving a shape, where it goes.
          if (g?.kind === "resize" && g.element === elementAt(roots[0]!, path!) ) {
            const dx = (g.at.x - g.start.x) * scale, dy = (g.at.y - g.start.y) * scale;
            const ax = g.absolute ? 0 : (g.handle.includes("w") ? (g.start.width - g.at.width) * scale : 0);
            const ay = g.absolute ? 0 : (g.handle.includes("n") ? (g.start.height - g.at.height) * scale : 0);
            b = { x: b.x + dx + ax, y: b.y + dy + ay, width: g.at.width * scale, height: g.at.height * scale };
          } else if (g?.kind === "move" && !g.flow && g.at) {
            b = { ...b, x: b.x + (g.at.left - g.start.left) * scale, y: b.y + (g.at.top - g.start.top) * scale };
          }
          place(el, b);
          el.toggleAttribute("data-handles", index === 0 && editable && !(g?.kind === "move" || g?.kind === "space"));
          el.toggleAttribute("data-small", b.width < SMALL_BOX || b.height < SMALL_BOX);
          const tag = el.querySelector<HTMLElement>(".studio-design__tag")!;
          const { target, label } = describe(entry.element, entry.root);
          const name = label ? `${target} · ${label}` : target;
          if (tag.textContent !== name) tag.textContent = name;
          const size = el.querySelector<HTMLElement>(".studio-design__size")!;
          const w = Math.round(b.width / scale), h = Math.round(b.height / scale);
          const said = g?.kind === "space" && index === 0 ? g.words : `${w} × ${h}`;
          if (size.textContent !== said) size.textContent = said;
          size.hidden = index !== 0;
        });
      }
      const line = dropLine.current;
      if (line) { if (g?.kind === "move" && g.flow && g.drop) place(line, boxIn(host, g.drop.line)); else line.hidden = true; }
      const shown = ghost.current;
      if (shown) {
        if (g?.kind === "draw" && Math.hypot(g.cx - g.x, g.cy - g.y) >= DRAG_START) {
          place(shown, boxIn(host, { x: Math.min(g.x, g.cx), y: Math.min(g.y, g.cy), width: Math.abs(g.cx - g.x), height: Math.abs(g.cy - g.y) }));
          shown.toggleAttribute("data-ellipse", g.tool === "ellipse");
        } else shown.hidden = true;
      }
      const zones = spaces.current;
      if (zones) {
        const kids = [...zones.children] as HTMLElement[];
        const shown = editable && (!g || g.kind === "space") && picked[0] ? spacesOf(picked[0].element, scaleOf(picked[0].root), g?.kind === "space" ? g : null) : [];
        kids.forEach((zone, index) => {
          const want = shown[index];
          if (!want) { zone.hidden = true; return; }
          place(zone, boxIn(host, want.box));
          zone.dataset.space = want.space;
          zone.toggleAttribute("data-across", want.across);
          zone.toggleAttribute("data-active", want.active);
          (zone.firstElementChild as HTMLElement).hidden = !want.bar;
        });
      }
      const lines = guides.current;
      if (lines) {
        const wanted = (g?.kind === "move" && !g.flow) || g?.kind === "resize" ? g.guides ?? [] : [];
        [...lines.children].forEach((guide, index) => { const b = wanted[index]; if (b) place(guide as HTMLElement, boxIn(host, b)); else (guide as HTMLElement).hidden = true; });
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [stage, enabled, editable]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!enabled) return null;
  const insert = (item: Insertable) => {
    const { root, element, node, doc } = chosen();
    const design = doc ?? latest.current.editor?.doc;
    if (!design) return;
    // Into the chosen frame, after the chosen thing in its frame, else at the end of the screen's top frame.
    let parent: ElementNode | null = null, index = 0;
    if (node && node.kind === "element" && element && isFrame(element) && !node.inner) { parent = node; index = node.children.length; }
    else if (node) { const at = find(design, node.id); if (at?.parent) { parent = at.parent; index = at.index + 1; } }
    if (!parent) { const top = design.root.find(hasChildren); if (top) { parent = top; index = top.children.length; } }
    if (!parent) return;
    const made = withIds(item.make(), design.next);
    const shape = made.node.kind === "shape";
    const ops: DocOp[] = [{ op: "insert", parent: parent.id, index, node: made.node }];
    const holder = root && pathOfNode(design, root, parent.id);
    if (shape && holder && getComputedStyle(holder).position === "static") ops.push({ op: "patch", node: parent.id, patch: { style: restyle(parent.style, { position: "relative" }) } });
    commit(ops.length === 1 ? ops[0]! : { op: "batch", ops }, { target: item.label.split(",")[0]!, label: made.node.kind === "component" ? (made.node.text ?? "") : "", property: "insert", name: "Added", from: "", to: where(parent, placed(parent.children, made.node, index), made.node.id, true), value: made.node.kind === "component" ? made.node.component : item.id }, made.node.id);
  };
  const groups = [...new Set(INSERTABLE.map(item => item.group))];
  return (
    <>
      <div className="studio-design__select" aria-hidden="true">
        <div ref={hoverBox} className="studio-design__hover" hidden />
        {/* A chosen frame's four paddings, then its gaps; under the selection so its resize handles stay on top. */}
        <div ref={spaces}>
          {Array.from({ length: 4 + MAX_GAPS }, (_, index) => (
            <div key={index} className="studio-design__space" hidden>
              <span className="studio-design__space-bar" onPointerDown={event => startSpace(event.currentTarget, event)} />
            </div>
          ))}
        </div>
        {/* Two: a Light and a Dark copy of the screen side by side are both outlined; the first has the handles. */}
        <div ref={selectBoxes}>
          {[0, 1].map(index => (
            <div key={index} className="studio-design__selected" hidden>
              <span className="studio-design__tag" />
              <span className="studio-design__size" />
              {HANDLES.map(handle => <span key={handle} className="studio-design__handle" data-handle={handle} onPointerDown={event => startResize(handle, event)} />)}
            </div>
          ))}
        </div>
        <div ref={dropLine} className="studio-design__drop" hidden />
        <div ref={ghost} className="studio-design__ghost" hidden />
        <div ref={guides}><div className="studio-design__guide" hidden /><div className="studio-design__guide" hidden /></div>
      </div>
      {editor ? (
        <div className="studio-design__tools">
          <Toolbar variant="surface" size="sm" aria-label="Design tools">
            {TOOLS.map(entry => (
              <ToolButton key={entry.tool} label={entry.label} keys={[entry.key]} icon={entry.icon} pressed={tool === entry.tool} disabled={!editor.doc} onClick={() => setTool(entry.tool)} />
            ))}
            <ToolbarSeparator />
            <Menu aria-label="Insert" align="center" side="top"
              trigger={<Button ref={insertTrigger} variant="ghost" tone="neutral" size="sm" icon={<AddIcon />} disabled={!editor.doc} data-area-toolbar-item="" tabIndex={-1}>Insert</Button>}>
              {groups.map((group, index) => (
                <InsertGroup key={group} first={index === 0} label={group}>
                  {INSERTABLE.filter(item => item.group === group).map(item => <MenuItem key={item.id} onClick={() => insert(item)}>{item.label}</MenuItem>)}
                </InsertGroup>
              ))}
            </Menu>
            <ToolbarSeparator />
            <ToolButton label="Undo" keys={["⌘", "Z"]} icon={<UndoIcon />} disabled={!editor.canUndo} onClick={editor.undo} />
            <ToolButton label="Redo" keys={["⇧", "⌘", "Z"]} icon={<RedoIcon />} disabled={!editor.canRedo} onClick={editor.redo} />
          </Toolbar>
        </div>
      ) : null}
    </>
  );
}

function InsertGroup({ first, label, children }: { first: boolean; label: string; children: ReactNode }) {
  return <>{first ? null : <MenuSeparator />}<MenuLabel>{label}</MenuLabel>{children}</>;
}

/** A tool in the stage's bar: an icon button with its name and key in a tooltip, a toggle when it is a tool. */
function ToolButton({ label, keys, icon, pressed, disabled, onClick }: { label: string; keys: string[]; icon: ReactNode; pressed?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <Tooltip side="top" describes={false} trigger={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={icon} aria-label={label} aria-pressed={pressed} disabled={disabled} onClick={onClick}
        aria-keyshortcuts={keys.join("+").replace("⌘", "Meta").replace("⇧", "Shift")} data-area-toolbar-item="" tabIndex={-1} />
    }>
      {label} <Kbd keys={keys} size="sm" />
    </Tooltip>
  );
}

/** A node's element in the first copy of the screen. */
function pathOfNode(doc: DesignDoc, root: Element, id: string): Element | null {
  const path = docPath(doc, id);
  return path ? elementAt(root, path) : null;
}

export { walk };

/**
 * A chosen frame's spaces on the screen: its four paddings, then the gaps between the children in its flow (a flex
 * frame's). Each with whether its bar shows (deep enough to grab clear of the resize handles) and is being dragged.
 */
function spacesOf(element: Element, scale: number, dragging: Extract<Gesture, { kind: "space" }> | null) {
  const out: Array<{ box: Box; space: string; across: boolean; bar: boolean; active: boolean }> = [];
  if (!(element instanceof HTMLElement) || !isFrame(element)) return out;
  const style = getComputedStyle(element);
  const r = element.getBoundingClientRect();
  const x0 = r.left + element.clientLeft * scale, y0 = r.top + element.clientTop * scale;
  const x1 = x0 + element.clientWidth * scale, y1 = y0 + element.clientHeight * scale;
  const [pt, pr, pb, pl] = SIDES.map(side => (parseFloat(style.getPropertyValue(`padding-${side}`)) || 0) * scale) as [number, number, number, number];
  const active = (side: Side) => dragging?.space.kind === "padding" && dragging.sides.includes(side);
  const pads: Record<Side, Box> = {
    top: { x: x0, y: y0, width: x1 - x0, height: pt },
    bottom: { x: x0, y: y1 - pb, width: x1 - x0, height: pb },
    left: { x: x0, y: y0 + pt, width: pl, height: y1 - pb - y0 - pt },
    right: { x: x1 - pr, y: y0 + pt, width: pr, height: y1 - pb - y0 - pt },
  };
  for (const side of SIDES) {
    const box = pads[side];
    const deep = side === "top" || side === "bottom" ? box.height : box.width;
    out.push({ box, space: side, across: side === "left" || side === "right", bar: deep >= PADDING_BAR || active(side), active: active(side) });
  }
  if (!style.display.includes("flex")) return out;
  const across = style.flexDirection.startsWith("row");
  const kids = [...element.children].filter(child => inFlow(child) && child.getClientRects().length).map(child => child.getBoundingClientRect());
  for (let i = 1; i < kids.length && out.length < 4 + MAX_GAPS; i++) {
    const a = kids[i - 1]!, b = kids[i]!;
    const box = across ? { x: a.right, y: y0 + pt, width: b.left - a.right, height: y1 - pb - y0 - pt } : { x: x0 + pl, y: a.bottom, width: x1 - pr - x0 - pl, height: b.top - a.bottom };
    // A wrapped line's first child isn't after the last one.
    if (box.width < 0 || box.height < 0) continue;
    const wide = across ? box.width : box.height;
    out.push({ box, space: "gap", across, bar: wide >= GAP_BAR || dragging?.space.kind === "gap", active: dragging?.space.kind === "gap" });
  }
  return out;
}
