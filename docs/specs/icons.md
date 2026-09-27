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
| percent | two r 2 rings and a diagonal a standard gap from each |

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
