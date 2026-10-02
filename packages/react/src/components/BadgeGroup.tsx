"use client";
import { Children, forwardRef, isValidElement, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { badgeGroupVariants, badgeVariants, cx } from "../variants.ts";
import { Popover } from "./primitives.tsx";
import { OVERLAY_PADDING, POPOVER_OFFSET } from "./Overlays.tsx";
import { useAnchoredPosition } from "./overlay.ts";
export interface BadgeGroupProps extends HTMLAttributes<HTMLDivElement> {
  overflow?: "inline" | "overlay";
  /** Omit to wrap every badge. Auto fits one line and reserves the overflow trigger. */
  visibleCount?: "auto" | number;
  overflowLabel?: string;
}
/** Native auto-popover supplies Escape, light dismissal and focus restoration. */
export const BadgeGroup = forwardRef<HTMLDivElement, BadgeGroupProps>(function BadgeGroup(
  { overflow = "inline", visibleCount, overflowLabel = "More statuses", children, className, style, ...rest }, ref,
) {
  if (typeof visibleCount === "number" && (!Number.isFinite(visibleCount) || visibleCount < 0)) throw new RangeError("BadgeGroup: visibleCount must be a nonnegative finite number or auto.");
  const items = Children.toArray(children);
  const root = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [fitted, setFitted] = useState(items.length);
  const [open, setOpen] = useState(false);
  // The browser opens it (popovertarget); the shared engine places it (audit S16): 8 under the
  // "+n" badge as every popover, starting at its start edge, flipping and shifting on screen.
  useEffect(() => {
    const panel = popup.current;
    if (!panel) return;
    const onToggle = (event: Event) => setOpen((event as ToggleEvent).newState === "open");
    panel.addEventListener("toggle", onToggle);
    return () => panel.removeEventListener("toggle", onToggle);
  }, []);
  useAnchoredPosition(trigger, popup, open, { side: "bottom", align: "start", offset: POPOVER_OFFSET, padding: OVERLAY_PADDING });
  useImperativeHandle(ref, () => root.current!, []);
  const count = visibleCount === "auto" ? Math.min(fitted, items.length) : visibleCount === undefined ? items.length : Math.max(0, Math.min(items.length, Math.floor(visibleCount)));
  const hidden = items.length - count;
  // The overflow is a badge of the group's own size (as AvatarGroup's overflow is an avatar).
  const size = items.map(item => isValidElement<{ size?: "sm" | "md" | "lg" }>(item) ? item.props.size : undefined).find(Boolean);
  useEffect(() => {
    if (visibleCount !== "auto" || !root.current || !popup.current) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const host = root.current!;
      const panel = popup.current!;
      // Measure the actual items while the closed popover is invisible. No cloned IDs,
      // duplicate links, or guessed character widths; styles are restored synchronously.
      const saved = panel.style.cssText;
      panel.style.cssText = "display:flex;position:fixed;visibility:hidden;inline-size:max-content;max-inline-size:none";
      const widths = Array.from(host.querySelectorAll<HTMLElement>(".area-badge-group__item")).map(el => el.getBoundingClientRect().width);
      panel.style.cssText = saved;
      const gap = parseFloat(getComputedStyle(host).columnGap) || 0;
      const available = host.clientWidth;
      if (widths.reduce((a, b) => a + b, 0) + gap * Math.max(0, widths.length - 1) <= available) { setFitted(items.length); return; }
      const probe = trigger.current!.cloneNode(true) as HTMLButtonElement;
      probe.hidden = false;
      probe.inert = true;
      probe.removeAttribute("id");
      probe.removeAttribute("popovertarget");
      probe.style.cssText = "display:inline-flex;position:fixed;visibility:hidden";
      probe.querySelector(".area-badge__label")!.textContent = `+${items.length}`;
      host.append(probe);
      const reserve = probe.getBoundingClientRect().width + gap;
      probe.remove();
      let used = reserve, next = 0;
      for (const width of widths) { if (used + width > available) break; used += width + gap; next++; }
      setFitted(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root.current);
    for (const item of root.current.querySelectorAll(".area-badge-group__item")) observer.observe(item);
    document.fonts?.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); };
  }, [visibleCount, children, count, items.length]);
  useEffect(() => {
    if (!hidden && popup.current?.matches(":popover-open")) popup.current.hidePopover();
  }, [hidden]);
  return <div {...rest} ref={root} className={badgeGroupVariants({ overflow }, className)} style={style}>
    {items.slice(0, count).map((item, index) => <span className="area-badge-group__item" key={index}>{item}</span>)}
    <button ref={trigger} type="button" className={badgeVariants({ size }, "area-badge-group__overflow-trigger")} popoverTarget={id} hidden={!hidden} aria-label={`${overflowLabel}, ${hidden} more`}><span className="area-badge__label">+{hidden || items.length}</span></button>
    <Popover ref={popup} id={id} popover="auto" role="group" tabIndex={-1} autoFocus className={cx("area-badge-group__overflow-content")} aria-label={overflowLabel}>
      {items.slice(count).map((item, index) => <span className="area-badge-group__item" key={count + index}>{item}</span>)}
    </Popover>
  </div>;
});
