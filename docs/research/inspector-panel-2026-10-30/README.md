# Inspector panel research (2026-10-30)

The owner asked: work on the Inspector (the far-right panel), make it "pretty flexible in terms of what it shows …
adaptable, with tight, consistent margins, spacing, and overall visual balance", after Cursor's and Claude Code's
panels, file explorers and code containers.

**Status (2026-10-30):** the owner picked Build for 1, 2, 3, 5 and 6 and No for 4 (stacked panes); facts packed at 26,
section titles kept at 13/500, sections flat. All five are built (uncommitted); each component's spec has a review
note for what was built and where it differs from the proposal below.

Files in this folder:

- `cursor.md` has Cursor 3.27.22's values: pane headers, the Agents window's panels, the file tree, code, shell and
  diff blocks, key/value trays, and the spacing, type and colour roles. Each value is read from the installed bundle.
- `claude-code.md` has the same for the Claude desktop app's Code tab (3.6556.2): rail cards, the Context meter, pane
  headers, Background tasks, the Files tree and command blocks. Each value is read from `ion-dist`.
- The review page with mockups and picks is linked in the handoff.

## Area's Inspector today

Measured in the browser preview at 1440 × 900, type 13 Compact, light, using `getBoundingClientRect`. The captures
are at 2× in headless Edge, light and dark: Components Theme, Accordion Design and Code, and Home Design.

| Part | Value |
|---|---|
| Panel | 272 wide (saved width), 1 edge; text column 14 from the edge (content 244) |
| Bar | 47; view pills 26 tall, the first at 10 |
| Section heading | 38-tall row (26 + 12 air), 13/18 w500 default ink |
| Control row | Field `auto`, 26 tall, 8 apart (34 pitch); label 13/18 muted in a 40% column (95); control from 116 |
| Facts | a framed Table (border, radius 12), rows 32.5–33 with rules, term column `fit` to the longest term |
| Code | Code block `sm` in a frame (language header "tsx", copy icon), mono 12; long lines are clipped at the frame with no fade |
| Actions | "Copy code" and "Copy import", outlined, two to a row, above wells that each have their own copy |

### What doesn't hold together

1. **Values start in four places.** A control starts 116 from the panel's edge. A fact's value starts at 104 on the
   Accordion's Tile table, 95 on its Class table and 123 on Home's table. Each Table fits its own term column, and
   Field's column is 40% of the content width. Nothing ties these together.
2. **The text column breaks inside frames.** Table terms sit 25 from the panel edge and code 22, while every other
   text sits at 14. Frames inside a frameless panel give boxes inside a box, which the owner ruled against for dividers
   on 2026-10-25.
3. **Two rhythms.** Controls are 26 rows 8 apart. Facts are 33 rows with rules between them.
4. **Duplicate actions.** The Code view has two outlined copy buttons above wells that already carry copy controls.
5. **Long values fit badly.** Tile › Note wraps to 7 lines in a 120-wide value column. `.area-accordion-item` breaks
   into two chips.
6. **Panes can't stack.** One view shows at a time. Cursor and Claude both stack several panes in the right column,
   each with its own header, and size them against each other.

## What the references agree on

Each value is cited in the two files beside this one.

| Topic | Cursor | Claude Code | Reading for Area |
|---|---|---|---|
| Pane header | 40 tall, padding 0 10 0 8, 1px rules (Agents window); VS Code sections 22 | 32 tall, padding 4, title 13 regular **secondary**, icon buttons 24 at **2** apart | A pane header is a short row: a muted title and 24 icon buttons |
| Section title | 12/16 w400 secondary | card title 12/15 medium primary; group label 12 muted | Both use colour and size for titles, not weight at body size |
| Row | key/value 28 min, 1 apart; tree 24 | every row at least **26**, padding 4, gap 8 (key/value 12) | 24–28 rows with almost no gap between them |
| Key/value | label primary, value **tertiary, tabular**, actions take the value's place on hover | label secondary, value at the end; numbers in a fixed **44** column, tabular | Values in one column, numbers tabular |
| Code | radius 12, 1px 12% rule, 12/18 mono, padding 6 10, copy at 4/4 on hover | radius 8, 12/17 mono, **max 200** then scroll | Copy on hover, a fixed inset, a height limit |
| Command | `$` tertiary, 13/18 mono, output collapsed to **5 lines** with a 16 fade | `$` secondary (not selectable), wraps; output on a 10% fill, 8/5 padding | A command block and its output are a variant of the code block |
| Tree | 24 rows 1 apart, indent 8 + 8 per level, 20 icon slot, status letter or ±N at the end, compact folders | 24 rows, indent 8 + 10 per level, 1px guides on hover, icon gap 4 | A dense file-tree row; guides on hover |
| Grouping | flat sections; tinted or elevated groups at radius 12 in settings only | rail cards: ring radius 10, padding 8, **10** apart, title row 26, collapse caret, summary while collapsed | Two models: flat sections or cards |
| Meter | 5-tall segmented bar, 12 legend swatches | 4-tall stacked bar, 1px seams, 10 swatches, legend rows 24, % in 44 | A stacked meter with a legend list |
| Splits | 1px seam, 2px on hover | 12 hit band, a 3px pill up to 48 long that shows after 200ms | Panes resize at a seam that draws nothing at rest |
| Scroll | overlay bar 6; fades 16 (output), 8 to 24 (tabs) | thin bars; a 28 fade token | Fade an edge only where content is clipped |

## Proposal

These are ranked. Each item names the parts it touches. Nothing here is built.

1. **One Inspector grid** (Panel, Description list, the app's `Facts`). Panel gets one label column,
   `--area-panel-label` = 40% of the content width less the cluster gap (today's Field share, 95 at 272). Field and
   Description list both read it, so every control and value starts 116 from the edge, in every view. Facts become an
   unframed Description list `columns`. Its rows sit on the control row's height (26), and numbers are tabular. Long
   prose (a tile's note, a family's purpose) moves out of the value column into a muted note under the list.
2. **Code in the Inspector** (Code block). The well spans the text column with its frame at radius 8, the panel's
   control corner. The copy button appears on hover at 4/4. Long lines fade 16 at the end edge. Past a set height the
   block shows the top 5 lines and a Show more. New `command` and `output` looks: a muted `$` that can't be selected,
   wrapping lines, and output on the soft fill. The outlined Copy code and Copy import buttons go.
3. **Section headings carry more** (PanelSection). A count or value at the end ("3", "11% used"). Actions appear on
   hover except a pinned one. Group labels inside a section are muted, at Sidebar group-label size.
4. **Stacked panes** (a new Panel composition). The Inspector column holds one or more panes. Each pane has a 32
   header with a muted title and 24 icon buttons (maximise, close). Panes resize at a seam with Claude's hidden pill
   handle. A pane collapses to its header. The view pills choose what the top pane shows.
5. **Stacked meter** (Meter `segments`). A bar of parts with 1px seams. Under it, a legend of 24 rows, each a swatch,
   a label and tabular numbers in fixed columns. Uses: a system's unpublished changes by kind, a library's status
   counts, a page's token use.
6. **File-tree density** (Tree view). Rows at the control height, indent 8 + 10 per level, guides on hover, and a
   trailing status (a letter, or +N −N in git colours, tabular). This serves a project's Pages and layers, and a Files
   pane.

Open for the owner:

- Fact rows packed at 26, or at the controls' 34 pitch?
- Section titles at 13/500 ink (today), or quieter like Cursor and Claude?
- Flat sections (today, Figma and Cursor) or Claude-style cards?
- Which to build first.
