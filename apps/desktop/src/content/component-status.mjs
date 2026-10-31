/** Owner-confirmed completion registry.
 * A historical audit or passing build does not imply acceptance. New or refined
 * families stay in review until the owner accepts them. Compound parts follow their
 * parent family.
 */
// Re-confirmed 2026-10-02 after the compact evidence audit (PR 37): menu, nav, tree-view,
// command-palette, combobox, tooltip, dialog, code-block, panel, color-picker, checkbox, radio,
// chip, badge-group, box-field and tabs keep Complete (docs/research/compact-evidence-2026-10-02/).
// Visual pass rounds 81–89 and the Composer expansion (branch claude/component-interaction-visual-polish-e45c8f,
// 2026-10-28/29): every family they reopened was approved back to Complete (Command palette, Color swatch picker,
// Popover, Composer, Description list, Edit summary, File tile, File upload, Plan, Prompt suggestions, Search field,
// Scroll to latest, Spinner, Video player, Model picker, Approval). Plan, Description list and Approval are in review
// again for main's chat set review (merged 2026-10-29).
export const COMPLETE_COMPONENTS = new Set([
  // Reopened 2026-10-26 (owner: the Slider's motion and detail pass on every component; docs/research/interaction-pass-2026-10-26):
  'color-picker', // round 75 approved (owner, 2026-10-27: the knob lifts); its Gamut mode approved on the exact-colours review (owner, 2026-10-28)
  'tabs', // round 77 approved (owner, 2026-10-27: the focus rings with room); code-block reopened 2026-10-30 (owner pick
  // "Code in the Inspector": soft, prompt, revealActions, collapsedLines, the end fade), in review.
  'step', 'queue', 'edit-summary', 'list-box', 'combobox', 'tag-picker', 'input', 'textarea', 'number-field',
  'select', 'input-group', 'empty-state', 'toggletip', // round 75 approved (owner, 2026-10-27)
  'asset-card', // round 76 approved (owner, 2026-10-27: group element cells draw their frame; the Stage as it ships)
  'command-palette', 'inline-list', 'separator', 'shortcut-list', // round 72 approved (owner, 2026-10-26; asset-card too)
  // tree-view: reopened 2026-10-30 (owner pick "A file-tree density", docs/research/inspector-panel-2026-10-30: size sm,
  // guides, status), in review.
  // meter: reopened 2026-10-30 (owner pick "A stacked meter", docs/research/inspector-panel-2026-10-30: segments and a
  // legend), in review.
  // panel: reopened 2026-10-30 (owner pick "One Inspector grid", docs/research/inspector-panel-2026-10-30: one label column
  // shared with Description list; and the window bar and even bar insets, the three-panel shell), in review.
  // nav: approved 2026-10-29 (closable tabs, Figma's close, 120 to 170, scrolling overflow); reopened the same day for the
  // icon-only item (app structure Phase 2's Home tab), back in review.
  'radio', 'checkbox', // round 73 approved (owner, 2026-10-26)
  'file-upload', // round 74 approved (owner, 2026-10-26; description-list too). infobox: removed 2026-10-26 (owner, round 73).
  // plan: reopened 2026-10-25 (owner: a progress tracker; bar, item meta, the ring), back in review.
  // radio, checkbox: reopened 2026-10-25 (owner: soft option rows, layout list, meta), back in review.
  'color-swatch', 'color-swatch-picker', 'count', 'editable-text', 'progress', 'reference-list', 'search-field', 'spinner', 'table', 'table-of-contents', 'time-field', 'timeline', // round 69 approved by the owner in chat (2026-10-22)
  // color-picker, panel, command-palette, shortcut-list, infobox, separator, nav, inline-list, file-upload: reopened 2026-10-26 (owner: dividers only where intended, the rest lightest).
  // code-block, edit-summary, queue: reopened 2026-10-25 (owner: no rule under the header or head), back in review.
  'alignment-picker', 'attachment', 'avatar', 'calendar', 'chip', 'popover', 'stepper', // rounds 69-70 approved (2026-10-22)
  'kbd', 'menu', // round 78 approved (owner, 2026-10-27: keycap sides 3, corner by height)
  'dialog', 'confirm-dialog', 'drawer', 'alert', 'toast', 'token-row', // round 68 approved (2026-10-22; kbd too); approval: reopened 2026-10-28 (question card for Setup's chat panel)
  // asset-card: reopened 2026-10-26 (owner: Preview frame folded in: wide, checker, the frame alone), back in review.
  // segmented, switch, field: reopened 2026-10-27 (owner, the Inspector's spacing: the track loses its ring; a panel's
  // switch row is its control's height with a muted label; a panel row is its control's height), back in review.
  // Layout review round 2, 2026-10-20 (owner approved, layout2).
  'surface', 'stack',
  // Round 61, 2026-10-20 (owner approved, components61): asset-card, back in review after the merge with main.
  // Round 62, 2026-10-20 (owner approved, components62): every painted ground declared in layers.css.
  // Round 64, 2026-10-20 (owner approved, components64): the Calendar rethink (rounds 63–64).
    // Round 57, 2026-10-19 (owner approved, components57); the solid file figures archived on its note (Folder keeps
  // Complete: its outline look is unchanged).
  'file-image', 'file-page', 'video-player',
  // Round 56, 2026-10-19 (owner approved, components56).
  'color-field', 'file-tile',   // Round 55, 2026-10-19 (owner approved on the review page, components55): the design-system audit's changes.
  'folder', // plan, queue: reopened in round 56 (head seam). composer-menu: reopened 2026-10-28 (chat set review).
  // Round 50, 2026-10-19 (owner approved on the review page): the chat additions and three agent chat families.
  'timestamp', 'turn-notice', // composer-menu, queue: reopened 2026-10-19 (design-system audit).
  // Round 52, 2026-10-19 (owner approved): the rest of the agent chat set.
  // attachment, edit-summary, plan, step: reopened 2026-10-19 (design-system audit).
  // Round 53, 2026-10-19 (owner approved): Kbd (backplate and gap rules), Button (its keycap gap).
    // Round 54, 2026-10-19 (owner approved). approval: reopened 2026-10-19 (design-system audit).
  // Approved 2026-09-27 after all phases (batches 1-3).
  'toolbar', 'split-button', // segmented: reopened 2026-10-16 (Layers sweep, round 30).
  // Approved 2026-09-28 (batch 4).
    // Approved 2026-09-28 (batch 5).
  'indicator', // badge was already approved
  // Approved 2026-09-28 (batch 6; progress was already approved).
  'skeleton',
  // Approved 2026-09-28 (batch 7; popover was already approved).
    // Approved 2026-09-28 (batch 8; number-field and box-field were already approved).
  // Approved 2026-09-28 (batch 11: 6px keycap everywhere, no stroke, plain menu shortcuts).
    // Approved 2026-09-28 (batch 12; input-group was already approved).
  // Approved 2026-09-28 (batch 14: cards, sm removed, lighter Switch off track).
    // Approved 2026-09-28 (batch 13; select and field were already approved).
  // Approved 2026-09-28 (batch 15: group gap 6 / 8; slider was already approved).
  'badge-group', // round 80 approved (owner, 2026-10-28: the auto-fit flicker fixed)
  // Approved 2026-09-28 (batches 17-19; dialog, tooltip and composer were already approved).
  'prompt-suggestions', // hover-card: reopened 2026-10-17 (round 31). message: reopened 2026-10-30 (prose lines and text flow).
  // Approved 2026-09-28 (batch 16 again after the 16 column; batch 20).
  'model-picker', 'scroll-to-latest',
  // Approved 2026-09-28 (batch 22: lighter ground, brighter syntax; code and separator were already approved).
  // code-block: reopened 2026-10-12 for size sm; approved again on the review page, round 12 (components12); reopened
  // 2026-10-16 (Layers sweep, round 30).
  'box-field', 'breadcrumb', // breadcrumb: nowrap approved (owner, 2026-10-30; reopened 2026-10-25 for the Canvas bar's trail, its round 80 ellipsis approved 2026-10-28).
  'button', 'button-group',
  // code and color-swatch reopened 2026-10-12 for the translucent swatch ring (owner: "yes apply the swatch fix").
  'composer',
  // color-field, color-picker, color-swatch-picker, panel and property-list reopened 2026-10-12: their swatches take the ring.
    'tooltip',
  // Approved 2026-10-08 on the component review page (recommendations for open questions accepted).
  'accordion', // tag: reopened 2026-10-16 (Layers sweep, round 30).
  // Approved 2026-10-08 after their requested changes.
  'date-picker',
  // Approved 2026-10-09 on the review page, round 2 (components2).
  'pagination', 'scroll-area', // tag-picker: reopened 2026-10-16 (round 30); custom-select: reopened 2026-10-23 (layout grid and the option preview).
  // Approved 2026-10-09 on the review page, round 3 (components3), after the round-2 feedback.
  'link', // kbd: reopened in round 51
  // Approved 2026-10-10 on the review page, round 5 (components5).
  // description-list: reopened 2026-10-12 for show more (visibleCount).

  // Approved 2026-10-10 on the review page, round 6 (components6), after the round-5 rethink. toggle-group: reopened
  // 2026-10-16 (Layers sweep, round 30).
  // Approved 2026-10-11 on the review page, round 7 (components7); Menu after its shortcut-column change.
  'date-range-picker', 'zoom-control', // menu: reopened 2026-10-17 (round 31).
  // Approved 2026-10-11 on the review page, round 8 (components8).
  'citation',   // Approved 2026-10-12 on the review page, round 9 (components9); badge and board reopened by the consistency pass.
    // Approved 2026-10-12 on the review page, round 13 (components13). box-model: reopened 2026-10-16 (Layers sweep, round 30).
  // Approved 2026-10-12 on the review page, round 15 (components15).
    // Approved 2026-10-12 on the review page, round 16 (components16): Asset row and the swatch ring's families.
  'asset-row', 'code', 'property-list', // color-swatch: reopened 2026-10-19 (icon-slot size); color-field: round 56 (ring).
  // Approved 2026-10-12 on the review page, round 17 (components17).
  // color-picker: reopened round 56 (the swatch ring).
  // Approved 2026-10-12 on the review page, round 20 (components20): the palette's iOS-style outline.
  // color-swatch-picker: reopened round 56 (the swatch ring).
  // Approved 2026-10-12 on the review page, round 21 (components21): the consistency pass (badge's dismiss ring at 0 is the
  // owner's own pick, O1), Board's hover and corners, Description list's show more; open questions on the recommendations.
  // board: reopened 2026-10-16 (Layers sweep, round 30).
  // description-list: approved 2026-10-13, round 23 (components23); reopened 2026-10-28 (chat set review: framed text on the card column).
  'preview-frame',
  // Approved 2026-10-13 on the review page, round 24 (components24).
  'password-field', 'otp-field',
  // Approved 2026-10-13 on the review page, round 25 (components25). stepper: back in review 2026-10-21, an open
  // step's content (children) for the Theme setup's Sidebar rail.
  // Approved 2026-10-13 on the review page, round 26 (components26): the value ring and its linear motion.
    // Approved 2026-10-13 in chat after round 26 (owner: "okay agree": the colon stays tight, "9:30").
    // Approved 2026-10-16 on the review page, round 27 (components27).
  'copy-button', 'context-menu', 'section-heading',
  // Approved 2026-10-16 on the review page, round 28 (components28).
  'card', // badge: reopened 2026-10-30 (icon gap floor 4).
  // Approved 2026-10-16 on the review page, round 29 (components29).
  // titlebar: reopened 2026-10-30 (size sm).
  // Approved 2026-10-17 on the review page, round 30 (components30), after the Layers sweep; board needs changes.
  'toggle-group', 'box-model', 'tag',
  // Approved 2026-10-17 on the review page, round 31 (components31); hover-card: "rethink the content/source".
  'board',   // Approved 2026-10-17 on the review page, round 33 (components33); the other Articles families: rethink.
  'hover-card', 'abbreviation', 'hatnote',
  // Approved 2026-10-17 on the review page, round 35 (components35); panel's token rows 8 apart (Panel stays Complete).
  'link-groups',   // Approved 2026-10-17 on the review page, round 36 (components36).
  // infobox: reopened 2026-10-19, round 56 (framed section seams).
  // Approved 2026-10-17 on the review page, round 38 (components38): every Articles family is Complete.
  'figure',   // Approved 2026-10-18 on the review page, round 47 (components47).
  // video-player: reopened 2026-10-19 (design-system audit).
  // Approved 2026-10-19 on the review page, round 48 (components48): the file explorer set.
  ]); // folder, file-tile: reopened 2026-10-19 (design-system audit); file-page: reopened round 56 (glyph-only).

