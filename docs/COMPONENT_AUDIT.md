# Component audit program

Area audits one public component family per batch. Each batch compares the current Area
contract with OpenAI, Notion, Primer, shadcn/ui, Fluent 2, Figma, and Vercel Geist, then
implements only the options that have a clear Area use case and a supportable semantic,
visual, and interaction contract.

Run the repository skill at
`.agents/skills/component-audit/SKILL.md` when a component audit is requested. Its
framework at `.agents/skills/component-audit/references/audit-framework.md` defines the
required evidence, geometry, accessibility coverage, report structure, and completion
gate.

## Why the process is component-by-component

Size, density, radius, and icon rules must stay coherent across Area, but component
semantics differ. A native Select, editable Combobox, Menu, Chip, and Button cannot gain
the same list of variants simply because their closed boxes look similar. Auditing one
family at a time keeps the behavioral boundary clear and lets every accepted change ship
with its CSS, manifest, React API, docs, and verification.

Each audit separates:

- visual variant and semantic tone;
- size and density;
- runtime state;
- layout behavior;
- optional composition;
- interaction behavior that may require another component.

## Expansion-first program

Area now plans breadth before visual refinement. The
[component capability atlas](COMPONENT_CAPABILITY_ATLAS.md) is the required starting index
for every audit: it names the wider category, aliases used by other systems, compositions,
and behavioural neighbours that must remain separate. The searchable companion is the
Component Capability Atlas canvas.

This does **not** mean adding cosmetic variants indiscriminately. Each implementation still
ships one component family at a time, with complete semantics, keyboard behaviour where
applicable, contrast, token ownership, and manifest/React/CSS/docs parity. Once a category's
functional breadth and boundaries are recorded, visual consistency and calibration can be
refined across that category without discovering a late-breaking competing contract.

The [completed-audit atlas review](component-audits/atlas-review.md) records the current
families' acknowledged gaps and protects their existing boundaries from accidental merging.

The benchmark review is a union, not a popularity contest. Every distinct documented
capability from OpenAI, Notion, Primer, shadcn/ui, Fluent 2, Figma, or Vercel Geist is
entered into the component's decision ledger. Area adopts it when the job and contract are
supportable, or records why it belongs in a separate component, is deferred, or is rejected.
An unavailable product API is recorded as unavailable rather than guessed from a screenshot.

This prevents a large, ambiguous `variant` prop and keeps Figma properties, CSS modifiers,
React props, and documentation aligned.

## Research policy

Primer, shadcn/ui, Fluent 2, and Vercel Geist publish reusable component contracts and are
the primary system comparisons. OpenAI, Notion, and Figma are also required, but their
product interfaces are recorded as observed patterns unless an official component
specification exists. Every audit records URLs, access dates, and one of four evidence
levels: published system specification, official product guidance, direct product
observation, or inference.

“Industry standard” is not a decision. The report names which systems share a pattern,
what job the pattern solves, and whether Area can support it in CSS, React, keyboard,
assistive technology, theming, localization, and responsive layouts.

## Decision policy

Every candidate is marked **Core**, **Optional**, **Separate**, or **Reject**.

- Core options are common, semantically clear, broadly useful, and fully supportable.
- Optional options solve a concrete reusable need without confusing the base contract.
- Separate options belong to another component or documented composition because their
  semantics or interaction differ.
- Rejected options are redundant aliases, unsupported behavior, inaccessible treatments,
  or cosmetic combinations without a credible use case.

Area favors adaptability, so a component-specific semantic token is welcome when a
consumer may reasonably theme that role independently. Every new token still needs one
owner, a stable meaning, a clear fallback, a real consumer, and appropriate contrast or
geometry coverage.

## Audit sequence

The queue starts with form and selection primitives because later composite components
depend on their size, field, state, and focus contracts. A user-requested component can
move ahead of the proposed order. `Queued` means no conclusions have been made.

