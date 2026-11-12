# Area Serif

A serif for interface text, derived from Libre Baskerville. Plan, targets and research:
`docs/research/serif-typeface-2026-11-10/`. Procedure and rules: the `area-type-design` skill
(`.claude/skills/area-type-design/`).

Status: version 0.5. Derived from Libre Baskerville (SIL OFL 1.1, `sources/OFL.txt`) by `derive.py`: thinner
(stem 0.158 of the x-height), round strokes 1.12 stems (o contrast 1.64), short brackets so stems run straight, x-height 520 with cap height 712, shorter extenders, fuller ball
terminals, J on the baseline, a Serrif-like g (closed loop, ear from the bowl's top), every serif tip 27 and slightly rounded. Why: `docs/research/serif-typeface-2026-11-10/legibility.md`.
Review page: https://claude.ai/artifact/25AzNJVt4uiQsmH7zqmdie. The earlier options page
(https://claude.ai/artifact/CAVwbg5g2RszvUyNzw26mX) shows the retired hand-drawn forms; its alternates are to be
remade as edits of the derived points.

**Licence.** Area Serif is a Modified Version under the OFL: it must never be called "Libre Baskerville", must keep
the original copyright and licence, and may only be distributed under the OFL. Georgia Pro and Serrif are
measurement-only references; nothing from them is in the sources.

| File | Holds |
|---|---|
| `sources/` | Libre Baskerville's Glyphs source (Regular and Bold masters) and its licence. |
| `derive.py` | Targets, the solved weight and width, and the transforms that make Area Serif. |
| `build.py` | Derives, then writes `build/AreaSerif-Regular.ufo`, `.ttf` and `.woff2`. |
| `normalize.py` | One value per shared part (stems, flags, feet, u's arch, counters, arches) and g's ear root. |
| `audit_parts.py` | The parts audit: every shared part across its letters, against Serrif and Georgia Pro with `--refs`. |
| `check.py` | Re-measures the build against `derive.py`'s targets. |
| `pathlint.py` | Outline quality, joint angles at smooth nodes, winding. |
| `diagram.py` | Node diagrams with coordinates (`build/diagrams/`). |
| `qa.py` | Build, then every check. |
| `overlay.py`, `proof.py`, `sheet.py` | Comparison plates, proofs and contact sheets. |
| `archive/drawn-2026-11-10/` | The retired hand-coded drafts. |
| `requirements.txt` | Pinned build and check tools. |

Setup and the full check:

    python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
    .venv/bin/python qa.py --diff

`build/` and `.venv/` are ignored. Proofs made with `--refs` and overlays show licensed fonts and are never committed.
