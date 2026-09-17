# Token audit — 2026-09-16

## Decision summary

Area **Token** is now the optional colour-swatch composition of the shared **Code** inline
reference treatment. It is deliberately not Primer's selectable/removable object token. That
separate job belongs to a future TokenInput/Tag composition, where selection, removal,
keyboard navigation, overflow, and value management can be implemented completely.

This audit clarifies the boundary in CSS, React, docs, and the shared manifest, adds
stable component theming aliases, softens the edge to the decorative-edge role, and makes
the examples one ordinary treatment per preview container. Code and Token share one relative
24px inline size; Token adds only the optional swatch. The renamed manifest key is `token`;
`tokenChip` was an internal inconsistency, not public API.

## Current Area contract

Before this audit, Token was a React `span` and framework-free `.area-token` block with
`swatch`, `subtle`, and `onColor` props/classes. It used `0.875em` mono text, had no
interactive behavior, and was documented as a “badge” even though Badge, Chip, Code, and
Kbd own different semantic jobs. The manifest's internal key was `tokenChip` while the
public component and page were Token. The swatch and base label were already separate
slots, but the documentation combined unrelated specimens in the swatch and subtle
previews.

The resulting contract is a static `code` element that shares `.area-code`, plus an optional
`area-token__label` and `area-token__swatch`. It is one contained inline item. `subtle` is an appearance for a
derived alias; `onColor` is an appearance for an inherited coloured context. Neither
changes semantics or behavior.

## User jobs and non-goals

Token lets documentation, specifications, changelogs, and comments name a design token
while optionally showing its current colour resolution. It must stay compact in prose and
tables, inherit themes, clip only by the surrounding layout, and never imply that the
reference can be selected or dismissed.

It is not a shortcut (Kbd), status/metadata (Badge), a selectable filter (Chip), an editable
tokenized input, a removable value, or a generic leading-icon container. Those jobs have
different accessibility and interaction contracts. Literal source and a design-token name
are intentionally the same Code treatment.

## Evidence ledger

All sources were accessed 2026-09-16. Evidence levels follow the audit framework.

