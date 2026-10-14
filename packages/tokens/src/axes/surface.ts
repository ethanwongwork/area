/**
 * Surface: decorative stroke weight and elevation. Required edges and focus are independent.
 *
 * Tight negative spreads keep the shadow close to its object. Even the largest tier
 * uses a short offset: depth should not turn into a detached grey shelf. Shadow ink is
 * theme-owned; the same recipe remains restrained on both light and dark surfaces.
 *
 * Two roles sit beside the ladder (audit S10, owner 2026-09-30). `shadow-card` is the lift of a
 * surface that rests on the page (Card, Panel, Board card); `shadow-float` is the one lift
 * everything floating over the page shares (Menu, Popover, the Select picker, Dialog, Toast,
 * Calendar and ColorPicker surfaces, Command palette, Drawer, the floating Toolbar).
 *
 * Minimal elevation (owner, 2026-10-13: "an extremely subtle, very minimal shadow system ... i
 * barely want to see any shadows or none"; docs/research/elevation-2026-10-13.md). The edge carries
 * separation and the shadow only hints at it, as the references draw it:
 *   - nothing at rest lifts: Notion's page and ChatGPT's (bar its composer) draw no shadow, so
 *     Outlined's `shadow-card` is `none`;
 *   - a floating surface takes Notion's lightest captured lift, its small floating chip: 0 8px 12px
 *     and 0 2px 6px, both rgba(25,25,25,.027) (light). Dark keeps one layer, Notion's dark chip at
 *     8%, since on a near-black page the 1px edge does the work (ChatGPT's dark composer draws none);
 *   - Raised keeps the previous default (Card's 3% halo, Notion's popover 0 20 24 / 0 5 8) for a
 *     product that wants visible depth; Flat removes both.
 */
// Dark: no halo (audit S21c, dark captures 2026-09-30: Notion's and Figma's cards have none; the
// edge carries the card). Was 16% black, invisible on the dark page anyway.
const CARD = "0 1px 2px -1px light-dark(rgb(0 0 0 / 0.03), transparent), 0 2px 8px 0 light-dark(rgb(0 0 0 / 0.03), transparent)";
const FLOAT = "0 20px 24px var(--area-shadow-color), 0 5px 8px color-mix(in srgb, var(--area-shadow-color) 50%, transparent)";
// spec: Notion's small floating chip (notion.site search, 2026-10-13): light 0 8 12 / 0 2 6 at 2.7%;
// dark one layer at 8% (its 0 4 12 -2 rgba(25,25,25,.08), here on the light geometry's first layer).
const FLOAT_MINIMAL = "0 8px 12px light-dark(rgb(25 25 25 / 0.027), rgb(25 25 25 / 0.08)), 0 2px 6px light-dark(rgb(25 25 25 / 0.027), transparent)";
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
      description: "1px strokes; nothing at rest lifts, and floating surfaces barely do.",
      tokens: tokens({
        "border-width": "1px",
        "shadow-1": "0 0.5px 1px -0.5px var(--area-shadow-color)",
        "shadow-2": "0 1px 2px -0.5px var(--area-shadow-color)",
        "shadow-3": "0 2px 4px -1px var(--area-shadow-color)",
        "shadow-4": "0 3px 6px -2px var(--area-shadow-color)",
        "shadow-card": "none",
        "shadow-float": FLOAT_MINIMAL,
      }),
    },
    {
      id: "raised",
      label: "Raised",
      description: "Visible depth: Card's faint halo and Notion's popover lift on floating surfaces.",
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
