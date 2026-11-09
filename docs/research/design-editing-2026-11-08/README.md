# Direct editing of designs (2026-11-08)

Owner: "fully editable vector figma code canvas (everything except an infinite canvas, each design is isolated to its own
container only)". One of the three priorities from the 2026-11-07/08 scope review. Research, options with ranked
recommendations, and the first working slice, built in worktree `design-direct-editing-b4f631`.

Review page (private, picks in `verdicts`): see the handoff entry for its link.

## Where it started (PR #211)

A project page's layer sits on a stage (`design-viewer.tsx`) over the design panel. A click selects an element
(`design-select.tsx`); the Inspector's Design view edits its props, words, layout, fill, type and corner as tokens
(`design-edit.ts`); each edit is a `DesignChange` drawn as an override on the screen's code, undoable from the log and sent
to Chat in one batch. A layer is a screen from Patterns (code in `src/content/examples/`) or an image. Nothing could be
added, moved, resized, typed in place or drawn.

## Research

Three reading notes, each value cited to a URL or a pinned source line:

- [open-source-measures.md](open-source-measures.md): handles, hit areas, snapping, drag thresholds, nudge and keys read
  from Penpot `904cdd97`, tldraw `69f43954` (5.6.0), Excalidraw `701b901a` (0.18.0), Onlook `423e2e92`, Grida `219f40bc`.
- [figma.md](figma.md): the vector tool's documented behaviour (auto layout, Hug / Fill / Fixed, selection, nudge, measure,
  text, shapes, booleans, components, Code Connect) and its colour tokens from the installed app's bundle. Its canvas is
  drawn by the web app, so handle size and stroke width weren't readable without a live 1× capture (needs the owner's
  sign-in; not asked for this slice).
- [code-backed.md](code-backed.md): how Onlook, Plasmic, Subframe, Webflow, Framer, Paper, Penpot and Builder / Puck keep
  (or don't keep) code as the source while editing visually.

What decided things:

1. **Every tool that edits directly and reliably keeps its own tree and writes code from it** (Plasmic, Puck, Webflow,
   Framer, Penpot, Subframe for pages). The one that keeps code as the source (Onlook) instruments every JSX element with
   an id and edits the syntax tree, and pays for it: elements made by `.map` or conditions can't be deleted, computed
   classes can only be appended to, and it assumes Tailwind. Area's own overrides-plus-agent is the shape of Subframe's
   and Builder Fusion's live edits: fine as a hand-off, not as an editor (an edit applies only when an agent writes it).
2. **Child-index paths break on the first insert or move.** Every tree model names nodes by stable ids.
3. **The handles are the same size everywhere**: 8 drawn, a 16 hit (median; Penpot 20, Onlook 20, Grida 16, tldraw 13.5),
   an 8 side band, 1 stroke, constant on screen at any zoom. Snap within 8 screen pixels (Penpot 10, tldraw 8, Excalidraw
   8). Nudge 1 and ⇧10. A click with a shape tool makes 100 × 100 (Penpot `drawing/common.cljs:91-92`). Double-click or
   Enter edits words.
4. **Auto layout's rules** (the vector tool's docs): a child reorders by drag (a blue line shows the drop) or the arrow
   keys; a manual resize makes that axis Fixed; Hug belongs to frames and Fill to children; an absolutely placed child
   ignores the flow; ⌘D duplicates after the original inside auto layout; one undo per drag is not documented anywhere.

## Recommendations (ranked; the first of each is built)

### 1. The design document

| | Option | For | Against |
|---|---|---|---|
| **A (built)** | **A layer's own tree** (`src/design-doc.ts`): element (tag, Area's classes, attributes, style; an svg's drawing whole), component (a system component by its React name, its props and words), text, shape. Ids `n<number>` that never change. Saved in the layer (`Layer.doc`). | Every edit is exact and undoable; components stay components; JSX is written from it; the agent and the tools share one vocabulary | A screen and its project layer part ways after the first edit (the layer remembers where it came from) |
| B | Code as the source, edits written to the screen's TSX through its syntax tree | One source | Screens belong to the system, not a project, so a project edit would change Patterns; the `.map` and condition limits above |
| C | Today's overrides only | Nothing to build | No insert, move, resize or drawing |

