/**
 * Area's one vocabulary for parts, states and props (system evaluation 2026-11-11, F8; GOVERNANCE § 4), as data.
 *
 * `lint:manifest` and `test:contracts` read this file (manifest-parity.mjs, checkVocabulary): a manifest part, state,
 * axis or flag, a React prop of a `*Props` interface, an axis value or a `data-area-*` attribute that takes a job below
 * under another word fails, unless it is listed in ALLOWED_DEVIATIONS. A listed deviation that is gone, or no longer off
 * the vocabulary, fails too, so the list only shrinks.
 *
 * A job is known by its words: its name, and the off-words (`off`) the census found doing the same job. A family's own
 * part with no shared job (Calendar's `day-number`) is free to take its own name. Misuses the lint cannot see from a
 * name alone (a `preview` that is a picture, a `status` inside an item type) are listed in MIGRATIONS instead.
 *
 * Migration is on reopen, with aliases: a family renames its deviations when the plan item named in `migrateIn` reopens
 * it (docs/research/system-evaluation-2026-11-11/plan.json), keeping the old name as a deprecated alias for one release;
 * "F8-later" means no planned item reopens that family yet.
 */

/**
 * Each job: `name` (the word), `when` (what it is for), `example` (a family that has it right), and `off`, the words
 * that must not take the job, by where they appear: `part` (a manifest element or element-modifier key), `state`, `prop`
 * (a manifest axis or flag, or a React prop: `defaultX`, `onXChange` and `xProps` read as `x`), `value` (an axis value
 * or a prop's literal), each mapped to the name it becomes.
 */
export const JOBS = [
  { job: 'top band', name: 'header', when: "A component's top band (its title group, its actions)", example: 'Dialog',
    off: { part: { head: 'header' }, prop: { head: 'header' } } },
  { job: 'bottom band', name: 'footer', when: "A component's bottom band (its buttons, a note)", example: 'Dialog',
    off: { part: { foot: 'footer' }, prop: { foot: 'footer' } } },
  { job: 'title', name: 'title', when: "A component's or an item's own title, the display name included (a file's, a card's)", example: 'Card',
    off: { part: { name: 'title' } }, rule: 'a React `name` that is not a string is display text: `title`' },
  { job: 'label', name: 'label', when: "A control's visible name", example: 'Field', off: {} },
  { job: 'second line', name: 'description', when: 'The line that explains a title or a label', example: 'Page header',
    off: { part: { lede: 'description', subtitle: 'description', subheading: 'description' }, prop: { lede: 'description', subtitle: 'description', subheading: 'description' } } },
  { job: 'tabular facts', name: 'meta', when: 'Facts in a column of their own: a size, a time, +N −N; never the second line', example: 'Asset row', off: {} },
  { job: 'end cluster', name: 'actions', when: 'The slot for the buttons at the end of a band or an item, however many it holds', example: 'Alert',
    off: { part: { 'header-action': 'actions' }, prop: { 'header-action': 'actions' } },
    rule: '`action` only for a single built-in action the component draws itself (SINGLE_ACTION); a React `action` slot (a ReactNode) is `actions`' },
  { job: 'item end', name: 'trailing', when: "An item's end slot (a row's shortcut, count or control)", example: 'Menu item',
    off: {}, rule: 'a React `end` slot (a ReactNode) is `trailing`' },
  { job: 'picture', name: 'media', when: 'A picture of the item: an image, a video, a frame', example: 'Card',
    off: { part: { picture: 'media', thumbnail: 'media' }, prop: { picture: 'media', thumbnail: 'media' } } },
  { job: 'glyph', name: 'icon', when: 'A glyph slot; `trailingIcon` (`trailing-icon`) for one after the label', example: 'Button',
    off: { part: { 'leading-icon': 'icon', glyph: 'icon' }, prop: { 'leading-icon': 'icon', glyph: 'icon' } } },
  { job: 'close', name: 'dismiss', when: 'The close part, `onDismiss` / `dismissLabel` (system gaps C4)', example: 'Alert',
    off: { part: { close: 'dismiss' } } },
  { job: 'show / hide', name: 'open', when: 'Anything that shows or hides its own content: an overlay, a fold, a growing field; `collapsed` only where open is the default and closed the exception', example: 'Accordion',
    off: { state: { expanded: 'open' }, prop: { expanded: 'open' } } },
  { job: 'pending', name: 'loading', when: 'Waiting for work; painted with `aria-busy`, which is a hook, not a name', example: 'Button',
    off: { state: { busy: 'loading' }, prop: { busy: 'loading' } } },
  { job: 'read-only', name: 'read-only', when: '`readOnly` in React, painted `data-read-only`', example: 'Input',
    off: { state: { readonly: 'read-only' }, prop: { readonly: 'read-only' } } },
  { job: 'outcome', name: 'status', when: 'A process outcome only: `pending`, `current`, `complete`, `error` and a family\'s own activity words', example: 'Stepper',
    off: { value: { done: 'complete', failed: 'error', invalid: 'error', upcoming: 'pending', ready: 'complete' } },
    rule: 'availability is `presence`, a change since kept is `change`, a sentence about the state is `statusText`' },
  { job: 'availability', name: 'presence', when: "Someone's availability: `available`, `away`, `busy` …", example: '(none yet)', off: {} },
  { job: 'change', name: 'change', when: 'What happened since it was kept: `added`, `modified`, `deleted`, `untracked`, `renamed`', example: 'Code block marks',
    off: { part: { removed: 'deleted' }, state: { removed: 'deleted' }, value: { removed: 'deleted' } } },
  { job: 'edge', name: 'side', when: 'Which edge it attaches to, in logical words: `top`, `bottom`, `start`, `end` (and `top-start` …); the same for `placement` and `align`', example: 'Drawer', off: {} },
  { job: 'form name', name: 'name', when: "A field's form name, a string, and nothing else", example: 'Custom select', off: {} },
  { job: 'label colour', name: 'color', when: 'A hue without meaning (GOVERNANCE, Label colors are not tones)', example: 'Tag',
    off: { prop: { ink: 'color' } } },
];

