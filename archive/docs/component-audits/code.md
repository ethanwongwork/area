# Code audit — 2026-09-17

## Decision summary

Area now documents one inline **Code** primitive for literal source and design-token names.
Its optional `swatch` composition makes a colour token legible without turning it into a
badge or interactive object token. The former public `Token` React export remains a
deprecated compatibility alias, but its standalone docs page is removed; new usage is
`Code`, optionally with `swatch`, `subtle`, or `onColor`.

## Current Area contract

The `code` manifest has `on-color` and `subtle` ground variants, a `swatch` boolean, and
`swatch`/`label` elements. `Code` forwards attributes and a ref to native `<code>`. It is
inline, relative to surrounding type, intrinsic-width, and non-interactive. A swatch adds a
decorative square before the label. Legacy `Token` composes Code with its former classes and
aliases, preserving existing imports and themes while Code is the documented public name.

## User jobs and non-goals

Use Code for short source, commands, API names, or a design-token name in prose, tables, and
specifications. Add a swatch only when a colour token's current resolution provides useful
context. Use Code block for multiline source, Kbd for keys, Badge for status, and a future
Tag/TokenInput for selected or removable values. Code is not clickable, dismissible, an
editor, a syntax highlighter, or a general icon container.

## Evidence ledger

Sources accessed 2026-09-17; levels follow the audit framework.

