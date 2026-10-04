# Corner radius audit (2026-10-03)

Owner request: "do a corner radius roundness audit … the segmented control even in compact is
super sharp … a more holistic approach so that the default corner radius roundness is balanced
and not overly sharp or round … first focus on default corner radius for both default density
and compact density." A later phase adds a roundness modifier (± about 2px from the theme,
clamped per component); see the last section.

Scope: the Standard preset at both UI scales. Radius is not a theme token: light and dark paint
the same corners (the radius axis owns `--area-radius-*`; the theme axis never writes them).

## Method

- **Reference:** every node with a non-zero corner in the 604 non-Area captures under
  `docs/research/captures/` (1,766 nodes, de-duplicated by source, variant, height, width and
  radius), grouped as roomy (ChatGPT, OpenAI, Notion), dense (Figma, Cursor app / IDE / web,
  VS Code) and design systems (Primer, shadcn, Untitled, Fluent). Circles and pills (radius ≥
  half the shorter side) are counted apart.
- **Area:** every rounded element in all 706 component gallery specimens, measured live at
  default and compact UI scale (computed `border-radius`, layout height and width, nearest
  rounded ancestor and inset): 2,464 elements, 207 component × part rows.

## Reference: radius by painted height (rounded rectangles, median by source)

| Height | Roomy (ChatGPT / Notion) | Dense (Figma / Cursor / VS Code) | Area before (default · compact) |
|---|---|---|---|
| 17–21 | 4 (Notion 4, ChatGPT 8 on a pill-ish tooltip) | 4–5 (Figma 5, Cursor 4, VS Code 4) | 4 (20 compact) |
| 22–25 | 4 (Notion 4, ChatGPT 4) | **5** (Figma 5 ×114, Cursor 5–6, VS Code 4) | **4 · 4** |
| 26–29 | 6 (Notion 6 ×44) | 5–6 (Figma 5, Cursor 6–8, VS Code 4) | 6 · 6 |
| 30–33 | 6–8 (Notion 6, ChatGPT 8) | 5–8 (Figma 5, Cursor 6–8) | 8 · 8 |
| 34–37 | 8–12 (ChatGPT 8, Notion menu 12) | 5–8 | — |
| 38–44 | 8 | 5 | 10 (40) · 10 (40) |
| 45–60 | 10–12 | 6–13 | 12 (48) |
| > 120 (surfaces) | Notion 10, ChatGPT 16 | **Figma 13, Cursor 12–14**, VS Code 8 | **12 · 8** |

Nested shapes in the references:

- Figma's view toggle: track 24 r5, segments 24 r5 (no inset). Figma's toolbar mode switch:
  track 32 r5, 2 inset, segments 28 r3: concentric, never below 3.
- Menus are concentric from the row outwards: Notion rows 28 r6 in a r10 menu (inset 4),
  Figma rows 24 r5 in r13 (inset 8), ChatGPT rows 36 r12 in r16, Cursor plates r8 in r14.
- Figma steppers split a 24 field at r2 on the inner edge only; Notion and Figma checkboxes 2–3.

## Area findings

Ranked by how visible they are.

