# Group 9 report (Keys, Signal & power, Code, Data & charts; 71 icons)

Method: every icon was rendered outline and filled at 16 / 24 / 32 / 48 and 96 with look.mjs, in eight family
sheets with `--slivers` at 16 and 48. timeline was added beside the git family for its open item. Each icon was
checked against its newest spec row, its family base and the owner notes in `owner-feedback.json`. Sheets and
candidates are in the scratchpad, `q9/`.

Two checks were added for this pass:
- `q9/crisp.py` lists every axis-aligned stroke of 1.5 or longer that sits on a whole pixel. Such a stroke
  blurs across two rows at 1×. The lint allows it, but the skill says "prefer x.5 unless the shape must
  centre on 8".
- `q9/px.mjs` renders the outline at 16px at device scale 1 and enlarges it 10× pixelated. It is the only
  view where 1× blur shows, because look.mjs renders at 2×.

Candidates were linted and rendered in a scratch mirror of the generator, so no shared source held a candidate.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| git-commit | Both styles at 16 / 1×. The icon's only long stroke, the 2–14 line, sat on whole-pixel y 8, so at 1× it smeared over two grey rows (`q9/px1.png`). The icon only has to centre on 8 because of the ring, and the owner's stack rule says "crisp at 1× outweighs centring" (divide, three-line stacks, and folder-git's node at 9.5) | The whole drawing moved up 0.5. Ring r 1.5 at 8, 7.5 and line `M2 7.5H6.5M9.5 7.5H14`. Ink 13.12 × 4.12 (unchanged), centre 8, 7.5. The line is now one solid row at 1×. Filled is unchanged (ring solid) | lint ok; geometry-audit clean; slivers 16 / 48 none; looked (`sheets/group-9-after.png`, `q9/px1.png`) |
| wifi, wifi-low, wifi-off | Both styles at 1×. All three arcs are concentric about the dot at 8, 12.5, so their tops sat on whole pixels (y 9 / 6 / 3) and blurred at 1×. The ⌀2 source dot was centred on a half-pixel row, so it covered 1 + 2 half rows instead of the 2 × 2 pixels the dot rule asks for | The whole family moved up 0.5. It is the same drawing: arc ends y 9.44 / 7.246 / 5.052, dot at 8, 12. The arc tops are now on x.5 (8.5 / 5.5 / 2.5) and the dot on a whole-pixel centre. wifi's ink is 14.08 × 11.06 and its centre goes from 7.97 to 7.47 (0.5 high, the stack precedent). wifi-low stays exactly wifi's inner arc and dot (centre 8, 10.47). wifi-off keeps the shared slash. Its filled pieces were recomputed with `slashCut` at the line glyph's 2.5 clearance, the same call that reproduces the old pieces exactly: `M5.613 9.44A3.5 3.5 0 0 1 8.542 8.542M3.567 7.246A6.5 6.5 0 0 1 5.862 5.862M9.135 5.6A6.5 6.5 0 0 1 12.433 7.246M1.521 5.052A9.5 9.5 0 0 1 3.587 3.587M6.206 2.671A9.5 9.5 0 0 1 14.479 5.052`. The dot-to-slash gap goes from 1.62 to 1.27 (tight) | lint ok (wifi-low keeps its recorded 8.1-under keyline note); geometry-audit only the subgaps across the slash (see triage); slivers 16 / 48 none; looked at 2× and 1× |
| caps-lock | Both styles at 1×. The arrow's foot was on whole-pixel y 11, so the outline's bottom edge was a grey double row at 1×, and so was the filled solid's edge (`q9/px1.png`) | The foot moves to 10.5: `…L10.5 9.5A1 1 0 0 1 9.5 10.5L6.5 10.5A1 1 0 0 1 5.5 9.5L5.5 8.5…`. The head is still shift's, unchanged, and the bar stays at 13.5. The foot-to-bar gap goes from tight 1.38 to standard 1.88, which is closer to Lucide's arrow-big-up-dash. The only alternative, y 11.5, would leave a 0.88 detail gap. The ink box is unchanged (11 × 12.21, centre 8, 7.96) | lint ok; geometry-audit clean; slivers none; looked at 2× and 1× |

Sheet: `sheets/group-9-after.png` (before and after, made with BEFORE_TSX=before-2026-10-10.tsx).

## Proposals (not applied)
| icon | proposal | why | candidate file |
|---|---|---|---|
| bug-off | Outline: drop the six-leg `line` path, so the outline shows the same three legs as the filled variant (upper right, middle left, lower left), plus the body, the mandibles and the flat slash. `data-counter="sliver"` is then no longer needed: the 0.29 counter disappears and the icon lints clean without the allowance. The filled variant is unchanged | The owner's r2 note "legs on monoline only" (fix, monoline) is still open. The 2026-10-07 pass proposed the same change. The owner had earlier said "the extra legs are not needed" (spec, 2026-10-02), and the flat-slash pass then restored all six. At 16 the two corner legs run along the slash, and the lower-right one doubles its end. Option A (drop only the two corner legs) fails the lint: the freed middle-right leg sits 0.64 from the upper-right leg. Not applied because it overrides "draw the base whole under a flat slash" | `q9/cand-bug-off-B.svg` (A: `q9/cand-bug-off-A.svg`) |
| keyboard | Body 13 × 10 moved up 0.5 (`y="2.5"`, so 2.5–12.5) with the key rows at 5.25 / 7.75 and the space bar kept at 10.5. Gaps: 1.44 to the top, 1.0 between rows, 1.44 from the keys to the bar, 0.88 (detail) from the bar to the bottom. Centre 8, 7.5 | At 1× the body's top and bottom edges (whole y 3 / 13) are two grey rows each (`q9/px2.png`), and they are the icon's longest strokes. The three rows don't fit a 9-tall x.5 body, and moving the whole drawing 0.5 puts the bar on a whole pixel, so the keys must move inside. It is a proposal because it changes the approved inner spacing (bottom margin from tight 1.38 to detail 0.88) | `q9/cand-keyboard.svg` |

Sheet: `sheets/group-9-proposals.png` (bug-off, keyboard, and timeline from Cross-group, each before and after).

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | exact change |
|---|---|---|---|
| git node (r 1.5 ring, solid when filled) | timeline (group 3) | This is the README open item. Every git icon fills its nodes (`data-filled="solid"` on all 29 rings in this group), and so does timeline's own spec row ("Filled: cards and node solid"). The source's circle has no role, so filled shows an open ring on the solid cards' side. git-commit's node is the one timeline names | timeline.svg: `<circle data-filled="solid" cx="12" cy="8" r="1.5" …/>`. It lints clean; slivers none. Candidate: `q9/cand-timeline.svg`, on the proposals sheet |
| (docs) spec rows | git-commit, container, caps-lock, wifi, wifi-low, wifi-off | Stale rows: git-commit's 1872 says an "r 2 node at 8, 8" (it is r 1.5, now at 8, 7.5). container's batch-69 row (and batch-69.json) describes the filled ribs as free slots, 9–11.25 and 7.5–9.75. The source, the review page and the owner's reviews7 approval all show full-height cuts (`M8 6.5V16M11 5V16` gaps) | Rewrite those rows. container: "each rib a cut run out through the bottom edge, splitting the long face into three panels". caps-lock: foot at 10.5, standard 1.88 to the bar. wifi family: dot at 8, 12; arcs concentric about it; ink centre 7.47 (0.5 high, crisp at 1×) |

## Owner notes in this group: status
| icon | note | status |
|---|---|---|
| flash | r replace → Lucide | holds (Lucide's rounded zap: 45° outer edges, r 1 tips, r 0.5 notches) |
| bug-off | r fix (filled): "small ink edge error in negative space" | holds. The filled-only gap that trims the spike is still in place; slivers none at 16 / 48 |
| bug-off | r2 fix (monoline): "legs on monoline only" | open. Proposal B above (outline takes the filled variant's three legs) |
| puzzle | r approve: "make the puzzle heads a bit bigger" | holds (Fluent knobs: r 1.5 dome on a short neck, 2 tall and 3 wide; counter 6.79) |
| chart-scatter | r replace → Lucide: "better scatter of dots" | holds (Lucide's five ⌀2 dots on whole centres, none in a row) |
| activity | r replace → Lucide: "sharper … less rounded" | holds (sharp peak and trough, `data-acute="sharp"`) |
| waypoints | r replace → Lucide; r2 approve | holds (Lucide diamond, r 1.5 rings). The 2026-10-07 "wider ±5" proposal stays as recorded in "Still open"; not repeated |

No shared-shape siblings in other groups carry these notes. bug-off's legs belong only to bug and bug-off.

## Machine findings triage
| finding | icon | triage |
|---|---|---|
| geometry-audit lattice ×4 (`12,7.5 → 12.25,7.25`, x + y = 19.5, and three more) | plug-off | Recorded construction (Fluent plug_disconnected, `data-off="own"`, free angles). These are 0.35-long 45° runs between each face's r 1.06 corner arc and the r 2.47 dome. They are on the half lattice because the 4.95 face is centred on the lattice diagonal x − y = ±3; the faces themselves (8.5,5.5 → 10.5,7.5) are on the lattice. Too short to render as an edge. No change |
| geometry-audit subgap 0.02 ×2 | waypoints | False positive. The 45° links and the horizontal link end on the same ring (r 1.5 about 4, 8 and 12, 8), so their caps meet inside the ring's ink; the ring joins them |
| geometry-audit subgap 2.42 / 2.04 (now 2.16 / 2.08) | wifi-off | Expected. These are the filled-only `stroke` pieces either side of the shared slash; the gap between them is the slash and its one-sided 2.5 cut, not a gap between parts |
| optical −60% (size 4.45) | wifi-low | Recorded and delegated (batch 70). It is the bottom of wifi's strength set, as in Lucide and Phosphor wifi-low, which are both bottom-aligned. Checked against both references; kept |
| optical −48% | git-commit | Line glyph with a thin hull by nature (horizontal keyline, 4.12 tall) |
| optical −34% / −27% / −21% / −20% | function, option, signal, breakpoint | Line glyphs or recorded small shapes: function follows the type cap height; option is 1.88 under, recorded; signal is bars; breakpoint is recorded small at r 4.5 |
| optical −15% / −14% | shift, caps-lock | Diagonal-headed solids read small by hull (skill: diagonal shapes). Both fill their square keyline's height; no change |
| density +39% | container | Isometric box with two ribs, as Lucide; the filled cuts are package's. No change |
| parts drift 24% / 15% / 8% | git-pull-request-draft / -closed / -create | Expected: the hook is replaced by dashes, a ×, or a shortened hook and the + |
| parts drift 0%, moved 0, −0.25 | battery-*, bug-off, git-branch-plus | Measurement artefact; the base paths are byte-identical |
| lint keyline warnings | backspace (1.79 under), escape (1.88), function (1.88), option (1.88), breakpoint (3.88), wifi-low (8.1) | All recorded: backspace is Fluent's composition (10-07); escape is open's arrow in an r 5 ring; function is the type cap height; option is recorded; breakpoint is a small r 4.5; wifi-low is the level variant |
| slivers 16 / 48, escapes | none in this group | — |

## Checked, no change
- **Keys:** keyboard (see Proposals), command, option, shift, return, backspace, escape: ok.
- **Signal & power:** signal, bluetooth, bluetooth-connected and bluetooth-off are ok. bluetooth-off's detached upper chevron in filled is recorded. The battery family shares the body, the terminal (close gap 2) and the bars centred on 7: ok. plug, plug-off, power, flash and zap-off are ok.
- **Code:** api, code, code-block, terminal, braces, brackets, function, variable, regex and binary are ok. So are bug, debug-step-over, breakpoint, webhook, workflow, puzzle, whole-word and text-search: its lens is file-search's exactly, and it fills by weight.
- **Git:** git-branch, git-branch-plus (the + is identical to git-pull-request-create's, `M12 10V14M10 12H14`), git-graph, git-merge, git-fork, git-compare, git-pull-request, -create, -closed and -draft. All 29 rings are r 1.5 and solid when filled. Heads are 2.
- **Others:** diff, repository, logs, pipeline and container. container's filled ribs are full cuts (see the docs row).
- **Data & charts:** chart, bar-chart, chart-bar-horizontal, pie-chart, chart-scatter, chart-gantt, activity, gauge, radar, network and waypoints. chart's axis is shared exactly by the five charts.

Kept on purpose (crisp.py lists them; each must centre on 8 or is a recorded construction):
- The git stems at x 4 and the through lane at 8: the nodes sit on whole centres.
- The vertical stems at x 8 in bluetooth, power, plug and function.
- The 12-wide x 2 / 14 sides of code-block and terminal, shared with mail and credit-card.
- terminal's underscore at y 10, level with the chevron's end.
- regex's asterisk stem at x 10. Moving it to 9.5 or 10.5 would make the icon 0.25 off centre; this is a minor candidate, not drawn.
- repository's 2 / 14 / 11 horizontals. Its ribbon's 45° sides would leave the lattice on a 0.5 move, and book-add copies it.
- diff's ± centred on 8, recorded.
- The battery's middle bar at x 7 (centred in the body).
- The puzzle knobs' extremes.
- activity's level ends.

## Rules or docs that should change
- Lint gap: a long axis-aligned stroke on a whole pixel passes silently, and look.mjs renders only at 2×, where the blur does not show. A 1× pixel view in the sheets (as `q9/px.mjs`) would have caught git-commit, wifi, caps-lock and keyboard. A `--report` warning would help too: "an axis-aligned stroke ≥ 3 long on a whole pixel in an icon whose ink centre is not forced to 8".
- Arc extremes are still not grid-checked (2026-10-07 noted it); wifi's arc tops at whole y were this case.
