# Area Serif: evenness audit against Georgia Pro, build 0.35 to 0.36

Owner, 2026-11-12: "audit area serif against georgia pro. i like how straight the lines are, the thicks and thins are
clean and even, and the shapes are well balanced optically ... theres something about area serif that just makes the
forms feel more organic/inconsistent and less technically, mathematically, and visually consistent." And: ingest the
research note ("Area Serif: UI Legibility Evaluation and Cleanup Notes"), no drastic changes, no part removed or
restyled.

Georgia Pro is measured only. Lengths are in n stems (82 units) for lowercase and H stems (90) for capitals.

## What the audit found

Georgia Pro is not smoother than Area curve by curve (its bowls swell less evenly than Area's). What reads as
technical is that it holds **one value where Area held several**:

| Measure | Georgia Pro | Area 0.35 | Area 0.36 |
|---|---|---|---|
| Lines 1-3 units off upright or level | 0 on stems and bars | 17 (n's right stem 2 off, k's 3, e's bar 2, r's base 3, T's beak faces 2, h, u, f, R, s, 1, 3) | 0 |
| Thin point of arches and open tops | 0.36-0.42 on every letter | n 0.50, h 0.54, m 0.55, u 0.62, c 0.46, e 0.46, g 0.50, a 0.45, s 0.44 | n h m u c e g 0.58, a 0.55, s 0.52 |
| Thin point, capitals | 0.38-0.41 | G bottom 0.45 (C 0.59), S bottom 0.51 (top 0.59) | G 0.59, S 0.59 |
| Arch meets the right stem (straight up to, share of x-height, outside / inside) | n h m all 0.77 / 0.74 | n 0.69 / 0.66, h 0.71 / 0.70, m 0.79 / 0.73 | n h m all 0.73 / 0.71 |
| Bowl quarter, handle share outside | o 0.57-0.59 on all four | o 0.52-0.58, c 0.53-0.64, e 0.56-0.70, C 0.58-0.61 | 0.56-0.58 on o c e b d p q O Q C G D 0 6 8 9 S s |
| Bowl quarter, handle share inside | o 0.62-0.63; b d p q bowl side 0.60-0.62 | o 0.57-0.62, c 0.47-0.67, d 0.56-0.69, b 0.51-0.60 | 0.60-0.62 |
| End barb's cut face (C G S s), off upright | 1-3 degrees | S 5 and 0, s 2 and 11, C 5 and 6, G 5 | 0 |
| Arm beak's cut face (E F L Z z) | 4-6 degrees | 4.1-5.4 | 4.0-4.3 |

Already even, left alone: stems (1.00 everywhere), round strokes' thick (1.12), o O 0 symmetry (extremes at 0.49-0.51),
serif lengths, overshoots, closed bowls' thin (o b d q 0.64-0.68).

## What changed (clean.py, called from normalize.py)

1. `true_lines`: a line within 3 units of an axis becomes exact; the end that makes a true stem width stays.
2. `shoulders`: n h m meet the right stem at one height (352 outside, 348 inside) with one pair of curves.
3. `thin_floor`: the counter's own extreme point moves toward the counter until the thin point reaches its value.
   Outsides, heights and widths do not move. c's and e's counters are 10 units shorter at the top; n's arch 6.
4. `barb_faces`: end barbs upright (the tip keeps its place); arm beaks lean by one angle.
5. `even_tension`: bowl quarters carry 0.57 outside and 0.61 inside (run again after `harmonize`).

36 glyphs changed; no advance changed; the largest point move is 36 units (m's last shoulder node, along its stem).
`evaluate.py` totals are unchanged (extremes 32, flat 10, jumps 25, wobble 5). QA passes.

## Tried and taken back

Foot brackets 0.80 to 0.70 stems high, so stems run straight further (Georgia Pro's bracket starts 0.73 stems up,
Area's 0.99). It worked on i l n h but left a lopsided bracket on r's long foot and a wobble on q's descender foot.
Open: it needs those two feet handled first.

## From the research note

Taken in this build: the hairline floor held to one value per kind (4.1), arch joins and shoulders unified (4.1),
serif and wedge consistency (already one length each; 4.2).

Not taken, each a decision or a larger piece of work, in the note's priority order:

1. Tabular figures (tnum), quieter default figures (92-95% of cap height), case-sensitive colon.
2. One thin value across bowls and arches (bowls are 0.65, arches 0.58: Georgia Pro uses one). Round to straight
   colour is already 1.12.
3. Serif mass: tip is 0.37 of the stem, the same ratio as Georgia Pro's; tighter brackets are the open item above.
4. Sidebearings 5-10 units tighter, word space, collision kerning (f r T V W Y, punctuation).
5. Vertical metrics for buttons; hinting for Windows.
6. Regular stem +3-5% chosen at 14 px, or a GRAD or opsz axis.
7. Fallback metrics against Georgia; webfont build.

## 0.37: one thin value (owner: "Yes, one value")

Arches and open tops raised to the closed bowls' 0.65 (n h m u c e s); capitals C G S and D's bottom to O's 0.63.
a stops at 0.60 and g at 0.59 (curve defects at 0.65). The bowls were not thinned: o at 0.58 would put contrast at
1.9 against the 1.64 target. `evaluate.py` totals unchanged; QA passes.

## 0.38: the other way (owner: "id actually prefer to make the thicker parts thinner")

0.37 is superseded. One thin value still, but the arches' own (0.52) with the bowls brought down to it; capitals
0.57. o's contrast 1.64 to 2.14. Also s, t, e, r and the spacing pass: see changes.json 0.38 and the guidelines.

## Not checked

The page in a browser; rendering at 12-16 px at 1x; Windows.
