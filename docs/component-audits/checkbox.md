# Checkbox audit — 2026-09-17

## Decision summary

Area Checkbox remains the native control for one independent binary choice or one option in a related set. This audit adds a first-class `indeterminate` property, makes the optional description programmatically discoverable, and makes the state visible in server-rendered documentation. It retains the icon-ramp size model and treats a full CheckboxGroup as a separate composition.

## Current Area contract

`Checkbox` renders a native `<input type="checkbox">` within its visible `<label>`. It provides five density-owned size modifiers, optional `label` and `description`, disabled styling, checked and mixed paint, native form participation, and a forwarded input ref. The control box is 12/16/16/16/24px in default UI and 12/12/16/16/16px in compact UI; labels, gaps, and leading are selected by the requested tier. The prior API exposed no reliable React mechanism for the native mixed property, and description text had no `aria-describedby` relationship.

## User jobs and non-goals

Use Checkbox to select an independent preference, grant a permission, or select several items in a set. Use the mixed state only on a parent that summarizes a partial selection. Radio owns mutually exclusive choice; Switch owns immediate-effect settings; a future CheckboxGroup owns group legend, requirements, validation, and collection-level behavior. Checkbox does not own a custom popup, loading state, arbitrary visual variants, or an icon-only affordance.

## Evidence ledger

