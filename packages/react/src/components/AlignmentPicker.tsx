import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, HTMLAttributes, KeyboardEvent } from "react";
import { alignmentPickerVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export const ALIGNMENT_POSITIONS = [
  "top-left", "top-center", "top-right",
  "middle-left", "center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
] as const;
export type AlignmentPosition = typeof ALIGNMENT_POSITIONS[number];

export interface AlignmentPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Accessible name for the complete position choice. */
  label?: string;
  /** The form name its radios submit under. */
  name?: string;
  /** The chosen position of the nine, controlled. */
  value?: AlignmentPosition;
  /** The position chosen at first, uncontrolled; center by default. */
  defaultValue?: AlignmentPosition;
  /** Called with the chosen position and the change event. */
  onValueChange?: (value: AlignmentPosition, event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * `soft` (default): the field fill behind the grid. `plain`: no fill. `"surface"` is a deprecated alias of `soft`.
   */
  variant?: VariantProps<typeof MANIFESTS.alignmentPicker>["variant"] | "surface";
  /** @deprecated Ignored: the picker fills its parent and its marks follow the type size. */
  size?: "sm" | "md" | "lg";
  /** @deprecated Ignored: the picker always fills its parent, width and height. */
  stretch?: boolean;
  /** Shows a position's glyph as the pointer would preview it (a static hover state for docs). */
  "data-preview"?: AlignmentPosition;
  /** Disables every position. */
  disabled?: boolean;
  /** A form cannot submit without a position chosen. */
  required?: boolean;
}

/** A physical 3×3 position choice. Arrow keys wrap within their row or column. */
export const AlignmentPicker = forwardRef<HTMLDivElement, AlignmentPickerProps>(function AlignmentPicker(
  { label, name, value, defaultValue = "center", onValueChange, variant, size: _size, stretch: _stretch, "data-preview": preview, disabled, required, className, onKeyDown, ...rest }, ref,
) {
  const generatedName = useId();
  const root = useRef<HTMLDivElement | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [localValue, setLocalValue] = useState<AlignmentPosition>(defaultValue);
  const selected = value ?? localValue;

  useEffect(() => {
    if (value !== undefined) return;
    const form = root.current?.closest("form");
    if (!form) return;
    const reset = () => setLocalValue(defaultValue);
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value, defaultValue]);

  function move(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || !(event.target instanceof HTMLInputElement)) return;
    const index = inputs.current.indexOf(event.target);
    if (index < 0) return;
    const row = Math.floor(index / 3);
    const column = index % 3;
    let next = -1;
    switch (event.key) {
      case "ArrowLeft": next = row * 3 + (column + 2) % 3; break;
      case "ArrowRight": next = row * 3 + (column + 1) % 3; break;
      case "ArrowUp": next = ((row + 2) % 3) * 3 + column; break;
      case "ArrowDown": next = ((row + 1) % 3) * 3 + column; break;
      case "Home": next = 0; break;
      case "End": next = 8; break;
    }
    if (next < 0) return;
    event.preventDefault();
    inputs.current[next]?.focus();
    inputs.current[next]?.click();
  }

  return <div ref={node => {
    root.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }} {...rest} role="radiogroup" aria-label={rest["aria-label"] ?? label} aria-disabled={disabled || undefined} dir="ltr"
    className={alignmentPickerVariants({ variant: variant === "surface" ? "soft" : variant }, className)} onKeyDown={move}>
    {ALIGNMENT_POSITIONS.map((position, index) => <label className="area-alignment-picker__cell" key={position} data-preview={preview === position && selected !== position ? "" : undefined}>
      <input ref={node => { inputs.current[index] = node; }} type="radio" name={name ?? generatedName} value={position}
        checked={selected === position} disabled={disabled} required={required} aria-label={position.replace("-", " ")}
        onChange={event => {
          if (value === undefined) setLocalValue(position);
          onValueChange?.(position, event);
        }} />
      <span className="area-alignment-picker__dot" aria-hidden="true"><i /><i /><i /></span>
    </label>)}
  </div>;
});
