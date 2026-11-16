# Area Serif 0.49: steeper joins, thin check, and how old style it reads

Owner, 2026-11-12: thin parts must not be too thin; the curves into a serif or inside a counter should be steeper,
"not as long and curved out"; C's and G's tops toward the two reference faces; make the face read less old style and
more transitional, with moderate contrast. The screenshots mentioned did not reach the session, so the joins were
found by measurement. Tools: `tools/joins/` (run from `typefaces/area-serif` with its venv). Values in stems unless a
unit is named: n's stem for lowercase, H's for capitals. R1 is Georgia Pro, R2 is Serrif.

## Measured on 0.46

| Part | Area | R1 | R2 | Tool |
|---|---|---|---|---|
| n foot: serif thickness 0.2 / 0.1 / 0.05 from the stem | 0.64 / 0.81 / 0.93 | 0.48 / 0.57 / 0.65 | 0.51 / 0.62 / 0.71 | `prof.py` |
| n foot: stem's extra width at 0.5 / 0.7 stems high | 0.34 / 0.16 | 0.17 / 0.03 | 0.21 / 0.06 | `prof.py` |
| E top arm: flare begins, stems before the beak's face | 2.4 | 1.0 to 1.3 | 1.7 | `arms.py` |
| E lower arm, thickness 0.1 of its length from the stem | 0.91 | 0.45 | 0.38 | `arms.py` |
| C top barb's cut end, share of the cap height | 0.755 | 0.650 | 0.695 | overlay |
| C / G stroke at 60 degrees from the bowl's centre | 0.83 / 1.08 | 0.61 / 0.72 | 0.58 / 0.73 | `arms.py` |
| Hairline, lowercase / capitals, units per 1000 | 41 to 43 / 49 to 51 | 38 / 44 | 34 / 39 | `thin.py` |
| Tail ends c e t, units | 23 | 38 | 26 to 29 | `thin.py` |
| Beak ends E F L Z, units | 26 to 29 | 37 | 26 | `thin.py` |
| Serif tip, units (share of stem) | 30 (0.385) | 33 to 36 (0.37) | 25 to 27 (0.30) | `thin.py` |
| o: thin points at, contrast | 87 and 270 degrees, 1.91 | 90 and 270, 2.72 | 87 and 267, 2.89 | `style.py` |
| Head serif slope, n and l | 15 and 13 degrees | 3 and 3 | 13 and 13 | `style.py` |
| x-height / cap height | 0.730 | 0.694 | 0.691 | `style.py` |

## Changed in 0.49 (`typefaces/area-serif/joins.py`)

- Bracket handles 0.45 / 0.75 to 0.70 / 0.90, fitted to the mean of the two measured profiles (least squares over ten
  samples; the nodes stay). n foot after: 0.51 / 0.64 / 0.78 and 0.22 / 0.07.
- Arm flares (E F L T Z): 1.5 H stems long, handles 0.60 / 0.25 (fitted the same way; 0.65 / 0.55 before).
- E's and L's lower inside corner: a fillet 0.5 stems each way. L's replaces the corner of the owner's 0.34 save.
- C G S end barbs: cut end at 0.695 of the cap height, 42 wide on all three, inside curve handles 0.62 / 0.62.
- Ends: tails 0.37 stems (28 to 30 units), beak ends and r's long foot tip 30.

Checks: qa.py passes (targets, 0 outline errors, parts audit 0 outliers, fontbakery 0 FAIL). `evaluate.py` counts
"flat" arcs 114 (3 before): its measure reads the new bracket, a tight turn by design, as flat; jumps 24 (27).

## How old style it reads

The axis is upright and the terminals are round, both transitional. What read as old style was the full bracket, the
long flares (both changed above), and the steep head serifs (open). Low contrast (1.9) reads sturdy rather than old
style and is the owner's brief. Sources agree on the markers (upright axis, flatter and sharper serifs, round
terminals) and give no numbers: TypeType UniversiTTy lessons 7 to 10, Wikipedia on Baskerville, Scotch Roman and
Georgia, TypeDrawers on consistency. Not reachable: Frere-Jones's Typeface Mechanics, Cheng's Designing Type.

## Open proposals (on the review page, build 0.49)

1. Head serifs from 15 to about 8 degrees. 2. Contrast stays 1.9. 3. C's lower end as a 30-unit cut, not a point
(5 units thick at its tip). 4. The steeper bracket on diagonal joins, after checking the owner's v, x and V saves.
5. A figures pass (2 3 5 6 9 ends). 6. Keep the three scans beside the parts audit every build.

## 0.50: flatter head serifs (proposal 1, taken)

