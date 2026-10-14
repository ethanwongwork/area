/**
 * Elevation: how much surfaces lift off the page (owner, 2026-10-14: "add elevation as an option ...
 * flat (none), minimal, normal, and higher contrast ... a granular level of customization that can
 * be applied consistently across all components"). Research: docs/research/elevation-2026-10-14.md.
 *
 * Components never pick a shadow; they name the role they play, and the preset decides its depth:
 *
 *   control  a raised part on a track or plate: Switch, Slider and Segmented thumbs, the soft
 *            Toggle group selection, Badge modern
 *   resting  a surface that rests on the page: Card, Panel, Board card
 *   tooltip  a small annotation floating over content: Tooltip
 *   float    a surface floating over the page: Menu, Popover, Hover card, the Select picker, Toast,
 *            the Calendar and ColorPicker surfaces, the floating Toolbar, Board card actions
 *   modal    a surface over a scrim, the topmost: Dialog, Drawer, Command palette
 *
 * Every role has the same shape in every preset, two layers, ambient then key (Fluent's recipe;
 * Material's key and ambient), so a preset swap and a transition between presets interpolate layer by
 * layer (box-shadow only animates between lists of equal length). An unused layer is a transparent
 * zero, never `none`: a role also sits inside lists beside a component's own layers (Board card's tone
 * ring, the floating Toolbar's edge), and `none` there invalidates the whole box-shadow.
 *
 * Each preset is one system's measured values, so the depth of every role traces to a source:
 *
 *   flat      no shadows; edges and the Dialog scrim separate (IBM Carbon's modal, Atlassian's
 *             increased-contrast model)
 *   minimal   the default: nothing at rest lifts; floating surfaces barely do (Notion's small floating
 *             chip; ChatGPT's tooltip and page draw none; captures 2026-10-13)
 *   soft      Notion's depth, the previous default: Card's 3% halo, its popover and its search dialog
 *   standard  Fluent 2 (shadow2 / 4 / 8 / 16 / 64 at its default 12% ambient, 14% key; dark 24 / 28)
 *   strong    Fluent 2's darker colours on the same geometry (20 / 24%; dark 40 / 48%), for products
 *             that want depth to read at a glance; it pairs with `data-area-contrast="more"`
 *
 * The 1-4 ladder is the roles in depth order (control, resting, float, modal), for apps.
 * Forced colours compute box-shadow to none; every floating surface keeps its 1px border-float, which
 * the browser repaints, so nothing depends on a shadow to be seen.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

const NO = "0 0 0 0 transparent";
type Role = readonly [ambient: string, key: string];
interface Roles { control: Role; resting: Role; tooltip: Role; float: Role; modal: Role }

const lift = (geometry: string, light: string, dark: string) => `${geometry} light-dark(${light}, ${dark})`;
const black = (alpha: number) => `rgb(0 0 0 / ${alpha})`;
const ink = (alpha: number) => `rgb(25 25 25 / ${alpha})`; // Notion's shadow ink, rgba(25,25,25,…)

/** Fluent 2's recipe (packages/tokens/src/utils/shadows.ts): ambient 0 0 2 (8 at 28+), key y = blur / 2. */
function fluent(ambient: readonly [number, number], key: readonly [number, number]): Roles {
  const tier = (key_y: number, key_blur: number, ambient_blur = 2): Role => [
    lift(`0 0 ${ambient_blur}px`, black(ambient[0]), black(ambient[1])),
    lift(`0 ${key_y}px ${key_blur}px`, black(key[0]), black(key[1])),
  ];
  return { control: tier(1, 2), resting: tier(2, 4), tooltip: tier(4, 8), float: tier(8, 16), modal: tier(32, 64, 8) };
}

