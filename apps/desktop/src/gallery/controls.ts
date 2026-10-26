/**
 * The component gallery's theme controls: one entry per system-wide setting the right panel
 * offers. Each writes `data-area-<axis>` on the gallery canvas only, so the gallery's own
 * chrome keeps Area's defaults whatever the canvas shows. Add a setting by adding an entry;
 * the Inspector's Canvas section and the saved Canvas (studio.tsx restoreCanvas, which keeps only
 * values listed here) both read this list.
 */
import { AXIS_PRESETS, DEFAULT_AXES, DEFAULT_PILLS, PILL_SHAPES, SETTING_GROUPS, SETTINGS, settingLabel } from "@area/tokens/config";
import TOKENS from "@area/tokens/tokens.json";
/** Edge and Depth's controls besides Stroke width (Surface) and Shadow (Elevation) (@area/tokens axes/depth.ts), and the
 * interaction states (axes/states.ts), each one `data-area-<axis>`. */
export const DEPTH_LEVER_AXES = ["stroke", "shadow-resting", "shadow-field", "shadow-size", "shadow-softness", "shadow-light", "shadow-color",
  // The interaction states (axes/states.ts, depth.ts; owner 2026-10-21), read from the registry the same way.
  "stroke-hover", "selected-stroke", "focus-ring", "shadow-hover", "fill-hover", "fill-selected", "fill-pressed", "selected-tint", "danger-hover"] as const;
export type DepthLever = (typeof DEPTH_LEVER_AXES)[number];

export interface GalleryControl {
  axis: "theme" | "neutral" | "tint-hue" | "tint-light" | "tint-dark" | "ink-tint" | "accent" | "accent-strength" | "solid-light" | "solid-dark" | "label-tint" | "status-colours" | "ground-light" | "ground-dark" | "layers-light" | "layers-dark" | "card-tone-light" | "card-tone-dark" | "action" | "selection" | "contrast" | "type" | "density" | "radius" | "pills" | "surface" | "shadow-rest" | "elevation" | "motion" | "easing" | "feedback" | DepthLever;
  /**
   * Named choices are a Segmented (Apple and Primer cap segments at 5-7); an ordered range is a bar, Slider's field
   * variant with its exact value inside it (owner, 2026-10-24), which answers the stepped Slider's old fault of reading as
   * an approximate value (2026-10-03). A set (several on at once) is a multi-select dropdown; its value is a
   * space-separated list. Select remains for a long list of names.
   */
  kind: "segmented" | "select" | "chips" | "bar";
  label: string;
  /** What a Select's option labels mean, as its tooltip. */
  hint?: string;
  /** Every value the setting takes, each named as the Inspector shows it (a bar's in its unit: "60%", "8px", "210ms"). */
  items: ReadonlyArray<{ value: string; label: string }>;
  defaultValue: string;
  /**
   * A bar (owner, 2026-10-24: "i like the 0 to 100 scale, as well as binary toggles"): Slider's bar with its label inside, over the
   * values in `scale`, in order, its readout the value's label. `named` are the choices off the scale (Auto, Accent,
   * System), a Segmented with Custom beside them; the bar shows while the value is on the scale, and Custom picks `custom`.
   */
  scale?: readonly string[];
  named?: ReadonlyArray<{ value: string; label: string }>;
  custom?: string;
  /** A bar under its named choices names what it sets, in a word (Hue, Strength), since the row above names the setting. */
  barLabel?: string;
  /**
   * Why the setting changes nothing under the others, or null (owner, 2026-10-24: "some of the axises i cant tell what im
   * even updating"): the Inspector dims the row and says so, as Button shade while Buttons and Selection are Neutral.
   */
  inactive?: (values: Readonly<Record<string, string>>, mode: "light" | "dark") => string | null;
}

/** Whether the greys carry any colour: a temperature, a tint colour, or a tint strength on Neutral's own hue. */
export const greysTinted = (values: Readonly<Record<string, string>>, mode: "light" | "dark") =>
  values.neutral !== "neutral" || values["tint-hue"] !== "auto" || !["auto", "0"].includes(values[`tint-${mode}`] ?? "auto");
