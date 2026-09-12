/**
 * Radius.
 *
 * Flat per preset, and the same at every control tier.
 *
 * An earlier version derived this as a proportion of control height, so that radius
 * scaled with the box. The evidence does not support it: Primer at 32px, Vercel at 32px,
 * Linear at 32px and Notion at 28px all ship exactly 6px. Nobody moves control radius
 * when density changes, and deriving it meant a compact button quietly became 5px.
 *
 * Keeping it absolute also restores the axis boundary properly -- radius is now owned
 * entirely by this axis, with no slice of it living in density.
 *
 * Containers sit at 12px, the single most agreed-upon number in the survey: Primer
 * overlays, OpenAI's popover, dialog and alert, and Linear's cards all use it.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

interface RadiusPreset {
  /** Control radius, in pixels. Flat across every tier. */
  control: number;
  /** Cards, dialogs, menus, popovers. */
  container: number;
  /** Badges, swatches, and other small nested shapes. */
  small: number;
}

function radiusTokens({ control, container, small }: RadiusPreset) {
  return {
    "radius-control": `${control}px`,
    "radius-container": `${container}px`,
    "radius-small": `${small}px`,
  };
}

export const RADIUS_AXIS: AxisDefinition = {
  id: "radius",
  label: "Radius",
  description: "How rounded controls and containers are.",
  defaultPreset: "default",
  namespaces: ["--area-radius-control", "--area-radius-container", "--area-radius-small"],
  presets: [
    {
      id: "sharp",
      label: "Sharp",
      description: "Square corners throughout.",
      tokens: tokens(radiusTokens({ control: 0, container: 0, small: 0 })),
    },
    {
      id: "subtle",
      label: "Subtle",
      description: "4px controls, 6px containers.",
      tokens: tokens(radiusTokens({ control: 4, container: 6, small: 2 })),
    },
    {
      id: "default",
      label: "Default",
      description: "6px controls, 12px containers. Matches Primer, Vercel, Linear and Notion.",
      tokens: tokens(radiusTokens({ control: 6, container: 12, small: 4 })),
    },
    {
      id: "rounded",
      label: "Rounded",
      description: "8px controls, 14px containers. Matches shadcn/ui.",
      tokens: tokens(radiusTokens({ control: 8, container: 14, small: 6 })),
    },
    {
      id: "soft",
      label: "Soft",
      description: "12px controls, 20px containers.",
      tokens: tokens(radiusTokens({ control: 12, container: 20, small: 8 })),
    },
    {
      id: "pill",
      label: "Pill",
      description: "Fully round controls, 24px containers.",
      tokens: tokens(radiusTokens({ control: 9999, container: 24, small: 9999 })),
    },
  ],
};
