# Group 10 report (places & travel, security, time & calendar; 57 icons)

Method: every icon was rendered outline and filled at 16 / 24 / 32 / 48 and at 96 (look.mjs, `--slivers` at 16 and 48),
family by family. Each was checked beside its base and siblings: the calendar family, the clock family (clock, clock-alert,
clock-check, alarm, timer, calendar-clock), the shield family, the location pin, and the slash family (bell-off, timer-off).
The batch-70 icons were also checked against Lucide (globe-off, alarm-clock-off, shield-cog), Fluent (globe_off regular and
filled) and their own construction lines. Working sheets and candidates are in the scratchpad's `q10/`. Originals are in
`before-src/`. Sheets: `sheets/group-10-after.png` (before/after, all nine changed icons) and `sheets/group-10-proposals.png`. All 57 sources lint
clean (`--only`, the whole group). Slivers and islands: none at 16 or 48 on every changed icon. geometry-audit is clean on
every changed icon except globe-off's known subgap (see triage).

## Changed (applied to sources)

Five are batch-70 icons, so they were already in review. Four approved icons (car, plane, home, building) changed only to remove strokes drawn twice in the outline. Nothing visible changed in either style apart from the doubled antialiasing, but they go back into review. A clock-check change was tried and then reverted; see Proposals.

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| calendar-sync | **Both styles, every size.** cloud-sync's mark was moved (3.5, −0.5), which put both hook verticals on whole pixels (x 9 and 14). At 1× they smear across two grey columns. The mark also ran 0.5 past the frame, so the ink box was 12.62 wide with its centre at 8.25. Every other calendar is 12.12 wide with its centre at 8, 7.75, and calendar-clock's ring stops on the frame line. | The mark is moved (3, −0.5) instead, so the hooks are on x.5 (8.5 and 13.5), as in cloud-sync. The arcs are unchanged: r 2.795 about 11, 10.25. The right hook now lies on the frame's right line, as calendar-clock's ring and calendar-search's handle do. The cuts were re-solved with `cutAround` (`q10/sync.mjs`): the frame now ends at 7.141, 13.5 and 13.5, 5.868, and the header ends at 6.306. The filled bite is the old one moved −0.5 in x, which is exact because the bite is the mark's offset: `H6.306A2.25 … 6.25 7V8.425A0.75 … 6.212 8.661A5.045 … 7.141 13.5`. Ink 12.12 × 12.62, centre 8, 7.75. The header-to-hook gap is detail 1.12 and the lower-hook-to-frame gap is tight 1.38. | lint ok; geometry-audit clean; slivers 16 / 48 none; looked beside calendar-clock and calendar-search |
| alarm-off | **Outline and filled, every size.** alarm's right leg (11.182, 12.182 → 12.5, 13.5, on x − y = −1) runs parallel to the slash's end (x − y = 0), 0.71 away between centre-lines. At every size the two strokes merge into one thick slash end. This is the same reason the drawer gave for dropping the hand. Lucide's alarm-clock-off drops this leg too. | The right leg is removed. The left leg, both bells and the ring are unchanged. `data-counter="sliver"` stays: the 0.29 pocket the lint reports is where the slash crosses the left bell near the ring, not at the leg. The spec's reason ("the right leg lies 0.71 beside the slash's end") should change to that. A stale `data-angles="free"` is also removed (it lints without it). | lint ok; geometry-audit clean; slivers none; looked beside alarm, bell-off, timer-off and Lucide |
| calendar-off, calendar-search, globe-off | A stale `data-angles="free"` turned off the lint's lattice check, although none of these icons has a free angle. Most of the calendar family and timer carry the same stale flag, and in the 2026-10-07 pass it hid off-lattice checks in three icons. | The attribute is removed. Nothing visible changes, and all three lint clean with the lattice check back on. | lint ok; geometry-audit (globe-off: the known subgap only) |
| globe-off (also), car, plane, home, building | **Outline at 1×: strokes drawn twice** (coordinator, from group 8; scan `q8/dups.mjs`). globe-off drew its meridians and parallels both as outline `line`s and as `knockout`s, and knockouts also draw in the outline. car's body path closed along y 6.5 (2.5 → 13.5) under the mirror line. plane's wing closed along y 10 (7 → 11) on the fuselage's bottom edge. home and building drew the base under the door three times: the solid's bottom, the door hole's closing `Z`, and the base line. Doubled antialiasing darkens those edges at 1×, the defect flag-off's pole had on 10-07. | globe-off: the outline `line`s are now only the pieces the knockouts don't cover (`M8 2A10 10 0 0 0 6.169 6.169M9.831 9.831A10 10 0 0 0 9.798 6`, `M10 10H13.657`), so each stroke is drawn once in the outline and the filled cut is unchanged. car and plane: the solid is left open along the shared edge (`…13.5 12.5V6.5`; `…6.219 12.342L7 10`). The fill closes on the same chord, and the mirror line and fuselage still draw that edge. home and building: the door hole is left open at the bottom (no `Z`), and the base line under the door is `data-filled="stroke"` (filled only), since in the outline the solid's bottom edge already draws it. The filled result is unchanged: the base still covers the door's foot. | lint ok; dups.mjs: only shield-user's 0.44 arc at the shield's tip is left (see triage); slivers 16 / 48 none; before/after identical apart from the doubled antialiasing (`group-10-after.png`) |

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| shield-cog | The gear at the shield's mark size: an r 2 ring with six teeth from 2 to 3, centred at 8, 8, so it spans 5–11 like shield-plus's + and shield-check's check. The tooth gap to the shoulders is tight 1.61. Filled: the ring is a knockout and its centre stays solid as the hub (monitor-cog's construction). | The delegated note says the gear reads smaller than shield-check's check. Lucide's shield-cog uses a gear about this size. I didn't apply it: line-weight teeth on a larger ring start to read as a sun at 32 and 48, and the r 1.5 gear is the shared composite gear (person-settings, monitor-cog, folder-cog, server-cog). It is the owner's call whether the shield takes the ring's mark size here. | `q10/cand-shield-cog.svg`; sheet `group-10-proposals.png` (before = current, after = candidate) |
| clock-check | person-check's 1.5 / 3 check, `M9.5 12.5L11 14L14 11`, in place of copy-check's 1 / 2 check, with the ring cut round it at `M7.821 13.997A6 … 13.953 8.75`. It lints and is on the lattice. It reads at 16, where the current check is a speck. | I applied this first and then reverted it, because the filled variant fails in both drawings and only the placement can fix that. The clock's 45° hand points straight at the lower-right check. Current drawing: the hand's knockout and the check's halo are 0.30 apart at 16 (2.55 − 0.5625 − 1.6875), a hair of fill, and they merge from 24 up as the line grows. Candidate: the halo kisses the hand tip (0.01) and leaves a 0.58 sliver of fill between the hand and the long arm's halo. Both drawings also have the unfilleted convex point the coordinator asked about: the halo's offsets of the two arms meet at a sharp point of fill inside the check's V, and a halo can't take a fillet. The only lattice spot for the 1.5 / 3 check is (11, 14), and the lower-left alternatives leave the same 0.58 sliver against the hand. The owner should choose a placement (or accept a small check away from the hand). Then convert the filled variant to an explicit bite with an r 0.75 fillet, as calendar-sync and clock-alert are built. | `q10/cand-clock-check.svg`; sheet `group-10-proposals.png` (before = current, after = candidate) |
| plane, lock, unlock | Still open from 2026-10-07 and not redrawn: plane is 1.88 under its keyline and −16% in the optical audit; lock and unlock are 1.88 under theirs and −11%. | Unchanged since that pass. The candidates are in its group-9 report. | 2026-10-07 `groups/group-9/` |

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| batches.json status | car, plane, home, building | Their sources changed (doubled strokes only; no design change) | `icons:batch --review` for these four, or keep them approved if the owner accepts invisible source fixes |
| spec, batch 70 rows | calendar-sync, alarm-off | The construction lines no longer match the sources | calendar-sync: "moved 3, −0.5 … hooks at x 8.5 and 13.5 (x.5, crisp), the right hook on the frame's right line; frame ends 7.141 / 5.868, header 6.306; ink 12.12 × 12.62, centre 8, 7.75; the bite moved −0.5". alarm-off: "the right leg is dropped too (it ran 0.71 beside the slash's end); data-counter sliver for the slash crossing the left bell". Also remove the call "calendar-sync: the mark runs 0.5 past the frame" from the 2026-10-10 README. The clock-check call "the 1.5 / 3 check doesn't fit" is wrong as stated: the check fits at (11, 14). The real reason against it is the filled conflict with the hand (Proposals). |
| spec record (store) | store | The spec row says "home's arched door (6.5–9.5, r 1.5 arch)". Since batch 69's commit, every door in home, store and building is 3 wide with r 1 corners (heights 5 / 3.5 / 2.5). | Record correction only |
| stale `data-angles="free"` | store, globe, unlock, fingerprint, shield, shield-check, shield-plus, shield-x, shield-alert, shield-lock, shield-user, shield-off, timer, timer-off, calendar-add, calendar-remove, calendar-x, calendar-clock (all in this group, all approved) | Each one lints clean without the flag, so the lint's lattice guard is off for no reason. I didn't remove them, because that would put approved icons back into review with nothing visible changed. | Remove the attribute in one batch, if the coordinator wants these icons reopened. bank, map, location (and -off / -add), navigation, compass (and -dot), car, truck, plane, rocket and shield-cog need it. |
| gear mark | folder-cog, monitor-cog, server-cog, person-settings | Only if the shield-cog proposal is taken: decide whether contained gears grow to the container's mark size | none now |

