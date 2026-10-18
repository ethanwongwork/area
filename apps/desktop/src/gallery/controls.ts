/**
 * The component gallery's theme controls: one entry per system-wide setting the right panel
 * offers. Each writes `data-area-<axis>` on the gallery canvas only, so the gallery's own
 * chrome keeps Area's defaults whatever the canvas shows. Add a setting by adding an entry;
 * the Inspector's Canvas section and the saved Canvas (studio.tsx restoreCanvas, which keeps only
 * values listed here) both read this list.
 */
import { AXIS_PRESETS, DEFAULT_AXES, DEFAULT_PILLS, PILL_SHAPES } from "@area/tokens/config";
export interface GalleryControl {
  axis: "theme" | "neutral" | "accent" | "ground-light" | "ground-dark" | "layers-light" | "layers-dark" | "action" | "selection" | "contrast" | "type" | "density" | "radius" | "pills" | "surface" | "elevation" | "motion";
  /**
   * Two or three options are a Segmented (Apple and Primer cap segments at 5-7); a longer list of
   * exact settings is a Select, each option naming what it sets (shadcn's radius picker is a menu).
   * The stepped Slider read as an approximate value and fit 13 marks in 60px (2026-10-03).
   * A set (several on at once) is a multi-select dropdown in the app (a group of toggle Chips in the
   * archived docs); its value is a space-separated list.
   */
  kind: "segmented" | "select" | "chips";
  label: string;
  /** What a Select's option labels mean, as its tooltip. */
  hint?: string;
  items: ReadonlyArray<{ value: string; label: string }>;
  defaultValue: string;
}

/** A named axis's presets as options, the default marked as the number settings mark theirs. */
function named(axis: "neutral" | "accent"): GalleryControl["items"] {
  return AXIS_PRESETS[axis].map(value => {
    const name = value[0]!.toUpperCase() + value.slice(1);
    return { value, label: value === DEFAULT_AXES[axis] ? `${name} (Default)` : name };
  });
}

/** A number axis's presets as options, in the registry's order (light ground from white down), the default marked
 * "(Default)" and the named ends as given. */
function numbered(axis: "ground-light" | "ground-dark" | "layers-light" | "layers-dark", names: Record<string, string>): GalleryControl["items"] {
  return AXIS_PRESETS[axis].map(value => ({ value, label: names[value] ?? (value === DEFAULT_AXES[axis] ? `${value} (Default)` : value) }));
}

