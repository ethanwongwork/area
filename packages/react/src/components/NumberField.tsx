import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef, useContext, useEffect, useId, useRef, useState } from "react";
import { InputGroupContext } from "./input-group-context.ts";
import type { InputHTMLAttributes, PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { numberFieldVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { calculateNumber, clampNumber, steppedNumber } from "./number-math.ts";
import { Glyph } from "./Glyph.tsx";

export interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "defaultValue" | "onChange" | "step" | "min" | "max"> {
  value?: number | null;
  defaultValue?: number | null;
  /** The new value, and the event behind it (a held stepper's repeats have none; audit C-7). */
  onValueChange?: (value: number | null, event?: SyntheticEvent) => void;
  onValueCommit?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: VariantProps<typeof MANIFESTS.numberField>["size"];
  variant?: VariantProps<typeof MANIFESTS.numberField>["variant"];
  fullWidth?: boolean;
  /** Trailing, non-editable unit text. */
  unit?: string;
  /**
   * Decrease and increase buttons. `true` puts both after the value; `"split"` puts minus before it and plus after,
   * with the value centred, for a count or a quantity.
   */
  steppers?: boolean | "split";
  /**
   * A control after the value, such as a ghost Custom select for a sizing mode (Figma's "360 Fill"). It sits in a
   * nested square at the field's end; a Custom select in it takes that height.
   */
  trailing?: ReactNode;
  /**
   * A leading drag handle; pointer movement changes the value by one step per 8px. Pass the
   * field's letter or icon (Figma's X, W or rotation glyph) to make it the handle; `true`
   * shows a grip. The whole square around it is the drag target.
   */
  scrub?: boolean | ReactNode;
  /** Visible handle caption; aria-label still names the numeric input. */
  scrubLabel?: string;
  /** Empty mixed selection; the next step begins at zero or the nearest bound. */
  mixed?: boolean;
  locale?: string;
  /** Thousands separators in the resting display (locale-aware). Inspectors turn them off, as Figma shows 1202. */
  grouping?: boolean;
  /** Number of fraction digits in the resting display. Defaults to the step's precision. */
  fractionDigits?: number;
  validationStatus?: "error" | "success" | "warning";
  /** Error paint and `aria-invalid`, as Input, Select and Textarea take it (audit S17, B-20). */
  invalid?: boolean;
  "data-validation-status"?: "error" | "success" | "warning";
}

/** Text-entry spinbutton with deliberate commit/cancel and bounded arithmetic entry. */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { value, defaultValue = null, onValueChange, onValueCommit, min, max, step = 1,
    size, variant, fullWidth, unit, steppers, trailing, scrub, scrubLabel = "Drag to adjust",
    mixed, locale, grouping = true, fractionDigits, validationStatus: validationStatusProp, invalid, "data-validation-status": fieldValidationStatus,
    disabled: disabledProp, readOnly, required, name, id,
    className, style, onKeyDown, onBlur, onFocus, onPointerDown, onPointerMove, onPointerUp,
    "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid, ...rest }, ref,
) {
  variant = useSystemDefault("numberField", "variant", variant); // the system's default (SystemDefaults) where the use gives none
  // Inside an InputGroup, the group's Field state reaches the control (audit B-14).
  const groupState = useContext(InputGroupContext);
  const disabled = disabledProp ?? groupState.disabled;
  const validationStatus = validationStatusProp ?? groupState.validationStatus;
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<number | null>(defaultValue);
  const numeric = controlled ? value : internal;
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [hasScrubbed, setHasScrubbed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrubOrigin = useRef<{ x: number; value: number; emitted: number } | null>(null);
  const removeEscape = useRef<(() => void) | null>(null);
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
  const formatter = new Intl.NumberFormat(locale, { numberingSystem: "latn", maximumFractionDigits: digits, minimumFractionDigits: 0, useGrouping: grouping });
  const display = draft ?? (mixed ? "" : numeric == null ? "" : formatter.format(numeric));
  const disabledState = disabled || readOnly;
  const invalidState = error || invalid || validationStatus === "error" || fieldValidationStatus === "error" || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const resolvedValidation = invalidState ? "error" : validationStatus ?? fieldValidationStatus;
  const commitValue = (next: number | null, event?: SyntheticEvent) => {
    const bounded = next == null ? null : clampNumber(next, min, max);
    if (!controlled) setInternal(bounded);
    onValueChange?.(bounded, event);
    onValueCommit?.(bounded);
    setDraft(null);
    setError(false);
  };
  const commitDraft = (event?: SyntheticEvent) => {
    if (draft === null) return;
    if (!draft.trim()) { if (!required) commitValue(null, event); else setError(true); return; }
    const parsed = calculateNumber(draft, numeric ?? 0, decimal, group);
    if (parsed === null) { setError(true); return; }
    commitValue(parsed, event);
  };
  const stepBy = (delta: number, event?: SyntheticEvent) => {
    if (disabledState) return;
    const next = steppedNumber(mixed ? clampNumber(0, min, max) : numeric ?? clampNumber(0, min, max), delta, validStep, min, max);
    commitValue(next, event);
  };
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    // Keys while an input method is composing belong to the composition (audit B-13).
    if (!disabledState && !event.defaultPrevented && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      const multiplier = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        stepBy((event.key === "ArrowUp" ? 1 : -1) * multiplier, event);
      } else if (event.key === "Home" && min !== undefined) {
        event.preventDefault(); commitValue(min, event);
      } else if (event.key === "End" && max !== undefined) {
        event.preventDefault(); commitValue(max, event);
      } else if (event.key === "Enter" && draft !== null) {
        // Enter commits an edit; with nothing to commit it submits the form, as Input (audit B-30).
        event.preventDefault(); commitDraft(event);
      } else if (event.key === "Escape" && (draft !== null || error)) {
        // Only an edit in progress claims Escape; otherwise it reaches the popover or dialog.
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
    // Escape during a drag restores the starting value, as the spec's "cancel restores" (audit B-30).
    const onEscape = (key: KeyboardEvent) => {
      if (key.key !== "Escape" || !scrubOrigin.current) return;
      key.preventDefault(); key.stopPropagation();
      cancelScrub();
    };
    removeEscape.current?.();
    addEventListener("keydown", onEscape, true);
    removeEscape.current = () => removeEventListener("keydown", onEscape, true);
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
      onValueChange?.(next, event);
    }
  };
  const endScrub = () => {
    if (scrubOrigin.current) onValueCommit?.(scrubOrigin.current.emitted);
    scrubOrigin.current = null;
    setHasScrubbed(false);
    removeEscape.current?.(); removeEscape.current = null;
  };
  const cancelScrub = () => {
    const origin = scrubOrigin.current;
    if (origin && !controlled) setInternal(origin.value);
    if (origin && origin.emitted !== origin.value) onValueChange?.(origin.value);
    scrubOrigin.current = null;
    setHasScrubbed(false);
    removeEscape.current?.(); removeEscape.current = null;
  };
  useEffect(() => () => removeEscape.current?.(), []);
  useEffect(() => { if (mixed) setDraft(null); }, [mixed]);
  // Press and hold repeats, as native spinners and React Aria do: one step now, then every
  // 60ms after 400ms. The latest stepBy is read through a ref so repeats see the new value.
  const stepRef = useRef(stepBy);
  stepRef.current = stepBy;
  const repeat = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopRepeat = () => { if (repeat.current) clearTimeout(repeat.current); repeat.current = null; };
  const startRepeat = (delta: number, event?: SyntheticEvent) => {
    stopRepeat();
    // A bound disables the button mid-press, so it never sees pointerup; the window does.
    window.addEventListener("pointerup", stopRepeat, { once: true });
    stepRef.current(delta, event);
    const tick = (wait: number) => { repeat.current = setTimeout(() => { stepRef.current(delta); tick(60); }, wait); };
    tick(400);
  };
  useEffect(() => stopRepeat, []);

  // className and style land on the same box, the shell (audit S17, B-20).
  const split = steppers === "split";
  const stepButton = (kind: "decrease" | "increase") => {
    const delta = kind === "increase" ? 1 : -1;
    const atBound = kind === "increase" ? max !== undefined && numeric != null && numeric >= max : min !== undefined && numeric != null && numeric <= min;
    const verb = kind === "increase" ? "Increase" : "Decrease";
    return <button key={kind} type="button" className="area-number-field__step" tabIndex={-1}
      aria-label={ariaLabelledBy ? undefined : `${verb} ${ariaLabel ?? "value"}`}
      aria-labelledby={ariaLabelledBy ? `${inputId}-${kind} ${ariaLabelledBy}` : undefined}
      disabled={disabledState || atBound}
      onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); inputRef.current?.focus(); startRepeat(delta, event); }}
      onPointerUp={stopRepeat} onPointerLeave={stopRepeat} onPointerCancel={stopRepeat}
      onClick={event => { if (event.detail === 0) stepBy(delta, event); }}>
      <span id={`${inputId}-${kind}`} className="area-sr-only">{verb}</span><Glyph name={kind === "increase" ? "add" : "subtract"} />
    </button>;
  };
  const showSteppers = steppers && !readOnly;

  return <span className={numberFieldVariants({ size, variant, fullWidth, steppers: split ? "split" : undefined }, className)} style={style}
    data-disabled={disabled ? "" : undefined} data-read-only={readOnly ? "" : undefined}
    data-invalid={invalidState ? "" : undefined}
    data-success={resolvedValidation === "success" ? "" : undefined}
    data-warning={resolvedValidation === "warning" ? "" : undefined}
    data-scrubbing={hasScrubbed ? "" : undefined}
    // The unit follows the number, so the shell has empty space; a press there edits the value.
    onPointerDown={event => { if (event.target === event.currentTarget && !disabled) { event.preventDefault(); inputRef.current?.focus(); } }}>
    {scrub ? <span className="area-number-field__scrub" aria-hidden="true" title={scrubLabel}
      data-glyph={scrub === true ? "" : undefined}
      onPointerDown={startScrub} onPointerMove={moveScrub} onPointerUp={endScrub} onPointerCancel={cancelScrub}>
      {scrub === true ? <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 3v10M8 3v10M11 3v10" stroke="currentColor" strokeLinecap="round" /></svg> : scrub}
    </span> : null}
    {split && showSteppers ? <span className="area-number-field__steppers">{stepButton("decrease")}</span> : null}
    <input {...rest} ref={node => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} id={inputId} type="text" inputMode="decimal"
      role="spinbutton" className="area-number-field__control" value={display}
      aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={[ariaDescribedBy, error ? `${inputId}-parse-error` : undefined].filter(Boolean).join(" ") || undefined}
      aria-valuemin={min} aria-valuemax={max} aria-valuenow={mixed || numeric == null ? undefined : numeric}
      aria-valuetext={mixed ? "Mixed values" : numeric == null ? undefined : unit ? `${formatter.format(numeric)} ${unit}` : undefined}
      aria-invalid={invalidState ? true : ariaInvalid} disabled={disabled} readOnly={readOnly} required={required}
      placeholder={mixed ? "Mixed" : rest.placeholder}
      onChange={event => { setDraft(event.target.value); setError(false); }}
      onKeyDown={handleKeyDown} onBlur={event => { commitDraft(event); onBlur?.(event); }} onFocus={onFocus}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
    {error && <span id={`${inputId}-parse-error`} className="area-sr-only">Enter a valid number or calculation</span>}
    {name && <input type="hidden" name={name} value={mixed || numeric == null ? "" : String(numeric)} disabled={disabled} />}
    {/* No unit beside "Mixed" or an empty value: it would read as part of the placeholder. */}
    {unit && display !== "" && <span className="area-number-field__unit" aria-hidden="true">{unit}</span>}
    {trailing != null && trailing !== false ? <span className="area-number-field__trailing">{trailing}</span> : null}
    {/* Read-only shows the value, not dead controls: no steppers, as read-only Switch keeps full paint (audit B-30). */}
    {showSteppers && <span className="area-number-field__steppers">{split ? stepButton("increase") : [stepButton("decrease"), stepButton("increase")]}</span>}
  </span>;
});
