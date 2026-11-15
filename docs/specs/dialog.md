# Dialog spec

**Captures:** `docs/research/captures/dialog/` (pass-0 in `before/`)
**Peers:** Popover (same header rule), Menu (lift), Button (the close), Confirm dialog (shares the modal),
Drawer (edge-anchored modal)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Dialog follows the
  [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/base/dialog) composition: a title
  and description above an optional scrolling body, trailing actions, and an optional corner
  close control. It uses one 16px outer inset (including the border), 16px between sections
  and 8px between title and description. The footer has no divider. The title uses the
  18/26px text role, with medium UI body type. All sections share a leading edge and the
  container radius follows the system radius axis. (The title has since moved to 20/28 with
  the approved type ramp; see [typography](typography.md).)
- 2026-09-26: "do the next component" after Popover; the Popover pass asked for the close
  button to sit evenly in the corner with the title aligned to it, which this pass applies.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Interrupts with content that needs a response and blocks the page until it is dismissed.
Not Popover (non-modal, anchored to its trigger), not Toast (no response needed), not Drawer
(edge-anchored; drawer.md), not Confirm dialog (a confirmation with no close and focus on the
safe action, built on this modal; confirm-dialog.md).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| composition | header (title, description, close), body, footer | Standard dialog | shadcn, Primer, ChatGPT shortcuts dialog |
| composition | without close | Forced choice (confirmation) | shadcn `showCloseButton={false}` |
| composition | with field, scrollable body | Forms and long content | shadcn (form), Primer (scrolling body) |
| behaviour | modal with `trigger`, or controlled `open` / `defaultOpen` | Opens itself as a native modal; without a trigger, `open` opens it (a menu item asking for confirmation) | shadcn `DialogTrigger`; ChatGPT, Primer |
| size | sm 384, **md 480** (default), lg 720, xl 880 | sm and md are Drawer's two widths, one name one width across the modal family; lg for a table or two columns, xl for a settings dialog with its own sidebar (V1) | Claude `{sm:400, md:520, lg:720, xl:880}`; Cursor sm 320 … xxl 640; Primer 296 / 320 / 480 / 640; tiles `size-sm` … `size-xl` |
| boolean | `fullHeight` | The tallest the screen allows (less 64), whatever the content, so a dialog whose content changes doesn't jump; the body takes the room | Claude Dialog `fullHeight`; Primer `height`; tile `full-height` |
| state | scrolled (`data-scrolled`) | A rule under the header once the body leaves its top: content passing under a fixed header needs an edge | Claude `scroll-timeline:--cds-dialog-scroll`; Cursor `scrollable{border-top:1px}`; tile `state-scrolled` |

Excluded: a divided or tinted footer (shadcn's new base footer is a muted strip with a top
border; Primer divides the header). The prior decision keeps the footer undivided, and
ChatGPT uses no dividers.

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| chatgpt | target product | Keyboard shortcuts dialog (opened with ⌘/ on the settings page, closed with Escape; nothing changed) | chatgpt.com (Chrome), 2026-09-26 | `chatgpt--shortcuts-dialog--open`, `chatgpt--dialog-overlay--open` |
| shadcn | design system (rendered) | Dialog docs demo (Edit profile) | ui.shadcn.com/docs/components/base/dialog, 2026-09-26 | `shadcn--dialog-header--open` |
| primer | design system (rendered) | GitHub Primer Dialog, default story | primer.style React storybook, 2026-09-26 | `primer--dialog-header--open` |
| area | this system | Default tile before and after | localhost gallery | `before/area--default--rest`, `area--default--rest` |

shadcn's overlay (`bg-black/10`, `backdrop-blur-xs`, computed 10% black and 4px blur) and
its footer strip were read from the rendered page's computed styles, not captured.
Notion and Figma: no dialog found that opens without risking a data change (their
dialogs are confirmations, sharing or settings); not captured.

## Measurements

Generated with `node scripts/capture-compare.mjs` and filtered. The first Area column is
after this pass, the second before.

