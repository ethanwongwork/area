# Inset actions and titlebar controls, 2026-10-16

Review round 27 asked two questions. On Nav's row actions: "what is the sizing logic for inset hover actions in a row
that already has a backplate? ... some other design systems for small controls like this just do a color change for
hover". On Titlebar: "the nav items look bigger than the buttons and inputs ... the gaps, inset padding, margins,
etc should all be intentional".

**Method.**
- Notion and ChatGPT were measured in the owner's Chrome on 2026-10-16, hover only, with `getBoundingClientRect`
  and `getComputedStyle`. These are not `area-capture.js` files: the script wasn't injected into those pages, so
  there are no checksummed JSON captures.
- Cursor 3.23's values were read from its app bundle
  (`/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/`, minified CSS cited by byte offset).
- The design systems' values come from their published source at the pinned versions below.

## Row actions: a control inset in a row that has its own plate

| Source | Row | Action box / glyph | Inset from the plate | Gap | Action corner / row corner | Action hover |
|---|---|---|---|---|---|---|
| Notion sidebar (measured) | 30, plate 5% ink | 20 / 16 | 5 top and bottom, 8 end | 2 | 4 / 6 | a second 5% plate on the row's 5%; ink unchanged |
| ChatGPT sidebar (measured) | 36, plate 5% black | 20 / 14 | 8 top, bottom and end | 8 | full / 8 | **ink only**: #5D5D5D to black 85%, no plate |
| Cursor Agents sidebar (G@1150151, @1146185) | cell padded 6 / 8 | 16 / 12 | 4 + 2 end | 2 | none / 6 | **ink only** (no hover rule; section refresh goes from tertiary to primary ink) |
| VS Code tree rows (D@17798, @1170860) | 22 | 20 / 16 | about 1 | 0 | 5 / none | toolbar plate (about 31%) over the row plate |
| shadcn Sidebar (`sidebar.tsx` L564, shadcn@4.22.0) | 32 | 20 / 16 | 6 top, 4 end | 0 | md / md | the row's own hover token, so no visible change on a hovered row |
| Fluent v9 TreeItemLayout (react-tree 9.16.8 L93) | 32 | 24 / 16 | 4 | 0 | medium | the subtle Button hover, the row's hover token |
| Primer ActionList TrailingAction (@primer/react 38.42.0) | medium | full row height | flush | 0 | squared at the start | transparent-button plate |
| **Area before** | 32 / 26 (app) | 28 / 24, Button sm | 2 / 1 | 2 | row − inset | translucent `bg-hover` plate on the row plate |
| **Area now** | 32 / 26 (app) | row − 8: 24 / 18 | 4 | 2 | row − 4, floor | **ink only**: `fg-muted` to `fg-default` |

**What most agree on:**
- The action is 10–16 shorter than its row and sits 4–8 in from the plate (VS Code's 1 is the dense outlier).
- Glyphs are 12–16.
- The action's corner nests in the row's corner.

On a row that already shows the pointer with its plate, the target products don't stack a second visible plate:
ChatGPT and Cursor change only the ink, and shadcn and Fluent reuse the row's own hover token. Notion and VS Code do
stack one.

Area's rule now: a row action is a nested square 4 in from the plate on every side, the rule Chip's remove and a
field's InputAction already follow (`inset.css`, "nested square action"). Its hover changes only the ink.

## Dismiss and clear controls in other systems (for the wider question)

| Source | Box / glyph | Hover |
|---|---|---|
| Primer Token remove (`_RemoveTokenButton.module.css` L41-44) | 16-32, round / 12-16 | plate |
| Carbon Tag close (`@carbon/styles` 1.117.0 `_tag.scss` L327-340) | tag height, circle | plate |
| Polaris Tag remove (`@shopify/polaris` 13.9.5 `Tag.module.css` L75-89) | 18, concentric (7 in 8) | plate on plate, plus ink |
| Fluent InteractionTagSecondary (L49-52) | full-height segment | plate, plus brand ink |
| Spectrum 2 ClearButton (`@spectrum-css/clearbutton` 7.3.0, spectrum-two.css L17) | component height, round | **ink only** (a plate only on its over-background variant) |
| Material web chip trailing icon (`@material/web` 2.5.0) | 24 / 18 | ink change plus a ripple state layer |

**Area today** (an inventory of 18 inset controls): 7 sizing rules and 5 hover paints, all plates. The paints are:
- `currentColor` 12% (Badge, Chip, Tag)
- opaque `bg-component-hover` (Dialog, Popover, Toast, Alert, Code copy, Board)
- translucent `bg-hover` (Nav, Tree view, soft-field actions)
- `bg-component-active` as the hover (Prompt suggestions)
- none

Press repeats the hover paint on Chip, Tag, tinted Alert and Prompt suggestions, and Badge's dismiss has no press
paint. Both break product UI rule 3.

At type 13 Compact, Badge's dismiss and Tag's remove are a 10 box holding a 12 glyph.

## Titlebar

| Source | Bar | Controls in it | Gap within a group / between groups | Ends |
|---|---|---|---|---|
| Cursor / VS Code (J@16461927; D@17798, @1197090, @1192288) | 35 | **all 22**: icon buttons 16 + 3 × 2, the command centre 22, corner 5-6 | 2 / 8 | 8; the start clears the traffic lights (74-82) |
| ChatGPT top bar (measured) | 52 | **all 36**: icon button, segmented, Upgrade 34 | 8 | 8 |
| Notion top bar (measured) | 44 | buttons **28**; breadcrumb items 24 | 2 | 12 start, 10 end |
| **Area before** | 39 (app) | buttons and search 24, **Nav items 26** | the component said 12; the app gave each icon button −4 margins, so 8 / 4 | 14 |
| **Area now** | 39 (app) | **all 24** (control-sm, Nav items included), 7 above and below | Nav's own 4 between items; the cluster space (8, compact 6) between everything else | 14; macOS 83 / 13 |
