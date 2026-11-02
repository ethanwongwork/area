# Batch 2, group A: gap floor 1.125, counter floor 1.5

Originals: `batch2/before/*.svg`. Sheets: `batch2/look1.png`, `look2.png`, `look3.png` (outline and filled, 16–96). The sliver check is clean at 16 and 48.

## Changed

- **accessibility**: body moved 0.5 down. Head gap 0.875 → 1.375. Ink is now 12.12 × 14.12, centred at 8,8.
- **api**: the four spark ticks shortened at their inner ends by 0.27, keeping their angle. Gap 1.0 → 1.256.
- **archive-restore**: the U-turn arrow moved (+0.5, +0.5): shaft V12, turn at 10.5, head (7.5,8.5)/(5.5,10.5)/(7.5,12.5). It stays on the lattice. Head to lid 0.877 → 1.375. The bottom line's overlap cut stays 1.125 because the lower barb lies on the same x−y=−5 line. Filled: the lower barb's round end sits 0.5 above the silhouette (it was 1.0).
- **bandage**: bands widened from half-width 2.25 to 2.5 (cap centres 5,5 / 11,11). Dot gap 0.938 → 1.188. Ink is unchanged.
- **bank**:
  - five columns became four (3.5, 6.5, 9.5, 12.5), because the column pockets were 1.43.
  - the pediment base moved down to 7.5 (polygon 1.25,7.5 / 8,1.6 / 14.75,7.5) so the ⌀1.5-placed dot (now at 8,5) fits. Dot gaps 0.938 → 1.188 / 1.25.
  - the plinth is now 10.5–14 (3.5 tall), because the old 2.5-tall plinth's counter was 1.43. Pediment to plinth is now standard (1.875).
- **banknote**: frame 12×9 → 13×9 (the 13 × 9 horizontal frame), corner scallops r 3 → 3.5, circle r 2 kept. Scallop pockets 1.34 → 1.88. Circle to scallop gap is 1.28.
- **basket**: body widened to 2.5–13.5 at the rim and 4–12 at the foot. The rim now overhangs by 0.5, not 1. The lower outer pockets go 1.43 → 1.87, and the middle band is 3.25–12.75.
- **blend**: circles r 4 at (6,10)/(10,6) → r 4.25 at (6.25,9.75)/(9.75,6.25). Extremes stay on the grid and the ink box is unchanged. Lens counter 1.40 → 2.6.
- **blocks**: blocks 5 → 4.5 (L at x 2/6.5/11, y 5/9.5/14; the fourth at 9.5,2). Separation 0.875 → 1.9 (standard). Extent 2–14 is unchanged.
- **bookmark-check**: 1.5/3 check centred (M5.75 7 L7.25 8.5 L10.25 5.5). Gap 0.875 → 1.125 on both sides, which the lint prints as tight. The icon is `free`, so quarter diagonals are allowed, as in document-check.
- **bot**: antenna ellipse 1.5×1.25 → ring r 1.5 at (8,3.5). Counter 1.42 → 1.875. Body, eyes and stem moved 0.5 down, so ink is 13.12 tall and centred.
- **bot-agent + agent** (byte-identical below `<svg>`):
  - the hat band was removed (outline `line` and filled `gap`). The hat was too short for two 1.5 pockets, which were 1.18 and 1.43; it is now one 3.25 pocket.
  - the visor's outer ends were moved 0.15 in. Visor to head sides 1.048 → 1.198.
- **brain-circuit**:
  - node dots r 1 (⌀2) → r 0.75 (⌀1.5, the dot-with-a-stem size). Gaps 0.938 → 1.188.
  - the lower-left node moved 9.5 → 9 and its trace runs on to it (…5.5 10.5V10), so every pair is on the scale.
- **building**:
  - tower widened 3–10.5 → 3–11, annex 2 wide.
  - windows 7 → 4 (2×2 at 5.5/8.5 × 4/7, 3 apart). The old 2.5 spacing gave 1.0, and a two-column grid can't fit in a 7.5-wide tower.
  - the door is 3 tall (11–14), because its pocket was 1.43.
- **camera, camera-off**: lens r 2 → r 1.5 (the hub size), so the body shared with switch-camera is untouched. Gap 0.875 → 1.375. camera-off's one-sided knockout arc was recomputed for r 1.5.
- **car**:
  - the outline line closing the wheel tabs was removed, because those wheel pockets were 0.93.
  - the body bottom between the wheels moved 11 → 11.5.
  - the headlights moved to 5–6 and 10–11.
  - the roof and belt were merged into one path (both unmarked strokes), so lights to belt measure 1.375.
- **cards**: card 7–14 (11×7), lines at 4.5 and 2 (they were 4.5 and 2.5). Gaps 0.875 → 1.375, still centred. Trade-off: the card edges are now on whole pixels.
- **cart-add**: outline basket line ends 11.25 → 10.75 and 7.75 → 7.5. Gap to the + is 1.011 → 1.233. The filled bite is unchanged.
- **cast**:
  - arcs r 2.5/5 → r 3/5.5. Dot gap 0.937 → 1.437.
  - the frame ends moved to (2.5,5) and (10.5,13), and the filled arc to r 8.
