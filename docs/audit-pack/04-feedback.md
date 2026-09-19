# 04 Feedback

> **v2 note.** This file is the capability checklist (variants, anatomy, behaviour, demos). It is not a source for sizes, padding, radius or shape: those come only from `construction/04-feedback.md`. Any px value still written below is illustrative and loses to the construction file.


Alert, Banner, Inline message, Toast, Tooltip, Progress (bar, circle, segmented, meter),
Spinner, Loading dots, Shimmer text, Skeleton, Empty state, Error state.

---

## Alert (with Banner and Inline message as sibling components)

Three jobs, one tone system. Build all three; do not make them one component with a
`type` prop, because their roles, placement, and dismissal rules differ.

| Component | Job | Placement | Live role | Aliases |
| --- | --- | --- | --- | --- |
| **Alert** | Section-level message about the content near it | In flow, inside a page section, card, or dialog body | `role="status"` (info, success) or `role="alert"` (danger, warning when it appears dynamically); none when present at load | Alert (OAI SHA MUI), Flash (PRI), MessageBar (FLU), Note (GEI), Section message (ATL), Inline / Actionable notification and Callout (CAR), Callout block (NOT) |
| **Banner** | System or page-level message | Full-bleed at the top of the app or page, above the header, pushes content | same rule | Banner (PRI ATL GEI), Project Banner (GEI), global message |
| **Inline message** | One line of validation or status next to a control or row | Inline, no box | tied via `aria-describedby`, or `status` | InlineMessage (PRI), Field message (FLU), Error (GEI), InlineLoading text (CAR) |

### Alert anatomy

```
 ┌───────────────────────────────────────────────────────────────────────────────┐
 │ [icon]  Title (strong)                                  [Action] [Action] [x] │  actions=end
 │         Description text wraps here and aligns to the title's left edge,      │
 │         never under the icon.  Inline link.                                   │
 │         [Primary action] [Secondary]                                          │  actions=bottom
 └───────────────────────────────────────────────────────────────────────────────┘
 grid: [icon auto] [content 1fr] [actions auto] [dismiss auto]; icon aligns to the first text line
 parts: root, icon, content, title, description, actions, dismiss, progress? , timestamp?
```

### Alert build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| variant | `soft` (default): tone-tinted fill, tone icon, **neutral strong text** (not tone text, for contrast) | | OAI MUI(standard) PRI ATL FLU |
| variant | `outline`: surface fill, 1px tone stroke (or neutral stroke + tone icon) | | OAI MUI(outlined) SHA(default) GEI(default) |
| variant | `solid`: tone fill, on-tone text and icon; actions switch to on-emphasis button styles | | OAI MUI(filled) GEI(fill) CAR(high contrast) ATL(bold) |
| variant | `accent-bar`: surface or soft fill with a 3px tone bar on the inline-start edge | | CAR |
| variant | `plain`: no box; icon + text only (for use inside cards and popovers) | | NOT |
| tone | neutral, info, success, warning, danger, discovery (upsell / announcement), accent | default icons per tone: info circle, check circle, warning triangle, error octagon / x circle, sparkle | OAI PRI(critical, info, success, upsell, warning) FLU ATL(+discovery) GEI(+violet, cyan) CAR |
| size | sm (padding 8 x 12, text sm, icon 14-16), md (12 x 16), lg (16 x 20, title one step up) | | GEI(small, default, large) |
| content | title only; description only; title + description; with inline link; with list in description; custom icon; emoji icon (NOT callout); `icon=false` | | OAI(indicator false) MUI NOT |
| content | caption / timestamp line (muted, last row) | | CAR |
| actions | none; 1-2 buttons; `actionsPlacement=end` (same row, vertically centred to the first line for single-line alerts, top-aligned otherwise) or `bottom` (under description, aligned to text column); link-style actions | | OAI PRI(actionsLayout default, inline, stacked) FLU ATL(link actions) |
| layout | `multiline` (default), `singleline` (everything on one row, description truncates), `auto` (single until it does not fit, then reflow: FLU does this by measuring) | implement `auto` with a container query | FLU PRI(layout compact) |
| dismiss | none; close icon button (ghost, sm) top-end; `onDismiss`; auto-collapse animation (height + opacity 200ms) | | PRI FLU CAR MUI |
| shape | rounded (Area card radius); `square` / `flush` (no radius, no side borders) for use edge-to-edge inside a card or dialog | | FLU(shape) PRI(flush, full) |
| function | collapsible details ("Show details" disclosure with stack trace or list); progress bar along the bottom edge for ongoing operations; group with stacking animation and max count | | FLU(MessageBarGroup animate) ATL(expandable) |
| label | optional bold prefix inside the text ("Note:", "Warning:") instead of a separate title; can be disabled or customised | | GEI |

