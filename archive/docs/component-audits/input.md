# Input audit — 2026-09-16

## Decision summary

Input remains Area's native single-line text-entry control. This audit keeps the familiar
`Input` name and native `<input>` behavior, adds `outline` and `soft` treatments, makes the
default width a contained 16rem measure with an explicit full-width option, and completes
the composition contract for leading/trailing visuals, static prefix/suffix content,
monospace values, native file inputs, read-only state, and announced loading state.

Neutral framing is intentionally quiet. The standard focus state preserves the existing
1px edge, moves it one neutral step darker, and adds a 2px translucent halo. Invalid paint
uses the brighter danger context for both the 1px edge and the low-alpha halo, so the two
layers read as one semantic state instead of a red line inside an unrelated gray shadow.
The follow-up evidence review adds documented success and warning validation paint while
keeping their explanatory messages in Field.

Input does not gain a ghost treatment. A text-entry control needs a persistent affordance
outside a group backplate. Search clearing, password reveal, shortcut buttons, steppers,
and other interactive trailing content belong to a separately audited InputGroup or
specialized control because they add keyboard, focus, labeling, and event behavior.

## Current Area contract

Before this audit, Input exposed five sizes, a deprecated generic `icon` prop, static
`prefix`/`suffix`, and invalid/disabled states. The shell was always page-wide within its
demo container, had no documented read-only/loading/file/monospace examples, and used one
outline treatment. Invalid focus preserved a danger edge but the field error copy and edge
used a darker danger value and focus added the generic neutral halo.

The completed manifest contract is:

- block `area-input`;
- variants `variant = outline | soft` and `size = xs | sm | md | lg | xl`;
- booleans `full-width` and `monospace`;
- states `disabled`, `invalid`, `success`, `warning`, `read-only`, and `loading`;
- elements `control`, `icon`, and `affix`; and
- defaults `variant = outline`, `size = md`.

React forwards native input attributes and its ref to the inner `<input>`. The outer shell
owns the shared border, background, radius, focus paint, affixes, and visual slots. Input
still accepts the old `icon` prop as a deprecated alias for `leadingIcon`.

The docs lead with one standalone default, then show both treatments and all five sizes
before widths, visual slots, affixes, states, monospace, file values, and logical placement
in RTL. Every ordinary state or variant gets its own preview container; only the labelled
size comparison stacks controls. The gallery specimen uses the explicit leading visual API.

## User jobs and non-goals

Input must:

- accept and expose one line of native text-entry semantics;
- forward the platform's input types, names, values, constraints, events, and form behavior;
- fit an expected value length without becoming page-wide by accident;
- carry optional decorative context or static units without absolute positioning;
- distinguish editable, read-only, disabled, loading, focused, and invalid states;
- preserve logical leading/trailing placement in right-to-left layouts; and
- compose with Field for a visible label, description, and error message.

Input is not a multiline editor, select, combobox, token field, one-time-code group,
search behavior package, number stepper, validation engine, or field-label composition.
Textarea, Select, future Combobox/InputGroup components, native validity, and Field own
those jobs respectively.

## Evidence ledger

All sources were accessed 2026-09-16. Evidence levels follow the component-audit
framework: A is a current official component/system specification or source; B is official
product or platform guidance. No screenshot inference or third-party implementation was
used to add Area API.

