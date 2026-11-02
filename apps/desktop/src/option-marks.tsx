/**
 * What each setting's option sets, drawn in its list row and, for the chosen one, in the trigger (owner, 2026-10-18:
 * "see more visibly what each change means"; docs/research/settings-pickers-2026-10-18: shadcn Create draws the chosen
 * value at the end of its setting row, tweakcn draws each preset's colours in its option).
 *
 * Colours are Area's Color swatch painted by the real token under the option's own scope, so a swatch is the colour the
 * Canvas will paint with that option (`data-area-accent="teal"` → `--area-accent-solid`), against the rest of the
 * Canvas's settings (an Action swatch takes the Canvas's accent; a ground, its neutral).
 *
 * Everything else is a glyph (owner, 2026-10-23; docs/research/theme-visuals-2026-10-23): an icon in the slot, so it
 * follows the icons' rules, one shape and the one thing the setting changes, nothing else (owner, the same day: "maybe
 * its overall too much detail applied to these icons"; the row's label already names the state or the shadow). The
 * thing that changes is exaggerated, so every step shows at 16: a token's true value (a 0.5 line, a 5% shadow) cannot
 * be seen in the slot, and the Canvas, the grid's figures and Setup show it at size. Ink, offset, tone or weight moves
 * evenly across the setting's range; 0, None and Off draw a ghost frame, Auto and System a dashed one; a lift is a hard
 * block offset under the shape, as an icon draws one. Squares keep to the icons' 13 keyline, wide marks to 14 × 11.
 */
import { useId, type ReactNode } from "react";
import { ColorSwatch } from "@area/react";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import type { CanvasAxes } from "./studio.tsx";
import { AXES } from "./tokens.ts";

type Axis = keyof CanvasAxes;

/**
 * A swatch of one token, painted under `scope`. The swatch is sized by the slot (Color swatch takes the icon keyline
 * there, color.css). Its ring outlines it on the list's ground, so the ring is the Inspector's, read on the wrapper
 * before the scope: a Dark ground swatch scoped dark drew dark's white ring in a light Inspector.
 */
const swatch = (color: string, scope: Record<string, string | undefined>) => (
  <span className="studio-mark studio-mark--host" aria-hidden="true">
    <ColorSwatch size="sm" color={color} aria-hidden="true" className="studio-mark__swatch" {...scope} />
  </span>
);

/** A literal colour as a mark: a brand's slot or shade, which no palette option paints (src/brand-settings.tsx). */
export const colourMark = (color: string) => swatch(color, {});

/** The glyph's 16 box: stroke at the icon weight, in the row's ink (option-marks.css). */
const Svg = ({ children }: { children: ReactNode }) => <svg className="studio-mark" viewBox="0 0 16 16" aria-hidden="true">{children}</svg>;
/** The square every frame glyph draws, at an ink share (1 is the row's ink). */
const Frame = ({ ink = 1, width }: { ink?: number; width?: number }) =>
  <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" strokeOpacity={ink} style={width === undefined ? undefined : { strokeWidth: `${width}px` }} />;
