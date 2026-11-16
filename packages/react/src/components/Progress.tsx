import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import type { CSSProperties } from "react";
import { progressVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
export interface ProgressProps extends Omit<Div, "children"> {
  /** 0 to `max`. Omit for an indeterminate bar. */
  value?: number;
  /** The value of a full bar. */
  max?: number;
  /** The bar's accessible name ("Uploading report.pdf"). */
  label?: string;
  /** The bar's thickness: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.progress>["size"];
}

export const Progress = /* @__PURE__ */ forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, size, className, ...rest },
  ref,
) {
  const indeterminate = value == null;
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      // The announced value is the one drawn, clamped to the range (audit E-21).
      aria-valuenow={indeterminate ? undefined : Math.min(max, Math.max(0, value))}
      aria-label={label}
      className={progressVariants({ size }, className)}
      {...(indeterminate ? { "data-indeterminate": "" } : {})}
      {...rest}
    >
      {/* The value moves a full-width bar by a rounded translate (progress.css), so the fill animates on the
          compositor and its end rests on a whole pixel (motion pass 2026-10-07; was inline-size). */}
      <div className="area-progress__bar" style={indeterminate ? undefined : ({ "--_progress-value": pct } as CSSProperties)} />
    </div>
  );
});

