# Area Serif 0.81: hand-over

Written 16 November 2026 at the end of the 0.81 session, for a new session with no memory of it.
Read this first, then `.claude/skills/area-serif-construction/SKILL.md` (the rules and the table of
constructions), then the last sections of `axis-0.81.md` ("Owner round" to "Axis round 3").

## Where things are

- Code: `typefaces/area-serif/` (about 35 Python modules; `build.py` builds, `qa.py` checks).
- Write-ups: this folder. `axis-0.81.md` has one section per round, `tools/changes.json` holds the
  page's "what changed" entries, `img/081/` holds the tracked figures (1 to 24).
- Untracked, and only on the owner's machine: `typefaces/area-serif/build/` (fonts, snapshots
  `snap077`–`snap080`, figures, `qa-081.log`, `pages081/`) and `typefaces/area-serif/.venv/`. During
  0.81 these lived in the worktree `.claude/worktrees/area-serif-081`. If that worktree is gone,
  recreate the venv and rebuild; the 0.77–0.80 snapshots used for "before" rows cannot be rebuilt
  from this branch alone.
- Reference faces (Georgia Pro, Source Serif 4, Serrif) are licensed: measure only. Never copy,
  trace or save their outlines. Figures that draw them stay in `build/`, never in `img/`.
- Review pages (private artifacts): evaluation `https://claude.ai/artifact/5FkKUT31WDmmTAMMQtKwk2`,
  republished from `build/pages081/area-serif-evaluation.html` at every round. Editor
  `https://claude.ai/artifact/1QUvcPjfjjkxBLVTRcNrVC` was NOT republished in 0.81: pull the owner's
  saved point edits from it before rebuilding or republishing it.

## How to run

From `typefaces/area-serif/`, with `.venv/bin/python`:

- `build.py` builds the masters and the variable font. 0.82 (owner round 8, axis): the axis is 300 to 800, masters
  Light 300 (stem 55), Regular 400 (78), mid 600 (104.5, sparse), Bold master 800 (140, named ExtraBold); the
  0.81 axis called them 300 / 400 / 550 / 700. `weightaxis.py` converts (`python weightaxis.py` prints the table).
  A master under the Light (a Thin at 100 or an ExtraLight at 200) is built only with `weightaxis.THIN = True`
  (`THIN_WEIGHT`, `THIN_STEM`, `LOW_NAME`); both trials failed (`axis-0.81.md`, Owner round 8, axis, stage B), so it
  is off. With it on, build.py writes `AreaSerif-<LOW_NAME>.ufo`, `audit_axis` adds the Light-to-it pair, `qa.py`
  its audits; audit_rays / audit_kern take `AREA_RAY_WEIGHTS=200,225,...`.
  `AREA_KERN_FIT=1 build.py` also refits the per-master kerning (do this when advances change).
- `qa.py` runs every check and writes the summary; keep the log at `build/qa-081.log`.
- `audit_axis.py`, `audit_rays.py` (`AREA_RAY_WEIGHTS`, `AREA_VF`), `audit_kern.py`
  (`AREA_KERN_WEIGHTS`), `audit_lean.py --refs`, `curvecheck.py` (`--hooks`) run alone too. 0.82: weights in those
  variables are on the 0.82 axis; `old:300,325,...,700` gives 0.81's (the 25-unit sweep), converted to the same
  design places. Each tool reads a font on either axis (a 0.81 font, e.g. `build/snap082f`, at the same places), so a
  snapshot from before 0.82 can be audited with today's tools.
- Pages: `docs/research/serif-evaluation-2026-11-13/tools/build_page.py` and the editor page
  builder make the base pages; `tools/page_081.py` puts the 0.81 sections on top. Check at 1024 and
  390 px through a temporary local server.
- A full build plus QA takes tens of minutes. The machine sleeping stalls it.

## State at hand-over

`qa.py` exits 1. Everything passes except:

| Check | What fails |
|---|---|
| weight axis, all glyphs | Bold thin places: `at`, `cedi`, `ogonek`, `ogonekcomb`, `one.ss01` |
| weight axis, second method (rays) | Ə ð ʕ ɂ œ @ & $ at the default stops (Ə œ @ & $ at every 25 units) |
| hook curvature, Light | 6 faults (Ɠ, Ƴ, ſp, ⱳ) |
| hook curvature, Bold | 15 faults (Ɛ Ɠ Ɲ Ɋ Ⱳ Ƴ ƒ ɽ ʋ) |
| HELD | `Astroke`, `Tdiagonalstroke`: owner's decision on the stump form |

Passing and worth knowing: curvature of the tails and loops in all three masters, the bold, light
and parts audits, interpolation, kerning at 17 weights, character set, fontbakery. Builds are
repeatable (two builds from the same input are identical).

