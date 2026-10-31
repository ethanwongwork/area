# Design system

The rules every component follows: tokens, colour, state paint, depth, strokes, size and
shape, insets, icons and the component API. Each rule is stated once, with a short reason
where it is not obvious. The values live in code: `packages/tokens/src` and the component CSS
are authoritative when a number here disagrees. History and evidence are in the specs
(`docs/specs/`) and research notes linked from each section.

Related: [Principles](PRINCIPLES.md) (why), [Theming](THEMING.md) (the settings),
[Contrast](CONTRAST.md) (colour and focus constraints), [Motion](MOTION.md),
[Architecture](ARCHITECTURE.md) (how the code is organized), [Governance](GOVERNANCE.md)
(what gets added).

## Tokens

| Layer | What | Example | Rule |
|---|---|---|---|
| Primitives | Palette, spacing, type, icon and geometry ramps | `--area-neutral-100`, `--area-space-8` | Components never read numbered palette rungs |
| Semantic roles | Foreground, background, edge, focus, motion, elevation | `--area-fg-muted`, `--area-bg-component-hover`, `--area-shadow-float` | Components consume these |
| Component roles | Stable theming hooks with one job | `--area-input-inline-size`, `--area-menu-min-inline-size` | Need a fallback, a consumer and a check |
| Private slots | `--_*` set by a component's variants, read by its base rule | `--_count-height` | Implementation detail; never a public API |

- **Reuse before adding.** Reuse a semantic role when the job is the same. Add a component
  token only for a stable meaning that consumers need to change on its own. Do not add an
  alias to hide an unexplained literal.
- **Visual-first phase.** A measured value with no matching token may be a literal in a
  private slot marked `/* spec */`. A colour with no matching role may be a
  `light-dark(…) /* spec */` literal. Reuse a token only when it equals the spec value
  exactly. Systematizing these literals is a later phase.
- **Every `var(--area-*)` names a defined token**, or carries a fallback when it is a public
  hook (`var(--area-nav-inline-size, 200px)`). The styles build enforces this; an undefined
  property fails silently in a browser.

## Settings

The settings are axes: `data-area-<axis>` on any element, inherited by the subtree. There
are 23, documented with their values in [Theming](THEMING.md). The rules here hold across
them:

- **Namespaces are disjoint.** No two axes write the same property; the build fails if they
  do.
- **Interactions live in `emit/base.ts`.** A value that depends on two axes is one `calc()`
  or `color-mix()` there, never one axis reading another's namespace.
- **Derivations are re-emitted on every scope boundary.**
- **Derived tokens and light/dark pairs are never registered with `@property`.**
  Registration resolves them early and freezes inherited values.
- **Settings are not variants.** Theme, type size, density, contrast and the depth controls
  belong to scopes. A component never offers `compact` or `dark`.

## Colour

**Palette.** `packages/tokens/src/color/palette.json` is vendored and stays verbatim.

- Hue and chroma tuning goes in the explicit tables in `color/curves.ts`.
- Semantic selection goes in `INVERSION` and the resolver.
- Keep the light-end and neutral lightness anchors and the gamut constraints.
- A dark-end lightness adjustment is an explicit, bounded table entry, so it cannot move a
  surface ground or the white-label contrast wall unnoticed.

**An accent at any colour** (2026-10-23, docs/research/palette-customization-2026-10-23).

- **Any hue.** An accent hue draws the palette's ladder between its two nearest families (`color/generate.ts`): their
  lightness at each rung and their share of the room sRGB has there, mixed by how far the hue sits between them, at the
  hue itself. At a family's own hue that is the family, so the palette's eleven never move; `palette.json` is read, never
  written.
- **Strength holds hue and contrast.** Accent strength mixes every accent colour in OKLab toward the gray of its own
  luminance, never scales chroma at a held lightness (which moved blue 500's label contrast 0.3:1 at 30%). The accent's
  solvers (solid, tonal pair, indicator) walk at every strength, so each step they pick clears at each.
- **Solid is a step, not a colour.** It moves the accent's solid and its hover only; the label keeps the hue's own colour,
  and a step the label cannot clear on moves toward the label's side until it can.
- **Labels can take the hue, never lose the contract.** Label tint mixes an accent solid's label toward the most coloured
  rung that clears the label's contract on the fill and its hover at every strength; each of its five steps is gated.
- **Status colours keep their hue.** Under Status colours Match they quiet to the Accent strength with the accent's own
  mix; they never rotate toward it, so danger never reads as warning.
- **Tonal inks stay under the gray-page bound.** A light tonal ink is no brighter than `TONAL_Y` (teal's #00766a, the
  brightest named one), the luminance the Layers model darkens hued inks for on a gray page.
- **Dark soft tones are quiet** (owner, 2026-10-28, docs/research/dark-soft-tones-2026-10-28). In dark a tone's soft
  surfaces (`<tone>-surface`, `-hover`, `-active`, and `-border-subtle`) are the neutral control fill of the same state
  (`bg-component`, `-hover`, `-pressed`: L 0.277 / 0.321 / 0.368) in the tone's hue at chroma 0.05 / 0.06 / 0.07
  (`DARK_TONAL_CHROMA`, `color/scale.ts` `chooseTonalPair`), never a palette rung: ChatGPT, Notion and Figma all sit at
  chroma 0.04–0.07 there, and the rungs carried up to 0.15 and read almost solid. A soft Button in a tone is the neutral
  soft Button with colour in it. The ink is gated on the rungs and on the paint, so every named family keeps its ink;
  light still paints its rungs.

**Tone means meaning; treatment means emphasis.**

- `tone` is semantic: `neutral`, `info`, `success`, `warning`, `caution`, `danger`,
  `discovery`, and `inverse` where a component needs it. Add a tone only for a new meaning.
- `variant` is the treatment (solid, soft, outline, ghost, plain).
- Every family defaults to neutral. The one written exception is Indicator, which defaults
  to danger because an unread count is an alert by nature.

**Label colours.** Tag's `pink`, `gray` and `brown` (and Folder's palette) are colours
without a meaning. `gray` has tints and inks only: a near-neutral scale has no tinted
stroke that clears the outline floor. Every label colour has light and dark pairs checked by
the contrast tests, including its strong ink on its tint.

