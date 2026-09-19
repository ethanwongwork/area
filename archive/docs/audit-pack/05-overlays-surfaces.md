# 05 Overlays and surfaces

> **v2 note.** This file is the capability checklist (variants, anatomy, behaviour, demos). It is not a source for sizes, padding, radius or shape: those come only from `construction/05-overlays-surfaces.md`. Any px value still written below is illustrative and loses to the construction file.


Dialog, Alert dialog, Drawer / Sheet, Popover, Hover card, Teaching popover (Spotlight),
Card, Panel, Separator, Accordion.

Overlay ground rules for every component here: render in the top layer (`<dialog>`
`showModal()` or the `popover` attribute) with a portal fallback; return focus to the
invoker on close; Esc closes the topmost layer only; shadow steps in the order tooltip <
popover = menu < toast < drawer < dialog; one scrim at a time even when dialogs nest.

---

## Dialog

**Job:** a focused task or decision layered over the page.
**Aliases:** Dialog (PRI SHA FLU M3 MUI), Modal (GEI CAR OAI), Modal dialog (ATL), sheet / alert (HIG).

### Anatomy

```
 ░░░░░░░░░░░░░░░░░░░░░░ scrim ░░░░░░░░░░░░░░░░░░░░░░░░░░░
 ░ ┌surface (radius lg, shadow top step, max-height: 100dvh - 2 x margin)──────┐ ░
 ░ │ header: [icon?] [eyebrow?]                                   [actions] [x] │ ░
 ░ │         Title                                                              │ ░
 ░ │         Subtitle / description                                             │ ░
 ░ ├────────────────────────── rule appears only when body is scrolled ─────────┤ ░
 ░ │ body (the only scrolling region; padding-inline = header's)                │ ░
 ░ │   ┌ inset section: full-bleed muted band with top and bottom rules ┐       │ ░
 ░ ├────────────────────────── rule appears only when more content below ───────┤ ░
 ░ │ footer: [start slot: checkbox / link / step count]     [Cancel] [Primary]  │ ░
 ░ └─────────────────────────────────────────────────────────────────────────────┘ ░
 parts: root, scrim, surface, header, icon, eyebrow, title, subtitle, header-actions, close,
        body, inset, footer, footer-start, footer-actions
```

Header, body, and footer share one inline padding value. Title block and close button
share a row; close is optically aligned so its glyph (not its hit box) lines up with the
padding edge: offset the button by (button size - icon size) / 2.

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| width | xs 296-320, sm 400, md 480-520, lg 640, xl 800, 2xl 960, `auto` (hug, min 250), `full` (viewport minus margin); always `max-inline-size: calc(100vw - 2 x margin)` | | PRI(296, 320, 480, 640) ATL(400, 600, 800, 968) CAR(xs, sm, md, lg) MUI(xs to xl, fullWidth) OAI(min 250, max 450) |
| height | `auto` (hug to max), fixed sm 480 / lg 640 (stable height for tabbed or stepped content), `full` | | PRI |
| position | center (default), `top` (pinned about 10-15vh from top: for search and command), left / right (this is Drawer), responsive object: narrow -> `bottom` sheet or `fullscreen` | | PRI(position, align) M3(full-screen) ATL(full-screen mobile) |
| modality | `modal` (scrim, focus trap, page inert), `non-modal` (no scrim, page stays interactive, no trap), `alert` (modal + no light dismiss: see Alert dialog) | | FLU(modalType) |
| scrim | dimmed (default), transparent, blurred | | FLU(dimmed, transparent) OAI |
| scroll | `inside` (body scrolls, header and footer fixed; scroll-shadow / rule appears when scrolled) and `outside` (whole surface scrolls within the viewport) | | ATL(inside, outside) MUI(paper, body) SHA(sticky footer) GEI(sticky) CAR(fade) |
| header | title only; title + subtitle; leading icon; `eyebrow` label above the title; hero layout (icon or illustration centred above a centred title); header actions slot; with Tabs under the title; back button for multi-step; visually hidden title allowed (must still exist) | | PRI(subtitle) CAR(label) M3(hero icon) FLU(title action) SHA(AlertDialogMedia) |
| close | x button top-end (default); none (`showCloseButton=false`, requires a footer close); close in footer as text button; all three | | SHA FLU |
| body | default padding; `flush` (no padding, for lists, tables, media); inset bands; two-column with a left Nav (settings dialog, width xl+, fixed height) | | GEI(inset) NOT FIG |
| footer | end-aligned (default); start-aligned; space-between with a start slot; `fluid` / stacked full-width buttons (narrow and xs); single button; 3 buttons (tertiary start, two end); full-bleed edge-to-edge split buttons | primary button is inline-end on web; stacked order = primary on top | FLU(actions position, fluid) CAR(1-3 buttons, split) GEI(single, disabled actions) HIG(stacked) |
| tone | default; `danger` (destructive primary, optional danger icon in the header); `warning` | | ATL(appearance) CAR(danger) PRI(buttonType) |
| dismissal | Esc, scrim click, close button each independently configurable; `onClose(gesture)` reports which (`close-button`, `escape`, `scrim`); blocked dismissal gives a subtle shake or pulse | | PRI(gesture) ATL GEI(control outside clicks) OAI(shake) |
| focus | `initialFocus` target; default = first focusable, or the surface itself when the body is long text; destructive dialogs default-focus Cancel; `returnFocus` target | | PRI(initialFocusRef, returnFocusRef) GEI FLU |
| function | nested dialogs (second stacks above, first dims and scales .98; one scrim); multi-step with Stepper or "Step 2 of 4" in footer-start and a progress variant; draggable by header (non-modal); resizable; keep-mounted vs unmount on close; loading body (skeleton) and busy footer (primary shows spinner, others disabled) | | FLU(nested) ATL(stackIndex) CAR(progress) MUI(draggable) FIG |
| motion | enter: fade + scale .96 -> 1 + 8px rise, 200ms; exit 150ms; bottom sheet slides; reduced-motion: fade only | | |