| Order | Component | Status | Report |
| ---: | --- | --- | --- |
| 1 | Field | Complete | [Field audit](component-audits/field.md) |
| 2 | Input | Complete | [Input audit](component-audits/input.md) |
| 3 | Textarea | Complete | [Textarea audit](component-audits/textarea.md) |
| 4 | Select | Complete | [Select audit](component-audits/select.md) |
| 5 | Checkbox | Complete | [Checkbox audit](component-audits/checkbox.md) |
| 6 | Radio | Complete | [Radio audit](component-audits/radio.md) |
| 7 | Switch | Queued | — |
| 8 | Slider | Queued | — |
| 9 | Button | Complete | [Button audit](component-audits/button.md) |
| 10 | Chip | Queued | — |
| 11 | Segmented | Queued | — |
| 12 | Tabs | Queued | — |
| 13 | Menu | Queued | — |
| 14 | Kbd | Complete | [Kbd audit](component-audits/kbd.md) |
| 15 | Badge | Queued | — |
| 16 | Avatar | Queued | — |
| 17 | Alert | Queued | — |
| 18 | Toast | Queued | — |
| 19 | Tooltip | Queued | — |
| 20 | Progress | Queued | — |
| 21 | Spinner | Queued | — |
| 22 | Skeleton | Queued | — |
| 23 | Token | Complete | [Token audit](component-audits/token.md) |
| 24 | Code | Complete | [Code audit](component-audits/code.md) |
| 25 | Code block | Queued | — |
| 26 | Card | Queued | — |
| 27 | Panel | Queued | — |
| 28 | Dialog | Queued | — |
| 29 | Popover | Queued | — |
| 30 | Nav | Complete | [Nav audit](component-audits/nav.md) |
| 31 | Separator | Queued | — |
| 32 | Table | Queued | — |

Status values are `Queued`, `Researching`, `Implementing`, `Verifying`, `Complete`, or
`Blocked`. A row becomes Complete only when its report passes the skill's completion gate.

## Batch output

Every completed audit produces `docs/component-audits/<slug>.md` containing:

1. the existing Area contract and user jobs;
2. an evidence ledger and comparison across all seven benchmarks;
3. rendered geometry for every Area size and both densities;
4. radius lower/upper limits and any painted collisions;
5. accessibility, interaction, responsive, localization, and high-contrast findings;
6. accepted, separated, deferred, and rejected candidates;
7. the final API, CSS, token, and naming contract;
8. implementation and migration notes;
9. automated and visual verification results;
10. remaining browser, assistive-technology, or evidence limits.

The implementation updates CSS and the shared manifest together, keeps React and native
behavior aligned, and renders documentation examples from their real demo source. Visible
changes are inspected in the component page and gallery rather than accepted from source
review alone.

Documentation uses one meaningful state or variant per ordinary preview container. The
first preview is the standalone default, the second is persistent treatments where owned,
and the third is the size family. Size and comparison previews stack specimens vertically
with `--area-space-24`; all other variants get their own container. Contained controls use
their component width token in both standalone and Field-wrapped examples. Full-width is
shown only as an explicit layout variant.

## Process improvements

The following practices keep the program accurate as it grows:

- Freeze a before-state screenshot and geometry record before a visible batch so later
  changes can be compared at the same viewport and theme.
- Keep a source date in every report; re-check stale external evidence instead of copying
  old measurements into a new audit.
- Record rejected options. Otherwise the same attractive but unsuitable variant will be
  reconsidered without its prior accessibility or API context.
- Measure at default and compact density, every supported size, radius extremes, long
  localized content, narrow containers, RTL where directional, and 200% zoom.
- Treat native semantics and complete keyboard behavior as part of the component, not a
  later accessibility layer.
- Audit compound behavior as its own project. Combobox, command palette, date picker,
  tree, data grid, and virtualized lists require behavior contracts beyond a new style on
  an existing primitive.
- Revisit shared ramps only after multiple component audits identify the same mismatch.
  One outlier should receive a justified component role instead of silently shifting the
  entire system.
