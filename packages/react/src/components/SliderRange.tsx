import { forwardRef, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, PointerEvent } from "react";
import { sliderRangeVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Input } from "./Input.tsx";
import { Slider } from "./primitives.tsx";

export type SliderRangeValue = [number, number];

export interface SliderRangeProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: SliderRangeValue;
  defaultValue?: SliderRangeValue;
  /** Called with the new pair (start never above end). */
  onValueChange?: (value: SliderRangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: VariantProps<typeof MANIFESTS.sliderRange>["size"];
  /** The rail's treatment, as Slider's: `rail` (default), `track` (a pill under round knobs) or `bar` (full height, grips). */
  variant?: "rail" | "track" | "bar";
  /** Number fields either side of the rail (Figma's and Notion's range filters). On by default. */
  inputs?: boolean;
  /** Names the two ends: the sliders take these, the number fields add "value" (audit C-12). */
  minLabel?: string;
  maxLabel?: string;
  /** Both range inputs submit under this name, start then end. */
  name?: string;
  form?: string;
  disabled?: boolean;
}

type Handle = "start" | "end";
const clamp = (value: number, lower: number, upper: number) => Math.min(upper, Math.max(lower, value));

/**
 * Picks a range with two native range inputs, so keyboard and form behaviour stay native. The
 * shared rail resolves pointer input so the nearer handle moves; otherwise the upper input would
 * capture every drag. Promoted from the docs composition (audit C-12, owner 2026-09-30).
 */
export const SliderRange = forwardRef<HTMLDivElement, SliderRangeProps>(function SliderRange(
  { value, defaultValue, onValueChange, min = 0, max = 100, step = 1, size, variant = "rail", inputs = true,
    minLabel = "Minimum", maxLabel = "Maximum", name, form, disabled, className, style, ...rest }, ref,
) {
  const [own, setOwn] = useState<SliderRangeValue>(defaultValue ?? [min, max]);
  const range = value ?? own;
  const track = useRef<HTMLDivElement>(null);
  const startInput = useRef<HTMLInputElement>(null);
  const endInput = useRef<HTMLInputElement>(null);
  const active = useRef<Handle | null>(null);
  // The handle the pointer holds (`data-pressed`: its knob lifts) and whether it has moved (`data-dragging`: the drawing
  // follows the pointer instead of easing). A click on the rail eases the nearer handle to it.
  const [pressed, setPressed] = useState<Handle | null>(null);
  const [dragging, setDragging] = useState(false);
  const pressedAt = useRef(0);

  const commit = (next: SliderRangeValue) => {
    if (next[0] === range[0] && next[1] === range[1]) return;
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };
  const setStart = (next: number) => {
    const start = Number.isFinite(next) ? clamp(next, min, max) : min;
    commit([start, Math.max(start, range[1])]);
  };
  const setEnd = (next: number) => {
    const end = Number.isFinite(next) ? clamp(next, min, max) : max;
    commit([Math.min(range[0], end), end]);
  };

  // Pointer position to value, reading from the right in right-to-left text (audit C-11).
  const valueAt = (clientX: number) => {
    const node = track.current;
    const bounds = node?.getBoundingClientRect();
    if (!node || !bounds?.width) return min;
    const rtl = getComputedStyle(node).direction === "rtl";
    const ratio = clamp((rtl ? bounds.right - clientX : clientX - bounds.left) / bounds.width, 0, 1);
    return clamp(Math.round((min + ratio * (max - min)) / step) * step, min, max);
  };
  const release = () => { active.current = null; setPressed(null); setDragging(false); };
  const move = (clientX: number, handle = active.current) => {
    if (!handle) return;
    if (!dragging && Math.abs(clientX - pressedAt.current) > 2) setDragging(true);
    if (handle === "start") setStart(valueAt(clientX));
    else setEnd(valueAt(clientX));
  };
  const begin = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const next = valueAt(event.clientX);
    const handle: Handle = Math.abs(next - range[0]) <= Math.abs(next - range[1]) ? "start" : "end";
    active.current = handle;
    pressedAt.current = event.clientX;
    setPressed(handle);
    event.currentTarget.setPointerCapture(event.pointerId);
    (handle === "start" ? startInput : endInput).current?.focus({ preventScroll: true });
    move(event.clientX, handle);
  };

  const ratio = (n: number) => max === min ? 0 : (n - min) / (max - min);
  const field = (label: string, current: number, lower: number, upper: number, set: (n: number) => void) => inputs
    ? <Input className="area-slider-range__input" size={size} aria-label={`${label} value`} type="number" min={lower} max={upper} step={step}
      value={current} disabled={disabled} onChange={event => set(event.currentTarget.valueAsNumber)} />
    : null;

  return <div ref={ref} {...rest} className={sliderRangeVariants({ size, variant: variant === "rail" ? undefined : variant }, className)}
    data-overlap={range[0] === range[1] ? "" : undefined} data-disabled={disabled ? "" : undefined}
    data-pressed={pressed ?? undefined} data-dragging={dragging ? "" : undefined}
    // The two ends as ratios, registered in slider.css so the fill eases between them as the thumbs do.
    style={{ ...style, "--_slider-range-start": ratio(range[0]), "--_slider-range-end": ratio(range[1]) } as CSSProperties}>
    {field(minLabel, range[0], min, range[1], setStart)}
    <div ref={track} className="area-slider-range__track"
      onPointerDown={begin}
      // Keep focus on the handle the pointer chose: the rail's own mousedown would blur it.
      onMouseDown={event => event.preventDefault()}
      onPointerMove={event => move(event.clientX)}
      onPointerUp={release}
      onPointerCancel={release}>
      <Slider ref={startInput} size={size} variant={variant} aria-label={minLabel} min={min} max={max} step={step} value={range[0]} name={name} form={form}
        disabled={disabled} onValueChange={setStart} className="area-slider-range__start" />
      <Slider ref={endInput} size={size} variant={variant} aria-label={maxLabel} min={min} max={max} step={step} value={range[1]} name={name} form={form}
        disabled={disabled} onValueChange={setEnd} className="area-slider-range__end" />
    </div>
    {field(maxLabel, range[1], range[0], max, setEnd)}
  </div>;
});
