/**
 * Radius.
 *
 * Controls take a unitless multiplier of their own height rather than a fixed pixel
 * value. That is what keeps this axis independent of density: without it, every radius
 * preset would need a variant for every density preset, and adding a fifth density would
 * mean re-deriving twenty blocks.
 *
 * The default resolves to 6px on a 32px control. Primer, Vercel, Linear and Notion all
 * ship 6px controls; shadcn is the outlier at 8. Containers sit at 12px, which is the
 * single most agreed-upon number in the whole survey -- Primer overlays, OpenAI's popover
 * and dialog and alert, and Linear's cards all use it.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

interface RadiusPreset {
  /** Multiplier of control height. 0.1875 x 32 = 6px. */
  scale: number;
  /** Cards, dialogs, menus, popovers. */
  container: number;
  /** Badges, swatches, and other small nested shapes. */
  small: number;
}

function radiusTokens({ scale, container, small }: RadiusPreset) {
  return {
    "radius-scale": String(scale),
    "radius-container": `${container}px`,
    "radius-small": `${small}px`,
  };
}

export const RADIUS_AXIS: AxisDefinition = {
  id: "radius",
  label: "Radius",
  description: "How rounded controls and containers are.",
  defaultPreset: "default",
  namespaces: ["--area-radius-scale", "--area-radius-container", "--area-radius-small"],
  presets: [
    {
      id: "sharp",
      label: "Sharp",
      description: "Square corners throughout.",
      tokens: tokens(radiusTokens({ scale: 0, container: 0, small: 0 })),
    },
    {
      id: "subtle",
      label: "Subtle",
      description: "4px controls, 6px containers.",
      tokens: tokens(radiusTokens({ scale: 0.125, container: 6, small: 2 })),
    },
    {
      id: "default",
      label: "Default",
      description: "6px controls, 12px containers. Matches Primer, Vercel and Linear.",
      tokens: tokens(radiusTokens({ scale: 0.1875, container: 12, small: 4 })),
    },
    {
      id: "rounded",
      label: "Rounded",
      description: "8px controls, 14px containers. Matches shadcn/ui.",
      tokens: tokens(radiusTokens({ scale: 0.25, container: 14, small: 6 })),
    },
    {
      id: "soft",
      label: "Soft",
      description: "12px controls, 20px containers.",
      tokens: tokens(radiusTokens({ scale: 0.375, container: 20, small: 8 })),
    },
    {
      id: "pill",
      label: "Pill",
      description: "Fully round controls, 24px containers.",
      tokens: tokens(radiusTokens({ scale: 0.5, container: 24, small: 9999 })),
    },
  ],
};
