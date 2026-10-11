# Icon review, 2026-10-10

## Round 22–23: the cloud family on option D

`cloud-shape-options.md` and sheets 1–3: the three-hump cloud (option D) and the family re-fitted on it (README of
`../2026-10-07/`, rounds 21–23). All approved in `reviews7`.

## Batch 70: new icons

At the start of the session every `reviews7` verdict was an approval and `candidates1` was empty, so a new round
started with new work. A fresh gap pass compared the set with Fluent, Lucide, Phosphor, Hugeicons and SF Symbols
(`docs/research/icon-audit/libs.py`) and kept the concepts with a clear product use. These were the earlier audit's 25
undrawn rows (`relevance-2026-10-02.md`) and 14 from the new pass. Four parallel drawers worked one group each (files,
people, time, objects). Then came integration: categories, `icons:batch`, the full lint (746 icons) and the typecheck.

- `batch-70.json`: names, labels, Fluent stems and construction lines (spec "Batch 70 · New icons").
- `4a-batch-70-sizes.png`, `4b-batch-70-sizes.png`: Area alone, outline and filled at 16 / 24 / 32 / 48.
- The uses and library references were added to `../2026-10-07/candidates.json`. The review page's "New icons not yet
  reviewed (batch 70)" filter shows them, and decisions save to `reviews7`. The data comes from
  `review-data.mjs out/data.js notes.json batch-69-70.json`, where the batch file is batch 69's and batch 70's icons merged.

Integration fix: file-clock's filled bite passed 0.2 under the fold's corner and left a fill sliver at 48. The quality
pass settled the clock at 5.5, 10.5 (on the lattice, inside the base line).

### Calls to confirm (delegated)

Aliases:

- **eye-closed** is an alias of eye-off, which is already the closed eye.
- **file-x** is an alias of document-dismiss.

Files:

- **file-user:** the figure sits on the page's bottom-left corner (Fluent). It does not fit inside the page under the fold.
- **file-zip:** three teeth, one fewer than folder-zip, to stay in the vertical keyline.
- **file-question:** the ? stands at x 6.5, as file-warning's ! does.
- **folder-cog** uses person-settings' r 1.5 gear. **folder-sync** uses cloud-sync's mark at 0.8. Both sit in folder-lock's corner.
- **table-cells-merge / -split:** the column moves to the centre (x 8). Every reference centres it.

People and mail:

- **person-search and person-pen** take their own overlap cut round the mark, as person-key does. The lens and pen
  are too big for the shared bite. person-search's lens sits a tight 1.38 from the head.
- **person-star:** the star is star.svg at 0.36, small at 16.
- **shield-cog:** the gear sits at 8, 7.5 and reads smaller than shield-check's check.
- **mail-check:** the check is 0.25 left of mail-plus's +, to stay on the lattice.
- **mail-warning:** the ! hangs from the top line.
- **hand-wave:** bell-ring's motion arcs at both top corners, not Fluent's two arcs on the right.
- **gif:** condensed letters with detail gaps, as dense as Fluent's.

Time and devices:

- **alarm-off:**
  - The hand and the right leg are dropped, as Lucide does, because the slash ran beside them.
  - A 2.43 bell-to-slash gap is accepted with `data-gap="aligned"`. That marker is otherwise used only where the owner asked.
