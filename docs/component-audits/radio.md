# Radio audit — 2026-09-17

## Decision summary

Area Radio now comprises a native individual `Radio` and a native `RadioGroup` compound
part. RadioGroup provides a fieldset, legend, shared name, vertical or horizontal option
layout, description/error relationships, disabled propagation, and controlled or
uncontrolled selection. Radio remains useful alone when a surrounding semantic group already
exists, but typical product use should start with RadioGroup.

## Current Area contract

Before this audit, Area had a native radio with five icon-ramp sizes and optional label or
description, but no group contract. Descriptions on Radio itself were visual only. The shared
choice CSS centered every Radio beside multiline text. The revised contract adds a manifest
block for RadioGroup, context-backed value/name coordination in React, stable description IDs,
and first-line alignment for wrapped options. It remains native inputs, so browser radio-group
arrow-key and form semantics stay intact.

## User jobs and non-goals

Use RadioGroup for one choice from a short visible list—normally two to five options—where
seeing choices side by side helps the decision. Use Checkbox for multiple independent choices,
Switch for an immediate on/off setting, Select/Combobox for a longer list, Segmented for a
small set that switches an immediately visible mode, and a selectable card composition when
each choice needs rich content. Radio does not own mixed state, loading, arbitrary tones,
custom checked icons, popups, virtualized collections, or a selectable-card API.

## Capability-atlas review

Considered atlas entries: **Radio group / Option group** (Core), **Choice card / selectable
tile** (Separate composition), **Checkbox** and **Switch** (neighbouring contracts), and
**Select / Combobox** (Separate components). Common aliases are *radio button*, *radio group*,
and *option group*. A label/description is a composition slot, not a visual variant; checked,
disabled, invalid and required are state/semantic facts; horizontal is an explicit layout.

## Evidence ledger

Sources accessed 2026-09-17; evidence levels follow the audit framework.

