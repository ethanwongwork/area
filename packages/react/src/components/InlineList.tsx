// Inline list: short items along a line with a separator between them (a byline, a metadata row). docs/specs/inline-list.md.
import { Children, forwardRef, isValidElement } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { inlineListVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type InlineListVariants = VariantProps<typeof MANIFESTS.inlineList>;

export interface InlineListProps extends HTMLAttributes<HTMLUListElement> {
  /** Between items: a muted middle dot (default), a 1px rule, or space alone (`none`, for icon-led items). */
  separator?: InlineListVariants["separator"];
  /** The items: each child becomes one list item. */
  children?: ReactNode;
}

export const InlineList = /* @__PURE__ */ forwardRef<HTMLUListElement, InlineListProps>(function InlineList(
  { separator, className, children, ...rest },
  ref,
) {
  return (
    // role="list": Safari drops a list's semantics when its markers are removed.
    <ul ref={ref} role="list" className={inlineListVariants({ separator }, className)} {...rest}>
      {Children.toArray(children).map((child, index) => (
        <li key={isValidElement(child) && child.key != null ? child.key : index} className={inlineListVariants.element("item")}>{child}</li>
      ))}
    </ul>
  );
});

export { inlineListVariants };
