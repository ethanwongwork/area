// Splitter: two regions side by side or stacked, with a handle between them that resizes them. Spec:
// docs/specs/splitter.md (components audit N6, 2026-11-07). The handle is the WAI window splitter (role="separator",
// focusable, aria-valuenow/min/max, aria-controls the pane it sizes); its paint is shared with Panel's resizable edge.
import { Children, forwardRef, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { splitterVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export type SplitterEvent = PointerEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>;

export interface SplitterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> {
  /** horizontal (default): the two regions side by side, the handle a vertical line between them; vertical: stacked. */
  orientation?: VariantProps<typeof MANIFESTS.splitter>["orientation"];
  /** The two regions, in order. */
  children: ReactNode;
  /** Which region holds the size: the first ("start", default) or the second ("end"); the other takes the rest. */
  side?: "start" | "end";
  /** Controlled size of that region, in px. */
  size?: number;
  /** Its first size, in px, and what a double-click on the handle puts back. Without it the regions start even and a
   *  double-click evens them. */
  defaultSize?: number;
  /** The new size, and the drag, key or double-click that made it. */
  onSizeChange?: (size: number, event: SplitterEvent) => void;
  /** The smallest the sized region gets, in px (default 50), and the least the other keeps. */
  minSize?: number;
  /** The largest the sized region gets, in px; by default all but the other region's minimum. */
  maxSize?: number;
  /** Names the handle: "Resize" by default; name it for the region ("Resize sidebar"). */
  handleLabel?: string;
}

/* spec (docs/specs/splitter.md): Panel's resize steps (8, Shift 32) and the editor's minPanelSize 50. */
const STEP = 8, STEP_LARGE = 32, MIN_SIZE = 50;

/** Two regions with a handle between them: drag it, use the arrow keys, Home and End, or double-click to even them. */
export const Splitter = /* @__PURE__ */ forwardRef<HTMLDivElement, SplitterProps>(function Splitter(
  { orientation = "horizontal", children, side = "start", size, defaultSize, onSizeChange, minSize = MIN_SIZE, maxSize, handleLabel = "Resize", className, style, ...rest },
  ref,
) {
  const [first, second] = Children.toArray(children);
  const id = useId();
  const sizedId = `${id}-${side}`;
  const root = useRef<HTMLDivElement | null>(null);
  const [own, setOwn] = useState<number | null>(defaultSize ?? null);
  const current = size ?? own;
  // The room the two regions share (the root's length less the handle's line), measured once laid out.
  const [room, setRoom] = useState<number | null>(null);
  const horizontal = orientation === "horizontal";
  // Layout lengths, not the bounding box: a preview that scales the Splitter (a gallery tile) must not change its sizes.
  const lengthOf = (node: HTMLElement) => horizontal ? node.offsetWidth : node.offsetHeight;
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    const handle = node.querySelector<HTMLElement>(":scope > .area-splitter__handle");
    const measure = () => {
      const line = handle ? parseFloat(getComputedStyle(handle).getPropertyValue("--_sash-layout")) || 1 : 1;
      // The content box: a border or padding on the root is not room for the regions.
      const box = getComputedStyle(node);
      const sides = horizontal
        ? [box.borderLeftWidth, box.borderRightWidth, box.paddingLeft, box.paddingRight]
        : [box.borderTopWidth, box.borderBottomWidth, box.paddingTop, box.paddingBottom];
      const edges = sides.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
      setRoom(Math.max(0, Math.round(lengthOf(node) - edges - line)));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [horizontal]);
  // Without a size the regions start even; read the sized region's rendered length so the handle has a value.
  useLayoutEffect(() => {
    if (current != null || !root.current) return;
    const pane = root.current.querySelector<HTMLElement>(`:scope > [data-sized]`);
    if (pane) setOwn(Math.round(lengthOf(pane)));
  }, [current, horizontal]);
  const max = Math.max(minSize, Math.min(maxSize ?? Infinity, room == null ? Infinity : room - minSize));
  const clamp = (next: number) => Math.round(Math.min(max, Math.max(minSize, next)));
  const commit = (next: number, event: SplitterEvent) => {
    const bounded = clamp(next);
    if (size === undefined) setOwn(bounded);
    onSizeChange?.(bounded, event);
  };
  // Moving the handle toward the end grows the start region; in RTL a horizontal splitter's start is on the right.
  const grows = () => {
    const rtl = horizontal && root.current ? getComputedStyle(root.current).direction === "rtl" : false;
    return (side === "start") !== rtl ? 1 : -1;
  };
  const drag = useRef<{ at: number; size: number; sign: number } | null>(null);
  const [resizing, setResizing] = useState(false);
  const limit = current == null ? undefined : current <= minSize ? "min" : Number.isFinite(max) && current >= max ? "max" : undefined;
  const even = (event: SplitterEvent) => commit(defaultSize ?? (room == null ? current ?? minSize : room / 2), event);
  const handle = (
    <div role="separator" tabIndex={0} className={splitterVariants.element("handle")} data-side={side} data-limit={limit}
      data-resizing={resizing ? "" : undefined}
      aria-orientation={horizontal ? "vertical" : "horizontal"} aria-controls={sizedId} aria-label={handleLabel}
      aria-valuenow={current ?? undefined} aria-valuemin={minSize} aria-valuemax={Number.isFinite(max) ? max : undefined}
      aria-valuetext={current == null ? undefined : `${current} pixels${limit === "min" ? " (minimum)" : limit === "max" ? " (maximum)" : ""}`}
      onPointerDown={event => {
        if (event.button !== 0 || current == null) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        drag.current = { at: horizontal ? event.clientX : event.clientY, size: current, sign: grows() };
        setResizing(true);
      }}
      onPointerMove={event => {
        const state = drag.current;
        if (!state) return;
        commit(state.size + ((horizontal ? event.clientX : event.clientY) - state.at) * state.sign, event);
      }}
      onPointerUp={() => { drag.current = null; setResizing(false); }}
      onPointerCancel={event => { const state = drag.current; drag.current = null; setResizing(false); if (state) commit(state.size, event); }}
      onDoubleClick={even}
      onKeyDown={event => {
        if (event.key === "Escape" && drag.current) {
          event.preventDefault(); const state = drag.current; drag.current = null; setResizing(false); commit(state.size, event); return;
        }
        if (current == null) return;
        const step = event.shiftKey ? STEP_LARGE : STEP;
        const back = horizontal ? "ArrowLeft" : "ArrowUp", forth = horizontal ? "ArrowRight" : "ArrowDown";
        if (event.key === back || event.key === forth) {
          event.preventDefault();
          commit(current + (event.key === forth ? 1 : -1) * step * grows(), event);
        } else if (event.key === "Home") { event.preventDefault(); commit(minSize, event); }
        else if (event.key === "End" && Number.isFinite(max)) { event.preventDefault(); commit(max, event); }
        else if (event.key === "Enter") { event.preventDefault(); even(event); }
      }} />
  );
  const pane = (which: "start" | "end", content: ReactNode) => {
    const sized = which === side;
    return <div className={splitterVariants.element("pane")} id={sized ? sizedId : undefined} data-sized={sized ? "" : undefined}
      style={sized && current != null ? { "--area-splitter-size": `${current}px` } as CSSProperties : undefined}>{content}</div>;
  };
  return (
    <div ref={node => { root.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
      {...rest} style={style} className={splitterVariants({ orientation }, className)} data-resizing={resizing ? "" : undefined}>
      {pane("start", first)}
      {handle}
      {pane("end", second)}
    </div>
  );
});

export { splitterVariants };
