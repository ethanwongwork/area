# Toast spec

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
  (Insets and height superseded by pass 1; the rest stands.) — superseded 2026-09-30 (audit E-11 A, built
  2026-10-01): `Toaster` / `useToaster` host toasts with a queue, placement and timers; Toast itself stays the
  surface, and focus return stays with the consumer.
- 2026-09-26: "do the next component" after the type and radius pass. Every surface title is
  strong (typography.md); corner controls sit evenly in the corner (Popover pass 3).
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Reports the outcome of an action without interrupting, and leaves on its own or when
dismissed. Toast is the surface; `Toaster` hosts toasts for an app: `useToaster().show()` queues one
at the viewport's end corner, announces it, and removes it after its timer or on dismiss. Not Alert
(inline and persistent), not Dialog (blocks), not Popover (anchored, interactive content).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| tone | neutral (default, muted icon), info, success, warning, caution, danger, discovery (icon colour, `fg-<tone>-mark`; caution and discovery 2026-11-07) | Outcome; Button's and Badge's seven | Sonner types (success, info, warning, error); Notion (warning icon) |
| composition | icon, title + description, action, dismiss | Undo, follow-up | Sonner (title, description, Undo, close); Notion (text action) |
| layout | single line, multiline | Long messages | Sonner, Notion |
| composition | standalone Toast; Toaster (`show`, `dismiss`, timers, stacking) | Hosting | Sonner's Toaster; Radix Toast (F8, 5000) |

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
| surface · inset | **`inset-surface-sm`** at the sides (12, compact 8; border included); above and below so the 16 icon sits as far from the top as from the side (10 + 2, compact 8) (surface.css:1554-1563) | Popover (the compact floating surface); compact pass 2026-10-01 | Was 10 (icon 11 from both). Notion 16, shadcn 16: Area keeps its compact-surface inset |
| surface · width | 360, `--area-toast-inline-size` overrides; at most 100% | Not captured (shadcn 384) | — |
| surface · height | **40** for one line, with or without controls (compact 32) | Notion 43; Popover's numbers (20 line + 2 × 10) | Was 38. Controls no longer change the height |
| surface · radius | one line: `radius-control-lg`, capped (40 → 10, compact 32 → 8); titled: `radius-container` 12 (surface.css:1565, 1578) | Radius audit D2 (owner, 2026-10-03): a one-line toast is a bar, as Alert; concentric with the controls | Was 12 / 8. Notion 8, shadcn 18 |
| surface · edge | `border-width` `border-float` | Floating surfaces | — |
| surface · shadow | **`--area-shadow-float`**, the Elevation axis's float role, after the Surface axis's `shadow-edge` (and a material's layers) (surface.css:1570) | Notion (same lift); Popover, Menu, Dialog; Surface axis (owner, 2026-10-14) | Was a 2/4 shadow. A role since audit S10 |
| icon · gap | `ui-cluster` (8, compact 6) | Notion 8 | — |
| controls | 28px box (compact 24), negative block margins; the last sits **6 from the top and side** (compact 4), concentric with the corner (surface.css:1593-1602) | Popover close rule | Was 5 top / 11 side; the dismiss was a bespoke-toned ghost button, now neutral with the dismiss glyph |
| title | UI type (14/20), strong; 5 above the description (surface.css:1589-1590) | Typography: compact surface title; shadcn 500; Popover's title rule (audit E-13) | Was regular |
| body under a title | **muted** (`area-toast__description`) | Sonner (muted description); every surface description | Was default |
| danger and warning icons | the alert glyph | — | Danger used an ×, which reads as dismiss |

Inset equations: text top = 1 + 9 = 10; icon = 10 + (20 − 16)/2 = 12; last control top = 10 +
(20 − 28)/2 = 6, side = 12 + (16 − 28)/2 = 6.

## Behavior and accessibility

A standalone Toast's content announces itself: `role="status"` with `aria-atomic`, or
`role="alert"` for danger, as Alert does; `live={false}` turns this off (primitives.tsx:1514-1544).
`Toaster` and `useToaster()` host toasts (audit E-11 A, owner 2026-09-30; Toaster.tsx): each toast is
said through the shared announcer (`announce`; danger is assertive, the rest polite), and its toasts
render with `live={false}`; `show(options)` returns an id and
`dismiss(id)` removes one. What is announced is the plain-text title and message, or `announcement`.
Timers (the Toaster's `duration`, 5000 by default, or the toast's own) pause while the pointer or focus is
in the region (WCAG 2.2.1); a toast with an action stays until dismissed. F8 (`hotkey`) focuses the region,
named "Notifications (F8)" (`label`); the region is hidden while empty. Toasts stack newest last at the
viewport's end corner, 16 in, 8 apart, on the `z-toast` layer (`surface.css:1519-1529`; the 16 and 8 are the
system's surface inset and row gap, not captured). A toast enters from the edge and leaves through
`data-leaving` (see "Motion and interaction, 2026-10-07").
Focus return stays with the consumer. The dismiss is a ghost small Button
(28, radius 6) with the Area `dismiss` glyph, shown by `onDismiss` and named by `dismissLabel`
("Dismiss notification" by default; `primitives.tsx:1519-1520`, `:1541`). It is the close
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
| exit | none: removed at once | `data-leaving` on the list item: `opacity` → 0 and `translate` 8 towards the edge, `duration-base` (210 at the default), `ease-out`; Toaster.tsx removes the item when its transition has run (the computed duration, 0 at motion 0 and under reduced motion); `pointer-events: none` while it leaves |
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
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the toast lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).

