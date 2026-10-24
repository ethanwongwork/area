# Spacing: the ladder from control to page

Every space on a screen is a role. Roles grow outward, each clearly larger than the one inside it, so grouping reads
without lines. Area's roles are tokens that follow Density; use them, never a typed number a role already covers.

## Area's roles

Values are Default / Compact (the app runs Compact). Tokens are in `packages/tokens/src/emit/base.ts`; Stack's roles in
`docs/specs/stack.md`; text pairs in `docs/DESIGN_SYSTEM.md` › Size and shape › Text pairs.

| Role | Separates | Area | Use |
|---|---|---|---|
| Inside a control | an icon and its label | the tier's icon gap: 6 (sm–lg), 4 (xs, compact) | set by the component; layout never reads it |
| Joined | a title and its own description | no gap between line boxes (baseline to cap 10–12) | Card, Dialog, Section heading, choices |
| Label to control | a field label and its one control | `ui-stack` 6 / 4 | `Field` |
| Related | items that read as one: a label and value, an icon row, chips | `ui-cluster` 8 / 6 | `Stack gap="related"`, bar clusters |
| Group | members of a set: rows of fields, cards in a grid | `gap-row` 12 / 8 | `Stack gap="group"`, card grids |
| Heading to block | a section's title (and lede) to what it names | one step past the block's items (options 8 apart → 12) | `SectionHeading` over its block |
| Section | sections of a page or panel | `Stack gap="section"` 24 / 16 | inside a Surface or panel |
| Surface inset | a container's edge to its content | `inset-surface-sm` 12 / 8, `inset-surface-md` 16 / 12; Surface's text inset sm / md / lg 14 / 16 / 20 (Compact 10 / 12 / 14) | `Surface`, `Card` (set by size, never by prop) |
| Region inset | a panel's edge to its rows | the app's 14 | `Panel` |
| Feed | a documentation or gallery feed | cards 12 (at least 260 wide, at most four across), heading 12, sections 40, margin 16, measure 1236 | the app's Canvas (`app.css` `--_canvas-*`) |

The spacing ramp is fixed: 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 (`--area-space-*`). Region
margins and section gaps a screen sets itself come from this ramp.

## The rules

1. **Gap ≤ inset.** Inside a container, children are never farther apart than they are from its edge (Stack caps its
   gap at the Surface's inset). Measured to what is drawn, a gap that beats the inset makes one container read as two.
2. **Each ring is larger than the one inside it:** inside < related < group < heading-to-block < section. A heading
   sits closer to its own block than to the block before it.
3. **A margin is at least one ramp step past the gap it frames.** How far past depends on the region: a gallery that
   should fill its region takes one step (the app's Canvas: 16 round cards 12 apart, owner 2026-10-22, "more full
   width of the canvas"; it was 32, and 14 read as one grid with the page); a reading page or a site takes more (24–32
   on a phone, 32–96 a side on a desktop). The margin need not exceed the section gap.
4. **Measure to ink.** Text from its cap or baseline, frames from their edge, icons from their square box. Area's
   heading-to-block 12 is cap/baseline to the frame, not line box to line box.
5. **Space before rules.** Separate groups by space; add a rule only when space alone can't (a dense list, a table, a
   panel's sections). A rule has the same air on both sides (Figma 16 / 16).
6. **Density changes the roles, not the ramp.** A dense tool steps every role down together; it never shrinks one gap
   alone.
7. **Spread is not spacing.** A title with its action at the far end (`Stack spread`) fills the width; the ladder
   doesn't apply to that space.

## What the products do

| Ring | ChatGPT desktop | Figma | Notion | Design systems |
|---|---|---|---|---|
| Inside controls | 4–8 | 1–4 (tool to chevron 1, segments 2) | 6 (icon to tab label) | Atlassian 0–8 |
| Related / between controls | 8 | 4–8 | 0 (toolbar icons abut), 6 (list items) | Primer condensed 8 |
| Group | 12 (grid columns), 16 (sidebar groups, turns) | 16 (list cards), 32 (media tiles) | 16 (paragraphs, gallery cards), 12 (board columns), 8 (board cards) | 16 (Polaris, Mantine, shadcn), Primer normal 16 |
| Panel / page padding | 20 | 8 (islands), 16 (inspector) | 12 (callout), 76 (side peek) | Carbon 32, Untitled 32 |
| Section | 32–40 (settings 40) | 96 (Community; 64 on a phone) | 30 / 26 / 22 above H1 / H2 / H3 (only above); 72 (template feed) | Radix 64, Atlassian 32–80, Primer spacious 24 |
| Window / page margin | 4 (the layer's frame) | 12 (islands), 32 (Community, 24 on a phone) | a 708 column centred; full width 96 a side; 24 on a phone | Material 16 / 24, Atlassian 16 / 32 |

Consumer feeds (`consumer-feeds.md`) roughly double at each ring: inside a card 4–12, between cards 12–24, between
sections 24–48, page margin 24–48; Spotify's panels are 8 apart and 8 from the window.

**Headings carry their space above, not below** (Notion: H1 30 above and 6 below, the same 6 as a paragraph): a
heading belongs to what follows it. Area's `SectionHeading` sits one step nearer its block than the block before.

Two regimes:

- **Apps** (tools, chat, documents): tight inner rings (4–16), sections 24–40, margins 14–32. Area's app is here.
- **Sites and feeds** (marketing, storefronts, galleries): the same inner rings, sections 64–96, page margins 24–32 up
  to a 1216–1280 cap.

ChatGPT's 4 window margin is the one inversion, and it is deliberate: the layer is framed by a hairline of ground, so
the margin reads as an edge, not as space. Use it only for a layer container (`shell.md`).

## Checking

Run `area-ui-review` (its `scripts/layout-audit.js` reads insets and gaps to ink and flags each rule above).
