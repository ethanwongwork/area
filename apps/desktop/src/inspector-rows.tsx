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
import { useEffect, useRef, useState, type ReactNode } from "react";
import TOKENS from "@area/tokens/tokens.json";
import { CustomSelect, Field, Segmented, Slider, type SliderProps } from "@area/react";
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
function SettingBar({ value, onSet, ...props }: Omit<SliderProps, "value" | "onValueChange" | "onValueCommit"> & { value: number; onSet: (value: number) => void }) {
  const [draft, setDraft] = useState<number | null>(null);
  const pending = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const apply = useRef(onSet);
  apply.current = onSet;
  useEffect(() => () => clearTimeout(timer.current), []);
  // The setting and the end of the draft in one render, so the bar never shows the old value between them.
  const land = (next: number) => { clearTimeout(timer.current); pending.current = null; apply.current(next); setDraft(null); };
  const wait = () => { clearTimeout(timer.current); timer.current = setTimeout(() => { if (pending.current !== null) land(pending.current); }, REST); };
  return (
    <Slider labelPosition="inside" {...props} value={draft ?? value}
      onValueCommit={next => { pending.current = next; clearTimeout(timer.current); timer.current = setTimeout(() => land(next), EASE); }}
      onValueChange={next => { setDraft(next); pending.current = next; wait(); }}
      onPointerMove={event => { if (pending.current !== null && event.buttons) wait(); }} />
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
  accent: "accent", "solid-light": "accent", "solid-dark": "accent", "accent-strength": "accent" };

/** One row: the setting's own control, or the combined row it belongs to. */
export function SettingRow({ axis, context }: { axis: string; context: RowContext }) {
  if (ROW_OF[axis] === "greys") return <GreysRow context={context} />;
  if (axis === "accent") return <AccentRow context={context} />;
  const control = controlOf(axis);
  return <Dim reason={control.inactive?.(context.values, context.mode) ?? null}><Row control={control} context={context} /></Dim>;
}

/** A row that has no effect under the other settings: dimmed, still usable, with the reason under it. */
function Dim({ reason, children }: { reason: string | null; children: ReactNode }) {
  if (!reason) return <>{children}</>;
  return <div className="studio-row studio-row--inactive">{children}<p className="studio-row__note">{reason}</p></div>;
}

function Row({ control, context }: { control: GalleryControl; context: RowContext }) {
  const { values, set } = context;
  const axis = control.axis, value = values[axis] ?? control.defaultValue;
  const put = (next: string) => set({ [axis]: next });
  if (control.kind === "bar") return <Bar control={control} value={value} put={put} context={context} />;
  if (control.kind === "segmented") {
    // Two names sit beside their label, as the reference's toggles; three or more take the row under it, so none truncates.
    return (
      <Field label={control.label} orientation={control.items.length > 2 ? undefined : "horizontal"} title={control.hint}>
        <Segmented size={context.size ?? "sm"} fullWidth items={[...control.items]} value={value} onValueChange={put} />
      </Field>
    );
  }
  const layout = context.layout?.(axis, control.items.length) ?? "list";
  const items = control.items.map(item => ({ value: item.value, label: item.label, icon: optionMark(axis as never, item.value, values as CanvasAxes) ?? undefined,
    preview: layout === "grid" ? context.figure?.(axis, item.value) : undefined }));
  return (
    <Field label={control.label} orientation="horizontal" title={control.hint}>
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
    </Field>
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
      readout={(at: number) => say(control, scale[at]!)} onSet={at => put(scale[at]!)} />
  );
  if (!named.length) return slider;
  return (
    <>
      <Field label={control.label} orientation={named.length > 1 ? undefined : "horizontal"} title={control.hint}>
        <Segmented size={context.size ?? "sm"} fullWidth items={[...named, { value: CUSTOM, label: "Custom" }]} value={onScale ? CUSTOM : value}
          onValueChange={next => put(next === CUSTOM ? control.custom ?? scale[0]! : next)} />
      </Field>
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
          onSet={temperature} />
      </Dim>
      <Field label="Tint colour" orientation="horizontal" title="Lean every grey toward a colour instead of cool or warm">
        <CustomSelect size={context.size ?? "sm"} variant="soft" fullWidth aria-label="Tint colour" value={tint} onValueChange={tintColour}
          items={[{ value: "none", label: "None" }, ...TINTS.map(([value, label]) => ({ value, label, icon: swatchOf(value) })), { value: CUSTOM, label: "Custom", icon: tint === CUSTOM ? swatchOf(hue) : undefined }]} />
      </Field>
      {tint === CUSTOM ? (
        <SettingBar size={context.size ?? "sm"} label="Hue" min={0} max={71} step={1} value={Math.max(0, hues.indexOf(hue))}
          readout={(at: number) => hueLabel(hues[at]!)} onSet={at => set({ "tint-hue": hues[at]! })} />
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
  if (context.brand) return <><ShadeRow accent={value} context={context} /><SettingRow axis="accent-strength" context={context} /></>;
  return (
    <>
      <Field label={control.label} orientation="horizontal" title={control.hint}>
        <CustomSelect size={context.size ?? "sm"} variant="soft" fullWidth layout={layout} aria-label={control.label} value={custom ? CUSTOM : value}
          onValueChange={next => set({ accent: next === CUSTOM ? (custom ? value : "200") : next })} onHighlightChange={next => context.preview?.("accent", next === CUSTOM ? null : next)}
          items={[...named.map(item => ({ value: item.value, label: item.label, icon: optionMark("accent", item.value, values as CanvasAxes) ?? undefined,
            preview: layout === "grid" ? context.figure?.("accent", item.value) : undefined })),
            { value: CUSTOM, label: "Custom", icon: custom ? optionMark("accent", value, values as CanvasAxes) ?? undefined : undefined }]} />
      </Field>
      {custom ? (
        <SettingBar size={context.size ?? "sm"} label="Hue" min={0} max={hues.length - 1} step={1} value={Math.max(0, hues.indexOf(value))}
          readout={(at: number) => hueLabel(hues[at]!)} onSet={at => set({ accent: hues[at]! })} />
      ) : null}
      <ShadeRow accent={value} context={context} />
      <SettingRow axis="accent-strength" context={context} />
    </>
  );
}

/** The accent's Shade in the mode shown: a bar from its vivid shade to its deepest, or a note where it has only one. */
function ShadeRow({ accent, context }: { accent: string; context: RowContext }) {
  const axis = `solid-${context.mode}` as const;
  const control = controlOf(axis);
  const { scale, of, hex } = shadesOf(accent, context.mode, context.brand);
  const index = Math.max(0, scale.indexOf(of(context.values[axis] ?? "auto")));
  // Read from the vivid shade (a brand's: its nearest readable shade): lighter before it, deeper after it, the ends by name.
  const vivid = scale.indexOf("auto");
  const say = (at: number) => at === vivid ? context.brand ? "Brand" : "Vivid" : at === 0 ? "Lightest" : at === scale.length - 1 ? "Deepest"
    : at < vivid ? `${Math.round(((vivid - at) / vivid) * 100)}% lighter` : `${Math.round(((at - vivid) / (scale.length - 1 - vivid)) * 100)}% deeper`;
  const name = context.brand ? "The brand" : /^\d+$/.test(accent) ? hueName(Number(accent)) : accent[0]!.toUpperCase() + accent.slice(1);
  const reason = control.inactive?.(context.values, context.mode) ?? (scale.length < 2 ? `${name} has one shade that keeps its label readable` : null);
  return (
    <Dim reason={reason}>
      <SettingBar size={context.size ?? "sm"} title={control.hint} min={0} max={Math.max(1, scale.length - 1)} step={1} value={index} disabled={scale.length < 2}
        label={<span className="studio-row__label">{context.brand ? colourMark(hex(scale[index]!)) : optionMark(axis as never, scale[index]!, context.values as CanvasAxes)}{control.label}</span>}
        readout={(at: number) => say(at)} onSet={at => context.set({ [axis]: scale[at]! })} />
    </Dim>
  );
}
