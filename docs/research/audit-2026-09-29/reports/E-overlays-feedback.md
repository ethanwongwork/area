# E: Overlays and feedback audit

Families: Popover, Dialog, Tooltip, Hover card, Toast, Alert (with banner), Progress, Spinner and Skeleton, plus the shared overlay behavior (`overlay.ts`, `Overlays.tsx`, `docs/specs/overlay.md`).

Method: I read the code only. Nothing was run in a browser. Where a finding depends on runtime behavior, it says "from code reading".

Paths are relative to the repo root. Abbreviations used below:
- `surface.css` means `packages/styles/src/components/surface.css`
- `display.css` means `packages/styles/src/components/display.css`
- `primitives.tsx` means `packages/react/src/components/primitives.tsx`
- `Overlays.tsx` means `packages/react/src/components/Overlays.tsx`
- "the gallery" means `apps/docs/src/demos/gallery.tsx`

## Summary

- **The paint is coherent; the rules written about it are not.** The floating lift, border, 12px corner, concentric corner controls and 14/20 muted descriptions all match across Popover, Toast, Alert, Dialog and Hover card. The written rules disagree with the code in three places:
  - surface titles are weight 500, while DESIGN_SYSTEM says titles are 400 (E-1);
  - the Dialog close button is 32px, while the nested-close rule says 28px (E-2);
  - DESIGN_SYSTEM's radius paragraph says every surface uses the container radius, which no longer describes Dialog, Tooltip, Card or the banner (E-14).
- **Close controls are built four ways.** Dialog, Popover and Toast use a ghost Button. Alert uses its own button with a different ink, hover plate and × glyph, and Badge uses a third glyph size (E-2, E-3). The APIs also differ: `onClose`, `onDismiss`, `showCloseButton`, and a close label on Dialog that cannot be changed (E-6).
- **Behavior gaps with real user impact (from code reading):**
  - pressing Escape to hide a tooltip also closes the Popover or Dialog it sits in (E-4);
  - a Dialog opened from a `trigger` with no `title` has no accessible name (E-7);
  - an indeterminate Progress bar under reduced motion freezes into what looks like a 35% determinate bar (E-9);
  - Progress, Spinner and Tooltip have no forced-colors rules (E-10);
  - Input's action hint is a second tooltip without a delay or Escape dismissal (E-16);
  - Hover card still positions through the old CSS-anchor path, 4px from its link, while Popover sits 8px away (E-5).
