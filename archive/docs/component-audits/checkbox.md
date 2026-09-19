# Checkbox audit — 2026-09-18

## Decision summary

Area Checkbox is the native control for one independent binary choice or one option in a related set. This review makes `CheckboxGroup` a first-class fieldset composition; adds caption, leading visual, contained option, individual invalid, disabled, checked, and mixed states; and keeps the mark top-aligned to its label's first line. It retains `xs` through `xl`: Choice uses the icon/type/gap ramp, not Button's three rectangular action-plate tiers.

## Current Area contract

`Checkbox` renders a native `<input type="checkbox">` within its visible `<label>`. It provides five density-owned size modifiers, an optional caption (`caption`, with `description` retained as an alias), decorative `leadingVisual`, contained `card` variant, checked/mixed/disabled/invalid states, native form participation, and a forwarded input ref. The painted box is 12/16/16/16/24px in default UI and 12/12/16/16/16px in compact UI; labels, gaps, and leading follow the requested tier. The label supplies a minimum 24px activation lane even when the visual mark is compact.

`CheckboxGroup` renders a native `<fieldset>` and visible `<legend>`, with optional description, validation message (`error`, or `validation` plus `validationStatus`), disabled state, and vertical or horizontal options. It owns collection requirements; an individual Checkbox owns only the rare independently required-option error.

The group heading is the shared medium UI / strong header treatment used for named component rows and lists. Supporting copy is never `text-xs`: group captions, option captions, and validation text use the small UI pairing. The rhythm is semantic and repeatable: 4px from heading to its caption, 12px from the heading/caption block to options, 8px between option rows, and 12px from options to a validation message.

## User jobs and non-goals

Use Checkbox to select an independent preference, grant a permission, or select several items in a set. Use the mixed state only on a parent that summarizes a partial selection. Use CheckboxGroup for a labelled, related collection; use the `card` variant when an option needs bounded context without changing its native semantics. Radio owns mutually exclusive choice; Switch owns immediate-effect settings. Checkbox does not own a custom popup, loading state, arbitrary visual variants, or an icon-only affordance.

## Evidence ledger

