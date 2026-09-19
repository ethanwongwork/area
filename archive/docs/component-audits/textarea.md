# Textarea audit — 2026-09-16

## Decision summary

Textarea remains Area's native multiline plain-text control. The audit keeps the familiar
name, native `<textarea>` editing and form behavior, three meaningful type/padding sizes,
and vertical resizing by default. It adds `outline` and `soft` treatments, a contained
16rem default with explicit full width, explicit resize directions, read-only paint, and
error/success/warning validation parity with Input and Field.

When `rows` is omitted, Area now reserves four lines instead of inheriting the browser's
two-line default. An explicit native `rows` value still owns the visible response height.
The component remains scrollable when content exceeds that height and does not silently
grow with its value.

Auto-growing height, a rendered character counter, inline error strings, rich text,
formatting controls, submit actions, and chat-composer behavior do not enter this primitive.
They require controlled-value synchronization, limits, announcements, or multi-control
focus behavior and remain separate compositions.

## Current Area contract

Before this audit, Textarea exposed `size = sm | md | lg`, `invalid`, and forwarded native
textarea props and its ref. It was always full-width, always outline-styled, vertically
resizable unless disabled, and documented by one `rows={3}` placeholder example. CSS used
shared field colors directly, did not distinguish read-only paint, and let the pill radius
curve against the full multiline height.

The completed manifest contract is:

- block `area-textarea`;
- variants `variant = outline | soft`, `size = sm | md | lg`, and
  `resize = vertical | horizontal | both | none`;
- boolean `full-width`;
- states `invalid`, `success`, `warning`, `disabled`, and `read-only`;
- no sub-elements; and
- defaults `variant = outline`, `size = md`, and `resize = vertical`.

React forwards native textarea attributes, values, events, form ownership, and its ref to
the native element. `invalid` remains an error compatibility shorthand;
`validationStatus` and Field's internal validation bridge add semantic success and warning
paint without putting explanatory copy inside Textarea.

The docs now lead with the standalone public default, treatments, and all three sizes,
then separate state, layout, composition, and resize specimens. The gallery remains a
native, labelled Textarea specimen.

## User jobs and non-goals

Textarea must:

- accept and expose multiple lines of native plain text;
- forward native values, constraints, events, directionality, form submission, and reset;
- start at a useful response height without filling the page width accidentally;
- allow an application to choose resize direction independently from visual treatment;
- distinguish editable, read-only, disabled, focused, and validation states;
- remain usable with narrow containers, long values, zoom, and right-to-left text; and
- compose with Field for a visible label, description, and validation message.

Textarea is not Input, a rich-text or Markdown editor, code editor, chat composer,
auto-growing message box, character-counter package, validation engine, or submit-button
composition. Those jobs have different value, keyboard, focus, layout, and announcement
contracts.

## Evidence ledger

All sources were accessed 2026-09-16. Evidence level A is a current official component,
system specification, source, or platform reference. Level B is official product or
authoring guidance. No inferred product dimensions were used to add Area API.