## Coordinator's check: unfilleted convex points where two offset curves of a bite meet

| icon | bite | result |
|---|---|---|
| calendar-sync | r 2.25 round the upper hook and r 5.045 about the mark | already filleted r 0.75; the fillet moved with the mark (−0.5 in x) |
| calendar-search | one r 4.25 arc about the lens, meeting the frame's right and bottom lines | no two-offset meeting; ok |
| calendar-clock | one r 5.75 arc | ok |
| clock-alert | r 2.4375 round the ! dot meeting the stem's offset line x 4.75, at 4.75, 12.563 | A convex point, but a soft 157° corner (a 22.6° bend), not the sharp point of file-user and folder-sync. An r 0.75 fillet would move the edge about 0.15 there. Not changed, because the icon is approved; trivial to add if the coordinator wants every such point rounded. |
| clock-check | the generator's halo round the check | Yes: a sharp 90° point of fill inside the check's V where the two arms' offsets meet. It is not fixed, because the fix is tied to the hand conflict; see Proposals. |
| alarm-off, calendar-off, globe-off, timer-off, shield-off, location-off | the shared slash gap (a straight cut) | no bite; ok |
| compass-dot | the notification dot's round bite | one arc; ok |

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| home | "filled can have a bottom line … see if there are other icons like this" | holds: home and building keep the base line under the filled door hole; store's body stays a line when filled, so its door is a line |
| store | "door shape consistent with house and hotel" | holds: all three doors are 3 wide with r 1 corners; heights follow the space (record correction above) |
| building | r2 replace → Fluent | holds (10-07 Fluent redraw) |
| bank | r, r2 replace → Fluent | holds (10-07: one plinth, five columns) |
| globe | "each section is 1/3" | holds (parallels 6 / 10). globe-off copies them |
| map | "panels more even"; r2 "fill left and right, middle unfilled" | holds |
| car | r2 "wider, wheels align with the lines" | holds (10-07) |
| truck | replace → Phosphor | holds |
| plane | "tail smaller, body bigger"; r2 "add a window" | holds; enlarging is still open (Proposals) |
| key | r2 replace → Phosphor | holds (10-07 Phosphor key) |
| fingerprint | r2 "lines on the same track" | holds (concentric arcs) |
| scan-face | r2 "face more centered" | holds |
| vault | r2 "stuff in the middle more centered" | holds (Fluent's 13 × 9) |
| calendar | "top bars extend further into the top"; r2 "top part unfilled" | holds (pegs 2 → 4.5; header open when filled). The batch-70 calendars follow both: calendar-off, -search and -sync keep the header open and pegs 2 → 4.5 |
| calendar-add, -remove, -check | r2 "top part unfilled" | holds |
| calendar-clock | r3 "outline negative space of the circle is weird on the edge" | holds: the body fill ends on the overlap-cut arc concentric with the clock, one weight clear at every size |

## Machine findings triage

| finding | icon | verdict |
|---|---|---|
| kink 22.6° at 4.75, 12.56 (fill) | clock-alert | Left as it is. It is the convex point where the bite round the ! dot meets the stem's offset line. It is a soft 157° corner and doesn't show at 96. The r 0.75 rounding rule could apply if the owner wants it, but the icon is approved, so I didn't change it. |
| subgap 2.44 between subpaths 1 and 2 (knockout) | globe-off | False positive: these are two knockout pieces, so the 2.44 between them is fill, not a gap between strokes. The sliver check is clean at 16 and 48. |
| lattice ×9 | rocket | Recorded exception (rocket is in the skill's free-angle list) |
| kinks 3.4° / 5.7° / 7.9° at the tip, shoulders and peak | shield and its 8 variants | Recorded: the shield's own deliberate corners, copied exactly from the base |
| subgap 0.37 ×6 | shield-cog | False positive: these are the gaps between neighbouring teeth at the ring, and the ring joins the teeth there. At the tips they are 1.87 apart. |
| slivers-48: truck, fill beside a line | truck | Recorded (spec: the truck's cab keeps a thin edge at 48) |
| parts drift 21% / 19% / 15% … | calendar-sync, -search, -clock, -remove, -off, -add, -check, -x | Expected: each variant drops the date grid and cuts the frame round its mark. The bases' paths are copied exactly. calendar-sync's "moved 0.25, 0" is fixed by the change above. |
| parts "moved 0, −0.25" | shield family, globe-off, location-off, timer-off, alarm-off | A measurement artefact: the base paths are byte-identical |
| optical: globe +49%, globe-off +55% density | globe, globe-off | Recorded: the owner asked for the 1/3 parallels and the lens meridian |
| optical: bank +31% density | bank | Recorded owner pick (Fluent building_bank) |
| optical: navigation, plane −16%; anchor, locate −12%; milestone, location, location-add, lock, unlock −11% | — | navigation is diagonal and reads small by hull, a known class. plane, lock and unlock are open proposals. The location pin and anchor are pointed or sparse and fill their keylines. |
| lint: 1.88 under keyline | plane, lock, unlock | Open proposals (above) |
| (not flagged) clock-check filled: hand knockout 0.30 from the check's halo at 16, merging above 24 | clock-check | Real, and missed by slivers.mjs. Not fixed: it needs a placement decision (Proposals) |
| dups.mjs (coordinator, from group 8): strokes drawn twice in the outline | globe-off, car, plane, home, building | fixed (Changed) |
| dups.mjs: shield-user, elements 0 & 2, arc 8.22, 14.4 → 7.78, 14.4 | shield-user | Left as it is: the body's bottom follows the shield's 0.44-long tip arc, by construction. Splitting the shield path there would reopen an approved icon for a sub-pixel overlap. |
| geometry-audit: globe-off subgap 2.36 between line subpaths 1 and 2 (new) | globe-off | False positive: the outline line pieces now alternate with the knockout pieces, which close the space between them in the outline |
| report: alarm-off counter 0.29 | alarm-off | Recorded `data-counter="sliver"` (the slash crossing the left bell); its reason is updated above |
| report: building / calendar 2.04 / 2.22 aligned | building, calendar | Recorded `data-gap="aligned"` (owner / delegated) |

## Checked, no change

store, bank, globe, map, location, location-off, locate, navigation, compass, compass-dot, route, target,
crosshair, goal, truck, rocket, anchor, milestone, lock, unlock, key, password, fingerprint, scan-face, shield,
shield-check, shield-plus, shield-x, shield-alert, shield-lock, shield-user, shield-off, vault, clock, clock-alert, alarm,
timer, timer-off, hourglass, calendar, calendar-add, calendar-remove, calendar-check, calendar-x, calendar-clock: ok. (home, building, car and plane changed only for the doubled strokes; their designs are as approved.)
location-add and shield-cog (current drawing; see the proposal) are also ok. clock-check is unchanged, with open issues (Proposals).

Notes from the pass:
- **Calendar family:** every variant copies the frame, header (6.5) and pegs (2 → 4.5) exactly and drops the grid. Marks are
  the container sizes: the 3px + and −, the 3 × 3 × (document-dismiss's) and document-check's 1.5 / 3 check, all centred in
  the body. The corner marks (clock, lens, sync) now all end on the frame's right and bottom lines.
- **Clock family:** every face uses clock's hands (a vertical hand, then 45° down-right). alarm-off and timer-off drop
  their hands under the slash (recorded).
- **calendar-off:** the left peg's end lies 0.71 from the slash in the outline (they touch). I kept it, because the owner's
  rule is to keep the base icon whole under the slash. The filled variant drops it (delegated), and Lucide drops it in both
  styles. If the owner prefers Lucide's version, drop it from the outline too.
- **globe-off filled:** the partial knockouts (parallel 6 whole, parallel 10 and the meridians cut on the slash's far
  side) avoid islands, and the sheet confirms none at 16 or 48. At 16 it still reads busier than Fluent's filled cut, but
  it is the delegated construction.
- **milestone:** the post at x 8 is on a whole pixel. That is allowed for a shape centred on 8, and the sign can't move
  without its edges leaving x.5.
- **building:** the base at whole-pixel 14 is recorded. Shortening the tower to 13.5 would squash the door to 2.
- **location-add:** the 4px + sits in the head with tight 1.63 on every arm, and the pin is copied exactly.
