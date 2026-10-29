# Product UI rules

How Area is used to build a product, adopted by the owner on 2026-10-12 from the first product
built only from Area components (the desktop gallery, `apps/desktop`). Evidence and the gap list
are in [research/product-ui-gaps-2026-10-12.md](research/product-ui-gaps-2026-10-12.md). Motion
values are [MOTION.md](MOTION.md)'s; state colours are [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)'s
"Shared state paint".

## Rules

1. **States land at once and leave on `fast`.** Hover, press, selection and focus appear
   instantly; only the leave fades (`--area-transition`: `duration-fast`, 140ms at the default Motion, ease-out). No scale on press, no
   movement on hover, no animated theme or density change.
2. **Hover and press change one thing: the plate, the edge or the lift.** Ink, size and position never
   move. One exception (owner, 2026-10-22): a revealed control may take a trailing annotation's place, such as a
   row's count, while the row is hovered or focused (Nav `revealActions`), as Notion's and ChatGPT's sidebar rows do. Rows change their plate; cards and tiles lift (owner, 2026-10-18: no edge change, a soft shadow that fades in,
   `docs/research/card-hover-2026-10-18.md`), and step their edge only at Elevation 0, where there is no shadow;
   painted things (swatches, ramp steps) change a ring in their own ink.
3. **Each state is one step firmer than the last**: rest → hover → selected → press, and
   selected survives hover. A press is the firmest, momentary step, so every click shows (owner,
   2026-10-16: "make sure the build quality is real"; Notion presses at twice its hover, ChatGPT
   more than twice).
   - Rows (Nav, Menu, Tree view, interactive Table, List box, Pagination): `bg-component-hover` →
     `bg-component-active` selected / current → `bg-component-pressed` held.
   - Tiles and cards (Area's Asset card, `docs/specs/asset-card.md`): no shadow at rest → the lift shadow fading in on
     `fast` (hover) → dropped at once (held) → the edge in `stroke-selected`, one line (selected); the edge
     (`neutral-100`, 750 in dark) stays, and steps to `edge-control-hover` only at Elevation 0 (owner, 2026-10-18). A tile stands alone like a Card, so it is never
     on `border-decorative`, which is for rules inside a surface.
   - Painted (colour cards): their one outline, Color swatch's ring (`token-swatch-ring`, 10%, at stroke-width), steps to the
     card's ink at 24% → 48% held → 2px solid selected. Never a second ring.
4. **Every icon-only control names itself in an Area Tooltip**, never the browser's `title`,
   with its shortcut as `Kbd` when it has one. When the tooltip repeats the accessible name, it
   only shows (`describes={false}`), and the shortcut reaches assistive tech as
   `aria-keyshortcuts`. Menu triggers use `Menu tooltip`; icon-only Segmented options get one
   on their own.
5. **Every collection is keyboard-complete.** Tab reaches it, arrows move inside it (grids move
   in two dimensions), selection follows focus where an Inspector shows the selection, and
   Escape leaves overlays.
6. **Icon-only toggles in chrome swap outline → filled** (a shown panel, a pin) and set
   `aria-pressed`; toggles with a text label use Button's `selected` plate.
7. **Arrangement is a view option, kept per view.** Sort, direction and grouping live in one
   menu in the view's bar, after its filters (rule 14); its rows keep the menu open (`MenuItem keepOpen`), the
   choice persists across launches, and Reset appears only once something changed. The Sidebar
   and the Canvas use the same order. Menus of commands close on a choice.
8. **Pinning is personal and additive.** Pinned items appear in a Pinned group first and stay
   in their own group too; pin from the Inspector heading (a toggle, rule 6), a context menu, or the row's own pin, which takes the count's place while the row is hovered or focused (rule 2's exception; out of the Tab order, so a list keeps one Tab stop a row).
   Only long lists pin (Components 85, Icons 808); a Sidebar of a dozen rows (settings, roles,
   scales) needs no shortcut (owner, 2026-10-12).
9. **Counts:** a count beside a title is muted tabular text; a count at the end of a row is
   `Count`. The Sidebar's All row counts what the tab holds; the Canvas draws no count of its own
   (owner, 2026-10-14: no titles over the Canvas or the Inspector).
10. **Empty results:** the Sidebar keeps All and its groups; the Canvas shows one `EmptyState`
    naming the query. No inline notes in the Sidebar.
11. **Containers and surfaces.** A thing that is a composition (a component specimen, a
    setting's preview, a colour) sits in a container on a grid; a thing that is its own figure
    (an icon, a line of type) sits straight on the surface, where a frame would only add a second
    edge (owner, 2026-10-12, after Cursor's icon gallery). On the surface, sheets of cells use the
    row plates (rule 3) and hang them into the margin so the figure, not its plate, sets the
    column; lists are the default framed Table (owner, 2026-10-22: "i want to use this table", replacing
    `Table flush`), and rows mixing text sizes align on their first baseline (`Table baseline`). Details open in a hover window (Hover card) or the Inspector.
12. **Each panel's toggle sits at its own side** of the Titlebar: the Sidebar's first, after the
    window controls; the Inspector's at the end.
13. **App CSS styles only app classes.** When a product needs a component to do something it
    cannot, fix the component (with a spec note) or record a gap; never override `.area-*`.
14. **The Canvas's header sets how things are shown; the Inspector, what is chosen** (owner,
    2026-10-12 and 2026-10-14). The layout that follows from it is below.
15. **Nothing is chosen until the person chooses it.** A tab opens on its overview, and the
    choice clears when the Sidebar's row changes.
16. **A control that does not apply to the current view is left out**; the order of the rest
    never changes. Fields in the app's chrome and Inspector are `soft`, a set is a
    multi-select Custom select, and dropdowns hug their rows (`--area-menu-min-inline-size`).
17. **Information is tables wherever it can be**: facts, props, classes, states, keys, ARIA
    and a spec's tables and dated lists. Prose stays prose only where it has no rows.
18. **The app is drawn in Area's shipped defaults** (owner, 2026-10-25: "choose it once and then set it and any further
    customization through the theme page doesnt impact the ui of the electron app"). `<html>` carries every registry
    default and the default Material, so the Titlebar, Sidebar, Inspector, the app's chrome inside the Canvas
    (`appScale()`, `src/app-scale.ts`), the panel widths, the window's ground and its traffic lights (centred on the
    Titlebar) change only when a default does (`src/studio.tsx`). So does everything on the Canvas that is the app's:
    its body, the cards, section titles, the header and the Stage's frame (owner, 2026-10-26: "the actual components
    themselves that sit inside the containers would be the only things that update with the controls"). The
    Inspector's settings, and hover previews of them, reach only what holds a specimen: a tile's view, the Stage's view,
    a colour card (the card is the colour), a type sample and an icon glyph, through one scope of the settings moved
    from the defaults (`src/specimen-scope.tsx`); a brand (Inspector → Accent → Exact colour, `src/brand.ts`) and exact page colours (Inspector → Page colour, `src/colours.ts`) reach the same holders. The defaults were chosen on the defaults review (docs/research/defaults-2026-10-25/). From
    2026-10-22 to 25 the app took every committed Inspector setting instead. The Theme tab's own body stays at the
    Setup scale (Setup, below).

## The app's layout

How rules 11–17 lay out the app's regions (`apps/desktop/src`). Values are at type 13, Compact,
the scale the layout was measured at; the app now takes the default type and density (rule 18).

**Shared line and insets.**

- There is no title over the Canvas or the Inspector; the Sidebar's selected row names what
  the Canvas shows.
  The Components bar carries its path at its start instead (Breadcrumb `nowrap`, owner 2026-10-24: "breadcrumbs can be used to help with layer management"; 2026-10-25, the Overview too: "put some text in the top left, a breadcrumb"): Components / Overview (or List), and on a tile Components / its family / its name.
- The Canvas header's controls, the Sidebar's first row and the Inspector's first heading
  share one line. The Sidebar and Inspector are 14 in on all sides.
- **Lines and grounds** (owner, 2026-10-22; `docs/research/cursor-audit-2026-10-22.md` item 4): the Titlebar keeps its
  rule; the Canvas header and the Inspector's bar carry none (Notion's and ChatGPT's top bars), and the Sidebar sits on
  the chrome's recessed ground (`data-area-chrome`, the subtle step, as Notion's sidebar), its seam the Panel's edge.
- **Rows are 28** at type 13 Compact (owner, 2026-10-22, item 2: rows keep at least 5 above and below their
  text; Cursor's and Figma's 28).
- **The Canvas is a feed** (owner, 2026-10-22: "margins larger than the gaps … a consistent feed style … documentation
  style that is simple, repeatable, consistent"). One column of sections, at most 1236 wide (four 300 cards) and centred; each section
  is a heading (and a muted lede) over one block: a grid of cards, the Stage, plain text, a Table or a Code block.
  Spacings grow outward: cards 8 apart (colour's swatch sheet 4; owner, 2026-10-24: "maybe everything can be 8px?"; was 12), at least 260 wide (277 to 300 in a 1440 window), at most four across (owner, 2026-10-22: "more like a gallery", "280 to 300 px
  width … 4 columns across not more"), a heading 12 over its block, sections 40 apart, the Canvas margin 16, each
  measured to what is drawn: a frame's edge, a text's cap or baseline (titles, ledes and prose are trimmed; a Table
  measures to its frame, as a card does).
- **One voice for the feed's text** (owner, 2026-10-22: "make the copy, titles, and subtitles to be more consistent and
  intentional"), all at the app's 13/18: a section's **title** (medium) carries a muted **count** when its block is a
  collection (cards, rows, swatches, icons), never on facts, code or prose; where the page explains (a family's tabs,
  Theme, Typography) a **subtitle** (muted, one sentence ending in a full stop) says what the block holds; **copy**
  (prose, table text) is regular. A family's purpose opens its page as a subtitle. `CanvasSection` (`src/tile.tsx`) and
  the family tabs' `Section` take `count` and `lede`.
- A bar's controls sit as far from the side as from the top and the rule: 7, 24 tall
  (owner, 2026-10-18; Figma's panel tabs: 8 and 8).

**Canvas header**, at its end, in this order, every control ghost but the grid / list switch's track (owner,
2026-10-25: "make them more consistent, clean them up"):

1. filters: each a ghost menu button that reads its choice ("All statuses ⌄") and opens its options (was a soft Select,
   the bar's one filled box, a long choice running under its chevron);
2. Sort and group (rule 7), an icon menu;
3. how things are drawn (zoom, style, size). On Components the style is the Cards menu, an icon menu of two
   independent choices (owner, 2026-10-25: "there should just be 1 style of container"): **Container** (Basic, the
   name and Copy on hover, the default) or **No container**; and **Fixed height** (5:4, the default) or **Waterfall**,
   each card hugging its component at its scale with 28 above and below it, between half and 5:4 of its width, dropped
   into the shortest column (`src/gallery/fit.ts`). A taller component gets a taller card, never a larger scale. It was
   nine looks (Framed, Name below, Basic, white, no stroke, Containerless…; 2026-10-22 to 2026-10-25);
4. the grid / list switch.

Zoom is Zoom control's stepper (− Auto +):

- **Auto** (the default) shows every specimen at one scale, 70%, so components keep their real
  proportions to each other (owner, 2026-10-22; was 90% for a control down to 75% for the largest).
  70% is the largest at which the largest group fits a 277 card. A specimen is shrunk further only to fit.
- **Fit** shows each specimen as large as its card allows, up to 200%.
- **Exact steps** are 50, 75, 80, 90, 100, 110, 125, 150, 175 and 200%. − and + step through
  them, starting from 100% on Auto or Fit. The menu lists Auto, Fit and these, nothing else.

**Components tab.**

- **Overview and Single** (owner, 2026-10-25; `docs/research/isolated-view-2026-10-24/variations.md` §10). All is the
  Overview: every family in the Sidebar's order, a section each (its title, tile count and status badge 12 over its
  cards, sections 40 apart), one row of its tiles until "Show all N" (a text control 12 under the cards, on their edge)
  opens every tile in its groups (a group's name 8 over its row, groups 24 apart). Sections draw their cards as they near
  the view, holding their room with empty cards until then. The arrangement's groups set the order but draw no title
  (the Sidebar names them). A card opens that tile alone (Single: the family page on Preview, the Stage at real size);
  Escape, ⌘↑, ⌘[, the Overview button or the breadcrumb's first step go back to the Overview at the family left, its
  section open and the tile selected, with "Back to <family>" at the bar's start, which Escape also does. Opening grows
  the Stage from the card on `slow`; leaving shrinks it into its card on `moderate` (ease-in-out; Motion 0 and reduced
  motion skip both). In the Overview a family's Sidebar row scrolls to its section; a variant's row opens it.
- **Variants in the Sidebar** (owner, 2026-10-25: "legitimate standalone design items"): a family's row opens to its
  Default tile and a branch per group (Variants, Sizes, States …) of its tiles, named by value. Those branches start
  closed; the tile on the Stage opens its family and group. Pinned rows are shortcuts with no rows under them.
- **The bar on a tile**: the Overview button (Grid, its Tooltip with Esc), then the path, Area's Breadcrumb `nowrap`
  (Components › family › tile), its first letter 12 from the button's glyph; then Replay, zoom and previous / next,
  which walk every tile in the Sidebar's order. The bar's start and its controls stay at least 12 apart; the path's
  page is cut first.
- Specimens sit in square cards at least 360 wide, 8 apart, the specimen 24 in. The title
  and a Copy code button sit at the frame's top.
- Every tab's tiles are Asset cards, always square, with the name, a value and controls in
  the frame's first row (owner, 2026-10-19, a trial).
- A family's page opens with its purpose in plain text (the manifest's description), 24 over its tabs, as a
  documentation page opens; the tab bar stands 24 off its panel. It is Area Tabs (`src/family-tabs.tsx`):
  - **Preview** (was Overview; 2026-10-25): the Stage and its code, one tile alone; the family's other tiles are in
    the Sidebar, the bar's previous / next and the Overview;
  - **Documentation**: usage, from `content/documentation/` and the spec;
  - **API**: props from JSDoc, classes, parts, states and CSS properties;
  - **Code**: React source, stylesheet, manifest and every demo;
  - **Spec**: the family's spec.

  Properties stay in the Inspector, on Overview only.

**Theme tab** (Language 2026-10-19 to 20; owner, 2026-10-20: "i want to change language back to theme"). The Canvas
header's first control chooses Setup or Browse (`src/pages/theme.tsx`).

- **Setup** (the default; `src/pages/theme-setup.tsx`, questions in `src/pages/setup-questions.ts`; a questionnaire since
  2026-10-24, a conversation in two panels since the same day: "a 2 panel view with 1 side being a vertically scrolling
  chat like experience ... and then visuals on the right side"; "dont need all these panels open"):
  - **No Sidebar or Inspector** (Workspace `panels={false}`; the saved panels are untouched, so other tabs keep theirs).
    Since 2026-10-28 the chat is a Panel in the Sidebar's place (Workspace `lead`), at the app's scale as the Inspector's
    Chat view, resizable (320 to 560, 400 by default), and the stage is the Canvas (owner, 2026-10-28: "a more compact
    chat panel, just like cursor, claude, chatgpt"; "fix the header on the theme page"). The Canvas header holds the
    stage's controls: Screen or Component and the screen at its start; Setup / Browse, Real or Wireframe and Light or
    Dark at its end, Browse's order. The chat's bar ("Theme setup", Start over, Fine-tune in the Inspector) sits on the
    header's line; there is no row of its own for Setup / Browse.
  - **The chat** (left), built as the Inspector's Chat view: Messages for what Setup says, each chapter's answers in a
    framed, justified Description list (an answer reopens its question, marked as the current one; Done returns to
    where the conversation had reached), and the review with Copy theme. The composer's place at the foot holds the
    progress (Plan, a segmented rail by chapter) over the question, an Approval: numbered choices with a line each, the
    given answer checked, "N of M" in its head, Use the default, Skip chapter and Continue in its foot. 1–9 choose,
    Enter continues; a choice under the pointer or focus is previewed on the stage.
  - **Controls**: choices are the Approval's rows, words only, since the stage draws each choice (owner, 2026-10-28,
    the chat panel); a scale with named marks asks by its marks, and an exact value is set in the
    Inspector (Fine-tune). Swatches, a hue bar, a toggle and checkable pills sit in the card's detail.
  - **The visuals** (right, the Canvas): the view and a bar under it, on a plain ground a step off any page (no
    backdrop, no shadow; the window's own edge is its outline). The Canvas header chooses what is shown, Screen or Component,
    which product screen (Workspace, Analytics, Settings, Phone; `SCREENS` in `src/setup-screen.tsx`), Real or Wireframe
    (words as bars), and Light or Dark; the bar under the view names what is shown and holds the zoom (Zoom control, a stepper;
    Fit returns to the fitted size; a zoom centres on the part the question changes). The Workspace is a real, detailed
    product screen (an issue tracker: projects, issues with statuses, a New issue form, a More menu) drawn as an Area
    figure under the theme so far and the mode the question belongs to; it alone marks the parts a question changes
    (dashed rings settling to a trace) and holds the states it is about, with the pointer where it would be. Component
    shows the question's part alone, whole and large, the screen round it hidden. A choice under the pointer is drawn
    before it is picked ("Previewing …").   - **Motion** (owner, 2026-10-24: "subtle, clean"): a new turn and a reopened question's choices rise 8px and fade in;
    the thread scrolls smoothly to the question; the hint under the cards fades as it changes; the progress fills; the
    visuals crossfade a pick or a hover preview. While a bar is dragged the visuals repaint at most every 180ms; the
    chrome takes the setting 160ms after the drag ends. All of it runs on the app's own Speed and Easing.
  - **Pacing**: chapters in the order a system is built (Page, Accent, Text and room, Shape, Lines, Depth, Interaction,
    Motion, Accessibility, Dark mode); a question is asked only while it can change something under the answers so far,
    and a light/dark pair is asked in light in its chapter and again in Dark mode, the visuals turned to it.
  - **Setup and the Inspector are two ways into the same settings**: every answer is an Inspector setting; what Setup
    does not ask keeps its default. Setup's own UI never changes as picks are made (`Workspace canvasPicks={false}`);
    only the visuals and the choices' pictures take them.
- **Browse** lists the Inspector's own settings (`src/gallery/controls.ts`) in cards at least 200
  wide.
- **Containers.** Asset card is the Components tab's container only; every other tab's tiles are the plain container
  (`src/tile.tsx`, PlainTile): the stripe fill, Card's light edge at stroke-width, no shadow, the name in the first row,
  the edge stepping on hover, the selected edge and the focus ring from the state settings (owner, 2026-10-21).
- Each card shows one real component with real text, showing the one thing the setting
  changes (`src/abstract.tsx`; owner, 2026-10-19: "simple, and easy to recognize").
- Previews are at default size, scaled down (never up, at most 0.8×), with one scale for
  every preset of a setting so they compare. Settings whose change is a line, a corner, a shadow, a state, a row's
  height or a motion are close-ups instead: the real component a little over its size, cropped by the card.
- Type is the ramp of roles with their sizes. Ground and Layers are windows whose card frame
  stays put.
- The page previews one theme, Light by default, with a Light / Dark switch in the Canvas
  bar. Per-theme settings show the previewed theme's own value.

**Inspector.** Views are chosen by pills in its bar (`src/studio.tsx`, InspectorPanel). The
chosen view holds across tabs and launches. A tab with nothing for a view leaves that pill
out.

- **Theme** (Language 2026-10-19 to 20; the tab and the Inspector use one word): the
  Canvas settings under the registry's headings (`SETTING_GROUPS`: Page, Accent, Emphasis, Size, Shape,
  Stroke, Shadow, States, Effects, then Material), only those that change this tab's specimens. A light/dark pair
  (Lightness, Grey tint, Layer contrast, Card shade, Button depth) shows the app's mode's own (owner, 2026-10-22), the
  Titlebar's switch choosing which. An ordered setting is a bar row (owner 2026-10-27, "Keep the Input layout"; was the name and value inside the bar,
  owner 2026-10-24): its name in the label column, the label-inside bar without its text, then its value in a soft
  Input that takes a typed value. Rows are their controls' height, 8 apart; sections are separated by space alone (about
  32 from the last control to the next title's cap); a dimmed row's reason sits behind an info button
  (Toggletip, Field's `labelAction`) after its name, never as a caption (owner 2026-10-27); headings are one word. A row is beside its
  name while its control fits there at its natural width and under it otherwise (Field `auto`); every bar is one row
  with a value field 4 or 5 characters wide; a value in words shows its number there (Temperature -25, Shade +57) and a
  colour range paints its trough (Slider `gradient`); a bar of 3 to 12 steps shows its steps as dots (owner 2026-10-27); named choices are a Segmented beside the label, or under it from three options; a setting with Auto,
  System or Accent shows those with Custom and the bar under them. Values read in their unit ("60%", "8px", "210ms",
  "White"), never a step number; none says "(Default)" (owner, 2026-10-20: "i dont like seeing (default)"). The Theme
  tab is where the default is marked.
- **Design**: what is chosen, at its narrowest: a Canvas item, else the Sidebar's row, else
  the tab's overview. It shows, in order:
  1. the tab's display settings;
  2. a component's Properties;
  3. the preview, unless the Canvas already shows it at size;
  4. actions;
  5. one facts Table.
- **Code**: how to use it, as Figma's Dev Mode shows it. It holds:
  - copy actions;
  - the import and the code in Code block `sm` wells;
  - facts tables (name, token, class, modifiers, attribute);
  - for a component on the Stage, its measured box (Box model) and computed paint,
    re-measured when a setting changes (`src/specimen-box.tsx`).
- **Chat** belongs to the app rather than a tab, so every tab offers it (`src/chat/`).
  - The transcript is the Panel's body, followed to the newest line while the reader is at
    the end.
  - The composer is the Panel's footer.
  - ⌘L opens Chat and focuses the composer; Esc stops a reply.

## Open component gaps

Recorded, not yet built; each needs its own component pass ([Governance](GOVERNANCE.md#1-decide-what-kind-of-change-it-is)).

From the app CSS audit (2026-10-22, `docs/research/cursor-audit-2026-10-22.md` item 10; `npm run check:app-css -w
@area/desktop` lists every rule that still restyles a component, with its gap):

- **Forced state for specimens**: a documented hook that shows hover, focus, lift or pressed at rest, so the Theme
  previews stop painting Input, Card and Menu item from app CSS.
- **Width hooks**: Slider, Slider range, Progress and Radio need a public inline-size hook or a full-width option, as
  Input's `--area-input-inline-size`.
- **Fieldset**: a visually hidden legend option.
- **List box**: a grid option whose content draws its own frame (no plate), for the app's plain tiles.
- **Button**: a text-size hook and a coloured shadow for the Abstract board's reference pieces, or the pieces move their
  paint to tokens on the scene's scope.

Earlier: the 2026-10-12 audit's gaps were all built on 2026-10-15 (Copy button, List box, Hover card `openOnFocus`, Table cells, Badge `onColor`,
Nav `revealActions`, Context menu `itemSelector`, Card selected, Titlebar and Section heading). Record new ones here.