| slot · property | area · default · rest · light | area · default · rest · light | chatgpt · shortcuts-dialog · open · light | shadcn · dialog-header · open · light | primer · dialog-header · open · light |
|---|---|---|---|---|---|
| **shell** size | 515 × 119.94 | 515 × 112.14 | 600 × 651.09 | 384 × 305 | 640 × 734 |
| **shell** padding | 15 | 15 | 0 | 16 | 0 |
| **shell** radius | 12px | 12px | 16px | 14px | 12px |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(252, 252, 252) | lab(100 0 0) | rgb(255, 255, 255) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, rgba(0, 0, 0, 0.06) 0px 5px 8px 0px | rgba(0, 0, 0, 0.06) 0px 1px 2px -0.5px | rgba(0, 0, 0, 0.1) 0px 4px 8px -2px | oklab(0 0 0 / 0.1) 0px 0px 0px 1px | rgba(209, 217, 224, 0.5) 0px 0px 0px 1px, rgba(37, 41, 46, 0.04) 0px 6px 12px -3px, rgba(37, 41, 46, 0.12) 0px 6px 18px 0px |
| **title** edge from shell (t r b l) | 10 425.87 81.94 16 | 16 425.87 81.94 16 | 24 48 603.09 48 | 16 16 273 16 | 14 48 699 16 |
| **title** font | 20px/28px 400 Geist | 20px/28px 400 Geist | 16px/24px 600 -apple-system-body | 16px/16px 500 Geist | 14px/21px 600 -apple-system |
| **title** text cap top / baseline from shell | cap +16.8 · baseline −88.94 · start +16 · end −461.2 | cap +16 · baseline −81.94 · start +16 · end −461.2 | cap +30.23 · baseline −609.59 · start +225.41 · end −225.41 | cap +18.14 · baseline −275.5 · start +16 · end −287.37 | cap +20.14 · baseline −704 · start +16 · end −557.37 |
| **description** font | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 -apple-system-body | 14px/20px 400 Geist | — |
| **description** color | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(93, 93, 93) | lab(48.496 0 0) | — |
| **description** text cap top / baseline from shell | cap +46 · baseline −64 · start +16 · end −425.87 | cap +38.2 · baseline −64 · start +16 · end −425.87 | cap +77.64 · baseline −563.59 · start +24 · end −73.97 | cap +45.06 · baseline −250 · start +16 · end −40.27 | — |
| **close** size | 32 × 32 | 28 × 28 | 32 × 32 | 28 × 28 | 32 × 32 |
| **close** edge from shell (t r b l) | 8 8 79.94 475 | 16 16 68.14 471 | 12 12 607.09 556 | 8 8 269 348 | 8 8 694 600 |
| **close** radius | 8px | 8px | 8px | 8px | 6px |
| **close** color |  |  | oklab(0.159065 0.00000723451 0.00000317395 / 0.8) | lab(0 0 0) |  |
| **action** size | 64.23 × 32 | 64.23 × 32 | 142.04 × 36 | — | — |
| **action** edge from shell (t r b l) | 71.94 16 16 434.77 | 64.14 16 16 434.77 | 603.09 12 12 445.96 | — | — |
| **action** radius | 8px | 8px | 9999px | — | — |

Overlay: ChatGPT `rgba(0, 0, 0, 0.133)`, no blur (`chatgpt--dialog-overlay--open`);
shadcn 10% black with a 4px blur; Area before `#000000a7` (65%) with a 2px blur.

