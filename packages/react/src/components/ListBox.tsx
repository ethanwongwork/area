// ListBox: a set of options to choose one from, laid out as a list or a grid, with one Tab stop.
// The WAI-ARIA listbox (role listbox / option, aria-selected; React Aria's ListBox, @react-aria/listbox@3.14.0
// useListBox.mjs:69, useOption.mjs:41-43): Tab enters at the selected option (else the first) and leaves the set;
// arrows move inside it. In a grid, Left / Right step in reading order and Up / Down go to the nearest option by
// centre in the row above or below (as React Aria's grid layout keeps the column, ListKeyboardDelegate.mjs:53-65, but
// by geometry, so ragged rows and sections work); Home / End reach the ends; typing jumps to an option's text.
// Spec: docs/specs/list-box.md.
import { createContext, forwardRef, useCallback, useContext, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cx } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { TYPEAHEAD_RESET } from "./Overlays.tsx";

type Layout = "list" | "grid";

interface ListBoxContext {
  id: string;
  layout: Layout;
  value: string | null | undefined;
  tabValue: string | undefined;
  disabled: boolean;
  select: (value: string) => void;
  focused: (value: string) => void;
}

const Context = createContext<ListBoxContext | null>(null);

const OPTION = '[role="option"]';
/** The options this listbox owns, in document order, visible and enabled. */
function optionsOf(box: HTMLElement) {
  return [...box.querySelectorAll<HTMLElement>(OPTION)].filter(option =>
    option.closest('[role="listbox"]') === box && option.getAttribute("aria-disabled") !== "true" && option.getClientRects().length > 0);
}

