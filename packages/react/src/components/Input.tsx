import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef, useId } from "react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode } from "react";
import { cx, inputVariants } from "../variants.ts";
import { Spinner } from "./primitives.tsx";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  variant?: VariantProps<typeof MANIFESTS.input>["variant"];
  size?: VariantProps<typeof MANIFESTS.input>["size"];
  /** @deprecated Use `leadingIcon`. */
  icon?: ReactNode;
  /** Decorative visual at the logical start of the input. */
  leadingIcon?: ReactNode;
  /** Decorative visual at the logical end of the input. */
  trailingIcon?: ReactNode;
  /** Static text before the value, such as a currency symbol. */
  prefix?: ReactNode;
  /** Static text after the value, such as a unit. */
  suffix?: ReactNode;
  /** Stretch to the available inline size. The default is a contained 16rem measure. */
  fullWidth?: boolean;
  /** Use the system monospace stack for code-like values. */
  monospace?: boolean;
  /** Show progress without making the field uneditable. */
  loading?: boolean;
  /** Accessible status text for the loading indicator. */
  loadingText?: string;
  /** Which visual slot loading occupies; auto replaces the leading visual when present. */
  loaderPosition?: "auto" | "leading" | "trailing";
  /** One InputAction at the logical end. It replaces a trailing visual. */
  trailingAction?: ReactElement<InputActionProps>;
  /** Internal Field-to-Input validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: "error" | "success" | "warning";
  /** Semantic validation paint. `invalid` remains the compatibility alias for `error`. */
  validationStatus?: "error" | "success" | "warning";
  invalid?: boolean;
  /** Class applied to the outer shell rather than the input itself. */
  className?: string;
}

/**
 * A single icon action at an Input's logical end. It owns a square icon slot and a
 * focusable tooltip; a regular ghost Button is too large to be a reliable inset action.
 */
export interface InputActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  icon: ReactNode;
  /** Visible on hover and focus; also becomes the accessible name when aria-label is absent. */
  tooltip: string;
}

export const InputAction = /* @__PURE__ */ forwardRef<HTMLButtonElement, InputActionProps>(function InputAction(
  { icon, tooltip, "aria-label": ariaLabel, className, ...rest },
  ref,
) {
  const tooltipId = `area-input-action-${useId().replace(/:/g, "")}`;

  return (
    <span className="area-input__action">
      <button
        ref={ref}
        type="button"
        className={cx("area-input__action-button", className)}
        aria-label={ariaLabel ?? tooltip}
        aria-describedby={tooltipId}
        {...rest}
      >
        <span className="area-input__action-icon" aria-hidden="true">{icon}</span>
      </button>
      <span id={tooltipId} className="area-input__action-tooltip" role="tooltip">{tooltip}</span>
    </span>
  );
});

/**
 * Accepts a single line of text.
 *
 * The shell carries the chrome and the input inside it is stripped bare, which is what
 * lets icons, affixes and the focus ring share one border box.
 */
export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant,
    size,
    icon,
    leadingIcon,
    trailingIcon,
    prefix,
    suffix,
    fullWidth,
    monospace,
    loading,
    loadingText = "Loading",
    loaderPosition = "auto",
    trailingAction,
    validationStatus,
    invalid,
    disabled,
    readOnly,
    className,
    "aria-invalid": ariaInvalid,
    "aria-busy": ariaBusy,
    "data-validation-status": fieldValidationStatus,
    ...rest
  },
  ref,
) {
  const invalidState = validationStatus === "error" || invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const resolvedValidationStatus = invalidState ? "error" : validationStatus ?? fieldValidationStatus;
  const startIcon = leadingIcon ?? icon;
  const spinnerSize = size === "xs" || size === "sm" ? "sm" : size === "lg" || size === "xl" ? "lg" : "md";
  const resolvedLoaderPosition = loaderPosition === "auto" ? (startIcon ? "leading" : "trailing") : loaderPosition;

  return (
    <div
      className={inputVariants({ variant, size, fullWidth, monospace }, className)}
      {...(invalidState ? { "data-invalid": "" } : {})}
      {...(resolvedValidationStatus === "success" ? { "data-success": "" } : {})}
      {...(resolvedValidationStatus === "warning" ? { "data-warning": "" } : {})}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(readOnly ? { "data-read-only": "" } : {})}
      {...(loading ? { "data-loading": "" } : {})}
    >
      {loading && resolvedLoaderPosition === "leading" ? (
        <span className="area-input__icon"><Spinner size={spinnerSize} label={loadingText} /></span>
      ) : startIcon ? (
        <span className="area-input__icon" aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      {prefix ? <span className="area-input__affix">{prefix}</span> : null}
      <input
        ref={ref}
        className="area-input__control"
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid ? true : ariaInvalid}
        aria-busy={loading ? true : ariaBusy}
        {...rest}
      />
      {suffix ? <span className="area-input__affix">{suffix}</span> : null}
      {loading && resolvedLoaderPosition === "trailing" ? (
        <span className="area-input__icon">
          <Spinner size={spinnerSize} label={loadingText} />
        </span>
      ) : trailingAction ? (
        trailingAction
      ) : trailingIcon ? (
        <span className="area-input__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </div>
  );
});

export { inputVariants, cx };