/** The values an outcome (`status`) must not take, with the job they belong to. */
export const PRESENCE_WORDS = ['available', 'away', 'busy', 'do-not-disturb', 'blocked', 'offline', 'online', 'out-of-office', 'unknown'];
export const CHANGE_WORDS = ['added', 'modified', 'deleted', 'untracked', 'renamed', 'removed'];
/** The props and axes whose values name an edge, and the physical words they must not take. */
export const EDGE_NAMES = ['side', 'placement', 'align', 'position'];
export const PHYSICAL_WORDS = ['left', 'right'];
/** British spellings, never in a name or an attribute (US spelling, owner 2026-11-07, system gaps T4): segment -> US. */
export const BRITISH = { colour: 'color', colours: 'colors', grey: 'gray', greys: 'grays', centre: 'center', behaviour: 'behavior', favourite: 'favorite', licence: 'license' };

/**
 * The families whose `action` part is a single built-in action they draw themselves (not a slot): manifest key -> what
 * it is. Anything else named `action` is an `actions` slot.
 */
export const SINGLE_ACTION = {
  splitButton: "the button's main half",
  input: 'the built-in trailing action (clear, reveal, copy) and its tooltip',
  chip: "the chip's own pressable body",
  fileUpload: 'the browse button inside the prompt',
  card: 'Card action, the one link a card draws',
};

/**
 * Names off the vocabulary today, allowed until their family migrates: owner (a manifest key, a React export, or
 * `@settings` for a setting's attribute) -> name -> { family (the slug plan.json uses), use (the name it becomes),
 * reason, migrateIn (the plan item whose phase reopens the family, or "F8-later") }.
 */
