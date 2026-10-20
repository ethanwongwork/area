# Calendar spec

**Captures:** `docs/research/captures/calendar/`
**Peers:** Popover (surface, Complete), Button (navigation, Complete), Menu and Nav (hover
fill, Complete), Breadcrumb (chevron glyph, Complete), Badge/Indicator (today marker)

## Owner decisions

- 2026-09-27: "refine the visual and optical balance … very busy and difficult to read, maybe
  the dates are too compact?" → cells 36 around 32 days (were 32 / 28); numbers and weekdays
  back on the 12/16 caption role (small controls moving to 14/20 had carried them to 14);
  `fixedWeeks` off by default, so a five-week month draws five rows instead of a sixth row of
  next month's dates.

- 2026-09-26: Calendar is a gap the owner named ("things like calendar and color picker
  come to mind"); build it with its variants.
- 2026-09-26: "Why is purple being used? … I'd prefer if neutral was used all the time and
  accent was an override." Selection is neutral by default; `tone="accent"` is the
  override. The rule is system-wide (`docs/DESIGN_SYSTEM.md`, "Neutral by default, accent
  by override"). *Superseded 2026-09-29 (owner, D1): selected days and the range band are the
  Selection role (`selection-solid`, `selection-band`; calendar.css:20-26), accent by theme;
  the `tone` axis was removed.*
- 2026-09-26: "The numbers seem too large." With three references (not stored): Google's
  booking calendar (small numbers, available days in soft circles, unavailable struck
  through, a week of time slots), a set with outlined day tiles, a range, a today dot and a
  week strip (weekday, number, month), and a send-later calendar with event dots, a time
  list and a Cancel / summary / Schedule footer.

## Job and boundaries

Shows one or two month grids for choosing a date, a date range or several dates, with the
WAI-ARIA date grid keyboard. It is not a date field: typing a date is DateField's job
(segmented entry), and a field that opens a calendar is DatePicker. Both are later
components; DatePicker waits on overlay behavior (anchoring, dismissal, focus return).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| selection | `single` (default), `range`, `multiple` | The three modes every system ships | Notion search date filter (single and range); React Aria Calendar/RangeCalendar, shadcn `mode`, Mantine `type` |
| layout | `visibleMonths` 1 or 2 | Ranges across a month boundary | React Aria `visibleDuration`, Mantine `numberOfColumns`, shadcn two-month examples |
| days | `square` (default), `circle`, `tile` | Circle fills choosable days; tile outlines them and fills the rest | Owner references (Google; outlined tiles) |
| layout | `month` (default), `week` | A week strip for near-term dates | Owner reference (week strip); Google's day header |
| display | `weekdayStyle` narrow, short (default), abbreviated | S / Su / Sun | Owner references; React Aria `weekdayStyle` |
| composition | `markers` (date → tone) | Days with events | Owner reference (event dots, today dot) |
| treatment | `surface` (default), `plain` | Standing alone vs embedded in a host that draws the surface (Popover, Panel); the bare `.area-calendar` draws the plate and `plain` resets it (audit F-21 A, owner 2026-09-30; manifest default `surface`, was `plain`) | Notion's calendar sits in a popover; shadcn's Calendar clears its background inside cards and popovers |
| constraint | `min`, `max`, `isDateUnavailable` | Bounds and booked days | React Aria, MUI, Mantine, Ant |
| locale | `firstDayOfWeek`, `locale` | Weeks start on Monday in much of the world | React Aria, Mantine |
| display | `showOutsideDays`, `fixedWeeks` | Notion shows outside days and always six weeks | Notion (6 rows for a 5-week September); rdp `fixedWeeks` |
| state | `disabled` | — | Peers |

Excluded for now: week numbers, month/year dropdowns and drill-down levels, presets (Notion's
Today / Last 7 days list is a Menu above the calendar, a composition), time entry.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Search dialog → Filter → Date: a react-day-picker calendar in a popover with presets. The filter is ephemeral search state; clicking days only filtered results | app.notion.com, Edge, 2026-09-26 | evidence only | 7 files `notion--*` |
| shadcn | design system (source) | Calendar over react-day-picker | shadcn-ui/ui@c257f688, `apps/v4/registry/new-york-v4/ui/calendar.tsx` L36 (p-3, `--cell-size` 32), L50 (months gap-4), L113–L127 (range ends, today, outside), L211 (day states) | MIT | — |
| react-aria | design system (docs) | Calendar, RangeCalendar grid, keyboard and unavailable-date semantics | react-aria.adobe.com/Calendar, /RangeCalendar, 2026-09-26 | Apache-2.0 | — |
| wai | guidance | Date picker dialog grid keyboard | w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/ | W3C | — |
| area | this system | Gallery tiles | localhost | — | `area--{default,range,unavailable,plain}--rest--light` |

Not searched in this pass: ChatGPT (scheduled tasks may carry a date control) and Figma
(no date controls were seen in the editor or file browser while capturing the color
picker). Notion Calendar (calendar.notion.so) needs a separate sign-in and was not used.

## Anatomy

```
notion   popover 248 wide, radius 10; calendar block padding 4 + (4 8 8 8) → grid 12px from the sides, 8 from the top
header   rdp-caption 224 × 25: label 14/21 500 (padding 3.5 + 1.67 transparent border); nav 24px buttons, radius 3,
         12 × 16 chevron icons in rgba(55,53,47,.85), 4px end padding, hover rgba(55,53,47,.08)
grid     table 224 × 224; weekday row 32 tall, 12/18, ink rgb(139,152,152); cells 32 × 32; day buttons 28 × 28 centred, radius 6, 14px
days     outside and disabled ink rgb(161,158,153); hover rgba(35,131,226,.15) with a 1.67px rgb(39,131,222) border;
         today: white text on a 24px rgb(229,100,88) circle; selected / range start rgb(39,131,222), white text;
         range middle: a continuous rgba(35,131,226,.21) band 28px tall, rounded 6 at its ends; range end rgba(35,131,226,.43)
area
shell    surface (default; the bare class draws it): padding 8 top (compact 6), `inset-surface-sm` elsewhere (12, compact 8; border counted), `border-float` edge, radius container, the Surface axis's edge then the floating lift (`--area-shadow-edge`, `--area-shadow-float`); plain: no box
header   min control-sm (28), padding 4 start / the day inset (2) end; title 14/20 strong; nav Button ghost sm, Area chevron glyph
grid     cells 36 (compact 32); weekday 12/16 fg-muted; day 32 (compact 28), radius-control-md (8), 12/16 tabular
```

Inset equations: surface side inset = border 1 + padding 11 = 12 (Notion 4 + 8). Top =
1 + 7 = 8 (Notion 4 + 4). Nav end = header padding 2 = (cell 36 − day 32) / 2, so the last
button's edge lines up with the last day's edge. Range band insets = (36 − 32) / 2 = 2,
the day inset (cells 36 and days 32 since 2026-09-27).

## Measurements

`node scripts/capture-compare.mjs docs/research/captures/calendar/notion--search-date-filter--rest--light.json docs/research/captures/calendar/area--default--rest--light.json` (selected rows):

| slot · property | notion · search-date-filter | area · default (surface) |
|---|---|---|
| **shell** size | 247.95 × 269.39 | 248 × 272 |
| **shell** padding | 4 (then 4 8 8 8) | 7 11 11 11 + 1 border |
| **header** size | 223.98 × 25.44 | 224 × 28 |
| **header** edge from shell | 7.99 11.98 235.96 11.99 | 8 12 236 12 |
| **text** font | 14px/21px 500 | 14px/20px 400 |
| **text** left edge from shell | 11.99 box, ~17.2 text | 16 |
| **action** size, radius | 23.99, 3px | 28, 6px |
| **track** size | 223.98 × 223.98 | 224 × 224 |
| **track** edge from shell | 33.43 11.98 11.98 11.99 | 36 12 12 12 |
| **content** (cell) size | 32 × 32 | 32 × 32 |

Day states: `notion--day--hover--light`, `notion--day-today--rest--light`,
`notion--range-start--selected--light`, `notion--range--selected--light`,
`notion--nav-button--hover--light`.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| cell, day | **36, 32**; compact 32, 28 | Owner (2026-09-27: too compact); compact pass 2026-10-01 (Notion's geometry) | Notion 32 / 28; shadcn `--cell-size` 32 |
| day · radius | radius-control-md (8), capped at 0.4 × the day (`calendar.css:10`) | Button md beside it (32, radius 8); audit S4 and F-12 (owner) | Notion 6 at 28px days. Was radius-control-sm (6) |
| day · type | **12/16** 400, tabular (`--_day-text`), the caption role, not the small control text | Owner (third pass): numbers too large | Notion 14; the month title keeps 14/20 |
| weekday | 12/16 400, fg-muted | Notion 12/18 in a tertiary ink | Area small text; secondary ink is fg-muted |
| month label | 14/20 **500** | Notion 500 | Surface title at body size (batch 7; audit S2) |
| nav | Button ghost sm (28; 24 compact), Area chevron | Notion 24px, radius 3 | Area's control tier; Breadcrumb's chevron |
| surface | padding 8 / 12, popover surface | Notion 4 + 4 / 4 + 8; shadcn p-3 (12) | — |
| months gap | 16 | shadcn `gap-4` | Notion shows one month |
| hover, press | bg-hover, press bg-pressed (circle days: bg-component-pressed) (neutral; calendar.css, `.area-calendar__day`) | The translucent wash for a ground the day cannot know (surface or plain) | Notion hovers in its selection blue; hover stays neutral in every theme. Menu and Nav rows now hover `bg-component-hover` |
| selected | `selection-solid`, `fg-on-selection`; `selection-solid-hover` on hover (neutral by default; the accent when a theme sets selection to accent) | Owner (2026-09-26); shadcn `bg-primary` (near-black) | Notion paints its blue; that is the accent override |
| range middle | `selection-band` (neutral: bg-component-hover), continuous, inset 2, rounded at the ends; `selection-band-hover` (bg-component-active) on hover. Accent theme: accent-surface | Owner; shadcn `bg-accent` (neutral-100) band; Notion's band geometry | — |
| range end | the selected paint, like the start | shadcn (both ends primary) | Notion paints the end at 43% (an in-progress look); a committed range is symmetric |
| range preview | band from the anchor to the hovered/focused day, end unpainted | Notion (after the first click) | — |
| today | 1px stroke-control ring in the day's shape | Owner reference (outlined today tile) | Pass 2's soft circle would disappear among circle-style available days; a ring stays distinct from selection, the band, fills and outlines in every treatment |
| outside days | **`fg-muted` ink** (calendar.css:78-79), clickable; choosing one selects it and brings its month into view (Calendar.tsx:189-198, :220); no selection paint on the outside copy | Notion ink rgb(161,158,153); audit F-10 A (owner 2026-09-30); react-day-picker, React Aria reveal the month | Was `fg-disabled` (reserved for disabled text) and a choice with no visible change. Two-month ranges repeated the range and end on outside days; only the owning month paints |
| unavailable | fg-disabled, struck through | React Aria unavailable dates | Bounds (min/max) only dim, like Notion |
| fixed weeks | **off** (`fixedWeeks` opt-in) | Owner (2026-09-27: busy); shadcn and rdp default | Notion draws six rows |

Third-pass additions:

| Part | Area value | Basis | Reason |
|---|---|---|---|
| circle | radius full on days and band ends; choosable in-month days fill bg-component-hover; hover steps to bg-component-active (the translucent wash showed nothing on the #f3 rest, audit F-11) | Google (soft circles on available days) | Neutral per the tone rule |
| tile | choosable in-month days: 1px `edge-control-hover` inset edge (#d4, `border-subtle` at standard contrast); unavailable in-month days: bg-component, no strike | Owner reference (outlined vs filled tiles) | The fill already says unavailable |
| marker | 4px dot, 3px above the day's bottom (week strip: top end corner), fg-muted by default, tone per date, on-selected ink when selected; `aria-description` "Has events" | Owner references (dots under 4 and 14; today dot) | — |
| week strip | ghost sm arrows either side of a one-row grid; each day a column: weekday and month in fg-muted 12/16, number 16/24; min width 44 | Owner reference (strip) | Up/Down move by week, Page Up/Down by month (Shift: a year), as in the month grid; the strip moves to the week that holds the focused date (Calendar.tsx, `onKeyDown`) |
| schedule | gallery composition on the calendar surface (8 top, 12 sides, the floating lift); a rule; a time list of ghost **md** Buttons, full width, **4 apart** (the grid's 36px cells around 32px plates), **13 from the rule and from the edge** (12 surface inset + the day plates' 2 cell inset, border counted once), scrolling inside the calendar's height; the selected time is Button `selected` (`bg-component-active`, the shared row selection; ink and weight fixed); footer 8 / 12 with Cancel, a tabular summary and an outline Schedule | Owner reference (send later); owner (2026-09-28): "clean up the time backplate" | Was sm rows 2 apart with `align="start"`, whose optical pull put the plate 2.5px from the rule and 24 from the edge; the list was 288 tall whatever the calendar's height, and the shell used `shadow-2`. A real TimeField/ListBox is future work |
| week strip · inset | 12 all round on the surface | Surface inset | The 8px top inset seats the month header; the strip has none (was 8 top / 12 bottom) |
| two months · gallery | a full-width `4x2` tile | — | A 2-column tile (537px inside) is narrower than two months side by side (546), so they stacked inside a surface that kept its two-month width |

## States

| State | Changes | Evidence |
|---|---|---|
| hover | bg-hover on the day; `selection-band-hover` inside a range; `selection-solid-hover` on a selected day | Notion hover captured (different paint, see Decisions) |
| pressed | bg-pressed on the day (circle days: bg-component-pressed) | interaction polish 2026-10-16 |
| focus-visible | Area focus ring on the day | APG grid |
| selected | `selection-solid` (neutral by default) | Notion selected captured; owner rule |
| range start / middle / end | band + solid ends | Notion range captured |
| today | 1px ring in the day's shape | Notion today captured (circle); owner reference (outlined tile) |
| outside, unavailable, disabled | see Decisions; a disabled calendar dims as a whole at 50% | Notion disabled days captured |

## Behavior and accessibility

- `role="group"` with a name; each month is a `table role="grid"` labelled by its month
  heading (`h2` by default, `headingLevel` 2–6, audit F-22; only the first month's is
  `aria-live`, so two months don't announce twice); weekday headers carry `abbr` with the full name. Days are
  buttons with full-date labels (`Tuesday, September 15, 2026`), `aria-current="date"` for
  today, `aria-selected` on the cell, `aria-multiselectable` for range and multiple.
- One tab stop (roving tabindex). Arrows move by day and week (mirrored in RTL), Home/End to
  the week's edges, Page Up/Down by month, Shift+Page by year; focus crosses months and
  clamps to min/max. The week strip takes the same keys and moves to the week that holds the focused date.
  Enter/Space selects; in range mode Escape cancels a pending anchor.
- Dates are ISO strings (no time zone). `name` submits the date, `name-start`/`name-end`
  for a range, or one field per date for multiple.
- Today is read after mount (or from `today`), so server and client markup match.

## Peers and consistency

| Peer | Shared role | Peer value | Calendar | Match / reason |
|---|---|---|---|---|
| Popover | surface | `border-float`, container radius, the Surface axis's `--area-shadow-edge` then the floating lift `--area-shadow-float` (cohesion audit, 2026-09-26; a Surface axis role since audit S10) | `surface` | match |
| Menu / Nav | row hover | `bg-component-hover` | day hover `bg-hover` | differs: rows sit on a known surface; a day may sit on the plain page or the surface, so it keeps the translucent wash |
| Breadcrumb | chevron | Area chevron glyph | nav icons (rotated) | match |
| Button | small icon action | ghost sm | nav | match |

## Visual pass

2026-09-28, Claude in Chrome (batch 7): Notion's search Date filter calendar (Search → Filter →
Date; ephemeral search state, nothing picked) beside the gallery's Calendar tile, both zoomed.

| | Notion | Area |
|---|---|---|
| surface | popover, radius 10, presets above the grid | the tile's popover-style surface, radius 12 |
| month label | "Sep 2026", 500 | "September 2026", **was 400, now 500** |
| cells | 32 (224 grid / 7) | 36 / 32 (owner, 2026-09-27) |
| weeks | always 6 | the month's weeks (`fixedWeeks` off, owner) |
| today | filled red circle, white number (Notion's brand) | neutral 1px outline (neutral by default) |
| outside days | muted | muted |

Changed: the month label takes the strong weight (surface-title rule; Notion and shadcn 500). The
rest are owner decisions or Notion's brand colour. Dark theme not compared.

Earlier note:

Pass reviews were removed at the owner's request; the family is inspected in the grouped
gallery. Second pass (tone): the before/after review compared pass 1 (accent selection,
dark today circle) with neutral selection and a soft today circle. The neutral selected day
has the weight of Area's solid Button, the band is quieter than the accent band, and the
soft today circle no longer competes with selection.

First pass: compared Notion's date filter (zoomed screenshot) with the gallery tiles at 100% zoom,
light. Geometry matches within 3px (header 28 vs 25). Area reads quieter: regular-weight
month label, neutral hover, accent selection. The two-month tile exposed repeated selection
on outside days, fixed (see Decisions). Dark theme not compared.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`; research finding: "Calendar day … hover has no transition, unlike
every other plate" (`docs/research/motion-2026-10-07/crispness-and-current-state.md`, Part C).

| Interaction | Before | After |
|---|---|---|
| Day hover plate (square, circle, range band hover) | none: snapped in and out | in: instant (`:hover` 0s, under `hover: hover`); out: `--area-transition` (fast 100, ease-out) |
| Press | none | instant (`:active` 0s) |
| Keyboard (focus moves, Enter selects) | none | instant (`:focus-visible` 0s); the focus ring is an outline and never fades |
| Selected plate and ink | snapped | enters at once under the pointer or the keyboard; the day it leaves fades on fast ease-out |
| Today ring (inset `box-shadow`), tile edge | snapped | same clock as the plate (in `--area-transition`) |
| Range band (`::before`), markers | snapped | unchanged: the band is drawn by `data-range` and follows the pointer at once |
| Month change | days re-render (keyed by date) | unchanged: new days mount, nothing fades across dates |
| Nav buttons | Button's | unchanged (button.css) |

Crispness, checked in the browser on `/calendar.html` (DPR 2): all 492 day plates and 5 markers
on whole pixels; no resting transform or `will-change`. The month marker's `translate: -50%`
moves a 4px dot by 2px, a whole pixel, so it stays. The today ring stays an inset `box-shadow`
(a 1px ring at whole-pixel positions renders crisp; an outline would collide with the focus ring).

## Verification

- 7 Notion captures and 4 Area captures; checksums verified.
- Browser: keyboard sequence from Sep 15 (Right, Down, Down, Page Down, Home, End, Up,
  Shift+Page Up) ended on Sep 15 2025 as expected; range 22 → 10 committed as 10–22 with both
  ends solid and 13 cells selected.
- Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
  exercised only with synthetic events.

## Interaction polish, 2026-10-16

Days press at `bg-pressed` (10%; they pressed with the 5% hover); circle days at `bg-component-pressed`. Day numbers are not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-09-26 · owner: numbers too large, plus Google / tile / strip / send-later references →
  12/16 days, `days` circle and tile, `markers`, `layout="week"`, `weekdayStyle`, today ring,
  Schedule composition → tests; Pass review row updated.

- 2026-09-26 · owner named calendar as a missing component → first pass from Notion,
  shadcn and React Aria evidence → `notion--*` and `area--*` captures.
- 2026-09-26 · owner: "why is purple being used?", prefers neutral always with accent as an
  override → `tone` axis (neutral default, accent), private paint properties, soft neutral
  today circle; rule recorded in DESIGN_SYSTEM.md → Pass review before/after in the gallery.
- 2026-09-26 · cohesion audit → the surface takes the shared floating lift with Popover and Menu (was shadow-2) → [cohesion-audit.md](../research/cohesion-audit.md); Pass review row added.
- 2026-09-27 · third pass → Pass review note replaced: the family is inspected in the grouped
  gallery → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: busy, hard to read, dates too compact → found the day and weekday text had
  moved to 14 with the small-control change; back to 12/16, cells 36 / days 32, `fixedWeeks`
  off by default → headless Edge screenshots before / after; React test updated (35 days for
  September 2026, 42 with `fixedWeeks`).
- 2026-09-28 · batch 7 Claude in Chrome (Notion search Date filter) → month label 400 → 500; other differences kept.
- 2026-09-28 · owner: "clean up the time backplate, refine any of the calendar variants for size and
  quality consistency" → Schedule time list rebuilt on the grid's rhythm (32 plates, 36 pitch, 13
  from each side, calendar height, shared lift); week strip 12 all round; two-month tile full width
  so the months sit side by side → headless Edge shots of every tile at 2x; Circle, Tile, Markers,
  Plain, Monday, Accent and Disabled checked, unchanged.
- 2026-09-28 · owner: approved (batch 7).
- 2026-09-30 · audit S4 (owner) → 32px days take `radius-control-md` 8 (was control-sm 6), matching 32px Buttons; settles family call F-12 → `calendar.css:10`.
- 2026-09-30 · audit S10 (owner) → the surface reads the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat) → `calendar.css:37`.
- 2026-10-01 · audit F-10 (owner pick A) → outside days rest in `fg-muted` (was `fg-disabled`); choosing one selects it and reveals its month → calendar.css:78-79, Calendar.tsx:189-198.
- 2026-10-01 · audit F-21 (owner pick A) → `surface` is the default (manifest default; the bare `.area-calendar` draws the plate); `plain` resets it inside a Popover or Panel → calendar.css:27-43, manifest.ts:104-106.
- 2026-10-01 · audit F-22 → `headingLevel` (2–6, default 2) sets the month titles' level; only the first title is live → Calendar.tsx:61-62, :248-258.
- 2026-10-01 · compact pass (owner: "do what's right with compact for calendar") → compact takes Notion's date picker geometry, the compact calibration: cells 32 around days 28 (corner 6 via the dense radius ladder), surface sides on `inset-surface-sm` (12, compact 8) and top 8 → 6. Default stays 36 / 32: the 2026-09-27 "too compact" call is about default density, where days sit beside 32px Buttons. docs/research/compact-pass-2026-10-01.md.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: day plates now appear at once and fade out on fast ease-out like every other plate (were snapped both ways); press and keyboard instant. "Motion and interaction, 2026-10-07".
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the tile edge reads `edge-control-hover` (same #d4; stronger under increased contrast) (calendar.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the surface calendar lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).
