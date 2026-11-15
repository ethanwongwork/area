// Adapted from Mantine Indicator (MIT). Source mapping: docs/specs/indicator.md.
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { indicatorVariants, indicatorAnchorVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Presence, type PresenceProps } from "./Presence.tsx";
import { formatCount, normalizeCount } from "./count-format.ts";
export interface IndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** The number it shows; without one it is a dot. */
  count?: number;
  /** The largest number shown; a larger count reads as "99+". */
  max?: number;
  /** Shows a count of 0; when false, a zero count renders nothing. */
  showZero?: boolean;
  /** Renders nothing, as Indicator anchor's `invisible` hides its mark. */
  invisible?: boolean;
  /** @deprecated Use `invisible`. Kept for one release. */
  hidden?: boolean;
  /** @deprecated Use `invisible`. */
  disabled?: boolean;
  /** The accessible name, or a function of the count, as Count's `label`; defaults to English. */
  label?: string | ((count: number) => string);
  /** A pulse spreads from the mark: something is in progress. */
  processing?: boolean;
  /** A ring in the ground's color round the mark, where it overlaps its owner. */
  bordered?: boolean;
  /** @deprecated Use `bordered`, which wins. Kept for one release. */
  withBorder?: boolean;
  /** The mark's color: `danger` by default. */
  tone?: VariantProps<typeof MANIFESTS.indicator>["tone"];
  /** Availability is a status variant within the Indicator family. */
  status?: PresenceProps["status"] | "online";
  /** With `status`, the presence mark's size, as Presence's. */
  size?: PresenceProps["size"];
  /** With `status`, marks the person as out of office, as Presence's. */
  outOfOffice?: boolean;
}
export const Indicator = forwardRef<HTMLSpanElement, IndicatorProps>(function Indicator(
  {count, max = 99, showZero = true, invisible, hidden, disabled = false, label, processing = false, bordered, withBorder = false, tone, status, size, outOfOffice, className, ...rest}, ref,
) {
  const number = count === undefined ? undefined : normalizeCount(count);
  const border = bordered ?? withBorder;
  if ((invisible ?? hidden) || disabled || (!showZero && number === 0)) return null;
  const text = number === undefined ? undefined : formatCount(number, max);
  if (status && number === undefined) return <Presence ref={ref} status={status === "online" ? "available" : status} size={size} outOfOffice={outOfOffice} className={className} {...rest} />;
  return <span ref={ref} role="img" aria-label={typeof label === "function" ? label(number ?? 0) : label ?? (number === undefined ? (processing ? "Processing" : "New activity") : `${number} notifications`)} {...rest}
    className={indicatorVariants({kind: number === undefined ? "dot" : "count", tone}, className)}
    data-processing={processing || undefined} data-border={border || undefined} data-single={text?.length === 1 ? "" : undefined}>
    {text}
  </span>;
});
export interface IndicatorAnchorProps extends HTMLAttributes<HTMLSpanElement> {
  /** The mark to attach: an Indicator, a Count or a Presence. */
  indicator: ReactNode;
  /** The owner's corner the mark sits on: `top-end` (default), `top-start`, `bottom-end` or `bottom-start`. */
  placement?: VariantProps<typeof MANIFESTS.indicatorAnchor>["placement"];
  /**
   * The owner's shape: `rectangular` (default) puts the mark on the box's corner; `circular` on a round owner's edge,
   * such as an Avatar's.
   */
  overlap?: VariantProps<typeof MANIFESTS.indicatorAnchor>["overlap"];
  /** Positive CSS length moves the badge inward. Prefer an Area token expression. */
  offset?: string;
  /** Hides the mark and keeps the owner. */
  invisible?: boolean;
  /** Insets rectangular count and presence marks by 4px; by default they center on the owner's corner. */
  inset?: boolean;
}
/** The owner supplies the status in its accessible name; the overlay is decorative. */
export const IndicatorAnchor = forwardRef<HTMLSpanElement, IndicatorAnchorProps>(function IndicatorAnchor(
  { indicator, placement, overlap = "rectangular", offset, invisible, inset = false, children, className, style, ...rest }, ref,
) {
  return <span {...rest} ref={ref} className={indicatorAnchorVariants({ placement, overlap, inset }, className)} style={{ ...style, ...(offset ? { "--area-indicator-anchor-offset": offset } : {}) } as CSSProperties} data-invisible={invisible ? "" : undefined}>
    {children}<span className="area-indicator-anchor__indicator" aria-hidden="true" inert>{indicator}</span>
  </span>;
});

