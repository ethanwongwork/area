# Filled treatment audit: negative space, cutouts, ink (2026-10-09)

Owner: "do more research on how negative space, cutouts, ink, etc are applied across all filled
states, to make sure the treatment is equitable, consistent, and visually makes sense."

Research only. No icon source, spec, skill or generated file was changed. Starting point: the spec sections
"The filled story, 2026-10-04", "Filled consistency audit and the size curve's hold" (2026-10-06) and
"Filled is simple: negative cutouts, not halos" with its Revision table (2026-10-08), the skill's filled
rules, and the owner's reference sheet (mic, database, command, smile, pause, sparkle, pin, atom, speaker,
kanban, send, bug). The owner's approved decisions are kept: notebook's split, no halos, simple filled.

## Files

| file | what |
|---|---|
| `inventory.mjs` → `filled-inventory.json` | every source in `apps/docs/assets/area-icons-pilot` (634; `explore/` and `status/` skipped): roles used, relationship classes, and for each line part where it lies against the solids (core / edge band / outside, with run lengths) |
| `clearance.mjs` → `clearance.json` | for every knockout over a solid: distance to the silhouette's edge (through / graze / thin / clear); for every split ink stub: how far the ink reaches beyond the edge, in line weights |
| `1-crossing-clouds.png` | clouds with a crossing part: Area beside Fluent, Phosphor, Material |
| `2-crossing-notebook-database.png` | notebook, database-zap, database, brain beside references |
| `3a-front-part-printer-truck.png` | open parts in front (printer's sheet, wheels, telescope) |
| `3b-front-part-clipboard-zip.png` | clips, the pasted page, the zip pull |
| `4-front-solid-parted.png` | solid objects in front (pen, lock, clock, cap) and the eyedropper |
| `5-badges-beside.png` | badges beside a body (person +, sparkle, dots, cloud check) |
| `6-attached-parts.png` | attached parts meeting the edge (mic stem, needle, clapper, pegs) |
| `7-back-parts.png` | back layers kept as lines (bandage, copy, folder-open, clipboard-paste) |
| `8-flagged-misc.png` | other icons the machine pass flagged (repository, api, archive-restore, folder-input, send, leaf, brain-off, timer-off, unpin, import, server-cog, person-settings) |
| `q1-split-stub-length.png` | open question 1: split stub length (current vs. lengthened) |
| `q2-wall-crossings.png` | open questions 2 and 6: database-zap's notch, cloud-sync split vs. inside |
| `q3-badge-front-back.png` | open questions 3–5: chat-sparkle, clipboard-paste, eyedropper |

Rerun: `node docs/research/icon-review/2026-10-09/inventory.mjs` (8 s) and `clearance.mjs` (~100 s). Sheets:
`node docs/research/icon-review/2026-10-07/look.mjs <out.png> <names> <ref.svg…>`. Candidates (`q*-…`) were drawn in a
scratch copy of the generator and assets, not in the repo.

## 1. Inventory (machine)

634 sources, 453 with a solid body, 181 line glyphs.

Roles (icons using each): ink (unmarked stroke) 429, solid 368, knockout 145, fill 118, line 110, hole 67,
gap 60, cut 34, slash 25, data-halo 20, stroke 10, halo 8, inset 4.

| class | icons | meaning (how it is measured) |
|---|---|---|
| line-glyph | 181 | no solid; filled by weight |
| ink-attached | 171 | an unmarked stroke that touches the solid's edge band but not its core (stems, legs, pegs, handles) |
| mark-inside | 130 | a knockout wholly over the solid (≥ 96 % in the core) |
| multi-solid | 113 | two or more solids |
| ink-beside | 108 | an unmarked stroke that never touches a solid |
| hole | 67 | an opening cut out whole |
| gap-seam | 45 | a stroked gap (a seam between layers, slash gaps included) |
| cut | 34 | a layer line run through the silhouette |
| slash | 25 | the shared slash (22 icons with the slash gap; 3 more classed by the outline slash) |
| data-halo-front | 20 | a solid in front parted by one weight: bell-dot, bot-scholar, chat-dot, cloud-sun, coins, compass-dot, crystal-ball, devices, file-pen, graduation-cap, mail-dot, people, person-key, person-lock, person-settings, pipeline, server-cog, smile-plus, square-badge, telescope |
| gap-front-cutout | 20 | an unstroked gap clearing the inside of a part in front |
| knockout-meets-edge | 14 | a knockout ending on the silhouette (sawn): banknote, basketball, bot-builder, bot-designer, chess-rook, database-zap, film, globe, paintbrush, pen-tool, ruler, save, ticket, umbrella |
| halo | 8 | chat-sparkle, person-add, person-check, person-lock, person-remove, person-settings, person-x, server-cog |
| open-part-crosses-edge | 7 | a closed part in front kept as a line, its inside cleared: clipboard, clipboard-check, clipboard-list, clipboard-paste, printer, telescope, truck |
| open-part-over-body | 1 | the same, wholly over the body: folder-zip |
| inset | 4 | brain, brain-off, cloud-sync, database-zap |
| split-crossing | 4 | knockout over the body + clipped ink beyond: cloud-download, cloud-lightning, cloud-upload, notebook |
| ink-over-solid | 3 | api, eyedropper, repository (ink lying on the fill; each has a cut or gap that makes it read) |
| ink-crosses-edge | 1 | bandage (the back band runs under the front band; correct as drawn) |

## 2. Relationship taxonomy and where Area is inconsistent

| # | relationship to the body | Area treatment now | icons | consistent? |
|---|---|---|---|---|
| R1 | mark wholly inside (+, ✓, text lines, hands, keyhole) | knockout | 130 | yes |
| R2 | line crossing the edge in front, with ink beyond it in the outline (arrow over a cloud, bolt, rings) | split: knockout over the body, ink beyond | 4 (cloud-upload, -download, -lightning, notebook) | yes, but stub lengths are unequal (§4) |
| R2x | the same, but the part beyond hugs the edge | inset (moved inside) | cloud-sync | exception (q2 sheet: split fuses the lower arrow into the foot) |
| R3 | line that ends on the edge (the outline breaks the wall where the line enters; nothing beyond) | knockout sawn through the edge | archive-restore, folder-input, brain/brain-off folds, the 14 knockout-meets-edge | yes, except database-zap: the bolt's vertex grazes the wall and leaves a notch |
| R4 | attached part meeting the edge (stem, needle, pegs, legs, clapper, waves) | ink | 171 | yes |
| R5 | closed part in front that is a frame (sheet, clip, wheel, pivot ring, zip pull) | kept as a line, inside cleared, no gap round it | 8 (printer, truck, telescope's ring, clipboard ×3, clipboard-paste, folder-zip) | yes, except clipboard-paste (below) |
| R6 | solid object in front with its own identity (pen, lock, clock, gear, coin, figure, objective) | its own solid, parted by one weight (data-halo) | 20 | yes; eyedropper's glass tube is filled (below) |
| R7 | separate badge beside (dot, +, ✓, gear, sparkle) | bite: closed shapes fill (dots, gear), line marks stay lines (person +, ✓, ×) | ~16 | yes, except chat-sparkle (its sparkle stays an outline with a halo over the bubble) |
| R8 | stacked layers / seams / faces of equal standing | gap or cut at one weight | 45 + 34 | yes |
| R9 | secondary parts (lid, tab, header, page behind, back band) | line; the body fill stops at the part | ~110 (line role) | yes |
| R10 | slash | slash gap | 25 | yes |
| R11 | line glyph | filled by weight | 181 | yes |

### Inconsistent icons

| icon | relationship | now | why it is out of line |
|---|---|---|---|
| clipboard-paste | R5 / R9 (front page over a board) | the board fills; the front page stays open | the opposite of copy, files, folder-open (front fills, back stays a line), of Fluent's clipboard_paste (board line, page solid), and of the spec's own P2 record ("the front sheet is the body and fills; the board behind… stays lines") |
| chat-sparkle | R7 (badge) | outline sparkle with a `halo` cut into the bubble | the last halo over a body (the owner retired halos); every other badge with a closed shape fills (chat-dot, bell-dot, server-cog's gear); Fluent's chat_sparkle and the owner's reference sheet fill the sparkle |
| eyedropper | R6 + glass | bulb and tube both fill | "glass stays open" (car's cabin); Fluent and Phosphor fill the bulb and keep the tube a line |
| database-zap | R3 | bolt knockout whose right vertex sits on the wall's centre-line | the only knockout that grazes the edge at a vertex (clearance 0.02 w): a notch in the wall, not a crossing; at 16px the bolt barely reads. A full-size bolt cannot sit inside with detail gaps, and a true crossing exceeds the keyline (lint: 13.38 > 13) |
| cloud-upload, cloud-download | R2 | stubs reach 1.34 weights beyond the foot | cloud-lightning's reaches 1.78; at 16px a 1.5px stub reads as a dot under the cloud |
| notebook | R2 | rings reach 0.89 w | below every other stub; approved by the owner, works by rhythm (three in a row) |
| cloud-sync | R2x | `inset` | differs from its siblings by design; the split was tried (q2) and fuses |

Role-only (no visual change): brain and brain-off use `inset` for folds that start at the edge (they render as
sawn knockouts); database-zap uses `inset` for the middle seam's gap extension; the six person badges and
server-cog use `halo` to make a bite round a line mark (it renders as a bite, as R7 asks). Stale text: the
skill still describes `halo` with cloud-lightning as its example and says a crossing arrow's part beyond the
edge "is not drawn"; both predate the 2026-10-08 revision.

Checked and consistent (named in the brief): printer's paper, folder-zip's pull, truck's wheels, telescope's
ring, the clipboard clips (R5); bandage (R9: front band fills, back band a line, Phosphor's bandaids);
data-halo front solids (R6, Fluent document_edit / document_lock / calendar_clock, Material edit_document).

## 3. References

Sheets 1–7. Per concept, the treatment each library uses:

| concept | Fluent filled | Phosphor fill | Material filled | Area now |
|---|---|---|---|---|
| cloud-upload / -download | arrow in a badge circle beside the cloud (bite) | arrow knockout wholly inside | arrow knockout; the shaft runs out through the foot (sawn) | split |
| cloud-lightning | bolt ink, cloud cut round it (halo) | bolt merged ink, running out of the cloud | bolts below, separate | split |
| cloud-sync | sync in a badge circle (bite) | – | – (not rendered) | inset |
| notebook / book | rings as separate ink stubs beside the cover | spine band as a cut, no rings | book_2: page edge as a cut | split rings, band cut |
| database | one solid (no seams) | seams as gaps | seams as gaps | seams as gaps |
| calendar | header parted by a gap, dots knockouts, no pegs | – | (calendar_month, not rendered) | pegs ink, dots knockouts |
| clipboard / -check | clip merged, its inside knocked out; ✓ knockout | clip cut into the board (clipboard-text) | content_paste: board stays a frame, clip ink; assignment_turned_in: clip ink, ✓ knockout | clip kept as line, inside cleared; ✓ knockout |
| clipboard-paste | board line, front page solid | – | – | board solid, page open |
| printer | sheet open (frame), body solid | sheet open | sheet open | sheet open |
| truck | wheels solid with a hole | wheels rings | wheels rings | wheels rings |
| folder-zip | pull solid with a hole, parted from the body | – | teeth knockouts, no pull | pull ring over the body, inside cleared |
| person-add | + in a badge circle (bite) | + line beside | + line beside | + line beside (bite) |
| chat + sparkle | sparkle solid, bite | – | chat_add_on: + line beside | outline sparkle, halo |
| file + pen | pen solid, parted by a gap | (folder-lock: lock solid, folder stays a line) | pen solid, parted | pen solid, parted |
| eyedropper | bulb solid, tube a line | bulb solid, tube a line | – | both solid |
| bandage | – | front band solid, back band a line, dots knocked out | both bands solid, dots knocked out | front solid, back a line |
| pushpin | head solid, needle ink | head solid, needle ink | head solid, needle ink | head solid, needle ink |
| mic | capsule solid, stand ink | same | same | same |
| bell + dot | dot solid, bite | (bell-ringing: waves ink) | dot solid, bite | dot solid, bite |

**Where they agree** (and Area matches): marks inside are knockouts; attached parts (stems, needles, pegs,
waves) stay ink; a front object with identity is its own solid parted by a gap; a frame in front (printer's
sheet) stays open; badges beside take a bite; dots and closed badges fill; back layers are lines in Phosphor
and Material (Fluent fills both copies).

**Where they disagree:** a part crossing the edge. Each library avoids the crossing rather than painting it:
Fluent moves the arrow into a badge or halos the bolt, Phosphor moves the arrow inside or merges the bolt,
Material saws the shaft through the foot. **No library uses Area's split (knockout inside, ink outside).**
It is Area's own answer, and the only one that keeps the outline's geometry unchanged in both styles, which is
why the owner chose it. The evidence supports keeping it with the guards below; it does not say it is wrong,
only that it has no reference to follow, so its edge cases have to be set by measurement.

## 4. Visual sense check of the split

`clearance.json`, weights at 16px (1 w = 1.125 drawing units):

| icon | part | visible reach beyond the edge (cap included) | reads at 16 as |
|---|---|---|---|
| cloud-lightning | bolt tail | 1.78 w | a tail |
| cloud-upload | shaft tail | 1.34 w | a dot |
| cloud-download | arrow tip | 1.34 w (a 1.9-wide flat-topped tick) | a tick |
| notebook | three rings | 0.89 w each | teeth (works by rhythm) |

Knockouts against the edge: 18 "graze" hits, all but one ends placed on the outline's centre-line and sawn out
by the generator (intended: save, ruler, globe, film…). The exception is **database-zap's bolt vertex**: it
touches the wall's outer edge at a corner, so the wall gets a notch, not a crossing. "Thin" (under one weight of
fill left): brain and brain-off folds (0.18 w), send's fold at its tip (0.14 w), leaf's midrib tip (0.51 w),
cloud-sync's inset arrows (0.90 w); globe's parallels end on the edge (sawn).

**Proposed guards** (objective, checkable by `clearance.mjs`):

- **G1, stub length:** a single split part reaches at least **1.5 w** beyond the silhouette (cap
  included), so the end reads as a line, not a dot. Below that, lengthen the part in both styles; if it can't
  lengthen, treat it as R3 (sawn, nothing beyond). A row of equal stubs (rings, teeth) may go down to 0.9 w,
  because the rhythm carries it. Today: cloud-upload and cloud-download fail (1.34); lengthening the shaft and
  tip to y 14.5 gives 1.78 w, equal to cloud-lightning (q1 sheet), so the family matches.
- **G2, no grazes:** a knockout vertex or side either crosses the edge cleanly (its centre-line leaves the
  silhouette) or leaves at least 1 w of fill outside it. A cut that just touches the edge reads as a notch.
  Today: database-zap only.
- **G3, fill beside a crossing:** where a crossing part runs inside the body, at least 1 w of fill stays on
  each side; where it ends inside, it ends at least 1 w from the edge. Today: the four split icons pass.
- **G4, the part beyond must leave the edge:** if the ink beyond runs along the edge within 1 w (it hugs the
  silhouette rather than leaving it), it fuses with the body. Move the part inside instead (cloud-sync's
  inset is the one case; q2 shows the fused split).

## 5. Recommendation

| relationship | recommended filled treatment | reference support | Area icons that would change |
|---|---|---|---|
| R1 mark inside | knockout | all three | 0 |
| R2 line crossing the edge, ink beyond in the outline | split (owner-approved), with G1–G3 | none; Area's own answer (libraries avoid the crossing) | 2: cloud-upload, cloud-download (lengthen to 1.78 w, optional, q1). notebook kept (rhythm exception) |
| R2x crossing part that hugs the edge beyond | moved inside (inset) as the documented exception (G4) | Phosphor (arrows inside) | 0 (cloud-sync stays) |
| R3 line ending on the edge | knockout sawn through the edge; no vertex may graze (G2) | Material (sawn shaft), Phosphor brain | 1: database-zap (q2: smaller bolt inside, or keep the notch) |
| R4 attached part meeting the edge | ink | all three | 0 |
| R5 frame in front (sheet, clip, wheel, ring, pull) | kept as a line, inside cleared, no gap | Fluent print, Phosphor printer/truck, Material print/shipping | 0 |
| R5b page in front of a board (multiples) | front fills, back stays a line | Fluent clipboard_paste, copy rule, Phosphor/Material copy | 1: clipboard-paste (q3) |
| R6 solid object in front with identity | own solid parted by one weight | Fluent document_edit/lock, calendar_clock; Material edit_document | 0 |
| R6b glass part | stays open | Fluent and Phosphor eyedropper; car's cabin rule | 1: eyedropper (q3) |
| R7 badge beside | bite; a closed badge fills, a line mark stays a line | Fluent chat_sparkle, alert_badge; Material notifications_unread, person_add | 1: chat-sparkle (solid sparkle with bite, q3) |
| R8 layers, seams, faces | gap or cut at one weight | Phosphor/Material database, Fluent calendar header | 0 |
| R9 secondary parts | line, the body stops at the part | Phosphor bandaids, folder-open; Material copy | 0 |
| R10 slash | slash gap | all three | 0 |
| R11 line glyph | by weight | Fluent (1 → 1.5) | 0 |

Total visual changes: 5 icons (6 with database-zap's option B). Role-only cleanups with no visual
change: `inset` → `knockout` in brain and brain-off, `inset` → `gap` for database-zap's seam, and the halo-as-bite
role in the person badges and server-cog. The skill's halo and "the part beyond the edge is not drawn" lines
need the 2026-10-08 wording.

Nothing in the evidence argues for reversing the owner's decisions. No halos: after chat-sparkle, the only halo
left would be the bite round line badges, which reads as a bite. Notebook's split is fine at 0.89 w because of
the rhythm. The references support "simple filled" everywhere except the crossing case, where Area's split is a
deliberate departure.

## Open questions (rendered)

1. **Equal stubs on the clouds?** `q1-split-stub-length.png`: cloud-upload and cloud-download now (1.34 w)
   vs. `-b` (shaft and tip to 14.5, 1.78 w, equal to cloud-lightning). Also notebook vs. `q1-notebook-b`
   (rings start at x 3: 1.33 w).
2. **database-zap's notch.** `q2-wall-crossings.png`: now (the vertex notches the wall) vs. `-b` (a smaller
   3 × 2 bolt inside the cylinder, full right wall, ≥ 1 w of fill round it). A full-size bolt has no
   lint-clean place inside, and a true crossing exceeds the keyline.
3. **chat-sparkle's sparkle.** `q3-badge-front-back.png`: an outline sparkle with a halo (now) vs. a solid
   sparkle with a bite (`-b`, as chat-dot and Fluent).
4. **clipboard-paste.** Same sheet: board solid, page open (now) vs. board a line, page solid (`-b`, Fluent,
   copy).
5. **eyedropper.** Same sheet: tube filled (now) vs. bulb solid, glass tube open (`-b`, Fluent, Phosphor).
6. **cloud-sync.** `q2-wall-crossings.png`: inside (now) vs. split (`-b`): the lower arrow lies beyond the
   foot and fuses with it. Recommendation: keep it inside as the G4 exception.
