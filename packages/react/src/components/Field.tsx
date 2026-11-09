import { useSystemDefault } from "./SystemDefaults.tsx";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useState,
} from "react";
import type {
  AriaAttributes,
  FormEvent,
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
  value?: unknown;
  defaultValue?: unknown;
  maxLength?: number;
  onInput?: (event: FormEvent<HTMLElement>) => void;
}

export interface FieldProps extends Div {
  label?: ReactNode;
  /**
   * Beside the label, after it: a Toggletip that explains the setting, or another small action. It sits outside the
   * `<label>`, so its name never joins the control's (owner 2026-10-27; Fluent's InfoLabel, the Toggletip spec's open
   * question 1).
   */
  labelAction?: ReactNode;
  description?: ReactNode;
  /**
   * A validation message, painted by `validationStatus`. Without a status it is an error (sets
   * `aria-invalid` and `aria-errormessage`); pass `"success"` or `"warning"` for the others.
   * Help text that isn't validation belongs in `description`. `error` remains the shorthand.
   */
  validation?: ReactNode;
  validationStatus?: "error" | "success" | "warning";
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Explicitly overrides the generated control id. */
  htmlFor?: string;
  /**
   * `vertical` (default): the label over the control. `horizontal`: beside it. `auto`: beside it while the control fits
   * the control column at its natural width, under it when it does not, so a row reflows with the panel's width, the
   * type size and the control's content, never with its value (owner 2026-10-27).
   */
  orientation?: FieldOrientation;
  /** Visually hides the label while keeping it as the control's accessible name. */
  visuallyHiddenLabel?: boolean;
  /**
   * Shows how many characters the control holds, "12 / 320" against its `maxLength`, at the end of the line under
   * it. A function formats the count. It is read with the control's description, never announced on each key.
   */
  characterCount?: boolean | ((length: number, maxLength?: number) => ReactNode);
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
    labelAction,
    htmlFor,
    orientation,
    visuallyHiddenLabel,
    characterCount,
    inline,
    className,
    children,
    ...rest
  },
  ref,
) {
  orientation = useSystemDefault("field", "orientation", orientation, fieldVariants.manifest.variants.orientation); // the system's default (SystemDefaults) where the use gives none
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
  const countId = `${controlId}-count`;
  const lengthOf = (value: unknown) => (value === undefined || value === null ? 0 : String(value).length);
  const [typed, setTyped] = useState<number | null>(null);
  // A controlled value is the truth; otherwise the count follows what is typed, from the default.
  const length = control?.props.value !== undefined ? lengthOf(control.props.value) : typed ?? lengthOf(control?.props.defaultValue);
  const maxLength = control?.props.maxLength;
  const hasCount = Boolean(characterCount) && control !== undefined;

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
        hasCount ? countId : undefined,
      ),
      "aria-errormessage": hasError ? validationId : control.props["aria-errormessage"],
      "aria-invalid": hasError ? true : control.props["aria-invalid"],
      "data-validation-status": resolvedValidationStatus,
      required: required || control.props.required || undefined,
      disabled: disabled || control.props.disabled || undefined,
      ...(characterCount ? {
        onInput: (event: FormEvent<HTMLElement>) => {
          control.props.onInput?.(event);
          setTyped(lengthOf((event.target as HTMLInputElement).value));
        },
      } : {}),
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
      {hasContent(label) && hasContent(labelAction) ? (
        <span className="area-field__head">
          <label
            id={labelId}
            className={cx("area-field__label", visuallyHiddenLabel && "area-sr-only")}
            htmlFor={controlId}
          >
            {label}
            {required ? <span className="area-field__required" aria-hidden="true">*</span> : null}
          </label>
          {labelAction}
        </span>
      ) : hasContent(label) ? (
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
      {hasCount ? (
        <span id={countId} className="area-field__count" data-full={maxLength !== undefined && length >= maxLength ? "" : undefined}>
          {typeof characterCount === "function" ? characterCount(length, maxLength) : maxLength !== undefined ? `${length} / ${maxLength}` : length}
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