Corner rule: every reference sits the close the same distance from the top and the side,
half its content inset (shadcn 8 of 16, Primer 8 of 16, ChatGPT 12 of 24). ChatGPT puts its
footer action in the opposite corner by the same rule (12/12).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| surface · inset, gap | 16 (border included); between sections the block gap, `min(inset-surface-md, 16)` (14 at the default type 13, 16 at Comfortable where it was 18, 12 at Compact; popup.css, plan B6.2) | shadcn 16/16; Primer 16 | ChatGPT 24 |
| surface · compact | inset **16** (border included, held), corner **16** (the surface corner, below), section gap 12 (the block gap) | Figma Share dialog (`compact/figma--share-dialog--open--light`): header title 16 in, field row 16 in, corner 13; VS Code save dialog 13 / 9, corner 8 | Owner 2026-10-02 (cursor-desktop.md): Figma holds 16 in its dense UI; R8's compact 12 rested on VS Code alone |
| surface · width | by `size`: 384 / **480** / 720 / 880, at most the viewport less 32 (`--_dialog-size`, surface.css) | md: between shadcn 384 and ChatGPT 600 / Primer 640; sm: shadcn 384 and Drawer's sm; lg, xl: Claude | Claude's sm 400 and md 520 were not taken: md stays the 480 Dialog always had, and sm takes Drawer's 384 so one name is one width |
| header · scroll rule | `edge-dividers`, 1px, edge to edge inside the border, in the middle of the header-to-body gap (rounded to a pixel); `opacity` 0 → 1 on `fade-fast` while `data-scrolled` | Claude, Cursor (a rule over the body only when it scrolls) | Undivided at rest, as Excluded below keeps the footer |
| surface · border | `border-width` `border-float`, the floating-surface edge (surface.css:928) | All use a 1px ring | Was decorative |
| surface · shadow | **`--area-shadow-modal`**, the Elevation axis's modal role: `0 0 8` + `0 14 28` at twice the Elevation step in % (6% key at the default 3), the ambient half, dark doubled; transparent at step 0 (axes/elevation.ts); the Surface axis's `shadow-edge` is listed first (surface.css:935) | The topmost surface, over Popover and Menu's float (elevation-2026-10-14); Surface axis (owner, 2026-10-14) | Was `shadow-2` (1–2px). A Surface axis role since audit S10. References lift less (ChatGPT 4/8, Primer 6/18), but one lift for every floating surface |
| scrim | **`scrim`**: #00000022 (13.3%) in light, #00000080 in dark, no blur (aliases.ts:155) | ChatGPT 13.3%; shadcn 10% | Was 65% with a 2px blur. Dark value not measured |
| close · control | **32px ghost neutral Button** (md), Area `dismiss` glyph (`primitives.tsx:1699`) | ChatGPT 32, Primer 32; shadcn 28 | Was a bespoke 28px button whose foreground changed on hover (against the fixed-foreground rule). The written exception to the rectangular-surface close (ghost sm, 28), which Popover, Toast and Alert use (audit S9, owner) |
| close · position | a corner control beside a title (DESIGN_SYSTEM.md, the one named exception): centred on the title's cap, round((1cap − 30) / 2) above and below, so 6 from the top at type 12 and 13 Default (4 at type 16); its glyph on the 16 side column (10 / 9 / 8 from the side at type 12 / 13 / 16); its corner from the nearer distance, 16 − 6 = 10 at Corner 10, 0 at Sharp, 14 at Pill | Plan B6.5 (VN6) | Was 8 / 8 with the title's line centred on it |
| title · alignment | cap on the 16 inset with or without a close (`text-box: trim-start cap alphabetic`; trim-both when it ends the header) | Plan B6.5: one text grid | It was untrimmed beside a close (cap ~18.8) and trimmed without (16): a 2.8 jump |
| description | muted, ends on its baseline when it closes the header (`text-box: trim-end`) | Plan B6.5 | Was untrimmed |
| footer · pair and width | soft neutral Cancel with a solid action (or soft danger); text Buttons at least 2.25 × their height (68 on a 30 Button; popup.css) | Plan B6.5 (VN5, RD11) | The demos' Cancel was ghost (ink 0.452) and "OK" stood narrower than "Cancel" |
| body · scroller | a Scroll area (plan B6.6), so its bar is every list's; `data-scroll-more` draws the header's rule over the footer while there is more below | Plan B6.6 (VN15) | It used the platform's bar and clipped mid-line with no cue |
| title · type | **the text's size, strong**: `text-base` 13/18 500, default ink (2026-11-06 balance pass) | Cursor's confirm (12/500 over 12), its settings rows (13 over 13); DESIGN_SYSTEM.md "Text pairs" | ChatGPT 16/24 (600), shadcn 16. Pass 2 (owner): 20/28 regular was too big, 1.4×; `title-xs` 16/22 over 13 was 1.23× after the 2026-11-02 ramp |
| title → description | **one step (4) off**: baseline to cap **12.8**, beside the description's own 8.8 | Card, Popover, Alert, Toast (Text pairs); Cursor's confirm 4 | Pass 0: 8 (both trimmed); pass 1: 15; 2026-10-22: 12 (16 over 14); 2026-11-02 to 11-06: 10.0 (16 over 13); 2026-11-06 first pass: 8.8, joined |
| surface · radius | **16** at the default and compact: the floating corner, `radius-container` (square with a square surface; 24 at Pill) (dialog.css) | Plan A2.3, owner 2026-11-11: every floating and modal surface takes the one container corner | Was the container plus 4, 20 at the default (owner 2026-10-03). The close is a corner control (inset.css, plan B4.2): md, its glyph on the inset, 9 from the outer edge, corner 16 − 9 = 7 (it kept its own 8) |
| footer | actions end-aligned on the 16 inset, `ui-cluster` apart, wrapping; under 480px wide they stretch (surface.css:1001-1011) | shadcn 16, Primer 16 | ChatGPT 12/12 corner |
| title element | `h2` | Popover, shadcn `DialogTitle` | Was a `div` |