Recommended **A**, with Puck's lesson (`code-backed.md` § 8): the tree is the data; real React components draw it. The
document's top nodes are drawn inside the screen's specimen exactly as the code drew them, so element paths are the same
either way and `DesignChange.path` keeps its meaning.

**Migration (built): read the drawn screen on the first edit.** Until then a screen layer is drawn from its code, as today,
and a clean copy is drawn hidden in the stage and read into a design (`design-capture.ts`). React's own record of each
element says which system component drew it and with which props, so a Button stays `Button` with `variant="soft"` and an
icon prop stays `<AddIcon />`; a component whose props can't be saved (a function child, a list of elements) stays markup.
The analytics screen read back as 775 of 775 nodes, the same tags, classes, attributes and words; the differences are
React's generated ids, a dialog trigger's `aria-controls` (wiring, left out on purpose), and sub-pixel plate positions.
The overrides already logged on the layer are replayed onto the design and keep their place in the log, now undoable.

Options for the owner: migrate on the first edit (built) · an explicit "Edit as a design" action · at the moment a screen
is added.

### 2. Edit operations and the undo stack

Built: four operations (`patch` a node's own fields, `insert`, `remove`, `move`) and `batch`. Applying one returns the
design after it and the operation that undoes it. Every edit is a `DesignChange` with three new optional fields, `node`,
`op` and `undo` (the old shape is unchanged, so Chat, Flows' `link` and older files keep working). Its `property` is the
same vocabulary as before (`prop:variant`, `text`, `type`, `style:gap` …) plus `insert`, `remove`, `move`, `size` and
`position`.

- **The log** merges a second change to a node's property (keeping the first's undo) and drops one put back. Removing a
  thing added since the last send takes its insert and its other changes out of the log, rather than logging both. Its
  Undo works in any order: it applies that change's undo, and changes to anything that undo removed leave with it.
- **The stage's ⌘Z / ⇧⌘Z** step back and forward through the edits made here, in order (200 kept per layer while the
  project is open). One drag, one resize, one words session, one nudge each are one step.
- **Iterations**: a run of edits to one design is one iteration ("Edited Analytics dashboard") until it rests a minute
  (`EDIT_RUN_MS`), so a held nudge doesn't fill the gallery; every edit is still in the log and the undo.

### 3. Insert from the system

Built: **Insert** in the stage's bar (⇧I opens it): the system's components (Button, soft Button, icon Button, Link, Badge,
Tag, Count, Key, Input, Checkbox, Switch, Avatar, Progress, Spinner, Separator), a frame down or across, text, a rectangle
and an ellipse, each with its example copy. A click inserts into the chosen frame at its end, else after the chosen thing,
else at the end of the screen's top frame (the survey's quick-insert rule).

Next (option): a searchable list of every family from the Components catalogue, with drag to place; a component's own
slots as drop targets.

### 4. Move, reorder and resize

Built:

