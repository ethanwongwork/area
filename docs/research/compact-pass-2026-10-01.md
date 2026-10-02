# Compact pass: rows and floating surfaces (2026-10-01)

The family-by-family compact pass (owner, 2026-10-01: one compact version of the whole
component set, switched once with `data-area-ui="compact"`). This round covers the token
ladder and the two families that appear inside almost every other component: list rows
(Menu, Nav, Tree view, Select and Combobox options, Command palette, Context menu) and floating
surfaces (Popover, Menu, Tooltip, Hover card, Toast, Dialog).

## Owner direction

- Compact is a **proportional step-down**: padding, gaps, insets and corners shrink around the
  content, not just the box height (owner, 2026-10-01). The first round of this pass kept
  insets and corners and only fixed a row inset; the owner found the result too close to
  default.
- UI type is **12/16**, on the 4px ramp (13/18 and 11/14 were off it).
- Double-check against **vscode.dev** (Cursor's workbench) until Cursor itself is measured.
- Compact list rows are **24** (owner pick, recommended); corners go **one step down**
  (surfaces 12 → 8, rows and medium controls 8 → 6; owner pick, recommended).

## Evidence

`docs/research/captures/compact/`:

- vscode.dev, dark, redacted: `vscode--quick-pick--open`, `vscode--quick-pick-row--highlighted`,
  `vscode--context-menu--open`, `vscode--hover--open`, `vscode--settings-dialog--open`,
  `vscode--search-input--focus`, `vscode--button-sidebar--rest`, `vscode--icon-button--rest`,
  `vscode--tree-row--rest`, `vscode--checkbox--rest`, `vscode--segmented-tab--selected`,
  `vscode--editor-tab--selected`, `vscode--pane-header--rest`, `vscode--status-item--rest`.
- Figma: `figma--color-picker--open--light`, `figma--page-row--rest/selected--light`.
- Area before this round: `area--compact-*--rest--light` (13/18, 28px rows).
- Reused: Notion and Figma menu, nav, tree, popover, hover card, toast and tooltip captures
  under `menu/`, `nav/`, `tree-view/`, `popover/`, `hover-card/`, `toast/`, `tooltip/`.

## VS Code against Area

| Role | Area default | Area compact (was) | VS Code | Area compact (now) |
|---|---|---|---|---|
| UI type | 14/20 | 13/18 | lists 13/22; buttons, hover, status 12/16–19 | **12/16** |
| Caption · body text | 12/16 · 16/24 | 11/14 · 14/20 | — | **12/16 · 14/20** (on the UI ramp) |
| Button, input (md) | 32 | 28 | 26 (button 4/8 padding, input 2/6) | 28 |
| Control sides (md gutter) | 12 | 10 | 8 | **8** |
| Icon-to-label gap (md) | 6 | 6 | — | **4** |
| Icon-only button (sm) | 28, icon 16 | 24, icon 12 | 22, icon 16 | 24, **icon 16** |
| List and menu rows | 32 | 28 | lists 22, menus 24 | **24** (`ui-row`) |
| Row glyph edge · icon gap | 8 · 12 | 8 · 12 | quick pick text 6 + 1 border + 9 | **6 · 8** (labels at 30) |
| Menu inset · row gap | 4 · 2 | 4 · 2 | 4 (+1 border) · 0 | 4 · 2 |
| Separator | 4 / 1 / 4 | same | 5 / 1 / 5 | same |
| Tooltip | 28, 14/20, sides 10 | 26 | 25, 12/19, sides 9 | **24**, 12/16, sides 10 |
| Popover inset · section gap | 12 · 16 | 12 · 16 | hover 9 | **8 · 12** |
| Toast inset | 10 × 12 | same | — | **6 × 8** (28 tall) |
| Dialog inset | 16 | 16 | settings dialog 24 | **12** |
| Surface corner | 12 | 12 | 8 | **8** |
| Row corner · md control corner | 8 · 8 | 8 · 8 | 4–6 · 4 | **6 · 6** (menu rows 4, concentric) |
| Dialog corner | 16 | 18 | 8 | **12** |

VS Code and the proportional model agree on everything except one inset: VS Code's large settings
dialog keeps a 24 inset. Area's dialog follows the proportional rule (12), and the owner has not
decided otherwise; flagged below.

## Decisions and implementation

- `packages/tokens/src/axes/density.ts`: `COMPACT_TIERS` md 28 / gutter 8 / icon 16 / gap 4 /
  12/16; sm icon 16 (was 12); xs type 12/16 (was 11/14). New roles `ui-row` (32 / 24),
  `ui-row-inset` (8 / 6) and `ui-dense` (0 / 1); `gap-row` 12 / 8; `inset-surface-sm/md` 12/16
  and 8/12.
- `packages/tokens/src/axes/typography.ts`: scaled text steps along the UI ramp (12/16, 14/20,
  16/24), so compact text is 12/16, 12/16, 14/20.
- `packages/tokens/src/axes/radius.ts`: each preset publishes a default ladder
  (`radius-base-*`) and a dense one (`radius-dense-*`). A compact tier reads the curve's value
  for the same painted height (compact md 28 = default sm 6; compact sm 24 = default xs 4), so
  it keeps the axis's own rule that radius follows box height. Containers, small shapes and rows
  step down about a third (standard 12 → 8, 6 → 4, 8 → 6).
- `packages/tokens/src/emit/base.ts`: derives `radius-control(-xs…xl)`, `radius-container`,
  `radius-small`, `radius-row` from both ladders and `ui-dense`, as a live calc so a scoped
  `data-area-ui` or `data-area-radius` subtree re-derives its own corners. The leaves are
  registered; the derived tokens are not (registered derived tokens freeze at `:root`).
- Rows read `ui-row` instead of `control-md` (inset.css, Menu, Nav, Tree view, Combobox empty
  row, Command palette, the Select picker). The glyph edge is `ui-row-inset`.
- Surfaces: Popover's section gap and Dialog's concentric corner read `inset-surface-md`; Toast's
  insets read `inset-surface-sm`. The earlier fix (glyph edge no longer centred in the row) is
  kept, now as `ui-row-inset`.

Default density is unchanged: every new role equals the value it replaced at default (verified
live: rows 32, glyph 8, label 36, corners 12 / 8, popover 12 / 16, dialog 16 / 16, toast 40).

## Round 3: small components and the toast (2026-10-01)

Owner: work smallest-first (Button, Badge, Kbd, Code, …) so the components that contain them
update correctly; the owner also flagged the compact Toast action's inset and corner.

| Atom | Default | Compact | Basis |
|---|---|---|---|
| Button, Chip, Avatar | control ladder | control ladder (already scaled) | — |
| Mark ladder `mark-sm/md/lg` | 16 · 20 · 24 | **16 · 16 · 20** | one step down; sm is the 12/16 floor. VS Code key labels 18 at 11px (`vscode--keybinding--rest--dark`), count badges 19 at 10px (`vscode--count-badge--rest--dark`), inline actions 18 at 11px |
| Badge inner values | per size literals | functions of the height | the same numbers at 16 / 20 / 24, so compact md (16) is drawn as default sm (12 icon, 5 sides, 2 gap) |
| Count gutter | 4 · 6 | (height − 8) / 2 | 4 · 6 at default, 4 at compact md |
| Kbd | 20 / 16, padding 4 / 2 | the mark height; padding (height − 10) / 2 − 1 | compact md 16, padding 2, corner 4 |
| Code (inline) | 0.875em | max(12, 0.875em) | compact's 12px chrome made it 10.5, under the ramp |
| Toast block inset | 10 − 1 | inset-surface-sm + (icon − leading) / 2 − 1 | the icon and the last control sit as far from the top as from the side; compact 32 tall, control 4 in, 4 corner in 8 (owner feedback: the action's inset and corner looked wrong at 28) |

Effects: the shortcut tooltip is 24 in compact (was 28), Nav counts are 16 in 24 rows, a
Button with a Kbd keeps its proportions. Default density was snapshotted before the change
(168 mark instances) and is identical after it.

## Round 4: equal end insets (2026-10-01)

Owner: keep the equal-padding rule at compact, and fix trailing items that sit off it even at
default (Nav counts, Tree view actions). Rule: a trailing plate ends as far from its host's end
as it sits from the top; trailing ink with no plate ends on the host's glyph or text edge.
A sweep of every gallery tile at both densities (trailing painted box vs its host) found and
fixed: Nav plain count (digits 17 from the end vs label 8), Tree view and Nav row actions (end 4
vs top 2 / 0; compact corners not concentric), Button + Kbd and every trailing-mark rule (literal
20 / 16 instead of the mark roles), Alert (empty grid track gap: action 14 vs 6; compact insets),
the banner's trailing Badge (16 vs 12), and the compact small field action (filled the field).
Left by design: menu shortcuts (unboxed text, text inset), Tabs counts (no plate), Panel header
actions (the body's action column, Figma's inspector), and the compact menu switch (ends on the
row's 6px glyph edge, as Notion's toggle sits on its 8).

## Round 5: controls inside larger components (2026-10-01)

Owner: next, the small inputs and controls that sit inside larger components. Measured every
control family at both densities, then swept the start and end of every control for equal insets.

- Already proportional through the control ladder: Input, Select, Number field, Textarea,
  Segmented, Tabs, Slider, Button group, Input group, Split button (32 -> 28, 12/16, corners 8 -> 6).
- Equal insets already held inside every control: field icons 8/8 (compact 6/6), the Select
  chevron on the same edge, Segmented plates 2/2 and concentric, Toolbar items on its inset. The
  start and end sweeps both report zero mismatches at both densities.
- New layout roles (layout never reads the icon gaps, audit S14): `ui-stack` 6 / 4 (Field label to
  control) and `ui-cluster` 8 / 6 (horizontal Field gap; Toolbar inset and group gap). Toolbar's
  concentric corner follows: 16 -> 12 at compact.
- Kept: choice rows (Checkbox, Radio, Switch) keep a 24px minimum activation lane at compact,
  WCAG 2.5.8's target minimum; their 16px glyphs, Switch track and Slider thumb are native glyph
  sizes (VS Code's checkbox is 18).

## Round 6: containers (2026-10-01)

Card, Panel, Property list and Table kept fixed spacing at compact. Each steps down one rung;
component-specific values are written `default − difference × ui-dense` (0 default, 1 compact),
the same mechanism as the radius derivation, so both numbers stay in the CSS.

| Container | Default | Compact |
|---|---|---|
| Card inset · step (sm / md / lg inset) | 6 / 8 / 12 · 8 | 4 / 6 / 8 · 6 |
| Card text column · corner (md) | 16 · 24 | 12 · 18 (button 6 + 12, concentric) |
| Panel sides (md / sm) | 16 / 12 (now `inset-surface-md/sm`) | 12 / 8 |
| Panel gaps (md / sm) | 12 / 8 | 8 / 6 |
| Property list gaps (standalone) | 8 | 6 |
| Table cell above/below (sm / md / lg) | 4 / 8 / 12 | 2 / 6 / 8 |

Checked at both densities: Card's title cap sits as far from the top as from the side (16 / 16,
12 / 12) and a footer button as far from the bottom as from the side, concentric with the
corner. Default renders as before.

## Round 7: conversation and tools (2026-10-01)

Already proportional: Model picker, Scroll to latest, Breadcrumb, Color picker, the Command
palette footer. Stepped down: Message gap 12 → 8 and bubble 10 × 16 → 6 × 12, with the bubble's
corner now the Composer's (control radius + `ui-cluster`: 16 / 12; was a literal +8, 14 at
compact); Composer inset and gap read `ui-cluster` (8 / 6), corner 16 → 12 and the last action
6 from the top and the end; Code block insets 12 → 8 (header, unnumbered code and gutter keep one
column), inline end 16 → 12; Command palette search row 48 → 40. Calendar (owner 2026-10-01: "do what's right"): compact
is Notion's date picker, the compact calibration: 32 cells around 28 days, corner 6, surface 8 / 6
(240 × 230, was 276 × 264); default keeps 36 / 32, where the owner's "too compact" call
(2026-09-27) applies and days sit beside 32px Buttons. The month arrows still end on the last
day's edge (10 / 10).

## Round 8: whole-gallery sweep (2026-10-01)

A scan of every gallery element at both densities for padding or gaps of 6+ that stay identical
at compact. Large-size variants are expected to keep their values (compact lg maps onto default
md). The rest followed three patterns and now read density roles:

- 8px gaps between clustered items → `ui-cluster` (8 / 6): Breadcrumb items, Popover header,
  body and footer, Dialog footer, Toast, Alert and Tooltip gaps, Panel bar, toggle and summary,
  Card header, list and footer, Code block header, Prompt suggestions, choice groups, Slider
  range, Separator spacing, Color picker rows, stacked Composer.
- 16px section gaps → `inset-surface-md` (16 / 12): Dialog and its header, Calendar months,
  vertical Tabs; Color picker body inset.
- 12 / 20 gaps → one rung down: Hover card identity, Card blocks, Color picker rhythm (12 → 8);
  Tabs gap 20 → 16.
- Code block header: its trailing action ends as far from the edge as it sits from the top (4,
  ChatGPT 7 / 7); the filename keeps the code column.

Default is verified against the last commit: the stylesheet built from HEAD in a temporary
worktree was swapped in and every gallery element (11,584) compared at default. 120 differ, in
14 tiles, all intended: Nav and Count counts placed by their digits, the Tree view action 2 from
the end, Alert without empty-track gaps (icon and text unmoved; the text area reaches the inset),
and Progress's running animation. The start and end equal-inset sweeps report no unintended
mismatches at either density (the Command palette footer's key labels sit 12.5 from the top
including its 1px border against 12 from the start).

## Merge with main (phases 6–7, 2026-10-02)

Main (PR #33) ran in parallel and changed the same axis:

- **Marks.** Main held every mark under compact (audit S21a C, 2026-09-30: VS Code badge 17,
  keycap 18) and moved Switch, Presence and ColorSwatch onto `mark-*`. This branch's owner
  direction (2026-10-01) steps text labels down. Reconciled as two roles: `mark-*` stays 16 / 20 /
  24 at both densities for static marks (Switch track, Presence, ColorSwatch, Indicator count);
  `mark-label-*` (16 / 20 / 24, compact 16 / 16 / 20) is read by Badge, Count, Kbd and the inset
  rules that place them.
- **Surface insets.** Main removed `inset-surface-*` ("waits for the compact pass") and wrote
  Popover 12 and Dialog 16 as literals; this branch restores the roles (12 / 16, compact 8 / 12).
- **Kept from main:** titles hold in compact (H-7 A: Card and Dialog titles 16/24 at both
  densities), Input's action as the field less a 4px ring (B-7 B), `border-float` (was
  `edge-float`), Select options on the Menu row model (now reading `ui-row`), Tree view rows in
  body ink (D-3 A), Field label gap 6 (C-27 A, now `ui-stack`), Prompt suggestions' 16 gap (G-16,
  compact 12 to stay under the placeholder), and the pruned tokens.

Default checked against main's stylesheet across 11,775 gallery elements: differences only in
this branch's intended fixes (Nav and Count counts, Tree view action, Alert empty tracks, Code
block header action), plus Progress's animation and the Badge group's overflow popover state.

## Open


- Dialog inset: proportional 12, VS Code 24, Figma and Notion 16.
- Tooltip sides stay 10 (owner decision, 2026-09-25); VS Code 9, Figma 8.
- Other families still read literal spacing (Card, Panel, Alert, field shells); each gets its
  compact step in its own round.
- Cursor itself is not measured (desktop app); vscode.dev stands in.
