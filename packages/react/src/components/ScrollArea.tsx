// ScrollArea: a native scroller with its platform bar hidden and a thin overlay bar drawn over the
// content edge. Spec: docs/specs/scroll-area.md.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import type { HTMLAttributes, PointerEvent as ReactPointerEvent, Ref } from "react";
import { scrollAreaVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type ScrollAreaVariants = VariantProps<typeof MANIFESTS.scrollArea>;
type Axis = "vertical" | "horizontal";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** When the bar shows: `hover` while the pointer is over the region or it scrolls; `scroll` only while it scrolls; `always`. */
  type?: ScrollAreaVariants["type"];
  /** How long the bar stays after scrolling stops, in milliseconds (Radix's 600). */
  scrollHideDelay?: number;
  /** The native scroller, for scrolling it from code. */
  viewportRef?: Ref<HTMLDivElement>;
  /** Props for the scroller: an accessible name for a region of its own, or a tabIndex of -1 when its content has its own Tab stops. */
  viewportProps?: HTMLAttributes<HTMLDivElement>;
}

/** The shortest thumb, so a long list keeps something to grab (Radix's 18). */
const MIN_THUMB = 18;

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { type, scrollHideDelay = 600, viewportRef, viewportProps, className, children, ...rest },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const bars = useRef<Record<Axis, HTMLDivElement | null>>({ vertical: null, horizontal: null });
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useImperativeHandle(ref, () => rootRef.current!);
  useImperativeHandle(viewportRef, () => viewport.current!);

  // The thumb's length and offset along a bar, in whole pixels so it never lands between them.
  const metrics = useCallback((axis: Axis) => {
    const vp = viewport.current!, bar = bars.current[axis]!;
    const vertical = axis === "vertical";
    const client = vertical ? vp.clientHeight : vp.clientWidth;
    const total = vertical ? vp.scrollHeight : vp.scrollWidth;
    const position = Math.abs(vertical ? vp.scrollTop : vp.scrollLeft);
    const style = getComputedStyle(bar);
    const track = (vertical ? bar.clientHeight : bar.clientWidth)
      - Number.parseFloat(vertical ? style.paddingTop : style.paddingLeft) - Number.parseFloat(vertical ? style.paddingBottom : style.paddingRight);
    const size = Math.min(track, Math.max(MIN_THUMB, Math.round(track * client / total)));
    const range = total - client;
    const offset = range > 0 ? Math.round(position / range * (track - size)) : 0;
    return { client, total, track, size, offset, range };
  }, []);

  const update = useCallback(() => {
    const root = rootRef.current, vp = viewport.current;
    if (!root || !vp) return;
    // A pixel of rounding is not overflow.
    root.toggleAttribute("data-overflow-y", vp.scrollHeight > vp.clientHeight + 1);
    root.toggleAttribute("data-overflow-x", vp.scrollWidth > vp.clientWidth + 1);
    for (const axis of ["vertical", "horizontal"] as const) {
      const bar = bars.current[axis];
      if (!bar || getComputedStyle(bar).display === "none") continue;
      const { size, offset } = metrics(axis);
      const thumb = bar.firstElementChild as HTMLElement;
      thumb.style.setProperty("--_thumb-size", `${size}px`);
      thumb.style.setProperty("--_thumb-offset", `${offset}px`);
    }
  }, [metrics]);

  useEffect(() => {
    const vp = viewport.current!;
    update();
    const onScroll = () => {
      update();
      const root = rootRef.current!;
      root.setAttribute("data-scrolling", "");
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => root.removeAttribute("data-scrolling"), scrollHideDelay);
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(vp);
    if (content.current) observer.observe(content.current);
    return () => { vp.removeEventListener("scroll", onScroll); observer.disconnect(); clearTimeout(hideTimer.current); };
  }, [update, scrollHideDelay]);

  // Pressing the track moves the thumb's middle to the pointer (Radix, Base UI); then, as on the thumb,
  // dragging scrolls by the pointer's travel scaled from the track to the content.
  const onPointerDown = (axis: Axis) => (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const vp = viewport.current!, bar = event.currentTarget;
    const vertical = axis === "vertical";
    const rtl = !vertical && getComputedStyle(vp).direction === "rtl";
    const { track, size, range } = metrics(axis);
    const scale = track > size ? range / (track - size) : 0;
    // Pointer coordinates are in viewport pixels; under CSS zoom (the gallery's fitted tiles) the track is
    // not, so travel is divided by the bar's zoom, as overlay.ts places anchored surfaces.
    const zoom = (bar as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? 1;
    const coordinate = (e: { clientX: number; clientY: number }) => (vertical ? e.clientY : e.clientX) / zoom;
    const setScroll = (value: number) => {
      const clamped = Math.min(range, Math.max(0, value));
      if (vertical) vp.scrollTop = clamped; else vp.scrollLeft = rtl ? -clamped : clamped;
    };
    const thumb = bar.firstElementChild as HTMLElement;
    if (event.target !== thumb) {
      const rect = bar.getBoundingClientRect(), padding = Number.parseFloat(getComputedStyle(bar).paddingTop);
      const along = rtl ? (rect.right - event.clientX) / zoom - padding : coordinate(event) - (vertical ? rect.top : rect.left) / zoom - padding;
      setScroll((along - size / 2) * scale);
    }
    event.preventDefault();
    bar.setPointerCapture(event.pointerId);
    bar.setAttribute("data-dragging", "");
    const start = coordinate(event), from = Math.abs(vertical ? vp.scrollTop : vp.scrollLeft);
    const move = (e: PointerEvent) => setScroll(from + (coordinate(e) - start) * (rtl ? -1 : 1) * scale);
    const end = () => {
      bar.removeAttribute("data-dragging");
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", end);
      bar.removeEventListener("pointercancel", end);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", end);
    bar.addEventListener("pointercancel", end);
  };

  return (
    <div ref={rootRef} className={scrollAreaVariants({ type }, className)} {...rest}>
      <div tabIndex={0} {...viewportProps} ref={viewport} className={scrollAreaVariants.element("viewport") + (viewportProps?.className ? ` ${viewportProps.className}` : "")}>
        <div ref={content} className={scrollAreaVariants.element("content")}>{children}</div>
      </div>
      {(["vertical", "horizontal"] as const).map(axis => (
        // The bars repeat what the scroller already exposes, so assistive tech skips them.
        <div key={axis} ref={el => { bars.current[axis] = el; }} className={scrollAreaVariants.element("scrollbar")} data-orientation={axis} aria-hidden="true" onPointerDown={onPointerDown(axis)}>
          <div className={scrollAreaVariants.element("thumb")} />
        </div>
      ))}
    </div>
  );
});
