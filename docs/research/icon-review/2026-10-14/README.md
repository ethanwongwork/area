# Icon pixel pass, 2026-10-14

Owner: "continue working, open an artifact if you want me to review or approve anything". Two parts.

## Counterpart map completed (done)

The 211 icons drawn after the 2026-10-02 audit had no `docs/research/icon-audit/area-map.json` entry, so search by
another library's name missed them. All mapped; spec "Keywords and names", "Map completed, 2026-10-14". Coverage by
use was re-measured at the same time: product UI is covered (production-gaps README, item 8).

## Optical outliers (review: https://claude.ai/artifact/MZqhevHfrGVHhDANQLaKcA)

The generator's optical audit (`node packages/icons/scripts/generate.mjs --check --audit`; median size 11.27, density
0.41) put three approved icons well outside their peers. Candidates in `candidates/` (not in `sources/` until approved):

| Icon | Before | After | Change |
|---|---|---|---|
| qr-code | size +15%, density +36%, ink 93.3 | +6%, +8%, 63.3 | finders 4 × 4 on half pixels, 1 × 1 centres, 2 × 2 data modules on whole pixels (1.94 from the finders, so `data-gap="aligned"` goes) |
| diamond | −15% | −3% | half-diagonal 6 → 7 (one whole lattice step), corners r 1 → 1.5 so the tips stay inside ⌀14 |
| gamepad | +8% | +2% | body 10 → 9 tall, top on 3.5 (was a whole pixel), lobes' round 2.379 so the 45° sides stay on the lattice |

Calculator (+9%, +16%) is kept: its weight is the larger display the owner asked for (2026-10-07), and a narrower body
leaves no room for three key columns at the detail gap. All three candidates lint clean, no slivers at 16 or 48.
Sheets: `1-candidates.png` (16–48 and 96, outline and filled), `2-one-x.png` (1× pixels, enlarged; the last six rows
are the question's evidence).

### Question on the page: long strokes on whole pixels

`tools/wholepx.py` (from the repo root, `python3 … 40`) lists 295 icons with a stroked straight run of 3 or more on a
whole pixel; they smear across two rows at 1×. A half-pixel shift on both axes keeps every 45° line on the lattice,
but a blanket shift softens parts already on half pixels (clipboard's clip), so a fix is a per-icon redraw. Options:
fix the frames family by family (recommended), only when an icon is redrawn, or leave them.

### Tools

- `tools/icon-data.mjs out.json name,…`: each icon's outline and filled SVG at 16 / 24 / 32 / 48 through the real
  generator (`--only --emit`); the review page reads it. Mask ids repeat across renders; the page makes them unique.
- `tools/review-page.html`: the page's template (`__ICONS__` and `__STRIP__`, the `-1x.png` strip that
  `2026-10-10/quality/tools/px.mjs` writes beside its output). Verdicts save to the page's `verdicts` collection
  (`redraw-qr-code`, `redraw-diamond`, `redraw-gamepad`, `question-wholepx`: `{ verdict, note, at }`).
- `2026-10-07/look.mjs` still calls the removed `apps/docs/scripts/gen-pilot-icons.mjs`; a copy with the path set to
  `packages/icons/scripts/generate.mjs` works. The generator's `--only` mode had stopped on the `rtl.json` check (it
  ran against the filtered list); fixed.

## Round 1 decided (2026-10-14)

qr-code, diamond and gamepad approved (now in `sources/`); the question: **fix the frames**.

## Frames round (review page version 2)

`tools/frames.py report` lists icons with long whole-pixel strokes; `fix3` (via `plan3`) moves frames and parts; `rigidity`
checks a change; `tools/strip.mjs` renders the 1× strips the page crops. 242 icons changed in two batches (spec
"Optical outliers and 1× frames"). Verdicts save to the page's `frames` collection (`frames-1`, `frames-2`:
`{ verdict: approve | hold, flagged: [names], note }`). The changed icons keep their approved status until the owner
decides, because `review` status would take them out of `@area/icons`' main entry. On "hold" or flags: restore the
flagged icons from the last commit (`git checkout -- packages/icons/sources/<name>.svg`) or redraw them.

Two earlier passes of the fixer were discarded: the first let a filled-only twin stay behind when its part's move was
rolled back (server-cog gained a hairline), the second paired twins by box and rolled back single elements (folder-git's
node moved without its line). Lessons: pair by geometry, roll back whole attached groups, run `rigidity` and the
sliver check before showing anything.

## Frames round decided (2026-10-14)

Owner: `frames-1: approve`, `frames-2: approve`, no flags (pasted from the page's Copy verdicts: the in-app Artifacts
pane did not reach the page's store, so version 3 keeps choices in the browser and offers a copy fallback). The 242
icons stand as drawn. Next round: the 20 slash icons, the joined-parity families (person, lock, trash, server, document
pages with marks) and the 76 batch-2 icons with a shorter whole-pixel stroke left; list with `tools/frames.py report`.

## Round 3 (review page version 4, collection `frames3`)

`frames.py`: `slash_fix` (slide along the slash; circle keyline when the square overflows), `slide_parts` (one element,
contacts / line ends / shared edges kept, centred parts skipped), `move_elements` (hand moves by element index).
Verdict docs: `frames-3` (approve | hold, flagged, note) and `question-centre` (leave | narrow | offcentre). The page
keeps choices in the browser and has Copy verdicts; if `frames3` is empty, ask the owner to paste.

## Round 4 (review page version 5, with round 3)

18 hand redraws (spec "Round 4"); the page now holds `frames-3`, `frames-4` and `question-centre` in `frames3`.
Tools added: `tools/shot.mjs` (headless Edge screenshot of an HTML file). Before drawings for the page:
`before-r34` in the session scratchpad (round 3's originals, round 4's pre-round-4 state; keyboard-off against its
original).

## Rounds 3 and 4 decided (2026-10-14)

Owner (pasted): `frames-3: approve`, `frames-4: approve`, `question-centre: leave`. All 263 frames changes stand. The 37
icons still soft at 1× stay as they are unless a later redraw touches them.