1. **Nested shapes collapse to 2px** (the owner's screenshot). Nested corners were
   `max(0, outer − inset)`, so a small outer corner leaves almost nothing: compact Segmented sm
   items 20 r2 in a 24 r4 track; Input action buttons 20 r2 (default Combobox too), NumberField
   steppers 20 r2, AlignmentPicker cells 20–22 r2 (compact). The owner rejected 2px on Kbd
   ("2 is way too sharp", 2026-09-28); no reference draws an interactive shape below 3.
2. **The control curve has a flat spot at 24px.** 20 → 4 and 24 → 4, then 28 → 6, 32 → 8,
   40 → 10, 48 → 12 (ratio 0.17 at 24 against 0.21–0.25 elsewhere). Dense products paint 24px
   controls at 5 (Figma 114 nodes) to 6 (Cursor). This is what makes compact sm (and default xs)
   read sharper than every other tier.
3. **Compact surfaces are sharper than the dense products.** Area compact containers are 8
   (Menu, Panel, Calendar, Color picker, Command palette, Table, Code block, Toast, Alert)
   while Figma is 13 and Cursor 12–14; only VS Code is 8. Within Area, compact Popover (12) and
   Dialog (16) were already raised on that evidence (2026-10-02), so compact surfaces now
   disagree with each other.
4. **Single-line bars disagree with each other.** At default: in-place Alert 40 r12 (0.30),
   Toast 40 r12, Alert banner 44 r6 (0.14), Composer 48 r16, Message bubble 44 r16. Each has a
   documented reason (container role, OpenAI / Primer banner 6, concentric with an 8px control),
   but side by side they read as three different corner families.
5. **Tooltip changes character across densities.** Default 28 r10 (0.36, the owner's "rounder,
   not quite pill", 2026-09-25); compact 24 r4 (0.17, VS Code 3 / Figma 5). The default is
   rounder than a control, the compact sharper.
6. **Kbd breaks its own rule at compact.** Kbd's rule is "6px at every size and in every host"
   (owner, 2026-09-28), but it reads a density-scaled token, so compact Kbd is 4.
7. **Card is the roundest surface.** Card 24 at default (18 compact), concentric with its 16
   media at a 8 inset, against 12 for every other surface and 16 for Dialog. References: ChatGPT
   cards 16, Figma 12–15, Notion 8–16, Cursor 12.
8. **Fractional corners from ratio formulas.** Color swatches 20% of size (3.2, 4.8), swatch
   picker cells 7.2 / 8.8, the split button's trigger 6.4 / 5.6. They render, but they are
   off the curve and blur at 1x.
9. **Small text plates sit above the curve.** Kbd 20 r6 and Breadcrumb links 20 r6 at default
   (0.30), where a 20px control is 4.

Consistent and in line with the references: controls 28 r6, 32 r8, 40 r10 at both densities;
default surfaces 12; Dialog 16; checkbox 4; Menu, Combobox and Command palette rows concentric
with their surface.

## Applied (2026-10-03)

- **One curve by painted height, both densities:** 20 → 4, **24 → 5**, 28 → 6, 32 → 8,
  40 → 10, 48 → 12. Standard `control.xs` 4 → 5, `dense.control.sm` 4 → 5
  (`packages/tokens/src/axes/radius.ts`). Moves default xs controls and compact sm controls,
  including the compact Segmented track (24 r5).
- **Nested shapes are concentric with a floor:** `max(min(radius-control-xs, inner height ×
  radius-cap), outer − inset)`. Concentric where that leaves a readable corner, never sharper
  than the smallest control (5 default, 4 compact); the cap keeps Pill finite and Sharp square.
  Segmented items (`segmented.css`), Input action buttons (`input.css`), NumberField steppers
  (`number-field.css`), AlignmentPicker cells (`alignment-picker.css`).

Measured after (gallery, both densities):

| Part | Default before → after | Compact before → after |
|---|---|---|
| Segmented track sm | 28 r6 | 24 r4 → **24 r5** |
| Segmented items | 24 r4 → **r5**, 28 r6, 36 r8 | 20 r2 → **r4**, 24 r4, 28 r6 |
| Input action button | 20 r2 → **r5**, 24 r4 → **r5**, 32 r6 | 20 r2 → **r4**, 24 r4 |
| NumberField stepper | 24 r4 → **r5** | 20 r2 → **r4** |
| AlignmentPicker cell | r4 → **r5** | r2 → **r4** |
| Every 24px control (Button, fields, Select, BoxField, Segmented track) | 24 r4 → **r5** (xs; none in the gallery at default) | sm 24 r4 → **r5** |

Everything else that reads the 24px corner moved with it (diffed across all 706 specimens with
the old values restored on the canvas): Command palette hints and their buttons 24 r4 → r5,
Property list handle 28 r4 → r5, the 23px and 20px swatches 4 → 5 at default; at compact the
Tooltip 24 r4 → r5, the Alert banner 32 r4 → r5, Color picker's area, grid, preview and swatch
grid 4 → 5, and the concentric shells around a small control one pixel rounder (Card 40 r12 →
r13, Toolbar 36 r10 → r11). Kbd reads `radius-small` and did not move.

## Decisions for the owner

Applied 2026-10-03 (owner: "go with your recommendations for D1–D7"); outcome below the table.

| # | Question | Recommendation (data) |
|---|---|---|
| D1 | Compact surfaces 8 or 12? | **12**, the default value at both densities: Figma 13, Cursor 12–14, and Area's own compact Popover 12 / Dialog 16. Menus then need their rows re-derived (12 − 4 = 8 on a 24 row) or a larger menu inset (Figma 8). |
| D2 | One family for single-line bars? | Bars take the control curve for their height: Alert, banner and Toast at 40–44 → **10** (compact 32 → 8); multiline stays on the surface 12. Resolves Alert 12 vs banner 6. |
| D3 | Tooltip at compact | Keep the default's "rounder than a control" at compact: 24 → **8** (default 28 → 10), or follow the curve at both (6 / 5, Figma 5, Notion 6). Compact is 5 after the curve change. |
| D4 | Kbd at compact | Restore the owner's rule: **6** at every size (compact is 4 today). |
| D5 | Card's corner | Card 24 / 18 is concentric with 16 media; a **16** card (media 8) matches ChatGPT and Dialog. |
| D6 | Fractional corners | Round swatch, swatch-picker and split-button corners to the curve (integers). |
| D7 | Small text plates | Kbd and Breadcrumb links at 20 → 4 (curve), unless D4 keeps Kbd at 6. |

Measured after, default · compact (gallery, all 706 specimens):

| Part | Before | After |
|---|---|---|
| Surfaces (Menu, Panel, Calendar, Color picker, Command palette, Table, Code block, choice cards) | 12 · 8 | **12 · 12** |
| Rows in a floating surface (Menu, Combobox, Command palette) | 32 r8 · 24 r4 | 32 r8 · **24 r8** (concentric, 12 − 4) |
| Popover · Dialog | 12 · 12, 16 · 16 | unchanged |
| One-line Alert, banner, Toast | 12 / 6 / 12 · 8 / 4 / 8 | **10 · 8** |
| Multiline Alert, titled Toast | 12 · 8 | 12 · **12** |
| Tooltip | 28 r10 · 24 r4 | 28 r10 · **24 r8** |
| Kbd | 6 · 4 | 6 · **6** |
| Card md / sm / lg · media | 24 / 22 / 28 · 16 | **16 / 14 / 20 · 8** (compact 12 / 10 / 14 · 6) |
| Card in a well | 44 r14 | **44 r5** (compact 40 r4) |
| Breadcrumb hover plate | 24 r6 · 20 r4 | **24 r5** · 20 r4 |
| Swatches 12 / 16 / 20 / 24 | 2.4 / 3.2 / 4 / 4.8 | **2 / 3 / 4 / 5** |
| Swatch picker cells 20 / 24 / 28 / 32 | 6.4 / 7.2 / 8 / 8.8 | **6 / 7 / 8 / 9** |
| Split button icon trigger | 6.4 · 5.6 | **6 · 5** |

Corrections found while applying: D7's premise was wrong. The Breadcrumb plate is 24 tall (it
paints 2px outside the 20px link), and Notion measures it at 6, so the curve gives 5, not 4.
D2 trades concentricity for one family: the in-place Alert's 28px controls sit 6 in, which was
concentric with 12; at 10 they are 2px off concentric.

## Roundness (built 2026-10-03)

Owner: "start on the roundness control, show me how the + or - 2 system works with an example of
each component and how inset corner radius works", then: "if the default is 8px, i want to show
that component at 0px, 2px, 4px, 6px, 8px, 10px, 12px, etc and whatever values work until it goes
to pill … i dont think it makes sense to add odd numbers."

Built as its own axis, `roundness` (`packages/tokens/src/axes/roundness.ts`): an offset in 2px
steps, −12 to +12 (`data-area-roundness`, one leaf, `--area-radius-offset`), so it combines with
any radius family and re-derives in any scope. ±1 steps were dropped (a 1px step barely reads).
At −12 the default surface (12) and every control are square; at +12 the largest control (48,
corner 12) is a pill. The gallery's theme panel has a Roundness slider; `roundness.html` lays out
every family from square to pill.

    corner = clamp(0, min(family(height), height × radius-cap) + offset, height / 2)

- `emit/base.ts` adds the offset where the public corners are derived (control tiers, container,
  small, row), floored at 0. It scales by `radius-concentric`, so Sharp stays square.
  `radius-shift` publishes it for the corners drawn from a component's own size: checkbox and
  Tree view boxes (a quarter of the box + shift), swatches and swatch-picker cells (20% + shift),
  Skeleton (4 + shift), Kbd (6 + shift).
- The cap (`radius-cap` × height, 0.4) still shapes the family, so a 12px family on a 20px box
  reads 8, and moves with the offset (all 44 cap expressions add `radius-shift`); the browser's
  own half-height clamp is the pill. So every shape can reach square and pill.
- Inset shapes stay concentric with the audit's floor, `max(min(radius-control-xs, h × cap),
  outer − inset)`; the floor moves with the offset.
- Shells derived from what they hold move with it, but never sharper than their own inset:
  Card, Composer, Prompt suggestions and Message bubbles stop at 8 going sharper. Pills and
  circles (`radius-full`: Badge, Avatar, Switch, Chip) never move.
- Dialog's cap is the surface corner plus 4 (was twice the surface corner, which stepped 16, 8,
  4); Command palette's corner is the surface corner (was rebuilt from its rows, which stepped
  6, 5, 4). Both now step by 2.
- Surfaces hold at compact in every family, not only Standard (D1 generalised), and Popover's
  compact cap reads the container role instead of the base leaf, so it follows the offset.

Measured on `roundness.html` (each family's default specimen at every step, trimmed to square
… first pill): Button, fields, Select, Segmented, Toolbar and Nav go square, 2 … 8 … 14, pill
(compact 6 … 12, pill); surfaces square … 12 … 24; Dialog 4 … 16 … 28; Card and Composer 8 … 16
… 28; Kbd square … 6, 8, pill; Checkbox and Skeleton square … 4, 6, pill.

All even (owner, 2026-10-03, "yes go all even"): the 24px corner is 6 at both densities (was 5;
Cursor 6, Figma 5; a quarter of the height, as 32, 40 and 48 are), so 24 and 28 share 6; nested
shapes floor at `radius-floor`, 4 moved by roundness (was the smallest control's corner, which
would now be 6, as round as a 28px track); rows in a floating surface are its corner less the
padding, 12 − 4 = 8, the 1px border left out (counting it gave 7); swatches, swatch-picker cells,
the 20px checkbox, the split button's trigger and the whole-pixel caps round to 2px. Swept at
−4, 0 and +4 at both densities: every corner in the gallery is even except the bleed Card's media
(15), which is the inside of the card's 1px border under its even 16.

Corrections made while building it:

- Rows in a floating surface briefly counted the 1px border (12 → 7); reverted for even corners.

Open: step size for large shapes (below); whether the hand-written families (Subtle … Rotund)
become offsets of Standard.

### Step size for large shapes (decided 2026-10-03, not yet built)

Owner: "maybe the granularity of the larger components doesnt have to be +-2, how should those
be handled?" A 2px step is 25% of an 8px Button but 17% of a 12 surface and 12% of a 16 Dialog,
so large shapes read as changing less. The references agree: across products, surface corners
spread about three times as widely as control corners (Notion 10, Figma 13, ChatGPT 16 against
6–8 for controls).

- A. 2px everywhere (current): uniform and simple; surfaces take 6 steps to reach 24.
- B. Two step sizes by role (recommended): 2px for controls, rows, bars and small shapes, and
  for shells concentric with a control (Composer, Segmented track, Toolbar); 4px for surfaces
  (the container role: Menu, Popover, Panel, Calendar, Table, Code block, Color picker, Command
  palette) and what sits concentric inside them (menu rows, card media). One step then changes
  every shape by about a quarter. Card and Dialog would derive from the surface (16 = surface +
  4) instead of from a control, so they step by 4 too; Dialog's close stops being concentric
  away from the default.
- C. Proportional: each shape steps by a quarter of its default, rounded to even (4–10 → 2,
  12–16 → 4, 20+ → 6). The most uniform visually; more step sizes to explain.

Owner: "yes go with two step sizes, card and dialog follow surface" (B). Built in a follow-up
session. Plan: a second derived offset for the surface role (`radius-shift` × 2) used by the
container token and everything concentric inside it (menu, combobox, palette and select rows,
popover media, card media); Card and Dialog derive from the surface corner (16 = surface + 4)
instead of the control; the roundness page shows surfaces in 4px steps.

