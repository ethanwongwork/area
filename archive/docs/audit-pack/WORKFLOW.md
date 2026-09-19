# Component audit workflow

This is the operating procedure for the audit pack. The owner asks once; the agent
carries the component through research, planning, implementation and verification.
Existing approvals persist. Do not require the owner to copy a prompt for each phase.

## 1. Prepare one approval packet

Read the installed construction-audit and component-audit skills, build brief, repo map,
family candidate list, current component, and any existing audit. Resume completed work;
do not repeat setup, evidence fetching, or finished measurements without a reason.

Complete construction research and a *proposed* build plan together, before coding:
- Read every matching indexed evidence file through lookup.py. Use --full for ambiguity.
  Full extracted text may itself be incomplete; mark unresolved facts n/p.
- Separate benchmark facts, source-derived calculations, rendered measurements, and
  deliberate Area proposals. Evidence gaps cannot be filled from memory.
- Record size class, shape rule, all sizes and both densities, content/state exceptions,
  token mapping, and differences from current CSS. Unmeasurable source facts may remain
  n/p; an intended build case still needs an explicit Area proposal before approval.
- Normalize aliases before counting support. Account for every candidate as Core,
  Extended, Composition, Separate, Alias, Log only, or Reject; retain source attribution.
- Assign demos only to shipped public cases. Keep global axis permutations and stress-only
  cases in the shared customizer or verification fixture.
- Include the complete proposed manifest, React/native behavior contract, aliases,
  composition boundaries, migrations, and any new tokens.
- Reconcile contradictory instructions in the packet. A family CSS skeleton is
  illustrative, never a competing authority for geometry or native behavior.
- Save the packet under plans/<component>.md and link its construction entry. Mark
  research, proposal, approval, build, and verification separately.

Ask one concrete approval question covering the packet. An explicit earlier approval
still applies to its unchanged scope. Combining research and planning does not approve
either, and authorizing workflow edits does not approve component geometry.

## 2. Implement after approval

Use the approved construction and plan, then build Core and owner-approved Extended rows.
Keep CSS, manifest, React, page metadata, demos and report synchronized. One independent
gallery case appears per tile. Size comparisons and the children of one named composition
are the only multi-item exceptions. Do not generate a variant × tone matrix unless tone is
part of the component's semantic job.

Keep working through routine implementation choices and failures. Ask again only for a
material change to the approved contract, a missing owner decision, or required tool
permission. Do not silently invent a missing density/content/state decision.

## 3. Measure, classify and finish

Run all brief §2.7 gates: build, lint:manifest, test, typecheck, build:docs, plus
component behavior/browser checks and diff hygiene. Measure each size × density ×
radius extreme; distinguish track, thumb, hit target and label for Switch. Include
light/dark, increased contrast, reduced motion, RTL, long content, narrow layout,
keyboard, and form reset/submit as applicable. Test only behavior the public contract owns.

Classify discrepancies before acting:
- **CSS bug:** approved decision is explicit, implementation disagrees. Fix and remeasure
  within the existing approval.
- **Decision gap:** the approved decision never specified the case. Propose the missing
  decision and request approval; do not label it a CSS bug.
- **Decision revision:** implementation agrees, but evidence or owner feedback changes
  the desired result. Propose the revision before implementing.

Update docs/component-audits/<component>.md with actual measurements beside decisions,
the checklist with demo names, gate results, remaining limitations and approval record.
Do not call a family complete while required cases, gates or decisions remain open.
Do not claim screen-reader or native forced-colors testing that was not performed.

Committing/pushing is separate from implementation approval unless explicitly requested.
Preserve the working tree's unrelated work; use checkpoint when the owner requests it.

## Resume prompt

“Run the component audit for <Component> using this workflow. Resume any completed work,
prepare one construction + build approval packet, and ask me to approve it. After I
approve, build, verify and fix implementation mismatches until done.”

Evidence freshness is based on extraction/review age, not merely the upstream commit
date. Refresh deliberately; never silently move pinned sources to latest.



## Model and session boundaries

Use the stronger reasoning model for source interpretation, disputed geometry, approval
packets and behavioral review. Medium reasoning is a useful starting point; increase it
for unresolved ambiguity rather than every step. An implementation model can handle a
bounded approved patch; a faster model can run prescribed checks and collate results.
Escalate a failed check or unexplained measurement instead of letting the verification
round make a new product decision.

Keep the evidence/decision, build, and verification rounds together when the context is
still clear. Prefer a fresh task for the next component, after a verified commit and an
updated report/approval packet. A long research round can also end at approval; the next
task must read the saved packet and preserve its authorization. Model switching is not a
substitute for a written handoff. Do not commit or push merely because this workflow
recommends a checkpoint; use the owner's authorization for those actions.
