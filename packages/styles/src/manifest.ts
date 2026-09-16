/**
 * Component manifests.
 *
 * One declaration per component, and the single source both sides are checked against:
 * `scripts/check-manifest-parity.mjs` walks the CSS and fails the build if a declared
 * variant has no matching selector, or if a selector exists that no manifest declares.
 * `@area/react` generates its variant props from the same object.
 *
 * Without this, the CSS and the React API drift apart quietly -- which is the failure
 * every design system with two implementations eventually has.
 */

export interface ComponentManifest {
  /** BEM block, e.g. "area-button". Also the root class name. */
  block: string;
  /** One sentence, used as the docs page description. */
  description: string;
  /** Design-time variants. Each becomes `--{value}` modifier classes. */
  variants: Record<string, readonly string[]>;
  /** Boolean modifiers, e.g. `--full-width`. */
  booleans?: readonly string[];
  /** Runtime states, expressed as data attributes rather than classes. */
  states?: readonly string[];
  /** Native/ARIA exceptions to the default data-state adapter, on the state-bearing element. */
  stateAttributes?: Record<string, string>;
  /** BEM sub-elements, e.g. `__icon`. */
  elements?: readonly string[];
  /** Modifiers applied to a named sub-element. */
  elementModifiers?: Record<string, readonly string[]>;
  defaults: Record<string, string>;
}