**Emphasis roles.** Area has one chosen colour, the accent (any hue, strength and solid step), plus neutral. Components never
offer an accent tone. They paint one of two roles, and the `action` and `selection` settings
decide whether each is neutral or the accent. Action defaults to neutral, Selection to the accent (2026-10-22):

| Role | Tokens | Paints |
|---|---|---|
| Action: what you press to commit | `action-solid`, `-solid-hover`, `fg-on-action`, `fg-action` | A neutral solid Button's fill and everything built on it: Split button, Composer send, footer actions. Soft, outline and ghost Buttons stay neutral. |
| Selection: what shows state | `selection-solid`, `-solid-hover`, `fg-on-selection`, `fg-selection`, `selection-surface`, `-band`, `-edge`, `stroke-selected`, `selection-highlight` | A selected container's edge (Card, Asset card, choice cards); Checkbox, Radio, Switch on; Slider, Progress and Spinner fills; Calendar selected days and range band; selected Chip; the Tabs indicator; the Nav marker; checks in Menu, Select, Combobox, Model picker and Tree view; Alignment picker bars; the swatch picker ring; the Avatar active ring; a linked code line; selected text (`::selection`: the accent's active surface, or the pressed wash at Neutral) |
| Neither | — | Row plates (hover, current, selected), the Segmented thumb, surfaces, text, dividers and field chrome. On a row only the mark takes the role. |

Each role is its neutral endpoint mixed toward the accent by the setting's 0/1 switch. The keyboard focus ring follows
Selection too (`focus-color`, owner 2026-10-22), so two settings decide every use of colour: Action for what you press,
Selection for state, the selected edge and focus. Both on Neutral is an entirely neutral look; nothing else reads the
accent. Status colours (danger, success, warning, info) and category colours (a tag's or badge's hue) are their own
scales and never the accent. At the defaults (Action Neutral, Selection Neutral since 2026-10-25) the look is entirely
neutral; Selection Accent puts the accent in state marks, selected edges and the focus ring, Action Accent on commits.

**Ink and weight.**

- Text has two levels, default (`fg-default`) and muted (`fg-muted`). Placeholder text
  shares the muted rung (`fg-placeholder`). Disabled ink is for disabled text only.
- Weight 400 is for running text, descriptions, field labels, rows and titles set larger
  than body.
