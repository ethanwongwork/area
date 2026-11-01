# Batch 1: folder, battery and bell families (gap floor 1.125, counter floor 1.5)

Lint: `generate.mjs --only <all 19> --report` prints "icon lint ok". There are no detail gaps
and no counters under 1.5. The one exception is the battery terminal's 0.88, which is the
owner's `data-gap="close"`. The lint still labels it "detail", because it checks for the
detail step before close. The geometry audit is clean. The sliver check is clean except
folder-zip, whose flag was already there before this batch (see below). Sheets:
`look-folders.png` and `look-bb.png` in this folder. The original sources are in `orig/`.

## Folder (body, tab and flap unchanged, verbatim folder.svg)

Under the flap there is only 5.9 of ink-free height (6.56–12.44). A 3-tall mark centred
there leaves 0.875 above and below. To get the 1.125 floor, the marks either move right of
the flap's corner, where the tab gives more height, or shrink.

- **folder-add**: the 3px + moves from 8, 9.5 to 9, 9 (one step up, one right, clear of
  the flap corner). Gaps: bottom 0.88 → 1.38, flap 1.11 → 1.35.
- **folder-code**: the chevrons drop from 3 tall to 2 tall (arms 1, still on the lattice),
  centred at 8, 9.5: `M6.5 8.5L5.5 9.5L6.5 10.5M9.5 8.5L10.5 9.5L9.5 10.5`. Gaps 0.88 / 0.88
  → 1.38 / 1.38. At 3 tall with legs of 1.5 they cannot reach 1.125 anywhere in the body.
- **folder-git**: the r 1.5 ring cannot sit at 8, 9.5 (0.88 from the foot) or at 8, 9 (0.54
  from the flap corner). It moves to 9.5, 9, with stubs `M5.5 9H8M11 9H11.5` and the filled
  gap disc moved with it. Gaps 0.88 / 1.02 → 1.38 / 1.28. Now the glyph sits off-centre to
  the right and the right stub is short. Alternatives drawn in `cand/fg.png`: a solid ⌀3 node
  centred (cleanest, but it needs `data-dot="free"`, an owner exception), a ⌀2 dot, or the
  line run wall to wall. `data-gap="aligned"` is kept, though nothing needs it now.
- **folder-input**: the body's lower stub (`V10.75`) is gone, so the wall reopens at the
  corner arc's end. The arrow moves to y 9 with a 1.5 head, as on file-download:
  `M2 9H11M9.5 7.5L11 9L9.5 10.5`. Gaps 0.88 (head to top edge) / 1.0 (head to flap
  diagonal) → 1.38 / 1.70. The 1.70 is "tight" to the lint (whose tight runs to 1.75), but it
  falls in your 1.625–1.75 band. No 1.5 head on the lattice gets the flap gap to 1.75 or more.
- **folder-lock**: the shackle pocket was 0.93. A pocket of 1.5 or more needs an r 1.5
  shackle (3 wide) with 1.5 legs, so the lock grows to Area's lock proportion: a 5 × 3 body,
  r 1, at 8.5–13.5 × 10–13; shackle `M9.5 10V8.5A1.5 1.5 0 0 1 12.5 8.5V10`. The folder
  outline is re-cut round it (clear 2.3: bottom ends 6.355, the right wall ends at the corner
  arc (14, 6), the 0.17 stub dropped). The fill is rebuilt as the offset boundary with an
  r 0.75 fillet. Counter 0.93 → 1.93. Overlap cuts 1.13 → 1.18 / 1.28. **file-lock and
  person-lock (not mine) use the same small 4 × 3 lock with the same 0.93 pocket**, so they
  need this lock too.
- **folder-search**: the lens inside the body (r 1.5 at 9.5, 8.5) was 0.91 from the flap
  corner and its handle 0.88 from the wall, and no r 1.5 position fits. It now follows
  calendar-search and Lucide: an r 2 lens at 11, 10 with handle `M12.5 11.5L14 13` on the
  lower-right corner, the folder cut round it (clear 2.3, foot ends 7.919, wall 6.919). The
  fill stops on an r 4.3 arc. Lens and handle stay lines when filled, as on calendar-search.
  Gaps 0.88 / 0.91 → 1.18 overlap cut. Lens counter 1.88 → 2.88.
