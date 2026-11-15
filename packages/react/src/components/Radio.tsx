import { useSystemDefault } from "./SystemDefaults.tsx";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { assignRef } from "./overlay.ts";
import type { FieldsetHTMLAttributes, ChangeEvent, ReactNode } from "react";
import { MANIFESTS, radioGroupVariants, radioVariants } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
import type { ChoiceProps } from "./choice.ts";
interface RadioGroupContextValue {
  name?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" | "onChange"> {
  /** `vertical` (default): one option under another. `horizontal`: in a row that wraps. */
  orientation?: VariantProps<typeof MANIFESTS.radioGroup>["orientation"];
  /** Visible group label. Renders the native fieldset legend. */
  label: ReactNode;
  /** Help text under the legend, read as the group's description. */
  description?: ReactNode;
  /** The Radios. */
  children: ReactNode;
  /** An error message under the options; it marks the group invalid. */
  error?: ReactNode;
  /** Validation message for an otherwise valid group (a hint once chosen), as Checkbox group's. */
  validation?: ReactNode;
  /** Semantic status for a non-error validation message: `success` or `warning`, as Checkbox group's. */
  validationStatus?: "success" | "warning";
  /** Shared native radio name. Generated when omitted, so the options always form one native
   * group (one Tab stop, arrow keys, form submission). An individual Radio name takes precedence. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled use. */
  defaultValue?: string;
  /**
   * Shows a value that isn't chosen here (a past answer in a conversation, a setting set elsewhere): the chosen
   * option keeps its paint, its dot and a card's selected edge and tint, the pointer paints nothing, and the group
   * ignores changes. The group becomes a radiogroup with `aria-readonly`, named by its legend.
   */
  readOnly?: boolean;
  /** Called with the chosen option's value and the change event. */
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

export const RadioGroup = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { children, label, description, error, validation, validationStatus, name, value, defaultValue, onValueChange, orientation, readOnly, className, disabled,
    "aria-describedby": describedBy, ...rest },
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
  const validationMessage = error ?? validation;
  const status = error ? "error" : validationStatus;
  const resolvedDescription = [describedBy, description ? descriptionId : undefined, validationMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined;
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
      {...(status === "success" ? { "data-success": "" } : {})}
      {...(status === "warning" ? { "data-warning": "" } : {})}
      {...(readOnly ? { role: "radiogroup", "aria-readonly": true, "aria-labelledby": legendId, "data-read-only": "" } : {})}
      {...rest}
    >
      <legend className="area-radio-group__legend" id={readOnly ? legendId : undefined}>{label}</legend>
      {description ? <span className="area-radio-group__description" id={descriptionId}>{description}</span> : null}
      <div className="area-radio-group__options">
        <RadioGroupContext.Provider value={{ name: groupName, value: selectedValue, disabled, readOnly, onChange: change }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
      {validationMessage ? <span className="area-radio-group__validation" id={errorId}>{validationMessage}</span> : null}
    </fieldset>
  );
});

export const Radio = /* @__PURE__ */ forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { variant, layout, size, label, description, caption, leadingVisual, meta, className, disabled, name, value, checked, defaultChecked, onChange, "aria-describedby": describedBy, ...rest },
  ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  size = useSystemDefault("radio", "size", size, radioVariants.manifest.variants.size);
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
    <label className={radioVariants({ variant: variant === "card" ? "surface" : variant, layout: variant ? layout : undefined, size }, className)} {...(resolvedDisabled ? { "data-disabled": "" } : {})}
      {...(group?.readOnly ? { "data-read-only": "" } : {})}>
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

export type RadioProps = Omit<ChoiceProps, "size"> & {
  /** A contained, full-width option: `surface` (an edge) or `soft` (a fill, the chosen one darker), as Checkbox. */
  variant?: VariantProps<typeof MANIFESTS.radio>["variant"] | /** @deprecated Use `surface`. */ "card";
  /** Card layout: `row`, `list` (the control first), `tile`, `preview`, `thumbnail`, `media` or `media-row`, as Checkbox. */
  layout?: VariantProps<typeof MANIFESTS.radio>["layout"];
  /** A short value at the option's end, as Checkbox. */
  meta?: ReactNode;
  /** Decorative context beside the text. The visible label must still name the option. */
  leadingVisual?: ReactNode;
  /** Alias for description, as Checkbox. */
  caption?: ReactNode;
  /** The circle and its row: `md` (default), its size from the type, or `lg`, the touch row. */
  size?: VariantProps<typeof MANIFESTS.radio>["size"];
};
