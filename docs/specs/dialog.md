# Dialog spec

**Status:** in review · 2026-09-26 (cohesion audit, second pass)
**Captures:** `docs/research/captures/dialog/`
**Peers:** Popover and Toast (floating lift), Button (footer, close hit area), Alert (dismiss),
Card and Panel (container), Field and Input (form content)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Dialog follows the
  [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/base/dialog) composition: a title
  and description above an optional scrolling body, trailing actions, and an optional corner
  close control. It uses one 16px outer inset (including the border), 16px between sections
  and 8px between title and description. The footer has no divider. The title uses the
  18/26px text role, with medium UI body type. All sections share a leading edge and the
  container radius follows the system radius axis.
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  For Dialog: the title is an `h2` (item 14); `bg-overlay` is a 65% black scrim in both themes
  (item 1); Dialog keeps `role="dialog"` as a standalone surface, and inside a native
  `<dialog>` the consumer passes another role, as the modal demo does.

The 18/26 role was removed from the type ramp ([typography](typography.md), line 68); the title
now uses `title-sm` 20/28. The cohesion audit's lift and close-button hover await owner review.
- 2026-09-27: "the text in dialog doesn't look correct".

## Job and boundaries

Dialog interrupts with content that needs a response: a title, description, optional body
and footer actions, and a corner close. It is the panel; in an application it goes inside a
native `dialog` opened with `showModal()`, which supplies the focus trap, backdrop and
Escape. Popover is anchored and non-modal; Alert and Toast report without interrupting.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| composition | default, without close, with field, scrollable body | Owner (shadcn composition) | shadcn, Untitled modal |
| composition | interactive modal | The native `dialog` wrapper and backdrop | Gallery |

