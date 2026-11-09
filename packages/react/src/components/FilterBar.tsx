// Filter bar: the filters a view has on, as a row of Chips that open their editors, an Add filter button that opens the
// caller's menu of properties, and Reset once the filters differ from the view's saved ones. It holds no filtering
// logic: each filter's editor is a Popover or Menu the caller gives, with the filter as its trigger. Spec:
// docs/specs/filter-bar.md (components audit N5, 2026-11-07).
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from "react";
import { chipVariants, filterBarVariants } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onReset"> {
  /** The filters: each a FilterBarItem as the trigger of its editor (`<Popover trigger={<FilterBarItem … />}>`, or a Menu). */
  children?: ReactNode;
  /** After the filters: a FilterBarAdd as the trigger of a Menu of the properties to filter by. */
  add?: ReactNode;
  /** The filters differ from the view's saved ones: Reset shows (with `onReset`). */
  dirty?: boolean;
  /** Puts the view's saved filters back. Draws Reset at the bar's end while `dirty`. */
  onReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Reset's words (default "Reset"). */
  resetLabel?: string;
  /** The group's name for assistive tech (default "Filters"). */
  "aria-label"?: string;
}

/** A view's filters as a named group of chips. */
export const FilterBar = /* @__PURE__ */ forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  { children, add, dirty, onReset, resetLabel = "Reset", className, "aria-label": ariaLabel = "Filters", ...rest },
  ref,
) {
  return (
    <div ref={ref} role="group" aria-label={ariaLabel} className={filterBarVariants({}, className)} {...rest}>
      {children}
      {add}
      {dirty && onReset ? (
        <Button className={filterBarVariants.element("reset")} variant="ghost" tone="neutral" size="sm" onClick={onReset}>{resetLabel}</Button>
      ) : null}
    </div>
  );
});

export interface FilterBarItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "value" | "children"> {
  /** What the filter is on: a property's name ("Status"). */
  label: ReactNode;
  /** What it keeps, in words ("Done", "Done, In progress", "3 selected"). Without it the filter is waiting for a value. */
  value?: ReactNode;
  /** Changed since the view was saved: a dot before the chevron, said as `dirtyLabel`. */
  dirty?: boolean;
  /** The words the unsaved dot is said as (default "Unsaved"). */
  dirtyLabel?: string;
}

/**
 * One filter: a small Chip reading "Status: Done" with a chevron, the trigger of its editor. With a value it takes
 * Chip's selected paint; without one it is the plain chip. Pass it as a Popover's or Menu's `trigger`, which sets its
 * `aria-expanded`, `aria-haspopup` and `aria-controls`.
 */
export const FilterBarItem = /* @__PURE__ */ forwardRef<HTMLButtonElement, FilterBarItemProps>(function FilterBarItem(
  { label, value, dirty, dirtyLabel = "Unsaved", className, disabled, ...rest },
  ref,
) {
  const applied = value !== undefined && value !== null && value !== false && value !== "";
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={chipVariants({ kind: "assist", size: "sm" }, `${filterBarVariants.element("item")}${className ? ` ${className}` : ""}`)}
      data-selected={applied ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      {...rest}
    >
      <span className="area-chip__label">{label}{applied ? <>: {value}</> : null}</span>
      {dirty ? <span className={filterBarVariants.element("dirty")}><span className="area-sr-only">{dirtyLabel}</span></span> : null}
      <span className="area-chip__trailing-icon" aria-hidden="true"><Glyph name="chevron-down" /></span>
    </button>
  );
});

export type FilterBarAddProps = Omit<ButtonProps, "icon" | "iconOnly">;

/** "Add filter": a small ghost Button with the add glyph, the trigger of the caller's Menu of properties. */
export const FilterBarAdd = /* @__PURE__ */ forwardRef<HTMLButtonElement, FilterBarAddProps>(function FilterBarAdd(
  { children = "Add filter", className, variant = "ghost", tone = "neutral", size = "sm", ...rest },
  ref,
) {
  return (
    <Button ref={ref} variant={variant} tone={tone} size={size} icon={<Glyph name="add" />}
      className={filterBarVariants.element("add") + (className ? ` ${className}` : "")} {...rest}>{children}</Button>
  );
});

export { filterBarVariants };
