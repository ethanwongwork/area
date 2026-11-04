# Timeline spec

**Captures:** `docs/research/captures/timeline/`
**Peers:** Accordion (24 chevron column, content after it), Avatar (marker media), Indicator (dot size), Separator
(line ink), Description list and Shortcut list (muted secondary text), Message (details in a body)

## Owner decisions

- 2026-10-11: "continue the component work … then work on the next component, the chrome is open and in the front" →
  Timeline, the next item the handoff held for Chrome in front (Figma's version history). Chrome's window read as hidden
  part way through: captures were read out through the page-text reader instead of the clipboard (DOM reads work in a
  hidden window; screenshots and the clipboard don't).

- 2026-10-11, review round 8 (rethink): "sent references in chat. make sure all the type is appropriately size, the dates
  seem quite small", with "i like no backplate around icons and small gaps around the indicators for the timeline". The
  references: a run log (green check icons, a dashed line), Linear's issue activity (bare muted icons, short line
  segments between them, "event · 1m ago" on one line), an activity feed (bare icons, a solid line with gaps, "event >
  date" on one line). Applied: icons with no plate, a 4 gap between the line and every mark, the time and meta on the
  event's line at the UI size, titles at 400. Earlier recommendations accepted: a dot by default; no success / danger
  tones until a product uses one.

## Job and boundaries

A Timeline lists events in order along one vertical line, each with a marker: a file's version history, a page's
updates, an order's progress. It is not a Stepper (a process the user moves through), not a Message list (a
conversation), not a Tree view (hierarchy) and not a Table (comparable columns). It shows events; it does not select
them. A clickable event puts a Link in its title.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| marker | dot (default) | A small dot on the line for an event with no icon | Ant `Timeline` dot; Mantine bullet; Figma's autosave rows (line only) |
| marker | icon | A bare 16 icon (`icon-sm`) centred in the 24 marker, no plate | Linear's issue activity, the activity feed (owner, round 8); Figma's group and current-version markers |
| marker | media | An element that fills the 24 marker: an Avatar | Notion's page updates (24 avatar); Primer `TimelineItemAvatar` |
| current | boolean | The current or latest event: its mark paints the Selection role (neutral or the accent, by theme) | Figma's current version (filled blue circle, white check); Mantine `active`; Primer `variant` |
| content | title, time, meta, body | What happened, when, who or where, and details | Figma (date as title, author under it); Notion (title, time · page, property changes) |

Excluded: alternating or opposite layouts (Mantine `align`, Ant `mode="alternate"`): no target product draws one. A
horizontal timeline: none found. Success / danger tones: Primer has them, no target product does; add them when one does.
A hover plate on each event (Figma selects a version): selection belongs to a list, not a static timeline.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Version history panel (File menu › Show version history): current version, autosave group, version row | figma.com, owner's file, 2026-10-11, light, read-only | evidence only | `figma--version-current`, `figma--version-group`, `figma--version-row` |
| notion | target product | Page updates panel ("Edited …" in the page header) | app.notion.com, owner's board, 2026-10-11, light, read-only, browser zoom 90% | evidence only | `notion--update-entry` |
| primer | design system (source) | Timeline, TimelineItem, TimelineBadge, TimelineBody | github.com/primer/react `packages/react/src/Timeline/Timeline.module.css` @ 7f5303d803986887187d86dcebaeda22a4dc6823 | MIT | not rendered |
| mantine | design system (source) | Timeline, Timeline.Item bullet and line | github.com/mantinedev/mantine `packages/@mantine/core/src/components/Timeline/Timeline.module.css` @ e243f7f999b3250c0babe6c6aa6dba9bcb4aa836 | MIT | not rendered |

ChatGPT: no timeline surface found (looked at the sidebar, a chat, settings). Untitled UI: no timeline in the free set.
Not captured: dark in either product (theme is an account setting), hover in Figma (the window was hidden).

## Anatomy

```
figma (version history, 11/16 Inter)
li       item                  240 wide; padding 4 0 0 (first)
  div      itemInfo              padding 4 8 4 16
    div      versionIcon           24 × 24, radius 9999, margin-end 4: filled rgb(13,153,255) (current),
                                    rgb(245,245,245) (group), 0 tall (autosave rows: line only)
      div      verticalLine          1 wide, left 11.5, rgb(230,230,230), z-index -1, runs 8 past the item
      svg      icon                  24 viewport, 14 ink, white on the current version
    div      versionRowInfoRight   padding 4 8, radius 5 (a hover plate): title 11/16 550, meta 11/16 400 50% ink, gap 4

notion (page updates)
article  entry                 padding 12 0
  div      row                   padding 0 16, flex
    div      icon column           36 wide: avatar 24 (margin-top 2, 8 after)
    div      content               14/19.6: title (name 600); meta 12/16.8 rgb(161,158,153), margin 4 0 8, "time · page"
```

Area:

```
ol     .area-timeline                       role="list"; text-base (14/20); --_marker 24, --_gap 12, --_spacing 16
  li     .area-timeline-item[--current]        grid: marker column | content; 16 below all but the last; aria-current
    ::before                                    the line: 1px divider ink at x 11.5, from 4 below this mark to 4 above
                                                the next (the mark's own height: dot 6, icon 16, media 24)
    span   __marker                             24 square (aria-hidden unless it holds media)
      span   __dot | __icon | __media             6 dot | bare 16 icon | 24 Avatar; dot and icon in fg-muted
                                                  (selection-solid when current)
    div    __content                            padding-top (24 − 20) / 2: the first line centres on the marker
      div    __line                               one line, wraps anywhere
        span   __title                              14/20 400
        span   __meta                               14/20 fg-muted, each after a __sep "·" (aria-hidden, 4 either
                                                    side): meta, then time
      div    __body                               8 below the line (0 when it is first)
```

Inset equations: content start = marker 24 + gap 12 = 36 (Figma 16 + 24 + 4 + 8 = 52 from its row edge, 36 from the
column's start; Notion 16 + 24 + 8 + 4 = 52, likewise 36). Title top = (24 − 20) / 2 = 2, so the 20 line centres on
the 24 marker (Figma: a 16 line in a 24 plate, centred). Line x = (24 − 1) / 2 = 11.5 (Figma 11.5). Compact: marker 20
(`control-xs`), text 12/16, content start 32, title top 2.

## Measurements

Generated with `node scripts/capture-compare.mjs` (rows abbreviated to the slots used; Area at 1:1 in the gallery).

| slot · property | figma · version-current | figma · version-row | notion · update-entry | area · default | area · tone-accent |
|---|---|---|---|---|---|
| **indicator** size | 24 × 24 | 24 × 0 | — (avatar 23.99 × 23.99) | 24 × 24 | 24 × 24 |
| **indicator** radius | 9999px | 9999px | 100% (avatar) | — (dot / icon round) | — |
| **indicator** background | rgb(13, 153, 255) | rgb(245, 245, 245) | — | — | accent solid |
| **track** (line) | 1 wide at 11.5, rgb(230, 230, 230) | same | none | 1 wide at 11.5, rgb(226, 226, 226) | same |
| **text** edge from shell (t r b l) | 8 8 4 44 (plate; text at 52) | 4 8 4 44 (text at 52) | 12 … 51.98 | 2 0 136 36 | 2 0 176 36 |
| **text** font | 11px/16px 550 Inter | same | 14px/19.6px 400 (name 600) | 14px/20px 500 Geist | same |
| meta font / color | 11px/16px 400, rgba(0,0,0,.5) | same | 12px/16.8px 400, rgb(161, 158, 153) | 12px/16px 400, fg-muted | same |
| title → meta | 4 | 4 | 4 (margin) | 4 | 4 |
| row to row (text) | 16 (8 + 8) | 16 | 24 (12 + 12) + 8 | 16 | 16 |

Area's columns (500 titles, meta 12/16 under the title, the `tone-accent` tile) are the first build, superseded by
review round 8 and the 2026-10-12 `current` change; Decisions holds the current values.

## Decisions

| Slot · property | References | Area | Basis | Reason when it differs |
|---|---|---|---|---|
| marker box | Figma 24, Notion 24 | 24 (`control-xs`; compact 20) | target-product agreement | — |
| content start | Figma 36, Notion 36 from the column start | 36 (24 + 12) | agreement | — |
| line | Figma 1px rgb(230) at 11.5, through its marks | 1px `border-divider` at 11.5, stopping 4 short of every mark | owner (round 8 references) | Linear and the activity feed break the line at each mark |
| title | Figma 11/16 550; Notion 14/19.6 400; Linear, feed, run log 400 | 14/20 400 | Notion's size; the owner's references' weight | — |
| meta and time | Figma and Notion under the title, 11–12; Linear and the feed on the event's line, the same size, muted | on the title's line, 14/20 `fg-muted`, who then when | owner ("the dates seem quite small") | — |
| separator | Notion and Linear "·" | "·" aria-hidden, 4 either side | Notion, Linear | — |
| spacing | Figma 16 between rows' text; Notion 32 | 16 | Figma (dense UI panel) | Notion's is its document feed |
| dot | Figma none; Ant 10 ring; Mantine 20 | 6 dot, fg-muted | Indicator's dot (peer) | no product dot; the quietest mark that still reads on the line |
| icon | Figma 24 circle; Linear and the feed a bare icon | a bare 16 icon, `fg-muted` | owner ("no backplate around icons") | — |
| current | Figma a filled blue circle; the run log a green check | the mark in `selection-solid`, `aria-current` | DESIGN_SYSTEM "Emphasis roles" (no component offers an accent tone) | neutral in the default theme, the accent in an accent theme |
| body | Notion 8 below the time | 8 | Notion | — |

## States

Static: no hover, press or selection. The current event's mark paints the Selection role (`selection-solid`: neutral in
the default theme, the accent in an accent theme) and the item is `aria-current`. Forced colors: the line and dots paint
CanvasText; icons follow the text colour.

## Behavior and accessibility

An `ol` with `role="list"` (Primer: Safari drops list semantics with `list-style: none`). Each event is an `li`. The
marker is `aria-hidden` (its meaning is in the title) unless it holds media, which can carry its own name (an Avatar
with `alt`; pass `alt=""` when the title already names the person). `time` with `dateTime` renders a `<time>`. Native
props and refs reach the `ol` and each `li`. A `current` item carries `aria-current="true"`. The separators are
`aria-hidden`, so the line reads as title, meta, time.

## Peers and consistency

| Peer | Shared role | Peer value | Timeline | Note |
|---|---|---|---|---|
| Accordion | leading 24 column, content after it | 24 chevron, 6 gap | 24 marker, 12 gap | differs on purpose: both products set events 12 from the marker |
| Indicator | dot | 6 | 6 | same |
| Avatar | person | sm 28 | 24 inside the marker | Notion's 24 |
| Description list | muted secondary text | 14/20 muted terms | 14/20 muted meta, on the title's line | same size (owner, round 8) |

## Visual pass

Measured at 1:1 in the gallery, light default, dark default and light compact. The line meets each marker's
centre and passes behind dots and circles; titles centre on 24 markers (2 above a 20 line) and on 20 in compact; dark
keeps the line visible as the divider ink. Not compared side by side with Figma in the same screenshot (the Chrome
window was hidden; measurements only).

## Verification

- 9 captures (4 product, 5 Area); checksums verified; product captures redacted (names and text removed).
- Build (parity, token references), typecheck, React tests (`timeline.test.mjs`, 2).
- Unverified: a screen reader, products in dark, side-by-side screenshots against Figma.

## Open questions

1. The line is solid (Figma, the activity feed); Linear and the run log dash it. Recommendation: keep it solid, Area's
   rules are solid everywhere else.

## Review note, 2026-10-11

- **What changed:** New component. Timeline lists events in order on one line, each with a dot, an icon or an avatar,
  a title and its time; the current event can be highlighted.
- **Why:** It was next on the list and waiting for Chrome. It follows Figma's version history (the line, the 24 marker,
  the filled current version) and Notion's page updates (avatars, the time under the title).

