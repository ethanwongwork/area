---
name: area-icon-construction
description: Draw, redraw or review Area's own stroked icons so the whole set has one optical system. Use whenever an icon in apps/docs/assets/area-icons-pilot (or a later Area icon family) is added or changed, when an icon reads larger, smaller, heavier, blurrier or denser than its neighbours, or when replacing a Fluent icon with an Area drawing.
---

# Area icon construction

Area icons are stroked centre-line drawings on a 16px grid. The goal is a set in which
every icon reads as the same size, weight and density, like Cursor's set, while staying
crisp at 1× and 2×. The rules live in `docs/specs/icons.md` ("Construction system"); the
lint in `apps/docs/scripts/gen-pilot-icons.mjs` enforces the measurable ones. The owner's
eye overrides any rule; when it does, record the exception in the spec.

Sources: Cursor's published construction (minoradventures.co, "The making of Cursor's
icons"), the owner's keyline diagram, and Fluent (MIT) as a size reference. Fluent is a
baseline, not an optical standard: its icons are not consistent with each other, so match
its sizes and conventions where they help, and let Area's rules win where they disagree. Cursor's paths
are proprietary. Use its rules and numbers only, and never trace its icons.

## The system at 16px

**Weight.** `--area-weight-icon`, 1.125px for Geist. Sources are authored at 1.25px and
judged at 1.125px. Ink = centre-line + 0.5625px on each side.

**Pixel grid.** Every horizontal or vertical stroke, rect edge and circle extreme sits on
the 0.5px grid. The whole-pixel grid lands on device-pixel edges at 2×. At 1×, a line on a
pixel centre (x.5) fills one row. On a whole pixel it smears across two half-grey rows,
so prefer x.5 unless the shape must centre on 8. Never use quarter coordinates on
axis-aligned edges; they blur at both densities. A 45° line runs through pixel corners or
pixel centres: x − y (falling) or x + y (rising) is a whole number. Measured on the
standalone check, that lifts the solid-pixel share at 2× from 0.66 to 0.82.

**Keylines.** Each icon declares `data-keyline` and its ink box must fit that shape (Cursor):

| Keyline | Ink box | Centre-line box at 1.125 | Examples |
|---|---|---|---|
| square | 13 × 13 | 12 × 12 (2–14) | add, align, bell |
| circle | ⌀14 | ring r 6.5 | info, status, search, settings, close |
| horizontal | 14 × 11 | 13 × 10 | eye, check, chevron, more |
| vertical | 11 × 14 | 10 × 13 | file, phone, pencil |

Circles are drawn larger than squares so they read the same size. Dense shapes (gear,
lens with handle) sit about one pixel inside their keyline. Sparse shapes, made only of
open lines (cross, close, check), reach to within about a pixel of it.

**Negative space.** Negative space is designed like ink. Measure it in ink at 1.125px;
the lint prints every gap and counter with `--report`.
- **Gaps** between separate shapes come from a two-step scale:
  - *tight*, 1.125–1.625px: satellites such as the bell's clapper, the dot of an i or !,
    and a gear's hub, and overlap cuts (a gap equal to the line, 1.125px);
  - *standard*, 1.75–2px (3px between centre-lines): parallel strokes, bars, a pupil or
    check inside its surround;
  - *open*, 2.5px or more: space that no longer reads as a gap.
  Anything else is a near miss. Change it until it is one of the three, or join the shapes.
  Cursor's rule is the floor: cuts of 2.5 grid units or less blur into one shape.
- **Counters.** Enclosed pockets use the same scale. A satellite pocket, such as a
  clapper cup or a document's fold, may be tight (a 1.25–1.625px disc fits). Every other
  pocket is standard (1.75px or more; 1.875 for a 3px bar or an r 1.5 ring). Anything
  smaller reads as a blot at 16px: the r 1.5 clapper cup was 0.43, and Fluent's 3px
  dog-ear is 0.66 at this weight. Grow the pocket until it reaches a step, or remove it.
  A U shape (straight sides and a round bottom) holds a larger counter than a half-circle
  of the same width.
- **Wedges** where two lines meet at an angle are allowed. A layering line (a fold, a
  flap) must leave its pocket on the scale: the document's fold is 4px (tight 1.35), and
  the folder's flap closes the tab, leaving a standard 1.93px pocket. It doesn't run across
  the whole folder.
- **Balance.** Compare each icon's negative space with its neighbours in the balance strip.
  An icon with one large counter and one tiny one reads unbalanced even when both pass.
  Grow the small one, or merge it into the large one.

