# Count spec

**Captures:** `docs/research/captures/count/`, `docs/research/captures/indicator/notion--board-group-*`
**Peers:** Badge (inline scale 16 / 20, label on a fill), Indicator count (formatting, attached
form), Nav trailing slot, Tabs trailing slot

## Owner decisions

- 2026-09-27: build Count and Banner ("continue with component creation with banner and count").
  The survey's proposal was adopted as written: Count is its own element, not a Badge
  ([survey](../research/split-count-banner-survey.md), section 2).

## Job and boundaries

Count shows how many items the element it sits in holds, beside that element's label: a nav
row, a tab, a filter, a board group heading. It has no meaning alone; a screen reader reads it
as part of its owner's name. It is not a Badge (which labels content and has tone, dot and icon
axes) and not an Indicator (which attaches to a corner and signals new activity, danger by
default).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | plain (default) | Ink only | Notion's board group counts (`indicator/notion--board-group-count`, `notion--board-group-tag`); shadcn SidebarMenuBadge |
| variant | soft | Neutral translucent plate | Primer CounterLabel (`primer--counter-label-secondary`), Untitled tabs, Polaris tabs |
| size | sm 16, md 20 (default) | Badge's sm and md heights | Fluent small 16 / medium 20, Notion 20, shadcn 20, Primer 18 |
| content | overflow (`max+`), zero hidden, screen-reader label | Indicator's formatting; Primer's hidden "(12)" text | Fluent CounterBadge `overflowCount`, Spectrum 99+ |

Excluded: semantic tones (a count quantifies, it doesn't warn; the attached, red form is
Indicator), a solid emphasis (Primer's primary is the only one; no product shows it), state
coupling to the owner (see Decisions).

## Sources

| Id | Type | What | Link / commit / path | Captures |
|---|---|---|---|---|
| notion | target product | Board group counts, tinted and neutral groups | app.notion.com, logged in, 2026-09-25 and 2026-09-28 | `indicator/notion--board-group-count`, `indicator/notion--board-group-tag`; neutral group read live 2026-09-28 (see Measurements) |
| primer | design system, rendered | CounterLabel secondary; UnderlineNav with counters, current and rest | primer.style storybook, 2026-09-28 | `primer--counter-label-secondary`, `primer--underline-nav-counter--{current,rest}` |
| fluent | design system, rendered | CounterBadge small and medium | storybooks.fluentui.dev | `indicator/fluent--counter-{small,medium}` |
| systems | source reading | Primer, Fluent, Carbon, Atlassian, Material, Polaris, Untitled, shadcn, Mantine, Ant, Chakra, Spectrum, Radix | pinned commits in the [survey](../research/split-count-banner-survey.md) | — |
| figma, chatgpt | target products | Searched, none found: Figma file browser (Recents, All teams), ChatGPT home and sidebar | 2026-09-28 | — |

## Anatomy

```
span.area-count   inline-flex, min-width = height, pill, plate, ink, 12/16 tabular
  "12"            the formatted number (max+ above max)
  span.area-count__label   visually hidden words after the number ("unread")
```

Inset: 0 border (the edge is drawn inside) + gutter (h − 6) / 2 + 0: 6 at md 18, 4 at sm 14 (type 13), the
marks' text side shared with Badge (2026-11-07). One character (`data-single`) has no gutter, so one digit is a
circle as a pill (min-width = height). The digits' cap centres in the plate on Badge's whole-pixel baseline,
`edge + round((h − 2 · edge + 1cap) / 2)` from the top (11 at sm 14, type 13), so a Count and a Badge of one height
draw their digits and words on one pixel row at every type and density (2026-11-07); the count is a block box trimmed
to cap and baseline (`text-box`), its padding placing them.

## Measurements

`node scripts/capture-compare.mjs --slots shell` (Area recaptured after the build):

| slot · property | area · default | area · variant-soft | area · size-sm | primer · counter-label-secondary | notion · board-group-count |
|---|---|---|---|---|---|
| **shell** size | 26.41 × 20 | 26.7 × 20 | 22.7 × 16 | 27.51 × 18 | 29.63 × 20 |
| **shell** padding | 0 6 0 6 | 0 6 0 6 | 0 4 0 4 | 2 6 2 6 | 0 6 0 6 |
| **shell** border | 0 | 0 | 0 | 1 solid rgba(255, 255, 255, 0) | 0 |
| **shell** radius | 9999px | 9999px | 9999px | 20px | 4px |
| **shell** font | 12px/16px 400 Geist | 12px/16px 500 Geist | 12px/16px 500 Geist | 12px/12px 600 -apple-system | 14px/16.8px 400 ui-sans-serif |
| **shell** color | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(31, 35, 40) | rgb(181, 119, 214) |
| **shell** background | — | rgba(0, 0, 0, 0.06) | rgba(0, 0, 0, 0.06) | rgba(129, 139, 152, 0.12) | — |
| **shell** text cap top / baseline | cap +5.48 · baseline −6 | cap +5.48 · baseline −6 | cap +3.48 · baseline −4 | cap +5.54 · baseline −4 | cap +5.73 · baseline −4.4 |

Notion's neutral group, captured 2026-09-28 (`notion--board-group-count-neutral`,
`notion--board-group-header-neutral`, redacted): 27.2 × 20, padding 0 6, radius 4, 14px/16.8px
400, ink rgb(95, 94, 89), no fill; the count box starts 4 after the 500-weight label, so its
digits sit 10 after the label text. Tinted groups colour the count with the group hue (46 in
purple, 108 in blue); counts are not capped (108 shows in full).

