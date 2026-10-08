# Group 6 report

Files, folders and commerce: 60 icons. I rendered every icon in outline and filled at 16, 24, 32, 48 and 96, family by family (sheets `group-6/o1.png` to `o8.png`). I zoomed the contours and hubs to 240 (`group-6-before-zoom240.png`, `group-6-after-3-zoom240.png`) and checked each icon against its spec record and its owner notes. The originals of all 60 sources are in `group-6/orig/`.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| file-cog | Filled, 96–240: the hub was a stroked `gap` round r 0.5625, so it cut a white ring with a black dot of fill left in the middle (an island; the brief's sliver hit at 4.9, 11). | The hub is a whole hole, the same construction as person-settings scaled 2 / 1.5: `<path data-filled="gap" d="M6 11.5A1 1 0 1 1 4 11.5A1 1 0 1 1 6 11.5Z" stroke="none" fill="currentColor"/>` (⌀2; person-settings' hub is ⌀1.5 on an r 1.5 gear). The outline is unchanged. | Lint ok. Slivers: none at 48. At 16 the checker still reports "fill beside a line" at 4.9, 11.1 (552 px; it was 508 before the change). This is the gear ring's fill showing between the six plain tick strokes; the island is gone. person-settings, which uses the same construction, gets the same hit at its gear (12.4, 12; 313 px), so this is the checker, not the drawing. Looked at 240: clean hole. |
| document-remove | Outline and filled: the − sat at y 9.5, 0.5 above the + (document-add), ✓ (document-check) and × (document-dismiss), which all centre on y 10. The owner was asked this question for folder-remove and calendar-remove and chose centring for calendar-remove (`data-gap="aligned"`). The same rule applies to the whole family. | `M6.5 9.5H9.5` → `M6.5 10H9.5`, and `data-gap="aligned"` on the svg. Its gaps to the fold are 2.38 (aligned), as calendar-remove's are to its header. | Lint ok (2.38 aligned). Slivers 16/48 none. Before/after looked (`group-6-after-1.png`). |
| folder-remove | Same case: the − sat at y 9, a whole pixel (blurred at 1×) and 0.5 above folder-add's + (centre 9.5). | `M6.5 9H9.5` → `M6.5 9.5H9.5` (on a pixel centre and centred with the +), `data-gap="aligned"`. | Lint ok (2.38 aligned both sides). Slivers none. Looked. |
| notebook | Outline and filled at 16 / 1×: the three rings sat at y 5 / 8 / 11, whole pixels, so they blurred across two rows. The owner's three-line-stack rule (2026-10-02, text-align / indent) says to move to x.5 and sit 0.5 high. | Rings `M3.5 4.5H6M3.5 7.5H6M3.5 10.5H6` in both styles, still ink stubs in the filled variant. | Lint ok (gaps unchanged). Slivers none. Looked. |
| newspaper | Owner note r2, recorded as open in the spec ("newspaper spacing"): "fix the spacing between the line at the top and the shapes, everything should be all even". The headline sat 1.94 above the picture row while every margin was 1.38–1.44. Filled: the two short lines were 2 apart, which left a 0.875 strip of fill between their knockouts (the brief's sliver hit at 8.7, 9.4). This is the same defect that took files down to one line. | The picture block is now 3 × 3.5 (`y="7.5" height="3.5"`, was y 8, 3 × 3) and the short lines are at y 8 and 10.5 (`M8 8H9.5M8 10.5H9.5`, were 8.5 / 10.5). Every margin and the headline-to-row gap is now 1.375–1.44, the two lines are 1.375 apart, and the lines' outer ink edges still meet the block's top and bottom (±0.06, as before). The page, headline and back page are unchanged, so the ink box and centre (8, 8) hold. One line now sits on the whole pixel y 8 (accepted for even spacing, as file-spreadsheet's rows). | Lint ok. Slivers 16/48: none (the 8.7, 9.4 hit is gone). Looked. |
| file-lock | Filled, 48–240: the page's edge round the lock had a sharp point of fill where the offset of the body corner (r 2.75) meets the offset of the shackle (r 3.25), a 40° kink. This is the owner's r3 note ("outline edge of the negative space is not clean"). | That point rounded with an r 0.75 fillet tangent to both arcs: `…A2.75 2.75 0 0 0 8.344 8.96A0.75 0.75 0 0 1 8.125 8.609A3.25 3.25 0 0 0 3.5 6.617`. The outline is untouched; the cut only gets wider at that point. | Lint ok. Slivers 16/48: none. Looked at 96 and 240 (`group-6-after-2.png`, `-after-3`). |
| folder-lock | The same kink (owner r3: "the cutouts … are not very clean edges"). | The mirror of file-lock's fillet: `…A3.25 3.25 0 0 0 8.375 7.609A0.75 0.75 0 0 1 8.156 7.96A2.75 2.75 0 0 0 7.25 10`. | Same as file-lock. |
| file-search | Filled: a kink where the handle's offset line meets the lens's offset arc (owner r3: "vector ink not very smooth at the edges of the strokes around the search"). | An r 0.75 fillet tangent to the line and the r 4.25 arc: `…L8.919 11.737A0.75 0.75 0 0 1 8.707 11.101A4.25 4.25 0 0 0 3.5 6.369`. | Same as file-lock. |
| cart-add | Filled: the same kind of point of fill between the two r 2.25 overlap-cut arcs round the + (the owner kept the + placement; only the filled contour is touched). | An r 0.75 fillet: `…A2.25 2.25 0 0 0 9.347 6.153A0.75 0.75 0 0 1 9.847 6.653A2.25 2.25 0 0 0 10.969 8`. | Same as file-lock. |