/** Built/refined and awaiting owner approval; not completion. */
// Articles (2026-10-17, from Wikipedia's page): round 33 asked to rethink six (three approved in round 35) so they don't read as only
// Wikipedia (Figure: "look at other design systems/products ... keep it simple and consistent and cohesive").
// Video player (2026-10-17): owner, round 36: "should there be a real video component with its own design player controls?".
// Asset card (2026-10-18, main): the Brand tab's containers, assets and groups (owner, after Figma's file browser).
// The agent chat set (rounds 49–54) is Complete above.
// Design-system audit (2026-10-19, owner: "audit them based on the new docs, skills, guidelines … more cohesive"): the
// families whose look changed. Color swatch: 12 in a menu or Custom select icon slot (owner: "the swatch seems very
// large"). Chat cards: Menu's row gap and pressed fill, RTL chevrons, Step's instant hover, Approval's Composer corner,
// Attachment's outline edge, Composer menu's empty-row inset. Video player: the container corner. Folder: one tile per
// tone. File tile: the image ring inside the image. API renames with deprecated aliases kept the other families Complete.
// Round 55 (components55): approved Approval, Attachment, Composer menu, Folder, Plan, Queue, Step; Color swatch and
// Edit summary need changes; Asset card, File tile and Video player: rethink.
// Round 56: Plan, Queue and Infobox reopened for the seam rule Edit summary's note found.
// Color swatch's ring showed nowhere (its colour layer painted over it); fixed in round 56, so the families that draw swatches reopen.
// Round 56 approved Color field, Color picker, Color swatch picker, Edit summary, File tile, Infobox, Plan, Queue. Round 57:
// Asset card rebuilt to the owner's designs; Color swatch 14; File page blank; File image (new); Video player's play.
// Round 64 approved Calendar. Merged with main's PR #141: Surface and Stack (new, in review), and Asset card's
// containerless, hug and waterfall views, ported onto the round-61 card (in review for those views).
// Round 67 (2026-10-22) approved 19 families; Stepper and Infobox rethink, Command palette needs changes (the modal's keys).
// Round 68 (2026-10-22): the text-pair rule (a line joins its title) reopens Dialog, Confirm dialog, Drawer, Popover,
// Alert, Toast, Empty state, Checkbox and Radio; Token row's text moves onto the ramp.
// Round 69 (2026-10-22): Selection defaults to the accent (option B), so every family whose default paints Selection reopens.
export const REVIEW_COMPONENTS = new Set(['slider', 'segmented', 'switch', 'field', 'approval', 'plan', 'description-list', 'composer-menu', 'message', 'badge', 'panel', 'titlebar']); // panel, titlebar: reopened 2026-10-30, the window bar / size sm (the three-panel shell's 40 headers) // badge: reopened 2026-10-30, the icon gap floor (docs/specs/badge.md) // message: reopened 2026-10-30, prose lines and text flow (docs/research/vertical-rhythm-2026-10-30) // plan, description-list, composer-menu: reopened 2026-10-28, the chat set review (the card column at 13; the empty row in the rows' type) // approval: reopened 2026-10-28, the question card (Setup's chat panel) // slider: reopened 2026-10-24 (field variant); 2026-10-26 motion, label inside, step dots
export const componentStatus = slug => COMPLETE_COMPONENTS.has(slug) ? 'complete' : REVIEW_COMPONENTS.has(slug) ? 'review' : 'unrefined';
export const statusLabel = status => ({ complete: 'Complete', review: 'In review', unrefined: 'Unrefined' })[status];

