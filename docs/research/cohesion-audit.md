# Cohesion audit, 2026-09-26

**Request (owner):** audit every component accepted under the earlier process against the
evidence-based process ([Building a component](../COMPONENT_ADAPTATION.md)), improve them,
and re-evaluate the consistency of the whole library.

**Scope.** 27 families were marked Complete without a spec: Alert, Avatar, Button, Card,
Checkbox, Chip, Code, Code block, Field, Input, Kbd, Menu, Nav, Panel, Popover, Progress,
Radio, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs and
Textarea. Ten families in review also had no spec: Dialog, Toast, Toolbar, ButtonGroup,
InputGroup, NumberField, AlignmentPicker, ColorField, ColorSwatch and ColorSwatchPicker.
Badge, Badge group, Breadcrumb, Indicator and Tooltip already had specs. Each of the 37 now
has a spec in [`docs/specs/`](../specs/README.md).

## Method

1. **Area, measured.** Every gallery tile of the audited families was captured with
   `area-capture.js` before the changes and again after them (363 tiles, the family's own
   block as the shell); the after set is committed under `captures/<slug>/area--*.json`.
2. **Target products.** ChatGPT was captured read-only in the owner's session: sidebar rows
   (rest, hover, current), the profile menu and a hovered item, the Chat / Work segmented
   control, header icon buttons, the model picker, the settings card, its select trigger,
   switch and search field, and an avatar (23 files in `captures/baseline/chatgpt--*`).
   Notion's date-filter popover and Figma's colour picker and inspector controls were
   already in the repo from the Calendar and ColorPicker passes. Notion and Figma were not
   re-captured for these families: the Chrome window went into the background mid-session,
   and a hidden tab neither renders route changes nor allows screenshots or clipboard
   writes. Those captures are the first item under [Open](#open).
3. **Design system, source.** Untitled UI's React source at a pinned commit, read for every
   family it has: [Untitled UI reference](untitled-ui-reference.md).
4. **Area against itself.** Every component stylesheet was read for the roles components
   share (row plates, selection, disabled, focus, elevation, radius, type weight, markers,
   tracks and rails), and every `var(--area-*)` reference was checked against the tokens
   that exist.

## Shared rules this audit settled

These are now in [the design system guide](../DESIGN_SYSTEM.md) and the
`area-visual-language` skill, so the next component inherits them rather than choosing again.

| Role | Rule | Evidence | Was |
|---|---|---|---|
| **Row and item plates** | Hover is `bg-component-hover`; pressed, selected and current are `bg-component-active`. Rows and transparent controls use the opaque pair; the translucent `bg-hover` is for grounds the component cannot know (a segmented track, a swatch cell). | ChatGPT rows, menu items and the model picker hover at 5% black (`chatgpt--sidebar-row--hover`, `--sidebar-recent--hover`, `--menu-item--hover`, `--model-picker--hover`; the icon-button capture's `::before` plate had not faded in), Figma at 5% black, Notion at 8% warm grey: about #f2, which is `bg-component-hover` (#f3). | Four different hover fills (`bg-component`, `bg-component-hover`, `bg-hover`, a 12% ink mix) and three selection fills; Table and Select painted selection and hover identically; Nav hovered lighter than Menu. |
| **Selection is distinguishable from hover** | Current and selected plates stay one step above hover in both themes, including under the pointer: each row family's hover rule excludes the selected or current row. | ChatGPT and Untitled UI use one fill for both (5% / neutral-50); Area keeps them apart, as its Menu already did, so a hovered row never reads as the current one. | Table and Select could not be told apart; in dark mode the translucent hover outshone the selected fill (below); in Menu, Table, Tree view and Nav rows with actions a higher-specificity hover rule lightened the selected row under the pointer (found while writing the Menu spec). |
| **Disabled** | Controls, rows and pickers dim to 50% as a whole. Text fields (Input, Textarea, Select, NumberField, InputGroup) keep full opacity and use their disabled field paint. | Untitled UI dims everything to 50%; Area's fields already used field paint, which keeps disabled values readable. | Select applied field paint and 50% opacity; Switch repainted its track grey (hiding on/off); Nav greyed its text; NumberField steppers used 40%. |
| **Foreground stays fixed on hover** | Only the plate, edge or underline changes under the pointer. | Area's existing rule (Button, Tabs). Untitled UI darkens labels on hover; Area does not follow it. | Dialog close, Chip remove, the destructive Menu item, Code block tabs and line numbers, and Alert's dismiss (by opacity) all changed ink on hover. |
| **Neutral by default, accent by override** | Markers and rings of selection or current state are neutral ink; accent only when the consumer asks. | Owner, 2026-09-26. | Nav's selection marker, Avatar's active ring, Tree view's current rail (which used the focus colour), Code block's linked-line rail and the file input's button label were accent. |
| **Floating lift** | Menu, Popover, the Select picker, Dialog, Toast, the Calendar and ColorPicker surfaces and Toolbar overflow share one shadow: Notion's popover geometry, `0 20px 24px` and `0 5px 8px`, in `shadow-color` at full and half strength, over the 1px decorative border. | Notion popover `0 20 24 .05, 0 5 8 .027` + 7% ring (`calendar/notion--search-date-filter-popover`); ChatGPT menu `0 8 16 −4 .12` + 0.5px 10% ring (`baseline/chatgpt--menu--rest`); Figma picker `0 2 5 .15, 0 10 16 .12`; Untitled UI `shadow-lg`/`xl`. | `shadow-2` (0 1px 2px) or `shadow-3` (0 2px 4px): flatter than Area's own Tooltip, which already used Notion's geometry. |
| **One weight per label** | A label's weight does not change with state. | ChatGPT's segmented options are 500 selected and unselected (`chatgpt--segmented--rest`). | Segmented went 400 → 500 on selection, reflowing the track. |
| **One glyph ladder for choices** | Checkbox and Radio are 16px at sm and md, 20px at lg. | Untitled UI's 16 / 20 boxes. | Checkbox read the icon ramp (16 at every tier); Radio was 12 / 16 / 20. |
| **One rail** | Progress runs on Slider's rail colour. | Untitled UI uses neutral-200 for both. | Progress used the lighter component-active grey. |
| **Framework-free defaults match React** | A block's base rule renders the manifest's default tier. | Manifest parity. | A bare `.area-chip` was 28px while React defaulted to 32px. |
| **Radius follows the axis** | Every radius is a radius role or derived from one. | [Radius](../DESIGN_SYSTEM.md#size-and-shape). | Card's 24px was a spacing token, so it ignored the Sharp preset. Now `radius-container × 2`. |
| **Motion setting** | `data-area-motion="none"` stops the same loops as `prefers-reduced-motion`. | — | Skeleton, Spinner and indeterminate Progress kept animating; only Switch honoured the axis. |
| **Guarded by tests** | `packages/react/tests/cohesion.test.mjs` reads the built stylesheet and fails when a hover rule changes ink or opacity, a row leaves the shared plates, a floating surface loses the lift, a text field dims with opacity, or a Nav, Tree view, Avatar or Code block marker paints in accent or the focus colour outside an accent variant. | — | Nothing checked these across families; the test found one more case on its first run (Tree view's checked box). |
| **Token references resolve** | A `var(--area-*)` either names a defined token or carries a fallback (public hooks). Enforced by `packages/styles/scripts/check-token-refs.mjs` in the styles build. | — | Alert's dismiss focus ring named `--area-focus`, which does not exist, so it drew in the text colour. |

## Findings by family

"Changed" families are In review; the rest stay Complete
and now have a spec.

| Family | Result | What changed or was confirmed |
|---|---|---|
| Alert | changed | Dismiss: full ink (was 72%, 100% on hover), small-button radius, focus ring fixed |
| Avatar | changed | Active ring neutral-solid; accent avatars keep an accent ring |
| Button | changed | Neutral ghost hover `bg-component-hover`, pressed `-active` (was `bg-component` / `-hover`) |
| Card | changed | Radius derived from the container role (24px at Standard, 0 at Sharp) |
| Checkbox, Radio | changed | 16 / 16 / 20 glyphs (also carry the earlier neutral tone change) |
| Chip | changed | Base tier md; remove keeps its ink with a 12% plate; avatar initials 12px (were 10, off the ramp) |
| Code | confirmed | Inline reference box matches Untitled UI's inline code (radius 6, 2 × 6 padding) |
| Code block | changed | Tabs, line numbers and the show / hide toggle keep their ink on hover (plate or underline instead); linked line rail neutral |
| Field | confirmed | 6px label-to-control gap, as Untitled UI |
| Input | changed | InputAction's hint renders the Tooltip surface (was a second, smaller tooltip style); file button label neutral |
| Kbd | confirmed | Open: the small size uses 11px text, off the type ramp (below) |
| Menu | changed | Hover plate, danger label fixed at `fg-danger`, floating lift |
| Nav | changed | Hover / current plates, neutral marker, disabled rows at 50% |
| Panel | confirmed | Docked inspector, keeps `shadow-2` as a region rather than an overlay |
| Popover | changed | Floating lift |
| Progress | changed | Slider's rail |
| Segmented | changed | One 500 weight for every option |
| Select | changed | Disabled without double dimming; picker lift; checked option uses the selection fill |
| Separator | confirmed | `border-decorative`, 1px, as Untitled UI's divider |
| Skeleton, Spinner | changed | Stop under the motion axis |
| Slider | confirmed | Rail shared with Progress |
| Switch | changed | Disabled at 50% keeps the on fill visible |
| Table | changed | Row plates; selection outranks hover |
| Tabs | confirmed | Neutral underline, fixed ink |
| Textarea | confirmed | Field paint for disabled |
| Dialog, Toast, Toolbar | changed (already in review) | Floating lift; Dialog close keeps its ink |
| Tree view | changed (already in review) | Row plates; current rail neutral ink (was the focus colour); checked rows in checkbox mode paint like Checkbox (were a tint with a focus-colour edge) |
| Calendar, ColorPicker | changed (already in review) | Floating lift, with Popover |
| NumberField | changed (already in review) | Disabled steppers 50% |
| ButtonGroup, InputGroup, AlignmentPicker, ColorField, ColorSwatch, ColorSwatchPicker | confirmed | Spec written; no change |

Two documentation defects were fixed on the way: the Slider, Spinner and Nav API tables
had Calendar's rows pasted into them.

### Found while writing the specs

The five spec passes read every family's CSS, React and captures closely and reported
defects the first pass had missed. Fixed:

| Family | Defect | Fix |
|---|---|---|
| Menu, Table, Tree view, Nav | A higher-specificity hover rule lightened the selected or current row under the pointer | Hover rules exclude the selected row; tested |
| Menu | No keyboard focus ring on items (the reset removes the outline) | Shared ring, inset as on Select options |
| ButtonGroup | A pressed toggle lost its selected fill to the group's rest fill (same specificity, loaded later) | The group fill applies to unselected items only |
| Button | A loading spinner on a neutral solid button was the fill's own colour | Spinners in buttons take the label's ink and a 25% track |
| Button, Kbd | A small Kbd reserved a 20px end box (Menu and Nav reserve 16); `appearance="on-color"` was ignored in tonal solid buttons | 16px box; the solid-button rule skips `on-color` |
| Button | No forced-colours paint for a selected (pressed) button | Joins Segmented and Chip on Highlight |
| Chip | The remove control sat on a −2px margin nudge with no reserved end box | The chip reserves the control's 16px box; nudge removed |
| Code block | Code lines used the browser's default monospace, not Geist Mono (`<code>` resets the family) | `font-family: inherit` |
| Code block | The toggle label was 500 on a transparent control; the tab hover used the translucent tint on a known ground; the linked-line rail did not flip in right-to-left text | 400; component hover fill; logical rail |
| Code | `<Code subtle>` set Token's ground variable, so it painted the default ground | The subtle ground sets both |
| Alert | A multiline alert without actions kept an empty row gap (12px above the text, 17px below) | The actions row is dropped when absent; dead gap and type declarations removed |
| Toast | A dead 10px gap overridden by inset.css | Removed |
| Dialog | The close glyph was hand-drawn (9px ink, 1.5 stroke), unlike Alert, Toast and Popover | The shared Fluent dismiss glyph |
| Nav | Horizontal text-only plates were lopsided (8px start, 11px end) | Horizontal items centre their text |
| Input, NumberField | Disabled fields left affixes and units in muted ink | Disabled ink |
| Select | The manifest omitted the success and warning states the CSS and React support | Added |
| Slider | Two rules mixed `::-webkit-` and `::-moz-` pseudo-elements in one selector list, which makes the whole rule invalid in each engine: the right-to-left fill mirror and the hidden overlapped range thumb never applied | One engine per rule |
| Progress | The indeterminate segment ran left-to-right in right-to-left text | Mirrored keyframes |
| Indicator | The processing pulse ignored the motion axis | Stops under `motion="none"`; reopened for review |
| Table | The hover transition was on the row while the plate paints the cells | Transition on the cells |
| Docs | Stale notes (Checkbox and Radio glyph sizes, Switch track sizes, Segmented arrow keys) and missing or wrong API rows (Switch tone and track, Separator spacing and inset, Skeleton shapes, Progress size and tone, Menu's nonexistent props, Nav selection, ColorSwatchPicker's palette layout) | Corrected |
| Review rows | Checkbox and Radio forward `style` to the input, so the first "before" rows sat 2px off | Rebuilt with framework-free markup |

## Second pass: Notion, Figma and the open decisions

The owner brought Chrome forward and asked for every open item to be decided with the most
calculated option consistent with the system (2026-09-26).

**Evidence.** 39 Notion captures (sidebar rows, the page menu with its toggles, the Share
popover with its tabs, field, primary and outline buttons and permission select, a board of
cards and tags, a table view with checkboxes, status and select tags, a shortcut hint) and
38 Figma captures (file-browser rows, tabs, search, selects and file cards; the editor's
page and layer rows, panel tabs, section titles, colour row, number field, size select,
alignment group, checkbox, primary and secondary buttons, zoom select, usage bar, bottom
toolbar and main menu), all light, read-only, redacted, in `captures/<family>/notion--*` and
`figma--*`. What they settled:

| Question | Notion | Figma | ChatGPT | Decision |
|---|---|---|---|---|
| Hover and current fills | current row `rgba(33,27,23,.05)`; button and menu hover the same | page row hover and current `#f5`; icon hover 5% black | hover = current 5% black | Row plates stay: hover `bg-component-hover`, selection one step firmer |
| Unselected options | — | panel tabs 50% black, selected default + `#f5` (weight 450 → 550 with the bold width reserved) | segmented 93 grey | Segmented and Tabs: unselected `fg-muted`, one weight |
| Divider ink | `rgba(28,19,1,.11)` (outline button, popover rules) | `#e6` (select, file card) | 10% black | New `border-divider` role (#e2e2e2) for rules; container seams stay decorative |
| Checkbox edge | 16px, radius 3, `rgba(27,21,0,.19)` | 16px checked | — | Choice glyphs take the control hover edge at rest (#d4d4d4, with Untitled) |
| Switch | 30 × 18, 14px thumb, 2px inset, off `rgba(135,131,120,.3)` | — | 32 × 20, 16px thumb | 12px of travel at every size: 28 / 32 / 36 wide |
| Keycap | 26 × 18, radius 4, 7% warm fill, no border, 11px 500 muted | plain shortcut text | — | Filled keycap, no edge, radius 4, muted 500; concentric inside Buttons |
| Card | radius 10, soft `0 4 12` + ring | file card radius 13, 1px `#e6`, no shadow | radius 16 settings card | Card uses the container radius (12) |
| Menu surface | 256 wide, radius 10, popover lift, 28px rows radius 6 | dark, radius 13, 24px rows, blue hover | 324 wide, radius 16 | Menu minimum 256 (Notion); lift unchanged |
| Primary button | 32px, radius 6, 14/16.8 500, 12px sides | 32px, radius 5, 11/16 450, 12px sides | — | Unchanged (Area 32px, radius 8, 500) |
| Inspector fields | field focus is a 2px blue ring | soft number fields `#f5` with a letter prefix; outline selects `#e6`; 40px section titles | — | NumberField gains `prefix`; soft fields are flat; Panel headings outrank labels |

**Decisions on the open items.**

1. *Dark translucent tokens.* Fixed in the palette build: neutral alphas are solved against
   the neutral's own dark page rung, so `bg-hover` is 14% white (was 20%) and composites to
   the opaque hover step; `bg-overlay` is a 65% black scrim in both themes (it was nearly
   transparent in dark). Token and contrast suites unchanged.
2. *Segmented unselected ink.* Muted, as ChatGPT and Figma do; fixed on hover.
3. *Kbd at 11px.* Kept for the small keycap: Notion's and Figma's shortcut text is 11px, and
   keycaps are the tiny-chrome role the type policy names.
4. *Menu icon inset.* The 2px nudge is gone; rows use the inset contract like Nav.
5. *Alert description.* The muted role in every tone; the title carries the tone.
6. *Toast default.* A `neutral` tone (muted icon) is the default.
7. *Separator ink.* The new `border-divider` role (above).
8. *Slider thumb.* Follows the choice glyph ladder: 16 / 16 / 20.
9. *Read-only Switch.* Full paint with a default cursor; only disabled dims.
10. *Select chevron.* Kept as a theme-neutral mid grey (#888, 3.5:1 on white, 5:1 on the dark
    surface) in the data URI a native select requires; documented as intentional.
11. *InputGroup.* Disabled field paint, success and warning edges; soft fields are flat
    everywhere, so its soft variant already matched.
12. *ColorSwatchPicker radii.* The cell is concentric with its swatch (swatch radius + inset).
13. *Card at the Pill preset.* Moot: Card now uses the container radius.
14. *Semantics.* Dialog titles are `h2`; Kbd announces its chord through visually hidden text;
    table selection paints from `data-selected` (the demo no longer puts `aria-selected` on a
    plain table). Dialog keeps `role="dialog"` for the standalone surface; inside a native
    `<dialog>` pass another role, as the modal demo does.
15. *Unsourced literals.* Menu minimum 256 (Notion), Nav 240 (Figma's sidebar), both marked
    `/* spec */`; Toast 360 stays a public hook default.
16. *Segmented hover.* No ink change (item 2).
17. *InputAction.* The hint describes the button only when a separate label names it, so it
    is never announced twice; the test now pins that.
18. *Control height.* Unchanged: 32px md sits between Figma (24–32) and ChatGPT (36), and
    density belongs to the UI-scale axis.

**Gallery.** Pass reviews were removed at the owner's request. Every family now shows its
tiles in named groups (Default, Variants, Tones, Variant × tone, Sizes, Layout, Content,
States, Behavior), each labelled by its value, and the missing variants were added (Slider,
Tabs, NumberField, ColorField, ColorSwatchPicker, AlignmentPicker, InputGroup, ButtonGroup,
Toolbar and Table sizes; Nav accent and disabled; Alert info and warning; Toast neutral;
Popover arrow; Panel flush; Radio validation, description and horizontal; Separator
spacing; NumberField prefix).

**Panel.** Section headings are the UI text in the default ink over muted field labels (they
were 12px, smaller than the labels they headed); every label in a panel is muted; its
numeric rows use NumberField with Figma's letter prefixes; dividers use the divider role.

## Third pass: the questions the evidence left open

The second-pass spec updates set Notion and Figma captures beside every family and recorded
where they disagree with Area. Each question is settled here, so no spec carries an open
question from this pass. A value changes where the products agree with each other, or where
Area contradicts its own rules. It stays where a shared rule, a contrast floor or an owner
decision explains the difference.

**Changed**

| Family | Was | Now | Basis |
|---|---|---|---|
| Card | edge `border-decorative` #f3 | `border-divider` #e2 | Figma #e6, ChatGPT 10% black, Notion an 8% ring: all firmer; a card has the page's fill and a 0.5px lift |
| Button group | seam inset 8px top and bottom | full height | Notion split button, Figma align group |
| Select | outline only | `variant: outline \| soft` | The one field without soft, so a Panel mixed two field styles |
| Panel | Selects outline beside soft fields; the docs example at 320px with small controls | every row soft; the example at 280px with medium rows | Owner decision (280, medium rows) and one field style per surface |
| InputGroup | success and warning edges gave way to focus | the tone holds through focus | Input and Select already hold it |
| Menu | search surface minimum 224 | 256, Menu's own | The two surfaces are one menu |
| Menu | shortcut text in monospace | Kbd's keyboard face | Notion and Figma set shortcuts in the UI sans |
| Toast | a bare `.area-toast` painted its icon in the default ink | muted, as neutral does | Neutral is the documented default tone |
| Switch | forced colours greyed read-only | only disabled greys | Read-only keeps full paint everywhere else |
| Code block | hidden line numbers left the code at the block's edge | code starts 12px in, under the filename | The header and the numbers start there |
| Nav | docs demos framed at 260px | Nav's own 240 | The component default changed in the second pass |
| Table | wrapper edge `border-decorative` #f3, lighter than its row rules | `border-divider` #e2 | Stands alone on the page, like Card |
| Nav | a trailing Badge reserved a 24px box (end inset 4 against 6 top and bottom) | the pill's own height (end inset 6) | The inset contract; Menu's Kbd rule already does this |
| `border-divider` | comment cited Notion rules at 11% | Notion rules are 7%; #e2 is the nearest rung to #e5 (#ee is twice as far) | `menu/notion--page-menu--open` |

**Kept, with the reason**

| Family | Product evidence | Area | Reason |
|---|---|---|---|
| Alert | icon-button hover plate 5% | 12% of the tone ink | An opaque neutral plate would grey a tinted ground; the ink mix scales with each tone |
| Avatar | products 20–24px, a hue per person, initials 400 | 28px smallest, neutral, 500 | 20–24 belongs to the planned compact density; neutral by default; one label weight |
| Code | Untitled inline edge #e5 | #f3 | The token has a fill, so its edge is a seam, not a rule |
| Panel | Figma section rows 40, titles weight 550 | 32, 400 in the default ink | Medium rows (owner); one label weight, so ink rather than weight sets headings apart |
| Checkbox | radius 3 (Notion), 2 (Figma) | 4 | `radius-small`, shared with every small control |
| Progress, Slider | rail #e5–#e6 | about #dd | The rail is the toggle-off fill lightened, shared with Switch; within 8 levels |
| Switch | Notion and ChatGPT track has no edge | edge at `edge-control` | The edge carries the contrast-more mix; at rest it sits lighter than the off fill |
| Indicator | Notion dot 8, Figma 5 | 6 | Matches Badge's dot; the products split either side |
| Button | Notion text button 400; ChatGPT and Notion ghost icons muted | 500; default ink | One label weight; Figma, the inspector reference, uses 90% ink |
| Toolbar | Figma bar padded 8, three-layer lift, full-height divider | 4, `shadow-1`, icon-height separator | The surface toolbar is in-flow; the floating lift is for overlays |
| Chip | Notion entered values are 20px tags | 32px input chip | Notion's tags are Badges in Area |
| Alignment picker | Figma controls flat, no edge | 1px decorative edge | The picker is a grid of cells, and the edge bounds the grid |
| Kbd | Notion keycap 18.3 tall | 20 | `control-xs`, the smallest control rung |
| Input | Notion focus is a 2px blue ring | neutral edge and halo | Owner rule: neutral by default |
| Input | no product field has a shadow | outline keeps `shadow-1` | Untitled's outline inputs carry `shadow-xs`; soft is the flat treatment |
| Input | sm icon gap 6 (Notion, Figma) | 4 | `gap-sm`, shared by every small control |
| Input | Notion placeholder about #a19e99 | #666 | #a19e99 is 2.6:1 on white; the contrast floor wins |
| Field | ChatGPT settings label 500, default ink | 400, muted | One label weight; Figma's inspector labels are muted |
| Input group, NumberField | Figma letter prefix at 90% ink | muted | The prefix names the value; it is not the value |
| Input group, Color field | Figma draws no rule between hex and opacity | a rule | Two fields in one group; the rule marks where each edits |
| Color swatch | Figma chit edge 2px at 10% | 1px at 22% | One stroke width; 22% keeps a white swatch visible on white |
| Select | Notion and Figma use borderless triggers | none | A candidate ghost variant; not started without the owner |
| Menu | Notion rules 7% | `border-divider` #e2 | The divider role, matched to ChatGPT, Figma and Untitled |
| Nav | Notion group label 12/16, lighter grey | 14/20 muted | Menu's label is the same; the two stay one pattern |
| Tabs | Notion pads tabs 8 with no gap, so its underline runs 8 past the label | underline the tab's own width, 20 gap | Owner: the underline spans the selected tab, icon and count included; padding would carry it past the content. The 20 gap is recorded in tabs.md as unsourced |
| Table | Notion: no border or header fill, 8px cells, no hover fill | bordered, 12px cells, hover plate | Notion's is a database grid; Area's Table is a data table with shared row plates |
| Tree view | Figma icon follows the chevron directly (16 indent) | 20 | The gap keeps the chevron's hit area apart from the icon |
| Card | carousel media radius equals the card corner | 12 | Carousel tiles are objects of their own, not media in the card's corner |
| Card | Notion and Figma cards are links that act on hover | no link state | A candidate; not started without the owner |
| Card, Panel | — | `shadow-1` and `shadow-2` | A docked region sits one step above content (Elevation, DESIGN_SYSTEM.md) |
| Composer | ChatGPT's composer is a full pill | radius 16 | Left for the owner's Composer review, as the first pass recorded |

**Gallery coverage.** A check of every manifest value against the built gallery found eight
forms with no tile. They were added: Badge dot only, Chip swatch only, Indicator warning,
Panel bare bar, Code block flush, Checkbox group horizontal, Popover left and right, and
Select soft. Shapes (Button pill, Switch long, Skeleton circle) moved from Layout to Variants.
What remains untiled is not visual: full-width and alignment booleans, Textarea resize
directions, Badge and Chip `pill` (both are already pills), Panel xs and lg (equal to sm and
md at default density), Table md (the unset size) and the deprecated Token.

## Verification

`npm run build` (including the new token-reference check), `npm run build:docs` (dogfood
audit), `npm run typecheck`, the React and contract tests and `npm test` (contrast gate) pass.
The changed families were inspected in light and dark in the gallery; the third-pass changes
were inspected in light only. Unverified: product dark themes, Firefox and Safari, forced colours for
the changed paints, screen readers.
