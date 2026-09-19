---
name: construction-audit
description: Measure how a component is built across the benchmark design systems before any Area code is written. Use at the start of every component audit or expansion, and whenever a size, padding, gap, radius or shape decision is questioned. Produces a measured table, a consensus and an Area decision for owner approval.
---

# Construction audit

Runs before the `component-audit` skill's build phase. No component CSS, manifest or React
change may happen until the owner approves the Area decision this skill produces.

## Inputs

- `docs/audit-pack/evidence/` and `evidence/INDEX.md` (pinned, extracted source).
- `docs/audit-pack/construction/<family>.md` (existing entries; Badge is the worked example).
- `docs/audit-pack/construction/TEMPLATE.md`.
- The component's current Area CSS and manifest entry, if it exists.

## Steps

1. Run `python3 docs/audit-pack/tools/audit-evidence/lookup.py <component>`. If a system
   shows "no file", try `--find` with that system's name for the component (aliases are in
   the capability atlas), add the pattern to `components.json`, and run `--reindex`.
   If `evidence/` is missing or older than 60 days, run `./fetch.sh` (or `--latest`) and
   `python3 extract.py` first.
2. Open the full file (`--full --sys <key>`) wherever the numbers-only view is ambiguous
   about which element or size a value belongs to. Do not infer the owner of a value.
3. Fill the template table. Each cell is a value traceable to an evidence file, a computed
   height in italics (line + block padding + border, sum shown once), `n/p`, `n/a`, or
   `see file`. Finish every `see file` before calling an entry complete. Geist, Notion,
   Figma and Apple HIG are `n/p` unless you measured a rendered page and say how.
4. Classify: **size class** (control ramp, glyph ramp, label ramp, identity ramp, fixed
   construction, container) and **shape rule** (radius axis, identity shape, small fixed
   radius, concentric). Cite the rows that prove each.
5. Write the consensus: default size, range, pad-to-height relation, gap, type, icon,
   shape, and the outliers with the reason they are outliers (touch-first, brand).
6. Write the Area decision as a table of Area sizes with token names. Use existing
   tokens; where the ramp has no value, propose a named component scale in the token
   package (as Badge has), never a literal. Compare the decision with Area's current CSS
   and list every difference.
7. Save the entry in `docs/audit-pack/construction/<family>.md`, mark it complete, and
   stop. Show the owner: the table, the consensus, the decision, and the differences from
   current Area. Wait for approval or edits.

## Hard rules

- A number that is not in `evidence/` is not a fact. Never fill a cell from memory.
- Never apply the control-height ramp or the radius axis to a component unless its size
  class and shape rule say so.
- If fewer than four systems have measurable evidence, say so; the decision is then
  provisional and the owner must confirm it explicitly.
- After the build, measure the rendered component (height, padding, gap, radius, type at
  every size, both densities, sharpest and roundest radius preset) and put the measured
  table in the audit report next to the decision. Any mismatch is a bug.