No size or tone axis; the consumer sets the width. Gallery groups
(`apps/docs/scripts/build.mjs:381-387`): Default; Content (without close button, with field,
scrollable body, interactive modal).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Modal and close button | [reference](../research/untitled-ui-reference.md), `modal.tsx:15-38`, `close-button.tsx:7-41` @ `4702dc0` | MIT | — |
| shadcn | design system (guidance) | Dialog composition | Owner reference (above) | MIT | — |
| notion | target product | Share popover and page menu (anchored `role=dialog` surfaces); icon button hover (the close control's peer) | app.notion.com, 2026-09-26 (second pass) | evidence only | `popover/notion--share-popover--open--light`, `menu/notion--page-menu--open--light`, `button/notion--icon-button--hover--light` |
| figma | target product | Icon button hover (the close control's peer) | figma.com editor, 2026-09-26 (second pass) | evidence only | `button/figma--icon-button--hover--light` |
| chatgpt | target product | Ghost icon button (the close control's peer) | chatgpt.com, owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--icon-button-ghost--{rest,hover}--light` |
| area | this system | 5 gallery tiles after the second pass | localhost gallery | — | `dialog/area--*` (5) |

No modal dialog was captured in any target product: the second-pass Notion and Figma
captures (`captures/*/notion--*`, `figma--*`) hold only anchored surfaces, and opening a
product modal was not part of the read-only session. The `area--modal` capture holds only
the "Open dialog" trigger.

## Anatomy

```
notion share  div[role=dialog][aria-modal=true] 456 wide, radius 12, lift + 1px ring; content inset 16
area  div.area-dialog[role=dialog] flex column, gap 16, padding 15 + 1px border, radius 12
  header  flex, gap 16, align start
    heading grid gap 8: h2 title 20/28 400 (−0.01em), description 14/20 fg-muted (both cap-trimmed)
    close   button 28 × 28, radius 6, fg-muted, Fluent dismiss_16_regular (11px ink in 16)
  body    flex 1 1 auto, overflow-y auto (scrolls within max-block-size)
  footer  flex end, gap 8, wraps; children stretch at ≤ 480px viewport
modal  dialog.area-dialog__modal transparent, margin auto; ::backdrop bg-overlay
```

Inset equation: 1 border + 15 padding = 16 to every section (`area--default`: header at 16,
16). Close: margin-top (28 − 28)/2 = 0, so it spans the title's 28px line
(`surface.css:367`); it ends 16 from the edge (x 534 + 28 = 562 of 578).

## Measurements

`node scripts/capture-compare.mjs --slots shell dialog/area--default--rest--light.json popover/notion--share-popover--open--light.json` and the icon-button hovers (trimmed):

| slot · property | area · default | notion · share-popover · open |
|---|---|---|
| **shell** size | 578 × 112.14 | 456 × 348.04 |
| **shell** padding | 15 | 0 (content 16) |
| **shell** border | 1 solid rgb(243, 243, 243) | 0 (1px ring in the shadow) |
| **shell** radius | 12px | 12px |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, color(srgb 0 0 0 / 0.03) 0px 5px 8px 0px | rgba(25, 25, 25, 0.05) 0px 20px 24px 0px, rgba(25, 25, 25, 0.027) 0px 5px 8px 0px, rgba(42, 28, 0, 0.07) 0px 0px 0px 1px |

| slot · property | area · close | notion · icon-button · hover | figma · icon-button · hover | chatgpt · icon-button-ghost · hover |
|---|---|---|---|---|
| **shell** size | 28 × 28 | 27.99 × 27.99 | 24 × 24 | 36 × 36 |
| **shell** radius | 6px | 6px | 5px | 8px |
| **shell** hover fill | `bg-component-hover` #f3f3f3 | 5% warm (0.129 0.106 0.090 / 0.051) | rgba(0, 0, 0, 0.05) | `::before` rgba(0, 0, 0, 0.05) |

Area close (`area--default` node 5): ink rgb(102, 102, 102), 16px SVG with 11 × 11 ink. Gallery
tiles are 578 wide because the demos set `inline-size: 100%`.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| width | min(100vw − 32, 480) (`space-96 × 5`) | not found (searched PRIOR_DECISIONS.md, surface.css comments) | Untitled leaves width to the consumer; Notion Share 456 |
| inset, section gap | 16 border-inclusive, 16 | Owner; Notion Share content inset 16 | — |
| radius | 12 (`radius-container`) | Owner (radius axis); Untitled 12; Notion Share 12 | Untitled 16 from sm |
| title | `title-sm` 20/28 400, −0.01em, **`h2`** | Type ramp; second pass (item 14) | Owner's 18/26 left the ramp; was a `div` |
| description | 14/20 `fg-muted`, 4 between the title's and description's line boxes | Owner (8); Card heading gap 4 | The 8 was measured between cap-trimmed boxes: 8px from the title's baseline to the description's cap height, which read as touching. Now only the heading's outer edges are trimmed (the choice-label pattern), so the gap is about 18px baseline to cap, close to shadcn's |
| close · alignment | centred on the title's cap height | Inset rule: first-line alignment | Was centred on a 28px line the trim had removed, 7px low |
| shadow | floating lift `0 20px 24px` + `0 5px 8px`, `shadow-color` | Notion geometry on every floating surface; Untitled `shadow-xl` | — |
| close · box | 28 (`control-sm`), radius 6 (`radius-control-sm`) | Notion icon button 28, radius 6; peer Button sm | Figma 24 / 5, ChatGPT 36 / 8; Untitled 28–44, radius 8 |
| close · glyph | Fluent `dismiss_16_regular` | Shared dismiss glyph (Alert, Toast, Popover) | Was hand-drawn (9px ink, 1.5 stroke) |
| close · ink | `fg-muted`, fixed on hover | Foreground fixed on hover | Untitled darkens the icon |
| close · hover | `bg-component-hover` #f3f3f3 / #333333 | Notion, Figma, ChatGPT icon buttons at 5% | — |
| footer | end-aligned, gap 8, no divider | Owner | — |
| backdrop | **`bg-overlay`** #000000a6 (65% black) in both themes | Second pass (item 1) | Dark was #ffffff06, nearly transparent; Untitled neutral-950 70% + 6px blur |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| close hover | plate `bg-component-hover`; ink fixed | `surface.css:377`; `notion--icon-button--hover` |
| close focus-visible | 2px `focus-color` outline, 2px offset | `surface.css:378` |
| close pressed | none defined | not found (searched surface.css) |
| body overflow | body scrolls; header and footer stay | `area--scrollable` |

## Behavior and accessibility

`Dialog` renders `div[role=dialog][aria-modal=true]`, labelled and described by its title and
description ids; the title is an `h2`. The close button is named "Close dialog", calls
`onClose`, then closes the nearest native `dialog` (`primitives.tsx:924-955`). Used inside a
native `dialog`, as the docs recommend, the consumer passes another role (the gallery demos
pass `role="group"` and `aria-modal={undefined}`, `gallery.tsx:477-478`), so the page has one
dialog role. The backdrop blur (2px) is on `.area-dialog::backdrop` (`surface.css:329-332`),
which applies only when `.area-dialog` is itself the `dialog`; the documented wrapper's
backdrop (`surface.css:306`) has no blur.

## Peers and consistency

| Peer | Shared role | Peer value | Dialog | Match / reason |
|---|---|---|---|---|
| Popover, Menu, Toast | floating lift, radius 12, 1px decorative edge | shared | same | match |
| Button sm ghost, Alert dismiss | 28px icon action, radius 6, hover plate, fixed ink | `bg-component-hover` (Button) | same | match |
| Popover, Toast, Alert | close glyph | Fluent `dismiss_16_regular`, 11px ink in 16 | same | match |
| Popover | section inset | 12 | 16 | a modal reads at a larger inset (Notion Share: 16) |

## Visual pass

Not inspected in this spec pass. Unverified: the open modal and its backdrop on screen, the
dark scrim on screen, any product modal side by side.

## Verification

Compared 5 Area captures (`dialog/area--*`, re-taken after the second pass) with Untitled
UI source values, the Notion Share popover and the Notion, Figma and ChatGPT icon-button
hovers. Build and test results are in [the audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → `shadow-2` → floating lift; close hover `bg-component` + ink
  change → `bg-component-hover`, ink fixed; close radius 8 → 6 → 5 Area captures,
  `chatgpt--icon-button-ghost--hover`.
- 2026-09-26 · found while writing this spec → the close glyph was hand-drawn → the shared
  Fluent dismiss glyph → `primitives.tsx`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → title `div` → `h2`;
  `bg-overlay` a 65% black scrim in both themes; the standalone role kept, another role
  inside a native `dialog` → `popover/notion--share-popover--open`,
  `button/notion--icon-button--hover`, `button/figma--icon-button--hover`.
- 2026-09-27 · owner: dialog text looks wrong → trim only the heading's outer edges, gap 4 between line boxes, close centred on the title's cap (`inset.css`, `surface.css`) → headless Chromium, default and with-field tiles.
