/**
 * Layers: three settings for the page's tone and the tones of what sits on it (color/layers.ts has the model).
 *
 *   ground-light  the light page's lightness, 100 (white) to 90 in 1% steps (owner, 2026-10-16: "100% lightness
 *                 (white), 99% 98% 97% 96% 95%, etc").
 *   ground-dark   the dark page's lightness: 0 (black), 8 (Area's near-black #020202, the default), 12 to 24 in 2%
 *                 steps (below 12 a 1% step doesn't show on a screen).
 *   layers-light  layer contrast in light, 0 (Flat) to 8: how far cards, menus and sidebars sit from the page, and
 *   layers-dark   controls from their ground; the same in dark. 4 is the default for both; light 100 + 4 is Area's
 *                 light theme as it was. One setting per theme since 2026-10-17 (owner: "the most possible
 *                 customization"); it was one `layers` setting for both.
 *
 * Each writes one number; emit/base.ts derives every page, layer, control-fill, edge and ink colour from them with the
 * Neutral setting's cast, live, so a subtree that sets its own ground re-derives. Research and every combination
 * checked: docs/research/layers-2026-10-16/.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import {
  DEFAULT_GROUND_DARK, DEFAULT_GROUND_LIGHT, DEFAULT_LAYERS, GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, LAYER_STEPS, groundLightness,
} from "../color/layers.ts";

export const GROUND_LIGHT_AXIS: AxisDefinition = {
  id: "ground-light",
  label: "Light ground",
  description: "The light page's lightness, 100 (white) to 90.",
  defaultPreset: String(DEFAULT_GROUND_LIGHT),
  namespaces: ["--area-ground-light:"],
  presets: GROUND_LIGHT_STEPS.map(step => ({
    id: String(step),
    label: step === 100 ? "100 (White)" : String(step),
    description: step === 100 ? "A white page (Area's light theme)." : `A ${step}% gray page; raised layers lift toward white.`,
    tokens: tokens({ "ground-light": String(groundLightness("light", step)) }),
  })),
};

export const GROUND_DARK_AXIS: AxisDefinition = {
  id: "ground-dark",
  label: "Dark ground",
  description: "The dark page's lightness, 0 (black) to 24.",
  defaultPreset: String(DEFAULT_GROUND_DARK),
  namespaces: ["--area-ground-dark:"],
  presets: GROUND_DARK_STEPS.map(step => ({
    id: String(step),
    label: step === 0 ? "0 (Black)" : step === DEFAULT_GROUND_DARK ? `${step} (Default)` : String(step),
    description: step === 0 ? "Pure black, for OLED and the darkest room." : step === DEFAULT_GROUND_DARK ? "Area's near-black, #020202." : `A ${step}% dark gray page.`,
    tokens: tokens({ "ground-dark": String(groundLightness("dark", step)) }),
  })),
};

const layersAxis = (theme: "light" | "dark"): AxisDefinition => ({
  id: `layers-${theme}`,
  label: theme === "light" ? "Light layers" : "Dark layers",
  description: `In ${theme}: how far cards, menus and sidebars sit from the page, and controls from their ground, 0 (Flat) to 8.`,
  defaultPreset: String(DEFAULT_LAYERS),
  namespaces: [`--area-layers-${theme}:`],
  presets: LAYER_STEPS.map(step => ({
    id: String(step),
    label: step === 0 ? "0 (Flat)" : step === DEFAULT_LAYERS ? `${step} (Default)` : String(step),
    description: step === 0 ? "One tone: frames alone set layers apart; controls still step from their ground." : step === DEFAULT_LAYERS ? "Area's layer contrast." : `Layer contrast ${step} of 8.`,
    tokens: tokens({ [`layers-${theme}`]: String(step) }),
  })),
});
export const LAYERS_LIGHT_AXIS = layersAxis("light");
export const LAYERS_DARK_AXIS = layersAxis("dark");