| Benchmark | Evidence and source | Finding used |
| --- | --- | --- |
| Area | Source and Chromium inspection, 2026-09-17 | Native input, visible label, description slot, five icon-ramp sizes, focus and forced-color rules. |
| OpenAI | No public Checkbox component specification found; 2026-09-17 | Unavailable for API decisions. |
| Notion | [Database properties](https://www.notion.com/en-gb/help/database-properties), Level B, 2026-09-17 | Checkbox represents a Boolean property and supports lightweight task tracking. |
| Primer | [Checkbox](https://primer.style/product/components/checkbox/) and [accessibility](https://primer.style/product/components/checkbox/accessibility/), Level A, 2026-09-17 | Native semantics, label/caption, indeterminate, visible focus, 24px target/spacing, and group-level validation. |
| shadcn/ui | [Checkbox](https://ui.shadcn.com/docs/components/radix/checkbox), Level A, 2026-09-17 | Controlled/uncontrolled checked state, invalid Field composition, description, disabled state, groups, table use, and RTL. |
| Fluent 2 | [React Checkbox](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage), Level A, 2026-09-17 | Single vs group boundary, indeterminate parent selection, descriptive labels, and Switch for immediate effect. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties), Level A/B, 2026-09-17 | Expose state, text, and instance properties distinctly rather than folding them into a visual variant. |
| Vercel Geist | [Entity example](https://examples.vercel.com/geist/entity), Level A, 2026-09-17 | Checkbox composes in a richer row without changing native control semantics. No standalone Checkbox API was published. |

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

Chromium at default UI renders checkbox boxes at xs/sm/md/lg/xl = 12/16/16/16/24px; compact renders 12/12/16/16/16px. The accompanying type, leading, and gap follow each requested tier. This is the documented icon-ramp exception to the outer-control-height rule: the mark is a glyph, not a 24–48px control plate; surrounding label space must provide the usable target.

The Checkbox itself uses `radius-small`, not `radius-control`, because its small rounded-square identity is intentionally distinct from a text-bearing rectangular button. Its lower bound is square at Sharp; the Standard family gives it 6px; the Rotund family gives it 10px, after which Pill can visually collide at the small boxes. Radio and Switch remain shape-defining circle/pill exceptions. Text, gaps, and native focus geometry do not change with this radius selection.

The shared control-family adjustment in this batch makes radius a named size curve: the Standard family yields 6px at 28px, 8px at 32px, and 10px at 40px. Same-size icon-only and text buttons read the same token; the cap only stops a tiny box becoming a pill.

## Accessibility and interaction

The native input provides checkbox role, Tab and Space behavior, checked form value, disabled semantics, and an input ref. Visible labels wrap the input; the React description receives a stable ID and is appended to any supplied `aria-describedby`. `indeterminate` writes the native DOM property for assistive technology and emits `data-indeterminate` so SSR/static documentation paints the mixed mark before hydration. The mixed presentation does not submit a third value.

Area retains focus-visible outline, forced-colors painting, and an increased-contrast selected edge. Standard soft unchecked edges remain subject to the documented contrast limitation; increased contrast is the verified required-edge mode. Browser/AT combinations, touch target spacing in consuming layouts, 200% zoom, long localized labels, and RTL group layout remain release checks.

## Candidate decisions

| Candidate | Decision | Rationale |
| --- | --- | --- |
| Native `indeterminate` prop | Core | Primer and Fluent document the parent partial-selection job; it maps directly to a native input property. |
| Description relationship | Core | The existing description solves a reusable job and must be discoverable to assistive tech. |
| CheckboxGroup with legend, validation, and collection state | Separate | Primer and Fluent demonstrate group-level responsibilities that cannot be honestly implemented as a class on one input. |
| Invalid/success/warning paint on an individual checkbox | Separate | Primer explicitly keeps individual validation at group/form scope; Field/CheckboxGroup should own the semantic message. |
| Controlled `checked` / `onChange` | Core native | Already forwarded without a custom wrapper state. |
| Leading visual, table row, richer entity row | Composition | They belong to Field or a parent row; Checkbox stays a semantic native input. |
| Visual variants, loading, read-only, icon-only | Reject | They weaken an identifiable binary control or imply a different interaction contract. |

## Final contract

`Checkbox` accepts applicable native input props plus `size`, `label`, `description`, and `indeterminate`. Medium is the default. `indeterminate` is visual/ARIA state on the native input; consumers still derive a parent’s aggregate state and update it after child changes. CSS exposes `area-checkbox`, five size modifiers, `area-checkbox__control`, and `area-choice-label` elements; state selectors cover checked, mixed, and disabled. The default docs specimen remains one standalone instance, followed by description, the size family, and partial selection.

## Token decisions

No new Checkbox aliases are warranted. Its fill, edge, selected edge, foreground, focus, type, gap, shadow, and `radius-small` roles already have stable semantic ownership. `data-indeterminate` is a presentation bridge to the native property, not a token or an axis. Checkbox’s `radius-small` remains an intentional glyph-role exception.

## Implementation

- `packages/tokens/src/axes/radius.ts`: emits the named radius-family curve across xs–xl.
- `packages/react/src/components/forms.tsx`: adds `CheckboxProps.indeterminate`, native property synchronization, SSR mixed-state attribute, and description association.
- `packages/styles/src/components/choice.css` and `forced-colors.css`: recognize the SSR mixed attribute as well as native `:indeterminate`.
- `packages/styles/src/manifest.ts`, `apps/docs/src/pages.mjs`, and `apps/docs/src/demos/form.tsx`: expose and demonstrate the mixed state.

This is additive for React consumers. Plain HTML consumers set the native `input.indeterminate` property; `data-indeterminate` is available when server paint must show the state before script execution.

## Verification

Passed on 2026-09-17: `npm run build`, `npm run lint:manifest -w @area/styles`, `npm run typecheck`, and `npm run build:docs`. Live Chromium inspection on fresh `http://localhost:4322/checkbox.html` verified default MD radius selection, the matching rounded code-copy actions, description announcement, all five size specimens, and the visible server-rendered partial-selection mark. The rebuilt preview is running on port 4322.

## Remaining limits

OpenAI and Geist do not publish a standalone Checkbox component contract, and Notion’s documentation establishes product jobs rather than a reusable API. CheckboxGroup, group validation, required semantics, nested selection state management, browser/AT testing, narrow/RTL group layouts, and touch-target spacing are separate follow-up work.
