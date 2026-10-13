# Consistency and cohesion pass, 2026-10-12

**Request (owner):** "maybe now is a good time to do a consistency and cohesion pass on all the components again. i am
particularly interested in stroke values and how they are used, if there is a clear system for strokes, color,
transparency, etc. i want you to look into all other details as well, like surface fill colors, gaps, margins,
padding, type ramp sizes, etc. be thorough and make no mistakes"

**Result.** Strokes had a clear colour ladder but no rule for which width token a line reads, so the same job was drawn
three ways, and required lines in 14 families disappeared under the Elevated surface preset, among them the swatch
ring that audit F-5 had already fixed once. The rule is now written (DESIGN_SYSTEM.md, "Strokes") and tested
(`cohesion.test.mjs`); 21 stylesheets changed to follow it. Five families changed visibly and went back to review (all approved in round 21, 2026-10-12); every other change
paints the same pixels at the default settings. Fills, type and spacing were already systematic; their outliers are
listed under [Owner decisions](#owner-decisions-2026-10-12), all taken on the recommendation.

## Method

1. **Every declaration.** All 69 component stylesheets plus `inset.css` and `base.css` parsed with PostCSS: 7,448
   declarations, each with file, line, selector and enclosing at-rules. From them: every line (`border*`, `outline*`,
   ring-shaped `box-shadow`, line-sized boxes and private `--_*edge/line/ring/border` slots: 1,187 declarations),
   every colour literal and `color-mix()`, every fill, gap, padding, margin, type size, leading, weight, opacity and
   focus offset. Each was tallied by token and by family, then read in context.
2. **The rules already written.** DESIGN_SYSTEM.md ("Shared state paint", "Elevation", radius), CONTRAST.md, the
   cohesion audit (2026-09-26) and the 2026-09-29 audit's owner decisions (S1–S21), so nothing the owner settled was
   reopened as a finding.
3. **Rendered.** Specimens of each candidate side by side in light, dark, Elevated and increased contrast (the built
   gallery's tiles with Area's stylesheet only), computed styles read back to confirm each finding.
4. **Before and after.** Every gallery specimen (917) rendered in the build before and after the changes, in light and
   dark at default and compact density, and fingerprinted by what paints (`apps/docs/scripts/review-diff.mjs`).

## The system, as found and as now written

### Stroke width

Two tokens, both 1px by default: `stroke-width` (never changes) and `border-width` (the Surface axis: 0 under
Elevated). CONTRAST.md said only "`stroke-width`: required edges ... `border-width` is decorative", and nothing said
which lines are required. Before this pass the library had 83 `stroke-width` references, 93 `border-width` references
and 19 lines written as a literal `1px`; after it, 124, 70 and 7 (the 7 are the swatch palette's owner-measured state
rings, Board's card shadow offsets and two visually hidden 1px boxes).

The rule now written (DESIGN_SYSTEM.md, "Strokes"): `stroke-width` for every line that carries meaning or stands alone
(control, field and state edges; swatch and image rings; cutouts; joined-control seams; standalone dividers on
`border-divider`; frames with no shadow), `border-width` for the frames of shadowed surfaces, the seams inside them and
the edges of filled shapes. Width follows the colour role: `border-decorative` and `border-float` lines ride the Surface
axis, `border-divider` and every `edge-*` line does not.

### Stroke colour

A ladder, lightest to firmest, each rung with one job: `border-decorative` #f3 (seams, filled shapes) · `border-float`
#f3 / dark #4b (floating frames) · Card edge neutral 100 #ee (standalone surfaces) · `border-divider` = `edge-control`
#e2 (standalone rules; control and field edges; off tracks) · `edge-control-hover` #d4 (hover; choice glyphs, thumbs,
tiles at rest) · `border-hover` #b4 in a contrast mix (strong hover) · `stroke-control` #83 (Calendar today, Breadcrumb
separators). Tonal edges are measured blends (`semantic/stroke.ts`). The ladder was sound; four lines used the wrong
rung or a raw rung where a contrast-aware role exists (below).

### Transparency

