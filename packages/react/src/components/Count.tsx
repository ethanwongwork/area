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
  tone?: CountVariants["tone"];
  size?: CountVariants["size"];
}

export const Count = forwardRef<HTMLSpanElement, CountProps>(function Count(
  { count, max = 99, showZero = true, label, variant, tone, size, className, ...rest }, ref,
) {
  if (!showZero && normalizeCount(count) === 0) return null;
  return (
    <span ref={ref} {...rest} className={countVariants({ variant, tone, size }, className)}>
      {formatCount(count, max)}
      {label ? <span className="area-count__label"> {label}</span> : null}
    </span>
  );
});
