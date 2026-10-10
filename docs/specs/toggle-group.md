# Toggle group spec

**Status:** complete · 2026-10-10 (approved, review round 6)
**Captures:** `docs/research/captures/toggle-group/`
**Peers:** Button (the toggle and its selected fill), ButtonGroup (the joined look), Toolbar (its groups, gap and roving focus), Segmented (a choice that always has one answer), Chip (filter toggles)

## Owner decisions

- 2026-10-10: "keep building" after Empty state → Toggle group, the next unbuilt job on the gap audit's next tier (Range
  slider is built as SliderRange; Toggle group is "partial: Segmented is single-choice; ButtonGroup has no group state").
- 2026-10-10: open questions go with the recommendations: accepted on its peers without a product capture; `single`
  keeps `aria-pressed` toggles.

## Job and boundaries

A toggle group keeps the state of a set of toggle buttons: any number pressed (bold, italic, underline; the weekdays a
repeat runs on) or at most one (underline or strikethrough, or neither). It owns the set (`value`, `onValueChange`), one
Tab stop with arrow keys between its toggles, and the group's name. It draws nothing new: its toggles are Buttons with
Button's selected fill, joined as a ButtonGroup or set apart as a Toolbar group. Not a Segmented (one answer, always),
not a ChipGroup (filter chips), not a CheckboxGroup (a form list).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | soft (default) | A filled track with the pressed toggles raised (Segmented's look, any number raised) | Figma's filled controls (mode switch, view toggle); Area Segmented |
| variant | outline | Joined toggles, ButtonGroup's outline | Untitled UI's ButtonGroup is a React Aria toggle group, joined and stroked; shadcn `outline` |
| variant | ghost | Toggles set apart, as in a toolbar | shadcn with `spacing`; Area's Toolbar formatting group (ghost toggles, 8 apart) |
| size | sm, md (default), lg | ButtonGroup's tiers | Untitled sm / md / lg; shadcn sm / default / lg |
| selectionMode | multiple (default), single | Any number, or at most one that can be released | Radix `type`, React Aria `selectionMode` |
| fullWidth | boolean | An inspector column | ButtonGroup's `fullWidth` |
| disabled | boolean | The whole set unavailable | Radix, React Aria |

Excluded: vertical orientation (no reference product draws a vertical toggle set; Toolbar has one when needed), Radix's
`rovingFocus={false}` and `loop={false}` (one behaviour, as Toolbar), a required single choice (that is Segmented).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | `ButtonGroup` = React Aria `ToggleButtonGroup` (`selectionMode` single by default), joined with `-space-x-px`, selected = hover fill | untitleduico/react@1d410cb, `components/base/button-group/button-group.tsx:13-112` | MIT | source read |
| shadcn | design system (source) | `ToggleGroup` on Radix: `variant` default / outline, `size` sm / default / lg, `spacing` (0 joins), `data-[state=on]:bg-accent` | shadcn-ui/ui@2d3f1cd, `apps/v4/registry/new-york-v4/ui/toggle-group.tsx:20-81`, `toggle.tsx:8-28` | MIT | source read |
| radix, react-aria | behaviour | `type` / `selectionMode` single or multiple, `value` array, roving focus with arrow keys, Home / End | Radix ToggleGroup, React Aria ToggleButtonGroup docs | MIT / Apache-2.0 | — |
| notion | target product | The text-selection formatting bar (bold, italic, underline, strike, code) | not captured: driving the page editor blind (Chrome's window hidden) opened its block menu once; nothing was changed ("Edited 2h ago" unchanged) and the attempt stopped | — | none |
| figma, chatgpt | target products | Figma's text decoration toggles sit inside the editor; ChatGPT has no toggle set | not searched further | — | none |
| area | this system | Every gallery tile at 1:1 | localhost gallery, tile zoom pinned | — | `area--*` (10) |

## Anatomy

```
area  div.area-toggle-group.area-toggle-group--{soft,outline,ghost}.area-toggle-group--{sm,md,lg}[role=group][tabindex]
        (soft / outline also .area-button-group.area-button-group--{soft,outline,--size}: the join and seams)
        button.area-button.area-button--ghost[aria-pressed][data-area-toggle-item | data-area-toolbar-item] (ToggleGroupItem)
```

The group root is one Tab stop (`tabindex=0`); entering it focuses the toggle used last, else the first pressed one, else
the first, and the root leaves the Tab order while a toggle has focus (Toolbar's pattern). Inside a Toolbar the root is a
plain `role=group` and its toggles are the toolbar's roving items.

## Measurements

`node scripts/capture-compare.mjs` on `area--default`, `--variant-outline`, `--variant-ghost`, `--size-sm`, `--size-lg`:

| slot · property | default (soft) | outline | ghost | sm | lg |
|---|---|---|---|---|---|
| **shell** size | 125 × 32 | 125 × 32 | 152 × 32 | 109 × 28 | 157 × 40 |
| **shell** gap | 0 | 0 | 8px | 0 | 0 |
| **selected** size | 32 × 32 | 32 × 32 | 32 × 32 | 28 × 28 | 40 × 40 |
| **selected** background | rgb(238) | rgb(238) | rgb(238) | rgb(238) | rgb(238) |
| **item** background | rgb(247) | rgb(255) + 1px rgb(226) edge | transparent | rgb(247) | rgb(247) |
| **item** ink | quiet (oklab 0.45) | quiet | quiet | quiet | quiet |
| **icon** size | 16 | 16 | 16 | 16 | 16 |

The joined groups match ButtonGroup's captures (`button-group/area--variant-outline`, `area--commands`): same height, fill,
seams and corner per tier.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| soft look | Segmented's track: `bg-subtle`, a `border-decorative` hairline, 2 inset and gap, items the track's corner less 2; hover the `bg-hover` wash; pressed raised (surface, `edge-selected` hairline, `shadow-1`; the active fill in dark); unpressed `fg-muted`, pressed default ink | Figma's filled controls (track #f5, hover #e6, the chosen option a white plate with a shadow); peer Segmented | Was ButtonGroup soft (owner, review round 5): its hover was one rung from rest (247 → 243) and pressed one more (238) |
| outline look | ButtonGroup outline, its edges and corners; hover `bg-component-hover`, pressed `bg-component-active` and body ink | Untitled UI (stroked toggle group); peer ButtonGroup | Untitled's pressed equals its hover; Area keeps them one step apart |
| apart look | ghost toggles 8 apart (`ui-cluster`, 6 compact) | Peer Toolbar group gap | shadcn's spacing is a free number |
| pressed (outline, ghost) | Button's selected fill (`bg-component-active`) and body ink; unpressed the quiet ink | Peer Button, Toolbar | Untitled's selected = its hover fill; Area keeps hover and selected one step apart (shared state paint) |
| sizes | ButtonGroup's tiers: 28 / 32 / 40, icon 16, its text and corners | Peer ButtonGroup | — |
| keyboard | one Tab stop, ← → (↑ ↓) between toggles, Home / End, wraps; Space / Enter presses | Radix, React Aria; peer Toolbar | — |
| single | at most one; pressing the pressed toggle releases it; `aria-pressed` buttons | Radix `type="single"` | Radix gives single items `role=radio`; Area keeps toggle buttons, since a released state is valid (a radio group always has an answer: Segmented) |
| inside a Toolbar | no Tab stop of its own; toggles join the toolbar's roving; size from the Toolbar | Peer Toolbar (Segmented and SplitButton do the same) | — |

## States

| State | Changes | Evidence |
|---|---|---|
| pressed | Button's selected fill and body ink, `aria-pressed="true"` | `area--*`; gallery, real clicks |
| hover / focus | Button's | button spec |
| disabled (group or item) | native `disabled`; a fully disabled joined group dims once (ButtonGroup); the group leaves the Tab order | `area--state-disabled` |

## Behavior and accessibility

`role="group"`, named by the consumer's `aria-label`. Each toggle is a native button with `aria-pressed`; an icon-only
toggle's children are its accessible name (Button's `iconOnly`). Verified in the gallery with real keys: entering lands
on the first pressed toggle; ← → and End move and wrap; Space presses; Tab leaves; Shift+Tab returns to the toggle used
last; two presses in one tick both count. In the Toolbar tile the arrows cross both groups and the single group swaps.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match |
|---|---|---|---|---|
| ButtonGroup | joined set | soft / outline, seams, tiers | the same classes | match (harness side by side, light, dark, compact) |
| Toolbar | spaced toggles, roving | ghost, 8 apart, one Tab stop | the same | match |
| Button | toggle | selected fill, `aria-pressed` | the same | match |
| Segmented | one-of-many | a track with a moving plate, always one | not used for at-most-one | kept separate on purpose |

## Visual pass

Round 6 (after the owner's rethink): harness at 1:1, light, dark, compact; real pointer: soft hover is the 5% ink wash
(about 236 on the 247 track) with the ink fixed at `fg-muted`; a hovered pressed toggle stays white; soft and Segmented
read as one family. Captures in `before/` are round 5.

Round 5:

Harness at 1:1 (server-rendered specimens with `dist/area.css`), light default, dark default and light compact, beside a
ButtonGroup with a selected Button and a Segmented: the soft group and the ButtonGroup are indistinguishable; the
pressed fill reads in both themes against the group fill; ghost toggles in the Toolbar tile sit as its other groups do.
No change was needed. Product side-by-side not done (no product capture).

## Verification

- 10 Area captures (checksums verified). No product captures (see Sources).
- Build (parity, token references), typecheck, React tests (`toggle-group.test.mjs`, 3), `build:docs`; real clicks and
  keys in the built-in browser (above).
- Unverified: a screen reader, touch, RTL arrows (handled in code, not run), product comparison.

## Open questions

Resolved 2026-10-10 (owner: "go with your recommendations"):

1. No target product was measured. Recommendation: accept on the peers (it is Button + ButtonGroup + Toolbar), and
   capture Notion's formatting bar later with the Chrome window in front if you want it compared.
2. `single` uses `aria-pressed` toggles rather than radios. Recommendation: keep it (a released state is allowed).

## Review note, 2026-10-10 (round 5)

- **What changed:** New component. Toggle group keeps a set of toggle buttons, like bold, italic and underline: any
  number pressed, or at most one. It looks like a Button group (joined) or like the toggles in a Toolbar (apart).
- **Why:** It was the next missing piece on the gap list (seven systems ship one). Toolbar demos were keeping this
  state by hand; now the group does it, with one Tab stop and arrow keys.

## Review note, 2026-10-10 (round 6)

- **What changed:** The default (soft) toggle group is now a track like Segmented: a faint outline around it, a darker wash under the pointer, and each pressed toggle raised as a white plate. Before, it was a joined Button group where hover was barely visible and pressed was only one shade darker. Outline and ghost are unchanged.
- **Why:** You asked whether there should be strokes and whether hover was right. Hover was one shade off rest, hard to see and hard to tell from pressed; Figma's filled controls and Area's Segmented hover with a wash and raise the chosen option, with a hairline round the track.

## Feedback log

- 2026-10-10 · owner: "keep building" → Toggle group from Untitled UI, shadcn, Radix and React Aria and Area's Button,
  ButtonGroup and Toolbar; 10 captures, 10 gallery tiles, in review.
- 2026-10-10 · owner: "go with your recommendations" → open questions resolved as recommended; no code change.
- 2026-10-10 · owner, review round 5 (rethink): "should there be strokes around it? are the hover states correct?"
  → soft hover measured at one rung from rest (247 → 243) and pressed one more (238); soft becomes Segmented's track
  (hairline round it, hover wash, pressed raised), outline and ghost unchanged (owner: "go with your recommendations")
  → toggle-group.css, ToggleGroup.tsx (soft no longer carries ButtonGroup's classes); recaptured, round 5 in `before/`.
- 2026-10-10 · owner, review round 6: approved → Complete in `component-status.mjs`.