/** Nothing set: the frame, faint. */
const Ghost = () => <Svg><Frame ink={0.28} /></Svg>;
/** Follows something else (Auto, System): the frame, dashed. */
const Dashed = ({ wide = false }: { wide?: boolean }) =>
  <Svg>{wide ? <rect x="1.5" y="4.5" width="13" height="7" rx="2" strokeDasharray="2 1.6" strokeOpacity={0.7} /> : <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" strokeDasharray="2 1.6" strokeOpacity={0.7} />}</Svg>;

interface Box { x: number; y: number; w: number; h: number; r: number }
/**
 * A lift: the shape's outline over a block offset, spread or blurred under it, the block clipped to outside the shape so
 * the shape needs no fill and reads on any row plate.
 */
function Lift({ box, dx = 0, dy = 0, spread = 0, blur = 0, ink = 0.3, color = "currentColor" }: { box: Box; dx?: number; dy?: number; spread?: number; blur?: number; ink?: number; color?: string }) {
  const id = useId().replace(/:/g, "");
  const { x, y, w, h, r } = box;
  const outline = `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  return (
    <Svg>
      <defs>
        <clipPath id={`${id}c`}><path clipRule="evenodd" d={`M-4 -4H20V20H-4Z ${outline}`} /></clipPath>
        {blur ? <filter id={`${id}f`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={blur} /></filter> : null}
      </defs>
      {ink > 0 ? <g clipPath={`url(#${id}c)`}><rect x={x - spread + dx} y={y - spread + dy} width={w + 2 * spread} height={h + 2 * spread} rx={r + spread} fill={color} fillOpacity={ink} stroke="none" filter={blur ? `url(#${id}f)` : undefined} /></g> : null}
      <path d={outline} />
    </Svg>
  );
}
const CARD: Box = { x: 2, y: 1.5, w: 10, h: 10, r: 2.5 };
const FIELD: Box = { x: 1.5, y: 3, w: 13, h: 7, r: 2 };
/** A lift's step: none at 0, then a visible step each value up to a 4.3 drop at the top. */
const drop = (on: boolean, t: number) => on ? { dy: 0.9 + 3.4 * t, dx: (0.9 + 3.4 * t) * 0.45, ink: 0.26 + 0.26 * t } : { ink: 0 };

/** A row's plate, darker each step. */
const Plate = ({ ink, color = "currentColor" }: { ink: number; color?: string }) =>
  <Svg><rect x="1.5" y="4.5" width="13" height="7" rx="2" fill={color} fillOpacity={ink} stroke="none" /></Svg>;

/** An Easing value's move curve (`--area-ease-in-out`, the registry's), as a path across the mark's box. */
function curve(value: string) {
  const preset = AXES.find(axis => axis.id === "easing")?.presets.find(entry => entry.id === value);
  const [x1, y1, x2, y2] = (preset?.tokens["--area-ease-in-out"]?.match(/-?[\d.]+/g) ?? ["0", "0", "1", "1"]).map(Number);
  // A 16 box with a 2 margin; y grows upward, and an overshoot rises past the top, as it does on the Canvas.
  const at = (x: number, y: number) => `${2 + x! * 12} ${14 - y! * 12}`;
  return <svg className="studio-mark studio-mark--curve" viewBox="0 0 16 16" aria-hidden="true"><path d={`M${at(0, 0)} C${at(x1!, y1!)} ${at(x2!, y2!)} ${at(1, 1)}`} /></svg>;
}

/** Where a number sits in its setting's range, 0 to 1 (null for a named option). */
function share(values: readonly string[], value: string) {
  const numbers = values.map(Number).filter(n => !Number.isNaN(n));
  const n = Number(value);
  if (Number.isNaN(n) || numbers.length < 2) return null;
  const low = Math.min(...numbers), high = Math.max(...numbers);
  return high === low ? 0 : (n - low) / (high - low);
}

/** Each Pills part as itself, a pill. */
const PILL: Record<string, ReactNode> = {
  button: <rect x="1.5" y="4.5" width="13" height="7" rx="3.5" fill="currentColor" />,
  field: <rect x="1.5" y="4.5" width="13" height="7" rx="3.5" />,
  segmented: <><rect x="1" y="4.5" width="14" height="7" rx="3.5" /><rect x="2.6" y="6.1" width="5.4" height="3.8" rx="1.9" fill="currentColor" stroke="none" /></>,
  chip: <rect x="2.5" y="5" width="11" height="6" rx="3" />,
  badge: <rect x="3" y="5.5" width="10" height="5" rx="2.5" fill="currentColor" fillOpacity={0.3} stroke="none" />,
  count: <circle cx="8" cy="8" r="3.5" fill="currentColor" fillOpacity={0.3} stroke="none" />,
  switch: <><rect x="1.5" y="4.5" width="13" height="7" rx="3.5" /><circle cx="11" cy="8" r="2" fill="currentColor" stroke="none" /></>,
  avatar: <circle cx="8" cy="8" r="5.5" />,
};

/**
 * The mark for one option of one setting, or nothing where the label already is the value (Type's sizes).
 */
export function optionMark(axis: Axis, value: string, canvas: CanvasAxes): ReactNode {
  const neutral = { "data-area-neutral": canvas.neutral };
  const values = GALLERY_CONTROLS.find(control => control.axis === axis)?.items.map(item => item.value) ?? [];
  const t = share(values, value) ?? 0;
  const n = Number(value);
  switch (axis) {
    case "neutral": return swatch("var(--area-neutral-500)", { "data-area-neutral": value });
    // A colour at its own vivid shade and full saturation (owner, 2026-10-25: "why are the colors here so dark"): the menu
    // names a colour, and Shade and Saturation under it set how it is drawn. It took the Canvas's own (a saved 750 drew
    // every colour navy-deep).
    case "accent": return swatch("var(--area-accent-solid)", { "data-area-accent": value, "data-area-accent-strength": "100", "data-area-solid-light": "auto", "data-area-solid-dark": "auto" });
    // Accent strength and Solid (axes/accent.ts): the accent's solid at the option, on the Canvas's accent.
    case "accent-strength": return swatch("var(--area-accent-solid)", { "data-area-accent": canvas.accent, "data-area-accent-strength": value });
    // Label tint: the label itself, on the Canvas's accent and Light solid; Status colours: the danger fill at the strength.
    case "label-tint": return swatch("var(--area-fg-on-accent)", { "data-area-accent": canvas.accent, "data-area-accent-strength": canvas["accent-strength"], "data-area-solid-light": canvas["solid-light"], "data-area-label-tint": value });
    // Series lightness: the first series' fill at the option (axes/series.ts).
    case "series-lightness": return swatch("var(--area-series-1-fill)", { "data-area-series-lightness": value });
    case "status-colours": return swatch("var(--area-danger-solid)", { "data-area-accent-strength": canvas["accent-strength"], "data-area-status-colours": value });
    case "solid-light":
    case "solid-dark": return swatch("var(--area-accent-solid)", { "data-area-theme": axis === "solid-light" ? "light" : "dark", "data-area-accent": canvas.accent, "data-area-accent-strength": canvas["accent-strength"], [`data-area-${axis}`]: value });
    // Tint: the hue itself (Auto, Neutral's own, as the Neutral swatch); a strength, the mode's page at it, on the hue
    // chosen; Text tint, muted text's own colour at the share.
    case "tint-hue": return value === "auto" ? swatch("var(--area-neutral-500)", neutral)
      : value === "accent" ? swatch("var(--area-accent-solid)", { "data-area-accent": canvas.accent, "data-area-accent-strength": canvas["accent-strength"] })
      : swatch(`oklch(0.72 0.12 ${value})`, {});
    // Dark's own hue: Same as light draws light's.
    case "tint-hue-dark": return value === "same" ? optionMark("tint-hue", canvas["tint-hue"], canvas) : optionMark("tint-hue", value, canvas);
    case "ink-tint": return swatch("var(--area-fg-muted)", { ...neutral, "data-area-tint-hue": canvas["tint-hue"], "data-area-tint-light": canvas["tint-light"], "data-area-ink-tint": value });
    case "action": return swatch("var(--area-action-solid)", { ...neutral, "data-area-accent": canvas.accent, "data-area-action": value });
    case "selection": return swatch("var(--area-selection-solid)", { ...neutral, "data-area-accent": canvas.accent, "data-area-selection": value });
    case "ground-light": return swatch("var(--area-bg-page)", { ...neutral, "data-area-theme": "light", "data-area-ground-light": value });
    case "ground-dark": return swatch("var(--area-bg-page)", { ...neutral, "data-area-theme": "dark", "data-area-ground-dark": value });
    // Tint strength: the square filled with the hue chosen (grey at Auto hue), a firmer fill each step.
    case "tint-light":
    case "tint-dark": {
      if (value === "auto") return <Dashed />;
      const hue = canvas["tint-hue"] === "auto" ? "var(--area-neutral-500)" : canvas["tint-hue"] === "accent" ? "var(--area-accent-solid)" : `oklch(0.74 0.12 ${canvas["tint-hue"]})`;
      return <Svg><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill={hue} fillOpacity={0.06 + 0.6 * t} strokeOpacity={0.55} /></Svg>;
    }
    // Layers: a page whose sidebar strip steps further from it.
    case "layers-light":
    case "layers-dark": return <Svg><rect x="1.5" y="3" width="13" height="10" rx="2" /><path d="M2.1 3.6H6V12.4H2.1Z" fill="currentColor" fillOpacity={0.34 * t} stroke="none" /></Svg>;
    // Card tone: a card on a page, the card darker below 0 and the page darker above it (the card lighter than the page).
    case "card-tone-light":
    case "card-tone-dark": {
      if (value === "auto") return <Dashed />;
      return (
        <Svg>
          {n > 0 ? <path fillRule="evenodd" d="M3.5 3H12.5A2 2 0 0 1 14.5 5V11A2 2 0 0 1 12.5 13H3.5A2 2 0 0 1 1.5 11V5A2 2 0 0 1 3.5 3Z M5.75 5.5H10.25A1.25 1.25 0 0 1 11.5 6.75V9.25A1.25 1.25 0 0 1 10.25 10.5H5.75A1.25 1.25 0 0 1 4.5 9.25V6.75A1.25 1.25 0 0 1 5.75 5.5Z" fill="currentColor" fillOpacity={n * 0.0036} stroke="none" /> : null}
          <rect x="1.5" y="3" width="13" height="10" rx="2" />
          <rect x="4.5" y="5.5" width="7" height="5" rx="1.25" fill="currentColor" fillOpacity={n < 0 ? -n * 0.0036 : 0} strokeOpacity={0.6} />
        </Svg>
      );
    }
    // Contrast: a field's edge, firmer and heavier each step.
    case "contrast": return value === "system" ? <Dashed wide />
      : <Svg><rect x="1.5" y="4.5" width="13" height="7" rx="2" strokeOpacity={0.25 + 0.75 * t} style={{ strokeWidth: `calc(var(--area-weight-icon) * ${1 + 0.6 * t})` }} /></Svg>;
    // The medium Button's height at type 14, to scale: the tallest, 36, is 10 (the horizontal keyline's height).
    case "density": { const height = (n / 36) * 10; return <Svg><rect x="1.5" y={8 - height / 2} width="13" height={height} rx="2.5" /></Svg>; }
    // The medium Button's corner on a button-shaped mark 10 tall (the 32 Button at 10/32), Pill a stadium.
    case "radius": return <Svg><rect x="1.5" y="3" width="13" height="10" rx={value === "pill" ? 5 : (n * 10) / 32} /></Svg>;
    // Stroke width: the line at its own width (0.5 to 2 reads at 16 as it is).
    case "surface": return n === 0 ? <Ghost /> : <Svg><Frame width={n} /></Svg>;
    // Stroke strength and Hover stroke: the frame's ink, firmer each step.
    case "stroke": return n === 0 ? <Ghost /> : <Svg><Frame ink={0.12 + 0.88 * t} /></Svg>;
    case "stroke-hover": return n === 0 ? <Ghost /> : <Svg><Frame ink={0.3 + 0.7 * t} /></Svg>;
    // Selected stroke: the frame in the selected stroke, at the option's weight.
    case "selected-stroke": return <Svg><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" style={{ stroke: "var(--area-stroke-selected)", strokeWidth: `${n * 0.75 + 0.5}px` }} /></Svg>;
    // Selected tint: the selected frame, empty, tinted or grey inside.
    case "selected-tint": return <Svg><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" style={{ stroke: "var(--area-stroke-selected)", strokeWidth: "1.5px", fill: value === "tint" ? "var(--area-stroke-selected)" : value === "neutral" ? "currentColor" : "none", fillOpacity: value === "tint" ? 0.2 : 0.16 }} /></Svg>;
    // Focus ring: a field and its ring, hugging, apart, haloed, inside or heavy.
    case "focus-ring": {
      const [gap, weight, halo] = ({ hug: [0, 1.25, 0], gap: [1.5, 1.25, 0], halo: [0, 1, 2.5], inset: [-2, 1.25, 0], bold: [0, 2.2, 0] } as Record<string, number[]>)[value] ?? [0, 1.25, 0];
      const g = gap! + 0.6;
      return (
        <Svg>
          <rect x="3.5" y="4.5" width="9" height="7" rx="2" strokeOpacity={0.45} />
          {halo ? <rect x={3.5 - halo} y={4.5 - halo} width={9 + 2 * halo} height={7 + 2 * halo} rx={2 + halo} style={{ stroke: "var(--area-focus-color)", strokeOpacity: 0.3, strokeWidth: `${halo}px` }} /> : null}
          <rect x={3.5 - g} y={4.5 - g} width={9 + 2 * g} height={7 + 2 * g} rx={2 + g} style={{ stroke: "var(--area-focus-color)", strokeWidth: `${weight}px` }} />
        </Svg>
      );
    }
    // Rest shadow: the edge shadow under a surface, a firmer line each step.
    case "shadow-rest": return (
      <Svg>
        {n ? <path d={`M3.6 ${13.8 + t * 1.2}H12.4`} strokeOpacity={0.15 + 0.6 * t} style={{ strokeWidth: `calc(var(--area-weight-icon) * ${1 + t})` }} /> : null}
        <Frame />
      </Svg>
    );
    // The lifts: the shape over its drop. The row's label names which surface lifts.
    case "elevation":
    case "shadow-resting":
    case "shadow-hover": return <Lift box={CARD} {...drop(n > 0, t)} />;
    case "shadow-field": return <Lift box={FIELD} {...drop(n > 0, t)} />;
    // The shadow's details: how far it spreads, how soft it is, where the light is, its colour.
    case "shadow-size": return <Lift box={{ x: 3.5, y: 3, w: 9, h: 9, r: 2.25 }} dy={0.8} spread={0.5 + t * 2.4} blur={0.25} ink={0.2} />;
    case "shadow-softness": return <Lift box={{ x: 2.5, y: 2, w: 10, h: 10, r: 2.5 }} dx={1.2} dy={2.4} blur={0.05 + t * 1.25} ink={0.42} />;
    case "shadow-light": return <Lift box={{ x: 3, y: 2.5, w: 10, h: 10, r: 2.5 }} dy={t * 3} spread={1.4 * (1 - t)} blur={0.3} ink={0.32} />;
    case "shadow-color": return <Lift box={CARD} dx={1.5} dy={3} blur={0.3} ink={value === "black" ? 0.4 : 0.75} color={value === "warm" ? "oklch(0.6 0.13 55)" : value === "cool" ? "oklch(0.6 0.12 250)" : "currentColor"} />;
    // The fills: a row's plate, firmer each step, each from where its state starts.
    case "fill-hover": return <Plate ink={0.06 + 0.07 * n} />;
    case "fill-selected": return <Plate ink={0.13 + 0.06 * n} />;
    case "fill-pressed": return <Plate ink={0.12 + 0.09 * n} />;
    // Danger hover: the row's plate, red at Tint, the neutral grey at Neutral.
    case "danger-hover": return value === "tint" ? <Plate ink={0.22} color="var(--area-danger-solid)" /> : <Plate ink={0.12} />;
    case "pills": return PILL[value] ? <Svg>{PILL[value]}</Svg> : null;
    case "motion": {
      // The Menu's open as a share of the longest, 300 ms; 0 (None) is an empty ring.
      const f = n / 300, a = f * 2 * Math.PI - Math.PI / 2;
      return (
        <Svg>
          <circle cx="8" cy="8" r="6" />
          {f >= 1 ? <circle cx="8" cy="8" r="6" fill="currentColor" /> : f > 0 ? <path d={`M8 8V2A6 6 0 ${f > 0.5 ? 1 : 0} 1 ${(8 + 6 * Math.cos(a)).toFixed(2)} ${(8 + 6 * Math.sin(a)).toFixed(2)}Z`} fill="currentColor" stroke="none" /> : null}
        </Svg>
      );
    }
    case "easing": return curve(value);
    default: return null;
  }
}

/** The grain's dots, fixed so a step only adds dots. */
const NOISE = Array.from({ length: 40 }, (_, i) => [3.4 + ((i * 37) % 97) / 97 * 9.2, 3.4 + ((i * 61 + 13) % 89) / 89 * 9.2] as const);
function Blurred({ blur, children }: { blur: number; children: ReactNode }) {
  const id = useId().replace(/:/g, "");
  return <><defs><filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={blur} /></filter></defs><g filter={`url(#${id})`}>{children}</g></>;
}
function Clipped({ children }: { children: ReactNode }) {
  const id = useId().replace(/:/g, "");
  return <><defs><clipPath id={id}><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" /></clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></>;
}
function Gradient({ id, stops, radial = false }: { id: string; stops: Array<[number, string, number]>; radial?: boolean }) {
  const inner = stops.map(([offset, color, opacity]) => <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />);
  return radial ? <radialGradient id={id} cx=".5" cy="0" r=".9">{inner}</radialGradient> : <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{inner}</linearGradient>;
}
function MaterialLook({ value }: { value: string }) {
  const id = useId().replace(/:/g, "");
  switch (value) {
    case "glass": return <Svg><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="currentColor" fillOpacity={0.07} strokeOpacity={0.6} /><path d="M5 12 12 5" strokeOpacity={0.55} /></Svg>;
    case "tactile": return <Svg><Frame /><path d="M4.2 11.6H11.8" strokeOpacity={0.45} style={{ strokeWidth: "calc(var(--area-weight-icon) * 1.8)" }} /></Svg>;
    case "jelly": return <Svg><rect x="2.5" y="2.5" width="11" height="11" rx="4.5" /><ellipse cx="8" cy="5.6" rx="3.4" ry="1.4" fill="currentColor" fillOpacity={0.22} stroke="none" /></Svg>;
    case "soft": return <Lift box={{ x: 2.5, y: 2.5, w: 11, h: 11, r: 2.5 }} dy={1.2} spread={0.6} blur={1.1} ink={0.35} />;
    case "aero": return <Svg><defs><Gradient id={id} stops={[[0, "currentColor", 0.26], [0.5, "currentColor", 0.04], [1, "currentColor", 0.12]]} /></defs><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill={`url(#${id})`} /></Svg>;
    case "glow": return <Lift box={{ x: 3, y: 3, w: 10, h: 10, r: 2.5 }} spread={1.3} blur={1} ink={0.6} color="var(--area-accent-solid)" />;
    default: return <Svg><Frame /></Svg>;
  }
}
function LeverMark({ lever, value }: { lever: string; value: string }) {
  const id = useId().replace(/:/g, "");
  const n = Number(value), t = n / 8;
  if (lever === "angle") {
    const a = (n - 90) * Math.PI / 180, x = 8 + 5.8 * Math.cos(a), y = 8 + 5.8 * Math.sin(a);
    return <Svg><circle cx="8" cy="8" r="5.8" strokeOpacity={0.3} /><circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.7" fill="currentColor" stroke="none" /></Svg>;
  }
  if (n === 0 && lever !== "grain") return <Ghost />;
  switch (lever) {
    case "gradient": return <Svg><defs><Gradient id={id} stops={[[0, "currentColor", 0], [1, "currentColor", 0.08 + 0.5 * t]]} /></defs><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill={`url(#${id})`} /></Svg>;
    case "sheen": return <Svg><Frame /><path d="M5 12 12 5" strokeOpacity={0.15 + 0.7 * t} /></Svg>;
    // See-through: the checker behind shows more each step.
    case "transparency": return <Svg><defs><pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse"><rect width="1.5" height="1.5" fill="currentColor" /><rect x="1.5" y="1.5" width="1.5" height="1.5" fill="currentColor" /></pattern></defs><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill={`url(#${id})`} fillOpacity={0.45 * t} stroke="none" /><Frame /></Svg>;
    case "frost": return <Svg><Frame /><Blurred blur={0.2 + 0.9 * t}><circle cx="8" cy="8" r="2.2" fill="currentColor" fillOpacity={0.6} stroke="none" /></Blurred></Svg>;
    case "stroke": return <Svg><Frame ink={0.28} /><path d="M2.5 7V5A2.5 2.5 0 0 1 5 2.5H11A2.5 2.5 0 0 1 13.5 5V7" strokeOpacity={0.2 + 0.8 * t} style={{ strokeWidth: "calc(var(--area-weight-icon) * 1.35)" }} /></Svg>;
    case "inner": return <Svg><Clipped><path d="M2 2H14V4.6H4.6V14H2Z" fill="currentColor" fillOpacity={0.45 * t} stroke="none" /></Clipped><Frame /></Svg>;
    case "softness": return <Svg><Clipped><Blurred blur={0.05 + 1.3 * t}><path d="M2 2H14V4.6H4.6V14H2Z" fill="currentColor" fillOpacity={0.4} stroke="none" /></Blurred></Clipped><Frame /></Svg>;
    case "catch": return <Svg><Frame /><path d="M4.6 11.4H11.4" strokeOpacity={0.2 + 0.8 * t} /></Svg>;
    case "emboss": return <Svg><path d="M4 14.6H12.2A2.4 2.4 0 0 0 14.6 12.2V4" strokeOpacity={0.2 + 0.6 * t} style={{ strokeWidth: `calc(var(--area-weight-icon) * ${1 + 0.8 * t})` }} /><Frame /></Svg>;
    case "contact": return <Svg><Blurred blur={0.45}><ellipse cx="8" cy="13.6" rx="5.4" ry="1.3" fill="currentColor" fillOpacity={0.55 * t} stroke="none" /></Blurred><rect x="2.5" y="1.5" width="11" height="10" rx="2.5" /></Svg>;
    case "glow": return <Lift box={{ x: 3, y: 3, w: 10, h: 10, r: 2.5 }} spread={0.6 + 1.2 * t} blur={0.9} ink={0.2 + 0.55 * t} color="var(--area-accent-solid)" />;
    case "grain": return <Svg><Frame />{NOISE.slice(0, Math.round(40 * t)).map(([x, y], i) => <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r=".42" fill="currentColor" fillOpacity={0.6} stroke="none" />)}</Svg>;
    case "page-glow": return <Svg><defs><Gradient id={id} radial stops={[[0, "var(--area-accent-solid)", 0.75 * t], [1, "var(--area-accent-solid)", 0]]} /></defs><rect x="1.5" y="3" width="13" height="10" rx="2" fill={`url(#${id})`} /></Svg>;
    default: return <Svg><Frame /></Svg>;
  }
}

/** Material's marks (src/material.ts): a look as a treatment of the square, a lever as the one thing it moves. */
export function materialMark(key: "bundle" | string, value: string): ReactNode {
  return key === "bundle" ? <MaterialLook value={value} /> : <LeverMark lever={key} value={value} />;
}
