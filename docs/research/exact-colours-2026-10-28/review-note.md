# Exact colours review {exact-colours}

The component review round for exact colours (plan https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2, step 5), built with
`apps/docs/scripts/component-review.mjs --colours` against main at faadea6a, published as round 75 on
https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG (decisions in `components75`). To rebuild: build both galleries
(`apps/docs/scripts/build.mjs`; on Node 26 with `NODE_OPTIONS="--import <register>"`, a module hook that adds
`type: "json"` to `.json` imports), then

    node apps/docs/scripts/component-review.mjs --before <main>/apps/docs/dist --before-label "main at faadea6a" \
      --colours docs/research/exact-colours-2026-10-28/review-note.md --out <dir>

## Review note, 2026-10-28

- **What changed:** nothing in this family's own code. Its colours can now come from exact picks: a light and a dark page
  each picked as one colour, and the accent as one exact colour. Every grey, edge and text colour is worked out from the
  page picked, as it was from the page presets.
- **Why:** colours stop being presets you combine and become the colours you want (owner, 2026-10-27). At Area's defaults
  this family looks exactly as it did.
- **How to check:** Colours › **Preset → pick** shows a tinted page set the old way (Before) beside the same page as a pick
  (After); the two should match. **Exact pick** shows colours no preset reached (a page at 96.34%, a blue-black dark page, an
  exact accent as Selection: checks, switches, selected edges and focus; Action stays neutral, so buttons keep their
  default fill) beside the nearest presets. Switch Theme to see dark.