### Banner specifics

Full width, no radius, 1px bottom rule, padding-inline matches the page gutter, content
max-width matches the page container, min-height 40-48. Single-line centred layout
(icon + text + link, dismiss pinned end) and start-aligned layout with end actions. Tones
as Alert plus `announcement` (neutral or inverted). Sticky option. Stacking rule: one
banner at a time, highest severity wins (document it). Layout `compact` (PRI) reduces
block padding. Narrow: actions drop under text, full-width buttons (`stacked`).
Project-scoped variant: sits under the page header inside the page container with radius
(GEI Project Banner), with status icon, message, and one call to action.

### Inline message specifics

`[icon 12-16] text`, tone text colour, no box, font sm, icon aligned to first line, gap 4-6.
Tones: danger, warning, success, neutral / `unavailable`, plus loading (spinner replaces the
icon; success check with a short delay before it resets: CAR InlineLoading statuses
`active / finished / error / inactive`). Sizes sm / md (PRI). GEI's Error form: bold
"Error:" prefix, optional link "Learn more", sizes sm / md / lg.

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/04-feedback.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Markup

```html
<div class="area-alert area-alert--soft area-alert--warning area-alert--md" role="status">
  <svg class="area-alert__icon" aria-hidden="true">…</svg>
  <div class="area-alert__content">
    <div class="area-alert__title">Payment method expires soon</div>
    <div class="area-alert__description">Update your card before 30 Sep to avoid interruption.</div>
  </div>
  <div class="area-alert__actions"><button class="area-button area-button--sm">Update card</button></div>
  <button class="area-button area-button--icon-only area-alert__dismiss area-button--ghost area-button--sm" aria-label="Dismiss">…</button>
</div>
```

```css
.area-alert { display: grid; grid-template-columns: auto minmax(0,1fr) auto auto;
  column-gap: var(--area-alert-gap); align-items: start; }
.area-alert__icon { margin-block-start: calc((var(--area-alert-line-height) - var(--area-alert-icon-size)) / 2); }
.area-alert--actions-bottom .area-alert__actions { grid-column: 2; grid-row: 2; margin-block-start: var(--area-space-8); }
@container (max-width: 420px) { .area-alert__actions { grid-column: 2; grid-row: 2; } }
```

### Demo list

1 default. 2 variants x tones matrix. 3 sizes. 4 title only / description only / both.
5 actions end / bottom / link. 6 dismissible with collapse. 7 singleline, multiline, auto in
a resizable box. 8 flush inside a card and a dialog. 9 accent-bar. 10 plain. 11 emoji
callout. 12 collapsible details. 13 with progress. 14 group stacking. 15 Banner: top of
app, tones, sticky, narrow stacked. 16 Project banner. 17 Inline message tones + loading +
sizes, under an input and in a table row. 18 stress: long German title, RTL, 200% zoom.

Pitfalls: description starting under the icon. Tone-coloured body text failing contrast on
soft fills. `role="alert"` on static page-load content. Solid variant reusing default
buttons that vanish on the tone fill. Icon centred vertically against a three-line message.

