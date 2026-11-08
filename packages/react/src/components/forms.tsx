import { createContext, forwardRef, useContext, useEffect, useId, useRef, useState } from "react";
import { assignRef } from "./overlay.ts";
import { ToolbarSize } from "./toolbar-context.ts";
import { InputGroupContext } from "./input-group-context.ts";
import type { FieldsetHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ChangeEvent, ReactNode } from "react";
import { MANIFESTS, selectVariants, textareaVariants, checkboxVariants, checkboxGroupVariants, radioGroupVariants, radioVariants } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
type Size = NonNullable<VariantProps<typeof MANIFESTS.checkbox>["size"]>;


/* --- Select / Textarea ---------------------------------------------------- */

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple"> {
  /** `soft` is the flat filled field, shared with Input, Textarea and NumberField. */
  variant?: VariantProps<typeof MANIFESTS.select>["variant"];
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
    variant,
    size: sizeProp,
    fullWidth,
    validationStatus: validationStatusProp,
    invalid,
    disabled: disabledProp,
    className,
    "aria-invalid": ariaInvalid,
    "data-validation-status": fieldValidationStatus,
    ...rest
  },
  ref,
) {
  // In a Toolbar, a Select without its own size takes the bar's tier (audit A-7).
  const toolbarSize = useContext(ToolbarSize);
  const size = sizeProp ?? toolbarSize;
  // Inside an InputGroup, the group's Field state reaches the control (audit B-14).
  const group = useContext(InputGroupContext);
  const disabled = disabledProp ?? group.disabled;
  const validationStatus = validationStatusProp ?? group.validationStatus;
  const invalidState = validationStatus === "error" || invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");
  const resolvedValidationStatus = invalidState ? "error" : validationStatus ?? fieldValidationStatus;

  return (
    <select
      ref={ref}
      className={selectVariants({ variant, size, fullWidth }, className)}
      disabled={disabled}
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
  /** A contained, full-width option: `card` (an edge, its control at the end) or `soft` (a fill and no edge, the chosen
   * one filled darker: a settings list's options, Notion Calendar's). It preserves native Checkbox behavior. */
  variant?: VariantProps<typeof MANIFESTS.checkbox>["variant"];
  /** Card layout: `row` (visual, text, control on one line), `list` (the control first, then the text, then meta: a list
   * of options), `tile` (visual above the label, control in the corner) or `preview` (the visual centred as the choice's
   * own picture, the label centred under it, no control drawn), `thumbnail` (the picture is the card, its name under
   * it outside, at the start: an Appearance picker's) `media` (the picture in an 8px mat, a list row under
   * it) or `media-row` (the picture at the row's start, the row centred beside it; `--area-choice-media` sets its share). */
  layout?: VariantProps<typeof MANIFESTS.checkbox>["layout"];
  /** A short value at the option's end, muted and tabular: what the choice comes to ("11:24 AM", "14 questions"). */
  meta?: ReactNode;
  /** Decorative context beside the mark. The visible label must still name the option. */
  leadingVisual?: ReactNode;
  /** Alias for description when the copy is presented as an option caption. */
  caption?: ReactNode;
  /** Marks an individual required choice as invalid. Group validation belongs on CheckboxGroup. */
  invalid?: boolean;
  /** Shows the native mixed state; useful for a parent that represents a partial selection. */
  indeterminate?: boolean;
  /** Called with the new state and the change event, as Switch (audit S17). Native `onChange` still runs first. */
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = /* @__PURE__ */ forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { variant, layout, size, label, description, caption, leadingVisual, meta, invalid, indeterminate = false, onCheckedChange, onChange, className, disabled, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...rest },
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
      className={checkboxVariants({ variant, layout: variant ? layout : undefined, size }, className)}
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
        onChange={onChange || onCheckedChange ? event => { onChange?.(event); if (!event.defaultPrevented) onCheckedChange?.(event.target.checked, event); } : undefined}
      />
      {leadingVisual ? <span className="area-checkbox__visual" aria-hidden="true">{leadingVisual}</span> : null}
      {label || resolvedCaption ? (
        <span className="area-choice-label">
          {label ? <span className="area-choice-label__title">{label}</span> : null}
          {resolvedCaption ? <span className="area-choice-label__description" id={descriptionId}>{resolvedCaption}</span> : null}
        </span>
      ) : null}
      {meta != null ? <span className="area-checkbox__meta">{meta}</span> : null}
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
  /** Shared native radio name. Generated when omitted, so the options always form one native
   * group (one Tab stop, arrow keys, form submission). An individual Radio name takes precedence. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled use. */
  defaultValue?: string;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  orientation?: VariantProps<typeof MANIFESTS.radioGroup>["orientation"];
  /**
   * Shows a value that isn't chosen here (a past answer in a conversation, a setting set elsewhere): the chosen option
   * keeps its control's dot and the row's fill, without the selected edge or tint, and the group ignores changes. The
   * group becomes a radiogroup with aria-readonly, named by its legend.
   */
  readOnly?: boolean;
}

export const RadioGroup = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { children, label, description, error, name, value, defaultValue, onValueChange, orientation, readOnly, className, disabled, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const root = useRef<HTMLFieldSetElement | null>(null);
  const initial = useRef(defaultValue);
  const descriptionId = useId();
  const errorId = useId();
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const selectedValue = value ?? uncontrolledValue;
  const resolvedDescription = [describedBy, description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  const legendId = useId();
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    if (value === undefined) setUncontrolledValue(event.target.value);
    onValueChange?.(event.target.value, event);
  };

  // A form reset returns an uncontrolled group to its first value, as Switch and Slider do
  // (audit C-9); the radios are controlled by the group, so the native reset alone can't.
  useEffect(() => {
    const form = root.current?.form ?? root.current?.closest("form");
    if (!form || value !== undefined) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) setUncontrolledValue(initial.current); });
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value]);

  return (
    <fieldset
      ref={node => { root.current = node; assignRef(ref, node); }}
      className={radioGroupVariants({ orientation }, className)}
      disabled={disabled}
      aria-describedby={resolvedDescription}
      aria-invalid={error ? true : undefined}
      {...(error ? { "data-invalid": "" } : {})}
      {...(readOnly ? { role: "radiogroup", "aria-readonly": true, "aria-labelledby": legendId, "data-readonly": "" } : {})}
      {...rest}
    >
      <legend className="area-radio-group__legend" id={readOnly ? legendId : undefined}>{label}</legend>
      {description ? <span className="area-radio-group__description" id={descriptionId}>{description}</span> : null}
      <div className="area-radio-group__options">
        <RadioGroupContext.Provider value={{ name: groupName, value: selectedValue, disabled, onChange: change }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
      {error ? <span className="area-radio-group__validation" id={errorId}>{error}</span> : null}
    </fieldset>
  );
});

