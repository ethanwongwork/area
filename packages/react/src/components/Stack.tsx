// Stack: one row or column with a gap chosen by role, following Density; inside a Surface the gap never exceeds the
// Surface's inset. Spec: docs/specs/stack.md.
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { stackVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type StackVariants = VariantProps<typeof MANIFESTS.stack>;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** vertical (default): a column. horizontal: a row. */
  orientation?: StackVariants["orientation"];
  /** related: items read as one thing. group (default): members of a group. section: sections of a page. */
  gap?: StackVariants["gap"];
  /** Cross-axis alignment. Unset, a column stretches its children and a row centres them. */
  align?: StackVariants["align"];
  /** Push the first and last children to the ends, the space between them (a title and its action). */
  spread?: boolean;
  /** Let a row wrap onto more lines (chips, badges). */
  wrap?: boolean;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { orientation, gap, align, spread, wrap, className, ...rest }, ref,
) {
  return <div ref={ref} {...rest} className={stackVariants({ orientation, gap, align, spread, wrap }, className)} />;
});