---

## Toast

**Job:** brief, non-blocking confirmation or status that appears over the UI and leaves
by itself. **Aliases:** Toast (SHA Sonner, FLU, GEI), Snackbar (M3, MUI), Flag (ATL),
Toast notification (CAR), visual bell (FIG). Primer ships none on accessibility grounds:
record that in the report and keep Area's toasts optional, never the only channel for errors.

### Anatomy

```
 ┌toast (surface, radius, shadow step 3, width 320-380, max 420)────────────┐
 │ [icon|spinner|avatar]  Title                          [Action]   [x]     │
 │                        Description / subtitle                            │
 │                        [Footer action] [Footer action]                   │
 │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ (timeout progress, optional)                           │
 └──────────────────────────────────────────────────────────────────────────┘
 toaster (region) parts: viewport per position, stack; toast parts: root, media, title,
 description, action, cancel, close, footer, progress
```

### Build list

| Axis | Value | Sources |
| --- | --- | --- |
| type | default (no icon), success, info, warning, error, loading (spinner), `promise` (loading then resolves to success / error in place, keeping height animation smooth) | SHA FLU GEI |
| variant | `surface` (default: elevated neutral card + tone icon); `inverted` (dark pill / card on light UI: NOT, FIG, M3); `soft` tone-tinted with tone stroke (`richColors`); `solid` tone fill | SHA(richColors, invert) FLU(inverted) ATL(normal, bold) CAR(lowContrast) M3 |
| shape | card (rounded); pill single-line compact (inverted, bottom-centre) | NOT FIG M3 |
| content | title; title + description; multi-line; custom JSX; with link; avatar media; timestamp / caption | GEI FLU CAR |
| actions | one inline action (text button, end); action + cancel; undo; longer action on its own row (M3 two-line); footer actions row; close button (always, on hover, or never) | SHA GEI(action, undo) M3 FLU(ToastFooter) |
| position | top-start, top-center, top-end, bottom-start, bottom-center, bottom-end; per-position offset; mobile: full-width minus 16 at bottom or top | SHA FLU MUI |
| stacking | `collapsed` stack: newest in front, up to 3 visible, older ones scaled 0.95 / 0.9 and offset 8-16px behind, expands to a gapped list on hover / focus-within; `expanded` always listed with gap 8-12; `limit` and queue | SHA(expand) FLU(limit) ATL(FlagGroup) M3(one at a time) |
| timing | `duration` default 4-5s; per-type defaults (error: persistent or 8-10s); `Infinity` / `preserve`; pause on hover, focus, and window blur; optional timeout progress bar | SHA FLU(pauseOnHover, pauseOnWindowBlur) GEI(preserve) |
| function | update an existing toast by id; dismiss by id and dismiss all; de-duplicate identical messages (count badge "x3"); swipe / drag to dismiss in the direction of the nearest edge; priority ordering | SHA FLU |
| motion | enter: slide 8-16px from the edge + fade 200ms; exit: fade + scale .98 150ms; stack reflow 200ms; reduced-motion: fades only | SHA |
| API | imperative `toast()` + `<Toaster>`; declarative CSS-only markup for static docs | SHA FLU |

### Behaviour

Toaster is a landmark: `role="region" aria-label="Notifications"` with a hotkey to move
focus into it (Sonner: Alt+T; FLU configurable). Each toast `role="status"`
(`aria-live="polite"`); error toasts `role="alert"`. Toasts never steal focus. Actions
inside must also be reachable elsewhere (WCAG 2.2.1 timing): anything with an action gets
a longer default duration and pauses while focused. Esc dismisses the focused toast.
Render the viewport with `popover="manual"` so it sits in the top layer above dialogs.

### Demo list

