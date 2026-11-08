// Selection bar: "3 selected", the actions that apply to the selection and a clear button, shown while anything is
// selected. Spec: docs/specs/selection-bar.md (components audit N2, 2026-11-07).
//
// Focus follows Primer's bulk actions (DataTable.accessibility.md, Table.BulkActions at 35ff4972): showing the bar
// never moves focus, so whoever is selecting with Space keeps selecting; the count is said instead (the shared
// announcer, including zero). When the selection clears, or an action that held focus goes away, focus goes back to
// where it was before it entered the bar (or to `onFocusReturn`), never to the page's top. Leaving the bar, or moving
// into a dialog an action opened, ends that: focus is the dialog's to return.
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import type { FocusEvent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { selectionBarVariants } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { announce } from "./announce.ts";

/** The count's words: "3 selected" (WRITING.md, "A choice of several"). */
export const selectionCountLabel = (count: number) => `${count} selected`;

export interface SelectionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "role"> {
  /** How many items are selected. At 0 the bar draws nothing but stays mounted, so the change is said and focus can return. */
  count: number;
  /** The actions that apply to the selection: Buttons (ghost or soft, `sm` beside a list's head), a Menu for the rest. */
  children?: ReactNode;
  /** Clears the selection; draws the clear button at the bar's end. Escape in the bar calls it too. */
  onClear?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLDivElement>) => void;
  /** The clear button's name and tooltip (default "Clear selection"). */
  clearLabel?: string;
  /** The count's words, or a function of the count; said each time the count changes (default "3 selected"). */
  label?: string | ((count: number) => string);
  /**
   * Floats over the bottom of the region it scrolls in, on the floating surface (the floating Toolbar's paint). Without it
   * the bar is a row in place of a list's or table's head.
   */
  floating?: boolean;
  /**
   * Where focus goes when the selection clears or the focused action goes away and there is nowhere to go back to
   * (the element focus came from has gone too): the list, its select-all, or its first row.
   */
  onFocusReturn?: () => void;
  /** The group's name for assistive tech (default "Selection actions"). */
  "aria-label"?: string;
}

const focusable = (node: Element | null): node is HTMLElement => !!node && typeof (node as HTMLElement).focus === "function";

/** "N selected" with the actions for the selection, as a named group. */
export const SelectionBar = /* @__PURE__ */ forwardRef<HTMLDivElement, SelectionBarProps>(function SelectionBar(
  { count, children, onClear, clearLabel = "Clear selection", label, floating, onFocusReturn, className, onFocusCapture, onBlurCapture, onKeyDown, "aria-label": ariaLabel = "Selection actions", ...rest },
  ref,
) {
  const empty = count <= 0;
  const words = typeof label === "function" ? label(count) : label ?? selectionCountLabel(count);
  // Said when the count changes, and when the bar first appears with a selection (Primer's announceOnShow); not on a
  // first render at zero, when nothing has happened yet.
  const said = useRef<string | null>(empty ? words : null);
  useEffect(() => {
    if (said.current === words) return;
    said.current = words;
    announce(words);
  }, [words]);

  // Where focus came from when it entered the bar, and whether it is still inside.
  const origin = useRef<HTMLElement | null>(null);
  const inside = useRef(false);
  const root = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!inside.current) return;
    const node = root.current;
    const doc = node?.ownerDocument;
    if (!node || !doc) return;
    const active = doc.activeElement;
    // Focus is still on an action in the bar, or has gone somewhere real outside it: nothing to put back.
    if (active && active !== doc.body && active.isConnected) {
      if (!node.contains(active)) { inside.current = false; origin.current = null; }
      return;
    }
    // Lost: the action that held it was removed (the selection cleared, or the action went away).
    inside.current = false;
    const back = origin.current;
    origin.current = null;
    if (back?.isConnected) back.focus({ preventScroll: true });
    else onFocusReturn?.();
  });

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocusCapture?.(event);
    if (event.defaultPrevented) return;
    const from = event.relatedTarget as Element | null;
    if (!inside.current && (!from || !event.currentTarget.contains(from))) origin.current = focusable(from) ? from : null;
    inside.current = true;
  };
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlurCapture?.(event);
    if (event.defaultPrevented) return;
    const to = event.relatedTarget as Element | null;
    // A focused action that is removed blurs while still attached in some browsers and detached in others: only a
    // move to somewhere else ends the bar's hold (Primer keeps it while the target is disconnected).
    if (to && !event.currentTarget.contains(to)) { inside.current = false; origin.current = null; }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== "Escape" || !onClear) return;
    event.preventDefault();
    onClear(event);
  };

  const setRef = (node: HTMLDivElement | null) => {
    root.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={setRef}
      {...rest}
      role="group"
      aria-label={ariaLabel}
      className={selectionBarVariants({ floating }, className)}
      data-empty={empty ? "" : undefined}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {empty ? null : (
        <>
          <span className={selectionBarVariants.element("count")}>{words}</span>
          {children ? <div className={selectionBarVariants.element("actions")}>{children}</div> : null}
          {onClear ? (
            <Button className={selectionBarVariants.element("clear")} variant="ghost" tone="neutral" size="sm" iconOnly
              icon={<Glyph name="dismiss" />} aria-label={clearLabel} title={clearLabel} onClick={event => onClear(event)} />
          ) : null}
        </>
      )}
    </div>
  );
});

export { selectionBarVariants };