const d = (family, use, reason, migrateIn) => ({ family, use, reason, migrateIn });
const HEAD = 'the top band of a card head, named before the vocabulary';
const NAME = "the item's shown name, not a form name";
const EDGE = 'a physical edge word, which does not follow the reading direction';
const EXPANDED = 'shows or hides its own content, which is open';
export const ALLOWED_DEVIATIONS = {
  // Top and bottom bands.
  field: { head: d('field', 'header', "the label's band above the control", 'B3.1') },
  approval: { head: d('approval', 'header', HEAD, 'B4.4'), foot: d('approval', 'footer', 'a second bottom band beside its own footer', 'B6.5') },
  plan: { head: d('plan', 'header', HEAD, 'B4.4') },
  queue: { head: d('queue', 'header', HEAD, 'B4.4') },
  editSummary: {
    head: d('edit-summary', 'header', HEAD, 'B4.4'),
    name: d('edit-summary', 'title', NAME, 'B4.4'),
    removed: d('edit-summary', 'deleted', 'the deprecated change word, kept one release (GOVERNANCE § 6)', 'D3'),
  },
  attachment: {
    head: d('attachment', 'header', HEAD, 'B1.3'),
    name: d('attachment', 'title', NAME, 'B1.3'),
    status: d('attachment', 'complete', '`ready` is the deprecated alias of `complete`, kept one release', 'B1.3'),
  },
  assetCard: { head: d('asset-card', 'header', 'the band above the picture', 'B1.1'), name: d('asset-card', 'title', NAME, 'B1.2') },
  AssetCard: { headProps: d('asset-card', 'headerProps', 'props of the head band', 'B1.1'), name: d('asset-card', 'title', NAME, 'B1.2') },
  // Titles: display text named `name`.
  fileUploadItem: { name: d('file-upload', 'title', NAME, 'A9.5') },
  FileUploadItem: { name: d('file-upload', 'title', NAME, 'A9.5') },
  fileTile: { name: d('file-tile', 'title', NAME, 'B1.2') },
  FileTile: { name: d('file-tile', 'title', NAME, 'B1.2') },
  designCard: { name: d('design-card', 'title', NAME, 'B1.2') },
  DesignCard: { name: d('design-card', 'title', NAME, 'B1.2') },
  assetRow: { name: d('asset-row', 'title', NAME, 'E1.3') },
  AssetRow: { name: d('asset-row', 'title', NAME, 'E1.3') },
  EditSummaryChange: { name: d('edit-summary', 'title', NAME, 'B4.4') },
  modelPicker: { name: d('model-picker', 'title', "the chosen model's shown name", 'C1.1') },
  // Second lines.
  sectionHeading: { lede: d('section-heading', 'description', "the heading's second line (Page header's is `description`)", 'A9.3') },
  SectionHeading: { lede: d('section-heading', 'description', "the heading's second line (Page header's is `description`)", 'A9.3') },
  // End slots.
  card: { 'header-action': d('card', 'actions', "the slot at the header's end", 'B4.3') },
  CardHeader: { action: d('card', 'actions', "a slot at the header's end, not a built-in action", 'B4.3') },
  turnNotice: { action: d('turn-notice', 'actions', 'a slot the author fills, not a built-in action', 'D3') },
  TurnNotice: { action: d('turn-notice', 'actions', 'a slot the author fills, not a built-in action', 'D3') },
  toast: { action: d('toast', 'actions', 'the deprecated part, kept one release beside `actions` (GOVERNANCE § 6)', 'E10') },
  Panel: { action: d('panel', 'actions', "a slot at the bar's end, not a built-in action", 'B4.1') },
  PanelRow: { action: d('panel', 'actions', "a slot at the row's end, not a built-in action", 'B2.7') },
  Titlebar: { end: d('titlebar', 'trailing', "the bar's end slot", 'B4.1') },
  // Pictures and glyphs.
  fileImage: { picture: d('file-image', 'media', 'the drawn picture inside the file', 'D2') },
  nav: { picture: d('nav', 'media', "an item's picture (an avatar, a thumbnail)", 'D1') },
  NavItem: { picture: d('nav', 'media', "an item's picture (an avatar, a thumbnail)", 'D1') },
  badge: { 'leading-icon': d('badge', 'icon', 'the glyph before the label', 'B5.1') },
  // Show / hide and pending.
  toggletip: { expanded: d('toggletip', 'open', EXPANDED, 'C5.6') },
  composer: { expanded: d('composer', 'open', 'the grown field shows more of itself, which is open', 'D3') },
  Composer: {
    expanded: d('composer', 'open', 'the grown field shows more of itself, which is open', 'D3'),
    defaultExpanded: d('composer', 'defaultOpen', 'as `expanded`', 'D3'),
    onExpandedChange: d('composer', 'onOpenChange', 'as `expanded`', 'D3'),
  },
  TableGroup: {
    expanded: d('table', 'open', EXPANDED, 'D2'),
    defaultExpanded: d('table', 'defaultOpen', 'as `expanded`', 'D2'),
    onExpandedChange: d('table', 'onOpenChange', 'as `expanded`', 'D2'),
  },
  DescriptionList: {
    expanded: d('description-list', 'open', 'showing every item shows its own content, which is open', 'B1.1'),
    defaultExpanded: d('description-list', 'defaultOpen', 'as `expanded`', 'B1.1'),
    onExpandedChange: d('description-list', 'onOpenChange', 'as `expanded`', 'B1.1'),
  },
  TreeView: { onExpandedChange: d('tree-view', 'onOpenChange', 'with `expandedIds` (owner question: open ids or the tree pattern\'s word)', 'B7.13') },
  chart: { busy: d('chart', 'loading', 'the deprecated state beside `loading` (GOVERNANCE § 6)', 'D2') },
  // Outcome words.
  presence: { status: d('indicator', 'presence', "availability, not a process's outcome", 'B5.3') },
  Presence: { status: d('indicator', 'presence', "availability, not a process's outcome", 'B5.3') },
  Indicator: { status: d('indicator', 'presence', "availability, not a process's outcome", 'B5.3') },
  // Edges.
  popover: { side: d('popover', 'start / end', EDGE, 'C5.2') },
  Popover: { side: d('popover', 'start / end', EDGE, 'C5.2') },
  Anchored: { side: d('popover', 'start / end', `${EDGE} (the anchoring engine every overlay reads)`, 'C5.2') },
  tooltip: { side: d('tooltip', 'start / end', EDGE, 'C5.2') },
  Tooltip: { side: d('tooltip', 'start / end', EDGE, 'C5.2') },
  HoverCard: { side: d('hover-card', 'start / end', EDGE, 'C5.2') },
  Menu: { side: d('menu', 'start / end', EDGE, 'C5.2') },
  Toggletip: { side: d('toggletip', 'start / end', EDGE, 'C5.6') },
  // Hue and form.
  link: { ink: d('link', 'color', 'a hue axis named before `color` (GOVERNANCE § 4, Known deviations)', 'E6') },
  Link: { ink: d('link', 'color', 'a hue axis named before `color`', 'E6') },
  citation: { ink: d('citation', 'color', 'a hue axis named before `color` (GOVERNANCE § 4, Known deviations)', 'B5.1') },
  Citation: { ink: d('citation', 'color', 'a hue axis named before `color`', 'B5.1') },
  treeView: { selectionMode: d('tree-view', 'selection-mode', 'a camelCase axis name (GOVERNANCE § 4, Known deviations)', 'B7.13') },
  switch: { labelPosition: d('switch', 'label-position', 'a camelCase axis name (GOVERNANCE § 4, Known deviations)', 'B8.1') },
  slider: { labelPosition: d('slider', 'label-position', 'a camelCase axis name (GOVERNANCE § 4, Known deviations)', 'A9.2') },
  // US spelling: a setting's attribute is held by saved systems, so it moves with a migration of saved themes.
  Theme: { colours: d('(settings)', 'colors', 'the Colors setting, spelled as its attribute', 'F8-later') },
  '@settings': {
    'data-area-colours': d('(settings)', 'data-area-colors', 'saved systems hold the attribute: needs the foundation-change pass with a saved-theme migration', 'F8-later'),
    'data-area-status-colours': d('(settings)', 'data-area-status-colors', 'as data-area-colours', 'F8-later'),
    'data-area-material-gradient-centre': d('(settings)', 'data-area-material-gradient-center', 'as data-area-colours', 'F8-later'),
  },
};

