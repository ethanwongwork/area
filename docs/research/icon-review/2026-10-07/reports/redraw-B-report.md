# Redraw B report (phase 2, 2026-10-07)

Six icons redrawn on the owner's round-2 verdicts: bank, building, piano, chess-rook, hammer, trash.
Only these six sources were edited. Originals are in `groups/redraw-B/orig/`. Before/after sheets with
reference rows are `redraw-B/redraw-B-after-1.png` (bank, building, Fluent rows),
`-after-2.png` (piano, chess-rook, trash, Phosphor/Lucide rows) and `-after-3.png` (hammer, two
candidates, Phosphor rows). `n1.png` shows all six beside home and store.
Verification for all six: `gen-pilot-icons.mjs --only` lints clean; look.mjs `--slivers` reports no
slivers or islands at 16 or 48; checked by eye before/after at 16/24/32/48/96, outline and filled.

## bank
- **Verdict:** replace → Fluent (rounds 1 and 2, no note).
- **Reference:** Fluent `building_bank_16_regular` / `_16_filled` (also 20 and 24).
- **Reference construction:** the measurement backs up the group reviewer. Fluent's step and base are
  **one plinth block**, an outlined rounded rectangle 2–14 × 11–14 (centre-line about 2.5–13.5 ×
  11.5–13.5). Its top corners curve out from the colonnade's width (3–13) to the plinth's (2–14), and
  its bottom corners are almost square. The colonnade has **five** ink bars on its 16 cut (3–4, 5–6,
  7.5–8.5, 10–11, 12–13): the outer two are its sides, so there are four openings. At 20 and 24 it has
  five bars too. The pediment eaves reach the plinth's full width (outer 2–14) at about 39°, with a
  ⌀1.5 dot. Filled: the pediment and plinth are solid, and four solid columns stand between them.
- **Before:** four column lines 3 apart, a separate step line (3–13) and a base line (2–14), and
  eaves that stopped about 1 inside the base.
- **New construction:** a pediment from the polygon 1,7 · 8,1.605 · 15,7, filleted r 0.5 / 1.5 / 0.5
  (eaves at 2.16–13.84, base 7, apex arc top 2, about 38°), holding a ⌀1.5 hole at 8, 4.75. Five
  columns at x 3, 5.5, 8, 10.5 and 13 (even 2.5 spacing, gaps 1.375 tight) from 7 to 11.5. A plinth
  that is one rounded block, 2–14 × 11.5–14: r 1 top shoulders flaring from the colonnade's 3–13, and
  r 0.5 feet (counter 1.43). Filled: the pediment is solid with the dot open, the plinth is solid, and
  the columns stay lines joined to both. That follows the rule that an attached part stays ink and
  joins; Fluent instead parts its solid columns with gaps.
- **Deviation:** Fluent's column centres (3.5, 5.5, 8, 10.5, 12.5) leave uneven gaps of 0.875 and
  1.375. I used the even 2.5 spacing, so the outer columns sit on whole pixels (3 and 13), as the
  centred 8 already does.
- **Note answered:** the plinth block, the five bars and the full-width eaves were the differences
  that remained from Fluent. All three now match.

## building
- **Verdict:** round 1 approve; round 2 replace → Fluent.
- **Reference:** Fluent `building_16_regular` / `_16_filled` (also 20 and 24; `building_multiple`
  looked at).
- **Reference construction:** a stepped silhouette. A tall tower (outer 4–11) carries a lower wing on
  its right (to 13, top at about 7.5). Windows form a 2-column × 3-row grid of dots in the tower (2 ×
  2.5 apart), and the wing has one window in the third column on row 3. The tower and the wing's outer
  corner are rounded, and the foot is flat. A door sits at the bottom (a double door).
- **Door rule:** Fluent's building has a door, so the shared door is kept: home's arched door, 3 wide
  and 2.5 tall (6.5–9.5, top 11.5), a `hole` with the base line drawn over it.
