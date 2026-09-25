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
