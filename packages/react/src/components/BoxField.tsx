import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode, SyntheticEvent } from "react";
import { boxFieldVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { NumberField } from "./NumberField.tsx";

/** Four values in CSS order: top, right, bottom, left for sides; top-left, top-right, bottom-right, bottom-left for corners. */
export type BoxValue = readonly [number | null, number | null, number | null, number | null];

export interface BoxFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Padding-like sides, or the corners of a radius. */
  kind?: "sides" | "corners";
  /** Visible caption ("Padding", "Corner radius"); names the group and each field. */
  label: string;
  /** Keep the caption for assistive tech only (the row already has a visible one). */
  hideLabel?: boolean;
  value?: BoxValue;
  defaultValue?: BoxValue;
  onValueChange?: (value: BoxValue, event?: SyntheticEvent) => void;
  /** One field per side or corner; otherwise linked (a horizontal and vertical pair, or one radius). */
  independent?: boolean;
  defaultIndependent?: boolean;
  onIndependentChange?: (independent: boolean) => void;
  /** Show the toggle between linked and independent. Off keeps the current mode fixed. */
  toggle?: boolean;
  size?: VariantProps<typeof MANIFESTS.boxField>["size"];
  /** The fields' treatment, passed to each NumberField (a composition prop, not a CSS axis of
   * the group: framework-free markup sets it on each field). */
  variant?: VariantProps<typeof MANIFESTS.numberField>["variant"];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  /** Values can be read and copied but not changed; the linked toggle is unavailable (audit B-20). */
  readOnly?: boolean;
  /** Submits the four values as one CSS shorthand ("8 16 8 16"). */
  name?: string;
}

type Part = { key: string; label: string; indices: number[]; icon: ReactNode; wide?: boolean };
const side = (rotate?: 90 | 180 | 270) => <Glyph name="padding-side" rotate={rotate} />;
const corner = (rotate?: 90 | 180 | 270) => <Glyph name="corner" rotate={rotate} />;

/*
 * spec (docs/specs/box-field.md): each axis keeps its column when split -- linked padding is
 * horizontal | vertical, split it is left | top over right | bottom -- and corners sit where
 * they are on the box.
 */
const PARTS = {
  sides: {
    linked: [
      { key: "horizontal", label: "Horizontal", indices: [3, 1], icon: <Glyph name="padding-axis" /> },
      { key: "vertical", label: "Vertical", indices: [0, 2], icon: <Glyph name="padding-axis" rotate={90} /> },
    ],
    independent: [
      { key: "left", label: "Left", indices: [3], icon: side() },
      { key: "top", label: "Top", indices: [0], icon: side(90) },
      { key: "right", label: "Right", indices: [1], icon: side(180) },
      { key: "bottom", label: "Bottom", indices: [2], icon: side(270) },
    ],
  },
  corners: {
    linked: [{ key: "all", label: "", indices: [0, 1, 2, 3], icon: corner(), wide: true }],
    independent: [
      { key: "top-left", label: "Top left", indices: [0], icon: corner() },
      { key: "top-right", label: "Top right", indices: [1], icon: corner(90) },
      { key: "bottom-left", label: "Bottom left", indices: [3], icon: corner(270) },
      { key: "bottom-right", label: "Bottom right", indices: [2], icon: corner(180) },
    ],
  },
} satisfies Record<string, Record<string, Part[]>>;

const EMPTY: BoxValue = [0, 0, 0, 0];

/** Padding or corner radius, edited linked or one field per side or corner. */
export const BoxField = forwardRef<HTMLDivElement, BoxFieldProps>(function BoxField(
  { kind = "sides", label, hideLabel, value, defaultValue = EMPTY, onValueChange,
    independent, defaultIndependent = false, onIndependentChange, toggle = true,
    size, variant, min = 0, max, step, unit, disabled, readOnly, name, className, ...rest }, ref,
) {
  const labelId = useId();
  const [internal, setInternal] = useState<BoxValue>(defaultValue);
  const values = value ?? internal;
  const [internalIndependent, setInternalIndependent] = useState(defaultIndependent);
  const split = independent ?? internalIndependent;
  const noun = label.toLowerCase();

  const update = (indices: number[], next: number | null, event?: SyntheticEvent) => {
    const copy = [...values] as [number | null, number | null, number | null, number | null];
    for (const index of indices) copy[index] = next;
    if (value === undefined) setInternal(copy);
    onValueChange?.(copy, event);
  };
  const setSplit = (next: boolean) => {
    if (independent === undefined) setInternalIndependent(next);
    onIndependentChange?.(next);
  };

  const parts: Part[] = PARTS[kind][split ? "independent" : "linked"];
  const fields = parts.map(part => {
    const [first, ...others] = part.indices.map(index => values[index] ?? null);
    const mixed = others.some(other => other !== first);
    return <NumberField key={part.key} className={part.wide ? `${boxFieldVariants.element("field")} ${boxFieldVariants.element("field")}--wide` : boxFieldVariants.element("field")}
      size={size} variant={variant} fullWidth min={min} max={max} step={step} unit={unit} disabled={disabled} readOnly={readOnly}
      aria-label={part.label ? `${part.label} ${noun}` : label} scrub={part.icon}
      value={mixed ? null : first ?? null} mixed={mixed} onValueChange={(next, event) => update(part.indices, next, event)} />;
  });
  const toggleLabel = kind === "sides" ? `Individual ${noun} per side` : `Individual ${noun} per corner`;

  return <div ref={ref} role="group" aria-labelledby={labelId} className={boxFieldVariants({ size }, className)}
    data-independent={split ? "" : undefined} {...rest}>
    <span id={labelId} className={hideLabel ? "area-sr-only" : boxFieldVariants.element("label")}>{label}</span>
    <div className={boxFieldVariants.element("fields")}>
      {fields.slice(0, 2)}
      {toggle ? <Button className={boxFieldVariants.element("toggle")} size={size} variant="ghost" tone="neutral" iconOnly
        aria-label={toggleLabel} selected={split} disabled={disabled || readOnly} onClick={() => setSplit(!split)}
        icon={<Glyph name={kind === "sides" ? "sides" : "corners"} />} /> : null}
      {fields.slice(2)}
    </div>
    {name ? <input type="hidden" name={name} disabled={disabled}
      value={values.every(part => part != null) ? values.join(" ") : ""} /> : null}
  </div>;
});