### Markup

```html
<dialog class="area-dialog area-dialog--md" aria-labelledby="dt" aria-describedby="dd">
  <header class="area-dialog__header">
    <div class="area-dialog__heading">
      <h2 class="area-dialog__title" id="dt">Rename project</h2>
      <p class="area-dialog__subtitle" id="dd">Links to the old name keep working.</p>
    </div>
    <button class="area-button area-button--icon-only area-dialog__close area-button--ghost" aria-label="Close">…</button>
  </header>
  <div class="area-dialog__body">…</div>
  <footer class="area-dialog__footer">
    <div class="area-dialog__footer-start"></div>
    <div class="area-dialog__footer-actions">
      <button class="area-button area-button--ghost">Cancel</button>
      <button class="area-button area-button--solid">Rename</button>
    </div>
  </footer>
</dialog>
```

```css
.area-dialog { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; padding: 0; border: 0;
  inline-size: min(var(--_w), calc(100vw - 2 * var(--area-dialog-margin)));
  max-block-size: calc(100dvh - 2 * var(--area-dialog-margin)); overflow: hidden; }
.area-dialog__body { overflow: auto; overscroll-behavior: contain; }
.area-dialog::backdrop { background: var(--area-scrim); }
/* scroll-driven header / footer rules, with a JS data-attribute fallback */
@supports (animation-timeline: scroll()) { /* toggle rule opacity from body scroll position */ }
@container (max-width: 360px) { .area-dialog__footer-actions { flex-direction: column-reverse; } .area-dialog__footer-actions > * { inline-size: 100%; } }
```

### Alert dialog

Same surface, stricter contract: `role="alertdialog"`, no scrim dismissal, no x button by
default, requires title + description, 1-2 actions, default focus on the least destructive
action. Sizes `sm` (about 320, centred text, stacked or 50/50 buttons, optional media icon
on top) and `default` (about 420-480, start-aligned). Variants: confirm, destructive
confirm (danger primary; optional type-to-confirm input that enables the button when the
resource name matches), acknowledgment (single "OK"), unsaved changes (three actions:
Discard, Cancel, Save). Sources: SHA(AlertDialog size default, sm; Media) PRI(ConfirmationDialog
confirmButtonType normal, primary, danger; overrideButtonFocus) FLU(modalType alert) HIG.

### Demo list

1 default form dialog. 2 widths. 3 fixed heights with tabs. 4 scroll inside (long body,
rules appear) vs outside. 5 header forms: subtitle, icon, eyebrow, hero, with tabs.
6 close modes. 7 flush body with a list; inset band. 8 footer layouts incl. start slot and
fluid. 9 danger. 10 non-modal draggable. 11 top-positioned. 12 nested. 13 multi-step.
14 busy footer + skeleton body. 15 settings dialog two-column. 16 narrow: bottom sheet and
fullscreen. 17 Alert dialog: confirm, destructive with type-to-confirm, acknowledgment,
unsaved changes, sm size with media. 18 stress: 200% zoom, long German buttons, RTL.

