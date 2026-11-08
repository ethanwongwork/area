# Titles and copy

What a screen says and how its text is tiered. The app's rules are `docs/PRODUCT_UI.md` › "One voice for the feed's
text" and `docs/DESIGN_SYSTEM.md` › Text pairs and Example copy; this file generalises them with what the products do.

## Tiers

A screen uses few text roles, each a step apart in size, weight or ink, never all three at once.

| Tier | Job | Area | ChatGPT desktop | Figma | Systems |
|---|---|---|---|---|---|
| Page title | names a page that is not named by its nav | Typography's title roles (`text-xl`–`text-3xl`), weight regular to strong | 24 / 400 (28 from md) | 24/32 | Untitled 20/30 600, Primer 32/48 400 or 20/32 600, Carbon 28/36 400 |
| Section title | names a block | `SectionHeading`: the body size at `weight-strong` (500) | 18 at 590 (forms) | 13/22 550 | Untitled 16/24 600 |
| Subtitle, lede | says what the block holds | muted, regular, one sentence with a full stop | secondary ink (65%) | 11/16 at 50% ink | 14/20 description, 2–8 below |
| Item name | names a row, card, file or choice | regular (400), default ink | 13–14 | 11/16 450 | |
| Meta | one fact about an item | small text, muted | tertiary (about 50%) | 11/16 at 50% | |
| Label | names a field or a group | muted (fields), rows' size at 500 (group labels) | 13 secondary | | |
| Count | how many in a collection | muted tabular text beside a title; `Count` at a row's end | | | |

Rules:

- **Hierarchy from size and ink first, weight second.** Figma tiers its whole UI with 11/16 and 13/22, 450 and 550,
  and 50% ink. A title that is bigger, bolder and darker than its neighbour is shouting.
- **A title that names a surface or section is strong (500); an item's name is regular** (Text pairs).
- **Muted means one ink role** (`fg-muted`), never an opacity on default ink.
- **A surface's title stands one step (4) off its copy; an item's name joins its line** (DESIGN_SYSTEM.md, Text pairs,
  owner 2026-11-06). A text group sits one ladder step further from the set it introduces than the set's items are apart.

## Headers

**Page header order** (Primer, Carbon, Polaris, Untitled agree):

1. context: a `Breadcrumb` or a back link;
2. one row: the title, its actions at the trailing end (`Stack spread`), one primary action at most;
3. the description, one step (4) under the title;
4. `Tabs` last, if the page has views.

**In an app, the nav names the page.** The selected nav row is the page's title; the content does not repeat it as a
heading over itself (Area's Canvas and Inspector carry no title, PRODUCT_UI.md rule 9). A family or document page
opens with its purpose as a subtitle instead.

**Section header:** a title, an optional count (collections only) and an optional subtitle, then the block. Actions
for the section sit at the title row's end ("Show all" on a shelf, a section's add button).

## Copy

The rules are `docs/WRITING.md` (voice, case, buttons, errors, destructive actions, empty states, truncation, numbers);
the points below are the ones a composed screen most often gets wrong.

- **Sentence case** everywhere: titles, labels, menu items, buttons (ChatGPT, Notion, Figma; Cursor's uppercase pane
  headers are VS Code's legacy chrome, not its own surfaces).
- **Say what it is or what it does.** A button is a verb ("Share", "Add view"), a section title is a noun ("Layers"),
  a subtitle is one sentence saying what the block holds. No marketing in an app.
- **Counts only on collections:** cards, rows, swatches, icons. Never on facts, code or prose (PRODUCT_UI.md).
- **Empty states name the query or the missing thing** and how to fill it, once per region (`EmptyState`, rule 10).
- **Truncate, don't wrap, in chrome:** nav rows, tabs and bar titles end in an ellipsis or a fade mask (Figma fades
  file tabs over their last 8); content text wraps; card titles clamp to two lines, meta to one.
- **Numbers:** tabular figures in tables, counts and prices; units after a thin space only where the product does.

## Demo copy

Every Area demo, example and template uses the placeholder vocabulary (`DESIGN_SYSTEM.md` › Example copy): `Title`,
`Label`, `Description`, `Body text`; `Action`, `Secondary`, `Cancel`; `Item one`, `Option one`, `Value`; people are
David Tee, and a list of several people uses teams for the others. A screen recreated from a product keeps Area's
words, not the product's.
