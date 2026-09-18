---
name: component-audit
description: Expand and audit one Area component family against the capability atlas plus current OpenAI, Notion, Primer, shadcn/ui, Fluent 2, Figma, Vercel Geist, Material, Carbon, Atlassian, Apple, MUI, and relevant product evidence; document and implement the resulting contract. Use when asked to audit, compare, expand, standardize, or harden an Area component.
---

# Component audit

A planning pass inventories the whole capability atlas; an implementation audit changes
exactly one public component family at a time. Treat an inseparable compound part,
such as MenuItem inside Menu, as part of the same family. Do not mix unrelated component
changes into the batch.

Read these before editing:

- `AGENTS.md`, `.Codex/HANDOFF.md`, and the relevant sections of
  `docs/DESIGN_SYSTEM.md`.
- `docs/COMPONENT_AUDIT.md` for the queue and project-specific policy.
- `docs/COMPONENT_CAPABILITY_ATLAS.md` for the breadth-first expansion inventory and
  neighbouring component boundaries.
- [references/audit-framework.md](references/audit-framework.md) for the evidence,
  measurement, decision, report, and completion requirements.
- [references/benchmark-sources.md](references/benchmark-sources.md) for the required
  benchmark set and source hierarchy.

## Start with breadth, then refine

Area's program is **breadth-first in planning and contract discovery**, then consistent and
high-quality in visual refinement. Before proposing a component API, use the capability atlas
to map the entire category, aliases, neighbouring names, and adjacent behavioural contracts.
Every completed audit should eventually receive a retroactive atlas review; see
`docs/component-audits/atlas-review.md` for the first pass.

This does not permit a superficial catalogue. Accessibility semantics, keyboard behaviour,
contrast, token ownership, and manifest/React/CSS/docs parity are non-negotiable gates on
each shipped family. Defer fine visual calibration until the category's breadth and boundaries
are understood, but never defer correctness in order to ship more names.

## Scope the component

Name the component and the user job it owns before comparing appearances. Inspect its:

- CSS block and semantic-token consumers;
- manifest entry and generated variant contract;
- React API, native-prop forwarding, refs, and behavior;
- docs page, live demos, practices, and gallery specimen;
- tests, browser fixtures, audit notes, and known roadmap limitations.

Record the current contract before changing it. Distinguish these axes rather than
flattening them into one `variant` prop:

- **variant**: persistent visual emphasis or structural treatment;
- **tone**: semantic or chromatic meaning;
- **size** and **density**: geometry and type scale;
- **state**: disabled, loading, invalid, selected, expanded, and similar runtime facts;
- **layout**: block, inline, full-width, alignment, wrapping, or placement;
- **composition**: optional icon, affix, description, actions, media, or slots;
- **behavior**: interaction model that may require a separate component.

Do not merge native Select, custom Dropdown, Combobox, Autocomplete, and MultiSelect into
one component merely because they can look alike. Different keyboard, value, filtering,
or popup contracts normally justify separate names and components.

For every audit, first record the atlas entries that are: (a) this component's aliases,
(b) potential compositions, and (c) separate neighbouring components. Absence from the
current Area manifest is a candidate gap, not a reason to overload this component.

## Research the expanded benchmark set

Browse current primary sources for every audit. Check all seven named benchmarks:
OpenAI, Notion, Primer, shadcn/ui, Fluent 2, Figma, and Vercel Geist. Use the source and
evidence rules in the references. Record the URL, access date, and evidence level for
every claim.

Primer, shadcn/ui, Fluent 2, and Geist publish reusable component guidance. OpenAI,
Notion, and Figma product interfaces are observational benchmarks unless an official
component specification is available. Never present a measured product detail as a
published standard. If reliable evidence for a benchmark is unavailable, say so in the
report; do not infer its API or dimensions.

For each benchmark capture:

- the common public name and component boundary;
- variants, tones, sizes, layouts, compositions, and states;
- documented or observed dimensions, icon and type scale, padding, gap, and radius;
- content limits, responsive behavior, overflow, and localization behavior;
- keyboard, focus, pointer, touch, screen-reader, and high-contrast behavior;
- patterns unique enough to consider and patterns intentionally excluded.

Treat the benchmark set as a **union of documented capabilities**, not a vote for the
smallest common denominator. Make a candidate row for every distinct documented variant,
state, layout, slot, or behavior found in any benchmark. Mark each row Core, Optional,
Separate, Defer, or Reject with its source and an Area-specific reason. A pattern unique
to one credible system may still be adopted when it solves a reusable Area job; record
product-only observations as unavailable for API decisions unless a published component
contract supports them.

