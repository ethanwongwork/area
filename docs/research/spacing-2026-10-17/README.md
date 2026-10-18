# Spacing, alignment and optical sizing: a measured pass, 2026-10-17

**Question (owner):** "fix the padding, gaps, etc. overall, i want to make sure the padding, gaps, layout, and overall
composition for each component is consistent and accurate … research how design systems accurately, and consistently
ensure alignment, optical sizing, spacing, gaps, margins, padding, etc. be thorough."

## What was done

1. **Research** (`external.md`): 16 systems from their own source (Material 3, Fluent 2, Apple, Carbon, Spectrum 2,
   Atlassian, Primer, Polaris, Radix, Geist, Untitled UI, shadcn, Linear, Figma, EightShapes, text-box trimming), each
   claim linked. It ends with what they agree on, where they differ and a 15-point auditor checklist (§16).
2. **Area's own rules** were collected (inset.css, DESIGN_SYSTEM, COMPONENT_ADAPTATION, the gap and consistency audits)
   and the checklist was applied against them.
3. **A measured sweep** of every family's Stage in the app (102 families, about 1,400 tiles), at the default (type 14,
   density 32) and at the app's own scale (type 13, Compact), in headless Edge at 1:1 (`sweep/`). Three checkers:
   - `check.js`: defects (fractional spacing, off-centre text and icons by cap box, uneven sibling rhythm, nudges,
     non-concentric nested corners, inverted proximity, icons off the pixel grid) and per-control and per-surface
     metrics for comparing families.
   - `header-check.js`: every title with an action, badge or close on its line: the action's centre against the
     title's cap centre (1,116 pairs).
   - `column-check.js`: the label column of every list-like component, by whether the row leads with a visual.
4. **Fixes**, then the same sweeps again (`sweep/final`).

## How Area compares with the research (checklist §16.3)

| # | Rule most systems hold | Area | Measured |
|---|---|---|---|
| 1–2 | Height is the input; padding is derived from it, borders counted once | inset.css: `round((h − content) / 2 − border)` per side | Every control at its token height |
| 3–4 | Icon side tighter than text side (M3 16/24, Spectrum 10/12, Primer 8/12) | Icon side `(h − icon) / 2`, text side `(h − cap) / 2`: 8 / 11 at 32 | 42 of 42 md and 17 of 17 sm text-side Buttons at 11 / 9; icon sides 8 / 6 |
| 5 | Gap smaller than padding, by size | 6 at sm/md/lg, 4 at xs and compact; rows 12 | 14 families at 6 in 32 controls; one outlier, Tag (fixed) |
| 7 | One vertical-centring rule | Cap-height centring everywhere | 0 off-centre controls at type 14; at 13, Tag (fixed) |
| 8 | Multiline: visual on the first line | Documented and tested | Alert, Toast, Checkbox |
| 9 | Shared text columns in lists | Icon rows' labels on one column (36); Nav's text-only rows on the icon column (8), by design | No ragged column in Menu, Nav, List box, Tree view, Command palette, Table of contents, Description list |
| 11 | Nested corners concentric | `max(min(floor, own), outer − inset)` | One violation, Tag picker lg (left, see below) |
| 12 | Inner gaps tighter than outer padding | Mostly | Popover (decision below) |
| 13 | Values on the scale; exceptions recorded | Literals carry `/* spec */` | 78 fractional gaps at 14 and 66 at 13 (all fixed) |
| 14 | Density moves padding and gaps, not type | Separate type and density settings | Holds |
| 15 | Verified by machine | Stylesheet tests; no rendered spacing check | This sweep is that check; rerun it after spacing changes |

## Fixed

