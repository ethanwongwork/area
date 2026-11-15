import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { InputHTMLAttributes, FormEvent, ReactNode } from "react";
import { sliderVariants } from "../variants.ts";
/* --- Slider --------------------------------------------------------------- */

/*
 * The native range input carries the behaviour; the rail, fill and thumb are drawn beside it (slider.css). The drawing
 * reads one ratio the component computes from min/max/value (`--_slider-ratio`, with `--_pct` beside it). Controlled or
 * not, it is derived from the same numbers the input already carries, so the paint cannot disagree with the value -- and
 * because it is a ratio rather than a length it survives a density change without recomputing. The CSS eases it, except
 * while the pointer drags (`data-dragging`), when the drawing follows the pointer exactly.
 */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** The height, knob and type size; `md` by default. */
  size?: VariantProps<typeof MANIFESTS.slider>["size"];
  /**
   * The track's treatment, by thickness. `rail` (default): a thin rail and a round knob. `track`: a pill as tall as the
   * knob, the fill running under it. `bar`: the track is the control's full height and corner, its fill ending in a
   * grip; with `labelPosition="inside"` it carries its label and value inside it. `field`, the bar with its label
   * inside, is deprecated: use `labelPosition="inside"`.
   */
  variant?: VariantProps<typeof MANIFESTS.slider>["variant"] | "rail" | /** @deprecated Use `labelPosition="inside"`. */ "field";
  /** Visible label for the range. */
  label?: ReactNode;
  /**
   * Where the label and readout sit. `inline` (default): either side of the track. `top`: above opposite ends of it.
   * `inside`: inside a bar, the label at its start and the value at its end, the fill a neutral plate behind them with a
   * white pill in its end, dragged from any point; it shows the value unless `readout` is false. Inside makes the slider a
   * bar, horizontal, without end labels.
   */
  labelPosition?: VariantProps<typeof MANIFESTS.slider>["labelPosition"] | "inline";
  /** Changes the visual axis while retaining native range keyboard semantics. */
  orientation?: VariantProps<typeof MANIFESTS.slider>["orientation"] | "horizontal";
  /** Draws a marker at each interior step of a discrete track. */
  stepMarks?: boolean;
  /** Names the track's start under it, such as "Low"; decorative, the value is announced. Horizontal only. */
  startLabel?: ReactNode;
  /** Names the track's end under it, such as "High"; decorative, the value is announced. Horizontal only. */
  endLabel?: ReactNode;
  /**
   * How far a media source has loaded, in the slider's own units (between `min` and `max`): painted as a second,
   * lighter stretch after the fill. Decorative; it is not announced.
   */
  buffered?: number;
  /**
   * The value the fill grows from, for a range with a neutral middle (a temperature from Cool through Neutral to Warm):
   * the fill runs between it and the value, either side of it, so at the origin the track is empty. Defaults to `min`.
   * The buffered stretch is not drawn with an origin.
   */
  origin?: number;
  /**
   * A CSS image painted along the track, for a range whose values are colors, such as a temperature from cool to warm,
   * a color's shades or a hue: the fill shows the colors at full strength up to the value and the rest faintly. Write it
   * start to end, edge to edge (`linear-gradient(to right in oklab, …)`); it is drawn as given in either reading
   * direction. Horizontal only; none by default.
   */
  gradient?: string;
  /**
   * Rendered after the track. `true` shows the normalized numeric value; a function can
   * format that live value. A React node remains supported for fully custom content.
   */
  readout?: boolean | ReactNode | ((value: number) => ReactNode);
  /** Called with the normalized native value and the input event, for every input event. */
  onValueChange?: (value: number, event: FormEvent<HTMLInputElement>) => void;
  /**
   * Called once a change is final: when the pointer lets go (with the value it landed on, if it changed), and on every
   * keyboard step. A change that is costly to apply, such as a setting that restyles the app, belongs here, so the
   * slider stays responsive while it drags.
   */
  onValueCommit?: (value: number) => void;
  /**
   * A stepped range glides: while the pointer drags, the track follows it continuously and the value lands on whole
   * steps (`onValueChange` fires when the step changes), and on release the fill settles onto the step. On by default
   * for a range of 60 steps or fewer; `false` keeps the native stepping. Keyboard steps are always whole.
   * @default true
   */
  glide?: boolean;
  /** The value can't be changed, and the slider is drawn dimmed; off by default. */
  disabled?: boolean;
}

function finiteNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/** Mirrors the native range defaults closely enough for correct server-rendered paint. */
function normalizeSliderValue(
  value: unknown,
  min: string | number,
  max: string | number,
  step: string | number | undefined,
) {
  const lower = finiteNumber(min, 0);
  const upper = Math.max(lower, finiteNumber(max, 100));
  const fallback = lower + (upper - lower) / 2;
  const requested = Math.min(upper, Math.max(lower, finiteNumber(value, fallback)));
  if (step === "any") return requested;

  const interval = finiteNumber(step, 1);
  if (interval <= 0) return requested;
  const stepped = lower + Math.round((requested - lower) / interval) * interval;
  // Floating-point multiplication can otherwise leak values such as 0.30000000000000004
  // into the readout and percentage custom property.
  const precision = Math.max(
    String(lower).split(".")[1]?.length ?? 0,
    String(interval).split(".")[1]?.length ?? 0,
  );
  return Math.min(upper, Math.max(lower, Number(stepped.toFixed(Math.min(precision, 12)))));
}

export const Slider = /* @__PURE__ */ forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    size,
    variant: variantProp = "rail",
    label,
    labelPosition: labelPositionProp = "inline",
    orientation = "horizontal",
    stepMarks,
    startLabel,
    endLabel,
    buffered,
    origin,
    gradient,
    readout,
    onValueChange,
    onValueCommit,
    glide,
    onInput,
    className,
    disabled,
    min = 0,
    max = 100,
    step,
    value,
    defaultValue,
    style,
    ...rest
  },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  // `field` was the bar with its label inside (owner 2026-10-26: "consolidate"); it stays one release as an alias.
  const inside = labelPositionProp === "inside" || variantProp === "field";
  const variant = inside ? "bar" : variantProp as Exclude<SliderProps["variant"], "field">;
  const labelPosition = inside ? "inside" : labelPositionProp;
  const initialValue = normalizeSliderValue(defaultValue, min, max, step);
  const [localValue, setLocalValue] = useState(initialValue);
  const current = value === undefined
    ? localValue
    : normalizeSliderValue(value, min, max, step);
  const lower = finiteNumber(min, 0);
  const upper = Math.max(lower, finiteNumber(max, 100));
  const bufferedRatio = buffered === undefined || upper <= lower
    ? undefined
    : Math.min(1, Math.max(0, (finiteNumber(buffered, lower) - lower) / (upper - lower)));
  // An origin inside the range, as a ratio: the CSS puts the fill between it and the value, either way, so it eases too.
  const originRatio = origin === undefined || upper <= lower ? undefined : Math.min(1, Math.max(0, (finiteNumber(origin, lower) - lower) / (upper - lower)));
  const interval = step === "any" ? 0 : finiteNumber(step, 1);
  // The glide: the pointer's exact place on the track while it drags (null otherwise).
  const glides = (glide ?? true) && interval > 0 && (upper - lower) / interval <= 60;
  const [dragged, setDragged] = useState<number | null>(null);
  const emitted = useRef<number | null>(null);
  // A pointer press (`data-pressed`: the knob lifts) becomes a drag once the pointer moves (`data-dragging`: the drawing
  // stops easing and follows it). A click on the track is a press without a drag, so the thumb eases to the click. On
  // release the value it landed on is committed, if it changed.
  const [pressed, setPressed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pressedAt = useRef({ x: 0, y: 0 });
  // Read by the input handler, which the native control fires right after pointerdown, before React re-renders.
  const pressing = useRef(false);
  const atPress = useRef(0);
  const latest = useRef(0);
  const commit = useRef(onValueCommit);
  commit.current = onValueCommit;
  useEffect(() => {
    if (!pressed) return;
    const move = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pressedAt.current.x, event.clientY - pressedAt.current.y) > 2) setDragging(true);
    };
    const end = () => {
      pressing.current = false;
      setPressed(false); setDragging(false); setDragged(null); emitted.current = null;
      if (latest.current !== atPress.current) commit.current?.(latest.current);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", end);
    addEventListener("pointercancel", end);
    return () => { removeEventListener("pointermove", move); removeEventListener("pointerup", end); removeEventListener("pointercancel", end); };
  }, [pressed]);
  const shown = dragged ?? current;
  latest.current = current;
  const painted = upper > lower ? ((shown - lower) / (upper - lower)) * 100 : 0;
  // One mark per value, the two ends included (a bar draws them all as dots; a rail's ticks leave the ends to the rail).
  const markSteps = stepMarks && interval > 0 ? Math.round((upper - lower) / interval) : 0;
  const markCount = markSteps >= 2 && markSteps <= 25 ? markSteps + 1 : 0;

  useEffect(() => {
    const form = input.current?.form;
    const reset = (event: Event) => queueMicrotask(() => {
      if (!event.defaultPrevented && value === undefined && input.current) {
        setLocalValue(input.current.valueAsNumber);
      }
    });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [value, rest.form]);

  useEffect(() => {
    if (value === undefined && input.current && input.current.valueAsNumber !== localValue) {
      setLocalValue(input.current.valueAsNumber);
    }
  }, [defaultValue, localValue, max, min, step, value]);

  // A slider with its label inside carries its value inside the bar too, so it shows one unless told not to.
  const shownReadout = readout === undefined && inside ? true : readout;
  const vertical = orientation === "vertical" && !inside;
  const renderedReadout = typeof shownReadout === "function"
    ? shownReadout(current)
    : shownReadout === true
      ? current
      : shownReadout;

  return (
    <label
      className={sliderVariants({
        size,
        variant,
        labelPosition,
        orientation: vertical ? "vertical" : "horizontal",
      }, className)}
      // `--_slider-ratio` places the thumb and ends the fill (at the thumb's centre, which sits inset by half the thumb).
      // While a glide drags, the drawing follows the pointer, not the step.
      style={{
        ["--_pct" as string]: `${painted}%`,
        ["--_slider-ratio" as string]: painted / 100,
        ...(bufferedRatio === undefined ? {} : { ["--_buffered" as string]: bufferedRatio }),
        ...(originRatio === undefined ? {} : { ["--_origin" as string]: originRatio }),
        ...(gradient ? { ["--_gradient" as string]: gradient } : {}),
        ...style,
      }}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(originRatio === undefined ? {} : { "data-origin": "" })}
      {...(gradient ? { "data-gradient": "" } : {})}
      {...(glides ? { "data-glide": "" } : {})}
      {...(pressed ? { "data-pressed": "" } : {})}
      {...(dragging ? { "data-dragging": "" } : {})}
    >
      {label ? <span className="area-slider__label">{label}</span> : null}
      <span className="area-slider__track">
      <input
        {...rest}
        // The visible readout ("60%", "1.25×") is what a screen reader should say too (audit C-10).
        aria-valuetext={rest["aria-valuetext"] ?? (typeof renderedReadout === "string" ? renderedReadout : undefined)}
        ref={input}
        type="range"
        className="area-slider__control"
        min={min}
        max={max}
        step={dragged !== null ? "any" : step}
        value={value === undefined && dragged === null ? undefined : shown}
        defaultValue={defaultValue}
        disabled={disabled}
        // Shift+arrow moves ten steps, as Carbon and MUI (audit C-31). The native control takes the
        // value and fires its own input event, so the change runs through onInput like any other.
        onKeyDown={event => {
          rest.onKeyDown?.(event);
          if (event.defaultPrevented || !event.shiftKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          const control = event.currentTarget;
          const rtl = getComputedStyle(control).direction === "rtl";
          const up = event.key === "ArrowUp" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
          const unit = interval > 0 ? interval : (upper - lower) / 100;
          const next = Math.min(upper, Math.max(lower, control.valueAsNumber + (up ? 1 : -1) * unit * 10));
          event.preventDefault();
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(control, String(next));
          control.dispatchEvent(new Event("input", { bubbles: true }));
        }}
        onPointerDown={event => {
          rest.onPointerDown?.(event);
          if (disabled || event.button !== 0) return;
          atPress.current = current;
          pressing.current = true;
          pressedAt.current = { x: event.clientX, y: event.clientY };
          setPressed(true);
          // A glide follows the pointer from the press: the native control drags continuously ("any") meanwhile.
          if (glides) { emitted.current = current; setDragged(current); }
        }}
        onInput={event => {
          onInput?.(event);
          const raw = event.currentTarget.valueAsNumber;
          if (glides && dragged !== null) {
            setDragged(raw);
            const nextValue = normalizeSliderValue(raw, min, max, step);
            if (nextValue === emitted.current) return;
            emitted.current = nextValue;
            latest.current = nextValue;
            if (value === undefined) setLocalValue(nextValue);
            onValueChange?.(nextValue, event);
            return;
          }
          latest.current = raw;
          if (value === undefined) setLocalValue(raw);
          onValueChange?.(raw, event);
          // A key step (or any change without a press) is final at once; a press commits when it lets go.
          if (!pressing.current) onValueCommit?.(raw);
        }}
      />
      <span className="area-slider__rail" aria-hidden="true">
        {bufferedRatio === undefined || originRatio !== undefined ? null : <span className="area-slider__buffer" />}
        <span className="area-slider__fill" />
      </span>
      {markCount > 0 ? <span className="area-slider__marks" aria-hidden="true">{Array.from({ length: markCount }, (_, index) => <i key={index} style={{ ["--_mark" as string]: `${(index / (markCount - 1)) * 100}%` }} />)}</span> : null}
      <span className="area-slider__thumb" aria-hidden="true" />
      </span>
      {shownReadout === false || shownReadout === undefined ? null : (
        <span className="area-slider__value" aria-hidden="true">{renderedReadout}</span>
      )}
      {!inside && (startLabel != null || endLabel != null) ? (
        <span className="area-slider__ends" aria-hidden="true">
          <span className="area-slider__end">{startLabel}</span>
          <span className="area-slider__end">{endLabel}</span>
        </span>
      ) : null}
    </label>
  );
});

