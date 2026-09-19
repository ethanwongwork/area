# Field audit — 2026-09-16

## Decision summary

Field remains the semantic composition around one direct control. It owns the visible or
visually hidden label, durable guidance, validation message, and their accessible
relationships. The child control owns its size, width, radius, focus paint, and interactive
behavior.

This audit adds stable generated relationships, required/disabled/invalid propagation,
coexisting description and error content, explicit vertical and horizontal orientations,
and a visually hidden label option. The old `inline` prop and `area-field--inline` class
remain compatibility aliases for horizontal orientation.

Field does not gain visual emphasis variants, tones, sizes, or a full-width prop. It paints
no container or control edge, so those options would duplicate the child control's contract.

The 2026-09-16 focus follow-up keeps that ownership boundary explicit. In the standard
presentation, Input, Select, and Textarea preserve their existing 1px edge, move it from
`border-faint` to `border-subtle`, and add a 2px translucent halo. Increased contrast adds
the 2px accent outline and expands the halo to 4px. The subsequent Input audit makes its
invalid edge, halo, and associated Field error copy share the brighter danger context.

## Current Area contract

Before this audit, the manifest exposed only the `inline` boolean and `disabled` state.
React rendered a label, one child, and either a description or an error. Consumers had to
coordinate `htmlFor` and `id`, set `required` and `invalid` on the child separately, and
connect help and error text manually. `data-disabled` reduced the opacity of the complete
composition, including useful guidance and error text.

The CSS already provided a useful visual foundation:

- vertical flex layout with `--area-space-6` between label, control, and messages;
- density-owned UI type for the label and caption type for messages;
- a two-column settings layout with an intrinsic label and the shared contained control width;
- muted regular-weight labels in settings rows; and
- right-aligned switches when a horizontal Field is inside Panel.

There was no component-specific size, radius, background, border, focus ring, event model,
or token alias. The React ref targets the wrapping `div`; the child retains its own ref.

## User jobs and non-goals

Field must:

- give one direct control an accessible name;
- connect persistent instructions and a concise validation message;
- communicate required, disabled, and invalid semantics without relying on color or a glyph;
- arrange the same semantic parts vertically in forms or horizontally in compact settings;
- work with native controls and Area controls that forward native and ARIA props; and
- preserve consumer-provided IDs and ARIA relationships.

Field is not a control, control group, fieldset, validation engine, form library adapter,
or decorative container. Checkbox/radio groups need Fieldset and Legend. Schema error
arrays belong in an adapter or application layer. Read-only remains a capability of the
particular child control because it is not valid for every control type.

## Evidence ledger

All sources were accessed 2026-09-16.

