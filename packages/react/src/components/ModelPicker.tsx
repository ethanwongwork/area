import { forwardRef, useState } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { modelPickerVariants } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
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
  /** The models to choose from (audit S17 / H-14: a value choice is `options`). */
  options?: ModelOption[];
  /** @deprecated Use `options`. */
  models?: ModelOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
  /** Names the menu and the trigger ("Model"). */
  "aria-label"?: string;
  /** @deprecated Name it with `aria-label` (audit S17: `label` is visible text; names are `aria-label`). */
  label?: string;
  /** An optional heading over the rows. */
  heading?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Props for the trigger Button (ref and rest go to the wrapper, audit G-24). */
  triggerProps?: Omit<ButtonProps, "children" | "trailingIcon">;
}

/**
 * Picks the model a message is sent with, from a ghost trigger in the composer. The menu is
 * Menu's own trigger path (audit G-11): the shared placement engine (flip and shift, opening
 * back across the composer from the trigger's end), Enter, Space and the arrows to open,
 * Escape and Tab to close, and focus back on the trigger after a choice.
 */
export const ModelPicker = forwardRef<HTMLDivElement, ModelPickerProps>(function ModelPicker(
  { options, models: modelsProp, value, defaultValue, onValueChange, "aria-label": ariaLabel, label: labelProp, heading, size = "md", triggerProps, className, ...rest }, ref,
) {
  const label = ariaLabel ?? labelProp ?? "Model";
  const models = options ?? modelsProp ?? [];
  const [own, setOwn] = useState(defaultValue ?? models[0]?.value);
  const current = value ?? own;
  const currentModel = models.find(model => model.value === current);

  const choose = (next: string, event: MouseEvent<HTMLButtonElement>) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next, event);
  };
  return <div ref={ref} className={modelPickerVariants({}, className)} {...rest}>
    <Menu aria-label={label} align="end"
      trigger={<Button variant="ghost" tone="neutral" size={size} {...triggerProps}
        className={["area-model-picker__trigger", triggerProps?.className].filter(Boolean).join(" ")}
        aria-label={`${label}: ${currentModel?.label ?? ""}`} trailingIcon={<Glyph name="chevron-down" />}>
        {currentModel?.label}
      </Button>}>
      {heading ? <MenuLabel>{heading}</MenuLabel> : null}
      {models.map(model => <MenuItem key={model.value} radio checked={model.value === current}
        description={model.description} disabled={model.disabled} onClick={event => choose(model.value, event)}>{model.label}</MenuItem>)}
    </Menu>
  </div>;
});
