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
import type { FieldsetHTMLAttributes, ChangeEvent, MouseEvent, ReactNode } from "react";
import { MANIFESTS, checkboxVariants, checkboxGroupVariants } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
import type { ChoiceProps, Size } from "./choice.ts";
export interface CheckboxProps extends ChoiceProps {
  /**
   * A contained, full-width option: `surface` (an edge, its control at the end) or `soft` (a fill and no edge, the
   * chosen one filled darker, as a settings list's options). It keeps native checkbox behavior.
   */
  variant?: VariantProps<typeof MANIFESTS.checkbox>["variant"] | /** @deprecated Use `surface`. */ "card";
  /** Card layout: `row` (visual, text, control on one line), `list` (the control first, then the text, then meta: a list
   * of options), `tile` (visual above the label, control in the corner) or `preview` (the visual centred as the choice's
   * own picture, the label centred under it, no control drawn), `thumbnail` (the picture is the card, its name under
   * it outside, at the start: an Appearance picker's) `media` (the picture in an 8px mat, a list row under
   * it) or `media-row` (the picture at the row's start, the row centred beside it; `--area-choice-media` sets its share). */
  layout?: VariantProps<typeof MANIFESTS.checkbox>["layout"];
  /** The box and its row: `md` (default), its size from the type, or `lg`, the touch row. */
  size?: Size;
  /** The option's visible name; it names the control. */
  label?: ReactNode;
  /** A line under the label, read as the control's description. */
  description?: ReactNode;
  /** Alias for description when the copy is presented as an option caption. */
  caption?: ReactNode;
  /** A short value at the option's end, muted and tabular: what the choice comes to ("11:24 AM", "14 questions"). */
  meta?: ReactNode;
  /** Decorative context beside the mark. The visible label must still name the option. */
  leadingVisual?: ReactNode;
  /** Marks an individual required choice as invalid. Group validation belongs on CheckboxGroup. */
  invalid?: boolean;
  /** Shows the native mixed state; useful for a parent that represents a partial selection. */
  indeterminate?: boolean;
  /**
   * Shows a state set elsewhere: the box can't be toggled (a native checkbox ignores `readonly`, so Checkbox blocks the
   * click), announces `aria-readonly`, and keeps its paint, a chosen card its selected edge, as Radio group's and Switch's.
   */
  readOnly?: boolean;
  /** Called with the new state and the change event, as Switch's. Native `onChange` still runs first. */
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = /* @__PURE__ */ forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { variant, layout, size, label, description, caption, leadingVisual, meta, invalid, indeterminate = false, onCheckedChange, onChange, onClick, readOnly: readOnlyProp,
    className, disabled: disabledProp, name: nameProp, value, checked: checkedProp, defaultChecked, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...rest },
  ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  size = useSystemDefault("checkbox", "size", size, checkboxVariants.manifest.variants.size);
  // In a CheckboxGroup with a value, the group says which are checked, their name and whether they can change (O5).
  const group = useContext(CheckboxGroupContext);
  const optionValue = value === undefined ? undefined : String(value);
  const inGroupValue = group?.value !== undefined && optionValue !== undefined;
  const checked = checkedProp ?? (inGroupValue ? group!.value!.includes(optionValue!) : undefined);
  const readOnly = readOnlyProp ?? group?.readOnly;
  const disabled = disabledProp ?? group?.disabled;
  const name = nameProp ?? group?.name;
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
      className={checkboxVariants({ variant: variant === "card" ? "surface" : variant, layout: variant ? layout : undefined, size }, className)}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(invalidState ? { "data-invalid": "" } : {})}
      {...(readOnly ? { "data-read-only": "" } : {})}
    >
      <input
        ref={setControl}
        type="checkbox"
        className="area-checkbox__control"
        disabled={disabled}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        aria-describedby={resolvedDescription}
        aria-invalid={invalidState ? true : ariaInvalid}
        aria-readonly={readOnly || undefined}
        {...(invalidState ? { "data-invalid": "" } : {})}
        {...(indeterminate ? { "data-indeterminate": "" } : {})}
        {...rest}
        // A read-only box keeps its state: the click that would toggle it is cancelled (as Switch's).
        onClick={(event: MouseEvent<HTMLInputElement>) => { if (readOnly) { event.preventDefault(); return; } onClick?.(event); }}
        onChange={onChange || onCheckedChange || inGroupValue || readOnly ? event => {
          if (readOnly) return;
          onChange?.(event);
          if (event.defaultPrevented) return;
          onCheckedChange?.(event.target.checked, event);
          if (inGroupValue) group!.toggle(optionValue!, event.target.checked, event);
        } : undefined}
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

