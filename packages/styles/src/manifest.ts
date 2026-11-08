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
      "info",
      "success",
      "warning",
      "caution",
      "danger",
      "discovery",
    ],
    size: ["sm", "md", "lg"],
    align: ["start", "end"],
  },
  booleans: ["full-width", "icon-only", "pill", "rounded", "on-color"], // pill / rounded override data-area-pills (2026-10-04)
  // inactive: looks disabled but keeps focus and says why (`inactiveText`; components audit V2, 2026-11-07).
  states: ["disabled", "loading", "selected", "inactive"],
  elements: ["icon", "label"],
  defaults: { variant: "solid", tone: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const buttonGroup = {
  block: "area-button-group",
  description: "Joins related full-size button actions at shared edges.",
  variants: { variant: ["soft", "outline"], size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  defaults: { variant: "soft", size: "md" },
} as const satisfies ComponentManifest;

export const toggleGroup = {
  block: "area-toggle-group",
  description: "Keeps a set of toggle buttons: any number pressed, or at most one.",
  variants: { variant: ["soft", "outline", "ghost"], size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  defaults: { variant: "soft", size: "md" },
} as const satisfies ComponentManifest;

export const splitButton = {
  block: "area-split-button",
  description: "Joins a default action to a menu of related actions.",
  // size: Button's tiers, passed to both parts (the React prop since the family was built; listed 2026-11-07, O7).
  variants: { variant: ["solid", "soft", "outline", "ghost"], size: ["sm", "md", "lg"] },
  booleans: ["icon-only"],
  elements: ["action", "trigger", "menu"],
  defaults: { variant: "solid", size: "md" },
} as const satisfies ComponentManifest;

export const toolbar = {
  block: "area-toolbar",
  description: "Groups commands with keyboard navigation and optional overflow.",
  variants: { variant: ["plain", "surface"], size: ["sm", "md", "lg"], orientation: ["horizontal", "vertical"] },
  // floating: the hover action bar (components audit N14, 2026-11-07; docs/specs/toolbar.md): over its parent's top-end
  // corner, shown while the parent is hovered or holds focus.
  booleans: ["full-width", "floating"],
  elements: ["group", "separator"],
  defaults: { variant: "plain", size: "md", orientation: "horizontal" },
} as const satisfies ComponentManifest;

export const alignmentPicker = {
  block: "area-alignment-picker",
  description: "Chooses one of nine physical alignment positions.",
  // `soft` names the field fill it borrows; `surface` means a lifted plate elsewhere (audit F-20).
  // Responsive (owner, 2026-10-04): fills its parent; sizes and the stretch layouts were removed.
  variants: { variant: ["soft", "plain"] },
  // `preview`: the cell shows the glyph it would set (a static hover hook for docs, data-preview).
  states: ["preview"],
  elements: ["cell", "dot"],
  defaults: { variant: "soft" },
} as const satisfies ComponentManifest;

export const colorPicker = {
  block: "area-color-picker",
  variants: { variant: ["surface", "plain"] }, defaults: { variant: "surface" },
  description: "Edits a color like Figma's fill picker, with spectrum, grid and slider views, six color models, a contrast check, a before/after preview and saved swatches; or picks an exact OKLCH colour inside a gamut.",
  elementModifiers: { area: ["gamut"] },
  elements: ["header", "body", "views", "contrast", "contrast-pair", "contrast-ratio", "contrast-unit", "contrast-level", "area", "plane", "band", "band-region", "band-edge", "thumb", "channel", "grid", "controls", "tracks", "channel-row", "channel-label", "slider", "hue", "alpha", "preview", "preview-new", "preview-original", "values", "model", "fields", "text-field", "opacity", "note", "swatches", "heading"],
} as const satisfies ComponentManifest;

export const calendar = {
  block: "area-calendar",
  description: "Shows a month grid for choosing a date, a range or several dates.",
  variants: { variant: ["plain", "surface"], days: ["square", "circle", "tile"], layout: ["month", "week"], caption: ["label", "menus"] },
  elements: ["months", "month", "header", "title", "nav", "menus", "grid", "weekday", "cell", "day", "day-number", "day-weekday", "day-month", "marker", "week"],
  defaults: { variant: "surface", days: "square", layout: "month", caption: "label" },
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
  variants: { size: ["sm", "md", "lg"], layout: ["grid", "row", "palette"] },
  elements: ["cell"],
  defaults: { size: "md", layout: "grid" },
} as const satisfies ComponentManifest;

export const colorField = {
  block: "area-color-field",
  description: "Edits a hex color beside its preview, with optional split opacity.",
  // variant: Input's treatments, passed to the field (the React prop since the family was built; listed 2026-11-07, O7).
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] },
  booleans: ["full-width", "alpha"],
  elements: ["opacity"],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const field = {
  block: "area-field",
  description: "Labels and describes one form control, including its validation message.",
  variants: { orientation: ["vertical", "horizontal", "auto"] },
  booleans: ["inline"],
  states: ["disabled"],
  elements: ["head", "label", "required", "description", "count", "validation", "error"],
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

export const searchField = {
  block: "area-search-field",
  description: "A field for a search query: a search glyph, a clear action once there is text, Escape to clear.",
  variants: {},
  elements: ["clear", "shortcut"],
  defaults: {},
} as const satisfies ComponentManifest;

export const passwordField = {
  block: "area-password-field",
  description: "A field for a password, with an action that shows it as text and hides it again.",
  variants: {},
  elements: ["reveal"],
  defaults: {},
} as const satisfies ComponentManifest;

export const otpField = {
  block: "area-otp-field",
  description: "A one-time code drawn as a row of character slots over one real input.",
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] },
  // success / warning: a Field's status, as Input's (components audit 2026-11-07, O1).
  states: ["invalid", "success", "warning", "disabled", "read-only"],
  elements: ["group", "slot", "caret", "separator", "control"],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const timeField = {
  block: "area-time-field",
  description: "A time of day typed in segments, with an optional list of times at a fixed step.",
  variants: {},
  elements: ["segments", "part", "literal", "segment", "period", "list", "trigger"],
  defaults: {},
} as const satisfies ComponentManifest;

export const numberField = {
  block: "area-number-field",
  description: "Edits a number with optional units, stepping and scrubbing.",
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"], steppers: ["split"] },
  booleans: ["full-width"],
  states: ["disabled", "read-only", "invalid", "success", "warning", "scrubbing"],
  elements: ["control", "unit", "scrub", "steppers", "step", "trailing"],
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
  booleans: ["nowrap"], // one line in a fixed-height bar, the page cut first (2026-10-25)
  elements: ["list", "item", "link", "page", "separator", "chevron", "ellipsis"],
  defaults: {},
} as const satisfies ComponentManifest;

export const fileUpload = {
  block: "area-file-upload",
  description: "Takes files by click or drag and drop.",
  variants: {},
  states: ["dragging", "invalid", "disabled"],
  elements: ["icon", "text", "prompt", "action", "hint", "input"],
  defaults: {},
} as const satisfies ComponentManifest;

export const fileUploadList = {
  block: "area-file-upload-list",
  description: "Lists the files being or already uploaded.",
  variants: {},
  defaults: {},
} as const satisfies ComponentManifest;

export const fileUploadItem = {
  block: "area-file-upload-item",
  description: "Shows one file's upload: name, size, progress, and remove or retry.",
  variants: { status: ["uploading", "complete", "error"] },
  elements: ["icon", "body", "header", "text", "name", "meta", "separator", "status", "actions", "progress", "percent"],
  defaults: { status: "uploading" },
} as const satisfies ComponentManifest;

export const meter = {
  block: "area-meter",
  description: "Shows a value within a known range, such as usage against a limit.",
  // size: the track's height, Progress's tiers (the React prop since the family was built; listed 2026-11-07, O7).
  variants: { tone: ["neutral", "warning", "danger", "data"], size: ["sm", "md", "lg"] },
  // segmented: parts of the measure on the bar, named in a legend (owner 2026-10-30, docs/research/inspector-panel-2026-10-30).
  booleans: ["segmented"],
  elements: ["header", "label", "value", "track", "segment", "rest", "legend", "item", "swatch", "item-label", "item-value", "item-share", "description"],
  defaults: { tone: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const descriptionList = {
  block: "area-description-list",
  description: "Lists labelled values: a term and its value per row.",
  variants: { layout: ["columns", "justified"] },
  booleans: ["divided", "framed"],
  elements: ["item", "term", "icon", "label", "value", "more", "more-label"],
  defaults: { layout: "columns" },
} as const satisfies ComponentManifest;

export const emptyState = {
  block: "area-empty-state",
  description: "Says a region has nothing to show yet, and how to fill it.",
  variants: { size: ["sm", "md"] },
  elements: ["icon", "content", "title", "description", "actions"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const scrollArea = {
  block: "area-scroll-area",
  description: "Scrolls its content with a thin overlay scrollbar.",
  variants: { type: ["hover", "scroll", "always"] },
  states: ["scrolling", "overflow-x", "overflow-y"],
  elements: ["viewport", "content", "scrollbar", "thumb"],
  defaults: { type: "hover" },
} as const satisfies ComponentManifest;

export const link = {
  block: "area-link",
  description: "Goes to another page or place, inline in text or on its own.",
  variants: { variant: ["inline", "standalone"], ink: ["inherit", "muted", "action", "blue", "purple", "pink", "green", "red", "orange", "brown"] },
  elements: ["icon"],
  defaults: { variant: "inline", ink: "inherit" },
} as const satisfies ComponentManifest;

export const toggletip = {
  block: "area-toggletip",
  description: "Shows a short note about a label from a small info or help button.",
  variants: { size: ["sm", "md"] },
  // expanded: pinned open by a press (aria-expanded); the hover and focus preview leaves it false.
  states: ["expanded"],
  elements: ["surface"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const pagination = {
  block: "area-pagination",
  description: "Moves between the pages of a long list or result set.",
  variants: { layout: ["pages", "compact"], size: ["sm", "md", "lg"] },
  elements: ["list", "item", "page", "ellipsis", "status", "value", "step"],
  defaults: { layout: "pages", size: "md" },
} as const satisfies ComponentManifest;

export const treeView = {
  block: "area-tree-view",
  description: "Navigates or selects items in an expandable hierarchy.",
  // sm: the file tree's density; guides: indent lines on hover (owner 2026-10-30, docs/research/inspector-panel-2026-10-30).
  variants: { selectionMode: ["navigation", "checkbox"], size: ["sm", "md"] },
  booleans: ["guides"],
  // pinned, pin: stickyBranches' open branches held at the top of the scroll (2026-11-01).
  // unseen: a dot for a row changed since it was last looked at, apart from its status (components audit D6, 2026-11-07).
  elements: ["chevron", "check", "icon", "label", "trailing", "unseen", "status", "actions", "pinned", "pin"],
  defaults: { selectionMode: "navigation", size: "md" },
} as const satisfies ComponentManifest;

export const composer = {
  block: "area-composer",
  description: "Writes and submits a message with optional action slots.",
  variants: { layout: ["inline", "stacked"] },
  states: ["disabled", "dragging"],
  elements: ["context", "entry", "input", "actions", "extras", "footer", "submit", "mic", "attach", "file"],
  elementModifiers: { actions: ["leading", "trailing"] },
  defaults: { layout: "inline" },
} as const satisfies ComponentManifest;

export const composerGroup = {
  block: "area-composer-group",
  description: "A Composer with rows around its shell: a header above, a footer below.",
  variants: {},
  elements: ["header", "footer", "note"],
  defaults: {},
} as const satisfies ComponentManifest;

export const textarea = {
  block: "area-textarea",
  description: "Accepts multiple lines of text.",
  variants: {
    variant: ["outline", "soft"],
    size: ["sm", "md"], // lg removed: it differed from md by 4px of inset (audit B-24 A)
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
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  states: ["invalid", "success", "warning", "disabled"],
  stateAttributes: { disabled: "disabled", invalid: "aria-invalid" },
  elements: [],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const checkbox = {
  block: "area-checkbox",
  description: "Toggles a single independent option.",
  // soft and list (owner 2026-10-25, Notion Calendar's settings rows, a proposal card's options): a filled option with
  // its control first and a value at its end.
  variants: { variant: ["card", "soft"], layout: ["row", "list", "tile", "preview", "media", "media-row"], size: ["md", "lg"] },
  // read-only: a state set elsewhere, not toggled (components audit 2026-11-07, O2; a native checkbox ignores readonly).
  states: ["checked", "indeterminate", "disabled", "invalid", "read-only"],
  elements: ["control", "visual", "meta"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const checkboxGroup = {
  block: "area-checkbox-group",
  description: "Groups related Checkbox options under one label.",
  variants: { orientation: ["vertical", "horizontal"] },
  states: ["disabled", "invalid", "success", "warning", "read-only"],
  elements: ["legend", "description", "options", "validation"],
  defaults: { orientation: "vertical" },
} as const satisfies ComponentManifest;

export const radio = {
  block: "area-radio",
  description: "Picks one option from a mutually exclusive set.",
  variants: { variant: ["card", "soft"], layout: ["row", "list", "tile", "preview", "media", "media-row"], size: ["md", "lg"] },
  // read-only: set on each option of a read-only Radio group.
  states: ["disabled", "read-only"],
  elements: ["control", "visual", "meta"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const radioGroup = {
  block: "area-radio-group",
  description: "Groups mutually exclusive Radio options under one label.",
  variants: { orientation: ["vertical", "horizontal"] },
  // read-only: a value shown, not chosen here (owner 2026-10-26: Setup's past answers): the chosen option drops its
  // selected edge and tint. Spelled `readonly` / `data-readonly` until 2026-11-07 (O2), still painted for one release.
  // success / warning: a non-error validation message, as Checkbox group's (O1).
  states: ["disabled", "invalid", "success", "warning", "read-only"],
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
  },
  booleans: ["full-width", "pill", "rounded"], // pill / rounded override data-area-pills (2026-10-04)
  states: ["checked", "disabled", "read-only", "loading", "hover", "active", "focus-visible"],
  stateAttributes: { checked: "checked" },
  elements: ["control", "track", "thumb", "text", "label", "description", "loading"],
  defaults: { size: "md", labelPosition: "end", track: "short" },
} as const satisfies ComponentManifest;

export const sliderRange = {
  block: "area-slider-range",
  description: "Picks a range with two handles on one rail, with optional number fields.",
  variants: { size: ["sm", "md", "lg"], variant: ["track", "bar"] },
  states: ["overlap", "disabled", "pressed", "dragging"],
  elements: ["track", "input", "start", "end"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const slider = {
  block: "area-slider",
  description: "Picks a value from an ordered range.",
  variants: {
    size: ["sm", "md", "lg"],
    variant: ["track", "bar"],
    labelPosition: ["top", "inside"],
    orientation: ["vertical"],
  },
  states: ["disabled", "hover", "focus-visible", "pressed", "dragging"],
  elements: ["label", "track", "control", "rail", "fill", "buffer", "thumb", "value", "marks", "ends", "end"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const chip = {
  block: "area-chip",
  description: "Toggles a filter, or holds an input value, in a set that wraps (each chip toggles on its own).",
  variants: { kind: ["assist", "filter", "input", "suggestion"], size: ["sm", "md", "lg"] },
  booleans: ["swatch-only", "link", "link-icon", "pill", "rounded"], // pill / rounded override data-area-pills (2026-10-04)
  states: ["selected", "disabled", "invalid"],
  elements: ["swatch", "icon", "trailing-icon", "avatar", "image", "label", "action", "dismiss"],
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
  description: "The title and description beside a checkbox or radio (Switch draws its own).",
  variants: {},
  elements: ["title", "description"],
  defaults: {},
} as const satisfies ComponentManifest;

export const badge = {
  block: "area-badge",
  description: "Labels an item with a short status or metadata; optionally links to its details.",
  variants: {
    variant: ["soft", "solid", "outline", "color", "modern", "plain"],
    tone: ["neutral", "info", "success", "warning", "caution", "danger", "discovery", "inverse"],
    size: ["sm", "md", "lg"],
  },
  booleans: ["dot", "dot-only", "icon-only", "truncate", "pill", "rounded", "on-color"], // pill / rounded override data-area-pills (2026-10-04)
  elements: ["dot", "leading-icon", "label", "trailing-icon", "avatar", "flag", "dismiss"],
  defaults: { variant: "soft", tone: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const indicator = {
  block: "area-indicator", description: "Displays a compact notification count or activity dot.",
  // tone: Button's and Badge's seven (components audit 2026-11-07, O4).
  variants: {kind: ["count", "dot"], tone: ["neutral", "info", "success", "warning", "caution", "danger", "discovery"]},
  states: ["processing", "border"],
  defaults: {kind: "dot", tone: "danger"},
} as const satisfies ComponentManifest;

export const count = {
  block: "area-count", description: "Shows how many items the element it sits in holds, beside that element's label.",
  variants: { variant: ["plain", "soft"], size: ["sm", "md"] },
  booleans: ["pill", "rounded"], // pill / rounded override data-area-pills (2026-10-04)
  elements: ["label"],
  defaults: { variant: "plain", size: "md" },
} as const satisfies ComponentManifest;

export const accordionItem = {
  block: "area-accordion-item", description: "One collapsible: shows or hides content under a title the reader clicks.",
  variants: { variant: ["plain", "divided"], size: ["sm", "md"] },
  states: ["open", "disabled"],
  elements: ["heading", "trigger", "chevron", "label", "content"],
  defaults: { variant: "plain", size: "md" },
} as const satisfies ComponentManifest;

export const accordion = {
  block: "area-accordion", description: "Stacks accordion items; opening one closes the others unless multiple.",
  variants: {},
  defaults: {},
} as const satisfies ComponentManifest;

/* Agent chat (Phase 2 of docs/research/inspector-chat-2026-10-18): what an agent did, changed, asks and plans. */
export const step = {
  block: "area-step", description: "One thing an agent did, on one line: the verb (live, then past tense) and what it acted on; opens to its input and output.",
  variants: {},
  booleans: ["group", "reasoning"],
  states: ["open", "running", "error"], // the shared word (Governance § 4, 2026-11-07); data-failed is a deprecated alias
  elements: ["row", "icon", "verb", "detail", "meta", "chevron", "body", "items"],
  defaults: {},
} as const satisfies ComponentManifest;

export const editSummary = {
  block: "area-edit-summary", description: "What an agent changed in a turn: files with their +N −N, each opening to its diff, with Keep and Undo.",
  // variant: surface, its own frame (a tray, a panel); plain, no frame, its words on the reply's text edge, as a turn's
  // steps (owner 2026-11-02, the Chat kit: "the tracker, do they need containers?"; Claude Code's rows carry no box).
  variants: { variant: ["surface", "plain"] },
  states: ["open", "kept", "undone"],
  // deleted: the shared change word (components audit D6, 2026-11-07); removed, its deprecated part name.
  elements: ["head", "title", "counts", "added", "deleted", "removed", "actions", "files", "file", "name", "icon", "base", "folder", "chevron", "status", "diff"],
  defaults: {}, // variant unset draws the frame (surface), so the default writes no class
} as const satisfies ComponentManifest;

export const diff = {
  block: "area-diff", description: "A unified diff in Code block sm's metrics: line numbers, a + or − marker and a tint on added and removed lines, folds between hunks.",
  variants: {},
  elements: ["lines", "line", "number", "marker", "text", "fold"],
  elementModifiers: { line: ["added", "deleted", "removed"] }, // removed: deprecated for deleted (components audit D6)
  defaults: {},
} as const satisfies ComponentManifest;

export const approval = {
  block: "area-approval", description: "An agent asks before it acts: what and why, the thing itself, numbered choices with their scope (stacked, or in a grid of words or pictures), and a field to say what to do instead.",
  // layout: grid, the choices in as many columns as fit, for short words and pictured choices (owner 2026-11-03, visual
  // questions: "a vertical list of answers to select from or horizontal list or grid of answers").
  // variant: surface, its own card; plain, no card (owner 2026-11-04, several questions in one card, as Cursor's IDE pane
  // lists them; Plan's and Edit summary's plain).
  variants: { layout: ["list", "grid"], variant: ["surface", "plain"] },
  // The question card's parts (owner 2026-10-28, Setup as a chat panel; Claude Code's AskUserQuestion): the head's
  // actions, an option's description and check, the foot's footer.
  elements: ["head", "heading", "title", "description", "actions", "detail", "options", "option", "tile", "visual", "key", "lines", "label", "option-description", "check", "instead", "field", "skip", "foot", "hint", "footer"],
  states: ["selected"], // an option's, as Menu's rows (data-selected: the answer given)
  defaults: { layout: "list", variant: "surface" },
} as const satisfies ComponentManifest;

export const plan = {
  block: "area-plan", description: "A plan's progress: what is done, what is happening now, what is next, with its count and an optional bar; folds to its head.",
  // bar: a bar under the head that stays when folded, one for the whole plan or one segment per item (owner 2026-10-25,
  // progress trackers: GitHub's segmented ProgressBar, Cursor's segmented bar, Linear's project bar).
  // variant: surface, its own frame; plain, no frame, as Edit summary's (owner 2026-11-02, the Chat kit).
  variants: { bar: ["none", "single", "segmented"], variant: ["surface", "plain"] },
  // rail: the marks joined by a line, a timeline whose items carry detail and steps (owner 2026-10-25, the agent run).
  booleans: ["rail"],
  states: ["open"],
  elements: ["head", "icon", "title", "count", "chevron", "bar", "segment", "items", "item", "mark", "text", "detail", "meta", "steps"],
  elementModifiers: { item: ["complete", "current", "pending", "cancelled", "done"], mark: ["ring"] }, // done: a deprecated alias of complete (2026-11-07)
  defaults: { bar: "none" }, // variant unset draws the frame (surface), so the default writes no class
} as const satisfies ComponentManifest;

export const turnNotice = {
  block: "area-turn-notice", description: "How a turn ended, on one quiet line: stopped, failed (with Retry) or compacted.",
  variants: { status: ["stopped", "error", "compacted"] }, // an outcome, so `status` (Governance § 4); was `kind` until 2026-10-19
  elements: ["icon", "text", "action"],
  defaults: { status: "stopped" },
} as const satisfies ComponentManifest;

export const attachment = {
  block: "area-attachment", description: "Something attached to a message before it is sent (an image, a file, a quote or a video): a remove control, and its upload's progress or failure.",
  // kind: file, quote and video beside the image (components audit V10, 2026-11-07). status: the shared words
  // (Governance § 4) and the upload's own; ready is a deprecated alias of complete, kept for one release.
  variants: { kind: ["image", "file", "quote", "video"], status: ["complete", "uploading", "error", "ready"] },
  elements: ["image", "overlay", "mark", "dismiss", "play", "body", "head", "icon", "name", "badge", "quote", "text"],
  defaults: { kind: "image", status: "complete" },
} as const satisfies ComponentManifest;

export const composerMenu = {
  block: "area-composer-menu", description: "The @ and / suggestions above the composer: Menu rows with an icon, a name and a muted path, in groups.",
  variants: {},
  elements: ["path", "empty"],
  defaults: {},
} as const satisfies ComponentManifest;

export const queue = {
  block: "area-queue", description: "Messages sent while an agent works, waiting their turn above the composer: each can be sent now or removed.",
  variants: {},
  states: ["open"],
  elements: ["head", "title", "chevron", "items", "item", "text", "status", "actions"],
  elementModifiers: { item: ["sending", "error", "failed"] }, // failed: a deprecated alias of error (2026-11-07)
  defaults: {},
} as const satisfies ComponentManifest;

export const timestamp = {
  block: "area-timestamp", description: "When a turn was sent, centred between turns after a pause.",
  variants: {},
  defaults: {},
} as const satisfies ComponentManifest;

export const presence = {
  block: "area-presence", description: "Shows availability with Area-drawn status glyphs at the icon line weight.",
  variants: {status: ["available", "away", "busy", "do-not-disturb", "blocked", "offline", "out-of-office", "unknown"], size: ["sm", "md", "lg"]}, // xs dropped: audit C-19
  states: ["out-of-office"],
  defaults: {status: "available", size: "md"},
} as const satisfies ComponentManifest;

export const indicatorAnchor = {
  block: "area-indicator-anchor",
  description: "Attaches a count or presence indicator to an accessibly named object.",
  variants: { placement: ["top-end", "top-start", "bottom-end", "bottom-start"], overlap: ["rectangular", "circular"] },
  states: ["invisible"],
  booleans: ["inset"],
  elements: ["indicator"],
  defaults: { placement: "top-end", overlap: "rectangular" },
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
    size: ["xs", "sm", "md", "lg"],
    shape: ["circle", "square"],
    tone: ["neutral", "inverse"],
  },
  booleans: ["active"],
  elements: ["image", "icon"],
  defaults: { size: "md", tone: "neutral" }, // shape unset: data-area-pills decides (circle by default)
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
  variants: { shape: ["block", "text", "circle"] },
  booleans: ["static", "wrap"],
  // waiting: a `delay` that has not passed yet; the placeholder keeps its box, invisible (components audit V6, 2026-11-07).
  states: ["waiting"],
  elements: ["lines"],
  defaults: { shape: "block" },
} as const satisfies ComponentManifest;

export const spinner = {
  block: "area-spinner",
  description: "Indicates an action in progress: turning with no known end, or stopped at a value.",
  variants: { size: ["sm", "md", "lg"] },
  // waiting: a `delay` that has not passed yet; the ring keeps its box, invisible, its label held back (V6, 2026-11-07).
  states: ["determinate", "waiting"],
  elements: ["track", "arc"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const progress = {
  block: "area-progress",
  description: "Shows how far along a task is.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["indeterminate"],
  elements: ["bar"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const panel = {
  block: "area-panel",
  description: "A titled surface of rows that act on something beside it.",
  variants: { size: ["sm", "md"] },
  booleans: ["flush", "bare-bar", "bare-footer", "action-column", "window-bar"],
  states: ["collapsed", "resizable", "resizing"],
  elements: ["resize", "bar", "title", "body", "section", "heading", "heading-text", "count", "actions", "toggle", "toggle-text", "chevron", "summary", "rows", "row", "row-label", "row-controls", "row-action", "stack", "footer"],
  // reveal: the heading's actions show on hover or focus (owner 2026-10-30, docs/research/inspector-panel-2026-10-30).
  elementModifiers: { section: ["reveal"] },
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const propertyList = {
  block: "area-property-list",
  description: "Orders like properties (fills, strokes, effects) and moves them by handle or keyboard.",
  variants: {},
  states: ["dragging", "inactive"],
  elements: ["item", "handle", "value", "actions", "indicator"],
  defaults: {},
} as const satisfies ComponentManifest;

export const modelPicker = {
  block: "area-model-picker",
  description: "Chooses the model a message is sent with, and how hard it works, from inside the composer.",
  variants: {},
  elements: ["trigger", "name", "effort"],
  defaults: {},
} as const satisfies ComponentManifest;

export const scrollToLatest = {
  block: "area-scroll-to-latest",
  description: "Returns a long conversation to its newest message.",
  variants: {},
  states: ["visible"],
  defaults: {},
} as const satisfies ComponentManifest;

export const message = {
  block: "area-message",
  description: "One turn in a conversation: the person's bubble or the assistant's prose, with actions.",
  // status: the person's message on its way, sending (Queue's word for the activity) or error (not sent; components
  // audit O6, 2026-11-07). Unset once sent, so it has no default.
  variants: { author: ["user", "assistant"], status: ["sending", "error"] },
  // waiting: a sending line's wait before it shows (Spinner's `delay`, V6).
  states: ["streaming", "waiting"],
  // stack: MessageGroup's turns or a split message's bubbles, 2 apart (V9); status: the sending or not-sent line.
  elements: ["bubble", "content", "actions", "cursor", "stack", "status", "status-text"],
  // The bare block is the assistant's layout (audit S17, G-24).
  defaults: { author: "assistant" },
} as const satisfies ComponentManifest;

export const promptSuggestions = {
  block: "area-prompt-suggestions",
  description: "Starter prompts under an empty composer.",
  variants: { layout: ["list", "chips"] },
  elements: ["row", "item", "icon", "text", "shortcut", "dismiss"],
  defaults: { layout: "list" },
} as const satisfies ComponentManifest;

export const hoverCard = {
  block: "area-hover-card",
  description: "Previews what a link points to while the pointer rests on it.",
  variants: {},
  elements: ["identity", "meta"],
  defaults: {},
} as const satisfies ComponentManifest;

export const contextMenu = {
  block: "area-context-menu",
  description: "Opens a Menu where you right-click.",
  variants: {},
  elements: ["menu"],
  defaults: {},
} as const satisfies ComponentManifest;

export const commandPalette = {
  block: "area-command-palette",
  description: "Searches actions and places from a shortcut, and runs the one you pick.",
  variants: {},
  booleans: ["inline"],
  // path, more, back, step, body, preview: a result's path, a step's chevron, Back and trail, and the preview pane
  // beside the results (components audit V4, 2026-11-07).
  elements: ["modal", "search", "search-icon", "input", "list", "group", "item", "text", "description", "path", "more", "back", "step", "body", "preview", "empty", "footer", "hint", "keys"],
  defaults: {},
} as const satisfies ComponentManifest;

export const combobox = {
  block: "area-combobox",
  description: "An editable field with suggestions that filter as you type.",
  variants: {},
  booleans: ["full-width"],
  states: ["open"],
  elements: ["listbox", "option", "description", "empty", "group"],
  defaults: {},
} as const satisfies ComponentManifest;

export const customSelect = {
  block: "area-custom-select",
  description: "Picks a value (or several, with multiple) from a short list whose options carry icons, descriptions and groups, as rows or a grid of previews.",
  variants: { variant: ["outline", "soft", "ghost"], size: ["sm", "md", "lg"], layout: ["list", "grid"] },
  booleans: ["full-width"],
  // success / warning (a Field's status, O1) and read-only (a value set elsewhere, O2), as Input's (2026-11-07).
  states: ["open", "disabled", "invalid", "success", "warning", "read-only"],
  stateAttributes: { disabled: "disabled", invalid: "aria-invalid" },
  // panel, header, filter, select-all, footer: the list with its filter field, Select all and footer (components audit V7,
  // 2026-11-07).
  elements: ["trigger", "icon", "value", "chevron", "listbox", "option", "group", "separator", "grid", "preview", "caption", "panel", "header", "filter", "select-all", "footer"],
  defaults: { variant: "outline", size: "md", layout: "list" },
} as const satisfies ComponentManifest;

export const tag = {
  block: "area-tag",
  description: "A coloured label for a chosen or typed value, optionally removable.",
  // color: the label colours, Board column's set (owner, 2026-11-07, system gaps C5: a label's hue is not a tone,
  // Governance § 4). React maps the deprecated `tone` (info blue, success green, warning orange, caution yellow, danger
  // red, discovery purple).
  // size: md 20 and lg 24, Badge's names for the same heights (system gaps C8, 2026-11-07; were sm and md).
  variants: { color: ["neutral", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"], size: ["md", "lg"] },
  states: ["disabled"],
  elements: ["icon", "label", "dismiss"],
  defaults: { color: "neutral", size: "md" },
} as const satisfies ComponentManifest;

export const tagPicker = {
  block: "area-tag-picker",
  description: "Picks several values, shown as coloured tags in the field, from a list that filters and can grow.",
  variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  states: ["open", "disabled", "invalid", "success", "warning", "read-only"],
  stateAttributes: { invalid: "aria-invalid" },
  elements: ["field", "input", "listbox", "hint", "option", "create", "empty"],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const datePicker = {
  block: "area-date-picker",
  description: "Shows a date in a field and opens a calendar, with the date as text, to change it.",
  variants: { variant: ["outline", "soft", "ghost"], size: ["sm", "md", "lg"] },
  booleans: ["full-width"],
  // success / warning (O1) and read-only (O2), as Custom select's (2026-11-07).
  states: ["open", "disabled", "invalid", "success", "warning", "read-only"],
  stateAttributes: { disabled: "disabled", invalid: "aria-invalid" },
  elements: ["trigger", "icon", "value", "panel", "footer"],
  defaults: { variant: "outline", size: "md" },
} as const satisfies ComponentManifest;

export const confirmDialog = {
  block: "area-confirm-dialog",
  description: "Asks for a forced choice before an action that can't be undone.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const drawer = {
  block: "area-drawer",
  description: "Slides a panel in from an edge of the screen for a task beside the page.",
  variants: { side: ["end", "start", "bottom"], size: ["sm", "md"], actions: ["row", "stacked"] },
  elements: ["modal", "header", "heading", "title", "description", "dismiss", "body", "footer"],
  defaults: { side: "end", size: "sm", actions: "row" },
} as const satisfies ComponentManifest;

export const boxField = {
  block: "area-box-field",
  description: "Edits padding or corner radius linked, or one field per side or corner.",
  variants: { size: ["sm", "md", "lg"] },
  elements: ["label", "fields", "field", "toggle"],
  elementModifiers: { field: ["wide"] },
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const surface = {
  block: "area-surface",
  description: "A plain layer to compose a screen from, whose corner, layer and edge follow from the surface it sits in.",
  variants: { variant: ["surface", "soft", "plain"], size: ["sm", "md", "lg"] },
  defaults: { variant: "surface", size: "md" },
} as const satisfies ComponentManifest;

export const stack = {
  block: "area-stack",
  description: "Lays its children out in one row or column, with a gap chosen by role that follows Density.",
  variants: { orientation: ["vertical", "horizontal"], gap: ["related", "group", "section"], align: ["start", "center", "end", "stretch", "baseline"] },
  booleans: ["spread", "wrap"],
  defaults: { orientation: "vertical", gap: "group" },
} as const satisfies ComponentManifest;

export const card = {
  block: "area-card",
  description: "Groups related media, content and actions on one surface.",
  variants: {
    layout: ["vertical", "horizontal", "thumbnail", "immersive"],
    size: ["sm", "md", "lg"],
  },
  elements: ["title", "description", "value", "content", "header", "heading", "header-action", "footer", "media", "overlay", "list", "link", "action", "carousel"],
  elementModifiers: { media: ["well", "bleed"], overlay: ["top-start", "top-end", "bottom-start", "bottom-end", "reveal"], footer: ["spread"] },
  states: ["selected"],
  defaults: { layout: "vertical", size: "md" },
} as const satisfies ComponentManifest;

export const alert = {
  block: "area-alert",
  description: "Draws attention to an important message in place.",
  // tone: Button's and Badge's seven (caution and discovery added 2026-11-07, O4).
  variants: { tone: ["neutral", "info", "success", "warning", "caution", "danger", "discovery"], layout: ["single-line", "multiline", "banner"] },
  booleans: ["flush"],
  elements: ["icon", "content", "title", "description", "link", "actions", "dismiss"],
  defaults: { tone: "neutral", layout: "single-line" },
} as const satisfies ComponentManifest;

export const dialog = {
  block: "area-dialog",
  description: "Interrupts with content that requires a response.",
  // size: Drawer's sm and md (384, 480) and two wide widths, lg 720 and xl 880 (components audit V1, 2026-11-07).
  variants: { size: ["sm", "md", "lg", "xl"] },
  // full-height: the tallest the screen allows, whatever the content (V1).
  booleans: ["full-height"],
  // scrolled: the body has scrolled, so a rule shows under the header (V1).
  states: ["scrolled"],
  elements: ["header", "heading", "title", "description", "dismiss", "body", "footer", "modal"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const popover = {
  block: "area-popover",
  description: "Floats rich, interactive content next to the element that opened it.",
  variants: { side: ["top", "right", "bottom", "left"] },
  booleans: ["arrow"],
  elements: ["header", "title", "description", "body", "footer", "step", "media", "arrow", "arrow-edge"],
  defaults: { side: "bottom" },
} as const satisfies ComponentManifest;

export const menu = {
  block: "area-menu",
  description: "Lists actions triggered from a button.",
  variants: {},
  // inactive: a row that looks disabled but stays reachable and says why in its note (V2, 2026-11-07).
  states: ["disabled", "highlighted", "selected", "inactive"],
  // `search-surface` is deprecated (audit D-22): a searchable list is a Combobox or Command palette.
  // `trailing`: a row's count or badge before its shortcut (2026-11-07, O7), as Nav item's.
  // header, footer: fixed regions above and below the rows, each with a rule; list: the rows' scroller between them;
  // empty, loading: the row shown when there are no rows, or while they load (components audit V5, 2026-11-07).
  // match: the typed text marked in a filtered row (highlightMatch; components audit V4, 2026-11-07).
  elements: ["item", "icon", "text", "lines", "description", "label", "label-text", "separator", "trailing", "shortcut", "check", "toggle", "search-surface", "sub-chevron", "header", "footer", "list", "empty", "loading", "match"],
  elementModifiers: { item: ["danger", "sub"] },
  defaults: {},
} as const satisfies ComponentManifest;

export const tooltip = {
  block: "area-tooltip",
  description: "Names a control on hover or focus.",
  variants: { side: ["top", "right", "bottom", "left"] },
  booleans: ["arrow"],
  // instant: opened inside the skip window, so it shows without the enter fade (motion pass 2026-10-07).
  states: ["instant"],
  elements: [],
  defaults: { side: "top" },
} as const satisfies ComponentManifest;

export const toaster = {
  block: "area-toaster",
  description: "Hosts toasts: live regions first, pause on hover and focus, a hotkey, stacking.",
  variants: {},
  elements: ["list"],
  defaults: {},
} as const satisfies ComponentManifest;

export const toast = {
  block: "area-toast",
  description: "Reports the outcome of an action without interrupting.",
  // tone: Button's and Badge's seven (caution and discovery added 2026-11-07, O4).
  variants: { tone: ["neutral", "info", "success", "warning", "caution", "danger", "discovery"] },
  // `actions`, Alert's name for the part (2026-11-07, O7); `action` is its deprecated alias, kept for one release.
  elements: ["icon", "content", "title", "description", "actions", "action", "dismiss"],
  defaults: { tone: "neutral" },
} as const satisfies ComponentManifest;

export const tabs = {
  block: "area-tabs",
  description: "Switches between views with transparent tabs and rounded indicators; labels align with panel content.",
  variants: { size: ["sm", "md", "lg"], orientation: ["vertical"] },
  booleans: ["track"],
  states: ["selected", "disabled"],
  // unseen: a dot for a tab whose content changed since it was last looked at (components audit D6, 2026-11-07).
  elements: ["list", "tab", "panel", "label", "reserve", "icon", "unseen"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const table = {
  block: "area-table",
  description: "Presents rows of structured data.",
  // layout: auto sizes every column to its content; fixed gives the first column the label column (27%), so the tables
  // of one feed start their values on one line (owner, 2026-10-31, feed rhythm pick 3).
  variants: { size: ["sm", "md", "lg"], layout: ["auto", "fixed"] },
  // sticky-header, sticky-first-column: stay in view while the table scrolls under them (components audit V3, 2026-11-07).
  booleans: ["interactive", "striped", "column-dividers", "flush", "baseline", "sticky-header", "sticky-first-column"],
  // selected: a body row with `aria-selected="true"` (or `data-selected`) takes the selected fill (listed 2026-11-07, O7).
  // collapsed: a row group folded to its heading row (`data-collapsed` on its tbody; V3).
  states: ["selected", "collapsed"],
  stateAttributes: { selected: "aria-selected", collapsed: "data-collapsed" },
  // sort: a sortable heading's Button; group…: a row group's tbody, heading row and its parts; skeleton: loading rows (V3).
  elements: ["cell", "link", "sort", "group", "group-heading", "group-row", "group-toggle", "group-chevron", "group-name", "group-count", "group-summary", "skeleton", "skeleton-line"],
  elementModifiers: { cell: ["numeric", "fit"] },
  defaults: { size: "md", layout: "auto" },
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
  // Independent options, as React's booleans (audit S17, H-13; was a `ground` axis).
  variants: {},
  booleans: ["swatch", "subtle", "on-color"],
  elements: ["swatch", "label"],
  defaults: {},
} as const satisfies ComponentManifest;

export const codeBlock = {
  block: "area-code-block",
  description: "Shows a block of code with an optional file header, numbered lines and a copy action.",
  // sm is the inspector's code well (Figma Dev Mode); md the page block.
  // soft: the soft fields' fill with no edge, for code in a panel (owner 2026-10-30, docs/research/inspector-panel-2026-10-30).
  variants: { size: ["sm", "md"], variant: ["outline", "soft"] },
  booleans: ["flush", "wrap", "unnumbered", "reveal-actions"],
  states: ["collapsed"],
  elements: ["header", "title", "language", "languages", "select", "actions", "body", "pre", "code", "line", "gutter", "linenumber", "marker", "prompt", "text", "toggle"],
  elementModifiers: { line: ["highlighted", "added", "deleted", "removed"] }, // removed: deprecated for deleted (D6)
  defaults: { size: "md", variant: "outline" },
} as const satisfies ComponentManifest;

export const nav = {
  block: "area-nav",
  description: "Site navigation, vertical or horizontal.",
  // `orientation` is the axis; `selection` chooses a plate or a marker for the current item.
  // A nav with neither modifier is vertical with a plate, which is the sidebar case. The
  // marker's colour is the Selection role, not a variant.
  variants: { orientation: ["horizontal"], selection: ["marker"] },
  // A group's heading may fold its run (`toggle`, `chevron`, the run in `items`) and hold `actions` (2026-11-01).
  elements: ["group", "label", "toggle", "chevron", "items", "item", "icon", "picture", "text", "trailing", "separator", "row", "actions"],
  // A nested group is an expandable item's children, stepped in like a Tree view level (audit D-20).
  elementModifiers: { group: ["nested"], row: ["reveal"], label: ["sticky"] },
  // inactive: an item that looks disabled but keeps focus and says why in a Tooltip (components audit V2, 2026-11-07).
  states: ["inactive"],
  defaults: {},
} as const satisfies ComponentManifest;

export const token = {
  block: "area-token",
  description: "Deprecated compatibility alias for Code with a token swatch.",
  variants: {},
  booleans: ["subtle", "on-color"],
  elements: ["swatch", "label"],
  defaults: {},
} as const satisfies ComponentManifest;

export const kbd = {
  block: "area-kbd",
  description: "Marks a keyboard shortcut.",
  variants: {
    size: ["sm", "md"],
    // on-emphasis merged into on-color: one rule, one name (audit A-15).
    // quiet is deprecated (owner 2026-10-22: every key has its backplate) and renders the default keycap.
    variant: ["default", "quiet", "on-color"],
  },
  elements: ["key"],
  defaults: { size: "md", variant: "default" },
} as const satisfies ComponentManifest;

export const board = {
  block: "area-board",
  description: "Lays out board columns side by side.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const boardColumn = {
  block: "area-board-column",
  description: "One group of a board: a coloured header with a count over a list of cards and an add row.",
  variants: { color: ["neutral", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"] },
  elements: ["header", "title", "count", "actions", "cards", "footer", "add", "add-icon"],
  defaults: { color: "neutral" },
} as const satisfies ComponentManifest;

export const boardCard = {
  block: "area-board-card",
  description: "One item on a board: a title that links to it, its properties and hover actions.",
  variants: {},
  elements: ["heading", "icon", "title", "properties", "actions"],
  defaults: {},
} as const satisfies ComponentManifest;

export const boxModel = {
  block: "area-box-model",
  description: "Draws a layer's margin, border, padding and size as nested boxes, read-only.",
  variants: { tone: ["info", "neutral"] },
  elements: ["side", "value", "border", "padding", "content", "label", "corner", "caption"],
  elementModifiers: { side: ["top", "right", "bottom", "left"], corner: ["top-left", "top-right", "bottom-right", "bottom-left"] },
  defaults: { tone: "info" },
} as const satisfies ComponentManifest;

export const tokenRow = {
  block: "area-token-row",
  description: "Names a design token a layer uses: the token's plate (Code with its swatch) widened to the row, with its value; optionally copies it.",
  variants: {},
  booleans: ["outline", "copyable"],
  elements: ["value"],
  defaults: {},
} as const satisfies ComponentManifest;

export const copyButton = {
  block: "area-copy-button",
  description: "A Button that copies text and shows a check for two seconds, with the result said once to assistive tech.",
  variants: {},
  states: ["copy-state"],
  defaults: {},
} as const satisfies ComponentManifest;

export const listBox = {
  block: "area-list-box",
  description: "Options to choose one from, as a list or a grid, with one Tab stop and the arrows inside.",
  variants: { layout: ["list", "grid"] },
  states: ["disabled", "selected"],
  elements: ["item", "section", "heading", "options"],
  defaults: { layout: "list" },
} as const satisfies ComponentManifest;

export const titlebar = {
  block: "area-titlebar",
  description: "A window's top bar: Panel's bar height and rule, the drag region of a frameless window; plain drops the rule, floating is a raised plate.",
  variants: { variant: ["ruled", "plain", "floating"], size: ["sm", "md"] },
  booleans: ["macos"],
  elements: ["end"],
  defaults: { variant: "ruled", size: "md" },
} as const satisfies ComponentManifest;

export const sectionHeading = {
  block: "area-section-heading",
  description: "A titled group on a page: a strong title trimmed to its cap and baseline, and a muted lede.",
  variants: {},
  elements: ["title", "lede"],
  defaults: {},
} as const satisfies ComponentManifest;

// Components audit N1, N2, N4, N5 (2026-11-07): docs/specs/page-header.md, selection-bar.md, setting-row.md, filter-bar.md.
export const pageHeader = {
  block: "area-page-header",
  description: "Heads a page: its title with a way back to its parent, a description, the title's actions and the page's tabs.",
  variants: { size: ["sm", "md", "lg"] },
  elements: ["parent", "title", "actions", "description", "navigation"],
  defaults: { size: "md" },
} as const satisfies ComponentManifest;

export const selectionBar = {
  block: "area-selection-bar",
  description: "Says how many items are selected and holds the actions that apply to them, while any are selected.",
  variants: {},
  booleans: ["floating"],
  states: ["empty"],
  elements: ["count", "actions", "clear"],
  defaults: {},
} as const satisfies ComponentManifest;

export const settingRow = {
  block: "area-setting-row",
  description: "A preference on a settings page: its name, description and help, with its control at the end.",
  variants: { orientation: ["horizontal", "vertical"] },
  states: ["modified", "disabled"],
  elements: ["body", "text", "heading", "label", "modified", "help", "reset", "description", "control"],
  defaults: { orientation: "horizontal" },
} as const satisfies ComponentManifest;

export const settingsGroup = {
  block: "area-settings-group",
  description: "Groups setting rows under an optional heading, with a rule between rows.",
  variants: {},
  booleans: ["framed"],
  elements: ["rows"],
  defaults: {},
} as const satisfies ComponentManifest;

export const filterBar = {
  block: "area-filter-bar",
  description: "Shows the filters a view has on as chips that open their editors, with Add filter and Reset.",
  variants: {},
  elements: ["item", "dirty", "add", "reset"],
  defaults: {},
} as const satisfies ComponentManifest;

// Components audit N3, N6 (2026-11-07): docs/specs/mention.md, splitter.md.
export const mention = {
  block: "area-mention",
  description: "Refers to a person, a file, a page or a date inside text and messages, with the kind's mark; a date that is due turns to the danger ink.",
  variants: { variant: ["plain", "underline", "soft"], kind: ["person", "file", "page", "date"] },
  states: ["due"],
  elements: ["icon", "label"],
  defaults: { variant: "soft", kind: "person" },
} as const satisfies ComponentManifest;

export const splitter = {
  block: "area-splitter",
  description: "Two regions side by side or stacked, with a handle between them that resizes them by pointer or keyboard.",
  variants: { orientation: ["horizontal", "vertical"] },
  states: ["resizing"],
  elements: ["pane", "handle"],
  defaults: { orientation: "horizontal" },
} as const satisfies ComponentManifest;

// Components audit N7 (2026-11-07): docs/specs/chart.md. Chart draws bar, line, area and donut; ChartNumber the number.
export const chart = {
  block: "area-chart",
  description: "Plots rows of data as bars, lines, areas or a donut, with a legend that hides series, a tooltip the keys reach and a table of the data; the number shows one figure with its change.",
  variants: { kind: ["bar", "line", "area", "donut", "number"], size: ["sm", "md", "lg"] },
  booleans: ["stacked"],
  states: ["active", "busy"],
  stateAttributes: { busy: "aria-busy" },
  elements: [
    "plot", "svg", "grid", "baseline", "guide", "tick", "mark", "band", "line", "wash", "part", "dot", "center", "center-label",
    "tooltip", "tooltip-title", "tooltip-row", "key", "legend", "legend-item", "legend-label", "view", "table", "empty",
    "label", "figure", "change", "note",
  ],
  defaults: { kind: "bar", size: "md" },
} as const satisfies ComponentManifest;

export const folder = {
  block: "area-folder",
  description: "Draws a folder as Finder does: a back panel with its tab, a sheet tucked inside, a front pocket, a count and an optional badge.",
  variants: {
    size: ["sm", "md", "lg"],
  },
  states: ["open"],
  elements: ["figure", "back", "rim", "front", "paper", "badge", "count"],
  defaults: {},
} as const satisfies ComponentManifest;

export const filePage = {
  block: "area-file-page",
  description: "Draws a file as Finder does: a page with its corner folded, blank or with a content mark for its type.",
  variants: { size: ["sm", "md", "lg"] },
  elements: ["figure", "sheet", "edge", "fold", "crease", "diagonal", "content", "icon", "label"],
  defaults: {},
} as const satisfies ComponentManifest;

export const fileImage = {
  block: "area-file-image",
  description: "Draws an image file as a landscape frame, Folder's and File page's sibling: the picture, or a drawn landscape.",
  variants: { size: ["sm", "md", "lg"] },
  elements: ["figure", "scene", "picture"],
  defaults: {},
} as const satisfies ComponentManifest;

export const fileTile = {
  block: "area-file-tile",
  description: "One item of a file browser's icon view: its figure over its name and a detail line.",
  variants: { size: ["sm", "md", "lg"] },
  elements: ["figure", "text", "name", "meta"],
  defaults: {},
} as const satisfies ComponentManifest;

export const fileGrid = {
  block: "area-file-grid",
  description: "Lays file tiles out as a grid to browse, choose from and open, with one Tab stop.",
  variants: { size: ["sm", "md", "lg"] },
  states: ["drop-target"],
  elements: ["item"],
  defaults: {},
} as const satisfies ComponentManifest;

export const assetCard = {
  block: "area-asset-card",
  description: "Shows one asset in a card: its name and controls in a head, the asset in a square frame under it (an image in its own ratio, cropped to the card's aspect or whole within it; an element, a colour, or a group as a 2×2 mosaic or a strip); framed, basic or containerless, its name above, below or over the asset on hover, recessed or raised or on a transparency checker, square, landscape, wide, 16:9 screen or hugging its asset; with no name or controls and containerless, the frame alone (an inspector's preview).",
  variants: { layout: ["asset", "image", "color", "group"], container: ["framed", "basic", "containerless"], caption: ["above", "below", "overlay", "outside"], fill: ["recessed", "raised", "checker"], aspect: ["square", "landscape", "hug", "wide", "screen"], fit: ["natural", "cover", "contain"], mosaic: ["grid", "strip"] },
  booleans: ["interactive", "borderless"],
  states: ["selected"],
  elements: ["head", "name", "actions", "frame", "media", "mosaic", "cell", "thumb", "badge"],
  defaults: { layout: "asset", container: "framed", caption: "above", fill: "recessed", aspect: "square", fit: "natural", mosaic: "grid" },
} as const satisfies ComponentManifest;

export const designCard = {
  block: "area-design-card",
  description: "Shows one design in a container at its true size, placed by its layout's rule: a part (a control, a component, a pattern, a type line) in a tenth of the card's short side, never past 100% and held at 50% and cropped on its focus below that; a screen whole in a 16:9 card; a phone standing from the top and running off the bottom; an icon at whole multiples; a colour painting the card. Its name and true size sit under it; opened, the same ground grows to Full view.",
  variants: { layout: ["part", "screen", "phone", "icon", "color"], aspect: ["square", "wide"] }, // wide: 16:9 (Asset card's wide is 2:1; `screen` would collide with the screen layout's class, so the names meet when Asset card retires)
  booleans: ["interactive"],
  states: ["selected"],
  elements: ["ground", "design", "caption", "name", "detail", "actions"],
  defaults: { layout: "part", aspect: "square" },
} as const satisfies ComponentManifest;

export const assetGrid = {
  block: "area-asset-grid",
  description: "Lays asset cards out as a grid or a waterfall to browse, choose from and open, with one Tab stop.",
  variants: { layout: ["grid", "waterfall"] },
  elements: ["item"],
  defaults: { layout: "grid" },
} as const satisfies ComponentManifest;

export const assetRow = {
  block: "area-asset-row",
  description: "Lists one exportable asset: its preview, name, details and an optional action.",
  variants: {},
  elements: ["preview", "text", "name", "meta", "actions"],
  defaults: {},
} as const satisfies ComponentManifest;

export const previewFrame = {
  block: "area-preview-frame",
  description: "Deprecated: use Asset card, containerless with no name. Shows the selected item at the head of an inspector: an icon, an image or a colour, centred in a frame.",
  variants: { aspect: ["square", "landscape", "wide"], ground: ["surface", "subtle", "checker"] },
  elements: ["paint"],
  defaults: { aspect: "square", ground: "surface" },
} as const satisfies ComponentManifest;

export const editableText = {
  block: "area-editable-text",
  description: "Shows text that turns into a field in place to rename it.",
  variants: { activation: ["dblclick", "click", "focus"] },
  booleans: ["fill"],
  states: ["editing", "disabled"],
  elements: ["preview", "input"],
  defaults: { activation: "dblclick" },
} as const satisfies ComponentManifest;

export const stepper = {
  block: "area-stepper",
  description: "Shows where a person is in a flow of steps: Timeline's numbered markers joined by its line, done steps checked.",
  variants: { orientation: ["horizontal", "vertical"] },
  elements: [],
  defaults: { orientation: "horizontal" },
} as const satisfies ComponentManifest;

export const stepperStep = {
  block: "area-stepper-step",
  description: "One step of a stepper: its marker, title, an optional description and what an open step holds.",
  // The shared status words (Governance § 4, 2026-11-07); React maps the deprecated upcoming and invalid to them.
  variants: { status: ["complete", "current", "pending", "error"] },
  states: ["disabled"],
  elements: ["button", "body", "marker", "text", "title", "description", "content"],
  defaults: { status: "pending" },
} as const satisfies ComponentManifest;

export const timeline = {
  block: "area-timeline",
  description: "Lists events in order along one line, each with a marker.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const timelineItem = {
  block: "area-timeline-item",
  description: "One event on a timeline: a dot, icon or avatar marker, a title, its time and details.",
  variants: {},
  booleans: ["current"],
  elements: ["marker", "dot", "icon", "media", "content", "line", "title", "meta", "time", "body"],
  defaults: {},
} as const satisfies ComponentManifest;

export const zoomControl = {
  block: "area-zoom-control",
  description: "Shows a canvas's zoom and opens a menu to type, step, fit or pick a zoom.",
  variants: {},
  booleans: ["stepper"],
  elements: ["value", "menu", "field", "stepper", "step"],
  defaults: {},
} as const satisfies ComponentManifest;

export const citation = {
  block: "area-citation",
  description: "Links a source from the text it supports: a small pill, or a footnote number.",
  variants: { variant: ["pill", "footnote"], ink: ["inherit", "muted", "action", "blue", "purple", "pink", "green", "red", "orange", "brown"] },
  elements: ["icon", "label", "count", "bracket"],
  defaults: { variant: "pill" },
} as const satisfies ComponentManifest;

export const dateRangePicker = {
  block: "area-date-range-picker",
  description: "A field showing a range of dates that opens presets and a range calendar.",
  variants: {},
  elements: ["presets", "preset"],
  defaults: {},
} as const satisfies ComponentManifest;

export const shortcutList = {
  block: "area-shortcut-list",
  description: "Lists keyboard shortcuts: what each does, and its keys at the end.",
  variants: {},
  // quiet: deprecated and ignored (owner 2026-10-22: every key is a keycap). divided: a rule under each row but the last,
  // off by default (owner 2026-10-25: dividers only where intentional).
  booleans: ["quiet", "divided"],
  elements: ["title", "items", "item", "label", "keys"],
  defaults: {},
} as const satisfies ComponentManifest;

export const kbdGroup = {
  block: "area-kbd-group",
  description: "Groups chord hints into a keyboard shortcut sequence.",
  variants: {},
  elements: [],
  defaults: {},
} as const satisfies ComponentManifest;

export const referenceList = {
  block: "area-reference-list",
  description: "Lists a text's sources: publisher, linked title and what each covers.",
  variants: { marker: ["number", "bullet"] },
  elements: ["title", "list", "item", "text", "dash", "backlinks", "backlink", "count"],
  defaults: { marker: "number" },
} as const satisfies ComponentManifest;

export const tableOfContents = {
  block: "area-toc",
  description: "Lists a page's sections and marks the one being read.",
  variants: {},
  elements: ["title"],
  defaults: {},
} as const satisfies ComponentManifest;

export const figure = {
  block: "area-figure",
  description: "Shows an image or other media with its caption.",
  variants: {},
  elements: ["media", "caption"],
  defaults: {},
} as const satisfies ComponentManifest;

export const inlineList = {
  block: "area-inline-list",
  description: "Runs short items along a line, with a separator between them.",
  variants: { separator: ["dot", "rule", "none"] },
  elements: ["item"],
  defaults: { separator: "dot" },
} as const satisfies ComponentManifest;

export const abbreviation = {
  block: "area-abbr",
  description: "Marks an abbreviation and shows what it stands for.",
  variants: {},
  defaults: {},
} as const satisfies ComponentManifest;

export const hatnote = {
  block: "area-hatnote",
  description: "Points readers who wanted a different page, at the top of an article or section.",
  variants: {},
  defaults: {},
} as const satisfies ComponentManifest;

export const linkGroups = {
  block: "area-link-groups",
  description: "Groups related links under small headings, in columns, at the foot of a page.",
  variants: {},
  booleans: ["divided"],
  elements: ["title", "groups", "group", "label", "list"],
  defaults: {},
} as const satisfies ComponentManifest;

export const videoPlayer = {
  block: "area-video-player",
  description: "Plays a video with Area's own controls over it.",
  variants: { layout: ["floating", "bar", "minimal"], controls: ["auto", "always"] },
  elements: ["media", "start", "controls", "transport", "group", "timeline", "clock", "range", "duration", "volume", "skip", "optional", "surface"],
  elementModifiers: { group: ["start", "center", "end"], clock: ["start"] },
  defaults: { layout: "bar", controls: "auto" },
} as const satisfies ComponentManifest;

export const MANIFESTS = {
  button,
  buttonGroup,
  splitButton,
  toolbar,
  alignmentPicker,
  colorPicker,
  calendar,
  colorSwatch,
  colorSwatchPicker,
  colorField,
  field,
  input,
  numberField,
  inputGroup,
  breadcrumb,
  fileUpload,
  fileUploadList,
  fileUploadItem,
  emptyState,
  toggleGroup,
  descriptionList,
  meter,
  searchField,
  shortcutList,
  dateRangePicker,
  citation,
  zoomControl,
  board,
  boardColumn,
  boardCard,
  timeline,
  timelineItem,
  editableText,
  boxModel,
  tokenRow,
  copyButton,
  folder,
  filePage,
  fileTile,
  fileGrid,
  assetCard,
  designCard,
  assetGrid,
  fileImage,
  listBox,
  titlebar,
  sectionHeading,
  pageHeader,
  selectionBar,
  mention,
  splitter,
  chart,
  settingRow,
  settingsGroup,
  filterBar,
  assetRow,
  previewFrame,
  passwordField,
  otpField,
  timeField,
  stepper,
  stepperStep,
  scrollArea,
  link,
  toggletip,
  pagination,
  treeView,
  composer,
  composerGroup,
  textarea,
  select,
  checkbox,
  checkboxGroup,
  radio,
  radioGroup,
  switch: switchControl,
  slider,
  sliderRange,
  chip,
  chipGroup,
  choiceLabel,
  badge,
  presence,
  indicatorAnchor,
  indicator,
  count,
  accordionItem,
  step,
  editSummary,
  diff,
  approval,
  plan,
  turnNotice,
  attachment,
  composerMenu,
  queue,
  timestamp,
  accordion,
  badgeGroup,
  avatar,
  avatarGroup,
  separator,
  skeleton,
  spinner,
  progress,
  panel,
  propertyList,
  boxField,
  combobox,
  customSelect,
  tag,
  tagPicker,
  datePicker,
  confirmDialog,
  drawer,
  commandPalette,
  contextMenu,
  hoverCard,
  promptSuggestions,
  message,
  scrollToLatest,
  modelPicker,
  card,
  surface,
  stack,
  alert,
  dialog,
  popover,
  menu,
  tooltip,
  toast,
  toaster,
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
  referenceList,
  tableOfContents,
  figure,
  inlineList,
  abbreviation,
  hatnote,
  linkGroups,
  videoPlayer,
} as const satisfies Record<string, ComponentManifest>;