Inset equations: close top = inset + header offset + close margin = 16 + (16 − 28)/2 +
(28 − 32)/2 = 8; close side = 16 + (16 − 32)/2 = 8; icon = 8 + (32 − 16)/2 = 16.

## Radius audit (pass 2)

Rule: a child that sits in a corner at offset o shares the corner's centre when its radius is
R − o. Swept every rounded container in the gallery:

- Concentric: Popover close (12 − 6 = 6), Dialog close (16 − 8 = 8, after this pass), Card
  media (24 − 8 = 16), Toolbar buttons (12 − 4 = 8), Segmented items (8 − 2 = 6), Nav row
  buttons, Tooltip keycaps, Composer buttons (16 − 8 = 8).
- Within 1px: Menu items and search (8 against 12 − 5 = 7), NumberField steppers (8 vs 7),
  Toolbar overflow buttons (6 vs 7). Left as they are.
- Not concentric, child well inside the corner (offset ≥ R/2, where the arcs do not read as
  nested): Code block copy (9 in 12), Input action (4 in
  8), ColorSwatchPicker cells. Flagged, not changed.

Insets pair with radii: Popover 12 inset / 12 corner, close 6 in; Dialog 16 inset / 16
corner, close 8 in. In both, the corner control sits half the inset in and its radius is
half the corner.

## Behavior and accessibility

Without `trigger`, `open` or `defaultOpen`, Dialog renders the surface with `role="dialog"`, `aria-modal` and its
name and description (for documentation, or inside your own `<dialog>`). With `trigger`,
it renders the trigger (`aria-haspopup="dialog"`, `aria-controls`) and a native
`<dialog class="area-dialog__modal">` that carries the name and description; the trigger
calls `showModal()`. `open` / `defaultOpen` control the modal through the shared
`useOpenState`; without a trigger, `open` alone opens the native modal (a menu item asking for
confirmation). Escape, the close control and the backdrop report `false` through
`onOpenChange`. The platform supplies the focus trap, Escape and focus return; a press that starts and ends
on the scrim closes it unless `dismissOnBackdrop` is false (Confirm dialog). One modal rule for Dialog, Drawer and
Command palette (plan C5.3, `modal.ts`): focus starts on an `[autofocus]` element, else the body's first control, else
the footer's first action, else the surface, never the close control; the page neither scrolls nor shifts by its
scrollbar's width while the modal is open (`scrollbar-gutter: stable` where a classic bar shows). The close button calls `onDismiss`, then closes the enclosing native
dialog; `dismissLabel` names it (default "Close dialog"). `onClose` remains as a deprecated
alias (`primitives.tsx:1625-1636`, `:1699-1701`). A `role` prop (`alertdialog`, for Confirm dialog) lands on
the element that carries the dialog role: the native `<dialog>`, or the surface inline. While a modal is open
the page behind it does not scroll, and the modal fits the visible height (`100dvh`) (audit E-20). Verified in the
gallery with a real pointer: opens modal with the 13% scrim, focus on the close, Escape
closes and refocuses the trigger, a scrim click closes, a click inside does not.

Enter and exit (audit E-19 A, owner 2026-09-30; clocks from the motion pass 2026-10-07, below):
the modal fades and scales from 0.97, entering over `--area-duration-moderate` (280 at the default motion 210) and leaving
over `--area-duration-base` (210), `--area-ease-out`, and the scrim fades alongside; the entry runs from `@starting-style`, the exit keeps the top layer with
`overlay` and `display` transitions (`allow-discrete`). Motion 0 sets
the duration to 0, so it is instant, and `prefers-reduced-motion` drops the scale as well
(`surface.css:870-905`). Was instant.

