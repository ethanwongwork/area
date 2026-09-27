import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
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

/** Picks the model a message is sent with, from a ghost trigger in the composer. */
export const ModelPicker = forwardRef<HTMLDivElement, ModelPickerProps>(function ModelPicker(
  { models, value, defaultValue, onValueChange, label = "Model", heading, size = "md", className, style, ...rest }, ref,
) {
  const id = useId();
  const menuId = `${id}-menu`;
  const [own, setOwn] = useState(defaultValue ?? models[0]?.value);
  const current = value ?? own;
  const currentModel = models.find(model => model.value === current);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || typeof menu.showPopover !== "function") return;
    const shown = menu.matches(":popover-open");
    if (open && !shown) {
      menu.showPopover();
      (menu.querySelector<HTMLElement>('[aria-checked="true"]') ?? menu.querySelector<HTMLElement>('[role="menuitemradio"]'))?.focus();
    }
    if (!open && shown) menu.hidePopover();
  }, [open]);

  const choose = (next: string) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
    setOpen(false);
    triggerRef.current?.focus();
  };
  return <div ref={ref} className={modelPickerVariants({}, className)}
    style={{ ...style, "--_model-anchor": `--area-model-${id.replace(/[^a-zA-Z0-9_-]/g, "")}` } as CSSProperties} {...rest}>
    <Button ref={triggerRef} className="area-model-picker__trigger" variant="ghost" tone="neutral" size={size}
      aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label={`${label}: ${currentModel?.label ?? ""}`}
      trailingIcon={<Glyph name="chevron-down" />} onClick={() => setOpen(!open)}>
      {currentModel?.label}
    </Button>
    <Menu ref={menuRef} id={menuId} popover="auto" aria-label={label} className="area-model-picker__menu"
      onToggle={event => { if ((event.nativeEvent as ToggleEvent).newState === "closed") setOpen(false); }}
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); } }}>
      {heading ? <MenuLabel>{heading}</MenuLabel> : null}
      {models.map(model => <MenuItem key={model.value} role="menuitemradio" checked={model.value === current}
        description={model.description} disabled={model.disabled} onClick={() => choose(model.value)}>{model.label}</MenuItem>)}
    </Menu>
  </div>;
});
