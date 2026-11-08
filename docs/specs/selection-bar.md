# Selection bar spec

**Captures:** none taken; the evidence is source and bundle reads in `docs/research/components-audit-2026-11-07/` (primer.md, chat-apps.md, notion.md)
**Peers:** Toolbar (the floating surface and command spacing), Button (actions, the clear), Menu (more actions), Table and List box (what is selected), Checkbox (the selecting control), the shared announcer (`announce()`)

## Owner decisions

- 2026-11-07: components audit, "Take all recs": N2 Selection bar is built (review page St7jcEipvPoa3GvSwnAvBT).

## Job and boundaries

Selection bar says how many items are selected ("3 selected") and holds the actions that apply to them, with a way to
clear the selection, while anything is selected. It sits inline, in place of a list's or a table's head, or floats over
the bottom of the region it scrolls in. It is not Toolbar, whose commands are there whatever is selected; not a row's
own Menu or Context menu, which act on one item; and not Panel, whose rows edit what is selected rather than run actions
on it. It selects nothing itself: the list or table owns the selection and passes `count`.

Intake gates:

- **Useful.** Primer ships `Table.BulkActions` (`renderBulkActions`, `getSelectedCountLabel`, `onFocusReturn`;
  DataTable.docs.json:151); a chat app ships a library selection toolbar (`library-selection-toolbar-94da57e86e25.js`:
  `count`, `pending`, `actions`, trash selection) and sticky and floating action bars (`._StickyActionBar_fab4p_2`,
  `._FloatingActionBar_fab4p_2`); a notes app's databases show "N selected" with actions (notion.md). The 2026-09-26
  gap audit lists "Action bar (bulk-selection bar): missing".
- **Unique.** Toolbar has no count, no appearing and disappearing with a selection, no announcement and no focus
  recovery.
- **Composable.** Buttons and a Menu for the actions, a ghost icon Button for the clear, the floating Toolbar's paint,
  the shared announcer.
- **Consistent.** Floating paints the Floating stroke group's edge and `shadow-float` (DESIGN_SYSTEM.md, Elevation), as
  the floating Toolbar; the gap is Toolbar's command spacing.
- **Worth maintaining.** One state (empty), Escape, focus recovery. It will not select, count, run actions, show
  progress (the chat app's `pending`) or confirm a destructive action (a Confirm dialog does).

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| floating | false (default) | Inline, in place of a list's or table's head; no ground of its own | Primer (actions in the header row), the notes app's database |
| floating | true | Over the bottom of its scrolling region, for a grid or a long list whose head scrolls away | The chat app's `_FloatingActionBar` |
| label | string or function | The count's words, translatable | Primer `getSelectedCountLabel` |

Excluded: the chat app's sticky top bar (the inline bar in a sticky head does it), a `pending` state (an action's
Button shows `loading`), a "select all N" link (cross-page selection is the list's contract; Primer doesn't define it
either).

## Anatomy

```
root     <div role=group>   owns: flex row, 8 gap (compact 6), min height = control md + 2 × inset, corner, paint
  count  <span>              owns: "3 selected", UI type, strong, tabular figures, 4 in when floating
  actions <div>              owns: the actions, 8 apart, wrapping
  clear  <button>            owns: ghost icon-only sm Button, dismiss glyph; inline at the row's end
```

