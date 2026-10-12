# Icon review, 2026-10-11

## Round 9: the owner's review page decisions and notes

The review page (https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w, `reviews7`) showed 149 of its new and changed icons
reviewed: 146 approved, superscript and subscript "fix filled" (the 2), and blur "replace" toward Fluent. In chat the
owner added form (shorter, aligned lines) and a hatched droplet as blur's reference ("you can make it a circle").

- **Approvals:** batches.json takes an approval only when the verdict is newer than the drawing's last commit (the rule
  from "batches.json synced" in `../2026-10-10/README.md`). Six were new (attach, file-clock, file-user, folder-sync,
  highlighter, slice); 143 were already approved. atom, building, car, home and form keep `review`: their verdicts
  predate their latest drawing.
- **Redrawn:** form, blur, superscript, subscript and list-numbered (list-numbered shares the 2). Construction: spec
  "Owner review round 9, 2026-10-11". Sheet: `1-round-9-fixes.png` (each icon, then its before as a reference row).
- On the review page they show as redrawn with their before; earlier verdicts on them no longer count.

### Calls to confirm

- **blur** is a circle, not the droplet, so it matches Fluent's blur and the ring family. The hatches are 45° (Area's
  angles), three of them 3 apart; the droplet in your reference has four shallower ones.
- **form** keeps three lines (title, line, short line). With the lines 3 in from both sides, the title row still sits 2
  below the page's top edge; moving the rows down would put the last line into the pen's cut.
- **The 2's base** now starts left of the bowl in all three icons. list-numbered was approved before; it changes because
  superscript and subscript copy its 2.

## Round 10: rounded knockout ends, the type audit, filled treatments

- **Rounded negative space** (umbrella, banknote): a generator bug, now fixed for every icon; curved knockouts that end on
  the silhouette run out square. Sheet `2-knockout-ends-before-after.png` (umbrella, banknote, basketball, globe-off).
- **Type audit** of the 60 icons that draw letters, digits or typographic symbols. Sizes form six tiers, each consistent:
  display letters on the 2.5–13.5 cap (T, H, B, I, S, Σ, f, €); word pairs on a 7 cap and 4 x-height (AB, ab, Aa,
  whole-word); badge text on a 5 cap (GIF, PDF, M); small glyphs 4 tall (sort-alpha, sort-numeric, binary, the 2 in
  superscript, subscript and list-numbered); heading digits 6 tall on the H's baseline; captions' cc at 3. Shared parts:
  every 0 is the 3 × 4 stadium; every 1 the 45° flag without a foot; every 2 the family 2; heading bowls r 1.5. Fixes and
  the kept trade-offs: spec "Owner review round 10". Sheet `3-type-audit-fixes.png` (after, then befores).
- **Filled treatments:** https://claude.ai/artifact/1oCSG2MmsfkpxcNAtDnpBY explains the six treatments with examples and
  gives every reviewed icon its reason (the spec's recorded filled note where it has one). shield-lock changed to match its
  family.

### Calls to confirm

- translate's double-storey a against the set's geometric single-storey a (your Fluent pick kept for now).
- binary's 1 without a foot (the family 1); Lucide's binary uses a slab 1 with a foot.
- The centred T stems on whole pixels (text, text-color, line-height, letter-spacing, square-text): centring kept over 1× crispness.

## Round 11: 243 decisions and the 1 and 2

- 195 approvals applied. 53 icons changed on the page's fixes, replacements and approval notes, and on the chat notes:
  every 1 is Lucide's, every 2 Lucide-like with a base wider than its bowl (and keeps that ratio when filled), the Z keeps
  its ends, umbrella's ribs run edge to edge, the globes' meridians cut through both poles. Smile's lowered face carried to
  meh, frown, square-smile and smile-plus; battery-medium's bar spacing to battery-low. Construction: spec "Owner review
  round 11". Four parallel helpers took the fixes, file marks, adjustments and library redraws; each icon was linted,
  audited and checked for slivers. Sheets: `4a-round-11-sizes.png`, `4b-round-11-sizes.png`.

### Calls to confirm

- bot's filled face stays a line and only its antenna fills, like the other bots (your note read as asking for consistency).
- gem's filled variant drops the lower facet lines (they ended inside the fill or left slivers).
- file-zip has two teeth so its pull clears them; folder-zip's pull hangs free of its teeth, 1.5 below the folder.
- blur's lines sit on whole pixels so the spacing is exactly even (slightly soft at 1×); the crisp set is uneven by 0.8.
- file-code's chevrons and the bottom-panel chevrons are centred off the diagonal lattice (slightly soft at 1×).
- fingerprint keeps three ridges at the 2.5 pitch (Phosphor's 2 fails the filled gap); merge and split have one header strip
  (Fluent's two don't fit the 9-tall frame).
- battery-full's three bars can't be exactly even on the grid; a cell construction would make the battery set exact.
- smile-plus's plus badge shows a hairline at 48 (it predates this round).

