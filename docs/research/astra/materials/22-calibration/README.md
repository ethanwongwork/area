# 22 · Calibration: None, Glass, Tactile and Soft

**Question:** what numbers make the four first presets (D4) reach the reference board, and where do contrast and the
current axes bound them?

**Answer:** each preset is a small set of inputs; at 1 they are the calibrated values below, and every control runs
to 2× (D3). Tactile is calibrated to the board's two printed buttons (items 5 and 6) and reproduces them on Area's
Button, except the fill, which Layers owns. Glass is bounded by a reading floor computed from Area's own inks. Soft
needs a gray ground, so it is a bundle that sets Layers. The values are research inputs, judged on the specimen
(23), not shipped tokens.

**Snapshot:** 2026-10-17, Area `main` `530ef22` plus the uncommitted Layers split (layers-light / layers-dark).
Reference values: `06-references/catalogue.md` (R03, R04, R07, R08, R10, R11, R19, R20).

## Values

| Material · part | Light | Dark | Basis |
| --- | --- | --- | --- |
| Tactile · hairline ring | 0 0 0 1px black 16% | 0 0 0 1.5px black 100% | Board 5 and 6 (R19, R20), printed |
| Tactile · lit top edge | inset 0 1px white 90% | inset 0 1.5px white 15% | Board 5 stroke #FDFDFD → 0; board 6 top-only 15% |
| Tactile · contact shadow (raised controls only) | 0 2px 4px black 10% | 0 4px 7px black 20% | Board 5 and 6, printed |
| Tactile · sheen | none | white 15% → 0 | Board 5 flat fill; board 6 gradient |
| Tactile · convex edges | inset 1px lit / shaded at 60% | same | 98.css bevel (R10), softened to one pair |
| Tactile · wells | inset 0 1 2 black 10%, inset 0 −1 white 75% | inset 0 1 2 black 55%, inset 0 −1 white 6% | 98.css pressed well (R10), softened; board 10 and 11 describe recessed tracks without values |
| Tactile · grain | 4% | 4% | Report 21 default; WinUI Acrylic noise is 2% (R04) |
| Glass · opacity | 72% | 72% | Report 21 default; never below the floor (below) |
| Glass · frost | 24px blur, saturate 150% | 24px | Between the CSS references (5–6px: R03, R07) and Acrylic's 30 (native units, R04) |
| Glass · rim | inset 0 0 0 0.5px white 55%, inset 0 1px 3px white 25% | white 14% | liquid-glass-react rim (R07: 0.5px white 50%, inset 0 1px 3px white 25%) |
| Glass · sheen | 35% | 35% | Aqua gloss band (R11) is 20% to the midline; Glass keeps a softer, longer band |
| Soft · relief pair | ±3px, blur 9px, white 95% / black 13% | white 5% / black 65% | Neumorphism.io (R08): distance : blur = 1 : 3 and ±15% of the ground, scaled from a 200px specimen to a 32px control |
| Soft · bundle | ground 95, contrast 0 | ground 24, contrast 0 | Relief needs a tone lighter and darker than the ground; white has no lighter tone |
| Row plate strength | Glass 0.25 · Tactile 0.4 · Soft 0.55 | same | Report 21 (D6) |
| Light angle | Glass and Tactile 0 (top) · Soft 315 (top left) | same | D9: 0 = top, clockwise. Board 5/6 light from the top; R08 from the top left |
| Glow | 0 for all; 1 = 18px blur, 2px spread, accent 70% | same | Report 21 (dormant by default); board 4 and 8 show it at 1 |

## Glass reading floors

`floors.mjs` composites each surface's Layers tone at a given opacity over black and over white and finds the least
opacity at which the ink keeps its contrast on both. At the default Layers settings:

| Text on glass | Light | Dark |
| --- | --- | --- |
| Body text (4.5:1) | 0.56 | 0.62 |
| Muted text (4.5:1) | 0.90 | 0.73 |
| Placeholder in a field (4.5:1) | 0.93 | 0.75 |
| Control edge (3:1) | 0 | 0 |

The specimen enforces the body-text floor by default (`--m-alpha = max(fill, floor)`), with a switch for the muted
floor. Which to ship, or whether muted text gets its own glass ink, is the owner's choice (REVIEW.md, "Layers ×
Material").

## What changed from report 21

- **No material outer lift.** Report 21's opticalDepth, shadowSoftness, shadowSpread and shadowStrength became one
  `cast` control that paints only the contact shadow under raised controls. Cards, menus and dialogs keep Elevation's.
- **Relief is its own control** (inset convex and concave lobes), separate from the cast.
- **Strokes are shadow-list lobes** with one-hot modes (solid, top, gradient, double), combinable solid + top as
  Tactile uses.
- **Numbers that differ by theme** need a numeric theme token: CSS `light-dark()` takes colours only, and Area has no
  number that says dark. The prototype keeps its own `--m-dark`; a build would add one to the theme axis.

## Open

- The None identity proof at today's axes (report 20's protocol, re-pinned).
- Calibration on a named 60Hz minimum device (D14).
- Items 1, 7, 9 and 14 of the board (engraved glyphs, squircle, sphere knob, image-filled sheet).
