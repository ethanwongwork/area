# Components audit, 2026-11-07

Owner: "audit and research any missing component variants, any new components, or ways to improve the system as a
whole, based on researching the products and design systems of chatgpt, claude, cursor, notion, and github primer."

Five read-only sweeps, each with its own file (every row cites a source path, selector, URL or file:line):

| File | Source | How |
|---|---|---|
| [primer.md](primer.md) | Primer: primer.style pages and `primer/react` at 35ff4972 (@primer/react 38.45.0) | docs + source |
| [chat-apps.md](chat-apps.md) | ChatGPT 26.1023.51421 (CSS modules, `data-*` variants) and Claude 4.16336.0 (125 `data-cds` components) | app bundles on disk, never launched |
| [cursor.md](cursor.md) | Cursor 3.27.22 (workbench and its own kit) | app bundle on disk, never launched |
| [notion.md](notion.md) | Notion public template pages (`*.notion.site`, the real app read-only) and its stylesheet | Claude in Chrome, signed out; edit-only menus not observed |
| [internal.md](internal.md) | Area itself: peer sets compared for sizes, states, slots, tones, behaviour API | source, file:line |
| [area-inventory.md](area-inventory.md) | Area's 142 manifests, generated today | baseline |

Bundle values are declared, not rendered; Notion's are computed styles. Nothing was built from this audit.

## How the proposals were chosen

Each finding went through the intake ladder (GOVERNANCE.md § 1; the `area-component-intake` skill): nothing new, a
setting, a composition, a slot, a value on an axis, a new axis, a new component. A new component needs two or more
sources for the same job; a single sighting is Later with what evidence is missing. Findings Area already covers were
dropped (Breadcrumb's ellipsis collapse, Board's column tints, Tooltip's shortcut layout, Tabs' plate on main).

## Where the sources agree

| Finding | Sources | Answer |
|---|---|---|
| Dialog sizes (widths, full height, a rule when the body scrolls) | Primer, Claude, Cursor, internal (Drawer has `size`, Dialog none) | value: `size` on Dialog |
| Disabled that stays focusable and says why | Primer `inactive`, Claude's disabled-with-reason tooltip | state: `inactive` |
| Table: sticky header and first column, sort headers, row groups with totals, skeleton rows | ChatGPT, Primer, Notion | slots and booleans on Table |
| Page header | Primer, ChatGPT, Claude | new component |
| Selection bar (N selected + bulk actions) | Primer, ChatGPT, Notion | new component |
| Mention (person, file, page, date inline) | ChatGPT, Notion, Primer's inline autocomplete | new component + Composer menu trigger |
| Setting row and settings group | Primer, Cursor, Area's own Settings page | new component |
| Filter bar (chips per filter, + Filter, Reset) | Primer, Notion | new component |
| Command palette: preview pane, path, highlighted matches, steps | Notion, Cursor | slots on Command palette |
| Menu: header and footer, empty and loading rows, trailing slot | Cursor, Primer ActionList, internal | slots and states on Menu |
| Multi-select List box; Custom select with filter, select all, Save | Primer SelectPanel, internal | `selectionMode` on List box, slots on Custom select |
| Loading by duration; Spinner and Skeleton `delay` | Primer | prop + WRITING.md (fixed today) |
| Splitter, Chart (existing candidates) | Cursor + ChatGPT (Splitter); Notion + ChatGPT (Chart) | evidence now complete |
| Find bar, image viewer | Cursor + ChatGPT / Claude | new components |
| One live-region announcer | Primer (12 hand-written regions in Area) | system utility |

## Primer disagrees with Area on three rules (the owner decides)

- Toasts: Primer discourages them for accessibility; WRITING.md sends Undo and background failures to a Toast.
- Truncated text: Primer says a tooltip is rarely right; WRITING.md shows the whole name in one.
- Reduced motion: Primer keeps quiet loading indicators moving; MOTION.md stops every loop.

## Fixed during the audit

