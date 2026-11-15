# Structure, product coverage and open backlog (2026-11-11)

Finding prefix **B**. Read-only. Part of the 2026-11-11 system evaluation (common brief in the conductor's scratchpad).

## 1. Scope and method

Read: `docs/research/system-gaps-2026-11-06/README.md` and its review page (artifact CWcHa47TDvM9tESQufAmD2, read with
the Artifact tool for the wording of C10, M1, V1, V2 and the Later rows, which the README does not define);
`docs/research/components-audit-2026-11-07/README.md` and `internal.md`; the product recreations README (worktree
`electron-app-audit-cleanup-35275b`, read only); `docs/COMPONENTS.md`; `.Codex/HANDOFF.md` (Current state and the
2026-11-03 to 11-06 entries in full; every `Open:` line listed with `grep`); `apps/desktop/src/content/component-status.mjs`;
`docs/research/kit-gaps-2026-11-04`, `text-gaps-2026-10-22`, `product-ui-gaps-2026-10-12.md`, `ui-patterns-2026-10-22`;
`docs/PRODUCT_UI.md` § Open component gaps; `docs/GOVERNANCE.md`, `docs/ARCHITECTURE.md`, `docs/THEMING.md`;
`packages/styles/src/manifest.ts`, `packages/react/src/**`, `packages/tokens/src/axes/registry.ts`.

How values were resolved:
- Status counts: `componentStatus()` from `component-status.mjs` run over every non-docs page in `pages.mjs` (Node 26,
  importing the `.mjs` files directly).
- Manifest census: `manifest.ts` imported with Node's type stripping; every axis, boolean, state and element tallied
  across the 150 exported blocks.
- API-row drift: each page's hand-written `api` rows in `pages.mjs` compared with the manifest's axis values and defaults.
- Token use: every `--area-*` defined in `packages/tokens/dist/css/*.css` compared with every `--area-*` named in
  `packages/styles/src`, `packages/react/src`, `apps/desktop/src` and `packages/tokens/src/emit`, then the survivors
  checked by hand against `var(...)` uses in `area.css` (the dist files on disk at 01:03 today; not rebuilt).
- Web research (Part 3) where a product type's needs were not already measured in the repo's research folders.

Not verified: anything visual (no app or browser was driven); dead CSS selectors beyond the manifest parity check
(class names are assembled at run time, so a static scan gives false positives, see B-S16); whether the product
recreations' additions (`--area-weight-heading`, `--area-title-xl-*`) will merge (they exist only in the other worktree,
uncommitted; this worktree has neither: `packages/tokens/src/axes/typography.ts:46-48`, `type-size.ts:99-102`).

## Summary

28 findings: 5 defects, 13 inconsistencies, 4 refinements, 6 opportunities. Most important first: B-S4 (six listbox
implementations, no shared keyboard hook, no DOM tests), B-S2 (the API tab is hand-written and wrong in 14+ families),
B-P1 (no shipped compositions: shell, thread, grid), B-B1 (four families have no status), B-S1 (slot vocabulary census),
B-S5 (field shell restated in five families), B-S3 (React unions bypass the manifest), B-S7 (`status` holds four
ideas), B-S16 / B-P5 (brand secondary and tertiary colours read by nothing), B-P3 (hierarchy stops at 26 / 500).

---

## 2. Part 1: open backlog, reconciled

### 2.1 Registry census (`component-status.mjs`)

126 family pages (plus the icon pilot). **69 Complete, 52 In review, 4 Unrefined, 1 Deprecated** (Token is deprecated
too but has no page).

| Status | Families |
|---|---|
| Unrefined (4, a registry defect: see B-B1) | code-block, composer, custom-select, meter |
| Deprecated (1 page) | preview-frame (→ asset-card); token (→ code) has no page |
| In review (52) | below |

In review, with the reason each was reopened (from the comments in `component-status.mjs`):

| Family | Reopened | Reason |
|---|---|---|
| chart, mention, splitter, page-header, selection-bar, setting-row, filter-bar | 2026-11-07/08 | new (components audit N1–N7) |
| toolbar | 2026-11-07 | N14 `floating` hover action bar |
| attachment | 2026-11-07 | V10 file / quote / video kinds, Retry, `complete` |
| queue | 2026-11-07 | O6 "not sent" through the announcer |
| design-card | 2026-11-06 | new (Design containers) |
| asset-card | 2026-11-01 | badge slot (a status on the picture) |
| table | 2026-10-31 | cells on the prose line, block inset matching the frame |
| nav, tree-view | 2026-10-31 | plates 8 from the panel edge, row padding 6 (q-plates); nav also the icon-only item (10-29) |
| card | 2026-10-30 | one space for every slot, templates |
| slider | 2026-10-24/26 | field variant, motion, label inside, step dots |
| segmented, switch, field | 2026-10-27 | Inspector spacing: track loses its ring, switch row at control height |
| approval | 2026-10-28 | question card for Setup's chat panel |
| plan, description-list, composer-menu | 2026-10-28 | chat set review (card column at 13; empty row) |
| message | 2026-10-30 | prose lines and text flow; O6 sending / error 11-08 |
| badge | 2026-10-30, 11-01 | icon gap floor 4; plain variant |
| count | 2026-11-07 | pill again, marks' text side, one-digit circle |
| panel, titlebar | 2026-10-30/31 | window bar, size sm, md inset follows density |
| radio, checkbox | 2026-10-30 | one-line card / soft row takes the height ladder's corner |
| alert, toast, indicator, dialog, menu, button, list-box, combobox, command-palette, tabs, edit-summary, file-tile, tag-picker, time-field, otp-field, date-picker, date-range-picker, spinner, skeleton, split-button, context-menu | 2026-11-08 | components audit picks (visible change or a new state, variant or slot) |

### 2.2 Backlog table

Status words: **open** (not built, verified absent), **partial**, **built**, **decide** (waits on the owner).

