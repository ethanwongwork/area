/**
 * Surface: decorative stroke weight and elevation. Required edges and focus are independent.
 *
 * Tight negative spreads keep the shadow close to its object. Even the largest tier
 * uses a short offset: depth should not turn into a detached grey shelf. Shadow ink is
 * theme-owned; the same recipe remains restrained on both light and dark surfaces.
 *
 * Two roles sit beside the ladder (audit S10, owner 2026-09-30). `shadow-card` is Card's faint
 * halo (owner 2026-09-27: a 1px contact line and a 2px-low 8px blur, 3% black; dark 16%).
 * `shadow-float` is the one lift everything floating over the page shares (Menu, Popover, the
 * Select picker, Dialog, Toast, Calendar and ColorPicker surfaces, Command palette, Toolbar
 * overflow): Notion's popover geometry, 0 20px 24px and 0 5px 8px at full and half strength.
 * Flat removes both; the other presets keep the measured recipes.
 */
const CARD = "0 1px 2px -1px light-dark(rgb(0 0 0 / 0.03), rgb(0 0 0 / 0.16)), 0 2px 8px 0 light-dark(rgb(0 0 0 / 0.03), rgb(0 0 0 / 0.16))";
const FLOAT = "0 20px 24px var(--area-shadow-color), 0 5px 8px color-mix(in srgb, var(--area-shadow-color) 50%, transparent)";
import { type AxisDefinition, tokens } from "./schema.ts";

export const SURFACE_AXIS: AxisDefinition = {
  id: "surface",
  label: "Surface",
  description: "Stroke weight and how much surfaces lift off the page.",
  defaultPreset: "outlined",
  namespaces: ["--area-border-width", "--area-shadow-1:", "--area-shadow-2:", "--area-shadow-3:", "--area-shadow-4:", "--area-shadow-card:", "--area-shadow-float:"],
  presets: [
    {
      id: "flat",
      label: "Flat",
      description: "Strokes only. No elevation anywhere.",
      tokens: tokens({
        "border-width": "1px",
        "shadow-1": "none",
        "shadow-2": "none",
        "shadow-3": "none",
        "shadow-4": "none",
        "shadow-card": "none",
        "shadow-float": "none",
      }),
    },
    {
      id: "outlined",
      label: "Outlined",
      description: "1px strokes with restrained lift on floating surfaces.",
      tokens: tokens({
        "border-width": "1px",
        "shadow-1": "0 0.5px 1px -0.5px var(--area-shadow-color)",
        "shadow-2": "0 1px 2px -0.5px var(--area-shadow-color)",
        "shadow-3": "0 2px 4px -1px var(--area-shadow-color)",
        "shadow-4": "0 3px 6px -2px var(--area-shadow-color)",
        "shadow-card": CARD,
        "shadow-float": FLOAT,
      }),
    },
    {
      id: "raised",
      label: "Raised",
      description: "A little more diffusion on floating surfaces, with the same quiet contact shadow.",
      tokens: tokens({
        "border-width": "1px",
        "shadow-1": "0 0.5px 1px -0.5px var(--area-shadow-color)",
        "shadow-2": "0 1px 3px -1px var(--area-shadow-color)",
        "shadow-3": "0 2px 6px -2px var(--area-shadow-color)",
        "shadow-4": "0 4px 10px -3px var(--area-shadow-color)",
        "shadow-card": CARD,
        "shadow-float": FLOAT,
      }),
    },
    {
      id: "elevated",
      label: "Elevated",
      description: "Shadow-led containers. Required control and selection strokes remain.",
      tokens: tokens({
        "border-width": "0px",
        "shadow-1": "0 0.5px 2px -0.5px var(--area-shadow-color)",
        "shadow-2": "0 1px 4px -1px var(--area-shadow-color)",
        "shadow-3": "0 3px 8px -2px var(--area-shadow-color)",
        "shadow-4": "0 5px 12px -3px var(--area-shadow-color)",
        "shadow-card": CARD,
        "shadow-float": FLOAT,
      }),
    },
  ],
};
