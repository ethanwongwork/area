/**
 * The component gallery's theme controls: one entry per system-wide setting the right panel
 * offers. Each writes `data-area-<axis>` on the gallery canvas only, so the gallery's own
 * chrome keeps Area's defaults whatever the canvas shows. Add a setting by adding an entry;
 * the panel, the saved preference and the pre-paint restore all read this list.
 */
import { DEFAULT_PILLS, PILL_SHAPES } from "@area/tokens/config";
export interface GalleryControl {
  axis: "theme" | "type" | "density" | "radius" | "pills" | "elevation" | "motion";
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

/** localStorage key for the canvas selection: `{ theme, ui }`. */
export const GALLERY_STORAGE_KEY = "area-gallery-theme";
export const GALLERY_CANVAS_ID = "gallery-canvas";