/**
 * Approval batches (owner, 2026-09-27): "reorganize the components in phases that I can approve
 * once they have gone through all phases … in batches so I can focus on approving 2-3 components
 * at once. Once they are completely finished, mark them as officially complete and move them to
 * the bottom."
 *
 * Every family moves through the same phases, read from the repository by the gallery build:
 *   1. Audit: an audited spec (docs/specs/<slug>.md, covered by the cohesion audit).
 *   2. Visual pass: the spec's "Visual pass" section.
 *   3. Claude in Chrome: target-product captures, compared side by side (an entry in
 *      pass-status.mjs; captures without the side-by-side count as half done).
 *   4. Owner approval: the family is in COMPLETE_COMPONENTS.
 * Officially complete = all four. The gallery leads with the first batch that is not officially
 * complete, then the batches after it in order; officially complete families sink to the bottom.
 * A family approved before the phases existed keeps its approval but stays in its batch until
 * phases 1-3 are done.
 */
export const APPROVAL_BATCHES = [
  { name: 'Toolbar controls', families: ['toolbar', 'split-button', 'segmented'] },
  { name: 'Navigation lists', families: ['nav', 'menu', 'tree-view'] },
  { name: 'Status messages', families: ['toast'] },
  { name: 'Counts and banners', families: ['count', 'alert'] },
  { name: 'Identity and status marks', families: ['avatar', 'indicator', 'badge'] },
  { name: 'Loading', families: ['spinner', 'skeleton', 'progress'] },
  { name: 'Date and floating surface', families: ['calendar', 'popover'] },
  { name: 'Inspector fields', families: ['panel', 'number-field', 'box-field'] },
  { name: 'Fills', families: ['property-list', 'color-field', 'color-swatch'] },
  { name: 'Pickers', families: ['color-swatch-picker', 'color-picker', 'alignment-picker'] },
  { name: 'Buttons', families: ['button', 'button-group', 'kbd'] },
  { name: 'Text entry', families: ['input', 'input-group', 'textarea'] },
  { name: 'Choosing from a list', families: ['select', 'combobox', 'custom-select', 'tag', 'tag-picker', 'date-picker', 'field'] },
  { name: 'Date ranges', families: ['date-range-picker'] },
  { name: 'Choice controls', families: ['checkbox', 'radio', 'switch'] },
  { name: 'Values and tags', families: ['slider', 'chip', 'badge-group'] },
  { name: 'Content surfaces', families: ['card', 'table'] },
  { name: 'Layout', families: ['surface', 'stack'] },
  { name: 'Overlays', families: ['dialog', 'confirm-dialog', 'drawer', 'tooltip', 'hover-card'] },
  { name: 'Command surfaces', families: ['context-menu', 'command-palette'] },
  { name: 'Conversation', families: ['message', 'composer', 'prompt-suggestions'] },
  { name: 'Conversation controls', families: ['model-picker', 'scroll-to-latest'] },
  { name: 'Sources', families: ['citation'] },
  { name: 'Canvas controls', families: ['zoom-control'] },
  { name: 'Boards', families: ['board'] },
  { name: 'Timelines', families: ['timeline'] },
  { name: 'Renaming in place', families: ['editable-text'] },
  { name: 'Inspector', families: ['box-model', 'token-row', 'asset-row', 'preview-frame'] },
  { name: 'Page navigation', families: ['tabs', 'breadcrumb', 'pagination', 'link'] },
  { name: 'Scrolling', families: ['scroll-area'] },
  { name: 'Uploading', families: ['file-upload'] },
  { name: 'Contextual help', families: ['toggletip'] },
  { name: 'Empty states', families: ['empty-state'] },
  { name: 'Toggle sets', families: ['toggle-group'] },
  { name: 'Labelled values', families: ['description-list'] },
  { name: 'Measurements', families: ['meter'] },
  { name: 'Searching', families: ['search-field'] },
  { name: 'Shortcut sheets', families: ['shortcut-list'] },
  { name: 'Code and rules', families: ['code', 'code-block', 'separator'] },
  { name: 'Accordion', families: ['accordion'] },
  { name: 'Secure entry', families: ['password-field', 'otp-field'] },
  { name: 'Times', families: ['time-field'] },
  { name: 'Steps', families: ['stepper'] },
  { name: 'Copying', families: ['copy-button'] },
  { name: 'File explorer', families: ['folder', 'file-page', 'file-image', 'file-tile'] },
  { name: 'Assets', families: ['asset-card'] },
  { name: 'Choosing from a set', families: ['list-box'] },
  { name: 'App shell', families: ['titlebar', 'section-heading'] },
  { name: 'Media', families: ['video-player'] },
  { name: 'Agent chat', families: ['step', 'edit-summary', 'approval', 'plan', 'turn-notice'] },
  { name: 'Chat additions', families: ['attachment', 'composer-menu', 'queue', 'timestamp', 'composer'] },
  { name: 'Articles', families: ['reference-list', 'table-of-contents', 'figure', 'inline-list', 'abbreviation', 'hatnote', 'link-groups'] },
];
export const batchOf = slug => APPROVAL_BATCHES.findIndex(batch => batch.families.includes(slug));

