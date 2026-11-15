import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef } from "react";
import type { TextareaHTMLAttributes, ChangeEvent } from "react";
import { MANIFESTS, textareaVariants } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The field's treatment: `outline` (default), an edge; `soft`, a fill. */
  variant?: VariantProps<typeof MANIFESTS.textarea>["variant"];
  /** The text's size and the padding: `md` (default) or `sm`. */
  size?: VariantProps<typeof MANIFESTS.textarea>["size"];
  /** Controls which directions the native resize affordance can change. */
  resize?: VariantProps<typeof MANIFESTS.textarea>["resize"];
  /** Stretch to the available inline size. The default is a contained 16rem measure. */
  fullWidth?: boolean;
  /** Internal Field-to-Textarea validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: "error" | "success" | "warning";
  /** Semantic validation paint. `invalid` remains the compatibility alias for `error`. */
  validationStatus?: "error" | "success" | "warning";
  /** Paints the field as an error and sets `aria-invalid`; the same as `validationStatus="error"`. */
  invalid?: boolean;
  /** Called with the text and the change event, after native `onChange`. */
  onValueChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const Textarea = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    variant,
    size,
    resize,
    fullWidth,
    validationStatus,
    invalid,
    onChange,
    onValueChange,
    className,
    "aria-invalid": ariaInvalid,
    "data-validation-status": fieldValidationStatus,
    ...rest
  },
  ref,
) {
  variant = useSystemDefault("textarea", "variant", variant, textareaVariants.manifest.variants.variant); // the system's default (SystemDefaults) where the use gives none
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
      {...(rest.readOnly ? { "data-read-only": "" } : {})}
      {...rest}
      onChange={onChange || onValueChange ? (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event);
        if (!event.defaultPrevented) onValueChange?.(event.target.value, event);
      } : undefined}
    />
  );
});