/**
 * Misuses a name alone cannot show (the lint does not see them), with the same shape and the owner each sits in: a
 * `preview` or `end` that is another job, display text in a string `name`, and fields of item types, which are not
 * `*Props`.
 */
export const MIGRATIONS = {
  assetRow: { preview: d('asset-row', 'media', 'a picture of the asset', 'E1.3') },
  AssetRow: { preview: d('asset-row', 'media', 'a picture of the asset', 'E1.3'), previewAlt: d('asset-row', 'mediaAlt', 'as `preview`', 'E1.3') },
  FilePage: { preview: d('file-page', 'media', 'the picture drawn on the page', 'D2') },
  titlebar: { end: d('titlebar', 'trailing', "the bar's end slot (React's `end`)", 'B4.1') },
  panel: { bar: d('panel', 'header', "the panel's top band", 'B4.1') },
  Attachment: { name: d('attachment', 'title', `${NAME} (a string)`, 'B1.3') },
  EditSummaryFile: { name: d('edit-summary', 'title', `${NAME} (a string)`, 'B4.4') },
  TokenRow: { name: d('token-row', 'title', "the token's shown name (a string)", 'D1') },
  TreeViewNode: { status: d('tree-view', 'change', 'a change word, not an outcome', 'B7.13') },
  TabsItem: { status: d('tabs', 'change', 'a change word, not an outcome', 'D1') },
  treeView: { status: d('tree-view', 'change', 'the change mark part', 'B7.13') },
  PaginationLabels: { status: d('pagination', 'statusText', 'words about the page, not an outcome (as Message\'s `statusText`)', 'B7.2') },
  pagination: { status: d('pagination', 'status-text', 'the words part (as Message\'s `status-text`)', 'B7.2') },
};
