---
name: area-type-design
description: Draws, redraws, spaces, kerns, builds and checks Area's own typefaces (Area Serif in typefaces/area-serif) from measured targets, with every outline written in Python and every claim backed by a check. Use whenever a glyph, alternate, master, metric, spacing value, kerning pair or OpenType feature of an Area typeface is added or changed; when the owner gives notes on letterforms, weight, serifs, curves or texture; when comparing the face with its reference fonts; when preparing an options or proof page for the owner; and before calling any typeface work done.
---

# Area type design

Area Serif is a serif for interface text derived from Libre Baskerville (SIL OFL 1.1): `derive.py` applies one set of
calculated transforms (weight extrapolation, serif-tip thinning, scaling, smooth-join repair, soft corners) to the
designer's own cubic points in `sources/LibreBaskerville.glyphs`, then `build.py` compiles TrueType and WOFF2. The
hand-coded first drafts are retired in `archive/` (owner, 2026-11-10: inconsistent serifs, gaps, rough curves). The plan, measured references and
targets are in `docs/research/serif-typeface-2026-11-10/` (README first); the code is `typefaces/area-serif/`
(README first). This file is the procedure. Its type-design method is adapted from Nicolas Massi's `type-designer`
skill (Apache-2.0), see `references/NOTICE.md`.

**Area Serif's design, part by part, is in `references/area-serif-guidelines.md`** (weights, widths, serif lengths,
when a corner is rounded, round ends, curves, checks). Read it before changing a glyph; a change that breaks a line
there is the owner's decision.

## Hard rules

- **One base, chosen by licence** (owner, 2026-11-10: "choose one to go off of and manipulate"). Libre Baskerville's
  outlines are the base because its licence (OFL) allows modification. Its conditions bind Area Serif: never use
  the name "Libre Baskerville", keep its copyright and licence (`sources/OFL.txt`, set in `derive.metrics()`), and
  release under the OFL if the font is ever distributed. Georgia Pro and Serrif (a trial copy) stay
  measurement-only: measure, render for comparison and overlay, never import, trace, convert or instance into a
  source. Their renders stay in `build/` or the scratchpad, never committed (`references/references.md`).
- **Change everything by rule, not by hand.** A change that applies to a class of parts (serif tips, joins, weight,
  width) is a transform in `derive.py` that runs on every glyph. A change to one glyph's design is a named point
  edit applied after the transforms, with the reason beside it. No point is placed by eye.
- **The owner's direction** (2026-11-10): match the references closely, with slight changes to weight, x-height,
  cap height and metrics for the web; lighter than the first draft; lean toward Serrif's design where the two differ
  (thinner, rounder serifs, its curves in R, g and Q). Since 2026-11-12: shapes from Serrif, widths from Georgia Pro,
  serifs shorter and blunter toward Georgia Pro, weight lighter than both (the guidelines file). Choices between forms are the owner's, made on an options
  page (step 7).
- **Values live at the top of `derive.py`.** Targets (x-height, stem, advance, tip ratio, corner radius) are inputs;
  T and SX are solved from them. A note on one glyph applies to every glyph sharing the part.
- **A part is built once.** Stems, flags, feet, balls, arches and counters each hold one value (or one deliberate ratio) across
  every letter that uses them; `audit_parts.py` enforces it. A single-letter edit that moves a shared part must go
  through the part's rule, not around it (owner, 2026-11-11).
- **One variable at a time.** Change it, rebuild, run the checks, look, then propagate the logic, not the coordinates.
- **A finished run is not a pass.** Read each validator's outcome (`qa.py` summary, exit codes). Never claim a check
  that did not run; say what is unaudited.
- **Show, don't describe.** Every round of drawing goes to the owner with overlays on the references and live text.

## Setup

