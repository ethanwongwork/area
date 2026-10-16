// ZoomControl: a canvas's zoom, shown as a percentage that opens a Menu to type a zoom, step in and out,
// fit, or jump to a preset (Figma's "48%" zoom and view options). docs/specs/zoom-control.md.
import { forwardRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cx } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Input } from "./Input.tsx";
import { Button, type ButtonProps } from "./Button.tsx";
import { Menu, MenuItem, MenuSeparator, Tooltip } from "./primitives.tsx";

export interface ZoomControlProps extends Omit<ButtonProps, "value" | "defaultValue" | "children" | "onChange"> {
  /** The zoom as a scale: 1 is 100% (controlled). */
  value?: number;
  defaultValue?: number;
  onValueChange?: (zoom: number) => void;
  /** The range, as scales. Figma's is 2% to 25,600%. */
  min?: number;
  max?: number;
  /** Zoom in and out multiply and divide by this. */
  step?: number;
  /** Scales offered as rows ("Zoom to 50%"); the current one is checked. */
  presets?: number[];
  /** Fit the content to the view. The row shows when this is given. */
  onZoomToFit?: () => void;
  /** Shortcut hints for the rows, as Menu's `shortcut`. */
  shortcuts?: { zoomIn?: ReactNode; zoomOut?: ReactNode; zoomToFit?: ReactNode; presets?: Record<number, ReactNode> };
  /** More rows after the zoom rows, such as view toggles (MenuItem with `checked`). */
  children?: ReactNode;
  /**
   * Zoom out and Zoom in buttons either side of the percentage, which still opens the menu (Chrome's
   * and ChatGPT Atlas's "− 100% +" zoom row). The percentage drops its chevron.
   */
  stepper?: boolean;
  /** The zooms the stepper's buttons and the Zoom in / out rows move between, as scales; without them they multiply and divide by `step`. */
  stops?: number[];
  /** Shown instead of the percentage, as "Fit" while the view fits its content; the buttons step from `value`. */
  valueLabel?: string;
  onOpenChange?: (open: boolean) => void;
}

const percent = (zoom: number) => `${Math.round(zoom * 100)}%`;

/** A percentage button that opens the zoom menu. */
export const ZoomControl = /* @__PURE__ */ forwardRef<HTMLButtonElement, ZoomControlProps>(function ZoomControl(
  { value, defaultValue = 1, onValueChange, min = 0.02, max = 256, step = 2, presets = [0.5, 1, 2], onZoomToFit, shortcuts,
    children, onOpenChange, stepper = false, stops, valueLabel, size = "sm", variant = "ghost", tone = "neutral", className, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const [own, setOwn] = useState(defaultValue);
  const zoom = value ?? own;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [invalid, setInvalid] = useState(false);

  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (value === undefined) setOwn(clamped);
    // From a label ("Fit") the same zoom is still a choice: it leaves the label.
    if (clamped !== zoom || valueLabel) onValueChange?.(clamped);
  };
  // In and out: the next stop past the zoom, else a multiple of `step`.
  const zoomIn = stops?.length ? stops.find(stop => stop > zoom + 1e-9) : zoom * step;
  const zoomOut = stops?.length ? [...stops].reverse().find(stop => stop < zoom - 1e-9) : zoom / step;
  const canIn = zoomIn !== undefined && zoom < max;
  const canOut = zoomOut !== undefined && zoom > min;
  const shown = valueLabel ?? percent(zoom);
  const openChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    if (next) { setText(percent(zoom)); setInvalid(false); }
  };
  // Typed zoom: "150", "150%" or "1.5x"; Enter applies it and closes, as Figma's field.
  const onFieldKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const match = /^\s*(\d+(?:\.\d+)?)\s*(%|x)?\s*$/i.exec(text);
      if (!match || Number(match[1]) <= 0) { setInvalid(true); return; }
      set(match[2]?.toLowerCase() === "x" ? Number(match[1]) : Number(match[1]) / 100);
      event.currentTarget.closest<HTMLElement>("[popover]")?.hidePopover?.();
      return;
    }
    // The field keeps its own keys (typing, editing, Home and End); ArrowDown moves on to the rows and
    // Escape closes the menu, as the menu handles them.
    if (event.key !== "ArrowDown" && event.key !== "Escape" && event.key !== "Tab") event.stopPropagation();
  };

  const menu = (
    <Menu className="area-zoom-control__menu" open={open} onOpenChange={openChange} align="end"
      trigger={<Button ref={ref} variant={variant} tone={tone} size={size} className={cx("area-zoom-control", stepper && "area-zoom-control--stepper", !stepper && className)}
        aria-label={ariaLabel ?? `Zoom ${shown}`} trailingIcon={stepper ? undefined : <Glyph name="chevron-down" />} {...rest}>
        <span className="area-zoom-control__value">{shown}</span>
      </Button>}>
      <div className="area-zoom-control__field">
        <Input size="sm" variant="soft" fullWidth aria-label="Zoom" value={text} invalid={invalid} inputMode="decimal"
          onChange={event => { setText(event.target.value); setInvalid(false); }} onKeyDown={onFieldKey}
          onFocus={event => { const field = event.currentTarget; requestAnimationFrame(() => field.select()); }} />
      </div>
      <MenuSeparator />
      <MenuItem shortcut={shortcuts?.zoomIn} disabled={!canIn} onClick={() => { if (zoomIn !== undefined) set(zoomIn); }}>Zoom in</MenuItem>
      <MenuItem shortcut={shortcuts?.zoomOut} disabled={!canOut} onClick={() => { if (zoomOut !== undefined) set(zoomOut); }}>Zoom out</MenuItem>
      {onZoomToFit ? <MenuItem shortcut={shortcuts?.zoomToFit} onClick={onZoomToFit}>Zoom to fit</MenuItem> : null}
      {presets.map(preset => (
        <MenuItem key={preset} radio checked={!valueLabel && Math.abs(zoom - preset) < 1e-9} shortcut={shortcuts?.presets?.[preset]}
          onClick={() => set(preset)}>{`Zoom to ${percent(preset)}`}</MenuItem>
      ))}
      {children ? <><MenuSeparator />{children}</> : null}
    </Menu>
  );
  if (!stepper) return menu;
  // Icon-only, so each names itself in an Area Tooltip (docs/PRODUCT_UI.md, rule 4).
  const stepButton = (label: string, glyph: "add" | "subtract", next: number | undefined, enabled: boolean) => (
    <Tooltip side="bottom" describes={false} trigger={
      <Button variant={variant} tone={tone} size={size} iconOnly className="area-zoom-control__step" icon={<Glyph name={glyph} />}
        aria-label={label} disabled={!enabled} onClick={() => { if (next !== undefined) set(next); }} />
    }>{label}</Tooltip>
  );
  return (
    <div role="group" aria-label={typeof ariaLabel === "string" ? ariaLabel : "Zoom"} className={cx("area-zoom-control__stepper", className)}>
      {stepButton("Zoom out", "subtract", zoomOut, canOut)}
      {menu}
      {stepButton("Zoom in", "add", zoomIn, canIn)}
    </div>
  );
});
