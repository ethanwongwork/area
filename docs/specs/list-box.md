# List box spec

**Status:** in review · 2026-10-15
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
commands (Menu); several independent toggles (Toggle group, Checkbox group); a data table with cells (Table). One
value only for now; multiple selection waits for a use.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| layout | list | React Aria ListBox's default; the value-picker rows Area already has (Custom select) | Settings lists, pickers inline in a panel |
| layout | grid | React Aria ListBox `layout="grid"`; the app's Icons sheet; Figma's asset grid, Finder's icon view (keyboard model) | the app's Icons tab |
| selectionFollowsFocus | boolean | WAI-ARIA APG listbox: selection may follow focus in a single-select listbox | the app: the Inspector follows the keys |

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
| grid option | cell `--area-list-box-item` (control-xl, 48), 2 apart, radius-row; hover `bg-component-hover`, press and selected `bg-component-active`, focus an inset ring | the app's icon cell (48 at 16), DESIGN_SYSTEM.md "Shared state paint" |
| section heading | Menu's label | Menu |
| disabled | option: `aria-disabled`, skipped by the keys, 50%; set: every option disabled | DESIGN_SYSTEM.md "Disabled" |

## Behavior and accessibility

Tab enters at the chosen option (or the first) and leaves the set; Shift+Tab returns to the same option. Clicking an
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
