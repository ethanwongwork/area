// Titlebar: a window's top bar, the desktop app's own bar made an Area component. Spec: docs/specs/titlebar.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../variants.ts";
import type { MANIFESTS, VariantProps } from "../variants.ts";

export interface TitlebarProps extends HTMLAttributes<HTMLElement> {
  /** ruled (default): a rule under the bar. plain: no rule. floating: a raised plate held off the window's edges. */
  variant?: VariantProps<typeof MANIFESTS.titlebar>["variant"];
  /** Leaves room for the platform's window controls: `macos` clears the traffic lights of a frameless window. */
  windowControls?: "macos";
  /** md (the default): Panel's md bar. sm: a region's header on the window's top line, the small control 7 from its top
   *  and bottom, as Panel's `windowBar`. */
  size?: VariantProps<typeof MANIFESTS.titlebar>["size"];
  /** Pushed to the bar's end: search, panel toggles, the theme. */
  end?: ReactNode;
}

/** A window's top bar: Panel's bar height and rule, the drag region of a frameless window, its controls pressable. */
export const Titlebar = /* @__PURE__ */ forwardRef<HTMLElement, TitlebarProps>(function Titlebar(
  { variant = "ruled", size = "md", windowControls, end, className, children, ...rest }, ref,
) {
  return (
    <header ref={ref} className={cx("area-titlebar", `area-titlebar--${variant}`, size === "sm" && "area-titlebar--sm", windowControls === "macos" && "area-titlebar--macos", className)} {...rest}>
      {children}
      {end ? <div className="area-titlebar__end">{end}</div> : null}
    </header>
  );
});
