import { useSystemDefault } from "./SystemDefaults.tsx";
import type { VariantProps } from "../variants.ts";
import { InToolbar, ToolbarSize, toolbarItemProps } from "./toolbar-context.ts";
import { MANIFESTS } from "../variants.ts";
import { assignRef } from "./overlay.ts";
import { forwardRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { segmentedVariants } from "../variants.ts";
import { Tooltip } from "./Tooltip.tsx";
import { type Div, NO_ITEMS } from "./shared.ts";
/* --- Segmented control ---------------------------------------------------- */

export interface SegmentedProps extends Omit<Div, "onChange" | "onSelect" | "defaultValue"> {
  /** The height and type: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.segmented>["size"];
  /** Stretch to the container, items sharing the width. For a panel row. */
  fullWidth?: boolean;
  /** Hide visible option labels while retaining their accessible names. */
  iconOnly?: boolean;
  /** The choices, each its value, label and optional icon. */
  items?: Array<{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }>;
  /** @deprecated Use `items`. */
  options?: Array<{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }>;
  /** The chosen value, controlled. */
  value?: string;
  /** The value chosen at first, uncontrolled; the first enabled choice by default. */
  defaultValue?: string;
  /** @deprecated Use `aria-label`, which names the radio group. */
  label?: string;
  /** Called with the chosen value and the click or key event that chose it. */
  onValueChange?: (value: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
  /** @deprecated Use `onValueChange`. */
  onSelect?: (value: string) => void;
  /** Submits the value with a form, as AlignmentPicker and ColorSwatchPicker do. */
  name?: string;
  /** The id of the form the value submits with, when the control sits outside it. */
  form?: string;
  /** Disables every option. */
  disabled?: boolean;
}

/**
 * Picks one value from a small set.
 *
 * Uses `role="radiogroup"` rather than a list of toggle buttons, because the choice is
 * exclusive — which is the distinction a screen reader needs and `aria-pressed` does not
 * convey.
 */
export const Segmented = /* @__PURE__ */ forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
  { size: sizeProp, fullWidth, iconOnly, items, options: legacyOptions, value: controlledValue, defaultValue, label, onValueChange, onSelect, name, form, disabled, className, ...rest },
  ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  const systemSize = useSystemDefault("segmented", "size", undefined as typeof sizeProp, segmentedVariants.manifest.variants.size);
  const options = items ?? legacyOptions ?? NO_ITEMS;
  const toolbarSize = useContext(ToolbarSize);
  // Its own size, else a toolbar's, else the system's.
  const size = sizeProp ?? toolbarSize ?? systemSize;
  const [localValue, setLocalValue] = useState(defaultValue ?? options.find(option => !option.disabled)?.value);
  const initial = useRef(localValue);
  const hidden = useRef<HTMLInputElement | null>(null);
  // A form reset returns an uncontrolled control to its first value, as the pickers do (audit C-9).
  useEffect(() => {
    const owner = hidden.current?.form;
    if (!owner || controlledValue !== undefined) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) setLocalValue(initial.current); });
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [controlledValue]);
  const value = controlledValue ?? localValue;
  const entry = options.find(option => option.value === value && !option.disabled) ?? options.find(option => !option.disabled);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  // In a toolbar every option is a roving item: the toolbar's arrows move focus across the
  // options and the other commands, Space or Enter chooses (WAI-ARIA toolbar with a radio group).
  const inToolbar = useContext(InToolbar);
  const select = (next: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
    if (controlledValue === undefined) setLocalValue(next);
    onValueChange?.(next, event);
    onSelect?.(next);
  };
  // One plate slides to the chosen option (docs/MOTION.md, "Tabs / Segmented indicator"; owner, 2026-10-24: subtle
  // motion): the track measures the selected option and paints the plate behind it (`data-plate`), so it moves rather
  // than jumping. Until it has measured (and in static markup) each option paints its own plate, as before.
  const track = useRef<HTMLDivElement | null>(null);
  const selectedValue = entry && entry.value === value ? entry.value : undefined;
  useLayoutEffect(() => {
    const host = track.current;
    if (!host) return;
    const place = () => {
      const button = selectedValue === undefined ? undefined : buttons.current.get(selectedValue);
      if (!button) { host.removeAttribute("data-plate"); return; }
      const outer = host.getBoundingClientRect(), inner = button.getBoundingClientRect();
      // Offsets in the track's own pixels, whatever scale or zoom it is drawn at.
      const laidOut = parseFloat(getComputedStyle(host).width);
      const factor = laidOut ? outer.width / laidOut : 1;
      host.style.setProperty("--_plate-x", `${(inner.left - outer.left) / factor - host.clientLeft}px`);
      host.style.setProperty("--_plate-w", `${inner.width / factor}px`);
      host.setAttribute("data-plate", "");
    };
    place();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    observer?.observe(host);
    for (const button of buttons.current.values()) observer?.observe(button);
    return () => observer?.disconnect();
  }, [selectedValue, options]);
  return (
    <div
      ref={node => { track.current = node; assignRef(ref, node); }}
      role="radiogroup"
      aria-label={rest["aria-label"] ?? label}
      aria-disabled={disabled || undefined}
      className={segmentedVariants({ size, fullWidth, iconOnly }, className)}
      {...rest}
    >
      {options.map((option) => {
        const button = (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          disabled={disabled || option.disabled}
          className="area-segmented__item"
          ref={node => { if (node) buttons.current.set(option.value, node); else buttons.current.delete(option.value); }}
          {...(inToolbar ? toolbarItemProps : { tabIndex: option.value === entry?.value ? 0 : -1 })}
          onClick={event => select(option.value, event)}
          onKeyDown={event => {
            if (inToolbar) return;
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const enabled = options.filter(item => !item.disabled);
            const index = enabled.findIndex(item => item.value === option.value);
            const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
            const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : (event.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
            const next = enabled[event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + step + enabled.length) % enabled.length];
            if (next) { select(next.value, event); buttons.current.get(next.value)?.focus(); }
          }}
          {...(option.value === value ? { "data-selected": "" } : {})}
        >
          {option.icon ? (
            <span className="area-segmented__icon" aria-hidden="true">
              {option.icon}
            </span>
          ) : null}
          <span className={iconOnly ? "area-sr-only" : "area-segmented__label"}>{option.label}</span>
        </button>
        );
        // An icon-only option names itself in an Area Tooltip, its label (product UI rule 4,
        // docs/PRODUCT_UI.md); the label is already its name, so the tooltip only shows.
        return iconOnly ? <Tooltip key={option.value} side="bottom" describes={false} trigger={button}>{option.label}</Tooltip> : button;
      })}
      {name ? <input ref={hidden} type="hidden" name={name} form={form} disabled={disabled} value={value ?? ""} /> : null}
    </div>
  );
});

