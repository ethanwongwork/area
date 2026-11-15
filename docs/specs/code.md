# Code spec

**Captures:** `docs/research/captures/code/`
**Peers:** Kbd (keycap in the same table cell), Token (deprecated: use `<Code swatch>`, audit H-25),
Code block (block form), Badge (compact label on a fill)

## Owner decisions

No Code section existed in [prior decisions](PRIOR_DECISIONS.md). The family was accepted
(Complete) before the audit; the audit confirmed it without change. The job split is
recorded in [the design system guide](../DESIGN_SYSTEM.md#icons-and-technical-labels): Code
marks identifiers and inline source; Token, its swatch composition, is deprecated in favour of
`<Code swatch>` (audit H-25 A, owner 2026-09-30).

## Job and boundaries

Code marks a literal (an identifier, a command, a token name) inside prose or table chrome,
optionally with a colour swatch. It is not a keyboard shortcut (Kbd), a status label
(Badge) or a block of source (Code block).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| — | default | Inline reference on a page | Gallery `default`, `prose`, `table` |
| subtle | boolean | Quieter derived reference | Gallery `treatments`, titled Subtle since round 81 (#f7f7f7 since the audit fix) |
| on-color | boolean | On a coloured ground, ink inherited | Gallery `on-color` |
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

**Current (2026-11-13, one mark).** Inline Code is an inline chip on the one mark recipe (inset.css, "One mark"; plan B5.1): its block padding is (1lh − 1.3em) / 2 less the border, so its plate is its line box (18 on a 13/18 line; was 21.38); side (1lh − 6) / 2 from the outer edge, 6 on an 18 line; corner the chip role, radius-small, at most half its line (6 at the default Corner 10, square at Corner 0).

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
| fill | `token-bg` = `bg-well`, #f9f9f9 / #161616 at Layers 0 (was `bg-stripe`, 1.03:1 there; before that the 25 rung #fafafa); was `bg-code` until the block's ground became the page (2026-09-28) | Untitled neutral-50 #fafafa | — |
| edge | `token-edge`: `border-subtle` #e8e8e8 in light, `border-faint` in dark (emit/base.ts; code.css reads it) | Untitled neutral-200 #e5e5e5 | The edge step nearest Untitled's ring (2026-11-02); was the decorative seam #f3f3f3, which vanished on white table rows |
| text · size | 0.875em (`code.css:132`) | Untitled 14 in 16px prose; kept em-relative by owner (audit G-26 A, 2026-09-30) | Relative so one reference follows the prose it sits in (14 / 18.9 in body text, 12.25 / 16.5 in small text), off the type ramp on purpose |
| text · leading | 1.35 (`code.css:133`) | Area's own | Untitled 20px; a unitless tight leading keeps lines from spreading |
| text · weight / face | 400 `font-mono` | Type ramp (400 for text) | Untitled 700 in the body face |
| shadow | none (`code.css:159`) | Area's own | An inline reference is never elevated |
| subtle ground | `token-bg-subtle` #f7f7f7 (`token.css:46-50`) | Area's own | Was a no-op until the audit fix (Verification) |
| on-color | 8% of the ink's opposite fill (2026-10-15, for AA on the accent solids), 20% of `currentcolor` edge, ink inherited (`token.css`) | Area's own | — |

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. Edge ink: `border-subtle` #e8e8e8 (was `border-decorative` #f3f3f3 until 2026-11-02) against Untitled's neutral-200 #e5e5e5; a role rather than the literal, so it still moves with the ground under it.
   The token has a fill, so its edge is a seam, not a rule.

## States

None. Code is not interactive.

## Behavior and accessibility

Native `code` element; the swatch is `aria-hidden` (`primitives.tsx`, `Code`). Forced colours:
no Code-specific rule; the border keeps the box visible.

## Peers and consistency

| Peer | Shared role | Peer value | Code | Match |
|---|---|---|---|---|
| Kbd | small inline chrome | since the second pass a filled keycap: `bg-component-active` fill, no drawn edge, radius 6 (`radius-control-sm`, kbd.css:16-18; owner 2026-09-28), muted 500 ink (`kbd.css:25-36`), after Notion's shortcut hint | 22px in a table cell, radius 6, edge #f3f3f3, fill #fafafa, 400 default ink | differ by role: a key is a filled label, a reference is outlined running text |
| Token | swatch composition | same rule (`token.css`) | same | match |
| Code block | code ground | `bg-code`, the page white since batch 22 | `bg-well` #f9f9f9 via `token-bg` (code.css) | differs: the block's ground lightened; inline code keeps the 25 rung so it shows in prose |
| Badge | label on a fill | 500 weight | 400 | Code is running text, not a label |

## Visual pass

2026-10-28 (round 81; desktop app, the Stage at 100%, 2x, light and dark): every tile beside its peers (Kbd in
the table, Token's swatch). No geometry change. The `treatments` tile showed one treatment, the subtle one, under the
title "Surface treatments"; it is now titled Subtle (pages.mjs; the id stays, so links hold).

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

## Token: motion and crispness, 2026-10-07

Token (`token.css`) is static: no motion. Crispness (`docs/MOTION.md` rule 1): its height, swatch and
inline inset were `1em`-based and Code's text is `max(text-xs, 0.875em)` (12.25 in 14px copy), so the
box, the swatch's 1px ring and the inset landed on fractions. They are now `round(nearest, …, 1px)`:
height `1em + 10`, swatch `1em`, inset `(height − 1cap) / 2 − 1`. At whole-pixel font sizes nothing
changes (measured on `code.html`: 24 high, 14 swatch).

## Motion and interaction, 2026-10-07


Inline Code is static: no motion. Crispness: its `max(text-xs, 0.875em)` text (12.25 in 14px copy)
stays, because audit G-26 (owner pick A) keeps it em-relative; Token's pass (above) already rounds
the box, swatch and inset around it. Open question: round the text itself, `max(text-xs,
round(nearest, 0.875em, 1px))` (12 in 14px copy, 14 in 16px prose), which keeps it following the
prose but shapes it on whole pixels? Recommendation: yes, but it is a 0.25px type change and the
owner's pick, so it waits for a yes.

## Review note, 2026-10-12 (swatch ring)

- **What changed:** the token's swatch outline is the same translucent line, over the colour.
- **Why:** you asked why the swatch's outline only showed at its corners, then said to apply the fix: the outline is now
  a light translucent line drawn over the colour, so it shows evenly all the way round on every colour.

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
- 2026-09-30 · audit S17 (API vocabulary, slice 2, H-13) → the manifest's `ground: on-color | subtle` axis is two independent booleans, `subtle` and `on-color`, matching React's `subtle` / `onColor` (manifest.ts:622-630; Token likewise, :654-661). No CSS change.
- 2026-09-30 · audit G-26 (owner pick A) → inline Code keeps em-relative sizing (0.875em / 1.35) so it follows its prose; no snap to the ramp → code.css:132-133.
- 2026-10-01 · audit H-25 (owner pick A) → the React `Token` and `TokenProps` are marked `@deprecated` (use `<Code swatch>`, which renders the same element and swatch); Token stays exported so existing markup renders; Presence stays the status mark → primitives.tsx:2152, :2176-2178.
- 2026-10-01 · compact pass → inline Code is `max(text-xs, 0.875em)`: compact's 12px chrome made it 10.5, under the ramp; unchanged wherever the surrounding text is 14 or larger. docs/research/compact-pass-2026-10-01.md.
- 2026-10-04 · quality pass after the one corner setting → the corner is the small role capped at a pill for its height; the radius rewrite had capped it at its own height's corner (12px code in a Table read 4, now 6 again); the swatch is nested, host − 4, floored at small − 2 (`code.css`, `token.css`). `docs/research/radius-audit-2026-10-03.md`, "Quality pass".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → Token's height, swatch and inline inset rounded to whole pixels (`token.css`). See "Token: motion and crispness, 2026-10-07".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → inline Code static; whole-pixel text rounding left as an open question (owner pick G-26).
- 2026-10-12 · owner (desktop Props and Typography tables: names broke at hyphens) → inline Code in a Table's shrink-to-fit cell (`area-table__cell--fit`) keeps one line (`white-space: nowrap`), so those columns size to the longest name; other cells still wrap → code.css.
- 2026-10-12 · owner (Token row review): "why does the stroke around the swatch only show lightly on the corners, not
  continuously around the whole swatch?" → the solid #f7 edge merged with light grounds on straight edges and showed only
  as antialiasing fringe on the curves; owner: "yes apply the swatch fix" → the edge is a translucent ring drawn over the
  colour, `--area-token-swatch-ring` = `light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1))` (Figma's black 10%),
  shared by Code's swatch, ColorSwatch and Asset row's preview. Checked at 2× in light and dark: continuous on dark,
  white, translucent and saturated swatches; white still outlined on white.
- 2026-10-12 · owner, review round 16: approved.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the token swatch's ring is at `stroke-width` (was `border-width`) (token.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-14 · owner: "merge it, then continue working" → all-axis sweep of Surface 0 at Elevation 0 (90 families, light and dark): the edge reads `--_code-border`: the Surface width on filled chips, `stroke-width` on the subtle variant (Code and Token), which has no fill, so at Surface 0 it no longer turns into plain text; every inset that counts the edge (Code, swatch Token, Token row) reads it too.
- 2026-10-15 · owner: "merge it, then continue working" → all-axis contrast sweep: on-color Code on the accent solid (its gallery tile) read 4.12:1 with white ink, under AA. White sits at 4.61–4.75:1 on the white-ink accent solids, and the 8% wash of the ink itself lifted the ground toward it (4.06–4.37:1 across 8 of 11 accents). The plate is now 8% of the ink's opposite, `oklch(from currentcolor calc(1 - l) 0 0 / 0.08)`, darker under white ink and lighter under black: 5.30–14.20:1 on every accent. The 20% edge is unchanged; where relative colour is unsupported the fill drops and the edge carries the chip.
- 2026-10-18 · radius audit → the swatch (`token.css`, shared with Token) stops 2px short of round until Pill: at Radius 14 / Comfortable it took 8 on a 12 swatch, a circle. Default unchanged (4).

## Review note, 2026-10-20

- **What changed:** inline code is a set fraction of the text around it, so it follows the canvas's body size (14 at Type 14, was 12).
- **Why:** a section of the screen with its own Type setting (the canvas, a Theme) now starts its text at Area's body size, so text that inherits its size follows that setting; it kept the app's 13 before.

## Review note, 2026-10-28 (round 81)

- **What changed:** the "Surface treatments" tile is now called Subtle, with a note that it has no fill.
- **Why:** it shows one Code, the subtle one; the old title promised several.
- **Verdict:** approved by the owner on the round 81 review page, 2026-10-28, with no notes.
- 2026-11-01 · owner ("Yes, fix fills", colour system study, docs/research/color-system-2026-11-01): Inline code (and Token, `token-bg`) painted `bg-stripe`, 1.03:1 on white and #040404 in dark, which equals the page at Layer contrast 0 (the default), so it vanished in both modes → `bg-well`, the recessed tone never closer to the page than the page's control fill (#f9f9f9 / #161616 at Layers 0, unchanged from Layers 50 in light). Inline code now reads `token-bg` as Token does, so the two stay one style.

- 2026-11-02 · owner: "is this the real token fill badge color? it seems so light" → "Yes, strengthen it": the chip's edge (Code
  and Token, one role, `token-edge`) steps from the decorative seam (#f3f3f3) to `border-subtle` (#e8e8e8), the edge step
  nearest Untitled's measured #e5e5e5; on a Table's white rows the #fafafa fill and #f3f3f3 seam all but vanished. Dark
  unchanged (`border-faint`). code.css reads `token-edge` instead of its own copy of the old pair.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** inline code sits on its host's line (`line-height: inherit`; it was 1.35, a box taller than a 13/18 line), its size still `max(text-xs, 0.875em)` (plan A9.9, finding T7).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

## One mark, 2026-11-13

Plan B5.1 (and B5.2, B5.3 where they apply; docs/research/system-evaluation-2026-11-11): the family moved onto the shared mark recipe in inset.css and its own copy of the side, baseline, corner and text was removed. Values above, under Measurements.
