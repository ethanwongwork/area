---
name: area-ui-compose
description: Composes whole screens and app layouts from Area components and tokens, following measured patterns from ChatGPT, Notion, Figma, Cursor and consumer products. Covers the app shell (top bars, nav panels, side panels, inspectors, layer containers, floating layers, footers and docks), region treatments (rules, tones, raised layers, separate panels, floating navs and toolbars, nav backplates and current-item marks), spacing (margins, gaps, the ladder from control to page), content regions (document columns, feeds, card grids, carousels and shelves, image and video placement, tables, boards), titles and copy, and recipes for common screens (chat, document, database, board, editor with inspector, settings, dashboard, gallery, storefront, media, mobile). Use whenever building, laying out or restructuring a page, screen, view, example, template, demo scene or the desktop app's own regions with Area, or when asked how Area should be used to make a kind of UI.
---

# Compose UI with Area

A screen is regions, then blocks inside regions, then components inside blocks. Area already decides how a component
looks; this skill decides where components go, how far apart, under which titles, and in which container. The values
come from products measured in `docs/research/ui-patterns-2026-10-22/` (each file cites its sources). The app's own
layout (`docs/PRODUCT_UI.md`, "The app's layout") is the worked example and wins where it has decided something.

Check a composed screen with `area-ui-review` before calling it done.

## Procedure

1. **Name the screen's job and archetype.** One sentence: who uses it and for what. Then pick the closest recipe in
   [references/screens.md](references/screens.md) (chat, document, database, board, editor with inspector, settings,
   dashboard, gallery, storefront, media, mobile). A screen that mixes two takes the shell of the one that owns the
   main task.
2. **Lay out the shell.** Choose the regions and their sizes from [references/shell.md](references/shell.md): top bar,
   nav panel, content, side panel, footer or dock. Decide what scrolls (one scroller per region) and what collapses
   first as the window narrows.
3. **Choose the treatment** from [references/treatments.md](references/treatments.md): how regions separate (ruled,
   toned, layered, panels or floating), where the nav sits (on the ground, its own panel, in the layer, a top bar, a
   floating toolbar, a rail) and how its current item is marked. One model per window.
4. **Fill the content region.** Choose the content pattern from [references/content.md](references/content.md):
   a reading column, a feed of sections, a card grid, a shelf, a table, a board, or a canvas. Set the measure (the
   column's maximum width) and the grid's minimum card width.
5. **Pick components per part** from [references/components.md](references/components.md). Use the component for
   its job; never rebuild it from divs. A part with no component is a listed gap: compose it from the parts given there
   and record the gap.
6. **Space it on the ladder** in [references/spacing.md](references/spacing.md): every gap is a role (related, group,
   section, margin), each step larger than the one inside it, measured to what is drawn. Never type a number a token or
   role already gives.
7. **Write the titles and copy** with [references/copy.md](references/copy.md): one title per region at most, counts
   only on collections, one-sentence subtitles, the placeholder vocabulary in demos.
8. **Check every setting.** Light and dark, type 12 and 16, the three densities, Radius 0 and pill, Elevation 0. A
   layout that only works at the defaults is not done. Then run `area-ui-review`.

## Rules that hold for every screen

- **Margins are larger than gaps.** Space grows outward: inside a control < between related items < between members
  of a group < between sections < the region's margin. Two things farther apart than they are from their container's
  edge read as two containers.
- **Measure to what is drawn.** A gap runs from a frame's edge, a text's cap or baseline, or an icon's square box.
  Never from an invisible wrapper or a line box's leading.
- **One edge per boundary.** A region is separated from its neighbour by a rule, a ground step or space, never two
  of them. Panels on the chrome ground need no rule; a raised layer needs no rule beside it.
- **Containers only for compositions.** A thing that is its own figure (an icon, a line of type, a photo) sits on the
  surface; a composition (a specimen, a set of fields, a product card) sits in a container (PRODUCT_UI.md rule 11).
- **Title the region or the block, not both.** The selected nav row names the page; the content does not repeat it
  as a heading over itself (rule 9's reasoning).
- **What scrolls is explicit.** Bars, docks and panel headers stay put; only the region's body scrolls, with
  `ScrollArea`. A sticky header inside a scroller sits on the scroller's own ground.
- **Settings stay settings.** Light and dark, type, density, radius, depth and motion are never per-screen options.
  A screen reads tokens and roles so it follows them.
- **Layout code is app code.** Layout classes are the product's own (`.studio-*` in the app); they place Area
  components and never restyle `.area-*` (rule 13). When a component cannot do what the layout needs, fix the
  component or record a gap.
- **Demos and examples** use the placeholder vocabulary and David Tee (AGENTS.md, Demos).

## When the references disagree

The product that owns the context decides (`docs/research/BASELINE.md`, Primary product by context): Figma for
editing tools and inspectors, ChatGPT for conversation, Notion for documents, lists and navigation, Cursor for the
desktop app's chrome and density, the consumer products (Spotify, Airbnb, Nike, YouTube, Apple) for media feeds and
storefronts. An owner decision overrides all of them. Record a new decision in `docs/PRODUCT_UI.md` (the app) or the
screen's own notes, with the evidence.
