# Icon set spec (proposal)

**Status:** pilot built; weight chosen · 2026-09-25 (owner-approved). Twelve icons in
`apps/docs/assets/area-icons-pilot/`, generated to `apps/docs/src/pilot-icons.tsx` by
`npm run icons:pilot`, linted by `npm run lint:icons`, shown in the gallery's Icon pilot
section at 1, 1.125 and 1.25px beside the Fluent icons in use today. The weight is the
owner's choice; nothing outside the pilot uses these icons yet.
**Evidence:** measured in the browser on 2026-09-25 (method below). ChatGPT's sprite was
fetched for measurement only and is not stored in the repository.

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
  (PACKAGE_GLYPHS: check, check-inset (the check inside the Available ring), chevron-down,
  dismiss);
- `Glyph.tsx` renders them, with `rotate` for 90/180/270;
- base.css sets the line: `[data-area-glyph] path { stroke-width: var(--area-weight-icon) }`.

| Component | Was (Fluent) | Now |
|---|---|---|
| Badge dismiss (12px) | dismiss_12 | dismiss |
| NumberField steppers (12px) | chevron_up/down_12 | chevron-down, rotated 180 for up |
| TreeView disclosure (16px) | chevron_down_16 | chevron-down (CSS still rotates −90 when collapsed) |
| TreeView checkbox (14px inside the box border) | checkmark_16 | check-inset, the same shared part as Available |

At 12px the scaled line is 0.84px against Fluent's 1px 12px cut. Composer's send arrow
and the icons that demos pass in (folders, files) are still Fluent.

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
