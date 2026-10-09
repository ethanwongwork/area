**Question:** Which material role belongs to every visual part of every Area family, and what is each part’s depth relative to its parent?

**Answer:** The map covers all **78 manifest contracts** across **65 component specs**, plus the page and shared utilities.
It records **626 parts and paint layers**, including **15 nonpaint targets/labels**, with one primary role and a pinned source for each.
**107 composition bindings** include the reused parts of Button, Menu, Calendar, Input and other families without duplicating their paint.
Role and relief are separate: current Buttons are flat, field/track roles do not imply inset shadows, and floating shells retain their overlay role even when shadows are disabled.
Ambiguities, variant-dependent depth, semantic fills, intrinsic media and layout-only wrappers are recorded explicitly.
The readable table and **346,737-byte JSON** are research assignments, not an approved material API.

**Snapshot:** checked **2026-10-08** (America/Los_Angeles), after `git fetch origin`. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Research base: `e23dbbb061b088638bacc5702e43477cd337bdb1`. Sources: that immutable commit’s `packages/styles/src/manifest.ts`, all component CSS plus `base.css`, `inset.css`, `forced-colors.css`, all domain specs, and React composition markup where CSS alone cannot identify a part. Production reads use `git show <SHA>:<path>` rather than the research checkout’s older production files. No browser measurements or product captures were made.

## Evidence and deliverables

- [Readable role table](role-map.md): an index, a table for each contract, explicit reused-part lists, and the five specs that describe shared systems or recipes rather than independent manifest contracts.
- [role-map.json](role-map.json): the same normalized inventory, with `file`, one-based `line`/`end`, and one top-level immutable SHA. Every part has `role`, `parent`, `depth`, `kind` and `sources`. `alternate_role`, `depth_variants` and `note` record exceptions.
- [Curated assignments](assignments.py), [non-manifest parts](extras.py), [composition bindings](compositions.py), and [reviewed refinements](refinements.py): the editable research decisions. [build.py](build.py) produces and checks both outputs; [source.py](source.py) reads the pinned repository snapshot.

Counts come from the generated inventory, not from gallery approval status. All **417 root/element contracts** and all **424 distinct normalized Area CSS classes** are accounted for. The seven classes outside the manifest are the six syntax-ink classes and `.area-sr-only`. Inspector, Resizable Panel, Overlay, Typography and Icons add source context, not five invented component shells. Their exact spec pins and coverage are in the table’s last section.

## How to read the assignment

The assignments are **inferences about material responsibility**, grounded in source. They are not claims that the repository already has these role attributes or that a new material has been visually approved. This continues task 01’s [role/part/context distinction](../01-taxonomy/layer-model.md), adding the user-requested **edge** and **scrim** roles explicitly. It does not change the shared body, shading, texture, edge/reflection, emission and content channels.

| Primary role | Assignment rule in this report |
| --- | --- |
| page | Scene ground, presently `body`; a flush docked Panel can also act as page ground. |
| container | Groups content or provides a persistent backing. A layout-only container must not automatically gain fill or shadow. |
| floating surface | Overlay shell or its arrow continuation. An arrow is flush relative to its own shell, even though the shell floats over the page. |
| raised control | Action/choice plate. This names the material responsibility, not present elevation; Button, row controls and ghost actions can remain flat. |
| recessed field/track | Editable receptacle, rail, channel or selection track. Recession is optional; current flat paint is recorded as flush. |
| thumb/knob | Movable handle or grip; separate body, semantic mark and boundary when source paints them separately. |
| indicator/fill | Progress, selection, availability, color data, placeholders and other information-bearing fill. Do not substitute decorative material colors for meaning. |
| divider | Structural separation inside a group or surface. A directional rule on an exposed perimeter can instead function as an edge. |
| edge | Perimeter, ring or focus boundary; the same element’s paint, not an additional DOM wrapper or automatically an inset shadow. |
| glyph | Symbol ink and the closed-vocabulary accommodation for intrinsic icon/photo/video media. Intrinsic pixels are preserved, not recolored like an SVG icon. |
| text | Visible ink, including editable values, placeholders, numbers, captions and syntax. Nonvisual accessible text is marked `paint: none`. |
| scrim | Occlusion/readability paint: modal backdrop or a local media/code fade. It is not cast shadow or material blur. |

These are the author’s operational definitions. The source pins establish **what exists and how it paints**; they do not claim the source author named that paint with this taxonomy.

**Depth.** `depth` is a representative visual relation to `parent`: flush, raised, recessed or floating. It is not a numeric z-index, measured distance, DOM ancestry or a command to add a shadow. `depth_variants` records source-backed changes such as plain Calendar, flush Panel, selected Segmented, inline CommandPalette and collapsed CodeBlock. Modal scrims float over the host but stay behind their panel. Same-body highlights, edges and local fades are flush to their owner. No part is asserted to have a physical recess solely because it uses an inset ring or an input role.