- **folder-sync**: the two halves of the sync mark were 2 apart (0.88). They are now 2.5
  apart (chords at y 9 and 11.5, r 2.358 about 11.5, 10.25, heads 1.25), and the mark moves
  0.5 left so the upper head is a standard 1.88 from the flap. At x 10 it was 2.23, between
  standard and open. The outline and fill are re-cut (clear 2.3, foot 7.74, the wall ends at
  the corner arc, fill fillet r 0.75). Gaps 0.88 → 1.38 (halves); overlap cut 1.18.
- **folder-zip**: the teeth were 0.94 from the top edge and the right wall. They move 0.5
  down and 0.5 left (column x 10, rows 6.5–10.5). The tab moves with them, to 8.5–11.5 with
  its arc centre at 12.55 so it still touches the last tooth, and the foot stays at 14 (ink
  box unchanged). The body's foot opening follows (8.5 / 11.5). Gaps 0.94 → 1.44. The tab's
  pocket is 1.93. The slivers check flags "fill beside a line" between the teeth rows; the
  original drawing was flagged the same way (checked), so this is not new.

## Battery (body and terminal unchanged; terminal close gap 0.88 kept)

- **battery-charging**: the 3-tall bolt inside the body was 0.88 from the top and bottom
  edges. It is now Lucide's construction: a full-height bolt
  `M7.75 4.5L5.75 8H8.25L6.25 11.5` with its ends on the body's edges, and the body outline
  cut open round it with the overlap cut (clear 2.3, `data-filled="line"`). The filled
  variant keeps the whole rect as `fill`, with the bolt as a knockout running out through
  both edges. Gaps 0.88 / 0.88 → 1.17 overlap cut.
- **battery-low / battery-medium**: bars moved from x 4 / 4, 6.5 to 4.5 / 4.5, 7, so the
  three levels are one construction with battery-full (4.5, 7, 9.5). The gaps were already
  1.38 and are unchanged.
- **battery, battery-full**: unchanged. They were already clean apart from the close
  terminal.

## Bell (one new body in every member)

A clapper pocket of 1.5 or more needs the cup 2.625 or more deep below the base, and the cup
foot cannot drop below 14 without breaking the square keyline. So the base rises from 11.5
to 11: the sides become `V7.5`, and the flare and base are the old ones moved up 0.5. The
cup stays the joined U, 4 wide and now 3 deep: `M6 11V12A2 2 0 0 0 10 12V11`. The pocket
goes 1.43 → 1.93 in bell, bell-dot, bell-off, bell-plus and bell-ring. The shared-parts line
("U cup 4 wide and 2.5 deep") should now read 3 deep. Alternatives drawn in
`cand/bells.png`: a separate flat clapper at y 14 (Phosphor), which keeps the body
untouched, and a separate Lucide arc, which also needs the base at 11.
- **bell-plus**: the + moves up 0.5 (`M8 4.5V8.5M6 6.5H10`), keeping 1.38 to the dome and
  the base.
- **bell-dot**: the outline is re-cut round the ⌀3 dot for the new body with clear 1.7. The
  overlap cut goes 1.12 "detail" → 1.14 tight.
- **bell-off, bell-ring**: body and cup swapped only. The slash still crosses flat.

## Open / for the owner

- folder-git's placement (off-centre ring, short right stub), or the solid ⌀3 node as an
  exception.
- folder-input's 1.70 gap from the head to the flap.
- folder-lock's larger lock, which file-lock and person-lock need too. The filled
  folder-lock, -search and -sync show a wedge of fill at the top-right corner beside the
  cut, the "horn" a spec note once removed from folder-lock.
- The bell base change (cup 3 deep).
- battery-charging's wide edge openings (Lucide's look).
- Nothing regenerated or committed. Spec and batches.json not touched.
