# Icon review, 2026-10-12

## Round 12 decisions

The relaunched review page (`../2026-10-11/README.md`, round 12) took 57 decisions in `reviews7`: 53 approvals
and four replacements, with no set-level notes. Every reopened icon was decided.

- **Approvals** synced to batches.json (all newer than their drawings): binary, divide, file-pdf, heading-1,
  heading-2, list-numbered, sort-numeric, subscript and superscript move from review to approved; the rest were
  approved already.
- **Redrawn** (spec "Owner review round 12"): at (Fluent mention: smaller a, open pockets), quote (Fluent
  text_quote's gentle tail, kept as opening marks), sort-alpha (Fluent: a 5 × 5 A), strikethrough (Phosphor: the
  lower bowl 0.5 wider each side). They are back in review. Sheet: `1-round-12-fixes.png` (after, then each before
  and its reference).

### Calls to confirm

- quote: owner chose opening marks ("66") with the gentler tail (Fluent's mark turned 180°). Sheet `2-quote-opening.png`.
- sort-alpha's A is larger than its Z (Fluent's proportion), so the A leaves the 4-tall small-glyph tier that
  sort-numeric and binary keep.

## Round 12b decisions

The page showed only at, quote, sort-alpha and strikethrough. sort-alpha and strikethrough are approved.

- **quote** (owner: "the tails are maybe a bit too long"): the tail is 5.5 long (was 6.5), the whole curve scaled so
  it keeps its gentle shape; the marks sit at y 10 so the pair stays centred. Back in review.
- **at** (owner: "is the a too small? how does it match the other letter icons"): the @'s a is now the same drawing as
  every other a in the set (case-lower, case-sensitive, whole-word: an r 2 bowl, 4 tall, stem on its right side); the
  old one was 1.5× their size. Sheet `3-at-and-quote.png` shows it beside them and an r 2.5 a for comparison. Owner (chat): keep the matching a. at is approved.

## Round 12d page, and the optical size pass

- **Review page:** the 43 icons redrawn in round 11 and never reviewed since are on the page (version 53), each with the
  note it answers, what changed and a Before from the commit before round 11 (`fixes-12d.json`; the before drawings were
  emitted by running the generator on a copy of the sources holding those drawings, `BEFORE_TSX` in
  `../2026-10-11/round12-data.mjs`). battery-low had no verdict and is marked as redrawn with battery-medium.
- **Optical size pass** (spec "Optical size pass, 2026-10-12"): every icon measured against its keyline class and judged
  beside the keyline references. 11 rectangular frames that filled the whole keyline came down to the shared frames
  (server, server-cog, piano, film, bandage, keyboard, keyboard-off, gif, markdown, pipeline, chess-rook); they are in
  review. Sheet: `4-optical-size-pass.png` (grey references, red before, black after).

### Calls to confirm

- qr-code, calculator and gamepad read about 10–20% heavier than their peers but cannot shrink a pixel without breaking a
  construction you set (qr-code's finders and cores, calculator's larger display) or the 45° lattice (gamepad). A
  different construction would be needed: qr-code with 4 × 4 finders and 1 × 1 cores, calculator with a 2.5-tall display,
  gamepad redrawn on a 12-wide body.
- diamond reads smaller than the square frame; the next size up puts its edges off the lattice (soft at 1×).

## Round 12d decisions

30 of the 43 approved and synced. 13 changed (spec "Owner review round 12d"): bug-off and hand-wave (filled only), the
zips (the third tooth back, shorter pulls), form (lines 3 apart again), kanban (equal columns), file-question (a larger
hook), file-audio (Lucide's note), gavel (Phosphor's longer handle), gem and globe (Fluent's, exactly), globe-off and
umbrella (the globe's new lens). The review page (version 54, `fixes-12e.json`) shows them with the 11 optical-size
redraws, each with its Before.

### Calls to confirm

- gem fills by weight, as Fluent's premium does (the same drawing heavier, facets open), unlike most solid objects.
- kanban sits 0.5 right of centre so all six column edges stay sharp at 1×.
- file-question's hook is r 0.9: an r 1 hook comes 0.08 too close to the fold.

## Round 12e decisions

15 approved and synced; 9 changed plus file-audio's filled head (spec "Owner review round 12e"). The page is version 56
with the 10 (`fixes-12f.json`). Version 54 had shown the previous round's redraws as their old drawings (data built before
`npm run icons:pilot`); `round12-data.mjs` now refuses to run when the generated components are older than the sources.

### Calls to confirm

- keyboard-off gets one key back, not two: keyboard's other lower keys sit 0.63 from the slash or would merge into its
  filled gap.
- form's middle line is on a whole pixel so the margins are 3 on every side (slightly soft at 1×).

## Round 12f decisions

file-zip, folder-zip and form approved; 7 changed (spec "Owner review round 12f"); the page is version 57 with them
(`fixes-12g.json`). umbrella now follows Fluent (no ribs), so it no longer shares the globe's lens.

## Round 12g decisions

umbrella approved; 6 changed (spec "Owner review round 12g"); page version 58 (`fixes-12h.json`). New generator
exception `data-gap="slash"` (keyboard-off: all of keyboard's keys under the slash).

## Round 12h decisions

bug-off approved; globe (Fluent's ink, exactly), globe-off, hand-wave (back to the Fluent construction), keyboard-off
(all keys filled too) and file-audio (round head) changed; page version 59 (`fixes-12i.json`).

### Calls to confirm

- globe is Fluent's 12-ink globe, so it reads a little smaller than Area's r 6 rings and doesn't thin on the size curve.
