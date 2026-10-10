# Meter spec

**Status:** in review · 2026-10-10
**Captures:** `docs/research/captures/meter/`
**Peers:** Progress (the bar: rail, sizes, fill), Description list and settings rows (where meters sit), Badge tones (status fills)

## Owner decisions

- 2026-10-10: "go with your recommendations, keep building" after the Toggle group rethink → Meter, next on the gap
  audit's next tier ("Description list, circular progress/meter, Stepper"). The circular form waits for a product use.

## Job and boundaries

A meter shows a value within a known range: usage against a limit, storage used, seats taken. It names what is measured,
says what the number means, and draws the share on a bar. Not Progress (a task moving to done, with an indeterminate
state), not a Slider (it is not set by the user), not a chart.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| tone | neutral (default), warning, danger | A value that means trouble (near or at a limit) | Spectrum Meter informative / notice / negative; ChatGPT's is neutral |
| size | sm, md (default), lg | Progress's bar thickness 4 / 6 / 8 | ChatGPT 6; Figma's usage card 10 |
| content | label, description, value text, each optional | ChatGPT: label, then description and value on one line; Figma: label, value, caption | ChatGPT, Figma |

Excluded: a circular meter (no product use found), segmented meters (Spectrum `variant="segmented"`), thresholds that
switch the tone automatically (the consumer sets `tone`, so the text can say why).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Settings › Usage › Plan limits: "Weekly limit", a reset line and "60% left", a native `<progress>` | chatgpt.com/settings/usage, 2026-10-10, read-only | evidence only | `chatgpt--usage` |
| figma | target product | Starter hub › Usage › AI credits card (from the Progress spec) | figma.com, 2026-09-28 | evidence only | `progress/figma--usage-meter-card` |
| spectrum, react-aria | design systems | Meter (label, value label, variants), `role="meter"` | Spectrum 2 Meter, React Aria Meter docs | Apache-2.0 | — |
| area | this system | Every gallery tile at 1:1 | the built gallery | — | `area--*` (7) |

