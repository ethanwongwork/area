# Card spec

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
- 2026-09-27 (fourth message, consistency pass): only bleed media meets the edge, every other
  variant insets its media; templates consistent and generic; one type ramp, consistent and
  intentional gaps; every card the same default size; remove duplicate variants; fix the
  carousel; titles equally spaced on each side. May rewrite the earlier size rules.
- Superseded: the size axis's type steps (title 14 → 16 → 20, sm body 12) and fixed text
  insets 12 / 16 / 24 (2026-09-27, second entry above), by the consistency pass.
- Superseded: the appearance axis (outline, raised, filled, inverted, glass, plain) added
  earlier the same day; the 2026-09-26 container-radius decision.
- 2026-09-28: "i dont like how the buttons and text are offset, maybe the text and buttons can
  be aligned and slightly less offset from images by like 4px? … corner radius math of the card
  based on the default button size and the padding around it equaling the card corner radius
  … center the play pause controls." Decision: text, header actions and footer buttons share one
  column, 4 inside the media's inset (sm 10, md 12, lg 16 from the edge); the corner is the
  default Button's radius plus that distance (sm 18, md 20, lg 24; was 12 / 16 / 24), so every
  button on the column and the inset media (radius 20 − 8 = 12) are concentric. Kept a 4 step
  rather than none: flush text would sit 8 from a 20 corner, inside the curve's reach, while 4
  reads as one column with the picture. Over a picture (immersive) the text keeps the overlay
  controls' line, two insets in.
- 2026-10-22: "i just want users to be able to choose the option of making these containers/cards match the background or
  making them slightly different, lighter or darker" → the Card tone setting (axes/card-tone.ts), per mode: Auto keeps
  the container's own tone, else −4 (darker) to +4 (lighter) from the page, 0 matching it. A Card paints `bg-card` (Auto: the raised layer, `bg-surface`) and declares the card ground, so its controls step from it.

## Job and boundaries