**State hooks (manifest).** `open` is the modal dialog's own `[open]` (`stateAttributes: { open: "open" }`), read by the entry and exit in `surface.css`.

## Visual pass

2026-10-26 (desktop app, the Stage at 100%, 2x): the gallery's Dialog demos set `inline-size: 100%`, a leftover from
the first gallery, so the Stage ("at its real size") drew a one-field dialog about 670 wide → the demos drop it and
show the 480 the dialog opens at (gallery.tsx). The component is unchanged.

2026-09-28 (batch 17, gallery): 480 preferred (502 in the tile), corner 16, a 32 close 8 from the
top and side (concentric: 8 + 8), title and footer buttons on the 16 inset. Beside ChatGPT's
dialogs on file (`chatgpt--shortcuts-dialog`: 600 wide, corner 16, #fcfcfc, a 4/8 lift;
`chatgpt--dialog-overlay`: 13.3% scrim). Open for the owner: Card's new corner rule (a
button's radius plus its distance from the edge, 2026-09-28) would make Dialog's corner 24
(8 + 16) for its footer buttons, where the close button's rule gives 16.

2026-09-28, live in Claude in Chrome (ChatGPT's keyboard-shortcuts dialog, cmd+/): 600 wide,
corner 16, #fcfcfc, lift 0 4 8 −2 at 10%, title 16/24 600 on a 24 top. The close is 32 with an
8 corner, 12 from the top and side; hover paints 5% black and keeps its ink 80%
(`chatgpt--close-button--hover--light`). The footer's pill button also sits 12 from the bottom
and side. ChatGPT's corner is concentric with neither control (12 + 8 = 20, and a pill), so
the corner does not follow the button inside it. **Decision: the corner stays 16**, set by the
close (8 + 8); Card's button-plus-distance rule applies to Card and does not extend to Dialog.
Area's close hover (#f3f3f3 on white) is within a step of ChatGPT's (≈ #efefef on #fcfcfc). No
change.

## Verification

- 3 reference captures plus the ChatGPT overlay and close hover (live, 2026-09-28), Area before
  and after; checksums verified;
  ChatGPT captures redacted, no personal content.
- React tests: `packages/react/tests/dialog.test.mjs` (3).
- The Dialog and Popover docs pages now load the demo hydration script, so their modal and
  anchored examples run there too (they were static before). Verified on both pages.
- Unverified: dark theme and the dark scrim, screen reader announcement, the modal on a
  phone-width viewport.

## Open questions

- ~~AlertDialog (confirmation without a close, focus on the safe action) is a backlog item.~~ Built: Confirm dialog
  (`role="alertdialog"` on this modal; confirm-dialog.md). Drawer is built too (drawer.md).

## Motion and interaction, 2026-10-07

Contract: [MOTION.md](../MOTION.md), "Dialog, command palette, confirm dialog".

| Interaction | Before | After |
|---|---|---|
| open | `opacity` + `scale` 0.97 from the centre, `duration-base` 150, `ease-out`, `@starting-style` | `duration-moderate` (200), `ease-out` |
| close | same as open (150) | one step faster: `duration-base` (150), `ease-out`, carried by `:not([open])`; `overlay`/`display` `allow-discrete` |
| scrim | `opacity`, `duration-base` both ways | `duration-moderate` in, `duration-base` out, `ease-out` |
| rest | `scale: 1` (identity transform) | `scale: none` |
| close button, footer buttons | Button's | Button's (not this pass) |
| focus | native `showModal()` focus, no animation delay | unchanged: focus never waits for the transition |
| reduced motion / motion 0 | tokens 0, scale 1 | unchanged; no literal durations |

Confirm dialog shares `.area-dialog__modal` and picks this up; Command palette has its own
modal (command-palette.css, not this pass).

Crispness: the modal now rests without a transform, and its centre is a whole pixel.
`margin: auto` centred on .5 whenever the room left over was odd, and a dialog without a close
(Confirm dialog) was 141.86 tall from its title's cap trim, so it rested at 334.5 × 328.07 (lead,
from the overlay-variants pass). Now the modal's room is even (`inset-*-end: calc(100% −
round(down, 100%, 2px))`), the modal box is even (`calc-size(fit-content, round(up, size, 2px))`,
the extra under 2px transparent below and beside the surface), and the surface rounds its own
height up (`calc-size(auto, round(up, size, 1px))`, +0.14 here). Without `calc-size()` support
it stays fit-content, as before.

Verification of the centring: `/confirm-dialog.html` at 1089 × 798: 334 × 328, 420 × 142 (was
334.5 × 328.07, 420 × 141.86); `/dialog.html` at 801 × 501: 160 × 170, 480 × 160; a 40-paragraph
injected dialog at 801 × 501: body scrolls, surface 437 (the `100dvh − 64` cap), modal 438 at
160 × 31, footer inside. All whole CSS pixels, so whole at DPR 1.

Verification: `/dialog.html`, trigger: enter `opacity:200 scale:200` ease-out and backdrop
`opacity:200`; close `display/opacity/overlay/scale: 150` and backdrop `opacity:150`; rest
opacity 1, scale none, backdrop opacity 1. Verified on the dev server (background tab, so transitions were read from `getAnimations()` and computed styles, not watched; real-pointer hover could not be driven in a background tab, so hover rules were read from the stylesheet).

Open questions: none new.

## Feedback log

- 2026-09-26 · owner (Popover pass 3): the close should sit evenly in the corner with the
  title aligned → Dialog measured 16/16 with the title's centre 7 above the close's. Pass 1:
  close 8/8 as a 32px ghost Button, title centred on it, title-to-description 15, the
  shared lift, a 13% scrim, and a `trigger` that opens a native modal.
- 2026-09-26 · owner: the title looks too big beside the description; check the type ramp
  across components; is the radius and padding consistent and mathematically correct →
  title 20/28 regular was the only surface title above 16. Pass 2: 16/24 strong (surface
  title rule in typography.md), title group as Card (15.6), corner 16 = close radius +
  offset (concentric). Radius audit above.

- 2026-09-28 · owner (screenshot of the `withField` tile): "the field is cutoff" → the scrolling
  body clipped a full-width field's focus halo at its sides. The body now reaches out by the
  focus ring's extent (`--area-focus-width` + `--area-focus-offset`, padding in and the same
  margin out), so content keeps the 16 inset and focus rings paint whole.
- 2026-09-30 · audit S9 (owner) → the 32px md ghost close is written as the exception to the rectangular-surface close (ghost sm). `onDismiss` and `dismissLabel` added (default "Close dialog"); `onClose` kept as a deprecated alias → `primitives.tsx:1289-1294`, `:1341-1344`.
- 2026-09-30 · audit S10 (owner) → the lift is the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat) → surface.css:777.
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → `open` / `defaultOpen` added (shared `useOpenState`); without a trigger, `open` opens the native modal (a menu item asking for confirmation); Escape, the close control and the backdrop report `false` through `onOpenChange` → `primitives.tsx:1311-1324`.
- 2026-10-01 · audit E-19 (owner pick A) → the modal and its scrim fade (and the modal scales from 0.97) over 150ms on open and close via `@starting-style` and `allow-discrete` transitions; instant under the "none" motion preset, no scale under reduced motion → surface.css:767-797.
- 2026-10-02 · compact evidence audit → compact inset 16 → 12 and corner 16 → 12, concentric with the close (6 in, radius 6); reverses the morning's hold, whose Notion/Figma 16 was never measured. VS Code's save dialog: corner 8, content 13 in, actions 9 from the edges; antd compact 16 (R8) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-02 · Cursor and Figma captures → compact inset 12 → 16 and corner 12 → 16 (owner). Figma's Share dialog keeps 16 sides at corner 13; the corner follows the concentric rule up to its cap. docs/research/compact-evidence-2026-10-02/cursor-desktop.md.
- 2026-10-03 · roundness → the corner's cap is the surface corner plus 4 (0 at Sharp), not twice it, so it steps by 2 with roundness (4 … 16 … 28); default and compact stay 16 (`surface.css`, `--_dialog-radius`). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · two roundness step sizes (owner) → the corner is the surface corner plus 4 (never more than the surface corner, so square with a square surface), 16 at both densities, stepping by 4; the close keeps the control step, so it is concentric only at the default (`surface.css`, `--_dialog-radius`). `docs/research/radius-audit-2026-10-03.md`, "Step size for large shapes".
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → unchanged at the default (16); Pill 28 (`surface.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-05 · Confirm dialog needs `role="alertdialog"` on the native modal → Dialog passes a `role` prop to its `<dialog>` (inline: the surface); attribute order unchanged (dialog tests).
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → enter on `moderate` (200, was 150), exit one step faster on `base`; scrim on the same clocks; rests at `scale: none` and on a whole-pixel centre (lead: Confirm dialog rested at 334.5 × 328.07) (`surface.css`).
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the dialog lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).
- 2026-11-11 · system evaluation F5 · the manifest declares `open` on the native `[open]` (`stateAttributes`); no paint changed.