1 default. 2 types incl. loading and promise. 3 variants surface / inverted / soft / solid.
4 pill compact. 5 title + description, multi-line, with link, with avatar. 6 action, action
+ cancel, undo, footer actions. 7 close button modes. 8 positions (six buttons that fire
into each corner). 9 collapsed stack vs expanded. 10 persistent. 11 timeout progress + pause
on hover. 12 update by id. 13 de-dupe counter. 14 over an open dialog. 15 mobile width.
16 static gallery of every toast state (CSS-only) for visual review.

Pitfalls: toasts rendered under dialogs. Stack scaling from the wrong transform origin.
Height jump when promise resolves. No pause on hover. Live region re-announcing the whole
stack on each add (each toast must be its own live node, inserted once).

---

## Tooltip

**Job:** a short, non-interactive label or description for the element under the pointer
or focus. Anything interactive is **Popover** / **Toggletip**, below and in file 05.

### Build list

| Axis | Value | Sources |
| --- | --- | --- |
| variant | `inverted` (default: ink surface, paper text; the common product look), `surface` (elevated light card with stroke), tone variants (success, warning, danger, discovery) for validation hints | SHA NOT FIG FLU(normal, inverted) GEI(types) |
| size | `compact` (one line, padding 4 x 6-8, text xs) and `default` (padding 6 x 10, text sm, max-width 240-300, wraps, start-aligned text); `gutterSize` sm / md / lg | OAI(compact, maxWidth 300, gutterSize) |
| arrow | with arrow (6-8px, same fill and stroke as the body, 4px corner clearance) or without | SHA FLU(withArrow) GEI(tip false) MUI |
| content | text; text + Kbd shortcut (plain or inverted Kbd at inline-end, gap 8, or on a muted second line); title + body (rich); icon + text; multi-line | PRI(keybindingHint) SHA NOT FIG M3(rich) |
| placement | 12 positions (4 sides x start / center / end) + offsets; collision flip and shift; `followCursor`; anchor to pointer position | OAI SHA PRI(8 directions) MUI(12, followCursor) ATL(mouse) CAR(12) |
| timing | `openDelay` 150-700ms (OAI 150, FLU 250, Radix 700), `closeDelay`, **skip delay** when moving between adjacent triggers within about 300ms (provider-level), `delay=0` for toolbars | OAI FLU SHA(Provider) GEI(no delay) |
| relationship | `label` (tooltip **is** the accessible name: icon buttons), `description` (adds `aria-describedby`), `inaccessible` (decorative duplicate) | FLU PRI(type label, description) |
| trigger | hover + focus; `desktopOnly` (suppressed on touch); long-press on touch for icon buttons; disabled triggers need the disabled-focusable pattern or a wrapper | GEI FLU |
| function | `forceOpen` for docs; truncation tooltip: shows only when the trigger's text is actually clipped | OAI PRI(Truncate) ATL |
| special | **CopyTooltip**: click copies `copyValue`, text swaps to "Copied" with a check for about 1.5s | OAI |
| special | **Definition tooltip**: dotted-underline term inside prose, opens on hover / focus | CAR |
| special | **Toggletip / InfoTip**: an "i" icon button, click-activated, may contain links; this is a small Popover with `aria-expanded`, not a tooltip. Sizes sm / md / lg; `inline` alignment with label text | CAR(Toggletip) FLU(InfoLabel, InfoButton) |

Geometry: radius = smallest Area radius (4-6); OAI side offset 5; SHA px 12 py 6 text xs;
shadow = smallest overlay step; z above popovers.

Behaviour (WCAG 1.4.13): dismiss with Esc without moving focus; tooltip is hoverable (the
pointer can move onto it without it closing) and persistent until trigger loses hover /
focus; never the only place for essential information; `role="tooltip"` + `id` referenced
by the trigger. Use `popover="hint"` + anchor positioning where supported, JS fallback.

Demos: default on an icon button; variants; compact vs default; arrow on / off; with Kbd
inline and second-line; rich title + body; 12 placements grid; delays and skip-delay across
a toolbar; follow cursor; on a disabled button; truncation-only; CopyTooltip; definition
term in a paragraph; toggletip next to a field label; tone variants; in dark theme.

