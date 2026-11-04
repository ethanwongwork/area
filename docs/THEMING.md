# Theming

Customize the whole library through shared settings, then semantic and component tokens
for specific roles. Components have no light, dark, compact or brand variants: a setting
on any ancestor changes every component inside it. The rules every setting follows are in
[Design system › Settings](DESIGN_SYSTEM.md#settings); how the build emits them is in
[Architecture](ARCHITECTURE.md#tokens-packagestokens).

## Settings

Each is `data-area-<id>` on any element (in React, a `Theme` value). Missing settings
inherit; an explicit setting starts a local scope. The registry
(`packages/tokens/src/axes/registry.ts`) defines 44 axes. Most are one number named after
what it measures.

The registry is also the source of every setting's name and place (owner, 2026-10-19: "i want the axises to be the
source of truth"). `SETTING_GROUPS` puts each axis and the two scoped settings (Contrast, Pills) under one heading
(Page, Accent, Emphasis, Size, Shape, Stroke, Shadow, States, Effects; in palette order since 2026-10-24) in order; each axis's `label` is its whole name (Mode, Stroke width,
Floating shadow …), and `settingLabel` drops the heading's word under its heading (Width, Floating …). The app's
Inspector and Theme tab both read them from `@area/tokens/config`. A preset's `label` is its value, with a range's
named end in brackets ("0 (Flat)", "100 (White)", "8 (Smooth)"); no label carries "(Default)" (owner, 2026-10-20).
`defaultPreset` alone says which is the default, and the Theme tab marks it.

**The defaults** were chosen by the owner on the defaults review (2026-10-25, docs/research/defaults-2026-10-25/), one
group at a time on real components in light and dark. Four moved: Type 13 (was 14), Corner 10 (was 8), Layer contrast
0, Flat, in both modes (was 4), and Selection Neutral (was Accent); every other setting kept its default. The app's own
UI is drawn in the defaults, cards and Canvas included, and the Inspector's settings reach only the specimens inside
them ([Product UI](PRODUCT_UI.md), rule 18).

**How the Inspector shows them** (owner, 2026-10-24, docs/research/theme-review-2026-10-23/controls-plan.md): an ordered
setting is a bar, Slider's field variant, with its name and its value inside, dragged from any point; named choices are a
Segmented; a setting with an Auto, System or Accent beside its range shows those with Custom, and the bar under them while
Custom is on. Values read in their unit (60%, 8px, 210ms, 215°, White), never a step number; the registry's preset ids are
unchanged, so saved settings and attributes still read, except where a setting became positions (below). Mode pairs show
the one for the mode the app is in.

**Positions** (owner, 2026-10-26: "a slider that adjusts to every possible percentage maybe to the ones place only ...
rather than creating preset levels and percentage values that have huge steps between them"): Layer contrast, Card shade,
Text tint, Grey tint strength, Label tint and the Hover, Selected and Pressed fills take every whole number from 0 to 100
(Card shade −100 to +100; Hover and Pressed from 25, their old 1, so a plate always shows), each a share of the model's
own range; the dark page every whole percent from 0 to 24; Tint hue every whole degree. Each value is still one static
preset (a number-only preset is about 66 bytes; these add 8 KB gzipped to axes.css), so a theme is still
`data-area-layers-light="37"` and the contrast gate still reads literals. Old steps are whole positions and draw exactly
as before (Layers 4 is 50, Card tone −1 is −25, Text tint, Label tint and fills ×25, Grey tint 8 is 50), except Grey
tint's odd and even-not-by-four steps, which land at the nearest position (Tint 2 is 13, under 0.0004 chroma off); a
Canvas saved before converts once (`restoreCanvas`). Setup asks them as one slider each with the old names as marks;
Theme's Browse draws the quarters. `layers.test.ts` ("every position is usable", "every grey tint and fill position")
walks every pair of Layer contrast and Card shade positions on every ground, Text tint and Grey tint at every position,
every fill position against the others' marks, and the shipped CSS; the accent gate measures every Label tint position.
The fills' minimum steps hold at the marks: Selected 1 to 24 sits between the hover plate (0) and the first mark. Page
lightness stays in whole percents here (11 of the 34 greys a screen shows from 90 to 100); an exact page colour reaches
all 34 (Exact colours, below).

**Tint hue at 1°** (2026-10-26): every hue from 0 to 359, all in axes.css (five numbers a hue; 4 KB gzipped for the 288
more); every degree takes the strengths 4, 8 and 16, the 30° hues every strength and Text tint share ("every tint is
usable"), and every page a pick can paint walks every degree (Exact colours; the 5° loop it replaced went with it). The accent stays in 5° steps: each accent hue's ladder is about 6 KB, so 1° would add about 190 KB gzipped to
every product, and an exact accent comes with the colour step instead. The Inspector's **Temperature** is one bar from Cool 100 through Neutral to Warm 100: it writes Cool's or Warm's
ramp and that strength in both modes (it had eight steps, the first Auto); Auto, their own strength, shows at its position
in the mode shown (4 in light, 15 in dark).

**Colour**

| Setting | Values (default) | What it sets |
|---|---|---|
| `theme` | `light` (default), `dark` | Colour polarity and `color-scheme`, including native controls |
| `neutral` | `neutral` (default), `cool`, `warm` | The grey cast of every neutral role |
| `accent` | The palette's 11 (`blue`, default) or any hue `0` … `355` in 5° steps | The chosen colour. State marks, selected edges, the focus ring and selected text take it while Selection is Accent; solid actions while Action is Accent. A hue draws the palette's ladder between its two nearest families (`color/generate.ts`), so at a family's own hue the result is the family, and every solved step (solid, indicator, tonal ink) is solved again for it |
| `accent-strength` | `100` (Full, default) … `30` (Dusty) in tens, one for both modes | How much of its own colour the accent keeps: every accent colour mixes in OKLab toward the gray of its own luminance, so hue holds and contrast stays within 0.09:1; the solvers walk at every strength, so each step clears at each (docs/research/palette-customization-2026-10-23) |
| `label-tint` | `0` (None, default) … `100` (Full), every whole number, one for both modes (0 to 4 until 2026-10-26) | How much of the accent's hue the label on an accent solid takes: a share of the way from its measured black or white toward the most coloured rung that still clears 4.6:1 and APCA 61 on the Solid step's fill and hover at every strength (`tintedLabel`, scale.ts). A navy button at 50 has a pale blue label; on a bright fill no rung clears and the label stays white |
| `status-colours` | `fixed` (default), `match` | Danger, warning, caution, success, info and discovery as the palette draws them, or quieted to the Accent strength by the same mix, so a dusty palette has dusty statuses. Their hues never move, and tag colours (pink, gray, brown) stay |
| `tone-tint` | `0` (None), `50`, `100` (default), `130`, `160`, one for both modes | How much colour the status and label tones' soft tints carry (`<tone>-surface`, `-hover`, `-active`, `-border-subtle`), as a percent of Area's ladder (`LIGHT_TONAL_CHROMA` 0.025 / 0.035 / 0.045, `DARK_TONAL_CHROMA` 0.05 / 0.06 / 0.07). 0 is the neutral fill; 50 about the palette's rungs before 2026-11-02; 160 the richest (docs/research/tone-tints-2026-11-02). Each tint's words are solved on it at every Tone contrast floor, so a deeper tint takes a darker ink. In dark the lightness holds and chroma stops at what sRGB shows there (yellow and orange gain nothing past 130). The accent's tints follow the accent's settings. 2026-11-02 |
| `tone-contrast` | `4.5` (AA, default), `4`, `3.5`, `3`, `2.75`, `2.5` (Vivid), one for both modes | The lowest WCAG ratio status and label words (danger, warning, caution, success, info, discovery, pink, brown: `fg-<tone>`) keep on every ground they are solved on: their tints at rest, hover and pressed, the page, the surface and the subtle ground. Below 4.5 each ink rises toward its most vivid colour, solved exactly at the floor (`scale.ts` `solveInk`) and never past its own peak, so red, blue and pink stop where they are most saturated. The accent's ink, neutral inks, words on solids, edges and focus never move. Raised Contrast, or the OS asking for more under System, puts every tone back at 4.5. Below AA on purpose (docs/CONTRAST.md, Tone contrast); 2026-11-02 |
| `series-lightness` | `350` (Light, default), `400` (Deep) | Sky's step on its palette family; every series moves the same number of steps along its own family (sky, pink, chartreuse, indigo, orange, mint, violet, red), so the set moves together. Every series colour is a palette step (`color/series.ts`), gated at each value (`contrast/series.test.ts`): a step lighter than 350 greys peach (red 200, chroma 0.09), from 450 indigo falls under 3:1 on dark grounds. Data colours never follow Saturation (2026-11-01, docs/research/color-system-2026-11-01; on the palette 2026-11-02, docs/research/data-views-2026-11-01/series-plan.md). A Canvas saved before lands on 350, or 400 for a deep pick |
| `solid-light`, `solid-dark` | `auto` (default: the accent's own solid) or `200` … `850` | The accent step solid fills (accent Buttons, checked marks) sit on, per mode: a navy button is blue at 750. Each step carries black or white, whichever stays readable on it at every Accent strength, so the label flips with the shade (2026-10-25: light blue at 200 under black, deep orange at 750 under white); where neither does (a mid blue, 250 to 450) the step moves toward the accent's own label's side to the first that carries it. Auto keeps the accent's own label. Dark's Auto stays the solver's own step whatever light picks (a navy fill measures 1.66:1 on the near-black page). The Inspector calls it **Shade**, under the colour and over Saturation: a bar of the colour's distinct shades, lightest to deepest, with Auto (Vivid) where its lightness puts it; the Accent menu draws every colour at its vivid shade |
| `action` | `neutral` (default), `accent` | Whether committing actions (solid Buttons) paint the accent |
| `selection` | `neutral` (default since 2026-10-25; Accent 2026-10-22 to 25), `accent` | Whether state marks (checked, on, selected, current, filled), selected edges (Card, Asset card, choice cards), the focus ring and selected text paint the accent. With Action, Neutral here gives an entirely neutral look. One setting, so a selected card and the mark inside it are always one colour (docs/research/selection-colour-2026-10-22) |
| `ground-light` | `100` (White, default) … `90` | The light page's OKLCH lightness, in 1% steps |
| `ground-dark` | `0` (Black) … `24` in 1% steps, `8` (default, #020202) | The dark page's lightness; below 12 a step barely shows, and the layers' floor (L 0.12) arrives over Layer contrast's first 12 positions |
| `tint-hue` | `auto` (default: the Neutral setting's own hue), `accent` (the accent's hue), `0` … `359`, every degree (5° steps until 2026-10-26) | The hue the grays lean toward in light, and in dark while `tint-hue-dark` is `same` (one hue for both modes until 2026-10-27) |
| `tint-hue-dark` | `same` (default: whatever `tint-hue` is, Auto, Accent or a hue), `auto`, `accent`, `0` … `359` | The hue the dark grays lean toward, so a light and a dark page can lean different ways (exact colours plan, 2026-10-27). At `same` a page that sets only `tint-hue` draws as it always did |
| `tint-light`, `tint-dark` | `auto` (default: Neutral's strength), `0` (None) … `100`, every whole number, 100 is OKLCH chroma 0.08 (0 to 16 in steps of 0.005 until 2026-10-26; to 0.08 since 2026-10-23, for a butter-yellow page) | How strongly the grays take the hue, per mode. A step past what sRGB can show at a hue and lightness is held at that room (`tintRoom`, two slopes under the gamut), not clipped, so steps past it draw the same colour; clipping moved luminance and hue (a blue tint at 8 on a 97 page painted cyan). Every hue at every strength clears the Layers gate (`layers.test.ts`, "every tint is usable"; every page a pick can paint, `colours.test.ts`) |
| `ink-tint` | `0` (None) … `100` (Full), every whole number, `50` (default; `0` … `4` in quarters until 2026-10-26) | How much of the tint body and muted text take. Text also moves 0.25 × the strength away from its ground, so it keeps 4.5:1 on every hue (`INK_MARGIN`, docs/research/custom-neutral-2026-10-22/) |
| `card-tone-light`, `card-tone-dark` | `auto` (default: each container's own tone, a Card raised, an Asset card recessed), `-100` (darker) … `0` (the page) … `+100` (lighter), every whole number (−4 to +4 in half steps until 2026-10-26); 100 is 0.048 L in light, 0.12 in dark | Cards and asset cards against the page, per mode; their controls step from it and text is solved against the darkest (light) or lightest (dark) card, so every position reads (`layers.test.ts`, "every card tone is usable", "every position is usable"). Menus, popovers and dialogs stay raised. An Asset card's inner frame stays the page tone, and takes the recessed tone where its card is within 0.005 L of the page (0, clamped at white or black, or a position that small) and the recessed tone is farther from it, so it reads apart as far as the layers allow |
| `layers-light`, `layers-dark` | `0` (Flat, default since 2026-10-25) … `100`, every whole number (five steps, 0 to 8, from 2026-10-22 to 26; 50 is the old 4) | How far raised layers (cards, menus) and recessed ones (sidebars, wells) sit from the page, and control fills from their ground |

The action and selection settings combine:

| action | selection | Result |
|---|---|---|
| neutral | neutral | Everything neutral (default) |
| accent | accent | Everything in the accent |
| accent | neutral | Coloured actions, calm controls |
| neutral | accent | Neutral actions, coloured state |

Semantic tones (info, success, warning, caution, danger, discovery) keep their colour in
every combination, at every accent hue and strength.

**Any palette, from a few colours** (2026-10-23, docs/research/palette-customization-2026-10-23). A palette is two
colours, optionally three: a **page** (Ground and Tint: the page and every gray), an **accent** (Accent, Accent strength,
Solid), and Action and Selection deciding where the accent paints. The Theme tab's Setup asks the greys as one first choice
(Neutral, Warmer, Cooler, Tinted, Accent), each opening only the settings that refine it, and offers a colour field for the
page and one for the accent; each snaps to the settings that draw it nearest and says what it chose. A pick is an input,
never a token value: every role (hover, press, tints, strokes, ink, the label on a fill, the focus rung, the dark
counterpart) is solved from the settings, so a custom colour has the guarantees a named one has. A separate button colour
(a third chromatic colour) is not offered; Solid makes buttons deeper or lighter in the accent's own hue. `custom` (Switch's `--area-switch-color`) is a per-instance colour
outside both roles.

**Size and shape**

| Setting | Values (default) | What it sets |
|---|---|---|
| `type` | `12` … `16`, `13` (default since 2026-10-25; was 14) | The base UI text size (`text-base`). Every type role follows, Cursor's ramp at 13 (2026-11-02): small text 2 under (never under 10), secondary text (`text-sm`) 1 under, reading text (`text-lg`) 1 over on its prose line, titles 16 / 18 / 20 / 26 at 13 in proportion. Also the icon stroke, the icon slot (16, or 20 from type 15, where a default-size icon's line takes the size curve's ratio `type-icon-line`, 0.8846: 1.33px at 15, 1.42 at 16), the check box and toggle size, and which densities are allowed (Compact up to 14, Comfortable from 13). |
| `density` | `28` (Compact), `32` (default), `36` (Comfortable) | The room around text, named by the medium Button's height at type 14. It sets control heights (the text line plus twice the room, never under 24), rows (the text line plus twice the room, never under 5 a side: 28 at type 13 Compact, owner 2026-10-22), gaps, layout steps, surface insets and the regions' spacing (below). |
| `radius` | `0` (Sharp), `2`, `4`, `6`, `8`, `10` (default since 2026-10-25; was 8), `12`, `14`, `pill` | The medium Button's corner. Every corner derives from it ([Size and shape](DESIGN_SYSTEM.md#size-and-shape)) |

**What density does to a screen** (2026-10-31, `docs/research/region-balance-2026-10-31`). Every spacing role steps
with the rows and controls, so a level changes a screen's room evenly, never its rows alone (`area-ui-compose` ›
spacing.md rule 6). At type 13, the app's type:

| Role | Compact (28) | Default (32) | Comfortable (36) | Token or rule |
|---|---|---|---|---|
| Row (Nav, Tree view, Menu) | 28 | 30 | 34 | `ui-row` |
| Small / medium control | 24 / 26 | 26 / 30 | 30 / 34 | `control-sm`, `control-md` |
| Region inset (Panel md: a Sidebar's, an Inspector's edge to its text) | 14 | 14 | 18 | `max(14, inset-surface-md)`; 16 / 20 at type 14 |
| Row plates from the region's edge | 8 | 8 | 12 | the region inset less Panel's row pad, 6 (Cursor's) |
| Table row (md, one line, in the feed) | 35 | 43 | 51 | the prose line + the frame inset less its half-leading, twice |
| Feed text from the frames (titles, ledes, tabs, Show all) | 4 | 4 | 4 | `--_text-inset`, fixed |
| Feed margin (the Canvas's edge to its sections) | 24 | 32 | 40 | `32 + 8 × ui-level` |
| Cards apart | 8 | 12 | 16 | `12 + 4 × ui-level` |
| Inside every feed frame (tiles, cards, tables, rows) | 12 | 16 | 20 | `16 + 4 × ui-level` |
| Heading to its block | 12 | 16 | 20 | `16 + 4 × ui-level` |
| Sections apart | 40 | 48 | 56 | `48 + 8 × ui-level` |
| Header (each region's) | 38 | 40 | 44 | the small control, 7 above and below |

Claude Code steps the same way between its two densities (pads 12 → 16, section gaps 32 → 40, rows 26 → 32); Cursor's
Agents window is one density, near Area's Compact (text 14 from the edge, rows 28). The region inset holds 14 at
Compact rather than following Surface's 12: under 14, a list's plates would sit closer than 6 to the edge, where both
references keep them 8 away.

- `data-area-ui` is shorthand, not an axis: `compact` is type 12 with density 28,
  `default` is type 14 with 32. An explicit `type` or `density` on the same element wins.
- `ui-dense` is the spacing step that each density level keeps against the type size: 1 at
  Compact 12, 0 at Default 14, negative above. Component insets are written against it.
- Control side padding has no token: `inset.css` derives it from the height.
- `data-area-pills` is a set, not an axis (`axes/pills.ts`). It is a space-separated list of
  the shapes that draw a pill: `button`, `field`, `segmented`, `chip`, `badge`, `count`,
  `switch`, `avatar`.
  - With no attribute, chip, badge, count, switch and avatar are pills.
  - `""` makes every one of them follow the radius.
  - Instance props override it (`pill`, Avatar's `shape`).

**Edge and depth** (`axes/surface.ts`, `axes/elevation.ts`, `axes/depth.ts`)

Eleven controls, each with one effect and no named looks. `DEPTH_LEVERS` in
`@area/tokens/config` lists them in the Inspector's order, with the state settings below. The app shows them under two
headings, **Stroke** and **Shadow**, and the states under **States**:

| Setting | Inspector label | Values (default) | What it sets |
|---|---|---|---|
| `surface` | Stroke › Width | `0` (Flat), `hairline`, `0.5`, `1` (default), `1.5`, `2` px | The frame of cards, panels and floating surfaces (`frame-width`, read as `border-width`). Hairline is one device pixel (`--area-device-pixel`: 1px at 1x, 0.5px at 2x, a third at 3x; owner 2026-10-31, after Claude Code's ring hairline) |
| `stroke` | Stroke › Edge contrast | `0` (None) … `8` in half steps (since 2026-10-22), `4` (default) | How dark every stroke is, its distance from its ground; a style, where Contrast is the accessibility layer |
| `stroke-cards` … `stroke-media` | Stroke › Cards, Blocks, Callouts, Floating, Regions, Dividers, Fields, Buttons, Options, Tracks, Tags, Media | `0` (None) … `8` in half steps; defaults 4, 5, 4, 5, 3, 3, 5, 3, 4, 3, 3, 2 (the owner's picks, 2026-10-30) | Each group's stroke: its amount × 2.5% of the text colour over the ground, times Edge contrast / 4; Contrast takes it on to the 3:1 stroke. Members: DESIGN_SYSTEM.md, "Strokes" (axes/stroke-groups.ts) |
| `shadow-rest` | Shadow › Edge | `0` (None, default) … `8` | `shadow-edge`, a subtle edge round the same surfaces, with the line or instead of it |
| `elevation` | Shadow › Floating | `0` (Flat) … `8`, `3` (default) | The Menu's shadow strength in percent: tooltip, float and modal roles |
| `shadow-resting` | Shadow › Resting | `0` … `8`, `3` (default) | Cards, panels and raised thumbs at rest: cards and panels one small contact layer, `0 0.5px 1.5px -0.5px`, 4% at 3 (owner, 2026-10-30; was ChatGPT's sm at 8%); raised thumbs the control role |
| `shadow-hover` | States › Hover lift | `0` … `8`, `3` (default) | A hovered card or tile's lift (`shadow-lift`): `0 2px 4px -1px`, 8% at 3 (ChatGPT's md). At 0 the hover steps the edge instead |
| `shadow-field` | Shadow › Fields | `0` (default) … `8` | Outline fields, select triggers, outline and soft Buttons. Soft fields stay flat |
| `shadow-size` | Shadow › Reach | `0` … `8`, `4` (default) | How far every shadow reaches (offset and blur × n/4) |
| `shadow-softness` | Shadow › Softness | `0` (Crisp) … `8` (Smooth), `2` (default) | The number of layers and how tightly they sit |
| `shadow-light` | Shadow › Light | `0` (Flat, default) … `4` | A lip under each lifted edge and a highlight inside its top |
| `shadow-color` | Shadow › Colour | `black` (default), `warm`, `cool` | The light theme's shadow tint. Dark stays black |

- Light always comes from the top, and dark shadows are twice the light alpha.
- Resting and lift are one tight layer each (negative spread, owner 2026-10-21: "faint, low spread shadows"); Softness
  shapes the floating roles only.
- Every role is the same nine slots at every setting (a lip, the dark rim, six soft layers, a highlight), transparent
  where unused, never `none`. The dark rim (owner, 2026-10-19: "make the shadow settings visible in dark mode") is
  `0 0 0 1px` white at the role's own strength × 2, at most 16%, transparent in light, so shadows read on the
  near-black page.
- Under any raised contrast level, `border-width` is at least 1px, so Flat brings its frame
  back. The soft edge is drawn only while no frame is.
- The ladder `shadow-1` … `4` is for apps. Components name roles.

**Interaction states** (`axes/states.ts`, `axes/depth.ts`; owner, 2026-10-21)

The owner's picks on the state page are the defaults; every other option branches from them. The selected edge
(`stroke-selected`) and the focus ring (`focus-color`) are Selection roles (2026-10-22): the accent's indicator rung
(`accent-indicator`: the lightest step of the accent that keeps 3:1 on every ground, fill and tinted surface, #0160d9
light, #79aeff dark for blue) at Selection Accent, and the neutral solid (#282828 / #f3f3f3) at Neutral, the default.
Selected and focus share a colour and differ by placement: the selected edge inside, the focus ring on or outside.

| Setting | Inspector label | Values (default) | What it sets |
|---|---|---|---|
| `stroke-hover` | States › Hover edge | `0` (None) … `4`, `2` (default) | How far a control's edge darkens under the pointer (`edge-control-hover`), equal steps |
| `selected-stroke` | States › Selected edge | `1`, `2` (default), `3` px | A selected card's, tile's or choice card's edge, drawn inside (`selected-width`) |
| `focus-ring` | States › Focus ring | `hug` (default), `gap`, `halo`, `inset`, `bold` | Where the keyboard ring sits: `focus-width`, `focus-offset` (controls), `focus-gap` (containers and text) and the fields' ring, recolour and halo switches |
| `fill-hover` | States › Hover fill | `25` … `100`, `50` (default; 1 to 4 until 2026-10-26) | The hover plate under rows and ghost controls, opaque and translucent (`bg-component-hover`, `bg-hover`) |
| `fill-selected` | States › Selected fill | `0` (Same as hover) … `100`, `25` (default; 0 to 4 until 2026-10-26) | How far past hover the selected plate sits (`bg-component-active`, `bg-active`) |
| `fill-pressed` | States › Pressed fill | `25` … `100`, `100` (default; 1 to 4 until 2026-10-26) | The share of the way from selected to the firmest press: 12% toward the ink in light (ChatGPT's), 14% in dark, stopped where muted text keeps 4.6:1, which is always at least the press room past selected |
| `danger-hover` | States › Danger hover | `tint` (default), `neutral` | A destructive row's hover, highlight and pressed plate (Menu, Context menu): the row's own plate turned to the danger hue at the same lightness, or the grey plate every row takes (`row-danger-tint`, 1 or 0) |
| `selected-tint` | States › Selected tint | `none` (default), `tint`, `neutral` | A selected container's fill under its stroke: nothing, the accent's faint surface (half strength in dark), or the row's selected wash (`selected-tint`) |

- Hover, selected and pressed are built on each other, so their order holds at every combination (`color/layers.ts`
  `FILL_STEPS`, checked against the CSS in `layers.test.ts`). Inks are solved against the deepest ground's selected fill
  pressed by the press room (`PRESS_ROOM`, 2026-10-23: 0.012 L in light, 0.04 in dark, the smallest steps Area ships
  that read), so a press shows on every ground: it had equalled selected on recessed surfaces in light at Layers 4 to 8
  and on raised ones in dark from 16 + 8. At the defaults muted text is #646464 (was #666666) and the page's firmest press
  L 0.913 (was 0.925). A rule, not a setting: a press that cannot show is not a viable look.
- The dark translucent washes (`bg-hover`, `bg-active`, `bg-pressed`, for plates over a ground a component can't know)
  stop where muted text still reads: hover at 18.3%, selected at 20.3%, pressed at 22% (`DARK_WASH`, emit/base.ts), so
  selected stays a step past hover and every press shows at every Fill setting (2026-10-24); Hover 3 and 4 share the stop.
- Contrast More still lifts the hover edge to its 3:1 stroke, and a field's ring always draws under it.

**Motion**

| Setting | Values (default) | What it sets |
|---|---|---|
| `motion` | `0` (None) … `300` in steps of 30, `210` (default) | The Menu's open in milliseconds. Every duration is a third-multiple of it ([Motion](MOTION.md)) |
| `easing` | `subtle` (default since 2026-10-24), `standard`, `snappy`, `gentle`, `spring` | The shape of every transition (`--area-ease-*`, owned by Easing since 2026-10-19). Subtle's ease-out is `(0.22, 1, 0.36, 1)`, a gentler start than Standard's; Spring overshoots on enters and moves, never on exits ([Motion](MOTION.md)) |
| `feedback` | `off`, `subtle` (default), `pronounced` | How a control answers the pointer (`--area-feedback-*`, 2026-10-24): hover's and a press's arrival as shares of `duration-fast` (derived `--area-hover-in`, `--area-press-in` in `emit/base.ts`), and the give under a pointer press by size (`feedback-scale-sm`, `feedback-scale`, `feedback-scale-lg`, `feedback-scale-wide`). Reduced motion resolves it to Off ([Motion](MOTION.md)) |

`0` and `prefers-reduced-motion` make every duration 0 and stop every loop.

**Not axes**

- `data-area-contrast`: `0` (Standard) … `8` (More), `--area-contrast-more` an eighth a level (nine levels since
  2026-10-22); `standard`, `medium` and `more` stay as aliases of 0, 4 and 8. With no attribute it follows the OS
  `prefers-contrast`. The Inspector offers System (default) and the nine levels ([Contrast](CONTRAST.md)). It is the
  accessibility layer, apart from Stroke strength (a style): it pulls every edge toward the 3:1 stroke, adds boundaries
  where the soft style has none (frames at Stroke width 0, soft fields and buttons, the Switch thumb), puts the focus
  ring on fields, and follows the OS.
- `data-area-material` (`axes/material.ts`, `styles/material.css`):
  - a bundle (`none`, `glass`, `tactile`, `jelly`, `soft`, `aero`, `glow`);
  - per-lever overrides `data-area-material-<lever>` (light angle, gradient, sheen,
    transparency, frost, stroke, inner shadow, softness, catch-light, emboss, contact, glow,
    grain, page glow);
  - switches and stroke styles.

  Materials paint only inside an element that has the attribute. They paint over a part's
  Layers fill, never change size, type or ink, and add no outer lift beyond a contact shadow.
  The bundles are named presets; the owner's "no named looks" rule makes their future an
  open question.
- `data-area-ground="raised" | "recessed" | "well" | "page"`: marks a product's own region, so the
  control fills inside it step from that ground (`styles/layers.css`). `well` is a fill meant to show at every Layer
  contrast (`bg-well`, DESIGN_SYSTEM.md, Layers).

```html
<section data-area-theme="dark" data-area-accent="teal" data-area-type="13" data-area-density="28">
  <!-- Components inherit this scope. -->
</section>
```

## CSS inheritance

- **Independence.** Every axis owns disjoint custom-property namespaces. Switching light and
  dark keeps the inherited accent and neutral. Attribute order never changes the result,
  removing a setting restores inheritance, and an invalid value selects no preset.
- **Colour pairs.** Semantic colours stay as their light/dark pair until a real CSS colour
  property consumes them; `color-scheme` picks the polarity at that element. A computed
  custom property can contain `light-dark(…)`, so to check a colour, measure the painted
  `color`, `background-color`, border or shadow.
- **Switching theme at runtime.** Chromium can keep a cached colour on some descendants after
  `color-scheme` flips. Force one synchronous restyle after the switch:
  `root.style.display = "none"; void root.offsetHeight; root.style.display = "";`. Nothing
  paints in between. The app also sets `data-area-switching` for one frame so nothing
  animates. Setting the theme before first paint needs neither.
- **Re-emission.** Derived values are re-emitted on every element that carries a setting.
  A derivation resolved only at the root would freeze the wrong inputs for descendants.
- **Grounds survive a scope.** A setting scope inside a region (a sidebar, a card, a menu, a `data-area-ground`) keeps
  that region's control fills: each ground re-points them on the setting scopes inside it, the nearest ground winning
  (`styles/layers.css`, 2026-10-23).
- **Tokens, not layout.** A scope selects tokens, not layout or component behaviour. Custom
  HTML must consume the right foreground, background and type roles itself.
- **Text restarts at a Type scope.** An element below the page root that carries `data-area-type` sets its text to
  the body role (`text-lg` size, leading and tracking) of its own Type (`base.css`), so text set straight in it follows
  that scope instead of keeping the size inherited from above. Components keep their own roles; a product whose page
  uses another body role sets it again on its own scopes.

## React scopes

`Theme`, `useTheme` and `AxisSelection` are exported from `@area/react`.

```tsx
<Theme value={{ theme: "dark", accent: "teal", action: "accent" }}>
  <Button>Save</Button>
</Theme>
```

- `Theme.value` is partial. Omitted values inherit from the nearest Theme, with the
  registry defaults at the root. Unknown axes or values throw.
- Theme renders a div, forwards its ref and attributes, and writes every effective
  `data-area-*`. It does not set contrast or material attributes.
- `useTheme()` returns the effective selection.
- Context crosses React portals, but CSS inheritance does not. Wrap portal content in
  another Theme to recreate the scope where it mounts.
- `brand` and `colours` take the declarations `@area/tokens/brand` and `@area/tokens/colours`
  work out, set inline and marked `data-area-brand` / `data-area-colours` (Brand, Exact colours).
- Theme does not manage overlay focus, positioning or dismissal.
- When mounting into a host themed by CSS alone, pass that host's selection to the root
  Theme explicitly.
- `@area/tokens/config` exports `AXIS_PRESETS`, `DEFAULT_AXES`, `mergeAxes` and
  `themeAttributes` without React or browser globals, for validated configuration
  anywhere.

## Custom values

- **Use the public layers.** Override stable semantic properties for role changes, and
  documented component roles for local changes. Never depend on private `--_*` slots.
- **Verify your own overrides.** Consumers check contrast and geometry for them; the preset
  checks cannot certify arbitrary custom themes.
- **Share reusable roles.** A reusable role belongs in the token package, not duplicated as
  literals across components ([Governance](GOVERNANCE.md#5-keep-it-lean)).

## Exact colours (2026-10-27)

The page in light and in dark as one exact colour each, and the accent as one more (plan:
https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2). Colours stop being presets and become
numbers: Area derives every grey from the page picks and the accent's shades from the brand
engine, and the application settings (Layer contrast, Card shade, the fills, Text tint, Shade,
Saturation, Label tint) apply over whatever was picked. Built so far: the tokens (`@area/tokens/colours`),
the `data-area-colours` scope, React's `colours`, `area-tokens colours`, Setup's code, the app's
saved picks, Setup's Colours stage, the Inspector's page colour, and the accent as one exact pick
(phase 4). The review page with each family before and after is still to come.

**What a page pick writes.** A pick solves into the numbers the Layers model already reads
(`color/colours.ts`, `solvePage`): its lightness as `--area-ground-light` (any value 0.90 to
1.00, to four decimals) or `--area-ground-dark` (0 to 0.24), its hue as Tint hue (Auto,
Accent and Same as light off), the hue's room, and the tint strength that paints its chroma
(the cast's fade toward white and black inverted). A light page's tint fades out above L 0.976
and is gone at white, so the most chroma a page can show narrows to nothing there; it is also
capped at Tint 100 (0.08) and the hue's room (`reachableChroma`). A pick past either is held at
the most that shows, as a strong tint is held at its room.

- **Exact for the page, not one to one.** Where the room or the fade binds, many strengths
  paint the same page; the solve takes the least. A preset past that (a white page with a tint,
  a tint past its hue's room) has no pick that reproduces it, so it stays a preset (`presetPick`).
- **Two ways to write a page colour.** Attributes for the shipped values, variables for exact
  picks. If both are set, the picks win (inline variables beat attribute rules, and a colour
  rule comes after the presets). Use one or the other.

**Using picks.**

- Runtime: `colourDeclarations({ page: { light: "oklch(0.9634 0.012 255)", dark: "#101418" }, accent: "#2f5bd3" })`
  from `@area/tokens/colours`, set as inline variables on an element carrying `data-area-colours`,
  or `colourCss(colours)` for the same as a `[data-area-colours]` rule in `area.axes`. A colour
  is `oklch(L C h)` (L a number or a percentage) or a hex. `pageInfo(page)` returns what each
  pick solved to and the colour it paints.
- React: `const colours = useMemo(() => colourDeclarations({ page: { light: "oklch(0.9634 0.012 255)" } }), [])`,
  then `<Theme colours={colours}>`, which sets them inline and marks the scope `data-area-colours`.
  It takes the declarations already computed, as `brand` does.
- CSS only: `npx area-tokens colours --page-light "oklch(0.9634 0.012 255)" --page-dark "#101418" --accent "#2f5bd3" > colours.css`
  (`--status` and `--selector` as for `brand`), then `data-area-colours` on the element.
- In the app: the picks are saved as colours (`apps/desktop/src/colours.ts`) and checked when it
  loads. A Canvas saved before them converts once: each mode's page and tint presets become the
  pick that paints them where one does (Cool's and Warm's own casts, a tint following the accent
  and a tint the page can't show stay settings), so nothing on screen moves. Writing one of a
  mode's page settings in the Inspector hands that mode back to the settings. Setup's code
  leaves out the page attributes a pick stands in for and adds the colour rule.
- **Picking a page** (Setup's Colours stage, first: light page, dark page, accent; the Inspector's
  Page colour, for the mode the app is in): Area's Color picker in its gamut mode, lightness up
  and chroma across at the hue, painted only where `reachableChroma` reaches, so it offers only
  colours Area paints. Neutral, Cool and Warm sit under it as starting points: each sets that
  grey family exactly (the Neutral setting at its own tint), keeping the page's lightness, and
  drops the picks. Setup's page brightness, Greys, Tint colour, Grey strength and Dark page
  questions folded into the pickers; in the Inspector the page settings a pick stands in for are
  dimmed with the reason, and moving one hands the page back to the settings.
- `data-area-colours` restates every derivation that reads a page input (the stylesheet's
  re-derivation rules, `emit/css.ts`), so a subtree can carry its own colours.
- The accent goes through the brand engine exactly as `brandDeclarations({ primary })` does
  (`secondary` and `tertiary` ride with it). It is one pick for both modes: dark is solved from
  it, and Dark shade adjusts it.
- **Picking the accent** (one control since 2026-10-27, merging the Brand colours switch): the
  Inspector's Accent row and Setup's accent question offer the palette's accents, any 5° hue, or
  **Exact colour**, Area's Color picker through the brand engine. Exact colour's colour, its
  Secondary and Tertiary and Status hues sit under the row; Saturation, Shade and Label tint
  follow either. The 1° accent hue sheet stays withdrawn: an exact accent is this pick. Setup's
  code for an exact accent links `colours.css` and gives the `area-tokens colours` command that
  writes it (about 600 declarations, too many to read inline).
- Cost: the page part is about 3 kB gzipped; the accent loads the brand engine (about 30 kB).

**What the tests walk** (`colours.test.ts`; the guarantee is that Area's colour rules hold
everywhere a pick can land): every one of the 34 greys a screen shows from L 0.90 to 1.00
reached exactly and checked at every Layer contrast position, every lightness between to the
fourth decimal at the marks; every degree of hue × chroma in 0.002 steps up to what the page
shows × lightness in 0.5% steps, in both modes, at the Layer contrast marks with Text tint at
0, 50 and 100; a coarser grid (30°, 2.5%, half and all of the chroma) at every position of
Layer contrast, Card shade, Text tint and the Hover and Selected fills; the hued inks on every
picked light page; and the CSS against the model for a sample of picks.

## Brand (engine, 2026-10-26)

Up to three exact brand colours (`semantic/brand.ts`, `resolveBrandTheme`; plan and research:
`docs/research/brand-palette-2026-10-26`). Area's palette stays the default: with no brand,
every existing token is unchanged. The engine and the default tokens, the runtime, the CSS
command and React's `Theme` are built; the Inspector comes next.

**Using a brand.** A brand writes what a palette accent writes, the accent's and the status
tones' full-strength inputs, plus the brand's own roles, as `light-dark()` pairs, and declares
again the 374 derivations that read them, so every setting (Shade, Saturation, Label tint,
Contrast, Selection) keeps working over it in CSS.

- React: `const brand = useMemo(() => brandDeclarations({ primary: "#00b65c", secondary: "#a785fe" }), [])`
  from `@area/tokens/brand`, then `<Theme brand={brand}>`. `Theme` takes the declarations
  already computed, so a product without a brand never loads the solver.
- CSS only: `npx area-tokens brand --primary "#00b65c" --secondary "#a785fe" > brand.css`, then
  `data-area-brand` on the element (or `--selector`). The rule sits in `area.axes`, after the
  axes' own, so a brand on the same element as `data-area-accent` wins.
- In the app: Inspector → Accent → Exact colour (`apps/desktop/src/brand-settings.tsx`, the rows under the Accent row
  since 2026-10-27; it was its own Brand section with a switch), on the Canvas only.
- Cost: about 60ms to work out a new brand (both modes; the first in a page about 170ms, while
  the palette's scales warm), then cached; about 600 declarations, 155 kB of CSS text.

- **Accent** on the primary's own family, the brand colour exactly on one rung. Its button is
  the readable shade nearest the brand (`nearestShade`), which Shade and Saturation move from.
- **Status colours** harmonised: each turned toward the primary by half the hue difference,
  at most 15°, at the primary's intensity, never under 45% of the palette's. `fixed` and
  `match` remain.
- **New tokens**, defined with no brand too:

| Tokens | With a brand | With no brand |
|---|---|---|
| `secondary-*`, `tertiary-*` (the accent's tonal block: surfaces, borders, solid, `fg-*`, `fg-on-*`, indicator) | The secondary and tertiary families, each with its nearest readable button | The accent's values (aliases) |
| `support-1` … `support-8`, `-strong`, `fg-on-support-*` | Eight hues stepped round the wheel from the primary, at its intensity: a soft tone (200 light, 850 dark) and a strong one (700, 300), each moved until its label reads as text | The palette's red, orange, yellow, green, teal, blue, purple and pink |
| `bg-brand-page`, `bg-brand-ground`, `fg-on-brand-ground` | The primary family's 25 (light) or 975 (dark), and its 900 with its label | `bg-page`, `bg-inverse`, `fg-on-inverse` |

## System tokens outside the axes

- `opacity-disabled`: 0.5, a whole disabled control. Fields use their own disabled paint.
- `scrim`: the modal backdrop, 13% black in light and `bg-overlay` in dark. It is derived,
  so a themed subtree re-derives it.

### Parked tokens

Defined but read by no component, kept until the token phase decides. Several are public
seams or come from `palette.json`. A parked token is not a promise of use.

- Alpha ramps: `accent-a*`, `cool-a*`, `warm-a*` and their `-contrast`; `accent-border-strong`.
- Tone extras: `fg-*-strong`, `*-border-subtle`, `fg-caution-vivid`, `fg-action`, `fill-toggle` / `-hover`.
- Type: `display-sm/lg-*`, `title-sm/md-*`, `text-xs-tracking`.
- Tiers no component uses: `control-xl`, `gap-xs` / `-xl`, `icon-xl`, `radius-control-xl`,
  `radius-nested`.
- Motion: `ease-in` and the deprecated `ease-spring`.
- Seams: `badge-bg`, `badge-fg`, `badge-tracking-wide`.
- The `z-*` layer scale (0–80), for apps. Components stack locally, and floating surfaces
  use the top layer.

## Limits

- **Required browser features.** The colour scope model requires CSS `light-dark()` and
  `color-scheme`, and the accent's paint relative colour syntax (`color(from …)`, `oklch(from …)`; Chrome 119, Safari
  18, Firefox 128) inside `color-mix()`, and `@scope` (Chrome 118, Safari 17.4, Firefox 146) so a setting scope inside a
  region keeps the region's control fills; there is no fallback.
- **Size.** Each accent preset writes 60 colours per mode plus its Solid steps; the 72 hues bring `axes.css` to about
  790 KB (about 80 KB gzipped).
- **Saved settings migrate.** The app restores older saved Canvas settings: the `ui`
  shorthand as type and density, density saved by name as its number, one Layers value as
  both themes. Values that are no longer an option are dropped (`restoreCanvas` in
  `studio.tsx`). Legacy names are not public API.
- **What the checks don't prove.** A passing scope check does not prove component behaviour,
  forced colours, screen-reader support or every browser.
