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
  /** Design-time variants. Each becomes `--{group}-{value}` modifier classes. */
  variants: Record<string, readonly string[]>;
  /** Boolean modifiers, e.g. `--full-width`. */
  booleans?: readonly string[];
  /** Runtime states, expressed as data attributes rather than classes. */
  states?: readonly string[];
  /** BEM sub-elements, e.g. `__icon`. */
  elements?: readonly string[];
  defaults: Record<string, string>;
}

export const button: ComponentManifest = {
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
  defaults: { variant: "solid", tone: "accent", size: "md" },
};

export const field: ComponentManifest = {
  block: "area-field",
  description: "Wraps a control with its label, description and error message.",
  variants: {},
  states: ["disabled"],
  elements: ["label", "required", "description", "error"],
  defaults: {},
};

export const input: ComponentManifest = {
  block: "area-input",
  description: "Accepts a single line of text.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"] },
  states: ["disabled", "invalid"],
  elements: ["control", "icon", "affix"],
  defaults: { size: "md" },
};

export const textarea: ComponentManifest = {
  block: "area-textarea",
  description: "Accepts multiple lines of text.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["invalid"],
  elements: [],
  defaults: { size: "md" },
};

export const select: ComponentManifest = {
  block: "area-select",
  description: "Picks one value from a list.",
  variants: { size: ["sm", "md", "lg"] },
  states: [],
  elements: [],
  defaults: { size: "md" },
};

export const checkbox: ComponentManifest = {
  block: "area-checkbox",
  description: "Toggles a single independent option.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["disabled"],
  elements: ["control"],
  defaults: { size: "md" },
};

export const radio: ComponentManifest = {
  block: "area-radio",
  description: "Picks one option from a mutually exclusive set.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["disabled"],
  elements: ["control"],
  defaults: { size: "md" },
};

export const switchControl: ComponentManifest = {
  block: "area-switch",
  description: "Toggles a setting that takes effect immediately.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["disabled"],
  elements: ["control"],
  defaults: { size: "md" },
};

export const choiceLabel: ComponentManifest = {
  block: "area-choice-label",
  description: "The title and description beside a checkbox, radio or switch.",
  variants: {},
  elements: ["title", "description"],
  defaults: {},
};

export const badge: ComponentManifest = {
  block: "area-badge",
  description: "Labels an item with a short status.",
  variants: {
    variant: ["solid", "outline"],
    tone: ["neutral", "accent", "danger", "warning", "success"],
  },
  elements: ["dot"],
  defaults: { tone: "neutral" },
};

export const avatar: ComponentManifest = {
  block: "area-avatar",
  description: "Represents a user or entity.",
  variants: { size: ["xs", "sm", "md", "lg", "xl"], shape: ["square"] },
  elements: ["image"],
  defaults: { size: "md" },
};

export const separator: ComponentManifest = {
  block: "area-separator",
  description: "Divides related groups of content.",
  variants: { orientation: ["horizontal", "vertical"] },
  elements: [],
  defaults: { orientation: "horizontal" },
};

export const skeleton: ComponentManifest = {
  block: "area-skeleton",
  description: "Stands in for content that has not loaded.",
  variants: { shape: ["text", "circle"] },
  elements: [],
  defaults: {},
};

export const spinner: ComponentManifest = {
  block: "area-spinner",
  description: "Indicates an action in progress with no known duration.",
  variants: { size: ["sm", "md", "lg"] },
  elements: [],
  defaults: { size: "md" },
};

export const progress: ComponentManifest = {
  block: "area-progress",
  description: "Shows how far along a task is.",
  variants: {},
  states: ["indeterminate"],
  elements: ["bar"],
  defaults: {},
};

export const card: ComponentManifest = {
  block: "area-card",
  description: "Groups related content on its own surface.",
  variants: {},
  elements: ["title", "description", "footer", "media"],
  defaults: {},
};

export const alert: ComponentManifest = {
  block: "area-alert",
  description: "Draws attention to an important message in place.",
  variants: { tone: ["info", "danger", "warning", "success"] },
  elements: ["icon", "content", "title", "description"],
  defaults: { tone: "info" },
};

