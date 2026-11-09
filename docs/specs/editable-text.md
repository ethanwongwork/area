# Editable text spec

**Captures:** `docs/research/captures/editable-text/`
**Peers:** Input (field focus colour), Tree view and Panel rows (where a layer name sits), Accordion and Timeline titles
(text it renames), Search field (Escape behaviour)

## Owner decisions

- 2026-10-11: "keep working, what are your recs for the open questions" → after the Timeline questions, the next item
  on the gap list that had waited for Chrome in front: editable inline text (the 2026-09-26 gap audit's next tier).

- 2026-10-11, review round 8 (rethink): "its not very clear that the text is editable, not hover state, no indicator or
  icon or tooltip" → the text takes the shared hover plate (`bg-hover`, the row plate Figma's layer rows also show) and a
  hint tooltip on hover and keyboard focus ("Double-click to rename" / "Click to rename", `hint` to change or turn off).
  An edit icon was not added: neither product shows one, and the tooltip names the gesture.

## Job and boundaries

Editable text shows a value as plain text and turns into a field in place to rename it: a layer name, a page or file
title, a column name. It is not an Input (always a field), not a Textarea or rich text editor (multi-line, formatting),
and not a form: it edits one value and commits on Enter or blur. Validation and saving are the caller's.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| activation | dblclick (default) | Double-click opens the field; the arrow pointer stays | Figma layer names (captured); Zag/Ark `activationMode="dblclick"` |
| activation | click | One click places the caret; a text cursor | Notion titles (always editable, `cursor: text`, captured) |
| activation | focus | Tabbing in opens the field | Zag/Ark `activationMode="focus"` (its default) |
| fill | boolean | Stretch to the container, as a layer name fills its row | Figma's field fills the row's name cell (188 wide) |
| state | editing, disabled, placeholder | Runtime | Figma (editing), Zag/Ark (placeholder, disabled) |

Excluded: submit / cancel buttons (Ark's controls; neither product shows them), an edit icon (neither product shows one;
the hint tooltip names the gesture instead), multi-line editing (Textarea), auto-saving on each key
(`onValueChange` runs once per commit).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Layers panel: a layer name at rest (selected row) and in its rename field (double-click; cancelled with Escape) | figma.com, owner's file, 2026-10-11, light, read-only | evidence only | `figma--layer-name--rest`, `figma--layer-name--editing` |
| notion | target product | Database page title, rest and hover (always contenteditable) | app.notion.com, owner's board, 2026-10-11, light, read-only | evidence only | `notion--database-title--rest`, `--hover` |
| zag | design system (source) | Editable machine and connect: preview / input, activation modes, Enter / Escape, select on focus, placeholder | github.com/chakra-ui/zag `packages/machines/editable/src/editable.connect.ts` @ e89f2a33b37249f9612dfc02631ebe775bfb7c45 (:93–:203) | MIT | not rendered |

ChatGPT: the sidebar's chat menu has Rename. Its rest row was measured (36 tall, padding 6 6 6 10, radius 8, label 14/20 at
x 10). The tab stopped responding with the menu open, before the field was opened, so the field is not captured.
Nothing was renamed. Not captured: dark, Notion focus (the window was hidden, so the title would not take focus).

## Anatomy

```
figma (layers panel, 11/16 Inter)
row      div             32 tall; name cell 24 tall at x 36
  text     div             padding-left 8: name at x 44, 11/16 400
editing: input            the same cell, 188 × 24, padding 0 8 (name stays at x 44), radius 5,
                           outline 1px rgb(13,153,255) offset -1, background rgb(242,249,255), weight 450,
                           the whole name selected

notion (database title)
h1       contenteditable   padding 0 8, 32/38.4 700, cursor text; no hover or focus paint
```

Area:

```
span   .area-editable-text[--activation][--fill][data-editing][data-disabled]   inline-grid, one cell
  span   __preview   role="button", tabindex 0; padding 4 8; the value or a muted placeholder
  input  __input     only while editing, in the same cell: padding 4 8, the field focus outline (1px, inset),
                      selection surface; width 0 / min-width 100%, so it takes the hidden preview's width
```

Inset equation: text start = padding 8 in both states (Figma 8, Notion 8), so the field appears around the text without
moving it. Height = line + 4 + 4: 28 in UI text (14/20), 24 in compact (12/16), as Figma's 16 line in a 24 field.

## Measurements

Generated with `node scripts/capture-compare.mjs` (rows abbreviated).

| slot · property | figma · rest | figma · editing | notion · title | area · default | area · editing |
|---|---|---|---|---|---|
| text / field size | 27.41 × 16 (cell 24) | 188 × 24 | 96.61 × 38.4 | 63 × 28 | 63 × 28 |
| side padding | 8 | 0 8 0 8 | 0 8 0 8 | 4 8 4 8 | 4 8 4 8 |
| text start | 8 into the cell | 8 into the field | 8 | 8 | 8 |
| radius | — | 5px | 0 | — | 6px (`radius-control-xs`) |
| outline | — | 1px rgb(13, 153, 255), offset −1 | none | — | 1px field focus colour, offset −1 |
| background | — | rgb(242, 249, 255) | none | — | selection surface |
| font | 11/16 400 Inter | 450 | 32/38.4 700 | inherited (demo 14/20) | inherited |

