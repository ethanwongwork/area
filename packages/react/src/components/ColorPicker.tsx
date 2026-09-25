import { forwardRef, useEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, PointerEvent } from "react";
import { ColorField, normalizeHexColor } from "./ColorField.tsx";
import { ColorSwatchPicker, type ColorSwatchOption } from "./ColorSwatchPicker.tsx";
import { Button } from "./Button.tsx";
import { colorPickerVariants } from "../variants.ts";

/** HSV conversion keeps hue/saturation state separate from the serialized RGB value. */
export function hexToHsv(hex: string): [number, number, number, number] {
  const color = normalizeHexColor(hex) ?? "#000000";
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  const h = !delta ? 0 : max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return [h * 60, max ? delta / max * 100 : 0, max * 100, parseInt(color.slice(7) || "FF", 16) / 255 * 100];
}
export function hsvToHex(h: number, s: number, v: number, a = 100): string {
  const c = v / 100 * s / 100, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v / 100 - c;
  const channels = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const byte = (n: number) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${channels.map(n => byte(n + m)).join("")}${a < 100 ? byte(a / 100) : ""}`;
}
export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  swatches?: readonly ColorSwatchOption[];
  onAddSwatch?: (value: string) => void;
}
/** Solid-color editor with native keyboard sliders and a draggable saturation/value area. */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  { label = "Color", value, defaultValue = "#8D4DF3", onValueChange, name, disabled, swatches = [], onAddSwatch, className, ...rest }, ref,
) {
  const initial = normalizeHexColor(defaultValue) ?? "#8D4DF3";
  const [local, setLocal] = useState(initial);
  const color = value === undefined ? local : normalizeHexColor(value) ?? initial;
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const lastEmitted = useRef(color);
  const root = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (color !== lastEmitted.current) setHsv(hexToHsv(color));
    lastEmitted.current = color;
  }, [color, hsv]);
  useEffect(() => {
    if (value !== undefined) return;
    const form = root.current?.closest("form");
    const reset = () => { setLocal(initial); setHsv(hexToHsv(initial)); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [value, initial]);
  function emit(next: string, channels = hexToHsv(next)) {
    if (disabled) return;
    setHsv(channels);
    if (value === undefined) setLocal(next);
    lastEmitted.current = next;
    if (next !== color) onValueChange?.(next);
  }
  function channel(index: number, number: number) {
    const next = [...hsv] as typeof hsv;
    next[index] = number;
    emit(hsvToHex(...next), next);
  }
  function point(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    const box = event.currentTarget.getBoundingClientRect();
    const clamp = (n: number) => Math.max(0, Math.min(100, n));
    const next: typeof hsv = [hsv[0], clamp((event.clientX - box.left) / box.width * 100), clamp(100 - (event.clientY - box.top) / box.height * 100), hsv[3]];
    emit(hsvToHex(...next), next);
  }
  return <div {...rest} ref={node => { root.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
    role="group" aria-label={label} aria-disabled={disabled || undefined} className={colorPickerVariants({}, className)}>
    <div className="area-color-picker__area" style={{ "--_hue": hsv[0], "--_saturation": `${hsv[1]}%`, "--_brightness": `${100 - hsv[2]}%` } as CSSProperties}
      onPointerDown={event => { if (disabled || event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.querySelector("input")?.focus(); point(event); }}
      onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) point(event); }}>
      <span className="area-color-picker__thumb" aria-hidden="true" />
      <input className="area-color-picker__channel" type="range" aria-label={`${label} saturation`} min={0} max={100} value={hsv[1]} disabled={disabled} onChange={e => channel(1, +e.target.value)} />
      <input className="area-color-picker__channel" type="range" aria-label={`${label} brightness`} min={0} max={100} value={hsv[2]} disabled={disabled} onChange={e => channel(2, +e.target.value)} />
    </div>
    <input className="area-color-picker__slider area-color-picker__hue" style={{ "--_swatch-color": `hsl(${hsv[0]} 100% 50%)` } as CSSProperties} type="range" aria-label={`${label} hue`} min={0} max={360} value={hsv[0]} disabled={disabled} onChange={e => channel(0, +e.target.value)} />
    <input className="area-color-picker__slider area-color-picker__alpha" style={{ "--_swatch-color": hsvToHex(hsv[0], hsv[1], hsv[2]) } as CSSProperties}
      type="range" aria-label={`${label} opacity`} min={0} max={100} value={hsv[3]} disabled={disabled} onChange={e => channel(3, +e.target.value)} />
    <ColorField alpha fullWidth aria-label={`${label} hex`} opacityLabel={`${label} opacity percent`} name={name} value={color} disabled={disabled} onValueChange={next => { if (next) emit(next); }} required />
    {swatches.length > 0 && <><div className="area-color-picker__heading"><span>Saved colors</span>{onAddSwatch && <Button variant="ghost" size="sm" disabled={disabled} onClick={() => onAddSwatch(color)}>Add</Button>}</div>
      <ColorSwatchPicker label={`${label} saved colors`} layout="row" options={swatches} value={color} disabled={disabled} onValueChange={next => emit(next)} /></>}
  </div>;
});
