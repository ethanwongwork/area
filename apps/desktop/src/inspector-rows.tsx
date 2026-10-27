/**
 * The Inspector's setting rows, one control each, chosen per setting (owner, 2026-10-24: "make your best judgement on what
 * would be the best control for this axis, a dropdown, a toggle switch, a segmented control, a slider"):
 *   a bar (Slider labelPosition="inside") for an ordered range with enough steps to drag: lightness, contrast, shadows, corners;
 *   a Segmented for two to five short names: mode, density, focus ring;
 *   a dropdown for a longer or wordier list, each option drawing what it sets: accent colours, easing, pills;
 *   a choice with Custom, the bar under it, where a setting has an Auto beside its range.
 * Two rows stand for several settings, so a person meets one idea once: Greys (a Cool to Warm temperature, or a tint colour
 * by name and how much of it, over Neutral, Tint hue and Tint strength) and Accent (eleven named colours, or any hue by
 * name). A row that changes nothing under the other settings is dimmed and says why (controls.ts `inactive`).
 * Pure over its values, so the Inspector (canvas-settings.tsx) and the controls review page draw the same rows.
 */
import { cloneElement, createContext, useContext, useEffect, useRef, useState, type PointerEvent, type ReactElement, type ReactNode } from "react";
import TOKENS from "@area/tokens/tokens.json";
import { CustomSelect, Field, Input, Segmented, Slider, Toggletip, type FieldProps, type SliderProps } from "@area/react";
import { GALLERY_CONTROLS, greysTinted, type GalleryControl } from "./gallery/controls.ts";
import { colourMark, optionMark } from "./option-marks.tsx";
import type { CanvasAxes } from "./studio.tsx";

export type Values = Readonly<Record<string, string>>;
export interface RowContext {
  values: Values;
  mode: "light" | "dark";
  /** Set one or several settings at once. */
  set: (changes: Record<string, string>) => void;
  /** The option a list is on, painted until the list closes (`null` ends it). */
  preview?: (axis: string, value: string | null) => void;
  /** How a list lays its options out, and a figure per option in the grid (canvas-settings.tsx). */
  layout?: (axis: string, count: number) => "grid" | "list";
  figure?: (axis: string, value: string) => ReactNode;
  /** The Canvas's brand declarations while Brand is on (src/brand.ts): Accent then sets only the brand's Shade and Saturation. */
  brand?: Readonly<Record<string, string>>;
  /** The controls' size: the Inspector's `sm` by default, larger where a row stands alone (Setup's dock). */
  size?: "sm" | "md" | "lg";
}

/*
 * A setting's bar (owner, 2026-10-25: "they arent very smooth to move"). A setting restyles the whole app, a few hundred
 * milliseconds a time (traced in headless Edge: three to six style recalculations of 3,000 to 5,000 elements), so a drag
 * that set every step it crossed froze the bar between steps. Now the bar and its readout follow every step, and the
 * setting lands when the pointer lets go (Slider `onValueCommit`), when it holds still for REST ms mid-drag, and at once
 * from the keyboard. Stillness is the pointer's, not the value's: at an ordinary drag a 10-step bar crosses a step about
 * every 130ms, so a pause between steps (tried at 120ms) landed nearly every one. A release or a key lands EASE ms later,
 * once the fill has eased onto its step, which the restyle would otherwise freeze mid-way. The Canvas and the chrome take
 * the value it lands on together, in one restyle (studio.tsx).
 */
const REST = 300; /* pick: a held pointer, well past the gap between two steps of a drag */
const EASE = 150; /* the fill's ease onto a step: `fast` at the default Speed, 140ms */

