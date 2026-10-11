// ShortcutList: a sheet of keyboard shortcuts, one row per command with its keys at the end, under an
// optional group title. Spec: docs/specs/shortcut-list.md.
import { Fragment, createContext, forwardRef, useContext, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../variants.ts";
import { Kbd } from "./primitives.tsx";

const QuietContext = createContext(false);

export interface ShortcutListProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The group's name ("Composer", "Navigation"). Names the list. */
  title?: ReactNode;
  /** The heading level of the title. */
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  /** Keys as text in the muted ink (ChatGPT) rather than keycaps (Figma). */
  quiet?: boolean;
}

/** A group of keyboard shortcuts. Stack several for a full sheet; they sit 32 apart. */
export const ShortcutList = /* @__PURE__ */ forwardRef<HTMLElement, ShortcutListProps>(function ShortcutList(
  { title, titleAs: Title = "h3", quiet = false, className, children, "aria-labelledby": labelledBy, ...rest },
  ref,
) {
  const id = useId();
  return (
    <section ref={ref} className={cx("area-shortcut-list", quiet && "area-shortcut-list--quiet", className)}
      aria-labelledby={labelledBy ?? (title != null ? `${id}-title` : undefined)} {...rest}>
      {title != null ? <Title id={`${id}-title`} className="area-shortcut-list__title">{title}</Title> : null}
      <QuietContext.Provider value={quiet}>
        <dl className="area-shortcut-list__items">{children}</dl>
      </QuietContext.Provider>
    </section>
  );
});

export interface ShortcutListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** What the shortcut does. */
  label: ReactNode;
  /** One chord (`["cmd", "K"]`), or alternatives (`[["shift", "cmd", "Delete"], ["shift", "cmd", "Backspace"]]`). */
  keys?: string[] | string[][];
  /** Custom keys in place of `keys`, such as a KbdGroup sequence. */
  shortcut?: ReactNode;
}

export const ShortcutListItem = /* @__PURE__ */ forwardRef<HTMLDivElement, ShortcutListItemProps>(function ShortcutListItem(
  { label, keys, shortcut, className, ...rest },
  ref,
) {
  const quiet = useContext(QuietContext);
  const chords: string[][] = !keys?.length ? [] : Array.isArray(keys[0]) ? (keys as string[][]) : [keys as string[]];
  return (
    <div ref={ref} className={cx("area-shortcut-list__item", className)} {...rest}>
      <dt className="area-shortcut-list__label">{label}</dt>
      <dd className="area-shortcut-list__keys">
        {shortcut ?? chords.map((chord, i) => (
          <Fragment key={i}>
            {/* Alternatives are read with "or" between them; the gap shows it. */}
            {i > 0 ? <span className="area-sr-only">or</span> : null}
            <Kbd keys={chord} variant={quiet ? "quiet" : "default"} />
          </Fragment>
        ))}
      </dd>
    </div>
  );
});