export const Radio = /* @__PURE__ */ forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { variant, layout, size, label, description, caption, leadingVisual, meta, className, disabled, name, value, checked, defaultChecked, onChange, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const descriptionId = useId();
  const resolvedDisabled = disabled ?? group?.disabled;
  const resolvedName = name ?? group?.name;
  const resolvedChecked = checked ?? (group?.value !== undefined && value !== undefined ? group.value === value : undefined);
  const resolvedCaption = caption ?? description;
  const resolvedDescription = resolvedCaption ? [describedBy, descriptionId].filter(Boolean).join(" ") : describedBy;
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    group?.onChange?.(event);
  };

  return (
    <label className={radioVariants({ variant, layout: variant ? layout : undefined, size }, className)} {...(resolvedDisabled ? { "data-disabled": "" } : {})}>
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
      {leadingVisual ? <span className="area-radio__visual" aria-hidden="true">{leadingVisual}</span> : null}
      {label || resolvedCaption ? (
        <span className="area-choice-label">
          {label ? <span className="area-choice-label__title">{label}</span> : null}
          {resolvedCaption ? <span className="area-choice-label__description" id={descriptionId}>{resolvedCaption}</span> : null}
        </span>
      ) : null}
      {meta != null ? <span className="area-radio__meta">{meta}</span> : null}
    </label>
  );
});
export { Switch, type SwitchProps } from "./Switch.tsx";

export type RadioProps = Omit<ChoiceProps, "size"> & {
  /** A contained, full-width option: `card` (an edge) or `soft` (a fill, the chosen one darker), as Checkbox. */
  variant?: VariantProps<typeof MANIFESTS.radio>["variant"];
  /** Card layout: `row`, `list` (the control first), `tile`, `preview`, `thumbnail`, `media` or `media-row`, as Checkbox. */
  layout?: VariantProps<typeof MANIFESTS.radio>["layout"];
  /** A short value at the option's end, as Checkbox. */
  meta?: ReactNode;
  /** Decorative context beside the text. The visible label must still name the option. */
  leadingVisual?: ReactNode;
  /** Alias for description, as Checkbox. */
  caption?: ReactNode;
  size?: VariantProps<typeof MANIFESTS.radio>["size"];
};