Pitfalls: tooltip on a non-focusable element. Tooltip as the only label with
`relationship` unset. Arrow colour or stroke mismatched with the body. Delay applied when
sweeping across a toolbar. Flicker when the pointer crosses the gap to the tooltip.

---

## Progress

Four related components with different semantics:

| Component | Semantics | Use |
| --- | --- | --- |
| **Progress bar** | `<progress>` / `role="progressbar"` | a task advancing: upload, import, onboarding |
| **Progress circle** | `role="progressbar"` | same, in tight or tile layouts |
| **Meter / Gauge** | `<meter>` / `role="meter"` | a static measurement in a range: quota, score, health |
| **Segmented / stacked bar** | `role="img"` with text alternative, or a list | composition of parts: storage by type, language mix, strength meter |

### Progress bar build list

| Axis | Value | Sources |
| --- | --- | --- |
| mode | determinate (`value`, `max`), indeterminate (value undefined: a 30-40% wide bar travelling; or a gradient sweep), `buffer` (second lighter fill ahead of the value), `query` (reverse indeterminate) | FLU MUI M3 CAR ATL |
| thickness | xs 2, sm 4, md 6-8, lg 10-12 | FLU(2, 4) PRI(small, default, large) CAR(4, 8) SHA(8) M3(4) |
| shape | pill (default), square | FLU |
| tone | accent, neutral (ink), success, warning, danger; **threshold colouring**: tone chosen from value ranges ("dynamic colours") | FLU(brand, success, warning, error) GEI(dynamic) MUI |
| status | active, finished (success tone + check icon at label end), error (danger tone + icon), paused | CAR |
| label layout | none (needs `aria-label`); label above start + value above end ("64%", "3 of 12 files"); helper text below; `inline`: label, bar, and value on one row; `indented`: bar inset under the label | CAR(default, inline, indented) FLU(Field) PRI(inline) |
| track | visible muted track (default); transparent track; M3 style: gap between fill and track + stop dot at the track end | M3 |
| stops | tick marks / milestones along the bar, optionally labelled | GEI(stops) |
| stacked | multiple `Item` segments in one bar, each with tone and its own label, 1-2px surface gaps between segments, legend below (dot + label + value) | PRI(ProgressBar.Item) |
| motion | value changes animate width 200-300ms linear; optional striped / shimmer overlay while active (`animated`) | PRI(animated) |
| variant | `inverse` for use on solid / dark surfaces | ATL |

### Progress circle / Gauge build list

| Axis | Value | Sources |
| --- | --- | --- |
| size | 16, 20, 24, 32, 48, 64, 96+; stroke = size / 8 to size / 12 (OAI: 28 with stroke 2) | OAI(Indicator size, strokeWidth) GEI(tiny, small, medium, large) MUI(size, thickness) |
| mode | determinate arc from 12 o'clock clockwise; indeterminate (this is Spinner); timed (`maxDuration`: fills over an expected duration and eases asymptotically) | OAI(maxDuration, progress, done) |
| centre content | none; value text ("64"); icon; `done` check that draws in on completion | OAI GEI(showValue) MUI |
| arc | full circle; 270 degree gauge with gap at the bottom; semi-circle | GEI product pattern |
| tone | single; colour scale by value (red to amber to green, reversible); secondary track colour; custom | GEI |
| caps | round (default), butt | |

### Segmented bar / strength meter

N equal blocks with 2-4px gaps; filled count = value; tone by level (1 danger, 2-3
warning, 4 success); label at end ("Strong"). Also the compact Stepper form (file 02).

### Markup

```html
<div class="area-progress area-progress--md area-progress--accent">
  <div class="area-progress__header">
    <label id="pl">Uploading assets</label><span class="area-progress__value">3 of 12</span>
  </div>
  <progress class="area-progress__bar" aria-labelledby="pl" value="3" max="12"></progress>
  <div class="area-progress__helper">About 40 seconds left</div>
</div>
```

