# Icon review, 2026-10-05

Sheets 1–8 are the pens and pencils rounds (spec "Pens and pencils, 2026-10-05").

## Whole-set consistency audit

Owner: "the hat in the fill shouldn't be all the way filled, just the top part and the brim … then
do a detailed audit on all the icons, monoline and filled, … call out any inconsistencies and then
build any icons that are necessary to add to this set."

The 632 icons were reviewed in their 32 groups (`2026-10-03/groups.mjs`), outline and filled at
16 / 24 / 32 / 48 and 96px (`2026-10-03/grouped.mjs`, with and without `--large`), against the
construction rules, alongside `gen-pilot-icons.mjs --check --parts`, `--check --audit` and
`2026-10-02/slivers.mjs`. Owner-recorded decisions were left alone. The construction of every change
is in the spec under "Consistency audit, 2026-10-05". The new icons are batch 68.

| Sheet | Shows |
|---|---|
| `9a`, `9b`, `9c-audit-before-after.png` | the 53 changed icons: before and after, outline and filled, at 16px and 64px |
| `10a`, `10b-batch-68-sizes.png` | batch 68 and the new turns, alone at 16 / 24 / 32 / 48 |
| `14-round2-sizes.png`, `14b-round2-zoom.png` | owner notes on 12 and 13: smile-plus, cloud-check, bot-designer's brim, spell-check's B, agent as bot-agent |
| `13-dots-follow-the-line.png` | dots now follow the size curve (the ! and i dots stay 1.33× the stem at 24–48px), with maximize and minimize as arrows |
| `12-decisions-before-after.png` | the owner's decisions on the open questions: before and after, outline and filled |
| `11a`, `11b`, `11c-open-questions.png` | each open question below with its options, outline and filled at 16 / 24 / 32 / 48 (candidates are sketches, not linted) |

### Inconsistencies found and fixed

- **Shared parts drifted.** chart-scatter's axes had a rounded corner while every other chart is
  sharp. code-block's chevrons had 1.5 legs while terminal's have 2. cast's wave source was ⌀1.5
  while wifi, rss and broadcast use ⌀2. images and file-image used a ⌀1.5 sun while image uses ⌀2.
  clipboard-check had a smaller check than desktop-check. call-end still used the old Fluent arch
  while every other call icon uses the Phosphor handset. sort-ascending's arrow was shorter than
  sort's. banknote and ticket had r 1.5 corners while credit-card, with the same footprint, has r 2.
  wallet's corners were mixed. trash's handle was r 1.5 (the table says r 1). atom's nucleus was ⌀1.5.
- **Two drawings of one object.** Small clock faces used an L to 3 o'clock (watch, history,
  calendar-clock) while clock, alarm and clock-alert use a diagonal hand. All now use clock's hand.
  agent-circle and agent-square had lost agent's flats, so they read as `</>`.
- **Pixel grid.** menu, grip, list-tree, layout, kanban, table, cards, flow, document's text and
  coffee's steam sat on whole or quarter pixels and smeared at 1×. They are now on x.5 rows.
  app-window's 12-wide frame now uses the shared 11 × 11 square.
- **Filled-story slips.**
  - star-half filled was identical to star.
  - compass-dot's needle filled black, unlike compass's.
  - video-off's filled body was 0.5 narrower than its outline.
  - brain had a square notch with a tooth under it, and brain-off left the same notch.
  - location-off showed a hairline at 48px.
  - mail-plus and image-plus had tapering points of fill.
  - filter-add and filter-dismiss had a concave bite and a tail round the mark.
  - percent's O's flooded solid.
  - eyedropper's collar vanished in the fill.
  - bot-scholar's skirt was a sliver.
  - bot-designer's seam did not show filled.
  - bot-automator's band filled although bot-guard's now stays open.
- **Size and balance.** award read small (its medal is now r 4.5). ruler read narrow (now 9 wide).
  plus-minus read narrow (now 9 wide). presentation sat high. spell-check's B counters were blots
  (its letters are now 5 tall).
- **Proportion.** check-check's first check is 1 : 2. list-numbered now starts its lines with
  list-checklist's.

### Open questions: the owner's answers

Sheets `11a`–`11c` showed each question with its options; `12-decisions-before-after.png` shows
what changed. Construction lines: spec, "Owner decisions on the open questions".

| # | Question | Decision |
|---|---|---|
| 1 | pen's clip | Moved out to about 1.0 from the body (rec). |
| 2 | spell-check | Redrawn: "widths are wrong, B looks okay". ABC are now 4 tall at geometric widths (A 3, B 2, C 3), with a 2 / 4 check. |
| 3 | replace | Kept. |
| 4 | agent-circle, agent-square | Updated: agent's full flats. |
| 5 | bot-designer | Arch lowered, and the crown connects with the brim (no notch, no gap). |
| 6 | Delegated picks | All confirmed (clock hands, call-off's slash, copy-check's check, ungroup, battery bars, cards). |
| 7 | Earlier rounds | smile-plus's filled + is a badge with the + cut out. Dots follow the size curve ("the ! dot seems too big"). cloud-check's check is inside the cloud. calendar-remove's − is centred. folder-check and cart-add are unchanged. |
| 8 | Library | maximize and minimize are expand's and collapse's arrows; corner-down-left stays `return`. |

### Left as drawn (checked)

| Icon | Why it stays |
|---|---|
| folder-check | Centring it with folder-add's + leaves a 2.38 near miss to the flap. |
| variable | A 3.5 × sits at a detail gap, not tight. |
| square-list | No x.5 layout keeps its dots on the scale. |
| remove-formatting | text-size's T is the one off x.5. |
| indent, outdent | Owner decision. |
| expand, collapse | 2.12 diagonal heads, 2.67× the shaft. |
| upload | The lattice. |
| mouse-pointer-click, paint-bucket | Already at the recorded scale. |
| hammer, party-popper | Lattice-safe shifts make the offset worse. |
| dumbbell | r 1 plates read as pills. |

The sliver scan still flags only its six known hits: file-cog, folder-zip, newspaper and
person-settings.

### Built (batch 68)

**Variants of existing bases:** copy-check, document-dismiss, calendar-x, folder-search, timer-off,
call-off, sparkle-off, person-lock, shield-lock, battery-full, battery-medium.

**Editor and type pairs:** text-align-justify, list-minus, case-lower, regex, replace, heading-1,
heading-2, heading-3.

**Arrange pairs:** send-to-back, ungroup.

**Screen and status:** minimize, loader-circle, arrow-up-from-line.

**Turns on existing drawings:** arrow-right-from-line, arrow-down-from-line, arrow-left-from-line,
insert-column, corner-up-right, corner-up-left, rotate-ccw.

Gaps the review raised but not built (no product use yet, or niche by the owner's 2026-10-02 rule):

- files: file-audio, file-video
- data and code: database variants, git-tag, chart-candlestick, chart-area, gradient
- weather and transport: sunrise, train, bus
- state levels: wifi and signal levels
- other variants: tags, cart-remove (waits on cart-add's +), bell-plus, mail-check, repeat-1,
  location-add, bot-off
