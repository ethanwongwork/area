# Figma direct-editing behaviour — documented reference (2026-11-08)

Research for designing direct editing in a code-backed tool (one container per design, no infinite canvas).
Read-only: help.figma.com, figma.com/blog, developers.figma.com, and the installed Figma.app bundle (v126.9.13) read with `grep -a`/`dd`; nothing launched, nothing signed in.

Labels: **[doc URL]** = stated on that page; **[bundle file @ offset]** = read in `/Applications/Figma.app/Contents/Resources/app.asar`; **not found** = searched, no source. Nothing below is recalled or guessed. Where a help page did not cover a point, it says so.

Key URLs (short names used below):
- AL-guide — https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout
- AL-flows — https://help.figma.com/hc/en-us/articles/31289464393751-Use-the-horizontal-and-vertical-flows-in-auto-layout
- AL-add — https://help.figma.com/hc/en-us/articles/5731482952599-Add-auto-layout-to-a-design
- SELECT — https://help.figma.com/hc/en-us/articles/360040449873-Select-layers-and-objects
- FRAMES — https://help.figma.com/hc/en-us/articles/360041539473-Frames-in-Figma-Design
- FvG — https://help.figma.com/hc/en-us/articles/360039832054-The-difference-between-frames-and-groups
- PCS — https://help.figma.com/hc/en-us/articles/360039959014-Parent-child-and-sibling-relationships
- CONSTR — https://help.figma.com/hc/en-us/articles/360039957734-Apply-constraints-to-define-how-layers-resize
- ARPD — https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions
- NUDGE — https://help.figma.com/hc/en-us/articles/4404575206295-Set-small-and-big-nudge-values
- MEASURE — https://help.figma.com/hc/en-us/articles/360039956974-Measure-distances-between-layers
- VIEW — https://help.figma.com/hc/en-us/articles/360041065034-Adjust-your-zoom-and-view-options
- SMART — https://help.figma.com/hc/en-us/articles/360040450233-Arrange-objects-with-Smart-Selection
- GUIDES — https://help.figma.com/hc/en-us/articles/360040450513-Create-layout-guides
- COPY — https://help.figma.com/hc/en-us/articles/4409078832791-Copy-and-paste-objects
- SCALE — https://help.figma.com/hc/en-us/articles/360040451453-Scale-layers-while-maintaining-proportions
- TEXT — https://help.figma.com/hc/en-us/articles/360039956434-Guide-to-text-in-Figma-Design
- TEXTSIZE — https://help.figma.com/hc/en-us/articles/27378154668951-Adjust-text-dimensions-and-resizing
- SHAPES — https://help.figma.com/hc/en-us/articles/360040450133-Shape-tools
- TOOLBAR — https://help.figma.com/hc/en-us/articles/360041064174-Access-design-tools-from-the-toolbar
- VEDIT — https://help.figma.com/hc/en-us/articles/360039957634-Edit-vector-layers
- VNET — https://help.figma.com/hc/en-us/articles/360040450213-Vector-networks
- VNET-blog — https://www.figma.com/blog/introducing-vector-networks/
- ILLUS — https://help.figma.com/hc/en-us/articles/31440438150935-Draw-with-illustration-tools
- BOOL — https://help.figma.com/hc/en-us/articles/360039957534-Boolean-operations
- TXT2VEC — https://help.figma.com/hc/en-us/articles/360047239073-Convert-text-to-vector-paths
- INSERT — https://help.figma.com/hc/en-us/articles/360039150173-Create-and-insert-component-instances
- SWAP — https://help.figma.com/hc/en-us/articles/360039150413-Swap-components-and-instances
- PROPS — https://help.figma.com/hc/en-us/articles/8883757553943-Edit-instances-with-component-properties
- PROPS-x — https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties
- DETACH — https://help.figma.com/hc/en-us/articles/360038665754-Detach-an-Instance-from-a-Component
- VARIANTS — https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants
- KEYS — https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard
- MP-blog — https://www.figma.com/blog/how-figmas-multiplayer-technology-works/
- CC — https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect
- CC-react — https://developers.figma.com/docs/code-connect/react/
- CC-tmpl — https://developers.figma.com/docs/code-connect/template-api/
- DEVMODE — https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode

