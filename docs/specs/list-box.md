# List box spec

**Captures:** none of its own: every painted value is an existing shared role (below).
**Peers:** Menu (rows, label, check), Custom select (the value picker's options), the app's Icons sheet (grid cells)

## Owner decisions

- 2026-10-15: "merge it, then continue working" after the Copy button → the next gap in `docs/PRODUCT_UI.md`, "Open
  component gaps": roving focus for grids and lists (every icon cell was a Tab stop) and one selection semantic, and
  a two-dimensional collection the gallery had built itself (`apps/desktop/src/grid-keys.ts`, removed 2026-10-15).
- 2026-10-15: "merge it, then continue working" (PR #106) → Typography and Color adopt it too. Typography showed each
  role in both weights under one id, so both cells lit; each cell is now its own option ("<weight>:<role>"), the
  chosen one alone lights, and the Inspector previews that weight.

## Job and boundaries

Shows a set of options and lets a person choose one, by pointer or keyboard, with the set a single Tab stop. Two
layouts: a list (one option per row) and a grid (options flow in rows and columns: icons, swatches, type samples).

Not this component: a choice that opens from a field (Select, Custom select, Combobox: their lists are popups);
commands (Menu); several independent toggles (Toggle group, Checkbox group); a data table with cells (Table). With
`multiple` (components audit V7, 2026-11-07) it chooses several: the use is choosing several files or assets in File
grid and Asset grid, which are built on it.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| layout | list | React Aria ListBox's default; the value-picker rows Area already has (Custom select) | Settings lists, pickers inline in a panel |
| layout | grid | React Aria ListBox `layout="grid"`; the app's Icons sheet; Figma's asset grid, Finder's icon view (keyboard model) | the app's Icons tab |
| selectionFollowsFocus | boolean | WAI-ARIA APG listbox: selection may follow focus in a single-select listbox | the app: the Inspector follows the keys |
| multiple | boolean, with `values` / `defaultValues` / `onValuesChange` | APG multi-select listbox; Custom select's `multiple` (the same three names) | File grid and Asset grid (several files or assets) |

## Sources

| Id | Type | What | Link / commit / path | License |
|---|---|---|---|---|
| react-aria | design system source | ListBox: `role: 'listbox'` (`useListBox.mjs:69`); option `role: 'option'`, `aria-selected` (`useOption.mjs:41-43`); grid layout: Left / Right step through the collection, Up / Down find the next key in the same column (`ListKeyboardDelegate.mjs:53-95`) | @react-aria/listbox@3.14.0, @react-aria/selection@3.25.0 | Apache-2.0 |
| apg | guidance | Listbox pattern: one Tab stop (roving tabindex or aria-activedescendant), arrows move, Home / End, type-ahead, optional selection follows focus | w3.org/WAI/ARIA/apg/patterns/listbox | W3C |
| area-app | Area's own UI (the source of truth) | the Icons sheet: cells `--_cell` square, 2 apart, radius-row, row plates, inset focus ring (`apps/desktop/src/studio.css:656-686`); the arrow model of `grid-keys.ts` | this repo | — |

## Anatomy

```
div.area-list-box.area-list-box--{list|grid}[role=listbox]   owns: keys, the Tab stop, the value
  div.area-list-box__section[role=group]                     optional; aria-labelledby its heading
    div.area-list-box__heading.area-menu__label              Menu's label
    div.area-list-box__options                               the section's options (grid: its own grid)
  div.area-list-box__item[role=option]                       aria-selected; tabindex 0 on one option, -1 on the rest
    list: span.area-menu__text + span.area-menu__check       Menu's row (area-menu__item), the value picker's check
    grid: the caller's content (an icon, a swatch, a sample)
```

## Decisions

| Slot · property | Area value | Basis |
|---|---|---|
| semantics | listbox / option / group, `aria-selected` | React Aria; APG |
| focus model | roving tabindex: the last focused option while it is still there, else the chosen one, else the first | APG; real focus (not aria-activedescendant) so a hover card or tooltip on an option opens on focus as on hover |
| grid Up / Down | the nearest option by centre in the row above or below, across sections | the app's `grid-keys.ts`; React Aria keeps the column, which this equals on a regular grid and generalises to ragged rows |
| Left / Right (grid) | previous / next in reading order, mirrored in RTL | React Aria |
| Home / End, typing | ends; a one-second prefix, as Menu's (`TYPEAHEAD_RESET`) | APG; Menu |
| Enter / Space | choose the focused option | APG |
| list option | Menu's row (`area-menu__item`), selected = `data-selected` active plate with the check | DESIGN_SYSTEM.md "Selected rows": value pickers show their value with the active plate and the check |
| grid option | cell `--area-list-box-item` (control-xl, 48), 2 apart, radius-row; hover `bg-component-hover`, selected `bg-component-active`, press `bg-component-pressed` (a step past selected), focus an inset ring; text not selectable | the app's icon cell (48 at 16), DESIGN_SYSTEM.md "Shared state paint"; interaction polish 2026-10-16 |
| section heading | Menu's label | Menu |
| disabled | option: `aria-disabled`, skipped by the keys, 50%; set (`disabled`): `aria-disabled` on the listbox, every option disabled, the set dims once at 50% | DESIGN_SYSTEM.md "Disabled" |

## Behavior and accessibility

Tab enters at the chosen option (or the first; with `multiple`, the first chosen) and leaves the set; Shift+Tab
returns to the same option. With `multiple` (APG multi-select listbox, the recommended model: focus moves without
choosing): Space or Enter adds or removes the focused option; Shift with an arrow, Home or End moves and adds the
options from the last one toggled to where focus lands; Ctrl or Cmd+A chooses every option, or none when all are
chosen. A click toggles a row in the list; in a grid (files, assets) a click chooses that one alone, Cmd or Ctrl+click
adds or removes it and Shift+click adds the run from the last one clicked, as a file browser does. The set keeps the
options' order; `aria-multiselectable` on the root; `selectionFollowsFocus` is ignored. Clicking an
option chooses it and moves the Tab stop there. With `selectionFollowsFocus`, the arrows also choose. `textValue`
gives typing a name for an option whose content is not text (an icon). Options may carry `aria-label`. Forced colours:
the focus ring is an outline; the selected plate is a background, so in forced colours selection shows by the ring
only (to check).

## Adoption

- The app's Icons tab (grid view): one ListBox over the sheets (808 options, 33 groups); `CanvasSection` takes
  `role="group"` there. Before, every cell was a Tab stop with `aria-pressed`.
- Typography's grid (each style an option, `<weight>:<role>`) and Color's grid (each step's card: the app's Tile takes
  `option` and renders as a ListBoxItem). `grid-keys.ts` is gone. The app's tile and cell rules read `aria-selected`;
  they sit in a later layer than Area's, so a tile keeps its own look, and `place-items: normal` undoes the option's
  centring.

## Verification

- `packages/react/tests/list-box.test.mjs`: roles, one Tab stop, the chosen option, disabled, Menu rows in a list,
  groups named by their heading in a grid.
- Headless Edge with focus emulation on the app's Icons tab: Tab in → the first icon, focused and chosen; Right and
  Down move and choose; one Tab leaves; Shift+Tab returns to the same icon.

## Review note, 2026-10-15

- **What it is:** a set of options to choose one from, as a list or a grid, that is a single Tab stop: Tab goes in and
  out, the arrows move inside, typing jumps to a name.
- **Based on:** React Aria's ListBox and the app's own icon sheet, whose look it keeps. The Icons tab now uses it, so
  its 808 icons are one Tab stop instead of 808.
- **Why its own component:** its rows are Menu's rows (`area-menu__item`, the same plate and check), so it looks
  like Menu. It behaves differently: Menu runs commands and closes, Nav moves to another page, List box keeps one
  value chosen, and a screen reader hears "option, selected". It is the WAI-ARIA listbox pattern, which React Aria,
  Fluent and Spectrum each ship as its own component.

## Interaction polish, 2026-10-16

Grid options press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover); selected keeps `bg-component-active`. Option text is not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-10-15 · owner: "merge it, then continue working" → List box, from PRODUCT_UI.md's open gaps.
- 2026-10-15 · owner: "merge it, then continue working" (PR #106) → Typography and Color adopt it; the app's grid-keys.ts removed.
- 2026-10-16 · owner, review round 27 (components27) → approved → Complete in `component-status.mjs`.

## Review note, 2026-10-22 (round 67)

- **What changed:** stacked rows sit 1px apart (were 2px at the default size, and touching at Compact). Keyboard focus is the brighter indicator blue (#0160d9, was #004cb0), as everywhere since the state settings.
- **Why:** you asked for the gap between nav items to stay the same and not disappear at Compact. ChatGPT's and
  Notion's sidebars put their rows 1px apart, so `ui-row-gap` is now 1px at every type size and density, for every
  family that stacks rows. The focus colour is your pick on the state page (2026-10-21).

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** A chosen option's check fades and grows in as Menu's does, instead of appearing at once.
- **Why:** One rule for a check in a list. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

### 2026-11-07 · The event in onValueChange (components audit O3)

- **What changed:** `onValueChange(value, event)` passes the click, key or focus.
- **Why:** ListBox.tsx:41. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Selection when the list isn't focused (components audit V15)

- **What changed:** while focus is outside the List box (`:not(:focus-within)`), its selected option takes the hover
  plate instead of the selected fill, in both layouts; the check still marks it. Every tile with a selection now rests
  on the quieter plate until the list is focused. File grid and Asset grid draw selection as an edge and are unchanged.
- **Why:** docs/research/components-audit-2026-11-07/cursor.md, "Inactive selection" (the editor's lists paint `listActiveSelectionBackground` only while
  focused, `listInactiveSelectionBackground` otherwise). One rule for every list with its own focus, so the list you
  are in reads as the active one. The owner took every recommendation ("Take all recs", 2026-11-07).
- **Decision:** the quieter plate is the hover plate, not a new token. A role declared on `:root` that reads
  `bg-component-active` would resolve there and keep the page's fill on every raised and recessed ground (a menu, a
  panel, a sidebar); the hover plate is already the step below selected on every ground, its words' contrast is
  asserted, and Hover fill floors at 25, so it is never invisible (CONTRAST.md, "The quieter selected plate has a
  floor"). At Selected fill 0 the two are one plate and nothing changes.
- **Verdict:** awaiting the owner.

### 2026-11-07 · Several (components audit V7)

- **What changed:** `multiple`, with the set as `values` / `defaultValues` / `onValuesChange(values, event)`; the
  keyboard and pointer contract above. File grid and Asset grid pass it through (their props extend List box's), so a
  file or asset grid chooses several with no code of its own; Enter still opens there. Tiles: List box Behavior /
  several, File tile Behavior / several.
- **Why:** docs/research/components-audit-2026-11-07/internal.md (List box picks one value only, and the grids inherit
  it, though choosing several files or assets is their use), primer.md (SelectPanel, the multiple selection variant);
  the owner took every recommendation ("Take all recs", 2026-11-07).
- **Decision:** the set is `values`, not `value` as an array. The brief suggested `selectionMode` with `value` turning
  into `string[]`; Custom select already chooses several with `multiple` and `values` (the app uses it), `selectionMode`
  is listed as a camelCase deviation (Governance § 4), and a `value` whose type follows a mode would loosen every
  single-select caller's types and the grids' props. GOVERNANCE.md § 4 now names `multiple` / `values` as the rule.
- **Verdict:** awaiting the owner.