ChatGPT's bar: `h-1.5 rounded-full`, the track `bg-text/10` (ink at 10%) and the value `bg-primary-solid` (#0d0d0d),
read from its classes (the pseudo-elements don't expose computed styles). Figma's card: a 13/22 550 title with an info
mark, the value 15/25 550 with a muted unit, a 10 bar (track #f5, fill rgb(44)), a caption 11/16 at 50% 12 below.

## Anatomy

```
area  div.area-meter.area-meter--{neutral,warning,danger}[role=meter][aria-valuenow,min,max,valuetext][aria-labelledby][aria-describedby]
        div.__header: div.__label (the name) · span.__value (aria-hidden; the meter announces aria-valuetext)
        div.area-progress.area-progress--{sm,md,lg}.__track[aria-hidden] > div.area-progress__bar (Progress's)
        p.__description
```

Spacing: header, 6, bar, 6, description (Field's stack; 4 in compact). Area adds no outer padding: ChatGPT's 12 / 16 belong to its card row
(a Description list row or a Card gives it).

## Measurements

`node scripts/capture-compare.mjs docs/research/captures/meter/chatgpt--usage--rest--light.json docs/research/captures/meter/area--default--rest--light.json`:

| slot · property | chatgpt · usage | area · default |
|---|---|---|
| **label** font / ink | 14/20 500 rgb(13) | 14/20 500 rgb(40) |
| **value** font / place | 12/16 400 rgb(93), its own line above the bar | 14/20 400 `fg-muted`, the label's row |
| **track** top (from the label's top) | 45 | 26 (20 + 6) |
| **description** | 12/16 rgb(93) above the bar | 12/16 `fg-muted` 6 under the bar |
| **track** size / radius | 696 × 6 / pill | 384 × 6 / pill |
| **track** fill | ink at 10% | `edge-control` (Progress's rail) |
| **bar** fill | #0d0d0d | Progress's `selection-solid` (#28 in light) |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| layout | label and value on one row; the bar; the description; each Field's stack apart (`ui-stack`, 6; 4 in compact) | Peer Field (label, control, description); Figma's card (caption under the bar) | ChatGPT puts the description and value on a line above the bar, 4 and 5 apart; Area keeps its Field spacing (owner, review round 6) |
| label | 14/20 500 default ink (the UI type, strong) | ChatGPT | — |
| value | the UI type (14/20) in the muted ink, tabular numbers, at the end of the label's row | Peer File upload's percentage (UI type); Spectrum, React Aria (value beside the label) | ChatGPT's 12/16 value read too small (owner, review round 6) |
| description | Field's description, 12/16 muted, under the bar | Peer Field; Figma's caption | — |
| bar | Progress's: rail `edge-control`, sm 4 / md 6 / lg 8, pill, `selection-solid` fill | ChatGPT 6 pill; peer Progress | Progress's rail rather than ChatGPT's 10% ink, so a meter and a progress bar match |
| tones | `warning-solid`, `danger-solid` fills | Spectrum Meter notice / negative; Area status solids | — |
| semantics | `role="meter"`, value clamped to the range, `aria-valuetext` from a string value text, named by the label, described by the description | React Aria Meter; WAI-ARIA 1.2 | — |

## States

None: a meter changes value, not state. The bar eases to a new value with Progress's motion (translate, slow ease-out).

## Behavior and accessibility

`role="meter"` with `aria-valuenow` (clamped), `aria-valuemin` and `aria-valuemax`; a string `valueText` is announced as
`aria-valuetext`, otherwise the value is; the label names it and the description describes it. The value text and the
bar are hidden from assistive tech, which reads the meter's own value. A tone is color only: say the trouble in the text.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match |
|---|---|---|---|---|
| Progress | the bar | rail, sizes, fill, motion | the same element and classes | match (harness side by side) |
| Status tones | warning, danger | `*-solid` | the same | match |

## Visual pass

Round 7: harness at 1:1, light, dark, compact, beside Progress: the label row, bar and description sit a Field's stack
apart; the 14/20 value balances the label; the description reads as help text.

Round 6:

Harness at 1:1 (server-rendered specimens with `dist/area.css`), light default, dark default and light compact, beside a
Progress md: the default meter's bar is Progress's; warning and danger fills read in both themes; compact steps the type
to 12 / 12. Changed during the pass: a label with a value and no description left the value alone on a second row, so
the value now ends the label's row.

## Verification

- 8 captures (1 ChatGPT, 7 Area; the round-6 layout in `before/`); checksums verified; the ChatGPT capture checked for names and email.
- Build (parity, token references), typecheck, React tests (`meter.test.mjs`, 2), `build:docs`.
- Unverified: how screen readers announce `role="meter"` (not tested), RTL, dark in the products.

## Open questions

1. The rail is Progress's `edge-control` grey where ChatGPT uses its ink at 10%. Recommendation: keep the shared rail.
2. A circular meter has no product use yet. Recommendation: wait for one.

## Review note, 2026-10-10

- **What changed:** New component. Meter shows a value inside a known range, like usage against a weekly limit: a
  label, a line saying what the number means with the value at its end, and a bar. It turns amber or red when you set
  a warning or danger tone.
- **Why:** It was next on the gap list. The layout copies ChatGPT's usage settings exactly (label, 4, line, 5, a 6px
  bar); the bar is Area's Progress bar, so the two always match.

## Review note, 2026-10-10 (round 7)

- **What changed:** The value is bigger and sits at the end of the label's row; the description moved under the bar
  and keeps the small help-text size. The label row, bar and description are now 6px apart, as a Field's label,
  control and help text are (4px in compact).
- **Why:** You asked whether the type was too small and whether the spacing matched Area. The value was 12px where
  Area's other bar number (File upload's percentage) is 14px, and the 4 and 5px gaps were ChatGPT's, not Area's.

## Feedback log

- 2026-10-10 · owner: "go with your recommendations, keep building" → Meter from ChatGPT's Settings › Usage and
  Figma's usage card; 8 captures, 7 gallery tiles, in review.
- 2026-10-10 · owner, review round 6 (needs changes): "are the type sizes too small? is the gaps/spacing consistent
  with current area components" → value 12/16 → the UI type at the end of the label row; description under the bar in
  Field's description type; gaps 4 / 5 → Field's stack (6, 4 compact); owner: "go with your recommendations" →
  meter.css, Meter.tsx, tests; recaptured.