| Benchmark | Evidence and level | Finding used |
| --- | --- | --- |
| Area | Manifest, CSS, React, built docs and Chromium inspection — A | Native input and five icon-ramp sizes existed; group, description relationship and multiline alignment were missing. |
| OpenAI | [Help Center](https://help.openai.com/) — B | No reusable Radio contract available for API decisions. |
| Notion | [Forms](https://www.notion.com/help/forms) — B | Product form guidance is available, but no reusable Radio specification was verified. |
| Primer | [Radio](https://primer.style/brand/forms/Radio/react/) — A | Native input, visible label, shared name and RadioGroup/FormControl boundary. |
| shadcn/ui | [Radio Group](https://ui.shadcn.com/docs/components/radix/radio-group) — A | Group/item composition, Fieldset/legend, descriptions, invalid and choice-card composition. |
| Fluent 2 | [Radio group](https://fluent2.microsoft.design/components/web/react/core/radiogroup/usage) — A | Short visible list, vertical default, horizontal alternative, labels/subtext, default-selection and non-truncation guidance. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties) — A | Expose state/layout/text separately rather than multiplying visual variants. |
| Vercel Geist | [Geist introduction](https://vercel.com/geist/introduction) — A | No published standalone Radio API was located. |
| Material | [Material 3 components](https://m3.material.io/components) — A | Catalogued as an adjacent published component family; detailed page requires client rendering. |
| Carbon | [Radio button usage](https://carbondesignsystem.com/components/radio-button/usage/) and [accessibility](https://carbondesignsystem.com/components/radio-button/accessibility/) — A | Vertical scannability, wrapped-label top alignment, group states and one tab stop. |
| Atlassian | [Radio](https://atlassian.design/components/radio/) — A | Radio is normally used in a group for one choice. |
| Apple HIG | [Toggles](https://developer.apple.com/design/human-interface-guidelines/toggles) — A | Two-to-five mutually exclusive choices; use a popup/select for a long list and Checkbox for many-value choice. |
| MUI | [Radio Group](https://mui.com/material-ui/react-radio-button/) — A | Form label/group, controlled value, horizontal layout, disabled choices and required error handling. |

## Benchmark comparison

| System | Boundary and capabilities |
| --- | --- |
| Area | Native Radio plus RadioGroup fieldset; label/description/error, vertical/horizontal, native controlled/uncontrolled APIs, xs–xl sizes. |
| Primer | Radio and RadioGroup/FormControl; group name and native props. |
| shadcn/ui | RadioGroup items plus Field, fieldset, invalid, RTL and selectable-card composition. |
| Fluent 2 | Group-first guidance, vertical/horizontal layout, subtext, short labels and no truncation. |
| Carbon | Group label/helper/error/read-only/disabled/warning and explicit keyboard model. |
| Atlassian | Radio normally appears in a group; neutral selected treatment. |
| Apple | Circular selected/deselected controls; two-to-five mutually exclusive options. |
| MUI | RadioGroup, FormControlLabel, controlled group value, placement and error composition. |

## Geometry

Radio retains the documented icon ramp: default UI xs/sm/md/lg/xl paints at
12/16/16/16/24px; compact UI paints 12/12/16/16/16px. Labels, line height and gaps share the
choice-control tiers. The circle is shape-defining and always uses full radius, independent of
the radius axis. In a multiline option, the mark aligns to the first text line through the
requested tier’s leading minus the mark size; it does not vertically center against the full
paragraph. RadioGroup uses 8px between its legend, help/error, and option stack; horizontal
groups wrap whole options with a 16px column gap.

## Accessibility and interaction

`RadioGroup` renders `fieldset` + `legend`, so the group receives a real accessible name.
Its description and error are linked with `aria-describedby`; errors set `aria-invalid` and
the native disabled fieldset disables descendant controls. `Radio` is a native radio inside a
visible label; individual descriptions receive their own stable IDs. A group name flows to
children unless an individual name is supplied. Controlled `value`/`onValueChange` and
uncontrolled `defaultValue` derive the checked input state from one source of truth. Native
radio keyboard traversal and form submission remain browser-owned. Forced colors, increased
contrast and visible focus use the existing choice-control rules.

Remaining browser/AT verification includes Safari/Firefox metrics, Windows forced colors,
200% zoom, touch target spacing supplied by consumers, RTL wrapped groups, and native
fieldset/read-only platform differences.

## Candidate decisions

| Candidate | Decision | Reason |
| --- | --- | --- |
| `RadioGroup` with native fieldset/legend, name/value and description/error | Core | Shared responsibility of every credible reusable-system benchmark. |
| Vertical and horizontal orientation | Core layout | Vertical is the default; horizontal is necessary for short peer labels. |
| Controlled and uncontrolled group value | Core | Matches native/useful React ownership without duplicating visual state. |
| Individual option description | Core composition | Useful detail is announced with its option; no new visual variant required. |
| Invalid/required at group level | Core | The unanswered decision belongs to the group, not an arbitrary individual option. |
| Choice card/selectable tile | Separate composition | Rich option content needs its own geometry and interaction audit. |
| Read-only/warning/AI treatment | Defer | Credible system patterns, but require a cross-form state policy before Area can support them honestly. |
| Tones, custom marks, icon-only, mixed state, loading | Reject | They obscure exclusive choice or belong to another contract. |

## Final contract

`Radio` forwards native input attributes and ref, plus `size`, `label`, and `description`.
`RadioGroup` accepts `label`, `children`, optional `description`, `error`, `name`, controlled
`value`/`onValueChange`, uncontrolled `defaultValue`, `disabled`, and `orientation`.
`area-radio-group--vertical` is the default; `--horizontal` is the alternate layout.
Named group elements are `legend`, `description`, `options`, and `validation`.

## Token decisions

No new token aliases were required. Radio continues to consume the established choice-control
fill, edge, selected edge, focus, icon-ramp, type, gap and full-radius roles. Group spacing
uses existing space tokens; group error uses the existing vivid danger foreground. The
first-line mark alignment is a relationship among already-owned geometry tokens, not a new
axis or component token.

## Implementation

- `packages/styles/src/manifest.ts` and `packages/react/src/variants.ts`: add RadioGroup.
- `packages/react/src/components/forms.tsx`: add native RadioGroup, selection context and
  individual description association.
- `packages/styles/src/components/choice.css`: add group layout/state treatment and
  first-line alignment for multiline Radio labels.
- `apps/docs/src/demos/form.tsx`, `apps/docs/src/pages.mjs`, and
  `apps/docs/src/practices.mjs`: document default, layout, sizes, selected, disabled,
  descriptions and invalid group states from real demos. Size and state examples are
  deliberately separate; they are independent axes, not a combined variant.

## Verification

Passed on 2026-09-17: `npm run lint:manifest -w @area/styles`, `npm run typecheck`,
`npm run build:docs`, `npm test`, `node packages/tokens/src/contrast/report.ts`, and
`git diff --check`. The rebuilt docs reported 37/37 components dogfooded and 156 demos.
Chromium inspection of `radio.html` confirmed the native fieldset/legend, selected group
value, horizontal layout, individual/group descriptions, invalid message and generated HTML.

## Remaining limits

Selectable cards, group-level read-only/warning semantics, product-specific AI labels,
complex validation ownership with Field, extensive browser/assistive-technology coverage and
RTL/narrow screenshots remain separate work. Do not fold them into a generic Radio variant.
