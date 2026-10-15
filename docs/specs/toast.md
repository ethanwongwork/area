# Toast spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-26 (pass 1: Popover's inset and corner, 40 tall, shared lift))
**Captures:** `docs/research/captures/toast/` (pass-0 in `before/`)
**Peers:** Popover (same inset, corner and close rule), Alert (inline counterpart), Dialog,
Menu (lift)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Toast supports
  titles, actions and dismissal; it is a surface, not a global queue or automatic timer.
  Plain Toasts use 8px vertical/10px horizontal insets; action and dismissal Toasts use 4px
  vertical insets around their 28px controls. All three are 38px high at normal density,
  with centered icons and text. Multiline icons align to the first text line, and multiline
  is demonstrated separately from tone. Consumers own placement, lifetime and dismissal
  focus restoration. Reference: [Spectrum Toast](https://react-spectrum.adobe.com/v3/Toast.html).
  (Insets and height superseded by pass 1; the rest stands.)
- 2026-09-26: "do the next component" after the type and radius pass. Every surface title is
  strong (typography.md); corner controls sit evenly in the corner (Popover pass 3).
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Reports the outcome of an action without interrupting, and leaves on its own or when
dismissed. Not Alert (inline and persistent), not Dialog (blocks), not Popover (anchored,
interactive content).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| tone | info, success, warning, danger (icon color) | Outcome | Sonner types (success, info, warning, error); Notion (warning icon) |
| composition | icon, title + description, action, dismiss | Undo, follow-up | Sonner (title, description, Undo, close); Notion (text action) |
| layout | single line, multiline | Long messages | Sonner, Notion |

Excluded: an inverse (dark) surface. Notion's toast is dark (`rgb(44, 44, 43)`); Sonner's is
the popover surface. Area keeps the surface theme like its other floating layers; see Open
questions.

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| notion | target product | "Link copied" toast after the page's Copy link button (copies the URL only; its "Give access" action was not clicked) | app.notion.com (Chrome), 2026-09-26 | `notion--toast-link-copied--open` |
| shadcn | design system (rendered) | Toast demo (title, description, Undo) and success and error types | ui.shadcn.com/docs/components/base/toast, 2026-09-26 | `shadcn--toast-*--open` (3) |
| area | this system | Default and dismissible, before and after | localhost gallery | `before/area--*` (4), `area--*` (2) |

ChatGPT: its toasts follow actions that change data (sharing); not triggered. Figma: not
captured.

## Measurements

Generated with `node scripts/capture-compare.mjs` and filtered. Columns: Area after (default,
dismissible), Area before (default, dismissible), Notion, shadcn success.

| slot · property | area · default · rest · light | area · dismissible · rest · light | area · default · rest · light | area · dismissible · rest · light | notion · toast-link-copied · open · light | shadcn · toast-success · open · light |
|---|---|---|---|---|---|---|
| **shell** size | 360 × 40 | 360 × 40 | 360 × 38 | 360 × 38 | 621.48 × 42.99 | 384 × 62 |
| **shell** padding | 9 11 9 11 | 9 11 9 11 | 8 10 8 10 | 4 10 4 10 | 11 16 11 16 | 0 |
| **shell** radius | 12px | 12px | 12px | 12px | 8px | 18px |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(44, 44, 43) | lab(100 0 0) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, rgba(0, 0, 0, 0.06) 0px 5px 8px 0px | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, rgba(0, 0, 0, 0.06) 0px 5px 8px 0px | rgba(0, 0, 0, 0.06) 0px 2px 4px -1px | rgba(0, 0, 0, 0.06) 0px 2px 4px -1px | rgba(25, 25, 25, 0.05) 0px 20px 24px 0px, rgba(25, 25, 25, 0.027) 0px 5px 8px 0px, rgba(42, 28, 0, 0.07) 0px 0px 0px 1px | rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px |
| **icon** size | 16 × 16 | 16 × 16 | 16 × 16 | 16 × 16 | 16 × 16 | 16 × 16 |
| **icon** edge from shell (t r b l) | 12 332 12 12 | 12 332 12 12 | 11 333 11 11 | 11 333 11 11 | 13.5 589.48 13.49 16 | 23 351 23 17 |
| **text** size | 312 × 20 | 282 × 20 | 314 × 20 | 278 × 20 | 494.65 × 21 | — |
| **text** edge from shell (t r b l) | 10 12 10 36 | 10 42 10 36 | 9 11 9 35 | 9 47 9 35 | 11 110.83 10.99 16 | — |
| **text** font | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/21px 400 ui-sans-serif | — |
| **close** size | not found | 28 × 28 | not found | 28 × 28 | — | 28 × 28 |
| **close** edge from shell (t r b l) | not found | 6 6 6 326 | not found | 5 11 5 321 | — | 17 17 17 339 |

Notion's shadow is the 20/24 + 5/8 lift Area uses for Popover, Menu and Dialog, plus a
1px ring. Its text sits 16 from the side, its icon gap is 8 and its action is text only.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| surface · inset | **12** (border included), icon **12** from the top and side | Popover (the compact floating surface) | Was 10 (icon 11 from both). Notion 16, shadcn 16: Area keeps its compact-surface inset |
| surface · height | **40** for one line, with or without controls | Notion 43; Popover's numbers (20 line + 2 × 10) | Was 38. Controls no longer change the height |
| surface · radius | 12 (unchanged) | Container radius; concentric with the controls (12 − 6 = 6) | Notion 8, shadcn 18 |
| surface · shadow | **20/24 + 5/8 lift**, the Surface axis role `--area-shadow-float` (surface.css:1273); `none` under the Flat preset | Notion (same lift); Popover, Menu, Dialog | Was a 2/4 shadow. A role since audit S10 |
| icon · gap | 8 | Notion 8 | — |
| controls | 28px box, negative block margins; the last sits **6 from the top and side** (6 from the bottom on one line) | Popover close rule; concentric with the corner | Was 5 top / 11 side; the dismiss was a bespoke-toned ghost button, now neutral with the dismiss glyph |
| title | 14/20 strong | Typography: compact surface title; shadcn 500 | Was regular |
| body under a title | **muted** (`area-toast__description`) | Sonner (muted description); every surface description | Was default |
| danger and warning icons | the alert glyph | — | Danger used an ×, which reads as dismiss |

Inset equations: text top = 1 + 9 = 10; icon = 10 + (20 − 16)/2 = 12; last control top = 10 +
(20 − 28)/2 = 6, side = 12 + (16 − 28)/2 = 6.

## Behavior and accessibility

A standalone Toast's content announces itself: `role="status"` with `aria-atomic`, or
`role="alert"` for danger, as Alert does; `live={false}` turns this off (primitives.tsx:1411-1427).
`Toaster` and `useToaster()` host toasts (audit E-11 A, owner 2026-09-30; Toaster.tsx): polite and
assertive live regions exist before any toast, so the first message is announced (danger goes to the
assertive one), and its toasts render with `live={false}`; `show(options)` returns an id and
`dismiss(id)` removes one. Timers (default `duration` 5000) pause while the pointer or focus is in the
region (WCAG 2.2.1); a toast with an action stays until dismissed. F8 (`hotkey`) focuses the region,
named "Notifications (F8)". Toasts stack newest last at the viewport's end corner, 16 in, 8 apart
(`surface.css:1319-1333`; the 16 and 8 are the system's surface inset and row gap, not captured).
Focus return stays with the consumer. The dismiss is a ghost small Button
(28, radius 6) with the Area `dismiss` glyph, shown by `onDismiss` and named by `dismissLabel`
("Dismiss notification" by default; `primitives.tsx:1187-1188`, `:1204`). It is the close
recipe for rectangular surfaces, shared with Popover and Alert (audit S9).

## Visual pass

2026-09-27, Claude in Chrome, side by side with Notion's "Link copied" toast (the page's Copy link
button, which only copies the URL) beside the gallery's Warning tile at 2×: the same one-line
shape (40 tall, a 16px icon 12 in, the text on one line, an action at the end). Notion's toast is
inverse: a near-black fill, white text, a yellow warning icon and a blue text action. Area's
stays on the page's surface with the floating lift and colours only the icon, which matches the
owner's lighter-fill direction; an inverse toast remains an open option. Unverified: dark theme,
the action and dismiss hover on screen.

## Verification

- 4 shadcn/Notion captures, 4 Area before, 2 Area after; checksums verified; Notion capture
  redacted, no personal content.
- Measured in the gallery: every tile 40 tall (two-line tiles 60 and 64), icon 12/12, last
  control 6/6/6.
- Unverified: dark theme, screen reader announcement timing.

## Open questions

- Inverse (dark) toast like Notion's, as a variant or a theme choice.
- ~~A toaster (placement, stacking, timer) is out of scope by the prior decision.~~ Built:
  `Toaster` / `useToaster` (audit E-11 A, owner 2026-09-30).

## Motion and interaction, 2026-10-07

Contract: [MOTION.md](../MOTION.md), "Toast". Applies inside a Toaster only; a Toast placed on
its own (docs, inline) does not animate.

| Interaction | Before | After |
|---|---|---|
| enter | none: toasts popped in | `opacity` 0 → 1 and `translate` 0 16 → none (from the toaster's edge: 16 is the toaster's own offset), `duration-slow` 250, `ease-out`, `@starting-style` |
| exit | none: removed at once | `data-leaving` on the list item: `opacity` → 0 and `translate` 8 towards the edge, `duration-base` 150, `ease-out`; Toaster.tsx removes the item when its transition has run (the computed duration, 0 under "none" and reduced motion); `pointer-events: none` while it leaves |
| stack reflow | jump | FLIP: each moved item starts from its previous place as a whole-pixel `translate` and eases home over `duration-base`, `ease-in-out`; an interrupted reflow continues from where it is; works under CSS `zoom` |
| action, dismiss | Button's | Button's (not this pass) |
| pause on hover and focus, F8 | unchanged | unchanged; a leaving toast's timer is already cleared |

Crispness: every toast rests at opacity 1, translate none; reflow offsets are rounded to whole
pixels (`Math.round`).

Verification: gallery (`/`) Toaster tile (zoom 0.8): enter `opacity/translate: 250` ease-out;
a second toast moved the first by its local 47px (39 + 8 under zoom) with `translate:150`
`cubic-bezier(0.65, 0, 0.35, 1)`; rest translate none, opacity 1; Undo marked `data-leaving`
(`pointer-events: none`, `opacity/translate: 150` ease-out), the item was gone 300ms later and the
remaining toast reflowed from `0px -47px`; the last one leaving hid the region. Under
`data-area-motion="0"` the leaving toast computes `0s`. Verified on the dev server (background tab, so transitions were read from `getAnimations()` and computed styles, not watched; real-pointer hover could not be driven in a background tab, so hover rules were read from the stylesheet).

Open questions:
- Exit direction: 8px towards the bottom edge, into the stack gap, so it never overlaps the toast
  below. Sonner slides the whole height; recommendation: keep 8 (subtle).
- `data-leaving` is a new runtime hook; it should be declared in `manifest.ts` (toaster
  `states`); proposed to the lead.
- Swipe to dismiss is not built; no change proposed.

## Feedback log

- 2026-09-26 · pass 1 after the Dialog type and radius pass: Popover's inset and corner rule,
  40 tall, shared lift, strong title with a muted description.
- 2026-09-27 · merged the cohesion-audit branch → `neutral` tone restored as the default (muted icon), per the system rule that every family defaults to neutral; info, success, warning and danger colour the icon.
- 2026-09-27 · owner: "toast fill colors can be lighter and the foreground more vibrant" → toast
  has no tinted fill (surface in every tone); its tone icons take Alert's brighter rungs (info
  and danger 500, success and warning 550; dark unchanged). Fills were changed on Alert.