- **chat-pen**: bubble ends 5.54 → 5.55 and 6.443 → 6.44. The overlap cut goes 1.122 → 1.127.
- **chat-sparkle, code-sparkle**: the small sparkle's controls moved from 0.3 to 0.65 off its centre, tips unchanged. Inner counter 1.07 → 1.56. **image-sparkle and pencil-sparkle carry the same sparkle (counters 1.07 / 1.17) and were not in this group, so they need the same change.**
- **chess-rook**: crown, line and body moved 0.5 up (crown 1.5–7, body 7–11), and the base is 3 tall (11–14). Its counter was 1.43. Ink is 13.62 tall, 0.25 high, which suits a heavy base.
- **circle-dollar**: stubs shortened to 4.5–5 and 11–11.5, ring gap 0.875 → 1.375. The S is kept: a flatter S would have left the ring-to-S gap at 2.31, between steps.
- **circuit-board**: frame 11 → 12 (2–14, Lucide's 12). Pad gaps 0.875 → 1.375. Two r 1.5 pads can't fit in an 11 frame: they need 5.25 between centres, and only 4.77 is available. This goes past the delegated "frames never fill the keyline" square frame, so the owner should confirm.
- **clipboard-check**: 2/4 check → 1.5/3 (M6 9 L7.5 10.5 L10.5 7.5), the rule's next size for a container. Gap 0.875 → 1.375.
- **clipboard-paste**: the board's top-right corner r 2 → r 1.5 (the frame radius). The overlap cuts were measured to the sheet's real corner arc: ends (12,4.74) and (5.9,14). Gap 0.978 → 1.133.
- **cloud-snow**: cloud moved 0.5 up (the one cloud shape, moved), dots at 14.25. Gaps 0.94 → 1.44. Dots at 14.5 leave the drawing area.
- **coins**:
  - coins r 4 offset 4 → r 4.5 offset 3, the multiples rule (front 6.5,6.5; back 9.5,9.5). The back arc was recut with `behind` at 2.25.
  - inner ring r 2 → 1.5. The ring gap goes 0.875 → 1.875 and the annulus counter 1.05 → 2.05.
  - the back coin's visible arc is now shorter.
- **crown**:
  - the body bottom moved 13 → 13.5 with the band cut kept at 10.5, so the band counter goes 1.43 → 1.93.
  - the balls moved up 0.25 (2.5,4.5 / 8,2.75 / 13.5,4.5). Gaps 1.10–1.12 → 1.35–1.37.
- **crystal-ball**: highlight arc r 2 → r 1.5 (M6.5 6 A1.5 1.5 0 0 1 8 4.5). Gap 0.875 → 1.375.
- **database-search**: the middle band's end moved to (6.282,9.9), 1.124 → 1.136. The side and bottom overlap cuts moved 0.005 (7.485 / 8.085), from 1.1248 to 1.128, so they print tight.
- **desktop-check**: 2/4 check → 1.5/3 (M6 7 L7.5 8.5 L10.5 5.5). It can't be centred at 2/4 with the gap over 1.125 on the lattice. Gaps 0.877/1.111 → 1.375/1.425.
- **dumbbell**: plates 2 → 3 wide (3.5–6.5 and 9.5–12.5, r 1), collars removed, stubs 1.5–3.5 and 12.5–14.5. The plate and collar pockets were 0.93, and there's no room for both at 2.625 or more. This changes the Phosphor barbell.
- **duplicate**: 4px plus → 3px (next size; M6.5 8V11 M5 9.5H8). Gap 0.875 → 1.375.
- **eraser**: band cut moved from x−y=−3 to −2 (M5 7 L9 11). Gap to the base line 0.875 → 1.375.
- **files**:
  - text line shortened to 5.5–7.5 (gap 0.875 → 1.375).
  - the fold went from 3.5 to 4, because its pocket was 1.43 and is now 1.77. Rebuilt by the document fold's construction: L at x 6 / y 8.5, r 1, diagonal x−y=2.295.
  - the back page's diagonal was changed to match (x−y=8.295).
- **film**:
  - side strips 2.5 → 3 wide (verticals at 5.5 and 10.5).
  - the sprocket ticks go from three per side (5/8/11) to two (5.5/10.5); the centre divider stays at 8.
  - all cells are now 1.93 or more; they were 1.43.
- **filter-add**: funnel line ends moved to (8.092,13.204) and (9.5,9.8). Gap 1.124 → 1.131.
- **filter-dismiss**: funnel line ends moved to (8.05,13.225) and (9.896,8.025). The cut goes 1.1248 → 1.13, so it prints tight.

## Left as is

- **alarm-off**: already clean. The 0.29 is the recorded `data-counter="sliver"`.
- **cloud-upload, devices**: their only "detail" is an overlap cut at exactly 1.125, which the lint labels "detail" because its detail range includes 1.125.
- **bug-off**: the mandible U (bug's own head, r 1 at 8,3.5) sits 1.057 from the flat shared slash. Bug is drawn whole under the flat slash, by the owner's rule. Moving the drawing perpendicular to the slash breaks the left leg (it would be 1.0). Options: shorten bug's mandibles (V3 instead of V3.5, in bug and bug-off together), or declare `data-gap="slash"` as keyboard-off does.
- **calculator**: three key columns can't fit the 10-wide frame. They need 10.125 even at exactly 1.125. With the owner's display rect (3 tall, "display larger", 2026-10-07), two key rows also can't fit the 13-tall frame; they are 0.0625 short on the grid. Options: 2×2 keys plus a header band, or Lucide's line display with fewer keys. Either changes the owner's display.
- **clapperboard**: the owner asked for Fluent's movies_and_tv "exactly", with three line-weight stripes 3.13 apart on an 11 × 2.75 board. The stripe pockets (0.93–1.25) are capped by the stripe spacing. Two stripes would fit.
