import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { buttonGroupVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof MANIFESTS.buttonGroup>["variant"];
  size?: VariantProps<typeof MANIFESTS.buttonGroup>["size"];
  /** Fill the container; the buttons share its width equally (an inspector column). */
  fullWidth?: boolean;
}

/** Groups related Button actions while leaving each action independently focusable. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { variant, size, fullWidth, className, ...rest }, ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  variant = useSystemDefault("buttonGroup", "variant", variant);
  size = useSystemDefault("buttonGroup", "size", size);
  return <div ref={ref} role="group" className={buttonGroupVariants({ variant, size, fullWidth }, className)} {...rest} />;
});
