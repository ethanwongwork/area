# Popover spec

**Captures:** `docs/research/captures/popover/` (pass-0 in `before/`)
**Peers:** Menu (same surface family and lift), SplitButton (native popover + anchor),
Tooltip (non-interactive annotation), Dialog (modal), BadgeGroup (overflow popover)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Popover uses Tooltip's medium UI type and shadow-2, with a 12px border-inclusive outer
inset. It uses the theme surface (white in light, dark in dark mode). Its preferred width
is 240px, capped at its container for every composition. Group gaps are 12px with 8px
inside the body. A small-control-height header contains the title and close button,
without negative margins or trimmed title line boxes. Description leading is UI leading
minus 2px (14/18px at default density). Examples omit pointers and share optional media,
header, body and optional footer slots. Media corners subtract the inset and border from
the outer radius. The optional decorative SVG pointer has a curved outline and supports
all four sides. See [WAI Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) and
[Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover). The existing
Popover API supplies the surface; consumers still own trigger, positioning, focus and
dismissal behavior.
- 2026-09-26: "go ahead with popover". Mixed controls that do not fit a menu (a segmented
  choice, fields, buttons) belong in a Popover (Menu pass).
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Floats interactive content (fields, choices, a short task) beside the element that opened
it, without blocking the page. Not Menu (a list of actions), not Tooltip (a name or hint,
no interaction), not Dialog (modal, blocks the page).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| composition | header (title, close), body, footer | Short tasks | Notion Share (tabs, field, list); shadcn (title, description, fields) |
| composition | media | Teaching step with an image | Area (prior decision) |
| side | bottom (default), top, right, left | Placement around the trigger | shadcn and Radix `side`; Notion opens below |
| arrow | off (default), on | Optional pointer | Area (prior decision); none of the products draws one |
| behaviour | anchored to a trigger (`trigger`) | Opens, positions and dismisses itself | Notion Share, shadcn Popover, ChatGPT model panel |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| notion | target product | Share popover (tabs, invite field, access list) | app.notion.com (Chrome), 2026-09-26; opened and closed, nothing sent | `notion--share-popover--open` |
| chatgpt | target product | Model "thinking effort" panel (a popover with a slider) | chatgpt.com (Chrome), captured in the Menu pass | `chatgpt--model-menu--open` |
| shadcn | design system (rendered) | Popover docs demo (dimensions form), 4px from its trigger | ui.shadcn.com/docs/components/popover, 2026-09-26 | `shadcn--popover--open` |
| shadcn-dialog | design system (rendered) | Dialog header: title, description, close | ui.shadcn.com/docs/components/base/dialog, 2026-09-26 | `shadcn--dialog-header--open` |
| primer | design system (rendered) | GitHub Primer Dialog header: title, close | primer.style React storybook (Dialog, default), 2026-09-26 | `primer--dialog-header--open` |
| area | this system | Teaching step before and after; field and image before; Dimensions header before and after pass 3 | localhost gallery | `before/area--*` (4), `area--teaching--rest`, `area--dimensions-header--rest` |

Figma: file-browser popovers were not opened (notifications would mark items as read).

## Measurements

Surfaces (generated with `node scripts/capture-compare.mjs`, filtered; the two Area columns
are after and before):

| slot · property | area · teaching · rest · light | area · teaching · rest · light | notion · share-popover · open · light | shadcn · popover · open · light | chatgpt · model-menu · open · light |
|---|---|---|---|---|---|
| **shell** size | 228.5 × 130 | 228.5 × 122 | 456 × 348.04 | 320 × 230 | 254 × 84 |
| **shell** padding | 11 | 11 | 0 | 10 | 0 |
| **shell** border | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 0 | 0 | 0 |
| **shell** radius | 12px | 12px | 12px | 10px | 16px |
| **shell** gap (row / column) | 16px / 16px | 12px / 12px |  | 10px / 10px |  |
| **shell** font | 14px/20px 400 Geist | 14px/20px 400 Geist | 16px/24px 400 ui-sans-serif | 14px/20px 400 Geist | 16px/24px 400 -apple-system-body |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | lab(100 0 0) | oklab(0.999994 0.0000455678 0.0000200868 / 0.9) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 20px 24px 0px, rgba(0, 0, 0, 0.06) 0px 5px 8px 0px | rgba(0, 0, 0, 0.06) 0px 1px 2px -0.5px | rgba(25, 25, 25, 0.05) 0px 20px 24px 0px, rgba(25, 25, 25, 0.027) 0px 5px 8px 0px, rgba(42, 28, 0, 0.07) 0px 0px 0px 1px | oklab(0 0 0 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px | rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.12) 0px 8px 16px -4px |

