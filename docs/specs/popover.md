# Popover spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-26 (pass 3: close in an even corner, title centred on it, strong title))
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
| side | top, right, bottom, left | Placement around the trigger | shadcn and Radix `side`; Notion opens below |
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
| surface · shadow | **`0 20px 24px`, `0 5px 8px`** in `shadow-color` (as Menu) | Notion (same lift on popovers and menus); ChatGPT 8/16; shadcn 4/6 + 2/4 | Was `shadow-2` (1–2px). One lift for both floating surfaces |
| surface · preferred width | **320** | shadcn 320; ChatGPT 254; Notion 456 | Was 240. Still capped at the container |
| sections · gap | **16** | Notion 16 (header to field); shadcn 16 | Was 12 |
| surface · inset | 12 (border included, unchanged) | Between shadcn 10 and Notion 16 | — |
| surface · radius, border | 12, 1px decorative (unchanged) | Notion 12; all use a 1px ring | — |
| header · title group | title and description in the header, **6** apart (title baseline to description cap **15**) | shadcn: title baseline to description cap 15 (h4 leading-none + `space-y-2`) | Owner (pass 2): the gap was too large. The description sat in the body, 29 below the title's baseline. Area Dialog measures 8 with its larger title; see Open questions |
| header · close | box **6** from the top and **6** from the side (half the 12 inset); icon on the 12 inset both ways; 6px radius concentric with the 12px corner; title centred on it (centres 20 and 20) | shadcn 8/8 and Primer 8/8, half their 16 insets; `inset.css`: glyph edges on the shell inset | Owner (pass 3): the close should sit evenly in the corner. Pass 2 put it 3 from the top and 6 from the side, because the header was cap-trimmed and the close hung off the title's line |
| header · top inset | with a close: title centred on the close (cap **15**; header top = (icon − title leading) / 2). Without one: title cap **12** from the top | References centre the title on the close (cap 18 and 20 against a 16 inset). Without a close, nothing sets the row, so the cap sits on the inset like the sides | Was 21 (pass 1) and 12 with a close (pass 2). Browsers without `text-box` support keep 17 when there is no close |
| title · weight | **strong (500)** | shadcn 500, Primer 600; the title is the description's size, so weight is the only cue besides color | Was regular under the typography rule (titles at 400, carried by size or color). See Open questions for peers |
| spacing ladder | 12 inset · 16 between header, body and footer · 8 between items in a section · 6 inside the title group | shadcn (16 sections, 8 fields); Notion (16) | Pass 1 mixed 16 above a description with 8 below it |
| anchored · offset | **4** from the trigger; the arrow's height with `arrow` | shadcn 4; Notion's menus 4 | — |
| anchored · placement | `side` via CSS anchor positioning, flipping when out of room | Radix/shadcn `side` | Browsers without anchor positioning centre it in the viewport |

## Behavior and accessibility

With `trigger`, Popover wraps the trigger in `.area-popover-anchor`, gives it
`popovertarget`, `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`, and renders
the surface as `popover="auto"` with `role="dialog"`. On open, focus moves to the first
focusable element (or the surface); Escape and clicks outside close it (platform); on close
from inside, focus returns to the trigger. Verified in the gallery with a real pointer:
opens 4px below, focus on the first field, Escape closes and refocuses the trigger, outside
click closes. Without `trigger`, Popover stays a static surface (BadgeGroup's overflow uses
it that way).

## Variant coverage (pass 3 check)

Every documented variant has a gallery tile: anchored (trigger), teaching step (header with
title, description and close; footer with a muted step count), with field (title and close
only), composition / image (media), and arrow on each side (top, right, bottom, left; the
arrow points back at the trigger, and its curved outline joins the border at 3×). The docs
page's Default example now uses the real header slots instead of ad-hoc markup.

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

- Dialog's title group measures title baseline to description cap 8 (title 20/28, gap 8);
  Popover's is 15. Worth one rule for both in the Dialog pass.

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
