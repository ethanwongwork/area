---
name: component-audit
description: Expand and audit one Area component family against the capability atlas plus current OpenAI, Notion, Primer, shadcn/ui, Fluent 2, Figma, Vercel Geist, Material, Carbon, Atlassian, Apple, MUI, and relevant product evidence; document and implement the resulting contract. Use when asked to audit, compare, expand, standardize, or harden an Area component.
---

# Component audit

A planning pass inventories the whole capability atlas; an implementation audit changes
exactly one public component family at a time. Treat an inseparable compound part,
such as MenuItem inside Menu, as part of the same family. Do not mix unrelated component
changes into the batch.

## Phase 1 — construction and owner approval

Run the `construction-audit` skill before any component implementation work. Complete the
component’s construction entry from `docs/audit-pack/evidence/`, show the measured table,
consensus, Area decision, and differences from current Area to the owner, then wait for
owner approval. Do not change component CSS, manifest, React, or demos until that approval
is received.

Read these before editing:

- `AGENTS.md`, `.Codex/HANDOFF.md`, and the relevant sections of
  `docs/DESIGN_SYSTEM.md`.
- `docs/COMPONENT_AUDIT.md` for the queue and project-specific policy.
- The matching family section in `docs/audit-pack/` as the audit's required research
  input. Read `docs/audit-pack/00-CODEX-BUILD-BRIEF.md` first, then
  `docs/audit-pack/09-area-repo-map.md`, then the matching family file. Treat its Build
  list as a candidate inventory to normalize and decide, not as an implementation order.
  Do not re-research recorded evidence unless it is marked re-verify.
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

Numbers come only from `docs/audit-pack/evidence/`. Use its pinned, extracted source and
the construction entry for dimensions, padding, gaps, type, radius, and shape; never
supply a number from memory, a screenshot, or unmeasured product observation. Check all
seven named benchmarks—OpenAI, Notion, Primer, shadcn/ui, Fluent 2, Figma, and Vercel
Geist—for capability evidence, and record the URL, access date, and evidence level for
every non-numeric claim.

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

Treat the benchmark set as an inventory of candidates. Normalize different names for the
same job before counting support, and separate component API from product composition and
test-only stress cases. For every distinct pattern, record the systems that publish it,
its canonical Area name, and its relationship to Area's existing tokens and components.
Product-only observations can explain a use case but do not establish a reusable API.

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

1. **Core** — supported by at least three independent reusable systems, required by the
   platform or accessibility, or already part of Area's stable component job.
2. **Extended** — supported by at least two reusable systems and solves a concrete Area
   use case without duplicating another component or multiplying unrelated axes.
3. **Composition** — useful in context but assembled from existing components rather than
   added to the component's public API.
4. **Separate** — belongs to another semantic or behavioral component contract.
5. **Alias** — the same treatment under a different name; record it once under Area's name.
6. **Log only** — useful research evidence that lacks sufficient overlap or Area fit.
7. **Reject** — conflicts with accessibility or the component's stated job.

Build Core and approved Extended rows. Keep Composition, Separate, Alias, and Log-only rows
in the report without inflating the public contract. A unique feature is evidence to log,
not an automatic shipping requirement. Prefer Area's existing semantic axes and primitives;
do not add a tone matrix to a component unless tone changes its meaning. Prefer native
behavior when it meets the job. Do not promise composite-widget behavior without complete
keyboard, focus, popup, and assistive-technology handling.

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

Every audited component page starts with one standalone public default at its default size,
then shows supported sizes, states, layouts, and compositions. Do not invent an appearance,
tone, or size example for a component that does not own that axis. Each gallery tile shows
one case. A size-family comparison and a real multi-item composition are the only exceptions.
Test-only stress fixtures do not need a public gallery tile when the same contract is already
visible and the fixture remains part of verification.
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
