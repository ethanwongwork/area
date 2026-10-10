# Model picker spec

**Status:** accepted · 2026-09-28 (batch 20; was: in review · 2026-09-26)
**Captures:** `docs/research/captures/model-picker/`
**Peers:** Menu (rows, surface; gains an optional note line), Button (ghost trigger), Composer (`mode` slot)

## Owner decisions

- 2026-09-26: "do each of them subsequently" — ChatGPT conversation group.

## Job and boundaries

Chooses the model (or mode) a message is sent with, from inside the composer. Not Select
(a form field), not Segmented (few options, always visible). ChatGPT's thinking-effort slider
in the same popover is a separate control (Slider), not part of this component.

## Sources

| Id | Type | What | Captures |
|---|---|---|---|
| chatgpt | target product | Composer picker opened, its model submenu opened; nothing chosen, the effort slider untouched | `chatgpt--model-trigger--open--light`, `chatgpt--model-submenu--open--light` |

## Measurements (ChatGPT)

```
trigger   36 tall pill, padding 0 14 0 12, 16/26 muted (143), chevron 6 after, 5% wash while open
menu      254 wide, radius 16, 4 inset, 90% white, 9 below the trigger
rows      36 tall (46 with a note), radius 12, padding 6 10, label 14/20, note 12/14 muted (143),
          check 16, 10 from the row's end, on the current model
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| trigger | ghost neutral Button (md 32, radius 8) with a trailing chevron; the wash stays while open | ChatGPT; Composer's mode slot | Area buttons are not pills (owner: rounder, not pill) |
| menu | Menu: 4 inset, rows 32, radius 8, corner 12; 4 from the trigger, ending under its end, flips above | list model (command-palette.md list pass); popover.md 4 | ChatGPT 16/12 and 9 |
| rows with a note | label 14/20 over note 12/16 muted, 6 above and below (48) | ChatGPT 6 padding, 14 + 12 | Area's ramp: 16 leading for 12px |
| choice | `MenuItem radio checked` → `menuitemradio` (ModelPicker.tsx:52); trailing check on the current model, no plate at rest | Menu checkable rows; ChatGPT check | A menu of choices shows the check only (audit S13 C) |
| focus | opens on the current model; choosing closes and returns focus | WAI menu button | — |
| name | the menu is named "Model" (`label`) by its `aria-label`, which now wins over the trigger's `aria-labelledby` ("Model: Option two" in the gallery; `label`: current model, ModelPicker.tsx:50) | Audit D-12 | Was named by the trigger: the consumer label was overwritten |
| props | `triggerProps` (props and ref) go to the trigger Button; `ref` and other props stay on the wrapper; `onValueChange(value, event)` passes the row's click event | Audit S17: one place for each element's props | — |

Menu gained `MenuItem.description` (`.area-menu__lines`, `.area-menu__description`) for this;
two-line rows keep full line boxes (the one-line cap trim is off inside them).

## Visual pass

2026-09-28 (batch 20), live in Claude in Chrome on an existing conversation (opened, then Escape,
nothing chosen): trigger 36 pill, 0 14 0 12, 16/26 muted #8f; menu 254 wide, corner 16, 90% white
with a 0.5px 10% ring, 9 above the trigger; rows 36 (46 with a note), corner 12, 6 / 10, label
14/20, note 12/14 muted, the check on the current model: all as 2026-09-26. Area: a ghost
neutral md Button (32, corner 8, 14/20 in default ink) and the Menu list (rows 32 / 48 with a
note, corner 12, 4 from the trigger). Row type matches; the geometry follows the list model.
ChatGPT sets the trigger's label in muted ink at 16; owner (2026-09-28) lightened every neutral
ghost and outline Button instead (#56, button.md), so the trigger reads quiet, at 14.

## Verification

- Headless Edge, real click and keys (`scratchpad/mp.mjs`): the menu opens 4 below, ending
  under the trigger (delta 0), rows 48; focus on Instant; ↓ to Thinking; Enter chooses it,
  closes and returns focus to the trigger, which now reads Thinking.
- React test: trigger semantics, menu, radio row with its note.

## Motion and interaction, 2026-10-07

Model picker is a ghost Button over Menu's anchored path, so every interaction is inherited and
nothing in `model-picker.css` or ModelPicker.tsx moves on its own. Verified on
`/model-picker.html` in a background tab: the menu enters with `opacity` + `scale` on 150 from a
`transform-origin` at the trigger (`168px 158px`, opening up from the trigger's end) and rests on
whole pixels (556, 741, 224 × 158); the trigger's colour transition is the shared 100 `ease-out`,
and while open it holds the pressed plate with `transition-duration: 0s` (Button's rule). The
trailing chevron does not rotate, as ChatGPT's does not.

Open questions: none.

## Feedback log

- 2026-09-30 · audit S13 (owner) → rows use `MenuItem radio` instead of passing `role` (ModelPicker.tsx:52; primitives.tsx:1143-1161). A menu of choices shows the check only; no visible change.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → new `triggerProps` (props and ref for the trigger Button; `ref` and the rest stay on the wrapper; ModelPicker.tsx:22, :49); `onValueChange(value, event)` passes the click event (ModelPicker.tsx:20). No visual change.
- 2026-10-01 · audit D-12 → the menu is named by its `aria-label` (`label`, default "Model"), which now wins over the trigger's labelledby → ModelPicker.tsx:48, primitives.tsx:1125.
- 2026-10-01 · audit G-23 (owner pick A) → demos use the placeholder vocabulary (Body text, Item one, Option one, Placeholder, Label) and `authorName` "Assistant", per DESIGN_SYSTEM's Example copy; no component change. The Verification run above predates it and used product model names.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → no change: trigger and menu motion inherited from Button and Menu, verified (enter 150 from the trigger, whole-pixel rest).
