# Group 2 report: Status & alerts, Controls, View & zoom

Group 2 has 56 icons. Two of them are aliases: eye-closed of eye-off, and maximize / minimize of expand / collapse. Five are new since the last pass. issue, list-filter, scan-text and siren came in batch 69. eye-closed, search-alert and scan-qr came in batch 70.

**Method.** I checked every icon one by one, in outline and filled, at 16 / 24 / 32 / 48 and 96. The families with filled cuts I also checked at 200: bell-dot, square-badge, bell-off, search-off, siren and filter-add. Each icon was compared with its family base and siblings. Where a reference is recorded, I compared it with that reference too: Fluent scan_qr_code and zoom_fit, and Lucide scan-qr-code and scan-text.

**Result.**
- Lint: clean (`--only`, 61 icons including rotations).
- Slivers: none at 16 or 48.
- Knockout escapes: none.

**Sources.** No source changed. Every edit made for a test was restored, and the restored files are byte-identical to `before-src/`.

**Scratch files** are in `<scratchpad>/q2/`:
- overview sheets `o1`–`o6`
- the 200 px sheet `big1.png`
- the reference sheet `r-scan.png`
- the candidate `cand-zoom-fit.svg`

**Proposals sheet:** `sheets/group-2-proposals.png`.

## Changed (applied to sources)

None. I found no rule violation, no drift from a family base and no unapplied owner note that called for a source change in this group. The items below that would change a drawing are judgement calls, so they are listed as proposals.

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| zoom-fit | **Change:** the centre square goes from 4 × 4 at 6–10 (r 1) to Fluent's 5 × 5 at 5.5–10.5 (r 1).<br>**Unchanged:** the heads.<br>**Effect:** the gap to the heads becomes detail 0.88 (was tight 1.41), and the counter becomes 3.93 (was 2.93). Lint clean, no slivers. | **Crispness:** the 4-wide square centred on 8 puts all four of its edges on whole pixels. At 1× each edge smears across two half-grey columns, and at 16 the square reads as a soft blob. A 5 × 5 square sits on x.5 and matches Fluent's zoom_fit_16 (centre-line 5.5–10.5). Filled, the solid reads the same size as Fluent's filled cut.<br>**Why not applied:** the spec records "a 4 × 4 square", and the earlier choice kept a tight gap. 0.88 is on the detail step that the owner's detail round allows.<br>**Rejected alternative:** a 3 × 3 square (6.5–9.5) is crisp too, but at 16 it reads as a small ring. | `<scratchpad>/q2/cand-zoom-fit.svg`, sheet `sheets/group-2-proposals.png` (before, after, Fluent regular and filled) |
| siren, bell-off | **Change:** remove `data-angles="free"`. Attribute only; the drawing does not change. | **Why:** both lint clean without it. Every diagonal in both icons is a true 45° on the lattice, and geometry-audit finds nothing.<br>**Risk:** while it stays, it switches off the lattice check for the whole icon. This is the "stale free" rule learned on 2026-10-07 (calendar-check).<br>**Why not applied:** it is not visible, and changing it would send two approved icons back into review. The coordinator can apply it without a review round. | n/a |

## Cross-group (needs the coordinator)

None required.

For information only: the owner's search note ("handle roundness pokes through the circle") has also been checked on every lens sibling outside the group. The siblings are file-search, text-search, database-search, calendar-search, person-search, folder-search and replace. In each one, the handle cap's nearest point stays outside the lens's inner ink edge:
- r 2 lenses: 1.56 against 1.44
- folder-search's r 1.5 lens: 1.21 against 0.94
- replace: 10.75 start, as search

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| info | "gap between dot and i is too big, i like the i from fluent" | **Holds.** Stem 7.25–11 and ⌀1.5 dot at 5: 2.25 from the stem end, an ink gap of 0.94. octagon-alert (info flipped), warning, help and search-alert share the same 2.25. |
| circle-check-dashed | replace → Fluent | **Holds.** Fluent checkmark_circle_hint: the whole ring is dashed and holds the ring's 2 / 4 check. |
| loader | replace → Phosphor | **Holds.** Phosphor spinner-gap: seven ticks r 4 → 6, with the upper-right tick missing. |
| filter | replace → Phosphor | **Holds.** Phosphor funnel with its slanted foot. filter-add and filter-dismiss carry the same funnel exactly. |
| toggle | "size of the dot … is better in fluent" | **Holds.** Fluent's 12 × 7 track (r 3.5) with a ⌀4 knob concentric with the end, 0.94 from the track. toggle-off is its mirror. |
| search | "bottom handle stroke roundness pokes through the circle" | **Holds**, on search, search-off, search-alert, zoom-in, zoom-out and square-search: the handle starts at 10.75, and its cap's nearest point is 4.74 from the lens centre against an inner edge of 4.44. The out-of-group siblings were checked too (Cross-group). |
| eye | replace → Lucide | **Holds.** Lucide eye with r 0.75 tip fillets and an r 2 pupil. |

