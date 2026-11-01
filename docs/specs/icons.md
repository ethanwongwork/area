# Icon set spec

**Where (2026-10-12):** the drawings are in `packages/icons/sources/` (moved from `apps/docs/assets/area-icons-pilot/`),
the generator and tools in `packages/icons/scripts/` (`gen-pilot-icons.mjs` is `generate.mjs`, `icon-<tool>.mjs` is
`<tool>.mjs`), the categories in `packages/icons/src/categories.ts`. Earlier sections keep the paths of their day.

**Status (2026-09-28):** 43 review batches, 376 icons with their turns and mirrors, in
`apps/docs/assets/area-icons-pilot/`, generated to `apps/docs/src/pilot-icons.tsx` by
`npm run icons:pilot` and linted by `npm run lint:icons`. Owner status per icon is in
`batches.json` and on `gallery-icons.html`. The weight (1.125px) was the owner's choice on
2026-09-25; components draw a few glyphs through `Glyph`, and demos still use Fluent until
the swap. **Evidence:** measured in the browser on 2026-09-25 (method below). ChatGPT's
sprite was fetched for measurement only and is not stored in the repository.

**Start here.** The process is the `area-icon-construction` skill (`.agents/skills/`):
its quick path covers finding, referencing, drawing, the lint loop, sheets and recording,
and it holds the rules and the owner's decisions. This file is the record: the
construction system's evidence (below), then one section per batch or owner round in date
order, each icon's construction line in its batch's table. The build queue (concepts still
to draw, with references and uses) is `docs/research/icon-inventory.md`. Tools:
`icons:find` (does it exist?), `icons:geometry`, `generate.mjs --only`,
`icons:sheet`, `icons:batch` (docs/DEVELOPMENT.md lists the commands).

## Why draw our own

- Fluent icons are filled outlines with the stroke fixed by the cut: 1px at 16 and 20px,
  1.5px at 24px, and 1.5–2px for presence glyphs at 12–20px. A filled outline cannot be
  re-weighted; changing weight means redrawing.
- Area's own 29 marks (`apps/docs/assets/area-icons`: alignment, rotation, auto layout,
  padding, gaps, corners) are already stroked on a 16px grid, 1px, round caps and joins.
  A stroked source can be exported at any weight from one drawing, like the 1 / 1.25 /
  1.5px comparison the owner supplied.
- One construction system would fix the status-glyph weight mismatch in the Indicator spec
  and let icon weight track the type ramp.

## Measurements

Visual stroke = stroke-width × scale for stroked shapes; for filled outlines,
2 × ink area ÷ outline length, with the ink rasterised at 20×. Check: Fluent 16px
Regular, known to be 1px, measures 0.99px.

| Source | Construction | Grid | Visual stroke |
|---|---|---|---|
| Fluent Regular (60 icons) | filled outline | 16 / 20 / 24 | 0.99 / 1.00 / 1.49px |
| Area marks (29) | stroked, round caps and joins | 16 | 1px |
| ChatGPT (101 sprite symbols) | filled outline | mostly 20 | median 1.33px at 20px; 1.07px at 16px (range 1.16–5.24 at 20) |
| Notion (app, board view) | filled outline | 16 / 20 | 1.27px at 16 (n 149); 1.3px at 20 |
| Figma (file browser) | filled outline | 16 / 24 | 1.0px at 16 (n 20); 0.97px at 24 |
| Cursor (docs site) | stroked | 24 viewBox shown at 12–16 | 1.33px at 16 |
| Cursor (published rules) | stroked, round caps | 16 / 24 | 1.25px / 1.5px |

Text stems, for pairing (Geist, rasterised): 12px/400 1.0, 13px/400 1.1, 14px/400 1.2,
14px/500 1.5, 16px/400 1.35, 16px/500 1.7px.

Reading: the products Area emulates put a 16px icon's stroke between 1.0px (Figma) and
1.27–1.33px (Notion, Cursor), and their stroke sits at or just under the stem of the
adjacent text. Area's 14px/400 text stem is 1.2px; its icons are 1px, so icons read slightly
lighter than text.

Cursor's published construction (minoradventures.co, "The making of Cursor's icons"):
- 16px grid, 1.25px stroke; 24px grid, 1.5px; round caps;
- lines at 0°, 45° and 90°; corners rounded after the geometry is set;
- circles drawn slightly larger than squares so they look the same size;
- optical breaks where strokes meet, and thinning where too many lines meet;
- at least 3px between overlapping shapes (2.5px or less blurs together).

## Proposed construction

Superseded where they differ by "Construction system, second pass" below.

| Rule | Proposal | Basis |
|---|---|---|
| Source | Stroked centre-line geometry, one drawing per icon | Area marks; Cursor; allows weight control |
| Grids | 16px (primary), 12px and 20px cuts only where a component owns that slot | Fluent's size-specific cuts; Area icon ramp |
| Stroke | 1.25px at 16; 1px at 12; 1.5px at 20 and 24 | Cursor; Notion 1.27; matches Geist 14px/400 stem 1.2 |
| Live area | 1px padding inside the 16px box: ink stays within 1–15 at the heaviest weight | Fluent and Area marks keep ink inside 14px |
| Keylines | square 12×12; circle centre-line ⌀12.75 (ink ⌀14 at 1.25px); portrait 10×14; landscape 14×10 | Cursor's four base shapes, circle drawn larger; ⌀13 put ink outside the live area at 1.25px |
| Angles | 0°, 45°, 90° only | Cursor |
| Caps and joins | round | Area marks; Cursor |
| Gaps | at least 2px between separate shapes at 16px, 3px where shapes overlap | Cursor (3px; ≤2.5 blurs) |
| Corner radius | 1px on rectangles at 16px, then scaled per cut | To confirm on the pilot set |
| Pixel fit | endpoints on the 0.5px grid at 1.25px; judged at 1× and 2× | 1.25px cannot snap at 1×, so it is judged by eye there |

The owner prefers a lighter feel. The pilot should compare 1px, 1.125px and 1.25px at
16px beside 14px/400 Geist before fixing the weight.

## Provenance

- Fluent is MIT: its shapes may be traced and adapted, with the notice kept.
- Cursor and Figma icons are proprietary. Use their measurements and published rules; do
  not trace their paths.
- Area's marks came from the earlier Stadium project (commit `ff11e1c`); they are Area's
  own.

## Pilot (proposed)

Twelve icons that cover every construction case, each exported at 1, 1.125 and 1.25px:
chevron-down, check, dismiss, add, search, more-horizontal, settings, bell, info, eye,
align-left (redraw of the Area mark), status-available (circle and check).

Per icon, the spec records the grid, keylines used, stroke, gaps and the side-by-side
check against Geist at 14/400 and 14/500. Pipeline: source SVGs stay stroked in
`apps/docs/assets/area-icons/`; `gen-icons.mjs` emits the React components; a lint step
checks grid, stroke width, caps and joins and minimum gaps.

## Effort

- Rules and tooling (lint, weight export, gallery review page): about one session.
- Drawing: the 12-icon pilot is one to two sessions including review. A core UI set of
  roughly 60 icons is several more, drawn in batches by shape family.
- Maintenance: new icons follow the lint and keyline rules. Fluent stays the fallback
  for anything not yet drawn.

## Pilot record, 2026-09-25

The lint (`apps/docs/scripts/gen-pilot-icons.mjs`) checks:
- viewBox 0 0 16 16;
- stroked shapes use currentColor, round caps and joins, and are authored at 1.25px;
- filled shapes (dots) use currentColor;
- ink stays within the 1–15 drawing area at 1.25px (arcs sampled exactly);
- line segments run at 0°, 45° or 90° unless the icon is marked `data-angles="radial"`
  (the gear);
- absolute path commands only.

A deliberate 30° segment was rejected, and the check passed again once it was restored.
Minimum gaps are not linted yet; they are judged by eye.

Drawings:

| Icon | Construction |
|---|---|
| add | 10px cross |
| check | 45° strokes, 9 × 6 |
| dismiss | 8 × 8 cross (enlarged from 7 × 7 after the visual pass) |
| chevron-down | 8 × 4 (enlarged from 7) |
| search | r 4.5 lens with a 45° handle |
| more-horizontal | three filled r 1 dots on a 4.5px pitch |
| settings | 8 teeth, radii 6.25 / 5, r 2 hub |
| bell | 8px dome body, 11px base, r 1.5 clapper (widened after the visual pass) |
| info | r 6.375 ring, r 0.875 dot, 4px stem |
| eye | two-curve almond, r 2.25 pupil |
| align-left | edge line and two outlined bars (8 × 3 and 5 × 3, r 1) |
| status-available | r 6.375 ring and 45° check |

Visual pass (Edge, 2× display, beside 14/20 Geist at 400):
- **1.25px** matches the text stem (1.2px): the icon and word read as one weight.
- **1.125px** is slightly lighter than the text.
- **1px** matches Fluent.
- The status-available ring now carries the same stroke as every other icon, which
  resolves the Indicator weight mismatch if adopted.
- Close and Expand read small beside Add and were enlarged. The bell read narrow and
  was widened.
- The gear's teeth are fine at 16px; they are the first thing to check at 1× density.

Open: the owner picks a weight; then 1× (non-retina) rendering is checked, the 12 and 20px
cuts are drawn, and the pilot replaces Fluent in components one family at a time.

## Decisions, 2026-09-25

- **Weight: 1.125px** (owner). It is a font-level token, `--area-weight-icon`, in the
  typography axis, so a different typeface can set its own icon weight. The system preset
  keeps 1.125px until a platform face is measured. Pilot components read the token unless
  a `weight` is passed.
- **Status glyphs use the pilot construction** (owner, "for now"). Presence draws its ring
  as the shell's CSS border and the inner mark as a non-scaling stroke, both at
  `--area-weight-icon`. The line weight is therefore the same at 10, 12, 16 and 20px. Marks
  live in `apps/docs/assets/area-icons-pilot/status/` and are generated to
  `packages/react/src/components/status-marks.ts`. Fluent's status mapping is kept: busy is
  a solid disc; out of office swaps away and offline for the return arrow, and busy for
  the question mark. The Fluent presence path generation was removed.

## 1× pixel check, 2026-09-25

The gallery's Iconography page has a "Pixel check" section. For each pilot icon at 1.125px
and its Fluent equivalent, the browser rasterises the SVG into a 16px (1×) and a 32px (2×)
canvas, shown enlarged with hard pixel edges (`apps/docs/public/pixel-preview.js`).

Findings and changes:
- **More** dots sat on half-pixel centres and smeared to grey at 1×. Moved them to
  whole-pixel centres (3, 8, 13); they now render as crisp 2px dots, crisper than Fluent's.
- **Show (eye)**: the r 2.25 pupil nearly touched the outline at 1×. Now r 1.75, which
  follows Cursor's gap rule.
- **Settings**: 8 teeth clogged at 1×. Now 6 teeth (radii 6.25 / 4.75) with an r 1.75 hub.
- A 1.125px line always covers two pixel rows at 1×, so axis-aligned strokes centred on a
  whole pixel (Add, the Info stem) read softer than at 2×. Fluent's 1px outlines centred
  on 8 behave the same way. Options, if 1× crispness matters: shift the symmetric axes to
  7.5, or keep 2× as the design target.
- Diagonal marks (check, close, chevron) anti-alias at 1× in both sets; no change.

## Construction system, second pass, 2026-09-25

Owner review of the first pass:
- check and close read small;
- the gap between the bell's dome and its clapper was unwanted;
- settings read too large and heavy;
- align-left read dense, and its bars should be as far apart as they are from the edge line;
- Area rasterised blurrier than Fluent at 1× and 2×.

The rules are now the `area-icon-construction` skill (`.agents/skills`), taken from
Cursor's published construction and the owner's keyline diagram. The lint enforces them.

**Why the first pass blurred.** Measured by rasterising each icon in the gallery (Edge)
and taking the share of ink in pixels that are at least 85% covered:
- **Quarter-pixel coordinates.** The eye (3.75, 12.25), the align bars (edges on 4/7/9/12)
  and the r 6.375 rings put edges inside device pixels at both densities.
- **Whole-pixel centre-lines at 1×.** A 1.125px line centred on a whole pixel covers two
  pixels at 56%. Centred on x.5 it fills one pixel, plus a 6% fringe.
- **Weight at 2×.** 1.125px is 2.25 device pixels, so every straight edge carries a faint
  fringe. Fluent's 1px is exactly 2 device pixels. This remains while the weight is 1.125.
  The pixel check has an "Area 1× at 1px" column to judge snapping the weight to 1px on 1×
  screens (open decision).
- **Diagonals crossing pixel edges mid-way.** A 45° line is sharpest when x − y (or x + y)
  is whole. The check moved from 2.75 to 3 and went from 0.66 to 0.82 at 2×.

Crispness at 1× (share of ink in solid pixels), first pass → second pass: align-left 0.45 →
0.81, bell 0.48 → 0.70, check 0.07 → 0.53, eye 0.17 → 0.49, info 0.35 → 0.49, settings 0.27 →
0.50, status-available 0.37 → 0.55. Add stays at 0: its stem must centre on 8, as Fluent's
does.

**Rules the lint adds:**
- `data-keyline` is square, circle, horizontal or vertical, and the ink box at 1.125px
  fits it (13 × 13, ⌀14, 14 × 11, 11 × 14);
- axis-aligned edges and circle extremes sit on the 0.5px grid;
- 45° segments sit on the diagonal pixel lattice;
- separate stroked shapes join or keep at least 2.5px between centre-lines (3px is the
  unit);
- centre-lines stay within 1.5–14.5.

`--report` prints each icon's keyline, ink box and centre.

**Drawings**, with ink at 1.125px:

| Icon | Keyline | Construction | Ink |
|---|---|---|---|
| add | square | 11px cross on 8 | 12.1 × 12.1 |
| align-left | square | edge line x 2.5; bars 8 × 3 and 5 × 3, r 1, starting x 5.5; bar gap 3 = edge gap 3 | 12.1 × 12.1 |
| bell | square | r 4.5 dome at y 7, sides x 3.5/12.5, 45° flare to a closed base at y 11.5 (2.5–13.5), r 1.5 clapper joined to the base | 12.1 × 11.6 |
| check | horizontal | arms 3.5 / 7 (1:2), M3 8 L6.5 11.5 L13.5 4.5 | 11.6 × 8.1 |
| chevron-down | horizontal | 9 × 4.5, M3.5 5.5 L8 10 L12.5 5.5 | 10.1 × 5.6 |
| dismiss | circle | 10 × 10, 3 → 13 | 11.1 × 11.1 |
| eye | horizontal | almond 1.5–14.5 × 3.5–12.5, r 1.5 pupil (gap 3) | 14.1 × 10.1 |
| info | circle | ring r 6.5; stem 7.5–11; ⌀1.75 dot at y 5 | 14.1 × 14.1 |
| more-horizontal | horizontal | ⌀2 dots at 3, 8, 13 | 12 × 2 |
| search | circle | r 5 lens at 7,7; handle to 14,14 | 13.1 × 13.1 |
| settings | circle | 6 teeth: tips at 5.59 (flat at y 2.5), roots solved so the side roots sit on x 4/12; r 1.5 hub, 2.5 from the roots | 11.7 × 12.1 |
| status-available | circle | ring r 6.5; ring check 2 / 4 (M5 8 L7 10 L11 6), the check's 1:2 shape | 14.1 × 14.1 |

Against Fluent, with ink as w × h: add 12.1 vs 12; check 11.6 × 8.1 vs 11.75 × 8.5; close 11.1 vs 11;
chevron 10.1 × 5.6 vs 9.9 × 5.5; search 13.1 vs 12.9; settings 11.7 × 12.1 vs 11.5 × 12. The
eye is a full almond (Fluent draws only the upper lid), so it is larger by design.

**Gallery.** The Iconography page adds:
- *Side by side*: Fluent and Area at 16px, both at 4× on the pixel grid with the
  icon's keyline, and Area drawn over Fluent;
- *Optical balance*: the set in one line at 16 and 32px;
- *Pixel check*: now with an "Area 1× at 1px" column.

**Open (resolved in the third pass):** the balance strip, the 1× weight, the gear's teeth.
The status marks (`status/`) still use quarter coordinates and have not had this pass.

## Third pass: negative space, filled variants, second batch, 2026-09-25

Owner review:
- the balance reads better;
- the bell's small clapper cup left negative space that unbalanced it, worst at small sizes;
- future icons need minimum negative space and intentional gaps, as in align-left;
- look at filled versions.

The owner deferred the 1× weight to a recommendation and accepted six teeth.

**Decisions:**
- **1× weight: keep 1.125px everywhere.** Measured over the set, snapping to 1px on 1×
  screens changes the solid-pixel share from 0.53 to 0.54, which is nothing. The drawing
  rules did the work. Area now averages 0.53 at 1× and 0.79 at 2×, against Fluent's 0.36
  and 0.65. The "1× at 1px" column was removed.
- **Gear: six teeth.** Five were rendered beside six and eight. Five reads as a flower,
  with one axis of symmetry and a flat bottom, and its flats cannot land on the grid.
  Eight clogs at 16px.

**Negative space (lint, measured in ink at 1.125px):**
- gaps between separate shapes must be tight (1.25–1.625), standard (1.75–2) or open
  (≥ 2.5), or the shapes must join;
- every enclosed counter must hold a 1.75px disc. The ink is rasterised at 8 samples per
  px, the outside is flood-filled, and each pocket's widest inscribed disc is measured.

The check rejects both earlier bells: the first pass's floating clapper (0.88px gap) and
the second pass's joined cup (0.43px counter). `--report` lists every gap and counter.
Current values: align-left gaps 1.88 × 3, counters 1.93; eye gap 1.88, pupil 1.88; info
1.56 / 1.56 tight, 1.88 standard; settings hub 1.38 tight, hole 1.88; trash handle
counter 1.93.

**Changes:**
- **bell:** the dome and body move up 1px (dome top y 2, closed body with a 45° flare to a
  base at 10.5). The clapper is a detached r 1.75 arc (M6.5 13 A1.75 … 9.5 13), a tight
  1.38 gap below the base, so the enclosed cup is gone. Ink 12.1 × 13.0.
- **info:** the dot moves to y 4.5 and the stem runs to 11.5. Dot-to-ring and dot-to-stem
  are both 1.56 (tight); stem-to-ring is 1.88 (standard).
- **status/unknown:** the question-mark dot was 0.81 from its hook. The hook now ends at
  9.5 and the dot is at 12.25 (1.31, tight).

**Filled variants.** Cursor's rule is "solid shapes with the interior details knocked
out". Cursor's docs site uses only stroked UI icons (57 stroked, no filled icons), so
there was nothing to measure there. Fluent's 16px filled cuts were read for reference:
- enclosed shapes become solid, with details knocked out at the regular weight (info,
  check-circle, gear hub hole ⌀3.5);
- line glyphs get a heavier line instead;
- the filled bell separates its clapper with a gap.

Area derives the filled icon from the outline source. Each shape has a `data-filled` role
(solid, knockout, hole); knockouts are drawn in an SVG mask with a per-instance
`useId`. The generator emits `Pilot<Name>FilledIcon` and `PILOT_ICONS[].Filled`.
Filled variants exist for align-left, bell, copy, document, eye, folder, info, settings,
status-available, trash and warning. Line glyphs have none, by rule. Knockout lines use
`--area-weight-icon`.

**Second batch.** These test the rules on new cases, with Fluent regular and filled cuts
vendored as references through `gen-icons.mjs`:

| Icon | Keyline | Construction | Ink | Negative space |
|---|---|---|---|---|
| copy | square | front 8 × 8 r 1 at 5.5; back sheet as an L (2.5, 8 → 8.5, 2.5) ending 3 from the front | 12.1 × 12.1 | gap 1.88 |
| document | vertical | 9 × 13 page, 45° clipped corner (9.5, 1.5 → 12.5, 4.5), lines 6.5–9.5 at y 9 / 11.5 (2026-10-16, evenly spaced; was 8.5 / 11.5) | 10.1 × 14.1 | lines 1.88 from every edge. No dog-ear: its triangle counter would be about 0.6px |
| folder | horizontal | closed tab silhouette, 45° tab step (6.5, 3.5 → 8, 5) | 14.1 × 10.1 | no flap line: it would leave a 0.38px band beside the tab |
| trash | vertical | lid 3–13 at y 4.5; handle 6.5–9.5, 3 tall; body 3.5–12.5; lines at x 6.5 / 9.5 | 11.1 × 14.1 | handle counter 1.93; lines 1.88 to lid, sides and base. The handle sits on the line positions |
| warning | circle, `data-angles="free"` | triangle (8, 1) (14.5, 13.5) (1.5, 13.5), r 1.25 corners; ! stem 6.25–8, ⌀1.75 dot at 10.75 | 12.5 × 12.2 | stem and dot 1.3 tight to the sides and base; the triangle is lifted 0.5px so its ink box centres |

The warning shows the limit of 16px. The 60° apex is narrow, so the ! stem can only be
1.75px long while keeping tight gaps. Owner to judge whether it reads.

**Gallery:**
- a *Filled* sheet: outline, filled, Fluent filled, and both at 4× with the keyline;
- the side-by-side and pixel sheets use new 2x5 tile spans for the 17 icons.

## Fourth pass: clapper, dots, layering, 2026-09-25

Owner:
- Fluent is a good baseline but not optically consistent across its set;
- prefers a closed clapper cup, bigger;
- the i and ! dots may be slightly too big;
- wants Fluent's layered fold (document) and flap (folder).

**Counter scale.** Enclosed counters now use the same two steps as gaps: tight
(1.25–1.625) for satellite pockets such as a clapper cup or a fold, and standard (≥ 1.75)
for the rest. Anything smaller or in between fails the lint.

**Exploration sheet.** Candidates live in `assets/area-icons-pilot/explore/`. They are
linted without failing the build, generated to `src/pilot-explore.tsx`, and shown on the
gallery's Exploration section at 16px beside text and at 4×, each with its gaps, counters
and rule findings.

| Question | Candidate | Counter | Verdict |
|---|---|---|---|
| Bell clapper | detached arc (third pass) | none (gap 1.38) | passes |
| | cup r 1.5 | 0.43 | fails |
| | cup r 2 | 0.93 | fails |
| | cup r 2.5 | 1.43 tight | passes; wide |
| | **U cup 3 × 3** | **1.93 standard** | **adopted** |
| | U cup 4 × 2.5 | 1.43 tight | passes |
| Document fold | clipped corner (third pass) | none | passes |
| | fold 3, Fluent's size | 0.66 | fails |
| | **fold 4** | **1.35 tight** | **adopted** |
| | fold 4.5 | 1.68, off the lattice | fails |
| Folder flap | none (third pass) | none | passes |
| | **flap closing the tab** | **1.93 standard** | **adopted** |
| | flap across | 1.93 | passes; ignores the tab |

**Dot size.** Geist was measured by rendering it at 400px:
- the i's dot is 1.05× the stem width (and a little taller than wide);
- the !'s dot is 1.3× the stem width.

Both are rounded squares. A circle needs a little more width to look the same size, so a
round dot belongs at about 1.25–1.35× the line. The ⌀1.75 dot was 1.56×. Adopted ⌀1.5
(1.33×) for info and warning. The more-horizontal dots stay ⌀2, a standalone role.

Changes:
- **info:** stem 7.25–11.5, dot ⌀1.5 at y 4.375; dot-to-ring and dot-to-stem 1.56 (tight),
  stem-to-ring 1.88;
- **warning:** dot ⌀1.5 at y 10.75; gaps 1.44 (tight);
- **bell:** U cup M6.5 10.5 V12 A1.5 … 9.5 12 V10.5, joined to the base; counter 1.93. Ink
  box 12.1 × 12.6, centred 0.25px high (heavy base). Filled: body and cup solid;
- **document:** 4px fold, with the diagonal on the lattice (8.5, 1.5 → 12.5, 5.5) and an
  r 1 corner. Lines stay 3 from the fold. Filled: the fold and lines are knockouts, so the
  corner reads as a separate layer;
- **folder:** flap M1.5 6.5 H6.5 L8 5 closes the tab. Filled: the flap is a knockout.

The candidate files stay until the owner confirms. Then delete `explore/`, and the
section empties.

## Fifth pass: owner picks, sizes, first components, 2026-09-25

**Owner picks** (candidates deleted; the Exploration section shows only while
`assets/area-icons-pilot/explore/` holds candidates):
- bell: U cup, 4 wide and 2.5 deep (tight counter 1.43). A 0.5px shift would put the
  flare off the diagonal lattice, so the body is 1px longer instead: sides 6.5–10.5, base
  11.5, cup M6 11.5 V12 A2 … 10 12 V11.5. Ink 12.1 × 13.1, centred;
- dot ⌀1.5 for info and warning;
- document fold 4;
- folder flap closing the tab.

**Sizes.** A new *Sizes* sheet shows the 16px drawings in 12 and 20px slots two ways.
Values at each size:

| Size | Scaled line (Cursor) | Constant 1.125 line: standard / tight gap | Adjacent text stem |
|---|---|---|---|
| 12 | 0.84 | 1.13 / 0.75 | 1.0 (12/400) |
| 16 | 1.125 | 1.88 / 1.38 | 1.2 (14/400) |
| 20 | 1.41 | 2.63 / 2.0 | 1.35 (16/400) |

With a constant line, the 12px gaps fall below the tight step, so dense icons (gear,
trash, eye, document, warning) clog. The *Sizes at 12px* sheet shows it at 1× and 2×.
Scaling keeps the gaps proportional, and its line tracks the adjacent text stem at every
size. **Recommendation: scale uniformly from 12 to 20px** (Cursor's model; the generated
components already do this). Draw 12px cuts only for dense icons, and only if 1× must
read at 12px: at 1× they blur in both modes. Owner to confirm. **Done 2026-10-13** for the icons components show at 12
(section "12px cuts").

Note: the Presence marks use a constant line (non-scaling stroke) by the earlier owner
decision. They are simple marks inside a ring, so the constant line holds up there.

**Components.** The first Fluent family is replaced in components that draw their own
glyphs:
- `apps/docs/scripts/gen-pilot-icons.mjs` writes `packages/react/src/components/glyphs.ts`
  (PACKAGE_GLYPHS: add, arrow-up, check, check-inset (the check inside the Available ring),
  chevron-down, dismiss, grip, subtract, corner, corners, padding-side, padding-axis, sides,
  search, stop). A rounded `rect` source becomes the same centre-line path (stop);
- `Glyph.tsx` renders them, with `rotate` for 90/180/270 and `filled` for a solid shape (the
  Composer's Stop: the outline filled inside its own stroke, as the filled variant's solid role);
- base.css sets the line: `[data-area-glyph] path { stroke-width: var(--area-weight-icon) }`.

| Component | Was (Fluent) | Now |
|---|---|---|
| Badge dismiss (12px) | dismiss_12 | dismiss |
| NumberField steppers (12px) | chevron_up/down_12 | chevron-down, rotated 180 for up |
| TreeView disclosure (16px) | chevron_down_16 | chevron-down (CSS still rotates −90 when collapsed) |
| TreeView checkbox (14px inside the box border) | checkmark_16 | check-inset, the same shared part as Available |

At 12px the scaled line is 0.84px against Fluent's 1px 12px cut. Composer's send arrow
and the icons that demos pass in (folders, files) are still Fluent.

2026-09-30 (audit S16, S18): PACKAGE_GLYPHS now also exports `stop` (Composer's Stop) and
`more` (ToolbarOverflow's trigger, the dots of more-horizontal). The generator accepts stroked
paths and rects, or filled circles alone, and writes a `glyphPaint` map to `glyphs.ts`:
`solid` glyphs (stop) also fill inside the centre-line, as the filled variant's solid role;
`fill` glyphs (more) are filled with no stroke, so the dots keep their drawn radius.
`Glyph.tsx` paints by that map; every other glyph stays a stroked line.

2026-10-09 (Toggletip): PACKAGE_GLYPHS also exports `info` and `help`, the pilot drawings unchanged. A line
drawing may now carry filled dots (the i's dot, the ?'s point) and stroked circles (the ring, as a centre-line
path): the generator writes their path indexes to a `glyphFills` map, and `Glyph.tsx` fills those paths with no
stroke, so the dot keeps its drawn 0.75 radius at every size.

**Sixth pass, same day: status marks and arrow.**
- The lint now holds status marks to every rule except keylines (grid, lattice, gaps,
  counters).
- **available:** now the shared inset check (M5 8 L7 10 L11 6), the same part as the
  Available icon and the TreeView checkbox. The old check was off the lattice.
- **blocked:** the slash now runs from top-left to bottom-right, per Cursor's direction
  rule for negation.
- **out-of-office:** the arrowhead moved onto the lattice (M12 8 H4 M7 5 L4 8 L7 11).
- **unknown:** the dot is ⌀1.5 (the dot rule); its gap to the hook is 1.44, tight.
- **arrow-up** is new: vertical keyline, M8 13 V3 M3.5 7.5 L8 3 L12.5 7.5, lattice-aligned,
  ink 10.1 × 11.1. It is a package glyph, and Composer's send button now uses it.

## Seventh pass: review page, folder, direction family, batch 3, 2026-09-25

**Review page.** The gallery has a new *Icons* page (`gallery-icons.html`) with one tile per
icon (`ICON_REVIEW_DEMOS` in `apps/desktop/src/content/demos/icons.tsx`). Each tile shows:
- the icon at 12, 16, 20, 24 and 32px, and the filled variant at 16 and 20;
- Area and Fluent at 4× on the pixel grid with the keyline, Area over Fluent, and both
  filled variants;
- a real outline Button, icon-only Button, soft Button, Badge, Menu item and Nav item (the
  current item uses the filled variant), first with the Area icon and then with Fluent's.

Cursor's icons are proprietary and are not stored in the repository; compare against the
product directly. The Exploration section moved to this page.

**Folder** (owner: too long, make it more square but still a rectangle). Four proportions
are on the Exploration sheet: 13 × 9 (previous), 11 × 9, 12 × 10 and 11 × 10. Applied
**11 × 9** (1.22:1, ink 12.1 × 10.1). Its edges stay on the x.5 grid, and it sits at the
size of its neighbours. The tab step and flap stay on the lattice.

**Directional families.** `data-rotations` on a source emits rotated icons (one drawing,
rotated about 8,8). A quarter turn keeps the grid and the diagonal lattice; the keyline
swaps for 90° and 270°.
- chevron-down gives chevron-left, chevron-up and chevron-right;
- arrow-up gives arrow-right, arrow-down and arrow-left.

**Batch 3**, the icons components already use:

| Icon | Keyline | Construction | Ink | Negative space |
|---|---|---|---|---|
| open | square | 11 × 11 box, r 1, top-right corner replaced by the arrow (head 10.5–13.5, shaft to 8, 8) | 12.1 × 12.1 | box ends 2.5 from the head (tight) |
| link | horizontal | two r 3 brackets (x 2–6.5, 9.5–14, y 5–11) and a bar 6–10 | 13.1 × 7.1 | bracket to bracket and bar to bracket 1.88 (standard) |
| person | vertical | r 2.5 head at 8, 5; closed shoulders 3.5–12.5 × 10–13.5, r 3 | 10.1 × 12.1 | head gap 1.38 (tight), body counter 2.43 |
| reset | circle | r 5 arc (centre 8, 8.5) from the left, three-quarters round to the top, chevron head M7 2 L5.5 3.5 L7 5 | 11.1 × 12.6 | none |

For reset, a corner-arrowhead version (Lucide's construction) read as a "t" and was
dropped.

## Full set roadmap

Each batch goes through the skill: draw, lint, review page, owner review.

| Batch | Icons | Replaces |
|---|---|---|
| 1–3 (done) | add, align-left, arrow ×4, bell, check, chevron ×4, copy, dismiss, document, eye, folder, info, link, more, open, person, reset, search, settings, status-available, trash, warning | Fluent in components and demos |
| 4: alignment | align top, middle and bottom; align center and right; distribute | AlignTop/Middle/Bottom (12 demo uses) |
| 5: docs chrome | expand, panel left/right, book, options, color, text, shapes, lines, square, layers, flash | TOOLBAR |
| 6: Area marks | the 29 inspector marks (padding, gap, flow, corners, rotate, opacity, token, sliders…) redrawn on the system at 1.125px | `assets/area-icons` |
| 7: states | eye-off, lock, star, heart, pin, filter, sort, calendar, clock, edit (pencil), send, download, upload, refresh, sparkle | new needs as components arrive |

Then:
- swap the demo-level Fluent imports (PlusIcon, SearchIcon…) for Area icons, family by
  family; this changes every gallery demo, so the owner approves each family;
- retire the Fluent map.

## Eighth pass: filled layering, filled line glyphs, arrows, 2026-09-25

Owner:
- likes that Fluent's filled icons use negative space to imply layers and separation,
  even where the outline strokes join;
- dislikes the rounded corners the folder's knockout showed inside the fill;
- likes Fluent's arrow size; Area's arrow got lost at small sizes;
- asked how line icons should fill ("just thicken the stroke").

**Filled roles** (generator and lint):
- `cut` is a layer line that becomes a square-ended, sharp-cornered gap, extended 2px past
  the silhouette along its end segments. It is used for the folder's flap and the
  document's fold. The folder's cut now runs from outside the left edge, along the flap,
  and out past the tab step;
- `gap` is a filled-only separation. The bell has one at y 12.625 (x 4–12), leaving a
  1.4px clapper below the body, like Fluent's filled alert;
- **Line glyphs** fill by weight: every stroke at 4/3 of `--area-weight-icon` (1.5px), and
  dots grow by the same amount. Unmarked strokes beside solids are drawn at 1.5px too.
  Every icon now has a filled variant; `PILOT_ICONS[].fill` is `solid` or `weight`.
- **The lint checks gaps at 1.5px:** they must stay at least 1px. Open's tight arrowhead
  gap reaches exactly 1.0.

**Arrows:**

| Arrow | Change | Result |
|---|---|---|
| arrow-up (and its rotations) | M8 14 V2 M3 7 L8 2 L13 7: 5px legs on a 12px stem | ink 11.1 × 13.1; Fluent's head is 9 wide on 11.5, so Area's is at least as present |
| reset | circle r 5 moved to 8, 9.5; head legs 3 (M8.5 1.5 L5.5 4.5 L8.5 7.5), apex at 5.5, 4.5 | ink 11.1 × 14.1, centred |

Embedded heads (reset, open, out-of-office) all use 3px legs.

**Batch 4, alignment.** `data-rotations` also accepts `flipx` / `flipy` (a mirror across the
centre keeps the grid and swaps the two lattice conditions).
- align-left gives align-top (90), align-bottom (270) and align-right (flipx);
- align-center is new: bars 8 × 3 and 5 × 3 (the same parts as align-left) centred on x 8;
  the centre line runs behind the bars as stubs (2.5–3.5, 6.5–9.5, 12.5–13.5), so it reads
  as a layer, not a line through the counters. Ink 9.1 × 12.1; gap and counters standard;
- align-middle is align-center at 90.

Fluent references: align_right, align_top, align_bottom, align_center_vertical (for
align-center) and align_center_horizontal (for align-middle). Distribute is left for later.
The set has 33 icons.

## Ninth pass: review round 2, 2026-09-25

**Owner feedback:**
- the first batch is approved, except the icons commented on;
- in the filled open, the thicker stroke's cap closed the gap;
- reset's head is unbalanced (its lower barb crowds the circle); Fluent's design is
  preferred;
- are align-middle's bars and gaps the same as align-left's? Figma's alignment set reads
  as one family;
- large icons look too thick;
- review tiles should be smaller (two or more columns) and grouped by batch.

**Filled line glyphs keep their length.** At 1.5px a round cap reaches 0.19px further, which
lengthened lines and closed open's tight gap. The generator now retracts free ends (ends
touching nothing else) by (1.5 − 1.125) / 2 along their end segment. Open's filled gaps
now equal its outline gaps (1.38). The lint measures filled gaps on the retracted
geometry. Arc ends are not retracted yet.

**Reset** now uses Fluent's construction:
- circle r 5.59 at 8, 8, with the arc from the corner (3, 5.5) round to a tail at 165°;
- the head is an L with equal 3px barbs (M3 2.5 V5.5 H6);
- the arc arrives at the corner between the barbs, so neither barb crowds the circle.

Three candidates were compared on the Exploration sheet (barbs 3, barbs 2.5, and a lower
corner); barbs 3 match the shared embedded head.

**Alignment family.** The bars are the same, 8 × 3 and 5 × 3 with r 1, and so is the
spacing, 3px between centre-lines (1.88 gaps). What differed was reading order: rotating
align-left put align-top's long bar on the right. A new `transpose` derivation (mirror
across the diagonal) keeps the long bar first. align-top and align-middle now transpose;
align-bottom stays a 270° turn, which already puts the long bar on the left.

**Size curve.** The line no longer scales with the drawing:

| Size | Line | Adjacent text stem |
|---|---|---|
| 12 | 1.0 | 1.0 at 12/400 |
| 16 | 1.125 | 1.2 at 14/400 |
| 20 | 1.24 | |
| 24 | 1.35 | 1.35 at 16/400 |
| 32 | 1.54 | |

The line grows with size^0.45, derived from Cursor's 1.25px at 16 to 1.5px at 24. Uniform
scaling gave 1.69 at 24 and 2.25 at 32.
- **Pilot icons:** take `size`; `sw()` in `pilot-icons.tsx` computes the line.
- **Component glyphs:** take `size`, and `base.css` holds the factors (12: × 1.1715,
  20: × 0.8846, 24: × 0.8000). Badge dismiss and the NumberField steppers pass 12.
- **Gallery:** the Sizes sheet now shows the curve, with uniform scaling at 24 for
  comparison.

Filled variants of icons with solids are uniform enlargements (owner, 2026-10-02): the generator draws their strokes, cuts and gaps at the 16px weight at every size (`filledUniform` in gen-pilot-icons.mjs). With the curve, a 32px render thinned the slash to 0.77 units while its one-sided gap stayed placed for 1.125, leaving a 0.18-unit strip of fill between them (every slashed icon, and bell-dot's ring gap). Line glyphs keep the curve.

**Review page:**
- one-cell tiles (`data-span="1x2"`), three columns in a 1000px pane;
- 3× plates, and contexts trimmed to Button, icon Button, Badge, Menu item and the current
  Nav item (filled), then Fluent's;
- sections come from `assets/area-icons-pilot/batches.json`, which records each icon's
  owner status. Batch 1 (core) is approved except open and reset, which are back in
  review; batch 2 (alignment) and batch 3 (docs chrome) are in review.

**Batch 3, docs chrome** (45 icons in the set):

| Icon | Construction | Notes |
|---|---|---|
| expand | two corner arrows, open's 3px head, shafts on x + y = 16 | Fluent's is four corners ("fullscreen") |
| panel-left / panel-right | 11 × 11 frame, 4-wide panel that fills; mirror | panel counter 2.94 |
| list | four lines at 3px spacing, 2.5–13.5 | standard gaps |
| square-dashed | corners (1.5 arms) and centred 3px dashes, tight gaps | |
| flash | closed bolt with a 1.5px jog so the waist stays open (counter 1.43) | a narrower jog pinched into 0.2px slivers |
| text | an A, crossbar at 9.5 | counter 3.02 |
| shapes | 7 × 7 square (solid) and an r 3.5 circle cut 2.5 short of it | Cursor's overlap cut |
| layers | isometric diamond (solid) over a chevron, 1.875 apart | |
| book | two pages meeting at the spine; the spine is a `cut` | |
| options | three sliders, r 1.5 knobs (solid), knob to line tight | denser than Fluent's two |
| color | a droplet: tangents from the tip to an r 4.5 bowl | Fluent draws a palette |

Roadmap renumbered to the owner's batches:
- batch 4: Area's 29 inspector marks;
- batch 5: new needs (lock, star, calendar, pencil, download, sparkle…);
- then the demo-level Fluent swap.

**Same day, owner:**
- **Bell:** the flare should be more pronounced and less sharp, like Fluent's. Three
  candidates were compared on the Exploration sheet: a soft S-curve, a longer flare, and a
  Fluent-like straight steep flare (which breaks the angle rules). Applied the **longer
  flare**: the sides curve out from y 8 to the base ends (C 12.5 9.5, 13.5 10.25, 13.5 11)
  and meet the base with r 0.5 corners. The skill gains a "soft transitions" rule. The bell
  is back in review.
- **Review page:**
  - status is shown in the component gallery's colours (approved = Complete, review = In
    review, revising = Unrefined), with counts on each batch header;
  - each batch opens with a full-width whole-set grid (`GalleryIconBatchSet<n>`): one
    labelled row per batch up to that one, the new batch last, every icon at 16px in a
    fixed 24px cell so columns line up (the owner replaced an earlier underlined strip
    with this);
  - `PILOT_BATCHES` is generated from `batches.json`.
- The generator's path parser now supports `Q` curves.

## Tenth pass: review round 3, 2026-09-25

The owner's notes, and what changed for each:

| Note | Change |
|---|---|
| align-center and align-middle look smaller | Bars resized to fill the keyline like align-left: 11 × 3 and 7 × 3, keeping bar height, radius and spacing. Ink went from 9.1 × 12.1 to 12.1 × 12.1. The family rule now says "same optical size", not "same bar length" |
| document fold small | Fold 5, Fluent's size, on the lattice (7.5, 1.5 → 12.5, 6.5), with an r 1.5 fold corner like Fluent's. Lines moved to y 9 and 12 (tight gaps to the fold and the base). Fold counter 3.43 |
| slightly rounder overall (Fluent is rounder; ChatGPT much rounder) | Container radius 1 → 1.5 on the centre-line (document, folder, copy, trash, open, square-dashed, shapes); wide frames 2 (panel). Bars and small parts stay 1 |
| droplet too sharp at the top | The tip is an r 1.5 arc; bowl moved to y 9 to recentre |
| options: two controls like Fluent | Two sliders at y 4.5 and 11.5, r 1.5 knobs at x 10 and 6 |
| text: look at other examples | A T with end ticks and a foot (Fluent's text_t, Lucide's type). Candidates on the Exploration sheet: the previous A (fails the new acute rule), a plain T, and a T in a text box |
| panel wider, like Fluent and ChatGPT | Frame 13 × 10 (1.5–14.5 × 3–13), r 2; the side panel is 4 wide. Horizontal keyline |
| flash's negative space too sharp and thin; watch acute angles | New lint rule: straight joins under 60° fail unless filleted. Flash is redrawn after Fluent's: a flat top, a wider bottom point (45° before rounding), and every corner filleted (r 0.75–1). Counter 4.89. Layers' 53° side corners are filleted at r 1 |
| overlap spacing consistent with copy | The shapes circle stops 3px short of the square (standard 1.88), as copy's back sheet does |

The acute rule also flags the bell's old 45° step, which the owner had already called too
sharp. Batch statuses are updated in `batches.json`: every touched icon is back in review.

## Eleventh pass: review round 4, 2026-09-25

| Owner note | Change |
|---|---|
| the shapes overlap gap is too far; the space should be close to the line | Overlap cut = a gap equal to the line: 2.25px between centre-lines, 1.125px of space. The circle now ends at x/y 4.25. The tight step starts at 1.125. Arc ends now retract in the filled variant too, so the gap holds at 1.5px |
| panel: a line like Fluent's, as wide as Fluent's, no pill | Frame 2.5–13.5 × 3.5–12.5, r 2 (ink 12.1 × 10.1, Fluent's 12 × 10), divider at x 6.5. The side pane is a path whose right edge is the divider; it fills only in the filled variant |
| book corners rounder; pages slightly more angled | Outer corners r 1.5. Pages dip 1.5px to the spine at the top (3 → 4.5) and the bottom (11.5 → 13) |
| everything a bit softer; radii needn't be identical | Large containers r 2 (document, open, panel); mid containers r 1.5; bars and small parts r 1 |
| flash too extreme; look at Fluent and others | Redrawn on Fluent's proportions: flat top 5.9–10.7, notch and shoulder at 5.5, left shoulder at 9, tip at 4.6, 14.5. Gentle fillets (r 0.5–0.75), centred. Candidate: the previous bolt. A Lucide-style Z bolt was tried and dropped: its 26° points lose most of their shape when rounded, which is the sharpness the owner flagged |
| other examples for layers | Candidates: the current diamond over one layer; three layers (Lucide, Material); stacked cards (a Figma-like panel stack) |

## Twelfth pass: review round 5 and the optical audit, 2026-09-25

| Owner note | Change |
|---|---|
| flash still too fat | Fluent's structure at 82% width and 112% height, filling the vertical keyline (ink 7.7 × 13.2), centred. Previous versions on the Exploration sheet |
| book arcs should bend down more, an M not a V | Page tops now hump up (C7 3.2 5 2.6 3 3 from the spine) and the bottoms follow them. Previous version on the sheet |
| droplet point too rounded | Tip r 1.5 → 0.75 |
| content should fit its containers | At four columns (282px tiles) 16 review tiles overflowed. Tiles now show four plates (Area, Fluent, over, filled) and a compact context: an outline button, icon button and badge on one line, then the current Nav item. The Menu item was dropped, since it is the same slot as the Nav item |
| deep optical size audit | New `--audit` mode (below). Enlarged person, warning and color |
| like Fluent's three-layer layers, facing up | Layers is now three isometric layers facing up (tight 1.53 gaps). Fluent's diagonal cards are on the sheet as an alternative |

**Optical audit.** The ink is rasterised at 8 samples per px, and each icon gets an
apparent size (√ of the convex-hull area) and a density (ink / hull), compared with the
set's median (10.86 and 0.39).
- **Line glyphs** have thin hulls by nature (more −55%, chevron −47%, check −41%, add,
  arrows and expand about −18%).
- **Full rings** run about 16% large, the intended circle compensation (info,
  status-available).
- **Solid shapes** below −8% were enlarged:
  - person −11% → −5%: head r 2.5 at y 4.5; shoulders 3–13 from y 10, a standard gap;
  - warning −8% → −5%: triangle (8, 0.75) (14.75, 13.5) (1.25, 13.5), r 1.25 corners;
  - color −12% → −4%: bowl r 5 at y 9.25, tip at 1.5.
- **Accepted as is:**
  - flash reads −22% because a diagonal bolt has a small hull, but it fills its keyline;
  - layers' density (+22%) comes from its three stacked layers.

**Round 6 (same day):**
- **Flash.** Owner: still not right; sharper angles are fine. The rounded versions read
  blobby. Now a sharp classic bolt (6, 1.5) (11, 1.5) (8.5, 6.5) (12.5, 6.5) (5.5, 14.5)
  (7, 9) (3.5, 9), with `data-acute="sharp"`, the first owner-approved exception to the
  60° corner rule. Its tip is 26° and the stroke fills it solid. Counter 3.24. The sharp
  Fluent-structure version is on the Exploration sheet; a narrow variant was rejected by
  the counter rule (a 0.18px sliver).
- **Layers.** Owner: should the two lower layers match the top layer's width? Yes. The top
  layer's r 1 side fillets pull its sides in 1.24px, so the lines below ran wider. The icon
  is rebuilt so all three layers span exactly 3–13: the top layer's vertices sit at
  8 ± 6.24 and the lines run 3–13. Ink 11.1 × 13.2, centred; gaps 1.53 (tight).

## Batch 4: inspector, 2026-09-25

Area's own inspector marks (`assets/area-icons`, 1px, from Stadium) redrawn on the system.
There are 16 drawings and 23 icons with derivations; the set is now 70.

| Icon | Construction | Notes |
|---|---|---|
| angle | L axes (2.5, 2.5 → 2.5, 13.5 → 13.5, 13.5) and an r 6 arc from the vertical axis to the base | |
| aspect-ratio | 11 × 11 frame r 2; inner corner brackets, arms 2 | brackets become knockouts when filled |
| auto-layout | tall 4 × 11 bar and a 4 × 4 box, r 1.5; a check on the lattice below the box | standard and tight gaps |
| corner (+ top-right flipx, bottom-left flipy, bottom-right 180) | one r 5 corner, 11px arms | corner-radius was a duplicate and is dropped |
| corners | four r 2.5 corners with 1px arms, 4px apart | |
| dots-four | four r 2 rings, standard gaps; solid when filled | was four solid discs |
| eye-off | the pilot eye's almond with a slash from top-left to bottom-right (negation direction) | the pupil is dropped: the slash cut it into 0.47px slivers |
| flip (+ flip-vertical transpose) | axis at 8; two triangles, sharp 90° tips 1.875 from the axis, r 1 back corners | |
| flow (+ flow-vertical transpose) | two 3.5px boxes and a row arrow with the 3px head | |
| flow-wrap, flow-free | 4 × 4 boxes, r 1, standard or tight gaps | |
| gap (+ gap-vertical transpose) | two outward brackets r 1.5 and a ⌀2 dot, tight gaps | |
| opacity | frame r 2; six ⌀1.5 dots on a 3px pitch | the pitch keeps side gaps tight and diagonals open; 2.5 put diagonals in the dead zone |
| padding | frame and an inner 5 × 5 box, a standard gap | four side bars always collide at the corners |
| padding-sides (+ padding-ends transpose) | frame and two inner bars | |
| token | r 6.5 ring and r 3.5 inner ring, 3 apart (standard); the inner ring is a knockout when filled | the old r 3 inner ring was in the dead zone |
| sliders | options, transposed | |
| rotate | reset, mirrored (clockwise) | |

Not redrawn:
- auto-position: its S-path cannot hold the 3px embedded head without near misses, so it
  needs a new concept;
- bars-three: unused;
- eye: already in the set.

Audit: corner (−20%) and angle (−17%) read small by hull because each is one line, like
the other line glyphs. The frames sit at the full square keyline (+10%).

**Batch 4, round 1.** The owner pointed to Figma's editor icons as the reference.

| Owner note | Change |
|---|---|
| flip triangles need work | Tall triangles pointing at the axis, (2, 3.5) (5.75, 8) (2, 12.5), back corners r 0.75 and tip r 0.5 (r 1 on a 3.5px triangle made a blob). Tips 1.28 from the axis (tight) |
| corner arms too long | Span 9 instead of 11: M3.5 12.5 V8.5 A5 … 8.5 3.5 H12.5 |
| look at other hide icons | Hide is now a closed eye, a lid and three lashes (Figma, Notion, Lucide eye-closed). Candidates: the previous slash eye, and a Lucide-style slash eye with its lids cut |
| refine flow; the arrow head is too big | 4px boxes throughout the flow family; the flow arrow's head is 2.5px. Secondary arrows (flow, rotate) now use smaller heads |
| rotate (Figma reference) | Its own drawing instead of mirrored reset: a rotated square (r 1 corners) with a clockwise arc from −100° to −30° and a 2.25px head, the largest head that clears the square |

**Rotate, round 2.** Owner: rotate needed a lot of work; see Figma's, and research others.

References compared:
- Figma: a rotated square sitting low, with a wide arc over the top and a small head on the
  right pointing down;
- Material rotate_90_degrees: an upright square with a corner arc;
- Lucide rotate-cw and Fluent arrow_rotate_clockwise: a plain circular arrow.

Candidates on the Exploration sheet: the previous short arc, the Figma construction, and a
clockwise circular arrow (reset mirrored). The Material version was dropped: its arc
could not clear the square (0.43px).

Applied, Figma's construction: a rotated square with an 8px diagonal and r 1 corners,
centred at x 8. The arc (r 6.7) runs from 216° to −40° round the top, and the 2.25px head
is symmetric about the arc's direction. The geometry was solved numerically for:
- arc to square a standard gap (1.99);
- head to square a tight gap (1.27; 1.1 when filled);
- no enclosed sliver;
- ink 11.9 × 11.4, centred.

**Rotate, round 3.** Owner: the problem is the angle the arrow's end faces; treat it like
reset and get the arc right; iterate.
- The head is now reset's corner head, mirrored: an L with equal 3px barbs, up and left,
  whose corner is the arc's end. The arc arrives at −45°, exactly on the diagonal between
  the barbs, so the head is balanced about its stroke.
- A numeric search (arc centre, corner on the 0.5 grid, arc radius, square size and
  position) kept 19,042 layouts with every gap on the scale. The five varied ones are on
  the Exploration sheet.
- Applied B: arc r 6.36 (centre 8, 9.5) from 225° to the corner at 12.5, 5; a rotated
  square with an 7px diagonal at 8, 10.85, r 1 corners; head a standard 1.93 from the
  square; arc 3.5 from the square (open); ink 10.1 × 13.1, centred.
- A and E (a bigger square) run 13.7 tall, over the keyline. Their upper barb reaches y
  1.5, which the first search did not count.

**Document, round 4.** Owner: the fold is too big; make it slightly smaller but keep the
negative space. The fold is now 4.5. A 45° line only lands on the lattice with the page
top at y 2 (page 2–14, r 2): diagonal (8, 2) → (12.5, 6.5), fold corner r 1.5. Lines at
y 9 and 11.5 (tight gaps to the fold, each other and the base). The fold pocket is 1.53
(tight), down from 3.43.

## Batch 5: common, 2026-09-25

Twelve everyday icons (82 in the set):

| Icon | Construction |
|---|---|
| lock | 9 × 6 body, r 1.5; r 3 shackle joined to it; keyhole stem a tight gap from both edges |
| star | five points, R 7.4 with a 0.44 inner ratio; tips r 1, valleys r 0.5; centred by its ink box |
| heart | two r 3.5 lobes and 45° sides meeting at a 90° point |
| calendar | 11 × 9.5 frame, r 2; a header `cut` at y 7; binder tabs ending just below the frame edge |
| clock | ring r 6.5; the away-status hands (a knockout when filled) |
| pencil | a 45° body (bottom-left to top-right) with an angled tip; filleted corners |
| download / upload | an arrow into or out of a shared tray (r 1.5); 3px head, a tight gap to the tray |
| filter | a funnel with filleted corners |
| sort | an up arrow and a down arrow, 2.5px heads on the lattice |
| sparkle | a four-point star with concave sides, and a small plus |
| pin | a droplet with its tip down (the color construction), bowl r 4.75, ring r 2 a tight gap inside |

Lint fixes:
- calendar's tabs came within 0.38px of the header;
- lock's keyhole sat in the dead zone relative to the shackle;
- pin's ring could not sit on the grid at the flipped droplet's height;
- the small sparkle's pocket was a blot (0.41), so it became a plus.

Audit: star, filter, pencil and heart were enlarged. Pencil still reads −15% by hull, as a
diagonal does.

**Remote review:** `batch5-sheet.png` renders the review content with headless Edge (the
whole-set grid, then each icon's sizes, filled variant and contexts), so the owner can
review from chat.

## Batch 6: everyday, and owner round on batches 4–5, 2026-09-25

Nine new icons (91 in the set) and one derived variant:

| Icon | Construction |
|---|---|
| minus | add's horizontal bar, M2.5 8 H13.5 |
| refresh | reset mirrored (`refresh:flipx` on reset), not a new drawing |
| send | a paper plane: tip 14.5, 8, back corners 2, 2 and 2, 14, fillets r 1, notch at 4.5, 8 as an r 2 curve |
| home | walls 2.5–13.5, a 45° roof to an apex at 8, 2 (r 1), r 1.5 base corners; a U door 3 wide (knockout) |
| mail | 11 × 9 frame, r 2; the flap is a `cut` from the sides at y 5.5 to an r 1.5 vertex |
| chat | 11 × 9 bubble, r 2; the tail runs at 45° from 5.5, 11.5 to 2.5, 14.5 (r 0.75) |
| image | 11 × 11 frame, r 2; an r 1.5 sun (hole, tight to the frame); a 45° hill with an r 1 peak (a `cut`) |
| mic | a 4 × 7.5 capsule; an r 5 holder a standard gap below it; a 1.5 stem |
| help | ring r 6.5; an r 1.5 hook, a standard gap from the ring; info's ⌀1.5 dot and stem gap |
| bookmark | 9 × 12.5, r 1.5 top corners; a 61° notch to 8, 12 |

Notes:
- The lint samples `rect` as square-cornered, so mic's capsule is a path; a rect with a
  large radius near another shape measures too close.
- Audit: send reads −16% by hull (a triangle, like pencil's diagonal) and mic −10%; image
  is the densest (+16%).

**Owner, same day:** rotate still needs work (look at reset's arrow); a different design
for the plus beside sparkle; the star is too round; the heart is not heartlike.
Candidates are on the Exploration sheet (round-3 rotate candidates removed):
- **Rotate:** reset's arc is a near-full circle (318°, r 5.59 at 8, 8), with its head at
  the circle's upper corner. A square inside a mirrored reset collides with the head's inward barb, so a
  search placed the arc, head and square on the gap scale (37 layouts). The candidates:
  - A: a 300° wrap (r 5.7) round a 5px square, 2.5 head (gaps 1.99, 1.41);
  - B: reset's own arc mirrored round the square, 2.25 head;
  - C: reset's arc and 3px head as a half-wrap over the square (Figma's layout; 1.91, open);
  - D: reset mirrored with no square, like Fluent's and Lucide's rotate (it duplicates refresh).
- **Sparkle:** A, a small solid sparkle (a stroked one this small leaves a pinhole); B, a
  ⌀2 dot; C, a small sparkle and a dot; D, one larger centred sparkle.
- **Star:** B, sharp tips (r 0.5) and valleys; C, slimmer (0.42) with r 0.25 valleys; D, a
  fuller 0.5 ratio with r 0.75 tips. Tips under 60° need `data-acute="sharp"`, which
  the owner must approve (as for flash).
- **Heart:** C, a deeper cleft with straight sides and an 80° point; E, convex sides and a
  90° point; F, convex sides and a 70° point. The current heart's lobes are under a
  semicircle, so it reads as a shield.

**Owner, round 2 (same day).** Chosen and applied:
- flash stays the sharp classic bolt; hide stays the closed eye; text stays the T with
  ticks and a foot; layers stays three stacked layers;
- sparkle is D, one larger four-point sparkle centred at 8, 8 (the satellite plus is gone);
- star is D: a 0.5 inner ratio with r 0.75 tips and r 0.25 valleys (53° tips). The fillets
  are arcs, so it needs no `data-acute` exception;
- rotate is B: reset's own arc (r 5.59 at 8, 8) mirrored, a 2.25 head, a 5px square at
  8, 8.5. The owner asked for the square to be more centred. Neither centred layout holds:
  - a concentric arc (centre 8, 8.5) brings the head's inner barb to 0.82px from the square;
  - a smaller square (h 2) at 8, 8 leaves a 1.7px blot of a counter;
  - a square at 8, 8 needs h 3 for a standard gap, which also meets the barb.
  The square stays 0.5 low, the only layout on the gap scale with this head.

Open, on the Exploration sheet:
- **Heart**, deeper clefts: G (lobe centres 2.75 apart, r 3.25), H (3 apart), I (deep, 90°
  point), J (deep, 60° point), beside round 1's E and F;
- **Book**: A follows the owner's reference (arched pages over a cover whose bottom curves
  down to the spine, tight gaps 1.34); B is one page each side with the top and bottom both
  arched (a McDonald's-arch M); C has arched tops and a gentler bottom.

**Owner, round 3.** Heart follows Fluent's heart: r 2.83 lobes at 5, 6 and 11, 6, a 45° V
cleft to 8, 4.5 and straight 45° sides to an r 0.5 point at 8, 13, all on the lattice
(ink 13.1 × 11.2, 0.23 high; a lower shift leaves the lattice). Book: A and B kept; A2–A4
lower the pages toward the cover's size (page bottoms raised at the spine to keep the
tight gap to the cover); C dropped.

**Owner, round 4.** Book is B: one page each side, the top and bottom both arched
(M8 5.5 C7.5 3.3 4 2.5 2 4 V11.5 C4 10.2 7.5 10.8 8 13, mirrored; the spine a cut).
Book candidates removed; the Exploration sheet is empty.

**Optical balance review (owner: folder beside info reads unbalanced).** Sources: Cursor
(minoradventures.co, "The making of Cursor's icons": four keyline shapes, circles drawn
larger than squares to look equal); Streamline ("Grids and key shapes": key shapes are
sizes to reach, and a horizontal rectangle takes the circle's width); the blur test.
Finding: the x.5 edge rule puts square icons at 12.1 ink and horizontals at 12.1 wide,
while rings fill 14.1. Rings run about 16% larger than squares; Cursor's ratio is about
8% (14 : 13). Proposal pending the owner: rings at r 6 (ink 13.1) and horizontals 13.1
wide, keeping squares at 12.1.

**Applied (owner: "do the changes from the audit").**
- Rings r 6.5 → r 6 (ink 13.1): info (stem 7.5–11, dot 4.625), help, clock, token (inner
  ring r 3, standard), status-available. Audit: +16% → +7%.
- Horizontals to 13.1 wide: folder 12 × 10 on the centre-line (1.2 : 1, nearest the 11 × 9
  proportion the owner liked; tab to 7, 3, a 45° step to 8.5, 4.5, flap cut at y 6), mail
  and panel-left 12 × 9, list 12 long.
- eye-off up 1 (centre 9.25 → 8.25; the lid carries the mass). Text's bar 11 and foot 5
  (was 10 and 4). Send's back corners at 2, 1.5 and 2, 14.5, notch 4.5: −16% → −14%,
  ink centred 8.11 toward the tip (a triangle's mass sits at its base).
- `--report` flags icons more than 1.5 under their keyline. Remaining: line glyphs
  (check, chevron, more), corner, dismiss, settings (dense, 1px inside by design), lock
  (1.88) and reset (1.7).

## Batch 7: controls and system, 2026-09-25

Toward a full set (108 icons with derived variants). New drawings:

| Icon | Construction |
|---|---|
| menu | three 11px lines at y 4, 8, 12 (open gaps; the middle line must sit on 8) |
| grid | four 4 × 4 squares, r 1, 3 apart (standard) |
| more-vertical | more-horizontal turned 90° (`data-rotations`) |
| play | a triangle 3–14.5 × 1.5–14.5, fillets r 1.25 (back) and r 1 (tip); −12% by hull like send |
| pause | two 3 × 12 bars, r 1, 3 apart |
| undo / redo | reset's 3px corner head at 2.5, 5.5 on a line that turns down an r 4 arc; redo mirrors it |
| sun | an r 2 disc; eight 1px rays from r 5 to r 6 (standard gap), diagonals through the centre stay on the lattice |
| moon | Lucide's construction: an r 6 disc bitten by an r 6 circle at 14, 2; tips at 8, 2 and 14, 8 meet at 90°. A smaller bite (r 4.75) left 0.22px blots at the tips |
| desktop | a 12 × 8.5 screen, r 2; a 2.5 stand and a 5px foot |
| code | two chevrons with 4px legs, 4 apart |
| terminal | panel's 12 × 9 frame; a prompt chevron (2px legs) and a 2.5 underscore (knockouts) |
| error | dismiss's cross, 5px, inside the r 6 ring (tight gap) |
| unlock | lock's body and keyhole; the shackle arc stops at −25° (a standard gap to the body) |
| share | an up arrow (3px head, apex at 8, 2) out of an open box 9 × 6, r 1.5; heavy base, so the ink sits 0.25 high |
| globe | r 6 ring, an r 3 × 6 meridian, an equator; pockets 1.86 (standard). Densest in the set (+40%); a lighter candidate without the equator is on the Exploration sheet |

Deferred: paperclip, tag and people. Their nested strokes need a construction pass to hold
the gap scale at 16px.

**Tooling, same day.** The lint now samples a `rect` with its radius (it had sampled square
corners, which hid two near misses: auto-layout's check, now 1px lower, and flow-free's
lower box, now 0.5 right) and rejects `ellipse`, `line`, `polyline`, `polygon`, `g` and
`use`, which it cannot measure. `scripts/icon-geometry.mjs` (fillets, mirroring) and
`scripts/icon-sheet.mjs` (review sheet, balance strip) replace ad hoc scripts. The skill
has an "Owner preferences" section.

## Batch 8: objects, 2026-09-25

| Icon | Construction |
|---|---|
| attach | three parallel strokes along the diagonal, 3 apart (standard): an r 1.5 inner turn and an r 3 outer turn. Spacings of 3 cannot sit on the 45° lattice (2√2 and 2.5√2 are both near misses), so it is `data-angles="free"`; lengthened once for size (−18% → −11%) |
| tag | Lucide's pentagon on the lattice: 2.5, 2.5 → 7.5, 2.5 → 14, 9 → 9, 14 → 2.5, 7.5; r 2 at the square corner, r 1.5 at the point, r 1 elsewhere; a ⌀2 hole at 6, 6 (standard) |
| people | two r 2 heads a tight gap apart; the front body is person's at width 7; only the back figure's shoulder shows, closed along the bottom a standard gap from the front body |
| zoom-in / zoom-out | search's lens and handle; a 4px plus or minus inside (standard to the lens) |
| flag | a pole at 2.5 and a cloth 2.5–14.5 × 2.5–8.5 with a 3px 90° notch on the lattice; outer corners r 1, notch r 0.5. The first cloth's shallow notch read as a P |
| archive | an 11 × 3 lid, r 1 (a cut in the filled variant); a 9 × 8 box, r 1.5; a 3px slot (knockout) |
| cloud | an r 4.5 and an r 2.5 circle on a flat base at 12.5 (Lucide's construction) |
| phone | a 9 × 13 device, r 2; a 3px home bar a tight gap from the bottom |
| camera | a 12 × 8.5 body, r 2, with a 45° viewfinder bump to y 3; an r 2 lens (tight to the body) |
| cart | a handle into a slanted basket (free angles, filleted), ⌀2 wheels a tight gap below |

**Batch 8, visual pass (owner: paperclip, people, cloud), against Fluent's 16px cuts.**
- People follows Fluent: a front figure (r 2 head, a 7 × 4.5 body with round ends) and a
  back figure with a smaller r 1.5 head (a standard gap from the front one) and only its
  shoulder showing. The domed version read as two "D"s, and equal heads lost the
  front/back order. Candidate B uses person's dome bodies for family consistency.
- Cloud has three lobes, like Fluent: an r 4 dome on r 2.5 side lobes that form a round
  bottom. The two-lobe Lucide cloud read as a blob.
- Paperclip's inner strand is 1 shorter (density +22% → +19%); Fluent's topology matches.
- Flag: candidate B has sharp swallowtail points like Fluent's; applying it needs the
  owner's `data-acute="sharp"` approval, as flash did.
- Tag, zoom, archive, phone, camera and cart hold up against Fluent.
- Gallery: the whole-set tile now sits above the square-celled grid and grows with the set,
  one row per batch labelled "Batch N".

**Batch 8, owner round 2 (2026-09-26).**
- People uses person's parts: an r 2 head and person's dome body (7 × 3.5, r 3 shoulders).
  The back figure is the same drawing offset 5 right and 1.5 up, cut where it passes behind
  the front one by the overlap cut (2.25 between centre-lines, 1.13 of space), as shapes
  does. The cut is solved numerically (every visible point at least 2.25 from the front
  figure's outline).
- Flag's swallowtail points are sharp (`data-acute="sharp"`, owner-approved: "the ends are
  too round"); the notch keeps r 0.5. The cloth is 11 long so the ink stays centred.
- Archive is landscape like Fluent's: a 13 × 3 lid over an 11 × 7 box. The square,
  narrower box with round corners read as a plant pot. The lid's cut stops at its corners.
- Cloud is asymmetric; six candidates on the Exploration sheet after Fluent, Lucide,
  Material, Heroicons, SF Symbols and Phosphor, built from lobes on one base.
- Paperclip: five candidates (applied diagonal, upright on the pixel grid, Fluent's
  proportions, inverted, slim with tight strands).

**Owner, round 3.** Cloud is E (after SF Symbols): an r 2.5 left lobe, a tall r 3.5 lobe left
of centre and an r 3 right lobe on a base at 12.5 (ink 13.1 × 10.1, centred). Paperclip:
eight candidates varying the outer end (e 6.5 to 3) and the inner strand; G and H lengthen
the body so a shorter end keeps the size. Each is recentred on its ink box.
Round 4 (paperclip): the owner wants a longer inner strand and an outer end a little
shorter than G. The inner end must clear the r 3 outer turn on the gap scale: open while it
stops at least 2.03 short of the turn's start (a ≤ 1.97), standard once it reaches within
0.875 of it (3.125 ≤ a ≤ 4); between is a near miss. Candidates I–L on the Exploration
sheet. The lint measures gaps between shapes only, not within one path, so this was
solved by hand.

**Round 5 (paperclip): I applied** (inner end a 1.9, outer end e 4; candidates removed).

## Batch 9: text and objects, 2026-09-26

| Icon | Construction |
|---|---|
| bold | a B: stem at 4.5, r 2.75 bowls (the lower one 1 wider), a middle bar (cut) |
| italic | an I slanted 11 over 3, with 6px serifs (free angles) |
| underline | a U (r 3.5 bottom) and a 9px rule a tight gap below |
| quote | two opening marks: solid ⌀4 drops on whole-pixel centres with r 3.5 tails. Hollow drops read as "66"; a tail that met the drop's edge trapped a 0.18px sliver, so tails start 0.5 inside |
| hash | an upright # on the 0.5 grid |
| at | an r 3 bowl and an r 6 outer arc (standard) with a stem and hook (Lucide's construction) |
| key | an r 3 bow on the 45° lattice, a shaft to 13.5, 2.5, and two teeth 4.24 apart (open); a smaller bow read −24% |
| shield | Lucide's shield: shoulders from a peaked top, sides curving to a point (free angles) |
| gift | archive's lid-and-box on a smaller scale, a ribbon (cut) and two bow loops (tight pockets, satellites) |
| map | three panels folded at 6.5 and 9.5 (cuts), edges sloping 1.5 |
| chart | an L axis and three bars 3 apart (standard), a standard gap above the base; bars alone were the lightest icon (−42%) |
| table | the r 2 frame with a header line, a row line and a column line (knockouts) |

The text glyphs sit at 12.1 tall like text's T, so the toolbar family lines up; the
keyline flag on them is expected.

**Batch 9, owner round 1.** Bold's filled variant (a solid B with a cut middle bar) looked
wrong: a letter fills by weight like the other line glyphs, applied. Candidates on the
Exploration sheet:
- Bold: A, the thin B; C, a solid heavy B like Fluent's (quote's solid exception). A heavy B
  drawn as a thin contour (Phosphor) cannot hold the gap scale at 16px: its waist came
  0.75 from the counters. Fluent's regular bold is itself heavy, so a thin B reads as
  "B", not "bold".
- Key: A applied; B Fluent's round head with a hole and a stepped bit (one outline, blade
  edges on the lattice at x + y = 13 and 18, teeth stepping out to 19); C upright on the
  grid; D horizontal.
- Shield: A applied (Lucide); B Fluent's peaked top and flat shoulders; C a heater
  shield (flat top, sides arcing to the point); D a soft dip at the top.
- Chart: A applied; B three pill bars (circle keyline, 13.6 wide); C a line chart on the
  axis; D a pie with its slice pulled out a tight gap; E a trend arrow with reset's head.
Owner chose: bold C (a solid heavy B, counters on the 0.5 grid, like Fluent's), key A, shield
A, chart C (a line chart on the L axis: 45° segments on the lattice, tight gaps to the axis).

**Owner, round 2.** Bold's walls are even: every stroke of the solid B is 2.5 (the bowls are
circles concentric with their r 1 counters, r 3.5, meeting at a waist at 11.4, 7.96). Its
ink is 9 × 11.5 on the text baseline (bottom at 14, like T), so it sits 0.25 low. Shield:
the owner wants it wider, after Fluent: candidates at 10 (applied), 11 and 12 wide (the
Lucide drawing scaled across). Key: the owner likes the diagonal but not the style;
candidates after the owner's reference (a round head with a solid dot, an outlined blade on
the lattice at x + y = 14 and 19): B with a stepped bit, C with a round tip, D with steps
cut into the upper edge.

**Batch 9, owner round 3.** Bold: "too thick, go with the second one" (Fluent's weight):
a solid B with even 2px walls (counters 3 tall, r 1.5; bowls r 3.5), 9 × 12, centred.
Shield B (11 wide) and key A kept. Map's filled variant (three solid panels split by cuts)
looked poor; it fills by weight. Gift's filled variant gets a cut under the lid. Quote
candidates: A opening drops (applied), B closing drops (Fluent filled), C closing marks
with hollow heads (Fluent regular; tails start 0.5 inside the ring, which clears a 0.18px
sliver), D Lucide's blocks, E a block-quote bar with text lines (Notion).

## Batch 10: editing and devices, 2026-09-26

| Icon | Construction |
|---|---|
| strikethrough | an S as two r 2 quarter-hooks (Lucide) a tight gap either side of an 11px rule (2.25 failed at 1.5px) |
| heading | an H, 9 × 11 |
| list-bullet | ⌀2 dots at 3, 4 / 8 / 12, a standard gap from 7px lines (a numbered list's numerals cannot read at 16px) |
| wifi | three 86° arcs, r 3.5 / 6.5 / 9.5, 3 apart (standard), and a ⌀2 dot |
| bluetooth | the rune on the 45° lattice, spine 2–14 at x 8; r 0.5 fillets (r 1 cut the spine back, −25%) |
| battery | a 10 × 7 body, r 2, and a 3px terminal a standard gap to the right |
| plug | two prongs, a U body (r 4.5) and a cord |
| power | an r 5.5 arc open ±45° at the top, a 5.5 stem (open gap to the arc ends) |
| printer | Lucide's: a paper tray on top, a body whose lower edge runs into an output sheet |
| headphones | an r 5.5 band into two 3.5 × 4.5 cups (Lucide) |
| video | a 9 × 8 body, r 2, and a lens trapezoid (free angles) |
| inbox | a trapezoid tray (filleted) with a dipped front edge (a cut) |

**Filled review, 2026-09-26.** Cursor (minoradventures.co): filled icons are solid shapes
with interior details knocked out of the fill, separations keep a minimum gap, and only the
icons the product needs get one. Area matches the construction; it differs in giving every
icon a filled variant and in filling line glyphs by weight (1.5px), which Cursor does not
describe. Reviewed all 143 with `icon-sheet.mjs filled` (outline beside filled at 16 and
32px). Fixed:
- headphones: the band and cups were one closed shape, so the fill made an arch; only the
  cups fill now, the band stays a line;
- printer: the output sheet merged with the body; a `gap` (M4.5 11 V9 H11.5 V11)
  separates it;
- gift: a cut under the lid (with the ribbon's cut);
- map and bold (earlier): fill by weight / stay solid.
Quote A kept (candidates removed). Battery's body is 10.5 wide, so its terminal sits a
tight gap (2.5) from it.

**Owner questions, 2026-09-26.**
- Globe: A (ring, meridian, equator; applied) or B (no equator; reads as a lens). Fluent's
  two latitudes (C) cannot hold at 1.125: they leave 0.99px pockets at the ring.
- Battery: the terminal moved from 3 to 2.5 (the tight step). Candidate B attaches a solid
  nub, as Fluent does.
- Bluetooth: redrawn sharp (`data-acute="sharp"`, sharp by nature like flash and flag);
  the r 0.5 fillets read as a soft "B".
- Strikethrough: Lucide splits the S into two hooks (A, applied); Fluent, Phosphor and
  Heroicons draw a full S whose bowls meet the rule (B, r 2.75 bowls tangent to the rule).
- Fluent references: the gallery compared against Fluent only for icons in its Fluent map,
  which batches 5–12 never joined. `gen-icons.mjs` now generates FluentRef<Name>Icon and
  its filled cut for every newer icon (20px cuts where Fluent has no 16), and the gallery's
  side-by-side, filled and tile plates use them.
- The intermittent typecheck failure is the dev server rebuilding `packages/react/dist`
  (TS7016: no declaration file for `@area/react`) while tsc reads it; rerun once it settles.

## Batch 11: everyday objects, and Batch 12: system and tools

| Icon | Construction |
|---|---|
| thumbs-up / down | a 3 × 7 cuff (r 1) and a filleted hand (free angles); down mirrors up; a `gap` separates cuff and hand when filled |
| smile | the r 6 ring, ⌀2 eyes (tight), an r 3 mouth |
| briefcase | a 12 × 8.5 case, r 2, a handle and a belt (cut) |
| building | a 10 × 12.5 block, r 2, four ⌀2 windows and a door |
| compass | the r 6 ring and a solid needle with sharp tips (a hole when filled); a stroked needle trapped slivers at its tips |
| crop | two L marks on the grid |
| trophy | a cup (r 3.5 bowl), handles that meet the cup at 165°, a stem and a base |
| coffee | a mug, a handle and two steam ticks (tight) |
| database | an r 5.5 × 2 top, walls, a band (a cut with 0.25 lead-ins inside the walls) and a `gap` under the top when filled |
| server | two 12 × 5 units, r 1.5, a ⌀1.5 light each |
| scissors | two r 2 rings and crossing blades on the 45° lattice |
| log-in / log-out | a bracket (r 1.5) and a 3px-head arrow into or out of it |
| keyboard | a 12 × 10.5 body, r 2, five staggered ⌀1.5 keys and a space bar; three keys over a bar read as a face |
| pointer | a filleted arrow cursor (free angles) |
| move | a cross with four 2px heads on the lattice |
| hourglass | two bars and two solid bulbs meeting at 8, 8 |
| loader | an r 6 arc, 290° |

## Consistency pass, 2026-09-26 (152 icons, then 162)

- Optical size (audit, solid shapes): only quote (−15%) and flash (−12%) read small, both
  accepted (quote marks are small in type; flash is the approved bolt); printer and
  building +11%. Line glyphs, triangles and diagonals read small by hull, as recorded.
- Density: globe (+53%, open) and gift (+46%, the bow) are the heaviest; corners and
  square-dashed the lightest, by nature.
- Centring: every off-centre icon is a recorded optical exception (pointed shapes on the
  lattice, heavy bases sitting high).
- Families: person and people share parts; lock and unlock; search and zoom; the r 6 ring
  across info, help, error, available, clock, token, globe, smile, compass; arrowheads 3px
  (rotate and sort smaller by design); ⌀2 standalone dots and ⌀1.5 dots with a stem.
- Radii: r 2 large frames, r 1.5 mid containers, r 1 small parts. Fixed building (r 1.5 →
  r 2) and auto-layout's 4px boxes (r 1.5 → r 1, like grid and the flow family).
- Filled: every knockout and cut is at the icon weight; layer cuts end square, inner
  details round; line glyphs fill at 1.5; sharp shapes only where sharp by nature (flash,
  flag, bluetooth, compass's needle). Fixed headphones, printer, gift, thumbs and database.

**Owner, round (batch 10).** Globe A kept; candidates removed. Battery A with the terminal
closer: 2 between centre-lines (0.88 of space), one step under tight. The 0.5 grid has no
step between 2 and 2.5, so this is an owner-approved exception, `data-gap="close"` (the
lint allows it down to 0.875 on that icon only). Bluetooth B (Fluent's): arms from 3.5 at a
shallow angle to loops reaching 12.5 on the lattice, spine at 8.5, sharp by nature; loops
at 12 left 1.7px pockets. Strikethrough is a letter S built like the other type glyphs: cap
height 2.5–13.5 (T, I, U, H), r 3.5 × 2.75 bowls meeting a 10px rule at 8, 8. T keeps its
serifs; bold stays the solid B.

**Bluetooth B applied:** Fluent's rune scaled to the 2–14 spine: arms from 4, 5 and 4, 11
through the centre (slope 0.75, free angles) to loops at 12, 5 and 12, 11; spine at 8.

## Batch 13: media and commerce, 2026-09-26

| Icon | Construction |
|---|---|
| volume / volume-off | one filleted speaker (2–8); two waves (r 3.5 and r 6.36, tight) or a 3px × |
| music | two r 2 heads an open gap apart, stems and a sloped beam |
| film | the r 2 frame, two rails and perforation ticks (knockouts; 3px cells) |
| credit-card | mail's 12 × 9 frame, a stripe (cut) and a chip line a standard gap from it |
| wallet | a body with a rounded back flap and a clasp; a `gap` under the flap when filled |
| receipt | a strip with a filleted zigzag foot and two lines (knockouts) |
| lightbulb | an r 4 bulb closing into a neck, a 3px base a tight gap below |
| megaphone | a filleted horn (free angles) and a handle hung from its lower edge (an r 2 loop; r 1.5 left a 1.66 pocket) |

**Batches 11–13, owner round (2026-09-26).** Applied:
- volume-off: a 3.5px ×; film after the owner's reference: rails, side perforations
  every 3 and a centre divider (3 × 3 cells); database: the band is an outline stroke and
  both layer separations are filled-only `gap`s run past the silhouette (the cut's lead-ins
  showed in the outline); coffee: three squiggly steam lines a tight gap above a lower mug;
  compass after Fluent: an outlined needle NW–SE, r 0.75 tips, standard to the ring;
  briefcase after Fluent: a split band and a clasp (a hole when filled), handle 6–10;
  thumbs after Lucide: one outline with the cuff divided by a cut (the separate cuff and
  angular hand read wonky).
- `icon-sheet.mjs sheet` now leaves out filled-only gap paths, which it had drawn.
Exploration: megaphone (sound lines are on theme, like sun's rays and wi-fi; the horn
shrinks to 8 wide to make room), receipt (Fluent's roll, and the owner's torn-top
reference; bullets could not fit the 8px text area), lightbulb (Fluent's connected bulb,
and a version with four rays), trophy (Fluent's pedestal, and no handles). The owner's
trophy reference, with handles from a wide rim, left 1.06px pockets at 16px.

**Batches 11–13, owner round 2 (2026-09-26).** Picks: megaphone A (no sound lines),
receipt C (a torn top and Fluent's roll, square keyline), lightbulb B (Fluent's connected
bulb), thumbs A (the Lucide outline), briefcase and compass after Fluent's cuts. Applied:
- film: a square 12 × 12 frame (wider), 3px perforation columns, a 6px frame between;
- coffee: steam as three vertical S curves (one cubic each, ±0.43 bulge, 3 tall, 3px
  apart: standard), after the owner's reference; the mug is 6 tall (8–14) so the steam
  sits a standard gap above it inside the keyline;
- briefcase: body 2–14 × 5–13.5, a taller r 1.5 handle (5.5–10.5, top 2), a straight
  full-width band (a cut) and the clasp on it (a hole when filled). Fluent's band curves
  into the walls; that left a 0.18px sliver at our weight;
- compass: Fluent's leafier needle: tips 4.75 from centre, sides 2, r 0.75 tips and
  r 2.5 side corners; tight (1.31) to the r 6 ring, which keeps the set's ring size;
- database: the filled variant drew the band stroke on top of its own gap, closing it.
  New role `line`: a layer line drawn only in the outline, replaced by a `gap` when filled.
Exploration: trophy with wider handles round a narrower cup (5–11): round, squared
(Fluent's) and open loops.

**Trophy (owner pick E, 2026-09-26).** Fluent's trophy: an r 1.5-shouldered cup 5–11
(2 → 8.5), squared handles out to 2 and 14 (r 1 corners, r 2 back into the cup at y 7;
standard pockets), a stem 8.5–11 and a pedestal base (r 2 top corners, flat foot, 11–14).

## Batch 14: tools and actions, 2026-09-26

| Icon | Construction |
|---|---|
| person-add | people's front figure (head r 2, 7-wide body), up 1; a 3px plus a standard gap from the head |
| history | reset's arc round clock hands (8,5.5 → 8,8 → 10.5,8); the head is the 2.5px secondary size so the hand keeps a tight gap |
| save | a 12 × 12 page with the top-right corner cut (r 1 at the cut, r 2 elsewhere), a shutter and a label (knockouts) |
| bug | after Lucide: a U head (a tight 1.43 counter; a half-disc head closed to 0.93) on an r 1.5-shouldered body, curved legs up and down and straight middle legs; a `gap` parts head from body when filled |
| eyedropper | along the rising diagonal (free angles): a 2.5-wide tube with an r 0.5 tip, a 6px collar line and an r 1.75 bulb |
| paintbrush | a head with r 1 top and r 1.5 bottom corners, a ferrule (cut) and a bristle notch (knockout), a 3-wide round-ended handle |
| puzzle | an 8.5 square (r 1.5) with r 2 knobs on the top and right edges (Lucide's layout) |
| ruler | an upright 7 × 12 bar (r 1.5) with ticks every 3 from its left side, long, short, long (knockouts) |

## Batch 15: off states and objects, 2026-09-26

**Slashed icons.** One slash, 2,2 → 14,14, drawn in front. `icon-geometry.mjs slash` cuts
the shape's outline open where it passes within 2.25 of the slash (an overlap cut: 1.125
of space at 1.125) and drops stubs under 2px; a line that stays a line when filled (mic's
stand) clears 2.5 so it keeps 1px beside the 1.5px slash. The pieces are `line`s (outline
only); the whole shape is a `fill` (filled only), parted by two `gap`s either side of the
slash (0.75 + 0.5625 off its centre-line). New role `fill` in the generator.

| Icon | Construction |
|---|---|
| bell-off / mic-off / video-off | bell, mic and video cut round the slash; video's body narrowed to 2–10.5 so the icon fits the square keyline |
| calculator | an 11 × 12 r 2 body, a display line an open gap above 3 × 2 ⌀1.5 keys (tight gaps; ⌀2 in 2 × 2 read as a die) |
| graduation-cap | a flat diamond board (r 1 corners, side corners solved to reach x 2 and 14), a skirt (r 3.5 × 2 bottom), a tassel from the right corner; a `gap` under the board when filled |
| car | a 13 × 5 r 1.5 body with headlight lines (knockouts), a cabin with sloped pillars (r 1 top corners), wheel stubs; a `gap` parts cabin and body when filled |
| package | an isometric box (r 1 corners, free angles); its Y is a `line`, replaced by `gap`s when filled |

## Batch 16: keys and connections, 2026-09-26

| Icon | Construction |
|---|---|
| wifi-off | wifi's r 3.5 / 6.5 / 9.5 arcs trimmed to ±40° (±43° is 0.35 too wide for the square keyline), cut 2.5 round the slash (a line glyph: the lines stay lines when filled) |
| link-off | link's brackets cut 2.5 round the slash; the bar falls wholly inside the cut |
| cloud-upload | the cloud (up 1) cut open 2.25 round the arrow's stem where it leaves through the foot; filled, the whole cloud with the arrow knocked out through its edge |
| command | ⌘ after Lucide: r 2 loops round a 4px square (line glyph) |
| return | a corner arrow (r 2) with undo's 3px head, on the lattice at y 10.5 |
| backspace | a tag pointing left (45° shoulders r 1, back corners r 2) with a 3px × (knockout) |
| rocket | along the rising diagonal, scale 1.2: a leaf body (r 3 shoulders, r 1 nose), a ⌀2 window (hole), a fin lobe each side after Lucide (the swept edge axis-aligned, on the grid; standard pockets) and a flame line; swept straight fins read as a paper plane |

`.claude/launch.json` keeps one `dev` entry; `autoPort` finds a free port, so `dev-alt` went.

## Gallery cleanup, 2026-09-26

Owner: the gallery overlapped, and recent work should be at the top; everything already
looked at counts as approved (batches 1–15 approved; batch 16 in review).
- **Iconography:** every sheet is a full-width tile that grows with its content
  (`iconSheet` in build.mjs). The sheets sat in fixed grid cells, and at 193 icons each
  spilled over the next. The per-weight lists (four 2×2 tiles) are one Weights sheet of
  strips. Optical balance stays open; the long sheets (side by side, filled, sizes,
  pixels) start closed. Strips wrap to the width.
- **Icons:** In review first (a card per open icon, newest batch first), then All icons
  (`GalleryIconCatalog`, replacing the per-batch whole-set strips `GalleryIconBatchSet<n>`),
  then the approved cards in closed sections, newest batch first. Cards grow with their
  content in their own grid (`.docs-icon-cards`), with a header (name, status for open
  work only), a meta line, and labelled rows: Sizes, 3×, In use. The duplicate row of
  Fluent in components went; Fluent stays on the 3× plates. A link to a card opens its
  section (the gallery script now opens the section holding any linked element).

## Batch 16, owner round (2026-09-26)

- **Slash pattern.** Every "off" icon uses the same slash, `M2 2L14 14`, and a one-sided
  cut (Fluent's and Lucide's): the shape runs up to the slash from below left and stops an
  overlap cut short of it above right. The two-sided cut (batch 15) removed twice as much;
  wi-fi's arcs, whose left halves lie within 3px of the slash, all but vanished, and link
  fell into fragments. Filled, one gap parts the shape above the slash. Mic's capsule is
  too narrow for the slash to run into (slivers), so it stops short on both sides. Bell,
  mic and video off are redrawn to the pattern and back in review. `slashCut` gained
  `oneSided`, drops only pieces the cut shortened (mic's stem is kept whole), and never
  emits zero-length pieces. New role `stroke` (a filled-only line for line glyphs).
- The lint counts overlapping inks (a gap below 0) as a join.
- **Wi-fi off** is wifi exactly (r 3.5 / 6.5 / 9.5 at ±43°, dot at 8, 12.5; circle keyline).
  **Link off** is link exactly; the bar keeps its lower-left half (Lucide's link-2-off).
- **Cloud upload:** the cloud exactly as drawn (not moved up), cut open where the arrow
  leaves through its foot; the arrowhead (2px legs) sits a tight gap from the lobes' inner
  corner. Candidate B keeps the whole cloud with a small arrow inside.
- **Rocket** after Fluent: one outline that flares into a small fin each side near the tail
  (the fins' outer edges axis-aligned on the 0.5 grid), a ⌀2 window, a rounder nose and
  three flame lines, the middle longest. Fluent's fins are separate lobes with ~0.5px
  pockets, blots at this weight; at Fluent's size a flared outline reads boxy. Candidate B:
  small solid fins on the body. Detached solid fins read as corner wedges.
- **Command:** Fluent's proportions, r 1.5 loops round a 5px square. **Return:** r 2.5 corner.
- **Car** after Fluent: an 11 × 6 body, a cabin with near-upright pillars and r 1.5 roof
  corners, mirror tabs where cabin meets body (inks overlap: a join), ⌀1.5 headlights and
  wheel stubs. **Package** after Fluent's box: broad r 2 top and bottom points, the Y, and a
  tape line from the top face's edge that stops a tight gap short of the Y (across the face
  it split it into two near-miss pockets).
- Kbd renders ⌘ ⏎ ⌫ as text in the keyboard font, not icons; command, return and
  backspace are for other UI unless Kbd adopts them (owner's call).

## Batch 17: media and everyday, and owner round 3, 2026-09-26

| Icon | Construction |
|---|---|
| skip-forward / skip-back | play's filleted triangle (2.5–11.5) and a bar a standard gap from its tip; skip-back mirrors it |
| stop | an 11px r 2 square |
| repeat | two r 2.5 rails, each ending in a 2.5px head, their ends a tight gap apart |
| person-remove | person-add's figure and a 4px minus |
| clipboard | an r 2 board whose top runs behind a 5 × 3 clip; filled, a gap round the clip's lower half |
| sticky-note | an r 2 square with its lower-right corner folded (a 4.5px flap, cut when filled) |
| trending-up | chart's zigzag on its own and a 3px corner head |
| shopping-bag | after Lucide: sloped shoulders, a band (cut) and a handle smile (knockout) |

Owner round (Fluent's cloud A, rocket, paintbrush, bug, puzzle; marks; details):
- **Marks and arrowheads** are a few intentional sizes (skill, "Shared parts"): +/− 4px and
  × 3.5px beside or inside a shape (person-add's plus grew from 3; backspace's × from 3);
  arrowheads 5 / 3 / 2.5 (move's heads grew from 2, cloud-upload's from 2 with the head at
  7.75). Rotate keeps 2.25: a 2.5 head reaches its square (1px).
- **Rocket** after Fluent: separate outlined fin lobes on the body sides (the body line runs
  between; tight pockets), the front edge swept and axis-aligned, the rear edge continuing
  the tail; no nozzle; a ⌀2.5 window; three flame lines. Flared and solid fins were rejected.
- **Paintbrush** after Fluent: one outline (r 0.5 top shoulders, r 2 ferrule, round-ended
  handle), a bristle line (cut) and two slots of different lengths a tight gap apart.
- **Bug** after Fluent: a U head (mandibles) on an r 1.5-shouldered body; legs out and up,
  straight, out and down with r 1 elbows.
- **Puzzle** after Fluent: an 8 × 8 piece (r 1), r 1.5 knobs on 0.5px necks top, bottom and
  left, an r 1 socket right. Knobs centred on the edge (no neck) read as a blob.
- **Mic off** after Fluent: the capsule runs into the slash like every shape. The sliver it
  leaves under the slash is an owner-approved exception, `data-counter="sliver"` (the lint
  skips counters for it).
- **Calculator:** display and key rows evenly 3.25 apart. **Car:** mirrors at y 4 on the
  pillars, a tight gap above the body (now 6.5–12).
- Cloud upload A kept; the exploration candidates are gone.
- **Round 4 (owner):** rocket kept (separate fins). **Car:** mirrors down to y 4.5 on the
  pillars, the body from 7 (cabin baseline with it) so they keep a tight gap. **Puzzle** after
  the owner's reference: a 9.5 square (r 1) with ¾-circle knobs (r 1.5, centres 1 beyond the
  edge, a 2.24 neck) out on the top and left and the same as sockets into the right and
  bottom, so the piece fills the keyline. **Move:** 2px heads; at 2.5 the four heads' barbs
  sat 0.3px apart, at 2 they keep a standard 1.7 gap (expand's two 3px heads have the room a
  four-way cross doesn't).
- **Round 5 (owner):** **Puzzle:** half-dome knobs and sockets (r 2, centred on the edge) on
  a 10px square (r 1): knobs top and left, sockets right and bottom. **Bug** closer to Fluent: a
  6-wide body (r 1.5 shoulders, r 3 base), legs as Fluent's curves (top pair out and up, r 2;
  bottom pair out and down, r 2.4 so their ends land on the grid). **Paintbrush:** the bristle
  line at 7.5. **Package:** the tape runs across the whole top face at 0.45 of its depth (a
  tight and a standard pocket; at the middle both were near misses). **Car:** mirrors at 5.5
  sit on the body's top corners (Fluent's); a pixel lower but still apart left a 0.4px sliver.

## Batch 18: add, sync and sensing, 2026-09-26

One pattern for "add to a container" (Lucide's calendar-plus): the 4px plus (the shared mark
beside or inside a shape) replaces the container's lower-right corner, its right and bottom
arms ending on the container's outer edges, and the container is cut open round it (overlap
cut, 2.25). Inside the body there is no room: calendar's band and document's fold leave 6.5
and 7.5 between centre-lines, so a centred 4px plus sits 0.4px from them. Filled, the whole
container fills (`fill`) and the plus is `front`: the generator cuts the fill back round it
by the overlap cut (first drawn as a hand-solved notch; see the audit below).

| Icon | Construction |
|---|---|
| calendar-add | calendar exactly; the plus at 11.5, 11.5 |
| folder-add | folder exactly; the plus at 12, 11 (right 14, bottom 13) |
| document-add | document without its text lines; the plus at 10.5, 11.5, its right arm on the page's edge and a standard gap under the fold (at 12, flush with the bottom, the fold gap was a 2.38 near miss). Filled, the notch turns straight down under the left arm tip |
| cloud-download | the cloud exactly, the foot open: cut 2.3 round a 2.5-head arrow (8, 7.5 → 14) whose head passes through where the foot was (Lucide's open cloud). Upload's layout can't mirror: a head below the foot needs the foot at 9.75, and a head across it leaves stubs. Candidate B on the Exploration sheet keeps the whole cloud with the arrow inside (0.88px from the lobes at best). Filled, the whole cloud with the arrow `front` |
| shuffle | two S-curves (free angles) between rails at 4.5 and 11.5 with horizontal ends; the rising one runs whole, the falling one is cut round the curve itself: 2.25 in the outline (`line`, 1.14 of space, the overlap cut), 2.5 when filled (`stroke`, 1px at 1.5), as wifi-off and link-off. Heads are 2px, as move's: two stacked 2.5 heads leave their barbs 2 apart (0.875, a near miss); at 2 they keep 3 (standard) |
| fingerprint | after Fluent (owner round): ridges 3 apart round 8, 9.5: an r 1.5 core loop (legs to 14 and 12.5), an r 4.5 ridge wrapping it with its right shoulder broken off into a short leg, and an r 7.5 cap broken right of the top; breaks are 3 between ends (line glyph) |
| gauge | an r 6 arc round 8, 9 open 42° below the horizontal (ends at y 13, ink centred), Fluent's inner scale (r 3, parted 2.5 round the needle so the filled line keeps 1px, its ends open 2.6 at the bottom) and a needle on the rising diagonal, a tight gap short of the arc. Candidate B on the Exploration sheet has scale ticks instead |

## Batch 18 owner round and whole-set audit, 2026-09-26

Owner: the shuffle crossing should match the other overlaps; fingerprint more like Fluent
(more detail, not dense); more detail on the gauge; puzzle knobs taller, like Fluent's; then
an audit of the whole set for cohesion, with the rules and skill updated to hold it.

- **Puzzle:** knobs are Fluent's (an r 1.5 dome on a 0.5 neck, 2 tall and 3 wide on the
  centre-line) instead of an r 2 half-dome; sockets unchanged. A 1px neck (2.5 tall) read
  closer still but overflows the square keyline by 0.4.
- **Audit method:** `icon-sheet.mjs filled` for every icon, a feature dump of every slash,
  arrowhead, circle, rect, arc radius and role, and the lint's gap list.
- **Consistent already:** the slash (all five `-off` icons share `M2 2L14 14`); arrowhead
  sizes (5 / 3 / 2.5 and the recorded exceptions); rings r 6 at 8,8; lenses r 5; hubs and
  pupils r 1.5; container radii 2 / 1.5 / 1; the figure (person-add, person-remove and
  people share one small figure); folds 4.5 (document, sticky-note); overlap cuts 1.13 in
  people, shapes and the slash icons; an arrow a tight 1.38 from its tray or box.
- **Fixed:**
  - *Filled clouds* lost every part of the arrow outside the cloud (a knockout has nothing
    to cut there): upload's stem, download's head. New role `front`: a line over a solid,
    kept at the filled weight, with the solids cut back round it by the overlap cut
    (a halo stroke of 4/3 + 2 icon weights in the mask). The container-add icons use it
    too, replacing the hand-solved notch. The lint now fails a knockout that leaves its
    solid.
  - *Shuffle* was cut round a chord of its curve (1.47 of space); it is now cut round the
    curve (1.14), like every crossing.
  - *Dots* were ⌀2 in building, smile and tag but ⌀1.5 in calculator, keyboard, server,
    car and opacity for the same job (a detail inside a shape). All are ⌀1.5 now, re-seated
    on the gap scale: building's windows at 6.25 / 9.75 × 4.75 / 8 and its door 0.5 taller,
    smile's mouth ends at 5.25 / 10.75, y 9 (eyes unchanged), tag's eyelet at 5.75, 5.75.
    The lint allows r 1 and r 0.75 only; quote's marks and rocket's window are
    `data-dot="free"`.
  - *Wallet's* solid was an open path; filled, it closed with a chord and left a wedge on
    the flap. The solid is now the closed silhouette, the flap edge a `line`, the clasp at
    y 10 (a standard gap from the body, open from the flap).
- **Codified** (skill: Shared parts, Families, Filled variants, Review checklist):
  attached parts join and crossings are overlap-cut, with copy's stack as its own pattern;
  mark placement (beside a figure at head height, on a container's lower-right corner,
  inside a lens); off states (the shared slash, or `data-off="own"`: eye-off, volume-off,
  enforced by the lint); the two dot sizes by role; the fold; the figure; the arrow-to-frame
  gap; grouped functions reuse their base exactly.
- **Tools:** `icon-sheet.mjs` didn't define `--area-weight-icon`, so every filled line on a
  review sheet (4/3) and every halo rendered at 1.125: filled line glyphs looked like their
  outlines. The sheet defines it now; `filled-large` adds a 64px row; the filled mode makes
  its cache folder in a fresh checkout.
- Back in review: puzzle, building, smile, tag, wallet, cloud-upload.

## Batch 19: open, add and devices, 2026-09-26

Drawn after the audit, each from its family (skill, Families).

| Icon | Construction |
|---|---|
| chat-add | chat exactly; the 4px plus on its lower-right corner at 11.5, 9.5 (container-add pattern, `front` when filled) |
| cloud-off | cloud exactly and the shared slash, cut one-sided (2.25); filled, the whole cloud parted by bell-off's gap above the slash |
| folder-open | folder's back (tab, left side, r 1.5 corners) and a front panel slanted 1 : 2 (Fluent, Lucide): the front's top edge at 7.5 runs to 14.5 (r 1 corner, ink centred), its left side a stub a tight gap (1.375) from the back's left side; the back's right side meets the front's top edge. Filled, one silhouette parted by a gap along the front's top and left edges |
| mail-open | the flap up (Fluent's mail_read): a roof over mail's body (r 1 at the peak and shoulders, r 2 at the bottom) and mail's crease (slope 1 : 2, r 1.5) lowered to 7.5 as the letter's fold (`cut`) |
| timer | a stopwatch: an r 5.5 ring round 8, 9, the crown joined on top (a stem and a 3px bar, an attached part), a button on the rising diagonal from the ring (x + y = 17) and a hand a tight gap short of the ring (knockout) |
| laptop | an 11 × 7 screen (r 2, desktop's) and a base 1 wider each side, a standard gap below; horizontals on whole pixels to centre on 8 |

Bell-ring was left out: the bell's dome reaches y 2 and its sides 2.5, so ringing arcs a
tight gap outside it fall beyond the 1.5–14.5 live area.

## Owner round on batches 18–19, and batch 20: devices, 2026-09-26

- **Cloud download:** A (the arrow leaving through an open foot) kept, as cloud-upload's
  construction; the candidates are gone.
- **Fingerprint** (still not right after the first redraw) now follows what makes Fluent's
  read as a finger: the ridge ends curve in toward the bottom like a pad, instead of
  dropping straight (which read as arches). Round 8, 8.5: an r 1.5 core loop whose left leg
  curves in and whose right leg flicks out; an r 4.5 ridge whose left leg curves in, ending
  high on the right, with its lower right as a short separate piece; an r 7 cap broken right
  of the top (2.5 from the ridge, tight). Gaps between converging ends are solved by
  sampling (1.47 and 1.52, so the filled line keeps 1px). Ink centred at 7.76. Two other
  drafts (Fluent's hooks at standard spacing; Fluent's density at 2.5 spacing) had
  converging ends that closed below 1px and were dropped.
- **Gauge:** open. The Exploration sheet has A (the inner scale, in the set) and five more:
  B the owner's split arc (a semicircle on short feet, parted round a tapered needle that
  reaches it, overlap-cut), C the owner's ticks and hub thinned for 16px (a 270° arc, three
  1px ticks, a ⌀2 hub and a needle at −35°, solved so every gap is on the scale; five ticks
  left the needle a near miss from two), D Fluent's top speed (ticks on the left half and
  top, a tapered needle), E a dial (the ring broken where a tapered needle points out) and
  F the arc with a tapered needle alone. Tapered needles are solid wedges (an r 1.25 base,
  a tip the line's half width), like quote's solid marks.
- **Laptop** redrawn after Lucide: the screen (10 wide, r 1.5 top corners) stands on a
  keyboard deck whose sides slant out 1 : 2 to a 13-wide base (r 1); the hinge is a cut.

| Icon (batch 20) | Construction |
|---|---|
| tablet | Fluent's landscape tablet: 12 × 9 (r 2) with phone's 3px home bar, 2.5 above the edge |
| tv | desktop's screen (12 × 8.5, r 2) over a 6px bar a tight gap below (Fluent) |
| watch | an 8 × 7 body (r 2) with 5-wide straps (r 1) joined above and below, 3 tall so their pockets are standard; filled, a gap parts each strap from the body (clipboard's clip) |
| mouse | an 8 × 13 pill (r 4) with a wheel a tight gap below its top (Fluent has no mouse) |
| speaker | phone's body (9 × 13, r 2) with an r 2 woofer (knockout) and a ⌀1.5 tweeter (hole), standard gaps (Fluent's speaker box) |
| hard-drive | Fluent's drive: a box (r 1.5) under a top slanting in 1 : 2 (laptop's deck slope, r 1), the divider a cut, a ⌀1.5 light |
| chip | an 8 × 8 body (r 1.5), two attached pins a side 4 apart (at 3 apart they sat a 1.65 near miss from the ring), the r 1.5 hub ring as a knockout |

## Owner round on batch 20, and batch 21: checks and charts, 2026-09-27

- **Gauge:** B (owner): a semicircle (r 6 round 8, 10.5) on 1px feet, parted round a tapered
  needle (a solid wedge from an r 1.25 base at 8, 11 to a tip on the arc at −60°); the arc
  stops 1.26 short of the wedge. The other candidates are gone.
- **Chip:** three pins a side (owner), 3 apart at 5, 8, 11, on a 9 × 9 body (r 1.5) so the
  pins keep a standard gap and the hub ring a standard gap from the body; pins 1.5 long.
- **Folder open** relates to folder (owner): folder's left side, tab, top edge, r 1.5
  corners and right side at 14 exactly; the right side runs on down the front's 1 : 2
  slant (r 1 at the turn, r 1.5 at the bottom). The front's top edge at 7.5 and its left
  edge run as one line to the bottom edge (owner: all the way down), meeting it at 5.25
  (a 63° corner, clear of folder's bottom-left). Filled, that line is a cut.

| Icon (batch 21) | Construction |
|---|---|
| calendar-check | calendar exactly; the small check (arms 1.5 / 3) with its vertex at 10, 13, 0.5 inside the corner (on the corner its tip sat a 2.38 near miss under the band); `front` |
| document-check | document; the small check's vertex at 9.5, 13.5, its tip on the page's edge (document-add's inset); `front` |
| person-check | person-add's figure; the small check beside it (vertex 11, 8), 1 lower than the plus so it clears the head (1.35) |
| shield-check | shield; status's check (2 / 4) knocked out |
| bar-chart | chart's axes and three bars 3 apart rising to the right, a tight gap above the axis |
| pie-chart | the r 6 ring and two radii marking a quarter (a cut when filled) |

Cloud check and clipboard check were left out: a check inside the cloud or the board sits
under a tight gap from its lobes or edges at either check size (cloud download's B showed the
same).

## Owner round, 2026-09-27: filled marks, keyboard, repeat

- **Filled marks are negative space** (owner). The `front` role (a mark drawn black over the
  fill with an overlap-cut halo) made the plus, check and cloud arrows read as outlined
  stickers, unlike every other filled detail (keys, tape, text lines). They are knockouts
  again: calendar-add, folder-add, document-add, chat-add, calendar-check, document-check,
  cloud-upload, cloud-download. A container mark's arms end on the outer edge, so the
  cut-out reaches the silhouette exactly; a cloud's arrow runs out through the cloud's
  bottom edge as a notch (upload's stem and download's head tip beyond the edge are not
  drawn). The `front` role is removed; the lint now fails only a knockout that never
  enters a solid.
- **Keyboard** after Fluent: the square frame with three and two dots read as a face. A
  13 × 10 frame (r 2), a row of four ⌀1.5 keys and a staggered row of three (2.625 apart,
  rows 2.5 apart, tight gaps throughout, as dense as the frame allows at 1.125) and a 7px
  space bar at 10.5.
- **Repeat** after Fluent's loop: two rails at 4.5 and 11.5 (shuffle's) with r 3.5
  half-circle ends round 5.5 and 10.5; each rail starts on its end 20° off the axis and
  runs round and along to a 2.5 head (tips at 12.5 and 3.5, on the lattice), a tight 1.42
  from the other rail's start. With the heads at the middle their inner barbs sat 0.88
  apart.

## Owner round on package and graduation cap, and batch 22: everyday UI, 2026-09-27

- **Package:** the filled tape gap ran on past the V into the right face and out through
  its edge; it now stops where the tape meets the V (as the outline's tape line does).
- **Graduation cap** after Fluent's filled cap (owner): the skirt is solid (an open path
  whose chord runs inside the board), and the gap under the board is offset down by half
  a gap so it parts board and skirt without shaving the board's own edge. Centred on the
  board's lower edge it thinned the board and left the skirt as an outline.
- **Layout:** a cut starting on another cut is a `line` plus a `gap` extended at its free
  end only; a cut extends 2px at both ends, and layout's sidebar poked up into its header.

| Icon (batch 22) | Construction |
|---|---|
| add-circle, remove-circle | the r 6 ring with a 6px + / − knocked out; a 5px + (error's size) ends a 2.38 near miss from the ring, while error's × reaches further along its diagonals |
| prohibited | the ring and a diagonal between its 45° points, top left to bottom right (the slash's direction), knocked out |
| chevrons-up-down | two 3.5-leg chevrons, open (5) between them |
| collapse | expand's shafts with its 3px corner heads at the inner ends |
| trending-down | trending-up mirrored (`flipy`) |
| alarm | an r 4.5 ring round 8, 9 with a hand (knockout), bells on the corner diagonals a tight gap off the ring, legs joined on the 45° radii; ink 0.25 low (whole-pixel steps keep every diagonal on the lattice) |
| git-branch | r 2 nodes (solid) at 4.5, 11.5 and 11.5, 4.5, a trunk into the lower node's top, the branch curving into its side 5° low (at the side it sat 1.7 from the trunk) |
| grip-vertical / grip-horizontal | 2 × 3 ⌀2 dots 4 apart; horizontal as a quarter turn |
| activity | a pulse with one peak up and one down (r 1 peaks, r 0.5 shoulders), free angles |
| layout | an 11 × 11 frame (r 2) with a header (cut) and a sidebar (line + gap) |
| percent | two r 2 rings and a diagonal a standard gap from each (superseded: upright O's and a steeper slash, owner round on batches 24–25) |

## Owner round: negative space on the outline's lines, 2026-09-27

Owner: the filled variant's negative space must follow the exact shapes and lines of the
outline. Rule (skill, Filled variants): every cut and gap runs on the outline stroke's own
path, centred, at the icon weight, and only where that line has fill on both sides; where
the line is the outer silhouette the gap stops at the other part's ink edge. Offset gaps
(the cap's, the bell's, the clipboard's) sat beside the line; full-width gaps laid on a
silhouette edge left an anti-aliased seam (the cap's board edge, the bell's base).

- **Graduation cap:** the gap is the board's lower edge (its r 1 bottom corner included)
  between the skirt's ink edges.
- **Bell, bell off:** the gap is the base line across the clapper (5.44–10.56); the clapper
  is its outline size again (the gap below the base had shrunk it).
- **Clipboard:** the gap is the clip's outline where it lies over the board.
- **Car:** the body's top edge under the cabin only. **Watch:** the body's edges across the
  straps only.
- Already on their lines: package, database, layout, printer, wallet, the slash icons.

## Batch 23: communication and text, 2026-09-27

| Icon | Construction |
|---|---|
| call | Fluent's handset. Its centre-line is the midline of Fluent's two contours (sampled in a headless browser; the contours sit a constant 1.0 apart), smoothed with a 7-point moving average, fitted with 24 Catmull-Rom cubics and scaled 0.97 about 8, 8 to sit inside the square keyline at 1.125. A band between two arcs (r 6.5 / 10.5) read as a bent pipe: a handset needs its lobes |
| reply / forward | undo's 3px head on a shaft that turns down in a quarter circle (r 4.5); forward mirrors it |
| sync | two of reset's arcs (r 5.59 round 8, 8) with reset's corner head, a half turn apart; each arc runs to the horizontal, a tight 1.44 from the other head (at −10° it sat a 2.38 near miss) |
| eraser | a block on the rising diagonal (r 1 corners, on the lattice), a sleeve line (a cut when filled) a tight gap above a baseline drawn from its bottom corner |
| text-align-left / -right / -center | menu's lines at 4, 8, 12: left 8, 11, 6 long; right mirrors left; center 8, 11, 6 centred |
| indent / outdent | a 2-leg chevron beside three lines from 7.5 (tip a tight gap from the lines; outdent's arms open) |
| columns / rows | an 11 × 11 frame (r 2) split down the middle (a cut); rows is its transpose |
| calendar-, folder-, document-remove | the container-add pattern with a 4px minus at the plus's centre; the container is cut open round the minus only; knockout when filled |

**Correction, same day (owner):** stopping each gap at the other part's ink edge left the old
stroke showing as a ledge beside the gap (the bell's base, the board's edge, the car's
roofline, the watch's body edges). The filled variant is shapes only: every gap runs the
whole length of its outline line and out through the silhouette, so the parts become
separate layers. Where it runs along outer silhouette, a second gap strip 0.9 outside the
line removes the anti-aliased seam (bell and bell off below the base beside the clapper,
car above the body beside the cabin, the cap below the board beside the skirt). Watch's
gaps cross its body's corner arcs, so no strip is needed; clipboard's gap already exits
through the board's top edge.

## Car mirrors and filled windows, 2026-09-27

Owner: align the mirrors with the bottom of the windshield; check how other filled sets do
it. Fluent's vehicle car puts the mirrors on the body's top line (the windshield's bottom),
protruding past the body's sides; Phosphor's car tabs start level with the windshield's
bottom; Lucide's car-front mirrors spring from the windshield's bottom corners; Material's
directions car has none. Cursor's set is not public. In every filled set the mirrors are
part of the body and the windshield stays negative space (Fluent keeps the cabin as a
line; Phosphor and Material cut the window out).

- Mirrors on the windshield's bottom line (y 6.5), from the pillar to 0.5 past the body's
  side (2–4 and 12–14; ink 13.12 wide, inside the square keyline).
- Headlights at 5 and 11 (y 9.25): the one position a tight gap from the mirrors' inner
  ends, the body's top, side and bottom and the wheels (at 5.25 and 5.75 each was a near
  miss from the mirror or a wheel).
- Filled: the cabin stays a line (the window open, as Fluent's), the body is solid and the
  mirrors merge into it as tabs; the cabin/body gap and its seam strips are gone. A solid
  cabin read as a hat.

## Filled variants against Fluent, 2026-09-27

Owner: drop "gaps run all the way through" (a suggestion) and check every filled variant
against the research. `apps/docs/.cache/cmp.mjs` (a scratch tool, not committed) renders
Area outline, Area filled, Fluent regular and Fluent filled for all 256 icons (222 have a
Fluent reference). Findings:

- Already matching Fluent's construction: details knocked out of solids, equal faces cut
  on the line (package, mail, calendar, folder, folder open, book, laptop), line glyphs
  filled by weight, marks on containers knocked out.
- **A part in front of another keeps its edge; the gap is cut from the part behind:**
  bell and bell off (the gap just below the base, cut from the clapper), graduation cap (one
  line below the board's lower edge, its r 1 corner an r 2.125 arc, cut from the skirt),
  clipboard (one line outside the clip), watch (one line outside the face, cut from the
  straps). Centring these gaps on the line, or running them through, shaved the front part.
- **Zoom in and zoom out:** the lens fills and the mark is knocked out (Fluent's zoom, and
  add-circle's construction); search stays a line glyph, as Fluent's search.
- The sheet tool first rendered each icon in its own React tree, so every mask shared one
  id and all showed add-circle's plus; it renders one tree now.

## Batches 24 and 25: lists, sorting, view and tools, 2026-09-27

| Icon (batch 24) | Construction |
|---|---|
| list-numbered | one family with list-checklist (owner, 2026-09-28): three lines at 5, 8, 11 (9–13.5, a standard gap apart) and a mark on the first and third rows. The 1 (a stem on 4 with a 45° flag, 3–6.5) and the 2 (a 1.25 × 1 elliptical bowl with the S's 30° terminal, a tangent diagonal and a base 2.5–5.25, 9.5–13) are 3.5 tall, a standard 1.88 apart (owner: the numerals' gap was large at 4 tall). Their 45° corners are sharp (`data-acute="sharp"`, owner-approved for the 1) |
| sort-ascending / sort-descending | sort's up arrow (2.5 heads) at 11.5 beside three lines growing downward (3.5, 5, 6.5 long, 3 apart, ending a standard gap from the stem); descending is its `flipy` (Fluent's sort lines) |
| filter-dismiss | filter exactly, with a 3.5px × on its lower-right corner (the container-mark placement, backspace's × size), the funnel cut open round it (2.35 clear). A slash (filter-off) ran almost parallel to the funnel's left side and left 0.2–0.3 slivers, so clear filters takes Fluent's and Lucide's × instead. The × is beside the solid, so it stays a line when filled Filled, the funnel\'s fill is cut open like its outline (its stem ends 2.35 from the ×), so the × keeps a gap from the solid |
| bookmark-add | bookmark exactly with a 4px plus centred inside it (8, 7), knocked out when filled, as zoom-in's plus sits in its lens. Owner, 2026-09-27: the container-add corner placement cut away the bookmark's notched tail, the part that makes it a bookmark; a container whose lower edge is its identity takes the mark inside |
| reply-all | reply with a second head 4 left of the first (tips at 2.5 and 6.5, the only lattice spacing that clears the tight gap: 3 leaves 1.0) and the shaft starting at the inner tip |
| text-cursor | an I-beam: a stem on 8 with r 2.5 serifs curving out to 5 and 11, 2–14 tall (no Fluent equivalent; Lucide's text-cursor) |

| Icon (batch 25) | Construction |
|---|---|
| zoom-fit | a 4 × 4 square (r 1) with move's four heads, legs 1.5 (2 left a 0.9 gap to the square); Fluent's zoom fit |
| paint-bucket | Lucide's and Atlassian's tipped bucket (owner's choice over Fluent's upright one): a 10 × 10 diamond (r 1 corners) with the level line across its widest point, a handle stub through its upper-left wall (3, 3 → 6, 6, attached), and the set's drop (color's, scaled 0.3: r 1.5 with its rounded tip) a tight gap below its right corner. Filled fills below the level only (Fluent's filled bucket: the paint) |
| panel-bottom | panel's frame (12 × 9, r 2) with a 3px pane at the bottom (solid when filled) |
| panel-left-close / panel-left-open | panel-left with indent's 2-leg chevron in the main area pointing in or out (a tight gap from the pane); panel-right-close and -open mirror them |

## Owner round on batches 24–25: mark placement, numerals, percent, 2026-09-27

- **Mark placement is set by the shape, not the mark** (skill, Shared parts, marks):
  inside and centred where a closed shape's interior holds the mark with a tight gap all
  round (ring, lens, shield, bookmark, chat bubble); on the lower-right corner where a band,
  fold or tab fills the interior (calendar, folder, document); beside a figure or an open
  line shape (person, filter, volume). Audit of every mark icon: only chat-add changed. Its
  plus moves from the corner to the bubble's centre (8, 7: 3.5 from each side, 2.5 from the
  top and the tail's baseline), the bubble kept whole; filled, a knockout (Lucide's
  message-square-plus). Folder's interior under its flap is 7 tall and a 4px mark needs 9,
  so folder, calendar and document keep the corner.
- **Numbered list:** both numerals are 4 tall (2–6 and 10–14) and share the sharp
  exception: the 1 is a stem on 4 with a 45° flag (no foot; the flat flag and foot read as a
  typewriter 1, and it was 3.5 tall beside a 4-tall 2); the lines start at 9, an open gap
  from the 2's bowl.
- **Percent:** upright O's, 3 × 4 capsules (rx 1.5, a standard 1.875 counter) at the
  corners, and a steeper slash (later set to Geist's 54°, owner round on numerals and percent) in place of two r 2 rings on a 45°
  diagonal, which read as a ratio sign.
- **Paint bucket:** two candidates on the Exploration sheet (Fluent's upright bucket with a
  hanger through the top; Lucide's handle stub). A bail-handle version read as a second
  circle and was dropped.

## Filled lines beside solids keep the icon weight, 2026-09-27

Owner: thicken strokes only when an icon is strokes alone. Measured in Fluent: paint
bucket's hanger, align left's guide and delete's lid are 1px in both regular and filled;
text align left's lines go from 1 to 1.5. The generator now draws unmarked strokes in an
icon with a solid at the icon weight (no free-end retraction), and the lint's filled-gap
recheck applies only to line glyphs. This changes the filled variant of every mixed icon
(align-left, trash, person-add's plus, panel chevrons, handles and similar); line glyphs are
unchanged. Other owner calls this round: paint bucket C (the handle stub) with the set's
rounder drop; the 2's neck is a curve; filled clear filters is cut open round its ×.

## Owner round: numerals, percent, clear filters, 2026-09-27

- **Clear filters:** the × on the funnel's corner (A) is approved over the shared slash.
- **The 1:** the sharp 45° flag is approved (`data-acute="sharp"`). **The 2** now follows
  the set's letters: the S's elliptical bowl and terminal, a straight diagonal tangent to it,
  a flat base (Geist's 2).
- **Percent:** upright O's approved; the slash follows a standard %: measured on canvas, Geist's
  % slash is 55° and Avenir Next's 58°, so the slash runs 4, 13.5 → 12, 2.5 (54°). The O's
  moved 0.5 in (x 3–6 and 10–13) to sit a standard 1.97 from it (at 2.5 / 10.5 they were a
  2.38 near miss).

## Owner round: the 2 and strikethrough, 2026-09-27

- **The 2** read larger than the 1 at 3 wide: it is now 2.5 wide (2.5–5), a 1.25 × 1.2
  elliptical bowl (centre 3.75, 11.2) with the S's 30° terminal, a straight diagonal tangent
  to it (42°) and a base 2.5–5. The icon's ink sits 0.25 right of centre (8.25): moving the
  lines left to 8.5 leaves a 2.38 near miss from the bowl, and the numerals cannot move
  right on the lattice. Recorded as an optical exception.
- **Strikethrough** takes the overlap rule, as Fluent's and Lucide's do: the S's upper half
  stops above the line (one-sided cut, 2.5 between centre-lines, the slash's clearance for a
  line that stays a line when filled) and its lower half grows from the line. The S had run
  through the line at its spine.

## Batch 26: lists, marks and tools, 2026-09-27

The 2's base now runs to 5.25, a quarter past its bowl's right edge (owner: a real 2's base
reaches at least as far as its curve).

| Icon | Construction |
|---|---|
| checkbox | layout's 11 × 11 frame (r 2) with status-available's 2 / 4 check inside (the mark-inside rule); filled, the check is knocked out (Fluent's checkbox checked) |
| list-checklist | one family with list-numbered (owner, 2026-09-28): the same three lines at 5, 8, 11 (9–13.5) and two beside-size checks (1.5 / 3) centred on the first and third rows, where the numerals sit; a standard 1.79 from the lines |
| bookmark-remove | bookmark with a 4px minus inside at bookmark-add's centre (8, 7); knockout when filled |
| filter-add | clear filters' construction with a 4px plus centred at 12, 12; the funnel cut open 2.35 round it, and its filled fill closed by an arc on the same clearance |
| panel-top | panel-bottom's `flipy` |
| pushpin | Lucide's proportions, upright (chosen for the set's grid over a 45° tilt, which puts every edge off the lattice): a 6 × 2.5 head (r 1), a 3-wide neck (r 0.5 into the head), a curved skirt (a cubic from the neck to the base's side) and a 9-wide base (r 0.5); a needle 11–14.5 that stays a line when filled. The first draft (a 7-wide pill head, 45° flare) read as a plunger |
| palette | Lucide's palette scaled 0.6: a left semicircle r 6, a 6 × 5.5 elliptical top right, an r 3 lobe and a thumb notch (r 1 arcs); four ⌀1.5 wells on the tight and standard gaps from each other and the edge; filled, the wells are holes |

## Batches 27–29: AI and chat, Figma tools, commerce, 2026-09-27

| Icon (batch 27) | Construction |
|---|---|
| arrow-up-circle | the r 6 ring with an arrow inside (3px head, stem 5–11), knocked out when filled (the mark-inside rule; ChatGPT's send) |
| stop-circle | the ring with a solid 4 × 4 square (r 1) inside (owner: ChatGPT's and Fluent's stop); filled, the disc with the square as a hole. A solid exception, like quote's marks: a stroked square inside the ring read as a target. The standalone stop stays an outlined square (solid only when filled). A 5px square sat a 2.42 near miss from the ring |
| compose | open's box (the same open corner) with pencil scaled 0.6 into the opening, its tip inside the box; the pencil is solid when filled, the box stays a line |
| waveform | five bars on whole pixels 3 apart (2, 5, 8, 11, 14), heights 3, 8, 12, 6, 3 (Lucide's audio lines, asymmetric) |
| bot | a 12 × 7.5 face (r 2.5, the full width; owner: wider face, no ears, a taller face with a short stem) with the earlier two 1.5 eye strokes 6 apart (knocked out when filled), and an antenna (owner, after dome lights): a 1.5 stem to an open 3 × 2.5 ring, an ellipse so every extreme sits on the 0.5 grid (an r 1.25 circle would put its sides on quarter pixels). Stem and ring are one path attached to the face (an attached part joins, as clipboard's clip): the ring sits 1.5 above the face, closer than the gap scale allows for separate shapes; a 2.5 stem that cleared it read too long |

| Icon (batch 28) | Construction |
|---|---|
| frame | Figma's frame tool: lines at 4.5 and 11.5 running the whole keyline (2–14), a 7-wide square with 2.5 overhangs; hash's square is 5 with 3 overhangs |
| pen-tool | a nib (flat top 6.5–9.5 at 2, shoulders at 3 and 13, tip at 8, 14), an r 1.5 eye at 8, 7.5 and a slit from the tip to the eye; filled, eye and slit are knocked out |
| hand | Lucide's structure redrawn slimmer (owner: the 2.5-wide fingers read fat; the thumb set the style): four 2-wide fingers (r 1 tips; tops at 3, 2, 3, 4.5) on 5, 7, 9, 11, a palm side at 13 into an r 4 heel, and a thumb on the diagonal lattice (x − y = −7 and −4) with an r 1.06 tip; one path, a line glyph |
| spline | two r 1.5 nodes at 3.5, 12.5 and 12.5, 3.5 joined by an r 7.5 quarter arc (Lucide's spline); nodes solid when filled |
| unpin | pushpin moved 0.5 left (its needle a tight gap from the slash) with the shared slash, cut one-sided. Open: the slash runs close to the skirt and head, so the cut removes more of the pin than on other off icons |

| Icon (batch 29) | Construction |
|---|---|
| truck | side view (owner's choice after comparing Fluent's front truck, Fluent's profile truck and Lucide's), after the owner's box-truck references (the last with a window and a band): a cargo box 1.5–8.5 × 3.5–11.5 (r 1.5 top, r 1 foot) with a band across it at 8 (owner: lower; at 8.5 it would crowd the rear wheel), a cab 8.5–14 from 5, almost as tall as the box, with a round front (r 2.5) and a window in its top corner (a line down from the roof at 11 and across at 7.5 to the front; a 1.31 tight counter), and r 1.5 wheels at 4.5 and 10 joined to the base line. The front wheel sits under the box's back edge, joined to it as in the reference. The body is one path; the cab is 5.5 wide because the window needs 2.5 from the box's edge. Filled, after Fluent's filled profile truck (owner: a truck with no solid only thickened its lines, and gap rings round solid wheels left slivers): the body is a `fill` silhouette with the window wound the other way so it stays open, the wheels' rims merge into it (they stay strokes on top) and their centres are cut out by small gap circles. |
| store | a scalloped awning (three r 2 scallops, r 1 top corners; solid when filled) over a building (r 1.5 foot corners) with a 3 × 3.5 door |
| ticket | a 12 × 9 ticket (r 1.5) with r 1.5 notches, and Lucide's and Fluent's three-dash perforation at 9.5: the outer dashes run into the edges (notches when filled), the middle one a tight gap from each |
| kanban | owner's choice of three: a 12 × 11 frame (r 2) with a header (a cut) and two column lines at 6 and 10 (a line plus a gap run out through the foot when filled). Frame-and-strokes and strokes-only candidates were dropped |

QR code was dropped from batch 29 (owner: later).

## Batch 30: nature and tools, 2026-09-28

| Icon | Construction |
|---|---|
| highlighter | Fluent's marker in three layers (owner: add Fluent's middle layer, then wider): a cup 3–13 (r 1.5 foot corners, open at the top), a collar 4.5–11.5 hanging from it (r 1 foot corners, a tight 1.43 counter) and a chisel tip 5.5–10.5 whose slant (63° at the foot) clears the acute rule; the square keyline (11.1 wide). Filled as Fluent's: three solid blocks (the cup closed across its top by a filled-only `fill`) parted by gaps along the cup's and collar's feet. A two-layer marker (cup and tip) came first |
| flame | one outline (Fluent's single line) with three flames: a tall centre flame whose tip leans slightly right (8.9, 1.8), a shorter flame on the left (tip 4.2, 5.4) and the smallest on the right (tip 12.1, 6.6), notches between, with S-curved sides (owner: more curvy) round an r 5.4-wide base (owner, 2026-09-28); sharp by nature (`data-acute="sharp"`), the circle keyline. A symmetric drop, a two-tongue flame with an inner flame, an upright three-point flame and a right-fanning flame came first |
| leaf | an r 4 round with a 45° point (Fluent's leaf), a vein knocked out when filled and a stem below that stays a line |
| umbrella | Lucide's umbrella (owner: the scalloped canopy needed work): an r 5.5 canopy with a flat underside (solid when filled), a 1px tip above it and a pole to an r 1.5 J handle turning left (owner) |
| snowflake | three arms 12 long at 60° with branch ticks (legs 1.75 at 45°, 4.25 from the centre; owner: 1.25 legs read too small); a line glyph |
| thermometer | a 3-wide tube (r 1.5 top) into an r 3 bulb with a ⌀2 reading, a tight gap from the bulb; solid with the reading as a hole when filled |
| mountain | one peak shaped like Mount Fuji (owner): gently concave slopes from a 12.5-wide base (1.75–14.25; owner: wider, less curved) to a flat crater top 6.5–9.5, and a zigzag snow line meeting the slopes (a tight 1.58 pocket above it); solid when filled with the snow line as a cut. Two peaks (Lucide's) came first |
| anchor | owner's reference: an r 1.5 ring (a standard 1.88 counter), a crossbar (stock) 5.5–10.5 at 7, a standard 1.79 from the arms, an r 5 arc from 8.5 (owner: wider; r 4 first) and a shank that ends at the arc's foot (owner: it need not run past) |
| magnet | a horseshoe (outer r 5.5, inner r 2, arms 3.5 wide) with pole bands at 5.5: lines in the outline, one gap across both arms when filled (a cut on two separate segments left one band uncut) |

Deferred to a later batch: boolean operations (Fluent hatches the result, which does not survive 16px), coins (a coin stack either thins to 0.93 at its sides or copies database's cylinder) and cloud weather (rain or a bolt must cut the cloud's foot, as cloud-download's arrow does).

## Owner round: one list family, 2026-09-28

Owner: list-bullet, list-numbered and list-checklist should look alike. Fluent does the same:
its bullet, number and task lists put their lines on one set of rows with one gap, a mark
beside each line, and the bullet list's lines start further left (a dot is narrower than a
numeral). Area's three now share three lines at 5, 8 and 11 (a standard gap). list-bullet has
a dot beside every line, ⌀1.5 at x 2.75 (⌀2 dots 3 apart leave a 1.0 gap, under tight; the
three dots sit a tight 1.5 apart), its lines 6–13.5 a standard 1.94 from the dots; numbered
and checklist keep lines 9–13.5 beside their wider marks (every line glyph ends at 13.5). The anchor's arc widened to r 5 and
the truck's band moved down to 8 in the same round.

## Owner-delegated decisions, 2026-09-28

- **Truck band stays at 8.** Lower, it crowds the rear wheel (0.4 at 8.5) or needs smaller
  wheels; both read worse than the band where it is.
- **List and text line spacing stay separate.** Lists (bullet, numbered, checklist) keep
  three lines 3 apart so their marks sit beside each line; menu, text align and indent keep
  4 apart. Fluent spaces its lists and its text-align icons differently too. Every line
  glyph ends at 13.5.

## Batch 31: weather, shapes and money, 2026-09-28

| Icon | Construction |
|---|---|
| cloud-rain | the cloud exactly (owner: every cloud one shape), moved up 1.5 (2–11) so the rain has room: three angled rain lines (owner: angled, as Fluent's) hanging from the foot, joined to it (owner: rain touches the cloud), tops at 5, 8 and 11 on the foot, 1.5 across and 3 down to 14, 3 apart (a tight 1.56). Filled, the cloud is solid and the rain stays attached lines at the icon weight. A compact Fluent-style cloud with the rain a gap below it was dropped (owner: the clouds should all be the same shape) |
| cloud-lightning | the same raised cloud, its foot cut open (overlap cut 2.25) round a line bolt that starts inside it and leaves through the foot, `M9 8L7 10H10L6.5 13.5` (legs 2 and 3.5 on the lattice, sharp turns as flash, `data-acute`); the ink sits 0.24 high (a tail to 14 read as a stick). Filled as Fluent's thunderstorm: the whole cloud solid, the bolt in ink, and the cloud cut back one icon weight round it by a `halo` (a filled-only role: the bolt's path, three weights wide, round, in the mask). A bolt hanging from the foot was 3 tall and read as a hook |
| wind | owner's reference, three lines: 5.5 (2.5–6.25, curling up), 8 (5–11.75, curling up) and 10.5 (2.5–10.25, curling down), 2.5 apart (tight 1.38), each curl r 1.75 with its extremes on the 0.5 grid, ending at 200° / 160°, a tight gap from its own line; a line glyph (1.0 at the filled weight) |
| star-off | star kept exactly, with the shared slash cut one-sided; filled as cloud-off (a whole `fill` parted by one `gap` above the slash) |
| qr-code | owner's reference: three 5 × 5 finder squares (r 2) at 1.5 and 9.5, each with a ⌀1.5 dot inside (a tight 1.19), and three ⌀2 dots at 10, 10 · 10, 14 · 14, 14 whose ink spans the same box as the squares, so both rows are even. The circle keyline (14.1 ink): 5 × 5 is the smallest finder that holds a dot a tight gap from its ring. r 2: at r 1–1.75 the ring's corner pockets beside the dot are a 1.68 near miss. Where the dots meet the squares' rounded corners the diagonal gap is 2.14, between standard and open; the owner asked for the aligned rows, so it is declared `data-gap="aligned"` (the lint accepts gaps between 2 and 2.5 there only). Corner brackets were tried and dropped (owner) |
| rectangle | Figma's rectangle tool: 12 × 9 (2–14 × 3.5–12.5, the horizontal keyline), r 1.5 (the shapes radius); landscape so it is not stop's square |
| ellipse | Figma's ellipse tool: the shared r 6 ring |
| coins | two r 4 coins (Lucide's coins without its detail): the front at 6, 6 and the one behind at 10, 10, overlap-cut where it passes behind (a 202° arc). Filled, both are solid, the back one parted from the front by one icon weight of `gap` round the front's edge (clipboard's pattern). An inner rim ring does not fit an r 4 coin (a 0.88 gap at r 2) |

Still deferred: boolean operations (Fluent hatches the result, which does not survive 16px;
Figma's solid result would be a solid exception) and translate (letters need a construction).

## Full set roadmap, part 2 (2026-09-28)

The first roadmap is drawn (313 icons with variants). The set is finished when every product
surface Area targets (ChatGPT, Notion, Figma, the gallery demos) has its icon; the gaps, from
the demos' remaining Fluent imports and the three products' toolbars, menus and inspectors:

| Batch | Icons |
|---|---|
| 32: demo gaps and arrows | arrow-up-right (+ rotations), chevrons-left (+ right), cloud-sun, wand, distribute-horizontal (+ vertical), record |
| 33: Figma tools 2 | line, polygon, component, group, mask, boolean union, subtract, intersect, exclude |
| 34: code and git | git-commit, git-merge, git-pull-request, file-code, braces, variable, function, sigma |
| 35: media and capture | rewind, fast-forward, screen-share, picture-in-picture, images, captions, camera-off |
| 36: windows | window, browser, tabs, minimize, maximize, split |
| 37: documents | document-text, file-zip, file-image, newspaper, library, clipboard-check, divider, code-block |
| 38: money and awards | banknote, bank, barcode, badge, crown, medal |
| 39: people and talk | person-circle, id-card, chat-multiple, call-end, frown |
| 40: nature and science | droplet, tree, contrast, flask, atom, plane, paw |
| 41: type | text-size, line-height, letter-spacing, subscript, superscript, translate |
| 42: keys and effects | shift, option, escape, shadow, blur, stroke-weight |

About 75 icons. Then the swap: demo-level Fluent imports replaced by Area icons, family by
family with the owner's approval, and the Fluent map retired.

Status (2026-09-28): drawn as batches 32–42 (45 icons, 50 with turns and mirrors), all in
review. Batch 43 then redrew thirteen of the dropped ones with one simplification each
(owner: can they be simplified so they fit?): id-card, newspaper, file-image, file-code,
git-pull-request, plane, paw, escape, shadow, blur, line-height, letter-spacing, translate.
Still out: chevrons-left (lattice), atom (rotated ellipses), file-zip (no room for teeth);
covered by existing icons: component, group, the window batch, document-text, divider,
clipboard-check, droplet. The audit cannot size stroke-weight or shadow's band (solids).

## Full set roadmap, part 3: the Cursor references (2026-09-28)

The owner's Cursor sheets were catalogued icon by icon (about 860 cells; the catalogues are in
`docs/research/icon-inventory/`). The build queue is `docs/research/icon-inventory.md`:
109 concepts in batches 44–55 (square and circle containers, the notification dot, corner
badges, agents and AI, arrows, files, code and git, text, data and money, messages, objects),
21 for later and 6 not planned, each with its Lucide and Fluent references and uses. Its
"To settle with the owner" section lists the system questions to answer before drawing
(the notification dot's size, the square container, the agent mark, corner badges,
chevrons-right). `npm run icons:find` searches the queue with Area's icons.

## Batch 32: Demo gaps & arrows, 2026-09-28

| Icon | Construction |
|---|---|
| arrow-up-right | the standalone arrow on the rising diagonal: stem 2.5, 13.5 → 13.5, 2.5 (x + y = 16), a 90° head with 5.5px legs along the axes (`M8 2.5H13.5V8`), Fluent's corner head; turns give down-right, down-left and up-left. At 3.5–12.5 it sat 2.9 under the keyline |
| cloud-sun | Fluent's partly cloudy: the cloud (the one cloud shape, scaled 2/3: lobes r 1.67, 2.33, 2, extremes on the 0.5 grid at 6–14 × 8–14) in front of a sun at 7, 7 (an r 1.5 ring, rays 1 long from r 4, sun's 1 : 2 spacing); the ring and rays stop an overlap cut (2.25) short of the cloud, leaving a 175° arc and five rays up and left. Filled, the cloud is solid and the sun stays a line |
| wand | a stick on the rising diagonal (2, 14 → 7.5, 8.5) and the sparkle scaled to r 2.75 at 11.25, 4.75 (tips on the 0.5 grid), an open 2.76 from the stick's tip: one sparkle, no satellites (owner). Filled, the sparkle is solid |
| distribute-horizontal | Figma's distribute spacing: guides at 2.5 and 13.5 (the align family's guide) and a 3 × 7 bar (r 1, the family's bar) centred between them, an open 2.88 from each; distribute-vertical is its transpose |
| record | the ring with a solid disc inside (r 2.5, an open 2.94 from the ring): a solid exception like stop-circle, declared `data-dot="free"`; filled, the disc is cut out of the solid ring's disc, as stop-circle |

Chevrons-left (a double chevron) was dropped: two 45° chevrons shifted along x keep the diagonal lattice only at whole shifts, and 3, 4 and 5 leave 1.0, 1.70 and 2.41 (all off the gap scale); 6 reads as two chevrons. chevrons-up-down covers the need.

## Batch 33: Figma tools 2, 2026-09-28

| Icon | Construction |
|---|---|
| line | Figma's line tool: one rising diagonal 2.5, 13.5 → 13.5, 2.5 (x + y = 16), arrow-up-right's stem; a line glyph |
| polygon | warning's triangle exactly (r 1.25 fillets, 12.98 × 12.45), without the mark; solid when filled |
| diamond | Figma's instance: a square turned 45° with vertices at 8, 2 · 14, 8 · 8, 14 · 2, 8 (edges on the lattice) and r 1 fillets; 1.7 under the circle keyline by its box, but a turned square reads larger than its box |
| mask | Figma's mask: stop's 11 × 11 square (r 2) with an r 3 ring inside (a tight 1.38); filled, the square is solid with the circle cut out as a hole |
| boolean-union | two 7 × 7 squares (r 1.5) at 2.5 and 6.5 overlapping 3 × 3, drawn as the union's one outline (r 0.5 in the two inner corners, a soft transition); solid when filled |
| boolean-subtract | both squares outlined, the result (back minus front) solid, Figma's convention; the front square's rounded corner bounds the solid |
| boolean-intersect | both squares outlined, the 3 × 3 overlap solid (its two rounded corners are the squares' own) |
| boolean-exclude | the union solid with the overlap left open (a standard 1.93 counter), both outlines drawn through it |

Component was dropped (dots-four is Area's component icon) and group too (square-dashed). The booleans are the second solid exception in the outline style after stop-circle and record: the result has to read as the thing selected, and Fluent's hatching fills in at 16px. Their filled variants equal the outline, except union (solid).

## Batch 34: Code & git, 2026-09-28

| Icon | Construction |
|---|---|
| git-commit | git-branch's r 2 node at 8, 8 with a line out each side to 2 and 14, joined to it; the horizontal keyline (5.12 tall, a line glyph's natural height) |
| git-merge | git-branch's nodes at 4.5, 4.5 and 11.5, 11.5; a trunk from the top node to 13.5 and an r 5 quarter arc from the node's foot into the second node (Lucide's merge) |
| braces | a pair of braces 2.5–6 and 10–13.5, r 1.5 bends and a point at 8 (Lucide's construction); a line glyph |
| variable | Lucide's variable: parentheses (r 6.54 arcs from 5.5 / 10.5 at the ends to 2.5 / 13.5 at 8) round a 4px ×, a standard 1.78 from them (a 3.5px × left a 2.12 near miss) |
| function | an ƒ: a stem at 8 from 4.5 to 11.5 with r 2 hooks to 11, 2.5 and 5, 13.5, and a crossbar at 6.5 (5.5–10.5); the type family's cap height 2.5–13.5 |
| sigma | Σ after Lucide: arms at 2.5 and 13.5 from 6 to 10.5 with 1px serifs down and up at 11.5, the diagonals meeting at 7.7, 8 (r 0.75), their outer corners r 1 fillets (the 54° corners are under the acute limit otherwise); centre 8.23, 0.23 right (a quarter shift would leave the grid) |

Dropped: git-pull-request (its arrowhead must sit on the diagonal lattice and clear the top node by a tight gap; every lattice point either touches the node or runs into the right-hand line) and file-code (two 1.5px chevrons need 7 across; the page's inside is 9 with 2.25 needed from each edge).

## Batch 35: Media & capture, 2026-09-28

| Icon | Construction |
|---|---|
| fast-forward | two triangles 2.5–8 and 8–13.5, 11 tall with 45° sides on the lattice (a 90° tip, r 0.75; back corners r 1), the first's tip joined to the second's back (Fluent); rewind is the flipx mirror. With play's r 1.25 corners the 47° back corners shrank it to 7.4 tall |
| screen-share | desktop exactly with a contained arrow inside (stem 8.5 → 5, a 2.5 head on the lattice), a tight 1.38 from the screen's edges; knocked out when filled |
| picture-in-picture | terminal's 12 × 9 frame (r 2) with a 3.5 × 2.5 window (r 0.5) in its lower right, a tight 1.38 from the frame; filled, the frame is solid and the window a knockout ring |
| images | copy exactly (front 8 × 8 r 1.5 at 5.5, the back sheet's L) with the front showing an image: a mountain cut (image's, on the lattice) and a ⌀1.5 sun at 8.25, 8.25 (a tight 1.44 from the frame, open from the mountain) |
| captions | terminal's frame with two rows of caption dashes at 6.5 and 9.5 (a standard 1.88 from the frame), parted by tight 1.38 gaps (Lucide's captions); knocked out when filled |
| camera-off | camera exactly with the shared slash, cut one-sided; the lens is cut the same way. Filled as video-off: the body a `fill` parted by one `gap`, the lens not drawn |

## Batch 38: Documents, money & awards, 2026-09-28

| Icon | Construction |
|---|---|
| library | Lucide's library: books at 2.5, 5.5 and 8.5 (tops 2.5, 4.5, 3.5), 3 apart (standard), and a fourth leaning from 11, 4 to 13.5, 13.5 (a tight 1.38 from the third at the top); a line glyph |
| code-block | terminal's frame with two 1.5-leg chevrons pointing out (tips at 5 and 11, a standard 1.88 from the frame; the lattice allows no larger pair with a gap between them); knocked out when filled |
| banknote | a 12 × 8 note (r 1.5, the horizontal keyline) with an r 1.5 seal in the middle, a tight 1.38 from its long edges; filled, the seal is knocked out |
| bank | Lucide's landmark: a roof 1.5–14.5 rising 4 to a point at 8, 2.5 (r 1 at the apex, r 0.5 at its 32° eaves; r 1 there pulled it in to 5–11), three columns at 4.5, 8 and 11.5 joined to the roof and to a base at 13.5; the roof is solid when filled |
| barcode | five bars 3.5–12.5 at 2.5, 5, 8, 10.5 and 13.5: gaps alternate tight (1.38) and standard (1.88), the pattern that makes it a code rather than columns; a line glyph |
| award | Lucide's award: an r 4 ring at 8, 6.5 and a ribbon joined under it, legs to 5, 14 and 11, 14 and a notch at 8, 13 (r 0.75 corners); the pocket under the ring is a standard 1.95 (a notch at 12.5 left a 1.68 near miss). The ring is solid when filled |
| crown | a band 2.5–13.5 with three points (4 at the sides, 3 in the middle, r 0.75 fillets: the 53° points are sharper than the acute limit), dips at 8 and r 1.5 foot corners; the ink sits 0.21 low, a heavy base's optical allowance. Solid when filled |

Batch 36 (windows) is covered by existing icons: panel-top is an app window, columns and rows split it, stop is maximize and minus minimize. From batch 37, document already carries text lines (document-text); newspaper, file-zip and file-image need more detail than a 9 × 12 page holds at 16px, divider is minus, and clipboard-check was ruled out earlier (the check sits under a tight gap from the board).

## Batch 39: People & talk, 2026-09-28

| Icon | Construction |
|---|---|
| frown | smile exactly (ring, ⌀1.5 eyes) with the mouth turned over: ends at 5.25 and 10.75 on y 10.5 (a tight 1.16 from the ring), an r 3.25 arc (at r 3 the eyes sat a 1.73 near miss; 3.25 is a standard 1.98) |
| person-circle | the ring with a small figure: an r 1.5 head at 8, 6 (a tight 1.38 from the ring) and shoulders (r 2, 6.5–9.5 at 10, a tight 1.38 under the head) whose sides end on the ring (Lucide's circle-user); knocked out of the disc when filled |
| chat-multiple | a front bubble 2.5–10.5 × 5.5–11.5 (r 1.5) with chat's own tail, and the bubble behind drawn as copy's stack does, an L round its top right (5.5 → 13.5, 2.5 → 8.5), a standard 1.88 from the front; the front is solid when filled |
| call-end | Fluent's hang-up handset: an arch 2.5–13.5 from 5 to 10.5 with two ear pads (r 1 corners) and a shallow inner curve; free angles, solid when filled. The ink sits 0.25 high, as a heavy base does |

Id-card was dropped: a head, shoulders and text lines need more than a 12 × 9 card holds with every gap on the scale.

## Batch 40: Nature & science, 2026-09-28

| Icon | Construction |
|---|---|
| contrast | the r 6 ring with its right half solid (Lucide's contrast, Fluent's half fill): a solid exception like record, the half being the thing it shows; the filled variant equals the outline |
| flask | Lucide's conical flask: a neck 6.5–9.5 from 2.5 to 6.5, sides 60° down to a base at 13.5 (2.5–13.5; r 1 fillets), a lip 5.5–10.5 joined to the neck, and a liquid line at 10.5 wall to wall, a `cut` when filled (Fluent's filled beaker) |
| tree | a crown built as the cloud is (three lobes on a flat foot: r 2.5 at 5, 8.5 and 11, 8.5, r 3 at 8, 5; 2.5–13.5 × 2–11) on a trunk to 14, joined to its foot; the square keyline. An r 4.5 disc on a trunk read as a lollipop or a map pin. Solid when filled, the trunk a line |

Dropped from the plan: droplet (color is the droplet), atom (its orbits are rotated ellipses, which the lint cannot measure; drawn as axis-aligned ellipses it read as a plus), plane and paw (too much detail for 16px with every gap on the scale).

## Batch 41: Type, 2026-09-28

| Icon | Construction |
|---|---|
| text-size | text's T twice: a large one (bar 2.5–9.5 with end ticks to 4.5, stem 6, foot 4–8) and a small one (bar 10.5–13.5 at 7.5 with 1px ticks, stem 12, foot 11–13), a standard 1.88 apart at the feet and a tight 1.38 at the small bar |
| superscript | a 6 × 6 X on the lattice (2.5–8.5 × 5.5–11.5) and list-numbered's 2 (its 1.25 × 1 bowl and sharp foot, `data-acute` as there) raised to 3–6 at 11–13.75, a tight 1.42 from the X (1 when filled: at 11 it closed to 0.91 under the heavier line). The ink sits high by design |
| subscript | the X at 4.5–10.5 and the same 2 lowered to 11–14, a tight 1.59 apart; the ink sits low by design |

Line height and letter spacing were dropped: Figma draws both as a letter between guides with arrows, which at 16px is padding-axis with a letter in it; translate still needs a letter construction.

## Batch 42: Keys & effects, 2026-09-28

| Icon | Construction |
|---|---|
| shift | the shift key's arrow: a head 2–14 from a point at 8, 2 (45° on the lattice) to 8, a stem 5.5–10.5 down to 13.5; r 1 at the point and the stem's foot, r 0.75 at the barbs, r 0.5 in the necks; solid when filled; 0.04 high |
| option | ⌥: a line from 2.5 to 5.5 at 4.5, a free-angle diagonal to 10.5, 11.5 and on to 13.5 (the switch), and a separate bar 9.5–13.5 at 4.5, open from the diagonal; a line glyph |
| stroke-weight | Figma's stroke weight: three bars 2.5–13.5, 1, 2 and 3 tall (fully round ends), open 2.5 apart; drawn as solids, the one icon whose meaning is line thickness, so it cannot use the icon line; the filled variant equals the outline |

Escape, shadow and blur were dropped: the escape glyph is a broken circle with an arrow into it (dense at 16px), a drop shadow drawn as an offset back shape reads as copy, and blur has no outline form.

## Batch 43: Simplified returns, 2026-09-28

| Icon | Construction |
|---|---|
| id-card | Simplification: a solid person (Fluent's contact card). The card uses the whole horizontal keyline (13 × 10, r 2), and a ⌀3 head (r 1.5 at 5.5, 7, `data-dot="free"`) and an r 2 dome of shoulders resting on the card's foot are solids, so no pocket forms under the shoulders (an outlined head and shoulders left a 0.94 pocket; the card is too short for both). Two lines 9.25–12 at 5.5 and 8.5, a standard 1.97 from the head. Filled, the person and lines are cut out of the card |
| newspaper | Simplification: Lucide's curl instead of a cover with a picture. A page 5–14 × 3–13 whose left edge curls under into a flap 2–5 (an r 1.5 turn at the foot, the flap's top joined to the page at 7), and three lines 7.5–11.5 at 5.5, 8 and 10.5 (tight throughout). Filled, the silhouette is a `fill`, the page's edge a `gap` over the flap, the lines knockouts |
| file-image | Simplification: the text lines give way to image's own content. Document exactly, with image's mountain (45° legs on the lattice, an r 1 peak, from the foot at 6, 14 to the foot's corner at 12.14, 13.14) as a `cut` and a ⌀1.5 sun at 6, 7, a tight gap from the edge and the fold |
| file-code | Simplification: the mark moves onto the corner (Fluent's document code, the corner-mark pattern). Document exactly with two 2-leg chevrons (6–8 and 11–13, rows 9–13, a standard 3 apart on the lattice) over its lower right; the page is cut open round them (2.3) and filled with a `halo`, since the right chevron runs past the page. Two chevrons cannot fit inside the 9-wide page (they need 5.25 between tips; the page leaves 4.5) |
| git-pull-request | Simplification: no arrowhead (Lucide's current pull request). git-branch's r 2 nodes at 4.5, 4.5 and 11.5, 11.5, a trunk to 13.5, and a hook from 9, 4.5 (a tight 1.38 from the node) turning down an r 2.5 quarter into the second node. A 2px head on the lattice either touches the node or crowds the hook |
| plane | Simplification: a line glyph after Cursor's plane. One path: a body 3.5, 12.5 → 13.5, 2.5 (x + y = 16), swept wings from 9, 7 to 2.5, 6 and 10, 13.5 and a tail pair from 5, 11 to 2.5, 10.5 and 5.5, 13.5 (each pair mirrored across the body); free angles, wedges only (no counters) |
| paw | Simplification: solid toes. Four ⌀2 dots at 3, 7.5 · 6, 4 · 10, 4 · 13, 7.5 (2 standard, 2.61 open apart) over an r 3.5 pad dome 4.5–11.5 from 8 to 12.5 (r 1 feet), a tight 1.34 from the outer toes. Outlined toes (Fluent's rings) leave blot counters at this size. The pad is solid when filled |
| escape | Simplification: open's arrow in a ring (the Mac escape key). An r 5 ring at 8.5, 8.5 open round an up-left arrow from its centre to a 3px corner head at 2.5, 2.5 (tight 2.5 cut, as open's arrow leaves its box); a line glyph |
| shadow | Simplification: the shadow is a solid band, not a second outline (a second outline is copy). A square 2.5–10.5 (r 1.5) and a solid L 1.5 thick along its lower right (12.5–14, from 5 down and round to 5 along the foot; an r 3.5 inner corner, r 2 outer), a tight 1.44 from the square; a solid exception like the booleans. Its edges are ink edges on the 0.5 grid, so the band does not grow with the line weight |
| blur | Fluent's blur: the r 6 ring's left half and three lines at 5, 8 and 11 from the axis to where the ring would be (standard 1.88 apart); filled, the half-disc is solid and the lines keep the icon weight |
| line-height | Simplification: text's own T between guides instead of arrows (a double arrow's heads meet between guides 11 apart). Guides at 2.5 and 13.5 (2.5–13.5) and a T 6 wide and 6 tall (ticks 1, foot 3), a tight 1.38 from each guide; a line glyph |
| letter-spacing | line-height turned: guides at 2.5 and 13.5 (vertical) and the same T 9 tall (3.5–12.5), a tight 1.38 from each guide (Figma's |A|) |
| translate | Simplification: two letterforms of the icon line (Lucide's languages): a 文 of a bar 2–8 at 4.5 with a stroke above, a down-right stroke and an up-right stroke that climbs into the bar, and an A 8.25–13.75 from 7.5 (r 0.75 apex) with a crossbar at 11.5, a tight 1.25 from the 文; free angles |

File-zip stays out: a zipper needs a column of teeth with tight gaps on both sides, and no column fits between the page's left edge and its fold (1.5 wide at most); a column below the fold holds two teeth. Use archive for compressed files, or a later file-type family with short labels (ZIP, PDF, CSV), as Cursor's file icons do.

## Owner round: detail, the type family and overlap gaps, 2026-09-28

Owner: more detail is ideal; the negative-space minimums may relax for angles and gaps, and
outlined circles may replace dots, as long as each icon reads with its family. The lint now
has a detail gap step (0.875–1.125), tight to 1.75, counters from 1.0, straight corners from
45° and a filled floor of 0.875. The overlap cut stays exactly 1.125.

| Icon | Change |
|---|---|
| bank | columns 6–11.5 on a plinth line (3.5–12.5 at 11.5) over the base (2.5–13.5 at 13.5), a detail 0.88 apart; a ⌀1.5 pediment dot does not fit (0.44) |
| banknote | the note 2–14 × 2.5–10.5 (r 1.5) with an r 1.5 ring and two ⌀1.5 dots (detail 0.94), and a second note's edge at 13 (Fluent's stack); filled, ring and dots knock out |
| crown | the zigzag body (tips and valleys r 0.75, feet r 1.5) with ⌀2 balls over its three points (detail 1.1) and a band at 10.5, a `cut` when filled (Fluent's crown) |
| tree | the trunk runs up into the crown with one branch (`M8 10L10 8`), knocked out when filled so the solid no longer reads as a club |
| paw | outlined toes: four r 1.25 rings (1.38 counters) round a smaller r 3 pad dome, detail gaps 1.0–1.09 |
| plane | Fluent's top-view silhouette pointing right: an r 1.5 nose, swept wings 2.5–13.5 and a tail fin, one closed path filleted r 0.5; solid when filled |
| git-branch, git-merge, git-pull-request | three r 1.5 nodes each (the commit keeps r 2); pull request's hook gains its 2px arrowhead (tip 8, 4, detail 0.88 from the node), branch's curve meets the stem, merge's curve runs to a node at 12, 9.5 |
| cloud-rain | rain lines of three lengths (2, 3 and 1.5 down) |
| qr-code | four dots in the corner square, 3.5 apart (tight 1.5) |
| text-size, line-height, letter-spacing, superscript, subscript | one T construction (Owner preferences, Type family): superscript and subscript use the medium T instead of an X; letter-spacing's T is line-height's |
| cloud-download, file-code, filter-add, filter-dismiss | overlap cuts recomputed with `icon-geometry cut` so each crossing leaves 1.12–1.13 (they were 1.17–1.22) |

## Batch 44: Square containers, 2026-09-28

| Icon | Construction |
|---|---|
| square-dot | the square with an r 1.5 solid dot (a solid exception like record's disc, `data-dot="free"`); filled, the dot is a hole |
| square-slash | the square with a 5px rising slash inside (the inside slash, shared with search-off), not the corner-to-corner off slash |
| square-plus | the square with add-circle's 6px plus, a tight 1.38 from the sides; knocked out when filled |
| square-minus | the square with the 6px minus |
| square-arrow-up | the square with arrow-up-circle's arrow (stem 5–11, 3px head); right, down and left are turns |
| square-arrow-up-right | the square with a diagonal arrow (5.5, 10.5 → 10.5, 5.5, a 3px corner head); the other diagonals are turns |
| square-text | the square with the type family's medium T (6 × 6, ticks 1, foot 3) |
| square-text-cursor | the square with text-cursor's I-beam at half size (6 tall, r 1.25 hooks) |
| square-list | the square with three 6px lines 2.5 apart (tight 1.38) |
| square-search | the square with an r 2 lens and a 1.5 handle on the diagonal (standard 1.88 from the square) |

## Batch 45: Circle containers and status rings, 2026-09-28

| Icon | Construction |
|---|---|
| chevron-down-circle | the ring with a 3px-leg chevron (5, 7 → 8, 10 → 11, 7); left, up and right are turns |
| play-circle | the ring with a small solid play (4 × 5 triangle, r 0.75 corners, centroid on 8): a solid exception like stop-circle's square |
| pause-circle | the ring with two 5px bars 3 apart (standard 1.88) |
| circle-dashed | the ring as eight arcs, each gap 2.5 between centre-lines (square-dashed's rhythm), dashes centred on the axes and diagonals |
| circle-dot-dashed | the dashed ring with an r 1.5 solid centre dot |
| circle-check-dashed | status-available's check with the ring solid on its right and three dashes on its left |

alert-circle is info flipped (`data-rotations="alert-circle:flipy"` on info), the arrow circles are arrow-up-circle's turns.

## Batch 46: Notification dot, 2026-09-28

| Icon | Construction |
|---|---|
| bell-dot | bell exactly, cut round a ⌀3 dot at 12.5, 3.5 |
| chat-dot | chat cut round the dot at 12.5, 3.5 |
| mail-dot | mail cut round the dot at 12.5, 4.5, the flap stopping short of it |
| square-badge | stop's square cut round the dot at 12.5, 3.5 |
| compass-dot | compass's ring cut round the dot on its 45° point |

braces-dot dropped: a dot at the bottom right removes the brace's lower hook.

## Batch 47: Checks, plays and off states, 2026-09-28

| Icon | Construction |
|---|---|
| folder-check | folder-add with the small check (1.5 / 3) on its corner, the folder cut round it |
| scan-check | corners with the inside check (2 / 4) |
| desktop-check | desktop with the 2 / 4 check inside the screen (the placement rule: a closed shape with room holds the mark) |
| desktop-play | desktop with a small solid play (4 × 5, r 0.75) inside the screen |
| search-off | search exactly with a 3px rising slash inside the lens (`data-off="own"`), the same inside slash as square-slash |
| flask-off | flask with the shared slash, cut one-sided; the square keyline for the slash |

compass-check, bug-play and plug-off are left out: the compass's needle leaves no room for a corner mark, the bug fills its square, and the slash takes plug's left prong whole.

## Batch 48: Agents and sparkles, 2026-09-28

| Icon | Construction |
|---|---|
| agent-circle | the ring with the agent kite at 0.6 (knocked out when filled) |
| agent-square | the square with the same kite |
| agents | four solid kites at 0.55 in a 2 × 2 (small solids need no counter) |
| chat-sparkle | chat with the sparkle at 0.56 inside (tips on the grid), knocked out when filled |
| grid-sparkle | grid with the sparkle (0.4, r 2.5) as its fourth tile |
| grid-plus | grid with the 4px plus as its fourth tile |
| corners-sparkle | corners with the sparkle at 0.56 inside |

brain, brain-off, brain-thinking and agent-hexagon wait for later batches (the brain needs its own construction; the hexagon is batch 51).

## Batch 49: Arrows 2, 2026-09-28

| Icon | Construction |
|---|---|
| arrow-left-right | one 12px stem with a standalone head (4px legs) at each end; arrow-up-down is its turn |
| arrow-right-left | two opposed arrows on rails at 4.5 and 11.5 with 2px paired heads, 3 apart at the barbs (standard 1.88) |
| arrow-right-to-line | a 3px-head arrow stopping a standard gap (3) from a 10px bar; the other directions are turns |
| caps-lock | shift with its stem shortened to 11 over a 5px bar at 13.5 (tight 1.38) |
| chevrons-right | chevron-right twice, 4 apart (Fluent's spacing): the 1.70 gap is tight under the detail round's scale; left, up and down are turns |
| chevrons-down-up | chevrons-up-down with its chevrons turned in (tips at 6 and 10) |

## Batch 50: Files, 2026-09-28

| Icon | Construction |
|---|---|
| files | a document 8 × 9 (its 4.5 fold) in front of copy's back L, a standard 3 away |
| file-export | document-add with a 2px-head arrow in place of the plus (the corner-mark footprint, the same cut) |
| clipboard-list | clipboard with two 5px lines 2.5 apart, knocked out when filled |

file-diff (plus over minus) does not fit under the fold with a gap on the scale; file-lock, folders and folder-dashed are left for a later pass.

## Batch 51: Code, git and shapes 2, 2026-09-28

| Icon | Construction |
|---|---|
| hexagon | a pointy-top hexagon with vertical sides at 2.5 and 13.5 (r 6.35), corners r 1 |
| agent-hexagon | the hexagon with a solid agent kite at 0.6 (a hole when filled) |
| cube | package without its tape |
| asterisk | six 5.5 arms, one vertical and two at 30° |
| plus-minus | a 7px plus over a 7px minus, a standard 3 apart |
| brackets | square brackets, spines at 3.5 and 12.5, arms 2.5 with r 1 corners |
| split | a stem to 8 forking at 45° into two 3px corner heads |
| git-pull-request-closed | pull request with the hook replaced by a 3px × over a short stem |
| git-pull-request-draft | pull request with the hook drawn as two dashes |

binary and atom are left out: two digit rows are too dense at 16px, and atom's orbits need rotated ellipses as paths.

## Batch 53: Data and money, 2026-09-28

| Icon | Construction |
|---|---|
| dollar | strikethrough's S made whole (two rx 3.5 × ry 2.75 bowls meeting at 8.25) with stubs above and below |
| chart-scatter | chart's axes with five ⌀2 dots on whole centres, gaps tight to open |
| layout-dashboard | four r 1 panes, 4 wide, heights 5 and 3 crossed, a standard 3 apart |
| network | a 4 × 3 box over two, joined by a stem and an r 1 bracket |

cost-tiers, vault and waypoints are next in this batch.

## Batch 54: Messages, 2026-09-28

| Icon | Construction |
|---|---|
| chat-more | chat with three ⌀1.5 dots 3 apart, holes when filled |
| chat-code | chat with two 1.5-leg chevrons, knocked out when filled |

chat-question and chat-warning wait: a ? or ! with its dot needs about 9px, and the bubble's inside is 7.9. check-check, call-incoming, person-chat, chat-dashed and smile-plus are next.

## Batch 55: Objects 2, 2026-09-28

| Icon | Construction |
|---|---|
| target | the ring, an r 3 ring (standard 1.88) and a ⌀2 centre; filled, the inner ring and dot are cut out |
| crosshair | the ring with four 3px ticks inward and a ⌀1.5 centre |
| disc | the ring with an r 2 hole ring |
| infinity | two loops (r 2.5 ends at 5 and 11) crossing at the centre on cubic curves |

wrench, bandage, goal, radar, route, binoculars, broom, presentation, app-window, blocks, gallery, badge-check, cookie and clapperboard are next.

## Owner round: decisions, agents, Fluent likeness, 2026-09-28

The owner took the recommended system choices (the notification dot ⌀3, square containers with
the ring's marks, solid small shapes inside containers, Fluent's chevron spacing) and asked for:

| Icon | Change |
|---|---|
| agent, agent-circle, agent-square | a new agent mark (the flipped pointer read as Cursor's cursor): Fluent's agents shape, a flat hexagon (2–14 × 2.5–13.5) split by a steep slash into two halves, one path; inside a ring or square a smaller cut (4.5–11.5 × 5–11) without the top and bottom stubs. `agents` and `agent-hexagon` removed |
| chat-sparkle | Fluent's chat sparkle: the sparkle (r 2.5) on chat's top-right corner, chat cut round it by the overlap cut; filled, the sparkle stays a line with a `halo` (cloud-lightning's pattern) |
| search-off | a full rising slash through the lens (2, 12 → 12, 2, perpendicular to the handle), the lens cut one-sided; a short slash inside the lens read as zoom-out |
| square-list | list-bullet inside the square: three ⌀1.5 dots at 5.5 and lines 8–11 |
| dollar | even stubs (1.5 above and below) and a narrower S (rx 3.25, ry 2.5) whose ends stop at 30° |
| id-card | Fluent's contact card: a solid ⌀3 head over a solid 4 × 2.5 body inside the card, two lines at the right |
| newspaper | Fluent's news: a page with a solid picture block, two short lines beside it, a full line below, and a back page at the right joined to its foot |
| plane | a side view: fuselage 2.5–13.5 with a round nose and a tail fin, a swept wing below; solid when filled |
| translate | 文 redrawn: a bar, a tick and an X on the lattice, a detail gap under the bar |
| text-size | the large T wider and shorter (8 × 10, foot 4) and the small T 4 × 5.5; the horizontal keyline |
| banknote | one note (no stack) with Fluent's corner arcs (r 3 round each corner) and an r 2 ring |
| bank | a wider roof (1.5–14.5) on three 2-wide pillars and a base line |
| award | an r 2 ring inside the medal |
| captions | Fluent's CC: two r 1.5 Cs in the frame |
| variable | braces (the braces icon exactly) round a 3px × |
| qr-code | the finder squares 2 apart (at 2 and 9), the four corner dots 3 apart |
| boolean-exclude | Fluent's exclude: both outlines with hatching in the parts that do not overlap; filled, the evenodd solid |

Counters now pass from 0.875 (the detail gap), so 2-wide bars and pillars hold a counter.

## Batch 56: Objects 3, 2026-09-28

| Icon | Construction |
|---|---|
| check-check | check at 3 / 6 and a second long arm 3 to its right with Lucide's short tail (the rest hidden behind the first); the horizontal keyline |
| presentation | a rail 2–14 with a board hanging from it (r 1.5 foot) and two legs meeting under the board on the lattice |
| blocks | grid's three tiles with the fourth lifted 1 up and right, an open 2.88 from the others |
| badge-check | a sixteen-point seal (radii 6.4 / 5.2, every corner r 1.2) with the small check (1.5 / 3) inside |
| cookie | the ring bitten by an r 3 arc at its top right, three ⌀1.5 chips (holes when filled) |
| clapperboard | a 12 × 10.5 board with its clapper band (a line at 6.5) holding two stripes on the lattice; band and stripes are cuts when filled |
| route | two r 1.5 rings joined by a path on rows 4.5, 8.5 and 12.5 with r 2 turns (Lucide's route) |
| vault | stop's square with an r 2 dial right of centre and two hinge ticks at the left |

Still to draw from the queue: case-upper, case-sensitive and markdown (letters need the type family's A and a), cost tiers, waypoints, call-incoming, person-chat, chat-dashed, smile-plus, wrench, bandage, goal, radar, binoculars, broom, app-window, gallery, folders, folder-dashed, file-lock and the brain family.

qr-code, later the same day (owner: less round, more like a QR code): finders r 1 instead of
r 2, and every dot a square 2 × 2 module (r 0.25): the finders' centres (a detail 0.94 from
their rings) and four data modules 3 apart in the corner.

## Batch 57: Queue remainder, 2026-09-28

| Icon | Construction |
|---|---|
| bug-off | bug with the shared slash, cut one-sided; the right lower leg lies under the slash and the right middle leg starts past its cut (`data-counter="sliver"`, as mic-off) |
| file-lock | document with a small lock on the corner (a 4 × 3 body, r 0.5, and a 2-wide shackle), the page cut round it |
| folders | a folder 9.5 × 8.5 in front of copy's back L |
| chat-warning | chat with a short ! (stem 4.5–6.5, ⌀1.5 dot at 8.75), detail gaps |
| call-incoming | call with a 3px corner-head arrow pointing into it from the top right |
| call-outgoing | call with the arrow pointing out |
| app-window | a 12 × 11 window with a tall bar (a line at 7) holding three ⌀1.5 dots |
| gallery | a 7 × 10 card with a line either side (the cards behind), 2.5 apart |
| markdown | a 13 × 10 frame with an M (45° strokes) and a down arrow, knocked out when filled |
| case-upper | A (translate's A) and B (bowls 1.5 and 1.25) on a 6px cap height |
| case-sensitive | the same A and a single-storey a (an r 1.5 bowl on a stem) |
| wrench | an outlined wrench: an r 3.5 head open at the top right (jaws to an r 1.5 inner arc) on a 2.2-wide handle with a round end |
| bandage | a 45° capsule (r 2.25) with a pad between two cuts and a ⌀1.5 centre |
| atom | two ellipses (6 × 2.5) at ±45° round a ⌀1.5 nucleus; a line glyph |

Still to draw: the brain family, cost tiers, waypoints, smile-plus, person-chat, chat-dashed, chat-question, goal, radar, binoculars, broom, folder-dashed, then the later list.

## Batch 58: AI, people and exploring, 2026-09-28

| Icon | Construction |
|---|---|
| brain | two lobed halves (three arcs each) sharing a midline, a short fold off the midline in each; filled, the midline is a gap and the folds knock out |
| brain-off | brain with the shared slash, cut one-sided (`data-counter="sliver"`) |
| waypoints | four r 1.5 nodes on a diamond joined by 45° lines |
| smile-plus | smile at 0.75 (an r 4.5 face) with a 3px plus at its top right |
| person-chat | person-add's small figure with a small chat bubble (its tail corner sharp) at the top right |
| binoculars | two r 2.5 lenses under rounded barrels joined by a bridge; filled, barrels and lenses solid, parted by a gap |

Still out after the detail round: chat-question (the bubble is about 1px too short for a ? and its dot), file-diff, plug-off, braces-dot, compass-check, bug-play, binary, cost tiers, chat-dashed, folder-dashed, goal, radar and broom.

## Batch 59: Leisure, 2026-09-28

| Icon | Construction |
|---|---|
| dumbbell | two 2.5 × 8 plates (r 1) on a bar |
| piano | a 12 × 11 case with two solid black keys hanging from its top and white-key lines under them |
| toy-brick | a 12 × 7.5 brick with two 3-wide studs |
| square-smile | stop's square with smile's face (eyes at 5.5 and 10.5) |
| crystal-ball | an r 4.5 ball with an inner highlight arc (r 2.5) on a small stand |
| utensils | a three-tine fork (tines 2 apart) and a knife with its blade to the left |
| basketball | the ring with a cross and two side seams; filled, the seams are gaps |

Later list still to draw: chef-hat, chess-rook, castle, deck-chair, vr-goggles, satellite, circuit-board, cube-wireframe, head-thinking, file-pdf; the IDE set (debug-step, breakpoint, stack-frame). agent-stack is dropped with the pointer agent mark.

## Batch 60: Later list and debugger, 2026-09-28

| Icon | Construction |
|---|---|
| chef-hat | a lobed crown (cloud's construction on a foot at 10) over a 6 × 3.5 band; filled, a cut parts them |
| chess-rook | three battlements (r 0.5 tops) over a tapered body on a base; filled, gaps part the three |
| vr-goggles | a 12 × 7 visor (r 2) with a nose notch at the foot |
| circuit-board | stop's square with two traces from opposite sides, each ending in an r 1 pad at a different height |
| cube-wireframe | the hexagon with its three diagonals; filled, the diagonals are cuts |
| debug-step-over | an r 5 arc over a ⌀2 dot, ending in reset's corner head |
| breakpoint | an r 4.5 circle, solid when filled |
| stack-frame | a 3px-head arrow pointing into a 5 × 10 frame, a detail gap from it |

Not drawn: castle (the rook covers it), deck-chair, satellite, head-thinking and file-pdf (a label too small to read at 16px); step into, out and back follow step-over's construction when needed.

## Refinement round, batches 56–60 (owner, 2026-09-28) — rejected

Owner: none of these refinements are good. They stay in the sources for reference only; the
next session redraws these icons (the list below is what was tried).

Checked against Fluent and Area's own families for quality, detail, consistency and accuracy:

| Icon | Change |
|---|---|
| vault | Fluent's landscape safe (12 × 9, r 2): an r 2.5 dial with a ⌀1.5 hub and a handle bar at the left |
| blocks | three tiles joined as an L (cells parted by lines, cuts when filled; Fluent's add-in) and a fourth tile lifted to the top right |
| clapperboard | the stripes stop short of the top edge and knock out when filled (they notched the silhouette as cuts) |
| check-check | the second check a step lower, so its short arm shows |
| bandage | the pad between two cuts further apart, with two holes |
| case-upper, case-sensitive | one A for both: a 49° apex filleted r 0.75, the crossbar at 8.5 |
| person-chat | Fluent's arrangement: the bubble in front of the figure's lower right, the body cut round it; filled, the gap sits outside the bubble |
| binoculars | tapered barrels narrowing to eyepieces, the bridge at 6 |
| brain | five lobes a side, no folds (Fluent's brain) |
| toy-brick | lower studs, the brick centred |
| dumbbell | a large inner plate and a small outer plate each side; filled, gaps part the plates |
| debug-step-over | a balanced 2px head pointing down at the arc's end (`data-counter="sliver"`: the inner barb's pocket) |
| vr-goggles | strap stubs at the sides and two lens lines |
| chef-hat | Lucide's construction: puffs rising straight from a band as wide as the hat (the earlier crown over a narrow band read as a mushroom) |

## Owner round, batches 44–60 (2026-09-29)

Owner notes, each answered with Fluent's construction or the owner's reference; all stay in review.

| Icon | Change |
|---|---|
| chef-hat | the band line is a filled-only `gap` (it ran past the hat in the outline as a `cut`) |
| chess-rook | wider crenellations: top 3–13, merlons 1.5 / 2 / 1.5 with 2.5 notches (tight 1.38; were 0.88) 2 deep, base 3.5–12.5 |
| vr-goggles | no lenses; Fluent's rounder body 11 × 7 (r 2.5) with a trapezoid nose (r 1), tabs joined to the top and sides as small bumps (detached tabs read as ears) |
| debug-step-over | rotate's corner head: an r 5.66 arc from the left over the top arriving at 45° into a 3px L at 13, 5.5; the ⌀2 dot under the arc |
| dumbbell | Fluent's diagonal dumbbell: each end a large plate stepped into a smaller one (one outline, detail counters), a bar between and a short bar end past each small plate; filled, the plates are solid and the bar stays a line |
| brain | one fold a side, hooking in from the middle lobe junction (owner's reference; 3 of 4 candidates) |
| brain-off | brain exactly, slash-cut; circle keyline (the lobes and slash exceed the square); the left fold falls inside the slash's clearance and is dropped |
| folders | Fluent's folder multiple: a 9.5 × 8.5 folder in front, the back copy 2.5 lower right, cut round the front by the overlap cut, its right corners concentric (r 3 and 4) so its ends curve in behind the front |
| files | the same stack with a 7.5 × 10.5 page (fold 4, the lattice at this width) |
| gallery | the owner's reference: an image (image's mountain as a `cut`, a ⌀1.5 sun) in front of one back layer 2.5 up and left |
| bug-off | the top-left leg and the floating right leg removed (they touched or sat in the slash's clearance); the rest is bug cut one-sided |
| case-upper, case-sensitive | taller letters (cap 4.5–11.5), a narrower A with an r 0.5 apex that overshoots to 4.68, the crossbar at 9.5; B's bowls r 1.75; a's bowl r 2 |
| wrench | Fluent's wrench: an r 3.5 head with a square jaw on the axis (walls 2.5 apart, a flat floor at the head's centre, r 0.5 corners), a handle 2.2 wide with an r 1.1 end, r 1 joins; every join tangent |
| check-check | both checks on one baseline (11.5); the second check's short arm is a stub a tight 1.35 from the first's long arm (Lucide's), its long arm a lattice step lower (open 3.1) |
| clapperboard | three 45° stripes 3 apart (a detail 1.0 gap); filled, the stripes are gaps run up through the top edge from the band cut, so the band reads as painted stripes |
| cookie | six ⌀1.5 dots spaced by search (neighbour gaps 1.35–1.98, none near misses) |
| vault | Fluent's dial: an r 1.5 ring with four spokes out along the diagonals, no hub |
| infinity | two r 2.5 loops joined by straight tangents crossing at the centre (45.6°), every join tangent |
| search-off | the normal slash mirrored: 14, 2 → 2, 14, the lens running up to it from the lower right and stopping 2.25 short above left; the handle starts at 10.63 (a 2.59 open gap from the slash) |
| arrow-left-right | heads 3 (the main-arrow size; 4 crowded a double arrow) |
| arrow-right-left | heads 2.5 (paired), rows at 5.5 and 10.5 so the pair centres |

### Second pass (owner, 2026-09-29)

| Icon | Change |
|---|---|
| folders, files, gallery | the back copy follows the stack rule (copy's L): straight legs with the front's own corner radius, a tight 2.5 away, ending level with the front's corner tangents; the curled ends (larger concentric corners cut round the front) read as hooks |
| bug-off | all six legs: the two corner legs lie along the slash's path, so they run up to it (the one-sided rule's lower-left side) and the middle right leg stops 2.25 short; `data-counter="sliver"` covers the wedges where legs meet the slash |
| brain | mismatched folds: a hook from the left side's middle lobe, a stub off the midline low on the left, a hook up from the right side's lower lobe, a stub off the midline high on the right |
| brain-off | brain exactly; the slash's clearance takes the right hook and the right stub, the left hook falls within 0.56 of it and goes too |
| vr-goggles | the owner's reference: a 9 × 6 body with round corners (r 2.5 top, 2 bottom) running tangent into an r 1.5 nose curve, one line inside near the top, short strap lines at the sides a detail 0.87 away |
| debug-step-over | Lucide's redo-dot: an r 5.3 arc from the left over the top that runs straight on at 45° into a 3px corner head at 13.5, 6.5, the dot centred under the arc |

Agent candidates on the Exploration sheet (`explore/agent-*.svg`, owner: not the sparkle
antenna): bot's face in sunglasses under a fedora (the pinched crown on a brim wider than the
face; filled, a gap parts crown from brim), and bot's face in sunglasses wearing a headset (a
band concentric with the face, solid ear cups joined to it, a mic boom from the right cup).
Also still offered: infinity (Cursor's agent mark) and the current hexagon. The lenses are solids
(sunglasses are dark by nature) and knock out when filled.

### Third pass (owner, 2026-09-29)

| Icon | Change |
|---|---|
| folders, files, gallery | the back L's corner is concentric with the front's (r 4, 4.5, 4.5 round the front's corner centres), legs straight as before |
| vr-goggles | Vision Pro's outline: an r 12.5 arc across the top meeting r 2 corners internally tangent, the inner line an arc concentric with it (r 10) |
| bug-off | back to the three legs clear of the slash (owner: the extra legs are not needed) |

vr-goggles, fourth pass (owner): no side lines; Vision Pro's rounder outline: an r 10 top arc tangent
inside r 3.5 upper corners, r 2 lower corners, an r 1.75 nose (1.25 deep), the inner arc
concentric (r 7.5) and a short concentric arc above the top (r 12.5, a tight 1.38 away).

Agent (owner: keep bot's head exactly): hats on bot's own 12 × 7.5 head, all in sunglasses with the
bridge flush with the lenses: fedora, hard hat (the owner's reference: dome, two ridges, brim), cap,
top hat, beanie, and the headset twice: on the full head the band must run in front of the head's
top corners (the head is cut round it), because a band outside a full-width head leaves the canvas;
the narrower-head headset is shown beside it for comparison. `explore/agent-hat-*.svg`.

### Fourth pass (owner, 2026-09-29)

- vr-goggles: softer bottom (r 3 lower corners, the nose tangent to them), the inner arc runs 5–11,
  and the arc above sits a detail 0.92 from the top.
- Agent cast (`explore/agent-cast-*.svg`), each on bot's own head with bot's eyes unless the role
  changes them; the owner keeps the hard hat and likes the fedora (only it keeps sunglasses, the
  bridge now at the lenses' middle). Roles: Agent (fedora, sunglasses: the default agent), Builder
  (hard hat: writes and changes code), Researcher (glasses: reads, searches, explains; keeps the
  antenna), Guard (peaked cap with a badge: review, security, permissions), Lead (crown: orchestrates
  other agents), Designer (beret), Generator (wizard hat: images and content), Automator (chef hat:
  recipes and workflows), Assistant (beanie: everyday help). Headsets and the top hat are dropped.
  A hat has 4.5px above the head (1.5–6), so tall hats (wizard, chef) read squat.

### Fifth pass: the agent cast (owner, 2026-09-29)

Hats now cover the top of the head instead of sitting on it: the head is bot's 12 × 7.5 face cut flat
at y 7 (its sides join the hat there), which gives a hat 5.5px (1.5–7). Filled, a gap parts the
head from the hat just below the brim. Eyes and lenses moved 0.5 lower to clear the brim (lenses
9–11.5, the bridge at their middle, 10.25). The cast (`explore/agent-cast-*.svg`): Agent (fedora and
sunglasses), Builder (hard hat, kept), Researcher (a mortarboard; glasses read as a robot's eyes),
Guard (a police cap: a crown flaring to the full width, a solid bill, a badge), Lead (crown),
Designer (a plain hat with a band), Generator (wizard hat), Automator (a toque: three puffs on a
band). The beanie was removed.

Sixth pass (owner): narrow hats widened to 3.5–12.5 (fedora, plain hat, wizard; the chef's puffs
2.75–13.25, the mortarboard's cap 4–12); two small sparkles on the wizard hat (the sparkle scaled,
holes when filled); sleek sunglasses as one solid (flat top across both lenses, a thin bridge,
round lower corners); the Lead's crown follows the crown icon (three points with balls above them).
Face variants for comparison: `agent-cast-*-mouth.svg` (a ⌀1.2 dot mouth, eyes 0.5 higher) and
`agent-cast-*-line.svg` (a line joining the eyes at their middle; not for the sunglasses).

Seventh pass (owner): every bot has the dot mouth in one place (⌀1 at 8, 12; eyes 9–10.5, lenses
9–11); the eye-line variant is dropped. Designer wears a baseball cap (a dome with a button and a
solid bill that curves down in front); Generator's wizard hat has a band and a tip bent over to the
right, no stars; the sunglasses are two lenses joined by a stroked bridge (1.125, flush with their
tops); the fedora has a stroked band (a knockout when filled); Guard's pilot cap is taller (crown
1.75–5 flaring to the full width, a solid band, a solid bill) with a winged badge.

Eighth pass (owner): one hat line for every hat: a standard stroke that curves round the head (a
quadratic from 1.5, 6.25 sagging to 7.25 at the centre). Brimmed hats (fedora, hard hat, cap, pilot
cap, wizard) draw it full width as the brim or bill; the others (crown, mortarboard, chef hat) draw
it across the head. Every hat's crown ends on it, and the head's outline stops where its corners
meet it (2.85, 6.62). Bands are the same curve 2 higher. Filled, a gap follows the curve one weight
below. The mouth is ⌀1.5 at 8, 11.25 on every bot, and `bot` itself gained it (a detail 0.94 from the
face's foot; bot goes back to review).

Ninth pass (owner): Guard's badge is a small solid star (the star icon at 0.2); the cap has a
centre seam from its button to the bill; the wizard hat is taller and narrower (to 1.5) and its band
ends on the hat's sides; the chef hat's three puffs sit level at the top over a taller band; the
crown's points rise to 3.25 with smaller balls (r 0.6) above; the Researcher wears round glasses
(r 1.25 rings joined by a bridge, the mouth below them) under the mortarboard; the sunglasses are
larger (3.75 × 2.25 lenses 2.5 apart, the bridge 1 below their tops).

Tenth pass (owner): the Lead wears the crown icon itself at 0.55 and the Automator the chef-hat icon
at 0.5 (their proportions and details unchanged), each seated on the head's top edge, the head
open where the hat covers it; the cap and pilot cap have a small solid bill (a crescent under the
hat line, 3–13, 1.25 deep at the centre); the sunglasses' bridge is an arch (r 1.25); two
Researcher candidates: A, lab goggles (a wide frame with a nose notch and strap stubs to the head's
sides, no eyes); B, big round glasses (r 1.75 rings with ⌀1 pupils, an arched bridge).

Eleventh pass (owner): the mouth never moves (⌀1.5 at 8, 11.25) and faces keep clear of it.
Researcher is now bot itself (antenna kept) in large lab goggles (a frame 3–13 × 7.5–10.25 with a
nose notch, strap stubs to the head's sides, no eyes); Scholar is a separate character: the
mortarboard with glasses frames only (two rounded frames 3.25 × 2 and a bridge, no eyes). Lead's
crown is the crown icon stretched wider (0.9 × 0.55) so it spans the head; Automator's hat is the
chef-hat icon at 0.6 × 0.5. The baseball cap has its own crown (upright sides under a round top, a
seam) and the military cap its own (flaring to a wide flat top); both sit on the hat line raised
0.75 so a solid crescent bill (1.5 and 1.75 deep) clears the eyes. Two Guard options: A with a star,
B with a stripe.

Twelfth pass (owner): the baseball cap's crown has upright sides, r 2.5 corners and a flat top,
with a button (a short stroke on top); Guard A's star is larger (0.3) and lower; Lead's crown is the
crown icon's own parts across the head (1.0 × 0.55: its rounded points, band and balls); Automator's
chef hat is the icon's puffs at 0.75 × 0.47 over a band whose foot follows the hat line; the
Researcher's goggles run past the head's sides and overlap its outline (the head is hidden only
inside the frame); Scholar has plain eyes. Explorations without a mouth: the agent, then six
sunglasses (wayfarer, aviator, round, shield, slim, sport; `agent-cast-agent-sun-*`) and six goggles
on the Researcher (wide, swim, strap, split, dark, forehead; `agent-cast-researcher-gog-*`).

## Batch 61: Bot cast, 2026-09-30

| Icon | Construction |
|---|---|
| bot-agent | Fedora with a knockout band over the hat line; one wrap-around shield lens (3.5–12.5 × 9–11.5) with a 45° nose dip to 9.75, a thin bridge; no mouth |
| bot-builder | Hard hat: a 5.75 × 4.75 dome from 2.25 to 13.75 on the hat line, two knockout ribs at 6.5 and 9.5 |
| bot-researcher | bot with its antenna, behind lab goggles wider than the head (1.5–14.5 × 8–11.5, r 1.25) with a nose notch; the head cut round them; no mouth |
| bot-scholar | Mortarboard 12 × 3.25 (r 0.5) on a skull cap 7 wide whose foot follows the hat line; the head whole, the cap on its top |
| bot-guard | Military cap: a crown flaring to a flat top at 2 (1.5–14.5), a knockout stripe, a solid visor 4–12 narrower than the crown under a hat line raised 0.75 |
| bot-lead | The crown icon's body across the head at 1 × 0.345, its foot at 7; three ⌀1.5 balls a detail gap over its tips (2.5, 2.75; 8, 2.25; 13.5, 2.75); the head whole |
| bot-designer | Baseball cap: the crown's sides run on from the head's (2 and 14), curving in very slightly to r 2.5 corners and a flat top at 2.5, a button and a knockout seam; the brim a stroked lens arched over the face (top 5.5, bottom 6.375 at the centre), its ends on the head's sides at 8.25 |
| bot-generator | Wizard hat with a bent tip, its feet joined to the head where it meets the hat line (3.25 and 12.75), a knockout band |
| bot-automator | Chef hat: three round puffs (r 1.25, 2, 1.25; lobes on a foot at 4) on a band 5–11 whose foot follows the hat line; the head whole |

Owner round 2026-09-30: no mouths on the glasses wearers; the wrap-around lens over round ones; Guard B (stripe) over the star; the crown's band line removed; the Designer's brim arched from the owner's reference (a front-view cap) and the cap's sides lined up with the head's; Scholar M of four board sizes (13, 12, 10, 8). The Lead's balls grew from ⌀1.2 toward the crown icon's ⌀2 (owner): ⌀2 fits only set on the tips, where they blurred into them, or over a crown 0.28 tall, so ⌀1.5 floats over a crown 0.345 tall. Strict-lint fixes on promotion: the hat line 0.125 flatter, bands 2.25 above it, edges moved to the 0.5 grid (the guard's top, the crown's foot, the chef's band and puff foot), the hard hat's dome widened to an open gap from the eyes, the chef's puffs raised and narrowed (the side puffs 2 clear of the head's top), the lens set inside the head's sides. Exceptions carried from the cast: data-angles, data-dot and data-counter free/sliver (the wizard hat's tip pockets). Filled (owner, 2026-10-01: more ink, never a negative; Fluent's incognito and video_person): the hat fills and the head, eyes, mouth, lenses and visor stay exactly as drawn, so dark glasses stay dark and nothing crowds the eyes. Only the hats' own parts are parted (the board from the skull cap, the puffs from the band, the crown behind the brim); knockouts stay inside the hat's silhouette (bands, ribs, stripe); the cap's seam is outline-only. Earlier rounds flooded the head and knocked the face out, then parted hat from head with seams; both read as negatives. The plain bot keeps its filled head: the head is its identity.

## Audit, 2026-10-01

The whole set compared with Fluent, Lucide, Phosphor, Hugeicons and SF Symbols (and Cursor's
rules); method, coverage and open questions in `docs/research/icon-audit/`. Cleanup only: no
concept changed. Every icon below went back to review. Values here supersede earlier construction
lines for the same icon.

Filled, under "more ink, never a negative" (the outline is unchanged unless noted):

| Batch | Icon | Filled now |
|---|---|---|
| 4 | token | the r 6 ring stays a line; the r 3 circle fills (a standard 1.875 to the ring) |
| 5 | pin | the r 2 circle is a hole (an opening, as Fluent's location) |
| 6 | home | the door is a hole through the base (`M6.5 13.5V10A1.5 1.5 0 0 1 9.5 10V13.5Z` plus a gap through the base line) |
| 8 | cart | the basket fills; the handle stays a line; the ⌀2 wheels stay |
| 9 | key | a ⌀2 hole in the bow at 5.5, 10.5 (the outline gains the dot, as Fluent's key) |
| 11 | compass | the needle is a hole |
| 13 | film | the perforation rails fill, their ticks knocked out; the frame and centre stay lines |
| 18, 21 | document-add, document-check, calendar-check | filled-only gaps carry the corner mark's arms to the silhouette (they stopped 0.5 short) |
| 22 | prohibited | fills by weight (the slash split the disc) |
| 27, 32 | stop-circle, record | the ring fills by weight and the square or disc stays solid |
| 28 | unpin | the filled-only fill keeps only what the outline keeps |
| 30 | thermometer | the glass stays a line; a filled bulb swallows the reading dot |
| 31 | qr-code | filled equals the outline (finder centres stay solid) |
| 35 | picture-in-picture | the frame stays a line; the window fills |
| 38 | bank | a filled-only gap at 7.125 parts the roof from the pillars |
| 38 | award | the medal ring stays a line; the inner ring becomes a solid disc |
| 39 | person-circle | the figure is a solid negative silhouette (head and shoulders holes), as id-card's person |
| 47 | flask-off | flask's liquid gap carried to the slash, one-sided |
| 55 | target | fills by weight |
| 55 | disc | the centre is a true r 2 hole |
| 57 | file-lock | the lock body fills, cut a weight from the page; the shackle stays ink |
| 58 | brain-off | brain's midline gap (`M8 1V15`) |
| 60 | cube-wireframe | cube's outline and Y with the hidden inverted Y; fills by weight (a see-through frame stays open) |
| 61 | bot-guard | a gap one weight above the hat line parts the crown from the visor; the stripe is outline-only |

Outline (family drift, pixel grid, optical size):

| Batch | Icon | Now |
|---|---|---|
| 7 | menu | lines 2–14, as list |
| 12 | server | square keyline; units 12 × 4.5 at 2–6.5 and 9.5–14, r 1.5; ⌀1.5 lights at 5, 4.25 and 5, 11.75 (detail 0.94) |
| 12 | pointer | scaled 1.1 about 8,8 (ink 11.9; was 2.24 under its keyline), fillets re-solved at the same radii |
| 13 | volume-off | the 3.5 × on the diagonal lattice, 10.25–13.75 × 6.25–9.75 |
| 14 | save | body 2.5–13.5 r 2 like the square containers; corner cut r 1; shutter 5–10 from 2.5; label 5–11 × 8.5–13.5 |
| 17 | skip-forward | play's triangle scaled 10/13, back at 2.5, 1.82 to the bar |
| 21 | bar-chart | bar tops 8.5, 6, 3.5 (even 2.5 steps) |
| 22 | activity | peaks reach 3 and 13 (r 1 peaks, r 0.5 shoulders, ends 1.5 and 14.5) |
| 23 | document-remove | the corner-arc hook removed; the bottom edge starts at 8.306, 14 like document-add |
| 29 | kanban | the shared square container (2.5–13.5, r 2), header at 6, columns at 6 and 10 |
| 30 | leaf | body r 4.5 at 8,8 (point 8, 1.636), stem 12.5–14.5 |
| 30 | mountain | crater 3.5, base 12.5 (was whole pixels), width kept |
| 32 | wand | sparkle r 3 at 11, 5; stick from 2, 14 to 7.25, 8.75 (open 2.7) |
| 34 | git-commit | node r 1.5 like the git family; lines to 6.5 and from 9.5 |
| 43 | translate | 文 bar at 3.5 |
| 44 | square-slash | the slash falls (5.5, 5.5 to 10.5, 10.5) like every slash |
| 46 | mail-dot | the dot at 13, 4.5, 1 in from the side like the other hosts; cut re-solved |
| 51 | git-pull-request-draft | dashes 3.5–4.5 and 7–8 (even, 1.38) |
| 51 | git-pull-request-closed | × 3.5 (10.25–13.75 × 2.25–5.75) |
| 53 | network | axis edges on x.5: top box 6–10 × 2.5–5.5, boxes 2.5–6.5 and 9.5–13.5 × 10.5–13.5, bracket row 7.5 |
| 57 | app-window | bar at 7.5, dots at 5 |
| 57 | call-incoming, call-outgoing | 3px corner heads, the main-arrow size |
| 60 | stack-frame | 3px head (`M2.5 8H7M4 5L7 8L4 11`); frame 9.5–13.5 × 2.5–13.5, r 1.5 |
| 61 | bots | only the lint exceptions each needs (free angles; the Generator's sliver pockets) |

Earlier lines corrected by this audit (the sources were right): tag's eyelet is ⌀1.5 at 5.75;
smile's eyes and building's windows are ⌀1.5; list-bullet's bullets are ⌀1.5 at 2.75 and 5, 8, 11;
list runs 2–14; repeat's rails end r 3.5; git-branch's nodes are r 1.5; git-pull-request has a 2px
head; text-size's T is 8 × 10 with a 4 foot. Not changed: outdent (mirroring indent's chevron in
place leaves a 2.08 near miss; move indent and outdent together if wanted).

## Audit follow-up, 2026-10-02

The audit's questions for the owner, drawn on the recommendations (delegated, owner to confirm or
overturn; sheet `docs/research/icon-review/2026-10-02/1-before-after.png`). Every icon below went
back to review. Values here supersede earlier construction lines for the same icon.

| Batch | Icon | Now |
|---|---|---|
| 5 | calendar | Fluent's date grid: ⌀1.5 holes at 5.5, 8, 10.5 × 8.75 and 5.5, 8 × 11.25 (3 + 2, detail 0.94 apart, tight 1.69 to the sides). To fit two rows the body is 2.5–13.5 × 3.5–13.5 (r 2), the header 6.5 (on a pixel centre; was 7) and the pegs 2–4. The grid's diagonals are 2.04 apart, so the icon takes `data-gap="aligned"` (an even grid, as qr-code) |
| 18, 21, 23 | calendar-add, -check, -remove | calendar's new body, header and pegs; no grid (Fluent drops it in its variants too). calendar-check's ✓ moved 0.5 right and down (`M9 12L10.5 13.5L13.5 10.5`, its arms on the outer edges like the plus): at the old place the new header left a 2.38 near miss above it; cut re-solved at 2.3 |
| 6 | chat | Fluent's text lines: `M5.5 5.5H10.5M5.5 8.5H8.5`, standard 1.88 to the bubble, knockouts when filled |
| 6 | send | a centre fold `M4.5 8H8.5` from the notch, as every library; outline only (Fluent's filled send has none) |
| 5 | pencil | a ferrule band `M8.75 3.75L12.125 7.125` across the body (a 2.05 pocket below the end); a `cut` when filled |
| 23 | indent, outdent | centred on 8: indent's chevron 2–4 with lines 6.5–14 (tight 1.38 to the tip), outdent's chevron 2–4 with lines 7.5–14 (open 2.91). Mirroring the chevron in place leaves outdent a 2.08 near miss, and a half-pixel shift leaves the lattice, so the line starts differ by 1 |
| 23 | eraser | about 1:2 like the references: a 7 × 3.5 block on the diagonal (corners 2.5, 9.5 · 9.5, 2.5 · 13, 6 · 6, 13; r 1), band at 2.5 from the tip (`M5 7L8.5 10.5`), base line `M6 13H13` (on a whole pixel so the icon centres) |
| 31 | coins | a rim on the front coin: an r 2 ring at 6, 6 (detail 0.875 inside the r 4 edge), a knockout when filled |
| 35 | picture-in-picture | a larger window, 6.5–11.5 × 6.5–10 (r 1), still a tight 1.38 from the frame's corner |
| 55 | crosshair | fills by weight (a reticle is a line drawing; flooding the ring knocked it out) |
| 35 | camera-off | the lens stays when filled (its two arcs are knockouts) |
| 48 | agent | filled as Fluent's agents: the hexagon fills and the slash parts it (a filled-only gap along the slash, run out through the silhouette) |
| 8 | people | filled, both figures fill; the back figure is cut round the front by the overlap cut (filled-only gaps at r 3.125 round the head and 1.125 outside the body) |
| 11 | building | three rows of ⌀1.5 windows (5.75 and 10.25 × 4, 6.5, 9; detail 1.0 between rows, tight 1.14 to the door): the 2 × 2 over the arched door read as a face |
| 61 | bot-guard | the cap's flat top narrowed to 3–13 (flare to 2, was 1.5): apparent size +14% → +12%, inside the cast (agent-cast.py) |

Booleans (owner, 2026-10-02, the recommendation): two 8 × 8 squares (r 1.5) at 2.5 and 5.5,
every edge on x.5, overlapping 5 × 5 (the 3 × 3 overlap was a speck at 16px). Union is the one
outline (r 0.5 inner corners), solid when filled; subtract and intersect keep both outlines with
the result solid; exclude is now solid too, the union with the overlap open (an even-odd fill,
counter 3.93), both outlines drawn: at 5 × 5 the hatching's arms were 3px and left 0.18 and 0.47
counters. All four back in review; sheet `9-booleans-before-after.png`. indent and outdent stay as
drawn above (owner, 2026-10-02).

## Batch 62: Coverage round 1, 2026-10-02

| Icon | Construction |
|---|---|
| corner-down-right | return mirrored: stem 2.5–8, r 2.5 turn into a run to 13.5 at y 10.5, 3px corner head (10.5,7.5 → 13.5,10.5 → 10.5,13.5); line glyph, fills by weight |
| chevron-last | the shared chevron (4.5 wide, 9 tall, tip at 9, 8) and a 10px bar at x 12 (3–13, like Fluent's arrow_next and arrow-right-to-line), 3 apart (standard 1.88); data-rotations chevron-first:flipx; ink centred at 8.25 to keep the chevron on the lattice; under its keyline like chevrons-right; fills by weight |
| navigation | send's dart (same radii) turned 45° to point up-right and centred, without send's fold; data-angles free; filled solid |
| mouse-pointer-click | pointer's polygon scaled 0.76 about its tip with its own radii kept (0.75, 0.75, 1, 0.75), tip at 5.5, 5.5 (ink to 12.95, centred 7.92); three 1.5px click rays symmetric about the pointer's diagonal (up at x 6.5, left at y 6.5, a diagonal 3,3–4,4), tight 1.46 from the tip; filled: the pointer solid, rays stay lines. Scaled radii left a 0.26 sliver |
| import | Lucide's import: open's r 2 box at 4.5–13.5, its top opened 2.5 each side of the stem (5.5 and 10.5); a 3px arrow from y 2 into the box, tip at 10 (tight 1.38 from the opening); filled: the box fills and the arrow is a knockout, the stem above the box dropping out as in cloud-download |
| signature | pencil scaled 0.7 (about 14, 2, then 0.5 left) with its ferrule cut, writing over a two-hump wave (2.5–13.5, y 12–13.5) a tight 1.31 below the tip; data-angles free; filled: the pencil solid, the wave a line; ink centred at 7.72 (the wave is at the keyline floor) |
| text-color | text-size's 8-wide T (ticks 1.5, foot 4) shortened to 2.5–9.5, over a solid 11 × 2 swatch (r 1, y 12–14), standard 1.94 apart; the swatch is a solid exception (it is the colour, like shadow's band), so filled equals the outline |
| bring-to-front | Lucide's arrangement: a 5 × 5 front square (5.5–10.5, r 1.5) with back copies shown as r 1.5 L's at the top left (2.5, ends at 8.5) and the bottom right (13.5, ends at 7.5), each a standard 3 from the front; filled: only the front square fills |
| group | corners' frame unchanged, holding Lucide's two stacked 4.5 × 3 boxes (5–9.5 × 5–8 and 6.5–11 × 8–11, r 1) as one union outline with a cut on the shared line y 8; tight 1.38 from the frame's arms; filled: the union solid, the cut its layer gap |
| remove-formatting | text-size's 8 × 10 T (ticks 1.5, foot 4) at 2–10 × 2.5–12.5 with the 3.5px × (volume-off's) centred at 12, 12, a tight 1.45 from the foot; line glyph, fills by weight |
| clipboard-check | clipboard exactly (10 × 11 board r 2, 5 × 3 clip r 1) with the ✓ 1.5/3 on the lower-right corner (M8.5 12.5 L10 14 L13 11) as document-check and calendar-check, arms on the board's right and bottom edges, the board cut open round it (overlap cut); filled: the board fills, the check a knockout carried out through the edge. Inside the board only a tight gap was left under the clip |
| clipboard-paste | clipboard moved 1 left (board 2–12) with Fluent's pasted sheet in front: 6 × 7, r 1.5, at 8, 7; the board overlap-cut behind it (its right side ends in the corner arc, the bottom stops at 6.06); the sheet a tight 1.47 from the clip; circle keyline (13.1 × 13.6). Filled: board, clip and sheet solid, each part behind cut 1.125 round the front |
| list-plus | list's four 12px lines (3.5, 6.5, 9.5, 12.5), the bottom two stopping at 7.5 so the 4px + (centre 12, 11) sits beside them with tight gaps; line glyph, fills by weight; centred at 8.25 for the mark |
| list-tree | Lucide's list-tree on list's span: a trunk at x 2 from the first row, two r 2 elbows ending in 1px stubs at rows 8 and 12.5, lines 7.5–14 after a tight gap; the first row's line 5–14; the trunk on a whole pixel so the shape centres; line glyph, fills by weight |
| workflow | Lucide's workflow from flow's parts: two 4 × 4 r 1 boxes at the top left and bottom right (2.5 and 9.5) joined by a connector from the top box's foot through an r 2 elbow into the lower box's side; filled: the boxes solid, the connector a line |
| cloud-check | the one cloud shape, unmoved, with the ✓ 1.5/3 replacing its lower-right corner (M9 11 L10.5 12.5 L13.5 9.5, 0.5 in for the lattice), the cloud overlap-cut round it; square keyline like cloud-upload; filled: the cloud fills, the check a knockout run out through the edge. A 2/4 check inside crossed the lobes |
| archive-restore | archive exactly (13 × 3 lid r 1, box r 1.5) with Lucide's up arrow for the slot: a contained 2.5px head, apex at 8, the stem rising from the floor, which is overlap-cut round it; detail gaps (apex to lid 0.88, barbs to floor 1.13); filled: lid and box solid with the flap cut, the arrow a knockout through the floor |
| headset | headphones' r 5.5 band and 3.5-wide r 1.5 cups, the band raised 0.5 and the cups shortened to 8–11.5 so Lucide's boom fits: the right band line runs on down through an r 2 corner to end at 8.5 along y 14, a tight gap under the cup; circle keyline; filled: cups solid, band and boom lines. Exception: shorter cups than headphones, for the boom |
| person-settings | person-add's small figure exactly (head r 2, body 7 wide r 3) with a gear at head height (centre 12, 5.5): an r 2 ring with six 0.75 radial teeth at settings' angles (data-angles radial); circle keyline; filled: the ring fills round a ⌀2 hub hole, teeth stay lines. Exception: settings' gear at 0.5 scale left 0.21 tooth counters, so a ring with teeth (Lucide's construction) |
| bell-ring | bell exactly (body, clapper cup, filled gap) with two ringing arcs concentric with the dome (r 7 about 8, 6.5, 23°–45°) at the top corners, a tight gap from the dome; circle keyline (the arcs reach the live edge); filled: the bell solid as bell, the arcs lines |
| life-buoy | the r 6 ring with an inner r 2 ring joined by four 45° straps (on the lattice through 8, 8), band counters 3.05; r 2.5 left a 2.37 near miss and r 3 thinned the band; filled: the left and right band segments fill (filled-only solids), the top and bottom stay open like a buoy's alternating colours |
| square-x | stop's square (11 × 11 r 2 at 2.5) with error's 5px × (M5.5 5.5 L10.5 10.5 and its mirror), the ring's mark unchanged as square-slash; standard 1.88 gap; filled: square solid, × knocked out |
| more-circle | the r 6 ring with more's three ⌀2 dots on whole centres at 5, 8, 11 (dots 1.0 apart, a detail gap; 1.44 tight to the ring); filled: ring solid, dots are holes (true marks in a closed shape) |
| radio-button | the r 6 ring and a solid r 3.5 centre disc (data-dot="free", a solid exception like record's disc, larger so the two stay distinct), a standard 1.94 gap; r 3 would leave 2.44, a near miss; filled follows record (the ring thickens by weight) |
| star-half | star's outline exactly, plus a solid left half (fill only) along the star's own centre-line, closed by the vertical at x = 8 from the top tip's apex (2.386) to the bottom notch's apex (12.35); filled: whole star solid |
| shield-alert | shield exactly with warning's ! (⌀1.5 dot at 8, 10.25; warning's 1.44 stem-to-dot gap). Exception: the stem is 2.25 long (M8 5.25 V7.5), not warning's 1.75: the shorter stem left a 2.43 near miss to the shield's peak; this is standard 1.99. Filled: shield solid, stem knockout, dot hole |
| image-plus | image exactly with the 4px + on the top-right corner (centre 11.5, 4.5; top and right arms on the frame's outer edges), the frame cut open round it (overlap cut); filled: mountain stays a cut, sun a hole, + knockout with a gap run out through the edges. Exception: top right, not lower right, because the lower right is the mountain (Lucide's placement); the sun sits a 0.98 detail gap from the plus |
| cart-add | cart exactly with the 4px + on the basket's top-right corner (centre 11.5, 4.5; top arm level with the handle at 2.5), the basket cut open round it (overlap cut); wheels and handle unchanged; filled: basket fill + line, + knockout with an out-running gap. The 5.5-tall basket cannot hold the + inside |
| calendar-clock | calendar's body (2.5–13.5 × 3.5–13.5 r 2) and pegs (2–4), no date grid (variants drop content); an r 3.5 clock ring at 10, 10 on the lower-right corner (right and bottom on the body's outer edges) with 1.25px hands (M10 8.75 V10 H11.25, 1.13 tight to the ring); body and header cut round the ring with behind. Filled: body fill + line, ring solid with hands knocked out, a gap circle r 4.625 parting it from the body (bell-dot's pattern). r 3 left no room for hands |
| octagon-alert | octagon with flats 2–14 (ink 13.1 like the ring), corners at 5 / 11 so the 45° sides sit on the lattice, every corner r 1 as hexagon; alert's ! (stem 5–8.5, ⌀1.5 dot at 11.375); filled: octagon solid, ! knockout and hole. Lucide octagon-alert reference (Fluent has no cut) |
| toggle | pill track 12 × 8 (2–14 × 4–12, rx 4) with a solid ⌀3 knob concentric with the right end (10, 8; data-dot="free", a small solid in a container like stop-circle's square), standard 1.94 all round; filled: track solid, knob a hole. A 7-tall track read short beside folder |
| accessibility | Fluent's and Phosphor's arms-spread figure: head r 1.5 ring at 8, 3.5; arms raised at 45° from 2.5, 5.5 and 13.5, 5.5 to shoulders at 4.5 / 11.5, 7.5; torso 7.5–10; 45° legs to 4.5 / 11.5, 13.5 on the lattice; head to arms 1.38 tight. Line glyph: fills by weight, the head solid. Horizontal arms read as a T |
| discount | badge-check's badge exactly with a % inside: a 45° bar M6 10 L10 6 and ⌀1.5 dots at 6, 6 and 10, 10 (1.52 tight from the bar); filled: badge solid, bar knockout, dots holes. A badge, not a tag (Lucide badge-percent, Phosphor seal-percent): the tag's eyelet leaves no room for the % |
| currency-euro | € as an elliptical C (rx 4.5, ry 5.5, centre 9.5, 8; extremes on the type family's 2.5–13.5), ends at 45°; two bars 3 apart at 6.5 and 9.5 from 3.5 to 9.5 crossing the C's left side; vertical keyline like dollar; a line glyph (fills by weight); dollar's apparent size |
| cards | Phosphor's cards-three (owner, 2026-10-02): a card 2.5–13.5 × 7–13.5 (r 2) with two shorter lines above for the cards behind (3.5–12.5 at 4.5, 4.5–11.5 at 2), tight 1.38 apart; filled: the front card fills, the lines stay lines; ink centred at 7.75 (sits high, like a heavy base) |

Skipped: file-text (document has two text lines), chat-text (chat has two text lines), contact (id-card, Fluent's contact card), book-open (book is an open book). file-zip: a tooth column at x 6.5 leaves 0.19 to the fold; at 5.75 only two teeth fit above the fold; a column below the fold holds one tooth and the tab; a solid strip reads as a line, so archive or a later labelled file-type family (ZIP, PDF, CSV) stands in. chevron-first is chevron-last flipped. For the owner: image-plus and cart-add put the + top right (the lower right is the mountain, and the basket has no room); shield-alert's stem is 0.5 longer than warning's; toggle's knob, radio-button's centre and text-color's swatch are solid exceptions; headset's cups are shorter than headphones' for the boom; person-settings' gear is a ring with teeth (settings' gear at half size left 0.21 counters); navigation is send's dart turned 45°, a location arrow (all five libraries draw it), not an agent mark.

## Owner round, 2026-10-02

The owner's picks from the review sheets (`docs/research/icon-review/2026-10-02/`, sheet 10);
everything else on the recommendations. All back in review; values supersede earlier lines.

| Batch | Icon | Now |
|---|---|---|
| 50, 57, 1, 39, 57 | files, folders, copy, chat-multiple, gallery | Phosphor's layering (owner's pick over Fluent's halo): the back copy is the same shape and radius offset 3 along the diagonal, its visible edges joining the front's outline (`behind … 0`); generated by `multiples-phosphor.py`. files: a 7 × 10 page (3–10 × 4.5–14.5, r 2) with a 3.5 fold (r 1 inside; r 1.5 left a 0.82 pocket) and two text lines (5–8 at 10.5, 5–7 at 12.5), the copy up and right. folders: a 9 × 8 folder (2–11 × 5.5–13.5, tab to 5.5, step to 7, flap at 8.5), the copy up and right. copy: an 8 × 8 square (2.5–10.5 × 5.5–13.5, r 1.5), the copy up and right. chat-multiple: the bubble at 2.5–10.5 × 2.5–8.5, the second bubble mirrored (tail right) 3 down and right. gallery: a 9 × 8 picture (5–14 × 2.5–10.5, r 2, image's mountain and sun) with the copy down and left |
| 38 | library | Phosphor's books: an upright 3.5 × 10.5 book (2.5–6 × 3–13.5, r 1) and a leaning one (3.5 × 10.5, r 1, leaning 1 : 5 with its foot at 10.5, 13.5; data-angles free), bands 3 from each end (cuts when filled); standard 1.82–1.91 between the books |
| 62 | cards | new: Phosphor's cards-three (batch 62) |
| 28 | hand | filled: the palm fills (the silhouette as one solid), the finger lines stay in the outline and become filled-only gaps run up between the fingers |
| 23 | text-align-left, text-align-center | lines at 3.5, 7.5, 11.5 (x.5; the stack sits 0.5 high) |
| 23 | indent, outdent | lines at 3.5, 7.5, 11.5; chevrons moved 0.5 right to stay on the lattice (2.5–4.5, tip at 7.5); indent's lines 7–13.5 (tight 1.38), outdent's 8–13.5 (open 2.91; 7.5 left a 2.48 near miss); both centred at 8 across |
| 27 | waveform | bars at 2.5, 5.5, 8.5, 11.5, 14.5 (x.5; 0.5 right) |
| 58 | waypoints | Fluent's route: r 2 rings at 4, 11 and 12, 5 joined by an S of two r 2 quarter arcs (`M6 11A2 2 0 0 0 8 9V7A2 2 0 0 1 10 5`); filled: the rings fill |
| 58 | binoculars | Lucide's: barrels 2–6.5 (mirrored 9.5–14), 4.5 wide at the foot and 3.5 at the top, flaring at 8–10.5, top corners r 1 outside and r 1.5 inside, eyepieces 2.5 × 2.5 (3.5–6, r 1); a bridge at 7.5 and a band across both at 10.5 (a cut when filled) |
| 58 | person-chat | Hugeicons': chat's bubble holding a person (head r 1.5 at 8, 6; shoulders 5–11 from 9.5 to the bubble's foot, r 1.5); filled: the bubble stays a line and the person fills (a subject in a frame) |
| 57 | bandage | Hugeicons': a band 7.07 wide on the diagonal (corners 1.5, 9.5 · 9.5, 1.5 · 14.5, 6.5 · 6.5, 14.5; r 2), the pad between cuts at x − y = ±5, four ⌀1.5 holes at 8 ± 1.75 on both axes (detail 0.97 apart) |
| 5 | location (was pin) | renamed: it is the map pin (Fluent location); the pushpin is `pushpin`, slashed as `unpin` |
| —, —, 4 | subtract, padding-axis, flow-wrap | aliases (`data-alias-of`) of minus, padding-sides and grid: the lint holds each body identical to its base. subtract and padding-axis are in no batch (component glyphs). Components keep their names (NumberField's subtract, BoxField's padding-axis) |

Fixes the same day (owner: library, the filled hand, the filled bandage and binoculars looked
wrong; sheet 14):

- **library:** Phosphor's proportions: an upright 5 × 11 book (2.5–7.5, r 1) and a 3.5-wide book
  leaning 1 : 5 with its foot at 10.2, 13.5, its top corner touching the upright's (a join, as
  Phosphor's); bands 2.5 from each end. A standard gap between the books read as two capsules.
- **hand, filled:** the whole hand fills; the finger lines stay in the outline, and filled-only
  gaps run from the palm (8–8.5) up through each fingertip junction (to 1.5–4), so every finger
  reads. A palm-only fill read as a glove.
- **bandage, filled:** the band fills with the four dots as holes. The pad lines are outline-only;
  as cuts they split the band into three pieces.
- **binoculars:** square-ish caps (r 0.5 at the top corners and eyepieces), eyepieces 2.5 wide flush
  with the barrels' inner edges (4–6.5), bottoms r 1.5. The r 1–1.5 caps read as bottles.

Dots by role (owner, 2026-10-02, Cursor's roles; sheet 13): list-bullet's bullets ⌀2 (cx 3,
detail 1.0 apart, tight 1.44 to the lines; was ⌀1.5 at 2.75), crosshair's centre ⌀2, square-dot's
and circle-dot-dashed's centres ⌀2 (were ⌀3, the badge size). Dots grouped inside a container
(square-list, chat-more, app-window) stay ⌀1.5.

The overlap rule (owner, 2026-10-02, from Cursor's set; sheets 15 and 17): a gap is information,
never style.

| Icons | Now |
|---|---|
| files, folders, copy, chat-multiple, gallery | the back copy keeps Phosphor's geometry (same shape and radius, offset 3) but stops one overlap cut short of the front, an open L as Cursor's copy and folders (`behind … 2.3`; tight 1.17–1.18). The joins of the first pass are gone |
| bell-off, bug-off, brain-off, camera-off, cloud-off, flask-off, link-off, mic-off, star-off, unpin, video-off, wifi-off | outline: the base drawn whole (outline-only `line`s) with the slash flat on top, no gap (`flat-slash.py`); filled unchanged (fill parted by a gap, lines cut one-sided). Slivers against the slash recorded with `data-counter="sliver"` (camera-off, flask-off, unpin, as mic-off); video-off takes the circle keyline (the whole video under the slash is 13.6 × 13.1) |
| alarm | closed bells: r 2 lobes at 4, 5 and 12, 5 joined to the ring (filled: solid, parted from the ring by a gap at r 5.625) |
| strikethrough | one continuous S (the upper bowl runs on through C4.5 7.25 6.25 8 8 8 into the lower) crossed by the bar |
| shapes | circle (6, 6, r 3.5) and square both whole, crossing; filled, the square fills and the circle stays a line with a `halo` |

Kept with the overlap cut: people, coins, cloud-sun (layers), every corner mark and badge.

Closed (2026-10-02, delegated on the recommendations; sheet 20): the list family's stacks were
already on x.5 (4.5, 7.5, 10.5) from the owner round. chip moves to x.5: an 8 × 8 body
(3.5–11.5, r 1, so the pins meet the corner arcs' ends as the 9 × 9 r 1.5 body's did) with three
pins a side at 4.5, 7.5 and 10.5 (1.5 long), the hub ring at 7.5, 7.5 (tight 1.38); the ink box is
unchanged (12.1) and sits 0.5 up and left, as the stacks sit 0.5 high. blocks and toy-brick keep
their drawings (owner preferred them to the pyramid and lego candidates, which are removed).

## Batch 63: Coverage round 2, 2026-10-02

| Icon | Construction |
|---|---|
| exit-door | Lucide's door-open simplified: a frame (left post at x 3.5, r 1.5 top corner, a 1-long top stub to x 6) on a floor line 2–6 at y 13.5; the open leaf a perspective quadrilateral (8.5,2.5)(13.5,5)(13.5,12.5)(8.5,14) with r 1 fillets (top 1:2, bottom 3:10, one vanishing point; data-angles free); a ⌀1.5 knob at 11, 8.5, 2.5 from both leaf edges (tight 1.19). Filled: the leaf solid, the knob a hole; frame and floor lines. Centre x 7.75 |
| locate | Lucide's locate-fixed: an r 4.5 ring at 8, 8 with four 1.5 outer ticks to 2 and 14, and the shared r 1.5 hub ring 3 inside it (standard 1.87); distinct from crosshair, whose ticks cross its r 6 ring. Filled: ring and ticks by weight, the hub solid |
| lasso | Lucide's lasso: an ellipse (centre 8, 6, rx 5.5, ry 3.5) as one large arc whose ends join an r 1.5 knot ring at 4, 10 at its solved intersections, and a short r 3 tail from the ring's foot to 5.5, 13.5. Line glyph; data-angles free |
| pilcrow | On the type family's 2.5–13.5 cap height: stems at 8.5 and 11.5 (standard), the top bar to 12.5, an r 3 bowl from 8.5 round to 6.5 and down to 8.5 closed against the stem. Filled: the bowl solid (a typeset pilcrow's), the stems lines |
| insert-row | Lucide's between-horizontal-start: two 7 × 4 r 1 row cards at 6.5–13.5 × 2.5 and 9.5 (standard 1.88 apart) and a 2.5px contained chevron M2.5 5.5L5 8L2.5 10.5 pointing into the gap (tight 1.41). Filled: the cards solid, the chevron a line |
| spell-check | text-size's large T exactly (ticks 1.5, foot 4) with the beside-a-shape check 1.5/3 at M9.5 10.5L11 12L14 9, 0.5 above the foot for the gap scale (tight 1.7); Area's T, not the libraries' A (type family). Line glyph; horizontal keyline |
| text-wrap | Lines at 2.5, 6.5, 11.5: a full line 2.5–13.5; the middle line wrapping through an r 2.5 arc (extreme 13.5) back to 8.5 at 11.5, ending in a 2.5px contained head (11,9)(8.5,11.5)(11,14); a short last line 2.5–5.5, 3 from the head. Line glyph; centre y 8.25 |
| file-search | document's base and fold exactly with an r 2 lens at 10, 11 and a 45° handle to 13, 14 replacing the lower-right corner, the page cut round the lens by the overlap cut. Filled: page fill + line, the fold a cut, the lens solid, parted from the page by a filled-only gap circle r 3.125, the handle a line. Centre x 8.25 |
| file-spreadsheet | document's base and fold exactly; Lucide's four cell dashes in two columns (5.5–6.5 and 9.5–10.5) on document's text rows (9 and 11.5), 1.88 apart, detail 0.88 to the page edges. Filled: dashes knocked out like document's lines |
| rss | Two quarter arcs about the corner 2.5, 13.5 (r 6.5 and r 11, ending on 2.5 and 13.5) and a ⌀2 source dot (the mark size, wifi's) at 4, 12, open 2.82 from the inner arc. Line glyph |
| file-pen | document's base and fold exactly with a small 45° pencil on the lower-right corner (sides x + y = 20 and 25, back x − y = 3, a square tip at 8.5, 14; r 1 back corners, r 0.75 tip), the page cut behind it by the overlap cut, a tight 1.29 from the fold. Filled: page fill + line, fold a cut, the pencil solid, a filled-only gap round it. No ferrule (no room). Centre x 8.55 |
| folder-lock | folder's base and flap exactly with file-lock's lock (4 × 3 r 0.5 body, r 1 shackle) and its filled-only gaps moved (+1, −1), 0.5 inside the folder's lower-right corner as on file-lock's page; the folder cut behind the lock; the shackle counter 0.93 as file-lock's |
| chart-gantt | chart's axis exactly (M2.5 2.5V13.5H13.5) with three staggered task bars as lines at 4.5, 7.5, 10.5 (standard; the last 3 above the axis): 7.5–12.5, 5.5–9.5, 9.5–13.5 (Lucide's stagger). Line glyph |
| webhook | Lucide's webhook by a rule: three r 2 hook loops at 8, 4.5 · 11.5, 11 · 4.5, 11; each arm runs from one loop's centre straight to its tangent on the next and wraps 200° round its outside; the arms never cross (data-angles free). Sits 0.25 high (centre 7.75). Line glyph; reads light beside its neighbours |
| voicemail | Two r 2.25 reels at 4.25, 7.75 and 11.75, 7.75 joined by a tangent foot 4.25–11.75 at y 10 (Lucide's, Phosphor's and Hugeicons' symbol); r 2.5 reels 7 apart closed to 0.5 when filled; the ink sits 0.25 high to keep circle extremes on the grid. Line glyph; horizontal keyline |
| phone-missed | call's handset exactly (solid) with the 3.5px × beside it, centred at 12, 4 where call-incoming's arrow sits (volume-off's construction); centre 8.68, 8.08 like the call family. Filled: handset solid, × a line |
| broadcast | A ⌀2 centre dot (a mark) and paired arcs at r 3 and r 6 about 8, 8, each ±45° about the horizontal, extremes on 2, 5, 11, 14; dot to arc 1.44 tight, arcs 3 apart (standard, wifi's). Line glyph; circle keyline |
| cast | A screen frame 2.5–14 × 2.5–13 (r 2) cut open at its lower-left corner for the waves (a mark on the host's corner): quarter arcs r 2.5 and r 5 about 2.5, 13 and a ⌀1.5 source dot, every gap tight 1.375; the frame resumes at y 5.5 and x 10. Filled: the frame fills, cut back along r 7.5 about the corner (Phosphor's screencast-fill); waves and dot lines |
| image-off | image whole as outline-only lines under the shared slash, flat (data-counter sliver). Filled: a fill parted by the slash's gap, the mountain's left leg a knockout, the sun a hole. Exception: the slash runs 1.41 from the mountain's right leg (a 0.29 sliver) and through the sun's centre |
| radio | A 12 × 8 body at 2, 5 (r 2) with a 45° antenna M5 5L7 3 joined to its top; an r 1.5 speaker ring at 10.5, 9 and two dial lines 4.5–6.5 at 7.5 and 10.5 (Phosphor's radio, two lines); the ring a detail 0.88 from the right wall. Filled: body solid, ring and lines knockouts, antenna a line; horizontal keyline |
| battery-charging | battery exactly (data-gap close, inherited) with a line bolt M7.5 6.5L6 8H8L6.5 9.5 inside (detail 0.88, data-acute sharp), a 2 × 3 cut of cloud-lightning's bolt. Fluent's bolt over the top edge opened 6.4 of its 11 under the overlap cut. Filled: body solid, bolt knockout |
| battery-low | battery exactly (data-gap close) with a level line M4.5 7V9 at the left (tight 1.38 top and bottom, standard 1.88 to the wall). Filled: body solid, the level knocked out (Fluent's battery_1) |
| brightness | Lucide's and Phosphor's sun-dim: an r 2.5 core and eight ⌀1.5 dot rays on r 5.75 (axis dots on the grid, core to dot 1.94 standard, dots 2.9 apart open); distinct from sun's line rays on purpose. Filled: core solid |
| devices | A small desktop behind (screen 2–11 × 2.5–9.5 r 1.5, stand M6.5 9.5V12, foot 5–8) and a phone in front (10.5–14 × 6.5–13.5 r 1), the desktop overlap-cut round the phone (a layer). Filled: both fill, a gap round the phone, the stand a line |
| gamepad | Fluent's games stadium (12 × 9 at 2, 3.5, r 3.5) with a 3px d-pad + at 6, 8 and ⌀1.5 buttons at 10, 9.5 and 11.5, 7 (tight 1.19–1.6). Exception: a 3px plus; the shared 4px has no room. Filled: body solid, d-pad knockout, buttons holes |
| signal | Four bars at 3.5, 6.5, 9.5, 12.5 (bar-chart's 3 spacing, standard) ending at 13.5, 2, 5, 8 and 11 tall. Line glyph |
| usb | Fluent's usb_stick: a 7 × 9 body at 4.5, 5.5 (r 2) with a 5 × 4 plug shell open at its foot (r 1) joined to the body's top. Filled: body solid, the plug a line (hollow); vertical keyline |
| scan-face | scan-check's four r 2.5 corner brackets exactly with smile's mouth and ⌀1.5 eyes at 5.75 and 10.25, 6.5 (0.25 in from smile's: 2.22 to the brackets was a near miss; now 1.98 standard). Line glyph |
| shield-off | shield exactly, drawn whole as outline-only lines under the shared slash, flat; filled: the shield a fill parted by the slash's gap (camera-off's model) |
| badge | badge-check's scalloped seal alone (path exactly), solid when filled |
| handshake | line glyph: two vertical cuffs; the left hand's top line and diagonal palm with an r 1.06 finger bump, the right hand along the top to an r 1.06 thumb loop and finger arc, a second bump below; 45° lattice; the touching hands join; centre x 8.25; fills by weight |
| meh | smile's ring and ⌀1.5 eyes exactly with a straight 5px mouth at y 10.5 (knockout) |
| basket | a tapered body 11 wide at the rim and 7 at the base (r 1.5 foot, r 0.5 rim corners) with slats at 6.5 and 9.5 (knockouts) and a 90° handle peak from 3.5 to 12.5 on the lattice |
| piggy-bank | one silhouette: a round back (r 5), a pointed ear, a 1 × 3 snout, two U feet 2 wide; a ⌀1.5 eye (hole) and a 2px coin slot (knockout) |
| scale | post at x 8 (2.5–13.5), beam at 4.5 (4–12), a 6px base; two pans, each a 60° V from the beam's end closed by an r 1.75 bowl (solid; the 60° apex keeps the acute rule, shallower than Lucide's); lines stay lines when filled |
| cloud-snow | cloud-rain's cloud (foot 11) moved, never redrawn; one row of three ⌀1.5 flakes at y 13.5 (x 5, 8, 11), tight to the foot; two rows don't fit the keyline |
| dice | an 11 × 11 square (r 2) with five ⌀1.5 pips (holes) at 5, 8, 11, tight to the frame and open between pips |
| hammer | a head drawn in a 45° frame: a flat face end (r 1 corners) and a claw end curving to a tip (r 4 and r 7 arcs); a single-line handle to the lower left (an outlined handle doesn't fit the lattice at a readable width); head solid, handle a line; centre x 7.8 |
| notebook | a 7 × 12 page (r 2, x 5.5–12.5) with three ring ticks crossing its left edge (3.5–7 at 5, 8, 11); filled: the ticks a halo plus line so the rings read |
| party-popper | a cone from an r 1 filleted tip at the lower left to a convex r 6 mouth (solid); confetti of three short lines (vertical, 45°, horizontal) and two ⌀1.5 dots on tight gaps; every line on x.5 (0.4 off centre) |
| pentagon | a regular pentagon with r 1 corners (hexagon's), 2 to 14 like octagon-alert, circumradius 6.76, ink centred |
| octagon | octagon-alert's outline alone (path exactly) |

For the owner: spell-check is Area's T with a check (the libraries use an A); pilcrow's bowl fills solid; file-pen's small pencil has no ferrule; webhook reads light; image-off's slash runs close to the mountain's leg and through the sun; battery-charging's bolt sits inside the battery (Fluent's over the edge lost the top under the overlap cut); gamepad's d-pad is 3px; cloud-snow has one row of flakes; hammer's handle is a line; several sit off centre for their marks (exit-door, file-pen, file-search, handshake, party-popper). Candidates for the rejected blocks and toy-brick are on the Exploration sheet (blocks-pyramid, blocks-pyramid-joined, toy-brick-lego).

## Batch 64: Zip archive, 2026-10-02

| Icon | Construction |
|---|---|
| folder-zip | Fluent's folder_zip on folder's drawing exactly (unmoved, so it lines up with folder, folder-add and folder-lock). Four solid teeth as Fluent's: 1 tall and 2 long with r 0.5 outer ends, alternating right, left, right, left about x 10.5 on whole-pixel rows 6–10, touching only at their inner corners so each row reads (crisp at 1×); right first so the left teeth clear the flap's diagonal (1.41); 0.94 from the right edge and the top. A hollow slider tab 3 wide (r 1.5 top, r 0.5 feet) at 9–12 × 10.5–14 joined to the last tooth and to the folder's bottom line, hanging 1 below it as Fluent's (square keyline; ink centre 8, 8.5). Filled: the folder fills (flap a cut), the teeth are holes, the tab solid, parted from the fill by a filled-only gap, so the white teeth run into the white gap as in Fluent's filled. Exceptions: the teeth are solid (a zipper's teeth are solid, like stop's square) at Fluent's 1px rather than the line; the ink sits 0.5 low for the hanging tab |

Owner, 2026-10-02: Fluent's zip visual over the file-zip drawn the same day (Lucide's file-archive: one tooth column and a ring pull on document's page), which is removed. archive remains the box.

Redrawn later the same day (owner: larger teeth, closer to Fluent's, the pull joined to the teeth): the strip of five 1-long line teeth read as one dense column and the pull sat cut loose from a folder missing its corner. The teeth are now Fluent's solid bars and the tab hangs from the last tooth over an intact folder.

## Cleanup round, 2026-10-02

Owner: blocks and toy-brick stay as drawn, blocks' filled variant needed fixing; then a pass over
the set for consistency and finish (whole-set grid at 32 and 16px, the `--parts` and `--audit`
reports, filled sheets of batches 55–63; references in `icon-references.json`, group
`cleanup-1002`).

| Icon | Change |
|---|---|
| basket | Lucide's shopping basket: a 12-wide rim (2–14 at 7.5) on a body tapering to 9 (3.5–12.5 at 13.5, r 1.5 feet), two handle legs at 1 : 2 (4, 7.5 → 6.5, 2.5 and mirrored, tops 3 apart, detail 1.11 from the slats) and two slats. Phosphor's peaked handle on a tall body read as a cupcake; an arched handle read as a shopping bag. Filled: the slats are cuts (square, through the body) |

Looked at and kept: file-spreadsheet (the four cells are Lucide's construction; a ruled grid read as
a ±), voicemail (the widest the horizontal keyline allows; Fluent reads larger only because it
frames it), grip (Fluent's re-order lines, distinct from grip-vertical's dots), vault, call-end.

For the owner: image-off's sun sits on the shared slash (image's sun is at 6.5, 6.5 on the
diagonal), so the slash runs through it; Fluent's sun is top-right and Lucide drops it. handshake
reads busy beside Fluent's and Hugeicons'; webhook still reads light.

Owner, same day (sheet 23):

| Icon | Change |
|---|---|
| blocks | four separate blocks of one size in the outline too: 4 × 4, r 1, at 2–6 × 3–7, 2–6 × 10–14 and 9–13 × 10–14 (standard 1.88 apart) and the fourth offset up and right at 10–14 × 2–6 (Lucide's blocks); whole-pixel edges so the set centres on 8; each solid when filled. r 1.5 on a 4 × 4 block read as a ring |
| image | Fluent's arrangement, so image-off's slash misses both parts: the sun a ⌀1.5 dot (the family's detail dot, as gallery, images and file-image) at 10.25, 5.75, standard 1.94 from the top and right edges; the mountain is Fluent's pyramid, its corner on the diagonal at 8, 8 rounded r 1 (a sharp corner left the filled peak pointed: the peak there is the inner side of the cut) and both slopes running at 45° into the bottom corners' midpoints (3.09, 12.91 and 12.91, 12.91). A peak left of centre left a 1.0 strip of fill between the slope and the slash when filled (owner) |
| image-off | image with the shared slash flat on top: only the mountain's left slope is drawn, to the slash's centre (8, 8), where the slash covers its end (Fluent's image_off); filled, it is a gap ending under the slash. No slivers in either variant |
| image-plus | the + moves to the lower-right corner (the placement rule; the top right now holds the sun): frame and mountain cut round it by the overlap cut, the right slope ending 2.25 short of it |
| images, gallery | the same mirror inside their pictures (sun right, peak left). file-image keeps its sun at the left, where the page's fold leaves room |

Negative-space ends (owner: "why do the strokes that are negative space have rounded ends?"): a
knockout that reaches a solid's edge now runs out through it with a square end, as a cut does
(the generator adds a 1px butt extension at every knockout end that lies on a solid's outline;
basket, table, film, ruler, piano, the corner marks and 25 others). Free ends inside a solid keep
round caps, matching the outline's line ends. Sheet 24.

Slivers (owner, same day: "this small piece of the background from behind the stroke is
unnecessary. just align it with the stroke… fix it everywhere"; sheet 25). A scan,
`docs/research/icon-review/2026-10-02/slivers.mjs` (`SLIVER_PNG=out.png` marks each hit in red),
rasterises every icon at 8× and reports hairlines of ink or space under about 0.6px and fill left
beside a line drawn over it under about 1.1px. Fixed:

| Icons | Fix |
|---|---|
| the twelve slashed icons with a filled gap (bell-off, brain-off, bug-off, camera-off, cloud-off, flask-off, image-off, mic-off, shield-off, star-off, unpin, video-off) | the slash's filled gap sat 1.31 from the slash, spaced for a bold slash, but the slash is drawn at the icon weight, so a 0.19 hairline of fill ran along it; the gap now sits flush, 1.125 from the slash's centre (`M0.909 -0.682L16.909 15.318`) |
| image, image-off | the pyramid mountain above |
| file-search | the lens moves to 10.5, 10.5 (r 2, on the diagonal lattice; handle to 13.5, 13.5; vertical keyline, centre 8.5): its filled gap (r 3.125, flush with the lens) now reaches the fold's cut on its own; filled-only gaps clear the page's right edge between fold and lens and its bottom edge under the lens, and the outline's right edge ends at the fold (no stub) |
| file-code | the chevrons move down 1.5 (10.5–14.5) onto the page's bottom edge, the page cut round them; their halo stayed 0.25 from the fold's cut. Vertical keyline (13.6 tall), centre 8.25, 8.25 |
| flask-off | unchanged beyond the slash's flush gap (owner: the part past the slash should stay); a side gap that cleared the 15° wedge took too much of the neck and shoulder |
| library | the leaning book moves 0.5 right and the upright narrows to 4.5 (2–6.5): the books part by 1.09 at the top instead of touching, which left a 3px hairline wedge between them. The bands are outline lines with filled-only gaps that end 1 past their own book (a cut's 2px run-out nicked the other book) |
| utensils | the fork's tines are 2.5 apart (2.5, 5, 7.5) and the knife moves to 10.5–13, so the filled 1.5 lines keep a 1.0 gap (tines 2 apart left 0.5) |
| person-settings | the gear's filled hub is a gap circle r 0.5625 (a hole 1.125 across); an r 0.375 circle stroked wider than itself drew a ring with a dot in it |

Kept: files' two text lines (0.875 of fill between two cut-outs, the outline's detail gap
inverted).

Generator, same round: a cut with several subpaths extends each subpath at both ends (only the
first start and last end ran out, so library's and basket's second bands stopped short of an edge;
briefcase's band, which stops at the clasp on purpose, is now an outline line and a filled gap);
a knockout's run-out through an edge is 1px.

Owner picks, same day (sheets 27 and 28; "go with your recs"):

| Icon | Change |
|---|---|
| image, image-off, image-plus | the sun is the ⌀2 mark dot (Fluent's sun) at 10, 5.5 in all three: tight 1.44 from the top, standard 1.83 from the mountain, open 2.71 from image-plus's + (at 10, 6 the + was a 2.25 near miss) |
| bot-lead | the three dots above the crown removed (owner) and the crown's top raised 1.5 into their room, so its inside is 2.9 across instead of a hairline; ink sits 0.24 low |
| handshake | redrawn after Hugeicons' agreement: one top line across both hands (r 1 bends), the right hand's thumb folding down to an r 0.75 knuckle and back, then down to the right edge, and the left hand's fingers wrapping under to meet it; no cuffs. Line glyph, 45° lattice |
| webhook | loops r 2.5 on a wider triangle (centres 8, 4.5 · 11.75, 11 · 4.25, 11), same rule (arms from a loop's centre to the next loop's tangent, wrapping 200°); circle keyline |

Owner round 2, same day (sheets 29–31):

| Icon | Change |
|---|---|
| gallery | image's pyramid inside the front picture: corner at 9.5, 7.5 rounded r 1, slopes at 45° meeting the picture's bottom corner arcs (6.55, 10.45 and 12.45, 10.45; standard 1.92 to the back copy's bottom line), the ⌀1.5 sun at 11, 5 (tight 1.19 from the top, standard 1.88 from the slope). The back copy, down and left, is the owner's preferred layering |
| images | an alias of gallery (`data-alias-of`): both were labelled Gallery, and images, built on copy's old layering, had missed the multiples update |
| file-image | image's pyramid on the page: corner at 8, 10 rounded r 1, slopes into the page's bottom corner arcs; the ⌀1.5 sun stays left (6, 7), where the fold leaves room |
| bot-lead | the crown's top 0.5 higher again (2 in all), which centres the bot (7.99) |

Kept: voicemail unframed. A frame in Area is either the object itself (image, app-window) or a
variant of a base glyph (the -circle and square- families); only Fluent frames the tape.


## Open four, 2026-10-02 (owner-flagged, drawn on the references)

| Icon | Construction |
|---|---|
| file-code | document whole (Lucide, Phosphor and Hugeicons keep the page closed): two 1.5-leg chevrons inside its lower half, M7 9L5.5 10.5L7 12 and M9 9L10.5 10.5L9 12, on the lattice, detail 0.88 to the edges and each other, tight 1.41 from the fold. Filled: page solid, fold a cut, chevrons knockouts. Replaces the chevrons on the corner, which left the page without a bottom line |
| vault | Lucide's and Phosphor's dial: a 12 × 7 safe (r 2, 3.5–10.5) on two feet at 3.5 and 12.5, an r 1.5 dial ring at 6.5, 7 with a handle bar to 11 (standard to the wall; open to the feet). Replaces the four-spoke dial, which read as ¤. Filled: body solid, dial and handle knockouts, feet lines |
| circuit-board | Lucide's circuit-board: stop's square with two r 1.5 pads at 6, 6 and 10, 10, each with a trace that turns an r 1.5 corner out to the board's edge (top and bottom), in rotational symmetry. Replaces two side traces with r 1 pads, which read as §§. Filled: board solid, pads and traces knockouts (the traces run out square at the edge) |
| call-end | Fluent's hang-up handset made larger (owner: it read small): 12 wide (2–14) and 6 tall (5–11), a shallow top (rise 3.5), earpieces 4.5 wide with r 1 corners and a shallow inner curve. A taller arch read as a horseshoe. Solid when filled |

## Batch 65: Build queue, 2026-10-02

| Icon | Construction |
|---|---|
| file-diff | Lucide's file-diff: document's silhouette (the cut corner kept) without the inner fold, a 3px + (M8 6V9 M6.5 7.5H9.5) over a 3px − at 11.5, every gap tight (1.38 between the marks and to the bottom, 1.70 to the cut corner). Filled: page solid, marks knockouts. Exception: no fold line; under the fold the + touched it (−0.125, the lint does not pair knockouts with cuts) and no 3px stack fits with gaps on the scale
| chat-question | chat's bubble exactly with help's ? at 2/3 (an r 1 hook at 8, 5.5, top 4.5 like chat-warning's !, M7 5.5A1 1 0 1 1 8.5 6.36603Q8 6.655 8 6.875) and the ⌀1.5 dot at 8, 9.25. Every gap detail (0.88–1.06), as the !'s. Filled: bubble solid, ? knocked out, dot a hole. The ? ends 0.5 lower than the ! (an r 0.75 hook closes up) |
| plug-off | Fluent's plug_disconnected (owner's pick over plug under the slash; `data-off="own"`): the plug pulled apart on the rising diagonal. A cap and a body, each a 4.95 face with r 0.75 corners, 1.41 sides and an r 2.47 dome (the body is the cap turned 180°), faces 4.24 apart on x − y = ±3; two 1.41 prongs from the body's face at 5.5, 8.5 and 7.5, 10.5 (tight 1.7 to the cap); cords from the domes to 13.5, 2.5 and 2.5, 13.5. Filled: cap and body solid, prongs and cords lines
| binary | 01 over 10 (Lucide binary) in rows 2.5–6.5 and 9.5–13.5 (standard 1.88 apart): 0 a 3 × 4 stadium (r 1.5, counter 1.93), 1 a flag, stem and foot (M9 2.5H10.5V6.5M9 6.5H12); 0s at x 3.5 and 9, 1 stems at 10.5 and 5; 1 to 0 1.65 tight. Fills by weight. Exception: the ink centre is 7.75 (the right column moved 0.5 left from a 2.12 near miss) |
| goal | target's r 6 and r 3 rings and ⌀2 centre dot with a 45° dart shaft from the dot to 10, 6 and Fluent's two-feather fletching (M10 6V4L11.5 2.5H12V4H13.5V4.5L12 6H10Z, 0.5 flats at the tips, pocket 1.35); both rings cut round dart and fletching by the overlap cut. Filled: the fletching solid; rings, shaft and dot by weight |
| radar | a 45° sweep from the centre that becomes the r 6 ring (M8 8L12.243 3.757A6 6 0 1 0 14 8) and an r 3 ring from the sweep round to 11, 8, both open over the eighth between the sweep and 3 o'clock (a quarter pushed the ink 0.9 left), with a ⌀2 centre dot (Hugeicons Radar01). Fills by weight |
| broom | Lucide's broom (owner: more broomlike than Fluent's dome and strip): a 45° handle M8 8L13.5 2.5 into a wedge head that flares from a 2.83 binding to a 7.07 bristle tip (r 0.5 top and r 1 tip corners; data-angles free), a band across it (M4.25 8.25L7.75 11.75) and one bristle line (M6 10L4 12). Filled: head solid, band a cut, bristle a knockout, handle a line. Centre 7.87, 8.14

Removed by the owner the same day as too niche (no real product use, few systems have them, or not liked): compass-check, bug-play, brain-thinking, folder-dashed, chat-dashed, satellite, the three cost tiers and beach. Left out: braces-dot (a dot at the lower right takes the right brace's hook, so it reads as ?; batch 46 dropped it for the same reason), deck-chair (three drafts read as a cross or a generic chair at 16px; beach stands in, as Fluent's), file-pdf (needs a small bold letter set) and head-thinking (open).

## Batch 66: Build next, 2026-10-02

| Icon | Construction |
|---|---|
| pencil-off | pencil drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap. Exception: the ferrule band is dropped (it runs parallel to the slash 3.54 away, a near miss) |
| zap-off | flash's sharp bolt (data-acute sharp) drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap. Circle keyline (14.1 tall, video-off's move) |
| location-off | location's pin and r 2 ring drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap, the ring kept as a hole (Fluent's). Circle keyline |
| chat-off | chat's bubble drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap. The text lines are dropped (the slash would run through their ends) |
| screen-share-off | screen-share's monitor and stand drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap; the stand a line cut one-sided. The share arrow is dropped (its barb left a 0.18 counter on the slash; Fluent swaps it too) |
| bookmark-off | bookmark's notched ribbon drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap |
| heart-off | heart (Fluent's) drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap. Circle keyline as the base |
| flag-off | flag's swallowtail and pole drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (flat-slash.py); filled: a fill parted by the one-sided slash gap; the pole a line cut one-sided |
| bluetooth-off | bluetooth's rune under the shared slash through 8, 8 (where its strokes already meet); a line glyph, filled as wifi-off with stroke pieces cut one-sided at 2.5 |
| cloud-alert | the one cloud with chat-warning's ! inside on x 8 (stem 5.75–7.75, ⌀1.5 dot at 10); detail 1.02 to the lobe, tight 1.19 to the foot. Filled: cloud solid, stem knockout, dot hole. Lucide's ! crosses the foot; that left a 0.3 sliver filled |
| clock-alert | clock unchanged with a ! beside on the lower left (Fluent's side; stem x 2.5, 8–10.75, ⌀1.5 dot at 2.5, 13.5), the ring cut open round it by the overlap cut. Filled: the disc follows the cut, hands knockouts, the ! a line. Centre 8.16 |
| shield-user | shield with person-circle's small figure inside (r 1.5 head at 8, 6; r 2 shoulders 6.5–9.5 at 10 running out to the shield, Lucide's shield-user). Filled: negative silhouette as person-circle |
| shield-x | shield with error's 5px × centred inside (as shield-check takes the ring's check), tight 1.16. Filled: × knockout. The 3.5px × left a near miss |
| shield-plus | shield with add-circle's 6px + centred inside, tight 1.38. Filled: + knockout. The 4px + left a near miss |
| mail-plus | mail's envelope with the 4px + on the top-right corner (12, 5.5; mail-dot's and Fluent's badge corner), the envelope and flap cut open round it. Filled: flap a gap, + knockout carried out through the edges. On the lower right the cut left a 1.8 stub of the flap |
| person-x | person-add's figure with the 3.5px × beside at head height, centred 12, 5 (on the lattice), standard 1.88 from the head. Filled: figure solid, × a line |
| person-key | person-add's figure with a small upright key in the + column at x 12 (r 1.5 bow at 12, 4.5; shaft 6–13; key's two teeth), standard 1.88 from head and body (Lucide's user-key). Filled: figure solid, key a line. Exception: the shaft on a whole pixel, as person-add's + |
| file-cog | document's page and fold with person-settings' gear on the lower-right corner at 10.5, 11.5 (file-search's corner, 1 lower to clear the fold), the page cut round it. Filled: page fill notched r 5, gear solid with a ⌀2.25 hole. data-angles radial. Sliver: the gear's fill-beside-line, shared with person-settings |
| file-download | file-export's page with its arrow turned down (stem x 10.5, 9.5–13.5, 2px head) on the lower-right corner, the page's bottom cut 2.25 from the barb. Filled: arrow knockout, its tip carried out by a filled-only gap (document-add's). Pairs with file-export |
| password | a 13 × 9 field (r 2, 1.5–14.5 × 3.5–12.5) with three ⌀1.5 dots at 4.75, 8, 11.25 on y 8 (grouped dots in a container): standard 1.94 to the sides, tight 1.75 between. Filled: field solid, dots holes |
| volume-low | volume's speaker exactly with only its inner wave (tight 1.38). Filled: speaker solid, wave a line. Sits under its keyline, as the base speaker does |
| merge | split turned over: two 45° branches from 3, 14 and 13, 14 meet at 8, 9 and run on as one stem to a 3px main-arrow head at 8, 2. Line glyph |
| duplicate | copy's two pages exactly (front 8 × 8 r 1.5, back Phosphor's open L) with the 4px + centred inside the front at 6.5, 9.5 (Lucide's copy-plus). Filled: front solid, + knockout, back a line. Exception: the + sits a detail 0.88 inside the front |
| toggle-off | toggle mirrored: the same 12 × 8 track (r 4) with its solid ⌀3 knob at the left (Fluent's toggle_left is solid too). Filled: track solid, knob a hole. data-off own (a state, not a slash) |
| share-nodes | three r 2 rings at 4.5, 8 · 11.5, 4.5 · 11.5, 11.5 joined by two 1 : 2 lines to the left ring (Fluent, Lucide and Phosphor join them; data-angles free). Filled: rings solid, lines at icon weight |
| git-fork | git's three r 1.5 nodes (4, 4 · 12, 4 · 8, 12) joined by a U of git-branch's r 3 arcs to a bar at 8.5 and a stem into the lower node (Lucide, Phosphor, Fluent). Filled: nodes solid |
| git-compare | nodes at 4, 4 and 12, 12, each with a path turning an r 2 corner toward the other node and ending in git-pull-request's head a tight 1.38 from it; the second path is the first turned a half turn (Fluent's branch_compare). Filled: nodes solid |
| bluetooth-connected | bluetooth's rune with a ⌀1.5 dot each side at 2.5, 8 and 13.5, 8, standard 1.99 from the diagonals (Fluent's dots). Line glyph; circle keyline |
| playlist | list's four lines (3.5–12.5) shortened to 14, 9.5, 7, 7 with a note at the lower right: music's head at r 1.5 (11, 11.5), a stem at 12.5 up to 6.5 and a 45° flag (Lucide list-music, Phosphor playlist). Filled: head solid. Centre 8.25 |
| chart-bar-horizontal | bar-chart mirrored across the anti-diagonal: the axis L kept, bars at 4.5, 7.5, 10.5 from x 5 to 12.5, 10 and 7.5 (longest on top). Line glyph |
| equal | two of minus's 11px bars at 6.5 and 9.5, 3 apart (Lucide equal, SF equal). Line glyph |
| person-square | stop's r 2 square with person-circle's figure (r 1.5 head at 8, 6; r 2 shoulders 4.5–11.5 from 10 to the bottom edge; Lucide square-user). Filled: the frame stays a line and the figure fills (knocking the figure out of a solid square left slivers at the straight sides) |

Later from the same list: book-plus, the diagonal circle arrows, toolbox, scroll, gavel; and the 3-of-5 product essentials in the report.

## Mark pass, 2026-10-02 (owner: "make sure the icons that have small pluses, arrows, slashes, !, active dots… are designed consistently and correctly")

Inventory: `docs/research/icon-review/2026-10-02/marks.py` (every +, −, ×, ✓, arrowhead and dot by size); scan: `slivers.mjs`, now also flagging islands (small non-round pieces of fill cut off by knockouts and gaps, not the outline's own strokes). Sheets 39a–b (before and after, alone at 16 / 24 / 32 / 48).

| Icon | Change |
|---|---|
| file-download | the arrow sits in the plus's 4 × 4 box raised 1 (M10.5 9V12.5, head 8.5,10.5 → 12.5,10.5), the tip inside the page: the tip run out through the bottom edge cut off two triangles of fill under the barbs (the owner's report); only the right barb's end runs out square |
| file-export | the same box (M9 10.5H12.5, head 10.5,8.5 → 10.5,12.5), the tip out through the right edge; the lower barb's triangle was joined by a 0.5 sliver |
| folder-check | a filled-only gap carries the check's vertex out through the bottom edge (calendar-check's and clipboard-check's treatment); the fill met it at a point |
| file-lock | the shackle's gap extended up the right edge (file-search's), removing an island between the fold cut and the shackle |
| cart-add | the + stays a line beside the basket and the fill is notched round it at the overlap cut (filter-add's); filled, its top half had vanished into a ⊥ |
| files | one text line (M5 11H8, standard 1.88 from the fold): two lines 2 apart left a 0.875 strip of fill between them |
| unpin | the filled variant is pushpin's own path (needle at x 8, as the outline), stopping on the neck line where the flare met the slash gap |
| flask-off | the filled shoulder wedge past the neck line, tapering into the slash gap, is trimmed; the neck stays (owner: "the part past the slash should stay") |
| search-off | the lens drawn whole under the mirrored slash, flat, like the other off icons; filled as wifi-off (stroke pieces cut one-sided at 2.5) |
| brain-off | data-counter="sliver" removed (no sliver) |
| info, help, octagon-alert | the dot moved so the dot sits 2.75 below the stem's end (tight 1.44) with its edges on the 0.5 grid |
| chat-warning, cloud-alert | warning's ! exactly (a 1.75 stem, the dot 2.75 below it); their stem–dot gap was a detail 0.94 |
| stop-circle | filled: the ring fills solid and the square is a hole, as play-circle and pause-circle (it filled by weight with a solid square) |

Rules settled:
- **!:** a ⌀1.5 dot 2.75 below the stem's end (1.44); stem by host: 3.5 in a large host (octagon, info's i), 1.75 in a small or tapering host (warning, chat-warning, cloud-alert), 2.25 in the shield (recorded), 2.75 beside a host (clock-alert). **?:** help's hook, the same 2.75 to its dot; chat-question's 2.375 is recorded (the bubble is too short).
- **Marks in a container:** ring, shield and stop's square take the ring's marks (6px + and −, 5px ×, 2/4 check); filled, the container is solid and the mark a knockout. badge-check keeps the 1.5/3 check (the seal's inside is r 5.2).
- **Badge dots:** ⌀3, 1 in from the host's top and right, the host cut 3.1875 from its centre, a filled-only gap ring r 2.0625; already consistent.
- **Corner arrows** sit in the plus's 4 × 4 box, 1 in from the edge they point at so no barb faces a corner; 2px heads (a 2.5 head is 5 wide and leaves the box). Corner + and checks stay on the edges.
- **Arrowheads:** standalone 5; an icon's main arrow 3 (corner heads by axis leg); paired or contained 2.5; frame-contained chevrons 2 (panel-left-close, panel-left-open, terminal's prompt); git heads 2 (git-compare, git-pull-request: 2.5 leaves under 1 to the node filled). indent and outdent stay as drawn (owner).
- **Slash:** lines that stay lines beside a solid are cut one-sided at 2.25 (the fill gap's 1.125 of space); line glyphs' stroke pieces at 2.5.

Known false positives of the scan: person-settings and file-cog's small gear ("fill beside a line" at its tooth roots).

## Quality pass, 2026-10-03 (owner: "a deep visual quality, consistency, and coherence pass on every single icon")

Every icon reviewed in 32 groups by appearance and purpose (documents, folders and storage, git and
code, devices, transport, weather, people, agents, media, arrows, marks, type, inspector, shapes,
commerce, objects…), outline and filled at 96px with the true 16px line, then suspects at 320px.
Groups: `docs/research/icon-review/2026-10-03/groups.mjs`; sheets and method in that folder's
README. The 20 icons below went back to review; lint, `slivers.mjs` (only the two known gear false
positives) and typecheck pass.

| Icon | Fixed |
|---|---|
| bug-off | filled: the mandibles are whole again (the one-sided cut at 2.5 had dropped their left arm and left a ledge on the body); they clear the slash at 2.25, the mark pass's rule for lines beside a solid |
| file-pen | filled: a triangle of fill between the fold cut and the pen's gap at the right edge removed (a filled-only gap `M12 7.5H14`) |
| file-cog | filled: the sliver of the page's edge under the fold, beside the gear's clearance, removed (gap `M10.5 7.5H13.5`) |
| folder-lock | filled: the thin horn of the folder's right edge beside the shackle's gap removed; the edge now ends square at the shackle, as file-lock's |
| notebook | filled: the rings stay ink over the solid cover (their halo cut three scallops into the cover's edge, so it read as a "3") |
| map | filled: the three panels fill, parted by the folds as cuts (it only thickened its lines; Fluent's map) |
| truck | filled: the wheel hubs are cut whole (an r 0.5 stroked gap left a speck at each centre) |
| location-off | filled: the pin's hole is cut only on the slash's far side (`M6 6.5A2 2 0 1 1 8 8.5Z`); its near side left a 0.38 sliver of space against the slash |
| bluetooth-off | the rune's arm that runs along the slash (8° from it) is dropped in both variants, the slash taking its place (Lucide's bluetooth-off); the lower chevron starts on the slash. The arm's wedges against the slash were slivers in the outline and a blob in the filled |
| thermometer | filled: the whole thermometer is solid and the reading dot a hole (a filled bulb under a hollow tube read as a padlock) |
| cloud-sun | filled: the sun fills behind the cloud, parted by the overlap cut (it was a thick open arc) |
| person-circle, shield-user | filled: the frame stays a line and the figure fills, as person-square and person-chat (they flooded the frame and knocked the figure out, the negative the filled rule forbids; the four framed figures now agree) |
| brain, brain-off | filled: the right fold's knockout runs out past the lobe (a filled-only gap `M12.5 11H14.5`); its square end stopped inside the lower lobe and left an island |
| piano | filled: equals the outline (the frame stays a line, the black keys stay solid); flooding the frame turned the black keys white |
| group | filled: the two objects are one solid; a cut along their shared edge ran on through both rounded corners and squared them |
| shapes | filled: the circle fills in front of the square, parted by the overlap cut (Fluent's shapes); the halo round the ring left a lens of the square's fill inside it |
| calendar-clock | filled: the header's separation is a gap stopping in the clock's clearance (a cut ran on 2px into the clock and notched it) |
| bandage | filled: the pad's edges are cuts, so the pad reads as a layer (the filled variant was a plain solid with four holes, like a domino) |

Generator: a filled-only `gap` with `stroke="none"` and `fill="currentColor"` is cut out whole
(location-off's hole, truck's hubs); a stroked gap stays a band.

Looked at and kept (recorded decisions or consistent with the rules): usb's hollow plug (Fluent's),
camera-off's half lens, the one-sided slash cuts that leave a detached piece (wifi-off,
bluetooth-off's upper chevron), cart-add and clock-alert's notches round their marks, coins and
cloud-sun's crescents (the overlap cut), record (ring by weight, as Fluent's; a flooded disc with a
hole is `disc`), bot (head floods, no accessory). Solid-bearing icons look heavier than line
glyphs on sheets above 24px because their filled variant does not follow the size curve (owner,
2026-10-02); at 16px both are right.

Second round, same day (owner: "the filled icon strokes (negative space) look way thicker than the
monoline strokes"; newspaper, receipt, notebook, file-pen and file-cog flagged):
- **Filled sizes:** knockouts and cuts now follow the size curve, so a filled icon's negative
  space is the outline's line at 24, 32 and 48 (they were the 16px drawing enlarged: 3.4px at
  48 against the outline's 1.8). Silhouettes, part-separating gaps and lines over solids stay
  enlarged (their clearances are drawn for the 16px line; curving them opened strips at 48). The
  slash's gap is emitted as the slash shifted one line weight (`slashGap`), so it stays flush at
  every size. Checked with `slivers-at.mjs` at 24 and 32 (only the known gear false positives,
  bug-off's 45° body tip, globe's meridian ends and rocket's flame lines, which are islands in
  both variants).
- **newspaper, receipt:** the back page and the curl are parted from the front page by one line of
  space outside its edge (the part-in-front rule), so both read the same; receipt's cut had run
  2px up into the body and notched its right edge.
- **file-cog, file-pen:** the gaps under the fold reach the fold's centre-line, so the thinner cut
  at 32px leaves no hairline. **file-lock:** the shackle's clearance reaches the fold cut at
  every size (an extra arc at r 2.1875).
- Review page for the owner, one icon at a time (monoline, filled, Fluent/Lucide/Phosphor
  reference; approve, fix monoline or filled by error type, replace, directions):
  https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w, data from `review-data.mjs`; decisions in its
  `reviews` collection.

## Owner review round, 2026-10-03 (one icon at a time)

The owner reviewed all 568 drawings on the review page (https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w):
461 approved (some with adjustments), 31 fix, 72 replace with a closer library drawing. Each note was
applied to every icon that shares the part ("make sure that input i made to 1 variation of the icon
or a visual shape/object that the adjustments are made to the other instances"). 186 sources changed;
all are back in review. Lint, typecheck and `slivers.mjs` at 16 and 32 pass (known: the shared cog's
"fill beside a line" in file-cog and person-settings; rocket's flame lines are islands in both
variants). Integration fixes after the six drawing passes: folder-check's strip under the check (as
document-check), folder-open's back-panel wedge, bandage's filled crossing (front band parted from the
back one), truck's filled body (one solid with the window cut, no horizontal cut), unpin's tip of fill
beside the slash gap, images kept as its own layered drawing (gallery took Lucide's).

Generator: `--only names --emit file.tsx` writes just those icons for a private preview
(`docs/research/icon-review/2026-10-03/preview.mjs`), so drawing passes can run in parallel.

Construction lines by family (from the passes' notes):

### Partition A

#### Rules settled (apply set-wide; record in the spec / skill)

**Arrow proportion, by class** (shaft measured on the centre-line, head by its leg on the axis, as the skill's "5px legs"):
- *Standalone*: 5 head on a 12 shaft (arrow-up, unchanged; Fluent's 2.4). A diagonal standalone is the straight
  arrow turned 45°: its axis-aligned barbs are 7 (5 × √2) and its shaft about 12.7 (arrow-up-right). The old
  diagonal (15.6 shaft, 5.5 barbs) had twice the straight arrow's shaft-to-head ratio, which is why it read long.
- *Main arrow in an icon*: 3 head, shaft ≥ 7.5 (2.5×). download/upload/share/import/log-in/arrow-right-to-line
  already pass; log-out stays 7 (lattice + standard gap to the door forbid 7.5; noted below).
- *Contained or paired*: 2.5 head, shaft ≥ 6 (arrow-up-circle and square-arrow-up moved 3 → 2.5; sort, repeat,
  cloud-upload/download, arrow-right-left already 2.5). A contained diagonal takes barbs of 2.5 × √2 = 3.5
  (square-arrow-up-right).
- *Short frame or corner*: 2 head with the longest shaft the frame allows (≥ 2×): screen-share (4), stack-frame
  (5), file-download / file-export (4), archive-restore, text-wrap. Corner arrows sit 1 in from every edge they
  near (not only the one they point at), so the filled knockout leaves a 1.06 strip and never touches the edge.
- Corner-class arrows (open, expand, collapse, trending-up) left unchanged: their heads are corners, not shafts.

**Marks**: the dot sits 2.25 below the stem's end in every ! and i (ink gap 0.94, the detail step; was 2.75 / 1.44).
Stems: ring and large containers 3.75 (info; octagon-alert = info flipped, like alert-circle), tapering or small
hosts 2.25 (warning, chat-warning, cloud-alert), shield 2.75, beside 3.25 (clock-alert). Each ! kept its top and
dot; the stem grew 0.5 toward the dot. The ? dot sits 2.5 below the hook's end (ink 1.19, a little more than the
!), and the hook's tail is longer (help: tail end 8.5 → 8.75).

**Filled corner marks**: a mark's arm that ends on the silhouette uses the generator's knockout exit (curved
width, square) instead of a hand-drawn `gap` (16px width, which stepped at 32/48 and showed as a strip beside the
thinner knockout). Free ends inside the solid are round (knockouts), never butt-ended `gap`s.

#### Changed icons

| name | construction |
|---|---|
| arrow-up-right | The standalone arrow turned 45° (owner: the tail read longer than the regular arrow): shaft M3.5 12.5 → 12.5 3.5 (12.7, the straight arrow's 12), barbs 7 (= 5√2) on x.5 rows/columns. Ink 10.1, under the square keyline by 2.9 (a diagonal reads small by hull; Fluent's is 12 with a 15.6 shaft). Turns follow. |
| square-arrow-up-right | Contained diagonal: shaft M5.5 10.5 → 10.5 5.5, barbs 3.5 (2.5√2, was 3), so it is square-arrow-up turned like arrow-up-right. |
| square-arrow-up | Contained arrow head 3 → 2.5 (contained class), shaft 6. |
| arrow-up-circle | Same as square-arrow-up: head 2.5, shaft 6. |
| screen-share | Arrow head 2.5 → 2 (frame class), shaft 3.5 → 4 (tip 5, tail 9): visible tail doubled (owner: arrow too short). Gaps to the screen 1.375 top, 0.875 (detail) bottom. Fluent share_screen_start. |
| stack-frame | Head 3 → 2 (owner: shorter arrow ends), shaft 4.5 → 5 (from x 2); tip stays a tight 2.5 from the frame. Ink centre 7.75 (the arrow side is lighter). |
| text-wrap | Fluent text_wrap: even rows 3.5 / 7.5 / 11.5, the loop an r 2 arc, head 2.5 → 2, tip 8.5 → 7.5 so it runs deeper into the last line (last line ends 5, a tight gap). Ink centre 8.5 (rows kept on x.5 rather than centred on whole pixels). |
| file-download | Filled fix (sharp barb on one side, round on the other): the arrow is inside the page, 1 in from the right and bottom edges (x 9.5, tip 13, barbs 7.5–11.5, shaft 4, head 2), so both barbs end round inside the solid with a 1.06 strip to the edge. Outline cut round it (`icon-geometry cut`): right edge to 8.984, bottom from 7.318. |
| file-export | Filled fix (the tip exited the right edge and drew a connecting line): tip 1 in from the right edge (11.5), shaft 7.5–11.5, head 2; knockout wholly inside. Outline cut: right edge to 8.318, bottom from 7.823 (the 1.3-long corner fragment the cut tool leaves is dropped). |
| document-check | Filled fix (strip under the check): the check sits 1 up so its vertex clears the bottom edge (M7.5 11.5 L9 13 L12.5 9.5, arms 1.5 / 3.5; the long arm reaches the right edge and exits by the knockout exit). The vertical `gap` under the vertex and the hand gap are gone. Outline: the right edge stub below the fold is dropped (line ends at the fold, 12.5 6.5; 3 from the check, standard). The 3.5 arm (not 3) is what keeps a standard gap to the fold. |
| cloud-check | Filled fix (same strip): check 1 up, M9 10 L10.5 11.5 L13.5 8.5, vertex 1.06 clear of the foot; the long arm's end is 0.31 inside the lobe so it keeps a `gap` M13.5 8.5 L15.5 6.5 (no lattice point lies on the lobe). Outline recut: right lobe ends at 12.119 6.724, foot from 8.318. |
| image-plus | Filled fix: the mountain is one `knockout` (was `line` + butt `gap`), so its end by the plus is round and its width follows the size curve; it exits the frame corner square by the knockout exit. The plus's hand gaps are removed (its arms end on the edges and exit by themselves). |
| mail-plus | Filled fix (owner: should the end be rounded? yes): the flap is one `knockout` (was `line` + butt `gap`), round at its free end by the plus, square where it leaves the left edge; plus's hand gaps removed. |
| archive-restore | Fluent archive_arrow_back without the circle, in the box: a back arrow (head 2 pointing left at tip 5,10, barbs 7,8 / 7,12), its shaft running right and turning down an r 1.5 corner to leave through the box's foot at x 11 (knockout exit when filled). Outline body cut round the lower barb and the tail (bottom kept 2.5–4.818; the right wall ends at its corner, 13.5 11.5, the corner fragment dropped). Filled: lid solid, body fills, arrow a knockout; strips 0.875 under the lid cut, 1.06 above the foot. |
| rotate | Fluent arrow_rotate_clockwise in reset's construction: reset's r 5.59 arc from the left point (2.41, 8) clockwise over the top to a corner head at the lower right (corner 10.5,13, legs 3 right and up, equal barbs as reset's), a ⌀2 centre dot (Fluent's small ring; the brief's dot). Replaces the arc round a small square (the earlier owner pick, now superseded). Ink centre 8, 7.71 (Fluent's mass sits the same way). |
| loader | Phosphor spinner-gap: seven radial ticks r 4 → 6 at 45° steps, the upper-right one missing (Phosphor). Ticks 2 long, inner gaps 1.94 (standard). Line glyph. |
| circle-check-dashed | Fluent checkmark_circle_hint: the whole ring dashed (was half solid), the shared dash ring below, ring check 2/4 (M5 8 L7 10 L11 6). |
| circle-dashed | The one dash ring: 8 dashes on r 6 centred on the compass points, each ±7.58° (ink 2.71), the space between them a standard 2.0 ink. Fluent's dashes are even round the ring; at Area's weight equal dash and space read as dots, so the space is the standard step. |
| circle-dot-dashed | The same dash ring, ⌀2 centre dot unchanged. |
| hash | Fluent number_symbol: slanted uprights M6.5 2.5 → 4.5 13.5 and M11.5 2.5 → 9.5 13.5 (2 over 11), bars offset with the slant (y 5.5: 3.5–13.5; y 10.5: 2.5–12.5). `data-angles="free"` (the slant is the concept, as Fluent's). |
| activity | Lucide activity: a pulse whose peaks are sharp (owner: sharper at top and bottom, less rounded): baseline 1.5–4.1, peak 5.9,3, trough 10.1,13, baseline 11.9–14.5; the shoulders keep r 1 soft corners. Peaks are 43°, so `data-acute="sharp"` (owner-requested in this review; the round join fills the point). |
| chart-scatter | Lucide chart-scatter: axes with an r 1.5 corner (Lucide's rounded corner), five ⌀2 dots on whole-pixel centres scattered as Lucide's (6,4 · 12,3 · 8,7 · 6,10 · 11,9): each neighbour pair a tight 1.61 or open, none in a row. |
| info | Fluent's i: stem 7.25–11 (3.75), dot ⌀1.5 at 5, 2.25 above the stem (ink 0.94, was 1.44); the stem's bottom keeps a standard 1.875 to the ring. |
| octagon-alert | The ring's mark (info flipped): stem 5–8.75, dot 11. Octagon below. |
| octagon | Regular octagon (owner: sides more equal): vertices at 3.5 corner cuts on the 2–14 box, so straight sides 5 and diagonals 4.95 (were 6 and 4.24), r 1 fillets. The 3.5 cut puts the diagonals half a step off the 45° lattice (no whole cut gives equal sides at 12 wide), so `data-angles="free"` is declared; owner to confirm (alternative on the lattice: 11 wide with a 3 cut, sides 5 / 4.24, ink 12.1). |
| warning | ! stem 6.25–8.5 (2.25, was 1.75), dot 10.75. |
| shield-alert | ! stem 5.25–8 (2.75), dot 10.25. |
| chat-warning | ! stem 4.75–7 (2.25), dot 9.25: the stem took the old gap. |
| cloud-alert | ! stem 5.75–8 (2.25), dot 10.25, and moved to x 7.5 under the big lobe's crest (owner: too close to the cloud's top right). x.5 is also crisp at 1×. Stem top 1.11 from the lobe. |
| clock-alert | Beside !: stem 8–11.25 (3.25), dot 13.5. |
| help | ? hook tail to 8.75 (longer), dot 11.25: 2.5 below (ink 1.19, was 1.44). |
| chat-question | ? in the bubble: bowl r 0.875 at (8, 5.375), the hook to 60°, tail to 6.75, dot 9.25 (2.5 below, ink 1.19, was 1.06). |

#### Unresolved / needs the owner's eye
- **chat-question**: the bubble has no room for both a longer tail and a larger gap. I took the larger gap (1.19)
  and shrank the bowl (r 1 → 0.875) so the tail stays as long as it was; the top gap to the bubble is a detail
  0.875. A longer tail needs a smaller dot gap or a smaller bowl still.
- **octagon**: regular sides need `data-angles="free"` (off-lattice diagonals); see the row for the lattice option.
- **activity**: `data-acute="sharp"` added on the owner's request ("sharper … less rounded"); record as owner-approved.
- **arrow-up-right**: now reads smaller (ink 10.1 vs Fluent 12). If the owner wants it bigger, 3,13 → 13,3 with
  7 barbs (ink 11.1) puts the barbs on whole pixels (soft at 1×).
- **log-out**: shaft 7 (2.33×) left as is; extending it breaks the lattice or the standard door gap.
- **file-download / file-export / document-check / archive-restore outlines** now open a larger corner, since the
  marks moved inside (filled needs the 1-in clearance). Look at 16px outline.
- **cloud-check outline**: the right lobe is cut back to a short stub (12.119, 6.724); it reads as the start of the
  lobe, but check it.
- **cloud-download**: owner's "consider moving the arrow up for filled (Phosphor)" left for later, no change.
- **rotate** supersedes the skill's recorded pick ("rotate as reset's own arc mirrored round a small square") and
  the 2.25 rotate head (now reset's 3): update Owner preferences and the arrowhead list.
- **Not edited (other partitions)**:
  - **folder-check has the same strip-under-the-check defect** (vertical `gap` M11 13V15 under the vertex). Fix as
    document-check: knockout `M9.5 10.5L11 12L14 9`, drop the vertical gap; the arm ends on the right edge (14) so
    the hand `gap` M14 10L16 8 can go too (knockout exit). Outline `line` from the cut tool:
    `M8.818 13L3.5 13A1.5 1.5 0 0 1 2 11.5L2 4.5A1.5 1.5 0 0 1 3.5 3L7 3L8.5 4.5L12.5 4.5A1.5 1.5 0 0 1 14 6L14 6.75`
    (lint it; the arm-to-flap gap may need the 3.5 arm as in document-check).
  - **clipboard-check** (partition C, in my list but not mine to edit): same fix pattern: vertex 1 in from the
    bottom, long arm ending on the edge with the knockout exit, no vertical gap.
  - Other corner marks still using hand `gap`s next to knockouts (document-add, calendar-add, folder-add …) step at
    32/48 the same way; worth the same knockout-exit conversion set-wide.
- Generator note: `gap` strokes are butt-capped and drawn at the 16px width; using them to continue a knockout is
  what produced the square-ended free ends and the 48px steps the owner saw.

#### Verification
- `gen-pilot-icons.mjs --only` on all 32 changed icons: `icon lint ok`.
- Previews: `A-after-1.png` (arrows, file arrows), `A-after-2.png` (replacements), `A-after-3.png` (marks, octagon),
  `A-after-4.png` (filled fixes), `A-after-48.png` (outline + filled at 48 through the size curve).
- `slivers-at.mjs` could not be run to completion: its headless Edge `--dump-dom` hung (timed out at 500s, even
  with a private profile) after one early successful run on the 7 filled fixes. Checked visually at 16 and 48
  instead; the only remaining 48px step is cloud-check's hand `gap` on the long arm (see above).

### Partition B

All changed sources lint clean (`gen-pilot-icons.mjs --only …`, 30 icons). Originals are in
`before/`. After sheets: `B-after-1.png` (person family), `B-after-2.png` (faces, hands,
fingerprint, accessibility), `B-after-3.png` (key, lightbulb, crystal ball, bots).

#### Person figure (owner: bigger head, smaller gap; same in every icon)

| name | construction |
|---|---|
| person | Standalone figure: the head goes from r 2.5 to r 3 at 8,5 (2–8). The body is a dome 10 wide with r 3.5 shoulders, 10.5–14, so the gap between head and body is now 2.5 between centre-lines (1.38 tight; it was 3, 1.88). Ink is 11.1 × 13.1, centred. The body is now a pure dome with no straight sides, close to Fluent's person proportion (head ⌀ about 0.6 of the body's width). |
| person-add, person-remove, person-x | Small figure: the head goes from r 2 to r 2.5 at 5.5,5. The body (7 wide, r 3) is unchanged at 10–13.5, so the gap is 2.5 between centre-lines (was 3). The whole figure moved 0.5 lower so the icon stays centred; the marks stay at head height (+ and − at y 5.5). |
| person-check | The same small figure. The 1.5 / 3 check moves to M9.5 8.5L11 10L14 7, beside the shoulder: the larger head left 0.85 to the check's old place, and the lattice allowed no nearer place on the gap scale. |
| person-key | The same small figure. Its key is now Lucide's key turned upright: a ring bow r 1.5 at 11.5,5 (head height), a shaft at x 11.5 down to 13.5, and Lucide's box bit 2.5 × 2.5 on the right (M11.5 10H14V12.5H11.5). The old version had two stub teeth. |
| person-settings | The same small figure. The larger head left no room for the cog at the top right (its teeth came 0.5 from the head), so the cog moves to the bottom right (12,11), as in Fluent's person_settings. The body is overlap-cut round it (`behind`, using r 2.5 for the cog's teeth): an outline-only `line` for the visible part, a filled-only `fill` for the whole body, and a `gap` ring at r 3.625. The cog is the shared file-cog cog. |
| people | The front figure is the small figure 1 lower (head r 2.5 at 5.5,6; body 11–14.5). The back figure is the same figure offset (5, −1.5), overlap-cut round the front figure (the head arc comes from `behind`). The filled gap ring is now r 3.625. The icon moved 0.5 lower so the back head stays in the drawing area. Ink is centred at 8,8.25. |
| person-circle, person-square, shield-user | Framed figure: the head goes from r 1.5 to r 2 at 8,6.5, the body top is 10.5 (r 2 corners), and the gap is 2 between centre-lines (0.88 detail; it was 2.5 with the smaller head). The frame gaps are 2 or more. All three frames now place the figure the same way (person-square's head moved from 6 to 6.5). |

#### Faces (one system, Fluent's emoji spacing)

| name | construction |
|---|---|
| smile | Eyes ⌀1.5 at 6.25,7 and 9.75,7 (Fluent's emoji positions). The smile is M5.5 10 A3.5 to 10.5,10: its corners are 3 below the eyes and its lowest point is 4.05 below them, which is Fluent's emoji (3 / 4). It used to be 3 / 4.8, with the eyes at y 6. |
| frown | The same eyes. The frown is M6 11 A2.5 to 10,11: its top is 3 below the eyes and its corners are 4 below (Fluent emoji_sad: 3.1 / 3.75). |
| meh | Replaced to follow Fluent emoji_meh: the same eyes, and a mouth line M5.5 9.5H10.5, 2.5 below the eyes (Fluent: 2.5; it used to be 4.5). The line is as wide as the smile (5.5–10.5); Fluent's width (6–10) left a near-miss gap of 2.38 to the ring. |
| smile-plus | The same face as smile; the + is unchanged. |
| square-smile | The same smile and eye height, with the eyes at 5.75 and 10.25. The square's sides allow a standard gap only there (at 6.25 the gap was 2.44, a near miss). |
| scan-face | The same face as smile, inside the unchanged corner brackets. |

#### Hands, accessibility, fingerprint

| name | construction |
|---|---|
| hand | The outline is unchanged (outline-only `line`). The filled variant follows Fluent hand_right's filled cut: a filled-only `fill` solid whose four fingers are 0.5-wide columns (1.6 ink) with round tips at the outline's tip heights (3, 2, 3, 4.5), parted by U notches (r 1) that end at the outline's divider ends. The old knockouts centred on the dividers left the middle fingers 0.75 wide and the outer ones 1.94, which is the flagged error. |
| accessibility | Replaced to follow Phosphor's person-arms-spread: an outlined body as one closed path (arms out at y 6.5–7.5, 11 wide, tapering into the torso, two legs with flat feet 1.5 wide at y 14, the crotch at 8,11; fillets r 0.5), and a head r 1.5 at 8,3. Both fill solid. The keyline is circle, because the 13.6 height is over the square keyline. |
| fingerprint | Replaced to follow Phosphor: arcs about 8,8 at r 5.5 (with a top-left break and tails on both sides), r 3 (an arch whose right leg runs down to 13.5), a centre line curving down from 8,8, and two short ridge dashes (lower left; lower right under the r 5.5 tail). The ridges are 2.5 apart, not Phosphor's 2: at 2 apart the filled variant's 1.5 line closes them to 0.5, so Phosphor's fourth level (r 6.5) doesn't fit. The report flags it 1.88 under its keyline. |
| handshake | Replaced to follow Phosphor: two slanted cuffs (rounded parallelograms, fillets r 0.5, solid when filled), a peaked top line from cuff to cuff, the front hand running from the right cuff to a knuckle and a thumb hook that ends free, and the back hand's lower edge from the left cuff to the right cuff. Phosphor's separate fingertip line under the hands is dropped (no room on the gap scale), and the thumb ends free rather than joining the top line (joining it left 1.0 counters). |

#### Key, lightbulb, crystal ball

| name | construction |
|---|---|
| key | Replaced to follow Lucide: a round bow r 3.5 at 10.5,5.5 with no inner dot in the outline, a 45° shaft down to 2,14, and Lucide's square bit (M6 10L8 12L6 14L4 12; 1.7 counter). Filled: the bow fills, with a filled-only ⌀2 hole (`gap`). Lucide's bow sits top right, so the diagonal now runs bottom-left to top-right. |
| lightbulb | Replaced to follow Fluent lightbulb: a bulb r 4 at 8,6.5. The arc runs to 45° below the equator, then a short cubic neck runs to the band at 11.5 (x 6.25–9.75), and the cap tapers to a flat bottom at 13.5 with r 1 corners. The band is a `cut` when filled (Fluent's filled has the same gap). Ink is centred. |
| crystal-ball | The stroke errors (stand ends floating under the ball) are fixed with Fluent predictions' construction: a ball r 4 at 8,6 with the highlight arc r 2 (knockout when filled), on a trapezoid stand (top 5–11 at y 9, bottom 4–12 at y 14, r 1 feet). The stand is overlap-cut behind the ball: an outline-only `line`, a filled-only `fill` and a `gap` ring at r 5.125. The keyline is now vertical. |

#### Bots

| name | construction |
|---|---|
| bot-agent | The hat band runs all the way across the crown (owner): an outline-only `line` from side to side (M3.893 4.5 Q8 4.9 12.107 4.5, raised 0.25 to clear the brim), and a filled-only `gap` run out through both sides, so the filled band exits square. It used to be a knockout with round ends inside the crown. |
| bot-automator | The chef hat is one piece (as partition E's chef-hat): one closed solid (lobed puff, sides down to the bottom curve) with a band line across it at y 4 (`cut` when filled). The separate band block and its filled-only gap are gone. |
| bot-designer | The cap's visor used to be a crescent that tapered to slivers at the head's sides. It is now a fill-only band of even depth (top Q 2,6.5 → 14,6.5; bottom Q 2,8.25 → 14,8.25) with blunt ends on the head's sides. The crown's lower edge is the visor's top, and the filled `gap` follows that edge (normal offset 0.625) and runs out through the sides. The head sides start at 7.25, so their round caps no longer poke into the gap when filled. |
| bot-generator | The curled tip that read as a rounded stroke arrow is gone. The hat is now a wizard cone with concave sides and the point leaning right (tip 9,1.5). The band runs side to side at y 4.25 (`line` plus `gap`, as bot-agent). Lower bands left a 0.8 strip of fill between the gap and the brim (slivers.mjs). |
| bot-guard | The bill is wider (owner): the crescent runs 3–13 (it was 4–12), its top on the crown's bottom curve extended (Q 3,5.858 / 8,6.892 / 13,5.858) and 1.5 deep at the centre. The head outline starts where its corner arcs meet the bill (3.472, 6.221). The band line now runs along the bill's whole top edge; without it, slivers.mjs flagged the crown's strip under the gap. |
| bot-scholar | The filled skirt used to show horns at its top corners, and the head's caps poked up beside it. The board is now a flatter hexagonal board (8,1.5 / 12.5,2.75–3 / 8,4.25 / 3.5,3–2.75), so the skirt keeps room. The skirt is an outline-only `line` (sides meeting the board) plus a filled-only `fill` with a V top 2.25 under the board's bottom edges (Fluent's graduation cap: board and skirt both solid, with a V of space between them). |

#### Unresolved / for the owner

- **agent**: the owner wrote "not sure if this icon is needed". It is unchanged and not deleted. Should it stay?
- **person-chat**: unchanged. The bubble's interior (2.5–11.5) can't take the r 2 framed head with a gap of 2 or more to the bubble's top and still leave a body, so its figure stays at r 1.5. The figure is now one step smaller than the other framed figures.
- **person-check**: the check sits beside the shoulder (y 7–10), not at head height. It is the only lattice place on the gap scale with the larger head.
- **person-settings**: the cog moved to the bottom right with an overlap cut into the body (Fluent's layout). This changes the icon's layout, not just the figure, so please check it.
- **person**: the body lost its short straight sides (now a dome) to keep the icon centred with the r 3 head. The alternative keeps the body and sits 0.25 high.
- **bot-generator**: the hat changed shape (wizard cone instead of a floppy hat). Check the read at 16px; the cone is small above the wide band.
- **fingerprint**: three ridge levels plus a centre line, not Phosphor's four, because of the filled 1.5 line. It reads lighter than the keyline (the report flags it 1.88 under).
- **handshake**: Phosphor's fingertip line is dropped, and the thumb ends free.
- **key**: the bow is now top right (Lucide), the mirror of the old key. Icons that pair with key (key-related variants outside this list) may need the same turn.
- **Not in my list but carrying a figure or face**: id-card (solid person exception), contact/video-person style icons. If they draw the person figure they need the same head change. I found no other source that copies the figure's path.
- Slivers check (a private copy of slivers.mjs run on an `--emit` build of these 30 icons): the only remaining hit is person-settings' cog ("fill beside a line"). file-cog has the same hit in `slivers-before.txt`, so it comes from the shared cog's construction, not from this pass.
- smile-plus filled: the smile's right end comes within the detail gap (0.92) of the + knockout. Lint and slivers pass, but check it at 32 and 48.
- A leftover Edge profile folder, `apps/docs/.cache/edge-slB` (in the ignored cache), needs deleting; recursive rm was denied.

### Partition C

Originals: `<scratch>/before/<name>.svg`. After sheets: `<scratch>/C-after-1.png` … `C-after-6.png`. Lint: `icon lint ok` for all 33; `slivers.mjs` (run on an `--emit` copy) reports none.

| name | construction |
|---|---|
| pencil | Phosphor pencil-simple's construction on the 45° lattice: a straight body 4.24 wide (sides x + y = 13 and 19), back x − y = 10 with r 1 corners, Phosphor's square chisel tip (a vertical and a horizontal leg of 3 meeting at 2.5, 13.5, r 1 at the tip, r 0.5 at the joins), and a ferrule band at x − y = 6 (a `cut` when filled). Was a tapering free-angle pencil; now one slim drawing for the family. Band sits 4 from the back so pencil-off's slash clears it (open 3.12). Ink 12.71, centre 8.3, 7.71 (diagonal, both axes 0.3 off) |
| pencil-off | pencil exactly, band restored (owner: "add eraser back"), shared flat slash; filled: `fill` + band `cut` + slash `gap` |
| compose | Phosphor note-pencil: the same pencil at Δ 5 (3.54 wide), tip square at 6.5, 10, back x − y = 10 poking out past the box's top-right, band at x − y = 6; the box (r 2) open round it, top edge ending at 8 and right edge at 9 (both 2.47 from the pencil, tight 1.35). Filled: pencil solid, band cut, box a line |
| signature | the same pencil (Δ 5, tip at 4.5, 10, back x − y = 9, band x − y = 5) above the unchanged wave (tight 1.25) |
| file-pen | document base and fold; a slim pencil (Δ 4, 2.83 wide, was a 3.54-wide stub) on the lower-right corner, tip square at 9, 14 with an r 1 tip (no longer sharp when filled), back x − y = 4 (r 1), band x − y = 0. The page's right edge now ends at the fold corner (no stub), 1.29 from the pencil's back; bottom edge cut 2.25 from the tip (6.908). Filled: band is a `line` + a `gap` that stops inside the pencil's gap (a `cut` ran into the page); the pencil's gap is two offsets of the pencil (sharp, flush with the fold cut, and r + 1.125 rounded, so no page fill hides behind its round back corner) |
| eraser | Phosphor eraser: the 45° block (sides x + y = 12 and 19, back x − y = 7, r 1 corners) truncated by the baseline: its lower-left end runs down to y 13 and the baseline continues from the block's sharp bottom-right corner (6, 13) to 13.5, so the stroke runs straight into the eraser's edge. Band x − y = −2 unchanged |
| clipboard, clipboard-check, clipboard-list, clipboard-paste | one clip in all four (5 × 3, r 1). Filled now follows Fluent's clipboard: the clip is solid and merges with the board (no gap round it, which made it read larger than the outline's clip), with a filled-only 3 × 1 pill slot (`gap`, fill) in it |
| clipboard-check | outline unchanged. Filled: the check is a plain line beside the board (as in the outline, where the board is cut open round it); a filled-only fill `gap` removes the board beyond and 1.75 round the check, ending square at the bottom. Replaces the knockout + `M10 14V16` strip the owner flagged |
| clipboard-list | Lucide: two rows of a ⌀1.5 dot (holes when filled) and a 2.5 line (knockout) at y 8.5 and 11.5, dots at x 5.5, lines 8–10.5 |
| search, zoom-in, zoom-out, search-off | the handle starts at 10.75, 10.75 (5.3 from the lens centre) instead of 10.5 / 10.625, so its round cap ends inside the ring's ink (4.68 > the inner edge 4.375) and no longer pokes into the lens, in both variants |
| file-search | handle starts at 12, 12 (2.12 from the r 2 lens centre; was exactly on the centre-line) |
| square-search | checked, unchanged (its handle already starts 2.12 from the lens centre) |
| filter | Phosphor funnel: 13-wide straight top (1.5–14.5 at y 2.5) with small r 0.75 corners, straight sides to sharp concave joins with the 3-wide stem (6.5–9.5 from 8.5), the stem's foot slanting from 12.5 down to 14 (r 0.5). Was r 1 ears and filleted joins |
| filter-add, filter-dismiss | the new funnel cut 2.25 round the 4px + / 3.5px × (cut tool), the filled `fill` closed by r 2.25 arcs round the mark's nearest ends (and the × 's V) |
| pushpin | Fluent pin set upright: a spool, 8-wide top (r 1) narrowing to a 5-wide waist at y 8 and flaring to an 8-wide flat base at 11 (r 0.75 base corners, r 0.5 waist), needle 11–14.5; free angles. Was a classic cap-and-flare pin |
| unpin | pushpin exactly + shared slash; the needle starts at 11 (joins the base) so it keeps a detail gap from the slash |
| trash | Lucide trash: lid 3–13 at 4.5, body 4–12 (lid overhangs 1 each side, r 1.5 foot), wider handle 6–10 (was 6.5–9.5; 5.5–10.5 put the legs 2.04 from the lines), lines 6.5 and 9.5 |
| attach | Phosphor paperclip: three nested loops on one 45° wire, wires 2.12 apart (detail 0.99), outer loop r 3.18 and inner r 1.06 concentric at the bottom left, top loop r 2.12; both ends stop 1.41 below the top loop's centre (tight 1.42 from it). Generator: `<scratch>/C/clip.mjs -5.5 2 0.5 0.25` |
| folder-open | Phosphor folder-open: folder's back (tab, r 1.5 corners) narrowed to 2–13, its right side a stub down to the front; the front a 1 : 2 parallelogram whose top (y 7.5) runs past the back to 14.5 (r 0.75) and whose left side meets the back's left side at 10.5, so the bottom is the full folder width. Filled: one silhouette; a `gap` one weight above / left of the front's top and left edges (cut from the back, so the front keeps its edge) |
| folder-zip | outline unchanged. Filled: Fluent's slider: the tab's ring is a white channel (`gap` along the tab's centre-line, open at the bottom) round a 1.9-wide solid core (`fill`), replacing the 4.25-wide solid tab whose gap reached 9.4 and ate the last teeth; the channel's top meets the last tooth's bottom (10) as Fluent's does |
| database | outline unchanged. Filled: each band's gap is one weight below the band's ink (the section above in front, Fluent's database top): an ellipse rx 6.69, ry 3.19 that exits the walls diagonally, replacing gaps centred on the bands with horizontal ends, which left slivers of wall and notches |
| vault | Fluent vault: a 12 × 9 r 2 body, no legs; a handle line at 5.5 (6.5–9.5) and a dial, an r 1.5 ring at 10, 8 with four 45° spokes to 1.75 (knockouts when filled) |
| printer | filled: the paper is solid with the body (no gap) and its interior is cut out (a fill `gap`), as Fluent's print and Phosphor's printer |
| calculator | Fluent calculator: body 10 × 13 r 2 (vertical keyline now), display a 6 × 2.5 r 1 frame whose outer edges line up with the outer keys' edges (keys ⌀1.5 at x 5.25, 8, 10.75, rows 9 and 12). Filled: display interior a white `gap`, keys holes |
| notebook | Lucide notebook: 8 × 12 r 2 cover, a strap line at x 10 (a `cut` when filled), three rings 3.5–6 at 5, 8, 11 |
| newspaper | Fluent news layout: a full-width top line (4–9.5 at 5.5) over a 3 × 3 picture block (3.5–6.5 × 8–11) beside two lines at 8.5 and 10.5 whose outer ink edges meet the block's top and bottom; even 1.4 margins |
| file-lock | the page's right edge now ends at the fold corner (the 0.44 stub removed, file-search's construction); filled: an extra filled-only gap (`M12 6.5V8`) removes the speck of fill between the fold cut and the shackle's gap |
| folder-lock | the right edge ends at the end of the folder's corner arc (14, 6), the 0.42 stub removed |

#### Needs the owner's eye / unresolved

- **file-pen** is still short (the fold and the 14.5 live area cap the pencil's length at ~9 at 45°), so with the ferrule band it reads a little capsule-like. Options: drop the band on file-pen only, or move the pencil to the lower-left corner (Lucide's file-pen) where it can be longer.
- **pencil** sits 0.3 off centre on both axes: the band has to sit at x − y = 6 so pencil-off's slash clears it, and that needed the longer body.
- **file-lock**: I removed the stub rather than lengthening it. A stub of ~1.5 would need a smaller lock, and the shackle counter is already 0.93. Lowering the lock onto the bottom edge only gave 0.94.
- **clipboard-check filled** now shows the check as a line beside the board instead of a knockout. That follows "a mark beside a solid stays a line"; the corner-mark rule says knockout, but that rule is what produced the strip.
- **folder-open** narrows the back to 2–13 so the front can stick out past it the way Phosphor's does. It's no longer folder's exact back width.
- **pushpin** uses free angles (Fluent's tapered sides). At 16px it could read a little like a spool.
- **calculator** changed keyline from square to vertical (it needed 13 high for the display frame).
- **folder-zip**: the channel's top touches the last tooth, as Fluent's does. If "clears them" means a visible gap, the tab itself has to shrink (its counter is already at the floor).
- **database** keeps its middle band (Fluent has only the top one); only the filled cuts changed.

### Partition D

| name | construction |
|---|---|
| chip | 8 × 8 package at r 1 with three pins a side (unchanged); the centre ring is now a 3 × 3 square at r 0.5 (6–9), the same extent as the old r 1.5 ring, so it reads as a die (Lucide cpu, owner: "the circle should be a square"); filled knocks it out. |
| usb | Stick widened to an 8 × 9 body at r 2 (4–12) with a 6 × 4 plug at r 1 (5–11, 1.5–5.5); the plug carries the two contact notches as solid 1 × 1 squares (r 0.25) at 6.5 and 8.5, y 3–4, detail gaps (0.875) all round. Owner's recommended option (notches); the USB trident did not read at 16. Notches are a new solid exception (a hole is solid by nature, like qr-code's modules). |
| mouse | Phosphor mouse: a 9 × 13 body at r 4.5 (3.5–12.5) with the button line across at 6.5 and the divider down the middle from the top to it. Filled: body solid, button line a `cut`, divider a `line` + `gap` extended out through the top only (it starts on the button line). |
| tv | Lucide tv: a 12 × 8.5 screen at r 2 (y 5–13.5) under a 45° antenna V (5.5, 2.5 → 8, 5 → 10.5, 2.5) whose point sits on the screen's top edge (an attached part, joined). No longer reuses desktop's screen or stand. |
| watch | Phosphor watch: a round face r 4 with hands (up 2, right 2; knockout when filled) and trapezoid straps 2 → 14, 4 wide at the ends and meeting the face at x 5 and 11 (1 : 3 sides, r 0.75 end corners). Straps stay lines when filled. |
| gamepad | Lucide gamepad-2: a 12 × 9.5 body (r 3 top corners) whose bottom has two grip lobes (r 1.5) and a raised bridge at 11.5 joined by 45° steps (r 1 fillets), the 3px + at 6, 7.5 and two ⌀1.5 buttons at 10, 9 and 11.5, 7. |
| vr-goggles | Mask shortened from 8 to 6.5 tall (6–12.5): r 2.5 corners into an R 15 brow, the same r 3 lobes and r 1.5 nose bridge moved up 0.5; lens line 2.5 under the brow. The strap is shorter (2.5 long) and concentric with the brow (R 17), 2 between centre-lines, the detail gap (0.875), the closest the gap scale allows (owner: smaller, closer, mask shorter). |
| picture-in-picture | Lucide picture-in-picture-2: an open frame (12 × 9 at r 2, 2–14 × 2.5–11.5) whose right side stops at 6 and bottom at 5, tight 2.5 short of a 6.5 × 5 window at r 1.5 on the lower-right corner (7.5–14 × 8.5–13.5), which overhangs the frame like Lucide's. Square keyline. Filled: the window fills. |
| camera | Fluent camera: a 12 × 9 body at r 2 (4.5–13.5) with Fluent's taller hump (45° sides, base 4.5–11.5, top 6.5–9.5 at 2.5, r 1 shoulders, r 0.5 into the body) and a larger r 2.5 lens at 8, 8.5. Square keyline now (ink 13.1 × 12.1). |
| camera-off | camera's body and lens drawn whole under the flat slash; filled lens knockout recut one-sided round the slash for the r 2.5 lens. |
| mic | Phosphor microphone: a 5 × 7.5 capsule (r 2.5, y 2–9.5) in an r 4.5 cradle centred at 8, 7.5 (3.5–12.5), stem 12 → 14; the capsule–cradle gap is tight (2.5 between centre-lines). |
| mic-off | mic drawn whole under the flat slash; the filled cradle piece recut one-sided (ends 10.922, 10.922). |
| music | Phosphor music-notes: the same two r 2 heads and stems with a second beam 3 below the first (6, 6.5 → 13.5, 5; standard 1.82 between). Filled: the band between the beams fills (`fill`), as Phosphor's filled notes. playlist's note left as it is (it is a single eighth note with a flag, not the beamed pair). |
| piano | Closer to Phosphor piano-keys: a square 12 × 12 frame at r 2 (2–14), wider black keys (2.5 wide, 4.5–7 and 9–11.5, to 9.5 with r 0.5 feet) and Phosphor's off-centre dividers at 6 and 10. Phosphor's outlined black keys do not fit at Area's weight (their pockets would be 0.875 and 1.375), so the keys stay solid. Filled unchanged (frame stays a line). |
| captions | CC centred: both Cs moved 0.5 right (centres 6 and 10), ink centre 7.78 from 7.28 (the Cs' open right side is lighter, so the remaining 0.2 is optical). |
| clapperboard | Fluent movies_and_tv: a 12 × 6 box at r 1.5 (7.5–13.5) with the clapper raised at 1 : 3 from a hinge on the box's top-left (3.5, 7.5), a 10.25 × 2.25 band at r 1 (r 0.5 at the hinge, joined to the box) with three '/' stripes (knockouts filled). Stripe positions solved for counters (1.05–1.26); the hinge wedge is closed ink up to the first stripe. |
| call / call-incoming / call-outgoing / phone-missed | Phosphor phone: one filleted polygon symmetric about x + y = 16: an r 8.5 back arc (2, 5.5 → 10.5, 14), r 3 earpiece and mouthpiece corners, pads with 1 : 2 inner edges and r 0.75 ends, 45° necks and an r 3 inner curve; ink 13.1 × 13.1 centred. The three marks are unchanged (gaps 1.98 standard, 1.75 for the ×). |
| car | Phosphor car: a 1 : 2 windshield cabin (top 5.5–10.5 at 2.5, r 1) on a 10 × 4.5 body (3–13, 6.5–11, r 1 lower corners), the mirror line 2–14 on the windshield's foot, two short lamp lines (5–6, 10–11 at 9) and two 2.5 × 2.5 wheel boxes (r 0.5) under the body. Filled: body and wheels solid, lamps knocked out, cabin open. |
| truck | Phosphor truck: a cargo box (2–10 × 3–8, r 1.5) and a lower cab (top 4.5, 1 : 2 windshield to 7.5, r 1) over a full-width chassis line at 8, wheels r 1.5 at 4.5 and 11.5 on the 12 base (lines end on the wheels). Filled: silhouette `fill` with the cab window kept open (a reversed subpath), chassis line a `cut`, wheel hubs open. Square keyline (ink 13.1 × 11.6, centre 8.25: heavy base). |
| plane | Owner-approved side view kept, adjusted: fuselage 4 tall (6–10, was 3) with a full r 2 nose ending at 13.5, the tail fin smaller (2.5 above the body, was 3.5; 45° leading edge, 1 wide top) and a longer swept wing (root 7–11 on the belly, 45° leading edge to a 2-wide tip at 13). |
| waypoints | Lucide waypoints: four r 1.5 rings on a diamond (8, 4 / 4, 8 / 12, 8 / 8, 12), the left and right joined by a horizontal line, the top to the left and the right to the bottom by 45° lines ending on the rings. Replaces the S route. |
| map | Fluent map with even panels: folds at 2, 6, 10, 14 (three 4-wide panels, was 4 / 3 / 4) and a 1 : 2 zigzag (2 per panel). |
| globe | Fluent globe: ring r 6, a narrower r 2 × 6 meridian and two parallels at 6 and 10, so the ring splits into even thirds both ways (owner). |
| home | Door unchanged (the model for the family: 3 wide, r 1.5 arch); filled keeps the base line under the door (the gap that cut through it is gone; a plain base line 6.5–9.5 is drawn over the hole). |
| store | Door is now home's arched door (6.5–9.5, r 1.5 arch, 3.5 tall, top at 10, tight below the awning). Filled already kept the base line. |
| building | Door is home's arched door (2.5 tall, top 11.5, back on the grid from 10.75), a `hole` with the base line drawn over it, so the filled base runs under the door. |
| bank | Fluent building_bank: a pediment (2–14, apex 1.5 at r 1.5) holding a ⌀1.5 dot, four columns (3.5–12.5, 3 apart) from 7 to a step line at 11.5 (3–13) and a base line at 13.5 (2–14), 2 below. Filled: pediment solid with the dot open; columns and steps stay lines. |
| exit-door | Lucide door-open: frame (jamb at 3.5, top to the hinge at 6.5, r 1.5), floor 2–6.5 and 12.5–14 at 13.5, and an open leaf hinged at 6.5 (2 → 14 tall at the hinge, 3.5 → 13.5 at the free edge, r 1.5 top corner) with a ⌀1.5 knob at 10, 8.5. Filled: the leaf fills, knob open. |
| toggle / toggle-off | Fluent toggle: track 12 × 7 (4.5–11.5, r 3.5) and a ⌀4 knob (r 2 at 10.5 / 5.5), knob-to-track gap 0.94 (Fluent's proportion; was ⌀3 in an 8-tall track). |

#### Needs the owner's eye / unresolved

- **Outline-line, filled-gap pattern elsewhere:** `save` cuts its lower label (a U on the bottom line) and its top shutter out through the edges when filled, so the base and top lines vanish there, the same pattern as the old home. `pen-tool`'s nib slit also exits through the tip. Not in this partition; not changed.
- **vr-goggles:** the strap now sits at the detail gap (0.875), the gap scale's floor; any closer would have to join it to the mask (a tab, like Fluent's headset_vr).
- **usb:** the notches are a new solid exception (1 × 1 solid squares); record it if approved.
- **piano:** outlined black keys (Phosphor regular) do not fit at Area's weight, so the keys stay solid; the change is proportion only.
- **clapperboard:** at 16px the band is 2.25 thick (counters 1.05–1.26, under standard) and the box is 6 tall (Fluent's is about 7), because the raised clapper needs the height. The filled stripes run out through both edges of the band (knockouts reaching the edge exit square), which breaks the band into pieces as Fluent's filled cut does; check it at 32/48.
- **call-end** is a separate horizontal handset, not redrawn to the Phosphor phone (not in my list).
- **truck** sits 0.25 low (heavy base), and **plane**'s wing is a single swept shape; the owner asked for "more detail"; no windows were added, so the drawing stays clean at 16.
- **music / playlist:** playlist's single note was left as it is; only music gained the second beam.
- **Slivers:** `slivers.mjs` on the partition flagged only car's filled lamps (a strip of fill under the mirror line); I moved the lamps to y 9. A second run, to confirm that fix, was blocked: another session was holding headless Edge. Re-run before marking these done.

Before/after: `before/<name>.svg` (originals), `D-before-1..3.png`, `D-after-1.png` (devices, toggles, waypoints), `D-after-2.png` (camera, mic, music, piano, captions, clapperboard, car, truck, plane), `D-after-3.png` (calls, map, globe, home, store, building, bank, exit-door).

### Partition E

| name | construction |
|---|---|
| flash | Lucide zap on Area's grid: a Z bolt with two parallel 45° outer edges (x + y = 11 and 21, on the lattice), horizontals at y 7 and 9, steep inner edges (dx/dy 0.353, Lucide's slope), point-symmetric about 8,8; tips and outer corners filleted r 1 (Lucide's r 1.5 at 24), inner notches r 0.5. Replaces the owner's earlier sharp classic bolt (as briefed), so `data-acute` is dropped; every corner is an arc. Ink 10.3 × 13.7, vertical keyline. |
| zap-off | flash's new bolt exactly (outline `line` + filled `fill`), shared slash on top, slash gap parts it when filled. |
| battery-charging | bolt is the line bolt in the new zap's proportions (Lucide's own family uses the line bolt in battery and cloud): M7.5 6.5 L6.5 8 H8 L7 9.5, diagonals 1 : 1.5 (was 45°), point-symmetric, knockout when filled. Body, terminal and close gap unchanged. |
| cloud-lightning | same line bolt at 1.5 ×-ish (diagonals 1.5 : 2.5, horizontal 2): M9.5 8 L8 10.5 H10 L8.5 13, still crossing the cloud's foot with the halo when filled; the cloud line is re-cut round it with `icon-geometry cut` (foot now opens 5.81 → 12.24). Cloud shape unchanged. |
| eye | Lucide eye: two r 6.957 arcs whose tips are rounded by r 0.75 fillets (Lucide's r 1 tip arcs), centreline 1.56–14.44 × 3.5–12.5; pupil ring r 2 (Lucide's r 3 at 24; was r 1.5), knockout when filled. Pupil gap 1.38 tight. eye-off unchanged (closed eye, shares no drawn part). |
| moon | Phosphor crescent: outer ring r 6 at 8,8 minus an r 5.1 circle offset 5.22 up-right (Phosphor's 88/104 ratio and 90.5/104 offset); tips filleted r 0.5 (Phosphor's rounded tips). Thickest part ~half the diameter. Centre 7.87, 8.13 (a crescent's mass is low-left; outer ring kept on 8,8). |
| umbrella | Phosphor umbrella: a semicircular canopy r 6 on 8,8 with a flat bottom at y 8 and r 0.5 soft corners; two ribs, r 10 arcs from the canopy top (8, 2) to the bottom at x 6 and 10 (Phosphor's ±2), outline-only (`line`); in filled the ribs are knockouts from y 4 down (round free ends where the ribs converge, square exits through the bottom), since the full rib would leave a sliver of fill near the top. Handle 8 → 12.5 with Phosphor's r 1.5 hook curling right. Top spike dropped (Phosphor has none). |
| leaf | fix (filled, rounded stroke end): the stem is now a `solid` line (M8 11 V14.5) and the vein knockout ends at 12.125, so the generator's square exit runs exactly to the leaf's ink edge (13.125) and masks the stem's top: the white vein leaves the leaf square and the stem continues from the silhouette with a square top. Before, the plain stem's round cap poked up into the vein. Outline unchanged in appearance. |
| tree | Fluent tree_deciduous: lobed crown from `icon-geometry lobes 11.5` (five r 2.5 lobes: 4.5,9 / 6,6.5 / 8,4.5 / 10,6.5 / 11.5,9), flat foot at 11.5, and a short outlined trunk 3 wide (6.5–9.5) to 14 with r 0.75 bottom corners; the trunk stays a line when filled (Fluent's filled). Branch knockout dropped (Fluent has none). |
| paw | Phosphor paw-print: outlined pad (dome r 2.25 at 8,9; lobes r 2 at 5.5/10.5, 11.75; concave shoulders r 2.5 and a concave bottom r 4.5) and four r 1.25 ring toes at (2.75, 7.25), (5.75, 3.75), (10.25, 3.75), (13.25, 7.25). Keyline square → circle: Phosphor's spread (ink 14.1 wide) does not fit 13 without toe gaps under the detail floor; gaps 0.88–1.09 detail. Toes and pad fill. |
| hammer | Phosphor hammer, without the tail: drawn in a 45° frame on the lattice (k = 0.707 units). Head 5k thick and 16k long: claw a single r 5.23 arc to a point (no tail), a face cap 3k long separated by a `cut`, r 0.75 face corners; handle 4k wide (2.83, Phosphor's 2.82) and 10k long with r 1 end corners, joined under the head. Head and handle fill; the face cut parts the cap. |
| broom | Fluent broom: in a 45° frame, a semicircular dome r 2.83 on a chord (4.5,7.5)–(8.5,11.5), a flared skirt below it (bottom edge 7.07 long vs chord 5.66, Fluent's flare) with r 0.75 bottom corners, the chord a `cut` (dome and skirt part when filled, Fluent's filled), and the handle 8.5,7.5 → 13.5,2.5 from the dome top. Bristle lines dropped (Fluent has none). |
| bandage | Phosphor bandaids: two crossed pills (r 2.25 ends at 4.25 and 11.75 on each diagonal) drawn whole (one plane), a ⌀1.5 centre dot as a `hole`. Filled: both bands solid, dot knocked out. Band half-width 2.25 keeps the dot's gap at 0.94 (detail); the lattice-true 2.12 left 0.81, so the band edges are off the diagonal lattice (`data-angles="free"`). |
| dumbbell | Phosphor barbell, horizontal: inner plates 2 × 9 (x 4.5–6.5, 9.5–11.5, r 0.75) solid when filled; outer plates 2 × 5 sharing the inner plate's wall, drawn as open C shapes that stay lines when filled (Phosphor's fill); bar 6.5–9.5 and end stubs 1.5–2.5 on y 8. Counters 0.93 (detail). |
| dice | Phosphor dice-five spacing: dots ⌀1.5 at 5.75 / 8 / 10.25 (2.25 from centre, was 3); frame unchanged. Dot gaps 1.68 tight, 1.94 to frame. |
| chess-rook | Lucide chess-rook: open-topped crown 4–12 × 1.5–6 (r 1.5 bottom corners) with Lucide's band line at y 3 (outline only) and two crenel ticks at 6.5 and 9.5 (knockouts: white slits from the top when filled); a tapered body 6.5→6 / 9.5→10 from 6 to 12; a base 3.5–12.5 × 12–14.5, r 1.5 top, r 0.5 bottom. Filled: one silhouette (crown, body, base solid), the ticks slit the crown into merlons. Gaps between parts removed (they left hairlines at the body's corners). |
| puzzle | approved, knobs bigger: the top and left knobs are r 2 semicircles on 4-wide, 0.5 necks (were r 1.5 on 3); body 4.5–14 so the ink box stays 2–14. Sockets unchanged (r 2). |
| toy-brick | approved, studs taller: studs 3 tall (2.5–5.5, were 2) and the body 1 taller (5.5–13.5) so the brick stays centred; stud counters now 1.93 (were 0.94). |
| blocks | Lucide blocks: an L of three cells (cell 5: x 2–12, y 4–14, divider x 7, line y 9) drawn as one path with r 1.5 outer and r 1 inner corners, plus a 5 × 5 r 1 square offset up-right (9–14, 2–7), 2 apart (0.88 detail; Lucide's half-cell gap at 16px needs ~1.33, between the detail and tight steps on this grid). Filled: cells solid, parted by one mitred `gap` (M0 9 H7 V16). |
| binoculars | Phosphor binoculars: each barrel an outer slant tangent to an r 2.5 lens ring (4, 10.5 / 12, 10.5), an inner side on x 6.5 / 9.5, and an r 1.5 rounded cap at the top (3.5); a bridge on y 5.5. Keyline square → horizontal (Phosphor's 14 × 11). Filled: barrels solid, lens rings stay rings (Phosphor's fill). |
| coffee | fix: steam wisps are smooth S curves with vertical ends (M x 2 C x 3.5, x+1 3.5, x+1 5), three at 2.75 / 5.75 / 8.75, leaning down-right like Fluent's drink_coffee; the old wiggles had diagonal ends and read angled. Cup unchanged. |
| chef-hat | fix: one piece. The crown's lobes (unchanged) run down straight sides at x 4.5 and 11.5 to a bottom at 13.5 with r 1 corners, closed in one path; a band line across at y 10.5 (`cut`, so crown and band part when filled). Lucide's construction. **For partition B (bot-automator):** the hat is a single closed outline — lobes, then the sides continue straight down to the bottom edge — and the band is only a horizontal line between the sides (no separate rect); filled, that line is a `cut`. |
| party-popper | Phosphor confetti: a cone (apex filleted r 1 at bottom left, mouth a 45° line x − y = 2 from 4.5,3.5 to 11.5,10.5 with r 0.5 corners) with two stripes parallel to the mouth (`cut`s, so the filled cone is striped), and confetti: a tick at x 8.5, an S streamer, a 45° dash and a short slanted dash, each a detail gap off the mouth. Arc mouth and dots dropped. |

#### Needs the owner's eye / unresolved
- flash: the owner's earlier "sharp classic bolt" choice is replaced as briefed; the Owner preferences lines ("a sharp classic bolt", "Sharp by nature: flash", Proportions "flash is a sharp classic bolt") now contradict the drawing and need updating in the skill/spec (not mine to edit).
- battery-charging and cloud-lightning use the line bolt (Lucide's own family convention): the outline bolt cannot hold a counter at 4–6px tall. If the owner wants the outline zap there too, it would have to be a solid (exception) in the battery.
- paw moved to the circle keyline, binoculars to horizontal; bandage is off the diagonal lattice (dot gap). Record if accepted.
- party-popper filled: Phosphor fills the cone and keeps only the apex triangle white; Area cuts both stripes (role rules for edge-to-edge lines). Check at 16px that the three bands don't read busy.
- blocks: the cell gap to the offset square is the detail step (0.875); Lucide's proportion sits between detail and tight.
- moon centre 7.87, 8.13 and chef-hat centre 8, 8.25 (heavy base) are optical offsets, unrecorded.
- slivers.mjs did not run: headless Edge timed out on --dump-dom twice (10-minute budget, with other passes also driving Edge). I checked the filled variants by eye at 16/24/32/48 in the after sheets only. Run slivers on this partition before calling it done.

After sheets: E-after-1.png (the bolt family, eye, moon, umbrella, leaf), E-after-2.png (tree to chess-rook), E-after-3.png (puzzle to party-popper).

### Partition F

| name | construction |
|---|---|
| cart | Phosphor's shopping-cart: a 0.75 handle at y 2 that becomes one slanted leg (3.25,2 → 4.5,10.5, fillets r 0.5 / r 1) and runs on as the bottom rail at y 10.5 to the right wheel. The basket is a trapezoid hung on the leg (top y 4 to x 14, right side slope 1 : 4, bottom y 8, top-right r 0.5, bottom-right r 1). Wheels are r 1.25 rings (cx 5.75 / 12.25, cy 12.25) hanging off the rail; 12.25 because 11.75 left a 2.38 near miss between the wheels. Filled: the basket is solid, and the handle, rail and wheels stay lines. Replaces the old dot-wheel cart (owner: closer to Phosphor). |
| cart-add | cart's drawing with the 4px + on the basket's top-right corner (Hugeicons' cart-add), its horizontal arm continuing the basket's top line (y 4). The basket is cut round it (top line stops at 7.75, the right side is gone). The bottom line runs to 11.25, a 1.01 detail gap to the + and a 1.99 standard gap to the wheel (the 2.25 cut left 2.06 to the wheel). Filled: the basket is a `fill` notched round the + by the overlap cut, and the + stays a line. |
| basket | Lucide's shopping-basket: a rim line M2 7.5H14 overhanging a trapezoid body by 1 on each side (3 → 4.5 at the bottom, r 1.5 bottom corners, y 7.5–13.5). Two slats at x 6.5 / 9.5 and a band at y 10.5. Handles are unchanged (4,7.5 → 6.5,2.5, mirrored), and the handles don't meet. The slats are vertical: Lucide's converging slats left a 0.875 fill strip between the slits when filled (slivers.mjs), and slanting them outward came 0.66 from the handles. Filled: the body is solid, the slats are cuts and the band is outline-only (`line`). |
| piggy-bank | Phosphor's piggy-bank without the coin line out of the head (owner). The back is an r 4.5 arc (centre 6.5,7.5) with a flat top to x 8.5, the head is an r 3.5 arc (centre 8.5,6.5), and the snout runs to x 13.5 at y 6.5–9.5 (r 0.5). A straight chin and rear line taper to two 1.5-wide feet at y 13.5 under a belly at y 12.5. The slot (5.5–7.25, y 5.5) is a knockout; the eye is a ⌀1.5 hole at 9.5,6.5. Phosphor's tail is dropped: the ink box is already 13.12 wide. |
| tag | Lucide's tag: a 45° rotated rectangle with a square top-left corner. Polygon 2,2 · 8,2 · 14.5,8.5 · 8.5,14.5 · 2,8: r 1.5 at the square corner and the tip corners, r 1 at the two 135° corners, sides on x−y = ±6 and x+y = 23. The top edge is on whole pixels because the shape centres on 8. The eyelet is a ⌀1.5 hole at 4.75,4.75. Now square keyline, 13 × 13 (the old one sat 1.8 under its keyline). |
| barcode | Fluent's barcode_scanner: four r 2 corner brackets with 0.5 stubs (box 1.5–14 × 3–13) round four bars at x 4 / 6.5 / 9 / 11.5, y 5.5–10.5. The spacing is 2.5 so every gap survives the filled 1.5 line (2 between centre-lines failed). Horizontal keyline; the ink centre is 7.75 because the 2.5 rhythm can't centre four bars in a 13 box. |
| qr-code | approved design; the four data modules are now 2.5 × 2.5 (8.5–11 / 12–14.5), so the group's ink spans 6 like the finders' 6.12 (owner: bottom-right group slightly bigger). Gap to the finders is 0.94 detail; the modules stay 1 apart. |
| scale | Fluent's scales: beam M2.5 3H13.5, post x 8 from 3 to 13, and a stroked base M4.5 13H11.5 (owner: the base can be a stroke). Each pan hangs from the beam as two legs to an r 2 bowl under a chord at y 7.5 (pans centred at 3.5 / 12.5, legs drawn as separate subpaths, so the 48° apex is not a join). Filled: the bowls fill (`fill`) and the legs stay lines, as in Fluent's filled cut. Horizontal keyline 14.12 × 11.12; the bowl counters are 0.93 (detail). |
| calendar (family) | The pegs now run to y 4.5 (was 4) in calendar, calendar-add, calendar-check, calendar-remove and calendar-clock (owner: the pegs extend further into the calendar). That is a 0.875 detail gap to the header line, the nearest step. |
| calendar-check | The check (1.5 / 3) moves 1 up and keeps its long arm ending on the right edge: M9 11L10.5 12.5L13.5 9.5. Its vertex now sits 1 above the bottom edge, so the filled variant keeps a 1-wide band under it instead of the old wedge strip. This follows partition A's fix to document-check (vertex 1 above the bottom edge, long arm out through the right edge); the old `gap` path is removed. The outline is cut round the new check (bottom line to 8.318, right side to 7.25). |
| bold | Outline is now a stroked B in the type family (owner: Lucide and Phosphor don't bold it): stem x 4.5 from 2.5 to 13.5, upper bowl r 2.5 to x 11, lower bowl r 3 to x 11.5, sharp left corners like case-upper's B (`line`, outline only). Filled keeps the old solid B (evenodd, `fill` with stroke="none"). **Choice for the owner:** stroked outline + solid filled vs the old solid B in both. The skill's "bold is the solid B" line would change if accepted. |
| subscript / superscript | The T is bigger: 7 × 8 (bar 2–9, ticks 1, stem x 5.5, foot 4–7 = 0.43 of the bar) instead of the 6 × 6 T. The 2 is narrowed to 2.25 wide (bowl rx 1.125 from 11.5, foot 11.5–13.75), so superscript's bar end stays 0.875 from the 2 in the filled 1.5 line. The type family's "medium 6 × 6 T in superscript and subscript" line needs updating if accepted. |
| quote | Each mark's tail is one r 5.5 arc that leaves the ⌀4 drop tangentially at its left side (start 0.5 inside, as before) and sweeps up to the right, ending at 105° (Fluent's single-curve tail), instead of a vertical stub plus an r 3.5 arc (owner: the stroke didn't lead directly into the drop). Drops are 6 apart (was 8; owner: the gap was too big), at 5,10 and 11,10. Ink 11.2 × 7.9; the centre is 8.54 because the tails reach right. |
| spell-check | Fluent's text_proofing_tools_abc: ABC over a check, on Area's line. Letters are 4 tall (y 2.5–6.5). A is a flat-topped A (1.5–5.5, a 1-wide top with r 0.5 corners, bar at y 5.5); the pointed apex left a 0.79 counter. B's bowls are r 1 (stem x 8, to x 10); C is an rx 1.125 / ry 2 arc (12.5–14.4). Letters sit 2.5 apart so they survive the filled 1.5 line. The check is the in-shape 2 / 4, M5.5 10.5L7.5 12.5L11.5 8.5. Horizontal keyline 14.04 × 11.12. Replaces the T with a check. |
| translate | Phosphor's translate with a correct 文: dot M5.5 2V3.5 on a bar M2 3.5H9; 丿 as an r 5.5 quarter arc from the bar (8,3.5) to 2.5,9; 乀 as an r 5 arc from 4,5.5 sweeping down-right to end on the A's left leg (joined there, as in Phosphor). The A is larger (feet 7.5 / 14 at y 13.5, apex r 0.75 at 10.75,6, bar y 11.5). Replaces the ×-shaped character (owner: the kanji wasn't correct). |
| lasso | Fluent's lasso, solid (owner: no dotted line). The loop is an r 5 circle (centre 8,7) from 140° round the top to 30°, flowing into an α knot at the bottom: two r 2.225 arcs between 7,12.5 and 11,12.5 (eye 4 × 2.5, counter 1.42), crossing itself at 11,12.5, with the tail running down-right to 12.25,14. Line glyph. |
| paint-bucket | Lucide's paint-bucket: a 45° rectangle (sides x+y = 9 / 20, x−y = 6 / −7). The rounded bottom is r 2.25 at the left and bottom corners, the rim r 0.75 at the top and right. The upper-left side is open between 3.8,5.2 and 5.5,3.5, where the handle M7 5L4 2 leaves. The paint level is M1.932 8H12, and the solid drip moved 0.5 left. Filled: the paint below the level is a `fill` (fixes the old filled stroke error); the outline, handle and level stay lines. |
| palette | Lucide's palette: the circle and an ellipse (6 × 5.5) to an r 3 corner, then Lucide's smooth thumb indent. H to 9.375, an r 1 arc, a 0.375 straight at 3 : 4, and an r 1 arc back to the bottom at 8,14, all tangent-continuous (owner: the old indent wasn't smooth). Four ⌀1.5 holes at 9,5.25 · 11.25,7.5 · 4.75,9 · 6,6. |
| gallery / images | Lucide's gallery-horizontal-end: a 6 × 11 card (x 8–14, y 2.5–13.5, r 1.5) with two bars to its left at x 5 (y 3.5–12.5) and x 2 (y 5–11), 3 apart. Filled: the card fills and the bars stay lines. images is an alias of gallery (`data-alias-of="gallery"`), regenerated identical; the lint confirms. |
| bug-off | Filled fix: a filled-only `gap` (stroke none, M4 1H6.4375V3.5A1.5625 1.5625 0 0 0 7.306 4.9H4Z) trims the spike of fill that showed between the head's outer edge and the slash gap at the body's top-left corner. The fill now ends flush with the head's ink (owner: small ink error in the negative space). The outline is unchanged. |

#### Unresolved / for the owner's eye
- **bold:** the stroked B outline with the solid B kept as the filled variant is a choice for the owner. If accepted, the skill's Owner preferences ("bold is the solid B"; quote and bold as solid exceptions) and spec lines need updating. I did not edit them, per the brief.
- **cart-add:** with Phosphor's short basket (4 tall), the 4px + takes the whole top-right corner, so the outline reads close to "E+" (Hugeicons does the same). Filled is a notched basket. Worth a look; an alternative is a taller basket for the variant only.
- **gallery:** it no longer carries a picture (Lucide's gallery-horizontal-end is a card with two bars behind it), and images, its alias, follows. The skill's multiples note ("gallery's back copy down and left") is now stale. If "images" should still show a picture, it needs its own drawing instead of being an alias.
- **spell-check:** ABC at 16px is at the limit. The A is flat-topped (a pointed A failed the counter floor), B's bowls are 0.93 counters, and C is narrow. It reads at 24 and up; at 16 it is dense.
- **piggy-bank:** Phosphor's tail is left out (no room inside the square keyline); the ink box is 12.6 × 11.6, centre 7.75, 8.25.
- **subscript/superscript:** the bigger T is 7 × 8 (not text-size's 8 × 10), limited by superscript's 2 and the filled-line gap; the 2 is 0.25 narrower than before.
- **quote:** it still reads small (11.2 × 7.9, horizontal keyline). That was accepted before; with tighter spacing it is narrower.
- **barcode:** the ink centre is 7.75 (0.25 left), forced by the four-bar 2.5 rhythm.
- **Checks:** `gen-pilot-icons.mjs --only` passes for all 25 icons. A copy of slivers.mjs run on the emitted partition icons reports none after the basket fix. I did not run the full generator, `npm run icons:pilot` or typecheck, per the brief.

After previews: F-after-1.png (cart → scale), F-after-2.png (calendar family, bold, subscript, superscript), F-after-3.png (quote → bug-off). Before: F-before-1..3.png.


## The filled story, 2026-10-04 (owner-chosen)

Research and options: `docs/research/icon-review/2026-10-04/` (Fluent, Phosphor, Material Symbols
and SF Symbols compared; prototypes). The owner chose: fill the body only (a dog-ear stays open,
folder-open fills its front, a clipboard's clip stays a ring with the board cut back round it),
details knocked out, marks inside containers in both styles (replacing the 2026-09-27 corner
placement), knockouts round inside the solid and sawn where they reach the edge. Applied in six
passes over every icon with a solid (410); 41 sources changed, all back in review. Lint, typecheck
and `slivers.mjs` at 16 and 32 pass (known: the shared cog; rocket's flame islands; folder-zip's pull).

Kept or reverted in integration: cloud-download keeps cloud-upload's knockout arrow (a halo arrow
was tried and reads as a sticker; the cloud arrows are one owner question); folder-zip keeps Fluent's
solid pull (a ring pull cut the teeth at 32px); unpin's far-side cut follows the slash gap at every
size.

Open for the owner: cloud arrows (knockout through the foot vs inside); smile-plus's + (no room
inside or beside); cloud-check, mail-plus and image-plus keep their mark on the corner as a line
with the body cut back (no room inside); group's two boxes fill as one solid; alarm's bells as
lines read as ears; folder-remove and calendar-remove's − sit 0.5 high (lint near miss centred);
file-export's head is 1.5; calculator's display hole reads smaller than its outlined frame;
notebook's rings now knock out over the cover (reverses the 2026-10-03 note).

### Pass P1

Lint: `icon lint ok (21 icons)`. Slivers (private copy reading an `--emit` build, since
`src/pilot-icons.tsx` is stale): only `file-cog filled fill beside a line` at the gear, the known
gear false positive. Before sheets `P1-before-1..3.png`, after `P1-after-1..2.png` (the third
before sheet covers the icons kept unchanged). Originals in `before2/`.

#### Changes

| name | filled now |
|---|---|
| document | proto-document-a exactly: the dog-ear stays open (its fold line and diagonal drawn in both styles, the body `fill` notched to the fold, the outer edge a `line`), text lines knockouts |
| document-add | the dog-ear open; a 3px + inside, centred under the fold (`M8 8.5V11.5M6.5 10H9.5`, the check's box), a plain knockout. The 4px + leaves 0.73 to the fold and 0.75 to the foot |
| document-check | proto-document-check-in exactly: the dog-ear open, the 1.5 / 3 check inside (`M5.5 10L7 11.5L10 8.5`), knocked out |
| document-remove | the dog-ear open; a 3px − inside at y 9.5, knocked out. At y 10 it sat 2.38 from the fold (a near miss), at 10.5 2.38 from the foot; 9.5 gives 1.88 standard both ways |
| file-download | the dog-ear open; the arrow inside: a 3 shaft at x 8.5 with a 2px head (`M8.5 8.5V11.5M6.5 9.5L8.5 11.5L10.5 9.5`; x 8 is off the diagonal lattice with a half-y tip), knocked out |
| file-export | the dog-ear open; the arrow inside: a 4 shaft centred on 8 with a 1.5 head (`M6 10H10M8.5 8.5L10 10L8.5 11.5`), knocked out. A 2px head spans 4 vertically and has no lattice position that clears both the fold (needs barbs at x ≤ 7) and the foot |
| file-code, file-spreadsheet, file-image | the dog-ear open; their content unchanged (chevrons and cells knockouts; image's mountain a `cut`, sun a hole) |
| file-cog, file-lock, file-pen, file-search | the dog-ear open (body `fill` notched to the fold, the `line` stops at the fold corner, fold and diagonal drawn); badges keep their place, cut-backs and existing flush gaps |
| files | the front page's dog-ear open (same structure at its 3.5 fold, r 1); the back copy stays a line; text line a knockout |
| sticky-note | the peeled corner open: body `fill` notched to the flap, flap line and diagonal drawn in both styles (the outline's r 0.5 fillets at the diagonal are now separate subpaths meeting the fold, as document's) |
| notebook | the rings keep their length: the part outside the cover is ink (`M3.5 x H4.5`), the part over the cover a knockout (`M4.5 x H6`, sawn at the edge), so each ring reads as running through the cover. Before, only a 1px stub showed outside the edge (smaller filled than outlined, against R1) |

#### R1 calls

- **Badges on files are objects and fill:** the lock (body solid, shackle a line), the lens (disc,
  handle a line), the gear (disc with the hub a hole, teeth lines), the pen (body solid, eraser band
  a gap). Each names the variant and is an object, not a mark; places unchanged, nothing cut through
  an edge.
- **file-image's picture** keeps the mountain as a `cut` across the page (a line edge to edge), the
  sun a hole: content, not a badge.
- **Kept as is (audited):** file-diff (no dog-ear; ± knockouts inside), copy and duplicate (front
  fills, back an open L line; duplicate's 4px + is a knockout centred in the front at 6.5, 9.5),
  receipt and newspaper (the curl and the back page fill as second masses parted by a gap outside
  the front's edge, the recorded 2026-10-03 fix the owner flagged; they are parts of the paper,
  not attachments).

#### For the owner

- file-export's head is 1.5 and file-download's 2 (both arrows sit in a 4 × 3 box); no 2px-head
  right arrow fits under the fold on the lattice. Alternative: a 2px head at x 6–9, y 9.5, which
  sits visibly left of centre.
- document-remove's − sits at 9.5, 0.5 above the + and check's centre (lattice / gap scale).
- notebook reverses the 2026-10-03 quality-pass call ("rings stay ink over the solid cover"); if
  the white continuation reads wrong, revert to `before2/notebook.svg`.
- The spec rows for these icons (construction lines mentioning corner marks and `cut` folds) need
  updating by whoever records the pass; batches.json review status not touched.

### Pass P2

Originals of changed files: `before2/<name>.svg`. Sheets: `P2-before-1..4.png`, `P2-after-1.png`
(folder-add/check/remove, folder-open, folder-zip, calendar-add/check/remove), `P2-after-2.png`
(clipboards, cloud-check, mail-plus, image-plus). Lint: `icon lint ok (15 icons)`.

#### Changed

| name | filled now |
|---|---|
| folder-add | Folder solid with the flap cut; a 3px + knocked out inside, centred below the flap (8, 9.5), both styles (proto-folder-add-in). |
| folder-check | Folder solid with the flap cut; the 1.5 / 3 check knocked out inside (M6 9 L7.5 10.5 L10.5 7.5, 0.25 right of centre for the lattice). |
| folder-remove | Folder solid with the flap cut; a 3px − knocked out inside at y 9 (centred at 9.5 left 2.38 gaps, an off-scale near miss; 1.88 to the flap, 2.88 below). |
| folder-open | Only the front fills; the back (left side, tab, top, right side to the front) stays a line (proto-folder-open-a). |
| folder-zip | The pull tab stays a ring at its outline size (was a smaller solid); the body is cut back one weight round it and inside it, the cut meeting the last tooth as in Fluent's filled zip. Teeth stay knockouts. |
| clipboard | Board fills; the clip stays a ring, the board cut back one weight round it and clear inside it (proto-clipboard-b). |
| clipboard-check | As clipboard; the 1.5 / 3 check knocked out inside the board (proto-clipboard-check-in). |
| clipboard-list | As clipboard; dots and rows stay knockouts. |
| clipboard-paste | The front sheet is the body and fills; the board behind (cut back by the overlap cut) and its clip stay lines, as multiples (front fills, back stays a line). |
| calendar-add | Calendar solid with the header cut, pegs lines; a 3px + knocked out inside below the header (8, 10). |
| calendar-check | As calendar-add with the 1.5 / 3 check (proto-calendar-check-in). |
| calendar-remove | As calendar-add with a 3px − at y 9.5 (centred at 10 was the same 2.38 near miss; 1.88 to the header, 2.88 below). |
| cloud-check | The check stays a line beside the cloud, on its lower right as the outline draws it; the cloud fills to the outline's cut-back silhouette, closed along the overlap cut (2.25 from the check's centre-lines) round the check, so no wedge of fill is left beyond it. |
| mail-plus | The + stays a line on the top-right corner; the envelope fills to its cut-back silhouette, closed along the overlap cut round the +; the flap is a cut running out into that space. |
| image-plus | The + stays a line on the lower-right corner; the frame fills to its cut-back silhouette, closed along the overlap cut round the +; the mountain is a cut running into that space; sun hole kept. |

#### Audited, no change
folder, folders, folder-lock, archive, archive-restore, inbox, package, calendar, calendar-clock, mail,
mail-open, mail-dot.

#### Calls under R1 / R4
- folder-lock: the lock is a second mass of identity (a lock on a folder): its body fills, shackle a
  line, folder cut back round it. Kept.
- calendar-clock: the clock is a second mass of identity: it fills with its hands knocked out (round
  ends inside); the header gap ends flush in the clock's gap. Kept.
- clipboard-paste: front sheet = body, board = back layer (stays a line, no fill). Recorded here.
- folder-zip: the pull tab is an attachment, so it keeps the outline's ring rather than filling small.
- archive-restore: the arrow is the icon's content, not a corner mark; its tail runs out through the
  bottom edge sawn flush (as cloud-upload). Kept.
- No room inside (R4 beside): cloud-check (a 1.5 / 3 check cannot sit inside with a detail gap: with the
  vertex on the foot limit (y 10.5) the start needs x ≥ 6.9 to clear the left notch and the end needs
  x ≤ 6.2 to clear the right notch; scaling the cloud is capped at 1.07 by the keyline, not enough);
  mail-plus (under the flap only ~3px of height is free, a 3px + needs ~4.1 + gaps); image-plus (the
  picture fills the frame).

#### For the owner
- The beside marks (cloud-check, mail-plus, image-plus) close the fill along the overlap cut round the
  mark instead of a halo, so they show no corner wedge; still a "mark on the corner" look. Alternative
  if you want them inside: a smaller cloud-check needs a different check size than the system has.
- The − in folder-remove and calendar-remove sits 0.5 above centre (lint scale); say if you'd rather
  allow the centred 2.38 gaps as an exception.
- folder-zip: the cut round the tab joins the last tooth (Fluent does the same); look at 32/48.
- slivers.mjs could not run here (headless Chrome crashed on a crashpad file in the sandbox); checked by eye on the 240px / 48px sheets only.

### Pass P3

Before sheets: `P3-b1.png` … `P3-b12.png` (8 per sheet, list order). After: `P3-after-1.png`.
Original kept at `before2/cloud-download.svg`. Lint: `icon lint ok`; slivers.mjs: none.

#### Changed

| name | filled now |
|---|---|
| cloud-download | the whole cloud fills and the arrow stays a line in front, the cloud cut back one weight round it (a `halo`, as cloud-lightning's bolt; the spec row already says "the arrow `front`"). Before, the arrow was a knockout whose head runs past the cloud's foot, so the barbs were sawn by the edge and the tip disappeared (a mark cut through the edge, R4) |

#### R1 calls (body or attachment), no change needed
- usb: body fills, the connector head stays a line with its two pins (attachment).
- plug: body fills, prongs and cord stay lines. watch: face fills, straps stay lines. tv: antenna a line.
- printer: the body fills, the paper tray stays a line and the front sheet stays an outline (attachment).
- store: only the awning fills, the building stays a line (recorded identity call; the awning names it).
- car: body and wheel boxes fill as one mass (spec: "body and wheels solid"); the wheels already
  join the body in the outline, so nothing merges that the outline keeps apart. Cabin stays open.
- locate: the centre dot fills, the reticle ring and ticks stay lines (frame round a subject).
- vr-goggles: strap a line. stack-frame, workflow, network, git-*, route, waypoints: nodes fill, links lines.
- rocket: body and fins fill (both part of the body), the window a hole, flame lines stay lines.
- leaf: blade fills, the stem's knockout is sawn at the blade's edge and continues as ink (R3, R5).
- umbrella: canopy fills, ribs are knockouts round inside the canopy and sawn at its edge; the handle a line.

Everything else on the list passed R1–R5 unchanged (knockouts sawn at edges in save,
circuit-board, mouse, map, globe, database, hard-drive, laptop; marks inside bodies in
desktop-check, desktop-play, screen-share, backspace, battery-*, gamepad, cloud-alert;
slashed icons follow the shared slash rule).

#### For the owner
1. **import and cloud-upload** (left as recorded): filled, the arrow is a knockout and the part of its
   stem outside the box/cloud drops out ("as in cloud-download", spec). It is sawn flush (R3 holds),
   but the arrow reads shorter filled than outlined (R1's "no part reads smaller"). I tried the halo
   on both: heavier and busier than the knockout, so I reverted them. cloud-download now differs from
   cloud-upload (halo vs knockout) because its head, not just its stem, crossed the edge. Alternative
   for consistency: halo on all three, or redraw the arrows inside (spec's rejected candidate B).
2. **calculator**: filled, the display is a hole the size of the frame's interior (4.9 × 1.4), so it
   reads smaller than the outlined 6 × 2.5 frame. A hole at the frame's centre-line (6 × 2.5 r 1)
   would keep its size; a knockout ring would leave a 0.25 sliver. Left as is (recent change in this
   branch, spec row "display interior a white gap").
3. **truck**: spec row 3172 says the chassis line at 8 is a `cut` filled, but the file marks it
   `line`, so filled has no band. The wheels' upper halves merge into the body (recorded owner call,
   gap rings left slivers). Not changed.

### Pass P4

Before sheets: `P4-before-1..12.png`. After: `P4-after-1.png` (person-settings, smile-plus [reverted], bot-builder, send, bell family), `P4-after-2.png` (alarm). Originals in `before2/`. Lint: `icon lint ok` on all changed icons.

#### Changes

| name | filled now |
|---|---|
| person-settings | The body's `fill` closes along the outline's own overlap-cut arc (r 4.75 about the gear, 7.302,10.297 → 7.961,13.5) instead of running to x 9, so no fill reaches inside the gear's gap ring (it left a black sliver merged with the gear's ring, R1 merge). Outline unchanged. |
| bot-builder | The helmet's two rib knockouts start on the dome's centre-line (y 1.854) instead of 2.5, so the generator saws them flush out through the top edge; they had round caps 0.65 short of the edge (R3). Outline look unchanged (the extra length lies inside the dome stroke). |
| send | The centre fold is a `knockout` (was outline-only `line`): sawn flush at the notch, round free end inside (R2/R3; the 10-04 README cites send's fold as a knockout running through the edge in every other system). This reverses the earlier "outline only (Fluent's filled send has none)" record. |
| bell, bell-ring, bell-dot, bell-off | The clapper stays the outline's U cup line, joined to the body's base as in the outline; the filled-only gap under the body is gone. Filled, the clapper had been a solid cut down by the gap, reading smaller than outlined (R1). |
| alarm | The two bells stay the outline's lines (closed against the clock's edge as in the outline); the clock face fills with its hands knocked out; the gap ring is gone. Filled, the bells were solids cut back by a gap ring, reading smaller (R1). |

#### R1 calls

- Bell clapper: attachment, stays a line (like the clipboard's clip, option B).
- Alarm bells: attachments, stay lines. **Owner check:** with lines the filled alarm reads a little like ears; the alternative under R1 is bells solid at their full outline size, joined to the clock (no gap), not the old cut-down solids.
- Crystal ball's base: kept solid, judged a second mass of the object (a plinth, not a thin stand). Reverse if the owner sees it as a stand.
- Lightbulb's screw base, headphones'/headset's cups, music's noteheads and beam, tree trunk (line), megaphone handle (line), robot antennas (lines), bots' hats (fill, recorded): unchanged, already R1.
- video: lens and body merge filled, as they join in the outline; left.

#### Open, not changed

- **smile-plus (R4 breach, needs a geometry decision):** filled, the + is knocked out through the face's edge (sawn arms). The R4 "beside" fix (+ as a line, face cut back with a halo) was tried and reverted: the + sits 1.375 from the mouth's end, so the cut-back leaves a 0.25 strip and the mouth runs into the cut. It needs ≥ 2.1 between + and mouth: move the + out (it would leave the live area) or shrink the face/mouth. Owner to choose.
- brain-off filled drops the left hook knockout (it would leave a ~1.0 fill sliver against the slash); probably intended, left.
- chat-sparkle filled keeps the corner sparkle as an outline (halo cut-back); grid-sparkle and wand fill their sparkle. Not an R1–R5 breach, but inconsistent; owner may want the corner sparkle solid.
- bot-designer's crown keeps pointed lower corners against the visor gap (recorded 10-03 design), not an R-rule breach.
- slivers.mjs not run: it reads the generated `src/pilot-icons.tsx`, which this pass may not regenerate. Checked by eye at 240px and 16–48.

Everything else on the list needs nothing.

### Pass P5

Result: **no changes.** Every icon on the list passes R1–R5 as drawn. Lint (`--only` the whole
list) prints `icon lint ok`; `slivers.mjs` over the list reports none. Since nothing changed, the
sheets are `P5-before-1.png` … `P5-before-12.png` (8 per sheet, in list order); there are no
after sheets.

| name | filled now |
|---|---|
| (none changed) | |

#### R1 calls (body or attachment), recorded
- clapperboard: the board and the clapper are both the body (two masses of one object); hinged at
  the left as in the outline. Its stripes are knockouts sawn through both edges of the clapper (R3).
- images, gallery, shadow, bring-to-front: the front copy fills; back copies, shadow strip and
  frame arms stay as the outline draws them.
- trash (lid, handle), pushpin (needle), presentation (legs; the rail is the board's top edge, so
  its overhangs stay at line weight), key (bit stays a loop), exit-door (frame and floor stay
  lines, the leaf fills), eraser and signature (baseline and wave stay lines): only the body fills.
- highlighter: three solid blocks (cup closed across its top, collar, tip). Already recorded in the
  spec as Fluent's filled marker, owner-steered; all three are body. Left alone.
- blur: half-disc fills and the lines run from its flat side, as in the outline (Fluent's blur,
  recorded in the spec). Not a "line beside a solid" merging; left alone.
- mask: square solid, circle a hole (Figma's mask, recorded). Left alone.
- Marks: filter-add, filter-dismiss, square-badge, grid-plus keep the mark beside the shape as a line,
  with the shape cut back by the overlap cut (R4 "no room / open shape" case, R5). All other marks
  on the list are already inside their ring or square and knocked out with round ends.

#### For the owner
- **group** (open): filled, the two stacked boxes are one union solid with no separation, so they
  read as one blob. The spec records why (a cut along their shared edge ran through both boxes'
  rounded corners and squared them). Under the new rules the shared line is a detail (R2), but any
  sawn cut along y 8 squares the upper box's bottom-left and the lower box's top-right corners, and a
  knockout stopping at the concave corners would end short of the edge (R3). Options: (a) keep the
  union solid (current); (b) accept the sawn cut with the two corners squared; (c) redraw the boxes
  so the shared edge ends clear of their corners (a shape change, so not done in this pass).

### Pass P6

Before sheets: `P6/g-aa.png` … `P6/g-ak.png` (8 per sheet, list order). After: `P6-after-1.png`
(wallet, toy-brick). Originals in `before2/wallet.svg`, `before2/toy-brick.svg`.
Lint over the whole list: `icon lint ok (88 icons)`. slivers.mjs not run (it reads the full generated
`src/pilot-icons.tsx`, which this pass may not regenerate); the 240px after sheet shows no slivers.

#### Changed

| name | filled now |
|---|---|
| wallet | the body fills and the flap seam is a knockout slot (M3.5 6H11.5) with round ends inside the solid, as Fluent's filled wallet. Before, it was a `gap` with square ends stopping 1.5 short of the left edge and flush against the shoulder on the right (a cut stopping short, R3). Running it out was not clean: the seam meets the left side tangentially (it would leave a 0.06 hairline) and on the right it would shave the body's rounded shoulder. Outline unchanged |
| toy-brick | the brick fills and the two studs stay lines (open U's standing on the solid). Before, the studs filled and merged with the body into one silhouette (an attachment that fills and merges, R1, like pegs). Outline unchanged |

#### R1 calls (body or attachment), no change
- cart / cart-add / basket: basket body fills; handle, rail, wheels, rim and handles stay lines.
- trophy: cup and base fill (both the object), handles and stem stay lines.
- timer: the case fills; crown, button and bar stay lines. goal: rings fill by weight (a target is a line drawing), fletching solid.
- eyedropper: bulb and tube fill, the collar stays a line. paint-bucket: the paint fills, the bucket stays a line.
- graduation-cap: board and skirt fill (owner's earlier choice), tassel a line. scale: bowls fill, legs and beam lines.
- binoculars: barrels fill, the objective rings stay rings. coffee: the cup fills, handle and steam lines.
- briefcase: body fills, handle a line, clasp a hole with the seam meeting it flush. flag: the cloth fills, the pole a line.
- hammer: head and handle fill (a tool is one mass), face separated by a cut. chess-rook: one silhouette, crenels sawn at the top.
- coins: both coins fill, the back one overlap-cut (people's convention). bandage: front strip whole, back strip parted by a gap.
- award: the medal's centre disc fills, the medal ring and ribbon stay lines (token's treatment). See below.
- dumbbell: inner plates fill, outer plates and bar stay lines. See below.

Everything else passed R1–R5: knockouts sawn where they reach an edge (ruler, ticket, paintbrush,
pen-tool, banknote's arcs, chess-rook's crenels), round inside (clock, timer, shopping-bag, credit-card,
piggy-bank, discount); cuts run through (pie-chart, cube, crown, gift, book, library, magnet, broom,
party-popper, chef-hat, blocks, flask); marks inside shields, bookmarks and badge-check are plain knockouts;
off icons follow the shared slash; clock-alert keeps its ! beside the ring with the ring cut back (R4, R5).

#### For the owner
1. **cart-add**: the basket (4 tall inside) has no room for even the 3px + with detail gaps, so the + stays
   outside as a line on the top-right corner with the basket cut back by the overlap cut (R4's fallback).
   It still reads close to "E+" because the + arm continues the basket's top line; a taller basket for the
   variant, or the + moved clear above-right, would fix that. Not changed (redesign).
2. **award**: filled leaves the medal as a ring with a solid centre. Read as "the medal is the body", R1/R2
   would give a solid medal with the inner ring knocked out. Kept, as it matches token and was approved.
3. **dumbbell**: the outer plates stay lines while the inner plates fill. Arguably all four plates are the
   body. Kept (not a merge or shrink).
4. **basket**: the band is outline-only, so filled loses it (dropped earlier for slivers between the slats).
   Not an R1–R5 break, but a detail missing when filled.
5. **wallet**: the slot now stops 1 short of the flap's step, as Fluent's. If the owner prefers the seam to
   run out on the right, the gap would flatten the body's top-right shoulder.


## Arrow follow-up, 2026-10-04 (owner: "these arrows aren't the same… fix this and other instances of short arrows and off-centred")

All arrows measured (shaft against head; a diagonal's head taken across its shaft):

| Icon | Now |
|---|---|
| file-download, file-export | one arrow turned 90°: a 3.5 shaft and a 1.5 head; download centred on 8 (it sat 0.5 right with a 3 shaft and a 2 head) |
| screen-share | 1.5 head on a 4 shaft (2.67), centred in the screen (the 2 head on 4 read short) |
| call-incoming, call-outgoing | 2px corner heads on the 4.95 diagonal (the 3px heads filled their 3.5 box) |
| import, cloud-upload | filled: the stem outside the box or cloud stays ink, ending flush on the edge where the knockout takes over, so the arrow keeps its length (it lost its tail) |
| cloud-download | filled: the tip below the cloud's foot is ink, clipped flush at the foot (the knockout lost the whole tip) |

Generator: a filled-only `stroke` in an icon with solids is ink drawn over the solids at the
outline's curve weight; `stroke-linecap="butt"` ends it flush on an edge and `data-clip="x0 y0 x1
y1"` keeps only the part inside that box. Checked and kept: log-out's 7 shaft (2.33; a longer one
breaks the lattice or the door gap), the corner-head arrows, the curved arrows.

| notebook (owner, 2026-10-04) | filled: the cover fills up to the band and the strip beyond the band stays open (outlined), as the dog-ear and Phosphor's spine; the rings are ink stubs that only stick out past the cover's edge (their part over the cover is dropped). Options on `5-notebook-options.png` and `6-notebook-rings.png` (prototype `proto-nb-2`) |

## Owner notes, 2026-10-04 (notebook, wallet, toy-brick, sticky-note)

Owner: apply the arrows' filled treatment to the notebook's rings; "the monoline icon should just be
filled"; toy-brick's studs too tall; wallet's front should just fill; sticky-note's fold smaller.

| Icon | Now |
|---|---|
| notebook | rings 3.5–6 at 5, 8, 11 in both styles. Filled, as import and cloud-download: the ring is a knockout over the cover and ink outside it, clipped flush at the cover's edge (`data-clip="0 0 3.9375 16"`), so each ring reads whole. Body stays `proto-nb-2` (cover filled to the band, strip beyond it open); the page had still shown the earlier full-cover version with the band cut through |
| wallet | the front (seam, right step, bottom, left side) is the `solid`; the back flap stays a line, as folder-open's back. The seam knockout is gone; the clasp stays a knockout. Outline unchanged |
| toy-brick | studs 2.5 tall (3–5.5, were 3), counters 1.43; body 7.5 tall (5.5–13, was 8) so the brick stays centred on 8 and nears a real 1 × 2 brick's proportion. Owner-approved 3-tall studs (round 2026-10-02) reversed |
| sticky-note | fold 4 (13.5, 9.5 to 9.5, 13.5; was the shared 4.5) with an r 1 inner corner, pocket 1.35 tight. 3 failed the counter rule (0.66); 3.5 is off the diagonal lattice. document keeps the shared 4.5 fold |

## Wider fold, 2026-10-04 (owner: "make the diagonal line placed wider so the triangle inside is bigger", as Fluent's; then "the fold line [should] meet to form a triangle point at the end")

The page fold's diagonal starts further along the top edge and still ends on the fold's foot, so the
dog-ear is a triangle with a point at the bottom, as Fluent's: the top edge runs 1 past the fold line
and turns down with an r 1 fillet, and the diagonal runs straight to the fold's corner (`M8 2L9 2`,
filleted, `L12.5 6.5`; about 52°, so `data-angles="free"`, added to file-pen and file-search). The
fold L is unchanged; the pocket grows from 1.53 to 1.93 and the silhouette's cut corner shrinks.
Filled: the dog-ear stays open; the short top piece is drawn in both styles. A first try that also
moved the diagonal's lower end out (meeting the side 1 above the foot) was blunt at the bottom and
was replaced. Applied to every icon with the shared fold (document, document-add, -check, -remove,
file-code, -cog, -download, -export, -image, -lock, -pen, -search, -spreadsheet) and files' front page
(r 0.5 on the 3.5 fold), its back page's corner following. sticky-note's peel keeps its 45° diagonal
with points at both ends (4px fold, pocket 1.35): a peel has no top edge to run on.
Sheet: `docs/research/icon-review/2026-10-04/8-wider-fold-after.png`.

## newspaper, 2026-10-04 (owner: "shouldn't this just be the normal monoline but unfilled?")

The front page is the `solid`; the back page wrapping round the right stays the outline's line in both
styles, as wallet's flap and folder-open's back. Before, the back page filled too, parted from the
front by a `gap`. Outline unchanged.

## Secondary parts stay lines, 2026-10-04 (owner review round 2, `reviews2`)

Owner notes: calendar "top part should be just unfilled", folder "just the top tab part unfilled",
archive "the top part … should be just unfilled", receipt "the fold behind should just be unfilled",
clipboard "there shouldn't be negative space around the top clip part, apply this change to other
icons", clipboard-paste "the clipboard itself should be filled and the layer on top should be
unfilled", map "fill the left and right sides … the middle can be unfilled", basket "thicken the
strokes rather than fill"; then "make sure the filled icons (new unfilled parts) [are]
implemented consistently or intentionally".

**Rule.** The body fills. A secondary part (a header, tab, lid or rim, the page or fold behind, a
page laid on top, an attachment such as a clip or peg) keeps the outline's drawing: its line at the
outline weight and its inside open. Nothing is cut round it: the line meets the solid directly.
Source pattern: the outline is drawn in both styles (unmarked) and the body is a `fill` path that
stops at the secondary part's line.

| Applied | Now |
|---|---|
| calendar, calendar-add, -check, -remove, -clock | the header stays open (pegs still lines); the body below the header line fills; dates and marks knock out of the body |
| folder, folder-add, -check, -remove, -lock, -zip, folders | the tab above the flap line stays open; the body below fills |
| archive, archive-restore | the lid stays a line; the box fills |
| shopping-bag | the rim stays open; the bag below fills (the handle a knockout) |
| gift | the lid stays a line (the ribbon on it a line); the box fills with the ribbon cut through it |
| app-window | the title bar stays open, its dots ink; the window body fills (same shape as calendar) |
| receipt | the curl behind stays a line; the slip fills |
| map | the two side panels fill, the middle panel stays open (owner) |
| clipboard, -check, -list | no gap round the clip: the clip's ring meets the filled board, its opening stays a hole |
| clipboard-paste | the board fills; the page on top stays open (its outline drawn, its inside a hole); no gap round the clip |
| basket, broom | line glyphs, filled by weight (owner: basket; broom's note was cut off, read as the same). basket's handles end 0.5 further out (3.5 and 12.5) so the slats clear them at 1.5px |

Kept, intentionally (equal parts, not a body and a secondary part): book's two pages, columns,
layout and kanban panes, credit-card's stripe, hard-drive's halves, laptop's screen and deck, mail's
flap (a detail on the front), chef-hat and crown bands, mouse buttons, pencil and eraser bands, the
bell's clapper and the graduation cap (a part in front, Fluent's gap). Badges (a lock, clock, gear,
lens or pen on a file or folder corner) keep their gap: a mark is information, separate from its
host.

**Document fold, 45°, aligned to the page** (owner, files: "the angle of the triangle should be more
equal, not as tall, look at lucide"; "see how the fold triangle['s] negative space aligns with the
[page's] unfilled space"; "the stroke forms a perfect triangle in fluent, but area there's still a
slight space next to the corners"). Fluent's document_16 pocket is a 45° triangle whose corners sit
just inside the page's inner top and right edges (0.2 in), so the diagonal closes both corners to a
point and the pocket lines up with the page's white. Area: the fold L stays the shared 4.5 × 4.5
(`M8 2V5A1.5 1.5 0 0 0 9.5 6.5H12.5`); the diagonal runs at 45° from 0.5 past the fold on the top
edge to 0.5 above the foot on the side (`M8 2L8.5 2L12.5 6L12.5 6.5`, r 0.5 fillets). At 16px its
inner edge passes 0.3 inside both pocket corners, so they are points; the diagonal sits on the half
lattice (x − y = 6.5), so the fold icons carry `data-angles="free"`. Placed where the inner edges
would meet exactly (x − y = 6.8, a 1 step left 0.2 flats at both corners; thinner lines at 24–48
need it inside 6.45 to stay pointed). Pocket 1.88. Page contents keep their places; document-check's
check moves 0.5 right (owner: "slightly off-centred"). files' front page is the same at its size
(`M6.5 4.5L7 4.5L10 7.5L10 8`), its back page following. sticky-note (owner: "make the fold bigger,
to match the document fold"): a square 5 × 5 L (`M13.5 8.5H10A1.5 1.5 0 0 0 8.5 10V13.5`), the
diagonal 0.5 past it on both edges (`M13.5 8.5L13.5 9L9 13.5L8.5 13.5`, r 0.5), pocket 2.18.
This replaces the "Wider fold" geometry above.

Still open from `reviews2` (not part of this pass): replace verdicts (26), face centring (smile,
frown, square-smile, scan-face, smile-plus, meh), call and call-incoming/-outgoing strokes, person
mark placement, calculator header, chat-question's ?, quote, qr-code, vault, vr-goggles, piggy-bank,
party-popper, fingerprint, bot hats, crystal-ball, plane windows, signature's pen, newspaper spacing,
gallery size, compose's pencil, database, umbrella, brain-off, unpin, bug-off ("legs on monoline
only", unclear), and the questions on file-search's lens and file-cog's gear.

## Fold exact at every size; filled weight follows the curve, 2026-10-04

Owner: "the negative space still doesn't quite align on the top and sides, also why is the filled
[drawn with] thicker strokes at the largest sizes over the monoline".

**Fold.** The pocket's corners are where the fold's inner edges meet the page's inner edges, and
those lie on x − y = 6 whatever the weight; a stroked diagonal's inner edge sits half a line inside
its centre-line, so no one drawing keeps it there as the size curve thins the line (the half-step
version was 0.3 inside at 16, flush at 48). Now the diagonal is fixed where its inner edge is exact
at 16 (x − y = 6.795, `M8 2L8.795 2L12.5 5.705L12.5 6.5`, r 0.5) and the fold's L moves with the
weight (`data-shift="dx dy"`: translate by (dx, dy) × (16px weight − rendered weight), here 0.7071,
−0.7071), so the pocket is a closed triangle on the page's inner edges at every size. The L's ends
stop short (`M8 2.4V5A1.5 1.5 0 0 0 9.5 6.5H12.1`) so their caps stay inside the top edge and side
as it moves (to 64px). `data-part="fold"` makes the lint measure the L and diagonal as one shape.
Same for every page icon, files' front page (`M6.5 4.9V7A1 1 0 0 0 7.5 8H9.6` against
`M6.5 4.5L7.295 4.5L10 7.205L10 8`) and sticky-note (`M13.1 8.5H10A1.5 1.5 0 0 0 8.5 10V13.1`,
shift 0.7071, 0.7071, against `M13.5 8.5L13.5 9.295L9.295 13.5L8.5 13.5`).

**Filled weight.** Until now the filled variant drew its solids' silhouettes and the lines beside
them at the 16px weight enlarged, so at 32–48px they were heavier than the outline. They now follow
the size curve like the outline. Gaps between two solids keep the 16px clearance.

**Halos match the outline's overlap cut** (owner: "redraw those seven icons' gaps so they match too";
round 3 notes on calendar-clock, file-lock, folder-lock, file-search, file-cog: "the cutouts … are
not very clean edges"). A part in front of a solid is parted from it by the outline's overlap cut,
2.25 between centre-lines, at every size: a `halo` (round a line) is now `4.5 − line` wide on the
size curve (was 3 lines at the 16px weight), and a solid in front declares `data-halo` (the
generator cuts the same band round it, then restores the solid, so its own knockouts still cut it
and a line halo never cuts it). The hand-drawn gap rings these replace were flush only at 16px.

| Icon | Now |
|---|---|
| calendar-clock | the clock `data-halo`; the gap ring removed |
| file-lock, folder-lock | the lock body `data-halo`, the shackle a `halo`; the gap rings removed; the strips that clear the page's right edge above the lock kept (the outline has no edge there) |
| file-cog | the gear `data-halo` and one round halo at the teeth's tips (r 2.75), so the page is cut back in one smooth arc (a halo per tooth left a scalloped edge); the page fill is the plain page (its hand-cut arc and strips removed). Owner's note on the fold corner above the gear resolved by the same change |
| file-search | the lens is a line, open inside (owner: "the search icon should not be filled"): a ring drawn in both styles, its inside a hole, lens and handle a `halo`; the edge strips kept |
| bot-guard | the brim a `halo` (the hand-drawn band through the crown removed) |
| printer | the sheet is a line in front, its inside cut to its centre-line, so it stays white with no strip at any size |
| truck | the wheels' insides cut to their centre-line (were 0.4 short) |
| chat-sparkle | unchanged source; the sparkle's halo now on the curve |
| folder-zip | the pull is a line, cut out inside (owner: "zipper part is not cutout"); its gap and fill removed |
| broom | owner: "filled should not be stroke thicker, it should be the top part of the broom getting darker": the binding (the half-disc between the head's top arc and its band line) fills; the bristles stay lines |
| file-spreadsheet | owner: "the gaps and margins should be equal": the cells' gaps, margins and row spacing are all 1.375 (`M6 9H6.75M9.25 9H10…`) |

Scanned with `slivers-at.mjs` at 32 and 48 against the scan before the weight change: 22 slivers
gone at 48, two new and kept: truck's cab and chat-sparkle's bubble keep a thin edge where the
outline draws a line (the outline's own weight there). file-pen's replacement (owner: Fluent, "the
pen still doesn't look like a pen") is not part of this pass.

## Fold corner and marks on folded pages, 2026-10-05

Owner (a lump at the fold's lower corner of file-lock/file-search, then a choice): "can you fix this?";
picked "Bottom-left (Recommended)" on `13-file-lock-placement.png`.

**Fold pieces.** The L that moves with the weight (`data-shift`) is three paths, so each end stays on
its edge: the vertical moves across only (`M8 2.4V4.6`, shift 0.7071 0), the inner curve both ways
(`M8 4.6V5A1.5 1.5 0 0 0 9.5 6.5H9.9`, shift 0.7071 −0.7071) and the horizontal down only, ending on
the page side and turning up it (`M9.9 6.5H12.5V6.2`, shift 0 −0.7071); the diagonal stops at its
fillet (`…L12.354 5.559A0.5 0.5 0 0 1 12.5 5.912`). Before, the one-piece L ended short of the side
and the diagonal's tail ran on below it, which showed as a lump wherever the page has no side under
the fold. Same for files' front page and sticky-note (`data-part="fold"` on all four).

**Marks on folded pages sit bottom-left** (Fluent's document_lock, document_search): the lock, the
lens and the gear sat 2 to 2.4 below the fold, inside the 2.25 overlap cut, so the filled page was cut
up under the fold (a white crescent and a point of fill). Bottom-left, the fold and right side stay
whole. Each mark overhangs the left edge as Fluent's do: lock body x 3–7 (shackle `M4 10.5V9.5A1 1 0
1 6 9.5V10.5`), lens r 2 at 4.5, 10.5 with the handle `M6 12L7.5 13.5`, gear r 2 at 5, 11.5. The
page's outline ends, and its filled silhouette is drawn, along the overlap cut (2.25 from the mark's
centre-line), so both styles end the page on the same curve at every size: file-lock
`…H9.062A2.75 2.75 0 0 0 9.25 13V11A2.75 2.75 0 0 0 8.178 8.822A3.25 3.25 0 0 0 3.5 6.617`,
file-search `…H9.694A2.25 2.25 0 0 0 9.091 11.909L8.641 11.459A4.25 4.25 0 0 0 3.5 6.369`, file-cog
`…H9.33A5 5 0 0 0 3.5 6.73`; folder-lock and calendar-clock (no fold) keep their marks and use the
same contour (`…14 6V6.423A3.25 …`, `M2.5 6.5H5.438A5.75 5.75 0 0 0 5.438 13.5…`). The filled
variants need no halo or strips. file-pen keeps its pen until it is redrawn (owner: replace, Fluent).

## Batch 67: Pen, 2026-10-05

| Icon | Construction |
|---|---|
| pen | The shared writing tool (Lucide's pen with a sharper 60° tip): a 2.83-wide body on the 45° lattice (sides x + y = 14 and 18) from a tip at 2.5, 13.5 to a round top, a semicircle about 12, 4 (r 1.414) whose apex meets the pencil's square top; shoulders r 0.5. The clip (Fluent's, Phosphor's) leaves the body just under the top, steps out square (`M12.5 5.5L14 7`) and runs back along it, a detail gap from the body (`L12 9`). Filled: the body fills, the clip stays a line. |

pencil is the same drawing with a square top (r 0.5 corners at 12, 2 and 14, 4) and Lucide's band 2.12 below it (`M10.5 3.5L12.5 5.5`, a cut when filled); pencil-off, compose, signature and file-pen reuse it at the same width with a shorter body. Recorded in the spec section 'Pens and pencils, 2026-10-05'.

## Pens and pencils, 2026-10-05

Owner: "make the pen and pencils everywhere more consistent, make them all look like lucide's pen with
a sharper point and round end. create a pen icon … the pen and pencil the same size and shape overall
but maybe the pencil can have a square top and the pen can have a rounded top. the pen can also have a
clip like fluent/phosphor … pen tool, highlighter, and paintbrush stay the same … make the eraser look
more like fluent's, wider, and the line is closer to the end of the eraser". Sheets:
`docs/research/icon-review/2026-10-05/` (1–2 before, 3–4 after; group `pens` in icon-references.json).

**One writing tool.** A 2.83-wide body (centre-line) on the 45° lattice, its sides on x + y = axis ± 2,
a 60° tip (taper edges 30° off the axis, shoulders r 0.5; the tip itself sharp, rounded only by the
line's join), sharper than Lucide's ~73°. The pencil ends square (r 0.5 corners) with Lucide's band
2.12 below the end (a `cut` when filled; a `knockout` where it sits over a page, file-pen); the pen ends
in a semicircle (r 1.414) whose apex is the pencil's end, and carries a clip (Fluent, Phosphor): out
square from the body under the top and back along it, a detail gap away (`M12.5 5.5L14 7L12 9`).
Every use keeps the width, tip, band and end; only the body's length changes:

| Icon | Now |
|---|---|
| pencil | tip 2.5, 13.5 to the square top at 12, 2 / 14, 4; band `M10.5 3.5L12.5 5.5` |
| pen (new, batch 67) | the same body with the round top about 12, 4 and the clip |
| pencil-off | pencil, with the shared slash |
| compose | the pencil from a tip at 6.5, 9.5 (same top and band) over the open square |
| signature | the pencil on axis x + y = 15, tip 4.5, 10.5, top 11, 2 / 13, 4, band `M9.5 3.5L11.5 5.5`, over the wave |
| file-pen | the pencil at the page's bottom-left (marks on folded pages sit bottom-left): tip 2, 14, top 6.5, 7.5 / 8.5, 9.5, band `M5 9L7 11`; the page is cut round it by the overlap cut (`behind`), and filled the pencil is `data-halo` (was a short capsule with a band, which read as a pill) |
| eraser | Fluent's proportions: a 5.66-wide, 10.6-long body (sides x + y = 12.5 ± 4, ends x − y = 7.5 and −7.5 after centring, corners r 1, r 0.5 where it meets the base), the band 2.83 from the lower end (was ~4), the base line `M6.5 13.5H12.5` |

pen-tool, highlighter and paintbrush are unchanged (owner). Lint: the counter check skips pockets of four
raster cells or fewer, which its 4-way flood cut off at the point of a 60° wedge (a raster artefact,
not a visible space).

Pens, round 2 (owner: "file pen should use a pen, not a pencil, make sure the pens used in compose and
filepen are skinnier like the actual pen icon. can you make the pen clip longer and round, and make it
not stick out as much from the body of the pen"):

| Icon | Now |
|---|---|
| pen | the clip leaves the body under the top, turns down in an r 1 curve and runs back 3.2 along the body, its centre-line 1.77 out (x + y = 20.5; was 2.12 out with a square step and a 2.8 run): `M12.75 5.25L13.293 5.793A1 1 0 0 1 13.293 7.207L11 9.5` |
| compose, file-pen | a pen (round top, no clip at this size), slimmer to match the pen's proportions in a shorter body: 2.12 wide (sides at axis ± 1.5), the same 60° tip (shoulders r 0.4), a round top r 1.06. compose: tip 5.5, 10.5 to the top about 12.25, 3.75, its band gone; file-pen: tip 2, 14 to the top about 6.75, 9.25 at the page's bottom-left, the page cut round it (`M3.5 7.818…M6.682 14…`) |

The pencil keeps the full width; pencil-off and signature keep the pencil.

Round 4 notes (`reviews4`: 26 approved, 2 fixed):

| Icon | Now |
|---|---|
| bot-guard | owner: "hat strokes still stick out a bit from the sides": the brim and the visor end at the crown's lower corners (x 3.5 and 12.5; were 3 and 13), the same curves cut at t 0.05–0.95 (`M3.5 5.956Q8 6.794 12.5 5.956`, visor `…L12.5 6.241Q8 9.509 3.5 6.241Z`), so the visor's ends meet the head's top corners |
| signature | owner: "the pen icon should be used here, not pencil": the slim pen of compose and file-pen (2.12 wide, round top r 1.06, no clip) on axis x + y = 15, tip 4.5, 10.5 |

Round 5 notes (`reviews5`):

| Icon | Now |
|---|---|
| bot-guard | owner: "maybe just fill the top of the hat?": filled, the crown and visor fill as one cap; the brim's halo (the gap between crown and brim) is gone |
| signature | owner: "add the clip": the slim pen carries the pen's clip at its scale (`M11.75 4.75L12.47 5.47A0.75 0.75 0 0 1 12.47 6.53L10.75 8.25`, the same 1.77 offset from the body as the pen's) |

## Consistency audit, 2026-10-05

Owner: "the hat in the fill shouldn't be all the way filled, just the top part and the brim … then
do a detailed audit on all the icons, monoline and filled, … call out any inconsistencies and then
build any icons that are necessary". The whole set (632 icons, 32 groups) was reviewed outline and
filled at 16 / 24 / 32 / 48 and 96px against the construction rules, with the parts-drift, optical
and sliver checks; owner-recorded decisions were left alone. Findings, outcomes and open questions:
`docs/research/icon-review/2026-10-05/README.md`. 53 icons changed (all back in review); the 24 new
icons are batch 68.

| Icon | Now |
|---|---|
| bot-guard | owner: filled, only the cap's top (above the band line, `M2.244 3.69…Q8 4.56 2.244 3.69Z`, `solid`) and the visor fill; the middle band stays open, its sides and the brim one outline path (`M2.244 3.69L3.5 5.956Q8 6.794 12.5 5.956L13.756 3.69`) |
| bot-automator | the hat rule from bot-guard: a band bounded by two lines stays open filled, so the puff (closed along y 4) fills and the band is a plain line; the `cut` is gone |
| bot-scholar | as graduation-cap: the board and the skirt are both solid, parted by a one-weight V gap 1.125 under the board's lower edges (the skirt filled as a 0.5 sliver) |
| bot-designer | the seam is a knockout from the crown's top into the visor gap (it was outline-only) |
| agent-circle, agent-square | the inner mark is agent's own path at 6 / 11 about 8, 8 (flats on y 5 and 11, sides parallel to the slash, stubs 0.9 for a 1.03 detail gap to the slash); the old mark dropped the flats and read as `</>` |
| brain | filled: the `gap M12.5 11H14.5` (a square notch with a tooth under it) removed; the right fold saws out by its own exit |
| brain-off | brain's fill, midline gap and the one-sided slash gap; the notch gap removed |
| compass-dot | the needle is a `hole` like compass's (it was a knockout, so it read black) |
| video-off | the filled body is video's rect exactly (x 1.5; it was 0.5 narrower) |
| location-off | the hole's chord lies on the slash centre-line (`M6.051 6.051A2 2 0 1 1 8.449 8.449Z`), so no hairline shows at 48px |
| images, file-image | the sun is the ⌀2 mark dot like image's (images at 11, 5; file-image at 6, 7.5 to clear the peak) |
| mail-plus, image-plus | filled: the flap / mountain knockout runs flush into the clearance round the + (the round end left tapering points of fill) |
| call-end | call's Phosphor handset turned 135° and scaled 0.825 (the old free-curve arch was the one handset left from Fluent); ink centre 8.25, 8 |
| sort-ascending | the arrow is sort's up arrow (13 → 3.5) |
| star-half | the star outline is an unmarked line and the left half the `solid`, so filled is a half star (it flooded the whole star, identical to star) |
| chart-scatter | chart's sharp axes `M2.5 2.5V13.5H13.5`, like every chart |
| app-window | stop's square frame (2.5–13.5, r 2), bar at 7.5, dots at 5, 7.5, 10 (it was 12 wide on whole pixels) |
| layout, kanban, table | headers at 5.5 (were 6); kanban's columns 6.5 / 9.5 (4 / 3 / 4); table's row 9.5 and its header and row one `cut`, its column a line plus a gap (layout's sidebar) |
| cards | Phosphor's cards-three on x.5: card 6.5–13.5, back lines 2.5 and 4.5; centre 8 (the 7.75 bias is given up for crisp edges) |
| presentation | legs `M4.5 13.5L8 10L11.5 13.5`, ink centred |
| flow | boxes 2.5–6.5 like grid and flow-wrap; the head is a tight 1.38 from them |
| eyedropper | filled: a one-cut gap on the tube side of the collar, so the tube parts from the bulb and collar |
| ruler | 9 wide (3.5–12.5, document's box), ticks 4 and 2.5 long |
| atom | nucleus ⌀2 (the centre-point dot), orbits' minor radius 2.625 for a 1.06 gap |
| menu | rows 3.5 / 7.5 / 11.5 (three-line stacks on x.5, 0.5 high, like text-align) |
| grip | rows 6.5 / 9.5, centred (width kept: package glyph) |
| percent | filled by weight; the O's no longer flood (letters fill by weight) |
| filter-add, filter-dismiss | filled: the cone ends square at the stem top and a stalk runs to the foot (no concave bite or tail round the mark) |
| plus-minus | both marks 9 wide, a standard 3 apart |
| check-check | the first check 3 / 6 (1:2) at vertex 5, 11 |
| trash | handle r 1 (the radius table's small part) |
| markdown | frame r 2 like the other horizontal frames (its 1.5 head stays: a 2 head leaves 0.375 to the M) |
| spell-check | letters 5 tall so B's counters reach 1.27–1.43; the check is the 1.5 / 3 check below right (owner to look) |
| list-numbered | lines start at 9.5 like list-checklist |
| list-tree | rows 3.5 / 7.5 / 11.5 |
| clipboard-check | the 2 / 4 check (`M5 10L7 12L11 8`), like desktop-check |
| document | text lines at 8.5 / 11.5 (8.5 was 9, a whole pixel) |
| code-block | 2-leg chevrons like terminal (`M7 6L5 8L7 10M9 6L11 8L9 10`) |
| cast | the wave source is the ⌀2 dot like wifi, rss, broadcast |
| watch, history, calendar-clock | clock's hands (a vertical hand and a 45° hand down-right) on every small clock face; the L to 3 o'clock is gone (delegated: the family follows clock) |
| banknote, ticket | r 2 corners like credit-card (same 12 × 9 footprint) |
| wallet | r 1.5 on every corner (bottom-left was r 2) |
| award | medal r 4.5 and the ribbon 0.5 lower: ink 10.12 × 13.28 (it read small beside trophy and crown) |
| coffee | steam on x.5 tops and whole feet (were quarter coordinates) |

Checked and left: pen's clip (owner set it today; its 0.64 gap is an open question), folder-check
(centring with folder-add's + leaves a 2.38 near miss to the flap), variable's × (3.5 leaves
1.125, detail not tight), square-list (no x.5 layout keeps the dots on the scale), remove-formatting
(text-size's T is the one off x.5), indent / outdent (owner), expand / collapse (their 3 barbs are a
2.12 diagonal head, 2.67× the shaft), upload (2.5 puts the head off the lattice), smile-plus (the
filled cut-back collides with the mouth; the + placement is the owner's open question),
mouse-pointer-click and paint-bucket (already at the recorded scale), hammer and party-popper
(lattice-safe shifts make the offset worse), dumbbell (r 1 plates read as pills).

Owner decisions on the open questions (sheets `11a`–`11c`), same day:

| Icon | Now |
|---|---|
| spell-check | owner: "the widths are wrong and the general design of the letters is off, B looks okay": ABC 4 tall (2.5–6.5) at geometric widths, A 3 (flat top 1 wide, r 0.5 corners, bar at 5.5), B 2 (bowls r 1), C 3 (r 1.5 top and bottom arcs on a short straight, open 30° either side), a standard 2.5 between letters so the filled 1.5 line keeps a detail gap; the 2 / 4 check below at `M4.5 10.5L6.5 12.5L10.5 8.5`. Three caps 5 tall cannot keep these widths and the filled gaps in 13 |
| replace | kept (owner) |
| agent-circle, agent-square | owner: "update": agent's own path with its full flats, scaled 0.575 across and 0.545 down about 8, 8 (flats on y 5 and 11, sides 4.55 and 11.45): tight 1.26 to the ring, detail 0.92 to the square |
| bot-designer | owner: the visor arch lowered 1 (crown and visor tops `Q8 4.75`, visor foot `Q8 6.25`), so the filled cap has a full crown; "make sure the top part of the hat connects with the brim": the filled gap between crown and visor is gone (crown and visor one mass, the visor a `solid` fill), the head's sides start at 6.5 so no notch shows where the crown's corner meets the brim, and the seam is a knockout from the crown's top to the visor (`M8 2.5V5.25`) |
| clock hands, call-off, copy-check, battery bars, cards | the delegated calls confirmed (owner: "update to the proposed", "I like 6c's check size currently", "I like 6e now", "go with your rec") |
| smile-plus | owner: "the filled + icon should have the inverse plus on the corner": filled, a ⌀6 badge at the +'s centre (12.5, 12.5) with a 3px + cut out of it (a `gap` shape, round ends), and the face cut back one weight round the badge (Fluent's emoji_add); the mouth runs into the cut. The outline keeps its 4px + beside the ring |
| ⌀1.5 and ⌀2 dots | owner: "the ! dot seems too big compared to the stem": every dot (r ≤ 1.25, not `data-dot="free"`) now follows the size curve with the line (`style={{ r: sw(weight, size, r / 1.125) }}`, the r attribute kept as the 16px fallback), so a dot stays 1.33× the stem at every size; at 48px it read 2.4×. 16px is unchanged |
| cloud-check | the 1.5 / 3 check inside the cloud like cloud-alert's mark (`M6 9L7.5 10.5L10.5 7.5`), a knockout when filled; the corner check is gone |
| calendar-remove | the − at y 10, centred with calendar-add's + and calendar-check's check (`data-gap="aligned"`: 2.38 to the header) |
| pen | the clip's return run on x + y = 21 (`M12.75 5.25L13.543 6.043A1 1 0 0 1 13.543 7.457L11.25 9.75`), about 1.0 from the body so it no longer merges at 16px (signature's small clip unchanged) |
| maximize, minimize | owner: "use arrows": aliases of expand and collapse; the corners minimize is gone |
| folder-check, cart-add | unchanged |

Owner notes on the decisions sheet (`12`, `13`), same day; sheets `14-round2-sizes.png`, `14b-round2-zoom.png`:

| Icon | Now |
|---|---|
| smile-plus | owner: "strokes touching/overlapping": the face is the small cut (r 4.5 at 6.5, 6.5; eyes at 5.19 / 7.81, 5.75; the mouth smile's scaled 0.75) so the 4px + at 12.5, 12.5 sits beside it whole, 1.58 clear, with no cut in the ring (person-add's small figure). Filled: the face fills, cut back round the ⌀6 badge, whose 3px + is cut out; the mouth ends 1.4 clear of the cut |
| cloud-check | owner: the check touched the cloud's notch: the 1 / 2 check (`M6 9L7 10L9 8`), tight 1.32 all round; every 1.5 / 3 placement on the lattice meets the notch or the foot |
| bot-designer | owner: "the brim can be more obviously a hat brim, maybe it extends out from the sides": the visor runs out to 1 and 15 with round ends (r 0.875), past the head's sides |
| spell-check | owner: "the B looks wrong, the bottom loop should be bigger than the top loop": letters 4.5 tall (2.5–7); B's top bowl r 1 (to 9) and bottom bowl r 1.25 (to 9.5); A flat-topped 1.5–4.5 with its bar at 6; C 12–14.5 (r 1.25 arcs); the 1.5 / 3 check at `M5.5 11L7 12.5L10 9.5` |
| agent, agent-circle, agent-square | owner: "where is this agent icon even from? … can [bot-agent] just be used if this agent symbol is not universal?": the mark was Fluent's `agents` (Microsoft's), not a shared convention. `agent` is now an alias of bot-agent; agent-circle, agent-square and the agent explore candidates are removed |

## Batch 68: Audit gaps, 2026-10-05

| Icon | Construction |
|---|---|
| copy-check | copy exactly with a 1 / 2 check knocked out of the front sheet's centre (`M5 9.5L6 10.5L8 8.5`), tight 1.38 all round; the 1.5 / 3 and 2 / 4 checks leave a 0.38 gap on one side in the 8 × 8 front (recorded exception). Filled: the front fills, the back L stays a line |
| document-dismiss | document-add exactly, its + replaced by a 3 × 3 × at the same centre (`M6.5 8.5L9.5 11.5M9.5 8.5L6.5 11.5`), detail 0.88 to the fold and sides; a 3.5 × leaves 0.64 to the fold corner. Filled: plain knockout |
| calendar-x | calendar-add exactly, its + replaced by document-dismiss's 3 × 3 ×; knockout when filled |
| folder-search | folder exactly with a small lens inside the body right of the tab (ring r 1.5 at 9.5, 8.5, handle `M10.75 9.75L12 11`), detail gaps to the flap, top, side and foot; the body under the flap holds only a 3-unit mark, so it sits right of centre. Filled: knockouts |
| timer-off | timer whole under the shared slash, flat; ring and crown one outline-only line. Filled: the ring fills, parted by the shared slash gap; the hand is outline-only (the gap would swallow it) |
| call-off | call's handset whole under the mirrored slash `M14 2L2 14` (`data-off="own"`, as search-off and Lucide's phone-off): the shared slash would run along the handset's inner edge. Filled: handset fill parted by the mirrored one-sided gap |
| sparkle-off | sparkle whole under the shared slash; filled, the sparkle fills, parted by the shared gap (heart-off, star-off) |
| person-lock | person-key's small figure exactly with the shared small lock (file-lock: 4 × 3 body r 0.5, r 1 shackle) beside the head at 10–14, its shackle top level with the head; detail 0.88. Filled: figure and lock body solid, shackle a line |
| shield-lock | shield exactly with a lock centred inside (body 5 × 3.5 r 1 at 5.5–10.5 × 7.5–11, shackle r 1.5), tight 1.23 / 1.6 to the shield, no keyhole (no room). Filled: as shield-user, the shield stays a line and the lock body fills |
| battery-full | battery-low exactly with three level bars at 4.5, 7, 9.5 (2.5 apart, tight 1.38; even spacing chosen over crisp x.5 bars, which left 1.88 / 0.88 ends). Knockouts when filled |
| battery-medium | battery-full's first two bars (4.5, 7). Knockouts when filled |
| maximize | expand's drawing (`data-alias-of="expand"`): two corner arrows pointing out (owner, 2026-10-05) |
| minimize | collapse's drawing (`data-alias-of="collapse"`): two corner arrows pointing in (owner, 2026-10-05: arrows for minimize and maximize, not corners) |
| loader-circle | the r 6 ring as a 270° arc with round ends, open in the top-right quarter (`M14 8A6 6 0 1 1 8 2`, Lucide's loader-circle). Fills by weight |
| text-align-justify | the text-align family's three lines at 3.5 / 7.5 / 11.5, all 2.5–13.5. Fills by weight |
| list-minus | list-plus's four lines unchanged with the 4px − (`M10 11H14`) where the + was; standard 1.79. Fills by weight |
| case-lower | case-sensitive's a beside a b made of the same r 2 bowl and a stem rising to the cap height 4.5, stems a standard 3 apart, ink centred at 8, 8 like case-upper. Fills by weight |
| regex | asterisk scaled 0.727 (r 4) about 10, 6.5 and a ⌀2 dot at 3, 13; open gap 4.16 (`data-angles="free"` from the asterisk). Fills by weight |
| replace | search's lens drawn as reset's arc (r 4.92 round 7, 7) with reset's 3px corner head at the upper left, and search's handle `M10.5 10.5L14 14` (Material's find_replace, one arrow). Lucide's boxes-and-arrow could not keep its barbs on the gap scale at 16px (Fitting step 7). Fills by weight |
| heading-1 | heading's H made smaller (stems 2.5 and 8.5, 3.5–12.5, bar at 8) with a 6-tall numeral on baseline 12.5 at 11.5–14.5, a standard gap from the H; the 1's flag is 26.6° (a 45° flag failed the 60° acute rule). Fills by weight |
| heading-2 | heading-1's H; the 2 is an r 1.5 bowl, a tangent to the base and the base, its corner r 0.75. Fills by weight |
| heading-3 | heading-1's H; the 3 is two r 1.5 bowls with a 0.5 middle stub. Fills by weight |
| send-to-back | bring-to-front's 5 × 5 r 1.5 square twice as the fronts (2.5–7.5 and 8.5–13.5) over a 9 × 9 r 1.5 back square of which only the two uncovered r 1.5 corners show, a standard 3 from the fronts (Lucide's send-to-back). Filled: fronts fill, the back stays a line |
| ungroup | two of insert-row's 7 × 4 r 1 cards on the diagonal (2.5–9.5 × 2.5–6.5 and 6.5–13.5 × 9.5–13.5), standard 1.88; group's frame dropped (its boxes could not part inside it at a standard gap; Lucide's ungroup). Both fill |
| arrow-up-from-line | arrow-right-to-line's construction reversed: a 3px head tipped at 8, 3 on a shaft to 10.5, a standard 3 above a 10px bar at 13.5 (3–13); ink centre 8, 8.25 for the lattice. Turns: arrow-right-from-line 90, arrow-down-from-line 180, arrow-left-from-line 270 |

Derived names declared on existing sources (their drawings unchanged): insert-row → insert-column (transpose); corner-down-right → corner-up-right (flipy), corner-up-left (180) — corner-down-left is return itself, so it is not added; rotate → rotate-ccw (flipx). Considered and left out: the owner's niche removals (2026-10-02), file-audio/video, database variants, chart-candlestick, transport (train, bus), weather extras.

## Filled consistency audit and the size curve's hold, 2026-10-06

Owner: "do an audit of all the filled icons and make sure there is consistency with how they are
filled. things like the cloud lightning using a cutout but the arrow in import is just an inverse
shape. also at larger preview sizes the strokes and shapes do not scale equally and it throws off the
visual design." Sheets and tools: `docs/research/icon-review/2026-10-06/` (README).

**Audit.** Every icon, outline and filled at 32 and 16px, was reviewed category by category, with
siblings side by side (`audit.mjs`, the icon browser's categories), and checked by machine for
knockouts that leave their solid (`escapes.mjs`) and for slivers (`2026-10-02/slivers.mjs`). One class
was inconsistent: a part that crosses the solid's edge. cloud-lightning and chat-sparkle kept the part
ink and cut the solid round it (`halo`), while import, cloud-upload, cloud-download and notebook switched
the part to a knockout inside the solid and ink outside it, so one arrow changed colour at the edge. No
reference library does that (Fluent's thunderstorm cuts round the bolt; Phosphor keeps its arrows inside).
`escapes.mjs` finds no other icon whose knockout leaves its solid (chess-rook's crenels exit the top by
design). Everything else follows the filled story as recorded.

**Rule: filled keeps the outline's relationships** (delegated, owner to confirm). A part is one colour.
- Wholly over the solid: a knockout (marks in containers, a keyhole, hands).
- Crossing the edge, and cut round in the outline (a part in front: the bolt, an arrow over a cloud or
  into a tray): it stays ink and the solid is cut back by the same overlap cut (`halo`). import,
  cloud-upload and cloud-download now follow cloud-lightning.
- Crossing the edge and joined in the outline (an attached part: calendar's pegs, notebook's rings): it
  stays ink and joins the solid. notebook's rings are now ink stubs on the filled body (Fluent's
  notebook), not knockouts.
The 2026-10-04 line "an arrow that crosses a solid's edge keeps its whole length: the part over the
solid is a knockout and the part outside is ink" is replaced. Owner note, 2026-10-03 (cloud-download):
Phosphor moves the arrow up inside the cloud when filled; still an option for the arrow pair.

**The size curve holds at the 24px master** (delegated, owner to confirm). The line followed size^0.45
at every size while the drawing's gaps and cuts stayed fixed in its units, so above 24 the space grew
against the line: at 48 an overlap cut was 2.7× the line, at 128 about 5×. Fluent's masters grow their
line 1 → 1.5 → 2 → 2.5px at 16 / 24 / 32 / 48 (`subtract`, `add`: about size^0.8 above 24). The curve now
runs to 24 and holds: a larger icon is the 24px drawing scaled whole (`SIZE_CURVE_MAX`, gen-pilot-icons).

| Size | 12 | 16 | 20 | 24 | 32 | 48 | 128 |
|---|---|---|---|---|---|---|---|
| Line, before | 1.0 | 1.125 | 1.24 | 1.35 | 1.54 | 1.84 | 2.88 |
| Line, now | 1.0 | 1.125 | 1.24 | 1.35 | 1.8 | 2.7 | 7.2 |
| Fluent × 1.125 | 1.125 | 1.125 | 1.125 | 1.69 | 2.25 | 2.81 | – |

Components draw at 12–24 (Glyph), so they are unchanged; 32 and 48 (sheets, the icon browser, empty
states) and every preview now keep the 24px proportions.

**Owner's redraw list.**

| name | construction |
|---|---|
| desktop-check | the 2 / 4 check centred in the screen: `M5 7L7 9L11 5` (was 0.5 right of centre, 8.5 vs 8). |
| qr-code | owner (reviews2): the four data modules rounder, r 0.5 (was 0.25), the finder's 1 : 5 corner ratio. |
| globe | the meridian is a lens of two r 10 arcs through the poles (Lucide's construction), still 4 wide, so the thirds hold; it meets the ring at 53° instead of running tangent into it, which thickened both poles. Parallels unchanged. |
| plane | owner (reviews2, today): a cockpit window, a dash `M9.5 8H11` on the fuselage's axis behind the nose (2.5 from the nose, 2 from the top and belly, detail); a knockout when filled. |
| fingerprint | owner (reviews2): every ridge on one track. Arches are circles about 8, 8 (r 3, 5.5); legs continue them as arcs tangent at y 8, concentric about (−6, 8) on the right and (22, 8) on the left (r + 14), so legs on a side stay 2.5 apart and curve in like a pad; the centre line is the r 0 track. Breaks lie on their ridge's track (outer right leg to 9.5, its dash 12–13.5; the middle arch's left end at 200°, its dash 9.4–10.75), each break ≥ 2.4 so it holds at the filled 1.5 line. |
| graduation-cap | the board on exact 1 : 2 slopes (vertices 0.764 / 15.236, 6.5 and 8, 2.882 / 10.118, r 1 fillets, so its extremes land on 2, 14, 3, 10); the skirt meets the new edges at 8.368; the tassel moved to x 13.5 (was 14: a whole-pixel line, and its cap made a bump on the corner) from inside the corner's stroke to 10.5. The filled V gap is re-offset (one weight under the lower edges, r 2.125 at the vertex). |
| bandage | filled after Phosphor's bandaids: the front band fills with the dot knocked out and the back band keeps its outline (a secondary part stays a line), meeting the front band with no gap. Before, the gap cut the back band into two blobs that read as %. Outline unchanged (one plane, crossing whole). |

### Owner round, 2026-10-06 (second)

Owner: "why do import and share have different visual treatments for fill. also the lightning should be
the same treatment as the arrow right? … the cutout negative space around it at larger sizes is way too
large, i want the size to be evened out … fix the fingerprint again, make the loops of lines smooth and
consistent like apple's but not as many layers". Sheets `4-refs-arrow-containers.png`, `5a`, `5b`.

- **An arrow through a frame fills by weight.** import's box is a frame the arrow passes through, like
  share, open, download, upload, log-in and log-out (Fluent fills all of them by weight). It is now a line
  glyph; before, it alone filled its box. Bodies that are the object (a cloud, a page, a square) fill.
- **Every filled cut is the line's weight at every size.** A halo is three line weights wide (the line
  and one weight of space each side), so the bolt, the cloud arrows and chat-sparkle's sparkle sit in a
  cut equal to their line; it was the outline's fixed 2.25 between centre-lines, 1.5× the line from 24px
  up. Filled-only gaps follow the size curve too (they kept the 16px weight, 1.25× above 24).
- **A gap that offsets a front part became data-halo on that part**, so the space stays flush with the
  front's edge as the line thins (`gap-to-halo.mjs`; a fixed offset left a hair of the back solid on the
  front's edge): bell-dot, chat-dot, mail-dot, compass-dot, square-badge (the dot), smile-plus (the badge),
  coins, people (both parts of the front figure), shapes, cloud-sun, crystal-ball, devices,
  graduation-cap and bot-scholar. data-halo on an unstroked solid (a dot) cuts two weights on its edge
  and restores the fill alone. Centred separations (kanban, table, layout, brain, cube, package, the
  slash gaps) keep their gap, now at the line's weight. `--_icon-overlap` (base.css) is gone.
- **The outline keeps its geometric overlap cut** (2.25 between centre-lines), so above 24px an outline
  crossing's space is 1.5× its line while the filled cut is 1×. Open: matching it needs the outline to be
  drawn whole and masked like the filled variant.

| name | construction |
|---|---|
| fingerprint | after Apple's Touch ID with three layers: nested loops about 8, 8.5, each a semicircle on two straight legs, 2.5 apart (r 1.5 core with legs to 14 and 12.5; r 4 ridge with legs to 13 and 12, broken top-left between 230° and 268°; r 6.5 outer arcs 170°–250° and 285°–360°, then a short right leg to 10). Every line is a true offset of the core, so the spacing never varies. |
| import | a line glyph: the box (open round the arrow) and the arrow, filled by weight like share. |

### Fingerprint after Android's, 2026-10-06 (third)

Owner: "i want the fingerprint icon to be curved like androids icon". Constructed, not traced: a
two-centre spiral (`docs/research/icon-review/2026-10-06/fingerprint-spiral.mjs`). Half-turn k is a
semicircle about A = (7.75, 8.75) when even (over the top) and about B = A + (1.25, 0) when odd (under),
radius 1.25 (k + 1), so neighbouring turns are 2.5 apart everywhere and every curve is smooth. Four
strokes on the spiral: the core curl (t 0–1.55), a loop over the top (t 1.9–3) that drops into a straight
left leg to 12.75, a short dash on the outer track at lower right (t 3.62–3.85), and the outer turn as an
arc over the top (t 4.11–4.89, 20°–160°). Breaks are ≥ 2.4 along the spiral, so they hold at the filled
1.5 line. Ink 12.9 × 12, centre 7.75, 7.95 (the vertical leg must sit on x 4, so x sits 0.25 left).
Replaces the nested loops from earlier the same day.

### Owner round, 2026-10-06 (fourth): fingerprint, the ? and icons inside icons

Owner: "retry the fingerprint [reference: arcs over the top round an S-shaped core]. the question mark top
seems further away from the dot than the exclamation mark please fix all instances of question mark. make
the key in person key the same as the actual key icon. see if there are other instances of icons in other
icons as a smaller piece and make sure the design considers it, or if its different … that its intentional".
Sheets `7-fingerprint-key-question.png`, `8a-embedded.png`, `8b-embedded.png` (`embedded.mjs`).

| name | construction |
|---|---|
| fingerprint | arcs about 8, 9.25, 2.5 apart: an outer arc r 6.25 over the top (160°–20°), a loop r 3.75 from 240° over the top to the right, and the core: an r 1.25 arc from 240° over the top whose right end turns into an S, an r 3.75 reverse arc about 13, 9.25 (tangent where they meet) sweeping out to the lower right (to 80°). Replaces the spiral. |
| help, chat-question | the ? hook runs on straight 0.25 (`V9`, `V7`), so its end is 2.25 above the dot like every !; the gap is 0.94 in both marks (was 1.19). The dot and the glyph's height are unchanged. |
| person-key | the key icon at 0.59, still diagonal: bow r 2 at 12, 8 (filled round a ⌀1.5 hole), the shaft on x + y = 20 to 7.25, 12.75, and the key's square tooth (side 2.12, corners on the lattice: 9.5, 10.5 / 11, 12 / 9.5, 13.5 / 8, 12). Placed lower right like person-settings' gear and Fluent's person_key; the body's outline is cut round it by the overlap cut, and the filled body by a one-weight halo (bow `data-halo`, shaft and tooth `halo`), trimmed to x + y ≤ 21 so no pocket of body is left between the halos. Keyline square → circle (as person-settings). |

**Icons inside icons, checked** (each base beside every icon that holds a smaller copy):
- Same drawing, scaled or moved: settings' gear (person-settings, file-cog), search's lens (file-search,
  folder-search, square-search, replace), clock's face and hands (calendar-clock, clock-alert, history,
  watch, alarm, timer), sparkle (chat-sparkle, grid-sparkle, corners-sparkle, wand), sun (cloud-sun), code's
  chevrons (file-code, chat-code, code-block), desktop (devices, screen-share, desktop-check, desktop-play),
  phone (devices, tablet), smile (smile-plus, square-smile), undo (archive-restore), play (play-circle,
  desktop-play), chef-hat (bot-automator), cart (cart-add), crown (bot-lead, its body squashed to fit).
- Different on purpose (recorded): the lock in person-lock, shield-lock, file-lock and folder-lock drops
  its keyhole (a 4 × 3 body has no room); cloud-lightning and battery-charging use a line bolt, not flash's
  zap (an outline zap holds no counter at 4–6px); compose and file-pen use the slim pen without its clip,
  signature keeps it; framed and grouped figures use the small figure sizes; bot-scholar's board is flatter
  than graduation-cap's so the skirt keeps room; bot-lead's crown lost its balls (owner); brightness's rays
  are dots, sun's are dashes; playlist's note is one of music's two; the arrowhead classes by role.
- Fixed: person-key (above).

### Owner round, 2026-10-06 (fifth): the person family, faces, the cart, fingerprint candidates

Owner: "the placement of all of these icons are pretty inconsistent, … make the ratio of the head to the
body size slightly closer to the original person icon"; "the top part of the stroke of the wheels should be
right in line with the line stroke … across the bottom of the cart"; "the smile and all faces should be more
centered … make sure the other faces are intentional about the placement as well"; "fingerprint still needs
work … make a bunch of versions of it like 10". Sheets `9`–`11b`; `person-family.mjs` builds the family.

- **Person family** (person-add, -remove, -check, -x, -lock, -settings, -key): the figure is the standalone
  person moved left (head r 3 at 6.5, 5; body 1.5–11.5 × 10.5–14, r 3.5 shoulders), so head : body is
  person's (was ⌀5 on 7 × 3.5). Every mark sits at the lower right, about 12.5, 12.25 (+ and − on 12.5 rows;
  × 3.5 on 10.75–14.25; ✓ 1.5 / 3 from 10, 11; the lock 4 × 3 with the lock icon's shackle proportions; a
  smaller gear, ring r 1.5 with ticks to 2.25 and a ⌀1.5 hub cut when filled). All but the key share one
  round bite: the body stops on a circle about 12.5, 12.25 through 8.25, 14 (r 4.6), in both styles; filled,
  each mark also has a one-weight halo. The key keeps the key icon's drawing and its own cut. Fluent's
  person_* set places every mark this way. Keyline circle for the family.
- **Faces**: features centred in their shape (they sat 0.9 low). smile: eyes ⌀1.5 at 6, 6 and 10, 6 above
  the mouth's corners, mouth 6 → 10 with an r 2.5 curve to 10 (every gap to the ring on the scale; the
  3.5-apart eyes at y 6 left near misses). frown: the same eyes, mouth 6 → 10 at 10.5 curving up to 9.5. meh:
  mouth 5.5 → 10.5 at 10. square-smile and scan-face: eyes at 5.75 / 10.25, 5.75 (a standard gap from the
  frame), square-smile's mouth 5.5 → 10.5 (r 3.625). smile-plus: the smile at 0.75 in its r 4.5 face (eyes 5,
  5 / 8, 5; mouth 5 → 8 at 7.25, r 1.875). bot: eyes 8.5–10, mouth dot 10.75 (centred in the head); the hatted
  bots keep 9–10.5 and 11.25, which centres the face in what the hat leaves (checked).
- **cart, cart-add**: wheels r 1.5 at 5.5 / 12.5, 12, so their top stroke is the bottom bar's (y 10.5); the bar
  runs to 12.5. A 0.5 shift instead would have put the bar on a whole pixel.
- **Fingerprint candidates** (`explore/fingerprint-*.svg`, `fingerprint-candidates.mjs`, sheet
  `10-fingerprint-candidates.png` beside `9-fingerprint-libraries.png`): swirl, spiral, nested loops, tracks,
  original, broken arches (Fluent), leaning arcs (Heroicons), two arches and a stem (Tabler), swirl with legs,
  tilted loops. The icon stays the swirl until the owner picks.

## Quality and consistency pass, 2026-10-07

Owner: "first i want you to fix the clapperboard, make it look exactly like fluent. then … a very deep,
visual quality and consistency pass across all the icons again, make sure everything is visually polished,
accurate, consistent, cohesive, and intentional across all icons both monoline and filled. take in all the
context, feedback, and fixes ive provided into account".

**Method.** The 592 base icons were split by the icon browser's categories into ten groups, and each group
was reviewed icon by icon, outline and filled, at 16 / 24 / 32 / 48 and 96px, against the skill, the newest
spec record, the icon's family and every owner note from the review page (rounds `reviews` to `reviews5`,
566 rows). Machine findings fed each group: the lint report, the optical audit, parts drift, slivers at 16
and 48, knockout escapes, and a new geometry audit (`2026-10-07/geometry-audit.mjs`: near-tangent kinks, gaps
between the subpaths of one path, 45° lattice inside `data-angles="free"` icons, all three blind spots of the
lint). A second phase redrew the 16 round-2 "replace" verdicts that were still open ("Still open from
`reviews2`" above). Reports, scripts and sheets: `docs/research/icon-review/2026-10-07/`. 94 sources changed;
all are in review.

### Clapperboard (owner: "exactly like fluent")

| name | construction |
|---|---|
| clapperboard | Fluent movies_and_tv: an 11 × 6.5 body (2.5–13.5 × 7.5–14) with square top corners and r 2 bottom corners; the board raised at 1 : 3 (18.4°, Fluent's 18°) about a hinge on the body's top-left corner, 11 × 2.75 on the centre-line (Fluent's 11 × 2.75), r 2 top corners, sharp bottom-right; three line-weight stripes at 45° to the board, 3.13 apart, starting 1.465 along it (Fluent's places), clipped to the board's outline. Filled: the body fills and the board keeps its drawing, as Fluent's filled cut does. Ink 12.46 × 13.18, centre 7.83, 7.97; stripe pockets 0.93–1.25 (detail). Built by `scripts/clapperboard.mjs`. Replaces the 12 × 6 box with knocked-out stripes. |

### Fixes from the review groups

| name | change |
|---|---|
| square-dot, circle-dot-dashed | a stale `data-dot="free"` removed: it kept the ⌀2 centre dot off the size curve, so above 16 it read heavier than crosshair's and target's |
| option | the bar starts at 9.25 (standard 1.93 from the diagonal; 2.13 was a near miss) and is its own path so the lint measures it |
| calendar-check | the check is document-check's (`M6 10L7.5 11.5L10.5 8.5`), on the lattice and centred; a stale `data-angles="free"` that hid the lattice miss removed |
| compose | the box's right end at 8 (was 9, from the old pencil), symmetric about the pen's axis; both gaps 1.70 |
| split | corner heads at the keyline corners (expand's), legs on x.5; 1.88 under the keyline before |
| scissors | blades run to 14; centred (was 7.75) |
| replace | handle from 10.75, search's handle exactly (its cap reached the lens) |
| clipboard-check, clipboard-list | content centred under the clip (1 up), as desktop-check's check |
| paint-bucket | whole drawing moved (0.5, 0.5), which keeps the lattice: centred, level line on x.5 |
| quote | owner r2 ("stroke sticks out of the base"): each drop is a stroked ring (centre-line r 1.438) with a solid core, the tail running on from the ring, so the edges stay tangent at every weight; ⌀4 at 16 as before |
| strikethrough | the upper bowl one exact ellipse arc mirroring the lower (a 7.3° kink) |
| superscript, subscript | the 2 rebuilt as list-numbered's at rx 1.125 (an 8.4° kink) |
| case-upper | the B's lower bowl larger than its upper (bar at 7.5; r 1.5 / r 2), the owner's B rule |
| square-list | lines end at 10.75, margins even |
| stroke-weight | solid bars 2–14 at y 2–3, 6–8, 11–14: whole-pixel edges (solids are crisp on whole pixels), equal open 3 gaps, 12 × 12 centred |
| pen-tool | r 0.5 top corners and shoulders (the pen family's), the tip sharp |
| file-cog | the filled hub a solid ⌀2 hole (`stroke="none"`), not a stroked gap that left a dot in the middle |
| newspaper | owner r2 ("everything should be all even"): picture block 3 × 3.5 at 7.5, short lines at 8 and 10.5; every margin and the headline gap 1.375–1.44; the filled sliver between the lines gone |
| document-remove, folder-remove | the − centred where the family's + sits (y 10, y 9.5), `data-gap="aligned"`, as calendar-remove |
| notebook | rings at 4.5 / 7.5 / 10.5 (the three-line stack rule) |
| file-lock, folder-lock, file-search, cart-add | filled: the point where two offset curves of the overlap cut meet is rounded r 0.75 (`scripts/fillet.mjs`); owner r3 ("cutouts … not very clean edges") |
| call, call-outgoing, call-incoming, phone-missed, call-off, call-end | owner r2 ("the inside stroke … is not smooth"): the handset's inner bowl is three tangent arcs (r 1.25 / 4 / 1.25) with no straight pieces; pad ends r 0.5 |
| call-incoming, call-outgoing | owner r2 ("arrow tail too long"): a 2.5 head on the 3.5 box, shaft : head about 2 (Fluent 1.9) |
| chat-code | code-block's 2-leg chevrons, moved up 1 to the bubble's centre |
| flag-off | a pole drawn twice removed (it darkened the edge at 1×) |
| brain, brain-off | filled: the midline stubs start 0.5 off the seam (`M8.5 5.5H9.5`, `M7.5 12H7`) so they end round inside the gap instead of sawing a tooth into the other half |
| bot-designer | a neck joins the cap's button to the crown (it split off from 24px up) |
| chat-sparkle | filled: the bubble's top-right corner is chorded inside the halo (a speck at 32+) |
| printer | tray and sheet r 1 corners (Lucide) |
| gallery | owner r2 ("main shape larger, gaps smaller"): card 7 × 11, lines at 2 and 4.5 (tight 1.38) |
| vr-goggles | owner r2 ("move the line closer to the top"): lens line `M5 8.627A7.5 7.5 0 0 1 11 8.627`, a detail gap under the brow |
| car | owner r2 ("wider, the wheels should align with the lines of the car"): Phosphor's car made wider (keyline horizontal, mirror 1.5–14.5 at 6.5); body and wheels one outline, the sides running straight into 3-wide wheels (2.5–5.5, 10.5–13.5) ending at 12.5, r 1; the cabin's roof corners over the wheels' inner edges |
| vault | owner r2 ("more centered"): Fluent's 13 × 9 body (1.5–14.5, r 2), handle at 4.5; the dial 1.63 from the right, top and bottom walls |
| route | rows 3.5 / 7.5 / 11.5 (0.5 high, the stack rule) |
| truck | moved up 0.5: box top, chassis and base on x.5, centre 7.75 (the skill's heavy-base rule is high, not low) |
| battery-charging | bolt `M7.25 6.5L6.25 8H7.75L6.75 9.5`, centred on the body's 7 |
| party-popper | owner r2 ("strokes too close"): cone moved (−0.5, 0.5); confetti as separate paths, every gap tight (1.0–1.7) |
| chess-rook | filled: the open crown closed by a filled-only `fill` (the round caps grew knobs above the flat top) |
| atom | orbits 7.937 × 3 at ±45°, extremes on 2 and 14 (3.62 under the keyline before); nucleus gap 1.47 |
| thermometer | the tube 0.5 taller, centred (it read 27% small and sat low) |
| briefcase | body 5.5–13.5, handle top 2.5: every horizontal on x.5, belt and clasp centred |
| calculator | owner r2 ("larger top part"): display 3.5–6.5 (3 tall), margins even; filled, the display hole is cut to its centre-line (as Fluent) |

### The owner's open round-2 verdicts

| name | verdict | construction |
|---|---|---|
| person, person-add, -remove, -check, -x, -lock, -settings, -key | "gap between the head and shoulders is still too big" | head r 3 at 8, 5; body `M3 13.5A3.5 3.5 0 0 1 6.5 10H9.5A3.5 3.5 0 0 1 13 13.5Z`, so the gap is 2 between centre-lines (the framed figures' gap, 0.88 detail); ink centre 8, 7.75 (heavy base). The family's marks stay at about 12.5, 12.25; the shared bite is r 4.67 about it (`scripts/family.mjs 0 8 4.67`, `bite.mjs`). Framed and grouped figures unchanged. |
| key, person-key | replace → Phosphor | Phosphor's key: bow r 4.5 at 9.5, 6.5 with Phosphor's off-centre ⌀1.5 dot at 10.75, 5.25 (a hole when filled); blade 3.54 wide on x + y = 16, square end, a two-step bit. Ink centre 7.75, 8.25 (13.62 on the 0.5 grid can't centre). person-key carries it at about 0.56: bow r 2.5 at 12, 10.5, a 2.12 blade, one step, the dot centred (simplified, recorded). `scripts/key.mjs`, `pkey.mjs`. |
| handshake | replace → Lucide | Lucide's handshake at 2/3, which puts every 45° line on the lattice: three r 1.414 fingertips 4 apart, the thumb tip, a 90° r 2 knuckle and an r 4 top; cuffs pulled in 0.67 and their slant cut to 0.375 over 8, Lucide's wrist dip dropped (simplified, recorded). Keyline circle, ink 13.12 × 13.04 centred; fills by weight. `scripts/handshake3.mjs`. |
| bank | replace → Fluent (again) | the remaining differences from building_bank: one rounded plinth 2–14 × 11.5–14 (r 1 shoulders flaring from the colonnade), five columns (3, 5.5, 8, 10.5, 13), the pediment's eaves to the plinth's width; ⌀1.5 hole at 8, 4.75. Filled: pediment and plinth solid, columns lines. |
| building | replace → Fluent | Fluent's stepped silhouette: a tower 3–10.5 × 1.5–14 (r 1.5 top corners) and a wing 10.5–13 from 6.5 (r 1, sharp inner step), seven ⌀1.5 windows (5.5 / 8 / 10.5 × 4 / 6.5 / 9, the third column on row 3 only), home's arched door; `data-gap="aligned"` for the window grid (delegated, owner to confirm; two rows is the only fit without it) |
| piano | replace → Phosphor (again) | Phosphor's piano-keys with outlined black keys (4.5–7 and 9–11.5, down to 9) and off-centre dividers at 6 and 10; filled, the keys fill and the frame stays a line |
| chess-rook | replace → Lucide: "thicker and wider" | Lucide's proportions: the body twice as thick at the top (3 → 6), crown 9 wide, base 10; the body from the crown's arc ends to the base's flat top; crown bottom at 7; the flat filled crown kept |
| hammer | replace → Phosphor: "the handle should be longer … without the stroke at the end" | on the 45° lattice: handle 12k against a 15k head (0.80; Phosphor 0.77, before 0.63), head 4k thick, handle 3k wide, claw one r 5.745 arc, face cap with its cut, no tail; centre 8.3 |
| trash | replace → Phosphor: "wider base and wider handle" | body 3.5–12.5 (9 wide), handle 5.5–10.5 (5 wide, 2.5 tall for its pocket), lid overhanging 1; keyline square |
| camera, camera-off | replace → Lucide | Lucide's camera: a 12 × 8 body (2–14 × 5–13, r 2), a low hump (5, 5) → (6, 3) → (10, 3) → (11, 5) with r 1 corners (63° sides), an r 2 lens at 8, 9; camera-off is it under the flat slash, the lens knockout recut one-sided |
| lightbulb | replace → Fluent: "wider" | bulb r 4.5 at 8, 6.5 (10.12 wide, was 9.12), Fluent's concave turn into a 1 : 4 tapering neck, band 4.5 wide at 11.5, cap flat at 14 (r 0.75); band a `cut` filled |
| lasso | replace → Fluent: "loop should be more circular and round" | an r 5.5 circle at 8, 7.5 from 130° clockwise down to its own bottom, turning into an r 1.25 eye and a straight 45° tail (x − y = −1); keyline circle |
| pushpin, unpin | replace → Lucide: "add more detail" | Lucide's pin upright: an 8 × 2.5 head with round ends, a 4-wide column, a flare to a 9-wide base at 11.5 (r 1 fillets, r 0.5 corners), needle 11.5–14.5; unpin is it under the flat slash, its filled gap-side strip removed by a filled-only gap |
| palette | replace → Lucide | the thumb indent exactly Lucide's (scaled 0.583) and the wells at Lucide's places (9, 4.75 · 11.25, 7 · 4.75, 8.25 · 6, 5.25) at ⌀2: the wells are the paint, the icon's marks (delegated, owner to confirm; ⌀1.5 candidate kept) |
| shapes | replace → Lucide | Lucide's triangle over a square and a circle: square 4.5 × 4.5 (2–6.5 × 9.5–14, r 1), circle r 2.25 at 11.75, 11.75, 3 apart; triangle centred, base angles 57.8°, r 0.75, base at 7 (2.5 above the square); all three solid filled |
| gamepad | replace → Lucide: "handles need to be bigger" | Lucide's gamepad-2 on the full keyline: 13 × 10 (1.5–14.5 × 3–13), r 3 top corners, the bridge flat at 10.5 from 6.5 to 9.5 by 45° steps, grips 2.5 deep ending in round lobes (r 1.879 outer); d-pad at 5.5, 7, ⌀1.5 buttons at 10, 8 and 12, 6 |
| bot-generator | "make the wizards hat look more like a wizards hat and make it bigger" | a full cone on the family's brim (3.5–12.5) with a smooth apex at 1.5, the tip bent over and drooping to 13, 3, a straight fold back to 11, 3.5; filled, the whole cone; the band and its `data-counter="sliver"` dropped |
| translate | replace → Fluent | Fluent's design: a two-storey Latin "a" top left (arch into an x.5 stem at 6.5, bowl 1.5 : 1) and the hiragana "あ" bottom right with its three strokes correct; fills by weight. Replaces Phosphor's 文A. |

### Integration

| name | change |
|---|---|
| backspace | Fluent's composition: right side at 13.5 (crisp), × centred at 9 (`M7.25 6.25L10.75 9.75…`); the × crowded the right side (1.125 against 2.06) |
| import, share | the arrow runs to 11 (the tray rule's tight 2.5, as download and upload); 3.5 was a near miss |
| frown | mouth `M5.5 10A3.625 3.625 0 0 1 10.5 10` (top at 9): the 10-06 centring had reopened the eye–mouth gap the owner closed in round 1; features centre at 7.9 like smile and meh |
| copy-check | check `M5 10L6 11L8 9`, on the lattice (it was hidden by `free`) with tight gaps both sides |
| sort-ascending | shaft `M11.5 12.5V3.5`, level with the bottom bar; centred (sort-descending follows) |
| piggy-bank | owner r2 ("more round on the bottom rather than angled"): the back arc runs into a vertical rear leg, a round chin, 2-wide feet on x.5 |
| heart, heart-off | the lobes are true semicircles tangent to the 45° cleft and sides (centres 4.75 / 11.25, 5.75, r 2.828; V at 8, 5): the old arcs' chord needed r 3.01, so SVG enlarged them and both ends kinked 3.4°, and the cleft was off the lattice; ink 13.28 × 11 (was 13.14 × 11.18). heart-off: the thin crescent left above the slash is sawn off flush with the cleft (a filled-only gap) |
| cloud-upload, cloud-download | the arrow's tip at 8, 7 (on the lattice; 7.75 was not), the barbs' halo clear of the cloud's foot; download's shaft from 7 so the pair matches (7 long, 2.5 heads) |
| captions | each C opens ±61° (was ±45°): its tips sat 0.50 from the next C, under the gap scale, so the letters ran together at 16 |
| basketball | side seams r 6.1 (was 6): 0.84 to the vertical seam was a near miss |

### Rules learned (written into the skill)

- `data-angles="free"` and `"radial"` drop the lattice check for the whole icon: three checks shipped off the
  lattice. Run `geometry-audit.mjs` on any free-angle icon; it lists true 45° segments off the lattice.
- `data-dot="free"` also takes a dot off the size curve; keep it only for real solid exceptions.
- The lint does not measure gaps between subpaths of one path: draw separate parts as separate paths
  (option's bar, party-popper's confetti, captions' letters), or check with `geometry-audit.mjs`.
- An arc whose radius is smaller than half its chord is silently enlarged, which breaks tangency (heart):
  solve arcs exactly. Near-tangent kinks show in `geometry-audit.mjs`.
- A hub or hole is `stroke="none" fill="currentColor"`, never a stroked gap. The convex point where two
  offset curves of an overlap cut meet is rounded r 0.75. A knockout that starts on a seam between two
  solids is read as an edge exit: start it 0.5 off the seam. Parts 1.0 apart touch only at 16; join or part
  them. Solids (no stroke) are crisp on whole-pixel edges.
- Container − marks centre with the family's +; content in a clipboard centres under the clip.

### Record corrections (older rows that no longer describe the source)

square-dot: the ⌀2 centre dot (r 1), a hole when filled, on the size curve. square-slash: the slash is the
falling one (5.5, 5.5 → 10.5, 10.5). prohibited: fills by weight (no knockout). auto-layout: r 1 boxes.
square-dashed: 0.5 + r 1.5 corners with 2px dashes. gallery is Lucide's gallery-horizontal-end and images
the layered image (the 2026-10-02 rows read the other way round). replace's handle starts at 10.75. Type
family: superscript's and subscript's T is 7 × 8 (not 6 × 6). The ? sits 2.25 above its dot.

### Still open (proposals; candidates in the reports)

Closed 2026-10-14: kept as approved (see "Proposals (owner calls; not applied)" in the quality pass, 2026-10-10).

- waypoints wider (Lucide, ±5 with r 1.25 rings, smaller than the set's r 1.5 nodes); gap's brackets on x.5
  (costs the dot's tight gap); link and link-off 0.5 up (three strokes on whole pixels); diamond larger
  (±7, r 1.5); plane longer (1.88 under its keyline); lock and unlock larger (1.88 under; the composites use
  their own small lock).
- bug-off: drop the two corner legs along the slash (the r2 note "legs on monoline only" is unclear).
- image's ⌀2 sun sits on a half-pixel row (10, 5.5): neither whole position keeps image-plus's gaps, so the
  family keeps 5.5.
- spell-check's check is off the lattice; both lattice moves fail (a near miss to the C, or the check left of
  the word), so the owner's 2026-10-05 coordinates stay.
- Delegated today, owner to confirm: building's `data-gap="aligned"` window grid; palette's ⌀2 wells; shapes'
  2.5 / 3 gaps (an equal 3 / 3 with a smaller triangle is in the report); the key's off-centre ink (7.75, 8.25).

## Batch 69: New icons, 2026-10-07

| Icon | Construction |
|---|---|
| whole-word | horizontal; case-sensitive's lowercase a (r 2 bowl at 4.5, 7.5 with a tangent stem) and its mirror b (stem 3–9.5, bowl at 11.5, 7.5), stems 3 apart (standard), over Lucide's/Fluent's U bracket 1.5–14.5 at 12.5 (r 1 corners, uprights from 10.5, tight 1.12 to the bowls); sits 0.25 high so the bracket is on x.5 (heavy-base rule); line glyph, fills by weight |
| text-search | horizontal; Lucide text-search: list's 2–14 line at 3.5 and two short lines 2–6 at 7.5 / 11.5 (stack rows), file-search's lens exactly (r 2 at 10.5, 9.5, handle 1.5 → 3 out on the diagonal), both short lines standard 1.80 from the lens; centred 8, 8; fills by weight |
| list-filter | horizontal; Lucide list-filter / Phosphor funnel-simple: three centred lines 12, 8, 4 wide (Lucide's 20 / 12 / 6 ratio) on the three-line stack rows 3.5 / 7.5 / 11.5 (0.5 high, crisp); fills by weight |
| git-graph | square; Lucide git-graph on the git family: git-branch's left lane (r 1.5 rings at 4, 4 and 4, 12 with its stem) and top-right ring, a through lane 8, 2.5–13.5 (tight 1.38 to both columns), the right ring's lane git-branch's own curve (r 3 quarter arc from 12, 5.5 to 9, 8.5, then flat into the through lane at 8, 8.5); filled, rings fill as the family; no free angles |
| git-branch-plus | square; git-branch copied verbatim plus the family's 4px + (10–14 at 12, 12, filter-add's / list-plus's) in the empty lower-right corner (Lucide git-branch-plus), tight 1.28 to the branch curve; ink centre 8.25, 8.25 as the + family's corner marks; filled, rings fill |
| git-pull-request-create | square; git-pull-request verbatim with its target ring replaced by the 4px + at 12, 12 (Lucide git-pull-request-create), the hook (with its 2px head) shortened to 7.5 so it stops tight 1.38 above the +; ink centre 8.25, 8; filled, rings fill |
| diff | square; the square container family (square-plus's 11 × 11 r 2 frame) holding a ± from the 4px + (stem 5–9, bar at 7) over a 4px − at 11, 2 apart (detail gap 0.88, closer than plus-minus's standalone 3), the group 5–11 centred on 8 like square-plus's whole-pixel bar, tight 1.38 to the frame top and bottom; filled, square fills, ± a knockout |
| repository | vertical; Lucide book-marked / Phosphor book-bookmark (GitHub's repo): a 9 × 12 cover 3.5–12.5 × 2–14 (r 2 spine corner, r 1 cover corners) with a 3-tall page block at the foot, its left end an r 1.5 semicircle tangent to the spine, and a 4-wide ribbon 6.5–10.5 hanging from the top edge to 7.5 with a sharp 90° notch at 8.5, 5.5 (45° sides on the lattice, sharp points, data-acute=sharp as flag's swallowtail; detail 0.88 to the cover's right side); filled: the cover above the page line fills round the ribbon (a secondary part, its inside open, as Phosphor's fill), page block stays a line |
| issue | circle; Lucide circle-dot / GitHub issue-opened: the ring (r 6 at 8, 8) with the ⌀2 centre mark dot (square-dot's and circle-dot-dashed's, on the size curve); filled, ring solid and the dot a hole as square-dot |
| folder-git | horizontal; folder verbatim with git-commit's node (r 1.5 ring, git nodes) and 2-long stubs inside the body, centred at 8, 9.5 where the family's + sits (Lucide folder-git: a commit inside the folder); stubs 3.5 under the flap, data-gap="aligned" as folder-remove; filled: the body fills, stubs knock out and the node is a ⌀3 hole (ring outline-only, a gap disk), since the full ⌀4.1 hole left a sliver to the bottom edge at 16 |
| folder-code | horizontal; folder verbatim with file-code's 3-tall two-leg chevrons (M7 8L5.5 9.5L7 11, mirrored) centred in the body at 8, 9.5 (Lucide folder-code); detail gaps to the flap and floor; filled: body fills, chevrons knock out |
| folder-tree | square; Lucide folder-tree: list-tree's trunk at x 2 with r 2 branches (the top one curving off the trunk's start) to two small folders 6.5 × 4.5 (7.5–14, tops 2 and 9) with the folder's left tab and a 45° 1-step, r 1 corners, flap dropped at this size (simplified); branches stop tight (2.5) short of the folders at their body middles 4.5 / 11.5; centre 8, 7.75 (lattice puts both folder tops on whole y); filled: the folders fill, the trunk stays a line |
| folder-input | horizontal; folder verbatim with its left wall cut open round an arrow (overlap cut below, wall resumes at 10.75; above, the wall ends at the flap's corner 2, 6, no stub under it) that enters from the wall at 2, 8.5 and ends at 11.5 with a 2 head (Lucide folder-input); filled: the body fills and the arrow is a knockout that runs out through the left edge |
| file-json | vertical; document verbatim (fold and all) with a pair of 3.5-tall braces 8.5–12 (centred in the body below the fold, detail 0.88 to the fold line and the floor), stems at 6 / 10, r 0.75 end hooks, 0.5 straight runs and r 0.5 cusped tips at 5.5 / 10.5, ends 2.5 apart (1 : 2.8 like braces and Lucide's 1 : 3) (Lucide file-json); filled: page fills, braces knock out |
| file-warning | vertical; document verbatim with the container ! (2.25 stem 7–9.25, ⌀1.5 dot 2.25 below at 11.5, chat-warning's) inside the body at x 6.5: at x 8 the fold's pocket corner leaves room only for a 1.4 stem, so the ! moves left into the free L under the fold, detail gap 0.98 to the fold curve and 0.94 to the floor (Lucide file-warning; Fluent's circled badge is too dense at 16); filled: page fills, ! knocks out (stem knockout, dot hole) |
| logs | horizontal; Lucide logs: three rows at 3.5 / 7.5 / 11.5 (three-line stack rule, 0.5 high), each two 1-long dashes (2–3, 5.5–6.5) and a line 9–14, tight 1.38 gaps along the row; a line glyph, fills by weight (gaps 1.0 at 1.5) |
| pipeline | horizontal; Fluent pipeline: two 3 × 10 capsule flanges (1.5–4.5 and 11.5–14.5, r 1.5) joined by a 7 × 7 pipe body whose top and bottom lines (4.5, 11.5) run between them; filled: flanges solid with data-halo, the body a filled-only fill cut back one line weight from each flange (Fluent's filled cut), the body lines outline-only |
| container | Outline unchanged (Lucide's container on package's 1 : 2 slopes, ribs at x 8 and 11). Filled: the box solid, its face edges cut and running out through the silhouette (package's); each rib becomes a round-ended slot centred in its panel's height (x 8: 9 to 11.25; x 11: 7.5 to 9.75), standing free with about 1.1 of ink above and below. |
| server-cog | server's two units copied exactly, person-settings' gear mark (r 1.5 ring, six teeth to 2.25, ⌀1.5 hub) at 12, 11 (moved 0.5 in and up from the person family's 12.5, 12 so the teeth stay inside the square keyline and 1.125 below the top unit); the lower unit ends in a round bite r 4.5 about it (2.25 clear of the teeth). Filled: the units fill (the lower one closed by the bite), lights holes, gear solid with halo and hub hole, as person-settings. Lucide server-cog for the concept. |
| database-search | database copied exactly with file-search's lens mark (r 2, 1.5 diagonal handle) at 10.5, 10.5 on the lower right; the body and band cut round it by the overlap cut (icon-geometry cut), right wall ending at 7.5 (Lucide, Fluent). Filled: top ellipse and body solid with the base's band gaps; the body stops on a bite r 4.25 about the lens, run to the circle's top and chorded under the top cut so no wedge is left at the wall; the lens stays a line. |
| database-zap | Outline unchanged (the bolt crosses the wall there and is now a `line`). Filled: lid solid, lid gap through, body solid. The bolt is an inset parallelogram zigzag 11.875,8.95 → 10.25,10.75 → 12.375,10.75 → 10.75,12.55 (2.125 × 3.6, parallel diagonals). It was solved so the fill round it is exactly even: 1.00 w to the right wall, 1.00 w to the lid gap above, 1.03 w to the bottom edge. The middle band gap (an inset) runs from the left edge (sawn) along the offset ellipse and ends with a round cap at the curve's lowest point, 8,11.1875, directly under the lid's centre, 1.04 w from the bolt. |
| cloud-sync | Outline unchanged. Filled: two inset sync marks, 4 wide (x 6–10), with arcs at r 2.236 (the outline mark's r : chord ratio) and hooks 1.25 long (were 1.5). Upper mark: hook 6,4.5 → 6,5.75 → 7.25,5.75, then an arc over to 10,5.75. Lower mark: 10,10 → 10,8.75 → 8.75,8.75, then an arc under to 6,8.75. The marks are 3 apart on centre (1.75 clear, was 1.25). |
| api | square keyline, free angles; Phosphor's plugs-connected: one face bar along the diagonal (5.75 → 10.25) shared by two rotated plugs (sides on x + y = 13 / 19, backs on x − y = ±5, r 1.5 back corners, square face corners), cords from each back's middle to 13.875, 2.125 and 2.125, 13.875, and Phosphor's four spark dashes at full length (6.08, 2.24 → 6.56, 3.44 and the 90° turns); filled (Phosphor's fill): both plug bodies solid, the face bar stays a line attached to the lower-left plug, and the upper-right plug is set back from the bar by a one-line gap (data-shift keeps it flush at every size); cords and dashes stay lines |
| memory | Phosphor's memory: a 13 × 7 board (1.5–14.5 × 3.5–10.5, r 1.5), two 3 × 3 r 0.5 chips at 3.5 and 9.5 (a detail gap to the board, standard between), four contact pins 2 long on x 3.5 / 6.5 / 9.5 / 12.5 in line with the chips' edges. Filled: the board solid, the chips knocked out, the pins lines. |
| brain-circuit | square keyline; brain's hemispheres (same paths as the restored brain) with three traces from the midline to ⌀2 nodes (5.5, 6; 5.5, 9.5; 10.5, 6); the traces start 0.5 off the midline (7.5 / 8.5), so in the outline they meet the midline line and in the filled variant they open into the midline gap; nodes are holes |
| toolbox | Lucide's toolbox: a 12 × 8 body (2–14 × 5.5–13.5) with 45° chamfered shoulders from 4.5 / 11.5 to 8 (r 1 fillets, r 1.5 bottom corners), briefcase's handle copied exactly, a band at 9.5 and two latches on the handle's lines (x 5.5 / 10.5, 8.5–10.5). Filled: the body solid, the band a cut through the silhouette (briefcase's), latches knocked out. |
| telescope | Lucide telescope on its own axis (rise 1 : 4): a tapered tube 2.25 wide at the eyepiece and 3.25 at the objective (r 0.5 front corners) with Lucide's band across it 2.2 from the eyepiece end; an objective 2 × 4.6 (r 0.75 inner, r 0.5 outer corners) the tube's edges end on; an r 1.25 pivot ring at 8.25, 8.75 sitting over the tube's lower edge, which ends on the ring (joined, as Lucide); legs radial from the ring to 5.97 and 10.53 at 13.5. data-angles free. Filled: tube solid with the band a cut, the objective solid with a halo, the ring stays a ring (joined to the tube, its inside open) and the legs stay lines. |
| scan-text | scan-check's four corners copied exactly round three left-aligned text lines (Lucide scan-text) at 5.5 / 8 / 10.5, x 5 to 10 / 11 / 8.5 (square-list's 2.5 rhythm, tight 1.375; 2.5 clear of the corners), centred on 8. A line glyph: fills by weight. |
| siren | square keyline; Phosphor's siren on Area's grid: an r 4.5 dome centred 8, 9.5 on straight sides 3.5 and 12.5 down to 11.5, an 11 × 2.5 base (2.5–13.5, 11.5–14, r 1), an r 2.25 highlight arc concentric with the dome from 8.5, 7.31 to 10.25, 9.5, and three short rays (8, 2–2.75; 4, 4 → 3.5, 3.5 and mirrored, on the 45° lattice, 1.0 clear of the dome); filled: the dome is solid with the highlight knocked out, the base stays a line (Phosphor's fill) |
| square-mouse-pointer | Keyline square; Lucide square-mouse-pointer: the shared r 2 frame (2.5–13.5) cut open round mouse-pointer-click's pointer copied verbatim (behind, 2.25), its lower-right corner dropped; ends at 6.21 on both sides. Filled: the pointer fills, the frame stays a line (framed figures). |
| text-select | Keyline square; square-dashed exactly with three text lines (Lucide text-select) at 5.5 / 8 / 10.5 from x 5, lengths 4 / 6 / 3.5, centred on 8; line ends placed for standard/tight/open gaps to the dashes. Filled: fills by weight (dashed frame has no body). |
| table-of-contents | Keyline square; Lucide table-of-contents (lines with page-number dots) on list-bullet's rows 4.5 / 7.5 / 10.5 and ⌀2 dots (at 13), the middle entry indented to 5.5 for hierarchy (Notion TOC); lines end 9.5, a standard 1.94 to the dots. Filled: by weight. |
| layout-template | Keyline square; Lucide layout-template on layout-dashboard's r 1 panes and 3 spacing: a full-width header 11 × 4 over a 5 × 4 and a 3 × 4 pane (the narrow pane at the 1.875 counter floor). Filled: all three panes solid. |
| timeline | Keyline square; Fluent timeline: two r 1 cards 5.5 × 4 (2.5–8, 2.5–6.5 and 9.5–13.5) beside a vertical track at x 12 with git-commit's r 1.5 node joined at 8; the node now clears the cards' corners by 1.97 (standard), matching the 1.88 channel between the cards. Filled: cards and node solid, track a line. |
| milestone | Keyline square; Lucide milestone / Phosphor signpost: a 5-tall sign (2.5–11.5 then a 90° 45° point to 14, 6 on the lattice), r 1 corners and r 0.75 tip, on a post at x 8 joined above (2–3.5) and below (8.5–13.5). Filled: sign solid, post a line. |
| monitor-cog | Keyline square; desktop copied exactly with person-settings' gear (r 1.5 ring, six 0.75 teeth) turned 30° so its teeth clear the screen, centred inside the screen at 8, 7 as desktop-check's check (marks inside containers; Lucide monitor-cog's cog, moved in): tight 1.38 to the top, detail 0.93 to the bottom. Filled: the screen fills and the gear is a knockout (the ring's centre stays solid as the hub), stand a line. Replaces a top-right badge whose r 4.5 bite turned the filled screen into a crescent. |
| stamp | Keyline square; Phosphor stamp: a tapered handle (two r 1.5 shoulders about 7.25 / 8.75, 4 with a flat top at 2.5, straight sides narrowing to 3 wide at 6.75–9.25), a rectangular 11 × 2.5 base block (2.5–13.5, 8.5–11, r 0.75) and an 11-long imprint line at 13.5, as wide as the base (tight 1.38). data-angles free. Filled: handle and base one solid mass, the line stays a line. |
| component | Keyline circle; Figma's / Lucide component: four diamonds (half-diagonal 2, r 0.5 corners) at 8 ± 4 on the lattice, facing edges 1.70 apart (tight). Filled: four solid diamonds. |
| slice | Keyline square; Lucide slice followed closely: one silhouette, a sharp blade tip at 2.5, 13.5 on the handle's top edge (x + y = 16), a 2.83-wide 45° handle (x + y = 16 / 20) with a round cap about 12, 6, the lower edge breaking at a knuckle (8, 12) into a short vertical blade edge down to a flat foot at 13.5 (r 0.5 corner), and Lucide's heel as a perpendicular line across the whole handle (6, 10 → 8, 12). Filled: solid with the heel a cut. |
| blend | Keyline circle; Lucide blend: two r 4 rings at 6, 10 and 10, 6 crossing whole (shapes on one plane), lens counter 1.4. Filled: the rings stay lines and the overlap lens fills (a filled-only fill), the blend being the identity. |
| swatch-book | Keyline square; Lucide swatch-book as a fan about the rivet (5, 11): the front card 5 wide with a semicircular foot and a ⌀1.5 rivet; the middle card starts on the front card's side at 7.5, 5.5 (upper edge x + y = 13), r 1.5 corners on its far end (x − y = 6), and its lower edge (x + y = 19.5) runs all the way down into the front card's foot at 7, 12.5 (near-tangent, as Lucide); the back card's top leaves that diagonal at 11, 8.5 and its bottom runs back to the rivet's x at 13.5. data-angles free. Filled: the front card fills with the rivet a hole, the others stay lines. |
| line-style | Keyline horizontal; solid, dashed and dotted rows at 3.5 / 7.5 / 11.5 across 2–14 (Material line_style's order): square-dashed's 2px dashes 3 apart, five ⌀1.5 dots 2.875 apart (tight 1.38). Filled: by weight. Distinct from stroke-weight (three solid bars). |

Not drawn: square-terminal (terminal is already a window; alias candidate). Delegated calls to confirm are listed in docs/research/icon-review/2026-10-07/README.md, round 8.

## Filled is simple: negative cutouts, not halos (owner, 2026-10-08)

Owner, shown the 2026-10-06 halo clouds and notebook's ink-stub rings: "i preferred the negative cutout rather
than the outline around it cutout for the clouds, and also for the notebook, i wanted to make the filled icons
simpler and not just completely filled or always using a negative cutout line. i just want simple and
consistent", with a reference sheet (mic, database, command, smile, pause, sparkle, pin, atom, speaker, kanban,
send, bug; outline and filled). It replaces the 2026-10-06 rule's halo for a part crossing the edge in front.

- The body is solid; a mark over it is a plain knockout at line weight; attached parts outside the body
  (stems, needles, legs, waves) stay lines; no halo round a part.
- A part in front that crosses the body's edge moves wholly inside when filled, as the new `inset` role (a
  filled-only knockout, round-ended at the line weight; `gen-pilot-icons.mjs`), on Phosphor's filled clouds.

| icon | filled |
|---|---|
| cloud-upload, cloud-download | the arrow wholly inside the cloud (upload's shaft to 11.25; download mirrored, tip at 8, 11) |
| cloud-lightning | the bolt raised 3 inside the cloud, `M9.5 5L8 7.5H10L8.5 10` |
| cloud-sync | a smaller two-arrow sync centred at 8, 7.25 (arcs r 2.358, L-heads 1.5); the cloud is the plain cloud |
| database-zap | the plain cylinder; the bolt a knockout; the middle layer gap ends where the outline's does |
| notebook | the whole cover solid, the band a cut through it (kanban's dividers), rings a knockout over the cover and ink outside it (clip at 3.9375); owner: the open strip was the outlier |

Left as they were: separate badges beside a body keep their bite (person badges, dots, server-cog, smile-plus,
coins, devices, cloud-sun, compass-dot); chat-sparkle (its knockout left islands at 16 and 48; a corner mark like
chat-dot); file-pen, graduation-cap, telescope's objective and crystal-ball (stacked solids parted by a gap, as
the reference's database layers).

**Revision, 2026-10-08 (later).** Owner on the inset clouds: "maybe too much added, can these arrows in clouds use
the negative cutout approach that notebook uses for its rings?" The rule for a line crossing the body's edge is now
notebook's: the outline geometry unchanged, a knockout where the line lies over the body and ink beyond the edge
(a clipped `stroke` copy). It replaces the `inset` move for cloud-upload, cloud-download, cloud-lightning,
cloud-sync and database-zap. When each treatment applies:

| relationship | filled |
|---|---|
| a mark wholly inside the body (a container's plus, kanban's dividers, a face) | knockout |
| a line crossing the body's edge (an arrow over a cloud, a bolt, notebook's rings) | knockout over the body, ink beyond |
| an attached part that only meets the edge (calendar's pegs, a mic's stem, legs, handles) | ink |
| a separate badge beside the body (person badges, dots) | its own solid, parted by the bite |
| a line glyph (no body) | filled by weight |

**Revision, 2026-10-09.** After the filled-treatment research (`docs/research/icon-review/2026-10-09/`), owner:
"im more open to this approach of negative space outlines around overlapping elements, or the overlapping element
completely on top of the filled shape like the cloud and database". An overlapping element now takes one of two
treatments: wholly on the body as an `inset` cutout with even fill round it (cloud-upload, cloud-download,
cloud-lightning, cloud-sync, database-zap), or ink with a halo (chat-sparkle). The split (knockout over the body, ink
beyond) stays only for notebook's attached rings. The table above changes in its second row accordingly.

## Batch 70: New icons, 2026-10-10

| Icon | Construction |
|---|---|
| file-x | vertical; alias of document-dismiss (data-alias-of, linted identical): document with the container × (3 × 3, 6.5–9.5 × 8.5–11.5, centred below the fold) is already file-x in every reference (Lucide file-x, Phosphor file-x, Huge FileX); filled: page fills, × knocks out |
| file-clock | vertical; Lucide file-clock / Huge FileClock: document verbatim with a clock on the bottom-left corner, as file-cog / file-lock / file-search place their marks (overhanging the left edge 0.5, its base on the page's base line): an r 3 ring at 6, 11.5 (centre on the 45° lattice) with clock's hands (vertical 1 to 10.5, 45° 0.625 to 6.625, 12.125; calendar-clock's 1.25 / 0.75 at r 3: detail 0.88 / 0.99 to the ring); the page ends on the overlap cut r 5.25 (left edge at 6.883, base at 10.617), standard 1.76 to the fold, so the filled bite clears the fold corner (at 6, 11 it passed 0.2 under it and left a fill sliver at 48); filled: page fill stops on the same bite, ring solid, hands knock out (calendar-clock) **Revised 2026-10-10 (quality pass):** the clock moved to 5.5, 10.5 (on the lattice, every extreme on x.5, inside the base line, overhanging the left edge 1 like file-search's lens), hands M5.5 9.5V10.5L6.125 11.125; the overlap cut r 5.25 ends at 5.646 (left edge) and 9.413 (base), tight 1.18 to the fold, no sliver; ink 11.12 × 13.12, centre 7.5, 8 (file-search's box). The 6, 11.5 placement above was off the lattice and 0.5 below the base. |
| file-question | vertical; Lucide file-question-mark / Fluent document_question_mark: document verbatim with chat-question's ? (r 0.875 hook, 60° exit and Q into the stem) in the free L under the fold at x 6.5 like file-warning's !: hook top 7.375 (centre 8.25), stem end 9.5 (chat's 0.25 straight stem dropped so it fits), ⌀1.5 dot 2.25 below at 11.75; detail 0.92 to the fold curve, 1.0 to the left edge, 0.94 to the floor; filled: page fills, ? knocks out, dot a hole |
| file-user | vertical; Fluent document_person (Lucide/Huge put the figure inside, but Area's 4.5 fold leaves no room for a head and body below it): document verbatim with person-chat's small figure (head r 1.5 at 5.5, 8.5; dome body 6 × 2, r 1.5, 2.5–8.5 × 12–14, 2 between head and body) on the bottom-left corner as the family's composite marks, body on the page's base line, overhanging the left edge 1; the page ends on the overlap cut round the figure (left edge at 5.328, base consumed to 10.75, 13.984 on the bottom-right corner), tight 1.19 head to fold; filled: page fill stops on the union bite (r 3.75 about the body corner and head), head and body solid (person-chat) |
| file-zip | vertical; Lucide file-archive / Huge FileZip with folder-zip's zipper (Fluent's) on the page: three solid 1.5 × 1 teeth alternating about a column at x 8 (left 8–9, right 9–10, left 10–11; folder-zip's four did not fit under the fold: a fourth at 7 sits 0.44 from the fold line), detail-plus 1.29 to the fold curve; folder-zip's hollow tab (6.5–9.5, r 1.5 top at 11.5) joined to the last tooth and crossing the page's base, which ends on the tab's sides; tab 0.5 shorter than folder-zip's (3 tall, bottom 14.5) so the ink box stays 13.62 tall; filled: page fills, teeth holes, tab stays a hollow line (folder-zip) |
| folder-cog | horizontal; Lucide folder-cog / Huge FolderCog: folder verbatim with person-settings' gear (r 1.5 ring, six 0.75 teeth to 2.25, ⌀1.5 hub) at 11.5, 10.5, inside the lower-right corner where folder-lock's lock sits; the folder ends on the overlap cut r 4.5 (right side at 6.759, base at 7.759), teeth 2.58+ open from the flap; filled: folder fill stops on the same bite, ring solid with the hub a hole (file-cog) |
| folder-sync | horizontal; Lucide folder-sync / Fluent folder_sync: folder verbatim with cloud-sync's mark at 0.8 (one r 2.236 circle about 12, 10.5 broken into two arcs with chords 4 wide at 9.5 and 11.5, reset-style L heads 1.25 at the upper-left and lower-right ends, the spec's small sync proportions) in the lower-right corner as folder-lock's lock; the folder ends on the exact overlap cut round the mark (right side at 6.484, base at 8.275), open 2.59 to the flap; filled: folder fill stops on the offset boundary (r 4.486 about the circle, r 2.25 round the upper head's tip, x 7.75 beside the left ends), the mark stays a line (an arrow beside a solid) |
| form | square; Lucide form / Huge Form: two 12 × 3 fields (r 1, the align bars' height and radius) at 3.5–6.5 and 10.5–13.5, each under a label line (1.5, 2–9.5 and 8.5, 2–6.5, Lucide's 10 : 6 lengths), detail 0.88 label to field, 2 between centre-lines throughout; rows on x.5 and 0.5 high (three-line stack rule: crisp at 1× over centring); filled: fields solid, labels stay lines **Revised 2026-10-10:** fields 11 × 3 at 2.5–13.5 (align-center's bar, edges on x.5; the 12-wide fields read +13% beside their square siblings and sat on whole pixels), labels 2.5–9.5 and 2.5–6.5; ink 12.12 × 13.12, centre 8, 7.5. **Redrawn 2026-10-11 (owner's reference: a page with a title line, text lines and a pencil over its lower right):** a 9 × 11 page at r 2 (2.5–11.5 × 2.5–13.5, every edge on x.5, so crisp at 1×; the 2–14 page blurred top and bottom), a centred 3-long title line at 4.5 and two text lines 3 apart (4.5–9.5 at 7.5, 4.5–7 at 10.5, the lower one stopping tight 1.15 from the pen), file-pen's slim pen moved to the lower right (tip 8.5, 13.5; ink to 14.87) and the page cut round it by the overlap cut (`icon-geometry behind`). The reference's four text lines at 16px are 2 apart and read as a block; two at the document's 3 keep the page calm. Filled: the page fills, the lines knock out, the pen keeps file-pen's halo. Ink 12.91 × 12.12, centre 8.4, 8 (the pen overhangs right). |
| table-cells-merge | square; Lucide table-cells-merge / Huge TableCellsMerge: table's r 2 frame and row lines (5.5, 9.5) verbatim, its column moved to the centre (x 8, columns' divider) and drawn only in the top and bottom rows, so the middle row reads as one merged cell; filled: frame solid, rows cut through the silhouette, column stubs gaps run out through the top and bottom edges |
| table-cells-split | square; Lucide table-cells-split / Huge TableCellsSplit / Fluent's divided middle row: table-cells-merge's frame and rows with the x 8 column only in the middle row (5.5–9.5), the pair's complement; filled: frame solid, rows cut, the column a gap between the two row cuts |
| person-search | circle; Lucide user-search / Fluent person_search on the person family: head r 3 at 6.5, 5 and body 1.5–11.5 × 10–13.5 (r 3.5) copied; file-search's lens mark exactly (r 2 ring, 1.5 diagonal handle starting 1.5 out) at 11, 11, handle to 14, 14 (lattice x − y whole; at 11.5, 11.5 the head gap was a 2.08 near miss, at 11, 11 it is tight 1.38); the lens is 5 × 5, too large for the shared r 4.67 bite, so the body takes its own overlap cut like person-key: a round bite r 4.25 about the lens centre (2.25 from the ring), body line ending at 7.563, 13.5 and 6.869, 10; filled: head and body solid (the body closed along the bite arc, not a chord, so the fill stays 1.125 from the ring), the lens stays a line with the family's halo copy **Revised 2026-10-10:** the lens moved to 11.5, 10.5 (handle 13, 12 → 14.5, 13.5; the ink sat 0.25 left), the body's cut re-solved r 4.25 (base to 8.49, top to 7.28); ink 14.12 × 12.62, centre 8, 7.75 like person-check; head gap 1.31 tight. |
| person-pen | circle, free angles; Lucide user-pen / Fluent person_edit on the person family (head and body copied); file-pen's slim pen (2.12 wide, 60° tip, r 0.5 shoulders, round r 1.061 end, no clip) moved whole by 6.5, 0.5 so its tip sits at 8.5, 14.5 and its end at the lower right, the diagonal object placed as person-key's key; the body cut round it by the overlap cut (icon-geometry behind, as pkey.mjs), line ending at 6.439, 13.5 and a short shoulder stub to 8.305, 10.013; filled: head and body solid (body closed by its chord, as person-key), the pen solid with data-halo; the pen sides inherit file-pen's off-lattice axis (x + y = 21.5 / 24.5), the recorded pen-axis exception |
| person-star | circle, free angles; Lucide user-star / Fluent person_star on the person family with the shared round bite exactly (person-x's body line and A4.67 close, family.mjs DY 0); star.svg scaled 0.36 about its box centre and centred at 12.25, 12.25 (centre-line box 10.08–14.42 × 10.17–14.33, about the gear's 4.5), 2.39 from the remaining body so it sits inside the shared bite (0.38 or a centre at 12.5, 12.5 would breach the live area or the bite); counter 1.57 (tight); filled: the star solid with data-halo, as person-lock's body |
| shield-cog | circle, free angles; Lucide shield-cog on the shield family: shield copied exactly with person-settings' gear (r 1.5 ring, six teeth 1.5 → 2.25, teeth vertical as person-settings) inside, centred at 8, 7.5 (the shield's top-heavy interior; at 8, 8 the teeth sat a 2.34 near miss from the shoulders, and ring and teeth were 2.5/2.3 near misses at every rotation and 0.5 step from 7 to 9); ring and teeth drawn as one knockout path, its nearest point a tooth 1.99 (standard) from the shoulder curve; filled: shield solid, the gear a knockout with the ring's centre left solid as the hub (monitor-cog's filled gear) |
| eye-closed | horizontal; alias of eye-off (data-alias-of, body identical): Area's eye-off is already the closed eye with lashes (owner pick, data-off="own"), which is exactly Lucide's and Phosphor's eye-closed, so a second drawing would duplicate it; no Fluent eye_closed cut exists (Fluent uses eye_off) |
| mail-check | horizontal, free angles; mail copied exactly with the 1.5 / 3 corner check (person-check's 4.5 × 3) where mail-plus's + sits: M9.5 5.5L11 7L14 4 (mail-plus's + centre 12, 5.5, moved 0.25 left so the arms stay on the 45° lattice); the outline and flap cut 2.25 round it as mail-plus (top line ends 8.469, right side resumes 7.182, flap ends 8.879, 8.061 just past its arc); filled: mail-plus's construction, the body a fill bounded by the 2.25 offset of the check (arcs r 2.25 about its ends and vertex, 45° offset lines) with the flap cut's square notch at the arc end (8.419, 7.662 → 8.923, 8.668, mail-plus's exact points), the check stays ink beside it **Revised 2026-10-10:** filled, an r 0.75 fillet where the check's bite meets the flap cut (was a 72° point of fill), the notch inside the cut band; mail-plus takes the same fillet (the mail marks share the shape). |
| mail-warning | horizontal, free angles; mail copied exactly with the container ! (2.25 stem, ⌀1.5 dot 2.25 below; chat-warning's / file-warning's) in mail-plus's place: stem x 12 from 3.5 (the mail's top line, the +'s top) to 5.75, dot at 12, 8; outline and flap cut 2.25 round the stem and 2.4375 round the dot (its r 0.75 + 1.125 + 0.5625), top line ends 9.75, right side resumes 9.393, flap ends 9.58, 7.711 (mail-plus's 9.58, 7.71); a ! centred on the +'s 5.5 left the flap a 2.17 near miss to the stem; filled: the body a fill bounded by those offsets with mail-plus's flap notch, the ! stays ink (stem and dot) beside it **Revised 2026-10-10:** filled, the fill's edge runs straight down x 9.75 (the stem's offset) to the flap gap (L9.75 3.5L9.75 6.997L8.419 7.662), replacing the arc that met the dot's bite in a 123° point. |
| hand-wave | circle, free angles; Fluent hand_wave / SF hand.wave: hand.svg copied exactly (all three paths) and moved -0.5, 0.5 (keeps the thumb's 45° on the lattice and puts the fingers on x.5), under bell-ring's two motion arcs copied exactly (r 7 about 8, 6.5, 22° each, ending on the diagonals); unmoved, the pinky sat 0.87 (a hair under detail) from the right arc; moved, the arcs are tight 1.57 from the pinky and 1.71 from the index finger; filled: the hand's own filled treatment (palm and fingers solid), arcs stay lines |
| gif | horizontal, free angles; Fluent gif (a framed GIF): a 13 × 10 r 2 frame (1.5–14.5 × 3–13, the horizontal keyline) holding spell-check-style sans letters 5 tall (5.5–10.5): a G 2.5 wide as a stadium of r 1.25 arcs with spell-check's C terminal (-30°), a right side up to 8 and a 1-long bar, an I at 8.5, an F stem at 10.5 with a 2 top arm and 1.5 middle arm at 8; letter gaps 2 between centre-lines (detail 0.88: the widths G 2.5 + F 2 leave no room for 2.5 in a 13 frame), frame 2.5 (tight) from the G and the letters' top/bottom, 2 (detail) from the F's arm; filled: frame solid, letters knocked out (Fluent's filled cut) |
| calendar-off | square; Lucide calendar-off / Phosphor calendar-slash: calendar's frame (11 × 10, r 2), header at 6.5 and pegs copied exactly, date grid dropped (variants drop content), drawn whole as outline-only lines under the shared slash M2 2L14 14, flat (bell-off's structure). Filled: the body below the header a fill parted by the shared slash gap; the header stays open as filled-only stroke pieces cut one-sided (2.25) round the slash (top edge and corners down to the header, right peg); the left peg falls inside the cut and is dropped; the header line in filled is the fill's own top edge (a separate header piece left a fill wedge at 48) |
| calendar-search | square; Lucide calendar-search / Fluent calendar_search: calendar's frame, header and pegs exactly (no date grid) with file-search's lens mark exactly (r 2 at 10.5, 10.5, handle 12, 12 → 13.5, 13.5 replacing the lower-right corner), the frame cut round it by the overlap cut (right side and bottom end at 7.49); header kept whole, a detail 0.88 above the lens. Filled: body fill below the header stopping on a bite r 4.25 about the lens (database-search's), so the fill ends where the outline does; lens and handle stay lines, the lens open inside |
| calendar-sync | square; Lucide calendar-sync / Fluent calendar_sync: calendar's frame, header and pegs exactly (no date grid) with cloud-sync's outline sync mark exactly (two r 2.795 arcs of one circle, 5 wide, L hooks 2) moved 3.5, -0.5 onto the lower-right corner as calendar-clock places its clock (hooks at x 9 and 14, foot on the body's bottom edge 13.5); frame and header cut round it by the overlap cut (header ends 6.806, right side 5.618, bottom 7.64). Ink 12.62 square, centre 8.25, 7.75. Filled: body fill below the header with a bite (r 2.25 round the upper hook, then r 5.045 about the mark's centre 11.5, 10.25, joined by an r 0.75 fillet) that meets every outline cut end, as calendar-clock's bite; the sync mark stays a line **Revised 2026-10-10:** the mark moved (3, −0.5) instead: hooks on x.5 (8.5, 13.5) as cloud-sync's, the right hook on the frame's right line as calendar-clock's ring; frame ends 7.141, 13.5 and 13.5, 5.868; the filled bite (fillet kept) moved −0.5 in x; ink 12.12 × 12.62, centre 8, 7.75 like every calendar. |
| alarm-off | circle; Lucide alarm-clock-off / SF alarm.slash: alarm's r 4.5 ring, closed bells and legs copied exactly under the shared slash M2 2L14 14, flat; the hand is dropped (it runs 0.71 off the slash, parallel, and read as a thickened slash; Lucide drops its hands too). data-counter="sliver" (the right leg lies 0.71 beside the slash's end) and data-gap="aligned" for the right bell's inner end, 2.43 from the slash. Filled: ring a fill parted by the shared slash gap; the left bell a filled-only stroke cut one-sided (2.25); right bell and legs stay lines **Revised 2026-10-10:** the right leg is dropped too (it ran 0.71 beside the slash's end and merged into a thick slash; Lucide drops it); data-counter="sliver" records the 0.29 pocket where the slash crosses the left bell near the ring. |
| clock-check | circle; Lucide clock-check / Huge ClockCheck: clock exactly (r 6 ring, hands M8 4.5V8L10.5 10.5) with copy-check's 1 / 2 check (M11 13L12 14L14 12, on the lattice) beside it on the lower right, the ring cut open round it by the overlap cut (ends 8.949, 13.925 and 13.734, 9.766); tight 1.42 from the hand's end. Lower right (Lucide's side) because there the check's long arm runs along the ring; on clock-alert's lower-left side it points radially into the face. The 1.5 / 3 check doesn't fit: with its short arm clear of the hand, the long arm leaves the 14.5 live area. Filled: the disc fills, hands knock out, the check stays a line with a halo **Revised 2026-10-10:** the check moved to the top right, the notification dot's corner (M11.5 2.5L12.5 3.5L14.5 1.5; ring cut ends 13.468, 5.531 and 9.279, 2.138; 2.91 open from the hand). On the lower right the filled check's halo left a 0.30 hair of fill against the 45° hand at 16 and merged with it from 24, and every lattice spot there was a near miss to the hand (2.04, 2.23). Ink 13.62 square, centre 8.25, 7.75. The 1.5 / 3 check does fit on the lower right (the line above is wrong) but collides the same way. |
| search-alert | circle; Lucide search-alert / SF exclamationmark.magnifyingglass: zoom-in exactly (r 5 lens at 7, 7, handle 10.75 → 14) with the container ! (chat-warning's: stem 4.75–7 at x 7, ⌀1.5 dot 2.25 below at 9.25) centred in the lens where zoom-in's + sits, tight 1.63 / 1.44 to the lens. The ring's own 3.75 stem left a 0.69 gap to the lens, so the mark is the next size down (contained marks rule). Filled: lens solid, stem a knockout, dot a hole (zoom-in's) |
| scan-qr | square; Fluent scan_qr_code / Lucide scan-qr-code: scan-check's four r 2.5 corner brackets exactly round a reduced QR code: qr-code's finders and modules don't fit in the 6 × 6 interior (two outlined finders need 2 × 1.75 squares, with 0.6 counters), so it is simplified to solid modules (ladder step 2, Fluent's): five 2 × 2 solid squares in a checker X (5–11, corners touching, whole-pixel edges), standard 1.94 to the brackets. A line glyph with solid exceptions: fills by weight |
| webcam | vertical; Lucide webcam / Phosphor webcam: an r 5 head at 8, 7 with an r 2 lens ring (standard 1.875 between; camera's lens a step smaller), a short neck 12–13.5 joined to the head and desktop's foot line at 13.5, 6 wide (5–11). Ink 11.12 × 12.62, centre 8, 7.75 (the head is the mass). Filled: head solid, lens a knockout ring (camera's), neck and foot lines |
| wifi-low | horizontal; Lucide wifi-low / Phosphor wifi-low: wifi exactly with only its inner r 3.5 arc and the ⌀2 source dot at 8, 12.5, in the same positions (the two outer arcs dropped, as volume-low relates to volume). wifi had no level variants. It sits under its keyline (8.1 under), as volume-low does, so it lines up with wifi in a strength set. Line glyph: fills by weight |
| globe-off | circle; Fluent globe_off / Lucide globe-off: globe's ring, r 10 lens meridian and parallels at 6 / 10 drawn whole as outline-only lines under the shared slash M2 2L14 14, flat; data-counter="sliver" because the slash runs through the grid's nodes at 6, 6 and 10, 10, leaving 0.82 pockets. Filled: disc fill parted by the shared slash gap. Knockouts: parallel 6 whole; parallel 10 and both meridian arcs up to the slash on its far side; on the gap side only the right meridian from the pole to parallel 6. Knocking out every line left islands at 16 and 48; this leaves none |
| book-add | vertical; the closed-book form, because the open book has no room: each of book's pages is 4.88 inside, too narrow for the 4px + (5.13 ink) or the 3px +. All three references draw a closed book (Lucide book-plus, Fluent book_add, Huge BookPlus). repository's cover and page block are copied exactly (9 × 12, 3.5–12.5 × 2–14, r 2 spine corner, r 1 cover corners, the page block at 11–14 with an r 1.5 end) with the ribbon dropped. The container's 4px + (6–10 × 4.5–8.5) is centred in the cover's free interior above the page line, tight 1.38 on all four sides. Filled: the cover above the page line fills (repository's fill), the page block stays a line, and the + is a knockout. |
| scroll | square; Lucide scroll on Area's grid: a 7-wide sheet (5.5–12.5, top 2.5, r 1.5 top-right corner). The top roll is an r 1.75 semicircle at 3.75, 4.25 that the top edge leaves tangentially; it runs down x 2 with an r 1 corner into a 6.5 base line that joins the sheet's left side (counter 2.43). At the foot, the sheet's left side curls through an r 1.5 semicircle (5.5 → 8.5, bottom 13.5) into a 3-tall rolled ledge (8.5–14 × 10.5–13.5, r 1 top corners, r 1.5 bottom-right corner, counter 1.93). The ledge's bottom line is tangent to the curl, and the sheet's right side ends on the ledge top. Ink 13.1 × 12.1, centred 8, 8. No text lines (Lucide; Phosphor and Huge add them). Filled (Phosphor's scroll fill): the sheet fills down into the curl, and the top roll and the ledge stay lines with their insides open (secondary parts). |
| gavel | square; Lucide gavel / Phosphor gavel on the 45° lattice, symmetric about the handle axis x + y = 16. The head is a 7.07 × 2.83 block (long sides x − y = 1 / 5, ends x + y = 11 / 21; counter 1.88). Its striking faces are bars on the ends that run 1 lattice unit past each long side (x − y 0 → 6), as Lucide's faces do. The handle is 2.83 wide (Lucide's), with sides on x + y = 14 / 18. It joins the head's lower long side and ends in an r 1.414 semicircle at 4, 12. The face bar is a detail gap of 1.0 from the handle's start (x + y = 11 vs 14; the first try at 12 left 0.29). Ink 12.04 × 12.04, centre 8.04, 7.96. There is no sound block (Lucide and Phosphor have none; Fluent and Huge do). Filled: the head and handle are solid as one mass (hammer's), and the face bars stay ink on top. |
| tags | square; the multiples rule (Phosphor layering) on tag. tag itself cannot take a 3 offset inside the keyline: it spans 11.9, so with the offset it would span 14.9. The front is tag's construction shortened, with tag's radii and eyelet kept: the corner at 2, 5, a 5-long top and left edge (tag 6), the far edge at x + y = 21 (fillet r 1.5, r 1, r 1.5, r 1.5, r 1 as tag), and the ⌀1.5 eyelet 2.75 from the corner at 4.75, 7.75 (tight 1.44 as tag). The back copy is the same shape offset 3 up and right (5, 2). Only its uncovered top edge, upper diagonal and tip are drawn, stopping one overlap cut short of the front (icon-geometry behind, 2.3; 1.17 tight). Ink 13 × 13, centre 7.94, 7.94 (tag's). Filled: the front fills with the eyelet a hole, and the back stays a line. |
| vote | horizontal; Lucide vote / Huge Vote, a ballot card entering a box's slot line. The card is 9 × 9 (3.5–12.5 × 3.5–12.5) with r 1.5 top corners, and its sides end on a 12-long slot line (2–14 at 12.5) that runs 1.5 past each side. Inside is the container's 1.5 / 3 check M6 8L7.5 9.5L10.5 6.5, which sits 0.25 right of centre to keep the lattice, as calendar-check does (tight 1.38 left, detail 0.88 right, standard 1.88 above and below). The 2 / 4 check would leave 0.38 at the sides. Ink 13.1 × 10.1, centred 8, 8. Filled: the card fills, closed along the slot line, the check knocks out and the slot line stays a line. Fluent's tilted ballot over a box is too dense at 16. |
| text-quote | square; Lucide text-quote / Huge TextQuote (Notion's quote block) on the three-line stack rows 3.5 / 7.5 / 11.5, 0.5 high as text-align. The first row is text-align-left's first line exactly (2.5–10.5). Below it, a vertical quote bar at x 2.5 spans rows 2–3 (7.5–11.5), and two lines 5.5–13.5 run beside it, a standard 1.88 from the bar. Fluent's 99 quote is the existing quote icon. Line glyph: it fills by weight. |
| copyright | circle; the ring (r 6 at 8, 8) with a C as the ring's glyph: an arc of token's and target's r 3 inner ring, opened 90° on the right with its ends at ±45° (Lucide copyright's opening): M10.121 5.879A3 3 0 1 0 10.121 10.121. The gap to the ring is a standard 1.87. r 2.5 (closer to Lucide's 0.4 ratio) leaves 2.37, a near miss. Filled: the ring fills and the C knocks out (as add-circle). |
| divide | square; Lucide divide's proportion (owner, 2026-10-11: the 11px bar read too long and the ÷ didn't read as a division sign): a 9px bar (3.5–12.5, ink 10.12) at 7.5 with two ⌀2.5 dots at 8, 3.75 and 8, 11.25, each a standard 1.94 from the bar, so the dots sit close and read as part of one sign. The dots are a recorded `data-dot="free"` solid (quote's, rocket's precedent): the dots are the sign, and ⌀2 read as specks beside the bar (Lucide's are about 2× its line). The bar sits 0.5 high on x.5 so it is crisp at 1×; dot edges land on the 0.5 grid. Ink 10.12 × 10, a square ÷ like the typographic glyph. Line glyph: it fills by weight. |
| location-add | vertical; location's pin copied exactly with its hole replaced by the 4px + (6–10 × 4.5–8.5), centred in the head at 8, 6.5. Inside placement, because the pin is a closed shape whose head holds the + with tight 1.63 at each arm (Fluent location_add, Phosphor map-pin-plus, Lucide map-pin-plus-inside), as bookmark-add. Lucide's corner + beside the pin would cut the pin's outline, which is its identity. Filled: the pin fills and the + knocks out. |
| arrow-up-right-circle | circle; arrow-up-circle's ring copied exactly, with its contained arrow turned 45° onto the lattice: the shaft is 5.5, 10.5 → 10.5, 5.5 and the head M7 5.5H10.5V9 (3.5 legs, the turned 2.5 head's 3.54). It is the same arrow as square-arrow-up-right's, on x.5 so it stays crisp at 1×. The shaft is 7.07 long against the straight 6, the longer of the two lattice choices, as arrow-up-right's 12.7 against 12. Tight 1.34 to the ring at the tip and tail. The other diagonals come from data-rotations arrow-down-right-circle:90, arrow-down-left-circle:180 and arrow-up-left-circle:270 (arrow-up-circle's and arrow-up-right's naming). Filled: the ring fills and the arrow knocks out. |

Not changed: tree's crown keeps its own symmetric four-lobe construction; it is not a moved cloud, so the cloud's option D does not apply. Delegated calls to confirm are listed in docs/research/icon-review/2026-10-10/README.md.

## Quality and consistency pass, 2026-10-10

Owner: "pause making new icons here and do a quality and consistency pass on all the existing icons as well as the new
batch". Eleven group reviewers (the icon browser's categories, 673 sources) checked every icon one by one, outline and
filled at 16 / 24 / 32 / 48 / 96. They checked each against the skill, its family, every owner note from `reviews` to
`reviews7` and the whole-set machine checks (geometry audit, slivers at 16 and 48, optical size, parts drift, the
lint's report). Real defects were fixed; judgement calls are proposals for the owner. Reports, sheets and machine
output: `docs/research/icon-review/2026-10-10/quality/`.

Every owner note still holds, and each note given on one icon also holds on the icons that share its shape.

### Changed (34 icons; in review again)

| icon | what was wrong | change |
|---|---|---|
| wifi, wifi-low, wifi-off | arc tops on whole pixels (y 9 / 6 / 3) blurred at 1×; the dot sat on a half-pixel row | family moved up 0.5: arc tops on x.5, dot at 8, 12; wifi's centre 7.47 (0.5 high, the stack rule); wifi-off's filled slash pieces recut with `slashCut` 2.5 |
| git-commit | the 2–14 line on whole-pixel y 8 | moved up 0.5: ring r 1.5 at 8, 7.5, line M2 7.5H6.5M9.5 7.5H14 |
| caps-lock | the arrow's foot on whole-pixel y 11 | foot at 10.5; standard 1.88 to the bar (was tight 1.38) |
| blur | lines on whole pixels (5 / 8 / 11) | moved up 0.5: lines 4.5 / 7.5 / 10.5, half ring centred 8, 7.5 (the stack rule) |
| slice | sat 1 low (centre 7.96, 9.04) | moved (0, −1), handle edges x + y = 15 / 19; tip 2.5, 12.5, knuckle 8, 11, foot 12.5, heel M6 9L8 11. Filled fills the handle only, the blade an outline (the owner-approved source; the batch-69 line saying "solid with the heel a cut" is stale) |
| attach | all four 45° wires off the lattice (x + y = 12.25 … 21.25), hidden by `data-angles="free"` | moved (−0.125, −0.125) onto x + y = 12 / 15 / 18 / 21; free-angle mark removed; centre 7.85, 7.9. Its older line "cannot sit on the lattice" is no longer true |
| snowflake | top and bottom chevrons 0.25 off the lattice | all six chevrons 0.25 outward along their arms (top M9.75 2.25L8 4L6.25 2.25), the others exact 60° turns |
| atom | a 2.9° kink at each orbit tip (rounded tips) | tips 13.6125 / 2.3875, each half an exact half ellipse; no visible change |
| superscript, subscript | the 2's bowl met its diagonal at an 8.3° kink, bowl edges off the grid (the 2026-10-08 redraw) | list-numbered's 2 exactly: M11.151 3.5A1.125 1 0 1 1 12.94 4.69L11 6.5H13.25; subscript the same 2 moved (0.5, 6.5). The "7 × 8 T in superscript and subscript" line in the type family is stale (they are X² / X₂) |
| file-user, folder-sync | filled: two offset arcs of the bite met in a sharp point of fill | r 0.75 tangent fillets (the 2026-10-07 file-lock / folder-lock rule) |
| mail-plus | filled: the + bite met the flap cut in a 57° point | r 0.75 fillet, as mail-check (owner r1 note: "stroke should be rounded?") |
| mic-off, screen-share-off, globe-off, bug-off, flask-off, umbrella, highlighter | a stroke drawn twice in the outline (an outline-only `line` copy plus the same stroke in both styles or as a knockout), so it read darker at 1× (flag-off's pole on 2026-10-07) | each stroke drawn once per style: the `line` keeps only what the other element doesn't draw, or the both-styles copy becomes filled-only `stroke`. No visible change at 2× |
| car, plane, home, building | the same doubled edge where a solid shares a line with an ink part (car's mirror line, plane's fuselage, the door's base) | the solid left open along the shared edge; the base under the door filled-only |
| batch 70 | file-clock, form, person-search, mail-check, mail-warning, calendar-sync, alarm-off, clock-check | see their **Revised 2026-10-10** notes in the Batch 70 table |

Metadata only (no drawing change, not sent back to review): 89 sources dropped a stale `data-angles="free"` that the
lint no longer needs, so the lattice check guards them again (`data-angles` only switches that check). chat-add, siren,
bell-off, clipboard and clipboard-check are among them.

### Record corrections

- git-commit: the node is r 1.5 at 8, 7.5 (an older line says r 2 at 8, 8).
- container: the batch-69 line describes slotted ribs; the approved source cuts the ribs full height.
- timeline: the batch-69 line says the node fills; the approved source keeps it an open ring (open question below).
- store: its door has r 1 corners (as home and building), not an r 1.5 arch.
- basket and award: the filled descriptions in their old rows are stale; the sources are what the owner approved.
- vote: its check sits 0.25 right of centre, as calendar-check (corrected in the Batch 70 table).

### Rules learned (written into the skill)

- **Check at 1× too.** look.mjs renders at 2×, where a whole-pixel stroke looks sharp; at 1× it is a grey double row.
  `quality/tools/px.mjs` renders the outline at device scale 1; the wifi, git-commit, caps-lock, blur and hand findings came from it.
- **Draw each stroke once per style.** A stroke in both an outline-only `line` and an element both styles draw (or a
  knockout, which the outline draws too) doubles its antialiasing. `quality/tools/dups.mjs` finds them. Edges two
  closed shapes share (panels, video's lens, headphones' bands, brain's midline) also show there; emitting shared
  edges once is a generator question, not a per-icon fix.
- **Every convex point of fill where two offset curves meet is rounded r 0.75**, in every family that shares the bite
  (mail marks, file and folder composites).
- **Remove `data-angles="free"` when the drawing no longer needs it**; it silences the lattice check for the whole icon.
- **Run geometry-audit on every redraw** before the owner sees it: two redraws (superscript's 2, attach) had brought
  back kinks or off-lattice runs that the lint does not see.
- **The B** (type family): every bowl ends in a semicircle and the lower bowl is 0.5 wider; the bar sits at the cap's
  middle when that is on the 0.5 grid (case-upper, 8), otherwise one grid step above, which also makes the lower bowl
  0.5 taller (spell-check, 4.5). bold's outline is the one B off this rule (proposal).
- **Corner marks on a face with hands go where the hands are not** (clock-check's check at the top right): a mark's
  filled halo or bite must clear every knockout by at least a line weight.
- **Small marks share the person family's bite; large marks (key, lens, pen) take their own cut**, as person-key.

### Proposals (owner calls; not applied)

**Closed 2026-10-14 (owner: "go with your recommendations"):** the owner approved all 808 icons as drawn, so every
proposal below is kept as approved. The pixel ones were taken up by the 1× pass ("Optical outliers and 1× frames":
arrow-right-to-line, chevron-last, log-in, zoom-fit, hand, keyboard, thumbs-up, link, link-off, diamond). The rest
(timeline, bold, bug-off, fast-forward, webcam, shield-cog, plane, lock, unlock, scan-qr, shared edges) stay as drawn;
reopen one only when it shows a defect in use. The list is kept as the record.

Each has a candidate source and a sheet in `quality/sheets/group-<n>-proposals.png`.

- arrow-right-to-line, chevron-last / chevron-first, log-in: bar or door on x.5 (crisp, centred) at a tight 2.5 gap
  instead of standard 3 (group 1). log-out can't be both crisp and centred, so log-in would part from it.
- zoom-fit: Fluent's 5 × 5 centre square (crisp) instead of the recorded 4 × 4 on whole pixels (group 2).
- timeline: track and node on x.5 with 6-wide cards (group 3), and/or the node solid when filled as the git nodes and
  its own record (group 9; the round-8 open item).
- bold: the outline B's bar at 8 with equal bowls, as its filled B and Lucide (group 4).
- hand: moved (−0.5, −0.5) so its five verticals are crisp, as hand-wave's hand already is (group 5).
- bug-off: the outline takes the filled variant's three legs (the r2 note "legs on monoline only"; group 9).
- keyboard: body 2.5–12.5 for crisp long edges, at a detail bottom gap (group 9).
- fast-forward: the second triangle 0.5 right onto the lattice its record claims (group 8).
- webcam: desktop's 5.5–10.5 foot, as its construction line says (group 8).
- shield-cog: the gear at the shield's mark size (r 2 ring; group 10). It starts to read as a sun at 32–48.
- thumbs-up / thumbs-down: L9.2 7 → L9.09 7, a tangent tip arc, invisible (group 7).
- link and link-off 0.5 up, diamond larger, plane / lock / unlock larger: still open from 2026-10-07.
- scan-qr: whether qr-code's rounded modules apply; rounding opens pinholes where the checker's modules touch.
- The generator emitting edges shared by two closed shapes once (see Rules learned).

Package glyph added with the pass: `dismiss-circle` is `error` (the circled ×) with a new "knockout" paint;
`glyphKnockouts` lists the × so Glyph.tsx can cut it out with a mask (component session, Search field's clear button).

## Batch 71: New icons, 2026-10-10

| Icon | Construction |
|---|---|
| repeat-once | square; Fluent arrow_repeat_1's placement (the 1 replaces the loop's lower-right turn), not Lucide's / Phosphor's centred 1: repeat copied exactly except its lower path, whose right arc is dropped and whose rail ends at 10.25 (the overlap cut 2.25 round the 1; the cut left only a 1.5 arc stub, so the stub goes too); list-numbered's 1 exactly (3.5 stem, 1 x 1 flag on the lattice, M12.5 11.5L13.5 10.5V14) at the lower right on x 13.5 (crisp at 1x), tight 1.13 from the rail end. The centred 1 the brief asked for does not fit: repeat's inner barb ends (10, 7) and (6, 9) are 4.47 apart, so every point of the centre is at most 2.24 from one of them, under the 2.375 the filled line needs (lint: 0.5 and 0.63 left at 1.5); a 3-tall 1 at x 8 passes the outline only. Ink 12.62 x 13.12, centre 7.75, 8. Line glyph: fills by weight |
| switch-camera | square, free angles (camera's); Phosphor camera-rotate: camera copied exactly with its lens replaced by folder-sync's small sync mark (one r 2.236 circle broken by two chords 2 apart, reset-style L heads 1.25) turned 90 degrees and centred at 8, 9 where the lens sat (arcs 7-11 tall, 5.75-10.25 wide; heads at the upper right and lower left). Turned because the family's orientation cannot sit on the grid under the camera's shoulders: with horizontal chords the mark is 4.5 tall in an 8-tall interior, and centre 8.5 or 9 leaves the upper hook 0.65 from the left shoulder or the lower hook 0.63 from the base. Detail 0.88 to the base; tight 1.17 from the upper head to the right shoulder. Filled: body solid, the mark a knockout (marks inside a container) |
| eject | square, free angles; Fluent arrow_eject / Lucide eject: skip-forward's triangle exactly (play scaled 0.769, r 0.962 back corners, r 0.769 tip) turned to point up, its base on y 10.5 (x 4.648-11.352, crisp), over skip's bar laid flat: M3.5 13.5H12.5, as wide as the triangle (ink 10.1 vs 9.8), a standard 3 below the base (1.88). Ink 10.12 x 12.18, centre 8, 7.97. Filled: the triangle solid, the bar stays a line (skip-forward's) |
| headphones-off | circle; Lucide headphone-off / SF headphones.slash: headphones copied exactly under the shared slash M2 2L14 14, flat in the outline (band and right cup outline-only lines, left cup solid; the band's sides end at the cups' tops at 9, so the cups' outer edges are drawn once: the base draws them twice). data-counter="sliver" for the 0.82 pocket where the slash crosses the right cup's top-left corner. Filled: left cup solid; right cup a fill parted by the shared slash gap (mic-off's structure); the band a filled-only stroke cut one-sided round the slash (icon-geometry slash, 2.25: ends 4.111, 4.111 and 6.042, 2.86) and ending on the right cup's top (ending it at 10.318 left fill beside the line at 48). No Fluent headphones_off cut exists |
| captions-off | circle (the slash's 12 x 12 run breaks the horizontal keyline, as video-off); Fluent closed_caption_off / Lucide captions-off: captions copied exactly under the shared slash M2 2L14 14, flat in the outline (frame an outline-only line; data-counter not needed, every pocket is on the scale). Filled: the frame a fill parted by the shared slash gap; the left C a knockout from its top (6.5, 6.5, on the slash) round to its lower end, its 0.5 upper tip an outline-only line, so no stroke is drawn twice; the right C a whole knockout, of which only the arc above the gap shows, joined to the gap's space (Fluent's filled cut shows the same partial C). Slivers none at 16 and 48 |
| vibrate | square; Lucide vibrate: a phone body 5 x 11 (5.5-10.5 x 2.5-13.5, r 1.5; phone's 9 x 13 r 2 body narrowed to make room, its home bar dropped because a 5-wide body leaves 0.31 beside a 2-long bar; Lucide and Phosphor have none) between two four-segment zigzags on the 45 degree lattice, x 2-3.5, y 5-11, ends outward (Lucide's: M2 5L3.5 6.5L2 8L3.5 9.5L2 11, mirrored), inner points detail 0.88 from the body. All long edges on x.5. Ink 13.12 x 12.12, centred 8, 8. Filled: body solid, zigzags stay lines |
| sim-card | vertical; Lucide card-sim / Phosphor sim-card / Fluent sim: phone's 9 x 13 frame (3.5-12.5 x 1.5-14.5, r 2; every edge on x.5, the real card's 0.7 ratio) with its top-right corner clipped by a 3-long 45 degree edge (9.5, 1.5 to 12.5, 4.5, on the lattice) with r 1 fillets; a 5 x 4 chip (5.5-10.5 x 8.5-12.5, r 1, crisp) with Fluent's vertical divider at x 8, a detail 0.88 from the sides and the base; pockets 1.43 (tight satellites). Filled: card solid, chip and divider knock out (camera's lens: the pockets stay solid) |
| monitor-off | square; alias of screen-share-off (data-alias-of, linted identical): desktop under the shared slash M2 2L14 14, flat, is already screen-share-off's drawing, so a second source would duplicate it (Fluent desktop_off, Lucide monitor-off, Huge MonitorOff); filled: screen a fill parted by the slash gap, stand a line |
| megaphone-off | square, free angles (megaphone's); Fluent megaphone_off / Lucide megaphone-off / Huge MegaphoneOff: megaphone's body copied exactly, drawn whole as an outline-only line under the shared slash M2 2L14 14, flat (bell-off's structure); the handle copied but cut by the overlap cut round the slash (ends at 8.492, 11.674, tight 1.13): uncut, its right leg sat 0.58 beside the slash, and it does not cross it to lie flat (Lucide and Huge cut it there too). Filled: the body a fill parted by the shared slash gap, the handle stays a line (attached part) |
| lightbulb-off | square (was vertical: the slash spans 2-14), free angles (lightbulb's); Lucide lightbulb-off / Huge LightbulbOff / SF lightbulb.slash: lightbulb's bulb copied exactly as an outline-only line under the shared slash, flat (it enters the dome and leaves through the right neck), and its base cut at 11.5 kept as the cut (wholly below the slash). Filled: the bulb a fill parted by the shared slash gap, the base band a cut as lightbulb; no slivers at 16 or 48 |
| keyboard-off | circle (13 x 10 frame plus the slash, video-off's keyline); Fluent keyboard_off / Lucide keyboard-off / Huge KeyboardOff: keyboard's r 2 frame copied exactly as an outline-only line under the shared slash, flat (it crosses both rounded corners at 58 degrees). Keys the slash covers or nearly touches are dropped (4.06/6.69, 5.5 and 8, 8 under it; 5.375 / 10.625, 8 at 0.55, a near miss), as alarm-off drops its hand; the two top-right keys stay (9.3125 and 11.9375, 5.5; tight 1.38 from the slash). The spacebar keeps its start and runs to the slash's centre-line (M4.5 10.5H10.5), flat: its 1-long stub beyond the slash would read as a nub (Fluent and Lucide stop it there too). Filled: the frame a fill parted by the shared slash gap, keys holes, spacebar a knockout |
| power-off | circle; Lucide power-off / Huge PowerOff / SF poweroff: power's r 5.5 ring arc copied exactly under the shared slash, flat (its left end already ends on the slash, 0.35 off its centre-line, so the cap lies under the slash); the stem shortened to 2-4.5 (tight 1.35 above the slash): power's 2-7.5 stem ended on the slash and read as a T joined to it (Lucide and Huge shorten it the same way). Line glyph: fills by weight; filled ring pieces as link-off (the lower-left piece runs to the slash, the upper-right piece stops 2.5 from it at 13.343, 9.806), the stem a both-styles line (0.97 from the slash at 1.5) |
| bell-plus | square; Lucide bell-plus / Huge BellPlus for the concept: bell copied exactly (body and clapper) with the container's 4px + inside, centred at 8, 6 in the dome (inside placement: the bell is a closed shape whose interior holds the + with a detail 0.88 gap to the dome and tight 1.31 to the shoulders, as bookmark-add / chat-add); Lucide's corner + would cut away the bell's whole top-right quarter (a 2.25 cut round a + at bell-dot's 12.5, 3.5 runs down the right side to 7.75), and the outline is the bell's identity. At 8, 6.5 (concentric with the dome) the + sits 2.48 from the clapper, a lint near miss; at 8, 7 2.08. Filled: bell solid, + a knockout, clapper a line |
| calendar-range | square; Lucide calendar-range / Huge CalendarRange: calendar's frame, header at 6.5 and pegs copied exactly (as calendar-add), the date grid replaced by Lucide's range rows: a ⌀1.5 date dot at 5, 9 and a range bar 7.5-11 at 9 (tight 1.19), then a bar 5-8.5 at 11.5 (the range continuing into the next week). Rows 2.5 apart are the only pair that fits a dot 2.44+ from the header and a bar 2+ from the base, so row 1 sits on whole-pixel 9 (a 3.5-long bar, grey at 1x); the second row's dot is dropped (at 11, 11.5 it sat 0.69 from the base). Gaps: tight to the header, frame sides and between rows, detail 0.88 from the second bar to the base. Filled: calendar's (body fill below the header, frame, header and pegs lines), dot a hole, bars knockouts |
| bookmark-check | vertical, free angles (bookmark's); Lucide bookmark-check / Huge BookmarkCheck: bookmark copied exactly with the check inside where bookmark-add holds its + (centred on 7 vertically); the 2 / 4 check is 6 wide and leaves 0.38 to the sides, so it is the 1.5 / 3 check M6 7L7.5 8.5L10.5 5.5, 0.25 right of centre for the lattice as calendar-check and vote (tight 1.38 left, detail 0.88 right). Filled: bookmark solid, check a knockout |
| tag-plus | square; Fluent tag_add / Lucide tag-plus: tag copied exactly (eyelet kept) with the container's 4px + inside, centred in the tag's body at 8.5, 8.5 (inside placement, as location-add: a closed shape whose interior holds the + with tight 1.70 to both 45-degree sides and the far edge, open 2.83 from the eyelet; at 8, 8 the eyelet was a 2.17 near miss); every arm on x.5, crisp at 1x. Fluent's corner badge and Lucide's cut corner + would cut the tag's outline, its identity. Filled: tag solid, eyelet a hole, + a knockout |
| paint-roller | square; Lucide paint-roller / Phosphor paint-roller on Area's grid: a 9 × 4 roller (2.5–11.5 × 2.5–6.5, r 1.5, counter 2.93) with an arm leaving its right end at mid-height (4.5) out to 13.5, down to 9.5 and back to x 8 (r 1 corners), a standard 3 below the roller, then down onto a 3 × 3 grip (6.5–9.5 × 10.5–13.5, r 1, counter 1.93; Lucide's 2 : 3 grip shortened so every long edge is on x.5 and the ink centres at 8, 8); ink 12.12 square; filled: roller and grip solid, the arm stays a line |
| square-root | square, free angles; Lucide radical / Huge Radical / SF squareroot in the type family's cap height 2.5–13.5: a 1.5 entry tick at 9 (2.5–4), a short down-stroke to a 1-wide flat foot at 13.5 (6–7; Lucide's rounded foot, which keeps both foot corners at 105–119° instead of one 44° point), a long up-stroke to 10, 2.5 and the vinculum to 13.5; r 0.5 fillets at the four bends (soft transitions); ink 12.12 square centred 8, 8; a line glyph (unframed), fills by weight |
| list-collapse | square; Lucide list-collapse / Huge ListCollapse on indent's construction: indent's three lines 6.5–13.5 on the three-line stack rows 3.5 / 7.5 / 11.5 (0.5 high, crisp) and two of indent's 2px chevrons (M2 2L4 4L2 6 and M2 9L4 11L2 13) beside the first and last rows, centred 0.5 inside them as Lucide's sit between rows; chevrons a standard 1.88 apart, tight 1.42 tip to line; ink 12.62 × 12.12, centre 7.75, 7.5; fills by weight |
| file-video | vertical; document verbatim with play-circle's play exactly (the r 0.75-cornered solid triangle, data-dot free as play-circle) moved 2.125 down into the free interior below the fold (6.5–10.44 × 7.9–12.35), the container's solid-mark exception (play, dots); detail 0.96 to the floor, tight 1.37 to the left side and fold; Phosphor / Lucide / Huge draw a camera, which needs a 2-part mark too dense under Area's 4.5 fold; filled: page fills, the play is a hole |
| file-audio | vertical; Lucide file-music / Material audio_file: document verbatim with an eighth note inside below the fold: a solid r 1.25 head at 6.75, 11.25 (data-dot free, as the play), a stem at x 7.5 from the head's right edge up to 8, and Lucide's straight flag 7.5, 8 → 10, 9.25; stem top tight 1.38 from the fold curve, head detail 0.94 to the floor; music's ringed heads don't fit (a ring head left of the stem meets the left side) so the head is the solid-mark exception; filled: page fills, head a hole, stem and flag knock out |
| file-upload | vertical; document verbatim with file-download's arrow turned 180° (data-rotations can't give it: it would turn the page): the same 1.5 head on the lattice (M6.5 10.5L8 9L9.5 10.5) and a 3-long shaft 9–12; turned exactly about its centre the head falls off the 45° lattice (x + y 16.5), and lifting the tip to 8 to keep the 3.5 shaft leaves a 0.73 near miss to the fold curve, so the shaft is 0.5 shorter; tight 1.65 to the fold, detail 0.88 to the floor (download's); filled: page fills, arrow knocks out |
| chart-area | square; Lucide chart-area / Fluent data_area on the chart family: chart's axes M2.5 2.5V13.5H13.5 exactly, with an area shape standard 3 from both axes (left side x 5.5, base 10.5, right side 13.5): its top a lattice zigzag 5.5, 7.5 → 7.5, 5.5 → 9.5, 7.5 → 13.5, 3.5 (chart's rise-dip-rise), r 0.5 fillets at the 90° and 135° bends and r 1 at the 45° top-right corner and the base corners; every edge on x.5; counter 3.12; ink 12.12 square centred 8, 8; filled: the area solid, axes stay lines |
| gift-card | horizontal; Fluent gift_card: credit-card's 12 × 9 r 2 card (2–14 × 3.5–12.5) with a ribbon across at x 6.5 and a band at 9.5 (both x.5), and gift's bow redrawn at card size on the crossing: two loops 2.5 wide × 2.75 tall (gift's teardrop with an r 1 top) from the knot at 6.5, 9.5, the left one detail 0.88 from the card's side, loop counters 1.13; no tails (gift has none, and the 3-tall lower panel has no room); filled: card solid, ribbon and band cuts through the silhouette (credit-card's stripe), the loops knockouts with their small insides left solid, as Fluent's filled cut (no islands flagged at 16 / 48) |

Delegated calls to confirm are listed in docs/research/icon-review/2026-10-10/README.md (Batch 71).

## Batch 72: New icons, 2026-10-10

| Icon | Construction |
|---|---|
| gem | square, free angles; Fluent premium / Lucide gem: a faceted gem, distinct from diamond's plain square: a 7-wide table at 2.5 (4.5–11.5, r 1 corners), 45°-steep crown sides down to a girdle 2–14 at 6.5 (r 0.75 shoulders), and a pavilion to a point at 8, 13.5 (69°, so no data-acute and no fillet: the point stays sharp, the round join softens it). The girdle line runs 2.182–13.818, ending on the shoulder arcs. Lucide's facets: crown facets from the table at 6.5 / 9.5 to the girdle at 5 / 11 (crown pockets 1.41 / 2.93), and pavilion facets from those girdle points to the point. Every horizontal is on x.5. Ink 12.76 × 12.12, centred 8, 8. Filled (Fluent premium_filled): the gem is solid, the girdle and the crown facets are gaps run out through the silhouette (package's), and the pavilion facets become filled-only inset knockouts that stop at 9.854 (2.0 apart, 1.19 of fill to each side), as Fluent's stop short of the point. Run to the point they would leave fill slivers in the 17° wedge. No slivers at 16 or 48. |
| file-pdf | square, free angles (the fold's); Phosphor file-pdf / Huge Pdf01: document's top copied exactly (top edge, r 2 top-left corner, the 4.5 fold with its data-shift parts). The left side ends at 6, tight 1.41 above the P, and the page below the fold is replaced by a PDF label in gif's and spell-check's lettering, 5 tall (8.5–13.5, every stem and long edge on x.5). P: stem at 1.5 with a 1.5-long top and an r 1.5 bowl to 11.5, 3 wide. D: stem at 6.5 with 0.5 runs and an r 2.5 semicircle, 3 wide (counter 1.93). F: stem at 11.5 with gif's 2-long top arm and 1.5-long middle arm at 11. Letters are 2 apart between centre-lines (detail 0.88, gif's), and the F's arm ends 1.94 under the fold. Ink 13.12 × 12.62, centre 7.5, 7.75. Fluent's construction (a full page with the label at its lower left) does not fit: the label is 12 wide on a 9-wide page, so the right edge or the floor would cut through the F. Filled (Phosphor's fill): the page cap fills down to 6 with the dog-ear open, and the letters stay ink. Readable at 1× (px.mjs). |
| hand-coins | square; Lucide hand-coins on Area's 45° lattice: a 45° cuff line M2 10L6 14. The wrist rises from the cuff at 3, 11 on x + y = 14 (r 1.5 corner) into the palm top at 8.5. An r 1.5 thumb tip curls to 11.5 with a short underside back to 6.75 (standard 1.88 from the wrist). The lower hand runs from the cuff at 5.5, 13.5 (3 below the thumb) and turns up at 45° (r 1.5) into a 2.83-wide finger band (x + y = 20 / 24) with an r 1.414 tip at 12.5, 9.5. The band's upper edge ends on the thumb tip at 9.354, 10.646, joined as Lucide's. Coins are r 2 rings (the lens size). The front coin is at 10, 4.5 (detail 0.98 from the fingertip, tight 1.23 from the thumb). The back coin sits beside it at 6.5, 4, cut by the overlap cut 2.25 (icon-geometry behind) as coins.svg's back coin. Two equal coins side by side read as eyes. Ink 13.04 × 13.12, centre 7.96, 8. Filled: the front coin is solid. The back coin stays a line (the multiples rule: the front fills, the back stays a line). The hand is an open line drawing and keeps its weight. No slivers. |
| package-check | square, free angles; Lucide package-check / Fluent box_checkmark / Huge PackageCheck: package copied exactly (box, Y and tape) with the check on the lower-right corner. The inside placement does not fit: package's right face is 6 wide between its edges and leaves 2 for a mark. The 1.5 / 3 check reaches the right side only at 9.5 → 14, 1.5 from the Y stem, which would cut the stem to 9.8 and remove the box's bottom point. So it is copy-check's and clock-check's 1 / 2 check (the next size down, contained-marks rule): M10.5 12.5L11.5 13.5L13.5 11.5 on the lattice, stem and bottom point whole. The outline is cut 2.25 round it (icon-geometry cut): the right side ends at 9.306 and the bottom edge at 8.583, 13.677 on the bottom arc (detail 1.12, tight 1.38). Filled: package's gaps. The box is a fill that stops on the 2.25 offset of the check (r 2.25 about each end, the long arm's offset line, an r 0.75 fillet at the convex point where the start's arc meets it). Right of the stem gap the fill ends on the gap's centre-line, so no hairline is left under the bite. The check stays ink beside it (mail-check). No slivers at 16 or 48. |
| sort-alpha | square, free angles (the A's legs); Fluent text_sort_ascending / Lucide arrow-down-a-z / Huge SortingAZ01: sort-ascending's arrow exactly, turned down as its sort-descending flip (M11.5 3.5V12.5, 2.5 head M9 10L11.5 12.5L14 10; every A to Z reference points down), beside a 4 x 4 letter box at x 2.5-6.5 holding a stacked A (2.5-6.5) over a Z (9.5-13.5), a standard 3 between the rows (1.88). The A is the type family's A (case-upper / spell-check): straight legs from 2.5, 6.5 and 6.5, 6.5 to an r 0.5 apex whose top sits on the cap line 2.5 (solved: M2.5 6.5L4.038 2.808A0.5 0.5 0 0 1 4.962 2.808L6.5 6.5) and a crossbar 1 above the base on x.5 (M2.917 5.5H6.083, spell-check's ratio; counter 1.04). The Z is 4 x 4, so its diagonal is 45 degrees on the lattice (x + y = 16), with both bars on x.5 (M2.5 9.5H6.5L2.5 13.5H6.5, round joins, no fillet: an r 0.75 fillet takes 1.8 off each 4-long bar). Letters stand 2.5 from the arrow's barbs and 5 from the shaft. Ink 12.62 x 12.12, centre 8.25, 8: the letter box starts at 2.5 so the Z stays on the lattice, and the arrow keeps sort-ascending's x 11.5 (crisp). A line glyph: fills by weight |
| sort-numeric | square; Lucide arrow-down-0-1 / Huge ArrowDown01, the pair of sort-alpha: the same arrow (M11.5 3.5V12.5M9 10L11.5 12.5L14 10) and the same 4-tall rows (2.5-6.5 and 9.5-13.5, standard 1.9 between), both numerals left-aligned on the letter box's x 2.5 so the ink box matches sort-alpha's exactly (12.62 x 12.12, centre 8.25, 8). The 0 is a 3 x 4 stadium (rect 2.5-5.5 x 2.5-6.5, rx 1.5, as Lucide's 0; counter 1.93), its sides on x.5: a 4-wide 0 in the 4-tall row is a circle and read as an O. The 1 is list-numbered's 1 exactly (a 1 x 1 45-degree flag on the lattice and a stem on x 4.5), its stem 0.5 longer to fill the 4-tall row: M3.5 10.5L4.5 9.5V13.5. No free angles. A line glyph: fills by weight (the 0 stays a ring, as letters do) |
| incognito | circle (13.12 wide, the horizontal keyline's width, but 12.62 tall), free angles (the crown's 1 : 2 sides); Fluent incognito / Lucide hat-glasses / Phosphor detective / Huge Incognito: a hat over glasses. The brim is a straight line 2-14 at 6.5 (Lucide / Phosphor; Fluent's slight curve dropped). The crown is Fluent's flat-topped trapezoid: top 6.118-9.882 on 2.5 and sides falling 1 : 2 to 3.5 and 12.5 on the brim (r 1 top corners, icon-geometry open-fillet), so the brim runs 1.5 past it on each side, as Fluent's does. The glasses are two r 2.5 rings at 4.5, 11.5 and 11.5, 11.5 (x 2-14, the brim's width), tight 1.38 below the brim, joined by Fluent's straight bridge M7 11.5H9 on x.5 between the rings' inner points. Lucide's r 1 arched bridge was tried and merged with the rings into a grey block at 1x. Ink centre 8, 8.25: the brim and bridge stay on x.5, and the glasses are the base. Filled: the crown is solid (the open path closes along the brim, where the edge is), and the brim and glasses stay lines with the lenses open (Fluent's filled cut; the skill names incognito: a frame whose features would invert keeps its lines and the accessory fills) |

Not drawn: replace-all. No "all" mark fits on an exact copy of Area's replace (a lens drawn as an arrow arc); the options are a smaller replace lens with reply-all's doubled head, or Lucide's box construction for both replace and replace-all. Delegated calls: docs/research/icon-review/2026-10-10/README.md (Batch 72).

## Batch 73: New icons, 2026-10-10

| Icon | Construction |
|---|---|
| move-horizontal | horizontal; alias of arrow-left-right (data-alias-of, linted identical): Area's arrow-left-right is already one double-headed arrow, a 12px shaft (M2 8H14) with 3px heads at both ends (the double arrow's recorded head size; 4 crowded it), which is Lucide move-horizontal, Phosphor arrows-horizontal, Huge MoveHorizontal and Fluent arrow_bidirectional_left_right, so a second drawing would duplicate it; move-vertical is its 90° turn (data-rotations, identical to arrow-up-down); line glyph, fills by weight |
| fold-horizontal | square; Lucide fold-horizontal / Phosphor arrows-in-line-horizontal on arrow-right-to-line's construction: a solid centre line 7.5, 2.5–13.5 (on x.5 for 1×, so the whole icon sits 0.5 left, ink centre 7.5, 8), two arrows pointing in to it, shafts 2–5 and 13–10 at y 8 with the short-frame 2px heads (tips 5, 8 and 10, 8 on the lattice), each tip a tight 2.5 from the line (ink 1.38; the arrow-meets-frame gap); the line is solid, not Lucide's dashes (Phosphor; no stroke opened for style); fold-vertical is its 90° turn; line glyph, fills by weight |
| unfold-horizontal | square; fold-horizontal with each arrow reversed in place (Lucide unfold-horizontal, Phosphor arrows-out-line-horizontal): the same 7.5, 2.5–13.5 line, the same 2px heads, shafts 5–2 and 10–13 at y 8 starting a tight 2.5 from the line, tips 2, 8 and 13, 8 on the lattice, so fold and unfold share one box (ink 12.12 × 12.12, centre 7.5, 8); unfold-vertical is its 90° turn; line glyph, fills by weight |
| space | horizontal; the ⎵ key glyph (Lucide space, Huge Space) on the key family's width (2.5–13.5, as option and return): uprights 6.5–8.5 at x 2.5 / 13.5 into whole-word's bracket corners (r 1) and a floor at 9.5, 3 deep (Huge's proportion; Lucide's 2 read as a bare underline beside shift), every edge on x.5, ink centred 8, 8; ink 12.12 × 4.12 (1.88 under the keyline, as option); line glyph, fills by weight |
| chat-check | square; Lucide message-square-check / Fluent chat_checkmark / Huge MessageSquareCheck: chat's bubble copied exactly (chat-add's), with the check inside where chat-add holds its + (inside placement: a closed shape, as bookmark-check / shield-check). The 2 / 4 check is the inside-a-shape check, the partner of the bubble's 4px +, and it fits: M5 7L7 9L11 5, centred on chat-add's + centre 8, 7 (x 5-11, y 5-9, the same 4-tall band as chat-add's + and chat-code's chevrons), on the lattice, tight 1.38 to the bubble's top, bottom and both sides. The 1.5 / 3 check (bookmark-check's fallback) was rendered and looked lost in the bubble. Ink 12.12 x 12.06, centre 8, 7.97 (chat's). Filled: bubble solid, check a knockout (chat-add's) |
| list-x | horizontal; Lucide list-x / Fluent text_bullet_list_dismiss / Huge ListX: list-plus copied exactly (2-14 lines at 3.5 / 6.5, 2-7.5 lines at 9.5 / 12.5) with its 4px + replaced by the 3.5 x at the same centre 12, 11 (filter-dismiss's x moved up 1): M10.25 9.25L13.75 12.75M13.75 9.25L10.25 12.75, arms on the lattice; tight 1.63 from both short lines' ends. Ink 13.12 x 10.37, centre 8, 8.13. Line glyph: fills by weight |
| signal-low | square; Lucide signal-low / Phosphor cell-signal-low / Fluent cellular_data_4 (Fluent counts down: _1 is five bars; corrected 2026-10-14): signal's first two bars exactly at their positions (M3.5 13.5V11.5M6.5 13.5V8.5), the upper two dropped, as wifi-low keeps wifi's inner arc. Area's signal has four bars and no baseline dot, so its first bar plays Lucide's / Phosphor's dot: low = 2 bars, medium = 3, signal (high) = 4, an even series. The dropped bars vanish rather than stay as baseline stubs: ⌀1.5 dots and 0.5 stubs were both rendered and read as an ellipsis after the bars at 16, and every reference (Lucide, Phosphor, Fluent) lets them vanish. It sits under its keyline (ink 4.12 x 6.12, centre 5, 11) so it lines up with signal in a set, as wifi-low does. Line glyph: fills by weight |
| signal-medium | square; Lucide signal-medium / Phosphor cell-signal-medium / Fluent cellular_data_3 (corrected 2026-10-14): signal's first three bars exactly at their positions (M3.5 13.5V11.5M6.5 13.5V8.5M9.5 13.5V5.5), the tallest dropped, one bar more than signal-low; the dropped bar vanishes as signal-low's. Ink 7.12 x 9.12, centre 6.5, 9.5, under its keyline so it lines up with signal. Line glyph: fills by weight |
| square-alert | square; SF exclamationmark.square / Linear's urgent priority: stop's square (11 x 11, r 2, 2.5-13.5) as square-x / square-plus, holding the ring's ! exactly (alert-circle's, info turned: stem M8 5V8.75, ⌀1.5 dot at 8, 11, 2.25 below the stem's end), since square containers take the ring's marks; the stem's top is square-plus's + top (5), tight 1.38 to the frame top, dot tight 1.19 to the base, stem-to-dot 0.94 as the ring's. Ink 12.12 square, centre 8, 8. Filled: square solid, stem a knockout, dot a hole (square-dot's) |

Delegated calls: docs/research/icon-review/2026-10-10/README.md (Batch 73).

## Batch 74: New icons, 2026-10-10

| Icon | Construction |
|---|---|
| panel-bottom-open | horizontal; Lucide panel-bottom-open / Fluent panel_bottom_expand (the VS Code / Cursor terminal panel toggle): panel-bottom copied exactly (frame 2–14 × 3.5–12.5 r 2, the 3px pane M2 9.5V10.5A2 2 0 0 0 4 12.5H12A2 2 0 0 0 14 10.5V9.5Z, solid when filled) with panel-left-open's 2-leg frame-contained chevron turned to point up, away from the pane (open): M6.5 7.5L8.5 5.5L10.5 7.5. The 3.5–9.5 main area is 6 tall and the chevron 2, so on the lattice (x ± y whole) only the centred 5.5–7.5 row passes the gap scale: detail 0.88 to the frame top and detail 0.88 to the pane line; a tip on whole 5 or 6 at x 8 leaves 0.38 to one side. The tip on 5.5 needs x.5, so the chevron sits 0.5 right of centre (the lattice-bound mark offset, as calendar-check / vote); tip and legs on pixel centres, crisp at 1×. panel-left-open sits a tight 2.5 from its pane; the bottom pane's shorter main area gives detail 2 / 2 instead (trade-off recorded). Ink 13.12 × 10.12, centre 8, 8. Filled: the pane solid, the chevron stays a line in the open main area (panel-left-open's). panel-top-open is its flipy (data-rotations) |
| panel-bottom-close | horizontal; Lucide panel-bottom-close / Fluent panel_bottom_contract: panel-bottom-open mirrored about the main area's centre line y 6.5, so the chevron points down toward the pane (as panel-left-close points at its pane): M6.5 5.5L8.5 7.5L10.5 5.5, the same 0.5-right column, detail 0.88 to the frame top and the pane line; panel-bottom copied exactly. Ink 13.12 × 10.12, centre 8, 8. Filled: the pane solid, the chevron a line. panel-top-close is its flipy (data-rotations) |

Delegated calls: docs/research/icon-review/2026-10-10/README.md (Batch 74).

## Demo swap: components show Area icons, 2026-10-10

Owner: "can you work on implementing them into the actual components?" This is the step the roadmap held back:
the component demos' Fluent icons are replaced by Area's own drawings. The components themselves already drew Area
glyphs (Glyph.tsx, PACKAGE_GLYPHS); every icon passed in from a demo was still a Fluent cut.

- **Mechanism:** `AREA_SWAP` in `apps/docs/scripts/gen-icons.mjs` maps each demo icon name (PlusIcon, SearchIcon,
  AlertIcon, the older vendored inspector marks such as CornersIcon or OpacityIcon, …) to its pilot icon. The
  generated `apps/docs/src/icons.tsx` exports that name as the Area drawing (`<PilotAddIcon {...props} />`; PersonIcon
  at size 20 for Avatar's slot). The swapped name's Fluent cut stays exported as `FluentCut<Name>`. The Iconography
  page imports those, so its Fluent comparison rows still show Fluent.
- **Demo files:** most demos kept their imports. Card, Toggle group and the gallery used `Fluent*`-named icons; those
  now import generic names that render Area (BoldIcon, ItalicIcon, ChevronLeftIcon, PlayIcon, SunIcon, …). The
  toggle-group demo's formatting icons are Area's bold / italic / underline / strikethrough.
- **Not swapped:** the docs toolbar (`icons.generated.mjs`, the site chrome), the `FluentRef*` comparison plates on
  the icon pages, and PresenceAvailableIcon (presence has its own marks).
- **Result:** 137 of 841 specimens changed, in 35 families (Alert, Toast, Badge, Button, Button group, Card, Chip,
  Checkbox, Command palette, Composer, Input, Input group, Kbd, Menu, Nav, Panel, Segmented, Split button, Tabs,
  Toggle group, Toolbar, Tree view …). Everything else is unchanged.
- **Review:** "Area Icon Swap" (https://claude.ai/artifact/EyvzqrhCmbDrrc1qdcBEqz) shows every specimen before
  (Fluent, main at eaa9222) and after, side by side. Decisions go to its own `iconswap1` collection. Many swapped
  icons are themselves still in icon review, so a note there may be about the icon rather than the swap.
- **Retiring the Fluent map** (the roadmap's last step) waits for the owner's approval of the swap.

## Package: @area/icons, 2026-10-10

Owner: "@area/icons package" (production gap 2 in `docs/research/icon-review/2026-10-10/README.md`). Until now the
full set lived only in `apps/docs/src/pilot-icons.tsx`, and `@area/react` ships about 24 component glyphs.

- **Source of truth stays the SVG sources.** `gen-pilot-icons.mjs` builds each icon's components once
  (`iconSource`) and the shared helpers once (`RUNTIME`), and writes them twice: `pilot-icons.tsx` for the docs
  (Pilot… names, unchanged output) and `packages/icons/src/generated/` for the package (one module per icon, plain
  names: `SearchIcon`, `SearchFilledIcon`). The package's sources are gitignored; `--package` rewrites only them.
- **Only approved icons ship in the main entry.** Status comes from `batches.json`; a turn or mirror takes its base's
  status, an alias the status of the icon it copies. Icons in review are in `@area/icons/review` and move to the main
  entry when approved. Every icon is also at `@area/icons/icons/<name>`.
- **Props:** the docs' props (`size`, `weight`, every SVG prop but `stroke`). Components stay `aria-hidden`; an
  accessible label and right-to-left mirroring are production gap 3.
- **Static files** are rendered from the compiled components: raw SVGs at the size curve's masters 16, 20 and 24
  (the curve holds from 24, so larger sizes scale the 24 file) with the line at 1.125px (Geist's
  `--area-weight-icon`) as a number, a 16px sprite (`area-<name>`, `area-<name>-filled`), and `icons.json`. Mask and
  clip ids are per file (`area-<name>[-filled]`), so inlined files never share one.
- **Metadata** (`@area/icons/meta`): name, component names, category (the icon browser's), keyline, fill
  (solid or weight), status, batch, turn and alias. Keywords and other libraries' names are production gap 4.
- **Checks:** `npm test -w @area/icons` (entries split by status; every component renders exactly what its pilot
  component renders at 16, 20 and 24; SVGs and sprite cover every icon) and `npm run test:consumer` (packed install,
  strict NodeNext types, SSR render, files resolvable, one imported icon tree-shakes to its own module).

## Batch 75: Coverage from product surfaces, 2026-10-10

| Icon | Construction |
|---|---|
| image-sparkle | square; ChatGPT photo-sparkle (Create image), Figma's AI image actions, Fluent image_sparkle: image's frame and mountain copied exactly, the sun replaced by chat-sparkle's corner sparkle (±2.5, Q 0.3) set in to 11, 5.5 so its foot sits 2.12 from the mountain's slope (detail 1.0 in the outline; filled, its halo meets the mountain's cut, no sliver). The frame is cut round the sparkle by the overlap cut (top to 8.806, right from 7.798). Filled: the frame fills, closing on a chord between the sparkle's top and right tips inside its halo (the rounded corner left an island); the mountain stays a cut and the sparkle ink with a halo (chat-sparkle's). |
| pencil-sparkle | square; ChatGPT pencil-sparkle: the slim pencil (2.12 wide, sides on x + y = 14.5 / 17.5, the composites' pen body with pencil's square r 0.5 end and its band 2.12 below the end) with the ±2.5 sparkle at 4.5, 4.5, detail 1.0 from the pencil's side. The full-width pencil left the sparkle 1.77 away or pushed the ink to 13.4 wide. Filled: pencil and sparkle solid, the band a cut. |
| text-sparkle | square; Figma's AI text actions (lines with a sparkle): three text lines on pixel centres (6.5 to 7.5, 9.5 to 13.5, 12.5 to 10.5) with chat-sparkle's corner sparkle at 11.5, 4.5; the short top line ends a tight 2.5 from the sparkle's left tip and the sparkle's foot is 2.5 above the middle line. Ink centre sits 0.75 high (the sparkle is the top). Filled: the sparkle solid, the lines unchanged. |
| code-sparkle | horizontal; Figma's code-sparkle: code's chevrons copied exactly with the ±2.5 sparkle in place of the slash, centred on 8, 8, tight 1.35 from both chevrons. Filled: the sparkle solid, the chevrons unchanged. |
| people-group | circle; ChatGPT person-group, Figma's multiplayer avatars, Fluent people_team, Phosphor users-three: a front figure centred (head r 2 at 8, 6.5; body 5 to 11 from 11 to 14, r 2.5 shoulders) with two back figures (head r 1.5 at 3.5 / 12.5, 4.5; a 4-wide dome 8.5 to 12) cut by the overlap cut round the front figure (people's construction, mirrored). Back bodies sit 0.5 lower than first drawn so the front head clears them by a detail 0.9. Filled: the front figure solid with a halo, the back figures fill (people's). |
| person-dashed | circle; Notion personCropCircleDashed (unassigned) and Figma's dashed person: person-circle's figure exactly (head r 2 at 8, 6.5; the body closing on the ring) inside circle-dashed's ring turned 22.5° so no dash meets the body; the two dashes beside the body sit at 21° / 159° (1.5° up) to clear its shoulders by a detail 0.98, the others at 45° steps. Six dashes of 15.2°. Filled: head and body solid, the dashes unchanged. |
| circle-dollar | circle; ChatGPT dollarsign-circle, Figma's billing $, Lucide circle-dollar-sign: the ring with a $ sized for it, an S of two 2 × 1.5 elliptical bowls (6 to 10, 5 to 11, dollar's start and end angles) and ticks 4 to 5 and 11 to 12, detail 0.88 from the ring. Filled: the ring fills and the $ is a knockout (the ring's marks). |
| chat-pen | square; ChatGPT pencil-and-chat-bubble, Notion commentPencil, Fluent comment_edit: chat's bubble opened round compose's slim pen by the overlap cut (top to 6.818, right from 5.168), the pen shortened 0.75 along its axis and moved 0.5 left and 1.5 up so its tip sits 2.5 from the bubble's left and bottom. Filled: the pen solid, the bubble a line (compose's). |
| sun-moon | circle; ChatGPT moon-sun (theme), Lucide sun-moon: moon at half size (r 3, bite facing up and right) with sun's rays on the left half only (top, bottom, left and the two left diagonals), detail 0.88 from the moon, the whole moved 1 right so the ink centre is 7.44 (+2 put it at 8.5; the diagonal rays need whole shifts). Filled: the moon solid. |
| heading-4 | horizontal; Figma H4, Notion heading 4: heading-1's H exactly with an open 4 (Lucide's): left stem 11 from 6.5 to 9, r 0.5 into the bar at 9.5 to 14.5, the full stem 13.5 from 6.5 to 12.5. The stems sit 2.5 apart: at 2 the filled lines left a hairline. |
| heading-5 | horizontal; Figma H5: heading-1's H exactly with a 5: top bar 14 to 11.5 at 6.5, the stem down to 9.5 and heading-3's lower bowl (r 1.5) moved 0.5 left, centre 12.5, 11. |
| heading-6 | horizontal; Figma H6: heading-1's H exactly with a 6: a ⌀3 bowl at 13, 11 (heading-3's bowl size) and a tail from 13.5, 6.5 on an r 6.06 arc tangent to the bowl's left side. |
| pilcrow-right | square; Figma's paragraph direction, Lucide pilcrow-right: pilcrow at a shorter height (stems 6.5 and 9.5 from 2.5 to 8.5, an r 2 bowl, the top bar to 10.5) over a standalone-style arrow 2.5 to 13.5 at 12.5 with a 2px head. The pilcrow sits 1 left so the head's top barb is 2.83 from the right stem. The bowl's closing edge lies on the stem, as in pilcrow. Filled: the bowl solid. |
| pilcrow-left | square; Lucide pilcrow-left: pilcrow-right's pilcrow moved 3 right (not mirrored: a pilcrow doesn't turn) over the arrow pointing left. Filled: the bowl solid. |

rectangle-vertical is a new turn of rectangle (transpose; ChatGPT rectangle-portrait / aspect 9:16, Notion rectangleTall). Not drawn: trash-restore (ChatGPT trash-open-arrow-up): every lattice placement of a restore arrow in the trash body lands between gap steps against the handle's feet (3.54 between centre-lines). folder-user (ChatGPT folder-person): a corner figure is taller than the folder's keyline allows, and a figure inside reads as a camera. Both are in docs/research/icon-review/2026-10-10/README.md (Batch 75) with options.

## Owner review round 9, 2026-10-11

From the review page (`reviews7`): 149 of the new and changed icons reviewed, 146 approved. Six of those approvals were
newer than their drawings and are now approved in batches.json (attach, file-clock, file-user, folder-sync, highlighter,
slice); the rest were already synced, and atom, building, car, home and form keep `review` because their verdicts predate
the latest drawing. Owner notes in chat applied with the page's fix and replace verdicts. Sheet:
`docs/research/icon-review/2026-10-11/1-round-9-fixes.png` (after, with each before as a reference row).

| name | change |
|---|---|
| form | Owner: the lines should be shorter and aligned so the filled page isn't thin beside them. All three lines start at 5.5, 3 in from the page's left edge, and end at 8.5, 3 from its right (title 5.5 to 8.5 at 4.5, then 5.5 to 8.5 and 5.5 to 7); before, the title was centred and two lines started at 4.5, leaving 0.88 of fill at the edge. |
| blur | Replace (toward Fluent) on the owner's reference, a droplet halved by a centre line with diagonal hatching on one side; drawn as the ring, as Fluent's blur is a circle: ring r 6, a centre line 2 to 14, and three 45° hatches on x + y = 14, 17, 20 from the centre line to the ring (3 apart: at 4 apart the top pocket was 0.68). Filled: the left half solid, the hatches lines. |
| superscript, subscript, list-numbered | Owner: the 2 looked too weak at its foot when filled. The 2 is list-numbered's, now with its base starting 0.67 left of the bowl (base 2.5 to 5.75 in list-numbered) and the diagonal tangent to the bowl at 5.311, 10.199 (solved, no kink). superscript and subscript had a narrowed copy (bowl 1.125, base 2.25); both now copy list-numbered's 2 exactly. subscript's X moved 0.5 down and right (on the lattice) to keep a tight gap to the wider 2 inside the keyline. |

## Owner review round 10, 2026-10-11

Owner: "make sure negative space strokes aren't visibly rounded" (umbrella's ribs, banknote's corners), a thorough audit of
every letter and number, and a justification for each reviewed icon's filled treatment. Sheets in
`docs/research/icon-review/2026-10-11/`; the treatments page is https://claude.ai/artifact/1oCSG2MmsfkpxcNAtDnpBY.

- **Knockout run-outs follow the tangent.** The generator ran a knockout out through the silhouette only when its end was a
  straight segment; a knockout made of arcs or curves kept its round cap at the edge. The run-out now follows the path's
  tangent read from its samples (`gen-pilot-icons.mjs`; `AUDIT_ENDS=1` lists knockout ends 0.15–1.2 from an edge).
  Changed: umbrella, banknote, basketball, globe-off. The audit's other near-edge ends are intended (brain-circuit's traces
  meet the centre gap; bot-designer's stripe, archive-restore's barb and notebook's rings end inside the solid).
- **Type audit.** One construction per glyph across the set:

| name | change |
|---|---|
| heading, heading-1 … heading-6 | The H's crossbar moves from 8 to 7.5: crisp at 1× and at type's optical middle. |
| heading-1 | The 1 takes the family's 1 × 1 45° flag (list-numbered, sort-numeric), off the lattice-free shallow flag. |
| heading-2 | The 2 takes the family construction: r 1.5 bowl (heading-3, 5, 6), diagonal tangent at 14.2, 8.9, square corner at 11.5, 12.5, base to 14.5 (was a rounded r 0.75 corner). |
| binary | The 1s are the family 1 (45° flag, no foot) in place of a slab 1 with a foot; the second column moves 0.5 so both 0s sit on pixel centres (rect x 9.5). |
| whole-word | case-lower's ab exactly: the b's ascender starts at 2.5 (was 3). |
| case-sensitive | case-upper's A in its place (2 to 7), so the gap to the a is standard (1.77) like AB and ab. |
| remove-formatting | The T moves 0.5 right (stem on 6.5, crisp); the × moves 0.5 down and right to keep a tight gap. |
| text-size | Both T's horizontals on pixel centres: big T 2.5 to 12.5 with 2-long ticks, small T 7.5 to 12.5. |

  Kept, with reasons: the T stems of text, text-color, line-height, letter-spacing and square-text sit on 8 (they centre on
  8, the skill's exception); text-size's big T stem sits on 6 (an 8-wide bar centres on a whole pixel and a 9-wide one
  overflows the keyline); list-numbered's 1 is 3.5 tall (at 4 the filled 1 and 2 come within 0.69); spell-check's caps are
  4.5 tall so its B keeps the larger lower bowl; translate keeps Fluent's double-storey a (your pick, 2026-10-07), while
  case-lower, case-sensitive and whole-word use the geometric single-storey a.
- **Filled treatments.** All 375 reviewed icons sort into six treatments (body fills and parts stay lines 187; a front part
  parted by one line weight 32; a crossing part moved inside as an inset 8; details knocked out 64; one solid 11; by weight
  73). shield-lock was the one icon whose treatment disagreed with its family: its shield now fills and the lock is knocked
  out, like shield-check, shield-cog, shield-x and shield-plus.

## Owner review round 11, 2026-10-11

243 decisions on the review page (202 approve, 30 fix, 11 replace) and notes in chat on the 1, the 2, umbrella and globe-off. 195 approvals newer than their drawings are approved in batches.json. Generator: `data-ends="keep"` on a line-glyph path keeps its free ends when the filled weight thickens it (the 2's base had shortened against its bowl and the Z's bars had shifted). Records: `docs/research/icon-review/2026-10-11/README.md` (round 11).

| name | change |
|---|---|
| list-numbered, sort-numeric, binary, heading-1 | Owner: Lucide's 1 wherever there is a 1. A flat flag, the stem and a foot centred under the stem (`data-ends="keep"`): flag 1.5 and foot 3 at 4 tall (list-numbered M3 2.5H4.5V6.5 with foot 3–6; sort-numeric's under its 0; binary's two, its pre-round-10 slab restored), heading-1 M11 6.5H12.5V12.5 with foot 11–14. |
| list-numbered, superscript, subscript, heading-2 | Owner: the 2 like Lucide's, its bottom slightly wider than its top in both styles. A round bowl (r 1.25 at 4 tall, r 1.5 at 6 tall) from −137° over the top to its right side, a neck curving to the base's left corner, a base about 10% wider than the bowl and reaching further right (superscript 11–13.75 under a 10.75–13.25 bowl). `data-ends="keep"`, so the filled weight keeps the base's ratio to the bowl. list-numbered's 2 moves to 9.5–13.5 under the 1 (2.5–6.5). |
| sort-alpha | Owner: the Z's ends were unequal when filled. The Z keeps its ends (`data-ends="keep"`), so both bars grow with their corners. |
| umbrella | Owner: still wrong when filled. The ribs run from the apex to the bottom edge (one knockout path, no outline-only top), so both ends run out square; the canopy fills as three panels. |
| globe, globe-off | Owner: the meridians should run through the ends like Fluent's. The lens is two open arcs ending at the poles, so the meridians cut through the ring at top and bottom; globe-off's lower lens is split at the pole the same way. |
| smile, meh, frown, square-smile, smile-plus | Owner: the face sat half a pixel high. Eyes ⌀1.5 at 5.75, 6.5 / 10.25, 6.5 over the mouth's corners (smile M5.75 9.5A2.5 2.5 0 0 0 10.25 9.5; meh M5.75 10.5H10.25; frown M5.75 10.25A3.25 3.25 0 0 1 10.25 10.25; square-smile eyes at 6.5, mouth corners at 9.75); smile-plus at its 0.75 scale (eyes 4.75 / 8.25 at 5.25, mouth corners 7.75). |
| battery-medium, battery-low | Owner: bars equally spaced with equal margins. Bars at 4 / 6.5 (pitch 2.5; left, gap, top and bottom margins all 2.5 − line); battery-low's bar at 4. battery-full keeps 4.5 / 7 / 9.5 (three bars can't be exactly even on the grid; a cell construction is the alternative). |
| bell-plus | Owner: centre the plus. The 4px + at 8, 7 (M8 5V9M6 7H10); body and clapper share data-part="bell". |
| panel-bottom-open, panel-bottom-close | Owner: the arrow wasn't centred. The 2-leg chevron centred on x 8 (M6 7.5L8 5.5L10 7.5), legs on the half-lattice, data-angles="free"; the top-panel flips follow. |
| eraser | Owner: align with the bottom line. The lower corner is a plain join at 6.5, 13.5 on the base line's start (the r 0.5 fillet lifted it 0.21). |
| blur | Owner: horizontal, evenly spaced lines. Lines at y 5, 8, 11 from the centre line to the ring, 3 apart and 3 from the ring's top and bottom (whole pixels; the crisp 4.5 / 7.5 / 10.5 set gives uneven end pockets). |
| plane | Owner: the window as a row of dots. Three ⌀1.5 windows at 6.25, 8.75, 11.25 on y 7.75 (holes when filled); the fuselage is 5.5–10 with an r 2.25 nose so they fit; the fin moved up 0.5. |
| gem | Fix filled. The girdle and crown facets are gaps run out through the silhouette; the pavilion facets are outline-only, so no filled cut ends inside the fill. |
| mail-dot | Owner: the negative space hit the dot. The flap is an outline line; filled, a gap ends inside the dot's halo ring, so it merges with the halo and never touches the dot. |
| calendar-off | Owner: small pocket above the slash. The left peg stops on the top edge (M5.5 2V3.5), so the space beside the slash is an open wedge. |
| calendar-search | Fix filled. The body's cut round the lens leaves through the header line (as calendar-clock's), removing the hooked strip of fill. |
| bug-off | Owner: legs in the outline but not the filled. All six legs show in both styles (bug's legs; the body fills, parted from the slash). |
| graduation-cap | Owner: the tassel line poked through the board. It starts on the board's corner centre-line (13.5, 7.366). |
| file-pdf | Owner: stroke error at the triangle's foot. The page ends on the fold's base line in both styles; the filled page's lower strip moves with the fold line (data-shift). |
| bot | Owner: the other bots' faces aren't filled. The face, eyes and mouth stay lines and the antenna (bot's accessory) fills, as the other bots fill their hats. |
| document-check, file-code, file-export, file-upload | Owner: marks not centred. The page's free interior centres on 8, 10.25: document-check's 1.5 / 3 check exactly there; file-code's chevrons centred (off the lattice); file-export's arrow centred on x (6 to 10 at y 10); file-upload's arrow with download's 3.5 shaft, centred on y, 0.5 left on x (the recorded convention). |
| file-video | Owner: the play was too big. desktop-play's 4 × 5 play, centred at 10.25 below the fold. |
| file-question | Owner: the ? was wrong. chat-question's ? one size down with its stem restored, ⌀1.5 dot 2.25 below, at x 6.5 like file-warning's !. |
| file-audio | Owner: the note looked wrong. A solid r 1.5 head, a stem on its right edge and a shallow flag (slope 0.25), as Fluent's and Phosphor's. |
| file-zip, folder-zip | Owner: the pull overlapped the teeth. The pull stands a detail gap below the teeth; file-zip keeps two teeth to make room; folder-zip's four teeth are unchanged and its pull hangs 1.5 below the folder. |
| form | Owner: the lines weren't evenly spaced from the page edges. Margins of 3 on the top, left and right; lines 2 apart (M5.5 5.5H8.5M5.5 7.5H8.5M5.5 9.5H7), clear of the pen. |
| divide | Replace toward Lucide: line M2.5 7.5H13.5, ⌀2 dots at 8, 3 and 8, 12. Follow-up (owner, 2026-10-11: line still too long, didn't read as ÷): bar 3.5–12.5, ⌀2.5 dots at 3.75 / 11.25 (`data-dot="free"`). |
| fingerprint | Replace toward Phosphor: concentric tops (r 1.25 / 3.75 / 6.25 about 8, 8), lower ends on arcs about a point to the left, breaks as Phosphor's; three ridges at the approved 2.5 pitch (Phosphor's 2 fails the filled gap). |
| gavel | Replace toward Phosphor: a hollow block between two round-ended end bars, an outlined handle; filled, the parts are solid and the walls gaps. |
| gift-card | Replace toward Fluent: ribbons at x 6.5 and y 7.5, a bow of two r 1 loops above the crossing and two 45° tails below. |
| hand-wave | Replace toward Phosphor (the owner liked its hand lines): Phosphor's tilted hand, four digits on a round palm, finger lines ending in the palm, a thumb crease, two wave arcs. |
| kanban | Replace toward Phosphor: three columns from one top edge at different heights, cards in the outer columns; filled, separate solid cards. |
| paint-roller | Replace toward Lucide: a 9 × 3 roller, Lucide's handle path, a 3 × 4 grip under it. |
| switch-camera | Replace toward Lucide: the frame broken into two chasing halves with chevrons, a lens in the centre; filled, the lens fills. |
| table, table-cells-merge, table-cells-split | Owner: wider like Phosphor. Landscape 12 × 9 frame, three equal rows, a narrow first column; merge and split (toward Fluent) share the frame: merge a header strip and a ↔ across the body, split a header divider and a floating bar. |


## Owner review round 12, 2026-10-12

The review page reopened every icon that draws a letter, digit or sign (53, in the type audit's tiers) and divide, and
added a side-by-side view of the whole filled set. 57 decisions: 53 approvals (the type set, divide, chat, chat-add,
dismiss) and four replacements. No notes on the set as a whole.

| name | change |
|---|---|
| at | Fluent mention (owner: the a too big, the filled negative space too small). The a is an r 2 bowl at 8, 8 (was r 3; 0.39 of the ring's width, Fluent's ratio) with its stem on the bowl's right side from 6, and the tail an r 2 hook to 14, 9 before the ring (M10 6V9A2 2 0 0 0 14 9V8A6 6 0 1 0 11 13.196). Every pocket is 2.88 in the outline and 2.5 filled (were 1.88 and 1.5). Round 12b: the owner kept this a (the same r 2 a as case-lower, case-sensitive and whole-word) over an r 2.5 one. |
| quote | Fluent text_quote's tail (owner: the curve rose too steeply from the round part; keep opening marks). Opening marks ("66"), Fluent's closing mark turned 180°: the ⌀4 disc (r 1.438 traced and filled, `data-dot="free"`) at 5, 10 and 11, 10, the tail leaving the disc's left side straight up and bending gently to its end 1.06 right of the disc's centre (C+0 −2.115, +0.423 −3.808, +2.115 −5.5: round 12b, owner "the tails are maybe a bit too long", the curve scaled to 5.5/6.5 so it keeps its shape). Ink 10 × 8.06, centred. |
| sort-alpha | Fluent text_sort_ascending (owner: the A too short). The A is 5 tall and 5 wide (2–7, apex 4.5, 2 with the r 0.5 fillet; crossbar 2.75–6.25 at 5.5), Fluent's larger A over a 4 × 4 Z; the gap to the Z is tight (1.42). The arrow runs 2.5–13.5 with the 2.5 head. |
| strikethrough | Phosphor text-strikethrough (owner: the lower half very slightly wider, like the B). The upper bowl keeps rx 3.5; the lower is rx 4 (4–12), both ry 2.75, meeting at 8, 8 with horizontal tangents; the tail ends at 30° on the wider bowl (4.536, 12.125). |

## Optical size pass, 2026-10-12

Owner: "work on refining the optical size and balance of all the icons, to make sure they all are appropriately and
accurately sized". All 729 drawings (79 turns and mirrors excluded) were measured: ink box against the keyline, and the
apparent size (the square root of the ink's convex-hull area, `--audit`) against the median of icons with the same
keyline and fill type. The medians agree (square solids 11.47, circle solids 11.69: rings 2% larger, as designed). Every
candidate more than 8% off its class was then judged at 16 / 24 / 32 beside the four keyline references (info, square-plus,
document, folder).

Most measured outliers are right by nature and stay: narrow or pointed objects (mic, the B, send, navigation, pencil),
open line glyphs (minus, chevrons, git-commit), the "-off" icons (the slash reaches the corners) and sparse spreads (atom,
scissors). Dense icons (bot hats, people) read in balance at their size.

**The rule found:** a closed rectangular frame never exceeds the shared frame of its keyline, because a rectangle that
fills its box carries far more mass than a free silhouette of the same width. Square frames are square-plus's 2.5–13.5
(hull area 140); horizontal frames are at most 13 × 9 (vault, mail) or 12 × 10 (id-card), folder's area (134); vertical
frames are the page (9 × 12) or the phone (9 × 13, 136). Free silhouettes (cloud, tree, trophy) may still reach the
13 × 13 keyline.

| name | change | hull area |
|---|---|---|
| server | Two units 11 × 4.5 (2.5–7 and 9–13.5, r 1.5) a detail 0.875 apart, lights at 4.75 / 11.25; was 12 × 4.5 on 2–14. | 169 → 144 |
| server-cog | server's units; the gear at 11.5, 11.5 (0.5 left and down so it clears the top unit and stays centred), the lower unit's bite concentric with it. The filled hub's sliver report predates the change. | 164 → 144 |
| piano | The frame 2.5–13.5 (r 2); the black keys unchanged, so the side pockets match the middle one (0.875). | 165 → 140 |
| film | The frame 2.5–13.5; the sprocket strips 2.5 wide (were 3), the holes at 5 / 8 / 11. | 165 → 140 |
| bandage | Both bands 0.5 shorter at each end (end centres 4.75 and 11.25, r 2.25 unchanged): ink 12.12 square. | 164 → 139 |
| keyboard, keyboard-off | id-card's 12 × 10 frame (2–14); keys on a 2.5 pitch (4.25 … 11.75), the lower row at 5.25 / 8 / 10.75 so it clears the sides by a standard gap. | 150 → 139 |
| gif, markdown | vault's 13 × 9 frame (3.5–12.5); the letters unchanged (approved in round 12), now a detail 0.875 from the frame. The G's arc carries its top point so the lint measures that gap exactly. markdown's arrow ends at 10 (a tip at 10.5 cannot sit on the 45° lattice). | 150 → 136 |
| pipeline | 12 wide (caps at 2–5 and 11–14), the height unchanged. | 152 → 141 |
| chess-rook | 12 tall (2–14): the crown 0.5 lower, the base 0.5 higher; the body tapers over 4 (was 5). | 148 → 137 |

Kept, with reasons: **qr-code** (168) cannot lose a pixel: on an 11 frame the finders' cores fall off the grid or sit 0.44
from their rings. **calculator** (150) at 12 tall cannot keep its larger display and six keys on the gap scale (every
arrangement misses by 0.04–0.3). **gamepad** (148) cannot narrow without leaving the 45° lattice, and a shorter top leaves
it 0.25 low. **diamond** reads smaller than the square frame, but its vertices are already the furthest lattice points in
the drawing area. **breakpoint** (r 4.5) stays smaller than ellipse (r 6), which is the plain circle. **settings** sits a
pixel inside its keyline, as dense shapes do.

## Owner review round 12d, 2026-10-12

The 43 icons redrawn in round 11 were reviewed: 30 approved, 13 changed. Every icon below is in review again on the
review page (version 54) with the 11 from the optical size pass.

| name | change |
|---|---|
| bug-off | Owner: the middle leg on the right is incorrect for filled. Filled: the gap above the slash left a spur of fill under the right middle leg's root, so the leg looked bent. The spur is cut away flush with the leg's centre-line; the outline is unchanged. |
| file-audio | Owner: music note still looks incorrect, look at lucides music note. Lucide's note: an open ring head at the page's lower-left, overhanging the edge like file-search's lens, a tall stem and Lucide's sloped flag. The page is cut round the head. |
| file-question | Owner: question mark top part seems too small. The ? hook is 20% larger (r 0.9, was 0.75). It is as large as fits between the fold and the page's left edge with the dot still 2.25 below. |
| file-zip | Owner: put the other tooth back. The third tooth is back (your round-10 drawing). The pull is 1 shorter so it clears the teeth by a detail gap instead of overlapping them. |
| folder-zip | Owner: i like the before, just the zipper itself overlapped the teeth just slightly. Back to the earlier drawing you liked; only the pull is 1 shorter, so it clears the teeth by a detail gap. |
| form | Owner: are the lines too close together now?. Yes, they were at the closest gap the set allows. The lines are 3 apart again (5.5, 8.5, 11.5), the standard spacing, with the 3 margins kept; the last line is a little shorter so it clears the pen. |
| gavel | Owner: the handle part is too small/short. Phosphor's proportions: the handle is 15% longer and the head's end bars shorter, so it still fits the keyline. |
| gem | Owner: copy fluent exactly. Fluent's premium: a flat top, a wide girdle at 6.5, facets from the top to the girdle and down to the tip. Filled follows Fluent's filled cut: the same drawing at the heavier weight, with the facets open. |
| globe | Owner: copy fluent exactly for both filled and monoline. Fluent's globe: latitudes at 5.5 and 10.5, and a wider lens through both poles (2.5 from centre at the equator). Filled: a solid disc with the lens and latitudes knocked out, as Fluent's. |
| hand-wave | Owner: (fix filled: visual and stroke error). Filled: each fingertip touched the next finger's edge, so the tips merged into a mitten. The separators now continue 1.6 up each shared edge, so the fingers part like Phosphor's. The outline is unchanged. |
| kanban | Owner: the column widths should be the same. Three equal 4-wide columns. The icon sits 0.5 right of centre so every column edge stays sharp at 1×. |
| umbrella | Owner: base the design off of what the globe icon doesn for the lines. The canopy is the globe's top half, so its ribs are now the globe's lens: from the tip down to 5.5 and 10.5. |
| globe-off | Follows the new globe (lens and latitudes), split at the slash as before. |

Construction notes: bug-off's filled cut is `M10.5 8.5H12.5V10.5Z` (inside the slash gap, so the main body is untouched).
hand-wave's cuts are filled-only `gap`s from each valley 1.6 along the shared edge (the fingertip semicircles are tangent
to the next finger's edge, so their strokes merge for the whole tip). file-audio's page fill follows an r 3.75 overlap cut
round the r 1.5 head with r 0.75 fillets at both convex points; the stem and flag are ink with a `halo`. gavel: head centre
8.25, 7.25, end bars 4.24 long (b 1.5), the handle's end unchanged at 3, 12.5. gem: vertices 4–12 at 2.5, girdle 2–14 at
6.5, tip 8, 13.885, r 0.5 fillets; no filled roles, so it fills by weight (Fluent's premium filled cut). globe: lens arcs
r 8.45 through 8, 2 and 8, 14 (centres 13.95, 8 and 2.05, 8); globe-off's lens meets the slash at 5.793 and 10.207 and the
5.5 latitude at 10.122. Kept: globe-off's filled lower lens cell reads as an island in the sliver check at 16 only (the same
cell as globe's, closed here because the 10.5 latitude stops at the slash); the zips keep the teeth slivers of the drawing
the owner preferred.

## Owner review round 12e, 2026-10-12

24 decisions: 15 approved (bandage, chess-rook, file-audio, file-question, film, gavel, gem, gif, kanban, keyboard, markdown,
piano, pipeline, server, server-cog), 9 changed. The page had first gone out (version 54) showing 13 redraws as their old
drawings, because its data was built before the components were regenerated; version 55 fixed it and the data script now
refuses to build from a stale generation.

| name | change |
|---|---|
| bug-off | Owner: "the stroke is still poking through on the leg side into the negative space". Filled: the right middle leg now starts clear of the slash's gap (filled-only copy of the legs, as the other off icons do), and the cut under its root no longer leaves a hairline at 32. The outline is unchanged. |
| file-zip | Owner: "the zipper part should be touching the teeth". The pull's top now touches the last tooth (they meet edge to edge). |
| folder-zip | Owner: "the zipper part should be touching the teeth". The pull's top now touches the last tooth (they meet edge to edge). |
| form | Owner: "the bottom stroke is too close to the bottom". Margins of 3 on all four sides now: the lines are 2.5 apart (5.5, 8, 10.5), between the earlier 2 and 3. |
| globe | Owner: "still wrong, copy fluent". The difference was the meridian: Fluent's is an ellipse that meets the ring smoothly at the poles (rounded top when filled); mine was two pointed arcs. Now the ellipse, 2.5 from centre. |
| globe-off | Owner: "(replace toward Fluent)". Follows the globe's ellipse meridian. |
| umbrella | Owner: "(fix filled: negative space and visual error)". The ribs are the globe's new ellipse, so they meet the canopy's tip smoothly; the notch and slivers at the tip are gone. |
| hand-wave | Owner: "copy phosphors filled, or find out what the current area hand icon looks like". Filled now follows Area's hand: each finger and the thumb a strip with a round tip at the outline's height, parted by U notches that end where the outline's finger lines end, so the fingers stand apart like Phosphor's. The outline is unchanged. |
| keyboard-off | Owner: "can you add more dots back in". One more key, lower left in line with the top row's first key. keyboard's other keys sit too close to the slash (0.63, under the set's smallest gap) or would merge into its filled gap. |
| file-audio | Owner: "should the filled music note also be filled on the bottom?". Yes: filled means more ink, so the head is solid in the filled variant (Fluent and Phosphor fill it too). The outline keeps Lucide's open head. |

Construction notes: globe's lens is the ellipse `A2.5 6` through the poles (Fluent's meridian, tangent to the ring at the
poles); umbrella's ribs are its top half; globe-off's lens meets the slash at 5.692 and 10.308 and the 5.5 latitude at
10.273. hand-wave's filled `fill` follows hand.svg: strips 0.5625 wide (the 8.25 span less three 2-wide U notches) with
r 0.281 tips at the outline's tip heights, notch bottoms 0.5 below the finger lines' ends, the thumb's notch 0.5 below
its valley; finger lines are outline-only, the crease stays a knockout. bug-off's legs are outline-only plus a filled-only
`stroke` copy whose right middle leg starts at 11.5; its spur cut is `M9.5 8.5H12.5V11.5Z` (inside the slash gap at every
size). The zips' pull tops sit 0.0125 into the last tooth at 16px (a join; the lint reads an exact touch as a 0 gap).
form's middle line sits on a whole pixel (8), slightly soft at 1×, for equal margins.

## Owner review round 12f, 2026-10-12

10 decisions: file-zip, folder-zip and form approved; 7 changed.

| name | change |
|---|---|
| bug-off | Owner: "still peaking a bit into the negative space". Filled: the right middle leg now starts at 11.75, where its round end clears the slash's gap at every size (it reached 0.13 into it). |
| file-audio | Owner: "note visual negative space error outline". Filled: the note is no longer ink with a cut round it (which read as an outline). It sits wholly on the page as a cutout, like the clouds' arrows: a solid head, the stem and the flag knocked out, the page whole. The outline keeps Lucide's overhanging note. |
| globe | Owner: "closer but not quite". Measured against Fluent's meridian scaled to Area's ring: it runs nearly straight through the middle and turns into the poles with fuller shoulders than an ellipse. Now that curve. |
| globe-off | Owner: "(replace toward Fluent)". Follows the globe's new meridian, split at the slash as before. |
| hand-wave | Owner: "thumb negative space looks off". Filled: the thumb crease now starts from the centre of the notch between the index finger and the thumb (it began half a unit off to one side, leaving a jog). |
| keyboard-off | Owner: "more dots?". A fourth key, row 2 right (11.5, the closest spot clear of the slash and its filled gap). keyboard's own positions there sit too close to the slash. |
| umbrella | Owner: "(replace toward Fluent)". Fluent's umbrella: a slightly flattened dome with a three-scallop hem, no ribs, the handle hooking left. Filled: the canopy is solid. |

Construction notes: globe's meridian halves are cubics `M8 2C5.35 2 5.5 7.4 5.5 8C5.5 8.6 5.35 14 8 14` and the mirror,
fitted to Fluent's globe_16 meridian scaled by 6 / 5.5 (offsets 2.29 at y 4.73, 2.05 at 4.03, 2.5 at the equator; the
extreme kept on 5.5 for a crisp vertical). globe-off splits them by de Casteljau at the slash (5.618, 10.382) and the 5.5
latitude (10.366). umbrella: dome `A6 5.5` from 2 to 14 at 7.5, three r 2.5 scallops (dips at 6 and 10, peaks 1 higher),
the stem from the middle scallop's peak 8, 6.5 to 12.5 and an r 1.5 hook to 5, 12.5. file-audio's filled note is `inset`:
a disc of ink radius 1 at 6.25, 11.25, the stem at 6.75 to 8.75 and the flag to 8.75, 9.75, at least a line weight from
the page's edges and the fold.

## Owner review round 12g, 2026-10-12

umbrella approved (Fluent's); 6 changed.

| name | change |
|---|---|
| bug-off | Owner: "still a small notch/gap between the negative space and the leg stroke, its not cohesive.". Filled: the right middle leg is now part of the solid, so the slash's gap cuts it flush: no round end and no strip of fill between the gap and the leg. |
| file-audio | Owner: "revert back to the other design with the larger note". Back to the larger overhanging note: in the filled variant the head is solid, the note is ink, and the page is cut round it. |
| globe | Owner: "almost but not quite, the middle lines are too round. the ends should be pointed sharp, can you literally trace the ink of the fluent version.". Traced: the meridians follow the midline of Fluent's ink scaled to Area's ring. They run nearly straight, then merge into the ring 0.9 either side of each pole, so the cells beside them end in sharp points and the middle cell has Fluent's domed top. The latitudes stay at 5.5 and 10.5 (Fluent's scaled would be 5.27 and 10.73, soft at 1×). |
| globe-off | Owner: "(replace toward Fluent)". Follows the traced meridians, split at the slash. |
| hand-wave | Owner: "negative space still off". Filled now follows Phosphor's: the whole hand is solid and each finger is parted by a line-weight slot that opens between the fingertips and ends where the outline's finger line ends; the thumb's slot runs into the crease. |
| keyboard-off | Owner: "can you add all the dots? or most of them?". The outline now has all seven of keyboard's keys and its full space bar, with the slash crossing them flat as it crosses other base icons (a recorded exception for keys beside the slash). Filled keeps the keys clear of the slash and its gap (three) and the bar up to the slash. |

Construction notes: globe's meridian halves are cubics from the ring point at 5° (7.477, 2.023), leaving along the ring's
tangent, to the equator at 5.262: `M7.477 2.023C6.78 2.084 5.262 4.3 5.262 8` and its mirrors, fitted to the midline of
Fluent globe_16's meridian ink scaled by 6 / 5.5 (largest error 0.03). keyboard-off: `data-gap="slash"` (new, generator)
skips the gap check between the shared slash and the base icon's parts; outline keys are outline-only, filled keys are
filled-only round cuts. hand-wave's filled slots are `inset`s along each shared finger edge from outside the tips to the
finger lines' ends (and into the crease), so the cut is one line weight at every size. bug-off's right middle leg is a
filled-only `fill` line inside the masked solid; the sliver check reads that leg as a thin strip of fill (a false
positive).

## Owner review round 12h, 2026-10-12

bug-off approved; 5 changed.

| name | change |
|---|---|
| globe | Owner: "still not right, sent images in chat (the filled meridians cut the bottom; trace Fluent's ink exactly)". Fluent's globe_16 ink, exactly: its regular path is the outline and its filled path the filled variant (converted to absolute commands, geometry unchanged). It keeps Fluent's size (ink 12, the r 5.5 ring), so it reads a little smaller than Area's r 6 rings, and as solid ink it scales whole rather than thinning on the size curve above 16. |
| globe-off | Owner: "(replace toward Fluent)". The traced globe whole under the shared slash; filled, Fluent's filled ink parted from the slash, with the island of the middle cell beside the slash's gap cut away. |
| hand-wave | Owner: "(replace toward Fluent)". Back to the Fluent construction: Area's hand moved under bell-ring's two motion arcs (the drawing before round 11), with hand's filled finger columns. |
| keyboard-off | Owner: "add the dots to filled too?". All seven keys are in the filled variant now, under the slash as in the outline. |
| file-audio | Owner: "sent picture in chat (the head cut into a crescent)". The head is a front part now, so the cut round the stem can no longer bite it: a round solid head. |

Recorded exception: globe and globe-off are Fluent's ink as solid shapes (`fill="currentColor" stroke="none"`), the
owner's explicit instruction ("the fluent globe ink should be exactly traced and replicated"). They don't follow the size
curve and keep Fluent's 12 ink. `abs-path.py` (2026-10-12 review folder) converts a path to absolute commands. globe-off's
filled cut `M7.5 6H10.5V9Z` lies inside the slash gap at every size and removes the middle cell's island.


## Accessible name and right-to-left, 2026-10-12

Owner: "continue working with your recs" (production gap 3 in `docs/research/icon-review/2026-10-10/README.md`).
Evidence, read at pinned sources: `@fluentui/react-icons@2.0.344` (microsoft/fluentui-system-icons@f126001,
`src/core/useBaseIconState.ts` 54–64, `scripts/convert.utils.js` 149), `lucide-react@1.55.0` (`Icon.ts` 67,
`hasA11yProp.ts` 9), `@phosphor-icons/react@2.1.10` (`IconBase.tsx` 39–43), `@heroicons/react@2.2.0`,
`@primer/octicons-react@19.40.0` (`renderOcticon.tsx` 47–58), Google's Material icons guide
(google/material-design-icons@6eed39a `index.html` 423–525), Material's m2 Bidirectionality page and Apple's HIG
"Right to left".

- **Decorative by default.** Every library hides an icon from assistive technology unless it is named. Area's
  components render `aria-hidden="true"` and `focusable="false"` as before.
- **Named: `title`, `aria-label` or `aria-labelledby`.** Any of them drops `aria-hidden` and adds `role="img"`
  (Fluent and Octicons; Lucide drops `aria-hidden` without a role). `title` becomes `aria-label` as in Fluent: no
  `<title>` element, which would show the browser's own tooltip (PRODUCT_UI: Area Tooltips, never native titles).
  Heroicons keeps `aria-hidden` on a titled icon, which hides the name; not copied. `focusable` is `true` only with
  a `tabIndex` of 0 or more (Octicons). Props passed through come last and win.
- **Right-to-left: the library knows which icons mirror.** Fluent marks each icon (`directionType: mirror`) and
  flips those; Phosphor only has a caller's `mirrored`; Lucide, Heroicons and Octicons have neither. Area marks its
  icons in `assets/area-icons-pilot/rtl.json` and gives the root `data-area-rtl="mirror"`; `[data-area-rtl="mirror"]:dir(rtl) { scale: -1 1; }`
  flips them (in `@area/styles` base, and `@area/icons/rtl.css` for use without it). `:dir()` reads the inherited
  direction, so there is no context to provide and the server renders the same markup (Fluent and Phosphor read a
  React context, wrong on the server unless it is provided there too). `scale`, not `transform`, so a caller's
  transform still applies. `mirrored` overrides: `true` flips inline (`scale: -1 1`), `false` never flips.
- **Which icons mirror (23):** a concept tied to reading direction whose counterpart Fluent or Material mirrors,
  and its family: reply, reply-all, forward, send, undo, redo, indent, outdent, list-bullet, list-plus, list-minus,
  list-x, list-collapse, list-tree, table-of-contents, text-wrap, star-half, backspace, chevron-first,
  chevron-last, debug-step-over, trending-up, trending-down. Each reason is in `rtl.json`.
- **Never mirrored:** names of a literal direction (arrow-left, chevron-right, panel-left, text-align-left: Fluent's
  React icons don't flip them and Apple keeps controls that "refer to an actual direction"; the caller picks the
  icon by meaning), circular arrows and clocks (rotate, sync, repeat, history: "clocks still turn clockwise", m2),
  slashes, checkmarks, letters and digits (list-numbered, list-checklist: Fluent's `unique`; the question mark
  mirrors in Arabic and Farsi but not Hebrew, so help stays), media transport (tape direction, m2) and objects.
  Fluent also flips arrow_up, calendar and folder_open because of its own drawings' details; Area's don't have them.
  Symmetric drawings (import, list, screen-share, sort's paired arrows) would not change.
- **Checks:** `npm test -w @area/icons`: decorative and named output, every component's `data-area-rtl` against
  the metadata, `mirrored` both ways, and the CSS rule.

## Keywords and names, 2026-10-12

Production gap 4. `@area/icons/meta` and `icons.json` gain `keywords` and `names` (`lucide`, `phosphor`, `fluent`,
`material`), and `rtl`. Built by `apps/docs/scripts/icon-keywords.mjs` into `assets/area-icons-pilot/keywords.json`
(committed, so the generator needs no network); sources pinned in the file: `lucide-static@1.55.0` (tags for 1,877
icons), `@phosphor-icons/core@2.1.1` (1,512), `@fluentui/svg-icons` (names) and `@material-symbols/metadata@0.48.0`
(names only; no tags published).

- **Names:** the counterpart each drawing was compared with (`docs/research/icon-audit/area-map.json`, 597 icons; every icon since 2026-10-14),
  else the library's icon of the same name, or of the name with a word swapped for the library's word. The swaps
  are measured from the map (person→user 6 times, add→plus 9, chat→message 5, remove→minus 7, off→slash 7 …) and
  listed in `keywords-area.json` `$words`. Material has no map: its name is the first of the Area, Fluent or Lucide
  names it publishes. Coverage: Lucide 711, Fluent 559, Phosphor 530, Material 249 of 808.
- **Keywords:** the counterparts' Lucide and Phosphor tags and their names' words, the concept the component demos
  label it with ("find people" for person-search), the name with its words swapped ("user search"), and Area's own
  words for the 36 drawings no library has (the bot personas, sparkle composites, padding, sides, token …). A tag
  that is another icon's name in Area or any library is dropped ("redo" on undo, "target" on add); `$drop` removes
  the few tags that name a different concept (Lucide's plus carries its crosshair words; Phosphor's list tags reach
  menu) or misspell one.
- **The app's Icons search** reads keywords and names with the name (`apps/desktop/src/pages/icons.tsx`); the
  Inspector lists them under Search.
- Not done: Material Symbols' own tags (only on fonts.google.com, not in a package) and a ranking (the app's search
  filters).
- **Map completed, 2026-10-14:** the 211 icons drawn after the 2026-10-02 audit had no entry in `area-map.json`, so
  their names came only from the same-name fallback (Lucide `toggle-left`, `user-x`, `message-square-off` found
  nothing). Each now has its counterparts, matched by meaning under the audit's rules (a modifier counts only when the
  library has it; a variant follows its base's mapping; Lucide's canonical name over its aliases; every name checked
  to exist): 211 entries, 723 names. Coverage: Lucide 747, Fluent 644, Phosphor 585, Material 255 of 808. Three old
  entries corrected: arrow-right-to-line's Fluent is `arrow_import` (`arrow_export_ltr` leaves the line, now
  arrow-right-from-line's), sort-ascending / -descending take `arrow_sort_up_lines` / `arrow_sort_down_lines` (the
  A–Z `text_sort_ascending` is sort-alpha's). A name may stand for two icons when both drawings are that concept
  (`arrow_import`: import and arrow-right-to-line; `text-align-justify`: list and text-align-justify). Two keywords a
  closer icon's new name took are kept as Area's own words: crown "premium" (gem is Fluent's premium), utensils
  "knife" (slice is Phosphor's knife). The rebuild read `lucide-static@1.57.0` (pinned in keywords.json; was 1.55.0), so a few Lucide tags moved
  with it.

## Pipeline moved to packages/icons, 2026-10-12

Migration step 2 (handoff, "Migration"): the drawings (`sources/`, with `batches.json`, `keywords*.json`,
`rtl.json`, `status/`, `explore/`), the generator (`scripts/generate.mjs`) and the tools (`find`, `geometry`,
`batch`, `sheet`, `refs`, `keywords`, `sf-render.swift`) and the categories (`src/categories.ts`) are in
`packages/icons`; the reference cache is `packages/icons/.cache/refs`. npm scripts keep their names (`icons:pilot`,
`icons:find` …; new `icons:refs`, `icons:keywords`).

- `@area/icons/meta` now also exports `categories` (curated order) and `batches` (id, title). The app's Icons tab and
  the component demos read `@area/icons`; only the Iconography demo still reads `apps/docs/src` (its Fluent
  comparison plates, production gap 9).
- The generator checks that every icon is in exactly one category (that check was in the docs build).
- Still written to `apps/docs/src` until the site is deleted: `pilot-icons.tsx` (the docs, the Iconography demo and
  the package test's oracle read it) and `pilot-explore.tsx`. The Fluent map (`apps/docs/scripts/gen-icons.mjs`,
  `assets/area-icons*`, the sprites) stays in the docs folder until it is retired.
- Research scripts in `docs/research/` keep the old paths as records of their day.

## 12px cuts, 2026-10-13

Production gap 5 (owner, 2026-10-13: "continue the icon work"; the plan in "Sizes" and the skill: a dense icon that
must read at 12px on 1× screens gets its own cut). Sheet: `docs/research/icon-review/2026-10-13/cuts12.png`
(`cuts12.mjs`: the 16px drawing at 12 as components drew it, the cut and Fluent's 12px regular, at 1× magnified 8×,
2× and actual size, light and dark).

- **Which icons (by use, measured):** every icon the app's gallery shows in a 12px slot, measured in headless Edge
  over all 925 tiles at type 13 compact (IntersectionObserver stubbed so every tile renders): Glyph's dismiss (Badge,
  Tag, Tag picker; no cut, see below), chevron-down (Split button, Toolbar, Panel sm), open (Link) and info (Toggletip sm); the icons
  demos pass into 12px slots: check, add, info, link, bell, arrow-right (Badge), globe (Tag), book (Citation).
- **Drawn (9), in `packages/icons/sources/12/`:** chevron-down, check, add, info, open, link, bell, arrow-up and
  globe; their turns and mirrors (chevron-left/right/up, arrow-down/left/right, alert-circle) turn the cut about
  6, 6. On Fluent's 12px grid: square frames 8 of ink (2.5–9.5 centre-lines, open's r 1.5), arrows and chevrons on
  the diagonal lattice through pixel centres, gaps of at least 1px.
- **Crisp over centred (the 2026-10-02 rule, "crisp at 1× outweighs centring"):** a 1px line centred on 6 falls
  between two pixels and shows as a grey 2px bar; Fluent's own 12px cuts do this (add, info's stem, arrow-up's
  shaft, link's bar). Area's add, arrow-up, info and link put that line on 5.5, so the glyph sits 0.5 up or left of
  the box's centre and every line is one dark pixel. info's ring is r 4 (ink 9) to stay concentric with its stem;
  its dot is r 0.5, one pixel, 1px from the ring and the stem.
- **Not cut:** dismiss and book (the 16px drawing at 12 already renders the same pixels: dismiss's diagonals pass
  through pixel centres either way), help (a "?" with a readable hook
  doesn't fit inside a 9px ring; the scaled drawing reads better), and every filled variant (filled at 12 scales the
  16px drawing).
- **globe** is Fluent's globe_12_regular ink exactly, as the 16px globe is Fluent's (owner's exception, 2026-10-12).
- **Line:** the size curve's line at 12, `(12 / 16)^0.45` = 0.8786 of the 16px line (0.99px at 1.125), in the cut's
  own units, so one unit is a pixel at 12.
- **@area/icons:** an icon with a cut draws it when `size` is 12 (viewBox `0 0 12 12`, `sw12`); every other size, and
  `size` left out, draws the 16px drawing. Metadata `cuts: [12]`; raw SVGs now also at `svg/12` (the cut, or the
  16px drawing at 12). The app's Icons Inspector shows "At 12px: Own drawing" and the set's count of cuts (16).
- **Glyph:** `size={12}` names the xs icon slot (`--area-icon-xs`: 12px below type 16, 16px at 16). A glyph with a cut
  carries both drawings in one 16 viewBox (the cut scaled 4/3) and base.css shows one by opacity: the cut where
  `--_glyph-cut` (a component's) or the type axis's new `--area-type-icon-xs-cut` (1 below type 16) is 1. The 16px
  drawing's 12px line factor follows the same switch, so at type 16 a size-12 glyph now draws the 16px line in its
  16px slot (it drew the heavier 12px line there before). Panel's md chevron is size 12 in a 16px slot, so
  `panel.css` sets `--_glyph-cut: 0` there and the xs value for sm.
- **Visible change in components:** Link's external mark, Split button and Toolbar
  chevrons, Panel sm chevron and Toggletip sm's info draw the cuts below type 16. Panel md's chevron now draws the
  16px line (was the 12px line).
- **Checks:** `npm test -w @area/icons` (9; new: cuts at 12, turns, raw SVGs at 12, filled at 12 scales), React
  `link.test.mjs` (the two drawings and the CSS switch), tokens 24,254, contracts, manifest parity, typecheck; the app
  in the browser preview: Link's external mark shows the cut at type 13 (line 0.92px, type 13's icon weight) and the
  16px drawing at type 16 (1.29px); the Icons grid at 12 draws the cuts.
- **Owner, 2026-10-13: "go with your recommendations"** → the 9 cuts approved as drawn, and the demos use them.
- **@area/icons in an xs slot:** with the token line (no `weight`), `size={12}` means the xs icon slot as Glyph's does:
  an icon with a cut carries both drawings and `cutOpacity` shows the cut where the slot is 12 (inline opacity from
  `--_glyph-cut` / `--area-type-icon-xs-cut`, the cut when Area's styles are absent), and `sw` gives every icon's
  token line at 12 the same switch, so at type 16 a size-12 icon in its 16px slot draws the 16px line. A numeric
  `weight` is an explicit 12px icon: the cut alone in its 12 viewBox (the raw `svg/12` files).
- **Demos:** every Badge icon slot (check, info, add, link, arrow-right, dismiss) and Tag's globe pass `size={12}`;
  checked in the app: at type 13 the 8 Badge icons with cuts draw them (0.99px), at type 16 the 16px drawing at the
  16px line (1.29px). Citation's book stays as it was (no cut; the slot is a fixed 12 favicon box).

## 10px cuts, 2026-10-17

Owner, 2026-10-17: "go with 10px icons, draw the cuts", after the spacing pass showed Badge, Tag and Citation holding a
12px icon in Compact's 14px plate, 1px from its edge (review: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

- **The slot:** a mark's icon box is at most the plate less 4, the rule Badge's avatars and flags already followed: 12
  at every default size (20, 24 and sm's 16), 10 in Compact's 14 (type 12–14 at density 28). Badge, Tag and Citation
  set `--_icon: min(var(--area-icon-xs), h − 4)` and `--_glyph-cut10: max(0, sign(icon-xs − --_icon))`, 1 where the box
  is under 12. The dismiss and remove glyphs take the same box.
- **Drawn (8), in `packages/icons/sources/10/`:** every icon the app puts in a mark: add (a 6px + on 4.5), check (2 / 4
  arms, M2 5L4 7L8 3), arrow-up (a 7px shaft, 3px head legs; its turns are arrow-right, -left, -down), info (an r 3.5
  ring on 4.5, a 1.5 stem, the one-pixel dot 0.8 above it), link (two r 2 arcs and a bar on 4.5), dismiss (a 5px × on
  pixel centres, the ink Compact's × already had), globe (ring, lens meridian and equator, Fluent's construction; Fluent
  has no 10px globe) and book (two arched pages on a spine at 4.5, page edges on half pixels).
- **Rules, as the 12px cuts':** one unit is a pixel at 10; lines on half pixels where the shape allows, so the glyph sits
  0.5 up or left of centre (crisp at 1× over centred); 45° lines with x ± y whole; ink about two-thirds of the box for
  square shapes (add, check: 6.9), about four-fifths for rings and long shapes (info, link, arrow: 7.9), as the 16px
  keylines make rings and horizontal shapes larger. Line: the size curve's at 10, `(10 / 16)^0.45` = 0.8094 of the 16px
  line (0.91px at 1.125). The lint checks the 10 box, the source line and the quarter-pixel grid inside 0.5–9.5.
- **@area/icons:** `size={10}` draws the cut alone (viewBox `0 0 10 10`, `sw10`). At `size={12}` with the token line (the xs
  slot), an icon with a 10px cut carries it as a third drawing beside the 16px drawing and any 12px cut; `cut10Opacity`
  shows it where `--_glyph-cut10` is 1 and the others give way. Metadata `cuts: [10, 12]` (or `[10]`). Raw SVGs stay at
  12, 16, 20 and 24: the 10 is a component slot, not a file size.
- **Glyph:** `glyphCuts10`; at size 12 a glyph with one carries it (`data-area-glyph-cuts`), and base.css switches it in
  with `--_glyph-cut10`, its line 0.8094.
- **Checked:** icon lint (808), icons tests 11/11 (new: the 10px cut at size 10 and in the xs slot), React 477/477,
  contracts, tokens, typecheck; at Compact 13 every Badge, Tag and Citation icon shows its 10px cut in a 10px box 2 from
  the plate's edge (was 1), and at the default the 12px cut or the 16px drawing shows as before. 1× pixel sheet beside
  the old drawing squeezed into 10: the cuts are crisp where it was grey (add, check, arrow, ×, link); globe is dense
  but keeps its parts. Citation's demos now pass `size={12}` to the book, so it carries the cuts.
- **Not cut:** icons a product passes into a mark without a 10px cut scale their 12px cut or 16px drawing into the
  10px box, as icons without a 12px cut did at 12.

## Fluent map retired from the app, 2026-10-13

Production gap 9, the app's half (owner, 2026-10-13: "go with your recommendations and continue working").

- **Demos read `@area/icons`.** 13 demo modules imported 78 names from the archived `apps/docs/src/icons.tsx`; every
  one was already a pass-through to an Area drawing (`PlusIcon` → `PilotAddIcon` …), so the demos now import the
  package's own names (`AddIcon`, `ArrowRightIcon`, `MoreHorizontalIcon`, `PenToolIcon`, `VolumeIcon` …) and the
  snippets the app shows name icons that exist. Nothing renders differently; `PersonIcon`'s default 20 is written
  at its call sites (`size={20}`).
- **Copy and SVG export** (`CopyButton`, `standaloneSvg`) moved from the docs' icon browser to
  `apps/desktop/src/copy.tsx`; the export leaves out the drawing a size-12 icon hides (12px cuts).
- **The Iconography demos** (`demos/icons.tsx`: Area beside Fluent's cuts and filled references, the review cards)
  belong to the docs-only "Icon pilot" page, which the app never shows. They moved out of the app's registry into
  `content/registry-docs.tsx`, which the archived docs render reads, so the app bundles neither them nor the Fluent
  map: `apps/desktop/dist/app.js` 4.66 → 2.91 MB, no Fluent path data and no second copy of the icon set.
- **Left for the docs site's deletion (owner's call):** `apps/docs/scripts/gen-icons.mjs`, `icons.generated.mjs`, the
  Fluent cuts in `apps/docs/src/icons.tsx` and the Iconography demos. The research tools in `packages/icons/scripts`
  keep reading `@fluentui/svg-icons` as a reference library (find, batch, sheet, keywords), as they do Lucide.
- Found: the archived docs build fails on `main` since the type / density split (PR #75): `build.mjs` still reads the
  removed `ui` axis in four places. Not fixed here (archived; fixing means rewriting its axis pages).

## Versions, deprecation and credits, 2026-10-13

Production gap 6 without its licence (the owner's to choose). `@area/icons` is 0.1.0 with `CHANGELOG.md`; the policy is
in the package README, "Versions, deprecation and credits".

- **Semver:** major for removals, renames, incompatible props or metadata, and an approved icon moving back to review;
  minor for new or newly approved icons, cuts, props and fields; patch for refinements that keep meaning, keyline and
  box. Under 0.x reopened icons still move to `review`; 1.0 freezes the main entry (an approved icon is redrawn in place).
- **Deprecation:** a renamed icon stays one minor as a `@deprecated` alias with `deprecated: { by, since }`, removed at
  the next major; built with the first rename (the alias drawing check, `data-alias-of`, exists).
- **Credits:** `data-source="<library> <icon> …"` on a drawing or its 12px cut marks reproduced third-party ink; the
  generator puts `source: { library, names }` in the metadata and refuses a library with no section in
  `packages/icons/THIRD_PARTY_NOTICES.md` (shipped in the package). Today: globe and globe-off (Fluent's globe, MIT,
  `@fluentui/svg-icons` 1.1.341; copyright line read from microsoft/fluentui-system-icons' LICENSE). The app's
  Inspector shows "Ink from". Drawings that follow another library's construction (the many "Lucide x:" rows) are
  Area's own ink and carry no `source`.
- Licence (owner, 2026-10-14): MIT for Area's own drawings, `packages/icons/LICENSE`, `"license": "MIT"` and shipped
  in `files`; the root package stays private. MIT matches Fluent's, the only reproduced ink, so the package carries one
  licence kind.
- Last review (owner, 2026-10-14): grip, padding-side and sides approved as drawn (batch 4, Inspector), so all 808 are
  in the main entry and `@area/icons/review` is empty (the generator writes `export {}` for an empty entry).

## Optical outliers and 1× frames, 2026-10-14

Owner: "continue working, open an artifact if you want me to review or approve anything", then "i left my verdicts on
the page, apply them". Review page https://claude.ai/artifact/MZqhevHfrGVHhDANQLaKcA; record and tools in
`docs/research/icon-review/2026-10-14/`.

**Optical outliers (owner-approved).** The optical audit (`generate.mjs --check --audit`; median size 11.27, density
0.41) put three icons far from their peers:

| Icon | Construction | Audit |
|---|---|---|
| qr-code | square; three 4 × 4 finders (r 1) on half pixels (2.5 and 9.5), 1 × 1 solid centres (r 0.25), four 2 × 2 data modules (r 0.5) on whole pixels at 9 and 12, 1.94 from the finders (standard), so the aligned-gap exception is gone. Filled equals the outline | +15% → +6% size, +36% → +8% density |
| diamond | circle; half-diagonal 7 (edges one whole lattice step out), corners r 1.5 so the tips stay inside ⌀14 | −15% → −3% |
| gamepad | horizontal; body 13 × 9 from 3.5 (the top on a half pixel), lobes' outer round 2.379 so the 45° sides stay on the lattice, bridge and controls unchanged | +8% → +2% |

Kept: calculator (+9%, +16%), whose weight is the owner's larger display (2026-10-07).

**1× frames (owner chose "fix the frames"; both batches owner-approved 2026-10-14, no flags).** A stroke of the icon weight on a whole-pixel line smears
across two grey rows at 1× (2× hides it); a solid's edge is crisp on a whole pixel. `tools/frames.py` scores every
axis-aligned run of 2 or more and moves the drawing so long strokes land on half pixels:

- Batch 1 (68 icons): the whole icon moves half a pixel (dx, dy in 0 / ±0.5; an icon with a 45° line on the lattice
  takes only dx = dy, so its diagonals stay on it). The drawing is unchanged; some icons now sit 0.5 off centre, as
  Fluent's 16px add does (7.5). pentagon moved down, not up, so its apex stays in the drawing area.
- Batch 2 (171 icons and 3 aliases): parts that touch (centre-lines within 1.5) and `data-part` groups move as one
  piece; the largest piece (the frame) takes its best shift, every other piece its own best (keeping its 45° lines on
  the lattice), and each filled-only element follows the piece whose geometry it lies on. A move is kept only if the
  lint passes, rolled back piece by piece otherwise; an icon that ends no crisper is restored. Gaps between pieces
  change by up to 0.5.
- Checks: lint (808), slivers at 16 and 48 (only folder-cog, folder-zip, truck, as before), geometry audit (no new
  findings), and `frames.rigidity` (attached pieces and filled cut-outs moved together) on every changed icon. Long
  whole-pixel stroke length: 4,207 → about 1,750.
- Not yet fixed: the 20 slash icons (their cuts are rebuilt from the base, `2026-10-02/flat-slash.py`), icons whose
  joined parts sit on both parities (the person family, lock, trash, server, document pages with marks …), and 76
  batch-2 icons with a shorter whole-pixel stroke left. These need redraws in a later round.
- Rings (r 6 at 8, 8) are not scored: their top and bottom stay soft at 1× wherever they sit. Icons that moved carry
  their ring with them.

**Round 3 (owner-approved 2026-10-14).** 31 icons:

- Slash icons (9: keyboard-off, power-off, unpin, video-off, screen-share-off, camera-off, bluetooth-off, cloud-off,
  link-off): everything but the shared slash and its parallel cuts slides by (d, d) along the slash, which keeps every
  one-sided cut on its line, so the filled variant stays exact. Five took the circle keyline (the slash plus the moved
  base is 13.63 wide), as video-off already had. brain-off and timer-off fit neither direction.
- Part slides (9: crown, file-user, filter-add, folder-tree, list-plus, milestone, notebook, replace, table): one element
  moves half a unit across its whole-pixel run, keeping every contact, every line end that sat on another part, and
  every shared edge. **A part centred on its container or on the drawing does not slide** (symmetry beats 1× for inner
  parts): the first pass moved store's door, history's hands, scale's post and clipboard's clip off centre and was
  reverted by eye.
- Redraws: desktop's screen is 12 × 9 (4 : 3, was 8.5) with a stand 2 long, in desktop, desktop-check, desktop-play
  (its play 0.4 lower, centred), monitor-cog, screen-share, screen-share-off / monitor-off, and tv's screen; file-upload
  and file-image take document's page (up 0.5), file-upload's arrow up 1 so it stays on the lattice; the clipboards'
  boards end at 13.5 and clipboard-check sits on clipboard's board and clip; trash's body ends at 13.5, its handle starts
  at 2.5, slats 7–11.
- Left: 55 icons with a whole-pixel stroke of 5 or more (listed on the page), including the bots (owner-settled), the
  panel-left family (a 5.5 pane edge puts the chevron 2.38 off), presentation (the easel's 45° legs fix the board's
  bottom on 10), file-diff (a plain lattice fold). Question on the page: a centred line inside a half-pixel frame
  (columns, import, the T, scale's post, bank's pillar …) stays soft unless the frame changes width.

**Round 4 (owner-approved 2026-10-14).** 18 one-off redraws by half a unit, each
lint-checked, sliver-checked and looked at at 96px: archive-restore (body up 0.5 as archive, arrow 0.5 right),
building (0.5 left, bottom 13.5), cart and cart-add (bar 10.5, wheels 0.5 lower so they still sit on it; cart-add's
basket end 11.5), chess-rook (base ends 13.5, corners r 1), clapperboard (body bottom 13.5), devices (phone 3 wide, stand
foot 12.5), folder-input (arrow 0.5 lower, the left side's stub to 10.75), gift-card (frame 11 wide), inbox (bottom
13.5), keyboard-off (space bar 10.5), magnet (inner opening 3), music (left note 0.5 left), newspaper (page edge 12.5,
flap 2), paintbrush (top 2.5, bristle 10.5), siren (base 2 tall), stamp (base 3 tall), toy-brick (base from 5.5, studs
0.5 taller). Tried and kept as they were: car (a lower beltline crowds the headlights into a filled sliver), barcode
(bars 2 apart leave a hairline when filled; 3 apart collide with the brackets), server and server-cog (4-tall units
crowd the light), volume-off, wind, table-cells-merge (no move passes the lint). 37 icons with a whole-pixel run of 5 or
more remain, each held by a construction the owner set, the lattice, or the gap scale (list on the page).

**Centred lines (owner, 2026-10-14: "leave").** A line centred inside a frame on half pixels (columns, import's stem,
the T in line-height and letter-spacing, scale's post, bank's middle pillar, brain's divide, mouse's wheel, split,
piano's keys, arrow-up-from-line, cloud-download) stays symmetric and soft at 1×; neither the frame's width nor the
line's centring changes for 1×.

## document's text lines evened, 2026-10-16

Owner (component review, round 28, on the Nav sidebar demo's Library row): "the lines inside the document look off and
too close to the bottom of the document, not evenly spaced". Below the fold (its base at y 6) and above the page's
bottom (13.5) the lines at 8.5 / 11.5 left 2.5 / 3 / 2 between centre-lines, 0.75 of clear space under the second.
They move to **8.5 / 11**: 2.5 / 2.5 / 2.5, every gap 1.38 tight, x 6.5–9.5 unchanged (3 from the page's sides). The
second line is now on a whole pixel, a grey double row at 1× (the trade the owner accepted for form's even lines,
5.5 / 8 / 10.5, 2026-10-11); at 2× both lines draw alike. Lint, sliver check at 16 and 48: clean. Status kept approved
(the package's main entry is approved-only); before / after sent to the owner.

On the restored page ("Balance over 1× crispness" below: the page back on 2–14, the fold's base at 6.5) the same
even spacing puts the lines at **9 / 11.5**: 2.5 / 2.5 / 2.5 between the fold's base, the lines and the page's
bottom (14), x 6.5–9.5 unchanged.

## Balance over 1× crispness: the frames moves restored, 2026-10-16

Owner, on the document family after the 1× frames pass (the page moved up 0.5 but its lines stayed, so they sat low
on the page; file-image's mountain cut stayed too and pushed through the page's bottom corners): "id prefer more
even/equal spacing of the marks inside the document over the slight blur it causes. i also care more about the
overall optical balance and size of the icons as a whole entire set/system than any blurring."

**Rule.** An icon's optical centre, its size and the even spacing of its parts come before landing strokes on whole
pixels. 1× crispness is a tie-breaker only between drawings that are equally balanced. A move or redraw made for
crispness alone is not made.

**Restored.** Measured against the drawings before the pass (each approved one by one on the review page), the pass
had moved 208 of 276 changed icons' centre-line boxes further from 8, 8, shifted parts against each other in 79
icons, and resized 31. Every source the frames pass changed (batches 1–2, rounds 3–4: 273 files) is back to its
2026-10-13 drawing. Kept: the three optical outliers (qr-code, diamond, gamepad), which were redrawn for size and
balance, and the pass's tooling and keyword changes. "Optical outliers and 1× frames" above records the pass;
its frames sections no longer describe the sources. Sheets: `docs/research/icon-review/2026-10-16/`.

**Balance pass, round 1 (2026-10-16).** Measured against Lucide and Phosphor drawing the same concepts (record and
tools: `docs/research/icon-review/2026-10-16/`), so a small reading that every library shares (narrow, diagonal or
pointed objects) is kept and only Area's own outliers change. Relative apparent size (1.00 = Area's median), before → after:

| name | change | size |
|---|---|---|
| wand | the sparkle r 4.5 at 9.5, 6.5 (was r 3 at 11, 5), the stick 2, 14 → 5.5, 10.5, open 2.56: the full keyline | 0.70 → 0.83 |
| eye-off | (round 2) the lid keeps eye's width and its corners at 5.5, its lowest point 9.5 (was 7.5), so it lies inside the open eye's outline, near its lower lid; lashes 2.75 (centre 9.5–12.5). Ink centre 9: Lucide's closed eye sits 0.67 low and Phosphor's 1.25, both so the lid stays where the open eye's lids are. Toggle sheet `7-toggle-pairs.png` | 0.77 → 0.89 |
| lock, unlock | body 10 × 6.5 from 3, 7 (was 9 × 6), the shackle 0.5 higher; square keyline | 0.91 → 0.97 |
| broadcast | both arc pairs ±50° (were ±45°); ±55° brought the inner pair 2.32 apart | 0.96 → 0.98 |
| quote | the drawing ×1.25 about 8, 8, then 0.5 higher (its drops are the heavy part) | 0.76 → 0.93 |
| scissors | rings r 2 at 4.5, 4.5 and 4.5, 11.5, blades to 13.5: 12.12 square (was 13.12); square keyline | 1.18 → 1.08 |
| atom | orbits rx 7.176 (was 7.937): box 12.12, the ring's reading | 1.18 → 1.08 |

Kept, measured: plane and pen-tool (a side view and an upright nib where the references draw diagonals), terminal
(Area's framed console), the type letters and standalone arrows (larger than the references draw them, but at Area's
median and set by the type family and arrow rules), list-bullet, volume-low, waypoints, gauge, mountain, unfold-horizontal
and plug-off (within about 10%, each in a family). Open for the owner: the person family, crown and coffee are centred by
their outline while their ink sits about 1 unit low at 16.

**Balance pass, round 2 (2026-10-16): the writing tool and toggles.** Owner: "do the pencil family next … when i
switch between eye and eye off it should be somewhat smooth". The shared writing tool (Pens and pencils, 2026-10-05:
Lucide's pen) was 2.83 wide where Lucide's is about 3.8 at 16, so it read slim. Every pen and pencil widens ×1.25 with
the 60° tip, the r 0.5 shoulders and its ends unchanged (`docs/research/icon-review/2026-10-16/body.py` draws the body
from tip, half-width and end, and reproduces the old drawings exactly):

| name | change |
|---|---|
| pencil, pencil-off | 3.54 wide (sides x + y = 13.5 / 18.5), the square end at x − y = 9 (was 10) so it stays in the keyline, band 3 from the end (x − y = 6) |
| pen | the same body, the round end r 1.768 with its apex at x − y = 9; the clip 2.12 off the side as before |
| compose, signature, chat-pen, person-pen, file-pen | the slim pen 2.65 wide (was 2.12), tip and end in place; the frames' overlap cuts re-solved to 2.25 (chat-pen's bubble from 5.54 and to 6.443, file-pen's page to 7.443 and from 7.057, person-pen's body to 6.438 and its shoulder ending on the line at 7.943, 10); file-pen's pen 0.35 shorter so its halo leaves no sliver against the fold |
| pencil-sparkle | the slim pencil 2.65 wide, the sparkle 0.25 up and left (a detail 1.08 from it) |

Sizes (Area median 1.00): pencil 0.68 → 0.72, pen 0.77 → 0.79, the composites unchanged within 0.02 (their frames
set their size). The sides leave the 45° lattice (the recorded pen-axis exception), which balance outranks.
Toggle pairs are checked overlaid (`toggle.mjs`, `7-toggle-pairs.png`): eye / eye-off, lock / unlock, pencil / pen,
pencil / pencil-off, pencil / compose.

**Balance pass, round 3 (2026-10-16): the diagonal tools.** Owner: "do the four tools next". Relative size (Area median
1.00) before → after, with Lucide and Phosphor's mean reading of the same concept:

| name | change | size | refs |
|---|---|---|---|
| slice | the knife 3.54 wide like the pencil (spine x + y = 15, edge x + y = 20, handle r 1.768 at 12, 5.5), the bolster at 9, 11 with its divider from 6.5, 8.5; on the grid and lattice | 0.66 → 0.70 | 0.76 |
| broom | the head ×1.18 about the handle's join, the handle from 8.5, 7.5 (tight 1.51 to the head), the whole slid 0.25 along the handle so its ink centres (7.94, 8.07) | 0.73 → 0.80 | 0.91 |
| wrench | ×1.07 about the centre: 12.9 square | 0.82 → 0.87 | 0.90 |
| eyedropper | kept: it already reads as the references do | 0.81 | 0.82 |

slice stays under its references because a 45° knife with a flat blade can't grow taller without leaving the
lattice; it is the pencil's width now. Sheet: `8-tools.png`.

**Balance pass, round 4 (2026-10-16): the rest of the set.** Owner: "finish the rest of the icons". The whole set
re-measured (`measure.json`); every icon still more than 10% from the references' reading of its concept was looked at
beside the keyline references (`bal.mjs`). Changed: **mountain** 0.5 higher (its heavy base had its ink centre 1.0 low;
now the box sits 0.5 high, the heavy-base rule). Kept, with the reason:

- **Limited by the keyline, not drawn small:** voicemail (r 2.5 loops either leave the 0.5 grid or pass the 14-wide
  keyline), slice, the person family, crown and coffee (the person's head already sits at the top of the vertical keyline,
  so it can't rise; its closed dome body, the owner's, carries more weight low than Lucide's open arc).
- **Shape-driven** (the references read the same or near it): expand, collapse, maximize, minimize, list-bullet,
  volume-low, unfold-horizontal, waypoints, gauge, plug-off, eyedropper, code-sparkle (code's outline).
- **Concept differs from the references:** plane, pen-tool, terminal, wand (no satellite sparkles, owner), the signal
  bars, eye-off (the closed eye, matched to eye for the toggle).
- **Set by owner rules, at Area's median:** the type letters (cap height 2.5–13.5), standalone arrows (5 head on 12),
  frames (ruler, password, kanban, library, diff).
- **Small by role:** grip (the components' drag handle), corner, space, minus, breakpoint, case-lower (x-height).
- **dismiss (owner-approved, 2026-10-16):** the standalone × is 9 (`M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5`, was 10):
  an X's hull is a square and a +'s a diamond, so at 10 it read about 20% larger than add; 9 is 0.82 of the +, as
  Phosphor (Lucide 0.86). It is the close glyph every component draws (`PACKAGE_GLYPHS`): Alert, Popover, Toast, Badge,
  Tag, Drawer, ColorPicker, FileUpload, PromptSuggestions keep their slots and only the mark is smaller
  (`10-dismiss-components.png`, `dismiss-components.mjs`). The 3.5 × beside a shape and the 5 × in a ring are unchanged.

Whole set, before the balance work → now (511 concepts all three libraries draw): within ±8% of the median 64.0% →
64.6% (sd 0.127 → 0.124); within ±8% of the references' reading 83.2% → 84.3%, ±12% 92.6% → 93.9%. The figures move
little because the set was already close; the changes are the visible outliers. `grid.mjs` renders the whole set
shuffled (`9-whole-set-16.png`, `9-whole-set-24.png`), the "two random icons side by side" test.

**Final visual pass (2026-10-16).** Owner: "do a final visual pass to make sure there are no stroke, negative space,
or visual errors". Every redraw of the day at 96 (outline and filled) and 16 / 24 (`look96.mjs`, `11-final-pass.png`),
and the whole set's checks run on today's set and on a baseline (the 13 Oct drawings with the three kept outliers):
slivers at 16 and 48, doubled strokes (`dups.mjs`), knockout escapes, `AUDIT_ENDS`, `geometry-audit.mjs`. Today adds no
sliver, doubled stroke, escape or end finding; the geometry audit's only new lines are 45° sides off the lattice in the
widened pens and broom (balance outranks the lattice). Fixed in the pass: eye-off's side lashes 2.46 from the centre
lash (a near miss of open), now from x 4.41 / 11.59. The slivers the tool lists on main and here alike (brain-off,
bug-off, calendar-range, file-cog, file-zip, folder-cog, folder-zip, image-sparkle, person-settings, server-cog, unpin,
smile-plus, truck) are the narrow tips of the family bites and cut-outs reviewed in earlier rounds, unchanged.

## Component redrawn, 2026-10-17

Owner, with a crop of Panel's dev-mode row ("Component · Button / Primary"): "the component icon looks wrong". The four
diamonds were 4 wide (vertices 2 from their centres, centres 4 from the middle) with 2.4 counters: at 16 they read as a
scatter of dots, lighter than the set's other circle-keyline icons. Lucide's `component` draws the same concept with
diamonds about 4.5 wide set 4.4 out. Redrawn with diamonds 4.9 wide (vertices 2.45 out) at 4.25 from the middle: the
tips reach the circle keyline as `diamond` does, the gaps between diamonds are 1.42 at the icon weight (tight) and the
counters open to about 3.3. No whole-pixel geometry fits a larger diamond inside the keyline with a readable gap
(centre offset ± size must both be whole), so the source takes `data-angles="free"`, as balance outranks 1× crispness
(owner, 2026-10-16). Sheet: `docs/research/icon-review/2026-10-17/component-1x.png`, `-2x.png`.


## Line above 24px, 2026-10-18

Owner: "the icon stroke thickness scaling up looks very thick, is that what other icon systems do at larger sizes?",
then "research how other icon system handle stroke width larger than 24px, and go with your rec".

Survey (pinned sources: docs/research/file-explorer-2026-10-18/README.md §9): single-drawing sets scale the line with
the drawing (Lucide, Tabler, Feather, Untitled UI, Phosphor, Radix: 2/24 is 4px at 48); Lucide's `absoluteStrokeWidth`
holds it constant; systems with per-size drawings or optical sizes grow it more slowly (Fluent 1.5 → 2 → 2.5px at
24 / 32 / 48, size^0.74; Material Symbols 2 → 3px at 24 → 48, size^0.58).

Decision: the curve keeps size^0.45 to 24 and continues at Fluent's slope, size^0.74, above it
(`SIZE_CURVE_LARGE` in packages/icons/scripts/generate.mjs). Was: the 24 drawing scaled whole above 24 (owner,
2026-10-06). The line at the token weight:

| Size | Was | Now |
|---|---|---|
| 24 | 1.35 | 1.35 |
| 32 | 1.80 | 1.67 |
| 48 | 2.70 | 2.25 |
| 96 | 5.40 | 3.75 |
| 128 | 7.20 | 4.86 |

The 2026-10-06 concern (gaps growing while the line thins) is smaller at this slope: at 48 the line is 17% under a
whole scale (the size^0.45 curve continued would have been 32%). Icons rendered by CSS size without `size` keep the
token line scaled with the box; File page and File tile set their glyph line from this curve.

## Optical pass, 2026-10-26 (Description list's icons)

Owner, seeing circle-dashed, person, calendar and folder stacked at 16 in Description list: "these icons dont look very
optically balanced". The audit (`generate.mjs --check --audit`, median size 11.27, density 0.41) found the standalone
person 9% small (its family's marks bring person-* to −2…+4%) and circle-dashed's ink 59% under the median.
- **person:** head r 3.5 at (8, 5) over a body 2.5–13.5 × 10.5–14 with r 3.5 shoulders, the circle keyline (was head
  r 3 over a 10-wide body, vertical keyline). Size 11.24 (−0%). A 3.25 head would put the circle's extremes off the
  half-pixel grid. The person-* family keeps its figure.
- **circle-dashed, circle-check-dashed, circle-dot-dashed:** the same 8 dashes on the axes, lengthened until the gap
  between them is one line (1.125, the overlap cut): 22.3° dashes, ink +27%. A dashed ring stays the lightest outline
  (−48%) by nature. person-dashed keeps its own dashes.
- **calendar** (+12% density from its five dots) and **folder** (−12%) are within the audit's range and unchanged.
The four stay approved in batches.json, because a review icon leaves the package's main entry (`@area/icons/review`) and
person is imported across the app; the redraws are on the owner's review page instead.

- **person, 2026-10-30 (owner: "the icon for person looks too big", in Settings' nav beside palette and swatch-book):**
  head back to r 3 at (8, 5) over a 10-wide body, 3–13 × 10.5–14 with r 3.5 shoulders; the circle keyline and the
  foot at 14 kept. Ink 11.12 × 13.12, centred on 8, 8 (the r 3.5 head had put it at 7.75). Size 10.51 (−7%), the gear's
  −5%; the r 3.5 head read largest in a list of 16px marks though the hull median said otherwise.

## Review against Cursor, 2026-10-29

Owner: "take another look at all the icons again … optically balanced, how they look at all sizes and next to text, how
they compare to cursors icons, and … the overall visual design language". Review page with the evidence and the owner's
picks: https://claude.ai/artifact/35czAepgpMBmeDCbMh5vU2 (db collection `verdicts`, P1–P8).

- **Method:** every icon (outline and filled, built `dist/svg/16`) and 577 of Cursor 3.27's glyphs, read from its own
  icon font (`Cursor.app/…/out/media/cursor-icons-16.woff2`: 300 units to 16px, a 24-unit line, 1.28px at 16), rendered
  the same way at 96px and at 1×; Lucide and Phosphor from the 16 Oct balance pass's `measure.json`. Cursor's glyphs were
  rendered for comparison only and are not in the repository. Cursor sets its 16-grid font at 14px in its Agents
  sidebar, menus and composer (`.agent-sidebar-cell-icon i.codicon { font-size: 14px }`), where it draws the same ink
  as Area's 16: median apparent size 11.41 against 11.34, line 1.12 against 1.045 at type 13.
- **Balance:** within ±8% of the median size Area 71%, Cursor 64%; within ±20% of the median density 81% / 78%. Icons
  more than 10% from every reference that draws the concept: 18, of which the size outliers below changed and the rest
  were kept with the 16 Oct reasons (wand, eye-off, terminal, the type letters, ruler, password, settings).
- **Owner's picks (2026-10-29):**

| | Pick | Done |
|---|---|---|
| P1 | the 20 icon slot from type 15, its line on the size curve (owner's second pick, after the sheet `docs/research/icon-review/2026-10-29/p1-type-15-16.png`) | Done: see "The 20 slot's line" below |
| P2 | keep the icon line on the type (1.045 at 13) | Unchanged |
| P3 | 12px cuts for content icons shown at 12 | The 2026-10-13 measurement already covers the app's 12px slots; the slots added since show marks with cuts, except Reference list's `return`, now cut |
| P4 | keep "detail first" (Cursor's bases are bare) | Unchanged |
| P5 | expand and collapse, candidate B | Redrawn |
| P6 | keep gauge's semicircle | Unchanged |
| P7 | redraw plane top-down | Redrawn |
| P8 | repoint the review tools | Done |

| name | change | size (median 1.00) |
|---|---|---|
| expand, maximize | 3.5 heads (`M10 2.5H13.5V6`), the shafts brought in to a standard gap at the centre (inner ends 9.061, 6.939 and 6.939, 9.061 on x + y = 16: 3 between centre-lines, ink 1.88) | 0.78 → 0.82 |
| collapse, minimize | 3.5 heads at the same inner corners (`M9.5 3V6.5H13`) | 0.75 → 0.80 |
| plane | top-down airliner on the rising diagonal, nose top right (Cursor, Lucide and Phosphor draw it so; the side view read as a bus at 16): one closed outline, a 3.54-wide body (2.41 inside), swept wings and tailplane, nose r 1.5, root corners r 0.5, tips r 0.4; built upright and turned 45° so the body sides, wing tips and tailplane tips are constant-x lines, solved onto the lattice (x + y = 14, 19, 7, 26, 11, 22: the axis on x + y = 16.5, 0.25 off centre by the lattice rule) and the tail's trailing edge on x − y = −7. Ink box 12.62 square at 7.91, 8.59 with the ink's mass at 8.23, 8.27 (the nose and wings are the heavy end). Solid when filled. Generator: `docs/research/icon-review/2026-10-29/plane.py 1.165` | 0.87 → 1.00 |

- **return's 12px cut** (`sources/12/return.svg`): the 16px drawing at 12 put the bar and the hook on quarter pixels;
  the cut is the square 8 frame (2.5–9.5), the bar on 7.5, the hook r 2 into a stem on 9.5 and a 2px head through pixel
  centres. Glyph's `return` at size 12 (Reference list's backlink) draws it below type 16.
- **The redraws stay approved** in batches.json (the owner picked them; a review icon leaves `@area/icons`' main entry),
  as the 2026-10-26 pass did; plane's drawing is new and is on the review page for the owner.
- **Tools:** `look.mjs`, `geometry-audit.mjs`, `slivers.mjs`, `sizes.mjs` and `dups.mjs` read and write under
  `packages/icons` (`.cache`, `sources`, `scripts/generate.mjs`) instead of the archived `apps/docs` paths, which no
  longer existed in a fresh worktree. They still import the generated `apps/docs/src/pilot-icons.tsx`, which
  `generate.mjs` writes.
- **Found, not changed:** the app's tab close (`app-nav.tsx`, a `DismissIcon` without `size` in Nav's 12px action slot)
  draws the 16px drawing at 0.78px; `size={12}` would give it the 12 line. PR #174 is editing that file.

### The 20 slot's line (P1, 2026-10-29)

Owner, after the sheet: "use the 20 icon slot from type 15, with the 20 slot's line on the size curve (1.33 at type 15,
1.42 at type 16)". Components size their icons by CSS from the type axis's tier tokens (`--area-icon-sm/md/lg`), and an
icon at its default size strokes the token line in its 16 drawing's units, so a 20 box scaled the line too: type 16
drew 1.61px (not the curve's 1.42), and moving type 15 to 20 alone would have drawn 1.51.

- **Type axis** (`axes/type-size.ts`): `type-icon` is 20 from 15 (was from 16); new `type-icon-line`, 1 up to 14 and
  0.8846 at 15 and 16 (the curve's (20 / 16)^-0.55, the factor `size={20}` already applies).
- **Default-size icons read it:** `@area/icons`' `sw` with no `size` strokes `calc(var(--area-weight-icon) *
  var(--area-type-icon-line, 1))` (generate.mjs), and Glyph's default rule does the same (`base.css`). An icon with an
  explicit `size`, the xs slot (size 12, the 12px factor and cuts) and strokes outside icons (Presence's ring, Empty
  state's large glyph, the app's option marks) keep the token line. Toggletip's md glyph multiplies by it; File tile and
  File page, which set their own icon line, set it to 1 (`--area-type-icon-line` joins `OVERRIDABLE`).
- **Result:** default-size icons draw 1.33px at type 15 (slot 20, was 16 at 1.21) and 1.42 at 16 (was 1.61). Types 12–14,
  the app's type 13 included, are unchanged.

## Batch 76: Cohesion pass, round 1, 2026-10-31

| Icon | Construction |
|---|---|
| system | square; alias of shapes (owner pick A, 2026-11-01): a triangle over a square and a circle, each as large as the gap scale allows in the 12px box. The triangle (vertices 4.25, 6.5 / 8, 1 / 11.75, 6.5, r 0.75 corners) is the largest part, since it covers half its box; the square 4.5 at 2, 9 with r 1; the circle r 2.25 at 11.75, 11.25. Gaps 1.38 and 1.56 tight, 1.88 standard. The drawing sits 0.5 high so the square's and circle's edges land on whole pixels (1× frames). Filled: all three solid. |
| bookmarks | square; bookmark's drawing at 7 × 9.35 with a back copy offset 3 up and right (the multiples rule), the back drawn as an open L stopping one overlap cut (2.3) short of the front. Every vertical edge sits on x.5 and the tops on 1.5 and 4.5, so it is crisp at 1× and 0.5 left and high of centre (crisp over centred). Filled: the front fills and the back stays a line. |

Redrawn in the same round, all owner-approved on the review page (2026-11-01). compass and compass-dot: the needle lies on the rising diagonal, straight-sided, tips at 11, 5 and 5, 11 (r 0.5), sides at 9, 9 and 7, 7 (r 0.75). Fluent's NW–SE needle lay on the slash's diagonal and read as ⊘. link and link-off: on the rising diagonal, two r 2.83 hooks on centres 5, 11 and 11, 5 with 1-unit straight ends, the bar 6, 10 to 10, 6, every 45° segment on the lattice; 12.8 square, where the flat link was 13.1 × 7.1 and read 19% light. link-off keeps the shared slash flat, and its filled bar keeps the lower-left half. The 12px and 10px cuts follow: the 12 cut is the drawing at 0.75 (hooks r 2.12 on 3.75, 8.25 and 8.25, 3.75); the 10 cut puts r 1.41 hooks on 3, 6 and 6, 3 round 4.5. case-sensitive, case-upper and case-lower: cap 4 to 11.5 (7.5, was 6.5), x-height 4.5 with r 2.25 bowls, the A 5.5 wide with its bar on 9.5 and the B's bar on 7.5. The pair reuses the single letters. newspaper: the solid picture block is replaced by text lines (4 to 9.5 on 5.5 and 8, and 4 to 7.5 on 10.5), so newspaper is no longer a recorded solid. Filled: the lines are knockouts. shapes takes system's drawing.

## Cohesion pass, round 2, 2026-11-01

Owner picks on the cohesion review page (`docs/research/icon-cohesion-2026-10-31/`, round 2).

| Icon | Change |
|---|---|
| detail dots (47 icons) | Every dot set inside a shape (keys, windows, lights, eyes, an eyelet, grouped dots) is the line's weight, ⌀1.125 (r 0.5625), on the size curve like the others; it was ⌀1.5, a third heavier than the line. Lucide's and Tabler's dots are the line's weight. Centres unchanged: the lint measures a detail dot's gaps from its ⌀1.5 placement. Changed: bandage, bank, bluetooth-connected, the bots (bot, -automator, -builder, -designer, -generator, -guard, -lead, -scholar), brightness, building, calculator, calendar, calendar-range, chat-more, clipboard-list, cloud-snow, cookie, dice, discount, exit-door, frown, gamepad, hard-drive, key, keyboard, keyboard-off, line-style, meh, opacity, password, person-key, piggy-bank, scan-face, server, server-cog, smile, smile-plus, speaker, square-list, square-smile, swatch-book, tag, tag-plus, tags. The i, ! and ? dots stay ⌀1.5; mark dots stay ⌀2. |
| app-window | The bar (2.5–5.5, its line on 5.5) holds two tab lines at 5.5 and 8.5 (Lucide's) instead of three ⌀1.5 dots. Filled: the body below the bar fills; the bar and its lines stay lines. |
| briefcase | One plain band at 9.5 edge to edge (Lucide's and Phosphor's), without Fluent's split band and clasp. Filled: the band is a gap. |

Kept, owner-confirmed: quote, bold, stop-circle, record, the booleans, contrast, shadow, folder-zip, id-card,
stroke-weight, qr-code, the play shapes in containers, gauge's needle, text-color's bar, the bots' visors, image's sun,
paint-bucket's drop, globe (Fluent's, exactly).

## Cohesion pass, round 3, 2026-11-01

From the owner's flags on Icon Boards (`docs/research/icon-cohesion-2026-10-31/tools/boards.py`) and the review page.

| Change | Icons |
|---|---|
| Corner radius by frame size: r 2 for frames ≥ 9 × 7, 1.5 for 5–8, 1 below. Each corner keeps its corner point; only the radius changes (`tools/reradius.py`). | r 1.5 → 2: bookmark, bookmark-add, -check, -off, -remove, building, folder and its 12 members, folder-open, folders, hard-drive, home, inbox, laptop, newspaper, rectangle, ruler, toolbox, wallet, archive, archive-restore, devices, gallery, memory, presentation, toy-brick, trash, vote. r 2.5 → 2: captions, scan-check, scan-face, scan-qr, scan-text, group, corners-sparkle. r 1 → 2: book-add, repository (the cover's right corners). r 1 → 1.5: chip. Kept: kanban (4-wide columns), truck, building's annex, objects whose roundness is the shape. |
| plane | Top-down, nose up (the owner's viewpoint rule): a fuselage 3 wide on x.5 edges, swept wings to 2 and 14, a tailplane to 5 and 11, r 1.5 nose, r 0.5 elsewhere. Replaces the angled airliner of 2026-10-29. |
| switch-camera | camera's body exactly, its lens a 270° arc (r 2 at 8, 9) with a 1.4 head at the top, pointing clockwise. |
| snowflake | The V's stay at the tips; their vertex moves in to r 3.75 and their barbs to 2.12 long, so the barb ends sit 0.5 inside the arm's tip. |
| bot | No mouth; the eyes (1.5 tall at x 5 and 11) centred in the head; head r 2. |
| bot-agent, agent | A brim the head's width (2–14, Q dip to 7.125) and a narrower crown (5–11 at its foot, 5.5–10.5 at its top) standing on it; head r 2. |
| Removed | bot-automator, bot-builder, bot-designer, bot-generator, bot-guard, bot-lead, bot-researcher, bot-scholar (owner: remove). |

Kept by the owner: move, container (isometric, the one exception to flat views). Known and unchanged: folder-cog's filled
variant shows a sliver at the gear's hub (present before this round).
