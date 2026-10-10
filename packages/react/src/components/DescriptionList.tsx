// Description list: labelled values, a term and its value per row, as a native <dl>.
// Spec: docs/specs/description-list.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx, descriptionListVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type DescriptionListVariants = VariantProps<typeof MANIFESTS.descriptionList>;

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** `columns`: terms in a column with the values after them (Notion's page properties). `justified`: term at the start, value at the end (ChatGPT's settings rows). */
  layout?: DescriptionListVariants["layout"];
  /** A rule between rows. */
  divided?: boolean;
  /** Table's frame around the list. */
  framed?: boolean;
}

export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { layout, divided, framed, className, ...rest },
  ref,
) {
  return <dl ref={ref} className={descriptionListVariants({ layout, divided, framed }, className)} {...rest} />;
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
        {term}
      </dt>
      <dd className={descriptionListVariants.element("value")}>{children}</dd>
    </div>
  );
});

export { descriptionListVariants };