Style the native `<progress>` (`::-webkit-progress-bar`, `::-webkit-progress-value`,
`::-moz-progress-bar`; `:indeterminate` for the travelling bar) and give React a `div`
fallback only for stacked bars. Circle: one SVG, two circles, `stroke-dasharray` /
`stroke-dashoffset` from `--_value`, rotated -90deg, `pathLength="100"`.

Demos: bar default; thickness; shapes; tones + thresholds; indeterminate; buffer; label
layouts; statuses; stops; stacked with legend (storage); animated; inverse on solid; circle
sizes; circle with value / icon / done; gauge 270 with colour scale; timed; strength meter;
in-context: upload list row, card footer quota, button with circle.

---

## Spinner, Loading dots, Shimmer text

| Component | Axis | Value | Sources |
| --- | --- | --- | --- |
| Spinner | style | `ring` (270 degree arc over a faint full track, or arc only), `spokes` (8-12 fading ticks, HIG style), `dots` circular | PRI SHA FLU HIG |
| Spinner | size | 12, 14, 16, 20, 24, 32, 48, 64; stroke 1.5-2 up to 24 then size / 12 | PRI(16, 32, 64) FLU(8 sizes) SHA(16) GEI(custom) |
| Spinner | tone | `current` (inherits text colour: default, so it works in buttons), accent, neutral muted, `inverted` | FLU(primary, inverted) |
| Spinner | label | none (needs `aria-label`, default "Loading"); visible label `before / after / above / below` | FLU(labelPosition) PRI(srText) |
| Spinner | function | `delay` (`short` about 300ms, `long` about 1000ms, or ms) before it renders, to avoid flashes; overlay mode (centres over a dimmed, `inert` container) | PRI(delay) FLU(delay) CAR(overlay) |
| Spinner | motion | 0.8-1s linear rotation; reduced-motion: slow opacity pulse, never static | |
| Loading dots | form | three dots, staggered opacity / scale 1.2-1.4s; sizes 2-6px dots; with text before ("Loading"); inherits colour | GEI |
| Shimmer text | form | text with a moving highlight gradient clipped to glyphs, for "Thinking…", streaming placeholders; any heading or text element; `shimmer` on / off; reduced-motion: static muted | OAI(ShimmerText) |
| Inline loading | form | spinner + text that transitions `active` -> `finished` (check, success) -> resets, or `error`; fixed width to avoid shift | CAR |

Markup: `<span class="area-spinner" role="status" aria-label="Loading">` with an SVG
inside, `aria-hidden` on the SVG. In a Button, the spinner replaces the leading icon (or
overlays the label with the label set to `visibility: hidden` so width is preserved) and
the button gets `aria-busy` + `aria-disabled`.

Demos: styles; size ramp; tones on light, dark, and solid; label positions; delay; in
button (leading, replace-label); overlay on a card; loading dots sizes + with text;
shimmer text on body and heading; inline loading lifecycle; page-level centred.

---

## Skeleton

**Job:** reserve the shape of content while it loads.

| Axis | Value | Sources |
| --- | --- | --- |
| primitive | `box` (w, h), `text` (typographic size -> exact line box of that text style, `lines`, last line about 60-80% width, `maxWidth`), `circle` / `avatar` (size, square option), `button`, `icon` | PRI(SkeletonBox, SkeletonText size by type role, SkeletonAvatar) FLU(SkeletonItem circle, square, rectangle; sizes 8-128) CAR(SkeletonText, Placeholder, Icon) MUI(text, circular, rectangular, rounded) |
| shape | rounded (Area radius), pill, square, circle | GEI |
| animation | `shimmer` / wave (gradient sweep 1.5-2s, direction follows `dir`), `pulse` (opacity 1 -> .5), `none` | FLU(wave, pulse) MUI(pulse, wave, false) GEI(no animation) SHA(pulse) |
| appearance | `opaque` (on page surface), `translucent` (alpha fill, for tinted or image surfaces) | FLU |
| function | **wrap mode**: `<Skeleton loading>` around real children measures and matches their box, hides them (`visibility: hidden`, `aria-hidden`), then cross-fades to content | GEI MUI |
| function | `delay` before showing, to skip fast loads; minimum display time to avoid flicker | PRI |
| recipes | per-component skeletons that match real geometry exactly: text block, list row (avatar + 2 lines), card, table (`rows`, `columns`, `cellPadding`), tabs counter, tag, button, form field, chart | PRI(Table.Skeleton) CAR(per-component) |
| sync | all skeletons on a page share one animation timeline (`animation-delay` from a CSS var or `background-attachment: fixed`) so the sweep moves as one | product pattern |

