import { createContext, forwardRef, useContext, useEffect, useId, useState } from "react";
import type { FieldsetHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ChangeEvent, ReactNode } from "react";
import { MANIFESTS, selectVariants, textareaVariants, checkboxVariants, checkboxGroupVariants, radioGroupVariants, radioVariants, switchVariants } from "../variants.ts";
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

export interface CheckboxProps extends ChoiceProps {
  /** A contained, full-width choice row. It preserves native Checkbox behavior. */
  variant?: VariantProps<typeof MANIFESTS.checkbox>["variant"];
  /** Decorative context beside the mark. The visible label must still name the option. */
  leadingVisual?: ReactNode;
  /** Alias for description when the copy is presented as an option caption. */
  caption?: ReactNode;
  /** Marks an individual required choice as invalid. Group validation belongs on CheckboxGroup. */
  invalid?: boolean;
  /** Shows the native mixed state; useful for a parent that represents a partial selection. */
  indeterminate?: boolean;
}

export const Checkbox = /* @__PURE__ */ forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { variant, size, label, description, caption, leadingVisual, invalid, indeterminate = false, className, disabled, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...rest },
  ref,
) {
  const resolvedCaption = caption ?? description;
  const invalidState = invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const descriptionId = useId();
  const resolvedDescription = resolvedCaption ? [describedBy, descriptionId].filter(Boolean).join(" ") : describedBy;
  const setControl = (node: HTMLInputElement | null) => {
    if (node) node.indeterminate = indeterminate;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    if (typeof ref !== "function" && ref?.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate, ref]);

  return (
    <label
      className={checkboxVariants({ variant, size }, className)}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(invalidState ? { "data-invalid": "" } : {})}
    >
      <input
        ref={setControl}
        type="checkbox"
        className="area-checkbox__control"
        disabled={disabled}
        aria-describedby={resolvedDescription}
        aria-invalid={invalidState ? true : ariaInvalid}
        {...(invalidState ? { "data-invalid": "" } : {})}
        {...(indeterminate ? { "data-indeterminate": "" } : {})}
        {...rest}
      />
      {leadingVisual ? <span className="area-checkbox__visual" aria-hidden="true">{leadingVisual}</span> : null}
      {label || resolvedCaption ? (
        <span className="area-choice-label">
          {label ? <span className="area-choice-label__title">{label}</span> : null}
          {resolvedCaption ? <span className="area-choice-label__description" id={descriptionId}>{resolvedCaption}</span> : null}
        </span>
      ) : null}
    </label>
  );
});

export interface CheckboxGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children"> {
  children: ReactNode;
  /** Visible group label, rendered as the native fieldset legend. */
  label: ReactNode;
  description?: ReactNode;
  /** Validation message for an otherwise valid group (for example, a selection summary). */
  validation?: ReactNode;
  error?: ReactNode;
  /** Semantic status for a non-error validation message. */
  validationStatus?: "success" | "warning";
  orientation?: VariantProps<typeof MANIFESTS.checkboxGroup>["orientation"];
}

export const CheckboxGroup = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  { children, label, description, validation, error, validationStatus, orientation, className, disabled, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const descriptionId = useId();
  const errorId = useId();
  const validationMessage = error ?? validation;
  const resolvedDescription = [describedBy, description ? descriptionId : undefined, validationMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  const status = error ? "error" : validationStatus;

  return (
    <fieldset
      ref={ref}
      className={checkboxGroupVariants({ orientation }, className)}
      disabled={disabled}
      aria-describedby={resolvedDescription}
      aria-invalid={error ? true : undefined}
      {...(error ? { "data-invalid": "" } : {})}
      {...(status === "success" ? { "data-success": "" } : {})}
      {...(status === "warning" ? { "data-warning": "" } : {})}
      {...rest}
    >
      <legend className="area-checkbox-group__legend">{label}</legend>
      {description ? <span className="area-checkbox-group__description" id={descriptionId}>{description}</span> : null}
      <div className="area-checkbox-group__options">{children}</div>
      {validationMessage ? <span className="area-checkbox-group__validation" id={errorId}>{validationMessage}</span> : null}
    </fieldset>
  );
});

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

interface RadioGroupContextValue {
  name?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" | "onChange"> {
  children: ReactNode;
  /** Visible group label. Renders the native fieldset legend. */
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** Shared native radio name. An individual Radio name takes precedence. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled use. */
  defaultValue?: string;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  orientation?: VariantProps<typeof MANIFESTS.radioGroup>["orientation"];
}

export const RadioGroup = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { children, label, description, error, name, value, defaultValue, onValueChange, orientation, className, disabled, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const descriptionId = useId();
  const errorId = useId();
  const selectedValue = value ?? uncontrolledValue;
  const resolvedDescription = [describedBy, description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setUncontrolledValue(event.target.value);
    onValueChange?.(event.target.value, event);
  };

  return (
    <fieldset
      ref={ref}
      className={radioGroupVariants({ orientation }, className)}
      disabled={disabled}
      aria-describedby={resolvedDescription}
      aria-invalid={error ? true : undefined}
      {...(error ? { "data-invalid": "" } : {})}
      {...rest}
    >
      <legend className="area-radio-group__legend">{label}</legend>
      {description ? <span className="area-radio-group__description" id={descriptionId}>{description}</span> : null}
      <div className="area-radio-group__options">
        <RadioGroupContext.Provider value={{ name, value: selectedValue, disabled, onChange: change }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
      {error ? <span className="area-radio-group__validation" id={errorId}>{error}</span> : null}
    </fieldset>
  );
});

export const Radio = /* @__PURE__ */ forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size, label, description, className, disabled, name, value, checked, defaultChecked, onChange, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const descriptionId = useId();
  const resolvedDisabled = disabled ?? group?.disabled;
  const resolvedName = name ?? group?.name;
  const resolvedChecked = checked ?? (group?.value !== undefined && value !== undefined ? group.value === value : undefined);
  const resolvedDescription = description ? [describedBy, descriptionId].filter(Boolean).join(" ") : describedBy;
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    group?.onChange?.(event);
  };

  return (
    <label className={radioVariants({ size }, className)} {...(resolvedDisabled ? { "data-disabled": "" } : {})}>
      <input
        ref={ref}
        type="radio"
        className="area-radio__control"
        disabled={resolvedDisabled}
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        defaultChecked={resolvedChecked === undefined ? defaultChecked : undefined}
        aria-describedby={resolvedDescription}
        onChange={change}
        {...rest}
      />
      {label || description ? (
        <span className="area-choice-label">
          {label ? <span className="area-choice-label__title">{label}</span> : null}
          {description ? <span className="area-choice-label__description" id={descriptionId}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
});
export const Switch = /* @__PURE__ */ choice<SwitchSize>("switch", switchVariants);

export type RadioProps = Omit<ChoiceProps, "size"> & { size?: VariantProps<typeof MANIFESTS.radio>["size"] };
export type SwitchProps = Omit<ChoiceProps, "size"> & { size?: SwitchSize };