- WRITING.md's loading rule was backwards (it said a Spinner suits waits under a second); now Primer's ladder: nothing
  under 1 s, a Spinner or Skeleton to 3 s, Progress to 10 s, then a background task.

## Proposals

The review page lists every proposal with a recommendation and a pick (`verdicts` collection); the ids below match it.
Objective fixes from the internal audit are batched (O1–O7); V are variants, N new components, S system.

| Id | Proposal | Rec | Size |
|---|---|---|---|
| O1 | Success and warning on every field | build | S |
| O2 | Read-only where peers have it | build | S |
| O3 | One open-state and one value API | build | M |
| O4 | Caution and discovery on Alert, Toast and Indicator | build | S |
| O5 | Checkbox group gets a value and a name | build | S |
| O6 | Message: sending and error | build | S |
| O7 | Small API drift | build | S |
| V1 | Dialog sizes | build | M |
| V2 | Inactive: looks disabled, still explains | build | M |
| V3 | Table: sticky, sortable, grouped | build | L |
| V4 | Command palette: preview, path, steps | build | M |
| V5 | Menu: header, footer, empty and loading | build | S |
| V6 | Spinner and Skeleton wait before showing | build | S |
| V7 | Choose several from a list | build | M |
| V8 | Tree view loads branches later | later | M |
| V9 | Message stacks and states | build | M |
| V10 | Attachment kinds | build | M |
| V11 | Tag: status shape and a smaller size | decide | S |
| V12 | Document tabs | later | M |
| V13 | Toast with progress and several actions | decide | S |
| V14 | Diff: split view and per-change actions | later | M |
| V15 | Selection when the list isn't focused | build | S |
| V16 | Floating outline | later | S |
| N1 | Page header | build | M |
| N2 | Selection bar | build | M |
| N3 | Mention | build | M |
| N4 | Setting row and settings group | build | M |
| N5 | Filter bar | build | M |
| N6 | Splitter (candidate, evidence now in) | build | M |
| N7 | Chart (candidate, evidence now in) | build | L |
| N8 | Find bar | later | M |
| N9 | Image viewer | later | M |
| N10 | Text and Heading | decide | M |
| N11 | Calendar and timeline views | later | L |
| N12 | Status bar and notification history | later | M |
| N13 | Peek | later | S |
| N14 | Hover action bar | build | S |
| D1 | One announcer for screen readers | build | M |
| D2 | Viewport ranges and responsive props | decide | L |
| D3 | One slot vocabulary | decide | M |
| D4 | A smoother corner option | decide | S |
| D5 | Every hue's full set of roles | build | M |
| D6 | Change-status words and unseen | build | S |
| D7 | Toasts: keep or discourage? | decide | S |
| D8 | Tooltips on truncated text? | decide | S |
| D9 | Keep loading loops under reduced motion? | decide | S |

Review page: Area Components Audit artifact St7jcEipvPoa3GvSwnAvBT (picks in its `verdicts` collection; read them before building). Full wording of each proposal is on the page and in the per-source files.

## Built from the picks (2026-11-08)

Owner picked O1–O5 on the page, then "Take all recs" in chat: every Build row was built, every Later row went to
`docs/COMPONENTS.md` › Candidates, and the Decide rows (V11, V13, N10, D2, D3, D4, D7, D8, D9) wait for the owner.
Nothing committed. Each family's spec carries the detail and a dated history line.

