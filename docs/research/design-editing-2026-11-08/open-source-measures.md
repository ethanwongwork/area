# Direct editing: measured values from open-source editors

Read 2026-11-08 from shallow clones of each repo's default branch. Every value below is a literal in source at the pinned commit, with its file and line. "px" means screen pixels unless noted. Values are drawn at constant screen size when the source divides by zoom (`/ zoom`); that is noted per product.

| Repo | Commit (HEAD of default branch) | Commit date | Package version |
|---|---|---|---|
| penpot/penpot | `904cdd97163dc77c0d875f509ccab9ff234d7bae` | 2026-11-07 | – |
| tldraw/tldraw | `69f43954f15a171b3a6edb45134d27b71560de02` | 2026-11-07 | `tldraw` 5.6.0 |
| excalidraw/excalidraw | `701b901a0f1ba3d0b390d9cdf63d112e25abac4b` | 2026-11-05 | `@excalidraw/excalidraw` 0.18.0 |
| onlook-dev/onlook | `423e2e924366419e418ee049093872d535eea41a` | 2026-07-21 | – |
| gridaco/grida | `219f40bcd1579d07b0742f63671875c4939bc0d5` | 2026-11-09 (UTC) | – |

Permalinks: `https://github.com/<repo>/blob/<commit>/<path>#L<line>`.

---

## 1. Penpot

Paths are under `frontend/src/app/main/` unless they start with `common/` or `frontend/`. The overlay is SVG in canvas units. Every size is `constant / zoom`, so handles, strokes and labels stay the same screen size at any zoom. Strokes also use `vectorEffect: non-scaling-stroke`.

### Selection and handles