---

## 1. Auto layout

**Adding and removing** [AL-guide, AL-add]
- Shift+A adds auto layout. Figma guesses the flow (vertical, horizontal or grid). "Auto layout is only supported on frames": if loose layers are selected, Figma wraps them in a new auto layout frame.
- Suggest auto layout: ⌃⇧A on Mac, Ctrl+Alt+Shift+A on Windows. It infers nested frames in one action. Remove auto layout: ⌥⇧A (Mac) or Alt+Shift+A (Windows), or "Freeform" in the panel; this restores regular frame properties. "Remove all auto layout" also removes it from every nested frame.

**Direction / flow** [AL-flows]
- Vertical places children on y and horizontal on x. "Any objects you add, remove, or reorder will follow the y-axis" (and the x-axis for horizontal).
- Wrap is available for horizontal and vertical. Horizontal wrap starts a new row and vertical wrap a new column at the frame's height. Vertical wrap "is not masonry": children keep auto layout order.
- Grid is a separate flow: children sit in rows and columns and can span them, but don't wrap [AL-guide].

**Gap** [AL-flows]
- The gap is a number or **Auto**. Auto has three distributions, set in the settings modal: **Between** (the default, no edge space), **Evenly** (CSS `space-evenly`) and **Around** (CSS `space-around`).
- With Wrap on there are two gaps: one inside a row or column, and one between rows or columns.
- If the children are too big for positive spacing, the gap stops at 0: "Children sit flush and do not overlap."
- Negative spacing has a **Canvas stacking** setting: Last on top (the default) or First on top. It is visual only; the layers order doesn't change.

**Padding** [AL-flows, AL-guide]
- Padding can be uniform, per axis or per side. By default the panel shows a vertical pair and a horizontal pair. ⌘/Ctrl-click a padding field to type uniform padding or CSS shorthand such as "1,2,3,4" (top, right, bottom, left).
- On canvas, padding has **pink handles**: click one to type a value, or drag it. While dragging, ⌥ sets the opposite sides, ⌥⇧ sets all sides, and Shift uses the big nudge.
- A frame can't be smaller than its padding. A hugging or fixed frame that is too small expands to fit.

**Alignment** [AL-flows, AL-guide]
- Alignment is set on the parent, not on each child. A fixed gap gives 9 options; Auto gap gives 3 (Top/Center/Bottom for horizontal, Left/Center/Right for vertical).
- With the alignment box focused: arrow keys cycle the options, W/A/S/D align to an edge, **B** toggles text baseline alignment and **X** switches the gap between its value and Auto.
- A single child in an Auto-gap stack now aligns to the start; it used to be centred.

**Strokes** [AL-flows]
- By default, inside strokes count toward layout; a setting can exclude them, per frame. Outside and centre strokes never affect layout.

**Sizing: Hug / Fill / Fixed, min/max** [AL-guide]
- **Hug contents** (auto layout frames only) takes the smallest size that fits the children plus spacing. Double-click a frame edge to set it. If any child is Fill container on that axis, the parent stops hugging on that axis and becomes Fixed.
- **Fill container** (children of auto layout only, never top-level frames) stretches to the available space. Manually resizing a child to the parent's full space sets Fill. ⌥/Alt+double-click an edge to set it.
- **Fixed** keeps the size unchanged. "Manually resizing or typing a value in the width or height field sets Fixed on that axis."
- **What happens when you resize a Hug child:** dragging its handle or typing W/H switches that axis to Fixed. The article's example: a 40px text with 10+10 padding makes a 60px frame, and the frame grows to 70px when the text is 50px.
- **Min/max** can go on any auto layout frame or child, through the W/H dropdown, and can use number variables. When set, the icons gain two lines, and hovering previews the limits on canvas. Remove them with "Remove min and max".