- **Drag** a chosen thing past 4 screen pixels. In a frame's flow it reorders: the drop is the frame under the pointer
  (into another frame too), its place the first sibling past the pointer along the frame's direction, shown as a 2 line
  between siblings (the survey's line placeholder: no layout shift while dragging). A shape placed in its frame moves
  freely and snaps to the frame's edges and centre within 8 screen pixels, with guides (⌥ turns snapping off).
- **Handles**: eight, 8 drawn with a 16 hit; a side keeps only its corners under 24. A resize sets that axis Fixed (width,
  height and `flex-shrink: 0` in a flow; left and top too for a shape dragged from its top or left); ⇧ keeps the proportions.
- **Arrows** reorder in a flow (the vector tool's auto-layout rule) and nudge a shape 1, ⇧10.

**Layout controls** (owner, 2026-11-08: "go with recs", the Next pick; built after the slice):

- **Width and Height** in the Design view's Layout: Hug, Fill or Fixed beside its length (the vector tool's W and H). The
  mode follows the element's place: along a flex frame's direction Fill grows (`flex: 1 1 0`, `min-width: 0`), across it
  Fill stretches (`align-self: stretch`), in a block Fill is the whole width; Fixed is a length the frame doesn't squeeze
  (`flex-shrink: 0`); Hug is `fit-content`. Each clears what the other two set (`sizeStyles`, design-doc.ts). Typing a
  length makes it Fixed; ↑↓ step it 1, ⇧10. A shape placed in its frame is Fixed only; a block's height can't Fill; a
  grid's cells are sized by the grid, so they have no rows. Fill is read by letting the element go for a moment and
  seeing whether it gets smaller, so a control as deep as its row reads Hug, not Fill.
- **Handles**: a resize is Fixed (and stops a Fill from growing); a double-click on a side's handle makes that axis Hug.
- **Padding and gaps on the stage**: a chosen frame's four paddings and the gaps between its children each have a bar
  (2 by 12, hit 16) at their middle; hovering or dragging it tints the space. A drag snaps to the space ramp (0, 2, 4 …
  96), so a space stays a token; ⇧ sets every side, ⌥ the opposite side too; the size pill reads "Padding left 24". One
  side becomes its own longhand (a `padding` shorthand is split into four first, `padSides`). A padding's bar shows from
  20 screen pixels deep (clear of the side's resize handle) and a gap's from 4; smaller spaces change in the Design view.
- **Snapping to siblings**: a moved or resized shape snaps its edges and centre to the frame's and to each sibling's
  edges and centre within 8 screen pixels, a guide drawn from the shape to what it meets.

Next: ⌘ to drop into a nested frame, ⇧-click multi-select with align and distribute, equal-spacing snaps, ⌥-hover
distances.

### 5. Words in place

Built: double-click words to edit them where they are (the element becomes `contenteditable="plaintext-only"`, all
selected); Enter or Esc keeps them, a click away keeps them. One words session is one change. Words a component draws
from a prop (a SectionHeading's title, a Checkbox's label) change that prop. The T tool adds a paragraph in the reading
style and goes straight into it.

### 6. Rectangles, ellipses, the pen and booleans

Built: R and O draw a shape (drag, or click for 100 × 100) into the deepest frame under the pointer, placed absolutely in
it (the frame becomes its positioning box), painted `bg-component` with a control's corner. F draws a frame into the flow.

| | Option for shapes | |
|---|---|---|
| **A (built)** | Placed in their frame (absolute): what you draw is where it is | Decorative shapes don't push the layout around |
| B | In the flow like any child | Every shape reflows its frame, which a vector tool never does |

Next, recommended: **the pen** as a `vector` node holding an SVG path (points with in and out handles, the vector-network
idea limited to one path per node to start), drawn in the frame's coordinates, with the system's stroke width and roles;
**booleans** (union, subtract, intersect, exclude, ⌥⇧U/S/I/E) as path operations over two or more vector nodes, kept as
a group that can be flattened. Both need a path library (paper.js or a small polygon-clipping package) chosen at intake.

### 7. Snapping and guides

Built: a moved or resized shape snaps to its frame's and its siblings' left, centre and right and top, middle and bottom,
8 screen pixels; guides are 1 lines in the selection blue from the shape to what it meets. Reorder needs no snapping (the
drop line is the guide).

**Colour (owner, 2026-11-08: "a brighter more vibrant blue").** All of the stage's chrome (outlines, handles, name
tag, size pill, drop line, guides) is the vector tool's selection blue, its ramp blue-500 read from its app bundle:
`#0d99ff` light, `#0c8ce9` dark, white words on it (`figma.md`). It was Area's indicator role, which the Accent strength
setting mixes toward grey; the chrome belongs to the tool, not to the design under it. White on `#0d99ff` is about
3.0 : 1 (3.5 : 1 on the dark blue), under 4.5 for the 11 tag text, as in the reference.

Picked (owner, 2026-11-08): guides in the **selection blue**, not a separate measure red. Next: equal-spacing snaps and
⌥-hover distances.

### 8. Keys

| Key | Does | Source |
|---|---|---|
| V F R O T | Choose, frame, rectangle, ellipse, text | the measured editors' shared keys (O for ellipse: tldraw, Excalidraw, Grida, the vector tool) |
| ⇧I | Insert | the vector tool's quick insert |
| Esc | leave a tool, then clear the choice | all |
| Enter / ⇧Enter, Tab / ⇧Tab | first child / parent, next / previous sibling | the vector tool |
| ⌫ | remove | all |
| ⌘D | duplicate after it | the vector tool, Penpot, tldraw |
| arrows, ⇧arrows | reorder in a flow; nudge 1 / 10 | the vector tool (auto layout), all |
| ⌘Z, ⇧⌘Z | undo, redo | all |
| double-click | words in place | all |

The keys act only while the page is the design's (not from the panels' own fields), and before the viewer's ← → step
between layers, which they take over while something is chosen.

