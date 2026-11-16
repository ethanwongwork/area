# Four real products rebuilt from Area (2026-11-10)

Owner: "can you recreate chatgpt, notion, cursor, and claude ui using all area components and design system and
evaluating if everything works, how clean and polished it looks, what is missing from area, what area components are
lacking, what design fundamentals or principles or skills are missing … tested at real scale, not just fake pages with a
bunch of random components shown as examples."

## What was built

Four main windows at 1440 × 900, each one real moment with real content, in Patterns (System › Patterns) and in
`apps/desktop/src/content/examples/`:

| Screen (Patterns name) | Rebuilds | File | Root settings |
|---|---|---|---|
| Chat assistant | a chat assistant's window mid-conversation | `product-chat.tsx` | Area's defaults |
| Document workspace | a document and database workspace | `product-docs.tsx` | Area's defaults |
| Code editor | a code editor with an agent pane | `product-editor.tsx` | Type 13, Density 28 |
| Assistant with a document panel | an assistant with an open side document | `product-assistant.tsx` | Grey = Warm |

Rules each was built under: every control, surface, text style and color is an Area component or token; the screen's own
CSS (`apps/desktop/src/styles/product-*.css`) is layout only, with no selector on an `.area-*` class, no literal color,
type size, weight, radius or shadow; where a component could not do what the product does, the nearest honest thing was
built and the gap recorded, never a CSS workaround. The screens carry no product names or logos.

Looked at in a hidden Electron window at one device pixel per design pixel (the viewer at 100%), light and dark.
Not compared pixel for pixel with the products: screen capture of other apps is not available here, so likeness is
judged against the measured notes in `.claude/skills/area-ui-compose/references/` and the code editor's own stylesheet.

## Verdict

At real size the four screens read as clean, calm and consistent with each other: one type family, one row rhythm, one
edge, one set of icons, and dark mode holds without a single repair. Sidebars, nav rows, messages, the composer, code
blocks, tables, badges, tags, the plan and edit-summary cards and the status bar all work as drawn.

They do not yet read as the products. What separates them is the same short list on every screen:

1. **Hierarchy is flat.** The heaviest weight is 500 and there is no size between 26 and 52, so a page title, a reply's
   heading and a section heading all sit close to body text. The document's title is the clearest case: 26 at 500 where
   the product draws 40 at 700.
2. **No region depth at the defaults.** At Layer contrast 0 the sidebar, the page and the panel are one color, and in
   dark all are pure black, so the window reads as one sheet with hairlines. Every one of the four products separates
   its sidebar from its content by tone.
3. **No reading voice.** One sans face. The assistant's serif replies cannot be made, and reply text sits at 15 in a
   pane whose chrome is 13, with no rule for when a reply drops to the pane's size (the editor's agent pane shows it).
4. **The shell is hand-built every time.** Window grid, thread column, composer dock, account row, content header, pane
   header: each screen wrote the same layout CSS again, with slightly different numbers.
5. **Density stops at 24.** The editor's 22 rows, 22 status bar and 35 title bar are out of reach; Area gives 24, 24, 39.
6. **Content has no edges.** A thread ends flush against the composer (no fade or scroll edge), and nothing marks more
   content above or below.

## What Area lacks, ranked by how many screens it blocked

**Layout parts (all four screens)**
- An app shell: sidebar, content header, content, optional side pane, optional foot bar, with the window controls' room.
- A thread: the centered column, turn spacing, the docked composer and the fade above it. Chat, editor and assistant
  each rebuilt it.
- An account row: avatar, name, a second line, one pressable row that opens a menu. NavItem has no description line.
- A pane header with a start, a centre and an end. Panel's bar has `title` and one `action`; Titlebar has children and
  `end`; neither has a centre. The assistant's document panel put five controls in one slot.