| Benchmark | Evidence and level | Finding used |
| --- | --- | --- |
| Area | Source, manifest, docs, Chromium inspection — A | Static native Code; relative inline geometry; Token already shared its base class. |
| OpenAI | [Help Center](https://help.openai.com/) — B | No reusable public Code specification available. |
| Notion | [Help Center](https://www.notion.com/help) — B | Product code content exists, but no reusable inline-Code API was verified. |
| Primer | [Token](https://primer.style/product/components/token/) — A | Token is object metadata with interaction/removal, a different job. |
| shadcn/ui | [Components](https://ui.shadcn.com/docs/components) — A | No standalone Code contract is published. |
| Fluent 2 | [Tag usage](https://fluent2.microsoft.design/components/web/react/core/tag/usage) — A | Tags are selected/removable values, not inline source. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties) — A | Boolean visibility and text/instance slots support an optional decorative swatch. |
| Vercel Geist | [Code](https://vercel.com/geist/code) — A | Short literal source is a Code boundary, not a tag or status component. |

## Benchmark comparison

| System | Boundary | Composition / behavior | Size and layout |
| --- | --- | --- | --- |
| Area | Static inline Code | Optional swatch; subtle/on-color; native semantics | Relative 0.875em mono, intrinsic width |
| OpenAI | Unavailable | Unavailable | Unavailable |
| Notion | Product code content | No reusable public API | Unavailable |
| Primer | Interactive object Token | Visual/action/removal/selection | Multiple Token sizes |
| shadcn/ui | No standalone Code | Consumer-composed styling | Unavailable |
| Fluent 2 | Tag / InteractionTag | Selection, action, dismissal | Tag-specific sizing |
| Figma | Property guidance | Boolean/slot composition | Unavailable |
| Geist | Code | Literal source | Inline source treatment |

## Geometry

At default UI density Code is `0.875em` mono (14px in normal docs body), with an 18.9px line
box and a 24px painted plate. It is content-sized with `max-inline-size: 100%`; it has no
control-size family. Compact density does not change the surrounding body role, so relative
geometry is identical. A swatch composition remains 24px tall: 14px square, 4px gap, and
5px outer inset. Long source follows inline formatting; Code block owns multiline wrapping.

The lower radius bound is `sharp`/0px. Standard uses the shared small radius; the upper
bound is the half-height cap under `pill`, which does not clip the swatch or label. The
swatch radius is outer radius less actual inset, floored at zero, preserving concentric
corners. The swatch is a named direct content slot, not a glyph nudged in an icon lane.

## Accessibility and interaction

Native `<code>` text is exposed directly and is not focusable. A swatch is `aria-hidden`,
so the accessible name remains the source/token string. There are no keyboard, pointer,
loading, selected, disabled, popup, or motion states. `onColor` inherits its surrounding
foreground; default and subtle use semantic aliases. Forced-colors and increased contrast
inherit the system semantic foreground and edge behavior. At zoom, narrow widths, long
localized names, RTL, light/dark, and both densities, text must stay readable and the
swatch must not clip. Interactive picked values remain explicitly out of scope.

## Candidate decisions

| Candidate | Decision | Rationale |
| --- | --- | --- |
| One Code name for source and token names | Core | Both are static source-like references; Area already shared their geometry. |
| Decorative colour swatch | Optional | One clear documentation job; remains hidden from AT. |
| `subtle` and `onColor` | Core | Persistent CSS-only context treatments. |
| Legacy `Token` export | Separate compatibility path | Avoids an unnecessary breaking change. |
| Interactive/removable token | Separate | Primer/Fluent patterns need Tag/TokenInput behavior. |
| Size prop, full width, generic icons | Reject | Conflict with inline geometry or dilute swatch meaning. |
| Syntax highlighting/editor behavior | Separate | Code block/editor own parsing and selection behavior. |

## Final contract

`CodeProps` is `HTMLAttributes<HTMLElement>` plus `children`, optional `swatch`, `subtle`,
and `onColor`. It renders `<code class="area-code">`; modifiers are
`.area-code--swatch`, `.area-code--subtle`, and `.area-code--on-color`; named elements are
`.area-code__swatch` and `.area-code__label`. Props and `HTMLElement` ref forward. Default
is plain Code. `Token` retains its old props/classes only as a compatibility alias, not a
distinct documented component or source of new API work.

## Token decisions

No global token is added. Code consumes `--area-bg-code`, `--area-border-code`, and
`--area-fg-code`. Legacy Token maps `--area-token-bg`, `--area-token-edge`, and
`--area-token-text` to Code local slots; its swatch ring remains an inset readable-text mix.
This keeps theme-axis resolution live and required contrast pairs in the existing gate. A
Code-only colour alias is rejected because the current semantic roles cover the job.

## Implementation

- `packages/react/src/components/primitives.tsx`: adds Code swatch/treatment props and
  retains Token as a compatibility wrapper.
- `packages/styles/src/components/token.css`, `packages/styles/src/inset.css`, and
  `packages/styles/src/manifest.ts`: expose the Code composition and preserve legacy CSS.
- `apps/docs/src/pages.mjs` and `apps/docs/src/demos/gallery.tsx`: make Code the single
  public page and remove the duplicate Token page.

Migration: replace `Token` with `Code`; replace `<Token swatch={value}>name</Token>` with
`<Code swatch={value}>name</Code>`. The old export remains supported during the
compatibility window.

## Verification

Passed on 2026-09-17: `npm run build:docs` (including manifest parity and dogfood audit),
`npm run lint:manifest -w @area/styles`, `npm run typecheck`, `npm run test:consumer`,
`node --test apps/docs/scripts/axis-preferences.test.mjs`, `npm test` (18,104 tests),
`node packages/tokens/src/contrast/report.ts` (344 assertions across 66 themes), and
`git diff --check`.

Fresh Chromium inspection at `http://localhost:4322/code.html?audit=consolidated-code`
verified that the first live specimen is literal source, the new swatch composition is
available on the same page, and Token is absent from the public sidebar. The matching Nav
inspection confirmed the lighter, non-bold current state and the audited-component marker.

## Remaining limits

OpenAI and Notion do not expose a reusable public Code contract, and shadcn/ui has no
standalone Code component for a closer comparison. Chromium is the only inspected browser;
Safari/Firefox font metrics and AT reading remain release checks. Interactive TokenInput/Tag
and Code block are separate future audits.