Header with a close (pass 3; Area after, Area before, then the references):

| slot · property | area · after | area · before (pass 2) | shadcn · dialog | primer · dialog |
|---|---|---|---|---|
| **title** font | 14px/20px 500 Geist | 14px/20px 400 Geist | 16px/16px 500 Geist | 14px/21px 600 -apple-system |
| **title** cap top from shell | +15.06 | +12.04 | +18.14 | +20.14 |
| **title** start from shell | +12 | +12 | +16 | +16 |
| **close** size | 28 × 28 | 28 × 28 | 28 × 28 | 32 × 32 |
| **close** edge from shell (t r b l) | 6 6 164 286 | 2.98 6 164 286 | 8 8 269 348 | 8 8 694 600 |
| **close** radius | 6px | 6px | 8px | 6px |

Both references sit the close box the same distance from the top and the side, half their
16px content inset, and centre the title on it (title cap centre within 2px of the close's
centre). Their titles sit lower than the side inset (cap 18 and 20 against 16).

Structure: Notion's popover has a 41px tab header, then its field row 16px below with 16px
sides, then 8px-inset list rows (menu-like). shadcn's content is a grid with 16px gaps inside
10px padding.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| surface · shadow | **`--area-shadow-float`**, the Elevation axis's float role: `0 0 2` + `0 8 16` at the Elevation step in % (3% key at the default 3), the ambient half, dark doubled; transparent at step 0 (axes/elevation.ts), as Menu | Notion (same lift on popovers and menus); ChatGPT 8/16; shadcn 4/6 + 2/4 | Was `shadow-2` (1–2px). One lift for every floating surface, a Surface axis role since audit S10 |
| surface · preferred width | **320** | shadcn 320; ChatGPT 254; Notion 456 | Was 240. Still capped at the container |
| sections · gap | **16** | Notion 16 (header to field); shadcn 16 | Was 12 |
| surface · inset | 12 (border included, unchanged) | Between shadcn 10 and Notion 16 | — |
| surface · compact | inset **12** (border included, held); corner **12**, concentric with the close (box 8 in at radius 4), capped at 2 × container and at the default container radius; section gap 12 (`inset-surface-md`) | Cursor upsell popover 16 inset, corner 12 (`compact/cursor-app--popover--open--light`); Figma Edit text style 16 sides, 12 top, corner 13 (`compact/figma--sectioned-popover--open--light`); Figma color picker 16 | Owner 2026-10-02 (cursor-desktop.md): no dense popover insets 8. Holds the default rather than exceed it; the corner follows so the close stays concentric (was 8) |
| surface · radius, border | 12, 1px decorative (unchanged) | Notion 12; all use a 1px ring | — |
| header · title group | title and description in the header, **6** apart (title baseline to description cap **15**) | shadcn: title baseline to description cap 15 (h4 leading-none + `space-y-2`) | Owner (pass 2): the gap was too large. The description sat in the body, 29 below the title's baseline. Area Dialog measures 8 with its larger title; see Open questions |
| header · close | box **6** from the top and **6** from the side (half the 12 inset); icon on the 12 inset both ways; 6px radius concentric with the 12px corner; title centred on it (centres 20 and 20) | shadcn 8/8 and Primer 8/8, half their 16 insets; `inset.css`: glyph edges on the shell inset | Owner (pass 3): the close should sit evenly in the corner. Pass 2 put it 3 from the top and 6 from the side, because the header was cap-trimmed and the close hung off the title's line |
| header · top inset | with a close: title centred on the close (cap **15**; header top = (icon − title leading) / 2). Without one: title cap **12** from the top | References centre the title on the close (cap 18 and 20 against a 16 inset). Without a close, nothing sets the row, so the cap sits on the inset like the sides | Was 21 (pass 1) and 12 with a close (pass 2). Browsers without `text-box` support keep 17 when there is no close |
| title · weight | **strong (500)** | shadcn 500, Primer 600; the title is the description's size, so weight is the only cue besides color | Was regular under the typography rule (titles at 400, carried by size or color). See Open questions for peers |
| spacing ladder | 12 inset · 16 between header, body and footer · 8 between items in a section · 6 inside the title group | shadcn (16 sections, 8 fields); Notion (16) | Pass 1 mixed 16 above a description with 8 below it |
| anchored · offset | **8** from the trigger (`POPOVER_OFFSET`), plus the arrow's reach with `arrow`; menus and tooltips sit 4 | Audit S16 (owner 2026-09-30); shadcn 4; Notion's menus 4 | Was 4, the menu gap |
| anchored · placement | `side` and `align` via the shared JS engine (`useAnchoredPosition`), flipping and shifting inside an 8 viewport padding; writes `data-side` and `transform-origin` | Radix/shadcn `side`; audit S16 | No CSS-only anchored path any more (was CSS anchor positioning, centred in the viewport without support) |