- 2026-09-27 · batch 3 → Claude in Chrome side by side with Notion's toast recorded (Visual pass); Validated.
- 2026-09-30 · audit S9 (owner) → Toast's ghost small Button close with the Area glyph is the rectangular-surface close recipe, now shared by Alert; `onDismiss` + `dismissLabel` is the one dismiss API. No code change.
- 2026-09-30 · audit S10 (owner) → the lift is the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat) → surface.css:1273.
- 2026-09-30 · audit S19 A (owner) → tones listed in Badge's order (neutral, info, success, warning, danger), one feedback set with Alert, whose neutral icon now matches Toast's muted ink. No visual change to Toast.
- 2026-10-01 · audit E-11 (owner pick A) → `Toaster` / `useToaster` host toasts with pre-existing polite and assertive live regions, pausing timers, an F8 hotkey and end-corner stacking; Toast gains `live` (default true) and a danger Toast is `role="alert"` → Toaster.tsx, primitives.tsx:1411-1427, surface.css:1319-1333.
- 2026-10-01 · compact pass (owner: "the toast action inset radius pairing looks incorrect" at compact) → the block inset was a literal 10 stepped to 6, which put the 24px action 2 from the top, 4 from the end, its 4px corner off the 8px corner. The block inset is now `inset-surface-sm + (icon − leading) / 2 − border`: default 10 (unchanged), compact 8, so the toast is 32 tall with the action 4 in on every side, concentric (8 − 4). Verified live; docs/research/compact-pass-2026-10-01.md.
- 2026-10-03 · radius audit D2 (owner) → a one-line toast takes `radius-control-lg` capped (40 → 10, compact 32 → 8), a titled toast the container 12 (`.area-toast:has(.area-toast__title)`). Was 12 / 8. `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → enter from the toaster's edge (16, `slow` ease-out), exit faster (`data-leaving`, 8, `base`), stack reflow by FLIP on `base` ease-in-out (`surface.css`, `Toaster.tsx`).