- **Specs lag the code.** Tooltip, Spinner, Skeleton, Progress, Alert, Popover and Hover card specs each still describe superseded values. `overlay.md` is still "in review" although Tooltip, Popover and Hover card are Complete. The handoff still points at `GalleryReviewSpinner`, which no longer exists (E-24).
- **Open owner questions:**
  - the Progress rail (#dd against Figma's #e6/#f5; Switch's off track has already moved to #e2), and a Spinner track that is now darker than the rail (E-22);
  - whether Toast gets a Toaster region (E-11);
  - leftover Pass-review components for Dialog, Popover, Toast and Alert (E-26).

## Findings

### E-1  Surface titles are weight 500; DESIGN_SYSTEM says titles are 400
- Families: Popover, Dialog, Alert, Toast, Hover card (shared with Card and Panel)
- Category: docs-drift / system-rule
- Severity: high
- Type: DECISION
- What: Every surface title renders at `--area-weight-strong` (500). DESIGN_SYSTEM says weight is 400 "for text and every title or heading" and reserves 500 for labels on fills. `typography.md` contradicts itself. The Alert spec's Decisions table still says the title is 400.
- Evidence:
  - Code at 500 (`weight-strong` is `wght-500`, `packages/tokens/src/axes/typography.ts:131`):
    - `surface.css:570` `.area-alert__title { font-weight: var(--area-weight-strong) }`
    - `surface.css:825` Dialog title
    - `surface.css:979` Popover title
    - `surface.css:1297` Toast title
    - Hover card reuses `PopoverTitle`
  - Rules at 400:
    - `docs/DESIGN_SYSTEM.md:41-43` "400 for text and every title or heading; 500 only for labels on fills"
    - `docs/specs/typography.md:47` "400 for … all titles and headings"
    - `typography.md:50` "surface titles move to 400"
    - `docs/specs/alert.md:67` and `:119` "title · weight / ink | 400"
  - Rules at 500:
    - `typography.md:11` "Strong is used on … every surface title"
    - `typography.md:85-86` role table "14/20 strong", "16/24 strong"
    - `popover.md` pass 3 (owner asked)
  - The handoff's owner direction says "Lighter UI: regular-weight titles" (`.Codex/HANDOFF.md:17`).
- Options:
  - A: Keep 500 for surface titles that sit at body size (14/20 and 16/24). Rewrite DESIGN_SYSTEM:41 and typography.md:47/50 as "400 for text and display titles; 500 for labels on fills and for surface titles that are the size of their body text". Fix alert.md.
  - B: Return every surface title to 400, carried by colour or size. This undoes the owner's explicit Popover pass 3 request.
  - Recommended: A. The owner asked for a strong Popover title because size cannot separate it from the description (popover.md, pass 3). Code, gallery and captures all agree on 500; only the prose lags.
- Visual: Popover, Toast, Alert and Dialog headers side by side, titles at 400 and at 500.

### E-2  Dialog's close button is 32px; the nested-close rule says 28px
- Families: Dialog (against Popover, Toast, Alert)
- Category: system-rule / consistency
- Severity: medium
- Type: DECISION
- What: DESIGN_SYSTEM says nested dismiss and close actions are 28px with the small-button radius. Dialog's close is a 32px md Button with an 8px radius, by the Dialog pass's own decision. The Alert spec's peer table claims Dialog's close uses `radius-control-sm`, which is wrong.
- Evidence:
  - `DESIGN_SYSTEM.md:76` "*Nested dismiss and close actions* are 28px, the small-button radius"
  - `primitives.tsx:1326` `<Button … size="md" iconOnly className="area-dialog__close"`
  - `dialog.md:97` "close · control | 32px ghost neutral Button (md)"
  - `alert.md:158` "Dialog close | icon action radius | radius-control-sm | same | match" (stale)

| Surface | Close box | Radius | Offset from corner | Surface corner |
|---|---|---|---|---|
| Popover | 28 (Button sm) | 6 | 6 / 6 | 12 |
| Toast | 28 (Button sm) | 6 | 6 / 6 | 12 |
| Alert | 28 (own button) | 6 | 6 / 6 | 12 |
| Dialog | **32 (Button md)** | **8** | 8 / 8 | 16 |

- Options:
  - A: Keep 32 on Dialog. Amend the rule to "28px on compact surfaces; a standalone Dialog's close matches its 16/24 title row (ChatGPT 32, Primer 32)". Fix alert.md:158.
  - B: Move the Dialog close to 28. At 7 / 7 it would still be concentric with a 13px corner, or at 8 / 8 with a 14px corner, which reopens the corner decision the handoff closed at 16.
  - Recommended: A. The owner settled the Dialog corner at 16 through this close (handoff, 2026-09-28). ChatGPT and Primer both use 32. Only the rule text needs the exception.
- Visual: Popover and Dialog top-right corners at 2×, showing both closes and their concentric arcs.

### E-3  Alert's dismiss is built differently from every other close
- Families: Alert (against Toast, Popover, Dialog, Badge)
- Category: consistency / visual
- Severity: medium
- Type: FIX
- What: Toast, Popover and Dialog close with `<Button variant="ghost" tone="neutral">` and the Area `dismiss` glyph. Alert renders its own `<button>` with:
  - a filled Fluent path instead of the stroked Area glyph;
  - full tone ink instead of the ghost Button's lighter ink;
  - a hover plate of 12% ink, even on the neutral grey ground.

  On a neutral Alert, the hover plate comes out much darker than every other close's plate.
- Evidence:
  - `primitives.tsx:201` `<button className="area-alert__dismiss">` with `AlertDismissIcon`, a filled path, at `:208-211`
  - `surface.css:719` `.area-alert__dismiss:hover { background-color: color-mix(in srgb, var(--_fg) 12%, transparent) }`
  - `button.css:388` ghost ink `color-mix(fg-default, fg-muted 75%)` (about #58)
  - `primitives.tsx:1197` Toast uses `<Glyph name="dismiss" />`

| | Glyph | Rest ink (light, neutral) | Hover plate |
|---|---|---|---|
| Toast / Popover / Dialog close | Area stroke, 1.125 | ≈ #58 (ghost Button) | `bg-component-hover` ≈ #f3 |
| Alert dismiss, neutral | Fluent fill path | `fg-default` #28 | 12% of #28 over #f7 ≈ #de (arithmetic) |
| Alert dismiss, tones | Fluent fill path | tone ink | 12% of the tone ink |

- Visual: a neutral Alert and a Toast, each with its dismiss hovered, at 3×.

### E-4  Escape on a tooltip also closes the Popover or Dialog underneath (from code reading)
- Families: Tooltip, Hover card, Popover, Dialog
- Category: interaction
- Severity: medium
- Type: FIX
- What: The Tooltip listens for Escape in the capture phase on `window` and neither stops nor prevents the event. The browser then applies its own Escape handling: the topmost auto popover closes, and a modal `<dialog>` closes through its close watcher. So dismissing a tooltip over a control inside a Popover or Dialog closes the container too. Hover card has the same pattern on `document`. WCAG 1.4.13 expects Escape to dismiss only the extra content.
- Evidence:
  - `Overlays.tsx:216-221` `addEventListener("keydown", onKey, true)` then `hide(0)`, without `preventDefault` or `stopPropagation`
  - `HoverCard.tsx:44-46` has the same shape
  - `overlay.md` Verification lists "nested popovers" as unverified
- Visual: a Dialog with a focused icon button and its tooltip, first pressing Escape (both close), then the expected result (only the tooltip closes).

### E-5  Hover card uses the old positioning path, 4px from its link, while Popover uses 8px
- Families: Hover card, Popover (overlay behavior)
- Category: consistency / docs-drift
- Severity: medium
- Type: DECISION
- What: Popover, Menu and Tooltip position with JavaScript `computePosition` (flip, shift, `data-side`, origin). Hover card still uses CSS anchor positioning through `.area-popover-anchor`, with a hard-coded 4px offset and no `align` or `offset`.
  - The `.area-popover-anchor` rules in surface.css now exist only for Hover card; `AnchoredPopover` no longer renders the wrapper.
  - `popover.md` still describes the CSS-anchor path and a 4px offset.
  - The gallery comment says "4px away".
- Evidence:
  - `surface.css:906-920` (`--_popover-offset: 4px; /* spec */`)
  - `hover-card.css:34-37`
  - `HoverCard.tsx:55` wraps the trigger in `span.area-popover-anchor`
  - `Overlays.tsx:18` `POPOVER_OFFSET = 8`
  - `popover.md:104-105, 109`
  - `hover-card.md:40` "Popover: 320, 4 from the link"
  - the gallery at line 1704 says "4px away"
  - manifest `popoverAnchor` description (`manifest.ts` about line 568)

| | Engine | Gap | Flip | `data-side` / origin |
|---|---|---|---|---|
| Popover | JS `computePosition` | 8 (+17 with arrow) | yes, with shift | yes |
| Menu / Tooltip | JS | 4 | yes | yes |
| Hover card | CSS `position-area` | 4 | `position-try-fallbacks` | no (scales from its centre) |

- Options:
  - A: Move Hover card onto `useAnchoredPosition` with `align="start"`, offset 8 as Popover's, and the 300ms bridge. Delete the popover-anchor rules and the manifest entry.
  - B: Keep CSS anchoring for Hover card, but set its gap to Popover's 8 and document it as a separate engine.
  - Recommended: A. One engine means one flip, shift and origin behavior. The CSS path cannot report its side, which is the reason given in `overlay.md` "Decisions" for moving Popover off it.
- Visual: a Popover and a Hover card open under identical links, with the gap and the scale origin marked.

### E-6  The overlay and feedback APIs name the same ideas differently
- Families: all overlays, Alert, Toast
- Category: api
- Severity: medium
- Type: DECISION
- What: Open state, delays, the close callback, the close label and the default side are named or defaulted differently from one family to the next.
- Evidence (`primitives.tsx:989-1052, 1175-1300`; `HoverCard.tsx:5-14`; `manifest.ts:549-556`):

| | open / defaultOpen | onOpenChange | trigger | side default | align / offset | Delay | Close callback | Close label |
|---|---|---|---|---|---|---|---|---|
| Popover | yes | yes | ReactNode | **manifest `top`, anchored `bottom`** | yes | — | none (no PopoverClose) | consumer |
| Tooltip | yes | yes | ReactNode | top | yes | `delay` | — | — |
| Hover card | **no** | yes | ReactElement (required) | bottom | **no** | `openDelay` / `closeDelay` | — | — |
| Dialog | **no** | yes, trigger only | ReactElement | — | — | — | `onClose` + `showCloseButton` | **fixed "Close dialog"** |
| Alert | — | — | — | — | — | — | `onDismiss` | `dismissLabel` ("Dismiss alert") |
| Toast | — | — | — | — | — | — | `onDismiss` | `dismissLabel` ("Dismiss notification") |
| Badge (peer) | — | — | — | — | — | — | `onDismiss` | `dismissLabel` (**required**) |
| CommandPalette (peer) | yes | yes | — | — | — | — | — | — |

  - A Dialog cannot be opened without its trigger. That rules out the common "menu item opens a confirmation" pattern, which then needs hand-written `<dialog>` markup.
  - Popover's manifest default is `side: "top"`, but `AnchoredPopover` defaults to `"bottom"` (`Overlays.tsx:75`), so framework-free markup and React disagree.
- Options:
  - A: Standardise:
    - `open`, `defaultOpen` and `onOpenChange` on every overlay, Dialog and Hover card included;
    - `onDismiss` and `dismissLabel` for every close, with Dialog keeping `showCloseButton`;
    - one delay vocabulary (`delay` and `closeDelay`);
    - a Popover manifest default side of `bottom`.
  - B: Keep today's props and document the differences.
  - Recommended: A. The `useOpenState` hook already exists (`overlay.ts`) and CommandPalette already follows the pattern.
- Visual: a props matrix like the table above, with the gaps highlighted.

### E-7  A Dialog opened from a trigger without a title has no name; its props reach the wrong element
- Families: Dialog
- Category: a11y / api
- Severity: medium
- Type: FIX
- What: With `trigger`, the `role` and the ARIA naming move to the native `<dialog>`, but `{...rest}` and `ref` still go to the inner surface `div`, which then has no role. A consumer who passes `aria-label` because there is no `title` names a generic `div`, and the modal itself stays unnamed. The consumer also cannot reach the `<dialog>` element to set `onCancel` or call `close()`.
- Evidence:
  - `primitives.tsx:1314-1319` surface `ref={ref}`, `{...(trigger ? {} : { role: "dialog", … })}`, `{...rest}`
  - `primitives.tsx:1350-1354` `<dialog … {...labelled}>`, where `labelled` is empty when there is no `title` or `description`
- Visual: an accessibility-tree snippet of a trigger Dialog with and without a `title`.

### E-8  Popover is not labelled by its title, has no close part, and uses a fixed h2
- Families: Popover, Hover card
- Category: a11y / api
- Severity: medium
- Type: FIX
- What:
  - `role="dialog"` is always set, but `PopoverTitle` is never wired to `aria-labelledby`. Every demo repeats the visible title in `aria-label="Title"`, and the anchored demo has no name for its role unless the consumer adds one.
  - There is no `PopoverClose`, so a close button in an anchored Popover's header does nothing unless the consumer controls `open`.
  - `PopoverTitle` is a fixed `h2`, and Hover card places it inside running text, which adds an h2 to the page outline for every hover card.
- Evidence:
  - `Overlays.tsx:101` `role: "dialog"` with no labelling
  - `primitives.tsx:1048` `<h2 className="area-popover__title">`
  - `apps/docs/src/demos/overlays.tsx:6,16` `aria-label="Title" role="dialog"`
  - the gallery at line 1067 (Hover card `PopoverTitle`)
  - `PanelSection` already has a `headingLevel` prop, which Popover could copy (the handoff mentions it)
- Visual: a Popover's accessibility name before and after automatic wiring.

### E-9  Reduced motion freezes indeterminate Progress into what looks like 35% done
- Families: Progress, Spinner
- Category: interaction / visual
- Severity: medium
- Type: FIX
- What: The indeterminate bar is a 35%-wide segment. Under `prefers-reduced-motion` or `data-area-motion="none"`, its animation is removed and it rests at the inline start. It then looks exactly like `value={35}`, which is the confusion the CSS comment says the travelling segment exists to prevent. Spinner uses the opposite policy under reduced motion: it slows to 1.8s instead of stopping, because "a still arc reads as a frozen screen".
- Evidence:
  - `display.css:289-296` (comment and `inline-size: 35%`)
  - `display.css:312` and `:315-318` `animation: none`
  - `display.css:320-322` Spinner slowed to 1.8s
- Options (inside the FIX): either show a still full-width stripe or pulse under reduced motion, or let the segment travel slowly as the Spinner does. The motion axis `none` still has to stop the loop.
- Visual: a determinate bar at 35% beside the reduced-motion indeterminate bar. They are identical today.

### E-10  Progress, Spinner and Tooltip have no forced-colors rules
- Families: Progress, Spinner, Tooltip (Skeleton is decorative)
- Category: a11y
- Severity: medium
- Type: FIX
- What:
  - The Progress fill and the Spinner arc are painted with `background-color` or a masked `background`. Forced-colors mode replaces those with system colours, so both are likely to disappear.
  - Tooltip has no border, so with its fill and shadow forced, it has no edge against the page.
  - `forced-colors.css` covers Slider and Switch but none of these.
  - `tooltip.md` claims "Forced colors … follow the surface rules in surface.css", but surface.css has no forced-colors block.
- Evidence:
  - `packages/styles/src/forced-colors.css:1-62` (no progress, spinner or tooltip rules)
  - `display.css:219-247, 265-281`
  - `surface.css:1201-1230` (tooltip has no border)
  - `tooltip.md:115`
  - The handoff lists forced colors (execution) as unverified. This finding is from code reading and needs a browser check.
- Visual: the three components in Windows High Contrast emulation, expected against current.

### E-11  Toast's announcements, timing and stacking are left entirely to consumers
- Families: Toast (against Alert)
- Category: a11y / interaction
- Severity: medium
- Type: DECISION
- What:
  - Toast's live region (`role="status"` on the content) is created together with its text. Screen readers often do not announce a live region that arrives already filled; it needs to exist first (from code reading, not tested with a screen reader).
  - A danger Toast is `status` while a danger Alert is `alert`.
  - There is no region, timer, pause on hover or focus, stacking or landmark. A consumer who adds a timer to an Undo toast risks failing WCAG 2.2.1 (timing adjustable).
  - The spec's job line says it "leaves on its own", while the prior decision says it has no timer.
- Evidence:
  - `primitives.tsx:1195` `role="status" aria-atomic="true"` inside each Toast
  - `primitives.tsx:177` Alert `role={tone === "danger" ? "alert" : "status"}`
  - `toast.md` Job ("leaves on its own or when dismissed") against its Owner decisions ("not a global queue or automatic timer") and Open questions ("A toaster … out of scope")
- Options:
  - A: Add a `Toaster` region: one live region that exists before any toast, pause on hover and focus, a default duration (none for toasts with actions), stacking, and a hotkey to reach it.
  - B: Keep Toast presentational, and document a required region and timing recipe in the spec and docs.
  - Recommended: A, eventually. B is the minimum now. Either way, match Alert's rule and give a danger Toast `role="alert"`.
- Visual: three stacked toasts in a region, with the pause-on-hover state.

### E-12  Tone sets and neutral icon ink differ between Alert, Toast and Badge
- Families: Alert, Toast (Badge peer)
- Category: consistency / api
- Severity: low
- Type: DECISION
- What: The three families support different tones, list them in different orders, and paint the neutral icon differently.
- Evidence:
  - `manifest.ts:535` Alert: neutral, accent, info, danger, warning, success
  - `manifest.ts:588` Toast: neutral, info, danger, warning, success
  - `manifest.ts:320` Badge: neutral, accent, info, success, warning, caution, danger, discovery (+ inverted)
  - `surface.css:559` Alert icon `var(--_alert-icon, var(--_fg))`, with neutral `--_fg: fg-default` at `:738`
  - `surface.css:1312` Toast neutral icon `fg-muted`

| | accent | caution | discovery | Neutral icon ink |
|---|---|---|---|---|
| Alert | yes | no | no | `fg-default` |
| Toast | **no** | no | no | `fg-muted` |
| Badge | yes | yes | yes | — |

- Options:
  - A: One feedback tone set for Alert and Toast (neutral, accent, info, success, warning, danger, in Badge's order) and one neutral icon ink (muted, as Toast).
  - B: Keep the differences and document why.
  - Recommended: A, since DESIGN_SYSTEM:38-40 asks for the same semantic roles to be reused.
- Visual: Alert and Toast neutral tiles side by side (icon ink), and the tone matrix.

### E-13  Alert and Toast set the title-to-description gap 1px tighter than Popover's rule
- Families: Alert (multiline), Toast, Popover
- Category: visual / consistency
- Severity: low
- Type: FIX
- What: All three use the same 14/20 title over a 14/20 description. Popover chose a 5px row gap to reach "baseline to cap 15.1", the number the typography rule sets ("15 to 15.6 on every surface"). Alert and Toast use 4, which by the same arithmetic gives about 14.1. This is derived, not measured.
- Evidence:
  - `surface.css:956` `row-gap: 5px; /* spec: … 15 */`
  - `surface.css:680-684` Alert multiline `gap: var(--area-space-4)`
  - `surface.css:1296` Toast content `gap: var(--area-space-4)`
  - `typography.md:94`
- Visual: Popover, Toast and Alert title groups overlaid on one baseline grid.

### E-14  DESIGN_SYSTEM's radius text no longer describes the surfaces
- Families: all surfaces
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: DESIGN_SYSTEM says "Every surface, Card included, uses the container role" and "Card is twice the container radius". Neither is true any more. Each surface now has its own documented rule, and that is fine, but the guide should list the rules.
- Evidence: `DESIGN_SYSTEM.md:171-173`. The actual values at the Standard preset:

| Surface | Corner | Source |
|---|---|---|
| Tooltip | 10 | `radius-control-lg` (`surface.css:1211`) |
| Popover, Menu, Hover card, Toast, Alert | 12 | `radius-container` |
| Alert banner | 6 | `radius-control-sm` (`surface.css:628`) |
| Dialog | 16 | control-md radius + the 8px close offset, capped at 2× container (`surface.css:767`); owner kept it at 16 (handoff) |
| Card | 22 / 24 / 28 (sm / md / lg, per the handoff) | control-md + inset + step (`surface.css:44`) |

- Visual: a corner-radius strip of all the surfaces at the Standard, Subtle and Sharp presets.

### E-15  The floating lift is a literal written out nine times
- Families: Popover, Menu, Dialog, Toast, Hover card (and peers)
- Category: system-rule
- Severity: low
- Type: DECISION
- What: The shared lift `0 20px 24px …, 0 5px 8px …` is written out in nine separate rules instead of one elevation role. The cohesion test guards the string, not a token.
- Evidence:
  - `surface.css:782, 871, 1182, 1277`
  - `toolbar.css:76`, `command-palette.css:42`, `navigation.css:330`, `color.css:213`, `calendar.css:45`
  - `packages/react/tests/cohesion.test.mjs:45-60`
- Options:
  - A: Add a `shadow-float` semantic role alongside `shadow-1` and `shadow-2`, and consume it everywhere.
  - B: Leave it until the token phase.
  - Recommended: A, at the token phase. It is one line per rule, and it would let the Surface axis reach floating layers, which Card's own halo already excludes.
- Visual: none needed (list of rules).

### E-16  Input's action hint is a second tooltip without the Tooltip's behavior
- Families: Tooltip (Input's InputAction)
- Category: interaction / a11y
- Severity: medium
- Type: FIX
- What: InputAction's hint reuses the `.area-tooltip` look (after the cohesion audit), but it runs on CSS `:hover` and `:focus-within`. That means:
  - no 500ms delay;
  - it shows on a mouse click as well as keyboard focus;
  - it cannot be dismissed with Escape (WCAG 1.4.13);
  - it is not in the top layer, so an ancestor with `overflow` can clip it;
  - it is always 4px below and aligned to the end, with no flip.
- Evidence:
  - `packages/react/src/components/Input.tsx:71`
  - `packages/styles/src/components/input.css:210-226`
  - compare with `Overlays.tsx:201-244`
- Visual: an InputAction hint and an anchored Tooltip over the same button, with a timeline of hover, focus and Escape.

### E-17  A trailing keycap in a tooltip is not centred when it uses the small Kbd
- Families: Tooltip
- Category: visual
- Severity: low
- Type: FIX
- What:
  - The tooltip's end inset beside a trailing Kbd is fixed at 4, which equals the vertical inset only for the 20px keycap. The anchored behavior demo uses the 16px `size="small"` Kbd: 4 at the end against (28 − 16) / 2 = 6 top and bottom (arithmetic).
  - inset.css has `kbd--small` variants for Button, Input and Menu, but none for Tooltip.
  - Separately, the static tooltip tiles sit 8px from their button, while an anchored tooltip sits 4px away (`TOOLTIP_OFFSET`).
- Evidence:
  - `surface.css:1236-1238`
  - `apps/docs/src/demos/overlays.tsx:48` `size="small"` against the gallery at line 2036 (default 20px)
  - `kbd.css:57-65`
  - `inset.css:120-122, 141-142`
  - the gallery at lines 2022-2048 (`gap: var(--area-space-8)`)
- Visual: a tooltip with a 20px and a 16px keycap at 4×, with the insets marked.

### E-18  Tooltip and Hover card respond to input differently
- Families: Tooltip, Hover card
- Category: interaction
- Severity: low
- Type: DECISION
- What:
  - Tooltip opens only for `pointerType === "mouse"`; Hover card also accepts pen.
  - On keyboard focus, Tooltip opens at once but Hover card waits 700ms.
  - Tooltip listens for Escape on `window` in the capture phase; Hover card on `document` in the bubble phase.
  - Neither shows on touch. That is documented for Hover card and undocumented for Tooltip.
  - A tooltip on a `disabled` button never opens, because disabled buttons receive no pointer events.
- Evidence: `Overlays.tsx:228, 232`; `HoverCard.tsx:53, 59, 44-45`
- Options:
  - A: One shared hover-intent helper (mouse and pen; focus-visible opens at once; one Escape handler).
  - B: Keep the differences and document them.
  - Recommended: A.
- Visual: an input matrix (mouse, pen, touch, keyboard) by component.

### E-19  Dialog has no enter or exit motion; the anchored surfaces fade and scale
- Families: Dialog, Toast (against Popover, Menu, Tooltip, Hover card)
- Category: consistency
- Severity: low
- Type: DECISION
- What: Anchored surfaces fade and scale from 0.97 over 150ms (Tooltip fades over 100ms). The modal Dialog and its scrim appear instantly. Toast has no enter motion because the consumer places it.
- Evidence: `surface.css:1325-1348` (anchored only); `surface.css:749-760` (Dialog modal, no transition)
- Options:
  - A: Give Dialog the same 150ms fade and 0.97 scale, and fade the scrim with `@starting-style` and `overlay allow-discrete`, gated by the motion axis.
  - B: Keep it instant.
  - Recommended: A.
- Visual: a frame strip of Popover open against Dialog open.

### E-20  Modal Dialog leaves page scroll and a few edge cases to the browser
- Families: Dialog
- Category: interaction
- Severity: low
- Type: FIX
- What:
  - The page behind a modal still scrolls: native `showModal()` does not lock scroll, and no rule does.
  - Sizes use `100vh`, which is too tall on mobile when the browser toolbar is showing.
  - A backdrop "click" is detected as `target === currentTarget`, so a drag that starts inside the dialog and ends on the scrim closes it (from code reading).
- Evidence:
  - no `:has(dialog[open])` or `overflow` rule in `packages/styles/src`
  - `surface.css:753-754, 775`
  - `primitives.tsx:1357`
- Visual: none needed.

### E-21  Status semantics for Spinner and Progress are fragile
- Families: Spinner, Progress
- Category: a11y
- Severity: low
- Type: FIX
- What:
  - A labelled Spinner is an empty `role="status"` element named only by `aria-label`. Live regions announce changes to their content, not their name, so it is likely silent (unverified with a screen reader). An unlabelled Spinner is hidden; the spinner spec keeps a default "Loading" name as an open question.
  - Progress renders `role="progressbar"` with no name unless `label` is given.
  - Progress passes the raw `aria-valuenow` while clamping the visible width. DESIGN_SYSTEM says visible and announced values must agree.
- Evidence:
  - `primitives.tsx:397-403` (Spinner)
  - `primitives.tsx:424-435` (Progress: `pct` clamped, `aria-valuenow={value}` raw)
  - `spinner.md` feedback log, 2026-09-27 ("Open for the owner: a default 'Loading' name")
- Visual: none needed.

### E-22  The Progress rail question is still open, and Spinner's track is now darker than the rail
- Families: Progress, Spinner (Slider and Switch as peers)
- Category: visual
- Severity: low
- Type: DECISION
- What:
  - The rail shared by Progress and Slider is about #dd. Figma draws #e6 (usage bar) and #f5 (meter), and Untitled uses #e5 (handoff: "open").
  - Switch's off track has since moved to `edge-control` (≈ #e2, owner, 2026-09-28), so the "one rail" rule now covers two of the three.
  - Spinner's track is the arc ink at 25%: about #c9 on white (0.25 × 40 + 0.75 × 255). That is darker than the rail, the reverse of the relation `spinner.md` and `progress.md` document (a track lighter than the rail).
- Evidence:
  - `display.css:272` (rail = `fill-toggle` mixed 20% toward the surface)
  - `slider.css:27`
  - `switch.css:20` (`--_off: var(--area-edge-control)`)
  - `display.css:233` (Spinner track)
  - `progress.md:107, 124`
  - `spinner.md:72`
- Options:
  - A: Move the Progress and Slider rail to Switch's `edge-control` (≈ #e2), giving one rail across all three again. Keep the Spinner at 25%.
  - B: Lighten the rail to about #e6 (Figma, Untitled).
  - C: Keep #dd.
  - Recommended: A. It reuses a value the owner already approved for Switch, moves toward the references, and restores one shared rail.
- Visual: Progress, Slider, a Switch off track and a Spinner in a row, with the rail at #dd, #e2 and #e6.

### E-23  Alert links take different ink in-place and in the banner
- Families: Alert
- Category: visual
- Severity: low
- Type: DECISION
- What: In the single-line and multiline layouts, the link sits inside the muted description and inherits the muted ink. In the banner layout, the link sits outside the description and takes the alert's tone ink. The same `link` prop therefore renders in two colours.
- Evidence:
  - `primitives.tsx:188-194` (link inside `area-alert__description` unless it is a banner)
  - `surface.css:571` (description `fg-muted`)
  - `surface.css:578-580` and `:648-650` (`color: inherit`)
- Options:
  - A: Tone ink for the link in every layout.
  - B: Muted everywhere.
  - Recommended: A. A link is the actionable text and should not read as supporting copy.
- Visual: a Link tile beside a Banner tile.

### E-24  Specs and the handoff are stale for these families
- Families: all nine plus overlay behavior
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: Many "Anatomy", "Decisions" and "Peers" rows describe superseded values, and the status lines disagree with the owner's completion records.
- Evidence:

| Doc | Stale line | Code now |
|---|---|---|
| `tooltip.md:71` | anatomy "padding 4/8" | 4 / 10 (`surface.css:1204`) |
| `tooltip.md:122-123` | Kbd "radius 2"; Tooltip "radius 6" | 6 and 10 |
| `tooltip.md:143` | "hover/focus behaviour (not implemented)" | implemented 2026-09-27 |
| `tooltip.md:115` | forced colours "follow surface.css" | no rules (E-10) |
| `spinner.md:46, 73` | "2s linear", conic arc with `::after` dots | 1s; SVG masks |
| `spinner.md:72, 81` | track `bg-component-active` #eee; reduced motion stops it | 25% ink; reduced motion slows it |
| `spinner.md:67` | "2.5px md option is in the Pass review" | `GalleryReviewSpinner` removed; not taken |
| `skeleton.md:60-62, 106, 120` | 1.4s, `rectangle` / `rounded` shapes | 3s; shapes block / text / circle |
| `progress.md:107, 124` | Spinner track #eee; rail "shared with Slider and Switch" | 25% ink; Switch moved to `edge-control` |
| `alert.md:65-67, 119, 158` | padding 8; title 400; Dialog close `radius-control-sm` | 10 / 12; 500; 8 |
| `popover.md:104-105, 109` | offset 4, CSS anchor, `.area-popover-anchor` wrapper | 8, JS, no wrapper |
| `hover-card.md:40` | "4 from the link" per popover.md | Popover 8 |
| `overlay.md:3` | "in review" | Popover, Tooltip, Hover card all Complete (`component-status.mjs:30, 39-40`) |
| `.Codex/HANDOFF.md:108` | "Tooltip is still marked Complete; its behavior is new and unreviewed" | Batch 17 approved Tooltip, but the live pass only compared static paint (`tooltip.md` Visual pass); behavior timing was never owner-reviewed |
| `.Codex/HANDOFF.md:278` | "a 2.5px md option waits in `GalleryReviewSpinner`" | removed; the spec log says not taken |

- Visual: none needed (table).

### E-25  Gallery copy and icons break the demo vocabulary
- Families: Hover card, Popover, Alert, Toast
- Category: gallery
- Severity: low
- Type: FIX
- What: Several gallery tiles invent content or pick icons and actions inconsistently.
  - **Invented copy.** Hover card tiles tell a story ("Writes the analytical engine notes… Joined 1843", "What ships this quarter: the inspector foundation, overlays…"). Popover's anchored tile uses "Dimensions / Set the size of the layer." and the Popover default tile uses "1 of 5 / Prev / Next", while its other tiles use Title / Description. DESIGN_SYSTEM's Example copy section says "Do not invent a product, a person or a domain".
  - **Icons.** The Alert danger tile uses the × `DismissIcon`, the confusion the Toast pass removed. The Alert warning tile uses `InfoIcon`, while Toast and the Alert docs page use `AlertIcon`.
  - **Actions.** Alert actions are solid `Button size="sm"`; the Toast action is `variant="outline"`.
- Evidence:
  - the gallery at lines 1066-1086, 1706-1722, 44 and 1983-1984
  - `gallery-variants.tsx:17`
  - `display.tsx:68-69`
  - the gallery at lines 46 and 1989
- Visual: Alert tone tiles and Toast tone tiles side by side, showing the icons and action treatments.

### E-26  Pass-review components and unused demos are still in the gallery source
- Families: Dialog, Popover, Toast, Alert
- Category: gallery
- Severity: low
- Type: DECISION
- What:
  - `build.mjs` still renders `GalleryReview<Slug>` rows at the top of each family. Before/after rows remain for Dialog, Popover and Toast, and Alert's sits in `reviews.tsx`, which the handoff says to "remove once the owner has seen them". All four families are now Complete.
  - `gallery-variants.tsx` has three Popover arrow demos (`GalleryPopoverArrow`, `-Left`, `-Right`) that no tile uses. They duplicate the gallery's `PopoverArrowSample` and put the description in the body, against the pass-2 header rule. The anchored `GalleryOverlayPopover` does the same.
- Evidence:
  - `apps/docs/scripts/build.mjs:1049-1054`
  - the gallery at lines 737, 1688 and 2005
  - `apps/docs/src/demos/reviews.tsx:77`
  - `.Codex/HANDOFF.md:340-341`
  - `gallery-variants.tsx:19-24, 69-81`
  - `apps/docs/src/demos/overlays.tsx:9`
- Options:
  - A: Remove the reviews and dead demos now that the families are Complete.
  - B: Keep them until the owner confirms.
  - Recommended: A, after one confirmation, since the handoff already sets that condition.
- Visual: the Dialog section header as it renders today, with the review rows.

### E-27  Demo accessibility and tile naming
- Families: Skeleton, Tooltip, Popover, Toast, Spinner
- Category: gallery / a11y
- Severity: low
- Type: FIX
- What:
  - The Skeleton card tile says it is announced with `aria-label="Loading card"` on a `Card`, but Card is a role-less `div`, so the label is not exposed. It needs `aria-busy` on a region.
  - Tile titles use different vocabularies: Tooltip "With indicator", "Right", "Bottom"; Popover "Arrow / top"; Toast "Success", whose tile id is `default`, beside a separate "Default" tile.
  - `SpinnerDefault` on the docs page shows sm, md and lg in one container, and `ToastDefault` there is the success tone, not the neutral default.
- Evidence:
  - the gallery at line 1884; `skeleton.md` Behavior section
  - `build.mjs:891-897, 974-975, 515`
  - `display.tsx:108-113, 162-165`
- Visual: none needed.

### E-28  Literal values outside private slots, and palette rungs, in these families
- Families: Popover, Skeleton, Toast, Spinner, Alert
- Category: system-rule
- Severity: low
- Type: DECISION
- What:
  - AGENTS.md puts measured literals in private `--_*` properties marked `/* spec */`. Several sit directly on real properties: Popover `row-gap: 5px`, the Skeleton last line `65%` and `50px`, the Toast fallback width `360px` (no `/* spec */`), and the Spinner's reduced-motion `1.8s`.
  - Alert and Toast icon colours name palette rungs (`--area-blue-500`, `--area-red-500`, `--area-orange-550`, `--area-green-550`) in 8 declarations. DESIGN_SYSTEM:37 says components consume semantic colours.
- Evidence:
  - `surface.css:956, 1280, 740-743, 1314-1317`
  - `display.css:202-203, 322`
- Options:
  - A: Move them into `--_*` slots now, and add a "vivid icon" semantic role at the token phase.
  - B: Leave them until tokenisation.
  - Recommended: B for the colours, which are already marked spec. A for the four non-slot literals, since the change is trivial.
- Visual: none needed.

## Confirmed consistent

- Popover, Menu, Dialog and Toast paint the same floating lift, and Hover card gets it through `.area-popover`. Tooltip keeps its own smaller lift, as DESIGN_SYSTEM:93 says (`cohesion.test.mjs:45`).
- Every floating surface draws a 1px `border-decorative` border (Popover, Menu, Dialog, Toast, Hover card).
- Corner controls are concentric with their surfaces: Popover, Toast and Alert at 6 / 6 with radius 6 in a 12px corner; Dialog at 8 / 8 with radius 8 in 16; the banner's controls at 8 from the top and end.
- Alert and Toast share the 10 / 12 inset, a 40px single line, a 16px icon on the first line with an 8px gap, and the brighter icon rungs.
- Every surface description is 14/20 `fg-muted` (Popover, Dialog, Alert, Toast, Hover card).
- Alert, Toast, Spinner and Progress default to neutral; accent is opt-in on Spinner and Progress.
- Every loop (Skeleton, Spinner, indeterminate Progress, the Skeleton wrap) stops under `data-area-motion="none"`. Overlay fades use the duration tokens, which reach 0 under reduced motion (`tokens/src/emit/css.ts:170`).
- Popover, Menu and Tooltip share `computePosition` (flip, shift, 8px viewport padding, RTL align mirroring) and return focus to the trigger (`overlay.ts`).
- Popover, Menu and Tooltip compose the consumer's handlers and `ref` on the trigger (`Overlays.tsx:50-60`).
- Dialog's modal gets its focus trap, Escape and focus return from native `showModal()`. A click on the scrim closes it; a click inside does not.
- Alert and Toast use logical properties throughout, and the indeterminate Progress segment runs the other way in RTL.
- Alert, Toast, Dialog, Popover, Tooltip, Progress, Spinner, Skeleton and Hover card forward their refs and spread native props onto the root.
- Skeleton is `aria-hidden`, and its wrap mode is `inert`. Alert keeps `role="alert"` for danger only.
- The gallery keeps one size per tile for Progress and Spinner, and one tone per tile for Alert and Toast. Irene Yamaguchi is the only person shown (Hover card).
