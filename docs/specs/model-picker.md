# Model picker spec

**Status:** in review · 2026-09-26
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
| choice | `menuitemradio`, trailing check on the current model | Menu checkable rows; ChatGPT check | — |
| focus | opens on the current model; choosing closes and returns focus | WAI menu button | — |

Menu gained `MenuItem.description` (`.area-menu__lines`, `.area-menu__description`) for this;
two-line rows keep full line boxes (the one-line cap trim is off inside them).

## Verification

- Headless Edge, real click and keys (`scratchpad/mp.mjs`): the menu opens 4 below, ending
  under the trigger (delta 0), rows 48; focus on Instant; ↓ to Thinking; Enter chooses it,
  closes and returns focus to the trigger, which now reads Thinking.
- React test: trigger semantics, menu, radio row with its note.