- Weight 500 is for:
  - surface titles at body size (Popover, Dialog, Toast, Alert, Card, Panel bar, Calendar
    month, Nav group titles, Meter's name);
  - labels on solid fills, tracks and static marks: solid Buttons, Segmented options, every
    Badge, soft Count, Kbd, Indicator counts and Avatar initials.
- A label's weight never changes with state: a selected segment is 500 because every
  segment is. One written exception: a selected Tab is 500 over 400 at rest, with each tab's width
  reserved at 500 by a hidden copy, so the row never moves (owner 2026-10-21; Figma, Radix, Fluent,
  Primer). Tabs carry no fill, so the weight is what makes the selected view read first.
- Foreground never changes on hover. One written exception: an action inside a row or card
  that already shows the pointer (Nav, Board cards, Edit summary files, Queue rows) is a
  muted ghost square whose hover is its ink, muted to default, with no plate of its own
  (owner, review rounds 27, 29 and 30; `cohesion.test.mjs`, "row actions change ink").

## Shared state paint

The same role paints the same way in every family. The cross-family cohesion test
(`packages/react/tests/cohesion.test.mjs`) enforces the core of this list
([cohesion audit](research/cohesion-audit.md)).

**Rows and item plates** (Menu, Nav, Tree view, Table, Select options, List box, Pagination,
neutral ghost Buttons):

| State | Opaque fill | Translucent twin (unknown grounds) |
|---|---|---|
| Hover | `bg-component-hover` | `bg-hover` |
| Selected, current | `bg-component-active`, one step firmer, so selection survives hover | `bg-active` |
| Pressed | `bg-component-pressed`, one step further, so every click shows | `bg-pressed` |

A destructive row (a Menu's "Delete") keeps its red label in every state, and its plates follow Danger hover: at Tint
(the default) each plate keeps its neutral lightness in the danger hue, so the red ink solved for the neutral plate holds
on it; at Neutral it takes the plates above (`axes/states.ts`, owner 2026-10-23).

Use the translucent twins on grounds a component cannot know (a segmented track, a swatch
cell) and for controls nested on a row. The pressed fill follows every ground and Layers
setting (`packages/styles/src/layers.css`), and always moves at least the press room past selected, on a sidebar too. How dark each plate is comes from the Fill settings (Hover, Selected,
Pressed; [Theming](THEMING.md#settings), interaction states), each built on the one before so the order always holds.

Stacked plates sit `ui-row-gap` apart: **1px at every type and density**, so a hovered row never runs into the current
one (owner 2026-10-21; ChatGPT's and Notion's sidebar rows are 1 apart). It is a separation, not spacing: density
changes the row's height, never this break. Spacing that should follow density uses `ui-stack`, `ui-cluster` or its
own step.

**Selected containers and focus** (owner, 2026-10-21; `axes/states.ts`):

- **Selected and focus are two states with one colour**, both Selection roles: the accent's indicator rung at Selection
  Accent (the default), the neutral solid at Neutral (`stroke-selected`, `focus-color`). They differ by placement, as the ARIA Authoring Practices require: selection is an edge drawn inside
  the container, focus a ring on or outside it.
- **A selected edge and the mark inside it are one colour** (owner, 2026-10-22, option B): `stroke-selected` is a
  Selection role, the accent's indicator rung at Selection Accent and the neutral solid at Neutral (the default since 2026-10-25). Focus
  follows the same setting. No component picks its own selection or focus colour; the setting decides for all of them.
- **A selected container** (Card, Asset card, a choice card, a containerless image) draws its edge inside at
  `selected-width` (Selected stroke, 2px by default, ChatGPT's tile): its own line in `stroke-selected`, topped up by
  an inset ring of `selected-width` minus that line, so selecting never moves anything. Under it, `selected-tint`
  (Selected tint, none by default). This supersedes choice cards' "darker, not thicker" rule (2026-09-28).
- **The focus ring** is `focus-width` in `focus-color`. Controls (a button, a chip, a field, a thumb) sit it at
  `focus-offset`; containers and text (a card, a tile, a toolbar, a link, a code line) at `focus-gap`, since a ring on
  their edge or their glyphs reads cramped. Rows, tabs and cells draw it inside, by their own width. Fields read the
  Focus ring setting's switches for their ring, edge recolour and halo. No component writes a literal offset or width.

- **Solid fills** step one way: hover is further from the page, pressed one more
  (`--_solid-active` in `button.css`).
- **Hover changes one thing:** the plate, the edge or the underline. Ink and opacity stay
  fixed. Pointer hover sits under `@media (hover: hover)` so a tap leaves no stuck plate.
  Hover-to-reveal content (row actions, Card overlay, Message actions) stays unwrapped,
  with a `hover: none` rule that shows it.
- **Text in controls is not selectable** (`user-select: none` on every control's base
  rule), so repeated clicks never paint a selection. Fields, links in prose and editable
  text stay selectable.
- **Selected rows by job.**
  - Menus of commands and choices show a trailing check, and the plate is only the
    highlight. MenuItem takes `checked`, or `radio` for one of several.
  - Value pickers (Select, Combobox) show the value with the active plate and the check.
    `data-selected` is their hook.
- **Off states.**
  - One off-track grey, `edge-control`, for the Switch track and the Slider and Progress
    rails.
  - One glyph-edge grey, `edge-control-hover`, for Checkbox and Radio edges and the Slider
    thumb.
  - The Spinner track is its own ink at 25%.
- **Neutral soft marks** (Badge soft, Chip input, soft Count) sit on one translucent plate,
  `bg-mark`, so they stay visible on a hovered or selected row. Avatar and a selected Chip
  keep `bg-component-active`.
- **Quiet ink.** Icon actions (ghost icon Buttons, Message actions) use `fg-quiet`, the
  Button's 75% ink. Text-like rows (prompt suggestions, Code block tabs) use `fg-muted`.
  Unselected options in a set (Segmented, Tabs) take the muted ink and the selected one the
  default ink.
- **Raised thumbs.** The Segmented thumb is the white surface in light and
  `bg-component-active` in dark, where the surface rung sits below the groove.
- **Disabled.** Controls, rows and pickers dim to 50% as a whole
  (`--area-opacity-disabled`). Text fields keep full opacity and use their disabled field
  paint, never both.
- **Loading is not disabled.** A loading Button stays focusable at full ink (`aria-busy`,
  `cursor: progress`) and ignores clicks. A loading Composer keeps its field editable and
  turns send into Stop.
- **Joined soft controls** (soft Button group, soft Split button) share the component fill
  with the quiet ink, no hairline, and row plates on hover and press.
- **Floating placement** is one engine (`useAnchoredPosition`):
  - popovers and hover cards sit 8 from the trigger;
  - menus, tooltips and the Combobox list sit 4 from it;
  - Select's native picker follows the same rules.
- **Close and dismiss.** One recipe per shape, always the Area `dismiss` glyph at fixed ink.
  - Rectangular surfaces (Popover, Toast, Alert) use a ghost small Button with its row
    plate. On a tinted ground it keeps the tone ink and hovers to 12% of it.
  - Dialog's close is a 32px ghost Button.
  - Pills (Chip, Badge) use a concentric circle with a 12%-ink plate.
  - The API is `onDismiss` / `dismissLabel` everywhere.
- **Fields.**
  - Soft fields (Input, Textarea, Number field, Select, Input group) are flat: a fill, no
    shadow.
  - Outline fields rest on the Field shadow setting, which is 0 by default.
  - One surface uses one field style: a Panel's rows are all soft.
- **Keycaps** are filled, not drawn: `bg-component-active`, no visible edge, the 24px box's
  corner, muted ink at 500.
  - Inside a Button the keycap is `currentColor` at 14% with the Button's ink, so it
    survives hover, press and selection.
  - In lists a shortcut is quiet: 12/16, 400, muted, and it takes a danger row's ink.
  - Escape is written "Esc".
- **List rows.**
  - Every icon row puts its label on one 36px column (8 inset + 16 icon + `gap-row` 12):
    Menu, Command palette, Combobox, Select options and Nav. Tree view keeps its own grid.
  - Keyboard focus in menus is the plate alone (active descendant). Nav and Tree rows draw
    an inset ring.
  - A description sits in one of three ways, kept on purpose: under the label as a 12/16
    muted note (Menu), muted after the label (Command palette), or muted at the row's end
    (Combobox).
  - A list with no matches shows one empty row everywhere: a muted line, a medium row
    tall, at the text inset.
- **Image corners** follow the image's size role.
  - An image that stands alone (Figure, an Asset card's image, a viewer) takes
    `radius-container`.
  - A thumbnail (File tile, Asset row, a mosaic cell, a list row) takes `radius-small`.
  - An image inside Preview frame keeps its concentric corner.
- **Feedback sets.** Alert and Toast share one tone set in Badge's order (neutral, info,
  success, warning, danger) and paint the neutral icon muted.

## Elevation

A component never picks a shadow. It names the role it plays, and the settings scale every
role ([research](research/elevation-2026-10-14.md)):

| Role | Used by | Strength from |
|---|---|---|
| `shadow-control` | Switch, Slider and Segmented thumbs; soft Toggle group selection; Badge modern | Resting lift |
| `shadow-resting` | Card, Panel, Board card, Composer | Resting lift |
| `shadow-field` | Outline fields and select triggers; outline and soft Buttons | Field shadow (0 by default) |
| `shadow-tooltip` | Tooltip, Toggletip | Elevation |
| `shadow-lift` | A linked Card or an app tile under the pointer | Elevation, at half weight |
| `shadow-float` | Menu and everything that opens one, Popover and everything built on it, Select picker, Toast, Calendar and Color picker surfaces, floating Toolbar, Board card actions, Scroll to latest | Elevation |
| `shadow-modal` | Dialog, Confirm dialog, Drawer, Command palette | Elevation, doubled |
| `shadow-edge` | Listed first by every framed surface | Rest shadow (0 by default) |

- **Elevation is one number**, the Menu's shadow strength in percent: 0 (Flat) to 8, 3 by
  default. The anchors are Notion's lightest lift (3), its popover (5) and ChatGPT's menu (8).
  Dark doubles every alpha.
- **In-flow controls rest flat.** Buttons, fields, Chip, Tag and content (Code block, Table,
  Alert, Accordion) take no lift by default; they rest on their edge and plate.
- **Every role is eight layer slots at every setting:** a lip, six soft layers and a
  highlight last, transparent where unused. Settings and hovers therefore interpolate layer
  by layer.
- **Never `none`.** Step 0 is transparent layers, never `none`. A role can sit in a
  `box-shadow` list beside a component's own layers (the Board card's tone ring), and `none`
  would invalidate the whole list.
- **Material paints never replace a shadow.** They fill `--_m-layers`, which a surface lists
  first.
- **Contrast never strengthens a shadow.**
- **The edge does the separating at every step.** `border-float` (#eeeeee in light, #4b4b4b
  in dark) frames every floating surface: Popover, Menu, Dialog, Toast, Command palette, the
  surface Calendar and Color picker, the floating Toolbar. A floating surface therefore stays
  distinct over another surface where its shadow no longer reads.
- **Forced colours drop `box-shadow`.** `forced-colors.css` puts frames back at 1px and gives
  the floating Toolbar, whose edge is an inset shadow, an outline.
- **The dark Tooltip** stays a dark annotation (#282828 with a 5% white inset edge).

**Edge and Depth** are ten independent controls, with no named looks: Stroke width, Stroke,
Rest shadow, Elevation (Floating), Resting lift, Field shadow, Shadow size, Softness, Light
and Shadow colour ([Theming](THEMING.md), [research](research/elevation-stroke-2026-10-18/README.md)).

- **Stroke width** (the Surface axis, 0 to 2 in half pixels, 1 by default) is the frame of
  surfaces that carry a shadow.
- **Rest shadow** (0 by default) draws `shadow-edge`: a soft edge in light, a 1px white line
  inside in dark. Line and shadow are independent: a line, a shadow, both, or neither.
- The edge is drawn only while no frame is. A raised contrast level brings the frame back at
  1px and turns the soft edge off: never both.

## Strokes

Every line is 1px at the default Stroke width, and focus rings are 2px. What varies is the
width token a line reads and the colour role it takes. Never write a literal `1px` for a
line ([audit](research/consistency-audit-2026-10-12.md)).

**Width follows the job.**

- `stroke-width` never moves with the Stroke width setting. It draws every line that
  carries meaning or stands alone:
  - control, field and state edges;
  - swatch and image rings;
  - cutouts between overlapping marks (Avatar group, Indicator anchor);
  - seams inside joined controls (Button group, Split button, Input group, Color field);
  - standalone dividers (Separator, Nav separators, the Tabs track, Table rows, Description
    list, Accordion's divided items, Shortcut list's divided rows);
  - frames with no shadow to carry them (Table, Description list, Code block, File upload,
    Asset card's inner frame), and Composer's frame.
- `border-width` follows Stroke width, and is 1px again under increased contrast. It draws:
  - the frames of surfaces that carry a shadow (floating surfaces, Panel, Card);
  - the seams inside them;
  - the edges of filled shapes (Alert, inline Code, the Segmented and Toggle group tracks).

**Colour by group (owner, 2026-10-30).** A stroke's colour is its group's, one of twelve by what the stroke does
(`axes/stroke-groups.ts`; Inspector › Stroke, each 0 to 8). A step is 2.5% of the text colour over whatever is under the
stroke, mixed in sRGB, so a group keeps its distance on every ground, light or dark; Edge contrast is the master (4 leaves
the amounts as set), and Contrast takes every group the rest of the way to the 3:1 control stroke. Defaults are the
owner's picks:

| Group | Amount | Members |
|---|---|---|
| Cards | 4 (10%) | Card, Surface, Asset card, Attachment, Board card, Preview frame |
| Blocks | 5 (12.5%) | Code block, Table's frame, Description list framed, Plan, Queue, Edit summary |
| Callouts | 4 | Alert |
| Floating | 5 | Menu, Popover, Hover card, Toast, Dialog, Drawer, Command palette, Calendar and Color picker surfaces, the Select picker, floating Toolbar and Titlebar |
| Regions | 3 (7.5%) | Panel, the Titlebar's rule |
| Dividers | 3 | Separator, Menu, Nav, Toolbar and File upload separators, Table rows and column rules, Tabs track, Accordion, Description list divided, Link groups, Shortcut list, Inline list, Tree view guides, Timeline, Stepper and Step lines, Plan's rail, the Command palette's search rule, a flush Code block's rule |
| Fields | 5 | Soft Input, Select, Custom select, Number field, Textarea, Date picker, Tag picker, OTP, Input group (`input-edge-soft`) |
| Buttons | 3 | Soft Button, soft Button group, soft Split button, soft Toggle group, the Segmented track |
| Options | 4 | Choice cards and soft choice rows (Radio, Checkbox) |
| Tracks | 3 | Slider rail, Switch's off track, Progress, Meter (a segmented Meter has none) |
| Tags | 3 | Soft Badge, soft Count, Tag, Kbd |
| Media | 2 (5%) | Avatar, swatch rings (`token-swatch-ring`), Asset card's inner frame and group cells |

Fixed, in no group: outline Button, Badge and Chip, outline fields, solid fills, ghost and toolbar buttons, rows, unchecked
Checkbox and Radio boxes, focus rings, selected edges, field state and disabled edges, inline Code, Composer. A soft Code
block stays fill only. Width still follows the job (above); a group sets only colour. The rungs below remain for the
roles outside the groups.

**Colour, lightest to firmest (the rungs outside the groups):**

| Role | Light | For |
|---|---|---|
| `border-decorative` | #f3 | Every divider by default: Separator, Menu, Toolbar and Nav separators, Inline list's rule, File upload's separator, Shortcut list's divided rows, the Command palette's search rule; edges of filled shapes |
| `border-float` | #ee (dark #4b) | Every floating frame |
| `border-card` | #ee | Standalone surfaces: Card, Composer, Code block |
| `border-divider`, `edge-control` | #e2 | Lines that carry data (Table rows) and opt-in dividers that ask for weight (Accordion divided, Link groups divided, Description list divided); control and field edges; off tracks; the Table frame and Asset card's inner frame |
| `edge-control-hover` | #d4 | Control edges on hover. At rest: Checkbox and Radio, Tree view's check, Slider and Color picker thumbs, Calendar tiles |
| `edge-control-strong` | #b4 | A Checkbox, Radio or selected Chip under the pointer |
| `stroke-control` | #83 | Calendar's today ring, Breadcrumb separators |

- **A rule inside a container is never darker than the container's edge.** The exception is
  seams inside joined controls (soft Button group, Split button): they are control edges and
  keep `edge-control`.
- **Draw a divider only where it is needed and intended** (owner, 2026-10-25: "id prefer to
  not use dividers in general unless its very necessary and intentional"). A head, foot or
  section inside a container draws no line: space and its own heading separate it (Code
  block, Edit summary, Queue, Plan, Panel, Color picker, the Command palette's footer). A
  line stays where two different kinds of thing meet (a search field over its results) or
  where rows carry data (Table), and as an option the author turns on (`divided`).
- **Space replaces the line** (owner, 2026-10-26: "make sure the spacing is intentional"). Where a line comes out, the
  space is set from the container's own measures, never left as the two paddings the line sat between:
  - a header sits as far above its content as the content sits from the container's side (Color picker: 16);
  - a group that follows another sits one step further than the parts inside sit apart (Color picker's saved colours: two
    rhythms, 24; Panel sections: an inset and the heading's air, about 31 to the next title);
  - a footer sits as far under the last row as above the edge (Command palette: 12 and 12);
  - rows without rules take the plain UI row; the extra room ruled rows carry is for the rule (Shortcut list: 32, 36
    divided).
- **A divider is the lightest line**, `border-decorative`, unless it carries data or is an
  opt-in that asks for weight (owner: "dividers that are inset to have a very light subtle
  stroke by default"). Increased contrast still firms every line. Was: a standalone divider
  sat a step darker than a seam. Enforced by `cohesion.test.mjs` ("dividers only where
  intended").
- **Control and state edges read the `edge-*` roles**, which strengthen under increased
  contrast, never the raw `border-*` rungs. Supplementary lines (Box model layers, a
  disabled field's `border-faint`) may use the raw rungs.
- **The raised-plate edge** (Segmented thumb, soft Toggle group selection, Badge modern) is
  `edge-selected` with `shadow-control`.
- **Translucent lines are only for content Area cannot know.** The swatch ring is 10% black
  or white over swatches, colour areas, tracks and image wells. Code's on-colour edge is
  `currentColor` at 20%. On a ground Area knows, lines are opaque.
- **Translucent fills follow the same rule.** They are `bg-hover`, `bg-active` and
  `bg-pressed`; `bg-mark` and `bg-mark-hover`; `currentColor` 12% for a dismiss plate on a
  pill; and `currentColor` 14% for a keycap in a Button. Everything else is an opaque rung.

## Size and shape

**Heights come from type and density.** The control tier (`control-xs` … `control-xl`) is
the tier's text line plus twice its room, never under 24. The medium Button is 32 at type 14
and the default density (28 Compact, 36 Comfortable). Read the ramps in `axes/density.ts`
and `emit/base.ts`; never copy a table into a component
([research](research/ui-size-scale-2026-10-12.md)).

- **The type ramp** is six sizes with one leading each: 12/16, 14/20, 16/24, then titles 20/28, 24/32, 32/40 at
  type 14, on the 4px grid there and on the 2px leading ramp at other types (13/18 and 15/22 at type 13;
  `LEADING` in `axes/type-size.ts`, [type spec](specs/typography.md)). Small text is the base minus 2, and never
  under 10. These leadings are **UI lines**: a label, a row, a cell, a title, a description of one or two lines. They
  run tight (1.38 to 1.5) so rows stay compact.
- **Prose lines** (owner, 2026-10-30; `docs/research/vertical-rhythm-2026-10-30`). Prose that runs past two lines,
  where the eye has to find the next line (a chat turn, documentation and spec prose), takes the prose leading: the first
  value on the 2px leading ramp at or above 1.5 × the size, the line spacing WCAG 1.4.8 asks of paragraphs and 1.4.12
  requires text to survive. 12/18, 13/20, 14/22, 15/24, 16/24 (`text-sm-prose-leading`, `text-md-prose-leading`; the
  type axis, `proseLeading` in `axes/type-size.ts`). Message uses it: at type 13 a turn is 15/24 (was 15/22). Parts set in
  prose keep their UI lines and state them (Step, Plan, Edit summary, Turn notice, a table); `cohesion.test.mjs` checks
  both. "Reading" stays text-md's name, the size; prose is the line.
- **Every scope restarts at the body role.** Below the page root, an element with its own Type sets `text-md` for
  text set straight in it (THEMING.md, CSS inheritance). A component that holds free text states its own role
  (Card and Surface use `text-sm`); inline parts (Link, Code, Abbreviation) inherit the text they sit in. A part that
  stands on its own (a row, a cell) takes a ramp size, never inline Code's 0.875em.
- **Text pairs** (owner, 2026-09-28 on Card, 2026-10-22 for every family; measured in
  `docs/research/text-gaps-2026-10-22`). Gaps are read on the glyphs (baseline to cap), and each kind of pair has one:
  - a line that belongs to a title or label (description, subtitle, a group legend's description) **joins** it, with
    no gap between their line boxes: title baseline to description cap is about 12 for a 16 title over 14 text and
    10 for 14 over 14 (Figma and Notion 11.5). A 12/16 line has 2 less leading, so it sits 2 below (10.5 under a 14
    title), as a choice's description does. Card, Dialog, Drawer, Popover, Alert, Toast, Empty state,
    choices and their groups, Switch and Approval all follow it;
  - a label above its one control: `ui-stack` (6), Field's gap, so the label's baseline sits 11 above the control's edge;
  - a text group (a title or legend, with or without its description) above a **set** it introduces (options, rows,
    links, a list) stands one step further from it than the set's items stand from each other, on Area's ladder
    2 · 4 · 6 · 8 · 12 · 16 · 24: options 8 apart take 12 (`gap-row`, Stack's group), links 4 apart take 8. So the space inside the text group < the space between items < the space from the text to
    the items, and the heading reads as belonging to everything below it, not only the first item. Panel's heading is
    itself a row with Figma's 8 above and below, so it keeps its row rhythm;
  - a label beside its value: the label column is as wide as the longest label (shared by the rows, up to 40%), and
    the value starts `gap-row` (12) after it. A fixed column is for editable property rows only (Description list's
    `columns`, Notion's properties);
  - a text group to the block after it (a list, actions, a footer): the container's block gap (Card's 12).
  Weight and ink follow the part, not the family: a title that names a surface or section is strong (500); the name
  of an item or control (a choice, a step, a row, a file) is regular (400); supporting lines are muted and regular.
  A joined pair is never tighter than the lines inside it: at 13/18 over 13/18 the join is 8.8 baseline to cap (Section
  heading 8, with its trimmed boxes), the same as the lede's own lines, so the title reads as the pair's first line.
- **Text that flows** (owner, 2026-10-30; `docs/research/vertical-rhythm-2026-10-30`). Prose is spaced by the same
  ladder as everything else, each gap larger than the space inside it (Message, `message.css`; the app's chat,
  `styles/chat.css`):
  - **blocks** (paragraphs, a group of steps, a table, a card) are the prose gap apart, about two-thirds of a prose line
    on the spacing ramp (`text-*-prose-gap`): 16 at 15/24, 12 at 13/20, 20 at 18/28 (baseline to baseline 1.6 to 1.7
    lines, past WCAG 1.4.8's paragraph spacing);
  - **a heading carries its space above** (spacing.md): the prose gap plus 8 above it (24 at 15/24) and 8 below, at the
    body size and strong, so it joins what it introduces;
  - **a list** is a set its lead-in sentence introduces (Text pairs): items 4 apart, the lead-in one step further (8), and
    the prose gap after the list;
  - **a conversation** follows the rings: a reply's blocks the prose gap apart; the person's message to its reply one
    step closer (12, the group role); a new exchange one ring out (24, the section role); a time over a message joins it
    (8). Steps inside a group stay 4 apart.
  Space is compared on one basis, baseline to cap: a gap quoted between line boxes (another product's 2px) is that gap
  plus the lines' own leading, about 9 at 13/18.
- **Shared controls use the same tier's icon, text and gap tokens.**
- **Icon-to-label gap:**
  - 6 at sm, md and lg; 4 at xs and compact;
  - list rows use `gap-row` 12;
  - hosts (Button group, Toolbar) never re-tier a child's gap, and layout spacing never
    reads the gap tokens.
- **Text-label marks** (Badge, Count, Tag, Kbd) use `mark-label-sm/md/lg`, derived from the
  small text line.
- **Fixed marks** (Presence, the Indicator count, Color swatch) use `mark-sm/md/lg`
  (16 / 20 / 24), which hold under every density. Dense products shrink controls, not marks.
- **A mark in an icon slot stands in for a glyph** and keeps to the icon keylines: a Color
  swatch in a menu row's or Custom select's icon box is the box less 2 (14 in 16, Figma's
  colour-row chit), and any other mark drawn there is a 12 square or at most 14 × 10 wide.
- **Checkbox and Radio** share one glyph ladder (`mark-box`). Slider's thumb follows it.
- **Switch** has its own track: track = height + 12, so the thumb travels 12 at every size.
- **Sizes a family exposes.**
  - Public sizes default to `md`.
  - Expose `sm` only for a real compact composition, and `lg` for a prominent or touch use.
  - Never expose `xs` or `xl` because the token ramp has them.
  - Product-wide compactness is the Density setting.
  - Content roles (Panel insets, Kbd labels) may use their own vocabulary.
- **Don't force control heights** onto labels, glyphs or containers.
- **Pointer targets are separate from visible glyphs.** A compact choice control can use
  its label as the hit area without enlarging the glyph. Contained controls share their
  width token alone and inside a Field. Full width is explicit.

**Radius is one setting**: 0 (Sharp), 2, 4, 6, 8, 10 (default since 2026-10-25; was 8), 12, 14 or pill, the medium
Button's corner ([audit](research/radius-audit-2026-10-03.md)).

- **Shapes on the height ladder** take `max(radius-min, round(down, height × radius-factor, 2px))`:
  - the setting × height ÷ 32, in even pixels, never under 2;
  - at 8, that gives 24 → 6, 28 → 6, 32 → 8, 40 → 10, 48 → 12;
  - Sharp is square and Pill is round.
- **Controls read `radius-control-*`.** A component with its own height writes the same
  expression on it.
- **Surfaces** use the container ladder (0, 2, 4, 8, 12, 16, 20, 24; 24 at Pill), 12 by
  default.
  - Card is the surface plus its inset less 4; Dialog is the surface plus 4.
  - Neither is ever rounder than the surface corner.
  - Surface corners cap at 1.5 × the surface inset.
- **A shell holding a control is concentric with it:** the control's corner plus its
  distance from the edge, scaled by `radius-concentric` (0 at Sharp). This covers Composer,
  Message, Prompt suggestions, Toolbar and the Segmented track. A button set into a corner
  takes that corner less its inset.
- **A picture in a choice card is one of two kinds** (owner 2026-10-26, Radio and Checkbox `preview`, `media`,
  `media-row`). A picture with its own ground (a screen, a photo) fills the picture slot, 8px inside the card's edge,
  its corner the card's less the 8 (6 clear inside a chosen card's 2px stroke, which is drawn inside). An illustration with no ground (a window, a component) has no frame: the card's
  inset on its outer sides, the card's content after it at that same inset, its size what the card leaves.
- **Nested radius** is `max(min(radius-floor, own corner), outer − inset)`, where
  `radius-floor` is min(4, setting). Only Sharp is square anywhere. Insets are the padding;
  a surface's 1px border is left out.
  Composed screens get it from **Surface**: each Surface's corner is the parent Surface's
  corner less that Surface's inset, floored, as Card's media takes Card's corner less its inset; its layer steps from its parent (`surface`
  raised, `soft` recessed), with one edge per boundary. **Stack** spaces children by role
  (related, group, section) and never wider than the inset of the Surface it sits in
  ([Surface](specs/surface.md), [Stack](specs/stack.md)).
- **Rows in floating lists** (Menu, Context menu, Command palette) use
  `radius-list-row`: the surface less its inset, no rounder than a medium Button, and a pill
  only at Pill. The list uses `radius-list` (rows + inset). Standalone rows (Nav, Tree view)
  use `radius-row`.
- **A list opened from a field** (Select, Custom select, Combobox, Tag picker) takes the field's
  corner: its rows are the field's corner (short of a pill before Pill), the list 4 rounder, or
  the rows' own corner more below 4, so it reads as the field's own list and goes square with it
  (owner 2026-10-23; Notion: field 6, menu 10, rows 6). It re-points `radius-list-row` and
  `radius-list` on the list (`surface.css`, `navigation.css`).
- **Bars and keycaps.** A one-line bar (Alert banner, Toast) and Tooltip take the large
  control corner. Multiline ones are surfaces. Kbd is a 24px box's corner at every size.
- **Option rows are bars.** A Radio or Checkbox `card` or `soft` option in the row or list layout takes the
  ladder's corner for its one-line height (inset and edge twice, plus the control's box), never rounder than a
  surface, and a pill only at Pill: a 34 row is 10 at corner 10, 12 at 12 (owner 2026-10-30; it took the surface
  corner, so 16 or 20 made a 34 row a pill). A caption makes it taller, not rounder. Tile, preview and media options
  are pictures in a card and keep the surface corner.
- **Pills are a set** (`data-area-pills`), not a radius.
  - By default Badge, Chip, Count, Switch and Avatar are pills, and Button, fields and
    Segmented follow the radius.
  - A component adds `--area-pill-<id> × radius-full` to its corner, so concentric parts
    follow.
  - Instance props override the set (`pill`; Avatar `shape`).
- **Identity shapes are always round:** radios, slider thumbs, Progress, presence and
  indicator dots.
- **A checkbox and a square avatar** take their own corner, capped at 7/16 of the side.
- **Textarea** keeps the one-line field corner.
- **Measure painted bounds** when browser clamping matters.

**Page and layer tones come from the Layers settings** ([Theming](THEMING.md)).

- Every ground, control fill, edge and ink derives from the light ground, the dark ground
  and the layer contrast.
- Control fills step from the ground they sit on, and in dark never fall under L 0.20.
- **Edges keep their contrast on the ground they sit on** (2026-10-23). An edge is a distance from the page in light
  and from the raised layer in dark; on a ground past that (recessed, and Card tone's card and tile below the page in
  light or above the raised layer in dark) every edge role moves as far as the ground does (`edge-shift-light` /
  `-dark`, `layers.css`; `color/layers.ts` `GROUND_EDGES`), so a card's frame on a sidebar reads as on the page
  (1.01:1 at Layers 8 before). What sits inside a ground measures from it; what a ground draws on itself (its frame,
  a hover or selected edge) measures from the ground it sits on, since that line is the boundary between the two: a
  Card on a sidebar frames itself against the sidebar and its fields against the card. Every ground sets the shift
  and its children restate every edge role and every token that reads one (`cohesion.test.mjs`). At the defaults only
  what sits on the recessed layer (a sidebar, a soft Surface, a preview choice card) and an Asset card's tile moves.
- **A component that paints a ground declares it.** When a component's own CSS paints
  `bg-surface` or `bg-code` (raised), `bg-subtle` (recessed) or `bg-page` under anything
  with a control fill (a hover or selected plate, a soft field, a ghost button), it is
  listed with that ground in `packages/styles/src/layers.css`. Its controls then take the
  plate made for that ground, so a hover reads the same step on a card, a sidebar or the
  page. Undeclared, they use the page's plate: on Asset card's recessed head that was
  1.04:1 instead of 1.11:1 (round 60). `cohesion.test.mjs` ("every painted ground is
  declared") fails an undeclared ground; a ground with nothing on it that paints a control
  fill (an image well, a dot, a control's own card) is exempted there with its reason.
- **An inner frame always reads apart from its card** (2026-10-23). Asset card's frame is
  the page tone, the ground components are drawn for, unless the card around it is the
  page tone too (within 0.005 L: Card shade 0 or a position that small, a step clamped at
  white or black, or a raised card on a white page): then it takes the recessed tone if that
  is farther from the card (`bg-frame`, `bg-frame-raised`; `color/layers.ts` `FRAME_SAME`,
  since 2026-10-26 when Card shade and Layer contrast took every position). It is never a third tone, and its controls step from it (the `frame` and
  `frame-raised` grounds). At Layers 0 every tone is one and the edges set it apart.
- Dark mode is near-black by default: the page is #020202, cards #121212 and sidebars
  #0b0b0b.

## Optical insets

`packages/styles/src/inset.css` is the shared implementation.

- **Icons use full square slots**, not path bounds. All text uses one cap-to-baseline
  reference, with room for accents and descenders. Never nudge a glyph or a word. Every text
  slot in a centred row takes that reference, the second text too (a description, a step
  count): one trimmed and one not part their baselines by a fraction of a pixel.
- **Outer inset is `(H − B) / 2`** for backplate height H and edge-item reference height B.
  CSS padding subtracts the border once. Calculate leading and trailing ends separately:
  `outer inset = border + shell padding + slot inset`.
- **Nested boxes own their insets.** Swatches, dots, avatars and nested controls use their
  own boxes. A parent reserves an action button's box, and that button owns its icon inset.
  Never size the action to its icon.
- **Multiline content aligns to the first line.** An icon gets equal top and leading insets
  and room below; never centre it against the whole paragraph.
- **Matching tiers.** Use matching tier icon, text and gap tokens. Menu, Nav and message
  content use medium UI type; supporting text uses at least small UI type.
- **Framework-free markup uses the same slots as React.** Native editable controls keep
  browser editing metrics.

## Icons and technical labels

- **Components draw Area's own icons** through `Glyph` (`packages/react/src/components/Glyph.tsx`)
  at 12, 16, 20 or 24, with 12px and 10px cuts where they exist.
  - Strokes follow `--area-weight-icon` per size (`base.css`). A glyph or `@area/icons` icon at its default size fills
    its component's icon slot, which is 20 from type 15; there its line is the token line × `--area-type-icon-line`
    (0.8846, the size curve at 20), never the 16 drawing's line scaled with the box. An icon given a `size` keeps the
    curve for that size; a component that sets its own icon line sets `--area-type-icon-line: 1` beside it (File tile,
    File page).
  - Never shrink a 16 drawing to 12 with CSS.
  - Icons are drawn in `packages/icons/sources` and generated, never hand-edited in
    `glyphs.ts`. Process: [icon spec](specs/icons.md) and the `area-icon-construction` skill.
  - A few components still use Fluent cuts (Color picker, Copy button); replace them with
    Area glyphs when those families are next touched.
- **Status dots and keyboard glyphs** are their own roles. A few content boxes hold a 20px
  glyph off the tier ramp (Avatar md, the choice card visual).
- **Code** is identifiers and inline source; `<Code swatch>` shows a token with its colour
  (Token is deprecated). **Kbd** is one chord, and **KbdGroup** a sequence. **Badge** is
  status or metadata; **Chip** is an interactive compact choice. Never merge these jobs
  because their silhouettes look alike.

## CSS, manifest and React

How the files fit together is in [Architecture](ARCHITECTURE.md). The rules:

- **Structure.**
  - CSS lives in `packages/styles/src/components/` under `@layer area.components`, following
    `button.css` and `count.css`.
  - Variants set local slots and the base rule consumes them; size rules select tier tokens.
  - Every dimension traces to a token, a documented hairline, mask geometry or a `/* spec */`
    value.
- **Manifest.** `manifest.ts` lists every block's variants, booleans, elements, element
  modifiers and states. The parity check runs both ways. The base rule renders the
  manifest's defaults, so `<button class="area-chip">` matches the React default.
- **Naming.**
  - Blocks are `.area-badge`, parts `.area-badge__dot`, modifiers `.area-badge--outline`.
  - CSS modifiers are kebab-case and React booleans camelCase (`fullWidth`).
  - Axis names and values follow [Governance › One vocabulary](GOVERNANCE.md#4-one-vocabulary).
  - Values don't repeat the axis name.
  - A modifier may keep a prefix only to avoid a collision on the same block.
- **Two written exceptions to the manifest.**
  - An axis whose default is the base rule's own paint may list only its other values (Tabs,
    Nav and Slider `orientation`; Checkbox and Radio `variant` and `layout`), with React
    naming the default.
  - Props that only forward another block's axes (SplitButton `tone` and `size`, ModelPicker
    `size`, BoxField `kind`, Skeleton `lines`, Combobox `variant` and `size` to its Input) stay out of the
    manifest.
- **State.**
  - Native state and ARIA carry behaviour and meaning. Documented `data-*` attributes are
    painting hooks: `data-disabled` cannot disable a native button.
  - Prefer native behaviour. A custom composite needs a complete keyboard, focus, value,
    dismissal and form contract before it claims that behaviour.
  - A controlled value is owned by the parent. Uncontrolled state stays in step with the
    native input and form reset. What is visible, submitted and announced must agree.
- **One API vocabulary.**
  - A value is `value` / `defaultValue` / `onValueChange(value, event)`. The event comes
    second, optional where a change can arrive without one.
  - On/off is `checked` (`onCheckedChange`) or `selected` (`onSelectedChange`).
  - An overlay is `open` / `defaultOpen` / `onOpenChange`; a close is `onDismiss` /
    `dismissLabel`.
  - Pending is `loading`, and hover timing is `delay` / `closeDelay`.
  - Renamed props keep a deprecated alias for a release.
- **Names and collections.**
  - `aria-label` names the component's own element, `<part>Label` names a sub-part
    (`menuLabel`, `dismissLabel`, `toggleLabel`), and `label` is visible text or spoken
    content.
  - A collection is `items`.
  - Glyph slots are `icon` / `trailingIcon`, and media `leadingVisual`. Input keeps
    `leadingIcon` / `trailingIcon` because a field has two glyph sides.
  - `trailing` holds text or a count.
  - A picker that renders a group and a visible legend keeps `label` as a fallback name, and
    `aria-label` wins.
- **Logical properties** (`inline-size`, `padding-inline`), so direction follows the scope.
- **Stacking.** Components stack only locally (z-index 0–2 inside their own box). Floating
  surfaces use the top layer, the `z-*` scale is for product chrome, and the modal backdrop
  is `--area-scrim`.

## Example copy

Every demo and specimen uses one placeholder vocabulary, so what a reader compares is
type, rhythm and alignment, not a borrowed story:

- `Button`, `Badge`, `Chip`, `Code`: a specimen that stands for itself.
- `Title`, `Label`, `Description`, `Body text`: headings, labels, supporting text and a
  message body.
- `Action`, `Secondary`, `Cancel`, `Delete`, `Undo`: buttons inside a composition.
- `Item one`, `Option one`, `Value`, `1`: repeated content, choices, values and figures. A
  control that shows every option inline (Segmented, Tabs, a chip row) uses the short
  ordinal (`One`, `Two`) so the track does not truncate.
- `Placeholder`, `Error message`, `Success message`, `Warning message`: attributes and
  validation text.
- **People.** Example people are always David Tee. A list of several people uses teams for
  the others. Never invent a colleague, product or project noun.

Size tiles name their tier (`Small`, `Medium`, `Large`), and a treatment or tone matrix
names its value. An icon-paired label (`Align top`) keeps the meaning its glyph carries. A
verification fixture (long text, RTL, doubled zoom) keeps the text that makes the failure
visible.

## Verification

- **Inspect in the app**, light and dark, at the app's scale. Also check the extremes of
  every setting the change touches: type 12 and 16, density 28 and 36, radius 0 and pill,
  Elevation 0 and 8, contrast More.
- **Check states and widths:** hover, press, focus by keyboard, disabled and narrow widths.
- **Motion checks** are in [Motion](MOTION.md). `data-area-motion="0"` must stop every loop
  that `prefers-reduced-motion` stops.
- **Some cases are not tiles.** Long labels, RTL, enlargement, reduced motion and forced
  colours are verification cases, not variants.
- **Report limits honestly.** Use the checks in [Development](DEVELOPMENT.md). One passing
  screenshot or token suite does not prove the library accessible.
