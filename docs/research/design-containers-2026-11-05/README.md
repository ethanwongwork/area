# Design containers (2026-11-05)

Owner: "i want to focus on the containers, no more 'asset cards' the containers contain designs that are high fidelity
zoomable vector designs … how different types of designs are displayed here, what the minimum margins are, and how each
container works and looks at different sizes. this container will also be the main viewing method for looking at designs
'full view' … its own self functioning figma style vector playground but with only 1 designed element … based on the
gallery cards, not sure if they should be combined yet. give me these containers in their own artifact."

Artifact: Design Containers, https://claude.ai/artifact/E95K8UoMuAYPLDVBNJFMHT. Picks in its store, collection
`verdicts` (one document per question: `combine`, `margin`, `small`, `phone`, `name`; fields `pick`, `note`, `at`).

`entry.tsx` draws the page with Area's real components, the illustration skill's screens, phones and vignettes
(`figures/screens.jsx`) and the app's design viewer (`src/design-viewer.tsx`); `build.mjs <tree> <out.html>` bundles it
with that tree's CSS (needs `npm run build` and the desktop build). `stage-keys.ts` stands in for `src/stage.tsx` so the
page doesn't bundle the whole app. Nothing in `apps/` changed.

## The proposal

- **One container.** The gallery card at rest (tile fill, card edge, 16 corner, name and true size 4 under at 13) and
  Full view when opened, with one placement rule. A design's artboard is what it paints, measured at true size.
- **Margin.** Parts (control, component, pattern, icon, type): a tenth of the container's short side, 12 to 48, on the
  4 grid. Framed designs (screen, phone): a twentieth, 8 to 48. Colour: none. Full view: 48 (the ceiling, the viewer's
  `MARGIN`). The design's top start lands on a whole pixel.
- **Scale.** Never past 100% in a gallery (rule 26). A part that would fall under 50% holds 50% and is cropped on its
  focus (top for a menu or palette, start for a type line, centre otherwise). Screens are always whole (rule 26.2).
  Phones stand from the top margin at 60% of the width and run off the bottom. Icons draw at whole multiples, 1× to 4×,
  about a quarter of the container. Type at true size.
- **Shapes.** Square, and 16:9 for screens.
- **Full view.** The app's viewer (modes, grounds, zoom to 3200%, 6400% for icons, pixel grid from 800%, ← →) plus an
  inspect layer: hover outlines a layer, click selects it and shows size, position, padding, corner, fill, stroke,
  shadow and text in a side panel.

## Decided (owner, 2026-11-05, on the page)

All five picks are the recommended answers, no notes:

- Q1 `combine`: **one** component. The container is the gallery card at rest and Full view when opened; Asset card
  retires as the gallery's card, and colour and group cards become kinds.
- Q2 `margin`: **tenth**, a tenth of the short side, 12 to 48 (framed designs a twentieth, 8 to 48).
- Q3 `small`: **hold**, 50% at the least, cropped on the design's focus.
- Q4 `phone`: **stand**, 60% of the width from the top margin, running off the bottom.
- Q5 `name`: **below**, name and true size 4 under at 13, nothing over the design.

## Open

- Built 2026-11-06 as Design card (`docs/specs/design-card.md`): screen tiles and Components at Auto use it. Still on
  Asset card: Fit, exact zooms, waterfall and the other card looks; Patterns; Illustrations; images, collections,
  colours and type sheets. Full view shares the 48 margin but not yet the ground.
- Not checked: a real-pointer pinch in the published page (zoom keys and stepping checked in the browser pane), and the
  page at a phone width with the published viewport (checked at 980 locally, no overflow outside its scrolling rows).