| Value | Measured | File:line |
|---|---|---|
| Selection outline width | 1 px (`selection-rect-width 1`, drawn `(/ 1 zoom)`) | `ui/workspace/viewport/selection.cljs:44`, `:83` |
| Selection colour | `var(--color-accent-tertiary)`: light theme `#8c33eb` (purple-600), default/dark theme `#00d1b8` (mint-250) | `selection.cljs:42`; `ui/ds/colors.scss:66`, `:111`, `:29`, `:10` |
| Selection colour, component | `var(--assets-component-hightlight)` → `--color-accent-secondary` (light `$cobalt-700`, dark `$purple-400`) | `selection.cljs:43`; `frontend/resources/styles/common/refactor/design-tokens.scss:229`; `colors.scss:65`, `:110` |
| Minimum interactive selection rect | 10 px each side (a thin line can still be dragged) | `selection.cljs:45-48`, `:59-75` |
| Corner resize handle | Circle, **r 4 (8 px diameter)**, fill `var(--app-white)` (#fff), stroke = selection colour, 1 px non-scaling | `selection.cljs:39`, `:242-248`; `frontend/resources/styles/common/refactor/color-defs.scss:42` |
| Corner hit area (normal box) | Invisible circle, **r 10 (20 px diameter)**, centred on the corner | `selection.cljs:39`, `:279-287` |
| Corner hit area (small box, `align :outside`) | 10×10 px square placed outside the corner | `selection.cljs:250-273` |
| Side hit band | 8 px thick (`resize-side-height 8`). Normal box: centred on the edge (±4). Small box: 8 px outside the edge | `selection.cljs:41`, `:293-294` |
| Side handle visual | None, unless the box is tiny (then an 8 px circle at the side's midpoint) | `selection.cljs:327-336` |
| Rotation hit area | 20×20 px invisible square outside each corner, diagonal to it | `selection.cljs:37`, `:196-221` |
| "Small" threshold (handles move outside, side bands clamp to 25 px) | ≤ 25 px | `selection.cljs:94`, `:97`, `:100`, `:111-113` |
| "Tiny" threshold (corner handles hidden, side dot shown) | ≤ 10 px | `selection.cljs:95`, `:98`, `:101`, `:180` |
| Hover outline | 1 px (`(/ 1 zoom)`), same accent as selection (component colour when inside a component) | `ui/workspace/viewport/outline.cljs:30-34`, `:64-65` |
| Selection badge (name pill) | 16 px high, 6 px horizontal padding, 8 px gap above, radius 2, fill accent-tertiary, text 12 px white | `ui/measurements.cljs:41-47`; `ui/measurements.scss` (`.badge-text`) |

### Snapping and measuring

| Value | Measured | File:line |
|---|---|---|
| Snap threshold, points | **10 px** (`snap-accuracy 10`, applied `(/ snap-accuracy zoom)`) | `snap.cljs:25`, `:98` |
| Snap threshold, path nodes | 10 px | `snap.cljs:26` |
| Snap threshold, equal distances | 20 px (`snap-distance-accuracy`) | `snap.cljs:27`, `:146` |
| Snap guide line | 1 px, `var(--color-accent-quaternary)` = `#ff6fe0` (pink-400), opacity 0.6; snap point drawn as a 6 px × (±3) cross | `ui/workspace/viewport/snap_points.cljs:19-21`, `:31-42`; `colors.scss:25` |
| Distance pill (during snap) | 20 px high, radius 4, padding 4, font 12, fill pink-400, white text; width = 6 px per char + 6 px margins | `ui/workspace/viewport/snap_distances.cljs:46-51`, `:78-90` |
| Distance segment gaps | 2 px / 5 px | `snap_distances.cljs:25-26` |
| Measurement labels (Alt held) | font 11; distance pill 50×16 px, radius 2, fill pink-400, white text; size display 16 px high, 50–75 px wide, white 0.7, black text; line 1 px | `constants.cljs:330`, `:338-339`; `ui/measurements.cljs:29-39` |
| Guides | 1 px, opacity 0.7 (1 on hover), default colour `#ff3277`; pill 34×20 px, radius 4; grab area 16 px; drag threshold 3 px | `ui/workspace/viewport/guides.cljs:33-41`, `:47`; `common/src/app/common/types/color.cljc:197` |

### Gestures, text and nudge

| Value | Measured | File:line |
|---|---|---|
| Move start threshold | > 10 px (`(/ 10 zoom)`) before a press becomes a move | `data/workspace/transforms.cljs:767-770` |
| Resize start threshold | > 10 px | `data/workspace/transforms.cljs:422-426` |
| Draw start threshold (box, line) | > 10 px | `data/workspace/drawing/box.cljs:140`; `drawing/line.cljs:147` |
| Click-to-create default size | 100 × 100 | `data/workspace/drawing/common.cljs:91-92` |
| Text edit entry | Double-click on text, rect, path, image or circle: selects it and starts editing. **Enter** starts editing the selection | `ui/workspace/viewport/actions.cljs:222`, `:236-239`; `data/workspace/shortcuts.cljs:161` |
| Double-click on a text side handle | Right side = auto-width, bottom side = auto-height | `selection.cljs:305-325` |
| Nudge | **1 / Shift 10** (stored in the profile, defaults `{:big 10 :small 1}`) | `data/workspace/transforms.cljs:1174`, `:1190` |
| Path editor node | r 5 when active, r 4 otherwise, 1 px stroke; hit r 15; Bézier handle 6 px, 1 px; segment hit 15 px wide | `ui/workspace/shapes/path/editor.cljs:28-37`, `:139-150`, `:302` |

### Keyboard (`data/workspace/shortcuts.cljs`; `mod` = Cmd on Mac, Ctrl elsewhere)

| Group | Shortcuts (line) |
|---|---|
| Tools | Move V (376) · Board B or A (369) · Rect R (383) · Ellipse E (390) · Text T (397) · Path P (405) · Line L (412) · Arrow ⇧L (419) · Curve/pencil ⇧C (426) · Comment C (433) · Image ⇧K (448) · Scale K (476) · Colour picker I (483) |
| Edit | Undo mod+Z (72) · Redo mod+⇧Z or mod+Y (79) · Copy/Cut/Paste mod+C/X/V (93/108/117) · Paste replace mod+⇧V (126) · Copy/paste props mod+⌥C/V (133/140) · Delete Del or ⌫ (147) · Duplicate mod+D (154) · Rename ⌥N (197) · Select all mod+A (564) |
| Structure | Group mod+G (204) · Ungroup ⇧G (211) · Mask mod+M (218) · Unmask mod+⇧M (225) · Selection to board mod+⌥G (343) · Flex layout ⇧A (350) · Grid layout mod+⇧A (359) · Component mod+K (232) · Detach mod+⇧K (239) |
| Booleans | Union mod+⌥U (794) · Difference mod+⌥D (801) · Intersection mod+⌥I (808) · Exclude mod+⌥E (815) |
| Align and distribute | Left ⌥A (499) · Right ⌥D (506) · Top ⌥W (513) · H-centre ⌥H (520) · V-centre ⌥V (527) · Bottom ⌥S (534) · Distribute H mod+⇧⌥H (541) · Distribute V mod+⇧⌥V (548) |
| Order | Forward mod+↑ (259) · Backward mod+↓ (266) · Front mod+⇧↑ (273) · Back mod+⇧↓ (280) |
| Transform | Flip V ⇧V (246) · Flip H ⇧H (253) · Nudge arrows (315-336) · Big nudge ⇧+arrows (287-308) · Hide/show mod+⇧H (455) · Lock mod+⇧L (462) · Lock proportions ⇧L (469) |
| Selection | Next/prev Tab / ⇧Tab (778/771) · Parent ⇧Enter (785) · Escape (178) · Measure ⌥ (168) |
| View | Zoom +/= and −/_ (691/698) · 100% ⇧0 (705) · Fit ⇧1 (712) · Zoom to selection ⇧2 (719) · Zoom lens Z / ⌥Z (726/733) · Rulers mod+⇧R (557) · Guides mod+' (571) · Snap to pixel grid mod+\\ (579) · Pixel grid ⇧, (593) · Hide UI \\ (682) |
| Path edit (`data/workspace/path/shortcuts.cljs`) | Draw nodes P (52) · Delete node Del (60) · Merge mod+J (74) · Join J (81) · Separate K (88) · Corner X (96) · Curve C (103) · Snap nodes mod+' (111) · Exit Esc or V (169) · Enter (182) |

---

## 2. tldraw

Paths are under `packages/`. Since v5 the overlays draw on a 2D canvas (`tldraw/src/lib/overlays/*OverlayUtil.ts`). Every size is `N / zoom`, so handles and strokes stay the same screen size. Vertex handles use `/ Math.max(zoom, 0.25)`, so below 25% zoom they shrink with the canvas. Mouse and touch differ through `isCoarsePointer`.

| Value | Mouse (fine) | Touch (coarse) | File:line |
|---|---|---|---|
| Selection outline | 1.5 px, `selectionStroke` = `hsl(214, 84%, 56%)` (light and dark) | same | `tldraw/src/lib/overlays/SelectionForegroundOverlayUtil.ts:92`, `:315-317`; `editor/src/lib/editor/managers/ThemeManager/defaultThemes.ts:140`, `:362` |
| Resize handle | **8 px square** (`8 / zoom`), fill = canvas background (light `#f9fafb`, dark `hsl(240, 5%, 6.5%)`), stroke selection colour 1.5 px | same visual size | `SelectionForegroundOverlayUtil.ts:491`, `:327-336`; `defaultThemes.ts:133`, `:356` |
| Base hit size | 6 px (`6 / zoom`) | 6 × 1.75 = 10.5 px | `SelectionForegroundOverlayUtil.ts:498-499` |
| Side hit (half-thickness) | 6 × 0.75 = 4.5 → **9 px band** centred on the edge | 10.5 × 1.3125 ≈ 13.8 → ≈ 27.6 px band | `:500-503`, `:619-631` |
| Corner hit | half = max(hitX, hitY) × 1.5 = 6.75 → **13.5 px square** | ≈ 20.7 → ≈ 41 px square | `:267-273` |
| Rotation hit | Circle r = max(hitX, hitY) × 1.62 ≈ **7.3 px**, centred ≈ 7.3 px out from each corner on both axes | No corner rotation. A separate mobile rotate handle: r = 8/√π ≈ 4.5 px, hit r ≥ 20 px | `:284-286`, `:546-551`, `:297`, `:411` |
| Small box (handles crowd) | width or height < 32 px (4 × handle) → hit targets halve | | `:494-495`, `:501-503` |
| Tiny box | < 16 px (2 × handle) → hide the alternate corners and rotation. Both axes tiny → only one handle (bottom-right) | | `:492-493`, `:543-548`, `:560-562` |
| Hover / indicator outline | 1.5 px selection colour (2 px when hinted) | | `tldraw/src/lib/overlays/ShapeIndicatorOverlayUtil.ts:34`, `:123-129` |
| Shape hit margin | 4.5 px | 4 px | `editor/src/lib/options.ts:316-317`; `editor/src/lib/editor/Editor.ts:5889-5890` |
| Vertex handle (line, arrow) | r 4 px, fill `selectedContrast` #fff, 1.5 px stroke; hover halo r 12 px in `selectionFill` | halo/hit r 20 px; create handle r 3 | `options.ts:323-324`; `tldraw/src/lib/overlays/ShapeHandleOverlayUtil.ts:29`, `:145-146`, `:200` |
| Drag start distance | 4 px (`dragDistanceSquared 16`) | 6 px (36) | `options.ts:298-299`; `Editor.ts:11362` |
| UI (toolbar) drag distance | 4 px | 25 px | `options.ts:300-303` |
| Double-click window | 450 ms; multi-click 200 ms; long press 500 ms | | `options.ts:296-297`, `:325` |
| Snap threshold | **8 px** (`snapThreshold / zoom`) | same | `options.ts:346`; `editor/src/lib/editor/managers/SnapManager/SnapManager.ts:61` |
| Snap guide | 1 px, `snap` = `hsl(0, 76%, 60%)`; point cross ±2.5 px; gap ticks 7 px | | `tldraw/src/lib/overlays/SnapIndicatorOverlayUtil.ts:24`, `:40`, `:61`, `:123-124`; `defaultThemes.ts:139` |
| Brush (marquee) | 1 px, fill `hsl(0,0%,56%,10.2%)`, stroke `hsl(0,0%,56%,25.1%)` | | `tldraw/src/lib/overlays/BrushOverlayUtil.ts:47`; `defaultThemes.ts:142-143` |
| Edge scroll | starts within 8 px of the edge after 200 ms; speed 25 | | `options.ts:318-321` |
| Nudge | **1 / Shift 10**; grid mode: grid / grid × 5 | | `tldraw/src/lib/tools/SelectTool/childStates/Idle.ts:771-781`, `:786-788` |
| Text edit entry | Double-click on the shape (select all). **Enter** on one editable shape. Enter on groups selects their children. Double-click on empty canvas creates text (`createTextOnCanvasDoubleClick: true`) | | `Idle.ts:353`, `:387`, `:640-668`, `:709`; `options.ts:337` |

**Keyboard.** Tools are in `tldraw/src/lib/ui/hooks/useTools.tsx`: Select V (137) · Hand H (159) · Eraser E (170) · Draw D/B/X (180) · Rectangle R, Ellipse O (195) · Geo G (`actions.tsx:1860`) · Arrow A (221) · Line L (243) · Frame F (273) · Text T (295) · Media mod+U (320) · Note N (330) · Laser K (351) · Highlight ⇧D (371).

Actions are in `tldraw/src/lib/ui/context/actions.tsx`: Undo/Redo mod+Z / mod+⇧Z (582/593) · Duplicate mod+D (878) · Group (toggle) mod+G (938) · Ungroup mod+⇧G (923) · Frame selection mod+⌥G (962) · Remove frame mod+⌥⇧G (955) · Align left/h-centre/right/v-centre/top/bottom ⌥A/⌥H/⌥D/⌥V/⌥W/⌥S (985-1050) · Distribute ⌥⇧H / ⌥⇧V (1061/1077) · Flip ⇧H / ⇧V (1121/1134) · Front ] (1189) · Forward ⌥] (1201) · Backward ⌥[ (1213) · Back [ (1225) · Rotate ⇧. / ⇧, (1352/1369) · Lock ⇧L (1783) · Zoom 100% ⇧0, fit ⇧1, selection ⇧2 (1435/1449/1460) · Tool lock Q (1648). There are no boolean operations.

---

## 3. Excalidraw

Paths are under `packages/`. The overlay is a 2D canvas, and every size is `N / zoom.value`, so sizes are constant on screen. Handle size depends on the **pointer type**.

| Value | Measured | File:line |
|---|---|---|
| Transform handle size | **mouse 8 px**, pen 16 px, touch 28 px | `element/src/transformHandles.ts:49-53`, `:142-147` |
| Handle shape and paint | Rounded square, radius 2 px, fill `#fff` (themed), stroke selection colour 1 px. The rotation handle is a circle of the same diameter | `excalidraw/renderer/interactiveScene.ts:1341-1352`, `:1982` |
| Handle placement | The selection outline is padded 4 px outside the element (`DEFAULT_TRANSFORM_HANDLE_SPACING 2` × 2). Corner handles centre on the padded outline's corners | `common/src/constants.ts:280`; `interactiveScene.ts:940-944`; `transformHandles.ts:146-152` |
| Selection outline | 1 px (4 px for an active embeddable), colour `--color-selection`: light `#6965db`, dark `#b4b0ff`. Multi-user: dashed 8/4 px | `interactiveScene.ts:944-960`; `excalidraw/css/theme.scss:82`, `:227`; `excalidraw/renderer/helpers.ts:6`, `:13-16` |
| Side handles | Not drawn (`DEFAULT_OMIT_SIDES` n/s/e/w true). Sides are resized by grabbing the outline within **4 px** (`SIDE_RESIZING_THRESHOLD = 2 × 2`). Disabled on phones | `transformHandles.ts:57-62`, `:112-121`; `common/src/constants.ts:282`; `element/src/resizeTest.ts:94-125` |
| Side handles drawn (phone) only if | the box side is > 40 px (5 × mouse size) | `transformHandles.ts:218-220`, `:244` |
| Corner hit area | = the handle rect itself (8 px mouse, 28 px touch); no enlargement | `element/src/resizeTest.ts:60-90` (`isInsideTransformHandle`) |
| Rotation handle | Top centre, 16 px gap above the top handles row; same size as the handles. Hidden for frames | `transformHandles.ts:55`, `:199-212`, `:305-310` |
| Hover outline | None for ordinary shapes (only the text tool's dashed box: 1 px, alpha 0.5, dash 6/4) | `interactiveScene.ts:1476-1497`, `:1501-1530` |
| Linear point handle | r 10 px highlight in `rgba(105,101,219,0.4)` | `element/src/linearElementEditor.ts:230`; `interactiveScene.ts:195-215` |
| Snap distance | **8 px** (`SNAP_DISTANCE / zoom`) | `excalidraw/snapping.ts:41`, `:48-49` |
| Snap line | 1 px (1.5 in zen mode); light `#ff6b6b`, dark `#ff9090`, zen `#da5b5b`; point cross 2 px | `excalidraw/renderer/renderSnaps.ts:8-14`, `:33-35` |
| Drag threshold | 10 px (`DRAGGING_THRESHOLD`); line confirm 8 px; minimum arrow 20 px | `common/src/constants.ts:31-33` |
| Double-tap timeout | 300 ms; touch context menu 500 ms | `common/src/constants.ts:359-360` |
| Nudge | **1 / Shift 5**; with a grid: grid / Shift 1 | `common/src/constants.ts:34-35`; `excalidraw/components/App.tsx:5439-5446` |
| Default grid | 20 | `common/src/constants.ts:296` |
| Text edit entry | **Enter** on a selected text or text container starts editing; mod+Enter (or Enter on a line) opens the line editor; double-click on the canvas | `excalidraw/components/App.tsx:5492-5520`, `:6210` |

**Keyboard.** Tools are in `excalidraw/components/Tools.tsx` (letter / number): Hand H (72) · Selection V / 1 (77-78) · Rectangle R / 2 (83-84) · Diamond D / 3 (89-90) · Ellipse O / 4 (95-96) · Arrow A / 5 (101-102) · Line L / 6 (107-108) · Freedraw P or X / 7 (113-114) · Text T / 8 (118-119) · Sticky note N (123) · Image 9 (127) · Eraser E / 0 (131-132) · Frame F (137) · Autoshape ⇧X (141-142) · Laser K (150) · Bucket fill B (154).

Actions are in `excalidraw/actions/`: Group mod+G (`actionGroup.tsx:203`) · Ungroup mod+⇧G (`:307`) · Align top/bottom/left/right mod+⇧↑/↓/←/→ (`actionAlign.tsx:97/131/165/199`) · Distribute ⌥H / ⌥V (`actionDistribute.tsx:88/119`) · Backward mod+[ · Forward mod+] (`actionZindex.tsx:37/67`) · Back / Front mod+⌥[ / mod+⌥] on Mac, mod+⇧[ / ] elsewhere (`:96/134`) · Duplicate mod+D (`actionDuplicateSelection.tsx:118`) · Flip ⇧H / ⇧V (`actionFlip.ts:55/80`). There are no boolean operations.

---

## 4. Onlook (DOM overlay over iframes)

Paths are under `apps/web/client/src/`; the overlay folder is `app/project/[id]/_components/canvas/overlay/elements/`. Element rects are converted to fixed overlay space by multiplying by the canvas scale (`components/store/editor/overlay/utils.ts:43-70`). Handles and strokes are therefore **constant screen px**.

| Value | Measured | File:line |
|---|---|---|
| Selection (click) outline | 2 px, `colors.red[500]` = `#FA003C`; components `colors.purple[500]` = `#AE4AFF` | `…/rect/base.tsx:21`, `:49`; `…/rect/click.tsx:323`; `packages/ui/tokens.ts:27`, `:40` |
| Hover outline | 1 px, same colours | `…/rect/hover.tsx:14` |
| Corner handle | Circle, **8 px** diameter, fill white, stroke colour 1 px; one variant has a 1.5 px centre dot | `…/rect/resize.tsx:128-137`, `:236-243`, `:279` |
| Corner hit area | Invisible circle, **20 px** diameter | `resize.tsx:135`, `:235` |
| Edge handle visual | Pill 32 × 5 px, radius 3.5, white, 1 px stroke. Shown only on axes that are not auto-sized | `resize.tsx:129-133`, `:186-203`, `:489`, `:502` |
| Edge hit band | 4 px | `resize.tsx:138-140`, `:153`, `:180-182` |
| Edge double-click | 300 ms window (toggles fit) | `resize.tsx:158-164` |
| Measurement label | 40 × 20 px, radius 2, red-500 fill, white 12 px text; lines 1 px, dashed 10/6 | `…/measurement.tsx:392-456` |
| Padding labels | 10 px | `…/rect/click.tsx:168` |
| Snap guide | `bg-red-500`, max(1, 1/scale) px thick (1 px on screen), opacity 0.9, glow `0 0 4px rgba(239,68,68,0.6)` | `…/snap-guidelines.tsx:36-58` |
| Snap threshold | 12 (frames only; compared in canvas units, not divided by scale) | `components/store/editor/snap/index.ts:7-10`, `:89` |
| Move start | 10 px **and** 150 ms preparation time | `components/store/editor/move/index.ts:22-23`, `:137` |
| Text edit entry | Enter = "Edit Text"; T inserts text | `components/hotkey.ts:32-33` |
| Nudge | Not found. ⇧↑/⇧↓ move the layer in order | `components/hotkey.ts:27-28` |
| Keys | Select V · Pan H · Insert div R · Insert text T · Preview P · Code C · Group mod+G · Ungroup mod+⇧G · Duplicate mod+D · Delete ⌫/Del | `components/hotkey.ts:5-43` |

---

## 5. Grida (sampled)

Grida's newer HUD sizes are in screen px by doc comment.

| Value | Measured | File:line |
|---|---|---|
| Handle size | 8 px, fill `#ffffff`, stroke `#2563eb` | `packages/grida-canvas-hud/surface/style.ts:116-118` |
| Selection outline | 1 px `#2563eb` | `style.ts:114`, `:119` |
| Hover outline | 2 px `#60a5fa` | `style.ts:115`, `:120` |
| Corner hit | 16 px square | `packages/grida-canvas-hud/classes/transform-box/priority.ts:38` |
| Side hit | 12 px strip | `priority.ts:41` |
| Rotation ring hit | 32 px square centred on the corner (the inner 16 px scales, the surround rotates) | `priority.ts:28`; `transform-box/surface.ts:277-292` |
| Older React knob | 8 px, white, 1 px border in the accent colour (violet for component instances) | `editor/grida-canvas-react/viewport/ui/knob.tsx:16`, `:54-55` |
| Snap threshold | `ceil(5 / zoom)` ≈ **5 px**; 0.5 for keyboard nudges | `editor/grida-canvas/editor.i.ts:444-455`, `:463` |
| Snap guide colour | Workbench red (`oklch(63.7% 0.237 25.331)`) | `editor/grida-canvas-react/viewport/ui/snap.tsx:44`; `editor/grida-canvas-react/ui-config.ts:113` |
| Nudge | **1 / Shift 10** | `editor/grida-canvas/reducers/document.reducer.ts:997` |
| Tool keys | V select (816) · Q lasso (833) · H hand (839) · A or F frame (843) · R rect (851) · O ellipse (855) · Y polygon (859) · T text (863) · L line (867) · ⇧L arrow (871) · P pen (878) · ⇧P pencil (895) · ⇧H / ⇧V flip (700/705) | `editor/grida-canvas-react/viewport/hotkeys.tsx` |

---

## Consensus (screen px; constant at every zoom in all five)

| Value | Penpot | tldraw | Excalidraw (mouse) | Onlook | Grida | **Median** |
|---|---|---|---|---|---|---|
| Visible corner handle | 8 (circle) | 8 (square) | 8 (rounded square r2) | 8 (circle) | 8 | **8** |
| Handle stroke | 1 | 1.5 | 1 | 1 | (not read) | **1** |
| Handle fill | white | canvas background | white | white | white | **white / background** |
| Selection outline | 1 | 1.5 | 1 | 2 | 1 | **1** |
| Hover outline | 1 | 1.5 | none | 1 | 2 | **1–1.5** |
| Corner hit area | 20 | 13.5 | 8 | 20 | 16 | **16** |
| Side hit band | 8 | 9 | 8 (4 px each side) | 4 | 12 | **8** |
| Rotation zone | 20 square, outside the corner | r 7.3 outside the corner | top-centre knob, 16 px gap | none | 32 ring around the corner | **corner zone just outside the resize hit, ~16–20** |
| Hide or relocate handles below | ≤25 move outside, ≤10 hide corners | <32 halve hit, <16 hide alternate corners | sides need >40 | – | – | **~16–25** |
| Snap threshold | 10 | 8 | 8 | 12 (canvas) | 5 | **8** |
| Drag start | 10 | 4 (touch 6) | 10 | 10 + 150 ms | – | **4–10 (median 10)** |
| Nudge | 1 / 10 | 1 / 10 | 1 / 5 | – | 1 / 10 | **1 / Shift 10** |
| Snap colour | pink `#ff6fe0` | red `hsl(0,76%,60%)` | red `#ff6b6b` | red `#FA003C` | red | **red/pink, 1 px** |
| Text edit entry | double-click / Enter | double-click / Enter | double-click / Enter | Enter | – | **double-click and Enter** |

Touch: only tldraw (hit ×1.75, edge band ≈ 28, corner ≈ 41, no corner rotation, a separate rotate knob) and Excalidraw (handle 28 touch, 16 pen, no side resize on phones) change sizes by pointer type.

Shared tool keys: V select, R rectangle, T text, H hand, L line; frame/board F or A (Penpot B or A); E ellipse in Penpot but O in tldraw, Excalidraw and Grida; P pen/path (Penpot, Grida) or freedraw (Excalidraw); K is scale in Penpot and laser in tldraw and Excalidraw.

Shared edit keys: mod+G group, mod+D duplicate, ⇧H / ⇧V flip, ⌥A/D/W/S/H/V align (Penpot, tldraw). Order is mod+arrows in Penpot, brackets elsewhere. Only Penpot has boolean operations (mod+⌥U/D/I/E).