## Decisions

| Slot · property | References | Area | Basis | Reason when it differs |
|---|---|---|---|---|
| side padding | Figma 8, Notion 8 | 8 (`space-8`) | agreement | — |
| block padding | Figma (24 − 16) / 2 = 4 | 4 | Figma (the only product with a field) | — |
| font | Figma 11/16 in a panel, Notion 32/38.4 in a title | inherited | both take their context's type | — |
| outline | Figma 1px blue, inset | 1px `field-focus-color`, inset | Figma; Input's focus role | — |
| fill while editing | Figma pale blue (its selection tint) | `selection-surface` | the matching role | grey in the neutral accent, blue in a blue accent |
| radius | Figma 5 | `radius-control-xs` (6 at the default setting) | radius role for a 24 control | follows the radius setting |
| rest paint | none in either | none | agreement | — |
| hover | Figma's row plate; Notion none | `bg-hover` plate on the text | owner (round 8), Figma | Notion's chrome-less title read as not editable |
| hint | none in either | Tooltip, "Double-click to rename" / "Click to rename" | owner (round 8) | a double-click can't be discovered by looking |
| pointer | Figma arrow (double-click), Notion text cursor | by activation | both | — |
| selection on open | Figma selects the whole name | selects all | Figma; Zag `selectOnFocus` | — |

## States

Rest: plain text. Editing: the field, everything selected. Placeholder: muted. Disabled: Area's disabled opacity,
not focusable. Focus-visible on the text: Area's focus ring.

## Behavior and accessibility

The text is `role="button"`, focusable, named "label: value". Double-click, click or focus (by `activation`) opens the
field, and so do Enter, Space (the button key; 2026-10-19) and F2 on the focused text, so every mode works from the keyboard. In the field, Enter commits
and Escape cancels; both return focus to the text. Enter that confirms an IME composition does not commit. Leaving the field commits. `onValueChange` runs once per committed
change, not per key. The field is named by `label`. Verified in the browser: open selects 0–6 of "Header", the field
grows with the draft (69 → 153), Escape restores the value and focus, Enter commits "Footer".

## Peers and consistency

| Peer | Shared role | Peer value | Editable text | Note |
|---|---|---|---|---|
| Input | focus outline | field focus colour, halo | 1px field focus colour, no halo | Figma draws no halo on a rename field |
| Tree view | row text inset | label after its icon | 8 side padding | a layer name sits in a row's name cell |

## Visual pass

Gallery at 1:1 and 2×, light default: rest reads as text; the field's outline sits exactly on the text box and the
text does not move between states. Not compared side by side with Figma in one screenshot (Chrome hidden).

## Verification

- 11 captures (4 product, 7 Area); checksums verified; product captures redacted.
- Build (parity, token references), typecheck, React tests (`editable-text.test.mjs`, 3), behaviour checked in the
  browser with dispatched events.
- Unverified: a screen reader, dark, a real double-click by hand, IME input (Enter while composing is ignored, untested).

## Open questions

1. The editing fill uses the selection surface (grey in the neutral accent). Figma's is pale blue. Recommendation: keep
   the role, so a rename field matches the selected row around it in every accent.

## Review note, 2026-10-11

- **What changed:** New component. Editable text shows a name as plain text and turns it into a field in place to
  rename it: double-click like Figma's layer names, or click like Notion's titles. Enter saves, Escape cancels.
- **Why:** It was the next item that needed Chrome to capture Figma's rename field. The text keeps its place when the
  field appears, because both products pad the text 8 at its sides.

## Review note, 2026-10-11 (round 9)

- **What changed:** hovering the text now shows a soft plate behind it and, after a moment, a tooltip that says how to
  edit it ("Double-click to rename"); the tooltip also appears when you tab to it. Both only show on hover, so the page
  lists the tiles as unchanged: hover the text in any tile.
- **Why:** you said it wasn't clear the text was editable. The plate is the same hover every Area row uses, and the
  tooltip names the gesture, which you can't discover by looking.

## Feedback log

- 2026-10-11 · owner: "keep working" → Editable text from Figma's layer rename and Notion's titles; 11 captures,
  7 gallery tiles, in review.
- 2026-10-11 · owner, review round 8 (rethink): "not very clear that the text is editable" → hover plate + hint Tooltip
  (`hint`), tests for the hint, the opt-out and disabled (no tooltip). Round 9.
- 2026-10-12 · owner, review round 9: approved → Complete in `component-status.mjs`.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

### 2026-11-07 · The event in onValueChange (components audit O3)

- **What changed:** `onValueChange(value, event)` passes the Enter key or the blur that committed.
- **Why:** EditableText.tsx:18. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.
