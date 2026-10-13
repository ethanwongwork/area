# Accordion spec

**Status:** complete · 2026-10-08 (owner approved on the component review page; recommendations accepted)
**Captures:** `docs/research/captures/accordion/` (filed as `disclosure/` until 2026-10-07); Figma's collapsible section from
`docs/research/captures/panel/figma--section-header--rest--light`
**Peers:** Tree view (chevron slot and plate), Panel collapsible section (Figma's inspector
disclosure), Nav expandable group, Code block toggle (hover underline), Separator (rules)

## Owner decisions

- 2026-10-11: "it looks off center and also moves when i interact with it" → a gallery framing fix;
  the component is unchanged. Cause: the tile wrapped plain items in a centred flex row, so an item
  shrank to its text, changed width when its body showed or hid, and the tile re-centred (and
  re-scaled) it. Measured in Chrome before the fix: closing the default tile moved its chevron 16px
  sideways and 10px down, divided tiles 12–14px down. No product or system moves the trigger: Notion's
  toggle and shadcn's, Radix's and MUI's accordions are full-width blocks whose content pushes what
  follows; shadcn's preview fixes the width (`w-full max-w-lg`, 384) and pins the top
  (`data-align="start"`), measured 2026-10-11. Now every tile is 240 wide (320 until the 1:1 gallery pass the same day),
  and a hidden inert copy at the tile's tallest state sits behind the live demo (build.mjs
  `demoMarkup`), so the tile centres and scales on that and the trigger stays put (measured: no
  movement on any tile).

- 2026-10-08: "go with your recommendations" → every open question settled as recommended, no
  value changed: body motion kept (slow open, moderate close); Divided tile stays sm with divided md
  as the FAQ tile (manifest default md); plain chevron stays the muted outline chevron; divided md
  padding stays 12 (half the line). See Settled questions.

- 2026-10-07: "rename it to accordion" → the family is Accordion: `Accordion` is the stack (was
  `DisclosureGroup`), `AccordionItem` one collapsible (was `Disclosure`), as shadcn, Radix, Chakra and
  Mantine name them; classes `area-accordion` and `area-accordion-item`, slug `accordion`. An item still
  stands alone (the Notion toggle). Earlier entries below use the old names.

- 2026-10-02: build Disclosure ("yes, build disclosure"), recommended as the largest gap in the
  2026-09-26 gap audit (10 of 13 catalogues ship Accordion; `research/component-gap-audit.md`).

## Job and boundaries

An AccordionItem shows or hides a block of content under a title the reader clicks: a Notion toggle,
a FAQ entry, a settings group. Accordion stacks several and can keep one open at a time
(an accordion). It is not a Tree view (hierarchical rows you select), not Nav's expandable group
(navigation lists), not a Panel section (inspector rows; Panel has its own collapsible heading),
and not a Popover or Menu (floating content). The Code block's "Show more" toggle stays a
Code block part.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| variant | plain (default) | A leading chevron before the title; the content sits on the title's column with no rule | Notion toggle block (`notion--toggle-block`); React Aria Disclosure; Primer `details` |
| variant | divided | A trailing chevron and a rule after each item, the stacked FAQ / settings accordion | shadcn Accordion (`accordion.tsx:21, 37, 43`); Radix, Base UI, Ant Collapse borderless |
| size | sm (14/20), md (16/24, default) | The title's text role: md is a document toggle, sm a UI-dense one | Notion 16/24 (md); ChatGPT sidebar section 14/18, shadcn `text-sm` (sm) |
| state | open, disabled | Runtime state on the trigger (`aria-expanded`, `disabled`) | every source |
| behavior | Accordion `multiple` | One open at a time by default (accordion); `multiple` lets any number stay open | Radix `type="single" / "multiple"`, React Aria `allowsMultipleExpanded`, native `<details name>` |