- **New construction:** a tower 3–10.5 × 1.5–14 (r 1.5 top corners) and a wing 10.5–13 with its top
  at 6.5 (r 1 corner; the inner step corner is sharp, as Fluent's). Both foot corners are r 1.5. There
  are seven ⌀1.5 windows (holes): columns 5.5, 8 and 10.5 × rows 4, 6.5 and 9, the third column only
  on row 3 under the step, as Fluent's. Gaps are 1.0 detail between windows and 1.19 tight to the
  walls and door. Filled: the silhouette is solid, the windows and door are open, and the base line
  runs under the door, as before.
- **Deviation:** a Fluent-style even grid of ⌀1.5 dots 2.5 apart leaves its diagonals 2.04 apart. The
  step's inside corner is also 2.22 from the window below it. Both fall between the standard and
  open steps, and no other grid fits at ⌀1.5 inside the vertical keyline with three rows above the
  door (worked through: a 2.75 or 3.25 row step pushes row 3 into the door, and a 3 column step
  makes the icon 11.6 wide). So the icon takes `data-gap="aligned"`, the same declaration and reason
  as calendar's Fluent date grid (spec line "calendar … diagonals are 2.04 apart"). **This is an
  owner-only gap mode, so the coordinator or owner must confirm it.** Without it the only fit is two
  window rows.

## piano
- **Verdict:** replace → Phosphor (rounds 1 and 2).
- **Reference:** Phosphor `piano-keys` (regular and fill).
- **Reference construction:** a square frame (centre 2.5–13.5, small radius). The two black keys are
  **outlined** rectangles hanging from the frame's top: centre-lines 4.5–7 and 9–11.5, down to 9, with
  small rounded feet. Two white-key dividers at x 6 and 10 run from the keys' feet to the bottom,
  off-centre under each key. Fill: the black keys become solid and everything else stays the same.
- **Before:** the same positions, but the black keys were solid in the outline as well.
- **New construction:** the frame stays Area's 12 × 12 at r 2 (2–14). The black keys are outlined U
  paths at Phosphor's centre-lines (4.5–7 and 9–11.5, from the frame top to 9, r 0.5 feet; counter
  1.43), and the dividers at 6 and 10 run from 9 to 14. Filled: the keys turn solid (`data-filled`
  solid on the outlined paths), while the frame and dividers stay lines. This is exactly Phosphor's
  fill story and keeps the frame from inverting.
- **How the gap scale was met:** the round-1 note said the outlined keys failed the scale. Measured
  now, the white key between the two black keys is a 0.88 detail gap, which is on the scale. The
  outer white keys are 1.375 (wider than Phosphor's because Area's frame is 0.5 larger each side).
  The key counters are 1.43. Nothing was simplified.

## chess-rook
- **Verdict:** replace → Lucide, "needs to be thicker and wider, more like lucide".
- **Reference:** Lucide `chess-rook`.
- **Reference construction (24 grid):**
  - an open-topped crown 6–18 (half the width) with r 2 bottom corners;
  - a band line at 4, and two crenel ticks at 1/3 and 2/3 of the crown;
  - a body flaring slightly from the crown's arc ends (8–16) to 7–17;
  - a base 5–19 × 18–22 whose r 2 top corners start where the body lands.

  In ratios, the body top is 0.67 of the crown, the body foot is 0.71 of the base, and the crown,
  body and base are about 35 / 45 / 20 % of the height.
- **Before:** crown 4–12, body only 3 wide at the top (6.5–9.5) and 4 at the foot, base 3.5–12.5.
- **New construction:**
  - crown 3.5–12.5 × 1.5–7 (r 1.5 bottom corners);
  - band at 3, crenel ticks at 6.5 and 9.5 (thirds), from 1.5 to 3;
  - body 5 → 4.5 and 11 → 11.5 from 7 to 12 (it starts at the crown's arc ends and lands on the base's
    flat top, as Lucide's), so the body is now 6 wide at the top and 7 at the foot;
  - base 3–13 × 12–14.5, r 1.5 top and r 0.5 bottom corners.

  The ink is 11.1 × 14.1. The crown's bottom moved from 6 to 7, because at 6.5 the band and the body's
  top corner sat 2.38 apart, a near miss. The crown is therefore a little taller than Lucide's (42 %
  of the height against 35 %). Filled is unchanged in kind and keeps the reviewer's fix from today:
  the crown fills as a flat-topped solid (the `fill` role), the crenel slits are knockouts sawn flush
  through the top, and the body and base are solid.
- **Note answered:** the body is twice as wide at the top (3 → 6) and the whole piece is wider (base
  9 → 10, crown 8 → 9).

## hammer
- **Verdict:** replace → Phosphor. Round 1: "dont need the stroke tail at the end of the hammer".
  Round 2: "ratio size of the handle to the hammer head is too equal, the handle should be longer, can
  you make it look more like phosphor ratios without the stroke at the end".