Floating inset: 0 border (the edge is an inset shadow) + 8 shell padding (compact 6) → the actions; the count's text
12 from the edge (8 + 4), as text in a frame in the agent chat's cards. Corner: the actions' corner plus the inset, at
most a pill (Toolbar's concentric rule).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| focus on appearing | stays where it was | Primer (DataTable.accessibility.md: "Showing actions preserves checkbox focus") | The proposal said to move focus when selecting by keyboard; the evidence says not to, since a keyboard user is still selecting. Not built |
| focus on clearing | back to where it came from, else `onFocusReturn` | Primer (focus restored to select-all, or `bulkActionsReturnFocusRef`; not after leaving the actions or moving into a dialog) | — |
| count words | "3 selected" | WRITING.md, "A choice of several"; Primer's default | — |
| announcement | the count on every change, including zero, and on appearing | Primer (`AriaStatus announceOnShow`, "Count changes are announced, including zero") | Through `announce()`, never a region of its own (D1) |
| group name | "Selection actions" | Primer's "Bulk actions" in Area's words | "Bulk" is a builder's word |
| clear | icon-only ghost sm Button, "Clear selection" | WRITING.md icon-only buttons; a close at the end | Primer has none (its header checkbox clears) |
| floating paint | `bg-surface`, Floating edge, `shadow-float` | Toolbar `--surface` | — |
| floating place | sticky, 16 over the region's bottom, centred | The chat app's floating bar | Not measured; 16 is the feed's frame inset |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| empty (`data-empty`) | Nothing is drawn (`display: none`); the bar stays mounted so the change to zero is said and focus can return | Primer keeps BulkActions mounted at zero |

## Behavior and accessibility

`role="group"` with `aria-label` ("Selection actions"). The count is visible text and is said through the shared
announcer each time it changes (and when the bar first mounts with a selection); the first render at zero says
nothing. Tab and Shift+Tab move through the actions natively (not a roving Toolbar: a few commands, as Primer's group).
Escape inside the bar calls `onClear`. Showing the bar never moves focus. When the focused action unmounts (the selection
cleared, or the action removed itself), focus goes back to the element it came from before it entered the bar, or to
`onFocusReturn` when that has gone; leaving the bar, or moving into a dialog an action opened, ends the hold. Forced
colours: the floating bar's edge is an outline (`forced-colors.css`). Not verified in a browser: the focus recovery is
untested outside the markup tests (the test suite renders on the server only).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| primer | design system (source) | `Table.BulkActions`: `selectedCount`, `onFocusReturn`, `getSelectedCountLabel` ("N selected"), role group "Bulk actions", AriaStatus count, MutationObserver focus recovery | `github.com/primer/react` at 35ff4972, `packages/react/src/DataTable/TableBulkActions.tsx`, `DataTable.accessibility.md` § Bulk actions | MIT | none |
| chat-app | product bundle | Library selection toolbar (`count`, `pending`, `actions`); `_StickyActionBar`, `_FloatingActionBar` | ChatGPT 26.1023.51421 `webview/assets/library-selection-toolbar-94da57e86e25.js`, `app-shared-398c891a59df.css` | evidence only | none |
| notes-app | product | Database selection: "N selected" with actions | notion.md (components audit) | evidence only | none |

## Measurements

None captured; no product's bar was rendered.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Toolbar `surface` | floating bar | Floating edge inset, shadow-float, 8 inset, concentric corner | same | Match (cohesion: "every floating surface draws the floating frame") |
| Toolbar | command gap | `ui-cluster` | `ui-cluster` | Match |
| Custom select `multiple` | count words | "3 selected" | "3 selected" | Match |

## Visual pass

Looked at in the built renderer in a browser (`desktop-dist`, the app's gallery without Electron; another session owns the running Electron), light and dark, at the app's type 13 Compact: inline and floating draw as intended; floating takes the floating Toolbar's surface in both modes. In the List
tile: the count is said on each change ("2 selected", "0 selected"), Clear and Escape empty the bar and put focus back on
the checkbox it came from. The pane runs unfocused, so focus events were dispatched by script to drive it. Not done: the
floating bar over a scrolling grid, a real keyboard pass in Electron.

## Verification

- `node --test packages/react/tests/selection-bar.test.mjs`; cohesion's floating-frame test lists the floating bar.
- Focus recovery, Escape and the announcement checked in the gallery by script (above); not with a real keyboard.
- The app's Stage took Escape first (it listens in the capture phase); it now leaves Escape to a Selection bar
  (`apps/desktop/src/stage.tsx`), as it does to fields and open overlays.

## App use

The app has no multi-select list today (Components, Icons and Imagery select one item), so nothing is swapped.

## Review note, 2026-11-07

- **What changed:** a new family for "3 selected" and the actions on a selection, inline or floating.
- **Why:** you took the audit's recommendation; Primer, a chat app and a notes app all have it. It keeps focus where it
  is when it appears, as Primer's does, so selecting by keyboard isn't interrupted.

## Feedback log

- 2026-11-07 · built from the components audit (N2); focus on appearing follows Primer, not the proposal.
