/**
 * The Theme tab's settings and what each preset tile is scoped to, shared by its Browse view (theme.tsx) and its Setup
 * flow (theme-setup.tsx), so both show the Inspector's own settings, labels, options and defaults.
 */
import { AXES } from "../tokens.ts";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { SETTING_GROUPS, SETTINGS as REGISTRY } from "@area/tokens/config";

/*
 * Attributes each preset tile carries beyond its own axis, so the setting shows and nothing else does (owner,
 * 2026-10-19: "fix the visuals for stroke and shadow to be more custom tailored to each axis/variable that is changed
 * and make sure its visible"): an accent only reaches a component through action and selection set to accent; a stroke
 * or shadow setting turns off the other strokes and shadows on its surface, and the shared shadow settings (size,
 * softness, light, colour) draw on the Floating shadow at its strongest, 8, where their change is large enough to see.
 */
const NO_SHADOW = { "data-area-shadow-rest": "0", "data-area-shadow-resting": "0", "data-area-shadow-field": "0" };
const SHARED_SHADOW = { "data-area-elevation": "8" };
export const ALSO: Record<string, Record<string, string>> = {
  accent: { "data-area-action": "accent", "data-area-selection": "accent" },
  // Accent strength and Solid show on the accent's own paint (axes/accent.ts).
  "accent-strength": { "data-area-action": "accent", "data-area-selection": "accent" },
  "solid-light": { "data-area-action": "accent", "data-area-selection": "accent" },
  "solid-dark": { "data-area-action": "accent", "data-area-selection": "accent" },
  // Label tint shows on a deep solid (a bright one leaves no room); Status colours on a quieted accent.
  "label-tint": { "data-area-action": "accent", "data-area-solid-light": "750", "data-area-solid-dark": "750" },
  "status-colours": { "data-area-accent-strength": "50" },
  neutral: { "data-area-layers-light": "100", "data-area-layers-dark": "100" },
  // Tint: a hue shows at a strength, a strength on a hue, and Text tint on both at their strongest (axes/tint.ts).
  "tint-hue": { "data-area-tint-light": "38", "data-area-tint-dark": "38" },
  "tint-hue-dark": { "data-area-tint-dark": "38" },
  "tint-light": { "data-area-tint-hue": "70" },
  "tint-dark": { "data-area-tint-hue": "70" },
  "ink-tint": { "data-area-tint-hue": "70", "data-area-tint-light": "50", "data-area-tint-dark": "50" },
  surface: NO_SHADOW,
  stroke: NO_SHADOW,
  // A preset's own attribute is written last (scopeOf), so it wins over NO_SHADOW's 0.
  "shadow-rest": { ...NO_SHADOW, "data-area-surface": "0" },
  "shadow-resting": { ...NO_SHADOW, "data-area-surface": "0" },
  "shadow-field": { "data-area-shadow-rest": "0", "data-area-shadow-resting": "0" },
  "shadow-size": SHARED_SHADOW,
  "shadow-softness": SHARED_SHADOW,
  "shadow-light": SHARED_SHADOW,
  "shadow-color": SHARED_SHADOW,
  // Hover shadow: the lift alone on its card.
  "shadow-hover": { ...NO_SHADOW, "data-area-surface": "0" },
  easing: { "data-area-motion": "300" },
};

/*
 * Light and dark (owner, 2026-10-19: "dark mode should be automatic? or handled separately but more cohesively ... show
 * that we also have dark mode but keep everything here just for light mode"): the page previews one theme, Light by
 * default, with Dark one switch away in the Canvas bar; every setting's tiles follow it, the accents included. The
 * settings that exist once per theme (the ground and the layers) show the previewed theme's own, so Light shows Light
 * ground and Light layers, Dark their dark pair. The Theme setting's tiles always show both.
 */
