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
- **A hue may drift along its ramp** (`HUE_DRIFT`, 2026-11-02). Yellow turns +8° at its light end
  and −10° from 600 down, the bright middle held, so its ground reads as cream and its readable
  ink as gold, not olive (measured references drift the same way: docs/research/tone-tints-2026-11-02). Generated accent hues mix their neighbours' drift; the data families don't take it.
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
- **Colours have one placement** (2026-11-01, docs/research/color-system-2026-11-01). `colourAt(h, L, share, cap)`
  (`color/place.ts`) places a colour by hue, OKLab lightness and its share of the sRGB room; every palette rung is that
  function at its own L, h and share (within one 8-bit step), so data and picked colours can sit between rungs.
  `palette.json` is never re-spaced, and in-between positions never become semantic roles, with one exception: a tone's
  ink (`fg-<tone>`) is solved between its family's two nearest steps (2026-11-02, `scale.ts` `solveInk`), the most
  colour that still clears its floor, where a step would give some of it away (yellow's pressed tint sat between 600
  and 650). Tone contrast (docs/THEMING.md) sets that floor.
- **Data colours are the series, and every series is a palette step** (owner's Build picks, 2026-11-01: OpenAI's
  colours; brightened with an indigo and folded into the palette 2026-11-02, data views rounds 15 and 18). Eight series in
  a fixed order, each a step on its family: blue = sky 350, pink = pink 300, yellow-green = chartreuse 400, indigo =
  indigo 450, orange = orange 350, mint = mint 400, purple = violet 350, peach = red 250. Where no family sat within 8° of
  a series' hue, the palette gained one, built by the palette's own recipe (`generate.ts`): chartreuse 105, mint 170, sky
  250, violet 305 (presets.ts `DATA_SCALES`, not accent candidates). `-fill` is the colour, the same in light and dark:
  bars, areas, keys, dots; on white most sit under 3:1, so a chart keeps its legend, values or a mark edge.
  `--area-series-<n>` is the mark: in light the colour where it clears 3:1 on every light ground (indigo, violet), else
  the first deeper step that does; in dark the colour. `-area` is an area under a bright line: the colour in light, the
  first step at L 0.40 or under that the colour clears 3:1 over in dark. `-ink` is a number inside the fill: the first
  deeper step at 4.5:1. `-ramp-1` … `-7` are the family's own steps, each 0.065 apart or more. A part keeps its colour by
  its place, never its size; series never mean status and never follow Saturation. On P3 screens the colour takes
  Display P3's room. Series lightness moves every series along its family; `contrast/series.test.ts` holds the dataviz
  validator's thresholds at every value.
- **Charts' status is its own trio**, `--area-data-success`, `--area-data-warning`, `--area-data-danger` (#5dce8e,
  #ffcd53, #ff4849, the same in light and dark; data views round 14): trackers, uptime, CI runs. Yellow sits lighter
  than green so the two part for red-green colour blindness; red reads first. Text and controls keep the success,
  warning and danger roles.
- **Status colours keep their hue.** Under Status colours Match they quiet to the Accent strength with the accent's own
  mix; they never rotate toward it, so danger never reads as warning.
- **Tonal inks stay under the gray-page bound.** A light tonal ink is no brighter than `TONAL_Y` (teal's #00766a, the
  brightest named one), the luminance the Layers model darkens hued inks for on a gray page. Under a lower Tone contrast
  floor, the floor's own bound and darken stand in for it (`toneFloorY`, `layer-light-floor-darken`).
- **Soft tones are the neutral soft fill with colour in it, in both modes** (dark: owner, 2026-10-28,
  docs/research/dark-soft-tones-2026-10-28; light: owner, 2026-11-02, docs/research/tone-tints-2026-11-02). A tone's
  soft surfaces (`<tone>-surface`, `-hover`, `-active`, and `-border-subtle`) take the lightness of the neutral control
  fill of the same state, in the family's light-end hue (`TINT_HUE_LEVEL`, so yellow's tints stay yellow while its
  dark rungs drift to amber), at chroma 0.025 / 0.035 / 0.045 in light (`LIGHT_TONAL_CHROMA`) and 0.05 / 0.06 / 0.07 in
  dark (`DARK_TONAL_CHROMA`), never a palette rung (`color/scale.ts` `chooseTonalPair`).
  - **In light the colour holds; the lightness gives way.** Near white sRGB holds little chroma at most hues (red, blue
    and purple, 0.012 at the light rest fill), so a tint sits as far under the fill as its chroma needs: yellow and green
    stay at the fill (L 0.976), red, blue, purple and pink settle near 0.95 (docs/research/tone-tints-2026-11-02). The light rungs had run chroma 0.006 to 0.104 and lightness 0.83 to 0.98.
  - **In dark the lightness holds; the chroma gives way** to what sRGB shows at the fill: a lighter dark tint takes the
    words' contrast (at Tone tint 160 yellow's rose to #524400 and its ink fell to near white).
  - **Tone tint** (docs/THEMING.md) scales the ladders for the status and label tones, 0 to 160 percent; every tint's
    words are solved on it at every Tone contrast floor.
  - **A muted family carries its share** (`VIVID_PEAK_CHROMA`): brown's tints take 0.44 of the ladder; at the full
    ladder they matched warning's.
  - Light inks are solved on what paints; dark inks on the rungs too, the stricter ground there, so dark's reviewed inks
    hold.

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

**Every hue has the same roles** (components audit D5, 2026-11-07; `packages/tokens/src/semantic/hues.ts`). The ten label
hues (`neutral`, `gray`, `brown`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `red`: Tag `color`, Board
columns, Link's and Citation's hued inks, and a chart that colours by a label) each have one role table,
`--area-hue-<hue>-<role>`, in light and dark. A family that takes a hue reads these roles and never a tone or a palette
step of its own, so a blue Tag, a blue column and a blue link are one blue.

