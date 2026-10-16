// App shell: Titlebar and SectionHeading, the desktop app's own bar and section titles made Area components.
// Spec: docs/specs/app-shell.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../variants.ts";

export interface TitlebarProps extends HTMLAttributes<HTMLElement> {
  /** Clears the platform's own window controls: "macos" leaves room for the traffic lights where Cursor puts them
   * (Electron `titleBarStyle: "hiddenInset"`, `trafficLightPosition: { x: 13, y: 12 }`). */
  windowControls?: "macos";
  /** Pushed to the bar's end: search, panel toggles, the theme. */
  end?: ReactNode;
}

/** A window's top bar: Panel's bar height and rule, the drag region of a frameless window, its controls pressable. */
export const Titlebar = /* @__PURE__ */ forwardRef<HTMLElement, TitlebarProps>(function Titlebar(
  { windowControls, end, className, children, ...rest }, ref,
) {
  return (
    <header ref={ref} className={cx("area-titlebar", windowControls === "macos" && "area-titlebar--macos", className)} {...rest}>
      {children}
      {end ? <div className="area-titlebar__end">{end}</div> : null}
    </header>
  );
});

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The heading, at the strong weight; a count can follow it in the muted ink. */
  title: ReactNode;
  /** A muted line under the heading. */
  lede?: ReactNode;
  /** The heading's level, 2 by default. */
  level?: 2 | 3 | 4 | 5 | 6;
  /** The heading element's id, for aria-labelledby on its section. */
  titleId?: string;
}

/** A titled group on a page: the title trimmed to its cap and baseline, a muted lede 8 under it. */
export const SectionHeading = /* @__PURE__ */ forwardRef<HTMLDivElement, SectionHeadingProps>(function SectionHeading(
  { title, lede, level = 2, titleId, className, ...rest }, ref,
) {
  const Heading = `h${level}` as "h2";
  return (
    <div ref={ref} className={cx("area-section-heading", className)} {...rest}>
      <Heading className="area-section-heading__title" id={titleId}>{title}</Heading>
      {lede ? <p className="area-section-heading__lede">{lede}</p> : null}
    </div>
  );
});