| System or source | Level | Evidence used |
| --- | --- | --- |
| [Primer Textarea](https://primer.style/product/components/textarea/), [guidelines](https://primer.style/product/components/textarea/guidelines/), and [accessibility](https://primer.style/product/components/textarea/accessibility/) | A | Native multiline boundary; character-based/default/block width; rows; both/horizontal/vertical/none resize; auto-size; character limit; contrast treatment; validation; permanent label; 320px reflow and native keyboard expectations. |
| [shadcn/ui Textarea](https://ui.shadcn.com/docs/components/base/textarea) and [current source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/textarea.tsx) | A | Native prop forwarding, full-width layout, content sizing, disabled and `aria-invalid` paint, Field composition, button composition, and RTL example. |
| [Fluent 2 Textarea usage](https://fluent2.microsoft.design/components/web/react/core/textarea/usage) | A | Long free-form boundary, non-resizable default with optional resize prop, size-to-expected-volume guidance, and persistent-label/placeholder accessibility guidance. |
| [Vercel Geist Textarea](https://vercel.com/geist/textarea) | A | Small/medium/large, disabled, read-only, error string, rows, generous-height guidance, and helper/error association guidance. Live official examples were inspected to confirm the three size names and native rows example. |
| [Notion Forms](https://www.notion.com/help/forms) | B | Text questions can opt into Long answer, required state, and descriptions. No reusable Notion Textarea API or dimensions were published. |
| [Figma component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties) | B | Variant, boolean, text, and instance properties support orthogonal treatment/size/state/content modeling. No reusable Figma Textarea specification was published. |
| [OpenAI ChatGPT home guidance](https://help.openai.com/en/articles/9125172) | B | Official guidance describes entering prompts in a text box, but no reusable OpenAI Textarea contract or dimensions were published. Composer behavior was not inferred into Area. |
| [HTML textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea) and [CSS resize](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/resize) | A | Native rows/cols, values, constraints, read-only versus disabled semantics, implicit textbox role, form participation, resize directions, browser baseline differences, and label requirements. |

## Benchmark comparison

| System | Boundary and name | Treatment, size, and layout | States, composition, and behavior |
| --- | --- | --- | --- |
| Area before | Textarea; native multiline plain text | Outline; sm/md/lg; page-wide; vertical resize; explicit rows only | Invalid and disabled; native props/ref; one placeholder demo |
| Primer | Textarea; native multiline value | Default/contrast; character width or block; rows; min/max height | Required, caption, error/success, all resize directions, auto-size, character limit |
| shadcn/ui | Textarea; open source native wrapper | Full-width; content sizing; one base treatment | Disabled, invalid, Field, Button, RTL; all native props |
| Fluent 2 | Textarea; long free-form text | Fit expected volume; not resizable by default, resize optional | Label and Field guidance; scroll on overflow; placeholder is supplementary |
| Geist | Textarea; multiline input | Small/medium/large; rows; page/example width | Disabled, read-only, error string; helper and error guidance |
| Notion | Product Long answer question | Long-answer option inside a form | Required and description; reusable API/dimensions unavailable |
| Figma | Component authoring model, not a published Textarea | Orthogonal variant/boolean/text properties | Reusable Textarea API/dimensions unavailable |
| OpenAI | Product prompt text box/composer | Product-level text entry | Reusable Textarea API/dimensions unavailable |

Primer, Fluent, Geist, and the native platform agree that expected content volume should
control the initial multiline height. Primer makes block width explicit, while Fluent says
to size for expected content; together they support Area's contained default and explicit
full-width layout. Primer and Fluent expose resize policy rather than forcing it into one
fixed visual treatment. Geist's three sizes directly support retaining Area's current
sm/md/lg range rather than copying Input's five outer-height tiers onto a control whose
height comes from rows.

## Source-to-decision union ledger

| Source capability | Sources | Area decision |
| --- | --- | --- |
| Native multiline plain text | Primer, shadcn/ui, Fluent, Geist, HTML | **Core.** Preserve `<textarea>`, native value/events/ref, and textbox semantics. |
| Permanent label, description, validation message, required | Primer, shadcn/ui, Fluent, Geist, Notion | **Core through Field.** Textarea paints state; Field owns durable copy and relationships. |
| Small/medium/large | Geist | **Core.** Retain Area's three type/padding tiers; multiline height stays independent. |
| Character/default width plus block/full width | Primer; Fluent expected-volume guidance | **Core.** Contained 16rem default plus explicit `fullWidth`. |
| Rows/content-volume sizing | Primer, Fluent, Geist, HTML | **Core.** Four-line no-rows default; explicit native rows wins. |
| Both/horizontal/vertical/none resize | Primer, Fluent, CSS | **Core.** Explicit `resize`; vertical preserves Area's existing default. |
| Contrast/inset treatment | Primer | **Optional.** `soft` provides a quieter surface while retaining an affordance. |
| Disabled and read-only | Geist, HTML | **Core.** Keep native semantic distinction and separate paint. |
| Error and success validation | Primer, shadcn/ui, Geist | **Core.** Error/success paint, with explanation in Field. |
| Warning validation | Area Field/Input contract | **Core.** Completes one shared form-validation vocabulary. |
| Content-based/auto-growing height | Primer, shadcn/ui | **Defer/separate composition.** Needs limits, controlled updates, scroll behavior, and enlargement tests. |
| Character limit/counter | Primer, HTML `maxlength` | **Separate composition.** Native `maxLength` is forwarded; a visible/live counter needs an announcement policy. |
| Inline error-string prop | Geist | **Reject.** Field already owns message placement and ARIA relationships. |
| Button beside or inside textarea | shadcn/ui and product composers | **Separate composition.** Actions add tab order, labeling, submit policy, and compound geometry. |
| Long-answer product mode | Notion | **Reflected by Textarea boundary.** It is not another visual variant. |
| Component properties | Figma | **Reflected by orthogonal props.** It is not a Textarea appearance. |
| Chat composer behavior | OpenAI | **Unavailable/separate.** No public reusable contract; attachments, send behavior, and auto-grow are composite work. |

## Geometry

Measurements used built docs in Chromium at a 1280×720 CSS-pixel viewport and device
pixel ratio 2. The default profile was Geist type, light theme, neutral neutral, blue
accent, outlined surface, 8px radius, and standard contrast. Every specimen used the
component width token: 256px (`16rem`) in a roomy container, with `max-inline-size: 100%`.
The explicit full-width specimen painted 320px.

Three-row size specimens painted as follows. Padding is equal on all four sides; rows and
native editing metrics determine block height.

| Size | Default: height; type/leading; padding | Compact: height; type/leading; padding |
| --- | --- | --- |
| sm | 72px; 13/18px; 8px | 66px; 12/16px; 8px |
| md | 86px; 14/20px; 12px | 76px; 13/18px; 10px |
| lg | 86px; 14/20px; 12px | 86px; 14/20px; 12px |

The default md Textarea without `rows` painted 256×106px, exactly four 20px lines plus
12px padding on both sides and two 1px edges. Explicit `rows={2}` painted 66px and
`rows={3}` painted 86px. Field-wrapped and standalone no-rows Textareas both painted
256×106px. Native text metrics remain browser-managed; this audit does not claim identical
caret or glyph placement across engines.

Radius is capped against the size tier's single-line control height, not the full multiline
box. This prevents the pill preset from turning a 106px-high editor into a capsule while
preserving the same radius-axis meaning as adjacent controls.

| Preset | Default sm / md / lg | Compact sm / md / lg |
| --- | --- | --- |
| 0 | 0 / 0 / 0px | 0 / 0 / 0px |
| 8 | 8 / 8 / 8px | 8 / 8 / 8px |
| 12 | 11.2 / 12 / 12px | 9.6 / 11.2 / 12px |
| pill | 14 / 16 / 20px | 12 / 14 / 16px |

The meaningful lower bound is 0px. The useful upper bound is the pill cap derived from
the corresponding control tier; it is intentionally far below half the multiline height.
At compact sm, the 10px and 12px numeric presets collide at the 9.6px cap. No tested
radius clipped text, focus, scrollbar, or the native resize handle.

## Accessibility and interaction

The native element keeps its implicit `textbox` role, multiline value, platform editing,
selection, undo, input-method handling, form submission/reset, and keyboard behavior.
Area does not intercept Enter, Escape, arrows, clipboard shortcuts, or typing. The ref
targets the native textarea.

Field supplies the visible label and combines description and validation IDs through
`aria-describedby`; errors also use `aria-errormessage` and `aria-invalid`. Standalone
docs specimens use `aria-label`. Placeholder text is supplementary and never the only
durable instruction.

Read-only values remain focusable, selectable, copyable, and submitted. Disabled values
are not focusable or submitted and lose the resize affordance. Native `required`,
`minLength`, `maxLength`, `autoComplete`, `name`, `form`, `value`, `defaultValue`, and
events pass through.

Validation is not color-only when used as documented: Field supplies a textual message.
Standard mode uses the semantic 1px edge and same-context 2px halo. Increased contrast
adds the opaque 2px focus outline and expands the halo to 4px. Forced colors restores a
CanvasText edge and Highlight focus, and error uses a dashed required edge.

Logical inline sizing and native text direction support RTL. The component clamps to its
container rather than producing horizontal page overflow. Horizontal/two-axis resize are
explicit because they can create page reflow; `none` is documented only for a surface
that cannot safely grow.

## Candidate decisions

### Core

- **Native Textarea boundary.** Every reusable benchmark and the platform use native
  multiline text semantics; Area keeps that complete behavior for free.
- **Contained/default and full-width layout.** Primer makes block width explicit and
  Fluent sizes to expected content. A 16rem default matches Input and Field; `fullWidth`
  handles long responses and responsive form columns deliberately.
- **Four-line default and native rows.** Primer, Fluent, and Geist all connect height to
  expected volume. Four lines is useful without pushing common actions as far as Primer's
  seven-line default; an explicit rows value remains authoritative.
- **Three sizes.** Geist documents small/medium/large and Area already had these tiers.
  Five outer-height names would imply distinctions multiline Textarea does not own.
- **Resize policy.** Primer and Fluent publish this as component behavior. Area keeps its
  existing vertical default and supports the platform directions without JavaScript.
- **Disabled, read-only, and validation states.** These are semantic distinctions shared
  with Field and Input, not visual aliases.
- **Radius cap by tier.** It preserves the radius axis without allowing a multiline box to
  become a pill-shaped container.

### Optional

- **Soft treatment.** Primer's contrast treatment supports a quieter inset surface. It
  retains a fill and hover edge; outline remains the discoverable default.

### Separate component or composition

- **Auto-grow.** Primer and current shadcn source support content sizing, but a releasable
  Area version needs min/max height, controlled/programmatic update coverage, scroll
  fallback, and browser testing.
- **Visible character counter.** Native `maxLength` remains available. Display and live
  announcement of remaining characters belongs with Field or a dedicated composition.
- **Submit/attachment/formatting actions.** These create a composite editor or composer
  with additional focus, accessible-name, and behavior contracts.
- **Rich text, Markdown, and code editing.** They need selection/formatting semantics and
  must not masquerade as a styled native textarea.

### Reject

- **Ghost Textarea.** Removing both stable fill and edge weakens the multiline affordance
  unless a separately specified group backplate owns it.
- **`error` or helper-string props.** Field already owns labels, durable guidance,
  validation text, and their relationships.
- **Automatic trim, blur validation, or submission.** These are product data policies and
  can interfere with intentional whitespace, international input, or form libraries.
- **Five Input size tiers.** Textarea size changes type/padding; rows own height. Extra
  names would produce near-identical geometry without a distinct user job.

## Final contract

React exposes or clarifies:

- `variant?: "outline" | "soft"`, default `outline`;
- `size?: "sm" | "md" | "lg"`, default `md`;
- `resize?: "vertical" | "horizontal" | "both" | "none"`, default `vertical`;
- `fullWidth?: boolean`, default `false`;
- `validationStatus?: "error" | "success" | "warning"`;
- `invalid?: boolean` as the error compatibility alias; and
- all native `TextareaHTMLAttributes`, including `rows`, `cols`, `disabled`, `readOnly`,
  `required`, `minLength`, `maxLength`, values, form attributes, events, and ARIA.

The no-rows default reserves four lines in CSS. `className` applies to the native textarea,
and the forwarded ref targets that same element.

Plain CSS users apply the manifest classes directly. They supply native and ARIA semantics
themselves; `aria-invalid="true"`, `disabled`, and `readonly` are recognized native state
adapters.

## Token decisions

Textarea receives component-scoped aliases with explicit Input fallbacks:

- `--area-textarea-bg` → `--area-input-bg`;
- `--area-textarea-bg-soft` → `--area-input-bg-soft`;
- `--area-textarea-bg-disabled` → `--area-input-bg-disabled`;
- `--area-textarea-edge` / `--area-textarea-edge-hover` → matching Input edge roles;
- `--area-textarea-text` / `--area-textarea-placeholder` → matching Input text roles;
- invalid/success/warning color and halo aliases → matching Input validation roles; and
- `--area-textarea-inline-size` → `--area-input-inline-size` (16rem).

These aliases have stable meanings and real base-rule consumers, but allow a product to
tune multiline fields without repointing every Input. Required validation edges resolve to
the vivid semantic roles already asserted at 3:1 across every supported surface and theme.
The translucent halo remains supplemental paint and is not credited as the required edge.
No palette value, axis ownership, or contrast threshold changes.

No token is added for rows: row count is native content geometry. No auto-grow or counter
token is added before those behaviors have a complete component contract.

## Implementation

- Updated Textarea CSS and the shared manifest with treatment, width, resize, state, and
  radius contracts.
- Updated the React wrapper to forward the new orthogonal props, preserve native props/ref,
  bridge Field validation status, and emit accessible invalid state.
- Added Textarea-scoped semantic aliases that inherit the tested Input roles.
- Expanded real React demos, snippets, API reference, practices, Field composition, and
  gallery-compatible contained layout.
- Updated forced-colors invalid matching for both React's data adapter and plain
  `aria-invalid="true"` markup.

The default width changes from available-width to 16rem; consumers needing the previous
layout add `fullWidth` or `area-textarea--full-width`. A Textarea without `rows` now reserves
four lines. Existing explicit rows values, including the prior docs' `rows={3}`, retain
their native height. Existing `size`, `invalid`, native props, ref, and vertical resize
behavior remain compatible.

## Verification

Verification completed for the audited source and built docs:

- `npm run lint:manifest -w @area/styles` — 36 manifests passed parity;
- `npm run typecheck` — tokens, styles, React, and docs passed;
- `npm run build:docs` — 47 pages and 142 real React demos built; dogfood passed;
- `npm test` — 9 files and 18,104 token/contrast tests passed;
- `node packages/tokens/src/contrast/report.ts` — 344 assertions passed across 66 themes;
- `npm run test:contracts` — 13/13 manifest and preference contracts passed;
- `npm run audit` — all 36 components were used and docs raw-value checks passed;
- `npm run test:consumer` — declarations, runtime variants, SSR, browser bundle, CSS,
  and tree shaking passed; helper 1,417 bytes and Button 2,236 bytes with React external;
- `git diff --check` — passed; and
- browser inspection covered the built Textarea page at default/compact UI scale,
  light/dark themes, radius 0/8/12/pill, three sizes, contained/full width, explicit rows,
  treatments, validation, read-only/disabled, Field composition, and resize-none behavior.

Chromium used a 1280×720 CSS-pixel viewport at device-pixel ratio 2. In dark standard mode,
the focused invalid Textarea painted an opaque `rgb(254, 176, 179)` edge and the same color
at 14% alpha in a 2px halo, with no opaque outline. The no-rows default, Field-wrapped
default, explicit rows, and full-width measurements matched the declared contract.
The increased-contrast fixture painted a 2px opaque accent outline and 4px halo, and its
keyboard-focus matrix passed 21,120 checks with zero failures.

## Remaining limits

- No public reusable OpenAI, Notion, or Figma Textarea API/dimensions were available; their
  product/authoring guidance was not promoted into a component specification.
- Chromium was inspected. Firefox, WebKit, Windows forced colors, mobile virtual keyboards,
  and screen-reader/browser pairings remain release checks.
- The in-app browser did not expose viewport or 200% zoom controls. Authored contained and
  320px cases, compact scale, long values, and the shared contrast fixture passed, but
  exact 320-CSS-pixel viewport and 200% zoom inspection remain release checks.
- Native resize handles, scrollbar paint, caret placement, and intrinsic rows geometry vary
  by browser and operating system.
- Auto-grow, character counter, and composer/editor behavior remain intentionally pending
  their own complete behavior audits.