export type Mode = "light" | "dark";
/** A preset's least card width (owner, 2026-10-19: "the minimum size of the containers can be smaller"; was 280). */
export const MIN = 200; /* pick */
// Ground, Layers, Tint strength, Card tone and Solid exist once per theme; Shadow light's "-light" is not a theme (it hid in Dark until 2026-10-19).
export const PER_THEME = /^(ground|layers|tint|card-tone|solid)-(light|dark)$/;
/** Tint hue is light's and Dark tint hue dark's (2026-10-27): a pair whose light member has no suffix. */
const HUE_PAIR: Readonly<Record<Mode, string>> = { light: "tint-hue", dark: "tint-hue-dark" };
/** The theme a setting belongs to, or null for one that applies to both. */
export const modeOfSetting = (id: string): Mode | null =>
  PER_THEME.test(id) ? (id.endsWith("-dark") ? "dark" : "light") : id === HUE_PAIR.light ? "light" : id === HUE_PAIR.dark ? "dark" : null;
export const inMode = (id: string, mode: Mode) => { const own = modeOfSetting(id); return own === null || own === mode; };

/*
 * The settings: the Inspector's own list (src/gallery/controls.ts), its labels, options, order and defaults, so Theme
 * always shows what the Inspector sets (owner, 2026-10-19: "make sure everything in language reflects the updated axises
 * and controls"); the registry's sentence where an axis has one. Contrast and Pills are scoped settings outside the
 * registry; Pills is a set, one tile per shape, the shapes on by default marked so.
 */
export interface Setting {
  id: string;
  /** The heading it sits under, as in the Inspector. */
  heading: string;
  /** Its name under the heading (the Sidebar's row, the Inspector's), and its whole name (the Canvas section's title). */
  label: string;
  title: string;
  /** Its whole name with its theme ("Light ground"), for a list of both themes' settings (Setup). */
  name: string;
  description: string;
  presets: Array<{ id: string; label: string }>;
  defaults: string[];
}
// The page previews one theme, so its ground and layers are just Ground and Layers (owner, 2026-10-19: "just say
// layers and ground not light"); the Inspector, which sets both themes, keeps Light and Dark.
export const oneTheme = (label: string) => label.replace(/^(Light|Dark) (\w)/, (_, __, first: string) => first.toUpperCase());
export const SETTINGS: Setting[] = SETTING_GROUPS.flatMap(group => group.settings.map(id => {
  const control = GALLERY_CONTROLS.find(entry => entry.axis === id)!;
  return {
    id,
    heading: group.heading,
    label: oneTheme(control.label),
    title: oneTheme(REGISTRY[id]?.label ?? control.label),
    name: REGISTRY[id]?.label ?? control.label,
    description: REGISTRY[id]?.description ?? control.hint ?? "",
    // A setting with every position draws its marks (controls.ts `marks`), not 101 tiles.
    presets: control.items.filter(item => !control.marks || control.marks.includes(item.value)).map(item => ({ id: item.value, label: item.label })),
    defaults: control.kind === "chips" ? control.defaultValue.split(" ") : [control.defaultValue],
  };
}));
/** The custom properties a preset writes (the registry's tokens); Contrast and Pills are scoped settings with none. */
export const writes = (setting: Setting, preset?: string) => {
  const axis = AXES.find(entry => entry.id === setting.id);
  const tokens = axis?.presets.find(entry => entry.id === (preset ?? axis.defaultPreset))?.tokens ?? {};
  return Object.entries(tokens);
};
export const isDefault = (setting: Setting, preset: string) => setting.defaults.includes(preset);
/** What a preset's tile is scoped to: its attribute (System contrast writes none), and what the setting needs to show. */
export const scopeOf = (setting: Setting, preset: string): Record<string, string> =>
  setting.id === "contrast" && preset === "system" ? {} : { ...ALSO[setting.id], [`data-area-${setting.id}`]: preset };
export const attributeOf = (setting: Setting, preset?: string) => setting.id === "contrast" && preset === "system"
  ? "no attribute (the OS decides)" : `data-area-${setting.id}${preset ? `="${preset}"` : ""}`;