const PRESETS: Record<"flat" | "minimal" | "soft" | "standard" | "strong", Roles> = {
  flat: { control: [NO, NO], resting: [NO, NO], tooltip: [NO, NO], float: [NO, NO], modal: [NO, NO] },
  minimal: {
    // spec: the 0.5px contact shadow raised thumbs have carried since 2026-09 (shadow-color: 6% light, 20% dark).
    control: [NO, "0 0.5px 1px -0.5px var(--area-shadow-color)"],
    resting: [NO, NO],
    tooltip: [NO, NO],
    // spec: Notion's small floating chip (2026-10-13): 0 2 6 and 0 8 12 at 2.7%; dark one 8% layer.
    float: [lift("0 2px 6px", ink(0.027), "transparent"), lift("0 8px 12px", ink(0.027), ink(0.08))],
    // spec: Notion's popover, the next step up (0 5 8 at 2.7%, 0 20 24 at 5%); dark its dark popover's
    // strengths (11.8%, 20%) on the light geometry. A modal also has the scrim behind it.
    modal: [lift("0 5px 8px", ink(0.027), ink(0.118)), lift("0 20px 24px", ink(0.05), ink(0.2))],
  },
  soft: {
    control: [NO, "0 0.5px 1px -0.5px var(--area-shadow-color)"],
    // spec: Card's halo (owner, 2026-09-27; Figma's 0 0 8 at 2%): 1px contact and a 2px-low 8px blur at 3%; none in dark.
    resting: [lift("0 1px 2px -1px", black(0.03), "transparent"), lift("0 2px 8px 0", black(0.03), "transparent")],
    // spec: the Tooltip lift it carried until 2026-10-13 (Notion's geometry).
    tooltip: [NO, "0 4px 12px -2px var(--area-shadow-color)"],
    // spec: Notion's popover, the shared floating lift until 2026-10-13, in shadow-color at half and full strength.
    float: ["0 5px 8px color-mix(in srgb, var(--area-shadow-color) 50%, transparent)", "0 20px 24px var(--area-shadow-color)"],
    // spec: Notion's search dialog (2026-10-13): 0 4 12 at 14%, 0 24 48 at 24%; dark 56%, 64%.
    modal: [lift("0 4px 12px", ink(0.14), ink(0.56)), lift("0 24px 48px", ink(0.24), ink(0.64))],
  },
  // spec: Fluent 2 alias colours (alias/lightColor.ts, darkColor.ts L184-191): shadow ambient / key.
  standard: fluent([0.12, 0.24], [0.14, 0.28]),
  // spec: Fluent 2's colorNeutralShadowAmbientDarker / KeyDarker: 20 / 24% light, 40 / 48% dark.
  strong: fluent([0.2, 0.4], [0.24, 0.48]),
};

const join = (role: Role) => role.join(", ");
function roleTokens(roles: Roles) {
  return tokens({
    "shadow-control": join(roles.control),
    "shadow-resting": join(roles.resting),
    "shadow-tooltip": join(roles.tooltip),
    "shadow-float": join(roles.float),
    "shadow-modal": join(roles.modal),
    // The ladder: the roles in depth order.
    "shadow-1": "var(--area-shadow-control)",
    "shadow-2": "var(--area-shadow-resting)",
    "shadow-3": "var(--area-shadow-float)",
    "shadow-4": "var(--area-shadow-modal)",
  });
}

export const ELEVATION_AXIS: AxisDefinition = {
  id: "elevation",
  label: "Elevation",
  description: "How much surfaces lift off the page, from none to strong; every component takes its depth from its role.",
  defaultPreset: "minimal",
  namespaces: [
    "--area-shadow-1:", "--area-shadow-2:", "--area-shadow-3:", "--area-shadow-4:",
    "--area-shadow-control:", "--area-shadow-resting:", "--area-shadow-tooltip:", "--area-shadow-float:", "--area-shadow-modal:",
  ],
  presets: [
    { id: "flat", label: "Flat", description: "No shadows. Edges and the dialog scrim separate surfaces.", tokens: roleTokens(PRESETS.flat) },
    { id: "minimal", label: "Minimal", description: "Nothing at rest lifts; floating surfaces barely do.", tokens: roleTokens(PRESETS.minimal) },
    { id: "soft", label: "Soft", description: "Quiet depth: a faint halo on cards, soft lifts on floating surfaces.", tokens: roleTokens(PRESETS.soft) },
    { id: "standard", label: "Standard", description: "Clear depth at every level (Fluent 2's scale).", tokens: roleTokens(PRESETS.standard) },
    { id: "strong", label: "Strong", description: "High-contrast depth that reads at a glance.", tokens: roleTokens(PRESETS.strong) },
  ],
};
