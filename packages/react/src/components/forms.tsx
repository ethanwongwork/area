import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { MANIFESTS, selectVariants, textareaVariants, checkboxVariants, radioVariants, switchVariants } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
type Size = NonNullable<VariantProps<typeof MANIFESTS.checkbox>["size"]>;
type SwitchSize = NonNullable<VariantProps<typeof MANIFESTS.switch>["size"]>;

/* --- Select / Textarea ---------------------------------------------------- */

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: VariantProps<typeof MANIFESTS.select>["size"];
}

export const Select = /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, className, ...rest },
  ref,
) {
  return <select ref={ref} className={selectVariants({ size }, className)} {...rest} />;
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: VariantProps<typeof MANIFESTS.textarea>["size"];
  invalid?: boolean;
}

export const Textarea = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size, invalid, className, "aria-invalid": ariaInvalid, ...rest },
  ref,
) {
  const invalidState = invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");

  return (
    <textarea
      ref={ref}
      className={textareaVariants({ size }, className)}
      aria-invalid={invalid ? true : ariaInvalid}
      {...(invalidState ? { "data-invalid": "" } : {})}
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