## Review note, 2026-10-22 (round 68)

- **What changed:** the description sits directly under the title: title baseline to description cap 12, was 16 (a 4 gap).
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs". Confirm dialog and Drawer share it.

## Review note, 2026-10-26 (visual pass)

- **What changed:** The Dialog tiles now show the dialog at the width it really opens at, 480, instead of stretched
  across the whole Stage. The component itself is unchanged.
- **Why:** The demos still carried a full-width style from the first gallery, so the Stage's "real size" view showed
  a dialog much wider than any you would ship.

## Review note, 2026-11-06 (balance pass; owner: "Keep it")

- **What changed:** the title is 13/18 strong in the default ink over the 13/18 muted description, joined as its first
  line (8.8 baseline to cap, the description's own line gap); it was 16/22 joined 10.0. The close centres on the title's
  own line, no longer a fixed 24. Confirm dialog and Drawer share it.
- **Why:** the owner's note on a confirm ("no spacing logic between the title and the text … the type style size contrast with the text is large … make sure all of this is intentional"). The 2026-11-02 ramp moved `title-xs` from 15 to 16 at type 13, so a 16 title sat over 13 text, 1.23× (the owner had approved 16 over 14, 1.14×, on 2026-09-26), and joined 10.0 baseline to cap beside the text's own 8.8: near the line gap but not on it. Cursor sets its confirm's title at its text's size (12/500 over 12) and its settings rows 13 over 13. DESIGN_SYSTEM.md, "Text pairs"; `docs/research/title-balance-2026-11-06`.

- **Second look (owner: "the space between the title and the copy still doesnt look right"):** joined on the copy's
  line, the title read as the paragraph's first line. Every surface title now stands one step (4) off its copy: 12.8
  baseline to cap beside the copy's 8.8. Compared at 0, 4 and 6 on the review page; the owner picked 4 ("4 is right",
  2026-11-06; Cursor's confirm sets its message 4 under its title).

### 2026-11-07 · One dismiss API and part (system gaps C4)

- **What changed:** the close button's part is `area-dialog__dismiss` (was `__close`).
- **Why:** one dismiss API and one part name across the families that close or remove (Governance § 4; owner picked Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Sizes, full height and the scrolled rule (components audit V1)

- **What changed:** `size` (sm 384, md 480 default, lg 720, xl 880; `--_dialog-size`), `fullHeight` (`--full-height`:
  the surface at the screen less 64, rounded down to a pixel so the modal's even-pixel centring holds) and the
  `scrolled` state: Dialog sets `data-scrolled` from its body's scroll position (`onScroll`; React skips the render when
  it doesn't change), and the header draws a 1px rule in the separator's line under itself. Every Dialog now carries
  its size class (`area-dialog--md` by default), as Drawer does.
- **Deviation from the proposal:** the proposal said md 520 (Claude's). Dialog's width was already 480
  (`calc(var(--area-space-96) * 5)`), so md stays 480, and sm is 384 rather than 400 because Drawer's sm is 384: Dialog
  and Drawer now share sm and md exactly. `xl` is a recorded Governance deviation (a width ladder with measured uses).
  The scroll rule is set by React rather than a scroll-driven animation, so it works without `scroll-timeline` support.
- **Not taken:** 2xl 1024 / 3xl 1152 (no Area use yet), Cursor's centred header and header stepper, Primer's responsive
  position (bottom sheet, full screen on a phone). Drawer's body is a Scroll area and draws no header rule yet: the same
  rule would suit it, left for the owner.
- **Confirm dialog and Command palette take no size** (their specs, 2026-11-07): one is a fixed question, the other a
  search over a list with its own measured width.
- **Why:** docs/research/components-audit-2026-11-07/chat-apps.md (Dialog sizes, `fullHeight`, the header rule), cursor.md (widths and the scrolled body
  rule), primer.md (width and height scale), internal.md (Dialog had none of Drawer's `size`). The owner took every
  recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.
- 2026-11-11 · system evaluation A2.3 · Dialog drops its + 4: corner radius-container, 20 → 16 at the default (Confirm dialog with it). The close goes from 3 to 1 off concentric. dialog.css; cohesion.test.mjs.

## Review note, 2026-11-11 (motion, plan A5)

- **What changed:** the modal enters on `duration-base` (210; it was `moderate`, 280) and leaves on `fast` (140; it was `base`), the exit and the scrim's on `ease-exit` (A5.1).
- **Why:** the system evaluation's motion items (docs/research/system-evaluation-2026-11-11, section 5, A5), owner-approved
  2026-11-11; the rules are in docs/MOTION.md (Tokens, Roles, Recipes) and kept by cohesion.test.mjs and
  tests/behaviour/suites/motion.test.mjs. The motion tables above are history; these values are current.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** In dark it paints the floating ground (`bg-float`, plan A7.2): a step above the layers under it, #0c0c0c on the near-black page at the defaults (was `bg-surface`, the page's own #020202); light is unchanged. Its dark edge is one line (plan A7.1): the frame takes the dark rim's strength (16% at Shadow 8) and the rim is no longer drawn outside it, where it had made a two-tone 2px edge.
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.
- 2026-11-14 · system evaluation B6.1–B6.6 · the frame and shadow stack are the one floating surface's (popup.css; `shadow-modal`, a material's layers first); the block gap is `min(inset-surface-md, 16)` (Comfortable 18 → 16); `--area-dialog-inline-size` sets the default width; the title's cap sits on the inset with or without a close, the closing line ends on its baseline and the close centres on the cap (it sat 8 / 8, now 6 from the top); footer text Buttons are at least 2.25 × their height and the demos pair a soft neutral Cancel; the body is a Scroll area, and a rule shows over the footer while it can scroll further (reopens "Excluded: a divided footer" for that one case, owner glance requested).

## Shared bars and corners (plan B4), 2026-11-14

- B4.2: the close is a corner control (inset.css): its glyph on the 16 inset, its plate 9 from the outer side, its corner the dialog's less that, 7 at the defaults (it kept the md control's 8; 11 when the corner was 20). Its top is the title group's (plan B6.5, 2026-11-14: centred on the title's cap), 6 from the outer top at the defaults, so it is not equidistant there: listed for the conductor.
- 2026-11-14 · system evaluation B6.5 (correction) · the close stays where the corner-control rule puts it (equidistant from top and side) and the title follows it: its cap's centre on the close's centre line, rounded to a whole pixel (cap top 19 at type 13, 20 at 12 and 16, against the 16 inset); the first pass had moved the close to the title's cap (6 from the top). Pinned by `tests/behaviour/suites/wrap.test.mjs` and `popups.test.mjs`.
- 2026-11-14 · system evaluation B6.5 (final) · the conductor's interim ruling (title on an equidistant close, cap 19–20) is reversed: the title's cap stays on the inset and the close follows it (centred on the cap, glyph on the column), written as the one named exception to the corner control, whose corner now comes from the nearer distance (`--_cc-near`, inset.css). Pinned by `bars.test.mjs`, `popups.test.mjs` and `tests/behaviour/suites/wrap.test.mjs` (type 12/13/16, every density, Corner 0/10/Pill).

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The examples' and the API demo's Cancel is the pair's soft neutral (stroke groups, analytics, the display demo); a test now reads every Dialog, Drawer and Popover footer in the app's sources for it.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.

## Behaviour engine (plan C5), 2026-11-15
- C5.3: initial focus moved off the close control to the body's first control (`focusInitial`); the scrollbar gutter is kept while the page is locked (`lockPageScroll`); the backdrop rule is the shared `useBackdropDismiss`. C5.4: `dismissOnBackdrop` (default true). C5.1: a toast raised over an open dialog is in the top layer inside it and can be pressed. Verified by tests/behaviour modal suite; supersedes "focus on the close" in Verification above.
