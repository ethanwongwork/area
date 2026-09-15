import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx, inputVariants } from "../variants.ts";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: VariantProps<typeof MANIFESTS.input>["size"];
  /** Leading icon. Decorative: it categorises the field, it does not label it. */
  icon?: ReactNode;
  /** Static text before the value, such as a currency symbol. */
  prefix?: ReactNode;
  /** Static text after the value, such as a unit. */
  suffix?: ReactNode;
  invalid?: boolean;
  /** Class applied to the outer shell rather than the input itself. */
  className?: string;
}

/**
 * Accepts a single line of text.
 *
 * The shell carries the chrome and the input inside it is stripped bare, which is what
 * lets icons, affixes and the focus ring share one border box.
 */
export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, icon, prefix, suffix, invalid, disabled, className, ...rest },
  ref,
) {
  return (
    <div
      className={inputVariants({ size }, className)}
      {...(invalid ? { "data-invalid": "" } : {})}
      {...(disabled ? { "data-disabled": "" } : {})}
    >
      {icon ? (
        <span className="area-input__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {prefix ? <span className="area-input__affix">{prefix}</span> : null}
      <input
        ref={ref}
        className="area-input__control"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {suffix ? <span className="area-input__affix">{suffix}</span> : null}
    </div>
  );
});

export { inputVariants, cx };
