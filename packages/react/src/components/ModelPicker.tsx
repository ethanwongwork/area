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
  /**
   * How hard the model works ("Light", "Medium", "High"): shown muted after the model's name on the trigger ("Opus 5.5
   * Medium", Codex's "6 Astra Light"), chosen in an Effort group under the models.
   */
  efforts?: ModelOption[];
  effort?: string;
  defaultEffort?: string;
  onEffortChange?: (effort: string, event: MouseEvent<HTMLButtonElement>) => void;
  /** Names the effort group ("Effort"). */
  effortLabel?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Picks the model a message is sent with, from a ghost trigger in the composer. The menu is
 * Menu's own trigger path (audit G-11): the shared placement engine (flip and shift, opening
 * back across the composer from the trigger's end), Enter, Space and the arrows to open,
 * Escape and Tab to close, and focus back on the trigger after a choice.
 */
export const ModelPicker = forwardRef<HTMLDivElement, ModelPickerProps>(function ModelPicker(
  { items, models: legacyModels, value, defaultValue, onValueChange, triggerProps, label = "Model", heading, size = "md",
    efforts, effort: effortProp, defaultEffort, onEffortChange, effortLabel = "Effort", className, ...rest }, ref,
) {
  const models = items ?? legacyModels ?? NO_ITEMS;
  const [own, setOwn] = useState(defaultValue ?? models[0]?.value);
  const current = value ?? own;
  const currentModel = models.find(model => model.value === current);

  const choose = (next: string, event: MouseEvent<HTMLButtonElement>) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next, event);
  };
  const [ownEffort, setOwnEffort] = useState(defaultEffort ?? efforts?.[0]?.value);
  const currentEffort = efforts?.find(option => option.value === (effortProp ?? ownEffort));
  const chooseEffort = (next: string, event: MouseEvent<HTMLButtonElement>) => {
    if (effortProp === undefined) setOwnEffort(next);
    onEffortChange?.(next, event);
  };
  return <div ref={ref} className={modelPickerVariants({}, className)} {...rest}>
    <Menu aria-label={label} align="end"
      trigger={<Button {...triggerProps} className={["area-model-picker__trigger", triggerProps?.className].filter(Boolean).join(" ")} variant="ghost" tone="neutral" size={size}
        aria-label={`${label}: ${currentModel?.label ?? ""}${currentEffort ? `, ${currentEffort.label}` : ""}`} trailingIcon={<Glyph name="chevron-down" />}>
        {currentEffort ? <><span className={modelPickerVariants.element("name")}>{currentModel?.label}</span>{" "}<span className={modelPickerVariants.element("effort")}>{currentEffort.label}</span></> : currentModel?.label}
      </Button>}>
      {heading ? <MenuLabel>{heading}</MenuLabel> : null}
      {models.map(model => <MenuItem key={model.value} radio checked={model.value === current}
        description={model.description} disabled={model.disabled} onClick={event => choose(model.value, event)}>{model.label}</MenuItem>)}
      {efforts?.length ? <>
        <MenuLabel>{effortLabel}</MenuLabel>
        {efforts.map(option => <MenuItem key={option.value} radio checked={option.value === currentEffort?.value}
          description={option.description} disabled={option.disabled} onClick={event => chooseEffort(option.value, event)}>{option.label}</MenuItem>)}
      </> : null}
    </Menu>
  </div>;
});