- **Reference:** Phosphor `hammer` (regular and fill).
- **Reference construction (scaled to fit 13 px, × 0.9):**
  - a head 4.5k thick (k = 0.707), about 15k long, its upper edge straight from the face back to about
    45 % of its length;
  - a large claw arc (r about 5.4) sweeping down to the tip, then the tail, which is dropped here;
  - a small face cap parted by a slot near the face end;
  - a long, slim handle, about 3.6k wide and 11.4k long, joined nearer the face than the claw.

  Handle length to head length is about 0.77, and head thickness to handle width about 1.26.
- **Before:** the head was 5k thick and 16k long, and the handle 4k wide and only 10k long (ratio
  0.63). The heavy head and stubby handle are what the owner read as "too equal".
- **New construction:** still in a 45° frame on the lattice.
  - Head: 15k long and 4k thick (2.83). The upper edge runs straight from the face back 8k, then the
    claw is a single r 5.745 arc, tangent to it, ending at the tip (no tail). The face end has r 0.75
    corners and a cap 3k long, parted by a `cut`.
  - Handle: 3k wide (2.12) and 12k long (8.49), with r 1 end corners. It joins under the head 6k from
    the claw tip and 3k before the cut.
  - Ratios: handle to head 0.80 and head thickness to handle width 1.33 (Phosphor 0.77 and 1.26).
  - Filled: head and handle are solid (a tool is one mass) and the cut parts the face cap.

  The ink is 12.9 × 11.4, centred at 8.3, 7.95. x is 0.3 right of centre; the lattice allows only
  8.3 or 7.3 for this extent. The old icon sat at 7.8.
- **Why these values:** the square keyline caps the hammer's diagonal width. The cut needs 3k to the
  face (a 1.0 counter) and 3k to the handle (2k left them 0.29 apart, which fails the lint). With a 5k
  head and a 4k handle that cap holds the handle at 10k whatever the head length, which is the old
  drawing. Phosphor's own proportions at true scale are slimmer (4.5k / 3.6k), so the 4k head and 3k
  handle are the lattice's nearest fit, and they free room for a 12k handle.
- **Candidates:** in `redraw-B/`. `hammer-C1.svg` keeps the 5k / 4k weights with a 14k head and a 10k
  handle (ratio 0.71; the claw is shortened to 4k). `hammer-C5.svg` uses a 5k head, a 3k handle and an
  11k handle. Both are shown in `-after-3.png`. The applied drawing (`hammer-C6.svg`) reads closest
  to Phosphor.

## trash
- **Verdict:** round 1 replace → Lucide, "wider handle"; round 2 replace → Phosphor, "needs to be wider
  base and wider handle".
- **Reference:** Phosphor `trash` (regular and fill). Lucide `trash` was also looked at.
- **Reference construction:**
  - a lid line 2.5–13.5 (centre-line) at 3.5;
  - a straight, untapered body 3.5–12.5 (9 wide, the lid overhanging 1 each side) down to 13.5, with
    small foot radii;
  - a squat, wide handle 5.5–10.5 (5 wide), 2 tall, r 1;
  - two lines at 6.5 and 9.5, 3 from the lid and 3 from the bottom.
- **Before:** lid 3–13, body 4–12 (8 wide), handle 6–10 (4 wide) and 3 tall, vertical keyline.
- **New construction:** the keyline is now `square` (the object is 12.1 × 13.1).
  - Lid 2.5–13.5 at 4.5.
  - Handle 5.5–10.5 × 2–4.5, r 1 (counter 1.43). It is 2.5 tall, not Phosphor's 2, because 2 would
    leave a 0.875 counter.
  - Body 3.5–12.5 × 4.5–14, r 1.5 feet.
  - Lines at 6.5 and 9.5 from 7 to 11.5, tight 1.375 to the lid and bottom. At 7.5 a line's top sat
    2.04 from the handle's leg, a near miss.
  - Filled as before: the body is solid, the lines are knockouts, and the lid and handle stay lines.
- **Note answered:** the body (base) is 8 → 9 wide and the handle 4 → 5 wide, both Phosphor's.

## For the coordinator
- **building:** declares `data-gap="aligned"` for its even Fluent window grid, as calendar does. This
  needs owner confirmation; the alternative is two window rows.
- **Spec construction lines to record:** the six "New construction" lines above. trash's keyline
  changed from vertical to square.
- **Notes:**
  - building's door stays home's shared arched door; Fluent's own door is a double door.
  - hammer's ink centre is 8.3.
  - chess-rook's crown is a little taller than Lucide's, forced by the gap scale.
