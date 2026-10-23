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
| surface · inset, gap | 16 (border included), `inset-surface-md` between sections (16, compact 12) | shadcn 16/16; Primer 16 | ChatGPT 24 |
| surface · compact | inset **16** (border included, held), corner **16** (the surface corner plus 4, below), section gap 12 (`inset-surface-md`) | Figma Share dialog (`compact/figma--share-dialog--open--light`): header title 16 in, field row 16 in, corner 13; VS Code save dialog 13 / 9, corner 8 | Owner 2026-10-02 (cursor-desktop.md): Figma holds 16 in its dense UI; R8's compact 12 rested on VS Code alone |
| surface · width | 480 preferred, at most the viewport less 32 (surface.css:922) | Between shadcn 384 and ChatGPT 600 / Primer 640 | — |
| surface · border | `border-width` `border-float`, the floating-surface edge (surface.css:928) | All use a 1px ring | Was decorative |
| surface · shadow | **`--area-shadow-modal`**, the Elevation axis's modal role: `0 0 8` + `0 14 28` at twice the Elevation step in % (6% key at the default 3), the ambient half, dark doubled; transparent at step 0 (axes/elevation.ts); the Surface axis's `shadow-edge` is listed first (surface.css:935) | The topmost surface, over Popover and Menu's float (elevation-2026-10-14); Surface axis (owner, 2026-10-14) | Was `shadow-2` (1–2px). A Surface axis role since audit S10. References lift less (ChatGPT 4/8, Primer 6/18), but one lift for every floating surface |
| scrim | **`scrim`**: #00000022 (13.3%) in light, #00000080 in dark, no blur (aliases.ts:155) | ChatGPT 13.3%; shadcn 10% | Was 65% with a 2px blur. Dark value not measured |
| close · control | **32px ghost neutral Button** (md), Area `dismiss` glyph (`primitives.tsx:1699`) | ChatGPT 32, Primer 32; shadcn 28 | Was a bespoke 28px button whose foreground changed on hover (against the fixed-foreground rule). The written exception to the rectangular-surface close (ghost sm, 28), which Popover, Toast and Alert use (audit S9, owner) |
| close · position | **8 from the top and 8 from the side**; icon on the 16 inset both ways | shadcn 8/8, Primer 8/8 (half the inset); ChatGPT 12/12 | Was 16/16 (box on the inset, icon at 22) |
| title · alignment | line centred on the close (centres 24 and 24; cap 16.8) | Popover rule: header top = (icon − title leading) / 2 | Was trimmed to its cap on the inset, so the close's centre sat 7 below the title's |
| title · without close | cap on the 16 inset (`text-box: trim-start`) | Popover | — |
| title · type | **16/24 strong** (pass 2) | ChatGPT 16/24 (600), shadcn 16 (500); typography rule: standalone-surface title, as Card | Owner (pass 2): 20/28 regular looked too big, 1.4× the description. Area never exceeds 500 |
| title → description | 4 gap, description keeps its line box; title baseline to cap **15.6**, as Card | Card (same 16/14 pair); Popover 15.1; shadcn 15.5 | Pass 0: 8 (both trimmed); pass 1: 15 with a trimmed description |
| surface · radius | **16** at the default and compact: the surface corner plus 4 (`radius-container` + 4, never more than twice the surface corner, so square with a square surface; Pill 28) (surface.css:917) | Concentric with the corner close at the default (8 + 8); ChatGPT 16; owner 2026-10-03 (one corner setting) | Pass 1: 12, not concentric (12 − 8 = 4 ≠ 8). Away from the default the close keeps the control step and is no longer concentric |
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
`onOpenChange`. The platform supplies the focus trap, Escape and focus return; a click
on the scrim closes it. The close button calls `onDismiss`, then closes the enclosing native
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

## Visual pass

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

## Review note, 2026-10-22 (round 68)

- **What changed:** the description sits directly under the title: title baseline to description cap 12, was 16 (a 4 gap).
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs". Confirm dialog and Drawer share it.
