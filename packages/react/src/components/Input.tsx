import { useSystemDefault } from "./SystemDefaults.tsx";
import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef, useContext } from "react";
import { InputGroupContext } from "./input-group-context.ts";
import type { ButtonHTMLAttributes, ChangeEvent, CSSProperties, InputHTMLAttributes, ReactElement, ReactNode } from "react";
import { cx, inputVariants, tooltipVariants } from "../variants.ts";
import { Spinner } from "./Spinner.tsx";
import { AnchoredTooltip } from "./Overlays.tsx";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** The field's treatment: `outline` (default), an edge; `soft`, a fill. */
  variant?: VariantProps<typeof MANIFESTS.input>["variant"];
  /** The field's height and type: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.input>["size"];
  /** Stretch to the available inline size. The default is a contained 16rem measure. */
  fullWidth?: boolean;
  /** Use the system monospace stack for code-like values. */
  monospace?: boolean;
  /** A decorative glyph at the field's start. */
  icon?: ReactNode;
  /** Decorative visual at the logical end of the input. */
  trailingIcon?: ReactNode;
  /** Static text before the value, such as a currency symbol. */
  prefix?: ReactNode;
  /** Static text after the value, such as a unit. */
  suffix?: ReactNode;
  /** One InputAction at the logical end. It replaces a trailing visual. */
  trailingAction?: ReactElement<InputActionProps>;
  /** @deprecated Use `icon`, which wins. Kept for one release. */
  leadingIcon?: ReactNode;
  /** Show progress without making the field uneditable. */
  loading?: boolean;
  /** Accessible status text for the loading indicator. */
  loadingText?: string;
  /** Which visual slot loading occupies; auto replaces the leading visual when present. */
  loaderPosition?: "auto" | "leading" | "trailing";
  /** Internal Field-to-Input validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: "error" | "success" | "warning";
  /** Semantic validation paint. `invalid` remains the compatibility alias for `error`. */
  validationStatus?: "error" | "success" | "warning";
  /** Paints the field as an error and sets `aria-invalid`; the same as `validationStatus="error"`. */
  invalid?: boolean;
  /**
   * Called with the typed value and the change event, after native `onChange`. Search field and Combobox replace it
   * with their own.
   */
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Class applied to the outer shell rather than the input itself. */
  className?: string;
  /** Style applied to the outer shell, with `className` (width and margin overrides). */
  style?: CSSProperties;
}

/**
 * A single icon action at an Input's logical end. It owns a square icon slot and a Tooltip
 * (the shared overlay engine, audit S16); a regular ghost Button is too large to be a reliable
 * inset action.
 */
export interface InputActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  /** The action's glyph, in a square slot at the field's end. */
  icon: ReactNode;
  /** Visible on hover and focus; also becomes the accessible name when aria-label is absent. */
  tooltip: string;
}

export const InputAction = /* @__PURE__ */ forwardRef<HTMLButtonElement, InputActionProps>(function InputAction(
  { icon, tooltip, "aria-label": ariaLabel, "aria-describedby": describedBy, className, ...rest },
  ref,
) {
  // Under the action, ending at it, so the hint stays over the field rather than past its end.
  return (
    <span className="area-input__action">
      <AnchoredTooltip side="bottom" align="end"
        // When the hint is also the name, describing the button with it announces it twice.
        describes={ariaLabel != null}
        trigger={<button
          ref={ref}
          type="button"
          className={cx("area-input__action-button", className)}
          aria-label={ariaLabel ?? tooltip}
          aria-describedby={describedBy}
          {...rest}
        >
          <span className="area-input__action-icon" aria-hidden="true">{icon}</span>
        </button>}
        surface={props => <div role="tooltip" className={tooltipVariants({}, "area-input__action-tooltip")} {...props}>{tooltip}</div>} />
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
    validationStatus: validationStatusProp,
    invalid,
    disabled: disabledProp,
    readOnly,
    onChange,
    onValueChange,
    className,
    style,
    "aria-invalid": ariaInvalid,
    "aria-busy": ariaBusy,
    "data-validation-status": fieldValidationStatus,
    ...rest
  },
  ref,
) {
  variant = useSystemDefault("input", "variant", variant, inputVariants.manifest.variants.variant); // the system's default (SystemDefaults) where the use gives none
  // Inside an InputGroup, the group's Field state reaches the control (audit B-14).
  const group = useContext(InputGroupContext);
  const disabled = disabledProp ?? group.disabled;
  const validationStatus = validationStatusProp ?? group.validationStatus;
  const invalidState = validationStatus === "error" || invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const resolvedValidationStatus = invalidState ? "error" : validationStatus ?? fieldValidationStatus;
  const startIcon = icon ?? leadingIcon;
  const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";
  const resolvedLoaderPosition = loaderPosition === "auto" ? (startIcon ? "leading" : "trailing") : loaderPosition;

  return (
    <div
      className={inputVariants({ variant, size, fullWidth, monospace }, className)}
      // className and style land on the same box, the shell (audit S17, B-20).
      style={style}
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
        aria-invalid={invalidState ? true : ariaInvalid}
        aria-busy={loading ? true : ariaBusy}
        {...rest}
        onChange={onChange || onValueChange ? (event: ChangeEvent<HTMLInputElement>) => {
          onChange?.(event);
          if (!event.defaultPrevented) onValueChange?.(event.target.value, event);
        } : undefined}
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
