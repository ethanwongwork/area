# Audit and report

Adapted from Nicolas Massi's `audit-contract.md` (Apache-2.0; see NOTICE.md).

## Sequence

Preflight (one target: which build, which master, which glyphs) → observe → analyze → validate → report. An audit is
read-only unless the owner asked for the change.

## Finding classes

- **ERROR:** a deterministic failure or broken contract (a failing check, a broken table, wrong winding).
- **WARNING:** suspicious or degraded; not proven wrong.
- **ENGINEERING RECOMMENDATION:** an objective improvement with evidence.
- **DESIGN OBSERVATION:** an optical judgment; the owner decides.
- **PROJECT DEVIATION:** conflicts with a written project rule (the plan, the owner's notes, this skill), cited.
- **INFORMATION:** context, no action.

A preference is never presented as a universal defect.

## Evidence

Every finding names its object (glyph, contour, segment, pair, table, master) and its evidence (tool output, exit code,
a measured value, a rule with its source). Deduplicate one cause with many symptoms, listing every affected object.
Keep engineering failures apart from optical observations.

Record each validator's execution and its outcome separately: a check that ran and a check that passed are different
facts. Never claim a module was validated when no check ran on it; call it unaudited.

## Source of truth, in order

1. The owner's current instruction.
2. The plan, the targets, the owner's recorded direction and picks.
3. The actual source and build.
4. Standards and tool documentation (OpenType, Google Fonts guide).
5. This skill.
6. Memory and general knowledge.

## The report

Diagnosis and evidence; findings by class; which glyphs and variables; what was changed versus only recommended;
validator outcomes from `qa.py`; what was not checked; the next smallest step.