### Pitfalls

Whole surface scrolling with the footer lost below the fold. Different inline padding in
header / body / footer. Close button misaligned with the title's cap height. Missing
`aria-labelledby`. Focus sent to the close button by default. Page scroll not locked or
layout shifting when the scrollbar disappears (use `scrollbar-gutter: stable`).

---

## Drawer / Sheet

**Job:** a panel that slides from a viewport edge for secondary tasks, details, or
navigation, keeping page context. **Aliases:** Sheet (SHA GEI HIG), Drawer (FLU GEI MUI SHA
vaul), Side panel, Side sheet and Bottom sheet (M3), side peek (NOT).

| Axis | Value | Sources |
| --- | --- | --- |
| side | inline-end (default), inline-start, bottom, top | SHA(top, right, bottom, left) FLU(start, end, bottom) |
| type | `overlay` (modal with scrim), `overlay` non-modal (no scrim, page interactive), `inline` (in layout flow, pushes content, optional 1px separator on its open edge) | FLU(inline, overlay; separator) M3(standard, modal) |
| size | sm 320, md 400-480, lg 592-640, xl 940, `full`; bottom: `auto` (hug), half, full, **snap points** | FLU(320, 592, 940, full) SHA(vaul snap points) |
| bottom sheet | drag handle (32-36 x 4 pill, centred, 8 from top), drag to resize between snap points and drag down to dismiss with velocity threshold, background page scales .96 with radius (iOS style, optional), nested scroll hand-off | SHA(Drawer) M3 HIG GEI(Drawer) |
| structure | header (title, subtitle, close, back, header navigation toolbar), body (scroll), footer (actions; sticky); same shared padding rule as Dialog | FLU(DrawerHeaderNavigation) |
| function | resizable by dragging the inner edge (min / max, double-click resets, keyboard arrows on the separator with `role="separator" aria-valuenow`); multi-level (push a second drawer over the first, first offsets 16-24px); toggle between side peek / centre peek / full page | FLU(resizable, multi-level) NOT |
| responsive | side drawer becomes a bottom sheet or full-screen on narrow | PRI(position responsive) |
| motion | slide in 250-300ms ease-out, slide out 200ms; scrim fades; reduced-motion: fade | |

Semantics: modal drawer = Dialog contract (`<dialog>`). Inline drawer = `<aside>` /
`role="complementary"` with a labelled toggle button (`aria-expanded`, `aria-controls`).
Demos: four sides; sizes; overlay / non-modal / inline with a page mock; header navigation;
sticky footer form; bottom sheet with handle and snap points; resizable; multi-level;
record detail side peek over a table; mobile nav drawer; RTL (inline-end flips).

---

## Popover

**Job:** contextual, interactive content anchored to a trigger: small forms, pickers,
filters, details. Non-modal by default.
**Aliases:** Popover (OAI PRI SHA FLU CAR MUI), Popup and Inline dialog (ATL), Context card (GEI), flyout.

### Build list

| Axis | Value | Sources |
| --- | --- | --- |
| surface | `surface` (default elevated card + stroke), `inverted`, `accent` / brand, `translucent` (backdrop blur) | FLU(brand, inverted) OAI(translucent) CAR(highContrast) |
| padding size | none (flush content: lists, calendars), sm 8, md 12, lg 16-20 | FLU(small, medium, large) |
| width | `auto`, fixed tokens xs 192 / sm 256 / md 320 / lg 480 / xl 640, number, `matchTrigger`; min (OAI default min 300) and max; height tokens + `overflow` | PRI(width and height tokens) OAI(width, minWidth, maxWidth) |
| arrow / caret | none (default for compact systems) or with arrow; 12 caret positions; arrow inherits fill and stroke | PRI(caret x 12) FLU(withArrow) CAR(caret) |
| placement | side x align + offsets (OAI side offset 8), collision flip / shift (`avoidCollisions`), `autoAlign`, custom anchor element or virtual anchor (pointer, text selection), `inline` render | OAI SHA(PopoverAnchor) FLU CAR MUI(anchorOrigin, transformOrigin) |
| trigger | click (default), hover with open / close delays (`showOnHover`), context (`openOnContext`), focus, controlled `open`, programmatic | OAI(showOnHover, hoverOpenDelay) FLU(openOnHover, openOnContext, mouseLeaveDelay) |
| structure | free content; header (title + description + close), body, footer actions; tabbed; "tab tip" (popover attached flush to a toolbar tab, no gap) | SHA(PopoverHeader, Title, Description) CAR(tab tip) |
| focus | `autoFocus` first focusable (default on click), none on hover; `trapFocus` option for form popovers (then it is `role="dialog" aria-modal`) | OAI(autoFocus) FLU(trapFocus) |
| dismissal | outside click, Esc, `closeOnScroll`, blur out, explicit close; blocked dismissal shake | FLU OAI(shake) PRI(onClickOutside, onEscape, ignoreClickRefs) |
| function | nested popovers / menus inside; draggable detached panel (Figma-style picker: drag by header, stays open, becomes non-anchored); pin | FIG |

