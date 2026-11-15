import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { spinnerVariants } from "../variants.ts";
import { type LoadingDelay, useLoadingDelay } from "./loading-delay.ts";
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "role"> {
  /** The ring's size: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.spinner>["size"];
  /** Announced to assistive tech. Omit when a nearby element already says it. With a value, it names the ring. */
  label?: string;
  /**
   * How far along, 0 to `max`: the arc stops at the value instead of turning, as a progress ring. Omit for an action
   * with no known end.
   */
  value?: number;
  /** The value of a full ring. */
  max?: number;
  /** Announced in place of the number ("48% of context used"). */
  valueText?: string;
  /**
   * With a value: progressbar (default) for a task on its way to done; meter for a level of a quantity, such as
   * context or storage used (ARIA 1.2 keeps the two apart).
   * @default "progressbar"
   */
  role?: "progressbar" | "meter";
  /**
   * The turning spinner waits before it shows, so a quick action shows nothing: `short` 300 ms, `long` (or `true`)
   * 1000 ms, or milliseconds. While it waits it keeps its box, invisible (`data-waiting`), and its label is held back,
   * so its status says nothing until it shows. A ring with a `value` shows at once.
   */
  delay?: LoadingDelay;
}

/* The determinate ring is the spinning one stopped: r 7 on the 16 grid, a 2 line, round caps, the track the arc's
   ink at 25%. pathLength 100 makes the arc's length the value; a round cap reaches half the line past each end, so
   the dash is shortened by one line's share of the circumference (2 / 2π7 = 4.55 of 100) and the drawn arc matches
   the value (rc-progress for Ant Design). The 200 gap keeps 0 from drawing a full ring. */
const SPINNER_CAP = (2 / (2 * Math.PI * 7)) * 100;

export const Spinner = /* @__PURE__ */ forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label, value, max = 100, valueText, role, delay, className, ...rest },
  ref,
) {
  const shown = useLoadingDelay(value === undefined ? delay : undefined);
  if (value !== undefined) {
    const clamped = Math.min(max, Math.max(0, value));
    const pct = max > 0 ? (clamped / max) * 100 : 0;
    const dash = pct >= 100 ? 100 : Math.max(0, pct - SPINNER_CAP);
    return (
      <span
        ref={ref}
        role={role ?? "progressbar"}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={valueText}
        aria-label={label}
        className={spinnerVariants({ size }, className)}
        data-determinate=""
        {...rest}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle className="area-spinner__track" cx="8" cy="8" r="7" />
          <circle className="area-spinner__arc" cx="8" cy="8" r="7" pathLength={100} strokeDasharray={`${dash} 200`}
            {...(pct <= 0 ? { "data-empty": "" } : {})} />
        </svg>
      </span>
    );
  }
  return (
    <span
      ref={ref}
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : "true"}
      className={spinnerVariants({ size }, className)}
      {...(shown ? {} : { "data-waiting": "" })}
      {...rest}
    >
      {/* A live region announces its content, not its name: the label is content (audit E-21). While a delayed spinner
          waits, the region is there and empty, so the label arriving with the ring is what it says. */}
      {label && shown ? <span className="area-sr-only">{label}</span> : null}
    </span>
  );
});

