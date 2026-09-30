import { forwardRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { modelPickerVariants } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Menu, MenuItem, MenuLabel } from "./primitives.tsx";

export interface ModelOption {
  value: string;
  label: string;
  /** A muted note under the label ("Leaving on October 14", "Best for code"). */
  description?: ReactNode;
  disabled?: boolean;
}

export interface ModelPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  models: ModelOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
  { models, value, defaultValue, onValueChange, label = "Model", heading, size = "md", className, ...rest }, ref,
) {
  const [own, setOwn] = useState(defaultValue ?? models[0]?.value);
  const current = value ?? own;
  const currentModel = models.find(model => model.value === current);

  const choose = (next: string) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };
  return <div ref={ref} className={modelPickerVariants({}, className)} {...rest}>
    <Menu aria-label={label} align="end"
      trigger={<Button className="area-model-picker__trigger" variant="ghost" tone="neutral" size={size}
        aria-label={`${label}: ${currentModel?.label ?? ""}`} trailingIcon={<Glyph name="chevron-down" />}>
        {currentModel?.label}
      </Button>}>
      {heading ? <MenuLabel>{heading}</MenuLabel> : null}
      {models.map(model => <MenuItem key={model.value} role="menuitemradio" checked={model.value === current}
        description={model.description} disabled={model.disabled} onClick={() => choose(model.value)}>{model.label}</MenuItem>)}
    </Menu>
  </div>;
});
