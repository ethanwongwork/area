// LinkGroups: related links in named groups at the foot of a page, as site footers and docs "related" blocks lay them
// out: a heading above each group, its links one per line, in columns. docs/specs/link-groups.md.
import { Children, forwardRef, isValidElement, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx, linkGroupsVariants } from "../variants.ts";

export interface LinkGroupsProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The topic the links share, in the surface title role. Without it, give the nav an `aria-label`. */
  title?: ReactNode;
  /** The title's heading level, 2 by default. */
  level?: 2 | 3 | 4 | 5 | 6;
  /** A rule above, where the block closes an article. */
  divided?: boolean;
  /** `LinkGroup`s. */
  children?: ReactNode;
}

export const LinkGroups = /* @__PURE__ */ forwardRef<HTMLElement, LinkGroupsProps>(function LinkGroups(
  { title, level, divided, className, children, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const id = useId();
  const Heading = `h${level ?? 2}` as "h2";
  // aria-label wins over the title, as Table of contents' name (DESIGN_SYSTEM.md, Names).
  return (
    <nav ref={ref} className={linkGroupsVariants({ divided }, className)} aria-labelledby={title && !ariaLabel ? `${id}-title` : undefined} aria-label={ariaLabel} {...rest}>
      {title ? <Heading className={linkGroupsVariants.element("title")} id={`${id}-title`}>{title}</Heading> : null}
      <div className={linkGroupsVariants.element("groups")}>{children}</div>
    </nav>
  );
});

export interface LinkGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The group's heading, above its links. */
  label?: ReactNode;
  /** The links: each child becomes one row. */
  children?: ReactNode;
}

export const LinkGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, LinkGroupProps>(function LinkGroup(
  { label, className, children, ...rest },
  ref,
) {
  const id = useId();
  return (
    <div ref={ref} className={cx(linkGroupsVariants.element("group"), className)} {...rest}>
      {label ? <div className={linkGroupsVariants.element("label")} id={`${id}-label`}>{label}</div> : null}
      <ul className={linkGroupsVariants.element("list")} role="list" aria-labelledby={label ? `${id}-label` : undefined}>
        {Children.toArray(children).map((child, index) => <li key={isValidElement(child) && child.key != null ? child.key : index}>{child}</li>)}
      </ul>
    </div>
  );
});

export { linkGroupsVariants };
