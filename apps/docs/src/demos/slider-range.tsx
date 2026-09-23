import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Input, Slider } from "@area/react";

type RangeHandle = "start" | "end";

const clamp = (value: number, lower: number, upper: number) => Math.min(upper, Math.max(lower, value));

/**
 * A paired-range composition keeps two native range inputs for keyboard and form semantics.
 * Pointer input is resolved by this shared rail so the nearer handle moves; otherwise the
 * upper, absolutely-positioned native input would capture every drag.
 */
export const SliderRangeComposition = () => {
  const [range, setRange] = useState<[number, number]>([42, 75]);
  const track = useRef<HTMLDivElement>(null);
  const startInput = useRef<HTMLInputElement>(null);
  const endInput = useRef<HTMLInputElement>(null);
  const activeHandle = useRef<RangeHandle | null>(null);

  const setStart = (next: number) => setRange(([, end]) => {
    const start = Number.isFinite(next) ? clamp(next, 0, 100) : 0;
    return [start, Math.max(start, end)];
  });
  const setEnd = (next: number) => setRange(([start]) => {
    const end = Number.isFinite(next) ? clamp(next, 0, 100) : 100;
    return [Math.min(start, end), end];
  });

  const valueAt = (clientX: number) => {
    const bounds = track.current?.getBoundingClientRect();
    if (!bounds?.width) return 0;
    return Math.round(clamp((clientX - bounds.left) / bounds.width, 0, 1) * 100);
  };

  const updateFromPointer = (clientX: number, handle = activeHandle.current) => {
    if (!handle) return;
    const next = valueAt(clientX);
    if (handle === "start") setStart(next);
    else setEnd(next);
  };

  const beginPointer = (event: PointerEvent<HTMLDivElement>) => {
    const next = valueAt(event.clientX);
    const handle: RangeHandle = Math.abs(next - range[0]) <= Math.abs(next - range[1]) ? "start" : "end";
    activeHandle.current = handle;
    event.currentTarget.setPointerCapture(event.pointerId);
    (handle === "start" ? startInput : endInput).current?.focus({ preventScroll: true });
    updateFromPointer(event.clientX, handle);
  };

  return (
    <div className="area-slider-range" data-overlap={range[0] === range[1] ? "" : undefined}>
      <Input
        className="area-slider-range__input"
        aria-label="Minimum"
        type="number"
        min={0}
        max={range[1]}
        value={range[0]}
        onChange={event => setStart(event.currentTarget.valueAsNumber)}
      />
      <div
        ref={track}
        className="area-slider-range__track"
        style={{ ["--_range-start" as string]: `${range[0]}%`, ["--_range-end" as string]: `${range[1]}%` }}
        onPointerDown={beginPointer}
        onPointerMove={event => updateFromPointer(event.clientX)}
        onPointerUp={() => { activeHandle.current = null; }}
        onPointerCancel={() => { activeHandle.current = null; }}
      >
        <Slider ref={startInput} aria-label="Minimum" value={range[0]} onValueChange={setStart} className="area-slider-range__start" />
        <Slider ref={endInput} aria-label="Maximum" value={range[1]} onValueChange={setEnd} className="area-slider-range__end" />
      </div>
      <Input
        className="area-slider-range__input"
        aria-label="Maximum"
        type="number"
        min={range[0]}
        max={100}
        value={range[1]}
        onChange={event => setEnd(event.currentTarget.valueAsNumber)}
      />
    </div>
  );
};
