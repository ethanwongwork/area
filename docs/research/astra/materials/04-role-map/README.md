**Question:** Which material role belongs to every visual part of every Area family, and what is each part’s depth relative to its parent?

**Answer:** Refreshed against current main: **101 contracts, 83 component specs, 13 roles**, including D6 `row-plate`. The generated map has **773 parts/layers** and **135 reuse bindings**; **171 nonpaint records = 18 hidden targets/labels + 153 visible layout-only receivers**. All **533 manifest classes** and **540 normalized CSS classes** are covered. Hover-plate parts share `row-plate`. Kbd's default border is transparent; Card is raised only when its shadow paints. JSON remains below 1 MB. Classification is research inference, not approval.

**Snapshot:** 2026-10-11; Area `9036ed9293beb7a867bdf637ee768c7a46a9901a`. Review `d2f9b9772677b32997dc6c0be1ea64b40cd835c8`. Current manifest/CSS/spec/React pins are in the generated table. The explanatory historical source links below retain their original snapshot; their present-day counts and D6 classification are superseded by this refresh.

<!-- task19-changes -->
## Changes after review — 2026-10-11

Task 19 corrections, with the reason from [Corrections for Astra and D1–D16](../REVIEW.md). Older Answer/Snapshot passages below retain their original date and findings unless explicitly refreshed; the changes here and decision callouts govern subsequent work.

- **C04 — Review reason:** Twenty-three newer contracts were missing. **Change:** Refreshed all manifest/CSS/spec pins to current main, reviewed relocated ranges, added 23 contracts and their reuse bindings. Current inventory: 101 contracts, 83 specs, 773 parts/layers, 135 bindings. Files: [role-map.json](role-map.json), [role-map.md](role-map.md), [assignments.py](assignments.py), [compositions.py](compositions.py), [source.py](source.py). Decisions: D6.
- **C05 — Review reason:** Table, Menu/Nav rows and hover plates had inconsistent roles. **Change:** Added row-plate as role 13, assigned all repeated state plates and explicitly named hover-plate parts consistently, and retained one primary role per part. Files: [assignments.py](assignments.py), [role-map.json](role-map.json). Decisions: D6.
- **C06 — Review reason:** Kbd and Card depth notes were wrong. **Change:** Recorded Kbd transparent default border/no shadow and conditional Card depth: raised only when its Surface shadow paints, otherwise flush. Files: [assignments.py](assignments.py), [refinements.py](refinements.py), [role-map.md](role-map.md). Decisions: D1, D2.
- **C07 — Review reason:** Nonpaint count only counted hidden targets, omitting visible layout receivers. **Change:** Counted 171 nonpaint records explicitly: 18 hidden targets/labels plus 153 visible layout-only receivers. Painted conditional shells stay separate. Files: [build.py](build.py), [role-map.json](role-map.json). Decisions: D6.

Full change ledger and verification: [19-corrections](../19-corrections/README.md).
<!-- /task19-changes -->

## Evidence and deliverables

<!-- task19-superseded 04-role-map/README.md ## Evidence -->
> **Superseded policy — D6 (owner, 2026-10-11):** The current vocabulary has 13 roles including row-plate; 04/05 now cover 101 contracts. Historical 12-role/78-contract counts below describe their original snapshot only. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

- [Readable role table](role-map.md): an index, a table for each contract, explicit reused-part lists, and the five specs that describe shared systems or recipes rather than independent manifest contracts.
- [role-map.json](role-map.json): the same normalized inventory, with `file`, one-based `line`/`end`, and one top-level immutable SHA. Every part has `role`, `parent`, `depth`, `kind` and `sources`. `alternate_role`, `depth_variants` and `note` record exceptions.
- [Curated assignments](assignments.py), [non-manifest parts](extras.py), [composition bindings](compositions.py), and [reviewed refinements](refinements.py): the editable research decisions. [build.py](build.py) produces and checks both outputs; [source.py](source.py) reads the pinned repository snapshot.

Counts come from the generated inventory, not from gallery approval status. All **533 root/element contracts** and all **540 distinct normalized Area CSS classes** are accounted for. The seven classes outside the manifest are the six syntax-ink classes and `.area-sr-only`. Inspector, Resizable Panel, Overlay, Typography and Icons add source context, not five invented component shells. Their exact spec pins and coverage are in the table’s last section.

## How to read the assignment

