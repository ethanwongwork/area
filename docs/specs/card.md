# Card spec

**Status:** in review · 2026-09-27 (layouts, linked cards, size, slots, templates)
**Captures:** `docs/research/captures/card/`, `docs/research/captures/baseline/chatgpt--settings-card--rest--light.json`
**Peers:** Panel (inspector surface), Dialog and Popover (floating surfaces), Alert and Code
block (container radius), Badge and Button (slots), Slider (templates)

## Owner decisions

- 2026-09-27: cover many use cases without bloat: modular slots, independent axes. Add a
  media well and content slots (badge over media, trailing badge on the title row, tag row,
  corner icon action, check list).
- 2026-09-27: a **size axis**: sm 12 corner / 6 inset, md 16 / 8, lg 24 / 12; the media
  corner is the card's less its inset; the title steps 14 → 16 → 20. Replaces the 2026-09-26
  "container radius" decision for Card.
- 2026-09-27: video, music, weather, news and similar cards are **templates** (compositions
  in the gallery's Templates group), not variants.
- 2026-09-27 (second message): **remove appearances**; they will come later as a system-wide
  implementation. One appearance, built in. Not sure about inverted yet. **Focus on the
  layouts. Yes to linked cards.** Research real products and design systems.
- 2026-09-27 (third message): every media fill is **neutral 25**; a **lighter card edge**
  and a **very soft drop shadow** (reference: Figma's 0 0 8 0, #000 at 2%; "come up with your
  own recipe"); check that every type size, style and component inside the cards maps to a
  real component.
- Superseded: the appearance axis (outline, raised, filled, inverted, glass, plain) added
  earlier the same day; the 2026-09-26 container-radius decision.

## Job and boundaries

Card presents one piece of content (media, title, description, actions) as a single surface,
optionally as one link. It does not host controls acting on something else (Panel) or
interrupt (Dialog). A widget is a card whose content is live data; its layout is a template.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| layout | vertical (default) | Media above text | Every system; Figma file card, Notion gallery |
| layout | horizontal | Media beside text, 40 / 60, stacks below 480px; media start or end by order | Polaris MediaCard landscape, Fluent `orientation`, M3 adaptive |
| layout | compact | 84px thumbnail beside text, for lists | Primer `layout="compact"`, Notion board card |
| layout | immersive | Media behind text with a readability gradient | M3 (scrim over images), owner references |
| media | inset (default), bleed | Bleed cancels the padding on the sides it touches | Fluent CardPreview, Primer, Radix Inset; ChatGPT, Figma, Notion gallery |
| size | sm, md (default), lg | Owner ladder | Fluent 8/12/16, Radix 12–48 step padding with size |
| behavior | linked (CardLink), reveal (CardOverlay) | One link for the whole card; actions on hover | Notion, ChatGPT; Carbon ClickableTile, Radix `asChild` |
| slots | header (+ action), overlay, well, list, footer, carousel | Owner (content slots) | shadcn CardAction, Fluent CardHeader action |

Templates: video, music, weather, stat, news, tool, plan, feature (`card.tsx`).

## Sources

| Id | Type | What | Link / commit / path | Captures |
|---|---|---|---|---|
| chatgpt | product | Library file card (rest, hover), image card; settings card | chatgpt.com, 2026-09-26/27 | `chatgpt--library-*` (3), `baseline/chatgpt--settings-card` |
| notion | product | Board card (rest, hover, linked), board; sidebar promo | app.notion.com, 2026-09-26/27 | `notion--board-card*` (3), `notion--board-column`, `notion--sidebar-promo-card` |
| figma | product | File card (rest; hover observed); community tile and feature card | figma.com, 2026-09-26/27 | `figma--file-card`, `figma--community-*` (2) |
| fluent | design system | Card, CardHeader, CardPreview, CardFooter styles | github.com/microsoft/fluentui @ 8add8c87, `react-card/library/src/components/` | source reading |
| m3 | design system | Cards guidelines, specs, accessibility; state tokens | m3.material.io/components/cards; material-web @ cbd34a89 `_md-sys-state.scss` L21-27 | source reading |
| polaris | design system | MediaCard | github.com/Shopify/polaris @ 3f7954ae `MediaCard.module.css` L11-47 | source reading |
| shadcn | design system | Card slots, CardAction grid | github.com/shadcn-ui/ui @ 98a1fe67 `new-york-v4/ui/card.tsx` L9-67 | source reading |
| carbon | design system | Clickable, selectable tiles | github.com/carbon-design-system/carbon @ 7e8c8f7d `_tile.scss`, `Tile.tsx` L288 | source reading |
| radix | design system | Card `asChild`, sizes, hover ring | github.com/radix-ui/themes @ 1faff10a `card.css`, `base-card.css` L68-75 | source reading |
| primer | design system | Card layouts, edge-to-edge image | github.com/primer/react @ 67945828 `Card.module.css` L33-63 | source reading |
| a11y | guidance | Block-link cards | inclusive-components.design/cards; adrianroselli.com (2020-02) | — |
| apple | platform | HIG Widgets (2025-12-16): margins 16/11, sizes, whole-widget tap with inner buttons | developer.apple.com/design/human-interface-guidelines/widgets | `apple--web-glass-nav` kept for the later appearance pass |
| owner | references | 12 mockups | owner message, 2026-09-27 | character only |
| area | this system | Gallery tiles | localhost | `area--*` |

The appearance evidence (ChatGPT's raised lift, Notion's filled promo, Figma's plain tile,
Apple's glass) stays on file for the system-wide appearance pass.

## Anatomy

```
area  div.area-card grid (flex + container when horizontal): border + padding (= inset) + gap (= inset)
  media        inset: radius = card radius − inset; bleed: negative margin = −padding on the
               sides it touches, outer corners = card radius − border
    overlay    absolute corner at the card inset; --reveal fades in on hover or focus-within
  content      padding = text inset − inset
    title
      link     a.area-card__link; ::after absolute, inset −border, card radius, z 1
    header     heading + action slot one title line tall
    list, footer   8 above; controls inside are z 2, above the link
```

## Measurements

Rest geometry, from `area--*` (headless Chromium, 2026-09-27):

| Tile | Card | Media edges t r b l | Media | Media radius |
|---|---|---|---|---|
| horizontal (tile-limited) | 499 × 144 | 8 8 301 8 | 190 × 128 (40%) | 8 |
| horizontal, media end | 499 × 144 | 8 8 8 301 | 190 × 128 | 8 |
| horizontal, stacked (300) | 300 wide | media 284 × 128 above, text 8 below | — | 8 |
| bleed (vertical) | 300 × 293 | 1 1 124 1 | 298 × 168 | 15 15 0 0 |
| bleed (horizontal) | 499 × 130 | 1 308 1 1 | 190 × 128 | 15 0 0 15 |
| compact | 300 × 100 | 8 8 8 208 | 84 × 84 | 8 |

Linked card, hover (pointer over the card; before the lighter edge): edge #e2 → #d4; fill #fff, ink rgb(40), shadow
unchanged. Focus (Tab): 2px solid outline on the card. Hit test: card corners, body and a
Badge resolve to the link; the overlay Button resolves to itself.

Products (`capture-compare`): Notion board card hover: fill white → translucent 3% warm
(background 0.1s ease-out), shadow and ring unchanged; action toolbar opacity 0 → 1 (0.2s).
ChatGPT library card hover: shell paint unchanged; two actions appear. Figma file card hover:
no change in any of 30 nodes (hidden window).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| paint | `bg-surface`; edge neutral 100 (#ee; dark 750); shadow `0 1px 2px -1px` + `0 2px 8px 0`, 3% black (dark 16%) | Owner (lighter edge, faint shadow); Notion's 8% ring composites to #eb; Figma reference 0 0 8 0 at 2% | The halo drops 2px so it pools under the card, and a contact line gives the lighter edge a bottom. Literal until shadows are tokenised, so the Surface axis's Flat preset doesn't remove it |
| media fill | neutral 25 (#fa; dark 800), media and well alike | Owner | The same rung as the stripe and code slots, but those roles mean something else, so a private property |
| radius / inset / text inset | 12·16·24 / 6·8·12 / 12·16·24 | Owner ladder; ChatGPT 16, Apple 16 margin | Corners derive from the container role |
| horizontal split | media 40%, text 60% | Polaris landscape 40 / 60 | — |
| horizontal stacking | below 480px of card content box, via container query | Polaris md-down; M3 adaptive | The card itself is the container, so it needs a definite width |
| media end | DOM order | Fluent horizontal preview first or last | No prop: order is the API |
| bleed | opt-in; inset stays default | Fluent, Primer, Radix; ChatGPT, Figma, Notion | Owner references inset their media |
| linked DOM | link in the title, stretched `::after`; nested controls z 2 | Heydon Pickering, Adrian Roselli; Carbon, Radix use real `<a>` | A wrapping `<a>` would read the whole card as the link name and forbid nested buttons |
| linked hover | edge: the card edge → `edge-control-hover` (#ee → #d4); no fill, lift or ink change; at rest a linked card looks like any other | Fluent outline (stroke step), Radix surface (ring step); ChatGPT and Figma keep paint | Notion swaps the fill; Area's card has media, where a fill change reads as a grey patch |
| linked transition | `--area-transition` (100ms ease-out) | Notion 0.1s; Radix 120ms; Carbon 150ms | — |
| linked focus | 2px focus outline on the card, `focus-offset` outside | Every system rings the card edge; Area's shared focus offset | Fluent and Carbon inset it (−2px) |
| pressed | none | Not every system has one; none of the products | — |
| reveal | opacity 0 → 1 over 200ms on hover or focus-within; always on with no hover | Notion 0.2s; ChatGPT reveals actions | — |
| nested actions | allowed, few | Apple widgets, Notion, ChatGPT; block-link pattern | Fluent, Carbon and M3 say a clickable card holds no actions; documented as a trade-off |
| title / description | sm `text-sm` · `text-xs`; md `text-md` · `text-sm`; lg `title-sm` · `text-sm`; 400; each role's size, leading and tracking | Owner; type ramp; Dialog's title takes `title-sm` with its tracking | Tracking was missing before the type audit |
| value (CardValue) | `title-lg` (32/40, −0.02em), 400, tabular figures, every size | Apple widgets set the figure well above the text | Replaces an inline style in the weather and stat templates |
| header action icon | a bare icon is 16px, `fg-muted`, like list markers | CardList markers | — |
| well | contents stack at full width, centred on the block axis, gap = card inset | Nested cards in the owner's references | Replaces wrapper `div`s and width overrides in the demos |
| bottom card overlay | text keeps clear of it: one `control-md` plus `gap-md` on that side | — | Replaces an inline padding in the corner-action demo |
| carousel | `CardCarousel` (`ul`, tabIndex 0, needs `aria-label`) | Manifest element had no component | — |

## States

Rest; linked hover (edge); linked focus-visible (card outline); reveal (overlay opacity).
No pressed, selected or disabled state. Text in a linked card can't be drag-selected (the
stretched link covers it), a known cost of the pattern (Roselli).

## Behavior and accessibility

A linked card is one `<a>` with the title as its name. Buttons in the header action, footer,
list or overlay are separate tab stops above it; tab order follows the DOM (an overlay inside
media comes before the title link). CardOverlay reveal shows on `:focus-within`, so keyboard
users see the actions. `@media (hover: none)` keeps them visible on touch.

## Peers and consistency

| Peer | Shared role | Peer value | Card | Match |
|---|---|---|---|---|
| Checkbox, Badge (interactive) | control edge hover | `edge-control-hover` | same, when linked; rest is the lighter card edge | owner (lighter edge) |
| Popover | media placeholder | `bg-component` #f7 | neutral 25 #fa | open: align Popover media if the owner wants one placeholder fill |
| Nav, Menu, Table rows | hover plate | `bg-component-hover` | edge step | intentional: a card with media is not a row |
| Panel, Dialog, Popover | radius | 12 | 12 / 16 / 24 | owner ladder; sm matches |

## Visual pass

Checked in headless Chromium at 1400px, light and dark, every tile, with real pointer hover
and Tab focus. Unverified: Firefox and Safari (container queries, `round()`, `:has()`),
forced colours, screen readers, radius presets other than Standard.

## Feedback log

- 2026-09-26 · cohesion audit, second and third passes → radius and edge changes (see the audit).
- 2026-09-27 · owner references → size, slots, templates; appearances added.
- 2026-09-27 · owner: "remove appearances … focus on the layouts … yes to linked cards" →
  appearance axis removed; horizontal 40 / 60 with stacking, media end by order, bleed media,
  CardLink with edge hover and card focus, CardOverlay reveal → Fluent, M3, Polaris, shadcn,
  Carbon, Radix, Primer sources; `notion--board-card--hover`, `notion--board-card-linked`.
- 2026-09-27 · owner: neutral 25 media, lighter edge, very soft shadow, audit type and
  components → edge #ee, shadow recipe above, media and well #fa, demo gradients removed;
  type audit: title and body tracking added, `CardValue` for widget figures, bare header icons
  16 muted, well stacks its contents, bottom overlays reserve text space, `CardCarousel`, music
  transport in a `Toolbar` (roving arrow keys) → headless Chromium, light and dark.
