import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { buttonGroupVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof MANIFESTS.buttonGroup>["variant"];
  size?: VariantProps<typeof MANIFESTS.buttonGroup>["size"];
}

/** Groups related Button actions while leaving each action independently focusable. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { variant, size, className, ...rest }, ref,
) {
  return <div ref={ref} role="group" className={buttonGroupVariants({ variant, size }, className)} {...rest} />;
});