| System or source | Level | Evidence used |
| --- | --- | --- |
| [Primer Token](https://primer.style/product/components/token/) | A | Defines Token as compact object metadata, with remove, interactive, leading visual, selection, and four size options; its documented contract is an interactive/value-token boundary. |
| [shadcn/ui Badge](https://ui.shadcn.com/docs/components/base/badge) | A | Keeps badge variants, icons/spinner, and link rendering in a Badge boundary rather than a code-token reference. |
| [Fluent 2 Tag](https://fluent2.microsoft.design/components/web/react/core/tag/usage) | A | Distinguishes a selected value that can be dismissed or acted on from a system-generated Badge; documents reflow and overflow as interaction concerns. |
| [Vercel Geist Code](https://vercel.com/geist/code) | A | Published Code is the nearest reusable boundary for short literal source; it does not establish an interactive tag contract. |
| [Notion help](https://www.notion.com/help) | B | No reusable Token or inline-code component contract was found. Product patterns were not used to infer an API. |
| [Figma component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties) | A | Supports orthogonal boolean/text/instance properties for a reusable component. No published Figma Token component contract or dimensions were found. |
| [OpenAI Help Center](https://help.openai.com/) | B | No public reusable Token/Tag component specification was available. Product UI was not used to infer an API. |

## Benchmark comparison

| System | Boundary and name | Variants, composition, and behavior | Dimensions |
| --- | --- | --- | --- |
| Area before | Token, static design-token name | Optional swatch; subtle/on-color appearance; no interaction | Relative 0.875em inline badge |
| Primer | Token, object metadata | Leading visual, selection, button/link, removal, small–xlarge; IssueLabelToken is separate | Four documented size choices |
| shadcn/ui | Badge | Visual variants, icons/spinner, optional link rendering | Consumer-composed |
| Fluent 2 | Tag / InteractionTag | Selected value; optional dismissal, one primary action, wrapping/overflow | Extra-small/small/medium spacing guidance |
| Geist | Code | Literal code boundary | Published code component; no Token equivalent found |
| Notion | Unavailable | No reusable contract verified | Unavailable |
| Figma | Component-property guidance | Properties/slots guidance, no Token contract | Unavailable |
| OpenAI | Unavailable | No reusable contract verified | Unavailable |

Primer's same-named component and Fluent's Tag solve a different user job: object/value
selection. Their remove, selection, size, and leading-visual capabilities are preserved in
Area's decision ledger as a separate future composition rather than misapplied to a static
design-token reference.

## Geometry

Measurements were taken from the built Chromium documentation page at a 1159×798 CSS-pixel
viewport, device-pixel ratio 2, light/neutral/blue/default UI scale/8px radius/outlined
surface. Standard Code and a Token without a swatch have the same 14px mono type, 18.9px
line height, and 24px painted outer height. A Token with a swatch remains 24px high; its
swatch is 14×14px with a 4px gap and equal 5px outer inset
on every side. Intrinsic width follows the
name: `--area-space-16` measured 138px; the colour-swatches `--area-accent-solid`
measured 189.63px.

The shared inset formula sets a swatch Token's `--_token-height` to `1em + --area-space-10`;
because the
component's `0.875em` type follows its surrounding text, there is no independent default
or compact size ramp to measure. It clamps to `max-inline-size: 100%` and intentionally
does not grow to a preview/container width. Long names are a documentation-content
constraint: keep semantic names readable rather than turning a static inline token into a
wrapped interactive chip.

Radius lower bound is the system's sharp `0px` preset. Its upper bound is the pill preset,
with the painted corner capped by the token's own half-height; no content clips. The swatch
radius is `max(0, token radius − space-2)`, so its corners remain concentric at every
non-sharp preset and floor safely at zero.

## Accessibility and interaction

Token renders as a non-focusable `span`; its text is exposed directly to assistive
technology and the swatch is `aria-hidden`. It has no click, remove, selection, roving
focus, overflow, or value-change behavior. This is intentional: adding any of those would
require a real button/tag or a tokenized-input composite with keyboard, focus restoration,
announcement, and overflow contracts.

The static inline element inherits document direction; no directional visual is present.
It has no motion. The semantic aliases inherit theme and contrast scopes. The swatch ring
uses a context-safe low-alpha inset edge for pale samples; the visible token name uses the
existing readable default foreground role.

## Candidate decisions

### Core

- **Static Token with optional colour swatch.** This is Area's documented design-token
  reference job, and a swatch directly supports that job without adding behavior.
- **`subtle` and `onColor` appearances.** They are persistent, orthogonal visual contexts
  that CSS can support across themes without changing Token's static semantics.
- **Shared relative inline geometry.** A documentation reference must fit surrounding prose
  and table roles. One 24px Code treatment is more coherent than competing inline badges.
- **Token-scoped semantic aliases.** Stable component roles let a documentation product
  add the swatch context without changing Code, Badge, or Chip.

### Separate component or composition

- **Selectable/removable/interactive token, `onRemove`, selected state, action, overflow,
  and reflow group.** Primer and Fluent support these for picked object values. Area needs
  an audited TokenInput/Tag composition with complete interaction before exposing it.
- **Leading generic icon.** Primer permits one for object metadata; Area's swatch is the
  only meaningful Token visual. Generic visuals belong with Badge, Chip, or Tag.
- **Custom fill label.** Primer's IssueLabelToken is a semantic label/status boundary; in
  Area use Badge tone or a later label component.

### Reject

- **Size prop.** It would compete with the surrounding type role and make inline
  documentation density inconsistent. Token's relative formula is the established local
  geometry contract.
- **Ghost/soft aliases beyond `subtle`.** They do not express a distinct Token job; the
  existing subtle and on-color contexts cover the useful durable treatments.

## Final contract

`TokenProps` retains:

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `swatch` | `string` | — | CSS `var()` to sample ahead of the token name. |
| `subtle` | `boolean` | `false` | Quieter derived-alias appearance. |
| `onColor` | `boolean` | `false` | Inherit the surrounding coloured context. |

Framework-free classes are `.area-token`, `.area-token__label`,
`.area-token__swatch`, `.area-token--subtle`, and `.area-token--on-color`. `Token` keeps
its common public name because it accurately describes a design-token reference inside
Area; the audit explicitly distinguishes it from the different public Token of Primer.

Documentation order is now Default, appearance treatments, swatch composition, then prose
placement. Each normal preview contains one treatment only. No size preview exists because
Token does not own a size axis.

## Token decisions

The component consumes the following aliases from `derivedTokens()`:

| Alias | Fallback | Consumer |
| --- | --- | --- |
| `--area-token-bg` | `--area-bg-code` | Token base fill |
| `--area-token-bg-subtle` | `--area-bg-subtle` | `subtle` fill |
| `--area-token-edge` | `--area-border-decorative` | Token base edge |
| `--area-token-text` | `--area-fg-default` | Token name |
| `--area-token-swatch-ring` | 15% `token-text` mix | Swatch inset ring |

`onColor` intentionally uses local `currentcolor` mixes instead of a global alias: the
surrounding component owns its foreground context. These aliases are derived and are not
registered with `@property`, so nested axis scopes continue to resolve them live. The text,
background, and edge roles reuse contrast-gated semantic endpoints; no new raw palette
value or weakened threshold was introduced.

## Implementation

- `packages/tokens/src/emit/base.ts` adds Token's scoped theme aliases.
- `packages/styles/src/components/token.css` consumes those aliases and states the static
  boundary directly.
- `packages/styles/src/manifest.ts` changes the internal manifest export/key from
  `tokenChip` to `token` for consistency with the public component.
- `apps/docs/src/demos/display.tsx`, `apps/docs/src/pages.mjs`,
  `apps/docs/src/practices.mjs`, and `docs/DESIGN_SYSTEM.md` make the component boundary,
  examples, and documentation source of truth agree.

There is no public React breaking change. The internal manifest key is only referenced by
the Area docs and is updated there in the same change.

## Verification

- `npm run build:docs` passed: package builds, manifest parity **36 components**, docs
  **47 pages / 130 demos**, and dogfood audit passed.
- `git diff --check` passed before the checkpoint verification suite.
- Built Chromium Token page was inspected at the measurement viewport; default, subtle,
  on-color, swatch, and prose previews render as separate containers.

## Remaining limits

Token's native static behavior needs no keyboard test, but future TokenInput/Tag work must
be audited as a separate behavioral family and cover removal, selection, wrapping,
overflow, keyboard traversal, announcements, RTL, touch targets, and screen-reader
semantics. Browser checks here are Chromium only; Safari/Firefox typography metrics remain
system-wide validation work.
