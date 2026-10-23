# Selected edge vs selection marks, 2026-10-22

Owner (round 68, a radio card: blue edge, dark dot): "would it be better to just always have the accent and selected
color match? ... all neutral, or all accent, or a mix of accent for stroke and a separate selection accent ... just
want to make sure that the current set up is intentional and validated. does chatgpt do it?"

## Area today

Two settings feed selection, and one element can read both:

| Source | Value | Draws |
|---|---|---|
| Selected stroke (`stroke-selected`, `axes/states.ts` width; colour = the accent's indicator rung, `semantic/aliases.ts:209`) | always the accent blue (#0160d9 / #79aeff) | Card, Asset card, choice cards' edge; the focus ring uses the same rung |
| Selection (`selection-solid`, `fg-selection`; Neutral by default, Accent) | #282828 at Neutral, the accent at Accent | Checkbox, Radio, Switch, Slider fill, Stepper, Calendar day, Timeline, Tree view check, Meter; Nav current ink, Chip |

They meet only in **choice cards** (Checkbox and Radio `card`, `tile`, `preview`): a blue edge around a dark mark at
the default. With Selection Accent (the owner's saved Canvas) both are blue, which is why it never showed in the app.
The split was not designed: Selected stroke was picked on 2026-10-21 for containers (Card, Asset card), and choice
cards adopted the token because they draw a selected edge.

## ChatGPT, measured 2026-10-22 (Settings, light, Accent "Blue"; Claude in Chrome, read-only)

| Part | Token | Value |
|---|---|---|
| Switch, on | `--switch-track-color-checked` | #3a83f7 (accent) |
| Radio dot | `--radio-group-indicator-background-color` | #0d0d0d (near-black); edge `#00000026` |
| Selected Mode tile (a radio drawn as a picture) | `text-info` on the tile's ring | #2c67c5 (accent text); no dot inside |
| Segmented / mode toggle selected text | `--color-text-mode-toggle-accent` | #3a83f7 |
| Focus ring | `--color-ring` | #3a83f7 |

ChatGPT also has an Accent setting (Appearance → Accent). So it mixes per control: switches and selected tiles take
the accent, radio dots stay black. But it never puts a black mark inside an accent-ringed tile: its picture tiles have
no dot. The clash in Area exists only because a choice card shows both.

## Other references

| | Selected container edge | Checkbox / radio mark | Switch on |
|---|---|---|---|
| Radix Themes (RadioCards, Checkbox) | accent-9 | accent-9 | accent-9 (one `accentColor`; gray makes all neutral) |
| Atlassian | #1868DB | #1868DB | #1868DB |
| Primer | accent emphasis | accent emphasis | accent emphasis |
| macOS / iOS (system) | accent | accent | accent (iOS green) |
| Notion [recalled] | blue ring | blue | blue |
| Polaris | black (2px) | black | black |
| shadcn | primary (black) | primary (black) | primary (black) |
| Figma [recalled] | #0d99ff | dark in UI3 [unverified] | blue [unverified] |

Every design system that shows a selected card with a mark inside it uses **one colour for both**; they differ only in
whether that colour is the accent (Radix, Atlassian, Primer, Apple) or neutral (Polaris, shadcn).

## Options

| | Edge | Mark | Default look | Cost |
|---|---|---|---|---|
| A. Edge follows Selection | Selection's colour | Selection's colour | Neutral: dark edge + dark mark; Accent: blue + blue | choice cards, Card and Asset card lose blue at the default |
| B. A, and Selection defaults to Accent | Selection's colour | Selection's colour | blue + blue; Neutral is still one click | every mark (checkbox, radio, switch, slider, stepper, calendar) turns blue by default |
| C. Keep the mix, fix the one clash | accent (containers) | Selection's colour | choice cards' edge follows their mark; Card and Asset card keep the blue edge | two colour systems remain, by design: containers accent, controls Selection |

Focus stays the accent in every option (focus and selection must look different; APG).

## Decision (owner, 2026-10-22)

Option B: `stroke-selected` is a Selection role and Selection defaults to the accent. Then: "make the focus ring follow
Selection, so Selection Neutral is an entirely neutral look and Accent keeps the blue ring" — `focus-color` is a
Selection role too. Action and Selection now decide every use of the accent. Contrast gate: both endpoints
(`accent-indicator`, `neutral-solid`) are checked wherever a selected edge or a ring can land.