Excluded variants and why: a filled or bordered card per item (Ant `bordered`, Mantine
`contained`, Untitled UI FAQ cards) — no target product draws one, and a Card holding a
Disclosure composes it; a hidden-until-hover chevron (ChatGPT sidebar, Figma inspector) — that
is the navigation and inspector form, which Nav and Panel already own; per-item icons and
trailing actions — not in any target product's toggle.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Toggle block in a page (open), title and caret | app.notion.com, owner's page, 2026-10-02, light | evidence only | `notion--toggle-block--rest--light` |
| chatgpt | target product | Sidebar "Recents" section toggle (open) | chatgpt.com, 2026-10-02, light | evidence only | `chatgpt--sidebar-section--rest--light` |
| figma | target product | Inspector collapsible section header | figma.com editor, 2026-09-26 | evidence only | `../panel/figma--section-header--rest--light`, `../panel/figma--section-title--rest--light` |
| shadcn | design system (source) | Accordion: item, trigger, chevron, content | github.com/shadcn-ui/ui `apps/v4/registry/new-york-v4/ui/accordion.tsx` @ 295a1f114a138f23b5dfee0e0c6812394dfeb90c | MIT | not rendered (the docs page blocks the capture script) |
| wai | guidance | Accordion and Disclosure patterns: heading > button, `aria-expanded`, `aria-controls` | w3.org/WAI/ARIA/apg/patterns/accordion, /disclosure | — | — |

Untitled UI has no accordion in the free set ([reference](../research/untitled-ui-reference.md)).
Not captured: Notion collapsed (opening or closing a toggle was avoided on the owner's page),
Notion and ChatGPT dark, ChatGPT's in-message "Thought for…" disclosure, hover with the real
pointer (the Chrome window was hidden); hover paint was read from Notion's stylesheet instead.

## Anatomy

```
notion (toggle block, 16/24 body)
shell    div.notion-toggle-block   owns: block padding (6 around the row)
  trigger  div.list-item-box-left    24 × 28, padding 2 0: the caret column
    action   div[role=button]          24 × 24, radius 4: hover plate (5% warm), press 10%
      icon     svg arrowCaretDownFill   12.8 × 12.8 filled caret
  text     div[textbox]              padding 2 0 2 6: title 16/24 400, 6 after the caret box
  content  div                       child blocks start at the title box's edge (x 32)

chatgpt (sidebar section)
shell    div.nav-section-title       36 tall, padding 0 6 0 10
  action   button.section-toggle      padding 2 4, radius 6, gap 4: the whole title is the button
    text     span                       14/18 500, muted #8f8f8f
    icon     svg.icon-disclosure        12 × 12 after the label, hidden until hover or focus

shadcn (accordion.tsx @ 295a1f1)
item     Item       border-b, none on the last (:21)
  header   Header     flex (:33)
    trigger  Trigger    py-4, text-sm font-medium, gap-4, justify-between, hover:underline (:37)
      icon     ChevronDown size-4 muted, rotate-180 when open, 200ms (:43)
content  Content    text-sm; inner pt-0 pb-4 (:57, :60)
```

Area:

```
shell    div.area-accordion-item                      variant and size set local properties
  heading  hN.area-accordion-item__heading               only with headingLevel (Accordion: 3)
    trigger  button.area-accordion-item__trigger          the whole title row; aria-expanded, aria-controls
      chevron  span.area-accordion-item__chevron            line-height square; plate drawn on it (plain)
      text     span.area-accordion-item__label              title
  content  div.area-accordion-item__content               region, hidden="until-found" while closed
```

Inset equations (outer inset = border + shell padding + slot inset):

- plain, md: trigger padding-block 2 + 24 line = 28 row (Notion 2 + 24 + 2). Chevron box 24
  (= line), label after gap 6: label start = 24 + 6 = 30. Content start = 30 (the label's column).
- plain, sm: 2 + 20 + 2 = 24 row; chevron box 20; label start 20 + 6 = 26; content start 26.
- divided: trigger padding-block half the title's line (sm 10 + 20 + 10 = 40, md 12 + 24 + 12 = 48;
  compact 8 + 16 + 8 = 32 and 10 + 20 + 10 = 40), rule at the item's end (counted once, on the
  item). Content padding-block-end the same half line.
