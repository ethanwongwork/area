import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
} from "react";
import type {
  AriaAttributes,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import type { VariantProps } from "../variants.ts";
import { fieldVariants, MANIFESTS, cx } from "../variants.ts";

type Div = HTMLAttributes<HTMLDivElement>;
type FieldOrientation = VariantProps<typeof MANIFESTS.field>["orientation"];

interface FieldControlProps extends AriaAttributes {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  "data-validation-status"?: "error" | "success" | "warning";
}

export interface FieldProps extends Div {
  label?: ReactNode;
  description?: ReactNode;
  /** A non-error validation message. `error` remains the compatibility shorthand for error. */
  validation?: ReactNode;
  validationStatus?: "error" | "success" | "warning";
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Explicitly overrides the generated control id. */
  htmlFor?: string;
  orientation?: FieldOrientation;
  /** Visually hides the label while keeping it as the control's accessible name. */
  visuallyHiddenLabel?: boolean;
  /** @deprecated Use orientation="horizontal". */
  inline?: boolean;
}

function hasContent(value: ReactNode): boolean {
  return value !== null && value !== undefined && value !== false && value !== "";
}

function mergeIds(...values: Array<string | undefined>): string | undefined {
  const ids = values.flatMap((value) => value?.trim().split(/\s+/) ?? []).filter(Boolean);
  return ids.length ? [...new Set(ids)].join(" ") : undefined;
}

/**
 * Associates one direct control with its label, help text, and validation message.
 * The direct child must forward native `id`, `aria-*`, `required`, and `disabled` props.
 * Pages with multiple independent React roots must give each root an identifierPrefix.
 */
export const Field = /* @__PURE__ */ forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    label,
    description,
    validation,
    validationStatus,
    error,
    required,
    disabled,
    htmlFor,
    orientation,
    visuallyHiddenLabel,
    inline,
    className,
    children,
    ...rest
  },
  ref,
) {
  const reactId = useId().replace(/:/g, "");
  const childArray = Children.toArray(children);
  const controlIndex = childArray.findIndex(isValidElement);
  const control = controlIndex >= 0
    ? childArray[controlIndex] as ReactElement<FieldControlProps>
    : undefined;
  const controlId = htmlFor ?? control?.props.id ?? `area-field-${reactId}`;
  const labelId = `${controlId}-label`;
  const descriptionId = `${controlId}-description`;
  const validationId = `${controlId}-validation`;
  const hasDescription = hasContent(description);
  const resolvedValidation = hasContent(error) ? error : validation;
  const resolvedValidationStatus = hasContent(error) ? "error" : validationStatus ?? (hasContent(validation) ? "error" : undefined);
  const hasValidation = hasContent(resolvedValidation);
  const hasError = hasValidation && resolvedValidationStatus === "error";

  if (control) {
    childArray[controlIndex] = cloneElement(control, {
      id: controlId,
      "aria-labelledby": hasContent(label)
        ? mergeIds(control.props["aria-labelledby"], labelId)
        : control.props["aria-labelledby"],
      "aria-describedby": mergeIds(
        control.props["aria-describedby"],
        hasDescription ? descriptionId : undefined,
        hasValidation ? validationId : undefined,
      ),
      "aria-errormessage": hasError ? validationId : control.props["aria-errormessage"],
      "aria-invalid": hasError ? true : control.props["aria-invalid"],
      "data-validation-status": resolvedValidationStatus,
      required: required || control.props.required || undefined,
      disabled: disabled || control.props.disabled || undefined,
    });
  }

  const resolvedOrientation = inline ? "horizontal" : orientation;

  return (
    <div
      ref={ref}
      className={fieldVariants({ orientation: resolvedOrientation, inline }, className)}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...rest}
    >
      {hasContent(label) ? (
        <label
          id={labelId}
          className={cx("area-field__label", visuallyHiddenLabel && "area-sr-only")}
          htmlFor={controlId}
        >
          {label}
          {required ? (
            <span className="area-field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {childArray}
      {hasDescription ? (
        <span id={descriptionId} className="area-field__description">
          {description}
        </span>
      ) : null}
      {hasValidation ? (
        <span id={validationId} className="area-field__validation" data-tone={resolvedValidationStatus ?? "error"}>
          {resolvedValidation}
        </span>
      ) : null}
    </div>
  );
});

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = /* @__PURE__ */ forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...rest },
  ref,
) {
  return <label ref={ref} className={cx("area-field__label", className)} {...rest} />;
});
