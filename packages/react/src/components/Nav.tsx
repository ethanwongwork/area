import { forwardRef, useId } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx, navVariants, MANIFESTS, type VariantProps } from "../variants.ts";

/**
 * Site navigation, vertical or horizontal.
 *
 * Composed rather than configured: a `Nav` holds `NavGroup`s and `NavItem`s, because a
 * sidebar's shape is the caller's, not the component's. Passing a tree of objects would
 * mean inventing a schema for icons, counts, badges and nesting, and every real navigation
 * eventually needs something that schema lacks.
 */
export interface NavProps extends HTMLAttributes<HTMLElement> {
  /** The axis. Vertical is the sidebar case and the default. */
  orientation?: "vertical" | VariantProps<typeof MANIFESTS.nav>["orientation"];
  /** What a current item's plate carries. Neutral by default. */
  tone?: "neutral" | VariantProps<typeof MANIFESTS.nav>["tone"];
}

export const Nav = /* @__PURE__ */ forwardRef<HTMLElement, NavProps>(function Nav(
  { orientation = "vertical", tone = "neutral", className, children, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      className={navVariants({ orientation: orientation === "vertical" ? undefined : orientation, tone: tone === "neutral" ? undefined : tone }, className)}
      {...rest}
    >
      {children}
    </nav>
  );
});

export interface NavGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The heading above the run. Omit for an unlabelled group. */
  label?: ReactNode;
}

export const NavGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, NavGroupProps>(function NavGroup(
  { label, className, children, ...rest },
  ref,
) {
  const labelId = useId();
  return (
    <div ref={ref} className={cx("area-nav__group", className)} role={label ? "group" : undefined} aria-labelledby={label ? labelId : undefined} {...rest}>
      {label ? <div className="area-nav__label" id={labelId}><span>{label}</span></div> : null}
      {children}
    </div>
  );
});

export interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  /** Marks the page this item points at as the one being viewed. */
  current?: boolean;
  /** Leading icon. Sized by the slot, never by itself. */
  icon?: ReactNode;
  /** Pushed to the end of the row: a count, a shortcut, a status dot. */
  trailing?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

export const NavItem = /* @__PURE__ */ forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem(
  { current, icon, trailing, disabled, className, children, href, onClick, tabIndex, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cx("area-nav__item", className)}
      // `aria-current="page"` is what the CSS selects on, so an item cannot be styled
      // current without also announcing it.
      aria-current={current ? "page" : undefined}
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled || undefined}
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={disabled ? (event) => { event.preventDefault(); } : onClick}
      {...rest}
    >
      {icon ? (
        <span className="area-nav__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="area-nav__text">{children}</span>
      {trailing ? <span className="area-nav__trailing">{trailing}</span> : null}
    </a>
  );
});

/** A rule between runs of items. Horizontal navs get a vertical hairline instead. */
export const NavSeparator = () => <div className="area-nav__separator" role="separator" />;