```
cd typefaces/area-serif && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

`build/` and `.venv/` are ignored. fontspector (the successor to fontbakery) is not on PyPI and needs Rust; until it is
installed, fontbakery 1.1 runs the same universal profile.

## Files

| File | Role |
|---|---|
| `sources/LibreBaskerville.glyphs`, `sources/OFL.txt` | The base: the designer's cubic Regular and Bold masters, and their licence. |
| `derive.py` | Targets, solved weight and width, the transforms (including `shorten_brackets`: brackets climb at most 0.80/0.85 stems, so stems run straight; `thin_rounds`: round strokes at 1.12 stems); writes `build/AreaSerif-Regular.ufo`. |
| `build.py` | Derives, then compiles TTF and WOFF2 (flattened components, unhinted `gasp`/`prep`, Windows clipping from real bounds). Keeps the last TTF in `build/previous/`. |
| `check.py` | Re-measures the build against `derive.py`'s targets. Exit 1 when a value is off. |
| `normalize.py` | One value per shared part, after derive: stems, head flags, outer feet, u's arch, counters (h = n; m, u 0.97), arches, g's ear root on the bowl's ellipse. Moves a point with its handles, in whole units, then the same curve hygiene (also on every glyph whose bracket derive shortened). |
| `audit_parts.py` | Measures every shared part across its letters (in stems) and fails QA on an unexpected outlier; `--refs` runs Serrif and Georgia Pro for comparison. |
| `evaluate.py` | Curve report per glyph: curvature jumps at smooth nodes, bumps inside a curve, pinched or boxy quarter arcs, kinks, missing extremes. A report, not a gate. Run it before and after any curve rule. |
| `clean.py` | The evenness rules (exact lines, shoulders, thin floor, barb faces, bowl tension), called from `normalize.py`. Its printed report lists what each rule moved. |
| `charset.py` | The character set (0.47), run last in `normalize`: every glyph that is a letter plus a part is rebuilt from the finished letters with pathops (union, cut), new glyphs are drawn from Area's parts or plain geometry at the maths' weight, `COVERAGE` is the set `check.py` holds. Add a glyph here, not by hand in a UFO. |
| `spacing.py` | Sidebearings and kerning, the last step of `normalize.py`: bearings from the measured reference fit plus an offset, existing pairs carried over, near-touches opened. |
| `pathlint.py` | Outline quality on the source, joint angles at smooth nodes (in units off the line), winding on the build. |
| `diagram.py` | Node diagrams: points, handles, coordinates, 10-unit grid, metrics (`build/diagrams/`). |
| `qa.py` | Build, then targets, outlines, fontbakery, and with `--diff` diffenator2. |
| `overlay.py`, `proof.py`, `sheet.py` | Overlays on the references (vector plates via `svg_tile`), proofs, smooth contact sheets. |
| `apply_edits.py`, `owner_edits.json` | The owner's saves from the page, as moves plus the saved points: a moved point lands exactly where the owner put it (offset by the glyph's spacing), every other point follows the rules. |
| `docs/research/serif-typeface-2026-11-10/tools/editor_page.py` + `changes.json` | The one review page (owner, 2026-11-12: "just have 1 artifact that is consistently updated"): what changed per build, the point editor, the glyph over every face, words, type tester. Republish it to the same link every build; add the build's entry to `changes.json` first. |
| `archive/drawn-2026-11-10/` | The retired hand-coded drafts. Not built. |

## Owner review loop

`derive.derive()` writes the un-normalized UFO to `build/`. Any script that calls it (a test, a comparison) leaves the build's
source wrong: run `build.py` again before `editor_page.py`, and check one known point in the page (0.31 was published
once with raw points).

1. Pull every save (`ArtifactData` list on the page's `edits`; upper and lower case in separate folders) and run `apply_edits.py` BEFORE changing the build: a save diffed against a newer build loses its moves. The page flags any save that isn't in the build.
2. "Like Georgia Pro and Serrif" covers the whole letter: ends, tails, terminals and joins, not only proportions. Check each end against both references before calling a letter done.
3. Rebuild, run QA, add the build to `changes.json`, bump `BUILD`, regenerate and republish the one page.
4. Before publishing any rule change, draw every affected glyph's ink over Serrif's outline (and Georgia Pro's where the owner named it) and look. A curve that is smooth can still be wrong (2026-11-12: the a's bowl-to-stem join, rounded by rule, became a heavy wedge the owner called horrible).
5. Saves fold against the page copy of the build they were made on (scratchpad `page-<build>.html`), as `by_position` moves (from position, to position, on/off): normalize.owner_positions finds each moved point by where it was, so a later change in point numbering (corners, rejoined curves) cannot drop them. Unmatched moves are printed.

## Procedure

1. **Read the brief and the state.** Plan README, the targets table, `params.py`, the open picks on the options page
   (ArtifactData `list` of `picks`, see the plan memory), and any owner notes not yet applied. Say which glyphs and
   which variable this round changes.
2. **Diagnose before drawing** (`references/workflow.md`, Diagnose). Classify the problem as structural (skeleton,
   proportion, stress), modulating (weight, contrast, terminals, joins), textural (spacing, color) or production.
   Don't redraw a skeleton to fix spacing, and don't kern to hide bad sidebearings.
3. **Core first: H O n o.** They fix stems, round strokes, overshoot, counters and sidebearings. Nothing else is
   drawn until they read evenly in `nnonoo HHOHOO` at 13 px.
4. **Then families, in order** (`references/workflow.md`, Families): round and spine (`c e s a g C G S Q`), arch and stem
   (`h m u r b d p q`), diagonals (`v w x y z A V W X Y`), figures, punctuation, symbols, marks. Draw one
   representative, check it, then the rest of its family from the same parts.
5. **Edit points, not shapes.** Read the glyph's node diagram first (`diagram.py <glyph>`). Keep the base's node
   structure: nodes at extremes, handles inside their triangle, collinear handles at smooth nodes, integer
   coordinates (`references/outlines.md`). Run `pathlint.py <glyphs>` and look at the diagram after every change.
6. **Compare with all three references** (owner, 2026-11-11): Libre Baskerville (the base), Serrif and Georgia Pro.
   Measure the letter in each, relative to its stem and x-height, and set the edit from where Serrif and Georgia
   agree (tools: `docs/research/serif-typeface-2026-11-10/tools/measure-*.py`; shaped text with kerning:
   `shape_render.py`; the review page: `review_page.py`).
   **Compare with the references.** `overlay.py "<chars>"` puts the build over Georgia Pro (blue) and Serrif (red).
   Decide each difference on purpose: match, or differ for a stated reason (web, legibility, the owner's direction).
7. **Alternates and owner choices.** Where a letter has more than one good form, draw each as `base.suffix`, add it to
   `ALTERNATES`, render a plate with `overlay.tile()` and publish an options page with live text and a saved pick
   per letter. Read picks before redrawing; a pick makes that form the default and keeps the others as features.
8. **Spacing, then kerning** (`references/workflow.md`, Spacing and Kerning). Space by edge type from H n O o; kern
   by class after spacing is stable; never kern tabular figures; recheck every pair across masters.
9. **Features** (`references/workflow.md`, Features): `locl`, `case`, `tnum`/`pnum`, `frac` and the like from the
   plan; stylistic sets get names (`featureNames`) once final.
10. **Masters and the variable font** (`references/workflow.md`, Masters): compatible structure is necessary, not
    sufficient; look at intermediate instances; keep italic a separate font.
11. **Check.** `.venv/bin/python qa.py --diff`. Fix every ERROR and unexpected FAIL. Each entry in `qa.py`'s `EXPECTED`
    names its reason; delete the entry the moment the reason stops being true.
12. **Look and report.** Proofs at 12–16 px and display sizes, light and dark, then report by the audit contract
    (`references/audit.md`): findings classed with evidence, what changed versus what is only recommended, validator
    outcomes, what was not checked, the next smallest step.

## What each check proves

| Check | Proves | Does not prove |
|---|---|---|
| `check.py` | The plan's measured values (heights, stems, serifs, advances, line box) | That the letters look right |
| `pathlint.py` | Node placement, handle sanity, short segments, winding after overlap removal | Curve quality or tension; a WARNING can be intended |
| fontbakery universal | Tables, names, metrics, required glyphs, unhinted rendering flags, feature hygiene | Design quality; language support |
| diffenator2 | What changed between two builds, glyph by glyph and in text | Whether the change is better |
| shaperglot (`check`) | That a language's letters and marks shape correctly | Run it once the Latin set is complete |
| Proofs and overlays | Texture, color, likeness to the references, the owner's judgment | Anything numeric |

## References

- `references/area-serif-guidelines.md`: Area Serif's values and rules by part, and what is open with the owner.
- `references/workflow.md`: diagnosis, families, spacing, kerning, color, masters, features, production QA.
- `references/dna.md`: what gives a typeface its identity, and how to change it on purpose.
- `references/outlines.md`: the drawing rules behind `kit.py` and every `pathlint.py` message.
- `references/audit.md`: finding classes, evidence, the report.
- `references/references.md`: working from licensed reference fonts.
- `references/NOTICE.md`: attribution for adapted material.
