# Board spec

**Status:** in review · 2026-10-11 (round 8)
**Captures:** `docs/research/captures/board/`
**Peers:** Tag (the column's value and tone), Count (the header's number), Card (a surface; the board card is lighter),
Description list (properties), Button (header and card actions), Avatar (people)

## Owner decisions

- 2026-10-10: "can you keep working, ill bring chrome to the front later" → Board, from the inventory's documents list
  ("DatabaseCard (board card with properties)"), because Notion's board is on screen at rest and captures with Chrome's
  window hidden (menus and hover don't).

## Job and boundaries

A board lays items out in columns by one value (status, owner): each column a header with the value as a Tag and how
many items it holds, over a tinted list of cards; a card shows the item's title, icon and a few properties, and opens the
item. Not Table (rows and columns of fields), not Card (a standalone surface with media and actions), not a drag-and-drop
engine (dragging cards between columns is the app's; the board draws the result).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| column tone | Tag's ten tones; the tint and the cards' edge follow | Notion colours each group with its option's colour | Notion board view |
| column title | a Tag, or plain text for a group without a value | Notion's "No Status" column | Notion |
| card content | icon; properties; hover actions | Notion's page icon, property row, edit and more buttons | Notion |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | A board view: five columns (default, purple, blue, yellow, green), their headers, cards with an icon, a wrapped card | app.notion.com, the owner's "tasks" database, read-only, 2026-10-10 | evidence only | `notion--board-header-{none,tag}`, `notion--board-group`, `notion--board-card-{icon,wrapped}` |
| chatgpt, figma | target products | not found: no board view | — | — | — |

## Anatomy

```
notion  column 276 wide, 12 apart (288 pitch)
          header 276 × 40, the tone's tint, radius 10 10 0 0, 0 8 padding: a button (3 inset) holding the tag (20, 0 6, radius 4,
            14 500, the tone's 14% plate and ink) · the count (20, 0 6, the tone's light ink) — or plain text and a muted count
          body .notion-board-group: the tint, radius 0 0 10 10, 0 8 8; cards 8 apart
            card 260 × 40, white, radius 10, 0 4 12 rgba(25,25,25,.027), 0 1 2 rgba(25,25,25,.02), a 1px ring in the tone at 8%
              a (link) > div 8 10: a 24 icon button (radius 5, an 18 page icon) · the title 15/22.5 500
              actions: absolute top 8 right 8, white plate radius 4 with a lift: edit, more (28 × 24)
        tints: default rgba(66,35,3,.03), purple rgba(98,3,161,.03), blue rgba(0,128,213,.047), yellow rgba(207,175,0,.063),
          green rgba(3,87,31,.035)

area    div.area-board (flex, 12 gap, scrolls sideways)
          section.area-board-column.--{tone} (276, the tone's ink mixed at Notion's alpha, radius container)
            div.__header (40, 11 sides): Tag (tone) or span.__title · Count · div.__actions
            ul.__cards (0 8 8, 8 gap) > li.area-board-card (8 10, surface, radius container, Notion's lift + the tone's 8% ring)
              div.__heading: span.__icon (20 square, 16 glyph) · a.__title (UI 500; its ::after covers the card)
              div.__properties · div.__actions (top 8 end 8, on hover or focus)
            div.__footer (0 8 8)
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| column | 276 wide, 12 apart | Notion | — |
| tint | the tone's ink mixed with transparent at Notion's alpha (3 / 4.7 / 6.3 / 3.5%); unmeasured tones 3.5% | Notion's five measured groups | Area's tone inks rather than Notion's hues, so a column matches its Tag |
| header | 40, the Tag 11 from the edge, Count after it | Notion | Area's Count in its plain style; Notion tints the count to the tone |
| card | 8 10 padding, surface, radius container (12 at the default), Notion's two-layer lift and the tone's 1px ring at 8% | Notion | Area's container radius is 12 at the default; Notion's is 10 |
| title | UI type 500 (14/20) | Notion 15/22.5 500 | Area's ramp has no 15 |
| icon | 16 glyph in a 20 square | Notion's 18 icon in a 24 button | Area's UI icon in a box one title line tall |
| card link | the title is the link; its ::after covers the card | Notion's whole card is a link | Lets actions be separate controls (no button inside a link) |
| actions | top 8 end 8, on a surface plate with the float lift, shown on hover or focus | Notion | — |
| hover | the card darkens to `bg-component-hover`; ink fixed | Area's row plate rule | Notion's hover not captured (window hidden) |

## Behavior and accessibility

Each column is a `section` named by its title; the cards are a list. A card's title is its link; focus shows Area's ring
around the card and reveals the actions, which are their own buttons. Dragging is not built in.

## Visual pass

Gallery, light: columns tint per tone, cards lift on the tint with the tone's ring; actions appear on focus at the card's top
end; a card with a Tag, a date and David Tee's avatar wraps its properties under the title.

## Verification

- 5 Notion captures (redacted, read-only).
- `npm run build`, `build:docs`, `typecheck`, `board.test.mjs` (2).
- Unverified: Area captures for a comparison table, Notion's hover and drag states (Chrome's window was hidden), dark
  mode (Notion's dark tints not measured), screen readers.

## Open questions

1. Card radius: Area's container corner (12) or Notion's 10? Recommendation: Area's, so cards match Card and Panel.
2. Count in the tone's ink, as Notion's? Recommendation: keep Count's muted ink; the Tag carries the colour.

## Review note, 2026-10-10

- **What changed:** New component. Board is Notion's board view: columns side by side, each headed by a coloured tag and a
  count, with white cards that show a title, an icon and a few properties, and edit buttons on hover.
- **Why:** It was on the Notion list, and the board is something I could measure while Chrome stays in the background.
  The sizes, tints and card shadow are Notion's; the tags, counts and buttons are Area's own.

## Round 8 (2026-10-11): made Area's

Owner, round 7 (rethink), applied:

| Slot · property | Area value | Was | Reason |
|---|---|---|---|
| title | the group's name in plain text, UI type 500, starting on the cards' text (18 from the column's edge) | a Tag in the column's tone | "it doesnt need a badge title at the top, just regular text" |
| header buttons | `actions` at the header's end (the demos: add and more, ghost sm icon Buttons) | Notion shows them on hover | "add buttons to the right side" |
| count | a soft Badge sm; in a coloured column its plate and ink take the colour (12% / the colour's ink) | Count, muted | "make the counter a badge instead" |
| colours | `color`: neutral (default), gray, brown, orange, yellow, green, blue, purple, pink, red, each Tag's ink of that colour | `tone` with semantic names | "focus on the colors as just custom colors rather than semantic. the default should just be neutral" |
| add row | `onAdd` shows "Add new" (`addLabel`): full width, start-aligned, a card's size (8 10 padding, 36 tall, container corner), the add glyph; muted in neutral, the colour's ink with an 8% / 12% hover / pressed plate in a colour | Notion's "+ New page" button | "the new page button should be add new ... full width but still left aligned, same size as the blocks above it ... colored like the custom color" |

## Review note, 2026-10-11 (round 8)

- **What changed:** The column header is now the column's name in plain text, a count badge and add / more buttons at
  the end. Colours are named colours (gray to red) with neutral as the default, and the count, tint and an "Add new" row
  at the bottom follow the colour. "Add new" is a full-width row the size of a card, its text at the start.
- **Why:** You asked to move it away from Notion's look: no tag as the title, buttons on the right, a badge for the
  count, plain colours instead of status names, and a full-width add row in the column's colour.

## Feedback log

- 2026-10-10 · owner: "can you keep working, ill bring chrome to the front later" → Board from Notion's board view; 13
  gallery tiles, in review.
- 2026-10-11 · owner, review round 7 (rethink): "are there any ways you can differentiate it from notion, maybe it doesnt need a badge title at the top, just regular text, also add buttons to the right side, make the counter a badge instead. and just focus on the colors as just custom colors rather than semantic. the default should just be neutral. also the new page button should be add new, and the button should be full width but still left aligned, same size as the blocks above it. also for the custom colored versions the button backplate and/or text should be colored like the custom color" → reworked (see the round-8 review note).
- 2026-10-11 · round 8 → plain title, Badge count, header actions, `color` (custom colours, neutral default), "Add new"
  row (`onAdd`, card-sized, coloured) → Board.tsx, board.css, manifest (`color`), demos, tests.