const accentShows = (values: Readonly<Record<string, string>>) => values.action === "accent" || values.selection === "accent";
/** The dependencies the Inspector shows (docs/research/theme-review-2026-10-23, axis review "Say when a setting has no effect"). */
const INACTIVE: Partial<Record<string, GalleryControl["inactive"]>> = {
  "ink-tint": (values, mode) => greysTinted(values, mode) ? null : "No effect while the greys are neutral",
  "solid-light": values => accentShows(values) ? null : "Shows only while Buttons or Selection is Accent",
  "solid-dark": values => accentShows(values) ? null : "Shows only while Buttons or Selection is Accent",
  "label-tint": values => values.action === "accent" || values.selection === "accent" ? null : "Shows only while Buttons or Selection is Accent",
  "status-colours": values => values["accent-strength"] === "100" ? "No effect at Saturation 100%" : null,
  "shadow-color": (_, mode) => mode === "dark" ? "Dark shadows are always black" : null,
  "stroke-hover": values => values.stroke === "0" ? "No effect while Edge contrast is 0%" : null,
};

/** The heading a setting sits under (the registry's SETTING_GROUPS). */
export const headingOf = (axis: string) => SETTING_GROUPS.find(group => group.settings.includes(axis))?.heading ?? "";
/**
 * A setting's name, the registry's (owner, 2026-10-19: "i want the axises to be the source of truth"), under its heading
 * without the heading's word: Stroke width reads Width under Stroke, Floating shadow Floating under Shadow.
 */
const label = (axis: string) => settingLabel((SETTINGS[axis]?.label ?? axis).replace(/^(Light|Dark) (\w)/, (_, __, first: string) => first.toUpperCase()), headingOf(axis));

/*
 * Values as people read them (owner, 2026-10-24: "i dont particularly like the naming convention of numbers"): a share
 * in %, a length in px, a duration in ms, a hue in °, never the step's index. The ends that have a name keep it.
 */
const percent = (value: string, steps: number) => `${Math.round((Number(value) / steps) * 100)}%`;
const signedPercent = (value: string, steps: number) => Number(value) === 0 ? "Page" : `${Number(value) > 0 ? "+" : "−"}${Math.round((Math.abs(Number(value)) / steps) * 100)}%`;
/** A bar over a number axis's presets, low to high, each labelled by `say`; `named` are the presets off the scale. */
function bar(axis: GalleryControl["axis"], say: (value: string) => string, options: { hint?: string; named?: Record<string, string>; custom?: string; barLabel?: string; defaultValue?: string } = {}): GalleryControl {
  const all = axis === "contrast" ? ["system", ...Array.from({ length: 33 }, (_, quarter) => String(quarter / 4))] : [...AXIS_PRESETS[axis as keyof typeof AXIS_PRESETS] as readonly string[]];
  const named = options.named ?? {};
  const scale = all.filter(value => !(value in named)).sort((a, b) => order(a) - order(b));
  return {
    axis, kind: "bar", label: label(axis), hint: options.hint,
    defaultValue: options.defaultValue ?? (axis === "contrast" ? "system" : DEFAULT_AXES[axis as keyof typeof DEFAULT_AXES] as string),
    items: [...Object.entries(named).map(([value, text]) => ({ value, label: text })), ...scale.map(value => ({ value, label: say(value) }))],
    scale, named: Object.entries(named).map(([value, text]) => ({ value, label: text })), custom: options.custom, barLabel: options.barLabel,
  };
}
/** Where a preset sits on its bar: a number, a hue for a named accent, and Pill past every corner. */
const ACCENT_HUE: Record<string, number> = Object.fromEntries(((TOKENS.axes as unknown as Array<{ id: string; presets: Array<{ id: string; tokens: Record<string, string> }> }>).find(axis => axis.id === "accent")?.presets ?? [])
  .map(preset => [preset.id, Number(preset.tokens["--area-accent-hue"] ?? preset.id)]));
const order = (value: string) => value === "pill" ? Infinity : /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : ACCENT_HUE[value] ?? 0;
const title = (value: string) => value[0]!.toUpperCase() + value.slice(1);
/** A Solid step as a depth: the palette's 200 (lightest, since the label flips with the shade, 2026-10-25) to 850 (deepest). */
const depth = (value: string) => value === "200" ? "Lightest" : value === "850" ? "Deepest" : percent(String(Number(value) - 200), 650);


