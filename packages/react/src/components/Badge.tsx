"use client";

import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref, RefAttributes } from "react";
import { badgeVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type Options = VariantProps<typeof MANIFESTS.badge> & {
  icon?: ReactNode; trailingIcon?: ReactNode;
  avatar?: ReactNode; flag?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
};
type SpanProps = Options & HTMLAttributes<HTMLSpanElement> & { as?: "span" };
type LinkProps = Options & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };
export type BadgeProps = SpanProps | LinkProps;
/** Static metadata or a native link. Icon/dot-only forms require an accessible name. */
export const Badge = forwardRef<HTMLSpanElement | HTMLAnchorElement, BadgeProps>(function Badge(
  { as = "span", tone, variant, size, pill, dot, dotOnly, iconOnly, truncate, uppercase, icon, trailingIcon, avatar, flag, onDismiss, dismissLabel, className, children, title, ...rest }, ref,
) {
  if ((iconOnly || dotOnly) && !rest["aria-label"] && !rest["aria-labelledby"] && !rest["aria-hidden"]) {
    throw new Error("Badge: iconOnly and dotOnly require aria-label or aria-labelledby (or aria-hidden when decorative).");
  }
  if (truncate && children != null && typeof children !== "string" && typeof children !== "number" && !title) {
    throw new Error("Badge: truncated rich content requires a full-text title.");
  }
  if (onDismiss && (as === "a" || iconOnly || dotOnly)) throw new Error("Badge: dismiss requires a labeled non-link badge.");
  if (onDismiss && !dismissLabel) throw new Error("Badge: dismissLabel is required for the dismiss button.");
  const props = {
    ...rest,
    className: badgeVariants({ tone, variant, size, pill, dot, dotOnly, iconOnly, truncate, uppercase }, className),
    title: title ?? (truncate && (typeof children === "string" || typeof children === "number") ? String(children) : undefined),
    role: rest.role ?? ((iconOnly || dotOnly) && as === "span" ? "img" : undefined),
    children: <>
      {avatar && !dotOnly && !iconOnly ? <span className="area-badge__avatar" aria-hidden="true">{avatar}</span> : null}
      {flag && !dotOnly && !iconOnly ? <span className="area-badge__flag" aria-hidden="true">{flag}</span> : null}
      {dot || dotOnly ? <span className="area-badge__dot" aria-hidden="true" /> : null}
      {icon && !dotOnly ? <span className="area-badge__leading-icon" aria-hidden="true">{icon}</span> : null}
      {!iconOnly && !dotOnly && children != null ? <span className="area-badge__label">{children}</span> : null}
      {trailingIcon && !dotOnly && !iconOnly ? <span className="area-badge__trailing-icon" aria-hidden="true">{trailingIcon}</span> : null}
      {onDismiss ? <button type="button" className="area-badge__dismiss" aria-label={dismissLabel} onClick={onDismiss}><svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="m2.09 2.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L6 5.29l3.15-3.14a.5.5 0 1 1 .7.7L6.71 6l3.14 3.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L6 6.71 2.85 9.85a.5.5 0 0 1-.7-.7L5.29 6 2.15 2.85a.5.5 0 0 1-.06-.63l.06-.07z" /></svg></button> : null}
    </>,
  };
  return as === "a" ? <a {...props as AnchorHTMLAttributes<HTMLAnchorElement>} ref={ref as Ref<HTMLAnchorElement>} /> : <span {...props as HTMLAttributes<HTMLSpanElement>} ref={ref as Ref<HTMLSpanElement>} />;
}) as {
  (props: LinkProps & RefAttributes<HTMLAnchorElement>): ReactNode;
  (props: SpanProps & RefAttributes<HTMLSpanElement>): ReactNode;
};