Translucency is reserved for grounds a component cannot know. Alphas in use: 5% `bg-hover` and 7% `bg-active`
(plates on unknown grounds, controls nested on rows); 6% black / 10% white, the soft-mark plate (Badge soft, Chip input,
soft Count), hover 10.7% / 22.6%; Tag's Notion palette, warm 7%; 8% / 12% of a Board column's colour; 10%, the swatch
ring; 12% `currentColor`, the dismiss plate (Badge, Chip, Tag, Alert); 14% `currentColor`, a keycap inside a Button;
15% black, the palette's selected ring (owner, round 18); 18% ink, the scroll thumb; 20% `currentColor`, Code's on-colour
edge; 24% on-solid, the Split button divider; 25% ink, the Spinner track. Each has one job, and the same job uses the
same alpha everywhere. The swatch ring was the exception: its token existed but three places in `color.css` spelled
the colour out (fixed).

### Fills

Surfaces read `bg-surface` (22 families), the row pair `bg-component-hover` (22) and `bg-component-active` (20),
`bg-component` (8), `bg-subtle` (5) and `bg-page`, with `selection-*` and tonal `*-surface` roles on top. The cohesion audit's row-plate and selection rules hold in every family (the cohesion test checks them). Wells
differ by owner decision: Card media neutral 25 (#fa), Empty state's tile `bg-component`, Asset row's well `bg-subtle`
(both #f7), File upload's tile white with the field edge (owner, 2026-10-10).

### Type

Every size and leading reads a ramp token (`ui-*`, `text-*`, `title-*`, `control-*-text`) except four, three of them
documented: Kbd's 11 and 10 (tiny chrome, cohesion audit decision 3), inline Code's `0.875em` with a 12 floor (it
follows its host text), Code block sm's 12/18 mono (round 11). The fourth is Empty state md's title, 18/24 (ChatGPT's),
which is off the six-step ramp (below). Weights are only `weight-regular` and `weight-strong`, by the S2 rule.

### Spacing

Gaps read the tier tokens (`gap-sm/md/lg`, 6 at default, 4 compact) for icon-to-label, `gap-row` for list rows,
`ui-cluster` / `ui-stack` / `ui-row-gap` for layout that follows density, and fixed `space-*` steps for the rest. Literal
pixels are all marked spec: Alert, Popover and Toast share a 5 title-to-description gap; Board cards and Message bubbles
pad 10 (Notion, ChatGPT); Tree view's 6 gap and Nav's matching nested indent; Menu rows with a description pad 6
(ChatGPT); Description list's framed columns 5 / 10. None conflicts with a peer.

### Focus

One ring (`focus-width` 2, `focus-color`); `focus-offset` 2 outside for standalone controls, inset by `focus-width` for
rows, tabs and cells, 0 for controls nested in a field, the field rings (`field-focus-*`) for editable fields. Two
offsets were written with the wrong token (same pixels, fixed). Pill dismiss buttons differ from other nested
controls (open).

## Findings and changes

"Same pixels" means identical at the default settings in light and dark; the change shows under the Elevated surface
preset or increased contrast, where noted.

| # | Finding | Before | Change | Visible |
|---|---|---|---|---|
| 1 | The swatch ring regressed to `border-width` (audit F-5 had moved it to `stroke-width`); its own comment says it ignores the Surface axis, and a white swatch vanished under Elevated | `color.css:74` literal colour at `border-width` | `token-swatch-ring` at `stroke-width` | Elevated only |
| 2 | Chip's swatch still had ColorSwatch's retired solid `bg-component` edge, after the owner's "one swatch outline everywhere" | `chip.css:150` | the swatch ring at `stroke-width` | **Yes** (Chip swatch, swatch only) |
| 3 | The swatch ring written as a literal and `1px` | palette `color.css:151`; picker area, tracks, contrast pair, preview (`color.css:239, 282, 318, 360, 377`); thumbs `291, 299, 323` | the token and `stroke-width` | Same pixels |
| 4 | Code's swatch ring at `border-width` | `token.css:46` | `stroke-width` | Elevated only |
| 5 | Cutout rings at `border-width`, so overlapping avatars and an anchored indicator lost their gap under Elevated | `display.css:100`, `indicator.css:64` | `stroke-width` | Elevated only |
| 6 | Property list's drop line was `border-width` × 2: a state mark that vanished under Elevated | `property-list.css:69-70` | `stroke-width` × 2 | Elevated only |
| 7 | Standalone dividers in three widths: Separator and Menu separators a literal 1px, Accordion and Toolbar `stroke-width`, Nav, Tabs, Table, Shortcut list and Description list `border-width` | `display.css:114, 119`; `nav.css:258, 294`; `navigation.css:89, 92, 173, 240`; `shortcut-list.css:53`; `description-list.css:85-86` | `border-divider` rules at `stroke-width` | Elevated only |
| 8 | Seams inside a container in two widths: Panel, Code block, Command palette and Color picker rules `border-width`, Toolbar separator `stroke-width`, Menu separator a literal 1px | `toolbar.css:68-69`, `surface.css:1255` | `border-width`, with the container's frame | Elevated only (they now go with the frame) |
| 9 | Frames with no shadow on `border-width`: Code block, Description list framed, File upload zone, rows and tile (the Table frame and Composer were already `stroke-width`) | `code.css:198, 207`; `description-list.css:92`; `file-upload.css:22-23, 55, 95-96` | `stroke-width` | Elevated only |
| 10 | Color field's opacity seam at `border-width`, every other Input group seam at `stroke-width` | `color.css:210` | `stroke-width` | Elevated only |
| 11 | Select's open picker framed with `border-decorative`; every other floating surface uses `border-float` | `navigation.css:442` | `border-float` | **Yes**, dark only (#4b, was #28) |
| 12 | Board's card actions plate floats with the float lift but no frame; in dark it is the card's own colour and could not be seen | `board.css:164-176` | `border-float` as an inset outline | **Yes** (on hover or focus) |
| 13 | Tree view's check box rests on the field edge #e2; Checkbox, which it is drawn to match, rests on #d4 (audit S5) | `tree-view.css:121` | `edge-control-hover` | **Yes**, light only |
| 14 | Badge modern, a white raised plate, edged with the #f3 seam; Area's raised plates (Segmented thumb, soft Toggle group selection) draw `edge-selected` #e2 with `shadow-1`; Untitled's modern badge #d5 | `badge.css:190` | `edge-selected`, hover `edge-control-hover` | **Yes** |
| 15 | Control edges on the raw `border-subtle` rung, which does not strengthen under increased contrast: Calendar tile days, Color picker thumbs (Slider's thumb reads `edge-control-hover`) | `calendar.css:132`, `color.css:244` | `edge-control-hover` | Same pixels; firmer under increased contrast |
| 16 | Switch's disabled opacity read an unset `--_disabled-opacity` hook with a literal 0.5, bypassing `opacity-disabled` | `switch.css:141` | `opacity-disabled` | Same pixels |
| 17 | Focus offsets written with the wrong token: Panel's toggle `space-2` for `focus-offset`, Code block's toggle `focus-offset × −1` for an inset ring | `panel.css:239`, `code.css:529` | `focus-offset`; `focus-width × −1` | Same pixels |
| 18 | Meter's comment called its 500 label "Field's label"; Field's label is 400 | `meter.css:24` | comment corrected; the weight question is open | No |

The fingerprint over 917 specimens marked 25 as changed: Badge modern (8) and the avatar badge, which is modern; Chip
swatch and swatch only; Tree view filters (light only); and the Calendar tile and 12 Color picker specimens, whose
computed edge is now a `color-mix()` serialised as `color(srgb 0.83…)` instead of `rgb(212 212 212)`: the same #d4,
read back in the browser. Select's picker and Board's actions are not in the static tiles (open picker, hover).

## Kept, with the reason

| What | Why it stays |
|---|---|
| Card's frame at `border-width` | It carries `shadow-card`, which Elevated keeps (see the dark case below) |
| Alert's and inline Code's `border-decorative` edges at `border-width` | Filled shapes: the fill bounds them (alert.md, code.md third pass) |
| Input group seams `border-decorative` at `stroke-width` | Joined-control seams are required (S8); their light colour is the third-pass decision ("the rule marks where each edits") |
| File upload's meta separator `border-subtle` at `border-width` | A typographic separator between two pieces of metadata (Untitled UI's), not a container rule |
| The swatch palette's state rings (white 70%, black 15%, `#fff`, literal 1 and 2) | Owner-measured iOS geometry, rounds 18–20 |
| Toolbar's floating-bar and Tooltip's own lifts, Board's card shadow | Written exceptions (DESIGN_SYSTEM.md "Elevation"; board.md Notion values) |
| Alert and Toast icons on palette rungs (`red-500`, `orange-550`…) | No semantic role matches (the `fg-*-vivid` rungs differ for warning and success); both families use the same pairs |
| Box model's raw `border-subtle` / `edge-control` mix | A diagram's layers are supplementary lines, not controls |
| The 5 / 6 / 10 literal spacings | Each is a measured spec value, shared by the peers that share the job |

## Owner decisions, 2026-10-12

The owner went with every recommendation ("go with your recommendations"), and asked about Board.

| # | Question | Decision | Change |
|---|---|---|---|
| O1 | Pill dismiss focus ring: Badge's dismiss and Chip's remove drew the ring 2 outside the button (on a 20 badge, outside the badge); Tag's remove and every field action draw it at 0 | 0 for every control nested in a host | `badge.css`, `chip.css` (remove and action) |
| O2 | Card under Elevated in dark had neither halo (dark has none) nor frame (`border-width` 0) | Keep the edge in dark | An inset outline `stroke-width − border-width` wide (0 under every preset but Elevated), `light-dark(transparent, card edge)`: light keeps the halo alone. No theme branching (THEMING.md: a theme selects tokens, not layout) (`surface.css`) |
| O3 | Empty state md title 18/24, off the six-step ramp | `title-xs` 16/24, Dialog's and Drawer's surface title | `empty-state.css`; compact already drew 16/24 |
| O4 | Meter's label 500 where Field's is 400 | Keep 500: the meter's title at body size | Named in DESIGN_SYSTEM.md's weight rule; comment corrected |
| O5 | Literals one role wrote several times | Five roles in `emit/base.ts` `derivedTokens()` (re-emitted at every scope): `bg-mark`, `bg-mark-hover`, `border-card`, `fg-quiet`, `edge-control-strong` | Badge, Chip, Count, Card, Composer, Code block, Button, Button group, Split button, Checkbox / Radio, the studio's card drawings; same paint |

### Board (owner: "the hover state here seems too drastic/dark. is the corner radius for this component correct too?")

- **Hover, measured.** Notion's board (the owner's "tasks" database, read-only, hover only): a hovered card's fill becomes
  its column's own tint, translucent over the column (purple `rgba(90,3,148,.031)` over the group's `rgba(98,3,161,.03)`;
  blue `.047` over `.047`; the default column `.031` over `.03`). In OKLab the hovered purple card is L 0.960, chroma
  0.015; blue L 0.958, chroma 0.016. Area's 8% of the colour in white matched that lightness (purple L 0.959) but carried
  chroma 0.020: Area's Tag inks are more saturated than Notion's. At **6%** every colour is at or under Notion's chroma
  (purple 0.0147, blue 0.0120, red 0.0119), lightness 0.968–0.971, and the gray column lands exactly on the neutral hover
  #f3. The add row follows (6% / 9% pressed, the bg-hover → bg-active step).
- **Corners.** Not correct by Area's own rule: the card (12) sat 8 inside a column with the same 12 corner, so the gap
  widened at each corner (Notion draws 10 inside 10, also not concentric). Now the column is a shell concentric with its
  cards, card corner + 8 × `radius-concentric` = **20** (0 at Sharp), as Composer and Toolbar; the card keeps the
  container corner (12, approved round 9); the actions plate, 8 inside the card, is the card's corner less 8, floored at
  `radius-floor` = **4** (Notion's plate is 4), and its flush buttons take the same corner.

## Verification

`npm run build` (with the token-reference check), `npm run build:docs`, `npm run test:contracts` (14), the React tests
(271, two new: "required lines never ride the Surface axis" and "every floating surface draws the floating frame", both
failing on the stylesheet before this pass), `npm test` (token and contrast suites). The visible changes were compared
before and after at 2× and 3× in light and dark; the Elevated and increased-contrast results were read back as computed
styles. Not verified: Firefox and Safari, forced colours, screen readers.
