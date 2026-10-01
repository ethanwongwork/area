import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, HTMLAttributes, KeyboardEvent } from "react";
import { ColorSwatch } from "./ColorSwatch.tsx";
import { colorSwatchPickerVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export interface ColorSwatchOption {
  /** Submitted value and CSS color used to paint the swatch. Values must be unique. */
  value: string;
  /** Human-readable color name announced by assistive technology. */
  label: string;
  disabled?: boolean;
}

export interface ColorSwatchPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** @deprecated Name it with `aria-label` (audit S17: `label` is visible text; names are `aria-label`). */
  label?: string;
  options: readonly ColorSwatchOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  size?: VariantProps<typeof MANIFESTS.colorSwatchPicker>["size"];
  layout?: VariantProps<typeof MANIFESTS.colorSwatchPicker>["layout"];
  /** Number of columns in grid layout. */
  columns?: number;
  disabled?: boolean;
  required?: boolean;
}

/** A single color choice backed by native radio inputs. */
export const ColorSwatchPicker = forwardRef<HTMLDivElement, ColorSwatchPickerProps>(function ColorSwatchPicker(
  { label, options, name, value, defaultValue, onValueChange, size, layout = "grid", columns = 6,
    disabled, required, className, style, onKeyDown, ...rest }, ref,
) {
  const generatedName = useId();
  const root = useRef<HTMLDivElement | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  // No choice until one is made or given (audit F-19): `required` can then fail, and "none" is
  // a state the picker can show. It used to preselect the first enabled swatch.
  const initial = defaultValue ?? "";
  const [localValue, setLocalValue] = useState(initial);
  const selected = value ?? localValue;
  const count = Math.max(1, Math.floor(Number.isFinite(columns) ? columns : 6));

  useEffect(() => {
    if (value !== undefined) return;
    const form = root.current?.closest("form");
    if (!form) return;
    const reset = () => setLocalValue(defaultValue ?? "");
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value, defaultValue, options]);

  function move(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || !(event.target instanceof HTMLInputElement)) return;
    const index = inputs.current.indexOf(event.target);
    if (index < 0) return;
    const enabled = (candidate: number) => candidate >= 0 && candidate < options.length && !options[candidate]?.disabled;
    const rtl = getComputedStyle(root.current!).direction === "rtl";
    let next = -1;
    if (event.key === "Home") next = options.findIndex((_, candidate) => enabled(candidate));
    else if (event.key === "End") next = options.findLastIndex((_, candidate) => enabled(candidate));
    else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      if ((layout === "grid" || layout === "palette") && !horizontal) {
        const rows = Math.ceil(options.length / count);
        const column = index % count;
        const currentRow = Math.floor(index / count);
        for (let turn = 1; turn < rows && next < 0; turn++) {
          const row = ((currentRow + (forward ? turn : -turn)) % rows + rows) % rows;
          for (let distance = 0; distance < count && next < 0; distance++) {
            for (const offset of distance === 0 ? [0] : [-distance, distance]) {
              const candidateColumn = column + offset;
              if (candidateColumn >= 0 && candidateColumn < count && enabled(row * count + candidateColumn)) {
                next = row * count + candidateColumn;
                break;
              }
            }
          }
        }
      } else {
        const direction = horizontal && rtl ? (forward ? -1 : 1) : (forward ? 1 : -1);
        for (let turn = 1; turn <= options.length; turn++) {
          const candidate = ((index + direction * turn) % options.length + options.length) % options.length;
          if (enabled(candidate)) { next = candidate; break; }
        }
      }
    } else return;
    event.preventDefault();
    if (next >= 0 && next !== index) {
      inputs.current[next]?.focus();
      inputs.current[next]?.click();
    }
  }

  return <div ref={node => {
    root.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }} {...rest} role="radiogroup" aria-label={rest["aria-label"] ?? label} aria-disabled={disabled || undefined}
    className={colorSwatchPickerVariants({ size, layout }, className)}
    style={{ ...style, "--_columns": count } as CSSProperties} onKeyDown={move}>
    {options.map((option, index) => <label className="area-color-swatch-picker__cell" key={option.value}>
      <input ref={node => { inputs.current[index] = node; }} type="radio" name={name ?? generatedName}
        value={option.value} checked={selected === option.value} disabled={disabled || option.disabled}
        required={required} aria-label={option.label}
        onChange={event => {
          if (value === undefined) setLocalValue(option.value);
          onValueChange?.(option.value, event);
        }} />
      <ColorSwatch color={option.value} aria-hidden="true" />
    </label>)}
  </div>;
});
