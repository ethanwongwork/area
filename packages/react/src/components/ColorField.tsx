import { forwardRef, useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, SyntheticEvent } from "react";
import { colorFieldVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Input, type InputProps } from "./Input.tsx";
import { InputGroup } from "./InputGroup.tsx";
import { NumberField } from "./NumberField.tsx";
import { ColorSwatch } from "./ColorSwatch.tsx";

/** Canonical 6- or 8-digit hex; short forms and an omitted hash are accepted. */
export function normalizeHexColor(input: string): string | null {
  const digits = input.trim().replace(/^#/, "");
  if (!/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(digits)) return null;
  const expanded = digits.length <= 4 ? [...digits].map(digit => digit + digit).join("") : digits;
  return `#${expanded.toUpperCase()}`;
}

export interface ColorFieldProps extends Omit<InputProps, "value" | "defaultValue" | "type" | "icon" | "leadingIcon" | "trailingIcon" | "prefix" | "suffix" | "maxLength"> {
  /** Edit opacity separately while keeping one canonical hex value. */
  alpha?: boolean;
  opacityLabel?: string;
  value?: string;
  defaultValue?: string;
  /** Called only when a valid hex value is committed by blur or Enter. */
  /** The committed hex, and the event that committed it (audit C-7). */
  onValueChange?: (value: string, event?: SyntheticEvent) => void;
  /** Public sizing/treatment reuse Input's matching control tiers. */
  size?: VariantProps<typeof MANIFESTS.colorField>["size"];
}

/** A hex editor. Partial drafts stay visible; blur/Enter commit and Escape restores. */
export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(function ColorField(
  { alpha, opacityLabel = "Opacity", value, defaultValue = "#8D4DF3", onValueChange, size, variant, fullWidth, className, onChange, onBlur, onKeyDown, invalid, required, name, readOnly, disabled, ...rest }, ref,
) {
  const initial = normalizeHexColor(defaultValue) ?? "#8D4DF3";
  const [localValue, setLocalValue] = useState(initial);
  const committed = value === undefined ? localValue : normalizeHexColor(value) ?? value;
  const displayHex = (hex: string) => alpha ? hex.slice(1, 7) : hex;
  const [draft, setDraft] = useState(displayHex(committed));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const draftInvalid = draft !== "" && normalizeHexColor(draft) === null;

  useEffect(() => { setDraft(displayHex(committed)); }, [committed, alpha]);
  useEffect(() => {
    if (value !== undefined) return;
    const form = inputRef.current?.form;
    if (!form) return;
    const reset = () => { setLocalValue(initial); setDraft(displayHex(initial)); };
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value, initial, alpha]);

  function commit(event?: SyntheticEvent) {
    let next = draft === "" && !required ? "" : normalizeHexColor(draft);
    if (alpha && next && next.length === 7 && committed.length === 9) next += committed.slice(7);
    if (next === null) { setDraft(displayHex(committed)); return; }
    if (value === undefined) { setLocalValue(next); setDraft(displayHex(next)); }
    else setDraft(displayHex(committed));
    if (next !== committed) onValueChange?.(next, event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Enter") { commit(event); event.preventDefault(); }
    if (event.key === "Escape") { setDraft(displayHex(committed)); event.preventDefault(); }
  }

  const hexInput = <Input {...rest} ref={node => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }} type="text" name={alpha ? undefined : name} value={draft} required={required} readOnly={readOnly} disabled={disabled}
    pattern={alpha ? "#?[0-9a-fA-F]{3,4}|#?[0-9a-fA-F]{6}|#?[0-9a-fA-F]{8}" : "#[0-9a-fA-F]{3,4}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}"}
    maxLength={9} spellCheck={false} autoCapitalize="off"
    variant={variant} size={size} fullWidth={fullWidth}
    className={alpha ? undefined : cx(colorFieldVariants({ size, fullWidth }), className)}
    leadingIcon={<ColorSwatch color={committed || "transparent"} size="sm" aria-hidden="true" />}
    invalid={invalid || draftInvalid}
    onChange={(event: ChangeEvent<HTMLInputElement>) => { setDraft(event.target.value); onChange?.(event); }}
    onBlur={event => { onBlur?.(event); commit(event); }} onKeyDown={handleKeyDown} />;
  if (!alpha) return hexInput;
  return <InputGroup size={size} variant={variant} fullWidth={fullWidth}
    className={cx(colorFieldVariants({ size, fullWidth, alpha }), className)}>
    {hexInput}
    <NumberField className="area-color-field__opacity" aria-label={opacityLabel}
      value={Math.round(parseInt(committed.slice(7) || "FF", 16) / 255 * 100)}
      min={0} max={100} step={1} unit="%" size={size} disabled={disabled} readOnly={readOnly}
      onValueChange={(percent, event) => {
        if (percent === null) return;
        const next = (committed.slice(0, 7) || "#000000") + Math.round(percent / 100 * 255).toString(16).padStart(2, "0").toUpperCase();
        if (value === undefined) setLocalValue(next);
        if (next !== committed) onValueChange?.(next, event);
      }} />
    {name && <input type="hidden" name={name} value={committed} disabled={disabled} form={rest.form} />}
  </InputGroup>;
});
