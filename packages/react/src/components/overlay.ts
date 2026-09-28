/**
 * Overlay behaviour shared by Popover, Menu and Tooltip.
 *
 * The platform does most of the work: the native Popover API puts the surface in the top
 * layer, and `popover="auto"` adds light dismiss (outside press, Escape) and closes other
 * auto popovers. What the platform does not yet give every browser is anchoring that also
 * reports *which* side the surface ended up on, so positioning is a small pure function
 * (`computePosition`) plus a hook that re-runs it while the overlay is open. The side it
 * returns drives the arrow and the motion's origin.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export type OverlaySide = "top" | "right" | "bottom" | "left";
export type OverlayAlign = "start" | "center" | "end";

export interface PositionOptions {
  side: OverlaySide;
  align: OverlayAlign;
  /** Gap between the trigger and the surface. */
  offset: number;
  /** Space kept between the surface and the viewport edge. */
  padding: number;
  /** The box to place against, when it is not the trigger's own box (a menu that clears the
   * toolbar its trigger sits in). Defaults to the trigger's bounding box. */
  anchorRect?: (trigger: HTMLElement) => Rect;
}

export interface Rect { x: number; y: number; width: number; height: number }

export interface Position {
  x: number;
  y: number;
  side: OverlaySide;
  align: OverlayAlign;
  /** Height left between the trigger and the viewport edge on the chosen side. */
  availableHeight: number;
  /** The anchor point on the surface, for the motion's transform origin. */
  originX: number;
  originY: number;
}

const OPPOSITE: Record<OverlaySide, OverlaySide> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/**
 * Places `floating` beside `anchor` inside `viewport`. The preferred side flips to the
 * opposite one when it does not fit and the opposite fits better; the surface then shifts
 * along its edge to stay `padding` inside the viewport. Coordinates are viewport-relative,
 * for a `position: fixed` surface. Right-to-left callers mirror `align` before calling.
 */
export function computePosition(anchor: Rect, floating: { width: number; height: number }, viewport: { width: number; height: number }, options: PositionOptions): Position {
  const { offset, padding } = options;
  const room = (side: OverlaySide) =>
    side === "top" ? anchor.y - offset - padding
    : side === "bottom" ? viewport.height - (anchor.y + anchor.height) - offset - padding
    : side === "left" ? anchor.x - offset - padding
    : viewport.width - (anchor.x + anchor.width) - offset - padding;
  const need = (side: OverlaySide) => (side === "top" || side === "bottom" ? floating.height : floating.width);

  let side = options.side;
  if (room(side) < need(side) && room(OPPOSITE[side]) > room(side)) side = OPPOSITE[side];
  const vertical = side === "top" || side === "bottom";

  // Main axis.
  let x = 0, y = 0;
  if (side === "top") y = anchor.y - offset - floating.height;
  else if (side === "bottom") y = anchor.y + anchor.height + offset;
  else if (side === "left") x = anchor.x - offset - floating.width;
  else x = anchor.x + anchor.width + offset;

  // Cross axis: align, then shift inside the viewport.
  const clamp = (value: number, size: number, limit: number) => Math.min(Math.max(value, padding), Math.max(padding, limit - padding - size));
  // An edge-aligned surface that would leave the viewport flips to the anchor's other edge
  // before it shifts, so it keeps sharing an edge with its anchor (a menu under a button near
  // the start of the page starts at the button instead of floating at the viewport padding).
  const place = (start: number, end: number, center: number, size: number, limit: number) => {
    const fits = (value: number) => value >= padding && value + size <= limit - padding;
    let value = options.align === "start" ? start : options.align === "end" ? end : center;
    if (options.align !== "center" && !fits(value)) {
      const other = options.align === "start" ? end : start;
      if (fits(other)) value = other;
    }
    return clamp(value, size, limit);
  };
  if (vertical) {
    x = place(anchor.x, anchor.x + anchor.width - floating.width, anchor.x + (anchor.width - floating.width) / 2, floating.width, viewport.width);
  } else {
    y = place(anchor.y, anchor.y + anchor.height - floating.height, anchor.y + (anchor.height - floating.height) / 2, floating.height, viewport.height);
  }

  const availableHeight = vertical ? Math.max(0, room(side)) : Math.max(0, viewport.height - 2 * padding);
  const originX = vertical ? Math.min(Math.max(anchor.x + anchor.width / 2 - x, 0), floating.width) : side === "right" ? 0 : floating.width;
  const originY = vertical ? (side === "bottom" ? 0 : floating.height) : Math.min(Math.max(anchor.y + anchor.height / 2 - y, 0), floating.height);
  return { x: Math.round(x), y: Math.round(y), side, align: options.align, availableHeight: Math.floor(availableHeight), originX: Math.round(originX), originY: Math.round(originY) };
}