Semantics: trigger `aria-haspopup="dialog" aria-expanded aria-controls`; content
`role="dialog"` + label. Tab order continues from the trigger into the popover and back
out (if portalled, manage it). Use `popover="auto"` + `anchor-name` / `position-anchor`
with `position-try-fallbacks`; JS fallback for older engines.

### Hover card

Hover / focus-triggered preview of a link's target (person, page, repo). Open delay about
500-700ms, close delay about 300ms, pointer can travel into the card, never holds
essential actions, not opened on touch (the link just navigates). Content recipe: Persona
header, 2-3 lines, meta row with icons, optional media top. Sources: SHA(HoverCard)
GEI(Context Card, Relative Time Card) NOT(page preview).

### Teaching popover / Spotlight

Onboarding callout anchored to a feature. Parts: optional media (aspect presets short /
medium / tall), title, body, footer (secondary "Skip" + primary "Next"; layout horizontal or
vertical), page count "2 of 4" and dot navigation for multi-step carousels, close. Accent
(brand) surface is the common default. Optional pulsing beacon on the target and a cut-out
scrim highlighting it (ATL Spotlight). Sources: FLU(TeachingPopover, mediaLength,
footerLayout, carousel) ATL(Spotlight, Onboarding) M3(rich tooltip).

Demos (all three): default click popover with a small form; surfaces; padding sizes;
widths; with arrow across 12 placements; hover trigger; header / footer structure; flush
list content; trap-focus form; nested menu; match-trigger width; detached draggable panel;
hover card on a user link and a page link; teaching popover single, with media, 4-step
carousel, with beacon + cut-out.

---

## Card

**Job:** a bounded group of related content and actions representing one object.
**Aliases:** Card (PRI SHA FLU M3 MUI), Tile (CAR), Material (GEI surface presets), gallery card (NOT).

### Anatomy

```
 ┌card──────────────────────────────────────────────┐   horizontal orientation
 │ ┌media / preview (bleeds to card edge)─────────┐ │   ┌────────┬───────────────────────────┐
 │ │                                   [badge]    │ │   │ media  │ header / content / footer │
 │ └──────────────────────────────────────────────┘ │   └────────┴───────────────────────────┘
 │ header: [avatar|icon]  Title            [action] │
 │                        Description               │
 │ content                                          │
 │ footer: meta ·  meta              [Button] […]   │
 └──────────────────────────────────────────────────┘
 parts: root, media, header (media-slot, title, description, action), content, footer,
        overlay-link?, selection-control?
```