**Shared parts.** A part that appears in several icons is drawn once and reused exactly:
- ring: r 6.5 at 8,8 (info, status-*, any circled glyph);
- check: 45° arms in a 1:2 ratio. Standalone it is 3.5 / 7 (M3 8 L6.5 11.5 L13.5 4.5).
  Inside a ring it is 2 / 4 (M5 8 L7 10 L11 6);
- corner radius, on the centre-line. The set should feel soft: no container corner is
  square, and the radius grows with the shape, so values differ but the softness is even.
  Rounder than Fluent's minimum, well short of ChatGPT's:
  - 2px for large containers and frames: document page, open's box, panel;
  - 1.5px for mid containers: folder, copy sheets, trash body, shapes, the book's outer
    page corners, square-dashed;
  - 1px for bars 3px tall (alignment) and small parts (the trash handle);
- overlap cut: where one shape passes behind another (shapes' circle), the hidden part
  stops so the gap equals the line (2.25px between centre-lines, 1.125px of space).
  Owner, round 4: 3px read too far;
- dots: ⌀2 for standalone dots (more), on whole-pixel centres so they fill 2 × 2 pixels
  at 1×. ⌀1.5 (1.33× the line) for a dot with a stem (the i of info, the ! of warning).
  Geist's own dots are rounded squares at 1.05× (i) and 1.3× (!) its stem. A circle needs
  a little more width than a square to look the same size, and 1.56× read too big;
- hub or pupil: r 1.5;
- satellites: the bell's clapper is a U cup 4 wide and 2.5 deep, joined to the base. The !
  and the i share the ⌀1.5 dot and the tight gap to their stem;
- layering: fold and flap lines are `cut`s in the filled variant, so the layer reads in
  both states;
- bars: 8 × 3 and 5 × 3, r 1, 3px between centre-lines (align family).

**Acute corners.** A straight join sharper than 60° pinches the negative space inside it
into a thin, sharp wedge (flash's 16° points, the A's apex, layers' side corners). The lint
fails any straight-to-straight join under 60°. Open the angle, or round the corner with an
arc, r 1 or more, as a fillet between the two lines. Prefer shapes whose points stay wide:
flash now has a flat top like Fluent's, with every corner filleted, and the droplet's tip
is an r 1.5 arc.

**Sharp-by-design exception.** A few objects are sharp by nature (a lightning bolt). The
owner may approve `data-acute="sharp"` on such an icon; record it in the spec. The stroke
fills the point solid, so no thin pocket shows. The counter rule still applies.

**Families.** Related icons share one pattern, as Figma's alignment icons do:
- the same parts at the same height, radius and spacing, and the same optical size. Every
  alignment icon uses 3px-tall bars with r 1 at 3px spacing and an 11px guide. Bar length
  follows the icon's space: beside a guide line the bars are 8 and 5 long; centred on the
  guide they are 11 and 7 long, so that align-center fills the keyline like align-left.
  With the 8 and 5 bars it read small;
- the same reading order: the primary (longer) element comes first, at the top for
  horizontal bars and on the left for vertical bars;
- the same derivation: one drawing, and the others as quarter turns, mirrors or a
  `transpose` (a mirror across the diagonal, which turns a horizontal family vertical and
  keeps its order). Never redraw a variant by hand;
- a guide line behind bars runs as stubs between them (align-center), so it reads as a
  layer, not a line through the counters.

**Filled variants.** Every icon has one, derived from the outline, never drawn
separately. Filled is about emphasis and layers, not flooding the shape:
- **Enclosed shapes fill.** Mark each shape with `data-filled`:
  - `solid` fills it and keeps the outline's outer edge;
  - `knockout` cuts an inner detail out at the icon weight, with round caps (the i, the
    check, the pupil ring, a document's text lines);
  - `hole` cuts an interior out (the gear hub, the i dot).
- **Layers separate.** Where the outline shows two parts or layers, the filled variant
  shows negative space between them, even where the outline strokes join:
  - `cut`: a layer line (a fold or a flap). The outline draws it as a stroke; the filled
    variant turns it into a gap at the icon weight with square ends and sharp corners,
    extended past the silhouette so it runs cleanly through. It must start and end with
    straight segments. Never let a cut end inside the fill, where its rounded cap shows
    as a notch;
  - `gap`: a separation that exists only in the filled variant, such as the line between
    the bell's body and its clapper (Fluent does the same).
- **Line glyphs fill by weight.** An icon with no solid shape (add, check, arrows, link,
  reset…) gets its filled variant by drawing every stroke at 4/3 of the icon weight
  (1.5px, Fluent's filled line), with dots grown by the same amount. The same applies to
  unmarked strokes beside solids (align-left's edge line, trash's lid).
- **A heavier line does not get longer.** A 1.5px round cap reaches 0.19px further than a
  1.125px one, which lengthens the line and closes gaps (open's arrowhead gap closed this
  way). Free ends, which touch nothing else, retract by that amount along their end
  segment, so visible lengths and gaps match the outline. The generator does this; the
  lint measures filled gaps on the retracted geometry.
- **Gaps must survive the heavier line.** The lint rechecks every gap at 1.5px; it must stay
  at least 1px (Cursor's 2.5px between centre-lines). Prefer standard gaps in line
  glyphs.

**Proportions from references.** Where Fluent and ChatGPT agree on a shape, follow them:
- panels are Fluent's frame (11 × 9 on the centre-line, r 2) with a divider line; the side
  pane fills only in the filled variant, never as a pill in the outline;
- a book's page tops hump up and meet at the spine (an M, not a V), with the bottom edges
  following them, and rounded outer corners;
- options has two sliders with large knobs;
- a document's fold is about 5px;
- text is a T with end ticks and a foot (Fluent's text_t, Lucide's type), not a letter A;
- layers are three isometric layers facing up (Fluent's three, Area's orientation);
- flash is a sharp classic bolt: a flat top, one notch and shoulder each side, and a sharp
  tip. Rounding its points made it read blobby and fat;
- layered shapes are the same width: when a filleted corner pulls a shape's side in, trim
  or place the layers below so their ends line up with it.

Check ChatGPT's icon set for proportion and roundness, but keep Area's grid and weight.

**Arrows.** One arrowhead system, so arrows read as arrows at 12px:
- standalone arrows: a 90° head with 5px legs on a 12px stem (M8 14 V2 M3 7 L8 2 L13 7),
  Fluent's proportion; other directions are rotations;
- arrows inside another icon (reset, open, expand, out-of-office): a 90° head with 3px
  legs, identical in every icon;
- a head is balanced about the stroke that arrives at it: its two barbs are equal and
  sit symmetrically either side of the arriving direction. On a curve, put the head where
  the arc's tangent bisects the barbs, or use Fluent's corner head (reset: the arc ends at
  the corner of an L with equal barbs, up and right). Never let one barb crowd the curve
  it came from;
- heads sit on the diagonal lattice. Never shrink a head to fit; move or resize the body.

**Soft transitions.** Where an object's outline changes direction as part of its form (a
bell's flare, a cup's lip, a base meeting a side), draw a curve, and give the end a small
radius (0.5px on the centre-line), not a 45° step or a hard corner. The bell's flare runs
from 3px above the base as an S-curve and meets the base with an r 0.5 corner. A short
diagonal step read as sharp and understated. Geometric corners (rects, arrowheads,
chevrons) keep their rules.

**Lines and angles.** Lines run at 0°, 45° and 90°. A radial exception such as the gear
must be declared with `data-angles="radial"` (gear) or `"free"` (triangle). Round caps and joins. Corners are rounded
after the geometry is set. Prefer closed shapes to open ones. Keep an object's natural
proportions. Diagonals run from bottom-left to top-right; slashes run the other way.

**Centring.** The ink box is centred on 8,8. The exceptions are optical and recorded:
shapes with a heavy base (bell, the i of info) sit about 0.25px high, a triangle is
lifted until its ink box is centred (its mass sits low), and pointed shapes
(chevron, check) may sit up to 0.25px off centre to stay on the diagonal lattice.

**Sizes.** One 16px drawing serves every slot, but the line does not scale with it. It
follows the size curve, line ∝ size^0.45, which is Cursor's step from 1.25px at 16 to 1.5px
at 24:

| Size | 12 | 16 | 20 | 24 | 32 |
|---|---|---|---|---|---|
| Line | 1.0 | 1.125 | 1.24 | 1.35 | 1.54 |

Uniform scaling made large icons too thick (2.25px at 32) and small ones too light (0.84 at
12). Pass `size` to a pilot icon, or `size` to `Glyph` (base.css holds the factors), and
the line follows the curve. At 12px the tight gap falls to about 0.9px, so a dense icon
that must read at 12px on 1× screens gets its own 12px cut.

**In components.** A component that draws its own glyph uses `Glyph` from
`packages/react/src/components/Glyph.tsx`. Add the icon (or one element of it) to
`PACKAGE_GLYPHS` in the generator, never a hand-copied path, and pass the slot's `size`.
base.css sets the line from `--area-weight-icon` and the size curve.

## Process

1. **Plan.** Name the keyline, the shared parts it reuses, and the Fluent equivalent.
2. **Draw** in `apps/docs/assets/area-icons-pilot/<name>.svg`, using absolute commands and the
   attributes of the existing sources. Generate parametric shapes, such as the gear, with
   a script and solve for grid-aligned values; don't nudge by eye.
3. **Lint** with `node apps/docs/scripts/gen-pilot-icons.mjs --report`. It checks the 0.5px
   grid, the diagonal lattice, the keyline, gaps, the live area (centre-lines within
   1.5–14.5), angles and attributes, and prints each icon's ink box and centre.
4. **Review** each icon on `gallery-icons.html`. It is grouped by batch, from
   `apps/docs/assets/area-icons-pilot/batches.json`, which also records the owner's status
   for each icon (approved, revising, review), shown in the component gallery's status
   colours (Complete, In review, Unrefined). Add each new batch there. Each batch opens
   with the whole set so far as a grid, one labelled row per batch at 16px with the new
   batch last: judge every new icon against the set it joins. A tile shows the
   icon at every size on the size curve, 3× plates against Fluent, and the icon inside a
   Button, Badge, Menu item and Nav item (the current item uses the filled variant) beside
   Fluent's. Directional families are one drawing with `data-rotations` (quarter turns,
   `flipx` / `flipy` mirrors or `transpose`); never redraw a variant. Only the owner marks
   an icon approved. Then **compare** the set on `gallery-iconography.html`:
   - *Side by side*: Fluent and Area at 16px and at 4× on the pixel grid with the
     keyline, and Area drawn over Fluent;
   - *Optical balance*: the whole set in one line at 16 and 32px. Look for the icon
     that jumps out as larger, smaller, darker or denser;
   - *Filled*: outline, derived filled variant and Fluent's filled cut;
   - *Pixel check*: 1× and 2× rasters, beside Fluent's.
5. **Audit optical size** with `node apps/docs/scripts/gen-pilot-icons.mjs --check --audit`.
   It rasterises each icon and reports:
   - apparent size (√ of the ink's convex-hull area) and density (ink per hull area),
     each against the set's median;
   - read results within a class: line glyphs (add, check, chevron, arrows, more) have thin
     hulls by nature; full rings run about 15% large by design (circles are drawn larger);
     diagonal shapes (a bolt) read small by hull even when they fill their keyline;
   - a solid shape more than about 8% under the median, or a density above about +25%,
     is a candidate to enlarge or lighten. Confirm by eye in the whole-set grid.
5. **Judge** density as well as size. Count parallel strokes and corners. If an icon reads
   heavier than its neighbours, remove a line or corner, or pull it inside its keyline,
   before thinning any stroke.
6. **Explore** when there is more than one good answer. Put the candidates in
   `apps/docs/assets/area-icons-pilot/explore/`, with `data-group` and `data-label` on each.
   They are linted without failing the build, and the gallery's Exploration section shows
   each one at 16px and 4× with its gaps, counters and rule findings. Delete them once the
   owner chooses.
7. **Record** the construction line for the icon, and any exception, in
   `docs/specs/icons.md`.

## Review checklist

- Is every icon the same apparent size in the balance strip, at 16 and 32px?
- Is every gap tight, standard or open, and is every counter tight (satellite pockets) or
  standard?
- Is the negative space balanced, with no tiny pocket beside a large one?
- Does the filled variant keep the outline's silhouette, with knockouts on the gap scale,
  layers separated, and no gap closed by a heavier line?
- Do related icons share parts, spacing, reading order and derivation?
- Is every arrowhead balanced about the stroke that arrives at it, and the shared size?
- Is any corner under 60°, or any pocket thin and sharp? Is every container on the shared
  radius?
- Are the same parts (ring, check, dot, hub, radius) identical wherever they recur?
- Are axis-aligned edges on the 0.5px grid, and on x.5 where the shape allows? Are
  diagonals on the lattice?
- Is the density even? Watch gears, lists and nested shapes.
- Is the ink box centred, or is the offset a recorded optical exception?