- compact: gap 6 → 4 (`gap-md`); text md 16/24 → 14/20, sm 14/20 → 12/16 (`text-*`), so rows
  are 24 / 20 plain.

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/accordion/*.json`
(rows abbreviated to the slots used; the toggle block's height includes its open content).

| slot · property | chatgpt · sidebar-section | notion · toggle-block |
|---|---|---|
| **shell** size | 276.01 × 36 | 720 × 4352.95 |
| **shell** padding | 0 6 0 10 | 0 (inner 6) |
| **shell** font | 16px/24px 400 | 16px/24px 400 ui-sans-serif |
| **action** size | 256.01 × 36 | 23.99 × 23.99 |
| **action** padding | 2 4 2 4 | 0 |
| **action** radius | 6px | 4px |
| **action** gap | 4px | — |
| **action** font / color | 14px/18px 500, rgb(143, 143, 143) | — |
| **text** size | 53.41 × 18 | 682.01 × 27.99 |
| **text** padding | 0 | 2 0 2 6 |
| **text** font | 14px/18px 500 | 16px/24px 400 |
| **text** color | rgb(143, 143, 143) | rgb(44, 44, 43) |
| **icon** size | 12 × 12 | 12.8 × 12.8 |
| **icon** edge from parent (t r b l) | 12 182.61 12.01 61.4 | 5.6 5.6 5.6 5.6 |
| **icon** opacity | 0 (shown on hover / focus) | 1 |
| **trigger** (Notion caret column) | — | 23.99 × 27.99, padding 2 0 2 0 |

Area against Notion (`area--default`, `area--size-sm`, captured from the gallery 2026-10-02):

| slot · property | notion · toggle-block | area · default (md) | area · size-sm |
|---|---|---|---|
| row (trigger) height · padding | 27.99 · 2 0 2 0 | 28 · 2 0 2 0 | 24 · 2 0 2 0 |
| chevron box · from row top | 23.99 × 23.99 · 2 | 24 × 24 · 2 | 20 × 20 · 2 |
| label start from the chevron's start | 30 (24 + 6) | 30 | 26 |
| title font | 16px/24px 400 | 16px/24px 400 Geist | 14px/20px 400 Geist |
| content start | 24 (child blocks; their text adds its own pad) | 30 | 26 |
| hover plate | rgba(33, 27, 23, .05), radius 4 | rgba(20, 20, 20, .05) `bg-hover`, radius 6 | same |

Compact (root `data-area-ui="compact"`, measured live 2026-10-07): plain md row 24, label at 24; sm
row 20, label at 20; divided sm 32 (8 + 16 + 8; the 40 recorded here before was the 12-pad build).

Stylesheet reads (not computed): Notion's caret button `.xdxgbl4:hover { background:
rgba(33,27,23,.05) }`, `.xayv9eh:active` at twice the alpha (10%); ChatGPT's chevron
`transition: transform .15s cubic-bezier(.4,0,.2,1)`, `rotate-0` when open, `opacity-0` until
`group-hover` or `group-focus-visible`. Figma (panel captures): section header 240 × 40, title
11/16 550, chevron 16 in the side inset, hidden until hover (`docs/specs/inspector.md`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| plain · chevron position | leading, before the title | Notion (primary for content) | — |
| plain · chevron box | the title's line height square: 24 md, 20 sm (16/20 compact) | Notion 24 for its 24 line | — |
| plain · chevron glyph | `chevron-down` 16 (`icon-md`), rotated −90° (RTL +90°) while closed, muted | Peer: Tree view and Panel chevrons | Notion draws a 12.8 filled caret; Area keeps one chevron across its disclosures |
| plain · chevron plate | `bg-hover` on hover, `bg-active` pressed, `radius-small` | Notion: 5% hover, 10% press on the caret box; Area's shared translucent row wash | Notion corner 4; Area's small radius (6, compact 4) as the Tree view chevron plate |
| plain · label gap | `gap-md` 6 (compact 4) | Notion 6 (`text` padding-start) | — |
| plain · row | padding-block 2 around one line: 28 md, 24 sm | Notion 2 + 24 + 2 | — |
| plain · title type | text md 16/24 (compact 14/20), regular 400, `fg-default` | Notion 16/24 400 | — |
| plain · content start | the label's column (chevron box + gap) | Notion: child block text at 30 from the caret column, the title's own text column (2026-10-07); Area alignment rule | — (Notion's child block box starts at 24; its text adds 6, landing on the title's column) |
| divided · chevron | trailing `chevron-down` 16, muted; rotated 180° while open | shadcn `size-4 text-muted-foreground`, `rotate-180` (`:43`) | — |
| divided · trigger | padding-block half the title's line: sm 10 (row 40), md 12 (row 48); compact 8 / 10; title–chevron gap 16 | sm: shadcn rendered py 10 (2026-10-06); md: MUI 48 (12 + 24 + 12), 2026-10-07; `gap-4` (`:37`) | Was 16 from the pinned source's `py-4`; md was 10 (44) until 2026-10-07. shadcn's 42 is 1 + 10 + 20 + 10 + 1: a transparent focus border Area draws as an outline |
| divided · title type | size's text role, weight strong 500 | shadcn `font-medium`; ChatGPT 500; Figma 550 | — |
| divided · rule | 1px `border-divider` after every item but the last | shadcn `border-b last:border-b-0` (`:21`); Separator's ink | — |
| divided · content | padding-block-end half the line: sm 10, md 12 (compact 8 / 10) | shadcn rendered pb 10 at sm (2026-10-06) | Was 16 (`pb-4`, pinned source) |
| title hover | the chevron plate (`bg-hover`, pressed `bg-active`) in both variants; the title never underlines; ink fixed | Google "People also ask" (the chevron's circle darkens); Notion, Apple, Figma FAQs show no title change; DESIGN_SYSTEM shared rule | shadcn underlines (`hover:underline`, still on ui.shadcn.com 2026-10-06); it was the only one of six accordions to do so, so divided dropped it |
| sm title | text sm 14/20 (compact 12/16) | ChatGPT 14, shadcn `text-sm` | ChatGPT's 18 leading is its sidebar's; Area's 14 role is 14/20 |
| motion | chevron rotates over `duration-fast` with `ease-out`; body opens on `slow`, closes on `moderate` (`block-size` + `opacity`, `ease-in-out`) where `interpolate-size` is supported | ChatGPT 150ms transform; MOTION.md accordion recipe | Body motion added 2026-10-07, kept by the owner 2026-10-08 (Settled 1) |
| focus | 2px `focus-color` outline, `focus-offset`, `radius-small` corners | Button's focus ring | — |
| disabled | `opacity-disabled`, `cursor: not-allowed` on the trigger | Tree view rows (audit D-5) | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| closed | chevron −90° (plain) / 0° (divided); content `hidden="until-found"` | Notion caret right; shadcn closed |
| open | chevron 0° (plain) / 180° (divided); content shown | `notion--toggle-block` (open); shadcn `rotate-180` |
| hover | chevron plate `bg-hover` (both variants); ink fixed | Notion stylesheet; Google "People also ask" |
| pressed | plain: chevron plate `bg-active` | Notion `:active` 10% |
| focus-visible | outline on the trigger | Button |
| disabled | dimmed, not clickable | Tree view |

## Behavior and accessibility

The trigger is a native `<button type="button">` with `aria-expanded` and `aria-controls`; the
whole title row is the button, so Enter and Space toggle it and its name is the title. The
content is a `div` with `role="region"` named by the trigger when it sits in an Accordion
(the WAI accordion pattern) and a plain `div` otherwise. Closed content is `hidden="until-found"`:
find-in-page reveals it and fires `beforematch`, which opens the item. `headingLevel`
wraps the trigger in `h2`–`h6` (Accordion defaults to 3, as WAI asks of an accordion).
Uncontrolled (`defaultOpen`) or controlled (`open` + `onOpenChange`). Accordion is
uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`), keyed by each
AccordionItem's `value`; without `multiple`, opening one closes the others. Reduced motion
(system or `data-area-motion="none"`) zeroes the duration tokens, so the chevron and the body snap. Forced colors keep the
chevron (`currentColor`) and the outline. RTL mirrors the closed plain chevron.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Tree view | chevron | `chevron-down` 16, muted, −90° closed, RTL +90° | same | match |
| Tree view | chevron plate | `bg-hover`, `radius-small` | same, the line-height square | match (Tree view's plate is 20 in its 32 row; plain sm is 20) |
| Panel section | collapsible heading | heading > button, `aria-expanded`, `aria-controls` | same | match |
| Code block | toggle hover | underline, ink fixed | chevron plate | differs: Code block's toggle is a text link; a disclosure's title is a heading |
| Separator | rule | `border-divider` | divided rule | match |

Baseline checks: hover wash is the shared translucent `bg-hover` (DESIGN_SYSTEM.md "Shared state
paint"); one label weight per role (plain 400 like body text; divided 500 like headings).

## Visual pass

2026-10-02, side by side in Claude in Chrome (the owner's Chrome, same window and zoom): Notion's
"area" page toggle against Area's default example on `disclosure.html`.

- Row, chevron column and title column land on the same positions (28 row, 24 square, title 30
  in). The content column is 4–6 to the right of Notion's child text, by the one-column rule.
- Notion's filled 12.8 caret carries more ink than Area's 16 outline chevron at 1.125 weight; the
  outline reads lighter but sits in the same square. Kept for one chevron across Tree view,
  Panel and Nav (open question for the owner: a filled caret for plain).
- Divided against the shadcn source: trailing muted chevron, 16 / 16 / 16 rhythm, rule after each
  item but the last. Not compared rendered (the docs page blocks the capture script).
- Peer lineup: the plain chevron, its rotation and its hover plate match Tree view's; the divided
  rule is Separator's `border-divider`.
- Dark (computed after a forced restyle): title #eeeeee, chevron #c5c5c5, rule #333333 on the
  near-black page; the screenshot kept stale light paint (THEMING.md), so dark is not checked
  visually.

Accordion survey, 2026-10-06 (Claude in Chrome, owner: "is it supposed to be accordion? is the
underline treatment normal?"), read with computed styles, hover and one open on Google:

| Source | Row | Title | Indicator | Rules | Hover |
|---|---|---|---|---|---|
| Google "People also ask" | 52 + 1 rule | 16/24 400 Google Sans | trailing chevron 24 in a 36 circle (rgb(224,226,227) hovered), 8 from the top | between items, none after the last | the circle darkens; no underline |
| Notion pricing FAQ (`details`) | 56 (16 + 24 + 16) | 16/24 600 | trailing + 14 | 1px rgba(0,0,0,.1) after each, one on top | none seen |
| Apple One FAQ | title 24/35 600 | SF Pro Display | trailing circled + | 1px between items | none seen |
| Figma pricing FAQ | 98 (32 + 41.6 + 24) | 32/41.6 400 | trailing arrow 32 | 1.5px black | — (marketing, editorial) |
| shadcn (ui.shadcn.com, Base UI) | 42 (1 + 10 + 20 + 10 + 1, border) | 14/20 500 | trailing chevron | between items | underline |

All five are accordions: a trailing indicator, a rule between items, the whole title a button. Only
shadcn underlines. The trailing chevron and rules stay; divided hover moves to the chevron plate.
Not captured as files (computed reads only); ChatGPT's and OpenAI's pricing pages redirect into the
signed-in app, so ChatGPT has no FAQ accordion in this survey.

Claude in Chrome audit, 2026-10-07 (owner's Edge, own tab; computed reads with a measuring
helper; the tab stayed in the background, so no real-pointer hover and no screenshots):

| Source | URL / where | Theme | Row (pad + line) | Title | Indicator | Rules / content |
|---|---|---|---|---|---|---|
| shadcn (Base UI) | ui.shadcn.com/docs/components/base/accordion | light; dark by `.dark` class in the tab | 42 = 1 + 10 + 20 + 10 + 1 (transparent focus border) | 14/20 500 Geist | trailing chevron 16, muted lab(48.5), stroke 2 @ 24, top-aligned to the line (11) | 1px lab(91) after each; dark rule white 10%, chevron lab(66); content pb 10, 14/20 |
| Radix Primitives demo | radix-ui.com/primitives/docs/components/accordion | light | 45 (fixed) | 15/15 400 | trailing chevron 15, 180° open | styled demo (purple card); weak reference |
| Base UI demo | base-ui.com/react/components/accordion | light | 36 = 8 + 20 + 8 | 14/20 400 | trailing plus 16 | bordered box |
| Fluent 2 | storybooks.fluentui.dev, Accordion default + sizes | light | small 32 (12/20), medium 44 (14/20), large 44 (16/22), xl 44 (20/28) | 400 | leading chevron 20, gap 8, no plate | no rules |
| MUI (Material expansion panel) | mui.com/material-ui/react-accordion | light | 48 = 12 + 24 + 12 (64 open) | 16/24 400 | trailing chevron 24 | 1px 12% rule; card elevation (excluded) |
| Notion pricing FAQ | notion.com/pricing | light | 56 | 16/24 | trailing plus 14 | 1px 10% black |
| GitHub `details` | github.com/ohmyzsh/ohmyzsh README | light | 24 (16/24, no pad) | 400 | native leading triangle marker | content at the summary's edge, no rule |
| Notion toggle | owner's "area" page (observe only, both toggles already open) | light | 28 | 16/24 | caret 12.8 in a 24 box at 8 | child block text at 37.99 = caret column + 30: the title's text column |
| ChatGPT reasoning | an existing conversation, "Worked for Ns" row | light | 24 (16/24, no pad) | 16/24 400, ink 60% | trailing chevron-right 16 after a gap 4, same 60% ink, no plate, no rotation | opens the activity side panel: navigation, not an in-place disclosure |
| Area | accordion.html and gallery, `offsetHeight` | light + dark (`data-area-theme`) | plain md 28, sm 24; divided sm 40, md 44 → 48 | as Decisions | chevron 16 in the line square, stroke 1.125 | dark: title #eeeeee, chevron #c5c5c5, rule #333333 on rgb(2,2,2); hover 5% (dark 14%) |

Findings:

1. Divided md was the tightest 16px accordion surveyed (44, as Fluent large; MUI 48, Google 52,
   Notion FAQ 56). Changed: divided padding is now half the title's line at every size. sm and
   compact sm are unchanged (10, 8); md 10 → 12 (row 48), compact md 8 → 10.
2. The spec's shadcn arithmetic was wrong: 42 is 1 + 10 + 20 + 10 + 1, the extra 2 a transparent
   focus border. Area's 40 (text 10 from the rule, shadcn 11) stays; corrected in Decisions.
3. Plain content start already matches Notion: the child block's text, not its box, lands on the
   title's column (30 from the caret column). The 2026-10-02 note that Area sits 4–6 right was
   measuring the block box. Corrected in Decisions.
4. Indicator: chevron in 7 of 10 (shadcn, Radix, MUI, Fluent, Google, GitHub's triangle, ChatGPT);
   plus only on marketing FAQs (Notion, Apple) and the Base UI demo. Chevron kept.
5. Hover: no source surveyed paints a title fill or underline besides shadcn; Google's chevron
   circle is the only plate. Area's chevron plate kept. Not verified with a real pointer.
6. Dark: Area's rule (#333 on near black, ~20% white) is stronger than shadcn's 10% white; it is
   the shared `border-divider`, so it is a Separator / token question, not this family's.
7. ChatGPT's reasoning row is a muted, unpadded, trailing chevron-right that opens a side panel; it
   is closest to plain sm without a plate but is navigation, so it is not a new variant.

Not reached: Notion toggle headings (none on the owner's pages opened; not created), Notion and
ChatGPT dark (theme is an account setting), Google "People also ask" dark, Figma inspector (no file
open; the 2026-09-26 panel captures stand), Linear's FAQ (the read was refused by the session's
permission check), Atlassian, Apple Support, Stripe docs. No capture files were saved: the
background tab could not write the clipboard and the local relay was not permitted, so this
table is computed reads only.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified in the built-in browser (computed transitions, seeked
`getAnimations()`, rects) on `/accordion.html`.

| Interaction | Before | After |
|---|---|---|
| Chevron turn | `rotate`, fast, ease-out | unchanged (the one chevron rule) |
| Chevron plate, hover | instant both ways (no transition) | instant in, out on `--area-transition` (fast, ease-out) |
| Chevron plate, press | instant both ways | instant in, fast out |
| Focus ring | outline, instant | unchanged |
| Body open | snapped (`hidden` / `until-found`) | `block-size` (auto via `interpolate-size: allow-keywords`), `padding-block-end` and `opacity` on `slow` (250), `ease-in-out` |
| Body close | snapped | the same properties on `moderate` (200), `ease-in-out` (one step faster) |
| Reduced motion | own `@media` rule for the chevron | removed: the duration tokens resolve to 0 under the system preference and `data-area-motion="none"` (checked: every content duration and delay 0s) |

How the body animates with `hidden="until-found"`: after hydration closed content is
`content-visibility: hidden` (not `display: none`), and React's first close writes `hidden=""`
(`display: none`) before the effect turns it into `until-found`. Both are transitioned with
`transition-behavior: allow-discrete`, so the content stays painted for the whole close and
neither flip cuts the motion. The body clips (`overflow: clip`) only while it moves: clip lands
at once on close and is released by a 0s transition delayed one `slow` step after an open, so
focus rings and shadows inside open content are never cut at rest. No `@starting-style`, so
initial render and hydration do not animate. Inside `@supports (interpolate-size:
allow-keywords)`; Safari and Firefox snap as before. Find-in-page still opens the item
(`beforematch` checked).

Fix found on the way: closed `until-found` content kept its own `padding-block-end`, so every
closed divided item carried 10px of empty space under its title after the first interaction
(measured 10 → 0). Closed content now drops its end padding.

Crispness: the chevron is a 16 drawing at 16 in a 24 (or 20) square at whole offsets, and rests at
0°, ±90° or 180°, which map the pixel grid onto itself. Specimens on the docs page sit at
fractional x (the `docs-example__preview` centres a text-width specimen); that is docs layout,
not the component.

The open question this pass raised (keep the body motion) is settled below.

## Settled questions

Owner 2026-10-08: approved, recommendations accepted.

1. **Body motion: kept.** MOTION.md lists it as progressive enhancement; it is quiet (250 open /
   200 close, ease-in-out, no overshoot) and Notion and shadcn animate the same way. (Supersedes the
   2026-10-02 Decisions note "content shows at once".)
2. **Divided gallery tile: sm.** The Divided tile shows sm (shadcn's UI accordion, 40); the divided
   md tile is the FAQ form (every 16px FAQ surveyed is 48–56). Manifest default stays md.
3. **Plain chevron: muted outline.** Notion's caret is filled and full ink, GitHub's marker text
   ink; Area keeps the muted outline `chevron-down` 16 shared with Tree view, Panel and Nav (one
   chevron across the system). Answers the 2026-10-02 visual-pass note on a filled caret.
4. **Divided md padding: 12.** Not Google's 14 (row 52): 12 keeps one rule (half the line) across
   sizes and stays under the owner's "gaps too big" limit.

## Open questions

None.

## Verification

- `npm run build` (manifest parity, token references), `npm run typecheck`, the React tests
  (`packages/react/tests/accordion.test.mjs`: 4 pass), and the full suites below.
- Gallery (built-in browser, real events): single-open group closes the open item; `multiple`
  keeps all three open; `beforematch` on closed content opens it; closed content is
  `hidden="until-found"` after hydration; real-pointer hover paints the chevron plate 5%.
- Area captures for all ten tiles: `area--*--rest--light`.
- Unverified: Notion collapsed and dark, ChatGPT dark, dark paint on screen, find-in-page with the
  real browser find bar, real-pointer hover on reference accordions (2026-10-07 tab in background).

## Feedback log

- 2026-10-02 · owner: build Disclosure → spec written from Notion, ChatGPT, Figma (panel) captures
  and shadcn source.
- 2026-10-06 · owner: "is disclosure the same as accordion? the gaps between the text in each disclosure row
  and the dividers below is quite large, is that intended?" → Disclosure divided + DisclosureGroup is the
  accordion. The gap followed shadcn's pinned source (py-4, 16); shadcn's rendered accordion today
  (Base UI, ui.shadcn.com, measured in the built-in browser) is py 10 around a 14/20 title (42 row) and
  content pb 10. Divided trigger and content end 16 → 10 (compact 12 → 8). Plain (Notion) unchanged.
- 2026-10-06 · owner: is it supposed to be an accordion? is the underline normal? look at more
  accordions (Google) → yes: divided + DisclosureGroup is the accordion (Disclosure is one item, React
  Aria's and WAI's name). Surveyed Google, Notion, Apple, Figma, shadcn: only shadcn underlines, so
  divided's hover is now the chevron plate, as plain's and Google's.
- 2026-10-07 · lead: Claude in Chrome audit against products and design systems → divided padding is
  half the title's line (md 44 → 48, sm unchanged); shadcn and Notion content-start records
  corrected; chevron, hover plate and plain kept. Open: filled caret for plain, md as the FAQ default.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → body opens on slow and closes on moderate (height + opacity, ease-in-out) where supported; chevron plate fades out on fast; closed divided items lose a stray 10px; reduced motion by tokens.
- 2026-10-08 · owner: "go with your recommendations" → approved, recommendations accepted, no
  value changed: body motion kept, Divided tile stays sm (md is the FAQ tile), plain chevron stays
  muted outline, divided md padding stays 12. Decisions' motion row brought up to date.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → no change: the divided rule was already at `stroke-width`, which every standalone divider now uses. (docs/research/consistency-audit-2026-10-12.md)