export const GALLERY_CONTROLS: readonly GalleryControl[] = ([
  // Page: the mode, the page and its greys, how far layers and cards sit from it. A light/dark pair shows in its own mode.
  { axis: "theme", kind: "segmented", label: label("theme"), defaultValue: "light", items: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
  bar("ground-light", value => value === "100" ? "White" : `${value}%`, { hint: "The light page's lightness" }),
  bar("ground-dark", value => value === "0" ? "Black" : `${value}%`, { hint: "The dark page's lightness" }),
  { axis: "neutral", kind: "segmented", label: label("neutral"), hint: "The grey every surface, edge and text is drawn in", defaultValue: DEFAULT_AXES.neutral, items: AXIS_PRESETS.neutral.map(value => ({ value, label: title(value) })) },
  bar("tint-hue", value => `${value}°`, { hint: "The hue the greys lean toward: the Grey setting's own, the accent's, or any hue", named: { auto: "Grey", accent: "Accent" }, custom: "60", barLabel: "Hue" }),
  bar("tint-light", value => percent(value, 16), { hint: "In light: how strongly the greys take the hue", named: { auto: "Auto" }, custom: "4", barLabel: "Strength" }),
  bar("tint-dark", value => percent(value, 16), { hint: "In dark: how strongly the greys take the hue", named: { auto: "Auto" }, custom: "4", barLabel: "Strength" }),
  bar("ink-tint", value => percent(value, 4), { hint: "How much of the greys' colour body and muted text take" }),
  bar("layers-light", value => value === "0" ? "Flat" : percent(value, 8), { hint: "In light: how far cards, menus, sidebars and control fills sit from the page" }),
  bar("layers-dark", value => value === "0" ? "Flat" : percent(value, 8), { hint: "In dark: how far cards, menus, sidebars and control fills sit from the page" }),
  bar("card-tone-light", value => signedPercent(value, 4), { hint: "In light: cards against the page, darker or lighter", named: { auto: "Auto" }, custom: "0", barLabel: "Shade" }),
  bar("card-tone-dark", value => signedPercent(value, 4), { hint: "In dark: cards against the page, darker or lighter", named: { auto: "Auto" }, custom: "0", barLabel: "Shade" }),
  // Accent: one hue bar through the palette's eleven (each at its own hue) and every 5°, then how much colour it keeps,
  // how deep its buttons sit and how much of it their label takes.
  bar("accent", value => /^\d+$/.test(value) ? `${value}°` : title(value), { hint: "The accent's hue: the palette's eleven by name, any other in 5° steps" }),
  bar("accent-strength", value => `${value}%`, { hint: "How much of its own colour the accent keeps; hue and contrast hold" }),
  bar("solid-light", value => depth(value), { hint: "How light or deep accent buttons and checked marks are; their label always stays readable", named: { auto: "Auto" }, custom: "600", barLabel: "Depth" }),
  bar("solid-dark", value => depth(value), { hint: "How light or deep accent buttons and checked marks are; their label always stays readable", named: { auto: "Auto" }, custom: "600", barLabel: "Depth" }),
  bar("label-tint", value => percent(value, 4), { hint: "How much of the accent's colour the text on an accent button takes; it stays readable" }),
  // Where it paints: the accent on buttons and on selection, the status tones, and the accessibility level.
  { axis: "action", kind: "segmented", label: label("action"), hint: "The colour of primary buttons", defaultValue: DEFAULT_AXES.action, items: [{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }] },
  { axis: "selection", kind: "segmented", label: label("selection"), hint: "The colour of checked, selected and current states", defaultValue: DEFAULT_AXES.selection, items: [{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }] },
  { axis: "status-colours", kind: "segmented", label: label("status-colours"), hint: "Red, amber, green and blue messages and badges: in their full colour, or muted to the accent's Saturation", defaultValue: DEFAULT_AXES["status-colours"], items: [{ value: "fixed", label: "Vivid" }, { value: "match", label: "Muted" }] },
  // Increased contrast (docs/CONTRAST.md): a scoped setting, not an axis. System writes no attribute, so the OS decides.
  bar("contrast", value => percent(value, 8), { hint: "Stronger edges, focus and state; System follows the OS", named: { system: "System" }, custom: "4", barLabel: "Level" }),
  // Size: whole px for text (half px blurs), density by name.
  { axis: "type", kind: "segmented", label: label("type"), defaultValue: DEFAULT_AXES.type, items: ["12", "13", "14", "15", "16"].map(value => ({ value, label: value })) },
  { axis: "density", kind: "segmented", label: label("density"), hint: "28 up to type 14, 36 from type 13", defaultValue: DEFAULT_AXES.density, items: [
    { value: "28", label: "Compact" }, { value: "32", label: "Default" }, { value: "36", label: "Comfy" },
  ] },
  // Shape: the medium Button's corner in px, Pill past the last.
  bar("radius", value => value === "pill" ? "Pill" : `${value}px`, { hint: "The medium Button's corner; every corner scales from it" }),
  { axis: "pills", kind: "chips", label: label("pills"), hint: "On: a pill. Off: follows Corner.", defaultValue: DEFAULT_PILLS.join(" "), items: PILL_SHAPES.map(value => ({ value, label: value === "field" ? "Fields" : title(value) })) },
  // Stroke and Shadow: lengths in px, strengths as a share of the strongest.
  bar("surface", value => `${value}px`, { hint: "The line round cards, panels and floating surfaces" }),
  bar("stroke", value => percent(value, 8), { hint: "How dark every edge is against its ground" }),
  bar("elevation", value => percent(value, 8), { hint: "Menus, popovers, tooltips and dialogs" }),
  bar("shadow-resting", value => percent(value, 8), { hint: "Cards, panels and raised thumbs at rest" }),
  bar("shadow-field", value => percent(value, 8), { hint: "Outline fields, select triggers, outline and soft buttons" }),
  bar("shadow-rest", value => percent(value, 8), { hint: "A soft edge round surfaces at rest, with the line or instead of it" }),
  bar("shadow-size", value => percent(value, 8), { hint: "How far every shadow reaches" }),
  bar("shadow-softness", value => percent(value, 8), { hint: "One crisp layer to several soft ones" }),
  bar("shadow-light", value => percent(value, 4), { hint: "A lip under each lifted edge and a highlight inside its top" }),
  { axis: "shadow-color", kind: "segmented", label: label("shadow-color"), hint: "The light theme's shadow tint; dark stays black", defaultValue: DEFAULT_AXES["shadow-color"], items: AXIS_PRESETS["shadow-color"].map(value => ({ value, label: title(value) })) },
  // States: hover, selected and pressed, then focus and the destructive row.
  bar("fill-hover", value => percent(value, 4), { hint: "The plate under a hovered row or ghost control" }),
  bar("stroke-hover", value => percent(value, 4), { hint: "How far a control's edge darkens under the pointer" }),
  bar("shadow-hover", value => percent(value, 8), { hint: "How much a hovered card or tile lifts" }),
  bar("fill-selected", value => value === "0" ? "As hover" : percent(value, 4), { hint: "How much firmer a selected row's plate is than hover" }),
  { axis: "selected-stroke", kind: "segmented", label: label("selected-stroke"), hint: "A selected card's or tile's edge, drawn inside", defaultValue: DEFAULT_AXES["selected-stroke"], items: AXIS_PRESETS["selected-stroke"].map(value => ({ value, label: `${value}px` })) },
  { axis: "selected-tint", kind: "segmented", label: label("selected-tint"), hint: "A selected card's fill under its edge", defaultValue: DEFAULT_AXES["selected-tint"], items: [{ value: "none", label: "None" }, { value: "tint", label: "Accent" }, { value: "neutral", label: "Grey" }] },
  bar("fill-pressed", value => percent(value, 4), { hint: "How far a press moves past selected" }),
  { axis: "focus-ring", kind: "segmented", label: label("focus-ring"), hint: "Where the keyboard ring sits", defaultValue: DEFAULT_AXES["focus-ring"], items: AXIS_PRESETS["focus-ring"].map(value => ({ value, label: title(value) })) },
  { axis: "danger-hover", kind: "segmented", label: label("danger-hover"), hint: "A destructive row's hover plate", defaultValue: DEFAULT_AXES["danger-hover"], items: [{ value: "tint", label: "Red" }, { value: "neutral", label: "Grey" }] },
  // Effects: the Menu's open in ms, and the shape of every transition.
  bar("motion", value => value === "0" ? "Off" : `${value}ms`, { hint: "The Menu's open; every duration scales from it" }),
  { axis: "easing", kind: "select", label: label("easing"), hint: "The shape of every transition: how it speeds up and settles", defaultValue: DEFAULT_AXES.easing, items: AXIS_PRESETS.easing.map(value => ({ value, label: title(value) })) },
  // How a control answers the pointer (axes/feedback.ts, 2026-10-24): hover's fade-in, a press's arrival and its give.
  { axis: "feedback", kind: "segmented", label: label("feedback"), hint: "How a control answers the pointer: hover fades in, a press gives a little", defaultValue: DEFAULT_AXES.feedback, items: AXIS_PRESETS.feedback.map(value => ({ value, label: title(value) })) },
] satisfies GalleryControl[]).map(control => INACTIVE[control.axis] ? { ...control, inactive: INACTIVE[control.axis] } : control);

/** The archived docs gallery's storage key and canvas id (apps/docs reads them); the app saves its
 * Canvas under `area-desktop`.canvas (src/storage.ts). */
export const GALLERY_STORAGE_KEY = "area-gallery-theme";
export const GALLERY_CANVAS_ID = "gallery-canvas";
