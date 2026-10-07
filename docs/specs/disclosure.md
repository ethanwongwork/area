# Disclosure spec

**Status:** in review · 2026-10-02
**Captures:** `docs/research/captures/disclosure/`; Figma's collapsible section from
`docs/research/captures/panel/figma--section-header--rest--light`
**Peers:** Tree view (chevron slot and plate), Panel collapsible section (Figma's inspector
disclosure), Nav expandable group, Code block toggle (hover underline), Separator (rules)

## Owner decisions

- 2026-10-02: build Disclosure ("yes, build disclosure"), recommended as the largest gap in the
  2026-09-26 gap audit (10 of 13 catalogues ship Accordion; `research/component-gap-audit.md`).

## Job and boundaries

Disclosure shows or hides a block of content under a title the reader clicks: a Notion toggle,
a FAQ entry, a settings group. DisclosureGroup stacks several and can keep one open at a time
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
| behavior | DisclosureGroup `multiple` | One open at a time by default (accordion); `multiple` lets any number stay open | Radix `type="single" / "multiple"`, React Aria `allowsMultipleExpanded`, native `<details name>` |

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
shell    div.area-disclosure                      variant and size set local properties
  heading  hN.area-disclosure__heading               only with headingLevel (DisclosureGroup: 3)
    trigger  button.area-disclosure__trigger          the whole title row; aria-expanded, aria-controls
      chevron  span.area-disclosure__chevron            line-height square; plate drawn on it (plain)
      text     span.area-disclosure__label              title
  content  div.area-disclosure__content               region, hidden="until-found" while closed
```

Inset equations (outer inset = border + shell padding + slot inset):

- plain, md: trigger padding-block 2 + 24 line = 28 row (Notion 2 + 24 + 2). Chevron box 24
  (= line), label after gap 6: label start = 24 + 6 = 30. Content start = 30 (the label's column).
- plain, sm: 2 + 20 + 2 = 24 row; chevron box 20; label start 20 + 6 = 26; content start 26.
- divided: trigger padding-block 16 (`inset-surface-md`; compact 12), rule 1 at the item's end
  (counted once, on the item). Content padding-block-end 16 (compact 12).
- compact: gap 6 → 4 (`gap-md`); text md 16/24 → 14/20, sm 14/20 → 12/16 (`text-*`), so rows
  are 24 / 20 plain.

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/disclosure/*.json`
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

Compact (root `data-area-ui="compact"`, measured live): plain md row 24, label at 24; sm row 20,
label at 20; divided sm 40 tall (12 + 16 + 12).

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
| plain · content start | the label's column (chevron box + gap) | Area alignment rule: content shares the title's column (Code block, Tree view columns) | Notion's child blocks start 6 earlier, at the title box's edge, and add their own text padding |
| divided · chevron | trailing `chevron-down` 16, muted; rotated 180° while open | shadcn `size-4 text-muted-foreground`, `rotate-180` (`:43`) | — |
| divided · trigger | padding-block 10 (compact 8); title–chevron gap 16 | shadcn rendered py 10 (2026-10-06); `gap-4` (`:37`) | Was 16 from the pinned source's `py-4` |
| divided · title type | size's text role, weight strong 500 | shadcn `font-medium`; ChatGPT 500; Figma 550 | — |
| divided · rule | 1px `border-divider` after every item but the last | shadcn `border-b last:border-b-0` (`:21`); Separator's ink | — |
| divided · content | padding-block-end 10 (compact 8) | shadcn rendered pb 10 (2026-10-06) | Was 16 (`pb-4`, pinned source) |
| title hover | underline (divided); the chevron plate (plain); ink fixed | shadcn `hover:underline`; DESIGN_SYSTEM shared rule (foreground fixed) | — |
| sm title | text sm 14/20 (compact 12/16) | ChatGPT 14, shadcn `text-sm` | ChatGPT's 18 leading is its sidebar's; Area's 14 role is 14/20 |
| motion | chevron rotates over `duration-fast` with `ease-out`; content shows at once | ChatGPT 150ms transform | No height animation: no target product animates its toggle's content |
| focus | 2px `focus-color` outline, `focus-offset`, `radius-small` corners | Button's focus ring | — |
| disabled | `opacity-disabled`, `cursor: not-allowed` on the trigger | Tree view rows (audit D-5) | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| closed | chevron −90° (plain) / 0° (divided); content `hidden="until-found"` | Notion caret right; shadcn closed |
| open | chevron 0° (plain) / 180° (divided); content shown | `notion--toggle-block` (open); shadcn `rotate-180` |
| hover | plain: chevron plate `bg-hover`; divided: label underline; ink fixed | Notion stylesheet; shadcn `hover:underline` |
| pressed | plain: chevron plate `bg-active` | Notion `:active` 10% |
| focus-visible | outline on the trigger | Button |
| disabled | dimmed, not clickable | Tree view |

## Behavior and accessibility

The trigger is a native `<button type="button">` with `aria-expanded` and `aria-controls`; the
whole title row is the button, so Enter and Space toggle it and its name is the title. The
content is a `div` with `role="region"` named by the trigger when it sits in a DisclosureGroup
(the WAI accordion pattern) and a plain `div` otherwise. Closed content is `hidden="until-found"`:
find-in-page reveals it and fires `beforematch`, which opens the disclosure. `headingLevel`
wraps the trigger in `h2`–`h6` (DisclosureGroup defaults to 3, as WAI asks of an accordion).
Uncontrolled (`defaultOpen`) or controlled (`open` + `onOpenChange`). DisclosureGroup is
uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`), keyed by each
Disclosure's `value`; without `multiple`, opening one closes the others. Reduced motion
(system or `data-area-motion="none"`) removes the chevron transition. Forced colors keep the
chevron (`currentColor`) and the outline. RTL mirrors the closed plain chevron.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Tree view | chevron | `chevron-down` 16, muted, −90° closed, RTL +90° | same | match |
| Tree view | chevron plate | `bg-hover`, `radius-small` | same, the line-height square | match (Tree view's plate is 20 in its 32 row; plain sm is 20) |
| Panel section | collapsible heading | heading > button, `aria-expanded`, `aria-controls` | same | match |
| Code block | toggle hover | underline, ink fixed | divided: underline | match |
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

## Verification

- `npm run build` (manifest parity, token references), `npm run typecheck`, the React tests
  (`packages/react/tests/disclosure.test.mjs`: 4 pass), and the full suites below.
- Gallery (built-in browser, real events): single-open group closes the open item; `multiple`
  keeps all three open; `beforematch` on closed content opens it; closed content is
  `hidden="until-found"` after hydration; real-pointer hover paints the chevron plate 5%.
- Area captures for all ten tiles: `area--*--rest--light`.
- Unverified: Notion collapsed and dark, ChatGPT dark, a rendered shadcn accordion, dark paint on
  screen, find-in-page with the real browser find bar.

## Feedback log

- 2026-10-02 · owner: build Disclosure → spec written from Notion, ChatGPT, Figma (panel) captures
  and shadcn source.
- 2026-10-06 · owner: "is disclosure the same as accordion? the gaps between the text in each disclosure row
  and the dividers below is quite large, is that intended?" → Disclosure divided + DisclosureGroup is the
  accordion. The gap followed shadcn's pinned source (py-4, 16); shadcn's rendered accordion today
  (Base UI, ui.shadcn.com, measured in the built-in browser) is py 10 around a 14/20 title (42 row) and
  content pb 10. Divided trigger and content end 16 → 10 (compact 12 → 8). Plain (Notion) unchanged.