- **clock-check:** after the quality pass, the check sits at the top right (the notification dot's corner). On the
  lower right its filled halo collided with the clock's 45° hand.
- **search-alert:** uses the container ! (2.25 stem).
- **scan-qr:** Fluent's five-module checker inside scan-check's corners.
- **calendar-sync:** after the quality pass, the mark ends on the frame line, as calendar-clock's ring does.
- **calendar-off:** the left peg drops out in filled.

Objects:

- **book-add:** a closed book (repository without the ribbon). The open book's pages can't hold a +.
- **tags:**
  - The front tag is shortened to fit.
  - The back copy sits up-right (the multiples rule). Lucide and Fluent put it down-left.
- **divide:** the bar sits at 7.5, half a pixel above minus's 8.
- **copyright:** the C is r 3.
- **gavel:** no sound block.
- **vote:** a card on a slot line.
- **scroll:** no text lines.

Not changed: the tree's crown keeps its own symmetric construction. It is not a moved cloud.

### Open: batches.json status lags the review page

396 icons in `batches.json` are still `review`, but for 356 of them the owner's latest verdict on the review page is
"approve". For 271 of those, the approval is newer than the icon's last commit. The sync was not applied this session
and waits for the owner. The other 85 were committed after their approval, so they need a look. 22 batch-68 icons have
no verdict at all, and 18 icons' latest verdict is an old round-2 or round-5 fix or replace.

## Quality and consistency pass (owner: "pause making new icons here")

`quality/`:
- `reports/group-1-report.md` … `group-11-report.md`: one per icon-browser group, every icon checked.
- `machine/`: the whole-set checks before the pass, plus `slivers-*-after.txt`.
- `sheets/1-crisp-and-centred.png`, `2-cuts-and-marks.png` and `3-doubled-strokes.png`: every changed icon, before (grey)
  and after.
- `sheets/group-<n>-proposals.png`: the owner calls.
- `tools/px.mjs` (the 1× pixel view) and `tools/dups.mjs` (strokes drawn twice).

Spec: "Quality and consistency pass, 2026-10-10". 34 icons changed and are in review again on the review page. A
further 89 sources only dropped a stale `data-angles="free"` and changed no drawing, so they did not go back to review.
The `dismiss-circle` package glyph (the `error` drawing with a "knockout" paint) was added for the component session's
Search field.

## Batch 71: new icons (owner: "keep working on any new icons, hold the ones that were updated")

24 concepts, drawn by three parallel drawers (media, states, editing) with the quality pass's checks: the 1× view,
doubled strokes, geometry-audit, fillets. No existing source was touched; the quality pass's 34 changes wait on the
review page with batch 70 and 71 for one review. Record: `batch-71.json` (spec "Batch 71 · New icons"). Sheet:
`5-batch-71-sizes.png`.

### Calls to confirm (delegated)

- **monitor-off** is an alias of screen-share-off (already desktop under the slash).
- **repeat-once:** the 1 replaces the loop's lower-right turn (Fluent arrow_repeat_1). A centred 1 doesn't fit an
  exact copy of repeat.
- **switch-camera:** folder-sync's small sync mark turned 90° in the lens's place. Unturned it misses the grid.
- **vibrate:** Lucide's zigzags, not bell-ring's arcs (those read as ringing).
- **sim-card:** phone's frame with a clipped corner and Fluent's chip.
- **keyboard-off:** five of the seven keys are dropped near the slash, and one key sits about 0.26 from the filled
  slash gap. Fluent's joined key, the lower-side gap and a single key all looked worse. This is the weakest of the batch.
- **power-off:** the stem is shortened to 2–4.5 (Lucide, Huge). At full length it read as a T on the slash.
- **megaphone-off:** the handle is cut round the slash.
- **bell-plus:** the + sits inside the bell, not at a corner badge. A corner cut removed a quarter of the dome.
- **tag-plus:** the + sits inside the tag (location-add's placement).
- **calendar-range:** Lucide's range rows (a dot and a bar, then a bar). Row 1 sits on a whole pixel, the only fit for
  the dot.
- **list-collapse:** indent's chevrons sit 0.5 inside the outer rows to stay in the keyline.
- **file-upload:** file-download's arrow turned, with a 3 shaft instead of 3.5. An exact turn leaves the lattice or
  crowds the fold.
- **file-video:** play-circle's solid play.
- **file-audio:** a solid-headed note.
- **paint-roller:** the grip fills with the roller.
- **gift-card:** Fluent's filled cut, the bow loops knocked out.

Noticed in existing icons, not changed (held): headphones draws each cup's outer edge twice. The document family's
floor (y 14) and credit-card's sides sit on whole pixels at 1×.

## Batch 72: new icons

7 concepts (record `batch-72.json`, sheet `6-batch-72-sizes.png`): gem, file-pdf, hand-coins, package-check, sort-alpha,
sort-numeric, incognito. Same checks as batch 71. The gap list is now mostly niche objects (food, animals, medical,
weather extras) or concepts Area draws under another name.

Not drawn: **replace-all**. Area's replace is a lens drawn as an arrow arc, and no "all" mark fits on an exact copy.
reply-all's doubled head runs out of the live area, VS Code's doubled target runs off the edges, and the three versions
that fit read as a stray T, a face, or text search. Options: (a) replace one step smaller (lens about r 4.4) with
reply-all's doubled head, or (b) Lucide's / VS Code's box construction for both replace and replace-all.

### Calls to confirm (delegated)

- **gem:**
  - The lower facets run into the point (Lucide, Fluent), so the bottom few pixels read solid at 16.
  - The point is left sharp (69°, no data-acute needed); an r 0.5 rounding is a one-line change.
- **file-pdf:**
  - Phosphor's and Huge's construction: the page top and fold, with a 5-tall PDF label below. Fluent's corner label
    doesn't fit a readable PDF in the 9-wide page.
  - The ink centre is 0.5 left (x 7.5) so every stem is crisp.
  - P, D and F start the file-type letter set.
- **hand-coins:**
  - A new giving hand on the 45° grid, because Area's hand is an upright palm.
  - Filled, only the front coin fills; the back crescent is too thin to round.
- **package-check:** copy-check's small 1 / 2 check on the corner, with the box cut round it. Each face leaves only 2 of
  free width, so it can't go inside.
- **sort-alpha, sort-numeric:**
  - Both point down, as every A→Z reference does; Area's sort-ascending points up.
  - The 4 × 4 letter box sits 0.25 right of centre for the lattice.
- **incognito:**
  - Fluent's straight bridge between r 2.5 rings.
  - Filled, only the hat's crown fills; the lenses stay open (Fluent's filled cut).

Noticed in existing icons, not changed (held): package's sides and centre line sit on whole pixels at 1×.

## Batch 73: product-surface pass

The library gap list was nearly used up, so this batch came from the product surfaces instead: Cursor and VS Code
(search, explorer, fold), Figma's inspector (hug and fill), Notion (full width, comments), Linear (priority) and
GitHub (resolve). Each concept was checked against the exact source names, since icon-find's fuzzy matches hid several
gaps. 9 sources, 3 of them with turns (record `batch-73.json`, sheet `7-batch-73-sizes.png`).

### Calls to confirm (delegated)

- **move-horizontal** is an alias of arrow-left-right, which is already the double-headed arrow, with 3px heads; its
  turn move-vertical matches arrow-up-down.
- **fold-horizontal and unfold-horizontal (and their vertical turns):**
  - A solid centre line at x 7.5 (crisp; Phosphor's, not Lucide's dashed one) with 3-long arrows and 2px heads, each
    2.5 from the line.
  - The shafts are short (1.5× the head) because the lattice and the crisp line leave no room for longer ones in both.
- **space:** the ⎵ bracket 11 wide (option's and return's width), 3 deep. At 2 deep it read as a bare underline.
- **chat-check:** the 2 / 4 check centred where chat-add's + sits, tight 1.38 all round. The 1.5 / 3 check looked lost.
- **list-x:** list-plus with the 3.5 × in the +'s place.
- **signal-low and signal-medium:** signal's first two and three bars at their positions, and the dropped bars vanish
  (Lucide, Phosphor, Fluent; wifi-low's precedent). low → medium → signal reads as one series.
- **square-alert:** stop's square with the ring's ! exactly. Its stem is on x 8 like every ring and square mark, so it
  is not crisp at 1×; that's a question for the whole mark family.

Noticed in existing icons, not changed (held): arrow-left-right's shaft (y 8) and arrow-right-to-line's line (x 13)
sit on whole pixels at 1×.

## Batch 74: bottom panel toggles

panel-bottom-open and panel-bottom-close (with panel-top-open and panel-top-close as flips), from VS Code's and Cursor's
terminal panel. Area had the left and right toggles only. Sheet `8-batch-74-sizes.png`.

Calls to confirm:
- The main area is 6 tall, so the 2-leg chevron is centred with detail gaps (2 / 2) instead of panel-left's tight 2.5
  from the pane.
- The tip sits on x 8.5, 0.5 right of centre, for the lattice. A smaller 1.5-leg chevron centred on 8 read too small.

After this, the remaining gap concepts are niche (food, animals, medical, weather extras) or drawn under another name.
Cursor's grid also lists files-diff, diff-dot, brain-hourglass, a funnel chart and route-x; these were not drawn.
brain-hourglass is close to brain-thinking, which the owner removed as niche. The others appear in one library at most.

## Demo swap (owner: "implementing them into the actual components")

Component demos now render Area icons; see the spec section "Demo swap: components show Area icons, 2026-10-10". The
before/after page is https://claude.ai/artifact/EyvzqrhCmbDrrc1qdcBEqz. It was built with
`node apps/docs/scripts/component-review.mjs --before <dist of eaa9222> --before-label "Fluent icons (main at eaa9222)"`.
The before dist came from a detached worktree of HEAD with node_modules symlinked in, then `npm run build:docs`.
Decisions are in its `iconswap1` collection.

## Next icon session: production gaps (owner will pick this up)

The owner asked what Area's set still lacks, besides review, to be an industry-grade library. Summary, in suggested
order:

1. **Finish the reviews:** 103 icons are held on the review page. Then sync the approvals into batches.json (about 271
   are approved on the page but still marked `review`; see "Open: batches.json status lags the review page"). Only
   approved icons should ship.
2. **Ship an `@area/icons` package:** one tree-shakable module per icon (no `Pilot` prefix), raw SVGs, a sprite, and a
   metadata JSON (name, keywords, aliases, category, rtl-mirror flag, status). Today the full set lives only in
   apps/docs/src/pilot-icons.tsx, and `@area/react` ships about 24 component glyphs.
3. **Icon component API:** an accessible label (`title` / `aria-label`, which switches the icon to `role="img"`), and
   right-to-left mirroring for directional icons.
4. **Keywords and an alias map** for search, including Lucide, Material and Fluent names (user→person, file→document,
   plus→add, x→dismiss, circle-x→error).
5. **12px cuts** for the dense icons components use at 12 (the spec planned these and they were never drawn).
6. **Licence** for Area's drawings, semver, changelog and a deprecation policy.
7. **A public, searchable catalogue** (copy SVG / JSX) and a Figma library.
8. **Coverage**, by use: currencies (5 against Lucide's 27), file types, heading levels 4–6, digits and letters,
   transport basics, panel and layout states. Brands, flags and emoji stay out (separate libraries).
9. **Retire the Fluent map**, including the docs toolbar (`icons.generated.mjs`).

Also open: the quality pass's proposals (spec "Quality and consistency pass, 2026-10-10"); replace-all; the component
integrations (File upload file types, Tag picker tag-plus, Date picker calendar-range, the panel toggles, Search
field's dismiss-circle).
