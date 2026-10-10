// Meter: a value within a known range (usage against a limit, storage used): the label and the value
// on a row, Progress's bar, and a description under it, laid out as a Field. Spec: docs/specs/meter.md.
import { forwardRef, useId } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { meterVariants, progressVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";

type MeterVariants = VariantProps<typeof MANIFESTS.meter>;

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The measured value, between min and max. */
  value: number;
  min?: number;
  max?: number;
  /** What is measured: "Weekly limit", "Storage". Names the meter. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** A line under the bar: "Resets in 4 days". */
  description?: ReactNode;
  /** The value as shown at the end of the label's row ("60% left", "1.2 of 5 GB"); a string is also announced. Default: the percentage. `null` hides it. */
  valueText?: ReactNode | null;
  /** `warning` and `danger` color the fill when the value means trouble; `neutral` is Progress's fill. */
  tone?: MeterVariants["tone"];
  /** The bar's thickness: Progress's sm 4, md 6, lg 8. */
  size?: "sm" | "md" | "lg";
}

export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { value, min = 0, max = 100, label, description, valueText, tone, size, className, ...rest },
  ref,
) {
  const id = useId();
  const clamped = Math.min(max, Math.max(min, value));
  const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;
  const shown = valueText === undefined ? `${Math.round(pct)}%` : valueText;
  return (
    <div ref={ref} role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={clamped}
      aria-valuetext={typeof shown === "string" ? shown : undefined}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      className={meterVariants({ tone }, className)} {...rest}>
      {label || shown != null ? (
        <div className={meterVariants.element("header")}>
          {label ? <div id={`${id}-label`} className={meterVariants.element("label")}>{label}</div> : null}
          {shown != null ? <span className={meterVariants.element("value")} aria-hidden="true">{shown}</span> : null}
        </div>
      ) : null}
      <div className={cx(progressVariants({ size }), meterVariants.element("track"))} aria-hidden="true">
        <div className="area-progress__bar" style={{ "--_progress-value": pct } as CSSProperties} />
      </div>
      {description ? <p id={`${id}-description`} className={meterVariants.element("description")}>{description}</p> : null}
    </div>
  );
});

export { meterVariants };