## Machine findings triage

| finding | icon | triage |
|---|---|---|
| geometry-audit `subgap 2.42` between the lid and the side lashes | eye-off, eye-closed | **False positive.** All three lashes start on the lid curve (4.5, 7.912 lies on the cubic), so the space between two lashes is a pocket that opens downward, not a gap between separate shapes. The 2.42 is the distance between the lash roots, and it widens as the lashes fan out by 20°. The drawing is the owner's pick (`data-off="own"`). |
| geometry-audit `lattice` (four 45° sides, x ± y = 7.5 / 8.5 / 24.5) | octagon-alert | **Recorded exception.** The octagon's sides are listed in the skill's recorded exceptions, and the four sides are the same octagon as `octagon`. |
| parts `eye-closed from eye 69%` | eye-closed | **False positive.** eye-closed is an alias of eye-off (the closed eye with lashes, an owner pick), not a member of eye. |
| parts `radio-button from radio 26%` | radio-button | **False positive.** radio is the broadcast radio, an unrelated icon (already noted in the 2026-10-07 pass). |
| parts filter-add 4%, filter-dismiss 9% | filter-add, filter-dismiss | **Expected.** The funnel is cut 2.25 round the + / × (the recorded overlap cut). The rest is copied exactly. |
| parts bell-dot 3%; bell-off, bell-ring, badge-check, octagon-alert 0% | bell family, badge-check, octagon-alert | **Expected.** bell-dot's 3% is the bite round the ⌀3 dot. The others are identical; the "moved 0, −0.25" is the matcher's alignment offset. |
| optical: more-horizontal and grip −57%, grip-vertical −32%, expand / collapse −22 / −25%, eye-off −24%, list-filter −19% | line glyphs | **Recorded by nature.** Line glyphs have thin hulls (skill, "Audit optical size"). grip's width is kept as the package glyph, and menu-style stacks sit 0.5 high. |
| optical: radio-button density +44%, toggle +24%, settings +20% | radio-button, toggle, settings | **Recorded.** radio-button's ⌀7 disc is a solid exception (`data-dot="free"`). toggle's knob ratio is the owner's Fluent note. The gear is dense by design and sits 1.88 under its keyline. |
| optical: search-off +13%, bell-ring +11% | search-off, bell-ring | **By design.** The full-length slash, and bell-ring's arcs at r 7 reaching the circle keyline. Both sit within the ring class. |
| lint ⚠ under keyline | grip (7.88), grip-vertical (4), more-horizontal (2), settings (1.88) | **Recorded.** Package glyph; ⌀2 dot glyphs; the dense gear. |
| slivers 16 / 48, escapes | none in this group | — |

## Checked, no change

**Status & alerts:** info, help, warning, error, octagon-alert, status-available, badge, badge-check, square-badge, circle-dashed, circle-dot-dashed, issue, circle-check-dashed, loader, loader-circle, record, bell, bell-dot, bell-ring, bell-off, siren: ok.

**Controls:** menu, more-horizontal, more-circle, grip, grip-vertical, dots-four, settings, options, filter, list-filter, filter-add, filter-dismiss, sort, sort-ascending, checkbox, radio-button, toggle, toggle-off: ok.