`joins.flatter_flags`: b d h i j k l m n p r from 13.5-15 to 8 degrees, turned about the stem's top corner; the tip,
underside and bracket rise 16 to 18 units together. After (n, `tools/joins/flags.py`): tip top 0.984 of the x-height,
corner 1.001, underside 0.921 (R1 0.993 / 1.002 / 0.924; R2 0.948 / 0.980 / 0.892). qa.py passes. Found: the corner
sits at 1.00 on n and m, 0.99 on p, 0.97 on r; both references hold one height. Open with the owner.

## 0.51: one head serif height (taken)

`joins.level_flags`: p +3 and r +13, the whole head serif to n's corner height; r's notch and arm stay. qa.py passes.

## 0.52: C's lower end (proposal 3, taken)

`joins.C_end`, after `tidy`: the point (5 units thick) becomes a level cut 30 wide at the same height, corners rounded;
the outer contour and the upright face stay, the inside edge comes in. Thinnest crossing on C after: 33 units
(`thin.py`). Tried and dropped: c's tail geometry (outer edge arriving at 75 degrees), which left the last third of
the stroke 24 units thick. qa.py passes; `evaluate.py` unchanged (C clean).

## 0.53: diagonal joins (proposal 4, taken in part)

`joins.steep_diagonals`: on the open side of a diagonal's join with its serif (the stroke leans away from the serif),
handles go to the bracket's shares, 0.90 along the serif and 0.70 along the stroke (0.68-0.77 and 0.45 before): 24
joins on A K V W X Y k v w x y. Handles only; no node moves. The closed side keeps its fillet: the steep shares
pinched it into a hook (seen in a proof), and both references keep a round fillet there. Still uneven: the closed-side
handle shares on v w x y, from the owner's saves (0.27 to 0.65 along the serif). qa.py passes.

## 0.54: C and G toward Georgia Pro, inside joins (owner, with three pictures over Georgia Pro)

Measured with `tools/joins/cg.py`, in cap heights (Area 0.53 / R1): barb's cut end C 0.695 / 0.643, G 0.695 / 0.651;
barb width at its foot 0.059 / 0.062 and at 0.80 of the cap height 0.079 / 0.107 (R1's is a wedge); G's bar top
0.511 / 0.450; G's stem right edge 0.897 / 0.851, R1's in line with its barb's edge (0.851).

- `joins.END_BARB_FOOT` 0.66, `END_LEAN` 0.32, `END_K` (0.62, 0.55): the barb reaches lower and its inside edge leans.
  After: C's barb 0.125 wide at 0.80 (R1 0.107). No notch or spur (owner's earlier choice).
- `joins.G_lower`: bar and stem moved as one piece by (-16, -22): bar top 0.480, stem right edge 0.875, width 0.975
  (R1 0.981). The chin (the stem's right edge ends at 0.110; R1 0.063) not redrawn.
- `joins.even_fillets`: the closed side of k v w x y's joins, 11 fillets, handles 0.62 / 0.60. Handles only.

qa.py passes. `evaluate.py`: jumps 28 (24), the four new on C, G, S.

## 0.55: notch and spur on C G S (owner's choice over a thinner tip)

`joins.barb_spurs` (and inside `barb_bottom` for S's lower barb): spur top at the cap height, 45 wide; notch 65 in
from the barb's outer edge and 36 deep (R1 on C: 0.063, 0.091 and 0.063 cap heights; Area 0.063, 0.091, 0.051). The
spur's corners are sharp. Proofed at 13, 16 and 26 px beside 0.54 and R1. qa.py passes; `evaluate.py` jumps 31 (28).
Open: lowercase s (R1's has the spur).

## 0.56: lowercase s (owner: yes)

`joins.s_spurs`: `barb_spurs` at 0.9 on both of s's barbs, spur tops at the x-height and on the baseline (40 wide,
notch 58 in and 32 deep). Barb length unchanged (shorter than R1's). Proofed at 13, 16, 26 px. qa.py passes; jumps 31.

## 0.57: figures (proposal 5, taken; smaller than proposed)

Surveyed first (`tools/joins/figw.py`, `figs.py`, overlays): thick strokes 1.07 H stems on every figure (R1 1.02-1.05,
R2 1.01-1.10); ends follow the references. Ink per (height x H stem) is 1.02 to 1.14 of the references' mean, from
the low contrast. `joins.figure_ends`: the 7's beak 28 to 30; the 5's round end 92 to 88 (2 3 6 9: 88). Not changed:
the 5's rounded heel (owner's note: copy Serrif). qa.py passes; jumps 31.
