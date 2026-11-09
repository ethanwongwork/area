# Direct editing on code-backed designs: how eight tools keep (or don't keep) code as the source

Research for Area's design interface, 2026-11-08. Read-only: no sign-ins, no accounts touched.
The question: what document model should a design in Area be, when today a layer's screen is React code
(`apps/desktop/src/content/examples`), edits are drawn as overrides (`apps/desktop/src/design-edit.ts`, logged as
`DesignChange` in `apps/desktop/src/projects.ts`) and a batch is sent to Chat for an agent to write into the source?

**Pinned sources** (shallow clones read for this note):

| Repo | Commit | Notes |
|---|---|---|
| onlook-dev/onlook | `423e2e924366419e418ee049093872d535eea41a` | web app + `packages/parser` |
| measuredco/puck | `d05542f4ddc3ade0275860cb91756dadd7ea791a` | `@puckeditor/core` 0.24.0, 2026-11-06 |
| plasmicapp/plasmic | `9ad5048494afee5ef1fc7d92fa3153c7b50ea73f` | sparse: `platform/wab/src/wab/shared/{model,codegen/react-p}` |
| penpot/penpot | `904cdd97163dc77c0d875f509ccab9ff234d7bae` (develop) | two files via `gh api` |
| BuilderIO/builder | `1d9c61408be448e6b095d7b87f9b22b9b08d74a0` | one type file via `gh api` |

Permalink form: `https://github.com/<repo>/blob/<commit>/<path>#L<n>`.

Where a statement comes from general product knowledge and was not re-checked against a page or file in this
session, it is marked *(not re-verified)*.

---

## The short answer

Of the eight, the tools that let a designer edit **reliably** (every edit applies, undoes and regenerates
the same way each time) all keep **their own tree** as the source, with code generated from it: Plasmic, Puck,
Builder's classic editor, Subframe for components, Webflow, Framer, Penpot. The tool that keeps **code** as the
source (Onlook) gets there by stamping an id on every JSX element *in the source files* and editing the AST. It
gives up everything that isn't a literal: loops, conditionals, computed text and class expressions. The tools that
send visual edits to an **agent** (Subframe's browser live edits, Builder Fusion's PR bot) are the model Area has
today. They are flexible, but edits don't apply deterministically and can't be undone once sent.

**Recommendation (detail in the last section):** make the design a **serializable tree of Area nodes**
(component key + props + named slots, layout frames on tokens, text, vector, plus an opaque **code island**). Store
it as a flat id map, edit it with **invertible operations**, and **generate JSX deterministically** for the Code
view. Migrate an existing screen once, through a Babel parse, and keep anything unparseable as a code island. The
agent then edits the tree through the same operations, not the source. In shape this is Puck's `Data` plus
Plasmic's TplTag/TplComponent/TplSlot split, Penpot's flat store and change ops, and Subframe's deterministic
codegen.

---

## 1. Onlook: code is the source, edited through the AST

**(1) Document model.** No document of its own. The source files are the document. Every JSX opening element in
the project gets a `data-oid` attribute *written into the file* when the file passes through Onlook's file system:
`packages/file-system/src/code-fs.ts#L62-L84` (`processJsxFile` → `addOidsToAst` → format → `updateMetadataForFile`).
Ids are generated, kept unique per file and per branch, and duplicates or invalid ones are re-minted:
`packages/parser/src/ids.ts#L127-L180`. An index maps each oid to a `TemplateNode` (`path`, `branchId`,
`startTag`/`endTag` line and column, `component`, `dynamicType`, `coreElementType`):
`packages/models/src/element/templateNode.ts#L3-L21`. `DynamicType` is `array | conditional | unknown`:
`packages/models/src/element/layers.ts#L1-L5`.