**Ignore auto layout (formerly "absolute position")** [AL-guide]
- An ignored child stays inside the frame but out of the flow; it and its siblings ignore each other.
- Turn it on with the right-panel button, or hold **Control (Mac) / S (Windows) while dragging an object into the frame**.
- Constraints apply to it; resizing and layout options are unavailable for it. Constraints are otherwise not allowed on auto layout children [CONSTR].

**Drag to reorder, the insertion indicator, drag in and out** [AL-flows]
- To reorder, select the child (⌘/Ctrl to deep-select a nested one), then use the **arrow keys** or **drag**. Instances can't be reordered.
- Drag in: "Drag an object over the frame and use the blue indicator to choose placement." An object with any dimension larger than the parent isn't added by default; hold ⌘/Ctrl to override this, and the same modifier adds into a nested auto layout.
- Drag out: drag the child outside the frame. Hidden children leave the layout; to keep a hole, set opacity to 0%.
- ⌘D on a child puts the duplicate to the right (horizontal) or below (vertical).
- General reparenting rule [PCS]: an object dragged over a frame becomes its child if it is smaller than the frame, and not if it is larger. Hold **Space** to stop reparenting, and hold Space while dragging past the frame's bounds to keep the object in its current parent.
- **Not found:** the indicator's thickness, colour value and length (only "blue indicator" is documented).

**Instances vs main components** [AL-guide]
- Main components can change padding and gap, reorder, add and delete.
- Instances can change padding and gap but can't reorder or add; deleting a layer in an instance only hides it.

**Clipping and auto layout** [AL-guide]: "To clip content, put the auto layout frame inside a regular frame" (prototyping overflow context).

## 2. Frames vs groups, constraints, clip content

- **Groups** take "the combined dimensions of their children" and have no properties of their own. **Frames** have a size you set, plus fills, radius, effects and Clip content [FvG].
  - The first click on a grouped layer selects the group. Selecting inside a frame "works exactly the same way as groups" [FvG].
- **Shortcuts** [FvG, FRAMES]:
  - Group ⌘G. Frame selection ⌥⌘G. Ungroup ⇧⌘G or ⌘⌫. Frame tool F or A.
  - Resize to fit ⌥⇧⌘R: "around the outermost bounds of the objects within it".
- **Frame tool** [FRAMES]:
  - The first top-level frame is 100×100, and later ones reuse the last size.
  - Clicking inside a frame adds a nested 100×100 frame.
  - A top-level frame "can't nest within another frame, group, or object".
  - The W/H fields accept math (+100, *4, /8).
- **Clip content** "hides any objects within the frame that extend beyond the frame's bounds" [FRAMES]. The default for new frames isn't documented. Groups have no clip setting [FvG].
- **Constraints** [CONSTR]:
  - Horizontal: Left / Right / Left and right / Center / Scale. Vertical: Top / Bottom / Top and bottom / Center / Scale.
  - Scale stores position and size as percentages (a 70px layer in 100px becomes 140px in 200px). The default is Left/Top. Shift-click applies two at once.
  - Constraints only apply to layers inside a frame. They don't apply to groups (they pass down to the group's children) or to auto layout children unless ignored.
  - Hold ⌘/Ctrl while resizing to ignore children's constraints [CONSTR, FRAMES]. A **blue dotted line** on canvas shows the applied constraints [CONSTR].

## 3. Selection

