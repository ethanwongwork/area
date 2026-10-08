# Redraw C report (phase 2, 2026-10-07)

Icons changed (sources in `apps/docs/assets/area-icons-pilot/`): camera, camera-off, lightbulb, lasso,
pushpin, unpin, palette, shapes. No other icon was edited. Originals: `groups/redraw-C/before/`.
Candidate generator: `groups/redraw-C/cands.py` (+ `geo.py`); all candidates in `groups/redraw-C/c/`.
Final sheets (before / after / reference rows, 16 / 24 / 32 / 48 / 96, outline and filled):
`groups/redraw-C/redraw-C-after-1.png` (camera, camera-off, lightbulb), `-after-2.png` (lasso, pushpin,
unpin), `-after-3.png` (palette, shapes).

Verification for every icon: `gen-pilot-icons.mjs --only` lints clean (8 icons); `look.mjs --slivers`
reports no sliver or island at 16 or 48 for any of the eight; each one checked by eye before and after
beside its reference.

## camera
- **Verdict:** r1 replace → Fluent (done 10-03); r2 **replace → Lucide**, no note.
- **Reference:** Lucide `camera.svg` (also Fluent `camera_16_regular/filled`, Phosphor `camera`; group-8's
  `camera-c1/c2.svg`).
- **Reference construction:** a landscape body 20 × 13 (r 2) with a low, soft hump: concave r 2 off the
  body top, a short steep side (about 62°, run 1.6 over 3), convex r 2 shoulders, a 4-wide flat top; the hump
  base is about 0.6 of the body width. Lens r 3, diameter about 0.46 of the body height, just above centre.
  Overall about 1.25 : 1. Fluent's (the 10-03 drawing) is taller with a 45° hump.