## Behavior and accessibility

With `trigger`, Popover gives the trigger
`popovertarget`, `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`, and renders
the surface as `popover="auto"` with `role="dialog"`. On open, focus moves to the first
focusable element (or the surface); Escape and clicks outside close it (platform); on close
from inside, focus returns to the trigger. Verified in the gallery with a real pointer:
opens below the trigger (4px at the time; 8 since audit S16), focus on the first field, Escape closes and refocuses the trigger, outside
click closes. Without `trigger`, Popover stays a static surface (BadgeGroup's overflow uses
it that way).

## Variant coverage (pass 3 check)

Every documented variant has a gallery tile: anchored (trigger), teaching step (header with
title, description and close; footer with a muted step count), with field (title and close
only), composition / image (media), and arrow on each side (top, right, bottom, left; the
arrow points back at the trigger, and its curved outline joins the border at 3×). The docs
page's Default example now uses the real header slots instead of ad-hoc markup.

## Visual pass

2026-09-28, Claude in Chrome (batch 7): Notion's Share popover open beside the gallery's field
popover, both zoomed. Same white surface, 1px ring and two-layer lift (Area's lift is Notion's);
Notion's corner reads about 10 against Area's 12 (the container role). No change. The zoom held
personal data and was not kept. Earlier passes (2, 3) compared shadcn and Primer headers; see
Decisions.

## Verification

- 3 reference captures, 3 Area before, 1 after; checksums verified; no personal content.
- `typecheck`, `build:docs`, contracts, preview, React and token tests: see the pass report.
- Unverified: dark theme, screen reader announcement of the dialog, arrow alignment when the
  anchored popover shifts to stay in view.

## Type pass (2026-09-26)

Description 14/18 → 14/20, matching every surface description (typography.md); header row
gap 6 → 5 keeps title baseline to description cap at 15.1. Overrides the prior 14/18
decision.

## Open questions

- The header offset assumes a small (28px) icon-only close, the only close Area's demos use.
  Settled by audit S9 (owner): rectangular surfaces close with a ghost small Button (28, radius
  6) and the Area `dismiss` glyph, as Popover, Toast and Alert do; Dialog's 32px close is the
  written exception.

- Dialog's title group measures title baseline to description cap 8 (title 20/28, gap 8);
  Popover's is 15. Worth one rule for both in the Dialog pass.

## Motion and interaction, 2026-10-07

Contract: [MOTION.md](../MOTION.md), "Popover, menu ...". One enter and exit shared with Menu,
Tooltip and every anchored surface built on `.area-popover` (Hover card, date panel).

| Interaction | Before | After |
|---|---|---|
| open | `opacity` + `scale` 0.97 → 1, `duration-base` (150), `ease-out`, `@starting-style`, origin at the trigger (overlay.ts) | unchanged |
| close | same clock as the open: `duration-base`, `ease-out` | one step faster: `duration-fast` (100), `ease-out` (`--_overlay-exit`, carried by the closed rule, since a transition takes the duration of the state it goes to); `display`/`overlay` `allow-discrete` keep the top layer for it |
| rest | `scale: 1` (an identity transform on the resting surface) | `scale: none`: no transform at rest, so layout snaps it; `none` interpolates as 1 |
| close button, footer buttons | Button's | Button's (not this pass) |
| reduced motion / motion 0 | tokens 0, scale 1 | unchanged; no literal durations remain |

Crispness: the arrow's 50% centre is `round(down, 50%, 1px)` (after a plain 50% fallback), so
an odd-width popover's arrow and its 1px edge sit on whole pixels (a 321 popover: arrow 144
from its edge, was 144.5). The header's cap offset `(1cap − 1lh) / 2` is rounded to a whole
pixel (−5.03 → −5): popovers measured 63.98 and 151.98 tall and a top-side popover sat 7.98
from its trigger; now 64 and 152.

Verification: `/popover.html`, trigger opened: enter `opacity:150 scale:150` ease-out; close
`display/opacity/overlay/scale: 100`; at rest opacity 1, `scale: none`, transform none, rect
428 × 1162, 320 × 152 (whole). Under `data-area-motion="0"` the duration is 0s.
Verified on the dev server (background tab, so transitions were read from `getAnimations()` and computed styles, not watched; real-pointer hover could not be driven in a background tab, so hover rules were read from the stylesheet).

