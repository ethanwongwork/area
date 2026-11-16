import { forwardRef, useId } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";
import { cx, navVariants, tooltipVariants, MANIFESTS, type VariantProps } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { AnchoredTooltip } from "./Overlays.tsx";
import { useOpenState } from "./overlay.ts";

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
  /** Renders the current location as a compact rail instead of a filled plate. */
  selection?: VariantProps<typeof MANIFESTS.nav>["selection"];
}

export const Nav = /* @__PURE__ */ forwardRef<HTMLElement, NavProps>(function Nav(
  { orientation = "vertical", selection, className, children, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      className={navVariants({ orientation, selection }, className)}
      {...rest}
    >
      {children}
    </nav>
  );
});

export interface NavGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The heading above the run. Omit for an unlabelled group. */
  label?: ReactNode;
  /** An expandable item's children: the rows step in one Tree view level. */
  nested?: boolean;
  /**
   * A labelled group that folds: with `onOpenChange` or `defaultOpen`, the heading is a button that shows and hides the
   * run, its chevron after the name (sidebar sections). `open` controls it; `defaultOpen` folds it on its own, starting
   * open (`true`) or folded (`false`), as Panel section's and Accordion item's. Leave all three out for a fixed group.
   */
  open?: boolean;
  /**
   * Whether the group starts open, uncontrolled.
   * @default true
   */
  defaultOpen?: boolean;
  /** Called when the group folds or opens. */
  onOpenChange?: (open: boolean) => void;
  /** Controls at the heading's end (a section's New), apart from the fold. */
  actions?: ReactNode;
  /**
   * The heading stays pinned at the top of the scroll while the group's rows scroll under it (the desktop app's project
   * or system name). It pins at `--area-nav-sticky-top` (0) on `--area-nav-pin-fill` (the chrome's fill, else the page's).
   */
  sticky?: boolean;
}

export const NavGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, NavGroupProps>(function NavGroup(
  { label, nested, open: openProp, defaultOpen, onOpenChange, actions, sticky, className, children, ...rest },
  ref,
) {
  const labelId = useId();
  const itemsId = useId();
  const folds = Boolean(label && (onOpenChange || defaultOpen !== undefined));
  const [open, setOpen] = useOpenState(openProp, defaultOpen ?? true, onOpenChange);
  const shown = !folds || open !== false;
  return (
    <div ref={ref} className={cx("area-nav__group", nested && "area-nav__group--nested", className)} role={label ? "group" : undefined} aria-labelledby={label ? labelId : undefined} {...rest}>
      {label ? (
        <div className={cx("area-nav__label", sticky && "area-nav__label--sticky")} id={folds ? undefined : labelId}>
          {folds ? (
            <button type="button" className="area-nav__toggle" id={labelId} aria-expanded={shown} aria-controls={itemsId} onClick={() => setOpen(!shown)}>
              <span>{label}</span>
              <span className="area-nav__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span>
            </button>
          ) : <span>{label}</span>}
          {actions ? <div className="area-nav__actions">{actions}</div> : null}
        </div>
      ) : null}
      {folds ? <div className="area-nav__items" id={itemsId} hidden={!shown}>{children}</div> : children}
    </div>
  );
});

export interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  /** Marks the page this item points at as the one being viewed. */
  current?: boolean;
  /** Leading icon. Sized by the slot, never by itself. With no children the item is the icon alone, a square plate,
   * named by its `aria-label` (the desktop app's Home tab). */
  icon?: ReactNode;
  /**
   * A small picture in the icon's place, 20 × 14 at type 14 (a screen's or an image's thumbnail, so items that share a
   * name or a kind read apart: a design's layers). It sits on the icon column, the text after it. Takes the place of
   * `icon`.
   */
  picture?: ReactNode;
  /** Pushed to the end of the row: a count, a shortcut, a status dot. */
  trailing?: ReactNode;
  /** Independent controls beside the link, within its shared row backplate; never nested inside the anchor. */
  actions?: ReactNode;
  /** The actions show only while the row is hovered or holds focus (or a menu they opened is open), as Board's card
   * actions; a touch screen always shows them. */
  revealActions?: boolean;
  /** The item cannot be opened; it leaves the Tab order. */
  disabled?: boolean;
  /**
   * Can't be opened now, for a reason that will pass or that the person can change: drawn as disabled, but it keeps
   * its Tab stop and the pointer, so it can say why in `inactiveText`. Following it does nothing (`aria-disabled`, no
   * href). `disabled` is for a place that truly isn't there.
   */
  inactive?: boolean;
  /** Why an inactive item can't be opened ("Upgrade to see insights"): a Tooltip on hover and focus, and its accessible description. */
  inactiveText?: ReactNode;
  /** The item's name. */
  children?: ReactNode;
}

export const NavItem = /* @__PURE__ */ forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem(
  { current, icon, picture, trailing, actions, revealActions, disabled, inactive: inactiveProp, inactiveText, className, children, href, onClick, tabIndex, ...rest },
  ref,
) {
  // Disabled wins; an inactive item is unavailable as disabled is, but stays a Tab stop.
  const inactive = Boolean(inactiveProp) && !disabled;
  const unavailable = disabled || inactive;
  const anchor = (
    <a
      ref={ref}
      className={cx("area-nav__item", className)}
      // `aria-current="page"` is what the CSS selects on, so an item cannot be styled
      // current without also announcing it.
      aria-current={current ? "page" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-inactive={inactive ? "" : undefined}
      aria-disabled={unavailable || undefined}
      // Without its href a disabled item keeps the link role, so aria-disabled means something (audit D-29).
      role={unavailable ? "link" : undefined}
      href={unavailable ? undefined : href}
      // An anchor without an href is no Tab stop, so an inactive one is given one back.
      tabIndex={disabled ? -1 : inactive ? (tabIndex ?? 0) : tabIndex}
      onClick={unavailable ? (event) => { event.preventDefault(); } : onClick}
      {...rest}
    >
      {picture ? (
        <span className="area-nav__picture" aria-hidden="true">
          {picture}
        </span>
      ) : icon ? (
        <span className="area-nav__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {icon && (children === undefined || children === null || children === false) ? null : <span className="area-nav__text">{children}</span>}
      {trailing ? <span className="area-nav__trailing">{trailing}</span> : null}
    </a>
  );
  // The reason shows on hover and focus and describes the item, as an Area Tooltip does.
  const link = inactive && inactiveText != null && inactiveText !== false
    ? <AnchoredTooltip trigger={anchor} side="right" surface={props => <div role="tooltip" className={tooltipVariants({})} {...(props as HTMLAttributes<HTMLDivElement> & { ref: Ref<HTMLDivElement> })}>{inactiveText}</div>} />
    : anchor;
  return actions ? <div className={cx("area-nav__row", revealActions && "area-nav__row--reveal")}>{link}<div className="area-nav__actions">{actions}</div></div> : link;
});

/** A rule between runs of items. Horizontal navs get a vertical hairline instead. */
/** A rule between runs. Takes a ref and native props, as MenuSeparator does (audit S17). */
export const NavSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function NavSeparator({ className, ...rest }, ref) {
  return <div ref={ref} role="separator" className={cx("area-nav__separator", className)} {...rest} />;
});
