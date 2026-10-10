// Empty state: says a region has nothing to show yet, and how to fill it. An icon on a soft tile,
// a title, a muted line and actions, centred in the region. Spec: docs/specs/empty-state.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { emptyStateVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type EmptyStateVariants = VariantProps<typeof MANIFESTS.emptyState>;

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** What is missing, in a few words: "No results", "No pages yet". */
  title?: ReactNode;
  /** One or two sentences on why it is empty or what fills it. */
  description?: ReactNode;
  /** A glyph for the tile: an Area `Glyph` (drawn at the tile's size) or any 16-grid SVG icon. Decorative. */
  icon?: ReactNode;
  /** The ways to fill the region: one or two Buttons, or a Link. */
  actions?: ReactNode;
  /** `md` for a page or main region (ChatGPT); `sm` inside a panel, list or popover (Notion). */
  size?: EmptyStateVariants["size"];
  /** The title's element: a heading at the page's next level, or `p` where a heading would break the outline. */
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, actions, size, titleAs: Title = "h2", className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={emptyStateVariants({ size }, className)} {...rest}>
      {icon ? <span className={emptyStateVariants.element("icon")} aria-hidden="true">{icon}</span> : null}
      {title || description ? (
        <div className={emptyStateVariants.element("content")}>
          {title ? <Title className={emptyStateVariants.element("title")}>{title}</Title> : null}
          {description ? <p className={emptyStateVariants.element("description")}>{description}</p> : null}
        </div>
      ) : null}
      {actions ? <div className={emptyStateVariants.element("actions")}>{actions}</div> : null}
    </div>
  );
});

export { emptyStateVariants };
