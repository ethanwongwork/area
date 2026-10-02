import { forwardRef, useState } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import { modelPickerVariants } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Menu, MenuItem, MenuLabel } from "./primitives.tsx";
/** The empty collection, one reference so effects keyed on it stay still. */
const NO_ITEMS: never[] = [];

export interface ModelOption {
  value: string;
  label: string;
  /** A muted note under the label ("Leaving on October 14", "Best for code"). */
  description?: ReactNode;
  disabled?: boolean;
}

export interface ModelPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The models. Collections are `items` everywhere (audit H-14). */
  items?: ModelOption[];
  /** @deprecated Use `items`. */
  models?: ModelOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
  /** Props and ref for the trigger Button; `ref` and the rest land on the wrapper (audit S17, G-24). */
  triggerProps?: Omit<ButtonProps, "children" | "variant" | "tone" | "size" | "trailingIcon"> & { ref?: Ref<HTMLButtonElement> };
  /** Names the menu and the trigger ("Model"). */
  label?: string;
  /** An optional heading over the rows. */
  heading?: ReactNode;
  size?: "sm" | "md" | "lg";
}

/**
 * Picks the model a message is sent with, from a ghost trigger in the composer. The menu is
 * Menu's own trigger path (audit G-11): the shared placement engine (flip and shift, opening
 * back across the composer from the trigger's end), Enter, Space and the arrows to open,
 * Escape and Tab to close, and focus back on the trigger after a choice.
 */
export const ModelPicker = forwardRef<HTMLDivElement, ModelPickerProps>(function ModelPicker(
  { items, models: legacyModels, value, defaultValue, onValueChange, triggerProps, label = "Model", heading, size = "md", className, ...rest }, ref,
) {
  const models = items ?? legacyModels ?? NO_ITEMS;
  const [own, setOwn] = useState(defaultValue ?? models[0]?.value);
  const current = value ?? own;
  const currentModel = models.find(model => model.value === current);

  const choose = (next: string, event: MouseEvent<HTMLButtonElement>) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next, event);
  };
  return <div ref={ref} className={modelPickerVariants({}, className)} {...rest}>
    <Menu aria-label={label} align="end"
      trigger={<Button {...triggerProps} className={["area-model-picker__trigger", triggerProps?.className].filter(Boolean).join(" ")} variant="ghost" tone="neutral" size={size}
        aria-label={`${label}: ${currentModel?.label ?? ""}`} trailingIcon={<Glyph name="chevron-down" />}>
        {currentModel?.label}
      </Button>}>
      {heading ? <MenuLabel>{heading}</MenuLabel> : null}
      {models.map(model => <MenuItem key={model.value} radio checked={model.value === current}
        description={model.description} disabled={model.disabled} onClick={event => choose(model.value, event)}>{model.label}</MenuItem>)}
    </Menu>
  </div>;
});