Primer in context: the count sits 8 after the label (UnderlineNav), 18 tall in a 32 tab, and
keeps the same fill and ink on the current tab (`primer--underline-nav-counter--current` vs
`--rest`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| height md / sm | 20 / 16 | Notion 20; Fluent 20 / 16; Badge md / sm | Primer 18 sits off Area's inline scale |
| gutter md / sm | (h − 6) / 2: 6 / 4 at type 13 (18 / 14); 0 for one character | Badge (one text side for marks on one line, 2026-11-07); GitLab and Fluent 6 on 20; Ant 0 for one character | Was (h − 8) / 2, 5 / 3 at type 13: tighter than any count or badge surveyed (docs/research/count-badge-2026-11-07) |
| min-width | = height | Fluent, Spectrum, Indicator (circle for one digit) | — |
| radius | full (pill), the Pills list's default again since 2026-11-07 | Badge (one shape for marks on one line); Primer, GitLab, Fluent, Material, Ant, Spectrum, Carbon counts | Off the list 2026-11-01 to 11-07 (owner: "id prefer if counts were not pills"); a count beside a pill status then read as another family |
| text | 12/16 (`control-xs`) | Primer 12, Fluent medium 12, shadcn 12; Badge md | Notion sets its count in its 14px heading text; Area keeps the count a step below the label, as Badge |
| weight | 400, plain and soft (soft was 500 until 2026-11-01) | Owner 2026-11-01: a count's digits at 500 read larger than the regular label beside them; Notion 400 | Primer 600 |
| numerals | tabular | shadcn, Chakra, Indicator | — |
| plain ink | `fg-muted` #646464 | Notion's neutral count rgb(95, 94, 89) (muted heading ink); Nav trailing ink | — |
| soft plate | `light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.1))` /* spec */ | Primer 12% of neutral 8 = #f0 on white = 6% black | Translucent so it stays visible on the hover and selected row plates (#f3 / active); dark 10% white, not measured |
| soft ink | `fg-muted` | Badge neutral soft (muted metadata) | Primer uses default ink |
| owner state | ink fixed on hover and selection | Nav's rule (`nav.css:207`: trailing annotations stay muted on the current row); Primer keeps paint on the current tab | Polaris and Untitled switch tone on the selected tab; not adopted |
| overflow | `max+`, max 99 | Fluent, Spectrum; shared helper `count-format.ts` with Indicator | — |
| name | number read in the owner's name; `label` adds hidden words | Primer's visually hidden "(12)"; Atlassian: pair with a label | — |

## States

| State | Change | Evidence |
|---|---|---|
| rest | as above | Area captures |
| owner hover / current / selected | none | Nav rule; `primer--underline-nav-counter--current` |
| zero with `showZero={false}` | not rendered | React |

## Behavior and accessibility

A plain inline `span`; the number is text, read as part of the owner's accessible name ("Item
one 12"). `label` renders visually hidden words after the number for context ("3 unread").
Forced colours: the soft plate gains a 1px CanvasText border.

## Peers and consistency

| Peer | Shared role | Peer value | Count | Match |
|---|---|---|---|---|
| Badge md / sm | marks on one line (DESIGN_SYSTEM.md): height, text, shape, text side | mark-label md / sm, control-xs, pill, (h − 6) / 2 | same; 400 | match; Count stays regular on its plate (2026-11-01) |
| Indicator count | formatting | 99+, tabular | same helper, tabular | match |
| Nav trailing | ink on the current row | muted, fixed | muted, fixed | match |
| Badge neutral soft, Chip input | soft plate | `light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.1))` (badge.css:17, 58; chip.css:80) | count.css:68 | match (audit S6a) |

## Visual pass

2026-09-28, Claude in Chrome, Notion's "tasks" board beside the gallery's Count tiles (nav and
tabs compositions), both zoomed:

- Plain Count is Notion's count in Area's terms: a muted number with no plate, 20 tall, 6 at the
  sides. Notion sets it at its heading's 14px; Area's 12px sits a step below the 14/20 label, as
  Badge does. **Open for the owner:** 14px (Notion) or 12px (Badge, Primer, shadcn, Fluent).
- Notion tints a group's count with the group colour; Area's `accent` tone covered the one
  coloured case it needed, without per-hue tones. *Superseded 2026-09-29 (owner, D1): accent
  variants were removed from every component; Count is neutral (manifest: `variant` and
  `size` only).*
- Notion shows 108 in full; Area caps at 99+ by default (`max` lifts it), following Fluent,
  Spectrum and Indicator.
- The soft plate reads as Primer's CounterLabel and stays visible beside the selected tab's
  underline.
- Headless Edge at 2× confirmed the same. Dark theme not checked.

## Verification

- 11 Area captures (`area--*`) and two Notion captures compared above; build, manifest parity, token references,
  typecheck and docs build pass.
- Unverified: dark theme, forced colours, screen-reader reading of `label`.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


Count is static (ink fixed with the owner's hover and selection): no motion. Crispness: whole-pixel
height, gutter `(height − 8) / 2` (6 and 4) and tabular digits. A changing number does not animate.
Open question: a number tick (roll or fade) when the count changes? Recommendation: no; Notion,
Linear and GitHub swap the digits in place.

## Feedback log

- 2026-09-27 · owner: build Count → built from the survey's proposal; Nav and Tabs demos now use
  Count instead of a plain Badge.
- 2026-09-28 · owner: approved (batch 4); Count keeps the pill shape.
- 2026-09-30 · audit S6a (owner) → no Count change; Badge neutral soft and Chip input now take Count's soft plate (were `bg-component` #f7) → badge.css:17, 58; chip.css:80.
- 2026-10-01 · compact pass → the gutter is `(height − 8) / 2` (6 at 20, 4 at 16), so compact md (16) is drawn as default sm. VS Code count badges are 19 at 10px. docs/research/compact-pass-2026-10-01.md.
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → a pill by default; `pill={false}` (`--rounded`) takes the setting's corner for its height (`count.css`, `Count.tsx`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · pill shapes and list rows (owner) → the pill is the `count` entry of data-area-pills (default on); `pill` three-way (`count.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → static, no change.
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the soft plate reads `bg-mark` (O5: one role for a literal written in several families; same paint). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · type size and density split (owner) → `mark-label-*` follow the small-text line plus the density's room (`emit/base.ts`). `docs/research/ui-size-scale-2026-10-12.md`.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-23 (press room)

- **What changed:** the muted ink is #646464 at the defaults, was #666666 (2/255 darker).
- **Why:** text is now solved on the deepest ground's selected fill pressed one readable step further, so a press shows
  on a sidebar too (it equalled the selected plate there). THEMING.md, Interaction states; `color/layers.ts` `PRESS_ROOM`.

## Review note, 2026-11-01 (soft at 400; the app's one count)

- **What changed:** `variant="soft"` is weight 400, as plain (it was 500, Badge's "label on a fill"). The desktop app
  draws every count that follows a label as Count soft sm: section titles, card names, the Sidebar's rows (2026-11-01;
  section and card counts were muted text, the Sidebar's plain md).
- **Why:** the owner: "i like the updated counts in badges but the type size seems way larger than the actual text".
  The text was the same size (11 at type 13); at 500 its digits, as tall as capitals, read larger than an 11 regular card
  name beside it. Shown side by side on the Area Feed Kit page (artifact 3VBMTvWZ…, "Count component").

## Review note, 2026-11-07 (marks on one line)

- **What changed:** Count is a pill again by default (back on the Pills list, beside Badge), and its digits sit 4 from
  the edge at sm and 6 at md (were 3 and 5), the side Badge now uses too. A one-digit count drops its sides, so it is a
  circle as tall as the count (`data-single`, set by React). Height, text, weight, plate and ink are unchanged.
- **Why:** the owner, on "Button 44 ✓ Complete": "why are count and badge so stylistically and scale wise different";
  then "maybe they should all be pills then?, also is there too much horizontal padding on the textside?" The height
  and text were already Badge's; the shape, the side and the heading's placement were not. Fourteen design systems
  surveyed give a count and a status on one line one shape and one side, about 0.3 of the height for the side
  (docs/research/count-badge-2026-11-07). Picked on the review page (artifact 2g6mM75s…): pills, (h − 6) / 2,
  weights kept.
- **Follow-up, 2026-11-07 (vertical):** the owner asked "are the text weights in all the badges used correctly? the
  vertical alignment the same/consistent?" Weights follow one rule (plated 500; plain, Count and Tag 400; Kbd 500).
  Count was centred by its line box, exact but fractional, so beside a badge its digits could land a pixel row apart
  (0.45 at type 12, 0.38 at 15, 0.10 at 13). "Yes, fix both": Count takes Badge's whole-pixel baseline; swept at type
  12–16 × density 28 / 32 / 36, every Count matches the Badge of its height to 0.01 (57 pairs). Widths unchanged.