Open questions: none new.

## Feedback log

- 2026-09-26 · owner: "go ahead with popover" → shared lift with Menu, 320 wide, 16 gaps,
  and an anchored `trigger` with focus handling.
- 2026-09-26 · owner: is the title-to-description gap too large; is the title aligned with the
  close; are the gaps consistent → measured: gap 29 (shadcn 15), close centred but setting a
  28px header, title cap 21 from the top against a 12 inset. Pass 2: description in the header
  6 below the title (15), close on the title line with its icon on the inset, header gives
  back the leading above the cap (12), one ladder 12 / 16 / 8 / 6. Verified in the gallery.
- 2026-09-26 · owner: should the title be medium weight; the close should have even padding in
  the corner, and the title beside it looks off → measured: close box 2.98 from the top and 6
  from the side; shadcn and Primer sit theirs 8/8 (half their inset) with the title centred on
  it, titles 500 and 600. Pass 3: close 6/6 with its icon on the inset and a concentric radius,
  title centred on it (cap 15), title strong. Verified in the gallery at 1× and 3×, with hover.
- 2026-09-27 · merged the overlay-behavior branch → a Popover `trigger` now positions with `computePosition` (flip to the side with room, shift inside an 8px viewport margin, re-placed on scroll and resize; `align`, `offset`, controlled `open`) instead of CSS anchor positioning, so the arrow follows the side it lands on → [overlay behavior](overlay.md).
- 2026-09-28 · batch 7 Claude in Chrome (Notion Share popover) → no change.
- 2026-09-30 · audit S9 (owner) → Popover's ghost small Button close with the Area glyph is the rectangular-surface close recipe, now shared by Toast and Alert; Dialog keeps a 32px md close as the exception. No code change.
- 2026-09-30 · audit S10 (owner) → the lift is the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat), shared by every floating surface → surface.css:866.
- 2026-09-30 · audit S17 (API vocabulary, slice 1) → manifest default `side` is `bottom` (was `top`), matching the React trigger default → `manifest.ts:553`.
- 2026-10-02 · Cursor and Figma captures (owner) → compact inset 8 → 12, held at the default: dense popovers inset 16 (Cursor, Figma), none 8 → surface.css `.area-popover` `--_inset`; docs/research/compact-evidence-2026-10-02/cursor-desktop.md.
- 2026-10-02 · compact sweep → compact corner 8 → 12 (`--_popover-radius`): with the 12 inset the close's box sits 8 in at radius 4, so the container corner left it non-concentric. Capped at 2 × container and at `radius-base-container`; default unchanged under every preset (standard 12 → 12, round 14 → 13, rotund 16 → 14, pill 24 → 24).
- 2026-10-03 · roundness → the compact cap reads the container role instead of the base leaf, so the corner follows the offset (`surface.css`, `--_popover-radius`). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · two roundness step sizes (owner) → the corner is the surface corner at both densities, stepping by 4; the min() against the compact close equalled it at the default and only differed away from it (`surface.css`, `--_popover-radius`). `docs/research/radius-audit-2026-10-03.md`, "Step size for large shapes".
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → the surface corner; media floored at min(4, setting) (`surface.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → the shared anchored close now one step faster (fast, was base); rests at `scale: none`; arrow centre and header cap offset rounded to whole pixels (`surface.css`).
- 2026-10-12 · type size and density split (owner) → surface corners (`radius-container`) cap at 1.5 × `inset-surface-md`, so a compact popover stays at 18 when the radius setting asks for 20 or 24 (`emit/base.ts`). `docs/research/ui-size-scale-2026-10-12.md`.
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the popover lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Then the arrow too: at 0 it takes `shadow-edge-filter`, the same edge as a drop-shadow, clipped so the shadow of its 1px shell overlap stays out of the shell (its shoulders join as the 1px frame's do). Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).

## Review note, 2026-10-22 (round 68)

- **What changed:** the description sits directly under the title: 10 from the title's baseline to the description's cap, was 15 (a 5 gap).
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs". Alert and Toast shared the 5 and change with it.

## Review note, 2026-10-22 (round 70)

- **What changed:** the teaching step's footer reads "1 of 3" instead of a bare "1". It is a new part, `PopoverStep`
  (`current`, `total`): UI text in the muted ink, with figures of one width so the footer doesn't shift between steps.
- **Why:** your round 68 note, "is it supposed to just say 1? is it 1/5 steps?". The number was the step without its
  total, so it didn't say what it counted. Tours write both (Atlassian's spotlight, Notion's onboarding: "1 of 3").