/*
 * The Review page (review.html, owner 2026-10-04: "each new component as a dedicated preview to
 * scale for me to look at and approve ... in batches"). Each batch shows its families' specimens
 * at 1:1. `planned` lists components approved for building that have no family yet; each turns into
 * a family entry when it is built. Approval is still the owner's word, recorded in
 * COMPLETE_COMPONENTS.
 */
export const REVIEW_BATCHES = [];

// Most recently designed first. Move a family to the front when its design is worked on.
export const RECENT_COMPONENTS = ['file-image', 'asset-card', 'attachment', 'composer-menu', 'queue', 'timestamp', 'step', 'edit-summary', 'approval', 'plan', 'turn-notice', 'folder', 'file-page', 'file-tile', 'video-player', 'reference-list', 'table-of-contents', 'figure', 'inline-list', 'abbreviation', 'hatnote', 'link-groups', 'titlebar', 'section-heading', 'card', 'context-menu', 'nav', 'badge', 'list-box', 'copy-button', 'time-field', 'stepper', 'spinner', 'password-field', 'otp-field', 'preview-frame', 'asset-row', 'token-row', 'code-block', 'box-model', 'editable-text', 'timeline', 'board', 'menu', 'zoom-control', 'citation', 'date-range-picker', 'shortcut-list', 'search-field', 'meter', 'description-list', 'toggle-group', 'empty-state', 'panel', 'link', 'file-upload', 'command-palette', 'toggletip', 'scroll-area', 'pagination', 'tag', 'drawer', 'confirm-dialog', 'date-picker', 'tag-picker', 'custom-select', 'accordion', 'badge-group', 'checkbox', 'radio', 'dialog', 'count', 'alert', 'toolbar', 'switch', 'chip', 'table', 'model-picker', 'scroll-to-latest', 'message', 'prompt-suggestions', 'hover-card', 'combobox', 'composer', 'box-field', 'property-list', 'number-field', 'toast', 'popover', 'split-button', 'button-group', 'button', 'tree-view', 'breadcrumb', 'tooltip', 'indicator', 'icon-pilot', 'color-picker', 'color-swatch-picker', 'color-field', 'color-swatch', 'alignment-picker', 'input-group', 'avatar', 'input', 'progress', 'segmented', 'select', 'skeleton', 'calendar'];