/** Controlled or uncontrolled open state. */
export function useOpenState(open: boolean | undefined, defaultOpen: boolean | undefined, onOpenChange: ((open: boolean) => void) | undefined) {
  const [local, setLocal] = useState(defaultOpen ?? false);
  const value = open ?? local;
  const set = useCallback((next: boolean) => {
    if (open === undefined) setLocal(next);
    onOpenChange?.(next);
  }, [open, onOpenChange]);
  return [value, set] as const;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Keeps a native popover in step with `open`, and reports light dismiss (outside press,
 * Escape) back through `onOpenChange`. Returns focus to the trigger when the surface closes
 * with focus inside it, or with nothing focused.
 */
export function useNativePopover(surface: RefObject<HTMLElement | null>, trigger: RefObject<HTMLElement | null>, open: boolean, setOpen: (open: boolean) => void) {
  useIsoLayoutEffect(() => {
    const node = surface.current;
    if (!node || typeof node.showPopover !== "function") return;
    const shown = node.matches(":popover-open");
    if (open && !shown) node.showPopover();
    if (!open && shown) node.hidePopover();
  }, [open]);
  useEffect(() => {
    const node = surface.current;
    if (!node) return;
    const onToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState === "open";
      if (!next) {
        const active = document.activeElement;
        if (!active || active === document.body || node.contains(active)) trigger.current?.focus({ preventScroll: true });
      }
      if (next !== open) setOpen(next);
    };
    node.addEventListener("toggle", onToggle);
    return () => node.removeEventListener("toggle", onToggle);
  }, [open, setOpen]);
}

/**
 * Positions `surface` against `trigger` while open, and again on scroll, resize and when
 * either element changes size. Writes `left`/`top`, `data-side`, the available height and
 * the transform origin; the stylesheet does the rest.
 */
export function useAnchoredPosition(trigger: RefObject<HTMLElement | null>, surface: RefObject<HTMLElement | null>, open: boolean, options: PositionOptions) {
  const frame = useRef(0);
  const { side, align, offset, padding, anchorRect } = options;
  useIsoLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = trigger.current, node = surface.current;
      if (!anchor || !node) return;
      const rtl = getComputedStyle(anchor).direction === "rtl";
      const mirrored = rtl && align !== "center" ? (align === "start" ? "end" : "start") : align;
      const box = anchorRect ? anchorRect(anchor) : anchor.getBoundingClientRect();
      const position = computePosition(box, { width: node.offsetWidth, height: node.offsetHeight }, { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }, { side, align: mirrored, offset, padding });
      node.style.setProperty("left", `${position.x}px`);
      node.style.setProperty("top", `${position.y}px`);
      node.style.setProperty("--area-overlay-available-height", `${position.availableHeight}px`);
      node.style.setProperty("--area-overlay-anchor-width", `${Math.round(box.width)}px`);
      node.style.setProperty("transform-origin", `${position.originX}px ${position.originY}px`);
      node.dataset.side = position.side;
    };
    const schedule = () => { cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(place); };
    place();
    addEventListener("scroll", schedule, true);
    addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    if (trigger.current) observer?.observe(trigger.current);
    if (surface.current) observer?.observe(surface.current);
    return () => {
      cancelAnimationFrame(frame.current);
      removeEventListener("scroll", schedule, true);
      removeEventListener("resize", schedule);
      observer?.disconnect();
    };
  }, [open, side, align, offset, padding]);
}

/** Merges a forwarded ref with a local one. */
export function assignRef<T>(ref: ((value: T | null) => void) | { current: T | null } | null | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

/**
 * Brings an option into view inside its own scrolling list. Unlike `scrollIntoView`, it never
 * scrolls the page or any other ancestor, so a list that mounts with an active option (an
 * inline palette, an open combobox) does not jump the document to it.
 */
export function scrollOptionIntoList(list: HTMLElement | null | undefined, option: HTMLElement | null | undefined) {
  if (!list || !option) return;
  const box = list.getBoundingClientRect(), item = option.getBoundingClientRect();
  if (item.top < box.top) list.scrollTop -= box.top - item.top;
  else if (item.bottom > box.bottom) list.scrollTop += item.bottom - box.bottom;
}