| Role | What it paints | Where it comes from | Held to (contrast gate) |
|---|---|---|---|
| `text` | words in the hue: a Tag label, a column's count, a hued link | the tone's ink, `fg-<tone>` (neutral `fg-default`) | 4.5:1 on the page, the surfaces and each of its own tints |
| `icon` | a glyph or dot that stands alone | the tone's mark, `fg-<tone>-mark`: the first rung from 500 that clears 3.5:1 on white, the tone's ink in dark (neutral `fg-muted`) | 3:1 on the page, the surface and its tint |
| `border` | an outline in the hue | the tone's stroke, `<tone>-border` (gray and neutral: the control edge `border`) | the ambient stroke tier, as the tone strokes |
| `bg`, `bg-hover`, `bg-active` | the soft tint and its steps | `<tone>-surface`, `-hover`, `-active` (neutral: rgba(42,28,0,.07), dark white 10%, with the hover and selected washes laid over it) | its words, 4.5:1 |
| `accent`, `on-accent` | the strong fill and the words on it | `<tone>-solid`, `fg-on-<tone>` (gray: warm 500 under white; neutral: the neutral solid) | 4.5:1 |
| `bg-translucent` | a ground that sits on any ground: a Board column | `bg` at 50%, see-through (neutral: the default ink at 3%) | — (the words on it are the column's) |
| `border-translucent` | a ring on a tinted ground | `text` at 10%: a Board card's ring at the default Cards stroke | — (decorative) |

Blue is `info`, green `success`, orange `warning`, yellow `caution`, red `danger`, purple `discovery`; pink, gray and
brown are label tones of their own. So the roles move with Tone tint, Tone contrast and Status colours as the tones do.
A mark that stands alone takes `icon`, never `accent`: on white a yellow or orange fill sits under 3:1, and the accent is
for a fill its own words identify. Data series stay `--area-series-<n>` (below); a chart colours by a label hue only
when the data is a label.

**Change words have their own inks** (components audit D6, 2026-11-07; Governance § 4, "Change words"):
`--area-fg-change-added` (success), `-modified` (warning), `-deleted` (danger), `-untracked` and `-renamed` (info, the
nearest hue to the cyan Cursor's editor gives them; git's letter tells the two apart). Tree view's status letter, a
Tab's label and Edit summary's counts read them; Diff and Code block keep their line tints. `unseen` (changed since it
was last looked at) is a state apart: a 6 dot in `accent-indicator`, never a colour of the status.

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

- Text has three inks (plan A3.2, owner 2026-11-11): default (`fg-default`) for what is read, muted (`fg-muted`) for
  what explains (a description, a header cell, a group label), and subtle (`fg-subtle`) for meta that must sit quieter
  than a description: a placeholder (`fg-placeholder` is the subtle ink), a menu's shortcut, a timestamp, an empty
  value, line numbers; never a description. All three are text and keep 4.5:1 on every ground they sit on (and the
  dark APCA content floor, Lc 60), so subtle is a narrow step: solved on the deepest ground's hover fill, it is a hair
  off muted in light at Layer contrast 50 (#696969 against #646464), and in dark at the defaults the APCA floor leaves
  no room under muted, so it is muted's #b9b9b9 there (a step appears on lighter dark grounds). Dark muted steps back
  from #c5c5c5 (1.49 off the default ink) to #b9b9b9 (1.70), the darkest grey the APCA floor allows on the fills it
  sits on (plan A3.1); light keeps its 2.5. Disabled ink (`fg-disabled`) is for disabled text only, a share of the way from its ground to muted, so
  it follows the ground and the cast. An unselected option in any selection control and a bar's inactive items read
  muted (plan A3.3); a ghost Button keeps its quieter ink only as a Button.
- **Tone colours the mark, never the words** (plan A3.4): a status glyph reads `fg-<tone>-mark` (Alert, Toast, Turn
  notice, Message, Attachment, File upload); a surface's title and link keep the default ink in every tone.
- **One weight table** (plan A9.5, 2026-11-11; the type skill and the `typography.ts` header quote it):
  - **Regular** (`weight-regular`, the Regular weight setting: 400 by default, 400 to 470; `axes/regular-weight.ts`) is
    for everything read or operated: running text, descriptions, field
    labels, rows (Nav, Tree view, Menu items), a setting's, a choice's or a step's name, a label beside
    its value, a bar's name (Meter, Progress) and a figure (Card's value, Chart's number and centre).
    Count's soft label is Regular.
  - **500** (`weight-strong`) is for a surface's or a region's title (Popover, Dialog, Toast, Alert,
    Card, Panel bar, Calendar month, Section heading, Empty state, Link groups) and `title-xs` headings
    (a reply's h1 to h3); a label over a run of rows (below); an item's name on a picture or file card
    (Card, Asset card, Design card, File tile, a File upload row, Asset row, Board card; owner,
    2026-11-11, "500 in the default ink for every item name"); and labels on fills, tracks and static
    marks: Buttons on every variant (owner 2026-10-08, kept 2026-11-11), Segmented options, every Badge,
    Kbd, Citation, Indicator counts and Avatar initials; the selected Tab.
  - **600** (`weight-heading`) is for titles from `title-sm` up: a page's own title (Page header `md`
    and `lg`), a document's title and its larger headings. Never a row, a label or a control.
- **A label over a run of rows** (a menu group, a nav section, a list section, a shortcut group, an
  optgroup, a panel section, a table group, a picker's saved colours) is the rows' size at 500 in the
  muted ink, a row tall (owner, 2026-10-22). A title that names a whole surface or region is default ink.
- **A label beside its value is muted 400, and the value leads in the default ink** (plan A9.13):
  Description list's terms in every layout, Field's horizontal label, a Panel row's label, a filter's
  label. Layout moves a label, not its role. A bar's name is the UI line at 400 in the default ink, its
  value muted and tabular at the row's end (Meter, Progress).
- **Numbers that change in place, count or sit in a column take tabular figures** (plan A9.8): a numeric
  field sets them on the control (Number field, Time field, Date picker, OTP, Color field), Table on every
  cell, and Nav's, Tree view's and Menu's trailing counts, Timestamp, Slider's ends and the calendar's days
  too. **A figure** is the UI sans at 400, tabular: `title-lg` for a primary figure (Card's value, Chart's
  number), `title-sm` with its tracking for a secondary one (a donut's centre). A chart's ticks, legend and
  notes are the UI sans at `text-xs`, tabular, muted (owner, 2026-11-11, plan A9.11); mono only where
  characters align by column (code, hashes, a token's name). `cohesion.test.mjs` lists the parts.
- **Weight rises only with the default ink, with three written exceptions** (T5): a control's labels
  keep one weight in every state, so a set's options are 500 in the muted ink at rest (Segmented,
  Pagination, the width Tabs reserve); a mark draws its own weight in its own ink (Kbd, Citation, the
  neutral Badge); and group labels are 500 muted.
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

**Every state fill is a role** (plan B7.4, 2026-11-14; `state-paint.test.mjs` fails on a literal in a state rule). Two
presses need their own role. On a control fill (Segmented's and soft Toggle group's options on their track, Board's add
row) the press is `bg-pressed-track`: the pressed wash, capped where the muted label keeps 4.6:1 on that ground's
control fill (`layers.css`, solved from the fill's lightness; 8.5% black on the page's control fill at the defaults).
On a soft mark (Chip input) it is `bg-mark-pressed`, past `bg-mark-hover` by the Pressed fill's share. A changed line
is `bg-change-added` / `bg-change-deleted` in Diff and Code block alike. A literal stays only where no theme role can
hold (media chrome, colour gradients and the swatch palette's ring on arbitrary colours, a solid's dark press), and is
marked `spec`.

Three rules hold the table together (plan B7.1–B7.3, 2026-11-14; `cohesion.test.mjs` holds each):

- **Every hover plate has a pressed plate** one step past it: `bg-component-hover` presses to `bg-component-pressed`,
  `bg-hover` to `bg-pressed`, a glass or a band to its own firmer step. A control that answers the pointer with its
  ink or its edge alone (Nav's row actions, a field) has no plate to press.
- **Press shows on every item, selected and current included**: a click on the current page, the chosen value or an
  on toggle is still a click. The selected plate presses to the pressed plate; an on toggle in a tone steps back to
  its hover tint (a step past its firmest tint took the tone's words under 4.5:1); a chosen solid (a Calendar day, a solid toggle) presses a step past its hover, as every solid.
- **Open is pressed** ("Open"): a trigger whose popup shows (`aria-expanded="true"` with any `aria-haspopup`, a
  toggle tip that is pinned, a picker's `data-open`) holds its pressed paint until the popup closes, so the press that
  opened it stays on the control it came from. A plate-shaped trigger (a Button, a ghost picker, Combobox's toggle,
  Breadcrumb's ⋯) takes the pressed plate; a field-shaped one (Custom select, Date picker) keeps its fill with the
  hover edge, and never the focus edge, which stays a keyboard signal; a trigger that answers with its ink (Nav's row
  actions) keeps its pressed ink. Written once each: in `button.css` for every Button and in the field shell
  (`input.css`, "Press and open") for the pickers. A submenu's row is a list's highlight, not a trigger's press: it
  keeps the hover plate while its submenu shows.

**Selection when the list isn't focused** (components audit V15, 2026-11-07; the code editor's inactive selection): a
list with its own focus (List box, Tree view in navigation mode, a Table that holds a checkbox, link or focusable row)
paints its selected rows on the selected fill only while focus is inside it (`:focus-within`); while focus is elsewhere
they step back to the **hover plate**, so the list you're working in reads as the active one. No script and no new
token: the hover plate is already the quieter step on every ground, its words' contrast is asserted, and Hover fill
never goes below 25, so the quieter plate is never invisible (CONTRAST.md). At Selected fill 0 the two plates are one and
nothing changes. The place you are is not a selection: Nav's and Tree view's current page (`aria-current`) keep their
plate. A table with nothing to focus can't be the active list and keeps the firm plate. `cohesion.test.mjs` holds the
rule.

**Inactive** (components audit V2, 2026-11-07; Button, Menu item, Nav item): drawn as disabled (its parts at
`opacity-disabled`, no hover or press paint) but focusable and hoverable, with `aria-disabled` and its reason
(`inactiveText`) as its description: a Tooltip on Button and Nav item, the note under a Menu row's label. A Menu row
dims as a whole (plan B7.12): its words take the muted ink its note reads, at full strength, and its glyphs take the
opacity, so the note is never stronger than the label. The element
itself never takes the opacity, so its focus indicator (Button's and Nav's ring, a Menu row's plate) stays at full
strength. Which to use is [Writing › Disabled or inactive](WRITING.md#disabled-or-inactive).

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
  `selected-width` (Selected stroke, 2px by default): its own line in `stroke-selected`, topped up by
  an inset ring of `selected-width` minus that line, so selecting never moves anything. Under it, `selected-tint`
  (Selected tint, none by default). This supersedes choice cards' "darker, not thicker" rule (2026-09-28).
- **A chosen tile or swatch is drawn one way** (plan B7.6): a chosen cell in a grid of swatches or pictures (Color
  swatch picker, File grid, Custom select's picture grid, Asset and Design card) draws the same selected edge, from one
  recipe (`selection.css`: the part sets `--_selected-border`, its own line, and reads `--_selected-edge`, or
  `--_selected-ring` for an overlay over a picture). The ring takes the part's corner, so it stays concentric at every
  Corner. A grid of glyphs or words takes the plate (List box grid, Custom select's word grid); Alignment picker is a
  glyph grid and its chosen cell shows the mark in `fg-selection`. The Color swatch palette (cells flush on arbitrary
  colours) keeps its two-tone white and dark ring, the one line that reads on any colour. A chosen tile's focus ring
  sits outside it, so focus and selection differ by placement at every Selection colour. Card and choice cards draw the
  same arithmetic and move onto the recipe with their families.
- **Selection is a scope for the inks inside a chosen row** (plan B7.13): under a selected or current row of Menu,
  List box, Nav, Tree view and Table (each by its own state attribute) and any element marked `data-area-selected`,
  the quiet ink (`fg-quiet`) points at the row's default ink, so a ghost action in the row stands at full strength
  with its words, and no family writes a selected rule per part. Words keep `fg-default` and marks `fg-selection`: the
  plate alone says which row is chosen.
- **The focus ring** is `focus-width` in `focus-color`. Controls (a button, a chip, a field, a thumb) sit it at
  `focus-offset`; containers and text (a card, a tile, a toolbar, a link, a code line) at `focus-gap`, since a ring on
  their edge or their glyphs reads cramped. Rows, tabs and cells draw it inside, by their own width. Fields read the
  Focus ring setting's switches for their ring, edge recolour and halo. No component writes a literal offset or width.
  Where it sits, by part (plan A6.2; `cohesion.test.mjs` holds it, and a new ring joins a row):

  | Placement | Offset | Parts |
  |---|---|---|
  | Control | `focus-offset` | Button, Chip, Badge links and removes, Tag's remove, Toggletip, a field and its actions and steppers, Select and its pickers' triggers, Checkbox, Radio, Switch, Slider and Color picker thumbs, Segmented and Toggle group items, Pagination pages, Calendar days, Breadcrumb links (on their plate), Panel toggle, Chart |
  | Solid fill | `focus-solid-offset` | a solid Button (Split button's, Composer's send) and a solid Badge link: off by the gap, or under Inset inside one pixel in, in the fill's ink. A checked Checkbox or Radio and an on Switch take `focus-gap` |
  | Container or text | `focus-gap` | Card, Asset and Design cards, choice cards, Toolbar, Toaster, Table wrapper, Code block, Link, Mention, Citation, Abbreviation, Video player, Board card |
  | Row, tab or cell | inside, by its own width | Nav, Tree view, Accordion, Step, Token row, Table rows, Plan and Queue heads, Edit summary, Approval options, Prompt suggestions, List box grid, Time field segments, Board's add row, Scroll area, Tabs (on a part) |
  | Plate alone | none | Menu rows (active descendant) |

  One indicator per row: a ring or a plate, never both. Within a setting a ghost or plain control may draw its ring
  inside by its own edge, so it never overlaps a neighbour in a tight toolbar. A ring never sits flush on a solid fill of
  its own colour, and under Contrast More every ring is 3px and off by the gap ([Contrast](CONTRAST.md#focus)).

- **Solid fills** step one way: hover is further from the page, pressed one more
  (`--_solid-active` in `button.css`).
- **Hover changes one thing:** the plate, the edge or the underline. Ink and opacity stay
  fixed. Pointer hover sits under `@media (hover: hover)` so a tap leaves no stuck plate.
- **Hover-revealed content hides only where there is hover** (plan B7.11, 2026-11-14): row actions, a Card's
  overlay, Message's and Attachment's actions, a section's or a step's chevron, a drag handle. The rule that hides
  it (`opacity: 0`) sits inside `@media (hover: hover)`, so a touch screen, which cannot hover, always shows it and
  needs no rule of its own; focus inside the host shows it at once, and hidden it stays in the tab order (never
  `display: none` or `visibility: hidden`). Until 2026-11-14 half the reveals hid everywhere and showed again under
  a `hover: none` rule. `cohesion.test.mjs` and `tests/behaviour/suites/state.test.mjs` hold it.
- **Text in controls is not selectable** (`user-select: none` on every control's base
  rule), so repeated clicks never paint a selection. Fields, links in prose and editable
  text stay selectable.
- **Selected rows by job.**
  - Menus of commands and choices show a trailing check, and the plate is only the
    highlight. MenuItem takes `checked`, or `radio` for one of several.
  - Value pickers (Select, Combobox, Custom select, List box) show the value with the active plate and the check in
    `fg-selection` (plan B7.7, 2026-11-14; Select, Combobox and Custom select had shown the check alone since
    custom-select.md Q3). `data-selected` is their hook; native Select's is `:checked`. The plate outranks the
    highlight and gives way to the press.
- **Off states.**
  - One off-track grey, `edge-control`, for the Switch track and the Slider and Progress
    rails.
  - One glyph-edge grey, `edge-control-hover`, for Checkbox and Radio edges and the Slider
    thumb.
  - The Spinner track is its own ink at 25%.
- **Neutral soft marks** (Badge soft, Chip input, soft Count, soft Mention) sit on one translucent plate,
  `bg-mark`, so they stay visible on a hovered or selected row. Avatar and a selected Chip
  keep `bg-component-active`.
- **Quiet ink.** Icon actions (ghost icon Buttons, Message actions) use `fg-quiet`, the
  Button's 75% ink, as does a Step's verb (Cursor's 74%; the default ink once open). Text-like rows (prompt suggestions, Code block tabs) use `fg-muted`.
  Unselected options in a set (Segmented, Tabs) take the muted ink and the selected one the
  default ink.
- **Raised thumbs.** The Segmented thumb is the white surface in light and
  `bg-component-active` in dark, where the surface rung sits below the groove.
- **Disabled and read-only** (plan B7.8, B7.9, B7.10; `states.test.mjs`, and the behaviour suite `states` measures
  every ground and setting extreme). Disabled goes one way, by shape:
  - **A field-shaped box** (anything drawing the field shell: Input and the fields built on it, Number field, Select,
    Textarea, Custom select's and Date picker's triggers, Tag picker, OTP field) takes the shell's disabled paint
    (input.css, "Disabled and read-only"): its family's disabled fill (the soft fill), the faint edge (none on soft and
    ghost), and `fg-disabled` for the value and every part (icons, affixes, actions, unit, steppers, chevron,
    placeholder). It is never dimmed by opacity. At Edge contrast 0 the fill alone carries it.
  - **Everything else** dims by `opacity-disabled`: controls, rows, marks, cells and options. A Calendar day and a
    Select option count here, and so does a tag inside a disabled Tag picker. A focusable cell (an unavailable day)
    fades its parts, never itself, so its ring stays.
  - **A toned Button repaints instead of dimming** (B7.9). This covers a hued tone, and a neutral solid when Action is
    Accent. Dimmed, a blue or red button only reads as a lighter one that still looks available. Instead the fill goes
    to the variant's neutral fill, the edge to the neutral edge and the ink to `fg-disabled`, at full opacity
    (`--_toned`, button.css). A Split button pair dims once, and only when it is neutral.
  - **A label outside the control and every description keep their inks.** Field's and Setting row's label step to
    muted; a description is the reason and keeps 4.5:1.
  - **Read-only is not disabled.** The value keeps the field's ink and the text target. Every state keeps its paint: a
    checked box and a chosen card keep their selected edge and tint. It stays focusable and is announced
    (`aria-readonly`, or native `readonly`), and it drops only the pointer's paint (hover, press, give) and the
    cursor.
  - **A read-only field takes one cue: its fill sits one step deeper than the editable rest.** An outline field goes
    on the soft fill, a soft field on the soft fill's hover step, and a ghost trigger on the soft fill. The cue is a
    fill, so it survives Edge contrast 0 and Fields stroke 0. The faint edge the plan named equals the control edge
    since Phase 1. Measured: at least 1.02:1 from the editable fill on every declared ground; the thinnest is an
    outline field on the recessed ground in dark at Layer contrast 100.
  - **Forced colours:** disabled is GrayText; read-only keeps the system text colour.
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
  - Dialog's close is a medium ghost Button (`control-md`: 30 at the default type 13, 26 at Compact).
  - Pills (Chip, Badge) use a concentric circle with a 12%-ink plate.
  - The API is `onDismiss` / `dismissLabel` everywhere.
- **Fields.**
  - **One field shell** (plan B3.1, 2026-11-14; `input.css`, "One field shell"). Input, Number field, Input group,
    Select, Textarea, Custom select's and Date picker's triggers, Tag picker's field and each OTP slot draw one shell, as
    every list draws one row. A family sets inputs on its root (the tier `--_height`, `--_radius`, `--_icon`, `--_gap`,
    `--_text`, `--_leading`; the paint `--_bg`, `--_border`, `--_border-hover`, `--_ink` from its own public seam
    `input-*`, `select-*` or `textarea-*`; the soft paint; the status inks; `--_field-pill`) and the shell computes the
    edge (`--_field-edge`: a state sets the variable, never `border-color`, so a seam or a nested field keeps its own),
    the corner (`--_field-shape`, the ladder corner on the height plus the Pills flag; Textarea never pills), the fill
    and lift, the tier's text, the focus ring, the status paint, and the disabled and read-only paint (plan B7.8, B7.10:
    a family sets only `--_bg-disabled`, `--_border-disabled` and `--_bg-read-only` where its seam or variant differs).
    `fields.test.mjs` fails a family that restates it.
  - Soft fields are flat: a fill, no shadow, the Fields group's edge at rest and the control edge under the pointer.
  - Outline fields rest on the Field shadow setting, which is 0 by default.
  - A group's seams are the field edge (`input-edge`), never a lighter line than the group's own.
  - A label above its control sits `ui-stack` over it (Field, Slider's top label); a Panel caption sits the panel's
    `ui-stack − 2`.
  - Every field action that clears draws `dismiss`; `dismiss-circle` is a status mark. No part of a field is drawn by the
    platform: Textarea's resize grip is two strokes in `input-chevron` kept inside the corner's curve.
  - One surface uses one field style: a Panel's rows are all soft.
- **Keycaps** are filled, not drawn: `bg-component-active`, no visible edge, the 24px box's
  corner, muted ink at 500.
  - Inside a Button the keycap is `currentColor` at 14% with the Button's ink, so it
    survives hover, press and selection.
  - In lists a shortcut is quiet: 12/16, 400, muted, and it takes a danger row's ink.
  - Escape is written "Esc".
  - A keycap set inside a plate takes the plate's corner less its inset (Approval's number square: 4 in a 10 plate,
    6 in), so the two curves agree.
- **List rows.**
  - Every icon row puts its label on one column, 8 inset + 16 icon + the row's icon-to-label gap `ui-cluster`: 32 at
    the default type 13, 30 at the app's Compact, 34 at Comfortable (owner 2026-11-11, plan B2.3; it was `gap-row`, 34
    and 36 at type 14). Menu, Command palette, Combobox, Custom select, Select options, List box, Nav and Tree view share
    it, and Tree view's level step is its chevron plus the same gap (22 / 24 / 26), so a child's icon sits under its
    parent's label.
  - A floating list is at least 160 wide (`--area-menu-min-inline-size`; was 224), and a list opened from a field is
    never narrower than the field.
  - Keyboard focus in menus is the plate alone (active descendant). Nav and Tree rows draw
    an inset ring.
  - A description sits in one of three ways, kept on purpose: under the label as a 12/16
    muted note (Menu), muted after the label (Command palette), or muted at the row's end
    (Combobox).
  - A list's empty, loading and no-results line is one part everywhere, `.area-menu__empty`: a muted line a row
    tall, its words on the glyph edge (plan B2.6; Combobox, Command palette, Composer menu and Custom select).
  - **One row table** (plan B2.1, 2026-11-13; `inset.css`, "One row table"; `rows.test.mjs` holds it). Every list of
    row plates (Menu and the lists on its rows, List box, Nav, Tree view, native Select's options) shares: the row
    `ui-row`, plates `ui-row-gap` (1) apart by gap; the corner `radius-row` on a region, `radius-list-row` in a floating
    list (the same unless the list's corner less its padding is smaller); one start column, the glyph edge
    `ui-row-inset` (8), for icons, pictures, headings and text-only rows; the label at glyph edge + icon slot +
    `ui-cluster`; row icons in `fg-muted` in every state, a danger row's in its red; a separator
    `round(6 − ui-dense)` from the plates (5 / 6 / 7 at type 13) with its ends on the plates' edges; a group break
    `gap-row`; a list with a picture reserves the picture's width in every row. At type 12 / 13 / 16 Default the
    rows are 28 / 30 / 36 and the label column 30 / 32 / 38.
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
| `shadow-lift` | A linked Card or an app tile under the pointer | Hover lift |
| `shadow-float` | Menu and everything that opens one, Popover and everything built on it, Select picker, Toast, Calendar and Color picker surfaces, floating Toolbar and Selection bar, Board card actions, Scroll to latest (one stack: Overlays, below) | Elevation |
| `shadow-modal` | Dialog, Confirm dialog, Drawer, Command palette | Elevation, doubled |
| `shadow-edge` | Listed first by every framed surface | Rest shadow (0 by default) |

- **Elevation is one number**, the Menu's shadow strength in percent: 0 (Flat) to 8, 8 by
  default (3 until 2026-11-05: menus read faint beside UI kit examples,
  [research](research/shadow-depth-2026-11-04.md)). The anchors are a light lift (3), a
  popover (5) and a full menu (8). Dark doubles every alpha.
- **In-flow controls rest flat.** Buttons, fields, Chip, Tag and content (Code block, Table,
  Alert, Accordion) take no lift by default; they rest on their edge and plate.
- **Every role is eight layer slots at every setting:** a lip, six soft layers and a
  highlight last, transparent where unused. Settings and hovers therefore interpolate layer
  by layer.
- **Never `none`.** Step 0 is transparent layers, never `none`. A role can sit in a
  `box-shadow` list beside a component's own layers (the Board card's tone ring), and `none`
  would invalidate the whole list.
- **Material paints never replace a shadow.** They fill `--_m-layers`, which a surface lists
  first. Every floating and modal surface draws one stack, `--_float-shadow` (layers, edge, role), from the shared
  layer, and `material.css` lists every one (Overlays, below); Tooltip is the written exception.
- **Contrast never strengthens a shadow.**
- **The edge does the separating at every step.** The Floating stroke group (`edge-floating`,
  5 by default: 12.5% of the text colour over the ground, light or dark; Strokes, below) frames
  every floating surface: Popover, Menu, Dialog, Toast, Command palette, the surface Calendar and
  Color picker, the floating Toolbar and Selection bar. Only a Material's frame reads
  `border-float` (#eeeeee in light, #4b4b4b in dark). A floating surface therefore stays
  distinct over another surface where its shadow no longer reads.
- **One edge per side, in each theme** (plan A7.1, 2026-11-11). In dark a role also draws a light rim, since a black
  shadow has nothing to darken on near black; the floating and modal roles draw it only where no frame is (Stroke
  width 0, or what a Hairline leaves), and the frame takes the rim's strength instead (the brighter of the group's
  amount and the rim's, 16% at Shadow 8). Tooltip's role draws no rim: its inset line takes the strength. So a dark
  menu's edge is one 1px line (`check:rendered`, `dark-floating-edge`, asserts one step), where it was a two-tone 2px
  edge.
- **In dark, floating and modal surfaces sit a step above what is under them** (plan A7.2, owner 2026-11-11): they paint
  the floating ground, `bg-float`, the lightest layer under them (the raised layer or a Card's tone, at least L 0.12)
  plus 0.036 (#0c0c0c on the near-black page at the defaults); the page never lightens. In light `bg-float` is the
  raised layer, as before. It is a declared ground (`layers.css`), so rows, fields and edges in a menu step from it.
- **Forced colours drop `box-shadow`.** `forced-colors.css` puts frames back at 1px and gives
  the floating Toolbar and Selection bar, whose edge is an inset shadow, an outline.
- **The dark Tooltip** stays a dark annotation (#282828 with a white inset edge, 5% or the tooltip role's rim
  strength if more: 8% at Shadow 8).

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

<!-- strokes:begin (generated by `npm run check:docs -w @area/desktop -- --write` from axes/stroke-groups.ts and packages/styles/src) -->
| Group | Amount | What it draws | Read in |
|---|---|---|---|
| Cards | 4 (10%) | The frame round cards, asset cards, file tiles, attachments, board cards and surfaces | `approval.css`, `asset-card.css`, `attachment.css`, `card.css`, `design-card.css`, `preview-frame.css`, `surface.css` |
| Blocks | 5 (12.5%) | The frame round code blocks, tables and preview frames in a page | `code-block.css`, `description-list.css`, `edit-summary.css`, `plan.css`, `queue.css`, `setting-row.css`, `table.css` |
| Callouts | 4 (10%) | The frame round an alert or notice in the flow | `alert.css` |
| Floating | 5 (12.5%) | The rim of menus, popovers, hover cards, toasts, dialogs, drawers and pickers | `popover.css`, `popup.css` |
| Regions | 3 (7.5%) | The seams between panels and the app's regions | `panel.css`, `splitter.css`, `titlebar.css` |
| Dividers | 4 (10%) | The rules between rows and sections: separators, table, list and accordion rows | `accordion.css`, `attachment.css`, `chart.css`, `code-block.css`, `command-palette.css`, `description-list.css`, `dialog.css`, `file-upload.css`, `inline-list.css`, `link-groups.css`, `menu.css`, `nav.css`, `overlay.css`, `plan.css`, `separator.css`, `setting-row.css`, `shortcut-list.css`, `step.css`, `table.css`, `tabs.css`, `timeline.css`, `toolbar.css`, `tree-view.css`, `turn-notice.css` |
| Fields | 5 (12.5%) | The edge of soft fields: inputs, selects, number fields, text areas, pickers | `approval.css`, `input.css` |
| Buttons | 3 (7.5%) | The edge of soft buttons, button groups, toggle groups and the Segmented track | `button-group.css`, `button.css`, `segmented.css`, `split-button.css` |
| Options | 4 (10%) | The edge of soft choice rows and choice cards | `choice.css` |
| Tracks | 3 (7.5%) | The edge of slider, switch, progress and meter troughs | `progress.css`, `slider.css`, `switch.css` |
| Tags | 4 (10%) | The edge of soft badges, counts, tags and keys | `badge.css`, `count.css`, `kbd.css`, `mention.css`, `tag.css` |
| Media | 2 (5%) | A hairline round avatars, swatches and pictures | `asset-card.css`, `avatar.css` |
<!-- strokes:end -->

Fixed, in no group: outline Button, Badge and Chip, outline fields, solid fills, ghost and toolbar buttons, rows, unchecked
Checkbox and Radio boxes, focus rings, selected edges, field state and disabled edges, inline Code, Composer. A soft Code
block stays fill only. Width still follows the job (above); a group sets only colour. The rungs below remain only for
what no group covers (read from `packages/styles/src`, 2026-11-11).

**Colour, lightest to firmest (the rungs outside the groups):**

| Role | Light | For |
|---|---|---|
| `border-decorative` | #f3 | Input group's frame and seams |
| `border-float` | #ee (dark #4b) | A Material's frame (`material.css`); floating frames read the Floating group |
| `border-card` | #ee | Board card's ring under increased contrast |
| `border-divider`, `edge-control` | #e2 | `border-divider`: Chart's baseline, Token row's code edge, the Tabs track (beside `edge-dividers`), a containerless Asset card's frame. `edge-control`: control and field edges, off tracks, Box model's border box |
| `border-faint` | #e2 | Disabled field edges (Input, Textarea, Number field, Select, Custom select, Date picker, Tag picker, OTP field, Composer, Input group) |
| `border-subtle` | #d4 | Box model's margin line |
| `edge-control-hover` | #d4 | Control edges on hover. At rest: Checkbox and Radio, Tree view's check, Slider and Color picker thumbs, Calendar tiles and its today ring |
| `edge-control-strong` | #b4 | A Checkbox, Radio, Slider thumb or selected Chip under the pointer |
| `stroke-control` | #83 | Breadcrumb separators; Switch's thumb ring under increased contrast |

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
- **A divider is the lightest line**, the Dividers group (`edge-dividers`, 3 by default: 7.5% of
  the text colour), unless it carries data or is an opt-in that asks for weight (owner: "dividers
  that are inset to have a very light subtle stroke by default"). Increased contrast still firms every line. Was: a standalone divider
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

- **The ladder stays derived** (owner, 2026-11-11, plan A8.1). At the default type 13 the controls are
  22 / 26 / 30 / 38 / 46 with rows 30; at the app's Compact 20 / 24 / 26 / 34 / 42 with rows 28. Heights are never
  snapped to a 4px ladder and the default density stays 32; a height stays the line plus twice its room, so cap
  centring stays exact.
- **Rows and composites are on the ladder** (plan A8.2). A height is a ladder token (`control-*`, `ui-row`) or a ladder
  token plus whole room steps (`+ ui-stack`, `+ 4` for a cell around a control), never a `+ 2px` literal: Calendar's
  day is `control-md` and its cell 4 more, Description list's rows and Board's add row are `ui-row`, Shortcut list's
  ruled rows `ui-row + ui-stack`, Token row `control-xs`. A selectable Table row (one holding a selection Checkbox) is a row of
  controls: sm `control-sm`, md `control-lg`, lg `control-xl`, the rule counted inside (md 34 / 38 / 42 at type 13); a
  plain Table row stays its text row, line + 2 × cell inset + the rule.
- **Gaps read whole steps; only insets keep the half step** (plan A1.1, 2026-11-11). A gap (the space between two
  siblings) reads `ui-gap-step`: `ui-stack`, `ui-cluster`, `gap-row`, `gap-section` or `N − 4 × ui-gap-step`, so at
  every type and density it lands on the 2px ladder (2 · 4 · 6 · 8 · 12 · 16 · 24). An inset (an edge to the content)
  keeps the half step `ui-dense` (Card's 7 media inset, the surface insets 10 / 14 at type 13). At type 13: `gap-row`
  8 / 12 / 16 at Compact / Default / Comfortable (it was 10 at the default). `cohesion.test.mjs` fails a gap that reads
  `ui-dense`.
- **Space between pieces reads a density role** (plan B8.2, 2026-11-14). A gap, padding or margin between two pieces
  of UI (and a private property named for one) reads `ui-stack`, `ui-cluster`, `gap-row`, `gap-section`,
  `inset-surface-*`, `inset-page`, the height ladder or a term built on them (`2 × ui-cluster`, `N − 4 × ui-gap-step`),
  so it moves with its peers at every type and density. A fixed value is only a mark, a hit area, a platform constant
  or a measured media size, and its line says "at every density"; joins of 2 and 4 (a joined set, a line's actions, a
  text pair) are fixed by rule. `packages/react/tests/density.test.mjs` reads the sources: the families moved are
  clean, the rest wait on a ratchet that may only fall, and it pins every moved value whole at type 12 to 16 and each
  density, unchanged at the default.
- **Three sibling-gap roles** (plan A1.2): a joined set (segments, row actions, a chip's parts) 2; actions in a header
  or a line of text 4; independent controls (a footer's buttons, a toolbar's, a page header's actions, stacked toasts)
  `ui-cluster` (6 / 8 / 10). Inside a mark, gaps are 2 or 4.
- **Section and page spaces are roles** (plan A1.4): `gap-section` is a section's space, two groups apart (24, Compact
  16; Stack's `section`), and `inset-page` the page's edge to its sections (32, Compact 24, Comfortable 40; the feed's
  margin). Neither is a new value: each names what Stack and the feed computed.
- **A container spaces its children by its gap** (plan A1.3). A pair that joins is its own group with its own gap
  (Dialog's heading grid), never a margin that undoes the parent's gap (`calc(4px − gap)`). `cohesion.test.mjs` lists
  the compensations still waiting for a group in React (Card's title join and its carousel under a header) and fails a
  new one.
- **Two text-list rhythms** (plan A1.5): a text list (links, references, footnotes) is its line + 4 apart (Link groups,
  Reference list: 22 at 13/18); a key-value list its line + 8 (Description list's columns: 26; plain Accordion items, 30
  at 15/22). Rows that are controls use the row ladder.

- **The type ramp** is Cursor's with Claude's reading step (owner, 2026-11-02: "make sure the type ramp is updated to
  match what cursor does", read from Cursor's bundle, `docs/research/type-presentation-2026-11-01`; then, beside Claude
  Code's chat, reading text "15/22 like Claude"). At type 13, four body steps and four titles:
  `text-xs` 11/14 (marks only: badges, counts, tags, keys, status letters, a chart's data labels, code in a small code
  block; plan A9.2: never a word that labels, explains, warns or locates), `text-sm` 12/16 (secondary set apart from what
  it explains: help, a count and messages under a control, a caption, a timestamp, a metadata line on its own),
  `text-base` 13/18 (every control, row, label and cell, and a line joined to a name; the UI line), `text-lg` 15/22
  (reading text, only where prose is written: a chat turn, a composer's field, a document, the feed's prose, a
  component's documentation; Claude's prose step), then `title-xs` 16/22, `title-sm`
  18/24, `title-md` 20/28, `title-lg` 26/30, `title-xl` 32/40, and display 52 / 67. Body text carries no tracking
  (plan A9.10); titles tighten by their own token. Code lines take `text-xs-code-leading`, the small step's line plus 2
  (11/16 at 13), which density never moves; every underline sits `underline-offset` (0.08em) under its text. Each moves with the Type setting (12 to 16): small
  the base less 2 (never under 10), secondary the base less 1, reading the base plus 2, titles in proportion
  (`axes/type-size.ts`, [type spec](specs/typography.md)). Before 2026-11-02 the base was `text-sm` and reading `text-md`
  (15/22 at 13, prose 24), with titles 15 / 19 / 22 / 30 and no secondary step; reading was Cursor's 14/22 for a day. A surface's own body (a
  Card's, a Dialog's or a Popover's description) is UI text, not secondary. So is an agent's work in a turn (owner,
  2026-11-02, "do the trackers need to be smaller?"): Step, Reasoning, Plan, Edit summary, Approval and Turn notice read
  at `text-base`, one size with ink for hierarchy, under the turn's `text-lg` prose (Cursor's cards 13 under a 14 reply).
- **A page has a title of its own, and its headings a weight of their own** (2026-11-11, the four product screens,
  `docs/research/product-recreations-2026-11-10`). `title-xl` is 2.5 times the base, 32/40 at 13 (30/38 to 40/48 across
  Type 12 to 16): a document's own title, the one step between the interface titles (26) and display (52).
  `weight-heading` is 600: titles from `title-sm` up, a page's own title and a document's title and headings, where
  `weight-strong` (500) sits too close to body text to read as a level. `title-xs` headings, labels, titles of surfaces
  and controls keep strong. A screen has three levels (plan A9.1): page > section > item, told apart by size and weight:
  Page header `md` `title-lg` 26/600 (`lg` `title-xl` 32/600), Section heading `title-xs` 16/500, a card's title 13/500
  at type 13; a reply's h1 to h3 are `title-xs` at 500 (Message).
- **A region reads as a region by its ground, and Layer contrast sets how far** (the same study). A product's sidebar or
  side bar is its chrome: mark the docked Panel `data-area-chrome` and `data-area-ground="recessed"` and name its fill
  (`--area-chrome-fill: var(--area-bg-subtle)`), as the Area app does. At Layer contrast 0 it is the page's color and only
  the seam separates it; from about 30 it reads as a tone in light, and 50 is the light default (since 2026-11-11). Dark
  stays 0: a near-black page leaves a tone step almost no room. A screen that wants
  the sidebar set apart sets Layer contrast, never a color of its own.
- **Text that opens or closes a block is read on its glyphs** (owner, 2026-11-04, Q-T2; `docs/research/kit-type-2026-11-04`):
  a gap above a block is measured to its first cap, below it to its last baseline, as to a frame's edge. Flowing text
  trims its first and last lines (`text-box`: Card, Message's reply, the feed's prose); a component whose first line is
  a row with an icon gives back the line's half-leading at its outer edge instead (`margin-block: calc((1cap - 1lh) / 2)`:
  Step, Timeline, plain Plan and Edit summary, Turn notice, Timestamp), so its icon stays centred. A control row (a
  button, a picker) is a frame, not a line: it keeps its box. `type-rhythm.test.mjs` holds the list.
- **Prose lines** (owner, 2026-10-30; `docs/research/vertical-rhythm-2026-10-30`). Prose that runs past two lines,
  where the eye has to find the next line (a chat turn, documentation and spec prose), takes the prose leading: the first
  value on the 2px leading ramp at or above 1.5 × the size, the line spacing WCAG 1.4.8 asks of paragraphs and 1.4.12
  requires text to survive. 12/18, 13/20, 14/22, 15/24, 16/24 (`text-sm-prose-leading`, `text-base-prose-leading`,
  `text-lg-prose-leading`; the type axis, `proseLeading` in `axes/type-size.ts`). Reading text (`text-lg`) keeps one
  line, running or not, the UI ratio's: Message's turn is 15/22 at type 13, Claude's prose (1.47, a hair under 1.5, as
  Claude's; it was 15/24, then Cursor's 14/22). Parts set in
  prose keep their UI lines and state them (Step, Plan, Edit summary, Turn notice, a small table); a md or lg Table sets its cells on the prose line, so a wrapped description reads as prose, with a block inset that puts the text as far from the rules as from the frame (2026-10-31); `cohesion.test.mjs` checks
  both.
- **Every scope restarts at the body role.** Below the page root, an element with its own Type sets `text-lg` for
  text set straight in it (THEMING.md, CSS inheritance). A component that holds free text states its own role
  (Card and Surface use `text-base`); inline parts (Link, Code, Abbreviation) inherit the text they sit in. A part that
  stands on its own (a row, a cell) takes a ramp size, never inline Code's 0.875em.
- **Text pairs** (owner, 2026-09-28 on Card, 2026-10-22 for every family; measured in
  `docs/research/text-gaps-2026-10-22`). Gaps are read on the glyphs (baseline to cap), and each kind of pair has one:
  - **a surface's title is the size of the text it heads** (2026-11-06 balance pass, owner: "Keep it", then "4 is right";
    `docs/research/title-balance-2026-11-06`): 13/18 over 13/18 at type 13, told apart by weight (500) and ink (default
    over muted), never by size, and its copy stands **one step (4) off** it: 12.8 baseline to cap beside the copy's own
    8.8 (11.7 over a 12/16 line). Card, Dialog, Confirm dialog, Drawer, Popover, Alert, Toast, Approval and Empty state
    `sm` follow it (Cursor's confirm: its title 4 over its message). Confirm dialog's default-ink description is the one
    written exception: a surface whose copy is its only body. Joined on the copy's line (the pass's first try) the
    title read as the paragraph's first line (owner: "the space between the title and the copy still doesnt look right");
    before that, a 16 title over 13 text (1.23×, after the 2026-11-02 ramp moved title-xs from 15 to 16) joined at 10.0;
  - **an item's name and its line join** with no gap between the line boxes: a choice's, a group legend's and Switch's
    description, File tile's meta, a File upload row's size line, a Stepper step's description. **A joined line is the
    name's size in the muted ink** (owner, 2026-11-11, plan A9.3: a Switch read 13 over 12 beside a Setting row's 13 over
    13), so it reads as the name's second line: 8.8 baseline to cap at 13/18 (they sat 2 apart until 2026-11-06).
    `text-sm` is for text set apart from what it explains (help, a count and messages under a control, a caption, a
    timestamp, a metadata line on its own, Empty state `sm`'s copy); Menu's descriptions are its one written exception, a
    dense menu's 12 under 13;
  - **a heading over its text** (a title that heads a page or a region rather than names a component: Empty state `md`,
    Section heading, the app's section titles) takes a title step (`title-xs` and up) and the same step (4) off: 14.0
    baseline to cap over 13/18 text (Cursor's settings header: 17/21, 4, 13/18);
  - **never between**: a gap within about 2 of the text's own line gap, but not on it (the 10.0 above), reads as
    neither joined nor apart, so as no decision. A pair is joined on the line (a name) or a whole step off it (a title);
  - a label above its one control: `ui-stack` (6), Field's gap, so the label's baseline sits 11 above the control's edge;
  - a text group (a title or legend, with or without its description) above a **set** it introduces (options, rows,
    links, a list) stands one step further from it than the set's items stand from each other, on Area's ladder
    2 · 4 · 6 · 8 · 12 · 16 · 24 at every type and density (gaps read whole steps, below): options 8 apart take
    `gap-row` (Stack's group; 12, 8 at Compact), links 4 apart take 8. So the space inside the text group < the space between items < the space from the text to
    the items, and the heading reads as belonging to everything below it, not only the first item. Panel's heading is
    itself a row with Figma's 8 above and below, so it keeps its row rhythm;
  - a label beside its value: the label column is as wide as the longest label (shared by the rows, up to 40%), and
    the value starts `gap-row` (12 at the default, 8 at Compact) after it. A fixed column is for editable property rows only (Description list's
    `columns`, Notion's properties);
  - a text group to the block after it (a list, actions, a footer): the container's block gap (Card's 12).
  Weight and ink follow the part, not the family (Ink and weight, the weight table): a title that names a surface or
  heads a section is strong (500); the name of an item on a picture or file card is strong (500, owner 2026-11-11); the
  name of a control or a row (a choice, a step, a setting) is regular (400); supporting lines are muted and regular.
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
  - **A host's text rules style its own text, never a component set in it** (2026-11-04 kit pass). Message's list markers
    and a reply's heading size reached a Reference list's numbers and a chart Card's title inside the reply. A host that
    styles flowing text reaches its own children (`> h3`), or excludes Area's parts (`:not([class*="area-"])`); a
    component inside keeps its own type. Test: `cohesion.test.mjs` ("a host's text rules leave components alone").
- **Shared controls use the same tier's icon, text and gap tokens.**
- **Icon-to-label gap:**
  - 6 at sm, md and lg; 4 at xs, and at sm and md in Compact (lg keeps 6);
  - list rows use `ui-cluster` (6 / 8 / 10 at Compact / Default / Comfortable; owner 2026-11-11, plan B2.3), one
    value for Menu, Nav, Tree view, the palette and every picker's options;
  - hosts (Button group, Toolbar) never re-tier a child's gap, and layout spacing never
    reads the gap tokens.
- **Text-label marks** (Badge, Count, Tag, Kbd, Citation's pill, the Indicator count) use `mark-label-sm/md/lg`: the
  small text line plus 0, 4 and 8, 14 / 18 / 22 at type 13, the same at every density, so every size is distinct at
  every density (plan B5.1). See "One mark".
- **Fixed marks** (Presence, Color swatch) use `mark-sm/md/lg`
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
- **Targets** (plan A11.2; WCAG 2.5.8). Every interactive part under 24 on either axis owns one shared invisible
  target (inset.css): a box centred on it of max(its size, 24) on each axis, 44 under a coarse pointer, as Badge's and
  Tag's removes first did. Nothing visible moves. A target never takes a neighbour's: toward a neighbour target the
  axis keeps the part's own size or splits the gap. So a field's action, a chip's remove and breadcrumb parts are 24
  across and grow only in height under touch; joined items (Segmented, soft Toggle group, Split button's trigger,
  Number field's steppers) keep their width; Nav row actions 2 apart split the gap (a lone one takes 24); Steps in a
  group split their 4; Checkbox and Radio controls are 24 tall, 44 across under touch. Two pairs sat too close to give
  each 24 without a visible change, and take the derived one (owner, 2026-11-13): Number field's abutting steppers sit
  with their centres the target floor apart (a gap of 24 − (H − 8): 2 at the default md, 6 Compact md, 8 Compact sm,
  0 from a 32 field), each 24 across; Split button's trigger, which abuts its action, is never narrower than 24. Rows, grids, Button, Tabs, Calendar and Pagination keep their own size under touch; 44 there needs the touch
  size or more space. `tests/behaviour/suites/hit.test.mjs` probes every family at Compact, fine and coarse.

**Radius is one setting**: 0 (Sharp), 2, 4, 6, 8, 10 (default since 2026-10-25; was 8), 12, 14 or pill, the corner
of a 32 control ([audit](research/radius-audit-2026-10-03.md)). At the default type 13 the medium control is 30 and
draws 8 at Corner 10; that corner, the real medium control's at the current type and density, is `radius-step`
(plan A2.1, 2026-11-11), and every full-width row takes its own height's corner, as a Button of that height.

- **Shapes on the height ladder** take `max(radius-min, round(down, height × radius-factor, 2px))`:
  - the setting × height ÷ 32, in even pixels, never under 2;
  - at 8, that gives 24 → 6, 28 → 6, 32 → 8, 40 → 10, 48 → 12;
  - Sharp is square and Pill is round.
- **Controls read `radius-control-*`.** A component with its own height writes the same
  expression on it.
- **Surfaces** use the container ladder (0, 2, 4, 8, 12, 16, 20, 24; 24 at Pill), `radius-container`, 16 at the
  default Corner 10 (12 at Corner 8). Floating surfaces (Popover, Panel, Menu's frame) and modal ones (Dialog, Confirm
  dialog, Drawer) take it as it is.
  - Surface corners cap at 1.5 × the surface inset.
  - **A resting card never out-rounds a floating surface** (plan A2.3, owner 2026-11-11): Card and Surface are
    min(`radius-container`, 0.6 × their text inset at Corner 10, moving with the setting, rounded down to even pixels),
    10 at md, 8 at sm and 12 at lg at the default (18, 14 and 22 insets). Asset card and Design card take
    `radius-container`.
  - **Blocks share one corner**, `radius-container`: Table, Description list framed, Plan's steps box, a Figure's or
    Video player's picture, Panel, Calendar and Color picker. The chat cards (Plan, Queue, Edit summary, Approval,
    Composer, Code block, the person's bubble) share theirs (Frames, below).
- **A shell holding a control is concentric with it:** the control's corner plus its
  distance from the edge, scaled by `radius-concentric` (0 at Sharp). This covers Composer,
  Message, Prompt suggestions, Toolbar and the Segmented track. A button set into a corner
  takes that corner less its distance from the edges (Bars and corner controls, below).
- **A picture in a choice card is one of two kinds** (owner 2026-10-26, Radio and Checkbox `preview`, `media`,
  `media-row`). A picture with its own ground (a screen, a photo) fills the picture slot, 8px inside the card's edge,
  its corner the card's less the 8 (6 clear inside a chosen card's 2px stroke, which is drawn inside). An illustration with no ground (a window, a component) has no frame: the card's
  inset on its outer sides, the card's content after it at that same inset, its size what the card leaves.
- **Nested radius** is `max(min(radius-floor, own corner), outer − inset)`, where
  `radius-floor` is min(4, setting). Only Sharp is square anywhere. Insets are the padding;
  a surface's 1px border is left out (a floating list's padding is counted inside its edge, plan B6.4; Overlays, below). A **frame nested in a frame** stops at a row's corner instead (Frames, below).
  Composed screens get it from **Surface**: each Surface's corner is the parent Surface's
  corner less that Surface's inset, never under a row's, while Card's picture takes Card's corner less its inset, floored; its layer steps from its parent (`surface`
  raised, `soft` recessed), with one edge per boundary. **Stack** spaces children by role
  (related, group, section) and never wider than the inset of the Surface it sits in
  ([Surface](specs/surface.md), [Stack](specs/stack.md)).
- **Rows in floating lists** (Menu, Context menu, Command palette) use
  `radius-list-row`: the surface less its inset, no rounder than `radius-row`, so a full-width row takes its height's
  corner in a list or out of one (plan A2.1): a 30 row is 8 at the default in a menu, a Nav and a medium Button
  alike, and a pill only at Pill. The list uses `radius-list` (rows + its 4 padding, 12 at the default; the overlay
  corner equation, Overlays below). Accordion's trigger,
  Step's row and Description list's "more" are rows too. Standalone rows (Nav, Tree view)
  use `radius-row`.
- **A list opened from a field** (Select, Custom select, Combobox, Tag picker) takes the field's
  corner: its rows are the field's corner (short of a pill before Pill), the list 4 rounder, or
  the rows' own corner more below 4, so it reads as the field's own list and goes square with it
  (owner 2026-10-23; Notion: field 6, menu 10, rows 6). It re-points `radius-list-row` on the list, and the list's
  corner follows by the overlay corner equation (`popup.css`; Overlays, below).
- **Bars and keycaps.** A one-line bar (Alert banner, Toast) and Tooltip take the large
  control corner. Multiline ones are surfaces. Kbd takes its own height times the factor to the nearest pixel (6 on
  an 18 or 20, 5 on a 16 at the default; owner, round 75), 2 short of a pill until Pill; Stepper's marker, Kbd's md
  keycap, takes the same on its own height.
- **Only public roles.** A component's corner reads `radius-control-*`, `-container`, `-row`, `-list(-row)`,
  `-small`, `-full`, `-floor`, `-min`, or the shared corner expression on its own height; never `radius-surface`, the
  setting's step, a px literal or a rounding of its own (`cohesion.test.mjs` lists the few corners with a reason of
  their own).
- **Option rows are bars.** A Radio or Checkbox `card` or `soft` option in the row or list layout takes the
  ladder's corner for its one-line height (inset and edge twice, plus the control's box), never rounder than a
  surface, and a pill only at Pill: a 34 row is 10 at corner 10, 12 at 12 (owner 2026-10-30; it took the surface
  corner, so 16 or 20 made a 34 row a pill). A caption makes it taller, not rounder. Tile, preview and media options
  are pictures in a card and keep the surface corner.
- **Pills are a set** (`data-area-pills`), not a radius.
  - By default Badge, Chip, Count, Switch and Avatar are pills, and Button, fields and
    Segmented follow the radius.
  - A component's corner is `max(corner, --area-pill-<id> × radius-full)`: while the set lists it, a pill is
    `radius-full` itself, one value, never the corner plus full (2026-11-14). A corner derived from it (a thumb, a
    swatch) lists the flag again, so it is a pill too. `twins.test.mjs` fails a corner that adds the flag × full.
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
  and its children restate every edge role and every token that reads one (`cohesion.test.mjs`). At Layers 0 (the
  default) only what sits on a well (a Table header) moves; above it, what sits on the recessed layer (a sidebar, a
  soft Surface, a preview choice card) and an Asset card's tile moves too.
- **A fill paints the well, a region paints the recessed layer** (2026-11-01). `bg-subtle` is the recessed layer, a
  region's tone (a sidebar), and at Layer contrast 0 it is the page: Flat means one tone. A fill that is drawn to be
  seen (a Table header and striped rows, Box model's margin, an image well in Asset row, File tile and Preview frame,
  Attachment, a diff's fold, inline code and Token) paints `bg-well`: the recessed tone, never closer to the page than
  the page's own control fill (#f9f9f9 light, #161616 dark at Layers 0; the recessed tone from Layers 50 in light).
  They had painted `bg-subtle` or the 1.03:1 `bg-stripe` and vanished at the default
  (docs/research/color-system-2026-11-01). The `well` ground re-points the control fills, the press and the edges like
  every other ground. A soft Surface, a preview choice card and Plan's steps are soft regions and stay recessed: Flat
  keeps them flat (owner, 2026-10-29; confirmed 2026-11-01).
- **A component that paints a ground declares it.** When a component's own CSS paints
  `bg-surface` or `bg-code` (raised), `bg-subtle` (recessed), `bg-well` (well) or `bg-page` under anything
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

### Frames

One frame recipe (`packages/styles/src/components/surface.css`, plan B1.1–B1.4, 2026-11-13). Every card-like frame
(Card, Surface, Asset card, Design card, Figure's and Video player's pictures, Table, Description list, Board column,
Panel, Calendar, Color picker and the chat cards) reads it, so a frame added later lands on the same geometry at every
Type, Density and Corner. A family sets only its inputs (`--_fr-inset`, its text inset from the outer edge with the
edge counted once; `--_fr-mat`, where its parts sit; `--_fr-held`, the corner of what it holds) and reads the outputs.

- **The inset ladder**, Card's and Surface's: text inset sm 14 · md 18 · lg 22, media mat 5 · 7 · 10, gap between blocks
  12 · 16 · 20 at the default type 13 (each its type-14 value less the Compact difference times `ui-dense`).
- **Three corner roles.** *block*: `radius-container`, a region, a block or a picture standing alone. *card*: a resting
  card that holds text at its inset, 0.6 × the inset at Corner 10 and moving with the setting, capped at the container.
  *around*: a frame drawn around what it holds, the held corner plus the mat (concentric), capped at the container.
- **Chat cards** (plan B1.3) are one card: the around corner over the medium control at the bar inset, 16 at the
  default (14 at Compact and type 12, 0 at Sharp); a card of rows holds them 4 from its outer edge so their words and
  the head's title start 12 in; the head is one row (`ui-row`) and the title is the text's size, strong, default ink.
- **Nested frames** take max(min(`radius-row`, outer), outer − mat), to even pixels: a Surface in a Card, a Panel or
  a Surface is a row's 8 at the default, never the floor's 4 (VC19), never rounder than the frame round it. A picture
  in a frame stays concentric to `radius-floor` (Card's picture keeps its 4).
- **The title pair** is the text's size, strong, over its description in the muted ink, 4 apart: Card's parts, which a
  Surface uses too.
- **The item name** (plan B1.2) of what a picture card shows (Card's title, Asset card's, Design card's, File tile's, a
  Board card's) is one part: the text's size, strong, default ink. Under a picture with no frame round both, its line
  sits 8 below the picture and starts on its edge; inside a frame it sits on the frame's text inset. A caption is not
  a name: Figure's stays the small text, muted.
- **A text-only Card's bottom** (plan B1.4): the line that ends the card ends on its baseline less a fixed 2 allowance,
  16 from the edge at md against the cap 18 from the top; a group's last line keeps its descent.
- **One frame prop**, `variant`: `surface` (the frame), `soft` (a fill, no edge), `plain` (no paint). Description list's
  `framed`, Settings group's `framed` and Checkbox's and Radio's `card` are deprecated aliases of `surface`. Asset card's
  `container` stays its own prop: it names what the card is made of (a frame in a card, one surface, no card), not its
  paint (asset-card.md). Toolbar, Attachment and one-line option rows keep their own corners, each for a stated reason
  (their specs: a pill bar, a button's corner, a bar's ladder corner).
- **Content kind is `kind`**, not `layout` (Asset card, Design card; `layout` stays a deprecated alias on Design card).

### Bars and corner controls

Four shared parts in `packages/styles/src/inset.css` (plan B4.1–B4.4, 2026-11-14). A family sets only their inputs;
`packages/react/tests/bars.test.mjs` resolves each at every Type, Density and Corner and fails a family that restates one.

- **Two header bars**, each built from the control it holds, plus the width of the rule it draws (0 when it draws
  none), so the room round its controls is the same with or without the rule:
  - *region bar*: the small control with 7 above and below, `control-sm + 14`: 38 · 40 · 44 at type 13 Compact ·
    Default · Comfortable (38 at type 12, 46 at type 16). A region's own header: a window bar, a small Titlebar, a
    Board column's header, a Color picker's header.
  - *tool bar*: the medium control with the cluster space above and below, `control-md + 2 × ui-cluster`: 38 · 46 · 54
    (36 · 40 · 40 at type 12, 56 · 56 · 64 at type 16). A surface's working bar: Panel's md bar, a md Titlebar, the
    Command palette's search (and its rule), a Toolbar surface (md).
  A small Panel keeps its own bar, the small row with `ui-stack` round it and a rule's room (33 · 39 · 47). A Menu's
  header and footer are not bars: they are regions of the list and hold rows at its inset. Under a Panel's bar the
  first section's heading takes no air above it.
- **A corner control** (a close, a dismiss, the last end action, a row's actions, a calendar's steps, a code block's
  copy) sits evenly in its corner, as far from the side as from the top, and is concentric with the corner it sits in:
  `min(H / 2, max(min(radius-floor, own), corner − distance × concentric))`, a Pills flag keeping it round and Corner
  Pill keeping every control's round corner. The surface publishes its corner (`--_cc-corner`) and its inset
  (`--_cc-inset`); a ghost close puts its glyph on the inset, so its plate stands out by (H − icon) / 2; a bar of fixed
  height states where it puts the control (`--_cc-at`). A square surface (a side Drawer, a flush Panel, Alert or Code
  block) leaves the control its own corner. At the defaults: a bare Popover close 7 in, 9;
  Toast's and Alert's end control 5 in, 5 in a one-line 10 and 11 in a titled 16; Calendar's steps 10 in, 6; a Queue
  or Edit summary row's actions 2 in, 6 in 8; Edit summary's head 3 in, 13; Panel's bar action 9 in (medium) or 11
  (small), 7 or 5; Color picker's header control 8 in, 8; Code block's copy 5 in, 11 (floating 9 in, 7).
- **One named exception: a corner control beside a title** (Dialog's and Drawer's close, a titled Popover's close; plan
  B6.5, 2026-11-14). The title's cap sits on the surface inset with or without the control, one text grid on every
  surface, so the control follows the title: centred vertically on the title's cap ((1cap − H) / 2 above and below, whole
  pixels) and its glyph on the side column (the edge ghost rule). It is not equidistant, and its corner is taken from the
  nearer of its two distances (`--_cc-near`), so it stays concentric where it is closest, never past H / 2. Dialog's close
  at Default: 6 from the top and 10 / 9 / 8 from the side at type 12 / 13 / 16 (4 from the top at 16), corner 10 / 10 /
  12 in 16 at Corner 10, 0 at Sharp, 14 / 14 / 18 at Pill. A titled Popover's close: 4 from the top (2 at type 16), 8 /
  7 / 6 from the side, corner 12 / 12 / 14 in 16. Placing the title on an equidistant close's centre instead put the cap
  3–4 below the inset at every density and moved it as the close came and went (tried and reversed 2026-11-14).
- **Edge ghost buttons.** A ghost Button at a column's or a surface's edge shows no plate at rest, so it pulls out by
  its gutter until what is seen sits on the column: an icon-only one by (H − icon) / 2 (7 for the md 30), a labelled one
  by its text side. A soft, solid or outline Button keeps its plate on the column. `align="start" | "end"` applies it;
  Card's header action and Message's actions use it.
- **One collapsible head** for the chat cards that fold (Plan, Queue): a row tall, the title the text's size, strong,
  default ink, cut short; the chevron 4 after the title (as Step's and Reasoning's lines); a count or status at the end
  in the small muted text. Edit summary's and Approval's heads are the same row without a chevron.

### Overlays

Every floating and modal surface is one recipe in the shared layer (`popup.css`, plan B6, 2026-11-14): its frame, its
shadow stack, its corner from what it holds, its padding and its block gap. A family sets only its inputs (private
properties: `--_elevation`, `--_block-inset`, `--_list-pad`) and never restates the frame or a lift; `popups.test.mjs`
fails one that does.

- **One frame and one shadow stack.** The frame is one edge (the Floating group's `edge-floating`), the floating ground
  (`bg-float`) and the default ink. The stack is `--_float-shadow`: a material's layers, the Rest shadow's edge
  (`shadow-edge`), then the role, `shadow-float`, or `shadow-modal` over a scrim (Dialog, Confirm dialog, Drawer,
  Command palette). Every term is a setting's, so Elevation, the shadow controls, the material and the theme move every
  surface together. The surfaces: Menu and every list opened from a control or a field, Context menu, Popover and
  everything built on it (Hover card, the Date picker and Filter bar popovers), Toast, Dialog, Drawer, Command palette,
  the surface Calendar and Color picker, Select's native picker, and Scroll to latest (a floating Button: the stack
  alone). The floating bars (Toolbar's surface, the floating Selection bar and Titlebar) take the same stack and ground
  with the same edge drawn inside (`--_float-frame`, an inset ring, so a bar's inset counts no border). `material.css` lists every one in its overlays group, the glass over `bg-float`. **Tooltip is the written
  exception**: an inverse annotation on its own role (`shadow-tooltip`), its edge an inset line, no material.
- **Overlay corners: one equation.** A surface that holds rows is its rows' corner plus the padding they sit in:
  `corner = row + (pad − max(0, 4 − row)) × radius-concentric` (below a 4 corner it adds the rows' own corner, so it
  stays at most twice them). Which side is given depends on the role:

  | Role | Surfaces | Given | Follows |
  |---|---|---|---|
  | List | Menu, Context menu, Combobox, Custom select, Tag picker, Select's picker, a menu opened from a control (Calendar's caption, Zoom control) | the padding, 4 | the corner, `radius-list` (rows + 4) |
  | Modal holding a list | Command palette | the corner, `radius-container` | the padding, container − rows, never under 4 |
  | Panel | Popover, Hover card, the surface Calendar and Color picker, a titled Toast | the corner, `radius-container` | free content at the inset |
  | Modal | Dialog, Confirm dialog, Drawer | the corner, `radius-container` | free content at the inset |
  | Bar | a one-line Toast or Alert | `radius-control-lg` | the controls at the bar's corner inset |

  A field's list takes the field's corner for its rows, and its own corner follows by the same equation. The table at
  type 13 (rows / list / palette padding / palette / panel):

  | | Corner 0 | Corner 10 | Corner 14 | Pill |
  |---|---|---|---|---|
  | Compact (28) | 0 / 0 / 4 / 0 / 0 | 8 / 12 / 8 / 16 / 16 | 12 / 16 / 6 / 18 / 18 | 14 / 18 / 4 / 18 / 18 |
  | Default (32) | 0 / 0 / 4 / 0 / 0 | 8 / 12 / 8 / 16 / 16 | 12 / 16 / 8 / 20 / 20 | 15 / 19 / 5 / 20 / 20 |
  | Comfortable (36) | 0 / 0 / 4 / 0 / 0 | 10 / 14 / 6 / 16 / 16 | 14 / 18 / 10 / 24 / 24 | 17 / 21 / 7 / 24 / 24 |

  Every value is a whole pixel at type 12 to 16 and every density (`AREA_OVERLAY_TABLE=1 node --test
  packages/react/tests/popups.test.mjs` prints the sweep). A list is rounder than the container only at Corner 2 (4
  round 2 rows, the container 2). Overlays expose their widths: `--area-popover-inline-size`, `--area-dialog-inline-size`
  (the default size; a size class still sets its own), `--area-confirm-dialog-inline-size`, `--area-drawer-inline-size`,
  `--area-command-palette-inline-size`, `--area-toast-inline-size`, `--area-menu-min-inline-size`.
- **A floating list's padding is counted inside its edge** (plan B6.4, owner 2026-11-13: kept and written). Menu, Context
  menu, Command palette's list, Select's picker and the field lists pad 4 inside their 1px edge (rows 5 from the outer
  edge at the default stroke), and the corner adds the padding alone, so it stays even at every stroke width (counting
  the edge made it 7). Every other surface counts its edge once in its inset: Popover 12, Dialog and Drawer 16, Toast 10
  from the outer edge.
- **A surface's block gap never exceeds its inset** (plan B6.2): header, body and footer stand `min(inset-surface-md,
  the surface's own inset)` apart: Popover 12 at every density, Dialog and Drawer 16 (12 at Compact). A scrolled body's
  rule sits in the middle of that gap.
- **Overlay footers** (plan B6.5): every footer pairs a soft neutral secondary (Cancel) with a solid primary, or a soft
  danger for an action that cannot be undone. A footer's text Buttons are at least 2.25 × their height (68 on a 30
  Button, rounded up to a whole pixel), so OK is never narrower than Cancel beside it. Approval's way on (Back, Skip,
  Continue) is the same pair in a chat card and takes the same minimum. `popups.test.mjs` reads every Dialog, Drawer and
  Popover footer in the app's sources for a Cancel that is not soft neutral.
- **A title's cap sits on the inset, with or without a close** (plan B6.5): Dialog and Drawer 16, Popover 12, one text
  grid on every surface; the close beside it centres on the cap with its glyph on the side column (Bars and corner
  controls, "a corner control beside a title"). The group's last line ends on its baseline. The description is muted; Confirm dialog's default-ink description is the written
  exception (its only body).
- **Scrollers** (plan B6.6): every scrolling region is a Scroll area (menus, field lists, the palette's list, Dialog's
  and Drawer's bodies, Panel's body) or, where it scrolls itself (Textarea, Code block, a Table's wrapper, the palette's
  preview, Select's native picker), a thin native bar in the same thumb (18% of the default ink). Inside a rounded
  frame the overlay bar's ends stand in by the corner less its 2 side inset (14 at a 16 corner), so a thumb is never cut
  by the curve. A body that can scroll further marks `data-scroll-more`, and Dialog and Drawer draw the scrolled rule over
  their footer while it is set, the mirror of the header's.
- **Alert and Toast agree** (plan B6.7): one inset (the sm surface inset, the icon as far from the top as from the side),
  one icon box, `ui-cluster` between icon, text and actions, the title strong in the default ink, `radius-control-lg` on
  one line and the container corner when titled, and one action placement: a wrapping row in which the text asks for its
  whole line beside the icon, so the actions wrap to a second row (end-aligned, `ui-cluster` under the text) only when
  the text no longer fits beside them, and the text is never cut to make room. The close sits out of the row in the top
  corner. No width query moves anything (`tests/behaviour/suites/wrap.test.mjs`).

## Optical insets

`packages/styles/src/inset.css` is the shared implementation.

- **Icons use full square slots**, not path bounds. All text uses one cap-to-baseline
  reference, with room for accents and descenders. Never nudge a glyph or a word. Every text
  slot in a centred row takes that reference, the second text too (a description, a step
  count): one trimmed and one not part their baselines by a fraction of a pixel.
- **Outer inset is `(H − B) / 2`** for backplate height H and edge-item reference height B.
  CSS padding subtracts the border once. Calculate leading and trailing ends separately:
  `outer inset = border + shell padding + slot inset`.
- **Every derived inset lands on a whole pixel** (plan A11.1, 2026-11-11): it goes through `round(nearest, …, 1px)`,
  so text starts on the pixel grid (10, not 10.38, for a cap-centred side in a 30 row). A cap-centred slot joins
  inset.css's list, or rounds as it does; a content-sized card whose trimmed text sums to a fraction rounds its height up
  (`calc-size(auto, round(up, size, 1px))`, as Dialog and the choice cards). `cohesion.test.mjs` fails a padding that
  reads `1cap` outside `round()`. A cap centred vertically in a row stays on its exact centre: the vertical cap rule
  (0.1 px) outranks the grid there.
- **Glyphs draw at native sizes** (plan A11.3): a glyph's box reads an `icon-*` token or a native size (16, 20, 24, 32;
  the 12 and 10 cuts), and a figure that scales its glyph snaps to the nearest one (File page's 32 at 96, was 30).
- **Nested boxes own their insets.** Swatches, dots, avatars and nested controls use their
  own boxes. A parent reserves an action button's box, and that button owns its icon inset.
  Never size the action to its icon.
- **Multiline content aligns to the first line.** An icon gets equal top and leading insets
  and room below; never centre it against the whole paragraph. A leading glyph sits in a box one first line tall,
  `align-self: flex-start`, the glyph centred in it (the box technique; plan B2.4): Menu's two-line rows, Alert, Toast,
  Card's list, Board, Plan, Queue, Accordion, Attachment. A picker row's trailing check stays centred on the row.
- **One centring model for one line of text** (plan B2.2, 2026-11-13; `inset.css`, "One centring model"). A one-line
  label or value in a control, row or tab centres its cap: (H − 1cap) / 2 from each edge, the vertical twin of the
  side rule. The text part is trimmed to cap and baseline in one of three forms: a cap slot in a centred row (0.25em
  of paint room), a line slot in a content-sized plate (its line given back, `(1lh − 1cap) / 2`, so the plate keeps its
  height: Tooltip, a Setting row's one line, Panel's row label) or a text box that is its own box (a page number). Trim
  does nothing on a flex or grid container, so a label that stacks parts trims an inner text part (Tabs' `__text`).
  Untrimmed, a centred line box puts the cap 0.26 / 0.62 / 0.03 / 0.33 / 0.68 high at type 12 to 16. A control in a row
  keeps the row's height and centre: its target grows by an out-of-flow hit area, never by layout (Switch, a
  label-less Checkbox; plan B2.5).
- **Matching tiers.** Use matching tier icon, text and gap tokens. Menu, Nav and message
  content use medium UI type; supporting text uses at least small UI type.
- **Marks on one line** (owner, 2026-11-07). A Count and a Badge of the same size share one
  height (`mark-label-*`), one text size (`control-xs`), one shape (both on the Pills list by
  default, or neither) and one text side: `(H − 6) / 2` from the outer edge, edge counted
  once, 4 / 6 / 8 at 14 / 18 / 22 (about 0.3 of the height, as GitLab's and Fluent's pills and
  Area's Tag). Tag and Kbd take the same mark text at every size and density (owner, 2026-11-11, plans B5.2 and A9.9:
  a mark's text follows its size prop, never density). They differ only in paint (a status carries its tone, a count stays neutral),
  weight (status 500, count 400) and the status mark. A one-character count drops its sides,
  so it is a circle as a pill. Count, Badge and Tag centre their cap on one whole-pixel
  baseline, `edge + round((H − 2 · edge + 1cap) / 2)` from the plate's top, so marks of one
  height and text draw their words on the same pixel row at every type and density (owner,
  2026-11-07; Tag dropped the optical lift that Citation keeps for lowercase site names). In a heading or a name, every mark is centred on the label's
  cap and follows what precedes it by one space and 2 (the app's `.studio-count`).
  `cohesion.test.mjs` guards it; docs/research/count-badge-2026-11-07 has the survey.
- **One mark** (plan B5.1, B5.2, B5.3, 2026-11-13). Badge, Count, Tag, Kbd, Citation's pill and Indicator's count are
  one recipe (inset.css, "One mark"). A family sets its rung (`--_mark-height`), the border it really draws
  (`--_mark-border`) and its corner role; the recipe gives the rest:
  - height: the mark ladder, 14 / 18 / 22 at type 13 (16 / 20 / 24 at 14, 18 / 22 / 26 at 15, 20 / 24 / 28 at 16; 14 /
    18 / 22 at 12), at every density;
  - text: text-xs on sm and md (10 / 11 / 12 / 13 / 14 at types 12 to 16), the UI text on lg, never moved by density
    (Tag md is 11/14 like Badge, owner 2026-11-11);
  - side: (H − 6) / 2 from the outer edge, the edge counted once (4 / 6 / 8 at type 13); a one-character count drops its
    sides, a circle;
  - baseline: `edge + round((H − 2 · edge + 1cap) / 2)` from the plate's top, and a dot or icon centres on that cap;
  - corner: the pill role for status and counts (Badge, Count by their Pills flags; Citation and Indicator's count
    always), `radius-full` itself (one value, never full plus a corner; 2026-11-14), otherwise the Corner setting's
    corner for H; the chip role for objects (Tag, Kbd, inline Code, Stepper's marker), the small corner, at most H / 2.
    At Corner 0 chips are square and pills stay pills while the Pills set lists them;
  - internal gaps 2 at sm and 4 above; a translucent fill (`bg-mark`) where it has a plate; Badge and Kbd at 500,
    Count, Indicator's count and Tag at 400.
  An inline chip (inline Code, a soft Mention) never exceeds its line: its block padding is (1lh − content) / 2 less its
  border, 0.55 at 13/18, so its plate is the line box. `cohesion.test.mjs` ("one mark") pins the recipe.
- **One track** (plan B8.1, 2026-11-14). Segmented and soft Toggle group are one track (`segmented.css`, "One track"),
  as Button group shares Button's: a family sets its tier's height and corner; the recipe gives the 2 inset and gap (at
  every density), the corner (a pill at Pills `segmented`), the edge (`border-width`, the Buttons group), the thumb's
  height and concentric corner and the raised option's paint. `twins.test.mjs` fails a twin that restates a term.
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
  - Axis names and values follow [Governance › One vocabulary](GOVERNANCE.md#4-one-vocabulary), and so do parts,
    slots, states and props: one name per job, read by `lint:manifest` and `test:contracts` from
    `packages/styles/scripts/vocabulary.mjs`.
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
  - An overlay is `open` / `defaultOpen` / `onOpenChange`, and so is any list or menu a field or button opens; a close
    is `onDismiss` / `dismissLabel`.
  - Read-only is `readOnly`, painted `data-read-only` (Textarea too) and announced `aria-readonly` where the role
    takes it. It keeps every state's paint, a field adds its one cue (Disabled and read-only), and there is no hover
    or press and a default cursor. A control without a native read-only (a checkbox, a button that opens a
    picker) blocks the change itself (components audit 2026-11-07, O2).
  - Validation is `invalid` / `validationStatus` (`error`, `success`, `warning`) on every field, and a Field's status
    reaches its control through `data-validation-status`: the success and warning edges are Input's (O1).
  - Pending is `loading`, and hover timing is `delay` / `closeDelay`.
  - Renamed props keep a deprecated alias for a release.
- **Names and collections.**
  - `aria-label` names the component's own element, `<part>Label` names a sub-part
    (`menuLabel`, `dismissLabel`, `toggleLabel`), and `label` is visible text or spoken
    content.
  - A collection is `items`.
  - Glyph slots are `icon` / `trailingIcon`, and media `leadingVisual`, in fields too: Input's and Search field's
    `leadingIcon` is a deprecated alias of `icon` (owner, 2026-11-07, system gaps C4).
  - A close is `onDismiss` / `dismissLabel`, and its part is `__dismiss` in every family (Chip, Tag, Attachment,
    Dialog, Drawer, Alert, Toast, Badge, Prompt suggestions; was `__remove` and `__close` until 2026-11-07).
  - `trailing` holds text or a count (Nav item, Tabs items, Tree view nodes, Menu item since 2026-11-07).
  - An actions slot is `actions`, its part `__actions` (Alert, Toast, Empty state; 2026-11-07). Card header's single
    `action` (one Badge or icon Button) is not yet aligned.
  - A picker that renders a group and a visible legend keeps `label` as a fallback name, and
    `aria-label` wins.
- **Logical properties** (`inline-size`, `padding-inline`), so direction follows the scope.
- **Stacking.** Components stack only locally (z-index 0–2 inside their own box). Floating
  surfaces use the top layer, the `z-*` scale is for product chrome, and the modal backdrop
  is `--area-scrim`.

## Announcements

One announcer says every change a screen reader would otherwise miss (components audit D1, 2026-11-07). A page has
one polite region and one assertive region, made on first use and shared by every family; no family writes an
`aria-live` region of its own.

- **The API.** `announce(message, { politeness })` from `@area/react`, for a change that follows an event (a copy, a
  toast, a tag added, a row moved). `useAnnouncement(message)` for a status a component shows away from focus: it says
  the message each time it changes after the first render (an upload's state, the month on view, contrast passing).
  `clearAnnouncements()` empties both regions.
- **Polite by default.** `assertive` only for a failure the person must act on now: a danger Toast. A failed upload, a
  "No results" and a finished step are polite.
- **Say what changed, with its subject.** "Brand guidelines.pdf: Complete", not "Complete"; "Fills moved to position 2
  of 3". The words follow [Writing](WRITING.md): a status is a past participle or a noun phrase, no "successfully".
- **How it behaves.** No document is touched at import, so server rendering is safe; the regions are one per document,
  even with two copies of the package; each message empties the region, then writes it 100 ms later, so the same
  words twice are said twice; the text clears itself after 7 s, so it isn't found later while reading the page. While
  a modal dialog is open the regions move into it, since the rest of the page is inert.
- **Kept where the visible text is the message** (`packages/react/tests/cohesion.test.mjs` lists them): Alert's
  `status` / `alert`, a named Spinner's `status`, a Toast shown without a Toaster, Turn notice, compact
  Pagination's "Page 2 of 10", and an Empty state the page gives `role="status"` after a search. Each is the element on screen, rendered with its words, so the role names it rather
  than reporting a change elsewhere.
- **Not for validation.** A field's error is its description (`aria-describedby`, `aria-invalid`), read when the field
  is reached; it is not announced as it appears.

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
