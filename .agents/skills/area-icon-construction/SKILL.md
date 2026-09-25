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
  - *tight*, 1.25–1.625px: satellites such as the bell's clapper, the dot of an i or !,
    and a gear's hub;
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
- rect radius: 1px on the centre-line;
- dots: ⌀2 for standalone dots (more), on whole-pixel centres so they fill 2 × 2 pixels
  at 1×. ⌀1.5 (1.33× the line) for a dot with a stem (the i of info, the ! of warning).
  Geist's own dots are rounded squares at 1.05× (i) and 1.3× (!) its stem. A circle needs
  a little more width than a square to look the same size, and 1.56× read too big;
- hub or pupil: r 1.5;
- satellites: the bell's clapper is a U cup 3 wide and 3 deep, joined to the base, with a
  standard counter. The ! and the i share the ⌀1.5 dot and the tight gap to their stem;
- layering: fold and flap lines are knockouts in the filled variant, so the layer reads
  in both states.

**Filled variants.** The filled icon is derived from the outline, never drawn separately
(Cursor: solid shapes with the interior details knocked out). Each shape declares a role
with `data-filled`:
- `solid` fills the shape and keeps its stroke, so the silhouette has the outline's exact
  outer edge;
- `knockout` cuts the stroke out of the solids at the icon weight (the i, the check, the
  pupil ring, a document's lines);
- `hole` cuts the shape's interior out (the gear hub, the i dot).
Unmarked shapes are drawn as in the outline (the clapper, trash lid, copy's back sheet).
Line glyphs (add, check, close, chevron, more) have no filled variant; they are the same
in both states. Knockouts follow the same gap scale as ink. The solid bridge between a
knockout and the edge must be standard or wider.

**Lines and angles.** Lines run at 0°, 45° and 90°. A radial exception such as the gear
must be declared with `data-angles="radial"` (gear) or `"free"` (triangle). Round caps and joins. Corners are rounded
after the geometry is set. Prefer closed shapes to open ones. Keep an object's natural
proportions. Diagonals run from bottom-left to top-right; slashes run the other way.

**Centring.** The ink box is centred on 8,8. The exceptions are optical and recorded:
shapes with a heavy base (bell, the i of info) sit about 0.25px high, a triangle is
lifted until its ink box is centred (its mass sits low), and pointed shapes
(chevron, check) may sit up to 0.25px off centre to stay on the diagonal lattice.

**Sizes.** One 16px drawing serves 12–20px slots and scales uniformly, line included
(Cursor's model). Its line then tracks the adjacent text stem: 0.84 at 12, 1.125 at 16,
1.41 at 20. Do not hold the line constant at small sizes: at 12px that shrinks the gaps
below the tight step. A dense icon that must read at 12px on 1× screens gets its own 12px
cut.

**In components.** A component that draws its own glyph uses `Glyph` from
`packages/react/src/components/Glyph.tsx`. Add the icon (or one element of it) to
`PACKAGE_GLYPHS` in the generator, never a hand-copied path. base.css sets the line
from `--area-weight-icon`.

## Process

1. **Plan.** Name the keyline, the shared parts it reuses, and the Fluent equivalent.
2. **Draw** in `apps/docs/assets/area-icons-pilot/<name>.svg`, using absolute commands and the
   attributes of the existing sources. Generate parametric shapes, such as the gear, with
   a script and solve for grid-aligned values; don't nudge by eye.
3. **Lint** with `node apps/docs/scripts/gen-pilot-icons.mjs --report`. It checks the 0.5px
   grid, the diagonal lattice, the keyline, gaps, the live area (centre-lines within
   1.5–14.5), angles and attributes, and prints each icon's ink box and centre.
4. **Compare** on `gallery-iconography.html`:
   - *Side by side*: Fluent and Area at 16px and at 4× on the pixel grid with the
     keyline, and Area drawn over Fluent;
   - *Optical balance*: the whole set in one line at 16 and 32px. Look for the icon
     that jumps out as larger, smaller, darker or denser;
   - *Filled*: outline, derived filled variant and Fluent's filled cut;
   - *Pixel check*: 1× and 2× rasters, beside Fluent's.
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
- Is every gap tight, standard or open, and does every counter hold a 1.75px disc?
- Is the negative space balanced, with no tiny pocket beside a large one?
- Does the filled variant keep the outline's silhouette, with knockouts on the gap scale?
- Are the same parts (ring, check, dot, hub, radius) identical wherever they recur?
- Are axis-aligned edges on the 0.5px grid, and on x.5 where the shape allows? Are
  diagonals on the lattice?
- Is the density even? Watch gears, lists and nested shapes.
- Is the ink box centred, or is the offset a recorded optical exception?
