/**
 * The component gallery's theme controls: one entry per system-wide setting the right panel
 * offers. Each writes `data-area-<axis>` on the gallery canvas only, so the gallery's own
 * chrome keeps Area's defaults whatever the canvas shows. Add a setting by adding an entry;
 * the panel, the saved preference and the pre-paint restore all read this list.
 */
export interface GalleryControl {
  axis: "theme" | "ui" | "roundness";
  /** A small unordered set is a Segmented; an ordered ramp is a stepped Slider. */
  kind: "segmented" | "slider";
  label: string;
  items: ReadonlyArray<{ value: string; label: string }>;
  defaultValue: string;
}

export const GALLERY_CONTROLS: readonly GalleryControl[] = [
  { axis: "theme", kind: "segmented", label: "Mode", defaultValue: "light", items: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
  { axis: "ui", kind: "segmented", label: "Density", defaultValue: "default", items: [{ value: "default", label: "Default" }, { value: "compact", label: "Compact" }] },
  // Every corner moved in 2px steps, square to pill (axes/roundness.ts).
  { axis: "roundness", kind: "slider", label: "Roundness", defaultValue: "0", items: [-12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12].map(step => { const value = step > 0 ? `+${step}` : String(step); return { value, label: value.replace("-", "−") }; }) },
];

/** localStorage key for the canvas selection: `{ theme, ui }`. */
export const GALLERY_STORAGE_KEY = "area-gallery-theme";
export const GALLERY_CANVAS_ID = "gallery-canvas";