| Family | Was | Now | Rule |
|---|---|---|---|
| Card (header) | A Badge or marker icon sat 6.3–6.8 below the title's cap centre; header buttons were centred (0.5) | Centred on the title's cap, as buttons | §7: one centring rule. The title is trimmed to its cap, so a title-line-tall slot centred on the untrimmed line |
| Kbd (and every Button, Tooltip, Search field, Nav, Table, Shortcut list that holds one) | Gap between keys 1.94 / 1.78 (`0.25ch`), every later glyph between pixels | `round(nearest, 0.25ch, 1px)`: 2 | §13 |
| Select | No gap of its own: the browser's base-select `0.5em` (7 at 14, 6.5 at 13) | Its size's gap tier (`--_gap`) | §5, §13 |
| Tag (icon) | Icon 6 from the end and 2 from the label (the text side's Notion literal) | `(h − icon) / 2` (4 at 20) and the xs gap (4): Badge's at the same height | §4–5: sibling components of one size agree |
| Tag (label, Compact) | 13px type in the 14 tag (0.93 of its height) | The small size when the tag is shorter than its line: 11 in 14, as Badge, Count, Kbd and Citation; default 14 in 20 kept | Owner's note; the only mark over 0.79 at Compact |
| Badge, Tag, Citation (optical centre) | Lowercase labels about 1px low beside a centred dot, flag, icon or × at Compact | One shared rule: the label a quarter of the cap–x-height gap above the cap centre; Count keeps the cap centre | Owner's follow-up: "see if there are other small components … that have this issue" (`sweep/marks-check.js`) |
| Citation (sides) | A fixed 8 text side at every height (8 beside 3 of room in Compact's 14) | Badge's height formulas: 4 / 8 at 20, 1 / 5 at 14 | Same check |
| Tag (side and optical centre) | A fixed 6px side at every height (twice the room above the text in Compact's 14); lowercase labels about 1px low beside a centred × | The room above the cap plus 1, at most 6 (4 at 14); the label lifted a quarter of the cap–x-height gap | Owner's notes; Spectrum lifts labels above centre (external.md §5) |
| Tag (label, type 13) | Centred by its line box: cap 1px low | Joins inset.css's cap-trimmed text slots | §7 |
| Tag remove (Compact 13) | A 12 glyph in a 10 box hung from the top: 1 low | The track centres, so it overflows evenly | §7; the 12-in-10 size is still open (handoff) |
| Checkbox group, Radio group | Validation 12 below the options, description a fixed 6 | Field's `ui-stack` (6, compact 4) for both | One label-control-message rhythm across form families |
| Infobox | Content 13 in (padding 12 + border) | 12, the border counted once (Popover's) | §1–2 |
| Description list (framed) | Text and rules 17 in (16 + frame), against its spec's 16 from ChatGPT's outer edge | 16 | §1–2; capture-compare measures from the shell's border box |
| Language illustrations (app) | Header outside Card's content column; ad hoc rows and gaps | Card's slots (header, blocks 12 apart, footer) and Panel's (sections, horizontal Fields 10 apart) | Compose from the components' own spacing |

After: 0 fractional spacing values at both scales; the Card headers' 6 misaligned pairs are 0; Tag and Tag picker have
no centring findings at 13; React 477/477, contracts 14/14, tokens 24,270, typecheck, styles build (parity, token refs).

## Measured, not defects

- **Box edges at fractions** (about 500): widths that hug text (a Button 65.72 wide) and stacks under cap-trimmed text
  (`text-box: trim` plus `0.25em` safety padding gives heights such as 16.94), so what sits below lands on a fraction.
  Chromium snaps box paint to whole pixels, so edges stay crisp; at most a 1px rounding difference between two
  compositions. Rounding would mean reworking the trimmed text slots; not done.
- **Icons after variable-width text** (Split button's chevron, Chip's remove, a trailing Badge icon) start at a fraction
  for the same reason; CSS cannot round a text run's width.
- **Card's 0 / 4 / 12 steps** between title, description and blocks: the owner's spec (title and description joined).
- **Nudges**: state translates (Switch thumb, Progress bar, Color picker thumbs), Indicator anchoring, Calendar markers.
- **Code chip's swatch** (4 in 6, inset 4) and Tag in a Tag picker at sm/md: the floor in the nested-corner rule.
- **Toast and Alert corners** 10 on one line, 12 with a title: documented (a bar on the control curve; a surface).

## Open, for the owner

1. **Popover's gap (16) is wider than its edge (12).** Every system in the research keeps inner gaps at or under the
   container's padding (shadcn's popover 16 / 16, Dialog's 16 / 16). The 12 inset is Cursor's and the 16 gap Notion's
   and shadcn's. Options: gap 12 (inset-surface-sm), or inset 16. Not changed: both are measured specs.
2. **Framed data views add their frame; surfaces count it.** Table's cells are 13 from the outer edge (12 + the frame),
   where Popover is 12, Dialog 16 and Card 16 border included. Description list and Infobox now count it once; Table
   would move 1px.
3. **Tag picker lg** holds md Tags at radius 6 inside a 10 field 7 in; the nested rule gives 4. A 2px corner; fixing it
   needs the field's corner and inset as properties the Tag can read.
4. ~~Icons in Compact's 14px marks~~: owner chose 10px ("go with 10px icons, draw the cuts"); 8 cuts drawn (docs/specs/icons.md "10px cuts").
5. **Tag remove and Badge dismiss** still hold a 12 glyph in a 10 box at Compact 13 (now centred).

## Rerun

```
npm run build && npm run build -w @area/desktop      # then preview_start desktop-dist (4410)
node docs/research/spacing-2026-10-17/sweep/run.mjs out default '{}' light
node docs/research/spacing-2026-10-17/sweep/run.mjs out compact13 '{"type":"13","density":"28"}' light
CHECK_FILE=header-check.js node docs/research/spacing-2026-10-17/sweep/run.mjs out headers '{}' light
CHECK_FILE=column-check.js node docs/research/spacing-2026-10-17/sweep/run.mjs out columns '{}' light menu,nav,list-box
```

`tiles.mjs` captures named tiles for Before / After sheets; `shot.mjs` captures any app element.
