// Description list: labelled values, a term and its value per row, as a native <dl>.
// Spec: docs/specs/description-list.md.
import { Children, cloneElement, forwardRef, isValidElement, useId, useState } from "react";
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode } from "react";
import { cx, descriptionListVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type DescriptionListVariants = VariantProps<typeof MANIFESTS.descriptionList>;

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /**
   * `columns`: the terms in a column with the values after them. `justified`: each term at the start and its value at
   * the end.
   */
  layout?: DescriptionListVariants["layout"];
  /** A rule between rows. */
  divided?: boolean;
  /** The frame: surface draws Table's frame around the list; plain (the default) draws none. */
  variant?: DescriptionListVariants["variant"];
  /** @deprecated Use `variant="surface"`. */
  framed?: boolean;
  /**
   * Shows only the first rows, with a "Show N more" button after the list that reveals the rest. Omit to show every
   * row.
   */
  visibleCount?: number;
  /** Controlled: every row shown. */
  expanded?: boolean;
  /** Whether every row shows at first, uncontrolled. */
  defaultExpanded?: boolean;
  /** The new state and the press on Show more / Show less. */
  onExpandedChange?: (expanded: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  /** The button's label while rows are hidden; a function receives the hidden count. Default "Show {n} more". */
  moreLabel?: string | ((hidden: number) => string);
  /** The button's label once every row shows. Default "Show less". */
  lessLabel?: string;
}

export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { layout, divided, variant, framed, visibleCount, expanded: expandedProp, defaultExpanded = false, onExpandedChange,
    moreLabel = hidden => `Show ${hidden} more`, lessLabel = "Show less", id: idProp, className, children, ...rest },
  ref,
) {
  if (visibleCount !== undefined && (!Number.isFinite(visibleCount) || visibleCount < 0)) throw new RangeError("DescriptionList: visibleCount must be a nonnegative finite number.");
  const autoId = useId();
  const [localExpanded, setLocalExpanded] = useState(defaultExpanded);
  const expanded = expandedProp ?? localExpanded;
  const items = Children.toArray(children);
  const shown = visibleCount === undefined ? items.length : Math.floor(visibleCount);
  const hidden = Math.max(0, items.length - shown);
  const classes = descriptionListVariants({ layout, divided, variant: variant ?? (framed ? "surface" : undefined) }, className);

  if (!hidden) return <dl ref={ref} id={idProp} className={classes} {...rest}>{children}</dl>;

  const id = idProp ?? `${autoId}-list`;
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (expandedProp === undefined) setLocalExpanded(!expanded);
    onExpandedChange?.(!expanded, event);
  };
  // Rows past the count stay in the document, hidden, so the list keeps its order and a revealed row is the same node.
  const rows = items.map((item, index) => index < shown || expanded || !isValidElement(item)
    ? item
    : cloneElement(item as ReactElement<{ hidden?: boolean }>, { hidden: true }));
  return (
    <>
      <dl ref={ref} id={id} className={classes} {...rest}>{rows}</dl>
      {/* A dl holds only term groups, so the button follows it; focus stays on it either way (the rows are text). */}
      <button type="button" className={descriptionListVariants.element("more")} aria-expanded={expanded} aria-controls={id} onClick={toggle}>
        <span className={descriptionListVariants.element("icon")} aria-hidden="true"><Glyph name="chevron-down" /></span>
        <span className={descriptionListVariants.element("more-label")}>{expanded ? lessLabel : typeof moreLabel === "function" ? moreLabel(hidden) : moreLabel}</span>
      </button>
    </>
  );
});

export interface DescriptionListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** What the value is: "Status", "Owner". */
  term: ReactNode;
  /** A 16px icon before the term (decorative). */
  icon?: ReactNode;
  /** The value. */
  children?: ReactNode;
}

/** One term and its value. A `div` groups the `dt` and `dd`, which a `dl` allows. */
export const DescriptionListItem = forwardRef<HTMLDivElement, DescriptionListItemProps>(function DescriptionListItem(
  { term, icon, children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(descriptionListVariants.element("item"), className)} {...rest}>
      <dt className={descriptionListVariants.element("term")}>
        {icon ? <span className={descriptionListVariants.element("icon")} aria-hidden="true">{icon}</span> : null}
        <span className={descriptionListVariants.element("label")}>{term}</span>
      </dt>
      <dd className={descriptionListVariants.element("value")}>{children}</dd>
    </div>
  );
});

export { descriptionListVariants };
