# App screens for the Theme setup, 2026-10-21

The owner asked for refined app screens to show Theme choices on, recreated only with Area's components: "research
chatgpt, notion, cursor, nike.com … app interfaces that would be ideal to recreate … feel free to add more examples".
Screens are laid flat, desktop at 1280 × 720 (16:9) and mobile at 390 × 693 (9:16), with blank shapes for media. They
are built in the review page's scenes (`screens.jsx`, scratchpad of the session) and shown abstract, semi-abstract and
real.

Confidence: **M** measured live or from captures in `docs/research/captures/`; **B** read from Cursor 3.24's app bundle;
**U** unverified (sign-in needed, memory or teardown).

## Sources

| Product | How it was read |
|---|---|
| ChatGPT | chatgpt.com logged-out at 1440×900 and 390×844; existing captures |
| Notion | notion.notion.site/code-with-notion-board (board, table, item page); open-sourced.notion.site Roadmap |
| Cursor | `/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.css` and `.glass.main.css`; existing captures |
| Nike | nike.com PLP, PDP, bag and mobile PDP, live DOM at 1440×900 and 390×844 (cookies: only necessary) |
| Spotify, Airbnb | live DOM, logged-out |
| Linear, mail, mobile paywall, finance, team home | docs, help centres and teardowns (U) |

## Measurements used

**ChatGPT.**
- Sidebar: 260 wide, rows 36 tall at radius 8, 14/20 text, 20 icons. Hover and current are the same 5% wash. Section labels are 14/18 in muted ink (M).
- Header: 61 tall, with a 36 pill model picker (M).
- Home: greeting 24/28, 32 above the composer (M).
- Composer: 768×52, radius 28, with a three-layer hairline shadow; "+" on the left, then voice and a 36 round send (M).
- Thread: 768 wide with no avatars. User bubbles are radius 22, padding 10/16, max 70% wide. Assistant prose is 16/26, with a flush row of 32 ghost icon buttons (copy, good, bad, regenerate, more) (M).
- Settings: now a page with a 768 column, made of radius-16 cards whose rows are about 53 tall (label only) or 62 (with description) (M).

**Notion.**
- Sidebar: rows 30 tall at radius 6, 14/21 text; section labels 12/16 (M).
- Page:
  - Text column 708 wide; title 40/48 700 (M).
  - Properties: 34 rows with a 160 name column (M).
  - Blocks: body 16/24, H1 30/39, H2 24/31 (M).
- Database:
  - Title 32/38 700; pill view tabs 32 tall at radius 20 (M).
  - Toolbar: 28 ghost icon buttons (M).
  - Table: full bleed, rows 36 tall with hairline rules, header in muted ink with a glyph per type. Status pills 20 tall at radius 10 (M).
- Board: columns 276 wide, 12 apart, faint tone tint at radius 10. Cards are white at radius 10 with a near-invisible shadow; title 15/22.5 500 (M).

**Cursor.**
- IDE:
  - Titlebar 35 and tab bar 35; status bar 22 (B, M).
  - Explorer rows 22 with an 8 indent; pane headers 11/700 uppercase (B).
  - Code 12/18 on macOS (B).
- Agent panel: composer radius 18 on a 6% fill. Mode and model pills 24 tall; send is a 24 circle (B).
- Agents window: rows 28–30 at radius 8, 13 px text at weight 418 (M).
- Settings: nav 200 wide; cards on a 4% fill at radius 12 with no border; rows about 61 tall (M).

**Nike.** All values measured.
- Type: Helvetica Now. 24/500 PLP title; 20/500 PDP title; 16/500 name, price and calls to action.
- Colour: ink #111, secondary #707072, fills #F5F5F5.
- PLP:
  - Header 60 tall.
  - Filters 240 wide: 48-tall accordion triggers on 1px rules; 20 checkboxes at radius 4; a three-column colour filter.
  - Grid: three columns, 16 gutters, 1:1 images at radius 0.
  - Text stack: badge, title, subtitle, price, all 16 px; hierarchy comes from weight and grey only.
- PDP:
  - Gallery: 60 thumbnail rail and a 532×665 (4:5) hero at radius 8.
  - Right column 376 wide.
  - Sizes: 2-column grid of 184×48 cells at radius 4.
  - Buttons: Add to Bag is a 60 pill in #111, with an outline Favorite pill under it; accordion rows 84 tall.
- Bag: 717 items column and a 335 summary; checkout is a 60 pill.

**Others.**
- Spotify album: 331 library panel and a 1045 main panel, both radius 8 with 8 gutters. Header has a 232 cover and a 96/800 title. Tracks are 56 rows with no dividers; the now-playing bar is 72 (U).
- Airbnb listing:
  - 1120 content; photo grid 1120×476 with radius 12 on the outer corners only.
  - Reservation card 372 wide at radius 12, with a 6/16 shadow and a joined date and guest field (M).
- Linear: issue rows 36 at 13 px with the ID in tertiary grey; tinted sticky group headers with counts; no row dividers (U).
- Mail: three panes 220 / 360 / reading pane. List rows 76 with unread shown in bold; a reply composer docked in the reading pane (U).
- Mobile:
  - Plan picker: Monthly/Yearly segmented control, radio plan cards with a badge on the selected card, a 56 Continue pill and a Skip link (U).
  - Finance home: balance with tabular figures, four round actions, a transactions card, a tab bar (U).
  - Owner references: ChatGPT/Siri mobile chat, a menu list, a plan picker, a team widget home.

## Built

| Device | Screens |
|---|---|
| Desktop (14) | Chat home, Conversation, Settings (ChatGPT); Document, Database, Board (Notion); Code editor (Cursor); Issue list (Linear); Mail; Product listing, Product detail (Nike); Album (Spotify); Booking (Airbnb); Dashboard |
| Mobile (6) | Chat, Menu, Plan picker, Team home, Product detail, Finance home |

## Elements with no Area equivalent

These are composed from parts instead:
- Notion's callout and toggle block.
- Board column container.
- Editor gutter and minimap.
- Nike's promo strip.
- Airbnb's joined date and guest field.
- Mobile tab bar: ghost icon Buttons.
- A round action with a label under it.
- Linear's status and priority glyphs: an icon.

Recreations keep Area's own paint everywhere, so these products' colours, type and radii are not copied; only their
layout, density and composition are.
