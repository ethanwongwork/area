// Adapted from Mantine Indicator (MIT). Source mapping: docs/specs/indicator.md.
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { indicatorVariants, indicatorAnchorVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Presence, type PresenceProps } from "./Presence.tsx";
import { formatCount, normalizeCount } from "./count-format.ts";
export interface IndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  max?: number;
  showZero?: boolean;
  disabled?: boolean;
  processing?: boolean;
  withBorder?: boolean;
  tone?: VariantProps<typeof MANIFESTS.indicator>["tone"];
  /** Availability is a status variant within the Indicator family. */
  status?: PresenceProps["status"] | "online";
  size?: PresenceProps["size"];
  outOfOffice?: boolean;
}
export const Indicator = forwardRef<HTMLSpanElement, IndicatorProps>(function Indicator(
  {count, max = 99, showZero = true, disabled = false, processing = false, withBorder = false, tone, status, size, outOfOffice, className, ...rest}, ref,
) {
  const number = count === undefined ? undefined : normalizeCount(count);
  if (disabled || (!showZero && number === 0)) return null;
  if (status && number === undefined) return <Presence ref={ref} status={status === "online" ? "available" : status} size={size} outOfOffice={outOfOffice} className={className} {...rest} />;
  return <span ref={ref} role="img" aria-label={number === undefined ? (processing ? "Processing" : "New activity") : `${number} notifications`} {...rest}
    className={indicatorVariants({kind: number === undefined ? "dot" : "count", tone}, className)}
    data-processing={processing || undefined} data-border={withBorder || undefined}>
    {number === undefined ? null : formatCount(number, max)}
  </span>;
});
export interface IndicatorAnchorProps extends HTMLAttributes<HTMLSpanElement> {
  indicator: ReactNode;
  placement?: VariantProps<typeof MANIFESTS.indicatorAnchor>["placement"];
  overlap?: "rectangular" | "circular";
  /** Positive CSS length moves the badge inward. Prefer an Area token expression. */
  offset?: string;
  invisible?: boolean;
  /** Insets rectangular count and presence attachments by 4px; by default they centre on the
   *  owner's corner. Circular owners and activity dots are placed as in docs/specs/indicator.md. */
  compact?: boolean;
}
/** The owner supplies the status in its accessible name; the overlay is decorative. */
export const IndicatorAnchor = forwardRef<HTMLSpanElement, IndicatorAnchorProps>(function IndicatorAnchor(
  { indicator, placement, overlap = "rectangular", offset, invisible, compact = false, children, className, style, ...rest }, ref,
) {
  return <span {...rest} ref={ref} className={indicatorAnchorVariants({ placement, overlap, compact }, className)} style={{ ...style, ...(offset ? { "--area-indicator-anchor-offset": offset } : {}) } as CSSProperties} data-invisible={invisible ? "" : undefined}>
    {children}<span className="area-indicator-anchor__indicator" aria-hidden="true" inert>{indicator}</span>
  </span>;
});

