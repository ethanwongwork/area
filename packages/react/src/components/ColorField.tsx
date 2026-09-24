import { forwardRef, useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { colorFieldVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Input, type InputProps } from "./Input.tsx";
import { ColorSwatch } from "./ColorSwatch.tsx";

/** Canonical 6- or 8-digit hex; short forms and an omitted hash are accepted. */
export function normalizeHexColor(input: string): string | null {
  const digits = input.trim().replace(/^#/, "");
  if (!/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(digits)) return null;
  const expanded = digits.length <= 4 ? [...digits].map(digit => digit + digit).join("") : digits;
  return `#${expanded.toUpperCase()}`;
}

export interface ColorFieldProps extends Omit<InputProps, "value" | "defaultValue" | "type" | "icon" | "leadingIcon" | "trailingIcon" | "prefix" | "suffix" | "maxLength"> {
  value?: string;
  defaultValue?: string;
  /** Called only when a valid hex value is committed by blur or Enter. */
  onValueChange?: (value: string) => void;
  /** Public sizing/treatment reuse Input's matching control tiers. */
  size?: VariantProps<typeof MANIFESTS.colorField>["size"];
}

/** A hex editor. Partial drafts stay visible; blur/Enter commit and Escape restores. */
export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(function ColorField(
  { value, defaultValue = "#6366F1", onValueChange, size, variant, fullWidth, className, onChange, onBlur, onKeyDown, invalid, required, name, readOnly, ...rest }, ref,
) {
  const initial = normalizeHexColor(defaultValue) ?? "#6366F1";
  const [localValue, setLocalValue] = useState(initial);
  const committed = value === undefined ? localValue : normalizeHexColor(value) ?? value;
  const [draft, setDraft] = useState(committed);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const draftInvalid = draft !== "" && normalizeHexColor(draft) === null;

  useEffect(() => { setDraft(committed); }, [committed]);
  useEffect(() => {
    if (value !== undefined) return;
    const form = inputRef.current?.form;
    if (!form) return;
    const reset = () => { setLocalValue(initial); setDraft(initial); };
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value, initial]);

  function commit() {
    const next = draft === "" && !required ? "" : normalizeHexColor(draft);
    if (next === null) { setDraft(committed); return; }
    if (value === undefined) { setLocalValue(next); setDraft(next); }
    else setDraft(committed);
    if (next !== committed) onValueChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Enter") { commit(); event.preventDefault(); }
    if (event.key === "Escape") { setDraft(committed); event.preventDefault(); }
  }

  return <Input {...rest} ref={node => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }} type="text" name={name} value={draft} required={required} readOnly={readOnly}
    pattern="#[0-9a-fA-F]{3,4}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}"
    maxLength={9} spellCheck={false} autoCapitalize="off"
    variant={variant} size={size} fullWidth={fullWidth} monospace
    className={cx(colorFieldVariants({ size, fullWidth }), className)}
    leadingIcon={<ColorSwatch color={committed || "transparent"} aria-hidden="true" />}
    invalid={invalid || draftInvalid}
    onChange={(event: ChangeEvent<HTMLInputElement>) => { setDraft(event.target.value); onChange?.(event); }}
    onBlur={event => { onBlur?.(event); commit(); }} onKeyDown={handleKeyDown} />;
});
