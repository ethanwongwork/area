# Select audit — 2026-09-17

## Decision summary

Area Select remains a native, single-value `<select>` for short, fixed option lists. This batch gives it the contained-width and Field validation contract already used by Input and Textarea, adds independently themeable Select aliases, and documents native option grouping. It does not turn the closed control into a custom listbox, search field, or multi-select.

## Current Area contract and user job

`area-select` is a browser-native select with a CSS chevron, five density-owned size tiers, semantic focus tokens, RTL chevron placement, and native form participation. The React wrapper forwards native props and refs. Before this audit it stretched to its parent, exposed only `size`, and painted only invalid state despite Field already carrying validation context.

Use Select when a person chooses one stable value from a short fixed list: a region, plan, or display density. Use Segmented for two to five immediately comparable values; use a future Combobox for filtering or free-form entry, and a future MultiSelect for more than one value. Select owns the closed native control, not popup positioning, async results, or listbox keys.

## Evidence ledger

| Benchmark | Evidence | Finding used here |
| --- | --- | --- |
| Area | Source review and Chromium inspection, 2026-09-17 | Native single value, five sizes, optical chevron inset, Field composition, and native `option`/`optgroup`. |
| OpenAI | No public Select specification; direct anonymous ChatGPT observation, 2026-09-17 | The visible model picker is a custom button/popover, not evidence for a native Select API. |
| Notion | [Database properties](https://www.notion.com/help/database-properties), Level B, 2026-09-17 | Single Select categorization and Multi-select tagging are distinct jobs. |
| Primer | [SelectPanel](https://primer.style/product/components/select-panel/), Level A, 2026-09-17 | Filterable, grouped, single/multi selection with confirmation is a dialog/panel contract. |
| shadcn/ui | [Select](https://ui.shadcn.com/docs/components/select), Level A, 2026-09-17 | A custom button-triggered Select composes trigger, popup, groups, labels, and items. |
| Fluent 2 | [React Select](https://fluent2.microsoft.design/components/web/react/core/select/usage), Level A, 2026-09-17 | Native option styling suits one choice from at least four items; Dropdown and Combobox are separate. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties), Level A/B, 2026-09-17 | Variants, booleans, text, slots, and instance swaps are distinct; only size and full width belong here. |
| Vercel Geist | [Select](https://vercel.com/geist/select), Level A, 2026-09-17 | Size, disabled, error, label, native `optgroup`, and a short fixed-list boundary are useful; Combobox and Multi Select are separate. |

## Comparison and decisions

| Candidate | Decision | Rationale |
| --- | --- | --- |
| Contained default width and `fullWidth` | Core | Matches editable controls; column stretch is explicit. |
| Error, success, and warning paint | Core | Field already conveys these statuses; Select consumes them consistently. |
| Select semantic aliases | Core | Products may theme closed native selects independently while preserving token ownership. |
| Native `optgroup` examples | Core | Standards-backed grouping needs no custom popup behavior. |
| Five size tiers | Core | Existing density-owned control scale is retained. |
| Soft/outline visual variants | Reject | One persistent native field affordance; aliases lack a distinct job. |
| Read-only | Reject | Native Select has no meaningful read-only state; disabled is the honest unavailable state. |
| Native `multiple` | Separate | Visible listbox geometry, selection model, and AT contract differ from a closed single-value Select. |
| Search, async results, rich options | Separate | These require Combobox or SelectPanel/listbox popup ownership. |
| Prefix/suffix and leading visuals | Separate | They imply a custom trigger and item model. |

## Geometry

Each tier owns outer height, type, gutter, icon viewport, and gap from the shared ramps. At default UI, xs/sm/md/lg/xl are 24/28/32/36/40px; compact changes the shared controls while the chevron remains centered in its square slot. The closed control defaults to the 16rem measure shared by Input and Textarea, with `max-inline-size: 100%`; `fullWidth` explicitly stretches.

Radius is `min(radius-control, height × radius-cap)`. Generic control cap is 0.4, producing maximum default-density radii of 9.6/11.2/12.8/14.4/16px. The Pill axis does not make Select a lozenge: only Button uses the separate half-height button cap. The optical-inset rule reserves the chevron’s square slot at the inline end; RTL flips it without measuring glyph path ink.

## Accessibility, interaction, and resilience

The element retains native label association, required/disabled form behavior, keyboard and mobile picker behavior, option semantics, and `optgroup`. Field generates label, description, validation, required, disabled, `aria-invalid`, and validation status relationships for the direct Select child. The wrapper maps `invalid`, `validationStatus`, direct `aria-invalid`, and Field’s `data-validation-status` to one edge and focus treatment. Visible focus preserves the edge and adds the shared field halo and outline; disabled has a semantic surface/foreground.

The browser owns option-popup colors, forced-color presentation, and screen-reader list announcement. The closed control is responsive through `max-inline-size`; long selected text uses browser clipping. Native option labels localize, and the chevron switches in RTL. Zoom, forced colors, browser popup rendering, mobile pickers, and AT combinations remain release checks rather than claims from this CSS audit.

## Final contract

`Select` accepts applicable native single-value `<select>` props plus `size`, `fullWidth`, `invalid`, and `validationStatus`. `multiple` is deliberately excluded from the React contract. It composes with Field and native `option`/`optgroup` children. CSS provides five size modifiers, `area-select--full-width`, and invalid/success/warning data states. Medium, contained, and browser-owned option presentation remain defaults.

New aliases are `--area-select-{bg,bg-disabled,edge,edge-hover,text,invalid-color,invalid-halo-color,success-color,success-halo-color,warning-color,warning-halo-color,inline-size}`. They resolve from Input aliases but are owned and consumed by Select.

## Implementation and migration

- `packages/tokens/src/emit/base.ts`: adds Select semantic aliases.
- `packages/styles/src/components/navigation.css`: adds contained/full width and state paint.
- `packages/styles/src/manifest.ts` and `packages/react/src/components/forms.tsx`: add the full-width and validation contract, and prevent `multiple` in TypeScript.
- Docs now render real label, validation, sizes, groups, full-width, and disabled examples.

Existing single-value uses continue unchanged. React consumers using `multiple` must move to a future MultiSelect instead of retaining a closed-control visual treatment that misrepresents its interaction.

## Verification

Passed on 2026-09-17: `npm run build`, `npm run lint:manifest -w @area/styles`,
`npm run typecheck`, `npm run build:docs`, `npm test` (18,104 tests),
`node packages/tokens/src/contrast/report.ts` (344 passing across 66 themes), and
`git diff --check`. Chromium inspection of the rebuilt Select page confirmed native
single-value popup semantics, generated Field label/description/required relationships,
all five size demos, success/warning/error examples, optgroup exposure, full width, and
disabled state.

## Remaining limits

OpenAI has no public Select component specification, so its product observation is non-normative. Combobox, MultiSelect, and custom SelectPanel work remain separate audits.
