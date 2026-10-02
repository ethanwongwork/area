# Code block spec

**Status:** accepted · 2026-09-28 (batch 22, lighter ground and brighter syntax; was: in review · 2026-09-26 (cohesion audit))
**Captures:** `docs/research/captures/code-block/`
**Peers:** Code (inline form, shared ground), Tabs (language tabs), Select (language picker),
Button sm ghost (copy), Nav and Tree view (neutral current marker), Card and Panel (container)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Code block follows
  the [Geist Code Block](https://vercel.com/geist/code-block) anatomy -- a file header with
  the copy action on its trailing edge, a 32px line-number gutter, and a single monospace
  size (14/20px, the system's small text role) across every variant. It keeps Area's own
  tokens rather than Geist's 13/20px type and 16px block inset. Its four syntax hues are
  the measured vivid rung of danger, discovery, info and the accent, in that order: red
  keywords, purple tags, blue attributes and accent strings. Punctuation and comments stay
  neutral, because a hue on the glyphs that carry the nesting reads as confetti. Strings
  follow the accent axis, so a pink accent produces pink strings.
- 2026-09-26: Neutral by default, accent by override. The linked-line rail is neutral ink.
  Accent strings are syntax colour, not a selection marker, so they stay on the accent axis.

## Job and boundaries

Code block shows copyable source: an optional file header (name, language or a language
switcher, actions), numbered lines, line emphasis and diff marks, linkable line numbers,
wrapping and collapsing. Inline references belong to Code. It does not highlight syntax
itself; the consumer passes pre-highlighted `html` or plain `code`.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| header | filename + language, none | A paste destination names the file; an excerpt needs no bar | Gallery `default`, `no-filename` |
| languages | label, Select picker, tabs | Same sample in several languages | Gallery `languages`, `language-tabs` |
| lines | numbered (default), unnumbered | Short excerpts drop the gutter | Gallery `unnumbered` |
| line marks | highlighted, added, removed | Emphasis and diffs, glyph and colour | Gallery `highlighted`, `diff` |
| linkLines | boolean | Shareable line references via `:target` | Gallery `linked` |
| wrap / collapsed / flush | booleans | Fixed measures, long samples, embedding | Gallery `wrap`, `collapsed`, Layout / flush |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| geist | design system (guidance) | Code block anatomy | vercel.com/geist/code-block (prior decision above) | n/a | not captured |
| area | this system | Ten gallery tiles, re-taken after the second pass | localhost gallery | — | `area--*` (10) |
| notion | target product | No code block captured; divider ink from the Share popover and outline button (the header rule's role) | app.notion.com, second pass 2026-09-26 | evidence only | `button/notion--outline-button--rest--light` (edge rgba(28, 19, 1, 0.11)) |
| figma | target product | No code block (Dev Mode not opened); divider ink from the select and file card | figma.com, second pass 2026-09-26 | evidence only | `card/figma--file-card--rest--light` (footer rule 1px #e6) |

Untitled UI has no code block ([reference](../research/untitled-ui-reference.md)).
Searched without a code block: ChatGPT (a code block appears only in a conversation, and
starting one changes the owner's data); Notion's sidebar, page menu, Share popover, "tasks"
board and "returns" table (no page with a code block was opened); Figma's file browser and
editor inspector (Dev Mode, where code is shown, was not opened).

## Anatomy

```
area   div.area-code-block  1px Card's edge (#ee), radius-container, bg-code, overflow hidden
  header   min 32, padding 4/12, gap 8, bottom rule (border-divider); 14/20
    title     Geist Mono 400, fg-default;  language  14/20 fg-muted
    tab       28 tall, 6px sides, radius-small, mono 14/20; selected: 1px underline, 6px in
    actions   margin-inline-start auto, gap 4; copy = Button ghost neutral sm 28
  body > pre   padding 12 block, 14/20 mono;  code > line (grid: 32px gutter | text)
    gutter    padding 6 / 12, tabular numbers, fg-muted, user-select none
    text      16px end inset; unnumbered: 12px start inset
  toggle   32 tall (64 with the fade when collapsed), top rule (border-divider), 400
```

Inset equations: header 4 + 28 copy + 4 + 1 rule = 37 (measured 37). Without a header the
copy floats on line 1: top = 12 + (20 − 28) / 2 = 8, plus 1 border = 9 (`code.css:212-214`),
so its midline (23) meets the first line's (13 + 10). Collapsed pre: 8 × 20 + 2 × 12 = 184
(`code.css:426`); shell 1 + 37 + 184 + 1 = 223 (measured).

## Measurements

`node scripts/capture-compare.mjs` (trimmed):

| slot · property | area · default | area · no-filename | area · linked | area · language-tabs | area · collapsed |
|---|---|---|---|---|---|
| **shell** size | 578 × 163 | 578 × 66 | 578 × 163 | 578 × 163 | 578 × 223 |
| **shell** border | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) |
| **shell** radius | 12px | 12px | 12px | 12px | 12px |
| **shell** background | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) |

Nodes (`area--default`): header 576 × 37, padding 4 12; `code` inherits Geist Mono from `pre`; copy button 28 × 28, radius 6px;
line 20px, gutter 32px (padding 0 12 0 6), number ink rgb(102, 102, 102); keyword
rgb(207, 3, 60), tag rgb(125, 65, 218), string rgb(81, 80, 229). Tabs (`area--language-tabs`):
28px, radius 6px, unselected ink rgb(102, 102, 102).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| type | 14/20 mono throughout (`code.css:235-236`) | Owner (prior) | Geist 13/20 |
| block inset | 12 (`code.css:227`) | Owner (prior: Area tokens, not Geist's 16) | — |
| gutter | 32 (`code.css:226`) | Owner (prior) | — |
| unnumbered · text inset | **12 start** (`code.css:264-267`) | Third pass: code starts where the header's filename and the numbers do | Was 0: hidden numbers left the code at the block's edge. Diff lines keep their marker column (`code.css:269-273`) |
| shell radius / edge / ground | `radius-container` 12, Card's edge `light-dark(neutral-100, neutral-750)` #ee (`code.css:188`), `bg-code`: the page white in light (dark: neutral 800) | Peers: Card media, Panel, Alert; owner 2026-09-28 (lighter ground, more vibrant syntax); audit S7a (owner 2026-09-30): a block standing alone takes Card's edge | Ground was #fafafa (neutral 25); edge was `border-decorative` #f3 |
| header | min `control-md` 32, padding 4/12 (`code.css:36-38`) | Toolbar rhythm | — |
| rules (header, flush top, toggle) | **`border-decorative`**, the block's own edge (owner, 2026-09-27: a divider is never darker than its container); was `border-divider` #e2e2e2 (`code.css:39, 203, 456`); since audit S7a they sit one step lighter than the #ee edge | Second pass: rules take the divider role; Figma #e6, ChatGPT #e6; Notion's rules are lighter, 7% (#f0) (`card/figma--file-card` footer rule) | Was `border-decorative` #f3f3f3; the shell edge stays decorative (a container seam) |
| code · face | `font-family: inherit` (`code.css:250`) | Owner (prior): one monospace | `<code>` reset to the browser's monospace |
| tab · hover | **plate `bg-component-hover`, ink fixed** (`code.css:101-103`) | Shared rules: foreground fixed; opaque plate on a known ground | Was muted → default ink on `bg-hover` |
| line number · hover | **underline, ink fixed** (`code.css:294-298`) | Shared rule; a link marks itself with an underline | Was muted → default ink |
| toggle · hover | **underline, ink fixed** (`code.css:456-460`) | Shared rule | Was muted → default ink |
| linked line (`:target`) | `bg-active` + **2px `fg-default` rail on the inline-start edge** (`code.css:368-374`) | Owner (2026-09-26); peers Nav, Tree view | Was `accent-solid`, and a physical left rail in RTL |
| highlighted line | `bg-active` #00000011 (`code.css:345-347`) | Translucent over any ground | — |
| diff lines | success / danger surface, vivid markers (`code.css:349-363`) | Semantic tones | — |
| diff gutter | 48 when the block has diff lines; marker at the gutter's start, number at its end | Fit: 6 + 8 marker + 4 + two digits + 12 | The 32px gutter could not hold a marker and a number, so the marker overflowed to the block's edge |
| syntax | danger, discovery, info, accent vivid; punctuation and comments muted | Owner (prior); the vivid rung is each family's most saturated rung that clears 4.6:1 on the block's ground | On the white ground every family lands one rung lighter (500): keyword #e80945 4.61, tag #8d4df3 4.68, attr #006df5 4.66, string #5c5dfe 4.72 (was 550 on #fafafa, 5.4-5.5) |
| toggle · label | UI 14/20, `fg-muted`, **400** (`code.css:447-450`) | Type ramp: 500 is for labels on fills; the toggle is transparent | Was 500 |
| collapsed | 8 lines; toggle floats with a `bg-code` fade (`code.css:425-481`) | Area's own | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| tab hover | `bg-component-hover` plate | CSS; not captured |
| tab selected | `fg-default` ink, 1px `currentColor` underline 6px in | `area--language-tabs` |
| line number / toggle hover | underline | CSS; not captured |
| focus-visible (tab, number, toggle, copy) | 2px `focus-color`; toggle offset inward | CSS (`__tab:focus-visible`, `__linenumber:focus-visible`, `__toggle:focus-visible`) |
| linked line | `bg-active` + neutral rail | CSS; `:target` not captured |

## Behavior and accessibility

Language tabs are a `tablist` named "Language" with Arrow, Home and End keys (mirrored in
RTL); the body is the `tabpanel`. The picker alternative is the shared Select. A language
change calls `onValueChange(language, event)` (`onLanguageChange` is a deprecated alias). Line numbers
are `user-select: none`; with `linkLines` each is a link named "Line n" to its own
`#<id>-L<n>` fragment. The copy button's name becomes "Copied" after a successful copy; a
failure is not announced separately. The show / hide toggle is a button with
`aria-expanded` (`packages/react/src/components/primitives.tsx`, `CodeBlock`).

## Peers and consistency

| Peer | Shared role | Peer value | Code block | Match |
|---|---|---|---|---|
| Nav, Tree view | current marker | neutral ink | `fg-default` rail | match |
| Tabs | selected indicator, fixed ink | underline, ink fixed | 1px underline, ink fixed | match; Tabs previews its underline on hover, Code block shows a plate |
| Button sm ghost | copy action | 28, radius 6 | 28, radius 6 | match |
| Code | ground | `bg-code` | `bg-code` | match |
| Menu, Nav rows | hover plate | opaque `bg-component-hover` | `bg-component-hover` on tabs | match |
| Separator, Panel, Menu separator | rule | `border-divider` | header, flush and toggle rules | match |

## Visual pass

The gallery shows Code block in Default, Content (no filename, languages, language tabs,
unnumbered, highlighted, diff, linked, wrap), Layout (flush) and States (collapsed)
groups.

2026-09-28 (batch 22), live in Claude in Chrome on an existing ChatGPT conversation (read only;
`chatgpt--code-block--rest` 2026-09-27 and `chatgpt--code-block-full--rest`): shell 768 wide,
corner 24, 5% black fill and edge; a 48 header (#fc, padding 6 / 20) with a 20 language icon and
a 14/20 label; two 36 round buttons 7 from the top and end, 1 apart; code 12/20 mono from 20 in,
lines 20 apart. Area: corner 12 (`radius-container`, as Card media and Panel), #fa fill with the
#f3 seam, a 32 header (4 / 12) with a 28 copy Button, code 14/20 mono 12 in with a 32 gutter.
Line pitch (20) matches; the corner, header scale and code size are the recorded owner decisions
(Area tokens over ChatGPT's pill scale; 14 mono throughout). No change. Unverified: hover and
`:target` paint on screen, dark theme, RTL.

## Verification

- 10 Area captures (re-taken after the second pass) compared above. Build,
  `cohesion.test.mjs` (hover never changes ink; Code block markers never accent) and other
  results: see [the audit](../research/cohesion-audit.md#verification).
- The Geist Mono defect found while writing the first spec is fixed: in `area--default` the
  `code` node carries no font-family of its own, so it inherits the `pre`'s Geist Mono.

## Feedback log

- 2026-09-26 · cohesion audit → tabs, line numbers and the show / hide toggle keep their ink
  on hover (plate or underline); linked-line rail `fg-default` (was accent) →
  `area--*` captures.
- 2026-09-26 · spec defects fixed → `code` inherits Geist Mono, tab hover on the opaque
  plate, toggle label 400, rail on the logical start edge → `area--default`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → header, flush and
  toggle rules take `border-divider` (was `border-decorative`); no product code block found →
  `button/notion--outline-button`, `card/figma--file-card`; `area--*` re-captures.
- 2026-09-27 · third pass → unnumbered code starts 12px in, under the filename (was the
  block's edge); Layout / flush tile added → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner flagged the diff tile → gutter widens to 48 for blocks with diff lines, marker pinned to the start → headless Chromium, `diff` tile.
- 2026-09-27 · owner (on Panel): divider strokes are never darker than the container's →
  header, flush and toggle rules take `border-decorative`; DESIGN_SYSTEM.md rule updated.

- 2026-09-28 · owner (batch 22): "do another pass on code block, can you lighten the background
  at all? can you make the colors more vibrant/lighter?" → the code ground (`INVERSION.code`,
  curves.ts) is the page white in light (was neutral 25, #fafafa; the ladder has no lighter
  rung). The syntax walk (`chooseVivid`, scale.ts) measures against that ground, so each family's
  vivid rung moved from 550 to 500 on its own: brighter and lighter, each still over 4.6:1, and
  a light accent hue still gets a readable rung. The block keeps its #f3 seam and header rule;
  the collapsed fade follows the ground. Inline Code and the `token-bg` alias keep #fafafa via
  `bg-stripe` (the same 25 rung). Dark unchanged. 19,491 token and contrast tests pass.
- 2026-09-30 · audit S7a (owner) → shell edge is Card's `light-dark(neutral-100, neutral-750)` #ee (was `border-decorative` #f3); header, flush and toggle rules keep `border-decorative`; tabs keep `fg-muted` → code.css:188.
- 2026-09-30 · audit S17 (owner: normalise the API vocabulary) → `onValueChange(language, event)` replaces `onLanguageChange` (deprecated alias).
- 2026-10-01 · compact pass round 7 → block and header insets 12 → 8, inline end 16 → 12 at compact; header text, unnumbered code and the gutter keep one column. docs/research/compact-pass-2026-10-01.md.
- 2026-10-01 · equal-inset sweep → the header's trailing action ends as far from the edge as it sits from the top (4, compact 4; ChatGPT 7 / 7); was 12, on the filename's column, which it keeps. docs/research/compact-pass-2026-10-01.md.
