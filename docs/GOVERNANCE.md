# Governance

How the library grows without becoming bloated, inconsistent or misaligned. Read it before
adding a component, a variant, a prop or a setting. The `area-component-intake` skill
applies it.

Area wants breadth. Each addition must still:

- earn its place;
- reuse what exists;
- speak the shared vocabulary;
- stay as easy to remove as it was to add.

Adding is cheap when agents do the building, but every addition costs review, states,
keyboard behaviour, documentation and every future system-wide pass.

## 1. Decide what kind of change it is

Work down this ladder and stop at the first rung that meets the need. Write the answer,
and why each rung above it failed, in the proposal.

| # | Answer | When | Area example |
|---|---|---|---|
| 1 | **Nothing new** | An existing component already does the job. Point to it and its usage. | Icon-only Button covers "icon button"; there is no second implementation |
| 2 | **A setting** | The difference applies to every component at once (colour, size, shape, stroke, depth, motion). | Density, Radius, Elevation are settings; no component has a `compact` variant |
| 3 | **A composition** | Existing components arranged together solve it, with no new API. Ship it as a gallery tile or template. | Inspector rows are Panel + PanelRow + NumberField |
| 4 | **Content or a slot** | The component needs to hold something new (icon, count, action, description). Add a slot or children, not a `show*` flag. | Nav `trailing`, Card parts |
| 5 | **A value on an existing axis** | A new treatment, tone, size or layout that the axis already names. | Alert `layout="banner"`, not a Banner component |
| 6 | **A new axis or boolean** | An independent dimension that combines with every other axis. | Count `pill` |
| 7 | **A new component** | A distinct job with its own anatomy, behaviour or semantics (gates below). | Count is not a Badge; Toggletip is not a Tooltip |
| — | **App-only** | Only the app needs it, and it is layout rather than a component. Use app classes, never an `.area-*` override. If a component falls short, fix the component or record a gap in [Product UI](PRODUCT_UI.md#open-component-gaps). | The Canvas grid |

When the evidence is thin, the answer is **gather more evidence**, not "build it anyway".
Record the candidate in [Components](COMPONENTS.md#candidates) with what is missing. The
Action tile waits for captures in two more products.

## 2. Gates for a new component

A new component needs all five, written in its spec's Job and boundaries:

1. **Useful.** Name its real uses: where ChatGPT, Notion, Figma or Cursor use it, or at
   least two design systems that ship it for the same job.
2. **Unique.** Name the nearest existing component and why it cannot do the job. Count
   independent jobs and behaviours, not silhouettes. Badge labels and Chip is chosen;
   Select is native and Combobox filters; Table displays and DataGrid edits.
3. **Composable.** It is built from the shared tokens, roles and parts. It reuses peers'
   slots (Button for actions, Menu for lists, Popover for floating, Input's shell for
   fields) instead of redrawing them.
4. **Consistent.** It paints shared roles the shared way and lines up with its peers
   ([Principles](PRINCIPLES.md#3-one-role-one-paint)).
5. **Worth maintaining.** Its states, keyboard contract, documentation and tests are in
   scope from the start. Partial behaviour is written down, never implied.

And one precondition: **the owner asked for it.** Agents do not start components the owner
has not requested; they propose them as candidates.

## 3. Gates for a variant, prop or setting option

- **A real use.** A target product or a source shows it, and one line justifies it in the
  spec's Variants table. Catalogue names alone are not a reason.
- **On the right axis.** It belongs to exactly one axis (below), and every combination with
  the other axes is valid. An illegal combination means the axis should split, or the value
  belongs on another axis.
- **Not a setting in disguise.** If it would apply to every component, it is a setting.
  Light/dark, density, type size and contrast are never variants.
- **Visible and removable.** It gets one gallery tile. Removing it later must not break any
  other variant.
- **Settings are numbers or names with one effect each** ([Principles](PRINCIPLES.md#7-settings-not-looks)).
  Never package several settings into a named look. Never cut an existing option to
  simplify; make its effect visible instead.
- **Every viable option is offered** (owner, 2026-10-22, "everything to be part of a series of choices"). A detail that
  could go more than one way becomes a setting, not a fixed value; its range is every option that renders correctly with
  every other setting and clears contrast, proved by a test over the whole range.
- **Both themes are decided.** Say whether the setting differs by mode (one per mode, set apart in the Inspector and the
  setup, as Ground, Layers and Tint strength) or is shared (as Tint hue and Text tint), and test it in both.

## 4. One vocabulary

The same concept has the same name everywhere. Before naming anything, check the manifest
for the word.

**Axes** (`packages/styles/src/manifest.ts`; React props use the same names):

| Axis | Means | Values in use |
|---|---|---|
| `variant` | Visual treatment (emphasis) | `solid`, `soft`, `outline`, `ghost`, `plain`, `surface`; `underline` (Mention, a reference drawn as Link's line, 2026-11-07) |
| `tone` | Semantic meaning | `neutral`, `info`, `success`, `warning`, `caution`, `danger`, `discovery`, `inverse` |
| `size` | Scale tier | `sm`, `md`, `lg` (default `md`) |
| `orientation` | Direction | `horizontal`, `vertical` |
| `layout` | Arrangement of the parts | per component |
| `kind` | Interaction role | per component; Chart's is what it draws, `bar`, `line`, `area`, `donut`, `number` (N7, 2026-11-07) |
| `side` | Which edge it attaches to | `top`, `right`, `bottom`, `left` (logical `start` / `end` for drawers) |
| `status` | A process outcome shown by an item | the shared words `pending`, `current`, `complete`, `error`, plus a family's own (`running`, `sending`, `uploading`, `queued`, `cancelled`, `kept`, `undone`, `stopped`, `compacted`) |

**Status words** (owner, 2026-11-07, system gaps C1): not started is `pending`, the place someone is at is `current`,
finished is `complete`, failed is `error`. Never `done`, `failed`, `invalid` or `upcoming` for these; Plan's `done`,
Step's `done` / `failed`, Stepper's `upcoming` / `invalid`, Queue's `failed` and Attachment's `ready` (for `complete`,
components audit V10) are deprecated aliases kept for one release. A family adds its own word only for a state the shared four don't name (an activity in progress, a choice
taken).

**Change words** (components audit D6, 2026-11-07; Cursor's editor decorations): what happened to a file or a line
since it was last kept is `added`, `modified`, `deleted`, `untracked` or `renamed`, git's letters A, M, D, U and R,
painted in `fg-change-<status>`. One vocabulary for Tree view rows (`status`), Tabs items (`status`), Edit summary's
counts (`added` / `deleted`) and its Diff lines (`kind`), and Code block's `marks` (`@area/react` exports
`CHANGE_STATUSES`, `CHANGE_MARK`, `changeStatus`). Never `removed`: Tree view's, Diff's and Code block's `removed` and Edit
summary's `removed` count are deprecated aliases of `deleted`, kept for one release (the `__removed` part and `--removed`
line modifiers with them). A change word is not a status word: a file can be `modified` and `pending` at once.

**Unseen is a state, not a status** (D6): changed since it was last looked at. A boolean, `unseen`, on Tree view nodes
and Tabs items, drawn as a dot in the accent's indicator rung and read as "Unseen". It never recolours the status beside
it, so the two axes stay apart.

**Booleans** are adjectives for the non-default state (`fullWidth`, `iconOnly`, `flush`,
`pill`). CSS modifiers are kebab-case, React props camelCase.

**Behaviour API:**

- a value is `value` / `defaultValue` / `onValueChange(value, event)`: every field and choice group, Input, Textarea,
  Select and Password field beside native `onChange` (which runs first), and Checkbox group as an array (2026-11-07);
- several chosen from a list is `multiple`, its set `values` / `defaultValues` / `onValuesChange(values, event)` in the
  list's order (Custom select, List box, and File grid and Asset grid through it; components audit V7, 2026-11-07), so
  `value` never changes type with a mode. Checkbox group and Toggle group, whose every choice is a control of its own,
  keep `value` as an array;
- a column's order is `sort` (`ascending`, `descending`, `none`, `aria-sort`'s words) / `onSortChange(sort, event)`
  (Table's headings, V3); a fold is `expanded` / `defaultExpanded` / `onExpandedChange(expanded, event)` (Table's row
  groups);
- on/off is `checked` or `selected`;
- an overlay is `open` / `defaultOpen` / `onOpenChange`, and so is any list or menu a field or button opens (Combobox,
  Custom select, Tag picker, the Date pickers, Time field, Split button, Zoom control, Context menu; Nav group's fold);
- a close is `onDismiss` / `dismissLabel`;
- read-only is `readOnly`, painted `data-read-only` (never `readonly`);
- can't act now is `inactive`, its reason `inactiveText`, painted `data-inactive` with `aria-disabled` (Button, Menu item,
  Nav item; components audit V2, 2026-11-07). `disabled` is for a control that truly can't act; the choice is
  [Writing › Disabled or inactive](WRITING.md#disabled-or-inactive);
- pending is `loading`, its words `loadingText`, a list's empty words `emptyText` (Input, Menu, Combobox, Command
  palette); a loading mark's wait before it shows is `delay`, `"short"` 300 ms or `"long"` 1000 ms or a number (Spinner,
  Skeleton; V6), painted `data-waiting`;
- a collection is `items`;
- glyph slots are `icon` / `trailingIcon`;
- a value that differs from its default is `modified`, one that differs from what was saved is `dirty`, and either is put
  back by `onReset` (Setting row; Filter bar); both draw the one change dot (components audit N4, N5, 2026-11-07);
- a region's length is `size` / `defaultSize` / `onSizeChange(size, event)` with `minSize` / `maxSize`, in px, and a
  double-click on its handle puts `defaultSize` back (Splitter; components audit N6, 2026-11-07). Panel's `width` /
  `defaultWidth` / `onWidthChange(width)` predates it and is a known deviation (no event);
- series a legend hides are `hiddenKeys` / `defaultHiddenKeys` / `onHiddenKeysChange(keys, event)`, and showing a thing
  or a table of the same data is `view` / `defaultView` / `onViewChange(view, event)` (`"chart"` or `"table"`; Chart, components
  audit N7, 2026-11-07);
- emptying a selection is `onClear` / `clearLabel` (Selection bar, as Input's clear); the small action after a label (a
  Toggletip, a Link) is `labelAction` (Field, Setting row).

Full rules are in [Design system › CSS, manifest and React](DESIGN_SYSTEM.md#css-manifest-and-react).

**Label colours are not tones.** A hue without meaning is a `color`, from one set: `neutral`, `gray`, `brown`,
`orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `red` (Board column's and Tag's, owner 2026-11-07, system gaps C5;
Tag's `tone` is a deprecated alias). Link's and Citation's `ink` take the same hue names. Folder's palette is a
documented exception. Never extend `tone` with a hue.

**A status icon's ink** is `fg-<tone>-mark` (Alert, Toast; 2026-11-07), a brighter rung than the tone's words, for
every tone but neutral (caution and discovery added with Alert's, Toast's and Indicator's seven tones, 2026-11-07). Badge's
marks keep their own rungs, chosen per ground (the page and the tint) for 3:1 (docs/specs/badge.md).

**Known deviations** (2026-10-19 inventory; fix only when the family is next reopened, with
the owner's agreement):

- `ink` on Link and Citation;
- `type` on Scroll area;
- camelCase axis names `labelPosition` and `selectionMode`;
- non-treatment `variant` values: Citation `pill | footnote`, Link `inline | standalone`, Titlebar, Kbd `default`;
- `kind` used for form (Indicator `count | dot`);
- `size` without a default (Folder, File page, File tile);
- `show*` / `hide*` booleans that switch a default part or a display rule, not optional content (listed 2026-11-07, system
  gaps T5): Dialog's and Drawer's `showCloseButton` (the close is on unless a footer or a flow takes it), Count's and
  Indicator's `showZero`, Calendar's `showOutsideDays` (react-day-picker's name), Box field's `hideLabel` (a visually
  hidden label). Password field's `showLabel` / `hideLabel` are strings, the toggle's two names, so they are labels, not
  booleans;
- `size` defaulting to `sm` (Drawer);
- `size` of `md` and `lg` only (Checkbox, Radio: the box comes from the type, and `lg` is the touch row);
- `size="xl"` on Dialog (components audit V1, 2026-11-07): four widths, sm 384 and md 480 as Drawer's, lg 720 and xl 880,
  each a measured dialog width (a chat app's settings dialog is 880, its wide dialog 720). A width ladder for one family,
  not the ramp's tier; no other family takes `xl`;
- `inactive` on Property list (recorded 2026-11-07, V2): there it means a property switched off (a
  layer's hidden fill), painted `data-inactive`, not the can't-act-now state above. Rename it (`hidden`) when Property
  list is next reopened, with a deprecated alias;
- `onWidthChange(width)` on Panel without the event (recorded 2026-11-07, N6): give it the event, as Splitter's
  `onSizeChange(size, event)`, when Panel is next reopened;
- `size="xs"` on Avatar (recorded 2026-11-07, components audit O7): an avatar on a line of text, the text line tall (18 at
  type 13, 20 at 14), measured at 20 in two reference products' profile and sidebar rows and used by the app's activity
  rows. A real use at a measured size, not the ramp's tier; no other family takes `xs`.

**One name, one size** (owner, 2026-11-07, system gaps C8): marks share heights by name (Badge, Tag and Count: `md` 20,
`lg` 24 at type 13; Tag was `sm` / `md` for the same two), and an aspect name should mean one shape everywhere. Open: Design card's `wide` is 16:9 and Asset card's is 2:1;
Design card can't take `screen` (its layout's class), so they meet when Asset card retires.

Do not copy a deviation into a new component.

## 5. Keep it lean

- **No aliases for catalogue names.** "Banner", "Sheet" and "SpinButton" are research
  inputs, not exports. An alias exists only to keep a renamed API working.
- **No `show*` / `hide*` booleans.** Optional parts are slots or children.
- **No single-layer style props** (padding, radius, colour on one part). Expose a
  component token or a slot instead.
- **Tokens.**
  - A component-private value (`--_*`) becomes a component token only when consumers need
    to theme it.
  - It becomes a semantic role only when about three components share the job.
  - No alias exists just to hide an unexplained literal.
- **Sizes.**
  - `sm` needs a real compact composition; `lg` a prominent or touch use.
  - Never `xs` or `xl` just because the token ramp has them.
  - Product-wide compactness is the Density setting.
- **Delete what nothing uses.** Parked tokens are listed in [Theming](THEMING.md#parked-tokens);
  deprecated APIs below.

## 6. Lifecycle

A status is a checklist, not a feeling. The registry,
`apps/desktop/src/content/component-status.mjs`, is the only record of status. Specs and
docs never restate it.

| Status | Means | Entry checklist |
|---|---|---|
| **Candidate** | Proposed, not built | Listed in [Components › Candidates](COMPONENTS.md#candidates) with its intake answer and missing evidence |
| **In review** | Built, waiting for the owner | Spec with job, variants, sources, anatomy, decisions, states, behaviour. CSS, manifest, React, demos with one tile per variant, Documentation entry. Checks pass. Shown on a review page |
| **Complete** | Owner accepted | The owner said so; the slug is in `COMPLETE_COMPONENTS` with the round or batch |
| **Reopened** | A refinement touched a Complete family | Moves back to In review until the owner accepts the change. A pass that only confirms keeps Complete |
| **Deprecated** | Replaced, still exported | A named replacement, `@deprecated` JSDoc pointing to it, and an entry below. In `DEPRECATED_COMPONENTS` with its replacement (2026-11-07): out of the gallery, search, Home and review batches, and a link to its page opens the replacement. It stays exported so existing markup renders |
| **Removed** | Gone | Owner approval, and no use left in the app, demos or tests |

**Deprecated now:**

- Token, replaced by `<Code swatch>`;
- MenuSearch, replaced by a Combobox or a Command palette;
- Preview frame, replaced by a containerless Asset card with no name (2026-10-26);
- the `--area-ease-spring` easing, with no replacement;
- Slider `variant="field"`, replaced by `labelPosition="inside"` (the bar with its label inside; 2026-10-26);
- status aliases: Plan `done`, Step `done` / `failed`, Stepper `upcoming` / `invalid`, Queue `failed` (2026-11-07; see
  Status words); Attachment `ready`, replaced by `complete` (2026-11-07, components audit V10), with its `--ready`
  modifier;
- Tag's and File upload item's `onRemove` / `removeLabel`, replaced by `onDismiss` / `dismissLabel`; Input's and Search
  field's `leadingIcon`, replaced by `icon` (2026-11-07).
- components audit picks (2026-11-07, O2 and O7), each kept for one release: Radio group's `readonly` state and
  `data-readonly` hook, replaced by `read-only` / `data-read-only`; Toast's `action` prop and `__action` part, replaced
  by `actions` / `__actions` (Alert's names), and Alert's `action` prop by `actions`; Indicator's `withBorder` and
  `hidden`, replaced by `bordered` and `invisible` (Indicator anchor's word); Tabs items' `id`, replaced by `value`;
- change words (2026-11-07, components audit D6; see Change words): `removed`, replaced by `deleted`, on Tree view nodes'
  `status`, Diff lines' `kind`, Code block's `marks` and Edit summary's count prop, with the `__removed` part and the
  `--removed` line modifiers;
- `CopyStatus`, replaced by `useCopy`'s `copiedLabel` / `failedLabel`: the result is said through the shared announcer
  (`announce`, DESIGN_SYSTEM.md "Announcements"; components audit D1, 2026-11-07). It renders nothing;
- the `@area/tokens/colours` export, replaced by `@area/tokens/color` (2026-11-07, system gaps T4: the public API says
  `color`, as the app's copy does). Still British: the Colors and Status colors settings' attributes
  (`data-area-colours`, `data-area-status-colours`) and internal names. Renaming an attribute is a setting change that
  saved systems hold, so it needs the foundation-change pass with a migration of saved themes; until then, nothing new
  spells it `colour`.

Renamed props keep a deprecated alias for one release, for example `options` → `items`,
`onRemove` / `onClose` → `onDismiss`, and a `label` that named a group → `aria-label`.
`grep -rn "@deprecated" packages` lists every alias.

## 7. Where each fact lives

One source per fact; everything else links to it. Restating a fact in a second place is how
docs drift.

| Fact | Source of truth |
|---|---|
| Status (complete, in review) | `apps/desktop/src/content/component-status.mjs` |
| Variants, elements, states, defaults | `packages/styles/src/manifest.ts` |
| Props and their descriptions | React source and its JSDoc |
| Exact values | Component CSS and `packages/tokens/src` |
| A component's evidence, decisions and history | `docs/specs/<slug>.md` |
| A component's usage (when to use, do and don't, parts, keys, ARIA) | `apps/desktop/src/content/documentation.mjs` (rendered on the family's Documentation tab) |
| Tiles and their order | `apps/desktop/src/content/specimens.mjs` |
| System-wide rules | `docs/DESIGN_SYSTEM.md`, `THEMING.md`, `CONTRAST.md`, `MOTION.md` |
| Why the system looks this way | `docs/PRINCIPLES.md` |
| How the app's own UI behaves | `docs/PRODUCT_UI.md` |

**Specs keep their current state current.** Variants, Anatomy, Decisions, States and
Behavior describe the component as it is now. Edit them in place in the same change as the
code. Owner decisions, the Feedback log and Review notes are history: append to them,
newest last. A reader should never have to replay the log to learn what the component does.

**A lesson that applies beyond one component** goes into the system doc or skill it
belongs to, replacing what it supersedes, in the same change.

## 8. Review and sessions

- **One session at a time.** Before starting, check `origin/main` and open pull requests,
  so two sessions never build the same thing. Each session works in its own worktree and
  merges through a pull request when the owner authorizes it.
- **Review rounds.**
  - Changes reach the owner as a review artifact: each family with a plain
    "What changed / Why", and changed variants shown Before / After side by side.
  - The owner's verdicts on the page are the record, whatever a chat summary says.
  - Unapplied verdicts are open work.
- **Judge in the app.** Relaunch Electron from the worktree you changed, then look in light
  and dark at the app's scale and at the extremes of the settings the change touches.
