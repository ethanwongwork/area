import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { InputHTMLAttributes, PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { numberFieldVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { calculateNumber, clampNumber, steppedNumber } from "./number-math.ts";
import { Glyph } from "./Glyph.tsx";

export interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "defaultValue" | "onChange" | "step" | "min" | "max"> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  onValueCommit?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: VariantProps<typeof MANIFESTS.numberField>["size"];
  variant?: VariantProps<typeof MANIFESTS.numberField>["variant"];
  fullWidth?: boolean;
  /** Trailing, non-editable unit text. */
  unit?: string;
  /** Show stacked increment and decrement buttons. */
  steppers?: boolean;
  /** A visible leading drag handle. Pointer movement changes the value by one step per 8px. */
  scrub?: boolean;
  /** Visible handle caption; aria-label still names the numeric input. */
  scrubLabel?: string;
  /** Empty mixed selection; the next step begins at zero or the nearest bound. */
  mixed?: boolean;
  locale?: string;
  /** Number of fraction digits in the resting display. Defaults to the step's precision. */
  fractionDigits?: number;
  validationStatus?: "error" | "success" | "warning";
  "data-validation-status"?: "error" | "success" | "warning";
}

/** Text-entry spinbutton with deliberate commit/cancel and bounded arithmetic entry. */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { value, defaultValue = null, onValueChange, onValueCommit, min, max, step = 1,
    size, variant, fullWidth, unit, steppers, scrub, scrubLabel = "Drag to adjust",
    mixed, locale, fractionDigits, validationStatus, "data-validation-status": fieldValidationStatus,
    disabled, readOnly, required, name, id,
    className, onKeyDown, onBlur, onFocus, onPointerDown, onPointerMove, onPointerUp,
    "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid, ...rest }, ref,
) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<number | null>(defaultValue);
  const numeric = controlled ? value : internal;
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [hasScrubbed, setHasScrubbed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrubOrigin = useRef<{ x: number; value: number; emitted: number } | null>(null);
  const generatedId = useId();
  const inputId = id ?? `area-number-${generatedId}`;
  useEffect(() => {
    if (controlled) return;
    const form = inputRef.current?.form;
    const reset = () => { setInternal(defaultValue); setDraft(null); setError(false); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [controlled, defaultValue]);
  const validStep = Number.isFinite(step) && step > 0 ? step : 1;
  const digits = Math.min(10, Math.max(0, fractionDigits ?? Math.max((String(validStep).split(".")[1] ?? "").length, (String(numeric ?? 0).split(".")[1] ?? "").length)));
  const symbols = new Intl.NumberFormat(locale, { numberingSystem: "latn" }).formatToParts(12345.6);
  const decimal = symbols.find(part => part.type === "decimal")?.value ?? ".";
  const group = symbols.find(part => part.type === "group")?.value ?? ",";
  const formatter = new Intl.NumberFormat(locale, { numberingSystem: "latn", maximumFractionDigits: digits, minimumFractionDigits: 0 });
  const display = draft ?? (mixed ? "" : numeric == null ? "" : formatter.format(numeric));
  const disabledState = disabled || readOnly;
  const invalidState = error || validationStatus === "error" || fieldValidationStatus === "error" || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const resolvedValidation = invalidState ? "error" : validationStatus ?? fieldValidationStatus;
  const commitValue = (next: number | null) => {
    const bounded = next == null ? null : clampNumber(next, min, max);
    if (!controlled) setInternal(bounded);
    onValueChange?.(bounded);
    onValueCommit?.(bounded);
    setDraft(null);
    setError(false);
  };
  const commitDraft = () => {
    if (draft === null) return;
    if (!draft.trim()) { if (!required) commitValue(null); else setError(true); return; }
    const parsed = calculateNumber(draft, numeric ?? 0, decimal, group);
    if (parsed === null) { setError(true); return; }
    commitValue(parsed);
  };
  const stepBy = (delta: number) => {
    if (disabledState) return;
    const next = steppedNumber(mixed ? clampNumber(0, min, max) : numeric ?? clampNumber(0, min, max), delta, validStep, min, max);
    commitValue(next);
  };
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!disabledState && !event.defaultPrevented) {
      const multiplier = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        stepBy((event.key === "ArrowUp" ? 1 : -1) * multiplier);
      } else if (event.key === "Home" && min !== undefined) {
        event.preventDefault(); commitValue(min);
      } else if (event.key === "End" && max !== undefined) {
        event.preventDefault(); commitValue(max);
      } else if (event.key === "Enter") {
        event.preventDefault(); commitDraft();
      } else if (event.key === "Escape") {
        event.preventDefault(); setDraft(null); setError(false);
      }
    }
    onKeyDown?.(event);
  };
  const startScrub = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (disabledState || event.button !== 0) return;
    const initial = mixed ? clampNumber(0, min, max) : numeric ?? clampNumber(0, min, max);
    scrubOrigin.current = { x: event.clientX, value: initial, emitted: initial };
    event.currentTarget.setPointerCapture(event.pointerId);
    setHasScrubbed(true);
  };
  const moveScrub = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const origin = scrubOrigin.current;
    if (!origin) return;
    const multiplier = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
    const ticks = Math.trunc((event.clientX - origin.x) / 8);
    const next = steppedNumber(origin.value, ticks * multiplier, validStep, min, max);
    if (next !== origin.emitted) {
      origin.emitted = next;
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    }
  };
  const endScrub = () => {
    if (scrubOrigin.current) onValueCommit?.(scrubOrigin.current.emitted);
    scrubOrigin.current = null;
    setHasScrubbed(false);
  };
  const cancelScrub = () => {
    const origin = scrubOrigin.current;
    if (origin && !controlled) setInternal(origin.value);
    if (origin && origin.emitted !== origin.value) onValueChange?.(origin.value);
    scrubOrigin.current = null;
    setHasScrubbed(false);
  };
  useEffect(() => { if (mixed) setDraft(null); }, [mixed]);

  return <span className={numberFieldVariants({ size, variant, fullWidth }, className)}
    data-disabled={disabled ? "" : undefined} data-read-only={readOnly ? "" : undefined}
    data-invalid={invalidState ? "" : undefined}
    data-success={resolvedValidation === "success" ? "" : undefined}
    data-warning={resolvedValidation === "warning" ? "" : undefined}
    data-scrubbing={hasScrubbed ? "" : undefined}>
    {scrub && <span className="area-number-field__scrub" aria-hidden="true" title={scrubLabel}
      onPointerDown={startScrub} onPointerMove={moveScrub} onPointerUp={endScrub} onPointerCancel={cancelScrub}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 3v10M8 3v10M11 3v10" stroke="currentColor" strokeLinecap="round" /></svg>
    </span>}
    <input {...rest} ref={node => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} id={inputId} type="text" inputMode="decimal"
      role="spinbutton" className="area-number-field__control" value={display}
      aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={[ariaDescribedBy, error ? `${inputId}-parse-error` : undefined].filter(Boolean).join(" ") || undefined}
      aria-valuemin={min} aria-valuemax={max} aria-valuenow={mixed || numeric == null ? undefined : numeric}
      aria-valuetext={mixed ? "Mixed values" : numeric == null ? undefined : unit ? `${formatter.format(numeric)} ${unit}` : undefined}
      aria-invalid={invalidState ? true : ariaInvalid} disabled={disabled} readOnly={readOnly} required={required}
      placeholder={mixed ? "Mixed" : rest.placeholder}
      onChange={event => { setDraft(event.target.value); setError(false); }}
      onKeyDown={handleKeyDown} onBlur={event => { commitDraft(); onBlur?.(event); }} onFocus={onFocus}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
    {error && <span id={`${inputId}-parse-error`} className="area-sr-only">Enter a valid number or calculation</span>}
    {name && <input type="hidden" name={name} value={mixed || numeric == null ? "" : String(numeric)} disabled={disabled} />}
    {unit && <span className="area-number-field__unit" aria-hidden="true">{unit}</span>}
    {steppers && <span className="area-number-field__steppers">
      <button type="button" className="area-number-field__step" aria-label={ariaLabelledBy ? undefined : `Increase ${ariaLabel ?? "value"}`} aria-labelledby={ariaLabelledBy ? `${inputId}-increase ${ariaLabelledBy}` : undefined} disabled={disabledState || max !== undefined && numeric !== null && numeric !== undefined && numeric >= max} onClick={() => stepBy(1)}><span id={`${inputId}-increase`} className="area-sr-only">Increase</span><Glyph name="chevron-down" rotate={180} /></button>
      <button type="button" className="area-number-field__step" aria-label={ariaLabelledBy ? undefined : `Decrease ${ariaLabel ?? "value"}`} aria-labelledby={ariaLabelledBy ? `${inputId}-decrease ${ariaLabelledBy}` : undefined} disabled={disabledState || min !== undefined && numeric !== null && numeric !== undefined && numeric <= min} onClick={() => stepBy(-1)}><span id={`${inputId}-decrease`} className="area-sr-only">Decrease</span><Glyph name="chevron-down" /></button>
    </span>}
  </span>;
});
