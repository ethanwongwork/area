# Group 11 report

Group 11 covers Commerce, Weather & nature, Science and Objects: 70 icons, two of them new in batch 70 (gavel and copyright). I rendered every icon in outline and filled at 16 / 24 / 32 / 48 and 96 with look.mjs, eight icons per sheet, each with the slivers check at 16 and 48. The sheets are `q11/s1.png` to `s9.png` in the session scratchpad. gavel and copyright were also rendered beside Lucide, Phosphor (regular and fill) and Fluent 16 (regular and filled), with hammer and add-circle as their siblings (`q11/r-gavel.png`). I checked every icon against its spec construction line, its family and siblings, the owner's notes, and the machine findings. Lint is clean for all 70 icons (`--only`, the whole group), and the slivers check finds nothing at 16 or 48 on any sheet.

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| snowflake | Both styles, at 1×. The top and bottom chevrons are true 45° lines but sat 0.25 off the diagonal lattice: V at 8, 4.25, so x + y = 12.25 and x − y = 3.75 (geometry-audit, 4 hits). They blurred across pixel rows at 16. | Every chevron moved 0.25 outward along its arm, with the leg length unchanged (1.75 × √2). The top chevron is `M9.75 2.25L8 4L6.25 2.25`: V at radius 4, so x + y = 12 and x − y = 4, both on the lattice. The other five are exact 60° rotations of it: `M13.855 6.641L11.464 6L12.105 3.609`, `M12.105 12.391L11.464 10L13.855 9.359`, `M6.25 13.75L8 12L9.75 13.75`, `M2.145 9.359L4.536 10L3.895 12.391`, `M3.895 3.609L4.536 6L2.145 6.641`. The side chevrons' vertices also land on whole y (6 / 10). Leg tips now sit level with the arm tips (radius 6.0; was 5.77). Ink is 12.84 × 13.12 (was 12.4 × 13.12), centred 8, 8. | Lint ok. geometry-audit: clean. Slivers 16 / 48: none. Looked; before/after in `sheets/group-11-after.png`, with Lucide's snowflake for reference. |
| atom | Both styles, a geometry defect. Each orbit's two half-arcs met at the tips with a 2.9° kink (geometry-audit, 4 hits). The cause was rounding: tips at 13.612 / 2.388 put the chord 0.001 short of 2a = 15.874, so each arc's centre slid about 0.03 off the major axis and the halves no longer met tangent. The ink box also measured 13.16, where the spec records the extremes "exactly at 2 and 14" (13.12). | Tips at 13.6125 / 2.3875. The chord is now a hair over 2a, so SVG scales the radii by 1.00003 and each arc is an exact half ellipse. rx, ry, rotation and flags are unchanged. Ink 13.12 × 13.12 (the spec's value). Nucleus gaps 1.44 tight (were 1.47), counters 3.28 (were 3.34). There is no visible change: the original and new sources look identical when drawn side by side (`q11/atomcmp.png`). | Lint ok. geometry-audit: clean. Slivers none. Looked. |

## Proposals (not applied)

None. I tried one candidate and rejected it:

| icon | tried | why rejected | candidate file |
|---|---|---|---|
| gavel (filled) | Part the two face bars from the head by one line weight, as Phosphor's fill and Fluent's filled cut do and as hammer's face cap does. This was two filled-only `gap` lines one weight inside each bar, with `data-shift` to keep them flush at every size (api's construction). | The head is only 2.83 thick and 7.07 long. With a weight taken off each end, what is left (about 3.7 across) has the same width as the handle, so head and handle merge into one long bar beside two loose lines. It read worse than the current filled variant, which is a T-mallet whose face bars widen the head's ends. It would also bite 0.13 into the handle's shoulders at 16, because the bar-to-handle gap is a detail 1.0, under one weight. Kept as drawn. | `q11/cand-gavel-facegaps.svg`; sheet `q11/gavel-ab.png` |

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| QR data modules | scan-qr (batch 70, another group) | The owner's qr-code notes asked for larger and then "slightly more round" bottom-right modules. qr-code's data modules are now 2.5 × 2.5 at r 0.5. scan-qr's five checker modules are sharp 2 × 2 squares (`M5 5H7V7H5Z…`, no radius), so the note may apply to them as a shape sibling. | Ask the owner before changing it. The modules touch at their corners, so any radius opens pinholes between neighbours: r 0.25 leaves about 0.15 at each touching corner. The choices are r 0.25, or separate modules with a gap (which costs the 6 × 6 fit). |
| none else | – | No change here touches a shared base. snowflake and atom are standalone. | – |

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| cart | r2: wheels level with the bottom stroke, like Lucide | Holds: wheel tops at 10.5, the rail's line. cart-add shares the wheels and rail exactly, so it holds too. |
| basket | r2: thicken the strokes rather than fill | Holds: no solid, so it is a line glyph filled by weight. Spec row 3248's "filled: the body is solid" is stale. |
| piggy-bank | r1: no line out of the head; r2: rounder bottom | Holds (10-07: vertical rear leg, round chin, 2-wide feet). |
| receipt | r2: the fold behind unfilled | Holds: the curl is a line, the slip fills. |
| barcode | replace → Fluent | Holds. |
| qr-code | r1: bottom-right modules bigger; r2: slightly rounder | Holds: 2.5 × 2.5 at r 0.5, aligned gap. Sibling scan-qr is under Cross-group. |
| moon | replace → Phosphor | Holds (Phosphor crescent; the 7.87, 8.13 centre is recorded). |
| umbrella | r2: filled stroke and negative-space errors | Holds: ribs knocked out, round inside, sawn at the canopy's foot. |
| leaf | filled: rounded stroke end | Holds: the vein's knockout ends round at the top. |
| tree | replace → Fluent | Holds (Fluent tree_deciduous; its own crown, not the cloud). |
| paw | replace → Phosphor | Holds. |
| binoculars | replace → Phosphor (later Lucide pick) | Holds. |
| lightbulb | r2: Fluent, wider | Holds (r 4.5 bulb). |
| calculator | r1: display edges align with the keys; r2: larger top part | Holds: display 3.5–6.5; its ink edges at 4.44 / 11.56 meet the outer keys' 4.5 / 11.5. |
| scale | the bottom bar can be a stroke | Holds. |
| hammer | r1: no tail; r2: longer handle, Phosphor ratios | Holds (handle 12k against a 15k head). |
| broom | r2: bottom part; r3: filled = the top part darker, not thicker strokes | Holds: the binding dome fills and the skirt stays a line. |
| bandage | replace → Phosphor | Holds: the front band fills and the back band stays a line. |
| coffee | smoother, more natural curves | Holds (S wisps with vertical ends). |
| chef-hat | one piece with a separating stroke | Holds: one silhouette with a cut at 10.5. |
| party-popper | r2: strokes too close | Holds: confetti gaps 1.0–1.7. |
| dice | Phosphor's dot spacing | Holds. |
| chess-rook | r2: thicker and wider, like Lucide | Holds; its filled crown is flat. |
| toy-brick | studs taller (later back to 2.5) | Holds at the owner's latest, studs 3–5.5. |
| crystal-ball | r2: the stroke should connect at the bottom | Holds: the stand is closed. |
| dumbbell | replace → Phosphor | Holds. |
| piano | replace → Phosphor (r1, r2) | Holds. |

