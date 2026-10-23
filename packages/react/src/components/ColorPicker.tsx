import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, KeyboardEvent, PointerEvent, ReactNode, SyntheticEvent } from "react";
import { normalizeHexColor } from "./ColorField.tsx";
import { ColorSwatchPicker, type ColorSwatchOption } from "./ColorSwatchPicker.tsx";
import { Button } from "./Button.tsx";
import { Input } from "./Input.tsx";
import { InputGroup } from "./InputGroup.tsx";
import { NumberField } from "./NumberField.tsx";
import { Select } from "./forms.tsx";
import { Segmented } from "./primitives.tsx";
import { Glyph } from "./Glyph.tsx";
import { AREA_COLOR_GRID } from "./color-grid.ts";
import { clamp, contrastBand, contrastRatio, hslToHsv, hsvToRgb, oklchToRgb, rgbToHsl, rgbToHsv, rgbToOklch, type Rgb } from "./color-math.ts";
import { colorPickerVariants, MANIFESTS, type VariantProps } from "../variants.ts";

const byte = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, "0").toUpperCase();
const hexToRgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)) as Rgb;

/** HSV conversion keeps hue/saturation state separate from the serialized RGB value. */
export function hexToHsv(hex: string): [number, number, number, number] {
  const color = normalizeHexColor(hex) ?? "#000000";
  return [...rgbToHsv(hexToRgb(color)), parseInt(color.slice(7) || "FF", 16) / 255 * 100];
}
export function hsvToHex(h: number, s: number, v: number, a = 100): string {
  return `#${hsvToRgb(h, s, v).map(byte).join("")}${a < 100 ? byte(a / 100 * 255) : ""}`;
}

/** Figma's color models plus OKLCH. */
export type ColorModel = "hex" | "rgb" | "css" | "hsl" | "hsb" | "oklch";
/** Ways to choose a color: the saturation/brightness area, a palette grid, channel sliders. */
export type ColorView = "spectrum" | "grid" | "sliders";
const MODELS: readonly [ColorModel, string][] = [["hex", "Hex"], ["rgb", "RGB"], ["css", "CSS"], ["hsl", "HSL"], ["hsb", "HSB"], ["oklch", "OKLCH"]];
const VIEWS: Record<ColorView, string> = { spectrum: "Spectrum", grid: "Grid", sliders: "Sliders" };
/** OKLCH chroma is shown as a percentage of 0.4, the reference CSS Color 4 uses for `C%`. */
const CHROMA_PERCENT = 0.004;
type Hsva = [number, number, number, number];