## Review note, 2026-10-11 (round 9)

- **What changed:** icons now sit on the line with no circle behind them, the line stops a little short of every mark,
  and the time and who-did-it follow the event on the same line at the same size as the title, muted.
- **Why:** you sent Linear's activity, an activity feed and a run log, liked the bare icons and the gaps, and said the
  dates were too small.

## Feedback log

- 2026-10-11 · owner: "then work on the next component" → Timeline from Figma's version history and Notion's page
  updates; 9 captures, 5 gallery tiles, in review.
- 2026-10-11 · owner, review round 8 (rethink) and chat references → bare icons, a 4 gap at every mark (measured: the line
  starts 4 below a 6 dot, a 16 icon and a 24 avatar and ends 4 above the next), the line at 14/20 with meta then time
  after dots, titles 400. Round 9.
- 2026-10-12 · owner, review round 9: approved → Complete in `component-status.mjs`.
- 2026-10-12 · system rule, found when merging main (`tone.test.mjs`: "no component offers an accent tone"; paint the
  Selection role): `tone="accent"` → `current` (boolean, `--current`, `aria-current`), the mark in `selection-solid`.
  In the default neutral theme the current mark is now the neutral solid, not the accent blue; an accent theme shows
  the accent. Tile `tone-accent` → `state-current`.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.


## 2026-11-03: no dots; the time at the line's end

Owner: "im not a big fan of the use of '·' is it necessary?". The line drops its separator dots (and the `sep` part): the
title, then who or where a gap (8) after it, then the time at the line's end (`time`, new part), muted, at the secondary
step (12) with tabular figures, as every figure in a tracker. A long title wraps and the time keeps the end of its line.