A11y: container gets `aria-busy="true"`; one visually hidden "Loading" status for the
region, not one per bone; bones are `aria-hidden`. Skeleton text height must equal the
final line box so there is zero layout shift when content lands; verify by toggling.

Demos: primitives; text sizes across the type ramp; shapes; animations; translucent on
an image; wrap mode toggling; recipes (list, card, table, form, profile header); synced
sweep across a page; delay; dark theme.

---

## Empty state

**Job:** explain an empty region and offer the next step.
**Aliases:** Blankslate (PRI), Empty (SHA), Empty State (GEI ATL), EmptyMessage (OAI).

```
            ┌────┐
            │icon│   <- media: icon in a soft tile, illustration, avatar group, or none
            └────┘
        No projects yet                      <- title
  Create a project to start collecting       <- description, max-width about 40-48ch, centred
       components and audits.
     [ New project ]  [ Import ]             <- primary + secondary
          Learn more ↗                       <- tertiary link
 parts: root, media, header (title, description), content (actions | input | custom), footer-link
```

| Axis | Value | Sources |
| --- | --- | --- |
| kind | first-use / blank slate (educational, primary CTA), no results (clear filters action), cleared / done ("All caught up"), error (retry), no permission (request access), not found, offline | GEI(blank slate, informational, educational, guide) CAR |
| size | sm (inline in cards, menus, table bodies: icon 16-20, text sm, no or link action), md, lg (full page: illustration, title large) | PRI(small, medium, large) OAI(sm, md) ATL(narrow, wide) |
| media | none; plain icon; icon in soft rounded tile (`variant=icon`); illustration / image; avatar group; spinner (loading) | SHA(EmptyMedia default, icon) PRI(Visual) ATL(image, isLoading) |
| tone | neutral (default), warning, danger for the icon | OAI(color secondary, danger, warning) |
| frame | none; `border` solid; dashed outline (drop target); muted fill; subtle gradient; `spacious` / `narrow` paddings | PRI(border, narrow, spacious) SHA(outline dashed, gradient) |
| fill | `static` (in flow), `absolute` (centres in a positioned parent), `none` | OAI(fill) |
| layout | centred stack (default); start-aligned compact; horizontal (media left, text right) for wide short regions | product pattern |
| content | 0-3 actions (primary, secondary, tertiary link); input group (search or invite by email); custom | SHA ATL PRI |

Title is a real heading at the right level (`as` prop). Demos: each kind; sizes; media
kinds; frames; fills inside a 300px-high panel; horizontal; with input; in a table body
(spanning all columns); in a menu / combobox listbox ("No results"); in a card; full page.

## Error state

Page-level and region-level failure. Build on Empty state's layout with: danger or
warning icon, title, human message, optional error code / request id in Code with a copy
button, collapsible technical details, Retry (primary) + secondary (Go back, Contact
support), and an inline compact form (icon + "Couldn't load comments." + Retry link) for
rows and cards. Async containers (Tree, Table, Menu) get an error slot using the compact
form; PRI ships `ErrorDialog` with `onRetry` / `onDismiss` for TreeView and DataTable.