/** CSS text in hex, rgb()/rgba(), hsl()/hsla() or oklch(). */
function parseCss(text: string, hue: number): Hsva | null {
  const hex = normalizeHexColor(text);
  if (hex) return hexToHsv(hex);
  const match = /^(rgba?|hsla?|oklch)\(\s*([^)]*)\)$/i.exec(text.trim());
  if (!match) return null;
  const fn = (match[1] ?? "").toLowerCase();
  const parts = (match[2] ?? "").split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  const nums = parts.map(p => parseFloat(p));
  if (nums.some(Number.isNaN)) return null;
  const [x = 0, y = 0, z = 0, w = 1] = nums;
  const pct = (i: number) => parts[i]?.endsWith("%") ?? false;
  const alpha = clamp(parts[3] === undefined ? 100 : pct(3) ? w : w * 100, 0, 100);
  if (fn.startsWith("rgb")) return [...rgbToHsv([x, y, z].map((n, i) => clamp(pct(i) ? n * 2.55 : n, 0, 255)) as Rgb, hue), alpha];
  if (fn === "oklch") {
    const { rgb } = oklchToRgb([pct(0) ? x / 100 : x, pct(1) ? y * CHROMA_PERCENT : y, z]);
    return [...rgbToHsv(rgb, hue), alpha];
  }
  return [...hslToHsv(((x % 360) + 360) % 360, clamp(y, 0, 100), clamp(z, 0, 100)), alpha];
}
function formatCss([h, s, v, a]: Hsva, alpha: boolean) {
  const [r = 0, g = 0, b = 0] = hsvToRgb(h, s, v).map(Math.round);
  return alpha && Math.round(a) < 100 ? `rgba(${r}, ${g}, ${b}, ${+(a / 100).toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
}

/** A text entry that shows a draft while typing and commits on Enter or blur; Escape restores. */
function DraftInput({ value, valid, onCommit, ...rest }: { value: string; valid: (text: string) => boolean; onCommit: (text: string) => void } & Omit<Parameters<typeof Input>[0], "value" | "onChange">) {
  // The draft exists only while editing; otherwise the field shows the committed value.
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? value;
  const commit = () => { if (draft !== null && draft !== value && valid(draft)) onCommit(draft); setDraft(null); };
  return <Input {...rest} value={shown} spellCheck={false} autoCapitalize="off" invalid={!valid(shown)}
    onChange={event => setDraft(event.target.value)} onBlur={commit}
    onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") { commit(); event.preventDefault(); }
      if (event.key === "Escape") { setDraft(null); event.preventDefault(); }
    }} />;
}

/** Fluent `eyedropper_16_regular`. */
const EyedropperGlyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M13.43 2.57q.28.28.42.63.15.36.15.74a2 2 0 0 1-.57 1.46l-.7.7.25.26a1.14 1.14 0 0 1 0 1.6l-.59.58a1.14 1.14 0 0 1-1.6 0l-.25-.25-4.94 4.93a.5.5 0 0 1-.35.15h-.53l-1.29.55a1.03 1.03 0 0 1-1.35-1.35l.55-1.29v-.53a.5.5 0 0 1 .15-.35l4.94-4.95-.26-.25a1.14 1.14 0 0 1 0-1.6l.6-.59a1.14 1.14 0 0 1 1.6 0l.25.26.7-.7A2 2 0 0 1 11.98 2a2 2 0 0 1 1.45.57m-5 3.6-4.8 4.78v.43a1 1 0 0 1-.03.2L3 12.96l1.41-.56a1 1 0 0 1 .2-.04h.43l4.79-4.79zm4.3-1.49q.12-.13.2-.3a1 1 0 0 0 .07-.36 1 1 0 0 0-.28-.74 1 1 0 0 0-.67-.28 1 1 0 0 0-.73.28l-1.05 1.05a.5.5 0 0 1-.71 0l-.61-.6-.05-.03-.05-.01h-.06l-.04.04-.58.58a.1.1 0 0 0-.04.1l.04.09 3.33 3.33.04.03.05.01a.1.1 0 0 0 .1-.04l.58-.58.03-.05.01-.05a.1.1 0 0 0-.04-.1l-.6-.6a.5.5 0 0 1 0-.7z" />
  </svg>
);
/** Fluent `add_16_regular`. */
const AddGlyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M8 2c.28 0 .5.22.5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5c0-.28.22-.5.5-.5" />
  </svg>
);

interface EyeDropperResult { sRGBHex: string }
type EyeDropperConstructor = new () => { open: () => Promise<EyeDropperResult> };

/** One editable channel of a color model, for both the value fields and the sliders. */
interface Channel { id: string; name: string; short: string; max: number; value: number; set: (n: number) => void }

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** `surface` (a floating plate, default) or `plain` for a picker inside a Popover or Panel (audit F-20). */
  variant?: VariantProps<typeof MANIFESTS.colorPicker>["variant"];
  label?: string;
  value?: string;
  defaultValue?: string;
  /** The new hex, and the event behind it when there is one (not for the eyedropper or a typed commit; audit C-7). */
  onValueChange?: (value: string, event?: SyntheticEvent) => void;
  name?: string;
  disabled?: boolean;
  /** Edit opacity: an opacity track and a percentage beside the color value. */
  alpha?: boolean;
  /** The color model of the value row and sliders. Controlled with `onModelChange`. */
  model?: ColorModel;
  defaultModel?: ColorModel;
  onModelChange?: (model: ColorModel) => void;
  /** Ways to choose, in tab order. More than one shows a view switcher. */
  views?: readonly ColorView[];
  view?: ColorView;
  defaultView?: ColorView;
  onViewChange?: (view: ColorView) => void;
  /** Colors of the grid view, row by row. Defaults to the Area palette. */
  grid?: { columns: number; options: readonly ColorSwatchOption[] };
  /** Check contrast against a background: ratio, pass/fail and the threshold on the area. */
  contrast?: { background: string; level?: "AA" | "AAA" };
  /** Show the new color beside the original, which restores it when chosen. */
  preview?: boolean;
  /** Offer screen sampling where the browser supports the EyeDropper API. */
  eyedropper?: boolean;
  /** A row above the editor, divided from it, for a title, tabs or a close action. */
  header?: ReactNode;
  swatches?: readonly ColorSwatchOption[];
  swatchesLabel?: string;
  onAddSwatch?: (value: string) => void;
}

/** Figma-style color editor with spectrum, grid and slider views, six color models, a
 * contrast check, a before/after preview and saved swatches. */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  { variant, label = "Color", value, defaultValue = "#8D4DF3", onValueChange, name, disabled, alpha = true,
    model: modelProp, defaultModel = "hex", onModelChange, views = ["spectrum"], view: viewProp, defaultView, onViewChange,
    grid = AREA_COLOR_GRID, contrast, preview, eyedropper = true, header,
    swatches = [], swatchesLabel = "Saved colors", onAddSwatch, className, style, ...rest }, ref,
) {
  // A consumer's aria-label names the group and its parts; `label` is the fallback (audit S17, F-19).
  const groupName = (rest as { "aria-label"?: string })["aria-label"] ?? label;
  const id = useId();
  const initial = normalizeHexColor(defaultValue) ?? "#8D4DF3";
  const [local, setLocal] = useState(initial);
  const color = value === undefined ? local : normalizeHexColor(value) ?? initial;
  const [original] = useState(color);
  const [hsva, setHsva] = useState<Hsva>(() => hexToHsv(color));
  const [localModel, setLocalModel] = useState<ColorModel>(defaultModel);
  const model = modelProp ?? localModel;
  const [localView, setLocalView] = useState<ColorView>(defaultView ?? views[0] ?? "spectrum");
  const view = viewProp ?? (views.includes(localView) ? localView : views[0] ?? "spectrum");
  const [canSample, setCanSample] = useState(false);
  const [sampling, setSampling] = useState(false);
  const [gamutMapped, setGamutMapped] = useState(false);
  const lastEmitted = useRef(color);
  const root = useRef<HTMLDivElement | null>(null);
  const [h, s, v, a] = hsva;

  useEffect(() => { setCanSample(typeof window !== "undefined" && "EyeDropper" in window); }, []);
  useEffect(() => {
    if (color !== lastEmitted.current) setHsva(hexToHsv(color));
    lastEmitted.current = color;
  }, [color]);
  useEffect(() => {
    if (value !== undefined) return;
    const form = root.current?.closest("form");
    const reset = () => { setLocal(initial); setHsva(hexToHsv(initial)); lastEmitted.current = initial; };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [value, initial]);

  function emit(next: Hsva, mapped = false, event?: SyntheticEvent) {
    if (disabled) return;
    const channels: Hsva = [((next[0] % 360) + 360) % 360, clamp(next[1], 0, 100), clamp(next[2], 0, 100), alpha ? clamp(next[3], 0, 100) : 100];
    const hex = hsvToHex(...channels);
    setHsva(channels);
    setGamutMapped(mapped);
    if (value === undefined) setLocal(hex);
    lastEmitted.current = hex;
    if (hex !== color) onValueChange?.(hex, event);
  }
  const set = (index: 0 | 1 | 2 | 3, n: number, event?: SyntheticEvent) => { const next = [...hsva] as Hsva; next[index] = n; emit(next, false, event); };

  function point(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    emit([h, (event.clientX - box.left) / box.width * 100, 100 - (event.clientY - box.top) / box.height * 100, a], false, event);
  }
  // One tab stop moves in two dimensions: Left/Right is saturation, Up/Down brightness.
  function areaKey(event: KeyboardEvent<HTMLInputElement>) {
    const step = event.shiftKey ? 10 : 1;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowDown: [0, -step], ArrowUp: [0, step], PageDown: [0, -10], PageUp: [0, 10] };
    const move = delta[event.key];
    if (!move) return;
    event.preventDefault();
    // The area is colour space, not reading order: it stays left-to-right (audit F-16).
    emit([h, s + move[0], v + move[1], a], false, event);
  }
  async function sample() {
    const Dropper = (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper;
    if (!Dropper || disabled) return;
    setSampling(true);
    try {
      const picked = normalizeHexColor((await new Dropper().open()).sRGBHex);
      if (picked) emit([...hexToHsv(picked).slice(0, 3), a] as Hsva);
    } catch { /* Escape or dismissal leaves the color unchanged. */ }
    finally { setSampling(false); }
  }
  function chooseModel(next: ColorModel) {
    if (modelProp === undefined) setLocalModel(next);
    onModelChange?.(next);
  }
  function chooseView(next: ColorView) {
    if (viewProp === undefined) setLocalView(next);
    onViewChange?.(next);
  }

  const rgb = hsvToRgb(h, s, v);
  const opaque = hsvToHex(h, s, v);
  const hsl = rgbToHsl(rgb, h);
  const oklch = rgbToOklch(rgb, h);

  // Channels of the current model. Hex and CSS edit through RGB in the slider view.
  const channels: Channel[] = (() => {
    const setRgb = (i: number) => (n: number) => { const next = [...rgb] as Rgb; next[i] = n; emit([...rgbToHsv(next, h), a]); };
    const setHsl = (i: number) => (n: number) => { const next = [...hsl] as [number, number, number]; next[i] = n; emit([...hslToHsv(...next), a]); };
    const setOk = (i: number) => (n: number) => {
      const next: [number, number, number] = [oklch[0] * 100, oklch[1] / CHROMA_PERCENT, oklch[2]];
      next[i] = n;
      const result = oklchToRgb([next[0] / 100, next[1] * CHROMA_PERCENT, next[2]]);
      emit([...rgbToHsv(result.rgb, h), a], result.mapped);
    };
    if (model === "hsl") return [
      { id: "hsl-h", name: "hue", short: "H", max: 360, value: hsl[0], set: setHsl(0) },
      { id: "hsl-s", name: "saturation", short: "S", max: 100, value: hsl[1], set: setHsl(1) },
      { id: "hsl-l", name: "lightness", short: "L", max: 100, value: hsl[2], set: setHsl(2) },
    ];
    if (model === "hsb") return [
      { id: "hsb-h", name: "hue", short: "H", max: 360, value: h, set: (n: number) => set(0, n) },
      { id: "hsb-s", name: "saturation", short: "S", max: 100, value: s, set: (n: number) => set(1, n) },
      { id: "hsb-b", name: "brightness", short: "B", max: 100, value: v, set: (n: number) => set(2, n) },
    ];
    if (model === "oklch") return [
      { id: "ok-l", name: "lightness", short: "L", max: 100, value: oklch[0] * 100, set: setOk(0) },
      { id: "ok-c", name: "chroma", short: "C", max: 100, value: oklch[1] / CHROMA_PERCENT, set: setOk(1) },
      { id: "ok-h", name: "hue", short: "H", max: 360, value: oklch[2], set: setOk(2) },
    ];
    return [
      { id: "rgb-r", name: "red", short: "R", max: 255, value: rgb[0], set: setRgb(0) },
      { id: "rgb-g", name: "green", short: "G", max: 255, value: rgb[1], set: setRgb(1) },
      { id: "rgb-b", name: "blue", short: "B", max: 255, value: rgb[2], set: setRgb(2) },
    ];
  })();

  // Contrast of the composited color (opacity over the background) against the background.
  const background = contrast ? normalizeHexColor(contrast.background) : null;
  const check = useMemo(() => {
    if (!background) return null;
    const bg = hexToRgb(background);
    const shown = rgb.map((c, i) => c * a / 100 + (bg[i] ?? 0) * (1 - a / 100)) as Rgb;
    const threshold = contrast?.level === "AAA" ? 7 : 4.5;
    return { ratio: contrastRatio(shown, bg), threshold, band: contrastBand(h, bg, threshold) };
  }, [background, contrast?.level, rgb[0], rgb[1], rgb[2], a, h]);
  const bandPath = check && (() => {
    const steps = check.band.length - 1;
    const x = (i: number) => (i / steps * 100).toFixed(2);
    const light = check.band.map(([, top], i) => `${x(i)},${(100 - top).toFixed(2)}`);
    const dark = check.band.map(([bottom], i) => `${x(i)},${(100 - bottom).toFixed(2)}`).reverse();
    return { region: `M${light.join("L")}L${dark.join("L")}Z`, edges: [
      `M${check.band.map(([, top], i) => `${x(i)},${(100 - top).toFixed(2)}`).join("L")}`,
      `M${check.band.map(([bottom], i) => `${x(i)},${(100 - bottom).toFixed(2)}`).join("L")}`] };
  })();

  const field = (channel: Channel) => (
    <NumberField key={channel.id} size="sm" variant="soft" aria-label={`${groupName} ${channel.name}`}
      min={0} max={channel.max} step={1} fractionDigits={0} value={Math.round(channel.value)} disabled={disabled}
      onValueCommit={n => { if (n !== null) channel.set(n); }} />
  );
  const valueFields = (): ReactNode => {
    if (model === "css") return <DraftInput className="area-color-picker__text-field" size="sm" variant="soft" aria-label={`${groupName} CSS color`} disabled={disabled}
      value={formatCss(hsva, alpha)} valid={text => parseCss(text, h) !== null} onCommit={text => { const next = parseCss(text, h)!; emit(alpha ? next : [next[0], next[1], next[2], 100]); }} />;
    if (model === "hex") return <DraftInput className="area-color-picker__text-field" size="sm" variant="soft" aria-label={`${groupName} hex`} disabled={disabled} maxLength={7}
      value={opaque.slice(1)} valid={text => normalizeHexColor(text)?.length === 7} onCommit={text => emit([...hexToHsv(normalizeHexColor(text)!).slice(0, 3), a] as Hsva)} />;
    return channels.map(field);
  };

  const alphaTrack = alpha && <input className="area-color-picker__slider area-color-picker__alpha" type="range" aria-label={`${groupName} opacity`} min={0} max={100} step={1}
    value={Math.round(a)} disabled={disabled} onChange={event => set(3, +event.target.value, event)} />;
  const sliderRow = (short: string, input: ReactNode) => <div className="area-color-picker__channel-row" key={short}>
    <span className="area-color-picker__channel-label" aria-hidden="true">{short}</span>{input}</div>;
  const tracks = view === "spectrum"
    ? <>
      <input className="area-color-picker__slider area-color-picker__hue" type="range" aria-label={`${groupName} hue`} min={0} max={360} step={1}
        value={Math.round(h)} disabled={disabled} onChange={event => set(0, +event.target.value, event)}
        style={{ "--_thumb-color": `hsl(${h} 100% 50%)` } as CSSProperties} />
      {alphaTrack}
    </>
    : view === "sliders"
      ? <>
        {channels.map(channel => sliderRow(channel.short, <input className="area-color-picker__slider" data-channel={channel.id} type="range"
          aria-label={`${groupName} ${channel.name}`} min={0} max={channel.max} step={channel.max > 100 ? 1 : 0.5} value={+channel.value.toFixed(1)} disabled={disabled}
          onChange={event => channel.set(+event.target.value)} />))}
        {alphaTrack && sliderRow("A", alphaTrack)}
      </>
      : alphaTrack;
  const hasControls = (eyedropper && canSample) || preview || !!tracks;

  const rootStyle = {
    "--_hue": h, "--_saturation": `${s}%`, "--_brightness": `${100 - v}%`, "--_swatch-color": opaque,
    // Channel slider gradients are built in CSS from these numbers.
    "--_r": Math.round(rgb[0]), "--_g": Math.round(rgb[1]), "--_b": Math.round(rgb[2]),
    "--_hsl-s": `${hsl[1]}%`, "--_hsl-l": `${hsl[2]}%`,
    "--_hwb-w": `${(1 - s / 100) * v}%`, "--_hwb-b": `${100 - v}%`, "--_hsv-v": `${v}%`, "--_hwb-w-top": `${100 - s}%`,
    "--_ok-l": oklch[0], "--_ok-c": oklch[1], "--_ok-h": oklch[2],
    ...style,
  } as CSSProperties;

  return <div {...rest} ref={node => { root.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
    role="group" aria-label={groupName} aria-disabled={disabled || undefined} className={colorPickerVariants({ variant }, className)} style={rootStyle}>
    {header && <div className="area-color-picker__header">{header}</div>}
    <div className="area-color-picker__body">
      {views.length > 1 && <Segmented className="area-color-picker__views" size="sm" fullWidth aria-label={`${groupName} view`} value={view}
        items={views.map(item => ({ value: item, label: VIEWS[item], disabled }))} onValueChange={next => chooseView(next as ColorView)} />}
      {check && <div className="area-color-picker__contrast" data-pass={check.ratio >= check.threshold || undefined}>
        <span className="area-color-picker__contrast-pair" aria-hidden="true"><span style={{ "--_swatch-color": background } as CSSProperties} /></span>
        <span className="area-color-picker__contrast-ratio" role="status" aria-label={`Contrast ${check.ratio.toFixed(2)} to 1 against ${background}, ${check.ratio >= check.threshold ? "passes" : "fails"} ${contrast?.level ?? "AA"}`}>
          {check.ratio.toFixed(2)}<span className="area-color-picker__contrast-unit"> : 1</span></span>
        <span className="area-color-picker__contrast-level" aria-hidden="true">
          <Glyph name={check.ratio >= check.threshold ? "check" : "dismiss"} />{contrast?.level ?? "AA"}</span>
      </div>}
      {/* Colour geometry is physical in every script, as AlignmentPicker's grid (audit F-16): the
          area's white sits left and the tracks' gradients run left to right, so both stay LTR. */}
      {view === "spectrum" && <div className="area-color-picker__area" dir="ltr"
        onPointerDown={event => { if (disabled || event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.querySelector("input")?.focus(); point(event); }}
        onPointerMove={event => { if (!disabled && event.currentTarget.hasPointerCapture(event.pointerId)) point(event); }}>
        {bandPath && <svg className="area-color-picker__band" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs><pattern id={`${id}-dots`} width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.4" /></pattern></defs>
          <path className="area-color-picker__band-region" d={bandPath.region} fill={`url(#${id}-dots)`} />
          {bandPath.edges.map(d => <path key={d} className="area-color-picker__band-edge" d={d} />)}
        </svg>}
        <span className="area-color-picker__thumb" aria-hidden="true" />
        <input className="area-color-picker__channel" type="range" aria-roledescription="2D slider" aria-label={`${groupName} saturation and brightness`}
          aria-valuetext={`Saturation ${Math.round(s)}%, brightness ${Math.round(v)}%`} min={0} max={100} value={Math.round(s)} disabled={disabled}
          onKeyDown={areaKey} onChange={event => set(1, +event.target.value, event)} />
      </div>}
      {view === "grid" && <ColorSwatchPicker className="area-color-picker__grid" label={`${groupName} palette`} layout="palette" columns={grid.columns}
        items={grid.options} value={opaque} disabled={disabled}
        onValueChange={(next, event) => { const picked = normalizeHexColor(next); if (picked) emit([...hexToHsv(picked).slice(0, 3), a] as Hsva, false, event); }} />}
      {hasControls && <div className="area-color-picker__controls" data-view={view}>
        {eyedropper && canSample && <Button variant="ghost" size="sm" iconOnly icon={<EyedropperGlyph />}
          aria-label={`Sample ${groupName.toLowerCase()} from screen`} selected={sampling} disabled={disabled} onClick={sample} />}
        {tracks && <div className="area-color-picker__tracks" dir="ltr">{tracks}</div>}
        {preview && <div className="area-color-picker__preview">
          <span className="area-color-picker__preview-new" role="img" aria-label={`New ${color}`} />
          <button type="button" className="area-color-picker__preview-original" style={{ "--_swatch-color": original } as CSSProperties}
            aria-label={`Restore original ${original}`} disabled={disabled || original === color} onClick={event => emit(hexToHsv(original), false, event)} />
        </div>}
      </div>}
      <div className="area-color-picker__values">
        <Select className="area-color-picker__model" size="sm" variant="soft" aria-label={`${groupName} color model`} value={model} disabled={disabled}
          onChange={event => chooseModel(event.target.value as ColorModel)}>
          {MODELS.map(([item, text]) => <option key={item} value={item}>{text}</option>)}
        </Select>
        <InputGroup className="area-color-picker__fields" variant="soft" size="sm" data-model={model}>
          {valueFields()}
          {alpha && model !== "css" && <NumberField className="area-color-picker__opacity" size="sm" variant="soft" aria-label={`${groupName} opacity percent`}
            min={0} max={100} step={1} fractionDigits={0} unit="%" value={Math.round(a)} disabled={disabled}
            onValueCommit={n => { if (n !== null) set(3, n); }} />}
        </InputGroup>
      </div>
      {gamutMapped && <p className="area-color-picker__note" role="status">Outside sRGB: showing the nearest color with less chroma.</p>}
    </div>
    {(swatches.length > 0 || onAddSwatch) && <div className="area-color-picker__swatches">
      <div className="area-color-picker__heading"><span>{swatchesLabel}</span>
        {onAddSwatch && <Button variant="ghost" size="sm" iconOnly icon={<AddGlyph />} aria-label={`Save ${color} to ${swatchesLabel.toLowerCase()}`}
          disabled={disabled || swatches.some(item => normalizeHexColor(item.value) === color)} onClick={() => onAddSwatch(color)} />}</div>
      {swatches.length > 0 && <ColorSwatchPicker label={`${groupName} ${swatchesLabel.toLowerCase()}`} size="md" columns={9} items={swatches} value={color} disabled={disabled}
        onValueChange={(next, event) => { const picked = normalizeHexColor(next); if (picked) emit(hexToHsv(picked), false, event); }} />}
    </div>}
    {name && <input type="hidden" name={name} value={color} disabled={disabled} />}
  </div>;
});