interface CheckboxGroupContextValue {
  /** The checked values, when the group holds them (`value` or `defaultValue`); otherwise each Checkbox holds its own. */
  value?: readonly string[];
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  toggle: (value: string, checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" | "defaultValue"> {
  /** `vertical` (default): one option under another. `horizontal`: in a row that wraps. */
  orientation?: VariantProps<typeof MANIFESTS.checkboxGroup>["orientation"];
  /** Visible group label, rendered as the native fieldset legend. */
  label: ReactNode;
  /** Help text under the legend, read as the group's description. */
  description?: ReactNode;
  /** The Checkboxes. */
  children: ReactNode;
  /** Validation message for an otherwise valid group (for example, a selection summary). */
  validation?: ReactNode;
  /** An error message under the options; it marks the group invalid. */
  error?: ReactNode;
  /** Semantic status for a non-error validation message. */
  validationStatus?: "success" | "warning";
  /**
   * The checked options' values, controlled, as Radio group's `value` for several. Each Checkbox is read by its
   * `value`; a Checkbox's own `checked` still wins. Leave `value` and `defaultValue` out and each Checkbox holds its
   * own state.
   */
  value?: readonly string[];
  /** The values checked at first (uncontrolled); a form reset returns to them. */
  defaultValue?: readonly string[];
  /** Shared native name, so every option submits under it; an individual Checkbox name takes precedence. */
  name?: string;
  /** Shows choices made elsewhere: no option can be toggled, each announces `aria-readonly`, as Radio group's. */
  readOnly?: boolean;
  /** The checked values after a change, in the order they were checked, and the change event. */
  onValueChange?: (value: string[], event: ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxGroup = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  { children, label, description, validation, error, validationStatus, orientation, value, defaultValue, onValueChange, name, readOnly, className, disabled,
    "aria-describedby": describedBy, ...rest },
  ref,
) {
  const descriptionId = useId();
  const errorId = useId();
  const root = useRef<HTMLFieldSetElement | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState<readonly string[] | undefined>(defaultValue);
  const initial = useRef(defaultValue);
  const selected = value ?? uncontrolledValue;
  const validationMessage = error ?? validation;
  const resolvedDescription = [describedBy, description ? descriptionId : undefined, validationMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  const status = error ? "error" : validationStatus;
  const toggle = (option: string, checked: boolean, event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const current = selected ?? [];
    const next = checked ? (current.includes(option) ? [...current] : [...current, option]) : current.filter(entry => entry !== option);
    if (value === undefined) setUncontrolledValue(next);
    onValueChange?.(next, event);
  };

  // A form reset returns an uncontrolled group to its first values, as Radio group's does.
  useEffect(() => {
    const form = root.current?.form ?? root.current?.closest("form");
    if (!form || value !== undefined || initial.current === undefined) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) setUncontrolledValue(initial.current); });
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value]);

  return (
    <fieldset
      ref={node => { root.current = node; assignRef(ref, node); }}
      className={checkboxGroupVariants({ orientation }, className)}
      disabled={disabled}
      aria-describedby={resolvedDescription}
      aria-invalid={error ? true : undefined}
      {...(error ? { "data-invalid": "" } : {})}
      {...(status === "success" ? { "data-success": "" } : {})}
      {...(status === "warning" ? { "data-warning": "" } : {})}
      {...(readOnly ? { "data-read-only": "" } : {})}
      {...rest}
    >
      <legend className="area-checkbox-group__legend">{label}</legend>
      {description ? <span className="area-checkbox-group__description" id={descriptionId}>{description}</span> : null}
      <div className="area-checkbox-group__options">
        <CheckboxGroupContext.Provider value={{ value: selected, name, disabled, readOnly, toggle }}>
          {children}
        </CheckboxGroupContext.Provider>
      </div>
      {validationMessage ? <span className="area-checkbox-group__validation" id={errorId}>{validationMessage}</span> : null}
    </fieldset>
  );
});

