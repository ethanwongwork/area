"use client";

import { Children, forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { AnchorHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode, Ref, RefAttributes } from "react";
import { badgeVariants, badgeAnchorVariants, badgeGroupVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Popover } from "./primitives.tsx";

type Options = VariantProps<typeof MANIFESTS.badge> & { icon?: ReactNode; trailingIcon?: ReactNode };
type SpanProps = Options & HTMLAttributes<HTMLSpanElement> & { as?: "span" };
type LinkProps = Options & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };
export type BadgeProps = SpanProps | LinkProps;
/** Static metadata or a native link. Icon/dot-only forms require an accessible name. */
export const Badge = forwardRef<HTMLSpanElement | HTMLAnchorElement, BadgeProps>(function Badge(
  { as = "span", tone, variant, size, pill, dot, dotOnly, iconOnly, truncate, uppercase, icon, trailingIcon, className, children, title, ...rest }, ref,
) {
  if ((iconOnly || dotOnly) && !rest["aria-label"] && !rest["aria-labelledby"] && !rest["aria-hidden"]) {
    throw new Error("Badge: iconOnly and dotOnly require aria-label or aria-labelledby (or aria-hidden when decorative).");
  }
  if (truncate && children != null && typeof children !== "string" && typeof children !== "number" && !title) {
    throw new Error("Badge: truncated rich content requires a full-text title.");
  }
  const props = {
    ...rest,
    className: badgeVariants({ tone, variant, size, pill, dot, dotOnly, iconOnly, truncate, uppercase }, className),
    title: title ?? (truncate && (typeof children === "string" || typeof children === "number") ? String(children) : undefined),
    role: rest.role ?? ((iconOnly || dotOnly) && as === "span" ? "img" : undefined),
    children: <>
      {dot || dotOnly ? <span className="area-badge__dot" aria-hidden="true" /> : null}
      {icon && !dotOnly ? <span className="area-badge__leading-icon" aria-hidden="true">{icon}</span> : null}
      {!iconOnly && !dotOnly && children != null ? <span className="area-badge__label">{children}</span> : null}
      {trailingIcon && !dotOnly && !iconOnly ? <span className="area-badge__trailing-icon" aria-hidden="true">{trailingIcon}</span> : null}
    </>,
  };
  return as === "a" ? <a {...props as AnchorHTMLAttributes<HTMLAnchorElement>} ref={ref as Ref<HTMLAnchorElement>} /> : <span {...props as HTMLAttributes<HTMLSpanElement>} ref={ref as Ref<HTMLSpanElement>} />;
}) as {
  (props: LinkProps & RefAttributes<HTMLAnchorElement>): ReactNode;
  (props: SpanProps & RefAttributes<HTMLSpanElement>): ReactNode;
};

export interface BadgeAnchorProps extends HTMLAttributes<HTMLSpanElement> {
  badge: ReactNode;
  placement?: VariantProps<typeof MANIFESTS.badgeAnchor>["placement"];
  overlap?: "rectangular" | "circular";
  /** Positive CSS length moves the badge inward. Prefer an Area token expression. */
  offset?: string;
  invisible?: boolean;
}
/** The owner supplies the status in its accessible name; the overlay is decorative. */
export const BadgeAnchor = forwardRef<HTMLSpanElement, BadgeAnchorProps>(function BadgeAnchor(
  { badge, placement, overlap = "rectangular", offset, invisible, children, className, style, ...rest }, ref,
) {
  return <span {...rest} ref={ref} className={badgeAnchorVariants({ placement, overlap: `overlap-${overlap}` }, className)} style={{ ...style, ...(offset ? { "--area-badge-anchor-offset": offset } : {}) } as CSSProperties} data-invisible={invisible ? "" : undefined}>
    {children}<span className="area-badge-anchor__badge" aria-hidden="true" inert>{badge}</span>
  </span>;
});

export interface BadgeGroupProps extends HTMLAttributes<HTMLDivElement> {
  overflow?: "inline" | "overlay";
  /** Omit to wrap every badge. Auto fits one line and reserves the overflow trigger. */
  visibleCount?: "auto" | number;
  overflowLabel?: string;
}
/** Native auto-popover supplies Escape, light dismissal and focus restoration. */
export const BadgeGroup = forwardRef<HTMLDivElement, BadgeGroupProps>(function BadgeGroup(
  { overflow = "inline", visibleCount, overflowLabel = "More statuses", children, className, ...rest }, ref,
) {
  if (typeof visibleCount === "number" && (!Number.isFinite(visibleCount) || visibleCount < 0)) throw new RangeError("BadgeGroup: visibleCount must be a nonnegative finite number or auto.");
  const items = Children.toArray(children);
  const root = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [fitted, setFitted] = useState(items.length);
  useImperativeHandle(ref, () => root.current!, []);
  const count = visibleCount === "auto" ? Math.min(fitted, items.length) : visibleCount === undefined ? items.length : Math.max(0, Math.min(items.length, Math.floor(visibleCount)));
  const hidden = items.length - count;
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
      probe.querySelector(".area-button__label")!.textContent = `+${items.length}`;
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
  return <div {...rest} ref={root} className={badgeGroupVariants({ overflow }, className)}>
    {items.slice(0, count).map((item, index) => <span className="area-badge-group__item" key={index}>{item}</span>)}
    <Button ref={trigger} size="sm" variant="ghost" className="area-badge-group__overflow-trigger" popoverTarget={id} hidden={!hidden} aria-label={`${overflowLabel}, ${hidden} more`}>+{hidden || items.length}</Button>
    <Popover ref={popup} id={id} popover="auto" role="group" tabIndex={-1} autoFocus className={cx("area-badge-group__overflow-content")} aria-label={overflowLabel}>
      {items.slice(count).map((item, index) => <span className="area-badge-group__item" key={count + index}>{item}</span>)}
    </Popover>
  </div>;
});