export interface ListBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** list: one option per row (Menu's rows). grid: options flow in rows and columns. */
  layout?: Layout;
  /** The selected option's value (controlled). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  /** Moving with the keyboard also selects, so a preview beside the set follows the keys. */
  selectionFollowsFocus?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export const ListBox = /* @__PURE__ */ forwardRef<HTMLDivElement, ListBoxProps>(function ListBox(
  { layout = "list", value: valueProp, defaultValue = null, onValueChange, selectionFollowsFocus = false, disabled = false, className, onKeyDown, children, ...rest },
  ref,
) {
  const id = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const box = useRef<HTMLDivElement | null>(null);
  const [localValue, setLocalValue] = useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : localValue;
  const [focusValue, setFocusValue] = useState<string>();
  const [first, setFirst] = useState<string>();
  const typed = useRef({ text: "", at: 0 });

  const select = useCallback((next: string) => {
    if (valueProp === undefined) setLocalValue(next);
    if (next !== value) onValueChange?.(next);
  }, [valueProp, value, onValueChange]);

  // The Tab stop: the option last focused while it is still here, else the selected one, else the first.
  // Before the box is in the DOM (the server's render, the first one) the chosen value is trusted.
  const present = (candidate: string | null | undefined) =>
    candidate != null && (box.current == null || optionsOf(box.current).some(option => option.dataset.value === candidate));
  useLayoutEffect(() => {
    const node = box.current;
    if (!node) return;
    const next = optionsOf(node)[0]?.dataset.value;
    if (next !== first) setFirst(next);
    if (focusValue !== undefined && !present(focusValue)) setFocusValue(undefined);
  });
  const tabValue = present(focusValue) ? focusValue : present(value) ? value ?? undefined : first;

  const context = useMemo<ListBoxContext>(() => ({
    id, layout, value, tabValue, disabled,
    select,
    focused: next => { setFocusValue(next); if (selectionFollowsFocus) select(next); },
  }), [id, layout, value, tabValue, disabled, select, selectionFollowsFocus]);

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || event.altKey || event.ctrlKey || event.metaKey) return;
    const node = box.current;
    const current = (event.target as HTMLElement).closest<HTMLElement>(OPTION);
    if (!node || !current || current.closest('[role="listbox"]') !== node) return;
    const options = optionsOf(node);
    const index = options.indexOf(current);
    if (index < 0) return;
    const rtl = getComputedStyle(current).direction === "rtl";
    let next: HTMLElement | undefined;
    const vertical = (down: boolean) => {
      if (layout === "list") return options[index + (down ? 1 : -1)];
      // The nearest option by centre in the next row that starts below (or above) this one.
      const from = current.getBoundingClientRect();
      const centre = from.left + from.width / 2;
      let best: { option: HTMLElement; row: number; dx: number } | undefined;
      for (const option of options) {
        const rect = option.getBoundingClientRect();
        if (down ? rect.top < from.bottom - 1 : rect.bottom > from.top + 1) continue;
        const row = down ? rect.top : -rect.bottom;
        const dx = Math.abs(rect.left + rect.width / 2 - centre);
        if (!best || row < best.row - 1 || (Math.abs(row - best.row) <= 1 && dx < best.dx)) best = { option, row, dx };
      }
      return best?.option;
    };
    switch (event.key) {
      case "ArrowDown": next = vertical(true); break;
      case "ArrowUp": next = vertical(false); break;
      case "ArrowRight": if (layout === "grid") next = options[index + (rtl ? -1 : 1)]; else return; break;
      case "ArrowLeft": if (layout === "grid") next = options[index + (rtl ? 1 : -1)]; else return; break;
      case "Home": next = options[0]; break;
      case "End": next = options.at(-1); break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (current.dataset.value !== undefined) select(current.dataset.value);
        return;
      default: {
        // Typeahead: printable keys build a prefix for a second, as Menu's (TYPEAHEAD_RESET).
        if (event.key.length !== 1 || !/\S/.test(event.key)) return;
        const now = Date.now();
        typed.current = { text: (now - typed.current.at > TYPEAHEAD_RESET ? "" : typed.current.text) + event.key.toLowerCase(), at: now };
        const text = (option: HTMLElement) => (option.dataset.text ?? option.textContent ?? "").trim().toLowerCase();
        const after = [...options.slice(index + (typed.current.text.length === 1 ? 1 : 0)), ...options];
        next = after.find(option => text(option).startsWith(typed.current.text));
        if (!next) return;
      }
    }
    event.preventDefault();
    if (!next || next === current) return;
    next.focus({ preventScroll: true });
    next.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <Context.Provider value={context}>
      <div
        ref={node => { box.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
        role="listbox"
        className={cx("area-list-box", `area-list-box--${layout}`, className)}
        aria-disabled={disabled || undefined}
        aria-orientation={layout === "list" ? "vertical" : undefined}
        onKeyDown={move}
        {...rest}
      >
        {children}
      </div>
    </Context.Provider>
  );
});

export interface ListBoxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** This option's value; also its key. */
  value: string;
  /** The text typeahead matches, when the content has none of its own (an icon, a swatch). */
  textValue?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const ListBoxItem = /* @__PURE__ */ forwardRef<HTMLDivElement, ListBoxItemProps>(function ListBoxItem(
  { value, textValue, disabled: disabledProp, className, children, onClick, onFocus, ...rest },
  ref,
) {
  const box = useContext(Context);
  if (!box) throw new Error("ListBoxItem must be inside a ListBox");
  const disabled = disabledProp || box.disabled;
  const selected = box.value === value;
  const click = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    box.select(value);
  };
  const focus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    if (event.target === event.currentTarget && !disabled) box.focused(value);
  };
  const list = box.layout === "list";
  return (
    <div
      ref={ref}
      role="option"
      id={`${box.id}-option-${value.replace(/[^A-Za-z0-9_-]/g, "_")}`}
      className={cx("area-list-box__item", list && "area-menu__item", className)}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      // Menu's row reads the value picker's selected plate from data-selected.
      data-selected={list && selected ? "" : undefined}
      data-value={value}
      data-text={textValue}
      // One Tab stop for the whole set (roving): every other option is reached with the arrows.
      tabIndex={box.tabValue === value ? 0 : -1}
      onClick={click}
      onFocus={focus}
      {...rest}
    >
      {list ? <>
        <span className="area-menu__text">{children}</span>
        {/* A value picker's row shows its value with the active plate and the check (DESIGN_SYSTEM.md, "Selected rows"). */}
        <span className="area-menu__check" aria-hidden="true"><Glyph name="check" /></span>
      </> : children}
    </div>
  );
});

export interface ListBoxSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The group's heading, which names it. */
  title: ReactNode;
  children?: ReactNode;
}

/** A named group of options (role group), its heading above and its options below. */
export const ListBoxSection = /* @__PURE__ */ forwardRef<HTMLDivElement, ListBoxSectionProps>(function ListBoxSection(
  { title, className, children, ...rest },
  ref,
) {
  const heading = useId();
  return (
    <div ref={ref} role="group" aria-labelledby={heading} className={cx("area-list-box__section", className)} {...rest}>
      <div id={heading} className="area-list-box__heading area-menu__label"><span className="area-menu__label-text">{title}</span></div>
      <div className="area-list-box__options">{children}</div>
    </div>
  );
});
