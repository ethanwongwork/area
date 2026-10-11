# Group 6 report

Files & documents and Folders & storage: 61 icons, 9 of them from batch 70 (file-x, file-question, file-clock, file-user, file-zip, folder-cog, folder-sync, book-add, scroll) and 10 from batch 69. I rendered every icon in outline and filled at 16 / 24 / 32 / 48 and 96 with look.mjs, family by family, with the sliver check on (sheets `q6/o1.png` to `o8.png` in the session scratchpad). Each icon was put beside its family base and siblings, including calendar-clock, repository, person-settings and monitor-cog, which belong to other groups and were used for comparison only. I checked every source against its spec construction line. All document-family members copy the document base path for path, folder members copy folder's, and database and server members copy their bases. I also read every owner note for the group. Originals are in `<scratchpad>/before-src/`.

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| file-clock | Both styles, every size. The integration fix (clock moved from 6, 11 to 6, 11.5) left the clock ring 0.5 below the page's base line. The ink box became 13.62 tall, centred at 8.25, while file-lock, file-search and file-user hold 13.12, centred at 8. It also took the 45° hand off the lattice (6, 11.5 → 6.625, 12.125, x − y = −5.5; geometry-audit). The ring and the vertical hand stood on whole-pixel x (3, 6, 9), so at 1× they blurred. The spec line ("centre on the 45° lattice", "base on the page's base line") no longer described the source. | The clock moved to 5.5, 10.5 (x − y = −5, on the lattice), with r 3 and its hands kept: `M5.5 9.5V10.5L6.125 11.125`. The ring's extremes are now all on x.5 (2.5 / 8.5 / 7.5 / 13.5), the vertical hand is on x.5, and the ring sits inside the base line. It overhangs the left edge by 1, as file-search's lens and file-user's figure do. The page ends on the overlap cut r 5.25 about the new centre (`icon-geometry behind`): left edge at 3.5, 5.646, base at 9.413, 14. The filled page stops on the same arc. Ink is 11.12 × 13.12, centred 7.5, 8, the same box as file-search and file-user. Ring to fold is tight (1.18); before the change it was standard (1.76). The filled bite passes just under the fold's curve and leaves no sliver. | Lint ok. Geometry-audit: only the recorded fold diagonal is left. Slivers: none at 16 or 48. Looked at 16–96 and at a 96px crop of the fold corner. |
| file-user | Filled, 48–96. The page's bite is two r 3.75 offset arcs (round the body corner and round the head). They met in a sharp convex point of fill at 8.829, 10.226. This is the defect the owner flagged on file-lock and folder-lock in r3 ("the cutouts … are not very clean edges"), and the 2026-10-07 rule rounds that point r 0.75. | That point now has an r 0.75 fillet tangent to both arcs, solved with the 10-07 `fillet.mjs` method (circle-circle; it reproduces file-lock's points exactly): `…A3.75 3.75 0 0 0 9.301 10.539A0.75 0.75 0 0 1 9.051 9.706A3.75 3.75 0 0 0 3.5 5.328…`. The outline is unchanged. | Lint ok. Geometry-audit: fold diagonal only. Slivers: none at 16 or 48. Looked. |
| folder-sync | Filled, 48–96. The same kind of point: the r 4.486 offset round the mark meets the r 2.25 offset round the upper head's tip at 10.846, 6.165, a 37° convex point of fill. | An r 0.75 fillet: `…A4.486 4.486 0 0 0 11.046 6.117A0.75 0.75 0 0 1 10.665 6.1A2.25 2.25 0 0 0 7.75 8.25…`. The lower junction (r 2.25 → r 4.486 at 7.988, 12.506) is already tangent: the two circles share a radius direction there, so it needs no fillet. The outline is unchanged. | Lint ok. Geometry-audit clean. Slivers: none at 16 or 48. Looked. |

Before/after sheet: `../sheets/group-6-after.png`. The spec's file-clock line in Batch 70 needs updating to "an r 3 ring at 5.5, 10.5 … the page ends on the overlap cut r 5.25 (left edge at 5.646, base at 9.413), tight 1.18 to the fold; ink 11.12 × 13.12, centre 7.5, 8". The 2026-10-10 README's integration note ("moved from 6, 11 to 6, 11.5") is superseded. Both are shared files, so I left them for the coordinator.

## Proposals (not applied)

