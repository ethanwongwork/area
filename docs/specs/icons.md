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
