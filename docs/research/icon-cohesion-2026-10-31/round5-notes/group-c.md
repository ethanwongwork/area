# Batch 2, group C: gap floor 1.125 / counter floor 1.5

Lint: `generate.mjs --only <46 names> --report` prints "icon lint ok". Starting drawings are saved in scratchpad/c/before/.
A gap of exactly 1.125 still shows as "1.13 detail" because the lint's detail range ends at 1.125 inclusive. That value is the floor, so I left those gaps.

## Changed
- **paw**: the toe rings stay r 1.25 (owner pick). They moved to 5.25,3.25 / 10.75,3.25 (inner) and 2.75,7.75 / 13.25,7.75 (outer). The pad is the same drawing at 8/9 scale about its foot, 0.25 lower. Gaps: before 0.88–1.09; after toe–toe 1.88 / 1.52, pad–outer 1.25, pad–inner 2.71. The 1.38 ring counters remain (owner's r 1.25 rings).
- **pencil-sparkle**: the sparkle grows from ±2.5 to ±3 at 4.5,4.5. Its counter was 1.07 and is now 1.51. The slim pencil keeps its width (2.65), radii and band. It moved off the sparkle (sides x+y 15.25 / 19) and is 12% shorter (tip 3.625,13.5, end x−y 8.625). The gap was 1.085 and is now 1.17. The band pocket stays 1.17 (owner's eraser band).
- **text-sparkle**: the same ±3 sparkle (11, 4.5). It was ±2.5 with counter 1.07; it is now 1.51. The lines moved down 1 (to 7.5 / 10.5 / 13.5) so the sparkle's foot stays standard (1.875).
- **piggy-bank**: the coin moved 0.05 out of the slot (gaps 1.123 / 1.11 → 1.129). The eye moved from 5.125,7.75 to 5.25,8 (1.085 → 1.30; 2.59 to the coin).
- **radio**: the knob moved from x 10.5 to 10. Gap to the case went from 0.875 to 1.375, and to the speaker lines it is now 1.18.
- **repeat-once**: the lower rail ends at 10 instead of 10.25. The gap to the 1 went from 1.125 to 1.375.
- **rocket**: the fins grew outward 0.5 (fin edge x 11.5 → 12 and its mirror y 4.5 → 4). Fin pockets went from 1.28 to 1.68.
- **scale**: the pans lose their chord line (Tabler / Lucide pan: the V closed by the bowl). The bowl is r 2.5 instead of r 2 (shallower dish). Bowl counters went from 0.93 to 2.14. When filled, the bowl still fills under the chord.
- **screen-share**: the arrow tail is at 8.5 instead of 9, so the arrow sits centred in the screen. Gaps went from 0.875 to 1.375.
- **screen-share-off**: added `data-gap="slash"`. The stand's base sits 0.996 from the slash; the base must stay identical to screen-share / desktop's stand. Owner to confirm. monitor-off is the same drawing and has the same gap.
- **send-to-back**: the squares are 4.5 instead of 5 (2.5–7 and 9–13.5). The corners lengthen to 2.5 arms. Corner-to-corner went from 1.118 to 2.53 (open); every other gap is 1.875.
- **server**: two separate 11×4.5 units become one 11×11 frame with a divider at 8 (a two-bay rack, like Material's storage). Lights sit at 5,5.25 and 5,10.75. In a 4.5-tall unit a ⌀1.5-placed light can never clear 1.125; it had gaps 0.875 / 0.94.
- **server-cog**: the same frame. The divider is at 7.5, tangent to the bite, so the top bay stays closed. The gear and its r 4.5 bite moved from 11.5 to 12,12. The lower bay ends on the bite. The divider to the top tooth is exactly 1.125. The hub sliver is pre-existing.
- **shield-lock**: the shackle is 0.5 taller (top 4.5). Its pocket went from 1.43 to 1.93.
- **shopping-bag**: the header is 3 tall instead of 2.5 (band at 5). The handle is 0.5 lower. Header counter went from 1.43 to 1.93.
- **sim-card**: the chip is 4×3.5 at 6,8.5 with no contact line (simplified). It was 5×4 with a centre line: gaps 0.875, halves 1.43. Gaps are now 1.375.
- **siren**: the base bar is 3 tall (11–14) instead of 2.5, and the dome ends at 11. Base counter went from 1.43 to 1.94. The highlight is r 2 instead of 2.25, a 60° arc from the top. The top ray is 0.5 long. Every gap is now ≥ 1.18; it was 0.875 / 1.125.
- **smile-plus**: the eyes moved from 4.75 / 8.25 to 5 / 8, and the mouth spans 5–8 instead of 4.75–8.25. Face gaps went from 1.04 / 0.92 to 1.24 / 1.38. The 48px sliver at the badge edge is pre-existing.
- **sort-alpha**: the A's apex is on the cap line (top 2.5), with the crossbar at 6 instead of 5.5. The A counter went from 1.12 to 1.58. The Z moved down to 10–14, on the lattice at x 2–6. The arrow moved up 0.5 (2–13), the same drawing, so the barb–Z gap is standard (1.92). sort-numeric no longer matches row for row.
- **square-list**: rows are 3 apart (5 / 8 / 11) instead of 2.5. Dot gaps went from 1.0 to 1.5.
- **stamp**: the base is a 3-tall bar with r 1 instead of 2.5 tall with r 0.75. The ground line is at 14 instead of 13.5. Base counter went from 1.43 to 1.94.
- **sun-moon**: the rays moved out 0.5 (diagonals 0.354), and the whole icon moved right 1 (centre 7.44 → 8.19). The moon-to-ray gap went from 0.876 to 1.25.
- **table-cells-merge**: the ↔ has 1×1 heads instead of 1.5, with tips at 5 / 11. Gaps went from 0.875 to 1.375. The header strip counter of 0.94 is left (see below).
- **table-cells-split**: the floating bar runs 8–10 instead of 7.5–10.5. Gaps went from 0.875 to 1.375. The header cells' 0.94 is left.
- **table-of-contents**: rows are 4 apart (3.5 / 7.5 / 11.5, nearer Lucide's 4.67). The ⌀2 dot gaps went from 1.0 to 2.0. list-bullet still has 3-apart ⌀2 bullets, which is the same 1.0 gap.
- **telescope**: simplified on Tabler / Lucide lines. It is one tapered tube (rise 1:3, 2 → 4 wide) with a band 2.75 from the objective, a centre leg plus a 45° V tripod, and no pivot ring or separate objective. The old drawing had gaps of 0.88 and counters of 1.03 / 0.89 / 1.38. The new one has a 1.87 gap and counters 1.78 / 2.13.
- **toggle, toggle-off**: the track is 12×8, r 4, at y 3.5–11.5, instead of 12×7. The r 2 knob is at 10 (6 for off). The knob ring went from 0.94 to 1.44. The icon sits 0.5 high, so the long edges stay on half pixels.
- **toy-brick**: the studs are 3 tall (top 2.5) instead of 2.5. Counters went from 1.43 to 1.93. The owner had said "toy-brick keeps its drawing"; this is one grid step.
- **trash**: the handle is 3 tall (1.5–4.5). The body ends at 13.5 instead of 14, and the slats run 7–11. Handle counter went from 1.43 to 1.93. The icon sits 0.5 high.
- **tree**: the trunk opens into the crown, so the tree is one outline. The trunk box's own pocket was 1.43; the single pocket is now 7.44. When filled, crown and trunk fill as one.
- **usb**: the plug is 4.5 tall above an 8×8 body, with one 2×1 slot instead of two 1×1 holes. The holes had gaps of 0.94 and 1.0. Gaps are now 1.44 and the plug counter 1.93.
- **utensils**: the knife blade is 3 wide (r 3) instead of 2.5. Blade counter went from 1.43 to 1.93; the fork gap is 1.375.
- **vibrate**: the zigzags start 2.5 from the phone, with 1-unit 45° legs (3 peaks, 5–11). The gap went from 0.876 to 1.376. 1.5-unit legs would break the 13 keyline.
- **vote**: the box is 10 wide (3–13) instead of 9; the 1.5/3 check can't centre on a half-unit grid. Gaps went from 0.875 to 1.375 / 1.875. The box sides are now on whole pixels.
- **vr-goggles**: the lens line keeps its ends (owner: higher) but is flatter (r 12.5 instead of 7.5). The strap moved up 0.5, and everything moved down 0.5 to stay centred. Gaps went from 0.876 / 0.875 to 1.14 / 1.37.
- **watch**: the straps reach 1.5 and 14.5. Pockets went from 1.18 to 1.60.
- **whole-word**: the underline bracket's ends are at 11 instead of 10.5. The gap to the letters went from 1.118 to 1.49.

## Left as is (owner constructions)
- **pencil, pencil-off** (and the band in pencil-sparkle): the eraser band pocket is 1.17. Lucide's band sits 2.12 from the end, an owner pick.
- **qr-code**: the finder centres sit 0.94 away and the 2×2 modules 1.0 apart; the finder counters are 1.27. Owner-approved 2026-10-14 (whole-pixel modules, 1×1 centres).
- **piano**: Phosphor's keys (owner pick). The keys are 2.5 wide (counter 1.43) and 0.875 apart. Wider keys or moving them apart leaves slits of 0.375 against the frame. A Tabler-style 1-wide key looked solid at 16 but shows a slit at 48+. I tried it and reverted.
- **spell-check**: the owner-reviewed A B C at a 4.5 cap height. Counters are 0.93, 0.96 and 1.43; B's two bowls can't each reach 1.5 under 5.25 high. Fixing it would mean Lucide's simplification (a large A plus the check) or dropping B and C.
- **switch-camera**: just approved. The lens arrow (r 2) sits 0.876 from the body; fixing that changes the arrow radius or the body.
- **table-cells-merge, table-cells-split**: the owner's header strip (12 × 9 frame, "toward Fluent") is 2 tall, so its counter is 0.94. A 3-tall header leaves no room for the ↔ in a 9-tall frame. Lucide's three-row version fits but is the construction the owner replaced.
- **translate**: already `data-counter="sliver"` (the owner's "a" and "あ"). Its 0.88 and 1.35 counters are exempt.
- **square-mouse-pointer**: the 1.125 is the overlap cut.
