import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef, useContext } from "react";
import { ToolbarSize } from "./toolbar-context.ts";
import { InputGroupContext } from "./input-group-context.ts";
import type { SelectHTMLAttributes, ChangeEvent } from "react";
import { MANIFESTS, selectVariants } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
/* --- Select / Textarea ---------------------------------------------------- */

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple"> {
  /** `soft` is the flat filled field, shared with Input, Textarea and NumberField. */
  variant?: VariantProps<typeof MANIFESTS.select>["variant"];
  /** The field's height and type: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.select>["size"];
  /** Stretch to the available inline size. The default is a contained 16rem measure. */
  fullWidth?: boolean;
  /** Internal Field-to-Select validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: "error" | "success" | "warning";
  /** Semantic validation paint. `invalid` remains the compatibility alias for `error`. */
  validationStatus?: "error" | "success" | "warning";
  /** Paints the field as an error and sets `aria-invalid`; the same as `validationStatus="error"`. */
  invalid?: boolean;
  /** Called with the chosen option's value and the change event, after native `onChange`. */
  onValueChange?: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    variant,
    size: sizeProp,
    fullWidth,
    validationStatus: validationStatusProp,
    invalid,
    disabled: disabledProp,
    onChange,
    onValueChange,
    className,
    "aria-invalid": ariaInvalid,
    "data-validation-status": fieldValidationStatus,
    ...rest
  },
  ref,
) {
  variant = useSystemDefault("select", "variant", variant, selectVariants.manifest.variants.variant); // the system's default (SystemDefaults) where the use gives none
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
      onChange={onChange || onValueChange ? (event: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event);
        if (!event.defaultPrevented) onValueChange?.(event.target.value, event);
      } : undefined}
    />
  );
});