/*
 * A bar's row (owner, 2026-10-27: "Keep the Input layout: label in the left column, bar, then the value field"; picked
 * over the name and value inside the bar, and the value as plain text, in docs/research/slider-bar-layouts-2026-10-27.png):
 * the name in the row's label column, as every other row's, then the bar, then its value in a field that takes a typed
 * value. The bar is the label-inside look without its text, the neutral plate and grip line. Field hands its id, label
 * and state to the bar's input, the first element it holds, so the label names the bar and the field names itself.
 *
 * Every bar is one row (owner, 2026-10-27: "i dont like the slider below the label for just some of them, id prefer it
 * to be more consistent"), and every value is a field, 4 or 5 characters wide (owner: "smaller in width"). A value in
 * words ("Cool 25%", "57% deeper") shows its number in the field (`short`), signed from its middle, and the bar's own
 * colours say which way is which (`gradient`, owner: "make the slider background itself be colored like a gradient");
 * the words stay the bar's announced value. A short discrete range draws its steps as dots (owner: "i liked the little
 * notches or indicators"), 3 to 12 steps; a longer one reads as continuous.
 */
/** A text's width in `ch` of the app's sans, near enough to size a field: tabular digits are 1, narrow letters less. */
const chOf = (text: string) => [...text].reduce((sum, char) => sum + (/[ilIjtf.,·°' 1]/.test(char) ? 0.6 : /[mwMW%]/.test(char) ? 1.2 : 1), 0);
/** The field's width for a bar's values: 4 characters, or 5 where one needs it ("210ms"). */
const fieldCh = (texts: string[]) => Math.max(...texts.map(chOf)) <= 4.4 ? 4 : 5;
const stepsOf = (min: number, max: number) => Array.from({ length: Math.max(0, max - min) + 1 }, (_, at) => min + at);
/** A gradient through colours spaced evenly from start to end. */
const through = (colours: string[]) => `linear-gradient(to right, ${colours.join(", ")})`;
/** Hues in OKLCH at the accent's own lightness and a calm chroma, every 30°. */
const HUE_GRADIENT = through(Array.from({ length: 13 }, (_, at) => `light-dark(oklch(0.72 0.13 ${at * 30}), oklch(0.6 0.12 ${at * 30}))`));
/** Cool blue through the trough's own grey to warm yellow, light enough to sit behind the bar's grip. */
const TEMPERATURE_GRADIENT = through(["light-dark(oklch(0.86 0.07 250), oklch(0.36 0.07 250))", "var(--area-bg-component)", "light-dark(oklch(0.9 0.08 90), oklch(0.38 0.06 90))"]);
const hueShort = (value: string) => `${value}°`;

type SettingBarProps = Omit<SliderProps, "value" | "onValueChange" | "onValueCommit" | "readout"> & {
  value: number; onSet: (value: number) => void;
  /** The value in words: what the bar announces. */
  readout: (value: number) => ReactNode;
  /** The value as the field shows and takes it, when the words are longer than the field ("Cool 25%" → "-25"). */
  short?: (value: number) => string;
  /** The setting's name in words, for the value field's accessible name where `label` draws a mark beside it. */
  name?: string;
};
function SettingBar({ value, onSet, label, readout, short, title, name, ...props }: SettingBarProps) {
  const [draft, setDraft] = useState<number | null>(null);
  const pending = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const apply = useRef(onSet);
  apply.current = onSet;
  useEffect(() => () => clearTimeout(timer.current), []);
  // The setting and the end of the draft in one render, so the bar never shows the old value between them.
  const land = (next: number) => { clearTimeout(timer.current); pending.current = null; apply.current(next); setDraft(null); };
  const wait = () => { clearTimeout(timer.current); timer.current = setTimeout(() => { if (pending.current !== null) land(pending.current); }, REST); };
  const bar = {
    ...props, value: draft ?? value,
    onValueCommit: (next: number) => { pending.current = next; clearTimeout(timer.current); timer.current = setTimeout(() => land(next), EASE); },
    onValueChange: (next: number) => { setDraft(next); pending.current = next; wait(); },
    onPointerMove: (event: PointerEvent<HTMLInputElement>) => { if (pending.current !== null && event.buttons) wait(); },
  };
  const min = Number(props.min ?? 0), max = Number(props.max ?? 100);
  const text = short ?? ((at: number) => String(readout(at)));
  const steps = stepsOf(min, max).length;
  return (
    <RowField label={label} name={name} orientation="horizontal" title={title}>
      <BarRow bar={{ ...bar, stepMarks: props.stepMarks ?? (!props.gradient && steps >= 3 && steps <= 12) }} shown={draft ?? value}
        readout={readout} text={text} ch={fieldCh(stepsOf(min, max).map(text))} name={name ?? (typeof label === "string" ? label : undefined)} onSet={land} />
    </RowField>
  );
}

function BarRow({ bar, shown, readout, text, ch, name, onSet, ...field }: {
  bar: Omit<SliderProps, "readout">; shown: number; readout: (value: number) => ReactNode; text: (value: number) => string; ch: number; name?: string; onSet: (value: number) => void;
} & Pick<SliderProps, "id" | "aria-labelledby" | "aria-describedby" | "disabled">) {
  const disabled = field.disabled || bar.disabled;
  return (
    <div className="studio-bar" style={{ ["--_value-ch" as string]: ch }}>
      <Slider labelPosition="inside" readout={false} {...bar} {...field} disabled={disabled} aria-valuetext={String(readout(shown))} />
      <ValueField shown={shown} min={Number(bar.min ?? 0)} max={Number(bar.max ?? 100)} readout={text} name={name} size={bar.size} disabled={disabled} onSet={onSet} />
    </div>
  );
}

/**
 * A bar's value as a field: it shows the readout, and a typed value lands on the step it names ("Flat", "Vivid") or, for a
 * number, the step whose readout's number is nearest ("12" on a percent bar, "cool 40"). Up and Down step; Escape keeps
 * the value. Every bar's readout is words over steps, so this is a text field, not NumberField.
 */
function ValueField({ shown, min, max, readout, name, size = "sm", disabled, onSet }: {
  shown: number; min: number; max: number; readout: (value: number) => ReactNode; name?: string; size?: SliderProps["size"]; disabled?: boolean; onSet: (value: number) => void;
}) {
  const [typed, setTyped] = useState<string | null>(null);
  const text = (at: number) => String(readout(at));
  const parse = (entry: string) => {
    const want = entry.trim().toLowerCase();
    if (!want) return null;
    const steps = Array.from({ length: max - min + 1 }, (_, index) => min + index);
    const exact = steps.find(at => text(at).toLowerCase() === want);
    if (exact !== undefined) return exact;
    const number = (value: string) => { const match = /-?\d+(\.\d+)?/.exec(value); return match ? Number(match[0]) : null; };
    const target = number(want);
    if (target === null) return steps.find(at => text(at).toLowerCase().startsWith(want)) ?? null;
    // Words typed with the number ("cool 40") keep to the steps that carry them.
    const word = want.replace(/[-\d.%°·\s]+/g, " ").trim();
    const pool = steps.filter(at => number(text(at)) !== null && (!word || text(at).toLowerCase().includes(word)));
    return pool.length ? pool.reduce((best, at) => Math.abs(number(text(at))! - target) < Math.abs(number(text(best))! - target) ? at : best) : null;
  };
  const commit = () => { if (typed === null) return; const at = parse(typed); setTyped(null); if (at !== null && at !== shown) onSet(at); };
  return (
    <Input className={`studio-bar__field studio-bar__field--${size}`} size={size} variant="soft" aria-label={name ? `${name} value` : "Value"} disabled={disabled}
      value={typed ?? text(shown)} onChange={event => setTyped(event.currentTarget.value)} onBlur={commit}
      onFocus={event => event.currentTarget.select()}
      onKeyDown={event => {
        if (event.key === "Enter") { event.preventDefault(); commit(); }
        else if (event.key === "Escape" && typed !== null) { event.preventDefault(); setTyped(null); }
        else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault(); setTyped(null);
          const next = Math.min(max, Math.max(min, shown + (event.key === "ArrowUp" ? 1 : -1) * (event.shiftKey ? 10 : 1)));
          if (next !== shown) onSet(next);
        }
      }} />
  );
}

const controlOf = (axis: string) => GALLERY_CONTROLS.find(entry => entry.axis === axis)!;
const say = (control: GalleryControl, value: string) => control.items.find(item => item.value === value)?.label ?? value;
const CUSTOM = "custom";

/** A hue's everyday name (OKLCH hues: red about 30°, yellow 95°, green 145°, blue 255°). */
export function hueName(hue: number): string {
  const names: Array<[number, string]> = [[12, "Pink"], [40, "Red"], [65, "Orange"], [85, "Amber"], [110, "Yellow"], [135, "Lime"], [165, "Green"],
    [195, "Teal"], [215, "Cyan"], [245, "Sky"], [272, "Blue"], [292, "Indigo"], [315, "Purple"], [340, "Magenta"], [360, "Pink"]];
  return names.find(([bound]) => hue < bound)?.[1] ?? "Pink";
}
const hueLabel = (value: string) => `${hueName(Number(value))} · ${value}°`;

/** The settings a combined row stands for; the Inspector draws the row once, at the first of them. A row asked for one of
 * Accent's alone (Setup's exact value) is that setting's own. */
export const ROW_OF: Readonly<Record<string, string>> = { neutral: "greys", "tint-hue": "greys", "tint-light": "greys", "tint-dark": "greys",
  accent: "accent", "solid-light": "accent", "solid-dark": "accent", "accent-strength": "accent", "label-tint": "accent" };

/** One row: the setting's own control, or the combined row it belongs to. */
export function SettingRow({ axis, context }: { axis: string; context: RowContext }) {
  if (ROW_OF[axis] === "greys") return <GreysRow context={context} />;
  if (axis === "accent") return <AccentRow context={context} />;
  const control = controlOf(axis);
  return <Dim reason={control.inactive?.(context.values, context.mode) ?? null}><Row control={control} context={context} /></Dim>;
}

/*
 * A row that has no effect under the other settings (owner, 2026-10-24: "some of the axises i cant tell what im even
 * updating"): its name and control dimmed, still usable, and the reason behind an info button beside the name (owner,
 * 2026-10-27: "hide the captions behind a small info button with tooltip"; was a caption under the row). The button is
 * Field's `labelAction`, a Toggletip, outside the dimming, so the note reads at full strength.
 */
const Inactive = createContext<string | null>(null);
function Dim({ reason, children }: { reason: string | null; children: ReactNode }) {
  return reason ? <Inactive.Provider value={reason}>{children}</Inactive.Provider> : <>{children}</>;
}

/** A row's Field: an inactive row's name and control dimmed, its reason in a Toggletip after the name. */
function RowField({ label, name, children, ...props }: FieldProps & { name?: string }) {
  const reason = useContext(Inactive);
  if (!reason) return <Field label={label} {...props}>{children}</Field>;
  const words = name ?? (typeof label === "string" ? label : undefined);
  return (
    <Field {...props} label={<span className="studio-row__dim">{label}</span>}
      labelAction={<Toggletip content={reason} label={words ? `Why ${words} has no effect` : undefined} />}>
      <Dimmed>{children as ReactElement}</Dimmed>
    </Field>
  );
}
/** The control, dimmed: Field's id, label and state go on to the control inside. */
function Dimmed({ children, ...field }: { children: ReactElement } & Record<string, unknown>) {
  return <div className="studio-row__dim">{cloneElement(children, field)}</div>;
}

function Row({ control, context }: { control: GalleryControl; context: RowContext }) {
  const { values, set } = context;
  const axis = control.axis, value = values[axis] ?? control.defaultValue;
  const put = (next: string) => set({ [axis]: next });
  if (control.kind === "bar") return <Bar control={control} value={value} put={put} context={context} />;
  if (control.kind === "segmented") {
    // Beside the label while every name fits beside it at its natural width, under it when not (Field `auto`), so none
    // truncates and a short set stays one row (owner 2026-10-27; was: two names beside, three or more under).
    return (
      <RowField label={control.label} orientation="auto" title={control.hint}>
        <Segmented size={context.size ?? "sm"} fullWidth items={[...control.items]} value={value} onValueChange={put} />
      </RowField>
    );
  }
  const layout = context.layout?.(axis, control.items.length) ?? "list";
  const items = control.items.map(item => ({ value: item.value, label: item.label, icon: optionMark(axis as never, item.value, values as CanvasAxes) ?? undefined,
    preview: layout === "grid" ? context.figure?.(axis, item.value) : undefined }));
  return (
    <RowField label={control.label} orientation="horizontal" title={control.hint}>
      {control.kind === "chips" ? (
        <CustomSelect multiple size={context.size ?? "sm"} variant="soft" fullWidth layout={layout} aria-label={control.label} placeholder="None" items={items}
          values={value.split(" ").filter(Boolean)} onValuesChange={next => put(next.join(" "))}
          onHighlightChange={part => {
            if (part === null) return context.preview?.(axis, null);
            const on = value.split(" ").filter(Boolean);
            const toggled = on.includes(part) ? on.filter(name => name !== part) : [...on, part];
            context.preview?.(axis, control.items.map(item => item.value).filter(name => toggled.includes(name)).join(" "));
          }} />
      ) : (
        <CustomSelect size={context.size ?? "sm"} variant="soft" fullWidth layout={layout} aria-label={control.label} items={items} value={value}
          onValueChange={put} onHighlightChange={next => context.preview?.(axis, next)} />
      )}
    </RowField>
  );
}

/** An ordered range as a bar; with choices off the range (Auto, System), those and Custom first, the bar under them. */
function Bar({ control, value, put, context, label }: { control: GalleryControl; value: string; put: (value: string) => void; context: RowContext; label?: ReactNode }) {
  const scale = control.scale!, named = control.named ?? [];
  const onScale = scale.includes(value);
  const index = Math.max(0, scale.indexOf(onScale ? value : control.custom ?? scale[0]!));
  // Button shade shows the button it sets, so the bar reads as the colour it picks.
  const swatch = /^solid-/.test(control.axis) ? optionMark(control.axis as never, scale[index]!, context.values as CanvasAxes) : null;
  const slider = (
    <SettingBar size={context.size ?? "sm"} title={control.hint} min={0} max={scale.length - 1} step={1} value={index}
      label={label ?? <span className="studio-row__label">{swatch}{named.length ? control.barLabel ?? control.label : control.label}</span>}
      name={named.length ? control.barLabel ?? control.label : control.label}
      readout={(at: number) => say(control, scale[at]!)} onSet={at => put(scale[at]!)}
      // A step whose name is longer than the field ("Same as hover") shows its number there; the name stays its reading.
      short={scale.some(step => chOf(say(control, step)) > 5.5) && scale.every(step => /^\d+$/.test(step)) ? (at: number) => scale[at]! : undefined} />
  );
  if (!named.length) return slider;
  return (
    <>
      <RowField label={control.label} orientation="auto" title={control.hint}>
        <Segmented size={context.size ?? "sm"} fullWidth items={[...named, { value: CUSTOM, label: "Custom" }]} value={onScale ? CUSTOM : value}
          onValueChange={next => put(next === CUSTOM ? control.custom ?? scale[0]! : next)} />
      </RowField>
      {onScale ? slider : null}
    </>
  );
}

/*
 * Greys (owner, 2026-10-24: "slider that controls the coolness and warmth on a scale"; "100% strength grey tint somehow adds
 * more color?"): one temperature bar from Cool to Warm through Neutral, and, for any other colour, a tint colour by name
 * with how much of it. Temperature writes Neutral (its cool or warm ramp) and the tint strength on that ramp's own hue in
 * both modes; a tint colour writes Tint hue and the strength in both modes. Dark follows light (axis review, mode pairs).
 */
const TEMPERATURE = ["auto", "2", "3", "4", "6", "8", "12", "16"] as const;
const TINTS: ReadonlyArray<[string, string]> = [["accent", "Accent"], ["30", "Red"], ["55", "Orange"], ["95", "Yellow"], ["145", "Green"], ["185", "Teal"], ["255", "Blue"], ["300", "Purple"], ["350", "Pink"]];
function temperatureOf(values: Values, mode: "light" | "dark"): number {
  if (values.neutral === "neutral") return 0;
  const level = Math.max(1, TEMPERATURE.indexOf((values[`tint-${mode}`] ?? "auto") as (typeof TEMPERATURE)[number]) + 1);
  return values.neutral === "cool" ? -level : level;
}
function GreysRow({ context }: { context: RowContext }) {
  const { values, mode, set } = context;
  const hue = values["tint-hue"] ?? "auto";
  const tint = hue === "auto" ? "none" : hue === "accent" ? "accent" : TINTS.some(([value]) => value === hue) ? hue : CUSTOM;
  const t = temperatureOf(values, mode);
  const temperature = (next: number) => next === 0
    ? set({ neutral: "neutral", "tint-hue": "auto", "tint-light": "auto", "tint-dark": "auto" })
    : set({ neutral: next < 0 ? "cool" : "warm", "tint-hue": "auto", "tint-light": TEMPERATURE[Math.abs(next) - 1]!, "tint-dark": TEMPERATURE[Math.abs(next) - 1]! });
  const amount = values[`tint-${mode}`] ?? "auto";
  const steps = Array.from({ length: 17 }, (_, step) => String(step));
  const amountAt = Math.max(0, steps.indexOf(amount === "auto" ? "4" : amount));
  const tintColour = (next: string) => next === "none"
    ? set({ "tint-hue": "auto", "tint-light": "auto", "tint-dark": "auto" })
    : set({ neutral: "neutral", "tint-hue": next === CUSTOM ? (/^\d+$/.test(hue) ? hue : "200") : next, "tint-light": steps[amountAt]!, "tint-dark": steps[amountAt]! });
  const swatchOf = (value: string) => optionMark("tint-hue", value, values as CanvasAxes) ?? undefined;
  const hues = Array.from({ length: 72 }, (_, step) => String(step * 5));
  return (
    <>
      <Dim reason={tint === "none" ? null : "Off while a tint colour is on"}>
        <SettingBar size={context.size ?? "sm"} label="Temperature" title="How cool (blue) or warm (yellow) every grey is: pages, cards, edges and text"
          min={-8} max={8} step={1} origin={0} value={tint === "none" ? t : 0}
          readout={(at: number) => at === 0 ? "Neutral" : `${at < 0 ? "Cool" : "Warm"} ${Math.round(Math.abs(at) / 8 * 100)}%`}
          short={(at: number) => at === 0 ? "0" : `${at < 0 ? "-" : "+"}${Math.round(Math.abs(at) / 8 * 100)}`} gradient={TEMPERATURE_GRADIENT}
          onSet={temperature} />
      </Dim>
      <RowField label="Tint colour" orientation="horizontal" title="Lean every grey toward a colour instead of cool or warm">
        <CustomSelect size={context.size ?? "sm"} variant="soft" fullWidth aria-label="Tint colour" value={tint} onValueChange={tintColour}
          items={[{ value: "none", label: "None" }, ...TINTS.map(([value, label]) => ({ value, label, icon: swatchOf(value) })), { value: CUSTOM, label: "Custom", icon: tint === CUSTOM ? swatchOf(hue) : undefined }]} />
      </RowField>
      {tint === CUSTOM ? (
        <SettingBar size={context.size ?? "sm"} label="Hue" min={0} max={71} step={1} value={Math.max(0, hues.indexOf(hue))}
          readout={(at: number) => hueLabel(hues[at]!)} short={(at: number) => hueShort(hues[at]!)} gradient={HUE_GRADIENT} onSet={at => set({ "tint-hue": hues[at]! })} />
      ) : null}
      {tint !== "none" ? (
        <SettingBar size={context.size ?? "sm"} label="Amount" title="How much of the colour the greys take: 0% is plain grey"
          min={0} max={16} step={1} value={amountAt} readout={(at: number) => at === 0 ? "None" : `${Math.round(at / 16 * 100)}%`}
          onSet={at => set({ "tint-light": steps[at]!, "tint-dark": steps[at]! })} />
      ) : null}
    </>
  );
}

/*
 * A colour's shades, lightest to deepest (owner, 2026-10-25: "choose just a basic color first … then from there choose how
 * dark or saturated or light i want it to be"; then "let the accent's label flip between black and white with the shade").
 * Shade (axes/accent.ts, Solid) offers 200 to 850 and Auto, the colour's vivid shade; each step carries black or white,
 * whichever reads on it, and where neither does (a mid blue) it lands on the nearest step that carries the colour's own
 * label (scale.ts `solidAt`), so several steps can draw one shade. The bar offers each shade once, ordered by lightness,
 * with Auto where its lightness puts it.
 */
type AccentPreset = { id: string; tokens: Record<string, string>; darkTokens?: Record<string, string> };
const AXIS_PRESETS = TOKENS.axes as unknown as Array<{ id: string; presets: AccentPreset[] }>;
const ACCENT_PRESETS = AXIS_PRESETS.find(axis => axis.id === "accent")!.presets;
const SOLID_STEPS = AXIS_PRESETS.find(axis => axis.id === "solid-light")!.presets.map(preset => preset.id).filter(id => /^\d+$/.test(id));
/** A hex colour's relative luminance, to order shades light to deep. */
const luminance = (hex: string) => {
  const channel = (at: number) => { const c = parseInt(hex.slice(at, at + 2), 16) / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};
/** One mode's side of a brand declaration (`light-dark(a, b)` or one colour for both). */
const sideOf = (value: string | undefined, mode: "light" | "dark") => {
  const pair = value ? /^light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/i.exec(value) : null;
  return pair ? pair[mode === "light" ? 1 : 2]! : value;
};
function shadesOf(accent: string, mode: "light" | "dark", brand?: Readonly<Record<string, string>>) {
  const preset = ACCENT_PRESETS.find(entry => entry.id === accent);
  const paint = (mode === "dark" ? preset?.darkTokens : undefined) ?? preset?.tokens ?? {};
  const read = (name: string) => brand ? sideOf(brand[name], mode) : paint[name];
  const hex = (step: string) => read(step === "auto" ? "--area-accent-solid-full" : `--area-accent-solid-${step}-full`) ?? "#000000";
  // Each step stands for the first value that draws the same shade, Auto before any step.
  const first = new Map<string, string>();
  for (const step of ["auto", ...SOLID_STEPS]) if (!first.has(hex(step))) first.set(hex(step), step);
  const scale = [...first.values()].sort((a, b) => luminance(hex(b)) - luminance(hex(a)));
  return { scale, of: (step: string) => first.get(hex(step)) ?? "auto", hex };
}

/** Accent (owner, 2026-10-24: "maybe this should just be a dropdown or an actual color picker?"): the palette's eleven as
 * swatches, and Custom for any other hue, by name and degree, on a bar; then its Shade and Saturation under it (owner,
 * 2026-10-25), so a colour is picked first and then made deeper or quieter. */
function AccentRow({ context }: { context: RowContext }) {
  const { values, set } = context;
  const control = controlOf("accent");
  const value = values.accent ?? control.defaultValue;
  const custom = /^\d+$/.test(value);
  const named = control.items.filter(item => !/^\d+$/.test(item.value));
  const hues = control.items.filter(item => /^\d+$/.test(item.value)).map(item => item.value).sort((a, b) => Number(a) - Number(b));
  const layout = context.layout?.("accent", named.length + 1) ?? "list";
  // A brand is its own colour (brand-settings.tsx): only its Shade and Saturation stay here.
  if (context.brand) return <><SettingRow axis="accent-strength" context={context} /><AccentPaintRows accent={value} context={context} /></>;
  return (
    <>
      <RowField label={control.label} orientation="horizontal" title={control.hint}>
        <CustomSelect size={context.size ?? "sm"} variant="soft" fullWidth layout={layout} aria-label={control.label} value={custom ? CUSTOM : value}
          onValueChange={next => set({ accent: next === CUSTOM ? (custom ? value : "200") : next })} onHighlightChange={next => context.preview?.("accent", next === CUSTOM ? null : next)}
          items={[...named.map(item => ({ value: item.value, label: item.label, icon: optionMark("accent", item.value, values as CanvasAxes) ?? undefined,
            preview: layout === "grid" ? context.figure?.("accent", item.value) : undefined })),
            { value: CUSTOM, label: "Custom", icon: custom ? optionMark("accent", value, values as CanvasAxes) ?? undefined : undefined }]} />
      </RowField>
      {custom ? (
        <SettingBar size={context.size ?? "sm"} label="Hue" min={0} max={hues.length - 1} step={1} value={Math.max(0, hues.indexOf(value))}
          readout={(at: number) => hueLabel(hues[at]!)} short={(at: number) => hueShort(hues[at]!)} gradient={HUE_GRADIENT} onSet={at => set({ accent: hues[at]! })} />
      ) : null}
      <SettingRow axis="accent-strength" context={context} />
      <AccentPaintRows accent={value} context={context} />
    </>
  );
}

/** Shade and Label tint, after Saturation (owner 2026-10-27): both only show while Buttons or Selection is Accent, so they
 * sit together. */
function AccentPaintRows({ accent, context }: { accent: string; context: RowContext }) {
  const tint = controlOf("label-tint");
  return (
    <>
      <Dim reason={shadeReason(accent, context)}><ShadeBar accent={accent} context={context} /></Dim>
      <Dim reason={tint.inactive?.(context.values, context.mode) ?? null}><Row control={tint} context={context} /></Dim>
    </>
  );
}

/** Why the accent's Shade does nothing now: the accent is not painted, or the colour has only one readable shade. */
function shadeReason(accent: string, context: RowContext) {
  const control = controlOf(`solid-${context.mode}`);
  const { scale } = shadesOf(accent, context.mode, context.brand);
  const name = context.brand ? "The brand" : /^\d+$/.test(accent) ? hueName(Number(accent)) : accent[0]!.toUpperCase() + accent.slice(1);
  return control.inactive?.(context.values, context.mode) ?? (scale.length < 2 ? `${name} has one shade that keeps its label readable` : null);
}

/** The accent's Shade in the mode shown: a bar from its vivid shade to its deepest. */
function ShadeBar({ accent, context }: { accent: string; context: RowContext }) {
  const axis = `solid-${context.mode}` as const;
  const control = controlOf(axis);
  const { scale, of, hex } = shadesOf(accent, context.mode, context.brand);
  const index = Math.max(0, scale.indexOf(of(context.values[axis] ?? "auto")));
  // Read from the vivid shade (a brand's: its nearest readable shade): lighter before it, deeper after it, the ends by name.
  const vivid = scale.indexOf("auto");
  const say = (at: number) => at === vivid ? context.brand ? "Brand" : "Vivid" : at === 0 ? "Lightest" : at === scale.length - 1 ? "Deepest"
    : at < vivid ? `${Math.round(((vivid - at) / vivid) * 100)}% lighter` : `${Math.round(((at - vivid) / (scale.length - 1 - vivid)) * 100)}% deeper`;
  return (
    <SettingBar size={context.size ?? "sm"} title={control.hint} min={0} max={Math.max(1, scale.length - 1)} step={1} value={index} disabled={scale.length < 2}
      label={<span className="studio-row__label">{context.brand ? colourMark(hex(scale[index]!)) : optionMark(axis as never, scale[index]!, context.values as CanvasAxes)}{control.label}</span>}
      name={control.label} readout={(at: number) => say(at)} onSet={at => context.set({ [axis]: scale[at]! })}
      // The field reads the same steps as numbers from the vivid shade, lighter below 0 and deeper above it; the trough is
      // the colour's own shades, lightest to deepest, so the sign needs no words.
      short={(at: number) => at === vivid ? "0" : vivid < 0 ? String(at) : at < vivid ? `-${Math.round(((vivid - at) / vivid) * 100)}` : `+${Math.round(((at - vivid) / (scale.length - 1 - vivid)) * 100)}`}
      gradient={scale.length > 1 ? through(scale.map(step => hex(step))) : undefined} />
  );
}