| Benchmark | Evidence and source | Finding used |
| --- | --- | --- |
| Area | Source and Chromium inspection, 2026-09-18 | Native input, visible label, description slot, five icon-ramp sizes, 24px label target, focus and forced-color rules. |
| OpenAI | No public Checkbox component specification found; 2026-09-18 | Unavailable for API decisions. |
| Notion | [Database properties](https://www.notion.com/en-gb/help/database-properties), Level B, 2026-09-18 | Checkbox represents a Boolean property and supports lightweight task tracking. |
| Primer | [CheckboxGroup accessibility](https://primer.style/product/components/checkbox-group/accessibility/), Level A, 2026-09-18 | Native fieldset/legend, visible group label, associated caption/error/success messaging, decorative leading visuals, indeterminate, 24px target/spacing, and group-level validation. |
| shadcn/ui | [Checkbox](https://ui.shadcn.com/docs/components/radix/checkbox), Level A, 2026-09-18 | Controlled/uncontrolled checked state, invalid Field composition, description, disabled state, groups, table use, and RTL. |
| Fluent 2 | [React Checkbox](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage), Level A, 2026-09-18 | Single vs group boundary, indeterminate parent selection, descriptive labels, and Switch for immediate effect. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties), Level A/B, 2026-09-18 | Expose state, text, and instance properties distinctly rather than folding them into a visual variant. |
| Vercel Geist | [Entity example](https://examples.vercel.com/geist/entity), Level A, 2026-09-18 | Checkbox composes in a richer row without changing native control semantics. No standalone Checkbox API was published. |
| Material Design | [MUI Checkbox](https://mui.com/material-ui/react-checkbox/), Level A, 2026-09-18 | Two public sizes (small/medium), label composition, colors, and indeterminate state. |
| IBM Carbon | [Checkbox usage](https://carbondesignsystem.com/components/checkbox/usage/) and [style](https://carbondesignsystem.com/components/checkbox/style/), Level A, 2026-09-18 | 16px mark, label/helper/group structure, top-aligned wrapping, mixed parent state, disabled/read-only/error/warning states, table/filter use, and group-level messaging. |
| Atlassian | [Checkbox](https://atlassian.design/components/checkbox/), Level A, 2026-09-18 | One-or-more-choice boundary; detailed reusable API was unavailable from the public page. |
| Apple | [Toggles](https://developer.apple.com/design/human-interface-guidelines/toggles), Level A, 2026-09-18 | Platform toggle guidance recognises checkbox as a style, but does not publish a web Checkbox API. |

## Benchmark comparison

| System | Boundary and supported patterns |
| --- | --- |
| Area | Native binary input; label and description; xs–xl icon-ramp sizes; checked, mixed, disabled, focus. |
| OpenAI | Unavailable; no reusable public specification. |
| Notion | Observed/documented Boolean database property and task tracking; reusable API unavailable. |
| Primer | Native Checkbox plus FormControl and CheckboxGroup; caption/leading visual, mixed, disabled; group owns validation. |
| shadcn/ui | Composable checkbox with controlled state, Field description/invalid/disabled, groups, table and RTL examples. |
| Fluent 2 | Single Checkbox or labelled group; parent mixed state; Switch or Radio for different decision models. |
| Figma | Authoring guidance supports independent boolean, text, and slot properties; it does not prescribe a Checkbox runtime. |
| Geist | Checkbox appears as a row composition; standalone API and dimensions unavailable. |

## Geometry

Chromium at default UI renders checkbox boxes at xs/sm/md/lg/xl = 12/16/16/16/24px; compact renders 12/12/16/16/16px. The accompanying type, leading, and gap follow each requested tier. This is the documented icon-ramp exception to the outer-control-height rule: the mark is a glyph, not a 24–48px control plate. The visible label now owns a minimum 24px activation lane, so `xs` is visually compact without shrinking its usable target.

The Checkbox uses `min(radius-small, size / 4)`, not `radius-control`: the mark remains a rounded square rather than turning into a circle at `xs`. That yields a 3px maximum at 12px, 4px at 16px, and 6px at 24px; Sharp still resolves to square. Apple demonstrates a rounded small square, while Carbon's compact 16px mark and most web systems avoid a full-radius mark. Area preserves that shared intent without letting a global Pill setting erase checkbox identity. Radio and Switch remain the explicit circle/pill exceptions. Text, gaps, and native focus geometry do not change with this cap.

## Accessibility and interaction

The native input provides checkbox role, Tab and Space behavior, checked form value, disabled semantics, and an input ref. Visible labels wrap the input; the React description receives a stable ID and is appended to any supplied `aria-describedby`. `indeterminate` writes the native DOM property for assistive technology and emits `data-indeterminate` so SSR/static documentation paints the mixed mark before hydration. The mixed presentation does not submit a third value.

Area retains focus-visible outline, forced-colors painting, and an increased-contrast selected edge. Standard soft unchecked edges remain subject to the documented contrast limitation; increased contrast is the verified required-edge mode. Browser/AT combinations, touch target spacing in consuming layouts, 200% zoom, long localized labels, and RTL group layout remain release checks.

## Candidate decisions

| Candidate | Decision | Rationale |
| --- | --- | --- |
| Native `indeterminate` prop | Core | Primer and Fluent document the parent partial-selection job; it maps directly to a native input property. |
| Description relationship | Core | The existing description solves a reusable job and must be discoverable to assistive tech. |
| `xs` and `xl` size tiers | Core | Unlike Button's three outer control heights, Checkbox combines an icon ramp with type and gap. `xs` supports dense row metadata and `xl` supports prominent standalone choices; both retain the same minimum label activation lane. The colliding 16px sm/md/lg marks are intentional because their surrounding type and rhythm differ. |
| `sm`/`md`/`lg` as the only public sizes | Reject | It would erase useful choice-row typography and spacing tiers merely because the glyph happens to share a painted 16px box at default density. |
| Minimum 24px activation lane | Core | Primer requires a 24px target or spacing; keeping the visual mark small while the label is interactive satisfies the glyph-role model. |
| First-line alignment for wrapped labels | Core | Carbon explicitly recommends top-aligning a wrapped label to its checkbox; the control now shares the label's top edge rather than being vertically centred by font metrics. |
| CheckboxGroup with legend, validation, and collection state | Core composition | Primer, shadcn, Fluent, Carbon, and MUI all establish group-level responsibilities that cannot be honestly implemented as a class on one input. Area uses semantic `fieldset`/`legend` rather than an ARIA imitation. |
| Invalid individual Checkbox | Core, narrow use | An independently required checkbox can expose `aria-invalid`; a multi-option requirement belongs on CheckboxGroup, which carries the associated message. |
| Invalid selected / mixed Checkbox | Core state matrix | Error wins over selection chroma: an invalid selected or mixed mark uses the danger solid and `fg-on-danger`, never an accent fill with a red outline. |
| Disabled selected / mixed Checkbox | Core state matrix | A saved, inherited, or policy-controlled choice can be unavailable while selected or partially selected. The native disabled state remains meaningful, so docs and gallery expose all three disabled selections. |
| Success/warning group validation | Core composition | Carbon documents group-level warning/error and Field systems expose confirmation copy. Area gives non-error validation a message plus an explicit status; colour never carries the requirement by itself. |
| Controlled `checked` / `onChange` | Core native | Already forwarded without a custom wrapper state. |
| Leading visual, table row, richer entity row | Composition | They belong to Field or a parent row; Checkbox stays a semantic native input. |
| Visual variants, loading, read-only, icon-only | Reject | They weaken an identifiable binary control or imply a different interaction contract. |

## Final contract

`Checkbox` accepts applicable native input props plus `variant`, `size`, `label`, `caption`/`description`, `leadingVisual`, `invalid`, and `indeterminate`. Medium is the default. `leadingVisual` is decorative (`aria-hidden`); the label always supplies the accessible name. `indeterminate` is visual/ARIA state on the native input; consumers still derive a parent's aggregate state and update it after child changes. CSS exposes `area-checkbox`, five size modifiers, `area-checkbox--card`, `area-checkbox__control`, `area-checkbox__visual`, and `area-choice-label`; state selectors cover checked, mixed, disabled, and invalid.

Invalid unchecked controls use a danger edge and danger surface on hover. Invalid checked or mixed controls use danger solid/danger-solid-hover with `fg-on-danger`; accent is not mixed into an error state. Individual invalid labels turn danger to associate the single required choice; group option labels stay default and the group validation message carries the danger treatment.

`CheckboxGroup` accepts a required `label`, children, optional `description`, `error`, or `validation` with `validationStatus`, `orientation`, and native fieldset attributes such as `disabled`. It exposes the `area-checkbox-group` block and its legend, description, options, and validation elements. The docs and gallery isolate every currently audited Checkbox and CheckboxGroup variant into its own specimen, including disabled-off, disabled-on, disabled-mixed, invalid-off, and invalid-on.

## Token decisions

No new Checkbox aliases are warranted. Its fill, edge, selected edge, foreground, focus, type, gap, shadow, `radius-small`, and size-derived radius cap already have stable semantic ownership. `data-indeterminate` is a presentation bridge to the native property, not a token or an axis. The radius cap is geometry derived from the mark's own tokenized size, not a new global radius scale.

## Implementation

- `packages/react/src/components/forms.tsx`: provides `Checkbox` caption, leading visual, contained-option, invalid, native mixed-state support and `CheckboxGroup` semantic fieldset composition.
- `packages/styles/src/components/choice.css` and `forced-colors.css`: recognize the SSR mixed attribute as well as native `:indeterminate`; Checkbox uses a 24px label lane, top-aligned first line, size-capped rounded-square geometry, and group validation paint.
- `packages/styles/src/manifest.ts`, `apps/docs/src/pages.mjs`, `apps/docs/src/demos/form.tsx`, and `apps/docs/src/demos/gallery.tsx`: expose and demonstrate standalone, contained, and grouped cases separately.

This is additive for React consumers. Plain HTML consumers set the native `input.indeterminate` property; `data-indeterminate` is available when server paint must show the state before script execution.

## Verification

Passed on 2026-09-18: `npm run lint:manifest -w @area/styles`, `npm run typecheck`, `npm run build:docs`, `npm run audit`, `npm test` (18,104 assertions), the contrast report (344 assertions across 66 themes), and `git diff --check`. Fresh Chromium inspection verified the rebuilt 100% gallery's independently labelled Button and Checkbox specimens; the native Checkbox, disabled-off/on/mixed states, caption relationship, card composition, mixed selection, group fieldset/legend, group error, group success, and horizontal group all appear in the accessibility tree and documentation. The quality pass additionally verified the strong group-header treatment, the 4/12/8/12 group rhythm, supporting-copy scale, danger-state precedence, and forced-colors invalid indicator.

## Remaining limits

OpenAI and Geist do not publish a standalone Checkbox component contract, and Notion’s documentation establishes product jobs rather than a reusable API. Nested parent/child selection state management, read-only semantics, a table-specific selection toolbar, browser/AT testing, narrow/RTL group layouts, and touch-target spacing remain consuming-product work rather than unimplemented Checkbox variants.