## Review note, 2026-10-22 (round 68)

- **What changed:** the description sits directly under the title: 10 from the title's baseline to the description's cap, was 15.
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs".

## Review note, 2026-11-06 (balance pass)

- **What changed:** the description stands one step (4) off the title: 12.8 baseline to cap, beside the description's
  own 8.8. It was joined (8.8), so the title read as the paragraph's first line.
- **Why:** the owner, on the confirm dialog: "the space between the title and the copy still doesnt look right". One
  rule for every surface title (Card, Dialog, Confirm dialog, Drawer, Popover, Alert, Toast, Approval, Empty state sm).
  DESIGN_SYSTEM.md, "Text pairs"; `docs/research/title-balance-2026-11-06`.
- The owner approved the 4 step ("4 is right", 2026-11-06).

### 2026-11-07 · Status icon ink (system gaps C5)

- **What changed:** the icon reads `fg-<tone>-mark`, the role Alert reads, instead of a copy of Alert's four inks. Same values.
- **Why:** one colour vocabulary for labels and one ink for status icons (GOVERNANCE.md § 4; owner picked Build on the
  system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Caution and discovery; the __actions part (components audit O4, O7)

- **What changed:** `tone` takes caution and discovery (the icon on `fg-caution-mark` / `fg-discovery-mark`); the actions part is `__actions`, Alert's name, and the prop `actions`; `__action` and `action` are deprecated aliases kept for one release (the class still painted).
- **Why:** manifest.ts:934, :935; Alert's part was `__actions`, Toast's `__action`. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · One announcer (components audit D1)

The Toaster's two hand-written regions (polite and assertive) are replaced by the shared announcer (`announce` / `useAnnouncement` (packages/react/src/components/announce.ts; DESIGN_SYSTEM.md, "Announcements")); `show`
calls `announce(said, { politeness: tone === "danger" ? "assertive" : "polite" })`. A standalone Toast keeps its own
`role` (its visible text is the message). No visible change.
- 2026-11-11 · system evaluation A1.2 · stacked toasts are `ui-cluster` apart (8, Compact 6; was a fixed 8).

## Review note, 2026-11-11 (motion, plan A5)

- **What changed:** the exit (`data-leaving`) accelerates on `ease-exit` and its fade reads `fade-base`, so reduced motion keeps it (A5.1); the enter is unchanged.
- **Why:** the system evaluation's motion items (docs/research/system-evaluation-2026-11-11, section 5, A5), owner-approved
  2026-11-11; the rules are in docs/MOTION.md (Tokens, Roles, Recipes) and kept by cohesion.test.mjs and
  tests/behaviour/suites/motion.test.mjs. The motion tables above are history; these values are current.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** In dark it paints the floating ground (`bg-float`, plan A7.2): a step above the layers under it, #0c0c0c on the near-black page at the defaults (was `bg-surface`, the page's own #020202); light is unchanged. Its dark edge is one line (plan A7.1): the frame takes the dark rim's strength (16% at Shadow 8) and the rim is no longer drawn outside it, where it had made a two-tone 2px edge.
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.

## Shared parts (plan B2), 2026-11-13

- **Leading icon (B2.4, G10).** The icon is a box one first line tall with the glyph centred in it (the box technique), instead of a `(line − icon) / 2` margin: the same pixels, one way.

## Density (plan B8.2), 2026-11-14

Space between pieces reads a density role (DESIGN_SYSTEM.md, Size and shape; `density.test.mjs`). Values at type 13
Compact / Default / Comfortable; each is whole at type 12 to 16 and every density, and the default is unchanged unless said.

- Checked, nothing moved: the stacked footer and the toaster's list were already `ui-cluster` (plan A1.2).
- 2026-11-14 · system evaluation B6.1, B6.7 · the frame and shadow stack are the one floating surface's (popup.css); Alert now agrees with Toast on action placement (no width query), and `popups.test.mjs` pins their shared inset, icon box, gaps, title weight and bar corner. No visible change.

## Shared bars and corners (plan B4), 2026-11-14

- B4.2: the last control is a corner control: 5 from the top and the end at the defaults, its corner the toast's less 5 (5 in a one-line toast's 10, 11 in a titled toast's 16; it kept the small control's 6).
- 2026-11-14 · system evaluation B6.7 (correction) · Toast is the same wrapping row as Alert: Undo stays beside the text while both fit and wraps below it, end-aligned and `ui-cluster` under the text, when they don't; the text never shrinks to make room and keeps the icon's line; the close sits out of the row in the top corner. Pinned by `tests/behaviour/suites/wrap.test.mjs`.