| Item | Source | Status now | Evidence | Still worth doing |
|---|---|---|---|---|
| C2 one frame recipe (Card, Surface, Asset card, Design card) | system gaps | open | no shared frame part; `stroke-selected` ring painted in 5 component files; Asset card's 7 axes `manifest.ts:1298`, Design card's own CSS | yes: the largest duplicated geometry; blocks C9 and the `wide` collision |
| C9 one frame prop | system gaps | open | five spellings remain: `variant=surface/plain` (approval, calendar, color-picker, edit-summary, plan, toolbar `manifest.ts:88,110,119,540,563,576`), `variant=card/soft` (checkbox, radio), `container=framed/basic/containerless` (`:1298`), boolean `framed` (description-list, settings-group `:270,1203`), `variant=surface/soft/plain` (surface `:882`) | yes, after C2 |
| C10 overlay width hooks + corner roles | system gaps (decide) | open | Command palette `600px /* spec */` `command-palette.css:41`, Confirm dialog `420px` `confirm-dialog.css:11`, no public `--area-*-width` on Dialog, Drawer, Command palette (only `--area-popover-inline-size`, `--area-menu-min-inline-size`) | yes, the width hook (S); corner role still the owner's eye |
| M1 menus open faster (180) | system gaps (decide) | decide | `motion.ts:7` "210 by default"; `MOTION_STEPS` `:37` | yes as a decision: every measured app opens 150–200 |
| V1 weights between the stops | system gaps (decide) | open | exactly two weights, `typography.ts:46-48` (400, 500) | yes, merged with B-P3 (heading weight) and the weight settings in §4.3 |
| V2 0.5px hairline on floating surfaces | system gaps (decide) | partial | Stroke width has `hairline` (one device pixel) for cards, panels and floating surfaces together (`surface.ts:45-58`); no floating-only value, and the 90% surface + 16px blur is not offered | the floating-only part: decide (it would be a Stroke-group value, `stroke-floating` exists for contrast only) |
| D1 fuller usage entries | system gaps | open | schema is still six fields `documentation.mjs:8-13`; 70 of 126 entries list no states (incl. popover, toast, drawer, confirm-dialog, command-palette); 33 list no keys | yes |
| D2 stage and date per family | system gaps | open | `components.tsx` shows `statusLabel` only; no date or history field anywhere | yes, S–M |
| Q1 DOM behaviour tests | system gaps | open | no jsdom / happy-dom / testing-library / playwright in any `package.json` | yes, top priority (see B-S4: six listbox implementations, no shared keyboard hook) |
| Q2 screenshot baseline | system gaps | open | `scripts/` has `capture-compare.mjs` but no baseline or CI job | yes |
| Q3 accessibility runs | system gaps | partial | `prefers-contrast: more` is emitted (`emit/css.ts:205`); no axe, no target-size rule, no RTL / forced-colours run | yes |
| M4 linear() spring | system gaps (later) | open | no `linear(` easing in `packages/tokens/src/axes` | later |
| M5 motion check in the app | system gaps (later) | open | no script or skill | later |
| D4 pattern guidance pages | system gaps (later) | open | Patterns tab holds screens only | yes: the product matrix (Part 3) shows patterns are the main gap |
| D5 props from the code | system gaps (later) | open, and now costing | `pages.mjs` api rows are hand-written and stale in ≥ 14 families (B-S2) | yes, promote to Build |
| T1 lighter CSS per system | system gaps (later) | partial | `packages/output` prunes the axes sheet to a system's values (ARCHITECTURE § Output); `area.css` itself still 3.38 MB on disk | partial is enough for output; app bundle unchanged |
| T2 DTCG token export | system gaps (later) | open | no `$value` / `$type` writer in `packages/tokens/src` or `packages/output` | yes, for design-tool handoff |
| T3 release readiness | system gaps (later) | open | react, styles, tokens, output at 0.0.0, no LICENSE or CHANGELOG; only icons 0.1.0 has both | yes before any outside use |
| S2 writing skill | system gaps (later) | open | `.claude/skills` has no writing skill (WRITING.md exists) | later |
| C8 tail: `wide` 16:9 vs 2:1 | system gaps | open | `manifest.ts` Design card `aspect: square/wide`, Asset card `square/landscape/hug/wide/screen` | superseded by C2 / Asset card retirement |
| `data-area-colours` attributes British | system gaps T4 tail | open | GOVERNANCE § 6 "Still British" | yes, with the saved-theme migration |
| V8 Tree view lazy branches | components audit (later) | open | Candidates row; no `loading` on Tree view | later |
| V11 Tag status shape + smaller size | components audit (decide) | decide | Tag sizes `md/lg` only `manifest.ts` | decide |
| V12 Document tabs | components audit (later) | open | Tabs has `status`/`unseen` but no close, dirty, pinned; Nav `orientation: horizontal` draws the closable strip | yes, and resolve the Tabs / horizontal Nav overlap (B-S6) |
| V13 Toast progress + several actions | components audit (decide) | partial | Toast `actions` exists (O7); no progress | decide |
| V14 Diff split + per-change actions | components audit (later) | open | Diff is unified only | yes for an IDE (Part 3) |
| V16 Floating outline | components audit (later) | open | Table of contents has no `floating` | later |
| N8 Find bar | components audit (later) | open | no family | yes: IDE, document editor, reader (3 product types) |
| N9 Image viewer | components audit (later) | open | no family | yes: media, social, e-commerce |
| N10 Text and Heading | components audit (decide) | decide | no Text/Heading component; product recreations found hierarchy flat | yes, now evidenced (B-P3) |
| N11 Calendar and timeline views | components audit (later) | open | Calendar is a date picker (`calendar: layout month/week`) | yes: calendar and project tools need it |
| N12 Status bar, notification history | components audit (later) | open | no family | yes: IDE (status bar), every app (inbox) |
| N13 Peek | components audit (later) | open | Drawer composition only | later |
| D2 responsive props | components audit (decide) | decide | no viewport props anywhere | yes: mobile shells (Part 3) |
| D3 one slot vocabulary | components audit (decide) | decide | head / header, foot / footer, action / actions, trailing / end (B-S1) | yes, now with a census |
| D4 smoother corner option | components audit (decide) | decide | no `corner-shape` in styles | decide |
| D7, D8, D9 toasts, truncation tooltips, loops under reduced motion | components audit (decide) | decide | rules unchanged in WRITING.md / MOTION.md | decide |
| App shell (sidebar, header, content, side pane, foot bar) | product recreations; COMPONENTS Candidates "App-shell layout"; product-ui-gaps #10 | open | `AppShell.tsx` exports only Titlebar and SectionHeading (`AppShell.tsx:21,44`); `app-shell.css` has no layout | yes: blocked all four recreations |
| Thread (column, turns, docked composer, fade) | product recreations | open | no composition or part | yes |
| Account row (avatar, name, second line, menu) | product recreations | open | Nav item has no description line (`Nav.tsx:105-119`) | yes, as a Nav item slot |
| Pane header with a centre | product recreations | open | Titlebar has children + `end` (`AppShell.tsx:16-27`); Panel bar has `title` + one `action` (`primitives.tsx:632`) | yes |
| Weight 600 + title step between 26 and 52 | product recreations | open here (built uncommitted elsewhere) | `typography.ts:46-48`; `type-size.ts:99-102` | yes |
| Message heading role | product recreations | open | Message has no heading part | yes |
| Reading face / reply size by pane width | product recreations | open | one face `typography.ts:43` | yes (typeface setting, B-P2 customization) |
| Code colours beyond six roles | product recreations | open | `code.css:493-499`: keyword, tag, attr, string, comment, punct | yes for IDE |
| Density below 24 (22 rows) | product recreations | open | `density.ts:12` "never under 24" | decide (owner): WCAG 2.5.8 floor vs IDE density |
| Scroll edges / fade where content meets a bar | product recreations; ui-patterns #4 | open | Code block has an end fade only | yes, a rule + a Scroll area option |
| Editor tab strip (close, dirty dot) | product recreations | open | see V12 | yes |
| Status bar | product recreations | open | see N12 | yes |
| Terminal / log view | product recreations | open | no family | yes for IDE, admin (logs) |
| Inline diff per-hunk actions, CodeBlock start line | product recreations | open | see V14 | yes |
| Document blocks (quote, callout, to-do, page icon) | product recreations; COMPONENTS "Notion parts" | open | Alert is not a callout; no block family | yes for document editors |
| Compact reference row (32 tile) | product recreations | open | Card thumbnail 84; Asset row 56 (`asset-row.css:18`) | yes, a Card size or Asset row `sm` |
| Rating pair (good / bad) | product recreations; COMPONENTS "Rating" | open | none | yes, a Toggle group composition first |
| Message attachments slot; bubble width from container | product recreations | open | no `attachments` prop in `Message.tsx` | yes |
| Composer replaceable primary (voice) | product recreations | open | `sendButton` built internally `Composer.tsx:179-207` | yes, a slot |
| Table add row, footer / summary row, header icon | product recreations | partial | `TableGroup` summary only (`primitives.tsx:1445`) | yes |
| Tree view `revealActions`, heading, open-folder icon | product recreations | open | no `revealActions` in `TreeView.tsx` (Nav has it, `Nav.tsx:105`) | yes |
| Breadcrumb icon per item | product recreations | open | no `icon` in `Breadcrumb.tsx` | yes, S |
| Tabs icon-only; strip without panels | product recreations | open | no `iconOnly` on Tabs | yes, S |
| Panel `maxWidth` 500 cap | product recreations | open | `primitives.tsx:632` `maxWidth = 500` | yes: default to none or the container |
| Approval two plain buttons | product recreations | open | `layout: list/grid` only `Approval.tsx:32` | later |
| CopyButton `label` vs `aria-label` | product recreations | open | `CopyButton.tsx:90` | yes, rename with alias |
| PropertyList name | product recreations | open | name unchanged | later (rename on reopen) |
| Region depth at defaults (Layer contrast 0) | product recreations; fidelity 11-04 | decide | owner's pick 2026-10-26 | decide; dark near-black leaves no room (B-P4) |
| Kit gap 1: Plan pending ring 1.1:1 in a chat | kit-gaps | open | pending ring on an edge token `plan.css:108` | yes |
| Kit gap 2: fixed table at 268 splits code | kit-gaps | open | `--_label-column: 27%` `navigation.css:330` | yes, a never-break rule for Code in cells |
| Kit gap 4: Reference list em dash vs WRITING | kit-gaps | open | `ReferenceList.tsx:57-58` | decide |
| Kit gap 5: FIGURES off | kit-gaps | open | `setup-screen.tsx:2,17` | later |
| Description list `columns` 160 term | text-gaps | open | `description-list.css:16` `160px` | decide (Notion's measured value) |
| Selectable surface recipe | product-ui-gaps #2 | built | Card `selected`, Design card, Asset card states (`manifest.ts` states) | done |
| 2-D grid collection | product-ui-gaps #3 | partial | List box `layout: grid` (`manifest.ts` listBox) ; app still has `grid-keys.ts` | yes: icon / swatch sheets still app code |
| Nav hover actions, Context menu per item, Table baseline | product-ui-gaps #7–9 | built | `Nav.tsx:160`, `ContextMenu.tsx:14` `itemSelector`, Table `baseline` boolean | done |
| Tabs sticky list | PRODUCT_UI open gaps | open | no `stickyList` | yes, S |
| Forced state hook for specimens | PRODUCT_UI open gaps | open | no hook; `check:app-css` reports 13 known rules | yes |
| Width hooks: Slider, Slider range, Progress, Radio | PRODUCT_UI open gaps | open | no `--area-slider-*inline*`, `--area-progress-inline*` | yes, S |
| Fieldset hidden legend; List box frameless grid; Button text-size hook | PRODUCT_UI open gaps | open | — | later |
| Handoff Open: Design file size, pen, booleans, multi-select, layer tree, Hug/Fill in grids | HANDOFF 11-08 | open | `.Codex/HANDOFF.md:26-27` | app work, not system |
| Handoff Open: app chrome doesn't take library defaults; Calendar, Split button don't read SystemDefaults | HANDOFF 11-08 | open | `.Codex/HANDOFF.md:56-58`; `useSystemDefault` absent in `Calendar.tsx`, `SplitButton.tsx` | yes, S |
| Handoff Open: `area check` in CI, GitHub destination, publish `npx area` | HANDOFF 11-08 | open | `.Codex/HANDOFF.md:89-91` | yes with T3 |
| Handoff Open: sm marks 14 at type 13 shorter than any surveyed | HANDOFF 11-07 | open | `.Codex/HANDOFF.md:167-168` | yes, measure |
| Handoff Open: Approval at 22 beside 16 frames | HANDOFF 11-04 | superseded | aligned answers settled 22 (kit-gaps item 3) | no |
| COMPONENTS Candidates (Action tile, DataGrid, Date field, Form validation summary, Menu bar, Tree select/Cascader/Transfer, Media scrubber, Text swatches, Selected-label Segmented, Flow node, Editable box model, Input mask, Gradient fill, Rating, Selection frame, Stat, File explorer next, Color picker next, Notion parts, Figma parts, Chat next, Stack divider, Content tools, App shell, Grid, Shelf) | COMPONENTS.md:66-106 | all open | none has a family, manifest or React export (index.ts) | ranked in Part 3 §4.2 |
| COMPONENTS.md lists Preview frame in the Library | COMPONENTS.md:19 | defect | deprecated since 2026-11-07 | fix in place (B-B3) |

### 2.3 Part 1 findings

**B-B1 · defect · four families have no status.** `code-block`, `composer`, `custom-select` and `meter` resolve to
`unrefined` (`component-status.mjs:181`), though their comments say "in review" (`:18-19` code-block, `:90` composer,
`:28-29` meter, `:97` custom-select) and none is in `REVIEW_COMPONENTS` (`:171`). This is the same slip the table
comment records for nav and tree-view on 2026-10-31. Fix: add the four to `REVIEW_COMPONENTS`, and add a test that every
page slug resolves to complete, review or deprecated (never unrefined) unless listed as intentionally unrefined. Visible:
the gallery shows them In review, not Unrefined. S, high.

**B-B2 · inconsistency · status lives in comments.** 171 lines of `component-status.mjs` carry the history as comments
interleaved with the set literals; the reason a family is In review is only in a one-line trailing comment of 2,000+
characters (`:171`). Fix: a `REVIEW_REASONS` map (slug → date, reason, source), the same data D2 needs for the page.
M, high.

**B-B3 · defect · doc counts stale.** COMPONENTS.md "126 families (2026-11-07)" holds, but lists Preview frame among the
library (`:19`); ARCHITECTURE says 99 component files (`:99`, actual 108), 138 blocks (`:149`, actual 150), 119 families
(`:271`, actual 126), and that `surface.css` holds 7 blocks (`:100`, actual 10: alert, card, dialog, menu, panel,
popover, surface, toast, toaster, tooltip). Fix: generate these counts (the check-docs script can assert them). S, high.

**B-B4 · opportunity · the Later list has aged into Build.** D5 (props from the code) now has measured cost (B-S2),
D4 (pattern pages) is the main gap in Part 3, N8/N9/N11/N12 each appear in three or more product types in Part 3. Fix:
re-rank the Candidates with Part 3's counts. S.

---

## 3. Part 2: the system's structure

Only what is new since `components-audit-2026-11-07/internal.md` (which covered value / open / read-only APIs,
validation, tones on Alert / Toast / Indicator, Dialog size, List box multiple, Nav size, Avatar xs) and the system gaps
(status words, dismiss, colour names, frame spelling, C2). Where an item extends one of those, it says so.

### 3.1 Census: axis names and values (150 manifest blocks)

| Axis | Families | Values in use | Off-vocabulary uses |
|---|---|---|---|
| `size` | 55 | sm/md/lg; md/lg (checkbox, radio, tag); sm/md (14 families); xs (avatar); xl (dialog) | AlignmentPicker and ModelPicker take `size` in React (`AlignmentPicker.tsx:22`, `ModelPicker.tsx:42`) with no manifest axis |
| `variant` | 35 | solid, soft, outline, ghost, plain, surface, underline + card, divided, track, bar, pill, footnote, inline, standalone, ruled, floating, color, modern, default, quiet, on-color | 13 non-treatment values (GOVERNANCE lists 4 of them as deviations) |
| `layout` | 18 | per family | used for content kind on Asset card (`asset/image/color/group`) and Design card (`part/screen/phone/icon/color`); `kind` is the axis for that (B-S8) |
| `orientation` | 12 | horizontal, vertical, auto (field) | single-value axes: Nav `horizontal`, Tabs `vertical`, Slider `vertical` (B-S9) |
| `tone` | 8 | 7 status tones + inverse; Meter `data`; Box model `info/neutral`; Avatar `neutral/inverse` | React-only tones: Switch `neutral/custom` (`Switch.tsx:16`), Confirm dialog `neutral/danger` (`ConfirmDialog.tsx:16`) |
| `status` | 6 manifest + 9 React | outcome words | four meanings (B-S7) |
| `kind` | 5 | attachment, chart, chip, indicator, mention | — |
| `side` / `placement` | 3 / 1 | top/right/bottom/left (popover, tooltip), end/start/bottom (drawer), top-end… (indicator anchor) | physical and logical words for one idea (B-S10) |
| single-family axes | 31 | caption, fill, fit, mosaic, container, days, track, steppers, bar, ground, marker, type, spacing, gap, separator, author, controls, activation, overlap, actions, resize, selectionMode, labelPosition… | Asset card alone owns 7 axes (`manifest.ts:1298`) |

Booleans (59 names): the repeats are `full-width` 16, `pill` 5, `rounded` 5, `flush` 4, `icon-only` 4, `on-color` 4,
`interactive` 3, `wrap` 3, `divided` 3. The rest are single-family.

States (53 names): `disabled` 29, `invalid` 13, `read-only` 12, `selected` 11, `open` 10, `success`/`warning` 10,
`dragging` 5, `inactive` 4, `loading` 3, `collapsed` 3, `waiting` 3; then 40 single-family names.

### 3.2 Census: part names (manifest `elements`)

| Job | Names in use (families) |
|---|---|
| top band | `header` 13 (board column, calendar, card, code block, color picker, composer group, custom select, dialog, drawer, file upload item, menu, meter, popover); `head` 7 (approval, asset card, attachment, edit summary, field, plan, queue); `bar` (panel) |
| bottom band | `footer` 13; `foot` 1 (approval, which has `footer` as well) |
| title | `title` 25; `heading` 10; `label` 28; `name` (React prop on 8 card / tile / row families) |
| secondary text | `description` 20; `meta` 9; `lede` 1 (section heading; Page header says `description`); `caption` 4 |
| end slot | `actions` 21; `action` 7 (card, chip, file upload, input, split button, toast, turn notice); `trailing` 4; `end` 3 (slider, slider range, titlebar); `header-action` (card) |
| glyph | `icon` 30; `leading-icon` / `trailing-icon` (badge); `trailing-icon` (chip); React `leadingIcon` deprecated on Input and Search field |
| picture | `media` 6; `preview` 5; `picture` 2; `thumbnail` 0 (Card's layout value) |
| close | `dismiss` 9 (settled by C4) |

### 3.3 Six-surface drift (a 25-family sample, plus automated checks over all 126)

Automated over all 126 pages: every page has a manifest, a CSS block, a Documentation entry and existing demos; two
families have no spec of their own (Titlebar and Section heading share `app-shell.md`); six specs have no family
(`inspector.md`, `overlay.md`, `resizable-panel.md`, `typography.md`, `infobox.md` (removed 2026-10-26),
`preview-frame.md` (deprecated)). Documentation states agree with manifest states in every entry that lists them
(one miss: Count's `single`). Specs were current in all 25 sampled (each new value named in its spec). The drift is in
two places: the hand-written API rows in `pages.mjs` (the family's API tab) and React unions typed by hand.

| Family | Spec | Manifest | React | CSS | Demos | Docs | API tab (`pages.mjs`) |
|---|---|---|---|---|---|---|---|
| Button | ✓ | 7 tones | ✓ | ✓ | ✓ | ✓ | "ButtonTone (8 values)" `:1192` (7) |
| Split button | ✓ | variant has `ghost` | ✓ | ✓ | ✓ | ✓ | variant lists solid/soft/outline `:1284` |
| Alert | ✓ | 7 tones, `actions` | ✓ | ✓ | ✓ | ✓ | 5 tones `:2276` |
| Toast | ✓ | 7 tones, `actions` | ✓ | ✓ | ✓ | ✓ | 5 tones, `title / action` (the deprecated name) `:2393-2395` |
| Dialog | ✓ | size sm–xl, `full-height` | ✓ | ✓ | ✓ | ✓ | no size or fullHeight row `:2427-2434` |
| Badge | ✓ | 6 variants incl. plain | ✓ | ✓ | ✓ | ✓ | 5 variants `:1793` |
| Slider | ✓ | variant track/bar, no default | `"rail" \| "track" \| "bar" \| "field"`, default rail (`primitives.tsx:842,934`) | ✓ | ✓ | ✓ | `"rail" \| "track" \| "bar"` `:1705` |
| Slider range | ✓ | track/bar | `"rail" \| "track" \| "bar"` hand-typed (`SliderRange.tsx:24`) | ✓ | ✓ | ✓ | — |
| Meter | ✓ | tone incl. `data` | ✓ | ✓ | ✓ | ✓ | tone row omits data `:297` |
| OTP field | ✓ | outline/soft, sm–lg | ✓ | ✓ | ✓ | ✓ | omits soft, sm, lg |
| Tag picker | ✓ | outline/soft, sm–lg | ✓ | ✓ | ✓ | ✓ | omits soft, sm, lg |
| Date picker | ✓ | sm–lg | ✓ | ✓ | ✓ | ✓ | omits sm, lg |
| Field | ✓ | orientation incl. auto | ✓ | ✓ | ✓ | ✓ | omits auto |
| Asset card | ✓ | layout asset/image/color/group, container framed/basic/containerless, caption | ✓ | ✓ | ✓ | ✓ | stale layout and default, no caption row |
| Plan | ✓ | bar none/single/segmented, variant | ✓ | ✓ | ✓ | ✓ | bar default "—", no variant row |
| Approval, Code block, Edit summary, Citation, Board, Table, Tabs, Tree view, Titlebar | ✓ | variant / layout / color / selection / size axes | ✓ | ✓ | ✓ | ✓ | no row for at least one axis |
| Alignment picker | size in spec | **no `size`** | `size` sm/md/lg hand-typed | — | ✓ | ✓ | size row |
| Model picker | no size in spec | **no `size`** | `size` sm/md/lg (`ModelPicker.tsx:42`) | — | ✓ | ✓ | — |
| Switch | `custom` in spec | no `tone` | `tone?: "neutral" \| "custom"` (`Switch.tsx:16`) | — | ✓ | ✓ | — |
| Confirm dialog | ✓ | no `tone` | `tone?: "neutral" \| "danger"` (`ConfirmDialog.tsx:16`) | — | ✓ | ✓ | — |
| Menu | ✓ | states disabled/highlighted/selected/inactive; `loading` is an element | `loading`, `emptyText` (V5) | ✓ | ✓ | ✓ | — |
| Table | ✓ | states selected/collapsed; no `loading` | `loading`, `aria-busy` (`primitives.tsx:1353`) | ✓ | ✓ | ✓ | no layout row |
| Chart | ✓ | state `busy` | prop `loading` → `aria-busy` (`Chart.tsx:502`) | ✓ | ✓ | ✓ | omits kind `number` |
| Count, Tag | ✓ | ✓ | ✓ | ✓ | ✓ | Count misses `single` | ✓ |

17 variant / size / tone / layout unions are typed by hand in React (`grep '^\s*(variant|size|tone|layout)?: "'`), so
ARCHITECTURE's "variant props come from the manifest types" (`ARCHITECTURE.md:210`) does not hold for them.

### 3.4 Findings (most severe first)

**B-S1 · inconsistency · one slot vocabulary does not exist (extends components audit D3, now measured).** The census
in 3.2: `head` (7) beside `header` (13); `foot` beside `footer` inside one family (Approval); `action` (7) beside
`actions` (21) after O7 moved only Alert and Toast; `trailing` (Menu, Nav, Tree view, Number field) beside `end`
(Titlebar, Slider) beside `header-action` (Card); `description` vs `lede` vs `meta` for the same second line (Section
heading `lede`, Page header `description`, Asset row `meta`); `media` / `preview` / `picture` for the same picture slot.
Rule: one name per job: `header` / `footer` for bands, `title` for a component's own title, `label` for a control's
name, `description` for the second line (`meta` only for tabular facts: a size, a time, +N −N), `actions` for the end
cluster (`action` only for a single built-in action), `trailing` for an item's end, `media` for a picture, `icon`
everywhere glyphs go. Migrate on reopen with aliases; add a manifest lint that rejects a new element name outside the
list. Visible: none. M, high.

**B-S2 · defect · the API tab is hand-written and wrong in at least 14 families.** Table 3.3. The tab tells a reader
Alert and Toast have five tones (seven since O4), that Toast's slot is `action` (deprecated), that Badge has no plain
variant, that Button has eight tones, that Dialog has no size. GOVERNANCE § 7 makes the manifest the source for
variants and React's JSDoc for props, yet `pages.mjs` restates both. Fix: generate the API rows from the manifest and
the `*Props` JSDoc already loaded by `virtual:component-sources` (ARCHITECTURE:264), keeping hand rows only for
behaviour notes; this is system gaps D5, which should move from Later to Build. Add a check that every manifest axis
value appears in the tab. M, high.

**B-S3 · inconsistency · React unions bypass the manifest.** Seventeen hand-typed unions; four carry values the
manifest doesn't have (Slider `rail` and `field`, Slider range `rail`, Switch `tone`, Confirm dialog `tone`) and two
families have a React `size` with no manifest axis (Alignment picker, Model picker). The manifest parity check cannot
see these, so the gallery, the Inspector's derived playground (`components.tsx:89`) and `packages/output`'s pruned
manifests miss them. Rule: every visual prop's type is `VariantProps<typeof MANIFESTS.x>[axis]`; a base value with no
class (Slider's `rail`) is a manifest default, not an off-manifest literal. Add a type test. S–M, high.

**B-S4 · defect · six listbox implementations and no shared keyboard primitive.** `role="listbox"` is drawn by
Combobox, Custom select, Tag picker, List box, Command palette and the Composer's parts; arrow-key handling is written
in 21 files (`grep -c ArrowDown`), Home/End in 14; the only shared pieces are `useAnchoredPosition`,
`scrollOptionIntoList`, `useOpenState` and a `TYPEAHEAD_RESET` constant (`overlay.ts:98-193`). The paint is shared (every
popup list renders `.area-menu__*` rows), the behaviour is not, and none of it is tested in a DOM (Q1). Missing
primitive: `useListNavigation` (active index, wrap, Home/End, typeahead, disabled skip, `aria-activedescendant` vs
roving focus) and `useGridNavigation` (the app's `grid-keys.ts`, product-ui-gaps #3), used by every list family. Pair
with Q1 so the hook is tested once. L, high.

**B-S5 · inconsistency · the field shell is restated in five families (the C2 problem for fields).** Input, Input
group, Number field, OTP field and Tag picker each write the same slot ladder (`--_border` / `--_border-hover` /
`--_border-focus` with the focus-recolor mix, the soft variant's `input-edge-soft`, `--_field-corner` from height,
radius factor and `pill-field`, and a size block per tier): `tag-picker.css:14-52`, and 13–16 distinct `--area-input-*`
reads in each of input, number-field, otp-field, tag-picker, input-group. Date picker and Custom select read only 5,
so a change to the field edge reaches them differently. Missing primitive: one field-shell rule (a shared selector list
or `@scope` block in `input.css` that every field's root joins, as list rows join `.area-menu__item`). Visible: none
today; prevents drift. M, high.

**B-S6 · inconsistency · two tab strips.** Tabs (with `selection: plate`, `status`, `unseen`) and horizontal Nav (the
app's open-document strip with its closes and 120–170 widths) both draw a row of tabs; product recreations asked for an
editor tab strip and COMPONENTS keeps "Document tabs" (V12) on Tabs. Rule: Tabs switches panels in place; a strip of
places (documents, open records) is Nav horizontal. Then V12's close, dirty dot and pinned go on Nav horizontal items,
not Tabs, and Tabs gains only `iconOnly`. Write it in COMPONENTS § Boundaries. S (decision), then M.

**B-S7 · inconsistency · `status` holds four ideas.** GOVERNANCE § 4 defines `status` as a process outcome
(`GOVERNANCE.md:93`), but Indicator's and Presence's `status` is availability (`Indicator.tsx:30`, `available / away /
busy …`), Tree view's and Tabs' `status` is a change word (`TreeView.tsx:27`, `primitives.tsx:2067`), and Pagination's
`status` is a render function for the "Page 2 of 9" text (`Pagination.tsx:44`). Rule: `status` = outcome only;
availability is `presence`, a change is `change`, Pagination's is `statusText` (as Message's `statusText`). Aliases for
one release. S, high.

**B-S8 · inconsistency · `layout` used for content kind.** Asset card `layout: asset/image/color/group` and Design card
`layout: part/screen/phone/icon/color` name what the card holds, which GOVERNANCE assigns to `kind` (`:91`), while
`layout` elsewhere is arrangement (Alert banner, Card horizontal, Radio tile). Fold into C2: the frame takes `kind`.
S.

**B-S9 · refinement · single-value axes are booleans in disguise.** Nav `orientation: ["horizontal"]`, Nav
`selection: ["marker"]`, Tabs `orientation: ["vertical"]`, Tabs `selection: ["plate"]`, Slider `orientation:
["vertical"]` (`manifest.ts` nav, tabs, slider). Each has no default in `defaults` (25 axes across 18 families have
none: `defaults` check in 3.1 data). They work, but the derived playground offers a one-option control. Rule: an axis has its default value
listed (`orientation: ["vertical", "horizontal"]`, default named) or it is a boolean. S.

**B-S10 · inconsistency · edge words mix physical and logical.** Popover and Tooltip `side: top/right/bottom/left`;
Drawer `side: end/start/bottom`; Indicator anchor `placement: top-end/top-start/…`. Under RTL a Popover `right` stays
right while a Drawer `end` flips. Rule (Area writes logical properties everywhere, ARCHITECTURE:145): `side` takes
`top`, `bottom`, `start`, `end`; `right`/`left` stay as deprecated aliases that resolve by direction. S, medium.

**B-S11 · inconsistency · loading spelled four ways.** GOVERNANCE: pending is `loading`, painted `data-waiting` for the
delay. Manifests: `loading` state on 3 families (button, input, switch), an element on Menu (`menu__loading`), absent on
Table (prop `loading` exists), Split button (prop exists, `SplitButton.tsx:36`), Combobox; Chart's state is `busy`
(`manifest.ts` chart; `Chart.tsx:502`). Rule: a family that takes `loading` lists the `loading` state in its manifest;
`busy` is only `aria-busy`. Parity check: a React prop named in the behaviour vocabulary must have its manifest state.
S.

**B-S12 · inconsistency · open vs expanded vs collapsed.** `open` (10 families) for folds and overlays;
`expanded` (Composer, Toggletip) for the same fold-or-grow; `collapsed` (Code block, Panel, Table) as the inverse; the
vocabulary assigns `expanded` to Table row groups only (`GOVERNANCE.md:125`). Rule: `open` for anything that shows or
hides its own content (Composer's growth included), `collapsed` only where the default is open and the state is the
exception (Code block's long code). Write it in § 4. S.

**B-S13 · opportunity · missing primitives several families re-implement.** Besides B-S4 and B-S5:
- **Row with start / body / end** (label, value or control, actions): Setting row, Panel row, Token row, Asset row,
  Property list row, Description list item, Shortcut list row each set their own grid and height; Nav, Tree, Menu and
  List box already share `--area-ui-row`, but the property-style rows do not (`ui-row` reads: asset-row 0, setting-row
  0, token-row 0, property-list 0; Asset row's 56 is `preview + 2 × space-8`, not density, `asset-row.css:18`).
- **Header bar with start / centre / end**: Titlebar (`children` + `end`), Panel bar (`title` + one `action`), Page
  header, Card header, Dialog / Drawer header (shared since C7), Popover header, Board column header, Approval head,
  Plan / Edit summary / Queue heads. No centre slot anywhere (product recreations' pane header).
- **Media frame** (ratio, corner, ring as shadow, fit): Asset card, Design card, Card media, Figure, Video player,
  File image, Attachment's image tile each set their own; ui-patterns rule 7 says one recipe. Part of C2.
- **App shell / region grid**: see Part 3; every composed screen rewrites it.
These are rung 3–4 answers (composition or a shared part), not new families. L overall.

**B-S14 · refinement · families too big or too thin.** Too big: Asset card (7 axes, 4×3×4×3×5×3×2 = 4,320 combinations,
`manifest.ts:1298`) is retiring into Design card but still the gallery's container for images, colours, type sheets and
collections (HANDOFF 2026-11-06); `primitives.tsx` holds about 60 exports in 2,899 lines (Card's 12 parts, Panel, Table,
Menu, Tabs, Dialog, Popover, Toast, Slider…), against ARCHITECTURE's "one file per family" for tests. Too thin (a native
element plus a class, under 25 lines of CSS): Abbreviation (21), Hatnote (18), Timestamp (21), Model picker (19),
Copy button (14), Password field (14), Search field (15). Thin is fine where it fixes a job (Copy button's announcer),
but Hatnote, Abbreviation and Timestamp are text styles that a Text component (N10) would hold. Proposal: split
`primitives.tsx` by family (no API change); fold the three text families into N10's Text when it is built. M.

**B-S15 · defect · CSS files don't match family names.** `navigation.css` holds Select, Table and Tabs (none is
navigation; Nav is in `nav.css`); `display.css` holds Avatar, Badge (with `badge.css` beside it), Button parts,
Progress, Separator, Skeleton, Spinner; `surface.css` holds 10 blocks in 2,007 lines; `choice.css` and `color.css`
group by theme. A reader looking for Select's CSS cannot find it, and `packages/output` prunes component sheets per
file. Rule: one CSS file per block family, named by the slug. No visual change. M.

**B-S16 · inconsistency · public colour roles nothing reads.** `--area-secondary-*`, `--area-tertiary-*`
(`surface`, `solid`, `border`, `indicator`, `-hover`, `-active`), `fg-secondary*`, `fg-tertiary*`, `fg-on-secondary`,
`fg-on-tertiary` and `fg-on-support-1…8` are emitted for a system's brand colours (`semantic/brand.ts:3-14`) and read by
no component, demo or app file (0 `var()` uses in `area.css`), and they are not in THEMING's Parked tokens list
(`THEMING.md:447-460`). So a system's secondary and tertiary colours change nothing visible. Also unlisted and unused:
`gap-xl` (which L3's README says the ladder reads), `icon-xl`, `display-lg-*`, the `z-*` scale (listed). Fix: list them
as parked with the job they wait for, or give secondary/tertiary a consumer (B-P5). Static scan only: run-time-built
class names hide dead selectors, so dead CSS was not established beyond the parity check. S.

**B-S17 · refinement · `name` means two things.** On Asset card, Design card, File tile, Asset row, Edit summary and
File page `name` is the shown name (`AssetCard.tsx:20` `ReactNode`), on Custom select, List box, Date picker,
Calendar, Color picker the native form name (`CustomSelect.tsx:67` `string`). File grid and Asset grid inherit List
box's form `name` while their items take a display `name`. Rule: display text is `title` (the vocabulary's word for
an item's own title) or `label`; `name` is the form name only. S, medium.

**B-S18 · inconsistency · `AppShell.tsx` exports no app shell.** The file holds Titlebar and Section heading
(`AppShell.tsx:1-2`), the spec is `app-shell.md`, and COMPONENTS' "App-shell layout" candidate is the thing an app
shell actually is. Rename to `Titlebar.tsx` / `SectionHeading.tsx` with specs of their own, freeing the name for the
layout (Part 3, rank 1). S.

---

## 4. Part 3: building any type of product

Sources for each type's needs: the repo's own measured research (`ui-patterns-2026-10-22/*` for chat, Notion, Cursor,
Figma and consumer feeds incl. Spotify, YouTube, Airbnb, Nike, App Store; `data-views-2026-11-01`;
`components-audit-2026-11-07/*` for Primer, ChatGPT, Claude, Cursor, Notion; the product recreations), plus web research
where the repo had none: mobile shells from Material 3's component set (navigation bar, top app bar in four sizes,
bottom and modal bottom sheet, FAB and FAB menu; [Compose Material 3 package summary](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary),
[material.io components](https://material.io:443/components)); calendar views (time gutter, day columns, hour rules,
absolutely placed event blocks, an all-day row, a view-switching toolbar, drag to create; [ReUI event calendar](https://reui.io/docs/components/base/event-calendar),
[shadcn weekly planner](https://www.shadcn.io/blocks/calendar-weekly-planner),
[calendar frontend design](https://www.educative.io/courses/grokking-frontend-system-design-interview/frontend-system-design-of-a-calendar-application));
checkout ([Shopify checkout UI Polaris web components](https://shopify.dev/docs/api/checkout-ui-extensions/2026-01/polaris-web-components):
banner, choice list, clickable container, forms; the search did not confirm dedicated product-card or quantity
components, so those rows rest on the consumer-feeds notes and common practice, marked *).

Legend: **C** covered (Area family named), **K** composable (composition named), **M** missing.

### 4.1 Matrix

| Need | Chat | Doc editor | Database | Kanban | IDE | Design tool | Analytics | Admin | Store + checkout | Media | Social + messaging | Calendar | Auth + marketing | Mobile shell |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| App shell (regions, sizes, collapse) | M | M | M | M | M | M | M | M | — | M | M | M | — | M |
| Sidebar nav | C Nav, Tree view | C Nav, Tree view | C Nav | C Nav | C Tree view | C Tree view (layers) | C Nav | C Nav | — | C Nav | C Nav | C Nav | — | — |
| Bottom tab bar | — | — | — | — | — | — | — | — | — | K Nav horizontal (no bottom placement, no safe area) | K | — | — | M |
| Top bar / pane header with centre | K Titlebar | M centre | K Page header | K Page header | K Titlebar | M centre | K Page header | K Page header | K Page header | K Titlebar | K Titlebar | K Toolbar | M marketing nav bar | M top app bar sizes |
| Page title block | — | C Page header (title tops at 26/500) | C Page header | C | — | — | C | C | C | C | — | C | M hero | — |
| Thread + docked composer | M thread | — | — | — | K Message, Composer | K | — | — | — | — | M thread | — | — | M |
| Message, composer, attachments | C Message, Composer, Attachment | C Comment via Message | — | — | C | C | — | — | — | — | C (no reactions) | — | — | C |
| Rich text / document blocks | K Message prose | M blocks (callout, quote, to-do, toggle) | M | M | — | — | — | — | — | — | — | — | K | — |
| Floating format bar | — | K Toolbar `floating` | — | — | — | — | — | — | — | — | — | — | — | — |
| Slash / @ menus | C Composer menu, Mention | C Menu + Mention | — | — | C | — | — | — | — | — | C | — | — | — |
| Data table (sort, sticky, groups) | — | K Table | C Table | — | — | — | C Table | C Table | — | — | — | — | — | — |
| Editable grid, resize, virtualize | — | M DataGrid | M | — | — | — | — | M | — | — | — | — | — | — |
| Filters, saved views | — | K Filter bar + Tabs | C Filter bar, Selection bar | C Filter bar | — | — | C Filter bar | C Filter bar | K Filter bar | K Chip | — | K | — | — |
| Board columns, cards, drag | — | — | K Board | C Board (drag is the app's) | — | — | — | — | — | — | — | — | — | — |
| Record peek / detail panel | — | K Drawer | M Peek | K Drawer | — | — | — | K Drawer | — | — | — | K Popover | — | K Drawer bottom |
| Code view, syntax | C Code block | C Code | — | — | C Code block (6 roles) | C | — | — | — | — | — | — | — | — |
| Editor tab strip (close, dirty) | — | — | — | — | M | M | — | — | — | — | — | — | — | — |
| Diff (split, per hunk) | K Edit summary Diff | — | — | — | M split / hunk actions | — | — | — | — | — | — | — | — | — |
| Terminal / log | — | — | — | — | M | — | — | M audit log | — | — | — | — | — | — |
| Find bar | — | M | — | — | M | — | — | — | — | — | — | — | — | — |
| Status bar | — | — | — | — | M | M | — | — | — | — | — | — | — | — |
| Resizable splits | C Splitter, Panel | C | C | — | C | C | — | — | — | — | C | — | — | — |
| Inspector rows, number fields | — | — | — | — | — | C Panel, Number field, Box field, Color picker, Alignment picker | — | K Setting row | — | — | — | — | — | — |
| Canvas, zoom, selection handles | — | — | — | — | — | C Zoom control; M Selection frame | — | — | — | — | — | — | — | — |
| Charts, KPI numbers | — | — | K Chart | — | — | — | C Chart, Chart number, Meter | K Chart | — | — | — | — | — | — |
| Date range, comparisons | — | — | C Date range picker | — | — | — | C Date range picker | C | — | — | — | — | — | — |
| Settings rows and groups | C Setting row | C | C | C | C | C | C | C Setting row, Settings group | — | C | C | C | — | K |
| Form fields + validation | C | C | C | C | C | C | C | C Field + all fields | C | — | C | C | C | C |
| Form error summary | — | — | — | — | — | — | — | M | M | — | — | — | M | — |
| Product card, price, rating | — | — | — | — | — | — | — | — | K Card + Badge; M rating* | M rating | — | — | — | — |
| Quantity stepper | — | — | — | — | — | — | — | — | C Number field (split steppers)* | — | — | — | — | — |
| Cart drawer, order summary | — | — | — | — | — | — | — | — | K Drawer + Description list* | — | — | — | — | — |
| Checkout steps | — | — | — | — | — | — | — | — | C Stepper | — | — | — | K Stepper | — |
| Card, phone, address entry (masks) | — | — | — | — | — | — | — | — | M Input mask | — | — | — | M | — |
| Payment method choice | — | — | — | — | — | — | — | — | K Radio `layout=tile` | — | — | — | K | — |
| Image gallery / viewer | K Attachment | K Figure | — | — | — | — | — | — | M Image viewer | M | M | — | K Figure | M |
| Shelf / carousel | — | — | — | — | — | — | — | — | K Card carousel | M Shelf (no paging arrows) | K | — | K | K |
| Card grid | K | K | K | — | — | K Design card grid | K | — | M Grid | M Grid | K | — | M Grid | K |
| Video / audio player | — | — | — | — | — | — | — | — | — | C Video player; M audio, scrubber | K Video player | — | K | K |
| Feed post (avatar, body, media, actions) | — | — | — | — | — | — | — | — | — | — | K Card + Avatar + Toolbar | — | — | K |
| Reactions, comment thread | M rating pair | M thread | — | — | — | M comments | — | — | — | — | M reactions | — | — | — |
| Presence, avatars | — | C Avatar group, Indicator | — | C | — | C | — | — | — | — | C | C | — | C |
| Notifications inbox | M history | M | — | — | M | — | — | M | — | — | M | M | — | M |
| Toasts, banners | C Toast, Alert banner | C | C | C | C | C | C | C | C | C | C | C | C Alert | C |
| Month / week / day calendar | — | — | M | — | — | — | — | — | — | — | — | M (Calendar is a date picker) | — | M |
| Time slots / availability | — | — | — | — | — | — | — | — | — | — | — | M | K Time field | — |
| Timeline / Gantt | — | — | M | M | — | — | — | — | — | — | — | M | — | — |
| Sign-in, OTP, password | — | — | — | — | — | — | — | — | K | — | K | — | C Password field, OTP field, Field | C |
| Social sign-in buttons | — | — | — | — | — | — | — | — | — | — | — | — | K Button + brand mark (no logos in Area) | K |
| Pricing table, feature list | — | — | — | — | — | — | — | — | — | — | — | — | K Card + Inline list | — |
| Marketing hero, footer, nav bar | — | — | — | — | — | — | — | — | M | — | — | — | M | — |
| Onboarding steps, empty states | C Empty state, Prompt suggestions | C | C | C | C | C | C | C | C | C | C | C | C Stepper, Empty state | C |
| Search and command | C Command palette | C | C | C | C | C | C | C | K Search field | C | C | C | — | K Search field |
| Bottom sheet, action sheet | — | — | — | — | — | — | — | — | K Drawer `side=bottom` | — | K | — | — | K Drawer bottom (no grabber or detents) |
| FAB | — | — | — | — | — | — | — | — | — | — | K Button pill | — | — | M |
| Swipe row actions, pull to refresh | — | — | — | — | — | — | — | — | — | — | M | — | — | M |
| Safe areas, touch density | — | — | — | — | — | — | — | — | — | — | — | — | — | M (no `env(safe-area-inset-*)` in packages/styles) |
| Responsive props / breakpoints | M | M | M | M | — | — | M | M | M | M | M | M | M | M |
| Scroll edges / fades | M | M | M | — | M | — | — | — | — | M | M | — | — | M |

Coverage by type (cells marked C / K / M, counted from the table; a cell with both C and M counts once in each): chat 10 / 5 / 6; document editor 12 / 6 / 9; database 11 / 4 / 8; kanban 10 / 2 / 4; IDE 10 / 2 / 8; design tool 12 / 2 / 6; analytics 11 / 2 / 2; admin 10 / 4 / 6; store and checkout 6 / 9 / 7; media 7 / 3 / 8; social 10 / 9 / 8; calendar 8 / 3 / 6; auth and marketing 4 / 9 / 7; mobile shell 6 / 9 / 12. Area is strongest where its references were (analytics, design tool, chat, admin) and weakest for mobile, media, calendar and the document editor's blocks.

### 4.2 Missing, ranked by how many product types need it, through the intake ladder

| Rank | Missing | Types | Intake rung | Why the rungs above fail | Size |
|---|---|---|---|---|---|
| 1 | Responsive props / viewport ranges (components audit D2) | 14 | 6 new axis (a system-wide convention, not per family) | no setting can vary by width; compositions break at phone widths today | L |
| 2 | App shell layout (regions, default / min / max sizes, collapse order, `layered`, window controls' room) | 12 | 3 composition shipped as a layout component on Titlebar, Panel, Splitter | Titlebar, Panel and Splitter exist; the grid between them is rewritten per screen (four recreations) | M |
| 3 | Notifications history / inbox (N12) | 8 | 3 composition (Drawer or Popover + Toast rows + Empty state), a component only if a new behaviour appears | Toast and Toaster hold live toasts, not history | M |
| 4 | Scroll edges (fade or rule where content meets a bar) | 8 | 2 a rule, then 4 a Scroll area slot | not a setting; ui-patterns #4 is a measured rule nobody encodes | S |
| 5 | Grid (columns from a minimum card width) | 6 | 3 composition, then a layout component beside Stack (Candidate) | Asset grid and File grid are List boxes for selection, not layout | S |
| 6 | Image viewer (N9) | 6 | 7 new component | zoom, pan and a strip are behaviour no family has; Design viewer's zoom is app code | M |
| 7 | Thread (centred column, turn spacing, docked composer, fade) | 4 (chat, IDE, social, mobile) + design tool chat | 3 composition | Message and Composer exist; the column is rewritten each time | S |
| 8 | Text and Heading (N10) + a weight above 500 and a title step between 26 and 52 | every type (hierarchy) | 2 setting for weights, 5 value for the title step, 7 component for Text only if 2 and 5 aren't enough | the ramp tops out at title-lg 26 / 500 (`type-size.ts:102`, `typography.ts:48`) | M |
| 9 | Document blocks (callout, quote, to-do, toggle, page icon) | 4 (doc, database, kanban, marketing) | 3 compositions first (Alert for callout fails: Alert is a status message), callout as an Alert `layout` value (5) | Alert has no neutral, icon-led, non-status form | M |
| 10 | Calendar views (month / week / day grid, event blocks) (N11) | 3 (calendar, database, mobile) + kanban timeline | 7 new component | Calendar is a date picker; Timeline is an event list | L |
| 11 | Timeline / Gantt bars | 3 | 7 new component (on N11's grid) | — | L |
| 12 | Reactions / rating pair | 4 (chat, social, media, store) | 3 Toggle group composition; rating stars 7 | an exclusive good / bad pair is Toggle group `single`; stars are a new control | S / M |
| 13 | Comment thread | 3 (doc, design tool, social) | 3 composition (Message + Avatar + Composer sm) | — | S |
| 14 | DataGrid (edit, resize, virtualize) | 3 | 7 new component on Table | Table is display; edit is a contract | L |
| 15 | Form validation summary | 3 | 3 composition (Alert + Link list) | — | S |
| 16 | Input mask (card, phone, IBAN) | 2 | 5 an Input option | Input exists; the formatter is behaviour | M |
| 17 | Find bar (N8) | 2 (doc, IDE) + reader | 3 composition (Input + Toolbar + Count) | — | S |
| 18 | Editor tab strip (close, dirty, pinned) | 2 | 5 values and slots on Nav horizontal (B-S6) | — | M |
| 19 | Status bar | 2 | 3 composition (Toolbar sm, plain text items, 22 row needs the density decision) | — | S |
| 20 | Terminal / log view | 2 | 7 new component or an adapter (Content tools) | Code block is static | M |
| 21 | Diff split + per hunk (V14) | 1–2 | 5 values on Diff | — | M |
| 22 | Marketing hero, site nav bar, footer, pricing table | 1 (+ store) | 3 compositions (Page header lg, Nav horizontal, Link groups, Card) | none is a new job | S each |
| 23 | Mobile parts: bottom tab bar, top app bar sizes, FAB, swipe actions, pull to refresh, safe areas, sheet grabber / detents | 1 (mobile), each needed by every mobile app | Nav horizontal `placement=bottom` (5), Page header sizes (5), Button `floating` (6), Drawer bottom detents (5), safe-area insets (2: a setting on the shell), swipe and pull (7) | none exists; `env(safe-area-inset-*)` appears nowhere in `packages/styles` | L total |
| 24 | Audio player / media scrubber | 1–2 | 7 on Slider (Candidate) | — | M |
| 25 | Selection frame for canvases | 1 | 7 (Candidate; app-only today) | — | M |

### 4.3 Customization: what a user still cannot change through settings

Read from `registry.ts` (`AXES`, `SETTING_GROUPS` `:92-108`) and THEMING: 44 axes under Page, Accent, Emphasis, Size,
Shape, Stroke, Shadow, States, Effects, plus Contrast and Pills. Visible properties with no setting, ranked by how much
of a product's character they carry:

| Rank | Property | Today | Proposed rung | Evidence |
|---|---|---|---|---|
| 1 | **Typeface** (UI face, reading face, mono) | Geist fixed in `font-sans` (`typography.ts:43`); the app's Typography library shows installed faces but nothing switches them | 2 a setting (UI face, reading face, code face), with tracking and the icon weight re-derived per face | product recreations gap 3; customization study; owner's "every detail a choice" |
| 2 | **Weights** (text, strong, heading) | two weights, 400 / 500 (`typography.ts:46-48`) | 2 a setting per role on variable faces (system gaps V1) | ChatGPT 430 / 510 / 590, Claude 435 / 520 / 580 (system gaps bundles) |
| 3 | **Type ramp shape** (title steps, ratio, top step) | the ramp is fixed per Type number; titles stop at 26 | 2 a "Scale" setting (ratio between steps) or 5 a title-xl value | recreations: hierarchy flat |
| 4 | **Control height apart from type** | height = line + 2 × room (`density.ts:12`), so 22-row tools are out of reach and touch 44 needs Type 16 Comfortable | 2 a Control height setting (or density levels beyond three) | recreations: density stops at 24 |
| 5 | **Secondary and tertiary brand colours** | emitted (`semantic/brand.ts:3-14`), read by nothing (B-S16) | 2 give them a consumer: a "Second colour" target (links, charts' first series, badges, selection) | THEMING says brand drives them |
| 6 | **Icon set and icon weight** | Area's Glyph only; weight tied to type (`type-size.ts:90`) | 2 an Icon weight setting (Area draws at 1.125 at 14); an icon library setting is the owner's "later" (memory: custom palette, typeface, icon library) | — |
| 7 | **Region separation in dark** | Layers 0 default; at near-black there is no room for a lighter sidebar | 2 is there (Layers dark); the gap is a default and a floor (owner) | recreations "Still open" |
| 8 | **Letter spacing and line height** | derived per size, not adjustable | 2 Tracking and Leading settings (tight / default / loose) | — |
| 9 | **Spacing scale apart from density** (page margins, section gaps, reading measure) | density moves controls and gaps together; page margins and the measure are app or kit values | 2 a Layout spacing setting, or 3 the shell composition's own options | ui-patterns rules 1 and 5 |
| 10 | **Motion per intent** | one duration number and one easing (`motion.ts`, `easing.ts`); M1's 210 vs 150–200 | 2 enter / exit ratio or Speed per role (system gaps M3 tokens exist, no setting) | — |
| 11 | **Overlay material** (backdrop blur, translucency, scrim strength) | scrim fixed `#00000022` / `#00000080` (`semantic/aliases.ts:160`); material only under `data-area-material`, outside the registry | 2 a Scrim setting; Material back into the registry or documented as a scope | — |
| 12 | **Per-family corner** | one Radius + the Pills list | 2 is right; per-family corners would be a named look (no-named-looks rule) | keep |
| 13 | **Line style** (dashed or dotted dividers, focus dash) | solid only; Focus ring has five placements (`states.ts:37`) | 5 a Divider style value only if a product needs it | low |
| 14 | **Syntax palette** | six roles, strings follow the accent (`code.css:477-499`) | 2 a Code colours setting, after more roles exist (recreations gap) | IDE |
| 15 | **Chart series hues** | Series lightness only (`SERIES_AXIS`) | 2 a series hue set (Accent-led, Status-led, Rainbow) | data views study |
| 16 | **Disabled appearance, link underline, selection (::selection) colour** | fixed | 2 each only with evidence | low |

### 4.4 Findings for Part 3

**B-P1 · opportunity · patterns, not components, are the main gap.** Of the 25 missing items, 11 are rung 3
compositions (shell, thread, grid, notifications, find bar, comment thread, validation summary, status bar, marketing
blocks, document blocks first, rating pair). Area has no shipped compositions: `screens.md` describes recipes in words
and every recreation rebuilt the shell. Proposal: a Patterns layer in `@area/react` (or `packages/patterns`) with
AppShell, Thread, DocumentPage, RecordPeek, SettingsPage, Dashboard, each built only from families, no new tokens, with
the rules they encode (system gaps D4). Visible: every composed screen loses its layout CSS. L, high.

**B-P2 · opportunity · responsive behaviour is undesigned (components audit D2, decide).** No family or rule says
what happens under 768 (the products' common change point, ui-patterns "Where they disagree"); mobile shells need
placement, size and safe-area changes. Proposal: container-query-first rules per family (most already use
`container-type`, e.g. `command-palette.css:160`), a breakpoint pair in tokens, and responsive values only where a
container query cannot decide (the shell). L.

**B-P3 · inconsistency · hierarchy stops at 26 / 500.** Every product type needs a page title larger than a section
title; Area's top title is 26 at 500 and display starts at 52. The other worktree's `title-xl` and `weight-heading` (600)
fix this additively; they are not in this worktree. Rule: three levels per screen (page, section, item) separated by
size and weight, with 600 available to headings. S once merged.

**B-P4 · refinement (owner decision) · dark region depth.** Near-black dark (owner) plus Layers 0 gives one sheet; Layers dark lifts code
blocks and the composer but barely the sidebar. Options: a dark floor for the chrome ground (the sidebar 2–3 L* above
the page), or rules (hairlines) as dark's separation. Owner's call; it affects chat, doc, IDE, design tool, admin.

**B-P5 · opportunity · brand colours beyond the accent are invisible.** See B-S16 and 4.3 rank 5. A system made from
three brand colours shows one. M.

**B-P6 · opportunity · mobile is the least covered type.** 12 missing needs, mostly small: Nav horizontal at the
bottom with safe-area padding, Page header sizes (small / medium / large as Material's top app bar), Button floating,
Drawer bottom with a grabber and detents, swipe actions. All but swipe and pull are rung 4–5. M–L.

---

## 5. Already excellent; don't disturb

- One manifest drives CSS classes and React variant types, with a parity check (`check-manifest-parity.mjs`); the drift
  found here is only where something bypasses it (B-S2, B-S3), not in the mechanism.
- Every popup list renders Menu's row on `--area-ui-row` (system gaps' "already unified"); B-S4 asks for the same in
  behaviour, not paint.
- The axis registry proves orthogonality at build time (`registry.ts:150-206`): 44 axes, disjoint namespaces, one
  default each.
- Documentation states agree with manifest states wherever an entry lists them (125 of 126).
- The behaviour vocabulary in GOVERNANCE § 4 (value, multiple, open, dismiss, readOnly, inactive, sort, size) is the
  most complete written API contract in the systems surveyed; most findings here are places that predate it.
- Specs' current-state sections were current in every family sampled.