Then consult the capability catalogues for Material Design, IBM Carbon, Atlassian Design,
Apple Human Interface Guidelines, and MUI. Tailwind CSS is utility-first rather than a
canonical component system; use its patterns only as supplementary inspiration, never as a
source of an asserted component contract. The expanded set finds functional categories the
original seven may not publish; it does not replace the seven required comparisons.

## Measure Area and compare it

Use the built docs preview and browser geometry for rendered measurements. Test all
supported size tiers at default and compact density, representative type presets, and
the full radius axis. Include narrow and roomy containers, zoom or text enlargement,
long labels, leading and trailing content, disabled and validation states, RTL where
relevant, and light/dark plus increased contrast.

Trace every CSS dimension to a token or an approved hairline/mask exception. Check the
optical-inset and concentric-radius rules in `docs/DESIGN_SYSTEM.md`. Report both the
declared token and the painted result where browser clamping, native styling, or content
changes the result.

For radius, record the usable lower and upper bounds for each component shape. A preset
that collapses into the same painted shape at a small size is not automatically wrong,
but the report must identify the collision and whether the cap is intentional.

## Decide before adding API

Classify every candidate as one of:

1. **Core** — common, semantically clear, broadly useful, and supportable.
2. **Optional** — less common but solves a concrete, reusable Area use case.
3. **Separate component or composition** — a different semantic or behavioral contract.
4. **Reject** — redundant alias, purely cosmetic duplication, inaccessible treatment,
   unsupported behavior, or no credible use case.

A candidate needs evidence plus an Area use case. Frequency across benchmarks is useful
evidence, not a vote. Prefer orthogonal props and slots over enumerating every visual
combination. Prefer native behavior when it meets the job. Do not promise composite-widget
behavior without complete keyboard, focus, popup, and assistive-technology handling.

Add a component-scoped semantic alias when consumers may reasonably theme that role
independently and the role has a stable meaning. Do not add an alias solely to rename a
raw value or to hide an unexplained exception. Document fallback relationships and test
contrast for every new foreground/background or required edge pairing.

## Write the audit and implement accepted changes

Create or update `docs/component-audits/<component>.md` using the required report shape.
State accepted, deferred, separated, and rejected candidates with reasons. Update the
row in `docs/COMPONENT_AUDIT.md`.

The report must link the atlas rows considered, including aliases and components deliberately
kept separate. A new reusable family should be added to the atlas before or with its first
implementation.

Implement clear, justified changes within the user's authorized scope. Keep CSS,
`packages/styles/src/manifest.ts`, React props and behavior, docs demos, API tables,
practices, and gallery specimens in sync. Preserve unrelated working-tree changes.
Escalate a product-direction choice only when two credible contracts are mutually
exclusive or the change would create a broad breaking API with no clear migration.

### Documentation specimen order

Every audited component page starts its Examples section with one standalone instance of
the public default at its default size. The second example shows persistent visual
treatments when the component has them; the third shows every supported size tier. Follow
with semantic states, layout, composition, and behavior in that order. Do not invent an
appearance or size example for a component that does not own that axis. When layout is the
component's only meaningful alternative, such as Field's horizontal orientation, it may
replace the second treatment slot; record that exception in the component audit. A child
control's size belongs to the child, but a composition may demonstrate those child tiers
after the Field layout example. Stack multiple variants vertically in one preview and give
each one enough separation to inspect. One ordinary example container demonstrates one
variant or state. A size family and an explicitly labelled comparison matrix are the only
exceptions; stack those vertically with at least `--area-space-24` between specimens.
Contained-width controls must use the same component width token in their standalone and
Field-wrapped examples. Full-width is always an explicit layout variant, never a side
effect of the docs preview or a grid fraction. The demos, snippets, API table, practices,
and audit report must describe the same contract.

## Verify completion

Run the component-specific checks first, then the required repository checks affected by
the change. At minimum:

```sh
npm run lint:manifest -w @area/styles
npm run typecheck
npm run build:docs
git diff --check
```

Run `npm test` and the contrast report for token, color, focus, or state-paint changes.
Run browser fixtures for behavior changes. Inspect the live component page and gallery at
desktop and narrow widths, in both densities and representative themes. Capture measured
evidence when the audit changes visible geometry.

Do not mark the tracker row complete until the report contains sources, decisions,
implemented contract, rejected alternatives, verification results, and remaining limits.