**View & zoom:** search, search-off, search-alert, square-search, zoom-in, zoom-out, zoom-fit (see Proposals), expand, collapse, maximize, minimize, eye, eye-off, eye-closed, scan-check, scan-qr, scan-text: ok.

Notes from the one-by-one pass. These were measured and left alone:

- **Marks.**
  - Every ! and ? dot sits 2.25 below its stem or hook end: info, warning, octagon-alert, help, search-alert.
  - error's × is 5.
  - The 2 / 4 check is identical in status-available, checkbox, scan-check and circle-check-dashed (`M5 8L7 10L11 6`, ink centred on 8, 8). badge-check's 1.5 / 3 check is recorded.
  - zoom-in's + and zoom-out's − are 4 wide.
  - The ⌀2 dots sit on whole-pixel centres: issue, circle-dot-dashed, more-horizontal, more-circle, grip-vertical.
  - The ⌀3 notification dot is at 12.5, 3.5 in both bell-dot and square-badge. Their cut ends sit exactly 3.19 from the dot's centre (a 1.125 ink gap).
- **Batch 70.**
  - **search-alert** is zoom-in exactly, with the container ! centred in the lens: ink 4.19–10.0 about the lens centre 7, tight 1.63 / 1.44. The mark stands 5.8 tall against the +'s 5.1, so it does not read small. Filled: the lens is solid, the stem is a knockout and the dot is a hole.
  - **scan-qr** is close to Fluent's scan_qr_code checker. Fluent's centre module is 4 against its 3s; Area's five are all 2 × 2. Two differences from qr-code are deliberate:
    - qr-code rounds its modules (r 0.25 / r 0.5). scan-qr's modules stay sharp because they touch at their corners: r 0.25 corners would open 0.29 pinholes between them, under every step of the gap scale.
    - Its ink box (6) is smaller than scan-check's check and scan-text's lines (7.12). These are solids with no stroke, and the 2 × 2 grid needs whole-pixel edges. The standard 1.94 gap to the brackets is right.
  - **eye-closed** is identical to eye-off (the alias is linted).
- **Batch 69.**
  - **issue:** the ring with the ⌀2 centre dot, on the size curve. Filled, the dot is a hole (square-dot's).
  - **list-filter:** 12 / 8 / 4 on menu's rows 3.5 / 7.5 / 11.5.
  - **scan-text:** square-list's 2.5 rhythm (5.5 / 8 / 10.5). The middle line sits on a whole pixel, as in square-list and text-select. Rows 3 apart (4.5 / 7.5 / 10.5) would put the top line 0.88 from the bracket against 1.88 at the bottom. The family's rhythm is the better trade.
  - **siren:**
    - The rays end equally, 7.5 from the dome centre. The top ray is 0.75 long and the 45° rays 0.71.
    - The base is 2.5 tall, so one of its edges must be whole. A 2-tall base leaves a 0.875 counter. A 3-tall base exceeds the square keyline (13.6).
    - The highlight is tight 1.125 from the dome and detail 0.88 from the base.
    - Filled: the dome fill closes along the base's top edge.
- **Filled checks at 200 px.**
  - **bell-off:** the narrow fill tip at the lower-right flare comes from the shared slash construction. The sliver check is clean.
  - **search-off:** the lens pieces are cut one-sided, 2.5 from the mirrored slash.
  - **filter-add, filter-dismiss:** these keep the recorded 2026-10-05 stalk: the cone ends square, and a stalk 6.5–7.5 runs to the foot. Filled, it is narrower than filter's filled stem. That conflicts with "never shrink a part when filled", but the alternative (filter's stem bitten round the mark) is the concave bite and tail that the 2026-10-05 audit removed. I left it unchanged, and it remains a recorded decision.
- **Off-centre, under-keyline and whole-pixel cases, all recorded.**
  - menu and list-filter sit 0.5 high (the stack rule).
  - octagon-alert's flats are 2–14 (ink 13.1 like the ring). Its long flats are whole-pixel, the cost of matching the ring's size.
  - warning's centre is 7.84 (the triangle lift).
  - bell-ring's centre is 7.78.
  - filter-add and filter-dismiss have their corner-mark centres at 8.18 / 8.05.
