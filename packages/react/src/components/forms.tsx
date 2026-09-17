import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { MANIFESTS, selectVariants, textareaVariants, checkboxVariants, radioVariants, switchVariants } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
type Size = NonNullable<VariantProps<typeof MANIFESTS.checkbox>["size"]>;
type SwitchSize = NonNullable<VariantProps<typeof MANIFESTS.switch>["size"]>;

/* --- Select / Textarea ---------------------------------------------------- */

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple"> {
  size?: VariantProps<typeof MANIFESTS.select>["size"];
  /** Stretch to the available inline size. The default is a contained 16rem measure. */
  fullWidth?: boolean;
  /** Internal Field-to-Select validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: "error" | "success" | "warning";
  /** Semantic validation paint. `invalid` remains the compatibility alias for `error`. */
  validationStatus?: "error" | "success" | "warning";
  invalid?: boolean;
}

export const Select = /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    size,
    fullWidth,
    validationStatus,
    invalid,
    className,
    "aria-invalid": ariaInvalid,
    "data-validation-status": fieldValidationStatus,
    ...rest
  },
  ref,
) {
  const invalidState = validationStatus === "error" || invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const resolvedValidationStatus = invalidState ? "error" : validationStatus ?? fieldValidationStatus;

  return (
    <select
      ref={ref}
      className={selectVariants({ size, fullWidth }, className)}
      aria-invalid={invalidState ? true : ariaInvalid}
      {...(invalidState ? { "data-invalid": "" } : {})}
      {...(resolvedValidationStatus === "success" ? { "data-success": "" } : {})}
      {...(resolvedValidationStatus === "warning" ? { "data-warning": "" } : {})}
      {...rest}
    />
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: VariantProps<typeof MANIFESTS.textarea>["variant"];
  size?: VariantProps<typeof MANIFESTS.textarea>["size"];
  /** Controls which directions the native resize affordance can change. */
  resize?: VariantProps<typeof MANIFESTS.textarea>["resize"];
  /** Stretch to the available inline size. The default is a contained 16rem measure. */
  fullWidth?: boolean;
  /** Internal Field-to-Textarea validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: "error" | "success" | "warning";
  /** Semantic validation paint. `invalid` remains the compatibility alias for `error`. */
  validationStatus?: "error" | "success" | "warning";
  invalid?: boolean;
}

export const Textarea = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    variant,
    size,
    resize,
    fullWidth,
    validationStatus,
    invalid,
    className,
    "aria-invalid": ariaInvalid,
    "data-validation-status": fieldValidationStatus,
    ...rest
  },
  ref,
) {
  const invalidState = validationStatus === "error" || invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const resolvedValidationStatus = invalidState ? "error" : validationStatus ?? fieldValidationStatus;

  return (
    <textarea
      ref={ref}
      className={textareaVariants({ variant, size, resize, fullWidth }, className)}
      aria-invalid={invalidState ? true : ariaInvalid}
      {...(invalidState ? { "data-invalid": "" } : {})}
      {...(resolvedValidationStatus === "success" ? { "data-success": "" } : {})}
      {...(resolvedValidationStatus === "warning" ? { "data-warning": "" } : {})}
      {...rest}
    />
  );
});

/* --- Choice controls ------------------------------------------------------ */

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: Size;
  label?: ReactNode;
  description?: ReactNode;
}

function choice<S extends string>(kind: "checkbox" | "radio" | "switch", variants: (props: { size?: S }, className?: string) => string) {
  const block = `area-${kind}`;

  return forwardRef<HTMLInputElement, Omit<ChoiceProps, "size"> & { size?: S }>(function Choice(
    { size, label, description, className, disabled, ...rest },
    ref,
  ) {
    return (
      <label className={variants({ size }, className)} {...(disabled ? { "data-disabled": "" } : {})}>
        <input
          ref={ref}
          // A switch is a checkbox carrying role="switch", not a separate control, so it
          // keeps native keyboard behaviour and form participation either way.
          type={kind === "radio" ? "radio" : "checkbox"}
          role={kind === "switch" ? "switch" : undefined}
          className={`${block}__control`}
          disabled={disabled}
          {...rest}
        />
        {label || description ? (
          <span className="area-choice-label">
            {label ? <span className="area-choice-label__title">{label}</span> : null}
            {description ? <span className="area-choice-label__description">{description}</span> : null}
          </span>
        ) : null}
      </label>
    );
  });
}

export const Checkbox = /* @__PURE__ */ choice("checkbox", checkboxVariants);
export const Radio = /* @__PURE__ */ choice("radio", radioVariants);
export const Switch = /* @__PURE__ */ choice<SwitchSize>("switch", switchVariants);


export type CheckboxProps = ChoiceProps;
export type RadioProps = Omit<ChoiceProps, "size"> & { size?: VariantProps<typeof MANIFESTS.radio>["size"] };
export type SwitchProps = Omit<ChoiceProps, "size"> & { size?: SwitchSize };
