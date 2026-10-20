// OTPField: a one-time code drawn as a row of character slots over one real input. Spec: docs/specs/otp-field.md.
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, InputHTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { otpFieldVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type Manifest = VariantProps<typeof MANIFESTS.otpField>;

export interface OTPFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange" | "type" | "pattern" | "maxLength"> {
  /** How many characters the code has. */
  length?: number;
  /** The code (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Once every slot is filled, with the code. */
  onComplete?: (value: string) => void;
  /** Slots per group, start to end ([3, 3] draws "123 – 456"); the groups add up to `length`. */
  groups?: number[];
  /** Which characters a slot takes: digits (default) or letters and digits. Pasted spaces and dashes are dropped. */
  characters?: "digits" | "alphanumeric";
  /** Draws each entered character as a dot. */
  mask?: boolean;
  variant?: Manifest["variant"];
  size?: Manifest["size"];
  invalid?: boolean;
  /** Class and style of the row of slots, the outer element. */
  className?: string;
  style?: InputHTMLAttributes<HTMLInputElement>["style"];
}

const FILTER = { digits: /[^0-9]/g, alphanumeric: /[^0-9A-Za-z]/g };
const PATTERN = { digits: "[0-9]*", alphanumeric: "[0-9A-Za-z]*" };

/**
 * A field for a one-time code. One real input sits over the slots, transparent, so the code is one control
 * with one name, one value and one Tab stop, and the platform's own editing works: SMS and password-manager
 * autofill (`autocomplete="one-time-code"` only applies to a single field), paste (spaces and dashes dropped),
 * Backspace, arrows, undo and select-all. The slots only draw it: the character in each, the caret in the
 * slot it will fill, the selection. input-otp (shadcn, Untitled UI) and GOV.UK's single code input do the same.
 */
export const OTPField = /* @__PURE__ */ forwardRef<HTMLInputElement, OTPFieldProps>(function OTPField(
  { length = 6, value, defaultValue = "", onValueChange, onComplete, groups, characters = "digits", mask, variant, size, invalid,
    disabled, readOnly, className, style, onFocus, onBlur, onSelect, onKeyUp, onKeyDown, onPointerUp, onPaste, autoComplete = "one-time-code",
    inputMode, "aria-invalid": ariaInvalid, ...rest },
  ref,
) {
  const clean = useCallback((text: string) => text.replace(FILTER[characters], "").slice(0, length), [characters, length]);
  const [own, setOwn] = useState(() => clean(defaultValue));
  const code = clean(value ?? own);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);
  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState<[number, number]>([0, 0]);

  const readSelection = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? input.value.length, end = input.selectionEnd ?? input.value.length;
    // A caret before a typed character selects it, so the next key replaces that slot rather than pushing the code
    // along (input-otp). The append position stays a caret.
    if (start === end && start < input.value.length && document.activeElement === input) {
      input.setSelectionRange(start, start + 1);
      setSelection([start, start + 1]);
      return;
    }
    setSelection([start, end]);
  }, []);

  // Left and Right move one slot, from the selected slot rather than its edges.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    const input = inputRef.current;
    if (event.defaultPrevented || !input || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const at = input.selectionStart ?? 0;
    const length = input.value.length;
    const rtl = getComputedStyle(input).direction === "rtl";
    const back = (event.key === "ArrowLeft") !== rtl;
    const next = back ? Math.max(0, at - 1) : Math.min(length, at + 1);
    input.setSelectionRange(next, next < length ? next + 1 : next);
    readSelection();
  };

  // Deleting doesn't always fire `select`; the document's selectionchange follows the caret everywhere.
  useEffect(() => {
    if (!focused) return;
    const onChange = () => { if (document.activeElement === inputRef.current) readSelection(); };
    document.addEventListener("selectionchange", onChange);
    return () => document.removeEventListener("selectionchange", onChange);
  }, [focused, readSelection]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = clean(event.target.value);
    if (next === code) {
      // A rejected character: the input shows it until React restores the value; keep the caret where it was.
      return;
    }
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
    if (next.length === length && code.length < length) onComplete?.(next);
  };

  // A paste is cleaned before it is inserted: the input's maxLength would otherwise cut "123 456" at its space.
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);
    const input = inputRef.current;
    if (event.defaultPrevented || !input || readOnly || disabled) return;
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(FILTER[characters], "");
    const start = input.selectionStart ?? code.length, end = input.selectionEnd ?? code.length;
    const next = clean(code.slice(0, start) + pasted + code.slice(end));
    const caret = Math.min(start + pasted.length, next.length);
    if (next !== code) {
      if (value === undefined) setOwn(next);
      onValueChange?.(next);
      if (next.length === length && code.length < length) onComplete?.(next);
    }
    requestAnimationFrame(() => { input.setSelectionRange(caret, caret); readSelection(); });
  };

  // A press anywhere on the row puts the caret where the code continues (the slots are drawn, not typed into).
  const toEnd = () => {
    const input = inputRef.current;
    if (!input) return;
    requestAnimationFrame(() => {
      const end = input.value.length;
      input.setSelectionRange(end, end);
      readSelection();
    });
  };

  const [start, end] = selection;
  const caretAt = Math.min(start, length - 1);
  const slots: ReactNode[] = [];
  const sizes = groups && groups.reduce((sum, n) => sum + n, 0) === length ? groups : [length];
  let index = 0;
  sizes.forEach((count, group) => {
    if (group > 0) {
      slots.push(<span key={`sep-${group}`} className="area-otp-field__separator" aria-hidden="true"><Glyph name="subtract" /></span>);
    }
    const cells: ReactNode[] = [];
    for (let i = 0; i < count; i++, index++) {
      const char = code[index];
      const active = focused && !disabled && (start === end ? index === caretAt : index >= start && index < end);
      cells.push(
        <span key={index} className="area-otp-field__slot" data-active={active ? "" : undefined} data-filled={char ? "" : undefined}>
          {char ? (mask ? "•" : char) : null}
          {active && start === end && !char ? <span className="area-otp-field__caret" /> : null}
        </span>,
      );
    }
    // The drawn slots repeat the real input's value, so assistive tech reads only the input (no double reading).
    slots.push(<span key={`group-${group}`} className="area-otp-field__group" aria-hidden="true">{cells}</span>);
  });

  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  return (
    <div
      className={otpFieldVariants({ variant, size }, className)}
      style={style}
      data-invalid={isInvalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-read-only={readOnly ? "" : undefined}
      translate="no"
    >
      {slots}
      <input
        ref={setRefs}
        {...rest}
        className="area-otp-field__control"
        type={mask ? "password" : "text"}
        inputMode={inputMode ?? (characters === "digits" ? "numeric" : "text")}
        pattern={PATTERN[characters]}
        autoComplete={autoComplete}
        maxLength={length}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        value={code}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={isInvalid || undefined}
        onChange={handleChange}
        onFocus={event => { onFocus?.(event); setFocused(true); toEnd(); }}
        onBlur={event => { onBlur?.(event); setFocused(false); }}
        onSelect={event => { onSelect?.(event); readSelection(); }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onKeyUp={event => { onKeyUp?.(event); readSelection(); }}
        onPointerUp={event => { onPointerUp?.(event); toEnd(); }}
      />
    </div>
  );
});
