"use client";

import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref, RefAttributes } from "react";
import { badgeVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type BadgeAxes = VariantProps<typeof MANIFESTS.badge>;
type Options = {
  /**
   * `soft` (default): a tinted plate. `solid`: the tone's full fill. `outline`: an edge and no fill. `color`: a tint
   * and an edge of the tone. `modern`: a raised neutral plate with the tone's mark. `plain`: no plate or edge, the
   * mark on the text's own column.
   */
  variant?: BadgeAxes["variant"];
  /** Semantic paint: `neutral` by default. `"inverted"` is a deprecated alias of `"inverse"`. */
  tone?: BadgeAxes["tone"] | "inverted";
  /** The height and type: `md` (default), `sm` or `lg`. */
  size?: BadgeAxes["size"];
  /** Unset: a pill while the theme's `pills` list names this component (the default). `true` forces a pill, `false` the radius setting's corner. */
  pill?: boolean;
  /** A status dot before the label, in the tone's mark color. */
  dot?: boolean;
  /** The dot alone, with no label or plate. Requires `aria-label`. */
  dotOnly?: boolean;
  /** An icon alone, with no label. Requires `aria-label`. */
  iconOnly?: boolean;
  /** Cuts a long label to one line with an ellipsis; the full text becomes its `title`. */
  truncate?: boolean;
  /** On a colored ground: the ground's own ink for the text and a 20% line of it, no plate, so the text keeps the ground's contrast. */
  onColor?: boolean;
  /** A glyph before the label, in the tone's mark color. */
  icon?: ReactNode;
  /** A glyph after the label. */
  trailingIcon?: ReactNode;
  /** An Avatar before the label, for a person or a team. */
  avatar?: ReactNode;
  /** A flag or other small picture before the label. */
  flag?: ReactNode;
  /** Adds a dismiss button at the end and is called when it is pressed. Needs `dismissLabel`. */
  onDismiss?: () => void;
  /** The dismiss button's accessible name ("Remove Design"); required with `onDismiss`. */
  dismissLabel?: string;
};
type SpanProps = Options & HTMLAttributes<HTMLSpanElement> & {
  /** The element: `span` (default), or `a` with an `href` for a badge that is a link. */
  as?: "span";
};
type LinkProps = Options & AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: "a";
  /** Where the link goes. */
  href: string;
};
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
