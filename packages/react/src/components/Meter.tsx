// Meter: a value within a known range (usage against a limit, storage used): the label and the value
// on a row, Progress's bar, and a description under it, laid out as a Field. Spec: docs/specs/meter.md.
// With `segments` it is a stacked meter: parts of the measure side by side on the bar, each named in a legend under it
// (owner 2026-10-30, docs/research/inspector-panel-2026-10-30).
import { forwardRef, useId } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { meterVariants, progressVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";

type MeterVariants = VariantProps<typeof MANIFESTS.meter>;

/**
 * One part of a stacked meter. Keep every part in its place, at 0 when it is empty: a part at 0 is neither drawn nor
 * listed, and the parts after it keep their colours.
 */
export interface MeterSegment {
  /** What the part is: "Colour", "Messages". Shown in the legend. */
  label: ReactNode;
  value: number;
}

/** The categorical colours a stacked meter has, in their fixed order (meter.css). A ninth part folds into "Other". */
export const METER_SEGMENT_LIMIT = 8;

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The measured value, between min and max. Required without `segments`; with them it is their sum. */
  value?: number;
  min?: number;
  /** The range's end. With `segments` it defaults to their sum (the bar full); set it to show what is left. */
  max?: number;
  /**
   * The parts of the measure, at most eight, each in the next colour of a fixed order, separated by a gap on the bar
   * and listed under it with its value and share.
   */
  segments?: MeterSegment[];
  /** What is measured: "Weekly limit", "Storage". Names the meter. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** A line under the bar: "Resets in 4 days". */
  description?: ReactNode;
  /**
   * The value as shown at the end of the label's row ("60% left", "1.2 of 5 GB"); a string is also announced. Default:
   * the percentage, or with `segments` and no `max` their total. `null` hides it.
   */
  valueText?: ReactNode | null;
  /** `warning` and `danger` color the fill when the value means trouble; `neutral` is Progress's fill. */
  tone?: MeterVariants["tone"];
  /** The bar's thickness: Progress's sm 4, md 6, lg 8. */
  size?: "sm" | "md" | "lg";
}

const percent = (part: number, whole: number) => `${whole > 0 ? Math.round((part / whole) * 100) : 0}%`;

export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { value, min = 0, max: maxProp, segments, label, description, valueText, tone, size, className, ...rest },
  ref,
) {
  const id = useId();
  if (segments && segments.length > METER_SEGMENT_LIMIT) throw new RangeError(`Meter: at most ${METER_SEGMENT_LIMIT} segments; fold the rest into "Other".`);
  if (!segments && value === undefined) throw new TypeError("Meter: pass a value, or segments.");
  const total = segments ? segments.reduce((sum, part) => sum + Math.max(0, part.value), 0) : 0;
  const max = maxProp ?? (segments ? min + total : 100);
  const clamped = Math.min(max, Math.max(min, segments ? min + total : value!));
  const range = max - min;
  const pct = range > 0 ? ((clamped - min) / range) * 100 : 0;
  const shown = valueText === undefined ? (segments && maxProp === undefined ? String(total) : `${Math.round(pct)}%`) : valueText;

  const header = label || shown != null ? (
    <div className={meterVariants.element("header")}>
      {label ? <div id={`${id}-label`} className={meterVariants.element("label")}>{label}</div> : null}
      {shown != null ? <span className={meterVariants.element("value")} aria-hidden={segments ? undefined : "true"}>{shown}</span> : null}
    </div>
  ) : null;
  const caption = description ? <p id={`${id}-description`} className={meterVariants.element("description")}>{description}</p> : null;

  if (segments) {
    // A meter's children are presentational, which would hide the legend; the parts are a labelled group whose legend
    // carries every value, the bar drawing them.
    const left = Math.max(0, range - total);
    return (
      <div ref={ref} role="group" aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
        className={meterVariants({ tone, size }, cx("area-meter--segmented", className))} {...rest}>
        {header}
        <div className={cx(progressVariants({ size }), meterVariants.element("track"))} aria-hidden="true">
          {segments.map((part, index) => part.value > 0
            ? <span key={index} className={meterVariants.element("segment")} data-slot={index + 1} style={{ flexGrow: part.value } as CSSProperties} />
            : null)}
          {left > 0 ? <span className={meterVariants.element("rest")} style={{ flexGrow: left } as CSSProperties} /> : null}
        </div>
        <ul className={meterVariants.element("legend")}>
          {segments.map((part, index) => part.value > 0 ? (
            <li key={index} className={meterVariants.element("item")}>
              <span className={meterVariants.element("swatch")} data-slot={index + 1} aria-hidden="true" />
              <span className={meterVariants.element("item-label")}>{part.label}</span>
              <span className={meterVariants.element("item-value")}>{part.value}</span>
              <span className={meterVariants.element("item-share")}>{percent(part.value, range)}</span>
            </li>
          ) : null)}
        </ul>
        {caption}
      </div>
    );
  }

  return (
    <div ref={ref} role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={clamped}
      aria-valuetext={typeof shown === "string" ? shown : undefined}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      className={meterVariants({ tone, size }, className)} {...rest}>
      {header}
      <div className={cx(progressVariants({ size }), meterVariants.element("track"))} aria-hidden="true">
        <div className="area-progress__bar" style={{ "--_progress-value": pct } as CSSProperties} />
      </div>
      {caption}
    </div>
  );
});

export { meterVariants };
