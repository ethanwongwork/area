# Code spec

**Status:** accepted · 2026-09-26 (spec written in the cohesion audit; accepted earlier; subtle-ground fix since)
**Captures:** `docs/research/captures/code/`
**Peers:** Kbd (keycap in the same table cell), Token (deprecated alias with a swatch),
Code block (block form), Badge (compact label on a fill)

## Owner decisions

No Code section existed in [prior decisions](PRIOR_DECISIONS.md). The family was accepted
(Complete) before the audit; the audit confirmed it without change. The job split is
recorded in [the design system guide](../DESIGN_SYSTEM.md#icons-and-technical-labels): Code
marks identifiers and inline source, Token is its swatch compatibility composition.

## Job and boundaries

Code marks a literal (an identifier, a command, a token name) inside prose or table chrome,
optionally with a colour swatch. It is not a keyboard shortcut (Kbd), a status label
(Badge) or a block of source (Code block).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| ground (`ground` prop) | default (unset) | Inline reference on a page | Gallery `default`, `prose`, `table` |
| ground | subtle | Quieter derived reference | Gallery `treatments` (#f7f7f7 since the audit fix) |
| ground | on-color | On a coloured ground, ink inherited | Gallery `on-color` |
| swatch | boolean | A token that resolves to a colour | Gallery `swatch` |

One contextual size: 0.875em of the surrounding text, so it is 14px in 16px prose and
12.25px in 14px table cells (`area--table`). No size axis.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Inline code in prose | `styles/typography.css:235-243` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | — |
| area | this system | Six gallery tiles, re-taken after the second pass | localhost gallery | — | `area--*` (6) |
| notion | target product | No inline code captured; the nearest chrome is the shortcut keycap (Kbd's evidence) | app.notion.com, second pass 2026-09-26 | evidence only | `kbd/notion--shortcut-hint--rest--light` (peer only) |
| figma | target product | No inline code in the surfaces captured | figma.com, second pass 2026-09-26 | evidence only | — |

Target products searched without inline code: ChatGPT renders it only inside a
conversation's messages, and opening one would change the owner's data. Notion's second
pass covered the sidebar, page menu, Share popover, the "tasks" board and the "returns"
table: no page with inline code was opened. Figma's covered the file browser and the
editor's inspector, layers and menus, which show no inline code. Untitled UI remains the
only measured reference.

## Anatomy

```
uui    code  radius 6, padding 2 × 6, 14/20 700, neutral-50 fill, neutral-200 ring (inset)
area   code.area-code  display inline, 1px border + padding 2 × 5, radius min(small, cap)
       box-decoration-break clone, so a wrapped reference keeps both ends
  swatch  span.area-code__swatch  1em square, radius small − 2 (token.css:35-42)
  label   span.area-code__label    cap-trimmed, ellipsis (inset.css:152-165)
```

Inset equation: inline 1 border + 5 padding = 6 (`code.css:149`); block 1 + 2 = 3. Untitled
draws its edge as an inset ring inside a 2 × 6 padding, so its outer inset is 2 × 6.
Swatch composition: height 1em + 10 = 24; swatch start (24 − 14) / 2 − 1 = 4 and label end
(24 − 1cap) / 2 − 1 = 6.03 (`token.css:31`, `inset.css:200-213`).

## Measurements

`node scripts/capture-compare.mjs` (trimmed):

| slot · property | area · default | area · treatments | area · on-color | area · swatch | area · prose |
|---|---|---|---|---|---|
| **shell** size | 45.6 × 24.9 | 45.6 × 24.9 | 45.6 × 24.9 | 189.63 × 24 | 215.99 × 48 |
| **shell** padding | 2 5 2 5 | 2 5 2 5 | 2 5 2 5 | 0 6.03 0 4 | 2 5 2 5 |
| **shell** border | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid oklab(0.999994 0.0000455678 0.0000200868 / 0.2) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) |
| **shell** radius | 6px | 6px | 6px | 6px | 6px |
| **shell** font | 14px/18.9px 400 "Geist Mono" | 14px/18.9px 400 "Geist Mono" | 14px/18.9px 400 "Geist Mono" | 14px/18.9px 400 "Geist Mono" | 14px/18.9px 400 "Geist Mono" |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(255, 255, 255) | rgb(40, 40, 40) | rgb(40, 40, 40) |
| **shell** background | rgb(250, 250, 250) | rgb(247, 247, 247) | oklab(0.999994 0.0000455678 0.0000200868 / 0.08) | rgb(250, 250, 250) | rgb(250, 250, 250) |

In a 14px table cell: 12.25px/16.54px, 22px tall (`area--table`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · radius | min(`radius-small` 6, (1em + 10) × `radius-cap`) (`code.css:152-155`) | Untitled 6 | Capped so a small reference cannot become a pill |
| shell · inline inset | 6 incl. border (`code.css:149`) | Untitled 6 | — |
| shell · block inset | 3 incl. border | Untitled 2 (ring inside padding) | Area's edge is a real border; 1px more, 24.9px tall at 14px |
| fill | `bg-stripe` #fafafa (dark #282828), the 25 rung; was `bg-code` until the block's ground became the page (2026-09-28) | Untitled neutral-50 #fafafa | — |
| edge | `border-decorative` #f3f3f3 (`code.css:141`) | Untitled neutral-200 #e5e5e5 | Area's decorative seam role; lighter. Kept (third pass): the token has a fill, so its edge is a seam, not a rule |
| text · size | 0.875em (`code.css:174`) | Untitled 14 in 16px prose | Relative so one reference reads right in prose and in 14px chrome |
| text · leading | 1.35 (`code.css:175`) | Area's own | Untitled 20px; a unitless tight leading keeps lines from spreading |
| text · weight / face | 400 `font-mono` | Type ramp (400 for text) | Untitled 700 in the body face |
| shadow | none (`code.css:159`) | Area's own | An inline reference is never elevated |
| subtle ground | `token-bg-subtle` #f7f7f7 (`token.css:46-50`) | Area's own | Was a no-op until the audit fix (Verification) |
| on-color | 8% / 20% of `currentcolor` fill / edge, ink inherited (`token.css:52-57`) | Area's own | — |

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. Edge ink: kept at `border-decorative` #f3f3f3 against Untitled's neutral-200 #e5e5e5.
   The token has a fill, so its edge is a seam, not a rule.

## States

None. Code is not interactive.

## Behavior and accessibility

Native `code` element; the swatch is `aria-hidden` (`primitives.tsx`, `Code`). Code and Token
take `ground="subtle" | "on-color"`, the manifest's axis as a prop; the `subtle` and `onColor`
booleans are deprecated aliases. Forced colours:
no Code-specific rule; the border keeps the box visible.

## Peers and consistency

| Peer | Shared role | Peer value | Code | Match |
|---|---|---|---|---|
| Kbd | small inline chrome | since the second pass a filled keycap: `bg-component-active` fill, no drawn edge, radius `control-xs`, muted 500 ink (`kbd.css:25-36`), after Notion's shortcut hint | 22px in a table cell, radius 6, edge #f3f3f3, fill #fafafa, 400 default ink | differ by role: a key is a filled label, a reference is outlined running text |
| Token | swatch composition | same rule (`token.css`) | same | match |
| Code block | code ground | `bg-code` | `bg-code` | match |
| Badge | label on a fill | 500 weight | 400 | Code is running text, not a label |

## Visual pass

The gallery shows Code in Default and Content (treatments, on-color, swatch, prose, table)
groups.

2026-09-28 (batch 22), live in Claude in Chrome: ChatGPT's inline code in an assistant paragraph
(`chatgpt--inline-code`, first product capture): a span at 0.92em (14.72 in 16/26 prose),
ui-monospace 400, padding 1 / 6, corner 6, a 9% black fill (about #e9 on white), no edge, 19
tall. Area in the gallery: 0.875em (14), padding 2 / 5 plus a 1px #f3 edge (3 / 6), corner 6,
#fa fill, 25 tall at 14px. Size, corner and inline inset match; Area's ground is lighter and
edged (the owner prefers lighter colours; the edge keeps it visible on white). No change.
Unverified: dark theme, forced colours.

## Verification

- 6 Area captures (re-taken after the second pass) compared above; Untitled from source only.
- Build and test results: see [the audit](../research/cohesion-audit.md#verification).
- The subtle-ground defect found while writing the first spec is fixed: `.area-code--subtle`
  now sets `--_code-bg` as well as `--_token-bg` (`token.css:44-50`), and `area--treatments`
  paints rgb(247, 247, 247) against the default's rgb(250, 250, 250).

## Feedback log

- 2026-09-26 · cohesion audit → no change; confirmed against Untitled UI's inline code
  (radius 6, 6px inline inset, #fafafa fill) → `area--*` captures.
- 2026-09-26 · audit fix → `<Code subtle>` paints its own ground (was the default's) →
  `area--treatments`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence
  searched, none found for inline code; no change; edge ink recorded as an open question →
  `area--*` re-captures.
- 2026-09-27 · third pass → open question settled, value kept: edge stays `border-decorative`
  → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: audit against other design systems → [survey](../research/skeleton-spinner-code-slider-survey.md):
  no change. 0.875em sits between Primer / antd (85%) and Radix (0.9025em); weight 400 matches
  most; only Untitled and antd draw a border. Open: em-based padding so inline code scales in
  headings (Primer, antd, Radix). Claude in Chrome capture of ChatGPT's inline code pending
  (the window was in the background).
- 2026-09-30 · audit S17 (owner: normalise the API vocabulary) → Code and Token take `ground: "subtle" | "on-color"`; the `subtle` / `onColor` booleans are deprecated aliases.
