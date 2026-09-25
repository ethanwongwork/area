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
  /** Searchable source terminology mapped to canonical contracts; not CSS modifiers. */
  aliases?: Record<string, string>;
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
    size: ["sm", "md", "lg"],
    align: ["align-start", "align-end"],
  },
  booleans: ["full-width", "icon-only", "pill"],
  states: ["disabled", "loading", "selected"],
  elements: ["icon", "label"],
  defaults: { variant: "solid", tone: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const buttonGroup = {
  block: "area-button-group",
  description: "Joins related full-size button actions at shared edges.",
  variants: { variant: ["soft", "outline"], size: ["sm", "md", "lg"] },
  defaults: { variant: "soft", size: "md" },
} as const satisfies ComponentManifest;

export const toolbar = {
  block: "area-toolbar",
  description: "Groups commands with keyboard navigation and optional overflow.",
  variants: { variant: ["plain", "surface"], size: ["sm", "md", "lg"], orientation: ["horizontal", "vertical"] },
  booleans: ["full-width"],
  elements: ["group", "separator", "overflow", "overflow-trigger", "overflow-dots", "overflow-content"],
  defaults: { variant: "plain", size: "md", orientation: "horizontal" },
} as const satisfies ComponentManifest;

export const alignmentPicker = {
  block: "area-alignment-picker",
  description: "Chooses one of nine physical alignment positions.",
  variants: { variant: ["surface", "plain"], size: ["sm", "md", "lg"] },
  booleans: ["stretch"],
  elements: ["cell", "dot"],
  defaults: { variant: "surface", size: "md" },
} as const satisfies ComponentManifest;

export const colorPicker = {
  block: "area-color-picker",
  variants: {}, defaults: {},
  description: "Edits a solid color with saturation, brightness, hue, opacity and saved swatches.",
  elements: ["area", "thumb", "channel", "slider", "hue", "alpha", "heading"],
} as const satisfies ComponentManifest;

export const colorSwatch = {
  block: "area-color-swatch",
  description: "Displays a color and reveals transparency over a checkerboard.",
  variants: { size: ["sm", "md", "lg"] },
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const colorSwatchPicker = {
  block: "area-color-swatch-picker",
  description: "Chooses one labeled color from a row or grid of swatches.",
  variants: { size: ["sm", "md", "lg"], layout: ["grid", "row"] },
  elements: ["cell"],
  defaults: { size: "md", layout: "grid" },
} as const satisfies ComponentManifest;

export const colorField = {
  block: "area-color-field",
  description: "Edits a hex color beside its preview, with optional split opacity.",
  variants: { size: ["sm", "md", "lg"] },
  booleans: ["full-width", "alpha"],
  elements: ["opacity"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const field = {
  block: "area-field",
  description: "Labels and describes one form control, including its validation message.",
  variants: { orientation: ["vertical", "horizontal"] },
  booleans: ["inline"],
  states: ["disabled"],
  elements: ["label", "required", "description", "validation", "error"],
  defaults: { orientation: "vertical" },
} as const satisfies ComponentManifest;

export const input = {
  block: "area-input",
  description: "Accepts a single line of text.",
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] },
  booleans: ["full-width", "monospace"],
  states: ["disabled", "invalid", "success", "warning", "read-only", "loading"],
  elements: ["control", "icon", "affix", "action", "action-button", "action-icon", "action-tooltip"],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const numberField = {
  block: "area-number-field",
  description: "Edits a number with optional units, stepping and scrubbing.",
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  states: ["disabled", "read-only", "invalid", "success", "warning", "scrubbing"],
  elements: ["control", "unit", "scrub", "steppers", "step"],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const inputGroup = {
  block: "area-input-group",
  description: "Combines independently named controls and passive segments in one shell.",
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  elements: ["text"],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const breadcrumb = {
  block: "area-breadcrumb",
  description: "Shows the current page within a hierarchy of links.",
  variants: {},
  elements: ["list", "item", "link", "page", "separator", "chevron", "ellipsis"],
  defaults: {},
} as const satisfies ComponentManifest;

export const treeView = {
  block: "area-tree-view",
  description: "Navigates or selects items in an expandable hierarchy.",
  variants: { selectionMode: ["navigation", "checkbox"] },
  elements: ["chevron", "check", "icon", "label", "trailing"],
  defaults: { selectionMode: "navigation" },
} as const satisfies ComponentManifest;

export const composer = {
  block: "area-composer",
  description: "Writes and submits a message with optional action slots.",
  variants: { layout: ["inline", "stacked"] },
  states: ["disabled", "busy"],
  elements: ["entry", "input", "actions", "extras", "footer", "submit"],
  elementModifiers: { actions: ["leading", "trailing"] },
  defaults: { layout: "inline" },
} as const satisfies ComponentManifest;

export const textarea = {
  block: "area-textarea",
  description: "Accepts multiple lines of text.",
  variants: {
    variant: ["outline", "soft"],
    size: ["sm", "md", "lg"],
    resize: ["vertical", "horizontal", "both", "none"],
  },
  booleans: ["full-width"],
  states: ["invalid", "success", "warning", "disabled", "read-only"],
  stateAttributes: { invalid: "aria-invalid", disabled: "disabled", "read-only": "readonly" },
  elements: [],
  defaults: { variant: "outline", size: "md", resize: "vertical" },
} as const satisfies ComponentManifest;

export const select = {
  block: "area-select",
  description: "Picks one value from a list.",
  variants: { size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  states: ["invalid", "disabled"],
  stateAttributes: { disabled: "disabled", invalid: "aria-invalid" },
  elements: [],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const checkbox = {
  block: "area-checkbox",
  description: "Toggles a single independent option.",
  variants: { variant: ["card"], size: ["sm", "md", "lg"] },
  states: ["checked", "indeterminate", "disabled", "invalid"],
  elements: ["control", "visual"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const checkboxGroup = {
  block: "area-checkbox-group",
  description: "Groups related Checkbox options under one label.",
  variants: { orientation: ["vertical", "horizontal"] },
  states: ["disabled", "invalid", "success", "warning"],
  elements: ["legend", "description", "options", "validation"],
  defaults: { orientation: "vertical" },
} as const satisfies ComponentManifest;

export const radio = {
  block: "area-radio",
  description: "Picks one option from a mutually exclusive set.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["disabled"],
  elements: ["control"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const radioGroup = {
  block: "area-radio-group",
  description: "Groups mutually exclusive Radio options under one label.",
  variants: { orientation: ["vertical", "horizontal"] },
  states: ["disabled", "invalid"],
  elements: ["legend", "description", "options", "validation"],
  defaults: { orientation: "vertical" },
} as const satisfies ComponentManifest;

export const switchControl = {
  block: "area-switch",
  description: "Toggles a setting that takes effect immediately.",
  aliases: { Toggle: "Switch", ToggleSwitch: "Switch", block: "full-width", before: "start", after: "end" },
  variants: {
    size: ["sm", "md", "lg"],
    labelPosition: ["end", "start"],
    track: ["short", "long"],
    tone: ["neutral", "accent", "custom"],
  },
  booleans: ["full-width"],
  states: ["checked", "disabled", "read-only", "loading", "hover", "active", "focus-visible"],
  stateAttributes: { checked: "checked" },
  elements: ["control", "track", "thumb", "text", "label", "description", "loading"],
  defaults: { size: "md", labelPosition: "end", track: "short", tone: "neutral" },
} as const satisfies ComponentManifest;

export const slider = {
  block: "area-slider",
  description: "Picks a value from an ordered range.",
  variants: {
    tone: ["neutral", "accent"],
    size: ["sm", "md", "lg"],
    labelPosition: ["top"],
    orientation: ["vertical"],
  },
  states: ["disabled", "hover", "focus-visible"],
  elements: ["label", "control", "value", "marks"],
  defaults: { tone: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const chip = {
  block: "area-chip",
  description: "Selects one value from a set too long for a segmented track.",
  variants: { kind: ["assist", "filter", "input", "suggestion"], size: ["sm", "md", "lg"] },
  booleans: ["pill", "swatch-only", "link", "link-icon"],
  states: ["selected", "disabled", "invalid"],
  elements: ["swatch", "icon", "trailing-icon", "avatar", "image", "label", "action", "remove"],
  defaults: { kind: "filter", size: "md" },
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
  description: "Labels an item with a short status or metadata; optionally links to its details.",
  variants: {
    variant: ["soft", "solid", "outline", "color", "modern"],
    tone: ["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted"],
    size: ["sm", "md", "lg"],
  },
  booleans: ["pill", "dot", "dot-only", "icon-only", "truncate", "uppercase"],
  elements: ["dot", "leading-icon", "label", "trailing-icon", "avatar", "flag", "dismiss"],
  defaults: { variant: "soft", tone: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const indicator = {
  block: "area-indicator", description: "Displays a compact notification count or activity dot.",
  variants: {kind: ["count", "dot"], tone: ["accent", "neutral", "info", "success", "warning", "danger"]},
  states: ["processing", "border"],
  defaults: {kind: "dot", tone: "danger"},
} as const satisfies ComponentManifest;

export const presence = {
  block: "area-presence", description: "Shows availability with Area-drawn status glyphs at the icon line weight.",
  variants: {status: ["available", "away", "busy", "do-not-disturb", "blocked", "offline", "out-of-office", "unknown"], size: ["xs", "sm", "md", "lg"]},
  states: ["out-of-office"],
  defaults: {status: "available", size: "md"},
} as const satisfies ComponentManifest;

export const indicatorAnchor = {
  block: "area-indicator-anchor",
  description: "Attaches a count or presence indicator to an accessibly named object.",
  variants: { placement: ["top-end", "top-start", "bottom-end", "bottom-start"], overlap: ["overlap-rectangular", "overlap-circular"] },
  states: ["invisible"],
  booleans: ["compact"],
  elements: ["indicator"],
  defaults: { placement: "top-end", overlap: "overlap-rectangular" },
} as const satisfies ComponentManifest;

export const badgeGroup = {
  block: "area-badge-group",
  description: "Wraps badges or collapses overflow behind a disclosure.",
  variants: { overflow: ["inline", "overlay"] },
  elements: ["item", "overflow-trigger", "overflow-content"],
  defaults: { overflow: "inline" },
} as const satisfies ComponentManifest;

export const avatar = {
  block: "area-avatar",
  description: "Represents a user or entity.",
  variants: {
    size: ["sm", "md", "lg"],
    shape: ["circle", "square"],
    tone: ["neutral", "accent", "inverse"],
  },
  booleans: ["active"],
  elements: ["image", "icon"],
  defaults: { size: "md", shape: "circle", tone: "neutral" },
} as const satisfies ComponentManifest;

export const avatarGroup = {
  block: "area-avatar-group",
  description: "Stacks related avatars and summarizes any hidden remainder.",
  variants: {},
  elements: ["item", "overflow"],
  defaults: {},
} as const satisfies ComponentManifest;

export const separator = {
  block: "area-separator",
  description: "Divides related groups of content.",
  variants: { orientation: ["horizontal", "vertical"], spacing: ["none", "normal"] },
  booleans: ["inset"],
  elements: [],
  defaults: { orientation: "horizontal", spacing: "none" },
} as const satisfies ComponentManifest;

export const skeleton = {
  block: "area-skeleton",
  description: "Stands in for content that has not loaded.",
  variants: { shape: ["text", "circle", "rectangle", "rounded"] },
  elements: [],
  defaults: { shape: "text" },
} as const satisfies ComponentManifest;

export const spinner = {
  block: "area-spinner",
  description: "Indicates an action in progress with no known duration.",
  variants: { size: ["sm", "md", "lg"], tone: ["neutral", "accent"] },
  elements: [],
  defaults: { size: "md", tone: "neutral" },
} as const satisfies ComponentManifest;

export const progress = {
  block: "area-progress",
  description: "Shows how far along a task is.",
  variants: { size: ["sm", "md", "lg"], tone: ["neutral", "accent"] },
  states: ["indeterminate"],
  elements: ["bar"],
  defaults: { size: "md", tone: "neutral" },
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
  description: "Groups related media, content and actions on one surface.",
  variants: { layout: ["vertical", "horizontal", "compact", "immersive"] },
  elements: ["title", "description", "content", "footer", "media", "action", "carousel"],
  defaults: { layout: "vertical" },
} as const satisfies ComponentManifest;

export const alert = {
  block: "area-alert",
  description: "Draws attention to an important message in place.",
  variants: { tone: ["neutral", "accent", "info", "danger", "warning", "success"], layout: ["single-line", "multiline"] },
  elements: ["icon", "content", "title", "description", "link", "actions", "dismiss"],
  defaults: { tone: "neutral", layout: "single-line" },
} as const satisfies ComponentManifest;

export const dialog = {
  block: "area-dialog",
  description: "Interrupts with content that requires a response.",
  variants: {},
  elements: ["header", "heading", "title", "description", "close", "body", "footer", "modal"],
  defaults: {},
} as const satisfies ComponentManifest;

export const popover = {
  block: "area-popover",
  description: "Floats rich, interactive content next to the element that opened it.",
  variants: { side: ["top", "right", "bottom", "left"] },
  booleans: ["arrow"],
  elements: ["header", "title", "description", "body", "footer", "media", "arrow", "arrow-edge"],
  defaults: { side: "top" },
} as const satisfies ComponentManifest;

export const menu = {
  block: "area-menu",
  description: "Lists actions triggered from a button.",
  variants: {},
  states: ["disabled", "highlighted", "selected"],
  elements: ["item", "icon", "text", "label", "separator", "shortcut", "search-surface"],
  elementModifiers: { item: ["danger"] },
  defaults: {},
} as const satisfies ComponentManifest;

export const tooltip = {
  block: "area-tooltip",
  description: "Names a control on hover or focus.",
  variants: { side: ["top", "right", "bottom", "left"] },
  booleans: ["arrow"],
  elements: [],
  defaults: { side: "top" },
} as const satisfies ComponentManifest;

export const toast = {
  block: "area-toast",
  description: "Reports the outcome of an action without interrupting.",
  variants: { tone: ["info", "danger", "warning", "success"] },
  elements: ["icon", "content", "title", "action", "dismiss"],
  defaults: { tone: "info" },
} as const satisfies ComponentManifest;

export const tabs = {
  block: "area-tabs",
  description: "Switches between views with transparent tabs and rounded indicators; labels align with panel content.",
  variants: { size: ["sm", "md", "lg"], orientation: ["vertical"] },
  booleans: ["track"],
  states: ["selected", "disabled"],
  elements: ["list", "tab", "panel", "label", "icon"],
  defaults: {},
} as const satisfies ComponentManifest;

export const table = {
  block: "area-table",
  description: "Presents rows of structured data.",
  variants: { size: ["sm", "md", "lg"] },
  booleans: ["interactive", "striped", "column-dividers"],
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
  variants: { size: ["sm", "md", "lg"] },
  booleans: ["full-width", "icon-only"],
  states: ["selected", "disabled"],
  stateAttributes: { disabled: "disabled" },
  elements: ["item", "icon", "label"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const code = {
  block: "area-code",
  description: "Marks source or a design token inline.",
  variants: { ground: ["on-color", "subtle"] },
  booleans: ["swatch"],
  elements: ["swatch", "label"],
  defaults: {},
} as const satisfies ComponentManifest;

export const codeBlock = {
  block: "area-code-block",
  description: "Shows a block of code with an optional file header, numbered lines and a copy action.",
  variants: {},
  booleans: ["flush", "wrap", "unnumbered"],
  states: ["collapsed"],
  elements: ["header", "title", "language", "languages", "select", "tab", "actions", "body", "pre", "code", "line", "gutter", "linenumber", "marker", "text", "toggle"],
  elementModifiers: { line: ["highlighted", "added", "removed"] },
  defaults: {},
} as const satisfies ComponentManifest;

export const nav = {
  block: "area-nav",
  description: "Site navigation, vertical or horizontal.",
  // `orientation` is the axis; `tone` decides what a current item's plate carries. A nav
  // with neither modifier is vertical and neutral, which is the sidebar case.
  variants: { orientation: ["horizontal"], tone: ["accent"], selection: ["marker"] },
  elements: ["group", "label", "item", "icon", "text", "trailing", "separator", "row", "actions"],
  defaults: {},
} as const satisfies ComponentManifest;

export const token = {
  block: "area-token",
  description: "Deprecated compatibility alias for Code with a token swatch.",
  variants: { ground: ["on-color", "subtle"] },
  elements: ["swatch", "label"],
  defaults: {},
} as const satisfies ComponentManifest;

export const kbd = {
  block: "area-kbd",
  description: "Marks a keyboard shortcut.",
  variants: {
    size: ["small", "normal"],
    appearance: ["default", "quiet", "on-color", "on-emphasis"],
  },
  elements: ["key"],
  defaults: { size: "normal", appearance: "default" },
} as const satisfies ComponentManifest;

export const kbdGroup = {
  block: "area-kbd-group",
  description: "Groups chord hints into a keyboard shortcut sequence.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const MANIFESTS = {
  button,
  buttonGroup,
  toolbar,
  alignmentPicker,
  colorPicker,
  colorSwatch,
  colorSwatchPicker,
  colorField,
  field,
  input,
  numberField,
  inputGroup,
  breadcrumb,
  treeView,
  composer,
  textarea,
  select,
  checkbox,
  checkboxGroup,
  radio,
  radioGroup,
  switch: switchControl,
  slider,
  chip,
  chipGroup,
  choiceLabel,
  badge,
  presence,
  indicatorAnchor,
  indicator,
  badgeGroup,
  avatar,
  avatarGroup,
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
  token,
  kbd,
  kbdGroup,
} as const satisfies Record<string, ComponentManifest>;