**(2) Code ↔ canvas.** The app runs in a sandbox iframe with an injected preload script (root layout gets
`injectPreloadScript`). DOM nodes carry `data-oid`, so a click maps to an oid and so to a file location. Component
*instances* have no DOM node of their own (`<Child data-oid="instance"/>` renders only Child's inner oids), so
Onlook infers instance locations by walking the DOM's parents and matching child index and component name in the
parent's AST: `apps/web/client/src/components/store/editor/ast/README.md`.
Edits are typed **actions** (`update-style`, `insert-element`, `remove-element`, `move-element`, `edit-text`,
`group/ungroup-elements`, `write-code`, `insert/remove-image`): `packages/models/src/actions/action.ts`. The code
manager turns actions into per-file `CodeDiffRequest`s keyed by oid. `transformAst` traverses each file and, for a
matching oid, sets attributes, text and structure changes: `packages/parser/src/code-edit/transform.ts#L17-L84`.
- **Style → Tailwind.** CSS changes become a rule string, are translated by `CssToTailwindTranslator`, and are merged into
  `className` with `tailwind-merge`: `apps/web/client/src/components/store/editor/code/tailwind.ts#L6-L58`. In the AST, a
  string `className` is merged; a `cn(...)`-style call gets the new classes *appended as another argument*; anything
  else is left alone: `packages/parser/src/code-edit/style.ts#L6-L24`.
- **Props.** `updateNodeProp` writes booleans and strings as literals. Anything else becomes `t.identifier(value.toString())`, and
  a function becomes an empty arrow: `style.ts#L46-L93`.
- **Text.** `updateNodeTextContent` replaces the first `JSXText`. Multi-line text replaces *all children* with text +
  `<br/>`: `packages/parser/src/code-edit/text.ts`.
- **Move.** This is a reorder within one parent's JSX children: splice out, splice in at the target index, and add a `key`:
  `packages/parser/src/code-edit/move.ts`.
- **Insert.** This is append, prepend or index, from attributes or a pasted code block (ids stripped and re-minted):
  `packages/parser/src/code-edit/insert.ts#L10-L60`.

**(3) Insert.** There is no component library panel in this version. Insert modes are `insert-text | insert-div |
insert-image` (`packages/models/src/editor/index.ts#L14-L18`): you draw a box or text on the canvas, or drop an image.
Components come in through AI chat or paste.

**(4) Move in flex.** Drag uses a **stub**: a grey `div` sized from the dragged element's computed width, height,
margin, padding and radius. The stub is inserted at the computed index. Direction comes from the parent (`flex` row →
horizontal; `grid` has its own index finder): `apps/web/preload/script/api/elements/move/stub.ts#L9-L60`. Drag starts
after 150 ms and 10 px (`move/index.ts#L20-L23`). **Absolutely positioned elements can't be dragged**:
`apps/web/client/src/components/store/editor/move/index.ts#L93-L97`.

**(5) Text in place.** `contentEditable` in the iframe, then an `edit-text` action. The guard message is "Can't edit
text because it's not plain text. Edit in code or use AI." (`.../editor/text/index.ts#L33`). At this commit the
preload check `isChildTextEditable` is stubbed to `return true`
(`apps/web/preload/script/api/elements/text.ts#L117-L119`).

**(6) Undo.** This is an action history with inverses: `HistoryManager` keeps undo/redo stacks, and transactions batch
actions during a drag. Each push **writes code immediately** (`this.editorEngine.code.write(action)`):
`apps/web/client/src/components/store/editor/history/index.ts#L23-L140`. Undo computes a reversed action
(`history/helpers.ts`: `reverse(change)` swaps original and updated; move swaps `index` and `originalIndex`) and
writes that back to code.

**(7) Gave up.**
- Source files are permanently polluted with `data-oid`.
- Elements inside `.map()` or conditionals are `DynamicType` and can't be deleted (`element/index.ts#L177-L200`).
- Computed `className` expressions get extra args rather than real edits.
- Non-literal props become bare identifiers.
- There is no notion of a design-system *component's* props beyond attributes.
- Tailwind is assumed.
- Absolute drag is off.
- Every edit is a file write, so undo is a second file write. This fits apps, not a component-first design document.

## 2. Plasmic: its own tree, code generated from it

**(1) Document model.** A typed object graph with a schema DSL: `platform/wab/src/wab/shared/model/model-schema.ts`.
- `TplNode` (`#L352-L382`) has `uuid`, `parent`, `locked` and `vsettings: [VariantSetting]`, with three kinds:
  - **`TplTag`**: `tag`, `children: [TplNode]`, `type: 'text'|'image'|'column'|'columns'|'other'`, and `codeGenType:
    auto|alwaysTag|noTag`. The last one decides whether a text node emits a wrapper or a bare string.
  - **`TplComponent`**: a weak ref to a `Component`.
  - **`TplSlot`**: a `SlotParam` plus `defaultContents: [TplNode]`.
- **`VariantSetting`** (`#L505-L515`) holds everything that varies per variant: `variants`, `args: [Arg]` (prop values),
  `attrs`, `rs: RuleSet` (static styles that become classes), `dataCond`, `dataRep` (repeat), `text: RichText`. So
  styles, props, text and visibility are all **per variant combination** (base, hover, screen sizes, component variants).
- **`Arg`** = `param` + `expr` (`#L604-L606`). Slot contents are an `Arg` whose expr is **`RenderExpr { tpl: [TplNode] }`**
  (`#L611-L613`). Props on an instance are `Arg`s against the component's `Param`s.
- **`Component`** (`#L436-L476`) has `params`, `states`, `tplTree`, `variants`, `variantGroups`, `pageMeta`,
  `codeComponentMeta` and `type: plain|page|code|frame`. Code components are `Component`s with
  `codeComponentMeta` (`importPath`, `defaultExport`, `classNameProp`, `refProp`, `defaultSlotContents` …;
  `#L405-L430`).
- **Text** is `RichText = RawText { text, markers: [StyleMarker|NodeMarker] } | ExprText` (`#L536-L542`).
- **Tokens:** a style value can be a `StyleTokenRef` (`#L634-L635`).

**(2) Code ↔ tree.** It is one way, tree → code.
- **Codegen** (`plasmic sync`) generates React for each component. The default scheme is **`"blackbox"`**
  (`codegen/react-p/index.ts#L414`): a `Plasmic<Name>` presentational file that is overwritten on every sync, plus a
  wrapper the developer owns. A `plain` scheme also exists (`codegen/react-p/plain.ts`). Serializers walk the tree per
  node kind: `serializeTplTagBase` (`#L1655`), `serializeTplComponentBase` (`#L2073`), `serializeTplSlotBase` (`#L2367`).
  Docs: <https://docs.plasmic.app/learn/codegen-guide/> ("sync updates down to your code at any time without losing
  your changes").
- **Loader / Headless API**: "No Plasmic-generated code is checked into your git repo." The app fetches and renders the
  published tree: <https://docs.plasmic.app/learn/loader-vs-codegen/>.
- **Code components** are registered from the host app with `registerComponent(Component, { name, props, importPath,
  … })`. Prop types include `slot` (with `defaultValue` as element JSON such as `{type:'text', value:'Click me!'}`,
  `allowedComponents`, `isRepeated`), `choice` (= enum) and `class`. Studio renders the real component in the app host.
  Styling is limited to the `styleSections` and `class` props you expose. Docs:
  <https://docs.plasmic.app/learn/code-components-ref/>.

**(3) Insert.** "Insert…" button, shortcut **Q**, with search. Click adds, or drag onto the canvas
(<https://docs.plasmic.app/learn/customizable-components-overview/>, <https://docs.plasmic.app/learn/custom-fonts/>).

**(4) Move.** Drag on the canvas or in the outline; stacks are flex *(not re-verified)*.

**(5) Text.** Double-click text tags to edit `RawText` in place. Per-range styles are `StyleMarker`s.

**(6) Undo.** The model is observable and changes are recorded per transaction (`shared/model/tracking.ts`; studio
undo lives outside the sparse checkout) *(not re-verified)*.

**(7) Gave up.**
- No round trip: editing generated `Plasmic*` code is lost on the next sync.
- Developers attach behaviour through wrappers and overrides.
- The model is large (variants × args × rulesets) and can only be edited by Studio.

## 3. Subframe: design-system components synced, pages exported; live edits go to an agent

**(1) Document model.** An HTML/CSS canvas, "first-class support for React and Tailwind" (<https://docs.subframe.com/>).
- **Elements:** text, stacks, icons, images, dividers.
- **Components** with variants, states (hover, active, focus), subcomponents and **props: Text/Number, Icon, Image, Slot**.
  A slot is a stack marked **Slot**, and an instance's slot is edited via "Edit X layers" or by double-clicking:
  <https://docs.subframe.com/design/components/props-and-slots.md>.
- **Stacks** = flexbox (direction vertical, horizontal or wrap; gap px or fill; alignment):
  <https://docs.subframe.com/design/design-mode/working-with-stacks.md>.

**(2) Code.**
- "Subframe generates React code deterministically, with no LLM involved." Anything that can't be expressed as code
  can't be done in Subframe. Styling is Tailwind with a generated theme of named tokens. Behaviour comes from
  `@subframe/core` (headless, Radix): <https://docs.subframe.com/develop/concepts/code-generation.md>.
- **"Components are synced, pages are exported."** `npx @subframe/cli sync --all` writes each component as a generated
  file you don't edit plus an `index.tsx` wrapper you own (`// @subframe/sync-disable` to skip).
- **"Sync is one-way from Subframe to your codebase."** Pages are exported through MCP (an agent fetches the page and
  integrates it) or copy-paste, with `// TODO` stubs. After shipping, "the code is the source of truth" for pages:
  <https://docs.subframe.com/develop/concepts/syncing-components.md>,
  <https://docs.subframe.com/develop/concepts/design-to-code.md>.
- **Browser live edits** (desktop app) are Area's current model. You Inspect your running local app, change props, styles,
  classes or content, and edits accumulate with a change count. You "review the changes in the toolbar … then send them to
  your agent" (Agent chat or Copy prompt). They are discarded with the trash icon. Edits don't write files directly:
  <https://docs.subframe.com/browser/making-live-edits.md>.

**(3) Insert.**
- **Quick insert:** hover a selection edge, click +, search, and the element is "inserted in the direction you clicked".
  The keyboard equivalents are Ctrl+I/K/J/L for above, below, left and right.
- **Insert panel:** search, with Basic, Components and Snippets sections. You drag from it.
- **Insert tools:** F for stack, T for text. Click to place; "a line shows where the element will land".
- Source: <https://docs.subframe.com/design/design-mode/adding-elements.md>.

**(4) Move.** Within stacks, with the line indicator. Cmd+G wraps in a stack.

**(5) Text.** The T tool "drops you straight into editing"; double-click to edit existing text.

**(6) Undo.** Version history in the editor (<https://docs.subframe.com/design/projects/version-history.md>). Live edits
can't be undone once sent (the page doesn't say otherwise).

**(7) Gave up.**
- Code is never read back, and pages and code diverge after export.
- Live edits on real code rely on an agent, so they aren't deterministic.
- Only Subframe's own components can be authored. Importing an existing design system is a separate flow
  (`design/components/importing.md`).

## 4. Webflow: DOM + classes, Navigator = the HTML tree

**(1) Document model.** An element tree that *is* the HTML DOM (Navigator), plus **styles = classes**. A class has a type
of `global | combo | tag | element | descendant`, and properties scoped by `breakpoint` (xxl → tiny), `pseudo` (hover,
focus …) and component `variantId`. Values can be CSS strings or Variables. Elements reference styles, and an element
can reference several: <https://developers.webflow.com/designer/reference/styles-overview>.
**Components** (formerly Symbols) have **properties** (text, rich text, image, link, video, number, visibility,
variants) and **slots**: <https://help.webflow.com/hc/en-us/articles/33961303934611>,
<https://help.webflow.com/hc/en-us/articles/33961219350547>.

**(2) Code.**
- The Designer *is* the source. It publishes HTML/CSS to Webflow hosting.
- **DevLink export** turns components into React ("fully typed React props"; slot → `React.ReactNode`), with the
  header "This file is generated by DevLink from a Webflow component. Manual edits are discouraged."
  (<https://developers.webflow.com/devlink/docs/component-export/design-guidelines/props-slots>).
- **Code components** go the other way: React wrapped with `declareComponent` and `props.Slot(...)`, imported as a shared
  library. "Each one mounts in its own Shadow DOM container with a separate React root"; they "can't share React Context
  or state directly":
  <https://developers.webflow.com/code-components/reference/prop-types/slot.md>,
  <https://developers.webflow.com/code-components/component-architecture.md>.

**(3) Insert.** Add panel: drag onto the canvas or into the Navigator, or click to add relative to the selection
*(not re-verified)*.

**(4) Move.** Drag in the Navigator to reorder siblings or nest; moving a parent moves its children
(<https://university.webflow.com/lesson/navigator>). Drag on the canvas with a blue placement line *(not re-verified)*.

**(5) Text.** Double-click to edit in place *(not re-verified)*.

**(6) Undo.** Designer history *(not re-verified)*.

**(7) Gave up.**
- No React source of truth: export is one way, and code components are sandboxed islands whose internals aren't editable.
- The class model creates the familiar combo-class sprawl.

## 5. Framer: frames and stacks, code components and overrides

**(1) Document model.** Layers are **frames** (fixed or relative), **stacks** and **grids** (layout on a frame), text,
graphics (vectors) and components with variants. A stack has `stackDirection: horizontal|vertical` and
`stackDistribution: start|center|end|space-between|space-around|space-evenly` (plugin API:
<https://www.framer.com/developers/reference/plugins-traits-stack-direction>,
<https://www.framer.com/developers/reference/plugins-traits-stack-distribution>). That is flexbox under other names,
with gap and padding. Stack variables expose layout as component controls
(<https://www.framer.com/academy/lessons/stack-variables>).

**(2) Code.**
- **Code components** are React files written in Framer's code editor that "render directly on the canvas". Props are exposed
  with `addPropertyControls` (`ControlType.Enum`, `ComponentInstance` (an outlet that links other frames), `Array`,
  `Padding`, `Gap` …): <https://www.framer.com/developers/components/introduction>,
  <https://www.framer.com/developers/property-controls>.
- **Overrides** are HOCs attached to canvas layers. They are "only active in the preview and on your published site":
  <https://www.framer.com/developers/overrides/introduction>.
- There is no general React export of the canvas; Framer hosts the site *(not re-verified)*.

**(3)–(6).** Insert panel (search, drag or click), drag reordering in stacks with an indicator, double-click text, and
standard undo *(not re-verified)*.

**(7) Gave up.**
- Canvas → code: designs never become your repo's React.
- Code enters only as leaf components or as overrides that don't run on the canvas.

## 6. Paper (paper.design): HTML/CSS-native canvas

**(1) Model.** "Paper renders actual HTML and CSS". The site says "What you design is real HTML/CSS, and what you code
appears on the canvas" (<https://paper.design/llms.txt>). Layout is flex: the docs recommend "using flex layouts and
containers so that the agent can easily understand the layout". Tokens and themes exist (`/docs/tokens`).
- **Paste:** HTML can be pasted "as editable layers" (`/docs/paste`).
- **SVG:** an SVG holds layers and paths that you can select and restyle, plus Pen-tool path editing. Creating shapes
  from scratch and boolean operations are still on the roadmap (<https://paper.design/docs/svg>).

**(2) Code.** Mostly through the **MCP server**, which "supports both reading and writing to your files"
(<https://paper.design/docs/mcp>). Tool names reported by third parties, not by Paper's docs: `get_jsx` (Tailwind
JSX), `write_html`, `get_screenshot`.

**(3)–(6).** Not documented publicly in enough detail.

**(7) Gave up.**
- There's no confirmed component/instance or design-system-props model in the public docs.
- Code is a translation done by an agent, not a deterministic export of your components.

## 7. Penpot: SVG/CSS-native, flat object store, change ops

**(1) Model.**
- Shape types `#{:frame :group :bool :rect :path :text :circle :svg-raw :image}`:
  `common/src/app/common/types/shape.cljc#L71-L80`.
- Shapes are stored **flat**: an objects map keyed by uuid, each object with `:parent-id`, `:frame-id` and `:shapes` (child
  ids) (`shape.cljc#L180-L181`, `#L360`).
- Layout attributes on frames mirror CSS (`:layout :layout-flex-dir :layout-gap :layout-align-items
  :layout-justify-content :layout-wrap-type :layout-padding :layout-grid-columns :layout-grid-rows`, `#L606-L610`).
  Children carry layout-item attributes (margin, sizing, absolute).
- Components are main/copy shapes with `:component-id` (`#L267`).
- Docs: Flex Layout properties are "the same properties that you can use with CSS Flexbox". Absolute "will exclude the
  element from the Flex layout flow". Grid uses `grid-column`/`grid-row`. Reorder by dragging or with the Up/Down keys:
  <https://help.penpot.app/user-guide/designing/flexible-layouts/>.

**(2) Code.** Inspect › Code shows **CSS plus HTML and SVG markup**, read-only (<https://help.penpot.app/user-guide/inspect/>).
There is no React and no import from code.

**(6) Undo.** Every edit is a vector of **changes** with a matching vector of undo changes. The ops include `:add-obj`
(`common/src/app/common/files/changes.cljc#L664`), `:mod-obj` (`#L699`), `:reorder-children` (`#L730`), `:del-obj`
(`#L736`) and `:mov-objects` (`#L811`). The same ops sync to the server and to collaborators.

**(7) Gave up.**
- Not code-backed: code is an inspection output.
- Text is its own rich-text tree, not HTML.

## 8. Builder.io (Visual Editor, Fusion) and Puck

### Builder.io

- **Classic Visual Editor:** content is a JSON tree of **`BuilderBlock`**s (`'@type'`, `id`, `tagName`,
  `children?: BuilderBlock[]`, `responsiveStyles: {large, medium, small, xsmall}`, `component?: { name, options }`,
  `bindings`, `repeat`, `animations`): `packages/sdks/src/types/builder-block.ts#L31-L80` (pinned above).
  - Your components are registered with `Builder.registerComponent(Comp, { name, inputs: [...] })`. "A prop is editable
    only if it has an input."
  - "Builder does not retain or store your components in any way". Content renders at runtime with
    `<Content customComponents>`: <https://www.builder.io/c/docs/custom-components-setup>.
  - The tree is the source, and code never sees it except as data.
- **Fusion / Projects:** Builder clones your repo, runs the dev server and opens a visual editor over it. "Changes made in
  Code mode automatically sync with Design and Interact modes." Output is a **git PR**, and follow-ups go through a bot on
  the PR: <https://www.builder.io/c/docs/fusion-toolbar>, <https://builder.io/c/docs/fusion-create-a-pull-request>. How
  visual edits reach source isn't documented; AI-mediated *(not re-verified)*.

### Puck (the most relevant to Area)

**(1) Document model.** `Data = { root, content: Content, zones? }`. `Content` is an array of
`ComponentData = { type, props }`, and `props` includes `id`. Each slot is **an array of ComponentData stored inline
as a prop**: `packages/core/types/Data.tsx#L29-L80`. `zones` is the legacy DropZone store keyed
`"<componentId>:<zone>"`, "soon … deprecated" in favour of slot fields
(`apps/docs/pages/docs/api-reference/data-model/data.mdx`,
<https://puckeditor.com/docs/guides/migrations/dropzones-to-slots>). Example:

```json
{ "root": { "props": { "title": "Page" } },
  "content": [{ "type": "Grid", "props": { "id": "Grid-1",
    "items": [{ "type": "HeadingBlock", "props": { "id": "Heading-1", "title": "Hello" } }] } }] }
```

Internally Puck **flattens** the nested data into indexes: `nodes: Record<id, {data, flatData, parentId, zone, path}>`
and `zones: Record<"id:slot", {contentIds, type: root|dropzone|slot}>` (`packages/core/types/Internal.tsx#L8-L32`). The
slot renderer reads `indexes.zones[`${componentId}:${zone}`].contentIds` (`components/SlotRender/index.tsx`).

**Config.** Each component has `render`, `fields`, `defaultProps`, `resolveData`/`resolveFields`, `permissions` and `inline`
(render without a wrapper, giving `puck.dragRef`) (`types/Config.tsx#L48-L70`). Field types: text, richtext, number,
textarea, select, radio, checkbox, array, object, external, custom, and **`slot { allow?, disallow? }`**
(`types/Fields.ts#L180-L203`).
- `render: ({ items: Items }) => <Items allow={["HeadingBlock"]} />`. A slot is converted to a component before render.
  Its props are `as`, `className`, `style`, `allow`, `disallow`, `collisionAxis`, `minEmptyHeight` (default 128 px):
  <https://puckeditor.com/docs/api-reference/fields/slot>.

**(2) Code.**
- Puck renders **real React components from JSON**: `<Puck config data>` to edit, `<Render config data>` to display.
- There is no JSX export or import. `migrate()` upgrades legacy payloads, and `transformProps()` rewrites a component's
  props across a payload for schema migrations (`api-reference/functions/`, `integrating-puck/data-migration.mdx`).

**(3) Insert.**
- The component list in the left drawer is grouped by categories (collapsible), with per-type `insert` permission
  (`components/ComponentList/index.tsx`).
- Insert is **drag only**. The reducer `insert` builds `{ type, props: { ...defaultProps, id } }`, populates slot ids and
  splices it into `destinationZone` at `destinationIndex` (`reducer/actions/insert.ts`).

**(4) Move.**
- Dragging uses dnd-kit 0.4 with a custom collision engine (`lib/dnd/collision/{directional,dynamic}`, `nearest-gap.ts`).
  A drag writes a `Preview { componentType, index, zone, props, type: "insert"|"move", element, linePlaceholder? }`.
- `linePlaceholder` means "Render a thin line at the insertion point instead of the full item, preventing layout shift."
  Otherwise the real item is previewed in place (`components/DropZone/context.tsx#L29-L45`).
- The collision axis comes from the parent layout: grid → `dynamic`, flex row and inline → `x`, else `y` (slot docs).

**(5) Text.** `contentEditable: true` on `text`, `textarea` or `richtext` fields makes the rendered prop editable on the
canvas. The prop becomes a ReactNode inside `<Puck>` but not inside `<Render>` (`api-reference/fields/text.mdx#L72-L77`,
`integrating-puck/rich-text-editing.mdx`).

**(6) Undo.** **Whole-state snapshots**. `history.record` is debounced 250 ms, and each record pushes
`{ state, id }` and truncates the future: `packages/core/store/slices/history.ts#L60-L80`. `setHistories` and
`setHistoryIndex` let a host persist or restore history.

**(7) Gave up.**
- No code: the JSON is the source, and devs own only the component implementations.
- No free layout or vectors: layout is whatever your components render.
- Slots in the outline ignore render-time `allow`.

---

## Comparison

| | Source of truth | Node model | Code ↔ model | Insert | Reorder indicator | Text in place | Undo | Main cost |
|---|---|---|---|---|---|---|---|---|
| **Onlook** | Source files + `data-oid` written into them | JSX elements; DOM↔oid index | Babel AST edits per action; CSS→Tailwind | Draw div, text or image; AI | Grey stub sized like the element; absolute off | contentEditable → JSXText; plain text only | Reversible actions; each writes code | Dynamic JSX not editable; ids in source; Tailwind-only |
| **Plasmic** | Own model (TplNode graph) | TplTag / TplComponent / TplSlot; per-variant VariantSetting (args, rs, text) | One way: codegen (blackbox + wrapper) or loader; code components registered | Q menu, search, click or drag | Canvas or outline *(n.r.)* | RawText + style markers | Model transactions *(n.r.)* | No round trip; heavy model |
| **Subframe** | Own model; components synced, pages exported | Elements, stacks, components (Text, Icon, Image, Slot props) | Deterministic React + Tailwind; one way; live edits → agent | Quick insert on selection edges, search panel, F/T tools | Line | T tool; double-click | Version history; sent live edits not undoable | Pages diverge; code never read back |
| **Webflow** | Own DOM + class store | HTML tree + classes (breakpoint, pseudo, variant) + components (props, slots) | Publishes HTML/CSS; DevLink export; code components in Shadow DOM | Add panel, drag or click | Navigator + canvas line | Double-click | Designer history | Not React; class sprawl; code islands sealed |
| **Framer** | Own canvas | Frames + stack/grid layout + components; code components; overrides | No repo export; code components render on canvas; overrides preview-only | Insert panel | Stack indicator *(n.r.)* | Double-click | Standard *(n.r.)* | No code out |
| **Paper** | Own HTML/CSS canvas | HTML/CSS nodes; flex; SVG | Agent via MCP (read/write) | — | — | — | — | No component-props model documented |
| **Penpot** | Own file (flat objects) | frame, group, bool, rect, path, text, circle, svg-raw, image; flex/grid attrs = CSS | Inspect: CSS + HTML/SVG, read-only | Toolbar/library *(n.r.)* | Drag or Up/Down | Rich-text tree | Change ops + undo-changes | Not code-backed |
| **Builder classic** | JSON BuilderBlock tree | `component{name, options}`, children, responsiveStyles | Runtime render with registered components | Insert tab | *(n.r.)* | *(n.r.)* | *(n.r.)* | Code never sees content |
| **Builder Fusion** | Your repo | Your code | Visual/AI edits → git PR | — | — | — | Git | AI-mediated, PR-shaped |
| **Puck** | JSON `Data` | `{type, props{id, …, slot: ComponentData[]}}`; flat indexes internally | Renders real React from JSON; no JSX in or out | Drawer, categories, drag | dnd-kit; full preview or `linePlaceholder`; axis from parent layout | `contentEditable` on text fields | Debounced whole-state snapshots | No code view; no free layout |

---

## Recommendation for Area

### What the survey says about the choice

1. **Code-as-source with AST write-back (Onlook) fits screens, not a design document.** It works only where the JSX is
   literal: no `.map`, no conditionals, no computed props. It also needs an id *in the source* to find anything. Area's
   example screens are hand-written React with real logic, so a large share of nodes would be read-only. Area's current
   path-of-child-indices (`DesignChange.path`) has the same weakness, without the oid: the path breaks as soon as an
   insert or move happens before it.
2. **Overrides sent to an agent (Area today; Subframe live edits; Builder Fusion) can't be the model for direct
   editing.** The agent may write something different from what was drawn, nothing is undoable after sending, and
   the Code view can't be truthful until the agent has run. It is good as a *handoff* step, not as the document.
3. **Every tool with reliable direct editing owns a tree.** The ones closest to Area's shape are **Puck**
   (`{type, props, slots-as-arrays}` rendered by real components) and **Plasmic** (TplComponent with Args, where a slot
   Arg is a `RenderExpr` of nodes, beside TplTag for plain elements and text). **Subframe** shows that codegen from such
   a tree can be deterministic and clean enough to be the Code view.

### Ranked models

**1. Recommended: an Area node tree as source, deterministic JSX out, a one-time import in.**

```ts
type Id = string;                                     // stable, minted once; never a path
interface DesignDoc { version: 1; system: string; root: Id; nodes: Record<Id, Node> }   // flat, like Penpot / Puck's indexes
type Node = ComponentNode | FrameNode | TextNode | VectorNode | CodeNode;
interface Base { id: Id; parent: Id | null; name?: string; hidden?: boolean; locked?: boolean }

interface ComponentNode extends Base {                // Plasmic TplComponent / Puck ComponentData
  kind: "component";
  key: string;                                        // manifest key: "button", "date-picker"
  props: Record<string, PropValue>;                   // only the manifest's props: variant, tone, size …
  slots: Record<string, Id[]>;                        // named slots; "children" is the default slot
}
interface FrameNode extends Base {                    // layout box = flex/grid, Framer stack, Penpot frame
  kind: "frame";
  layout: { mode: "stack" | "grid" | "free"; direction?: "row" | "column"; wrap?: boolean;
            gap?: Value; padding?: Value | [Value, Value, Value, Value]; align?: string; justify?: string;
            columns?: string };
  size?: { width?: Sizing; height?: Sizing };         // fixed (token or px) | hug | fill
  fill?: Value; radius?: Value; position?: { x: number; y: number }; // position only under mode "free"
  children: Id[];
}
interface TextNode extends Base { kind: "text"; text: string | Run[]; style?: string /* type token */; ink?: Value }
interface VectorNode extends Base { kind: "vector"; glyph?: string /* Area Glyph */; svg?: string; size?: Value }
interface CodeNode extends Base {                     // Onlook's DynamicType, Plasmic's code component
  kind: "code"; source: string; imports: string[]; slots?: Record<string, Id[]>;
}

type Value = { token: string } | { raw: string };    // { token: "space-12" } → var(--area-space-12); raw is flagged
type PropValue = string | number | boolean | Value | { node: Id };   // e.g. an icon prop pointing at a vector node
```

- **Props are typed by the manifest** (`@area/styles/manifest`, as `design-edit.ts` already reads it). The manifest also
  declares which props are text (a Button's label) for in-place editing, and which are slots. This is Puck's `fields` and
  Plasmic's `registerComponent` props, sourced from Area's own manifests instead of a second registration.
- **Values are token refs, not CSS strings.** The Inspector stays on the system's scale, codegen emits
  `var(--area-…)`, and `raw` is the visible "off the scale" escape the current inspector already flags.
- **Store flat, export nested.** Ids make every op addressable (no path indices) and make move and reorder cheap,
  following Penpot's `:mov-objects` and Puck's `indexes`. A nested JSON view (`toNested`) is for export and diffing.
- **Edit with invertible ops**, each with its inverse, grouped into transactions (a drag, a typing burst), as Penpot
  does with changes and undo-changes and Onlook with reversible actions. Ops:
  - `insert(node, parent, slot, index)`
  - `remove(id)`
  - `move(id, parent, slot, index)`
  - `setProp(id, key, value)`
  - `setLayout(id, patch)`
  - `setText(id, text)`
  - `wrap(ids, frame)` / `unwrap(id)`

  Undo and redo apply inverses. The op log *is* the change log Area already keeps (`DesignChange`), now with ids
  instead of paths. Puck's 250 ms snapshot history is simpler but can't be shown as a list of changes or sent anywhere.
- **Codegen is deterministic** (Subframe's rule: no LLM). Each node kind has one serializer, as Plasmic does:
  - component → `<Button variant="primary" size="sm">…</Button>`, imported from `@area/react`;
  - frame → one Area layout primitive (a Stack, if the system has or gets one; see GOVERNANCE before adding it), or
    a `div` with token styles;
  - text → bare string, or a text element when styled (Plasmic's `codeGenType: auto`);
  - vector → `<Glyph name=…/>` or inline SVG;
  - code → its `source` verbatim, with its slots spliced in.

  Ids are emitted only in canvas render mode (as `data-area-id`) and never in the Code view's output. That avoids
  Onlook's source pollution.
- **Import from an existing React screen** happens once and goes through Babel (the parser Onlook uses):
  - A JSX element whose tag is an Area component with literal props → `ComponentNode`. Its literal children →
    `slots.children`; named slot props given JSX → `slots[name]`.
  - A `div` or Stack whose styles are flex/grid on tokens → `FrameNode`.
  - `JSXText` → `TextNode`; `<Glyph>` or `<svg>` → `VectorNode`.
  - **Everything else** (`.map`, `&&`, ternaries, hooks-derived values, spreads, unknown components) → a
    `CodeNode` that keeps its source, renders on the canvas and selects as one unit, editable only as code or by the
    agent. JSX children inside a code island that are themselves literal can become slots, so a `.map` row template
    stays editable. This plays the role of Onlook's `DynamicType` flag but stays editable around it.
- **Round trip is guaranteed only one way:** tree → JSX. Re-importing edited JSX is the same importer. A diff of
  importer output vs tree shows what an outside edit changed. The agent works on the tree with the same ops, offered to
  it as tools, so its edits are deterministic, undoable and visible in the Code view at once.

**2. Hybrid, if existing screens must stay hand-owned code.** The tree as above for new designs. For a screen that
stays code, edit it Onlook-style: ids added to the JSX (better as a build-time Babel plugin on the *rendered* copy
than written into the source), with deterministic AST edits for literal props, text and order. Dynamic nodes are
read-only. This costs two editing paths and two undo stacks.

**3. Code as source (Onlook).** Use it only if Area's designs are meant to *be* app code with logic. Expect a large
read-only fraction, and accept ids in source files.

**4. Overrides + agent (today's model).** Keep it only as the *handoff*: once a design (model 1) is ready, send its
generated JSX or op log to the agent to integrate into an app. Don't use it as the editing model.

### Interaction patterns worth taking, from the survey

- **Insert.** Use a searchable panel (components, frames, text, Glyph). A click inserts after the selection, or into the
  selected frame's slot at its end, as with Subframe's quick insert (including the edge "+" with a direction) and
  Plasmic's Q menu. Drag is for precise placement. Puck's drag-only drawer is weaker on keyboards and trackpads.
- **Reorder in flex.** Take the axis from the parent's layout (Puck: flex row → x, column → y, grid → dynamic). Draw a
  **line placeholder** by default to avoid layout shift (Puck `linePlaceholder`; Subframe's line), optionally a full
  in-place preview (Puck) or a sized stub (Onlook). Up/Down keys reorder (Penpot). Absolute children are excluded from
  flow (Penpot) rather than refused (Onlook).
- **Text in place.** Double-click a text node or a manifest text prop and edit with `contentEditable`, as Puck's
  `contentEditable` fields do. Commit one `setText` op per editing session (Onlook's transaction). Text inside a code
  island isn't editable (Onlook's "not plain text" rule).
- **Slots.** Let a manifest constrain a slot with `allow`/`disallow` (Puck, Plasmic `allowedComponents`), and show an
  empty slot as a drop target with a minimum height (Puck's `minEmptyHeight`, Webflow's `isEmptySlot` fallback).

### What this costs Area

- **The examples stop being the canvas's source.** A screen becomes a design doc that generates its JSX. Existing
  examples can be imported, and code islands keep what doesn't map.
- **A frame primitive must be chosen.** Either a layout component in the system (intake and governance question) or a
  `div` with token styles emitted by codegen.
- **Variants and states aren't covered by this model.** Plasmic's per-variant `VariantSetting` is the precedent if a design
  needs per-breakpoint or per-state values. Leave it out until asked: Area's light/dark and settings are system axes,
  not design variants.

## Sources

Docs:
- Plasmic: https://docs.plasmic.app/learn/codegen-guide/ · https://docs.plasmic.app/learn/loader-vs-codegen/ ·
  https://docs.plasmic.app/learn/code-components-ref/ · https://docs.plasmic.app/learn/customizable-components-overview/
- Subframe: https://docs.subframe.com/ · https://docs.subframe.com/develop/concepts/code-generation.md ·
  https://docs.subframe.com/develop/concepts/syncing-components.md · https://docs.subframe.com/develop/concepts/design-to-code.md ·
  https://docs.subframe.com/browser/making-live-edits.md · https://docs.subframe.com/design/design-mode/adding-elements.md ·
  https://docs.subframe.com/design/design-mode/working-with-stacks.md · https://docs.subframe.com/design/components/props-and-slots.md
- Webflow: https://developers.webflow.com/designer/reference/styles-overview ·
  https://developers.webflow.com/devlink/docs/component-export/design-guidelines/props-slots ·
  https://developers.webflow.com/code-components/reference/prop-types/slot.md ·
  https://developers.webflow.com/code-components/component-architecture.md · https://university.webflow.com/lesson/navigator ·
  https://help.webflow.com/hc/en-us/articles/33961303934611
- Framer: https://www.framer.com/developers/components/introduction · https://www.framer.com/developers/property-controls ·
  https://www.framer.com/developers/overrides/introduction · https://www.framer.com/developers/reference/plugins-traits-stack-direction ·
  https://www.framer.com/developers/reference/plugins-traits-stack-distribution · https://www.framer.com/academy/lessons/stack-variables
- Paper: https://paper.design/llms.txt · https://paper.design/docs/mcp · https://paper.design/docs/svg
- Penpot: https://help.penpot.app/user-guide/designing/flexible-layouts/ · https://help.penpot.app/user-guide/inspect/
- Builder: https://www.builder.io/c/docs/custom-components-setup · https://www.builder.io/c/docs/fusion-toolbar ·
  https://builder.io/c/docs/fusion-create-a-pull-request
- Puck: https://puckeditor.com/docs/api-reference/fields/slot · https://puckeditor.com/docs/guides/migrations/dropzones-to-slots

Source files (at the commits in the table at the top):
- Onlook:
  - `packages/parser/src/ids.ts`
  - `packages/parser/src/code-edit/{transform,style,text,move,insert}.ts`
  - `packages/models/src/actions/action.ts`
  - `packages/models/src/element/{templateNode,layers}.ts`
  - `packages/file-system/src/code-fs.ts`
  - `apps/web/client/src/components/store/editor/{ast/README.md,history/index.ts,history/helpers.ts,code/tailwind.ts,move/index.ts,text/index.ts,element/index.ts}`
  - `apps/web/preload/script/api/elements/{move/stub.ts,text.ts}`
- Plasmic:
  - `platform/wab/src/wab/shared/model/model-schema.ts`
  - `platform/wab/src/wab/shared/codegen/react-p/{index.ts,plain.ts}`
- Puck:
  - `packages/core/types/{Data.tsx,Internal.tsx,Config.tsx,Fields.ts}`
  - `packages/core/store/slices/history.ts`
  - `packages/core/reducer/actions/insert.ts`
  - `packages/core/components/{DropZone/context.tsx,SlotRender/index.tsx,ComponentList/index.tsx}`
  - `apps/docs/pages/docs/**`
- Penpot:
  - `common/src/app/common/types/shape.cljc`
  - `common/src/app/common/files/changes.cljc`
- Builder:
  - `packages/sdks/src/types/builder-block.ts`
- Area (for context):
  - `apps/desktop/src/design-edit.ts`
  - `apps/desktop/src/projects.ts` (`DesignChange`)
