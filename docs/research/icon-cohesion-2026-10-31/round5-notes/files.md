# File family: gap floor 1.125 / counter floor 1.5 (batch 1)

Page body, fold and r 1.5 corners untouched everywhere (except file-pdf, below). Marks centre in the free
interior below the fold (8, 10.25) unless noted. "exact 1.125" = exactly one line, the new floor; the
unchanged lint still prints it as "detail" because its detail band (0.875–1.125) is tested first.

| icon | change | gaps old → new |
|---|---|---|
| document-check | none: the 1.5 / 3 check already sits exactly one line from fold, sides and floor (it fills the 9 × 7.5 interior exactly) | 1.125 ×5 (exact) |
| document-dismiss, file-x (alias) | 3 × 3 × moved 0.25 down to centre on 10.25 (`M6.5 8.75L9.5 11.75M9.5 8.75L6.5 11.75`) | fold / floor 0.875 → 1.125 exact; sides 1.375 → 1.875 |
| file-code | chevrons one size down: legs 1 (2 tall, was 3), tips 5.75 / 10.25, ends 6.75 / 9.25, centred on y 10. 3-tall chevrons need 5.25 of width with a 2.25 space between them; the page gives 4.5 | page 0.875 → 1.125 exact; fold 1.16 → 1.38; between chevrons (subpaths) 0.875 → 1.375; floor 1.875 |
| file-cog | none: its only 1.125 is the overlap cut round the gear (exception); counters 2.12 / 2.88 | — |
| file-diff | ± one size down to the 3px + and − (`M8 5.5V8.5M6.5 7H9.5M6.5 11H9.5`); the 4px + can't clear the chamfer and the − both | chamfer 1.00 → 1.35; + to − (subpaths) 0.875 → 1.375; floor 1.875 |
| file-download | arrow shaft 3.5 → 3 (head 1.5), centred on 8, 10.25 (`M8 8.75V11.75M6.5 10.25L8 11.75L9.5 10.25`) | floor 0.875 → 1.125 exact; fold 1.18 → 1.41 |
| file-export | the same arrow turned: shaft 4 → 3, centred on x, y 10 (10.25 is off the 0.5 grid for a horizontal) (`M6.5 10H9.5M8 8.5L9.5 10L8 11.5`) | fold 1.02 → 1.18; page 1.375 / 1.875 |
| file-upload | shaft 3.5 → 3 (tail 12 → 11.5); keeps its recorded 0.5-left lattice position | floor 0.875 → 1.375 |
| file-image | sun (⌀2 mark dot) 6, 7.5 → 6.5, 8 | page 0.94 → 1.44; fold 1.24 → 1.18; mountain 1.83 → 1.17 |
| file-json | braces 3.5 → 3 tall (8.75–11.75), cusp r 0.5 → 0.25 (tips 5.5 → 5.75), hooks r 0.75 kept | page 0.875 → 1.125 exact; floor 0.875 → 1.125 exact; fold 0.88 → 1.13; between braces 1.375 |
| file-lock | shackle r 1 → r 1.5 with 1.5 legs (person-lock's lock as another agent just redrew it: `M3.5 10.5V9A1.5 1.5 0 0 1 6.5 9V10.5`); page overlap cut recomputed (r 3.75 round the shackle, r 0.75 fillet; left edge now ends 5.563) | shackle counter 0.93 → 1.93; overlap cuts 1.125 (exception); shackle–fold 1.90 |
| file-pdf | top-left corner r 2 → r 1.5 (the family's page); PDF label 0.5 lower (9–14); D's stem 6.5 → 7 with a 0.25 bar (was 0.5); F's stem 11.5 → 12, bar 2 → 1.5 (mid bar 1) | page end–P 0.95 → 1.44; fold–F 0.875 → 1.375; P–D 0.875 → 1.375; D–F 0.875 → 1.125 exact; D–fold 1.75; D counter 1.93 → 1.68 |
| file-question | ? hook r 0.9 → 0.75, starting at 230° (upper left) instead of 180°, centre 6.25, 8.25, short tail to 9.25; ⌀1.5 dot 2.25 below at 6.25, 11.5 | page 0.975 → 1.14; fold 0.90 → 1.23; floor 0.94 → 1.19; stem–dot 0.94 (exception) |
| file-user | head r 1.5 at 5.5, 8.5 → 5, 8; body opened (no base line, Lucide's shoulders) and 6 → 5 wide (2.5–7.5 × 12–14, r 1); page overlap cut recomputed round head and body; page's bottom-right corner r 2 → r 1.5 (it had been missed) | head–body 0.875 → 1.375; body counter 0.93 → none; overlap cuts 1.125 (exception); head–fold 1.19 → 1.28 |
| file-warning | ! moved 6.5 → 6 (stem 7–9.25, dot 6, 11.5) | fold 0.98 → 1.41; page 1.875 → 1.375; floor 1.19; stem–dot 0.94 (exception) |
| file-clock | hands shortened to fit the r 3 ring: `M5.5 9.75V10.5L6 11` (vertical 0.75, diagonal 0.5 / 0.5). The ring can't grow (r 3.5 hits the fold or breaks the keyline) | hands–ring 0.875 → 1.125 exact; overlap cut 1.125 (exception) |

## Trade-offs for the owner

- file-question: the owner asked for the r 0.9 hook (2026-10, "top part too small"). r 0.9 with the dot 2.25
  below can't clear fold, left edge and floor by one line; the most that fits is r 0.75, starting at 230°.
  The stem is almost gone (0.13 below the curve's control).
- file-code: the chevrons are 2 tall, down from 3; folder-code shares the 3-tall chevrons and wasn't touched.
- file-clock: the hands are very short (they read as a small L at 16).
- file-user: the figure's body is open (shoulders without a base), unlike person's closed dome; a closed body
  needs 2.625 of height and that doesn't fit under the fold.
- Off the lattice (accepted for centring, as file-code's chevrons were): the download / export arrow
  heads and the ×.
- file-image's mountain ends still sit where the r 2 corner was, 0.19 inside the r 1.5 corner. This is a join,
  so the lint passes it, but the ends could be moved to 4.219 / 11.781, 13.781.
- Slivers (look.mjs --slivers): file-cog filled at 16 and file-clock filled at 48 (8.5, 6.4, by the fold).
  I didn't change either fill path, so these come from the page and not from these edits.
- geometry-audit: file-cog's 0.87 "subgaps" are between tooth roots that sit on the gear's ring. They are
  joined through the ring, so they aren't real gaps.