Header grid: `[media auto] [text 1fr] [action auto]`, action aligned to the **title line**
and spanning both rows without stretching them (SHA does this with a 2-row grid and
`has-[card-action]` column). Section gap and padding are the same token (SHA 24 / 24; use
Area's compact equivalent, likely 12-16). Media bleeds: negative margin or `overflow:
hidden` on the card with media first; inner media radius = card radius - border.

### Build list

| Axis | Value | Sources |
| --- | --- | --- |
| variant | `outline` (default for a light, soft-stroke system: surface + 1px stroke + smallest shadow), `elevated` (surface + shadow step, no stroke), `soft` / filled (muted fill, no stroke), `ghost` / subtle (transparent until hover), `solid` (tone or inverted, content uses on-emphasis tokens) | FLU(filled, filled-alternative, outline, subtle) M3(elevated, filled, outlined) MUI-Joy(plain, outlined, soft, solid) |
| padding / size | none, condensed (sm), normal (md), spacious (lg): sets padding **and** section gap | PRI(none, condensed, normal) FLU(small, medium, large) SHA |
| radius | md, lg | PRI(medium, large) |
| orientation | vertical, horizontal (media start; media fixed width or ratio); responsive switch by container query | FLU MUI-Joy |
| media | top bleed, inset (padded, own radius), cover (full background + gradient scrim + on-image text), aspect ratios 16:9 / 4:3 / 1:1 / 3:2, overlay slots on media corners (badge, menu, logo), icon tile instead of image | PRI(Card.Image, Card.Icon) FLU(CardPreview + logo) MUI(CardMedia, CardCover, CardOverflow) NOT |
| header | title; + description; + leading avatar / icon; + action (button, menu, badge); eyebrow / metadata line | SHA(CardAction) FLU(CardHeader image, header, description, action) PRI(Metadata) MUI(CardHeader) |
| footer | actions end / start / space-between; meta row with icons and separators; full-bleed footer band with top rule (`border-t`), muted fill option | SHA FLU(CardFooter action) |
| dividers | none; rules between header / content / footer (padding adjusts automatically when ruled) | SHA(`[.border-b]:pb-6`) |
| interactive | static; **link card** (whole card navigates: one stretched link on the title via `::after { inset: 0 }`, other controls raised above it with `z-index`); **button card**; hover = stroke one step stronger + shadow one step up + optional 1px lift; focus ring on the card | FLU(focusMode) CAR(clickable tile) MUI(CardActionArea) |
| selectable | checkbox card (multi) and radio card (single): control top-end or top-start, selected = accent stroke 1.5-2px (drawn inset so size is unchanged) + soft tint; whole card toggles; floating selection checkbox that appears on hover in galleries | FLU(selected, floating action) CAR(selectable, radio tile) SHA(choice card) GEI(Choicebox) |
| expandable | chevron toggles a below-the-fold region | CAR(expandable tile) |
| state | rest, hover, active, focus-visible, selected, disabled, loading (skeleton recipe), dragging (shadow top step, slight rotate) | M3(dragged) |
| layout helpers | CardGrid (auto-fill min 240-280, gap 12-16), equal-height cards with footers pinned (`grid-template-rows: auto 1fr auto`), list of horizontal cards | |

Demos: default; variants; paddings; with media top / inset / cover; ratios; horizontal;
header forms; footer forms; ruled; link card with an inner menu that still works; button
card; checkbox and radio cards; expandable; skeleton; grid with equal heights; stat card,
file card, user card, integration card (icon tile + switch), pricing card recipes; in dark.

Pitfalls: nested interactive elements inside a card-wide `<a>`. Media corners not
matching the card radius. Header action stretching the title row. Selected stroke changing
card size. Equal-height grids with floating footers.

---

## Panel

**Job:** a structural surface that groups a region of UI: sidebars, inspector sections,
settings groups, wells. **Aliases:** Panel / Surface / Well, Material (GEI), Fieldset
(settings group), Section.

| Axis | Value | Sources |
| --- | --- | --- |
| level | surface levels as tokens: `base` (page), `raised` (card on page), `sunken` / well (inset muted fill, optional inner hairline), `overlay`; each level defines fill, stroke, radius, shadow together | GEI(Material base, small, medium, large, tooltip, menu, modal, fullscreen) |
| nesting | panel-in-panel: inner radius = outer radius - padding (floor 2); thin outer padding 2-4 for the layered "container inside container" look; stroke steps down one level inside | product pattern |
| structure | header (title, description, leading icon, end actions: icon buttons, menu, switch), body, footer; header sizes sm 28-32 / md 36-40; header `sticky` inside a scrolling panel; divider between header and body optional | FIG NOT |
| body layout | padded; `flush` (rows / lists / tables touch the edges, rows get their own inline padding); **row list** with hairline dividers inset to the text column (settings group) | HIG(grouped list) NOT |
| collapsible | header is a disclosure button (chevron start or end), remembers state, animates height | FIG |
| resizable | splitter handle between panels: 1px line with an 8px hit area, hover / drag accent, double-click reset, keyboard arrows, min / max, collapse at threshold, horizontal and vertical, optional grip | SHA(Resizable) |
| scroll | custom scroll area with auto-hiding thin scrollbar, edge fades, sticky header shadow | SHA(ScrollArea) GEI(Scroller with fade + buttons) |
| toolbar | ActionBar in header or footer: icon buttons with dividers and overflow menu; sizes sm / md / lg; `flush`; gap none / condensed | PRI(ActionBar) FLU(Toolbar) |
| tone | neutral; soft tone tint for callout panels | |
| state | default, disabled (whole panel `inert` + muted), loading, drop-target (dashed accent stroke + tint) | |

Demos: levels side by side; nested panels showing radius maths; header forms; settings
group with row list (label + description start, control end); flush list; collapsible
stack (inspector); resizable two- and three-pane; scroll with sticky header; toolbar header;
drop target; sidebar recipe; dark theme.

---

## Separator

| Axis | Value | Sources |
| --- | --- | --- |
| orientation | horizontal, vertical (needs `align-self: stretch` or explicit height; in toolbars height = 60% of control) | SHA FLU MUI |
| emphasis | subtle, default, strong, accent | FLU(subtle, default, strong, brand) |
| style | solid, dashed, dotted; thickness 1 (default), 2 | MUI |
| inset | none (full bleed), inset start (aligns to text column after an icon / avatar), inset both (`middle`), custom inset var | FLU(inset) MUI(fullWidth, inset, middle) M3 |
| content | label or icon in the line, `align=start|center|end`; label is muted text sm with 8-12 inline padding; variants: text, icon, Chip / Badge, **button** ("Show more" with chevron, GEI) | FLU(alignContent) MUI(textAlign) SHA(FieldSeparator "Or continue with") GEI(Show more) |
| spacing | `spacing` prop adds symmetric block (or inline) margin from the space ramp; default 0 so layout owns spacing | |
| semantics | decorative (`role="none"`, default) vs semantic (`<hr>` / `role="separator"`, with `aria-orientation` when vertical) | SHA(decorative) |
| contextual | inside Menu, Toolbar / ActionBar, ButtonGroup, list rows, Breadcrumb; each parent sets its own margins via CSS vars | PRI SHA |

Hairline quality: on 2x+ screens offer a true hairline option (`border-width: 0.5px` with
1px fallback). Colour comes from the stroke tokens, never from opacity on black.

---

## Accordion

**Job:** stack of headers that each reveal a region. **Aliases:** Accordion (SHA FLU CAR
MUI), Collapse (GEI), Details (PRI), Disclosure (HIG), toggle block (NOT).

```
 ┌───────────────────────────────────────────────┐
 │ [icon]  Billing and plans            [meta] v │  <- header = heading element containing one button
 ├───────────────────────────────────────────────┤
 │ region content, aligned to the title's left   │
 │ edge (after the icon / chevron column)        │
 └───────────────────────────────────────────────┘
```

| Axis | Value | Sources |
| --- | --- | --- |
| type | `single` (one open; `collapsible` lets it close), `multiple`; standalone Disclosure (one item) | SHA FLU(collapsible, multiple) |
| variant | `plain` (hairline dividers between items, no box), `contained` (one outlined box, internal dividers), `separated` (each item its own card, gap 4-8), `soft` (open item or hover gets muted fill), `flush` (no inline padding, aligns to page text) | CAR(isFlush) MUI NOT |
| chevron | end (down, rotates 180) default; start (right, rotates 90); plus / minus; none; custom | FLU(expandIconPosition start, end) CAR(align start, end) |
| size | sm / md / lg / xl header heights and type sizes | FLU(small to extra-large) CAR(sm, md, lg) GEI(small) |
| header content | title; + description under title; leading icon; trailing meta (badge, count, status); trailing actions that are **siblings** of the trigger button, not children; `inline` header (hug width) | FLU(icon, inline) MUI(actions) |
| ordered | numbered items | CAR(ordered) |
| state | rest, hover, focus-visible, open, disabled item, skeleton | CAR |
| function | default open; controlled; expand all / collapse all; keep-mounted vs unmount; find-in-page friendly (`hidden="until-found"`); deep link opens the matching item; nested accordions | |
| motion | height 200-250ms via `interpolate-size: allow-keywords` / `::details-content` where supported, grid-rows 0fr -> 1fr fallback; content fades 150ms; reduced-motion: instant | |

Semantics: prefer native `<details name="group">` for single-type CSS-only builds
(exclusive groups come free); React build uses `h3 > button[aria-expanded][aria-controls]`
+ `role="region" aria-labelledby`. Keyboard: Enter / Space toggle; optional Up / Down /
Home / End between headers (FLU `navigation=linear|circular`).

Demos: default single; multiple; variants; chevron positions and plus / minus; sizes; with
description, icon, meta, sibling actions; ordered; disabled; nested; settings page recipe;
FAQ recipe; inside a Panel (inspector sections); RTL.
