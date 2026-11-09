"use client";

import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref, RefAttributes } from "react";
import { badgeVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type Options = Omit<VariantProps<typeof MANIFESTS.badge>, "tone" | "rounded"> & {
  /** Unset: a pill while the theme's `pills` list names this component (the default). `true` forces a pill, `false` the radius setting's corner. */
  pill?: boolean;
  /** Semantic paint. `"inverted"` is a deprecated alias of `"inverse"` (Avatar's word; audit S17). */
  tone?: VariantProps<typeof MANIFESTS.badge>["tone"] | "inverted";
  icon?: ReactNode; trailingIcon?: ReactNode;
  avatar?: ReactNode; flag?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** On a coloured ground: the ground's own ink for the text and a 20% line of it, no plate (the text keeps the ground's own contrast). */
  onColor?: boolean;
};
type SpanProps = Options & HTMLAttributes<HTMLSpanElement> & { as?: "span" };
type LinkProps = Options & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };
export type BadgeProps = SpanProps | LinkProps;
/** Static metadata or a native link. Icon/dot-only forms require an accessible name. */
export const Badge = forwardRef<HTMLSpanElement | HTMLAnchorElement, BadgeProps>(function Badge(
  { as = "span", tone, variant, size, pill, dot, dotOnly, iconOnly, truncate, onColor, icon, trailingIcon, avatar, flag, onDismiss, dismissLabel, className, children, title, ...rest }, ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  variant = useSystemDefault("badge", "variant", variant, badgeVariants.manifest.variants.variant);
  tone = useSystemDefault("badge", "tone", tone, badgeVariants.manifest.variants.tone);
  size = useSystemDefault("badge", "size", size, badgeVariants.manifest.variants.size);
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
    className: badgeVariants({ tone: tone === "inverted" ? "inverse" : tone, variant, size, dot, dotOnly, iconOnly, truncate, onColor, pill: pill === true, rounded: pill === false }, className),
    title: title ?? (truncate && (typeof children === "string" || typeof children === "number") ? String(children) : undefined),
    role: rest.role ?? ((iconOnly || dotOnly) && as === "span" ? "img" : undefined),
    children: <>
      {avatar && !dotOnly && !iconOnly ? <span className="area-badge__avatar" aria-hidden="true">{avatar}</span> : null}
      {flag && !dotOnly && !iconOnly ? <span className="area-badge__flag" aria-hidden="true">{flag}</span> : null}
      {dot || dotOnly ? <span className="area-badge__dot" aria-hidden="true" /> : null}
      {icon && !dotOnly ? <span className="area-badge__leading-icon" aria-hidden="true">{icon}</span> : null}
      {!iconOnly && !dotOnly && children != null ? <span className="area-badge__label">{children}</span> : null}
      {trailingIcon && !dotOnly && !iconOnly ? <span className="area-badge__trailing-icon" aria-hidden="true">{trailingIcon}</span> : null}
      {onDismiss ? <button type="button" className="area-badge__dismiss" aria-label={dismissLabel} onClick={onDismiss}><Glyph name="dismiss" size={12} /></button> : null}
    </>,
  };
  return as === "a" ? <a {...props as AnchorHTMLAttributes<HTMLAnchorElement>} ref={ref as Ref<HTMLAnchorElement>} /> : <span {...props as HTMLAttributes<HTMLSpanElement>} ref={ref as Ref<HTMLSpanElement>} />;
}) as {
  (props: LinkProps & RefAttributes<HTMLAnchorElement>): ReactNode;
  (props: SpanProps & RefAttributes<HTMLSpanElement>): ReactNode;
};
