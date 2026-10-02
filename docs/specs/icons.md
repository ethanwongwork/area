# Icon set spec

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
`icons:find` (does it exist?), `icons:geometry`, `gen-pilot-icons.mjs --only`,
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
| document | vertical | 9 × 13 page, 45° clipped corner (9.5, 1.5 → 12.5, 4.5), lines 6.5–9.5 at y 8.5 / 11.5 | 10.1 × 14.1 | lines 1.88 from every edge. No dog-ear: its triangle counter would be about 0.6px |
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
read at 12px: at 1× they blur in both modes. Owner to confirm.

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
icon (`ICON_REVIEW_DEMOS` in `apps/docs/src/demos/icons.tsx`). Each tile shows:
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