Card presents one piece of content (media, title, description, actions) as a single surface,
optionally as one link. It does not host controls acting on something else (Panel) or
interrupt (Dialog). A widget is a card whose content is live data; its layout is a template.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| layout | vertical (default) | Media above text | Every system; Figma file card, Notion gallery |
| layout | horizontal | Media beside text, 40 / 60, stacks below 480px; media start or end by order | Polaris MediaCard landscape, Fluent `orientation`, M3 adaptive |
| layout | thumbnail (was `compact`, renamed so it no longer borrows the compact density's word; audit H-13, owner 2026-10-01) | 84px thumbnail beside text, for lists | Primer `layout="compact"`, Notion board card |
| layout | immersive | Media behind text with a readability gradient | M3 (scrim over images), owner references |
| media | inset (default, every layout including immersive), bleed | Bleed cancels the padding on the sides it touches; it is the only media that meets the edge | Fluent CardPreview, Primer, Radix Inset; ChatGPT, Figma, Notion gallery |
| size | sm, md (default), lg: corner and inset only | Owner ladder | Fluent 8/12/16, Radix 12–48 step padding with size |
| behavior | linked (CardLink), reveal (CardOverlay) | One link for the whole card; actions on hover | Notion, ChatGPT; Carbon ClickableTile, Radix `asChild` |
| slots | header (+ action), overlay, well, list, footer, carousel | Owner (content slots) | shadcn CardAction, Fluent CardHeader action |

Templates: video, music, weather, stat, plan, feature (`card.tsx`), all the default size, in one slot order (media, header, value, body blocks, footer). Removed in the consistency pass as duplicates: news (the linked card with an overlay), tool (reveal plus tags); tiles removed: size md (the default tile), horizontal stacked (a behaviour of horizontal, documented), horizontal bleed (bleed is one option; the vertical tile shows it).

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
  media        inset: radius = card radius − inset; 16:9 when vertical; immersive: absolute at
               the inset; bleed: negative margin = −padding on the sides it touches, outer
               corners = card radius − border
    overlay    absolute corner at the card inset (inside media); on the card, two insets in
  content      padding = (control-md − 1cap) / 2 on every side ("content pad")
    title      trimmed to its cap on top; the last text line trimmed to its descent
      link     a.area-card__link; ::after absolute, inset −border, card radius, z 1
    header     heading + action slot: one control tall, overhanging the content pad; a control
               in it reaches the inset at the end
    list, badges, slider, carousel   12 above (block gap)
    footer     last: reaches the inset on the sides and bottom; 12 above
```

Text inset = inset + content pad: the title's cap is as far from the top as its start is from
the side (18.3 at md: 8 + (32 − 11.4) / 2), and a header Button in the 8/8 corner centres on
the cap. sm 16.3, lg 22.3.

## Measurements

Consistency pass, every gallery tile, built-in browser (Chromium 152) and Claude in Chrome,
light and dark, 2026-09-27. Distances from the card's outer edge.

| Tile | Title cap from top / start | Last baseline to bottom | Header action t / r | Footer l / b | Media |
|---|---|---|---|---|---|
| before (default) | 22.1 / 16 | — | — | — | — |
| before (well row, sm) | 17.1 / 12 | — | 8 / 12 | — | — |
| default, linked, overlay, reveal | 18.3 / 18.3 (below media) | 18.3 (text last) | — | 8 / 8 | 8 8, 284 × 160, r 8 |
| header action (Badge) | 18.3 / 18.3 | 18.3 | 14 / 18.3 (on the text edge) | — | — |
| video, music (Button) | 18.3 / 18.3 | 18.3 | 8 from end, cap centre = action centre | 8 / 8 | 8 8, r 8 |
| well row (sm, nested) | 16.3 / 16.3 | — | 6 / 6 / 6 (bottom) | — | row 44 tall, 18.3 from the host's edge |
| weather, stat (170) | 18.3 / 18.3 | 18.3 | icon on the text edge | — | value at 101 |
| horizontal | 18.3 from top; 18.3 after the media | — | — | on the inset after the media | 8 8, 40% |
| compact | 18.3 after the thumbnail; the text centred on it (taller text from 18.3) | — | — | — | 84 × 84 at 8 8 |
| immersive, corner action | text 18.3 from start and bottom | 18.3 | — | Button 16 from the corner | inset 8, r 8 |
| bleed | 18.3 / 18.3 | — | — | 8 / 8 | 1 1 (flush inside the border), r 15 |
| sm / lg | 16.3 / 16.3; 22.3 / 22.3 | — | — | 6 / 6; 12 / 12 | inset 6 / 12 |
| carousel | 18.3 / 18.3 | 18.3 (items) | Buttons 8 from end | — | row at the inset both sides; items 148 (3.25 visible), 8 apart, media 1:1 r 8 |

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
| paint | `bg-surface`; edge neutral 100 (#ee; dark 750); shadow `--area-shadow-resting`, the Elevation axis's resting role: `0 0 2` + `0 2 4` at half the Elevation step in % (1.5% at the default 3; 0 at step 0) (axes/elevation.ts, surface.css:72) | Owner (lighter edge, faint shadow); Notion's 8% ring composites to #eb; Figma reference 0 0 8 0 at 2% | The halo drops 2px so it pools under the card, and a contact line gives the lighter edge a bottom. A Surface axis role since audit S10: the Flat preset sets it to `none`, the other presets keep the recipe. The edge stays lighter than Table's #e2 frame because the halo carries it (audit S7b, surface.css:58); Composer and Code block share this edge (audit S7a) |
| media fill | neutral 25 (#fa; dark 800), media and well alike | Owner | The same rung as the stripe and code slots, but those roles mean something else, so a private property |
| radius / inset | 22·24·28 / 6·8·12: Button md radius (capped) + (inset + 8) × `radius-concentric` | Owner rule 2026-09-28; audit S3 (2026-09-30): square at Sharp, finite at Pill | Was 12·16·24 from the container role |
| text inset | **inset + 8**: 14 / 16 / 20 from the edge on every card, with or without media (media and wells stay on the inset: 6 / 8 / 12); the first line trimmed to its cap, the last to its descent (a closing value to its baseline); media to the title's cap the same 16 at md | Owner 2026-09-28: "the padding for text and buttons being 16 total distance shouldnt only apply when there is an image or container" (asked: 16 everywhere) | Was inset + 4 (10 / 12 / 16), and before that inset + (control-md − 1cap) / 2 |
| header action | a visible control (soft, solid, outline) sits on the text column's corner, concentric with the card (8 + 16 = 24 at md), with the title centred on it; ghost controls (no plate at rest) centre on the title's cap instead, so the title keeps the 16 cap line, their plate ending on the text column; a small card's action is a small control | Popover, Toast, Dialog corner controls; owner 2026-09-28 (the carousel title sat 26 from the top) | Ghost controls used the corner rule too |
| footer | last slot: reaches the inset on the sides and bottom; 12 above | Same corner rule | Was on the text frame, 8 + 4 above |
| block gap | 12 above a list, badge row, slider, carousel or footer; 4 between lines of a text group, except a description directly under its title, which joins it with no gap (title baseline to description cap 11.6) | Owner (intentional gaps; 2026-09-28 "the gap between the title and description is too big"); Figma community tile and Notion promo card 11.5 (`figma--community-tile`, `notion--sidebar-promo-card`) | Was 12 via mixed padding; the title-to-description step was 15, as Popover |
| horizontal split | media 40%, text 60% | Polaris landscape 40 / 60 | — |
| horizontal stacking | below 480px of card content box, via container query | Polaris md-down; M3 adaptive | The card itself is the container, so it needs a definite width |
| media end | DOM order | Fluent horizontal preview first or last | No prop: order is the API |
| bleed | opt-in; inset stays default | Fluent, Primer, Radix; ChatGPT, Figma, Notion | Owner references inset their media |
| linked DOM | link in the title, stretched `::after`; nested controls z 2 | Heydon Pickering, Adrian Roselli; Carbon, Radix use real `<a>` | A wrapping `<a>` would read the whole card as the link name and forbid nested buttons |
| linked hover | edge: the card edge → `edge-control-hover` (#ee → #d4); no fill, lift or ink change; at rest a linked card looks like any other | Fluent outline (stroke step), Radix surface (ring step); ChatGPT and Figma keep paint | Notion swaps the fill; Area's card has media, where a fill change reads as a grey patch |
| linked transition | in at once, out over `--area-transition` (100ms ease-out) (motion pass 2026-10-07) | Notion 0.1s; Radix 120ms; Carbon 150ms; MOTION.md hover plate | — |
| linked focus | `focus-width` outline on the card, `focus-gap` outside (2px at every Focus ring but Bold) | Every system rings the card edge; Area's shared focus offset | Fluent and Carbon inset it (−2px) |
| pressed | none | Not every system has one; none of the products | — |
| reveal | opacity 0 → 1 over `duration-fast` (100; audit F-38, was 200) on hover or focus-within; always on with no hover | Notion 0.2s; ChatGPT reveals actions | — |
| nested actions | allowed, few | Apple widgets, Notion, ChatGPT; block-link pattern | Fluent, Carbon and M3 say a clickable card holds no actions; documented as a trade-off |
| type | **three roles at every size**: title `text-md` 16/24 500; description `text-sm` 14/20 muted; value `title-lg` 32/40; lists take the body size in content ink | Owner (simplify the ramp) | Replaces per-size titles (14 / 16 / 20) and the sm description (12) |
| default size | md for every tile and template; a card nested in a card is one size down | Owner | Weather and stat were sm, news, plan and feature lg |
| vertical media | 16:9 | Every system's default card image | Demos set aspect ratios inline (16:9, 2:1) |
| immersive media | inset like any media, gradient over it | Owner (only bleed meets the edge) | Was edge to edge |
| compact text | the text inset from the thumbnail, centred on it | Horizontal's rule; a list row centres short text on its picture (Menu's described rows, Asset row) | Was 8 from the thumbnail; top-aligned until 2026-10-26 |
| value (CardValue) | `title-lg` (32/40, −0.02em), 400, tabular figures, every size; as a widget's last figure (at most one line after it) it sits at the bottom of a taller card | Apple widgets set the figure well above the text, low in the widget | Replaces an inline style in the weather and stat templates |
| header action icon | a bare icon is 16px, `fg-muted`, like list markers | CardList markers | — |
| well | contents stack at full width, centred on the block axis, gap = card inset, padded by the content pad onto the text column | Nested cards in the owner's references | Was padded by the text inset |
| bottom card overlay | text keeps clear of it: one `control-md` plus 8 on that side (surface.css:372, :375) | — | Replaces an inline padding in the corner-action demo |
| carousel | `CardCarousel` (`ul`, tabIndex 0, `aria-label`): reaches the inset on both sides like media; items (100% − 3 gaps) / 3.25 wide so the next one shows, 8 apart; media 1:1 at the media radius; hidden scrollbar; previous / next ghost Buttons in the header page 75% of the row and turn off at the ends (demo) | Owner (fix the carousel) | Was a row inside the text frame, four items exactly filling it (no sign of more), media radius 12, descenders clipped once trimmed (fixed: the row extends into the content pad) |
| carousel under a header | the title's baseline sits the text inset (18.3 at md) above the pictures, as far as its cap sits from the top | Owner: "a bit more room below the title" (2026-09-27) | Was the 12 block gap |

## States

Rest; linked hover (edge); linked focus-visible (card outline); reveal (overlay opacity).
Selected (`selected`, `aria-selected`, `aria-pressed`): the edge in `stroke-selected` at Selected stroke (2), drawn inside, over Selected tint (none). No disabled state. Text in a linked card can't be drag-selected (the
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
| Panel, Dialog, Popover | radius | 12 / 16 / 12 | 22 / 24 / 28 | Card holds a Button; containers use the container role (DESIGN_SYSTEM, audit S3b) |

## Visual pass

2026-10-26 (desktop app, the Stage at 100%, 2x, light and dark): all 24 tiles. The thumbnail card's title and line
sat at the top of an 84 thumbnail with half of it empty below → the text centres on the thumbnail (surface.css). The
selected ring was compared with Radio and Checkbox cards: the same Selected stroke and tint settings, no change. The
rest unchanged.

Consistency pass, 2026-09-27: every tile measured in the built-in browser; templates, carousel,
well, immersive and horizontal inspected side by side in Claude in Chrome, light and dark.
Seen and fixed on the way: carousel item descriptions clipped by the scroller once their last
line was trimmed; a plan card's price dropped mid-card when the value-to-bottom rule applied to
any value (now only a widget's closing figure). Carousel paging logic verified by dispatching
scroll events; smooth scrolling itself was not observed (both browser windows were in the
background). Unverified: Firefox and Safari (`text-box`, `cap`, container queries, `:has()`),
forced colours, screen readers.

## Motion and interaction, 2026-10-07

Contract: [MOTION.md](../MOTION.md), "Hover plate".

| Interaction | Before | After |
|---|---|---|
| linked hover (edge → `edge-control-hover`) | `--area-transition`, 100 both ways | in at once (`transition-duration: 0s` on `:hover`, under `(hover: hover)`), out over `duration-fast` `ease-out` |
| linked focus | 2px outline, instant | unchanged |
| press | none | none |
| reveal overlay | `opacity`, `duration-fast` 100 both ways (the Decisions table now says so; it read 200ms) | unchanged: one reveal timing with Message actions, Tree view and Property list |
| nested controls | their own components' | unchanged |

Crispness: no transforms or `will-change` on a card. Card heights land on fractions (for
example .61) from the text-box cap trim of their titles; that is layout, so edges snap, and it
belongs with the inset rounding (crispness report B11), not this pass.

Verification: `/card.html`: linked cards compute `--area-transition` (`0.1s ×4`); the served
stylesheet has `.area-card:has(.area-card__link):hover { …; transition-duration: 0s }` under
`(hover: hover)`; reveal computes `opacity 0.1s` ease-out. Verified on the dev server (background tab, so transitions were read from `getAnimations()` and computed styles, not watched; real-pointer hover could not be driven in a background tab, so hover rules were read from the stylesheet).

Open questions:
- Reveal-on-hover is not hover feedback, so it keeps a `fast` fade both ways. Recommendation:
  keep, as one timing for every reveal (Notion fades its card toolbar).

## Review note, 2026-10-09

- **What changed:** The underline under a card's action link is now the link's own colour at rest (it was 40%), matching Link. No gallery tile shows a card action yet, so every tile reads unchanged.
- **Why:** Link's line changed in this round, and Card's action draws Link's line.

## Review note, 2026-10-15

- **What changed:** a card now has the last two steps of the product rules' state ladder: pressed (its edge one step
  firmer) and selected (a 2px selected stroke inside the card, so nothing moves). Rest and hover are unchanged.
- **Why:** the app's gallery tiles drew these states in app CSS; now any Card can.
- **Not a new component:** it is a state on Card.

## Review note, 2026-10-16

- **What changed:** the selected cards' text now sits 16 in from the edge (12 compact), as on every other card.
- **Why:** the example skipped the card's content wrapper, so the text sat on the 8 media inset; Card itself didn't
  change.

## Interaction polish, 2026-10-16

The action's underline takes Link's offset, 0.25em, clear of descenders (link.md). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Review note, 2026-10-21

- **What changed:** a selected card's edge is the vibrant blue (#0160d9; was the dark #004cb0), 2px, drawn inside; its resting shadow is one tight layer, `0 1px 2px -1px` at 8% (ChatGPT's sm), instead of a soft two-layer haze at 1.5%; hovering a linked card lifts it by `0 2px 4px -1px` at 8%; keyboard focus sits 2px off the card.
- **Why:** your picks on the state page (2026-10-21), now the defaults of the new state settings (Inspector: Stroke, Shadow, Fill). Selected stroke, Selected tint, Resting and Hover shadow, and Focus ring now set these for every family.

## Feedback log

- 2026-10-21 · owner: Slider `buffered` for media → the music template's position slider shows a loaded stretch (`buffered={65}`, card.tsx); see docs/specs/slider.md.

- 2026-09-28 · owner: text and buttons offset, less offset from images, corner from the button,
  centre the music controls → `--_card-step` 4 (content pad, was (32 − 1cap) / 2 ≈ 11); corner
  `radius-control-md + inset + step`; footer no longer pulled out to the inset; a header action's
  heading drops by (32 − 1cap) / 2 so the cap centres on it; a footer holding only a Toolbar is
  centred; immersive text on two insets. Measured in the gallery (md): media 8 / corner 12, title,
  like button, slider and footer buttons 12 from the edge, footer 12 from the bottom, transport
  centred (94 either side).

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
- 2026-09-27 · owner: consistency pass (screenshots: well rows, carousel, a title's corner) →
  text inset = inset + (control − cap) / 2 with trimmed first and last lines, corner controls
  on the inset, one type ramp, md everywhere, inset immersive media, 16:9 media, block gap 12,
  carousel rebuilt, templates reduced to six in one slot order, duplicate tiles removed →
  built-in browser measurements (table above), Claude in Chrome light and dark.

- 2026-09-28 · owner (screenshot of the Card review): "the gap between the title and description
  is too big, and the description text seems too close to the bottom of the container stroke" →
  a description directly under its title joins it (baseline to cap 15 → 11.6; Figma and Notion
  11.5), and the last text line ends at its descent instead of its baseline, so descenders keep
  the pad below them (md last baseline to edge 12 → 16; Notion 15.4, ChatGPT 18). A closing
  value still ends on its baseline. Card stays In review.

- 2026-09-28 · owner (screenshots of the list, tags, well and carousel cards): "the texts inset
  distance from the corners is not very consistent across cards … should the text in the carousel
  be aligned to the title? are the text sizes here consistent and correct?", then "the padding for
  text and buttons being 16 total distance shouldnt only apply when there is an image or
  container … the button on the inside [of the well] seems way too large" (asked; chose 16
  everywhere) →
  - the card step is 8: text, footers and header controls 16 from the edge at md (sm 14, lg 20),
    media and wells stay on the 8 inset; corners 22 / 24 / 28 (a default Button's 8 + the
    column). Measured after, every md gallery card: title cap 16, text 16 from the side, the last
    line's descent or the last control 16 from the bottom; media to the title's cap 16.
  - carousel: items' text on the card's column (16, aligned with the header title, was on the
    picture's edge at 8), the item title's cap 16 below its picture (was 4), item titles take the
    body role 14/20 medium under the card's 16 title (ChatGPT library cards 14 / 12, Figma tiles
    13 / 11); the header's small ghost paging controls centre on the title's cap, so the title
    keeps the 16 cap line (was 26), and the title's baseline sits 16 above the pictures.
  - well: a nested card is a compact row, a small (28) control, text and control 8 inside it,
    corner 14 concentric with the control, 44 tall (was a 32 control, 52 tall, corner 18 in a 12
    well); the well's corner is 16.
  Card moves back to In review.
- 2026-09-30 · audit S3 (owner picked C) → the distance joins the corner through `radius-concentric`, so Sharp cards are square; Standard stays 22 / 24 / 28 and Pill stays capped (H-1).
- 2026-09-30 · audit S7b (owner picked C) → no change; the edge stays #ee because the halo carries it, where Table's unshadowed frame keeps #e2. Composer and Code block now take this edge (S7a) → surface.css:58.
- 2026-09-30 · audit S10 (owner) → the halo is the Surface axis role `--area-shadow-card` (same recipe; `none` under Flat), read by `--_card-shadow` → surface.css:62, surface.ts:15.
- 2026-09-30 · audit S14 (owner) → the density gap moved to 6, so layout spacing that had borrowed `gap-md` is pinned to 8: the header, the footer actions and the overlay clearance (surface.css:267, :372, :375, :453). CardList markers still read `gap-md` and now sit 6 from their text (surface.css:391).
- 2026-10-01 · compact pass round 6 → inset and step step down one rung at compact (md 8 / 8 → 6 / 6; sm inset 6 → 4, lg 12 → 8): text column 16 → 12, corner 24 → 18, still concentric with the button and with the title's cap on the inset. Default unchanged. docs/research/compact-pass-2026-10-01.md.
- 2026-10-03 · radius audit D5 (owner) → the corner is concentric with the media rather than the text column's Button: md 8 + 8 = 16 (sm 14, lg 20; compact 12, 10, 14), media 8 (compact 6); a card in a well is concentric with the well, floored at the smallest control (5, compact 4). Was 24 / 22 / 28, compact 18, media 16 (`surface.css`, `--_card-radius`, `--_card-well-radius`). ChatGPT cards 16, Figma 12-15, Cursor 12. `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · all even (owner) → a card in a well floors at `radius-floor` 4 (was 5); the bleed media's 15 is the inside of the card's 1px border, under its even 16.
- 2026-10-03 · two roundness step sizes (owner: card and dialog follow the surface) → the corner is the surface corner plus the inset less the default Button's corner, never more than the surface corner: 16 / 12 as before (sm 14 / 10, lg 20 / 14), stepping by 4 with roundness; media stay corner − inset (`surface.css`, `--_card-term`). `docs/research/radius-audit-2026-10-03.md`, "Step size for large shapes".
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → unchanged at the default (16 / 12); media floored at min(4, setting) so only Sharp is square; Pill 28 (`surface.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · quality pass after the one corner setting → the card never goes square above Sharp (compact sm at 2 read 0): floored at radius-floor (`surface.css`). `docs/research/radius-audit-2026-10-03.md`, "Quality pass".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → linked edge in at once and out on `fast`; reveal unchanged (`surface.css`).
- 2026-10-08 · owner went with Link's recommendation to align Area's underlines (docs/specs/link.md, "Peers aligned") → the action's underline is Link's line: 40% of the ink at rest, full on hover and focus, one stroke (was thickness auto) (surface.css) → back in review.
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → under the Elevated surface preset a dark Card keeps its edge: an inset outline as wide as the frame Elevated removed (`stroke-width` − `border-width`, 0 under every other preset), transparent in light where the halo carries the card (O2); the edge reads `border-card` (O5, same paint) (surface.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · type size and density split (owner) → the inset and step follow the spacing step (`ui-dense`), so card text sits 12 → 22 in as type and density grow; the title reads `title-xs`, now the reading size (14 at type 12 … 18 at 16); the drawn corner (`--_card-corner`) is capped at 1.5 × the text inset (radius 14: 28 over 16 → 24) (`surface.css`). `docs/research/ui-size-scale-2026-10-12.md`.
- 2026-10-14 · owner: "add elevation as an option" → the shadow is the Elevation axis's resting role, `--area-shadow-resting` (was the Surface axis's `shadow-card`): no lift at Minimal, the 3% halo at Soft, Fluent's shadow4 at Standard and Strong; the Elevated surface preset is now Borderless (docs/research/elevation-2026-10-14.md).
- 2026-10-14 · owner: "the standard and strong elevations can be toned down ... a naming convention similar to the existing axis" → Elevation is one number, 0 to 8 (default 3); the resting role is Fluent's shadow4 geometry at half the step in %: 1.5% at 3, 4% at 8, none at 0 (axes/elevation.ts).
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the card lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. It replaces the dark-only inset ring (consistency pass O2), so a Card and a floating surface draw one edge. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).
- 2026-10-15 · PRODUCT_UI.md open gap ("A selectable card or tile state on Card: the gallery's Tile carries rule 3 in app CSS"), owner: "merge it, then continue working" → pressed and selected, rule 3's last two steps, from the app's gallery tiles (owner-adopted 2026-10-12): a linked card's edge steps to `border-hover` while pressed; selected (`selected` → `data-selected`, or `aria-selected` / `aria-pressed` on the card) draws `stroke-selected` 2 wide inside the card, its edge plus an inset ring of the rest (`2 × stroke-width − card border`), so the grid never moves and Surface 0 keeps the full 2; it lands at once and outranks hover and press; forced colours draw it as a 2 Highlight outline inside. The selected stroke is a state, so `stroke-width`, not the Surface's `border-width`. Gallery: State / selected.
- 2026-10-16 · owner, review round 27 (components27) → needs changes: "padding is wrong" → open.
- 2026-10-16 · from the owner's "padding is wrong" → the State / selected demo put `CardHeader` straight in the card, without `CardContent`, which holds the text column's inset; its text sat on the card's 8 (6 compact) media inset instead of 16 (12). The demo now wraps it as every other Card demo does; measured in the app: title and description 14 from the top, start and bottom at type 13. Card's CSS is unchanged.
- 2026-10-16 · owner, review round 28 (components28) → approved (pressed, selected) → Complete again in `component-status.mjs`.

Since 2026-10-17 the underline offset is Link's 0.08em, close under the text (link.md, "Close underline").
- 2026-10-21 · owner's picks on the state page (https://claude.ai/artifact/3uKMHRhpWnPqNA6pK4WfD9) and "capture some of these options as options for the design system customization … keep my current selections as the default" → selected draws `selected-width` (Selected stroke, 2 by default) in the accent's indicator rung (#0160d9 light, #79aeff dark; was `stroke-selected` at the accent's text shade #004cb0) over `selected-tint`; linked focus sits at `focus-gap`; the hover lift is Hover shadow's tight `0 2px 4px -1px` 8% and Hover shadow 0 steps the edge (was Elevation's). surface.css; docs/research/states-2026-10-21.

## Spacing audit (2026-10-17)

Header marks: a Badge or marker icon in `CardHeader`'s action slot centres on the title's cap line (the slot is one cap tall and the mark overflows it evenly, as a ghost control's). It sat 6.3–6.8 below the cap centre because the title is cap-trimmed and the slot was one title line tall; header buttons were already centred (0.5). Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).
- 2026-10-18 · owner: "i dont like the card hover state with the stroke outline color change … more subtle with the
  shadow … smooth, subtle, professional motion" → a linked card's hover keeps its edge and lifts to the float shadow,
  fading in on `fast` ease-out and out on `base` ease-in; a press drops the lift; Elevation 0 keeps the edge step
  (`surface.css`; measured from Notion's and Fluent's cards, `docs/research/card-hover-2026-10-18.md`). Status unchanged;
  for the owner's review.
- 2026-10-18 · owner: the hover shadow "too drastic … very subtle elevation shadow" → the lift is Elevation's new `lift`
  role (shadow8 geometry at half the float's weight: 0 0 2 + 0 4 8, 0.75% / 1.5% at Elevation 3), not the Menu's float
  shadow; resting → lift is Fluent 2's interactive card step. Gallery tiles take the same role. Status unchanged.

## Settings collisions fixed (2026-10-18)

Elevation and Stroke audit (docs/research/elevation-stroke-2026-10-18, "Audit: Area today"): under a Material a selected card lost its inset selection ring (material.css replaced the whole `box-shadow`
and tied on specificity) and a linked card's hover lift dropped the material's layers. The box-shadow is now slots,
`var(--_card-ring), var(--_m-layers, 0 0 0 0 transparent), var(--area-shadow-edge), var(--_card-lift)`: selection sets
`--_card-ring`, hover and press set `--_card-lift` (float, then back to `--_card-shadow`), and a material fills only
`--_m-layers`, so every state keeps the others. With no material the slots add only transparent layers: the look is
unchanged. Checked in the app (light and dark, None, Glass and Tactile).

## Hover lift (2026-10-18)

Edge and Depth (axes/depth.ts; owner: "go with your recommendations … finalize the material, surface, stroke, elevation axis
theming"): a linked card's hover lift is `--area-shadow-lift` (main, 2026-10-19: Fluent's shadow8 at half the float's strength; the float shadow it took first was "too drastic"), set by Floating (Elevation).
At Elevation 0 the edge steps instead. The gallery tiles take the same role (apps/desktop/src/studio.css). The resting
lift is `shadow-resting` at Rest shadow, its own number since the nine controls (3 by default, as before).

## Review note, 2026-10-26 (visual pass)

- **What changed:** In the thumbnail layout, the title and description now sit centred beside the thumbnail instead
  of at its top.
- **Why:** With a short title and one line, half the thumbnail's height was empty below the text, which read as
  unfinished; a list row centres a short text on its picture.
