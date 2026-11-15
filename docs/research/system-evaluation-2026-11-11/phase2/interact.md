# Phase 2 · interact (B7.1, B7.2, B7.3, B7.11), running report

## Done (2026-11-14, checked in the working tree after the cut-off)

- **B7.1 open = pressed.** button.css: one open rule for every `aria-haspopup` (was menu only); material.css's open
  wash the same. input.css "Press and open": picker triggers read `--_bg-pressed` (rest fill on a field, the pressed
  plate on ghost), open keeps the hover edge, never the focus edge (Date picker took the focus edge). Input action
  (Combobox toggle) open = pressed. Toggletip pinned = pressed (was selected plate). Breadcrumb ⋯ open = pressed (was
  hover). Model picker, Zoom control, Split trigger ride Button. Nav row actions keep their owner-chosen pressed ink.
  Menu submenu row keeps the hover plate (a list highlight). Hover card: trigger is a link, opens on hover: no change.
- **B7.2 press on selected.** Menu (+ danger), Tree view, Table (cells, flush overhang, sticky column; the unfocused
  quiet plate stands aside `:not(:active)`), Approval (option, tile reordered), Pagination current, Calendar chosen
  day (`--_selected-pressed`, the solid press on the Selection role), Button toggles (`--_surface-pressed`: neutral
  pressed plate; tones the hover wash over the selected tint; solid `--_solid-active`), Video player on controls 0.2,
  Choice soft rows, Color swatch cells.
- **B7.3 hover → pressed pairs.** Select options, soft Checkbox/Radio, Editable text, Color swatch cell, Tree chevron
  plate and pins, Tree actions (bg-pressed, was bg-active), Split soft (pressed, was selected plate), ghost picker
  triggers, Calendar band days, Video start. Step has no hover plate (nothing to press).
- **B7.11** hides moved into `@media (hover: hover)`, `(hover: none)` show rules removed: Attachment, Message, Nav
  chevron, Panel chevron, Queue, Prompt suggestions, Property list, Step, Card overlay, Tree actions (+ focus-within on
  the actions), Edit summary actions and Diff comment, Asset card.
- DESIGN_SYSTEM.md Shared state paint: three rules + reveal bullet.
- Cohesion tests added (open, press on selected, hover/press pairs, reveal media); V15 table selector and the Asset
  card count (5 → 4, touch rules gone) updated.

- Tonal on toggles press back to their hover tint: a hover wash past the selected tint measured 4.10:1 (3.89 at Fill
  100) for danger words in light; with the hover tint every pressed label measured ≥ 4.6:1.
- Also converted: Tree guides, Table's unsorted sort mark; Card's focus reveal lands at once (0s).
- Docs: DESIGN_SYSTEM Shared state paint; fields.mjs (Date picker open), navigation.mjs (Toggletip); 32 specs got a
  dated "State paint" section; date-picker.md current state edited.
- Tests: cohesion (4 new), audit-medium and V15 selector strings follow the rules; behaviour suite `state` (7): reveal by
  pointer, keyboard, touch (touch emulation, elementFromPoint), and the paint sweep.

## Measured (behaviour `state`, 4 grounds × Layers 0/100 × Fill default/min/max × Hover lift 0/3/8 × Selection × mode)

- Closest press step anywhere: 1.009:1, ghost hover → pressed on the recessed ground, light, Layers 100, Hover 25 /
  Selected 0 / Pressed 25 (the muted-ink 4.6 bound in layers.css "Pressed" caps the room). Held to 1.008 at Pressed 25.
- Every other setting: ≥ 1.02 in light; dark closest 1.044:1 (solid toggle hover → pressed, Layers 0).
- Pressed words ≥ 4.5:1 on every measured plate.

## Left / for the conductor

- Board's card actions still hide outside `@media (hover: hover)` (board.css, not this worker's): exempted by name in
  the reveal test. Alignment picker cells (hover, no press) and Segmented (no press on the selected item): exempted by
  name, for the selection worker. Tag picker open keeps the focus edge (it has the caret): exempted with that reason.
- Proposed role: `selection-solid-active` / `action-solid-active` in base.ts, so Button's and Calendar's solid press
  mix is one derivation (Calendar copies Button's spec mix today).
- Hover card: unchanged (link trigger, opens on hover).