From [SELECT] unless noted.
- **Click:** "Clicking an object on the canvas selects its parent (frame or group) by default."
- **Go deeper:** double-click, or **Enter**, moves one level down; repeat to go further.
- **Go up:** **Shift+Enter** selects the parent. **`\`** isn't on the help page; it is reported only by third-party lists and a Figma forum answer (https://forum.figma.com/archive-21/select-parent-set-own-keyboard-shortcut-21463). Treat it as **unconfirmed in official docs**.
- **Siblings:** **Tab / Shift+Tab** select the next and previous sibling (also in [FRAMES]).
- **Deep select:** ⌘-click (Ctrl on Windows) selects a nested layer directly. Right-click › "Select layer" lists every layer under the cursor.
- **Shift-click** adds to the selection; Shift-clicking a selected object removes it.
- **Marquee:** drag from empty canvas, and "a blue box appears around each object in the selection". Hold ⌘/Ctrl while dragging to select nested layers. Selecting a top-level frame limits the selection to other top-level layers.
  - **Not found:** whether the marquee takes intersected or only fully enclosed objects, and what happens when the drag starts inside a frame.
- **Other selection commands:**
  - Select all ⌘A. Select inverse ⇧⌘A. Select matching layers ⌥⌘A (matches show a blue bounding box).
  - Esc or a click on empty canvas deselects.
  - Locked layers can't be clicked, but they appear in "Select layer" with a padlock.
- **Hover from the layers panel** shows a blue box on canvas. View-only collaborators see the selection as a solid purple outline and the parent as a dashed purple one.
- **Keyboard-only selection** [KEYS]: ⌥Space opens a box-select tool with a **pink cursor**; arrows move it, Return selects and Tab/Shift+Tab move between children. ⌘+arrows resize the box, and Shift gives larger steps.

## 4. Nudge, duplicate, measure, snapping, grids

- **Nudge** [ARPD, NUDGE]:
  - "By default, small nudge is set to 1 and big nudge set to 10". Arrows give the small nudge and Shift+arrows the big one.
  - Both are set in Preferences › Nudge amount, per user. They also step corner radius and auto layout spacing.
  - The big nudge is also the default padding when auto layout is added [NUDGE search summary].
  - With nothing selected, the arrow keys pan the canvas [KEYS].
- **Duplicate** [COPY, INSERT, AL-flows]:
  - ⌘D puts the copy on top of the original (shapes, text, components, child frames); top-level frames and sections go to the right.
  - Repeating ⌘D after an offset or rotation keeps the same step. Inside auto layout the copy goes after the original.
  - ⌥/Alt-drag duplicates; for components, release the mouse before the modifier, or the original moves.
- **Measure** [MEASURE]:
  - With a selection, hold ⌥ and hover another object to get "a red line between the two objects, as well as horizontal and vertical measurements". ⌘⌥ (Ctrl+Alt) does the same for nested layers.
  - Measurements run between **bounding boxes**: strokes are ignored and text uses its box, not the baseline.
  - "It's not currently possible to change the weight or color of the red measurement line."
  - In vector edit mode, ⌥-hover measures point to point.
  - Dev Mode measurements are separate and persist.
- **Smart guides and snapping** [ARPD, VIEW]:
  - The options are Snap to geometry (vector edit only), Snap to objects (centres and outer edges) and Snap to pixel grid. "A red guide appears" as the cue. Hold **Control** to suspend geometry and object snapping temporarily.
  - Pixel grid: toggle ⌘' (the page also writes "Shift '", which conflicts). It shows only at ≥400% zoom.
  - Snap to pixel grid: toggle ⇧⌘'. "Frames, sections, and components always snap to the pixel grid", and up to 1px of rounding is tolerated.
- **Equal spacing (Smart selection)** [SMART]:
  - It applies when layers are evenly spaced and overlap on an axis. Each layer gets a **pink ring** at its centre, and hovering shows **pink handles** between layers; dragging one changes the spacing, with a px tooltip.
  - To reorder, click the rings and drag: a **blue indicator** shows the drop, and ⌘ swaps.
  - Tidy up [ARPD] uses the most common gap. Its shortcut isn't on the page.
  - **Not found:** a documented "equal-spacing snap" while dragging a single object (only Smart selection is documented).
- **Layout guides (renamed from "layout grids", May 2025)** [GUIDES]:
  - Types: Uniform grid, Columns, Rows. Settings: Stretch/Left/Center/Right, count (or Auto), width, offset, margin, gutter. Frames only, at 0° rotation.
  - Default colour **#FF0000 at 10%**.
  - Toggle: **Shift+G** per [GUIDES], but [VIEW] lists Mac **Control+G** (Windows Ctrl+Shift+4). The docs conflict.
- **Alignment** [ARPD]: ⌥W top, ⌥A left, ⌥S bottom, ⌥D right, ⌥H horizontal centres, ⌥V vertical centres. One layer aligns to its parent and several align to each other.

## 5. Resize, scale, rotate

- **Resize from a handle** [ARPD, SHAPES, FRAMES, CONSTR]:
  - **Shift** keeps the aspect ratio while held; Control temporarily cancels a locked ratio.
  - **⌥/Alt** resizes from the centre ("create and resize shapes from their center"), and Shift+⌥ does both.
  - **⌘/Ctrl** ignores children's constraints.
  - Vector edit mode has the same Shift and ⌥ rules [VEDIT].
- **Scale tool K** [SCALE] scales the contents and stroke together, with an anchor box. It doesn't work on locked layers or on layers inside instances.
- **Rotate** [ARPD]:
  - "Hover just outside a layer's bounds until the rotation icon appears, then drag." "Hold down Shift to snap rotation values to increments of 15."
  - Positive angles turn counterclockwise, within ±180°. The origin is the centre by default; ⌥R lets you move it.
  - X/Y stay on the original top-left corner.
- **Flip:** Shift+H / Shift+V [ARPD].
- **Number fields** [ARPD]:
  - Math is allowed (+ − * / ^ parentheses, `Mixed+100`).
  - Scrubbing: hover the label, or ⌥-hover the field, then drag. Moving the cursor up or down changes the speed (2×, 1×, ½, ¼).

## 6. Text

- **T** is the text tool [TEXT].
- **Click vs drag:** "If you click on the canvas to create a text layer, the resizing property is set to auto width." Dragging a box "sets the resizing to Fixed size" [TEXTSIZE].
- **Editing:** double-click a text layer, or press Enter with it selected [TEXT]. While editing, clicking another text layer edits it directly. With several text layers selected, Enter starts Multi-edit.
- **Resizing modes:** Auto width, Auto height and Fixed size, in the Layout section [TEXTSIZE, plus a search summary of TEXTSIZE/FD4B for Auto height].
  - Manually resizing on canvas switches the layer to Fixed size.
  - Auto width breaks lines only at Return, so the wrap style (Balance / Pretty) has no effect on it.
  - Max lines and max height exclude each other [AL-guide].
- **Esc while editing text:** **not found** in official docs. The documented Esc rule is "Esc deselects" in general [SELECT]. Whether Esc keeps the text layer selected isn't stated, so **verify in the app**.

## 7. Shapes, vectors, booleans

- **Shape tools** [SHAPES, ILLUS, TOOLBAR, VEDIT, VNET]:
  - **R** Rectangle, **O** Ellipse, **L** Line, **⇧L** Arrow, **P** Pen, **⇧P** Pencil.
  - Polygon and Star have **no shortcut** ("Select them from the Shape tools menu").
  - Shift constrains to a square, circle or regular polygon; ⌥ draws from the centre.
  - Rectangle: corner-radius handles inside each corner. Polygon: a triangle by default. Star: 5 points / 10 sides, count 3–60, plus ratio and radius. Ellipse: the arc tool.
  - **Not found:** the default size from a click without a drag.
- **Vector networks** [VNET-blog, VNET, VEDIT]:
  - Lines can link "between any two points", so a point can have 3+ segments. Fills cover enclosed regions automatically, and the paint bucket (**⇧B**) toggles a region's fill.
  - Bend: the blog says the bend tool is "activated with the Command key" and you "drag the curve around directly".
  - Pen: click adds a point; click-drag sets curve length and slope. Hover an existing point to close (a small circle cursor). **Esc** leaves the path open.
  - Edit mode: Enter on a vector enters it.
    - Handle mirroring: None, Mirror angle, or Mirror angle and length. Shift-selecting both handles moves them together.
    - Lasso **Q**, Cut **X**, Eraser **⇧E**. Space repositions while drawing.
    - Delete & heal exists [ILLUS search summary].
  - **Not found in official docs:** ⌥ to break or adjust a handle (not stated on VNET or VEDIT).
- **Booleans** [BOOL]:
  - **Union ⌥⇧U**: the top layer's style wins.
  - **Subtract ⌥⇧S**: removes from the *bottom* layer, and the bottom layer's style wins.
  - **Intersect ⌥⇧I** and **Exclude ⌥⇧E**: the top layer's style wins.
  - Boolean groups are non-destructive: children keep size, position, rotation and radius, but not individual fill, stroke or effects. "Ungroup" reverts.
- **Flatten:** documented as **⌥⇧F** (Alt+Shift+F) [TXT2VEC]. **⌘E is not documented** on any official page found. Flatten is destructive.
- **Outline stroke:** ⌥⌘O (Ctrl+Alt+O). A "Use old shortcuts for outlines" preference moves it to ⇧⌘O [TXT2VEC, search summary].

## 8. Components: insert, swap, props, detach, variants

- **Insert** [INSERT]:
  - The Assets tab opens with **⌥2**, and you drag a component onto the canvas. **Quick insert is ⇧I** (search the added libraries).
  - The component details modal has a playground: preview variants and properties, then "Insert instance".
  - "Go to main component" is ⌃⌥⌘K.
  - ⌥⌘K for Create component isn't on this page (**not confirmed**).
- **Swap** [SWAP]:
  - Click the component name in the right panel to open the Instance menu (ordered by name and location; slash names group).
  - Or ⌥-drag a component from Assets onto an instance (⌥⌘ for nested), releasing the mouse first. Or right-click › Swap instance (same hierarchy only).
  - Overrides: the Instance menu and variant changes "try to preserve any overrides". An Assets drag-swap preserves only text overrides, matched by layer name.
- **Component properties in the right panel** [PROPS, PROPS-x]:
  - The five types are **Variant, Boolean, Text, Instance swap, Slot**. On an instance they all sit in one section: variants as dropdowns, booleans as toggles (layer visibility only), text as fields, instance swap as dropdowns with **preferred instances** listed first.
  - Non-property overrides survive swaps and variant changes.
- **Detach** [DETACH]: **⌥⌘B** (Ctrl+Alt+B). The instance becomes a regular frame with its current layers and properties, and it can't be relinked.
- **Variants** [VARIANTS]:
  - Variants are a **component set**: properties × values, each variant a unique combination. Slash naming `Name/prop1value/prop2value` converts to properties. "Combine as variants" does the same from a selection.
  - The **top-left variant is the default**. The set's frame defaults to a **dashed purple stroke, no fill**.

## 9. Keyboard shortcuts — where the full list lives

- No help.figma.com article lists every shortcut. [KEYS] covers only keyboard navigation:
  - F6 focuses the toolbar.
  - ⌥Space opens box select.
  - ⌘± zooms.
  - The **shortcuts panel is Ctrl+Shift+?** and is the official full list.
  - "It's currently not possible to create custom keyboard shortcuts" (per search summary of KEYS).
- The shortcuts confirmed above, gathered by area:
  - **Tools:**
    - T text; P pen; ⇧P pencil; R rectangle; O ellipse; L line; ⇧L arrow.
    - F/A frame; K scale.
    - Space for a temporary hand.
    - ⇧D Dev Mode.
  - **Structure:**
    - ⌘G group; ⌥⌘G frame selection; ⇧⌘G or ⌘⌫ ungroup; ⌥⇧⌘R resize to fit.
    - ⇧A auto layout; ⌃⇧A suggest; ⌥⇧A remove.
  - **Selection:**
    - Enter child; ⇧Enter parent; Tab/⇧Tab sibling; ⌘-click deep select; ⇧-click add/remove.
    - ⌘A all; ⇧⌘A inverse; ⌥⌘A matching; Esc deselect.
  - **Transform:**
    - Arrows 1 / ⇧arrows 10; ⌘D duplicate; ⌥-drag duplicate.
    - ⇧H/⇧V flip; ⌥R rotation origin.
    - ⌥W/A/S/D/H/V align.
  - **View:**
    - ⇧1 fit; ⇧2 selection; ⇧+/⇧− zoom.
    - ⌘' pixel grid; ⇧⌘' snap to pixel grid.
    - ⇧G or ⌃G layout guides (the docs conflict).
    - ⌥⌘\ multiplayer cursors; ⌃P pixel preview.
  - **Vector:**
    - Enter edit; Q lasso; ⇧B paint; X cut; ⇧E eraser.
    - ⌥⇧U/S/I/E booleans; ⌥⇧F flatten; ⌥⌘O outline stroke.
  - **Components:**
    - ⇧I quick insert; ⌥2 assets; ⌥⌘B detach; ⌃⌥⌘K go to main.
- **Not found in official docs:**
  - `\` for parent.
  - ⌘E flatten.
  - ⌥⌘K create component.
  - V move.
  - H hand.
  - Shift+R rulers.
  - ⌘Y outlines.
  - ⌘\ hide UI.

## 10. Undo granularity

- **Not found:** no official page states whether one drag is one undo step, or how typing is grouped into undo steps.
- What is documented about undo [MP-blog]:
  - The principle: "if you undo a lot, copy something, and redo back to the present" then "the document should not change."
  - Undo changes the redo history at the time of the undo, and redo changes the undo history. Undo doesn't overwrite collaborators' later edits.
  - Deleted objects live in "the undo buffer of the client that performed the delete".
- Help pages note some actions are not undoable (moving published components or styles), and recommend ⌘Z right after an accidental "create component" [DETACH].

## 11. Dev Mode and Code Connect (design component → code component)

- **Two ways to connect** [CC]:
  - **Code Connect UI** runs inside Figma. It is language-agnostic, links GitHub paths or typed component paths, and allows several frameworks per component. UI connections show the file and component name plus AI previews, **not** Inspect snippets.
  - **Code Connect CLI** runs in the repo and publishes mappings. Dev Mode then shows the design system's real snippet "in place of the default autogenerated snippets".
  - Both feed the **Figma MCP server**. On the Professional plan only one library and one framework are active.
- **Parser API (React, legacy but documented)** [CC-react]:
  - The shape is `figma.connect(Component, figmaNodeUrl, { props, example, variant })`. The `example` receives the mapped props and renders the snippet.
  - "Code Connect files are not executed": snippets are strings, so ternaries print verbatim.
  - Helpers:
    - `figma.string('Label')` → a text property.
    - `figma.boolean('Has Icon', {true: <Icon/>, false: undefined})`. Yes/No and On/Off variants normalise to booleans.
    - `figma.enum('Size', {Small:'sm', Large:'lg'})` — exact option names, no normalisation.
    - `figma.instance('Icon')` — the nested component needs its own connect, made against its backing component.
    - `figma.children('Icon*')` — finds children by **layer name**; wildcards are case-sensitive.
    - `figma.nestedProps('Layer', {...})` — reads one child's props without connecting it.
    - `figma.textContent('Layer')` — the text of a named text layer.
    - `figma.className([...])` — joins class names.
    - `figma.slot`, with `.connectedInstances`.
  - `variant: { Type: 'Primary' }` maps one Figma component set to several code components, and conditions can combine. The parser guides "will no longer receive updates or support"; template files replace them.
- **Template API (current)** [CC-tmpl]:
  - A JS/TS module does `import figma from 'figma'` and `export default { example: figma.code\`...\`, id, metadata }`.
  - It reads `figma.selectedInstance` with `getString`, `getBoolean`, `getEnum`, `getInstanceSwap`, `getSlot`, `getPropertyValue`, `findInstance`, `findText(...).textContent` and `findConnectedInstance(s)`.
  - The output is sections (CODE / INSTANCE / SLOT / ERROR). `metadata.nestable` sets inline vs pill display.
- **Dev Mode** [DEVMODE]:
  - The Inspect panel shows Code (autogenerated, or the Code Connect snippet) or a property List.
  - "Explore component behavior" opens a playground for trying properties and modes without editing.
  - Annotations and measurements persist. The page gives no redline colours.

## 12. Visual specs of selection and overlays

The Figma.app bundle holds only the desktop shell: tabs, menus and windows (`desktop_shell.css`, `main.js`, the Inter font). The canvas and its overlays are drawn by the web app loaded from figma.com, which isn't in the bundle. So the canvas-overlay **geometry** (stroke widths, handle size, label padding and radius) is **not found** in the bundle. The **colour tokens** that name these roles are in the shell's copy of Figma's token sheet.

Bundle refs: `desktop_shell.css` starts at app.asar byte offset **596512**. The offsets below are within desktop_shell.css (asar offset = 596512 + css offset). `:root` is light; dark is `[data-preferred-theme=dark]`.

| Item | Value | Status |
|---|---|---|
| Brand / selection blue | `--ramp-blue-500: #0d99ff` (light, css @247794); `#0c8ce9` (dark, @308968). `--color-bg-brand: var(--ramp-blue-500)` @204153 | observed in bundle (desktop_shell.css) |
| Selected border | `--color-border-selected: var(--ramp-blue-500)` @218459; `--color-border-selected-strong: var(--ramp-blue-600)` @218505 = `#007be5` (@247819) | observed in bundle |
| Selected-area fill (drop target) | `--color-bgselectedarea: #0d99ff33` (blue at 20%) @213102; used by the shell's split-tab drop target in `web_app_binding_renderer.js` (asar @9692620) | observed in bundle |
| Measure (red) | `--color-bg-measure: var(--ramp-red-500)` @208567; red-500 = `#f24822` light (@253098) / `#e03e1a` dark; `--color-text-onmeasure: white` @242267; `--color-border-measure: var(--ramp-red-300)` = `#ffc7c2` @216800 | observed in bundle (token names; canvas use not visible) |
| Measure line | "a red line… horizontal and vertical measurements"; weight/colour not changeable | documented [MEASURE] |
| Inspect spacing / padding (Dev Mode) | `--color-bginspectspacing: var(--ramp-pink-500)` = `#ff24bd` (dark `#f316b0`) @213005; `--color-bginspectpadding: var(--ramp-blue-500)` @212903 | observed in bundle |
| Auto layout padding handles | "pink" handles | documented [AL-flows] (hex not documented; pink-500 is the token above) |
| Smart selection | pink rings/handles, blue drop indicator, px tooltip | documented [SMART] |
| Snap guide | "A red guide appears" | documented [ARPD] |
| Auto layout insertion line | "blue indicator"; thickness/length | colour word documented [AL-flows]; geometry not found |
| Selection stroke colour | "blue" bounding box (marquee and matching selection) | documented as "blue" [SELECT]; hex not documented (bundle blue-500 #0d99ff is the brand/selected token) |
| Selection stroke width | — | not found |
| Resize handle size / shape | — | not found |
| Hover outline | blue box on canvas when hovering a layer *in the layers panel*; canvas hover outline not described | partly documented [SELECT]; width/colour not found |
| Size label under selection | "A blue label under the bounding box shows the layer's dimensions" | documented [ARPD]; font size, padding, radius not found |
| Constraints indicator | blue dotted line | documented [CONSTR] |
| Component colour | `--color-bg-component: var(--ramp-purple-500)` = `#9747ff` light (@252839) / `#8a38f5` dark; component set default "dashed-purple stroke, no fill" | bundle + documented [VARIANTS] |
| View-only selection | solid purple outline, parent dashed purple | documented [SELECT] |
| Layout guide default | `#FF0000` at 10% | documented [GUIDES] |
| Keyboard box-select cursor | pink | documented [KEYS] |
| Pixel grid | visible ≥400% zoom | documented [VIEW] |
| Shell UI type | `--font-family-default: "Inter", …` @246834; `--text-body-medium-font-size: .6875rem` (11px) @255714; large `.8125rem` (13px); small `.5625rem` (9px) | observed in bundle (shell UI, not confirmed for canvas labels) |
| Shell radii | `--radius-small .125rem` (2px), `--radius-medium .3125rem` (5px), `--radius-large .8125rem` (13px) @247312–247402 | observed in bundle (shell UI) |

**How to close the geometry gaps without guessing:** capture a live Figma canvas at 1× (a screenshot measured in pixels, or the web app's own JS/WASM) in a session the owner runs. The editor's code comes from figma.com, not from the installed bundle.