**Parents.** A parent is the closest useful **visual group**, represented by a local part ID. `@host` is the surrounding composition and `@viewport` is the environment. This describes representative anatomy; Calendar week layout, optional headings, slot placement and consumer markup can change literal DOM ancestry. The table distinguishes a wrapper from the child that paints it. For example, `calendar.nav` is a container and its previous/next Buttons are composition bindings; `switch.loading` is beside the track, not inside the thumb. [Calendar markup](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Calendar.tsx#L229-L281), [Switch markup](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Switch.tsx#L106-L114).

**Reuse.** Each `compositions` binding enumerates donor part IDs and pins its instantiation or supported CSS composition. Follow those IDs to their roles, depths and CSS pins. A co-classed donor root aliases the existing surface; it must not paint a second one. Bindings describe conditional templates, not a promise that every optional donor slot is rendered: icon-only Buttons omit labels, ConfirmDialog omits close, DatePicker selects plain Calendar, SliderRange suppresses its two donor rails, and consumer-provided content may select fewer parts. Recursion is intentional for submenus; do not expand every potential recipe indiscriminately. The Tabs/IndicatorAnchor binding expressly avoids cycling back into another tab instance.

## Findings that matter for material absorption

1. **Do not raise everything called a control.** Button explicitly specifies no shadow on any variant. The selected Segmented item and Switch thumb actually consume `shadow-1`. Their role names alone cannot determine a uniform elevation recipe. [Button](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L319-L320), [Segmented](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L103-L111), [Switch](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L100-L109).
2. **Nested components frequently share one shell.** InputGroup removes child field chrome; DatePicker mounts Input and plain Calendar inside Popover; ColorPicker has a plain embedded mode. A material renderer would need the binding context as well as the donor role. [InputGroup](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L92), [DatePicker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L119-L140), [ColorPicker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L240-L248).
3. **Property names are not roles.** Input autofill uses a large inset shadow as fill; CodeBlock uses an inset shadow as a target marker and a border rail in forced colors; Breadcrumb draws its chevron using borders. Those are fill, indicator and glyph, respectively—not physical recess, divider and perimeter. These exceptions are manually removed from the lexical edge census. [Autofill](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L160), [target marker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L350-L356), [forced-color marker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L73-L79), [chevron](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L41).
4. **Interaction area and paint area differ.** TreeView’s `::before` is a hover plate while `::after` is a larger invisible target. Panel’s resize target is unpainted except for its focus-only grip. Applying a material to both would change the component. [TreeView](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L63-L89), [Panel](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L312-L341).
5. **Current anatomy wins over old prose.** Accordion/AccordionItem is the current rename. TagPicker’s early anatomy still names Badge, but its later spec update and current React use Tag; the bindings follow Tag. [Accordion decision](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/accordion.md#L15-L18), [old TagPicker anatomy](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag-picker.md#L68-L76), [later correction](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag-picker.md#L203-L205), [current Tag children](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/TagPicker.tsx#L187-L232).

## Coverage, validation and limits

The build validates exact manifest root/element coverage; normalized CSS-class coverage; all domain-spec files; singular primary-role enums; local parent existence and acyclicity; donor IDs; immutable source line bounds; deterministic output; and the JSON byte cap. It does **not** prove visual polish, owner approval, rendering in every browser, or that a CSS declaration wins every cascade. The lexical selector scanner is a census aid, not a standards CSS parser. Roles and property-purpose exceptions are curated.

Invisible radios, expanded hit areas, hidden labels and the tooltip pointer bridge are retained as nonpaint records so they cannot silently acquire material. Pure layout containers remain identifiable in their CSS pins and notes. Repeated options, rows, syntax spans, icons and consumer slots are templates rather than infinite per-instance records. Native OS select popups, scrollbars and textarea resize-grip internals are **not found as Area-owned painted subparts** in the manifest or component CSS; the map marks their browser ownership rather than inventing geometry. CSS corner/radius settings change the geometry of these same parts, not their count or primary roles.

Re-run after fetching the pinned commit, using Python 3 and Node with `node:module.stripTypeScriptTypes` (verified here with Node 26.7.0):

```sh
python3 docs/research/astra/materials/04-role-map/build.py --check
```

To regenerate, omit `--check`. To audit a later snapshot, change `SHA` in `source.py`, review assignments, source refinements and composition bindings against that commit, then regenerate. Never just update the SHA and assume line pins or assignments still hold. Scripts only write this topic’s generated Markdown and JSON; Python caches are ignored.

## Proposals

**Recommended:** use these role assignments as task 05’s input, preserving the part ID, parent context, conditional depth and evidence. Keep Surface’s existing border/shadow ownership: this map adds no axis or token namespace. Surface already owns `border-width`, its shadow ladder, `shadow-card` and `shadow-float`, including a Flat mode with no shadows. [Surface contract and values](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/surface.ts#L1-L81).

An alternative is to assign one material to each component root. I recommend the part map because the pinned compositions above require different treatment for their shell, nested fields, semantic color/progress fills, thumb, text and invisible targets. The table is a research input, not a proposal to add 626 runtime attributes.

## Open questions

- Should the eventual API rename the deliberately broad `raised control` and `recessed field/track` roles to avoid implying fixed relief? This report retains the requested vocabulary and records depth separately.
- Should intrinsic photos/video get a future `media` role? The requested closed vocabulary puts them under glyph or a media container, with an explicit preserve-content note.
- Which condition/slot metadata should become machine-readable for a renderer? This compact normalized map records source-backed exceptions and composition notes, but it is not an executable CSS cascade or exhaustive React prop-state matrix.
