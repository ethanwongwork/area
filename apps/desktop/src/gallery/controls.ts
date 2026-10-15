/**
 * The component gallery's theme controls: one entry per system-wide setting the right panel
 * offers. Each writes `data-area-<axis>` on the gallery canvas only, so the gallery's own
 * chrome keeps Area's defaults whatever the canvas shows. Add a setting by adding an entry;
 * the Inspector's Canvas section and the saved Canvas (studio.tsx restoreCanvas, which keeps only
 * values listed here) both read this list.
 */
import { AXIS_PRESETS, DEFAULT_AXES, DEFAULT_PILLS, PILL_SHAPES } from "@area/tokens/config";
export interface GalleryControl {
  axis: "theme" | "neutral" | "accent" | "action" | "selection" | "contrast" | "type" | "density" | "radius" | "pills" | "surface" | "elevation" | "motion";
  /**
   * Two or three options are a Segmented (Apple and Primer cap segments at 5-7); a longer list of
   * exact settings is a Select, each option naming what it sets (shadcn's radius picker is a menu).
   * The stepped Slider read as an approximate value and fit 13 marks in 60px (2026-10-03).
   * A set (several on at once) is a group of toggle Chips; its value is a space-separated list.
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

export const GALLERY_CONTROLS: readonly GalleryControl[] = [
  { axis: "theme", kind: "segmented", label: "Mode", defaultValue: "light", items: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
  // The colour settings (axes/color.ts, axes/emphasis.ts), in the registry's order, their options and defaults read
  // from it. Neutral and Accent name a scale, a Select each (eleven accents); the default carries "(Default)" as the
  // number settings do. Action and Selection are two words each, a Segmented, as Mode. An accent shows on a component
  // only where Action or Selection is Accent (and in focus rings and links), which Accent's hint says.
  { axis: "neutral", kind: "select", label: "Neutral", hint: "The grey every surface, edge and text is drawn in", defaultValue: DEFAULT_AXES.neutral, items: named("neutral") },
  { axis: "accent", kind: "select", label: "Accent", hint: "Shows where Action or Selection is Accent, and in focus rings and links", defaultValue: DEFAULT_AXES.accent, items: named("accent") },
  { axis: "action", kind: "segmented", label: "Action", hint: "The colour of primary actions", defaultValue: DEFAULT_AXES.action, items: [{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }] },
  { axis: "selection", kind: "segmented", label: "Selection", hint: "The colour of checked, selected and current states", defaultValue: DEFAULT_AXES.selection, items: [{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }] },
  // Increased contrast (docs/CONTRAST.md): not a registry axis but the same kind of scoped setting,
  // data-area-contrast="more" or "standard". System writes no attribute, so the OS preference decides, as it does
  // for the app. A Select, as Density: "Standard" needs 56 of text in a 32 segment beside the label.
  { axis: "contrast", kind: "select", label: "Contrast", hint: "System follows the OS preference; More strengthens edges, focus and state", defaultValue: "system", items: [{ value: "system", label: "System" }, { value: "standard", label: "Standard" }, { value: "more", label: "More" }] },
  // Type size and density, separate (owner, 2026-10-12; axes/type-size.ts, axes/density.ts). Five
  // two-digit sizes fit a Segmented; the three densities' names do not beside a label in the 256
  // Inspector (Comfortable is 76 of text in a 42 segment), so Density is a Select, as Radius is. The
  // type bounds the density (Compact up to 14, Comfortable from 13) and the tokens resolve it, so
  // every option stays pickable and its hint says so.
  { axis: "type", kind: "segmented", label: "Type", defaultValue: "14", items: ["12", "13", "14", "15", "16"].map(value => ({ value, label: value })) },
  { axis: "density", kind: "select", label: "Density", hint: "Compact up to type 14; Comfortable from type 13", defaultValue: "default", items: [{ value: "compact", label: "Compact" }, { value: "default", label: "Default" }, { value: "comfortable", label: "Comfortable" }] },
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