### 9. The container

The design is its own container: the stage holds one layer, at its true width, its height grown by what it draws. Every
tool works only inside the design (a drop, a drawn shape, an insert all land in one of its frames); there is nothing to
place outside it and no canvas past its edges. Zoom and pan stay the viewer's (Space, middle button, pinch, ⇧1, ⇧2).

### What a click chooses

| | Option | |
|---|---|---|
| **A (built)** | The deepest thing that is one: a component, a shape, a thing added with the tools, a run of words of its own, else the frame round it | What people click on; ⇧Enter or Select parent climbs |
| B | The vector tool's: the outermost child first, double-click goes one deeper, ⌘-click deep | Better for moving whole groups; many clicks into an app's nested shell |

## Stage values (built)

| Value | Area | Evidence |
|---|---|---|
| Handle | 8, white, 1 selection-blue line | all five editors 8 |
| Handle hit | 16 | median of 20 / 13.5 / 8 / 20 / 16 |
| Side handles hide under | 24 | Penpot 25, tldraw 16 to 32 |
| Drag starts past | 4 | tldraw 4 (mouse); Penpot, Excalidraw, Onlook 10. A pick: 4 feels immediate on small UI |
| Snap | 8 | tldraw, Excalidraw 8; Penpot 10 |
| Click size | 100 × 100 | Penpot |
| Nudge | 1, ⇧10 | four of five |
| Selection outline | 2 (kept from PR #211) | editors 1 to 2 |
| Selection blue | `#0d99ff` light, `#0c8ce9` dark | the vector tool's ramp blue-500 (`figma.md`, desktop_shell.css @247794, @308968) |
| Drop line | 2, selection blue | the vector tool's "blue indicator" (thickness not documented) |
| Padding and gap bar | 2 × 12, hit 16; padding from 20 deep, gap from 4 | the handles' hit, halved, clear of the side handle |
| Space steps | the space ramp, 0 to 96 | Area's tokens: a dragged space stays on the system |
| Double-click | 400 ms between two presses on a handle | the platforms' default 400 to 500 |

## What it costs, and the open questions

- **File size.** A design is about the size of its markup as JSON (the analytics screen: 55 kB of markup). Iterations and
  versions copy the pages, so a project with many edited layers grows with every kept iteration. Next: keep each design
  once in the file and let iterations point at it (content-addressed), before projects get large.
- **Behaviour.** A design is drawn, not run: menus, dialogs and fields don't act on the stage (they didn't before either),
  and a component's ids are new on every draw.
- **Code view.** A layer with its own design shows its code written from it (Code tab); components as themselves, the rest
  as markup with Area's classes. A screen's own file is unchanged; Chat still gets each change to write into it.
- **Not built yet**: the pen and booleans, multi-select, copy and paste, a layers tree of the design in the Sidebar, drag
  from Insert, Hug / Fill in a grid's cells.
- **Code colour** (owner, 2026-11-08: "use colored text for code"): the review page's Code view is Area's CodeBlock with
  the app's highlighter (`content/highlight.mjs`, Area's syntax classes), as the app's Code tab already was; the highlighter
  now takes each token once (it wrapped attribute strings twice and took a closing quote for the next opening), and
  colours `function` and attributes given an expression (`style={{ … }}`). An image layer's markup is coloured too.
- **Capture**: a field's state is kept as drawn (a chosen radio, a checked box, a filled field), and a radio group's name
  that React made for one drawing is left out, so the Light and Dark copies don't share one group.

## Sources

The three notes above; each lists its URLs and pinned files.
