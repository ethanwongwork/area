# Code block spec

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
- 2026-10-12: "keep working, start on the inspector components" (Figma Dev Mode reference; the plan named a compact
  Code block for the inspector's code) → `size` sm, after Box model. md is unchanged.

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
| size | md (default), sm | md is the page block; sm is the inspector's code well beside Box model | Gallery `size-sm`, `size-sm-titled`; Figma Dev Mode's code |
| variant | outline (default), soft | soft is the soft fields' fill with no edge, for code in a panel whose fields are soft | Gallery `variant-soft`; the app's Inspector wells |
| prompt | string | A command's prompt (`$`), muted, not selectable, out of the copy | Gallery `content-prompt`; Claude Code's and Cursor's command blocks |
| revealActions | boolean | The floating copy shows on hover or focus only | Gallery `behavior-reveal-actions`; Cursor's code blocks |
| collapsedLines | number (default 8) | A shorter excerpt when collapsed | Gallery `collapsed-lines`; Cursor's shell output (5) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| geist | design system (guidance) | Code block anatomy | vercel.com/geist/code-block (prior decision above) | n/a | not captured |
| area | this system | Ten gallery tiles, re-taken after the second pass | localhost gallery | — | `area--*` (10) |
| notion | target product | No code block captured; divider ink from the Share popover and outline button (the header rule's role) | app.notion.com, second pass 2026-09-26 | evidence only | `button/notion--outline-button--rest--light` (edge rgba(28, 19, 1, 0.11)) |
| figma | target product | No code block (Dev Mode not opened); divider ink from the select and file card | figma.com, second pass 2026-09-26 | evidence only | `card/figma--file-card--rest--light` (footer rule 1px #e6) |
| figma-dev | target product | Dev Mode inspector's code: the code well, its heading and the List / Code tabs. Captured with Box model (Dev Mode renders behind its upgrade dialog with placeholder bars; nothing was upgraded) | figma.com, owner's file, 2026-10-12, light | evidence only | `box-model/figma-dev--code-block`, `figma-dev--code-heading`, `figma-dev--code-tabs` |
| github-copilot | reference product (chat) | Chat answer code block: one throwaway chat created with the owner's permission (2026-10-02) | github.com/copilot, light | evidence only | `github-copilot--chat-code-block--rest--light` |

Untitled UI has no code block ([reference](../research/untitled-ui-reference.md)).
Searched without a code block: ChatGPT (a code block appears only in a conversation, and
starting one changes the owner's data); Notion's sidebar, page menu, Share popover, "tasks"
board and "returns" table (no page with a code block was opened); Figma's file browser and
editor inspector (Dev Mode, where code is shown, was not opened).

## Anatomy

```
area   div.area-code-block  `stroke-width` `border-card` edge, corner concentric with the header's copy (11; sm 10, compact 9),
                            bg-code (white), overflow hidden
  header   min 32 (36 with the 28 copy), padding 4/12 (compact 4/8), gap `ui-cluster` (8, compact 6),
           no rule under it (2026-10-25); UI type
    title     Geist Mono 400, fg-default;  language  14/20 fg-muted
    tabs      Tabs sm (`area-tabs area-tabs--sm`, audit G-6 A): Tabs' indicator, hover and inset focus
    actions   margin-inline-start auto, gap 4, ends 4 from the edge; copy = CopyButton (Button ghost neutral sm 28)
  body > pre   padding 12 block (compact 8), none on top under a header, 14/20 mono;  code > line (grid: 32px gutter | text)
    gutter    padding 6 / 12 (compact 6 / 8), tabular numbers, fg-muted, user-select none
    text      16px end inset (compact 12); unnumbered: 12px start inset (compact 8)
  toggle   32 tall (64 with the fade when collapsed), top rule (border-decorative), 400, not selectable
```

Inset equations: header 4 + 28 copy + 4 = 36 (measured 36; 37 with the rule before 2026-10-25); the title's line
to the first line of code 36 / 2 + 20 / 2 = 28 (measured 418 + 36 = 454, the first line's top). Without a header the
copy floats on line 1: top = 12 + (20 − 28) / 2 = 8, plus 1 border = 9 (`code.css:177-178, 239-244`),
so its midline (23) meets the first line's (13 + 10). Collapsed pre: 8 × 20 + 2 × 12 = 184
(`code.css:482-485`); shell 1 + 37 + 184 + 1 = 223 (measured before 2026-10-25; now 1 + 36 + 172 + 1).

## Measurements

`node scripts/capture-compare.mjs` (trimmed):

| slot · property | area · default | area · no-filename | area · linked | area · language-tabs | area · collapsed |
|---|---|---|---|---|---|
| **shell** size | 578 × 163 | 578 × 66 | 578 × 163 | 578 × 163 | 578 × 223 |
| **shell** border | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) |
| **shell** radius | 12px | 12px | 12px | 12px | 12px |
| **shell** background | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) (before batch 22; now white) |

Nodes (`area--default`): header 576 × 37, padding 4 12; `code` inherits Geist Mono from `pre`; copy button 28 × 28, radius 6px;
line 20px, gutter 32px (padding 0 12 0 6), number ink rgb(102, 102, 102); keyword
rgb(207, 3, 60), tag rgb(125, 65, 218), string rgb(81, 80, 229) (the 550 rungs on the old #fa
ground; batch 22 moved syntax to the 500 rungs, see Decisions). Tabs (`area--language-tabs`):
28px, radius 6px, unselected ink rgb(102, 102, 102).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| type | 14/20 mono throughout (`code.css:161-162, 252-260`) | Owner (prior) | Geist 13/20 |
| block inset | 12, compact 8 (`code.css:163`) | Owner (prior: Area tokens, not Geist's 16) | — |
| gutter | 32 (`code.css:166`) | Owner (prior) | — |
| unnumbered · text inset | **12 start**, compact 8 (`code.css:288-291`) | Third pass: code starts where the header's filename and the numbers do | Was 0: hidden numbers left the code at the block's edge. Diff lines keep their marker column (`code.css:293-297`) |
| shell radius / edge / ground | **the copy's corner + its inset + the border: 6 + 4 + 1 = 11** at both densities, times `radius-concentric` (square at Sharp), as the small size (owner, 2026-10-22: "the corner inset here is incorrect"; was `radius-container` 12 since radius audit D1, a corner 1 rounder than concentric with the copy). References put the corner on their inner controls: GitHub Docs (Primer) 6 with no header, Vercel Geist 8 around a 28 / radius 6 copy button, shadcn docs 18 around 28 / radius 8 buttons 8 in, ChatGPT 24 around 36 round buttons 7 in (measured 2026-10-02, computed style). Was Card md's 24 (audit G-27 A), which only fits ChatGPT's larger header; Card's edge, `border-card` (O5, 2026-10-12; was `light-dark(neutral-100, neutral-750)` #ee) (`code.css:210`), `bg-code`: the page white in light (dark: neutral 800) | Peers: Card media, Panel, Alert; owner 2026-09-28 (lighter ground, more vibrant syntax); audit S7a (owner 2026-09-30): a block standing alone takes Card's edge | Ground was #fafafa (neutral 25); edge was `border-decorative` #f3 |
| header | min `control-md` 32, padding 4/12, compact 4/8 (`code.css:31-42`); the trailing action ends 4 from the edge (`code.css:46-48`) | Toolbar rhythm; equal insets (owner 2026-10-01) | — |
| shell · stroke width | **`stroke-width`** (since the 2026-10-12 consistency pass): a standalone block with no shadow keeps its frame under Elevated, as Table and Composer; the small size's corner counts the same width | Strokes (DESIGN_SYSTEM.md) | Was `border-width` |
| rules (flush top, toggle; the header's until 2026-10-25) | **`border-decorative`**, the block's own edge (owner, 2026-09-27: a divider is never darker than its container); was `border-divider` #e2e2e2 (`code.css:39, 230, 499`); since audit S7a they sit one step lighter than the #ee edge | Second pass: rules take the divider role; Figma #e6, ChatGPT #e6; Notion's rules are lighter, 7% (#f0) (`card/figma--file-card` footer rule) | Was `border-decorative` #f3f3f3; the shell edge stays decorative (a container seam) |
| code · face | `font-family: inherit` (`code.css:273`) | Owner (prior): one monospace | `<code>` reset to the browser's monospace |
| tabs | **Tabs sm**: its indicator, hover, inset focus and forced-colours rule (primitives.tsx:2008-2012) | Audit G-6 A (owner 2026-09-30): one tab language | Was a Code block tab: 28 tall, radius-small, mono, hover plate `bg-component-hover` |
| line number · hover | **underline, ink fixed**: 1 stroke at Link's 0.08em offset (`code.css:324-330`) | Shared rule; a link marks itself with an underline | Was muted → default ink |
| toggle · hover | **underline, ink fixed**, as line numbers (`code.css:523-529`) | Shared rule | Was muted → default ink |
| linked line (`:target`) | `bg-active` + **2px `fg-selection` rail on the inline-start edge** (neutral: `fg-default`; `code.css:419-425`) | Owner (2026-09-26); emphasis roles (D1); peer Nav marker | Was `accent-solid`, and a physical left rail in RTL |
| highlighted line | `bg-active` #00000011 (`code.css:383-385`); its inks (syntax, numbers, markers) 0.075 darker in light, lifted in dark past raised L 0.225 (`code.css:394-397`) | Translucent over any ground; owner 2026-10-16 (4.5:1 on the plate) | — |
| diff lines | success / danger surface, vivid markers (`code.css:400-416`); inks 0.05 darker in light (`code.css:398`) | Semantic tones; owner 2026-10-16 | — |
| diff gutter | 48 when the block has diff lines; marker at the gutter's start, number at its end | Fit: 6 + 8 marker + 4 + two digits + 12 | The 32px gutter could not hold a marker and a number, so the marker overflowed to the block's edge |
| syntax | danger, discovery, info, accent vivid; punctuation and comments muted | Owner (prior); the vivid rung is each family's most saturated rung that clears 4.6:1 on the block's ground | On the white ground every family lands one rung lighter (500): keyword #e80945 4.61, tag #8d4df3 4.68, attr #006df5 4.66, string #5c5dfe 4.72 (was 550 on #fafafa, 5.4-5.5). Since 2026-10-16 the vivid inks follow the light page (tokens color/layers.ts VIVID_ROLES) |
| toggle · label | UI type, `fg-muted`, **400** (`code.css:497-503`) | Type ramp: 500 is for labels on fills; the toggle is transparent | Was 500 |
| collapsed | 8 lines; toggle floats with a `bg-code` fade (`code.css:482-485, 555-570`) | Area's own | — |

## Size sm (2026-10-12)

Figma Dev Mode's code well (`box-model/figma-dev--code-block--rest--light`):

```
figma  div.codeWell         287 wide, 1px rgba(0,0,0,.1) ring (box-shadow), radius 5, no fill, padding-top 8
         lineNumbersColumn    20 wide (+1 column edge), numbers right-aligned, padding 0 4, 30% ink
         codeLine             18 tall, padding 0 8, 11/18 Roboto Mono 400; bottom padding 8
       heading row          32 tall above the well, 11/16, 16 sides (outside the well)
```

| Slot · property | Area sm (compact) | Basis | Reason when it differs |
|---|---|---|---|
| code type | 12 / 18 (12 / 16) mono | Figma 11/18 | 12 is Area's smallest UI text (as Box model, Citation) |
| block inset | 8 (6) | Figma 8 top, 8 bottom | — |
| gutter | 28 (24): numbers 4 in, code 28 in (number end 12 / 8 before it, as md) | Figma: numbers 4 in, code 29 in | Figma's 29 counts a 1px column edge Area doesn't draw |
| diff gutter | 44 (40) | 4 + 8 marker + 4 + two digits + 12 | md's 48 formula at 12px |
| text end / unnumbered start | 8 (6) | Figma line padding 8 | — |
| header | 3 + Button sm (28) + 3 = 34 (+1 rule; compact 2 + 24 + 2), 12/16 UI, sides on the code column (8) | Figma's 32 heading row, 11/16 | the copy sits as far in as the floating one, so one corner serves both (owner, round 11) |
| floating copy | centred on line 1: 8 + (18 − 28) / 2 = 3 from the top and the end; line 1 clears 3 + 28 + 8 | md's rule | — |
| toggle | `control-sm` (28), 12/16 | md's toggle at the sm tier | — |
| shell corner | the copy's radius + its inset + the border: 6 + 3 + 1 = **10** (compact 6 + 2 + 1 = 9); edge and ground as md | owner, round 11 ("inset corner radius for the copy button is not correct"): concentric with the copy | was `radius-container` 12, which left the copy's 6 corner 4 in under a 12 one |

Area captures (`area--size-sm`, `area--size-sm-titled`) against `box-model/figma-dev--code-block`: code 12/18 in both,
pre padding 8 / 8, numbers ending 17 from the shell's edge (1 + 28 − 12), code text 29 in (1 + 28; Figma 29), the
floating copy 4 from the outer top and end (1 + 3), the titled header 33 (2 + 28 + 2 + 1 rule; round 12: 35, 3 + 28 + 3 + 1). Compact (checked live):
16 lines, 6 insets, code 25 in, copy 3 + 1 in. Not captured: dark (sm changes no colour), Dev Mode's real code (paywalled).

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| tab hover, selected | Tabs sm's (tabs.md) | `area--language-tabs` (before G-6 A) |
| line number / toggle hover | underline | CSS; not captured |
| focus-visible (tab, number, toggle, copy) | 2px `focus-color`; tab and toggle inset by `focus-width` | CSS (Tabs' `__tab:focus-visible`, `__linenumber:focus-visible`, `__toggle:focus-visible`) |
| linked line | `bg-active` + neutral rail | CSS; `:target` not captured |

## Behavior and accessibility

Language tabs are a `tablist` named by `languageLabel` ("Language" by default) with Arrow,
Home and End keys (mirrored in RTL); only the selected tab is in the tab order. The body is the
`tabpanel`, always focusable, so a keyboard can scroll the code (2026-10-19: with `linkLines` it had dropped out of
the Tab order, and the line links are not in it). The picker alternative is the
shared Select, named by the same `languageLabel`. Without tabs, the scrolling `pre` takes focus
(named by a string `title`, else "Code") so a keyboard can scroll it. Line numbers are
`user-select: none`; with `linkLines` each is a link named "Line n" to its own `#<id>-L<n>`
fragment, out of the tab order (`tabIndex=-1`), so a long block isn't a tab stop per line. The
copy button is CopyButton (copy-button.md) with one fixed name, `copyLabel` ("Copy code" by default); the
result is said once through its polite live region and shown by the glyph, with
`data-copy-state="copied" | "failed"` as a paint hook (audit G-21; primitives.tsx:2060-2069). It reads `code`, or
the rendered text cells for `html`, so the gutter stays out of the clipboard. `onValueChange(language)` reports the chosen language
(`onLanguageChange` is a deprecated alias). The show / hide toggle is a button whose visible
label ("Show code" / "Hide code") carries the state, with `aria-controls` and no `aria-expanded`
(audit G-21: the two said it twice) (primitives.tsx:2124-2133).

## Peers and consistency

| Peer | Shared role | Peer value | Code block | Match |
|---|---|---|---|---|
| Nav | current marker | `fg-selection` | `fg-selection` rail | match (Selection role); Tree view has no rail |
| Tabs | language tabs | Tabs sm | Tabs sm | match: the same component (audit G-6 A) |
| Button sm ghost | copy action | 28, radius 6 | 28, radius 6 | match |
| Code | ground | `bg-stripe` #fafafa (code.css:103) | `bg-code`, the page white | differs since batch 22: the block's ground lightened; inline code keeps the 25 rung |
| Menu, Nav rows | hover plate | opaque `bg-component-hover` | `bg-component-hover` on tabs | match |
| Panel, Menu separator, Toolbar separator | rule | `border-decorative` | header, flush and toggle rules | match (a rule is never darker than its container); Separator stands alone on `border-divider` |

## Visual pass

The gallery shows Code block in Default, Content (no filename, languages, language tabs,
unnumbered, highlighted, diff, linked, wrap), Layout (flush) and States (collapsed)
groups.

2026-09-28 (batch 22), live in Claude in Chrome on an existing ChatGPT conversation (read only;
`chatgpt--code-block--rest` 2026-09-27 and `chatgpt--code-block-full--rest`): shell 768 wide,
corner 24, 5% black fill and edge; a 48 header (#fc, padding 6 / 20) with a 20 language icon and
a 14/20 label; two 36 round buttons 7 from the top and end, 1 apart; code 12/20 mono from 20 in,
lines 20 apart. Area (before batch 22 and audit S7a): corner 12 (`radius-container`, as Card media and Panel), #fa fill with the
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

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


| Interaction | Before | After |
|---|---|---|
| Show / hide code | snapped (`max-block-size` 8 lines ↔ none) | where `interpolate-size` is supported: `max-block-size` 8 lines ↔ `max-content`, open `duration-slow`, close `duration-moderate`, both `--area-ease-in-out` (MOTION.md accordion body recipe); elsewhere it snaps as before |
| Copy feedback | the check glyph swapped in at once | the check enters as a small mark: `scale` 0.6 → 1 + opacity, `duration-fast` `--area-ease-out`, ending at identity; returning to the copy glyph stays instant |
| Copy button, language tabs, select | Button's, Tabs' and Select's own rules | unchanged here |
| Toggle hover | underline only (no colour), `--area-transition` | unchanged (an underline does not transition) |
| Line link hover / focus | underline; outline ring | unchanged |

A collapsible block clips only its vertical axis open (`overflow-y: hidden`, horizontal scrolling
kept), so the growing block never shows a vertical scrollbar; `max-content` includes the
horizontal scrollbar (checked with a 12px classic scrollbar: height = scroll height). Verified on
`/code-block.html`: opening ran a 250ms `max-height` transition (234px at the midpoint, 184 → 284)
and rested at 284 = scroll height; collapsed computes `max-block-size 0.2s`; the copied state starts
`area-code-copied` (100ms) on the glyph.

Open question: the toggle moves from overlay to footer at once while the code grows. Animating the
fade overlay out would need a second property on the toggle; recommendation: leave it, the jump is
hidden by the growing edge.

## Review note, 2026-10-12

- **What changed:** Code block has a small size for the inspector: 12px code on 18px lines with 8px insets and a narrow
  line-number gutter. The page-size block is unchanged.
- **Why:** you asked for the inspector components from Figma's Dev Mode; its code panel uses this tighter well, and it
  sits beside Box model at the panel's width.

## Review note, 2026-10-12 (round 12)

- **What changed:** the small code block's corner is now exactly the copy button's corner plus the gap around it, and
  the copy button sits the same distance from the corner with or without a filename.
- **Why:** you pointed out the copy button's corner didn't match the block's corner.

## Review note, 2026-10-16 (round 30)

- **What changed:** on highlighted and linked lines the syntax colours and line numbers are a little darker in light
  (and lighter on the lightest dark grounds); on added and removed lines, slightly darker in light. This shows at the
  default settings too.
- **Why:** the syntax colours were solved for the plain code ground, so on the highlighted line's gray wash they fell
  to 3.97:1 even at the defaults (3.31:1 on a gray page), and the diff tints left strings at 4.2:1. Now 4.5:1 or more
  everywhere. Look at **Default**, **Gray page** and **Lightest dark**.

## Interaction polish, 2026-10-16

The collapse toggle is not selectable; line-number and toggle underlines take Link's offset (0.25em). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Lines (current, 2026-10-25)

No rule above Show more / Hide code: the fade over the last lines marks the cut. Was `border-decorative`. (The header lost its rule earlier the same day.) This supersedes any older line value below (owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25)).

## Feedback log

- 2026-10-25 · owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25) → No rule above Show more / Hide code: the fade over the last lines marks the cut. Was `border-decorative`. (The header lost its rule earlier the same day.)

- 2026-10-25 · owner (an agent timeline's JSON block): "is this code block a variant? i like the code block without
  the separator between the title and the actual code. can you update it?" → not a variant: a titled block. The header
  loses its rule at every size (ChatGPT's header has none), and the code under a header starts with no top inset, so
  the title's line and the first line are 28 apart (1.4 lines; the reference's 1.4; sm 26 over 18). Edit summary,
  Queue and Plan keep the seam under their fold heads (a button over rows, not a label over its code).

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
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `onValueChange(language)` is the change callback; `onLanguageChange` kept as a deprecated alias → `primitives.tsx:1580-1582`.
- 2026-10-01 · audit G-21 → copy button keeps one name (`copyLabel`) with the result in a live region and `data-copy-state`; `languageLabel` names the tabs or picker; the `pre` is focusable without tabs; line links leave the tab order; the toggle drops `aria-expanded` → primitives.tsx:1823-2043.
- 2026-10-01 · compact pass round 7 → block and header insets 12 → 8, inline end 16 → 12 at compact; header text, unnumbered code and the gutter keep one column. docs/research/compact-pass-2026-10-01.md.
- 2026-10-01 · equal-inset sweep → the header's trailing action ends as far from the edge as it sits from the top (4, compact 4; ChatGPT 7 / 7); was 12, on the filename's column, which it keeps. docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · compact pass round 9 → the title's icon gap and the expand toggle read `gap-md` (6 / 4). docs/research/compact-pass-2026-10-01.md (round 9).
- 2026-10-02 · corner 24 → 12 (compact 22 → 8): measured GitHub Docs 6, Vercel Geist 8, shadcn docs 18, ChatGPT 24; each is concentric with its own header controls, and Area's header action gives 11. Owner chose 12; reverses audit G-27 A. Compact also stepped only to 22 because the formula hard-coded Card's 8 + 8.
- 2026-10-02 · chat code block measured (GitHub Copilot, light) → no change. Shell corner 12 with a 1px #d1d9e0 edge on a #fcfdfd ground; header 41 tall (padding 16 / 16 / 4 / 24), 16px code octicon 8 before a 14/21 600 filename, expand icon 16 in a 28 box ending 16 from the end; code 14/20.3 Monaspace Neon, 24 sides, 12 top, no line numbers. Corner matches Area's default 12; Copilot's 24 sides are looser than Area's 12 (owner prior, Area tokens). Copilot runs at 14px default density, so it is evidence for the default block, not for compact (still Figma Dev Mode 8 / 5). `github-copilot--chat-code-block--rest--light`.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → show and hide code animate their height (slow open, moderate close, ease-in-out, progressive enhancement); the copy check enters as a small mark → code.css. See "Motion and interaction, 2026-10-07".
- 2026-10-12 · owner, review round 11 (rethink, size sm): "inset corner radius for the copy button is not correct" → the
  copy (radius 6) sat 4 from the block's edge under a 12 corner, so the two corners weren't concentric (6 + 4 = 10).
  sm's corner is now the copy's radius plus its inset from the outer edge, and the header copy uses the same inset as
  the floating one. Round 12.
- 2026-10-12 · owner, review round 12: approved.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the shell's frame and the small size's corner use `stroke-width` (were `border-width`); the toggle's focus ring is inset by `focus-width` (was written as `focus-offset`, the same 2px) (code.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the shell edge reads `border-card` (O5: one role for a literal written in several families; same paint). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-15 · Copy button built (owner: "go with your rec") → the copy is `<CopyButton value={read} label={copyLabel} />`: same name, live region, glyphs and check motion (now in copy-button.css); the check holds 2000 ms (was 1600, unsourced; Untitled UI and shadcn 2000). docs/specs/copy-button.md.
- 2026-10-16 · owner: "go with your recs, fix them in that order" (after the Layers sweep, docs/research/layers-2026-10-16/sweep/README.md) → inks on a marked line hold 4.5:1 on its plate. Syntax inks, line numbers and diff markers read a private `--_ink` through one rule that mixes it toward black by `--_ink-darken` (light) or white by `--_ink-lift` (dark). Highlighted and target lines: 0.075 darker (the 6.7% wash needs 0.063–0.073 on every light ground; syntax was 3.97:1 there at the defaults, 3.31:1 at 90), and in dark 4.5× however far the raised layer passes L 0.225 (the 19% white wash; 3.5:1 at 24 + 8 before, 0 at the defaults). Added and removed lines: 0.05 darker in light (their fixed tints left strings and markers at 4.19–4.32:1). The vivid inks themselves now follow the light page (tokens color/layers.ts VIVID_ROLES).

Since 2026-10-17 the underline offset is Link's 0.08em, close under the text (link.md, "Close underline").
- 2026-10-22 · md corner `radius-container` 12 → concentric with the header's copy, 6 + 4 + 1 = 11 (owner: "the corner inset here is incorrect", on the Stage's code block). The same rule the small size took in round 11; it now follows the Radius setting through `radius-control-sm` and is square at Sharp.
- 2026-10-23 · theme review (owner: "make sure ... there are no visual errors due to all the combinations") → a highlighted line's light ink darkening scales with its wash, the selected fill's (`bg-active`), which the Hover and Selected fill settings set: 0.075 at the default 7%, 0.168 at both 4 (15.6%), which needs 0.160 (keywords 3.83:1 there before; unchanged at the defaults) → code.css.

## Review note, 2026-10-20 (round 62)

- **What changed:** Its Copy and wrap buttons now take the plate made for its raised code ground. In light at the default settings nothing moves (there the raised plate equals the page's);
  in dark and on a grey page its hover, selected and pressed plates are now the same step from this surface as every
  Card's and Menu's (dark: #272727 on #121212, was #212121).
- **Why:** you asked that hover colours come from rules, not one-off fixes. The rule is now written (DESIGN_SYSTEM.md,
  Layers: a component that paints a ground declares it in layers.css) and enforced by a test; this family painted a
  raised ground without declaring it.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-25

- **What changed:** A titled Code block has no line under its header. The code starts right under the title (28 from
  the title's line to the first line of code, was 41 past the line). Blocks without a title are unchanged.
- **Why:** you liked the agent timeline's JSON block, where the label sits over its code on one ground. ChatGPT's code
  header has no rule either. The space between the title and the code shrank with it, because the rule was what
  justified the gap.

## Review note, 2026-10-26

- **What changed:** No line above Show more.
- **Why:** you asked for dividers only where they are needed and intended, and for the ones that stay to be very
  light. You approved each one on the dividers comparison page.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** The language tabs' bar slides like Tabs'; the code (or its tab panel) shows a ring around the block when focused by keyboard.
- **Why:** The code is focusable so a keyboard can scroll it, but focusing it showed nothing. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

## Review note, 2026-10-27 (round 77)

- **What changed:** the language tabs sit 4 further from the filename, and a focused language tab's ring stands clear of
  its label (Tabs' round 77 change).
- **Why:** the new ring reaches 6 before the label; at the head's 8 gap it would have crossed the filename.

## Review note, 2026-10-28 (dark soft tones)

- **What changed:** added and removed diff lines' plates in dark are quieter: each tone's soft surface is the neutral control fill of the same state in the
  tone's hue at chroma 0.05 / 0.06 / 0.07 (danger rest #3d1d1f, was #820022). Inks and light are unchanged; the ink
  reads better (Delete's label 7.34:1 → 10.38:1).
- **Why:** ChatGPT, Notion and Figma paint dark soft tones at chroma 0.04–0.07; Area's palette rungs carried up to 0.15
  and read almost solid. A token change (DESIGN_SYSTEM.md, Colour: dark soft tones;
  docs/research/dark-soft-tones-2026-10-28).
- **Verdict:** approved by the owner on the dark soft tones review page, 2026-10-28 (option A, every family approved).

## Review note, 2026-10-30 (code in the Inspector)

- **What changed:**
  - `variant="soft"`: the soft fields' fill with no edge (the edge keeps its width, transparent; the strong edge under
    increased contrast), so insets and the concentric corner don't move.
  - `prompt`: a muted, unselectable prompt before a command, outside the copied text, every line keeping its column
    so a wrapped command hangs (prompt at 8, the command at 21 in sm compact).
  - `revealActions`: the floating copy shows on hover or focus (at once; leaves on `fast`; always on touch), on the
    code's ground, and the first line no longer reserves a gap for it.
  - `collapsedLines`: the collapsed excerpt's line count (default 8, as before).
  - Every block that scrolls sideways fades its cut line over the last 16 at the end edge, following the scroll, gone
    at the end; nothing changes where nothing overflows (scroll-driven, `@supports (animation-timeline: scroll())`).
  - Four tiles: Variant / soft, Content / prompt, Behavior / reveal actions, Collapsed / five lines. The app's
    Inspector wells are soft, headerless and reveal their copy; the Copy code and Copy import buttons over them went.
- **Why:** your pick "Code in the Inspector: Build" on the Inspector panel study
  (https://claude.ai/artifact/WmGzS6vuoRKesKcRuhp6hj; values in docs/research/inspector-panel-2026-10-30/cursor.md and
  claude-code.md).
- **Not as proposed:** the corner stays concentric with the copy (11.5 in the Inspector at the defaults, the copy's 8
  plus its inset), the round 11 rule, rather than the page's proposed 8.
- **Verdict:** in review.