No group-11 note has a sibling outside the group, except qr-code → scan-qr (Cross-group).

## Machine findings triage

| finding | icon | triage |
|---|---|---|
| lattice ×4 (chevrons at x ± y = 12.25 / 3.75 / 19.75) | snowflake | **Fixed** (above). |
| kink 2.9° ×4 at the orbit tips | atom | **Fixed** (above). |
| lattice ×4: band sides at x − y = ±3.182 and x + y = 12.818 / 19.182 | bandage | Recorded trade-off, not a defect. The r 2.25 caps put the arc extremes on the 0.5 grid (2 / 14). Sides on the lattice need r 2.121, which moves the extremes to 2.13 / 13.87, off the grid. Phosphor's proportions, owner-approved. |
| lattice ×2: leaf tip sides at x ∓ y = 6.364 / 9.636 | leaf | Same trade-off. The sides are tangents to the r 4.5 body circle, whose extremes are on the grid (3.5 / 12.5). A lattice tip needs r√2 whole, which no 0.5-grid radius gives. |
| lattice ×2: snow-line zigzag at x − y = −0.565 / 1.687 (a `cut`) | mountain | Accepted. The zigzag's ends must sit on the curved slopes. A lattice zigzag needs its peak on a whole y and its ends at whole or half x on the slope. The slope passes x 6 at y 5.50 and x 5.85 at y 6, so no position fits both. |
| lattice ×3 | wrench | Recorded exception (the skill lists wrench under radial and free icons). |
| kink 23.3° ×2 at the cap arcs | binoculars | Recorded: Phosphor's shallow cap corners (2026-10-07 group 10, "holds"). |
| kink 14.0° ×2 | broom | Deliberate corners: the binding dome meets the skirt (owner-approved r3 shape). |
| kink 24.0° ×4 at the pan chords | scale | Deliberate: each leg meets the bowl at a corner (spec: the legs are separate subpaths). |
| kink 21.8° in the `fill` | flask-off | Recorded: the filled-only fill is trimmed along the slash gap (10-07: the right shoulder trim). |
| parts: cloud-sun from cloud 57%, "moved 2, 0.75" | cloud-sun | Expected, not a defect. cloud-sun's cloud is D at 0.625 (scaled), so a moved-copy test can't match it. Checked the arcs: the small lobes are exact 0.625 copies (centres 8.063, 12.437 and 11.969, 11.969). The big lobe sits 0.24 lower than an exact copy (centre y 10.65, not 10.41), so its top lands on the grid at 8.0, not 7.75. Owner-approved in round 23; not changed (the brief: check clouds, don't change them). |
| parts: cloud-lightning / -rain / -snow from cloud | – | Exact copies moved up 1 (foot 12); the 1.25 is the bolt's offset. cloud-snow's circle keyline and ⌀1.5 dots at 14.25 are the recorded round-22 deviation. |
| parts: cart-add from cart 8% | cart-add | Expected: the basket is cut round the + (spec). |
| parts: flask-off from flask 0% | – | ok. |
| optical: broom −27%, thermometer −25%, dollar −20%, gavel −19%, wrench −19% | – | Diagonal tools (broom, gavel, wrench, hammer −13%) read small by hull even when they fill their box. gavel's 12.04 matches wrench's 12.12, and gavel sits beside hammer at the same apparent size (`r-gavel.png`). thermometer's −27% was fixed in 10-07; −25% is its narrow vertical form. dollar is a vertical line glyph. No change. |
| optical: atom +16%, qr-code +15%, piano / bandage +14% | – | A full ring by design (atom), and square-filling grids (qr-code, piano); bandage fills its square keyline. No change. |
| keyline: currency-euro and flask 1.88 under | – | currency-euro sits on the type family's cap height (2.5–13.5) by its spec record. flask: crisp x.5 edges, the 10-07 decision. |
| slivers 16 / 48, escapes | – | None for this group. |

## Batch 70 in this group

- **gavel:** both styles hold, and lint, audit and slivers are clean. The outline matches Lucide's construction: the face bars lie on the head's ends and run one lattice unit past each long side. The handle's detail gap of 1.0 to the bars is correct, and ink 12.04 sits the same size as wrench. The filled variant stays as drawn (see the rejected candidate above). The delegated "no sound block" call holds: Lucide and Phosphor have none, and Fluent's block makes the 16px drawing dense.
- **copyright:** holds. The r 3 C is token's and target's inner ring, a standard 1.87 from the ring. The ±45° opening reads as a C at 16. Filled, it is a knockout with round ends (add-circle's treatment). It is consistent with Phosphor's and Lucide's proportions. The delegated "C is r 3" call is right: r 2.5 is a 2.37 near miss.

## Checked, no change

- **Commerce:** ok: shopping-bag, credit-card, banknote, coins, dollar, piggy-bank, receipt, discount, ticket, gift, package, barcode, qr-code.
  - cart and cart-add: the basket's top and bottom (y 4 / 8) sit on whole pixels and soften at 1×. Moving the basket to 3.5 / 7.5 would make it crisp, but cart-add's + continues the basket's top line, so the + would move to 12, 3.5 and the icon would sit 0.5 high. That is not clearly better on an owner-approved pair, so I did not draw it as a proposal.
  - basket: ok.
  - wallet: the horizontals (3 / 6 / 13) and the clasp (y 10) are on whole pixels, because the 10-tall body is centred on 8. This is the usual centring trade-off. Left.
  - currency-euro: ok.
- **Weather & nature:**
  - Cloud family (cloud-sun, cloud-rain, cloud-lightning, cloud-snow): checked only. They use the D cloud exactly (see triage), cloud-lightning's inset bolt is the approved one, and the rain lines are 1.5 / 2 / 1.5.
  - sun, moon, brightness, wind, umbrella, thermometer, flame, leaf, tree, mountain, paw: ok.
- **Science:**
  - flask, flask-off, magnet, binoculars, lightbulb, graduation-cap, calculator, presentation, scale, telescope: ok.
  - telescope: its counters of 0.89 / 1.03 are detail, and its 7.84, 8.13 centre comes with its batch-69 construction.
- **Objects:** ok: briefcase, hammer, wrench, broom, life-buoy, bandage, chef-hat, cookie, trophy, award, crown, party-popper, dice, chess-rook, toy-brick, crystal-ball, basketball, dumbbell, piano, toolbox (briefcase's handle and band copied exactly), stamp.
  - coffee and utensils: the 2026-10-07 proposals still stand. coffee's cup edges are on whole pixels; utensils' fork tines are not on x.5.
  - crown: the side balls (⌀2) sit at 2.5, 4.75, not on whole-pixel centres. They are aligned over the side points with an even detail gap of 1.1 to all three points; a whole-pixel centre breaks one or the other. Owner-approved; left.
  - dumbbell and scale: their 0.93 counters are recorded detail counters.
  - award: filled, the inner r 2 disc fills and the medal ring stays a line. This is the approved drawing; the spec's older row ("ring solid when filled") is stale.