- **New construction:** a 12 × 8 body (2–14 × 5–13, r 2); the hump a polygon (5, 5) → (6, 3) → (10, 3) →
  (11, 5) filleted r 1 at all four corners (63° sides, as Lucide's steep side; tops 3, flat top 6.6–9.4); a
  ⌀4 lens (r 2 at 8, 9, the body's centre; 0.5 of the body height, Lucide's 0.46). Ink 13.12 × 11.12, centred.
  `data-angles="free"` (the 63° side). Lens–body gap 2 between centre-lines (0.88 detail), as Lucide's dense
  lens. Filled unchanged in kind: body solid, lens ring knocked out.
- **Critique of group-8's candidates:** both keep the old 12 × 9 body with an 11-tall silhouette and a 45°
  hump (Fluent's), so they still read Fluent-tall; c2's r 2 lens was the right size. The applied drawing takes
  c2's lens and Lucide's landscape body and low steep hump.
- **Note answered:** the camera is now Lucide's: landscape, low rounded hump, smaller lens (sheet 1).
- **Kept as is:** `data-keyline="square"` (ink 13.12 × 11.12 fits it; horizontal would be 0.12 over in height).

## camera-off (follows camera)
- **Verdict:** approved both rounds; it must follow camera.
- **New construction:** camera exactly (body and lens drawn whole as outline-only `line`s) under the flat
  shared slash; filled: the body a `fill` parted by the slash `gap` (flush, `M0.909 -0.682L16.909 15.318`), the
  lens knockout recut one-sided for the r 2 lens with `icon-geometry slash`:
  `M9.823 9.823A2 2 0 0 1 8 11A2 2 0 0 1 6 9A2 2 0 0 1 7.177 7.177` (split at 8, 11 so the lint samples the
  lens bottom exactly; one arc read 0.87 against the body). `data-counter="sliver"` kept (the outline's recorded
  slash sliver, counter 0.29).

## lightbulb
- **Verdict:** r1 replace → Fluent (done); r2 **replace → Fluent: "wider"**.
- **Reference:** Fluent `lightbulb_16_regular/filled`, `_20_`, `_24_regular/filled`; Lucide `lightbulb` as
  evidence.
- **Reference construction:** a round bulb to about 45° below its equator, then a short concave turn into a
  nearly straight, slightly tapering neck (about 15° from vertical) that runs through the band into a short
  cap with rounded bottom corners; the neck stays wide (about 0.5 of the bulb) rather than pinching.
  Filled: the bulb and cap are two solids parted by the band gap.
- **Why the old one read narrow:** the bulb was r 4 (ink 9.1) and its neck curved inward to a 3.5-wide band, so
  the base pinched to a pear.
- **New construction:** bulb r 4.5 at 8, 6.5 (sides 3.5 / 12.5, top 2; ink 10.12 wide, was 9.12), the arc to
  40° below the equator (4.553, 9.393); a cubic tangent to the arc there and to the neck line at the band
  (concave turn, Fluent's), the neck a straight 1 : 4 taper; the band at 11.5 is 4.5 wide (5.75–10.25, was
  3.5); the cap runs on the same taper to a flat bottom at 14 with r 0.75 corners. Band a `cut` when filled
  (as before, Fluent's gap). Ink 10.12 × 13.12, centred; cap counter 1.43 (was 0.93).
- **Note answered:** the bulb is 1 px wider and the neck and cap no longer pinch; Fluent's construction (arc,
  concave neck, taper, cut band) is kept (sheet 1).

## lasso
- **Verdict:** r1 replace → Fluent, "no dotted line" (done); r2 **replace → Fluent: "loop should be more
  circular and round"**.
- **Reference:** Fluent `lasso_20/24_regular` and `_filled` (Lucide `lasso` as evidence).
- **Reference construction:** a nearly full circle (r about 0.39 of the grid) whose bottom is replaced by the
  knot: a smooth horizontal eye sitting at the circle's bottom, right of centre; the rope stays on the circle
  down the right side into the eye, and the tail leaves down-right past the crossing. The loop's free end
  stops at the lower left, close to the eye.
- **Why the old one read un-round:** an r 5 circle that left the circle at 30° on the right and dropped
  nearly straight to a pointed lens-shaped eye hanging below it, with the free end at 140°: the loop read as
  a Q / teardrop.
- **New construction:** one solid path: an r 5.5 circle at 8, 7.5 (top 2, sides 2.5 / 13.5) from its free end
  at 130° (4.465, 11.713) clockwise over the top all the way down to its own bottom (8, 13); there it turns
  tangentially into the eye, an r 1.25 semicircle (left end 6.75) back to the eye top (8, 10.5); the top runs
  as an r 3.621 arc to (10.56, 11.561) and on as a straight 45° tail on the lattice (x − y = −1) crossing the
  circle at 11.07, 12.07 (about 100°) to (13, 14). The eye is round-ended (no corner), 4.3 × 2.5, counter
  1.46; the free end sits 2.29 from the eye (tight). Keyline square → circle (ink 12.12 × 13.12, centred).
  Line glyph; fills by weight.
- **Note answered:** the loop is a circle for 320° of its turn, larger (r 5.5), and the eye is round, as
  Fluent's (sheet 2).

## pushpin
- **Verdict:** r1 replace → Fluent, "the shape of fluent is nice but dont want it angled, want it straight up
  and down" (done: Fluent's spool upright); r2 **replace → Lucide: "add more detail to the thumbtack"**.
- **Reference:** Lucide `pin.svg` (and `pin-off.svg`); Fluent `pin_16_regular` (angled) and Phosphor
  `push-pin` as evidence.
- **Reference construction:** upright; a round-ended head bar (12 × 4, r 2 ends) whose bottom turns in with
  r 1 into a narrow column half the bar's width; the column flares out at a 1 : 2 slope (r 2 fillets both
  ends) to a base 14 wide, a short vertical side and an r 1 bottom corner; a needle 5 long from the base. One
  outline (the bar and column share one interior). Proportions down the body: bar 4, column 6, flare 2,
  side 3.
- **New construction:** head bar 8 × 2.5 (4–12 × 2–4.5, r 1.25 round ends); r 0.5 turn into a 4-wide column
  (x 6–10); column to the polygon vertex at 7.75, a flare to (3.5 / 12.5, 9.5) (slope 1.75 : 2.5, filleted r 1
  both ends), a vertical side to the base at 11.5 (9 wide, r 0.5 corners); needle 11.5–14.5, a line that stays
  a line when filled. `data-angles="free"`. Ink 10.12 × 13.62, centre 8, 8.25 (as before). Filled: the body
  solid.
- **Note answered:** the thumbtack now has Lucide's three parts, a round head, a column and a flared base,
  instead of one spool (sheet 2).

## unpin (follows pushpin; also r2 "fix, filled: visual error, negative space error")
- **New construction:** pushpin exactly, drawn as an outline-only `line` under the flat shared slash; filled:
  the pin a `fill` parted by the flush slash `gap`, the needle a line (2.12 from the slash, detail).
  The gap-side lower piece would have been a thin diagonal strip along the right flare (sliver flagged at
  11.7, 8.8) ending in a blob at the base's right corner; a filled-only `gap`
  (`M7 7H14.5V14.5Z`, fill) drops that gap-side piece below the column's straight part, as the one-sided
  slash drops gap-side pieces elsewhere (mic-off's arm, camera-off's half lens). Result: the head with the
  column's right edge sawn flat at 7, and the base on the near side. A first try at y 8.5 left a hook on the
  column's fillet (sliver at 48); 7 is on the straight. No slivers at 16 or 48.
- **Owner's r2 fix note:** the old filled cut left a hacked-off head (a wedge removed from it) and a fill
  tip; with the new pin the filled reads as head + base parted by the slash. `data-counter="sliver"` kept
  (outline slash sliver, as recorded).
- **Differs from the outline:** filled has no right base corner (the gap-side piece). If the owner wants
  the corner kept, it would be an island under 1 px wide at 16; the drop is the cleaner reading.

## palette
- **Verdict:** r1 replace → Lucide, "stroke doesnt look smooth at the indent on the bottom right. i like
  lucides" (done 10-03: Lucide scaled 0.6, smooth indent); r2 **replace → Lucide**, no note.
- **Reference:** Lucide `palette.svg` (Fluent `color_16_regular` as evidence).
- **Reference construction:** a left semicircle r 10 at 12, 12; a 10 × 9 quarter ellipse to the right
  extreme; an r 5 lobe; a 2.25 flat; the thumb indent (r 1.75 concave, a 0.5 straight at 3 : 4, r 1.75
  convex) ending 0.25 right of the bottom and closing. Four wells, solid dots of ink ⌀3 (1.5 × the stroke),
  at (1.5, −5.5), (5.5, −1.5), (−5.5, 0.5), (−3.5, −4.5) from the circle's centre.
- **What still differed:** the outline was already Lucide × 0.6 to within 0.25. What read differently at
  16px were the wells: Area's sat 0.5–0.75 lower than Lucide's, and at ⌀1.5 (1.33 × the line) they read as
  pinpricks next to Lucide's.
- **New construction:** outline: semicircle r 6, ellipse 6 × 5.5, r 3 lobe as before; the indent is Lucide's
  exactly scaled to the 3.5 drop (k = 0.583): flat to 9.608, r 1.021 concave, a 0.175 × 0.233 straight, r 1.021
  convex to (8.15, 14), and a 0.15 flat bottom closing (Lucide's 0.25). Wells at Lucide's places: 9, 4.75 ·
  11.25, 7 · 4.75, 8.25 · 6, 5.25 (quarter centres, filled dots) at **⌀2** (r 1). Gaps: well to edge 1.04–1.18
  (detail / tight), between wells 1.13–1.25. Filled: the wells are holes, as before.
- **Deviation to confirm:** ⌀2 is the mark-dot size; the dot rule gives a detail set inside a shape ⌀1.5
  (chat-more, app-window). ⌀2 is applied because it is the closer reading of Lucide (its wells are 1.5 ×
  its line; ⌀2 is 1.78 ×, ⌀1.5 1.33 ×; at 16 px ⌀2 matches Lucide's rendered ⌀2), and it is the visible
  difference left after the outline already matched. The ⌀1.5 reading with the same positions is
  `groups/redraw-C/palette-wells-d1.5.svg` (shown on sheet 3).

## shapes
- **Verdict:** r1 approve; r2 **replace → Lucide** (Lucide `shapes.svg`: a triangle, a square and a circle).
- **Reference:** Lucide `shapes.svg` (Fluent `shapes_16` was the old drawing).
- **Reference construction:** a triangle on top, centred (vertices 7, 10 · 12, 2 · 17, 10: base angles 57.8°,
  r 0.7 corners); below, a 7 × 7 square (r 1) at the left and an r 3.5 circle at the right, equal sizes, 4
  apart; the triangle base is 4 above the row. Triangle base width about 0.56 of the row's width.
- **New construction:** square 4.5 × 4.5 (2–6.5 × 9.5–14, r 1, the small-part radius); circle r 2.25 at
  11.75, 11.75 (9.5–14), 3 apart (standard 1.88); triangle centred, base angles 57.8° (Lucide's), r 0.75
  corners, base at 7, the apex arc's top at 2 (vertices 4.6, 7 · 8, 1.6 · 11.4, 7); the triangle sits 2.5 above
  the square (tight 1.38). All three solid when filled (three separate shapes on one plane).
  `data-angles="free"`. Ink 13.12 × 13.12, centred.
- **Spacing:** horizontal gap 3, vertical 2.5. Lucide keeps both at 4, but at 12 units the whole cannot fit at
  Lucide's proportions with both 3; the triangle's height (1.11 × the square, Lucide 1.14) was kept over equal
  gaps. The equal-gap reading (triangle base at 6.5, height 4.5, gaps 3 / 3; a smaller triangle) is
  `groups/redraw-C/c/shpA.svg`.
- **Note answered:** shapes is now Lucide's three shapes, not Fluent's circle-over-square (sheet 3).

## Cross-group / for the coordinator
- Spec records to replace: camera (3162), camera-off (3163), lightbulb (3073), lasso (3256), pushpin (3123),
  unpin (3124), palette (3258), shapes (2604/2874) with the construction lines above.
- palette's ⌀2 wells need the owner's confirmation or a recorded exception (`data-dot` not needed: the lint
  accepts r 1). If declined, swap in `palette-wells-d1.5.svg`.
- No embedded copies: `embedded.mjs` lists none of these icons inside others.

## Tooling note
Before the coordinator's edge.mjs fix I used a private copy of look.mjs in `apps/docs/.cache/` (removed) with
its own Edge profile dirs under `a private Edge profile in the system temp folder` (left behind; the rm was not permitted).
All final sheets were rendered with the shared look.mjs.
