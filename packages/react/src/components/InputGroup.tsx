import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { inputGroupVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof MANIFESTS.inputGroup>["variant"];
  size?: VariantProps<typeof MANIFESTS.inputGroup>["size"];
  fullWidth?: boolean;
}

/** One visual shell for independently named and focusable controls. */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { variant, size, fullWidth, className, ...rest }, ref,
) {
  return <div ref={ref} role="group" className={inputGroupVariants({ variant, size, fullWidth }, className)} {...rest} />;
});

export interface InputGroupTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Give one letter or icon the same square visual box and optical insets. */
  visual?: boolean;
}

/** Passive affix or segment caption. Include the meaning in the neighboring control's accessible name. */
export const InputGroupText = forwardRef<HTMLSpanElement, InputGroupTextProps>(function InputGroupText(
  { visual, className, ...rest }, ref,
) {
  return <span ref={ref} className={cx("area-input-group__text", className)} data-visual={visual ? "" : undefined} {...rest} />;
});