## What 0.81 changed after the owner's review

- Tails: j, y, g, g.ss02, a.ss03, l.ss04 smooth in every master; `curvecheck` now runs on the
  Light and Bold. Bold j/y balls are the round ends' ball scaled evenly; y's ball is on the round
  ends' radius.
- g.ss02: tail back at 0.80's height (ball top 0.138 x-height under the baseline) on the smooth arc.
  The owner prefers the 0.80 tail height.
- 9 and 6 (`clean.nine_six`): lower-right quarter filled out, right edge 23.6°. 5
  (`clean.five_stem`): upright stroke turned from 9.5° to 5.3°.
- Bold lean (`audit_lean.py`): x keeps its thick stroke's angle (`bold.crossing_openings`,
  brackets from the kept edge, serif-end opening on the white law's share 0.25); s turns on the
  round strokes' growth and barbs read as strokes; `s_terminal` on s and S; `open_tail` on c and e.
- Light g loop from its centreline (`loops.g_loop_master`); `loops.even_part` solves a part with
  its other edge.
- Axis: balls read at any tilt (`bold.tilted_balls`), which also moved 21 other ball-ended glyphs
  (ß most visibly); a straight-to-curve node slides along its straight in the Light
  (`white._straight_nodes`, capped by `white.SLIDE_REACH`); sign strokes take the sign law in the
  Light (25 signs a touch heavier at 300); ® takes ©'s ring with the R fitted to its counter.

## Open work, in the order I would take it

1. Round stroke entering a junction (Ə ð ʕ ɂ œ & $, and @): thins toward the Bold, thickens toward
   the Light. `keep_taper` cannot reach these places because its stations skip junction zones. The
   rule has to find the entry point (where the white ends) and hold both edges there, as a minimum
   toward the Bold and a maximum toward the Light. Count what it reaches before building.
2. `@`: its a is one contour with the ring, so the ®-style fit cannot place it. Bold 40.6 > 34.2,
   Light 0.667 at (641, 143).
3. `ogonek`/`ogonekcomb`: 19.7 > 18.7 at 700. Growing the 12-unit top cut by 4 units cures it in a
   trial; it needs to come from the tip law, which today only acts on places a full unit short.
4. `one.ss01`: thin across the flag (43.2 > 36.3), 40 units from the crotch; neither the tip cut
   nor `keep_necks` reaches it. Needs a flag rule for the figure 1 in the Bold.
5. Hook curvature faults in the masters (list in `qa-081.log`), and 41 in the Regular's own hook
   drawings (ten worst on `img/081/24-hook-combs-regular.png`). The Regular ones need the owner's
   say before any change.
6. Lean still outside the references at 700: G, X, w, z grow with weight (X is drawn as four whole
   strokes so the crossing rule does not see it; w's thick diagonals thin W's middle stroke if
   kept); a and g are drawn so in the Regular; K 4 5 8 drift slightly the other way. g's ear and
   link grow 2.20 against stems' 1.78.
7. Terminal table: neck thickness and exit angle for j y g.ss02 against f r c a s 3 5 6 9 were
   never measured.
8. The evaluation page's own test data (`curves.json`, `strokes.json`, `serifs.json`, `fit.json`,
   `measures.json`) was last run in the first owner round; the Regular 9, 6, 5 and y changed after.

## Decisions waiting on the owner

- Ⱥ and Ⱦ: stump form from 625 up (recommended) or an honest crossing. `img/081/stump-struck.png`.
- ₵: keep the inherited drawn C, which thins where the stroke crosses, or rebuild from Area's C
  plus a stroke, which changes the Regular. `img/081/23-cedi.png`.
- x: the serif-end opening is kept on target and the bracket-level opening comes out 22–25 units
  tighter. Reversible if the owner prefers the other white.
- The signs capped by the white law (asterisk, daggers, quotes) move 1–4 units whenever a letter
  with a counter changes, because the law's counter ratio is a median over those letters. Left as
  designed; freeze it if that coupling is unwanted.

## What worked, and what did not

- One writer at a time in the worktree; the build directory is shared.
- Narrow briefs ("land the x, then s, then the Light g, each in the build before the next") landed
  fixes. Broad lists came back measured and held off.
- A worker that has run many rounds stops fixing and starts recording; start a fresh one with the
  SKILL, the last three sections of `axis-0.81.md` and one item.
- Measure before prescribing a class rule: the "Bold diagonals are too wide" theory was wrong; only
  the x was out.
- Every engine change reaches more glyphs than its target. Diff all three masters after each
  change, list what moved, and look at it.
- A redraw can fool a reading rule later (the 9's ball on the bowl's extreme made the engine grow
  the bowl's side as a ball). Re-run the lean and thickening tables after any Regular change.