| System or source | Level | Evidence used |
| --- | --- | --- |
| [Primer TextInput](https://primer.style/product/components/text-input/) and [Primer React source](https://github.com/primer/react/tree/main/packages/react/src/TextInput) | A | Small/medium/large, block layout, inset contrast treatment, monospace, loading, leading/trailing visuals, trailing action, and validation states. |
| [shadcn/ui Input](https://ui.shadcn.com/docs/components/base/input) and [source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/input.tsx) | A | Native Input with disabled, invalid, file, Field, InputGroup, and RTL compositions; current source uses a 36px base height and contextual destructive focus ring. |
| [Fluent 2 Input usage](https://fluent2.microsoft.design/components/web/react/core/input/usage) | A | Single-line free-form input, standalone/full-width/inline layouts, and guidance to fit width to expected content; placeholder is not essential content. |
| [Vercel Geist Input](https://vercel.com/geist/input) | A | Small/default/large sizes, label and error composition, prefix/suffix, search clearing, command shortcut, rounded affixes, disabled state, and validation guidance. |
| [Notion Forms](https://www.notion.com/help/forms) | B | Product questions support required state, descriptions, short and long answers, and type-specific controls. No public reusable Input API or dimensions were available. |
| [Figma component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties) | B | Variant, boolean, instance-swap, text, and slot properties support a component contract analogous to orthogonal size/treatment/state/content axes. No public reusable Figma Input specification was available. |
| [OpenAI text box help](https://help.openai.com/en/articles/9125172) | B | Official product guidance describes entering and submitting text. No public reusable OpenAI Input component contract or dimensions were available. |
| [HTML input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) and [WAI form labels](https://www.w3.org/WAI/tutorials/forms/labels/) | A | Native input types, constraints, read-only/disabled distinctions, form semantics, accessible labels, and why placeholder text cannot replace a label. |

## Benchmark comparison

| System | Boundary and name | Treatments and layout | Composition and states | Sizes or dimensions |
| --- | --- | --- | --- | --- |
| Area before | Input | Outline; container-filling in docs | One generic icon, prefix/suffix; invalid/disabled | xs–xl; 24/28/32/40/48px default |
| Primer | TextInput | Default, contrast/inset; inline or block | Leading/trailing visual, action, monospace, loading, disabled, read-only, validation | small/medium/large |
| shadcn/ui | Input | One base treatment; width supplied by layout | Native types, disabled, invalid; richer slots live in InputGroup | 36px base in current source |
| Fluent 2 | Input | Standalone, full-width, inline; width should match expected content | Content before/after, disabled, read-only, validation through Field | Published usage does not expose one canonical width |
| Geist | Input | Default and rounded compositions | Prefix/suffix, label, error, search clear, command shortcut, disabled | small/default/large |
| Notion | Product short-answer field | Form question layout | Required, description, short/long answer | Reusable dimensions unavailable |
| Figma | Component-property model | Orthogonal properties and variants | Boolean, text, instance swap, and slots | Reusable Input specification unavailable |
| OpenAI | Product text box | Product-level text entry | Submit and file/product compositions outside this primitive | Reusable Input specification unavailable |

The reusable systems agree on the native single-line boundary and optional content at the
inline edges. Primer, Fluent, and Geist expose multiple size or layout choices. Fluent's
expected-content guidance and Primer's opt-in block mode support Area's contained default
plus explicit `fullWidth`. Primer and shadcn supply direct evidence for contextual invalid
paint. InputGroup-like interactive actions are present in Primer, shadcn, and Geist, but
their behavior exceeds a decorative visual slot and remains separate in Area.

## Source-to-decision union ledger

The recheck records the union of every distinct documented capability, rather than only
the overlap between systems.

| Source capability | Sources | Area decision |
| --- | --- | --- |
| Required, caption, validation | Primer, Fluent, shadcn/ui, Notion Forms | Core through Field; each has its own docs preview. |
| Small/default/large controls | Primer, Fluent, Geist | Core through Area's shared five-tier ramp. |
| Block/full-width | Primer, Fluent, shadcn/ui | Core as explicit `fullWidth`; contained width remains default. |
| Contrast/inset treatment | Primer | Core as soft Input, retaining a persistent affordance. |
| Leading/trailing visual and text affix | Primer, Fluent, Geist | Core slots. |
| Loading with automatic or explicit position | Primer | Core `loading`, `loaderPosition`, and `loadingText`. |
| Trailing action | Primer, Geist | Core one-action slot; grouped actions remain InputGroup work. |
| Error and success validation | Primer | Core `validationStatus`; legacy `invalid` maps to error. |
| Warning validation | Fluent Field | Core `validationStatus="warning"` with a Field message. |
| Search clear, shortcut, password reveal, steppers, OTP, token input | Geist, shadcn/ui, Primer related components | Separate composition or component: each changes focus or value behavior. |
| Product short/long responses | Notion | Separate Input versus Textarea boundary. |
| Component properties and slots | Figma | Reflected through orthogonal props; not an Input visual variant. |
| ChatGPT composer functions | OpenAI | Unavailable as a reusable public Input contract; no API inferred. |

## Geometry

Measurements were taken in Chromium at a 1159×798 CSS-pixel viewport and device-pixel
ratio 2. The docs preview used the Geist type preset, light theme, neutral neutral,
blue accent, outlined surface, and 8px radius unless a row says otherwise. Width is 256px
(`16rem`) in a roomy container and clamps to `100%` in a narrower container. The explicit
full-width demonstration is 320px wide; it proves layout behavior and is not a second
default width.

| Size | Default: height, type/leading, padding, gap | Compact: height, type/leading, padding, gap |
| --- | --- | --- |
| xs | 24px; 12/16px; 6.74px; 4px | 20px; 11/14px; 5.095px; 4px |
| sm | 28px; 13/18px; 8.385px; 4px | 24px; 12/16px; 6.74px; 4px |
| md | 32px; 14/20px; 10.03px; 8px | 28px; 13/18px; 8.385px; 6px |
| lg | 40px; 14/20px; 14.03px; 8px | 32px; 14/20px; 10.03px; 6px |
| xl | 48px; 16/24px; 17.32px; 8px | 36px; 14/20px; 12.03px; 8px |

The fractional padding values are the painted result of the optical inset formula and the
active font's cap metric; they are not CSS literals. At medium/default, a 16×16px visual
slot paints exactly 8px from the top and the relevant outer edge of the 32px shell. Leading
and trailing slots reverse logically in RTL without rescaling either glyph. Text retains
native editing metrics as documented in the shared optical-inset contract.

Radius is `min(--area-radius-control, height × --area-radius-cap)`. The meaningful lower
bound is 0px and the supported upper bound is the pill preset's half-height cap. At the
tested default/compact xs, md, and xl sizes:

| Preset | Default xs / md / xl | Compact xs / md / xl |
| --- | --- | --- |
| 0 | 0 / 0 / 0px | 0 / 0 / 0px |
| 8 | 8 / 8 / 8px | 8 / 8 / 8px |
| 12 | 9.6 / 12 / 12px | 8 / 11.2 / 12px |
| pill | 12 / 16 / 24px | 10 / 14 / 18px |

The 12px preset intentionally collides with the 8px result on compact xs because the 0.4
cap prevents a small field from becoming an unintended pill. The pill preset is the only
one allowed to reach half-height. No tested radius clipped text, icons, focus, or native
file-button content.

Focused standard Input paints a 1px edge and 2px halo with no outline. The tested invalid
field used `rgb(207, 3, 60)` for its edge and the same color at 14% alpha for the halo.
Increased contrast adds the 2px opaque outline and expands the halo to 4px.

## Accessibility and interaction

The interactive element remains a native `<input>` and receives the forwarded ref,
native attributes, constraints, values, events, `disabled`, `readOnly`, `aria-invalid`,
and `aria-busy`. Field supplies the label and description/error relationships; standalone
examples use `aria-label`. Decorative leading/trailing visuals are hidden from assistive
technology. Affixes are static, non-focusable content and do not become part of the value.

Disabled prevents native interaction. Read-only keeps the value focusable, selectable,
and copyable. Loading sets `aria-busy=true`, supplies a named status spinner, and keeps the
field editable because server-side checking does not necessarily prevent continued input.
Applications that must lock a value can combine their own policy with `readOnly` or
`disabled` deliberately.

Keyboard editing, selection, undo, platform shortcuts, constraint validation, and input
method behavior remain native. Area does not intercept Escape, Enter, arrows, or typing.
Search clearing and password reveal therefore require a specialized composition rather
than implicit behavior in this primitive.

The visible invalid edge and associated Field error text use the brighter danger role;
the error remains textual, so invalid state is not conveyed by color alone. Standard
neutral boundaries are intentionally soft. Increased contrast replaces required neutral
edges and focus with the tested stronger endpoints. Forced-colors rules preserve required
edges and focus using system colors.

The 16rem default clamps in narrow containers, logical properties preserve RTL, and the
control does not truncate the native editable value. Large type retains the density-owned
UI tier while Field descriptions follow their content type. Native browser zoom and text
editing continue to determine caret and glyph rendering.

## Candidate decisions

### Core

- **Outline and soft treatments.** Primer documents an inset/contrast treatment and the
  user needs a quieter filled option. Both keep a persistent affordance and share state
  behavior.
- **Contained and full-width layout.** Fluent recommends fitting expected content and
  Primer makes block width explicit. A 16rem default removes the former accidental 654px
  field while `fullWidth` preserves deliberate responsive layouts.
- **Five Area sizes.** The shared control ramp is already the cross-component sizing
  contract. Removing tiers would make Input disagree with Button, Select, and Field layouts.
- **Leading/trailing visuals and static affixes.** Primer, Geist, and Fluent support edge
  content. Orthogonal slots cover search/state glyphs and units without absolute positioning.
- **Disabled, read-only, error/success/warning validation, and native input types.** These are native semantic
  distinctions. File input is documentation of forwarded platform behavior, not a new API.
- **Contextual invalid edge and halo.** Primer and shadcn use validation-context paint.
  Using one brighter context color makes Area's edge, halo, and Field message coherent.

### Optional

- **Soft variant.** It solves a real embedded-surface use case but outline remains the
  safer default for discoverability.
- **Monospace values.** API keys, hashes, and identifiers need character differentiation;
  it changes typography without changing input behavior.
- **Loading state.** Async availability or validation checks need perceivable progress.
  Area announces it and does not silently disable editing.

### Separate component or composition

- **Interactive trailing action and InputGroup.** Primer, shadcn, and Geist demonstrate
  actions, shortcuts, and grouped affixes. Area adopts one `InputAction` in the existing
  trailing slot: its density-owned square icon box, native button semantics, and hover/focus
  tooltip are supportable inside the field. Multiple actions, shortcuts, and grouped radii
  remain an InputGroup audit because they change the tab order and composite geometry.
- **Search, password, numeric stepper, OTP, and token input.** Each adds behavior or a
  multi-control value model beyond a native text primitive.

### Reject

- **Ghost Input.** Removing both stable fill and edge weakens text-entry discoverability
  unless a separately specified group backplate supplies the affordance.
- **Label, description, and error-string props.** Field already owns those semantic
  relationships; duplicating them would create two competing composition models.
- **Automatic clearing, formatting, trimming, or validation-on-blur.** These are product
  data policies and would interfere with native events, international input, or form
  libraries.
- **Arbitrary width size variants.** Expected value length and layout context determine
  width. A contained default and explicit full width are clearer than `short/long` aliases.

## Final contract

React adds or clarifies:

- `variant?: "outline" | "soft"`, default `outline`;
- `size?: "xs" | "sm" | "md" | "lg" | "xl"`, default `md`;
- `leadingIcon?: ReactNode` and `trailingIcon?: ReactNode` for decorative visuals;
- `prefix?: ReactNode` and `suffix?: ReactNode` for static units;
- `fullWidth?: boolean` for available-width layout;
- `monospace?: boolean` for code-like values;
- `loading?: boolean` and `loadingText?: string`, default text `Loading`;
- `trailingAction?: InputAction`, whose required icon and tooltip preserve the shared
  inset contract and provide an accessible action name. At md, Input reserves a 24px
  action backplate inside its 32px shell, while the action centers a 16px icon inside its
  own 4px local padding; and
- `validationStatus?: "error" | "success" | "warning"`; `invalid?: boolean` remains an
  error compatibility alias; and
- deprecated `icon?: ReactNode`, resolved after `leadingIcon`.

Native `readOnly`, `disabled`, `type`, `required`, `pattern`, `minLength`, `maxLength`,
`autoComplete`, values, events, and ARIA attributes continue to pass through. `className`
applies to the outer shell. The ref continues to target the native input.

Plain CSS users apply the manifest classes and equivalent state attributes to the shell,
then place a native input in `area-input__control`. They must supply native/ARIA semantics
themselves.

## Token decisions

The audit adds stable, public Input theming seams with explicit fallbacks:

- `--area-input-bg` → `--area-bg-surface`;
- `--area-input-bg-soft` and `--area-input-bg-disabled` → `--area-bg-component`;
- `--area-input-edge` → `--area-edge-control`;
- `--area-input-edge-hover` → `--area-edge-control-hover`;
- `--area-input-text` → `--area-fg-default`;
- `--area-input-placeholder` → `--area-fg-placeholder`;
- `--area-input-icon` → `--area-fg-muted`;
- `--area-input-invalid-color` → `--area-fg-danger-vivid`;
- `--area-input-invalid-halo-color` → 14% of the invalid color; and
- matching success and warning Input aliases → their vivid semantic foregrounds and 14%
  contextual halos; and
- `--area-input-inline-size` → `16rem`.

Field error copy now uses `--area-field-error-color`, which falls back to the same vivid
danger role. Input owns its aliases; the base rule consumes them and variants only repoint
local slots. The invalid edge receives explicit non-text contrast assertions across every
theme surface. The halo remains supplemental translucent paint and is not credited as the
required edge.

No new palette value was added. The existing vivid semantic endpoint supplies saturation
and readability, while the neutral aliases preserve the quiet shared presentation. Ghost,
search-action, and password-action aliases remain separate because they need a completed
interactive component contract.

## Implementation

- Updated Input CSS, the shared manifest, generated variant helper inputs, and the React
  wrapper together.
- Added explicit treatments, contained/full width, read-only/loading/monospace states,
  leading/trailing visuals, and native file-input styling.
- Replaced invalid neutral halo paint with the same brighter danger context at low alpha;
  Field error copy now shares the vivid danger role.
- Added success and warning validation paint and Field messages from the Primer and Fluent
  contracts, with the same 1px contextual edge and soft contextual halo sequence.
- Added Input-scoped color and width tokens plus contrast coverage for the required invalid
  edge.
- Expanded docs demos, API reference, practices, gallery usage, and RTL coverage from the
  real React source that also generates snippets.
- Applied the shared documentation specimen sequence: standalone default, visual
  treatments, all size tiers, then composition, width, states, and behavior examples.

The change is additive except for default width: Input now caps at 16rem instead of filling
its container. Consumers that require the prior behavior add `fullWidth` or
`area-input--full-width`. The deprecated `icon` prop continues to work, so visual-slot
migration is non-breaking.

## Verification

Completed checks:

- `npm run lint:manifest -w @area/styles` — 36 component manifests passed parity;
- `npm run typecheck` — tokens, styles, React, and docs passed;
- `npm run test:contracts` — 12/12 manifest and axis-preference contracts passed;
- `npm test` — 9 files and 16,916 token/contrast tests passed;
- `node packages/tokens/src/contrast/report.ts` — 320 assertions passed across 66 themes;
- `npm run test:consumer` — package imports, declarations, SSR, browser bundle, invalid
  variant rejection, and tree shaking passed;
- `npm run build:docs` — 48 pages and 115 real React demos built; dogfood passed;
- `npm run audit` — all 36 components were used and docs raw-value checks passed; and
- `git diff --check` — passed.

Browser verification used Chromium at 1159×798 CSS pixels and device-pixel ratio 2. It
covered every size at default and compact density, the default and large type presets,
radius 0/8/12/pill, contained/full/narrow widths, outline/soft treatment, visual/affix/file
content, read-only/disabled/loading/invalid states, RTL, and light/dark presentation.
The 16px medium icon slot painted 8px from the top and relevant outer edge in both logical
directions. The authored narrow container clamped the shell to 260px while the contained
default and explicit full-width examples painted 256px and 320px. A paired live
measurement confirmed that vertical Field and horizontal Field controls also paint at
256px; only a horizontal row's label makes the whole Field wider.

Focused invalid paint was computed directly: standard mode painted a 1px
`rgb(207, 3, 60)` edge, same-context 14% 2px halo, and no outline; increased contrast kept
that edge, added a 2px same-context outline at zero offset, and expanded the halo to 4px.
The painted browser matrix remained 17,316 passed / 3,804 documented soft-edge shortfalls
in standard mode and 21,120 passed / 0 failed in increased contrast. Light and dark focused
invalid states were visually inspected and remained bright, soft, and legible.

## Remaining limits

- No public reusable OpenAI, Notion, or Figma Input dimensions/API were available; their
  official product guidance was not promoted into a component specification.
- Native file-button, search-decoration, autofill, and caret paint vary by browser and
  operating system. Chromium was inspected here; Firefox, WebKit, Windows forced colors,
  and assistive-technology pairings remain release checks.
- The in-app browser did not expose a reliable 200% zoom control. The authored 260px narrow
  case, larger type preset, and long RTL value passed, but 200% browser zoom remains a
  release check.
- Interactive grouped actions, search clearing, password reveal, and specialized input
  models remain intentionally pending their own audits.
