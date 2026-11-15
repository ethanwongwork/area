// Shared by Checkbox and Radio: the props both choice controls take.
import type { InputHTMLAttributes, ReactNode } from "react";
import { MANIFESTS } from "../variants.ts";
import type { VariantProps } from "../variants.ts";
export type Size = NonNullable<VariantProps<typeof MANIFESTS.checkbox>["size"]>;
/* --- Choice controls ------------------------------------------------------ */

export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** The box and its row: `md` (default), its size from the type, or `lg`, the touch row. */
  size?: Size;
  /** The option's visible name; it names the control. */
  label?: ReactNode;
  /** A line under the label, read as the control's description. */
  description?: ReactNode;
}