| Id | Built | Departures (recorded in the spec) |
|---|---|---|
| O1 | Success / warning on OTP, Time, Date, Date range, Custom select, Tag picker, Radio group (`validation.ts`) | Custom select's Field `aria-invalid` was overwritten; fixed |
| O2 | `readOnly` on Checkbox, Checkbox group, Custom select, Date pickers; Radio `data-read-only` (`data-readonly` alias) | Date picker read-only trigger is `role="combobox"` with `aria-readonly` |
| O3 | `open` / `defaultOpen` / `onOpenChange` on the listed families; `onValueChange(value, event)` everywhere, Input / Textarea / Select / Password field included | Context menu `open` opens at the area's start |
| O4 | Seven tones on Alert, Toast, Indicator; `fg-caution-mark`, `fg-discovery-mark` | |
| O5 | Checkbox group `value` / `defaultValue` / `onValueChange` / `name` | |
| O7 | Manifest sizes and states; Toast `actions` (`action` alias), Alert `actions`; Indicator `bordered` / `invisible`; Tabs `value`; Date picker ref on the trigger; Drawer `onDismiss`; Split button `loading`; Menu item `trailing`; Slider range `onValueCommit` | Avatar xs kept as a recorded deviation |
| O6 | Message `status` sending / error, `statusText`, `onRetry` | Word `sending` (a family activity word, as Queue); "Not sent" |
| V1 | Dialog `size` sm 384 · md 480 · lg 720 · xl 880, `fullHeight`, a rule under the header once the body scrolls | 384 / 480, not 400 / 520: Dialog was 480 and Drawer's sm is 384 |
| V2 | `inactive` + `inactiveText` on Button, Menu item, Nav item | `inactiveText` follows `loadingText` |
| V3 | Table `stickyHeader`, `stickyFirstColumn`, header `sort` / `onSortChange`, `TableGroup`, `loading` rows | Sticky inside the table's own scroll box |
| V4 | Command palette item `path`, `preview`, steps (`items`, Back), shared `highlightMatch` (Combobox, Custom select too) | Path in the row's size |
| V5 | Menu `header`, `footer`, `loading`, `emptyText` | |
| V6 | Spinner and Skeleton `delay` (`short` 300, `long` 1000), `useLoadingDelay` | |
| V7 | List box `multiple` + `values`; Custom select `filterable`, Select all, `footer`; File grid and Asset grid multi-select | `multiple` + `values`, not `selectionMode` (Governance § 4) |
| V9 | `MessageGroup` and Message `split`: 2 apart, meeting corner a quarter of the bubble's | Meeting corner derived, not measured |
| V10 | Attachment `kind` file / quote / video, `onRetry`, `badge`; status `complete` (`ready` alias) | File and quote tiles 64 × 160, not 120 square |
| V15 | A list without focus shows its selection on the hover plate (List box, Tree view, focusable Table) | No new token; Nav excluded (its current item is a place) |
| N1 | Page header | |
| N2 | Selection bar | Focus stays where it is when the bar appears (source behaviour) |
| N3 | Mention, `withMentions`; an @ menu tile on Composer menu | The Composer is a textarea: a pick writes "@Name", sent text draws Mentions |
| N4 | Setting row, Settings group | Help slot is `labelAction` (Field's word) |
| N5 | Filter bar, Filter bar item, Filter bar add | "Add filter", not "+ Filter" |
| N6 | Splitter; Panel's resizable edge shares its handle paint | The app's Sidebar and Inspector edges now show the line on rest and drag |
| N7 | Chart (`kind` bar / line / area / donut, legend toggles, tooltip, keys, hidden table) and Chart number | Line 1.5 (round 5 said 1); hidden legend item struck through |
| N14 | Toolbar `floating` (the hover action bar) | Code block's copy not swapped (not a pure swap) |
| D1 | `announce()`, `useAnnouncement`, one announcer per document; families moved onto it | Kept regions where the visible text is the message |
| D5 | `--area-hue-<hue>-*` roles for ten hues; Tag, Board, Link, Citation read them | Values unchanged |
| D6 | Change words added / modified / deleted / untracked / renamed, `--area-fg-change-*`; `unseen` on Tree view and Tabs | `removed` → `deleted` with aliases; untracked and renamed share info blue |

Reopened to In review (a Complete family that changed visibly or gained a state): Alert, Toast, Indicator, Dialog, Menu,
Button, List box, Combobox, Command palette, Tabs, Edit summary, File tile, Tag picker, Time field, OTP field, Date
picker, Date range picker, Spinner, Skeleton, Split button, Context menu (plus Queue, Attachment and Toolbar, reopened by
their builds). Families changed only in API or internals (an event argument, the announcer, tokens resolving to the
same values) keep Complete.