| System or source | Level | Evidence used |
| --- | --- | --- |
| [Primer FormControl](https://primer.style/product/components/form-control/) | A | Generated IDs connect label, caption, and validation; vertical and horizontal layouts; required, disabled, visually hidden label; caption and validation may coexist. |
| [shadcn/ui Field](https://ui.shadcn.com/docs/components/base/field) | A | Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet, and related composition; vertical, horizontal, and responsive orientation; `data-invalid` plus `aria-invalid`. |
| [Fluent 2 Field](https://fluent2.microsoft.design/components/web/react/core/field/usage) | A | Label, helper and validation composition; success/warning/error validation; vertical default and optional horizontal layout; disabled paint stays on the control so explanatory text remains readable. |
| [Vercel Geist Input](https://vercel.com/geist/input) | A | No separate public Field wrapper was found; Input composes label and error while helper text is connected with `aria-describedby`; size and affixes belong to Input. |
| [Notion Forms](https://www.notion.com/help/forms) | B | Product forms give each question a title, optional description, required state, and type-specific control. This is product guidance, not a reusable Field API. |
| [Figma accessibility](https://help.figma.com/hc/en-us/articles/35063862380311-Accessibility-at-Figma) and [Figma Sites accessibility](https://help.figma.com/hc/en-us/articles/31242789265431-Improve-the-accessibility-of-your-site) | B | WCAG 2.2 AA target, semantic HTML, and explicit labels when visible text is absent. No public reusable Field contract or dimensions were available. |
| [OpenAI visual settings help](https://help.openai.com/en/articles/11958281) | B | Product-level appearance guidance was available; no current public reusable Field component contract or dimensions were found. OpenAI API or dimensions are therefore recorded as unavailable. |
| [WAI form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/), [labels](https://www.w3.org/WAI/tutorials/forms/labels/), [validation](https://www.w3.org/WAI/tutorials/forms/validation/), and [notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) | A | Visible labels and instructions, exact `for`/`id` relationships, `aria-describedby`, native required semantics, and concise associated errors. |
| [React `useId`](https://react.dev/reference/react/useId) | A | Hydration-safe accessibility IDs and distinct `identifierPrefix` values for independent React roots. |

Evidence levels follow the component-audit framework: A is a current official system or
standards source; B is official product or accessibility guidance. No product screenshot
measurement was promoted into a system rule.

## Benchmark comparison

| System | Boundary and name | Layout and composition | State and semantics | Size and radius |
| --- | --- | --- | --- | --- |
| Area before | Field wrapper | Vertical or `inline`; label; one of description/error | Manual IDs and child state; whole wrapper dimmed | No Field size or radius; child owns both |
| Primer | FormControl | Vertical/horizontal; label, caption, validation | Generated relationships; required, disabled; visually hidden label; success/error validation | Wrapper is intrinsic; control owns geometry |
| shadcn/ui | Field family | Vertical/horizontal/responsive; content, description, error, group, fieldset, legend, separator | Invalid on Field and control; compositional API | Field has spacing/layout; child owns control size/radius |
| Fluent 2 | Field | Vertical default/horizontal optional; label, info action, helper, validation | Required; disabled control while supporting text stays readable; success/warning/error | Field wrapper has no canonical control box |
| Geist | Input with label/error | Label and error integrated into Input; helper composed separately | `id` required for string label; helper uses `aria-describedby` | Small/default/large belong to Input |
| Notion | Form question | Title, optional description, conditional form composition | Required question and type-specific behavior | Product-level dimensions unavailable |
| Figma | Product form patterns | Direct observations were not used to define API | Official guidance favors semantic labels | Reusable component dimensions unavailable |
| OpenAI | Product form patterns | Reliable public reusable Field evidence unavailable | Reliable public reusable Field evidence unavailable | Unavailable |

Across Primer, shadcn/ui, Fluent, and Geist, the shared boundary is semantic composition;
the input-like child owns its box. Primer, shadcn/ui, and Fluent support an alternate
horizontal arrangement. Primer and Fluent explicitly keep supporting content perceivable
when the control is disabled.

## Geometry

Measurements were taken in the built Chromium preview at a 1159×798 CSS-pixel viewport
and device-pixel ratio 2. The standalone vertical Input and the horizontal Field control
both measure 256px (`--area-input-inline-size`). The whole horizontal row grows only for
its label and gap; Panel is the explicit shared-column exception.

| Case | Default density | Compact density | Declared source |
| --- | --- | --- | --- |
| Vertical label + md Input + description | 256×80px; label 14/20px | 256×74px; label 13/18px | Field gap `--area-space-6`; child width/height comes from Input `md` |
| Horizontal label + md Input | 356.22×32px; 8px grid gap | 356.22×28px; 6px grid gap | intrinsic label + `--area-input-inline-size`; gap `--area-gap-md` |
| Vertical md Input + description + error | 256×102px | 256×96px | contained control width; both messages use caption leading |
| Visually hidden label + md Input | 256×32px | 256×28px | hidden label contributes no painted size |

The large type preset kept the label at the density-owned 14/20px UI role; the default
example became 82px tall because the content caption role changed. The contained control
clamps to its parent in a narrow layout. Text and messages wrap naturally; Field does not
truncate them.

Field itself has no painted box, so radius lower and upper bounds are **not applicable**.
All radius presets from 0 through pill may change the child control, but auditing those
painted/capped results belongs to that child's component audit. There is no concentric
inner/outer relationship for Field and no radius collision to mask.

## Accessibility and interaction

The final React wrapper:

- derives a hydration-stable ID with `useId()` when neither `htmlFor` nor the child `id`
  supplies one;
- gives the label its own ID and applies both native `for`/`id` and `aria-labelledby`, so
  native controls remain clickable and composite controls can receive the same name;
- appends generated description and error IDs to any consumer `aria-describedby` values,
  without duplicating tokens;
- uses `aria-errormessage` while invalid and also keeps the error in `aria-describedby`;
- propagates `required`, `disabled`, and error-derived `aria-invalid` to the direct child;
- keeps the required asterisk `aria-hidden`; and
- leaves error announcement strategy to the form. Field does not apply `role=alert` to
  every error, which would interrupt screen-reader output indiscriminately.

The direct child must forward `id`, `aria-*`, `required`, and `disabled` props to its
interactive element. Area Input, Select, Textarea, Slider, Checkbox, Radio, and Switch do.
Composite controls can consume the generated `aria-labelledby`; their own keyboard and
form behavior remains their responsibility.

When a page mounts multiple independent React roots, each root must use a distinct React
`identifierPrefix`; server and client must use the same prefix when hydrating. The docs
renderer now follows this rule for its independent preview roots.

Framework-free CSS cannot generate IDs. Plain HTML users must provide the same `for`,
`id`, `aria-labelledby`, `aria-describedby`, `aria-errormessage`, and native state
attributes themselves.

## Candidate decisions

### Core

- **Automatic IDs and relationships.** Primer and WAI directly support this, and it closes
  the existing Area audit defect without changing visual design.
- **Vertical and horizontal orientation.** Primer, shadcn/ui, and Fluent all document the
  distinction; Area already had the visual pattern under the less precise `inline` name.
- **Required, disabled, and invalid propagation.** These are semantic facts of one field,
  and duplicating them across wrapper and child was error-prone.
- **Description and error coexistence.** Primer permits caption and validation together;
  durable guidance should not disappear when correction becomes necessary. Content
  guidance now requires the two messages to be useful and non-redundant.
- **Readable disabled supporting text.** Fluent states this explicitly. Child controls own
  disabled paint while the label becomes muted without opacity on instructions or errors.

### Optional

- **Visually hidden label.** Primer supports it and WAI permits an accessible label when a
  visible label would duplicate clear surrounding context. Area documents visible labels
  as the default.
- **Success and warning validation.** Primer and Fluent document these distinct non-error
  outcomes. Field now renders their message while forwarding the status to Input, whose
  edge and halo use the matching semantic context color.

### Separate component or composition

- **FieldGroup, Fieldset, Legend, and responsive group orientation.** shadcn/ui's expanded
  family is useful, but group naming, responsive containers, and choice validation require
  a distinct group contract. Review them with Checkbox and Radio.
- **Info action beside a label.** Fluent supports it; in Area it is a composition of Field,
  an icon Button, and Tooltip/Popover, with accessible naming rules of its own.
- **Schema error arrays.** Adapting Zod or another validator belongs in a form-library
  adapter. Field accepts already-renderable error content.

### Reject

- **Soft, outline, and ghost Field variants.** Field paints no backplate. Applying these to
  the wrapper would confuse Field with the child control or a container.
- **Field size, width, or full-width props.** The child and layout context already own those
  dimensions. A second size source could make label and control tiers disagree.
- **Automatic native validity message rendering.** Browser messages are localized and
  platform-owned; applications may use native validation or supply product-specific error
  text. Field should connect a message, not invent validation policy.

## Final contract

Manifest:

- block: `area-field`
- variants: `orientation = vertical | horizontal`, default `vertical`
- compatibility boolean: `inline`
- state: `disabled`
- elements: `label`, `required`, `description`, `validation`, `error`

React props added or clarified:

- `orientation?: "vertical" | "horizontal"`
- `disabled?: boolean`
- `visuallyHiddenLabel?: boolean`
- `inline?: boolean` remains deprecated and resolves to horizontal
- `htmlFor?: string` remains an explicit ID override
- `label`, `description`, `error`, and `required` keep their existing names
- `validation?: ReactNode` and `validationStatus?: "error" | "success" | "warning"`
  support non-error validation; `error` remains the compatibility shorthand for error

The wrapper accepts one direct control child. Consumer IDs and ARIA references are
preserved and merged. Input and Textarea now derive their invalid chrome from either their
existing `invalid` prop or an incoming `aria-invalid` value, so Field propagation affects
both semantics and paint.

## Token decisions

No token was added. Field consumes stable existing roles:

- `--area-space-6` for vertical composition spacing;
- `--area-gap-md` for horizontal row spacing;
- `--area-ui-size`, `--area-ui-leading`, and `--area-weight-strong` for vertical labels;
- `--area-text-xs-size` and `--area-text-xs-leading` for supporting messages;
- `--area-fg-default` and `--area-fg-muted` for label and guidance roles; and
- `--area-field-error-color`, which falls back to `--area-fg-danger-vivid`, for the error;
  success and warning messages use their corresponding vivid semantic foregrounds.

The Input follow-up added the Field error alias because a consumer may need to tune form
validation independently from every danger foreground. Input owns the corresponding
success and warning edge/halo aliases, while Field owns the readable status message.

## Implementation

- Extracted Field and Label from the shared primitives file into
  `packages/react/src/components/Field.tsx`.
- Added the manifest-derived `fieldVariants` helper and direct exports.
- Added generated/merged ARIA relationships and state propagation.
- Updated Input and Textarea invalid adapters to honor incoming `aria-invalid`.
- Replaced wrapper opacity with readable label-only muted paint for disabled Field.
- Added orientation classes while preserving the inline compatibility selector.
- Updated demos, gallery use, API reference, practices, and design-system terminology.
- Added unique React `identifierPrefix` values to independently rendered docs previews;
  without them, separate roots generated duplicate `useId()` values.
- Added docs-build checks for duplicate Field IDs, dangling relationships, and state
  propagation.
- Reordered the page to lead with one standalone default, followed by the horizontal
  settings-row layout, child control sizes, validation/disabled states, and the hidden-label
  exception. Field has neither a painted treatment nor a size of its own, so those slots are
  intentionally represented by its meaningful layout and composed control tiers.

Migration is additive. Existing explicit matching `htmlFor`/`id` pairs still work.
Existing `inline` consumers keep the same layout and can migrate to
`orientation="horizontal"` without a visual change.

## Verification

Completed checks:

- `npm run typecheck -w @area/react`
- `npm run lint:manifest -w @area/styles`
- `npm run build:docs`
- server-rendered contract assertion for merged `aria-describedby`, generated label/error
  relationships, required/disabled/invalid propagation, and horizontal class output
- browser DOM assertion: 18 Field-generated IDs and zero duplicates across independent
  preview roots
- browser accessibility tree: correct accessible names for Email, Workspace, Search
  components, Select, Slider, and Switch examples
- browser geometry at default and compact density, default and large type presets, and a
  280px horizontal settings container
- visual inspection in light and dark themes at device-pixel ratio 2
- computed browser paint: standard focus retained a 1px edge, resolved the darker neutral
  focus edge, painted a 2px 6%-black halo, and added no outline; increased contrast painted
  the 2px accent outline and 4px halo; invalid focus retained its danger edge
- painted browser matrix: standard 17,316 passed / 3,804 documented soft-edge shortfalls;
  increased contrast 21,120 passed / 0 failed
- label activation focused the generated Input control, and the preview console reported no
  warnings or errors
- `npm run typecheck` — passed for tokens, styles, React, and docs
- `npm run test:contracts` — 12/12 passed
- `npm test` — 9 files and 16,322 token/contrast tests passed
- `npm run audit` — passed the docs dogfood and Field relationship checks
- `git diff --check` — passed

The final docs build rendered 48 pages and 109 demos; its dogfood and Field relationship
integrity checks passed.

## Remaining limits

- VoiceOver, NVDA, JAWS, Safari, Firefox, Windows forced-colors, and mobile touch testing
  were not available in this batch. The implementation uses native label/state attributes
  and additive ARIA relationships, but those combinations still need the release matrix.
- The in-app browser's viewport override did not resize the existing local preview. The
  280px authored container was used for the narrow layout check; full-page reflow and 200%
  zoom remain part of the release-level typography/responsiveness pass.
- OpenAI and Figma do not expose a current public reusable Field specification, so no API
  or dimensions were inferred from their product appearance.
- Fieldset/Legend, responsive FieldGroup behavior, and success/warning validation stay
  deferred to the related choice and text-entry audits.