None. Two options I tried and rejected:
- **folder-cog with file-cog's larger gear** (r 2 ring, teeth to 2.75), so that file-cog and folder-cog would match, as file-lock and folder-lock share one lock. Its bite (r 5) about any lattice centre in the folder's corner eats the folder's whole right wall (at 11, 10 the wall ends at y 6, its top corner), so the folder no longer reads. The delegated r 1.5 gear (person-settings', also server-cog's and monitor-cog's) is the right size.
- **folder-check's check 0.5 lower**, to centre on folder-add's + (9.5; the check's box centre is 9). On the lattice, the only moves are (−0.5, +0.5), which leaves the check 0.25 left of centre and 0.88 from the floor, or (0, +1), which leaves 0.14 to the floor. The owner already left folder-check unchanged (10-07 report), so it stays.

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| overlap-cut bites made of two offset curves | any composite outside group 6 whose filled bite joins two offset arcs without a fillet (candidates to check: person-search, person-pen, calendar-search, mail-check, mail-warning, clock-check) | The 2026-10-07 rule rounds the convex point r 0.75. Batch 70's file-user and folder-sync missed it (fixed here), so the other batch 70 bites may have too. calendar-sync already has its fillet. | Where two bite curves meet at an angle, add the r 0.75 tangent fillet (circle-circle solver as in `2026-10-07/scripts/fillet.mjs`). |
| spec / README record | file-clock | The construction line and the integration note describe the old 6, 11.5 placement. | Update as in the note under Changed. |
| sync mark in containers | folder-sync (0.8 scale, hooks 1.25), calendar-sync and cloud-sync's outline (1.0, hooks 2) | Two sizes of one mark. folder-sync's corner can't take the full mark without eating the folder's wall, so this is recorded rather than a defect. | none; for the record only |

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| document-check | extra stroke below the arrow; check slightly right | holds: one knockout path; the check spans 6–10.5 (centre 8.25), level with the + (y 10) |
| document-remove | r2, no text | holds: − at y 10 with the family, `data-gap="aligned"` |
| files | fold angle more equal, like Lucide; "do this for all document icons" | holds: every page in the group (document family, file-*, files' two pages, file-x, file-question, file-clock, file-user, file-zip) uses the 45° fold; sticky-note's peel the same |
| file-export | arrow connecting line on the right | holds |
| file-download | arrow end sharp one side, round the other | holds: the knockout is inside the page, round both ends |
| file-search | lens filled or stroke; edges not smooth; lens not filled | holds: the lens is a line, and the r 0.75 fillet at the handle offset is in the source |
| file-pen | pen slimmer / like a pen / Fluent | holds: the slim pen (2.12), `data-halo` |
| file-lock | line below the fold too small; negative-space edge not clean | holds: the r 0.75 fillet is in the source. The same note was applied now to file-user and folder-sync (shared shape) |
| file-cog | gear thicker?; filled stroke error at the top near the fold corner | holds: the ⌀2 hub hole; the filled bite clears the fold |
| file-code | r2, no text | holds |
| file-image | fix document fold | holds (the fold base) |
| file-spreadsheet | Fluent; even gaps and margins | holds: all 1.38 |
| sticky-note | fold bigger, as the document fold | holds: 5 × 5 peel |
| notebook | replace → Lucide | holds (rings on x.5, approved split filled) |
| newspaper | Fluent square aligned with the lines; everything even | holds: margins 1.375–1.44 |
| folder-add | filled: only the tab unfilled | holds, and the same in every folder member (the tab stays a line) |
| folder-check | negative space | holds (owner: unchanged; see Proposals) |
| folder-open | replace → Phosphor | holds |
| folder-lock | cutouts not clean edges | holds (fillet). Applied now to folder-sync (shared shape) |
| folder-zip | zipper too big over the teeth; tab unfilled; zipper cut out | holds; file-zip follows the same three rules (tab clear of the teeth, tab a hollow line, teeth holes) |
| archive-restore | arrow back, no circle; top part unfilled | holds |
| cloud-check | stroke on filled | holds: knockout check (round-23 centroid placement) |
| cloud-download | Phosphor moves the arrow up when filled | holds: the inset arrow (rounds 13 / 23) |
| cloud-alert | gap between stem and dot too big | holds: dot 2.25 below the stem |
| database | strokes not correct negative space; filled even | holds: both bands are the same gap; tiers 2.88 / 2.81 |

Batch 70 icons have no owner notes yet. I reviewed their delegated calls (file-x alias, file-user on the corner, file-zip's three teeth, file-question at x 6.5, folder-cog's r 1.5 gear and folder-sync's 0.8 mark in folder-lock's corner, book-add as a closed book, scroll without text lines) and I agree with each. The ? and the ! stand on the same x 6.5 under the fold, and the ? dot sits 2.25 below its stem.

## Machine findings triage

| finding | verdict |
|---|---|
| geometry-audit `lattice` x − y = 6.795 on document, -add, -check, -dismiss, -remove, file-x, file-question, file-clock, file-user, file-zip, file-code, file-cog, file-download, file-export, file-image, file-json, file-lock, file-pen, file-search, file-spreadsheet, file-warning; files (8.795 / 2.795); sticky-note (x + y = 22.795) | recorded exception: the fold's fixed diagonal (owner 2026-10-04) and sticky-note's peel |
| file-clock `lattice` 6, 11.5 → 6.625, 12.125 (knockout) | **fixed** (clock at 5.5, 10.5) |
| file-pen `lattice` x + y = 17.5 / 14.5 (solid) | recorded exception: the pen axis |
| cloud-check, cloud-upload, cloud-download `lattice` (knockout / inset) | recorded: round 23 moved these 0.25 left onto cloud D's centroid |
| book `kink` 12.8° at 8, 5.5 | recorded: the deliberate spine point where the two page tops meet (the M) |
| database-search `kink` 9.4° at 10.5, 6.25 (fill) | false positive: this is the bite's top running into the chord under the lid cut. At x 10.5 the chord is at 6.25, inside the lid's ink (to 6.42) and the lid gap (from 6.39), so it is never visible |
| file-cog `subgap` 0.87 / 2.34; folder-cog and server-cog 0.37 / 0.38 | false positive: these are the gaps between gear-tooth tips, and the teeth join through the ring |
| file-spreadsheet `subgap` 2.41 (knockout) | false positive: diagonal neighbours in the 2 × 2 cell grid (the row and column gaps are 1.38). The whole-pixel row at y 9 is the recorded even-spacing exception |
| slivers 16 / 48: file-cog (16), folder-cog, server-cog "fill beside a line" at the gear | false positive: the solid gear ring beside its plain tooth strokes. person-settings, the approved base, gets the same hit (12.4, 12; 313 / 360 px). Recorded in the 10-07 report |
| slivers 16 / 48: file-zip (7.2, 9.4), folder-zip (three hits) | by design: the one-unit tongues of fill between Fluent's alternating tooth holes join the fill and read as ink (10-07 report for folder-zip; file-zip copies the zipper) |
| optical-audit | every icon is within −5% to +15% in size and −16% to +23% in density. server (+15%) and server-cog (+14%) sit at their keyline (recorded); cloud (−5%, −16% density) is the owner's option D. No action |
| parts: book-add from book 46%, folder-tree from folder 31% | recorded: book-add is the closed book (repository without the ribbon), and folder-tree's small folders drop the flap. The other members are 0–19% at the shift, with their bases copied exactly (compared path by path) |
| escapes.txt, report.txt | empty for this group |

## Checked, no change

- **Document family:** document, document-add, document-remove, document-check, document-dismiss, file-x (identical alias), file-question, file-warning, file-export, file-download, file-code, file-json, file-image, file-spreadsheet, file-diff (the recorded missing dog-ear), file-lock, file-search, file-cog, file-pen, file-zip (ink 13.62 with the tab hanging below, as folder-zip): ok.
- **Pages and books:** files, sticky-note, notebook, book, book-add, scroll, library, newspaper: ok.
- **Folders:** folder, folder-add, folder-remove, folder-check, folder-open, folder-search, folder-lock, folder-cog (r 1.5 gear in folder-lock's place; see Proposals), folder-zip, folders, folder-git, folder-code, folder-tree, folder-input: ok.
- **Storage:** archive, archive-restore, inbox: ok.
- **Clouds:** cloud, cloud-check, cloud-sync, cloud-upload, cloud-download, cloud-alert, cloud-off: ok (round 23 option D; owner-approved or pending only for the centroid move).
- **Data and drives:** database, database-zap, database-search, server, server-cog, hard-drive: ok.

## Verification

- `gen-pilot-icons.mjs --only` is ok for every chunk of the group and for the three changed icons. `geometry-audit.mjs` on the changed icons leaves only the recorded fold diagonal. Slivers: none at 16 or 48 on the changed icons.
- No shared files, other groups' sources or git were touched. The other 58 sources are byte-identical to `before-src`.