The assignments are **inferences about material responsibility**, grounded in source. They are not claims that the repository already has these role attributes or that a new material has been visually approved. This continues task 01’s [role/part/context distinction](../01-taxonomy/layer-model.md), adding the user-requested **edge** and **scrim** roles explicitly. It does not change the shared body, shading, texture, edge/reflection, emission and content channels.

| Primary role | Assignment rule in this report |
| --- | --- |
| page | Scene ground, presently `body`; a flush docked Panel can also act as page ground. |
| container | Groups content or provides a persistent backing. A layout-only container must not automatically gain fill or shadow. |
| floating surface | Overlay shell or its arrow continuation. An arrow is flush relative to its own shell, even though the shell floats over the page. |
| raised control | Action/choice plate. This names the material responsibility, not present elevation; Button, row controls and ghost actions can remain flat. |
| row-plate | Flat repeated-row/state backing and separate hover-plate layers; includes keyboard/active-descendant focus. Never a second paint pass on the same receiver. |
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

<!-- task19-superseded 04-role-map/README.md ## Findings -->
> **Superseded policy — D1, D2 (owner, 2026-10-11):** Area’s calm no-cast/Trace-only expression is the None default, not a material ceiling. Contrast, focus, fixed hover ink and semantic meaning remain hard limits. Material sits beside Surface; recipe structure switches with inherited 0/1 gate tokens. Surface shadows require a pixel-identical split into adjustable parts, including Tooltip/Toolbar literal exceptions. Selector-switched recipes alone are not nested-scope safe. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

1. **Do not raise everything called a control.** Button explicitly specifies no shadow on any variant. The selected Segmented item and Switch thumb actually consume `shadow-1`. Their role names alone cannot determine a uniform elevation recipe. [Button](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L319-L320), [Segmented](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L103-L111), [Switch](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L100-L109).
2. **Nested components frequently share one shell.** InputGroup removes child field chrome; DatePicker mounts Input and plain Calendar inside Popover; ColorPicker has a plain embedded mode. A material renderer would need the binding context as well as the donor role. [InputGroup](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L92), [DatePicker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L119-L140), [ColorPicker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L240-L248).
3. **Property names are not roles.** Input autofill uses a large inset shadow as fill; CodeBlock uses an inset shadow as a target marker and a border rail in forced colors; Breadcrumb draws its chevron using borders. Those are fill, indicator and glyph, respectively—not physical recess, divider and perimeter. These exceptions are manually removed from the lexical edge census. [Autofill](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L160), [target marker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L350-L356), [forced-color marker](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L73-L79), [chevron](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L41).
4. **Interaction area and paint area differ.** TreeView’s `::before` is a hover plate while `::after` is a larger invisible target. Panel’s resize target is unpainted except for its focus-only grip. Applying a material to both would change the component. [TreeView](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L63-L89), [Panel](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L312-L341).
5. **Current anatomy wins over old prose.** Accordion/AccordionItem is the current rename. TagPicker’s early anatomy still names Badge, but its later spec update and current React use Tag; the bindings follow Tag. [Accordion decision](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/accordion.md#L15-L18), [old TagPicker anatomy](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag-picker.md#L68-L76), [later correction](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag-picker.md#L203-L205), [current Tag children](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/TagPicker.tsx#L187-L232).

## Coverage, validation and limits

The build validates exact manifest root/element coverage; normalized CSS-class coverage; all domain-spec files; singular primary-role enums; local parent existence and acyclicity; donor IDs; immutable source line bounds; deterministic output; and the JSON byte cap. It does **not** prove visual polish, owner approval, rendering in every browser, or that a CSS declaration wins every cascade. The lexical selector scanner is a census aid, not a standards CSS parser. Roles and property-purpose exceptions are curated.

Invisible radios, expanded hit areas, hidden labels and the tooltip pointer bridge are retained as nonpaint records so they cannot silently acquire material. Visible layout-only receivers are now also counted explicitly as nonpaint; conditional painted shells are not silently discarded. ScrollArea now maps its Area-owned scrollbar track and thumb; the native scrollbar exclusion still applies only to OS-owned internals. Repeated options, rows, syntax spans, icons and consumer slots are templates rather than infinite per-instance records. Native OS select popups, native scrollbars and textarea resize-grip internals are **not found as Area-owned painted subparts** in the manifest or component CSS; the map marks their browser ownership rather than inventing geometry. CSS corner/radius settings change the geometry of these same parts, not their count or primary roles.

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
