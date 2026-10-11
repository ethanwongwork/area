// SearchField: an Input for a query, with a search glyph, a clear action once there is text, Escape
// to clear, and an optional shortcut hint while empty. Spec: docs/specs/search-field.md.
import { forwardRef, useCallback, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cx } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Input, InputAction, type InputProps } from "./Input.tsx";
import { Kbd } from "./primitives.tsx";

export interface SearchFieldProps extends Omit<InputProps, "type" | "value" | "defaultValue" | "trailingAction" | "trailingIcon" | "suffix" | "onSubmit"> {
  /** The query (controlled). */
  value?: string;
  defaultValue?: string;
  /** Every change to the query, typed or cleared. */
  onValueChange?: (value: string) => void;
  /** After the clear action or Escape empties the field. */
  onClear?: () => void;
  /** Enter in the field, with the query. A surrounding form still submits. */
  onSubmit?: (value: string) => void;
  /** Keys of the shortcut that focuses the field, shown while it is empty ("cmd", "K"). A hint:
   * the page binds the keys, and they are also set as `aria-keyshortcuts`. */
  shortcut?: string[];
  /** Name of the clear action. */
  clearLabel?: string;
  /** The leading glyph. Defaults to search; `null` leaves the start to the text. */
  leadingIcon?: ReactNode;
}

const ARIA_KEYS: Record<string, string> = { cmd: "Meta", command: "Meta", meta: "Meta", "⌘": "Meta", ctrl: "Control", control: "Control", "⌃": "Control", alt: "Alt", option: "Alt", opt: "Alt", "⌥": "Alt", shift: "Shift", "⇧": "Shift" };
const ariaKeys = (keys: string[]) => keys.map(key => ARIA_KEYS[key.toLowerCase()] ?? (key.length === 1 ? key.toUpperCase() : key)).join("+");

/**
 * A field for a search query. The clear action stays out of the Tab order and keeps focus in the
 * field (React Aria, Fluent); Escape clears a query and, on an empty field, is left to the page
 * (a dialog can close).
 */
export const SearchField = /* @__PURE__ */ forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value, defaultValue = "", onValueChange, onClear, onSubmit, shortcut, clearLabel = "Clear search", leadingIcon, icon,
    size, disabled, readOnly, className, onChange, onKeyDown, placeholder = "Search", ...rest },
  ref,
) {
  const [own, setOwn] = useState(defaultValue);
  const query = value ?? own;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const update = (next: string) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };
  const clear = () => {
    update("");
    onClear?.();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    update(event.target.value);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || readOnly) return;
    if (event.key === "Escape" && query !== "") {
      // Handled here, so a dialog around the field stays open; a second Escape reaches it.
      event.preventDefault();
      event.stopPropagation();
      clear();
    } else if (event.key === "Enter" && onSubmit) {
      onSubmit(query);
    }
  };

  const editable = !disabled && !readOnly;
  const glyph = leadingIcon === undefined && icon === undefined ? <Glyph name="search" /> : leadingIcon ?? icon;
  return (
    <Input
      ref={setRefs}
      {...rest}
      className={cx("area-search-field", className)}
      type="search"
      enterKeyHint="search"
      size={size}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      leadingIcon={glyph}
      aria-keyshortcuts={rest["aria-keyshortcuts"] ?? (shortcut?.length ? ariaKeys(shortcut) : undefined)}
      trailingAction={query !== "" && editable ? (
        <InputAction
          className="area-search-field__clear"
          icon={<Glyph name="dismiss-circle" />}
          tooltip={clearLabel}
          // Out of the Tab order (Escape does the same), and pressing it keeps the caret in the field.
          tabIndex={-1}
          onMouseDown={(event: MouseEvent) => event.preventDefault()}
          onClick={() => {
            clear();
            inputRef.current?.focus();
          }}
        />
      ) : undefined}
      suffix={query === "" && shortcut?.length ? (
        <Kbd className="area-search-field__shortcut" keys={shortcut} size={size === "lg" ? "md" : "sm"} aria-hidden="true" />
      ) : undefined}
    />
  );
});
