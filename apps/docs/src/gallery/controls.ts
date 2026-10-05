/**
 * The component gallery's theme controls: one entry per system-wide setting the right panel
 * offers. Each writes `data-area-<axis>` on the gallery canvas only, so the gallery's own
 * chrome keeps Area's defaults whatever the canvas shows. Add a setting by adding an entry;
 * the panel, the saved preference and the pre-paint restore all read this list.
 */
import { DEFAULT_PILLS, PILL_SHAPES } from "@area/tokens/config";
export interface GalleryControl {
  axis: "theme" | "ui" | "radius" | "pills";
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

export const GALLERY_CONTROLS: readonly GalleryControl[] = [
  { axis: "theme", kind: "segmented", label: "Mode", defaultValue: "light", items: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
  { axis: "ui", kind: "segmented", label: "Density", defaultValue: "default", items: [{ value: "default", label: "Default" }, { value: "compact", label: "Compact" }] },
  // The one corner setting (axes/radius.ts): a single number, the medium Button's corner, from 0
  // (Sharp) to Pill; everything else scales off it (owner, 2026-10-04).
  { axis: "radius", kind: "select", label: "Radius", hint: "The medium Button's corner; everything scales from it", defaultValue: "8", items: ["0", "2", "4", "6", "8", "10", "12", "14", "pill"].map(value => ({
    value,
    label: value === "0" ? "0 · Sharp" : value === "pill" ? "Pill" : value === "8" ? "8 · Default" : value,
  })) },
  // Which components draw a pill instead of the radius corner (axes/pills.ts), as data-area-pills.
  { axis: "pills", kind: "chips", label: "Pills", hint: "On: a pill. Off: follows Radius.", defaultValue: DEFAULT_PILLS.join(" "), items: PILL_SHAPES.map(value => ({ value, label: value === "field" ? "Fields" : value[0]!.toUpperCase() + value.slice(1) })) },
];

/** localStorage key for the canvas selection: `{ theme, ui }`. */
export const GALLERY_STORAGE_KEY = "area-gallery-theme";
export const GALLERY_CANVAS_ID = "gallery-canvas";
