// Navbox: related links in named groups at the foot of a page, as site footers and docs "related" blocks lay them
// out: a heading above each group, its links one per line, in columns. docs/specs/navbox.md.
import { Children, forwardRef, isValidElement, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx, navboxVariants } from "../variants.ts";

export interface NavboxProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The topic the links share, in the surface title role. Without it, give the nav an `aria-label`. */
  title?: ReactNode;
  /** The title's heading level, 2 by default. */
  level?: 2 | 3 | 4 | 5 | 6;
  /** A rule above, where the block closes an article. */
  divided?: boolean;
  /** `NavboxGroup`s. */
  children?: ReactNode;
}

export const Navbox = /* @__PURE__ */ forwardRef<HTMLElement, NavboxProps>(function Navbox(
  { title, level, divided, className, children, ...rest },
  ref,
) {
  const id = useId();
  const Heading = `h${level ?? 2}` as "h2";
  return (
    <nav ref={ref} className={navboxVariants({ divided }, className)} aria-labelledby={title ? `${id}-title` : undefined} {...rest}>
      {title ? <Heading className={navboxVariants.element("title")} id={`${id}-title`}>{title}</Heading> : null}
      <div className={navboxVariants.element("groups")}>{children}</div>
    </nav>
  );
});

export interface NavboxGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The group's heading, above its links. */
  label?: ReactNode;
  /** The links: each child becomes one row. */
  children?: ReactNode;
}

export const NavboxGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, NavboxGroupProps>(function NavboxGroup(
  { label, className, children, ...rest },
  ref,
) {
  const id = useId();
  return (
    <div ref={ref} className={cx(navboxVariants.element("group"), className)} {...rest}>
      {label ? <div className={navboxVariants.element("label")} id={`${id}-label`}>{label}</div> : null}
      <ul className={navboxVariants.element("list")} role="list" aria-labelledby={label ? `${id}-label` : undefined}>
        {Children.toArray(children).map((child, index) => <li key={isValidElement(child) && child.key != null ? child.key : index}>{child}</li>)}
      </ul>
    </div>
  );
});

export { navboxVariants };
