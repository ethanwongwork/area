import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import { separatorVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Separator ------------------------------------------------------------ */

export interface SeparatorProps extends Div {
  /** `horizontal` (default): a rule across. `vertical`: a rule down, between items in a row. */
  orientation?: VariantProps<typeof MANIFESTS.separator>["orientation"];
  /** Space reserved around the rule, independent of its one-pixel stroke. */
  spacing?: VariantProps<typeof MANIFESTS.separator>["spacing"];
  /** Aligns the rule endpoints to inset content. */
  inset?: boolean;
  /** A visual rule only: no separator role (the content around it is not split semantically). */
  decorative?: boolean;
}

export const Separator = /* @__PURE__ */ forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", spacing, inset, decorative, className, ...rest },
  ref,
) {
  // A purely visual rule is hidden from assistive tech, as Radix's `decorative` (audit G-28).
  return (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={separatorVariants({ orientation, spacing, inset }, className)}
      {...rest}
    />
  );
});

