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
   - Painted (colour cards): their one outline, the swatch picker's 10% hairline, steps to the
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
18. **The app is drawn in the choices it offers** (owner, 2026-10-22: "make sure the electron ui is a reflection of
    the actual choices"). `<html>` carries every committed Inspector setting and the Material, type and density
    included (owner, same day: "when i change from compact to default the ui in the electron doesnt change"), so the
    Titlebar, Sidebar, Inspector, the app's chrome inside the Canvas (`appScale()`, `src/app-scale.ts`), the window's
    ground and its traffic lights (centred on the Titlebar) follow them (`src/studio.tsx`). A hover preview repaints the
    Canvas alone. The Theme tab's own body is the one exception (Setup, below).

## The app's layout

How rules 11–17 lay out the app's regions (`apps/desktop/src`). Values are at type 13, Compact,
the scale the layout was measured at; the app now takes the chosen type and density (rule 18).

**Shared line and insets.**

- There is no title over the Canvas or the Inspector; the Sidebar's selected row names what
  the Canvas shows.
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
  Spacings grow outward: cards 12 apart, at least 260 wide (277 to 300 in a 1440 window), at most four across (owner, 2026-10-22: "more like a gallery", "280 to 300 px
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

**Canvas header**, at its end, in this order:

1. filters;
2. Sort and group (rule 7);
3. how things are drawn (zoom, style, size). On Components the style is the Container menu: Asset card's container,
   caption, fill and edge in eight looks (Framed, the default; Name below; Basic; Basic, name below; Basic, white; Basic,
   no stroke; Containerless; Containerless, name below; owner, 2026-10-22);
4. the grid / list switch.

Zoom is Zoom control's stepper (− Auto +):

- **Auto** (the default) shows every specimen at one scale, 70%, so components keep their real
  proportions to each other (owner, 2026-10-22; was 90% for a control down to 75% for the largest).
  70% is the largest at which the largest group fits a 277 card. A specimen is shrunk further only to fit.
- **Fit** shows each specimen as large as its card allows, up to 200%.
- **Exact steps** are 50, 75, 80, 90, 100, 110, 125, 150, 175 and 200%. − and + step through
  them, starting from 100% on Auto or Fit. The menu lists Auto, Fit and these, nothing else.

**Components tab.**

- All shows one card per family, its default specimen; a click opens the family.
- Specimens sit in square cards at least 360 wide, 12 apart, the specimen 24 in. The title
  and a Copy code button sit at the frame's top.
- Every tab's tiles are Asset cards, always square, with the name, a value and controls in
  the frame's first row (owner, 2026-10-19, a trial).
- A family's page opens with its purpose in plain text (the manifest's description), 24 over its tabs, as a
  documentation page opens; the tab bar stands 24 off its panel. It is Area Tabs (`src/family-tabs.tsx`):
  - **Overview**: the Stage, its code, then the tiles, one section per group (Default, Variants, Sizes …), each its
    heading over its own row of cards;
  - **Documentation**: usage, from `content/documentation/` and the spec;
  - **API**: props from JSDoc, classes, parts, states and CSS properties;
  - **Code**: React source, stylesheet, manifest and every demo;
  - **Spec**: the family's spec.

  Properties stay in the Inspector, on Overview only.

**Theme tab** (Language 2026-10-19 to 20; owner, 2026-10-20: "i want to change language back to theme"). The Canvas
header's first control chooses Setup or Browse (`src/pages/theme.tsx`).

- **Setup** (the default; `src/pages/theme-setup.tsx`, questions in `src/pages/setup-questions.ts`; rebuilt 2026-10-24
  as a questionnaire: "really focusing on a detailed questionnaire process ... the exact correct visual for each
  question, to show exactly how the choices change"):
  - **The panel** (left of the Canvas) shows one step at a time: a welcome that chooses the path (Essentials, 14
    questions, or Every detail, every setting) and lists the chapters; an opening card per chapter (what it decides, its
    questions with their answers, Skip chapter, Begin); each question (progress by chapter and time left, the question,
    one sentence on what it changes, its control, now and then a note); a review of every answer by chapter (changes
    in bold, each a way back), with Copy theme and Fine-tune (the Inspector). Back, Default (reset this answer) and
    Continue sit at its foot.
  - **Controls** by what is chosen, kept to pictures (owner, 2026-10-24: "less text overall, more simple and visual
    choice based"): choice cards are a picture and a one- or two-word name, nothing else; what the choice under the
    pointer (or the picked one) is for, and whether it is the default, is one line under them. A picture is a close-up
    of the product screen under that choice, drawn as shapes alone (no word bars; bars where the text is the question,
    real text where its colour is), at one scale for every choice; a part small enough is shown whole with the screen
    round it veiled in the page colour, a large region is cropped. Other controls: a large bar with named presets
    (saturation, edge strength, shadow reach and softness, grey strength), a toggle with a bar for how much (text tint,
    label tint, soft edge, field lift, edge light), swatches and a hue bar (accent, tint colour), checkable cards (pills),
    a Switch moving at the speed and curve (motion, easing). An exact value folds under the cards. Each question has one
    short sentence under it.
  - **The stage** (right) is one product screen (`src/setup-screen.tsx`): a desktop window drawn as an Area figure
    (the area-illustration skill's engine: words as bars, numbers as digits, strokes at 1px), in the theme so far and
    the mode the step belongs to. The parts a question changes are ringed (dashed, in the stage's ink, settling to a
    trace); the states it is about are held (the menu open, a field focused, a row hovered, a card selected or lifted,
    a button pressed) with the pointer where it would be. A choice under the pointer is drawn on the stage before it
    is picked ("Previewing …"). A narrow Canvas stacks the stage above the panel.
  - **Motion** (owner, 2026-10-24: "subtle, clean"): a new step fades in and slides 16px from the side it comes from
    while the old one fades out drifting 8px away; the hint under the cards fades as it changes; the progress fills; the
    stage crossfades a pick or a hover preview and marks what a step changes. While a bar is dragged the bar follows
    the pointer on every frame and the stage and pictures repaint at most every 180ms (each themed screen costs about
    60ms to restyle); the chrome takes the setting 160ms after the drag ends. All of it runs on the app's own Speed and
    Easing, so reduced motion cuts it.
  - **Pacing**: chapters in the order a system is built (Page, Accent, Text and room, Shape, Lines, Depth, Interaction,
    Motion, Accessibility, Dark mode); a question is asked only while it can change something under the answers so far
    (Text tint while the greys are neutral, Fill shade while the accent shows nowhere), and a light/dark pair is asked in
    light in its chapter and again in Dark mode, the stage turned to it. The Sidebar is the outline: every question on
    the path with its answer.
  - **Setup and the Inspector are two ways into the same settings** (the Canvas's): every answer is an Inspector
    setting and reads there at once; what Setup does not ask keeps its default. The header chooses the path and the
    stage's mode, apart from the app's own (owner, 2026-10-24).
  - **The setup's own UI never changes as picks are made**: the Canvas body restates the defaults over the app's picks
    (`Workspace canvasPicks={false}`); only the stage and the choices' pictures take them. The chrome around it follows
    the picks (rule 18).
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
  Canvas settings under the registry's headings (`SETTING_GROUPS`: Page, Accent, Where it paints, Size, Shape,
  Stroke, Shadow, States, Effects, then Material), only those that change this tab's specimens. A light/dark pair
  (Lightness, Grey tint, Layer contrast, Card shade, Button depth) shows the app's mode's own (owner, 2026-10-22), the
  Titlebar's switch choosing which. An ordered setting is a bar (Slider `variant="field"`, owner 2026-10-24), its name
  and value inside; named choices are a Segmented beside the label, or under it from three options; a setting with Auto,
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