export const dialog: ComponentManifest = {
  block: "area-dialog",
  description: "Interrupts with content that requires a response.",
  variants: {},
  elements: ["header", "title", "description", "body", "footer"],
  defaults: {},
};

export const popover: ComponentManifest = {
  block: "area-popover",
  description: "Floats content next to the element that opened it.",
  variants: {},
  elements: [],
  defaults: {},
};

export const menu: ComponentManifest = {
  block: "area-menu",
  description: "Lists actions triggered from a button.",
  variants: { layout: ["inline"] },
  states: ["disabled", "highlighted", "selected"],
  elements: ["item", "icon", "text", "label", "separator", "shortcut"],
  defaults: {},
};

export const tooltip: ComponentManifest = {
  block: "area-tooltip",
  description: "Names a control on hover or focus.",
  variants: {},
  elements: [],
  defaults: {},
};

export const toast: ComponentManifest = {
  block: "area-toast",
  description: "Reports the outcome of an action without interrupting.",
  variants: { tone: ["info", "danger", "warning", "success"] },
  elements: ["icon"],
  defaults: { tone: "info" },
};

export const tabs: ComponentManifest = {
  block: "area-tabs",
  description: "Switches between views in the same context.",
  variants: {},
  states: ["selected", "disabled"],
  elements: ["list", "tab", "panel"],
  defaults: {},
};

export const table: ComponentManifest = {
  block: "area-table",
  description: "Presents rows of structured data.",
  variants: { variant: ["interactive"] },
  elements: ["cell"],
  defaults: {},
};

export const tableWrapper: ComponentManifest = {
  block: "area-table-wrapper",
  description: "Scrolls a table horizontally without scrolling the page.",
  variants: {},
  elements: [],
  defaults: {},
};

export const segmented: ComponentManifest = {
  block: "area-segmented",
  description: "Picks one value from a small set of options.",
  variants: { size: ["xs", "sm", "md", "lg"] },
  states: ["selected"],
  elements: ["item", "icon"],
  defaults: { size: "md" },
};

export const code: ComponentManifest = {
  block: "area-code",
  description: "Marks a fragment of code inline.",
  variants: {},
  elements: [],
  defaults: {},
};

export const codeBlock: ComponentManifest = {
  block: "area-code-block",
  description: "Shows a block of code with an optional toolbar.",
  // `shape` is how the block presents its actions: a header row carrying a filename
  // (`titled`), or none at all with a single action riding on the code (`bare`). A block
  // with neither modifier gets the full toolbar, which is what a live example needs.
  variants: { shape: ["titled", "bare"], layout: ["flush", "wrap"] },
  elements: ["toolbar", "title", "actions", "pre"],
  defaults: {},
};

export const nav: ComponentManifest = {
  block: "area-nav",
  description: "Site navigation, vertical or horizontal.",
  // `orientation` is the axis; `tone` decides what a current item's plate carries. A nav
  // with neither modifier is vertical and neutral, which is the sidebar case.
  variants: { orientation: ["horizontal"], tone: ["accent"] },
  elements: ["group", "label", "item", "icon", "text", "trailing", "separator"],
  defaults: {},
};

export const tokenChip: ComponentManifest = {
  block: "area-token",
  description: "Names a design token inline.",
  variants: { ground: ["on-color", "subtle"] },
  elements: ["swatch"],
  defaults: {},
};

export const kbd: ComponentManifest = {
  block: "area-kbd",
  description: "Marks a keyboard key.",
  variants: { tone: ["quiet"] },
  elements: [],
  defaults: {},
};

export const kbdGroup: ComponentManifest = {
  block: "area-kbd-group",
  description: "Groups a sequence of keys into one shortcut.",
  variants: {},
  elements: [],
  defaults: {},
};

export const MANIFESTS: Record<string, ComponentManifest> = {
  button,
  field,
  input,
  textarea,
  select,
  checkbox,
  radio,
  switch: switchControl,
  choiceLabel,
  badge,
  avatar,
  separator,
  skeleton,
  spinner,
  progress,
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
};