**Type and color roles**
- Weights above 500 (600 and 700), and a title step between 26 and 52.
- A heading role inside Message (replies' headings have spacing but no size or weight of their own).
- A reading face, and a rule for reply size by pane width.
- Code colors beyond six roles (no number, function, type or property).
- A status ink for terminal and log lines.

**Components**
- Editor tab strip: tabs with a close button, an unsaved dot, no panels. Tabs cannot hold an action per tab.
- Status bar: a 22 row of plain text items.
- Terminal or log view.
- Inline diff with per-hunk actions; CodeBlock numbers removed lines as real lines and has no start line.
- Document blocks: prose, quote, callout without a status role, a page icon, a struck to-do.
- A compact reference row: a 32 icon tile, a name, a kind, one action. Card's thumbnail is 84.
- A rating pair (good, bad) that is exclusive.

**Props and slots on existing components**
- Message: an attachments slot; a bubble width that follows its container (fixed at 70% / 456).
- Composer: a replaceable primary button (voice); one home for the model picker across layouts.
- Table: an add row, a footer or summary row, an icon in a header cell.
- TreeView: `revealActions` (NavItem has it), a label or heading, open and closed folder icons.
- Breadcrumb: an icon per item.
- Tabs: icon only; a strip without panels.
- Panel: window controls' room (Titlebar has it); a seam that does not depend on `resizable`; `maxWidth` defaults to 500
  and silently caps a wide pane.
- Approval: two plain buttons as well as numbered rows.

**API consistency** (friction, not gaps)
- Icon-only is spelled three ways: `iconOnly` on Button and Segmented, absent on Tabs, implied on NavItem.
- Width is a prop on a resizable Panel and a custom property otherwise; Composer's width is a custom property too.
- CopyButton takes `label`; every other icon button takes `aria-label`.
- Table has cell components, but existing screens use raw `th` and `td`.
- PropertyList sounds like page properties and is a reorderable settings list; DescriptionList is the fit.
- The density attribute takes `28`, where the docs' words suggest a name.

## Fundamentals, principles and skills that are missing

- **A hierarchy rule.** Nothing says how many levels a screen needs and what separates them (size, weight, ink, space).
  The ramp tops out early and the builders had no guidance beyond "use a title token".
- **Region separation as a default, not a setting at zero.** The compose skill describes tones, rules and raised layers,
  but the shipped defaults give none, so a screen built at the defaults has no depth.
- **Scroll edges and overflow.** No rule or part for what happens where scrolling content meets a fixed bar.
- **Product-level compositions.** `screens.md` lists recipes in words; there are no built shells to start from, so each
  screen re-derives the same grid. A shell, a thread and a document page as real compositions would remove most of the
  layout CSS in these four files.
- **Fidelity checking against the product.** The repo measures components one at a time. There is no step that puts a
  whole built screen beside the product's own window and lists the differences, and no captured whole-window references
  for these four products to do it with.
- **A density floor decision.** Whether Area serves 22-row tools at all is undecided; today it cannot.

## Fixed while looking

- The chat thread ran under the composer: it now scrolls in its own row.
- The document's view tabs and its tools sat 8 apart vertically: aligned.
- The assistant's reference card used an 84 thumbnail for a small file mark: now a plain card with its words and Open.

## Not verified

- No side by side with the real products (no screen capture of other apps here).
- Hover, focus, menus open, and narrower windows were not exercised; these are still frames.
- Values the builders used without a measurement are listed in each screen's CSS as `/* pick */`.
- The document workspace is taller than 900, so its top (title, properties) and foot were seen only in part.

## Hierarchy and depth, built (2026-11-11)

Owner picked "Hierarchy and depth" from the two largest gaps.

**Added to the system (additive: no existing component moves a pixel):**
- `--area-weight-heading` (600), in `packages/tokens/src/axes/typography.ts`: a document's title and headings, a long
  reply's headings. Strong (500) stays the interface's emphasis weight.
- `--area-title-xl-*`, in `axes/type-size.ts`: a page's own title, 2.5 times the base: 30/38, 32/40, 34/42, 37/46, 40/48
  for Type 12 to 16, on the size ramp's own steps.
- The rules in `docs/DESIGN_SYSTEM.md` (type section): where each is used, and how a region takes its ground.

**Applied to the four screens:**
- The document's title is `title-xl` at 600 (was 26 at 500); its H2 and the chat reply's heading are 600.
- Each sidebar is the window's chrome on the recessed ground (`data-area-chrome`, `data-area-ground="recessed"`,
  `--area-chrome-fill: var(--area-bg-subtle)`). The builders had not found this: it is two attributes and a custom
  property, not a prop, and only `shell.md` mentions it.
- Each screen sets Layer contrast 50 in light and dark on its own root, as its recipe. Area's default stays 0.

**What the captures show (chat screen, Layer contrast 0 / 30 / 60):** in light the sidebar is the page at 0, a faint tone
at 30 and a clear one at 60; code blocks, the bubble and the composer do not change in light. In dark the sidebar barely
moves at any value while code blocks and the composer lift, so dark still reads as one sheet: on a near-black page the
subtle ground has almost no room. That is the same finding as the customization study's (dark shadows and layers show
few levels) and needs a decision of its own.

**Still open:**
- Whether Area's default Layer contrast moves off 0 (the owner's pick of 2026-10-26). Not changed.
- Whether a reply's headings take 600 everywhere. The app's own chat keeps one style, `title-xs` at strong (the
  owner's "too many type styles", 2026-11-02); only the product screen uses 600.
- Message still has no heading role of its own: the app and this screen both set it from outside.
- A prop for a chrome region on Panel, in place of two attributes and a custom property.
- Dark region separation on a near-black page.

## Light Layer contrast defaults to 50 (2026-11-11)

Owner, asked whether the default should move from 0 to 50 in light: "Yes, 50 in light". Dark stays 0.

- `packages/tokens/src/color/layers.ts`: `DEFAULT_LAYERS_LIGHT = 4` (position 50), `DEFAULT_LAYERS_DARK = 0`; the axis
  reads one per theme. The four screens no longer set their own value.
- Two contrast tests failed at the new default, on the darkest light ground a shipped theme now paints (#f1f3f5, the Cool
  neutral's control hover; the sidebar's own ground, #f7f7f7, passed). Fixed at the source, with no test changed: chart
  series marks are solved for that ground (pink and purple step one deeper in light), and the charts' danger red is
  #ff4849 (was #ff4a4b; 2.98:1 before, 3.01:1 now).
- Checks: token tests 40,131, React 780, desktop 83, output 13, contracts 9, typecheck. Seen in a hidden Electron window
  with a fresh system: the app's Sidebar, the analytics dashboard, the chat screen and the editor, light; chat in dark.
- A saved system keeps the value stored in its file, so an existing system stays at its own Layer contrast until it is
  changed or reset.
