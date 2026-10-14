# 12px cuts, 2026-10-13

Production gap 5 (`../2026-10-10/README.md`, "Next icon session: production gaps"). Record: `docs/specs/icons.md`,
"12px cuts, 2026-10-13".

- `cuts12.png`: the 9 cuts beside the 16px drawing at 12 (what components drew before) and Fluent's 12px regular,
  at 1× magnified 8× (light and dark), 2× and actual size. Re-render after changing a cut:
  `node docs/research/icon-review/2026-10-13/cuts12.mjs docs/research/icon-review/2026-10-13/cuts12.png`
  (a `name~variant` source in `packages/icons/sources/12/` renders beside its base for comparing options; don't leave one there).
- Sources: `packages/icons/sources/12/` (chevron-down, check, add, info, open, link, bell, arrow-up, globe).

## Decisions

- Owner, 2026-10-13: "go with your recommendations": the 9 cuts approved as drawn; Badge and Tag demos pass
  `size={12}` (and `@area/icons` became slot-aware at 12, as Glyph, so type 16 keeps the 16px drawing).

## Notes
- add, arrow-up, info and link sit 0.5px up or left of the 12px box's centre so their centre line is one dark pixel
  (the 2026-10-02 rule: crisp at 1× over centring). Fluent centres them and they render as grey 2px bars.
- Not cut: dismiss and book (same pixels as the scaled drawing), help (no readable "?" fits a 9px ring), filled variants.
