import { forwardRef, useMemo } from "react";
import { InputGroupContext } from "./input-group-context.ts";
import type { HTMLAttributes } from "react";
import { inputGroupVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof MANIFESTS.inputGroup>["variant"];
  size?: VariantProps<typeof MANIFESTS.inputGroup>["size"];
  fullWidth?: boolean;
  /** Disables every control in the group (a Field's `disabled` lands here). */
  disabled?: boolean;
  /** Validation paint for the group, as Field sets it; `aria-invalid` also marks an error. */
  "data-validation-status"?: "error" | "success" | "warning";
  /** Native `required` from a Field: grouped controls carry their own; ignored on the group. */
  required?: boolean;
}

/** One visual shell for independently named and focusable controls. */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { variant, size, fullWidth, disabled, required: _required, "data-validation-status": status, className, children, ...rest }, ref,
) {
  const invalid = rest["aria-invalid"] === true || rest["aria-invalid"] === "true";
  const validationStatus = invalid ? "error" : status;
  const state = useMemo(() => ({ disabled, validationStatus }), [disabled, validationStatus]);
  return <div ref={ref} role="group" className={inputGroupVariants({ variant, size, fullWidth }, className)}
    aria-disabled={disabled || undefined} {...rest}>
    <InputGroupContext.Provider value={state}>{children}</InputGroupContext.Provider>
  </div>;
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