The fillets were solved with `group-6/fillet.mjs` (a circle tangent to both offsets), not placed by eye.

Before/after sheets: `group-6-after-1.png` (file-cog, document-remove, folder-remove, notebook, newspaper), `group-6-after-2.png` (file-lock, folder-lock, file-search, cart-add), `group-6-after-3-zoom240.png` (contours and hub at 240), with `group-6-before-zoom240.png` for the old hub.

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| piggy-bank | Round the bottom. The back arc (r 4.5 about 6.5, 7.5) carries on down to a vertical rear leg at x 3.5 (`V10.854`), the chin is an r 1 quarter round into a vertical front leg at x 11.5, and the feet are 2 wide (3.5–5.5, 9.5–11.5; every vertical on x.5). Head, snout, eye and slot are unchanged. Path: `M6.5 3H8.5A3.5 3.5 0 0 1 12 6.5H13A0.5 0.5 0 0 1 13.5 7V9A0.5 0.5 0 0 1 13 9.5H12.5A1 1 0 0 0 11.5 10.5V13.5H9.5V12.5H5.5V13.5H3.5V10.854A4.5 4.5 0 0 1 6.5 3Z` | Owner note r2, still open (the spec lists "piggy-bank" under "Still open from reviews2"): "more round on the bottom rather than angled at the bottom". The current rear and chin are straight tapers. The owner asked for this, but it reshapes the silhouette, so it goes to the owner's eye. It lints clean (ink 12.62 × 11.62, centre 7.75, 8.25 as now; tight 1.14–1.19). | `group-6/piggy-bank-round.svg` (source), previews `piggy-bank-round-*-preview.svg`, sheet `group-6/piggy-proposal.png` (beside current and Lucide) |
| file-image (with image, cross-group) | Put the ⌀2 sun on a whole-pixel centre, (6, 8): tight 1.27 to the mountain, detail 0.94 to the edge. | The rule says ⌀2 mark dots sit on whole-pixel centres so they fill 2 × 2 pixels at 1×. The sun is at (6, 7.5), and image's own sun is at (10, 5.5). Both should move together, so I did not change file-image alone. | none (one attribute: `cy="8"`) |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| image's sun dot | image (and images, already whole), file-image | image's ⌀2 sun is at (10, 5.5), on a half-pixel y, which breaks the ⌀2 whole-pixel-centre rule. | image: `cy="5"` or `cy="6"`, whichever the gap scale allows. file-image follows with `cy="8"`. |
| small gear hub | person-settings (⌀1.5 hub on r 1.5) vs file-cog (now ⌀2 on r 2, the same ratio) | They are now consistent by scale. The sliver checker flags the fill between the ticks on file-cog's gear at 16. If person-settings shows the same hit, it is the checker reading the gear ring as a sliver between the plain tick strokes, not a drawing defect. | none: person-settings gets the same hit (12.4, 12), so this is a checker false positive. |
| overlap-cut contours (filled) | calendar-clock (another group) uses the same two-arc contour as file-lock and folder-lock | The same convex point of fill where two offset arcs meet. | Fillet r 0.75 tangent to both arcs (`group-6/fillet.mjs` solves it). |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| archive-restore | arrow back direction, no circle; top part unfilled | holds |
| barcode | replace → Fluent | holds (Fluent's barcode_scanner; 2.5 rhythm recorded) |
| basket | Lucide; thicken strokes rather than fill | holds (line glyph, filled by weight) |
| cart | wheels on the bottom stroke, like Lucide | holds (wheel tops at 10.5 = bar) |
| cloud-alert | gap between stem and dot too big | holds (dot 2.25 below the stem, ⌀1.5) |
| cloud-check | stroke on filled | holds (1 / 2 check knocked out) |
| cloud-download | Phosphor moves the arrow up when filled; "later" | holds (open option, not requested) |
| database | strokes not correct negative space; filled even | holds: both bands are the same front-tier gap, and the tiers are 2.88 / 2.81 tall |
| document-check | extra stroke below the arrow; check 0.5 right | holds |
| document-remove | (r2, no text) | fixed now (− centred with the family, aligned) |
| file-code | (r2, no text) | holds (the chevrons' y 9–12 is forced by the 45° lattice; 0.5 up breaks it) |
| file-cog | gear thicker?; stroke error at the fold corner | holds (bottom-left gear); hub island fixed now |
| file-download | arrow end sharp one side, round the other | holds (knockout inside the page) |
| file-export | arrow connecting line on the right | holds |
| file-image | fix the document fold | holds |
| file-lock | line below the fold too small; negative-space edge not clean | holds; contour kink fixed now |
| file-pen | pen slimmer / like a pen / Fluent | holds (slim pen, 2.12, bottom-left, data-halo) |
| file-search | lens filled or stroke?; ink not smooth; lens not filled | holds (lens a line); kink fixed now |
| file-spreadsheet | Fluent; even gaps and margins | holds (all 1.375) |
| files | fold angle more equal, like Lucide | holds (45° fold) |
| folder-add | only the tab unfilled | holds |
| folder-check | (negative space) | holds (owner: "unchanged") |
| folder-lock | negative space; cutouts not clean | holds; contour kink fixed now |
| folder-open | replace → Phosphor | holds |
| folder-zip | zipper overlapped teeth; tab unfilled; zipper cut out | holds |
| newspaper | Fluent square aligned with the lines; spacing all even | fixed now (r2) |
| notebook | replace → Lucide | holds (rings moved to pixel centres) |
| piggy-bank | no line out of the head; more round on the bottom | r1 holds; r2 proposal (candidate drawn) |
| qr-code | bottom-right group bigger; data modules rounder | holds (2.5 × 2.5, r 0.5) |
| receipt | fold behind unfilled | holds (curl a line) |
| sticky-note | fold bigger, as the document fold | holds (5 × 5 peel) |

## Checked, no change
document, document-add, document-check, document-dismiss, files, file-export, file-download, file-pen, file-code, file-diff, file-image, file-spreadsheet, sticky-note, book, library, folder, folder-add, folder-check, folder-open, folder-search, folder-zip, folders, archive, archive-restore, inbox, cloud, cloud-check, cloud-upload, cloud-download, cloud-alert, cloud-off, database, server, hard-drive, cart, shopping-bag, basket, credit-card, wallet, banknote, coins, dollar, currency-euro, piggy-bank (proposal above), receipt, discount, ticket, gift, package, barcode, qr-code

Notes on the ones I checked closely:
- **folder-zip:** its three standing sliver hits are the 1-unit teeth of fill between Fluent's alternating holes, and the 0.94 under the top line. The fill there joins the line, so it reads as ink. They are by design.
- **Kept with their recorded reasons:** wallet's clasp at y 10 (gap scale), archive's slot at y 9 (whole-pixel structure), receipt's lines at 7 / 9.5, notebook's band at x 10 (a 9.5 band fails a 2.38 near miss to the rings; tried, lint failed, reverted), barcode's whole-pixel bars 4 and 9 (the 2.5 rhythm is forced by the filled 1.5 line), and file-diff's missing dog-ear.
- **currency-euro:** 1.88 under its keyline, which is recorded (the type family's 2.5–13.5 cap height).
- **server:** reads +16% in the audit, but it is exactly at its keyline.

## Rules or docs that should change
- The ⌀2 dot rule ("on whole-pixel centres") is not followed by image's sun (10, 5.5) or file-image's (6, 7.5). Either move them or record the exception.
- A `data-filled="gap"` drawn as a stroked closed path round a tiny radius cuts a ring and leaves an island at its centre (file-cog's hub). The skill should say that a hub or hole is `stroke="none" fill="currentColor"` (as person-settings), never a stroked gap. The lint could flag a stroked closed `gap` whose radius is under the line weight.
- Overlap-cut contours built from two offset arcs (file-lock, folder-lock, calendar-clock, cart-add) or an offset line and arc (file-search) leave a convex point of fill where the offsets meet. The skill's "page ends on the overlap cut" rule could add: fillet that point r 0.75 (tangent to both), which only widens the cut.
- The −/+/✓ centring decision for calendar-remove (aligned 2.38) is recorded for calendar only. The skill should say that container − marks centre with the family's + (document-remove and folder-remove now do).
- slivers.mjs flags "fill beside a line" on a solid gear ring with plain tick strokes over it (file-cog, and person-settings the same); it is a false positive for that construction and could ignore fill joined to the plain stroke it touches.

## Verification
- Every changed icon lints clean with `--only`. Before/after looked at 16–96 (`group-6-after-1.png`, `group-6-after-2.png`) and 240 (`group-6-after-3-zoom240.png`).
- Final sliver run, all nine changed icons together with the fixed look.mjs: at 16, only file-cog's gear-tick hit (the same as person-settings'); at 48, none.
- piggy-bank and notebook were edited only for a temporary lint or render and restored exactly; piggy-bank was checked with `cmp` against `orig/`.
- No git, shared, generated or other-group files were touched.
