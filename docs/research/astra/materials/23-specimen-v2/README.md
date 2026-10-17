# 23 · Specimen v2

**Question:** can the owner tell None, Glass, Tactile and Soft apart on Area's real components, and does Tactile
reach the board's printed buttons?

**Answer:** yes. The page shows the four side by side in light and dark on Area's built CSS, with live controls per
material, the board's items 4, 5, 6, 10–13 and 16 rebuilt from Area components, and 5 and 6 drawn beside their
printed recipes. Picks save to the page.

**Page:** https://claude.ai/artifact/6yuLW5kY176hsCeJf2Abzo (picks: collection `materials`, doc `picks`).

## Files

- `materials.css`: the prototype material layer. Inputs on `[data-area-material]`, presets, and receivers per role
  (raised control, thumb, well, container, floating, row plate, page grain). Research only, not a package file.
- `extract.mjs`: copies the specimen markup from the built gallery (`apps/docs/dist`), so the page renders Area's
  real server-rendered markup. Static markup lacks some React state attributes (`data-checked`, `data-selected`);
  `build.mjs` adds them.
- `build.mjs`, `template.html`: the page. `node build.mjs <out>` writes `index.html` with `materials.css` inlined and
  copies `packages/styles/dist/area.css` beside it.

## Checks (headless Edge, 2026-10-17)

- Every receiver in Glass, Tactile and Soft paints its material: no box-shadow resolves to `none` (it did once:
  Button's private `--_shadow` is `none`, which voids a shadow list, so the material replaces it).
- Script parses. Board 5 and 6 compared by eye at 2×: ring, lit edge, contact shadow and sheen match the printed
  recipes; the fill differs because Layers owns it.

Not checked: None's pixel identity against plain Area (it paints transparent lobes, so it should be identical; not
measured), Safari and Firefox, forced colours in a real session, reduced transparency from the OS, phone width.
