/**
 * Choosing an element on the stage (the design interface; src/design-edit.ts): hovering outlines the component or frame
 * under the pointer, a click selects it (Figma's way: the design's own controls don't act while it is edited), and the
 * selection is outlined with its name over it. Escape clears it. A plain scroll still scrolls the page, and Space or the
 * middle button still pans (design-viewer.tsx): a click while Space is held is the pan's, not a selection.
 *
 * The outlines are drawn over the stage, not in the design, so they stay one pixel at any zoom; they follow the design
 * every frame while something is hovered or selected (a zoom, a pan, the page's scroll).
 */
import { useEffect, useRef, type RefObject } from "react";
import { describe, elementAt, pathOf, screensIn, targetOf } from "./design-edit.ts";

export interface StageSelectionProps {
  /** The stage: its screens are found in it, and the outlines are drawn over it. */
  stage: RefObject<HTMLElement | null>;
  /** Whether the design can be edited (a screen layer; an image has nothing to select). */
  enabled: boolean;
  selected: readonly number[] | null;
  onSelect: (path: number[] | null) => void;
}

const contentOf = (node: EventTarget | null) => node instanceof Element ? node.closest(".studio-viewer__content") : null;
const panning = (node: Element) => Boolean(node.closest(".studio-viewer")?.hasAttribute("data-panning"));

export function StageSelection({ stage, enabled, selected, onSelect }: StageSelectionProps) {
  const hoverBox = useRef<HTMLDivElement>(null);
  const selectBoxes = useRef<HTMLDivElement>(null);
  const hovered = useRef<{ root: Element; element: Element } | null>(null);
  const latest = useRef({ selected, onSelect });
  latest.current = { selected, onSelect };

  // The pointer: hover, and a click that selects instead of acting.
  useEffect(() => {
    const host = stage.current;
    if (!host || !enabled) return;
    const move = (event: PointerEvent) => {
      const root = contentOf(event.target);
      const element = root && !panning(root) ? targetOf(event.target as Element, root) : null;
      hovered.current = root && element ? { root, element } : null;
    };
    const leave = () => { hovered.current = null; };
    // The design's own controls don't take a press or a click while it is edited (a button would act, a field focus).
    const swallow = (event: Event) => {
      const root = contentOf(event.target);
      if (!root || panning(root) || (event as MouseEvent).button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const click = (event: MouseEvent) => {
      const root = contentOf(event.target);
      if (!root || panning(root) || event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const element = targetOf(event.target as Element, root);
      latest.current.onSelect(element ? pathOf(element, root) : null);
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    for (const type of ["pointerdown", "mousedown", "mouseup", "dblclick"]) host.addEventListener(type, swallow, true);
    host.addEventListener("click", click, true);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      for (const type of ["pointerdown", "mousedown", "mouseup", "dblclick"]) host.removeEventListener(type, swallow, true);
      host.removeEventListener("click", click, true);
      hovered.current = null;
    };
  }, [stage, enabled]);

  // Escape clears the selection (not while typing, and not when a dialog or menu is open: those close first).
  useEffect(() => {
    if (!enabled) return;
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || !latest.current.selected) return;
      if ((event.target as Element | null)?.closest?.("input, textarea, select, [contenteditable]") || document.querySelector(":popover-open, dialog[open]")) return;
      latest.current.onSelect(null);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [enabled]);

  // The outlines, every frame while there is something to outline.
  useEffect(() => {
    const host = stage.current;
    if (!host || !enabled) return;
    let frame = 0;
    const place = (box: HTMLElement, element: Element) => {
      const at = element.getBoundingClientRect(), from = host.getBoundingClientRect();
      box.hidden = false;
      box.style.transform = `translate(${Math.round(at.left - from.left)}px, ${Math.round(at.top - from.top)}px)`;
      box.style.width = `${Math.round(at.width)}px`;
      box.style.height = `${Math.round(at.height)}px`;
    };
    const draw = () => {
      const hover = hoverBox.current, boxes = selectBoxes.current;
      const path = latest.current.selected;
      const chosen = path ? screensIn(host).map(root => ({ root, element: elementAt(root, path) })).filter((entry): entry is { root: Element; element: Element } => Boolean(entry.element)) : [];
      if (hover) {
        const over = hovered.current;
        if (over && !chosen.some(entry => entry.element === over.element) && over.root.isConnected && over.element.isConnected) place(hover, over.element);
        else hover.hidden = true;
      }
      if (boxes) {
        [...boxes.children].forEach((box, index) => {
          const entry = chosen[index];
          if (!entry) { (box as HTMLElement).hidden = true; return; }
          place(box as HTMLElement, entry.element);
          const tag = box.firstElementChild as HTMLElement;
          const { target, label } = describe(entry.element, entry.root);
          const name = label ? `${target} · ${label}` : target;
          if (tag.textContent !== name) tag.textContent = name;
        });
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [stage, enabled]);

  if (!enabled) return null;
  return (
    <div className="studio-design__select" aria-hidden="true">
      <div ref={hoverBox} className="studio-design__hover" hidden />
      {/* Two: a Light and a Dark copy of the screen side by side are both outlined. */}
      <div ref={selectBoxes}>
        <div className="studio-design__selected" hidden><span className="studio-design__tag" /></div>
        <div className="studio-design__selected" hidden><span className="studio-design__tag" /></div>
      </div>
    </div>
  );
}
