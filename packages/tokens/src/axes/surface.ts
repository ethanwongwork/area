/**
 * Surface: stroke weight, elevation, and the focus ring's geometry.
 *
 * The elevation recipes use negative spread so a shadow reads as lift rather than as a
 * grey halo -- the shape OpenAI's own elevation tokens use. Shadow colour is a token in
 * its own right so a dark theme can deepen it; a shadow authored as flat `rgba(0,0,0,.06)`
 * disappears on a dark surface, which is the single most common elevation bug.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

const RING = {
  "ring-width": "2px",
  "ring-offset": "2px",
};

export const SURFACE_AXIS: AxisDefinition = {
  id: "surface",
  label: "Surface",
  description: "Stroke weight and how much surfaces lift off the page.",
  defaultPreset: "outlined",
  namespaces: ["--area-border-width", "--area-shadow-1:", "--area-shadow-2:", "--area-shadow-3:", "--area-shadow-4:", "--area-ring-"],
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
        ...RING,
      }),
    },
    {
      id: "outlined",
      label: "Outlined",
      description: "1px strokes with restrained lift on floating surfaces.",
      tokens: tokens({
        "border-width": "1px",
        "shadow-1": "0 1px 2px -1px var(--area-shadow-color)",
        "shadow-2": "0 2px 4px -1px var(--area-shadow-color)",
        "shadow-3": "0 4px 8px -2px var(--area-shadow-color)",
        "shadow-4": "0 8px 16px -4px var(--area-shadow-color)",
        ...RING,
      }),
    },
    {
      id: "raised",
      label: "Raised",
      description: "Stronger, softer shadows. Controls lift too, not just overlays.",
      tokens: tokens({
        "border-width": "1px",
        "shadow-1": "0 1px 2px 0 var(--area-shadow-color)",
        "shadow-2": "0 2px 8px -1px var(--area-shadow-color)",
        "shadow-3": "0 8px 20px -4px var(--area-shadow-color)",
        "shadow-4": "0 16px 32px -8px var(--area-shadow-color)",
        ...RING,
      }),
    },
    {
      id: "elevated",
      label: "Elevated",
      description: "No strokes. Depth is carried entirely by shadow.",
      tokens: tokens({
        "border-width": "0px",
        "shadow-1": "0 1px 3px 0 var(--area-shadow-color)",
        "shadow-2": "0 4px 12px -2px var(--area-shadow-color)",
        "shadow-3": "0 12px 28px -6px var(--area-shadow-color)",
        "shadow-4": "0 24px 48px -12px var(--area-shadow-color)",
        ...RING,
      }),
    },
  ],
};