export const button = {
  block: "area-button",
  description: "Triggers an action.",
  variants: {
    variant: ["solid", "soft", "outline", "ghost"],
    tone: [
      "neutral",
      "accent",
      "info",
      "success",
      "warning",
      "caution",
      "danger",
      "discovery",
    ],
    size: ["xs", "sm", "md", "lg", "xl"],
    align: ["align-start", "align-end"],
  },
  booleans: ["full-width", "icon-only", "pill"],
  states: ["disabled", "loading", "selected"],
  elements: ["icon", "label"],
  defaults: { variant: "solid", tone: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const field = {
  block: "area-field",
  description: "Wraps a control with its label, description and error message.",
  variants: {},
  booleans: ["inline"],
  states: ["disabled"],
  elements: ["label", "required", "description", "error"],
  defaults: {},
} as const satisfies ComponentManifest;

export const input = {
  block: "area-input",
  description: "Accepts a single line of text.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  states: ["disabled", "invalid"],
  elements: ["control", "icon", "affix"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const textarea = {
  block: "area-textarea",
  description: "Accepts multiple lines of text.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["invalid", "disabled"],
  stateAttributes: { disabled: "disabled" },
  elements: [],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const select = {
  block: "area-select",
  description: "Picks one value from a list.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  states: ["invalid", "disabled"],
  stateAttributes: { disabled: "disabled", invalid: "aria-invalid" },
  elements: [],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const checkbox = {
  block: "area-checkbox",
  description: "Toggles a single independent option.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  states: ["disabled"],
  elements: ["control"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const radio = {
  block: "area-radio",
  description: "Picks one option from a mutually exclusive set.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  states: ["disabled"],
  elements: ["control"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const switchControl = {
  block: "area-switch",
  description: "Toggles a setting that takes effect immediately.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  states: ["disabled"],
  elements: ["control"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const slider = {
  block: "area-slider",
  description: "Picks a value from an ordered range.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  states: ["disabled"],
  elements: ["control", "value"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const chip = {
  block: "area-chip",
  description: "Selects one value from a set too long for a segmented track.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  booleans: ["pill", "swatch-only"],
  states: ["selected", "disabled"],
  elements: ["swatch", "icon"],
  defaults: { size: "sm" },
} as const satisfies ComponentManifest;

export const chipGroup = {
  block: "area-chip-group",
  description: "Lays out a set of chips, wrapping onto as many lines as it needs.",
  variants: {},
  defaults: {},
} as const satisfies ComponentManifest;

export const choiceLabel = {
  block: "area-choice-label",
  description: "The title and description beside a checkbox, radio or switch.",
  variants: {},
  elements: ["title", "description"],
  defaults: {},
} as const satisfies ComponentManifest;

export const badge = {
  block: "area-badge",
  description: "Labels an item with a short status.",
  variants: {
    variant: ["solid", "outline"],
    tone: ["neutral", "accent", "danger", "warning", "success"],
  },
  elements: ["dot"],
  defaults: { tone: "neutral" },
} as const satisfies ComponentManifest;

export const avatar = {
  block: "area-avatar",
  description: "Represents a user or entity.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"], shape: ["square"] },
  elements: ["image"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const separator = {
  block: "area-separator",
  description: "Divides related groups of content.",
  variants: { orientation: ["horizontal", "vertical"] },
  elements: [],
  defaults: { orientation: "horizontal" },
} as const satisfies ComponentManifest;

export const skeleton = {
  block: "area-skeleton",
  description: "Stands in for content that has not loaded.",
  variants: { shape: ["text", "circle"] },
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const spinner = {
  block: "area-spinner",
  description: "Indicates an action in progress with no known duration.",
  variants: { size: ["sm", "md", "lg"] },
  elements: [],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const progress = {
  block: "area-progress",
  description: "Shows how far along a task is.",
  variants: {},
  states: ["indeterminate"],
  elements: ["bar"],
  defaults: {},
} as const satisfies ComponentManifest;

export const panel = {
  block: "area-panel",
  description: "A titled surface of rows that act on something beside it.",
  variants: { size: ["xs", "sm", "md", "lg"] },
  booleans: ["flush", "bare-bar"],
  elements: ["bar", "title", "body", "section", "heading", "stack", "footer"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const card = {
  block: "area-card",
  description: "Groups related content on its own surface.",
  variants: {},
  elements: ["title", "description", "footer", "media"],
  defaults: {},
} as const satisfies ComponentManifest;

export const alert = {
  block: "area-alert",
  description: "Draws attention to an important message in place.",
  variants: { tone: ["info", "danger", "warning", "success"] },
  elements: ["icon", "content", "title", "description"],
  defaults: { tone: "info" },
} as const satisfies ComponentManifest;

export const dialog = {
  block: "area-dialog",
  description: "Interrupts with content that requires a response.",
  variants: {},
  elements: ["header", "title", "description", "body", "footer"],
  defaults: {},
} as const satisfies ComponentManifest;

export const popover = {
  block: "area-popover",
  description: "Floats content next to the element that opened it.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const menu = {
  block: "area-menu",
  description: "Lists actions triggered from a button.",
  // `selection` is how a current item is marked: a plate by default, or a rail beside
  // the label for a list read down rather than clicked across.
  variants: { layout: ["inline"], selection: ["marker"] },
  states: ["disabled", "highlighted", "selected"],
  elements: ["item", "icon", "text", "label", "separator", "shortcut"],
  elementModifiers: { item: ["danger"] },
  defaults: {},
} as const satisfies ComponentManifest;

export const tooltip = {
  block: "area-tooltip",
  description: "Names a control on hover or focus.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const toast = {
  block: "area-toast",
  description: "Reports the outcome of an action without interrupting.",
  variants: { tone: ["info", "danger", "warning", "success"] },
  elements: ["icon"],
  defaults: { tone: "info" },
} as const satisfies ComponentManifest;

export const tabs = {
  block: "area-tabs",
  description: "Switches between views in the same context.",
  variants: {},
  states: ["selected", "disabled"],
  elements: ["list", "tab", "panel"],
  defaults: {},
} as const satisfies ComponentManifest;

export const table = {
  block: "area-table",
  description: "Presents rows of structured data.",
  variants: { variant: ["interactive"] },
  elements: ["cell"],
  elementModifiers: { cell: ["numeric", "fit"] },
  defaults: {},
} as const satisfies ComponentManifest;

export const tableWrapper = {
  block: "area-table-wrapper",
  description: "Scrolls a table horizontally without scrolling the page.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const segmented = {
  block: "area-segmented",
  description: "Picks one value from a small set of options.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  booleans: ["full-width"],
  states: ["selected", "disabled"],
  stateAttributes: { disabled: "disabled" },
  elements: ["item", "icon"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const code = {
  block: "area-code",
  description: "Marks a fragment of code inline.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const codeBlock = {
  block: "area-code-block",
  description: "Shows a block of code with optional actions.",
  variants: { layout: ["flush", "wrap"] },
  states: ["collapsed"],
  elements: ["actions", "body", "pre", "toggle"],
  defaults: {},
} as const satisfies ComponentManifest;

export const nav = {
  block: "area-nav",
  description: "Site navigation, vertical or horizontal.",
  // `orientation` is the axis; `tone` decides what a current item's plate carries. A nav
  // with neither modifier is vertical and neutral, which is the sidebar case.
  variants: { orientation: ["horizontal"], tone: ["accent"] },
  elements: ["group", "label", "item", "icon", "text", "trailing", "separator"],
  defaults: {},
} as const satisfies ComponentManifest;

export const tokenChip = {
  block: "area-token",
  description: "Names a design token inline.",
  variants: { ground: ["on-color", "subtle"] },
  elements: ["swatch"],
  defaults: {},
} as const satisfies ComponentManifest;

export const kbd = {
  block: "area-kbd",
  description: "Marks a keyboard shortcut.",
  variants: { size: ["small", "normal"], tone: ["quiet"] },
  elements: ["key"],
  defaults: { size: "normal" },
} as const satisfies ComponentManifest;

export const kbdGroup = {
  block: "area-kbd-group",
  description: "Groups a sequence of keys into one shortcut.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const MANIFESTS = {
  button,
  field,
  input,
  textarea,
  select,
  checkbox,
  radio,
  switch: switchControl,
  slider,
  chip,
  chipGroup,
  choiceLabel,
  badge,
  avatar,
  separator,
  skeleton,
  spinner,
  progress,
  panel,
  card,
  alert,
  dialog,
  popover,
  menu,
  tooltip,
  toast,
  tabs,
  table,
  tableWrapper,
  segmented,
  code,
  codeBlock,
  nav,
  tokenChip,
  kbd,
  kbdGroup,
} as const satisfies Record<string, ComponentManifest>;
