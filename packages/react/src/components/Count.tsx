// Count: a number beside its owner's label. Spec: docs/specs/count.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { countVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { formatCount, normalizeCount } from "./count-format.ts";

type CountVariants = VariantProps<typeof MANIFESTS.count>;

export interface CountProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The number shown. Nonnegative whole numbers; anything else is normalised. */
  count: number;
  /** Above this the count reads `max+`. */
  max?: number;
  /** Render a count of 0. When false, a zero count renders nothing. */
  showZero?: boolean;
  /**
   * Words a screen reader hears after the number, e.g. "unread" for "Inbox 3 unread". The
   * number is read as part of its owner's name, so give it the words the owner lacks.
   */
  label?: ReactNode;
  variant?: CountVariants["variant"];
  size?: CountVariants["size"];
  /** Unset: a pill while the theme's `pills` list names this component (the default). `true` forces a pill, `false` the radius setting's corner. */
  pill?: boolean;
}

export const Count = forwardRef<HTMLSpanElement, CountProps>(function Count(
  { count, max = 99, showZero = true, label, variant, size, pill, className, ...rest }, ref,
) {
  if (!showZero && normalizeCount(count) === 0) return null;
  return (
    <span ref={ref} {...rest} className={countVariants({ variant, size, pill: pill === true, rounded: pill === false }, className)}>
      {formatCount(count, max)}
      {label ? <span className="area-count__label"> {label}</span> : null}
    </span>
  );
});