export const GALLERY_CONTROLS: readonly GalleryControl[] = [
  { axis: "theme", kind: "segmented", label: "Mode", defaultValue: "light", items: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
  // The colour settings (axes/color.ts, axes/emphasis.ts), in the registry's order, their options and defaults read
  // from it. Neutral and Accent name a scale, a Select each (eleven accents); the default carries "(Default)" as the
  // number settings do. Action and Selection are two words each, a Segmented, as Mode. An accent shows on a component
  // only where Action or Selection is Accent (and in focus rings and links), which Accent's hint says.
  { axis: "neutral", kind: "select", label: "Neutral", hint: "The grey every surface, edge and text is drawn in", defaultValue: DEFAULT_AXES.neutral, items: named("neutral") },
  { axis: "accent", kind: "select", label: "Accent", hint: "Shows where Action or Selection is Accent, and in focus rings and links", defaultValue: DEFAULT_AXES.accent, items: named("accent") },
  // The Layers (axes/layers.ts, owner 2026-10-16; docs/research/layers-2026-10-16): the light and the dark page's
  // lightness, and how far cards, menus, sidebars and control fills sit from it. Numbers, as Elevation; Selects, their
  // options and defaults read from the registry. Each ground shows in its own mode.
  { axis: "ground-light", kind: "select", label: "Light ground", hint: "The light page's lightness, 100 (white) to 90", defaultValue: DEFAULT_AXES["ground-light"], items: numbered("ground-light", { "100": "100 (White)" }) },
  { axis: "ground-dark", kind: "select", label: "Dark ground", hint: "The dark page's lightness, 0 (black) to 24", defaultValue: DEFAULT_AXES["ground-dark"], items: numbered("ground-dark", { "0": "0 (Black)" }) },
  { axis: "layers-light", kind: "select", label: "Light layers", hint: "In light: how far cards, menus, sidebars and control fills sit from the page, 0 (Flat) to 8", defaultValue: DEFAULT_AXES["layers-light"], items: numbered("layers-light", { "0": "0 (Flat)" }) },
  { axis: "layers-dark", kind: "select", label: "Dark layers", hint: "In dark: how far cards, menus, sidebars and control fills sit from the page, 0 (Flat) to 8", defaultValue: DEFAULT_AXES["layers-dark"], items: numbered("layers-dark", { "0": "0 (Flat)" }) },
  { axis: "action", kind: "segmented", label: "Action", hint: "The colour of primary actions", defaultValue: DEFAULT_AXES.action, items: [{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }] },
  { axis: "selection", kind: "segmented", label: "Selection", hint: "The colour of checked, selected and current states", defaultValue: DEFAULT_AXES.selection, items: [{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }] },
  // Increased contrast (docs/CONTRAST.md): not a registry axis but the same kind of scoped setting,
  // data-area-contrast="standard", "medium" or "more". System writes no attribute, so the OS preference decides (Standard,
  // or More under Increase contrast), as it does for the app; it is the default and says so, as the number settings do.
  // Medium goes half way (owner, 2026-10-18: More "seems very extreme"; Material 3's Standard / Medium / High).
  // A Select, as Density: "Standard" needs 56 of text in a 32 segment beside the label.
  { axis: "contrast", kind: "select", label: "Contrast", hint: "System follows the OS preference; Medium and More strengthen every edge, focus and state, More to 3:1", defaultValue: "system", items: [{ value: "system", label: "System (Default)" }, { value: "standard", label: "Standard" }, { value: "medium", label: "Medium" }, { value: "more", label: "More" }] },
  // Type size and density, separate (owner, 2026-10-12; axes/type-size.ts, axes/density.ts). Five
  // two-digit sizes fit a Segmented. Density is one number since 2026-10-14 (axes/density.ts), the medium
  // Button's height at type 14, 28 / 32 / 36; a Select, as Radius is, since "36 (Comfortable)" does not fit a
  // segment beside a label in the 256 Inspector. The type bounds the density (28 up to 14, 36 from 13) and
  // the tokens resolve it, so every option stays pickable and its hint says so.
  { axis: "type", kind: "segmented", label: "Type", defaultValue: "14", items: ["12", "13", "14", "15", "16"].map(value => ({ value, label: value })) },
  { axis: "density", kind: "select", label: "Density", hint: "The medium Button's height at type 14; 28 up to type 14, 36 from type 13", defaultValue: "32", items: [
    { value: "28", label: "28 (Compact)" },
    { value: "32", label: "32 (Default)" },
    { value: "36", label: "36 (Comfortable)" },
  ] },
  // The one corner setting (axes/radius.ts): a single number, the medium Button's corner, from 0
  // (Sharp) to Pill; everything else scales off it (owner, 2026-10-04).
  { axis: "radius", kind: "select", label: "Radius", hint: "The medium Button's corner; everything scales from it", defaultValue: "8", items: ["0", "2", "4", "6", "8", "10", "12", "14", "pill"].map(value => ({
    value,
    label: value === "0" ? "0 (Sharp)" : value === "pill" ? "Pill" : value === "8" ? "8 (Default)" : value,
  })) },
  // The frame's width (axes/surface.ts, 2026-10-14): one number, 1 (Default) or 0 (Borderless, a soft shadow edge),
  // as the settings beside it are. A Select, as Elevation, though it has two options: "0 (Borderless)" does not fit a
  // segment beside a label in the 256 Inspector, and it reads as one of the column of numbers it sits in.
  { axis: "surface", kind: "select", label: "Surface", hint: "The frame's width in px; 0 draws a soft shadow edge instead", defaultValue: "1", items: [
    { value: "0", label: "0 (Borderless)" },
    { value: "1", label: "1 (Default)" },
  ] },
  // How much surfaces lift (axes/elevation.ts, owner 2026-10-14): one number, the Menu's shadow strength in percent,
  // 0 (Flat) to 8, as Radius is the medium Button's corner. A Select, as Radius: nine steps.
  { axis: "elevation", kind: "select", label: "Elevation", hint: "The Menu's shadow in %; every component's lift scales from it", defaultValue: "3", items: ["0", "1", "2", "3", "4", "5", "6", "7", "8"].map(value => ({
    value,
    label: value === "0" ? "0 (Flat)" : value === "3" ? "3 (Default)" : value,
  })) },
  // How long transitions take (axes/motion.ts, owner 2026-10-14): one number, the Menu's open in ms, 0 (None)
  // to 300 in steps of 30, 210 by default, as Elevation is the Menu's shadow. A Select, as Elevation: eleven steps.
  { axis: "motion", kind: "select", label: "Motion", hint: "The Menu's open in ms; every duration scales from it", defaultValue: "210", items: ["0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300"].map(value => ({
    value,
    label: value === "0" ? "0 (None)" : value === "210" ? "210 (Default)" : value,
  })) },
  // Which components draw a pill instead of the radius corner (axes/pills.ts), as data-area-pills.
  { axis: "pills", kind: "chips", label: "Pills", hint: "On: a pill. Off: follows Radius.", defaultValue: DEFAULT_PILLS.join(" "), items: PILL_SHAPES.map(value => ({ value, label: value === "field" ? "Fields" : value[0]!.toUpperCase() + value.slice(1) })) },
];

/** The archived docs gallery's storage key and canvas id (apps/docs reads them); the app saves its
 * Canvas under `area-desktop`.canvas (src/storage.ts). */
export const GALLERY_STORAGE_KEY = "area-gallery-theme";
export const GALLERY_CANVAS_ID = "gallery-canvas";
